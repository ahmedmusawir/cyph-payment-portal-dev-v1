#!/usr/bin/env node
// APBM-007B — environment preflight: NAMES and TARGET REFERENCES only, never values. cwd: any.
//
//   node scripts/apbm007b/env-preflight.mjs --help
//   node scripts/apbm007b/env-preflight.mjs              # both repos' .env.local: required/optional 007B names present?
//   node scripts/apbm007b/env-preflight.mjs --self-test   # parser poison/clean controls in /tmp; no repo file read
//
// Reports which required names are present, the Supabase project reference each URL points at (a public identifier), and
// whether the Stripe key is a TEST key — never a value, hash or length. Exit 1 if a REQUIRED name is missing.
import { PORTAL, OWEDBOOK, presence, apiRef, sqlRef, loadNamed, SCRATCH_REF, DEV_REF } from './lib/env.mjs';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const PP_REQUIRED = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY', 'NEXT_PUBLIC_SITE_URL', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_EXPECTED_ACCOUNT', 'STRIPE_PRICE_STORES', 'STRIPE_PORTAL_CONFIGURATION'];
const PP_007B = ['RESEND_API_KEY', 'BILLING_EMAIL_FROM', 'MAIL_ALLOWLIST', 'ALLOW_TEST_CLOCK'];
const OB_REQUIRED = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY', 'NEXT_PUBLIC_SITE_URL', 'APBM_SCRATCH_DB_URL', 'APBM_SCRATCH_SUPABASE_URL', 'APBM_SCRATCH_PUBLISHABLE_KEY', 'APBM_SCRATCH_SECRET_KEY', 'APBM_DEV_DB_URL', 'APBM_DEV_SUPABASE_URL'];
const OB_007B = ['MAIL_ALLOWLIST'];
// Engineering cast and inbox access live in private 0600 files under ~/.apbm007b (see scripts/apbm007b/inbox.mjs --check).
const CAST = [];
if (args.includes('--self-test')) {
  const d = `/tmp/apbm007b-envpf-${process.pid}`; mkdirSync(d, { recursive: true });
  writeFileSync(`${d}/.env.local`, 'A=1\nexport B="two"\n# C=3\nD=\nE=x # comment\n');
  const p = presence(d, ['A', 'B', 'C', 'D', 'E']); rmSync(d, { recursive: true, force: true });
  const ok = p.A && p.B && !p.C && !p.D && p.E;
  console.log(JSON.stringify({ self_test: ok ? 'PASS' : 'FAIL', presence: p })); process.exit(ok ? 0 : 1);
}
const refOf = (repo, name, fn) => { try { const v = loadNamed(repo, { optional: [name] })[name]; const r = v ? fn(v) : undefined; return r === SCRATCH_REF ? 'SCRATCH' : r === DEV_REF ? 'DEV' : r ? 'other' : null; } catch { return null; } };
const pp = { required: presence(PORTAL, PP_REQUIRED), apbm007b: presence(PORTAL, PP_007B), engineering_cast_files: ['engineering_cast.json', 'inbox_access.json'].map((f) => ({ file: `~/.apbm007b/${f}`, present: existsSync(`${homedir()}/.apbm007b/${f}`) })),
  supabase_target: refOf(PORTAL, 'NEXT_PUBLIC_SUPABASE_URL', apiRef), stripe_key_mode: (() => { const k = loadNamed(PORTAL, { optional: ['STRIPE_SECRET_KEY'] }).STRIPE_SECRET_KEY ?? ''; return /^(sk|rk)_test_/.test(k) ? 'test' : k ? 'NOT_TEST' : 'missing'; })() };
const ob = { required: presence(OWEDBOOK, OB_REQUIRED), apbm007b: presence(OWEDBOOK, OB_007B), supabase_target: refOf(OWEDBOOK, 'NEXT_PUBLIC_SUPABASE_URL', apiRef),
  scratch_sql_target: refOf(OWEDBOOK, 'APBM_SCRATCH_DB_URL', sqlRef), dev_sql_target: refOf(OWEDBOOK, 'APBM_DEV_DB_URL', sqlRef) };
const missingRequired = [...Object.entries(pp.required), ...Object.entries(ob.required)].filter(([, v]) => !v).map(([k]) => k);
console.log(JSON.stringify({ portal: pp, owedbook: ob, missing_required: missingRequired, note: 'names/targets only; no value, hash or length is read out' }, null, 1));
process.exitCode = missingRequired.length ? 1 : 0;
