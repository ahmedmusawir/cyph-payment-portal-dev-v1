// APBM-007B — typed operator commands (CONTRACTS/LIFECYCLE_AND_TRANSFER.md "Implemented operator actions", BP-04/05;
// API_ROLE_MATRIX W3/W4). Exact UUIDs only; dry-run by default; apply requires actor, reason and ticket. Every call —
// dry run, refusal, failure, success — is appended to public.operator_actions with authenticated_as='shared_operator_v1'
// and the separately DECLARED actor (the shared credential proves possession, not individual identity). No free SQL,
// no amounts, no outcomes chosen by the operator, no refunds, no prefix/wildcard targets.
import type Stripe from 'stripe';
import { admin, rpc } from '@/server/db';
import { stripe, stripeCall, assertStripeAccount } from '@/server/stripeClient';
import { advanceStoreOperation, loadStoreOperation } from '@/server/storeOperations';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const OPERATOR_ACTIONS = ['quantity-check', 'store-operation-reconcile', 'store-operation-close', 'store-transfer-authorize', 'store-transfer-complete',
  'store-transfer-cancel', 'owner-replace', 'store-admin-set', 'removed-store-reactivate'] as const;
export type OperatorAction = (typeof OPERATOR_ACTIONS)[number];
export interface OperatorRequest { action: OperatorAction; apply?: boolean; actor?: string; reason?: string; ticket?: string; [k: string]: unknown }
type Result = { action: string; phase: 'dry_run' | 'apply'; result: 'planned' | 'applied' | 'refused' | 'failed'; target: Record<string, unknown>; before?: unknown; after?: unknown; error?: string; auditId?: number };

const need = (r: OperatorRequest, k: string) => { const v = r[k]; if (typeof v !== 'string' || !UUID.test(v)) throw new Refusal(`${k}_required_exact_uuid`); return v; };
class Refusal extends Error {}

async function record(r: OperatorRequest, res: Result): Promise<Result> {
  const id = await rpc<number>('operator_action_record', { p_action: r.action, p_actor: r.actor ?? 'unspecified', p_reason: r.reason ?? 'dry run', p_ticket: r.ticket ?? 'DRY-RUN',
    p_phase: res.phase, p_target: res.target, p_before: res.before ?? null, p_after: res.after ?? null, p_result: res.result, p_error: res.error ?? null });
  return { ...res, auditId: Number(id) };
}

async function accountBilling(accountId: string) {
  const s = await admin().from('subscriptions').select('stripe_customer_id,stripe_subscription_id,quantity,status').eq('account_id', accountId).eq('origin', 'stripe').neq('status', 'canceled').order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (s.error || !s.data) throw new Refusal('no_stripe_subscription');
  const billable = await rpc<number>('account_billable_count', { p_account: accountId });
  const sub = await stripeCall('subscription read', () => stripe().subscriptions.retrieve(s.data!.stripe_subscription_id as string));
  return { sub, billable, mirror: s.data };
}
/** Absolute provider quantity = SQL billable count, no proration. Safe to repeat; refuses to go below 1. */
async function syncQuantity(accountId: string, key: string): Promise<{ before: number; after: number }> {
  const { sub, billable } = await accountBilling(accountId);
  const item = sub.items.data[0]; const before = item.quantity ?? 0;
  if (billable < 1) throw new Refusal('billable_below_one');
  if (before !== billable) await stripeCall('subscription quantity', () => stripe().subscriptions.update(sub.id, { items: [{ id: item.id, quantity: billable }], proration_behavior: 'none' }, { idempotencyKey: `${key}:qty:${billable}` }));
  const after = (await stripeCall('subscription read', () => stripe().subscriptions.retrieve(sub.id))).items.data[0].quantity ?? 0;
  await admin().from('subscriptions').update({ quantity: after }).eq('stripe_subscription_id', sub.id);
  return { before, after };
}

