/** @jest-environment node */
// APBM007A — the browser API client: request shapes and the mapping of the server's JSON error body
// `{error, message, fieldErrors?}` to the client result. fetch is mocked; nothing leaves the process.
import { portalApi, toApiError } from '@/services/portal/portalApi';

type Reply = { status?: number; body?: unknown; throws?: boolean; notJson?: boolean };
function mockFetch(reply: Reply) {
  const fn = jest.fn(async (_url: string, _init?: RequestInit) => {
    if (reply.throws) throw new Error('offline');
    const status = reply.status ?? 200;
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => {
        if (reply.notJson) throw new Error('not json');
        return reply.body;
      },
    };
  });
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}
const sent = (fn: jest.Mock, i = 0) => {
  const [url, init] = fn.mock.calls[i] as [string, RequestInit];
  return { url, method: init.method, headers: init.headers, body: init.body ? JSON.parse(String(init.body)) : undefined };
};

describe('toApiError', () => {
  it('keeps the public code, message and field errors', () => {
    expect(toApiError(400, { error: 'invalid_input', message: 'Check the highlighted fields and try again.', fieldErrors: { 'owner.email': 'Check this field.', 'pharmacy.npi': 'An NPI has exactly 10 digits.' } })).toEqual({
      ok: false, status: 400, code: 'invalid_input', message: 'Check the highlighted fields and try again.',
      fieldErrors: { 'owner.email': 'Check this field.', 'pharmacy.npi': 'An NPI has exactly 10 digits.' },
    });
  });

  it.each([
    [409, 'npi_unavailable'], [409, 'operation_in_progress'], [409, 'already_subscribed'], [409, 'not_billable'], [410, 'expired'],
    [422, 'promotion_not_accepted'], [429, 'slow_down'], [502, 'provider_unavailable'], [401, 'sign_in_required'], [403, 'not_owner'],
    [502, 'sign_out_incomplete'],
  ] as const)('%i %s is passed through with the server message', (status, code) => {
    expect(toApiError(status, { error: code, message: 'Server words.' })).toEqual({ ok: false, status, code, message: 'Server words.' });
  });

  it('an unrecognised or malformed body becomes a generic error, never a raw dump', () => {
    for (const body of [null, 'oops', [], { error: 'DROP TABLE', message: 42 }, { fieldErrors: { a: 1 } }]) {
      const e = toApiError(500, body);
      expect(e).toEqual({ ok: false, status: 500, code: 'unexpected', message: 'Something went wrong on our side. Try again in a moment.' });
    }
  });
});

