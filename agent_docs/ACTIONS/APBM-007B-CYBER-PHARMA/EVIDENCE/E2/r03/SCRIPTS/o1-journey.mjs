#!/usr/bin/env node
// APBM-007B O-1 live lifecycle on the proof pair (CONTRACTS/CLOCK_AND_NOTICES.md "Journey"; AC-025/018/003/026 parts).
// cwd: Portal root. Requires the proof servers (3100/3101 → SCRATCH) started with `--mail live`.
//
//   node scripts/apbm007b/o1-journey.mjs --help
//   node scripts/apbm007b/o1-journey.mjs --label <run> --cast /tmp/<file>.json [--until <phase>] [--cleanup]
//
// Phases (resumable via EVIDENCE/E2/r03/O1/<run>/state.json): setup → midpoint → removal → renewal → day2 → day5 → day7 →
// recovery → reactivate. Uses ONE Stripe test clock with two SCRATCH accounts (ordinary OWNER_A, APA OWNER_B). Owner actions
// go through the proof Portal's own API with real signed-in sessions. Real Stripe events of the clock customers are delivered
// to the proof Portal by this owned forwarder, signed with the proof Portal's configured webhook secret exactly as a listener
// does (the handler re-reads every object from Stripe). Clock time reaches SQL only through the guarded SCRATCH test context.
// Every provider effect — including predicted AUTOMATIC renewal attempts — and every notice email is reserved in the E2 ledger
// before the step that causes it. Credentials stay in memory / the private 0600 cast file; nothing secret is printed.
import { createHash, createHmac, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { EVIDENCE_ROOT, PORTAL, OWEDBOOK, scratchTarget, loadNamed, scrub } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const label = opt('--label'), castPath = opt('--cast');
if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,40}$/.test(label ?? '') || !/^\/tmp\/[A-Za-z0-9._-]+\.json$/.test(castPath ?? '')) { console.error('FAIL-CLOSED: --label and --cast /tmp/<file>.json required'); process.exit(2); }
const PP = 'http://localhost:3101';
const OUT = join(EVIDENCE_ROOT, 'r03', 'O1', label); mkdirSync(OUT, { recursive: true });
const STATE = join(OUT, 'state.json');
const st = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { label, done: [], log: [], forwarded: [] };
const save = () => writeFileSync(STATE, JSON.stringify(st, null, 1));
const log = (step, data) => { st.log.push({ step, at: new Date().toISOString(), ...JSON.parse(scrub(JSON.stringify(data))) }); save(); console.log(step, scrub(JSON.stringify(data)).slice(0, 400)); };
const sc = scratchTarget();
const req = createRequire(`${PORTAL}/package.json`);
const { createClient } = req('@supabase/supabase-js');
const pg = createRequire(`${OWEDBOOK}/package.json`)('pg');
const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { stripe, CONFIG, read, mutate } = await import('./lib/stripe.mjs');
const priv = loadNamed(PORTAL, { required: ['STRIPE_WEBHOOK_SECRET'] });
const opToken = createHash('sha256').update(`${sc.secretKey}:apbm007a-operator-v1`).digest('hex');
const I = `o1:${label}`; const DAY = 86400;
const key = (s) => `apbm007b:o1:${label}:${s}`;
const MARKER = { apbm_run: 'apbm007b_e2', apbm_probe_run: `O1_${label}`, apbm_db: 'scratch' };

// ---------------------------------------------------------------- private cast (created here; 0600; never printed)
const ENG = JSON.parse(readFileSync(`${homedir()}/.apbm007b/engineering_cast.json`, 'utf8'));   // private 0600; addresses never in source
const CAST = { A: ENG.ENGINEERING_OWNER_A.email, B: ENG.ENGINEERING_OWNER_B.email };
const cast = existsSync(castPath) ? JSON.parse(readFileSync(castPath, 'utf8')) : {};
const saveCast = () => { writeFileSync(castPath, JSON.stringify(cast), { mode: 0o600 }); chmodSync(castPath, 0o600); };

