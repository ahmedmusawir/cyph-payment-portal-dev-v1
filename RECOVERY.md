# Recovery State — cyph-stripe-subscription-portal-v1

## ▶ APBM007A CLOSEOUT PREPARED — Director merge/push pending (updated 2026-11-16, Asia/Dhaka) — read this first
- **Status:** Gate Q PASS WITH KNOWN RISK (Friday) on OwedBook `c976968` / portal `54a56b5` (product `6ed09ff`). r06 U-1/U-2/U-3 committed and Director-accepted, not QA-certified. Q5 cleanup complete (`af1b4af` in OwedBook). Both checkouts clean on `qa/apbm-007a`: OwedBook `af1b4af`, portal `1a39132`.
- **Record:** OwedBook module `CLOSEOUT_REPORT.md`; Git handoff `EVIDENCE/CLOSEOUT/commit/COMMIT_HANDOFF.md`.
- **WAITING FOR TONY:** in each repository, the closeout records commit, then fast-forward `main`, merge `qa/apbm-007a` with `--no-ff`, push normally, and send back the printed SHAs. 007A becomes CLOSED once both are verified. No deployment.

## ▶ APBM007A FINAL UI REPAIR r06 — U-1 + U-2 + U-3 DELIVERED (updated 2026-11-16, Asia/Dhaka) — read this first
- **Status:** OwedBook admin nav (route-driven), OwedBook billing details (from `owner_billing_overview`), and password show/hide in both apps; uncommitted on `qa/apbm-007a` (OwedBook `c976968`, portal `54a56b5`). Tests 309/309 and 468/468; typecheck, lint, both production builds and bundle scans clean; production-build browser walk 73/73 (fixture proof).
- **Record:** OwedBook module `EVIDENCE/E2/r06/REPAIR_U-1_U-2_U-3.md`; commit handoff `EVIDENCE/E2/r06/commit/COMMIT_HANDOFF.md`; review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_UI_REPAIR_REVIEW_r06.zip`.
- **Director rulings recorded:** Mission Control out of 007A scope; placeholders accepted for local use, must be resolved before any external or staging exposure.
- **QA work:** 9,805 OwedBook paths backed up to `~/APBM007A_QA_BACKUPS/u123_r06_20261116_150305/` and verified unchanged.
- **WAITING FOR TONY:** commits by the r06 lists (portal product + records, OwedBook product + records), rebuild both apps; then Friday binds and Cody retests. No deployment.

## ▶ APBM007A Q4 REPAIR r05 — F-Q4-003 + F-Q4-002 + F-Q4-004 DELIVERED (updated 2026-11-16, Asia/Dhaka) — read this first
- **Status:** provisioning concurrency (per-call lease, fenced writes, identity provenance), access-email claim, and stale-checkout settlement repaired in `provisioning.ts`, `checkout.ts`, `accessEmail.ts` plus tests, uncommitted on `qa/apbm-007a` (base `93add6f`). Portal 463/463; typecheck, lint, production build and bundle scan clean; real SCRATCH 6/6.
- **Record:** OwedBook module `EVIDENCE/E2/r05/REPAIR_F-Q4-003_F-Q4-002_F-Q4-004.md`; commit handoff `EVIDENCE/E2/r05/commit/COMMIT_HANDOFF.md`; review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REPAIR_REVIEW_r05.zip`.
- **DEV operation 25acbfb9:** do NOT touch. QA recovers it under AC-038 after the rebuild (REPAIR §6).
- **QA work:** 6,613 OwedBook paths backed up to `~/APBM007A_QA_BACKUPS/q4_r05_20261116_124823/` and verified unchanged.
- **WAITING FOR TONY:** three commits by the r05 lists, then rebuild and restart the portal; then Friday binds and retests. No deployment.

