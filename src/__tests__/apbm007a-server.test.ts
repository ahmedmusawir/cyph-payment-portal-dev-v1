/** @jest-environment node */
// APBM007A — portal server unit and contract tests. Provider calls are faked; signature verification uses the real
// Stripe library. Database behaviour (atomicity, grants, races) is proved separately on SCRATCH by
// cyph-v1-dev/scripts/rls-harness/apbm007a-proof.mjs — nothing here stands in for that.
import Stripe from 'stripe';

// ── a small in-memory stand-in for the service-role client: enough of the query builder for these modules ──
type Row = Record<string, unknown>;
const tables: Record<string, Row[]> = {};
const rpcCalls: { fn: string; args: Row }[] = [];
let rpcImpl: (fn: string, args: Row) => unknown = () => null;
function builder(table: string) {
  const filters: [string, unknown][] = [];
  let mode: 'select' | 'insert' | 'update' = 'select';
  let payload: Row | undefined;
  const rows = () => (tables[table] ??= []);
  const match = () => rows().filter((r) => filters.every(([k, v]) => r[k] === v));
  const run = () => {
    if (mode === 'insert') {
      const key = table === 'stripe_events' ? 'event_id' : 'id';
      if (rows().some((r) => r[key] !== undefined && r[key] === payload![key])) return { data: null, error: { code: '23505' } };
      rows().push({ status: 'received', attempts: 0, ...payload }); return { data: payload, error: null };
    }
    if (mode === 'update') { match().forEach((r) => Object.assign(r, payload)); return { data: null, error: null }; }
    return { data: match(), error: null };
  };
  const api: Record<string, unknown> = {
    insert: (p: Row) => { mode = 'insert'; payload = p; return api; },
    update: (p: Row) => { mode = 'update'; payload = p; return api; },
    select: () => api, order: () => api, limit: () => api,
    eq: (k: string, v: unknown) => { filters.push([k, v]); return api; },
    maybeSingle: async () => { const r = run(); return { data: Array.isArray(r.data) ? r.data[0] ?? null : r.data, error: r.error }; },
    single: async () => { const r = run(); return { data: Array.isArray(r.data) ? r.data[0] ?? null : r.data, error: r.error }; },
    then: (ok: (v: unknown) => unknown) => Promise.resolve(run()).then(ok),
  };
  return api;
}
jest.mock('@/server/db', () => ({
  admin: () => ({ from: (t: string) => builder(t) }),
  rpc: async (fn: string, args: Row) => { rpcCalls.push({ fn, args }); return rpcImpl(fn, args); },
  bytea: (b: Buffer) => '\\x' + b.toString('hex'),
}));
const advanceOperation = jest.fn(async (_id: string) => 'provisioned');
jest.mock('@/server/provisioning', () => ({ advanceOperation: (id: string) => advanceOperation(id) }));

import { safeReturnPath, authCookieName, ownOrigin, peerOrigin } from '@/lib/appIdentity';
import { normalizeNpi } from '@/services/portal/npi';
import { PortalError, errorBody } from '@/server/errors';
import { buildQuote, recurringCents, resolvePromotion } from '@/server/pricing';
import { mirrorPayload } from '@/server/stripeMirror';
import { __setStripeForTests } from '@/server/stripeClient';
import { handleStripeWebhook } from '@/server/webhook';
import { assertPortalConfiguration, createPortalSession, undoCancellation, ownerOverview, __resetPortalCheckForTests } from '@/server/billing';

const SECRET = 'whsec_unit_test_secret';
const real = new Stripe('sk_test_unit', { apiVersion: '2026-04-22.dahlia' });
const sign = (payload: string, secret = SECRET) => real.webhooks.generateTestHeaderString({ payload, secret });
const eventBody = (over: Row = {}) => JSON.stringify({ id: 'evt_unit1', object: 'event', type: 'checkout.session.completed', livemode: false, created: 1794480000, data: { object: { id: 'cs_test_unit1', object: 'checkout.session' } }, ...over });

