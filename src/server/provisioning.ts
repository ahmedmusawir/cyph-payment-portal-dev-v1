// APBM007A — the provisioning saga (DATA-01, AC-013, AC-016, AC-017, AC-020).
// Stripe, Supabase Auth, Postgres and email cannot share a transaction. One durable operation carries idempotent
// external steps and one atomic Postgres step, and can be advanced again from any point by the same call.
import { randomUUID } from 'node:crypto';
import type Stripe from 'stripe';
import { sendSignInLink } from '@/server/accessEmail';
import { admin, rpc } from '@/server/db';
import { logServer, PortalError } from '@/server/errors';
import { ownOrigin, peerOrigin } from '@/lib/appIdentity';
import { loadOperation, type OperationRow, proveUnpaidAndRelease } from '@/server/checkout';
import { idOf, mirrorPayload } from '@/server/stripeMirror';
import { stripe, stripeCall } from '@/server/stripeClient';

// One lease owner per call, never per process. A per-process owner let the webhook deliveries and the status poll that
// one server process handles share a lease and run at once (F-Q4-003). A competing call waits a bounded time for the
// holder to finish and then sees its outcome, so concurrent events and polls converge instead of failing as busy.
const LEASE_SECONDS = 60;
const LEASE_WAIT_MS = 8_000;
const LEASE_POLL_MS = 250;
class LeaseLost extends Error {}
export type AdvanceResult = 'provisioned' | 'pending' | 'expired_unpaid' | 'attention' | 'busy' | 'unknown';

interface DraftFacts { id: string; owner_email: string; owner_first_name: string; owner_last_name: string; signed_in_user_id: string | null }
interface AuthUser { id: string; email?: string; created_at?: string; app_metadata?: Record<string, unknown> }

async function acquireLease(operationId: string, worker: string, waitMs: number): Promise<boolean> {
  const until = Date.now() + waitMs;
  for (;;) {
    if (await rpc<boolean>('operation_lease', { p_operation: operationId, p_owner: worker, p_seconds: LEASE_SECONDS })) return true;
    if (Date.now() >= until) return false;
    await new Promise((r) => setTimeout(r, LEASE_POLL_MS));
  }
}

/** Write to the operation only while this call still holds its lease. A call that lost it stops and writes nothing. */
async function leasedUpdate(id: string, worker: string, patch: Record<string, unknown>): Promise<void> {
  const r = await admin().from('checkout_operations').update(patch).eq('id', id).eq('lease_owner', worker).select('id');
  if (r.error) throw new PortalError('provider_unavailable', `operation update ${r.error.code}`);
  if (!r.data || r.data.length === 0) throw new LeaseLost();
}
const renewLease = (id: string, worker: string) => leasedUpdate(id, worker, { lease_expires_at: new Date(Date.now() + LEASE_SECONDS * 1000).toISOString() });

/**
 * Advance one operation as far as the facts allow. Safe to call from the webhook, from the status poll and from the
 * operator command, concurrently: a bounded lease lets one caller work and the database step is exactly-once.
 */
