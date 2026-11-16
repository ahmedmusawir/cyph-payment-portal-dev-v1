/**
 * @jest-environment jsdom
 */
// APBM007A F-Q2-001 — the registration journey as a browser makes it. The real owner, pharmacy and review
// pages are mounted behind a small working router that behaves like the App Router in the two ways that
// matter here: a navigation is not instant (the page that asked for it stays mounted, and keeps rendering
// and running effects, until the new page takes over), and when a second navigation is requested before the
// first has landed, the later one wins. The server is a stateful fake of the draft and quote endpoints.
// Each test asserts the page the journey ENDS on and what that page shows, not which router methods were
// called along the way.
import { useSyncExternalStore, type ReactNode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { OwnerView } from '@/components/portal/register/OwnerView';
import { PharmacyStepView } from '@/components/portal/register/PharmacyStepView';
import { ReviewView } from '@/components/portal/register/ReviewView';
import { registrationSessionStore } from '@/services/portal/registrationSession';

const mockNav = { path: '/register/owner', pending: null as string | null, trail: [] as string[], listeners: new Set<() => void>() };
const mockGo = (kind: 'push' | 'replace') => (to: string) => {
  mockNav.trail.push(`${kind} ${to}`);
  const first = mockNav.pending === null;
  mockNav.pending = to;   // a later request replaces an earlier one that has not landed yet
  if (!first) return;
  setTimeout(() => {
    mockNav.path = mockNav.pending!;
    mockNav.pending = null;
    mockNav.listeners.forEach((l) => l());
  }, 5);
};
const mockRouter = { push: mockGo('push'), replace: mockGo('replace'), refresh: () => undefined };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest} onClick={(e) => { e.preventDefault(); mockRouter.push(href); }}>{children}</a>
  ),
}));
jest.mock('@/services/portal/navigate', () => ({ externalRedirect: jest.fn() }));

const ROUTES: Record<string, () => ReactNode> = {
  '/register/plan': () => <p>plan page</p>,
  '/register/owner': () => <OwnerView />,
  '/register/pharmacy': () => <PharmacyStepView />,
  '/register/review': () => <ReviewView />,
  '/register/activation': () => <p>status page</p>,
};
function App() {
  const path = useSyncExternalStore(
    (l) => { mockNav.listeners.add(l); return () => mockNav.listeners.delete(l); },
    () => mockNav.path,
  );
  // A new key per route: leaving a page unmounts it, as a real navigation does.
  return <div key={path} data-testid="page">{ROUTES[path]()}</div>;
}

// ── the server: one draft per browser, saved by POST, priced by the quote endpoint ──
type Row = Record<string, unknown>;
type Draft = Row & { revision: number };
let server: { draft: Draft | null; saves: number; quotes: number; refuse: Row | null };
function installServer() {
  server = { draft: null, saves: 0, quotes: 0, refuse: null };
  const reply = (status: number, body: unknown) => ({ ok: status < 300, status, json: async () => body });
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (url === '/api/registration/draft' && method === 'GET') return reply(200, { draft: server.draft });
    if (url === '/api/registration/draft' && method === 'POST') {
      if (server.refuse) return reply(409, server.refuse);
      server.saves += 1;
      server.draft = {
        revision: (server.draft?.revision ?? 0) + 1, status: 'draft', owner: body.owner,
        pharmacy: { ncpdp: '', ...body.pharmacy }, quote: null, termsVersion: 'terms-2026-11',
      };
      return reply(200, { draft: server.draft });
    }
    if (url === '/api/registration/quote' && method === 'POST') {
      if (!server.draft) return reply(404, { error: 'not_found', message: 'No draft.' });
      server.quotes += 1;
      server.draft = {
        ...server.draft,
        quote: { subtotalCents: 9900, discountCents: 0, totalCents: 9900, currency: 'USD', promotionCode: null, expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(), expired: false },
      };
      return reply(200, { draft: server.draft });
    }
    throw new Error(`unexpected request ${method} ${url}`);
  }) as unknown as typeof fetch;
}

