#!/usr/bin/env node
// APBM-007B — Stripe test-clock driver (CONTRACTS/CLOCK_AND_NOTICES.md, CP-2; the fixed external driver). cwd: Portal root.
//
//   node scripts/apbm007b/testclock.mjs --help
//   node scripts/apbm007b/testclock.mjs --cp2 --label <run>             # preflight reads only
//   node scripts/apbm007b/testclock.mjs --cp2 --label <run> --apply     # CP-2 provider record (clock, 2 customers, advances)
//   node scripts/apbm007b/testclock.mjs --cp2 --label <run> --cleanup   # delete this run's clock (removes its customers/subscriptions)
//
// Target: the Cyber Pharma Stripe sandbox (Portal .env.local test key). Every clock, customer, subscription, invoice,
// payment and advance is reserved in the cumulative E2 ledger before it is sent. Customers carry no email address.
// This instrument never touches a database: the SQL time context is set only by the SCRATCH-guarded fixture commands
// (scripts/apbm007b/fixture-clock.mjs) and is refused for DEV. Evidence: EVIDENCE/E2/r01/CP2/<run>/.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { EVIDENCE_ROOT, scrub } from './lib/env.mjs';
import { remaining } from './lib/effects.mjs';

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
if (flag('--help') || !args.length) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
if (!flag('--cp2')) { console.error('FAIL-CLOSED: --cp2 required'); process.exit(2); }
const label = val('--label');
if (!label || !/^[A-Za-z0-9][A-Za-z0-9_-]{2,40}$/.test(label)) { console.error('FAIL-CLOSED: --label <run> required'); process.exit(2); }

const { stripe, CONFIG, API_VERSION, SDK_VERSION, read, mutate, deliveryPaths } = await import('./lib/stripe.mjs');
const I = `cp2:${label}`;
const OUT = join(EVIDENCE_ROOT, 'r01', 'CP2', label); mkdirSync(OUT, { recursive: true });
const STATE = join(OUT, 'state.json');
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { label, objects: {}, steps: [] };
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 1));
const step = (name, data) => { state.steps.push({ name, at: new Date().toISOString(), ...JSON.parse(scrub(JSON.stringify(data))) }); save(); console.log(name, JSON.stringify(data).slice(0, 300)); };
const MARKER = { apbm_run: 'apbm007b_e2', apbm_probe_run: `CP2_${label}`, apbm_db: 'none', apbm_env: 'sandbox_cp2' };
const key = (s) => `apbm007b:cp2:${label}:${s}`;
const DAY = 86400;
const STRIPE_MIN_CHARGE_USD_CENTS = 50;
const incremental = (add, s, e, t) => { const tc = Math.min(Math.max(t, s), e); return Math.floor((add * (e - tc) + Math.floor((e - s) / 2)) / (e - s)); };

const clockNow = async (tag) => (await read(I, `testClocks.retrieve ${tag}`, () => stripe.testHelpers.testClocks.retrieve(state.objects.clock))).frozen_time;
async function advanceTo(t, tag) {
  await mutate(I, `testClocks.advance ${tag}`, { test_clock_advances: 1 }, (o) => stripe.testHelpers.testClocks.advance(state.objects.clock, { frozen_time: t }, o), { idem: key(`advance:${tag}`) });
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const c = await stripe.testHelpers.testClocks.retrieve(state.objects.clock);
    if (c.status === 'ready') return c.frozen_time;
    if (c.status === 'internal_failure') throw new Error('clock internal_failure');
  }
  throw new Error('clock did not become ready in 240 s');
}
const subFacts = (s) => ({ status: s.status, quantity: s.items.data[0].quantity, period: [s.items.data[0].current_period_start, s.items.data[0].current_period_end], latest_invoice: typeof s.latest_invoice === 'string' ? s.latest_invoice : s.latest_invoice?.id, discounts: (s.discounts ?? []).length, cancel_at_period_end: s.cancel_at_period_end });
const invFacts = (i) => i && ({ id: i.id, status: i.status, billing_reason: i.billing_reason, total: i.total, amount_due: i.amount_due, amount_paid: i.amount_paid, attempt_count: i.attempt_count, attempted: i.attempted, next_payment_attempt: i.next_payment_attempt, auto_advance: i.auto_advance, created: i.created, status_transitions: i.status_transitions, discounts: (i.total_discount_amounts ?? []).length });

