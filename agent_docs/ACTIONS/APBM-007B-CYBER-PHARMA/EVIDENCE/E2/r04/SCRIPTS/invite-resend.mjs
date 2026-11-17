#!/usr/bin/env node
// APBM-007B — the NORMAL Resend of one pending invitation through the OwedBook proof server's staff panel (3100 → SCRATCH).
// cwd: Portal root. Proof servers must run with `--mail live`.
//
//   node scripts/apbm007b/invite-resend.mjs --help
//   node scripts/apbm007b/invite-resend.mjs --owner-cast /tmp/<o1 cast>.json --o1-state <state.json> --role ENGINEERING_MEMBER|ENGINEERING_ADMIN --label <run> --why <text>
//
// OWNER_A signs in, opens store A1's staff panel and presses "Resend" on that role's pending invitation. One email is reserved
// before the click. Also records the provider's one-time sign-in token RECORD for that identity before/after (count and
// timestamps only — the token value is never selected), to show the newer link replaced the older one. No address is printed.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { EVIDENCE_ROOT, PORTAL, OWEDBOOK, scratchTarget } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const role = opt('--role'), label = opt('--label'), why = opt('--why');
if (!['ENGINEERING_MEMBER', 'ENGINEERING_ADMIN'].includes(role) || !/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '') || !why) { console.error('FAIL-CLOSED: --role, --label, --why'); process.exit(2); }
const owner = JSON.parse(readFileSync(opt('--owner-cast'), 'utf8')).A; const o1 = JSON.parse(readFileSync(opt('--o1-state'), 'utf8'));
const email = JSON.parse(readFileSync(`${homedir()}/.apbm007b/engineering_cast.json`, 'utf8'))[role].email.toLowerCase();
const OB = 'http://localhost:3100'; const store = o1.A.stores[0].id; const I = `INV:${label}`;
const OUT = join(EVIDENCE_ROOT, 'r04', 'ACCEPT'); mkdirSync(OUT, { recursive: true });
const req = createRequire(`${PORTAL}/package.json`); const { chromium } = req('playwright'); const { createClient } = req('@supabase/supabase-js');
const pg = createRequire(`${OWEDBOOK}/package.json`)('pg');
const sc = scratchTarget(); const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
async function tokenRecord() {
  const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false } }); await c.connect();
  try { return (await c.query(`select t.token_type::text as type, t.created_at, t.updated_at from auth.one_time_tokens t join auth.users u on u.id = t.user_id where lower(u.email) = $1 order by t.created_at`, [email])).rows; }
  catch (e) { return { error: e.code }; } finally { await c.end(); }
}
const inv = async () => (await db.from('store_invitations').select('status,dispatch_attempts,last_sent_at').eq('business_id', store).eq('email', email).eq('status', 'pending').maybeSingle()).data;
const before = { invitation: await inv(), token_record: await tokenRecord() };
if (!before.invitation) { console.error('FAIL-CLOSED: no pending invitation for that role'); process.exit(2); }
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
let text = null; const at = new Date().toISOString();
try {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1200 } })).newPage();
  await page.route('**/api/auth/logout', (r) => r.abort());
  await page.goto(`${OB}/auth`);
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(owner.email); await page.getByPlaceholder('Please Enter password').fill(owner.password);
  await page.getByRole('button', { name: /log ?in|sign in/i }).first().click(); await page.waitForURL((u) => !u.pathname.startsWith('/auth'), { timeout: 30000 });
  await page.goto(`${OB}/admin-portal/stores/${store}/invite`);
  const row = page.getByRole('listitem').filter({ hasText: email }); await row.waitFor({ timeout: 30000 });
  const s = reserve(I, `${role}: Resend (normal staff-panel flow) — ${why}`, { email_dispatch: 1 });
  await row.getByRole('button', { name: 'Resend' }).click();
  const status = page.getByRole('status').first(); await status.waitFor({ timeout: 30000 }); await page.waitForTimeout(1500);
  text = (await status.textContent())?.trim(); settle(s, { ok: /sent/i.test(text ?? ''), ui: text });
} finally { await browser.close(); }
await new Promise((r) => setTimeout(r, 2000));
const result = { role, why, at, ui_delivery_text: text, before, after: { invitation: await inv(), token_record: await tokenRecord() } };
const P = join(OUT, 'resends.json'); const all = existsSync(P) ? JSON.parse(readFileSync(P, 'utf8')) : []; all.push(result); writeFileSync(P, JSON.stringify(all, null, 1));
console.log(JSON.stringify(result));
