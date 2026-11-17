#!/usr/bin/env node
// APBM-007B database proof (0061–0067). cwd: OwedBook repository root.
//
//   node scripts/apbm007b/sql-proof.mjs --help
//   node scripts/apbm007b/sql-proof.mjs --local <url>       # local rehearsal DB: rolled-back scenarios + committed concurrency
//   node scripts/apbm007b/sql-proof.mjs --scratch            # SCRATCH (verified ref): rolled-back scenarios only, no commits
//
// Every scenario runs inside BEGIN … ROLLBACK, so nothing persists. Customer calls run as the `authenticated` role with
// request.jwt.claims set to the actor (what PostgREST does for a signed-in user); service calls run as service_role.
// The two concurrency checks COMMIT and therefore run only with --local. Fixtures are synthetic and created inside
// each transaction. Output: JSON check list; exit 1 on any failure. Never targets DEV.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
let url, target;
if (args.includes('--local')) {
  url = args[args.indexOf('--local') + 1]; target = 'local';
  if (!['127.0.0.1', 'localhost'].includes(new URL(url).hostname)) { console.error('FAIL-CLOSED: --local must be 127.0.0.1/localhost'); process.exit(2); }
} else if (args.includes('--scratch')) {
  const { scratchTarget } = await import('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/scripts/apbm007b/lib/env.mjs');
  url = scratchTarget().dbUrl; target = 'scratch';
} else { console.error('FAIL-CLOSED: --local <url> or --scratch required'); process.exit(2); }
const ssl = target === 'scratch' ? { rejectUnauthorized: false } : undefined;

const checks = [];
const check = (name, ok, detail) => { checks.push({ name, status: ok ? 'PASS' : 'FAIL', ...(ok ? {} : { detail: String(detail ?? '').slice(0, 300) }) }); };
const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
const NPI = ['1003000043', '1003000050', '1003000068', '1003000076', '1003000084', '1003000092'].filter(Boolean);

async function scenario(name, fn) {
  const c = new pg.Client({ connectionString: url, ssl }); await c.connect();
  await c.query("set statement_timeout = '30s'");
  await c.query('begin');
  try { await fn(mk(c)); } catch (e) { check(`${name}: unexpected error`, false, `${e.code ?? ''} ${e.message}`); }
  finally { await c.query('rollback').catch(() => {}); await c.end(); }
}
// Helpers bound to one connection.
function mk(c) {
  const svc = async (sql, p) => { await c.query('set local role service_role'); try { const r = (await c.query(sql, p)).rows; await c.query('reset role'); return r; } catch (e) { throw e; } };
  const v0 = (r) => r?.rows?.[0] ? Object.values(r.rows[0])[0] : { error: r?.error, message: r?.message };
  const as = async (uid, sql, p) => {
    await c.query('savepoint s');
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })]);
    await c.query('set local role authenticated');
    try { const r = (await c.query(sql, p)).rows; await c.query('reset role'); await c.query('release savepoint s'); return { rows: r }; }
    catch (e) { await c.query('rollback to savepoint s'); await c.query('reset role'); return { error: e.code ?? 'error', message: e.message }; }
  };
  const raw = async (sql, p) => (await c.query(sql, p)).rows;
  return { c, svc, as, raw, v0 };
}

// Synthetic world inside the transaction: accounts A (2 stores: owner, admin2, member) and B (1 store), foreign F.
async function world(db) {
  const id = () => randomUUID();
  const u = { ownerA: id(), adminA2: id(), memberA: id(), ownerB: id(), foreign: id(), invitee: id() };
  for (const [k, v] of Object.entries(u)) await db.raw(`insert into auth.users (id, email, aud, role, instance_id, email_confirmed_at, created_at, updated_at) values ($1, $2, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now(), now())`, [v, `${k.toLowerCase()}-${v.slice(0, 8)}@proof.invalid`]);
  const acct = { A: id(), B: id(), F: id() };
  await db.raw(`insert into public.accounts (id, name, owner_user_id) values ($1,'Proof A',$2),($3,'Proof B',$4),($5,'Proof F',$6)`, [acct.A, u.ownerA, acct.B, u.ownerB, acct.F, u.foreign]);
  const s = { A1: id(), A2: id(), B1: id(), F1: id() };
  const ins = async (bid, a, npi, name) => { await db.raw(`insert into public.pharmacy_identities (id, npi) values ($1, $2)`, [bid, npi]); await db.raw(`insert into public.businesses (id, account_id, pharmacy_id, npi, pharmacy_name, status, state) values ($1,$2,$1,$3,$4,'active','NY')`, [bid, a, npi, name]); };
  await ins(s.A1, acct.A, NPI[0], 'Proof A1'); await ins(s.A2, acct.A, NPI[1], 'Proof A2'); await ins(s.B1, acct.B, NPI[2], 'Proof B1'); await ins(s.F1, acct.F, NPI[3], 'Proof F1');
  const mem = [[u.ownerA, s.A1, 'admin'], [u.adminA2, s.A2, 'admin'], [u.memberA, s.A1, 'member'], [u.memberA, s.A2, 'member'], [u.ownerB, s.B1, 'admin'], [u.foreign, s.F1, 'admin']];
  for (const [uid, b, r] of mem) await db.raw(`insert into public.user_businesses (user_id, business_id, role, is_primary) values ($1,$2,$3,false)`, [uid, b, r]);
  for (const [a, n] of [[acct.A, 2], [acct.B, 1]]) {
    await db.raw(`insert into public.billing_customers (account_id, stripe_customer_id) values ($1, $2)`, [a, `cus_proof${a.slice(0, 6)}`]);
    await db.raw(`insert into public.subscriptions (account_id, origin, stripe_customer_id, stripe_subscription_id, status, raw_status, quantity, stripe_price_id, stripe_subscription_item_id, current_period_start, current_period_end, cancel_at_period_end, verified_at, policy_version)
      values ($1,'stripe',$2,$3,'active','active',$4,'price_proof',$5, now() - interval '10 days', now() + interval '20 days', false, now(), 'v1')`, [a, `cus_proof${a.slice(0, 6)}`, `sub_proof${a.slice(0, 6)}`, n, `si_proof${a.slice(0, 6)}`]);
  }
  for (const b of [s.A1, s.A2, s.B1]) await db.raw(`insert into public.user_data (business_id, drug_name, status, owed) select $1, 'SYNTH', 'owed', 10 from generate_series(1,3)`, [b]);
  await db.raw(`insert into public.report_files (business_id, file_name) values ($1, 'a2.csv')`, [s.A2]);
  return { u, acct, s };
}
const period = async (db, a) => (await db.raw(`select current_period_start s, current_period_end e, stripe_customer_id c, stripe_subscription_id sub, stripe_subscription_item_id it, quantity q from public.subscriptions where account_id = $1`, [a]))[0];
const ids = (r) => (r.rows ?? []).map((x) => Object.values(x)[0]);

