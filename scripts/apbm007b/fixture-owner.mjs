#!/usr/bin/env node
// APBM-007B — SCRATCH proof owner fixture for production-build browser walks. cwd: Portal root.
//
//   node scripts/apbm007b/fixture-owner.mjs --help
//   node scripts/apbm007b/fixture-owner.mjs create --label <run> --cred /tmp/<file>.json     # 1 SCRATCH identity + Stripe customer/sub + rows
//   node scripts/apbm007b/fixture-owner.mjs cleanup --cred /tmp/<file>.json                  # cancel/delete the run-owned Stripe objects
//
// Creates ONE synthetic SCRATCH identity (email *.invalid, random password) and writes its credentials ONLY to the given
// /tmp file with mode 0600 (never printed, never packaged). Stripe customer has no email. Account rows are inserted with
// the service role exactly as provisioning creates them (account, first store, owner admin membership, customer mapping,
// subscription mirror). Every effect is reserved in the cumulative E2 ledger. SCRATCH only (verified); never DEV.
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, chmodSync, existsSync } from 'node:fs';
import { scratchTarget, PORTAL } from './lib/env.mjs';
import { reserve, settle } from './lib/effects.mjs';

const args = process.argv.slice(2); const cmd = args[0];
if (!cmd || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const cred = args[args.indexOf('--cred') + 1];
if (!cred || !/^\/tmp\/[A-Za-z0-9._-]+\.json$/.test(cred)) { console.error('FAIL-CLOSED: --cred /tmp/<file>.json required'); process.exit(2); }
const sc = scratchTarget();
const { createClient } = createRequire(`${PORTAL}/package.json`)('@supabase/supabase-js');
const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { stripe, CONFIG, mutate } = await import('./lib/stripe.mjs');
const I = 'fixture-owner';
const npiValid = (n) => { let sum = 0; const d = `80840${n}`; for (let i = 0; i < 15; i++) { let x = Number(d[14 - i]); if (i % 2 === 1) { x *= 2; if (x > 9) x -= 9; } sum += x; } return sum % 10 === 0; };
const freshNpi = () => { for (;;) { const n = String(1000000000 + Math.floor(Math.random() * 899999999)); if (npiValid(n)) return n; } };

if (cmd === 'create') {
  const label = args[args.indexOf('--label') + 1];
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,40}$/.test(label ?? '')) { console.error('FAIL-CLOSED: --label required'); process.exit(2); }
  if (existsSync(cred)) { console.error('FAIL-CLOSED: credential file exists'); process.exit(2); }
  const email = `${label.toLowerCase()}-${Date.now()}@apbm007b-proof.invalid`, password = `Pw-${randomUUID()}`;
  const seq = reserve(I, 'SCRATCH auth admin.createUser (proof owner)', { scratch_auth_identities: 1 });
  const u = await db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: `Proof Owner ${label}` } });
  settle(seq, { ok: !u.error, status: u.error?.status });
  if (u.error) throw new Error(`identity ${u.error.status}`);
  const marker = { apbm_run: 'apbm007b_e2', apbm_probe_run: `PROOF_${label}`, apbm_db: 'scratch' };
  const cust = await mutate(I, 'customers.create (no email)', { stripe_customers: 1 }, (o) => stripe.customers.create({ name: `APBM007B proof ${label}`, metadata: marker }, o), { idem: `apbm007b:proof:${label}:customer` });
  const pm = await mutate(I, 'attach visa', { payment_method_attach: 1 }, (o) => stripe.paymentMethods.attach('pm_card_visa', { customer: cust.id }, o), { idem: `apbm007b:proof:${label}:pm` });
  await mutate(I, 'default visa', { default_card_changes: 1 }, (o) => stripe.customers.update(cust.id, { invoice_settings: { default_payment_method: pm.id } }, o), { idem: `apbm007b:proof:${label}:default` });
  const sub = await mutate(I, 'subscriptions.create qty2', { stripe_subscriptions: 1, payment_attempts: 1, payment_attempt_cents: 14800 },
    (o) => stripe.subscriptions.create({ customer: cust.id, items: [{ price: CONFIG.STRIPE_PRICE_STORES, quantity: 2 }], metadata: marker }, o), { idem: `apbm007b:proof:${label}:sub` });
  const it = sub.items.data[0];
  const acct = (await db.from('accounts').insert({ name: `Proof ${label}`, owner_user_id: u.data.user.id }).select('id').single()).data.id;
  const stores = [];
  for (const name of [`${label} North`, `${label} South`]) {
    // Canonical identity first (works on every 0061 candidate, with or without the compatibility trigger).
    const npi = freshNpi();
    const ident = await db.from('pharmacy_identities').insert({ npi }).select('id').single();
    if (ident.error) throw new Error(`identity row ${ident.error.code}`);
    const ins = await db.from('businesses').insert({ account_id: acct, pharmacy_id: ident.data.id, npi, pharmacy_name: name, status: 'active', state: 'NY' }).select('id').single();
    if (ins.error) throw new Error(`store row ${ins.error.code}`);
    const b = ins.data;
    await db.from('user_businesses').insert({ user_id: u.data.user.id, business_id: b.id, role: 'admin', is_primary: stores.length === 0 });
    stores.push(b.id);
  }
  await db.from('billing_customers').insert({ account_id: acct, stripe_customer_id: cust.id });
  await db.from('subscriptions').insert({ account_id: acct, origin: 'stripe', stripe_customer_id: cust.id, stripe_subscription_id: sub.id, status: 'active', raw_status: 'active', quantity: 2,
    stripe_price_id: it.price.id, stripe_subscription_item_id: it.id, current_period_start: new Date(it.current_period_start * 1000).toISOString(),
    current_period_end: new Date(it.current_period_end * 1000).toISOString(), cancel_at_period_end: false, verified_at: new Date().toISOString(), policy_version: 'access-v1' });
  writeFileSync(cred, JSON.stringify({ label, email, password, userId: u.data.user.id, accountId: acct, stores, customer: cust.id, subscription: sub.id }), { mode: 0o600 }); chmodSync(cred, 0o600);
  console.log(JSON.stringify({ created: true, accountId: acct, stores: stores.length, credential_file: cred }));
}
if (cmd === 'cleanup') {
  const c = JSON.parse(readFileSync(cred, 'utf8'));
  for (const [op, charges, fn] of [['cleanup cancel', { cleanup_subscription_cancel: 1 }, () => stripe.subscriptions.cancel(c.subscription, { invoice_now: false, prorate: false })],
    ['cleanup customer delete', { cleanup_customer_delete: 1 }, () => stripe.customers.del(c.customer)]]) {
    const s = reserve(I, op, charges); try { await fn(); settle(s, { ok: true }); } catch (e) { settle(s, { ok: false, code: e.code }); }
  }
  console.log(JSON.stringify({ cleaned: true, scratch_rows_retained: 'labelled fixture rows remain on SCRATCH' }));
}
