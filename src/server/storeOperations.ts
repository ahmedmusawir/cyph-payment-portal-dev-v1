// APBM-007B — paid Add Store and period-end removal/undo (CONTRACTS/BILLING.md, LIFECYCLE_AND_TRANSFER.md).
// SQL owns authority and transitions (migrations 0062/0063); this module only reads Stripe, performs the money calls
// with operation-derived idempotency keys under a fenced lease, and reports what the database decided.
// Browser values never choose customer, subscription, amount, quantity or payment result.
import { randomUUID } from 'node:crypto';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { admin, rpc } from '@/server/db';
import { PortalError, StoreRefusal, logServer } from '@/server/errors';
import { ownerOverview } from '@/server/billing';
import { assertStripeAccount, stripe, stripeCall, stripeNames } from '@/server/stripeClient';
import { ADD_STORE_TERMS_VERSION, incrementalCents, windowRefusal } from '@/server/storePricing';

export const STORE_OPERATION_LEASE_SECONDS = 60;
const KEY_RETENTION_SAFE_MS = 23 * 3600 * 1000;   // provider idempotency keys are kept 24 h; never re-send after 23 h
const UNRESOLVED = ['payment_setup', 'payment_pending', 'paid_pending_activation', 'cancel_requested', 'attention', 'requested'];

export interface OperationRow {
  id: string; account_id: string; kind: 'store_add' | 'store_removal' | 'store_removal_undo'; state: string; intent_key: string; actor_user_id: string;
  quote_id: string | null; business_id: string | null; store_name: string | null; npi: string | null; amount_cents: number | null; currency: string | null;
  payment_deadline: string | null; stripe_customer_id: string | null; stripe_subscription_id: string | null; stripe_item_id: string | null;
  period_start: string | null; period_end: string | null; target_quantity: number | null; invoice_id: string | null; hosted_invoice_url: string | null;
  last_error_code: string | null; transfer_id: string | null; created_at: string; fencing_epoch: number;
  provider_paid_at: string | null; close_reference: string | null;
}
const OP_COLUMNS = 'id,account_id,kind,state,intent_key,actor_user_id,quote_id,business_id,store_name,npi,amount_cents,currency,payment_deadline,stripe_customer_id,stripe_subscription_id,stripe_item_id,period_start,period_end,target_quantity,invoice_id,hosted_invoice_url,last_error_code,transfer_id,created_at,fencing_epoch,provider_paid_at,close_reference';

// ---------------------------------------------------------------- refusals (safe, named)
const REFUSAL: Record<string, [ConstructorParameters<typeof StoreRefusal>[0], string]> = {
  not_owner: ['not_owner', 'Only the account owner can change stores.'],
  invalid_npi: ['invalid_input', 'Enter a valid 10-digit NPI.'],
  invalid_ncpdp: ['invalid_input', 'NCPDP must be 7 digits, or leave it blank.'],
  account_read_only: ['store_refused', 'Your account is read-only until billing is updated. Update your payment method on the Billing page.'],
  account_in_grace: ['store_refused', 'A renewal payment is overdue. Update your payment method on the Billing page before adding a store.'],
  cancellation_scheduled: ['store_refused', 'Your subscription is set to cancel. Undo the cancellation on the Billing page before adding a store.'],
  account_not_active: ['store_refused', 'Your subscription is not active.'],
  operation_unresolved: ['store_conflict', 'Another store change is still in progress. Finish or cancel it first.'],
  billing_binding_mismatch: ['retry_later', 'Your billing details are being refreshed. Try again in a moment.'],
  quantity_mismatch: ['retry_later', 'Your store count is being reconciled. Try again in a moment, or contact support if this persists.'],
  quantity_changed: ['store_conflict', 'Your stores changed since this quote. Get a new quote.'],
  npi_registered: ['store_refused', 'This NPI is already registered. Contact support if you believe this is your pharmacy.'],
  npi_previously_registered: ['store_refused', 'This pharmacy was registered before. Contact support to restore it.'],
  reactivation_not_authorized: ['store_refused', 'Restoring this pharmacy needs support authorization. Contact support.'],
  npi_held: ['store_refused', 'This NPI is being registered right now. Try again later or contact support.'],
  transfer_not_effective: ['store_refused', 'This pharmacy transfer has not reached its effective time yet.'],
  transfer_hold_expired: ['store_refused', 'The transfer reservation for this pharmacy has expired. Contact support.'],
  transfer_not_reserved: ['store_refused', 'This pharmacy is not reserved for your account.'],
  period_mismatch: ['retry_later', 'Your billing period just changed. Try again in a moment.'],
  period_end_window: ['store_refused', 'Your billing period ends very soon. You can add this store after renewal.'],
  below_minimum_charge: ['store_refused', 'Your billing period ends very soon, so the charge would be below the minimum. You can add this store after renewal.'],
  quote_not_found: ['not_found', 'That quote was not found. Get a new quote.'],
  quote_expired: ['expired', 'This quote expired. Get a new quote.'],
  quote_used: ['store_conflict', 'This quote was already used. Check the store status.'],
  terms_changed: ['store_conflict', 'The terms changed. Review the new quote.'],
  intent_conflict: ['store_conflict', 'A different request with this confirmation is already in progress.'],
  last_store: ['store_refused', 'This is your only store. To stop, cancel the whole subscription on the Billing page.'],
  already_scheduled: ['store_conflict', 'This store is already scheduled for removal.'],
  not_scheduled: ['store_conflict', 'This store is not scheduled for removal.'],
  cutoff_passed: ['store_refused', 'The removal has already taken effect. Contact support to restore this store.'],
  store_not_found: ['not_found', 'Store not found.'],
  transfer_in_progress: ['store_refused', 'This store is part of a support transfer. Contact support.'],
};
function refuse(code: string): never {
  const [c, msg] = REFUSAL[code] ?? ['store_refused', "This store change can't be made right now."];
  throw new StoreRefusal(c, code, msg);
}

