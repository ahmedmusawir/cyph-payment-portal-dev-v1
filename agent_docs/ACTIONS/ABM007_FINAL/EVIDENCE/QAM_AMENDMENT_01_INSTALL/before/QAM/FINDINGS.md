# FINDINGS — `ABM007_FINAL`

**Owner:** QA Executor records and proposes; QA Lead dispositions; Architect and Director route repair · **Written:** Q2 onward · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

## 1. Register

| ID | Title | Severity (proposed) | Classification (proposed) | AC | QA Lead disposition | Route |
|---|---|---|---|---|---|---|
| none recorded | | | | | | |

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
