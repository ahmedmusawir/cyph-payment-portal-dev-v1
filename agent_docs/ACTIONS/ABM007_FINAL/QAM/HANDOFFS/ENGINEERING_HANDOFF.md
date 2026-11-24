# ENGINEERING_HANDOFF — `ABM007_FINAL`

**Owner:** Engineer (Claudy) · **Written:** 24 November 2026, Asia/Dhaka · **Status: INTERIM ENGINEERING HANDOFF.** Engineering is not recorded as complete: step 9's email body waits on the Director's template export, and the signed-in rendered checks and redirect reproduction are blocked for lack of SCRATCH fixtures (section 8). Every QA result, approval and verdict field stays empty.

The Engineer's narrative for the QA Executor. `../QAM_MANIFEST.md` holds the tables; this file explains them. Everything here is a claim.

| # | Section | Content |
|---|---|---|
| 1 | What was built | See 1 below |
| 2 | What was deliberately not built | See 2 below |
| 3 | Decisions inside the Engineer's discretion | See 3 below |
| 4 | Where behavior could have changed | See 4 below |
| 5 | How to run both apps as production builds | See 5 below |
| 6 | What the Engineer verified and how | See 6 below |
| 7 | What the Engineer could not verify | See 7 below |
| 8 | Stops that occurred | See 8 below |
| 9 | Owned processes and temporary paths | See 9 below |
| 10 | Git reminder for the Director | See 10 below |

## 1. What was built (assignment steps, both repositories)

1. **Foundation.** The token file's `:root` block installed unchanged in OwedBook `globals.css` and Portal `globals.scss` (`.dark` blocks frozen). Tailwind radius scale (4/8/12/14/16/full), navy-tinted shadows, `heading`, `primary.hover`, `disabled`, `navbar`, `brand.*`, `shadow-tint` colors. Inter 400 to 700 via `next/font` (Saira removed). Light forced (`forcedTheme="light"`, `enableSystem={false}`; Portal's `className="dark"` removed). Theme-toggle mounts removed (5 OwedBook, 4 reachable Portal). OwedBook brand constant `src/components/global/brand.ts`. Logo master placed byte for byte in both; three icons derived by full-canvas scaling. Shared recipes (`.pb-*`) identical in both stylesheets.
2. **Shared components.** Button recipe (Title Case, 16px, ≥44px, hover token, disabled tokens), fields, cards (OwedBook `Card`; Portal `.pb-card` class applied to the reachable containers), pills, neutral role labels, notices, tables, menus, dialogs (navy scrim), headers (navy bar, logo tile, wordmark, labelled narrow-screen **Menu** button), sidebars and drawers (ice with navy rule).
3. **Literal pages.** OwedBook `/auth` and six auth pages through `AuthShell`; Portal `/login`, six auth pages and registration steps through `PublicShell` (navy backdrop) plus literal-aware `PageContainer` and `PageHeader` (masthead); stepper as step badges.
4. **Translated pages and panels.** OwedBook dashboard (KPI tiles as white cards with status rule, filter rail card, table card), admin pages, profile, invitations (brand bar only); Portal dashboard and billing; Add Pharmacy in panel mode.
5. **Help.** `/help` in OwedBook with the corrected text (`../../CONTRACTS/HELP_CONTENT.md` appendix), contents list, section cards and step badges; linked for every role.
6. **Selected fixes.** Store selector placeholder (AC-F01). Landing: dead links and demo button removed, names, logo, screenshot removed (P-08). Redirect reproduction: BLOCKED (section 8).
7. **Names.** "Cyber Pharma" removed from every customer-facing string in both apps; billing-notice brand strings in the Portal.
8. **Tests.** OwedBook: 3 presentation suites updated (AdminSidebar, StatusChip, Navbar.mobile), 4 new (token pin, forced light, Help, store selector). Portal: 4 new (token pin, forced light, notice wording). Stale-spec mapping written; 16 specs retired.
9. **External values.** Stripe values and files prepared. Email body **not** prepared (no export).
10. **Regression and handoff.** Full checks on working-tree copies; rendered public-page checks; this handoff, the manifest and the ledger.

## 2. Deliberately not built

