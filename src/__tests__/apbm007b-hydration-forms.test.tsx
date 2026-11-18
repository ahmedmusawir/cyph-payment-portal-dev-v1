/**
 * @jest-environment jsdom
 */
// APBM-007B F-Q4-001 — what is typed or filled before the page finishes loading is kept, the submit button follows the
// real field values, and Show password never clears the field. Each test server-renders the form, types into the
// server HTML with no input event (React never sees it, as when the production script is still loading), then hydrates.
import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { LoginPageContent } from '@/app/login/LoginPageContent';
import { LinkRequestForm } from '@/components/auth/LinkRequestForm';
import { AddStoreFlow } from '@/components/portal/account/AddStoreFlow';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));
jest.mock('@/services/portal/navigate', () => ({ externalRedirect: jest.fn() }));

let posts: { url: string; body: Record<string, string> }[] = [];
beforeEach(() => {
  posts = [];
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    posts.push({ url, body: JSON.parse(String(init?.body ?? '{}')) });
    return { ok: true, status: 200, json: async () => ({ data: { role: null } }) };
  }) as unknown as typeof fetch;
});
afterEach(() => { document.body.innerHTML = ''; mockRouter.push.mockClear(); });

async function typeBeforeHydration(ui: React.ReactElement, typed: Record<string, string>) {
  const container = document.createElement('div');
  container.innerHTML = renderToString(ui);
  document.body.appendChild(container);
  for (const [id, value] of Object.entries(typed)) (container.querySelector(`#${id}`) as HTMLInputElement).value = value;   // no input event
  let root: Root | undefined;
  await act(async () => { root = hydrateRoot(container, ui); });
  return { container, root: root as Root, field: (id: string) => container.querySelector(`#${id}`) as HTMLInputElement };
}

it('password sign-in: typed values are kept, Sign in is enabled, Show password keeps the password, and they are submitted', async () => {
  const { container, root, field } = await typeBeforeHydration(<LoginPageContent sessionExpired={false} />, {
    email: 'early@x.invalid', password: 'typed-early',
  });
  const signIn = screen.getByRole('button', { name: 'Sign in' }) as HTMLButtonElement;
  expect(signIn.disabled).toBe(false);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Show password' })); });
  expect(field('password').value).toBe('typed-early');
  expect(field('password').type).toBe('text');
  await act(async () => { fireEvent.submit(container.querySelector('form') as HTMLFormElement); });
  await waitFor(() => expect(posts).toContainEqual({ url: '/api/auth/login', body: { email: 'early@x.invalid', password: 'typed-early' } }));
  act(() => root.unmount());
});

it('password sign-in: with nothing typed, Sign in stays disabled after loading', async () => {
  const { root } = await typeBeforeHydration(<LoginPageContent sessionExpired={false} />, {});
  expect((screen.getByRole('button', { name: 'Sign in' }) as HTMLButtonElement).disabled).toBe(true);
  act(() => root.unmount());
});

it('add store details: typed details are kept and are the ones quoted; "See the price" is disabled in the server HTML', async () => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(<AddStoreFlow />);
  document.body.appendChild(container);
  const ssrDisabled = (container.querySelector('button[type=submit]') as HTMLButtonElement).disabled;
  const field = (id: string) => container.querySelector(`#${id}`) as HTMLInputElement;
  field('sn').value = 'Early Typed Pharmacy'; field('npi').value = '1234567893';   // no input events
  let root: Root | undefined;
  await act(async () => { root = hydrateRoot(container, <AddStoreFlow />); });
  // The quote is refused here, so the details form stays on screen after the re-renders of the request.
  (global.fetch as jest.Mock).mockImplementation(async (url: string, init?: RequestInit) => {
    posts.push({ url, body: JSON.parse(String(init?.body ?? '{}')) });
    return { ok: false, status: 400, json: async () => ({ message: 'Refused in this test.' }) };
  });
  const see = screen.getByRole('button', { name: 'See the price' }) as HTMLButtonElement;
  expect(see.disabled).toBe(false);
  await act(async () => { fireEvent.submit(container.querySelector('form') as HTMLFormElement); });
  expect(posts).toEqual([{ url: '/api/stores/add/quote', body: { storeName: 'Early Typed Pharmacy', npi: '1234567893' } }]);
  await waitFor(() => expect(screen.getByText('Refused in this test.')).toBeTruthy());
  expect(field('sn').value).toBe('Early Typed Pharmacy');
  expect(field('npi').value).toBe('1234567893');
  expect(ssrDisabled).toBe(true);
  act(() => (root as Root).unmount());
});

it('sign-in link: a typed address is kept, the button is enabled, and that address is the one sent', async () => {
  const { container, root, field } = await typeBeforeHydration(<LinkRequestForm />, { 'link-email': 'link-early@x.invalid' });
  const send = screen.getByRole('button', { name: 'Email me a sign-in link' }) as HTMLButtonElement;
  expect(send.disabled).toBe(false);
  await act(async () => { fireEvent.submit(container.querySelector('form') as HTMLFormElement); });
  expect(posts).toEqual([{ url: '/api/auth/link', body: { email: 'link-early@x.invalid' } }]);
  await waitFor(() => expect(screen.getByText('Check your inbox')).toBeTruthy());
  expect(field('link-email').value).toBe('link-early@x.invalid');   // survived the re-renders
  act(() => root.unmount());
});
