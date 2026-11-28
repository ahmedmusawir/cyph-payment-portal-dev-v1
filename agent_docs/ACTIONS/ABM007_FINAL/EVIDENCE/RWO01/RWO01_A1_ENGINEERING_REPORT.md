# RWO-01 add-on A1, engineering return 02 — ABM007_FINAL

**From:** the Engineer · **To:** the QA Lead · **Copied:** the Director, the Architect, the QA Executor
**Date:** 26 November 2026, Asia/Dhaka · **Status:** `RWO-01 ADD-ON A1 COMPLETE — AWAITING DIRECTOR COMMIT`

All four add-on items are done, on top of the uncommitted RWO-01 working trees. Nothing else was changed. This report covers the add-on; return 01's report (`RWO01_ENGINEERING_REPORT.md`, included) still stands for R-01 to R-09.

These are engineering claims for QA to test, not results.

## 1. Starting point and limits kept

- Both repositories were still on `qa/abm007-final` at OwedBook `2e91e90905b2d9907577a64985e643f7827019ac` and Account & Billing `fc1fa6c2a90ebf59987287ad765e2e65cf635549`, uncommitted, nothing staged. That is unchanged now.
- Nothing inside `agent_docs/ACTIONS/ABM007_FINAL/QAM/` was touched.
- No protected path, migration, guard, dependency or hardcoded color.
- SCRATCH only, verified from the running server before every sign-in. No email, invitation, removal, billing-portal opening or purchase. Both local servers are stopped.
- "Before" is the return 01 build. "After" is a new build of the working trees with the add-on. Browsers: Chrome 158 for both; WebKit 26.4 for "after". Firefox was not run.

## 2. Item by item

### A1-1 — "Subscribe Now" in the opening page header and phone menu. Changed.

`src/components/global/UserMenu.tsx`, `src/components/global/MobileNav.tsx`

| | Before | After |
|---|---|---|
| Header green button (1440 wide) | **Start free trial**, opens `/auth`, 137 × 44 | **Subscribe Now**, opens the Account & Billing home page, 148 × 44 |
| Phone menu green button (375 wide, menu open) | **Start free trial**, opens `/auth` | **Subscribe Now**, opens the Account & Billing home page, 343 × 44 |

- The look is kept: same green `rgb(40, 132, 114)`, white 15px text, 8px corner, hover `rgb(36, 119, 103)`, white focus outline on the navy header.
- The address comes from the same existing table the body button uses (`peerOrigin()`), never typed in.
- The header button is 11px wider only because the new words are longer.
- Both unit tests that named the old wording are updated.

**The "free trial" scan of the opening page.** Each row counts matches in any letter case.

| Where scanned | Before | After |
|---|---|---|
| Page text, shown or hidden, 1440 wide | 1 (header) | 0 |
| Page text, 375 wide, menu closed | 1 (header, hidden) | 0 |
| Page text, 375 wide, phone menu open | 2 (header) | 0 |
| Labels, tooltips, image text, placeholders | 0 | 0 |
| Tab title and page description | 0 | 0 |
| The whole served page, including its scripts | 1 to 2 | 0 |

- Chrome and WebKit agree.
- In the OwedBook source, "free trial" now appears only in three tests that check it is absent.

### A1-2 — "Go to the Top" at the end of the Help text, below 1024 wide. Changed.

`src/components/help/HelpPage.tsx`

| Window | Before | After |
|---|---|---|
| 375, 768, 1023 wide | no link at the end of the text | link shown under the last section; in view when the reader is at the bottom of the page |
| 1024, 1440 wide | no link | not shown there (the menu link is in view) |

- It is the same link as in the contents menu: 13px, dark green, underlined, 44px tall target.
- Mouse click and keyboard Enter both return the page to the very top with the header in view, at all three narrow widths, in both browsers.
- Its keyboard focus outline was not captured by this run (the check focused it right after a mouse click). It uses the same link class as the menu link, whose outline return 01 measured as solid 2px navy.

### A1-3 — the Help contents menu scrolls inside itself. Changed.

`src/components/help/HelpPage.tsx`

The menu's content is 713px tall. "Reader scrolled" means the page was scrolled 1,500px down first.

