# QAM_TEST_PLAN — `ABM007_FINAL`

**Owner:** QA Executor drafts; QA Lead amends and approves · **Written:** Q1, then the approval checkpoint · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

The plan is drafted independently from the contract, `QAM_RISK_REQUIREMENTS.md`, the source, the recon and the Engineer's claims. Expected results come from the contract and the design file, never from the app's own helpers or the Engineer's numbers. The plan's SHA-256 is recorded in `QAM_APPROVAL.md`, not here.

## 1. Mission and scope

One paragraph: what this QA engagement certifies and what it does not. NOT RECORDED.

## 2. Contract and sources of truth

Contract identity, rulings in force, governing bodies used. NOT RECORDED.

## 3. Out of scope

Must include: the Gate D rows (AC-E02, AC-E03 deployment record, AC-E04, AC-D01, AC-D02) and every deferred item in `../CONTRACTS/BACKLOG_DISPOSITIONS.md` section 7. NOT RECORDED.

## 4. Environment and candidate

Candidate pair, QA HEADs, target identities, build commands, ports. NOT RECORDED.

## 5. Traceability: one row per Gate Q criterion

Every criterion gets at least one test, or an applicability ruling that names who authorized it. "Not applicable" is never used for missing fixture data.

| AC | Test ID(s) | Type (source, unit, browser, journey, human) | Expected result and where it was derived from | Negative control or negative path | Evidence to be saved | Depends on |
|---|---|---|---|---|---|---|
| NOT RECORDED | | | | | | |

## 6. Coverage matrix (browser)

Role by route or workflow by data state by viewport by theme condition by engine. Viewports: 375, 768, 1024 and 1440, plus the widths either side of each app's navigation breakpoint. Reductions are listed with reasons.

| Screen or journey | Roles | Data states | Viewports | Engines | Reduction and reason |
|---|---|---|---|---|---|
| NOT RECORDED | | | | | |

## 7. Regression suite

Named suites and journeys, per repository; what evidence is carried forward from APBM-007B, with its original candidate and why it still applies. Stale `/demo` specs are not counted; each retired spec is checked against the Engineer's feature-retirement evidence. NOT RECORDED.

## 8. Mock mode

If mock mode ships, the tests that cover it and the boundary between mock and live data. NOT RECORDED.

## 9. Effects budget (one complete proposal)

| Effect | Count planned | Why each is necessary | Ceiling asked |
|---|---|---|---|
| Sign-ins, invitations, emails | NOT RECORDED | | |
| Business writes on SCRATCH | NOT RECORDED | | |
| Paid sandbox operations, including automatic retries | NOT RECORDED | Each purchase is justified; the proposed USD 400 is a maximum, not a target | |

Paid tests are listed separately and marked "waits for the isolation proof or the Director's authorization".

## 10. Order of execution

Risk and dependency order. Nonpayment work first where it is independent. NOT RECORDED.

## 11. Human checks

Declared in advance, grouped into one session near the end, one check at a time, each with the exact question the Director answers. NOT RECORDED.

## 12. Exploratory probes

Only the seams this change touches: theme persistence, first paint, navigation breakpoint, browser storage, focus order. NOT RECORDED.

## 13. Stop conditions

The `STOP-*` set in `QAM_ENTRY.md`, plus any plan-specific trigger. A product failure is a finding, not a stop.

## 14. Known gaps

Missing access, data, environment, credentials or decisions, each with an owner. NOT RECORDED.

## 15. Exit criteria

What a complete Q2 return contains. NOT RECORDED.

## 16. Amendment log (exact edits from the QA Lead only)

| Date | Edit, verbatim | Source in `QAM_APPROVAL.md` | Applied by |
|---|---|---|---|
| none | | | |
