# ABM_ACCEPTANCE_LEDGER — ABM007_FINAL

**Owner: Engineer** for the claim columns. Independent results are never copied here; this file links to `QAM/AC_EVIDENCE_MATRIX.md` for them. No PASS is recorded by Engineering. Every entry is a CLAIM for independent QA to test.

**Filled:** 24 November 2026, interim engineering handoff (see `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` section 8). Evidence paths are relative to `EVIDENCE/E2/` unless shown otherwise.

| AC | Engineering claim | Engineering evidence (path) | Independent disposition |
|---|---|---|---|
| AC-V01 | Director gate, not an engineering claim. Recorded: AM-01, reconfirmed by AM-08 (2) | `ABM_RULINGS.md` | — |
| AC-B01 | Both `:root` blocks equal the token file declaration for declaration (59 declarations, in order); anchors full precision, aliases `var()`. In Chrome all eight probed tokens resolve to the approved hex on public pages of both built apps; a rounded-triplet control was flagged | pin tests `src/__tests__/abm007/token-pin.test.ts` (both repos); `VERIFICATION.md` §3; `rendered/rendered_checks.json` | see `QAM/AC_EVIDENCE_MATRIX.md` |
| AC-B02 | No hardcoded color in non-test source of either app (scanner with seeded control) | `tools/colorscan.py`; `VERIFICATION.md` §4 | see matrix |
| AC-B03 | Inter 400 to 700 via `next/font` in both root layouts; Saira removed; computed body family is Inter on every rendered public page; OwedBook's `font-light` uses replaced | `src/app/layout.tsx` (both); `forced-light.test.tsx`; `rendered/rendered_checks.json` | see matrix |
| AC-B04 | `forcedTheme="light"`, `enableSystem={false}`, no `dark` class on `<html>` (unit test both apps); all theme-toggle mounts removed (5 OwedBook, 4 reachable Portal); rendered public pages light with dark OS and saved dark theme. Signed-in shells not rendered | `forced-light.test.tsx` (both); `VERIFICATION.md` §3 | see matrix |
| AC-B05 | Tailwind scale: `rounded-md` 8, `rounded-tile` 12, `rounded-lg` 14, `rounded-xl` 16, `rounded-full`; navy-tinted `shadow-card/shell/masthead/tile/menu`; card, shell, masthead and logo-tile recipes in both stylesheets. Computed styles not measured by Engineering | `tailwind.config.ts`, `globals.css` / `globals.scss` (both) | see matrix |
| AC-B06 | Button recipe in both apps: Title Case, 16px Regular, ≥44px, hover `--primary-hover`, disabled tokens (no `opacity-50` on buttons), shared 2px outline focus; busy states, `aria-busy` and duplicate guards untouched. No rendered button under 44px except the hidden skip link | `src/components/ui/button.tsx` (both); `rendered/rendered_checks.json` | see matrix |
| AC-B07 | `.pb-link` green underlined on white; `.pb-link-on-page` navy on ice; `.pb-link-on-dark` ice on navy; links inside tinted notices take charcoal bold; Portal `.portal-link` now green underlined. Not measured in a browser per context | `globals.*` recipes; `CHANGED_LABELS.md` | see matrix |
| AC-B08 | Not claimed: rendered contrast across states was not probed by Engineering | — | see matrix |
| AC-B09 | Pills and notices use the status tokens with word, border and 10 percent tint over white (`.pb-pill`, `.pb-notice`); role labels neutral (`.pb-role`), profile role accent no longer red/green; brand green not used as a status color | `StatusChip.tsx`, `StatusPill.tsx`, `AccessBanner.tsx`, `ProfileForm.tsx` (OwedBook); `Pill.tsx`, `Alert.tsx`, `Shell.tsx` (Portal) | see matrix |
| AC-L01 | Literal layout on OwedBook `/auth` and its six auth pages (`AuthShell`) and on Portal `/login`, six auth pages and the registration steps (`PublicShell` + literal `PageContainer`/`PageHeader`). Rendered for the public pages listed | `rendered/shots/` | see matrix |
| AC-L02 | Translated layout implemented (navy header, ice page, white cards, full-width OwedBook table, Portal `max-w-6xl`). **Not rendered** (signed-in; BLOCKED) | source; `VERIFICATION.md` §3 | see matrix |
| AC-L03 | Add Pharmacy in panel mode (masthead inside the signed-in shell); Help is a panel inside navigation. **Not rendered** (BLOCKED) | `AddStoreFlow.tsx`, `layoutMode.tsx`; `HelpPage.tsx` | see matrix |
| AC-L04 | 0px horizontal overflow at 375 on all rendered public pages; narrow-screen menu buttons are visible, labelled and ≥44px; tables keep their stacked mobile form. Signed-in screens not measured | `rendered/rendered_checks.json` | see matrix |
| AC-L05 | Not-found pages restyled in both apps (rendered); error, loading, empty and access-denied states use tokens and the card recipe (source) | `rendered/shots/*nope-404*`; source | see matrix |
| AC-N01 | No "Cyber Pharma" in customer-facing strings of either app (titles, alt text, accessible names, footer, notices); OwedBook reads names from `src/components/global/brand.ts`. Comments and internal identifiers untouched | `VERIFICATION.md` §4; `CHANGED_LABELS.md` | see matrix |
| AC-N02 | Master byte-identical in both apps; icons derived by full-canvas scaling and white padding. **Partly open:** one old-logo reference remains in the unreachable Portal module `references/EmailPreview.tsx:62`, outside the allowed paths; exception needed | `LOGO_PROVENANCE.md`; `LEFTOVERS.md` L-9 | see matrix |
| AC-H01 | `/help` exists in OwedBook, linked from desktop and mobile navigation for every role, guarded like `/profile`; 13 sections with working anchors (unit test). Signed-out visitor redirected to `/auth` (rendered). Content rendered per role: not done (BLOCKED) | `src/__tests__/abm007/help-page.test.tsx`; `VERIFICATION.md` §3 | see matrix |
| AC-H02 | No forbidden term (seeded scanner); label table completed; corrections H-1 to H-6 applied | `CONTRACTS/HELP_CONTENT.md` Part A and appendix; `help-page.test.tsx` | see matrix |
| AC-H03 | Help's two app links use existing guarded routes; outcomes per role recorded in AM-11 (a Member is returned to `/owedbook` by the existing guard) | `ABM_RULINGS.md` AM-11 | see matrix |
| AC-F01 | Placeholder rendered only while loading or with zero stores (unit test: zero, one, several, loading). Per-role rendered states not run (BLOCKED) | `StoreSelector.tsx`; `store-selector.test.tsx` | see matrix |
| AC-F02 | Reproduction record exists: BLOCKED, 0 signed-in runs, no repair | `REDIRECT_REPRODUCTION.md` | see matrix |
| AC-F03 | Landing has no link to a missing section (three nav links and `#book-demo` removed), uses the approved names and logo, and shows no screenshot | `HomePageContent.tsx`, `NavbarHome.tsx`, `MobileNav.tsx`; `rendered/shots/ob___root_*` | see matrix |
| AC-R01 | Unit suites pass on the working-tree copies: OwedBook 389/389, Portal 580/580 | `verify/ob_test.log`, `verify/pp_test.log` | see matrix |
| AC-R02 | Typecheck exit 0, lint exit 0 (warnings equal baseline: 38, 27), production build exit 0, both apps | `verify/` | see matrix |
| AC-R03 | Diff from baseline touches no protected path except the five billing-notice brand strings; no migration, dependency, API, proxy, auth or deploy file | `cyph-v1-dev_changes_vs_baseline.txt`, `cyph-payment-portal-dev-v1_changes_vs_baseline.txt` | see matrix |
| AC-R04 | Not claimable by Engineering (journeys on QA fixtures). Logic-bearing files touched are listed in the handoff section 4 | handoff | see matrix |
| AC-R05 | Pricing files unchanged (empty diff); the plan screen still renders $99.00 and $49.00 (rendered) | `VERIFICATION.md` §4; `rendered/shots/pp__register_plan_*` | see matrix |
| AC-R06 | The rehearsal account was not used, changed or charged | handoff section 6 | see matrix |
| AC-E01 | **Not claimed.** The Director's template export (X-1) has not arrived; nothing was reconstructed | `PREPARED_EXTERNAL_VALUES.md` §1 | see matrix |
| AC-E02 | Judged at alpha verification | — | alpha verification record |
| AC-E03 | Source part: sender display name, both subjects and the closing line say Pharmacy Books; one `/billing` link; key shape unchanged (existing test). Deployment part judged at alpha verification | `billing-notice-wording.test.ts`; `apbm007b-store.test.ts` | see matrix / alpha record |
| AC-E04 | Prepared values ready for S2 (logo, icon, colors, names); not applied | `PREPARED_EXTERNAL_VALUES.md` §2 | alpha verification record |
| AC-D01 | Judged at alpha verification (no deployment in this module yet) | — | alpha verification record |
| AC-D02 | Judged at alpha verification | — | alpha verification record |
| AC-P01 | Changed-labels list delivered | `CHANGED_LABELS.md` | see matrix |

