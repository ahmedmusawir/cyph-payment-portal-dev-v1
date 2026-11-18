// APBM007A — Stripe webhook processing (BILL-01 "Durable events and fulfillment", AC-012, AC-014, AC-015; F-Q1-01).
// Order: verify the signature over the raw bytes → record the event ID → retrieve the current object from Stripe →
// apply an idempotent transition → mark processed. Only finished work is acknowledged with 2xx:
//   processed  — the transition for this event has been applied (or provably needs nothing more);
//   ignored    — an unsupported type, or an object that trusted evidence shows is not this application's.
// Anything unfinished (no mapping yet, operation busy, payment not yet settled, provider/database failure) stays
// visible as `failed` with a reason and answers non-2xx, so Stripe retries; the operator command recovers it after
// Stripe stops (see recoverEvent). There is no background worker, so no unfinished event is ever answered 2xx.
import type Stripe from 'stripe';
import { admin, rpc } from '@/server/db';
import { logServer } from '@/server/errors';
import { advanceStoreOperation } from '@/server/storeOperations';
import { advanceOperation, type AdvanceResult } from '@/server/provisioning';
import { ENV_TAG, idOf, mirrorPayload, RUN_TAG } from '@/server/stripeMirror';
import { stripe, stripeCall, stripeNames } from '@/server/stripeClient';

export const HANDLED_EVENTS = [
  'checkout.session.completed', 'checkout.session.expired', 'invoice.paid', 'invoice.payment_failed',
  'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted',
] as const;

/** What one attempt established for an event. Only `processed` and `ignored` are final. */
export type Disposition =
  | { kind: 'processed'; note: string; operationId?: string }
  | { kind: 'ignored'; code: 'unsupported' | 'foreign' | 'foreign_environment' | 'no_subscription' }
  | { kind: 'retry'; code: 'awaiting_mapping' | 'busy' | 'awaiting_settlement'; operationId?: string };

interface EventRow { event_id: string; type: string; status: string; error_code: string | null; attempts: number; operation_id: string | null; processed_at: string | null }
const ROW = 'event_id,type,status,error_code,attempts,operation_id,processed_at';

/** A row is final when it is processed, or ignored for a reason other than the pre-repair "unmapped" (F-Q1-01). */
export const isFinal = (r: Pick<EventRow, 'status' | 'error_code'>): boolean =>
  r.status === 'processed' || (r.status === 'ignored' && r.error_code !== 'unmapped');

/**
 * Rows finalised before the F-Q1-01 repair that may not have completed: an unmapped supported event recorded as
 * ignored, or a subscription event that reached an operation (the only path where "busy" was recorded as processed).
 * Re-running them is safe because every transition is idempotent.
 */
export const isSuspect = (r: Pick<EventRow, 'status' | 'error_code' | 'type' | 'operation_id'>): boolean =>
  (r.status === 'ignored' && r.error_code === 'unmapped')
  || (r.status === 'processed' && r.type.startsWith('customer.subscription.') && !!r.operation_id && r.error_code === null);

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

  // Durable receipt first. A duplicate of a FINISHED event answers 2xx with no second action; a duplicate of an
  // unfinished one is processed again, because the first delivery did not complete it.
  const object = event.data.object as { id?: string };
  const ins = await admin().from('stripe_events').insert({
    event_id: event.id, type: event.type, livemode: event.livemode, stripe_account: account ?? null,
    event_created: new Date(event.created * 1000).toISOString(), object_id: object.id ?? null,
  });
  if (ins.error && ins.error.code !== '23505') return { status: 500, body: { error: 'receipt_failed' } };
  let prior: EventRow | null = null;
  if (ins.error) {
    const r = await admin().from('stripe_events').select(ROW).eq('event_id', event.id).maybeSingle();
    if (r.error) return { status: 500, body: { error: 'receipt_failed' } };
    prior = r.data as EventRow | null;
    if (prior && isFinal(prior)) return { status: 200, body: { result: 'duplicate' } };
  }

  try {
    const d = await decide(event);
    await record(event.id, prior, d, 'webhook');
    if (d.kind === 'retry') return { status: 503, body: { error: 'not_finished' } };
    return { status: 200, body: { result: d.kind === 'processed' ? d.note : 'ignored' } };
  } catch (e) {
    logServer(`webhook ${event.type}`, e);
    await markUnfinished(event.id, codeOf(e)).catch((err) => logServer('webhook mark', err));
    return { status: 500, body: { error: 'processing_failed' } };   // never acknowledge an unapplied transition
  }
}