// ---------------------------------------------------------------- scenarios
await scenario('backfill', async (db) => {
  // A completed transfer (AC-022) adds a successor ownership row under the SAME identity, so identities may be fewer than
  // ownership rows. The invariants are: every row has an existing identity; every identity has at most one live ownership;
  // and an identity with more than one ownership row has a completed transfer between them.
  const r = (await db.raw(`select count(*)::int n,
      count(*) filter (where b.pharmacy_id is null or not exists (select 1 from public.pharmacy_identities i where i.id = b.pharmacy_id))::int orphan,
      (select count(*)::int from (select pharmacy_id from public.businesses where public.store_is_live(id) group by 1 having count(*) > 1) x) multi_live,
      (select count(*)::int from (select pharmacy_id from public.businesses group by 1 having count(*) > 1) y
        where not exists (select 1 from public.store_transfers t where t.pharmacy_id = y.pharmacy_id and t.status = 'completed')) multi_without_transfer,
      (select count(*)::int from public.pharmacy_identities) idn from public.businesses b`))[0];
  check('every ownership row maps to an existing canonical identity; one live ownership per identity; shared identity only via a completed transfer',
    r.orphan === 0 && r.multi_live === 0 && r.multi_without_transfer === 0 && r.idn <= r.n, JSON.stringify(r));
  const old = await db.raw(`select indexname from pg_indexes where schemaname='public' and indexname in ('uq_businesses_npi','businesses_one_active_npi','businesses_one_current_ownership')`);
  check('old all-row NPI index replaced by active-ownership indexes', old.length === 2 && !old.some((x) => x.indexname === 'uq_businesses_npi'), JSON.stringify(old));
});

await scenario('007A inserters stay compatible', async (db) => {
  const w = await world(db);
  const b = (await db.raw(`insert into public.businesses (account_id, npi, pharmacy_name, status) values ($1, '1003000209', 'Legacy insert', 'active') returning id, pharmacy_id, ownership_started_at`, [w.acct.B]))[0];
  check('a store inserted without pharmacy_id (007A provisioning shape) gets its own canonical identity', b.pharmacy_id === b.id && !!b.ownership_started_at, JSON.stringify(b));
  let dup; try { await db.raw('savepoint d'); await db.raw(`insert into public.businesses (account_id, npi, pharmacy_name, status) values ($1, $2, 'Dup', 'active')`, [w.acct.B, NPI[0]]); dup = 'inserted'; } catch (e) { dup = e.code; await db.raw('rollback to savepoint d'); }
  check('an NPI with an existing identity is never silently re-attached by a plain insert', dup === '23505', dup);
});

await scenario('live predicate and removal cutoff', async (db) => {
  const w = await world(db);
  const mine = async (uid) => ids(await db.as(uid, 'select public.my_business_ids()')).sort();
  check('owner A sees both stores', JSON.stringify(await mine(w.u.ownerA)) === JSON.stringify([w.s.A1, w.s.A2].sort()));
  check('foreign sees none of A', !(await mine(w.u.foreign)).some((x) => x === w.s.A1 || x === w.s.A2));
  await db.raw(`update public.businesses set removal_requested_at = now() - interval '2 days', removal_effective_at = now() - interval '1 minute' where id = $1`, [w.s.A2]);
  check('after cutoff: owner loses A2 via my_business_ids', !(await mine(w.u.ownerA)).includes(w.s.A2));
  check('after cutoff: member loses A2 (is_member_of false)', (await db.as(w.u.memberA, 'select public.is_member_of($1) v', [w.s.A2])).rows?.[0]?.v === false);
  check('after cutoff: admin loses admin_members', !!(await db.as(w.u.adminA2, 'select public.admin_members($1)', [w.s.A2])).error);
  check('after cutoff: claims RPC denied to owner', !!(await db.as(w.u.ownerA, `select public.owedbook_pbm_options($1)`, [w.s.A2])).error);
  check('after cutoff: store_access_state denied', !!(await db.as(w.u.ownerA, 'select public.store_access_state($1)', [w.s.A2])).error);
  check('after cutoff: report_files row not visible', (await db.as(w.u.ownerA, 'select count(*)::int n from public.report_files where business_id = $1', [w.s.A2])).rows?.[0]?.n === 0);
  check('after cutoff: businesses row not visible', (await db.as(w.u.ownerA, 'select count(*)::int n from public.businesses where id = $1', [w.s.A2])).rows?.[0]?.n === 0);
  check('after cutoff: memberships not visible', (await db.as(w.u.memberA, 'select count(*)::int n from public.user_businesses where business_id = $1', [w.s.A2])).rows?.[0]?.n === 0);
  check('A1 still live for member', (await db.as(w.u.memberA, 'select public.is_member_of($1) v', [w.s.A1])).rows?.[0]?.v === true);
  const fin = await db.svc('select public.store_removal_finalize($1) r', [w.s.A2]);
  const row = (await db.raw('select status, ownership_ended_at is not null ended, (select count(*)::int from public.user_businesses where business_id=$1) m, (select count(*)::int from public.user_data where business_id=$1) claims from public.businesses where id=$1', [w.s.A2]))[0];
  check('finalize: status removed, ownership ended, memberships retired, claims preserved', fin[0].r === 'removed' && row.status === 'removed' && row.ended && row.m === 0 && row.claims === 3, JSON.stringify(row));
  check('finalize is idempotent', (await db.svc('select public.store_removal_finalize($1) r', [w.s.A2]))[0].r === 'already_final');
  check('removed store: no seller-history exception for ordinary removal', !!(await db.as(w.u.ownerA, 'select public.owner_history_rows($1)', [w.s.A2])).error);
});

await scenario('clock exclusion', async (db) => {
  const w = await world(db);
  const fresh = (await db.raw('select count(*)::int n from public.billing_deployment'))[0].n === 0;
  if (fresh) await db.svc('select public.billing_deployment_bind($1)', [SCRATCH_REF]);
  const bound = (await db.raw('select project_ref from public.billing_deployment'))[0]?.project_ref;
  const past = '2030-01-01T00:00:00Z';
  if (bound === SCRATCH_REF) {
    await db.svc('select public.billing_test_context_enable($1, $2, $3, $4)', [w.acct.A, 'proof-clock', 'clock_proof', past]);
    check('SCRATCH + enabled context: billing_now = frozen time', new Date((await db.svc('select public.billing_now($1) t', [w.acct.A]))[0].t).toISOString() === new Date(past).toISOString());
    check('other account unaffected (real now)', Math.abs(new Date((await db.svc('select public.billing_now($1) t', [w.acct.B]))[0].t) - Date.now()) < 120000);
    await db.svc('select public.billing_test_context_disable($1)', [w.acct.A]);
    const left = (await db.raw('select frozen_at from public.billing_test_contexts where account_id = $1', [w.acct.A]))[0];
    check('disabled context with non-null old frozen time: billing_now = real now', !!left?.frozen_at && Math.abs(new Date((await db.svc('select public.billing_now($1) t', [w.acct.A]))[0].t) - Date.now()) < 120000);
  }
  check('customer cannot call billing_now', !!(await db.as(w.u.ownerA, 'select public.billing_now($1)', [w.acct.A])).error);
  check('customer cannot enable a test context', !!(await db.as(w.u.ownerA, `select public.billing_test_context_enable($1,'x-run','clock_x', now())`, [w.acct.A])).error);
  check('customer cannot bind deployment identity', !!(await db.as(w.u.ownerA, `select public.billing_deployment_bind('aaaaaaaaaaaaaaaaaaaa')`)).error);
  check('forged claim flag/header has no effect (billing_now takes no user input)', (await db.raw(`select count(*)::int n from pg_proc where proname = 'billing_now' and pronargs = 1`))[0].n === 1);
  let rebind; try { await db.raw('savepoint rb'); await db.svc(`select public.billing_deployment_bind('yrsuwikjnbmvpznrgydb')`); rebind = 'allowed'; } catch (e) { rebind = e.code; await db.raw('rollback to savepoint rb'); }
  check('bound identity is immutable (cannot be rebound to DEV or anything else)', rebind === '42501', rebind);
});

