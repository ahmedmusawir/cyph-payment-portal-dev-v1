# BACKLOG_DISPOSITIONS — ABM007_FINAL

**Version:** 1.1-review (Architect amendment A-05 and the scope recommendations applied) · **Date:** 23 November 2026. Every known open item, with one explicit disposition and its source. Nothing is dropped silently and nothing deferred is counted as passed.

Dispositions: **IN** (built or fixed in this module), **VERIFY** (bounded check, repair only if demonstrated), **DEFER** (carried forward openly, with where it goes), **SEPARATE** (belongs to a different process), **DONE** (already resolved; evidence named).

"Decided" means a Director decision exists. "PROPOSED" means the Director rules at pack review. The Architect recommends the proposed dispositions in this file (review 01); a recommendation is not a ruling. When the Director rules, each row is marked with him as the approver and the date.

**What "Gate D" means in this file.** This module has its own short Gate D: the alpha checks in `QAM/GATE_D_PLAN.md` (deployment read-back, branded email delivery, Stripe previews, the Director's ride). A deferred item marked for a *later* gate is **not** part of that session and is not closed by this module's Gate Q, deployment or Gate D. Section 7 names the owner and destination of every deferred item.

## 1. Finalization backlog from the Architect handoff (section 12)

| ID | Item | Disposition | Standing | Notes and evidence |
|---|---|---|---|---|
| FINAL-01 | "No permitted stores" shown beside selectable pharmacies | **IN** — targeted fix | PROPOSED (P-10) | Observed in the 21 to 22 Nov rehearsal. No root cause established. AC-F01 |
| FINAL-02 | Store admin unexpectedly reached Portal sign-in once | **VERIFY** — bounded reproduction | PROPOSED (P-11) | One observation, then a passing boundary retest. Both stay on record. AC-F02. Related to KR-2 |
| FINAL-03 | Help page in OwedBook | **IN** | Decided (D-08) | Does not exist in either repository (recon 9.2). AC-H group |
| FINAL-04 | Frank's branding across both apps | **IN** | Decided (D-01 to D-07, D-10) | AC-B, L, N groups |
| FINAL-05 | Coach's internal testing feedback | **Not received** | Decided (D-09): not a prerequisite | When it arrives it is recorded with source and date and classified with the Director. It does not enter this module's frozen scope without a ruling |
| FINAL-06 | Known risks from the APBM-007B certificate | See section 2 | | |
| FINAL-07 | Forced payment exceptions and exactly-once on later repair paths | **DEFER** (section 7, row 1) | PROPOSED (P-12) | Certified on real provider events at the 18 Nov pair for that candidate. The later repair R3 changed the saved-card lookup; unit tests and three ordinary paid purchases in the rehearsal cover the normal path only. In this module: AC-R03 proves payment code untouched; AC-R04(d) runs one ordinary paid addition. Forced challenge, decline, reload and cancel stay unverified on the current candidate |
| FINAL-08 | Scheduler-dependent expiry, real cutoff, notices | **DEFER** (section 7, row 2) | PROPOSED (P-13) | No scheduler enabled at deployment; no later receipt. Schedule-and-undo is different coverage |
| FINAL-09 | Support-led transfer; populated-claims isolation | **DEFER** | PROPOSED (P-14) | Needs an approved procedure and a synthetic dataset. KR-3 relates |
| FINAL-10 | APA member code | **DEFER** | PROPOSED (P-15) | Needs amount, eligibility, duration and coverage from Coach and Frank. Field stays; blank in the standard route |
| FINAL-11 | Terms, Privacy, support publication | **SEPARATE** — production readiness | Decided (D-12) | Footer keeps "(link not yet published)". If approved links are supplied before the build ends, they go in as configuration, not as a gate |
| FINAL-12 | zod advisory exception | **DEFER** to production readiness | PROPOSED | Recon: required before production, not triggered by a visual change. No dependency changes in this module |
| FINAL-13 | Tester guide and release-document alignment | **IN** for the change list (AC-P01); guide refresh **SEPARATE** | PROPOSED | The v3 guide's fresh-chat rehearsal is still pending and is not part of this module |
| FINAL-14 | Older usability backlog: UTC-only deadline in notices; old decision-9 operator wording; demo-mode invite typing-before-load; individual operator sign-in | **DEFER** all four | PROPOSED (P-17) | Not customer-visible in this release, except the UTC wording, which is a mail-content behavior change |

## 2. Known risks from the APBM-007B Gate Q certificate (18 Nov 2026)

Text of each risk is in the project document `LABS/APBM-007/QAM_CERTIFICATION_APBM-007B_2026-11-18.md`. The Director accepted them on 18 Nov. Acceptance is not repair.

| ID | Risk (short form) | Disposition | Notes |
|---|---|---|---|
| KR-1 | Add Store on WebKit slow enough to fail a 30-second test limit about one run in five; payment and activation succeeded every time | **VERIFY** inside AC-R04(d) and AC-B06 | The restyle must keep visible progress while the owner waits. QA records the confirm time it observes; no time target is set by this module |
| KR-2 | One unexplained sign-in redirect on WebKit | **VERIFY** with FINAL-02 | Same bounded reproduction |
| KR-3 | Live transfer-buyer payment and first-store purchase not repeated on the certified pair | **DEFER** with FINAL-09 | First-store registration to the Checkout handoff is exercised in AC-R04(c) |
| KR-4 | 90-minute end-of-period guard not isolated live | **DEFER** (section 7, row 2) | Proven in database checks at that candidate |
| KR-5 | Discounted-account case used a sandbox promotion granted to the fixture | **DEFER** with FINAL-10 | |
| KR-6 | Local listener missed one of ten paid events on first delivery | **DEFER** (section 7, row 1) | Provider retry on the permanent endpoint is a deployed-system check |

## 3. Manual-QA repairs and their retest state

The repository ledgers still mark R1 to R10 and F1 to F6 "pending retest" (recon 9.1). Those ledgers are stale for the scope the Director's 21 to 22 November rehearsal covered: 14 of the original 15 customer sequences passed within the recorded client scope, one operator-only sequence was deferred. That closeout supersedes the "pending" rows for what it actually observed and nothing more.

| Item | Disposition | Notes |
|---|---|---|
| R1 to R10, F1 to F5 behaviors | **VERIFY** once, on the new look (P-21) | Covered where they overlap AC-R04 and the brand contract section 5. They are not run twice |
| Audit "Load older" paging | **VERIFY** in AC-R04(i) | Q1 plans a bounded synthetic fixture on SCRATCH with enough audit history to need a second page, inside the approved effects envelope. If it cannot be built, the row is BLOCKED and goes to the QA Lead and the Director for a specific disposition. A fixture with too little history is not "not applicable" and is not coverage |
| Reconciling the stale repository ledgers with the rehearsal closeout | **IN** as a records task for the Engineer | Docs only. Append dated entries; do not rewrite history |
| F6 (auth changes excluded) | Stays excluded | No OAuth, editing or onboarding rewrite |

## 4. New findings from the Engineer's recon (section 9.3)

| ID | Finding | Disposition | Where handled |
|---|---|---|---|
| N-1 | Portal buttons uppercase and semibold | **IN** | Brand contract 4.1, 4.2 |
| N-2 | Portal link ruling R-004 conflicts with green links | **IN** — superseded | Brand contract 4.3; AC-B07 |
| N-3 | OwedBook status colors fail text contrast today | **IN** | Brand contract 3.4 (P-02) |
| N-4 | Brand green and success green nearly identical in lightness | **IN** — handled by recipe, shown on the tile | Brand contract 3.4 |
| N-5 | App token `--accent` is not the design's accent | **IN** | Brand contract 2 |
| N-6 | OwedBook KPI tiles are solid color blocks | **IN** (P-03) | Brand contract 4.6 |
| N-7 | Portal defaults to dark | **IN** | AC-B04 |
| N-8 | Page surface undefined by the design | **IN** (P-01) | Brand contract 3.1 |
| N-9 | Navy focus ring invisible on navy | **IN** | `--ring-on-dark` |
| N-10 | OwedBook landing page: dead anchors, stale screenshot, old name | **IN**, minimal (P-08) | AC-F03 |
| N-11 | Stripe names and notice sender still "Cyber Pharma" | **IN** for notices and Stripe names (P-06, P-07); statement descriptor **DEFER** (P-05) | Email and Stripe contract |
| N-12 | "a Cyber Pharma product" footer and page titles | **IN** (P-22) | AC-N01 |
| N-13 | Radius scale mismatch; no shadow tokens | **IN** | Brand contract 3.6, 3.7 |

## 5. Test estate

| Item | Disposition | Notes |
|---|---|---|
| 16 Portal browser specs targeting removed `/demo` routes | Mapping table **IN**; retire those with no current route (P-09) | Retirement does not close the gap; AC-R04 and the QA automation lane do |
| Three live Portal specs and one OwedBook spec needing a private fixture file | Left as they are | QA decides in Q1 whether they are usable instruments |
| Tests that assert presentation (recon 8.4) | **IN** — updated with the restyle | Assertions are updated to the new contract, never weakened to pass |
| No visual-comparison tooling in either repository | Accepted | Visual acceptance is rendered checks, measured contrast and human sign-off |

## 6. Repository reconciliation required before engineering

| Item | Action | Owner |
|---|---|---|
| Three OwedBook session-record changes reported in the recon tree | Confirm they are records only and decide whether the Director commits them before the build starts | Engineer reports; Director commits |
| Fewer local branches than the Director's earlier receipt | Read-only list of local and remote branches in both repositories against the earlier receipt; report differences. No assertion of deletion or preservation without proof | Engineer |
| Deployed alpha commits (`ef4cebc`, `6dd3de7`) versus the baselines | Full diff of each deployed commit to its baseline, to prove the difference is records only | Engineer |

## 7. Deferred items: owner and destination

Every DEFER above lands in one of two registers. Neither exists as a work order yet; the Architect opens them when the Director asks. Until then this table is the record.

- **Deployed-lifecycle verification work order** (proposed name `GATE_D_LIFECYCLE`): checks that need a deployed system with a scheduler or the permanent webhook endpoint. Separate authorization, separate plan, separate evidence.
- **Production readiness register:** things that must be true before real customers and real money.

| # | Deferred item | Owner of the next step | Destination | What this module does instead |
|---|---|---|---|---|
| 1 | Forced payment exceptions and exactly-once on the later repair paths (FINAL-07); provider retry after a missed event (KR-6) | Architect drafts; Director authorizes | Deployed-lifecycle verification work order | Proves by diff that payment code is untouched (AC-R03); one ordinary paid addition (AC-R04 d). The later-candidate exception paths are **not certified** |
| 2 | Scheduler-driven expiry, real period-end cutoff, notices (FINAL-08); the 90-minute guard live (KR-4) | Architect drafts; Director authorizes enabling a scheduler | Deployed-lifecycle verification work order | Nothing. Schedule-and-undo is different coverage. No scheduler is added here |
| 3 | Support-led transfer; populated-claims isolation (FINAL-09); transfer-buyer payment (KR-3) | Architect, with an approved procedure and a synthetic dataset | Production readiness register | First-pharmacy registration to the Checkout handoff only (AC-R04 c) |
| 4 | APA member code (FINAL-10); discounted-account case (KR-5) | Director obtains terms from Coach and Frank | Production readiness register | Field stays, blank in the standard route |
| 5 | Stripe statement descriptor (P-05) | Director rules (D-03 requires his explicit ruling) | Production readiness register | Unchanged |
| 6 | Full password matrix (P-16) | QA Lead scopes it | Production readiness register | Password forms restyled; one password sign-in on a QA identity |
| 7 | zod advisory exception (FINAL-12) | Engineer proposes; Director rules | Production readiness register | No dependency change |
| 8 | Older usability items, four (FINAL-14, P-17) | Architect triages | Production readiness register | Nothing |
| 9 | Terms, Privacy and support publication (FINAL-11, D-12) | Director, with Coach and Frank | Production readiness register | Footer keeps "(link not yet published)" |
| 10 | Tester guide refresh (FINAL-13) | QA Lead, after the change list (AC-P01) | Follow-up document task | The change list |
| 11 | Stripe and email branding on the live account | Director | Production readiness register | Sandbox and DEV only |

## Glossary

- **FINAL-nn:** backlog items from the Architect handoff. **KR-n:** known risks in the 18 Nov certificate. **N-n:** new findings in the Engineer's recon. **R-n / F-n:** the manual-QA repair batches of 19 and 20 Nov.
- **Gate D:** a separately authorized check of a deployed system. This module's own Gate D is the short session in `QAM/GATE_D_PLAN.md`; later lifecycle and payment work has its own.
