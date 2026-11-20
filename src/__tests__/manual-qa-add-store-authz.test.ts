/** @jest-environment node */
// Manual QA final batch (20 Nov 2026) — Add Store authorization regressions. The page /stores/add is guarded on the server
// before the form renders, and every associated operation (quote, confirm/pay, status/resume, abandon, the operations list
// used for recovery, removal and undo) refuses anyone who is not the account owner, and refuses operations of another
// account. Owner authority is the database's (owner_billing_overview raises 42501 for admins, members and outsiders); the
// double below reproduces that, and asserts that no refused caller reaches the service-role database or Stripe.
import { NextRequest } from 'next/server';

const OWN_ACCOUNT = 'acc-own', OTHER_ACCOUNT = 'acc-other';
const OWN_OP = '11111111-1111-4111-8111-111111111111', FOREIGN_OP = '22222222-2222-4222-8222-222222222222';
const STORE = '33333333-3333-4333-8333-333333333333', QUOTE = '44444444-4444-4444-8444-444444444444';
type Who = 'owner' | 'admin' | 'member' | 'other_owner' | 'anon' | 'broken';
const mockState = { who: 'owner' as Who, serviceCalls: [] as string[], stripeCalls: 0, claimResult: null as unknown };

const overviewFor = (account: string) => ({
  account_id: account, access: { state: 'active', read_only: false, origin: 'stripe', grace_ends_at: null, policy_version: 'v1' },
  subscription: { id: `sub-row-${account}`, origin: 'stripe', status: 'active', raw_status: 'active', quantity: 3, current_period_start: null, current_period_end: null,
    cancel_at: null, cancel_at_period_end: false, paid_through: null, latest_invoice_status: 'paid', grace_started_at: null, verified_at: null },
  stores: [],
});
jest.mock('@/utils/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => (mockState.who === 'anon' ? { data: { user: null } } : { data: { user: { id: `user-${mockState.who}`, email: 'x@example.invalid' } } }) },
    rpc: async (fn: string) => {
      const w = mockState.who;
      if (w === 'broken') return { data: null, error: { code: '08006' } };
      if (fn === 'owner_billing_overview' || fn === 'owner_store_operations') {
        if (w === 'admin' || w === 'member' || w === 'anon') return { data: null, error: { code: '42501' } };
        if (fn === 'owner_store_operations') return { data: [{ id: OWN_OP, state: 'activated' }], error: null };
        return { data: overviewFor(w === 'owner' ? OWN_ACCOUNT : OTHER_ACCOUNT), error: null };
      }
      return { data: null, error: { code: 'unexpected' } };
    },
  }),
}));
const op = (id: string, account: string) => ({ id, account_id: account, kind: 'store_add', state: 'activated', intent_key: 'k', actor_user_id: 'u', quote_id: QUOTE,
  business_id: STORE, store_name: 'Stark Test Pharmacy 04', npi: '1234567893', amount_cents: 100, currency: 'usd', payment_deadline: null, stripe_customer_id: 'cus',
  stripe_subscription_id: 'sub', stripe_item_id: 'si', period_start: null, period_end: null, target_quantity: 4, invoice_id: 'in', hosted_invoice_url: 'https://invoice.invalid/x',
  last_error_code: null, transfer_id: null, created_at: '2026-11-20T00:00:00Z', fencing_epoch: 1, provider_paid_at: null, close_reference: null });