beforeAll(() => {
  Object.assign(process.env, { STRIPE_SECRET_KEY: 'sk_test_unit', STRIPE_PRICE_STORES: 'price_unit', STRIPE_PORTAL_CONFIGURATION: 'bpc_unit', STRIPE_EXPECTED_ACCOUNT: 'acct_unit', STRIPE_WEBHOOK_SECRET: SECRET, APA_PROMOTION_CODES: 'APA10SANDBOX', NEXT_PUBLIC_SITE_URL: 'http://localhost:3001' });
});
beforeEach(() => { for (const k of Object.keys(tables)) delete tables[k]; rpcCalls.length = 0; rpcImpl = () => null; advanceOperation.mockClear(); advanceOperation.mockResolvedValue('provisioned'); __resetPortalCheckForTests(); });

describe('app identity and return paths (FC-1)', () => {
  it('uses distinct per-app, per-environment names and the frozen local origins', () => {
    expect(authCookieName()).toBe('cyph-pp-auth-local');
    expect(ownOrigin()).toBe('http://localhost:3001');
    expect(peerOrigin()).toBe('http://localhost:3000');
  });
  it.each(['//evil.example', '/\\evil', '/%2f%2fevil', 'https://evil.example', '/dashboard?x=1', '/dashboard#x', '/a//b', '/unknown', '', null, undefined, '/dashboard/'])('rejects %p', (v) => {
    expect(safeReturnPath(v as string)).toBeNull();
  });
  it('accepts only exact allowlisted relative paths', () => {
    expect(safeReturnPath('/dashboard')).toBe('/dashboard');
    expect(safeReturnPath('/billing')).toBe('/billing');
  });
});

describe('NPI rule (RA-7)', () => {
  it('accepts a valid NPI and strips spaces and hyphens', () => {
    expect(normalizeNpi('1234567893')).toEqual({ ok: true, npi: '1234567893' });
    expect(normalizeNpi('12345-678 93')).toEqual({ ok: true, npi: '1234567893' });
  });
  it('rejects wrong length, wrong check digit and other characters', () => {
    expect(normalizeNpi('123456789')).toEqual({ ok: false, reason: 'length' });
    expect(normalizeNpi('1234567890')).toEqual({ ok: false, reason: 'check_digit' });
    expect(normalizeNpi('12345678x3')).toEqual({ ok: false, reason: 'characters' });
  });
});

describe('server pricing and the APA allowlist (AC-009, AC-010)', () => {
  it('computes 9900 / 14800 / 19700 cents for one, two and three stores', () => {
    expect([1, 2, 3].map(recurringCents)).toEqual([9900, 14800, 19700]);
    expect(() => recurringCents(0)).toThrow(PortalError);
  });
  it('applies the 10% fixture to the whole first invoice', () => {
    const q = buildQuote({ code: 'APA10SANDBOX', promotionCodeId: 'promo_x', percentOff: 10 }, 0);
    expect(q).toMatchObject({ subtotalCents: 9900, discountCents: 990, totalCents: 8910, currency: 'usd' });
    expect(buildQuote(null, 0).totalCents).toBe(9900);
  });
  const fakePromo = (data: unknown[]) => __setStripeForTests({ promotionCodes: { list: jest.fn(async () => ({ data })) } });
  it('refuses a code that is not on the server allowlist without asking Stripe', async () => {
    const list = jest.fn(); __setStripeForTests({ promotionCodes: { list } });
    await expect(resolvePromotion('VALIDELSEWHERE')).rejects.toMatchObject({ code: 'promotion_not_accepted' });
    expect(list).not.toHaveBeenCalled();
  });
  it('refuses an allowlisted code that Stripe does not hold as active, and an expired one', async () => {
    fakePromo([]); await expect(resolvePromotion('apa10sandbox')).rejects.toMatchObject({ code: 'promotion_not_accepted' });
    fakePromo([{ id: 'promo_1', expires_at: 1, promotion: { coupon: { valid: true, percent_off: 10 } } }]);
    await expect(resolvePromotion('APA10SANDBOX')).rejects.toMatchObject({ code: 'promotion_not_accepted' });
  });
  it('accepts an allowlisted, active percent-off code', async () => {
    fakePromo([{ id: 'promo_1', expires_at: null, promotion: { coupon: { valid: true, percent_off: 10 } } }]);
    await expect(resolvePromotion(' apa10sandbox ')).resolves.toEqual({ code: 'APA10SANDBOX', promotionCodeId: 'promo_1', percentOff: 10 });
  });
});

