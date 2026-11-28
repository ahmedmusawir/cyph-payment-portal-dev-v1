# ABM007_FINAL — A2 automated confirmation readout

**Q4 A2 AUTOMATION COMPLETE — AWAITING DIRECTOR WALKTHROUGH**  
Prepared 27 November 2026, 11:46 BDT. Independent observations for Friday. Both current builds remain running for sheet 05.

## Entry and carried-forward Q4 evidence

| App | A2 manifest SHA-256 | Pinned file count | Exact branch and changed-path match |
|---|---|---:|---|
| OwedBook | cdecd74b3c9e26ab9987122b0c55c0d3ddf9486f00ca32061e56367268bb8742 | 2314 | qa/abm007-final, 23 paths |
| Account & Billing | 80d5d7285238cdb6fe3d23745f28d7ab984afeba8960c5d1ad1e5da45fbcd527 | 2469 | qa/abm007-final, 235 paths including optional archive lists |

Entry and after-automation checks compare the working trees, isolated copies and served manifests. Both servers are production local-proof against SCRATCH. Across source and tests, only OwedBook HelpPage.tsx and help-page.test.tsx differ from the Q4 manifests. 233 other OwedBook source/test paths and all 216 Portal source/test paths have identical SHA-256 and modes. Unchanged behavior carries the adjudicated Q4 evidence. The full path ledger is in entry-comparison.json. RECOVERY.md was unchanged versus Q4.

Clean installs, both unit suites, typecheck, lint and fresh labelled production builds exited 0. OwedBook: 60 suites, 408 tests, 38 lint warnings. Account & Billing: 37 suites, 588 tests, 27 lint warnings. See the two gating JSON files and logs.

## A2-1 and A2-2

| Check | Recorded coverage |
|---|---|
| 13 article links, placement, menu contents, height and overflow | 30 PASS of 30 combinations |
| Mouse returns to the top, first/seventh/last | 90 PASS of 90 |
| Article keyboard focus, every link, with first/seventh/last Enter | 386 PASS, 4 FAIL of 390. Enter returns before settled observation: {'PASS': 86, 'FAIL': 4} |
| F36 rendered-pixel measurements at 375 and 1440 | 36 PASS of 36. Lowest measured 4.5285:1. Actual background color sample counts: {'255,255,255': 5210}. |
| Desktop menu box geometry | 12 PASS of 12 |
| Whole outlines on all 13 menu links by real Tab, 1024×600 and 1440×900 | 156 PASS of 156 |
| OwedBook Billing Add control at 375 | 3 PASS of 3 |
| Profile password/reveal at 375 | 3 PASS of 3 pairs |

Firefox desktop first article Enter timeline: ENGINEERING_OWNER_A 1024px FAIL, ENGINEERING_OWNER_A 1440px FAIL, ENGINEERING_ADMIN setuppx INCOMPLETE. Original focus and return observations are preserved. See firefox-enter-settled.json for the scroll and hash states. Every original timeout, false outline flag and blank first text scope is retained in the first result files, with the sequencing and instrument corrections in DIAGNOSTIC_SCOPE.md.

## Instrument checks and Help regression

| Engine | Role | Route | Width | Result | Passing / failing / unmeasured ranges |
|---|---|---|---:|---|---|
| chromium | ENGINEERING_OWNER_A | /invitations | 375 | PASS | 4 / 0 / 0 |
| chromium | ENGINEERING_OWNER_A | /admin-portal/stores/[store]/invite | 375 | PARTIAL | 29 / 0 / 4 |
| chromium | ENGINEERING_OWNER_A | /invitations | 1440 | PASS | 3 / 0 / 0 |
| chromium | ENGINEERING_OWNER_A | /admin-portal/stores/[store]/invite | 1440 | PARTIAL | 37 / 0 / 4 |
| firefox | ENGINEERING_OWNER_A | /invitations | 375 | PASS | 4 / 0 / 0 |
| firefox | ENGINEERING_OWNER_A | /admin-portal/stores/[store]/invite | 375 | PASS | 33 / 0 / 0 |
| firefox | ENGINEERING_OWNER_A | /invitations | 1440 | PASS | 3 / 0 / 0 |
| firefox | ENGINEERING_OWNER_A | /admin-portal/stores/[store]/invite | 1440 | PASS | 41 / 0 / 0 |
| firefox | ENGINEERING_ADMIN | /admin-portal/stores/[store]/invite | 1440 | PASS | 4 / 0 / 0 |

The sampling notes and all unmeasured ranges are indexed in summary.json. There was one filled contrast capture per intended route, width and engine position. Initial Chromium Invite results with zero text ranges are preserved separately.

Account & Billing: IDENTIFIED. One Store-admin dashboard document. The round shadowed element is the account initials avatar, aria-hidden in the header account control, rendered by Initials in PageHeader.tsx. Evidence is in summary.json and the Chromium response log.

All 13 Help menu destinations: 6 PASS of 6 engine/role combinations. Forbidden-term and changed-label checks: 6 PASS of 6. Help app links: 12 PASS of 12. The active Member-only fixture is unavailable as recorded and accepted in Friday’s Q4 adjudication. Owner and Store admin were used for the live retest.

## Effects and handoff

14 of 20 sign-in attempts, no Owner B automation. Sign-out statuses: {'200': 11, 'None': 3}. One Account & Billing dashboard document and zero billing documents. No email, invitation, removal, hosted billing, purchase, Stripe write or fixture mutation. The 27 November Q4 dispositions and first-attempt evidence remain intact.

The Director runs W-09 and W-10 on the two serving builds. The final package waits for his words and times. Post-commit verification instructions are in Q4_A2_POST_COMMIT_CHECK.md. Friday adjudicates.
