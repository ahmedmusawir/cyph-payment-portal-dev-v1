/**
 * @jest-environment jsdom
 */
// R-011 + APBM007A component layer: the real owner and pharmacy steps against the registration API
// (fetch mocked). The owner declaration is required; owner and pharmacy are saved in one request when
// the pharmacy step completes; deferred choices are visibly unavailable.
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { OwnerView } from '@/components/portal/register/OwnerView';
import { PharmacyStepView } from '@/components/portal/register/PharmacyStepView';
import { PlanView } from '@/components/portal/register/PlanView';
import { OWNER_DECLARATION } from '@/services/portal';
import { REGISTRATION_SESSION_KEY, registrationSessionStore } from '@/services/portal/registrationSession';

const mockRouter = { push: jest.fn(), replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }));

const OWNER = { firstName: 'Jordan', lastName: 'Ellis', email: 'jordan@example.test', mobile: '(555) 010-0144', ownerDeclarationAccepted: true };
const SAVED = {
  revision: 1, status: 'draft', owner: OWNER,
  pharmacy: { name: 'Main Street Pharmacy', street: '1 Main St', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0145', npi: '1234567893', ncpdp: '', software: 'QS/1' },
  quote: null, termsVersion: 'terms-2026-11',
};

type Reply = { status?: number; body: unknown };
type Call = { url: string; method: string; body: any };
function mockFetch(handler: (call: Call) => Reply) {
  const calls: Call[] = [];
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    const call = { url: String(url), method: init?.method ?? 'GET', body: init?.body ? JSON.parse(String(init.body)) : undefined };
    calls.push(call);
    const r = handler(call);
    const code = r.status ?? 200;
    return { ok: code < 300, status: code, json: async () => r.body };
  }) as unknown as typeof fetch;
  return calls;
}
const noDraft = () => mockFetch(() => ({ body: { draft: null } }));
const set = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

function fillOwner() {
  set(/First name/, 'Jordan');
  set(/Last name/, 'Ellis');
  set(/Work email/, 'jordan@example.test');
  set(/Mobile phone/, '(555) 010-0144');
}
function fillPharmacy(npi = '1234567893') {
  set(/Pharmacy name/, 'Main Street Pharmacy');
  set(/Street address/, '1 Main St');
  set(/City/, 'Plano');
  set(/^State/, 'TX');
  set(/ZIP/, '75001');
  set(/^NPI/, npi);
  set(/Store phone/, '(555) 010-0145');
  set(/Pharmacy software/, 'Liberty');
}
const submit = async (name: string) => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name }));
  });
};

beforeEach(() => {
  sessionStorage.clear();
  registrationSessionStore.setState({ owner: null, pharmacy: null, operationKey: null });
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
});

describe('PlanView — one store only', () => {
  // Manual QA 19 Nov 2026 (R1): adding stores exists (Billing → Add a pharmacy); signup no longer says it is unavailable.
  it('has no store-count control and says more pharmacies are added from Billing once active', async () => {
    noDraft();
    render(<PlanView />);
    expect((await screen.findByTestId('store-count')).textContent).toMatch(/Once it is active you can add more pharmacies from Billing/);
    expect(document.body.textContent).not.toMatch(/not available yet/i);
    expect(screen.queryByRole('button', { name: /More pharmacies|Fewer pharmacies/ })).toBeNull();
    expect(screen.getByTestId('plan-price').textContent).toContain('$99.00');
    expect(document.body.textContent).not.toMatch(/illustrative|demo|TBD/i);
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/register/owner');
  });
});

