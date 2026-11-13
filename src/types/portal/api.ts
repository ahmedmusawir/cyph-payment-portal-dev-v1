// APBM007A — browser-side view types for the portal's real API routes.
// Re-declared here (not imported from src/server) so client code never depends on a server module.
// Keep in step with: draftView (server/registration.ts), StatusView (server/registrationStatus.ts),
// Overview / PaymentMethodView (server/billing.ts) and the public codes in server/errors.ts.

export type ApiErrorCode =
  | 'invalid_input' | 'sign_in_required' | 'not_owner' | 'not_found' | 'operation_in_progress' | 'npi_unavailable'
  | 'already_subscribed' | 'expired' | 'promotion_not_accepted' | 'slow_down' | 'provider_unavailable' | 'not_billable'
  | 'configuration' | 'sign_out_incomplete'
  /** The request never reached the server. */
  | 'network'
  /** The server answered with something this client does not recognise. */
  | 'unexpected';

export type ApiResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; code: ApiErrorCode; message: string; fieldErrors?: Record<string, string> };

export type PharmacySoftware = 'Liberty' | 'Pioneer' | 'Other';

export interface OwnerInput {
  firstName: string; lastName: string; email: string; mobile: string; ownerDeclarationAccepted: true;
}
export interface PharmacyInput {
  name: string; street: string; city: string; state: string; zip: string; phone: string; npi: string;
  ncpdp?: string; software: PharmacySoftware; softwareOther?: string;
}

export interface RegistrationQuoteView {
  subtotalCents: number; discountCents: number; totalCents: number; currency: 'USD';
  promotionCode: string | null; expiresAt: string; expired: boolean;
}
export type RegistrationDraftStatus = 'draft' | 'checkout_started' | 'paid' | 'provisioned' | 'abandoned';
export interface RegistrationDraftView {
  revision: number;
  status: RegistrationDraftStatus;
  owner: { firstName: string; lastName: string; email: string; mobile: string; ownerDeclarationAccepted: boolean };
  /** `software` is the stored name: Liberty, Pioneer, or whatever was typed for "Other". */
  pharmacy: { name: string; street: string; city: string; state: string; zip: string; phone: string; npi: string; ncpdp: string; software: string };
  quote: RegistrationQuoteView | null;
  termsVersion: string;
}

export interface CheckoutConsents { termsAccepted: boolean; recurringChargeAccepted: boolean; priceChangeAccepted: boolean }

export interface RegistrationStatusView {
  draft: 'none' | 'editing' | 'checkout' | 'paid' | 'complete';
  payment: 'none' | 'pending' | 'confirmed' | 'expired' | 'unknown';
  provisioning: 'not_started' | 'pending' | 'ready' | 'attention';
  email: 'not_started' | 'pending' | 'sent' | 'failed' | 'not_needed';
  ownerEmailMasked: string;
  attention?: 'sign_in_to_finish' | 'contact_support';
  checkoutResumable: boolean;
}

export interface BillingOverview {
  account_id: string;
  access: { state: string; read_only: boolean; origin: string | null; grace_ends_at: string | null; cancel_scheduled?: boolean; policy_version: string };
  subscription: null | {
    id: string; origin: 'stripe' | 'synthetic_seed'; status: string | null; raw_status: string | null; quantity: number | null;
    current_period_start: string | null; current_period_end: string | null; cancel_at: string | null; cancel_at_period_end: boolean;
    paid_through: string | null; latest_invoice_status: string | null; grace_started_at: string | null; verified_at: string | null;
  };
  stores: { id: string; name: string; npi: string; status: string }[];
}
export type PaymentMethodState = { onFile: boolean; brand?: string; last4?: string } | 'unknown' | 'not_applicable';
export interface BillingOverviewResponse { overview: BillingOverview; paymentMethod: PaymentMethodState }

/** Any signed-in user of the portal (customers are ordinary members). No role is carried. */
export interface PortalUserView { displayName: string; email: string }