The deferred items stay with their recorded owners and destinations (`../../CONTRACTS/BACKLOG_DISPOSITIONS.md` section 7): P-05, P-12 to P-17, zod advisory, dark theme, HTML notices, re-pointing stale specs. The optional dev-only style-tile route was not built (plan section 3). Unreachable Portal files were not restyled (one scrim token in `ui/dialog.tsx` excepted, `../../EVIDENCE/E2/LEFTOVERS.md`). The old-logo reference in `references/EmailPreview.tsx` was not changed (outside allowed paths; exception requested).

## 3. Decisions inside the Engineer's discretion

- Help route `/help`, guarded with the same `protectPage([ADMIN, MEMBER])` as `/profile`.
- One card treatment per app: OwedBook's `Card` primitive plus `.pb-card`; the Portal uses the `.pb-card` class (no new component).
- Literal layout in the Portal via a small React context (`layoutMode.tsx`): `PublicShell` provides "literal", `AddStoreFlow` provides "panel"; `PageContainer` and `PageHeader` read it. No route or guard changed.
- Forced light at the root layout only; the theme provider wrapper (protected-adjacent, PP-2) untouched.
- Links inside tinted notices use charcoal bold text, because green on a tint falls below 4.5:1.
- Narrow-screen menu buttons gained the visible word **Menu** (accessible names unchanged).
- `/invitations` got the navy brand bar only; no guard or navigation added.
- Landing screenshot removed rather than replaced (a clean capture needed a signed-in session).

## 4. Where behavior could have changed

Presentation edits in files that also carry logic; each was re-read after editing:

- OwedBook `StoreSelector.tsx` (the fix: placeholder now conditional).
- OwedBook `Navbar.tsx` (links array gained Help; mobile panel rebuilt; theme toggle and its close handler removed; role badge markup duplicated for the drawer with the same `data-testid`).
- OwedBook `MobileNav.tsx`, `NavbarHome.tsx`, `UserMenu.tsx` (marketing links removed).
- OwedBook `AuthedShell.tsx`, `AdminSidebar.tsx` (classes only; focus handling untouched).
- OwedBook `LoginForm.tsx`, `LinkRequestForm.tsx`, `AuthPages.tsx` (wrappers and classes; handlers, field names and test ids unchanged; the login card title moved to the masthead).
- OwedBook `LiveStaffPanel.tsx`, `MemberRow.tsx`, `ProfileForm.tsx` (classes; role label markup).
- OwedBook `(auth)/layout.tsx` (no longer mounts `NavbarLoginReg`).
- Portal `Shell.tsx` (drawer items gained `aria-current`; theme toggles removed), `PublicShell.tsx` (rebuilt; same links), `PageHeader.tsx` and `Loading.tsx` (now client modules reading layout mode), `AddStoreFlow.tsx` (wrapped in panel mode; logic unchanged), `FormField.tsx` (field and error classes).
- Portal `src/server/billingNotices.ts` (five strings; the stored fingerprint of subject plus text changes with the wording, as the contract notes).

## 5. How to run both apps as production builds

From each repository root, after `npm ci`: `npx next build` then `npx next start -p <port>`. Configuration from that repository's environment file (names in the manifest section 5). Engineering ran the builds from isolated copies with placeholder public values only (`../../EVIDENCE/E2/VERIFICATION.md` section 1).

## 6. What the Engineer verified and how (CLAIMS)

Full detail and exit codes: `../../EVIDENCE/E2/VERIFICATION.md`. In short: unit OwedBook 389/389, Portal 580/580; typecheck, lint (warnings equal baseline) and build exit 0 in both, on copies bound by hash to the working-tree inventory. Public pages of both built apps at 375 and 1440 with dark OS and saved dark theme: light rendered, exact token colors (control flagged), no overflow, Inter, no theme control, no old name. No hardcoded colors (scanner with control). Protected paths clean apart from the permitted notice strings. Pricing files unchanged. Not used: the rehearsal account, any DEV-backed session, any purchase, any dashboard.

## 7. What the Engineer could not verify

Every signed-in screen (both apps), including the Help page content as each role, Add Pharmacy, dashboards, admin pages and AC-F01's per-role states; the redirect reproduction; rendered contrast across states; WebKit and Firefox; live email; Stripe previews; webhook routing. Browser specs and Portal integration tests were not run.

## 8. Stops that occurred

