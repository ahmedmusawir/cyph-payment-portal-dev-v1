#!/usr/bin/env node
// APBM-007B CP-1 — provider proof of the separate incremental-invoice mechanism (CONTRACTS/BILLING.md,
// EXECUTION_PLAN.md Stage 1 and BP-01/BP-06). cwd: Portal repository root.
//
//   node scripts/apbm007b/capability-check.mjs --help
//   node scripts/apbm007b/capability-check.mjs --cp1 --label <run-label>            # preflight only (reads)
//   node scripts/apbm007b/capability-check.mjs --cp1 --label <run-label> --apply    # provider mutations, ledgered
//   node scripts/apbm007b/capability-check.mjs --cp1 --label <run-label> --cleanup  # cancel/delete this run's objects
//
// Target: the Cyber Pharma Stripe sandbox named by Portal .env.local (test key, STRIPE_EXPECTED_ACCOUNT,
// STRIPE_PRICE_STORES). Effects: run-owned customers/subscriptions/invoices only, each reserved in the cumulative E2
// ledger before it is sent. No email recipient is set on any customer. Evidence: EVIDENCE/E2/r01/CP1/<label>/.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { EVIDENCE_ROOT, PORTAL, scrub } from './lib/env.mjs';
import { remaining } from './lib/effects.mjs';

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
if (flag('--help') || !args.length) {
  console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'));
  process.exit(0);
}
if (!flag('--cp1')) { console.error('FAIL-CLOSED: --cp1 is the only checkpoint implemented by this instrument'); process.exit(2); }
const label = val('--label');
if (!label || !/^[A-Za-z0-9][A-Za-z0-9_-]{2,40}$/.test(label)) { console.error('FAIL-CLOSED: --label <run-label> required'); process.exit(2); }

const { stripe, CONFIG, API_VERSION, SDK_VERSION, read, mutate, deliveryPaths } = await import('./lib/stripe.mjs');
const I = `cp1:${label}`;
const OUT = join(EVIDENCE_ROOT, 'r01', 'CP1', label); mkdirSync(OUT, { recursive: true });
const STATE = join(OUT, 'state.json');
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { label, objects: {}, steps: [] };
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 1));
const step = (name, data) => { state.steps.push({ name, at: new Date().toISOString(), ...JSON.parse(scrub(JSON.stringify(data))) }); save(); };
const MARKER = { apbm_run: 'apbm007b_e2', apbm_probe_run: `CP1_${label}`, apbm_db: 'none', apbm_env: 'sandbox_cp1' };
const key = (s) => `apbm007b:cp1:${label}:${s}`;

// ---- the contract's pure computations (BILLING.md), duplicated here and pinned by unit tests in src/__tests__ ----
export const STRIPE_MIN_CHARGE_USD_CENTS = 50;
const incremental = (additional, s, e, t) => {
  if (!(Number.isInteger(s) && Number.isInteger(e) && e > s)) throw new Error('invalid period');
  const tc = Math.min(Math.max(t, s), e);
  return Math.floor((additional * (e - tc) + Math.floor((e - s) / 2)) / (e - s));
};
const windowRefusal = (amount, e, t) => (e - t < 90 * 60 ? 'period_end_window' : amount < STRIPE_MIN_CHARGE_USD_CENTS ? 'below_minimum_charge' : null);

const subFacts = (s) => ({ id: s.id, status: s.status, quantity: s.items.data[0].quantity, item: s.items.data[0].id,
  period: [s.items.data[0].current_period_start, s.items.data[0].current_period_end], billing_cycle_anchor: s.billing_cycle_anchor,
  latest_invoice: typeof s.latest_invoice === 'string' ? s.latest_invoice : s.latest_invoice?.id, pending_update: !!s.pending_update,
  discounts: (s.discounts ?? []).map((d) => (typeof d === 'string' ? d : d.id)), cancel_at_period_end: s.cancel_at_period_end });