// ---------------------------------------------------------------- owner context and live provider binding
export interface OwnerContext { userId: string; accountId: string; subscriptionId: string; customerId: string }
export async function ownerContext(userClient: SupabaseClient): Promise<OwnerContext> {
  const { data } = await userClient.auth.getUser();
  if (!data.user) throw new PortalError('sign_in_required');
  const o = await ownerOverview(userClient);                       // raises not_owner for admin/member/foreign
  if (!o.subscription || o.subscription.origin !== 'stripe') throw new PortalError('not_billable', 'no stripe subscription');
  const r = await admin().from('subscriptions').select('stripe_customer_id,stripe_subscription_id').eq('id', o.subscription.id).eq('account_id', o.account_id).eq('origin', 'stripe').maybeSingle();
  if (r.error || !r.data?.stripe_subscription_id || !r.data.stripe_customer_id) throw new PortalError('provider_unavailable', 'subscription link');
  return { userId: data.user.id, accountId: o.account_id, subscriptionId: r.data.stripe_subscription_id, customerId: r.data.stripe_customer_id };
}

export interface Binding { subscription: Stripe.Subscription; item: Stripe.SubscriptionItem; unitCents: number; periodStart: number; periodEnd: number; quantity: number }
let tierCache: { priceId: string; unit: number } | null = null;
/** The guarded second catalogue tier (never a browser constant). */
async function additionalUnitCents(priceId: string): Promise<number> {
  if (tierCache?.priceId === priceId) return tierCache.unit;
  const price = await stripeCall('price read', () => stripe().prices.retrieve(priceId, { expand: ['tiers'] }));
  const t = price.tiers ?? [];
  const ok = !price.livemode && price.active && price.currency === 'usd' && price.billing_scheme === 'tiered' && price.tiers_mode === 'graduated'
    && t.length === 2 && t[0].up_to === 1 && t[0].unit_amount === 9900 && t[1].up_to === null && (t[1].unit_amount ?? 0) > 0;
  if (!ok) throw new PortalError('configuration', 'catalogue tiers not the expected graduated price');
  tierCache = { priceId, unit: t[1].unit_amount as number };
  return tierCache.unit;
}
/** Read the subscription live and verify it is the account's own active, uncancelled, single-item catalogue subscription. */
export async function liveBinding(ctx: Pick<OwnerContext, 'subscriptionId' | 'customerId'>, opts: { forAdd: boolean }): Promise<Binding> {
  await assertStripeAccount();
  const sub = await stripeCall('subscription read', () => stripe().subscriptions.retrieve(ctx.subscriptionId));
  const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  if (customer !== ctx.customerId || sub.items.data.length !== 1) throw new PortalError('provider_unavailable', 'subscription shape');
  const item = sub.items.data[0];
  if (item.price.id !== stripeNames().priceId) throw new PortalError('configuration', 'subscription price is not the catalogue price');
  if (sub.status !== 'active') refuse(sub.status === 'past_due' || sub.status === 'unpaid' ? 'account_in_grace' : 'account_not_active');
  if (opts.forAdd && (sub.cancel_at_period_end || sub.cancel_at)) refuse('cancellation_scheduled');
  if (opts.forAdd) {
    const c = await stripeCall('customer read', () => stripe().customers.retrieve(ctx.customerId));
    if ('deleted' in c && c.deleted) throw new PortalError('provider_unavailable', 'customer deleted');
    const cust = c as Stripe.Customer;
    // Only the tested configuration: USD, zero balance, no customer-level discount, no tax exemption changes.
    if ((cust.balance ?? 0) !== 0 || cust.discount || (cust.tax_exempt && cust.tax_exempt !== 'none')) throw new PortalError('billing_configuration_attention', 'customer balance/discount/tax');
  }
  return { subscription: sub, item, unitCents: await additionalUnitCents(item.price.id), periodStart: item.current_period_start, periodEnd: item.current_period_end, quantity: item.quantity ?? 0 };
}
const iso = (s: number) => new Date(s * 1000).toISOString();
const secs = (t: string | null) => (t ? Math.floor(Date.parse(t) / 1000) : NaN);

