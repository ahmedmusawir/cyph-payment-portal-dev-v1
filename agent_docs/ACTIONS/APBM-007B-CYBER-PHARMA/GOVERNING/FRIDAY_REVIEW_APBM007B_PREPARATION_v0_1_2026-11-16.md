# Friday review — APBM-007B preparation pack v0.1

Date: 16 November 2026, Asia/Dhaka. Reviewer: Friday. Author reviewed: the Architect (JARVIS). Requested by the Director.

## Reviewed package

| Item | Value |
|---|---|
| File | `APBM-007B-CYBER-PHARMA_PREPARATION_v0_1.zip` |
| SHA-256 | `db17bc29ca5ee010e65c7c5902807d9b655006dd704fd712ab09afbae11ebaa2` |
| Members | 59 files; 58 indexed in `FILE_INDEX.json` plus the index itself |
| Integrity | All 58 indexed sizes and hashes match. No unindexed member. |
| Scope read | Every authored file in full. `GOVERNING/` snapshots checked by hash: QAM, RRM, handoff and process reset are byte-identical to the copies I hold. |

## Verdict

**ACCEPT WITH EXACT AMENDMENTS — accepted as recon preparation.**

This is a preparation review. It is not an E1 or E2 release, not Q1 approval and not a certification of anything. The 007A baseline stays pending and the active 007A QA ownership boundary is preserved by the pack as written.

## What is right and stays

- Full 007B scope is retained: Add Store, invitations and admin changes, removal, support-assisted transfer and recovery, O-1 and O-2.
- Nothing is prefilled. Every QA record is marked unfilled; no result, approval or certificate is implied.
- Baseline is pending, not guessed. Migration number 0061 is treated as an expectation only.
- Branch and execution lifecycle match the playbooks: continuing QA branch, one active writer, continuous Q2, conditional repair.
- Existing-store access is isolated from a failed additional-store payment (AC-005, design questions).
- Admin replacement is specified as one atomic transition with no billing rights attached (AC-014, AC-017).
- History access and seller receivables are kept as separate questions (AC-023).
- Evidence levels are kept distinct, and Gate D is separate from Gate Q.
- The recon mission does not touch the active 007A checkouts.

## Amendments

Format: ID; affected file; concern; exact change; blocking stage; owner.

### Must be applied before E1 is released

**FR-01 — Settled business rules are listed as open and gated on Frank.**
- Files: `DECISION_REGISTER.md` (opening sentence and rows D-01, D-03, D-04, D-06); `READINESS_CHECKLIST.md` ("D-01–D-06 decisions resolved"); `DIRECTOR_SUMMARY.md` ("with the named business owners where needed").
- Concern: the register says "Every row is OPEN" and names Frank as a decision owner. The decisions record of 11 November settles these in rows 5.6, 5.10, 5.11 and 5.12, and Coach's instruction was to build from that thread. The Director confirmed on 16 November that no Frank or Coach question gates 007B; a later change of mind is a change request.
- Exact change:
  1. Replace "Every row is OPEN" with: "Each row separates SETTLED rules, cited to the decisions record, from REMAINING choices. Remaining choices are technical mechanisms or Director defaults. No row waits on Frank or Coach."
  2. D-01: mark SETTLED (record 5.10) — disclose charge, owner consent, charge the rest of the current period, activate after confirmed payment, failed payment leaves the new store pending and existing stores working. REMAINING, owner Architect from E1 evidence, Director approves: quote freshness and expiry, payment-authentication handling, pending-operation expiry, retry behaviour.
  3. D-03: mark SETTLED (record 5.11) — removal at end of paid period, charge stops, records kept. REMAINING, owner Director on the Architect's proposal: undo before period end; last store routed through whole-account cancellation.
  4. D-04: mark SETTLED (record 5.12, 6.4) — support-assisted, buyer uses own account and billing, records kept. REMAINING, owner Director: implemented-versus-procedure boundary (see FR-05) and the buyer-history default (record 9.1 suggests a clean slate).
  5. D-06: mark SETTLED — seven-day grace carried as provisional (record 5.6), sandbox APA fixture stays labelled. Remove "Confirm any new business reply" as a dependency.
  6. Remove Frank, Coach and Heather from the "Decision owner" column on D-01, D-03, D-04 and D-06. They may be listed as "informed".
  7. `READINESS_CHECKLIST.md`: replace the D-01–D-06 line with "Remaining technical and Director-default choices in D-01–D-05 recorded; settled rules cited."
  8. `DIRECTOR_SUMMARY.md`: replace the "named business owners" bullet with "Tony rules the short list of Director defaults in one pass."
