# Noticed during RWO-01 and not fixed

Reported under the work order's rule: anything outside R-01 to R-09 is reported, not fixed.

| # | What | Where | Why it may matter |
|---|---|---|---|
| 1 | "Refresh" on the Account & Billing dashboard and billing pages is drawn as a 12px link | `src/components/portal/account/DashboardView.tsx` line 221 | R-09 (c). Needs the QA Lead's ruling: make it a button, or keep it a link and decide its text size |
| 2 | The **signed-in** Account & Billing footer breaks its links across lines at 768 wide | `src/components/portal/Footer.tsx` (default tone); measured on `/dashboard` and `/billing` | Same defect as R-08, but R-08 names the signed-out pages only. I changed the signed-out footer and left this one |
| 3 | "Start free trial" remains in the opening page's header and mobile menu | `UserMenu.tsx`, `MobileNav.tsx` | R-01 asks for a list, not a change. See `FREE_TRIAL_LIST.md` |
| 4 | Other components still fade when disabled (50% opacity) | OwedBook `src/components/ui/textarea.tsx`, `select.tsx`, `tabs.tsx`, `command.tsx`; Account & Billing `src/components/ui/textarea.tsx` | R-04 names the input field. I found no screen that shows a disabled multi-line field today, but these would fail the same contrast rule if one did |
| 5 | The eye button inside a **disabled** password field fades to 50% | OwedBook `password-input.tsx`; Account & Billing `FormField.tsx` | It is an icon, not text. Not seen disabled on any page today |
| 6 | At 320 wide the OwedBook header wordmark shortens to "Pharmacy …" | `src/components/global/Navbar.tsx` | A result of the R-07 fix. Account & Billing already does this at 320. From 375 up the wordmark is whole |
| 7 | Below 1024 wide, "Go to the Top" is at the bottom of a contents menu that sits above the text | Help page | R-02 asked for a report here and no new design. A reader at the bottom of Help cannot see the link at phone and tablet widths |
| 8 | On a short window (I estimate under about 730px tall, at 1024 wide or more; not measured), the Help contents menu is taller than the window, so its last item, "Go to the Top", can sit below the fold | Help page | The menu stays fixed while reading and does not scroll on its own. This was already true of the last section links |
| 9 | The member-list avatar in the OwedBook admin pages is 40px | `src/components/admin-portal/MemberRow.tsx` | It is a picture, not a button, so R-06 (c) does not cover it |
| 10 | The Login button's duplicate-submit guard is the disabled button only | `src/components/auth/LoginForm.tsx` | Unchanged by R-03. A real second press cannot get through; I mention it because a test that fires the form event directly can |
| 11 | `ABM_STATE.md` now shows `Q2 COMPLETE — AWAITING ADJUDICATION` | module folder | It was refreshed this morning, before the adjudication arrived. I did not update it again for RWO-01, because the work order lists the records to touch |
| 12 | Firefox was not measured | — | The measuring tool uses Chrome and WebKit. The retest covers three engines |
| 13 | The OwedBook Store selector uses the browser's own disabled look while stores load or when there are none | `src/components/owedbook/StoreSelector.tsx` | It is a built-in dropdown, not the input field R-04 names. Its disabled contrast was not measured |

## Status after the QA Lead's rulings and add-on A1 (26 November)

| # | Status |
|---|---|
| 1 | Ruled: it is a link. Unchanged. Closed |
| 2 | Fixed in add-on A1-4 |
| 3 | Fixed in add-on A1-1 (ruling AM-22) |
| 4, 5, 9, 10, 13 | Recorded by the QA Lead as follow-up, not this rework. Unchanged |
| 6 | Accepted by the QA Lead |
| 7 | Fixed in add-on A1-2 (ruling AM-22) |
| 8 | Fixed in add-on A1-3. Measured: the menu content is 713px tall, so it exceeds any window shorter than about 745px |
| 11 | Still open: `ABM_STATE.md` and this morning's `RECOVERY.md` block trail the adjudication. Not in either work order's list of records |
| 12 | Still true: Firefox was not measured |


