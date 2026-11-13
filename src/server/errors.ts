// APBM007A — one error type for portal server operations. `code` is the public, generic code from the frozen
// status map (CONTRACT_DELTA §2); `detail` is for the server log only and must never carry a secret or address.
export type PortalErrorCode =
  | 'invalid_input' | 'sign_in_required' | 'not_owner' | 'not_found' | 'operation_in_progress' | 'npi_unavailable'
  | 'already_subscribed' | 'expired' | 'promotion_not_accepted' | 'slow_down' | 'provider_unavailable' | 'not_billable' | 'configuration';

const STATUS: Record<PortalErrorCode, number> = {
  invalid_input: 400, sign_in_required: 401, not_owner: 403, not_found: 404, operation_in_progress: 409,
  npi_unavailable: 409, not_billable: 409, already_subscribed: 409, expired: 410, promotion_not_accepted: 422, slow_down: 429,
  provider_unavailable: 502, configuration: 500,
};

export class PortalError extends Error {
  readonly status: number;
  constructor(readonly code: PortalErrorCode, readonly detail?: string, readonly fieldErrors?: Record<string, string>) {
    super(code);
    this.status = STATUS[code];
  }
}

const PUBLIC_MESSAGE: Record<PortalErrorCode, string> = {
  invalid_input: 'Check the highlighted fields and try again.',
  sign_in_required: 'Sign in to continue.',
  not_owner: 'Billing is managed by the account owner.',
  not_found: 'Not found.',
  operation_in_progress: 'A payment for this registration is already in progress. Check its status before trying again.',
  npi_unavailable: "This NPI can't be registered right now.",
  not_billable: 'This is a test account with no billing.',
  already_subscribed: 'This account already has a subscription. Open your billing page, or contact support.',
  expired: 'This has expired. Start again.',
  promotion_not_accepted: "That code can't be applied.",
  slow_down: 'Too many attempts. Wait a minute and try again.',
  provider_unavailable: "We couldn't reach the payment provider. Nothing was charged. Try again shortly.",
  configuration: 'This service is not available right now.',
};

/** JSON body for a failed request. Never includes `detail`. */
export function errorBody(e: unknown): { status: number; body: { error: PortalErrorCode; message: string; fieldErrors?: Record<string, string> } } {
  if (e instanceof PortalError) return { status: e.status, body: { error: e.code, message: PUBLIC_MESSAGE[e.code], ...(e.fieldErrors ? { fieldErrors: e.fieldErrors } : {}) } };
  return { status: 502, body: { error: 'provider_unavailable', message: PUBLIC_MESSAGE.provider_unavailable } };
}

/** Server log line with no query string, token, key or address. */
export function logServer(scope: string, e: unknown): void {
  const code = e instanceof PortalError ? `${e.code}${e.detail ? ` (${e.detail})` : ''}` : (e as { code?: string })?.code || (e as Error)?.name || 'error';
  console.error(`[portal:${scope}] ${String(code).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<address>').slice(0, 200)}`);
}
