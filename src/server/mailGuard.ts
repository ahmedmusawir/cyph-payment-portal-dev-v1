// APBM-007B — runtime mail guard (CONTRACTS/CLOCK_AND_NOTICES.md). Default ON and not switchable off in this release:
// an address may receive mail only if it is listed exactly (normalized) in MAIL_ALLOWLIST. Absent or empty means deny
// all. No wildcard. MAIL_GUARD=off is ignored by design. Every new mail adapter calls this before any provider request.
const normalize = (a: string) => a.trim().toLowerCase();

export function mailAllowlist(): Set<string> {
  return new Set((process.env.MAIL_ALLOWLIST || '').split(',').map(normalize).filter((a) => /^[^@\s,*]+@[^@\s,*]+\.[^@\s,*]+$/.test(a)));
}
export function mailAllowed(address: string): boolean {
  return mailAllowlist().has(normalize(address));
}
/** Counted locally only: a blocked address consumes no provider dispatch. */
export function guardDecision(address: string): { allowed: boolean; reason: 'allowlisted' | 'blocked_not_allowlisted' } {
  return mailAllowed(address) ? { allowed: true, reason: 'allowlisted' } : { allowed: false, reason: 'blocked_not_allowlisted' };
}
