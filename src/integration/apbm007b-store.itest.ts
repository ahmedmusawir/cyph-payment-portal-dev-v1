/** @jest-environment node */
// APBM-007B CP-1b — the Portal's Add Store saga and removal/undo against the REAL SCRATCH database and the REAL Stripe
// sandbox. Runs only through scripts/apbm007b/integration.mjs, which verifies SCRATCH, supplies settings in memory and
// reserves every provider effect in the cumulative E2 ledger. Creates ONE synthetic SCRATCH identity and run-owned
// Stripe objects (customer with no email); cancels/deletes the Stripe objects at the end. Never touches DEV.
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
if (!process.env.APBM_ITEST_SCRATCH || !String(process.env.NEXT_PUBLIC_SUPABASE_URL).includes(`${SCRATCH_REF}.supabase.co`) || !/^sk_test_|^rk_test_/.test(process.env.STRIPE_SECRET_KEY ?? '')) {
  throw new Error('REFUSED: runs only against the identified SCRATCH project and a Stripe TEST key, through its runner');
}
// No mail can leave: the Auth mail endpoints are refused at this process's network boundary; MAIL_ALLOWLIST is empty.
const MAIL = /\/auth\/v1\/(otp|magiclink|recover|invite|resend|signup)(\?|$)/;
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
  const url = String((input as { url?: string })?.url ?? input);
  if (MAIL.test(url) || url.startsWith('https://api.resend.com')) throw new Error('TRIPWIRE: mail attempted');
  return realFetch(input, init);
}) as typeof fetch;

// One-shot fault injection for the paid-but-local-failure case: the activation RPC fails once after payment.
let failActivationOnce = false;
jest.mock('@/server/db', () => {
  const actual = jest.requireActual('@/server/db');
  return { ...actual, rpc: async (fn: string, args: Record<string, unknown>) => {
    if (fn === 'store_add_activate' && failActivationOnce) { failActivationOnce = false; throw new Error('INJECTED: activation lost after payment'); }
    return actual.rpc(fn, args);
  } };
});

import { admin } from '@/server/db';
import { advanceStoreOperation, confirmAddStore, quoteAddStore, requestLifecycle, storeOperationStatus, abandonAddStore, loadStoreOperation } from '@/server/storeOperations';
import { reserveForTest, settleForTest } from './apbm007b-ledger';

const RUN = `apbm007b-itest-${Date.now()}`;
const s = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2026-04-22.dahlia', maxNetworkRetries: 0 });
const MARK = { apbm_run: 'apbm007b_e2', apbm_probe_run: RUN, apbm_db: 'scratch' };
const NPI = ['1003000118', '1003000126', '1003000134', '1003000142'];
const ctx: { userId?: string; email?: string; password?: string; account?: string; firstStore?: string; customer?: string; sub?: string; visa?: string; user?: { auth: { signOut: () => Promise<unknown> } } } = {};
const results: Record<string, unknown> = {};
const intent = () => `it_${randomUUID().replace(/-/g, '')}`;
const npiValid = (n: string) => { let sum = 0; const d = `80840${n}`; for (let i = 0; i < 15; i++) { let x = Number(d[14 - i]); if (i % 2 === 1) { x *= 2; if (x > 9) x -= 9; } sum += x; } return sum % 10 === 0; };
const freshNpi = () => { for (;;) { const n = String(1000000000 + Math.floor(Math.random() * 899999999)); if (npiValid(n)) return n; } };

async function stripeMut<T>(op: string, charges: Record<string, number>, fn: () => Promise<T>): Promise<T> {
  const seq = reserveForTest(op, charges);
  try { const r = await fn(); settleForTest(seq, { ok: true }); return r; } catch (e) { settleForTest(seq, { ok: false, code: (e as { code?: string }).code }); throw e; }
}