## ▶ APBM007A Q4 REPAIR r04 — F-Q4-001 / AC-011 DELIVERED (updated 2026-11-16, Asia/Dhaka) — read this first
- **Status:** checkout lost-answer recovery repaired in `src/server/checkout.ts` plus a new test file, uncommitted on `qa/apbm-007a` (base `357c274`). Portal 444/444, typecheck, lint, production build and bundle scan clean; rolled-back SCRATCH proof PASS.
- **Record:** OwedBook module `EVIDENCE/E2/r04/REPAIR_F-Q4-001.md`; commit handoff `EVIDENCE/E2/r04/commit/COMMIT_HANDOFF.md`; review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REPAIR_REVIEW_r04.zip`.
- **QA work:** Cody's 3,422 OwedBook paths backed up to `~/APBM007A_QA_BACKUPS/q4_r04_20261116_114741/` and verified unchanged.
- **WAITING FOR TONY:** three commits by the r04 lists (verifier after each), then rebuild and restart the portal on the repaired candidate; then Friday binds and retests. No deployment before 007B.

## ▶ APBM007A Q2 REPAIR r03 — F-Q2-001 + F-Q2-002 DELIVERED (updated 2026-11-16, Asia/Dhaka) — read this first
- **Branch rule:** repairs stay on `qa/apbm-007a` (QAM §11, RRM §§7/9). Never ask for a switch back to `apbm-007a` or a worktree once QA has started.
- **Status:** registration-to-review fix (`PharmacyStepView.tsx`) and both-field undo fix (`billing.ts`) plus three test files, uncommitted in this checkout on `qa/apbm-007a` (base `9d938f6`). Portal 429/429; typecheck, lint, production build and bundle scan clean; production-browser walk reached review with the server quote and stopped before checkout.
- **Record:** OwedBook module `EVIDENCE/E2/r03/REPAIR_F-Q2.md`; commit handoff `EVIDENCE/E2/r03/commit/COMMIT_HANDOFF.md`; review ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q2_REPAIR_REVIEW_r03.zip` (copy in Downloads).
- **QA work:** Cody's 5,011 uncommitted OwedBook paths backed up to `~/APBM007A_QA_BACKUPS/q2_r03_20261116_100605/` and verified unchanged. QA helper processes `Q2-a01/new-owner*.cjs` left running for QA. Friday's Q2 a01 FAIL stands.
- **DEV effect left in place:** 1 synthetic draft (`eng.proof.r03@example.test`, NPI 1373398746) with its NPI hold. Do not delete without a Director disposition.
- **WAITING FOR TONY:** three commits by the r03 lists (verifier after each), then Cody binds the pair and retests. No deployment before 007B.

## ▶ APBM007A E2 r02 — F-Q1-01 REPAIR + AMENDMENT A1 DELIVERED (updated 2026-11-13 13:50, Asia/Dhaka) — read this first
- **Status:** webhook recovery repaired (portal, 8 paths, uncommitted on `apbm-007a`); Amendment A1 recorded in the OwedBook module. Portal 412/412, typecheck/lint/build clean. No schema change; no live effect except one read-only DEV query.
- **Record:** module `EVIDENCE/E2/r02/REPAIR_F-Q1-01.md`; commit handoff `EVIDENCE/E2/r02/commit/COMMIT_HANDOFF.md` (lists, hashes, verifier).
- **QA (Cody) paused.** Cody's 37 OwedBook files sit uncommitted in the working tree (backed up by Tony). Never edit, stage or move them.
- **WAITING FOR TONY:** commit by the r02 lists (two commits per repo, verifier after each), then return checkouts to QA and rebind the candidate pair. No deployment before 007B.

## ▶ APBM007A E2 — ENGINEERING RETURN DELIVERED, webhook FAIL CLOSED (updated 2026-11-13 10:30, Asia/Dhaka) — read this first
- **Status:** E2 code complete, DEV migrated (0053–0060), integrated proof done. B4 webhook FAIL (12 Nov) CLOSED 13 Nov: two signed events processed, mirror followed, OWNER_1's subscription left ACTIVE. Third defect fixed (undo idempotency key). Everything UNCOMMITTED on `apbm-007a` in both repos — Git is Tony's.
- **Return:** module `EVIDENCE/E2/r01/ENGINEERING_HANDOFF.md`; ZIP `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r02.zip` (SHA-256 0e395674…fc45d75; also in Downloads; r01 kept).
- **Still NOT RUN:** brand-new owner (gap; no identity authorised), signed-out existing identity, declined card, test-clock renewal, email click, only-card removal; checkout/invoice webhook events not redelivered on DEV.
- **13 Nov 11:00 — commit handoff ready:** OwedBook module `EVIDENCE/E2/r01/commit/COMMIT_HANDOFF.md` (lists, hashes, commands, verifier). Tony commits by the lists — no blanket add. Q1 carry-over: `ENGINEERING_HANDOFF.md` §11.
- **WAITING FOR TONY:** the commit (then rerun `verify_commit.py` after each commit), decisions on the NOT RUN cases, then independent Q1. No new checkout or identity without his word. No deployment before 007B.
- **Work lane:** `/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/APBM007A_E2_WORK/r01/` (proof harness in `proof/`; private screenshots there — never package them).
- **Never:** start/stop servers outside QA testing; touch :3457; print or export credentials; reset a password; mutate Git; load samples; deploy.