// ---------------------------------------------------------------- A1 quote
export interface QuoteView { quoteId: string; amountCents: number; currency: 'usd'; periodEnd: string; quoteExpiresAt: string; nextRenewalCents: number; consentCopyVersion: string; storeName: string; npi: string; discountExplanation: string }
export async function quoteAddStore(userClient: SupabaseClient, input: { storeName: string; npi: string; ncpdp: string | null }): Promise<QuoteView> {
  const ctx = await ownerContext(userClient);
  const b = await liveBinding(ctx, { forAdd: true });
  const local = windowRefusal(b.unitCents, b.periodStart, b.periodEnd, Math.floor(Date.now() / 1000));
  // The database computes the binding amount on the account's own clock; this local check only avoids a pointless call.
  const r = await rpc<{ quote?: Record<string, unknown>; error?: string }>('store_quote_create', {
    p_account: ctx.accountId, p_actor: ctx.userId, p_store_name: input.storeName, p_npi: input.npi, p_ncpdp: input.ncpdp,
    p_customer: ctx.customerId, p_subscription: ctx.subscriptionId, p_item: b.item.id, p_price: b.item.price.id, p_unit: b.unitCents,
    p_quantity: b.quantity, p_period_start: iso(b.periodStart), p_period_end: iso(b.periodEnd), p_terms_version: ADD_STORE_TERMS_VERSION,
  });
  if (r.error) refuse(r.error);
  if (!r.quote) refuse(local ?? 'retry_later');
  const q = r.quote as Record<string, string | number>;
  return { quoteId: String(q.id), amountCents: Number(q.amount_cents), currency: 'usd', periodEnd: String(q.period_end), quoteExpiresAt: String(q.expires_at),
    nextRenewalCents: Number(q.next_renewal_cents), consentCopyVersion: String(q.terms_version), storeName: String(q.store_name), npi: String(q.npi),
    discountExplanation: String(q.discount_explanation) };
}

// ---------------------------------------------------------------- A2 confirm
/**
 * Why a payment-pending Add Store still needs the owner (R3, manual QA 19 Nov 2026), derived only from the outcome code the
 * server recorded for its single charge attempt. Never a client signal; never a reason to charge again.
 */
export type PaymentIssue = 'none' | 'processing' | 'authentication_required' | 'declined' | 'no_payment_method' | 'unknown';
const AUTH_CODES = ['invoice_payment_intent_requires_action', 'authentication_required', 'payment_intent_authentication_failure'];
const DECLINE_CODES = ['card_declined', 'insufficient_funds', 'expired_card', 'incorrect_cvc', 'incorrect_number', 'invalid_cvc', 'invalid_expiry_month',
  'invalid_expiry_year', 'processing_error', 'card_decline_rate_limit_exceeded', 'payment_intent_payment_attempt_failed'];
const NO_METHOD_CODES = ['missing', 'invoice_no_payment_method_types', 'payment_method_unactivated'];
export function paymentIssueFor(state: string, payOutcome: string | null): PaymentIssue {
  if (state !== 'payment_pending') return 'none';
  if (payOutcome === null) return 'processing';            // the single attempt has not been recorded yet
  if (payOutcome === 'paid') return 'processing';          // Stripe accepted the attempt; the invoice is not paid yet
  if (AUTH_CODES.includes(payOutcome)) return 'authentication_required';
  if (DECLINE_CODES.includes(payOutcome)) return 'declined';
  if (NO_METHOD_CODES.includes(payOutcome)) return 'no_payment_method';
  return 'unknown';
}
async function payOutcome(id: string): Promise<string | null> {
  const r = await admin().from('provider_call_intents').select('outcome').eq('operation_id', id).eq('stage', 'pay').eq('attempt', 1).maybeSingle();
  if (r.error) throw new PortalError('provider_unavailable', 'intent read');
  return (r.data as { outcome: string | null } | null)?.outcome ?? null;
}
export interface StatusView { operationId: string; kind: string; state: string; errorCode: string | null; paymentDeadline: string | null; amountCents: number | null;
  paymentRequired: boolean; paymentIssue: PaymentIssue; hostedPaymentUrl: string | null; businessId: string | null; storeName: string | null; effectiveAt?: string | null }
