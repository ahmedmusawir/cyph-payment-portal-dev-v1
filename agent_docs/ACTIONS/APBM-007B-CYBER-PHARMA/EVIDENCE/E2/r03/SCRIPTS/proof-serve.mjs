#!/usr/bin/env node
// APBM-007B — owned production-build proof servers on the fixed proof pair (OwedBook 3100, Portal 3101) against SCRATCH.
// cwd: Portal root.
//
//   node scripts/apbm007b/proof-serve.mjs --help
//   node scripts/apbm007b/proof-serve.mjs build --out /home/moose/APBM007B_E2_WORK/proof     # copies + npm ci + next build (public SCRATCH values)
//   node scripts/apbm007b/proof-serve.mjs start --out /home/moose/APBM007B_E2_WORK/proof     # next start -p 3100 / 3101; pidfile
//   node scripts/apbm007b/proof-serve.mjs stop  --out /home/moose/APBM007B_E2_WORK/proof     # stops ONLY the PIDs this tool started
//   ... start --mail live   # pass each app's PRIVATE MAIL_ALLOWLIST (and Portal RESEND_API_KEY/BILLING_EMAIL_FROM) in memory;
//                           # without it the allowlist is empty and no mail can leave
//
// Builds compile only public values (SCRATCH URL + publishable key, NEXT_PUBLIC_APP_ENV=local-proof, site URLs 3100/3101) and
// the non-secret artifact id. Server secrets (SCRATCH service key, Stripe TEST keys) are passed to `next start` in memory only.
// MAIL_ALLOWLIST is empty (no mail can be sent); RESEND_API_KEY is not passed. Refuses to start if 3100/3101 are taken, and
// never touches the Director's servers on 3000/3001/3457. Target verified as SCRATCH by API+SQL reference.
import { spawn, spawnSync, execFileSync, execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, openSync } from 'node:fs';
import { join, relative } from 'node:path';
import { scratchTarget, stripeTarget, loadNamed, PORTAL, OWEDBOOK } from './lib/env.mjs';

