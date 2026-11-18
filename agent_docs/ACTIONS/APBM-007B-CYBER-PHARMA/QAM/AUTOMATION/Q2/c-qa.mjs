#!/usr/bin/env node
// APBM-007B check C — product browser journeys for a non-immediate Add Store payment on the proof Portal (3101 → SCRATCH).
// cwd: Portal root. Requires proof servers running. Uses ONE proof owner from fixture-owner.mjs (--cred file, 0600).
//
//   node scripts/apbm007b/c-journeys.mjs --help
//   node scripts/apbm007b/c-journeys.mjs --cred /tmp/<file>.json --label <run> [--only decline|auth]
//
//   decline: default card set to a card that is declined → owner adds a store in the browser → "Payment needs your action"
//            → owner presses "Cancel and don't add this store" → expired_unpaid (you cancelled); invoice void; no store; qty same.
//   auth:    default card requires 3DS → owner adds a store → payment_pending with Stripe's hosted page link → owner follows the
//            link and completes the TEST challenge on Stripe's page → this page shows "has been added"; qty +1, anchor unchanged.
// Every API-side attempt and the hosted submission are reserved in the E2 ledger BEFORE the click that causes them.
// The page is the product page; Stripe's hosted page is Stripe's. Nothing secret is printed; screenshots carry no credentials.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EVIDENCE_ROOT, PORTAL, scratchTarget, scrub } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const credPath = opt('--cred'), label = opt('--label'), only = opt('--only');
if (!/^\/tmp\/[A-Za-z0-9._-]+\.json$/.test(credPath ?? '') || !existsSync(credPath) || !/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '')) { console.error('FAIL-CLOSED: --cred /tmp/<existing>.json --label <run>'); process.exit(2); }
const cred = JSON.parse(readFileSync(credPath, 'utf8'));
const PP = 'http://localhost:3101'; const I = `C:${label}`;
const OUT = join(EVIDENCE_ROOT, 'r03', 'C', label); mkdirSync(OUT, { recursive: true });
const results = existsSync(join(OUT, 'results.json')) ? JSON.parse(readFileSync(join(OUT, 'results.json'), 'utf8')) : {};
const save = () => writeFileSync(join(OUT, 'results.json'), JSON.stringify(results, null, 1));
const req = createRequire(`${PORTAL}/package.json`);
const { chromium } = req('playwright'); const { createClient } = req('@supabase/supabase-js');
const sc = scratchTarget(); const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
const { stripe, read, mutate } = await import('./lib/stripe.mjs');
const npi = () => { for (;;) { const n = String(1000000000 + Math.floor(Math.random() * 899999999)); let s = 0; const d = `80840${n}`; for (let i = 0; i < 15; i++) { let x = Number(d[14 - i]); if (i % 2) { x *= 2; if (x > 9) x -= 9; } s += x; } if (s % 10 === 0) return n; } };
const sub = () => read(I, 'subscription', () => stripe.subscriptions.retrieve(cred.subscription));
async function setDefault(card, tag) {
  const pm = await mutate(I, `attach ${tag}`, { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach(card, { customer: cred.customer }, o), { idem: `apbm007b:c:${label}:${tag}:pm` });
  await mutate(I, `default ${tag}`, { default_card_changes: 1 }, (o) => stripe.customers.update(cred.customer, { invoice_settings: { default_payment_method: pm.id } }, o), { idem: `apbm007b:c:${label}:${tag}:default` });
}
async function startAdd(page, tag) {
  const qa=Object.fromEntries(readFileSync(`${PORTAL}/.env.qa.local`,'utf8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')),l.slice(l.indexOf('=')+1)]));
  const cookie=JSON.parse(readFileSync(qa.QA_CAST_FILE.replace(/\/[^/]+$/,'')+'/portal_role_cookies.json','utf8')).OWNER_A;
  await page.context().addCookies(cookie.split('; ').map(x=>({name:x.slice(0,x.indexOf('=')),value:x.slice(x.indexOf('=')+1),domain:'localhost',path:'/',httpOnly:true,sameSite:'Lax'})));
  await page.goto(`${PP}/stores/add`);
  await page.getByLabel('Pharmacy name').fill(`${label} ${tag}`); await page.getByLabel('NPI').fill(npi());
  await page.getByRole('button', { name: 'See the price' }).click();
  const quote = page.getByTestId('add-store-quote'); await quote.waitFor({ timeout: 30000 });
  const amount = Math.round(Number(/\$([\d,.]+)/.exec(await page.getByTestId('add-store-confirm').textContent())[1].replace(/,/g, '')) * 100);
  for (const b of await quote.getByRole('checkbox').all()) await b.check();
  const prov=await stripe.subscriptions.retrieve(cred.subscription);const clock=await stripe.testHelpers.testClocks.retrieve(prov.test_clock);const item=prov.items.data[0],span=BigInt(item.current_period_end-item.current_period_start);const expected=Number((4900n*BigInt(item.current_period_end-clock.frozen_time)+span/2n)/span);writeFileSync(join(OUT,`${tag}_expected.json`),JSON.stringify({period_start:item.current_period_start,period_end:item.current_period_end,provider_clock_now:clock.frozen_time,expected_cents:expected,source:'QA contract integer arithmetic, no application helper'}));if(amount!==expected)throw new Error('QA expected amount mismatch');
  const seq = reserve(I, `${tag}: product confirm → invoice create/item/finalize + ONE API pay attempt (${amount})`, { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: amount });
  await page.getByTestId('add-store-confirm').click();
  const status = page.getByTestId('add-store-status');
  await status.waitFor({ timeout: 60000 });
  for (let i = 0; i < 40; i++) { const s = await status.getAttribute('data-state'); if (!['payment_setup', 'requested'].includes(s)) break; await page.waitForTimeout(1500); }
  const state = await status.getAttribute('data-state'); settle(seq, { ok: true, state });
  const op = (await db.from('store_operations').select('id,state,invoice_id,amount_cents,business_id').eq('account_id', cred.accountId).order('created_at', { ascending: false }).limit(1).single()).data;
  return { amount, state, op, status };
}
const qBefore = (await sub()).items.data[0].quantity; const anchor = (await sub()).billing_cycle_anchor;
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  if (!only || only === 'decline') {
    await setDefault('pm_card_chargeCustomerFail', 'decline');
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage();
    await page.route('**/api/auth/logout', (r) => r.abort());
    const a = await startAdd(page, 'decline');
    const heading = await a.status.locator('h2').textContent().catch(() => null);
    const hostedLinkShown = await page.getByRole('link', { name: /Complete payment on Stripe/ }).count();
    await page.screenshot({ path: join(OUT, 'decline_payment_pending.png'), fullPage: true });
    const voidReserve=reserve(I,'PRE-reserve product abandonment invoice void',{invoice_void:1});
    await page.getByRole('button', { name: "Cancel and don't add this store" }).click();
    settle(voidReserve,{attempted:true});
    for (let i = 0; i < 40; i++) { if ((await a.status.getAttribute('data-state')) === 'expired_unpaid') break; await page.waitForTimeout(1500); }
    const finalText = await a.status.textContent();
    await page.screenshot({ path: join(OUT, 'decline_abandoned.png'), fullPage: true });
    const op = (await db.from('store_operations').select('state,last_error_code,business_id,invoice_id').eq('id', a.op.id).single()).data;
    const inv = await read(I, 'decline invoice', () => stripe.invoices.retrieve(op.invoice_id));
    results.decline = { quote_cents: a.amount, state_after_confirm: a.state, heading, hosted_link_shown: hostedLinkShown > 0, final_state: op.state, error_code: op.last_error_code, final_text: finalText?.trim(),
      store_created: !!op.business_id, invoice_status: inv.status, amount_paid: inv.amount_paid, quantity_unchanged: (await sub()).items.data[0].quantity === qBefore };
    // Void was reserved before abandonment; never reserve retrospectively.
    save(); console.log('decline', scrub(JSON.stringify(results.decline)));
  }
  if (!only || only === 'auth') {
    await setDefault('pm_card_authenticationRequired', 'auth');
    const page = await (await browser.newContext({ viewport: { width: 1280, height: 1400 }, locale: 'en-US' })).newPage();
    await page.route('**/api/auth/logout', (r) => r.abort());
    const a = await startAdd(page, 'auth');
    const link = page.getByRole('link', { name: /Complete payment on Stripe/ });
    await link.waitFor({ timeout: 30000 });
    await page.screenshot({ path: join(OUT, 'auth_payment_pending.png'), fullPage: true });
    const href = await link.getAttribute('href'); const productUrl = page.url();
    await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const confirm = page.getByRole('button', { name: /Confirm payment|^Pay\b/i }).first(); await confirm.waitFor({ timeout: 30000 }); await page.waitForTimeout(3000);
    const seq = reserve(I, `auth: BROWSER hosted invoice submission + 3DS test challenge (${a.amount})`, { invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: a.amount, subscription_mutations: 1 });
    await confirm.click(); let clicked = false;
    for (let i = 0; i < 45 && !clicked; i++) {
      await page.waitForTimeout(1000);
      for (const f of page.frames()) { const b = f.locator('#test-source-authorize-3ds'); if (!(await b.count().catch(() => 0))) continue;
        if (!(await b.first().isVisible().catch(() => false)) || !(await b.first().isEnabled().catch(() => false))) continue;
        await page.waitForTimeout(2500); try { await b.first().click({ timeout: 5000 }); clicked = true; } catch { /* not bound yet */ } break; }
    }
    if (clicked) { await page.waitForTimeout(6000); for (const f of page.frames()) { const b = f.locator('#test-source-authorize-3ds'); if (await b.first().isVisible().catch(() => false)) { await b.first().click({ timeout: 5000 }).catch(() => {}); break; } } }
    let invStatus = null; for (let i = 0; i < 30; i++) { await page.waitForTimeout(2000); invStatus = (await stripe.invoices.retrieve(a.op.invoice_id)).status; if (invStatus === 'paid') break; }
    settle(seq, { ok: invStatus === 'paid', challenge_clicked: clicked });
    await page.screenshot({ path: join(OUT, 'auth_hosted_after.png') });
    await page.goto(`${productUrl.split('?')[0]}?operation=${a.op.id}`);
    // The product page resumes the operation from the server; if it does not, the dashboard is the destination of record.
    const op = await (async () => { for (let i = 0; i < 40; i++) { const o = (await db.from('store_operations').select('state,business_id').eq('id', a.op.id).single()).data; if (o.state === 'activated') return o; await new Promise((r) => setTimeout(r, 2000)); } return (await db.from('store_operations').select('state,business_id').eq('id', a.op.id).single()).data; })();
    await page.goto(`${PP}/dashboard`); await page.waitForLoadState('networkidle');
    const storeVisible = await page.getByText(`${label} auth`).count();
    await page.screenshot({ path: join(OUT, 'auth_dashboard.png'), fullPage: true });
    const s = await sub();
    results.auth = { quote_cents: a.amount, state_after_confirm: a.state, hosted_link_shown: true, challenge_clicked: clicked, invoice_status: invStatus, final_state: op.state, store_created: !!op.business_id,
      dashboard_shows_store: storeVisible > 0, quantity: { before: qBefore, after: s.items.data[0].quantity }, anchor_unchanged: s.billing_cycle_anchor === anchor };
    save(); console.log('auth', scrub(JSON.stringify(results.auth)));
  }
} finally { await browser.close(); }