describe('cancellation mirror reads both fields (RA-4, F-S1)', () => {
  const sub = (over: Row) => ({ id: 'sub_1', customer: 'cus_1', status: 'active', cancel_at_period_end: false, cancel_at: null, latest_invoice: { id: 'in_1', status: 'paid' }, items: { data: [{ id: 'si_1', quantity: 1, price: { id: 'price_unit' }, current_period_start: 1794480000, current_period_end: 1797072000 }] }, ...over }) as unknown as Stripe.Subscription;
  it('carries a portal-style cancel_at with the flag false', () => {
    const p = mirrorPayload(sub({ cancel_at: 1797072000 }), new Date('2026-11-12T00:00:00Z'));
    expect(p).toMatchObject({ cancel_at: new Date(1797072000 * 1000).toISOString(), cancel_at_period_end: false, quantity: 1, price_id: 'price_unit', latest_invoice_status: 'paid', policy_version: 'access-v1' });
  });
  it('maps provider statuses onto the six stored values', () => {
    expect(mirrorPayload(sub({ status: 'incomplete_expired' }), new Date()).status).toBe('canceled');
    expect(mirrorPayload(sub({ status: 'paused' }), new Date()).raw_status).toBe('paused');
  });
});

describe('webhook: signature, ledger, idempotency (AC-012, AC-014)', () => {
  beforeEach(() => __setStripeForTests(real));
  it('rejects a missing signature, a wrong secret and mutated bytes without recording anything', async () => {
    const body = eventBody();
    expect((await handleStripeWebhook(body, null)).status).toBe(400);
    expect((await handleStripeWebhook(body, sign(body, 'whsec_other'))).status).toBe(400);
    expect((await handleStripeWebhook(body.replace('cs_test_unit1', 'cs_test_unit2'), sign(body))).status).toBe(400);
    expect(tables.stripe_events ?? []).toEqual([]);
    expect(advanceOperation).not.toHaveBeenCalled();
  });
  it('rejects live-mode events and events for another account', async () => {
    const live = eventBody({ livemode: true }); expect((await handleStripeWebhook(live, sign(live))).body).toEqual({ error: 'wrong_mode' });
    const other = eventBody({ account: 'acct_other' }); expect((await handleStripeWebhook(other, sign(other))).body).toEqual({ error: 'wrong_account' });
  });
  it('records the event, advances the mapped operation once, and answers a duplicate without a second action', async () => {
    tables.checkout_operations = [{ id: 'op1', stripe_checkout_session_id: 'cs_test_unit1' }];
    const body = eventBody();
    expect(await handleStripeWebhook(body, sign(body))).toEqual({ status: 200, body: { result: 'provisioned' } });
    expect(tables.stripe_events[0]).toMatchObject({ event_id: 'evt_unit1', status: 'processed', operation_id: 'op1' });
    expect(await handleStripeWebhook(body, sign(body))).toEqual({ status: 200, body: { result: 'duplicate' } });
    expect(advanceOperation).toHaveBeenCalledTimes(1);
  });
  it('a distinct event for the same business outcome is applied idempotently by the operation, not skipped', async () => {
    tables.checkout_operations = [{ id: 'op1', stripe_checkout_session_id: 'cs_test_unit1' }];
    const a = eventBody(), b = eventBody({ id: 'evt_unit2' });
    await handleStripeWebhook(a, sign(a)); await handleStripeWebhook(b, sign(b));
    expect(advanceOperation).toHaveBeenCalledTimes(2);
    expect(tables.stripe_events.map((e) => e.status)).toEqual(['processed', 'processed']);
  });
  it('answers non-2xx and leaves the event unprocessed when the transition fails, then succeeds on retry', async () => {
    tables.checkout_operations = [{ id: 'op1', stripe_checkout_session_id: 'cs_test_unit1' }];
    advanceOperation.mockRejectedValueOnce(Object.assign(new Error('db down'), { code: 'provider_unavailable' }));
    const body = eventBody();
    expect((await handleStripeWebhook(body, sign(body))).status).toBe(500);
    expect(tables.stripe_events[0]).toMatchObject({ status: 'failed', attempts: 1 });
    expect((await handleStripeWebhook(body, sign(body))).status).toBe(200);
    expect(tables.stripe_events[0].status).toBe('processed');
  });
  it('a busy operation is not acknowledged, so the provider retries', async () => {
    tables.checkout_operations = [{ id: 'op1', stripe_checkout_session_id: 'cs_test_unit1' }];
    advanceOperation.mockResolvedValueOnce('busy');
    const body = eventBody(); expect((await handleStripeWebhook(body, sign(body))).status).toBe(500);
  });
  it('logs an unsupported verified type as ignored, and an unmapped session as ignored with a visible reason', async () => {
    const other = eventBody({ type: 'charge.succeeded' }); expect((await handleStripeWebhook(other, sign(other))).body).toEqual({ result: 'ignored' });
    const unmapped = eventBody({ id: 'evt_unit3' }); expect((await handleStripeWebhook(unmapped, sign(unmapped))).body).toEqual({ result: 'unmapped' });
    expect(tables.stripe_events.find((e) => e.event_id === 'evt_unit3')).toMatchObject({ status: 'ignored', error_code: 'unmapped' });
    expect(advanceOperation).not.toHaveBeenCalled();
  });
});

