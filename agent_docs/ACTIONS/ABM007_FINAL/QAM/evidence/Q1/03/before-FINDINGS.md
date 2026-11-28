# FINDINGS — `ABM007_FINAL`

**Owner:** QA Executor records and proposes; QA Lead dispositions; Architect and Director route repair · **Written:** Q2 onward · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

## 1. Register

| ID | Title | Severity (proposed) | Classification (proposed) | AC | QA Lead disposition | Route |
|---|---|---|---|---|---|---|
| ABM7F-F01 | Missing bundled Chromium at first readiness launch | Medium | instrument issue | readiness | PENDING | QA tooling |
| ABM7F-F02 | Shared-sandbox no-write isolation not established | High | environment / contract gap | R04 paid paths | PENDING | Director / Architect |

IDs: `ABM7F-Fnn`, never reused.

## 2. Required fields for every finding

Each finding gets its own section with all sixteen fields. A field that does not apply says so; it is not left out.

1. ID
2. Title
3. Module and candidate pair
4. Severity: Critical, High, Medium, Low (by impact, not by effort)
5. Classification: acceptance failure, regression, environment or setup issue, instrument issue, contract gap, proven pre-existing defect, follow-up finding, architecture enhancement, observation
6. Environment: repository, build, target, browser and version, viewport
7. Preconditions: role, fixture, data state
8. Exact reproduction, numbered steps
9. Expected result, and the contract clause it comes from
10. Actual result
11. Evidence paths
12. Suspected cause, only if labelled INFERENCE
13. Scope impact: inside this module, or outside it
14. Gate impact: blocks Gate Q, blocks Gate D, or neither
15. Owner
16. Retest requirement

## 3. Severity rules

- **Critical:** always blocks. Wrong access to another pharmacy's data, privilege escalation, broken payment, wrong price, destructive write.
- **High:** normally blocks. A security, privacy, money, tenant-isolation or data-integrity High blocks unless the Director accepts a tightly contained risk in writing.
- **Medium:** may ship only with impact understood, a workaround or containment, an owner and a scheduled follow-up.
- **Low:** may ship when documented.

## 4. Scope protection

A real defect found outside this module's criteria is recorded as a follow-up finding with its own owner. It does not fail a criterion it does not belong to, and it is never hidden. A pre-existing defect needs evidence that it exists at the baseline.

## 5. Dispositions (QA Lead only)

| Finding | Disposition | Date | Reason |
|---|---|---|---|
| none | | | |

## 6. Repair routing (only after Q2 is completely finished)

QA Lead disposition, then the Architect's bounded repair instruction, then the Engineer repairs the ruled paths on `qa/abm007-final`, then the Director commits, then the Executor re-pins and retests. Nobody retests before the commit.

| Finding | Repair instruction reference | Repair commit (Director) | Retest scope | Retest result |
|---|---|---|---|---|
| none | | | | |

## Amendment 01 additions

1. Every finding records one additional field, **Source**: automated, or Director walkthrough.
2. Findings from both sources are kept in this one register. A pass from one source does not close a failure from the other.
3. After adjudication there is one consolidated repair work order for the Engineer.

| Repair work order reference | Findings included | Issued by, date |
|---|---|---|
| none | | |

## ABM7F-F01

1. ID: ABM7F-F01
2. Title: Missing bundled Chromium
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: instrument issue.
6. Environment: local QA production copies; SCRATCH; Q1 source/readiness, no viewport claim.
7. Preconditions: authorized R-1/R-2 Q1; existing cast only.
8. Reproduction: (1) inspect cited command/source; (2) compare expected guard/readiness contract; no side-effect rerun.
9. Expected: Browser launch succeeds for selected instrument; first failure retained.
10. Actual: Initial launch failed before sign-in; installed Chrome diagnostic launch passed and four bounded sessions/signouts succeeded.
11. Evidence: evidence/Q1/02/session-first-failure.txt; session-probes.json.
12. Cause: no product cause inferred.
13. Scope: Q1 readiness; no product repair undertaken.
14. Gate impact: engine-specific coverage must validate before use.
15. Owner: Cody.
16. Retest: validate each selected engine before campaign.
Source: automated (readiness/source inspection), not Director walkthrough.

## ABM7F-F02

1. ID: ABM7F-F02
2. Title: Shared sandbox receipt writes before foreign classification
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: High.
5. Classification proposed: environment / contract gap.
6. Environment: local QA production copies; SCRATCH; Q1 source/readiness, no viewport claim.
7. Preconditions: authorized R-1/R-2 Q1; existing cast only.
8. Reproduction: (1) inspect cited command/source; (2) compare expected guard/readiness contract; no side-effect rerun.
9. Expected: PF-4.7 proves both directions cannot change opposite database before paid execution.
10. Actual: One alpha endpoint enabled; candidate webhook inserts durable receipt before foreign classification; deployed alpha source binding and remote listeners not established.
11. Evidence: evidence/Q1/02/readiness.json; listener-read.json; source src/server/webhook.ts:59 and :229.
12. Cause: no product cause inferred.
13. Scope: Q1 readiness; no product repair undertaken.
14. Gate impact: paid Q2 rows blocked; unaffected read-only work continues.
15. Owner: Tony / JARVIS.
16. Retest: re-prove both directions after explicitly authorized resolution.
Source: automated (readiness/source inspection), not Director walkthrough.