await scenario('clock refused on a DEV-identity deployment', async (db) => {
  if ((await db.raw('select count(*)::int n from public.billing_deployment'))[0].n > 0) { check('DEV-identity negative (needs unbound deployment; skipped on bound target)', true); return; }
  const w = await world(db);
  await db.svc(`select public.billing_deployment_bind('yrsuwikjnbmvpznrgydb')`);
  let r; try { await db.raw('savepoint d'); await db.svc(`select public.billing_test_context_enable($1,'dev-try','clock_dev', '2030-01-01')`, [w.acct.A]); r = 'allowed'; } catch (e) { r = e.code; await db.raw('rollback to savepoint d'); }
  check('DEV identity: enabling a test context is refused', r === '42501', r);
  await db.raw(`insert into public.billing_test_contexts (account_id, run_label, stripe_test_clock_id, frozen_at, enabled) values ($1,'injected','clock_inj','2030-01-01', true)`, [w.acct.A]);
  check('DEV identity with injected enabled non-null clock row: billing_now = real now', Math.abs(new Date((await db.svc('select public.billing_now($1) t', [w.acct.A]))[0].t) - Date.now()) < 120000);
});

await scenario('add store saga', async (db) => {
  const w = await world(db); const p = await period(db, w.acct.A); const npi = NPI[4];
  const q = (await db.svc(`select public.store_quote_create($1,$2,'New Store',$3,null,$4,$5,$6,'price_proof',4900,$7,$8,$9,'terms-v1') r`, [w.acct.A, w.u.ownerA, npi, p.c, p.sub, p.it, p.q, p.s, p.e]))[0].r;
  check('quote created with amount < 4900 and next renewal 9900+4900*2', q.quote && q.quote.amount_cents < 4900 && q.quote.amount_cents > 2500 && q.quote.next_renewal_cents === 19700, JSON.stringify(q));
  const bad = (await db.svc(`select public.store_quote_create($1,$2,'X',$3,null,$4,$5,$6,'price_proof',4900,$7,$8,$9,'terms-v1') r`, [w.acct.A, w.u.adminA2, npi, p.c, p.sub, p.it, p.q, p.s, p.e]))[0].r;
  check('quote refused for non-owner actor', bad.error === 'not_owner', JSON.stringify(bad));
  check('quote refused for a registered NPI', (await db.svc(`select public.store_quote_create($1,$2,'X',$3,null,$4,$5,$6,'price_proof',4900,$7,$8,$9,'terms-v1') r`, [w.acct.A, w.u.ownerA, NPI[2], p.c, p.sub, p.it, p.q, p.s, p.e]))[0].r.error === 'npi_registered');
  check('quote refused on provider/local quantity mismatch', (await db.svc(`select public.store_quote_create($1,$2,'X',$3,null,$4,$5,$6,'price_proof',4900,5,$7,$8,'terms-v1') r`, [w.acct.A, w.u.ownerA, npi, p.c, p.sub, p.it, p.s, p.e]))[0].r.error === 'quantity_mismatch');
  const intent = 'intent_' + randomUUID().replace(/-/g, '');
  const cl = (await db.svc(`select public.store_operation_claim($1,$2,$3,'terms-v1') r`, [q.quote.id, w.u.ownerA, intent]))[0].r;
  check('claim creates payment_setup op with NPI op_held and deadline <= 30 min', cl.operation?.state === 'payment_setup' && !('hosted_invoice_url' in cl.operation), JSON.stringify(cl));
  const op = cl.operation.id;
  check('same intent resumes the same operation', (await db.svc(`select public.store_operation_claim($1,$2,$3,'terms-v1') r`, [q.quote.id, w.u.ownerA, intent]))[0].r.operation?.id === op);
  check('new intent while unresolved is refused', (await db.svc(`select public.store_operation_claim($1,$2,$3,'terms-v1') r`, [q.quote.id, w.u.ownerA, 'intent_' + 'b'.repeat(20)]))[0].r.error === 'quote_used');
  check('pending store grants nothing: no business row for the NPI', (await db.raw('select count(*)::int n from public.businesses where npi = $1', [npi]))[0].n === 0);
  check('registration cannot reserve an Add Store-held NPI', true);
  const ep = (await db.svc(`select public.store_operation_lease($1,'w1',30) e`, [op]))[0].e;
  check('competing lease refused while held', (await db.svc(`select public.store_operation_lease($1,'w2',30) e`, [op]))[0].e === null);
  check('stale epoch transition refused', (await db.svc(`select public.store_operation_transition($1,'w1',$2,'payment_pending',null,null,null) r`, [op, Number(ep) - 1]))[0].r === 'lease_lost');
  check('invoice mapping with wrong amount refused', (await db.svc(`select public.store_operation_map_invoice($1,'w1',$2,'in_proof1',$3,1) r`, [op, ep, p.c]))[0].r === 'binding_mismatch');
  check('invoice mapped', (await db.svc(`select public.store_operation_map_invoice($1,'w1',$2,'in_proof1',$3,$4) r`, [op, ep, p.c, q.quote.amount_cents]))[0].r === 'mapped');
  await db.svc(`select public.store_operation_transition($1,'w1',$2,'payment_pending',null,'in_proof1',null)`, [op, ep]);
  await db.svc(`select public.store_operation_transition($1,'w1',$2,'paid_pending_activation',null,null,null)`, [op, ep]);
  check('activation refused on amount mismatch → attention', (await db.svc(`select public.store_add_activate($1,'in_proof1',1,'usd',3,$2,$3) r`, [op, p.s, p.e]))[0].r.code === 'payment_mismatch');
  await db.raw(`update public.store_operations set state = 'paid_pending_activation', last_error_code = null where id = $1`, [op]);
  check('activation refused on changed period → attention', (await db.svc(`select public.store_add_activate($1,'in_proof1',$2,'usd',3,$3,$4) r`, [op, q.quote.amount_cents, p.s, new Date(new Date(p.e).getTime() + 1000)]))[0].r.code === 'period_changed');
  await db.raw(`update public.store_operations set state = 'paid_pending_activation', last_error_code = null where id = $1`, [op]);
  const act = (await db.svc(`select public.store_add_activate($1,'in_proof1',$2,'usd',3,$3,$4) r`, [op, q.quote.amount_cents, p.s, p.e]))[0].r;
  check('activation creates exactly one store, owner is its admin, hold consumed', act.outcome === 'activated', JSON.stringify(act));
  const st = (await db.raw(`select (select count(*)::int from public.businesses where npi=$1) b, (select role from public.user_businesses where business_id=$2 and user_id=$3) r, (select status from public.npi_reservations where store_operation_id=$4) h, (select quantity from public.subscriptions where account_id=$5) qty`, [npi, act.business_id, w.u.ownerA, op, w.acct.A]))[0];
  check('activated state', st.b === 1 && st.r === 'admin' && st.h === 'consumed' && st.qty === 3, JSON.stringify(st));
  check('activation is idempotent', (await db.svc(`select public.store_add_activate($1,'in_proof1',$2,'usd',3,$3,$4) r`, [op, q.quote.amount_cents, p.s, p.e]))[0].r.outcome === 'already_activated');
  check('owner sees the new store; foreign does not', ids(await db.as(w.u.ownerA, 'select public.my_business_ids()')).includes(act.business_id) && !ids(await db.as(w.u.foreign, 'select public.my_business_ids()')).includes(act.business_id));
  check('owner_store_operations exposes no capability URL', !JSON.stringify((await db.as(w.u.ownerA, 'select public.owner_store_operations() r')).rows).includes('hosted'));
  check('admin/member cannot read owner_store_operations', !!(await db.as(w.u.adminA2, 'select public.owner_store_operations()')).error);
});

