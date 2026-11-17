# QAM_ENTRY — `APBM-007B-CYBER-PHARMA`

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/QAM_ENTRY.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §§2, 5, 6, 7, 15. **Owner: Architect** (resolves every Recorded in ../CONTRACT_MANIFEST.json and parent state at packaging). This file is the canonical entry both `CLAUDE.md` and `AGENTS.md` point to. It references authority; it grants none. The dispatch table in §5 is a document instruction read by the arriving agent, not a dispatcher.

## 1. Module identity

| Field | Value |
|---|---|
| Module ID / type | `APBM-007B-CYBER-PHARMA` / `APBM per GOVERNING/APBM_PLAYBOOK_v1_0.md` |
| Repository | `cyph-payment-portal-dev-v1 with cyph-v1-dev dependency` (`/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`) |
| Module directory (repo-relative) | `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA` — this QAM lives at `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/` |
| Engineering branch | `apbm-007b` |
| QA branch (continuing; created by the Director **at the completed engineering candidate commit** after the engineering handoff; Director-merged into `main`) | `qa/apbm-007b` |
| Baseline commit (full SHA) | `c68c4acaccc4a68f20ede267f06cfda17fa15aac (Portal); 0b785524a621c4384db8bee47ef9b4149b8ab44c (OwedBook)` |
| Candidate (tested product identity) | `PENDING` — resolved by the QA Executor in Q1 from the Director's commit receipt / read-only Git evidence and reconciled against the handoff inventory (`QAM_MANIFEST.md` §2); never invented |
| Playbook governing this QAM | QAM_PLAYBOOK `v1.0` — snapshot and hash in `GOVERNING/README.md` |

## 2. Governing contract (linked, not duplicated)

| Item | Module-relative path | Identity |
|---|---|---|
| Frozen acceptance spec | `../ACCEPTANCE_SPEC.md` | v1.0; SHA-256 in ../CONTRACT_MANIFEST.json |
| Ruling / erratum lane (append-only; attributable approved amendments only) | `../APBM_RULINGS.md` | Recorded in ../CONTRACT_MANIFEST.json and parent state |
| Implementation assignment (Engineering entry) | `../APBM_ENTRY.md` | — |
| Other governing bodies (QA_PLAYBOOK, module-type playbook, project policies) | `GOVERNING/README.md` | per-source version + hash |

Frozen AC text is never changed by a plan edit (RUL-04). A contract question is a `STOP-CONTRACT` for the Architect/Director, not a reinterpretation.

## 3. Seats and write permissions (the single permission table; file headers repeat only their owner)

