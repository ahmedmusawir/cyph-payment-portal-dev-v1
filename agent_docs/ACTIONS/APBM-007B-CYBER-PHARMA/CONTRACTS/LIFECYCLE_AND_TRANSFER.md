**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Pharmacy identity, removal, transfer and support recovery

## Permanent identity and ownership separation

Introduce pharmacy_identities(id UUID PK, npi unique, created_at). For existing stores, preserve the historical permanent identity by assigning canonical id equal to existing businesses.id; add businesses.pharmacy_id FK to it. Existing businesses rows become ownership-scoped records; their IDs and all claims/file/audit foreign keys remain unchanged. New owner receives a new ownership businesses.id linked to the same pharmacy_id; no historical claims copied or reparented. New pharmacies create canonical id and first ownership row together.

Canonical NPI remains globally unique in pharmacy_identities. Replace the old all-row businesses NPI index only after backfill and invariant assertion; ownership rows may retain historical NPI but at most one active row per canonical identity/NPI. NPI reservation and activation share the existing advisory lock key across registration and Add Store. An approved transfer reserves for the exact buyer; public duplicate-NPI still routes to support. Database activation locks identity and transfer, closes prior active ownership and activates successor atomically; prove two concurrent attempts. No active overlap, even if housekeeping was delayed past effective time.

All existing claims/report files stay on original ownership business_id. Buyer has no association to those IDs. Owner/member/admin, tenant-store helper, SECURITY DEFINER wrappers and direct RLS reads/writes must all use the new active-ownership/time predicate. No status-only or current-account reassignment exposes history.

## Scheduled removal

Owner requests period-end removal. Provider recurring quantity decreases now with no proration, no credit/refund/current invoice line; access remains until stored paid-period cutoff. Store remains readable/writable under normal account rules until cutoff. Undo strictly before cutoff restores absolute quantity with no charge and clears removal. At/after cutoff no undo; support handles reactivation, preserving canonical identity. Last billable store routes to existing whole-account period-end cancellation; quantity never zero. Do not reset grace through cancel/undo/retry. Test provider preview AND next actual renewal invoice.

At cutoff owner/admin/member live access ends by server time, independent of housekeeping; idempotent job later sets removed and retires memberships. Ordinary removed records are preserved with no customer historical access; controlled support procedure only. Account cancellation follows existing owner billing recovery contract.

## Sale history

Default sale effective time is seller paid-period end, explicitly agreed and audited. If another time is agreed, preserve no-refund/no-credit policy and show each party its own billed period; do not compute a refund. Seller owner keeps read-only claims/receivables for the seller ownership business_id through owner-only historical read RPCs; staff lose access. All historical wrappers enforce exact source-owner account and never include buyer records. Existing OwedBook UI may offer owner-only archived-store selection; no new report/PDF feature. Ordinary removed-store history is not this sale exception.

Buyer pays using own account/subscription/card via normal registration or Add Store. Transfer authorization alone never activates the buyer. Lock canonical identity and buyer reservation through buyer-paid activation; buyer cannot claim NPI outside the authorized transfer. Failure to pay leaves no buyer access; seller is not silently restored or billed after the agreed transfer boundary. Operator has explicit attention/recovery procedure. Cancel transfer only before effective time and before buyer payment; otherwise attention, never cross-party subscription/card transfer.

## Implemented operator actions and procedures

Portal existing protected operator route expands with typed exact-ID commands: store-transfer-authorize, store-transfer-complete, store-transfer-cancel, owner-replace (identity recovery), store-admin-set, store-operation-reconcile, quantity-check and removed-store-reactivate. No raw SQL, arbitrary amounts, prefix operations, or free NPI release to an unrelated claimant. Dry-run default; --apply, actor, reason and ticket mandatory for mutation. Every command records immutable before/after/outcome with authenticated_as='shared_operator_v1' and separately declared_actor; never credential value/hash. The shared staging credential proves possession, not individual identity; retain this limitation in the eventual certificate. Individual operator sign-in is a production prerequisite.

owner-replace is verified account identity recovery, not a store sale: same legal billing account remains. Require confirmed existing new identity, no conflicting owned account, ticketed verification; atomically change owner and remove old identity's access-granting memberships for that account, invalidate pending handoff/invitation authority, update mapped customer email through resumable provider step. No subscription/card moved to another legal owner/buyer. Actor authority and user-visible outcomes are tested; support verifies documents out of band and records evidence reference only, no sensitive documents in repo.

AC-021/022/023/024 tag IMPLEMENTED (OPERATOR COMMAND); accompanying identity verification/contact procedures tag SUPPORT PROCEDURE and are graded separately. Sole-admin owner replacement remains implemented customer UI. Implement scripts/operator-007b.mjs with --help, dry-run and exact command schemas plus SUPPORT_PROCEDURES.md covering inputs, who approves, before/after verification, failure/resume and exclusions. Neither procedure nor script substitutes for the other's evidence.

## BP-02 removal/undo boundary protection

Scheduling a removal and undoing one are refused inside the same end-of-period window as Add Store (shared90minute/sub-minimum predicate in BILLING.md). Each binds the subscription period it was requested in. After provider quantity change, re-read the subscription; if period is no longer the bound one, enter attention and no store is left active unbilled or billed after its cutoff. Preserve evidence and perform the recorded recovery; no stale-period activation. AC-019 includes undercharge as well as overcharge.

## BP-03 buyer payment window

A buyer quote or confirmation for a transfer-reserved NPI is refused before the agreed effective time. From that time, the reservation holds the NPI for the exact buyer until the authorization's recorded expiry. The operator records that expiry explicitly (default48hours after effective time). Between effective time and buyer activation there is no active ownership: seller access ends at its agreed time, not when the buyer happens to pay. Transactional successor activation enforces that the source ownership has ended and prevents two active owners. Reservation expiry without buyer payment enters attention; timeout never releases the NPI to the public.

## BP-04 store-operation-close

Typed exact operation ID, mandatory actor/reason/ticket, dry-run default. Retrieve the exact operation invoice and authoritative provider refund/credit/payment evidence. Only full extinguishment of the paid operation amount permits closed_refunded_externally and atomic release of operation slot/NPI hold. No refund dispatch, no partial-proof close, no activation. Record authenticated-as versus declared actor and all proof references; test denial, partial proof, provider read failure and idempotent success.

## BP-05 removed-store-reactivate

Authorization only, for the account that owned the removed store. Refuse if the NPI has active ownership or the store was transferred. Owner then uses ordinary Add Store quote/payment at remaining-period price, including minimum-charge and expiry rules. Authorization never changes provider quantity or grants access. Buyer sale cannot use this command.

Director default9 is pending. Proposed exact rule for approval: successful paid same-account reactivation reuses the original businesses ownership record and its history under the same canonical pharmacy identity. Grant access only after payment and recurring quantity reconciliation; set lifecycle dates for reactivation with append-only audit while preserving original history. If default9 is not approved, do not implement this proposed history behavior or invent the opposite; affected reactivation work waits for the ruling, unrelated safe work can continue. No E2 release until the Director default and Friday diff confirmation are recorded.
