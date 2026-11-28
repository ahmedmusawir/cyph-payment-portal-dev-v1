# ENTRY_CHECKS — ABM007_FINAL (E-1 to E-6)

**Date:** 24 November 2026, 07:55 to 08:00, Asia/Dhaka · **By:** Engineer (Claudy) · **Mode:** read-only in both repositories. Builds and tests ran in isolated copies outside both repositories.

Labels: **[V]** verified in this session by command or file read. **[U]** not verifiable with this session's access; the remaining check is named.

No fetch was run. Remote-tracking refs are as of the last fetch: OwedBook 2026-11-23 15:02:03, Portal 2026-11-23 15:02:41 (`.git/FETCH_HEAD` times).

---

## E-1 Identity

Commands, each repository: `git rev-parse HEAD`, `git status --porcelain=v1 -uall`, `git stash list`, `git worktree list`, `git remote -v`, `git branch -vv`, `git reflog`.

| Item | OwedBook `cyph-v1-dev` | Portal `cyph-payment-portal-dev-v1` |
|---|---|---|
| Branch [V] | `abm007-final` | `abm007-final` |
| HEAD, full [V] | `c335671afa6cd4a8a2d437c30aeae5040e0cecaf` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Baseline in the brief | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| HEAD equals baseline [V] | **No. One commit ahead** (see E-2) | Yes |
| Upstream [V] | `origin/abm007-final` at `9597699`; local is **ahead 1, not pushed** | `origin/abm007-final` at `cb4decd`; in sync |
| `main` / `origin/main` [V] | both `9597699` | both `cb4decd` |
| Working tree [V] | **clean** (0 paths) | 1 untracked folder: `agent_docs/ACTIONS/ABM007_FINAL/` (the module pack). After this session also the planning records listed in the review package's `REVIEW_START_HERE.md` |
| Stashes [V] | 0 | 0 |
| Worktrees [V] | 1 (main checkout) | 1 (main checkout) |
| Remote, fetch and push [V] | `https://github.com/Cyberize-Group/cyph-v1-dev.git` | `https://github.com/ahmedmusawir/cyph-payment-portal-dev-v1.git` |
| Credentials in remote URL [V] | none | none |

**Difference from the instruction's description of OwedBook.** The instruction lists `CHANGELOG.md` and `RECOVERY.md` as modified, `session_2026-11-23.md` as untracked and the pointer as newly installed. That was the state at 07:52. At 07:54:00 those paths were committed:

```
c335671afa6cd4a8a2d437c30aeae5040e0cecaf
Ahmed Rahat Musawir  Tue Nov 24 07:54:00 2026 +0600
Starting ABM007_Final
 CHANGELOG.md                              | 13 ++++++
 RECOVERY.md                               | 21 ++++++++-
 agent_docs/ACTIONS/ABM007_FINAL/README.md | 20 +++++++++
 agent_docs/SESSIONS/session_2026-11-23.md | 73 +++++++++++++
 agent_docs/SESSIONS/session_2026-11-24.md | 45 +++++++++
 5 files changed, 171 insertions(+), 1 deletion(-)
```

Reflog: `c335671 HEAD@{2026-11-24 07:54:00 +0600}: commit: Starting ABM007_Final`. Nothing was discarded: the four reported paths plus a fifth (`session_2026-11-24.md`, written by the 07:51 OwedBook session) are all in that commit. The commit is local only.

## E-2 Records in the OwedBook tree

Full diff `9597699..c335671` saved at `diffs/E2_owedbook_9597699_to_c335671.diff` (212 lines) and read.

| Path | Kind | Content [V] | Written by |
|---|---|---|---|
| `CHANGELOG.md` | modified, +13 | Three dated record entries (23 Nov 09:17 and 09:31 UTC, 24 Nov 01:51 UTC) | Engineer, sessions of 23 and 24 Nov (pre-existing, not this session) |
| `RECOVERY.md` | modified, +20 −1 | New top blocks; earlier block demoted to "Prior block" | Same |
| `agent_docs/SESSIONS/session_2026-11-23.md` | added | Session log of the recon day | Same |
| `agent_docs/SESSIONS/session_2026-11-24.md` | added | Session opened 07:51, closed 07:52, no work | Same |
| `agent_docs/ACTIONS/ABM007_FINAL/README.md` | added | The pointer; text equals the pack's `CONTRACTS/OWEDBOOK_POINTER.md` including its two install-instruction lines | Director (installed 07:49) |

