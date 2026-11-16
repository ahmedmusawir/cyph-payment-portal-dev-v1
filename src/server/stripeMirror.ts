// APBM007A — turn the authoritative Stripe subscription into the mirror payload (BILL-01 "Lifecycle and access", RA-4).
// Both cancellation fields are carried as Stripe returns them. Periods live on the subscription item in this API version.
import type Stripe from 'stripe';

export const POLICY_VERSION = 'access-v1';

// Ownership markers written by checkout on the customer, the session and the subscription at creation (F-Q1-01).
// `apbm_db` names the database (Supabase project) the operation lives in, so an environment sharing the sandbox
// can tell its own objects from another's. Objects created before the repair carry only `apbm_run`.
export const RUN_TAG = 'apbm007a';
export const ENV_TAG = (): string => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname.split('.')[0] || 'unknown'; } catch { return 'unknown'; }
};
type OurStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
const STATUS: Record<string, OurStatus> = {
  active: 'active', trialing: 'trialing', past_due: 'past_due', canceled: 'canceled', unpaid: 'unpaid',
  incomplete: 'incomplete', incomplete_expired: 'canceled', paused: 'unpaid',
};
const iso = (unix: number | null | undefined): string | null => (typeof unix === 'number' ? new Date(unix * 1000).toISOString() : null);
export const idOf = (v: string | { id: string } | null | undefined): string | null => (!v ? null : typeof v === 'string' ? v : v.id);

export interface MirrorPayload {
  customer_id: string | null; subscription_id: string; status: OurStatus; raw_status: string; quantity: number | null;
  price_id: string | null; item_id: string | null; current_period_start: string | null; current_period_end: string | null;
  cancel_at_period_end: boolean; cancel_at: string | null; latest_invoice_id: string | null; latest_invoice_status: string | null;
  verified_at: string; policy_version: string;
}

/** `readAt` is when the server read the object from Stripe; it orders competing mirror updates. */
export function mirrorPayload(sub: Stripe.Subscription, readAt: Date): MirrorPayload {
  const item = sub.items?.data?.[0];
  const invoice = sub.latest_invoice;
  return {
    customer_id: idOf(sub.customer as string | { id: string }), subscription_id: sub.id,
    status: STATUS[sub.status] ?? 'incomplete', raw_status: sub.status,
    quantity: item?.quantity ?? null, price_id: item?.price?.id ?? null, item_id: item?.id ?? null,
    current_period_start: iso(item?.current_period_start), current_period_end: iso(item?.current_period_end),
    cancel_at_period_end: !!sub.cancel_at_period_end, cancel_at: iso(sub.cancel_at),
    latest_invoice_id: idOf(invoice as string | { id: string } | null),
    latest_invoice_status: invoice && typeof invoice !== 'string' ? invoice.status ?? null : null,
    verified_at: readAt.toISOString(), policy_version: POLICY_VERSION,
  };
}
