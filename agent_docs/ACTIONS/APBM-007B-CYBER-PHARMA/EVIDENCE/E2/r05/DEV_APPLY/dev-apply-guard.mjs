#!/usr/bin/env node
// APBM-007B — guarded DEV apply companion (Director release "APBM-007B DEV APPLY", 17 Nov 2026). cwd: OwedBook root.
// The migrations themselves are applied ONLY by scripts/apply-forward.mjs; this tool never runs migration SQL.
//
//   node scripts/apbm007b/dev-apply-guard.mjs --help
//   node scripts/apbm007b/dev-apply-guard.mjs preflight --manifest <inventory.json>          # READ ONLY
//   node scripts/apbm007b/dev-apply-guard.mjs bind                                            # ONE write: billing_deployment_bind(DEV ref)
//   node scripts/apbm007b/dev-apply-guard.mjs post --manifest <inventory.json> --before <preflight.json>   # READ ONLY + rolled-back guard probe
//
// Environment (same as the runner): RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
// APBM_EVIDENCE_DIR=<absolute apply lane>; `bind` additionally requires APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb.
// Target identity is enforced by loadEnv (prefix, ref, API and SQL references must all be DEV). Reads run in
// `BEGIN READ ONLY`. The post-apply guard probe calls billing_test_context_enable inside a transaction that is always
// ROLLED BACK and must be refused (42501). Preservation is recorded as counts and SHA-256 digests of sorted ids only —
// no names, addresses or business data. Credentials are never printed.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';
import { loadEnv, evidencePath, repoRoot } from '../rls-harness/lib/env.mjs';