const invFacts = (i) => ({ id: i.id, status: i.status, billing_reason: i.billing_reason, subscription: i.parent?.subscription_details?.subscription ?? null,
  collection_method: i.collection_method, auto_advance: i.auto_advance, currency: i.currency, subtotal: i.subtotal, total: i.total, amount_due: i.amount_due,
  amount_paid: i.amount_paid, amount_remaining: i.amount_remaining, starting_balance: i.starting_balance, ending_balance: i.ending_balance,
  attempt_count: i.attempt_count, attempted: i.attempted, discounts: i.discounts ?? [], total_discount_amounts: i.total_discount_amounts ?? [],
  customer_email: i.customer_email ?? null, metadata: i.metadata, hosted_invoice_url_present: !!i.hosted_invoice_url,
  lines: (i.lines?.data ?? []).map((l) => ({ amount: l.amount, currency: l.currency, description: l.description, discountable: l.discountable, discount_amounts: l.discount_amounts, proration: l.parent?.subscription_item_details?.proration ?? null })) });
const readSub = (id, tag) => read(I, `subscriptions.retrieve ${tag}`, () => stripe.subscriptions.retrieve(id));
const readInv = (id, tag) => read(I, `invoices.retrieve ${tag}`, () => stripe.invoices.retrieve(id, { expand: ['payments'] }));
const piOf = async (inv, tag) => {
  const p = inv.payments?.data?.[0]?.payment?.payment_intent; if (!p) return null;
  const pi = await read(I, `paymentIntents.retrieve ${tag}`, () => stripe.paymentIntents.retrieve(typeof p === 'string' ? p : p.id));
  return { status: pi.status, next_action: pi.next_action?.type ?? null, last_error: pi.last_payment_error?.code ?? null, decline_code: pi.last_payment_error?.decline_code ?? null };
};

// ---------------------------------------------------------------- preflight (reads only)
async function preflight() {
  const acct = await read(I, 'accounts.retrieveCurrent', () => stripe.accounts.retrieveCurrent());
  const price = await read(I, 'prices.retrieve', () => stripe.prices.retrieve(CONFIG.STRIPE_PRICE_STORES, { expand: ['tiers'] }));
  const t = (price.tiers ?? []).map((x) => ({ up_to: x.up_to, unit_amount: x.unit_amount }));
  const pc = await read(I, 'promotionCodes.list APA10SANDBOX', () => stripe.promotionCodes.list({ code: 'APA10SANDBOX', limit: 1, expand: ['data.promotion.coupon'] }));
  const promo = pc.data[0]; const coupon = promo?.promotion?.coupon ?? promo?.coupon;
  const out = { sdk: SDK_VERSION, api_version: API_VERSION, account_matches: acct.id === CONFIG.STRIPE_EXPECTED_ACCOUNT, account_suffix: acct.id.slice(-4),
    price: { id: price.id, livemode: price.livemode, active: price.active, currency: price.currency, tiers_mode: price.tiers_mode, tiers: t },
    catalogue_ok: !price.livemode && price.active && price.currency === 'usd' && price.tiers_mode === 'graduated' && t.length === 2 && t[0].up_to === 1 && t[0].unit_amount === 9900 && t[1].up_to === null && t[1].unit_amount === 4900,
    apa: promo ? { id: promo.id, active: promo.active, times_redeemed: promo.times_redeemed, coupon: coupon && { id: coupon.id, percent_off: coupon.percent_off, duration: coupon.duration } } : null,
    delivery: await deliveryPaths(I), effects_remaining: remaining() };
  out.delivery_isolated = out.delivery.webhook_endpoints.length === 0 && out.delivery.event_destinations === 0 && out.delivery.local_stripe_listeners === 0;
  out.result = out.account_matches && out.catalogue_ok && out.apa?.active && out.delivery_isolated ? 'PASS' : 'FAIL';
  return out;
}

