#!/usr/bin/env node
// ABM007_FINAL — SCRATCH-backed production builds of hash-bound working-tree copies on the fixed proof pair
// (OwedBook 3100, Portal 3101; the 'local-proof' origins both apps' appIdentity already allow). Test tooling only:
// lives in the module's evidence tools, never in product code. Rulings AM-08 (5), AM-14, AM-15.
//
//   node serve.mjs build --copies <dir with ob/ and pp/>     # next build in each copy, public SCRATCH values only
//   node serve.mjs start --copies <dir>                      # next start -p 3100 / 3101 on 127.0.0.1; pidfile in <dir>
//   node serve.mjs stop  --copies <dir>                      # stops ONLY the process groups this tool started
//
// Copies are made beforehand by tools/assemble.sh (working tree incl. staged/unstaged/untracked, no .env*, no agent_docs)
// with node_modules copied unchanged. Target: SCRATCH, verified by API and SQL reference (scripts/apbm007b/lib/env.mjs
// scratchTarget(), fails closed for DEV or anything else). Builds compile only public values (SCRATCH URL, publishable key,
// NEXT_PUBLIC_APP_ENV=local-proof, site URLs). Server secrets (SCRATCH service key, Stripe TEST key and names) are passed
// to `next start` in memory only. MAIL_ALLOWLIST is empty and RESEND_API_KEY is not passed, so no app mail can leave.
// No Stripe listener is started. Refuses occupied ports; never touches 3000/3001/3457. Logs are scrubbed.
//
// RUNTIME AND PATH CONSTRAINTS (all of them; a QA copy must reconcile each and record what it changed; never weaken the
// SCRATCH verification, the mail block or the port refusal while adapting):
//   C-1  Line `const PORTAL = ...`: hard-coded Portal repository path (imports scripts/apbm007b/lib/env.mjs, protected).
//   C-2  --copies must start with '/tmp/claude-1000/' (this Engineer session's scratchpad) and contain ob/ and pp/, each a
//        copy made by ../assemble.sh with its repository's node_modules copied in (`./node_modules/.bin/next` is used).
//        auth.mjs makes the matching check on the running listener's working directory (its C-6).
//   C-3  Ports fixed at 3100 (ob) and 3101 (pp), bound to 127.0.0.1; refuses to start if either is in use (Linux `ss`).
//   C-4  Reads only named keys: OwedBook .env.local APBM_SCRATCH_* (through scratchTarget()); Portal .env.local
//        STRIPE_SECRET_KEY (test key enforced), STRIPE_EXPECTED_ACCOUNT, STRIPE_PRICE_STORES, STRIPE_PORTAL_CONFIGURATION,
//        STRIPE_WEBHOOK_SECRET. Values go only into the child process environment; never printed or written.
//   C-5  MAIL_ALLOWLIST is set empty and RESEND_API_KEY is not passed (no app mail); no Stripe listener; ALLOW_SYNTHETIC_
//        SUBSCRIPTIONS is not set (as on alpha).
//   C-6  Build check: SCRATCH backend URL must appear in the built JS and no DEV backend URL may, except the mail guard's
//        exact comparison literal; build logs are scrubbed (lib/env.mjs scrub()).
//   C-7  pidfile pids_scratch.json in --copies; `stop` signals only the process groups this tool started.
import { spawn, spawnSync, execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, openSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { scratchTarget, stripeTarget, loadNamed, scrub, SCRATCH_REF, DEV_REF } = await import(`${PORTAL}/scripts/apbm007b/lib/env.mjs`);
const args = process.argv.slice(2); const cmd = args[0]; const dir = args[args.indexOf('--copies') + 1];
if (!['build', 'start', 'stop'].includes(cmd) || !dir || !dir.startsWith('/tmp/claude-1000/') || !existsSync(join(dir, 'ob')) || !existsSync(join(dir, 'pp'))) {
  console.error('FAIL-CLOSED: build|start|stop --copies <scratchpad dir containing ob/ and pp/>'); process.exit(2);
}
const APPS = { ob: { port: 3100, site: 'http://localhost:3100' }, pp: { port: 3101, site: 'http://localhost:3101' } };
const sc = scratchTarget(); if (sc.ref !== SCRATCH_REF || sc.ref === DEV_REF) { console.error('FAIL-CLOSED: target is not SCRATCH'); process.exit(2); }
const portInUse = (p) => { try { return execSync(`ss -ltnH 'sport = :${p}'`, { encoding: 'utf8' }).trim().length > 0; } catch { return false; } };
const base = { PATH: process.env.PATH, HOME: process.env.HOME, NEXT_TELEMETRY_DISABLED: '1' };
const pub = (a) => ({ NEXT_PUBLIC_SUPABASE_URL: sc.url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: sc.publishableKey, NEXT_PUBLIC_SITE_URL: a.site, NEXT_PUBLIC_APP_ENV: 'local-proof', NEXT_PUBLIC_APBM_DATA_MODE: 'real' });

if (cmd === 'build') {
  const report = {};
  for (const [k, a] of Object.entries(APPS)) {
    if (readdirSync(join(dir, k)).some((f) => /^\.env/.test(f))) { console.error(`FAIL-CLOSED: env file in ${k} copy`); process.exit(2); }
    const b = spawnSync('./node_modules/.bin/next', ['build'], { cwd: join(dir, k), env: { ...base, NODE_ENV: 'production', ...pub(a) }, encoding: 'utf8', timeout: 1_200_000 });
    writeFileSync(join(dir, `build_${k}_scratch.log`), scrub(`${b.stdout}\n${b.stderr}`));
    // Resolved backend check on the build output: client chunks must carry the SCRATCH reference and never DEV's.
    // Build output (client and server bundles) must carry the SCRATCH backend URL (<ref>.supabase.co) and never DEV's. The only DEV URL
    // allowed is the mail guard's comparison literal ("<DEV>.supabase.co"===new URL(<this build's backend>)), which tests whether
    // this build IS DEV; it is not a backend. Any other DEV URL fails the build check.
    const count = (root) => { let s = 0, d = 0; const walk = (x) => { for (const f of readdirSync(x)) { const p = join(x, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.js')) { const t = readFileSync(p, 'utf8'); if (t.includes(`${SCRATCH_REF}.supabase.co`)) s++; if (t.split(`${DEV_REF}.supabase.co`).length - 1 > t.split(`"${DEV_REF}.supabase.co"===new URL(`).length - 1) d++; } } }; if (existsSync(root)) walk(root); return [s, d]; };
    const [cs, cd] = count(join(dir, k, '.next/static')), [ss, sd] = count(join(dir, k, '.next/server'));
    report[k] = { build: b.status, client_js_with_scratch_ref: cs, client_js_with_dev_ref: cd, server_js_with_scratch_ref: ss, server_js_with_dev_ref: sd, backend_ok: b.status === 0 && cs + ss > 0 && cd + sd === 0 };
  }
  console.log(JSON.stringify({ target: sc.ref, ...report }, null, 1));
  process.exit(Object.values(report).every((r) => r.backend_ok) ? 0 : 1);
}
const pidfile = join(dir, 'pids_scratch.json');
if (cmd === 'start') {
  if (Object.values(APPS).some((a) => portInUse(a.port))) { console.error('FAIL-CLOSED: 3100/3101 already in use'); process.exit(2); }
  const st = stripeTarget(); const pp = loadNamed(PORTAL, { required: ['STRIPE_PORTAL_CONFIGURATION', 'STRIPE_WEBHOOK_SECRET'] });
  const pids = {};
  for (const [k, a] of Object.entries(APPS)) {
    const env = { ...base, NODE_ENV: 'production', PORT: String(a.port), HOSTNAME: '127.0.0.1', ...pub(a), SUPABASE_SECRET_KEY: sc.secretKey, MAIL_ALLOWLIST: '',
      ...(k === 'pp' ? { STRIPE_SECRET_KEY: st.STRIPE_SECRET_KEY, STRIPE_EXPECTED_ACCOUNT: st.STRIPE_EXPECTED_ACCOUNT, STRIPE_PRICE_STORES: st.STRIPE_PRICE_STORES,
        STRIPE_PORTAL_CONFIGURATION: pp.STRIPE_PORTAL_CONFIGURATION, STRIPE_WEBHOOK_SECRET: pp.STRIPE_WEBHOOK_SECRET } : {}) };
    const log = openSync(join(dir, `serve_${k}_scratch.log`), 'a');
    const child = spawn('./node_modules/.bin/next', ['start', '-p', String(a.port), '-H', '127.0.0.1'], { cwd: join(dir, k), env, detached: true, stdio: ['ignore', log, log] });
    child.unref(); pids[k] = child.pid;
  }
  writeFileSync(pidfile, JSON.stringify({ ...pids, started_at: new Date().toISOString() }));
  console.log(JSON.stringify({ target: sc.ref, started: pids, mail: 'blocked (empty allowlist, no Resend key)', stripe_listener: 'none' }));
}
if (cmd === 'stop') {
  const pids = existsSync(pidfile) ? JSON.parse(readFileSync(pidfile, 'utf8')) : {};
  for (const k of ['ob', 'pp']) { if (!pids[k]) continue; try { process.kill(-pids[k], 'SIGTERM'); } catch { /* gone */ } }
  writeFileSync(pidfile.replace('.json', '_stopped.json'), JSON.stringify({ ...pids, stopped_at: new Date().toISOString() }));
  console.log(JSON.stringify({ stopped: pids }));
}
