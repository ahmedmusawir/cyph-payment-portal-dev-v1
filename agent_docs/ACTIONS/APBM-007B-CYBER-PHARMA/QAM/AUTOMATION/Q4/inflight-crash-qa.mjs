#!/usr/bin/env node
// APBM-007B AC-007 — actual server crash/restart proof for Add Store on the OWNED proof pair (OwedBook 3100, Portal 3101 →
// SCRATCH + Stripe sandbox). cwd: Portal root. Never touches 3000/3001/3457 or DEV.
//
//   node scripts/apbm007b/crash-restart.mjs --help
//   node scripts/apbm007b/crash-restart.mjs --cred /tmp/<fixture>.json --label <run> --scenario s1|s2
//   ... --scenario s1 --resume --qty-before <n> --killed-at <ISO> --kill-stage <text>   # continue an ALREADY crashed operation
//        (newest Add Store of the fixture account): no new quote, confirm or kill — capture while down, restart, recover
//
//   s1 (hard kill around the money call): the owner confirms an Add Store with a working card; the Portal process group is
//      SIGKILLed the moment the operation's `pay` intent is durably recorded (i.e. while the provider payment call is in
//      flight). Durable state is captured while the Portal is down; the Portal is restarted; the owner's normal status
//      polling resumes the operation (the dead process's fenced lease must first expire); then the run's real Stripe events
//      are delivered (signed, as a listener would) to prove replays add nothing.
//   s2 (payment while the server is down): with a 3DS card the confirm leaves the operation `payment_pending` with Stripe's
//      hosted page; the Portal is SIGKILLed; the owner completes the hosted TEST challenge on Stripe's page while the Portal
//      is down; state is captured; the Portal is restarted and the owner's status polling activates; events are delivered.
// Assertions (both): exactly one invoice for the operation, paid exactly once (one succeeded charge); subscription quantity
// +1 exactly; exactly one new store row and one owner membership; no store/membership/scope existed before payment.
// Every provider effect is reserved in the E2 ledger before the step that causes it. Nothing secret is printed.
import { createHash, createHmac, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EVIDENCE_ROOT, PORTAL, OWEDBOOK, scratchTarget, loadNamed, scrub } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const credPath = opt('--cred'), label = opt('--label'), scenario = opt('--scenario');
if (!/^\/tmp\/[A-Za-z0-9._-]+\.json$/.test(credPath ?? '') || !existsSync(credPath) || !/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '') || !['s1', 's2'].includes(scenario)) { console.error('FAIL-CLOSED: --cred, --label, --scenario s1|s2'); process.exit(2); }
const cred = JSON.parse(readFileSync(credPath, 'utf8'));
const PP = 'http://localhost:3101', OUTDIR = '/tmp/apbm007b-qa-q4-01/proof'; const I = `CR:${label}:${scenario}`;
const OUT = join(EVIDENCE_ROOT, 'r06', 'CRASH_RESTART', `${label}-${scenario}`); mkdirSync(OUT, { recursive: true });
const req = createRequire(`/tmp/apbm007b-qa-q4-01/proof/pp/package.json`); const { chromium } = req('playwright');
const pg = createRequire(`/tmp/apbm007b-qa-q4-01/proof/ob/package.json`)('pg');
const sc = scratchTarget(); const { stripe, mutate } = await import('./lib/stripe.mjs');
// Real CLI redelivery only; no manual signature in positive crash case.
const opToken = createHash('sha256').update(`${sc.secretKey}:apbm007a-operator-v1`).digest('hex');
const db = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false } }); await db.connect();
const qaLedger=req('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/AUTOMATION/Q4/ledger.cjs');const q = async(sql,p)=>{qaLedger.reserve('Q4 crash SQL query',{reads:1});return(await db.query(sql,p)).rows};
const timeline = []; const mark = (event, data = {}) => { const e = { t: new Date().toISOString(), event, ...JSON.parse(scrub(JSON.stringify(data))) }; timeline.push(e); console.log(event, JSON.stringify(data).slice(0, 300)); };
const save = (extra) => writeFileSync(join(OUT, 'result.json'), JSON.stringify({ label, scenario, timeline, ...extra }, null, 1));
const npi = () => { for (;;) { const n = String(1000000000 + Math.floor(Math.random() * 899999999)); let s = 0; const d = `80840${n}`; for (let i = 0; i < 15; i++) { let x = Number(d[14 - i]); if (i % 2) { x *= 2; if (x > 9) x -= 9; } s += x; } if (s % 10 === 0) return n; } };
const portListening = () => spawnSync('ss', ['-ltnH', 'sport = :3101'], { encoding: 'utf8' }).stdout.trim().length > 0;
const serve = (...a) => { const r = spawnSync('node', [`${PORTAL}/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/AUTOMATION/Q4/proof-serve-qa.mjs`, ...a, '--out', OUTDIR], { encoding: 'utf8' }); return (r.stdout || r.stderr).trim(); };

