/**
 * @jest-environment jsdom
 */
// APBM007A: customers are ordinary users, so the login form lets ANY account that
// signs in through — no role check, no sign-out of members. Network is mocked.
import { act, fireEvent, render, screen } from '@testing-library/react';
import { LoginPageContent } from '@/app/login/LoginPageContent';
import { externalRedirect } from '@/services/portal/navigate';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));
jest.mock('@/services/portal/navigate', () => ({ externalRedirect: jest.fn() }));

function mockLoginResponse(role: string | null) {
  const fetchMock = jest.fn((url: string, _init?: RequestInit) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(url === '/api/auth/login' ? { data: { role } } : {}),
    }),
  );
  global.fetch = fetchMock as any;
  return fetchMock;
}

async function submit(props: { continueHandoff?: boolean } = {}) {
  render(<LoginPageContent sessionExpired={false} {...props} />);
  fireEvent.change(document.getElementById('email')!, { target: { value: 'owner@example.test' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'not-a-real-password' } });
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  });
}

beforeEach(() => {
  mockRouter.push.mockClear();
  (externalRedirect as jest.Mock).mockClear();
});

it.each([['member'], ['admin'], ['superadmin'], [null]])('role %p goes to /dashboard and is never signed out again', async (role) => {
  const fetchMock = mockLoginResponse(role);
  await submit();
  expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/login');
  expect(JSON.parse(String(fetchMock.mock.calls[0][1]!.body))).toEqual({ email: 'owner@example.test', password: 'not-a-real-password' });
  expect(screen.queryByRole('alert')).toBeNull();
});

it('with next=continue it resumes the pending handoff instead of going to the dashboard', async () => {
  mockLoginResponse('member');
  await submit({ continueHandoff: true });
  expect(externalRedirect).toHaveBeenCalledWith('/api/handoff/authorize?resume=1');
  expect(mockRouter.push).not.toHaveBeenCalled();
});

it('invalid credentials show the designed message (network mocked; no real auth call)', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, status: 400, json: () => Promise.resolve({ error: 'Invalid login credentials' }) }),
  ) as any;
  await submit();
  expect(mockRouter.push).not.toHaveBeenCalled();
  expect(screen.getByRole('alert').textContent).toContain("That email and password don't match");
});

it('session-expired banner renders only when asked', () => {
  render(<LoginPageContent sessionExpired />);
  expect(screen.getByText('Your session expired')).toBeTruthy();
});

it('offers the email sign-in link under the password form, and no demo notice', () => {
  render(<LoginPageContent sessionExpired={false} />);
  const password = screen.getByLabelText('Password');
  const linkForm = screen.getByTestId('link-request-form');
  expect(password.compareDocumentPosition(linkForm) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Email me a sign-in link' })).toBeTruthy();
  expect(document.body.textContent).not.toMatch(/synthetic|demo data/i);
  expect(screen.getByRole('link', { name: 'Start a subscription' }).getAttribute('href')).toBe('/register/plan');
});
