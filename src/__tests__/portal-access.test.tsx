// APBM007A: any authenticated user may enter /dashboard and /billing (customers are
// ordinary members); signed-out requests go to /login. No role is looked up for entry.
// The staff predicate (R-008) is kept and still tested: nothing here weakens it.
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));
jest.mock('@/utils/get-user-role', () => ({
  getUserRole: jest.fn(),
}));
jest.mock('@/components/portal/Shell', () => ({
  Shell: jest.fn(() => null),
}));
jest.mock('@/app/login/LoginPageContent', () => ({
  LoginPageContent: jest.fn(() => null),
}));
jest.mock('@/components/portal/account/DashboardView', () => ({
  DashboardView: jest.fn(() => null),
}));

import { isPortalStaffRole } from '@/services/auth/access';
import { getPortalStaffUser, getPortalUser } from '@/services/auth/session';
import PortalLayout from '@/app/(account)/layout';
import LoginPage from '@/app/login/page';
import DashboardPage from '@/app/(account)/dashboard/page';
import BillingPage from '@/app/(account)/billing/page';
import HomePage from '@/app/page';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/get-user-role';
import { redirect } from 'next/navigation';

const createClientMock = createClient as jest.MockedFunction<typeof createClient>;
const getUserRoleMock = getUserRole as jest.MockedFunction<typeof getUserRole>;

function signedIn(user: Record<string, unknown> | null) {
  const getUser = jest.fn().mockResolvedValue({ data: { user } });
  createClientMock.mockResolvedValue({ auth: { getUser } } as any);
}

const AUTH_USER = {
  id: 'user-1',
  email: 'owner@example.test',
  user_metadata: { full_name: 'Owner Person' },
};

describe('isPortalStaffRole (unchanged staff predicate)', () => {
  it.each(['superadmin', 'admin'])('allows %s', (role) => {
    expect(isPortalStaffRole(role)).toBe(true);
  });

  it.each(['member', 'owner', 'SUPERADMIN', 'Admin', '', ' admin', null, undefined, 1])(
    'denies %p',
    (role) => {
      expect(isPortalStaffRole(role)).toBe(false);
    },
  );
});

describe('getPortalStaffUser (unchanged staff resolver)', () => {
  it('returns null when signed out without looking up a role', async () => {
    signedIn(null);
    await expect(getPortalStaffUser()).resolves.toBeNull();
    expect(getUserRoleMock).not.toHaveBeenCalled();
  });

  it('resolves an admin and denies a member', async () => {
    signedIn(AUTH_USER);
    getUserRoleMock.mockResolvedValue('admin' as any);
    await expect(getPortalStaffUser()).resolves.toEqual({ id: 'user-1', email: 'owner@example.test', displayName: 'Owner Person', role: 'admin' });
    getUserRoleMock.mockResolvedValue('member' as any);
    await expect(getPortalStaffUser()).resolves.toBeNull();
  });

  it('ignores a forged user_metadata role', async () => {
    signedIn({ ...AUTH_USER, user_metadata: { role: 'superadmin' } });
    getUserRoleMock.mockResolvedValue('member' as any);
    await expect(getPortalStaffUser()).resolves.toBeNull();
  });
});

describe('getPortalUser', () => {
  it('returns null when signed out', async () => {
    signedIn(null);
    await expect(getPortalUser()).resolves.toBeNull();
  });

  it('resolves any authenticated user without a role lookup, carrying no role', async () => {
    signedIn(AUTH_USER);
    await expect(getPortalUser()).resolves.toEqual({ id: 'user-1', email: 'owner@example.test', displayName: 'Owner Person' });
    expect(getUserRoleMock).not.toHaveBeenCalled();
  });

  it('falls back to the email local-part for the display name, and never reads a metadata role', async () => {
    signedIn({ id: 'user-2', email: 'pat@example.test', user_metadata: { role: 'superadmin' } });
    await expect(getPortalUser()).resolves.toEqual({ id: 'user-2', email: 'pat@example.test', displayName: 'pat' });
  });
});

describe('(account) layout gate', () => {
  it('renders the shell for any signed-in user with name and email only', async () => {
    signedIn(AUTH_USER);
    const element = await PortalLayout({ children: 'page' });
    expect(element.props.user).toEqual({ displayName: 'Owner Person', email: 'owner@example.test' });
    expect(element.props.children).toBe('page');
    expect(redirect).not.toHaveBeenCalled();
    expect(getUserRoleMock).not.toHaveBeenCalled();
  });

  it('redirects a signed-out request to /login', async () => {
    signedIn(null);
    await expect(PortalLayout({ children: 'page' })).rejects.toThrow('NEXT_REDIRECT:/login');
  });
});

describe('/login page', () => {
  it('sends any signed-in session straight to /dashboard', async () => {
    signedIn(AUTH_USER);
    await expect(LoginPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('NEXT_REDIRECT:/dashboard');
  });

  it('a signed-in session arriving with next=continue resumes the handoff', async () => {
    signedIn(AUTH_USER);
    await expect(LoginPage({ searchParams: Promise.resolve({ next: 'continue' }) })).rejects.toThrow('NEXT_REDIRECT:/api/handoff/authorize?resume=1');
  });

  it('shows the form when signed out, passing only the two recognised URL values', async () => {
    signedIn(null);
    const el = await LoginPage({ searchParams: Promise.resolve({ reason: 'session_expired', next: 'https://evil.example/' }) });
    expect(el.props.children.props).toEqual({ sessionExpired: true, continueHandoff: false });
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe.each([
  ['/dashboard', DashboardPage, 'dashboard'],
  ['/billing', BillingPage, 'billing'],
] as const)('%s page guard', (_path, Page, page) => {
  it('redirects a signed-out request to /login', async () => {
    signedIn(null);
    await expect(Page()).rejects.toThrow('NEXT_REDIRECT:/login');
  });

  it('renders for any signed-in user', async () => {
    signedIn(AUTH_USER);
    const el = await Page();
    expect(el.props).toEqual({ page });
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe('/', () => {
  it('redirects to the public plan step', () => {
    expect(() => HomePage()).toThrow('NEXT_REDIRECT:/register/plan');
  });
});