// ---------------------------------------------------------------- fixture: customer + subscription (+APA)
async function fixture(tag, { apa }) {
  const cust = await mutate(I, `${tag} customers.create (no email)`, { stripe_customers: 1 }, (o) => stripe.customers.create({ name: `APBM007B CP1 ${tag}`, metadata: MARKER }, o), { idem: key(`${tag}:customer`) });
  state.objects[tag] = { customer: cust.id }; save();
  const visa = await attach(tag, 'pm_card_visa', 'visa');
  await setDefault(tag, visa, 'visa');
  const params = { customer: cust.id, items: [{ price: CONFIG.STRIPE_PRICE_STORES, quantity: 1 }], metadata: MARKER, expand: ['latest_invoice'] };
  const charges = { stripe_subscriptions: 1, payment_attempts: 1, payment_attempt_cents: apa ? 8910 : 9900 };
  if (apa) { params.discounts = [{ promotion_code: state.preflight.apa.id }]; charges.apa_redemptions = 1; }
  const sub = await mutate(I, `${tag} subscriptions.create qty1${apa ? ' with APA10SANDBOX' : ''}`, charges, (o) => stripe.subscriptions.create(params, o), { idem: key(`${tag}:sub`) });
  state.objects[tag].subscription = sub.id; state.objects[tag].visa = visa; save();
  step(`${tag}:fixture`, { subscription: subFacts(sub), first_invoice: invFacts(sub.latest_invoice) });
  if (sub.status !== 'active') throw new Error(`${tag}: subscription not active`);
  return sub;
}
async function attach(tag, token, name) {
  const pm = await mutate(I, `${tag} paymentMethods.attach ${token}`, { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach(token, { customer: state.objects[tag].customer }, o), { idem: key(`${tag}:pm:${name}`) });
  return pm.id;
}
const setDefault = (tag, pm, name) => mutate(I, `${tag} customers.update default pm (${name})`, { default_card_changes: 1 }, (o) => stripe.customers.update(state.objects[tag].customer, { invoice_settings: { default_payment_method: pm } }, o), { idem: key(`${tag}:default:${name}`) });

// ---------------------------------------------------------------- the mechanism under test
function quote(sub) {
  const it = sub.items.data[0]; const [s, e] = [it.current_period_start, it.current_period_end]; const t = Math.floor(Date.now() / 1000);
  const amount = incremental(4900, s, e, t);
  return { s, e, t, amount, refusal: windowRefusal(amount, e, t), next_renewal_cents: 9900 + 4900 * it.quantity, target_quantity: it.quantity + 1 };
}
async function draftInvoice(tag, op, q) {
  const md = { ...MARKER, apbm_operation: op, apbm_kind: 'store_add', apbm_expected_cents: String(q.amount) };
  const inv = await mutate(I, `${tag}:${op} invoices.create draft standalone`, { invoice_create: 1 }, (o) => stripe.invoices.create({
    customer: state.objects[tag].customer, collection_method: 'charge_automatically', auto_advance: false, pending_invoice_items_behavior: 'exclude',
    discounts: [], currency: 'usd', metadata: md, description: 'Additional pharmacy store, remaining current period' }, o), { idem: key(`${tag}:${op}:invoice`) });
  const item = await mutate(I, `${tag}:${op} invoiceItems.create`, { invoiceitem_create: 1 }, (o) => stripe.invoiceItems.create({
    customer: state.objects[tag].customer, invoice: inv.id, amount: q.amount, currency: 'usd', discountable: false,
    description: 'Additional pharmacy store, remaining current period', metadata: md }, o), { idem: key(`${tag}:${op}:item`) });
  const draft = await readInv(inv.id, `${tag}:${op} draft`);
  const cust = await read(I, `${tag} customers.retrieve balance`, () => stripe.customers.retrieve(state.objects[tag].customer));
  const f = invFacts(draft);
  const valid = f.status === 'draft' && f.subscription === null && f.lines.length === 1 && f.lines[0].amount === q.amount && f.total === q.amount && f.amount_due === q.amount
    && f.currency === 'usd' && f.total_discount_amounts.length === 0 && f.discounts.length === 0 && f.starting_balance === 0 && cust.balance === 0 && f.auto_advance === false
    && draft.customer === state.objects[tag].customer && draft.metadata?.apbm_operation === op;
  return { inv, item_id: item.id, draft: f, customer_balance: cust.balance, valid };
}
const finalize = (tag, op, id) => mutate(I, `${tag}:${op} invoices.finalizeInvoice auto_advance=false`, { invoice_finalize: 1 }, (o) => stripe.invoices.finalizeInvoice(id, { auto_advance: false }, o), { idem: key(`${tag}:${op}:finalize`) });
async function pay(tag, op, id, cents, n = 1) {
  try { await mutate(I, `${tag}:${op} invoices.pay (attempt ${n})`, { invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: cents }, (o) => stripe.invoices.pay(id, {}, o), { idem: key(`${tag}:${op}:pay:${n}`) }); return null; }
  catch (e) { return e.provider; }
}
async function setQuantity(tag, op, sub, quantity) {
  const it = sub.items.data[0];
  const r = await mutate(I, `${tag}:${op} subscriptions.update qty ${quantity} proration none`, { subscription_mutations: 1 },
    (o) => stripe.subscriptions.update(sub.id, { items: [{ id: it.id, quantity }], proration_behavior: 'none' }, o), { idem: key(`${tag}:${op}:qty:${quantity}`) });
  return r;
}
async function renewalPreview(tag, sub) {
  const p = await read(I, `${tag} invoices.createPreview next renewal`, () => stripe.invoices.createPreview({ subscription: sub.id }));
  return { amount_due: p.amount_due, total: p.total, subtotal: p.subtotal, total_discount_amounts: p.total_discount_amounts, discounts: p.discounts, lines: p.lines.data.map((l) => ({ amount: l.amount, quantity: l.quantity, description: l.description, proration: l.parent?.subscription_item_details?.proration ?? null })) };
}

/** Full success: draft → validate → finalize → pay once → recheck period → absolute quantity with no proration → verify. */
async function paidAdd(tag, op) {
  let sub = await readSub(state.objects[tag].subscription, `${tag}:${op} before`);
  const before = subFacts(sub); const q = quote(sub);
  if (q.refusal) { step(`${tag}:${op}`, { refused: q.refusal, quote: q }); return null; }
  const d = await draftInvoice(tag, op, q);
  if (!d.valid) { step(`${tag}:${op}`, { attention: 'draft validation failed', quote: q, draft: d.draft }); return null; }
  await finalize(tag, op, d.inv.id);
  const payErr = await pay(tag, op, d.inv.id, q.amount);
  const inv = await readInv(d.inv.id, `${tag}:${op} after pay`);
  const paidOk = inv.status === 'paid' && inv.amount_paid === q.amount && inv.currency === 'usd' && inv.metadata?.apbm_operation === op;
  sub = await readSub(sub.id, `${tag}:${op} after pay`);
  const periodUnchanged = sub.items.data[0].current_period_start === q.s && sub.items.data[0].current_period_end === q.e;
  let afterQty = null;
  if (paidOk && periodUnchanged) {
    await setQuantity(tag, op, sub, q.target_quantity);
    afterQty = await readSub(sub.id, `${tag}:${op} after quantity`);
  }
  const invoicesAfter = await read(I, `${tag} invoices.list after quantity`, () => stripe.invoices.list({ customer: state.objects[tag].customer, limit: 20 }));
  const preview = afterQty ? await renewalPreview(tag, afterQty) : null;
  const r = { quote: q, draft: d.draft, draft_valid: d.valid, customer_balance_before_finalize: d.customer_balance, pay_error: payErr, invoice_after_pay: invFacts(inv), payment_intent: await piOf(inv, `${tag}:${op}`),
    paid_ok: paidOk, period_unchanged_at_activation: periodUnchanged, subscription_before: before, subscription_after_quantity: afterQty && subFacts(afterQty),
    anchor_unchanged: afterQty ? afterQty.billing_cycle_anchor === before.billing_cycle_anchor : null,
    latest_invoice_unchanged: afterQty ? subFacts(afterQty).latest_invoice === before.latest_invoice : null,
    no_new_invoice_from_quantity_change: invoicesAfter.data.filter((x) => x.parent?.subscription_details?.subscription === sub.id).length === 1,
    customer_invoices: invoicesAfter.data.map((x) => ({ id: x.id, status: x.status, billing_reason: x.billing_reason, total: x.total })),
    renewal_preview: preview, renewal_expected_cents: afterQty ? 9900 + 4900 * (afterQty.items.data[0].quantity - 1) : null };
  r.renewal_ok = !!preview && preview.amount_due === r.renewal_expected_cents && (preview.total_discount_amounts ?? []).length === 0 && preview.lines.every((l) => !l.proration);
  r.pass = paidOk && periodUnchanged && !!afterQty && afterQty.items.data[0].quantity === q.target_quantity && r.anchor_unchanged && r.latest_invoice_unchanged && r.no_new_invoice_from_quantity_change && r.renewal_ok && !afterQty.pending_update;
  step(`${tag}:${op}`, r);
  return r;
}

/** Failure without activation: the invoice is created and attempted; the subscription must not move. */
async function failedAdd(tag, op, cardToken, cardName) {
  const pm = await attach(tag, cardToken, cardName); await setDefault(tag, pm, cardName);
  const sub = await readSub(state.objects[tag].subscription, `${tag}:${op} before`); const before = subFacts(sub); const q = quote(sub);
  const d = await draftInvoice(tag, op, q);
  if (!d.valid) { step(`${tag}:${op}`, { attention: 'draft validation failed', draft: d.draft }); return { inv: d.inv, pass: false }; }
  await finalize(tag, op, d.inv.id);
  const payErr = await pay(tag, op, d.inv.id, q.amount);
  const inv = await readInv(d.inv.id, `${tag}:${op} after pay`); const after = await readSub(sub.id, `${tag}:${op} after pay`);
  const cust = await read(I, `${tag} customers.retrieve after failure`, () => stripe.customers.retrieve(state.objects[tag].customer));
  const r = { quote: q, pay_error: payErr, invoice: invFacts(inv), payment_intent: await piOf(inv, `${tag}:${op}`), subscription_before: before, subscription_after: subFacts(after), customer_balance: cust.balance };
  r.subscription_unchanged = JSON.stringify({ ...r.subscription_before }) === JSON.stringify({ ...r.subscription_after });
  r.pass = inv.status === 'open' && inv.amount_paid === 0 && r.subscription_unchanged && cust.balance === 0;
  step(`${tag}:${op}`, r);
  return { inv, sub, before, r, pm };
}

async function hostedComplete(tag, op, invId, cents) {
  const require = createRequire(`${PORTAL}/package.json`); const { chromium } = require('playwright');
  const { reserve, settle } = await import('./lib/effects.mjs');
  const inv0 = await readInv(invId, `${tag}:${op} before hosted`);
  if (inv0.status !== 'open' || !inv0.hosted_invoice_url) return { error: 'invoice not open or no hosted page' };
  const log = []; const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1400 }, locale: 'en-US' })).newPage();
  let seq = null;
  try {
    await page.goto(inv0.hosted_invoice_url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const confirm = page.getByRole('button', { name: /Confirm payment|^Pay\b/i }).first(); await confirm.waitFor({ timeout: 30000 }); await page.waitForTimeout(3000);
    seq = reserve(I, `${tag}:${op} BROWSER hosted invoice submission + 3DS test challenge`, { invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: cents });
    await confirm.click(); log.push('clicked Confirm payment');
    let clicked = false;
    for (let i = 0; i < 45 && !clicked; i++) {
      await page.waitForTimeout(1000);
      for (const f of page.frames()) {
        const b = f.locator('#test-source-authorize-3ds');
        if (!(await b.count().catch(() => 0))) continue;
        if (!(await b.first().isVisible().catch(() => false)) || !(await b.first().isEnabled().catch(() => false))) continue;
        await page.waitForTimeout(2500);   // the challenge renders before its handler is bound; an early click is ignored
        try { await b.first().click({ timeout: 5000 }); clicked = true; log.push(`clicked visible #test-source-authorize-3ds in ${new URL(f.url()).host}`); } catch { /* not ready */ }
        break;
      }
    }
    // Same submission: if the challenge is still displayed after the click, press its Complete button once more.
    if (clicked) { await page.waitForTimeout(6000); for (const f of page.frames()) { const b = f.locator('#test-source-authorize-3ds'); if (await b.first().isVisible().catch(() => false)) { await b.first().click({ timeout: 5000 }).catch(() => {}); log.push('challenge still shown; pressed Complete again (same submission)'); break; } } }
    if (!clicked) log.push('challenge button not found within 45 s');
    for (let i = 0; i < 20; i++) { await page.waitForTimeout(2000); const x = await readInv(invId, `${tag}:${op} poll`); if (x.status !== 'open') { log.push(`invoice ${x.status} after ~${(i + 1) * 2}s`); break; } }
    await page.screenshot({ path: join(OUT, `${tag}_${op}_hosted_after.png`) });
  } catch (e) { log.push(`browser error ${e.name} ${scrub(String(e.message).split('\n')[0])}`); }
  await browser.close();
  if (seq) settle(seq, { ok: true, browser_log: log });
  return { log };
}