**Result:** records only. No product, test, deploy, dependency or migration path. The question "should they be committed before the build starts" is already answered by the Director's commit. What remains is a baseline statement (plan, blocker list, item D-B1).

Small observation, no action taken: the installed pointer still carries the pack's instruction header ("Install this file as …") above the pointer text. Harmless; listed for the Director.

## E-3 Branch reconciliation

**The Director's earlier branch receipt is not in the pack or in either repository [U].** `SOURCES/` was searched for branch lists; the Architect handoff only names `qa/apbm-007b` and `deploy/payment-alpha-prep`. The reconciliation below is therefore against each repository's own reflog, which records every branch name this clone ever checked out.

Current refs (`git for-each-ref refs/heads refs/remotes`):

| | OwedBook | Portal |
|---|---|---|
| Local branches [V] | `abm007-final` (`c335671`), `main` (`9597699`) | `abm007-final` (`cb4decd`), `main` (`cb4decd`) |
| Remote branches [V] | 18: `abm007-final`, `apbm-003`, `apbm-007b`, `deploy/owedbook-alpha-prep`, `guest/frank-2026-10-22`, `main`, `pilot-setup`, `pilot/vik-guest-contribution`, `pilot/vik-round2-onboarding`, `pilot/vik-stage3-assignment-file`, `pilot/vik-stage4-onboarding`, `pilot/vik-startup-router-fix`, `qa/apbm-003`, `qa/apbm-007a`, `qa/apbm-007b`, `records/vik-stage3-closure`, `repair/apbm-007b-manual-qa`, `vibe-pilot-setup` | 6: `abm007-final`, `apbm-007b`, `deploy/payment-alpha-prep`, `main`, `qa/apbm-007b`, `repair/apbm-007b-manual-qa` |

Branch names seen in reflog checkouts, against today:

| Branch name | OwedBook local | OwedBook remote | Portal local | Portal remote |
|---|---|---|---|---|
| `abm007-final` | yes | `9597699` | yes | `cb4decd` |
| `main` | yes | `9597699` | yes | `cb4decd` |
| `apbm-007a` | no | **no** | no | **no** |
| `apbm-007b` | no | `c8a2ed9` | no | `427bec6` |
| `qa/apbm-007a` | no | `ff66eff` | no | **no** |
| `qa/apbm-007b` | no | `855e0ad` | no | `57c923f` |
| `repair/apbm-007b-manual-qa` | no | `a6e1007` | no | `7517459` |
| `deploy/owedbook-alpha-prep` / `deploy/payment-alpha-prep` | no | `2fec846` | no | `e4c23ed` |
| `pilot/vik-startup-router-fix` | no | `51dad71` | n/a | n/a |

What this proves and does not prove:

- **[V] Local branch names other than `abm007-final` and `main` are absent in both clones.** Several were checked out here earlier (reflog), so they were removed locally at some point. When and by whom is not recorded in the reflog.
- **[V] No commit is lost.** In each repository, every commit that HEAD ever pointed at (47 reflog entries in OwedBook since the clone of 11 Nov; 46 in the Portal since 10 Nov) is contained in at least one current ref. `git fsck --no-reflogs --unreachable` reports 0 unreachable commits in both.
- **[V] Three names have no ref at all today:** `apbm-007a` in both repositories and `qa/apbm-007a` in the Portal. Their commits are reachable from other refs (previous point).
- **[U] Whether those three names still exist on GitHub.** The remote-tracking view is from the last fetch, and this clone's fetch configuration prunes nothing by itself. Closing this needs `git ls-remote --heads origin` in each repository (read-only, network; not run because no fetch-class command was authorized) or the GitHub branch page.
- Nothing here asserts that any branch was deliberately deleted or deliberately preserved.

## E-4 Deployed commit versus baseline

Full diffs saved: `diffs/E4_owedbook_ef4cebc_to_9597699.diff` (262 lines), `diffs/E4_portal_6dd3de7_to_cb4decd.diff` (259 lines). The path lists below are exhaustive (`git diff --name-status`); the added and removed lines were read.

**OwedBook, deployed `ef4cebc` → baseline `9597699`** (commits `2fec846`, merge `9597699`):

```
M  CHANGELOG.md
M  DEPLOYMENT_CHECKLIST.md
M  RECOVERY.md
A  agent_docs/RESPONSES/response_2026-11-20_170846_owedbook-alpha-auto-plan.md
A  agent_docs/RESPONSES/response_2026-11-20_173800_owedbook-alpha-deployed.md
M  agent_docs/SESSIONS/session_2026-11-20.md
M  agent_docs/SKILL_ISSUES_LEDGER_next_deploy_auto.md
```

