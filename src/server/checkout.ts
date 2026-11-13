// APBM007A — one durable checkout operation per accepted draft revision (BILL-01, AC-009..AC-013).
// The operation is claimed in the database before any Stripe call; customer and session creation use stable
// idempotency keys derived from it; after a timeout the same operation is reconciled, never duplicated.
import type Stripe from 'stripe';
import { admin, rpc } from '@/server/db';
import { PortalError } from '@/server/errors';
import { ownOrigin } from '@/lib/appIdentity';
import { resolvePromotion, TERMS_VERSION } from '@/server/pricing';
import { type DraftRow, holdNpi, loadDraft, quoteIsCurrent, setUnpaidProver } from '@/server/registration';
import { assertStripeAccount, stripe, stripeCall, stripeNames } from '@/server/stripeClient';
import { ENV_TAG, RUN_TAG } from '@/server/stripeMirror';

const marker = (operationId: string) => ({ apbm_operation: operationId, apbm_run: RUN_TAG, apbm_db: ENV_TAG() });
const CHECKOUT_LIFETIME_S = 31 * 60;   // Stripe's minimum is 30 minutes; one minute of margin

export interface OperationRow {
  id: string; idempotency_key: string; draft_id: string; draft_revision: number; npi: string;
  expected_total_cents: number; expected_price_id: string; promotion_code: string | null;
  status: 'created' | 'checkout_open' | 'paid' | 'provisioning' | 'provisioned' | 'expired_unpaid' | 'attention';
  stripe_customer_id: string | null; stripe_checkout_session_id: string | null; stripe_subscription_id: string | null;
  stripe_invoice_id: string | null; checkout_expires_at: string | null; owner_user_id: string | null; owner_was_existing: boolean | null;
  account_id: string | null; business_id: string | null; last_error_code: string | null;
}
export const OP_COLUMNS = 'id,idempotency_key,draft_id,draft_revision,npi,expected_total_cents,expected_price_id,promotion_code,status,stripe_customer_id,stripe_checkout_session_id,stripe_subscription_id,stripe_invoice_id,checkout_expires_at,owner_user_id,owner_was_existing,account_id,business_id,last_error_code';
const OPEN = ['created', 'checkout_open', 'paid', 'provisioning', 'attention'];

export async function loadOperation(id: string): Promise<OperationRow | null> {
  const r = await admin().from('checkout_operations').select(OP_COLUMNS).eq('id', id).maybeSingle();
  if (r.error) throw new PortalError('provider_unavailable', `operation read ${r.error.code}`);
  return (r.data as OperationRow | null) ?? null;
}
export async function latestOperationForDraft(draftId: string): Promise<OperationRow | null> {
  const r = await admin().from('checkout_operations').select(OP_COLUMNS).eq('draft_id', draftId).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (r.error) throw new PortalError('provider_unavailable', `operation read ${r.error.code}`);
  return (r.data as OperationRow | null) ?? null;
}
export async function updateOperation(id: string, patch: Record<string, unknown>): Promise<void> {
  const r = await admin().from('checkout_operations').update(patch).eq('id', id);
  if (r.error) throw new PortalError('provider_unavailable', `operation update ${r.error.code}`);
}

export interface Consents { termsAccepted: boolean; recurringChargeAccepted: boolean; priceChangeAccepted: boolean }

/**
 * Start (or resume) Checkout for the draft. `operationKey` is the browser's stable key for this attempt:
 * the same key returns the same session; a different key cannot bypass an unresolved operation.
 */
