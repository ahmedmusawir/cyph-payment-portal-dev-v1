# QA LEAD — QAM amendment install instructions for `ABM007_FINAL`

**Date:** 24 November 2026, Asia/Dhaka
**From:** QA Lead · **For review by:** Architect · **To be executed by:** Engineer, on the Director's release
**Companion file:** `QAM_AMENDMENT_01.md` (the text to install, verbatim)
**Status:** for Architect review. Not released. It does not release Q2, does not expand E2 product scope, and authorizes no test effect.

## 1. What I could and could not reconcile

I was asked to reconcile against the installed pack and not assume my authoring copy matches. **I cannot see the installed pack.** I hold my own review package 02 and, from the Engineer's plan package, only three installed files: the execution plan, the state file and the journal. No installed QAM file has reached me.

I have not received campaign journal v0.4 either. I hold v0.3. I applied the banking clarification as the Director's message of 24 November states it, and as v0.3 Entry 003 states it. If v0.4 says more, send it and I will correct section 9 of the amendment.

So I designed the install so that it does not depend on my copy being identical:

1. **One new file carries every rule.** `QAM_AMENDMENT_01.md` is added whole. It states that it governs where an earlier QAM sentence differs.
2. **Every change to an existing file is an append at the end of that file.** Nothing is replaced, reworded or deleted. An append cannot collide with wording I have not seen.
3. **The Engineer reconciles on the real files and reports back.** Before appending, the Engineer checks each file exists and quotes the installed passages listed in section 4. I then compare those quotes with the amendment and tell the Architect if anything in the installed pack contradicts it in a way a pointer does not cover.
4. **A mismatch stops only that one file.** If a named file is missing or has a different name, the Engineer does not improvise; it reports what is there.

## 2. What gets installed