beforeAll(async () => {
  // Synthetic SCRATCH owner (1 identity) signed in for real, so auth.uid() and RLS apply to the owner reads.
  ctx.email = `${RUN}@apbm007b.invalid`; ctx.password = `P-${randomUUID()}`;
  const seq = reserveForTest('SCRATCH auth admin.createUser (itest owner)', { scratch_auth_identities: 1 });
  const u = await admin().auth.admin.createUser({ email: ctx.email, password: ctx.password, email_confirm: true });
  settleForTest(seq, { ok: !u.error });
  if (u.error) throw new Error(`identity ${u.error.status}`);
  ctx.userId = u.data.user.id;
  // Real Stripe customer + subscription (quantity 1) with a working card.
  const cust = await stripeMut('itest customers.create (no email)', { stripe_customers: 1 }, () => s.customers.create({ name: `APBM007B itest ${RUN}`, metadata: MARK }));
  ctx.customer = cust.id;
  const pm = await stripeMut('itest attach visa', { payment_method_attach: 1 }, () => s.paymentMethods.attach('pm_card_visa', { customer: cust.id }));
  ctx.visa = pm.id;
  await stripeMut('itest default visa', { default_card_changes: 1 }, () => s.customers.update(cust.id, { invoice_settings: { default_payment_method: pm.id } }));
  const sub = await stripeMut('itest subscriptions.create qty1', { stripe_subscriptions: 1, payment_attempts: 1, payment_attempt_cents: 9900 },
    () => s.subscriptions.create({ customer: cust.id, items: [{ price: process.env.STRIPE_PRICE_STORES as string, quantity: 1 }], metadata: MARK }));
  ctx.sub = sub.id;
  const it = sub.items.data[0];
  // SCRATCH account rows exactly as provisioning would create them (service role; fixture, labelled by RUN).
  const db = admin();
  const acct = await db.from('accounts').insert({ name: RUN, owner_user_id: ctx.userId }).select('id').single();
  ctx.account = acct.data!.id;
  const npi = freshNpi();
  const ident = await db.from('pharmacy_identities').insert({ npi }).select('id').single();
  const biz = await db.from('businesses').insert({ account_id: ctx.account, pharmacy_id: ident.data!.id, npi, pharmacy_name: `${RUN} first`, status: 'active' }).select('id').single();
  ctx.firstStore = biz.data!.id;
  await db.from('user_businesses').insert({ user_id: ctx.userId, business_id: ctx.firstStore, role: 'admin', is_primary: true });
  await db.from('billing_customers').insert({ account_id: ctx.account, stripe_customer_id: cust.id });
  await db.from('subscriptions').insert({ account_id: ctx.account, origin: 'stripe', stripe_customer_id: cust.id, stripe_subscription_id: sub.id, status: 'active', raw_status: 'active',
    quantity: 1, stripe_price_id: it.price.id, stripe_subscription_item_id: it.id, current_period_start: new Date(it.current_period_start * 1000).toISOString(),
    current_period_end: new Date(it.current_period_end * 1000).toISOString(), cancel_at_period_end: false, verified_at: new Date().toISOString(), policy_version: 'access-v1' });
  const user = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string, { auth: { persistSession: false } });
  const signed = await user.auth.signInWithPassword({ email: ctx.email, password: ctx.password });
  if (signed.error) throw new Error(`sign in ${signed.error.status}`);
  ctx.user = user as unknown as { auth: { signOut: () => Promise<unknown> } };
}, 120_000);

afterAll(async () => {
  results.cleanup = {};
  try { if (ctx.sub) { await stripeMut('itest cleanup cancel', { cleanup_subscription_cancel: 1 }, () => s.subscriptions.cancel(ctx.sub as string, { invoice_now: false, prorate: false })); } } catch (e) { (results.cleanup as Record<string, unknown>).cancel = String(e); }
  try { if (ctx.customer) { await stripeMut('itest cleanup customer delete', { cleanup_customer_delete: 1 }, () => s.customers.del(ctx.customer as string)); } } catch (e) { (results.cleanup as Record<string, unknown>).del = String(e); }
  await ctx.user?.auth.signOut().catch(() => {});
  console.log(`APBM007B_ITEST_RESULTS ${JSON.stringify({ run: RUN, account: ctx.account, results })}`);
}, 120_000);

const userClient = () => ctx.user as unknown as Parameters<typeof quoteAddStore>[0];
const opInvoices = async (opId: string) => (await s.invoices.list({ customer: ctx.customer as string, limit: 50 })).data.filter((i) => i.metadata?.apbm_operation === opId);
const qty = async () => (await s.subscriptions.retrieve(ctx.sub as string)).items.data[0].quantity;

