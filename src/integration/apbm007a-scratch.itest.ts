/** @jest-environment node */
// APBM007A — portal server modules against the REAL SCRATCH database and Auth (migrations 0001–0060), with Stripe
// faked and email sending stubbed. This is an engineering integration check, not part of the default suite:
//   it runs only through the work-lane runner, which supplies the SCRATCH settings in memory and refuses any other
//   project. It creates labelled rows and two labelled identities on SCRATCH and never touches DEV.
import { randomBytes, randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
if (!process.env.APBM_ITEST_SCRATCH || !String(process.env.NEXT_PUBLIC_SUPABASE_URL).includes(`${SCRATCH_REF}.supabase.co`)) {
  throw new Error('REFUSED: this integration test runs only against the identified SCRATCH project, through its runner');
}
// Hard guarantee, independent of any stub: every mail-sending Auth endpoint is refused at the network boundary of
// this process. Session verification and admin lookups pass through. Proved in src/__tests__/apbm007a-mail-guard.test.ts.
const MAIL_ENDPOINTS = /\/auth\/v1\/(otp|magiclink|recover|invite|resend|signup)(\?|$)/;
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
  const url = String((input as { url?: string })?.url ?? input);
  if (MAIL_ENDPOINTS.test(url)) throw new Error('TRIPWIRE: the integration test tried to send mail');
  return realFetch(input, init);
}) as typeof fetch;

// No email leaves this test: the portal's single mail call is replaced. (An earlier version stubbed the Auth client's
// prototype, which did not intercept; six link requests reached SCRATCH's mailer for undeliverable example.invalid
// addresses. See the E2 effect ledger.)
const otp = jest.fn(async (..._a: unknown[]) => ({ ok: true }));
jest.mock('@/server/accessEmail', () => ({ sendSignInLink: (email: string, redirectTo: string) => otp(email, redirectTo) }));

import { admin } from '@/server/db';
import { PortalError } from '@/server/errors';
import { loadDraft, requestQuote, saveDraft } from '@/server/registration';
import { abandonCheckout, latestOperationForDraft, startCheckout } from '@/server/checkout';
import { advanceOperation, resumeForUser } from '@/server/provisioning';
import { registrationStatus, resendAccessEmail } from '@/server/registrationStatus';
import { handleStripeWebhook } from '@/server/webhook';
import { ownerOverview, undoCancellation } from '@/server/billing';
import { __setStripeForTests } from '@/server/stripeClient';

const RUN = `apbm007a-itest-${Date.now()}`;
const WHSEC = 'whsec_itest_secret';
const real = new Stripe('sk_test_itest', { apiVersion: '2026-04-22.dahlia' });
const NOW = Math.floor(Date.now() / 1000);

