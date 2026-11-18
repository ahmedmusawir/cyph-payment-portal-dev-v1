# QAM_CLEANUP_REPORT — `APBM-007B-CYBER-PHARMA` (required closure operation)

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/QAM_CLEANUP_REPORT.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §14 (preserved in full by RUL-03) and §12. **Owners: QA Lead records the cleanup point (§0), the retention decisions (§3, Decision column) and the acceptance (§4); the QA Executor executes under that recorded authority and records §1, §2 and the Executed?/Evidence columns.** Cleanup is a closure operation, not another planning or testing campaign. It is **required**; retention is never "keep everything". Only cleanup steps tied to abandoning the QA branch or transferring work back to the engineering branch do not exist here (RUL-02/RUL-03).
>
> **Sequence:** accepted product verdict (`QAM_CERTIFICATION.md` §1–§3, issued first and independent of cleanup) → required cleanup (this file) → cleanup acceptance (§4) and durable records committed by the Director → release to Architect closeout (`QAM_CERTIFICATION.md` §4).

## 0. Authority for this cleanup (QA Lead)

| Field | Value |
|---|---|
| Product verdict issued (reference to `QAM_CERTIFICATION.md` §1; verdict text is not repeated here) | Friday, 18 November 2026; supplied verdict/acceptance receipt in QAM_CERTIFICATION.md §1 |
| Cleanup point approved by / at | Friday, 18 November 2026; Tony acceptance 13:40 Asia/Dhaka, quoted below |
| Applicable cleanup policy (governing bodies; local rule names) | `NOT RECORDED — owning seat authors at its phase` |
| Director-reported items (e.g. password rotation) — recorded as reported, not evidenced | NOT RECORDED |

### Friday cleanup authority —18November2026; transcribed by Cody

Verdict issued: `QAM_CERTIFICATION_APBM-007B_2026-11-18.md, supplied SHA-256 3d897cf99575c37c429200446df6315fff5b94f3c384c4a9044f42a2e24ce70f`, QAM_CERTIFICATION.md§1 supplied-verdict receipt. Cleanup point approved by Friday,18November2026. Director Tony acceptance,18November2026,13:40Asia/Dhaka, verbatim:

> I accept KR-1 through KR-6 in the APBM-007B Gate Q certificate dated 18 November 2026. Proceed with cleanup exactly as section 7 directs. Preserve the evidence and durable QA records. No refunds or changes to Director-owned resources. This acceptance does not authorize deployment or DEV migration 0070 apply.

Applicable order: value scan while credential source exists; resolve/quarantine leaks without publishing; authorized removals; verify removal; pattern-scan retained outputs. No refunds; no Director-owned resources/files/processes, DEV, product/tests/contracts, deployment or DEV0070apply. Sandbox objects require their own exact QA run-ID tag; no inferred ownership from association alone. Exact source certificate§7 requested; below scope is the explicit authority supplied in this cleanup instruction.

## 1. Routine phase-exit hygiene (preauthorized; done at each phase exit; Executor)

| Item | Done at Q1 exit | Done at Q2 exit | Done at Q4 exit (if Q4 ran) | Evidence |
|---|---|---|---|---|
| Owned browsers closed | NOT RECORDED | PASS tracked contexts closed | NOT RECORDED | AUTOMATION/Q2 driver finally/close paths and exit receipts; no unrelated browser killed |
| Owned QA servers / processes stopped | NOT RECORDED | PASS | evidence/Q2/02/phase_exit_processes.json; own3100/3101, listener, local DB/Auth only; Director PIDs unchanged |
| Declared transient auth state removed | NOT RECORDED | RETAINED PRIVATE under current fixture-hold instruction; browser contexts closed | NOT RECORDED | No remote Auth revocation/identity deletion; private0600 states retained until Friday retention ruling |

## 2. Credential and auth-state cleanup (Executor; final authorized sequence)

| Step | Action | Result | Evidence |
|---|---|---|---|
| 1 | Actual-value scan while credential source still existed | PASS initial and final; final checked 96 private values in memory across 2,541 files, including nine expanded prior ZIPs; poison and clean controls PASS; zero actual-value hits | evidence/CLEANUP/01/value_scan_initial.json; value_scan_final.json |
| 2 | Resolve/quarantine leaks | No actual-value leak found. QA instrument schema/type errors corrected; failed attempt retained without counter reset | instrument_notes.json; runs/cleanup-remote_attempt01_receipt.json |
| 3 | Remove private credentials and owned transient state after scan | Executed exact allowlist: private run directory, .env.qa.local, auth/link/HAR/trace/profile state, owned build/dependency/browser lane and redundant temporary stages/helpers | local_plan.json; local_execution.json |
| 4 | Verify absence and preservation | All 31 declared paths absent, including already-absent paths distinguished; all nine old archives unchanged; both product HEADs and tracked files outside QAM unchanged | local_execution.json; phase_exit.json |
| 5 | Pattern-scan retained records and expanded prior archives after deletion | PASS with two exact-hash historical-diff email-only exceptions (21 matches: public support/sender text and Python decorator tokens); zero blocking hits. New export separately scanned with zero hits | pattern_scan_records.json (raw flags retained); pattern_scan_retained.json; package receipt |