// ---------------------------------------------------------------- helpers
async function session(who) {
  const r = await fetch(`${PP}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: PP }, body: JSON.stringify({ email: cast[who].email, password: cast[who].password }), redirect: 'manual' });
  if (!r.ok) throw new Error(`login ${who} ${r.status}`);
  return r.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
}
async function api(who, path, body) {
  const cookie = await session(who);
  const r = await fetch(`${PP}${path}`, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', Origin: PP, Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
const jobs = async () => (await (await fetch(`${PP}/api/internal/jobs/run`, { method: 'POST', headers: { Authorization: `Bearer ${opToken}` } })).json());
const operator = async (body) => (await (await fetch(`${PP}/api/operator/007b`, { method: 'POST', headers: { Authorization: `Bearer ${opToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json());
const clockNow = async () => (await read(I, 'testClocks.retrieve', () => stripe.testHelpers.testClocks.retrieve(st.clock))).frozen_time;
async function advance(to, tag, predicted) {
  if (predicted) { const s = reserve(I, `PREDICTED automatic provider attempts on advance ${tag}: ${predicted.note}`, { payment_attempts: predicted.attempts, payment_attempt_cents: predicted.cents }); settle(s, { ok: true, kind: 'prediction' }); }
  await mutate(I, `testClocks.advance ${tag}`, { test_clock_advances: 1 }, (o) => stripe.testHelpers.testClocks.advance(st.clock, { frozen_time: to }, o), { idem: key(`advance:${tag}`) });
  for (let i = 0; i < 150; i++) { await new Promise((r) => setTimeout(r, 2000)); const c = await stripe.testHelpers.testClocks.retrieve(st.clock); if (c.status === 'ready') break; if (c.status === 'internal_failure') throw new Error('clock failure'); }
  const now = await clockNow();
  for (const a of ['A', 'B']) { const r = await db.rpc('billing_test_context_sync', { p_account: st[a].account, p_clock: st.clock, p_frozen: new Date(now * 1000).toISOString() }); if (r.error || r.data !== 'synced') throw new Error(`context sync ${a} ${r.error?.code ?? r.data}`); }
  return now;
}
/** Deliver this campaign's not-yet-delivered events in order, signed like a listener. */
async function forward(tag) {
  const custs = new Set([st.A.customer, st.B.customer]); const evs = [];
  for await (const e of stripe.events.list({ created: { gte: st.startedReal - 120 }, limit: 100 })) {
    const o = e.data.object; const c = o.object === 'customer' ? o.id : typeof o.customer === 'string' ? o.customer : o.customer?.id;
    if (custs.has(c) && !st.forwarded.includes(e.id)) evs.push(e);
  }
  evs.sort((a, b) => a.created - b.created);
  const results = {};
  for (const e of evs) {
    const payload = JSON.stringify(e); const t = Math.floor(Date.now() / 1000);
    const sig = createHmac('sha256', priv.STRIPE_WEBHOOK_SECRET).update(`${t}.${payload}`).digest('hex');
    const r = await fetch(`${PP}/api/webhooks/stripe`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': `t=${t},v1=${sig}` }, body: payload });
    const b = await r.json().catch(() => ({}));
    results[`${e.type}`] = (results[`${e.type}`] ?? []).concat(`${r.status}:${b.result ?? b.error ?? ''}`);
    if (r.status === 200) st.forwarded.push(e.id);
  }
  save(); log(`forward:${tag}`, { delivered: evs.length, results });
  return evs;
}
async function sqlAs(uid, sql, params) {
  const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false } }); await c.connect();
  try { await c.query('begin'); await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })]); await c.query('set local role authenticated');
    try { return { rows: (await c.query(sql, params)).rows }; } catch (e) { return { error: e.code, message: e.message.slice(0, 120) }; } }
  finally { await c.query('rollback').catch(() => {}); await c.end(); }
}
const access = async (a) => (await db.rpc('account_access_state', { p_account: st[a].account })).data;
const subRow = async (a) => (await db.from('subscriptions').select('status,quantity,grace_started_at,grace_invoice_id,latest_invoice_status').eq('account_id', st[a].account).single()).data;
const notices = async (a) => (await db.from('notification_operations').select('notice_kind,status,attempts,due_at,provider_message_id,suppression_reason,attention_reason').eq('account_id', st[a].account).not('notice_kind', 'is', null)).data;
async function emailsFor(account) { // reserve one dispatch per due, claimable notice BEFORE the jobs run
  const due = (await db.rpc('notices_due')).data ?? [];
  const ids = due.map((r) => (typeof r === 'string' ? r : Object.values(r)[0]));
  const mine = ids.length ? (await db.from('notification_operations').select('id,notice_kind').in('id', ids).eq('account_id', account)).data : [];
  for (const n of mine) { const s = reserve(I, `email dispatch (Resend) ${n.notice_kind} → OWNER_A controlled inbox`, { email_dispatch: 1 }); settle(s, { ok: true, kind: 'pre-reservation' }); }
  return mine.length;
}
const phase = async (name, fn) => { if (st.done.includes(name)) return; await fn(); st.done.push(name); save(); if (opt('--until') === name) { console.log(`stopped after ${name}`); process.exit(0); } };

