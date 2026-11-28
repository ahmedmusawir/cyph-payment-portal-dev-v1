# RWO-01 changed files, grouped by item (whole of RWO-01, add-ons A1, A2 and A3 included)

Working-tree changes only. Nothing is staged or committed. Full diffs: `diff/owedbook_full.diff` and `diff/portal_full.diff`.

## OwedBook (`cyph-v1-dev`), 23 paths

| Item | Product file | Test |
|---|---|---|
| R-01 | `src/app/(public)/HomePageContent.tsx` | `src/__tests__/abm007/home-cta.test.tsx` (new) |
| R-02 | `src/components/help/HelpPage.tsx` | `src/__tests__/abm007/help-page.test.tsx` |
| R-03 | `src/components/auth/LoginForm.tsx` | `src/__tests__/auth/LoginForm.hydration.test.tsx` |
| R-04 | `src/components/ui/input.tsx` | `src/__tests__/member/ProfileForm.test.tsx` |
| R-05 | `src/app/profile/ProfileForm.tsx` | `src/__tests__/member/ProfileForm.test.tsx` (same file) |
| R-06 (a) | `src/components/ui/password-input.tsx` | `src/__tests__/auth/PasswordToggle.test.tsx` |
| R-06 (b) | `src/components/owedbook/OwedBookScreen.tsx` | `src/__tests__/owedbook/OwedBookScreen.test.tsx` |
| R-06 (c) | `src/components/global/Navbar.tsx`, `src/components/global/UserMenu.tsx` | `src/__tests__/global/Navbar.mobile.test.tsx`, `src/__tests__/global/UserMenu.test.tsx` |
| R-07 | `src/components/global/Navbar.tsx` (same file as R-06 (c)), `src/components/admin-portal/ScreenHeader.tsx` | `src/__tests__/global/Navbar.mobile.test.tsx` (same file). `ScreenHeader` has no existing test, so none was added |
| A1-1 | `src/components/global/UserMenu.tsx` (same file as R-06 (c)), `src/components/global/MobileNav.tsx` | `src/__tests__/global/UserMenu.test.tsx` (same file), `src/__tests__/global/MobileNav.test.tsx` |
| A1-2, A1-3 | `src/components/help/HelpPage.tsx` (same file as R-02) | `src/__tests__/abm007/help-page.test.tsx` (same file) |
| A2-1, A2-2 | `src/components/help/HelpPage.tsx` (same file as R-02) | `src/__tests__/abm007/help-page.test.tsx` (same file) |
| A3 | `src/components/help/HelpPage.tsx` (same file as R-02) | `src/__tests__/abm007/help-page.test.tsx` (same file) |
| Records | `CHANGELOG.md`, `agent_docs/SESSIONS/session_2026-11-26.md` (new), `agent_docs/SESSIONS/session_2026-11-27.md` (new) | — |

Product files: 11. Test files: 9 (1 new, 8 extended). Record files: 3. Add-on A1 added `MobileNav.tsx` and `MobileNav.test.tsx`; its other changes are in files RWO-01 had already changed. Add-on A2 changed only `HelpPage.tsx` and its test, both already changed, and added the 27 November session log.

Add-on A2 replaces the R-02 and A1-2 work in `HelpPage.tsx`: the link in the contents menu and the link at the end of the Help text are gone, and each article ends with its own link (ruling AM-23). The A1-3 menu scrolling stays.

Add-on A3 changed the same two files again: the "Help" heading is now the real, focusable target of the 13 links (`id="top"`), and one test was added. No new file.

## Account & Billing (`cyph-payment-portal-dev-v1`)

### RWO-01 items, 8 paths

| Item | Product file | Test |
|---|---|---|
| R-04 (same fade, same fix) | `src/components/ui/input.tsx` | No existing test covers this component; none added |
| R-08 | `src/components/portal/PublicShell.tsx`, `src/components/portal/Footer.tsx` | `src/__tests__/abm007/public-shell-fit.test.tsx` (new) |
| R-09 (a) | `src/components/portal/FormField.tsx` | `src/__tests__/password-field.test.tsx` |
| R-09 (b) | `src/components/portal/account/StoreRemovalControl.tsx` | `src/__tests__/manual-qa-portal-ui.test.tsx` |
| R-09 (c) | none (ruled a link; unchanged) | — |
| A1-4 | `src/components/portal/Footer.tsx` (same file as R-08) | `src/__tests__/abm007/public-shell-fit.test.tsx` (same file) |

Product files: 5. Test files: 3 (1 new, 2 extended). No add-on changed a further product or test file here; add-ons A2 and A3 changed none at all.

### RWO-01 records

| File | Change |
|---|---|
| `agent_docs/ACTIONS/ABM007_FINAL/ABM_RULINGS.md` | Rows AM-18 to AM-21 appended after AM-17, byte-identical to the release document; row AM-22 appended after AM-21, as given in add-on A1; row AM-23 appended after AM-22, as given in add-on A2. Add-on A3 adds no row |
| `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/CHANGED_LABELS.md` | RWO-01 section appended, then extended for add-on A1 and for add-on A2 |
| `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/` (new folder) | The four reports and their lists, `tools/` (`measure.mjs`, `measure_a1.mjs`, `measure_a2.mjs`, and for A3 `driver_a3.mjs`, `lib_a3.mjs`, `a3_steps/`, `a3_static/`), `measure/` data and masked screenshots (A3 in `measure/a3/` and `measure/a3_static/`), `logs/` to `logs_a3/`, `diff/`, `binding/` to `binding_a3/`, the staging lists and commit messages |
| `CHANGELOG.md`, `session_2026-11-26.md`, `session_2026-11-27.md` (new) | Appended entries |
| `agent_docs/RESPONSES/response_2026-11-26_*_rwo01-*.md`, `response_2026-11-27_*_rwo01-a2-*.md` and `response_2026-11-27_*_rwo01-a3-*.md`; the four return ZIP copies and their `.sha256` files in `EVIDENCE/RWO01/` | The return 04 response file and ZIP are written after the ZIP is built, so they are not inside it |

### Not RWO-01: record changes made at the Director's request (26 November items confirmed by ruling AM-22 (3))

| File | Change |
|---|---|
| `session_2026-11-26.md` (new) | The 26 November session log, started before RWO-01 arrived |
| `session_2026-11-27.md` (new), `CHANGELOG.md` | The 27 November session log and its changelog entry, started at the Director's request before add-on A2 arrived |
| `RECOVERY.md` | One block added at the top; nothing else changed |
| `agent_docs/ACTIONS/ABM007_FINAL/ABM_STATE.md` | Index refreshed to the QA state as it stood on the morning of 26 November |
| `CHANGELOG.md` | Two entries for the above |

### Not touched

`agent_docs/ACTIONS/ABM007_FINAL/QAM/` holds the QA Executor's uncommitted records. I changed nothing there, and both diffs leave it out.
