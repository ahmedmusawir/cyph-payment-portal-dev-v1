// APBM007A — owner-only billing operations (AC-027, AC-029, AC-030, RA-2, RA-4, RA-5, RA-6).
// Authority is decided in the database: owner_billing_overview() raises for anyone who is not the account owner.
// Stripe identifiers are resolved here with the service role only after that check has passed.
import { randomUUID } from 'node:crypto';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { admin } from '@/server/db';
import { PortalError } from '@/server/errors';
import { ownOrigin } from '@/lib/appIdentity';
import { idOf } from '@/server/stripeMirror';
import { assertStripeAccount, stripe, stripeCall, stripeNames } from '@/server/stripeClient';
import { mirror } from '@/server/webhook';

export interface Overview {
  account_id: string;
  access: { state: string; read_only: boolean; origin: string | null; grace_ends_at: string | null; cancel_scheduled?: boolean; policy_version: string };
  subscription: null | {
    id: string; origin: 'stripe' | 'synthetic_seed'; status: string | null; raw_status: string | null; quantity: number | null;
    current_period_start: string | null; current_period_end: string | null; cancel_at: string | null; cancel_at_period_end: boolean;
    paid_through: string | null; latest_invoice_status: string | null; grace_started_at: string | null; verified_at: string | null;
  };
  stores: { id: string; name: string; npi: string; status: string; removal_effective_at?: string | null }[];
  billable_count?: number;
}

/** Synthetic fixtures are honoured only where the flag is on (local, DEV, staging). Elsewhere they grant nothing. */
export const syntheticAllowed = (): boolean => process.env.ALLOW_SYNTHETIC_SUBSCRIPTIONS === 'true';

/** The signed-in user's own billing overview. `userClient` is the cookie-bound client, so RLS and auth.uid() apply. */
export async function ownerOverview(userClient: SupabaseClient): Promise<Overview> {
  const r = await userClient.rpc('owner_billing_overview');
  if (r.error) {
    if (r.error.code === '42501') throw new PortalError('not_owner', 'overview denied');
    throw new PortalError('provider_unavailable', `overview ${r.error.code}`);
  }
  const o = r.data as Overview;
  if (o.subscription?.origin === 'synthetic_seed' && !syntheticAllowed()) {
    return { ...o, access: { ...o.access, state: 'none', read_only: false } };
  }
  return o;
}

interface StripeLink { stripe_customer_id: string; stripe_subscription_id: string }
/** Resolve the owner's Stripe link. Refuses synthetic rows: Stripe is never called for them. */
async function stripeLinkFor(userClient: SupabaseClient): Promise<StripeLink> {
  const o = await ownerOverview(userClient);
  if (!o.subscription) throw new PortalError('not_found', 'no subscription');
  if (o.subscription.origin !== 'stripe') throw new PortalError('not_billable', 'synthetic subscription');
  const r = await admin().from('subscriptions').select('stripe_customer_id,stripe_subscription_id').eq('id', o.subscription.id).eq('account_id', o.account_id).eq('origin', 'stripe').maybeSingle();
  if (r.error) throw new PortalError('provider_unavailable', `subscription read ${r.error.code}`);
  if (!r.data?.stripe_customer_id || !r.data.stripe_subscription_id) throw new PortalError('not_found', 'no stripe link');
  return r.data as StripeLink;
}

export interface PaymentMethodView { onFile: boolean; brand?: string; last4?: string }
/**
 * Whether a card is on file, read live. A subscription-level default counts as well as the customer default;
 * absence is not inferred from one field alone (BILL-01).
 */
export async function paymentMethod(userClient: SupabaseClient): Promise<PaymentMethodView> {
  const link = await stripeLinkFor(userClient);
  await assertStripeAccount();
  const s = stripe();
  const sub = await stripeCall('subscription read', () => s.subscriptions.retrieve(link.stripe_subscription_id, { expand: ['default_payment_method'] }));
  let pm = sub.default_payment_method as Stripe.PaymentMethod | string | null;
  if (!pm) {
    const customer = await stripeCall('customer read', () => s.customers.retrieve(link.stripe_customer_id, { expand: ['invoice_settings.default_payment_method'] }));
    if (!('deleted' in customer && customer.deleted)) pm = (customer as Stripe.Customer).invoice_settings?.default_payment_method as Stripe.PaymentMethod | string | null;
  }
  if (!pm) {
    const list = await stripeCall('payment methods', () => s.paymentMethods.list({ customer: link.stripe_customer_id, type: 'card', limit: 1 }));
    pm = list.data[0] ?? null;
  }
  if (!pm) return { onFile: false };
  if (typeof pm === 'string') return { onFile: true };
  return { onFile: true, brand: pm.card?.brand, last4: pm.card?.last4 };
}