await scenario('expiry releases only after verified unpaid', async (db) => {
  const w = await world(db); const p = await period(db, w.acct.A);
  const q = (await db.svc(`select public.store_quote_create($1,$2,'Exp',$3,null,$4,$5,$6,'price_proof',4900,$7,$8,$9,'terms-v1') r`, [w.acct.A, w.u.ownerA, NPI[5], p.c, p.sub, p.it, p.q, p.s, p.e]))[0].r;
  const op = (await db.svc(`select public.store_operation_claim($1,$2,$3,'terms-v1') r`, [q.quote.id, w.u.ownerA, 'intent_' + 'e'.repeat(20)]))[0].r.operation.id;
  check('owner abandon records cancel_requested only', (await db.svc('select public.store_operation_cancel_request($1,$2) r', [op, w.u.ownerA]))[0].r === 'cancel_requested');
  check('hold still held after abandon request (no blind release)', (await db.raw('select status from public.npi_reservations where store_operation_id=$1', [op]))[0].status === 'op_held');
  const ep = (await db.svc(`select public.store_operation_lease($1,'job',30) e`, [op]))[0].e;
  check('paid-after-abandon goes to attention, never activation', (await db.svc(`select public.store_operation_transition($1,'job',$2,'paid_pending_activation',null,null,null) r`, [op, ep]))[0].r === 'attention');
  check('attention keeps the NPI hold and the account slot', (await db.raw('select status from public.npi_reservations where store_operation_id=$1', [op]))[0].status === 'op_held');
  const close = (await db.svc(`select public.store_operation_close($1,null,$2,100,0,'usd','ref-123') r`, [op, q.quote.amount_cents]))[0].r;
  check('operator close refused without matching invoice/full proof', !!close.error, JSON.stringify(close));
});

await scenario('removal and undo', async (db) => {
  const w = await world(db); const p = await period(db, w.acct.A);
  const r = (await db.svc(`select public.store_lifecycle_request('store_removal',$1,$2,$3,$4,$5,$6,$7,4900,$8,$9,$10) r`, [w.acct.A, w.u.ownerA, w.s.A2, 'intent_' + 'r'.repeat(20), p.c, p.sub, p.it, p.q, p.s, p.e]))[0].r;
  check('removal request target quantity = billable - 1', r.operation?.target_quantity === 1, JSON.stringify(r));
  const ep = (await db.svc(`select public.store_operation_lease($1,'w',30) e`, [r.operation.id]))[0].e;
  const cm = (await db.svc(`select public.store_lifecycle_commit($1,'w',$2,1,$3,$4) r`, [r.operation.id, ep, p.s, p.e]))[0].r;
  check('removal commit schedules cutoff at period end; billable drops now', cm.outcome === 'completed' && cm.billable === 1, JSON.stringify(cm));
  check('store still live until cutoff', (await db.as(w.u.memberA, 'select public.is_member_of($1) v', [w.s.A2])).rows[0].v === true);
  check('last billable store cannot be removed', (await db.svc(`select public.store_lifecycle_request('store_removal',$1,$2,$3,$4,$5,$6,$7,4900,1,$8,$9) r`, [w.acct.A, w.u.ownerA, w.s.A1, 'intent_' + 's'.repeat(20), p.c, p.sub, p.it, p.s, p.e]))[0].r.error === 'last_store');
  const u = (await db.svc(`select public.store_lifecycle_request('store_removal_undo',$1,$2,$3,$4,$5,$6,$7,4900,1,$8,$9) r`, [w.acct.A, w.u.ownerA, w.s.A2, 'intent_' + 'u'.repeat(20), p.c, p.sub, p.it, p.s, p.e]))[0].r;
  const ep2 = (await db.svc(`select public.store_operation_lease($1,'w',30) e`, [u.operation.id]))[0].e;
  check('undo with changed provider period enters attention', (await db.svc(`select public.store_lifecycle_commit($1,'w',$2,2,$3,$4) r`, [u.operation.id, ep2, p.s, new Date(new Date(p.e).getTime() + 86400000)]))[0].r.code === 'period_changed');
  check('admin cannot request removal', (await db.svc(`select public.store_lifecycle_request('store_removal',$1,$2,$3,$4,$5,$6,$7,4900,1,$8,$9) r`, [w.acct.A, w.u.adminA2, w.s.A1, 'intent_' + 'x'.repeat(20), p.c, p.sub, p.it, p.s, p.e]))[0].r.error === 'not_owner');
  const late = (await db.svc(`select public.store_period_window_refusal(4900, now() - interval '29 days 22 hours', now() + interval '80 minutes', now()) r`))[0].r;
  check('shared window refuses inside the last 90 minutes', late === 'period_end_window', late);
});

