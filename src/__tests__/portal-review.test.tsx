/**
 * @jest-environment jsdom
 */
// APBM007A — review step against the real API contract (fetch mocked): amounts come only from the
// server quote, a rejected code shows the server's one generic message, all three consents are required,
// and the checkout operation key is reused on retry.
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReviewView } from '@/components/portal/register/ReviewView';
import { externalRedirect } from '@/services/portal/navigate';
import { REGISTRATION_SESSION_KEY, registrationSessionStore } from '@/services/portal/registrationSession';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));
jest.mock('@/services/portal/navigate', () => ({ externalRedirect: jest.fn() }));

const future = () => new Date(Date.now() + 20 * 60 * 1000).toISOString();
const quote = (over: Record<string, unknown> = {}) => ({ subtotalCents: 12345, discountCents: 0, totalCents: 12345, currency: 'USD', promotionCode: null, expiresAt: future(), expired: false, ...over });
const draft = (over: Record<string, unknown> = {}) => ({
  revision: 3, status: 'draft',
  owner: { firstName: 'Jordan', lastName: 'Ellis', email: 'jordan@example.test', mobile: '(555) 010-0144', ownerDeclarationAccepted: true },
  pharmacy: { name: 'Main Street Pharmacy', street: '1 Main St', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0145', npi: '1234567893', ncpdp: '', software: 'Liberty' },
  quote: quote(), termsVersion: 'terms-2026-11', ...over,
});

type Reply = { status?: number; body: unknown };
type Call = { url: string; method: string; body: any };
function mockFetch(handler: (call: Call, n: number) => Reply) {
  const calls: Call[] = [];
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    const call = { url: String(url), method: init?.method ?? 'GET', body: init?.body ? JSON.parse(String(init.body)) : undefined };
    calls.push(call);
    const r = handler(call, calls.filter((c) => c.url === call.url && c.method === call.method).length);
    const status = r.status ?? 200;
    return { ok: status < 300, status, json: async () => r.body };
  }) as unknown as typeof fetch;
  return calls;
}
const of = (calls: Call[], method: string, url: string) => calls.filter((c) => c.method === method && c.url === url);
const tickAll = () => ['c1', 'c2', 'c3'].forEach((id) => fireEvent.click(document.getElementById(id)!));
const pay = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTestId('continue-payment'));
  });
};

beforeEach(() => {
  sessionStorage.clear();
  registrationSessionStore.setState({ owner: null, pharmacy: null, operationKey: null });
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  (externalRedirect as jest.Mock).mockClear();
});

describe('ReviewView — server quote', () => {
  it('shows exactly the amounts the server returned and asks for no new quote while one is current', async () => {
    const calls = mockFetch(() => ({ body: { draft: draft({ quote: quote({ subtotalCents: 12345, discountCents: 1234, totalCents: 11111, promotionCode: 'APA2026' }) }) } }));
    render(<ReviewView />);
    expect((await screen.findByTestId('due-today')).textContent).toBe('$111.11');
    expect(screen.getByTestId('subtotal').textContent).toBe('$123.45');
    expect(screen.getByTestId('discount').textContent).toBe('−$12.34');
    expect(screen.getByTestId('recurring-inline').textContent).toBe('$111.11');
    expect(screen.getByLabelText(/APA member code/)).toBeTruthy();
    expect(of(calls, 'POST', '/api/registration/quote')).toHaveLength(0);
    // Nothing illustrative or simulated on a customer page.
    expect(document.body.textContent).not.toMatch(/illustrative|demo|simulated/i);
  });

  it('requests a quote when the draft has none, then shows it', async () => {
    const calls = mockFetch((c) => (c.method === 'GET' ? { body: { draft: draft({ quote: null }) } } : { body: { draft: draft({ quote: quote({ subtotalCents: 9900, totalCents: 9900 }) }) } }));
    render(<ReviewView />);
    expect((await screen.findByTestId('due-today')).textContent).toBe('$99.00');
    expect(of(calls, 'POST', '/api/registration/quote')).toEqual([{ url: '/api/registration/quote', method: 'POST', body: {} }]);
  });

  it('a quote that cannot be loaded pauses payment and shows the server message', async () => {
    mockFetch((c) => (c.method === 'GET' ? { body: { draft: draft({ quote: null }) } } : { status: 502, body: { error: 'provider_unavailable', message: "We couldn't reach the payment provider. Nothing was charged. Try again shortly." } }));
    render(<ReviewView />);
    expect(await screen.findByText('Price unavailable')).toBeTruthy();
    expect(screen.queryByTestId('due-today')).toBeNull();
    expect((screen.getByTestId('continue-payment') as HTMLButtonElement).disabled).toBe(true);
  });

  it('a code that cannot be applied shows the one generic server message and keeps the price', async () => {
    const calls = mockFetch((c) => (c.method === 'GET' ? { body: { draft: draft() } } : { status: 422, body: { error: 'promotion_not_accepted', message: "That code can't be applied." } }));
    render(<ReviewView />);
    await screen.findByTestId('due-today');
    fireEvent.change(screen.getByLabelText(/APA member code/), { target: { value: 'nope1' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    });
    expect(of(calls, 'POST', '/api/registration/quote')[0].body).toEqual({ code: 'nope1' });
    expect(document.getElementById('code-msg')!.textContent).toBe("That code can't be applied.");
    expect(screen.getByLabelText(/APA member code/).getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByTestId('due-today').textContent).toBe('$123.45');
  });

  it('applying and removing a code re-quotes on the server and clears earlier consent', async () => {
    const withCode = draft({ quote: quote({ discountCents: 2345, totalCents: 10000, promotionCode: 'APA2026' }) });
    const calls = mockFetch((c) => (c.method === 'GET' ? { body: { draft: draft() } } : { body: { draft: c.body.code ? withCode : draft() } }));
    render(<ReviewView />);
    await screen.findByTestId('due-today');
    tickAll();
    fireEvent.change(screen.getByLabelText(/APA member code/), { target: { value: 'apa2026' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    });
    expect(screen.getByTestId('due-today').textContent).toBe('$100.00');
    expect((document.getElementById('c1') as HTMLInputElement).checked).toBe(false);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    });
    expect(of(calls, 'POST', '/api/registration/quote').map((c) => c.body)).toEqual([{ code: 'apa2026' }, {}]);
    expect(screen.getByTestId('due-today').textContent).toBe('$123.45');
  });
});