// ---------------------------------------------------------------- main
if (flag('--cleanup')) {
  const { reserve, settle } = await import('./lib/effects.mjs');
  const receipt = { at: new Date().toISOString(), subscriptions: [], customers: [], remaining: [] };
  for (const [tag, o] of Object.entries(state.objects)) {
    if (o.subscription) {
      const s = await readSub(o.subscription, `${tag} cleanup`);
      if (s.metadata?.apbm_probe_run !== MARKER.apbm_probe_run) { receipt.remaining.push({ id: o.subscription, reason: 'marker mismatch' }); continue; }
      if (s.status !== 'canceled') { const q = reserve(I, `${tag} cleanup subscriptions.cancel`, { cleanup_subscription_cancel: 1 }); try { await stripe.subscriptions.cancel(o.subscription, { invoice_now: false, prorate: false }, { idempotencyKey: key(`${tag}:cleanup:cancel`) }); settle(q, { ok: true }); } catch (e) { settle(q, { ok: false, code: e.code }); } }
      receipt.subscriptions.push({ tag, status: (await readSub(o.subscription, `${tag} cleanup after`)).status });
    }
    const open = await read(I, `${tag} invoices.list open`, () => stripe.invoices.list({ customer: o.customer, status: 'open', limit: 10 }));
    if (open.data.length) receipt.remaining.push({ customer: o.customer, open_invoices: open.data.map((x) => x.id) });
    const c = await read(I, `${tag} customers.retrieve cleanup`, () => stripe.customers.retrieve(o.customer));
    if (!c.deleted && c.metadata?.apbm_probe_run === MARKER.apbm_probe_run) { const q = reserve(I, `${tag} cleanup customers.del`, { cleanup_customer_delete: 1 }); try { await stripe.customers.del(o.customer, {}, { idempotencyKey: key(`${tag}:cleanup:delete`) }); settle(q, { ok: true }); } catch (e) { settle(q, { ok: false, code: e.code }); } }
    receipt.customers.push({ tag, deleted: (await read(I, `${tag} customers.retrieve after delete`, () => stripe.customers.retrieve(o.customer))).deleted === true });
  }
  receipt.result = receipt.remaining.length || receipt.customers.some((c) => !c.deleted) ? 'INCOMPLETE' : 'COMPLETE';
  writeFileSync(join(OUT, 'cleanup_receipt.json'), JSON.stringify(receipt, null, 1)); console.log(JSON.stringify(receipt, null, 1)); process.exit(0);
}

