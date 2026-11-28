# RWO-01 engineering return 01 — ABM007_FINAL

**From:** the Engineer · **To:** the QA Lead · **Copied:** the Director, the Architect, the QA Executor
**Date:** 26 November 2026, Asia/Dhaka · **Status:** `RWO-01 ENGINEERING COMPLETE — AWAITING DIRECTOR COMMIT`

All nine items are handled. Eight needed a change. R-09 (c) is identified and left unchanged, because the control is drawn as a link, not a button; it needs your ruling (section 3).

One result you should know first: **R-07 was not clean.** The candidate is fine at 375, 390 and 430 wide, but both OwedBook pages slide sideways at 320. I fixed the layout only.

**One departure from the work order, which I am reporting plainly: the Account & Billing app read from the Stripe sandbox while I measured R-09.** Details are in section 1. They were read-only lookups made by the app's own page, no write of any kind, but the work order says no Stripe call, and I should have raised it before loading those pages.

These are engineering claims for QA to test, not results.

## 1. Starting point and limits kept

- Both repositories were on `qa/abm007-final` at OwedBook `2e91e90905b2d9907577a64985e643f7827019ac` and Account & Billing `fc1fa6c2a90ebf59987287ad765e2e65cf635549`. Both HEADs are unchanged.
- Nothing is staged, committed, pushed or switched. Every change is in the working trees.
- Nothing inside `agent_docs/ACTIONS/ABM007_FINAL/QAM/` was edited, moved, deleted, formatted or staged. No file there has a modification time after this work began.
- No protected path, migration, guard, dependency or hardcoded color. All colors come from existing tokens.
- No email, invitation, member removal, billing-portal opening, purchase, fixture change, credential change, DEV or alpha access, dashboard change or deployment. No button that changes data was pressed.
- **Stripe — a departure.** The work order permits no Stripe call. R-09 (b) and (c) are on the Account & Billing dashboard and billing pages, and those pages look up the owner's card details in the Stripe sandbox each time they load (`/api/billing/overview`, existing code, unchanged).
  - I loaded those pages 16 times as Owner A: 7 in the "before" run and 9 in the "after" run, counting the landing after each sign-in.
  - Each load makes between one and four read-only lookups (subscription, customer, card list), so up to about 64 read-only requests reached the sandbox. I did not count them at the provider.
  - Nothing was created, changed or deleted. No billing portal was opened and no purchase or checkout was started.
  - This is the same read the E2 tooling notes list as a known effect, but RWO-01's limits are stricter and I did not stop to ask. The pharmacy-row and "Refresh" measurements could not be taken on those pages without it.

## 2. How the measurements were taken

- Two production builds per app, from hash-bound copies of the working tree: the unmodified candidate ("before") and the repaired tree ("after").
- Served on the local proof pair (OwedBook 3100, Account & Billing 3101) against SCRATCH. The tooling verified SCRATCH from the running server process before every sign-in. Mail was blocked and no Stripe listener ran. Both servers are stopped.
- Browsers: Chrome 158 and WebKit 26.4. Firefox was not run.
- Signed-in pages used the existing fixture Owner A through the normal password form.
- Data: `measure/measure_before.json` and `measure/measure_after.json`. Screenshots: `measure/shots_before/` and `measure/shots_after/`, with fixture names and addresses masked.
- Tool: `tools/measure.mjs`. It reuses the E2 SCRATCH sign-in tooling unchanged.

## 3. Item by item

### OwedBook

**R-01 — opening page buttons. Changed.** `src/app/(public)/HomePageContent.tsx`
- "Start free trial" is now **Subscribe Now**. It keeps the green look and the arrow.
- It opens the Account & Billing home page through the app's existing address table (`peerOrigin()` in `src/lib/appIdentity.ts`, read only, not edited). No address is typed in.
- A new **Log in** button sits beside it, in brand navy from the `--brand-navy` token, opening `/auth`. Navy is set on this one button only and is not a button variant; a test guards that.

| Width | Before | After |
|---|---|---|
| 320 | one button, 264 × 56 | stacked, each 264 × 56 |
| 375 | one button, 319 × 56 | stacked, each 319 × 56 |
| 390 | one button, 334 × 56 | stacked, each 334 × 56 |
| 430 | one button, 374 × 56 | stacked, each 374 × 56 |
| 768, 1024, 1440 | one button, 231.56 × 56 | side by side, each 264 × 56 |

- The two are the same size at every width. Corner 8px. No sideways overflow at any width. Chrome and WebKit agree.
- Hover: green goes from `rgb(40, 132, 114)` to `rgb(36, 119, 103)`; navy from `rgb(21, 68, 116)` to `rgb(15, 48, 82)` (`--brand-navy-deep`).
- Keyboard focus: both show the shared outline, solid 2px navy with a 2px offset.
- The green button is 32px wider than before at 768 and above, because the two now share one width.

