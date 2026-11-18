**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Data and application API shapes

Existing 007A fields/functions retain their current signatures. New routes use server-owned account context and cookie session verified against Auth. Browser never submits an authoritative customer/subscription/account/amount/role result. JSON success envelope `{data: value}`; failure `{error: {code, message, operationId?}}`, no raw SQL/provider exceptions or cross-tenant identifying facts. GET safe/no-store for private state. POST exact same-origin/CSRF guard as current app helpers; unsupported fields rejected, not trusted.

## New request/response contracts

| Route group | Request | Safe response |
|---|---|---|
| Add quote | storeName, npi, optional ncpdp | quoteId, amountCents, currency, periodEnd, quoteExpiresAt, nextRenewalCents, consentCopyVersion |
| Add confirm | quoteId, intentKey, consentTerms=true, consentRecurring=true, consentImmediate=true | operationId, state, paymentDeadline, paymentRequired, owner-authorized hostedPaymentUrl only when required |
| Status/abandon | operationId | state, safe errorCode, deadline, optional final businessId; no customer secrets or arbitrary provider URL |
| Removal/undo | exact businessId in path; intentKey in body | operationId, state, effectiveAt, billableCount, nextRenewalCents |
| Invite | role=admin/member, email, formerAdminDisposition=member/remove for owner admin replacement only | invitationId, status, expiresAt, attemptsRemaining; store list may show own authorized recipient, not cross-account details |
| Resend/revoke/accept/decline | invitationId in path, no account/store/role override | status and safe resulting store assignment |
| Member remove | exact businessId/userId in path | removed boolean; repeats idempotent without extra authority |
| Operator | typed action, exact UUIDs, dryRun/apply, actor/reason/ticket and action-specific verified inputs | dry-run diff or operation/action receipt; never free SQL/amount/outcome |

Status codes: 401 unauthenticated, 403 role denied without tenant details, 404 inaccessible object, 409 intent/operation/authority-state conflict, 410 expired/revoked invite or expired quote, 422 invalid NPI/input or unsupported billing configuration, 429 rate/counter refusal, 503 unresolved provider/lease/recovery temporarily unavailable. Product UI gives honest pending/attention/retry/expiry messages, never a success redirect without stored completion. A 2xx operation status response can describe pending; it does not mean activated. Webhook status contract remains its separate durable-event rule.

## Persistence fields and invariants

pharmacy_identities: id UUID, npi text unique, created_at. businesses adds pharmacy_id, ownership_started_at, ownership_ended_at, removal_effective_at, removed_at, transferred_at. Existing business.id/account_id/history links immutable for that ownership. One current ownership (`ownership_ended_at IS NULL`) per pharmacy identity includes suspended records; one active NPI is additionally asserted. Activation atomically ends old ownership before new current record; no source row deletion. Transfers reference exact source/successor business IDs and canonical pharmacy ID.

store_quotes: UUID, account/actor, normalized proposed store, amount/currency, prorationStart/period bounds, price/customer/subscription/item binding, billable counts, quote expiry, consent copy/version. store_operations: UUID, account, kind, state, quoteId, immutable consented amount/time/deadline/actor, target quantity, lease_owner, lease_until, fencing_epoch, last_error_code, invoiceId, activation businessId, timestamps. Partial unique unresolved operation/account; immutable original client intent identity retained even after terminal state.

provider_invoice_operations: invoiceId PK, operationId, artifact kind/attempt, customer/subscription reference, expected cents/currency, created/verified timestamps and outcome. Do not overload subscriptions.latest_invoice/grace_invoice. Provider call intents are append-only per operation+stage+attempt with exact canonical parameters and bounded reconciliation interval. No secret/auth URL/client secret persisted in public-readable objects; hosted URL can be retrieved privately when needed.

store_invitations: UUID, store/account, normalized email, intended identity, role, inviter, incumbent identity/version, incumbent disposition, status, expires_at, dispatch_attempts, last_sent_at, accepted/revoked timestamps. Exactly one pending per store/email and one admin invite/store; transaction proves exactly one active admin on every grant path.

notices extend notification_operations with invoiceId, noticeKind, dueAt, status, claim/fencing, payload fingerprint, attempts/firstAttemptAt, providerMessageId, finish/suppression/attention reason. UNIQUE(invoiceId,noticeKind). Raw credentials or personal verification documents never appear in audit. operator_actions append-only includes authenticated_as label, declared_actor, reason/ticket, target IDs, before/after safe state, phase/result and error code; preserve failed attempts.

All data paths are traceable to API_ROLE_MATRIX.md. No unreviewed operation or public SDK key grants permission by itself. User read-only getters exclude secret/provider capability fields. Migrations catalogue-assert these schemas, indexes, constraints and grants rather than relying on application code alone.