it('happy path: quote = invoice, pay once, quantity +1 with no proration, one active store', async () => {
  const q = await quoteAddStore(userClient(), { storeName: `${RUN} added`, npi: freshNpi(), ncpdp: null });
  expect(q.amountCents).toBeGreaterThanOrEqual(4800); expect(q.amountCents).toBeLessThanOrEqual(4900);
  expect(q.nextRenewalCents).toBe(14800);
  const key = intent();
  const st = await stripeMut('itest confirm (pay once)', { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: q.amountCents, subscription_mutations: 1 },
    () => confirmAddStore(userClient(), { quoteId: q.quoteId, intentKey: key }));
  expect(st.state).toBe('activated');
  const inv = await opInvoices(st.operationId);
  expect(inv).toHaveLength(1); expect(inv[0].status).toBe('paid'); expect(inv[0].amount_paid).toBe(q.amountCents); expect(inv[0].parent ?? null).toBeNull();
  expect(await qty()).toBe(2);
  const preview = await s.invoices.createPreview({ subscription: ctx.sub as string });
  expect(preview.amount_due).toBe(14800);
  const replay = await confirmAddStore(userClient(), { quoteId: q.quoteId, intentKey: key });           // double submit / lost reply
  expect(replay.operationId).toBe(st.operationId); expect(replay.state).toBe('activated');
  expect(await opInvoices(st.operationId)).toHaveLength(1);
  const biz = await admin().from('businesses').select('id,status,pharmacy_id').eq('account_id', ctx.account as string).eq('pharmacy_name', `${RUN} added`);
  expect(biz.data).toHaveLength(1);
  results.happy = { amount: q.amountCents, operation: st.operationId, invoice: inv[0].id, quantity: 2, renewal: preview.amount_due, replay_same: true };
}, 120_000);

it('paid but activation lost: the next advance converges with no second charge', async () => {
  const q = await quoteAddStore(userClient(), { storeName: `${RUN} recovered`, npi: freshNpi(), ncpdp: null });
  failActivationOnce = true;
  const st = await stripeMut('itest confirm with injected activation loss', { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: q.amountCents, subscription_mutations: 1 },
    () => confirmAddStore(userClient(), { quoteId: q.quoteId, intentKey: intent() }));
  expect(st.state).toBe('paid_pending_activation');
  expect((await storeOperationStatus(userClient(), st.operationId)).state).toBe('activated');   // owner polling reconciles
  expect(await opInvoices(st.operationId)).toHaveLength(1);
  expect(await qty()).toBe(3);
  const intents = await admin().from('provider_call_intents').select('stage').eq('operation_id', st.operationId);
  expect(intents.data!.filter((x) => x.stage === 'pay')).toHaveLength(1);
  results.paid_local_failure = { operation: st.operationId, converged: true, invoices: 1, pay_intents: 1, quantity: 3 };
}, 120_000);

it('decline then owner abandon: invoice voided and verified, no store, quantity and renewal state unchanged', async () => {
  const fail = await stripeMut('itest attach failing card', { payment_method_attach: 1 }, () => s.paymentMethods.attach('pm_card_chargeCustomerFail', { customer: ctx.customer as string }));
  await stripeMut('itest default failing', { default_card_changes: 1 }, () => s.customers.update(ctx.customer as string, { invoice_settings: { default_payment_method: fail.id } }));
  const before = await s.subscriptions.retrieve(ctx.sub as string);
  const q = await quoteAddStore(userClient(), { storeName: `${RUN} declined`, npi: freshNpi(), ncpdp: null });
  const st = await stripeMut('itest confirm (declined)', { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: q.amountCents },
    () => confirmAddStore(userClient(), { quoteId: q.quoteId, intentKey: intent() }));
  expect(st.state).toBe('payment_pending'); expect(st.paymentRequired).toBe(true);
  const after = await s.subscriptions.retrieve(ctx.sub as string);
  expect(after.status).toBe('active'); expect(after.items.data[0].quantity).toBe(before.items.data[0].quantity);
  expect(after.latest_invoice).toBe(before.latest_invoice);
  const sub = await admin().from('subscriptions').select('grace_started_at').eq('stripe_subscription_id', ctx.sub as string).single();
  expect(sub.data!.grace_started_at).toBeNull();
  const ab = await stripeMut('itest abandon (void)', { invoice_void: 1 }, () => abandonAddStore(userClient(), st.operationId));
  expect(ab.state).toBe('expired_unpaid');
  const inv = await opInvoices(st.operationId);
  expect(inv[0].status).toBe('void'); expect(inv[0].amount_paid).toBe(0);
  const hold = await admin().from('npi_reservations').select('status').eq('store_operation_id', st.operationId).single();
  expect(hold.data!.status).toBe('released');
  await stripeMut('itest default visa again', { default_card_changes: 1 }, () => s.customers.update(ctx.customer as string, { invoice_settings: { default_payment_method: ctx.visa } }));
  results.decline_abandon = { operation: st.operationId, invoice: inv[0].id, status: 'void', subscription_unchanged: true, grace: null };
}, 120_000);