/** Provider proof that a paid operation's invoice was fully refunded or credited (BP-04). Never issues anything. */
async function refundProof(invoiceId: string): Promise<{ paid: number; refunded: number; credited: number; currency: string }> {
  const s = stripe();
  const inv = await stripeCall('invoice read', () => s.invoices.retrieve(invoiceId, { expand: ['payments'] }));
  let refunded = 0;
  for (const p of inv.payments?.data ?? []) {
    const pi = p.payment?.payment_intent; if (!pi) continue;
    const list = await stripeCall('refunds list', () => s.refunds.list({ payment_intent: typeof pi === 'string' ? pi : (pi as Stripe.PaymentIntent).id, limit: 100 }));
    refunded += list.data.filter((x) => x.status === 'succeeded' && x.currency === inv.currency).reduce((a, x) => a + x.amount, 0);
  }
  const notes = await stripeCall('credit notes list', () => s.creditNotes.list({ invoice: invoiceId, limit: 100 }));
  const credited = notes.data.filter((n) => n.status === 'issued').reduce((a, n) => a + n.total, 0);
  return { paid: inv.amount_paid, refunded, credited, currency: inv.currency };
}

export async function runOperator(r: OperatorRequest): Promise<Result> {
  if (!(OPERATOR_ACTIONS as readonly string[]).includes(r.action)) return { action: String(r.action), phase: 'dry_run', result: 'refused', target: {}, error: 'unknown_action' };
  const apply = r.apply === true;
  const phase = apply ? 'apply' : 'dry_run';
  if (apply && (typeof r.actor !== 'string' || r.actor.trim().length < 2 || typeof r.reason !== 'string' || r.reason.trim().length < 3 || typeof r.ticket !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_.:#/-]{1,79}$/.test(r.ticket))) {
    // Refused attempts are audited too (with what was declared; never a credential).
    return record({ ...r, actor: typeof r.actor === 'string' && r.actor.trim().length >= 2 ? r.actor : 'undeclared', reason: 'apply refused: actor, reason and ticket are mandatory', ticket: 'MISSING-TICKET' },
      { action: r.action, phase, result: 'refused', target: {}, error: 'actor_reason_ticket_required' });
  }
  let target: Record<string, unknown> = {};
  try {
    await assertStripeAccount();
    switch (r.action) {
      case 'quantity-check': {
        const account = need(r, 'accountId'); target = { account };
        const { sub, billable, mirror } = await accountBilling(account);
        const ops = await admin().from('store_operations').select('id,kind,state').eq('account_id', account).in('state', ['payment_setup', 'payment_pending', 'paid_pending_activation', 'cancel_requested', 'attention', 'requested']);
        const facts = { provider_quantity: sub.items.data[0].quantity, billable_count: billable, mirror_quantity: mirror.quantity, unresolved_operations: ops.data ?? [], consistent: sub.items.data[0].quantity === billable && !(ops.data ?? []).length };
        return record(r, { action: r.action, phase: 'dry_run', result: 'planned', target, before: facts });
      }
      case 'store-operation-reconcile': {
        const op = need(r, 'operationId'); target = { operation: op };
        const before = await loadStoreOperation(op); if (!before) throw new Refusal('unknown_operation');
        if (!apply) return record(r, { action: r.action, phase, result: 'planned', target, before: { state: before.state, error: before.last_error_code } });
        if (before.state === 'attention' && before.kind === 'store_add') {
          // Resume only after recorded owner reconfirmation; amount/period/quantity are re-verified at activation.
          if (typeof r.reconfirmationRef !== 'string' || r.reconfirmationRef.trim().length < 3) throw new Refusal('owner_reconfirmation_ref_required');
          const inv = await stripeCall('invoice read', () => stripe().invoices.retrieve(before.invoice_id as string));
          if (inv.status !== 'paid') throw new Refusal('invoice_not_paid');
          const resumed = await rpc<{ outcome?: string; error?: string }>('store_operation_resume', { p_operation: op, p_paid_cents: inv.amount_paid, p_reconfirmation_ref: r.reconfirmationRef });
          if (resumed.error) throw new Refusal(resumed.error);
        }
        const outcome = await advanceStoreOperation(op);
        const after = await loadStoreOperation(op);
        return record(r, { action: r.action, phase, result: 'applied', target, before: { state: before.state }, after: { state: after?.state, error: after?.last_error_code, advance: outcome } });
      }
      case 'store-operation-close': {
        const op = need(r, 'operationId'); target = { operation: op };
        const before = await loadStoreOperation(op); if (!before || !before.invoice_id) throw new Refusal('unknown_operation_or_invoice');
        const proof = await refundProof(before.invoice_id);
        const full = proof.paid === before.amount_cents && proof.refunded + proof.credited >= proof.paid && proof.currency === 'usd';
        if (!apply) return record(r, { action: r.action, phase, result: full ? 'planned' : 'refused', target, before: { state: before.state, proof }, error: full ? undefined : 'partial_or_missing_proof' });
        if (typeof r.proofRef !== 'string' || r.proofRef.trim().length < 3) throw new Refusal('proof_reference_required');
        const closed = await rpc<{ outcome?: string; error?: string }>('store_operation_close', { p_operation: op, p_invoice: before.invoice_id, p_paid_cents: proof.paid, p_refunded_cents: proof.refunded,
          p_credited_cents: proof.credited, p_currency: proof.currency, p_proof_ref: r.proofRef });
        if (closed.error) throw new Refusal(closed.error);
        return record(r, { action: r.action, phase, result: 'applied', target, before: { state: before.state, proof }, after: closed });
      }
      case 'store-transfer-authorize': {
        // Buyer: an existing account (Add Store path) OR, per ruling 3, an exact email for a buyer who will register.
        const source = need(r, 'sourceBusinessId');
        const buyer = typeof r.buyerAccountId === 'string' ? need(r, 'buyerAccountId') : null;
        const buyerEmail = buyer ? null : (typeof r.buyerEmail === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.buyerEmail) ? r.buyerEmail.trim().toLowerCase() : null);
        if (!buyer && !buyerEmail) throw new Refusal('buyer_account_id_or_buyer_email_required');
        target = { source, buyer, buyer_email_given: !!buyerEmail };
        const b = await admin().from('businesses').select('account_id').eq('id', source).maybeSingle();
        if (!b.data) throw new Refusal('unknown_source');
        const { sub } = await accountBilling(b.data.account_id as string);
        const effective = typeof r.effectiveAt === 'string' ? r.effectiveAt : new Date(sub.items.data[0].current_period_end * 1000).toISOString();   // default: seller paid-period end
        if (!apply) return record(r, { action: r.action, phase, result: 'planned', target, before: { seller_quantity: sub.items.data[0].quantity, effective_at: effective, hold_hours: r.holdHours ?? 48 } });
        const t = await rpc<{ transfer?: Record<string, unknown>; error?: string }>('store_transfer_authorize', { p_source_business: source, p_buyer_account: buyer, p_buyer_email: buyerEmail,
          p_effective_at: effective, p_hold_hours: Number(r.holdHours ?? 48), p_ref: r.ticket });
        if (t.error) throw new Refusal(t.error);
        const q = await syncQuantity(b.data.account_id as string, `transfer:${(t.transfer as { id: string }).id}`);
        return record(r, { action: r.action, phase, result: 'applied', target, after: { transfer: t.transfer, seller_quantity: q } });
      }
      case 'store-transfer-cancel': {
        const transfer = need(r, 'transferId'); target = { transfer };
        const t = await admin().from('store_transfers').select('status,source_account_id,effective_at').eq('id', transfer).maybeSingle();
        if (!t.data) throw new Refusal('unknown_transfer');
        if (!apply) return record(r, { action: r.action, phase, result: 'planned', target, before: t.data });
        const c = await rpc<{ status?: string; error?: string }>('store_transfer_cancel', { p_transfer: transfer, p_ref: r.ticket });
        if (c.error) throw new Refusal(c.error);
        const q = await syncQuantity(t.data.source_account_id as string, `transfer-cancel:${transfer}`);
        return record(r, { action: r.action, phase, result: 'applied', target, before: t.data, after: { status: c.status, seller_quantity: q } });
      }
      case 'store-transfer-complete': {
        // Housekeeping at/after the effective time: end the source ownership and hold the NPI for the exact buyer.
        const transfer = need(r, 'transferId'); target = { transfer };
        const t = await admin().from('store_transfers').select('status,source_business_id,effective_at').eq('id', transfer).maybeSingle();
        if (!t.data) throw new Refusal('unknown_transfer');
        if (!apply) return record(r, { action: r.action, phase, result: 'planned', target, before: t.data });
        const f = await rpc<string>('store_removal_finalize', { p_business: t.data.source_business_id });
        if (f === 'not_due') throw new Refusal('effective_time_not_reached');
        return record(r, { action: r.action, phase, result: 'applied', target, before: t.data, after: { finalize: f } });
      }
      case 'owner-replace': {
        const account = need(r, 'accountId'), newOwner = need(r, 'newOwnerUserId'); target = { account, newOwner };
        const a = await admin().from('accounts').select('owner_user_id').eq('id', account).maybeSingle();
        if (!a.data) throw new Refusal('unknown_account');
        if (!apply) return record(r, { action: r.action, phase, result: 'planned', target, before: { owner: a.data.owner_user_id } });
        const o = await rpc<{ outcome?: string; error?: string }>('owner_replace', { p_account: account, p_new_owner: newOwner, p_ref: r.ticket });
        if (o.error) throw new Refusal(o.error);
        // Resumable provider step: the mapped customer's email follows the verified owner (no subscription/card moves).
        const user = await admin().auth.admin.getUserById(newOwner);
        const cust = await admin().from('billing_customers').select('stripe_customer_id').eq('account_id', account).maybeSingle();
        let provider = 'skipped';
        if (user.data.user?.email && cust.data?.stripe_customer_id) {
          await stripeCall('customer email', () => stripe().customers.update(cust.data!.stripe_customer_id as string, { email: user.data.user!.email }, { idempotencyKey: `owner-replace:${account}:${newOwner}` }));
          provider = 'customer_email_updated';
        }
        return record(r, { action: r.action, phase, result: 'applied', target, before: { owner: a.data.owner_user_id }, after: { ...o, provider } });
      }
      case 'store-admin-set': {
        const business = need(r, 'businessId'), user = need(r, 'userId'); target = { business, user };
        const disposition = r.formerAdminDisposition === 'remove' ? 'remove' : 'member';
        if (!apply) return record(r, { action: r.action, phase, result: 'planned', target, before: { disposition } });
        const o = await rpc<{ outcome?: string; error?: string }>('store_admin_set', { p_business: business, p_user: user, p_disposition: disposition });
        if (o.error) throw new Refusal(o.error);
        return record(r, { action: r.action, phase, result: 'applied', target, after: o });
      }
      case 'removed-store-reactivate': {
        const business = need(r, 'businessId'); target = { business };
        if (!apply) return record(r, { action: r.action, phase, result: 'planned', target, before: { note: 'authorization only; the owner then pays through Add Store and, after payment, gets the ORIGINAL record and history back (Director decision 9, approved 17 Nov 2026)' } });
        const o = await rpc<{ outcome?: string; error?: string }>('store_reactivation_authorize', { p_business: business, p_ref: r.ticket });
        if (o.error) throw new Refusal(o.error);
        return record(r, { action: r.action, phase, result: 'applied', target, after: o });
      }
    }
  } catch (e) {
    const refused = e instanceof Refusal;
    return record(r, { action: r.action, phase, result: refused ? 'refused' : 'failed', target, error: refused ? e.message : 'provider_or_database_failure' }).catch(() => ({ action: r.action, phase, result: 'failed', target, error: 'audit_write_failed' }));
  }
  return { action: r.action, phase, result: 'refused', target, error: 'unhandled' };
}
