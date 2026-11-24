# ABM_EXECUTION_PLAN — ABM007_FINAL

**Owner:** Engineer (Claudy) · **Version:** DRAFT 01 · **Date:** 24 November 2026, Asia/Dhaka

**Status: DRAFT ENGINEERING PLAN, RETURNED FOR REVIEW.** Written on the Director's instruction of 24 November, which authorized entry checks and a draft plan while the pack is still a review candidate. This plan does not freeze the contract, does not settle any proposed position, and releases nothing. Nothing in either product was changed.

| Field | Value |
|---|---|
| Plan version / hash | DRAFT 01. SHA-256 is in the review package's `FILE_INDEX.json` |
| Planning basis | The pack's recommended included/deferred split (`ABM_RULINGS.md` section 4, group 2), as a **proposal**. Positions P-01 to P-22 stay pending until the Director rules |
| Architect review | NOT RECORDED |
| Director release | NOT RECORDED |

## 1. Summary

1. **Entry checks E-1 to E-6 are done.** Both baselines are healthy: unit suites, typecheck, lint and production build all pass in isolated copies (OwedBook 374/374, Portal 572/572).
2. **The allowed paths can deliver the contract.** Every styled file and every customer-visible old-name string sits inside the allowed lists. No dependency, migration or protected-path edit is needed.
3. **One state difference from the instruction:** the OwedBook record files are no longer uncommitted. They were committed at 07:54 today as `c335671` (records only, local, not pushed). OwedBook HEAD is therefore one commit past the recorded baseline.
4. **The "No permitted stores" cause is found:** one line in one OwedBook file.
5. **The Help draft has statements that do not match the product** (a Member has no My Stores page; the OwedBook menu says "Logout", not "Sign out"). Listed in section 8.
6. **Estimate for the proposed scope: 8.5 to 12 engineering working days.** Not a date.
7. **Six decisions are needed before building** and they are collected in section 12, apart from those needed only before QA or deployment.

## 2. Entry-check results

Full evidence: `EVIDENCE/PLAN/ENTRY_CHECKS.md`, with logs in `EVIDENCE/PLAN/logs/` and diffs in `EVIDENCE/PLAN/diffs/`.

| Check | Result | Key evidence |
|---|---|---|
| **E-1 Identity** | Portal: `abm007-final` at `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075`, equal to the baseline, in sync with its remote; one untracked folder (the pack). OwedBook: `abm007-final` at `c335671afa6cd4a8a2d437c30aeae5040e0cecaf`, **one commit ahead of the baseline `9597699…` and of its remote**; tree clean. No stashes, one worktree each, remotes as in the brief, no credentials in remote URLs | `ENTRY_CHECKS.md` E-1 |
| **E-2 Records in the tree** | The reported OwedBook record changes are now commit `c335671` ("Starting ABM007_Final", 24 Nov 07:54:00 +0600): `CHANGELOG.md`, `RECOVERY.md`, two session logs and the pointer. Records only. Nothing was lost between the 07:52 report and the commit | Full diff read: `diffs/E2_owedbook_9597699_to_c335671.diff` |
| **E-3 Branches** | Both clones hold only `abm007-final` and `main` locally. Remote-tracking: 18 branches (OwedBook), 6 (Portal). Every commit either clone's HEAD ever pointed at is contained in a current ref; 0 unreachable commits. Three branch names have no ref today (`apbm-007a` in both, `qa/apbm-007a` in the Portal); their commits are reachable elsewhere. **The Director's earlier receipt is not in the pack**, so the comparison is against the reflogs. Nothing is asserted about deliberate deletion or preservation | `ENTRY_CHECKS.md` E-3 |
| **E-4 Deployed versus baseline** | OwedBook `ef4cebc` → `9597699`: 7 paths. Portal `6dd3de7` → `cb4decd`: 7 paths. All are records (`CHANGELOG.md`, `DEPLOYMENT_CHECKLIST.md`, `RECOVERY.md`, files under `agent_docs/`). No product, dependency, deploy or migration path. Alpha is product-identical to the baselines, per the repositories' deployment records | `diffs/E4_*.diff` |
| **E-5 Baseline health** | All eight runs exit 0. OwedBook: 54 suites, 374 tests. Portal: 32 suites, 572 tests. Typecheck and `next build` clean in both; lint has 0 errors in both, with existing warnings (OwedBook 38, Portal 27) (Next.js 16.4.5, Node 22.17.0) | `logs/summary.txt` and eight logs |
| **E-6 Gaps** | (a) "No permitted stores": `StoreSelector.tsx:8`, placeholder option rendered regardless of store count. (b) Resend, Revoke and Decline controls all exist. (c) Help route: `/help`, guarded like `/profile`. (d) Portal sign-in and choose-plan pages are public and need only public configuration; the dashboard needs a signed-in fixture account because the Portal has no mock mode. Not booted in this session | `ENTRY_CHECKS.md` E-6 |

