#!/usr/bin/env node
// APBM-007B — production build in a disposable copy + client-bundle secret scan + build identity (AC-031,
// ENGINEERING_COMMANDS.md). cwd: Portal root (it orchestrates both repositories; each step names its own cwd).
//
//   node scripts/apbm007b/build-check.mjs --help
//   node scripts/apbm007b/build-check.mjs --self-test                     # scanner poison/clean controls, no build, no network
//   node scripts/apbm007b/build-check.mjs --app pp|ob|both --out <dir>     # copy → npm ci → next build → scan → manifest
//
// The copy excludes .git, node_modules, .next, agent_docs, test-results and every .env* file; it is built with placeholder
// public settings and SYNTHETIC canary server secrets only (no real credential exists in the build). Network: npm ci fetches
// the exact lockfile packages (acknowledged setup effect). The artifact id is sha256(baseline commit + sorted changed-file
// hashes); it is compiled in (non-secret) and later compared with GET /api/build-info by served-identity.mjs.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, existsSync, cpSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = '/home/moose/NEXTJS/CYBER_PHARMA';
const APPS = { pp: { repo: `${ROOT}/cyph-payment-portal-dev-v1`, baseline: 'c68c4acaccc4a68f20ede267f06cfda17fa15aac', site: 'http://localhost:3101' },
  ob: { repo: `${ROOT}/cyph-v1-dev`, baseline: '0b785524a621c4384db8bee47ef9b4149b8ab44c', site: 'http://localhost:3100' } };
const CANARY = { SUPABASE_SECRET_KEY: 'SERVERKEY_CANARY_7f3a9', STRIPE_SECRET_KEY: 'sk_test_CANARY7f3a9', STRIPE_WEBHOOK_SECRET: 'whsec_CANARY7f3a9', RESEND_API_KEY: 're_CANARY7f3a9_x' };
// Server-only facts that must never reach a browser bundle: canary values, secret NAMES, privileged SQL functions, provider hosts.
export const PATTERNS = ['SERVERKEY_CANARY', 'sk_test_CANARY', 'whsec_CANARY', 're_CANARY7f3a9', 'SUPABASE_SECRET_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY',
  'MAIL_ALLOWLIST', 'handoff_issue', 'handoff_claim', 'provision_paid_registration', 'store_add_activate', 'store_operation_claim', 'invitation_dispatch_claim', 'notice_claim',
  'owner_replace', 'billing_test_context_enable', 'billing_deployment_bind', 'generateLink', 'createAdminClient', 'api.stripe.com', 'api.resend.com'];

// Documented baseline exception (Director ruling 4, 17 November 2026): the OwedBook browser Supabase client ships the
// @supabase/auth-js admin-API class, whose method name `generateLink` appears in ONE shared chunk of the untouched baseline
// build too (0b78552; EVIDENCE/E2/r01/BUILD/baseline_ob_generateLink_count.txt). It is library text, not a credential and not
// our code. The exception is narrow: OwedBook only, at most that one file, and only if the file is recognisably auth-js
// (it also contains `inviteUserByEmail`). Any other hit, a second file, or the same name in the Portal still fails.
export const BASELINE_EXCEPTIONS = { ob: { generateLink: { maxFiles: 1, mustAlsoContain: 'inviteUserByEmail' } } };
export function classify(app, dir, hits) {
  const unexpected = {}, baseline = {};
  for (const [p, files] of Object.entries(hits)) {
    const ex = BASELINE_EXCEPTIONS[app]?.[p];
    const ok = ex && files.length <= ex.maxFiles && files.every((f) => readFileSync(join(dir, f), 'latin1').includes(ex.mustAlsoContain));
    (ok ? baseline : unexpected)[p] = files;
  }
  return { unexpected, baseline };
}

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }

const files = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? files(p) : [p]; });
export function scan(dir) {
  const hits = {};
  for (const f of files(dir)) { const t = readFileSync(f, 'latin1'); for (const p of PATTERNS) if (t.includes(p)) (hits[p] ??= []).push(relative(dir, f)); }
  return hits;
}

if (args.includes('--self-test')) {
  const base = `/tmp/apbm007b-scan-selftest-${process.pid}`; mkdirSync(`${base}/poison`, { recursive: true }); mkdirSync(`${base}/clean`, { recursive: true });
  for (const [i, p] of PATTERNS.entries()) writeFileSync(`${base}/poison/chunk-${i}.js`, `var x="${p}";`);
  writeFileSync(`${base}/clean/chunk.js`, 'var x="public text only";');
  const poison = scan(`${base}/poison`), clean = scan(`${base}/clean`);
  writeFileSync(`${base}/poison/lib.js`, 'class A{async generateLink(e){} async inviteUserByEmail(e){}}');
  const poison2 = scan(`${base}/poison`);
  const cls = classify('ob', `${base}/poison`, poison2), clsPp = classify('pp', `${base}/poison`, poison2);
  const ok = PATTERNS.every((p) => poison[p]?.length === 1) && Object.keys(clean).length === 0
    && cls.unexpected.generateLink?.length === 2 && !!clsPp.unexpected.generateLink;   // two files → not excused; Portal never excused
  rmSync(base, { recursive: true, force: true });
  console.log(JSON.stringify({ self_test: ok ? 'PASS' : 'FAIL', patterns: PATTERNS.length, poison_detected: Object.keys(poison).length, clean_hits: Object.keys(clean).length }));
  process.exit(ok ? 0 : 1);
}