**R-02 — Help "Go to the Top". Changed.** `src/components/help/HelpPage.tsx`
- A small link (13px, dark green, underlined, 44px tall target) is the last item in the "On this page" menu, under a thin divider.
- Mouse click and keyboard Enter both return the page to the very top with the header in view. Focus shows the shared outline.
- It is a plain in-page link, so it works without script.
- **Where the menu is not beside the text (below 1024 wide):** the menu sits above the text and does not follow the reader. The link is still at the bottom of the menu, about 500px from the top of the page. It works, but a reader at the bottom of Help cannot see it. I added no new design there.
- From 1024 wide the menu stays in view while reading, so the link is always reachable.

**R-03 — Login busy state. Changed.** `src/components/auth/LoginForm.tsx`

| | Before | After |
|---|---|---|
| Words while signing in | Login | Logging in… |
| `aria-busy` | absent | `true` (`false` at rest) |
| Disabled while signing in | yes | yes |
| Spinner | shown | shown |

- Observed on the real sign-in in both browsers.
- The duplicate-submit guard is the disabled button, unchanged.

**R-04 — disabled fields. Changed.** `src/components/ui/input.tsx`

| Profile field | Before | After |
|---|---|---|
| Full Name, Email | text `rgb(57, 59, 56)` on `rgb(223, 230, 236)`, whole field at 50% opacity: **2.43 to 1** | text `rgb(81, 81, 81)` on `rgb(223, 230, 236)`, full opacity: **6.3 to 1** |

- The field uses the existing `--disabled` and `--disabled-foreground` tokens and keeps the not-allowed cursor, so it still reads as inactive.
- **Account & Billing fades the same way** in its copy of the shared input (`src/components/ui/input.tsx`), so I fixed it the same way. No screen there shows a disabled field through that component today, so there is no rendered before-and-after for it. Its own form fields already used the disabled token.

**R-05 — Profile support link. Changed.** `src/app/profile/ProfileForm.tsx`
- Before: grey `rgb(81, 81, 81)`, underlined. After: dark green `rgb(40, 132, 114)`, underlined (the existing link class).

**R-06 — control scale. Changed.** Each control was confirmed against your evidence files before the change.

| Part | Which control it is | Before | After |
|---|---|---|---|
| (a) | The eye button inside the password field (`src/components/ui/password-input.tsx`): one on Login, two on Profile | 32 × 32, 4px corner | 44 × 44, 8px corner |
| (b) | The four dashboard tabs: Commercial Dollars, Updated Payments, Federal Dollars, Summary (`OwedBookScreen.tsx`; `0232.json`) | 32 high, 4px corner | 44 high, 8px corner; text still 14px Medium |
| (c) | The round account-menu button showing the user's initial, right end of the signed-in header (`Navbar.tsx`; `0368.json`) | 40 × 40, round | 44 × 44, round |

- (b) The box around the tabs grows from 44 to 54 high, because the tabs sit inside its 4px padding.
- (c) The same round button also exists in the opening-page header for a signed-in visitor (`UserMenu.tsx`). I gave it the same size so the two do not differ.

**R-07 — sideways overflow. Verified first; fixed at 320.** `Navbar.tsx`, `ScreenHeader.tsx`

Billing & subscription (`/admin-portal/billing`), Owner A. Edges are in pixels from the left of the screen.

| Width | Before: page slides | Before: Add control left to right | After: page slides | After: Add control left to right | After: helper text right edge |
|---|---|---|---|---|---|
| 320 | **16 px** | 16 to **336** (off screen) | 0 | 16 to 304 | 292.98 |
| 375 | 0 | 16 to 336 | 0 | 16 to 336 | 334.7 |
| 390 | 0 | 16 to 336 | 0 | 16 to 336 | 334.7 |
| 430 | 0 | 16 to 336 | 0 | 16 to 336 | 334.7 |

Dashboard (`/owedbook`), Owner A.

| Width | Before: page slides | After: page slides | Tab strip |
|---|---|---|---|
| 320 | **11 px** | 0 | scrolls inside its own box |
| 375, 390, 430 | 0 | 0 | scrolls inside its own box |

- Chrome and WebKit agree on every row.
- Two causes at 320, both layout:
  - The header's Menu button ended 11px past the screen edge, because the brand could not shrink. This affected every signed-in OwedBook page at 320.
  - The Add control's box was held at 320px wide, wider than the 288px the page offers.
- Fixes:
  - Below 1024 the header brand may now shrink, as it already does in Account & Billing. At 320 the wordmark shortens to "Pharmacy …". From 375 up nothing changes.
  - The Add control's box can no longer be wider than its row.
- The button's label on this page is "Add store".

### Account & Billing

**R-08 — sign-in page at 768. Changed.** `PublicShell.tsx`, `Footer.tsx`