Not verified in this session, with the check that would close each:

| Item | Closing check |
|---|---|
| Whether the three ref-less branch names still exist on GitHub | `git ls-remote --heads origin` in each repository, or the GitHub branch page (read-only; not run because it contacts the remote) |
| That alpha still runs `ef4cebc` and `6dd3de7` | One GET of `/api/build-info` on each alpha service |
| That either app boots and renders on this machine today | Decision D-B3 |
| Browser specs and the three Portal integration tests at baseline | Need running servers, a private fixture file and database settings |

## 3. Proposed scope

Planning basis only. Each line shows the position it depends on.

**Included (proposed):**

| # | Work | Depends on |
|---|---|---|
| 1 | Brand foundation in both apps: token block, Inter, radius and shadow scale, forced light, theme-control mount points removed | D-01; P-01 to P-04 (Gate V reconfirmation pending) |
| 2 | Shared components restyled in both apps | Brand contract section 4 |
| 3 | Literal layout: sign-in and auth pages in both apps, Portal registration steps | D-02 |
| 4 | Translated layout: dashboards, admin pages, profile, invitations; Add Pharmacy and Help as a panel inside navigation | D-02 |
| 5 | Names and logo: three approved names, logo master, derived icons, OwedBook brand constant, "a Cyber Pharma product" removed | D-03, D-06; P-22 |
| 6 | Help page in OwedBook at `/help` | D-08 |
| 7 | "No permitted stores" fix | P-10 |
| 8 | Bounded reproduction of the Store-admin redirect; repair only if reproduced | P-11 |
| 9 | Minimal landing-page update | P-08 |
| 10 | Billing-notice wording (names only, plain text kept) | P-07 |
| 11 | Stale-spec mapping table; retire the 16 Portal specs that target removed `/demo` routes | P-09 |
| 12 | Presentation-coupled unit tests updated; token-pin and forced-light tests added in each repository | Acceptance B and R groups |
| 13 | Prepared values for the Director: restyled sign-in email body with line diff; Stripe branding values and files | D-10; P-06; needs the external inputs in section 9 |
| 14 | Engineering handoff for the QAM | `ABM_ENTRY.md` section 7 |

**Deferred (proposed), unchanged from the pack:** statement descriptor (P-05), forced payment exceptions (P-12), scheduler and expiry (P-13), transfer and populated claims (P-14), APA code (P-15), full password matrix (P-16), older usability items (P-17), zod advisory, dark theme, HTML notices, re-pointing the stale specs.

**Not built, by my recommendation:** the optional dev-only style-tile route (`ABM_ENTRY.md` section 4). The static tile in `DESIGN/` already serves the comparison, and a route that must be kept out of the production build is extra surface for no acceptance criterion.

## 4. Affected paths

Existence of every existing path below was checked today. "New" marks files this module creates.

### 4.1 OwedBook `cyph-v1-dev`

| Area | Paths | Change |
|---|---|---|
| Foundation | `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx` | Token block from `DESIGN/tokens/abm007_final_tokens.css`; explicit radius values and `boxShadow` names; Inter 400 to 700 replacing Saira; `forcedTheme="light"`, `enableSystem={false}`; page title and description |
| Brand constant | New `src/components/global/brand.ts` | The three names in one place, mirroring the Portal's `brand.ts` |
| Logo and icons | New `public/brand/pharmacy-books-logo-primary.png`; `src/app/icon.png` (replaced); new `src/app/apple-icon.png`, `src/app/favicon.ico` | Master placed byte for byte, hash re-checked; icons by whole-image scaling and padding only |
| Headers and navigation | `src/components/global/Navbar.tsx`, `NavbarHome.tsx`, `NavbarLoginReg.tsx`, `MobileNav.tsx`, `UserMenu.tsx`; `src/components/layout/AuthedShell.tsx`, `AdminSidebar.tsx`; `src/app/(auth)/layout.tsx` | Navy header, logo tile, names, Help entry, five theme-toggle mounts removed (`Navbar.tsx:175`, `:242`; `NavbarHome.tsx:50`, `:55`; `NavbarLoginReg.tsx:20`), dead landing links removed (`MobileNav.tsx:13-15` and their desktop twins) |
| Primitives | `src/components/ui/**` (button, card, input, select, textarea, password-input, badge, dialog, dropdown-menu, tabs, toast, command and the rest as needed) | Button recipe (hover token, disabled token, 1px outline), radius, shadows, scrim tint |
| Screens | `src/components/owedbook/**`, `src/components/admin-portal/**`, `src/components/auth/**`, `src/components/invitations/**`, `src/components/common/**`, `src/app/profile/ProfileForm.tsx`, `src/app/(public)/HomePageContent.tsx`; presentation in `src/app/**/page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx` | KPI tiles, status pill recipe, filter rail, access banner, role labels, cards, literal auth layout, landing page |
| Fix | `src/components/owedbook/StoreSelector.tsx` | Placeholder shown only while loading or with zero stores |
| Help | New `src/app/help/layout.tsx`, `src/app/help/page.tsx`; new folder `src/components/help/` | Guarded page, contents list, section cards, step badges |
| Landing | `public/landing/**` | Screenshot replaced by a mock-mode capture of the rebranded dashboard, or removed if the capture is not clean |
| Tests | `src/__tests__/**` | Updates listed in section 6.3; new pin, forced-light, Help and selector tests |