export async function confirmAddStore(userClient: SupabaseClient, input: { quoteId: string; intentKey: string }): Promise<StatusView> {
  const ctx = await ownerContext(userClient);
  const r = await rpc<{ operation?: OperationRow; error?: string }>('store_operation_claim', { p_quote: input.quoteId, p_actor: ctx.userId, p_intent: input.intentKey, p_terms_version: ADD_STORE_TERMS_VERSION });
  if (r.error) refuse(r.error);
  const op = r.operation as OperationRow;
  if (op.account_id !== ctx.accountId) throw new PortalError('not_owner', 'operation account');
  await advanceStoreOperation(op.id).catch((e) => logServer('store advance', e));   // outcome is read back below; never assumed
  return statusFor(ctx, op.id);
}

// ---------------------------------------------------------------- A4/A5 status and abandon
export async function loadStoreOperation(id: string): Promise<OperationRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await admin().from('store_operations').select(OP_COLUMNS).eq('id', id).maybeSingle();
  if (r.error) throw new PortalError('provider_unavailable', `operation read ${r.error.code}`);
  return (r.data as OperationRow | null) ?? null;
}
async function statusFor(ctx: OwnerContext, id: string): Promise<StatusView> {
  const op = await loadStoreOperation(id);
  if (!op || op.account_id !== ctx.accountId) throw new PortalError('not_found', 'operation');
  // The hosted page is an owner-only capability, offered only while that exact invoice is open and awaiting payment
  // before the deadline on the account's billing clock (the database decides; never this server's wall clock).
  const showHosted = op.kind === 'store_add' && op.state === 'payment_pending' && !!op.hosted_invoice_url && !!op.payment_deadline && !(await deadlinePassed(op.id));
  const issue = op.kind === 'store_add' ? paymentIssueFor(op.state, op.state === 'payment_pending' ? await payOutcome(op.id) : null) : 'none';
  return { operationId: op.id, kind: op.kind, state: op.state, errorCode: op.last_error_code, paymentDeadline: op.payment_deadline, amountCents: op.amount_cents,
    paymentRequired: op.state === 'payment_pending', paymentIssue: issue, hostedPaymentUrl: showHosted ? op.hosted_invoice_url : null, businessId: op.state === 'activated' ? op.business_id : null,
    storeName: op.store_name, effectiveAt: op.kind === 'store_removal' && op.state === 'completed' ? op.period_end : null };
}
export async function storeOperationStatus(userClient: SupabaseClient, id: string): Promise<StatusView> {
  const ctx = await ownerContext(userClient);
  const op = await loadStoreOperation(id);
  if (!op || op.account_id !== ctx.accountId) throw new PortalError('not_found', 'operation');
  if (UNRESOLVED.includes(op.state) && op.state !== 'attention') await advanceStoreOperation(op.id).catch((e) => logServer('store status advance', e));
  return statusFor(ctx, id);
}
export async function abandonAddStore(userClient: SupabaseClient, id: string): Promise<StatusView> {
  const ctx = await ownerContext(userClient);
  const op = await loadStoreOperation(id);
  if (!op || op.account_id !== ctx.accountId) throw new PortalError('not_found', 'operation');
  await rpc<string>('store_operation_cancel_request', { p_operation: id, p_actor: ctx.userId });
  await advanceStoreOperation(id).catch((e) => logServer('store abandon advance', e));
  return statusFor(ctx, id);
}
export async function listOwnerOperations(userClient: SupabaseClient): Promise<unknown> {
  const r = await userClient.rpc('owner_store_operations');
  if (r.error) { if (r.error.code === '42501') throw new PortalError('not_owner'); throw new PortalError('provider_unavailable', `operations ${r.error.code}`); }
  return r.data;
}

// ---------------------------------------------------------------- the fenced advance (A6 is the SQL activation)
class LeaseLost extends Error {}
type Lease = { owner: string; epoch: number };
async function lease(id: string, waitMs = 8000): Promise<Lease | null> {
  const owner = `pp-store-${randomUUID()}`; const until = Date.now() + waitMs;
  for (;;) {
    const epoch = await rpc<number | null>('store_operation_lease', { p_operation: id, p_owner: owner, p_seconds: STORE_OPERATION_LEASE_SECONDS });
    if (epoch !== null && epoch !== undefined) return { owner, epoch: Number(epoch) };
    if (Date.now() >= until) return null;
    await new Promise((r) => setTimeout(r, 400));
  }
}
async function transition(op: OperationRow, l: Lease, to: string, error: string | null = null, invoice: string | null = null, hosted: string | null = null): Promise<string> {
  const r = await rpc<string>('store_operation_transition', { p_operation: op.id, p_owner: l.owner, p_epoch: l.epoch, p_to: to, p_error: error, p_invoice: invoice, p_hosted_url: hosted });
  if (r === 'lease_lost') throw new LeaseLost();
  return r;
}
async function intent(op: OperationRow, l: Lease, stage: string, key: string, params: Record<string, unknown>): Promise<void> {
  const r = await rpc<string>('store_operation_intent', { p_operation: op.id, p_owner: l.owner, p_epoch: l.epoch, p_stage: stage, p_attempt: 1, p_key: key, p_params: params });
  if (r === 'lease_lost') throw new LeaseLost();
}
/** The consent deadline on the account's billing clock (0070): real time, or simulated only in the verified SCRATCH test context. */
async function deadlinePassed(id: string): Promise<boolean> {
  return (await rpc<boolean | null>('store_operation_deadline_passed', { p_operation: id })) === true;
}
/** A paid invoice: the database routes it by the provider's paid time against the stored deadline (0070), never by when
 * this event, poll or restart is processed. On time → paid_pending_activation; late or unproven → attention. */
