# QA Lead process reset — APBM-007A

Date: 16 November 2026. QA Lead: Friday. Requested by the Director.

## Sources read

| Source | Version | Where from | Read |
|---|---|---|---|
| QAM_PLAYBOOK.md | 1.0, 2026-10-18 | Module snapshot `GOVERNING/`, SHA-256 `456246341096459742400af061b6605fcf1d56e9de1a09b27621a6680489c9f6` | Entire, §§1–18 |
| RRM_PLAYBOOK.md | 1.0, 2026-10-18 | Project doc `03_BUILD_METHODOLOGY/RRM_PLAYBOOK.md` | Entire, including §§4, 7, 9, 10, 12 |
| APBM_PLAYBOOK_v1_0.md | 1.0, 18 October 2026 | Module snapshot `GOVERNING/`, SHA-256 `c12ff3f9bc4355e9bd8e1c276a3917bd443f864715ab1ffb6b84edf49beb4f93` | Entire, §§1–14 |
| QA_PLAYBOOK.md | 1.2, 2026-10-18 | Module snapshot `GOVERNING/`, SHA-256 `4c460b040b09782497069b69409381523fbf3bea56897febecb6c51f9458d458` | §§3–8, Stage 7, §§10–12, 14, 18, 19 |
| Module state | Q2 a01 package | `QAM_STATE`, `QAM_APPROVAL`, `FINDINGS`, `LEAD_REVIEW_ITEMS`, `QA_HANDOFF`, `APBM_RULINGS` A1, `AMENDMENT_LEDGER`, Lead adjudication of 16 November | Entire |

Gaps: the module's `GOVERNING/` folder carries no RRM snapshot, so the project copy was used. An older copy exists at `claude/RRM_PLAYBOOK.md` and was not used. The APBM playbook cites QA playbook v1.1; the snapshot is v1.2. No conflicting passage was found in the sections read. QA playbook §13 (Gate D), §§15–17 and §§20–29 were not read.

## Rule 1 — continuing QA branch: confirmed

- RRM §7: "The Engineer performs authorized rework on that QA branch; the QA Executor independently tests on that same branch … Repairs are not transferred back to the engineering branch and the QA branch is not abandoned as the normal workflow."
- RRM §4 and §9: Engineer repairs on the QA branch, Director commits, Executor re-pins and retests (Q4).
- QAM §11: "Engineer repairs approved paths on the QA line → Director commits → Executor re-pins and performs Q4."
- APBM §4: one active writer per checkout; any return to engineering for repair is recorded in `QAM/HANDOFFS/QA_HANDOFF.md`.

Recorded deviation: the 13 November repair of F-Q1-01 was made by switching both checkouts back to `apbm-007a` and fast-forwarding `qa/apbm-007a` afterwards (see `QA_HANDOFF.md`, "Engineering repair r02 record"). The two branches hold the same commits, so nothing diverged. It is not repeated.

## Rule 2 — continuous Q2: confirmed

- QAM §10: "An isolated product FAIL is recorded and unaffected checks continue unless the plan's stop conditions require otherwise."
- QAM §11: eight stop types (identity, contract, environment, auth, authority, instrument, evidence, privacy). A product defect is not one of them.
- RRM §12: execute continuously within a released assignment.
- APBM §9: "Do not stop unrelated safe work merely to return one missing filename at a time."

## Superseded instructions from the QA Lead seat

| Earlier instruction | Status |
|---|---|
| B11, "stop and report on any high-severity finding" (13 November) | Void. Contrary to QAM §10. Already replaced by the run-to-completion rule. |
| B1 entry gate, "report then stop until the Lead confirms" (13 November) | Not repeated. QAM §8 puts readiness in Q1; QAM §10 has the Executor verify identity and readiness at entry without a separate Lead ceremony. |
| SCRATCH reset condition that stopped the whole run (STOP-001) | A valid authority boundary, but it should have blocked only the affected item. Not repeated in that form. |
| Note to the Architect, 16 November: "Preserve QA's uncommitted files … as in r02" | Superseded where it implies the r02 branch switch. Repairs are made on `qa/apbm-007a`. No switch to `apbm-007a`, no fast-forward step. |
| "I'll write Cody's retest prompt" as a long instruction carrying operating rules | Superseded. QAM §6: no long custom prompt. The retest (Q4) is bound by a short record: the new pair, the Lead's impact disposition of the repair diff, and the scope already adjudicated. |
| The Lead's suggestion to deploy 007A to staging early | Withdrawn. The standing ruling is no deployment before 007B. |

Still in force: the Q2 a01 verdict (FAIL) and its evidence; the adjudication of F-Q2-001 and F-Q2-002; decisions on LR-01 to LR-09; the effect ceilings; all Director rulings and deferrals.

## Retest scope under the playbooks

- QAM §11 and RRM §9: Q4 covers the repair diff, the affected acceptance criteria and the full required regression. The campaign is not restarted.
- Outstanding coverage from the approved Q2 plan (the Executor-owned gaps and the journeys blocked by F-Q2-001) runs in the same continuous pass under the existing approved plan. No new Q1 and no new approval ceremony.
- QAM §9: a product change invalidates the earlier candidate binding and needs Lead review of the changed scope. That is one impact disposition, bound to the new pair.
- Unchanged evidence carries forward only with its original candidate and stated applicability.
- QAM §10: human checks are grouped near the end. The Director walk stays one grouped session.
- The Lead's adjudication must be recorded in `QAM/FINDINGS.md` by the Executor at Q4 entry; it currently lives only in the project docs.

## Current owner and next action

1. Engineer (Claudy) is the one active writer on `qa/apbm-007a` in both checkouts, repairing F-Q2-001 and F-Q2-002 only. Executor (Cody) is paused.
2. Director commits on `qa/apbm-007a`, rebuilds both apps as production builds and restarts them.
3. Director gives the QA Lead the two commit IDs and the Engineer's repair return.
4. QA Lead issues the impact disposition and binds Q4 to the new pair.
5. Executor runs Q4 and the outstanding coverage continuously and returns one package.
6. Grouped Director walk, then adjudication, cleanup decision and certification.
