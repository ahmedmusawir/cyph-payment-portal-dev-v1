**RWO-01 ADD-ON A2 COMPLETE — AWAITING QA CONFIRMATION**

- **ZIP:** `/home/moose/Downloads/ABM007_FINAL_RWO01_ENGINEERING_RETURN_03.zip`
- **Members:** 218 (217 files plus `FILE_INDEX.json`)
- **SHA-256:** `93bdc0df02305d318d017b007af30949c5b965540e9f69c7389c040823d80743`

Both items are done on top of the uncommitted RWO-01 and A1 working trees. The add-on changed one product file and its test, both in OwedBook: `HelpPage.tsx` and `help-page.test.tsx`.

## One thing to know first

The adjudication document was never in the Downloads folder, so I did not open it as a file. I worked from the text you pasted into the conversation after my stop, section 6. No file hash is recorded for it. If the file differs from that text, tell me.

## A2-1 — Help "Go to the Top"

| | Before | After |
|---|---|---|
| Links shown | 1 in the contents menu, plus 1 after the last article below 1024 | 13, one at the end of each article, inside it, at every width |
| In the contents menu | 1 | 0 |
| Contrast at 375 | 4.04 to 1 for the end link, green on the light blue page | 4.53 to 1 for all 13, dark green on white |
| Contrast at 1440 | 4.53 to 1 for the menu link | 4.53 to 1 for all 13 |

- Every article is a white card, so the rule gives the dark green underlined link. No link sits directly on the light blue page any more.
- The target is 44px tall.
- Mouse click and keyboard Enter both return to the top with the header in view. This was tested on the first, seventh and last link at 375, 768, 1024 × 600 and 1440 × 900.
- The focus outline is whole on all four sides, and the article box does not clip it.
- The contents menu still scrolls inside itself on a short window.
- 4.53 passes 4.5 by a small margin. It is the same green every link on a white card uses.

## A2-2 — Focus outlines, verify first

| Control | Before | After |
|---|---|---|
| Help menu links, 1440 × 900 | all whole | all whole |
| Help menu links, 1024 × 600 | **link 12 lost its bottom edge**, 4px cut by the scrolling menu box | all 13 whole |
| Add control, OwedBook billing, 375 | whole | whole, unchanged |
| Password field, Profile, 375 | whole | whole, unchanged |
| Show-or-hide button, Profile, 375 | whole | whole, unchanged |

- **The one fix:** one layout class on the menu (8px of scroll padding), so the menu stops clear of a keyboard-focused link. No color, size or content changed.
- Every menu link was reached by Tab and scrolled into view inside the menu without help.
- The Add control and the password controls were focused only, never pressed or typed in.

## Measuring limits

- A first "before" run had a fault in my tool and is kept, marked as such. It scrolled the page and blamed the window edge for two outlines. I corrected the tool and ran "before" again.
- In WebKit the tool's key presses did not return focus to an article link, so there it was focused by script. The outline and Enter still worked. Chrome was by keyboard throughout.
- Chrome and WebKit agree on every item. Firefox was not run.

## Checks

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 408 of 408 passed | 588 of 588 passed |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (unchanged) | 0 errors, 27 warnings (unchanged) |
| Production build | succeeded | succeeded |

## Sessions and limits

- **Sign-in sessions:** 5 of 8. All were the fixture Owner A through the password form on OwedBook, on SCRATCH.
- **Account & Billing pages loaded:** none.
- Nothing is staged or committed, both HEADs are unchanged, the QAM folder is untouched, and both local servers are stopped.

## Records and the commit

- `ABM_RULINGS.md` has row AM-23 after AM-22, with no other edit.
- `CHANGED_LABELS.md` notes the link's new place and the two places it left.
- The staging lists are regenerated and match `git status` exactly, outside `QAM/`:

| File | Paths |
|---|---|
| `STAGING_LIST_owedbook.txt` | 23 |
| `STAGING_LIST_portal.txt` | 229 |
| `STAGING_LIST_portal_optional.txt` | 6: the three return ZIPs and their checksums |
| `COMMIT_MESSAGES.md` | both proposed messages, updated for A2 |

Inside the ZIP, start with `REVIEW_START_HERE.md`. A copy of the ZIP is also in `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/`.

Stopped. I am starting nothing else.
