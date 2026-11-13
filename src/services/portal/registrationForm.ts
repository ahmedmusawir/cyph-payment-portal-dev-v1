// APBM007A — registration form values, inline validation and the mapping to and from the server draft.
// Pure. The server is the authority: these rules mirror its schema so most mistakes are caught before a
// request, and whatever the server still rejects is shown from its own field errors.
import type { OwnerInput, PharmacyInput, PharmacySoftware, RegistrationDraftView } from '@/types/portal/api';
import { normalizeNpi, NPI_MESSAGES } from './npi';

export type FieldErrors = Record<string, string>;

export interface OwnerForm {
  firstName: string; lastName: string; email: string; mobile: string; ownerDeclarationAccepted: boolean;
}
export interface PharmacyValues {
  name: string; street: string; city: string; state: string; zip: string;
  ncpdp: string; npi: string; phone: string; software: string; softwareOther: string;
}

export const EMPTY_OWNER: OwnerForm = { firstName: '', lastName: '', email: '', mobile: '', ownerDeclarationAccepted: false };
export const EMPTY_PHARMACY: PharmacyValues = { name: '', street: '', city: '', state: '', zip: '', ncpdp: '', npi: '', phone: '', software: '', softwareOther: '' };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+()\-. ]{10,20}$/;
const SOFTWARE: readonly string[] = ['Liberty', 'Pioneer', 'Other'];
const between = (v: string, min: number, max: number) => v.trim().length >= min && v.trim().length <= max;

export function validateOwnerForm(f: OwnerForm): FieldErrors {
  const e: FieldErrors = {};
  if (!between(f.firstName, 1, 80)) e.firstName = 'Enter your first name.';
  if (!between(f.lastName, 1, 80)) e.lastName = 'Enter your last name.';
  if (!f.email.trim()) e.email = 'Enter your work email.';
  else if (!EMAIL.test(f.email.trim()) || f.email.trim().length > 254) e.email = 'Enter an email address like name@pharmacy.com.';
  if (!PHONE.test(f.mobile.trim())) e.mobile = 'Enter a phone number with at least 10 digits.';
  if (f.ownerDeclarationAccepted !== true) e.ownerDeclaration = 'Confirm that you are the pharmacy owner to continue.';
  return e;
}

export function validatePharmacyValues(f: PharmacyValues): FieldErrors {
  const e: FieldErrors = {};
  if (!between(f.name, 2, 120)) e.name = 'Enter the pharmacy name.';
  if (!between(f.street, 2, 160)) e.street = 'Enter the street address.';
  if (!between(f.city, 2, 80)) e.city = 'Enter the city.';
  if (!/^[A-Za-z]{2}$/.test(f.state.trim())) e.state = 'Choose the state.';
  if (!/^[0-9]{5}(-[0-9]{4})?$/.test(f.zip.trim())) e.zip = 'Enter the 5-digit ZIP code.';
  if (f.ncpdp.trim() && !/^[0-9]{7}$/.test(f.ncpdp.trim())) e.ncpdp = "An NCPDP number has 7 digits. Leave it blank if you don't have it to hand.";
  const npi = normalizeNpi(f.npi);
  if (!npi.ok) e.npi = NPI_MESSAGES[npi.reason];
  if (!PHONE.test(f.phone.trim())) e.phone = 'Enter the store phone number.';
  if (!SOFTWARE.includes(f.software)) e.software = 'Choose the pharmacy software.';
  else if (f.software === 'Other' && !between(f.softwareOther, 1, 80)) e.softwareOther = 'Enter the software name.';
  return e;
}

export function ownerFromDraft(d: RegistrationDraftView | null): OwnerForm {
  return d ? { ...d.owner } : { ...EMPTY_OWNER };
}

/** The stored software is Liberty, Pioneer, or the name typed for "Other". */
export function pharmacyFromDraft(d: RegistrationDraftView | null): PharmacyValues {
  if (!d) return { ...EMPTY_PHARMACY };
  const p = d.pharmacy;
  const listed = p.software === 'Liberty' || p.software === 'Pioneer';
  return {
    name: p.name, street: p.street, city: p.city, state: p.state, zip: p.zip, ncpdp: p.ncpdp, npi: p.npi, phone: p.phone,
    software: listed ? p.software : p.software ? 'Other' : '',
    softwareOther: listed || p.software === 'Other' ? '' : p.software,
  };
}

export function toOwnerInput(f: OwnerForm): OwnerInput {
  return { firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email.trim(), mobile: f.mobile.trim(), ownerDeclarationAccepted: true };
}

export function toPharmacyInput(f: PharmacyValues): PharmacyInput {
  const npi = normalizeNpi(f.npi);
  return {
    name: f.name.trim(), street: f.street.trim(), city: f.city.trim(), state: f.state.trim().toUpperCase(), zip: f.zip.trim(),
    phone: f.phone.trim(), npi: npi.ok ? npi.npi : f.npi.trim(),
    ...(f.ncpdp.trim() ? { ncpdp: f.ncpdp.trim() } : {}),
    software: f.software as PharmacySoftware,
    ...(f.software === 'Other' && f.softwareOther.trim() ? { softwareOther: f.softwareOther.trim() } : {}),
  };
}

/** Server field errors are keyed `owner.email` / `pharmacy.npi`; the forms use the bare field name. */
export function splitFieldErrors(fieldErrors: FieldErrors | undefined): { owner: FieldErrors; pharmacy: FieldErrors } {
  const owner: FieldErrors = {};
  const pharmacy: FieldErrors = {};
  for (const [key, message] of Object.entries(fieldErrors ?? {})) {
    if (key.startsWith('owner.')) owner[key === 'owner.ownerDeclarationAccepted' ? 'ownerDeclaration' : key.slice(6)] = message;
    else if (key.startsWith('pharmacy.')) pharmacy[key.slice(9)] = message;
  }
  return { owner, pharmacy };
}

/** True when the saved draft has everything the review step needs. */
export function draftIsComplete(d: RegistrationDraftView | null): d is RegistrationDraftView {
  return !!d && !!d.owner.firstName && !!d.owner.email && d.owner.ownerDeclarationAccepted && !!d.pharmacy.name && !!d.pharmacy.npi;
}