const which = args[args.indexOf('--app') + 1]; const out = args[args.indexOf('--out') + 1];
if (!['pp', 'ob', 'both'].includes(which) || !out || !out.startsWith('/home/moose/APBM007B_E2_WORK/')) { console.error('FAIL-CLOSED: --app pp|ob|both and --out /home/moose/APBM007B_E2_WORK/<dir> required'); process.exit(2); }
const report = { at: new Date().toISOString(), apps: {} };
for (const k of which === 'both' ? ['ob', 'pp'] : [which]) {
  const a = APPS[k]; const dst = join(out, k); const r = { repo: a.repo, baseline: a.baseline };
  // Identity: HEAD, and the content hash of every file that differs from the baseline (tracked changes + untracked).
  r.head = execFileSync('git', ['-C', a.repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const changed = [...new Set([...execFileSync('git', ['-C', a.repo, 'diff', '--name-only', a.baseline], { encoding: 'utf8' }).split('\n'),
    ...execFileSync('git', ['-C', a.repo, 'ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).split('\n')])]
    .filter((p) => p && !p.startsWith('agent_docs/') && existsSync(join(a.repo, p))).sort();
  r.changed_files = changed.map((p) => ({ path: p, sha256: createHash('sha256').update(readFileSync(join(a.repo, p))).digest('hex') }));
  r.artifact_id = createHash('sha256').update(JSON.stringify({ app: k, baseline: a.baseline, head: r.head, changed: r.changed_files })).digest('hex').slice(0, 32);
  r.revision = `${r.head.slice(0, 12)}+uncommitted-007b-e2`;
  rmSync(dst, { recursive: true, force: true }); mkdirSync(dst, { recursive: true });
  cpSync(a.repo, dst, { recursive: true, filter: (src) => { const rel = relative(a.repo, src); return !/^(\.git|node_modules|\.next|agent_docs|test-results|playwright-report)(\/|$)/.test(rel) && !/(^|\/)\.env[^/]*$/.test(rel); } });
  const ci = spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: dst, encoding: 'utf8', timeout: 900_000 });
  r.npm_ci = { exit: ci.status };
  if (ci.status !== 0) { r.npm_ci.tail = (ci.stderr || '').split('\n').slice(-15).join('\n'); report.apps[k] = r; continue; }
  const env = { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_placeholder', NEXT_PUBLIC_SITE_URL: a.site, NEXT_PUBLIC_APP_ENV: 'local-proof', NEXT_PUBLIC_APBM_DATA_MODE: 'real',
    APBM_BUILD_ARTIFACT_ID: r.artifact_id, APBM_BUILD_REVISION: r.revision, ...CANARY };
  const b = spawnSync('./node_modules/.bin/next', ['build'], { cwd: dst, env, encoding: 'utf8', timeout: 1_200_000 });
  writeFileSync(join(out, `build_${k}.log`), `${b.stdout}\n${b.stderr}`);
  r.build = { exit: b.status, next_build_id: existsSync(join(dst, '.next/BUILD_ID')) ? readFileSync(join(dst, '.next/BUILD_ID'), 'utf8').trim() : null,
    routes: (b.stdout.match(/^[┌├└] [○ƒ●]/gm) ?? []).length };
  if (b.status === 0) {
    r.client_scan = scan(join(dst, '.next/static'));
    r.client_files = files(join(dst, '.next/static')).length;
    const c = classify(k, join(dst, '.next/static'), r.client_scan);
    r.client_scan_unexpected = c.unexpected; r.client_scan_baseline_exceptions = c.baseline;
    r.client_scan_clean = Object.keys(c.unexpected).length === 0;
    // content manifest for served-identity comparison
    writeFileSync(join(out, `manifest_${k}.json`), JSON.stringify({ app: k, artifact_id: r.artifact_id, revision: r.revision, next_build_id: r.build.next_build_id, changed_files: r.changed_files }, null, 1));
  }
  report.apps[k] = r;
}
writeFileSync(join(out, 'build_check.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.apps).map(([k, r]) => [k, { npm_ci: r.npm_ci?.exit, build: r.build?.exit, routes: r.build?.routes, artifact_id: r.artifact_id, client_files: r.client_files, client_scan_clean: r.client_scan_clean, hits: r.client_scan }])), null, 1));