let cookie = '';
async function login() { qaLedger.reserve("Q4 crash legitimate owner password sign-in",{sign_ins:1,reads:1});
  const r = await fetch(`${PP}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: PP }, body: JSON.stringify({ email: cred.email, password: cred.password }), redirect: 'manual' });
  if (!r.ok) throw new Error(`login ${r.status}`); cookie = r.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
}
const api = async (path, body) => { const r = await fetch(`${PP}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: PP, Cookie: cookie }, body: JSON.stringify(body) }); return { status: r.status, body: await r.json().catch(() => ({})) }; };
const subQty = async () => (await stripe.subscriptions.retrieve(cred.subscription)).items.data[0].quantity;

/** Durable state of the operation + provider + access facts (no secrets). */
async function capture(tag, opId, storeNpi) {
  const op = opId ? (await q('select state, last_error_code, invoice_id, lease_owner is not null as lease_held, lease_until, lease_until > now() as lease_live, fencing_epoch, amount_cents, business_id, payment_deadline, activated_at from public.store_operations where id = $1', [opId]))[0] : null;
  const intents = opId ? await q('select stage, attempt, outcome, created_at, interval_end from public.provider_call_intents where operation_id = $1 order by id', [opId]) : [];
  const stores = await q('select id, status, account_id = $2 as same_account from public.businesses where npi = $1', [storeNpi, cred.accountId]);
  const memberships = await q('select count(*)::int n from public.user_businesses ub join public.businesses b on b.id = ub.business_id where b.npi = $1 and ub.user_id = $2', [storeNpi, cred.userId]);
  await db.query('begin'); await db.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: cred.userId, role: 'authenticated' })]); await db.query('set local role authenticated');
  const scope = (await db.query('select count(*)::int n from public.my_business_ids() m(bid) join public.businesses b on b.id = m.bid where b.npi = $1', [storeNpi])).rows[0].n; await db.query('rollback');
  const invoices = []; if (opId) for await (const i of stripe.invoices.list({ customer: cred.customer, limit: 20 })) if (i.metadata?.apbm_operation === opId) invoices.push(i);
  const pis = new Set();
  for (const i of invoices) for await (const p of stripe.invoicePayments.list({ invoice: i.id, limit: 20 })) { const pi = p.payment?.payment_intent; if (pi) pis.add(typeof pi === 'string' ? pi : pi.id); }
  const charges = []; for await (const c of stripe.charges.list({ customer: cred.customer, limit: 50 })) charges.push(c);
  const opCharges = charges.filter((c) => pis.has(typeof c.payment_intent === 'string' ? c.payment_intent : c.payment_intent?.id));
  const state = { tag, at: new Date().toISOString(), portal_listening: portListening(), operation: op, intents,
    provider: { invoices_for_operation: invoices.map((i) => ({ id: i.id, status: i.status, total: i.total, amount_paid: i.amount_paid, attempt_count: i.attempt_count })),
      succeeded_charges_for_operation: opCharges.filter((c) => c.status === 'succeeded').length, failed_charges_for_operation: opCharges.filter((c) => c.status === 'failed').length,
      subscription_quantity: await subQty() },
    access: { store_rows_for_npi: stores.length, live_or_active: stores.filter((s) => s.status === 'active').length, owner_memberships_for_npi: memberships[0].n, in_owner_scope: scope } };
  writeFileSync(join(OUT, `state_${tag}.json`), JSON.stringify(state, null, 1)); mark(`capture:${tag}`, { op: op?.state, lease_live: op?.lease_live, invoices: state.provider.invoices_for_operation.map((i) => i.status), charges_ok: state.provider.succeeded_charges_for_operation, qty: state.provider.subscription_quantity, stores: stores.length, scope });
  return state;
}
async function deliver(since,invoiceId) {
 const events=[];for await(const event of stripe.events.list({created:{gte:since},limit:100}))if(event.data.object.id===invoiceId&&['invoice.paid','invoice.payment_failed'].includes(event.type))events.push(event);
 const out={};for(const event of events){const seq=reserve(I,'provider real event resend after owned crash',{subscription_mutations:1});const qa=loadNamed(PORTAL,{required:['STRIPE_SECRET_KEY']});const result=spawnSync('stripe',['events','resend',event.id,'--confirm'],{encoding:'utf8',env:{PATH:process.env.PATH,HOME:process.env.HOME,STRIPE_API_KEY:qa.STRIPE_SECRET_KEY},timeout:30000});settle(seq,{exit:result.status});if(result.status)throw new Error('provider resend failed');await new Promise(r=>setTimeout(r,3000));out[event.id]={type:event.type,delivery_lane:'real provider resend to existing Stripe CLI',manual_signer:false};}return out;
}
async function restartAndRecover(opId) {
  mark('restart:start', { out: serve('start', '--only', 'pp') });
  for (let i = 0; i < 60; i++) { try { const r = await fetch(`${PP}/api/build-info`); if (r.ok) { mark('restart:ready', await r.json()); break; } } catch { /* starting */ } await new Promise((r) => setTimeout(r, 1000)); }
  await login(); return recoverPolls(opId);
}
async function recoverPolls(opId) {
  const polls = [];
  for (let i = 0; i < 30; i++) {   // the owner's page polls status; up to ~150 s (lease of a killed process lasts 60 s)
    const s = await api('/api/stores/add/status', { operationId: opId });
    polls.push({ t: new Date().toISOString(), http: s.status, state: s.body?.data?.state ?? s.body?.error ?? null });
    if (['activated', 'expired_unpaid', 'attention', 'closed_refunded_externally'].includes(s.body?.data?.state)) break;
    await new Promise((r) => setTimeout(r, 5000));
  }
  mark('recovery:polls', { polls: polls.map((p) => `${p.t.slice(11, 19)} ${p.http} ${p.state}`) });
  return polls;
}