async function paymentObserved(op: OperationRow, l: Lease, inv: Stripe.Invoice): Promise<string> {
  const paidAt = inv.status_transitions?.paid_at;
  const r = await rpc<string>('store_operation_payment_observed', { p_operation: op.id, p_owner: l.owner, p_epoch: l.epoch, p_invoice: inv.id,
    p_paid_cents: inv.amount_paid, p_currency: inv.currency, p_paid_at: typeof paidAt === 'number' ? iso(paidAt) : null });
  if (r === 'lease_lost') throw new LeaseLost();
  return r;
}
const outcome = (op: OperationRow, stage: string, value: string) => rpc('store_operation_intent_outcome', { p_operation: op.id, p_stage: stage, p_attempt: 1, p_outcome: value });
async function intentRecorded(op: OperationRow, stage: string): Promise<{ created_at: string } | null> {
  const r = await admin().from('provider_call_intents').select('created_at').eq('operation_id', op.id).eq('stage', stage).eq('attempt', 1).maybeSingle();
  if (r.error) throw new PortalError('provider_unavailable', 'intent read');
  return r.data as { created_at: string } | null;
}

/** Find this operation's invoice after a lost reply: exact customer + creation interval + metadata, all pages. */
async function enumerateInvoice(op: OperationRow): Promise<Stripe.Invoice[] | 'ambiguous'> {
  const from = Math.floor(Date.parse(op.created_at) / 1000) - 60;
  const found: Stripe.Invoice[] = [];
  for await (const inv of stripe().invoices.list({ customer: op.stripe_customer_id as string, created: { gte: from }, limit: 100 })) {
    if (inv.metadata?.apbm_operation === op.id) found.push(inv);
    if (found.length > 1) return 'ambiguous';
  }
  return found;
}
const invoiceParams = (op: OperationRow) => ({
  customer: op.stripe_customer_id as string, collection_method: 'charge_automatically' as const, auto_advance: false,
  pending_invoice_items_behavior: 'exclude' as const, discounts: [] as [], currency: 'usd',
  description: `Additional pharmacy store: ${op.store_name}, remaining current period`,
  metadata: { apbm_operation: op.id, apbm_kind: 'store_add', apbm_expected_cents: String(op.amount_cents), apbm_account: op.account_id, apbm_env: process.env.NEXT_PUBLIC_APP_ENV === 'staging' ? 'staging' : 'local' },
});
/** Validate the draft against the operation before any money moves. */
function draftMatches(op: OperationRow, inv: Stripe.Invoice): boolean {
  const lines = inv.lines?.data ?? [];
  return inv.customer === op.stripe_customer_id && inv.currency === 'usd' && (inv.parent === null || inv.parent === undefined)
    && lines.length === 1 && lines[0].amount === op.amount_cents && inv.total === op.amount_cents && inv.amount_due === op.amount_cents
    && (inv.total_discount_amounts ?? []).length === 0 && (inv.discounts ?? []).length === 0 && (inv.starting_balance ?? 0) === 0
    && inv.metadata?.apbm_operation === op.id && inv.auto_advance === false;
}

/**
 * Drive one Add Store or lifecycle operation forward from its durable state. Safe to call from the confirm request,
 * owner polling, the signed webhook, the expiry job and the operator; one caller at a time holds the fenced lease.
 */
export async function advanceStoreOperation(id: string, opts: { waitMs?: number } = {}): Promise<string> {
  const l = await lease(id, opts.waitMs);
  if (!l) return 'busy';
  try {
    for (let step = 0; step < 8; step++) {
      const op = await loadStoreOperation(id);
      if (!op) return 'unknown_operation';
      if (op.kind !== 'store_add') return await advanceLifecycle(op, l);
      const due = (op.state === 'payment_setup' || op.state === 'payment_pending') && !!op.payment_deadline && (await deadlinePassed(op.id));
      if (op.state === 'payment_setup') { if (due) { await closeUnpaid(op, l); continue; } await setupInvoice(op, l); continue; }
      if (op.state === 'payment_pending') { await settlePayment(op, l, due); const after = await loadStoreOperation(id); if (after?.state === 'payment_pending') return 'payment_pending'; continue; }
      if (op.state === 'cancel_requested') { await closeUnpaid(op, l); continue; }
      if (op.state === 'paid_pending_activation') { await activate(op, l); continue; }
      return op.state;   // activated, expired_unpaid, attention, closed_refunded_externally
    }
    return 'stepped';
  } catch (e) {
    if (e instanceof LeaseLost) return 'busy';
    throw e;
  } finally {
    await rpc('store_operation_release', { p_operation: id, p_owner: l.owner, p_epoch: l.epoch }).catch(() => {});
  }
}

