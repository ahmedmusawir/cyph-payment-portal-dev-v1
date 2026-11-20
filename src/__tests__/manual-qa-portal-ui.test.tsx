/**
 * @jest-environment jsdom
 */
// Manual QA 19 Nov 2026 — Portal UI repairs: Add Store payment states, resume and completion (R2/R3); the named removal
// confirmation with busy feedback (R2/R9).
import { act } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { AddStoreFlow, OP_KEY } from '@/components/portal/account/AddStoreFlow';
import { StoreRemovalControl } from '@/components/portal/account/StoreRemovalControl';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn() }) }));
const OP = '00000000-0000-4000-8000-0000000000aa';
const status = (over: Record<string, unknown>) => ({ operationId: OP, kind: 'store_add', state: 'payment_pending', errorCode: null, paymentDeadline: '2026-11-19T09:55:29Z', amountCents: 4890,
  paymentRequired: true, paymentIssue: 'declined', hostedPaymentUrl: 'https://invoice.stripe.invalid/i/x', businessId: null, storeName: 'Stark Test Pharmacy 02', ...over });
type Call = { url: string; method: string; body: unknown };
let calls: Call[] = [];
function serve(routes: Record<string, unknown>) {
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method ?? 'GET', body: init?.body ? JSON.parse(String(init.body)) : null });
    const data = routes[url];
    return { ok: data !== undefined, status: data !== undefined ? 200 : 404, json: async () => (data !== undefined ? { data } : { message: 'nope' }) };
  }) as unknown as typeof fetch;
}
beforeEach(() => { calls = []; sessionStorage.clear(); });

describe('AddStoreFlow recovery and payment states', () => {
  it('resumes the owner\'s unresolved Add Store from the server after a reload and explains a declined card with a new-tab Stripe button', async () => {
    serve({ '/api/stores/operations': [{ id: OP, kind: 'store_add', state: 'payment_pending' }], '/api/stores/add/status': status({}) });
    render(<AddStoreFlow />);
    expect(await screen.findByText('Your card was declined')).toBeTruthy();
    const pay = screen.getByTestId('hosted-pay');
    expect(pay.getAttribute('target')).toBe('_blank');
    expect(pay.getAttribute('rel')).toContain('noopener');
    expect(screen.getByText(/you do not need to pay again/)).toBeTruthy();
    expect(sessionStorage.getItem(OP_KEY)).toBe(OP);
    expect(calls.filter((c) => c.url === '/api/stores/add/confirm')).toHaveLength(0);   // recovery never confirms or pays
  });
  it('bank confirmation and processing are worded differently; processing offers no Stripe page', async () => {
    sessionStorage.setItem(OP_KEY, OP);
    serve({ '/api/stores/add/status': status({ paymentIssue: 'authentication_required' }) });
    const { unmount } = render(<AddStoreFlow />);
    expect(await screen.findByText('Your bank needs you to confirm this payment')).toBeTruthy();
    expect(screen.getByTestId('hosted-pay').textContent).toMatch(/Confirm payment on Stripe/);
    unmount();
    serve({ '/api/stores/add/status': status({ paymentIssue: 'processing' }) });
    render(<AddStoreFlow />);
    expect(await screen.findByText('Payment processing')).toBeTruthy();
    expect(screen.queryByTestId('hosted-pay')).toBeNull();
  });
  it('shows completion only when the server says activated, with links back to billing and OwedBook', async () => {
    sessionStorage.setItem(OP_KEY, OP);
    serve({ '/api/stores/add/status': status({ state: 'activated', paymentRequired: false, paymentIssue: 'none', hostedPaymentUrl: null, businessId: 'b' }) });
    render(<AddStoreFlow />);
    expect((await screen.findByTestId('add-store-complete')).textContent).toBe('Stark Test Pharmacy 02 has been added');
    expect(screen.getByText(/\$48\.90/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to billing' }).getAttribute('href')).toBe('/billing');
    expect(screen.getByRole('link', { name: 'Open OwedBook' }).getAttribute('href')).toMatch(/\/api\/handoff\/start\?return=\/owedbook$/);
    await waitFor(() => expect(sessionStorage.getItem(OP_KEY)).toBeNull());
  });
  it('Pay shows a spinner with busy text, opens Stripe once in a new tab, and reports a blocked tab', async () => {
    serve({ '/api/stores/operations': [], '/api/stores/add/quote': { quoteId: 'q', amountCents: 4890, periodEnd: '2026-12-19T00:00:00Z', quoteExpiresAt: '2026-11-19T10:00:00Z', nextRenewalCents: 14800, consentCopyVersion: 'v', storeName: 'S2', npi: '1003000043', discountExplanation: '' } });
    const open = jest.spyOn(window, 'open').mockReturnValue(null);   // the browser blocks the new tab
    render(<AddStoreFlow />);
    await act(async () => { await Promise.resolve(); });
    fireEvent.change(screen.getByLabelText('Pharmacy name'), { target: { value: 'S2' } });
    fireEvent.change(screen.getByLabelText('NPI'), { target: { value: '1003000043' } });
    await act(async () => { fireEvent.submit(screen.getByTestId('add-store-form')); });
    for (const box of screen.getAllByRole('checkbox')) fireEvent.click(box);
    let release: (v: unknown) => void = () => {};
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise((r) => { release = r; }));
    fireEvent.click(screen.getByTestId('add-store-confirm'));
    const btn = screen.getByTestId('add-store-confirm');
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.textContent).toMatch(/Processing payment/);
    await act(async () => { release({ ok: true, status: 200, json: async () => ({ data: status({ paymentIssue: 'no_payment_method' }) }) }); });
    expect(await screen.findByText('We could not charge a saved card')).toBeTruthy();
    expect(open).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Your browser blocked the new tab/)).toBeTruthy();
    expect(calls.filter((c) => c.url === '/api/stores/add/confirm')).toHaveLength(0);   // the confirm went through the held mock above
    open.mockRestore();
  });
});