| Width | Before: "Sign in" | After: "Sign in" | Before: footer | After: footer |
|---|---|---|---|---|
| 767 | not shown (Menu button) | not shown (Menu button) | broken across lines | stacked, one per line, centered |
| 768 | **2 lines** | 1 line, 82 × 44, 15px | broken across lines | stacked, one per line, centered |
| 769 | **2 lines** | 1 line, 82 × 44, 15px | broken across lines | stacked, one per line, centered |
| 1023 | 1 line | 1 line | one row | stacked, one per line, centered |
| 1024, 1440 | 1 line | 1 line | one row | one row |
| 320, 375, 430 | not shown | not shown | one per line, left | one per line, centered |

- The fit was fixed without making any text smaller. "Sign in" stays 15px.
- At 768 the support line gives way instead: "Questions?" sits above the address, and the address never breaks. That line already wrapped before the fix. "Already subscribed?" and "Sign in" stay on one line.
- The footer stacks below 1024, where one row no longer fits, and is one row from 1024 up.
- WebKit agrees at 767, 768 and 769.
- Every signed-out page that shares this header and footer was checked at all nine widths, with the same result: `/login`, `/register/plan`, `/register/owner`, `/register/activation`, `/auth/signed-out`, `/auth/link-expired`, `/auth/sign-in-to-continue`, `/auth/handoff-recovery`, `/auth/confirm`.
- `/register/pharmacy` and `/register/review` redirect to `/register/owner` without a registration in progress, and `/auth/switch` redirects to `/auth/handoff-recovery`. Those three were measured as the page they landed on.

**R-09 — control scale.**

| Part | Which control it is | Before | After |
|---|---|---|---|
| (a) Changed | The eye button inside the sign-in password field (`FormField.tsx`) | 32 × 32, 4px corner | 44 × 44, 8px corner |
| (b) Changed | "Remove at period end" and "Keep this store" in each pharmacy row (`StoreRemovalControl.tsx`) | 34 high on one line | 44 high on one line; 58 where the words wrap at phone width, as before |
| (c) **Not changed** | **"Refresh"**, top right of the dashboard and billing pages (`DashboardView.tsx` line 221) | 44 high, 12px text, no corner | unchanged |

- **(c) is something other than a button in appearance.** It is built as a button element so it can act without leaving the page, but it is drawn as a link: navy, underlined, no fill, no border, in the page-link style. It has no corner to round because it has no box. Its 44px height is only its touch target.
- By the work order's rule I changed nothing. If you rule it should be a real button, the change is one line: the outline button style, which brings the 8px corner and 16px text. If you rule it stays a link, its 12px text comes from the header's small-text setting, and you may want that raised.

## 4. Changed files, grouped by item

See `CHANGED_FILES.md`. Full diffs are in `diff/`.

## 5. "Free trial" wording on the opening page (R-01)

See `FREE_TRIAL_LIST.md`. Two places remain, both in the opening page's header, both unchanged.

## 6. Checks

Run on the hash-bound copies of the repaired working trees. Logs are in `logs/`.

| Check | OwedBook | Account & Billing |
|---|---|---|
| Unit tests | 406 passed of 406, 60 suites (candidate: 394, 59 suites) | 588 passed of 588, 37 suites (candidate: 584, 36 suites) |
| Typecheck | clean | clean |
| Lint | 0 errors, 38 warnings (same 38 as the candidate) | 0 errors, 27 warnings (same 27 as the candidate) |
| Production build | succeeded | succeeded |

- New tests: 12 in OwedBook (one new file, seven existing files extended) and 4 in Account & Billing (one new file, two extended).
- One existing OwedBook test was updated: the Help test that counted 13 links in the contents menu now counts the 13 section links and checks "Go to the Top" separately.
- The copies were confirmed equal to the working trees after the checks (OwedBook 409 files; Account & Billing differs only in today's session log).

## 7. Noticed and not fixed

See `NOTICED_NOT_FIXED.md`.

## 8. Sign-in sessions used

**6 of 20.** All were the fixture Owner A through the normal password form.

| Run | OwedBook, Chrome | OwedBook, WebKit | Account & Billing, Chrome |
|---|---|---|---|
| Before (candidate) | 1 | 1 | 1 |
| After (repaired) | 1 | 1 | 1 |

No emailed link, provider token, new account or password change was used.

## 9. Records updated

- `ABM_RULINGS.md` section 3: rows AM-18 to AM-21 appended after AM-17, byte-identical to the release document. No other edit to that file.
- `EVIDENCE/E2/CHANGED_LABELS.md`: a new RWO-01 section with "Subscribe Now", "Log in", "Go to the Top" and "Logging in…".
- The Help label table: unchanged, because Help quotes none of the changed labels.
- Session logs and changelogs in both repositories, as their own instructions require.

## 10. For the Director's commit

Nothing is staged. The exact paths are in `CHANGED_FILES.md`. In Account & Billing, please leave `agent_docs/ACTIONS/ABM007_FINAL/QAM/` out of this commit unless you choose otherwise; those are the QA Executor's uncommitted records.

Earlier today, before RWO-01, I also made four record changes in Account & Billing at the Director's request: a new session log, a block added to `RECOVERY.md`, a refresh of `ABM_STATE.md`, and changelog entries. They are listed separately in `CHANGED_FILES.md`.
