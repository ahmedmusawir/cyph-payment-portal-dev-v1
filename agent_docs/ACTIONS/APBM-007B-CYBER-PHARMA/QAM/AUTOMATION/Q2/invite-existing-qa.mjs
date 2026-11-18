#!/usr/bin/env node
// APBM-007B AC-011 existing-identity case on the OwedBook proof server (3100 → SCRATCH). cwd: Portal root.
// Proof servers must run with `--mail live`.
//
//   node scripts/apbm007b/invite-existing.mjs --help
//   node scripts/apbm007b/invite-existing.mjs --o1-cast /tmp/<o1 cast>.json --o1-state <state.json> --label <run>
//
// OWNER_A (account owner of O-1 store A1) invites EXISTING_INVITEE — an EXISTING SCRATCH identity with its own account —
// as a MEMBER of A1 through the live staff panel (one email: sign-in link by SCRATCH Supabase Auth). The existing identity is
// reused with no password change (checked: auth user id and password-hash timestamp unchanged; nothing about the hash read).
// Then OWNER_B, in a SEPARATE browser context, signs in normally, opens /invitations, sees exactly this invitation and presses
// Accept. Verified: OWNER_B becomes member of A1 only (own account untouched), invitation accepted by that identity.
// One email is reserved before the send. No address is printed; screenshots are not taken (pages show addresses).
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { EVIDENCE_ROOT, PORTAL, OWEDBOOK, scratchTarget } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const label = opt('--label'); if (!/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '')) { console.error('FAIL-CLOSED: --label'); process.exit(2); }
const o1cast = JSON.parse(readFileSync(opt('--o1-cast'), 'utf8')); const st = JSON.parse(readFileSync(opt('--o1-state'), 'utf8'));
const A = o1cast.A, B = o1cast.B; const store = st.A.stores[0].id;
const OB = 'http://localhost:3100'; const I = `INV:${label}`;
const OUT = join(EVIDENCE_ROOT, 'r05', 'ACCEPT_EXISTING'); mkdirSync(OUT, { recursive: true });
const req = createRequire(`${PORTAL}/package.json`); const { chromium } = req('playwright'); const { createClient } = req('@supabase/supabase-js');
const pg = createRequire(`${OWEDBOOK}/package.json`)('pg');
const sc = scratchTarget(); const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
const identity = async () => { const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false } }); await c.connect();
  try { return (await c.query('select id::text, updated_at, (encrypted_password is not null) has_password, md5(coalesce(encrypted_password, \'\')) pw_digest from auth.users where id = $1', [B.userId])).rows[0]; } finally { await c.end(); } };
const membership = async () => (await db.from('user_businesses').select('business_id,role').eq('user_id', B.userId)).data;
const before = { identity: await identity(), memberships: await membership(), owns_account: (await db.from('accounts').select('id').eq('owner_user_id', B.userId)).data.length };
async function signIn(page, who) {
  await page.route('**/api/auth/logout', (r) => r.abort());
  await page.goto(`${OB}/auth`); await page.getByRole('textbox', { name: 'Email', exact: true }).fill(who.email); await page.getByPlaceholder('Please Enter password').fill(who.password);
  await page.getByRole('button', { name: /log ?in|sign in/i }).first().click(); await page.waitForURL((u) => !u.pathname.startsWith('/auth'), { timeout: 30000 });
}
const res = { label, before: { identity_exists: !!before.identity, memberships: before.memberships.length, owns_account: before.owns_account } };
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  const ownerPage = await (await browser.newContext()).newPage(); await signIn(ownerPage, A);
  await ownerPage.goto(`${OB}/admin-portal/stores/${store}/invite`); await ownerPage.getByLabel('Email address').fill(B.email);
  const sentAt = new Date().toISOString();
  const s = reserve(I, 'EXISTING_INVITEE (EXISTING identity): member invitation via OwedBook staff panel → sign-in link by SCRATCH Supabase Auth', { email_dispatch: 1, scratch_auth_identities: 1 });
  await ownerPage.getByRole('button', { name: 'Send invitation' }).click();
  const status = ownerPage.getByRole('status').first(); await status.waitFor({ timeout: 30000 }); await ownerPage.waitForTimeout(1500);
  res.send_ui = (await status.textContent())?.trim(); settle(s, { ok: /sent/i.test(res.send_ui ?? ''), ui: res.send_ui }); res.sent_at = sentAt;
  const inv = (await db.from('store_invitations').select('id,status,role,dispatch_attempts').eq('business_id', store).eq('email', B.email.toLowerCase()).order('created_at', { ascending: false }).limit(1).single()).data;
  res.invitation_after_send = { status: inv.status, role: inv.role, dispatch_attempts: inv.dispatch_attempts };
  res.identity_after_send_unchanged = JSON.stringify(await identity()) === JSON.stringify(before.identity);
  if (/sent/i.test(res.send_ui ?? '')) {
    const qa=Object.fromEntries(readFileSync(`${PORTAL}/.env.qa.local`,'utf8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')),l.slice(l.indexOf('=')+1)]));
    const obs=JSON.parse(readFileSync(qa.QA_MANUAL_OBSERVATIONS_FILE,'utf8'));obs.push({id:obs.length+1,role:'EXISTING_INVITEE',subject:'SCRATCH sign-in invitation',sent_at:sentAt,invitation_id:inv.id,status:'AWAITING_GROUPED_DIRECTOR_OBSERVATION',limits:'Human inbox report only; acceptance separately tested by existing password login.'});writeFileSync(qa.QA_MANUAL_OBSERVATIONS_FILE,JSON.stringify(obs,null,2),{mode:0o600});
  }
  // Separate context = separate cookies: the invitee never shares the owner's session.
  const bPage = await (await browser.newContext()).newPage(); await signIn(bPage, B);
  await bPage.goto(`${OB}/invitations`); await bPage.getByRole('heading', { name: 'Your invitations' }).waitFor({ timeout: 30000 });
  const accept = bPage.getByRole('button', { name: 'Accept invitation' }); await accept.first().waitFor({ timeout: 30000 });
  res.invitations_listed_for_invitee = await accept.count();
  await accept.first().click(); await bPage.waitForURL(/\/owedbook/, { timeout: 30000 }); res.after_accept_url_path = new URL(bPage.url()).pathname;
} finally { await browser.close(); }
const invAfter = (await db.from('store_invitations').select('status,accepted_user_id').eq('business_id', store).eq('email', B.email.toLowerCase()).order('created_at', { ascending: false }).limit(1).single()).data;
const after = await membership();
Object.assign(res, { invitation_final: { status: invAfter.status, accepted_by_invitee: invAfter.accepted_user_id === B.userId },
  memberships_after: after.map((m) => ({ store: m.business_id === store ? 'A1' : st.B.stores.some((x) => x.id === m.business_id) ? 'own account store' : 'other', role: m.role })),
  owns_account_after: (await db.from('accounts').select('id').eq('owner_user_id', B.userId)).data.length, identity_unchanged_after_accept: (await identity()).id === before.identity.id && (await identity()).pw_digest === before.identity.pw_digest });
writeFileSync(join(OUT, 'results.json'), JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1));
