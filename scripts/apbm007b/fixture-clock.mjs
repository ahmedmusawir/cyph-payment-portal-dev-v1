#!/usr/bin/env node
// APBM-007B — private SCRATCH-only time-context setter (CONTRACTS/CLOCK_AND_NOTICES.md fallback driver). cwd: Portal root.
//
//   node scripts/apbm007b/fixture-clock.mjs --help
//   node scripts/apbm007b/fixture-clock.mjs bind                                   # bind SCRATCH deployment identity (once, immutable)
//   node scripts/apbm007b/fixture-clock.mjs status [--account <uuid>]
//   node scripts/apbm007b/fixture-clock.mjs enable  --account <uuid> --run <label> --clock <clock_id>   # frozen time read from Stripe
//   node scripts/apbm007b/fixture-clock.mjs sync    --account <uuid> --clock <clock_id>
//   node scripts/apbm007b/fixture-clock.mjs disable --account <uuid>
//
// Target: ONLY the SCRATCH project (ihgcsrypblqkwommrkgj), verified by API and SQL reference from OwedBook .env.local;
// any other project fails closed before connecting. Requires ALLOW_TEST_CLOCK=true in THIS process environment (not in
// any app env file). Frozen time is always the provider clock's authoritative `frozen_time`, never a typed value.
// Application endpoints never call this; it is an operator fixture tool. No credential is printed.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { scratchTarget, OWEDBOOK, SCRATCH_REF } from './lib/env.mjs';

const args = process.argv.slice(2); const cmd = args[0];
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
if (!cmd || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
if (!['bind', 'status', 'enable', 'sync', 'disable'].includes(cmd)) { console.error('FAIL-CLOSED: unknown command'); process.exit(2); }
if (cmd !== 'status' && process.env.ALLOW_TEST_CLOCK !== 'true') { console.error('FAIL-CLOSED: ALLOW_TEST_CLOCK=true must be set for this invocation'); process.exit(2); }
const t = scratchTarget();
if (t.ref !== SCRATCH_REF) { console.error('FAIL-CLOSED: not SCRATCH'); process.exit(2); }
const pg = createRequire(`${OWEDBOOK}/package.json`)('pg');
const uuid = (v, n) => { if (!/^[0-9a-f-]{36}$/.test(v ?? '')) { console.error(`FAIL-CLOSED: --${n} <uuid> required`); process.exit(2); } return v; };
const c = new pg.Client({ connectionString: t.dbUrl, ssl: { rejectUnauthorized: false }, statement_timeout: 30000 });
await c.connect();
try {
  await c.query('set role service_role');
  let out;
  if (cmd === 'bind') out = (await c.query('select public.billing_deployment_bind($1) r', [SCRATCH_REF])).rows[0];
  else if (cmd === 'status') out = { deployment: (await c.query('select project_ref, bound_at from public.billing_deployment')).rows, contexts: (await c.query('select account_id, run_label, stripe_test_clock_id, frozen_at, enabled, disabled_at from public.billing_test_contexts' + (val('--account') ? ' where account_id = $1' : ''), val('--account') ? [val('--account')] : [])).rows };
  else if (cmd === 'disable') out = (await c.query('select public.billing_test_context_disable($1) r', [uuid(val('--account'), 'account')])).rows[0];
  else {
    const clock = val('--clock'); if (!/^clock_[A-Za-z0-9]+$/.test(clock ?? '')) { console.error('FAIL-CLOSED: --clock <clock_id> required'); process.exit(2); }
    const { stripe, read } = await import('./lib/stripe.mjs');
    const frozen = new Date((await read('fixture-clock', 'testClocks.retrieve', () => stripe.testHelpers.testClocks.retrieve(clock))).frozen_time * 1000).toISOString();
    out = cmd === 'enable'
      ? (await c.query('select public.billing_test_context_enable($1,$2,$3,$4) r', [uuid(val('--account'), 'account'), val('--run'), clock, frozen])).rows[0]
      : (await c.query('select public.billing_test_context_sync($1,$2,$3) r', [uuid(val('--account'), 'account'), clock, frozen])).rows[0];
    out.frozen_at = frozen;
  }
  console.log(JSON.stringify({ target: 'SCRATCH', command: cmd, result: out }, null, 1));
} finally { await c.end(); }