describe('StoreRemovalControl confirmation', () => {
  it('names the pharmacy and the date, Cancel sends nothing, Schedule removal posts once with busy text', async () => {
    serve({ '/api/stores/s2/removal': { state: 'completed' } });
    const changed = jest.fn();
    render(<StoreRemovalControl storeId="s2" storeName="Stark Test Pharmacy 02" periodEnd="2026-12-19T00:00:00Z" removalEffectiveAt={null} onChanged={changed} />);
    fireEvent.click(screen.getByTestId('remove-store-s2'));
    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/Remove Stark Test Pharmacy 02 on/)).toBeTruthy();
    expect(within(dialog).getByText(/No refund or credit is given/)).toBeTruthy();
    expect(within(dialog).queryByRole('button', { name: 'OK' })).toBeNull();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(calls).toHaveLength(0);
    fireEvent.click(screen.getByTestId('remove-store-s2'));
    const again = await screen.findByRole('alertdialog');
    await act(async () => { fireEvent.click(within(again).getByTestId('confirm-remove-s2')); });
    expect(calls.map((c) => c.url)).toEqual(['/api/stores/s2/removal']);
    expect(await screen.findByText(/Removal scheduled for/)).toBeTruthy();
    expect(changed).toHaveBeenCalledTimes(1);
  });
});

// Manual QA 20 Nov 2026 — the owner-only notice (shared by the billing screens and the /stores/add page guard).
import { OwnerOnlyNotice } from '@/components/portal/account/OwnerOnlyNotice';
describe('owner-only notice', () => {
  it('states the restriction, offers OwedBook, and shows no billing detail', () => {
    render(<OwnerOnlyNotice eyebrow="Add a pharmacy" context="Adding a pharmacy changes the subscription, so only the account owner can do it." />);
    expect(screen.getByRole('heading', { name: 'Billing is managed by the account owner' })).toBeTruthy();
    expect(screen.getByTestId('denied-context').textContent).toMatch(/only the account owner/);
    expect(screen.getByTestId('open-owedbook')).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/\$|•••• |invoice #|Quote/);
  });
});