jest.mock('@/server/db', () => ({
  rpc: async (fn: string) => { mockState.serviceCalls.push(`rpc:${fn}`); if (fn === 'store_operation_claim') return mockState.claimResult; return null; },
  admin: () => ({ from: (table: string) => {
    mockState.serviceCalls.push(`from:${table}`);
    const filters: Record<string, unknown> = {};
    const q = { select: () => q, eq: (k: string, v: unknown) => { filters[k] = v; return q; }, maybeSingle: async () => {
      if (table === 'subscriptions') return { data: { stripe_customer_id: 'cus', stripe_subscription_id: 'sub' }, error: null };
      if (table === 'store_operations') return { data: filters.id === OWN_OP ? op(OWN_OP, OWN_ACCOUNT) : filters.id === FOREIGN_OP ? op(FOREIGN_OP, OTHER_ACCOUNT) : null, error: null };
      return { data: null, error: null };
    } };
    return q;
  } }),
}));
jest.mock('@/server/stripeClient', () => ({
  stripeCall: (_n: string, fn: () => unknown) => fn(), assertStripeAccount: async () => undefined,
  stripeNames: () => ({ priceId: 'price', portalConfiguration: 'x', expectedAccount: 'x', webhookSecret: 'x' }),
  stripe: () => { mockState.stripeCalls++; throw new Error('Stripe must not be reached in these cases'); },
}));
jest.mock('next/navigation', () => ({ redirect: (to: string) => { throw new Error(`NEXT_REDIRECT:${to}`); } }));

import { ownOrigin } from '@/lib/appIdentity';
import { POST as quote } from '@/app/api/stores/add/quote/route';
import { POST as confirm } from '@/app/api/stores/add/confirm/route';
import { POST as status } from '@/app/api/stores/add/status/route';
import { POST as abandon } from '@/app/api/stores/add/abandon/route';
import { GET as operations } from '@/app/api/stores/operations/route';
import { POST as removal } from '@/app/api/stores/[id]/removal/route';
import { POST as undo } from '@/app/api/stores/[id]/removal/undo/route';
import { ownerAccess } from '@/server/billing';
import AddStorePage from '@/app/(account)/stores/add/page';
import { AddStoreFlow } from '@/components/portal/account/AddStoreFlow';
import { OwnerOnlyNotice } from '@/components/portal/account/OwnerOnlyNotice';

const post = (path: string, body: unknown) => new NextRequest(`${ownOrigin()}${path}`, { method: 'POST', headers: { origin: ownOrigin(), 'content-type': 'application/json' }, body: JSON.stringify(body) });
const KEY = 'intent_key_0123456789';
const calls: Record<string, () => Promise<Response>> = {
  quote: () => quote(post('/api/stores/add/quote', { storeName: 'Stark Test Pharmacy 04', npi: '1234567893' })),
  confirm: () => confirm(post('/api/stores/add/confirm', { quoteId: QUOTE, intentKey: KEY, consentTerms: true, consentRecurring: true, consentImmediate: true })),
  status: () => status(post('/api/stores/add/status', { operationId: OWN_OP })),
  abandon: () => abandon(post('/api/stores/add/abandon', { operationId: OWN_OP })),
  operations: () => operations(),
  removal: () => removal(post(`/api/stores/${STORE}/removal`, { intentKey: KEY }), { params: Promise.resolve({ id: STORE }) }),
  undo: () => undo(post(`/api/stores/${STORE}/removal/undo`, { intentKey: KEY }), { params: Promise.resolve({ id: STORE }) }),
};

beforeAll(() => { process.env.NEXT_PUBLIC_SITE_URL = ownOrigin(); });
beforeEach(() => { mockState.serviceCalls = []; mockState.stripeCalls = 0; mockState.claimResult = null; });

describe('every Add Store / removal operation refuses non-owners before any privileged call', () => {
  it.each(Object.keys(calls).flatMap((name) => [['admin', name], ['member', name]] as const))('%s → %s: 403 not_owner, no service-role or Stripe call', async (who, name) => {
    mockState.who = who;
    const r = await calls[name]();
    expect(r.status).toBe(403);
    expect(await r.json()).toMatchObject({ error: 'not_owner', message: 'Billing is managed by the account owner.' });
    expect(mockState.serviceCalls).toEqual([]);
    expect(mockState.stripeCalls).toBe(0);
  });
  it.each(Object.keys(calls))('signed out → %s: refused (401/403), no service-role or Stripe call', async (name) => {
    mockState.who = 'anon';
    const r = await calls[name]();
    expect([401, 403]).toContain(r.status);
    expect(mockState.serviceCalls).toEqual([]);
    expect(mockState.stripeCalls).toBe(0);
  });
});

