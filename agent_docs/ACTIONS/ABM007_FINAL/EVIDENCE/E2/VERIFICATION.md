# Final engineering verification (amendments B and C)

All results are engineering CLAIMS for independent QA to test.

## 1. How the verification copies were assembled (amendment B)

Script: `tools/assemble.sh <repo> <dest> <evidence_dir>`. For each repository, at one moment:

1. `git status --porcelain=v1 -uall` saved with HEAD (`verify/<repo>_status.txt`).
2. Inventory = `git ls-files -co --exclude-standard` (tracked files as they are **on disk**, so staged and unstaged edits are included, plus untracked non-ignored files), minus `.env*` and `agent_docs/` (`verify/<repo>_inventory.txt`). Deleted tracked files (the 16 retired specs) are absent from disk and therefore absent from the copy.
3. Each inventoried file copied into a scratch directory outside both repositories.
4. SHA-256 of every inventoried file taken in the **source working tree** (`verify/<repo>_source.sha256`) and checked against the copy with `sha256sum -c`: OwedBook 407 files, Portal 288 files, all matching. Re-run after the favicon fix, matching again.
5. The copy is refused if any `.env*` file is present. `node_modules` copied unchanged from each repository (no install, no dependency change).

Build-time configuration was passed as process environment, never as a file, with placeholder values only: `NEXT_PUBLIC_APP_ENV=local`, `NEXT_PUBLIC_SITE_URL=http://localhost:<port>`, `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54399` (nothing listens there: no backend at all), `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=placeholder-not-a-key`, and for OwedBook `NEXT_PUBLIC_APBM_DATA_MODE=mock`. No credential appears in any evidence file.

## 2. Full required checks at completion (amendment C)

| Check | OwedBook | Portal | Log |
|---|---|---|---|
| Unit (`npx jest --ci`) | exit 0; 58 suites, **389/389** (baseline 54 / 374) | exit 0; 35 suites, **580/580** (baseline 32 / 572) | `verify/ob_test.log`, `verify/pp_test.log` |
| Typecheck (`npx tsc --noEmit -p .`) | exit 0 | exit 0 | `verify/*_typecheck.log` |
| Lint (`npx eslint .`) | exit 0; 0 errors, **38 warnings** (= baseline) | exit 0; 0 errors, **27 warnings** (= baseline) | `verify/*_lint.log` |
| Production build (`npx next build`) | exit 0 (second run; the first failed on the favicon format, fixed) | exit 0 (same) | `verify/*_build.log` |

Exit codes: `verify/ob_exit.txt`, `verify/pp_exit.txt`. During implementation only targeted test files and typecheck were run; the full set ran once, and only the build was repeated after the favicon change (the change touches no test input).

## 3. Rendered self-checks on served production builds (ruling AM-08 (5))

Servers: the two verified copies, `next start -p 3300` (OwedBook) and `-p 3301` (Portal), started after the builds (about 04:30Z), stopped 04:37Z (ports confirmed closed). Backend identity: the placeholder above, so no session, no data and no external call are possible. Browser: Google Chrome via Playwright 1.59.1; script `tools/rendered_checks.cjs`; raw output `rendered/rendered_checks.json`; 26 full-page screenshots in `rendered/shots/`.

Pages: OwedBook `/`, `/auth`, `/auth/link-expired`, `/auth/signed-out`, `/auth/sign-in-to-continue`, a 404; Portal `/login`, `/register/plan`, `/register/owner` (and `/register/pharmacy`, `/register/review`, which return the owner step without a draft), `/auth/link-expired`, a 404. Each at 375 and 1440 px, with the OS set to dark **and** `localStorage.theme = "dark"` before first script.

| Check | Observed on every page and width |
|---|---|
| Forced light (AC-B04 part) | No `dark` class on `<html>`; body background `#eaf3fa` |
| Token resolution (AC-B01 browser part) | `--brand-navy` #154474, `--brand-green` #32a38d, `--brand-green-dark` #288472, `--brand-ice` #eaf3fa, `--brand-charcoal` #393b38, `--brand-gray` #515151, `--primary` #288472, `--heading` #154474: 0 mismatches |
| Failing control | `hsl(168 53% 34%)` resolved to a different color and was flagged on every page (instrument can fail) |
| Overflow at 375 (AC-L04 part) | `scrollWidth − innerWidth` = 0 |
| Font (AC-B03 part) | Computed body family `Inter, "Inter Fallback"` (next/font, self-hosted) |
| Theme control | 0 found |
| Old name | "Cyber Pharma" absent from text and title |
| Buttons | None uppercase; none under 44px except the visually hidden skip link |
| Logo | Logo tile present with the master image on every branded page |