describe('OwnerView — owner declaration (R-011)', () => {
  it('has no job-title control and an unchecked, exactly worded, required declaration', async () => {
    noDraft();
    render(<OwnerView />);
    const box = (await screen.findByRole('checkbox', { name: new RegExp(OWNER_DECLARATION.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })) as HTMLInputElement;
    expect(box.checked).toBe(false);
    expect(box.getAttribute('aria-required')).toBe('true');
    expect(screen.queryByLabelText(/Your role/)).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByText(/Pharmacist in charge/)).toBeNull();
  });

  it('blocks Continue without the declaration: summary + inline error, no navigation', async () => {
    noDraft();
    render(<OwnerView />);
    await screen.findByRole('checkbox');
    fillOwner();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    const inline = await screen.findByText('Confirm that you are the pharmacy owner to continue.', { selector: '#owner-declaration-err' });
    expect(inline).toBeTruthy();
    expect(screen.getByRole('checkbox').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('checkbox').getAttribute('aria-describedby')).toContain('owner-declaration-err');
    expect(screen.getByRole('link', { name: /Owner declaration/ }).getAttribute('href')).toBe('#owner-declaration');
    expect(document.activeElement).toBe(screen.getByTestId('error-summary'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('continues once the owner ticks the declaration, keeping the input for this tab only (no save yet)', async () => {
    const calls = noDraft();
    render(<OwnerView />);
    await screen.findByRole('checkbox');
    fillOwner();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(mockRouter.push).toHaveBeenCalledWith('/register/pharmacy');
    expect(JSON.parse(sessionStorage.getItem(REGISTRATION_SESSION_KEY)!).state.owner).toEqual(OWNER);
    expect(calls.filter((c) => c.method !== 'GET')).toEqual([]);
  });

  it('prefills from the server draft', async () => {
    mockFetch(() => ({ body: { draft: SAVED } }));
    render(<OwnerView />);
    expect(((await screen.findByLabelText(/Work email/)) as HTMLInputElement).value).toBe('jordan@example.test');
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
  });

  it('a draft that is no longer editable hands over to the status page', async () => {
    mockFetch(() => ({ body: { draft: { ...SAVED, status: 'paid' } } }));
    render(<OwnerView />);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/register/activation'));
    expect(screen.queryByLabelText(/Work email/)).toBeNull();
  });
});

describe('PharmacyStepView — one pharmacy, saved with the owner', () => {
  it('without owner details it goes back to the owner step', async () => {
    noDraft();
    render(<PharmacyStepView />);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/register/owner'));
  });

  // Manual QA 19 Nov 2026 (R5): signup collects no second person; the supported delegation path (owner-only store admin
  // invitation in OwedBook after activation) is explained instead of a disabled "Someone else" option.
  it('NCPDP is optional; the owner is the admin and delegation later is explained (no disabled "someone else")', async () => {
    registrationSessionStore.setState({ owner: OWNER });
    noDraft();
    render(<PharmacyStepView />);
    const ncpdp = await screen.findByLabelText(/NCPDP number/);
    expect(ncpdp.getAttribute('aria-required')).toBeNull();
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.map((r) => [r.value, r.checked, r.disabled])).toEqual([['owner', true, false]]);
    expect(screen.getByTestId('admin-delegation-note').textContent).toMatch(/invite someone else as its store admin\s+from OwedBook/);
    expect(document.body.textContent).not.toMatch(/not available yet/i);
    expect(screen.queryByLabelText(/Admin's email/)).toBeNull();
  });

  it('checks the NPI check digit inline before any request', async () => {
    registrationSessionStore.setState({ owner: OWNER });
    const calls = noDraft();
    render(<PharmacyStepView />);
    await screen.findByLabelText(/NCPDP number/);
    fillPharmacy('1234567890');
    await submit('Continue to review');
    expect(document.getElementById('ph-npi-err')!.textContent).toBe("That NPI doesn't pass its check digit. Check the number and try again.");
    expect(document.activeElement).toBe(screen.getByTestId('error-summary'));
    expect(calls.filter((c) => c.method === 'POST')).toEqual([]);
  });

  it('saves owner and pharmacy in one request, then goes to review', async () => {
    registrationSessionStore.setState({ owner: OWNER });
    const calls = mockFetch((c) => (c.method === 'POST' ? { body: { draft: SAVED } } : { body: { draft: null } }));
    render(<PharmacyStepView />);
    await screen.findByLabelText(/NCPDP number/);
    fillPharmacy('1234 567 893');
    await submit('Continue to review');
    expect(calls.filter((c) => c.method === 'POST')).toEqual([
      {
        url: '/api/registration/draft', method: 'POST',
        body: {
          owner: OWNER,
          pharmacy: { name: 'Main Street Pharmacy', street: '1 Main St', city: 'Plano', state: 'TX', zip: '75001', phone: '(555) 010-0145', npi: '1234567893', software: 'Liberty' },
        },
      },
    ]);
    expect(mockRouter.push).toHaveBeenCalledWith('/register/review');
    // Saved on the server: nothing unsaved is left in this tab.
    expect(registrationSessionStore.getState()).toMatchObject({ owner: null, pharmacy: null });
    // F-Q2-001: clearing that input must not make the owner guard send the browser back.
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('an unavailable NPI shows the neutral server message on the field and keeps the input', async () => {
    registrationSessionStore.setState({ owner: OWNER });
    mockFetch((c) => (c.method === 'POST' ? { status: 409, body: { error: 'npi_unavailable', message: "This NPI can't be registered right now." } } : { body: { draft: null } }));
    render(<PharmacyStepView />);
    await screen.findByLabelText(/NCPDP number/);
    fillPharmacy();
    await submit('Continue to review');
    expect(document.getElementById('ph-npi-err')!.textContent).toBe("This NPI can't be registered right now.");
    expect(document.body.textContent).not.toMatch(/already registered|another account|whose account/i);
    expect((screen.getByLabelText(/Pharmacy name/) as HTMLInputElement).value).toBe('Main Street Pharmacy');
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('server field errors land on their fields', async () => {
    registrationSessionStore.setState({ owner: OWNER });
    mockFetch((c) => (c.method === 'POST' ? { status: 400, body: { error: 'invalid_input', message: 'Check the highlighted fields and try again.', fieldErrors: { 'pharmacy.zip': 'Check this field.' } } } : { body: { draft: null } }));
    render(<PharmacyStepView />);
    await screen.findByLabelText(/NCPDP number/);
    fillPharmacy();
    await submit('Continue to review');
    expect(document.getElementById('ph-zip-err')!.textContent).toBe('Check this field.');
  });

  it('prefills a saved pharmacy, mapping a custom software name to "Other"', async () => {
    mockFetch(() => ({ body: { draft: SAVED } }));
    render(<PharmacyStepView />);
    expect(((await screen.findByLabelText(/Pharmacy software/)) as HTMLSelectElement).value).toBe('Other');
    expect((screen.getByLabelText(/Software name/) as HTMLInputElement).value).toBe('QS/1');
    expect((screen.getByLabelText(/^State/) as HTMLSelectElement).value).toBe('TX');
  });
});
