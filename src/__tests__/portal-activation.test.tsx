/**
 * @jest-environment jsdom
 */
// APBM007A — the registration status page, driven only by the server's StatusView (fetch mocked).
// An unconfirmed payment never invites a second payment; resend follows the one-minute rule.
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ActivationView } from '@/components/portal/activation/ActivationView';
import { registrationSessionStore } from '@/services/portal/registrationSession';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));

const status = (over: Record<string, unknown> = {}) => ({
  draft: 'checkout', payment: 'pending', provisioning: 'not_started', email: 'not_started', ownerEmailMasked: 'j•••••@example.test', checkoutResumable: false, ...over,
});
const READY = { draft: 'complete', payment: 'confirmed', provisioning: 'ready' };

type Reply = { status?: number; body: unknown };
type Call = { url: string; method: string };
function mockFetch(handler: (call: Call, n: number) => Reply) {
  const calls: Call[] = [];
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    const call = { url: String(url), method: init?.method ?? 'GET' };
    calls.push(call);
    const r = handler(call, calls.length);
    const code = r.status ?? 200;
    return { ok: code < 300, status: code, json: async () => r.body };
  }) as unknown as typeof fetch;
  return calls;
}
const always = (s: Record<string, unknown>) => mockFetch((c) => (c.method === 'POST' ? { body: { result: 'request_received' } } : { body: { status: s } }));

beforeEach(() => {
  sessionStorage.clear();
  registrationSessionStore.setState({ owner: null, pharmacy: null, operationKey: null });
  mockRouter.push.mockClear();
});
afterEach(() => jest.useRealTimers());