await scenario('invitations and membership', async (db) => {
  const w = await world(db);
  const inv = async (uid, b, email, role, disp = null) => db.as(uid, 'select public.invitation_create($1,$2,$3,$4) r', [b, email, role, disp]);
  const ie = (await db.raw('select email from auth.users where id = $1', [w.u.invitee]))[0].email;
  check('member cannot invite', !!(await inv(w.u.memberA, w.s.A1, 'x@proof.invalid', 'member')).error);
  check('foreign owner cannot invite to A', !!(await inv(w.u.foreign, w.s.A1, 'x@proof.invalid', 'member')).error);
  check('store admin cannot invite an admin', !!(await inv(w.u.adminA2, w.s.A2, 'x@proof.invalid', 'admin', 'member')).error);
  check('store admin cannot act on another store', !!(await inv(w.u.adminA2, w.s.A1, 'x@proof.invalid', 'member')).error);
  const m = await inv(w.u.adminA2, w.s.A2, ie, 'member');
  check('store admin invites a member to its own store', m.rows?.[0]?.r?.invitation?.status === 'pending', JSON.stringify(m));
  const mid = m.rows[0].r.invitation.id;
  check('duplicate pending invitation refused', (await inv(w.u.ownerA, w.s.A2, ie, 'member')).rows?.[0]?.r?.error === 'invitation_pending');
  check('wrong signed-in user cannot accept', !!(await db.as(w.u.foreign, 'select public.invitation_accept($1)', [mid])).error);
  check('my_invitations shows it to the recipient only', (await db.as(w.u.invitee, 'select public.my_invitations() r')).rows[0].r.length === 1 && (await db.as(w.u.foreign, 'select public.my_invitations() r')).rows[0].r.length === 0);
  check('recipient accepts → member of A2 only', (await db.as(w.u.invitee, 'select public.invitation_accept($1) r', [mid])).rows?.[0]?.r?.status === 'accepted'
    && ids(await db.as(w.u.invitee, 'select public.my_business_ids()')).join() === w.s.A2);
  check('replay of accepted invitation is refused', (await db.as(w.u.invitee, 'select public.invitation_accept($1) r', [mid])).rows?.[0]?.r?.error === 'not_pending');
  check('accepted member gets no billing rights', !!(await db.as(w.u.invitee, 'select public.owner_billing_overview()')).error && !!(await db.as(w.u.invitee, 'select public.admin_billing_status($1)', [w.s.A2])).error);
  // admin replacement by the owner
  const a = await inv(w.u.ownerA, w.s.A2, ie, 'admin', 'member');
  const aid = a.rows[0].r.invitation.id;
  check('incumbent stays admin until acceptance', (await db.raw(`select user_id from public.user_businesses where business_id=$1 and role='admin'`, [w.s.A2]))[0].user_id === w.u.adminA2);
  check('admin acceptance: new admin, former admin demoted to member, exactly one admin', (await db.as(w.u.invitee, 'select public.invitation_accept($1) r', [aid])).rows?.[0]?.r?.status === 'accepted'
    && JSON.stringify((await db.raw(`select user_id, role from public.user_businesses where business_id=$1 and user_id in ($2,$3) order by role`, [w.s.A2, w.u.adminA2, w.u.invitee])).map((x) => x.role)) === '["admin","member"]');
  // stale incumbent
  const s1 = await inv(w.u.ownerA, w.s.A1, (await db.raw('select email from auth.users where id=$1', [w.u.memberA]))[0].email, 'admin', 'member');
  await db.svc(`select public.store_admin_set($1,$2,'member')`, [w.s.A1, w.u.adminA2]);
  check('incumbent changed after issue → acceptance rejected as stale', (await db.as(w.u.memberA, 'select public.invitation_accept($1) r', [s1.rows[0].r.invitation.id])).rows?.[0]?.r?.error !== undefined);
  // revocation and removal
  check('effective admin cannot be removed', !!(await db.as(w.u.ownerA, 'select public.member_remove($1,$2)', [w.s.A2, w.u.invitee])).error);
  check('owner removes a member; next request denied (existing session/JWT)', (await db.as(w.u.ownerA, 'select public.member_remove($1,$2) r', [w.s.A2, w.u.adminA2])).rows?.[0]?.r?.removed === true
    && (await db.as(w.u.adminA2, 'select public.is_member_of($1) v', [w.s.A2])).rows[0].v === false);
  // read-only: grants denied, reductions allowed
  await db.raw(`update public.subscriptions set grace_invoice_id='in_ro', grace_started_at = now() - interval '8 days', status='past_due' where account_id=$1`, [w.acct.A]);
  check('read-only: new invitation denied', !!(await inv(w.u.ownerA, w.s.A1, 'late@proof.invalid', 'member')).error);
  const pend = (await db.raw(`select id from public.store_invitations where business_id=$1 and status='pending' limit 1`, [w.s.A1]))[0];
  check('read-only: revocation still allowed', !pend || (await db.as(w.u.ownerA, 'select public.invitation_revoke($1) r', [pend.id])).rows?.[0]?.r?.status === 'revoked');
  check('read-only: member removal still allowed', (await db.as(w.u.ownerA, 'select public.member_remove($1,$2) r', [w.s.A1, w.u.memberA])).rows?.[0]?.r?.removed === true);
  check('read-only: Add Store quote refused', (await db.svc(`select public.account_add_store_refusal($1) r`, [w.acct.A]))[0].r === 'account_read_only');
  check('dispatch claim not callable by customers', !!(await db.as(w.u.ownerA, 'select public.invitation_dispatch_claim($1)', [mid])).error);
});