const codeOf = (e: unknown): string => String((e as { code?: string })?.code ?? 'error').slice(0, 60);

/** Record an attempt. A final row is never moved back to unfinished, and a final row that changes is audited first. */
async function record(eventId: string, before: EventRow | null, d: Disposition, via: 'webhook' | 'recovery'): Promise<void> {
  if (d.kind === 'retry') { await markUnfinished(eventId, d.code, d.operationId); return; }
  if (before?.status === 'processed' && d.kind === 'ignored') return;   // an ignored result never replaces a processed row
  const recovered = !!before && (before.status === 'ignored' || before.status === 'processed');
  const patch = {
    status: d.kind, processed_at: new Date().toISOString(),
    operation_id: d.kind === 'processed' ? d.operationId ?? null : null,
    // A processed row normally has no code. A recovered one keeps its earlier disposition here as well as in the audit row.
    error_code: d.kind === 'ignored' ? d.code : recovered && before ? `recovered_from_${before.status}${before.error_code ? `_${before.error_code}` : ''}`.slice(0, 60) : null,
  };
  if (recovered) {
    // History first: if the audit row cannot be written, the event stays as it was and the attempt is retried.
    const a = await admin().from('audit_logs').insert({
      actor_user_id: null, actor_role: 'service_role', business_id: null, table_name: 'stripe_events', row_id: eventId, action: 'update',
      old_data: before, new_data: patch, context: { fn: 'stripe_event_recovery', via, run: RUN_TAG },
    });
    if (a.error) throw Object.assign(new Error(`audit ${a.error.code}`), { code: 'audit_failed' });
  }
  const q = admin().from('stripe_events').update(patch).eq('event_id', eventId);
  // A concurrent delivery may have finished the row meanwhile; an ignored result must not overwrite that.
  const r = await (d.kind === 'processed' ? q : q.neq('status', 'processed'));
  if (r.error) throw new Error(`event finish ${r.error.code}`);
}

/** Unfinished: visible, counted, and retryable. Never overwrites a row another delivery has already finished. */
async function markUnfinished(eventId: string, code: string, operationId?: string): Promise<void> {
  const cur = await admin().from('stripe_events').select('attempts').eq('event_id', eventId).maybeSingle();
  const r = await admin().from('stripe_events')
    .update({ status: 'failed', attempts: ((cur.data as { attempts?: number } | null)?.attempts ?? 0) + 1, error_code: code, ...(operationId ? { operation_id: operationId } : {}) })
    .eq('event_id', eventId).neq('status', 'processed');
  if (r.error) throw new Error(`event mark ${r.error.code}`);
}

async function operationBy(column: 'stripe_checkout_session_id' | 'stripe_subscription_id' | 'stripe_customer_id', value: string | null): Promise<string | null> {
  if (!value) return null;
  const r = await admin().from('checkout_operations').select('id').eq(column, value).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (r.error) throw new Error(`operation lookup ${r.error.code}`);
  return (r.data as { id: string } | null)?.id ?? null;
}

/** An advance result, as this event's disposition. `completes`: the event itself says payment is complete. */
function fromAdvance(r: AdvanceResult, operationId: string, completes: boolean): Disposition {
  if (r === 'busy') return { kind: 'retry', code: 'busy', operationId };              // another worker holds it; this event is not done
  if (r === 'unknown') return { kind: 'retry', code: 'awaiting_mapping', operationId };
  if (r === 'pending' && completes) return { kind: 'retry', code: 'awaiting_settlement', operationId };
  return { kind: 'processed', note: r, operationId };
}