describe('portalApi requests', () => {
  it('reads the draft with a plain GET', async () => {
    const fn = mockFetch({ body: { draft: null } });
    await expect(portalApi.getDraft()).resolves.toEqual({ ok: true, value: null });
    expect(fn.mock.calls[0][0]).toBe('/api/registration/draft');
    expect((fn.mock.calls[0][1] as RequestInit).method).toBe('GET');
  });

  it('saves owner and pharmacy in one JSON POST', async () => {
    const fn = mockFetch({ body: { draft: { revision: 2 } } });
    const owner = { firstName: 'A', lastName: 'B', email: 'a@b.test', mobile: '5550100144', ownerDeclarationAccepted: true as const };
    const pharmacy = { name: 'Main St', street: '1 Main', city: 'Town', state: 'TX', zip: '75001', phone: '5550100145', npi: '1234567893', software: 'Liberty' as const };
    await expect(portalApi.saveDraft({ owner, pharmacy })).resolves.toEqual({ ok: true, value: { revision: 2 } });
    expect(sent(fn)).toEqual({ url: '/api/registration/draft', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { owner, pharmacy } });
  });

  it('sends a code only when there is one', async () => {
    const fn = mockFetch({ body: { draft: {} } });
    await portalApi.requestQuote();
    await portalApi.requestQuote('  apa2026 ');
    expect(sent(fn, 0)).toMatchObject({ url: '/api/registration/quote', method: 'POST', body: {} });
    expect(sent(fn, 1).body).toEqual({ code: 'apa2026' });
  });

  it('checkout sends the operation key and consents, and returns the Stripe URL', async () => {
    const fn = mockFetch({ body: { url: 'https://checkout.stripe.test/c/1' } });
    const consents = { termsAccepted: true, recurringChargeAccepted: true, priceChangeAccepted: true };
    await expect(portalApi.startCheckout('reg_key_0123456789', consents)).resolves.toEqual({ ok: true, value: 'https://checkout.stripe.test/c/1' });
    expect(sent(fn)).toMatchObject({ url: '/api/registration/checkout', method: 'POST', body: { operationKey: 'reg_key_0123456789', consents } });
  });

  it('go back and edit is a DELETE on the checkout', async () => {
    const fn = mockFetch({ body: { status: 'draft' } });
    await expect(portalApi.cancelCheckout()).resolves.toEqual({ ok: true, value: 'draft' });
    expect(sent(fn)).toMatchObject({ url: '/api/registration/checkout', method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
  });

  it('status: plain, reconcile, and resend', async () => {
    const fn = mockFetch({ body: { status: { draft: 'none' }, result: 'request_received' } });
    await portalApi.getStatus();
    await portalApi.getStatus({ reconcile: true });
    await expect(portalApi.resendAccessEmail()).resolves.toEqual({ ok: true, value: 'request_received' });
    expect(fn.mock.calls.map((c) => [c[0], (c[1] as RequestInit).method])).toEqual([
      ['/api/registration/status', 'GET'], ['/api/registration/status?reconcile=1', 'GET'], ['/api/registration/status', 'POST'],
    ]);
  });

  it('billing: overview, portal and undo', async () => {
    const fn = mockFetch({ body: { overview: {}, paymentMethod: 'unknown', url: 'https://billing.stripe.test/p', cleared: true } });
    await expect(portalApi.getBillingOverview()).resolves.toMatchObject({ ok: true, value: { paymentMethod: 'unknown' } });
    await expect(portalApi.openBillingPortal()).resolves.toEqual({ ok: true, value: 'https://billing.stripe.test/p' });
    await expect(portalApi.undoCancel()).resolves.toEqual({ ok: true, value: true });
    expect(fn.mock.calls.map((c) => [c[0], (c[1] as RequestInit).method])).toEqual([
      ['/api/billing/overview', 'GET'], ['/api/billing/portal', 'POST'], ['/api/billing/undo-cancel', 'POST'],
    ]);
  });
});

describe('portalApi failures', () => {
  it('a failed response is mapped from its JSON body', async () => {
    mockFetch({ status: 409, body: { error: 'npi_unavailable', message: "This NPI can't be registered right now." } });
    await expect(portalApi.saveDraft({} as never)).resolves.toEqual({ ok: false, status: 409, code: 'npi_unavailable', message: "This NPI can't be registered right now." });
  });

  it('no connection is a network error with status 0', async () => {
    mockFetch({ throws: true });
    await expect(portalApi.getStatus()).resolves.toMatchObject({ ok: false, status: 0, code: 'network' });
  });

  it('a non-JSON reply is unexpected, whatever its status', async () => {
    mockFetch({ status: 200, notJson: true });
    await expect(portalApi.getDraft()).resolves.toMatchObject({ ok: false, code: 'unexpected' });
    mockFetch({ status: 500, notJson: true });
    await expect(portalApi.getDraft()).resolves.toMatchObject({ ok: false, status: 500, code: 'unexpected' });
  });

  it('sign-out reports the server message on 502', async () => {
    mockFetch({ status: 502, body: { error: 'sign_out_incomplete', message: "You are signed out on this browser, but we couldn't confirm sign-out everywhere. Try again." } });
    await expect(portalApi.signOut()).resolves.toMatchObject({ ok: false, status: 502, code: 'sign_out_incomplete', message: expect.stringContaining("couldn't confirm sign-out everywhere") });
    mockFetch({ body: { message: 'Logged out successfully' } });
    await expect(portalApi.signOut()).resolves.toEqual({ ok: true, value: true });
  });

  it('sign-in passes the login route’s error text through', async () => {
    const fn = mockFetch({ status: 400, body: { error: 'Invalid login credentials' } });
    await expect(portalApi.signIn('a@b.test', 'pw')).resolves.toMatchObject({ ok: false, status: 400, message: 'Invalid login credentials' });
    expect(sent(fn)).toMatchObject({ url: '/api/auth/login', method: 'POST', body: { email: 'a@b.test', password: 'pw' } });
  });
});