// ---------------------------------------------------------------- run
const resume = args.includes('--resume');
const t0 = Math.floor(Date.now() / 1000) - 3600;
if (!resume && !portListening()) { console.error('FAIL-CLOSED: proof Portal 3101 not running'); process.exit(2); }
if (resume) {
  if (portListening()) { console.error('FAIL-CLOSED: --resume expects the crashed Portal to still be down'); process.exit(2); }
  const op0 = (await q(`select id, npi, amount_cents, state from public.store_operations where account_id = $1 and kind = 'store_add' order by created_at desc limit 1`, [cred.accountId]))[0];
  const qtyBefore = Number(opt('--qty-before')); const killedAt = opt('--killed-at'); const killStage = opt('--kill-stage');
  mark('resume', { op_state: op0.state, note: 'first run crashed the Portal as designed, then the evidence capture failed on a query error; this run continues the SAME operation (no new quote/confirm/kill)', killedAt, killStage });
  await capture('down_resume', op0.id, op0.npi);
  const polls = await (async () => { mark('restart:start', { out: serve('start', '--only', 'pp') });
    for (let i = 0; i < 60; i++) { try { const r = await fetch(`${PP}/api/build-info`); if (r.ok) { mark('restart:ready', await r.json()); break; } } catch { /* starting */ } await new Promise((r) => setTimeout(r, 1000)); }
    await login(); return recoverPolls(op0.id); })();
  await finish(op0.id, op0.npi, op0.amount_cents, qtyBefore, killStage, killedAt, { error: 'UND_ERR_SOCKET (first run)' }, polls, (await q('select 1')).length && await (async () => JSON.parse(readFileSync(join(OUT, 'state_down_resume.json'), 'utf8')))());
  await db.end(); process.exit(0);
}
if (args.includes('--finish-only')) {
  // Finish an ALREADY recovered scenario whose run was interrupted after recovery (S2): no quote, confirm, kill, restart or
  // payment. Inputs come from that run's own saved captures; recovery polls were not saved by the interrupted run.
  if (!portListening()) { console.error('FAIL-CLOSED: --finish-only needs the restarted Portal running'); process.exit(2); }
  const before = JSON.parse(readFileSync(join(OUT, 'state_before_kill.json'), 'utf8'));
  const down = JSON.parse(readFileSync(join(OUT, 'state_down_settled.json'), 'utf8'));
  const opId = (await q(`select id from public.store_operations where account_id = $1 and kind = 'store_add' and created_at >= $2 order by created_at desc limit 1`, [cred.accountId, new Date(Date.parse(before.at) - 120000).toISOString()]))[0].id;
  const op1 = (await q('select npi, amount_cents, state, activated_at from public.store_operations where id = $1', [opId]))[0];
  const events = await q('select type, status, error_code, received_at from public.stripe_events where object_id = $1 order by received_at', [down.provider.invoices_for_operation[0].id]);
  mark('finish-only', { note: 'interrupted run finished; nothing repeated', op_state: op1.state, activated_at: op1.activated_at, invoice_events_recorded_before_finish: events, recovery_path: 'owner status polling after restart (the interrupted run reached activation before its manual event delivery began)' });
  await login();
  await finish(opId, op1.npi, op1.amount_cents, before.provider.subscription_quantity, 'payment_pending (idle server)', before.at, { http: 200, state: 'payment_pending' }, [{ note: 'polls not saved by the interrupted run; activation time from the operation row', activated_at: op1.activated_at }], down);
  await db.end(); process.exit(0);
}
await login();
const qtyBefore = await subQty(); const storeNpi = npi();
const quote = await api('/api/stores/add/quote', { storeName: `CR ${label} ${scenario}`, npi: storeNpi });
if (quote.status !== 200) { console.error(`quote refused ${quote.status} ${JSON.stringify(quote.body).slice(0, 200)}`); process.exit(1); }
const cents = quote.body.data.amountCents;
const providerSub=await stripe.subscriptions.retrieve(cred.subscription);const providerItem=providerSub.items.data[0];const qrow=(await q('select computed_at from public.store_quotes where id=$1',[quote.body.data.quoteId]))[0];const instant=Math.floor(Date.parse(qrow.computed_at)/1000),span=BigInt(providerItem.current_period_end-providerItem.current_period_start);const expected=Number((4900n*BigInt(providerItem.current_period_end-instant)+span/2n)/span);mark('independent_expected_before_confirm',{period_start:providerItem.current_period_start,period_end:providerItem.current_period_end,quote_computed_at:qrow.computed_at,expected_cents:expected,application_helper_used:false});if(cents!==expected)throw new Error('QA expected cents mismatch');mark('quote',{cents,qty_before:qtyBefore});
let opId = null; let killedAt = null; let killStage = null; let polls = []; let hosted = null; let confirmOutcome = null;