- Owner: Architect.

**FR-02 — The QA Lead's early requirements are not in the pack.**
- Files: `SOURCE_REGISTER.md`; `GOVERNING/`; `QAM/QAM_RISK_REQUIREMENTS.md`; `QAM/QAM_PREFLIGHT.md`; `QAM/QAM_ENTRY.md`; `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`.
- Concern: `QAM_RISK_REQUIREMENTS.md` says its content is "not Friday-approved". The QA Lead issued `QA_LEAD_REQUIREMENTS_APBM007B_2026-11-16.md` (SHA-256 `8448a9b3cb1e1e07ab9e7949ae8d15b059deb9b80e15f32f3e1f2e6f570a4a77`) under QAM §7. The pack predates it.
- Exact change:
  1. Add that file unchanged to `GOVERNING/` and to `SOURCE_REGISTER.md` with its hash.
  2. `QAM_RISK_REQUIREMENTS.md`: add a section "QA Lead standing requirements" that incorporates the note by reference, and keep the Architect's table as "Architect risk input".
  3. `QAM_PREFLIGHT.md`: add a first row — "Basics: both apps serving a production build made from the candidate commit (build ID compared); Stripe listener running with the matching secret present; inbox file readable. Owner: Executor. A missing basic is reported to the Director at once, before other work." Keep the existing "aggregate blockers" sentence for everything else.
  4. `QAM_ENTRY.md`: add — "Journeys that consume one-time budget (new identities, payments, emails) run on the final repaired candidate."
  5. `ENGINEERING_HANDOFF.md` required fields: change "production-browser journeys" to "one production-build happy-path walk per new journey, asserting the final rendered page and stored state".
- Owner: Architect.

**FR-03 — The newest 007A finding and both adjudications are missing.**
- Files: `SOURCE_REGISTER.md`; `APBM_ACCEPTANCE_SPEC_DRAFT.md` AC-006; `DECISION_REGISTER.md` D-09.
- Concern: the pack rests on the handoff, which predates the Q4 a02 interim adjudication. F-Q4-001 (a retry with a new key creates a second customer and Checkout session, and the first operation is closed as unpaid without provider proof) is the same failure class Add Store must not repeat.
- Exact change:
  1. Add `QA_LEAD_ADJUDICATION_Q2_a01_2026-11-16.md` and `QA_LEAD_ADJUDICATION_Q4_a02_2026-11-16.md` (project path `LABS/APBM-007/`) to `GOVERNING/` and the source register.
  2. AC-006, append: "A retry with a new key and a network timeout reconcile to one operation, one customer and one payment session. No operation is closed as unpaid without proof from the provider."
  3. D-09, append to the residual list: "F-Q4-001: repaired in 007A, or carried by Director ruling as a numbered 007B criterion."
- Owner: Architect.

**FR-04 — Criteria the recon must be able to map are missing from the draft.**
- File: `APBM_ACCEPTANCE_SPEC_DRAFT.md`.
- Exact change, appended to the named rows:
  1. AC-005: "A pending store grants no access and exposes no data."
  2. AC-012: "Opening the emailed link (GET) does not accept the invitation; only the explicit action (POST) does."
  3. AC-025: "Proved on an account with more than one store. The time-control seam is unreachable in a production configuration, shown by a negative test."
  4. AC-027: "The mail guard is validated before the first send; every dispatch attempt is counted."
  5. AC-028: add "webhook recovery behaviours from 007A (unfinished work stays retryable; operator recovery)" to the regression list.
- Owner: Architect.

### To be applied when the pack is frozen after E1

