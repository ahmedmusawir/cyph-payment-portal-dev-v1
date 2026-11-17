# QAM_CLEANUP_REPORT — `APBM-007B-CYBER-PHARMA` (required closure operation)

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/QAM_CLEANUP_REPORT.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §14 (preserved in full by RUL-03) and §12. **Owners: QA Lead records the cleanup point (§0), the retention decisions (§3, Decision column) and the acceptance (§4); the QA Executor executes under that recorded authority and records §1, §2 and the Executed?/Evidence columns.** Cleanup is a closure operation, not another planning or testing campaign. It is **required**; retention is never "keep everything". Only cleanup steps tied to abandoning the QA branch or transferring work back to the engineering branch do not exist here (RUL-02/RUL-03).
>
> **Sequence:** accepted product verdict (`QAM_CERTIFICATION.md` §1–§3, issued first and independent of cleanup) → required cleanup (this file) → cleanup acceptance (§4) and durable records committed by the Director → release to Architect closeout (`QAM_CERTIFICATION.md` §4).

## 0. Authority for this cleanup (QA Lead)

| Field | Value |
|---|---|
| Product verdict issued (reference to `QAM_CERTIFICATION.md` §1; verdict text is not repeated here) | NOT RECORDED |
| Cleanup point approved by / at | NOT RECORDED |
| Applicable cleanup policy (governing bodies; local rule names) | `NOT RECORDED — owning seat authors at its phase` |
| Director-reported items (e.g. password rotation) — recorded as reported, not evidenced | NOT RECORDED |

## 1. Routine phase-exit hygiene (preauthorized; done at each phase exit; Executor)

| Item | Done at Q1 exit | Done at Q2 exit | Done at Q4 exit (if Q4 ran) | Evidence |
|---|---|---|---|---|
| Owned browsers closed | NOT RECORDED | PASS tracked contexts closed | NOT RECORDED | AUTOMATION/Q2 driver finally/close paths and exit receipts; no unrelated browser killed |
| Owned QA servers / processes stopped | NOT RECORDED | PASS | evidence/Q2/02/phase_exit_processes.json; own3100/3101, listener, local DB/Auth only; Director PIDs unchanged |
| Declared transient auth state removed | NOT RECORDED | RETAINED PRIVATE under current fixture-hold instruction; browser contexts closed | NOT RECORDED | No remote Auth revocation/identity deletion; private0600 states retained until Friday retention ruling |

## 2. Credential and auth-state cleanup (Executor; sequence matters; record the actual order)

| Step | Action | Result | Evidence |
|---|---|---|---|
| 1 | Value scan of retained outputs **while the credential source still exists** (scanner validated with a synthetic fixture and a clean control) | PASS pre-export selected QA source/evidence;82 private values checked in memory; gate repeated for final export | EXPORT_VALIDATION.json; exporter external receipt |
| 2 | Resolve / quarantine actual leaks without publishing them (safe counts and locations only) | No hits in selected export; raw private logs/auth states excluded under0700/0600 | EXPORT_VALIDATION.json; private_retention_modes.json |
| 3 | Delete `.env.qa.local` and owned auth state under the declared authority | NOT RUN — retained under current Friday fixture-hold instruction | phase_exit_processes.json; no final retention/cleanup ruling yet |
| 4 | Verify removal (already absent = verified absent, not newly deleted) | Not removed; private0700/0600 presence verified | evidence/Q2/02/private_retention_modes.json |
| 5 | Pattern-scan retained outputs and the final export | PASS pre-export selected QA source/evidence; final staged/expanded gate required by exporter | EXPORT_VALIDATION.json and external receipt |

Do not preserve credential values or their hashes as evidence. After deletion, do not claim a new value scan happened; record the actual sequence and the earlier source hashes of the scan reports.

## 3. Retention decision (QA Lead) and execution (Executor)

| Item | Decision (KEEP / REMOVE / QUARANTINE) — QA Lead | Reason — QA Lead | Executed? — Executor | Evidence — Executor |
|---|---|---|---|---|
| Durable evidence package sufficient for certification, reproduction and audit (paths) | NOT RECORDED | | | |
| Failed attempts (preserved when justified) | NOT RECORDED | | | |
| Useful helpers under `AUTOMATION/` | NOT RECORDED | | | |
| Disposable generated debris (builds, dependencies, caches, raw traces, browser profiles, disposable mirrors) | NOT RECORDED | | | |
| Unrelated processes / active editor recovery files (not automatically deleted) | not touched | | | |
| Protected recovery/session files (require their own authority) | not touched | | | |

## 4. Final state and cleanup acceptance

| Field | Value | Owner |
|---|---|---|
| Product / tests / contract unchanged during cleanup (evidence: diff) | NOT RECORDED | Executor |
| Working tree after cleanup (`git status --porcelain`) | NOT RECORDED | Executor |
| Cleanup **accepted** (date, QA Lead) | NOT RECORDED | QA Lead |
| Durable records committed (Director; commit SHA) | NOT RECORDED | Director |
| Released to Architect closeout (recorded in `QAM_CERTIFICATION.md` §4) | NOT RECORDED | QA Lead |

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*

### Cody Q2 phase-exit execution record

Friday/Director's current release explicitly requires stopping only owned apps/listener/local containers and keeping every Scratch/sandbox/identity fixture, including F001, until retention is ruled. Executed process hygiene only; phase_exit_processes.json all_owned_stopped=true, Director ports/PIDs unchanged, remote/provider/Auth fixture mutations0. Containers stopped and data kept; no SQL context disable, provider deletion or further refund. Protected F001 verified amount_refunded0 in fixture_inventory.json.

Credential/auth-state final removal and formal cleanup sequence in section2 remain NOT RUN pending owning-seat authority; their existing Decision/Acceptance fields remain unfilled. Actual-value and pattern scans of selected retained QA outputs/export performed while private sources exist, with poison/clean controls; exporter validation supplies safe counts/locations only, no credential hashes. Raw private logs/states remain0700/0600, excluded from archive. This entry is an execution record, not retention decision, cleanup acceptance or certificate.
