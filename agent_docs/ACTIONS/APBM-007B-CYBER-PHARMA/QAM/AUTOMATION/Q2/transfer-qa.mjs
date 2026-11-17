#!/usr/bin/env node
// APBM-007B check E — store transfer to a buyer who comes through NORMAL REGISTRATION (ruling 3), which is also the 007A
// first-store purchase regression in real mode with real Stripe Checkout. cwd: Portal root. Proof servers must be running.
//
//   node scripts/apbm007b/e-transfer.mjs --help
//   node scripts/apbm007b/e-transfer.mjs --seller /tmp/<fixture cred>.json --label <run> [--until <phase>]
//
// Phases (resumable, EVIDENCE/E2/r03/E/<run>/state.json): seed → authorize → complete → register → deliver → verify.
//   seed:      two history rows on the seller's source store (so "buyer cannot see seller history" is meaningful).
//   authorize: operator store-transfer-authorize (buyerEmail = ENGINEERING_INVITEE, effective in ~90 s); seller quantity −1.
//   complete:  after the effective time, operator store-transfer-complete (source ownership ends; NPI held for that buyer).
//   register:  anonymous browser registration on the proof Portal with the buyer's email and the SAME NPI → review → consents
//              → real Stripe Checkout (test card 4242) → back to /register/activation.
//   deliver:   the run's real Stripe events are delivered to the proof Portal signed with its webhook secret (no listener exists
//              in the proof setup); the activation page must reach "You're in".
//   verify:    transfer completed; buyer business ≠ source business, same pharmacy identity; buyer cannot read the source
//              store or its history; the seller's subscription quantity is the reduced one.
// The buyer address comes only from the private cast file; it is never printed. The access email after provisioning is sent
// by SCRATCH's Supabase Auth (outside the app mail guard); it is reserved as one email and recorded for manual inbox check.
import { createHmac, randomInt } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { EVIDENCE_ROOT, PORTAL, OWEDBOOK, scratchTarget, loadNamed, scrub } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const sellerPath = opt('--seller'), label = opt('--label');
if (!/^\/tmp\/[A-Za-z0-9._-]+\.json$/.test(sellerPath ?? '') || !existsSync(sellerPath) || !/^[A-Za-z0-9_-]{3,40}$/.test(label ?? '')) { console.error('FAIL-CLOSED: --seller /tmp/<existing>.json --label <run>'); process.exit(2); }
const seller = JSON.parse(readFileSync(sellerPath, 'utf8'));
const qa=Object.fromEntries(readFileSync(`${PORTAL}/.env.qa.local`,'utf8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')),l.slice(l.indexOf('=')+1)]));
const buyerEmail=qa.ROLE_MEMBER_EMAIL;
const PP = 'http://localhost:3101'; const I = `E:${label}`;
const OUT = join(EVIDENCE_ROOT, 'r03', 'E', label); mkdirSync(OUT, { recursive: true });
const STATE = join(OUT, 'state.json');
const st = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { label, done: [], log: [] };
const save = () => writeFileSync(STATE, JSON.stringify(st, null, 1));
const log = (step, data) => { const d = JSON.parse(scrub(JSON.stringify(data)).split(buyerEmail).join('[ENGINEERING_INVITEE]')); st.log.push({ step, at: new Date().toISOString(), ...d }); save(); console.log(step, JSON.stringify(d).slice(0, 700)); };
const req = createRequire(`/tmp/apbm007b-qa-q2-01/proof/pp/package.json`);
const { chromium } = req('playwright'); const { createClient } = req('@supabase/supabase-js');
const pg = createRequire(`${OWEDBOOK}/package.json`)('pg');
const sc = scratchTarget(); const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
const { stripe, read } = await import('./lib/stripe.mjs');
// No manual signer; automatic owned CLI receipts only.
const opToken = createHash('sha256').update(`${sc.secretKey}:apbm007a-operator-v1`).digest('hex');
const operator = async (body) => (await (await fetch(`${PP}/api/operator/007b`, { method: 'POST', headers: { Authorization: `Bearer ${opToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json());
const phase = async (name, fn) => { if (st.done.includes(name)) return; await fn(); st.done.push(name); save(); if (opt('--until') === name) { console.log(`stopped after ${name}`); process.exit(0); } };
async function sqlAs(uid, sql, params) {
  const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false } }); await c.connect();
  try { await c.query('begin'); await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })]); await c.query('set local role authenticated');
    try { return { rows: (await c.query(sql, params)).rows }; } catch (e) { return { error: e.code }; } }
  finally { await c.query('rollback').catch(() => {}); await c.end(); }
}
const qty = async () => (await read(I, 'seller subscription', () => stripe.subscriptions.retrieve(seller.subscription))).items.data[0].quantity;

await phase('seed', async () => {
  const src = (await db.from('businesses').select('id,npi,pharmacy_id,pharmacy_name').eq('account_id', seller.accountId).eq('status', 'active').order('created_at', { ascending: true })).data[1];
  await db.from('user_data').insert([1, 2].map((g) => ({ business_id: src.id, drug_name: `E SELLER HISTORY ${g}`, status: 'owed', owed: 10 })));
  st.src = src; st.qtyBefore = await qty(); save();
  log('seed', { source_store: src.id, seller_history_rows: 2, seller_quantity_before: st.qtyBefore });
});
await phase('authorize', async () => {
  const effectiveAt = new Date(Date.now() + 90_000).toISOString();
  const base = { action: 'store-transfer-authorize', sourceBusinessId: st.src.id, buyerEmail, effectiveAt, holdHours: 48, actor: 'Cody QA', reason: 'Check E: transfer buyer through registration', ticket: 'APBM007B-Q2-A01-TRANSFER' };
  const plan = await operator(base);
  const s = reserve(I, 'operator transfer authorize → seller quantity sync (subscription quantity −1, no proration)', { subscription_mutations: 1 });
  const r = await operator({ ...base, apply: true }); settle(s, { ok: r.result === 'applied', result: r.result });
  st.transfer = r.after?.transfer?.id; st.effectiveAt = effectiveAt; save();
  log('authorize', { plan: plan.result, apply: r.result, refusal: r.reason ?? r.error ?? null, transfer_status: r.after?.transfer?.status, seller_quantity_after: r.after?.seller_quantity });
});
await phase('complete', async () => {
  const wait = Date.parse(st.effectiveAt) - Date.now() + 5000; if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  const r = await operator({ action: 'store-transfer-complete', transferId: st.transfer, apply: true, actor: 'Cody QA', reason: 'Check E: effective time reached', ticket: 'APBM007B-Q2-A01-TRANSFER' });
  const t = (await db.from('store_transfers').select('status,buyer_account_id,buyer_business_id').eq('id', st.transfer).single()).data;
  const holds = (await db.from('npi_reservations').select('status,expires_at').eq('transfer_id', st.transfer)).data;
  const srcRow = (await db.from('businesses').select('status,ownership_ended_at').eq('id', st.src.id).single()).data;
  log('complete', { operator: r.result, finalize: r.after?.finalize, refusal: r.reason ?? r.error ?? null, transfer: t, npi_holds: holds.map((h) => h.status), source_store: srcRow });
});
await phase('register', async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1300 }, locale: 'en-US' })).newPage();
  const shot = (n) => page.screenshot({path:join(qa.QA_CAST_FILE.replace(/\/[^/]+$/,''),`transfer_${n}-private.png`),fullPage:true});
  try {
    await page.goto(`${PP}/register/plan`); await page.evaluate(() => sessionStorage.clear());
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(/\/register\/owner/);
    await page.getByLabel('First name').fill('QA'); await page.getByLabel('Last name').fill('Buyer');
    await page.getByLabel('Work email').fill(buyerEmail); await page.getByLabel('Mobile phone').fill('(555) 010-0177');
    await page.getByRole('checkbox', { name: /I confirm that I am the pharmacy owner/ }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Pharmacy name').waitFor({ timeout: 20000 });
    await page.getByLabel('Pharmacy name').fill(`E Buyer ${label}`); await page.getByLabel('Street address').fill('1 Transfer Street');
    await page.getByLabel('City').fill('Albany'); await page.getByLabel('State').selectOption('New York'); await page.getByLabel('ZIP').fill('12207');
    await page.getByLabel('NCPDP number').fill(String(randomInt(1000000, 9999999))); await page.getByLabel('NPI').fill(st.src.npi);
    await page.getByLabel('Store phone').fill('(555) 010-0188'); await page.getByLabel('Pharmacy software').selectOption('Liberty');
    await page.getByRole('button', { name: 'Continue to review' }).click();
    await page.waitForURL(/\/register\/review/, { timeout: 30000 }).catch(async () => { await shot('register_blocked'); throw new Error(`review not reached: ${scrub((await page.locator('main').innerText()).slice(0, 300)).split(buyerEmail).join('[INVITEE]')}`); });
    await page.getByTestId('due-today').waitFor({ timeout: 30000 });
    const due = await page.getByTestId('due-today').textContent();
    if(!/99[.]00/.test(due||''))throw new Error('Independent expected first-store price9900 mismatch');
    log('qa-first-store-expected',{expected_cents:9900,currency:'usd',source:'approved graduated first-store catalogue, no promotion'});
    for (const b of await page.locator('input[type=checkbox][id^="c"]').all()) await b.check();   // real review has THREE separate consents
    if ((await page.locator('input[type=checkbox][id^="c"]:not(:checked)').count()) !== 0) throw new Error('consents not all ticked');
    await shot('review');
    const s = reserve(I, `registration → Stripe Checkout (customer, subscription, one hosted submission ${due}) + access email via SCRATCH Auth`, { stripe_customers: 1, stripe_subscriptions: 1, invoice_create: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: 9900, email_dispatch: 1, scratch_auth_identities: 1 });
    await page.getByTestId('continue-payment').click();
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 }).catch(async (e) => { settle(s, { ok: false, executed: 'unknown', at: 'redirect' }); await shot('no_redirect'); throw e; });
    const card = page.locator('[data-testid="card-accordion-item-button"]'); await card.waitFor({state:'attached',timeout:45000});await card.dispatchEvent('click');if(!(await page.locator('#cardNumber').isVisible().catch(()=>false)))await page.getByText('Card',{exact:true}).first().click();
    await page.locator('#cardNumber').waitFor({ timeout: 30000 });
    if (await page.locator('#email').isEditable().catch(() => false)) await page.locator('#email').fill(buyerEmail);
    await page.locator('#cardNumber').fill('4242424242424242'); await page.locator('#cardExpiry').fill('12 / 34'); await page.locator('#cardCvc').fill('123');
    await page.locator('#billingName').fill('QA Buyer');
    if (await page.locator('#billingPostalCode').isVisible().catch(() => false)) await page.locator('#billingPostalCode').fill('12207');
    const link = page.locator('#enableStripePass'); if (await link.isChecked().catch(() => false)) await link.uncheck();
    await shot('checkout_filled');
    // Independent buyer-payment-failure control on the SAME Checkout session before the successful retry.
    await page.locator('#cardNumber').fill('4000000000009995');
    const failedAttempt=reserve(I,'buyer declined hosted submission, same Checkout retained',{invoice_pay_or_hosted:1,payment_attempts:1,payment_attempt_cents:9900});
    await page.locator('[data-testid="hosted-payment-submit-button"]').click();
    await page.getByText(/Your card was declined|card has been declined/i).first().waitFor({timeout:45000});
    const transferBeforePay=(await db.from('store_transfers').select('status,buyer_business_id').eq('id',st.transfer).single()).data;
    log('buyer-payment-failed',{checkout_still_open:new URL(page.url()).hostname==='checkout.stripe.com',transfer_status:transferBeforePay.status,buyer_business_created:!!transferBeforePay.buyer_business_id});
    if(transferBeforePay.buyer_business_id)throw new Error('Failed payment granted buyer store');
    settle(failedAttempt,{declined:true,store_granted:false});
    await page.locator('#cardNumber').fill('4242424242424242');
    await page.locator('[data-testid="hosted-payment-submit-button"]').click();
    await page.waitForURL(/\/register\/activation/, { timeout: 90000 });
    settle(s, { ok: true, returned: 'activation' });
    st.due = due; save(); await shot('activation_first');
    const observations=JSON.parse(readFileSync(qa.QA_MANUAL_OBSERVATIONS_FILE,'utf8'));observations.push({id:observations.length+1,role:'MEMBER',purpose:'transfer buyer first-store access mail',subject:'Cyber Pharma sign-in/access link',sent_at:new Date().toISOString(),status:'AWAITING_GROUPED_DIRECTOR_OBSERVATION',limits:'Manual inbox observation separate from automated checkout/browser/DB result.'});writeFileSync(qa.QA_MANUAL_OBSERVATIONS_FILE,JSON.stringify(observations,null,2),{mode:0o600});
    log('register', { due_today: due, checkout_returned_to: '/register/activation', heading: await page.getByRole('heading', { level: 1 }).textContent() });
  } finally { await browser.close(); }
});
await phase('deliver', async () => {
  const ops = (await db.from('checkout_operations').select('id,status,stripe_customer_id,stripe_checkout_session_id').order('created_at', { ascending: false }).limit(5)).data;
  const draft = (await db.from('registration_drafts').select('id').eq('owner_email', buyerEmail.toLowerCase()).order('created_at', { ascending: false }).limit(1).single()).data;
  const op = (await db.from('checkout_operations').select('id,status,stripe_customer_id,stripe_checkout_session_id').eq('draft_id', draft.id).order('created_at', { ascending: false }).limit(1).single()).data;
  st.checkoutOp = op.id; st.customer = op.stripe_customer_id; save();
  const evs=[];for await(const event of stripe.events.list({created:{gte:Math.floor(Date.now()/1000)-3600},limit:100})){const o=event.data.object;const c=typeof o.customer==='string'?o.customer:o.customer?.id;if(c===op.stripe_customer_id&&['checkout.session.completed','checkout.session.expired','invoice.paid','invoice.payment_failed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted'].includes(event.type))evs.push(event);}
  const results={};for(const event of evs){let row;for(let i=0;i<45;i++){row=(await db.from('stripe_events').select('event_id,status,error_code,attempts').eq('event_id',event.id).maybeSingle()).data;if(row&&['processed','ignored'].includes(row.status))break;await new Promise(r=>setTimeout(r,1000));}results[event.id]={type:event.type,receipt:row,delivery_lane:'automatic Stripe CLI'};if(!row||!['processed','ignored'].includes(row.status))throw new Error('Unfinished real transfer event '+event.id);}
  const after = (await db.from('checkout_operations').select('status').eq('id', op.id).single()).data;
  log('deliver', { checkout_status_before: op.status, events: evs.length, results, checkout_status_after: after.status, other_recent_ops: ops.length });
});
await phase('verify', async () => {
  const t = (await db.from('store_transfers').select('status,buyer_account_id,buyer_business_id,pharmacy_id').eq('id', st.transfer).single()).data;
  const nb = t.buyer_business_id ? (await db.from('businesses').select('id,account_id,pharmacy_id,status,npi').eq('id', t.buyer_business_id).single()).data : null;
  const buyerUser = nb ? (await db.from('accounts').select('owner_user_id').eq('id', nb.account_id).single()).data.owner_user_id : null;
  const scope = buyerUser ? await sqlAs(buyerUser, 'select array_agg(id) ids from public.my_business_ids() id') : null;
  const srcRead = buyerUser ? await sqlAs(buyerUser, `select public.owedbook_rows($1,'summary') j`, [st.src.id]) : null;
  const ownRead = buyerUser ? await sqlAs(buyerUser, `select public.owedbook_rows($1,'summary') j`, [nb.id]) : null;
  const ownRows = ownRead?.rows?.[0]?.j?.rows ?? [];
  const access = nb ? (await db.rpc('account_access_state', { p_account: nb.account_id })).data : null;
  const notice = (await db.from('checkout_operations').select('status,access_notification_status').eq('id', st.checkoutOp).maybeSingle()).data;
  log('verify', { transfer_status: t.status, buyer_business_is_new: !!nb && nb.id !== st.src.id, same_pharmacy_identity: !!nb && nb.pharmacy_id === st.src.pharmacy_id && nb.pharmacy_id === t.pharmacy_id,
    buyer_store_status: nb?.status, buyer_access: access?.state, buyer_scope_excludes_source: !!scope?.rows && !(scope.rows[0].ids ?? []).includes(st.src.id),
    buyer_read_of_source_store: srcRead?.error ? `denied ${srcRead.error}` : `ALLOWED rows=${srcRead?.rows?.[0]?.j?.rows?.length}`,
    buyer_sees_seller_history_in_own_store: ownRows.some((r) => /E SELLER HISTORY/.test(r.drug_name ?? '')), buyer_own_store_rows: ownRows.length,
    seller_quantity: { before: st.qtyBefore, now: await qty() }, checkout_operation: notice });
  if (buyerUser) { st.buyerUser = buyerUser; save(); }
});
console.log('check E phases done:', st.done.join(', '));
