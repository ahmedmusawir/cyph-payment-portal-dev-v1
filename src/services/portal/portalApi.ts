// APBM007A — the portal's browser-side API client. Every customer screen reads and writes through here.
// Same-origin fetches only; the browser sends the Origin header itself. Amounts, statuses and decisions
// always come from the server response — nothing is computed here.
import type {
  ApiErrorCode,
  ApiResult,
  BillingOverviewResponse,
  CheckoutConsents,
  OwnerInput,
  PharmacyInput,
  RegistrationDraftView,
  RegistrationStatusView,
} from '@/types/portal/api';

const KNOWN_CODES: readonly ApiErrorCode[] = [
  'invalid_input', 'sign_in_required', 'not_owner', 'not_found', 'operation_in_progress', 'npi_unavailable',
  'already_subscribed', 'expired', 'promotion_not_accepted', 'slow_down', 'provider_unavailable', 'not_billable',
  'configuration', 'sign_out_incomplete',
];
const NETWORK_MESSAGE = 'Could not reach the server. Check your connection and try again.';
const UNEXPECTED_MESSAGE = 'Something went wrong on our side. Try again in a moment.';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function stringMap(v: unknown): Record<string, string> | undefined {
  if (!isRecord(v)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) if (typeof val === 'string') out[k] = val;
  return Object.keys(out).length ? out : undefined;
}

/** Map a failed response's JSON body `{error, message, fieldErrors?}` to the client error shape. */
export function toApiError(status: number, body: unknown): Extract<ApiResult<never>, { ok: false }> {
  const b = isRecord(body) ? body : {};
  const code = KNOWN_CODES.find((c) => c === b.error) ?? 'unexpected';
  const message = typeof b.message === 'string' && b.message ? b.message : UNEXPECTED_MESSAGE;
  const fieldErrors = stringMap(b.fieldErrors);
  return { ok: false, status, code, message, ...(fieldErrors ? { fieldErrors } : {}) };
}

async function request<T>(path: string, write?: { method: 'POST' | 'DELETE'; body?: unknown }): Promise<ApiResult<T>> {
  const init: RequestInit = write
    ? { method: write.method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(write.body ?? {}) }
    : { method: 'GET', cache: 'no-store' };
  // .catch() chains, not try/catch (kit gotcha: the dev overlay intercepts throws).
  const res = await fetch(path, init).catch(() => null);
  if (!res) return { ok: false, status: 0, code: 'network', message: NETWORK_MESSAGE };
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) return toApiError(res.status, body);
  if (!isRecord(body)) return { ok: false, status: res.status, code: 'unexpected', message: UNEXPECTED_MESSAGE };
  return { ok: true, value: body as T };
}

function pick<T, K extends keyof T>(result: ApiResult<T>, key: K): ApiResult<T[K]> {
  return result.ok ? { ok: true, value: result.value[key] } : result;
}

export const portalApi = {
  // ---- registration ----
  async getDraft(): Promise<ApiResult<RegistrationDraftView | null>> {
    return pick(await request<{ draft: RegistrationDraftView | null }>('/api/registration/draft'), 'draft');
  },
  /** Owner and pharmacy are saved together; a saved revision invalidates any earlier quote. */
  async saveDraft(input: { owner: OwnerInput; pharmacy: PharmacyInput }): Promise<ApiResult<RegistrationDraftView>> {
    return pick(await request<{ draft: RegistrationDraftView }>('/api/registration/draft', { method: 'POST', body: input }), 'draft');
  },
  /** Server quote for the current revision; `code` is the optional APA member code. */
  async requestQuote(code?: string): Promise<ApiResult<RegistrationDraftView>> {
    const body = code && code.trim() ? { code: code.trim() } : {};
    return pick(await request<{ draft: RegistrationDraftView }>('/api/registration/quote', { method: 'POST', body }), 'draft');
  },
  /** Start or resume Stripe-hosted Checkout. The same `operationKey` resumes the same operation. */
  async startCheckout(operationKey: string, consents: CheckoutConsents): Promise<ApiResult<string>> {
    return pick(await request<{ url: string }>('/api/registration/checkout', { method: 'POST', body: { operationKey, consents } }), 'url');
  },
  /** Go back and edit: the server closes the open Checkout session first. */
  async cancelCheckout(): Promise<ApiResult<string>> {
    return pick(await request<{ status: string }>('/api/registration/checkout', { method: 'DELETE' }), 'status');
  },
  async getStatus(opts: { reconcile?: boolean } = {}): Promise<ApiResult<RegistrationStatusView>> {
    return pick(await request<{ status: RegistrationStatusView }>(`/api/registration/status${opts.reconcile ? '?reconcile=1' : ''}`), 'status');
  },
  /** Ask for the access email again. The answer is deliberately generic. */
  async resendAccessEmail(): Promise<ApiResult<string>> {
    return pick(await request<{ result: string }>('/api/registration/status', { method: 'POST' }), 'result');
  },

  // ---- billing (signed-in owner) ----
  getBillingOverview(): Promise<ApiResult<BillingOverviewResponse>> {
    return request<BillingOverviewResponse>('/api/billing/overview');
  },
  async openBillingPortal(): Promise<ApiResult<string>> {
    return pick(await request<{ url: string }>('/api/billing/portal', { method: 'POST' }), 'url');
  },
  async undoCancel(): Promise<ApiResult<boolean>> {
    return pick(await request<{ cleared: boolean }>('/api/billing/undo-cancel', { method: 'POST' }), 'cleared');
  },

  // ---- session ----
  /** Password sign-in. The login route answers `{error: string}` on failure, so its text is passed through. */
  async signIn(email: string, password: string): Promise<ApiResult<true>> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);
    if (!res) return { ok: false, status: 0, code: 'network', message: 'Could not reach the server. Try again.' };
    const body: unknown = await res.json().catch(() => null);
    if (res.ok) return { ok: true, value: true };
    const text = isRecord(body) && typeof body.error === 'string' && body.error ? body.error : 'Login failed.';
    return { ok: false, status: res.status, code: 'unexpected', message: text };
  },
  /** Provider-wide sign-out. A 502 carries an honest message: signed out here, not confirmed everywhere. */
  async signOut(): Promise<ApiResult<true>> {
    const r = await request<Record<string, unknown>>('/api/auth/logout', { method: 'POST' });
    return r.ok ? { ok: true, value: true } : r;
  },
};
