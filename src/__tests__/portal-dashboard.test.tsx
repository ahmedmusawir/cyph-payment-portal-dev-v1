/**
 * @jest-environment jsdom
 */
// APBM007A — /dashboard and /billing against GET /api/billing/overview (fetch mocked).
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DashboardView } from '@/components/portal/account/DashboardView';
import { externalRedirect } from '@/services/portal/navigate';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));
jest.mock('@/services/portal/navigate', () => ({ externalRedirect: jest.fn() }));

const subscription = (over: Record<string, unknown> = {}) => ({
  id: 'sub-row-1', origin: 'stripe', status: 'active', raw_status: 'active', quantity: 1,
  current_period_start: '2026-11-01T00:00:00Z', current_period_end: '2026-12-01T00:00:00Z', cancel_at: null, cancel_at_period_end: false,
  paid_through: '2026-11-30T00:00:00Z', latest_invoice_status: 'paid', grace_started_at: null, verified_at: '2026-11-12T00:00:00Z', ...over,
});
const overview = (over: Record<string, unknown> = {}) => ({
  account_id: 'acct-1',
  access: { state: 'active', read_only: false, origin: 'stripe', grace_ends_at: null, cancel_scheduled: false, policy_version: 'p1' },
  subscription: subscription(),
  stores: [{ id: 's1', name: 'Main Street Pharmacy', npi: '1234567893', status: 'active' }],
  ...over,
});
const CARD = { onFile: true, brand: 'visa', last4: '4242' };

type Reply = { status?: number; body: unknown };
type Call = { url: string; method: string };
function mockFetch(handler: (call: Call) => Reply) {
  const calls: Call[] = [];
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    const call = { url: String(url), method: init?.method ?? 'GET' };
    calls.push(call);
    const r = handler(call);
    const code = r.status ?? 200;
    return { ok: code < 300, status: code, json: async () => r.body };
  }) as unknown as typeof fetch;
  return calls;
}
const serve = (o: unknown, paymentMethod: unknown = CARD) => mockFetch((c) => (c.method === 'GET' ? { body: { overview: o, paymentMethod } } : { body: {} }));

beforeEach(() => {
  mockRouter.replace.mockClear();
  (externalRedirect as jest.Mock).mockClear();
});

describe('DashboardView — who may see billing', () => {
  it('not the owner (403): the owner-only screen with no billing data, plus Open OwedBook', async () => {
    const calls = mockFetch(() => ({ status: 403, body: { error: 'not_owner', message: 'Billing is managed by the account owner.' } }));
    render(<DashboardView page="billing" />);
    expect(await screen.findByRole('heading', { name: 'Billing is managed by the account owner' })).toBeTruthy();
    expect(screen.getByTestId('denied-view')).toBeTruthy();
    expect(screen.getByTestId('open-owedbook').getAttribute('href')).toBe('http://localhost:3000/api/handoff/start?return=/owedbook');
    for (const id of ['plan-summary', 'manage-billing', 'payment-method', 'pharmacies-section', 'undo-cancel']) expect(screen.queryByTestId(id)).toBeNull();
    expect(calls).toEqual([{ url: '/api/billing/overview', method: 'GET' }]);
  });

  it('signed out (401): goes to sign-in', async () => {
    mockFetch(() => ({ status: 401, body: { error: 'sign_in_required', message: 'Sign in to continue.' } }));
    render(<DashboardView page="dashboard" />);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/login?reason=session_expired'));
  });

  it('owner with no subscription and no stores: offers to start one', async () => {
    serve(overview({ subscription: null, stores: [], access: { state: 'none', read_only: false, origin: null, grace_ends_at: null, policy_version: 'p1' } }), 'not_applicable');
    render(<DashboardView page="dashboard" />);
    expect((await screen.findByTestId('no-subscription')).textContent).toContain('No subscription yet');
    expect(screen.getByRole('link', { name: 'Start a subscription' }).getAttribute('href')).toBe('/register/plan');
    expect(screen.queryByTestId('manage-billing')).toBeNull();
  });

  it('a load failure is an error screen with a retry, not an empty account', async () => {
    let fail = true;
    mockFetch(() => (fail ? { status: 502, body: { error: 'provider_unavailable', message: "We couldn't reach the payment provider. Nothing was charged. Try again shortly." } } : { body: { overview: overview(), paymentMethod: CARD } }));
    render(<DashboardView page="billing" />);
    const retry = await screen.findByTestId('load-retry');
    expect(screen.queryByTestId('plan-summary')).toBeNull();
    fail = false;
    await act(async () => {
      fireEvent.click(retry);
    });
    expect(screen.getByTestId('plan-summary')).toBeTruthy();
  });
});

