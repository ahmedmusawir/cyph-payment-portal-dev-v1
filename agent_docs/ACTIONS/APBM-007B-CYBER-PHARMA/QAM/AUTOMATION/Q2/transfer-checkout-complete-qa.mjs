#!/usr/bin/env node
// APBM-007B check E — complete the ONE already-open registration Checkout session (no new registration, customer or session).
// cwd: Portal root.
//
//   node scripts/apbm007b/e-checkout-complete.mjs --help
//   node scripts/apbm007b/e-checkout-complete.mjs --session-file /tmp/<f>.json --label <run> --seq <ledger seq of the register reservation>
//
// The session file (0600, written by Engineering from the provider read; holds the session id/url only) points at the buyer's
// open Checkout session. Chooses "Card", enters test card 4242, leaves "save my information" (Link) unticked, presses Subscribe
// once, and waits for Stripe to return to the proof Portal's /register/activation. The single hosted submission was already
// reserved by e-transfer.mjs (that ledger seq is settled here; nothing is reserved twice). Screenshots are taken only of the
// product page; Stripe's page shows the buyer address and is not captured. Marks phase `register` done in the E state file.
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EVIDENCE_ROOT, PORTAL } from './lib/env.mjs';
import { settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const sf = opt('--session-file'), label = opt('--label'), seq = Number(opt('--seq'));
if (!/^\/tmp\/[A-Za-z0-9._-]+\.json$/.test(sf ?? '') || !existsSync(sf) || !/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '') || !Number.isInteger(seq)) { console.error('FAIL-CLOSED: --session-file, --label, --seq'); process.exit(2); }
const { url, id } = JSON.parse(readFileSync(sf, 'utf8'));
const OUT = join(EVIDENCE_ROOT, 'r03', 'E', label); const STATE = join(OUT, 'state.json'); const st = JSON.parse(readFileSync(STATE, 'utf8'));
if (st.done.includes('register')) { console.error('FAIL-CLOSED: register already done'); process.exit(2); }
const req = createRequire(`/tmp/apbm007b-qa-q2-01/proof/pp/package.json`); const { chromium } = req('playwright');
const { stripe } = await import('./lib/stripe.mjs');
const s0 = await stripe.checkout.sessions.retrieve(id);
if (s0.status !== 'open' || s0.payment_status !== 'unpaid' || s0.amount_total !== 9900 || s0.currency !== 'usd') { console.error(`FAIL-CLOSED: session not open/unpaid USD 9900 (${s0.status}/${s0.payment_status})`); process.exit(2); }
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
let returned = false, submitted = false;
try {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1300 }, locale: 'en-US' })).newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // The accordion's button is a 0×0 accessibility element: trigger it directly; fall back to the visible "Card" row.
  const card = page.locator('[data-testid="card-accordion-item-button"]'); await card.waitFor({ state: 'attached', timeout: 45000 });
  await page.waitForTimeout(2000);
  await card.dispatchEvent('click');
  if (!(await page.locator('#cardNumber').isVisible().catch(() => false))) { await page.waitForTimeout(2000); if (!(await page.locator('#cardNumber').isVisible().catch(() => false))) await page.getByText('Card', { exact: true }).first().click(); }
  await page.locator('#cardNumber').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('#cardNumber').fill('4242424242424242'); await page.locator('#cardExpiry').fill('12 / 34'); await page.locator('#cardCvc').fill('123');
  if (await page.locator('#billingName').isVisible().catch(() => false)) await page.locator('#billingName').fill('Engineering Buyer');
  if (await page.locator('#billingCountry').isVisible().catch(() => false)) await page.locator('#billingCountry').selectOption('US').catch(() => {});
  if (await page.locator('#billingPostalCode').isVisible().catch(() => false)) await page.locator('#billingPostalCode').fill('12207');
  const link = page.locator('#enableStripePass'); if (await link.isChecked().catch(() => false)) await link.uncheck();
  await page.waitForTimeout(1500);
  await page.locator('[data-testid="hosted-payment-submit-button"]').click(); submitted = true;
  await page.waitForURL(/localhost:3101\/register\/activation/, { timeout: 90000 }); returned = true;
  await page.waitForTimeout(2000);
  st.registerHeading = await page.getByRole('heading', { level: 1 }).textContent().catch(() => null);
  await page.screenshot({ path: '/tmp/apbm007b-qa-q2-01/activation_first-private.png', fullPage: true });
} catch (e) { console.error(`step failed: ${e.name} ${String(e.message).split('\n')[0]}`); }
finally { await browser.close(); }
const s1 = await stripe.checkout.sessions.retrieve(id);
settle(seq, { ok: s1.payment_status === 'paid', submitted, returned, session_status: s1.status, payment_status: s1.payment_status, note: 'completed the same open session (first run stopped before card entry; nothing had been submitted)' });
if (s1.payment_status === 'paid') {
  st.done.push('register');
  st.log.push({ step: 'register', at: new Date().toISOString(), due_today: '$99.00', checkout: { status: s1.status, payment_status: s1.payment_status, amount_total: s1.amount_total, currency: s1.currency }, returned_to: returned ? '/register/activation' : null, heading: st.registerHeading,
    note: 'first browser run reached Checkout and stopped before card entry (card choice not yet rendered); the same session was completed once by e-checkout-complete.mjs' });
  writeFileSync(STATE, JSON.stringify(st, null, 1));
}
console.log(JSON.stringify({ submitted, returned, session_status: s1.status, payment_status: s1.payment_status, heading: st.registerHeading ?? null }));