state.preflight = await preflight(); save();
writeFileSync(join(OUT, 'preflight.json'), JSON.stringify(state.preflight, null, 1));
console.log(JSON.stringify({ preflight: state.preflight.result, delivery: state.preflight.delivery, apa: state.preflight.apa, catalogue_ok: state.preflight.catalogue_ok }, null, 1));
if (!flag('--apply')) process.exit(state.preflight.result === 'PASS' ? 0 : 1);
if (state.preflight.result !== 'PASS') { console.error('STOP: preflight failed'); process.exit(1); }
state.started = state.started ?? new Date().toISOString(); save();
const deadline = Date.parse(state.started) + 45 * 60 * 1000;
const guard = () => { if (Date.now() > deadline) throw new Error('STOP: 45-minute capability timebox'); };

// Sub-minimum refusal by computation only (BP-01): never create a sub-minimum invoice.
{ const s = 1_800_000_000, e = s + 30 * 86400; const cases = [6 * 3600, 7 * 3600, 8 * 3600, 2 * 86400, 15 * 86400].map((left) => { const t = e - left; const a = incremental(4900, s, e, t); return { seconds_left: left, amount: a, refusal: windowRefusal(a, e, t) }; });
  step('BP01_sub_minimum_computation_only', { period_days: 30, cases, rule: 'refuse when e-t < 90 min OR amount < 50; no invoice created' }); }

