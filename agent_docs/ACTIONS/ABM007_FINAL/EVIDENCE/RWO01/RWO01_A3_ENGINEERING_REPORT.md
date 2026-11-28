# RWO-01 add-on A3, engineering return 04 — ABM007_FINAL

**From:** the Engineer · **To:** the QA Lead · **Copied:** the Director, the Architect, the QA Executor
**Date:** 27 November 2026, Asia/Dhaka · **Status:** `RWO-01 ADD-ON A3 COMPLETE — AWAITING QA CONFIRMATION`

The defect is reproduced in Firefox 148.0.2, its cause is found, and it is fixed in the two expected files. Nothing else about the A2 design changed.

These are engineering claims for QA to test, not results.

## 1. The cause

**The link kept keyboard focus after it was activated, and Firefox then moved the page back to that link.**

- "Go to the Top" pointed at `#top`, and nothing on the page carried that name. Browsers treat a bare `#top` as "scroll to the top of the document". They scroll, but they leave keyboard focus where it was: on the link, now far down the page.
- Firefox, after the Enter key press, then puts the page back where it was before the jump. It did so in the cases below, all of which have the link focused by Tab and scrolled into place by a script (the centring step of a test tool). The page went to 0 and came back within 12 to 45 ms, or the jump was not visible at all.
- Mouse activation does not do this, and Chrome and WebKit do not do this. That matches the QA finding exactly.

What I established by experiment, and what I did not:

| Question | Answer | How |
|---|---|---|
| Is it the app's scripts? | **No.** | A file copy of the Help page (its own HTML and the built CSS, no scripts, no server) shows the same failure in Firefox |
| Is it timing? | **No, it is the path to the link.** | Same case repeated 4 times: it fails 4 of 4 or passes 4 of 4 |
| Which paths fail? | Tab from the last contents menu link onto article 1's link, a script centres the link, then Enter: **8 of 8** (the QA numbers: 306 at 1024 × 600, 131 at 1440 × 900). Also article 1's link placed by script at the bottom of a 1024 × 600 window: **8 of 8** | Firefox, A2 build |
| Which paths pass before the fix? | Tab onto the link and Enter with no script scrolling; scrolling by mouse wheel or by `scrollTo` instead; the link in the middle or at the top of the window when focused by script first; mouse; articles 7 and 13 | Firefox, A2 build and the file copy |
| Does a real reader meet the jump back? | **Not shown.** | Every failing case includes a script call that scrolls the link into place. Tab and Enter alone passed, and so did wheel scrolling. A reader cannot make that script call |
| Why only article 1? | **Not established.** | Article 1's link is the first stop after the contents menu, which is the path that fails. I did not find Firefox's internal rule |

So two things are true. The jump back needs a test tool's scroll step, and I could not produce it with a reader's own actions. But the fault under it was real for every reader in every browser: keyboard focus was left behind on a link they could no longer see. The fix removes that, and with it the jump back.

## 2. What I changed

`src/components/help/HelpPage.tsx`, `src/__tests__/abm007/help-page.test.tsx` (OwedBook). No other file.

The "Help" heading at the top of the page is now the real target of the 13 links:

```
<h1 id="top" tabIndex={-1} className="pb-headline scroll-mt-[100vh] …">Help</h1>
```

- `id="top"`: the 13 links still say `href="#top"`, and now there is an element behind it.
- `tabIndex={-1}`: the heading can receive focus from the link, but it is not a Tab stop of its own.
- `scroll-mt-[100vh]`: a scroll margin of one window height, so "scroll to this heading" means "scroll as far up as the page goes". The page ends at 0 with the header in view.
- No script was added. The page still works with scripts off.
- One comment on the link was updated to say what `#top` now is.

Unit test added: exactly one `#top` element, it is the level 1 "Help" heading, it can take focus, it is not a Tab stop, it carries the scroll margin, it comes before the contents menu, and every article link points at it. The movement itself cannot be covered in the unit suite (its browser stand-in does not scroll or move focus), so it is measured in the three engines below.

## 3. Before and after, scroll position over time

Position of the page in px at 0, 100, 300, 800 and 2,000 ms after activation. "Before" is the A2 build, "after" is the A3 build, both served on SCRATCH. Full data: `measure/a3/04_before_all.json`, `06_after_all.json`.

### The grid: articles 1, 7 and 13, mouse and keyboard, three sizes, three engines

45 cases per engine: 1024 × 600, 1440 × 900 and 375 × 900; article 1 from three distances (link at the bottom, middle and top of the window); keyboard in both step orders.

| Engine | Before: at 0 and stays | After: at 0 and stays |
|---|---|---|
| Firefox 148.0.2 | **43 of 45** | **45 of 45** |
| Chrome 158 | 45 of 45 | 45 of 45 |
| WebKit 26.4 | 45 of 45 | 45 of 45 |

Every passing case reads `0, 0, 0, 0, 0` at the five times. Start positions, link in the middle of the window:

| Size | Article 1 | Article 7 | Article 13 |
|---|---|---|---|
| 1024 × 600 | 306 | 4,913 | 7,519 |
| 1440 × 900 | 131 | 4,471 | 6,878 |
| 375 × 900 | 1,067 | 8,094 | 11,506 |

Article 1 from a short and a long distance: 28 and 584 at 1024 × 600; 0 and 559 at 1440 × 900; 639 and 1,495 at 375.

