**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Review amendment implementation map

All entries mean authored into this exact review candidate, not independently approved/product-proven. Friday performs the required frozen-pack review once.

| ID | Implemented in this package |
|---|---|
| FR01–04 | Prior accepted prep sources retained; settled decisions, early requirements, original adjudications and exact negative coverage preserved |
| FR05 | AC021–024 tagged implemented operator command; support verification procedures separately graded; recovery UI distinguished |
| FR06 | GD001 outside Gate Q; AC031 bundle only, process duties in QAM_PACKAGING |
| FR07 | Actual supplied25-file template set adapted, provenance/hash map and missing files supplied; no nonexistent template claim |
| FR08 | Exact merged pair, source export provenance, no dirty product overlays |
| FR09 | Earlier day counts were planning allowances, not recon estimates. E1 forecast retained as conditional source, no deadline/scope-cut command |
| PE01 | Removal no credit/refund/proration, preview and next real invoice; AC018/lifecycle |
| PE02 | Director approved permanent identity plus ownership records; structural buyer-history denial and one active NPI concurrency |
| PE03 | CP2 exact guarded clock driver and standalone fallback, explicit failure stop, no choose-later |
| PE04 | AC028 touched navigation/billing/password controls |
| PE05 | Complete planned operation matrix incl decline/list/trusted/history; factual command/build-ID handoff requirements |
| PE06 | Actual template source received from Tony; snapshot and reconciliation map |
| PE07 | Approved shared staging identity limitation, audit separates auth/declared actor, production personal-signin prerequisite |
| PE08 | Portal single billing sender, verified domain through Resend API; Auth path retained separately |
| PE09 | AC003/O1 mid-period incremental invoice less than full price, quote equals actual; no third pre-E2 clock run |
| PE10 | Fixed consent deadline, durable expiry/void, late-payment attention, no silent activation; AC007 |
| PE11 | Exact94ID DEV read-only result0matches included and QA preflight scoped |

Duplicate equivalent AC006/012/025/027 sentences consolidated without weakening their outcomes. New separate-invoice architecture supersedes pending-update proposal because Director approved preserving APA discount. Earlier probe supports some components only; CP1 establishes selected path before its implementation. No claim that Friday has seen original evidence until this review.

## Manual QA repair round amendments — 20 November 2026 (Director-authorized; recorded by Claudy; contract files unchanged)

| ID | Contract text amended | Amendment |
|---|---|---|
| AM-MQ-01 | `CONTRACTS/IDENTITY_AND_MEMBERSHIP.md` ("Demote old admin to member unless removal selected … Owner remains platform member and retains owner rights even if store membership demoted. … Removal cannot delete effective admin") | The account owner is never removed from a store, by any caller (0071 `member_remove`). An admin invitation may not ask to remove an owner incumbent (0071 `invitation_create`). The owner row may still become `member` at delegation (unchanged acceptance), only while ownership stays authoritative. The UI shows Owner and never demotion. Ownership changes stay with the transfer/recovery procedures |
| AM-MQ-02 | `CONTRACTS/CLOCK_AND_NOTICES.md` §O-2 ("MAIL_ALLOWLIST … absent/empty means deny all … No wildcard/production bypass in E2; MAIL_GUARD=off is not authorized") | Adds `MAIL_RECIPIENT_POLICY=open`, honoured **only** when the app is bound to the DEV/alpha project `yrsuwikjnbmvpznrgydb`: any single syntactically valid recipient, plus aliases included. Default and every other project: exact allowlist. No wildcard; `MAIL_GUARD=off` is still ignored. Sender, attempts, spacing and idempotency are unchanged. Applies to both guarded adapters (OwedBook invitations, Portal notices) |
| AM-MQ-03 | `ALLOWED_PATHS.md` (OwedBook migrations 0061–0067) | Forward migration `0071_007b_owner_settings_audit.sql` is added under the Director's repair order ("forward migration only if required"). SCRATCH is applied; the DEV apply needs a separate release |
| AM-MQ-04 | `SCOPE.md` / D-10 copy | Signup and Portal copy no longer says adding stores or naming an admin is unavailable. Support address configured. Terms and Privacy shown as "(link not yet published)" until the Director supplies them. The pre-exposure legal blocker stands |