const from = val('--from');
const order = ['start', 'auth_hosted', 'lost', 'apa', 'events'];
const only = val('--only');
const at = (p) => (only ? p === only : order.indexOf(from ?? 'start') <= order.indexOf(p));
const stepOf = (n) => state.steps.filter((x) => x.name === n).at(-1);
let o1, dec, au;
if (at('start')) {
// Ordinary account
guard(); await fixture('O', { apa: false });
guard(); o1 = await paidAdd('O', 'add1');
guard(); dec = await failedAdd('O', 'decline', 'pm_card_chargeCustomerFail', 'fail');
// Abandon: void the open invoice, verify terminal provider state and no paid outcome, subscription unchanged.
guard(); { let voidErr = null; try { await mutate(I, 'O:decline invoices.voidInvoice', { invoice_void: 1 }, (o) => stripe.invoices.voidInvoice(dec.inv.id, {}, o), { idem: key('O:decline:void') }); } catch (e) { voidErr = e.provider; }
  const inv = await readInv(dec.inv.id, 'O:decline after void'); const sub = await readSub(state.objects.O.subscription, 'O:decline after void');
  // Late payment against a voided invoice must fail at the provider (race: void wins).
  const latePay = await pay('O', 'decline', dec.inv.id, dec.r.quote.amount, 2);
  const inv2 = await readInv(dec.inv.id, 'O:decline after late pay');
  step('O:abandon_void_then_late_pay', { void_error: voidErr, invoice_after_void: invFacts(inv), subscription_after_void: subFacts(sub), subscription_unchanged: JSON.stringify(subFacts(sub)) === JSON.stringify(dec.before),
    late_pay_error: latePay, invoice_after_late_pay: invFacts(inv2), pass: inv.status === 'void' && inv.amount_paid === 0 && !!latePay && inv2.status === 'void' && inv2.amount_paid === 0 }); }
// Authentication required: attempt once by API, then complete the provider-hosted challenge; then activate.
guard(); au = await failedAdd('O', 'auth', 'pm_card_authenticationRequired', 'auth');
}
if (!o1) o1 = stepOf('O:add1');
if (!au) { const a = stepOf('O:auth'); au = { inv: { id: a.invoice.id }, r: a, before: a.subscription_before }; }
if (at('auth_hosted')) {
guard(); { const h = await hostedComplete('O', 'auth', au.inv.id, au.r.quote.amount);
  const inv = await readInv(au.inv.id, 'O:auth after hosted'); let sub = await readSub(state.objects.O.subscription, 'O:auth after hosted');
  const paid = inv.status === 'paid' && inv.amount_paid === au.r.quote.amount; const periodSame = sub.items.data[0].current_period_end === au.r.quote.e;
  let q = null; if (paid && periodSame) { await setQuantity('O', 'auth', sub, au.r.quote.target_quantity); q = await readSub(sub.id, 'O:auth after quantity'); }
  step('O:auth_hosted_complete_then_activate', { browser: h, invoice: invFacts(inv), payment_intent: await piOf(inv, 'O:auth hosted'), subscription_after_quantity: q && subFacts(q), anchor_unchanged: q ? q.billing_cycle_anchor === au.before.billing_cycle_anchor : null,
    renewal_preview: q ? await renewalPreview('O', q) : null, pass: paid && !!q && q.items.data[0].quantity === au.r.quote.target_quantity && !q.pending_update }); }
}
// Paid invoice cannot be voided afterwards (race: payment wins) — the operation must be preserved as paid.
if (at('start')) { let err = null; try { await mutate(I, 'O:add1 invoices.voidInvoice on PAID invoice (expected refusal)', { invoice_void: 1 }, (o) => stripe.invoices.voidInvoice(o1?.invoice_after_pay?.id ?? 'missing', {}, o), { idem: key('O:add1:void-after-paid') }); } catch (e) { err = e.provider; }
  const inv = o1 ? await readInv(o1.invoice_after_pay.id, 'O:add1 after void attempt') : null;
  step('O:void_after_paid_refused', { error: err, invoice_status: inv?.status, amount_paid: inv?.amount_paid, pass: !!err && inv?.status === 'paid' }); }