| # | Stop | Evidence | Owner | Resolution needed | Resume point |
|---|---|---|---|---|---|
| S-1 | Step 9 email body: the Director's export of the live template (X-1) has not arrived | `../../EVIDENCE/E2/PREPARED_EXTERNAL_VALUES.md` §1 | Director (session S1) | Provide the unchanged export | Prepare the body and subject inside the existing branches, write the line diff, update AC-E01 in the ledger |
| S-2 | Signed-in rendered self-checks, redirect reproduction and landing capture: no SCRATCH fixtures or configuration on this machine; DEV-backed sessions forbidden (AM-08 (5)) | `../../EVIDENCE/E2/REDIRECT_REPRODUCTION.md`; `VERIFICATION.md` §3 | Director | An existing SCRATCH identity per role and a non-secret way to point builds at SCRATCH, or confirm these checks pass wholly to independent QA | Run `tools/rendered_checks.cjs` on signed-in routes and the planned redirect routes |
| S-3 | AC-N02 old-logo reference in the unreachable `src/components/portal/references/EmailPreview.tsx:62` (outside the allowed paths) | `../../EVIDENCE/E2/LEFTOVERS.md` L-9 | Director | One of: authorize the one-line asset reference change; rule unreachable reference modules out of AC-N02; authorize deleting them | Apply the ruling, rerun the reference scan |

Each stop held only its own task.

## 9. Owned processes and temporary paths

- Processes: `next start` on ports 3300 and 3301 (and their `next-server` children), started for the rendered checks, **stopped** at 04:37Z; ports confirmed closed. Nothing left running.
- Temporary paths (outside both repositories, in the session scratchpad): the two verification copies `…/scratchpad/ob` and `…/scratchpad/pp` (with copied `node_modules` and build output), `…/scratchpad/icons`, server logs. No environment file in any of them. Safe to delete.

## 10. Git reminder for the Director (prepared, not executed)

Read actual state first and compare with `../../EVIDENCE/E2/INVENTORY_*.txt`; every path under the directories named below is this module's work. No blanket staging.

**OwedBook** (`cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`):

```
git status --short
```
```
git add -- src tailwind.config.ts public/brand/pharmacy-books-logo-primary.png CHANGELOG.md agent_docs/SESSIONS/session_2026-11-24.md agent_docs/RESPONSES
```
```
git diff --cached --name-status 9597699b404afdbcd792a9b4da61c21abb10cdf8
```
```
git commit -m "feat(abm007-final): Pharmacy Books brand, Help page, store selector fix, light only"
```

**Portal** (`cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`):

```
git status --short
```
```
git add -- src tailwind.config.ts public/brand/pharmacy-books-logo-primary.png e2e agent_docs/ACTIONS/ABM007_FINAL agent_docs/RESPONSES session_2026-11-24.md CHANGELOG.md
```
```
git diff --cached --name-status cb4decde9adc9ab75d0dcb15556c64a3bdbfe075
```
```
git commit -m "feat(abm007-final): Pharmacy Books brand, literal and panel layouts, notice wording, stale spec retirement; module records"
```

`git add -- e2e` stages the 16 spec deletions. The module folder includes the large evidence screenshots and logs under `EVIDENCE/E2/`; leave them out if you prefer them only in the ZIP. Then, when you choose, create `qa/abm007-final` in each repository at the new commits and push; record both full SHAs in `../QAM_MANIFEST.md` section 1.

## 11. E2 completion update (24 Nov, Director instruction `../../SOURCES/DIRECTOR_E2_CONTINUATION_2026-11-24.md`) — status: E2 INTERIM

Sections 1 to 10 stand except where this section supersedes them.

### 11.1 What changed in this round

| Repository | File | Change |
|---|---|---|
| Both | `src/app/globals.css` / `globals.scss` | Surface-aware focus: `--pb-focus-ring` set by surface (navy surfaces white; white surfaces and tints navy); the descendant override removed |
| Both | `tailwind.config.ts` | `ring` color reads `--pb-focus-ring` with a fallback to `--ring` |
| OwedBook | `src/components/global/Navbar.tsx` | Signed-in mobile panel marked `pb-on-light` and **returned to the page flow** (my E2 overlay obscured focus; the baseline was in-flow) |
| OwedBook | `src/components/global/MobileNav.tsx` | Landing mobile panel marked `pb-on-light` |
| OwedBook | `src/components/help/HelpPage.tsx` | Role table from one data source: a table from md, stacked labelled pairs below; minimum width removed; caption added |
| OwedBook | `src/__tests__/abm007/focus-surface.test.ts` (new), `help-page.test.tsx` (one test added) | Pins for the focus rule, the light markers and the stacked content |
| Portal | `src/components/portal/Footer.tsx` | Skip link carries `pb-on-dark` (it always shows over the navy top band) |
| Portal | `src/__tests__/abm007/focus-surface.test.ts` (new) | Pins for the focus rule and the skip link |

