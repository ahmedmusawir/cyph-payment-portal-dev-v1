// APBM007A — honest registration status for the browser that owns the draft (AC-008, AC-034, DATA-01 saga step 5).
// Minimal by design: states only. A paid-but-unconfirmed payment reads as "unknown" and never tells anyone to pay again.
import { admin } from '@/server/db';
import { latestOperationForDraft } from '@/server/checkout';
import { logServer } from '@/server/errors';
import { advanceOperation, ensureAccessNotification } from '@/server/provisioning';
import { loadDraft, maskEmail } from '@/server/registration';

export interface StatusView {
  draft: 'none' | 'editing' | 'checkout' | 'paid' | 'complete';
  payment: 'none' | 'pending' | 'confirmed' | 'expired' | 'unknown';
  provisioning: 'not_started' | 'pending' | 'ready' | 'attention';
  email: 'not_started' | 'pending' | 'sent' | 'failed' | 'not_needed';
  ownerEmailMasked: string;
  /** Why setup needs attention, in customer words. Never an internal code. */
  attention?: 'sign_in_to_finish' | 'contact_support';
  checkoutResumable: boolean;
}

/** `reconcile` asks for one authoritative Stripe read when the browser has just returned from Checkout. */
export async function registrationStatus(secret: string | undefined, opts: { reconcile?: boolean } = {}): Promise<StatusView> {
  const draft = await loadDraft(secret);
  const none: StatusView = { draft: 'none', payment: 'none', provisioning: 'not_started', email: 'not_started', ownerEmailMasked: '', checkoutResumable: false };
  if (!draft) return none;
  let op = await latestOperationForDraft(draft.id);
  let unknown = false;
  if (op && opts.reconcile && ['created', 'checkout_open', 'paid', 'provisioning', 'attention'].includes(op.status)) {
    try { await advanceOperation(op.id); } catch (e) { logServer('status reconcile', e); unknown = true; }
    op = await latestOperationForDraft(draft.id);
  }
  const base = { ...none, ownerEmailMasked: maskEmail(draft.owner_email) };
  if (!op || op.status === 'expired_unpaid') {
    return { ...base, draft: 'editing', payment: op ? 'expired' : 'none' };
  }
  if (op.status === 'created' || op.status === 'checkout_open') {
    return { ...base, draft: 'checkout', payment: unknown ? 'unknown' : 'pending', checkoutResumable: op.status === 'checkout_open' };
  }
  const note = await admin().from('notification_operations').select('status,kind').eq('dedupe_key', `access:${op.id}`).maybeSingle();
  const email: StatusView['email'] = !note.data ? 'not_started' : note.data.kind === 'purchase_notice' ? 'not_needed' : (note.data.status as 'pending' | 'sent' | 'failed');
  if (op.status === 'provisioned') return { ...base, draft: 'complete', payment: 'confirmed', provisioning: 'ready', email };
  if (op.status === 'attention') {
    const paid = !!op.stripe_subscription_id;
    return { ...base, draft: paid ? 'paid' : 'checkout', payment: paid ? 'confirmed' : 'unknown', provisioning: 'attention', email,
      attention: op.last_error_code === 'owner_signin_required' ? 'sign_in_to_finish' : 'contact_support' };
  }
  return { ...base, draft: 'paid', payment: 'confirmed', provisioning: 'pending', email };
}

/** Resend the owner's access email. A notification operation only: it can never charge or provision again. */
export async function resendAccessEmail(secret: string | undefined): Promise<StatusView['email']> {
  const draft = await loadDraft(secret);
  if (!draft) return 'not_started';
  const op = await latestOperationForDraft(draft.id);
  if (!op || !(op.status === 'provisioned' || (op.status === 'attention' && op.last_error_code === 'owner_signin_required'))) return 'not_started';
  return ensureAccessNotification(op, { resend: true });
}
