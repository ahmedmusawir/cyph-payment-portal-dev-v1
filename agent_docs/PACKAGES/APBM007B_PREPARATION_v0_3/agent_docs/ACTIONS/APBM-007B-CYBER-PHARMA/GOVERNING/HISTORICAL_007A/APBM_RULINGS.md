# Frozen rulings — APBM007A v1.0

Final technical authority: Friday Review 3 supplied by Tony; JARVIS reconciliation. E1 is complete; no execution release follows automatically.

1. Candidate B selected; single STRIPE_PRICE_STORES; explicit portal configuration; both cancellation fields and same-subscription undo.
2. Atomic claim checks all bindings before consumption. FB-2 burning rule withdrawn.
3. FC-1 // rejection; FC-3 same-validated-token source binding; FC-2 individual-session failure cleanup, E2 proof required.
4. FC-4 confirm button for every emailed access link; scanner incident not established; both earlier clicks were Tony's.
5. Password sign-in preserved. Logins recovered by Tony; no seeded password reset authorized or needed.
6. RA-2 legacy billing fixtures are marked only by exact identified rows, environment-fenced; no general unlinked-row exemption.
7. RA-3 permissions change explicitly; no silent APBM003 assertion weakening.
8. RA-7 no CHECK on legacy businesses.npi, including NOT VALID; new-input server/UI and reservation/provisioning validation plus unique index. This supersedes earlier FB-6 table-CHECK wording.
9. Per-object REVOKE/catalogue assertion is in scope; changing default ACLs deferred (FB-15 narrowed).
10. Lifetime remains 3600 seconds; 900-second decision on staging checklist. Owner-approved global logout impact remains accepted.
11. APA covers whole invoice. Real amount/duration to Frank; labelled 10%-once sandbox fixture awaits Director E2 approval.
12. Renewal grace remains included. FC-6 deferral offered only as an explicit scope change before release.
13. Store-sale receivables stay with seller unless agreed otherwise; support transfer/history semantics remain 007B. No record deletion by NPI.
14. DEV apply, sample loading, QA and deployment keep their own release boundaries. One E2 capsule and one independent Q2 capsule; no approval per ordinary test.

Source amendments incorporated: FA-1..11; RA-1..7; FB-1,3..14,16; FC-1..7, with explicit supersessions above. Details and acceptance are in the frozen contracts and AC expansions. Historical record follows; earlier pending/NOT RELEASED E1 statements are historical only.

---
# Rulings and review proposals

The supplied decision record is authoritative for recorded Director/business decisions. Preserve its bytes. Current technical proposals are NOT approvals.

| ID | Disposition |
|---|---|
| R-01 | Adopt existing DEV, synthetic/public data only; do not create another project or reset DEV. |
| R-02 | Honor decision 3.4: DEV credential rotation deferred to production preparation. Record this accepted limitation; no new rotation gate. Never publish credentials. |
| R-03 | Separate apps/repos; single migration chain in OwedBook. Stripe credentials/server SDK stay in portal. FA-3: OB gains its first user-facing server-only service-key consumer for handoff redemption, changing APBM003's no-consumer position. D-01 approved by Director ruling R1; server-only import guard, exact-user binding and bundle check required. |
| R-04 | Same handoff locally/staging, distinct namespaced cookies/storage and explicit allowed origins. No parent-domain session cookie. |
| R-05 | Friday accepted: 007A owner is sole initial store admin; alternate admin and extra-store entry held for 007B with truthful copy. |
| R-06 | Friday accepts optional NCPDP with Tony D-03 now approved in R1. Preserve values/IDs and check unique-NPI conflicts before migration. |
| R-07 | Build seven-day renewal grace per Coach's instruction, explicitly provisional pending Frank. NPI sharing has now been answered: no sharing for this product. Add Store proration remains a 007B provisional rule. |
| R-08 | FA-7: ended cancellation uses a provisional versioned retained-read-only + billing/support default, same standing as instructed seven-day grace. Final Frank confirmation is not a freeze blocker. No automatic deletion/reactivation/second subscription. |
| R-09 | FA-6: APA uses a server-allowlisted valid Stripe promotion code; possession is eligibility unless Frank specifies otherwise. No membership-verification feature. Real amount/duration/additional-store treatment remain open; Tony may approve a labeled sandbox fixture at freeze. Unknown/expired/non-allowlisted codes rejected. |
| R-10 | FA-5: compare two-item first+additional prices with one graduated monthly price, quantity=store count. Prefer single-item if portal cancellation/undo, invoice clarity, proration and coupons pass. Env names follow selection. Raw Stripe quantity changes never bypass named-store operations. |
| R-11 | Pull the relevant privilege-hardening follow-up into 007A. Reserve/confirm 0053 after checking current chain; allocate actual names only at freeze. Historical migration files are not edited or replayed on DEV. |
| R-12 | Existing portal staging service remains untouched until joint release. Confirm how the new requested domain attaches to that service; an old deploy.sh is not current deployment authority. |
| R-13 | One scope-specific preflight return; aggregate missing prerequisites. Routine implementation/self-verification runs continuously within the released envelope, with declared DEV apply and QA ownership checkpoints. |

Append accepted amendments with authority, date, original wording, affected ACs/contracts and evidence impact. Do not overwrite frozen acceptance after seeing test outcomes. No exceptions from APBM003 automatically waive 007A acceptance.

| R-14 | FA-1/2: destination-initiated state/verifier authorization-code flow; mint provider session only in destination redemption memory. No persisted provider material/encryption key. Outstanding-email/handoff collision probe required. |
| R-15 | FA-4: simple provider-wide logout is the proposed default, with D-02 acknowledgement of Mission Control/all-device impact and residual direct-data access JWT lifetime approved in R1. Session-family/RLS fence is fallback only, with costed regression if a stated requirement needs it. |
| R-16 | FA-8: optional DEV synthetic sample loader scope approved under D-04 in R1; no automatic customer seed. |
| R-17 | FA-9/10/11: email prep starts before E1; two planned architecture reviews, one final grouped Director walk, separate E1 effort estimates; inherited 7–9 days for all 007 does not cover this scope. |


## Director R1 — effective 11 November 2026

D-01–D-04 are now APPROVED for synthetic DEV/staging, superseding any historical pending proposal wording above: first OB guarded handoff service-key path; simple provider-wide logout/MC/all-device impact and access-token residual; optional NCPDP; operator-only DEV sample-loader scope. Email provider/domain/proposed sender and final four-recipient cast are supplied. Full attribution/privacy handling is in DIRECTOR_RULINGS_2026-11-11.md and OPERATOR_INPUTS.md.

E1 and E2 are explicitly NOT RELEASED. No SMTP/redirect/JWT/DNS settings change, provider probe or DEV apply has occurred. E1_RELEASE_REQUEST.md is the requested bounded permission, not authority by itself. Production remains deferred.