if (at('lost')) {
// Lost reply on invoice creation: send create, discard the reply, recover by bounded enumeration over exact metadata,
// then re-send with the SAME key and confirm the provider returns the same invoice (no duplicate).
guard(); { const sub = await readSub(state.objects.O.subscription, 'O:lost before'); const q = quote(sub); const op = val('--lost-op') || (from && from !== 'start' ? 'lost2' : 'lost');
  // Earlier interrupted lost-reply attempts leave only empty drafts; delete those exact run-owned drafts first.
  for await (const x of stripe.invoices.list({ customer: state.objects.O.customer, status: 'draft', limit: 100 })) { if (x.metadata?.apbm_probe_run === MARKER.apbm_probe_run && /^lost/.test(x.metadata?.apbm_operation ?? '') && x.metadata.apbm_operation !== op) { await mutate(I, `O:${x.metadata.apbm_operation} invoices.del leftover empty draft`, { invoice_void: 1 }, (o) => stripe.invoices.del(x.id, {}, o), { idem: key(`O:${x.metadata.apbm_operation}:delete-leftover`) }); step(`O:${x.metadata.apbm_operation}_leftover_draft_deleted`, { invoice: x.id, total: x.total }); } }
  const t0 = Math.floor(Date.now() / 1000) - 5;   // the operation's creation interval starts when its intent is persisted, before the call
  const md = { ...MARKER, apbm_operation: op, apbm_kind: 'store_add', apbm_expected_cents: String(q.amount) };
  const params = { customer: state.objects.O.customer, collection_method: 'charge_automatically', auto_advance: false, pending_invoice_items_behavior: 'exclude', discounts: [], currency: 'usd', metadata: md, description: 'Additional pharmacy store, remaining current period' };
  await mutate(I, `O:${op} invoices.create (reply deliberately discarded)`, { invoice_create: 1 }, (o) => stripe.invoices.create(params, o), { idem: key(`O:${op}:invoice`) });
  const found = [];
  for await (const x of stripe.invoices.list({ customer: state.objects.O.customer, created: { gte: t0, lte: Math.floor(Date.now() / 1000) + 5 }, limit: 100 })) {
    if (x.metadata?.apbm_operation === op && x.metadata?.apbm_probe_run === MARKER.apbm_probe_run && x.currency === 'usd') found.push(x.id);
  }
  let resend = null; let resendErr = null;
  try { resend = await mutate(I, `O:${op} invoices.create SAME key (replay)`, { invoice_create: 1 }, (o) => stripe.invoices.create(params, o), { idem: key(`O:${op}:invoice`) }); } catch (e) { resendErr = e.provider; }
  const all = await read(I, 'O:lost invoices.list after replay', () => stripe.invoices.list({ customer: state.objects.O.customer, created: { gte: t0 }, limit: 100 }));
  const mine = all.data.filter((x) => x.metadata?.apbm_operation === op);
  // Close the artifact: finalize then void (no payment), so nothing stays open.
  // Close the artifact: it is an empty draft, so delete it (finalizing an empty draft would produce a $0 paid invoice).
  if (found[0]) await mutate(I, `O:${op} invoices.del draft`, { invoice_void: 1 }, (o) => stripe.invoices.del(found[0], {}, o), { idem: key(`O:${op}:delete`) });
  step('O:lost_reply_reconciliation', { enumerated_matches: found.length, replay_returned_same: resend ? resend.id === found[0] : null, replay_error: resendErr, invoices_for_operation_after_replay: mine.length,
    pass: found.length === 1 && mine.length === 1 && (resend ? resend.id === found[0] : false) }); }

}
// APA account
if (at('apa')) {
guard(); await fixture('P', { apa: true });
guard(); { const s = await readSub(state.objects.P.subscription, 'P after purchase'); const c = await read(I, 'P customers.retrieve discount', () => stripe.customers.retrieve(state.objects.P.customer, { expand: ['discount'] }));
  step('P:discount_state_after_purchase', { subscription_discounts: subFacts(s).discounts, customer_discount: c.discount ? c.discount.id : null, balance: c.balance }); }
guard(); await paidAdd('P', 'add1');
}

