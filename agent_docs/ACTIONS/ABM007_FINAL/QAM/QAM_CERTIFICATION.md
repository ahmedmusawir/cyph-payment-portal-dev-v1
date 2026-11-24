# QAM_CERTIFICATION — `ABM007_FINAL`

**Owner:** QA Lead only · **Written:** after adjudication; section 5 after cleanup; section 6 after Gate D · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

Three separate claims are recorded here and never merged: the Gate Q verdict on the tested pair, cleanup acceptance, and the Gate D record on the deployed services. A Gate Q PASS does not close the module. A deployment does not close the module.

## 1. Gate Q verdict

| Field | Value |
|---|---|
| Verdict: PASS, PASS WITH FOLLOW-UP FINDINGS, PASS WITH KNOWN RISK, FAIL, or BLOCKED | NOT ISSUED |
| Date | |
| Candidate pair certified (full SHAs) and QA branch | |
| Contract identity | |
| Plan identity and approval reference | |
| Packages adjudicated: filename and SHA-256 | |
| Scope certified: the criteria marked B | |
| Scope **not** certified: the D rows; every deferred item in `../CONTRACTS/BACKLOG_DISPOSITIONS.md` section 7; forced payment exceptions and exactly-once on the later repair paths | |

## 2. Gate Q required checks (QA Lead ticks each from evidence)

| Group | Check | Met? Evidence |
|---|---|---|
| Scope and contract | Every B criterion traced to evidence; protected paths respected; no undocumented scope | |
| Ground truth | Runner, paths, routes and environment names verified from disk; the Engineer's report treated as claims | |
| Automated | Both unit suites, typecheck and production build pass on the pair; no retry added to get green; pre-existing failures separated with evidence | |
| Manual acceptance | Each human check exercised; browser persistence and loading, error and recovery states checked | |
| Security and data | Role limits and negative paths tested; no secret in bundles or evidence | |
| UI and accessibility | 375, 768 and 1024 behavior verified; shell stable; states verified; keyboard-critical path checked; no overlay blocks navigation | |
| Deployment readiness | Approved commits identified; required setting changes documented; no migration; order documented; rollback path documented; `GATE_D_PLAN.md` exists and is approved | |

## 3. Known risks and follow-up findings

Each with owner and destination. Risk acceptance is the Director's, recorded with its reference. NOT RECORDED.

## 4. Independence statement

The QA Lead seat authored this module's contract (D-15). Safeguards relied on: the Architect's review, a different seat executing QA, independently derived expected results, the Director's risk decisions. NOT RECORDED until issued.

## 5. Cleanup acceptance

Reference to `QAM_CLEANUP_REPORT.md` section 4. NOT RECORDED.

## 6. Gate D record

Reference to `GATE_D_PLAN.md` section 5. NOT RECORDED.

## 7. Release to closeout

Requires: accepted Gate Q verdict, accepted cleanup, durable records committed by the Director, clean trees, and the Gate D rows recorded. NOT RECORDED.

## Amendment 01 checks (QA Lead, before any verdict)

| Check | Met? Evidence |
|---|---|
| Every selected human check has a result; none is PENDING. Any BLOCKED check has the Director's written disposition | |
| Automated and human findings were adjudicated together; one repair work order; affected retests and required regression done on the final candidate | |
| No fixture-session evidence is counted as proof of real sign-in, email delivery or handoff | |
| The keep-list was approved before cleanup | |
| Deployment-only checks are named and left to Gate D | |