const set = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const click = async (name: string | RegExp) => {
  await act(async () => { fireEvent.click(screen.getByRole('button', { name })); });
};
const follow = async (name: RegExp) => {
  await act(async () => { fireEvent.click(screen.getByRole('link', { name })); });
};
const open = (path: string) => {
  mockNav.path = path;
  mockNav.pending = null;
  mockNav.trail = [];
  return render(<App />);
};
const at = (path: string) => waitFor(() => expect(mockNav.path).toBe(path));
async function fillOwnerAndContinue() {
  await screen.findByLabelText(/First name/);
  set(/First name/, 'Jordan');
  set(/Last name/, 'Ellis');
  set(/Work email/, 'jordan@example.test');
  set(/Mobile phone/, '(555) 010-0144');
  fireEvent.click(screen.getByRole('checkbox'));
  await click('Continue');
}
async function fillPharmacyAndContinue() {
  await screen.findByLabelText(/NCPDP number/);
  set(/Pharmacy name/, 'Main Street Pharmacy');
  set(/Street address/, '1 Main St');
  set(/City/, 'Plano');
  set(/^State/, 'TX');
  set(/ZIP/, '75001');
  set(/^NPI/, '1234567893');
  set(/Store phone/, '(555) 010-0145');
  set(/Pharmacy software/, 'Liberty');
  await click('Continue to review');
}
/** The review page with the server's price on it: the end of the pre-payment journey. */
async function onReviewWithQuote() {
  await waitFor(() => expect(screen.getByTestId('due-today').textContent).toBe('$99.00'));
  expect(mockNav.path).toBe('/register/review');
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Review and pay');
}
/** Long enough for any navigation still in flight to land. */
const settle = async () => {
  const until = Date.now() + 40;
  await waitFor(() => { if (Date.now() < until) throw new Error('settling'); });
};

// Pages load their data after a navigation lands, outside any single test step, exactly as in a browser.
// Testing Library still wraps every render, click and wait; this only stops React reporting those loads.
const env = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
beforeAll(() => { env.IS_REACT_ACT_ENVIRONMENT = false; });
afterAll(() => { env.IS_REACT_ACT_ENVIRONMENT = true; });

beforeEach(() => {
  sessionStorage.clear();
  registrationSessionStore.setState({ owner: null, pharmacy: null, operationKey: null });
  installServer();
});

describe('registration journey — a first registration reaches review (F-Q2-001)', () => {
  it('owner, then pharmacy, lands on review with the server quote; nothing sends the browser back', async () => {
    open('/register/owner');
    await fillOwnerAndContinue();
    await at('/register/pharmacy');
    await fillPharmacyAndContinue();
    await settle();
    expect(mockNav.path).toBe('/register/review');   // not back on the owner step
    await onReviewWithQuote();
    await settle();
    expect(mockNav.path).toBe('/register/review');   // and it stays there
    expect(mockNav.trail).toEqual(['push /register/pharmacy', 'push /register/review']);
    expect(server).toMatchObject({ saves: 1, quotes: 1 });
    expect(screen.getByTestId('review-pharmacy').textContent).toContain('Main Street Pharmacy');
    expect(screen.getByTestId('review-pharmacy').textContent).toContain('1234567893');
    expect(document.body.textContent).toContain('jordan@example.test');
    // Saved on the server, so nothing unsaved is left in the tab and review shows no unsaved-changes notice.
    expect(registrationSessionStore.getState()).toMatchObject({ owner: null, pharmacy: null });
    expect(document.body.textContent).not.toContain("changes that aren't saved yet");
    // Payment still needs the three confirmations: none is ticked for the buyer.
    expect(Array.from(document.querySelectorAll<HTMLInputElement>('#c1, #c2, #c3')).map((c) => c.checked)).toEqual([false, false, false]);
  });

  it('the saved details survive a refresh of the review page', async () => {
    const first = open('/register/owner');
    await fillOwnerAndContinue();
    await fillPharmacyAndContinue();
    await onReviewWithQuote();
    first.unmount();
    open('/register/review');   // a reload: same URL, same tab storage, a fresh page
    await onReviewWithQuote();
    expect(mockNav.trail).toEqual([]);
    expect(screen.getByTestId('review-pharmacy').textContent).toContain('Main Street Pharmacy');
    expect(server).toMatchObject({ saves: 1, quotes: 1 });   // the current quote is reused, not re-requested
  });

  it('edit from review, change a detail and return: review shows the new saved value and a new quote', async () => {
    open('/register/owner');
    await fillOwnerAndContinue();
    await fillPharmacyAndContinue();
    await onReviewWithQuote();

    await follow(/^Edit pharmacy$/);
    await at('/register/pharmacy');
    expect(((await screen.findByLabelText(/Pharmacy name/)) as HTMLInputElement).value).toBe('Main Street Pharmacy');
    set(/Pharmacy name/, 'Main Street Pharmacy East');
    await click('Continue to review');
    await at('/register/review');
    await onReviewWithQuote();
    expect(screen.getByTestId('review-pharmacy').textContent).toContain('Main Street Pharmacy East');
    expect(server).toMatchObject({ saves: 2, quotes: 2 });
    expect(server.draft!.revision).toBe(2);

    await follow(/^Edit billing owner$/);
    await at('/register/owner');
    expect(((await screen.findByLabelText(/First name/)) as HTMLInputElement).value).toBe('Jordan');
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    await click('Continue');
    await at('/register/pharmacy');
    await screen.findByLabelText(/NCPDP number/);
    await click('Back');
    await at('/register/owner');
    await screen.findByLabelText(/First name/);
    await click('Continue');
    await at('/register/pharmacy');
    await screen.findByLabelText(/NCPDP number/);
    await click('Continue to review');
    await at('/register/review');
    await onReviewWithQuote();
    expect(server.draft!.revision).toBe(3);
  });
});