/** Every branch re-reads the object from Stripe; the event payload is only a pointer. */
export async function decide(event: Stripe.Event): Promise<Disposition> {
  if (!(HANDLED_EVENTS as readonly string[]).includes(event.type)) return { kind: 'ignored', code: 'unsupported' };
  const s = stripe();
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const operationId = await operationBy('stripe_checkout_session_id', session.id);
      if (!operationId) return classifyUnmapped({ sessionId: session.id });
      return fromAdvance(await advanceOperation(operationId), operationId, event.type === 'checkout.session.completed');
    }
    case 'invoice.paid':
    case 'invoice.payment_failed': {
      const pointer = event.data.object as Stripe.Invoice;
      const invoice = await stripeCall('invoice read', () => s.invoices.retrieve(pointer.id!));
      const details = invoice.parent?.subscription_details;
      const subscriptionId = idOf(details?.subscription as string | { id: string } | null | undefined);
      const customerId = idOf(invoice.customer as string | { id: string } | null);
      // APBM-007B: an Add Store invoice is found by its unique invoice→operation mapping first (BILLING.md webhook order).
      const storeOp = await storeOperationForInvoice(invoice.id!);
      if (storeOp) {
        const r = await advanceStoreOperation(storeOp);
        if (r === 'busy') return { kind: 'retry', code: 'busy' };
        return { kind: 'processed', note: `store_${r}` };
      }
      if (!subscriptionId) {
        // A standalone invoice carrying our Add Store marker but not yet mapped stays retryable (mapping is saved before
        // collection, so this is a short race); anything else is not ours to apply.
        if (invoice.metadata?.apbm_kind === 'store_add') return { kind: 'retry', code: 'awaiting_mapping' };
        return { kind: 'ignored', code: 'no_subscription' };
      }
      const evidence = { subscriptionId, customerId, metadata: [details?.metadata] };
      if (invoice.billing_reason === 'subscription_create') {
        // First payment: provisioning is decided by the operation, from authoritative facts. A failed first invoice provisions nothing.
        const operationId = (await operationBy('stripe_subscription_id', subscriptionId)) ?? (await operationBy('stripe_customer_id', customerId));
        if (!operationId) return classifyUnmapped(evidence);
        return fromAdvance(await advanceOperation(operationId), operationId, event.type === 'invoice.paid');
      }
      const known = await mirror(subscriptionId);
      if (known === 'unknown_subscription') return classifyUnmapped(evidence);
      // APBM-007B: only a renewal (subscription_cycle) invoice can start or clear grace. Any other subscription invoice
      // (e.g. subscription_update) updates the mirror only; latest_invoice open/void is never delinquency by itself.
      if (invoice.billing_reason !== 'subscription_cycle') return { kind: 'processed', note: 'mirror_only' };
      // Grace follows the invoice's CURRENT state, so a late failure event for an invoice that has since been paid opens nothing.
      if (invoice.status === 'paid') {
        await rpc<string>('subscription_grace_clear', { p_stripe_subscription_id: subscriptionId, p_invoice: invoice.id });
        await rpc<number>('notice_suppress_for_invoice', { p_invoice: invoice.id, p_reason: 'renewal_paid' });
      } else if (invoice.status === 'open' && invoice.attempted) {
        // Grace starts at the invoice's own failure time in the provider timeline (a test clock's time on SCRATCH),
        // never at worker processing time; retries of the same invoice never move it.
        const failedAt = invoice.status_transitions?.finalized_at ?? invoice.created;
        const started = await rpc<string>('subscription_grace_start', { p_stripe_subscription_id: subscriptionId, p_invoice: invoice.id, p_failed_at: new Date(failedAt * 1000).toISOString() });
        const graceStart = await admin().from('subscriptions').select('grace_started_at,grace_invoice_id').eq('stripe_subscription_id', subscriptionId).maybeSingle();
        const g = graceStart.data as { grace_started_at: string | null; grace_invoice_id: string | null } | null;
        if (g?.grace_started_at && g.grace_invoice_id === invoice.id) {
          await rpc<string>('notice_schedule_for_failure', { p_stripe_subscription_id: subscriptionId, p_invoice: invoice.id, p_grace_started: g.grace_started_at, p_amount_due: invoice.amount_due });
        }
        void started;
      }
      return { kind: 'processed', note: 'renewal' };
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const pointer = event.data.object as Stripe.Subscription;
      const { result, sub } = await mirrorRead(pointer.id);
      if (result !== 'unknown_subscription') return { kind: 'processed', note: result };
      // Not mirrored yet: it may belong to an operation that is still provisioning.
      const customerId = idOf(sub.customer as string | { id: string });
      const operationId = (await operationBy('stripe_subscription_id', sub.id)) ?? (await operationBy('stripe_customer_id', customerId));
      if (!operationId) return classifyUnmapped({ subscriptionId: sub.id, customerId, metadata: [sub.metadata] });
      return fromAdvance(await advanceOperation(operationId), operationId, false);
    }
    default:
      return { kind: 'ignored', code: 'unsupported' };
  }
}

