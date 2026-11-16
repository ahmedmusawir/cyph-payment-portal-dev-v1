// Portal — the only import surface for portal UI (components and pages never import the engines,
// fixtures or server modules directly; AC-24). APBM007A: customer screens use the real API through
// `portalApi`. The frontend-first mock surface now lives in './ffm' and must not be imported by any
// route, layout or mounted component.
export { portalApi, toApiError } from './portalApi';
export { externalRedirect } from './navigate';
export { registrationSession, useRegistrationSession, REGISTRATION_SESSION_KEY } from './registrationSession';
export {
  draftIsComplete,
  EMPTY_OWNER,
  EMPTY_PHARMACY,
  ownerFromDraft,
  pharmacyFromDraft,
  splitFieldErrors,
  toOwnerInput,
  toPharmacyInput,
  validateOwnerForm,
  validatePharmacyValues,
} from './registrationForm';
export type { FieldErrors, OwnerForm, PharmacyValues } from './registrationForm';
export { formatDate, formatTime, formatUsd } from './format';
export { OWNER_DECLARATION, US_STATE_OPTIONS } from './reference';
export { normalizeNpi, NPI_MESSAGES } from './npi';
