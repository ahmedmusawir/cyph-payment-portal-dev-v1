# 007B proposed phase brief

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

## Intended outcome
An owner with a successfully provisioned account can add paid pharmacies, appoint store administrators, invite/revoke staff, manage store lifecycle changes and obtain controlled support recovery. Existing stores remain isolated and usable when an additional-store payment fails.

## Users and authority
- Account owner: own-account store/billing operations; appoint or replace store admins; reads across their account. Owner remains a platform member, not a platform administrator.
- Store admin: manages members only within the assigned store; no owner billing authority by virtue of being admin.
- Member: permitted store access, no billing, store creation or staff-management authority.
- Support operator: only explicitly defined, audited recovery/transfer operations. Possession of an NPI or mailbox alone does not establish ownership.

## Scope retained for planning
1. Paid Add Store, server-calculated disclosure, owner consent, payment confirmation and repeat-safe activation.
2. Admin/member invitations, acceptance, resend/revoke, existing/new identity behavior and wrong-user recovery.
3. Owner-appointed admin replacement, one-admin invariant, member revocation and sole-admin recovery.
4. Store removal at paid-period end, retained records, billing/access reconciliation; undo and last-store handling require D-03.
5. Support-assisted ownership/store transfer and owner recovery; exact implementation/procedure boundary requires D-04.
6. O-1 test-clock seam and actual sandbox failed-renewal/grace/read-only/recovery journey.
7. O-2 reminder-email delivery with retry/dedupe/recovery suppression, exact policy requires D-05.
8. Preserve 007A purchase/provisioning, magic-link confirmation, both-direction handoff, billing, cancellation/undo, global logout and tenant protections.
9. Prepare and independently verify the combined staging release after integration.

## Settled foundations
One account/many stores; one subscription and one graduated item; $99 first store and $49 each additional store monthly; staff logins uncharged. NPI is required, checksum-valid on new input and globally unique; stable internal ID; NCPDP optional. Host-only app cookies and destination-initiated handoff; canonical migrations only in OwedBook. Synthetic/public data only, existing DEV preserved. Single graduated catalogue is not reopened without evidence.

## Exclusions
Real claims/PHI ingestion; full math/import/reference/report pipeline; Google OAuth; production launch; in-app refunds/trials/new discounts; a new subscription pricing architecture; an unsolicited general support console; cross-account history access without explicit decision; changing applied migrations; DEV reset; old portal SQL execution; unsolicited repo-organization transfer or full-restore installation.

## UI direction
Reuse approved app tokens, components and usable screens. E1 identifies the existing design references and gaps. Proposed flows must cover loading, empty, success, validation, pending, expired, revoked, denied and recoverable failure states, keyboard behavior and responsive layouts. A new visual direction is not authorized by this pack.

## Acceptance boundary
The draft criteria in `APBM_ACCEPTANCE_SPEC_DRAFT.md` are planning targets. Freeze after E1 and the listed decisions. Staging verifies deployed artifacts separately; module Gate Q is not Gate D. Final 007A limitations are inherited with exact provenance and individually dispositioned, never called resolved by this draft.
