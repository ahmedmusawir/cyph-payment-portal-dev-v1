// APBM007A — anonymous first-store registration (BILL-01 "Checkout authority", AC-007..AC-009).
// The draft is owned by a secret held in an httpOnly cookie; IDs and email alone authorise nothing.
// Prices are computed here; the browser never supplies an amount, price, customer or account.
import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import { admin, bytea, rpc } from '@/server/db';
import { PortalError } from '@/server/errors';
import { buildQuote, resolvePromotion, QUOTE_VERSION, TERMS_VERSION } from '@/server/pricing';
import { normalizeNpi, NPI_MESSAGES } from '@/services/portal/npi';

export const OWNER_DECLARATION_VERSION = 'owner-declaration-2026-11';

const trimmed = (min: number, max: number) => z.string().trim().min(min).max(max);
const ownerSchema = z.object({
  firstName: trimmed(1, 80), lastName: trimmed(1, 80),
  email: z.string().trim().toLowerCase().email().max(254),
  mobile: z.string().trim().regex(/^[0-9+()\-. ]{10,20}$/),
  ownerDeclarationAccepted: z.literal(true),
});
const pharmacySchema = z.object({
  name: trimmed(2, 120), street: trimmed(2, 160), city: trimmed(2, 80),
  state: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/),
  zip: z.string().trim().regex(/^[0-9]{5}(-[0-9]{4})?$/),
  phone: z.string().trim().regex(/^[0-9+()\-. ]{10,20}$/),
  npi: z.string(),
  ncpdp: z.string().trim().regex(/^[0-9]{7}$/).optional().or(z.literal('')),   // optional (D-03)
  software: z.enum(['Liberty', 'Pioneer', 'Other']), softwareOther: z.string().trim().max(80).optional(),
});
export type OwnerInput = z.input<typeof ownerSchema>;
export type PharmacyInput = z.input<typeof pharmacySchema>;

export interface DraftRow {
  id: string; revision: number; status: 'draft' | 'checkout_started' | 'paid' | 'provisioned' | 'abandoned';
  signed_in_user_id: string | null;
  owner_first_name: string | null; owner_last_name: string | null; owner_email: string | null; owner_phone: string | null;
  owner_declaration_accepted_at: string | null;
  pharmacy_name: string | null; address: string | null; city: string | null; state: string | null; zip: string | null;
  phone: string | null; software: string | null; npi: string | null; ncpdp: string | null;
  quote_revision: number | null; quote_subtotal_cents: number | null; quote_discount_cents: number | null;
  quote_total_cents: number | null; quote_promotion_code: string | null; quote_price_id: string | null; quote_expires_at: string | null;
  consent_terms_version: string | null; consent_revision: number | null; consent_accepted_at: string | null;
}
const COLUMNS = 'id,revision,status,signed_in_user_id,owner_first_name,owner_last_name,owner_email,owner_phone,owner_declaration_accepted_at,pharmacy_name,address,city,state,zip,phone,software,npi,ncpdp,quote_revision,quote_subtotal_cents,quote_discount_cents,quote_total_cents,quote_promotion_code,quote_price_id,quote_expires_at,consent_terms_version,consent_revision,consent_accepted_at';

export const hashSecret = (secret: string): Buffer => createHash('sha256').update(secret).digest();
export const newSecret = (): string => randomBytes(32).toString('base64url');
const validSecret = (s: string | undefined): s is string => typeof s === 'string' && /^[A-Za-z0-9_-]{43}$/.test(s);

/** The draft that this cookie secret owns, or null. A guessed draft ID is useless without the secret. */
export async function loadDraft(secret: string | undefined): Promise<DraftRow | null> {
  if (!validSecret(secret)) return null;
  const r = await admin().from('registration_drafts').select(COLUMNS).eq('secret_hash', bytea(hashSecret(secret))).maybeSingle();
  if (r.error) throw new PortalError('provider_unavailable', `draft read ${r.error.code}`);
  return (r.data as DraftRow | null) ?? null;
}