| # | Action | File (under the module's `QAM/` folder) |
|---|---|---|
| 1 | Add new file, verbatim | `QAM_AMENDMENT_01.md` |
| 2 to 12 | Append one block at the end of each | `QAM_ENTRY.md`, `QAM_RISK_REQUIREMENTS.md`, `QAM_RECON_REPORT.md`, `QAM_TEST_PLAN.md`, `QAM_APPROVAL.md`, `QAM_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, `FINDINGS.md`, `QAM_CLEANUP_REPORT.md`, `QAM_CERTIFICATION.md`, `QAM_STATE.md` (one transition-log row) |
| 13 | Append one dated entry at the next free amendment number | The module's `ABM_RULINGS.md`, amendment section |
| 14 | Append one row each | The module's `ABM_JOURNAL.md` and `ABM_STATE.md` |
| 15 | Records the repository's own instructions require for a documentation change | As those instructions say. `RECOVERY.md` is not written |

If the OwedBook pointer folder mirrors any of these files, it is left alone; the Portal repository holds the canonical pack.

## 3. The blocks to append

Each block is appended exactly as written, after one blank line, at the end of the named file. The `>` mark at the start of each line below only shows where a block begins and ends. It is not part of the text and is not installed.

**3.1 `QAM_ENTRY.md`**

> ## Amendment 01 (24 November 2026)
>
> `QAM_AMENDMENT_01.md` is part of this QAM and is read straight after this file. Where a sentence above differs from it, the amendment governs. In short: the Director's human walkthrough is inside Q2 and before certification; automated and human findings share one register and one repair work order; Q1 inventories existing tests and maps regression coverage; reusable passing scripts are listed for keeping before cleanup; a fixture session is never proof of real sign-in. It adds no shot and releases nothing.

**3.2 `QAM_RISK_REQUIREMENTS.md`**

> ## Amendment 01 module requirements (24 November 2026)
>
> Source for all four rows: Director rulings of 24 November 2026, campaign journal Entries 001 to 003, DC-001 and DC-002. Detail: `QAM_AMENDMENT_01.md`.
>
> | ID | Requirement | Evidence expected |
> |---|---|---|
> | AR-1 | A QA Lead-selected human walkthrough is performed by the Director inside Q2, before certification | The selected checks in the approved plan, each with a recorded result. None prefilled |
> | AR-2 | Regression coverage is inventoried and selected in Q1 from the complete candidate diff | The inventory, the CR and criterion mapping, and a reason for every exclusion and reused item |
> | AR-3 | A fixture session is not presented as proof of real sign-in, email delivery or handoff | Every result states how its session was obtained; real sign-in has its own evidence |
> | AR-4 | Reusable passing scripts are listed and approved for keeping before any cleanup removes them; no credential or sign-in state is kept | The approved keep-list in the cleanup report |

**3.3 `QAM_RECON_REPORT.md`**

> ## Amendment 01 additions (owner: QA Executor, Q1)
>
> **A. Test and helper inventory.** One row per suite, spec, check set or helper found in either repository or in the retained APBM-007B QA lane.
>
> | Asset | Repository or lane | Kind | Current, stale or retired, and why | What it covers | What it needs to run |
> |---|---|---|---|---|---|
> | NOT RECORDED | | | | | |
>
> **B. Coverage map.**
>
> | CR or criterion | Existing coverage | Gap | Only testable by a person today? |
> |---|---|---|---|
> | NOT RECORDED | | | |
>
> **C. Recommended layout for a durable regression pack.** A recommendation only. Nothing is implemented in Q1. NOT RECORDED.
>
> **D. Fixture state as found**, and any need the existing cast cannot meet. NOT RECORDED.
>
> **E. Sign-in method available for routine automated runs** without the Director's inbox, and the authorization it rests on. NOT RECORDED.

**3.4 `QAM_TEST_PLAN.md`**

> ## Amendment 01 additions (owner: QA Executor drafts; QA Lead selects and approves)
>
> **A. Human walkthrough.** This table replaces any earlier human-checks section in this file. Fields are defined in `QAM_AMENDMENT_01.md` section 1.
>
> | ID and criterion | Why a human | Candidate and target | Fixture and effects | Action | Expected result | Evidence | Result | Finding and retest |
> |---|---|---|---|---|---|---|---|---|
> | NOT RECORDED | | | | | | | PENDING | |
>
> Effort estimate for the walkthrough: NOT RECORDED. Device named for any real-phone check: NOT RECORDED.
>
> **B. Regression selection.**
>
> | Change in the candidate | Coverage selected | CR mapping | Session method | Effects declared | Excluded or reused, with reason and owner |
> |---|---|---|---|---|---|
> | NOT RECORDED | | | | | |

**3.5 `QAM_APPROVAL.md`**

> ## Amendment 01 additions (owner: QA Lead)
>
> | Field | Value |
> |---|---|
> | Selected human checks (IDs) | NOT RECORDED |
> | Proposed human checks removed or moved to automation, with reasons | NOT RECORDED |
> | Regression selection accepted, with any exact amendments | NOT RECORDED |
> | Automated sign-in method confirmed as not needing the Director's inbox | NOT RECORDED |
> | Human checks the Director must repeat after a repair (per retest round) | none |

**3.6 `QAM_EXECUTION_REPORT.md`**

> ## Amendment 01 additions (owner: QA Executor records; the Director's observations are his own)
>
> **A. Human walkthrough record.** This table replaces any earlier human-checks table in this file.
>
> | ID | Performed by | Candidate and target confirmed | Observation, in the performer's words | Result | Time | Finding |
> |---|---|---|---|---|---|---|
> | NOT RECORDED | | | | PENDING | | |
>
> **B. Session method by test.** Each result in this report states fixture session, password sign-in, or emailed link (human).
>
> **C. First failures.** Each first failure is listed here with its classification before any rerun.
>
> | Test | First failure, time | Classed as | Rerun? Why it was safe | Later outcomes |
> |---|---|---|---|---|
> | none recorded | | | | |

**3.7 `AC_EVIDENCE_MATRIX.md`**

> ## Amendment 01 note
>
> A criterion that depends on a required human check is not PASS while that check is PENDING or BLOCKED. Evidence obtained under a fixture session is marked as such in the evidence cell and does not satisfy a criterion that asks for real sign-in, email delivery or handoff.

**3.8 `FINDINGS.md`**

> ## Amendment 01 additions
>
> 1. Every finding records one additional field, **Source**: automated, or Director walkthrough.
> 2. Findings from both sources are kept in this one register. A pass from one source does not close a failure from the other.
> 3. After adjudication there is one consolidated repair work order for the Engineer.
>
> | Repair work order reference | Findings included | Issued by, date |
> |---|---|---|
> | none | | |

**3.9 `QAM_CLEANUP_REPORT.md`**

> ## Amendment 01 addition: keep-list (completed before any cleanup step removes anything)
>
> Proposed by the QA Executor, approved by the QA Lead. Never listed: credentials, passwords, tokens, links, cookies, sign-in state, browser profiles, raw authenticated traces.
>
> | Asset | CR mapping | Pass checkpoints | Fixture specification | Permitted effects | Actual result | Candidate it passed on | Keep? |
> |---|---|---|---|---|---|---|---|
> | NOT RECORDED | | | | | | | |
>
> QA Lead approval of the keep-list: NOT RECORDED.

**3.10 `QAM_CERTIFICATION.md`**

> ## Amendment 01 checks (QA Lead, before any verdict)
>
> | Check | Met? Evidence |
> |---|---|
> | Every selected human check has a result; none is PENDING. Any BLOCKED check has the Director's written disposition | |
> | Automated and human findings were adjudicated together; one repair work order; affected retests and required regression done on the final candidate | |
> | No fixture-session evidence is counted as proof of real sign-in, email delivery or handoff | |
> | The keep-list was approved before cleanup | |
> | Deployment-only checks are named and left to Gate D | |

**3.11 `QAM_STATE.md`**, one row appended to the transition log, with the state left unchanged:

> | 2026-11-24, Asia/Dhaka | Engineer, on the QA Lead's instruction and the Director's release | state unchanged | none | `QAM_AMENDMENT_01.md` installed with pointer blocks. Documentation only. No result recorded |

If the installed log has different columns, the Engineer fits the same content to them and says so in the report.

**3.12 `ABM_RULINGS.md`**, one entry at the next free amendment number:

> | (next number) | 2026-11-24 | Director; campaign journal Entries 001 to 003 (DC-001, DC-002) | The QAM is amended by `QAM/QAM_AMENDMENT_01.md`: human walkthrough inside Q2 before certification; one findings register and repair work order with affected retest; regression inventory and selection in Q1; reusable passing scripts listed for keeping before cleanup; fixture sign-in is not proof of real sign-in. No acceptance criterion, effects envelope, Gate D plan or verdict authority changes. No shot is added |

## 4. What the Engineer reports back

1. For each file in section 2: found or not found, its SHA-256 before and after, and confirmation that the only change is the appended block.
2. The SHA-256 of the installed `QAM_AMENDMENT_01.md`, to be compared with the copy supplied.
3. **Quoted, unedited, from the installed files as they were before the change:**
   - `QAM_ENTRY.md`: the standing rules list, and the row describing the target environment.
   - `QAM_TEST_PLAN.md`: the human-checks section.
   - `QAM_EXECUTION_REPORT.md`: the human-checks section.
   - `QAM_RISK_REQUIREMENTS.md`: the full list of module requirement IDs with their one-line titles, and the permitted-effects table.
   - `QAM_CLEANUP_REPORT.md`: the retention table.
   - `ABM_RULINGS.md`: the list of amendment numbers already used.
4. Any file that differs in name, place or structure from this document, with what is actually there.
5. The complete `git status` and the name-only diff for the change, showing documentation files only.
6. A Git reminder for the Director naming the exact paths.

## 5. Limits on the Engineer

Documentation only. No product file, test file, dependency, database, dashboard or deployment is touched. No QA result, approval, plan, finding or certificate field is filled; every "NOT RECORDED" and "PENDING" stays as written. Nothing above the appended block in any file is edited. The module's own state does not change. This is not part of E2's product scope and does not alter the E2 handoff duties. Git stays with the Director.

## 6. Prompt for the Engineer

Recipient: **the Engineer**. Sent by the Director, after the Architect's review, with `QAM_AMENDMENT_01.md` and this document attached.

To: the Engineer. Documentation-only task for module ABM007_FINAL, released by the Director. Two files are attached: QAM_AMENDMENT_01.md and the QA Lead's install instructions. Read the install instructions in full first. Then, in the Portal repository's module folder: first, before changing anything, collect the quoted passages listed in section 4 item 3 of the instructions. Second, add QAM_AMENDMENT_01.md to the QAM folder exactly as supplied and confirm its SHA-256 matches the attached copy. Third, append each block in section 3 of the instructions to the end of its named file, exactly as written, changing nothing above it. Fourth, append the journal and state rows and write the records this repository's own instructions require for a documentation change; do not write RECOVERY.md. If a named file is missing, renamed or structured differently, do not improvise: leave that file alone and report what you found; carry on with the others. Do not touch any product file, test, dependency, database, dashboard or deployment. Do not fill any QA result, approval, finding or certificate field. Do not run any test for this task. Do not commit; Git is the Director's. Return the report described in section 4 of the instructions, with a Git reminder naming the exact paths, one command per block.

## 7. What I do after the report

I compare the quoted installed passages with the amendment. If the installed QAM contains anything the amendment does not already override by its governing clause, I return an exact follow-up to the Architect. If it is clean, I confirm the amendment is carried and Q1 can depend on it.

## Glossary

- **Q1 / Q2:** the QA Executor's planning shot / its execution shot.
- **CR-nn:** a target critical-regression journey. **HC-nn:** a selected human check. **AR-n:** a requirement added by this amendment.
- **REG-001:** the separately scoped engineering assignment that will build the first maintained regression pack.
- **Fixture session:** a signed-in test session set up for a designated test user, as setup.
- **Keep-list:** the approved list of reusable passing scripts to retain before cleanup.
- **Gate D:** the separate check of deployed services.