// ── fake Stripe: just enough state for one customer → session → subscription → invoices ──
type Any = Record<string, any>;
const S = { customers: [] as Any[], sessions: new Map<string, Any>(), subs: new Map<string, Any>(), invoices: new Map<string, Any>(), calls: [] as string[] };
const fake = {
  webhooks: real.webhooks,
  accounts: { retrieveCurrent: async () => ({ id: 'acct_itest' }) },
  promotionCodes: { list: async ({ code }: Any) => ({ data: code === 'APA10SANDBOX' ? [{ id: 'promo_itest', expires_at: null, promotion: { coupon: { valid: true, percent_off: 10 } } }] : [] }) },
  customers: { create: async (p: Any, o: Any) => { S.calls.push('customers.create'); const hit = S.customers.find((c) => c.key === o.idempotencyKey); if (hit) return hit; const c = { id: `cus_${randomBytes(6).toString('hex')}`, key: o.idempotencyKey, ...p }; S.customers.push(c); return c; } },
  checkout: { sessions: {
    create: async (p: Any, o: Any) => { S.calls.push('sessions.create'); for (const s of S.sessions.values()) if (s.key === o.idempotencyKey) return s; const total = p.discounts ? 8910 : 9900; const s = { id: `cs_test_${randomBytes(8).toString('hex')}`, key: o.idempotencyKey, url: 'https://checkout.stripe.test/c/pay/x', status: 'open', payment_status: 'unpaid', mode: 'subscription', livemode: false, currency: 'usd', amount_total: total, customer: p.customer, client_reference_id: p.client_reference_id, expires_at: p.expires_at, subscription: null as string | null }; S.sessions.set(s.id, s); return s; },
    retrieve: async (id: string) => { S.calls.push('sessions.retrieve'); return S.sessions.get(id); },
    expire: async (id: string) => { S.calls.push('sessions.expire'); const s = S.sessions.get(id)!; s.status = 'expired'; s.url = null; return s; },
  } },
  subscriptions: {
    retrieve: async (id: string) => { const s = S.subs.get(id)!; return { ...s, latest_invoice: S.invoices.get(s.latest_invoice) ?? null }; },
    update: async (id: string, patch: Any) => { S.calls.push('subscriptions.update'); const s = S.subs.get(id)!; if ('cancel_at_period_end' in patch) { s.cancel_at_period_end = patch.cancel_at_period_end; if (!patch.cancel_at_period_end) s.cancel_at = null; } if ('cancel_at' in patch) s.cancel_at = patch.cancel_at === '' ? null : patch.cancel_at; return s; },
  },
  invoices: { retrieve: async (id: string) => S.invoices.get(id) },
};
/** The customer pays in the hosted page. */
function pay(sessionId: string, amount: number): string {
  const s = S.sessions.get(sessionId)!; const subId = `sub_${randomBytes(6).toString('hex')}`, invId = `in_${randomBytes(6).toString('hex')}`;
  S.invoices.set(invId, { id: invId, status: 'paid', currency: 'usd', amount_paid: amount, customer: s.customer, attempted: true, billing_reason: 'subscription_create', parent: { subscription_details: { subscription: subId } } });
  S.subs.set(subId, { id: subId, customer: s.customer, status: 'active', cancel_at_period_end: false, cancel_at: null, latest_invoice: invId, default_payment_method: null, items: { data: [{ id: `si_${randomBytes(4).toString('hex')}`, quantity: 1, price: { id: 'price_itest' }, current_period_start: NOW, current_period_end: NOW + 30 * 86400 }] } });
  Object.assign(s, { status: 'complete', payment_status: 'paid', subscription: subId, url: null });
  return subId;
}
const event = (type: string, object: Any) => { const body = JSON.stringify({ id: `evt_${randomBytes(8).toString('hex')}`, object: 'event', type, livemode: false, created: Math.floor(Date.now() / 1000), data: { object } }); return handleStripeWebhook(body, real.webhooks.generateTestHeaderString({ payload: body, secret: WHSEC })); };

// Four fresh NPIs per run: nine random digits plus the check digit (Luhn over 80840 + NPI), so reruns never collide.
function freshNpi(): string {
  const nine = '1' + String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
  for (let d = 0; d < 10; d++) {
    const digits = '80840' + nine + d; let total = 0, dbl = false;
    for (let i = digits.length - 1; i >= 0; i--) { let x = digits.charCodeAt(i) - 48; if (dbl) { x *= 2; if (x > 9) x -= 9; } total += x; dbl = !dbl; }
    if (total % 10 === 0) return nine + d;
  }
  throw new Error('no check digit');
}
const NPIS = [freshNpi(), freshNpi(), freshNpi(), freshNpi()];
const owner = (tag: string) => ({ firstName: 'Synthetic', lastName: 'Owner', email: `${RUN}-${tag}@example.invalid`, mobile: '205-555-0100', ownerDeclarationAccepted: true as const });
const pharmacy = (npi: string, tag: string) => ({ name: `${RUN} ${tag}`, street: '1 Test Street', city: 'Testville', state: 'al', zip: '35004', phone: '205-555-0101', npi, ncpdp: '', software: 'Liberty' as const });
const consents = { termsAccepted: true, recurringChargeAccepted: true, priceChangeAccepted: true };
const key = () => `itest_${randomUUID()}`;
const code = async (p: Promise<unknown>) => p.then(() => 'ok', (e) => (e instanceof PortalError ? e.code : `other:${e?.message}`));
const db = admin();
const one = async (table: string, col: string, val: string) => (await db.from(table).select('*').eq(col, val)).data ?? [];
/** A real session for an existing SCRATCH identity, minted the way the handoff does. */
async function sessionClient(email: string) {
  const link = await db.auth.admin.generateLink({ type: 'magiclink', email });
  const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const v = await c.auth.verifyOtp({ token_hash: link.data.properties!.hashed_token, type: 'magiclink' });
  if (v.error) throw new Error(`session mint ${v.error.code}`);
  return { client: c, userId: v.data.user!.id };
}

