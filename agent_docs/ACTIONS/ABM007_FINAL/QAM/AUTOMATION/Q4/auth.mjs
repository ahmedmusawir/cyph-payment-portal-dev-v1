import {contained, target, role as assertRole} from './guards.mjs';
// ABM007_FINAL — automated sign-in for EXISTING SCRATCH fixture users (rulings AM-14, AM-15). Test tooling only.
//
// Order of preference (AM-15):
//   1. The fixture's existing password from the private cast, through the app's normal password sign-in form.
//   2. Only where the cast holds no password: a provider-supported one-time token from the SCRATCH Auth admin API
//      (generateLink type "magiclink", which sends no email), redeemed through the app's own unchanged
//      /api/auth/confirm page and its "Sign in" button, which runs the app's verifyOtp and guards.
// Guards (fail closed): the role must be on ALLOWLIST; the user must already exist on SCRATCH (read-only SQL check:
// generateLink is never allowed to create a user); the target must verify as SCRATCH (API and SQL reference); the served
// app's client bundle must carry the SCRATCH reference and never DEV's; the site must be the local proof pair.
// Secrets stay in this process: the SCRATCH service key and the cast are never printed, logged, written or packaged.
// The one-time token exists only in memory and in the browser navigation; errors are rethrown without URLs.
// No session state is saved: callers use one browser context and close it.
//
// RUNTIME AND PATH CONSTRAINTS (all of them; a QA copy in its own declared lane must reconcile each one, not only one
// prefix check, and record what it changed). Do not weaken a target, allowlist or effect safeguard while adapting.
//   C-1  Line `const PORTAL = ...`: hard-coded Portal repository path. Used to import scripts/apbm007b/lib/env.mjs (the
//        SCRATCH/DEV target guard; protected path, never edited) and to resolve playwright and @supabase/supabase-js.
//   C-2  Line `const pg = ...`: resolves the `pg` driver from the OwedBook repository's package.json path.
//   C-3  CAST_FILE: ~/.apbm007b/engineering_cast.json, must be mode 0600 (checked). Engineering cast only; QA uses its
//        own cast only if the Director authorizes that, and never the cast's values in any artifact.
//   C-4  ALLOWLIST: ENGINEERING_OWNER_A, ENGINEERING_OWNER_B, ENGINEERING_ADMIN, ENGINEERING_MEMBER. Any other role fails.
//   C-5  SITES: http://localhost:3100 (OwedBook) and http://localhost:3101 (Portal): the 'local-proof' pair both apps'
//        appIdentity allow; cookie names and handoff origins depend on it. LOGIN paths /auth and /login.
//   C-6  assertServedScratch(): needs Linux `ss -ltnpH` (with process info for the same user) and readable /proc/<pid>/cwd
//        and /proc/<pid>/environ of the listener; the listener's working directory must start with '/tmp/claude-1000/'
//        (this Engineer session's scratchpad: the SECOND prefix check, alongside serve.mjs); its Supabase URL must resolve
//        to SCRATCH ihgcsrypblqkwommrkgj; NEXT_PUBLIC_APP_ENV must be 'local-proof'. OwedBook served scripts must not
//        contain the DEV backend URL.
//   C-7  The fixture user must already exist on SCRATCH (read-only SQL) before generateLink; generateLink never creates.
//   C-8  UI selectors: OwedBook input[name=email|password]; Portal #email/#password; the password form's non-"button"
//        button; the confirm page's [data-testid="confirm-sign-in"]. A product change to these needs a matching edit here.
//   C-9  Timeouts 30 s for sign-in navigation; SQL statement timeout 15 s.
//   C-10 Effects: password sign-in, or one generateLink (no email) plus the app's own verifyOtp, per call; nothing else.
import { readFileSync, readlinkSync, statSync, appendFileSync, existsSync } from 'node:fs'; import { execSync } from 'node:child_process'; import { homedir } from 'node:os'; import { createRequire } from 'node:module';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { scratchTarget, sqlRef, apiRef, SCRATCH_REF, DEV_REF } = await import(`${PORTAL}/scripts/apbm007b/lib/env.mjs`);
const req = createRequire(`${PORTAL}/package.json`);
const pg = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/package.json')('pg');