async function setupInvoice(op: OperationRow, l: Lease): Promise<void> {
  const s = stripe();
  let inv: Stripe.Invoice | null = null;
  if (op.invoice_id) inv = await stripeCall('invoice read', () => s.invoices.retrieve(op.invoice_id as string));
  if (!inv) {
    const prior = await intentRecorded(op, 'invoice_create');
    if (prior) {
      const found = await enumerateInvoice(op);
      if (found === 'ambiguous') { await transition(op, l, 'attention', 'ambiguous_invoice'); return; }
      if (found.length === 1) inv = found[0];
      else if (Date.now() - Date.parse(prior.created_at) > KEY_RETENTION_SAFE_MS) { await transition(op, l, 'attention', 'invoice_history_incomplete'); return; }
    } else {
      await intent(op, l, 'invoice_create', `${op.id}:invoice`, invoiceParams(op));
    }
    if (!inv) {
      // Same key as the recorded intent: a replay returns the original invoice, never a second one.
      inv = await stripeCall('invoice create', () => s.invoices.create(invoiceParams(op), { idempotencyKey: `${op.id}:invoice` }));
      await outcome(op, 'invoice_create', inv.id as string);
    }
  }
  const mapped = await rpc<string>('store_operation_map_invoice', { p_operation: op.id, p_owner: l.owner, p_epoch: l.epoch, p_invoice: inv.id, p_customer: op.stripe_customer_id, p_cents: op.amount_cents });
  if (mapped === 'lease_lost') throw new LeaseLost();
  if (mapped !== 'mapped') { await transition(op, l, 'attention', `invoice_${mapped}`); return; }
  if (inv.status === 'draft' && (inv.lines?.data ?? []).length === 0) {
    if (!(await intentRecorded(op, 'item_create'))) await intent(op, l, 'item_create', `${op.id}:item`, { amount: op.amount_cents, currency: 'usd', invoice: inv.id });
    await stripeCall('invoice item create', () => s.invoiceItems.create({ customer: op.stripe_customer_id as string, invoice: inv!.id as string, amount: op.amount_cents as number, currency: 'usd', discountable: false,
      description: `Additional pharmacy store: ${op.store_name}, remaining current period`, metadata: { apbm_operation: op.id } }, { idempotencyKey: `${op.id}:item` }));
    await outcome(op, 'item_create', 'created');
    inv = await stripeCall('invoice read', () => s.invoices.retrieve(inv!.id as string));
  }
  if (inv.status === 'draft') {
    const customer = await stripeCall('customer read', () => s.customers.retrieve(op.stripe_customer_id as string));
    if (!draftMatches(op, inv) || ('balance' in customer && (customer as Stripe.Customer).balance !== 0)) { await transition(op, l, 'attention', 'draft_mismatch'); return; }
    if (!(await intentRecorded(op, 'finalize'))) await intent(op, l, 'finalize', `${op.id}:finalize`, { invoice: inv.id, auto_advance: false });
    inv = await stripeCall('invoice finalize', () => s.invoices.finalizeInvoice(inv!.id as string, { auto_advance: false }, { idempotencyKey: `${op.id}:finalize` }));
    await outcome(op, 'finalize', inv.status ?? 'unknown');
  }
  if (inv.status === 'open' || inv.status === 'paid') {
    await transition(op, l, 'payment_pending', null, inv.id as string, inv.hosted_invoice_url ?? null);
    return;
  }
  await transition(op, l, 'attention', `invoice_${inv.status}`);
}

/** The subscription's default payment method id (the card saved at registration Checkout), or null. Read only. */
async function subscriptionPaymentMethod(op: OperationRow): Promise<string | null> {
  if (!op.stripe_subscription_id) return null;
  const sub = await stripeCall('subscription read', () => stripe().subscriptions.retrieve(op.stripe_subscription_id as string));
  const pm = sub.default_payment_method;
  return typeof pm === 'string' ? pm : pm?.id ?? null;
}