Details: `../../EVIDENCE/E2/SOURCE_REVIEW_CORRECTIONS.md`. No protected path, dependency, migration, guard, Stripe code or server code changed in this round.

### 11.2 Verification (exact commands and outcomes)

`../../EVIDENCE/E2/VERIFICATION.md` section 5. In short:
- Copies were bound by hash: OwedBook 408 files, Portal 289.
- `npx jest --ci`: 394/394 and 584/584. `npx tsc --noEmit -p .`: exit 0 in both. `npx eslint .`: exit 0, with 38 and 27 warnings, equal to baseline. `npx next build`: exit 0 in both.
- Rendered checks (`tools/rendered_checks_v2.cjs`) on 22 public loads at 375 and 1440 px, with a dark OS setting and a saved dark theme:
  - the `dark` class never appeared from document creation onward, and was absent with scripts off;
  - exact tokens, Inter, 0 overflow;
  - 154 of 154 keyboard focus stops at 3:1 or better on their actual surfaces, none obscured, and the failing control was flagged;
  - mobile menus walked;
  - Help markup stacked at 375 and shown as a table at 1440.
- Servers on ports 3300 and 3301 ran 07:52:00Z to 07:53:54Z and were stopped; the ports were confirmed closed.

### 11.3 Stops (current status)

| # | Status | Exact missing input | Affected acceptance criteria |
|---|---|---|---|
| S-1 | **OPEN, narrowed.** Subject (`Your Cyber Pharma sign-in link` → `Your Pharmacy Books sign-in link`), sender display name (`Cyber Pharma` → `Pharmacy Books`, address unchanged) and heading text (`Sign in to Cyber Pharma` → `Sign in to Pharmacy Books`) are prepared from the Director's observation | **X-1a: the original HTML of the DEV Magic Link template.** It is not in any local record or session transcript, and nothing was reconstructed | AC-E01 (and through it AC-E02's appearance rows) |
| S-2 | **OPEN, corrected.** SCRATCH connection settings exist (OwedBook `.env.local`, `APBM_SCRATCH_*`); the earlier "no configuration" wording was wrong | **Designated existing SCRATCH identities (Owner, Store admin, Member) and a permitted way to sign them in** without Engineering receiving emailed links or minting sessions with the service key (AM-08 (5)) | AC-L02, AC-L03, AC-H01 (rendered per role), AC-H03 (rendered), AC-F01 (rendered states), AC-F02, and the signed-in parts of AC-B06, AC-B07, AC-B08 and AC-L04 |
| S-3 | **OPEN, unchanged.** Exact one-line proposed exception recorded | **Director ruling** on `src/components/portal/references/EmailPreview.tsx:62` (apply the one line; or rule unreachable references out of AC-N02; or authorize deletion) | AC-N02 |

None of these is marked passed, waived or transferred to QA.

### 11.4 Narrowly scoped approvals still required

1. S-3: the one-line exception, or another ruling.
2. S-2: designation of the SCRATCH identities and the sign-in means.
3. S-1: the template HTML. This is an input, not an approval.
4. Before the Director applies the external settings: the pre-check of alpha's portal configuration ending (`EXTERNAL_SETTINGS_PLAN.md` 3.0).
5. Walkthrough W-7 (opening a live Checkout without paying) needs its own authorization. W-11 (payment exceptions) needs the deferred work order (P-12).

### 11.5 Checks by owner