## E2 completion update (24 Nov, after the source-review corrections; supersedes the rows above where listed)

Still CLAIMS only; no PASS recorded by Engineering. Evidence paths relative to `EVIDENCE/E2/`.

| AC | Updated engineering claim | Evidence | Independent disposition |
|---|---|---|---|
| AC-B04 | Light only, including the initial paint. On 22 of 22 public page loads (dark OS and saved dark theme), the `dark` class was never seen, from document creation through the first frames. It was also absent with JavaScript disabled, and the built CSS has no `prefers-color-scheme` rule. Signed-in routes not rendered (S-2) | `VERIFICATION.md` §5 | see matrix |
| AC-B06 | Focus outline is surface-aware (`--pb-focus-ring`, nearest surface wins): white on navy surfaces, navy on white surfaces, including nested ones and the open mobile menus. 154 keyboard stops measured from pixels, all at least 3:1 (lowest 4.53:1), none obscured; the seeded failing control was flagged. Signed-in routes only through the markup harness (S-2) | `SOURCE_REVIEW_CORRECTIONS.md` A; `rendered_final/`; `focus-surface.test.ts` (both) | see matrix |
| AC-B08 | Partly claimed: focus-indicator contrast measured from rendered pixels (as AC-B06). Text contrast across all states is not claimed: QA's measurement | `VERIFICATION.md` §5 | see matrix |
| AC-L04 | 0 px overflow at 375 on every rendered public page and on the Help markup. The Help role table stacks as labelled pairs below md (no minimum-width table). Public mobile menus keyboard-walked. Signed-in routes not measured (S-2) | `rendered_final/console.txt`; `help-page.test.tsx` | see matrix |
| AC-H01 | As above, plus: role table readable at 375 as a stacked list with the same content (unit test plus markup render). Content per role on the signed-in route not rendered (S-2) | `SOURCE_REVIEW_CORRECTIONS.md` B | see matrix |
| AC-H03 | Interpretation **confirmed by the Architect** (AM-12): a Member's redirection from `/admin-portal` to `/owedbook` is expected; the guard is unchanged. Independent QA verification retained | `ABM_RULINGS.md` AM-12 | see matrix |
| AC-N02 | Unchanged: one old-logo reference in the unreachable `references/EmailPreview.tsx:62`; the exact one-line proposed exception is recorded (S-3) | `SOURCE_REVIEW_CORRECTIONS.md` C | see matrix |
| AC-F02 | Still BLOCKED; the reason is corrected and narrowed (no designated SCRATCH identities; the configuration exists) | `REDIRECT_REPRODUCTION.md` correction | see matrix |
| AC-R01 | Unit suites pass on the final working-tree copies: OwedBook **394/394**, Portal **584/584** | `verify3/logs/` | see matrix |
| AC-R02 | Typecheck, lint (38 and 27 warnings, equal to baseline) and build all exit 0 on the final copies | `verify3/logs/` | see matrix |
| AC-E01 | **Not claimed.** Subject, sender name and heading amendments prepared from the Director-observed values; the body line diff needs the original template HTML (X-1a), which is not in local records. Nothing reconstructed | `EXTERNAL_SETTINGS_PLAN.md` 3.1 | see matrix |
| AC-E04 | Application plan with originals, exact changes and rollback; documentation-verified controls; alpha's explicit portal configuration traced (`…diVXwt`, not the default). Not applied | `EXTERNAL_SETTINGS_PLAN.md`; `DEPLOYED_WALKTHROUGH.md` | alpha verification record |