## ▶ Resume here (updated 2026-10-30 11:32, Asia/Dhaka)
- **Status:**
  - Gate Q **PASS** (JARVIS / QA Lead) for the frozen snapshot (manifest `f7181d3c…e9ab`).
  - **Bound** to `f27261734fd0a3ac96253aa6c55e3b9e911125a8`; binding-receipt docs commit `037a7cb`.
  - **Director merged and pushed:** `main` = `b26b4dbc619bdd78f1ec4a58cc2551e806ac4a2d` (merge of `b1fbdda` + `037a7cb`), equal to `origin/main`. The QA branch and `origin/qa/…` are at `037a7cb`.
  - Read-only check of `main`: helper match true, 0 mismatches, 0 extra inputs; tree identical to the QA branch.
  - Deploy/Gate D **NOT DONE**.
- **Next:** nothing is open for Engineering. Deployment and Gate D are separate and Director-scoped. If the module records should carry the merge SHA, that needs a Director/Architect request; the integration record is Director-owned.
- **Preserved:** R5-O03 accepted nonblocking (strict assertion FAILED); C08 out of scope; Tony's manual acceptance; Coach pending; the decision's limitations. `setActivationPlan` cleanup deferred.
- **Never touch:** servers on :3000 and :3457; Cody's `/tmp/cody-r6-*`; `.env*.local`. No Git by me.

Last action (2026-11-03 10:18): **DEPLOYED `cyph-sub-portal-prod`** (staging, us-east1, public) → https://cyph-sub-portal-prod-hr465ynfuq-ue.a.run.app. Build `d33f2b18-4141-4275-9225-22878b39d253`; invoker read-back public; smoke OK. Domain mapping cyph-payment.cyberizedev.com created; DNS matches; **certificate pending**. Created: runtime SA, service, mapping. OwedBook/Mission Control untouched. Deploy files uncommitted (Tony's Git). Report `agent_docs/RESPONSES/response_2026-11-03_101856_deploy-result.md`.
Update 10:33: certificate provisioned; **https://cyph-payment.cyberizedev.com live** (/login 200, guard OK).
Pending: Tony commits deploy files. Supabase redirect allowlist deferred. Gate D NOT DONE.

Last action (2026-11-03 09:59): **next-deploy-auto v1.3 round 2: Phase 1 done, plan PENDING APPROVAL.** Target cyberize-nextjs-staging/us-east1, service cyph-sub-portal-prod, public, domain cyph-payment.cyberizedev.com (DNS by Tony; mapping not done). Plan `agent_docs/RESPONSES/response_2026-11-03_095928_auto-plan.md`. No files generated, no cloud change.
Pending: Tony approves → Phase 2 (upload listing must pass after .gcloudignore or stop).

Last action (2026-11-03 09:23): **next-deploy-auto v1.3, round 2: Phase 0 + intake.** Created root `stark-deploy.yaml` (unfilled). Login valid. No deploy files, cloud change or Git. Report `agent_docs/RESPONSES/response_2026-11-03_092313_deploy-intake-r2.md`.
Pending: Tony fills project_id, invoker, Supabase public URL + publishable key → says "config ready" → Phase 1 + approval summary.

