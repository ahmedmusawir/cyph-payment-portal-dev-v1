// APBM007A — minimal operator recovery (AC-038, DATA-01 "Operator can inspect and retry exact pending operations").
// Not a customer route and not an admin UI: a local command (scripts/operator-reconcile.mjs) calls it with a token
// derived from the server key, so no new secret is introduced and the raw key is never sent. It can list unresolved
// operations by safe facts and re-run the SAME idempotent transition for ONE exact operation ID. It cannot issue
// SQL, choose an outcome, change an owner, or touch anything by prefix.
import { createHash, timingSafeEqual } from 'node:crypto';
import { admin } from '@/server/db';
import { advanceOperation } from '@/server/provisioning';
import { loadOperation } from '@/server/checkout';
import { listUnfinishedEvents, recoverEvent } from '@/server/webhook';

// F-Q1-01: Stripe events that are unfinished (or were finalised before the repair without completing) are listed and
// recovered the same way, one exact event ID at a time. See recoverEvent in webhook.ts.
export { listUnfinishedEvents, recoverEvent };

export const operatorToken = (): string => createHash('sha256').update(`${process.env.SUPABASE_SECRET_KEY || ''}:apbm007a-operator-v1`).digest('hex');
export function operatorAuthorized(header: string | null): boolean {
  if (!process.env.SUPABASE_SECRET_KEY) return false;
  const given = (header || '').replace(/^Bearer\s+/i, ''), want = operatorToken();
  return given.length === want.length && timingSafeEqual(Buffer.from(given), Buffer.from(want));
}

const UNRESOLVED = ['created', 'checkout_open', 'paid', 'provisioning', 'attention'];
/** Safe facts only: no address, no Stripe secret, no token. Stripe object IDs are identifiers, not credentials. */
export async function listUnresolved() {
  const r = await admin().from('checkout_operations')
    .select('id,status,last_error_code,attempts,created_at,updated_at,checkout_expires_at,stripe_checkout_session_id,stripe_subscription_id,account_id,business_id')
    .in('status', UNRESOLVED).order('created_at', { ascending: true }).limit(100);
  if (r.error) throw new Error(`operations read ${r.error.code}`);
  return r.data;
}

export async function reconcileOne(operationId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(operationId)) return { result: 'invalid_id' as const };
  const before = await loadOperation(operationId);
  if (!before) return { result: 'unknown_operation' as const };
  const result = await advanceOperation(operationId);
  const after = await loadOperation(operationId);
  return { result, before: before.status, after: after?.status ?? null, lastErrorCode: after?.last_error_code ?? null, accountId: after?.account_id ?? null, businessId: after?.business_id ?? null };
}