async function fixture(tag, apa) {
  const c = await mutate(I, `${tag} customers.create on clock (no email)`, { stripe_customers: 1 }, (o) => stripe.customers.create({ name: `APBM007B CP2 ${tag}`, test_clock: state.objects.clock, metadata: MARKER }, o), { idem: key(`${tag}:customer`) });
  state.objects[tag] = { customer: c.id }; save();
  const pm = await mutate(I, `${tag} paymentMethods.attach visa`, { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach('pm_card_visa', { customer: c.id }, o), { idem: key(`${tag}:pm:visa`) });
  await mutate(I, `${tag} customers.update default visa`, { default_card_changes: 1 }, (o) => stripe.customers.update(c.id, { invoice_settings: { default_payment_method: pm.id } }, o), { idem: key(`${tag}:default:visa`) });
  const params = { customer: c.id, items: [{ price: CONFIG.STRIPE_PRICE_STORES, quantity: 1 }], metadata: MARKER };
  const charges = { stripe_subscriptions: 1, payment_attempts: 1, payment_attempt_cents: apa ? 8910 : 9900 };
  if (apa) { const pc = await read(I, 'promotionCodes.list', () => stripe.promotionCodes.list({ code: 'APA10SANDBOX', limit: 1 })); params.discounts = [{ promotion_code: pc.data[0].id }]; charges.apa_redemptions = 1; }
  const s = await mutate(I, `${tag} subscriptions.create qty1${apa ? ' APA' : ''}`, charges, (o) => stripe.subscriptions.create({ ...params, expand: ['latest_invoice'] }, o), { idem: key(`${tag}:sub`) });
  state.objects[tag].subscription = s.id; state.objects[tag].visa = pm.id; save();
  step(`${tag}:fixture`, { subscription: subFacts(s), first_invoice: invFacts(s.latest_invoice) });
}

/** PE-09: incremental Add Store invoice well inside the paid period, computed from the CLOCK's frozen time. */
async function midpointAdd(tag) {
  const now = await clockNow(`${tag} midpoint`);
  const sub = await read(I, `${tag} subscriptions.retrieve midpoint`, () => stripe.subscriptions.retrieve(state.objects[tag].subscription));
  const it = sub.items.data[0]; const [s, e] = [it.current_period_start, it.current_period_end];
  const amount = incremental(4900, s, e, now);
  if (amount < STRIPE_MIN_CHARGE_USD_CENTS || e - now < 5400) { step(`${tag}:midpoint_add`, { refused: true, amount }); return; }
  const md = { ...MARKER, apbm_operation: `${tag}-mid`, apbm_kind: 'store_add', apbm_expected_cents: String(amount) };
  const inv = await mutate(I, `${tag} invoices.create draft standalone (midpoint)`, { invoice_create: 1 }, (o) => stripe.invoices.create({ customer: state.objects[tag].customer, collection_method: 'charge_automatically', auto_advance: false, pending_invoice_items_behavior: 'exclude', discounts: [], currency: 'usd', metadata: md }, o), { idem: key(`${tag}:mid:invoice`) });
  await mutate(I, `${tag} invoiceItems.create (midpoint)`, { invoiceitem_create: 1 }, (o) => stripe.invoiceItems.create({ customer: state.objects[tag].customer, invoice: inv.id, amount, currency: 'usd', discountable: false, description: 'Additional pharmacy store, remaining current period', metadata: md }, o), { idem: key(`${tag}:mid:item`) });
  const draft = await read(I, `${tag} invoices.retrieve draft`, () => stripe.invoices.retrieve(inv.id));
  if (draft.total !== amount || draft.amount_due !== amount || (draft.total_discount_amounts ?? []).length || draft.lines.data.length !== 1) { step(`${tag}:midpoint_add`, { attention: 'draft mismatch', draft: invFacts(draft), amount }); return; }
  await mutate(I, `${tag} invoices.finalize (midpoint)`, { invoice_finalize: 1 }, (o) => stripe.invoices.finalizeInvoice(inv.id, { auto_advance: false }, o), { idem: key(`${tag}:mid:finalize`) });
  try { await mutate(I, `${tag} invoices.pay (midpoint)`, { invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: amount }, (o) => stripe.invoices.pay(inv.id, {}, o), { idem: key(`${tag}:mid:pay`) }); } catch { /* reconciled below */ }
  const paid = await read(I, `${tag} invoices.retrieve after pay`, () => stripe.invoices.retrieve(inv.id));
  let after = null;
  if (paid.status === 'paid' && paid.amount_paid === amount) {
    await mutate(I, `${tag} subscriptions.update qty2 proration none`, { subscription_mutations: 1 }, (o) => stripe.subscriptions.update(sub.id, { items: [{ id: it.id, quantity: 2 }], proration_behavior: 'none' }, o), { idem: key(`${tag}:mid:qty2`) });
    after = await read(I, `${tag} subscriptions.retrieve after qty`, () => stripe.subscriptions.retrieve(sub.id));
  }
  const preview = after ? await read(I, `${tag} createPreview renewal`, () => stripe.invoices.createPreview({ subscription: sub.id })) : null;
  step(`${tag}:midpoint_add`, { clock_now: now, period: [s, e], fraction_remaining: (e - now) / (e - s), quote_cents: amount, invoice: invFacts(paid), quote_equals_invoice: paid.total === amount && paid.amount_paid === amount,
    less_than_full: amount < 4900, subscription_after: after && subFacts(after), renewal_preview_cents: preview?.amount_due ?? null, renewal_discount_lines: preview ? (preview.total_discount_amounts ?? []).length : null,
    pass: paid.status === 'paid' && paid.amount_paid === amount && amount < 4900 && after?.items.data[0].quantity === 2 && preview?.amount_due === 14800 && !(preview.total_discount_amounts ?? []).length });
}

async function snapshot(tag, label2) {
  const now = await clockNow(label2);
  const s = await read(I, `${tag} subscriptions.retrieve ${label2}`, () => stripe.subscriptions.retrieve(state.objects[tag].subscription, { expand: ['latest_invoice'] }));
  return { clock_now: now, clock_iso: new Date(now * 1000).toISOString(), subscription: subFacts(s), latest_invoice: invFacts(s.latest_invoice) };
}

if (flag('--cleanup')) {
  const { reserve, settle } = await import('./lib/effects.mjs');
  const r = { at: new Date().toISOString(), clock: state.objects.clock ?? null };
  if (state.objects.clock) {
    const c = await read(I, 'testClocks.retrieve cleanup', () => stripe.testHelpers.testClocks.retrieve(state.objects.clock)).catch(() => null);
    if (c && !c.deleted) { const q = reserve(I, 'testClocks.del (removes its customers and subscriptions)', { cleanup_test_clock_delete: 1 }); try { await stripe.testHelpers.testClocks.del(state.objects.clock, {}, { idempotencyKey: key('cleanup:clock') }); settle(q, { ok: true }); } catch (e) { settle(q, { ok: false, code: e.code }); } }
    for (const tag of ['O', 'P']) { if (!state.objects[tag]) continue; const cu = await read(I, `${tag} customers.retrieve after clock delete`, () => stripe.customers.retrieve(state.objects[tag].customer)).catch((e) => ({ missing: e.provider?.status ?? true })); r[tag] = { deleted: cu.deleted === true || !!cu.missing }; }
  }
  r.result = ['O', 'P'].every((t) => !state.objects[t] || r[t]?.deleted) ? 'COMPLETE' : 'INCOMPLETE';
  writeFileSync(join(OUT, 'cleanup_receipt.json'), JSON.stringify(r, null, 1)); console.log(JSON.stringify(r)); process.exit(0);
}

const acct = await read(I, 'accounts.retrieveCurrent', () => stripe.accounts.retrieveCurrent());
const delivery = await deliveryPaths(I);
const pre = { sdk: SDK_VERSION, api: API_VERSION, account_matches: acct.id === CONFIG.STRIPE_EXPECTED_ACCOUNT, delivery, effects_remaining: remaining() };
pre.result = pre.account_matches && delivery.webhook_endpoints.length === 0 && delivery.event_destinations === 0 && delivery.local_stripe_listeners === 0 ? 'PASS' : 'FAIL';
state.preflight = pre; save(); writeFileSync(join(OUT, 'preflight.json'), JSON.stringify(pre, null, 1)); console.log('preflight', pre.result, JSON.stringify(delivery));
if (!flag('--apply') || pre.result !== 'PASS') process.exit(pre.result === 'PASS' ? 0 : 1);

// ---- campaign
if (!state.objects.clock) {
  const start = Math.floor(Date.now() / 1000);
  const clock = await mutate(I, 'testClocks.create', { test_clocks: 1 }, (o) => stripe.testHelpers.testClocks.create({ frozen_time: start, name: `APBM007B CP2 ${label}` }, o), { idem: key('clock') });
  state.objects.clock = clock.id; state.objects.start = start; save();
  step('clock_created', { frozen_time: clock.frozen_time, status: clock.status });
}
const t0 = state.objects.start;
if (!state.objects.O) await fixture('O', false);
if (!state.objects.P) await fixture('P', true);
if (!state.steps.some((s) => s.name === 'advanced_mid')) { const t = await advanceTo(t0 + 15 * DAY, 'mid'); step('advanced_mid', { frozen_time: t }); }
if (!state.steps.some((s) => s.name === 'O:midpoint_add')) await midpointAdd('O');
if (!state.steps.some((s) => s.name === 'P:midpoint_add')) await midpointAdd('P');

// Failing card on the ordinary account, then cross the renewal and record each day of the grace week.
if (!state.objects.O.failing) {
  const pm = await mutate(I, 'O paymentMethods.attach chargeCustomerFail', { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach('pm_card_chargeCustomerFail', { customer: state.objects.O.customer }, o), { idem: key('O:pm:fail') });
  await mutate(I, 'O customers.update default failing', { default_card_changes: 1 }, (o) => stripe.customers.update(state.objects.O.customer, { invoice_settings: { default_payment_method: pm.id } }, o), { idem: key('O:default:fail') });
  state.objects.O.failing = pm.id; save();
}
const sub0 = await read(I, 'O subscriptions.retrieve before renewal', () => stripe.subscriptions.retrieve(state.objects.O.subscription));
const renewalAt = sub0.items.data[0].current_period_end;
state.objects.renewalAt = state.objects.renewalAt ?? renewalAt; save();
const R = state.objects.renewalAt;
const marks = [['renewal_plus_1h', R + 3600], ...Array.from({ length: 8 }, (_, i) => [`day_${i + 1}`, R + (i + 1) * DAY + 3600])];
for (const [name, t] of marks) {
  if (state.steps.some((s) => s.name === `O:${name}`)) continue;
  await advanceTo(t, name);
  const snap = await snapshot('O', name); const p = await snapshot('P', name);
  step(`O:${name}`, { ...snap, P_subscription: p.subscription, P_latest_invoice: p.latest_invoice });
}
// Owner recovery on the provider: working card pays the same delinquent invoice.
if (!state.steps.some((s) => s.name === 'O:recovery_pay')) {
  const s = await read(I, 'O subscriptions.retrieve before recovery', () => stripe.subscriptions.retrieve(state.objects.O.subscription, { expand: ['latest_invoice'] }));
  const inv = s.latest_invoice;
  await mutate(I, 'O customers.update default visa (recovery)', { default_card_changes: 1 }, (o) => stripe.customers.update(state.objects.O.customer, { invoice_settings: { default_payment_method: state.objects.O.visa } }, o), { idem: key('O:default:visa-recovery') });
  let err = null;
  if (inv.status === 'open') { try { await mutate(I, 'O invoices.pay delinquent renewal with working card', { invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: inv.amount_remaining }, (o) => stripe.invoices.pay(inv.id, { payment_method: state.objects.O.visa }, o), { idem: key('O:recovery:pay') }); } catch (e) { err = e.provider; } }
  const after = await snapshot('O', 'after_recovery');
  step('O:recovery_pay', { invoice_before: invFacts(inv), pay_error: err, ...after });
}
// Events from the clock customers (chronology and billing_reason), and delivery isolation after.
{ const custs = new Set(['O', 'P'].map((t) => state.objects[t].customer)); const ev = [];
  for await (const e of stripe.events.list({ created: { gte: Math.floor(Date.parse(state.steps[0].at) / 1000) - 120 }, limit: 100 })) { const o = e.data.object; const c = o.object === 'customer' ? o.id : (typeof o.customer === 'string' ? o.customer : o.customer?.id); if (custs.has(c)) ev.push({ id: e.id, created: e.created, type: e.type, who: c === state.objects.O.customer ? 'O' : 'P', object_created: o.created ?? null, billing_reason: o.billing_reason ?? null, status: o.status ?? null, attempt_count: o.attempt_count ?? null, next_payment_attempt: o.next_payment_attempt ?? null, pending_webhooks: e.pending_webhooks }); if (ev.length > 600) break; }
  ev.sort((a, b) => a.created - b.created);
  step('events_and_delivery', { count: ev.length, invoice_failure_events: ev.filter((e) => /invoice\.(payment_failed|paid|payment_succeeded|finalized|created|updated)$/.test(e.type) && e.who === 'O').map((e) => ({ type: e.type, billing_reason: e.billing_reason, status: e.status, attempt_count: e.attempt_count, next_payment_attempt: e.next_payment_attempt, event_created: e.created })),
    subscription_status_events: ev.filter((e) => e.type === 'customer.subscription.updated').map((e) => ({ who: e.who, status: e.status, event_created: e.created })),
    max_pending_webhooks: Math.max(0, ...ev.map((e) => e.pending_webhooks)), delivery_after: await deliveryPaths(I), events: ev,
    note: 'Event `created` is real wall time; chronology of the provider timeline is the invoice `created`/status_transitions in clock time. Stripe failed-payment email and retry settings are not readable by API; the retry schedule below is derived from observed next_payment_attempt values.' }); }
writeFileSync(join(OUT, 'effects_remaining_after.json'), JSON.stringify(remaining(), null, 1));
console.log('CP-2 provider campaign complete');
