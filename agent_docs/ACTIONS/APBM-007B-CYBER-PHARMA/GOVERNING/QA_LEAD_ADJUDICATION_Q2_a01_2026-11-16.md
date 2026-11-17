# QA Lead adjudication — APBM-007A Q2 a01

Date: 16 November 2026. QA Lead: Friday, via the Director. Executor: Cody.

## Binding

| Item | Value |
|---|---|
| Package | `APBM-007A-CYBER-PHARMA_Q2_REVIEW_a01.zip`, SHA-256 `8680ff27dad448515633dc2ec675ce86afb7e7365e2a1cae4f8a0fdee07747f9` (verified by the Lead) |
| OwedBook candidate | `37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40` |
| Payment Portal candidate | `9d938f62bff6172f9332ae6c67775e4b8feea379` (repair `9322405fe0238882c21c75ef62733fc8c732fed0`) |
| Plan SHA-256 | `2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672` |

## Verdict on this candidate

**FAIL — not certifiable.** One high-severity acceptance failure blocks the core purchase journey. Route: one consolidated repair, then one bounded retest, then the grouped Director walk.

## Findings

| ID | Classification | Decision |
|---|---|---|
| F-Q2-001 | **Acceptance failure, HIGH.** AC-007, AC-009, AC-034. A new registrant saves owner and pharmacy details but is returned to `/register/owner` and never reaches review or payment. Blocks AC-011, AC-013, AC-016, AC-018, AC-020 and all paid-owner billing proofs. | Repair required. Root cause is Engineering's to establish. |
| F-Q2-002 | **Acceptance failure, LOW-to-MEDIUM, confirmed in source.** RA-4 / AC-030. `undoCancellation` in `src/server/billing.ts` uses `if … else if`, so when both `cancel_at_period_end` and `cancel_at` are set it clears only the flag, then fails its own re-read check. The code comment says "or both". Live reachability is unproven: Stripe may clear the date itself when the flag is cleared. | Repair required (small). Clear the flag, re-read, then clear the date if it is still set. Prove against the live sandbox in retest. |

## Lead-review items

| ID | Decision |
|---|---|
| LR-01 | Accepted. AC-004 graded on reused engineering rehearsal plus independent read-only checks. Certification limitation. Restore remains not proven. |
| LR-02 | For the retest: real owned delivery, decline and paid-owner proofs come from the live DEV journeys once F-Q2-001 is repaired. Fault and recovery proofs (T-014, T-015) run the candidate handler in-process against the real SCRATCH database with a mocked provider, the same method already used for the reminder record. Real-Auth crash coverage (T-017) stays a carried certification gap. |
| LR-03 | Already approved on 13 November: sample loader on SCRATCH, one synthetic store, 50 rows first run, 0 second run. Run it in the retest. |
| LR-04 | Required in the retest. These are Executor-owned coverage gaps, not product defects and not waived: draft-context attack (AC-008), handoff code negatives (AC-023), arbitrary-user mint and claim negatives (AC-024), protected-field and IDOR body checks (AC-027, AC-028), legacy fixture updates (AC-006), filters, pagination and one-admin invariant (AC-036), keyboard and full theme matrix (AC-035), wrong or inactive portal configuration (AC-029), bootstrap misuse (AC-003), refresh and restart (AC-025). |
| LR-05 | Accepted as a limitation for the foreign event. In the retest, capture the listener's natural delivery result for every owned journey (B5). |
| LR-06 | Open with the Director and Architect. Carried as a known limitation unless resolved before certification. |
| LR-07 | Deferred to the grouped Director walk after the retest. |
| LR-08 | Mission Control app not run. Carried as a limitation for the Director's acceptance at certification. JWT residual after logout measured as expected (app endpoints reject immediately; direct data token lives up to an hour). |
| LR-09 | No cleanup now. Retained drafts, reservations and the foreign sandbox objects stay until after the retest. |

## What ran clean

Identity and builds; ledger 60/60 on both databases; tenant privileges; webhook signature negatives; six recovery behaviours at unit level plus one real foreign event; grace-period SQL (14 checks); NPI rules including a real two-connection race; reminder banner (both themes, 375 and 1440); reminder record with dedupe; sign-in handoff both directions in Chromium, Firefox and WebKit; cookie isolation; redirect attacks denied; logout; owner-only billing; operator command basics; privacy scan. Effects stayed inside every ceiling: 0 payments, 0 emails, 0 new identities.

## Still unproven by ruling

Live failed-renewal journey with test clock (007B, O-1). Reminder email (007B, O-2). No deployment before 007B.

## Process note

Q2 ran unattended to completion with zero Director touches after the run-to-completion rule. Lesson for the next module: engineering's handback must include one full happy-path walk on a production build; this defect was not visible in dev mode testing.
