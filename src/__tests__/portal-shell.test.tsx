/**
 * @jest-environment jsdom
 */
// APBM007A — the signed-in shell: real identity (no role, no harness strip), a plain OwedBook
// handoff link, and an honest sign-out (a 502 is shown with a retry, never treated as signed out).
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Shell } from '@/components/portal/Shell';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter, usePathname: () => '/dashboard' }));
jest.mock('@/components/global/ThemeToggler', () => ({ __esModule: true, default: () => null }));

function mockLogout(replies: { status: number; body: unknown }[]) {
  const calls: [string, string | undefined][] = [];
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    calls.push([String(url), init?.method]);
    const r = replies[Math.min(calls.length - 1, replies.length - 1)];
    return { ok: r.status < 300, status: r.status, json: async () => r.body };
  }) as unknown as typeof fetch;
  return calls;
}
const INCOMPLETE = { status: 502, body: { error: 'sign_out_incomplete', message: "You are signed out on this browser, but we couldn't confirm sign-out everywhere. Try again." } };
const DONE = { status: 200, body: { message: 'Logged out successfully' } };

async function signOutFromDrawer() {
  fireEvent.click(screen.getByTestId('menu-trigger'));
  const button = await screen.findByRole('button', { name: 'Sign out' });
  await act(async () => {
    fireEvent.click(button);
  });
}

beforeEach(() => {
  mockRouter.push.mockClear();
  mockRouter.refresh.mockClear();
});

it('shows the signed-in identity and links, with no role label or review strip', async () => {
  mockLogout([DONE]);
  render(<Shell user={{ displayName: 'Jordan Ellis', email: 'jordan@example.test' }}>content</Shell>);
  expect(screen.getByText('content')).toBeTruthy();
  expect(document.body.textContent).not.toMatch(/Super Admin|real account|persona|scenario|demo/i);
  const owedBook = screen.getAllByRole('link', { name: /Open OwedBook/ })[0];
  expect(owedBook.getAttribute('href')).toBe('http://localhost:3000/api/handoff/start?return=/owedbook');
  fireEvent.click(screen.getByTestId('menu-trigger'));
  expect((await screen.findByRole('link', { name: 'Billing' })).getAttribute('href')).toBe('/billing');
  expect(screen.getByText('jordan@example.test')).toBeTruthy();
});

it('sign-out success posts to the logout route and goes to /login', async () => {
  const calls = mockLogout([DONE]);
  render(<Shell user={{ displayName: 'Jordan Ellis', email: 'jordan@example.test' }}>content</Shell>);
  await signOutFromDrawer();
  expect(calls).toEqual([['/api/auth/logout', 'POST']]);
  expect(mockRouter.push).toHaveBeenCalledWith('/login');
});

it('a 502 shows the server message with a retry and does not leave the page; the retry can succeed', async () => {
  const calls = mockLogout([INCOMPLETE, DONE]);
  render(<Shell user={{ displayName: 'Jordan Ellis', email: 'jordan@example.test' }}>content</Shell>);
  await signOutFromDrawer();
  expect(screen.getByTestId('sign-out-status').textContent).toContain("we couldn't confirm sign-out everywhere");
  expect(mockRouter.push).not.toHaveBeenCalled();
  await act(async () => {
    fireEvent.click(screen.getByTestId('sign-out-retry'));
  });
  expect(calls).toHaveLength(2);
  expect(mockRouter.push).toHaveBeenCalledWith('/login');
});