describe('owner billing (AC-027, RA-2, RA-4, RA-5)', () => {
  const owner = (subscription: Row | null) => ({ rpc: jest.fn(async () => ({ data: { account_id: 'acc1', access: { state: 'active', read_only: false, origin: subscription?.origin ?? null, grace_ends_at: null, policy_version: 'access-v1' }, subscription, stores: [] }, error: null })) }) as never;
  const denied = { rpc: jest.fn(async () => ({ data: null, error: { code: '42501' } })) } as never;
  it('a non-owner is refused by the database function', async () => {
    await expect(ownerOverview(denied)).rejects.toMatchObject({ code: 'not_owner', status: 403 });
  });
  it('a synthetic subscription grants nothing when the environment flag is off, and never reaches Stripe', async () => {
    const retrieve = jest.fn(); __setStripeForTests({ subscriptions: { retrieve } });
    delete process.env.ALLOW_SYNTHETIC_SUBSCRIPTIONS;
    expect((await ownerOverview(owner({ id: 's1', origin: 'synthetic_seed', status: 'active' }))).access.state).toBe('none');
    process.env.ALLOW_SYNTHETIC_SUBSCRIPTIONS = 'true';
    expect((await ownerOverview(owner({ id: 's1', origin: 'synthetic_seed', status: 'active' }))).access.state).toBe('active');
    await expect(undoCancellation(owner({ id: 's1', origin: 'synthetic_seed', status: 'active' }))).rejects.toMatchObject({ code: 'not_billable', status: 409 });
    expect(retrieve).not.toHaveBeenCalled();
  });
  it('a portal session cannot be created without an explicit configuration', async () => {
    const create = jest.fn(async () => ({ url: 'https://billing.stripe.com/p/session/x' })); __setStripeForTests({ billingPortal: { sessions: { create } } });
    await expect(createPortalSession('cus_1', '', 'http://localhost:3001/billing')).rejects.toMatchObject({ code: 'configuration' });
    expect(create).not.toHaveBeenCalled();
    await createPortalSession('cus_1', 'bpc_unit', 'http://localhost:3001/billing');
    expect(create).toHaveBeenCalledWith({ customer: 'cus_1', configuration: 'bpc_unit', return_url: 'http://localhost:3001/billing' });
  });
  const cfg = (over: Row = {}) => ({ active: true, livemode: false, features: { subscription_update: { enabled: false }, customer_update: { enabled: false }, subscription_cancel: { enabled: true, mode: 'at_period_end' }, payment_method_update: { enabled: true }, invoice_history: { enabled: true } }, ...over });
  it('the configuration check fails closed on a missing, inactive or permissive configuration', async () => {
    const set = (retrieve: () => Promise<unknown>) => { __resetPortalCheckForTests(); __setStripeForTests({ billingPortal: { configurations: { retrieve } } }); };
    set(async () => { throw new Error('missing'); }); await expect(assertPortalConfiguration()).rejects.toMatchObject({ code: 'configuration' });
    set(async () => cfg({ active: false })); await expect(assertPortalConfiguration()).rejects.toMatchObject({ code: 'configuration' });
    set(async () => cfg({ features: { ...cfg().features, subscription_update: { enabled: true } } })); await expect(assertPortalConfiguration()).rejects.toMatchObject({ code: 'configuration' });
    set(async () => cfg()); await expect(assertPortalConfiguration()).resolves.toBeUndefined();
  });
  const undoSetup = (before: Row, after: Row) => {
    tables.subscriptions = [{ id: 's1', account_id: 'acc1', origin: 'stripe', stripe_customer_id: 'cus_1', stripe_subscription_id: 'sub_1' }];
    const base = { id: 'sub_1', customer: 'cus_1', status: 'active', cancel_at_period_end: false, cancel_at: null, latest_invoice: null, items: { data: [] } };
    const retrieve = jest.fn().mockResolvedValueOnce({ ...base, ...before }).mockResolvedValue({ ...base, ...after });
    const update = jest.fn(async () => ({}));
    __setStripeForTests({ subscriptions: { retrieve, update } }); rpcImpl = () => 'applied';
    return { update };
  };
  const stripeOwner = owner({ id: 's1', origin: 'stripe', status: 'active' });
  it('clears the cancel_at date that the hosted portal sets, on the same subscription', async () => {
    const { update } = undoSetup({ cancel_at: 1797072000 }, {});
    await expect(undoCancellation(stripeOwner)).resolves.toEqual({ cleared: true });
    expect(update).toHaveBeenCalledWith('sub_1', { cancel_at: '' }, expect.objectContaining({ idempotencyKey: expect.stringContaining('sub_1') }));
    expect(rpcCalls.some((c) => c.fn === 'subscription_mirror_apply' && c.args.p_stripe_subscription_id === 'sub_1')).toBe(true);
  });
  it('a second undo of the same schedule uses a new idempotency key (a reused key would be replayed by Stripe and change nothing)', async () => {
    const first = undoSetup({ cancel_at: 1797072000 }, {}); await undoCancellation(stripeOwner);
    const k1 = (first.update.mock.calls[0] as unknown[])[2] as { idempotencyKey: string };
    const second = undoSetup({ cancel_at: 1797072000 }, {}); await undoCancellation(stripeOwner);
    const k2 = (second.update.mock.calls[0] as unknown[])[2] as { idempotencyKey: string };
    expect(k1.idempotencyKey).not.toBe(k2.idempotencyKey);
  });
  it('clears the flag when the flag is what is set', async () => {
    const { update } = undoSetup({ cancel_at_period_end: true, cancel_at: 1797072000 }, {});
    await undoCancellation(stripeOwner);
    expect(update).toHaveBeenCalledWith('sub_1', { cancel_at_period_end: false }, expect.anything());
  });
  it('does not report success while a schedule is still set after the update', async () => {
    undoSetup({ cancel_at: 1797072000 }, { cancel_at: 1797072000 });
    await expect(undoCancellation(stripeOwner)).rejects.toMatchObject({ code: 'provider_unavailable' });
  });
});

describe('public error bodies', () => {
  it('never include internal detail and stay neutral about NPI conflicts', () => {
    const { status, body } = errorBody(new PortalError('npi_unavailable', 'held by draft 123'));
    expect(status).toBe(409);
    expect(JSON.stringify(body)).not.toContain('123');
    expect(body.message).toBe("This NPI can't be registered right now.");
  });
});