### The failing cases in Firefox, before and after

| Case (Firefox, keyboard Enter, article 1) | Start | Before: 0 / 100 / 300 / 800 / 2,000 ms | After |
|---|---|---|---|
| Tab from the contents menu, 1024 × 600 | 306 | `306, 306, 306, 306, 306` or `0, 306, 306, 306, 306` (4 of 4 fail) | `0, 0, 0, 0, 0` (4 of 4 pass) |
| Tab from the contents menu, 1440 × 900 | 131 | `0, 131, 131, 131, 131` or `131, 131, 131, 131, 131` (4 of 4 fail) | `0, 0, 0, 0, 0` (4 of 4 pass) |
| Link at the bottom of the window, 1024 × 600, link placed then focused | 501 | `0, 501, 501, 501, 501` (4 of 4 fail) | `0, 0, 0, 0, 0` (4 of 4 pass) |
| Link at the bottom of the window, 1024 × 600, link focused then placed | 28 | `0, 28, 28, 28, 28` (4 of 4 fail) | `0, 0, 0, 0, 0` (4 of 4 pass) |

Firefox repeats, article 1 by keyboard at the two desktop sizes: before 40 of 56 passed; after **56 of 56**. Data: `measure/a3/05_before_firefox_reps.json`, `07_after_firefox_reps.json`.

### All 13 links

| Engine | After |
|---|---|
| Firefox 148.0.2 | **78 of 78**: all 13 links, mouse and keyboard, at the three sizes (`measure/a3/09_after_all13_firefox.json`) |
| Chrome and WebKit | **Not measured for all 13.** Articles 1, 7 and 13 only (the grid above) |

Why not: my step file for all 13 in three engines failed on its last line (a fault in my heading check, not in the product) and lost its results. I had one sign-in session left and used it for Firefox, the engine with the defect. All 13 links are one piece of code, so I expect no difference, but it is not measured.

## 4. Where keyboard focus is afterwards

- In all three engines, after mouse or keyboard activation, focus is on the "Help" heading at the top of the page, inside the window. Before, it stayed on the link, out of view for articles 7 and 13.
- The next Tab goes to the first contents menu link, "1. Getting around". In Firefox at 1024 × 600 it goes to the contents menu box first, because Firefox makes a scrolling box a Tab stop; that was already so.
- **A visible effect to look at:** after keyboard activation the heading shows the standard focus outline, 2px white with a 2px offset, on the navy masthead. It is whole on four sides (inside the window and the masthead; nothing clips it). Screenshots: `measure/a3/A3_heading_focus_after_keyboard_firefox_1440.png` and `_375.png`.
  - After a mouse click, Chrome and Firefox show no outline; WebKit shows it.
  - I left the outline visible on purpose, because it tells a keyboard reader where they are. If the Director prefers no outline on the heading, that is one class.

## 5. The A2 design is unchanged

Measured again on the A3 build in Chrome and WebKit (`measure/measure_a2_after_a3.json`):

- 13 links, one at the end of each article, none in the contents menu, none after the last article, at 375, 768, 1024 × 600 and 1440 × 900.
- Same look: dark green underlined, 13px, on white; contrast 4.53 to 1; target 44px tall.
- Link focus outline whole on four sides (first, seventh and last link at each size).
- Contents menu: 13 links; scrolls inside itself at 1024 × 600 (box 568, content 656); every link reached by Tab with a whole outline.
- Add control and the Profile password controls: outlines whole, as in A2.
- No sideways overflow.

## 6. Checks

Run on hash-bound copies of both working trees (`binding_a3/`), logs in `logs_a3/`.

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 409 of 409 passed (60 suites) | 588 of 588 passed (37 suites) |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (unchanged) | 0 errors, 27 warnings (unchanged) |
| Production build | succeeded | succeeded |

## 7. Sessions used

| Use | Sign-in sessions |
|---|---|
| One per engine (Firefox, Chrome, WebKit), kept open for "before", cause-finding and "after" | 3 |
| A2 design measurements on the A3 build (Chrome, WebKit) | 2 |
| All 13 links in Firefox, after my step-file fault | 1 |
| **Add-on A3 total** | **6 of 6** |

- All six were the fixture Owner A through the password form on OwedBook, on SCRATCH, verified from the running server before each sign-in and again after the build was swapped.
- The first three sessions stayed signed in while I stopped the A2 build and started the A3 build on the same port. Nothing was saved: no cookie, token or session state was written anywhere, and the sessions ended when the tool closed.
- No Account & Billing page was loaded (requests to its address counted: 0).
- The static file copy needed no server and no sign-in.

## 8. Limits kept, and one wait

- Both repositories are still on `qa/abm007-final` at OwedBook `2e91e90905b2d9907577a64985e643f7827019ac` and Account & Billing `fc1fa6c2a90ebf59987287ad765e2e65cf635549`, uncommitted, nothing staged.
- Nothing inside `agent_docs/ACTIONS/ABM007_FINAL/QAM/` was touched.
- No protected path, migration, guard, dependency or hardcoded color.
- When I started, ports 3100 and 3101 were held by the QA Executor's servers. I did not stop them. I asked the Director, who had them stopped; I started only after both ports were free.
- Both local servers are stopped now.

## 9. Noticed, not fixed

See `NOTICED_NOT_FIXED.md`, section "Add-on A3".