describe('ReviewView — consents and checkout', () => {
  it('needs all three consents before any checkout request', async () => {
    const calls = mockFetch(() => ({ body: { draft: draft() } }));
    render(<ReviewView />);
    await screen.findByTestId('due-today');
    await pay();
    expect(screen.getByTestId('consent-error').textContent).toContain('Three confirmations are needed before payment');
    fireEvent.click(document.getElementById('c1')!);
    fireEvent.click(document.getElementById('c2')!);
    await pay();
    expect(document.getElementById('c3')!.getAttribute('aria-invalid')).toBe('true');
    expect(of(calls, 'POST', '/api/registration/checkout')).toHaveLength(0);
    expect(externalRedirect).not.toHaveBeenCalled();
  });

  it('with all three consents it posts the key and consents and goes to the Stripe URL', async () => {
    const calls = mockFetch((c) => (c.url === '/api/registration/checkout' ? { body: { url: 'https://checkout.stripe.test/c/pay_1' } } : { body: { draft: draft() } }));
    render(<ReviewView />);
    await screen.findByTestId('due-today');
    tickAll();
    await pay();
    const [post] = of(calls, 'POST', '/api/registration/checkout');
    expect(post.body.consents).toEqual({ termsAccepted: true, recurringChargeAccepted: true, priceChangeAccepted: true });
    expect(post.body.operationKey).toMatch(/^[A-Za-z0-9_-]{16,128}$/);
    expect(Object.keys(post.body).sort()).toEqual(['consents', 'operationKey']); // no amount, price or account from the browser
    expect(externalRedirect).toHaveBeenCalledWith('https://checkout.stripe.test/c/pay_1');
  });

  it('reuses the same operation key on retry and keeps it in sessionStorage', async () => {
    const calls = mockFetch((c, n) =>
      c.url !== '/api/registration/checkout'
        ? { body: { draft: draft() } }
        : n === 1
          ? { status: 502, body: { error: 'provider_unavailable', message: "We couldn't reach the payment provider. Nothing was charged. Try again shortly." } }
          : { body: { url: 'https://checkout.stripe.test/c/pay_2' } },
    );
    render(<ReviewView />);
    await screen.findByTestId('due-today');
    tickAll();
    await pay();
    expect(screen.getByTestId('checkout-problem').textContent).toContain('Nothing was charged');
    expect(externalRedirect).not.toHaveBeenCalled();
    await pay();
    const posts = of(calls, 'POST', '/api/registration/checkout');
    expect(posts).toHaveLength(2);
    expect(posts[1].body.operationKey).toBe(posts[0].body.operationKey);
    expect(JSON.parse(sessionStorage.getItem(REGISTRATION_SESSION_KEY)!).state.operationKey).toBe(posts[0].body.operationKey);
    expect(externalRedirect).toHaveBeenCalledWith('https://checkout.stripe.test/c/pay_2');
  });

  it('an expired quote at checkout asks the server for a new one and never leaves the page', async () => {
    const calls = mockFetch((c) =>
      c.url === '/api/registration/checkout'
        ? { status: 410, body: { error: 'expired', message: 'This has expired. Start again.' } }
        : c.method === 'POST'
          ? { body: { draft: draft({ quote: quote({ subtotalCents: 9900, totalCents: 9900 }) }) } }
          : { body: { draft: draft() } },
    );
    render(<ReviewView />);
    await screen.findByTestId('due-today');
    tickAll();
    await pay();
    await waitFor(() => expect(screen.getByTestId('due-today').textContent).toBe('$99.00'));
    expect(of(calls, 'POST', '/api/registration/quote')).toHaveLength(1);
    expect(screen.getByTestId('checkout-problem').textContent).toContain('nothing was charged');
    expect((document.getElementById('c1') as HTMLInputElement).checked).toBe(false);
    expect(externalRedirect).not.toHaveBeenCalled();
  });

  it('a payment already in progress points to the status page', async () => {
    mockFetch((c) => (c.url === '/api/registration/checkout' ? { status: 409, body: { error: 'operation_in_progress', message: 'A payment for this registration is already in progress. Check its status before trying again.' } } : { body: { draft: draft() } }));
    render(<ReviewView />);
    await screen.findByTestId('due-today');
    tickAll();
    await pay();
    expect(screen.getByRole('link', { name: 'Check its status' }).getAttribute('href')).toBe('/register/activation');
  });
});

describe('ReviewView — route guards', () => {
  it('a draft that already went to checkout hands over to the status page', async () => {
    mockFetch(() => ({ body: { draft: draft({ status: 'checkout_started' }) } }));
    render(<ReviewView />);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/register/activation'));
    expect(screen.queryByTestId('continue-payment')).toBeNull();
  });

  it('no saved draft goes back to the owner step', async () => {
    mockFetch(() => ({ body: { draft: null } }));
    render(<ReviewView />);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/register/owner'));
  });
});