function fieldErrors(prefix: string, issues: z.ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of issues) out[`${prefix}.${i.path.join('.')}`] ??= i.code === 'invalid_literal' ? 'Confirm this to continue.' : 'Check this field.';
  return out;
}

export interface SaveResult { draft: DraftRow; newSecret?: string }

/**
 * Create or update the draft. One store only. Validation, NPI normalisation and the NPI hold all happen here;
 * a saved revision invalidates any earlier quote and consent.
 */
export async function saveDraft(secret: string | undefined, input: { owner: unknown; pharmacy: unknown }, signedInUserId: string | null): Promise<SaveResult> {
  const owner = ownerSchema.safeParse(input.owner);
  const pharmacy = pharmacySchema.safeParse(input.pharmacy);
  const errors = { ...(owner.success ? {} : fieldErrors('owner', owner.error.issues)), ...(pharmacy.success ? {} : fieldErrors('pharmacy', pharmacy.error.issues)) };
  const npi = pharmacy.success ? normalizeNpi(pharmacy.data.npi) : null;
  if (npi && !npi.ok) errors['pharmacy.npi'] = NPI_MESSAGES[npi.reason];
  if (!owner.success || !pharmacy.success || !npi || !npi.ok) throw new PortalError('invalid_input', 'draft validation', errors);

  let existing = await loadDraft(secret);
  if (existing && existing.status !== 'draft') throw new PortalError('operation_in_progress', `draft is ${existing.status}`);
  let created: string | undefined;
  const values = {
    signed_in_user_id: signedInUserId,
    owner_first_name: owner.data.firstName, owner_last_name: owner.data.lastName, owner_email: owner.data.email, owner_phone: owner.data.mobile,
    owner_declaration_version: OWNER_DECLARATION_VERSION, owner_declaration_accepted_at: new Date().toISOString(),
    pharmacy_name: pharmacy.data.name, address: pharmacy.data.street, city: pharmacy.data.city, state: pharmacy.data.state, zip: pharmacy.data.zip,
    phone: pharmacy.data.phone, software: pharmacy.data.software === 'Other' ? (pharmacy.data.softwareOther || 'Other') : pharmacy.data.software,
    npi: npi.npi, ncpdp: pharmacy.data.ncpdp || null,
    quote_revision: null, quote_subtotal_cents: null, quote_discount_cents: null, quote_total_cents: null, quote_currency: null,
    quote_promotion_code: null, quote_price_id: null, quote_expires_at: null,
    consent_terms_version: null, consent_revision: null, consent_accepted_at: null,
  };
  if (!existing) {
    created = newSecret();
    const ins = await admin().from('registration_drafts').insert({ secret_hash: bytea(hashSecret(created)), ...values }).select(COLUMNS).single();
    if (ins.error) throw new PortalError('provider_unavailable', `draft insert ${ins.error.code}`);
    existing = ins.data as DraftRow;
  } else {
    const upd = await admin().from('registration_drafts').update({ ...values, revision: existing.revision + 1 })
      .eq('id', existing.id).eq('revision', existing.revision).eq('status', 'draft').select(COLUMNS).maybeSingle();
    if (upd.error) throw new PortalError('provider_unavailable', `draft update ${upd.error.code}`);
    if (!upd.data) throw new PortalError('operation_in_progress', 'draft changed concurrently');
    existing = upd.data as DraftRow;
  }
  await holdNpi(existing.id, npi.npi);
  return { draft: existing, newSecret: created };
}

/** Injected by the checkout module so that a stale bound reservation can be proven unpaid against Stripe. */
let proveUnpaid: ((operationId: string) => Promise<void>) | null = null;
export function setUnpaidProver(fn: (operationId: string) => Promise<void>): void { proveUnpaid = fn; }

/**
 * Hold the NPI for this draft. The public answer for any conflict is the same neutral npi_unavailable;
 * it never says whether a store, another registration or a payment holds the number.
 */
