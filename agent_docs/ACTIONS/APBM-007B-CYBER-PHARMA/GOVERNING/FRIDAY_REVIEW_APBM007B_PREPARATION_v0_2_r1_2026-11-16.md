# Friday review — APBM-007B preparation pack v0.2 revision 1

Date: 16 November 2026, Asia/Dhaka. Reviewer: Friday. Author reviewed: the Architect (JARVIS). Requested by the Director.

This review supersedes `FRIDAY_REVIEW_APBM007B_PREPARATION_v0_2_2026-11-16.md`, which reviewed the interim v0.2 that crossed with the v0.1 review. Amendment IDs FR-01 to FR-09 are defined in `FRIDAY_REVIEW_APBM007B_PREPARATION_v0_1_2026-11-16.md`.

## Reviewed package

| Item | Value |
|---|---|
| File | `APBM-007B-CYBER-PHARMA_PREPARATION_v0_2_r1.zip` |
| SHA-256 | `497e82992a701aaee1489b81638abaf99a2d2fb222e437882b55c373eb3d0d16` |
| Members | 68 files; 67 indexed plus the index itself. All sizes and hashes match. |
| Method | Full diff against the interim v0.2; `AMENDMENT_LEDGER.md`, `MISSING_INPUTS.md`, state, decision register, Director summary read in full; each claimed amendment text checked in its file. |
| Sources | The v0.1 review is preserved byte-identical in `GOVERNING/` (hash verified). |

## Verdict

**ACCEPT — recon preparation complete, subject to the two inputs below.** No further amendment round is needed before E1.

This is not an E1 or E2 release, not Q1 approval and not a certification. The 007A baseline stays pending and the active 007A QA ownership boundary is preserved.

## Amendment status

| ID | Status | Verified |
|---|---|---|
| FR-01 | **CLOSED** | Register now separates settled rules (cited to the decisions record) from remaining choices; no row waits on Frank or Coach; readiness line and Director summary corrected. |
| FR-02 | **CLOSED** | Requirements note unchanged in `GOVERNING/`; basics row first in preflight; one-time-budget sentence in `QAM_ENTRY.md`; handback wording exact. |
| FR-03 | **CLOSED on receipt of one file** | AC-006 and D-09 wording present; Q2 a01 adjudication included. The Q4 a02 original is supplied with this review as `QA_LEAD_ADJUDICATION_Q4_a02_2026-11-16.md`, exported from the project copy at `LABS/APBM-007/`. The Architect adds it to `GOVERNING/`, the source register and the index, and clears `MISSING_INPUTS.md`. |
| FR-04 | **CLOSED** | All five additions present in AC-005, AC-012, AC-025, AC-027, AC-028. |
| FR-05 to FR-09 | Recorded for freeze after E1 | Ledger wording matches the review. |
| FR-10 (from the superseded v0.2 review) | **WITHDRAWN as an amendment** | r1 no longer states a one-reminder policy. D-05, AC-026 and AC-027 correctly leave the count to the Director. The clarification below is all that remains. |

## Clarification of the QA requirement on reminders

D-05 records that "the early QA note says one per failed invoice" and the review recommends two notices. These do not conflict. The note's line is a no-duplicates rule. Read it as:

> Each approved notice type is sent at most once per failed invoice.

How many notice types exist and when they are sent is the Director's default (decision 4). The Architect may replace the "differ" wording in D-05 and AC-026 with this sentence at freeze.

## Cosmetic, at freeze

AC-006, AC-012, AC-025 and AC-027 now carry the appended review sentence next to an equivalent earlier sentence. Merge each pair into one sentence when the contract is frozen. No meaning changes.

## Two inputs before the Director can release E1

1. The Q4 a02 adjudication file added to the pack (supplied with this review).
2. The Director's five rulings, recorded in `APBM_RULINGS.md`. Decisions 1 (seats) and 5 (recon now on exported commits) are the two that E1 itself needs. Decision 2 (operator command plus procedure versus customer screens) should also be in before E1, because it changes what the recon is asked to design.

When both are in, the Architect issues the pack as v0.3 and the Director may release E1 with a named executor, the exported commits and an output directory. No further Friday review is needed for that step.

## Unchanged

E2 still needs the final 007A certificate, cleanup, closeout and merge receipts, the E1 report, FR-05 to FR-09, and the frozen pack.