### 4.2 Portal `cyph-payment-portal-dev-v1`

| Area | Paths | Change |
|---|---|---|
| Foundation | `src/app/globals.scss`, `tailwind.config.ts`, `src/app/layout.tsx` | Same token block; adds `--navbar`; `.portal-link` recipe replaced; `className="dark"` removed from `<html>`; `defaultTheme="light"`, `forcedTheme="light"`; Inter; page title and description |
| Brand | `src/components/portal/brand.ts`, `Brand.tsx`, `Footer.tsx` | Footer line without "a Cyber Pharma product"; logo tile |
| Logo and icons | New `public/brand/pharmacy-books-logo-primary.png`; `src/app/icon.png`, `src/app/favicon.ico` (replaced); new `src/app/apple-icon.png` | As OwedBook |
| Shells | `src/components/portal/Shell.tsx`, `PublicShell.tsx`, `PageHeader.tsx` | Navy bar; four reachable theme-toggle mounts removed (`Shell.tsx:102`, `:133`; `PublicShell.tsx:28`, `:39`); literal shell and masthead |
| Card | New shared panel component in `src/components/portal/` | One card treatment applied to the reachable containers (about 40) |
| Primitives | `src/components/ui/**`; `src/components/portal/Pill.tsx`, `Alert.tsx`, `FormField.tsx`, `RadioCard.tsx`, `Stepper.tsx`, `DataTable.tsx`, `EmptyState.tsx`, `ErrorSummary.tsx`, `Loading.tsx`; `src/components/common/SpinnerLarge.tsx` | Buttons lose uppercase and semibold; step badges; pills; spinner colors to tokens |
| Screens | `src/components/portal/register/**`, `activation/**`, `account/**`; `src/app/login/LoginPageContent.tsx`; `src/components/auth/**`; presentation in `src/app/**/page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx` | Literal and translated layouts; Add Pharmacy as a panel inside navigation |
| Billing notices | `src/server/billingNotices.ts` lines 12, 26, 29, 33, 36, **strings only** | "Cyber Pharma" replaced by the approved name in the default sender display name, two subjects, two closing lines |
| Tests | `src/__tests__/**` | Section 6.3 |
| Browser specs | `e2e/**`, removals only | The 16 specs that navigate to `/demo`, per the mapping table |

### 4.3 Protected paths: findings

No required work needs a protected path. Three observations, each with its evidence and my handling:

| # | Observation | Evidence | Handling |
|---|---|---|---|
| PP-1 | Two protected Portal deploy files quote the old sender in a comment. After the notice rename the comments are stale. They are not customer-visible | `stark-deploy.yaml:106`: `BILLING_EMAIL_FROM: ""  # Not set -> code default "Cyber Pharma <no-reply@cyberizedev.com>".` and the matching comment at `cloudbuild.yaml:16` | Not edited. Listed in the leftovers. The same lines confirm the setting is unset on alpha, so the code default is what alpha sends and the rename takes effect there |
| PP-2 | The theme provider wrapper is not in the allowed list | `src/app/providers/ThemeProvider.tsx` in both repositories | Not needed. The wrapper passes all props through; light is forced from `src/app/layout.tsx` |
| PP-3 | The Portal's browser helpers and its three live specs drive a dark theme that will no longer be reachable, and the contract allows `e2e/**` changes only to retire specs | `e2e/gate-m.ts:5-11` (`THEMES = ["light","dark"]`, writes `localStorage.theme` and toggles the `dark` class); live specs `apbm007b.addstore`, `apbm007b.regression`, `apbm007b.o1-state` | Left as they are, as the pack already rules ("QA decides in Q1 whether they are usable instruments"). Reported in the handoff as a known effect |

One further theme-toggle mount exists in an unreachable file, `src/components/portal/HandoffShell.tsx:17`. The contract limits Portal component work to reachable files, so it is left and listed in the leftovers; it renders on no route.

### 4.4 Paths not touched in either repository

`src/server/**` (except the five notice strings), `src/app/api/**`, `src/proxy.ts`, `src/lib/appIdentity.ts`, `src/utils/supabase/**`, `src/services/auth/**`, pricing constants, `supabase/**`, `scripts/**`, `deploy.sh`, `Dockerfile`, `cloudbuild.yaml`, `stark-deploy.yaml`, ignore files, environment files, `package.json`, lockfiles, `RECOVERY.md`, historical module folders, the 30 unreachable Portal files, the theme toggler components themselves, the `.dark` token blocks.