export async function advanceOperation(operationId: string, opts: { waitMs?: number } = {}): Promise<AdvanceResult> {
  const worker = `pp-${randomUUID()}`;
  if (!(await acquireLease(operationId, worker, opts.waitMs ?? LEASE_WAIT_MS))) return 'busy';
  try {
    const op = await loadOperation(operationId);
    if (!op) return 'unknown';
    if (op.status === 'expired_unpaid') return 'expired_unpaid';
    if (op.status === 'provisioned') { await ensureAccessNotification(op); return 'provisioned'; }
    if (!op.stripe_checkout_session_id) return 'pending';

    // 1. Authoritative payment facts, read now from Stripe. A return URL or a session ID proves nothing.
    const s = stripe();
    const session = await stripeCall('session read', () => s.checkout.sessions.retrieve(op.stripe_checkout_session_id!));
    if (session.livemode || session.mode !== 'subscription' || session.client_reference_id !== op.id || idOf(session.customer as string) !== op.stripe_customer_id) {
      return await attention(op, worker, 'session_mismatch');
    }
    if (session.status === 'expired' && session.payment_status !== 'paid') { await proveUnpaidAndRelease(op.id); return 'expired_unpaid'; }
    if (session.status !== 'complete' || session.payment_status !== 'paid') return 'pending';
    const subscriptionId = idOf(session.subscription as string | { id: string } | null);
    if (!subscriptionId) return await attention(op, worker, 'no_subscription');
    const readAt = new Date();
    const sub = await stripeCall('subscription read', () => s.subscriptions.retrieve(subscriptionId, { expand: ['latest_invoice'] }));
    const invoice = sub.latest_invoice as Stripe.Invoice | null;
    const item = sub.items.data[0];
    const settled = sub.status === 'active' && !!invoice && typeof invoice !== 'string' && invoice.status === 'paid';
    if (!settled) return 'pending';   // first invoice not settled: no provisioning, no paid access
    if (sub.items.data.length !== 1 || item.price.id !== op.expected_price_id || item.quantity !== 1 || invoice.currency !== 'usd'
        || invoice.amount_paid !== op.expected_total_cents || idOf(sub.customer as string) !== op.stripe_customer_id) {
      return await attention(op, worker, 'payment_mismatch');
    }
    if (op.status === 'created' || op.status === 'checkout_open' || op.status === 'attention') {
      await leasedUpdate(op.id, worker, { status: 'paid', stripe_subscription_id: sub.id, stripe_invoice_id: invoice.id, last_error_code: null });
      await admin().from('registration_drafts').update({ status: 'paid' }).eq('id', op.draft_id).in('status', ['checkout_started', 'draft']);
    }

    // 2. The owner's identity. An existing identity must prove control by signing in before anything attaches to it.
    const d = await admin().from('registration_drafts').select('id,owner_email,owner_first_name,owner_last_name,signed_in_user_id').eq('id', op.draft_id).single();
    if (d.error) throw new PortalError('provider_unavailable', `draft read ${d.error.code}`);
    const draft = d.data as DraftFacts;
    await renewLease(op.id, worker);
    const owner = await resolveOwner(op, draft, worker);
    if (!owner) { await ensureAccessNotification({ ...op, status: 'attention', last_error_code: 'owner_signin_required' }); return 'attention'; }

    // 3. One Postgres transaction: account, store, designated admin, mapping, subscription mirror.
    await leasedUpdate(op.id, worker, { status: 'provisioning', owner_user_id: owner.userId, owner_was_existing: owner.existing,
      lease_expires_at: new Date(Date.now() + LEASE_SECONDS * 1000).toISOString() });
    const result = await rpc<{ outcome: string }>('provision_paid_registration', {
      p_operation: op.id, p_owner_user: owner.userId, p_sub: mirrorPayload(sub, readAt),
    });
    if (result.outcome !== 'provisioned' && result.outcome !== 'already_provisioned') return await attention(op, worker, result.outcome);

    // 4. Paid and provisioned are recorded before any email is attempted.
    const done = await loadOperation(op.id);
    if (done) await ensureAccessNotification(done);
    return 'provisioned';
  } catch (e) {
    if (e instanceof LeaseLost) return 'busy';   // another call took over; its outcome stands
    logServer('advance', e);
    throw e;
  } finally {
    await admin().from('checkout_operations').update({ lease_owner: null, lease_expires_at: null }).eq('id', operationId).eq('lease_owner', worker);
  }
}

async function attention(op: OperationRow, worker: string, code: string): Promise<'attention'> {
  await leasedUpdate(op.id, worker, { status: 'attention', last_error_code: code });
  return 'attention';
}

