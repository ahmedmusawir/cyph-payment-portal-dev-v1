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
| | | | | |

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*
