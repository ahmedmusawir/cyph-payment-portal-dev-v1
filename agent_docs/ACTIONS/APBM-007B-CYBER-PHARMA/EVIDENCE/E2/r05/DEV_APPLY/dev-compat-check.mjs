#!/usr/bin/env node
// APBM-007B — post-apply 007A compatibility checks on DEV, as EXISTING members/owners, with no sessions, users or effects.
// cwd: OwedBook root. Same DEV environment as scripts/apbm007b/dev-apply-guard.mjs (loadEnv enforces the DEV identity).
//
//   node scripts/apbm007b/dev-compat-check.mjs --help
//   node scripts/apbm007b/dev-compat-check.mjs [--mode read-only|rolled-back]
//
// Each call runs with that person's JWT claims as role `authenticated`. 007A's audited read functions append an audit row
// per successful call, so they cannot run in a READ ONLY transaction; `--mode rolled-back` runs everything in ONE ordinary
// transaction that is ALWAYS rolled back (no row persists). Output: counts and error codes only — no ids, names or data.
import { readFileSync, writeFileSync } from 'node:fs';
import pg from 'pg';
import { loadEnv, evidencePath } from '../rls-harness/lib/env.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const mode = args.includes('--mode') ? args[args.indexOf('--mode') + 1] : 'read-only';
if (!['read-only', 'rolled-back'].includes(mode)) throw new Error('FAIL-CLOSED: --mode read-only|rolled-back');
const env = loadEnv(); if (env.target !== 'dev' || env.projectRef !== 'yrsuwikjnbmvpznrgydb') throw new Error('FAIL-CLOSED: DEV target required');
const c = new pg.Client({ connectionString: env.DB_URL, connectionTimeoutMillis: 10000 });
const tally = (o, k) => { o[k] = (o[k] ?? 0) + 1; };
const res = { mode, at: new Date().toISOString(), members: 0, scope_equal_expected: 0, scope_diffs: [], owedbook_rows: {}, owedbook_summary: {}, owner_billing_overview: {}, access_states: {} };
await c.connect();
try {
  await c.query(mode === 'read-only' ? 'BEGIN READ ONLY' : 'BEGIN');
  await c.query("SET LOCAL statement_timeout='30s'");
  res.transaction_read_only = (await c.query('show transaction_read_only')).rows[0].transaction_read_only;
  const as = async (uid, sql, params) => {
    await c.query('savepoint s');
    try {
      await c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: uid, role: 'authenticated' })]);
      await c.query('set local role authenticated');
      const rows = (await c.query(sql, params)).rows; await c.query('rollback to savepoint s'); return { rows };
    } catch (e) { await c.query('rollback to savepoint s'); return { error: e.code }; }
  };
  const members = (await c.query('select user_id::text u, array_agg(business_id::text order by business_id) b, array_agg(role order by business_id) r from public.user_businesses group by 1')).rows;
  for (const m of members) {
    res.members++;
    // Expected scope (007A and 007B alike): live memberships UNION live stores of accounts this person owns.
    const live = (await c.query(`select coalesce(array_agg(id::text order by id), $3) a from (select b.id from public.businesses b where (b.id = any($1::uuid[])
      or b.account_id in (select a.id from public.accounts a where a.owner_user_id = $2::uuid)) and public.store_is_live(b.id)) x`, [m.b, m.u, '{}'])).rows[0].a;
    const ids = await as(m.u, 'select coalesce(array_agg(id::text order by id), $1) a from public.my_business_ids() id', ['{}']);
    const got = ids.rows?.[0]?.a ?? [];
    if (JSON.stringify(got) === JSON.stringify(live)) res.scope_equal_expected++;
    else {
      const facts = (await c.query('select b.status, b.ownership_ended_at is not null ended, public.store_is_live(b.id) live, b.account_id is not null has_account from public.businesses b where b.id = any($1::uuid[]) order by b.id', [m.b])).rows;
      res.scope_diffs.push({ memberships: m.b.length, roles: m.r, my_business_ids: got.length, expected: live.length, stores: facts, error: ids.error ?? null });
    }
    for (const b of got) {
      const r = await as(m.u, "select public.owedbook_rows($1, 'summary') j", [b]); tally(res.owedbook_rows, r.error ?? 'ok');
      const s = await as(m.u, 'select public.owedbook_summary($1) j', [b]); tally(res.owedbook_summary, s.error ?? 'ok');
    }
  }
  for (const o of (await c.query('select id::text a, owner_user_id::text u from public.accounts')).rows) {
    const r = await as(o.u, 'select public.owner_billing_overview() r'); tally(res.owner_billing_overview, r.error ?? (r.rows[0].r?.error ? `refused:${r.rows[0].r.error}` : 'ok'));
    tally(res.access_states, (await c.query('select public.account_access_state($1) s', [o.a])).rows[0].s.state);
  }
} finally { await c.query('ROLLBACK').catch(() => {}); await c.end(); }
writeFileSync(evidencePath(`compat-${mode}.json`), JSON.stringify(res, null, 2) + '\n');
console.log(JSON.stringify(res, null, 1));