Last action (2026-11-03 09:14): **next-deploy-auto v1.2, round 1: Phase 0 recon + intake only.** No config, deploy files, cloud change or Git action. Report `agent_docs/RESPONSES/response_2026-11-03_083651_deploy-intake.md`; ledger `agent_docs/SKILL_ISSUES_LEDGER_next_deploy_auto.md` (2 rows). gcloud token expired.
Pending: Tony refines the skill, then restarts the run from scratch (round 2).

Last action (2026-10-30 11:32): **Main merge verified (read-only).** `main` `b26b4db` (merge of `b1fbdda` + `037a7cb`) = `origin/main`; `f272617` is an ancestor. Helper on `b26b4db`: match true, 0 mismatched, 0 additional. The tree equals the QA branch tip `037a7cb`. Only RECOVERY.md, the session file and a response file changed locally (uncommitted).

Last action (2026-10-30 11:23): **Commit binding recorded.** Tony's commit `f27261734fd0a3ac96253aa6c55e3b9e911125a8` verified read-only: helper exit 0, match true, 0 mismatched/missing, 0 additional inputs; committed set = reviewed 1,441-path list; nothing outside the filter that can reach the build changed. The Gate Q PASS snapshot is bound to it. Pointers updated. No product change; no test campaign.
Pending: Tony's documentation commit (receipt + pointers) and push. Deployment/Gate D NOT DONE.

Last action (2026-10-30 10:59): **Documentation closeout** after **Gate Q PASS** (JARVIS / QA Lead) for the frozen snapshot: base `d6fe678` + uncommitted repairs through REPAIR_006, manifest `f7181d3c…e9ab`, plan `9017fa6d…4987`. R5-O03 retained as nonblocking (strict assertion FAILED, not repaired).
  Decision installed unchanged at module `QAM/HANDOFFS/CYPH_SUBSCRIPTION_PORTAL_GATE_Q_DECISION_2026-10-30.md`; records reconciled; pre-commit comparison 168/168 match, 0 extra inputs. Report: module `EVIDENCE/DOCUMENTATION_CLOSEOUT_001.md`.
Pending: Tony commits the reviewed path list (`EVIDENCE/CLOSEOUT_001_COMMIT_PATHS.txt`) → read-only binding check with `QAM/AUTOMATION/repair006/verify-commit-inputs.py <FULL_SHA>` → receipt `QAM/HANDOFFS/COMMIT_BINDING_RECEIPT_001.md` (currently PENDING) → Tony pushes. No owned servers running.
Next step: binding verification once the full commit SHA is supplied. Deployment/Gate D NOT DONE. Coach confirmations pending.

Last action (2026-10-30 09:25): **REPAIR_006 (R-014 addendum 1)**, JARVIS dispatch after Cody's REPAIR_005 RETEST_001.
  C06 reads the payment phase before the activation record; paid never reads as unpaid/failed/retryable; nothing-charged shows its terminal notice. Resend needs paid + setup ready. R5-O03 recorded (Lead), not repaired.
  Uncommitted on `d6fe678` with everything since. build 0 · tsc 0 · Jest 248/248 · Cody's oracle 230/1 (1 = R5-O03; before 226/5) · his readers 5/5 (before 1/4)
  · new spec 6/6 · public + Gate M public 156/156 · Gate M 236/0.
  Report: module `EVIDENCE/REPAIR_006_ENGINEERING_REPORT.md` · ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_006_REVIEW.zip` (+ `~/Downloads/`).
Pending: JARVIS review → Tony commits → Cody retests R5-F01/R5-F02. No owned servers running.
Next step: independent retest → JARVIS disposition. Engineering does not self-certify.

Last action (2026-10-30 07:34): **REPAIR_005 (R-014)**, JARVIS dispatch after Cody's REPAIR_004 RETEST_001.
  The checkout record governs the payment (`paymentPhase`): a stale activation flag never confirms a closed checkout, discards an unknown one or reverses a paid one.
  Refresh advances only processing/paid-setting-up; resume needs an abandoned/declined checkout; nothing-charged clears the activation; C06 renders from the phase. Old flags retained, no storage bump.
  Uncommitted on `d6fe678` with everything since. build 0 · tsc 0 · Jest 240/240 · Cody's service probes 46/46 (before 43/3) · his R4 browser cases pass (before failed)
  · new Jest 7/7 · new spec 4/4 · matrix 224 cells (157 refusals, all unchanged) · affected regression: see report.
  Report: module `EVIDENCE/REPAIR_005_ENGINEERING_REPORT.md` · ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_005_REVIEW.zip` (+ `~/Downloads/`).
