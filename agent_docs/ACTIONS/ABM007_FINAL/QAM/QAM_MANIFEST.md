# QAM_MANIFEST (Engineer's factual completion record) — `ABM007_FINAL`

**Owner:** Engineer · **Written:** as engineering finishes, before the Director commits · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

Facts and labelled claims only. No test plan, no risk order, no QA finding, no decision, no certificate. No secret values anywhere: key names only.

## 1. Identity (one row per repository)

| Field | OwedBook | Portal |
|---|---|---|
| Remote | `Cyberize-Group/cyph-v1-dev` | `ahmedmusawir/cyph-payment-portal-dev-v1` |
| Baseline (full SHA) | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Engineering branch | `abm007-final` | `abm007-final` |
| HEAD at handoff (full SHA) | NOT RECORDED | NOT RECORDED |
| Implementation identity | `PENDING` until the Director commits. Never an invented SHA | `PENDING` |
| Intended QA branch | `qa/abm007-final` | `qa/abm007-final` |
| Working tree at handoff (clean, or listed below) | NOT RECORDED | NOT RECORDED |

## 2. Change inventory at handoff (per repository)

For each repository give four lists, each from an actual command whose text is recorded: committed since baseline; staged; unstaged; untracked. Then the consolidated table.

| Repository | Path | Kind (added, changed, removed, renamed) | What changed, in one line | Authorizing criterion or ruling | In the allowed list of `../CONTRACTS/NO_BREAK_AND_PATHS.md` section 3? |
|---|---|---|---|---|---|
| NOT RECORDED | | | | | |

Exceptions used (must already be authorized): NOT RECORDED. Paths the Engineer wanted to touch and did not, with the stop record: NOT RECORDED.

## 3. Claimed behavior and self-verification

One row per criterion in `../ABM_ACCEPTANCE_SPEC.md`. Every entry is a CLAIM for independent QA to test, not a result.

| AC | CLAIM | Command or method, with working directory | Exit code or observed outcome | Evidence path |
|---|---|---|---|---|
| NOT RECORDED (36 rows expected) | | | | |

## 4. Reproduction (per app)

| Step | OwedBook: command and working directory | Portal: command and working directory |
|---|---|---|
| Install | NOT RECORDED | NOT RECORDED |
| Unit tests | NOT RECORDED | NOT RECORDED |
| Typecheck and lint | NOT RECORDED | NOT RECORDED |
| Production build | NOT RECORDED | NOT RECORDED |
| Serve the production build (port) | NOT RECORDED | NOT RECORDED |
| Browser specs that are current | NOT RECORDED | NOT RECORDED |

## 5. What independent QA needs

| Item | Value |
|---|---|
| Runtime and package manager versions, per repository | NOT RECORDED |
| Environment variables needed, **names only**, and which file each is read from | NOT RECORDED |
| Services, with which project or account each build must point at | NOT RECORDED |
| Fixtures and roles the journeys need | NOT RECORDED |
| Migrations | Expected: none added or changed. Actual: NOT RECORDED |
| Webhook: endpoints and listeners the Engineer observed, read-only, and how events are routed (input to the isolation proof in `QAM_PREFLIGHT.md` PF-4.7) | NOT RECORDED |
| Mock mode: whether `NEXT_PUBLIC_APBM_DATA_MODE=mock` still ships in OwedBook and which screens it affects | NOT RECORDED |

## 6. Engineer deliverables named by the contract

| Deliverable | Path | Present? |
|---|---|---|
| Help label-verification table, completed | NOT RECORDED | |
| Stale-spec mapping table (16 Portal specs) and what was retired, with the feature-retirement evidence for each | NOT RECORDED | |
| Changed-labels list (AC-P01) | NOT RECORDED | |
| Redirect reproduction record (AC-F02) | NOT RECORDED | |
| Leftovers list for a removal decision | NOT RECORDED | |
| Prepared email body, subject and line diff (needs the Director's export) | NOT RECORDED | |
| Prepared Stripe values and files | NOT RECORDED | |
| Logo placement notes: hash after placing, each derived file's size and command | NOT RECORDED | |
| What each repository's root instructions required, and any conflict surfaced | NOT RECORDED | |

## 7. Known limitations

Unresolved issues, work not done, preserved paths, rollback dependencies (prior revision of each alpha service, the original email body): NOT RECORDED.

## 8. Meaning of each engineering evidence item

| Evidence path | What it shows | What it does not show | How QA can re-derive it |
|---|---|---|---|
| NOT RECORDED | | | |

## 9. Factual amendments after handoff (dated; Engineer only)

None.