| Completed by Engineering (claims) | Independent QA (Gate Q) | Deployed services or Director action |
|---|---|---|
| Unit, typecheck, lint, build on the final trees. Token pins, focus pins, Help stacked-content test. Rendered public pages: tokens, Inter, light-only first paint, overflow, keyboard focus contrast, public mobile menus. Help markup at 375 and 1440. Source scans (colors, names, protected paths, prices) | All AC rows in `../AC_EVIDENCE_MATRIX.md`, including every signed-in screen per role, rendered text contrast across states (AC-B08), WebKit and Firefox, the journeys (AC-R04), Help content per role and AC-H03 as interpreted by the Architect, the email diff review (AC-E01, once S-1 closes) | `../../EVIDENCE/E2/EXTERNAL_SETTINGS_PLAN.md` (Director applies), `../../EVIDENCE/E2/DEPLOYED_WALKTHROUGH.md` W-1 to W-11: fresh sign-in emails and link targets in both apps, invitations, deployed branding, handoff, Stripe previews and pages, the real billing portal, invoices and receipts, notice timing, and the deferred payment exceptions |

### 11.6 Git (Director only; prepared, not executed)

This supersedes section 10's directory-level `git add` lines with exact file lists.
- The exact lists are `../../EVIDENCE/E2/STAGING_LIST_owedbook.txt` and `../../EVIDENCE/E2/STAGING_LIST_portal.txt`: one path per line, every modified, new and deleted path, no directories.
- Stage with `git add --pathspec-from-file=<list>` from each repository root, after reading `git status --short` and comparing it with the list.
- Then run `git diff --cached --name-status <baseline>` and commit. Branch creation and push stay with the Director.

## 12. Engineering completion (24 Nov, AM-14 to AM-16) — status: **E2 COMPLETE (ENGINEERING COMPLETE — AWAITING QA BRANCH)**

Sections 1 to 11 stand except where this section supersedes them. Everything here is a claim for independent QA; verdicts stay with Friday.

### 12.1 What changed in this round

| Repository | File | Change |
|---|---|---|
| Portal | `src/components/portal/references/EmailPreview.tsx` | The S-3 exception, exactly as granted: `/brand/pharmacy-books-logo-primary.png`, `h-7 w-auto` (one line; module kept) |
| OwedBook | `src/components/admin-portal/ScreenHeader.tsx` | Title and action row may wrap: the Owner's **Add store** block no longer pushes Billing 142 px wide at 375 (pre-existing; found by the signed-in check) |
| OwedBook | `src/components/common/DataTable.tsx` | Stacked-card labels and values wrap long unbroken text: Audit no longer 19 px wide at 375 (pre-existing; same) |
| Records | `EVIDENCE/E2/email/` | S-1: original template saved byte for byte, amended copy, one-line diff (`email/README.md`) |
| Records (tooling) | `EVIDENCE/E2/tools/scratch_proof/` | SCRATCH automated authentication and signed-in checks (12.4) |

No protected path, guard, auth flow, dependency, migration, deployment file, URL or callback changed. Nothing was done for the future OwedBook beta.

### 12.2 Verification

`../../EVIDENCE/E2/VERIFICATION.md` section 6 has the details:
- Affected checks on the final trees: OwedBook 394/394, Portal 584/584; typecheck, lint (38 and 27 warnings, equal to baseline) and the SCRATCH builds exit 0.
- Signed-in checks: 68 page loads (Owner, Store admin, Member; both apps; 375 and 1440 px):
  - light from document creation, exact tokens, Inter;
  - 0 overflow after the two fixes;
  - every keyboard focus stop passing on its actual surface;
  - mobile menus walked;
  - Help anchors 13/13 per role, and Help app links per role;
  - store selector by role.
- AC-F02: 2 × 20 runs, not reproduced. Observation O-1 (WebKit timing) is recorded for QA.

### 12.3 Stops

| # | Status |
|---|---|
| S-1 | **CLOSED for engineering.** The original HTML was received (AM-16); the amended body and diff are prepared. Applying it is the Director's step in S2, after deployment |
| S-2 | **CLOSED.** Existing SCRATCH fixtures were designated (AM-14) and automated authentication was established (AM-15); signed-in checks and the reproduction were run |
| S-3 | **CLOSED.** The exception was applied exactly; AC-N02 reference scan clean |

### 12.4 Reusable SCRATCH setup for independent QA (Cody)

Full guide: `../../EVIDENCE/E2/tools/scratch_proof/README.md`.

