# 007B draft AC evidence map

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

Draft traceability only. Each status is NOT RUN; no independent test method is pre-approved. Q1 replaces the proposed evidence column with exact independently derived tests, expected outcomes and controls after the contract freezes. Keep actual results and evidence paths empty until executed.

| Draft AC | Risk area | Proposed evidence level | Status | Actual evidence |
|---|---|---|---|---|
| AC-001 | Owner boundary | Real application/API and tenant-negative proof | NOT RUN | None |
| AC-002 | Store identity | Database-backed concurrency and UI validation | NOT RUN | None |
| AC-003 | Charge disclosure and consent | Server/UI tests plus actual sandbox invoice comparison | NOT RUN | None |
| AC-004 | Paid activation | Signed event/live sandbox and authorization negatives | NOT RUN | None |
| AC-005 | Failed additional payment | Actual sandbox failure plus API/DB/UI checks | NOT RUN | None |
| AC-006 | Idempotent retry | Controlled fault/concurrency tests plus owned event receipts | NOT RUN | None |
| AC-007 | Pending recovery | Fault injection, restart and recovery evidence | NOT RUN | None |
| AC-008 | Quantity consistency | Provider/local comparisons and race tests | NOT RUN | None |
| AC-009 | Catalogue preservation | Catalogue identity, invoice and billing regression | NOT RUN | None |
| AC-010 | Authorized invitation | API/DB denial and successful intended role journey | NOT RUN | None |
| AC-011 | Invitation acceptance | Actual email/inbox and browser proof for both identity cases | NOT RUN | None |
| AC-012 | Invitation abuse | Token and browser negative coverage | NOT RUN | None |
| AC-013 | Resend and revoke | Delivery counters and link-state tests | NOT RUN | None |
| AC-014 | Admin replacement | Database concurrency and two-identity browser journey | NOT RUN | None |
| AC-015 | Member revocation | Fresh and existing-session tests plus direct API checks | NOT RUN | None |
| AC-016 | Last-admin protection | Concurrency, denial and recovery proof | NOT RUN | None |
| AC-017 | Tenant and role isolation | Independent role-by-route/API/DB matrix | NOT RUN | None |
| AC-018 | Scheduled removal | Controlled time/event and provider/local evidence | NOT RUN | None |
| AC-019 | Removal undo | Boundary and concurrency tests | NOT RUN | None |
| AC-020 | Last-store lifecycle | Whole-account lifecycle proof | NOT RUN | None |
| AC-021 | Support transfer authority | Authorized operator flow and denial controls | NOT RUN | None |
| AC-022 | Transfer billing and access | Two-account end-to-end transition and recovery | NOT RUN | None |
| AC-023 | History and receivables | Synthetic before/after access and data assertions | NOT RUN | None |
| AC-024 | Owner/admin recovery audit | Controlled recovery and audit proof | NOT RUN | None |
| AC-025 | O-1 live lifecycle | Live test-clock/provider delivery plus application access proof | NOT RUN | None |
| AC-026 | O-2 email delivery | Provider receipt plus actual inbox observation | NOT RUN | None |
| AC-027 | Reminder reliability | Controlled fault evidence, counters and inbox checks | NOT RUN | None |
| AC-028 | 007A regression | QA-controlled production-build browser and necessary live regression | NOT RUN | None |
| AC-029 | Migration preservation | Catalogue/checksum/preservation and forward-resume evidence | NOT RUN | None |
| AC-030 | Usable UI and copy | Rendered assertions and selected sanitized screenshots | NOT RUN | None |
| AC-031 | Handoff and security hygiene | Bundle/export scans with controls and explicit retention record | NOT RUN | None |
| AC-032 | Combined staging Gate D | Separate deployed revision-bound verification | NOT RUN | None |

## v0.2 additional coverage bindings
AC-004/006: signed payment event, pending-store denial, changed-key retry and timeout. AC-012: GET/POST and deliberate wrong-user switch. AC-015: app/data-layer removal with measured direct-token residual. AC-021–024: explicit operation classification and approved buyer historical-claims denial. AC-025: live multi-store clock/grace and production seam exclusion. AC-026/027: inbox proof under the D-05 ruling and guarded, counted retries. AC-029: fresh/upgrade rehearsal and two-account privileges on every new table/function. AC-030: final-rendered-and-stored-state happy paths. AC-031: poison/clean controls. See parent draft ACs for full revised wording; every result remains NOT RUN.