export async function startCheckout(secret: string | undefined, input: { consents: Consents; operationKey: string }, signedInUserId: string | null): Promise<{ url: string }> {
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(input.operationKey || '')) throw new PortalError('invalid_input', 'operation key');
  const c = input.consents;
  if (!c || c.termsAccepted !== true || c.recurringChargeAccepted !== true || c.priceChangeAccepted !== true) {
    throw new PortalError('invalid_input', 'consent', { consents: 'Accept all three statements to continue.' });
  }
  const draft = await loadDraft(secret);
  if (!draft) throw new PortalError('not_found', 'no draft');
  const { priceId } = stripeNames();
  await assertStripeAccount();

  // Resume: the draft already has an unresolved operation.
  const current = await latestOperationForDraft(draft.id);
  if (current && OPEN.includes(current.status) && current.idempotency_key !== input.operationKey
      && current.status === 'created' && !current.stripe_checkout_session_id) {
    // An earlier attempt was claimed but never produced a Checkout session (the request failed before Stripe
    // answered), so no payment page was ever shown. A browser that lost that attempt's key must not be trapped:
    // the stale operation is closed as unpaid and this request claims a fresh one below.
    await proveUnpaidAndRelease(current.id);
  } else if (current && OPEN.includes(current.status)) {
    if (current.idempotency_key !== input.operationKey) throw new PortalError('operation_in_progress', 'different key');
    if (current.status !== 'created' && current.status !== 'checkout_open') throw new PortalError('operation_in_progress', current.status);
    return { url: await ensureSession(draft, current, priceId) };
  }
  if (draft.status !== 'draft') throw new PortalError('operation_in_progress', `draft is ${draft.status}`);
  if (!quoteIsCurrent(draft) || draft.quote_price_id !== priceId) throw new PortalError('expired', 'quote');
  if (signedInUserId) {
    const owns = await admin().from('accounts').select('id').eq('owner_user_id', signedInUserId).limit(1);
    if (owns.error) throw new PortalError('provider_unavailable', `account read ${owns.error.code}`);
    if (owns.data.length) throw new PortalError('already_subscribed', 'signed-in owner has an account');
  }
  await holdNpi(draft.id, draft.npi!);

  // Record consent against this exact revision, then claim the operation before any Stripe call.
  const consent = await admin().from('registration_drafts').update({
    consent_terms_version: TERMS_VERSION, consent_revision: draft.revision, consent_accepted_at: new Date().toISOString(), signed_in_user_id: signedInUserId,
  }).eq('id', draft.id).eq('revision', draft.revision).eq('status', 'draft').select('id').maybeSingle();
  if (consent.error) throw new PortalError('provider_unavailable', `consent ${consent.error.code}`);
  if (!consent.data) throw new PortalError('operation_in_progress', 'draft changed concurrently');

  const ins = await admin().from('checkout_operations').insert({
    idempotency_key: input.operationKey, draft_id: draft.id, draft_revision: draft.revision, npi: draft.npi,
    expected_total_cents: draft.quote_total_cents, expected_currency: 'usd', expected_price_id: priceId, promotion_code: draft.quote_promotion_code,
  }).select(OP_COLUMNS).maybeSingle();
  if (ins.error) {
    if (ins.error.code === '23505') throw new PortalError('operation_in_progress', 'concurrent claim');   // double submit: the other request owns it
    throw new PortalError('provider_unavailable', `operation insert ${ins.error.code}`);
  }
  return { url: await ensureSession(draft, ins.data as OperationRow, priceId) };
}

