import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readlinkSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { scratchTarget, sqlRef } from '../../../../../../scripts/apbm007b/lib/env.mjs';
import * as auth from './auth.mjs';
import { QA_ROOT, target } from './guards.mjs';

const q = 'agent_docs/ACTIONS/ABM007_FINAL/QAM';
const out = join(q, 'evidence/Q2/J-e');
const obRepo = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev';
const repos = { ob: obRepo, pp: process.cwd() };
const roles = auth.ALLOWLIST;
const owner = 'ENGINEERING_OWNER_A';
const invitee = 'ENGINEERING_INVITEE';
const member = 'ENGINEERING_MEMBER';
const recovery = process.argv[2] === '--installed-chrome-after-no-effect';
const firstFile = join(out, 'invite-attempt.json');
const file = recovery ? join(out, 'invite-installed-chrome.json') : firstFile;
const hash = value => createHash('sha256').update(value).digest('hex');
const load = path => JSON.parse(readFileSync(path, 'utf8'));
const save = (path, value, flag) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n', { flag });
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
const time = () => new Date().toISOString();
const castPath = join(homedir(), '.apbm007b/engineering_cast.json');
const safePharmacy = value => typeof value === 'string' && value.length <= 100 &&
  /^[\p{L}\p{N} .,&'()_-]+$/u.test(value);
const previous = load(join(q, 'evidence/Q2/22/real-ready.json'));
const index = load(join(q, 'evidence/Q2/01/copy-index.json'));
const sc = scratchTarget();
let stage = 'entry guards';
let createdAttempt = false;
let result = {};

async function run() {
  ensure(previous.ready, 'Missing prior real-build verification');
  target(sc.ref, sqlRef(sc.dbUrl));
  ensure((statSync(castPath).mode & 0o077) === 0, 'Private cast permissions too broad');
  if (recovery) {
    const first = load(firstFile);
    ensure(first.stoppedAt === 'start single Owner A session' && first.requests === 0 &&
      first.delivery === 'NOT SENT' && first.sessionDiagnostics.length === 0 &&
      Object.values(first.auth).every(count => count === 0), 'First attempt has activity or an ambiguous outcome');
  }
  const cast = load(castPath);
  const email = cast[invitee].email.trim().toLowerCase();
  const ledger = load(join(q, 'evidence/Q2/effects-progress.json'));
  ensure(ledger.invitation === 0 && ledger.invitationEmail === 0 && ledger.conservativeSessionCharge < ledger.sessionCeiling,
    'Saved effects ledger does not allow this send');
  const planHash = hash(readFileSync(join(q, 'QAM_TEST_PLAN.md')));
  ensure(planHash === '6a1abc2ae4187874e6c755d195d5ab6fc060c4f26d92520b6df6bc8cf9c73c7d', 'Plan hash differs');
  for (const row of previous.rows) {
    const app = row.app;
    ensure(execFileSync('git', ['-C', repos[app], 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() === row.candidate,
      'Candidate HEAD differs');
    ensure(execFileSync('git', ['-C', repos[app], 'branch', '--show-current'], { encoding: 'utf8' }).trim() === 'qa/abm007-final',
      'Candidate branch differs');
    await auth.assertServedScratch(app);
    const pid = auth.servedReport()[app].listener_pid;
    ensure(pid === previous.target[app].listener_pid, 'Serving process changed');
    ensure(readlinkSync('/proc/' + pid + '/cwd') === join(QA_ROOT, app), 'Unexpected served copy');
    const env = Object.fromEntries(readFileSync('/proc/' + pid + '/environ', 'utf8').split('\0').filter(Boolean)
      .map(kv => [kv.slice(0, kv.indexOf('=')), kv.slice(kv.indexOf('=') + 1)]));
    ensure(env.NEXT_PUBLIC_APBM_DATA_MODE === 'real' && env.APBM_BUILD_REVISION === row.candidate, 'Real runtime identity differs');
    ensure(env.MAIL_ALLOWLIST === (app === 'ob' ? email : ''), 'Unexpected runtime mail allowlist');
    ensure(readFileSync(join(QA_ROOT, app, '.next/BUILD_ID'), 'utf8').trim() === row.compiledBuildId, 'Build lineage differs');
    ensure(index.filter(item => item.app === app).every(item => hash(readFileSync(join(QA_ROOT, app, item.path))) === item.sha256),
      'Copied source differs');
  }

  stage = 'read-only pharmacy inventory';
  const pg = createRequire(join(obRepo, 'package.json'))('pg');
  const db = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000, statement_timeout: 15000 });
  const fixtures = {};
  let pharmacy;
  try {
    await db.connect();
    await db.query('begin isolation level repeatable read read only');
    for (const role of roles) {
      const users = (await db.query('select id from auth.users where lower(email) = $1', [cast[role].email.trim().toLowerCase()])).rows;
      ensure(users.length === 1, 'Designated SCRATCH fixture absent or ambiguous');
      const userId = users[0].id;
      const stores = (await db.query(`
        select b.id, b.pharmacy_name as name, a.owner_user_id = $1 as owned,
          case when a.owner_user_id = $1 then 'owner' else ub.role end as capability, ub.role as membership,
          ub.is_primary as primary_membership, b.status
        from public.businesses b join public.accounts a on a.id = b.account_id
        left join public.user_businesses ub on ub.business_id = b.id and ub.user_id = $1
        where (a.owner_user_id = $1 or ub.user_id = $1) and public.store_is_live(b.id)
        order by b.pharmacy_name,b.id`, [userId])).rows;
      ensure(stores.every(s => safePharmacy(s.name)), 'Unexpected pharmacy name format');
      fixtures[role] = { userId, stores };
    }
    ensure(fixtures[invitee].stores.length === 1 && fixtures[invitee].stores[0].owned, 'Invitee baseline differs from ruled fixture');
    ensure(fixtures[member].stores.length === 1 && fixtures[member].stores[0].capability === 'member', 'Member baseline is not one store');
    const known = new Set(fixtures[invitee].stores.map(s => s.id));
    for (const store of fixtures[owner].stores) {
      if (!store.owned || store.status !== 'active' || known.has(store.id)) continue;
      const checks = (await db.query(`
        select public.account_grants_refusal(b.account_id) is null as writable,
          exists(select 1 from public.store_invitations i where i.business_id = b.id and i.email = $2 and i.status = 'pending') as pending
        from public.businesses b where b.id = $1`, [store.id, email])).rows[0];
      if (checks?.writable && !checks.pending) { pharmacy = store; break; }
    }
    ensure(pharmacy, 'No eligible Owner A pharmacy without a pending invite');
    await db.query('rollback');
  } finally {
    await db.end();
  }
  const storeRecord = ({ id, ...store }) => ({ key: hash(id), ...store });
  const baseline = {
    time: time(), planHash, target: auth.servedReport(), branch: 'qa/abm007-final',
    candidates: previous.rows.map(({app, candidate, compiledBuildId}) => ({app, candidate, compiledBuildId})),
    runtime: 'Same verified real processes, compiled build IDs and source hashes. Exact Invitee-only OwedBook allowlist.',
    transaction: 'REPEATABLE READ READ ONLY; rollback',
    method: 'Existing fixtures only. Ownership and membership joined with the deployed live-store predicate.',
    roles: Object.fromEntries(roles.map(role => [role, fixtures[role].stores.map(storeRecord)])),
    invitationPharmacy: storeRecord(pharmacy)
  };
  if (recovery) {
    const before = load(join(out, 'entry-and-before.json'));
    ensure(JSON.stringify(before.roles) === JSON.stringify(baseline.roles) &&
      before.invitationPharmacy.key === baseline.invitationPharmacy.key, 'Fixture baseline changed');
  }
  save(join(out, recovery ? 'entry-and-before-installed-chrome.json' : 'entry-and-before.json'), baseline, 'wx');

  const path = '/api/stores/' + pharmacy.id + '/invitations';
  const exact = (url, body, method) => url.origin === auth.SITES.ob && url.pathname === path && !url.search &&
    method === 'POST' && !!body && Object.keys(body).sort().join(',') === 'email,role' &&
    body.email === email && body.role === 'member';
  const expected = { email, role: 'member' };
  const here = new URL(path, auth.SITES.ob);
  const controls = {
    intendedSendAccepted: exact(here, expected, 'POST'),
    wrongRoleRejected: !exact(here, { email, role: 'admin' }, 'POST'),
    wrongRecipientRejected: !exact(here, { email: 'qa-control@example.invalid', role: 'member' }, 'POST'),
    wrongStoreRejected: !exact(new URL('/api/stores/invalid/invitations', auth.SITES.ob), expected, 'POST'),
    wrongOriginRejected: !exact(new URL(path, auth.SITES.pp), expected, 'POST'),
    extraFieldRejected: !exact(here, { ...expected, extra: true }, 'POST')
  };
  ensure(Object.values(controls).every(Boolean), 'Invitation guard controls failed');
  save(join(out, recovery ? 'invite-guard-controls-installed-chrome.json' : 'invite-guard-controls.json'), { time: time(), controls }, 'wx');

  stage = 'start single Owner A session';
  result = { time: time(), pharmacy: pharmacy.name, pharmacyKey: hash(pharmacy.id), role: 'member',
    recipient: invitee, operator: owner, requests: 0, delivery: 'NOT SENT' };
  save(file, result, 'wx');
  createdAttempt = true;
  const { chromium } = createRequire(join(process.cwd(), 'package.json'))('playwright');
  const browser = await chromium.launch(recovery ? { channel: 'chrome' } : {});
  let ctx;
  const checkpoint = () => save(file, { ...result, auth: auth.counters, sessionDiagnostics: auth.sessionDiagnostics }, 'w');
  try {
    ctx = await browser.newContext();
    const page = await ctx.newPage();
    result.browser = { name: 'chromium', version: browser.version() };
    result.sessionMethod = await auth.signIn(page, 'ob', owner);
    stage = 'verify pharmacy and Member form';
    await page.goto(auth.SITES.ob + '/admin-portal/stores/' + pharmacy.id + '/invite', { waitUntil: 'domcontentloaded' });
    await page.getByText('Send an invite to add someone to ' + pharmacy.name + '.', { exact: true }).waitFor();
    const radio = page.getByRole('radio', { name: 'Member', exact: true });
    ensure(await radio.isChecked(), 'Member role not selected');
    await page.locator('#invite-email').fill(email);
    const send = page.getByRole('button', { name: 'Send invitation', exact: true });
    await send.click({ trial: true, timeout: 15000 });
    await auth.assertServedScratch('ob');
    ensure(auth.servedReport().ob.listener_pid === previous.target.ob.listener_pid, 'OwedBook process changed');
    await page.route('**/api/**/invitations', async route => {
      const req = route.request();
      if (req.method() !== 'POST') return route.continue();
      let body;
      try { body = req.postDataJSON(); } catch { return route.abort(); }
      if (result.requests || !exact(new URL(req.url()), body, req.method())) return route.abort();
      result.requests = 1;
      result.delivery = 'UNKNOWN';
      checkpoint();
      return route.continue();
    });
    stage = 'submit invitation once';
    const [response] = await Promise.all([
      page.waitForResponse(r => r.request().method() === 'POST' && r.url() === here.href, { timeout: 45000 }),
      send.click({ timeout: 15000 })
    ]);
    result.httpStatus = response.status();
    const body = await response.json();
    const delivery = body.data?.delivery;
    result.delivery = ['sent', 'blocked', 'failed', 'refused'].includes(delivery) ? delivery : 'UNKNOWN';
    result.invitationRecorded = !!body.data?.invitationId;
    if (result.invitationRecorded) result.invitationKey = hash(body.data.invitationId);
    result.pending = body.data?.status === 'pending';
    result.attemptsRemaining = Number.isInteger(body.data?.attemptsRemaining) ? body.data.attemptsRemaining : null;
    result.respondedAt = time();
    checkpoint();
    console.log(JSON.stringify({ pharmacy: result.pharmacy, httpStatus: result.httpStatus, delivery: result.delivery, time: result.respondedAt }));
    if (result.delivery === 'sent') {
      result.sentMessageVisible = await page.getByText('Invitation email sent.', { exact: true }).waitFor({ timeout: 4000 }).then(() => true, () => false);
    }
  } finally {
    if (ctx) {
      result.signout = await ctx.request.post(auth.SITES.ob + '/api/auth/logout', { timeout: 6000 }).then(r => r.status(), () => 'UNCONFIRMED');
      await ctx.close();
    }
    await browser.close();
    checkpoint();
  }
}
try {
  await run();
} catch {
  if (createdAttempt) save(file, { ...result, stoppedAt: stage, auth: auth.counters, sessionDiagnostics: auth.sessionDiagnostics }, 'w');
  console.error('J-e stopped at: ' + stage);
  process.exitCode = 1;
}
