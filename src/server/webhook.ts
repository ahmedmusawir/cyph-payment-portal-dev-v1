// APBM007A — Stripe webhook processing (BILL-01 "Durable events and fulfillment", AC-012, AC-014, AC-015).
// Order: verify the signature over the raw bytes → record the event ID → retrieve the current object from Stripe →
// apply an idempotent transition → mark processed. An unresolved failure answers non-2xx so that Stripe retries.
import type Stripe from 'stripe';
import { admin, rpc } from '@/server/db';
import { logServer } from '@/server/errors';
import { advanceOperation } from '@/server/provisioning';
import { idOf, mirrorPayload } from '@/server/stripeMirror';
import { stripe, stripeCall, stripeNames } from '@/server/stripeClient';

export const HANDLED_EVENTS = [
  'checkout.session.completed', 'checkout.session.expired', 'invoice.paid', 'invoice.payment_failed',
  'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted',
] as const;
type Outcome = { operationId?: string; note?: string };

export async function handleStripeWebhook(rawBody: string, signature: string | null): Promise<{ status: number; body: Record<string, string> }> {
  let event: Stripe.Event;
  try {
    if (!signature) throw new Error('no signature');
    event = stripe().webhooks.constructEvent(rawBody, signature, stripeNames().webhookSecret);
  } catch {
    return { status: 400, body: { error: 'invalid_signature' } };   // wrong secret, mutated bytes or stale timestamp
  }
  if (event.livemode) return { status: 400, body: { error: 'wrong_mode' } };
  const account = (event as { account?: string }).account;
  if (account && account !== stripeNames().expectedAccount) return { status: 400, body: { error: 'wrong_account' } };

  // Durable receipt first. A duplicate of a finished event answers 2xx with no second action.
  const object = event.data.object as { id?: string };
  const ins = await admin().from('stripe_events').insert({
    event_id: event.id, type: event.type, livemode: event.livemode, stripe_account: account ?? null,
    event_created: new Date(event.created * 1000).toISOString(), object_id: object.id ?? null,
  });
  if (ins.error && ins.error.code !== '23505') return { status: 500, body: { error: 'receipt_failed' } };
  if (ins.error) {
    const prior = await admin().from('stripe_events').select('status').eq('event_id', event.id).maybeSingle();
    if (prior.error) return { status: 500, body: { error: 'receipt_failed' } };
    if (prior.data && (prior.data.status === 'processed' || prior.data.status === 'ignored')) return { status: 200, body: { result: 'duplicate' } };
  }

  try {
    if (!(HANDLED_EVENTS as readonly string[]).includes(event.type)) {
      await finish(event.id, 'ignored', {});
      return { status: 200, body: { result: 'ignored' } };
    }
    const outcome = await apply(event);
    await finish(event.id, outcome.note === 'unmapped' ? 'ignored' : 'processed', outcome);
    return { status: 200, body: { result: outcome.note ?? 'processed' } };
  } catch (e) {
    logServer(`webhook ${event.type}`, e);
    const cur = await admin().from('stripe_events').select('attempts').eq('event_id', event.id).maybeSingle();
    await admin().from('stripe_events').update({ status: 'failed', attempts: (cur.data?.attempts ?? 0) + 1, error_code: codeOf(e) }).eq('event_id', event.id);
    return { status: 500, body: { error: 'processing_failed' } };   // never acknowledge an unapplied transition
  }
}

const codeOf = (e: unknown): string => String((e as { code?: string; detail?: string })?.code ?? 'error').slice(0, 60);

async function finish(eventId: string, status: 'processed' | 'ignored', o: Outcome): Promise<void> {
  const r = await admin().from('stripe_events').update({ status, processed_at: new Date().toISOString(), operation_id: o.operationId ?? null, error_code: o.note === 'unmapped' ? 'unmapped' : null }).eq('event_id', eventId);
  if (r.error) throw new Error(`event finish ${r.error.code}`);
}

async function operationBy(column: 'stripe_checkout_session_id' | 'stripe_subscription_id' | 'stripe_customer_id', value: string | null): Promise<string | null> {
  if (!value) return null;
  const r = await admin().from('checkout_operations').select('id').eq(column, value).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (r.error) throw new Error(`operation lookup ${r.error.code}`);
  return r.data?.id ?? null;
}

/** Every branch re-reads the object from Stripe; the event payload is only a pointer. */
async function apply(event: Stripe.Event): Promise<Outcome> {
  const s = stripe();
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const operationId = (await operationBy('stripe_checkout_session_id', session.id));
      if (!operationId) return { note: 'unmapped' };
      const r = await advanceOperation(operationId);
      if (r === 'busy') throw Object.assign(new Error('operation busy'), { code: 'busy' });   // retry later rather than lose it
      return { operationId, note: r };
    }
    case 'invoice.paid':
    case 'invoice.payment_failed': {
      const pointer = event.data.object as Stripe.Invoice;
      const invoice = await stripeCall('invoice read', () => s.invoices.retrieve(pointer.id!));
      const subscriptionId = idOf(invoice.parent?.subscription_details?.subscription as string | { id: string } | null | undefined);
      if (!subscriptionId) return { note: 'unmapped' };
      if (invoice.billing_reason === 'subscription_create') {
        // First payment: provisioning is decided by the operation, from authoritative facts. A failed first invoice provisions nothing.
        const operationId = (await operationBy('stripe_subscription_id', subscriptionId)) ?? (await operationBy('stripe_customer_id', idOf(invoice.customer as string)));
        if (!operationId) return { note: 'unmapped' };
        const r = await advanceOperation(operationId);
        if (r === 'busy') throw Object.assign(new Error('operation busy'), { code: 'busy' });
        return { operationId, note: r };
      }
      const known = await mirror(subscriptionId);
      if (known === 'unknown_subscription') return { note: 'unmapped' };
      // Grace follows the invoice's CURRENT state, so a late failure event for an invoice that has since been paid opens nothing.
      if (invoice.status === 'paid') {
        await rpc<string>('subscription_grace_clear', { p_stripe_subscription_id: subscriptionId, p_invoice: invoice.id });
      } else if (invoice.status === 'open' && invoice.attempted) {
        await rpc<string>('subscription_grace_start', { p_stripe_subscription_id: subscriptionId, p_invoice: invoice.id, p_failed_at: new Date(event.created * 1000).toISOString() });
      }
      return { note: 'renewal' };
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const pointer = event.data.object as Stripe.Subscription;
      const result = await mirror(pointer.id);
      if (result !== 'unknown_subscription') return { note: result };
      // Not mirrored yet: it may belong to an operation that is still provisioning.
      const operationId = (await operationBy('stripe_subscription_id', pointer.id)) ?? (await operationBy('stripe_customer_id', idOf(pointer.customer as string)));
      if (!operationId) return { note: 'unmapped' };
      const r = await advanceOperation(operationId);
      return { operationId, note: r === 'busy' ? 'pending' : r };
    }
    default:
      return { note: 'ignored' };
  }
}

/** Read the subscription now and apply it under the read time. Older reads and revivals are refused in SQL. */
export async function mirror(subscriptionId: string): Promise<'applied' | 'stale' | 'unknown_subscription'> {
  const readAt = new Date();
  const sub = await stripeCall('subscription read', () => stripe().subscriptions.retrieve(subscriptionId, { expand: ['latest_invoice'] }));
  const p = mirrorPayload(sub, readAt);
  return rpc<'applied' | 'stale' | 'unknown_subscription'>('subscription_mirror_apply', { p_stripe_subscription_id: subscriptionId, p, p_verified_at: p.verified_at });
}