/** Find an Auth user by exact address through the admin API: ID, creation time and server-set metadata only. */
async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?per_page=50&filter=${encodeURIComponent(email)}`;
  const key = process.env.SUPABASE_SECRET_KEY!;
  const r = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(10_000), cache: 'no-store' });
  if (!r.ok) throw new PortalError('provider_unavailable', `auth lookup ${r.status}`);
  const body = (await r.json()) as { users?: AuthUser[] };
  const u = body.users?.find((x) => (x.email || '').toLowerCase() === email);
  return u ? { id: u.id, created_at: u.created_at, app_metadata: u.app_metadata } : null;
}
const findUserIdByEmail = async (email: string): Promise<string | null> => (await findUserByEmail(email))?.id ?? null;

/**
 * Whether an identity found by address was created by this operation (F-Q4-003). New identities carry this operation's
 * ID in server-set app_metadata from the moment they are created. An identity created before that marker existed counts
 * only if it is the one this operation itself recorded, it was created after the operation began, and the purchaser
 * was not signed in at checkout. Any other identity is someone's existing account and must prove control by signing in.
 */
function createdByOperation(op: OperationRow, user: AuthUser, draft: DraftFacts): boolean {
  const marker = user.app_metadata?.apbm_operation;
  if (marker !== undefined) return marker === op.id;
  return op.owner_user_id === user.id && !draft.signed_in_user_id && !!user.created_at && !!op.created_at
    && Date.parse(user.created_at) >= Date.parse(op.created_at);
}

/**
 * New address: create the identity with the explicit admin create call (never by link generation, F-A1), with no
 * password. Existing address: usable only when the purchaser was signed in as that identity at checkout, or has
 * since signed in (resumeForUser). Never resets a password or a role.
 */
async function resolveOwner(op: OperationRow, draft: DraftFacts, worker: string): Promise<{ userId: string; existing: boolean } | null> {
  if (op.owner_user_id && op.owner_was_existing === false) return { userId: op.owner_user_id, existing: false };
  const signInRequired = async () => {
    await leasedUpdate(op.id, worker, { status: 'attention', last_error_code: 'owner_signin_required', owner_was_existing: true });
    return null;
  };
  const ours = async (userId: string) => {
    await leasedUpdate(op.id, worker, { owner_user_id: userId, owner_was_existing: false });
    return { userId, existing: false };
  };
  const found = await findUserByEmail(draft.owner_email);
  if (found) {
    if (createdByOperation(op, found, draft)) return ours(found.id);
    if (draft.signed_in_user_id === found.id) return { userId: found.id, existing: true };
    return signInRequired();
  }
  const created = await admin().auth.admin.createUser({
    email: draft.owner_email, email_confirm: true,
    user_metadata: { full_name: `${draft.owner_first_name} ${draft.owner_last_name}`.trim() },
    app_metadata: { apbm_operation: op.id },
  });
  if (created.error) {
    // An identity appeared between the lookup and the create. Ours only if it carries this operation's marker.
    const raced = await findUserByEmail(draft.owner_email);
    if (!raced) throw new PortalError('provider_unavailable', `auth create ${created.error.status ?? ''}`);
    return createdByOperation(op, raced, draft) ? ours(raced.id) : signInRequired();
  }
  return ours(created.data.user.id);
}

/**
 * After a person signs in to the portal, attach any paid registration that was waiting for proof of control of
 * their address. Called from the authenticated landing; does nothing when there is nothing waiting.
 */
export async function resumeForUser(userId: string, email: string): Promise<number> {
  const drafts = await admin().from('registration_drafts').select('id').eq('owner_email', email.toLowerCase()).eq('status', 'paid');
  if (drafts.error || !drafts.data.length) return 0;
  const ops = await admin().from('checkout_operations').select('id,draft_id').in('draft_id', drafts.data.map((d) => d.id))
    .eq('status', 'attention').eq('last_error_code', 'owner_signin_required');
  if (ops.error) return 0;
  let advanced = 0;
  for (const op of ops.data) {
    await admin().from('registration_drafts').update({ signed_in_user_id: userId }).eq('id', op.draft_id);
    try { if ((await advanceOperation(op.id)) === 'provisioned') advanced++; } catch (e) { logServer('resume', e); }
  }
  return advanced;
}

/**
 * The owner's access email: one retryable notification operation per registration. Provider acceptance is recorded as
 * "sent"; it is not proof of inbox delivery. A purchaser who was signed in gets no tokened link at all (contract §7).
 */
export async function ensureAccessNotification(op: OperationRow, opts: { resend?: boolean } = {}): Promise<'sent' | 'pending' | 'failed' | 'not_needed'> {
  const d = await admin().from('registration_drafts').select('owner_email,signed_in_user_id').eq('id', op.draft_id).single();
  if (d.error) throw new PortalError('provider_unavailable', `draft read ${d.error.code}`);
  const userId = op.owner_user_id ?? (await findUserIdByEmail(d.data.owner_email));
  if (!userId) return 'pending';
  const signedInPurchase = !!d.data.signed_in_user_id && op.status === 'provisioned';
  const dedupe = `access:${op.id}`;
  const existing = await admin().from('notification_operations').select('id,status,attempts,updated_at').eq('dedupe_key', dedupe).maybeSingle();
  if (existing.error) throw new PortalError('provider_unavailable', `notification read ${existing.error.code}`);
  let row = existing.data;
  if (!row) {
    const ins = await admin().from('notification_operations').insert({
      kind: signedInPurchase ? 'purchase_notice' : 'access_link', dedupe_key: dedupe, operation_id: op.id, account_id: op.account_id, user_id: userId,
      status: signedInPurchase ? 'sent' : 'pending', sent_at: signedInPurchase ? new Date().toISOString() : null,
    }).select('id,status,attempts,updated_at').maybeSingle();
    if (ins.error && ins.error.code !== '23505') throw new PortalError('provider_unavailable', `notification insert ${ins.error.code}`);
    row = ins.data ?? (await admin().from('notification_operations').select('id,status,attempts,updated_at').eq('dedupe_key', dedupe).single()).data;
  }
  if (!row) return 'pending';
  if (signedInPurchase) return 'not_needed';
  if (row.status === 'sent' && !opts.resend) return 'sent';
  // Resend is bounded: at most one request a minute, matching the provider's own interval (F-A3).
  if (row.attempts > 0 && Date.now() - Date.parse(row.updated_at) < 60_000) return row.status as 'sent' | 'pending' | 'failed';
  // Claim this attempt before asking the mailer. Only the caller whose claim lands sends, so two concurrent callers never
  // request two links for one address; before, the second request was refused by Auth (429) and its failure replaced
  // the first send's result (F-Q4-004).
  const claim = await admin().from('notification_operations').update({ attempts: row.attempts + 1 })
    .eq('id', row.id).eq('attempts', row.attempts).select('id').maybeSingle();
  if (claim.error) throw new PortalError('provider_unavailable', `notification claim ${claim.error.code}`);
  if (!claim.data) return row.status as 'sent' | 'pending' | 'failed';

  // A new owner lands in OwedBook. An existing identity that still has to prove control lands here, in the portal,
  // where signing in attaches the paid registration.
  const landing = op.last_error_code === 'owner_signin_required' ? ownOrigin() : peerOrigin();
  const sent = await sendSignInLink(d.data.owner_email, `${landing}/api/auth/confirm`);
  const ok = sent.ok;
  await admin().from('notification_operations').update({
    status: ok ? 'sent' : 'failed', sent_at: ok ? new Date().toISOString() : null,
    last_error_code: ok ? null : sent.code ?? 'error',
    kind: row.attempts > 0 ? 'access_link_resend' : 'access_link',
  }).eq('id', row.id).eq('attempts', row.attempts + 1);
  return ok ? 'sent' : 'failed';
}