// APBM-007B: the 007A deferred renewal_reminder record is superseded by the notice ledger (migration 0065,
// src/server/billingNotices.ts); legacy pending rows are suppressed with history kept.

type Metadata = Record<string, string> | null | undefined;
interface Evidence { sessionId?: string; subscriptionId?: string | null; customerId?: string | null; metadata?: Metadata[] }

/**
 * A supported event whose object has no mapping in this database. A missing mapping alone never makes an object
 * foreign. Trusted evidence decides, read on the server:
 *   1. this database knows the customer or subscription (operation, billing mapping or mirror) → ours, retry;
 *   2. an object Stripe returns to our secret key carries this application's marker, which checkout writes on the
 *      customer, the session and the subscription at creation → ours, retry; unless every marker names another
 *      database (a different environment sharing the sandbox) → foreign_environment;
 *   3. no database link and no marker on the session, subscription or customer → foreign.
 */
export async function classifyUnmapped(e: Evidence): Promise<Disposition> {
  const s = stripe();
  const metadata: Metadata[] = [...(e.metadata ?? [])];
  let customerId = e.customerId ?? null;
  if (e.sessionId) {
    const session = await stripeCall('session read', () => s.checkout.sessions.retrieve(e.sessionId!));
    metadata.push(session.metadata);
    customerId ??= idOf(session.customer as string | { id: string } | null);
  }
  if (await knownToDatabase(customerId, e.subscriptionId ?? null)) return { kind: 'retry', code: 'awaiting_mapping' };
  if (customerId) {
    const customer = await stripeCall('customer read', () => s.customers.retrieve(customerId!));
    if (!(customer as { deleted?: boolean }).deleted) metadata.push((customer as Stripe.Customer).metadata);
  }
  const markers = metadata.filter((m): m is Record<string, string> => !!m && m.apbm_run === RUN_TAG);
  if (!markers.length) return { kind: 'ignored', code: 'foreign' };
  const ours = ENV_TAG();
  if (markers.every((m) => m.apbm_db && m.apbm_db !== ours)) return { kind: 'ignored', code: 'foreign_environment' };
  return { kind: 'retry', code: 'awaiting_mapping' };   // ours (or marked without an environment): wait for the mapping
}

async function knownToDatabase(customerId: string | null, subscriptionId: string | null): Promise<boolean> {
  const hit = async (table: string, column: string, value: string | null) => {
    if (!value) return false;
    const r = await admin().from(table).select(column).eq(column, value).limit(1).maybeSingle();
    if (r.error) throw new Error(`mapping lookup ${r.error.code}`);
    return !!r.data;
  };
  return (await hit('billing_customers', 'stripe_customer_id', customerId)) || (await hit('subscriptions', 'stripe_subscription_id', subscriptionId))
    || (await hit('checkout_operations', 'stripe_customer_id', customerId)) || (await hit('checkout_operations', 'stripe_subscription_id', subscriptionId));
}