/**
 * The single place a Billing Portal session is created. The configuration is a required argument: there is no
 * path that falls back to the account default (RA-5, F-S2).
 */
export async function createPortalSession(customer: string, configuration: string, returnUrl: string): Promise<string> {
  if (!/^bpc_/.test(configuration)) throw new PortalError('configuration', 'portal configuration missing');
  const session = await stripeCall('portal session', () => stripe().billingPortal.sessions.create({ customer, configuration, return_url: returnUrl }));
  return session.url;
}

export async function openBillingPortal(userClient: SupabaseClient): Promise<{ url: string }> {
  const link = await stripeLinkFor(userClient);
  await assertStripeAccount();
  await assertPortalConfiguration();
  return { url: await createPortalSession(link.stripe_customer_id, stripeNames().portalConfiguration, `${ownOrigin()}/billing`) };
}

let portalChecked = false;
/** Startup-style check, run before the first portal session: the configured ID is active and restrictive. */
export async function assertPortalConfiguration(): Promise<void> {
  if (portalChecked) return;
  const id = stripeNames().portalConfiguration;
  let cfg: Stripe.BillingPortal.Configuration;
  try { cfg = await stripe().billingPortal.configurations.retrieve(id); } catch { throw new PortalError('configuration', 'portal configuration not found'); }
  const f = cfg.features;
  const ok = cfg.active && !cfg.livemode && f.subscription_update.enabled === false && f.customer_update.enabled === false
    && f.subscription_cancel.enabled === true && f.subscription_cancel.mode === 'at_period_end'
    && f.payment_method_update.enabled === true && f.invoice_history.enabled === true;
  if (!ok) throw new PortalError('configuration', 'portal configuration inactive or not restrictive');
  portalChecked = true;
}
export function __resetPortalCheckForTests(): void { portalChecked = false; }

/**
 * Undo a scheduled cancellation on the SAME subscription (RA-4). Either field can be set, or both: the flag, the
 * cancel_at date the hosted portal uses. They are cleared one at a time, re-reading in between, because Stripe may
 * clear the date itself when the flag is cleared and the two parameters are never sent together. Success is claimed
 * only after a read that shows both clear. Every step is safe to repeat, so a failure part-way is finished by a retry.
 */
export async function undoCancellation(userClient: SupabaseClient): Promise<{ cleared: boolean }> {
  const link = await stripeLinkFor(userClient);
  await assertStripeAccount();
  const s = stripe();
  const id = link.stripe_subscription_id;
  const read = () => stripeCall('subscription read', () => s.subscriptions.retrieve(id));
  // A fresh key for every update. Clearing a schedule is harmless to repeat, and a key derived from the schedule
  // (as before) is replayed by Stripe for 24 hours: a second cancel-and-undo with the same period end got the cached
  // answer of the first undo and nothing was changed (found in the integrated proof, 13 November).
  const update = (patch: Stripe.SubscriptionUpdateParams) =>
    stripeCall('subscription update', () => s.subscriptions.update(id, patch, { idempotencyKey: `undo:${id}:${randomUUID()}` }));
  let current = await read();
  if (current.status === 'canceled') throw new PortalError('expired', 'subscription already ended');
  if (idOf(current.customer as string) !== link.stripe_customer_id) throw new PortalError('provider_unavailable', 'customer mismatch');
  if (current.cancel_at_period_end) {
    await update({ cancel_at_period_end: false });
    current = await read();
  }
  if (current.cancel_at) {
    await update({ cancel_at: '' });
    current = await read();
  }
  const cleared = !current.cancel_at_period_end && !current.cancel_at;
  await mirror(id);
  if (!cleared) throw new PortalError('provider_unavailable', 'schedule still set after update');
  return { cleared };
}