if (scenario === 's2') {
  const pm = await mutate(I, 's2 attach 3DS card', { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach('pm_card_authenticationRequired', { customer: cred.customer }, o), { idem: `apbm007b:cr:${label}:s2:pm` });
  await mutate(I, 's2 default 3DS card', { default_card_changes: 1 }, (o) => stripe.customers.update(cred.customer, { invoice_settings: { default_payment_method: pm.id } }, o), { idem: `apbm007b:cr:${label}:s2:default` });
}
const seq = reserve(I, `${scenario}: product confirm → invoice/item/finalize + ONE API pay attempt (${cents})`, { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: cents, subscription_mutations: 1 });
const confirmP = api('/api/stores/add/confirm', { quoteId: quote.body.data.quoteId, intentKey: `cr_${randomUUID().replace(/-/g, '')}`, consentTerms: true, consentRecurring: true, consentImmediate: true })
  .then((r) => { confirmOutcome = { http: r.status, state: r.body?.data?.state ?? r.body?.error }; return r; }, (e) => { confirmOutcome = { error: e.cause?.code ?? e.name }; return null; });

if (scenario === 's1') {
  // Kill the moment the pay intent is durable (the provider payment call is then in flight or about to be).
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline && !killedAt) {
    const op = (await q(`select id, state from public.store_operations where account_id = $1 and kind = 'store_add' and npi = $2 order by created_at desc limit 1`, [cred.accountId, storeNpi]))[0];
    if (op) { opId = op.id; const pay = (await q(`select 1 from public.provider_call_intents where operation_id = $1 and stage = 'pay'`, [op.id])).length;
      if (pay || ['paid_pending_activation', 'activated'].includes(op.state)) { killStage = pay ? `pay intent recorded (op state ${op.state})` : `op already ${op.state}`; mark('kill:issue', { killStage, out: serve('stop', '--only', 'pp', '--signal', 'KILL') }); killedAt = new Date().toISOString(); } }
    if (!killedAt) await new Promise((r) => setTimeout(r, 40));
  }
  await confirmP; mark('confirm:client', confirmOutcome);
} else {
  await confirmP; mark('confirm:client', confirmOutcome);
  opId = (await q(`select id from public.store_operations where account_id = $1 and kind = 'store_add' and npi = $2 order by created_at desc limit 1`, [cred.accountId, storeNpi]))[0].id;
  const st = await api('/api/stores/add/status', { operationId: opId }); hosted = st.body?.data?.hostedPaymentUrl ?? null;
  mark('pending', { state: st.body?.data?.state, hosted_link: !!hosted });
  await capture('before_kill', opId, storeNpi);
  killStage = 'payment_pending (idle server)'; mark('kill:issue', { killStage, out: serve('stop', '--only', 'pp', '--signal', 'KILL') }); killedAt = new Date().toISOString();
}
settle(seq, { ok: true, scenario, kill_stage: killStage, confirm_client: confirmOutcome });
await new Promise((r) => setTimeout(r, 1500));
await capture('down_immediately', opId, storeNpi);

