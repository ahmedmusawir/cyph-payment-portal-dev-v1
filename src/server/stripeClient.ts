// APBM007A — the portal's only Stripe client (BILL-01). Test mode only, pinned API version, 10-second timeout,
// no automatic retry of any call: an uncertain mutation is reconciled, then retried with its original key.
import Stripe from 'stripe';
import { PortalError } from '@/server/errors';

export const STRIPE_API_VERSION = '2026-04-22.dahlia';
export const STRIPE_TIMEOUT_MS = 10_000;

let client: Stripe | null = null;
let accountChecked = false;

export function stripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!/^(sk|rk)_test_/.test(key)) throw new PortalError('configuration', 'stripe test key required');
  client = new Stripe(key, { apiVersion: STRIPE_API_VERSION, timeout: STRIPE_TIMEOUT_MS, maxNetworkRetries: 0 });
  return client;
}

export interface StripeNames { priceId: string; portalConfiguration: string; expectedAccount: string; webhookSecret: string }
export function stripeNames(): StripeNames {
  const priceId = process.env.STRIPE_PRICE_STORES || '';
  const portalConfiguration = process.env.STRIPE_PORTAL_CONFIGURATION || '';
  const expectedAccount = process.env.STRIPE_EXPECTED_ACCOUNT || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!/^price_/.test(priceId) || !/^bpc_/.test(portalConfiguration) || !/^acct_/.test(expectedAccount) || !/^whsec_/.test(webhookSecret)) {
    throw new PortalError('configuration', 'stripe configuration names missing or malformed');
  }
  return { priceId, portalConfiguration, expectedAccount, webhookSecret };
}

/** Fixed account and mode guard. Checked once per process before the first business call. */
export async function assertStripeAccount(): Promise<void> {
  if (accountChecked) return;
  const { expectedAccount } = stripeNames();
  let id: string;
  try { id = (await stripe().accounts.retrieveCurrent()).id; } catch { throw new PortalError('provider_unavailable', 'account read'); }
  if (id !== expectedAccount) throw new PortalError('configuration', 'stripe account mismatch');
  accountChecked = true;
}

/** Wrap a Stripe call: a card or validation error is the caller's to handle; anything else is provider_unavailable. */
export async function stripeCall<T>(scope: string, fn: () => Promise<T>): Promise<T> {
  try { return await fn(); } catch (e) {
    const type = (e as { type?: string })?.type;
    if (type === 'StripeInvalidRequestError' || type === 'StripeCardError') throw e;
    throw new PortalError('provider_unavailable', `${scope} ${type || 'error'}`);
  }
}

/** Test seam: lets unit tests install a fake client. Never called by application code. */
export function __setStripeForTests(fake: unknown, accountOk = true): void {
  client = fake as Stripe;
  accountChecked = accountOk;
}
