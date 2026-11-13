// APBM007A — server-authoritative pricing (BILL-01, AC-009, AC-010). Catalogue B: one graduated licensed monthly
// USD price; first store 9900 cents, each further store 4900. 007A sells exactly one store.
import type Stripe from 'stripe';
import { PortalError } from '@/server/errors';
import { stripe, stripeCall } from '@/server/stripeClient';

export const FIRST_STORE_CENTS = 9900;
export const ADDITIONAL_STORE_CENTS = 4900;
export const QUOTE_TTL_MS = 30 * 60 * 1000;
export const QUOTE_VERSION = 'quote-v1';
export const TERMS_VERSION = 'terms-2026-11';

export function recurringCents(stores: number): number {
  if (!Number.isInteger(stores) || stores < 1) throw new PortalError('invalid_input', 'store count');
  return FIRST_STORE_CENTS + ADDITIONAL_STORE_CENTS * (stores - 1);
}

/** Server allowlist of APA promotion codes. Possession of an allowlisted, valid code is the eligibility rule. */
export function apaAllowlist(): string[] {
  return (process.env.APA_PROMOTION_CODES || '').split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
}

export interface ResolvedPromotion { code: string; promotionCodeId: string; percentOff: number }

/**
 * Accept a code only when it is on our allowlist AND Stripe says it is an active percent-off promotion.
 * A valid Stripe code outside the allowlist is refused with the same generic answer as an unknown one.
 */
export async function resolvePromotion(input: string): Promise<ResolvedPromotion> {
  const code = input.trim().toUpperCase();
  if (!/^[A-Z0-9]{4,32}$/.test(code) || !apaAllowlist().includes(code)) throw new PortalError('promotion_not_accepted', 'not allowlisted');
  const list = await stripeCall('promotion lookup', () => stripe().promotionCodes.list({ code, active: true, limit: 1, expand: ['data.promotion.coupon'] }));
  const promo = list.data[0] as (Stripe.PromotionCode & { promotion?: { coupon?: Stripe.Coupon | string | null } }) | undefined;
  const coupon = promo?.promotion?.coupon;
  if (!promo || !coupon || typeof coupon === 'string' || !coupon.valid || !coupon.percent_off) throw new PortalError('promotion_not_accepted', 'inactive or not percent-off');
  if (promo.expires_at && promo.expires_at * 1000 <= Date.now()) throw new PortalError('promotion_not_accepted', 'expired');
  return { code, promotionCodeId: promo.id, percentOff: coupon.percent_off };
}

export interface Quote { subtotalCents: number; discountCents: number; totalCents: number; currency: 'usd'; promotion: ResolvedPromotion | null; expiresAt: string }

/** The quote for a first store. The whole-invoice percent discount is rounded as Stripe rounds: to the nearest cent. */
export function buildQuote(promotion: ResolvedPromotion | null, now = Date.now()): Quote {
  const subtotalCents = recurringCents(1);
  const discountCents = promotion ? Math.round((subtotalCents * promotion.percentOff) / 100) : 0;
  return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents, currency: 'usd', promotion, expiresAt: new Date(now + QUOTE_TTL_MS).toISOString() };
}