| Item | Value |
|---|---|
| Target | SCRATCH `ihgcsrypblqkwommrkgj`, verified by `scripts/apbm007b/lib/env.mjs` `scratchTarget()` (API and SQL reference; fails closed for DEV `yrsuwikjnbmvpznrgydb` and anything else) |
| SCRATCH connection names | OwedBook `.env.local`: `APBM_SCRATCH_DB_URL`, `APBM_SCRATCH_SUPABASE_URL`, `APBM_SCRATCH_PUBLISHABLE_KEY`, `APBM_SCRATCH_SECRET_KEY` (values never printed) |
| Fixture cast (non-secret location) | `~/.apbm007b/engineering_cast.json` (0600): `ENGINEERING_OWNER_A`, `ENGINEERING_OWNER_B` (passwords), `ENGINEERING_ADMIN`, `ENGINEERING_MEMBER` (no passwords; token path) |
| QA's own earlier private folder | `~/.apbm007b/apbm007b-qa-20261117T073513Z-e131c0ca/` (QA cast and mappings; not read by Engineering) |
| Proof pair | OwedBook 3100, Portal 3101 (`local-proof`, already allowed by both apps' `appIdentity`) |
| Browsers | Google Chrome; WebKit at `/home/moose/APBM007B_REPAIR_R2/browsers` |
| Proposed tooling path | `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/`, for SCRATCH-only automated sign-in and checks. The Director rules whether QA uses it in place or copies it into a QA lane. `serve.mjs` accepts copies only under this session's scratchpad (one prefix check to change in a QA copy) |
| Limits | Proves authenticated behavior only. Email delivery, the emailed-link lifecycle and the alpha handoff stay in `DEPLOYED_WALKTHROUGH.md` W-1 to W-5. Effects are limited to sign-in, session, audit and handoff records plus `generateLink` tokens (no email). Never package the cast, keys, tokens, cookies, browser state or unmasked screenshots |
| Effects used by Engineering | 8 password and 50 token sign-ins; no business data, password, user or DEV change |

### 12.5 Checks by owner (supersedes 11.5)

| Completed by Engineering (claims) | Independent QA (Gate Q; Friday's verdicts) | Deployed services or Director action |
|---|---|---|
| Everything in `VERIFICATION.md` §5 and §6. The S-1 diff. The S-3 line and AC-N02 scan. The AC-F02 bounded reproduction | Every AC in `../AC_EVIDENCE_MATRIX.md`, including the following, and anything QA chooses to rerun with its own builds and the setup above: rendered text contrast across states, Firefox and WebKit pages, AC-F01 zero-store and removed-access states, the journeys (AC-R04), the email diff review (AC-E01), O-1 | Applying `EXTERNAL_SETTINGS_PLAN.md` (including the 3.0 configuration-ending check and the email in S2); `DEPLOYED_WALKTHROUGH.md` W-1 to W-11; Git; leftovers removal (`LEFTOVERS.md`); deployment authorization |

### 12.6 Git (Director only; prepared, not executed)

- Exact lists: `../../EVIDENCE/E2/STAGING_LIST_owedbook.txt` and `STAGING_LIST_portal.txt`; review ZIPs in `STAGING_LIST_portal_optional.txt`.
- From each repository root: read `git status --short`, compare with the list, then run `git add --pathspec-from-file=<list>` and `git diff --cached --name-status <baseline>`. Commit.
- Then create `qa/abm007-final` at the new commits when the Director chooses, and record both SHAs in `../QAM_MANIFEST.md` section 1.

## 13. Final documentation-only handoff preparation (24 Nov, after the Architect's review of package 03)

**Architect disposition (journal v0.5 Entry 005):** "Accept engineering completion for QA intake, with the QAM documentation amendment to be installed before candidate handoff. This is not Gate Q, release or final module closeout." The module state stays `ENGINEERING COMPLETE — AWAITING QA BRANCH`. Sections 1 to 12 stand; this section corrects and supersedes them where it says so.

### 13.1 QAM Amendment 01 installed (ruling AM-17)

- `../QAM_AMENDMENT_01.md` was added verbatim. Its SHA-256 is `72206961eb6dc3d5b11abb2f9cd2051526920e1279885c6cae5289d3bf770919`, equal to the supplied copy.
- Pointer blocks were appended, exactly as written in the QA Lead's install instructions, to: `QAM_ENTRY`, `QAM_RISK_REQUIREMENTS`, `QAM_RECON_REPORT`, `QAM_TEST_PLAN`, `QAM_APPROVAL`, `QAM_EXECUTION_REPORT`, `AC_EVIDENCE_MATRIX`, `FINDINGS`, `QAM_CLEANUP_REPORT` and `QAM_CERTIFICATION`.
- One row was added to the `QAM_STATE` transition log, with the state unchanged.
- Install report: `../../EVIDENCE/QAM_AMENDMENT_01_INSTALL/INSTALL_REPORT.md`.
- Every "NOT RECORDED" and "PENDING" stays as written. No QA field was filled.

### 13.2 Corrections to the engineering record (carry into Q1 exactly)

| Item | Accurate statement | Supersedes |
|---|---|---|
| Stops | S-1 to S-3 are **closed for engineering**. S-1: the template is prepared, not applied | 12.3 (unchanged in substance) |
| External settings | Email template, SMTP name, Stripe branding, Checkout and the portal headline are **prepared, not applied**; their application is the Director's, after deployment authorization (`EXTERNAL_SETTINGS_PLAN.md`) | — |
| AC-F02 runs | **Each** of the two reproduction attempts had **18 complete routes and 2 interrupted routes** (WebKit warm iterations 2 and 4). It is **not** 40 clean completed journeys. No run reached a sign-in page. The defect was not reproduced | 12.2 "AC-F02: 2 × 20 runs, not reproduced", which omitted the split |
| O-1 | WebKit navigation interruption, cause unproven. It remains **for independent QA**: not a declared product defect, not a waived finding | — |
| Build-check evidence | Three failed runs of the backend **check** (the builds themselves exited 0) preceded the final passing check. All are kept: `../../EVIDENCE/E2/signed_final/SCRATCH_BUILD_INSTRUMENT_HISTORY.md`, `../../EVIDENCE/E2/verify4/logs/summary.txt` (`scratch build exit=1`) and the final `scratch_build_check.json` (both `backend_ok: true`) | — |
| QA copy of the tooling | QA may copy `tools/scratch_proof/` into its declared QA lane for independent review and adaptation. **Two** prefix checks exist (`serve.mjs` C-2, `auth.mjs` C-6), plus the other runtime and path constraints now documented in comment blocks in both files and in the README section "Copying into a QA lane". No reset, fixture creation, credential change or provider mutation is authorized by this handoff | 12.4 "one prefix check to change in a QA copy" (wrong) |
| Session-method labels | Under QAM_AMENDMENT_01 section 6, Engineering's signed-in results used a **fixture session** (provider token: Store admin and Member) or a **password sign-in** (Owner A). None is an emailed-link sign-in. None proves email delivery, the emailed-link lifecycle, or the handoff after a real sign-in | §12.4 limits (consistent) |

### 13.3 Carry into Q1 (journal Entry 005)

- O-1.
- Zero-store and removed-access rendered states (AC-F01).
- Independent contrast across states (AC-B08).
- The browser matrix, including Firefox.
- Real normal sign-in and handoff requirements, with their own evidence (AR-3).
- Candidate identity from the Director's receipt.
- The new human-walkthrough and regression provisions (QAM_AMENDMENT_01; AR-1 to AR-4).

External email and Stripe application, and the deployed checks, are tracked separately. No beta deployment change belongs in this module. REG-001 is not built here; central Factory doctrine synchronization (DC-001, DC-002) is a separately tracked action.

### 13.4 Delta from package 03

Documentation only. Every product, config, test and asset file in both repositories is byte-identical to package 03's inventory: OwedBook 91 paths; Portal 51 paths plus the same 16 deletions. No product test was rerun for this packaging, because the passed results bind to unchanged files. The changed files are listed in `INSTALL_REPORT.md` section 6.

### 13.5 Candidate identity

`QAM_MANIFEST.md` section 1 "Implementation identity" stays **PENDING** in both repositories until the Director commits. Q1 records the actual candidate identities from the Director's receipt.

### 13.6 Director commands (prepared, not executed)

Exact lists: `../../EVIDENCE/E2/STAGING_LIST_owedbook.txt`, `STAGING_LIST_portal.txt`; optional ZIPs in `STAGING_LIST_portal_optional.txt`. Full command set, proposed commit messages and the commands that create `qa/abm007-final` at the new commits: `../../EVIDENCE/E2/DIRECTOR_GIT_COMMANDS.md`.