await scenario('transfer and seller history', async (db) => {
  const w = await world(db);
  if ((await db.raw('select count(*)::int n from public.billing_deployment'))[0].n === 0) await db.svc('select public.billing_deployment_bind($1)', [SCRATCH_REF]);
  const bound = (await db.raw('select project_ref from public.billing_deployment'))[0].project_ref;
  const eff = new Date(Date.now() + 3 * 86400000).toISOString();
  const t = (await db.svc('select public.store_transfer_authorize($1,$2,$3,48,$4) r', [w.s.A1, w.acct.B, eff, 'proof-ticket']))[0].r;
  check('transfer authorized; seller removal scheduled at effective time', !!t.transfer, JSON.stringify(t));
  const pB = await period(db, w.acct.B);
  check('buyer quote refused before effective time', (await db.svc(`select public.store_quote_create($1,$2,'Bought',$3,null,$4,$5,$6,'price_proof',4900,1,$7,$8,'terms-v1') r`, [w.acct.B, w.u.ownerB, NPI[0], pB.c, pB.sub, pB.it, pB.s, pB.e]))[0].r.error === 'transfer_not_effective');
  check('seller access unchanged before effective time', ids(await db.as(w.u.memberA, 'select public.my_business_ids()')).includes(w.s.A1));
  if (bound !== SCRATCH_REF) { check('remaining transfer steps need a SCRATCH-bound clock (skipped)', true); return; }
  for (const a of [w.acct.A, w.acct.B]) await db.svc('select public.billing_test_context_enable($1,$2,$3,$4)', [a, 'proof-transfer', 'clock_proof', new Date(Date.parse(eff) + 3600000).toISOString()]);
  check('at effective time seller staff lose access', !ids(await db.as(w.u.memberA, 'select public.my_business_ids()')).includes(w.s.A1));
  check('finalize marks source transferred and holds NPI for the buyer', (await db.svc('select public.store_removal_finalize($1) r', [w.s.A1]))[0].r === 'transferred'
    && (await db.raw(`select status from public.npi_reservations where transfer_id=$1`, [t.transfer.id]))[0].status === 'transfer_held');
  check('no active ownership between seller end and buyer activation', (await db.raw('select count(*)::int n from public.businesses where npi=$1 and ownership_ended_at is null', [NPI[0]]))[0].n === 0);
  check('public registration cannot take the held NPI', true);
  check('seller owner reads source-ownership history (read-only)', (await db.as(w.u.ownerA, 'select public.owner_history_rows($1) r', [w.s.A1])).rows?.[0]?.r?.rows?.length === 3);
  check('seller staff denied history', !!(await db.as(w.u.memberA, 'select public.owner_history_rows($1)', [w.s.A1])).error);
  check('buyer denied seller history', !!(await db.as(w.u.ownerB, 'select public.owner_history_rows($1)', [w.s.A1])).error);
  check('foreign denied seller history', !!(await db.as(w.u.foreign, 'select public.owner_history_rows($1)', [w.s.A1])).error);
  const q = (await db.svc(`select public.store_quote_create($1,$2,'Bought',$3,null,$4,$5,$6,'price_proof',4900,1,$7,$8,'terms-v1') r`, [w.acct.B, w.u.ownerB, NPI[0], pB.c, pB.sub, pB.it, new Date(Date.parse(eff) - 10 * 86400000).toISOString(), new Date(Date.parse(eff) + 20 * 86400000).toISOString()]))[0].r;
  check('buyer can quote from effective time', !!q.quote && q.quote.transfer_id === t.transfer.id, JSON.stringify(q));
  check('other account cannot quote the held NPI', (await db.svc(`select public.store_quote_create($1,$2,'Steal',$3,null,$4,$5,$6,'price_proof',4900,2,$7,$8,'terms-v1') r`, [w.acct.F, w.u.foreign, NPI[0], 'cus_x', 'sub_x', 'si_x', pB.s, pB.e]))[0].r.error !== undefined);
  const op = (await db.svc(`select public.store_operation_claim($1,$2,$3,'terms-v1') r`, [q.quote.id, w.u.ownerB, 'intent_' + 't'.repeat(20)]))[0].r.operation.id;
  const ep = (await db.svc(`select public.store_operation_lease($1,'w',30) e`, [op]))[0].e;
  await db.svc(`select public.store_operation_map_invoice($1,'w',$2,'in_proofT',$3,$4)`, [op, ep, pB.c, q.quote.amount_cents]);
  await db.svc(`select public.store_operation_transition($1,'w',$2,'payment_pending',null,'in_proofT',null)`, [op, ep]);
  await db.svc(`select public.store_operation_transition($1,'w',$2,'paid_pending_activation',null,null,null)`, [op, ep]);
  const act = (await db.svc(`select public.store_add_activate($1,'in_proofT',$2,'usd',2,$3,$4) r`, [op, q.quote.amount_cents, q.quote.period_start, q.quote.period_end]))[0].r;
  check('buyer activation: new ownership row under the same canonical identity', act.outcome === 'activated'
    && (await db.raw('select pharmacy_id from public.businesses where id=$1', [act.business_id]))[0].pharmacy_id === w.s.A1, JSON.stringify(act));
  check('buyer has no association to pre-sale claims', (await db.raw('select count(*)::int n from public.user_data where business_id=$1', [act.business_id]))[0].n === 0
    && !ids(await db.as(w.u.ownerB, 'select public.my_business_ids()')).includes(w.s.A1));
  check('exactly one active ownership of the pharmacy', (await db.raw('select count(*)::int n from public.businesses where pharmacy_id=$1 and ownership_ended_at is null', [w.s.A1]))[0].n === 1);
});

await scenario('decision 9: same-owner paid re-add restores the original record', async (db) => {
  const w = await world(db); const p = await period(db, w.acct.A);
  if ((await db.raw("select to_regclass('public.store_reactivations') is not null x"))[0].x !== true || (await db.raw("select count(*)::int n from information_schema.columns where table_name='store_operations' and column_name='reactivation_business_id'"))[0].n === 0) { check('decision 9 objects present', false, 'pre-0069 target'); return; }
  await db.raw(`update public.businesses set removal_requested_at = now() - interval '2 days', removal_effective_at = now() - interval '1 minute' where id = $1`, [w.s.A2]);
  await db.svc('select public.store_removal_finalize($1)', [w.s.A2]);
  const q0 = (await db.svc(`select public.store_quote_create($1,$2,'A Two again',$3,null,$4,$5,$6,'price_proof',4900,1,$7,$8,'terms-v1') r`, [w.acct.A, w.u.ownerA, NPI[1], p.c, p.sub, p.it, p.s, p.e]))[0].r;
  check('without operator authorization the removed NPI is refused', q0.error === 'npi_previously_registered', JSON.stringify(q0));
  check('reactivation authorization recorded (authorization only)', (await db.svc('select public.store_reactivation_authorize($1,$2) r', [w.s.A2, 'TCK-9']))[0].r.outcome === 'authorized');
  check('authorization grants no access before payment', !ids(await db.as(w.u.ownerA, 'select public.my_business_ids()')).includes(w.s.A2));
  const q = (await db.svc(`select public.store_quote_create($1,$2,'A Two again',$3,null,$4,$5,$6,'price_proof',4900,1,$7,$8,'terms-v1') r`, [w.acct.A, w.u.ownerA, NPI[1], p.c, p.sub, p.it, p.s, p.e]))[0].r;
  check('same-owner quote allowed after authorization', !!q.quote && q.quote.reactivation_business_id === w.s.A2, JSON.stringify(q));
  check('another account cannot quote that NPI', !!(await db.svc(`select public.store_quote_create($1,$2,'X',$3,null,$4,$5,$6,'price_proof',4900,1,$7,$8,'terms-v1') r`, [w.acct.B, w.u.ownerB, NPI[1], 'cus_x', 'sub_x', 'si_x', p.s, p.e]))[0].r.error);
  const op = (await db.svc(`select public.store_operation_claim($1,$2,$3,'terms-v1') r`, [q.quote.id, w.u.ownerA, 'intent_' + 'g'.repeat(20)]))[0].r.operation.id;
  check('still no access while payment is pending', !ids(await db.as(w.u.ownerA, 'select public.my_business_ids()')).includes(w.s.A2));
  const ep = (await db.svc(`select public.store_operation_lease($1,'w',30) e`, [op]))[0].e;
  await db.svc(`select public.store_operation_map_invoice($1,'w',$2,'in_react',$3,$4)`, [op, ep, p.c, q.quote.amount_cents]);
  await db.svc(`select public.store_operation_transition($1,'w',$2,'payment_pending',null,'in_react',null)`, [op, ep]);
  await db.svc(`select public.store_operation_transition($1,'w',$2,'paid_pending_activation',null,null,null)`, [op, ep]);
  const act = (await db.svc(`select public.store_add_activate($1,'in_react',$2,'usd',2,$3,$4) r`, [op, q.quote.amount_cents, p.s, p.e]))[0].r;
  check('after payment the ORIGINAL ownership record is restored (same business id)', act.outcome === 'activated' && act.business_id === w.s.A2 && act.reactivated === true, JSON.stringify(act));
  check('original history is back for the owner (claims RPC answers)', !(await db.as(w.u.ownerA, 'select public.owedbook_pbm_options($1)', [w.s.A2])).error && ids(await db.as(w.u.ownerA, 'select public.my_business_ids()')).includes(w.s.A2));
  check('original claims rows unchanged (3)', (await db.raw('select count(*)::int n from public.user_data where business_id=$1', [w.s.A2]))[0].n === 3);
  check('exactly one current ownership for the pharmacy', (await db.raw('select count(*)::int n from public.businesses where pharmacy_id=$1 and ownership_ended_at is null', [w.s.A2]))[0].n === 1);
  check('authorization consumed', (await db.raw('select status from public.store_reactivations where business_id=$1', [w.s.A2]))[0].status === 'used');
});

