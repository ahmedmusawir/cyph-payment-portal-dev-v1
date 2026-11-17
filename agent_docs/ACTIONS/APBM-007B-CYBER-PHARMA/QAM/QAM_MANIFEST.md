# QAM_MANIFEST — `APBM-007B-CYBER-PHARMA` (Engineer's factual completion record)

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/QAM_MANIFEST.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §7 ("As Engineering finishes") and §5. **Owner: Engineer**, written as part of the original engineering assignment and **before the Director commits**.

**Engineer (seat, runtime):** Claudy (Claude Code, model Opus 5.5) · **Recorded at:** 16 November 2026, Asia/Dhaka — **FINAL r05 (17 November 2026, ~11:45) + completion addendum r06 (~12:10) — ENGINEERING COMPLETE — AWAITING QA BRANCH** (blockers B1/B2 closed: `HANDOFFS/ENGINEERING_HANDOFF.md` §4.1) · **Working directory for every command below:** stated per row (Portal = `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`, OwedBook = `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`)

## 1. Identity (facts)

| Field | Value |
|---|---|
| Baseline (full SHA) | `c68c4acaccc4a68f20ede267f06cfda17fa15aac (Portal); 0b785524a621c4384db8bee47ef9b4149b8ab44c (OwedBook)` |
| Implementation identity | `PENDING` — the candidate commit does not exist until the Director commits the completed engineering work. Uncommitted engineering builds are identified by artifact id: final clean build Portal `8c6a308a74ec2a06d8c2f5826ef413ac`, OwedBook `5b3c3b13ab5f58935fe7f806040ea98f` (`../EVIDENCE/E2/r05/FINAL/manifest_*.json`); last served proof pair Portal `09ffa057cbb00af51c2c5d15f06571f2`, OwedBook `4e43362f743105dccabf9dcb05cea8fe` (product source byte-identical to the repos) |
| Engineering branch | `apbm-007b` (both repositories) |
| Intended QA branch | `qa/apbm-007b` — the Director creates it at the completed engineering candidate commit, after this handoff |
| HEAD at handoff | Portal `c68c4acaccc4a68f20ede267f06cfda17fa15aac`; OwedBook `0b785524a621c4384db8bee47ef9b4149b8ab44c` (no commits by Engineering) |

## 2. Complete change inventory at handoff (facts; captured before the Director commits)

| Part | Command (working dir) | Output stored at | Count |
|---|---|---|---|
| 2.1 Committed since baseline | `git diff --name-status <baseline>..HEAD` + `git log --oneline <baseline>..HEAD` (each repo) | `../EVIDENCE/E2/r06/INVENTORY/<repo>_2.1_committed.txt` | 0 / 0 |
| 2.2 Staged, not committed | `git diff --cached --name-status` | `r06/INVENTORY/<repo>_2.2_staged.txt` | 0 / 0 |
| 2.3 Unstaged modifications | `git diff --name-status` | `r06/INVENTORY/<repo>_2.3_unstaged.txt` | Portal 13 · OwedBook 8 |
| 2.4 Untracked files | `git ls-files --others --exclude-standard` | `r06/INVENTORY/<repo>_2.4_untracked.txt` | Portal 507 (54 outside `agent_docs/`) · OwedBook 59 (32 outside `agent_docs/`) |
| 2.5 Snapshot | `git status --porcelain` | `r06/INVENTORY/<repo>_2.5_status.txt` | — |

Final capture 17 November 2026 (r05). Since r02: OwedBook `src/server/emailLink.ts` (M) and `invitationMail.ts` (exact
sign-in redirect; pending invitations → `/invitations`) with tests; OwedBook `scripts/apbm007b/{dev-apply-guard,dev-compat-check}.mjs`
and corrected `sql-proof.mjs`; Portal live-check scripts (`o1-journey`, `c-journeys`, `e-transfer`, `e-checkout-complete`,
`gf-checks`, `invite-*`, `a1-*`, revised `inbox.mjs`, `proof-serve.mjs --mail live`, effect ceilings) and `e2e/apbm007b.o1-state.spec.ts`.

Consolidated inventory by area (one row per path group; exact paths in the 2.3/2.4 files):

