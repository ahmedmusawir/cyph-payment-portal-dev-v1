#!/usr/bin/env node
// APBM-007B — mail guard validation BEFORE any dispatch budget is spent (CLOCK_AND_NOTICES.md). cwd: Portal root.
//
//   node scripts/apbm007b/mail-guard-probe.mjs --help
//   node scripts/apbm007b/mail-guard-probe.mjs --self-test                     # allow/deny controls on a synthetic list
//   node scripts/apbm007b/mail-guard-probe.mjs --check <address> [--app pp|ob] # decision under the PRIVATE MAIL_ALLOWLIST
//
// Uses the same normalization rule as src/server/mailGuard.ts in both apps (exact, lower-cased, no wildcard; absent/empty
// denies all; MAIL_GUARD=off ignored). Sends nothing and consumes no provider dispatch. Prints the decision and the
// allowlist SIZE only, never its contents.
import { readFileSync } from 'node:fs';
import { loadNamed, PORTAL, OWEDBOOK } from './lib/env.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const norm = (a) => a.trim().toLowerCase();
const list = (raw) => new Set((raw || '').split(',').map(norm).filter((a) => /^[^@\s,*]+@[^@\s,*]+\.[^@\s,*]+$/.test(a)));
const allowed = (raw, a) => list(raw).has(norm(a));
// Same rule must hold in both copies of the module.
const src = ['cyph-payment-portal-dev-v1', 'cyph-v1-dev'].map((r) => readFileSync(`/home/moose/NEXTJS/CYBER_PHARMA/${r}/src/server/mailGuard.ts`, 'utf8').match(/\/\^\[\^@\\s,\*\]\+@.*?\$\//)?.[0]);
if (args.includes('--self-test')) {
  const raw = ' Owner@Example.com , *@example.com,bad';
  const cases = [['owner@example.com', true], ['OWNER@example.com ', true], ['other@example.com', false], ['bad', false]];
  const ok = cases.every(([a, want]) => allowed(raw, a) === want) && !allowed('', 'x@y.zz') && !allowed(undefined, 'x@y.zz') && src[0] && src[0] === src[1];
  console.log(JSON.stringify({ self_test: ok ? 'PASS' : 'FAIL', cases: cases.length, both_apps_same_rule: src[0] === src[1] })); process.exit(ok ? 0 : 1);
}
const address = args[args.indexOf('--check') + 1]; const app = args.includes('--app') ? args[args.indexOf('--app') + 1] : 'pp';
if (!address) { console.error('FAIL-CLOSED: --check <address> required'); process.exit(2); }
const raw = loadNamed(app === 'ob' ? OWEDBOOK : PORTAL, { optional: ['MAIL_ALLOWLIST'] }).MAIL_ALLOWLIST;
console.log(JSON.stringify({ app, allowlist_size: list(raw).size, decision: allowed(raw, address) ? 'allowed' : 'blocked', sends: 0 }));