## 5. Implementation order and dependencies

One continuous run after release. The steps are internal checkpoints. After each step both unit suites and both typechecks run before the next begins.

| Step | Work | Needs | Self-check at the end of the step |
|---|---|---|---|
| 1 | **Foundation, both apps in the same step.** Tokens, radius and shadow scale, Inter, forced light, toggle mounts removed, OwedBook brand constant, logo master and icons, pin tests and forced-light tests | Gate V reconfirmation and the logo points (D-B2) | Pin tests pass; both token blocks equal the token file declaration for declaration; master hash equals `e7e5d357…3293afd` in both repositories |
| 2 | **Shared components.** Buttons, links, fields, cards, pills, role labels, notices, tables, menus, dialogs, headers, sidebars. The Portal's shared panel component comes first, then its use | Step 1 | Unit suites; states in brand contract section 5 still present |
| 3 | **Literal pages.** Sign-in and auth pages in both apps; Portal registration | Step 2 | Prices and wording on the plan and review screens unchanged |
| 4 | **Translated pages.** Dashboards, admin pages, profile, invitations, Add Pharmacy | Step 2 | Table width; Store-admin restrictions still render as before |
| 5 | **Help page** with the label-verification table completed | Steps 2 and 4 (labels are checked against final screens) | No [VERIFY] marker remains; forbidden-term scan |
| 6 | **Selected fixes.** Store selector; landing page; redirect reproduction and its record | Step 4; D-B3 for the reproduction | Selector test for zero, one and several stores |
| 7 | **Names sweep** in both apps; billing-notice strings | Steps 1 to 6 | Old-name scan with an existence control |
| 8 | **Tests.** Remaining presentation-coupled updates; stale-spec mapping table; retirement | Step 7 | Both suites green; counts recorded from the run |
| 9 | **Prepared external values.** Email body, subject and line diff; Stripe values and files | The export and dashboard reads in section 9. If they have not arrived, this step alone waits and everything else continues | Diff shows presentation changes only |
| 10 | **Final regression and handoff.** Section 6.1 in fresh isolated copies; ledger, manifest, handoff, change inventory, Git reminder | Steps 1 to 8 | Section 10 |

Design notes that follow from the code as it is:

- **`/invitations` (OwedBook).** The page has no header today, and a signed-out visitor can land on it before being sent to sign in (`InvitationsScreen.tsx`, lines 2-3). The UI spec calls it "translated, header only". The header will be added without adding a guard or changing who can reach the page; if that cannot be done inside the allowed paths without altering the flow, the page gets the card treatment only and the difference is reported.
- **Help guard.** `/help` uses the same call as `/profile` (`protectPage([ADMIN, MEMBER])`), so a signed-out visitor is sent to sign in and all three customer roles can read it.
- **Tokens.** Brand anchors are copied from the token file with full precision; no triplet is retyped by hand. The Portal's contrast-tuned values are replaced by the shared block, since the contract makes the block identical in both apps.
- **Disabled and hover.** `hover:bg-primary/90` (4 uses in OwedBook, 3 in the Portal) and `opacity-50` on primary buttons are replaced by the `--primary-hover` and `--disabled` tokens.

## 6. Verification and regression

### 6.1 Engineering self-checks (claims for QA to test, never results)

| Check | Method | Criteria it supports |
|---|---|---|
| Unit suites, typecheck, lint, production build, both apps | Fresh isolated copies of the working trees, same commands as E-5. Lint warning counts compared with the baseline (38 and 27); a new warning is reported | AC-R01, AC-R02 |
| Token parity | Parse both stylesheets and the token file; the pin test in each repository | AC-B01 |
| Hardcoded color scan | Pattern scan over non-test source with a seeded positive control, so an empty result cannot pass by accident | AC-B02 |
| Font | Source check; no weight class below 400 | AC-B03 |
| Forced light | Unit test per app: provider forced to light, no `dark` class on `<html>`, no toggle rendered | AC-B04 |
| Names | Scan for "Cyber Pharma" over customer-facing strings with an explicit allow-list for comments and internal identifiers | AC-N01 |
| Logo | SHA-256 of the placed master in both repositories; reference scan for the three old logo files | AC-N02 |
| Protected paths | `git diff --name-status <baseline>` in each repository checked path by path against sections 3 and 4 of the paths contract; `git diff <baseline> -- src/server` must show only the five notice lines in the Portal and nothing in OwedBook | AC-R03 |
| Prices | `git diff <baseline>` empty for `src/server/pricing.ts` and `storePricing.ts`; displayed strings unchanged in `PlanView.tsx` and the review view | AC-R05 |
| Help | Label table complete; forbidden-term scan with a seeded control; link targets follow existing guards | AC-H01 to AC-H03 |
| Email diff | Line diff of the prepared body against the Director's export | AC-E01 |
| Rendered checks: resolved colors, contrast, radius, overflow at 375 and 1440, 44px targets, first paint with `localStorage.theme = "dark"` | On served production builds, **subject to D-B3**. If Engineering may not serve builds, these are stated in the handoff as not self-verified and left wholly to independent QA | AC-B01, B04 to B08, AC-L01 to L05 |