| Path(s) | Where | Status | What changed | Authorized by |
|---|---|---|---|---|
| OwedBook `supabase/migrations/0061…0069_007b_*.sql` | untracked | A | Seven contracted forward migrations + 0068 (ruling 1) + 0069 (rulings 2–3; APPROVED 17 Nov). **Applied to DEV 17 Nov under the Director release** | MIGRATIONS.md, ALLOWED_PATHS, rulings 17 Nov |
| OwedBook `src/server/{invitationMail,staff,mailGuard}.ts`, `src/app/api/{invitations,stores,build-info}/**`, `src/app/invitations/page.tsx`, `src/components/{invitations,admin-portal/LiveStaffPanel}.tsx`, `InviteScreen.tsx` | untracked / unstaged | A / M | Invitations, members, history, guarded privileged mail | IDENTITY, API_ROLE_MATRIX, ruling 5 |
| OwedBook `src/lib/appIdentity.ts`, `src/server/emailLink.ts`, `src/server/handoff.ts`, `next.config.js`, `scripts/rls-harness/lib/env.mjs`, tests | unstaged | M | proof origins + return paths; build identity; 007B evidence lane; boundary/allowlist pins | ENVIRONMENT, ALLOWED_PATHS, BP-09 |
| OwedBook `scripts/apbm007b/**`, `playwright.config.ts`, `e2e/apbm007b.staff.spec.ts` | untracked | A | rehearsal runner, SQL proof, seed, DEV apply guard/compat checks; browser config/spec | ENGINEERING_COMMANDS |
| Portal `src/server/{storePricing,storeOperations,mailGuard,billingNotices,operator007b}.ts`, `src/app/api/{stores,internal/jobs/run,operator/007b,build-info}/**`, `src/app/(account)/stores/add/page.tsx`, `src/components/portal/account/{AddStoreFlow,StoreRemovalControl}.tsx` | untracked | A | Add Store saga, removal/undo, notices, operator, jobs, UI | BILLING, LIFECYCLE, CLOCK_AND_NOTICES |
| Portal `src/server/{webhook,billing,errors}.ts`, `DashboardView.tsx`, `src/types/portal/api.ts`, `src/lib/appIdentity.ts`, `next.config.js`, tests | unstaged | M | routing/grace/notice changes; dashboard links/controls; error codes; identity | same |
| Portal `scripts/apbm007b/**`, `scripts/operator-007b.mjs`, `src/integration/apbm007b-*`, `src/__tests__/apbm007b-store.test.ts`, `e2e/apbm007b.{addstore,regression,o1-state}.spec.ts`, `playwright.config.ts` | untracked / unstaged | A / M | instruments, integration, unit, browser | ENGINEERING_COMMANDS |
| Portal `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/**` | untracked | A | installed module (unchanged pack files) + journal, EVIDENCE/E2, QAM manifest/handoff/state | Director release; ALLOWED_PATHS |

Paths outside the authorized scope: none known. Local-only, never to be committed: `/tmp/apbm007b-*.json` and `~/.apbm007b/*` (private
0600 credential/cast files, outside repos), `/home/moose/APBM007B_E2_WORK/**` (disposable build/proof/rehearsal lanes).

## 3. Claimed behavior and self-verification (CLAIMs)

| Claim | Self-verification command (working dir) | Engineer result | Evidence | AC(s) |
|---|---|---|---|---|
| Standalone incremental invoice mechanism behaves per BILLING.md at the provider | `node scripts/apbm007b/capability-check.mjs --cp1 --label <run> --apply` (Portal) | CLAIM: PASS | `EVIDENCE/E2/r01/CP1/` | 003–007 |
| Saga on real SCRATCH + sandbox (happy, replay, lost activation, decline/abandon, expiry, removal/undo) | `node scripts/apbm007b/integration.mjs --suite store` (Portal) | CLAIM: 5/5 PASS | `CP1/cp1b_scratch_itest.txt` | 004–008, 018–019 |
| Clock chronology, PE-09 and seven-day record; SQL time exclusion | `testclock.mjs --cp2 --label <run> --apply`; `sql-proof.mjs --scratch` | CLAIM: PASS | `CP2/` | 003, 025 (partial) |
| Migrations fresh/upgrade/interrupted-forward; DB behaviour | `node scripts/apbm007b/migrate-rehearsal.mjs fresh|forward --db <local>`; `node scripts/apbm007b/sql-proof.mjs --local <url>` (OwedBook) | CLAIM: PASS; final local fresh 0001–0069 PASS, proof local 134/134, SCRATCH 130/130 | `r05/FINAL/` | 002, 010–017, 027, 029 |
| Unit suites | `npx --no-install jest --ci` (each repo) | CLAIM: Portal 482/482, OwedBook 312/312 (final) | `r05/FINAL/final_checks_summary.json` | all |
| Typecheck / lint | `npx --no-install tsc --noEmit`; `npx --no-install eslint .` (each repo) | CLAIM: clean; 0 errors | console | — |
| Client bundles carry no server credential | `node scripts/apbm007b/build-check.mjs --self-test`; `--app both --out /home/moose/APBM007B_E2_WORK/build` (Portal) | CLAIM (final): self-test 23/23; Portal clean; OwedBook only the documented auth-js `generateLink` exception (1 file) | `r05/FINAL/build_check*.json` | 031 |
| Served build = manifest | `node scripts/apbm007b/served-identity.mjs --base http://localhost:310x --manifest …` (Portal) | CLAIM: match both | `BUILD/served_identity_*.json` | (handoff) |
| New journeys on production builds | `PORTAL_BASE_URL=http://localhost:3101 APBM007B_PROOF_CAST=<0600 file> npx --no-install playwright test --project=apbm007b` (Portal); same with `OB_BASE_URL=http://localhost:3100` (OwedBook) | CLAIM: Portal 3/3 + regression 9/9 three engines (r02); OwedBook staff 6/6 three engines (final); live checks O-1, C, E, G, F and invitation acceptance (r03–r05) | `r01–r05` | 030, 028 |

