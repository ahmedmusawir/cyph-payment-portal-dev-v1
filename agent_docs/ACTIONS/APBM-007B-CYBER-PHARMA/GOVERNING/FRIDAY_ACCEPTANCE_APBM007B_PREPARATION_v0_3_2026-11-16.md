# Friday acceptance — APBM-007B preparation pack v0.3

Date: 16 November 2026, Asia/Dhaka. Reviewer: Friday. Author reviewed: the Architect (JARVIS). Requested by the Director.

## Reviewed package

| Item | Value |
|---|---|
| File | `APBM-007B-CYBER-PHARMA_PREPARATION_v0_3.zip` |
| SHA-256 | `9855b9145c33b28884eee6c337cda70d10be4d178155f8b4ae1ea03fca45a60d` |
| Members | 72 files; 71 indexed plus the index itself. All sizes and hashes match. |
| Method | Full diff against v0.2 revision 1; rulings, decision register, state, ledger, recon mission, launch notes, readiness list and changed criteria read in full; stale-statement search across all authored files. |

## Verdict

**ACCEPTED — preparation complete.** v0.3 is the accepted 007B preparation pack. No further preparation review is needed.

This is not an E1 or E2 release, not Q1 approval and not a certification. The 007A baseline stays pending and the active 007A QA ownership boundary is preserved.

## Verified

- Both inputs from the r1 review are in. The Q4 a02 adjudication and the r1 review are preserved byte-identical in `GOVERNING/` (hashes checked against the QA Lead's copies).
- FR-01 to FR-04 closed. FR-05 to FR-09 recorded for the freeze after E1, together with the cosmetic merge of duplicate sentences in AC-006, AC-012, AC-025 and AC-027.
- Director decisions 1 to 4 are recorded as approved, with the Director's own words quoted in `GOVERNING/DIRECTOR_DECISIONS_APBM007B_2026-11-16.md`, and carried consistently into `APBM_RULINGS.md`, `DECISION_REGISTER.md`, `CONTRACTS/OPERATION_CLASSIFICATION.md` and AC-014, AC-019, AC-020, AC-023, AC-026.
- Decision 5: the early-recon proposal is withdrawn. E1 runs after 007A is certified, closed out and merged, on named committed states only, with no dirty files. This is consistent with FR-08 and is the safer reading of the 007A ownership boundary.
- The reminder rule now reads correctly: two approved notice types, each sent at most once per failed invoice, none after recovery.
- No stale statement remains that contradicts the recorded rulings.
- Nothing is prefilled. No result, approval or certificate is implied anywhere in the pack.

## What happens next

1. 007A is certified, cleaned up, closed out and merged. That work belongs to the 007A lab.
2. The Director releases E1 by naming three things: the two merged commit IDs, the report directory, and the Engineer as executor.
3. The Architect freezes the pack from the E1 report and applies FR-05 to FR-09.
4. Friday reviews the frozen pack once, before the Director releases E2.

## Note on the date

Running E1 after the merge means 007B engineering cannot start before 007A closes. The pack is ready the moment it does.
