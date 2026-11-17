// APBM-007B — the Add Store pricing rules (CONTRACTS/BILLING.md, BP-01, BP-02). Pure and import-free; the SQL functions
// store_incremental_cents / store_period_window_refusal (migration 0062) implement the same integer arithmetic and are
// the binding authority. Unit tests pin both to the same vectors.

/** The provider's minimum charge for USD (Stripe). A quote below it is refused before any invoice exists. */
export const STRIPE_MIN_CHARGE_USD_CENTS = 50;
/** Add Store and removal/undo are refused inside the last 90 minutes of a period. */
export const PERIOD_END_WINDOW_SECONDS = 90 * 60;
export const QUOTE_TTL_SECONDS = 15 * 60;
export const CONSENT_WINDOW_SECONDS = 30 * 60;
export const DEADLINE_MARGIN_SECONDS = 60 * 60;
export const ADD_STORE_TERMS_VERSION = 'add-store-v1';
export const FIRST_STORE_CENTS = 9900;

/** floor((unit*(e-t) + (e-s)//2) / (e-s)) with t clamped to [s,e]; seconds; integer arithmetic only. */
export function incrementalCents(unitCents: number, periodStart: number, periodEnd: number, at: number): number {
  if (!Number.isInteger(unitCents) || unitCents <= 0 || !Number.isInteger(periodStart) || !Number.isInteger(periodEnd) || periodEnd <= periodStart) {
    throw new Error('invalid billing interval');
  }
  const t = Math.min(Math.max(Math.floor(at), periodStart), periodEnd);
  const len = BigInt(periodEnd - periodStart);
  return Number((BigInt(unitCents) * BigInt(periodEnd - t) + len / 2n) / len);
}

export type WindowRefusal = 'period_end_window' | 'below_minimum_charge';
/** The one shared end-of-period predicate (Add Store, removal scheduling, removal undo). */
export function windowRefusal(unitCents: number, periodStart: number, periodEnd: number, at: number): WindowRefusal | null {
  if (periodEnd - at < PERIOD_END_WINDOW_SECONDS) return 'period_end_window';
  if (incrementalCents(unitCents, periodStart, periodEnd, at) < STRIPE_MIN_CHARGE_USD_CENTS) return 'below_minimum_charge';
  return null;
}

export const nextRenewalCents = (unitCents: number, billableAfter: number): number => FIRST_STORE_CENTS + unitCents * (billableAfter - 1);
export const paymentDeadline = (confirmedAt: number, periodEnd: number): number =>
  Math.min(confirmedAt + CONSENT_WINDOW_SECONDS, periodEnd - DEADLINE_MARGIN_SECONDS);