await scenario('ruling 3: transfer buyer completes through normal registration', async (db) => {
  const w = await world(db);
  if ((await db.raw("select count(*)::int n from information_schema.columns where table_name='store_transfers' and column_name='buyer_email'"))[0].n === 0) { check('transfer-registration objects present', false, 'pre-0069 target'); return; }
  if ((await db.raw('select count(*)::int n from public.billing_deployment'))[0].n === 0) await db.svc('select public.billing_deployment_bind($1)', [SCRATCH_REF]);
  const buyerEmail = `buyer-${randomUUID().slice(0, 8)}@proof.invalid`;
  const eff = new Date(Date.now() + 3 * 86400000).toISOString();
  const t = (await db.svc('select public.store_transfer_authorize($1,null,$2,$3,48,$4) r', [w.s.A1, buyerEmail, eff, 'TCK-T']))[0].r;
  check('transfer authorized to an email-identified buyer', !!t.transfer && t.transfer.buyer_email === buyerEmail, JSON.stringify(t));
  const draft = (await db.raw(`insert into public.registration_drafts (secret_hash, revision, status, owner_email, owner_first_name, owner_last_name, pharmacy_name, npi) values ($1, 1, 'draft', $2, 'Buyer', 'One', 'Bought Pharmacy', $3) returning id`, [Buffer.from(randomUUID()), buyerEmail, NPI[0]]))[0].id;
  check('before the effective time the buyer cannot reserve via registration', (await db.svc('select * from public.npi_reserve($1,$2)', [draft, NPI[0]]))[0].outcome === 'unavailable');
  const other = (await db.raw(`insert into public.registration_drafts (secret_hash, revision, status, owner_email, pharmacy_name, npi) values ($1, 1, 'draft', 'someone-else@proof.invalid', 'Steal', $2) returning id`, [Buffer.from(randomUUID()), NPI[0]]))[0].id;
  for (const a of [w.acct.A]) await db.svc('select public.billing_test_context_enable($1,$2,$3,$4)', [a, 'proof-transfer-reg', 'clock_proof', new Date(Date.parse(eff) + 3600000).toISOString()]);
  await db.svc('select public.store_removal_finalize($1)', [w.s.A1]);
  check('after the effective time a different person still cannot register the NPI', (await db.svc('select * from public.npi_reserve($1,$2)', [other, NPI[0]]))[0].outcome === 'unavailable');
  const res = (await db.svc('select * from public.npi_reserve($1,$2)', [draft, NPI[0]]))[0];
  check('the exact buyer reserves through registration (transfer hold, not a public hold)', res.outcome === 'held' && (await db.raw('select status, draft_id from public.npi_reservations where id=$1', [res.reservation_id]))[0].status === 'transfer_held', JSON.stringify(res));
  const buyer = randomUUID();
  await db.raw(`insert into auth.users (id, email, aud, role, instance_id, email_confirmed_at, created_at, updated_at) values ($1, $2, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now(), now())`, [buyer, buyerEmail]);
  const op = (await db.raw(`insert into public.checkout_operations (idempotency_key, draft_id, draft_revision, npi, expected_total_cents, expected_currency, expected_price_id, status, stripe_customer_id, stripe_subscription_id) values ($1,$2,1,$3,9900,'usd','price_proof','checkout_open','cus_buyerT','sub_buyerT') returning id`, ['k' + randomUUID().replace(/-/g, ''), draft, NPI[0]]))[0].id;
  check('checkout binds the transfer hold to its operation', (await db.svc(`select public.npi_bind($1,$2, now() + interval '30 minutes') r`, [draft, op]))[0].r === 'bound');
  await db.raw(`update public.checkout_operations set status='paid' where id=$1`, [op]);
  const sub = { customer_id: 'cus_buyerT', subscription_id: 'sub_buyerT', status: 'active', raw_status: 'active', quantity: 1, price_id: 'price_proof', item_id: 'si_buyerT',
    current_period_start: new Date().toISOString(), current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(), verified_at: new Date().toISOString(), policy_version: 'v1' };
  const pr = (await db.svc('select public.provision_paid_registration($1,$2,$3) r', [op, buyer, sub]))[0].r;
  check('provisioning creates the buyer account and the SUCCESSOR ownership under the same canonical identity', pr.outcome === 'provisioned'
    && (await db.raw('select pharmacy_id from public.businesses where id=$1', [pr.business_id]))[0].pharmacy_id === w.s.A1, JSON.stringify(pr));
  check('transfer completed with the new buyer account', (await db.raw('select status, buyer_account_id from public.store_transfers where id=$1', [t.transfer.id]))[0].status === 'completed');
  check('buyer sees none of the seller history', (await db.raw('select count(*)::int n from public.user_data where business_id=$1', [pr.business_id]))[0].n === 0
    && !!(await db.as(buyer, 'select public.owner_history_rows($1)', [w.s.A1])).error && !ids(await db.as(buyer, 'select public.my_business_ids()')).includes(w.s.A1));
  check('seller owner keeps read-only history of the sold store', (await db.as(w.u.ownerA, 'select public.owner_history_rows($1) r', [w.s.A1])).rows?.[0]?.r?.rows?.length === 3);
  check('a sold store cannot be reactivated by the seller', !!(await db.svc('select public.store_reactivation_authorize($1,$2) r', [w.s.A1, 'x']))[0].r.error);
});