describe('ActivationView — honest states', () => {
  it('asks the server to confirm with Stripe once, on load', async () => {
    const calls = always(status({ ...READY, email: 'sent' }));
    render(<ActivationView />);
    await screen.findByTestId('activation-tracks');
    expect(calls).toEqual([{ url: '/api/registration/status?reconcile=1', method: 'GET' }]);
  });

  it('payment unknown: says do not pay again and offers nothing that could start a payment', async () => {
    always(status({ payment: 'unknown' }));
    render(<ActivationView />);
    const box = await screen.findByTestId('activation-unknown');
    expect(box.textContent).toContain("We're confirming your payment — do not pay again");
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe("We're confirming your payment");
    const text = document.body.textContent ?? '';
    // Every mention of paying again is a "do not".
    const mentions = text.match(/.{0,8}pay again/g) ?? [];
    expect(mentions.length).toBeGreaterThan(0);
    for (const m of mentions) expect(m).toMatch(/(not|n't) pay again$/);
    expect(text).not.toMatch(/payment (failed|didn't go through|was declined)|try (the )?payment|continue to (secure )?payment/i);
    expect(screen.queryByRole('link', { name: /review|payment|checkout/i })).toBeNull();
    expect(screen.queryByTestId('go-back-edit')).toBeNull();
    expect(screen.queryByTestId('resend')).toBeNull();
    expect(screen.getByTestId('check-again')).toBeTruthy();
  });

  it('payment pending with an open checkout: go back and edit closes it on the server first', async () => {
    registrationSessionStore.setState({ operationKey: 'reg_old_key_0123456789' });
    const calls = mockFetch((c) => (c.method === 'DELETE' ? { body: { status: 'draft' } } : { body: { status: status({ checkoutResumable: true }) } }));
    render(<ActivationView />);
    expect((await screen.findByTestId('activation-pending')).textContent).toContain("don't pay again");
    await act(async () => {
      fireEvent.click(screen.getByTestId('go-back-edit'));
    });
    expect(calls).toContainEqual({ url: '/api/registration/checkout', method: 'DELETE' });
    expect(mockRouter.push).toHaveBeenCalledWith('/register/review');
    expect(registrationSessionStore.getState().operationKey).toBeNull(); // that attempt is over
  });

  it('go back and edit refused (already paid): shows the server message and stays', async () => {
    mockFetch((c) => (c.method === 'DELETE' ? { status: 409, body: { error: 'operation_in_progress', message: 'A payment for this registration is already in progress. Check its status before trying again.' } } : { body: { status: status({ checkoutResumable: true }) } }));
    render(<ActivationView />);
    await screen.findByTestId('activation-pending');
    await act(async () => {
      fireEvent.click(screen.getByTestId('go-back-edit'));
    });
    expect(screen.getByTestId('edit-error').textContent).toContain('already in progress');
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('payment confirmed, setup pending: no edit, no resend, no pay', async () => {
    always(status({ draft: 'paid', payment: 'confirmed', provisioning: 'pending' }));
    render(<ActivationView />);
    await screen.findByTestId('activation-tracks');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Payment confirmed. Setting up your pharmacy…');
    expect(screen.queryByTestId('go-back-edit')).toBeNull();
    expect(screen.queryByTestId('resend')).toBeNull();
  });

  it('sign_in_to_finish: explains the existing account, links to /login, offers resend', async () => {
    always(status({ draft: 'paid', payment: 'confirmed', provisioning: 'attention', attention: 'sign_in_to_finish', email: 'sent' }));
    render(<ActivationView />);
    const box = await screen.findByTestId('activation-sign-in-to-finish');
    expect(box.textContent).toContain('This email already has an account');
    expect(box.textContent).toContain('Check your inbox at j•••••@example.test and sign in to finish setup');
    expect(box.textContent).toContain('do not pay again');
    expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe('/login');
    expect(screen.getByTestId('resend')).toBeTruthy();
  });

  it('contact_support with an unconfirmed payment still never suggests paying', async () => {
    always(status({ draft: 'checkout', payment: 'unknown', provisioning: 'attention', attention: 'contact_support' }));
    render(<ActivationView />);
    const box = await screen.findByTestId('activation-contact-support');
    expect(box.textContent).toContain('do not pay again');
    expect(screen.queryByTestId('go-back-edit')).toBeNull();
    expect(screen.queryByTestId('auto-refresh-note')).toBeNull();
  });

  it('ready + email sent: names the masked address; resend posts once and then waits a minute', async () => {
    const calls = always(status({ ...READY, email: 'sent' }));
    render(<ActivationView />);
    const panel = await screen.findByTestId('access-email-sent');
    expect(panel.textContent).toContain('Check j•••••@example.test for your sign-in link');
    await act(async () => {
      fireEvent.click(screen.getByTestId('resend'));
    });
    expect(calls.filter((c) => c.method === 'POST')).toEqual([{ url: '/api/registration/status', method: 'POST' }]);
    expect(screen.getByTestId('resend-message').textContent).toContain('Request received');
    expect((screen.getByTestId('resend') as HTMLButtonElement).disabled).toBe(true);
  });

  it('resend too soon (429): says to wait a minute', async () => {
    mockFetch((c) => (c.method === 'POST' ? { status: 429, body: { error: 'slow_down', message: 'Too many attempts. Wait a minute and try again.' } } : { body: { status: status({ ...READY, email: 'sent' }) } }));
    render(<ActivationView />);
    await screen.findByTestId('access-email-sent');
    await act(async () => {
      fireEvent.click(screen.getByTestId('resend'));
    });
    expect(screen.getByTestId('resend-message').textContent).toBe('Wait a minute before asking for another email.');
  });

  it('ready + email failed: resend is the main action', async () => {
    always(status({ ...READY, email: 'failed' }));
    render(<ActivationView />);
    const panel = await screen.findByTestId('access-email-failed');
    expect(panel.textContent).toContain("We couldn't send your sign-in email");
    expect(screen.getByRole('button', { name: 'Send the email again' })).toBeTruthy();
  });

  it('ready + email not needed (signed-in purchaser): billing and OwedBook, no resend', async () => {
    always(status({ ...READY, email: 'not_needed' }));
    render(<ActivationView />);
    await screen.findByTestId('activation-signed-in');
    expect(screen.getByRole('link', { name: 'Go to billing' }).getAttribute('href')).toBe('/billing');
    const owedBook = screen.getByRole('link', { name: /Open OwedBook/ }).getAttribute('href')!;
    expect(owedBook).toBe('http://localhost:3000/api/handoff/start?return=/owedbook');
    expect(owedBook).not.toMatch(/token|code=|access/i);
    expect(screen.queryByTestId('resend')).toBeNull();
  });

  it('checkout expired: nothing charged, back to review, and the old operation key is dropped', async () => {
    registrationSessionStore.setState({ operationKey: 'reg_old_key_0123456789' });
    always(status({ draft: 'editing', payment: 'expired' }));
    render(<ActivationView />);
    expect((await screen.findByTestId('incomplete-expired')).textContent).toContain('nothing was charged');
    expect(screen.getByRole('link', { name: 'Back to review' }).getAttribute('href')).toBe('/register/review');
    await waitFor(() => expect(registrationSessionStore.getState().operationKey).toBeNull());
  });

  it('no registration on this browser: offers to start, claims nothing', async () => {
    always(status({ draft: 'none', payment: 'none', ownerEmailMasked: '' }));
    render(<ActivationView />);
    await screen.findByTestId('activation-none');
    expect(screen.getByRole('link', { name: 'Start a subscription' }).getAttribute('href')).toBe('/register/plan');
  });

  it('a status that cannot be loaded is not shown as a failed payment', async () => {
    mockFetch(() => ({ status: 502, body: { error: 'provider_unavailable', message: "We couldn't reach the payment provider. Nothing was charged. Try again shortly." } }));
    render(<ActivationView />);
    expect(await screen.findByText("We couldn't load your registration status")).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Check again' })).toBeTruthy();
  });
});

describe('ActivationView — polling', () => {
  it('polls the plain endpoint every 4 s while pending and stops when ready', async () => {
    jest.useFakeTimers();
    const calls = mockFetch((_c, n) => ({ body: { status: n < 3 ? status({ draft: 'paid', payment: 'confirmed', provisioning: 'pending' }) : status({ ...READY, email: 'sent' }) } }));
    render(<ActivationView />);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(calls).toHaveLength(1);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(4000);
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(4000);
    });
    expect(calls.map((c) => c.url)).toEqual(['/api/registration/status?reconcile=1', '/api/registration/status', '/api/registration/status']);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe("You're in. Check your email.");
    await act(async () => {
      await jest.advanceTimersByTimeAsync(20000);
    });
    expect(calls).toHaveLength(3);
  });

  it('after about two minutes it stops, says nothing is lost, and offers a manual check', async () => {
    jest.useFakeTimers();
    const calls = always(status({ draft: 'paid', payment: 'confirmed', provisioning: 'pending' }));
    render(<ActivationView />);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    for (let i = 0; i < 32; i++) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(4000);
      });
    }
    const box = screen.getByTestId('still-working');
    expect(box.textContent).toContain('You can close this page — nothing is lost');
    const before = calls.length;
    await act(async () => {
      await jest.advanceTimersByTimeAsync(30000);
    });
    expect(calls.length).toBe(before); // polling has stopped
    await act(async () => {
      fireEvent.click(screen.getByTestId('check-again'));
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(calls[calls.length - 1].url).toBe('/api/registration/status?reconcile=1');
  });
});