Pending: JARVIS review → Tony commits → Cody retests R4-F01/R4-F02 and the matrix. No owned servers running.
Next step: independent retest → JARVIS disposition. Engineering does not self-certify.

Last action (2026-10-29 19:34): **REPAIR_004 ADDENDUM_001 (R-013 addendum 2)**, JARVIS dispatch closing R4-N01.
  A submitted payment can't be closed, replayed, restarted or paid again (enforced by the service; Review/stand-in/C06 no longer offer it). Unprovable completed history is shown as unavailable.
  Uncommitted on `d6fe678` with addenda 1/2, REPAIR_003 and REPAIR_004. tsc 0 · build 0 · Jest 233/233 · new Jest 12/12 (before 9 failed) · new spec 7/7 (before 3 failed)
  · public + Gate M public 146/146 · Gate M 224/0. The REPAIR_004 ZIP is unchanged.
  Report: module `EVIDENCE/REPAIR_004_ADDENDUM_001_ENGINEERING_REPORT.md` · ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_004_ADDENDUM_001_REVIEW.zip` (+ `~/Downloads/`).
Pending: JARVIS review → Tony commits → Cody retests R3-F01/R3-F02/R3-O03/R4-N01. No owned servers running.
Next step: independent retest → JARVIS disposition. Engineering does not self-certify.

Last action (2026-10-29 18:50): **REPAIR_004 (R-013 addendum 1)**, JARVIS dispatch after Cody's REPAIR_003 RETEST_001.
  R3-F01: stored v2 checkouts bind only from retained evidence (their own quote for the same revision and count, or an unchanged seed); the R-011 open-edited case is held.
  R3-F02: completed activation and previews name only what was paid for. R3-O03: dark alert focus ring now 3.33:1 against the tint (was 2.99).
  Uncommitted on `d6fe678` with addenda 1/2 and REPAIR_003. build 0 · tsc 0 · Jest 221/221 · Cody's service probes 45/45 (before 44/1) · his browser probes 6/6 (before 2 failed)
  · his 200% focus probe 0 shortfalls · new spec 7/7 · public + Gate M public 139/139 · Gate M 212/0.
  Self-found, NOT repaired: R4-N01 (Review can close a processing payment). Report: module `EVIDENCE/REPAIR_004_ENGINEERING_REPORT.md` · ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_004_REVIEW.zip` (+ `~/Downloads/`).
Pending: JARVIS review (including R4-N01) → Tony commits → Cody retests R3-F01/R3-F02/R3-O03. No owned servers running.
Next step: independent retest → JARVIS disposition. Engineering does not self-certify.

Last action (2026-10-29 16:40): **REPAIR_003 (R-013)**, JARVIS dispatch after Cody's REPAIR_002 RETEST_001.
  R2-F01: a processing/unknown payment stays bound to the scope it was quoted for. Restore with "Use the details I paid for"; nothing is charged again.
  R2-F02: closed checkout keys are refused at the service; open-checkout replay is unchanged. Public storage is now v3.
  Uncommitted on `d6fe678` together with addenda 1+2. build 0 · tsc 0 · Jest 210/210 · Cody's service file 23/23 (before 18/5)
  · Cody's browser repro 2/2 (before 2 failed) · new spec 7/7 · public + Gate M public 131/132, then the storage-v3 test update gives 5/5 · Gate M 204/0.
  Report: module `EVIDENCE/REPAIR_003_ENGINEERING_REPORT.md` · ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_003_REVIEW.zip` (+ `~/Downloads/`).
Pending: JARVIS review → Tony commits (the scope in FINAL_CANDIDATE_PREPARATION_001 predates REPAIR_003) → Cody retests R2-F01/R2-F02. No owned servers running.
Next step: independent retest → JARVIS disposition. Engineering does not self-certify.

Current Director update: Tony reports walkthrough acceptance (login/logout and dropdown removal included). Coach confirmations pending; no answers supplied. Both addenda verified; scoped commit remains Tony’s next action, then JARVIS disposition. See module EVIDENCE/FINAL_CANDIDATE_PREPARATION_001.md. Earlier next-step text below is historical.

Last action (2026-10-29 14:45): **REPAIR_002 addendum 2 (R-012)**: "Next activation check" removed from the public demo bar;
  Registration scenario → Load is the only selector for named activation states. This was a usability finding; no engine failure was reproduced.
  Uncommitted on `d6fe678` together with addendum 1. tsc 0 · focused jest 76/76 · Playwright 9/9 + 35/35 · Gate M 180/0. Record: report §11 ·
  ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_002_ADDENDUM_002_REVIEW.zip` (+ `~/Downloads/`).