### 6.2 Regression focus

The restyle is the risk; the logic is not meant to move. After each step I re-read the diff of every file that carries logic as well as markup, and list those files in the handoff ("where behavior could have changed"). The ones I already know: `StoreSelector.tsx` (the fix), `Navbar.tsx` and `MobileNav.tsx` (links array, sign-out handlers), `Shell.tsx`, `LiveStaffPanel.tsx`, `AddStoreFlow.tsx`, `StoreRemovalControl.tsx`, `LoginForm` and `LinkRequestForm`, both root layouts.

### 6.3 Tests that will change (assertions updated to the new contract, never weakened)

| Repository | File | Why |
|---|---|---|
| OwedBook | `owedbook/StatusChip.test.tsx` | Pill recipe replaces colored text |
| OwedBook | `AdminSidebar.test.tsx` | Active item no longer `bg-primary` |
| OwedBook | `AuthedShell.test.tsx` | Layout classes |
| OwedBook | `Navbar.invariant`, `Navbar.mobile`, `Navbar.switcher`, `final-batch-audit-identity` | Theme toggle leaves the navbar; Help entry arrives |
| OwedBook | `auth/PasswordToggle.test.tsx` | Field classes |
| Portal | `portal-shell.test.tsx` | Theme toggle |
| Portal | `portal-storage.test.ts` | Theme key; covers an unreachable module. Left unless it fails |
| Portal | billing-notice tests | New assertions for the approved names, the `/billing` link and the key shape |

The list is from the recon and is confirmed as each step lands. A test that fails for a reason other than presentation is a finding, not something to edit.

## 7. What is preserved, and how

| Area | Preservation |
|---|---|
| **Sign-in and handoff** | `src/server/**`, `src/app/api/**`, `src/proxy.ts`, `src/lib/appIdentity.ts`, `src/utils/supabase/**` and `src/services/auth/**` are not opened for writing. Form components keep their handlers, field names, test ids and the confirm page's button. The pinned-address boundary test in OwedBook stays green |
| **Billing and money** | No Stripe code change. Pricing files untouched and proven by diff. Add Pharmacy keeps quote, consent, payment and result logic; only classes and wrappers change. Busy states keep spinner, wording, `aria-busy` and the duplicate-submit guard |
| **Permissions** | Guards are server-side and untouched. The new Help page adds one guarded route with an existing guard. The selector fix changes text only. No control is shown to a role that did not have it; the Store-admin "managed by Owner" view and friendly denial are kept |
| **Repairs R1 to R10, F1 to F6** | The states in brand contract section 5 are treated as a checklist per component: busy text and spinners, named confirmation with a no-effect Cancel, error summaries taking focus, live regions, skip link, stacked mobile table, navbar name and role badge with `data-testid="nav-role-badge"` |
| **Existing work in the trees** | The Director's OwedBook commit `c335671` and the installed pack are not altered. Nothing is stashed, staged, discarded or committed by Engineering |
| **Data** | No database write, no migration, no DEV data change. The rehearsal account is not used |
| **Dark theme code** | The `.dark` blocks and toggler components stay in the files, unreachable and unedited |

## 8. Help content: facts and labels that need source verification

Pre-checked against source today. The final check is against the rendered screens in step 5; where screen and Help differ, the screen wins and the Help text changes.

**Statements that do not match the product as built:**

