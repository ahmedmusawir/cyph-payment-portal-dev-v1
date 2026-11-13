#!/usr/bin/env node
// APBM007A — repeatable sandbox catalogue (BILL-01). Dry-run by default; `--apply` creates only what is absent.
//
//   node scripts/stripe-catalogue.mjs --account acct_XXXX            # dry run: reports what exists and what is missing
//   node scripts/stripe-catalogue.mjs --account acct_XXXX --apply    # creates missing objects, never edits a mismatch
//
// Objects are found by stable keys, never by display name:
//   price          lookup_key  owedbook_stores_v1          (graduated, licensed, monthly USD: 9900 then 4900)
//   portal config  metadata    apbm_key=owedbook_portal_v1 (card update, invoices, cancel at period end; nothing else)
//   APA fixture    promotion code APA10SANDBOX → coupon metadata apbm_key=apa_sandbox_fixture_v1 (10% once; SANDBOX ONLY)
// A mismatching object stops the run. Output is IDs only. The secret key is read from .env.local and never printed.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import Stripe from 'stripe';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = dotenv.parse(readFileSync(join(root, '.env.local')));
const arg = (n) => { const i = process.argv.indexOf(n); return i < 0 ? undefined : process.argv[i + 1]; };
const apply = process.argv.includes('--apply');
const expected = arg('--account');
const fail = (m) => { console.error(`STOP: ${m}`); process.exit(1); };
if (!/^acct_[A-Za-z0-9]+$/.test(expected || '')) fail('--account acct_… is required (the expected sandbox account)');
if (!/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY || '')) fail('STRIPE_SECRET_KEY must be a test-mode key');

const KEYS = { price: 'owedbook_stores_v1', portal: 'owedbook_portal_v1', coupon: 'apa_sandbox_fixture_v1', promo: 'APA10SANDBOX' };
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia', timeout: 10_000, maxNetworkRetries: 0 });
const counters = { reads: 0, mutations: 0 };
const read = async (fn) => { counters.reads++; return fn(); };
const mutate = async (key, fn) => { counters.mutations++; return fn({ idempotencyKey: `catalogue:${key}` }); };   // stable per object: concurrent runs cannot duplicate
const out = { mode: apply ? 'apply' : 'dry-run', account: null, created: [], existing: [], missing: [] };

const account = await read(() => stripe.accounts.retrieveCurrent());
if (account.id !== expected) fail('the key does not belong to the expected account');
out.account = account.id;

// ── price ────────────────────────────────────────────────────────────────────────────────────────────────
const tiersOk = (p) => p.currency === 'usd' && p.active && !p.livemode && p.type === 'recurring' && p.recurring?.interval === 'month' && p.recurring?.interval_count === 1
  && p.recurring?.usage_type === 'licensed' && p.billing_scheme === 'tiered' && p.tiers_mode === 'graduated' && p.tiers?.length === 2
  && p.tiers[0].up_to === 1 && p.tiers[0].unit_amount === 9900 && !p.tiers[0].flat_amount
  && p.tiers[1].up_to === null && p.tiers[1].unit_amount === 4900 && !p.tiers[1].flat_amount;
let price = (await read(() => stripe.prices.list({ lookup_keys: [KEYS.price], expand: ['data.tiers'], limit: 2 }))).data[0];
if (price) {
  if (!tiersOk(price)) fail(`price ${price.id} holds lookup key ${KEYS.price} but does not match the frozen catalogue; it is not edited`);
  out.existing.push(`price ${price.id}`);
} else if (apply) {
  const product = await mutate(`${KEYS.price}:product`, (o) => stripe.products.create({ name: 'OwedBook — pharmacy stores', metadata: { apbm_key: KEYS.price, apbm_run: 'apbm007a' } }, o));
  price = await mutate(`${KEYS.price}:price`, (o) => stripe.prices.create({
    product: product.id, currency: 'usd', recurring: { interval: 'month', usage_type: 'licensed' }, billing_scheme: 'tiered', tiers_mode: 'graduated',
    tiers: [{ up_to: 1, unit_amount: 9900 }, { up_to: 'inf', unit_amount: 4900 }], lookup_key: KEYS.price, metadata: { apbm_key: KEYS.price, apbm_run: 'apbm007a' },
  }, o));
  out.created.push(`product ${product.id}`, `price ${price.id}`);
} else out.missing.push('price');