Pending: JARVIS review → Tony commits addenda 1+2; record the resulting SHA as the candidate. No owned servers running.
Next step: QA includes the scenario/progression check in the addendum verification → Tony walkthrough → JARVIS certification decision.

Previous (2026-10-29 13:55): **REPAIR_002 addendum 1 (R-012)**: manual-review copy fix. The C14 unknown-payment introduction
  no longer says "Payment wasn't completed". Uncommitted on `qa/ffm-abm-001-subscription-portal` @ d6fe678 (the Director's REPAIR_002 commit).
  jest 183/183 · focused Playwright 6/6 · Gate M 12/0. Record: module `EVIDENCE/REPAIR_002_ENGINEERING_REPORT.md` §10 · ZIP:
  `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_002_ADDENDUM_001_REVIEW.zip` (+ `~/Downloads/`).
Pending: Tony commits the addendum; record the resulting SHA as the candidate before final certification. No owned servers running.
Next step: Cody retests independently → Tony walkthrough → JARVIS certification decision.

Previous (2026-10-29 13:35): **REPAIR_002 COMPLETE (engineering), RULINGS R-012**. This follows the QA Lead's Gate Q FAIL on 24cf075:
  CR-F01 (owner declaration bypassed through a retained or replayed pending checkout), CR-F02 (count-driven allocation), Q2-O04 residual, and self-found
  R2-N01/R2-N02. Uncommitted on `qa/ffm-abm-001-subscription-portal` @ 24cf075. build 0 · tsc 0 · jest 180/180 · Playwright
  148/148 · Gate M 236/0. Report: module `EVIDENCE/REPAIR_002_ENGINEERING_REPORT.md` · ZIP:
  `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_002_REVIEW.zip` (+ `~/Downloads/`) · Session: `session_2026-10-29.md`.
Pending: JARVIS review → Tony commits. No owned servers running; r003 scratch folder fully deleted (29 Oct). :3000 (PID 916513) and :3457 not owned.
Next step: Cody independently retests → Tony walkthrough → JARVIS certification decision.

Previous (2026-10-29 10:26): **AMENDMENT_001 COMPLETE (engineering), RULINGS R-011** — owner-only registration: job-title
  select removed, required owner declaration (UI + mock service), v1 drafts migrate unaccepted, admin/ownership copy clarified.
  Uncommitted on `qa/ffm-abm-001-subscription-portal` @ 0d43a4c (REPAIR_001 committed). build 0 · tsc 0 · jest 156/156 ·
  Playwright 131/131 · Gate M 220/0. Report: module `EVIDENCE/AMENDMENT_001_ENGINEERING_REPORT.md` · ZIP:
  `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_AMENDMENT_001_REVIEW.zip` (+ `~/Downloads/`) · Session: `session_2026-10-29.md`.
Pending: Tony commits. Owned server :3104 stopped (no owned servers running); all scratch app copies deleted (r002 on 29 Oct).
Next step: independent QA on the combined candidate (AC-06a + REPAIR_001 retest) → JARVIS adjudicates.

Previous (2026-10-28 16:24): **REPAIR_001 COMPLETE (engineering) for FFM-ABM-001-SUBSCRIPTION-PORTAL** under RULINGS R-010
  (direct QA Lead → Engineer route). Repaired Q2-F01 contrast, F02 load-error/retry, F03 Stripe `mode` classification,
  O04 approved pharmacies section/cards/refresh line, G06 20-store cap; self-found R1-N01 (refreshing state). Uncommitted on
  `qa/ffm-abm-001-subscription-portal` @ 94251be. build 0 · tsc 0 · jest 143/143 · Playwright 126/126 · Gate M 220/0.
  Report: module `EVIDENCE/REPAIR_001_ENGINEERING_REPORT.md` · ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_REPAIR_001_REVIEW.zip`
  (+ `~/Downloads/` copy) · Session: `agent_docs/SESSIONS/session_2026-10-28.md`.
Pending: Tony reviews + commits the repaired candidate. All owned servers stopped (16:3x: :3103, :3001);
  PID 40320 (:3457) untouched. Scratch copies retained in session scratchpad r001/.
Next step: Cody independently retests repairs + regression → JARVIS adjudicates. Engineering does not self-certify.

Previous (2026-10-27 16:01): **E2 COMPLETE for FFM-ABM-001-SUBSCRIPTION-PORTAL (R-009).** Public registration from `/`
  (no login); account management behind real admin/superadmin login. Uncommitted on branch `ffm-abm-001-subscription-portal`
  @ b1fbdda. build 0 · tsc 0 · jest 106/106 · Playwright 59/59 · Gate M 220 measurements, 0 failures.
  Report: `agent_docs/RESPONSES/response_2026-10-27_160100_e2-review-ffm-abm-001.md` · ZIP:
  `~/Downloads/FFM-ABM-001-SUBSCRIPTION-PORTAL_E2_REVIEW_001.zip` · module STATE/handoff in `agent_docs/ACTIONS/…_ffm_abm/`.
Pending: Tony reviews + commits the candidate, creates `qa/ffm-abm-001-subscription-portal`; owned demo server on :3001 still running.
Next step: Cody Q1 at the module's `QAM/QAM_ENTRY.md`.

R-008 (14:20–14:35): admin-or-superadmin rule; Tony's manual admin login recorded as Director-reported verification.
Earlier today: E1 COMPLETE for FFM-ABM-001-SUBSCRIPTION-PORTAL. Module installed at
  `agent_docs/ACTIONS/cyph_subscription_portal_phase1_ffm_abm/` (pointer: `agent_docs/PROJECT_POINTER.md`).
  Plan: that folder's `EXECUTION_PLAN.md` · facts: `EVIDENCE/E1_RECON.md` · state: `STATE.md`
  · review ZIP: `EVIDENCE/FFM-ABM-001-SUBSCRIPTION-PORTAL_E1_REVIEW_001.zip` (+ `~/Downloads/` copy)
  · Session: `agent_docs/SESSIONS/session_2026-10-27.md`
Pending: Architect review + Director approval of the plan (X1–X3, A-1); blockers B1 branch, B2 Supabase
  project identity, B3 reviewer identity, B4 PID 40320 on :3457. Credential rotation remains a Director action.
Next step: on approval, E2 builds continuously from plan §5 step 1 on branch `ffm-abm-001-subscription-portal`.

Previous (2026-10-26): bounded cleanup complete, committed by the Director as `1d15918`. Report:
  `agent_docs/RESPONSES/response_2026-10-26_155736_cleanup-result.md`.

## Standing rules
- Director-only git: Claude never commits, pushes, resets, switches branches or rewrites history.
- Plan Mode + session file + RESPONSES mirror for every substantive artifact (CLAUDE.md v3.1).
- Access (R-008/R-009): registration public; `(account)` admits user_roles admin OR superadmin (layout + every page); member denied — until customer auth is ruled.
- Deployment stubs exit 1 on purpose. Do not resurrect Mission Control cloud values.
- `supabase/*.sql` is unverified reference. Execute nothing without separate approval.

## Lineage
Cloned 2026-10-26 from the Mission Control FFM repo (`cyph-mission-control-v1`). Its design
system (tokens, shell, primitives, brand) and auth plumbing were kept; its screens, services,
mocks, types, deploy wiring and docs were removed. Mission Control history remains under
`agent_docs/` (SESSIONS / RESPONSES / CURRENT_APP / RECON) pending the disposition ruling.