**Portal, deployed `6dd3de7` → baseline `cb4decd`** (commits `e4c23ed`, merge `cb4decd`):

```
M  CHANGELOG.md
M  DEPLOYMENT_CHECKLIST.md
M  RECOVERY.md
A  agent_docs/RESPONSES/response_2026-11-21_095332_payment-alpha-init-result.md
A  agent_docs/RESPONSES/response_2026-11-21_104910_payment-alpha-deployed.md
A  agent_docs/RESPONSES/response_2026-11-21_110610_payment-alpha-webhook-delivery.md
M  agent_docs/SESSIONS/session_2026-11-21.md
```

**Result [V]:** records only in both. No path under `src/`, `public/`, `supabase/`, `scripts/`, no `package*.json`, no deploy script or build file. The running alpha services are product-identical to the baselines. Both `.dockerignore` and `.gcloudignore` exclude `agent_docs/`, so none of these files is in a deployed image either.

**[U]** That alpha still runs those revisions today. The deployed identities come from the repositories' records (20 and 21 Nov), not from a live read-back in this session.

## E-5 Baseline health (isolated copies)

Method: `git archive <baseline SHA> | tar -x` into two scratch folders outside both repositories; each repository's existing `node_modules` copied in (no install, no network, no lockfile change); no environment file present in either copy. Node v22.17.0, npm 11.15.0. Commands run from each copy's root with `CI=1 NEXT_TELEMETRY_DISABLED=1`. Logs in `logs/`.

| Check | Command | OwedBook @ `9597699` | Portal @ `cb4decd` |
|---|---|---|---|
| Unit suite | `npx jest --ci` | exit 0 · **54 suites, 374 tests passed** | exit 0 · **32 suites, 572 tests passed** |
| Typecheck | `npx tsc --noEmit` | exit 0 | exit 0 |
| Lint | `npx eslint .` | exit 0 · 0 errors, **38 warnings** (existing) | exit 0 · 0 errors, **27 warnings** (existing) |
| Production build | `npx next build` | exit 0 (Next.js 16.4.5) | exit 0 (Next.js 16.4.5) |

Both working trees were untouched by these runs. OwedBook was checked at the baseline SHA, not at `c335671`; the difference is the five record files in E-2.

Not run, and why: browser specs (need running servers and a private fixture file; local servers are not started by Engineering outside a QA-authorized run); the three Portal integration tests (need database settings).

## E-6 Gaps that were Engineering's to close

### (a) "No permitted stores" rendering condition — located [V]

`cyph-v1-dev/src/components/owedbook/StoreSelector.tsx`, line 8. The store `<select>` always renders a first, disabled option:

```
<option value="" disabled>{scopeLoading?"Loading stores…":"No permitted stores"}</option>
{stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
```

Once loading ends the placeholder text is "No permitted stores" **whatever the length of `stores`**. A user with one or more stores therefore sees "No permitted stores" as the first row of the open list, directly above the selectable stores. That matches the rehearsal observation. The select is disabled only when `stores` is empty, and `OwedBookContext.tsx` line 30 preselects the first store, so the closed control shows a real store; the contradiction appears when the list is opened.

- Only use: `OwedBookScreen.tsx:182`. The Portal has no such string (searched).
- Fix shape: render the placeholder only while loading or when `stores.length === 0`. One file, inside the allowed path `src/components/owedbook/**`. The list of stores comes from `listTenantStores()` unchanged, so nobody gains a store.

### (b) Invitation resend, revoke, decline — all three exist [V]

| Control | Where | Label on screen |
|---|---|---|
| Resend a pending invitation | `src/components/admin-portal/LiveStaffPanel.tsx:130-131` (pharmacy people page) | **Resend** (busy: "Resending…") |
| Cancel a pending invitation | `LiveStaffPanel.tsx:133-134` | **Revoke** (busy: "Revoking…"), not "Cancel" |
| Decline, by the recipient | `src/components/invitations/InvitationsScreen.tsx:62` (`/invitations`) | **Decline** |

Routes behind them exist (`src/app/api/invitations/[id]/resend|revoke|decline/route.ts`; protected, not touched). Consequence for Help: the [VERIFY] paragraph in section 4 stays, with "cancel" corrected to "revoke" as the screen says.

### (c) Help route — `/help` [V for feasibility]