/**
 * Operator recovery for ONE exact event the ledger has recorded (AC-038, F-Q1-01): an unfinished event after Stripe
 * stopped retrying, or a suspect pre-repair row. The event is retrieved from Stripe with our secret key (Stripe keeps
 * events for 30 days) and runs through the same idempotent decision as a delivery. A changed final row is audited
 * with its earlier state before it is updated; nothing is deleted or reset.
 */
export async function recoverEvent(eventId: string) {
  if (!/^evt_[A-Za-z0-9]+$/.test(eventId)) return { result: 'invalid_id' as const };
  const r = await admin().from('stripe_events').select(ROW).eq('event_id', eventId).maybeSingle();
  if (r.error) throw new Error(`event read ${r.error.code}`);
  const before = r.data as EventRow | null;
  if (!before) return { result: 'unknown_event' as const };
  if (isFinal(before) && !isSuspect(before)) return { result: 'already_final' as const, before };
  const event = await stripeCall('event read', () => stripe().events.retrieve(eventId));
  const account = (event as { account?: string }).account;
  if (event.livemode || (account && account !== stripeNames().expectedAccount) || event.type !== before.type) return { result: 'refused' as const, before };
  let d: Disposition;
  try {
    d = await decide(event);
    await record(eventId, before, d, 'recovery');
  } catch (e) {
    logServer('event recovery', e);
    await markUnfinished(eventId, codeOf(e)).catch(() => undefined);
    throw e;
  }
  const after = await admin().from('stripe_events').select(ROW).eq('event_id', eventId).maybeSingle();
  return { result: d.kind, reason: d.kind === 'processed' ? d.note : d.code, before, after: after.data as EventRow | null };
}

/** Safe facts only: event and object IDs, type, state and reason. */
export async function listUnfinishedEvents() {
  const open = await admin().from('stripe_events').select(ROW).in('status', ['received', 'failed']).order('received_at', { ascending: true }).limit(200);
  if (open.error) throw new Error(`events read ${open.error.code}`);
  const finals = await admin().from('stripe_events').select(ROW).in('status', ['ignored', 'processed']).order('received_at', { ascending: true }).limit(1000);
  if (finals.error) throw new Error(`events read ${finals.error.code}`);
  return { unfinished: open.data as EventRow[], suspect: (finals.data as EventRow[]).filter(isSuspect) };
}

/** Read the subscription now and apply it under the read time. Older reads and revivals are refused in SQL. */
async function mirrorRead(subscriptionId: string): Promise<{ result: 'applied' | 'stale' | 'unknown_subscription'; sub: Stripe.Subscription }> {
  const readAt = new Date();
  const sub = await stripeCall('subscription read', () => stripe().subscriptions.retrieve(subscriptionId, { expand: ['latest_invoice'] }));
  const p = mirrorPayload(sub, readAt);
  const result = await rpc<'applied' | 'stale' | 'unknown_subscription'>('subscription_mirror_apply', { p_stripe_subscription_id: subscriptionId, p, p_verified_at: p.verified_at });
  return { result, sub };
}
export async function mirror(subscriptionId: string): Promise<'applied' | 'stale' | 'unknown_subscription'> {
  return (await mirrorRead(subscriptionId)).result;
}

/** APBM-007B: the Add Store operation that owns this invoice, by the unique mapping saved before collection. */
async function storeOperationForInvoice(invoiceId: string): Promise<string | null> {
  const r = await admin().from('provider_invoice_operations').select('operation_id').eq('invoice_id', invoiceId).maybeSingle();
  if (r.error) throw new Error(`store invoice lookup ${r.error.code}`);
  return (r.data as { operation_id: string } | null)?.operation_id ?? null;
}