// Events of this run and delivery paths after.
{ const t0 = Math.floor(Date.parse(state.started) / 1000) - 60; const custs = new Set(Object.values(state.objects).map((o) => o.customer)); const ev = [];
  for await (const e of stripe.events.list({ created: { gte: t0 }, limit: 100 })) { const o = e.data.object; const c = o.object === 'customer' ? o.id : (typeof o.customer === 'string' ? o.customer : o.customer?.id); if (custs.has(c)) ev.push({ id: e.id, type: e.type, billing_reason: o.billing_reason ?? null, invoice_subscription: o.object === 'invoice' ? (o.parent?.subscription_details?.subscription ?? null) : undefined, status: o.status ?? null, pending_webhooks: e.pending_webhooks }); if (ev.length > 400) break; }
  const tally = {}; for (const e of ev) tally[e.type] = (tally[e.type] ?? 0) + 1;
  step('events_and_delivery', { count: ev.length, tally, max_pending_webhooks: Math.max(0, ...ev.map((e) => e.pending_webhooks)), delivery_after: await deliveryPaths(I), events: ev,
    note: 'Customers carry no email address, so the provider has no recipient for any invoice email; Stripe email settings are not readable by API (limitation).' }); }
writeFileSync(join(OUT, 'effects_remaining_after.json'), JSON.stringify(remaining(), null, 1));
const summary = state.steps.filter((s) => 'pass' in s).map((s) => ({ step: s.name, pass: s.pass }));
writeFileSync(join(OUT, 'summary.json'), JSON.stringify(summary, null, 1));
console.log(JSON.stringify(summary, null, 1));
