import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { scratchTarget, sqlRef, stripeTarget } from '../../../../../../scripts/apbm007b/lib/env.mjs';
import { assertServedScratch, servedReport } from './auth.mjs';
import { role as assertRole, target } from './guards.mjs';

const q = 'agent_docs/ACTIONS/ABM007_FINAL/QAM';
const out = join(q, 'evidence/Q2/26/billing-customer-read.json');
const ob = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev';
const roles = ['ENGINEERING_OWNER_A', 'ENGINEERING_INVITEE'];
const prior = JSON.parse(readFileSync(join(q, 'evidence/Q2/J-e/entry-and-before-installed-chrome.json')));
const sc = scratchTarget();
const sandbox = stripeTarget();
target(sc.ref, sqlRef(sc.dbUrl));
const report = { time: new Date().toISOString(), target: sc.ref, providerReads: [], fixtures: [], providerWrites: 0,
  scope: 'Read-only SCRATCH transaction for the records the candidate selects, followed by Stripe sandbox GETs only. No customer identifiers, keys, addresses or provider bodies retained.' };
const ensure = (condition, message) => { if (!condition) throw Error(message); };
const allowedCodes = new Set(['resource_missing','api_key_expired','account_invalid','permission_missing',
  'secret_key_required','invalid_api_key','rate_limit','lock_timeout','invalid_request_error']);
const allowedErrorTypes = new Set(['invalid_request_error','api_error','authentication_error','permission_error','rate_limit_error']);
const safeError = (data, status) => ({
  status,
  code: allowedCodes.has(data?.error?.code) ? data.error.code : null,
  type: allowedErrorTypes.has(data?.error?.type) ? data.error.type : null
});
async function get(path, label) {
  const validPath = path === '/v1/account' || /^\/v1\/customers\/cus_[A-Za-z0-9]+$/.test(path);
  ensure(validPath, 'Provider path outside approved GET allowlist');
  let response;
  try {
    const r = await fetch('https://api.stripe.com' + path, { method: 'GET', redirect: 'error',
      headers: { Authorization: 'Bearer ' + sandbox.STRIPE_SECRET_KEY, 'Stripe-Version':'2026-04-22.dahlia' },
      signal: AbortSignal.timeout(10000) });
    const data = await r.json().catch(() => null);
    response = { ok: r.ok, data, status: r.status };
  } catch (e) {
    const code = e.cause?.code;
    const transport = ['ENOTFOUND','EAI_AGAIN','ECONNREFUSED','ECONNRESET','ETIMEDOUT','UND_ERR_CONNECT_TIMEOUT',
      'UNABLE_TO_VERIFY_LEAF_SIGNATURE','CERT_HAS_EXPIRED'].includes(code) ? code :
      (e.name === 'TimeoutError' ? 'TIMEOUT' : 'FAILED_BEFORE_RESPONSE');
    response = { ok: false, data: null, status: null, transport };
  }
  report.providerReads.push({ label, method: 'GET', ...safeError(response.data,response.status),
    ...(response.transport ? { transport: response.transport } : {}) });
  return response;
}

try {
  await assertServedScratch('pp');
  const pid = servedReport().pp.listener_pid;
  ensure(pid === prior.target.pp.listener_pid, 'QA Portal process changed');
  const rev = execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  ensure(rev === prior.candidates.find(x => x.app === 'pp').candidate, 'Portal candidate differs');
  const env = Object.fromEntries(readFileSync('/proc/' + pid + '/environ','utf8').split('\0').filter(Boolean)
    .map(s=>[s.slice(0,s.indexOf('=')),s.slice(s.indexOf('=')+1)]));
  ensure(env.STRIPE_SECRET_KEY === sandbox.STRIPE_SECRET_KEY && env.STRIPE_EXPECTED_ACCOUNT === sandbox.STRIPE_EXPECTED_ACCOUNT,
    'Runtime sandbox differs from verified configuration');
  const castPath = join(homedir(), '.apbm007b/engineering_cast.json');
  ensure((statSync(castPath).mode & 0o077) === 0, 'Cast permissions too broad');
  const cast = JSON.parse(readFileSync(castPath, 'utf8'));
  const pg = createRequire(join(ob, 'package.json'))('pg');
  const db = new pg.Client({connectionString:sc.dbUrl,ssl:{rejectUnauthorized:false},connectionTimeoutMillis:15000,statement_timeout:15000});
  const selected = new Map();
  try {
    await db.connect();
    await db.query('begin isolation level repeatable read read only');
    for (const role of roles) {
      assertRole(role);
      const u = (await db.query('select id from auth.users where lower(email) = $1', [cast[role].email.trim().toLowerCase()])).rows;
      ensure(u.length === 1, 'Designated SCRATCH fixture absent or ambiguous');
      const a = (await db.query('select id from public.accounts where owner_user_id = $1 order by created_at,id limit 1', [u[0].id])).rows[0];
      const s = a ? (await db.query(`
        select origin, status, stripe_customer_id, stripe_subscription_id
        from public.subscriptions where account_id = $1
        order by (status is distinct from 'canceled') desc, created_at desc, id limit 1`, [a.id])).rows[0] : null;
      const validCustomer = /^cus_[A-Za-z0-9]+$/.test(s?.stripe_customer_id ?? '');
      const row = { role, ownsAccount: !!a, selectedSubscriptionOrigin: s?.origin ?? null,
        subscriptionStatus: s?.status ?? null, customerLinkPresent: !!s?.stripe_customer_id, customerLinkWellFormed: validCustomer,
        subscriptionLinkPresent: !!s?.stripe_subscription_id, sandboxCustomer: validCustomer ? 'NOT CHECKED' : 'NO USABLE CUSTOMER LINK' };
      report.fixtures.push(row);
      if (validCustomer) selected.set(role,s.stripe_customer_id);
    }
    await db.query('rollback');
  } finally {
    await db.end();
  }
  if (selected.size) {
    const account = await get('/v1/account', 'Sandbox account guard');
    report.sandboxAccountMatches = account.ok && account.data?.id === sandbox.STRIPE_EXPECTED_ACCOUNT;
    if (report.sandboxAccountMatches) {
      for (const row of report.fixtures) {
        const id = selected.get(row.role);
        if (!id) continue;
        const r = await get('/v1/customers/' + id, row.role);
        row.sandboxCustomer = r.ok && r.data?.id === id && r.data?.deleted === true ? 'DELETED' :
          r.ok && r.data?.id === id && r.data?.object === 'customer' && r.data?.livemode === false ? 'EXISTS IN VERIFIED SANDBOX' :
          r.status === 404 && r.data?.error?.code === 'resource_missing' ? 'MISSING IN VERIFIED SANDBOX' :
          'UNKNOWN: READ DID NOT ESTABLISH EXISTENCE';
      }
    }
  }
} catch {
  report.stopped = 'Read-only diagnostic stopped at a guard or query. No write or session opening was attempted.';
  process.exitCode = 1;
}
writeFileSync(out, JSON.stringify(report, null, 2) + '\n', {flag:'wx'});
console.log(JSON.stringify(report));