describe('DashboardView — synthetic test account', () => {
  it('shows "Test account — no billing" and never calls the portal or undo routes', async () => {
    const calls = serve(
      overview({ subscription: subscription({ origin: 'synthetic_seed' }), access: { state: 'grace', read_only: false, origin: 'synthetic_seed', grace_ends_at: '2026-11-20T00:00:00Z', cancel_scheduled: true, policy_version: 'p1' } }),
      'not_applicable',
    );
    render(<DashboardView page="billing" />);
    expect((await screen.findByTestId('synthetic-panel')).textContent).toContain('Test account — no billing');
    for (const id of ['plan-summary', 'manage-billing', 'payment-method', 'undo-cancel', 'grace-update-card']) expect(screen.queryByTestId(id)).toBeNull();
    expect(screen.queryByRole('button', { name: /billing|cancel|card/i })).toBeNull();
    expect(calls.filter((c) => c.method !== 'GET')).toEqual([]);
  });
});

describe('DashboardView — real subscription', () => {
  it('billing page: plan, count, status, next payment, stores, card and one Manage billing action', async () => {
    serve(overview());
    render(<DashboardView page="billing" />);
    const plan = await screen.findByTestId('plan-summary');
    expect(plan.textContent).toContain('OwedBook');
    expect(screen.getByTestId('store-count').textContent).toBe('1');
    expect(screen.getByTestId('subscription-status').textContent).toBe('Active');
    expect(plan.textContent).toContain('Next payment');
    expect(screen.getByTestId('next-date').textContent).toBe('1 Dec 2026');
    expect(screen.getByTestId('payment-method').textContent).toBe('Visa •••• 4242');
    const stores = screen.getByTestId('pharmacies-section');
    expect(stores.textContent).toContain('Main Street Pharmacy');
    expect(stores.textContent).toContain('1234567893');
    // Deferred scope is visibly unavailable, never a working or fake control.
    expect(screen.getByTestId('add-store-unavailable').textContent).toBe('Adding a store is not available yet.');
    expect(screen.queryByRole('button', { name: /add a store|invite/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /add a store|invite|invoice|cancel/i })).toBeNull();
    expect(document.body.textContent).not.toMatch(/illustrative|demo|simulated|synthetic/i);
  });

  it('Manage billing opens the Stripe portal URL the server returns', async () => {
    const calls = mockFetch((c) => (c.url === '/api/billing/portal' ? { body: { url: 'https://billing.stripe.test/p/1' } } : { body: { overview: overview(), paymentMethod: CARD } }));
    render(<DashboardView page="billing" />);
    const target = await screen.findByTestId('manage-billing');
    await act(async () => {
      fireEvent.click(target);
    });
    expect(calls).toContainEqual({ url: '/api/billing/portal', method: 'POST' });
    expect(externalRedirect).toHaveBeenCalledWith('https://billing.stripe.test/p/1');
  });

  it('a portal that cannot open says so and changes nothing', async () => {
    mockFetch((c) => (c.url === '/api/billing/portal' ? { status: 502, body: { error: 'provider_unavailable', message: "We couldn't reach the payment provider. Nothing was charged. Try again shortly." } } : { body: { overview: overview(), paymentMethod: CARD } }));
    render(<DashboardView page="billing" />);
    const target = await screen.findByTestId('manage-billing');
    await act(async () => {
      fireEvent.click(target);
    });
    expect(screen.getByTestId('dashboard-banners').textContent).toContain("We couldn't open Stripe's billing page");
    expect(externalRedirect).not.toHaveBeenCalled();
  });

  it.each([
    [{ onFile: false }, 'No payment method on file — add one'],
    ['unknown', "Couldn't check your card right now"],
    [{ onFile: true }, 'Card on file'],
  ])('payment method %j reads %s', async (pm, line) => {
    serve(overview(), pm);
    render(<DashboardView page="billing" />);
    expect((await screen.findByTestId('payment-method')).textContent).toBe(line);
  });

  it('grace: reminder with the date the server gave', async () => {
    serve(overview({ subscription: subscription({ status: 'past_due' }), access: { state: 'grace', read_only: false, origin: 'stripe', grace_ends_at: '2026-11-20T09:30:00Z', cancel_scheduled: false, policy_version: 'p1' } }));
    render(<DashboardView page="dashboard" />);
    await screen.findByTestId('plan-summary');
    expect(screen.getByTestId('dashboard-banners').textContent).toContain('Update your card by 20 Nov 2026 to avoid read-only access.');
    expect(screen.getByTestId('subscription-status').textContent).toBe('Past due');
  });

  it('read-only and ended banners use the agreed words', async () => {
    serve(overview({ access: { state: 'read_only', read_only: true, origin: 'stripe', grace_ends_at: null, policy_version: 'p1' } }));
    const first = render(<DashboardView page="billing" />);
    await screen.findByTestId('plan-summary');
    expect(screen.getByTestId('dashboard-banners').textContent).toContain('Your account is read-only until billing is fixed');
    first.unmount();

    serve(overview({ subscription: subscription({ status: 'canceled' }), access: { state: 'ended', read_only: true, origin: 'stripe', grace_ends_at: null, policy_version: 'p1' } }));
    render(<DashboardView page="billing" />);
    await screen.findByTestId('plan-summary');
    expect(screen.getByTestId('dashboard-banners').textContent).toContain('Your subscription has ended. Your data is kept read-only.');
    expect(screen.getByTestId('plan-summary').textContent).toContain('Paid through');
  });

  it('cancel scheduled: end date, and Undo cancellation calls undo-cancel then reloads the overview', async () => {
    let scheduled = true;
    const calls = mockFetch((c) => {
      if (c.url === '/api/billing/undo-cancel') {
        scheduled = false;
        return { body: { cleared: true } };
      }
      return { body: { overview: overview({ access: { state: 'active', read_only: false, origin: 'stripe', grace_ends_at: null, cancel_scheduled: scheduled, policy_version: 'p1' } }), paymentMethod: CARD } };
    });
    render(<DashboardView page="billing" />);
    const undo = await screen.findByTestId('undo-cancel');
    expect(screen.getByTestId('dashboard-banners').textContent).toContain('Your subscription ends on 30 Nov 2026');
    expect(screen.getByTestId('subscription-status').textContent).toBe('Cancellation scheduled');
    expect(undo.textContent).toBe('Undo cancellation');
    await act(async () => {
      fireEvent.click(undo);
    });
    expect(calls).toEqual([
      { url: '/api/billing/overview', method: 'GET' },
      { url: '/api/billing/undo-cancel', method: 'POST' },
      { url: '/api/billing/overview', method: 'GET' },
    ]);
    expect(screen.queryByTestId('undo-cancel')).toBeNull();
    expect(screen.getByTestId('subscription-status').textContent).toBe('Active');
  });

  it('an undo that fails says the subscription is still set to end', async () => {
    mockFetch((c) => (c.url === '/api/billing/undo-cancel' ? { status: 502, body: { error: 'provider_unavailable', message: "We couldn't reach the payment provider. Nothing was charged. Try again shortly." } } : { body: { overview: overview({ access: { state: 'active', read_only: false, origin: 'stripe', grace_ends_at: null, cancel_scheduled: true, policy_version: 'p1' } }), paymentMethod: CARD } }));
    render(<DashboardView page="billing" />);
    const target = await screen.findByTestId('undo-cancel');
    await act(async () => {
      fireEvent.click(target);
    });
    expect(screen.getByTestId('dashboard-banners').textContent).toContain('Your subscription is still set to end.');
    expect(screen.getByTestId('undo-cancel')).toBeTruthy();
  });

  it('dashboard page: links to OwedBook and Billing instead of the Stripe actions', async () => {
    const calls = serve(overview());
    render(<DashboardView page="dashboard" />);
    await screen.findByTestId('plan-summary');
    expect(screen.getByTestId('go-billing').getAttribute('href')).toBe('/billing');
    expect(screen.getByTestId('open-owedbook').getAttribute('href')).toBe('http://localhost:3000/api/handoff/start?return=/owedbook');
    expect(screen.queryByTestId('manage-billing')).toBeNull();
    expect(calls).toEqual([{ url: '/api/billing/overview', method: 'GET' }]);
  });
});