describe('operation ownership (cross-account)', () => {
  it('another account owner cannot read or abandon this account\'s operation: 404, nothing advanced', async () => {
    mockState.who = 'other_owner';
    for (const r of [await calls.status(), await calls.abandon()]) {
      expect(r.status).toBe(404);
      expect((await r.json()).error).toBe('not_found');
    }
    expect(mockState.serviceCalls.filter((c) => c.startsWith('rpc:'))).toEqual([]);   // no cancel request, no lease, no advance
    expect(mockState.stripeCalls).toBe(0);
  });
  it('a quote of another account is refused by the claim (database checks quote actor and owner): 403, nothing advanced', async () => {
    mockState.who = 'other_owner';
    mockState.claimResult = { error: 'not_owner' };
    const r = await calls.confirm();
    expect(r.status).toBe(403);
    expect(mockState.serviceCalls.filter((c) => c.startsWith('rpc:'))).toEqual(['rpc:store_operation_claim']);
    expect(mockState.stripeCalls).toBe(0);
  });
  it('a claim that returns an operation of another account is still refused before advancing', async () => {
    mockState.who = 'owner';
    mockState.claimResult = { operation: op(FOREIGN_OP, OTHER_ACCOUNT) };
    const r = await calls.confirm();
    expect(r.status).toBe(403);
    expect(mockState.serviceCalls.filter((c) => c.startsWith('rpc:'))).toEqual(['rpc:store_operation_claim']);
  });
});

describe('the legitimate owner keeps working', () => {
  it('the owner reads their own operation (resume after reload) and lists their operations', async () => {
    mockState.who = 'owner';
    const s = await calls.status();
    expect(s.status).toBe(200);
    expect((await s.json()).data).toMatchObject({ operationId: OWN_OP, state: 'activated', hostedPaymentUrl: null });
    const l = await calls.operations();
    expect(l.status).toBe(200);
    expect((await l.json()).data).toEqual([{ id: OWN_OP, state: 'activated' }]);
  });
});

describe('/stores/add page guard (server, before the form renders)', () => {
  const fakeClient = (rpc: () => unknown) => ({ rpc: async () => rpc() }) as never;
  it('ownerAccess: owner / not_owner (42501) / unavailable (fails closed on any other error)', async () => {
    expect(await ownerAccess(fakeClient(() => ({ data: overviewFor(OWN_ACCOUNT), error: null })))).toBe('owner');
    expect(await ownerAccess(fakeClient(() => ({ data: null, error: { code: '42501' } })))).toBe('not_owner');
    expect(await ownerAccess(fakeClient(() => ({ data: null, error: { code: '08006' } })))).toBe('unavailable');
  });
  it.each([['owner', 'flow'], ['admin', 'notice'], ['member', 'notice'], ['broken', 'failed']] as const)('%s → %s', async (who, expected) => {
    mockState.who = who;
    const el = (await AddStorePage()) as { type: unknown; props: Record<string, unknown> };
    if (expected === 'flow') expect(el.type).toBe(AddStoreFlow);
    if (expected === 'notice') { expect(el.type).toBe(OwnerOnlyNotice); expect(el.props.context).toMatch(/only the account owner/); }
    if (expected === 'failed') { expect(el.type).not.toBe(AddStoreFlow); expect(el.type).not.toBe(OwnerOnlyNotice); }
    expect(mockState.stripeCalls).toBe(0);
  });
  it('signed out → redirected to /login before any check', async () => {
    mockState.who = 'anon';
    await expect(AddStorePage()).rejects.toThrow('NEXT_REDIRECT:/login');
  });
});