const DEV_REF = 'yrsuwikjnbmvpznrgydb', SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
const args = process.argv.slice(2); const cmd = args[0];
if (!cmd || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const env = loadEnv();
if (env.target !== 'dev' || env.projectRef !== DEV_REF) throw new Error('FAIL-CLOSED: DEV target required');
const sha = (v) => createHash('sha256').update(v).digest('hex');
// Same inventory rule as scripts/apply-forward.mjs (not imported: that module runs its main() on import).
const MIG = join(repoRoot, 'supabase/migrations');
const inventory = () => { const names = readdirSync(MIG).filter((n) => /^\d{4}_.+\.sql$/.test(n)).sort(); names.forEach((n, i) => { if (Number(n.slice(0, 4)) !== i + 1) throw new Error('migration inventory is not contiguous'); }); return names.map((name) => ({ name, sha256: sha(readFileSync(join(MIG, name))) })); };
const out = { command: cmd, projectRef: env.projectRef, at: new Date().toISOString() };
const client = new pg.Client({ connectionString: env.DB_URL, connectionTimeoutMillis: 10000 });

const LINKS = [['user_businesses', 'business_id'], ['user_data', 'business_id'], ['report_files', 'business_id'], ['audit_logs', 'business_id'],
  ['pending_registrations', 'business_id'], ['checkout_operations', 'business_id'], ['businesses', 'account_id'], ['subscriptions', 'account_id'],
  ['billing_customers', 'account_id'], ['notification_operations', 'account_id']];
async function preservation() {
  const p = {};
  const ids = (await client.query('select id::text from public.businesses order by id')).rows.map((r) => r.id);
  p.businesses = { count: ids.length, ids_sha256: sha(ids.join(',')) };
  const acc = (await client.query('select id::text, owner_user_id::text from public.accounts order by id')).rows;
  p.accounts = { count: acc.length, id_owner_sha256: sha(acc.map((r) => `${r.id}:${r.owner_user_id}`).join(',')) };
  for (const [t, col] of LINKS) {
    const r = (await client.query(`select ${col}::text k, count(*)::int n from public.${t} group by 1 order by 1`)).rows;
    p[`${t}.${col}`] = { rows: r.reduce((a, x) => a + x.n, 0), per_key_sha256: sha(r.map((x) => `${x.k}:${x.n}`).join(',')) };
  }
  return p;
}
async function ledger() { return (await client.query("select to_regclass('apbm_migrations.ledger') is not null yes")).rows[0].yes ? (await client.query('select name, sha256 from apbm_migrations.ledger order by name')).rows : null; }
const fn = async (name) => Number((await client.query(`select count(*)::int n from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = $1`, [name])).rows[0].n);

try {
  await client.connect();
  if (cmd === 'preflight' || cmd === 'post') {
    const manifest = JSON.parse(readFileSync(opt('--manifest'), 'utf8')); const files = inventory();
    out.inventory_equals_manifest = JSON.stringify(manifest.files) === JSON.stringify(files);
    out.inventory_count = files.length;
    await client.query('BEGIN READ ONLY'); await client.query("SET LOCAL statement_timeout='30s'");
    out.transaction_read_only = (await client.query('show transaction_read_only')).rows[0].transaction_read_only;
    const led = await ledger();
    out.ledger_count = led?.length ?? null;
    out.ledger_is_unchanged_prefix = !!led && led.every((r, i) => r.name === files[i]?.name && r.sha256 === files[i]?.sha256);
    out.ledger_last = led?.at(-1)?.name ?? null;
    out.preservation = await preservation();
    if (cmd === 'preflight') {
      out.git_branch = execFileSync('git', ['-C', repoRoot, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
      out.git_head = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
      out.ledger_0001_0060_unchanged = out.ledger_count === 60 && out.ledger_is_unchanged_prefix;
      out.ready = out.inventory_equals_manifest && out.inventory_count === 69 && out.git_branch === 'apbm-007b' && out.ledger_0001_0060_unchanged && out.transaction_read_only === 'on';
    } else {
      const before = JSON.parse(readFileSync(opt('--before'), 'utf8'));
      out.ledger_69_equals_manifest = out.ledger_count === 69 && out.ledger_is_unchanged_prefix;
      const dep = (await client.query('select project_ref from public.billing_deployment')).rows;
      out.deployment_identity = dep.map((r) => r.project_ref);
      out.test_project_ref_constant = (await client.query('select public.billing_test_project_ref() r')).rows[0].r === SCRATCH_REF;
      out.enabled_test_contexts = Number((await client.query('select count(*)::int n from public.billing_test_contexts where enabled')).rows[0].n);
      out.billing_now_is_real_time = (await client.query('select abs(extract(epoch from (public.billing_now(gen_random_uuid()) - now()))) < 1 ok')).rows[0].ok;
      // privileges / RLS on every public table; SECURITY DEFINER search_path pinned
      out.tables_without_rls = (await client.query(`select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity order by 1`)).rows.map((r) => r.relname);
      out.new_tables_with_anon_or_authenticated_privilege = (await client.query(`select distinct table_name from information_schema.role_table_grants where table_schema = 'public' and grantee in ('anon','authenticated')
        and table_name in ('pharmacy_identities','store_quotes','store_operations','provider_invoice_operations','provider_call_intents','store_transfers','store_invitations','operator_actions','billing_deployment','billing_test_contexts') order by 1`)).rows.map((r) => r.table_name);
      out.security_definer_without_pinned_search_path = (await client.query(`select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prosecdef and not coalesce(array_to_string(p.proconfig, ',') like '%search_path=%', false) order by 1`)).rows.map((r) => r.proname);
      out.compat_007a_functions_present = Object.fromEntries(await Promise.all(['my_business_ids', 'account_access_state', 'owner_billing_overview', 'provision_paid_registration', 'owedbook_rows', 'owedbook_summary'].map(async (f) => [f, await fn(f)])));
      out.businesses_without_identity = Number((await client.query('select count(*)::int n from public.businesses where pharmacy_id is null')).rows[0].n);
      out.identities = Number((await client.query('select count(*)::int n from public.pharmacy_identities')).rows[0].n);
      out.distinct_business_npis = Number((await client.query('select count(distinct npi)::int n from public.businesses where npi is not null')).rows[0].n);
      const keys = Object.keys(before.preservation);
      out.preservation_equal = Object.fromEntries(keys.map((k) => [k, JSON.stringify(before.preservation[k]) === JSON.stringify(out.preservation[k])]));
      await client.query('ROLLBACK');
      // guard probe: must be refused on DEV; always rolled back
      await client.query('BEGIN');
      try { await client.query("select public.billing_test_context_enable(gen_random_uuid(), 'dev-guard-probe', 'clock_probe', now())"); out.test_context_enable_on_dev = 'ALLOWED (FAIL)'; }
      catch (e) { out.test_context_enable_on_dev = `refused ${e.code}`; }
      finally { await client.query('ROLLBACK'); }
    }
    if (cmd === 'preflight') await client.query('ROLLBACK');
  } else if (cmd === 'bind') {
    if (process.env.APBM_DIRECTOR_APPLY !== DEV_REF) throw new Error('FAIL-CLOSED: explicit Director apply required');
    out.result = (await client.query('select public.billing_deployment_bind($1) r', [DEV_REF])).rows[0].r;
    out.deployment_identity = (await client.query('select project_ref from public.billing_deployment')).rows.map((r) => r.project_ref);
  } else throw new Error('FAIL-CLOSED: unknown command');
} finally { await client.end(); }
writeFileSync(evidencePath(`guard-${cmd}.json`), JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 1));