Signed-out guard outcomes: OwedBook `/help` and `/owedbook` → 307 `/auth`; Portal `/dashboard` → 307 `/login`.

**Not rendered (BLOCKED, no SCRATCH fixtures):** every signed-in screen in both apps (dashboards, admin pages, profile, Help content, Add Pharmacy, billing), so AC-L02, AC-L03, AC-H01 rendered parts, AC-F01 rendered states and the redirect reproduction (AC-F02) have no rendered engineering evidence. The OwedBook landing screenshot could not be captured cleanly for the same reason and was removed (P-08 allows removal). Rendered contrast across states (AC-B08) was not probed by Engineering; it is QA's measurement.

## 4. Source checks

| Check | Method | Result |
|---|---|---|
| Hardcoded colors (AC-B02) | `tools/colorscan.py <repo> --control` (seeded control first; CSS comments and the frozen `.dark` block excluded) | Control flagged; **0** hits in both apps |
| Protected paths (AC-R03) | `<repo>_changes_vs_baseline.txt` from `git diff --name-status <baseline>` plus untracked | Portal: only `src/server/billingNotices.ts` (5 lines, brand strings). OwedBook: none from this session (`RECOVERY.md` differs only through the Director's commit `c335671`; working tree equals HEAD). No dependency, lockfile, migration, API, proxy, auth or deploy file |
| Prices (AC-R05) | `git diff <baseline> -- src/server/pricing.ts src/server/storePricing.ts` | Empty |
| Names (AC-N01) | `grep -rni "cyber.\?pharma" src` (non-test) | OwedBook: one internal comment (`mailGuard.ts`). Portal: two comments (`brand.ts`, `mailGuard.ts`). No customer-visible string |
| Logo (AC-N02) | `sha256sum` and reference scan | Master hash matches in both; one old-logo reference remains in an unreachable Portal module (`LEFTOVERS.md` L-9, exception needed) |

## 5. E2 completion run (24 Nov, after the source-review corrections) — supersedes sections 2 and 3 for the final tree

All results are engineering CLAIMS. The run binds to the final working trees.

**Copies.** `tools/assemble.sh <repo> <scratch>/v3/<app> verify3`, the same method as section 1. OwedBook 408 files, Portal 289 files, all hashes matching (`verify3/<repo>_source.sha256`, `_inventory.txt`, `_status.txt`). `node_modules` copied unchanged. No `.env*` in either copy. An earlier completion run (v2) went green but was superseded, because the keyboard walk then found the overlay regression (`SOURCE_REVIEW_CORRECTIONS.md` A). Its evidence was discarded and everything below was rerun after the fix.

**Commands** (`tools/run_checks.sh`, run in each copy; placeholder public values only, as in section 1):

| Command | OwedBook | Portal |
|---|---|---|
| `npx jest --ci` | exit 0; 59 suites, **394/394** | exit 0; 36 suites, **584/584** |
| `npx tsc --noEmit -p .` | exit 0 | exit 0 |
| `npx eslint .` | exit 0; 0 errors, 38 warnings (= baseline) | exit 0; 0 errors, 27 warnings (= baseline) |
| `npx next build` | exit 0 | exit 0 |

Logs: `verify3/logs/`. The behavioral and pricing regression suites are part of those runs and unchanged in source. Prices: `git diff <baseline> -- src/server/pricing.ts src/server/storePricing.ts` is empty.

**Built CSS.** Neither app's built stylesheet contains a `prefers-color-scheme` rule. The frozen `.dark` rules exist but apply only under a `dark` class on `<html>`.

**Rendered self-checks** (`tools/rendered_checks_v2.cjs`; servers `next start -p 3300` and `-p 3301` from the copies, started 07:52:00Z, stopped 07:53:54Z, ports confirmed closed; no backend reachable).
- Chrome with a dark OS setting and `localStorage.theme = "dark"` set before any page script.
- Pages: OwedBook `/`, `/auth`, `/auth/link-expired`, `/auth/signed-out`, `/auth/sign-in-to-continue`, a 404; Portal `/login`, `/register/plan`, `/register/owner`, `/auth/link-expired`, a 404. Each at 375 and 1440 px.

| Check | Method | Result |
|---|---|---|
| Initial paint, light only | (1) A script installed **at document creation**, before any page script, records the `<html>` class, `color-scheme` and `data-theme` at first sight and on every change, and at the first four animation frames (frames are painted only after their callbacks). (2) Each page loaded with **JavaScript disabled**, showing the server HTML and CSS alone. (3) The built-CSS scan above | `dark` never appeared at any recorded moment on any page or width (22 of 22). With scripts disabled, no `dark` class and body `#eaf3fa` on 22 of 22. This is evidence about the paint before and during hydration, not only after load. It is not a frame-by-frame video capture |
| Exact tokens | Browser-resolved `hsl(var(--token))` for the eight anchors | 0 mismatches; the failing control was flagged on every page |
| Inter | Computed body font; loaded font faces | `Inter, "Inter Fallback"` everywhere |
| Overflow at 375 | `scrollWidth − innerWidth` | 0 on every page; also 0 on the Help markup |
| Theme control, old name | DOM and text scan | none |
| Keyboard focus on actual surfaces | Tab walk. For each stop, a screenshot around the control; contrast of the indicator pixels against the surface pixels 8 to 9 px outside, on four sides. Hidden radios are measured at their visible card. A stop is flagged if anything covers its centre | 154 stops, 154 pass (49 white on navy, 105 navy on white), lowest side 4.53:1, none obscured. Seeded control (white ring on white) flagged at 1:1 at both widths |
| Responsive navigation | 375 px: OwedBook landing menu, Portal `/login` and `/register/plan` menus opened from the keyboard, then walked | 11 stops, all pass |
| Help at 375 and 1440 | Real Help and signed-in Navbar markup (fictional identity, scratch-only jsdom harness `tools/zz_markup_harness.test.tsx.txt`, never in a repository) placed on a served OwedBook page so the built CSS and Inter apply | 375: stacked list shown (6 items), table hidden, overflow 0; 18 focus stops pass, and 12 with the menu open. 1440: table shown, list hidden; 22 stops pass |

Screenshots: `rendered_final/shots/` (28). Raw output: `rendered_final/rendered_checks_v2.json`, `console.txt`. Harness markup: `rendered_final/harness/`.

**Not checked by Engineering, and why:**
- **Signed-in routes in both apps (S-2).** SCRATCH connection settings exist in OwedBook's `.env.local` (`APBM_SCRATCH_*`, values not read), but no SCRATCH identity has been **designated** for this module (ruling AM-08 (5)) and no non-secret way to sign one in exists. Engineering does not receive emailed links, and minting a session with the service key is not permitted. Affected: AC-L02, AC-L03, AC-H01 (rendered, per role), AC-H03 (rendered), AC-F01 (rendered states), AC-F02 (redirect reproduction), and the signed-in parts of AC-B06, AC-B07 and AC-B08.
- **Rendered text contrast across every state.** AC-B08 is QA's measurement. Engineering measured focus indicators from pixels and confirmed exact tokens.
- WebKit and Firefox; live email; the Stripe previews.

## 6. Signed-in verification on SCRATCH (24 Nov, AM-14 to AM-16) — supersedes the "not checked" items of section 5

All results are engineering CLAIMS for independent QA to test.

**Final source changes in this round:**
- Portal `src/components/portal/references/EmailPreview.tsx` (the S-3 line, AM-16).
- OwedBook `src/components/admin-portal/ScreenHeader.tsx` (the header row wraps) and `src/components/common/DataTable.tsx` (stacked-card values wrap). These are two pre-existing 375 px overflows, found by the signed-in check and fixed in allowed paths.

**Affected checks after the final source change.** Copies were assembled by `tools/assemble.sh` (`verify4/`): OwedBook 408 files and Portal 289, hash-bound, with no `.env*`. Logs are in `verify4/logs/`.

| Command | OwedBook (changed) | Portal (changed) |
|---|---|---|
| `npx jest --ci` | exit 0, 394/394 | exit 0, 584/584 |
| `npx tsc --noEmit -p .` | exit 0 | exit 0 |
| `npx eslint .` | exit 0, 38 warnings (= baseline) | exit 0, 27 warnings (= baseline) |
| `next build` (SCRATCH public values; `tools/scratch_proof/serve.mjs build`) | exit 0 | exit 0 |

**Backend identity, checked twice before any sign-in:**
1. Build output: SCRATCH backend URLs present in both apps (OwedBook client 1 and server 13 files; Portal server 15), and no DEV backend URL. The only DEV string allowed is the mail guard's "is this DEV?" comparison literal. `verify4/logs/summary.txt` records two earlier failing runs of the check itself before it was narrowed to backend URLs; the source did not change between them.
2. Runtime, per listening server process: the working directory is the verification copy, the Supabase URL resolves to `ihgcsrypblqkwommrkgj`, and `APP_ENV` is `local-proof`. Recorded in `signed_final/phase_a/signed_checks_phase_a.json` under `served`.

**Servers:** proof pair OwedBook 3100 and Portal 3101 on 127.0.0.1, with mail blocked (empty allowlist, no Resend key) and no Stripe listener. First serving 08:26 to 08:43Z; final serving 08:45:13Z to 09:10:17Z. Stopped, ports confirmed closed (`signed_final/serve_pids_start_stop.json`).

**Authentication (`tools/scratch_proof/auth.mjs`; README there):**
- Owner A used the normal password form in both apps.
- Store admin and Member have no password in the cast, so they used the AM-15 provider token through each app's own confirm page and **Sign in** button.
- Totals across every run of this round, including the debugging runs: **8** successful password sign-ins (Owner A) and **50** token sign-ins (50 `generateLink` calls, no email): phase A runs 4 + 4 + 16, link inventory 2, reproduction attempts 12 + 12. One password attempt never submitted (selector fault, since fixed).
- Nothing else was written: no user, password or business data changed.

**Phase A: signed-in pages.** Chromium, at 375 and 1440 px, with a dark OS setting and a saved dark theme. Roles: Owner, Store admin, Member.
- Pages: OwedBook `/owedbook`, `/help`, `/profile`, `/invitations`, `/admin-portal` and every admin sub-page the sidebar offers the role (billing, settings, audit, a store, its invite page). Portal `/dashboard`, `/billing`, `/stores/add`.

| Check | Result |
|---|---|
| Pages | 68 page loads, all HTTP 200, all landing as the guards intend (a Member sent from `/admin-portal` to `/owedbook`) |
| Light from document creation | `dark` never seen on any of the 68 |
| Exact tokens; failing control | 0 mismatches; control flagged on every page |
| Inter; theme control; old name | Inter everywhere; 0 theme controls; no "Cyber Pharma" |
| Overflow at 375 | 0 on every page after the two fixes. Before them: Owner Billing 142 px, Owner Audit 19 px |
| Keyboard focus on actual surfaces (pixels) | Every stop on every page passed (3:1 or better on its surface), none obscured |
| Mobile menus (375; opened from the keyboard) | OwedBook and Portal menus for all three roles walked; all stops pass. OwedBook items by role: Owner and Store admin: OwedBook, Admin Portal, Profile, Help, Log out. Member: OwedBook, Profile, Help, Log out |
| OwedBook data table width at 1440 | Audit table 978 px inside the shell; Help role table 768 px (table shown); at 375 the Help table is hidden (stacked list) |
| Help per role (AC-H01) | 13 of 13 contents links land on their section, for each role |
| Help app links per role (AC-H03) | Owner: `/admin-portal` → My Stores; `/admin-portal/billing` → Billing & subscription. Store admin: the same. Member: both → `/owedbook` (the existing guard; AM-12). No error page |
| Store selector (AC-F01 engineering part) | Owner 3 stores, Store admin 1, Member 1: placeholder never shown beside selectable stores. Zero-store and removed-access states: unit test only (no such existing fixture was used; QA's matrix) |

**Phase B: AC-F02 redirect reproduction** (`REDIRECT_REPRODUCTION.md` E2 completion section).

**Masking and privacy:**
- Before every screenshot, fixture addresses, their local parts and names stored on SCRATCH are replaced on screen. Recorded text is scrubbed the same way.
- `privacy_scan.mjs`-style check: 10 private strings × 40 text evidence files = 0 hits.
- Secret-pattern scan: 0 hits.
- No browser state was written.

**Observation O-1 (not a defect claim; no change made).** In WebKit only, in warm iterations 2 and 4 of both reproduction attempts, the scripted navigation from OwedBook Billing to Account & Billing was pre-empted by a navigation to the same Billing URL. The user stayed signed in on Billing; no sign-in page was reached. Neither the Billing screen nor the sidebar calls the router. The likely cause is WebKit committing a pending client navigation late, after the script had moved on. Not proven. For QA to rerun.

**Still not checked by Engineering:**
- Firefox.
- Rendered text contrast across every state (AC-B08, QA's measurement).
- Email delivery, the emailed-link lifecycle, and the real alpha handoff (AM-15; `DEPLOYED_WALKTHROUGH.md`).

## 7. Notes after the Architect's review of package 03 (24 Nov)

- **AC-F02:** each attempt had 18 complete routes and 2 interrupted routes (O-1); not 40 clean completed journeys.
- **Build-check provenance:** the three failed runs of the backend check, before the final passing check, are recorded in `signed_final/SCRATCH_BUILD_INSTRUMENT_HISTORY.md` alongside the final `scratch_build_check.json`.
- **Session methods:** fixture session (provider token: Store admin, Member) and password sign-in (Owner A). Neither is real emailed sign-in, email delivery or handoff proof.
- **No product file changed after package 03,** so no product test was rerun for the final documentation packaging.