/** Attempt payment ONCE (only before the deadline), then only read. Paid → routed by paid time; due and unpaid → verified close; open → wait. */
async function settlePayment(op: OperationRow, l: Lease, due: boolean): Promise<void> {
  const s = stripe();
  let inv = await stripeCall('invoice read', () => s.invoices.retrieve(op.invoice_id as string));
  if (inv.status === 'open' && !due && !(await intentRecorded(op, 'pay'))) {
    // Manual QA 19 Nov 2026 (R3): registration Checkout saves the owner's card on the SUBSCRIPTION, not as the customer's
    // invoice default, so a bare invoices.pay found no card ('missing') and every real owner was sent to the hosted page.
    // Pay with the subscription's own default payment method when it has one; otherwise Stripe's customer default applies.
    const pm = await subscriptionPaymentMethod(op);
    await intent(op, l, 'pay', `${op.id}:pay:1`, { invoice: inv.id, expected_cents: op.amount_cents, payment_method: pm ?? 'customer_default' });
    try { await s.invoices.pay(inv.id as string, pm ? { payment_method: pm } : {}, { idempotencyKey: `${op.id}:pay:1` }); await outcome(op, 'pay', 'paid'); }
    catch (e) { await outcome(op, 'pay', (e as { code?: string }).code ?? 'error'); }
    inv = await stripeCall('invoice read', () => s.invoices.retrieve(op.invoice_id as string));
  }
  if (inv.status === 'paid') {
    if (inv.amount_paid !== op.amount_cents || inv.currency !== 'usd' || inv.metadata?.apbm_operation !== op.id) { await transition(op, l, 'attention', 'payment_mismatch'); return; }
    // Lateness is the provider's paid time against the stored deadline, decided in SQL: a late payment is preserved in
    // attention (no activation, no quantity change, no refund); an on-time payment processed late still activates.
    await paymentObserved(op, l, inv);
    return;
  }
  if (due) { await closeUnpaid(op, l); return; }
  await transition(op, l, 'payment_pending', null, null, inv.hosted_invoice_url ?? null);
}

/** Deadline or owner abandon: void the open invoice and verify terminal provider state before releasing anything. */
async function closeUnpaid(op: OperationRow, l: Lease): Promise<void> {
  const s = stripe();
  let invoiceId = op.invoice_id;
  if (!invoiceId && (await intentRecorded(op, 'invoice_create'))) {
    const found = await enumerateInvoice(op);
    if (found === 'ambiguous') { await transition(op, l, 'attention', 'ambiguous_invoice'); return; }
    if (found.length === 1) invoiceId = found[0].id as string;
    else {
      // Unproven absence: replay the recorded create key (returns the original if it exists, otherwise a harmless draft).
      const prior = await intentRecorded(op, 'invoice_create');
      if (Date.now() - Date.parse(prior!.created_at) > KEY_RETENTION_SAFE_MS) { await transition(op, l, 'attention', 'invoice_history_incomplete'); return; }
      const inv = await stripeCall('invoice create replay', () => s.invoices.create(invoiceParams(op), { idempotencyKey: `${op.id}:invoice` }));
      const mapped = await rpc<string>('store_operation_map_invoice', { p_operation: op.id, p_owner: l.owner, p_epoch: l.epoch, p_invoice: inv.id, p_customer: op.stripe_customer_id, p_cents: op.amount_cents });
      if (mapped === 'lease_lost') throw new LeaseLost();
      invoiceId = inv.id as string;
    }
  }
  if (invoiceId) {
    let inv = await stripeCall('invoice read', () => s.invoices.retrieve(invoiceId as string));
    if (inv.status === 'paid') { await paymentObserved(op, l, inv); return; }   // SQL routes a paid abandon/late payment to attention
    if (inv.status === 'draft') { await stripeCall('invoice delete draft', () => s.invoices.del(invoiceId as string, {}, { idempotencyKey: `${op.id}:delete` })); }
    else if (inv.status === 'open') {
      if (!(await intentRecorded(op, 'void'))) await intent(op, l, 'void', `${op.id}:void`, { invoice: invoiceId });
      try { await s.invoices.voidInvoice(invoiceId, {}, { idempotencyKey: `${op.id}:void` }); await outcome(op, 'void', 'void'); }
      catch (e) { await outcome(op, 'void', (e as { code?: string }).code ?? 'error'); }
      inv = await stripeCall('invoice read', () => s.invoices.retrieve(invoiceId as string));
      if (inv.status === 'paid') { await paymentObserved(op, l, inv); return; }   // paid-versus-void race: routed by paid time
      if (inv.status !== 'void' || inv.amount_paid !== 0) { await transition(op, l, 'attention', 'void_unverified'); return; }
    } else if (inv.status !== 'void' || inv.amount_paid !== 0) { await transition(op, l, 'attention', `close_${inv.status}`); return; }
  }
  await transition(op, l, 'expired_unpaid', op.state === 'cancel_requested' ? 'abandoned' : 'deadline_passed');
}

