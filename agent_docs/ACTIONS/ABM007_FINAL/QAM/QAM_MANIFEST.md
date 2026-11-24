# QAM_MANIFEST (Engineer's factual completion record) — `ABM007_FINAL`

**Owner:** Engineer · **Written:** as engineering finishes, before the Director commits · **Status: FILLED BY THE ENGINEER, 24 November 2026 (interim engineering handoff: step 9 email body and signed-in rendered checks open; see section 7).** Every QA result, approval and verdict field stays empty. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

Facts and labelled claims only. No test plan, no risk order, no QA finding, no decision, no certificate. No secret values anywhere: key names only.

## 1. Identity (one row per repository)

| Field | OwedBook | Portal |
|---|---|---|
| Remote | `Cyberize-Group/cyph-v1-dev` | `ahmedmusawir/cyph-payment-portal-dev-v1` |
| Baseline (full SHA) | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Engineering branch | `abm007-final` | `abm007-final` |
| HEAD at handoff (full SHA) | `c335671afa6cd4a8a2d437c30aeae5040e0cecaf` (Director's records-only commit, pushed) | `b2e50fa86ef041f9f7f7f1a0f630576de0a10664` (Director's records-only commit "E1 recon done", pushed) |
| Implementation identity | `PENDING` until the Director commits | `PENDING` |
| Intended QA branch | `qa/abm007-final` | `qa/abm007-final` |
| Working tree at handoff | Not clean: implementation uncommitted, listed in `../EVIDENCE/E2/INVENTORY_owedbook.txt` | Not clean: implementation and module records uncommitted, listed in `../EVIDENCE/E2/INVENTORY_portal.txt` |

## 2. Change inventory at handoff (per repository)

The four lists per repository, each with its command text, are in `../EVIDENCE/E2/INVENTORY_owedbook.txt` and `../EVIDENCE/E2/INVENTORY_portal.txt` (script `../EVIDENCE/E2/tools/inventory.sh`, regenerated at the final package step). Staged: none in either repository. Committed since baseline: records only (OwedBook 5 files in `c335671`; Portal 127 files in `b2e50fa`).

