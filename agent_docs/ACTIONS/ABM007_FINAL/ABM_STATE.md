# ABM_STATE — ABM007_FINAL

A small index. It points at authoritative records and grants no authority. Latest entry wins. QA state lives in `QAM/QAM_STATE.md`; this file only points to it.

## Current state

| Field | Value |
|---|---|
| As of | 23 November 2026, Asia/Dhaka |
| Module state | `REVIEW CANDIDATE — AWAITING ARCHITECT VERDICT AND DIRECTOR RULINGS` (second review candidate; the Architect re-checks amendments A-01 to A-06) |
| Contract version | Brief, acceptance spec and amended contracts at 1.1-review; Help content unchanged at 1.0-review. Not frozen |
| Engineering branch / baseline, OwedBook | `abm007-final` / `9597699b404afdbcd792a9b4da61c21abb10cdf8` |
| Engineering branch / baseline, Portal | `abm007-final` / `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Product candidate | PENDING (does not exist until the Director commits completed engineering) |
| Approved engineering plan | NOT RECORDED |
| Engineering release | NOT RECORDED |
| Gate V (visual approval of `DESIGN/`) | Approved by the Director on the REVIEW_01 renders, 23 Nov 17:20. Reconfirmation on the corrected REVIEW_02 renders PENDING (`ABM_RULINGS.md` AM-01, AM-03) |
| Current writer | none. The pack has not been installed in either repository |
| QAM state | `READY FOR ENGINEERING` (see `QAM/QAM_STATE.md`) |
| Latest package | The authoring review package; filename and SHA-256 in the author's return message |
| Current stop | none |
| Next owner | Architect (check of amendments A-01 to A-06); Director (the four decision groups in `ABM_RULINGS.md` section 4) |
| Next permitted action | Review. No installation, build, external change or deployment |
| Actions already completed that must not repeat | Pre-ABM recon by the Engineer, 23 Nov. The Director's customer rehearsal of 21 to 22 Nov. Neither is rerun |

## Transition log (append-only; newest last)

| Date | Seat | From → To | Record |
|---|---|---|---|
| 2026-11-23 | ABM author (QA Lead seat, acting co-architect) | — → `REVIEW CANDIDATE — AWAITING ARCHITECT VERDICT AND DIRECTOR RULINGS` | Review package authored from the sources in `SOURCES/SOURCE_INDEX.md` |
| 2026-11-23 | Architect | state unchanged | Review 01: ACCEPT WITH EXACT AMENDMENTS, A-01 to A-06 (`SOURCES/ARCHITECT_REVIEW_01_2026-11-23.md`). Not a freeze |
| 2026-11-23 | ABM author | state unchanged | REVIEW_02: the six amendments applied in one bounded pass (`AMENDMENT_EVIDENCE_02.md`). No recon repeated, nothing built |
| 2026-11-24 | Engineer | state unchanged | Draft engineering plan returned on the Director's instruction of 24 Nov, which authorized entry checks and a draft plan while the pack is a review candidate. Entry checks E-1 to E-6 done (`EVIDENCE/PLAN/ENTRY_CHECKS.md`); `ABM_EXECUTION_PLAN.md` DRAFT 01 written. Not a freeze, not a release; no product change. Found: OwedBook HEAD is `c335671`, one records-only local commit past the baseline `9597699` |

## State vocabulary

`REVIEW CANDIDATE — AWAITING ARCHITECT VERDICT AND DIRECTOR RULINGS` → `CONTRACT FROZEN — READY FOR ENGINEERING PLAN` → `PLAN RETURNED — AWAITING REVIEW AND RELEASE` → `ENGINEERING RELEASED` → `ENGINEERING COMPLETE — AWAITING QA BRANCH` → (QA states in `QAM/QAM_STATE.md`) → `CERTIFIED — DEPLOYMENT AUTHORIZED FOR <service>` (once per service) → `DEPLOYED — ALPHA VERIFICATION PENDING` → `ALPHA VERIFIED — AWAITING DIRECTOR ACCEPTANCE` → `CLOSED`. A stop may interrupt any state and records its resume point.