- No `src/app/help` exists; no collision with any page or API route.
- Guarding follows `/profile`: `src/app/profile/layout.tsx` calls `protectPage([AppRole.ADMIN, AppRole.MEMBER])` and renders `Navbar` only. A new `src/app/help/layout.tsx` and `page.tsx` do the same. Both files match the allowed pattern `src/app/**/page.tsx, layout.tsx … and the new Help route`. `protectPage` lives in the protected `src/utils/supabase/actions`; it is imported, not changed.
- `src/proxy.ts` and the middleware only refresh the session ("let layouts handle auth"), so no protected route list needs an entry.
- Navigation entry: the links array at `src/components/global/Navbar.tsx:78-80` (desktop and mobile render from it) and the account menu. All in `src/components/global/**`.
- Links from Help to Account & Billing reuse the existing movement already used by `BillingScreen.tsx:93` and `AddStoreButton.tsx:30`: `${peerOrigin()}/api/handoff/start?return=…`. No new mechanism.

### (d) Can the Portal serve the sample screens for comparison

| Sample | Route | Finding |
|---|---|---|
| 01 sign-in | `/login` | [V from source] Public. The page calls `getPortalUser()` (a session read), so the server needs the public Supabase URL and key configured, but no account and no data. [V] The production build succeeds with no environment file |
| 02 choose plan | `/register/plan` | Same: public, no account |
| 04, 04b dashboard | `/dashboard` | Needs a signed-in session on an account with pharmacies. The Portal has **no mock data mode** (only OwedBook has `NEXT_PUBLIC_APBM_DATA_MODE`). It must be viewed on a fixture account, never the rehearsal account |
| 03, 05 OwedBook | `/owedbook`, `/help` | OwedBook mock mode renders these without a database |

**[U]** An actual boot of either app was not done in this session: starting app servers outside a QA-authorized run is against a standing Director instruction to Engineering. Who serves the apps for Engineering's rendered self-checks, and on which backend, is item D-B3 in the plan.

### (e) Allowed paths versus the real components [V]

- Every non-test source file that carries a `className` sits inside the allowed lists of `CONTRACTS/NO_BREAK_AND_PATHS.md` section 3. Outside the allowed component folders the only styled files are `src/app/profile/ProfileForm.tsx` and `src/app/(public)/HomePageContent.tsx` (OwedBook) and `src/app/login/LoginPageContent.tsx` (Portal), all three named in the contract.
- Every customer-visible "Cyber Pharma" string is in an allowed path. OwedBook: `src/app/layout.tsx` (1), `(public)/HomePageContent.tsx` (1), `(public)/access-denied/page.tsx` (2), `components/global/Navbar.tsx` (2), `NavbarHome.tsx` (2), `NavbarLoginReg.tsx` (2). Portal: `src/app/layout.tsx` (2 customer-visible, 1 comment), `components/portal/brand.ts` (1), `src/server/billingNotices.ts` (5: the permitted exception). No test in either repository asserts the old name.
- Forced light needs no change to `src/app/providers/ThemeProvider.tsx` (not in the allowed list): the wrapper passes every prop through, so `forcedTheme="light"` is set from `src/app/layout.tsx`, which is allowed.
- Inter needs no dependency: both root layouts already import from `next/font/google`.
- Derived icons need no dependency: Pillow 10.2.0 is on the machine and `sharp` is already inside both `node_modules`.
- Logo files reach the deployed image and are public: neither ignore file excludes `public/` or image types, and both `src/proxy.ts` matchers skip `.png`.
- Three protected-path observations, with exact evidence, are in the plan, section 4.3. None blocks the contract.

### (f) Help draft versus the real access rules — found while closing (b) and (c) [V]

- `src/app/(admin)/layout.tsx` redirects anyone for whom `canAdminister(stores)` is false to `/owedbook`. `canAdminister` (`src/services/tenantScope.ts:22`) is true only for an Owner or Store admin. **A Member cannot open `/admin-portal` at all, so a Member has no "My Stores" page.** Help section 3 says "Who can use it: Everyone", and section 2's last bullet promises "a link back to My Stores". Both need correcting for Members.
- `src/server/billing.ts:119-123`: the Portal refuses to open a Stripe billing-portal session unless the configuration has `subscription_cancel.enabled === true` with mode `at_period_end`. So cancellation on the Stripe page is required by code, and it takes effect at the period end. The [VERIFY] sentence in Help section 8 is supported by source; the preview check in session S1 remains.
- Label pre-check against source is in the plan, section 8.