if (scenario === 's2' && hosted) {
  const h = reserve(I, `s2: BROWSER hosted invoice submission + 3DS test challenge while the Portal is DOWN (${cents})`, { invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: cents });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' }); let clicked = false;
  try {
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 1400 }, locale: 'en-US' })).newPage();
    await page.goto(hosted, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const confirm = page.getByRole('button', { name: /Confirm payment|^Pay\b/i }).first(); await confirm.waitFor({ timeout: 30000 }); await page.waitForTimeout(3000); await confirm.click();
    for (let i = 0; i < 45 && !clicked; i++) { await page.waitForTimeout(1000); for (const f of page.frames()) { const b = f.locator('#test-source-authorize-3ds'); if (!(await b.count().catch(() => 0))) continue; if (!(await b.first().isVisible().catch(() => false)) || !(await b.first().isEnabled().catch(() => false))) continue; await page.waitForTimeout(2500); try { await b.first().click({ timeout: 5000 }); clicked = true; } catch { /* not bound */ } break; } }
    if (clicked) { await page.waitForTimeout(6000); for (const f of page.frames()) { const b = f.locator('#test-source-authorize-3ds'); if (await b.first().isVisible().catch(() => false)) { await b.first().click({ timeout: 5000 }).catch(() => {}); break; } } }
  } finally { await browser.close(); }
  let paid = false; for (let i = 0; i < 30 && !paid; i++) { await new Promise((r) => setTimeout(r, 2000)); const inv = (await capture(`down_poll`, opId, storeNpi)).provider.invoices_for_operation; paid = inv.some((x) => x.status === 'paid'); }
  settle(h, { ok: paid, challenge_clicked: clicked, portal_listening_during_payment: portListening() });
  mark('hosted:paid_while_down', { paid, portal_listening: portListening() });
}
await new Promise((r) => setTimeout(r, 4000));
const down = await capture('down_settled', opId, storeNpi);
polls = await restartAndRecover(opId);
await finish(opId, storeNpi, cents, qtyBefore, killStage, killedAt, confirmOutcome, polls, down);
await db.end();
async function finish(opId, storeNpi, cents, qtyBefore, killStage, killedAt, confirmOutcome, polls, down) {
const recovered = await capture('after_recovery', opId, storeNpi);
const events = await deliver(t0,recovered.provider.invoices_for_operation[0]?.id);mark('events:real_CLI_redelivery',{method:'provider events resend → owned Stripe CLI; no manual signer',results:events});
await new Promise((r) => setTimeout(r, 2000));
const jobs={store_operations:'Not invoked in crash case; expiry driver tests scope-guarded minute jobs separately'};mark('jobs',{store_operations:jobs.store_operations});
const final = await capture('final', opId, storeNpi);
const st = await api('/api/stores/add/status', { operationId: opId });
const checks = {
  killed_while_operation_unfinished: !!down.operation && !['activated'].includes(down.operation.state),
  no_access_while_down: down.access.store_rows_for_npi === 0 && down.access.owner_memberships_for_npi === 0 && down.access.in_owner_scope === 0,
  recovered_state_activated: final.operation.state === 'activated' && st.body?.data?.state === 'activated',
  exactly_one_invoice: final.provider.invoices_for_operation.length === 1,
  paid_exactly_once: final.provider.invoices_for_operation[0]?.amount_paid === cents && final.provider.succeeded_charges_for_operation === 1,
  quantity_plus_one_exactly: final.provider.subscription_quantity === qtyBefore + 1,
  exactly_one_store_and_membership: final.access.store_rows_for_npi === 1 && final.access.owner_memberships_for_npi === 1 && final.access.in_owner_scope === 1,
  replayed_events_added_nothing: JSON.stringify(final.access) === JSON.stringify(recovered.access) && final.provider.subscription_quantity === recovered.provider.subscription_quantity,
};
save({ cents, qty_before: qtyBefore, kill_stage: killStage, killed_at: killedAt, confirm_client: confirmOutcome, recovery_polls: polls, checks, pass: Object.values(checks).every(Boolean) });
mark('RESULT', { pass: Object.values(checks).every(Boolean), checks });
}