## 4. Reproduction (facts)

| Step | Command | Working directory |
|---|---|---|
| Install (disposable copies) | `npm ci --no-audit --no-fund` (done by build-check/proof-serve inside the copy) | `/home/moose/APBM007B_E2_WORK/<lane>/<app>` |
| Build + scan | `node scripts/apbm007b/build-check.mjs --app both --out /home/moose/APBM007B_E2_WORK/build` | Portal |
| Proof build / serve / stop | `node scripts/apbm007b/proof-serve.mjs build|start|stop --out /home/moose/APBM007B_E2_WORK/proof` (3100 OwedBook, 3101 Portal → SCRATCH) | Portal |
| Served identity | `node scripts/apbm007b/served-identity.mjs --base <origin> --manifest <manifest>` | Portal |
| Jobs runner (local) | `node scripts/apbm007b/jobs-run.mjs --base http://localhost:3101 --every 60` | Portal |
| Listener | none: no Stripe CLI listener, registered endpoint or event destination existed (verified 17 Nov). Event-driven checks used **controlled signed delivery** by Engineering scripts (recorded per run). **Automatic webhook delivery is UNTESTED** and is a required QA-planning and staging-verification item (`HANDOFFS/ENGINEERING_HANDOFF.md` §4.2) | — |
| Tests / board | as §3 | each repo |
| Operator | `node scripts/operator-007b.mjs --help` | Portal |

## 5. Environment the QA body needs (facts; no secret values)

| Item | Value |
|---|---|
| Environments / targets | Proof pair on SCRATCH (`ihgcsrypblqkwommrkgj`) + Stripe sandbox; DEV (`yrsuwikjnbmvpznrgydb`) **migrated 0001–0069 on 17 Nov** (receipts `r05/DEV_APPLY/`), deployment identity bound to DEV |
| Services and external prerequisites | Stripe sandbox (expected account, `STRIPE_PRICE_STORES`), Resend (Portal billing notices), Supabase Auth SMTP (sign-in/invitation links) |
| Migrations / fixtures / seed state | SCRATCH: 0001–0069 (ledger = files); 007B rehearsal rows labelled `apbm007b-itest-*`, `Proof walk*`, `op-admin-*`; deployment identity bound to SCRATCH; SCRATCH Auth has the token-hash Magic Link template and proof redirect URLs (Director, 17 Nov). DEV: 0001–0069, no 007B fixtures or test users |
| Roles and identities required | OWNER_A/OWNER_B/STORE_ADMIN/MEMBER/FOREIGN_OWNER/NEW_ADMIN/NEW_MEMBER/EXISTING_INVITEE/signed-out per `TEST_IDENTITIES.md` |
| Credentials needed (key names only) | Portal: existing names + `RESEND_API_KEY`, `BILLING_EMAIL_FROM`, `MAIL_ALLOWLIST`; OwedBook: existing + `MAIL_ALLOWLIST`; QA `.env.qa.local` per `TEST_IDENTITIES.md` |
| Ports / resources | 3100/3101 proof; Director's 3000/3001/3457 untouched |
| Runtime and tool versions | Node v22.17.0, npm 11.15.0, Next 16.4.3 (Portal) / 16.3.7 (OwedBook), Jest 30.4.2, TypeScript 5.5.4, Playwright 1.59.1 (system Chrome), `stripe` 22.1.0 API `2026-04-22.dahlia`, Postgres 17 (SCRATCH 17.6; local Supabase CLI 2.116.0 images) |

## 6. Known limitations, unresolved issues, preserved paths, rollback (facts)