/** Create the customer and the Checkout session for an operation, or return the session that already exists. */
async function ensureSession(draft: DraftRow, op: OperationRow, priceId: string): Promise<string> {
  const s = stripe();
  let customerId = op.stripe_customer_id;
  if (!customerId) {
    const customer = await stripeCall('customer create', () => s.customers.create({
      email: draft.owner_email!, name: `${draft.owner_first_name} ${draft.owner_last_name}`.trim(),
      metadata: marker(op.id),
    }, { idempotencyKey: `${op.id}:customer` }));
    customerId = customer.id;
    await updateOperation(op.id, { stripe_customer_id: customerId });
  }
  let session: Stripe.Checkout.Session;
  if (op.stripe_checkout_session_id) {
    session = await stripeCall('session read', () => s.checkout.sessions.retrieve(op.stripe_checkout_session_id!));
  } else {
    const promotion = op.promotion_code ? await resolvePromotion(op.promotion_code) : null;
    const expiresAt = Math.floor(Date.now() / 1000) + CHECKOUT_LIFETIME_S;
    session = await stripeCall('session create', () => s.checkout.sessions.create({
      mode: 'subscription', customer: customerId!, client_reference_id: op.id,
      // USD only (BILL-01). Without this, Stripe's account-level Adaptive Pricing offers a converted local currency
      // (seen in the integrated proof), and the paid invoice would no longer match the USD quote.
      adaptive_pricing: { enabled: false },
      line_items: [{ price: priceId, quantity: 1 }],
      ...(promotion ? { discounts: [{ promotion_code: promotion.promotionCodeId }] } : {}),
      metadata: marker(op.id),
      subscription_data: { metadata: marker(op.id) },
      success_url: `${ownOrigin()}/register/activation`, cancel_url: `${ownOrigin()}/register/review`,
      expires_at: expiresAt,
    }, { idempotencyKey: `${op.id}:session` }));
    // The amount Stripe will charge must equal the server quote. A mismatch never reaches the customer.
    if (session.amount_total !== op.expected_total_cents || session.currency !== 'usd' || session.livemode) {
      await stripeCall('session expire', () => s.checkout.sessions.expire(session.id)).catch(() => undefined);
      await updateOperation(op.id, { stripe_checkout_session_id: session.id, status: 'attention', last_error_code: 'quote_mismatch' });
      throw new PortalError('provider_unavailable', 'checkout total differs from quote');
    }
    const checkoutExpires = new Date(session.expires_at * 1000).toISOString();
    await updateOperation(op.id, { stripe_checkout_session_id: session.id, checkout_expires_at: checkoutExpires, status: 'checkout_open' });
    const bound = await rpc<string>('npi_bind', { p_draft: draft.id, p_operation: op.id, p_checkout_expires: checkoutExpires });
    if (bound !== 'bound') {
      await stripeCall('session expire', () => s.checkout.sessions.expire(session.id)).catch(() => undefined);
      await updateOperation(op.id, { status: 'expired_unpaid', last_error_code: 'reservation_lost' });
      throw new PortalError('npi_unavailable', 'reservation lost before bind');
    }
    const d = await admin().from('registration_drafts').update({ status: 'checkout_started' }).eq('id', draft.id).eq('status', 'draft');
    if (d.error) throw new PortalError('provider_unavailable', `draft status ${d.error.code}`);
  }
  if (session.status !== 'open' || !session.url) throw new PortalError('operation_in_progress', `session ${session.status}`);
  return session.url;
}

/**
 * Proof for RA-7: read the operation's Checkout session once. Only an expired, unpaid session releases the bound
 * reservation; a paid or still-open one keeps it.
 */
export async function proveUnpaidAndRelease(operationId: string): Promise<'released' | 'kept'> {
  const op = await loadOperation(operationId);
  if (!op || !['created', 'checkout_open'].includes(op.status)) return 'kept';
  let expiredUnpaid = !op.stripe_checkout_session_id;   // never reached Stripe: nothing can have been paid
  if (op.stripe_checkout_session_id) {
    const session = await stripeCall('session read', () => stripe().checkout.sessions.retrieve(op.stripe_checkout_session_id!));
    expiredUnpaid = session.status === 'expired' && session.payment_status !== 'paid';
  }
  if (!expiredUnpaid) return 'kept';
  await updateOperation(op.id, { status: 'expired_unpaid' });
  await rpc<string>('npi_release_unpaid', { p_operation: op.id });
  await admin().from('registration_drafts').update({ status: 'draft' }).eq('id', op.draft_id).eq('status', 'checkout_started');
  return 'released';
}
setUnpaidProver(async (operationId) => { await proveUnpaidAndRelease(operationId); });

/**
 * Editing or abandoning after Checkout started: the session is expired through Stripe first, and only then is the
 * reservation released. A session that has already been paid cannot be abandoned.
 */
export async function abandonCheckout(secret: string | undefined): Promise<'draft'> {
  const draft = await loadDraft(secret);
  if (!draft) throw new PortalError('not_found', 'no draft');
  if (draft.status === 'draft') return 'draft';
  const op = await latestOperationForDraft(draft.id);
  if (!op || !['created', 'checkout_open'].includes(op.status)) throw new PortalError('operation_in_progress', op?.status ?? 'no operation');
  if (op.stripe_checkout_session_id) {
    const session = await stripeCall('session read', () => stripe().checkout.sessions.retrieve(op.stripe_checkout_session_id!));
    if (session.status === 'complete' || session.payment_status === 'paid') throw new PortalError('operation_in_progress', 'already paid');
    if (session.status === 'open') await stripeCall('session expire', () => stripe().checkout.sessions.expire(session.id));
  }
  if ((await proveUnpaidAndRelease(op.id)) !== 'released') throw new PortalError('operation_in_progress', 'not provably unpaid');
  return 'draft';
}
