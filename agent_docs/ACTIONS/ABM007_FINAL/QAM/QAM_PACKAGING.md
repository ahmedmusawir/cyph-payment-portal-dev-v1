# QAM_PACKAGING — `ABM007_FINAL`

**Owner:** QA Executor builds each package · **Written:** every Q1, Q2, stop and retest return · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

## 1. Name and place

`HANDOFFS/ABM007_FINAL_<PHASE>_REVIEW_<ATTEMPT>.zip`, where PHASE is Q1, Q2, STOP, Q4 or CLEANUP and ATTEMPT is two digits. The module copy is canonical. A byte-identical copy in the Director's Downloads folder is made when he asks. Earlier ZIPs are never nested inside a new one.

## 2. Always included

`REVIEW_START_HERE.md` (from `HANDOFFS/REVIEW_START_HERE.md`, filled for this return); `QAM_STATE.md` as the pre-export snapshot; the phase reports actually written; the plan and `QAM_APPROVAL.md` where they exist; the frozen contract and rulings; `GOVERNING/`; `FINDINGS.md`; the evidence the reports cite; `FILE_INDEX.json`. The real recon response files are included, not a summary of them. If someone is to transcribe an approval or certificate, its exact text is included.

## 3. Never included

Environment or credential files; auth state; browser profiles; raw authenticated traces that were not sanitized and approved; `node_modules`; build output; Git internals; disposable mirrors; magic links, one-time codes, cookies, private Stripe session addresses. A missing item is listed honestly in the entry note.

## 4. Index

`FILE_INDEX.json` lists every member except itself: archive path, source path, purpose, byte size, SHA-256. Use an explicit inclusion list, never a whole-folder sweep.

## 5. Checks before returning

| # | Check | Result |
|---|---|---|
| 1 | Archive integrity test passes | NOT RUN |
| 2 | Index membership equals archive membership exactly | NOT RUN |
| 3 | Every size and hash matches | NOT RUN |
| 4 | No absolute or parent-escaping path; no duplicate member | NOT RUN |
| 5 | Privacy scan over the expanded members, with the scanner's leak fixture and clean control shown | NOT RUN |

## 6. Receipt (outside the ZIP)

Absolute upload path, member count, SHA-256 of the finished ZIP, and the exact decision requested. The ZIP's own hash is never written inside it.

## 7. Packaging never reruns passed tests.