| Item | Detail |
|---|---|
| Known limitations | `HANDOFFS/ENGINEERING_HANDOFF.md` §4.2 |
| Unresolved issues | None blocking engineering (B1/B2 closed 17 Nov). Carried forward: automatic webhook delivery untested → QA plan + staging verification |
| Preserved / untouched paths | applied migrations 0001–0060 (DEV ledger prefix unchanged), existing `.env*` values (only `MAIL_ALLOWLIST` appended privately), lockfiles, 007A evidence/QAM, Director processes |
| Rollback dependencies | Forward-only; 0068 keeps 007A inserters working; no restore of old access bodies |
| Not done by engineering | Q1 plan/results, approvals, certification, Git actions, deployment |

## 7. Meaning of each engineering evidence item (CLAIMs)

| Evidence path | What it shows (CLAIM) | How QA can re-derive it |
|---|---|---|
| `EVIDENCE/E2/effects/` | Cumulative effect ledger and counters for this E2 | Recount from provider/SCRATCH objects by run markers |
| `EVIDENCE/E2/r01/CP1`, `CP2` | Checkpoint returns and raw state | Re-run instruments under a QA allowance |
| `EVIDENCE/E2/r01/MIGRATIONS` | Rehearsal receipts, proof outputs, hashes | `migrate-rehearsal.mjs`, `sql-proof.mjs` on an isolated DB |
| `EVIDENCE/E2/r01/BUILD`, `BROWSER` | Scan, manifests, served identity, walk state, screenshots | Rebuild and rerun specs at the candidate |
| `EVIDENCE/E2/r03`–`r06` | Live checks, invitation acceptance, DEV apply receipts, final checks, crash/restart, inventory | See `HANDOFFS/ENGINEERING_HANDOFF.md` §3 |

## 8. Factual amendments after handoff (dated; Engineer only)

