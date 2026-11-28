# RWO-01 add-on A2, engineering return 03 — ABM007_FINAL

**From:** the Engineer · **To:** the QA Lead · **Copied:** the Director, the Architect, the QA Executor
**Date:** 27 November 2026, Asia/Dhaka · **Status:** `RWO-01 ADD-ON A2 COMPLETE — AWAITING QA CONFIRMATION`

Both add-on items are done, on top of the uncommitted RWO-01 and A1 working trees. A2-1 is built as ruled. A2-2 found one cut outline, in the Help contents menu, and I fixed its layout; the other three controls were whole and are unchanged.

These are engineering claims for QA to test, not results.

## 1. One thing to know first: the governing document was not opened as a file

The work order says to read `QA_LEAD_ADJUDICATION_ABM007_FINAL_Q4_2026-11-27.md` in the VM Downloads folder, and to stop if it cannot be opened. It was not there (checked at 10:37 and again at 11:00), so I stopped and said so. The Director then pasted the document's full text into the conversation a second time. I worked from that pasted text, section 6. No file was opened, so I record no file hash for it.

## 2. Starting point and limits kept

- Both repositories were on `qa/abm007-final` at OwedBook `2e91e90905b2d9907577a64985e643f7827019ac` and Account & Billing `fc1fa6c2a90ebf59987287ad765e2e65cf635549`, with RWO-01 and A1 uncommitted and nothing staged. That is unchanged now.
- Before I changed anything, every product and test file in both working trees was byte-identical to the copies A1 was measured on (`binding_a1/`). Only `CHANGELOG.md` and the Account & Billing session logs differed.
- Nothing inside `agent_docs/ACTIONS/ABM007_FINAL/QAM/` was touched.
- No protected path, migration, guard, dependency or hardcoded color. The add-on changed one product file and one test file, both in OwedBook.
- SCRATCH only, verified from the running server before every sign-in. No email, invitation, removal, billing-portal opening, purchase or fixture change.
- No Account & Billing page was loaded at all (the tool counts them: 0). Its server ran beside OwedBook's only because the serve tool starts the pair.
- Both local servers are stopped. Ports 3100 and 3101 were free when I started (the QA Executor's listeners were already gone).
- "Before" is the A1 build. "After" is a new build of the working trees with this add-on. Browsers: Chrome 158 and WebKit 26.4. Firefox was not run.

## 3. Item by item

### A2-1 — Help "Go to the Top" at the end of each article. Changed.

`src/components/help/HelpPage.tsx`, `src/__tests__/abm007/help-page.test.tsx`

Where the link is (the same at 375, 768, 1024 × 600 and 1440 × 900, in both browsers):

| | Before (A1) | After |
|---|---|---|
| "Go to the Top" links shown at 375 and 768 | 2: one in the contents menu, one after the last article | 13: one at the end of each article, inside it |
| Shown at 1024 and 1440 | 1: in the contents menu | 13: one at the end of each article, inside it |
| In the contents menu | 1 | 0 (the menu holds the 13 article links only) |
| After the last article, directly on the light blue page | 1 below 1024 wide | 0 |
| Articles whose last element is the link | 0 of 13 | 13 of 13 |

Measured contrast of the link:

| Width | Before | After |
|---|---|---|
| 375 | menu link 4.53 to 1 on white; **end-of-text link 4.04 to 1** on the light blue page `rgb(234, 243, 250)` (finding F36) | all 13 links **4.53 to 1**: dark green `rgb(40, 132, 114)` on white `rgb(255, 255, 255)` |
| 1440 | menu link 4.53 to 1 on white (the end-of-text link is hidden) | all 13 links **4.53 to 1**, same colors |

- The surface was also read back from the screen: the pixel beside the first, seventh and last link is `rgb(255, 255, 255)` at every width. Every article is a white card, so the rule gives dark green and underlined; no link sits directly on the light blue page any more, so the navy variant is not used.
- 4.53 is the same pair every other link on a white card uses. It passes 4.5 by a small margin.
- Target: 44px tall and about 83px wide; 13px underlined text. Lowest target height of any shown link: 44.
- Returning to the top, tested on the first, seventh and last link at each of the four sizes: after a mouse click and after Enter from the keyboard the page is at scroll position 0 with the header in view. The reader started from as far down as 11,503px (375 wide).
- Focus outline of those links, with the link in the middle of the window: 2px navy `rgb(21, 68, 116)`, 2px offset, whole on all four sides (100% of each side carries the outline color). The article box does not clip: no ancestor of the link clips at all.
- No sideways overflow at any of the four sizes.
- The contents menu still scrolls inside itself on a short window: at 1024 × 600 its box is 568px and its content 656px. At 1440 × 900 the content (656px) fits and nothing scrolls.
- Tests: the menu holds exactly 13 links; every article ends with one "Go to the Top" link in the link style with a 44px target, as its last element, with no class that hides it at any width; there are exactly 13 such links, all inside articles, none in the menu, and the old end-of-text link is gone.

### A2-2 — Focus outlines, verify first.

How each outline was judged: the control was focused with real key presses, placed in the middle of the window where the page allows, and then checked two ways. Geometry: the outline box against the window and against every ancestor that clips. Pixels: a screenshot of the focused control read back, giving the share of each side's length that carries the outline color. A side is whole when nothing cuts it and at least 95% of its length carries the color.

| Control | Before | After | Change |
|---|---|---|---|
| Help contents menu links, 1440 × 900 | 14 of 14 whole | 13 of 13 whole | none needed at this size |
| Help contents menu links, 1024 × 600 | **13 of 14 whole. Link 12: the bottom edge was cut by 4px** by the menu's own scrolling box (0% of that side visible) | **13 of 13 whole** | layout fix, below |
| Add control ("Add store"), OwedBook `/admin-portal/billing`, 375 wide | whole on four sides (100% each) | whole on four sides | none |
| Password field ("New Password"), OwedBook `/profile`, 375 wide | whole on four sides (100% each) | whole on four sides | none |
| Its show-or-hide button ("Show password") | whole on four sides (100% each) | whole on four sides | none |

**The one cut edge, and its fix.** When the reader tabs down the menu on a short window, the menu scrolls just far enough to show the next link's box. The outline sits 4px outside that box, so its bottom edge fell under the edge of the scrolling menu. The fix is one layout class on the menu (`lg:scroll-py-2`, 8px of scroll padding): the menu now stops 8px clear of a focused link. No color, size or content changed.

Contents menu, link by link, with the reader at page scroll 1500 so the menu is stuck 16px from the top of the window:

| | Before | After |
|---|---|---|
| Every link reached by Tab, with the browser's own keyboard focus style | yes (14) | yes (13) |
| Every focused link scrolled fully into view inside the menu box, without help from the tool | yes | yes |
| Menu scrolled while tabbing, 1024 × 600 | 147px | 90px in Chrome, 82px in WebKit |
| Page itself scrolled while tabbing | no | no |

Details for the other three controls:

- **Add control:** box 16 to 336 across at 375 wide, 44px tall; 2px navy outline, 2px offset; no clipping ancestor; no sideways overflow.
- **Password field:** box 49 to 326 across, 42px tall; its focus ring is drawn as a box shadow (2px navy, 2px offset) by the shared field style, and the same check was made on the ring. No clipping ancestor.
- **Show-or-hide button:** 44 × 44; 2px navy ring, no offset. No clipping ancestor.
- The Add control and the password controls were focused only: never pressed, never typed in. The password fields were empty before and after.

Proof files: `measure/measure_a2_before.json`, `measure/measure_a2_after.json` and the screenshots in `measure/shots_a2_before/` and `measure/shots_a2_after/` (`A2-2_*`).

## 4. Two things about the measuring, said plainly

- **A first "before" run is kept and should not be read as results** (`measure/measure_a2_before_run1.json`). In that run my tool reached the first menu link with Shift+Tab then Tab, which scrolled the page itself and left the menu partly below the window. It reported two outlines cut by the window edge (link 13 at 1440 × 900, link 7 at 1024 × 600), which is the instrument effect the adjudication describes, and it could not read the ring of the password controls. It did show the real cut at link 12 in both Chrome and WebKit. I corrected the tool and ran "before" again in Chrome only, to save sessions.
- **WebKit, article links:** the tool's Shift+Tab then Tab did not come back to the article link in WebKit, so there the link was focused by script after the key presses. WebKit still showed its keyboard focus style, the outline was whole, and Enter returned to the top. In Chrome the focus was by keyboard throughout. The menu links were reached by Tab in both browsers.

## 5. Checks

Run on hash-bound copies of both working trees (`binding_a2/`), logs in `logs_a2/`.

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 408 of 408 passed (60 suites) | 588 of 588 passed (37 suites) |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (unchanged) | 0 errors, 27 warnings (unchanged) |
| Production build | succeeded | succeeded |

The OwedBook count stays at 408: two Help tests were replaced by two.

## 6. Sessions used

| Run | Sign-in sessions |
|---|---|
| "Before", first run (Chrome and WebKit) | 2 |
| "Before", corrected tool (Chrome) | 1 |
| "After" (Chrome and WebKit) | 2 |
| **Add-on A2 total** | **5 of 8** |

All five were the fixture Owner A through the password form on OwedBook, on SCRATCH. No Account & Billing sign-in and no Account & Billing page load. Across RWO-01 and both add-ons: 17 sessions.

## 7. Records

- `ABM_RULINGS.md`: row AM-23 appended after AM-22, with no other edit. Rows AM-19 and AM-22 are unchanged, although AM-23 replaces parts of them.
- `EVIDENCE/E2/CHANGED_LABELS.md`: add-on A2 block with the link's new place and the two places it left.
- Staging lists regenerated from the working trees; see `STAGING_LIST_*.txt` and `COMMIT_MESSAGES.md`.

## 8. Noticed, not fixed

See `NOTICED_NOT_FIXED.md`, section "Add-on A2".