**FR-05 — "Implemented" versus "support procedure" must be explicit per criterion.**
- Files: `APBM_ACCEPTANCE_SPEC_DRAFT.md` AC-021 to AC-024 and "Freeze completion".
- Concern: these rows read as implemented features ("authorized operator flow"), while D-04 proposes a minimal audited operation plus a runbook. QA cannot grade a runbook as a feature PASS.
- Exact change: add a column or tag on AC-021 to AC-024 with one of IMPLEMENTED (CUSTOMER UI), IMPLEMENTED (OPERATOR COMMAND) or SUPPORT PROCEDURE. A procedure is reviewed as a document and reported as such on the certificate. Add this to "Freeze completion".
- Owner: Architect, on the Director's choice in decision 2 below.

**FR-06 — Gate D and QA process duties are numbered as product criteria.**
- Files: `APBM_ACCEPTANCE_SPEC_DRAFT.md` AC-031, AC-032; `QAM/AC_EVIDENCE_MATRIX.md`.
- Exact change: mark AC-032 "Gate D only — outside the Gate Q set" in both files, or move it to `STAGING_PREPARATION.md` as GD-001. Split AC-031: keep "no secrets in built bundles" as a product criterion; move export indexing, evidence retention and cleanup to `QAM/QAM_PACKAGING.md` as process duties.
- Owner: Architect.

**FR-07 — The QAM skeleton was not instantiated from the Hub template set.**
- Files: `QAM/`; `APBM_SKILLS_MANIFEST.md` ("Hub QAM template set: Not supplied").
- Concern: QAM §5 requires instantiating `03_BUILD_METHODOLOGY/_templates/QAM/`. That set is in the project doc set. The skeleton lacks at least `QAM/README.md`, `QAM/HANDOFFS/README.md` and `QAM/HANDOFFS/FILE_INDEX.template.json`.
- Exact change: reconcile `QAM/` against the template set, add the missing files, and correct the skills manifest row to "available in the project doc set".
- Owner: Architect.

**FR-08 — Recon snapshot method.**
- File: `E1_RECON_MISSION.md`, "Protect active 007A".
- Concern: "source commit plus any dirty-file manifest" invites recon on uncommitted repair work.
- Exact change: replace with "The Director exports a named commit of each repository into an external directory. Committed state only. No dirty files." Recommended commit: the one that lands the F-Q4-001 repair, because that repair touches the checkout code Add Store builds on. An earlier commit is acceptable under the existing final-baseline refresh rule.
- Owner: Architect; Director performs the export.

**FR-09 — Wording.**
- File: `DIRECTOR_SUMMARY.md`, "Schedule honesty".
- Concern: "The earlier 6–9-day figure was an unverified planning allowance … Its component ranges actually sum to 6–9 days" contradicts itself.
- Exact change: replace both sentences with "Earlier day counts were planning allowances, not recon estimates."
- Owner: Architect.

## Decisions for the Director, in one pass

None of these waits on anyone outside the team.

| # | Decision | Reviewer's recommendation |
|---|---|---|
| 1 | Seats for 007B: who engineers, who executes QA. | Same as 007A: the current Engineer builds, the current QA Executor tests, Friday as QA Lead. |
| 2 | Store sale, ownership transfer and owner recovery on staging: customer screens, or an audited operator command plus a written support procedure. | Operator command plus procedure. It matches how 007A handles owner recovery and it is the largest saving available against the 23rd. Stated openly on the certificate. |
| 3 | Does a buyer see a sold store's past claim history. | No. Clean slate, as the decisions record suggests, until Frank and Coach say otherwise. |
| 4 | Accept the Architect's defaults: undo a removal before the period ends; removing the last store goes through whole-account cancellation; the current admin stays until the replacement accepts; one reminder at failure and one before read-only. | Accept all four. |
| 5 | Recon now on an exported commit, or after 007A merges. | Now, on the commit that lands the F-Q4-001 repair. Refresh only what changes at merge. |

F-Q4-001 itself (repair in 007A or carry into 007B) belongs to the 007A lab and is not decided here.

## Readiness implications

- With FR-01 to FR-04 applied and decision 5 made, E1 can be released by the Director.
- E2 still needs: the final 007A certificate, cleanup, closeout and merge receipts; the E1 report; decisions 1 to 4; FR-05 to FR-09; the frozen pack.
- The review found nothing that requires restructuring the pack.