| # | Help text | What the source shows | Proposed correction |
|---|---|---|---|
| H-1 | Section 3, My Stores: "Who can use it. Everyone." Section 2: "a link back to My Stores" | A Member cannot open any `/admin-portal` page: `(admin)/layout.tsx` redirects to `/owedbook` unless `canAdminister` is true (Owner or Store admin only, `tenantScope.ts:22`). The navbar shows "Admin Portal" only to those roles | My Stores is for Owners and Store admins. Members choose a pharmacy with the Store selector on the OwedBook page. Role table and section 11 wording adjusted to match |
| H-2 | Section 11 and the label table: **Sign out**, "account menu, both apps" | OwedBook says **Logout** in the desktop account menu (`auth/Logout.tsx:20`) and **Log out** in the mobile menu (`MobileNav.tsx:99`). The Portal says "Sign out" | Decision D-B6: either Help describes it in plain words, or the two OwedBook labels become "Sign out" |
| H-3 | Label table: **My Profile**, "account menu" | The menu item and navbar link read **Profile** (`Navbar.tsx:80`, `:193`); "My Profile" is the page heading | Help says "Open **Profile** from the account menu" |
| H-4 | Section 4 [VERIFY]: "you can resend it or cancel it" | Controls are **Resend** and **Revoke** (`LiveStaffPanel.tsx:131`, `:134`). The recipient also has **Decline** on the invitations page | Paragraph kept; "cancel" becomes "revoke" |
| H-5 | Section 3: "Two counts the Owner may see" on My Stores: "Access now", "At next renewal" | No such wording found in OwedBook's My Stores, store card or billing components. The Portal dashboard shows "Pharmacies with access now" and "Billed at next renewal" (`DashboardView.tsx:304`, `:308`) | Verify on the rendered OwedBook screens; if absent there, the paragraph moves to the Account & Billing section with the Portal's wording |
| H-6 | Section 8 [VERIFY]: "Cancelling the subscription is done on the Stripe billing page" | Supported by source: the Portal refuses to open a billing-portal session unless cancellation is enabled at period end (`billing.ts:119-123`) | Sentence kept, adding that it takes effect at the end of the billing period. Confirmed on the Stripe preview in session S1 |

**Labels found in source as quoted (rendered check still due):** My Stores, Invite member, Member / Store admin, Pending, Billing, Manage billing (both apps), Settings, Audit log, People and invitations, Include views and system steps, Load older, Back to My Stores, Remove at period end, Keep this store, "Not provided", `support@pharmacybooks.com`.

**Labels to check on the rendered screens only:** "Add store" (OwedBook) versus "Add a pharmacy" (Portal) as each screen words it; the member-removal control and its confirmation text; Active; the audit filter group label "Show"; the Stripe return link, which depends on the names the Director applies in session S2.

**Facts to verify against access rules before the page ships:** each cell of the role table for Store admin (settings and audit limited to their own pharmacies); that a Member following a billing link sees the existing "managed by the Owner" message; that the invited-person flow lands as section 4 describes.

## 9. Required external inputs

| # | Input | From | Blocks | Does not block |
|---|---|---|---|---|
| X-1 | **Export of the live sign-in email template** from the DEV Supabase project: full body and subject, unchanged; Site URL and redirect allow-list; sender name and address; whether the other templates are defaults (session S1) | Director | Step 9, email body and its diff (AC-E01) | Steps 1 to 8 and 10 |
| X-2 | Mail-provider click tracking confirmed off for the sending domain (S1) | Director | Final wording of the email handoff note | Everything else |
| X-3 | Stripe branding screen facts: font list, shape options, background control, accepted file types and sizes, which billing-portal configuration alpha uses, which customer emails are on; four baseline previews (S1) | Director | Final Stripe values and files in step 9; Help correction H-6 | Everything else |
| X-4 | Terms and Privacy addresses, if approved before the build ends | Director | Nothing. The footer keeps "(link not yet published)" | |

Already in hand: the logo master (in the pack, hash verified today), the token file, the renders, the Help text.

If X-1 or X-3 has not arrived when steps 1 to 8 finish, the handoff states step 9 as not done, with the reason, and AC-E01 is recorded as not claimed.

## 10. Engineering handoff duties for the QAM

Produced before the Director commits. The candidate is recorded as `PENDING`; no SHA is invented.

| # | Deliverable | Where |
|---|---|---|
| 1 | Acceptance ledger: one row per criterion, 36 rows, each an engineering claim with its evidence path | `ABM_ACCEPTANCE_LEDGER.md` |
| 2 | Factual manifest: identity, change inventory per repository in four lists (committed since baseline, staged, unstaged, untracked) with the command text, claims per criterion, reproduction commands, what QA needs | `QAM/QAM_MANIFEST.md` |
| 3 | Narrative handoff, sections 1 to 10, including where behavior could have changed, what was not verified, owned processes and temporary paths | `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` |
| 4 | Install, build, serve and test commands with working directories and ports, both apps; runtime versions; environment variable **names only** and which file each is read from | Manifest sections 4 and 5 |
| 5 | Help label-verification table, completed | `CONTRACTS/HELP_CONTENT.md` Part A |
| 6 | Stale-spec mapping table for the 16 Portal specs, with what was retired and the evidence that each route is gone | `EVIDENCE/` |
| 7 | Changed-labels list (AC-P01) | `EVIDENCE/` |
| 8 | Redirect reproduction record: routes, session states, role, number of runs, outcome | `EVIDENCE/` |
| 9 | Leftovers list for a removal decision: old logo files, `public/next.svg`, `public/vercel.svg`, `public/favicon-512.png`, toggler components, `HandoffShell.tsx` mount, stale deploy-file comments (PP-1) | `EVIDENCE/` |
| 10 | Logo placement notes: hash after placing, each derived file's size and the exact command | `EVIDENCE/` |
| 11 | Prepared email body, subject and line diff; Stripe values and files | `EVIDENCE/` |
| 12 | Webhook routing as observed read-only, as an input to Q1's isolation proof; mock-mode facts for OwedBook | Manifest section 5 |
| 13 | What each repository's root instructions required and any conflict surfaced (section 11 below, updated) | Manifest section 6 |
| 14 | `ABM_STATE.md` set to `ENGINEERING COMPLETE — AWAITING QA BRANCH`; Git reminder with exact scoped commands per repository, prepared after reading actual state, no blanket staging | `ABM_STATE.md`, handoff section 10 |