describe('registration journey — incomplete registrations still cannot reach review', () => {
  it('review opened with no saved draft goes to the owner step', async () => {
    open('/register/review');
    await at('/register/owner');
    await screen.findByLabelText(/First name/);
    expect(server.quotes).toBe(0);
  });

  it('the pharmacy step opened with no owner details goes to the owner step', async () => {
    open('/register/pharmacy');
    await at('/register/owner');
    await screen.findByLabelText(/First name/);
  });

  it('owner details typed but never saved do not open review', async () => {
    open('/register/owner');
    await fillOwnerAndContinue();
    await at('/register/pharmacy');
    await screen.findByLabelText(/NCPDP number/);
    act(() => mockRouter.push('/register/review'));   // typing the address by hand
    await at('/register/review');
    await at('/register/owner');
    await screen.findByLabelText(/First name/);
    expect(server).toMatchObject({ saves: 0, quotes: 0 });
  });

  it('a save the server refuses stays on the pharmacy step and keeps what was typed', async () => {
    open('/register/owner');
    await fillOwnerAndContinue();
    server.refuse = { error: 'npi_unavailable', message: "This NPI can't be registered right now." };
    await fillPharmacyAndContinue();
    await settle();
    expect(mockNav.path).toBe('/register/pharmacy');
    expect(document.getElementById('ph-npi-err')!.textContent).toBe("This NPI can't be registered right now.");
    expect((screen.getByLabelText(/Pharmacy name/) as HTMLInputElement).value).toBe('Main Street Pharmacy');
    expect(registrationSessionStore.getState().owner).not.toBeNull();
    expect(server).toMatchObject({ draft: null, quotes: 0 });
  });

  it('a saved draft without a pharmacy does not open review', async () => {
    server.draft = {
      revision: 1, status: 'draft', termsVersion: 'terms-2026-11', quote: null,
      owner: { firstName: 'Jordan', lastName: 'Ellis', email: 'jordan@example.test', mobile: '(555) 010-0144', ownerDeclarationAccepted: true },
      pharmacy: { name: '', street: '', city: '', state: '', zip: '', phone: '', npi: '', ncpdp: '', software: '' },
    };
    open('/register/review');
    await at('/register/owner');
    await screen.findByLabelText(/First name/);
    expect(server.quotes).toBe(0);
  });
});
