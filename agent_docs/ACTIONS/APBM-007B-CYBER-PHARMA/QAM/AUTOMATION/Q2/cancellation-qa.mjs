#!/usr/bin/env node
// APBM-007B checks G and F on the proof pair (3101 → SCRATCH), using ONE existing proof owner (fixture-owner --cred, 0600).
// cwd: Portal root.
//
//   node scripts/apbm007b/gf-checks.mjs --help
//   node scripts/apbm007b/gf-checks.mjs --cred /tmp/<file>.json --label <run> [--only g|f-transfer|f-owner]
//
//   g:          007A regression — owner opens Stripe's Billing Portal from "Manage billing", cancels at period end, returns;
//               the cancel event is delivered (signed, like a listener); dashboard shows the schedule and Add Store is refused;
//               owner presses "Undo cancellation"; schedule cleared in Stripe and in the mirror; Add Store quote allowed again.
//   f-transfer: operator store-transfer-authorize (synthetic buyer email, nothing is sent) → seller quantity −1 → operator
//               store-transfer-cancel → quantity restored; NPI hold released back to the seller's store.
//   f-owner:    operator owner-replace to a NEW synthetic SCRATCH identity (no account) → database owner changed → provider
//               step: the mapped customer's email follows the new owner (test mode; Stripe sends nothing). Run LAST: the old
//               owner credential no longer owns the account afterwards.
// Effects are reserved in the E2 ledger before each call. No secret or address is printed.
import { createHash, createHmac, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EVIDENCE_ROOT, PORTAL, scratchTarget, loadNamed, scrub } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const credPath = opt('--cred'), label = opt('--label'), only = opt('--only');
if (!/^\/tmp\/[A-Za-z0-9._-]+\.json$/.test(credPath ?? '') || !existsSync(credPath) || !/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '')) { console.error('FAIL-CLOSED: --cred /tmp/<existing>.json --label <run>'); process.exit(2); }
const cred = JSON.parse(readFileSync(credPath, 'utf8'));
const PP = 'http://localhost:3101'; const I = `GF:${label}`;
const OUT = join(EVIDENCE_ROOT, 'r03', 'GF', label); mkdirSync(OUT, { recursive: true });
const RES = join(OUT, 'results.json'); const results = existsSync(RES) ? JSON.parse(readFileSync(RES, 'utf8')) : {};
const save = () => writeFileSync(RES, JSON.stringify(results, null, 1));
const req = createRequire(`/tmp/apbm007b-qa-q2-01/proof/pp/package.json`);
const { chromium } = req('playwright'); const { createClient } = req('@supabase/supabase-js');
const sc = scratchTarget(); const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
const { stripe, read } = await import('./lib/stripe.mjs');
// Automatic CLI observations only; no manual signer.
const opToken = createHash('sha256').update(`${sc.secretKey}:apbm007a-operator-v1`).digest('hex');
const operator = async (body) => (await (await fetch(`${PP}/api/operator/007b`, { method: 'POST', headers: { Authorization: `Bearer ${opToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json());
const sub = () => read(I, 'subscription', () => stripe.subscriptions.retrieve(cred.subscription));
const T = { actor: 'Claudy (engineering)', ticket: 'APBM007B-E2-F' };
async function deliver(since) {
  const events=[];for await(const event of stripe.events.list({created:{gte:since},limit:100})){const o=event.data.object;const customer=typeof o.customer==='string'?o.customer:o.customer?.id;if(customer===cred.customer&&event.type==='customer.subscription.updated')events.push(event);}
  const out=[];for(const event of events){let row;for(let i=0;i<30;i++){row=(await db.from('stripe_events').select('status,error_code').eq('event_id',event.id).maybeSingle()).data;if(row?.status==='processed')break;await new Promise(r=>setTimeout(r,1000));}out.push({event_id:event.id,type:event.type,receipt:row,delivery_lane:'automatic Stripe CLI'});}return out;
}
async function signedIn(browser) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1200 }, locale: 'en-US' })).newPage();
  await page.route('**/api/auth/logout', (r) => r.abort());
  await page.goto(`${PP}/login`); await page.getByLabel('Work email').fill(cred.email); await page.getByRole('textbox', { name: 'Password' }).fill(cred.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click(); await page.waitForURL(/\/dashboard$/, { timeout: 30000 });
  return page;
}
const quoteStatus = async (page) => page.evaluate(async () => { const r = await fetch('/api/stores/add/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storeName: 'GF quote probe', npi: '1234567893' }) }); const b = await r.json().catch(() => ({})); return `${r.status}:${b.reason ?? b.error ?? 'ok'}`; });

if (!only || only === 'g') {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await signedIn(browser); const since = Math.floor(Date.now() / 1000) - 5;
    await page.goto(`${PP}/billing`);   // "Manage billing" lives on the billing page
    const portalReservation=reserve(I,'owner creates Stripe Billing Portal session',{subscription_mutations:1});
    await page.getByTestId('manage-billing').first().click();
    settle(portalReservation,{attempted:true});
    await page.waitForURL(/billing\.stripe\.com/, { timeout: 60000 });
    const s = reserve(I, 'G: owner cancels at period end in Stripe Billing Portal', { subscription_mutations: 1 });
    await page.locator('[data-test="cancel-subscription"], a:has-text("Cancel subscription"), button:has-text("Cancel subscription")').first().click({ timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.locator('[data-testid="confirm"], button:has-text("Cancel subscription")').last().click({ timeout: 30000 });
    await page.waitForTimeout(3000);
    const skip = page.getByRole('button', { name: /No thanks|Skip/i }); if (await skip.count()) await skip.first().click().catch(() => {});
    await page.screenshot({ path: join(OUT, 'g_portal_after_cancel.png') });
    let s1 = await sub(); for (let i = 0; i < 10 && !s1.cancel_at_period_end && !s1.cancel_at; i++) { await page.waitForTimeout(2000); s1 = await sub(); }
    settle(s, { ok: !!(s1.cancel_at_period_end || s1.cancel_at) });
    const delivered1 = await deliver(since);
    await page.goto(`${PP}/billing`); const undo = page.getByTestId('undo-cancel'); await undo.waitFor({ timeout: 30000 });
    const quoteWhileScheduled = await quoteStatus(page);
    await page.screenshot({ path: join(OUT, 'g_dashboard_cancel_scheduled.png'), fullPage: true });
    const u = reserve(I, 'G: owner presses Undo cancellation (one or two subscription updates)', { subscription_mutations: 2 });
    await undo.click(); await page.waitForTimeout(4000);
    const s2 = await sub(); settle(u, { ok: !s2.cancel_at_period_end && !s2.cancel_at });
    const mirror = (await db.from('subscriptions').select('status,cancel_at_period_end,cancel_at').eq('account_id', cred.accountId).single()).data;
    await page.reload(); await page.waitForLoadState('networkidle');
    const undoGone = (await page.getByTestId('undo-cancel').count()) === 0;
    const quoteAfter = await quoteStatus(page);
    await page.screenshot({ path: join(OUT, 'g_dashboard_after_undo.png'), fullPage: true });
    results.g = { cancel_scheduled_in_stripe: !!(s1.cancel_at_period_end || s1.cancel_at), events_delivered: delivered1, dashboard_showed_undo: true, add_store_quote_while_scheduled: quoteWhileScheduled,
      after_undo_stripe: { cancel_at_period_end: s2.cancel_at_period_end, cancel_at: s2.cancel_at, status: s2.status }, mirror_after_undo: mirror, undo_control_gone: undoGone, add_store_quote_after_undo: quoteAfter };
    save(); console.log('g', scrub(JSON.stringify(results.g)));
  } finally { await browser.close(); }
}