export async function holdNpi(draftId: string, npi: string): Promise<void> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const [r] = await rpc<{ outcome: string; blocking_operation_id: string | null }[]>('npi_reserve', { p_draft: draftId, p_npi: npi });
    if (r.outcome === 'held' || r.outcome === 'checkout_bound') return;
    if (r.outcome === 'invalid') throw new PortalError('invalid_input', 'npi rejected by database', { 'pharmacy.npi': NPI_MESSAGES.check_digit });
    if (r.outcome === 'needs_proof' && attempt === 0 && r.blocking_operation_id && proveUnpaid) {
      await proveUnpaid(r.blocking_operation_id);   // one authoritative read of that Checkout session, then one retry
      continue;
    }
    throw new PortalError('npi_unavailable', r.outcome);
  }
  throw new PortalError('npi_unavailable', 'unresolved after proof');
}

const complete = (d: DraftRow): boolean => !!(d.owner_first_name && d.owner_last_name && d.owner_email && d.owner_declaration_accepted_at && d.pharmacy_name && d.address && d.city && d.state && d.zip && d.npi);

/** Compute and store the server quote for the draft's current revision, with an optional APA code. */
export async function requestQuote(secret: string | undefined, priceId: string, code?: string | null): Promise<DraftRow> {
  const draft = await loadDraft(secret);
  if (!draft) throw new PortalError('not_found', 'no draft');
  if (draft.status !== 'draft') throw new PortalError('operation_in_progress', `draft is ${draft.status}`);
  if (!complete(draft)) throw new PortalError('invalid_input', 'draft incomplete');
  const promotion = code && code.trim() ? await resolvePromotion(code) : null;
  const q = buildQuote(promotion);
  const upd = await admin().from('registration_drafts').update({
    quote_revision: draft.revision, quote_subtotal_cents: q.subtotalCents, quote_discount_cents: q.discountCents, quote_total_cents: q.totalCents,
    quote_currency: q.currency, quote_promotion_code: promotion?.code ?? null, quote_price_id: priceId, quote_expires_at: q.expiresAt,
    consent_terms_version: null, consent_revision: null, consent_accepted_at: null,
  }).eq('id', draft.id).eq('revision', draft.revision).eq('status', 'draft').select(COLUMNS).maybeSingle();
  if (upd.error) throw new PortalError('provider_unavailable', `quote store ${upd.error.code}`);
  if (!upd.data) throw new PortalError('operation_in_progress', 'draft changed concurrently');
  return upd.data as DraftRow;
}

export const quoteIsCurrent = (d: DraftRow, now = Date.now()): boolean =>
  d.quote_revision === d.revision && d.quote_total_cents !== null && !!d.quote_expires_at && Date.parse(d.quote_expires_at) > now;

export const maskEmail = (email: string | null): string => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  return `${local.slice(0, 1)}${'•'.repeat(Math.max(1, Math.min(6, local.length - 1)))}@${domain}`;
};

/** What the browser may see of its own draft. No internal identifier other than the revision. */
export function draftView(d: DraftRow) {
  return {
    revision: d.revision, status: d.status,
    owner: { firstName: d.owner_first_name ?? '', lastName: d.owner_last_name ?? '', email: d.owner_email ?? '', mobile: d.owner_phone ?? '', ownerDeclarationAccepted: !!d.owner_declaration_accepted_at },
    pharmacy: { name: d.pharmacy_name ?? '', street: d.address ?? '', city: d.city ?? '', state: d.state ?? '', zip: d.zip ?? '', phone: d.phone ?? '', npi: d.npi ?? '', ncpdp: d.ncpdp ?? '', software: d.software ?? '' },
    quote: d.quote_total_cents === null || d.quote_revision !== d.revision ? null : {
      version: QUOTE_VERSION, draftRevision: d.quote_revision, subtotalCents: d.quote_subtotal_cents, discountCents: d.quote_discount_cents ?? 0,
      totalCents: d.quote_total_cents, currency: 'USD' as const, promotionCode: d.quote_promotion_code, expiresAt: d.quote_expires_at,
      expired: !quoteIsCurrent(d),
    },
    termsVersion: TERMS_VERSION,
  };
}
