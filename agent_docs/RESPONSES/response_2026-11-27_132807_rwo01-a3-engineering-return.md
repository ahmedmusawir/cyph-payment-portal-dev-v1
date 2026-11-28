**RWO-01 ADD-ON A3 COMPLETE — AWAITING QA CONFIRMATION**

- **ZIP:** `/home/moose/Downloads/ABM007_FINAL_RWO01_ENGINEERING_RETURN_04.zip`
- **Members:** 303 (302 files plus `FILE_INDEX.json`)
- **SHA-256:** `142522c6c4c3d88c5a2cdbbeaa9d873328bd573372346b96ec97be6766667aa5`

The defect is reproduced in Firefox 148.0.2 with QA's numbers, the cause is found, and it is fixed in the two expected files. One gap: all 13 links were measured after the fix in Firefox only; Chrome and WebKit have articles 1, 7 and 13.

## The cause

"Go to the Top" pointed at `#top`, and nothing on the page carried that name. The browser scrolled up but left keyboard focus on the link, far down the page. Firefox then moved the page back to where it had been.

- **Not the app's scripts:** a file copy of the Help page with no scripts and no server fails the same way in Firefox.
- **Not timing:** each case fails 4 of 4 or passes 4 of 4.
- **The failing path:** the link is focused by Tab, a script scrolls it into place (the centring step of a test tool), then Enter. That gave 306 at 1024 × 600 and 131 at 1440 × 900.
- **Not shown with a reader's own actions:** Tab and Enter alone passed, and so did wheel scrolling.
- **Not established:** Firefox's internal rule, and why only article 1.

The fault under it was real for every reader in every browser: focus was left on a link they could no longer see.

## The change

OwedBook `HelpPage.tsx` and `help-page.test.tsx` only. The "Help" heading is now the real target of the 13 links: it carries `id="top"`, can receive focus without being a Tab stop, and has a scroll margin of one window height so the page ends at the very top. No script was added. One unit test was added.

## Before and after

Page position at 0, 100, 300, 800 and 2,000 ms after activation. The grid is articles 1, 7 and 13, mouse and keyboard, at 1024 × 600, 1440 × 900 and 375 wide, with article 1 from a short and a long distance.

| Measurement | Before | After |
|---|---|---|
| Firefox grid | 43 of 45 | 45 of 45 |
| Chrome grid | 45 of 45 | 45 of 45 |
| WebKit grid | 45 of 45 | 45 of 45 |
| Firefox, article 1 by keyboard, repeated | 40 of 56 | 56 of 56 |
| Firefox, QA's failing path (Tab from the contents menu) | 0 of 8 | 8 of 8 |
| All 13 links, Firefox | not run | 78 of 78 |
| All 13 links, Chrome and WebKit | not run | **not measured** |

- **The gap:** my three-engine step for all 13 links failed on a fault in its own last line and lost its results, and I had closed the tool in the same command. One session was left, so I used it for Firefox.
- **Focus afterwards:** on the "Help" heading, in view, in all three engines. The next Tab goes to the first contents menu link.
- **A visible effect for the Director to look at:** after keyboard activation the heading shows the standard white focus outline on the navy masthead (in WebKit also after a click). I left it visible so a keyboard reader sees where they are; hiding it is one class.
- **A2 design:** measured again in Chrome and WebKit and unchanged (13 links, 44px target, 4.53 to 1, whole outlines, menu scrolls inside itself).

## Checks

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 409 of 409 passed | 588 of 588 passed |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (unchanged) | 0 errors, 27 warnings (unchanged) |
| Production build | succeeded | succeeded |

## Sessions and limits

- **Sign-in sessions:** 6 of 6. All were the fixture Owner A through the password form on OwedBook, on SCRATCH.
  - 3 were one per engine, kept open across the build swap for "before", cause-finding and "after".
  - 2 were for the A2 re-measure.
  - 1 was for the Firefox rerun.
- **Account & Billing pages loaded:** none.
- **Ports:** they were held by the QA Executor's servers when I began. I did not stop them, and started only after you had them stopped.
- Nothing is staged or committed, both HEADs are unchanged, I touched nothing in the QAM folder, and both local servers are stopped.

## Records and the commit

- No ruling row and no label change. The A3 note is `RWO01_A3_ENGINEERING_REPORT.md`; both changelogs and session logs have entries.
- The staging lists are regenerated and match `git status` exactly, outside `QAM/`:

| File | Paths |
|---|---|
| `STAGING_LIST_owedbook.txt` | 23 |
| `STAGING_LIST_portal.txt` | 315 |
| `STAGING_LIST_portal_optional.txt` | 8: the four return ZIPs and their checksums |
| `COMMIT_MESSAGES.md` | both proposed messages, updated for A3 |

Inside the ZIP, start with `REVIEW_START_HERE.md`. A copy of the ZIP is also in `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/`.

Stopped. I am starting nothing else.