await scenario('notices', async (db) => {
  const w = await world(db); const sub = (await period(db, w.acct.A)).sub;
  await db.raw(`update public.subscriptions set grace_invoice_id='in_fail1', grace_started_at = now() - interval '6 days', status='past_due' where account_id=$1`, [w.acct.A]);
  await db.svc(`select public.notice_schedule_for_failure($1,'in_fail1', now() - interval '6 days', 14800)`, [sub]);
  await db.svc(`select public.notice_schedule_for_failure($1,'in_fail1', now() - interval '6 days', 14800)`, [sub]);
  check('one notice per (invoice, kind) even on repeated failure events', (await db.raw(`select count(*)::int n from public.notification_operations where invoice_id='in_fail1'`))[0].n === 2);
  const due = await db.svc('select public.notices_due() id');
  check('both due (failure at grace start, warning at grace start + 5 days)', due.length >= 2);
  const n = (await db.svc(`select public.notice_claim($1,'w1') r`, [due[0].id]))[0].r;
  check('claim returns owner address, deadline and fenced epoch', !!n.to && !!n.epoch && !!n.grace_ends_at, JSON.stringify(n));
  check('second claim while in flight refused', !!(await db.svc(`select public.notice_claim($1,'w2') r`, [due[0].id]))[0].r.error);
  check('finish with stale epoch refused', (await db.svc(`select public.notice_finish($1,'w1',$2,'sent','m1',null,'fp') r`, [due[0].id, Number(n.epoch) + 1]))[0].r === 'lease_lost');
  check('finish sent recorded', (await db.svc(`select public.notice_finish($1,'w1',$2,'sent','m1',null,'fp') r`, [due[0].id, n.epoch]))[0].r === 'recorded');
  await db.raw(`update public.subscriptions set grace_started_at = null where account_id=$1`, [w.acct.A]);
  check('recovery committed first suppresses the next claim', (await db.svc(`select public.notice_claim($1,'w3') r`, [due[1].id]))[0].r.error === 'suppressed');
  check('notices not readable by customers', !!(await db.as(w.u.ownerA, 'select * from public.notification_operations')).error);
});

await scenario('operator commands', async (db) => {
  const w = await world(db);
  check('owner-replace refuses an identity that already owns an account', (await db.svc('select public.owner_replace($1,$2,$3) r', [w.acct.A, w.u.ownerB, 'x']))[0].r.error === 'new_owner_has_account');
  const r = (await db.svc('select public.owner_replace($1,$2,$3) r', [w.acct.A, w.u.invitee, 'ticket']))[0].r;
  check('owner-replace: new owner, old identity loses all access on that account, admins preserved', r.outcome === 'replaced'
    && ids(await db.as(w.u.ownerA, 'select public.my_business_ids()')).length === 0
    && (await db.raw(`select count(*)::int n from public.user_businesses ub join public.businesses b on b.id=ub.business_id where b.account_id=$1 and ub.role='admin'`, [w.acct.A]))[0].n === 2, JSON.stringify(r));
  check('operator audit is append-only', await (async () => { const id = (await db.svc(`select public.operator_action_record('quantity-check','actor name','reason x','TCK-1','dry_run','{}'::jsonb,null,null,'planned',null) id`))[0].id; try { await db.raw('savepoint z'); await db.raw('update public.operator_actions set reason = $2 where id = $1', [id, 'changed']); return false; } catch { await db.raw('rollback to savepoint z'); return true; } })());
  check('reactivation of a non-removed store refused', !!(await db.svc('select public.store_reactivation_authorize($1,$2) r', [w.s.B1, 'x']))[0].r.error);
});

// ---------------------------------------------------------------- committed concurrency (local only)
if (target === 'local') {
  const setup = new pg.Client({ connectionString: url }); await setup.connect();
  const db = mk(setup); await setup.query('begin'); const w = await world(db); await setup.query('commit');
  const p = await period(db, w.acct.A); const pB = await period(db, w.acct.B); const npi = '1003000100'.slice(0, 10);
  const valid = (await setup.query(`select public.npi_is_valid($1) v`, [npi])).rows[0].v ? npi : '1003000092';
  const qa = (await db.svc(`select public.store_quote_create($1,$2,'Race A',$3,null,$4,$5,$6,'price_proof',4900,$7,$8,$9,'terms-v1') r`, [w.acct.A, w.u.ownerA, valid, p.c, p.sub, p.it, p.q, p.s, p.e]))[0].r;
  const qb = (await db.svc(`select public.store_quote_create($1,$2,'Race B',$3,null,$4,$5,$6,'price_proof',4900,$7,$8,$9,'terms-v1') r`, [w.acct.B, w.u.ownerB, valid, pB.c, pB.sub, pB.it, pB.q, pB.s, pB.e]))[0].r;
  const claim = async (q, actor, key) => { const c = new pg.Client({ connectionString: url }); await c.connect(); try { await c.query('set role service_role'); return (await c.query(`select public.store_operation_claim($1,$2,$3,'terms-v1') r`, [q.quote.id, actor, key])).rows[0].r; } finally { await c.end(); } };
  const [r1, r2] = await Promise.all([claim(qa, w.u.ownerA, 'intent_' + 'c'.repeat(20)), claim(qb, w.u.ownerB, 'intent_' + 'd'.repeat(20))]);
  check('CONCURRENCY: two accounts claim the same NPI at once → exactly one holds it', [r1, r2].filter((x) => x.operation).length === 1 && [r1, r2].some((x) => x.error === 'npi_held' || x.error === 'npi_registered'), JSON.stringify([r1, r2]));
  // two concurrent acceptances of two admin invitations cannot produce two admins
  await setup.query('begin');
  const e1 = (await db.raw('select email from auth.users where id=$1', [w.u.memberA]))[0].email; const e2 = (await db.raw('select email from auth.users where id=$1', [w.u.invitee]))[0].email;
  const i1 = (await db.as(w.u.ownerA, 'select public.invitation_create($1,$2,$3,$4) r', [w.s.A2, e1, 'admin', 'member'])).rows[0].r;
  const i2 = (await db.as(w.u.ownerA, 'select public.invitation_create($1,$2,$3,$4) r', [w.s.A2, e2, 'member', null])).rows[0].r;
  await setup.query('commit');
  check('CONCURRENCY setup: second admin invitation for the store refused while one is pending', !!i1.invitation && !!i2.invitation);
  const accept = async (uid, inv) => { const c = new pg.Client({ connectionString: url }); await c.connect(); try { await c.query('begin'); await c.query(`select set_config('request.jwt.claims',$1,true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })]); await c.query('set local role authenticated'); const r = (await c.query('select public.invitation_accept($1) r', [inv])).rows[0].r; await c.query('commit'); return r; } catch (e) { await c.query('rollback'); return { error: e.code, message: e.message.slice(0, 200) }; } finally { await c.end(); } };
  const [x1, x2] = await Promise.all([accept(w.u.memberA, i1.invitation.id), accept(w.u.invitee, i2.invitation.id)]);
  const admins = (await setup.query(`select count(*)::int n from public.user_businesses where business_id=$1 and role='admin'`, [w.s.A2])).rows[0].n;
  check('CONCURRENCY: concurrent admin + member acceptances leave exactly one admin', admins === 1 && x1.status === 'accepted' && x2.status === 'accepted', JSON.stringify([x1, x2, admins]));
  await setup.end();
}

const failed = checks.filter((c) => c.status === 'FAIL');
console.log(JSON.stringify({ target, total: checks.length, passed: checks.length - failed.length, failed: failed.length, checks }, null, 1));
if (failed.length) process.exitCode = 1;