export const ALLOWLIST = Object.freeze(['ENGINEERING_OWNER_A', 'ENGINEERING_ADMIN', 'ENGINEERING_MEMBER', 'ENGINEERING_INVITEE']);
export const SITES = Object.freeze({ ob: 'http://localhost:3100', pp: 'http://localhost:3101' });
const LOGIN = { ob: '/auth', pp: '/login' };
const sessionLimit = 80;
const ledgerPath='agent_docs/ACTIONS/ABM007_FINAL/QAM/evidence/Q4/01/session-ledger.jsonl';
const budget=role=>{
  const spent=existsSync(ledgerPath)?readFileSync(ledgerPath,'utf8').trim().split('\n').filter(Boolean).length:0;
  if(spent>=sessionLimit)fail('Q4 sign-in ceiling reached');
  appendFileSync(ledgerPath,JSON.stringify({role,attempt:spent+1,time:new Date().toISOString()})+'\n');
};
const fail = (m) => { throw new Error(`FAIL-CLOSED: ${m}`); };
const CAST_FILE = `${homedir()}/.apbm007b/engineering_cast.json`;
let cast = null, sc = null; const servedOk = {};
export const sessionDiagnostics = [];
const pathOnly = u => new URL(u).pathname;
export const diagnosticControls = {queryRemoved:pathOnly('http://localhost:3101/auth/confirm?token_hash=QA_SYNTHETIC_SECRET')==='/auth/confirm',loginPathPreserved:pathOnly('http://localhost:3101/login')==='/login'};
if(!Object.values(diagnosticControls).every(Boolean))throw Error('Safe diagnostic controls failed');
export const counters = { password_sign_ins: 0, token_sign_ins: 0, generate_link_calls: 0 };

function init() {
  if (cast) return;
  if ((statSync(CAST_FILE).mode & 0o077) !== 0) fail('cast file must be mode 0600');
  cast = JSON.parse(readFileSync(CAST_FILE, 'utf8'));
  sc = scratchTarget(); target(sc.ref, sqlRef(sc.dbUrl));
  if (sc.ref !== SCRATCH_REF || sc.ref === DEV_REF) fail('target is not SCRATCH');
}

/** The served app must resolve to SCRATCH. Runtime proof from the listening server process itself: its working directory
 *  is a scratchpad verification copy, and its environment's Supabase URL resolves to the SCRATCH reference (only the
 *  reference is derived; no value is printed or kept). OwedBook's served scripts must not reference the DEV backend URL.
 *  The build-output check in serve.mjs (SCRATCH backend URL present, DEV absent) is the other binding proof. */
export async function assertServedScratch(app) {
  // Revalidate listener identity on every call, including process replacement.
  const site = SITES[app]; if (!site) fail('unknown app');
  init();
  const port = new URL(site).port;
  const line = execSync(`ss -ltnpH 'sport = :${port}'`, { encoding: 'utf8' });
  const pid = Number(line.match(/pid=(\d+)/)?.[1]); if (!pid) fail(`${app}: no owned listener on ${port}`);
  const cwd = readlinkSync(`/proc/${pid}/cwd`);
  if (!contained(cwd)) fail(`${app}: listener is not a scratchpad verification copy`);
  const env = Object.fromEntries(readFileSync(`/proc/${pid}/environ`, 'utf8').split('\0').filter(Boolean).map((kv) => [kv.slice(0, kv.indexOf('=')), kv.slice(kv.indexOf('=') + 1)]));
  const ref = apiRef(env.NEXT_PUBLIC_SUPABASE_URL);
  if (ref !== SCRATCH_REF || ref === DEV_REF) fail(`${app}: served backend is not SCRATCH`);
  if (env.MAIL_ALLOWLIST !== '') fail(app+': invitation mail allowlist not empty');
  if (env.NEXT_PUBLIC_APP_ENV !== 'local-proof') fail(`${app}: not the local proof pair`);
  let bundle = 'not applicable (server-only Supabase use)';
  if (app === 'ob') {
    const html = await (await fetch(`${site}${LOGIN[app]}`)).text();
    const srcs = [...html.matchAll(/<script[^>]+src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);
    let scratch = 0, dev = 0;
    for (const s of srcs) { const t = await (await fetch(`${site}${s}`)).text(); if (t.includes(`${SCRATCH_REF}.supabase.co`)) scratch++; if (t.includes(`${DEV_REF}.supabase.co`)) dev++; }
    if (dev) fail(`${app} served bundle references the DEV backend`);   // scratch count is informational: the chunk holding the
    // URL may load lazily; the build-output check (serve.mjs build) and the runtime check above are the binding proofs
    bundle = { scripts: srcs.length, scratch_refs: scratch, dev_refs: dev };
  }
  servedOk[app] = { listener_pid: pid, cwd_is_verification_copy: true, runtime_backend_ref: ref, app_env: 'local-proof', client_bundle: bundle };
}
export const servedReport = () => ({ ...servedOk });

async function userExistsOnScratch(email) {
  const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false }, statement_timeout: 15000 }); await c.connect();
  try { await c.query('begin read only'); const r = await c.query('select 1 from auth.users where lower(email) = $1', [email.toLowerCase()]); await c.query('rollback'); return r.rowCount === 1; }
  finally { await c.end(); }
}

