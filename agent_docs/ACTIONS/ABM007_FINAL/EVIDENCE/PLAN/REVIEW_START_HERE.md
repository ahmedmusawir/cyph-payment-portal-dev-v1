# REVIEW_START_HERE — ABM007_FINAL engineering plan review, package 01

**Date:** 24 November 2026, Asia/Dhaka · **From:** Engineer (Claudy) · **To:** Architect (JARVIS) for review; Director (Tony) for the decisions in the plan's section 12 and the build release.

**What this is.** The draft engineering plan for ABM007_FINAL with its entry-check evidence, written on the Director's instruction of 24 November.

**Internal only.** The saved diffs repeat existing deployment records (service names, build and endpoint identifiers). Do not forward outside the project team.

**What this is not.** Not a frozen contract, not an approved plan, not a build release. No proposed position is settled by it. No product file, dependency, database, dashboard, deployment or Git state was changed. No QA result, approval or certificate is filled.

## Read in this order

1. `ABM007_FINAL/ABM_EXECUTION_PLAN.md`: section 1 (summary), then section 12 (the one list of blockers and pending decisions).
2. `ABM007_FINAL/EVIDENCE/PLAN/ENTRY_CHECKS.md`: E-1 to E-6 with commands and results.
3. `ABM007_FINAL/EVIDENCE/PLAN/logs/summary.txt` and the eight logs, if you want the baseline runs.
4. `ABM007_FINAL/EVIDENCE/PLAN/diffs/`, if you want the full diffs behind E-2 and E-4.

## Five things to know first

1. **OwedBook is one commit past its recorded baseline.** The record files reported as uncommitted were committed at 07:54 today as `c335671` (records only, local, not pushed). Nothing was discarded. Decision D-B1.
2. **Both baselines are healthy.** OwedBook 374/374, Portal 572/572; typecheck and production build pass in both, and lint has 0 errors (38 and 27 existing warnings), in isolated copies.
3. **The allowed paths cover the contract.** No protected-path edit, dependency or migration is needed. Three protected-path observations are recorded in the plan, section 4.3; none blocks.
4. **The Help draft disagrees with the product in places.** A Member has no My Stores page; OwedBook's menu says "Logout". Plan section 8.
5. **Estimate: 8.5 to 12 engineering working days** for the proposed scope. Not a date.

## Decisions requested

| From | Decision |
|---|---|
| Architect | Review the plan; say whether the baseline statement (D-B1) and the records arrangement (D-B5) are acceptable |
| Director | D-B1 to D-B6 in the plan's section 12 A, then the release (D-B7). Sections C and D can wait until QA and deployment |

## Not done, honestly

- No app was started; nothing was checked in a browser.
- The Director's earlier branch receipt was not available; branches were reconciled against the reflogs.
- No fetch or remote query was run, so remote branches are as of the last fetch (23 Nov, 15:02).
- Live alpha identity was not read back.
- Browser specs and the Portal's integration tests were not run.
- The E-4 diffs were saved in full; their path lists are exhaustive and all record files, and their changed lines were read.

## Records written in this session

Inside the Portal repository only; OwedBook was read, not written.

| Path | What |
|---|---|
| `agent_docs/ACTIONS/ABM007_FINAL/ABM_EXECUTION_PLAN.md` | The plan (replaces the pack's "not yet authored" stub) |
| `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/PLAN/**` | Entry-check evidence, logs, diffs, this file, the package index |
| `agent_docs/ACTIONS/ABM007_FINAL/ABM_STATE.md`, `ABM_JOURNAL.md` | One appended Engineer row each. Module state unchanged |
| `session_2026-11-24.md`, `CHANGELOG.md` (one prepended entry), `agent_docs/RESPONSES/response_2026-11-24_*_abm007-final-engineering-plan.md` | Records the Portal's root instructions require |

Pre-existing and not written by this session: the rest of the module pack (installed by the Director at 07:49), and everything in OwedBook including commit `c335671`. `RECOVERY.md` was not written in either repository.

The pack's own `FILE_INDEX.json` still lists the original hashes of `ABM_EXECUTION_PLAN.md`, `ABM_STATE.md` and `ABM_JOURNAL.md`; those three are Engineer-appended files and now differ.

## Package facts

`FILE_INDEX.json` lists every member except itself, with size and SHA-256. The ZIP's own SHA-256 is in the return message and in the `.sha256` file beside the ZIP. No secret or environment-file content is in any member: the isolated copies had no environment file, and the diffs and logs were scanned for key patterns.