beforeAll(() => {
  Object.assign(process.env, { STRIPE_SECRET_KEY: 'sk_test_itest', STRIPE_PRICE_STORES: 'price_itest', STRIPE_PORTAL_CONFIGURATION: 'bpc_itest', STRIPE_EXPECTED_ACCOUNT: 'acct_itest', STRIPE_WEBHOOK_SECRET: WHSEC, APA_PROMOTION_CODES: 'APA10SANDBOX', NEXT_PUBLIC_SITE_URL: 'http://localhost:3001' });
  __setStripeForTests(fake);
});
jest.setTimeout(120_000);

describe('mail guard — checked before anything else runs', () => {
  it('the access-email module is the test double, and the network tripwire refuses a mail request', async () => {
    const mod = await import('@/server/accessEmail');
    await mod.sendSignInLink('guard@example.invalid', 'http://localhost:3000/api/auth/confirm');
    expect(otp).toHaveBeenLastCalledWith('guard@example.invalid', 'http://localhost:3000/api/auth/confirm');
    otp.mockClear();
    await expect(fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/otp`, { method: 'POST' })).rejects.toThrow('TRIPWIRE');
  });
});

describe('registration → checkout → provisioning against SCRATCH', () => {
  let secret: string, opId: string, subId: string, ownerEmail: string;

  it('validates on the server and creates a draft owned by a secret', async () => {
    expect(await code(saveDraft(undefined, { owner: owner('a'), pharmacy: pharmacy('1234567890', 'A') }, null))).toBe('invalid_input');
    expect(await code(saveDraft(undefined, { owner: { ...owner('a'), ownerDeclarationAccepted: false }, pharmacy: pharmacy(NPIS[0], 'A') }, null))).toBe('invalid_input');
    const saved = await saveDraft(undefined, { owner: owner('a'), pharmacy: pharmacy(`${NPIS[0].slice(0, 5)}-${NPIS[0].slice(5)}`, 'A') }, null);
    secret = saved.newSecret!; ownerEmail = owner('a').email;
    expect(saved.draft).toMatchObject({ revision: 1, status: 'draft', npi: NPIS[0], state: 'AL', ncpdp: null, owner_email: ownerEmail });
    expect(await loadDraft('x'.repeat(43))).toBeNull();                    // a guessed secret reads nothing
    expect((await one('npi_reservations', 'draft_id', saved.draft.id))[0]).toMatchObject({ npi: NPIS[0], status: 'held' });
  });
  it('a second registrant cannot take the held NPI, and learns nothing about why', async () => {
    expect(await code(saveDraft(undefined, { owner: owner('b'), pharmacy: pharmacy(NPIS[0], 'B') }, null))).toBe('npi_unavailable');
  });
  it('quotes on the server: 9900, and 8910 with the allowlisted fixture code; other codes are refused', async () => {
    expect((await requestQuote(secret, 'price_itest')).quote_total_cents).toBe(9900);
    expect(await code(requestQuote(secret, 'price_itest', 'NOTALLOWED'))).toBe('promotion_not_accepted');
    const q = await requestQuote(secret, 'price_itest', 'apa10sandbox');
    expect(q).toMatchObject({ quote_subtotal_cents: 9900, quote_discount_cents: 990, quote_total_cents: 8910, quote_promotion_code: 'APA10SANDBOX', quote_revision: q.revision });
  });
  it('an edit invalidates the quote, and checkout then refuses the stale quote', async () => {
    const edited = await saveDraft(secret, { owner: owner('a'), pharmacy: { ...pharmacy(NPIS[0], 'A'), city: 'Otherville' } }, null);
    expect(edited.draft).toMatchObject({ revision: 2, quote_total_cents: null });
    expect(await code(startCheckout(secret, { consents, operationKey: key() }, null))).toBe('expired');
    await requestQuote(secret, 'price_itest', 'APA10SANDBOX');
  });
  it('checkout needs all three consents, claims one operation, and binds the reservation', async () => {
    expect(await code(startCheckout(secret, { consents: { ...consents, priceChangeAccepted: false }, operationKey: key() }, null))).toBe('invalid_input');
    const k = key(); const before = S.calls.length;
    const [a, b] = await Promise.all([code(startCheckout(secret, { consents, operationKey: k }, null)), code(startCheckout(secret, { consents, operationKey: k }, null))]);
    expect([a, b].filter((x) => x === 'ok').length).toBeGreaterThanOrEqual(1);          // double submit: at most one claim, the other resumes or is told it is in progress
    expect([a, b].every((x) => x === 'ok' || x === 'operation_in_progress')).toBe(true);
    const again = await startCheckout(secret, { consents, operationKey: k }, null);     // retry with the same key resumes the same session
    expect(again.url).toContain('checkout.stripe.test');
    expect(S.customers.length).toBe(1); expect(S.sessions.size).toBe(1);
    expect(S.calls.slice(before).filter((c) => c === 'sessions.create').length).toBeLessThanOrEqual(2);
    expect(await code(startCheckout(secret, { consents, operationKey: key() }, null))).toBe('operation_in_progress');   // a new key cannot bypass it
    const draft = (await loadDraft(secret))!; const op = (await latestOperationForDraft(draft.id))!; opId = op.id;
    expect(op).toMatchObject({ status: 'checkout_open', expected_total_cents: 8910, promotion_code: 'APA10SANDBOX', npi: NPIS[0] });
    expect(draft.status).toBe('checkout_started');
    expect((await one('npi_reservations', 'operation_id', opId))[0]).toMatchObject({ status: 'checkout_bound' });
    expect(await code(saveDraft(secret, { owner: owner('a'), pharmacy: pharmacy(NPIS[0], 'A') }, null))).toBe('operation_in_progress');   // no silent edit after checkout started
  });
  it('status is pending and nothing is provisioned while the payment is not settled', async () => {
    expect(await advanceOperation(opId)).toBe('pending');
    expect(await registrationStatus(secret, { reconcile: true })).toMatchObject({ draft: 'checkout', payment: 'pending', provisioning: 'not_started', checkoutResumable: true });
    expect((await one('accounts', 'name', `${RUN} A`)).length).toBe(0);
  });
  it('a settled payment that does not match the operation is held for attention, never provisioned', async () => {
    const op = (await one('checkout_operations', 'id', opId))[0];
    subId = pay(op.stripe_checkout_session_id, 9900);                                    // paid, but not the quoted 8910
    expect(await advanceOperation(opId)).toBe('attention');
    expect((await one('checkout_operations', 'id', opId))[0]).toMatchObject({ status: 'attention', last_error_code: 'payment_mismatch' });
    expect((await one('accounts', 'name', `${RUN} A`)).length).toBe(0);
    S.invoices.get(S.subs.get(subId)!.latest_invoice)!.amount_paid = 8910;               // the provider's facts now agree
  });
  it('the webhook and two concurrent reconciles provision exactly once, with the owner as designated admin', async () => {
    const op = (await one('checkout_operations', 'id', opId))[0];
    const results = await Promise.all([event('checkout.session.completed', { id: op.stripe_checkout_session_id, object: 'checkout.session' }), advanceOperation(opId).catch((e) => e.code), advanceOperation(opId).catch((e) => e.code)]);
    expect([200, 500]).toContain(results[0].status);                                     // 500 only when a concurrent caller held the lease: the provider retries
    expect(await advanceOperation(opId)).toBe('provisioned');
    const done = (await one('checkout_operations', 'id', opId))[0];
    expect(done).toMatchObject({ status: 'provisioned', owner_was_existing: false });
    const accounts = await one('accounts', 'id', done.account_id); const stores = await one('businesses', 'account_id', done.account_id);
    const members = await one('user_businesses', 'business_id', done.business_id); const subs = await one('subscriptions', 'account_id', done.account_id);
    const mapping = await one('billing_customers', 'account_id', done.account_id); const role = await one('user_roles', 'user_id', done.owner_user_id);
    expect([accounts.length, stores.length, members.length, subs.length, mapping.length]).toEqual([1, 1, 1, 1, 1]);
    expect(accounts[0].owner_user_id).toBe(done.owner_user_id);
    expect(stores[0]).toMatchObject({ npi: NPIS[0], ncpdp: null, status: 'active', city: 'Otherville', state: 'AL' });
    expect(members[0]).toMatchObject({ user_id: done.owner_user_id, role: 'admin' });
    expect(subs[0]).toMatchObject({ origin: 'stripe', status: 'active', quantity: 1, stripe_subscription_id: subId, stripe_price_id: 'price_itest', promotion_code: 'APA10SANDBOX', policy_version: 'access-v1' });
    expect(role[0].role).toBe('member');                                                  // no platform elevation
    expect((await one('npi_reservations', 'operation_id', opId))[0].status).toBe('consumed');
    const user = await db.auth.admin.getUserById(done.owner_user_id);
    expect(user.data.user?.email).toBe(ownerEmail);
  });
  it('the access email is one notification operation; a resend cannot charge or provision again', async () => {
    const notes = await one('notification_operations', 'operation_id', opId);
    expect(notes.length).toBe(1); expect(notes[0]).toMatchObject({ kind: 'access_link', status: 'sent', dedupe_key: `access:${opId}` });
    expect(otp).toHaveBeenLastCalledWith(ownerEmail, 'http://localhost:3000/api/auth/confirm');   // lands in OwedBook
    const sends = otp.mock.calls.length, creates = S.calls.filter((c) => c === 'customers.create').length;
    expect(await registrationStatus(secret)).toMatchObject({ draft: 'complete', payment: 'confirmed', provisioning: 'ready', email: 'sent' });
    await resendAccessEmail(secret);                                                      // inside the one-minute interval: no second provider call
    expect(otp.mock.calls.length).toBe(sends);
    expect(S.calls.filter((c) => c === 'customers.create').length).toBe(creates);
    expect((await one('accounts', 'owner_user_id', (await one('checkout_operations', 'id', opId))[0].owner_user_id)).length).toBe(1);
  });
  it('a duplicate of a processed event does nothing; a renewal failure starts grace once; payment clears it', async () => {
    const sub = S.subs.get(subId)!; const renew = `in_${randomBytes(6).toString('hex')}`;
    S.invoices.set(renew, { id: renew, status: 'open', attempted: true, currency: 'usd', amount_paid: 0, customer: sub.customer, billing_reason: 'subscription_cycle', parent: { subscription_details: { subscription: subId } } });
    Object.assign(sub, { status: 'past_due', latest_invoice: renew });
    expect((await event('invoice.payment_failed', { id: renew, object: 'invoice' })).status).toBe(200);
    const g1 = (await one('subscriptions', 'stripe_subscription_id', subId))[0];
    expect(g1).toMatchObject({ status: 'past_due', grace_invoice_id: renew }); expect(g1.grace_started_at).not.toBeNull();
    await event('invoice.payment_failed', { id: renew, object: 'invoice' });               // Stripe's retry: a distinct event, same invoice
    expect((await one('subscriptions', 'stripe_subscription_id', subId))[0].grace_started_at).toBe(g1.grace_started_at);
    Object.assign(S.invoices.get(renew)!, { status: 'paid', amount_paid: 9900 }); Object.assign(sub, { status: 'active' });
    expect((await event('invoice.paid', { id: renew, object: 'invoice' })).status).toBe(200);
    expect((await one('subscriptions', 'stripe_subscription_id', subId))[0]).toMatchObject({ status: 'active', grace_started_at: null });
    await event('invoice.payment_failed', { id: renew, object: 'invoice' });               // late failure for an invoice that is now paid
    expect((await one('subscriptions', 'stripe_subscription_id', subId))[0].grace_started_at).toBeNull();
  });
  it('owner-only billing: the owner reads the overview; a seeded store admin is refused by the database', async () => {
    const o = await sessionClient(ownerEmail);
    const overview = await ownerOverview(o.client);
    expect(overview.subscription).toMatchObject({ origin: 'stripe', status: 'active', quantity: 1 });
    expect(overview.stores).toEqual([expect.objectContaining({ npi: NPIS[0], status: 'active' })]);
    expect(JSON.stringify(overview)).not.toMatch(/cus_|sub_|in_[0-9a-f]/);               // no Stripe identifier reaches the customer payload
    const adminB2 = await sessionClient('apbm003-admin_b2@example.invalid');
    expect(await code(ownerOverview(adminB2.client))).toBe('not_owner');
    expect(await code(undoCancellation(adminB2.client))).toBe('not_owner');
  });
  it('a portal-style cancellation is mirrored from cancel_at, and undo clears it on the same subscription', async () => {
    const sub = S.subs.get(subId)!; sub.cancel_at = NOW + 30 * 86400;
    expect((await event('customer.subscription.updated', { id: subId, object: 'subscription' })).status).toBe(200);
    const o = await sessionClient(ownerEmail);
    expect((await ownerOverview(o.client)).access).toMatchObject({ state: 'active', cancel_scheduled: true });
    expect(await undoCancellation(o.client)).toEqual({ cleared: true });
    expect(S.subs.get(subId)!.cancel_at).toBeNull();
    expect((await one('subscriptions', 'stripe_subscription_id', subId))[0]).toMatchObject({ cancel_at: null, cancel_at_period_end: false });
    expect((await ownerOverview(o.client)).access.cancel_scheduled).toBe(false);
    expect((await one('subscriptions', 'account_id', (await one('checkout_operations', 'id', opId))[0].account_id)).length).toBe(1);   // never a new subscription
  });
});

describe('abandonment, expiry and an existing identity against SCRATCH', () => {
  it('going back to edit expires the Checkout session first, then frees the NPI', async () => {
    const saved = await saveDraft(undefined, { owner: owner('c'), pharmacy: pharmacy(NPIS[1], 'C') }, null); const secret = saved.newSecret!;
    await requestQuote(secret, 'price_itest'); await startCheckout(secret, { consents, operationKey: key() }, null);
    const op = (await latestOperationForDraft(saved.draft.id))!; const before = S.calls.length;
    expect(await abandonCheckout(secret)).toBe('draft');
    expect(S.calls.slice(before)).toContain('sessions.expire');
    expect((await one('checkout_operations', 'id', op.id))[0].status).toBe('expired_unpaid');
    expect((await one('npi_reservations', 'operation_id', op.id))[0].status).toBe('released');
    expect((await loadDraft(secret))!.status).toBe('draft');
    expect(await registrationStatus(secret)).toMatchObject({ draft: 'editing', payment: 'expired' });
  });
  it('a paid checkout cannot be abandoned', async () => {
    const saved = await saveDraft(undefined, { owner: owner('d'), pharmacy: pharmacy(NPIS[2], 'D') }, null); const secret = saved.newSecret!;
    await requestQuote(secret, 'price_itest'); await startCheckout(secret, { consents, operationKey: key() }, null);
    const op = (await latestOperationForDraft(saved.draft.id))!; pay(op.stripe_checkout_session_id!, 9900);
    expect(await code(abandonCheckout(secret))).toBe('operation_in_progress');
    expect((await one('npi_reservations', 'operation_id', op.id))[0].status).toBe('checkout_bound');
    expect(await advanceOperation(op.id)).toBe('provisioned');
  });
  it('an existing identity that was signed out at purchase gets nothing attached until it signs in', async () => {
    const email = `${RUN}-existing@example.invalid`;
    const existing = await db.auth.admin.createUser({ email, email_confirm: true });
    const userId = existing.data.user!.id;
    const saved = await saveDraft(undefined, { owner: { ...owner('existing'), email }, pharmacy: pharmacy(NPIS[3], 'E') }, null); const secret = saved.newSecret!;
    await requestQuote(secret, 'price_itest'); await startCheckout(secret, { consents, operationKey: key() }, null);
    const op = (await latestOperationForDraft(saved.draft.id))!; pay(op.stripe_checkout_session_id!, 9900);
    expect(await advanceOperation(op.id)).toBe('attention');
    expect((await one('checkout_operations', 'id', op.id))[0]).toMatchObject({ status: 'attention', last_error_code: 'owner_signin_required', owner_was_existing: true });
    expect((await one('accounts', 'owner_user_id', userId)).length).toBe(0);
    expect(await registrationStatus(secret)).toMatchObject({ payment: 'confirmed', provisioning: 'attention', attention: 'sign_in_to_finish' });
    expect(otp).toHaveBeenLastCalledWith(email, 'http://localhost:3001/api/auth/confirm');   // the proof-of-control link lands in the portal
    expect(await resumeForUser(randomUUID(), `${RUN}-someone-else@example.invalid`)).toBe(0);   // another person signing in attaches nothing
    expect(await resumeForUser(userId, email)).toBe(1);
    expect((await one('accounts', 'owner_user_id', userId)).length).toBe(1);
    expect((await one('checkout_operations', 'id', op.id))[0]).toMatchObject({ status: 'provisioned', owner_user_id: userId });
    const user = await db.auth.admin.getUserById(userId);
    expect(user.data.user?.id).toBe(userId);                                              // same identity: nothing reset or replaced
  });
});
