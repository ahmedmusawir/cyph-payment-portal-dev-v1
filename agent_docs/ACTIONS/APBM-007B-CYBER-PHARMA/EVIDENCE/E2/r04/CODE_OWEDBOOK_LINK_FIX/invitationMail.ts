// APBM-007B — OwedBook's narrow privileged invitation module (Director ruling 5). The ONLY 007B use of the service key in
// OwedBook: invited-identity creation and invitation sign-in delivery, called only AFTER the user-authorized SQL check
// (invitation_create / invitation_resend_check) succeeded for the caller. No public signup; an existing identity is
// reused with no password reset. The mail guard runs BEFORE the dispatch claim, so a blocked address consumes no attempt.
// Logs carry fixed text and provider codes only, never an address or token.
import { admin } from '@/server/db';
import { createClient as createPlainClient } from '@supabase/supabase-js';
import { ownOrigin } from '@/lib/appIdentity';
import { guardDecision } from '@/server/mailGuard';

const log = (step: string, reason: string): void => console.error(`[invitation-mail:${step}] ${reason}`);

export type DispatchResult = { status: 'sent' | 'blocked' | 'refused' | 'failed'; reason?: string; attemptsRemaining?: number };

async function invitedEmail(invitationId: string): Promise<string | null> {
  const r = await admin().from('store_invitations').select('email,status').eq('id', invitationId).maybeSingle();
  if (r.error || !r.data || (r.data as { status: string }).status !== 'pending') return null;
  return (r.data as { email: string }).email;
}

async function ensureIdentity(email: string): Promise<'existing' | 'created' | 'failed'> {
  const created = await admin().auth.admin.createUser({ email, email_confirm: true });
  if (!created.error) return 'created';
  // Already registered: reuse it, nothing about the identity is changed (no password reset).
  if (created.error.status === 422 || /already/i.test(created.error.message)) return 'existing';
  log('identity', `create refused ${created.error.status ?? ''}`.trim());
  return 'failed';
}

/** Dispatch one invitation email after the caller's SQL authority check passed. */
export async function dispatchInvitation(invitationId: string): Promise<DispatchResult> {
  const email = await invitedEmail(invitationId);
  if (!email) return { status: 'refused', reason: 'not_pending' };
  const guard = guardDecision(email);
  if (!guard.allowed) { log('guard', 'blocked: recipient not allowlisted'); return { status: 'blocked', reason: guard.reason }; }
  const claim = await admin().rpc('invitation_dispatch_claim', { p_invitation: invitationId });
  if (claim.error) { log('claim', `rpc ${claim.error.code}`); return { status: 'failed', reason: 'claim_failed' }; }
  const c = claim.data as { error?: string; attempts_remaining?: number };
  if (c.error) return { status: 'refused', reason: c.error };
  const identity = await ensureIdentity(email);
  if (identity === 'failed') return { status: 'failed', reason: 'identity', attemptsRemaining: c.attempts_remaining };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { status: 'failed', reason: 'configuration' };
  const anon = createPlainClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  // The EXACT allowlisted confirm address with nothing appended: the approved magic-link template builds
  // `{{ .RedirectTo }}?token_hash=…`, so any query here would break the link (APBM-007A template rule). The invitee
  // reaches /invitations because confirmSubmit sends a person with pending invitations there after sign-in.
  const sent = await anon.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${ownOrigin()}/api/auth/confirm` } });
  if (sent.error) { log('send', `provider ${sent.error.status ?? sent.error.code ?? 'error'}`); return { status: 'failed', reason: 'provider', attemptsRemaining: c.attempts_remaining }; }
  return { status: 'sent', attemptsRemaining: c.attempts_remaining };
}