| Repository | Path | Kind | What changed | Authorizing criterion or ruling | Allowed list? |
|---|---|---|---|---|---|
| OwedBook | `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx` | changed | Token block, radius and shadow scale, Inter, forced light, shared recipes | AC-B01 to B05, D-01 | Yes |
| OwedBook | `src/components/global/brand.ts`, `BrandMark.tsx` | added | Brand constant; logo tile and wordmark | AC-N01, AC-N02 | Yes (global/**) |
| OwedBook | `public/brand/pharmacy-books-logo-primary.png`; `src/app/icon.png` (changed), `apple-icon.png`, `favicon.ico` (added) | added/changed | Logo master and derived icons | AC-N02, AM-08 (2) | Yes |
| OwedBook | `src/components/global/**` (Navbar, MobileNav, NavbarHome, NavbarLoginReg, UserMenu), `src/components/layout/**` | changed | Navy header, Help entry, toggles removed, dead landing links removed, drawer and sidebar recipes | AC-B04, AC-L, AC-F03, D-08 | Yes |
| OwedBook | `src/components/ui/**` (14 files) | changed | Primitive recipes (button, card, field, menus, dialog scrim, tabs, toast) | AC-B05 to B07 | Yes |
| OwedBook | `src/components/owedbook/**`, `admin-portal/**`, `auth/**` (+ new `AuthShell.tsx`), `invitations/**`, `common/**` | changed | Screens restyled; KPI tiles, pills, notices; literal auth layout; `StoreSelector` fix | AC-B09, AC-L01/02, AC-F01, P-03, P-04, P-10 | Yes |
| OwedBook | `src/app/**` pages and layouts (auth layout, auth page, errors, not-found, access-denied, invitations, profile), `HomePageContent.tsx`, `ProfileForm.tsx` | changed | Presentation; access-denied names; landing screenshot removed | AC-L, AC-N01, P-08 | Yes |
| OwedBook | `src/app/help/{layout,loading,page}.tsx`, `src/components/help/HelpPage.tsx` | added | Help page | D-08, AC-H01 to H03 | Yes |
| OwedBook | `src/__tests__/` 3 changed, 4 added (`abm007/`) | changed/added | Presentation assertions updated; pin, forced-light, Help, selector tests | AC-B01, B04, H, F01 | Yes |
| OwedBook | `agent_docs/SESSIONS/session_2026-11-24.md`, `CHANGELOG.md`, `agent_docs/RESPONSES/…` | changed/added | Appended records | AM-08 (4) | Records |
| Portal | `src/app/globals.scss`, `tailwind.config.ts`, `src/app/layout.tsx` | changed | Same foundation; `className="dark"` removed; `.portal-link` recipe replaced | AC-B, D-01 | Yes |
| Portal | `public/brand/pharmacy-books-logo-primary.png`; `src/app/icon.png`, `favicon.ico` (changed), `apple-icon.png` (added) | added/changed | Logo master and icons | AC-N02 | Yes |
| Portal | `src/components/portal/**` reachable files (Brand, brand, Shell, PublicShell, Footer, PageHeader, Loading, Alert, Pill, Stepper, DataTable, ErrorSummary, FormField, PharmacyFields, register/*, activation/*, account/*), new `layoutMode.tsx` | changed/added | Navy shells, literal and panel modes, masthead, step badges, card treatment, pills, notices, footer line | AC-B, AC-L, P-22 | Yes |
| Portal | `src/components/ui/**` (button, input, label, dropdown-menu, sheet, toast, alert-dialog; dialog: one scrim token) | changed | Primitive recipes | AC-B | Yes |
| Portal | `src/components/auth/**`, `src/components/common/SpinnerLarge.tsx`, `src/app/login/LoginPageContent.tsx`, `src/app/not-found.tsx`, `src/app/(account)/stores/add/page.tsx` | changed | Literal auth pages; spinner tokens; Add Pharmacy panel | AC-L01, AC-B02, AC-L03 | Yes |
| Portal | `src/server/billingNotices.ts` lines 12, 26, 29, 33, 36 | changed | Brand strings only | P-07, AC-E03 (the one permitted exception) | Yes (exception) |
| Portal | `e2e/` 16 specs | removed | Retired per mapping | P-09 | Yes (e2e retirement) |
| Portal | `src/__tests__/abm007/` 4 added | added | Pin, forced light, notice wording | AC-B01, B04, E03 | Yes |
| Portal | `agent_docs/ACTIONS/ABM007_FINAL/**`, `session_2026-11-24.md`, `CHANGELOG.md`, `agent_docs/RESPONSES/…` | changed/added | Module records and evidence | Records rule | Records |

Exceptions used: the billing-notice brand strings (pre-authorized). Paths wanted and not touched: `src/components/portal/references/EmailPreview.tsx:62` (old-logo reference in an unreachable module; exception requested, `../EVIDENCE/E2/LEFTOVERS.md` L-9); protected deploy-file comments (L-8).

## 3. Claimed behavior and self-verification

The 36 rows, each a CLAIM with its evidence path, are in `../ABM_ACCEPTANCE_LEDGER.md` (single source, not duplicated here). Methods, working directories and exit codes: `../EVIDENCE/E2/VERIFICATION.md`.

## 4. Reproduction (per app)

| Step | OwedBook (`cyph-v1-dev`) | Portal (`cyph-payment-portal-dev-v1`) |
|---|---|---|
| Install | `npm ci` (no dependency change in this module) | `npm ci` |
| Unit tests | `npx jest --ci` | `npx jest --ci` |
| Typecheck and lint | `npx tsc --noEmit -p .` ; `npx eslint .` | same |
| Production build | `npx next build` | `npx next build` |
| Serve the production build (port) | `npx next start -p <port>` (Engineering used 3300; QA proposed 3100) | `npx next start -p <port>` (Engineering used 3301; QA proposed 3101) |
| Browser specs that are current | none in this repository | `apbm007b.addstore.spec.ts`, `apbm007b.regression.spec.ts`, `apbm007b.o1-state.spec.ts` (still drive a dark theme via `e2e/gate-m.ts`, PP-3) |

## 5. What independent QA needs

| Item | Value |
|---|---|
| Runtime and package manager versions | Node 22.17.0, npm 11.15.0; Next.js 16.4.5, next-themes 0.4.6, Playwright 1.59.1 (both repositories) |
| Environment variables, **names only** | OwedBook: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APBM_DATA_MODE`. Portal: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_TERMS_URL`, `NEXT_PUBLIC_PRIVACY_URL`, plus the server-side Stripe, Supabase and mail keys already documented for the Portal. Read from each repository's `.env.local` (names per `.env.example`); no new variable was added |
| Services | QA target per P-19/AM-04 (SCRATCH and the Stripe sandbox), still PENDING the Director's group-3 ruling |
| Fixtures and roles | Owner, Store admin, Member on SCRATCH; a zero-store user (AC-F01); a long-history audit fixture (AC-R04 (i)) |
| Migrations | Expected none; actual none (no `supabase/` path in either diff) |
| Webhook routing | Not observed in this session (read-only or otherwise). Historical record: alpha Portal endpoint `/api/webhooks/stripe` on the payment alpha service (Portal `RECOVERY.md`). Input only; the isolation proof is Q1's |
| Mock mode | `NEXT_PUBLIC_APBM_DATA_MODE=mock` still ships in OwedBook. It changes data sources on `/owedbook` and the admin pages; it does **not** bypass sign-in (`protectPage` still redirects to `/auth`), so signed-in screens need a real session even in mock mode |

## 6. Engineer deliverables named by the contract

| Deliverable | Path | Present? |
|---|---|---|
| Help label-verification table, completed | `../CONTRACTS/HELP_CONTENT.md` Part A, and the corrections appendix | Yes |
| Stale-spec mapping table and retirement evidence | `../EVIDENCE/E2/STALE_SPEC_MAPPING.md` | Yes (16 retired) |
| Changed-labels list (AC-P01) | `../EVIDENCE/E2/CHANGED_LABELS.md` | Yes |
| Redirect reproduction record (AC-F02) | `../EVIDENCE/E2/REDIRECT_REPRODUCTION.md` | Yes (BLOCKED) |
| Leftovers list | `../EVIDENCE/E2/LEFTOVERS.md` | Yes |
| Prepared email body, subject and line diff | `../EVIDENCE/E2/PREPARED_EXTERNAL_VALUES.md` §1 | **No** (export X-1 not received) |
| Prepared Stripe values and files | same, §2 | Yes |
| Logo placement notes | `../EVIDENCE/E2/LOGO_PROVENANCE.md` | Yes |
| Root instructions and conflicts | `../ABM_EXECUTION_PLAN.md` section 11 (C-1 to C-3, resolved by AM-08 (4), (5)) | Yes |

## 7. Known limitations

- Step 9 email body not prepared (X-1 missing); AC-E01 not claimed.
- No signed-in screen rendered by Engineering; redirect reproduction BLOCKED; landing screenshot removed rather than replaced (no SCRATCH fixtures).
- One old-logo reference in an unreachable Portal module (AC-N02 partly open; exception requested).
- Rendered contrast (AC-B08) not probed by Engineering.
- The three live Portal specs still use a dark-theme helper (PP-3).
- Rollback dependencies: alpha still serves `ef4cebc` (OwedBook) and `6dd3de7` (Portal), observed 24 Nov 04:06Z; the original email body is not in either repository and must come from the Director's export.

## 8. Meaning of each engineering evidence item

| Evidence path | What it shows | What it does not show | How QA can re-derive it |
|---|---|---|---|
| `EVIDENCE/E2/verify/*` | Unit, typecheck, lint, build on copies bound to the working tree | Behavior on a committed candidate or QA target | Re-run section 4 on the Director's commit |
| `EVIDENCE/E2/rendered/*` | Public pages: forced light, exact token colors, overflow, font, no theme control, no old name | Signed-in screens; contrast across states | `tools/rendered_checks.cjs` against QA builds |
| `EVIDENCE/E2/*_changes_vs_baseline.txt`, `INVENTORY_*.txt` | Paths changed, protected-path review | Correctness of the change | `git diff --name-status <baseline>` on the candidate |
| `EVIDENCE/E2/tools/colorscan.py` | No hardcoded color, with a failing control | Rendered color | Run it on the candidate |
| `EVIDENCE/E2/REFRESH.md` | Remote heads and alpha build identity at 04:05Z | Later state | Repeat the two read-only commands |

## 9. Factual amendments after handoff (dated; Engineer only)

None.

## Engineer update, E2 completion round (24 Nov)

The change inventory was refreshed from the final working trees: `../EVIDENCE/E2/INVENTORY_owedbook.txt`, `INVENTORY_portal.txt`, `*_changes_vs_baseline.txt`, and the exact staging lists `STAGING_LIST_*.txt`. The narrative and the current stops are in `HANDOFFS/ENGINEERING_HANDOFF.md` section 11. No QA field is filled.

## Engineer update, completion (24 Nov)

Engineering is complete (`HANDOFFS/ENGINEERING_HANDOFF.md` section 12). The reusable SCRATCH setup for QA is in section 12.4, and refreshed inventories and exact staging lists are in `../EVIDENCE/E2/`. Section 1's candidate SHAs remain the Director's to record after he commits. No QA field is filled.

## Engineer update, final handoff preparation (24 Nov)

QAM Amendment 01 is installed (`QAM_AMENDMENT_01.md`; `HANDOFFS/ENGINEERING_HANDOFF.md` section 13). Section 1 "Implementation identity" stays **PENDING** in both repositories until the Director commits; the commands are in `../EVIDENCE/E2/DIRECTOR_GIT_COMMANDS.md`. No QA field is filled.
