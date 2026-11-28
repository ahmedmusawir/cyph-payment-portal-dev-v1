#!/usr/bin/env node
// ABM007_FINAL RWO-01 add-on A3 — browser driver for the SCRATCH proof pair (OwedBook 3100 only; no Portal page).
// Test tooling only. Claims for QA to test, never results.
//
// Why a driver: the add-on allows 6 sign-in sessions, and the work needs "before", cause-finding and "after" in three
// engines. This process signs in ONCE per engine (Firefox, Chrome, WebKit) as the fixture Owner A through
// ../../E2/tools/scratch_proof/auth.mjs (unchanged; SCRATCH verified from the listening server before each sign-in),
// then keeps the three pages open and runs small step files against them. The signed-in pages stay valid when the
// local build is stopped and a new build is started on the same port, so the same three sessions serve before and after.
// Nothing is saved: no cookie, token or session state is written anywhere; closing this process ends the sessions.
//
// Usage (Portal root): node driver_a3.mjs <work_dir> [engines=firefox,chromium,webkit]
//   step files:  <work_dir>/cmd/<name>.mjs   exporting  default async ({ pages, OB, log, verifyServed }) => result
//   results:     <work_dir>/res/<name>.json  (emails and fixture names masked)
//   stop:        create <work_dir>/cmd/quit
// A request to the Portal origin is counted and reported in every result (expected: 0).
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers';
import { createRequire } from 'node:module'; import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs'; import { pathToFileURL } from 'node:url';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const pw = createRequire(`${PORTAL}/package.json`)('playwright');
const AUTH = new URL('../../E2/tools/scratch_proof/auth.mjs', import.meta.url).href;
const A = await import(AUTH);
const work = process.argv[2]; const engines = (process.argv[3] || 'firefox,chromium,webkit').split(',');
if (!work) { console.error('usage: driver_a3.mjs <work_dir> [engines]'); process.exit(2); }
mkdirSync(`${work}/cmd`, { recursive: true }); mkdirSync(`${work}/res`, { recursive: true });
const { ob: OB, pp: PP } = A.SITES; const ROLE = 'ENGINEERING_OWNER_A';
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; const PRIVATE = await A.privateStrings();
const clean = (s) => { let t = String(s ?? '').replace(EMAIL, (m) => (/pharmacybooks\.com$/.test(m) ? m : '[email]')); for (const p of PRIVATE) t = t.split(p).join('[name]'); return t.replace(/https?:\/\/(?!localhost)\S+/g, '[url]'); };
const pages = {}; const browsers = {}; const state = { started: new Date().toISOString(), engines: {}, sign_in: {}, portal_requests: 0 };
for (const e of engines) {
  const b = await pw[e].launch(e === 'chromium' ? { channel: 'chrome' } : {}); browsers[e] = b; state.engines[e] = b.version();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  page.on('request', (r) => { if (r.url().startsWith(PP)) state.portal_requests++; });
  try { state.sign_in[e] = await A.signIn(page, 'ob', ROLE); } catch (err) { state.sign_in[e] = `FAILED: ${clean(String(err?.message ?? err).split('\n')[0]).slice(0, 200)}`; }
  pages[e] = page;
}
state.sessions = { ...A.counters, total_sign_ins: A.counters.password_sign_ins + A.counters.token_sign_ins }; state.served_at_sign_in = A.servedReport();
// Fresh check of the listening server (after a build swap): a new copy of the auth module, no sign-in.
let n = 0; const verifyServed = async () => { const M = await import(`${AUTH}?v=${++n}`); await M.assertServedScratch('ob'); return M.servedReport(); };
writeFileSync(`${work}/res/_ready.json`, JSON.stringify(JSON.parse(clean(JSON.stringify(state))), null, 1)); console.log('ready', JSON.stringify(state.sessions));
const done = new Set();
for (;;) {
  if (existsSync(`${work}/cmd/quit`)) break;
  for (const f of readdirSync(`${work}/cmd`).filter((x) => x.endsWith('.mjs') && !done.has(x)).sort()) {
    done.add(f); const name = f.replace(/\.mjs$/, ''); const log = []; let result, error = null; const t0 = Date.now();
    try { const mod = await import(`${pathToFileURL(`${work}/cmd/${f}`).href}?t=${t0}`); result = await mod.default({ pages, OB, log: (...a) => log.push(a.join(' ')), verifyServed, work }); }
    catch (err) { error = String(err?.stack ?? err).split('\n').slice(0, 4).join(' | '); }
    const outp = { step: name, engines: state.engines, sessions: state.sessions, portal_requests: state.portal_requests, took_ms: Date.now() - t0, error, log, result };
    writeFileSync(`${work}/res/${name}.json`, JSON.stringify(JSON.parse(clean(JSON.stringify(outp))), null, 1));
  }
  await new Promise((r) => setTimeout(r, 400));
}
for (const b of Object.values(browsers)) await b.close();
writeFileSync(`${work}/res/_closed.json`, JSON.stringify({ closed: new Date().toISOString(), sessions: state.sessions, portal_requests: state.portal_requests }, null, 1));
process.exit(0);
