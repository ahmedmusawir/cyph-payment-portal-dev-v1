#!/usr/bin/env node
// APBM-007B — integration runner (replaces the stale `npm run test:integration`). cwd: Portal root.
//
//   node scripts/apbm007b/integration.mjs --help
//   node scripts/apbm007b/integration.mjs --suite store      # src/integration/apbm007b-store.itest.ts (SCRATCH + Stripe sandbox)
//
// Verifies the SCRATCH project by API and SQL reference (from OwedBook .env.local) and the Stripe TEST key/account (from
// Portal .env.local), then runs exactly one *.itest.ts with an explicit --testMatch, --runInBand. Settings are supplied
// to the child process in memory only; output is scrubbed of credentials. MAIL_ALLOWLIST is forced empty (no mail).
// Effects: every provider/Auth effect is reserved in the cumulative E2 ledger by the test itself. Never DEV.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { PORTAL, scratchTarget, stripeTarget, loadNamed, scrub, EVIDENCE_ROOT } from './lib/env.mjs';
import { CEILINGS, EFFECTS_DIR } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const suites = { store: '**/src/integration/apbm007b-store.itest.ts' };
const suite = args[args.indexOf('--suite') + 1];
if (!suites[suite]) { console.error('FAIL-CLOSED: --suite store'); process.exit(2); }
const sc = scratchTarget(); const st = stripeTarget(); const pp = loadNamed(PORTAL, { required: ['STRIPE_PORTAL_CONFIGURATION', 'STRIPE_WEBHOOK_SECRET'] });
const { stripe } = await import('./lib/stripe.mjs');
if ((await stripe.accounts.retrieveCurrent()).id !== st.STRIPE_EXPECTED_ACCOUNT) { console.error('FAIL-CLOSED: Stripe account mismatch'); process.exit(2); }
const env = { ...process.env, APBM_ITEST_SCRATCH: sc.ref, NEXT_PUBLIC_SUPABASE_URL: sc.url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: sc.publishableKey, SUPABASE_SECRET_KEY: sc.secretKey,
  STRIPE_SECRET_KEY: st.STRIPE_SECRET_KEY, STRIPE_EXPECTED_ACCOUNT: st.STRIPE_EXPECTED_ACCOUNT, STRIPE_PRICE_STORES: st.STRIPE_PRICE_STORES, STRIPE_PORTAL_CONFIGURATION: pp.STRIPE_PORTAL_CONFIGURATION,
  STRIPE_WEBHOOK_SECRET: pp.STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL: 'http://localhost:3001', NEXT_PUBLIC_APP_ENV: 'local', MAIL_ALLOWLIST: '', RESEND_API_KEY: '',
  APBM007B_EFFECTS_DIR: EFFECTS_DIR, APBM007B_EFFECT_CEILINGS: JSON.stringify(CEILINGS) };
const r = spawnSync('npx', ['--no-install', 'jest', '--ci', '--runInBand', '--verbose', '--testMatch', suites[suite], '--testPathIgnorePatterns', '/node_modules/'], { cwd: PORTAL, env, encoding: 'utf8', timeout: 900_000 });
const out = scrub(`${r.stdout}\n${r.stderr}`);
console.log(out);
process.exitCode = r.status ?? 1;
void EVIDENCE_ROOT;