it('deadline expiry by the job path: open invoice voided and verified before release', async () => {
  const auth = await stripeMut('itest attach 3DS-required card', { payment_method_attach: 1 }, () => s.paymentMethods.attach('pm_card_authenticationRequired', { customer: ctx.customer as string }));
  await stripeMut('itest default 3DS', { default_card_changes: 1 }, () => s.customers.update(ctx.customer as string, { invoice_settings: { default_payment_method: auth.id } }));
  const q = await quoteAddStore(userClient(), { storeName: `${RUN} expired`, npi: freshNpi(), ncpdp: null });
  const st = await stripeMut('itest confirm (requires action)', { invoice_create: 1, invoiceitem_create: 1, invoice_finalize: 1, invoice_pay_or_hosted: 1, payment_attempts: 1, payment_attempt_cents: q.amountCents },
    () => confirmAddStore(userClient(), { quoteId: q.quoteId, intentKey: intent() }));
  expect(st.state).toBe('payment_pending'); expect(st.hostedPaymentUrl).toMatch(/^https:\/\/invoice\.stripe\.com\//);
  // Fixture time shift on this run's own operation row only: the deadline is moved into the past, then the job path runs.
  await admin().from('store_operations').update({ payment_deadline: new Date(Date.now() - 60_000).toISOString() }).eq('id', st.operationId);
  const due = await admin().rpc('store_operations_due');
  expect(((due.data ?? []) as unknown[]).map((r) => (typeof r === 'string' ? r : Object.values(r as object)[0]))).toContain(st.operationId);
  expect(await stripeMut('itest expiry advance (void)', { invoice_void: 1 }, () => advanceStoreOperation(st.operationId, { waitMs: 0 }))).toBe('expired_unpaid');
  const inv = await opInvoices(st.operationId);
  expect(inv[0].status).toBe('void');
  const op = await loadStoreOperation(st.operationId);
  expect(op?.last_error_code).toBe('deadline_passed');
  await stripeMut('itest default visa again', { default_card_changes: 1 }, () => s.customers.update(ctx.customer as string, { invoice_settings: { default_payment_method: ctx.visa } }));
  results.expiry = { operation: st.operationId, invoice: inv[0].id, status: 'void', hosted_url_offered_while_pending: true };
}, 120_000);

it('removal then undo: quantity decreases/increases with no invoice; cutoff bound to the period; last store refused', async () => {
  const invBefore = (await s.invoices.list({ customer: ctx.customer as string, limit: 50 })).data.length;
  const added = await admin().from('businesses').select('id').eq('account_id', ctx.account as string).eq('pharmacy_name', `${RUN} added`).single();
  const rm = await stripeMut('itest removal (qty -1, no proration)', { subscription_mutations: 1 }, () => requestLifecycle(userClient(), 'store_removal', added.data!.id, intent()));
  expect(rm.state).toBe('completed');
  expect(await qty()).toBe(2);
  const sub = await s.subscriptions.retrieve(ctx.sub as string);
  const b = await admin().from('businesses').select('removal_effective_at').eq('id', added.data!.id).single();
  expect(Date.parse(b.data!.removal_effective_at)).toBe(sub.items.data[0].current_period_end * 1000);
  expect((await s.invoices.createPreview({ subscription: ctx.sub as string })).amount_due).toBe(14800);
  const undo = await stripeMut('itest undo (qty +1, no charge)', { subscription_mutations: 1 }, () => requestLifecycle(userClient(), 'store_removal_undo', added.data!.id, intent()));
  expect(undo.state).toBe('completed');
  expect(await qty()).toBe(3);
  expect((await s.invoices.list({ customer: ctx.customer as string, limit: 50 })).data.length).toBe(invBefore);   // no credit/charge invoice
  results.removal_undo = { removal: rm.operationId, undo: undo.operationId, no_invoice: true };
}, 120_000);