const args = process.argv.slice(2); const cmd = args[0];
if (!cmd || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const out = args[args.indexOf('--out') + 1];
if (!['build', 'start', 'stop'].includes(cmd) || !out || !out.startsWith('/home/moose/APBM007B_E2_WORK/')) { console.error('FAIL-CLOSED: build|start|stop --out /home/moose/APBM007B_E2_WORK/<dir>'); process.exit(2); }
const ROOT = '/home/moose/NEXTJS/CYBER_PHARMA';
const APPS = { ob: { repo: `${ROOT}/cyph-v1-dev`, port: 3100, site: 'http://localhost:3100', baseline: '0b785524a621c4384db8bee47ef9b4149b8ab44c' },
  pp: { repo: `${ROOT}/cyph-payment-portal-dev-v1`, port: 3101, site: 'http://localhost:3101', baseline: 'c68c4acaccc4a68f20ede267f06cfda17fa15aac' } };
const sc = scratchTarget();
const portInUse = (p) => { try { return execSync(`ss -ltnH 'sport = :${p}'`, { encoding: 'utf8' }).trim().length > 0; } catch { return false; } };

if (cmd === 'build') {
  const report = {};
  for (const [k, a] of Object.entries(APPS)) {
    const dst = join(out, k);
    const changed = [...new Set([...execFileSync('git', ['-C', a.repo, 'diff', '--name-only', a.baseline], { encoding: 'utf8' }).split('\n'), ...execFileSync('git', ['-C', a.repo, 'ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).split('\n')])]
      .filter((p) => p && !p.startsWith('agent_docs/') && existsSync(join(a.repo, p))).sort().map((p) => ({ path: p, sha256: createHash('sha256').update(readFileSync(join(a.repo, p))).digest('hex') }));
    const head = execFileSync('git', ['-C', a.repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const artifact = createHash('sha256').update(JSON.stringify({ app: k, baseline: a.baseline, head, changed })).digest('hex').slice(0, 32);
    const revision = `${head.slice(0, 12)}+uncommitted-007b-e2`;
    rmSync(dst, { recursive: true, force: true }); mkdirSync(dst, { recursive: true });
    cpSync(a.repo, dst, { recursive: true, filter: (src) => { const rel = relative(a.repo, src); return !/^(\.git|node_modules|\.next|agent_docs|test-results|playwright-report)(\/|$)/.test(rel) && !/(^|\/)\.env[^/]*$/.test(rel); } });
    const ci = spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: dst, encoding: 'utf8', timeout: 900_000 });
    const env = { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SUPABASE_URL: sc.url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: sc.publishableKey,
      NEXT_PUBLIC_SITE_URL: a.site, NEXT_PUBLIC_APP_ENV: 'local-proof', NEXT_PUBLIC_APBM_DATA_MODE: 'real', APBM_BUILD_ARTIFACT_ID: artifact, APBM_BUILD_REVISION: revision };
    const b = ci.status === 0 ? spawnSync('./node_modules/.bin/next', ['build'], { cwd: dst, env, encoding: 'utf8', timeout: 1_200_000 }) : { status: null, stdout: '', stderr: '' };
    writeFileSync(join(out, `build_${k}.log`), `${b.stdout}\n${b.stderr}`.replace(/sb_publishable_[A-Za-z0-9_-]+/g, 'sb_publishable_[redacted]'));
    const buildId = existsSync(join(dst, '.next/BUILD_ID')) ? readFileSync(join(dst, '.next/BUILD_ID'), 'utf8').trim() : null;
    writeFileSync(join(out, `manifest_${k}.json`), JSON.stringify({ app: k, artifact_id: artifact, revision, next_build_id: buildId, changed_files: changed }, null, 1));
    report[k] = { npm_ci: ci.status, build: b.status, artifact_id: artifact, next_build_id: buildId };
  }
  console.log(JSON.stringify(report, null, 1));
  process.exit(Object.values(report).every((r) => r.build === 0) ? 0 : 1);
}
const pidfile = join(out, 'pids.json');
if (cmd === 'start') {
  if ([3000, 3001].some((p) => !portInUse(p))) console.log('note: a Director port is not listening; nothing of ours uses it');
  if (portInUse(3100) || portInUse(3101)) { console.error('FAIL-CLOSED: 3100/3101 already in use'); process.exit(2); }
  const st = stripeTarget(); const pp = loadNamed(PORTAL, { required: ['STRIPE_PORTAL_CONFIGURATION', 'STRIPE_WEBHOOK_SECRET'], optional: ['MAIL_ALLOWLIST', 'RESEND_API_KEY', 'BILLING_EMAIL_FROM'] });
  const live = args.includes('--mail') && args[args.indexOf('--mail') + 1] === 'live';
  const ob = loadNamed(OWEDBOOK, { optional: ['MAIL_ALLOWLIST'] });
  const mail = { pp: live ? { MAIL_ALLOWLIST: pp.MAIL_ALLOWLIST ?? '', ...(pp.RESEND_API_KEY ? { RESEND_API_KEY: pp.RESEND_API_KEY } : {}), ...(pp.BILLING_EMAIL_FROM ? { BILLING_EMAIL_FROM: pp.BILLING_EMAIL_FROM } : {}) } : { MAIL_ALLOWLIST: '' },
    ob: { MAIL_ALLOWLIST: live ? ob.MAIL_ALLOWLIST ?? '' : '' } };
  const pids = {};
  for (const [k, a] of Object.entries(APPS)) {
    const env = { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', PORT: String(a.port), HOSTNAME: '127.0.0.1',
      NEXT_PUBLIC_SUPABASE_URL: sc.url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: sc.publishableKey, SUPABASE_SECRET_KEY: sc.secretKey, NEXT_PUBLIC_SITE_URL: a.site,
      NEXT_PUBLIC_APP_ENV: 'local-proof', ALLOW_SYNTHETIC_SUBSCRIPTIONS: 'true', ...mail[k],
      ...(k === 'pp' ? { STRIPE_SECRET_KEY: st.STRIPE_SECRET_KEY, STRIPE_EXPECTED_ACCOUNT: st.STRIPE_EXPECTED_ACCOUNT, STRIPE_PRICE_STORES: st.STRIPE_PRICE_STORES,
        STRIPE_PORTAL_CONFIGURATION: pp.STRIPE_PORTAL_CONFIGURATION, STRIPE_WEBHOOK_SECRET: pp.STRIPE_WEBHOOK_SECRET, APA_PROMOTION_CODES: st.APA_PROMOTION_CODES ?? '' } : {}) };
    const log = openSync(join(out, `serve_${k}.log`), 'a');
    const child = spawn('./node_modules/.bin/next', ['start', '-p', String(a.port), '-H', '127.0.0.1'], { cwd: join(out, k), env, detached: true, stdio: ['ignore', log, log] });
    child.unref(); pids[k] = child.pid;
  }
  writeFileSync(pidfile, JSON.stringify(pids)); console.log(JSON.stringify({ started: pids, mail: live ? 'live (private allowlist in memory)' : 'blocked (empty allowlist)' }));
}
if (cmd === 'stop') {
  const pids = existsSync(pidfile) ? JSON.parse(readFileSync(pidfile, 'utf8')) : {};
  for (const [k, pid] of Object.entries(pids)) { try { process.kill(-pid, 'SIGTERM'); } catch { try { process.kill(pid, 'SIGTERM'); } catch { /* gone */ } } console.log(`stopped ${k} ${pid}`); }
  rmSync(pidfile, { force: true });
}
