// APBM-007B — runtime mail guard, identical in both apps (CONTRACTS/CLOCK_AND_NOTICES.md, amended 20 Nov 2026 by the
// Director for stakeholder testing; AMENDMENT_LEDGER.md). Default ON and not switchable off: an address may receive mail
// only if listed exactly (normalized) in MAIL_ALLOWLIST; absent/empty denies all; no wildcard; MAIL_GUARD=off is ignored.
//
// The one explicit exception: MAIL_RECIPIENT_POLICY=open admits any syntactically valid single address (plus aliases
// included) ONLY while this app is bound to the shared DEV/alpha Supabase project below. On any other project, including
// production, "open" is ignored and the exact allowlist applies. Sender, dispatch limits and idempotency are unchanged.
const normalize = (a: string) => a.trim().toLowerCase();
const VALID = /^[^@\s,*]+@[^@\s,*]+\.[^@\s,*]+$/;
export const OPEN_POLICY_PROJECT_REF = 'yrsuwikjnbmvpznrgydb';   // CyberPharma_Dev_v1 (DEV, stakeholder alpha)

export function mailAllowlist(): Set<string> {
  return new Set((process.env.MAIL_ALLOWLIST || '').split(',').map(normalize).filter((a) => VALID.test(a)));
}
export function mailAllowed(address: string): boolean {
  return mailAllowlist().has(normalize(address));
}
/** True only when the open policy is requested AND the app's Supabase project is the DEV/alpha project. Fails closed. */
export function openPolicyActive(): boolean {
  if ((process.env.MAIL_RECIPIENT_POLICY || '').trim().toLowerCase() !== 'open') return false;
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname === `${OPEN_POLICY_PROJECT_REF}.supabase.co`; } catch { return false; }
}
/** Counted locally only: a blocked address consumes no provider dispatch. */
export function guardDecision(address: string): { allowed: boolean; reason: 'allowlisted' | 'open_policy' | 'blocked_not_allowlisted' } {
  if (mailAllowed(address)) return { allowed: true, reason: 'allowlisted' };
  if (openPolicyActive() && VALID.test(normalize(address))) return { allowed: true, reason: 'open_policy' };
  return { allowed: false, reason: 'blocked_not_allowlisted' };
}