| Window | Before | After |
|---|---|---|
| 1024 × 600 | menu 715 tall, taller than the window; "Go to the Top" below the fold; **not reachable by mouse** | menu box 568 tall and scrolls inside itself; the link comes into view after scrolling the menu 147px; mouse and keyboard both return to the top |
| 1440 × 650 | same: below the fold, **not reachable by mouse** | menu box 618 tall and scrolls inside itself (97px); mouse and keyboard both return to the top |
| 1024 × 900, 1440 × 900 | menu fits; link in view | unchanged: menu fits, no inner scrolling, link in view |

- Before the fix, keyboard Enter still worked at the short sizes, because focusing the link scrolled the whole page; the page jumped about 370 to 390px to do it. After the fix the page stays where the reader was (1,500px) and only the menu scrolls.
- Chrome and WebKit agree.
- Screenshots: `measure/shots_after/A1-3_help_menu_1024x600.png` and `A1-3_help_menu_1440x650.png`.

### A1-4 — signed-in Account & Billing footer. Changed.

`src/components/portal/Footer.tsx`

Same result on `/dashboard` and `/billing`.

| Width | Before | After |
|---|---|---|
| 767 | links broken across lines | stacked, one per line, centered |
| 768 | links broken across lines | stacked, one per line, centered |
| 769 | links broken across lines | stacked, one per line, centered |
| 1023 | one row | stacked, one per line, centered |
| 1024 | one row | one row |

- The signed-in footer now uses exactly the signed-out footer's layout. Only its colors differ (grey text and navy links on the light page).
- At 1023 the row did fit before; it now stacks, because the rule is "below 1024", as ruled.
- No sideways overflow at any width. Chrome and WebKit agree.

## 3. Sessions and page loads used

**Sign-in sessions for the add-on: 6. Total for RWO-01: 12 of 20.** All were the fixture Owner A through the normal password form.

| Run | OwedBook | Account & Billing |
|---|---|---|
| Before (return 01 build), Chrome | 1 | 1 |
| After (add-on build), Chrome | 1 | 1 |
| After (add-on build), WebKit | 1 | 1 |

**Account & Billing page loads for A1-4: 6 in total**, two per session: the dashboard the app lands on after sign-in, and `/billing`. The five widths were measured by resizing the window, not by reloading.

- Each load made one request to the page's own overview route, so **6 requests** reached the route that reads card details at Stripe (counted by the tool: 2, 2 and 2). Each such request makes one to four read-only lookups there.
- The tool also counted 3 navigation events per session, because signing in passes through a redirect before the dashboard settles.
- No other Stripe activity: no billing portal, no checkout, no purchase.

## 4. Checks

Run on hash-bound copies of the working trees with the add-on. Logs are in `logs_a1/`.

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 408 passed of 408, 60 suites (return 01: 406) | 588 passed of 588, 37 suites (return 01: 588) |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (unchanged) | 0 errors, 27 warnings (unchanged) |
| Production build | succeeded | succeeded |

- OwedBook: two new Help tests (A1-2, A1-3); the header and phone-menu tests now check the new words and address.
- Account & Billing: the footer test that expected the old signed-in layout now checks the new one, so the count is unchanged.

## 5. Records updated

- `ABM_RULINGS.md` section 3: row AM-22 appended after AM-21, as given, with no other edit.
- `EVIDENCE/E2/CHANGED_LABELS.md`: the header and phone-menu wording change and the second "Go to the Top".
- `FREE_TRIAL_LIST.md`: now records that none remains.
- Session logs and changelogs in both repositories.

## 6. Noticed and not fixed

See `NOTICED_NOT_FIXED.md`, updated with your rulings. Nothing new came up during the add-on except one small point:
- On the opening page the header's green button and the body's green button now carry the same words and go to the same place, as ruled. The header's "Log in" link and the body's navy "Log in" button do too.

## 7. For the Director's commit

- `CHANGED_FILES.md` lists every changed file for the whole of RWO-01, add-on included.
- The staging lists are regenerated and inside this package: `STAGING_LIST_owedbook.txt` (22 paths), `STAGING_LIST_portal.txt`, and `STAGING_LIST_portal_optional.txt` (the two return ZIPs and their checksums). No QAM path is in any of them.
- The proposed commit messages are in `COMMIT_MESSAGES.md`.