Engineering fills no Q1 finding, Q2 result, approval or certificate.

## 11. Root instructions: what they require, and conflicts

| Source | Requires | Standing |
|---|---|---|
| Portal `CLAUDE.md` | Session file first; plan before any change and the Director's approval; response files in `agent_docs/RESPONSES/`; changelog entry for documentation changes; scope discipline; list dead code and ask; Git by the Director only | Followed. The Director's recorded release of this plan is the approval. Any change outside the released plan stops that task for re-approval |
| OwedBook `CLAUDE.md` | A fresh session in that repository first asks which workflow applies | The Director chose factory engineering at 07:51 today (OwedBook `session_2026-11-24.md`) |
| OwedBook `CLAUDE.local.md` (identical to the tracked `CLAUDE.eng.md`) | Same planning, records and recovery protocol; "You never touch git"; records under `agent_docs/SESSIONS/` and `agent_docs/RESPONSES/` | Followed |
| Standing Director instructions to Engineering | No local app servers outside QA testing; after QA starts, repairs happen on the QA branch in place and QAM files are never touched; every deliverable ZIP is also copied to Downloads and hash-verified | Followed. The first one meets the pack in conflict C-2 |

**Conflicts, each quoted from both sides. Only the affected action is held.**

| # | Repository instruction | Pack | Held action | My recommendation |
|---|---|---|---|---|
| C-1 | Both root files: "Keep `RECOVERY.md` at the project root. Update it after every plan completion." | `NO_BREAK_AND_PATHS.md` section 3: "`RECOVERY.md` in either repository — **No.** Protected … Rewritten only at the closeout checkpoint, under the Director's authorization." | Writing `RECOVERY.md`. Not written in this session | The pack rule holds for the module; the session log carries recovery state until closeout. The Director rules (D-B5) |
| C-2 | Standing instruction: Engineering never starts dev or app servers unless running QA testing; the Director starts them | `NO_BREAK_AND_PATHS.md` section 6: "Local install, build, serve, unit tests in isolated copies — Engineer: Yes" | Serving builds for rendered self-checks and for the redirect reproduction | D-B3 |
| C-3 | Portal root `CLAUDE.md`, "Active Module Pointer": "The active module is **FFM-ABM-001-SUBSCRIPTION-PORTAL**", and `agent_docs/PROJECT_POINTER.md` says the same | The pack is the module in progress | Nothing. Routing only | The Director decides whether to update the pointer at closeout. Root `CLAUDE.md` is not in the allowed paths, so Engineering does not edit it |

The single-session question is practical, not a conflict: steps 1 and 7 change both repositories in the same step, and OwedBook's own instructions load only in a session opened there. Covered by D-B5.

## 12. Blockers and pending decisions (one list)

Nothing below was decided by this plan. Settled decisions D-01 to D-15 are not reopened.

### A. Needed before building

| # | Decision | Owner | Why it gates the build | Recommendation |
|---|---|---|---|---|
| D-B1 | **OwedBook baseline.** HEAD is `c335671` (records, local, unpushed), one commit past the recorded baseline `9597699` | Director; Architect records | The baseline defines the AC-R03 diff and the QAM identity fields | Keep `9597699` as the baseline. `c335671` adds five record files and shows up in the diff as records. Push when convenient |
| D-B2 | **The look.** Gate V reconfirmation on the corrected REVIEW_02 renders, with P-01 to P-04, and the two logo points (accept small-size legibility; allow trimming the transparent margin for derived files only) | Director | Step 1 installs these values in both apps | Reconfirm as proposed. Without the trimming approval I scale the full canvas |
| D-B3 | **Rendered self-checks.** Whether Engineering may serve production builds for its own checks and the redirect reproduction, on what backend, or whether the Director starts them | Director | Section 6.1's last row; step 6's reproduction (AC-F02) | Engineering serves isolated production builds only: OwedBook in mock mode for signed-in screens, both apps' public pages with public configuration, no Stripe listener, no DEV-backed signed-in session. The Portal dashboard, Add Pharmacy and the redirect reproduction need a signed-in fixture: SCRATCH on the proof ports with QA-style fixtures, started on the Director's word. The rehearsal account is never used |
| D-B4 | **What is in and what waits.** Rulings on P-05 to P-18, P-21 and P-22 | Director | They set sections 3 and 4 of this plan | Approve the pack's split. A different ruling amends the affected rows only |
| D-B5 | **Records.** (1) `RECOVERY.md` during the module (C-1). (2) Whether one Portal-rooted session may write both repositories, keeping OwedBook's session log, changelog and response files in OwedBook's own locations | Director | Every step writes records; steps 1 and 7 span both repositories | (1) Pack rule holds. (2) One session, one writer, each repository's records kept in its own places |
| D-B6 | **OwedBook sign-out label** (Help item H-2) | Director | Help text and the changed-labels list | Leave the labels; Help describes the action in plain words. Changing "Logout" and "Log out" to "Sign out" is two strings and could ride along if wanted |
| D-B7 | **Contract freeze and release.** Architect verdict on this plan; the Director's recorded release | Architect, Director | `ABM_ENTRY.md` section 2 | — |