| Date | Owner | Field amended | Old → new | Reason |
|---|---|---|---|---|
| 2026-11-17 | Claudy (Engineering) | §1 Candidate | `PENDING` → tested candidate Portal `427bec6267b9777e9cb44f81c22d1396a495bc14`, OwedBook `c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea`, branch `qa/apbm-007b` | A commit cannot contain its own SHA; the Director committed and pushed both, and the SHAs are restated in the Q2 repair instruction |
| 2026-11-17 | Claudy (Engineering) | §2 Change inventory — repair on `qa/apbm-007b` (uncommitted; the Director commits) | Q2 candidate → repaired working tree. **Portal (head 821f139):** `src/server/storeOperations.ts` M; `src/components/portal/account/DashboardView.tsx` M (one sentence); `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/SUPPORT_PROCEDURES.md` M (runbook added, earlier text unchanged); `src/__tests__/apbm007b-consent-deadline.test.ts` A; `src/integration/apbm007b-deadline.localdb.itest.ts` A; this manifest. **OwedBook (head c8a2ed9):** `supabase/migrations/0070_007b_consent_deadline_paid_time.sql` A (SHA-256 `de0b51c61c4ef255934fc20b6c7abdc5d4b69e1129bbce4a8a15111905edce81`); `scripts/apbm007b/sql-proof.mjs` M (0070 scenarios; three fixtures moved off the removed transition); `src/components/admin-portal/LiveStaffPanel.tsx` M; `src/components/auth/LoginForm.tsx` M; `src/__tests__/admin-portal/LiveStaffPanel.hydration.test.tsx` A; `src/__tests__/auth/LoginForm.hydration.test.tsx` A. No contract file, other QAM record, applied migration 0061–0069, lockfile or dependency changed | Repair ruled by the QA Lead (Q2 adjudication SHA-256 `37b8747c…6e12`) and released by the Director, 17 Nov 2026 |
| 2026-11-17 | Claudy (Engineering) | Repair A — F-Q2-001, F-Q2-004 (cause and fix) | **Cause (confirmed):** (1) The Portal decided "deadline passed" with its own wall clock (`Date.now()`), while the deadline is set and queued on the account billing clock (`billing_now`). (2) A paid invoice became `paid_pending_activation` with no deadline check in either SQL transition or activation (0062, 0069), and the Portal judged lateness by processing time. **Fix:** Lateness is now the provider's paid time (`status_transitions.paid_at`) against the stored deadline, decided in SQL by new `store_operation_payment_observed`; every deadline decision in the app asks new `store_operation_deadline_passed` (billing clock). The direct `payment_pending → paid_pending_activation` transition is removed. Activation refuses a payment not proven on time unless the operator resumed it (`close_reference`). New column `store_operations.provider_paid_at`. 0070 applies forward on 0069 and fresh from 0001; ready for SCRATCH apply at Q4 entry | The six required cases, on real and simulated time |
| 2026-11-17 | Claudy (Engineering) | Repair A — tests (local only; no SCRATCH, DEV or Stripe effect) | **SQL proof on a fresh local DB (0069 → forward 0070):** 158/158 PASS, including the six cases × {real, simulated}, guards, paid-versus-void race and operator resume. **Portal saga + minute-job route against the real local SQL** (Stripe double), seven cases × {real, simulated}: repaired 14/14 PASS. The same tests on the candidate `storeOperations.ts` against a 0069 DB fail 6 of 14, reproducing F-Q2-001 and F-Q2-004. **Portal unit test (no DB):** 18/18 PASS | Evidence: `/home/moose/APBM007B_REPAIR_Q2/EVIDENCE/repair_A/` (outside Git) |
| 2026-11-17 | Claudy (Engineering) | Repair A — the current candidate on REAL time, no test clock (evidence: `deadline_candidate_0069.json`) | (a) **Late payment after an outage or crash:** attention `paid_after_deadline`, no store or quantity change. Correct. (b) **On-time payment processed after the deadline:** attention `paid_after_deadline`, no activation. Defect: it should activate once. (c) **Unpaid expiry:** the minute job voids and expires it, hold released. Correct. Also: a paid-versus-void race where the void loses to a payment completed after the deadline **activated** (store +1, quantity 2→3). Defect; the repair gives attention. On simulated time the candidate activated late payments (F-Q2-001) and the job left unpaid operations `payment_pending` with the invoice open (F-Q2-004). The repair fixes all of these in both modes | Required real-time statement |
| 2026-11-17 | Claudy (Engineering) | Repair B — F-Q2-002 (cause and fix) | **Cause (product):** In WebKit the spec's fill can land while React is still hydrating. The change event is dropped, and the controlled field (`value={email}`) is wiped on the next render (the list load), so Send stays disabled (`!email`) and no status appears. The same race in the sign-in form (`LoginForm`, react-hook-form `Controller`) dropped the typed email ("Email is required"); this is the a01 sign-in timeout. **Fix:** `LiveStaffPanel` email field uncontrolled (read at submit); Send disabled until hydrated, not on React email state; `run()` exception-safe. `LoginForm` adopts values typed during hydration; Login disabled until hydrated. **Bounds extension:** `LoginForm.tsx` is outside the ruled area; the Director approved the extension in session before it was touched | Proven in jsdom: the candidate components fail the new hydration tests (typed text → `""`); repaired pass 3/3 and 2/2 |
| 2026-11-17 | Claudy (Engineering) | Repair B — WebKit runs (owned local OwedBook build on 3100 against the local DB; mail disabled; spec SHA-256 `ee2cb80e…ad00d` and config unchanged) | Candidate: WebKit 2 of 5 failed (Send disabled; sign-in). Repaired: **WebKit 5/5 PASS**; Firefox and Chrome PASS. The app fixes its local-proof origin to `localhost:3100`; on another port every send is refused. QA processes were stopped; nothing of QA's was used | Evidence: `/home/moose/APBM007B_REPAIR_Q2/EVIDENCE/repair_B/` |
| 2026-11-17 | Claudy (Engineering) | Repairs C and D | **C (F-Q2-005):** removed "Inviting staff and adding stores are not available yet." from the owner dashboard; the billing-owner sentence is kept. No other dashboard change. **D (F-Q2-006):** `SUPPORT_PROCEDURES.md` gains the runbook for the six actions: exact command, inputs, requester and approver, before, after, partial failure and resume. It states that the shared credential proves possession, not identity. The contract names no approver role; the runbook uses the Director until one is named | Ruled repairs |
| 2026-11-17 | Claudy (Engineering) | Required checks | Portal: jest 26 suites, 500/500; `tsc` clean; eslint 0 errors (27 warnings, none new). OwedBook: jest 47 suites, 317/317; `tsc` clean; eslint 0 errors (36 warnings, none new) | Evidence: `/home/moose/APBM007B_REPAIR_Q2/EVIDENCE/checks/` |
| 2026-11-17 | Claudy (Engineering) | Engineering state | → **ENGINEERING REPAIR COMPLETE — AWAITING COMMIT**. No commit, push, merge, SCRATCH or DEV write, Stripe effect or QA fixture change. Local Supabase stack and the owned 3100 server stopped. Noted, not changed: the operator SQL `store_reactivation_authorize` still returns the older "pending Director decision 9" policy text (applied 0066); `LinkRequestForm` (same page as sign-in) was not examined | Repair ruling: record and stop |

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*
