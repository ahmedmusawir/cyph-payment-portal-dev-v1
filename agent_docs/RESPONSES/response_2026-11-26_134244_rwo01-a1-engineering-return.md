**RWO-01 ADD-ON A1 COMPLETE — AWAITING DIRECTOR COMMIT**

- **ZIP:** `/home/moose/Downloads/ABM007_FINAL_RWO01_ENGINEERING_RETURN_02.zip`
- **Members:** 121 (120 files plus `FILE_INDEX.json`)
- **SHA-256:** `553c89e59ee26f419c373c0a97c6c9dbbf04193c9eb0203e406be869b612a468`

All four add-on items are done on top of the uncommitted RWO-01 working trees, and nothing else was changed. The add-on touched eight product and test files; `diff/addon_A1_only.diff` in the ZIP shows exactly those.

## The four items

| Item | Before | After |
|---|---|---|
| **A1-1** header and phone menu | "Start free trial", opening OwedBook login | "Subscribe Now", opening the Account & Billing home page; same green look |
| **A1-2** Help, below 1024 wide | no link at the end of the text | "Go to the Top" under the last section; returns to the top by mouse and keyboard |
| **A1-3** Help menu, short window | at 1024 × 600 and 1440 × 650 the link was below the fold and could not be clicked | the menu scrolls inside itself and the link is reachable by mouse and keyboard |
| **A1-4** signed-in footer | links broken across lines at 767, 768 and 769 | stacked and centered below 1024, one row from 1024, on `/dashboard` and `/billing` |

- **"Free trial" scan (A1-1):** zero matches on the opening page after the change. That covers the page text with the phone menu open and closed, labels, the tab title and description, and the whole served page including its scripts. Before, the header carried one or two.
- **A1-3 screenshots:** `measure/shots_after/A1-3_help_menu_1024x600.png` and `A1-3_help_menu_1440x650.png`.
- **A1-4 at 1023:** the row fitted there before; it now stacks, because the rule is "below 1024".
- Chrome and WebKit agree on every item. Firefox was not run.
- **Not captured:** the keyboard focus outline of the new end-of-text link. It uses the same link class as the menu link, whose outline return 01 measured.

## Sessions and page loads

- **Sign-in sessions:** 6 for the add-on, so 12 of 20 in total. All were the fixture Owner A through the password form, on SCRATCH.
- **Account & Billing page loads for A1-4:** 6, two per session (the dashboard after sign-in, and `/billing`). The five widths were measured by resizing, not reloading.
- **Stripe:** those loads made 6 requests to the page's overview route, which reads card details at Stripe, as you permitted. Nothing else on Stripe.

## Checks

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 408 of 408 passed | 588 of 588 passed |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (unchanged) | 0 errors, 27 warnings (unchanged) |
| Production build | succeeded | succeeded |

## Records and limits

- `ABM_RULINGS.md` has row AM-22 after AM-21, with no other edit. I typed it from your message, so please compare it once against your copy.
- `CHANGED_LABELS.md` has the header wording change and the second "Go to the Top".
- Nothing is staged or committed, both HEADs are unchanged, the QAM folder is untouched, and both local servers are stopped.

## For the Director's commit

The staging lists and commit messages from my earlier reply are superseded. The current ones are in the ZIP and in `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/`:

| File | Paths |
|---|---|
| `STAGING_LIST_owedbook.txt` | 22 |
| `STAGING_LIST_portal.txt` | 132, none under `QAM/` |
| `STAGING_LIST_portal_optional.txt` | 4: the two return ZIPs and their checksums |
| `COMMIT_MESSAGES.md` | both proposed messages |

Inside the ZIP, start with `REVIEW_START_HERE.md`.

Stopped. I am starting nothing else.