| Seat | May write | May not |
|---|---|---|
| QA Executor | Executor-owned files: `QAM_RECON_REPORT.md`, `QAM_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, `FINDINGS.md` §1 and §3.1, `QAM_CLEANUP_REPORT.md` execution rows (§1–§2 and the "Executed?/Evidence" columns of §3–§4), `evidence/**`, `AUTOMATION/**`, `HANDOFFS/**` (packages, `REVIEW_START_HERE.md` copies, `FILE_INDEX.json`, the receipts table). **Executor-recorded parts of other seats' files:** the Result/Evidence cells of `QAM_PREFLIGHT.md` (never the Architect-authored expectations, owners or authorizations); `QAM_RISK_REQUIREMENTS.md` §3 (its Q1 observations); the `QAM_TEST_PLAN.md` draft and the application of the QA Lead's **exact** amendments recorded in its §8; its own dated entries in `QAM_STATE.md`. **Transcription only when expressly instructed**: the exact supplied approval or certification text into `QAM_APPROVAL.md` / `QAM_CERTIFICATION.md`, attributed to its author with source and date — never a composed, inferred or reconstructed decision | product code, tests, contract files, the Engineer's evidence, `QAM_MANIFEST.md`; composing any approval, disposition, retention decision or verdict; any Git mutation; any deployment |
| Engineer | `QAM_MANIFEST.md` (incl. dated factual amendments §8), `HANDOFFS/ENGINEERING_HANDOFF.md`, its own `QAM_STATE.md` entries; ruled repair paths on `qa/apbm-007b` only | QA results, plan approval, dispositions, certificate |
| QA Lead | `QAM_APPROVAL.md` decisions, dispositions in `FINDINGS.md` §2, retention and cleanup-acceptance decisions in `QAM_CLEANUP_REPORT.md`, `QAM_CERTIFICATION.md`, §1 of `QAM_RISK_REQUIREMENTS.md` (adoption/amendment of the standing wording), its own `QAM_STATE.md` entries | product changes; inventing evidence |
| Architect | this file, `QAM_PREFLIGHT.md` rows, `QAM_RISK_REQUIREMENTS.md` §2, `GOVERNING/`, `PARENT_ENTRY_ROUTING.md`, closeout instruction, its own `QAM_STATE.md` entries | QA results; substituting an engineering-green result for independent QA |
| Director | release references in `QAM_APPROVAL.md` §3/§4; credentials file `.env.qa.local`; all Git actions (commit, branch creation, merge, push); risk decisions; its own `QAM_STATE.md` entries | — (does not have to perform repeatable UI checks) |

Protected paths (never written by any QA seat): `all product/tests/config/dependencies/applied SQL and Engineer records in both repositories; see ../ALLOWED_PATHS.md for Engineer scope`.
Permitted effects on the target: `Q1 source/QA-lane local work only; live effects require Friday plan and Director QA release; E2 budgets do not transfer`. Anything else is `STOP-AUTHORITY`.

Authority rule (playbook §6): being pointed at this folder and asked to start authorizes **Q1 only**, within the declared scope. A folder path by itself never authorizes Q2, product repair, certification, Git mutation or deployment; those require the approval and release recorded in `QAM_APPROVAL.md`, the dispositions in `FINDINGS.md`, and the Director's own actions.

## 4. Target and prerequisites (summary; executable rows in `QAM_PREFLIGHT.md`)

| Item | Value |
|---|---|
| Target environment and how it is resolved | `local-proof builds3100/3101; DEV production-like fixture reads and SCRATCH rehearsals, target identity verified; exact QA effects released after Q1` |
| Roles / identities required | `OWNER_A, OWNER_B, STORE_ADMIN, MEMBER, FOREIGN_OWNER, NEW_ADMIN, NEW_MEMBER, EXISTING_INVITEE, signed-out` — existence verified by `Director private input, Executor verifies in Q1` |
| Test data | `synthetic only; retained007A fixtures preserved; new engineering fixtures labeled; private QA inbox cast in TEST_IDENTITIES.md` |
| Toolchain | `Node22, npm exact lockfiles; installed Next16/Jest30/Playwright1.59.1 reported by source receipt; independently verify actual versions` |
| Credential file (ignored, untracked; Director creates; values never recorded) | `.env.qa.local` with keys `role login identities/passwords and inbox access schema from TEST_IDENTITIES.md; no values` |

## 5. Read order and phase dispatch

Read, in order: `QAM_STATE.md` → this file → the contract and ruling lane (§2) → `GOVERNING/README.md` → `QAM_RISK_REQUIREMENTS.md` → `QAM_MANIFEST.md` + `HANDOFFS/ENGINEERING_HANDOFF.md` (claims) → `QAM_PREFLIGHT.md` → the phase file for the recorded state. Before acting, compare the recorded state's prerequisites with disk and current identity (§15 of the playbook).

| Recorded state in `QAM_STATE.md` | Next owner | What the arriving QA Executor does |
|---|---|---|
| `READY FOR ENGINEERING` | Engineer | Nothing to test yet. Report that engineering is pending and that no handoff exists; do not run preflight against an unfinished candidate. |
| `ENGINEERING COMPLETE — AWAITING QA BRANCH` | Director | Report that the handoff exists and that the Director has not yet committed the completed candidate and created `qa/apbm-007b` at it. Do not start Q1. |
| `READY FOR RECON` | QA Executor | Introduce the QA Executor role briefly; run `QAM_PREFLIGHT.md`; resolve the candidate from the Director's receipt and reconcile it against the handoff inventory; write `QAM_RECON_REPORT.md`; draft `QAM_TEST_PLAN.md`; build the Q1 package (`QAM_PACKAGING.md`); record `Q1 COMPLETE — AWAITING QA LEAD REVIEW`; stop. |
| `Q1 COMPLETE — AWAITING QA LEAD REVIEW` | QA Lead | Return the existing Q1 package and the decision needed. Do not rerun Q1. |
| `Q1 AMENDMENTS REQUESTED` | QA Executor | Apply **only** the exact edits in `QAM_APPROVAL.md` §1 to `QAM_TEST_PLAN.md`, record them in its §8 with the diff, re-bind the plan (new SHA-256), record `Q1 AMENDED — AWAITING QA LEAD BINDING`, return. Material new tests or interpretation changes go back to the QA Lead, not into the plan. |
| `Q1 AMENDED — AWAITING QA LEAD BINDING` | QA Lead | Return the amended plan and its hash; wait. |
| `HOLD` | per the HOLD record | Report the recorded blockers, their owners and the resolution each needs. Do nothing else. |
| `APPROVED — NOT RELEASED` | Director | Name the missing Director release (`QAM_APPROVAL.md` §3). Do not start Q2. |
| `RELEASED FOR Q2` | QA Executor | Verify the approval ↔ candidate binding (`QAM_APPROVAL.md` §2–§3), full HEAD, product identity, target; review the complete candidate→HEAD diff; recheck changeable readiness rows; execute the approved plan; build the Q2 package; record `Q2 COMPLETE — AWAITING ADJUDICATION`. |
| `Q2 COMPLETE — AWAITING ADJUDICATION` | QA Lead | Return the existing Q2 package; do not re-execute, do not classify findings beyond the proposals already recorded. |
| `STOPPED (STOP-*)` | per the stop record | Report the recorded stop, owner and required resolution. Resume only from the recorded safe resume point after the owner records the resolution. |
| `REPAIR RULED — AWAITING COMMIT` | Engineer (repair) then Director (commit) | **Waiting state. Do not retest.** Report the ruling ID, the allowed paths and that the repaired candidate does not exist until the Director commits. |
| `RETEST SCOPE APPROVED — NOT RELEASED` | Director | Report that the QA Lead's Q4 scope approval exists (`QAM_APPROVAL.md` §4) and the Director's release is missing. Do not start Q4. |
| `RELEASED FOR Q4` | QA Executor | Verify, in order: the repaired candidate's identity against the Director's commit receipt; the QA Lead's retest-scope approval in `QAM_APPROVAL.md` §4 and the matching scope in `QAM_TEST_PLAN.md` §7; the Director's release reference. Then re-pin, run the Q4 scope (repair diff + affected ACs + full required regression suite), build the Q4 package, record `Q4 COMPLETE — AWAITING ADJUDICATION`. |
| `Q4 COMPLETE — AWAITING ADJUDICATION` | QA Lead | Return the Q4 package; wait. |
| `VERDICT ISSUED — CLEANUP PENDING` | QA Lead (cleanup authority) → QA Executor | The product verdict exists in `QAM_CERTIFICATION.md` §1–§3. When the QA Lead has recorded the cleanup point and retention decisions in `QAM_CLEANUP_REPORT.md` §0/§3, execute the required cleanup, record evidence, record `CLEANUP EXECUTED — AWAITING ACCEPTANCE`. |
| `CLEANUP EXECUTED — AWAITING ACCEPTANCE` | QA Lead, then Director (durable records commit) | Return the cleanup report; wait. |
| `CLEANUP ACCEPTED — RELEASED TO CLOSEOUT` | Architect | QA work is complete. Report the certificate and that the Architect's closeout instruction is next; do not restart testing or cleanup. |
| `CLOSED` | — | Show the verdict, the merge receipt and the next owner (none). Do not restart anything. |
| **Unknown, missing or inconsistent state** (vocabulary not in `QAM_STATE.md`; identities that contradict disk; a prerequisite record absent) | the seat that owns the inconsistent record | Return the exact discrepancy (expected vs found, with paths) and the next owner. Do not guess, do not repair the record, do not proceed. |
| Wrong folder / wrong role | — | Explain the correct module-relative entry (`PARENT_ENTRY_ROUTING.md`); ask only if intent remains ambiguous. |

## 6. Outputs and return

Every Q1 return, Q2 return, material stop and repair/retest return produces one indexed ZIP at `HANDOFFS/APBM-007B-CYBER-PHARMA_<PHASE>_REVIEW_<ATTEMPT>.zip` per `QAM_PACKAGING.md`, with its absolute path, member count, SHA-256 and the exact decision requested. The copy of `QAM_STATE.md` inside a package is the immutable pre-export snapshot; the completed ZIP's hash is recorded only in the external receipt and the subsequent live state entry. Repository-required response/session records stay at their governed paths and are indexed, not moved.

## 7. Engineer completion duties (pointer)

The Engineer completes `QAM_MANIFEST.md` (including the complete change inventory at handoff: committed since baseline, staged, unstaged, untracked) and `HANDOFFS/ENGINEERING_HANDOFF.md` as part of the original engineering assignment (playbook §7), before the Director commits, and records `ENGINEERING COMPLETE — AWAITING QA BRANCH` in `QAM_STATE.md`. The Engineer fills no QA result, decision or certificate.

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*

## APBM multi-repo adaptation

Every candidate/retest binding names BOTH full commits and complete diffs. The current QAM is on HOLD for frozen-pack review; READY FOR ENGINEERING is entered only after review requirements and E2 release are satisfied. Keep independent one-shot lifecycle and continue unaffected checks. Current QA Lead is Friday; standing requirements remain preserved with their original Fable adoption attribution. No template label constitutes current Friday approval.
