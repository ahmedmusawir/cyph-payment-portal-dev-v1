#!/usr/bin/env node
// APBM-007B invitation sends to REAL controlled inboxes through the OwedBook proof server's live staff panel (3100 → SCRATCH).
// cwd: Portal root. Proof servers must have been started with `--mail live` (OwedBook MAIL_ALLOWLIST in memory).
//
//   node scripts/apbm007b/invite-send.mjs --help
//   node scripts/apbm007b/invite-send.mjs --owner-cast /tmp/<o1 cast>.json --o1-state <state.json> --label <run>
//
// OWNER_A (from the O-1 run) signs in to OwedBook, opens the staff panel of store A1, and invites ENGINEERING_MEMBER as a
// member and ENGINEERING_ADMIN as store admin (current admin stays a member). Both addresses have no SCRATCH identity, so this
// is the NEW-invitee path (identity created, sign-in link sent by SCRATCH Supabase Auth — outside the Portal's Resend path).
// One email + one SCRATCH identity are reserved per send before the click. Results record only the UI delivery text, the
// invitation status and role, never the address. Each send is registered for a MANUAL inbox check (no automated inbox access).
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { EVIDENCE_ROOT, PORTAL, scratchTarget } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const ownerCast = JSON.parse(readFileSync(opt('--owner-cast'), 'utf8')).A; const o1 = JSON.parse(readFileSync(opt('--o1-state'), 'utf8')); const label = opt('--label');
if (!/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '')) { console.error('FAIL-CLOSED: --label'); process.exit(2); }
const qa=Object.fromEntries(readFileSync(`${PORTAL}/.env.qa.local`,'utf8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')),l.slice(l.indexOf('=')+1)]));
const cast={NEW_MEMBER:{email:qa.ROLE_NEW_MEMBER_EMAIL},NEW_ADMIN:{email:qa.ROLE_NEW_ADMIN_EMAIL}};
const OB = 'http://localhost:3100'; const I = `INV:${label}`; const store = o1.A.stores[0].id;
const OUT = join(EVIDENCE_ROOT, 'r03', 'INVITE', label); mkdirSync(OUT, { recursive: true });
const req = createRequire(`${PORTAL}/package.json`); const { chromium } = req('playwright'); const { createClient } = req('@supabase/supabase-js');
const sc = scratchTarget(); const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
const results = [];
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1200 } })).newPage();
  await page.route('**/api/auth/logout', (r) => r.abort());
  await page.goto(`${OB}/auth`);
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(ownerCast.email); await page.getByPlaceholder('Please Enter password').fill(ownerCast.password);
  await page.getByRole('button', { name: /log ?in|sign in/i }).first().click(); await page.waitForURL((u) => !u.pathname.startsWith('/auth'), { timeout: 30000 });
  for (const [role, castRole] of [['member', 'NEW_MEMBER'], ['admin', 'NEW_ADMIN']]) {
    const email = cast[castRole].email;
    await page.goto(`${OB}/admin-portal/stores/${store}/invite`);
    await page.getByLabel('Email address').fill(email);
    if (role === 'admin') { await page.getByRole('radio', { name: /Store admin/ }).check(); await page.getByRole('radio', { name: 'Stay as a member' }).check(); }
    const sentAt = new Date().toISOString();
    const signin = reserve(I, 'ownerB browser password sign-in', {});
    const s = reserve(I, `${castRole}: invitation (${role}) via OwedBook staff panel → new identity + sign-in link by SCRATCH Supabase Auth`, { email_dispatch: 1, scratch_auth_identities: 1 });
    await page.getByRole('button', { name: 'Send invitation' }).click();
    const status = page.getByRole('status').first(); await status.waitFor({ timeout: 30000 });
    await page.waitForTimeout(1500);
    const text = (await status.textContent())?.trim();
    const inv = (await db.from('store_invitations').select('id,role,status,dispatch_attempts,former_admin_disposition').eq('business_id', store).eq('email', email.toLowerCase()).order('created_at', { ascending: false }).limit(1).maybeSingle()).data;
    settle(s, { ok: /sent/i.test(text ?? ''), ui: text });
    const r = { role: castRole, invitation_role: inv?.role, invitation_status: inv?.status, dispatch_attempts: inv?.dispatch_attempts, former_admin_disposition: inv?.former_admin_disposition, ui_delivery_text: text, sent_at: sentAt };
    results.push(r); console.log(JSON.stringify(r));
    if (/sent/i.test(text ?? '')) {
      const manual=JSON.parse(readFileSync(qa.QA_MANUAL_OBSERVATIONS_FILE,'utf8'));
      manual.push({id:manual.length+1,role:role==='admin'?'NEW_ADMIN':'NEW_MEMBER',subject:'SCRATCH sign-in / invitation',sent_at:sentAt,invitation_id:inv?.id,status:'AWAITING_GROUPED_DIRECTOR_OBSERVATION',limits:'Human report only; no automated inbox bytes, headers, authentication or exact receipt timestamp observed.'});
      writeFileSync(qa.QA_MANUAL_OBSERVATIONS_FILE,JSON.stringify(manual,null,2),{mode:0o600});
    }
  }
  await page.goto(`${OB}/admin-portal/stores/${store}/invite`); await page.waitForTimeout(2000);
  const shot = join(qa.QA_CAST_FILE.replace(/\/[^/]+$/,''), 'staff_panel_pending-private.png'); await page.screenshot({ path: shot, fullPage: true });
} finally { await browser.close(); }
writeFileSync(join(OUT, 'results.json'), JSON.stringify({ store_role: 'QA live store B1 (OWNER_B)', results, note: 'staff_panel_pending.png shows invitee addresses: excluded from packages unless redacted' }, null, 1));
