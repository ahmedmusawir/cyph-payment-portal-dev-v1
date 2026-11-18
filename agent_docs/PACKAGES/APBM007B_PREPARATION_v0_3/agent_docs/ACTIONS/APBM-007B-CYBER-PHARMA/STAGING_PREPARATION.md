# Combined staging preparation

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

Preparation can run alongside engineering; mutating shared configuration and deployment require their declared release. No deployment before completed 007B under the standing ruling.

## Inventory before release
- Both exact integrated SHAs, artifacts/digests, migration compatibility and named deployment owner.
- Correct Cloud Run project/region/service for each app; inspect old deploy scripts without executing them. Identify whether existing FFM service is retained, reused or replaced by explicit decision.
- DNS/HTTPS for the two agreed subdomains; distinct app cookie names, exact handoff/return origins and allowed paths.
- Auth Site URL decision and exact confirm redirects/template branches; preserve confirmation-button handling. Decide shared-project access-token lifetime and record existing-token/Mission Control effects.
- Permanent sandbox Stripe endpoint, matching signing secret and event/API version; no dependency on Tony's local listener. Define routing/namespace ownership so local/staging cannot process each other's operations incorrectly.
- Reminder/invitation/sign-in delivery settings; controlled recipients for Gate D, approved public copy and support/Terms/Privacy destinations.
- Prior known revision, rollback action, database forward/backward compatibility and retained records.

## Separate Gate D scope
Verify real deployed anonymous first-store purchase → signed webhook → provisioning → actual inbox → correct store; both-direction handoff; paid additional store; failed additional payment preserving existing stores; admin/member invite and authority denial; relevant removal/transfer/recovery operations; reminder processing and required lifecycle checks. Add actual role/session/cold-start/error/regression checks based on changed risk. Validate required payment/email paths on deployed origins, not a localhost proof substituted for staging.

Friday determines the candidate-specific deployment test plan and justified reuse of final-candidate lifecycle evidence. Identify both deployed revisions before results. No production keys, real claims or unsupported claims of whole-program completion.

## Friday Gate D minimum
Run the first-store purchase and Add Store journeys once on the actual deployed pair under a separately scoped effect allowance. Verify real endpoint/signing-secret configuration, email links on staging hosts and both-direction handoff on staging domains. This deployed check is outside product Gate Q; preserve exact revision/evidence identity and do not spend local QA's one-time budget implicitly.