No credential values or their hashes are retained. No new actual-value scan is claimed after source deletion. Filesystem removal is verified; storage-level secure erasure and backup deletion are not asserted.

## 3. Retention decision (QA Lead) and execution (Executor)

| Item | Decision (KEEP / REMOVE / QUARANTINE) — QA Lead | Reason — QA Lead | Executed? — Executor | Evidence — Executor |
|---|---|---|---|---|
| Durable evidence package sufficient for certification, reproduction and audit (paths) | NOT RECORDED | | | |
| Failed attempts (preserved when justified) | NOT RECORDED | | | |
| Useful helpers under `AUTOMATION/` | NOT RECORDED | | | |
| Disposable generated debris (builds, dependencies, caches, raw traces, browser profiles, disposable mirrors) | NOT RECORDED | | | |
| Unrelated processes / active editor recovery files (not automatically deleted) | not touched | | | |
| Protected recovery/session files (require their own authority) | not touched | | | |

### Friday retention decisions —18November2026; transcribed by Cody

| Item | Decision — Friday | Execution / evidence — Cody |
|---|---|---|
| Evidence packages, findings, plans, approvals, execution reports; every attempt including failures; AUTOMATION helpers | KEEP | KEPT; nine prior archives byte-identical, all attempts and automation retained. local_execution.json. |
| SCRATCH business and claim rows as they are; QA sign-in identities | KEEP | KEPT; four whole-row digest/count comparisons unchanged; eight Auth identities verified present. remote_verification.json. |
| Every Stripe sandbox object carrying the QA run ID: cancel subscriptions, delete test clocks, void open invoices; including F-Q2-001 store subscription | REMOVE | EXECUTED WITH EXCEPTIONS: six tagged subscriptions canceled; zero tagged open invoices needed voiding. Parent/clock deletion exceptions listed below and by ID in remote_execution.json. No refund. |
| Prepared transfer and its buyer reservation | REMOVE / cancel | EXECUTED: transfer canceled, held buyer reservation released; business/history digests unchanged. remote_verification.json. |
| SCRATCH billing-clock test context | REMOVE / disable | EXECUTED: four QA contexts disabled, verified read-only. remote_verification.json. |
| All QA sessions | REMOVE / revoke | EXECUTED: all eight identities have zero sessions and active refresh tokens; identities retained. remote_verification.json. |
| Private QA credential file, auth states, links, HAR, raw traces, browser profiles | REMOVE after final value scan | EXECUTED after final actual-value scan; all declared private paths verified absent. local_execution.json. |
| QA builds, dependency copies, local containers and temporary lanes | REMOVE | EXECUTED: exact owned paths removed, redundant helper sources retained under AUTOMATION; owned apps/listener and containers already absent, verified. local_execution.json; phase_exit.json. |
| Director processes/files; DEV; product code; tests; contract files | NOT TOUCHED | No authority to mutate. |

### Final cleanup execution — Cody, 18 November 2026

Remote execution: `evidence/CLEANUP/01/remote_execution.json`; independent read-back: `remote_verification.json` (PASS). Six individually marked subscriptions canceled without proration/refund, including F-Q2-001. Four QA billing-clock contexts disabled. Prepared transfer canceled and its one held reservation released. All eight QA identities kept; all server sessions and active refresh tokens verified zero. Previously issued JWTs are not claimed cryptographically invalid before their expiry. All four business/claim table counts and whole-row digests match before/after. Exact ledger-70 proof is carried from Q4/02 entry; cleanup applied no migration. DEV was not accessed for mutation.

Exceptions, with exact IDs in `remote_execution.json`:

- Two product-created customer/subscription pairs carry old `apbm007a` metadata rather than this QA run marker. They remain unchanged under the explicit tagging hard limit.
- Six tagged customers remain because deleting them would detach untagged card payment methods. Two tagged clocks remain because their deletion cascades through those customers. One additional clock lacks the run marker. No tags were retroactively changed to evade this condition.
- Three tagged Checkout sessions were already expired. Stripe has no deletion API for terminal Checkout history. Paid financial history remains; refunds are forbidden. No tagged open invoice required voiding.
- The temporary `/tmp/apbm007b-o1-cast.json` does not match this QA cast and is excluded as unproven ownership; no Director file is removed.
- Exact certificate sections 1–6 have not been supplied or found. Supplied verdict and Director acceptance are recorded verbatim; exact risk text is not reconstructed. Requested source remains outstanding.