// ── portal configuration ─────────────────────────────────────────────────────────────────────────────────
const featuresOk = (c) => c.active && !c.livemode && c.features.payment_method_update.enabled && c.features.invoice_history.enabled
  && c.features.subscription_cancel.enabled && c.features.subscription_cancel.mode === 'at_period_end'
  && !c.features.subscription_update.enabled && !c.features.customer_update.enabled;
const configs = (await read(() => stripe.billingPortal.configurations.list({ limit: 100 }))).data;
let portal = configs.find((c) => c.metadata?.apbm_key === KEYS.portal && c.active);
if (portal) {
  if (!featuresOk(portal)) fail(`portal configuration ${portal.id} does not match the frozen feature set; it is not edited`);
  out.existing.push(`portal configuration ${portal.id}${portal.is_default ? ' (account default)' : ''}`);
} else if (apply) {
  portal = await mutate(`${KEYS.portal}:config`, (o) => stripe.billingPortal.configurations.create({
    business_profile: { headline: 'Cyber Pharma — OwedBook billing' },
    features: {
      payment_method_update: { enabled: true }, invoice_history: { enabled: true },
      subscription_cancel: { enabled: true, mode: 'at_period_end', proration_behavior: 'none' },
      subscription_update: { enabled: false }, customer_update: { enabled: false },
    },
    metadata: { apbm_key: KEYS.portal, apbm_run: 'apbm007a' },
  }, o));
  out.created.push(`portal configuration ${portal.id}${portal.is_default ? ' (account default)' : ''}`);
} else out.missing.push('portal configuration');

// ── APA sandbox fixture: 10% once on the whole invoice. A labelled test object, not a commercial decision. ──
const promos = (await read(() => stripe.promotionCodes.list({ code: KEYS.promo, limit: 2, expand: ['data.promotion.coupon'] }))).data;
let promo = promos.find((p) => p.active);
if (promo) {
  const c = promo.promotion?.coupon;
  if (!c || typeof c === 'string' || c.percent_off !== 10 || c.duration !== 'once' || !c.valid || c.metadata?.apbm_key !== KEYS.coupon) fail(`promotion code ${promo.id} does not match the approved fixture; it is not edited`);
  out.existing.push(`promotion code ${promo.id} (${KEYS.promo})`);
} else if (apply) {
  const coupon = await mutate(`${KEYS.coupon}:coupon`, (o) => stripe.coupons.create({ percent_off: 10, duration: 'once', name: 'SANDBOX FIXTURE — APA 10% once', metadata: { apbm_key: KEYS.coupon, apbm_run: 'apbm007a' } }, o));
  promo = await mutate(`${KEYS.coupon}:promo`, (o) => stripe.promotionCodes.create({ promotion: { type: 'coupon', coupon: coupon.id }, code: KEYS.promo, metadata: { apbm_key: KEYS.coupon, apbm_run: 'apbm007a' } }, o));
  out.created.push(`coupon ${coupon.id}`, `promotion code ${promo.id} (${KEYS.promo})`);
} else out.missing.push('APA sandbox fixture');

out.configuration = { STRIPE_EXPECTED_ACCOUNT: account.id, STRIPE_PRICE_STORES: price?.id ?? null, STRIPE_PORTAL_CONFIGURATION: portal?.id ?? null, APA_PROMOTION_CODES: promo ? KEYS.promo : null };
out.calls = counters;
console.log(JSON.stringify(out, null, 2));
