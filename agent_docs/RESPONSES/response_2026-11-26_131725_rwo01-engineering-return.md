**RWO-01 ENGINEERING COMPLETE — AWAITING DIRECTOR COMMIT**

- **ZIP:** `/home/moose/Downloads/ABM007_FINAL_RWO01_ENGINEERING_RETURN_01.zip`
- **Members:** 73 (72 files plus `FILE_INDEX.json`)
- **SHA-256:** `e64985c007408f025ad7383f9562f6ea3e9e32f3a37d35b989d2bb198ffc26c1`

Both governing documents opened, and both repositories were on `qa/abm007-final` at the named commits. Eight of the nine items are repaired; R-09 (c) is identified and left unchanged for the QA Lead's ruling.

## One departure from the work order

Measuring R-09 meant loading the Account & Billing dashboard and billing pages, and those pages make the app look up the owner's card details in the Stripe sandbox on every load. The work order permits no Stripe call, and I should have asked before loading them.

- I loaded those pages 16 times as Owner A, which is up to about 64 read-only lookups (estimated from the code, not counted at Stripe).
- Nothing was created, changed or deleted. No billing portal was opened and no purchase started.

## What the QA Lead and Director need to decide

- **R-09 (c):** the small 12px control is "Refresh", top right of the dashboard and billing pages. It is built as a button but drawn as an underlined navy link with no box. By the work order's rule I changed nothing. Making it a real button is a one-line change if that is the ruling.
- **"Free trial" list (R-01):** two places remain, both "Start free trial" in the opening page's header (desktop header and mobile menu). Both still open OwedBook login. Unchanged.

## Results that differ from what was expected

- **R-07 was not clean.** The candidate is fine at 375, 390 and 430 wide, but at 320 both OwedBook pages slid sideways: 16px on Billing & subscription and 11px on the dashboard. I fixed the layout only.
  - After the fix the Add control runs from 16 to 304 at 320 wide, and the page no longer slides.
  - A side effect at 320 only: the header wordmark shortens to "Pharmacy …", as Account & Billing already does.
- **R-04 also applied to Account & Billing.** Its shared input faded the same way, so I fixed it the same way. No screen there shows a disabled field through it today.
- **R-06 (c):** the same round account button exists in the opening-page header for a signed-in visitor, so I sized that one too.
- **R-08:** "Sign in" stays on one line at 768 without shrinking any text. The footer stacks centered below 1024 and is one row from 1024 up.

## Checks

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 406 of 406 passed | 588 of 588 passed |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (unchanged) | 0 errors, 27 warnings (unchanged) |
| Production build | succeeded | succeeded |

Before-and-after measurements were taken in Chrome and WebKit; Firefox was not run.

## Limits kept

- **Sign-in sessions:** 6 of 20, all the fixture Owner A through the password form, on SCRATCH only (verified before each sign-in).
- **Git:** nothing staged, committed, pushed or switched. Both HEADs are unchanged.
- **QAM folder:** not touched.
- **Local servers:** both stopped.
- **Records:** `ABM_RULINGS.md` has rows AM-18 to AM-21, byte-identical to the release document. `CHANGED_LABELS.md` has the new labels. The Help label table is unchanged, because Help quotes none of them.

I did not update `RECOVERY.md` or `ABM_STATE.md` for RWO-01, since the work order lists which records to touch. Both now trail the adjudication.

Inside the ZIP, start with `RWO01_ENGINEERING_REPORT.md`; the per-item file list is `CHANGED_FILES.md`. A copy of the ZIP is also in `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/`.

Stopped. I am starting nothing else.