/** Recheck the subscription, set the absolute quantity with no proration, verify, then the atomic SQL activation. */
async function activate(op: OperationRow, l: Lease): Promise<void> {
  const s = stripe();
  const inv = await stripeCall('invoice read', () => s.invoices.retrieve(op.invoice_id as string));
  if (inv.status !== 'paid' || inv.amount_paid !== op.amount_cents) { await transition(op, l, 'attention', 'payment_not_verified'); return; }
  // Paid time not yet recorded (reached paid_pending_activation before 0070) and not an operator resume: decide it now,
  // before any quantity change.
  if (!op.provider_paid_at && !op.close_reference && (await paymentObserved(op, l, inv)) !== 'paid_pending_activation') return;
  let sub = await stripeCall('subscription read', () => s.subscriptions.retrieve(op.stripe_subscription_id as string));
  const item = sub.items.data[0];
  const samePeriod = item.current_period_start === secs(op.period_start) && item.current_period_end === secs(op.period_end);
  if (!samePeriod || sub.status !== 'active' || item.id !== op.stripe_item_id || item.price.id !== stripeNames().priceId) { await transition(op, l, 'attention', samePeriod ? 'subscription_changed' : 'period_changed'); return; }
  if (item.quantity !== op.target_quantity) {
    if (item.quantity !== (op.target_quantity as number) - 1) { await transition(op, l, 'attention', 'quantity_mismatch'); return; }
    if (!(await intentRecorded(op, 'quantity_update'))) await intent(op, l, 'quantity_update', `${op.id}:qty`, { quantity: op.target_quantity, proration_behavior: 'none' });
    await stripeCall('subscription quantity', () => s.subscriptions.update(sub.id, { items: [{ id: item.id, quantity: op.target_quantity as number }], proration_behavior: 'none' }, { idempotencyKey: `${op.id}:qty` }));
    await outcome(op, 'quantity_update', 'updated');
    sub = await stripeCall('subscription read', () => s.subscriptions.retrieve(op.stripe_subscription_id as string));
  }
  const it = sub.items.data[0];
  const r = await rpc<{ outcome: string; code?: string }>('store_add_activate', { p_operation: op.id, p_invoice: inv.id, p_paid_cents: inv.amount_paid, p_currency: inv.currency,
    p_quantity: it.quantity, p_period_start: iso(it.current_period_start), p_period_end: iso(it.current_period_end) });
  if (r.outcome !== 'activated' && r.outcome !== 'already_activated') logServer('store activate', new PortalError('retry_later', `activation ${r.outcome} ${r.code ?? ''}`));
}

// ---------------------------------------------------------------- R1/R2 removal and undo
export async function requestLifecycle(userClient: SupabaseClient, kind: 'store_removal' | 'store_removal_undo', businessId: string, intentKey: string): Promise<StatusView> {
  const ctx = await ownerContext(userClient);
  const b = await liveBinding(ctx, { forAdd: false });
  const r = await rpc<{ operation?: OperationRow; error?: string }>('store_lifecycle_request', { p_kind: kind, p_account: ctx.accountId, p_actor: ctx.userId, p_business: businessId,
    p_intent: intentKey, p_customer: ctx.customerId, p_subscription: ctx.subscriptionId, p_item: b.item.id, p_unit: b.unitCents, p_quantity: b.quantity,
    p_period_start: iso(b.periodStart), p_period_end: iso(b.periodEnd) });
  if (r.error) refuse(r.error);
  await advanceStoreOperation((r.operation as OperationRow).id).catch((e) => logServer('store lifecycle advance', e));
  return statusFor(ctx, (r.operation as OperationRow).id);
}
/** Absolute quantity, no proration, re-read, then the period-bound SQL commit (attention on any mismatch). */
async function advanceLifecycle(op: OperationRow, l: Lease): Promise<string> {
  if (op.state !== 'requested') return op.state;
  const s = stripe();
  let sub = await stripeCall('subscription read', () => s.subscriptions.retrieve(op.stripe_subscription_id as string));
  let item = sub.items.data[0];
  const before = (op.target_quantity as number) + (op.kind === 'store_removal' ? 1 : -1);
  if (item.quantity !== op.target_quantity) {
    if (item.quantity !== before || item.current_period_end !== secs(op.period_end)) {
      await rpc('store_operation_attention', { p_operation: op.id, p_code: item.current_period_end !== secs(op.period_end) ? 'period_changed' : 'quantity_mismatch' });
      return 'attention';
    }
    if (!(await intentRecorded(op, 'quantity_update'))) await intent(op, l, 'quantity_update', `${op.id}:qty`, { quantity: op.target_quantity, proration_behavior: 'none' });
    await stripeCall('subscription quantity', () => s.subscriptions.update(sub.id, { items: [{ id: item.id, quantity: op.target_quantity as number }], proration_behavior: 'none' }, { idempotencyKey: `${op.id}:qty` }));
    await outcome(op, 'quantity_update', 'updated');
    sub = await stripeCall('subscription read', () => s.subscriptions.retrieve(op.stripe_subscription_id as string));
    item = sub.items.data[0];
  }
  const r = await rpc<{ outcome: string }>('store_lifecycle_commit', { p_operation: op.id, p_owner: l.owner, p_epoch: l.epoch, p_quantity: item.quantity,
    p_period_start: iso(item.current_period_start), p_period_end: iso(item.current_period_end) });
  return r.outcome;
}