## Signed-in completion update (24 Nov, AM-14 to AM-16; supersedes the rows above where listed)

CLAIMS only. Signed-in evidence was produced on SCRATCH with automated authentication (AM-15). It proves authenticated application behavior, not email delivery, the emailed-link lifecycle or the alpha handoff.

| AC | Updated engineering claim | Evidence (`EVIDENCE/E2/`) | Independent disposition |
|---|---|---|---|
| AC-B01, AC-B03, AC-B04 | Also on 68 signed-in page loads (3 roles, both apps, 375 and 1440): exact tokens, Inter, `dark` never seen from document creation, no theme control | `VERIFICATION.md` §6 | see matrix |
| AC-B06 | Keyboard focus measured from pixels on every signed-in page and in the mobile menus of both apps for every role: all stops at 3:1 or better on their actual surface, none obscured | §6 | see matrix |
| AC-B08 | Focus-indicator part as above; text contrast across states not claimed | §6 | see matrix |
| AC-L02 | Translated layout rendered on every listed signed-in page for the roles that may open it; audit table and dashboards inside the shell; screenshots | `signed_final/phase_a/shots/` | see matrix |
| AC-L03 | Add Pharmacy (`/stores/add`) and Help render inside the signed-in navigation (Owner; other roles see their existing outcome) | §6 | see matrix |
| AC-L04 | 0 px overflow at 375 on every signed-in page, after fixing two pre-existing overflows (Owner Billing header, Audit stacked cards); mobile menus keyboard-walked | §6; `ScreenHeader.tsx`, `common/DataTable.tsx` | see matrix |
| AC-H01 | Help reachable from the signed-in navigation (desktop and mobile) for Owner, Store admin and Member; 13 of 13 anchors land, per role; stacked role list at 375 | §6 | see matrix |
| AC-H03 | Followed as each role: Owner and Store admin reach My Stores and Billing & subscription (the existing billing view); Member is returned to the OwedBook page by the existing guard (AM-12); no error, no Owner data | §6 | see matrix |
| AC-F01 | Owner (3 stores), Store admin (1), Member (1): the placeholder is never shown beside selectable stores. Zero-store and removed-access states by unit test only | §6; `store-selector.test.tsx` | see matrix |
| AC-F02 | Bounded reproduction run: 2 attempts × 20 runs (Chromium and WebKit, fresh and warm) on the routes the candidate offers a Store admin. **Not reproduced**; no repair. Observation O-1 recorded | `REDIRECT_REPRODUCTION.md` E2 completion | see matrix |
| AC-N02 | No old-logo reference remains in either repository outside the records; the one unreachable reference was changed under the S-3 exception (AM-16) | `LEFTOVERS.md` L-9 resolved | see matrix |
| AC-E01 | Engineering part done: original saved byte for byte; amended body differs in the heading text only (one-line diff, byte proof); subject and display name prepared. Review stays with QA | `email/` | see matrix |
| AC-R01, AC-R02 | Final trees: OwedBook 394/394, Portal 584/584; typecheck, lint (baseline warnings) and builds exit 0 | `verify4/logs/` | see matrix |

## Correction after the Architect's review of package 03 (24 Nov)

**AC-F02**, wording made exact: each of the two reproduction attempts had **18 complete routes and 2 interrupted routes** (WebKit warm iterations 2 and 4, observation O-1). It is not 40 clean completed journeys. No run reached a sign-in page; not reproduced; no repair. O-1 stays with independent QA. The session method for all signed-in engineering evidence was a fixture session (Store admin, Member) or a password sign-in (Owner A); neither counts as proof of real emailed sign-in, email delivery or handoff (QAM_AMENDMENT_01 section 6; AR-3).