### B. Needed during the build, for one step only

| # | Item | Owner | Step |
|---|---|---|---|
| X-1 to X-3 | Session S1: template export, click-tracking confirmation, Stripe branding reads (section 9) | Director, led by the QA Lead | Step 9 only |

### C. Needed only before QA

| # | Item | Owner |
|---|---|---|
| Q-1 | Name the QA Executor | Director |
| Q-2 | QA target and effects envelope (P-19 as amended by AM-04); the shared-sandbox isolation proof is Q1's work | Director, QA Lead |
| Q-3 | Commit both candidates on `abm007-final` and create `qa/abm007-final` in both repositories | Director |

### D. Needed only before deployment and closeout

| # | Item | Owner |
|---|---|---|
| G-1 | Deployment authorization, one per alpha service (P-20) | Director |
| G-2 | Read-only check that no billing notice is claimed or retrying when the wording goes live (AC-E03). It is a database read on DEV and needs its own release | Director releases; Engineer runs |
| G-3 | Nominate the Gate D invitation fixture; approve `QAM/GATE_D_PLAN.md`; session S2 | Director |
| G-4 | Removal decision on the leftovers list | Director |
| G-5 | Whether `SOURCES/` is committed with the pack (it holds tester email addresses) | Director |

### E. Genuine blockers today

None that stops planning. Building is blocked only by section A.

## 13. Estimate for the proposed scope

Unit as in the recon: working days for one engineer working with the agent, including unit tests and self-checks. Excludes approval waits, the Director's dashboard time, independent QA, and repair and retest. This campaign has often run faster than its day estimates; the figures are not adjusted for that. Not a delivery date.

| Step | Days |
|---|---|
| 1 Foundation, both apps, with logo, icons and pin tests | 1.0 – 1.5 |
| 2 Shared components, both apps | 1.5 – 2.0 |
| 3 Literal pages | 1.0 – 1.5 |
| 4 Translated pages | 1.5 – 2.0 |
| 5 Help page and label table | 0.5 – 1.0 |
| 6 Fixes: selector, landing page, redirect reproduction | 0.5 – 0.75 |
| 7 Names sweep and notice wording | 0.25 |
| 8 Test updates, stale-spec mapping and retirement | 0.5 – 0.75 |
| 9 Email body and Stripe values | 0.5 |
| 10 Final regression and the QAM handoff | 0.75 – 1.75 |
| **Engineering total** | **8.5 – 12.0** |
| Two alpha redeploys with read-back, after Gate Q, when authorized | 0.25 – 0.5, separate |

This replaces the engineering rows of the brief's section 10. It is close to the author's figure: the delivered style tile and samples remove the reference work, and the Help page, the fixes and the handoff documents add roughly the same amount back. The upper end assumes rendered self-checks by Engineering (D-B3) and one round of Help corrections.

## 14. Tooling as found on this machine

| Tool | Found |
|---|---|
| Node / npm | 22.17.0 / 11.15.0 |
| Next.js, next-themes | 16.4.5, 0.4.6 in both repositories |
| Playwright | `@playwright/test` 1.59.1 in both repositories. The pack's `DESIGN/source/*.mjs` scripts name a different Playwright path and need that one line changed to run here |
| Image tooling | Pillow 10.2.0; `sharp` present in both `node_modules`. No ImageMagick |
| Deploy scripts | `./deploy.sh` in each repository; read before use, no re-initialization |

## Glossary

- **D-Bn / Q-n / G-n / X-n:** this plan's pending decisions before building, before QA, before deployment, and external inputs.
- **PP-n, C-n, H-n:** protected-path observations, instruction conflicts and Help corrections found in this plan.
- **P-nn, D-nn, AC-xnn:** proposed positions, settled Director decisions and acceptance criteria in the pack.
- **S1 / S2:** the Director's read-only and apply dashboard sessions.
- **Isolated copy:** an export of a commit into a scratch folder outside both repositories, where builds and tests run without touching either working tree.