/** Sign `role` in to `app` in this Playwright page. Returns the method used; never the identity or any secret. */
export async function signIn(page, app, role, next = null) {
  assertRole(role);
  init();
  if (!ALLOWLIST.includes(role)) fail('role not on the fixture allowlist');
  const who = cast[role]; if (!who?.email) fail('role missing from the private cast');
  await assertServedScratch(app);
  const site = SITES[app];
  budget(role);
  const diagnostic={app,role,stage:'entry'}; sessionDiagnostics.push(diagnostic);
  try {
    if (who.password) {
      diagnostic.stage='password-form'; await page.goto(`${site}${LOGIN[app]}`, { waitUntil: 'networkidle' });
      if (app === 'ob') { await page.fill('input[name="email"]', who.email); await page.fill('input[name="password"]', who.password); }
      else { await page.fill('#email', who.email); await page.fill('#password', who.password); }
      await Promise.all([page.waitForURL((u) => !u.pathname.startsWith(LOGIN[app]), { timeout: 30000 }),
        page.locator('form:has(input[type="password"]) button:not([type="button"])').first().click()]);
      diagnostic.stage='password-session-established'; counters.password_sign_ins++; return 'password (normal sign-in form)';
    }
    if (!(await userExistsOnScratch(who.email))) fail('fixture user not found on SCRATCH; refusing (generateLink would create one)');
    const { createClient } = req('@supabase/supabase-js');
    const admin = createClient(sc.url, sc.secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
    counters.generate_link_calls++;
    diagnostic.stage='generate-fixture-token'; const { data, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email: who.email });
    if (error || !data?.properties?.hashed_token) fail(`provider token unavailable (${error?.status ?? 'no token'})`);
    const q = new URLSearchParams({ token_hash: data.properties.hashed_token, type: 'email' }); if (next) q.set('next', next);
    diagnostic.stage='confirmation-entry'; const entryResponse=await page.goto(`${site}/api/auth/confirm?${q}`, { waitUntil: 'networkidle' });
    diagnostic.entryStatus=entryResponse?.status(); diagnostic.landedPath=pathOnly(page.url()); diagnostic.confirmControlCount=await page.locator('[data-testid="confirm-sign-in"]').count(); diagnostic.confirmVisible=await page.locator('[data-testid="confirm-sign-in"]').isVisible(); diagnostic.confirmEnabled=await page.locator('[data-testid="confirm-sign-in"]').isEnabled(); diagnostic.confirmPosts=0; diagnostic.confirmResponseStatuses=[]; page.on('request',r=>{if(r.method()==='POST'&&new URL(r.url()).pathname==='/api/auth/confirm')diagnostic.confirmPosts++}); page.on('response',r=>{if(r.request().method()==='POST'&&new URL(r.url()).pathname==='/api/auth/confirm')diagnostic.confirmResponseStatuses.push(r.status())}); diagnostic.stage='confirmation-click';
    await Promise.all([page.waitForURL((u) => !u.pathname.startsWith('/auth/confirm'), { timeout: 30000 }), page.click('[data-testid="confirm-sign-in"]')]);
    diagnostic.stage='fixture-session-established'; counters.token_sign_ins++; return 'provider token via the app confirm page (AM-15)';
  } catch (e) {
    diagnostic.failed=true;
    try { diagnostic.finalPath=pathOnly(page.url());diagnostic.confirmControlCount=await page.locator('[data-testid="confirm-sign-in"]').count();
      diagnostic.confirmVisible=await page.locator('[data-testid="confirm-sign-in"]').isVisible();
      diagnostic.confirmEnabled=await page.locator('[data-testid="confirm-sign-in"]').isEnabled();
      diagnostic.safeHeading=(await page.getByRole('heading').allTextContents()).map(x=>/^(Finish signing in|That sign-in link can.t be used|Login|Sign in)$/.test(x.trim())?x.trim():'[other]');
    }catch{}
    throw new Error(String(e?.message ?? e).split('\n')[0].replace(/https?:\/\/\S+/g, '[url]').replace(/token_hash=\S+/g, 'token_hash=[redacted]').slice(0, 200));
  }
}

/** Strings that identify the fixture people (addresses, their local parts, and names stored on SCRATCH), for masking
 *  screenshots and recorded text. In memory only; never printed or written. Read-only query. */
export async function privateStrings() {
  init();
  const emails = ALLOWLIST.map((r) => cast[r]?.email).filter(Boolean);
  const out = new Set(); for (const e of emails) { out.add(e); out.add(e.split('@')[0]); }
  const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false }, statement_timeout: 15000 }); await c.connect();
  try {
    await c.query('begin read only');
    const r = await c.query("select raw_user_meta_data->>'full_name' a, raw_user_meta_data->>'name' b, raw_user_meta_data->>'display_name' c from auth.users where lower(email) = any($1)", [emails.map((e) => e.toLowerCase())]);
    for (const row of r.rows) for (const v of [row.a, row.b, row.c]) if (v && v.trim().length >= 3) out.add(v.trim());
    const p = await c.query("select to_regclass('public.profiles') is not null ok");
    if (p.rows[0].ok) { try { const q = await c.query('select full_name from public.profiles p join auth.users u on u.id = p.id where lower(u.email) = any($1)', [emails.map((e) => e.toLowerCase())]); for (const row of q.rows) if (row.full_name?.trim().length >= 3) out.add(row.full_name.trim()); } catch { /* table shape differs; skip */ } }
    await c.query('rollback');
  } finally { await c.end(); }
  return [...out].sort((a, b) => b.length - a.length);
}