The documented O1 campaign marker `qa-20261117-c414` is bound to this run by the original Q2 state receipt. It is accepted only on the known fixture IDs; the specifically authorized F-Q2-001 subscription bears this marker. Generic `apbm007b_qa` or `apbm007a` tags alone are not accepted as ownership.

Private-file deletion and owned build/lane removal completed after the final actual-value scan. Per-path execution and absence checks are recorded in `local_execution.json`. Post-deletion pattern checks of retained records and expanded older archives passed with the two disclosed historical-diff exceptions; the new package is separately indexed and pattern-scanned. No limit increased; cumulative counters remain in `evidence/CLEANUP/01/effects/counters.json`.

## 4. Final state and cleanup acceptance

### Friday acceptance — transcribed by Cody from the Director/QA Lead instruction

Cleanup ACCEPTED, 18 November 2026, Friday (QA Lead), with the recorded exceptions: sandbox customers and clocks retained; two apbm007a pairs untouched; terminal checkout sessions and paid history retained; one unproven temporary file left; issued tokens valid until expiry; no secure-erasure claim.


| Field | Value | Owner |
|---|---|---|
| Product / tests / contract unchanged during cleanup (evidence: diff) | VERIFIED: both certified HEADs unchanged; no tracked changes outside QAM, both checkouts. local_execution.json | Executor |
| Working tree after cleanup (`git status --porcelain`) | QA-owned records/helpers/evidence remain modified/untracked; OB clean. Exact status in local_execution.json and final_worktree.json. No Git write performed | Executor |
| Cleanup **accepted** (date, QA Lead) | ACCEPTED, 18 November 2026, Friday; exact acceptance and exceptions above | QA Lead |
| Durable records committed (Director; commit SHA) | NOT RECORDED | Director |
| Released to Architect closeout (recorded in `QAM_CERTIFICATION.md` §4) | NOT RECORDED | QA Lead |

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*

### Cody Q2 phase-exit execution record

Friday/Director's current release explicitly requires stopping only owned apps/listener/local containers and keeping every Scratch/sandbox/identity fixture, including F001, until retention is ruled. Executed process hygiene only; phase_exit_processes.json all_owned_stopped=true, Director ports/PIDs unchanged, remote/provider/Auth fixture mutations0. Containers stopped and data kept; no SQL context disable, provider deletion or further refund. Protected F001 verified amount_refunded0 in fixture_inventory.json.

Credential/auth-state final removal and formal cleanup sequence in section2 remain NOT RUN pending owning-seat authority; their existing Decision/Acceptance fields remain unfilled. Actual-value and pattern scans of selected retained QA outputs/export performed while private sources exist, with poison/clean controls; exporter validation supplies safe counts/locations only, no credential hashes. Raw private logs/states remain0700/0600, excluded from archive. This entry is an execution record, not retention decision, cleanup acceptance or certificate.

## Executor Q4 STOP-PRIVACY hygiene —18November2026

Only owned apps3100/3101, listener52858 and already-owned local containers stopped; Director3000/3001/3457 left running. Verified evidence/Q4/01/privacy_stop_process_exit.json. No SCRATCH/provider/Auth fixture cleanup, password change or session revocation. All fixtures retained including protectedF001unrefunded, read-only proof fixture_inventory_stop04.json. Diagnostic permission containment0700/0600 and futureQAumask0077 performed; this is not retention disposal or formalcleanupacceptance. QA Lead retention/acceptance cells remain unchanged.

## Cody Q4 phase-exit execution —18November2026

Evidence evidence/Q4/01/phase_exit_final.json verifies only owned3100/3101apps/listener and named localQ4containers stopped, Director3000/3001/3457 untouched. Remote/Auth/business/provider fixtures retained; protectedF001amount_refunded0 in fixture_inventory_final.json. Director authorized exception only for two QA password/session recoveries and diagnostic deletion; no other retention disposal. Containers/builds/private states remain retained0700/0600. This is execution hygiene, not formal cleanup acceptance or a retention/verdict decision; owning-seat cells remain unchanged.


## Cody Q4/02 phase-exit execution —18November2026

Onlyowned3100/3101appsandlistenerstopped, verifiedevidence/Q4/02/phase_exit.json. Directorprocessesuntouched. No containersoperatedthisround; no remote/Auth/providerfixturecleanuporrefund. Allretainedincludingnewsource/buyerreservation/outcomeandF001unrefunded. Authorizedprofilepasswordchanges recordedbyfieldnameonly, latestprivate0600valuekept. RawprivateHAR/screenshots/authinputsexcluded. Formalcleanupacceptance/retentioncellsremainowningseat, notfilledbyCody.


Final executor state: **CLEANUP EXECUTED — AWAITING ACCEPTANCE**. Exceptions are disclosed above; Friday owns cleanup acceptance and release to closeout. No deployment, DEV migration, refund or Director-resource mutation occurred. Owned listener is stopped; Director may restart his listener.