## Add-on A2 (27 November)

Noticed while doing A2-1 and A2-2. Reported, not fixed.

| # | What | Where | Why it may matter |
|---|---|---|---|
| 14 | The adjudication document was not in the VM Downloads folder | `~/Downloads` | I worked from the text the Director pasted into the conversation. If the file differs from that text, tell me |
| 15 | The dark green link on white measures 4.53 to 1 | every `pb-link` on a white card, in both apps | It passes 4.5 by a small margin. A different instrument or a rounding step could read it lower. The color is the brand token; I changed nothing |
| 16 | Help now has 13 more keyboard stops | Help page | One per article. It follows from the ruled design |
| 17 | The password field on Profile could not be put in the exact middle of the window | OwedBook `/profile`, 375 × 900 | It is near the end of a short page, so it sat 230px below the middle, well clear of every edge. The Add control sat 186px above the middle for the same reason |
| 18 | In WebKit the tool's key presses did not return focus to an article link | measuring tool | See the report, section 4. The QA Executor's three-engine check covers it |
| 19 | 320 wide was not measured for this add-on | — | The work order names 375 and 1440. The link is short (about 83px), so I expect no effect |
| 20 | Rows AM-19 and AM-22 in `ABM_RULINGS.md` still read as written | module folder | AM-23 replaces AM-19 and part (2) of AM-22. The instruction was one new row and no other edit |
| 21 | `ABM_STATE.md` and the top block of `RECOVERY.md` still show 26 November, 12:4x | module folder, repository root | Same as item 11. Not in this add-on's list of records |
| 22 | Both earlier return ZIPs are no longer in the VM Downloads folder | `~/Downloads` | Seen at session start. The copies in `EVIDENCE/RWO01/` are intact and their SHA-256 values match |
| 23 | Firefox was not measured | — | Same as item 12 |

Status of earlier items after add-on A2: item 7 (fixed in A1-2) is now replaced by the A2-1 design; item 8 (fixed in A1-3) is kept, and the menu content is now 656px tall.

## Add-on A3 (27 November)

Noticed while doing add-on A3. Reported, not fixed.

| # | What | Where | Why it may matter |
|---|---|---|---|
| 24 | After "Go to the Top" by keyboard, the "Help" heading shows the standard focus outline (2px white on the navy masthead). In WebKit it also shows after a mouse click | Help page | It follows from the fix: the heading now takes the focus. I left it visible so a keyboard reader sees where they are. Hiding it is one class if the Director prefers |
| 25 | All 13 links were measured after the fix in Firefox only. Chrome and WebKit have articles 1, 7 and 13 | measuring | My step file lost the three-engine run to a fault in its own last line, and one session was left. See the report, section 3 |
| 26 | I could not make Firefox jump back with a reader's own actions | Firefox 148.0.2 | Every failing case includes a script that scrolls the focused link into place. I did not find Firefox's internal rule, or why only article 1 |
| 27 | In Firefox, the scrolling contents menu box is itself a Tab stop at 1024 x 600 | Help page | Firefox does this for any scrolling box. It adds one Tab press before the first menu link. Already so in A1 and A2 |
| 28 | The contents menu links and the browser's own "back" button | Help page | Each "Go to the Top" still adds an entry to the browser history, as any in-page link does. Unchanged from A2 |
| 29 | A temporary test file is left in my scratchpad copy `rwo01/a2/ob` (`src/__tests__/zz_tmp_dump.test.tsx`) | scratchpad, not the repository | I used it to print the Help page's HTML for the file copy. The harness refused my clean-up command. It is in no repository, no list and no package |
| 30 | `ABM_STATE.md` and the top block of `RECOVERY.md` still show 26 November | module folder, repository root | Same as items 11 and 21 |