// ---------------------------------------------------------------- cleanup
if (args.includes('--cleanup')) {
  const s = reserve(I, 'testClocks.del (removes its customers/subscriptions)', { cleanup_test_clock_delete: 1 });
  try { await stripe.testHelpers.testClocks.del(st.clock, {}, { idempotencyKey: key('cleanup') }); settle(s, { ok: true }); } catch (e) { settle(s, { ok: false, code: e.code }); }
  for (const a of ['A', 'B']) if (st[a]) await db.rpc('billing_test_context_disable', { p_account: st[a].account });
  log('cleanup', { clock_deleted: true, contexts_disabled: true, scratch_rows: 'retained (labelled)' });
  process.exit(0);
}

// ---------------------------------------------------------------- phases
await phase('setup', async () => {
  st.startedReal = Math.floor(Date.now() / 1000);
  const clock = await mutate(I, 'testClocks.create', { test_clocks: 1 }, (o) => stripe.testHelpers.testClocks.create({ frozen_time: st.startedReal, name: `APBM007B O1 ${label}` }, o), { idem: key('clock') });
  st.clock = clock.id; save();
  for (const [a, apa] of [['A', false], ['B', true]]) {
    if (!cast[a]) { const password = `Pw-${randomUUID()}`; const u = await db.auth.admin.createUser({ email: CAST[a], password, email_confirm: true, user_metadata: { full_name: `Engineering Owner ${a}` } });
      const s = reserve(I, `SCRATCH identity for engineering OWNER_${a}`, { scratch_auth_identities: 1 }); settle(s, { ok: !u.error });
      if (u.error) throw new Error(`identity ${a} ${u.error.status}`); cast[a] = { email: CAST[a], password, userId: u.data.user.id }; saveCast(); }
    const cust = await mutate(I, `${a} customers.create on clock (no email)`, { stripe_customers: 1 }, (o) => stripe.customers.create({ name: `APBM007B O1 ${a}`, test_clock: st.clock, metadata: MARKER }, o), { idem: key(`${a}:customer`) });
    const visa = await mutate(I, `${a} attach visa`, { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach('pm_card_visa', { customer: cust.id }, o), { idem: key(`${a}:visa`) });
    await mutate(I, `${a} default visa`, { default_card_changes: 1 }, (o) => stripe.customers.update(cust.id, { invoice_settings: { default_payment_method: visa.id } }, o), { idem: key(`${a}:default:visa`) });
    const params = { customer: cust.id, items: [{ price: CONFIG.STRIPE_PRICE_STORES, quantity: apa ? 1 : 2 }], metadata: MARKER };
    const charges = { stripe_subscriptions: 1, payment_attempts: 1, payment_attempt_cents: apa ? 8910 : 14800 };
    if (apa) { const pc = await read(I, 'promotionCodes.list', () => stripe.promotionCodes.list({ code: 'APA10SANDBOX', limit: 1 })); params.discounts = [{ promotion_code: pc.data[0].id }]; charges.apa_redemptions = 1; }
    const sub = await mutate(I, `${a} subscriptions.create`, charges, (o) => stripe.subscriptions.create(params, o), { idem: key(`${a}:sub`) });
    const it = sub.items.data[0];
    const acct = (await db.from('accounts').insert({ name: `O-1 ${a} ${label}`, owner_user_id: cast[a].userId }).select('id').single()).data.id;
    const stores = [];
    for (const n of apa ? ['B1'] : ['A1', 'A2']) {
      let npi; for (;;) { const x = String(1000000000 + Math.floor(Math.random() * 899999999)); let s2 = 0; const d = `80840${x}`; for (let i = 0; i < 15; i++) { let y = Number(d[14 - i]); if (i % 2) { y *= 2; if (y > 9) y -= 9; } s2 += y; } if (s2 % 10 === 0) { npi = x; break; } }
      const ident = (await db.from('pharmacy_identities').insert({ npi }).select('id').single()).data.id;
      const b = (await db.from('businesses').insert({ account_id: acct, pharmacy_id: ident, npi, pharmacy_name: `O-1 ${n} ${label}`, status: 'active', state: 'NY' }).select('id,npi').single()).data;
      await db.from('user_businesses').insert({ user_id: cast[a].userId, business_id: b.id, role: 'admin', is_primary: stores.length === 0 });
      stores.push({ name: n, id: b.id, npi: b.npi });
    }
    if (!apa) await db.from('user_data').insert([1, 2].map((g) => ({ business_id: stores[1].id, drug_name: `O1 HISTORY ${g}`, status: 'owed', owed: 10 })));   // A2 history for decision 9
    await db.from('billing_customers').insert({ account_id: acct, stripe_customer_id: cust.id });
    await db.from('subscriptions').insert({ account_id: acct, origin: 'stripe', stripe_customer_id: cust.id, stripe_subscription_id: sub.id, status: 'active', raw_status: 'active', quantity: it.quantity,
      stripe_price_id: it.price.id, stripe_subscription_item_id: it.id, current_period_start: new Date(it.current_period_start * 1000).toISOString(), current_period_end: new Date(it.current_period_end * 1000).toISOString(),
      cancel_at_period_end: false, verified_at: new Date().toISOString(), policy_version: 'access-v1' });
    const ctx = await db.rpc('billing_test_context_enable', { p_account: acct, p_run: `o1-${label}`, p_clock: st.clock, p_frozen: new Date(clock.frozen_time * 1000).toISOString() });
    if (ctx.error) throw new Error(`context ${ctx.error.code}`);
    st[a] = { customer: cust.id, sub: sub.id, visa: visa.id, account: acct, stores, R: it.current_period_end }; save();
  }
  log('setup', { clock: st.clock, A: { stores: 2 }, B: { stores: 1, apa: true } });
});

await phase('midpoint', async () => {
  const now = await advance(st.startedReal + 15 * DAY, 'mid');
  for (const a of ['A', 'B']) {
    const q = await api(a, '/api/stores/add/quote', { storeName: `O-1 ${a}-mid ${label}`, npi: (() => { for (;;) { const x = String(1000000000 + Math.floor(Math.random() * 899999999)); let s2 = 0; const d = `80840${x}`; for (let i = 0; i < 15; i++) { let y = Number(d[14 - i]); if (i % 2) { y *= 2; if (y > 9) y -= 9; } s2 += y; } if (s2 % 10 === 0) return x; } })() });
    if (q.status !== 200) throw new Error(`quote ${a} ${q.status} ${JSON.stringify(q.body).slice(0, 200)}`);
    const quote = q.body.data;
    const c = await (async () => { const seq = reserve(I, `${a} product Add Store at clock midpoint (invoice/item/finalize/pay, qty +1)`, { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: quote.amountCents, subscription_mutations: 1 });
      const r = await api(a, '/api/stores/add/confirm', { quoteId: quote.quoteId, intentKey: `o1_${randomUUID().replace(/-/g, '')}`, consentTerms: true, consentRecurring: true, consentImmediate: true }); settle(seq, { ok: r.status === 200, state: r.body?.data?.state }); return r; })();
    const op = (await db.from('store_operations').select('state,amount_cents,invoice_id').eq('id', c.body.data.operationId).single()).data;
    const inv = await read(I, `${a} invoice`, () => stripe.invoices.retrieve(op.invoice_id));
    log(`midpoint:${a}`, { clock_fraction_remaining: (st[a].R - now) / (30 * DAY), quote_cents: quote.amountCents, invoice_total: inv.total, paid: inv.amount_paid, quote_equals_invoice: inv.total === quote.amountCents && inv.amount_paid === quote.amountCents, below_full: quote.amountCents < 4900, state: op.state, renewal_quoted: quote.nextRenewalCents });
  }
});

await phase('removal', async () => {
  const seq = reserve(I, 'A schedule removal of A2 (qty -1, no proration)', { subscription_mutations: 1 });
  const r = await api('A', `/api/stores/${st.A.stores[1].id}/removal`, { intentKey: `o1rm_${randomUUID().replace(/-/g, '')}` }); settle(seq, { ok: r.status === 200, state: r.body?.data?.state });
  const preview = await read(I, 'A createPreview renewal', () => stripe.invoices.createPreview({ subscription: st.A.sub }));
  log('removal', { state: r.body?.data?.state, renewal_preview_cents: preview.amount_due, removal_effective_at: (await db.from('businesses').select('removal_effective_at').eq('id', st.A.stores[1].id).single()).data.removal_effective_at });
});

await phase('renewal', async () => {
  const fail = await mutate(I, 'A attach failing card', { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach('pm_card_chargeCustomerFail', { customer: st.A.customer }, o), { idem: key('A:fail') });
  await mutate(I, 'A default failing', { default_card_changes: 1 }, (o) => stripe.customers.update(st.A.customer, { invoice_settings: { default_payment_method: fail.id } }, o), { idem: key('A:default:fail') });
  await advance(st.A.R + 3600, 'renewal', { attempts: 2, cents: 29600, note: 'A renewal attempt 1 (14,800, fails) + B renewal (14,800, succeeds)' });
  await forward('renewal');
  const emails = await emailsFor(st.A.account);
  const j = await jobs();
  log('renewal', { A_access: await access('A'), A_sub: await subRow('A'), B_access: await access('B'), notices: await notices('A'), emails_reserved: emails, jobs: j,
    A2: (await db.from('businesses').select('status,ownership_ended_at').eq('id', st.A.stores[1].id).single()).data });
});

await phase('day2', async () => {
  await advance(st.A.R + 2 * DAY + 3600, 'day2', { attempts: 1, cents: 14800, note: 'A retry ~R+1.8d (fails)' });
  await forward('day2'); await jobs();
  log('day2', { A_access: await access('A'), A_sub: await subRow('A'), notices: await notices('A') });
});

await phase('day5', async () => {
  await advance(st.A.R + 5 * DAY + 3 * 3600, 'day5', { attempts: 1, cents: 14800, note: 'A retry ~R+3.6d (fails)' });
  await forward('day5');
  const emails = await emailsFor(st.A.account);
  const j = await jobs();
  log('day5', { A_access: await access('A'), notices: await notices('A'), emails_reserved: emails, jobs_notices: j.notices });
});

await phase('day7', async () => {
  await advance(st.A.R + 7 * DAY + 3 * 3600, 'day7', { attempts: 1, cents: 14800, note: 'A retry ~R+5.4d (fails)' });
  await forward('day7'); await jobs();
  const owner = cast.A.userId;
  const quote = await api('A', '/api/stores/add/quote', { storeName: 'Read-only attempt', npi: '1234567893' });
  const inv = await sqlAs(owner, `select public.invitation_create($1,'readonly-check@apbm007b-proof.invalid','member',null) r`, [st.A.stores[0].id]);
  const reads = await sqlAs(owner, 'select count(*)::int n from public.businesses where id = $1', [st.A.stores[0].id]);
  const bill = await sqlAs(owner, 'select public.owner_billing_overview() r');
  log('day7', { A_access: await access('A'), A_sub: await subRow('A'), app_quote: { status: quote.status, reason: quote.body.reason ?? quote.body.error },
    sql_new_grant: inv.error ? `denied ${inv.error}` : 'ALLOWED', sql_reads_still_allowed: reads.rows?.[0]?.n === 1, owner_billing_reachable: !bill.error, notices: await notices('A') });
});

await phase('recovery', async () => {
  const s0 = await read(I, 'A sub', () => stripe.subscriptions.retrieve(st.A.sub, { expand: ['latest_invoice'] }));
  await mutate(I, 'A default visa (recovery)', { default_card_changes: 1 }, (o) => stripe.customers.update(st.A.customer, { invoice_settings: { default_payment_method: st.A.visa } }, o), { idem: key('A:default:visa2') });
  await mutate(I, 'A owner pays the SAME delinquent renewal invoice', { invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: s0.latest_invoice.amount_remaining }, (o) => stripe.invoices.pay(s0.latest_invoice.id, { payment_method: st.A.visa }, o), { idem: key('A:recovery:pay') });
  const evs = await forward('recovery'); await jobs();
  const firstFail = st.forwarded.length ? (await Promise.all(st.forwarded.slice(0, 400).map(async (id) => id))) : [];
  // replay the first failure event of that invoice again: must not restart grace
  const failEv = []; for await (const e of stripe.events.list({ created: { gte: st.startedReal - 120 }, type: 'invoice.payment_failed', limit: 100 })) if (e.data.object.id === s0.latest_invoice.id) failEv.push(e);
  const oldest = failEv.sort((a, b) => a.created - b.created)[0]; let replay = null;
  if (oldest) { const payload = JSON.stringify(oldest); const t = Math.floor(Date.now() / 1000); const sig = createHmac('sha256', priv.STRIPE_WEBHOOK_SECRET).update(`${t}.${payload}`).digest('hex');
    const r = await fetch(`${PP}/api/webhooks/stripe`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': `t=${t},v1=${sig}` }, body: payload }); replay = `${r.status}:${(await r.json()).result ?? ''}`; }
  log('recovery', { invoice_paid: (await stripe.invoices.retrieve(s0.latest_invoice.id)).status, A_access: await access('A'), A_sub: await subRow('A'), replay_old_failure: replay, A_access_after_replay: await access('A'), notices: await notices('A'), events_delivered: evs.length, ignore: firstFail.length });
});

await phase('reactivate', async () => {
  const a2 = st.A.stores[1];
  const op = await operator({ action: 'removed-store-reactivate', apply: true, businessId: a2.id, actor: 'Claudy (engineering)', reason: 'Decision 9 product proof (O-1)', ticket: 'APBM007B-E2-D9' });
  const before = await sqlAs(cast.A.userId, 'select count(*)::int n from public.user_data where business_id = $1', [a2.id]);
  const q = await api('A', '/api/stores/add/quote', { storeName: `O-1 A2 restored ${label}`, npi: a2.npi });
  if (q.status !== 200) { log('reactivate', { operator: op.result, quote_status: q.status, quote: q.body }); return; }
  const seq = reserve(I, 'A paid re-add of removed A2 (decision 9)', { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: q.body.data.amountCents, subscription_mutations: 1 });
  const c = await api('A', '/api/stores/add/confirm', { quoteId: q.body.data.quoteId, intentKey: `o1d9_${randomUUID().replace(/-/g, '')}`, consentTerms: true, consentRecurring: true, consentImmediate: true }); settle(seq, { ok: c.status === 200 });
  const after = await sqlAs(cast.A.userId, 'select count(*)::int n from public.user_data where business_id = $1', [a2.id]);
  const b = (await db.from('businesses').select('id,status,reactivated_at').eq('id', a2.id).single()).data;
  log('reactivate', { operator: op.result, quote_cents: q.body.data.amountCents, state: c.body?.data?.state, activated_business_is_original: c.body?.data?.businessId === a2.id, store: b,
    owner_history_rows_before_payment: before.rows?.[0]?.n ?? before.error, owner_history_rows_after_payment: after.rows?.[0]?.n ?? after.error });
});
console.log('O-1 journey phases done:', st.done.join(', '));
