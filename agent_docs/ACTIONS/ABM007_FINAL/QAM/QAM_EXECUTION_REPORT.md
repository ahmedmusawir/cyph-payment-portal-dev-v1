# QAM_EXECUTION_REPORT — `ABM007_FINAL`

**Owner:** QA Executor · **Written:** Q2, and Q4 if run · **Status: Q2 COMPLETE — AWAITING ADJUDICATION.** This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

Measurements and observations. No verdict, no classification beyond a proposal, no certificate.

## 1. Run record

| Field | Value |
|---|---|
| Attempt | Q2 / 01; continuous scope 1 campaign |
| Start and end time (Asia/Dhaka); measurement time separate from setup and packaging | Entry receipt lacks an exact start timestamp. Individual probes carry times. Walkthrough 25–26 November with overnight pause, final observed action 26 November 11:06 BDT, later answers about 12:01. Exact finish time not supplied. Closeout record prepared 26 November 2026 12:04:19 BDT. |
| Approval and release verified at entry (references) | Friday binding and Tony DIRECTOR RELEASE — Q2, SCOPE 1, 24 November 2026; QAM_APPROVAL.md sections 2/4 |
| Candidate pair; QA execution HEADs; each candidate-to-HEAD diff reviewed in full | OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549; candidate-to-HEAD diffs empty; evidence/Q2/01/entry-identity.json |
| Target identities rechecked | SCRATCH only; evidence/Q2/01/entry-inbox.json, served-target.json |
| Preflight rows rechecked at entry | Candidate/plan/target identity, isolated clean builds, guard controls and browser availability: evidence/Q2/01. Re-entry: evidence/Q2/14. |
| Director touches, each with purpose | Scope1 release; walkthrough-sheet delivery change; Q2-A1 continuation, ceiling150 and conditional second billing opening; invitation/removal held until inbox tomorrow. Director completed the returned sheet and provided three separate dated answers. See section 7, the Amendment 01 table and Q2/27. |

## 2. Results by test

Labels: PASS, FAIL, BLOCKED, NOT RUN, ADJUDICATE. Each PASS or FAIL cites command, working directory, exit code and an unfiltered output path.

| Test ID | AC | Result | Evidence path | Note |
|---|---|---|---|---|
| T-AC-V01 | AC-V01 | PASS | evidence/Q2/03/document-results.json; ABM_RULINGS.md AM-08(2) | Candidate and scope in section 1. |
| T-AC-B01 | AC-B01 | PASS | Exact source declarations and zero measured anchor mismatches. Q2/03/source-results.json and Q2/02/measurement-summary.json. HC-04 visual feedback is separately recorded. | Candidate and scope in section 1. |
| T-AC-B02 | AC-B02 | PASS | evidence/Q2/03/source-controls.json; source-results.json (346 non-test source files; frozen dark block excluded per D-01) | Candidate and scope in section 1. |
| T-AC-B03 | AC-B03 | PASS | Observed fonts match Inter 400/500/600/700. Q2/02/measurement-summary.json, Q2/03/label-font-spotcheck.json. F07 first instrument interruption retained. | Candidate and scope in section 1. |
| T-AC-B04 | AC-B04 | BLOCKED (Windows human condition) | Automated forced-light cases passed including dark system and stored dark preference, with scripts on/off. Q2/02 and Q2/07/public-first-paint.json. Tony’s later Ubuntu Chrome dark-mode observation passed. Windows Chrome, stored-theme steps and exact first-paint/reload scope were not established for that human observation. Friday to rule equivalence or gap. Q2/27/DIRECTOR_LATER_ANSWERS.md, F32. | Candidate and scope in section 1. |
| T-AC-B05 | AC-B05 | FAIL | Q2/02/0000.json, 0091.json and 0232.json. F03 records departures from the radius/control scale. | Candidate and scope in section 1. |
| T-AC-B06 | AC-B06 | FAIL | evidence/Q2/04/states.json; F03/F04; controls in evidence/Q2/01/browser-controls.json | Candidate and scope in section 1. |
| T-AC-B07 | AC-B07 | FAIL | Profile support body link is muted gray, contrary to the dark-green body-link rule. F21 and Q2/20 rendered per-link records. | Candidate and scope in section 1. |
| T-AC-B08 | AC-B08 | FAIL | F18 disabled Profile fields measured about 2.43:1. Saved gradient pixel method and controls in Q2/15. HC-02 keyboard pass retained. Incomplete contrast/focus contexts remain in Q2/23/CONTRAST_NOT_RUN.md and rendered-reconciliation.json. | Candidate and scope in section 1. |
| T-AC-B09 | AC-B09 | BLOCKED (coverage incomplete) | 276 observed status/role entries passed the bounded review in Q2/23/status-review.json. Held and unobserved states leave the full every-status criterion unverified. Q2/23/CONTRAST_NOT_RUN.md. | Candidate and scope in section 1. |
| T-AC-L01 | AC-L01 | BLOCKED (registration steps held) | Public layout evidence Q2/02 and Q2/04. Protected registration steps redirected and were not rendered. HC-04 overall pass and specific Portal 768px wrapping are both retained in Q2/27 and F27. | Candidate and scope in section 1. |
| T-AC-L02 | AC-L02 | BLOCKED (real populated table) | Translated shell rows Q2/02 and human visual comparisons Q2/27. Real populated OwedBook table width unestablished in Q2/24, including the first Owner A tab timeout. Q2/21 mock table is a separate observation. | Candidate and scope in section 1. |
| T-AC-L03 | AC-L03 | PASS (observed screens) | Signed-in Owner Help/Add Pharmacy recorded in Q2/02 and Help in Q2/06 and Q2/08. Q2/27 reports Add Pharmacy form opened and Help navigation. No submission or quote implied. | Candidate and scope in section 1. |
| T-AC-L04 | AC-L04 | FAIL | Observed Portal sign-in header and footer wrapping at 768px in HC-04 (F27). Primary control size issues F03 require Friday’s applicability decision. Three 375px candidate /billing rows had no page overflow (Q2/02/0578, 0690, 0777). No full real-table reflow check or candidate real-phone trial. HC-02 passed and HC-03 was removed. Q2/27/ALPHA_PHONE_COMPARISON.md. | Candidate and scope in section 1. |
| T-AC-L05 | AC-L05 | BLOCKED (state coverage incomplete) | Q2/04 and Q2/06 observed explicit failed reads, denial/not-found and public empty states. J-h zero-store verified. Q2/21 mock Admin blocked (F23). Unobserved loading/error/busy state coverage in Q2/23/CONTRAST_NOT_RUN.md. | Candidate and scope in section 1. |
| T-AC-N01 | AC-N01 | PASS | Names scan and runtime channels Q2/02 measurement-summary and Q2/03 source checks. No contrary naming observation in HC-04. The separate CTA wording ruling is carried to Friday, not tested. | Candidate and scope in section 1. |
| T-AC-N02 | AC-N02 | PASS | Exact master hashes, no old file references and reconstructed full-canvas PNG/ICO match. Q2/03/icon-results.json and source-results.json. HC-04 render comparisons Q2/27. | Candidate and scope in section 1. |
| T-AC-H01 | AC-H01 | PASS (qualified) | Help anchors and role navigation Q2/06 and Q2/08. Director HC-08 passed content and labels, with mandatory Go to the Top enhancement F29. Q2/27/HUMAN_WALKTHROUGH_RECORD.md. | Candidate and scope in section 1. |
| T-AC-H02 | AC-H02 | PASS | Q2/06 forbidden-term and rendered Help checks. HC-08 wording/labels passed by Tony’s report, Q2/27. | Candidate and scope in section 1. |
| T-AC-H03 | AC-H03 | PASS | evidence/Q2/06/firefox-readonly-journeys-v3.json; webkit-readonly-journeys-v3.json; evidence/Q2/08/chromium-help-stable.json; evidence/Q2/10/portal-denials.json; role sessions explicitly labelled; original F10 interruptions retained | Candidate and scope in section 1. |
| T-AC-F01 | AC-F01 | PASS | Owner, Store admin and Member with permitted stores had no zero-store message (Q2/02/0476, 0344, 0232). After J-h, the removed Member had only the disabled No permitted stores placeholder and could not reopen the former pharmacy. Before/after J-h comparison showed no new stores and unchanged access for the other cast. The earlier single added store belongs to J-e and matched Friday’s ruling. Evidence Q2/J-e and Q2/J-h/execution.json. | Candidate and scope in section 1. |
| T-AC-F02 / O-1 | AC-F02 | BLOCKED (O-1 incomplete) | Original 30 incomplete, including the Firefox timeout and the wrong route Friday classed as plan defect F12. Q2-A1 17 complete, 2 incomplete, 5 not run. No Portal sign-in redirect on 19 started amended routes. All 54 rows in Q2/27/O1_ALL_ROUTE_RESULTS.json, with raw engine records Q2/05 and Q2/16. | Candidate and scope in section 1. |
| T-AC-F03 | AC-F03 | PASS (frozen criterion) | Landing anchor walk and approved branding in Q2/02. Candidate HomePageContent.tsx removes the stale artwork under P-08. Separate Director CTA wording and styling requests F28 remain open for rework and outside this criterion result. | Candidate and scope in section 1. |
| T-AC-R01 | AC-R01 | PASS | evidence/Q2/01/ob-unit.log (59/394); pp-unit.log (36/584); runner controls and clean-install logs | Candidate and scope in section 1. |
| T-AC-R02 | AC-R02 | PASS | evidence/Q2/01/ob-gating.json; pp-gating.json; build-result.json; clean installs; real mode only | Candidate and scope in section 1. |
| T-AC-R03 | AC-R03 | PASS | evidence/Q2/03/source-results.json; changed-path lists; billing-notices.diff; documented AM-08(3) RECOVERY exception with empty engineering diff | Candidate and scope in section 1. |
| T-AC-R04 | AC-R04 | BLOCKED | Ten separately evidenced rows in Q2/23/JOURNEY_RESULTS.md. J-c, J-d and J-g held by Tony. J-b hosted billing return unobserved, F15/F26. See Q2/27 for human evidence and provenance qualifications. | Candidate and scope in section 1. |
| T-AC-R05 | AC-R05 | BLOCKED (rendered review incomplete) | Constants and six source/unit assertions preserved, Q2/03/pricing-boundary.log and receipt. No complete rendered plan and review price matrix, quotes, or paid journey recorded. | Candidate and scope in section 1. |
| T-AC-R06 | AC-R06 | PASS (candidate QA effects) | Q2/effects-progress.json and Q2/27/EFFECTS_FINAL.md. Local QA uses designated SCRATCH cast. Separate supplemental alpha-phone observations carry no confirmed rehearsal account or mutation and are outside candidate evidence. No QA rehearsal-account use, charge or modification recorded. | Candidate and scope in section 1. |
| T-AC-E01 | AC-E01 | PASS | evidence/Q2/03/document-controls.json; document-results.json; email-template.diff; subject prepared in EVIDENCE/E2/email/README.md; not applied | Candidate and scope in section 1. |
| Gate D | AC-E02 | BLOCKED (Gate D not released) | GATE_D_PLAN.md. The separate alpha phone note is supplemental. | Candidate and scope in section 1. |
| T-AC-E03 | AC-E03 | PASS (source) / BLOCKED (Gate D deployment) | evidence/Q2/03/billing-notices.diff; document-results.json; source wording-only diff; Gate D deployment record excluded | Candidate and scope in section 1. |
| Gate D | AC-E04 | BLOCKED (Gate D not released) | GATE_D_PLAN.md. The separate alpha phone note is supplemental. | Candidate and scope in section 1. |
| Gate D | AC-D01 | BLOCKED (Gate D not released) | GATE_D_PLAN.md. The separate alpha phone note is supplemental. | Candidate and scope in section 1. |
| Gate D | AC-D02 | BLOCKED (Gate D not released) | GATE_D_PLAN.md. The separate alpha phone note is supplemental. | Candidate and scope in section 1. |
| T-AC-P01 | AC-P01 | PASS | EVIDENCE/E2/CHANGED_LABELS.md reviewed in full; evidence/Q2/03/document-results.json and label-font-spotcheck.json; both public title checks matched; Help and Menu rendered in role checks | Candidate and scope in section 1. |


## 3. Suites

| Suite | Repository | Command and working directory | Counts from this run | Exit code | Evidence |
|---|---|---|---|---|---|
| Unit | OwedBook | npm test -- --runInBand; /tmp/abm007-final-cody-q2/ob; clean npm ci | 59 suites, 394 tests passed | 0 | evidence/Q2/01/ob-unit.log; ob-gating.json |
| Unit | Portal | npm test -- --runInBand; /tmp/abm007-final-cody-q2/pp; clean npm ci | 36 suites, 584 tests passed | 0 | evidence/Q2/01/pp-unit.log; pp-gating.json |
| Typecheck, lint, build | both | tsc --noEmit; npm run lint; next build in isolated copies | All completed | 0 each | evidence/Q2/01/{ob,pp}-gating.json; build-result.json and build logs |

## 4. Effects actually used

See [final effects against each ceiling](evidence/Q2/27/EFFECTS_FINAL.md) and the [effect ledger](evidence/Q2/effects-progress.json). Known conservative session charge at least 125/150. Normal sign-in mail 4 accounted for with Portal qualification. One invitation/email/acceptance and one cancel/confirm used. Owner A released billing opening and Director’s separately logged unplanned Invitee opening remain distinct.

## 5. Instrument and helper corrections

Every first failure remains in FINDINGS.md with source and evidence. Raster calibration/proxy controls: evidence/Q2/15; failed captures remain incomplete, not clean passes. No product repair. Some command exit143 and sign-in setup failures leave coverage gaps.

## 6. Stops

| Stop ID | Phase, time | Trigger | Affected checks | Evidence | Owner | Resolution needed | Resume point |
|---|---|---|---|---|---|---|---|
| F05 document comparator | Q2 source-instrument phase; original receipt retained | Seeded redirect mutation not detected | AC-E01 source check | evidence/Q2/03/document-controls-first-failure.json; corrected document-controls.json | Cody instrument; Friday disposition | Corrected controls passed before dependent result | Source/document checks completed; no product repair |

## 7. Human checks

[Verbatim Director observations and worksheet times](evidence/Q2/27/HUMAN_WALKTHROUGH_RECORD.md). [Three separate answers given 26 November about 12:01 BDT](evidence/Q2/27/DIRECTOR_LATER_ANSWERS.md). [As-received signed-off actions and qualifications](evidence/Q2/27/DIRECTOR_WALKTHROUGH_FILLED.md). [Separate Architect notes](evidence/Q2/27/JARVIS_NOTES_AS_RECEIVED.md).

## 8. Exploratory observations

FINDINGS.md is the single register. F12 is Friday’s plan defect disposition; F11 is the audit recon correction; F15 remains incomplete. New rendered disabled-field contrast observation F18 awaits Friday. Measurements are not journeys.

## 9. Remaining untested areas

J-c, J-d and J-g remain held and BLOCKED. Hosted billing return, unobserved O-1 positions, real populated-table geometry, remaining status/layout/contrast contexts, Windows-specific dark-flash checks and Gate D coverage retain the limits in the matrix and evidence. Confirming the reported Ubuntu condition as equivalent is for Friday. The amended O-1 run retained two incomplete routes and five unstarted positions. The 768px visual defect and both rework requests remain despite the later overall HC-04 pass. No repair or further test is included in closeout.

## 10. Final changed-file inventory in the QA lane

The exact proposed records paths are in HANDOFFS/Q2_RECORDS_STAGING_LIST.txt. This is a handoff for Tony. Cody did not stage or commit.

## Amendment 01 additions (owner: QA Executor records; the Director's observations are his own)

**A. Human walkthrough record.** This table replaces any earlier human-checks table in this file.

| ID | Performed by | Candidate and target confirmed | Observation, in the performer's words | Result | Time | Finding |
|---|---|---|---|---|---|---|
| HC-01 | Tony, Director | Local QA ports shown. See evidence/Q2/27 identity qualifications. | “boom ... i'm in”<br>“here you go ... you can see what happens when both manage billing and add pharmacy buttons on owedbook is clicked”<br>“it felt like the same app ... as it's supposed to ... no friction”<br>“yup ... no sign in ... like it's the same app”<br>“both give me this”<br>“pass” | PASS | 25 November: initial password sign-in screenshot 10:22; outward navigation screenshots 12:56–12:58; return 13:35; post-logout login screenshot 13:37. All Asia/Dhaka. Result message has no separate timestamp. | — |
| HC-02 | Tony, Director | Local QA ports shown. See evidence/Q2/27 identity qualifications. | “PASS”<br>“no drawer at current width or full width ... but once i shorten it i get this ...”<br>“only mouse clicks ... after you said ... i tried with keyboard and i could navigate fine with keyboard ... shit tab etc.”<br>“yup ... shift + tab helped me navigate and once the menu is reached i hit enter and it opened ... worked perfectly”<br>“esc key helped me close the menu”<br>“yup i could navigate to every button and menu with shift + tab ... open the menu by pressing enter and down arrow ... close it with esc ... pass all the way”<br>“hold on ... which dashboard are we talking about ... when i click manage billing to get to the payment portal this is where i end up ... i guess this is the dashboard ... and i got same success w/ keyboard ... pass”<br>“pass” | PASS | 25 November screenshots: responsive OwedBook 13:45–13:46; Portal billing keyboard observation 13:56; corrected /dashboard observation 14:02; final logout 14:15. Asia/Dhaka. | — |
| HC-04 | Tony, Director | Local QA ports shown. See evidence/Q2/27 identity qualifications. | “ok all the mobile screens pass ... and 1024px and above passes for me ... but look at the 768px ... look at the 3rd screen and top right corner 'sign in' button ... the text is broken in my view ... we can make the font smaller to fit the text ...”<br>“also look at bottom of the screen ... when i was making responsive designs ... at this point, i would make those bottom links go block ... stack up one below the other and center them ... so that they don't show up broken like this”<br>“on that note ... 768px doesn't pass the visual design ... let's go finish this”<br>“that's a pass ... both mobile and desktop looks perfect ... just this one thing I wanted you look at is that all the dropdown menus show up miss placed ... but that happens in chrom's mobile mode on ... once i turn that down ... dropdowns are normal ... is this due to a chrome bug? will they look ok on real mobile ... i can't say ... is this  a fail for ui/ux?”<br>“here we go ... i say ... pass”<br>“well that all the mobile menu ... owedbook and payment portal ... i say they pass”<br>“pass” [style-tile response]<br>“pass” [final sign-out response] | PASS overall in later answer. 768px failure and two rework requests retained. | 25 November sign-in screenshots 14:18–14:22; supplementary dropdown screenshots 14:50–14:52. 26 November Portal comparison 09:45–09:47; menus 09:48–09:49; final sign-out 10:07. Style-tile reply has no exact time. Asia/Dhaka. | F27 |
| HC-05 | Tony, Director | Local QA ports shown. See evidence/Q2/27 identity qualifications. | “BLOCKED—Windows unavailable”<br>“... we can have windows after deployment” | PASS reported on Ubuntu. Planned Windows check remains BLOCKED for Friday’s disposition. | 26 November, after the 10:07 screenshot and before Help screenshots at 10:15. Exact ruling time not supplied. Asia/Dhaka. | F32 |
| HC-06 | Tony, Director | Local QA ports shown. See evidence/Q2/27 identity qualifications. | “pass” [initial link]<br>“this is what i got .... pass” [used link]<br>“sign in success via email link ... pass ... right?”<br>“pass” [final logout] | PASS overall in later answer. Private destination inspection not separately attested. | 26 November: first email timestamp 10:43; initial confirmation and Owner B landing 10:47; used-link refusal 10:49; fresh email timestamp 10:52 visible in later inbox thread; final screenshot filename 045458 (not an authoritative visible clock). Exact fresh-success/logout times not separately supplied. Asia/Dhaka. | — |
| HC-07 | Tony, Director | Local QA ports shown. See evidence/Q2/27 identity qualifications. | “current time 10:56am ... i'm working on this sign in now”<br>“what now... sign into incognito? done”<br>“pass” [used link]<br>“pass” [fresh link]<br>“pass” [final sign-out]<br>“pass” [explicit overall HC-07 result] | PASS. Fresh request inferred from observed sequence and Director report. | 26 November: Director start 10:56; first email 10:57; confirm page 10:58; Owner B /dashboard 10:59; used-link refusal 11:01; fresh-link Owner B landing 11:04; logout/login screenshot 11:06. Overall response after that screenshot has no separate time. Asia/Dhaka. | — |
| HC-08 | Tony, Director | Local QA ports shown. See evidence/Q2/27 identity qualifications. | “ok i'm sharing these 2 screens with you to let you know the issues i have with this ... when i clicked the billing and adding... item i did go to that item (#7) ... which is a pass ... but watch what happened to the UI/Ux ... that left menu is not stuck at the top ... which is also great ... but now think what happens if i click #12 or #13 ... the right side goes all the way to the bottom of the doc ... that is also fine ... but now if you want to go back to the top of the page where the header and menu is .. you are fucked ... now you have to scroll thru the entire fucking doc to go to the top ... this is fucked up ... while this is good ui for the help doc ... we need a small link at the bottom of the left menu that says "Go to the Top" and that will quickly take us to the header of page without scrolling thru the whole god dam doc ... this is a must for me ... pls add to the rework”<br>“pass” [section #7 wording/labels]<br>“all good ... pass” [Who can do what]<br>“done and got the same login screen”<br>“pass ... of course ... w/ a very few rework request ... including the mobile phone issue ...” | PASS with mandatory “Go to the Top” rework. | 26 November Help screenshots 10:15–10:16. Later result and sign-out messages have no exact time. Asia/Dhaka. | F29 |
| HC-03 | Not performed | — | Removed from required set by Director ruling | NOT RUN | — | — |

**B. Session method by test.** Each result in this report states fixture session, password sign-in, or emailed link (human).

**C. First failures.** Each first failure is listed here with its classification before any rerun.

| Test | First failure, time | Classed as | Rerun? Why it was safe | Later outcomes |
|---|---|---|---|---|
| See FINDINGS.md F01–F32 and continuation observations | First evidence paths retained in each entry | Proposed classifications, Friday dispositions where supplied | Only bounded safe diagnostics; no automatic side-effect retries | Mixed outcomes never erase failures |

### Mock build first failure (instrument/environment, before diagnostic rerun)

The separate mock copy linked node_modules outside its Turbopack root; Next package resolution refused. First output retained in evidence/Q2/01/mock-build.log and receipt mock-build.json. QA setup correction: local copy of the already clean-installed dependencies, no product config change. Diagnostic build writes separate logs. No live server replaced; no session/effect.

### Browser matrix interruption — bounded diagnostic resume

Original runner stalled on Firefox scripts-disabled document.fonts.ready after checkpoint evidence/Q2/02/0609.json. Saved source and journal-before-font-timeout.json; stalled row 0610-first-interruption.json is INCOMPLETE, not pass. At interruption no authenticated context was active; Chromium six sessions had signed out. Resume skips all completed Chromium and two Firefox public rows; font wait now bounded to two seconds and records readiness=false separately. No hidden sign-in retry. Real serving processes untouched.

## Read-only supplemental progress

Firefox/WebKit content-stable v3 checks completed for Member, Store admin and Owner A; each signed out (HTTP200). Source and per-step evidence in AUTOMATION/Q2/journeys-readonly-v3.mjs and evidence/Q2/06. Original interruptions remain in F10. Audit ON paging grew from 50 to 100 distinct IDs in both engines; this does not pass the unresolved extra OFF boundary (F11). Human answers remain unreceived and blank.

## Execution checkpoint — after the billing attempt of 24 November, 19:33:19 BDT

O-1 finished 30 attempts, zero complete: 29 missing the ruled Owner-only control for Store admin, one Firefox initial-navigation timeout. All 18 sessions signed out; evidence/Q2/05/summary.json. Member hover/focus coverage completed both apps at 375/1440, 16 route-width observations (redirect duplicates explicitly reduced), two fixture sessions signed out; evidence/Q2/13/member-states.json. Portal read-only overview rejected Member and Store admin with 403 and no owner payload (evidence/Q2/10).

Password app-to-app diagnostic passed both directions, same identity and protected-page refusal after logout; first selector timeout retained (F14). Single released billing-opening attempt sent one app POST then timed out awaiting the hosted page (F15). No provider session creation is claimed. No automatic retry; no settings or payment action. Invitation, acceptance and Member removal remain unperformed; J-c/J-d/J-g held. No human answers received. Both real QA builds continue serving.


## Critical-regression journey reconciliation

See evidence/Q2/23/CR_JOURNEY_RECONCILIATION.md for all CR-01–CR-12, actual evidence and remaining gaps. Original inventory and current/stale/retired classifications remain in evidence/Q1/02/REGRESSION_INVENTORY.md; no old result is carried as independent proof.


## Historical continuation checkpoint

Q2-A1 only amended the plan; SHA-256 `6a1abc2ae4187874e6c755d195d5ab6fc060c4f26d92520b6df6bc8cf9c73c7d`, confirmed bound by Friday against the exact amendment diff. Corrected O-1:17 completed,2 incomplete,5 warm routes NOT RUN after Firefox setup failure, out of24 planned; twelve sign-in attempts, eleven successful sessions, all recorded logout requests HTTP200. Original30 incomplete routes retained as Friday’s F12 plan defect, with prior Firefox timeout separately kept. No Portal-login defect observed in19 started routes; no clean O-1 pass.

Owner B extra short-history boundary PASS (Q2/19). F15 saved-only diagnosis cannot establish test fault, so no conditional second billing opening. Existing-store/tab checks Q2/24 did not establish a real populated table; Owner A stopped at a tab-click timeout. Pixel/focus observations and all named unmeasured contexts are in Q2/15,20,23,24,25. Proposed F18/F21 and unresolved F19/F20/F22 await Friday; counts of pixels/controls are not journeys.

Mock probe Q2/21 raw FAIL remains. Source/read-only reconciliation shows all designated global roles are member and the unchanged mock Admin guard requires global admin; mock Admin coverage BLOCKED, no fixture/role change or retry. OwedBook mock rendered25 demo rows with no observed browser business RPC/mutation; that limited observation is not a global backend network proof.

Real builds restored on3100/3101, SCRATCH, exact candidate pair. Q2/22/real-ready.json verifies HEADs/branches, copied source hashes, unchanged compiled BUILD_ID lineage and actual listener configuration. Build-info labels remain unrecorded because next.config compiles them at build time. Failed runtime-metadata assumption F24 and corrected verifier diff/controls are retained; no endpoint identity claim is substituted silently. Exact existing Invitee is allowlisted in OwedBook runtime, Portal invitation allowlist empty; no invitation sent. Sign-in mail request configuration is present and Auth email enabled; SMTP delivery, redirect allowlist and rate limits are not established by the public settings read. Four actual emails await Director checks.

Tony authorized the J-e send at his inbox on 25 November. Friday ruled that the Invitee retains its existing pharmacy and role and gains exactly the invited Owner A pharmacy. One invitation and email were reported sent for O-1 A-mid o1r03. Tony accepted at about 08:46 BDT. Independent verification passed exact invitation scope, one cancel, one confirmed removal and the removed/zero-store follow-up. Seven answers were pending at that checkpoint. The returned worksheet and later answers are now filed in Q2/27. J-c/J-d/J-g remain BLOCKED by release scope. No verdict, repair, Git mutation or deployment. Final full package held until the remaining work and human answers are recorded.

# Q4 — automated run

# Q4 automated progress — ABM007_FINAL

**Q4 AUTOMATED RUN COMPLETE — AWAITING DIRECTOR WALKTHROUGH**  
Prepared 26 November 2026 15:35 BDT. Friday adjudicates, and Tony's post-walkthrough commit remains required before certification.

| App | Working-tree identity SHA-256 | Port |
|---|---|---|
| OwedBook | f229d7a129138af7cc97e1fdb5acadf885c1907ad7cd3c140f4bad5334a4d22d | 3100 |
| Account & Billing | ba726f5ea3f5bf2cdd8156a16360e7674be2da500be48c81cacac19ba682c4b9 | 3101 |

Both independent copies matched at entry and after the final diagnostics. The two real local-proof builds are serving on SCRATCH and report those compiled revisions. See evidence/Q4/01. The protected-path review included the exact 22 and 136 paths and the AM-22 (3) record-only RECOVERY insertion.

## Clean basics

- OwedBook: 60 suites, 408 tests. Portal: 37 suites, 588 tests. Both lockfile installs, typechecks, lint runs and labelled builds exited 0. Saved commands, counts and build identity in evidence/Q4/01.
- Chromium, Firefox and WebKit positive and negative geometry and rendered-pixel controls are saved per engine. Runtime output went to redacted QA log files.
- The three follow-ups outside the module are F33–F35. The pure Member fixture is unavailable, since the original Member was removed and the Invitee has both an owned and an assigned store. They were not treated as equivalent.

## Repair observations

| Repair | First measured outcomes | Bounded diagnostic outcomes | Evidence | Scope note |
|---|---|---|---|---|
| R-01/A1-1 | 21 PASS | 21 PASS | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Button colors, dimensions, focus, text and real local link destinations. |
| R-02/A1-2/A1-3 | 56 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Help menu and end link, including short windows. Active Member-only fixture absent. |
| R-03 | 6 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Held stub only, one intercepted POST per busy case and no provider call. |
| R-04/R-05 | 22 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Disabled fields measured with calibrated pixels, link color and underline. Active Member-only fixture absent. |
| R-06 | 77 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Password reveal, dashboard tabs, desktop round account trigger. |
| R-07 | 29 PASS | 36 PASS, 3 INCOMPLETE | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Correct app is OwedBook. Add and helper edges, tab strip internal scroll and 320px route sweep. |
| R-08/A1-4 | 135 PASS, 9 INCOMPLETE | no corresponding runtime result | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Signed-out and signed-in public/auth shared footer. Standalone framework 404 recorded separately. |
| R-09 | 9 PASS, 18 FAIL | 15 PASS, 1 INCOMPLETE | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Original responsive row probe retained. Final diagnostic excludes hidden duplicate responsive controls. Refresh remains a 12px link treatment with a 44px target. |

First-attempt rows are retained. Hidden responsive duplicates and asynchronous loading are documented in the diagnostic outcomes. The affected earlier rows do not become passing results by replacement. F20 setup failures have the final path, control state and response statuses recorded without credentials. Later cases requiring a failed setup are BLOCKED.

Ruled non-defects: 42px text fields, 14–15px header/navigation text, 14px Medium data-view tab text, Refresh's link treatment and 44px target, and the shortened 320px header wordmark.

## Full Q2 matrix and cross-cutting regression

The source Q2 matrix lists 762 measured positions. Q4 accounting: 536 OBSERVED, 31 INCOMPLETE, 195 BLOCKED across 762 recorded positions. Positions for unreleased payment-dependent pages, missing active Member and failed setups retain explicit gaps. See evidence/Q4/03/{engine}-matrix.json and numbered raw measurements.

- Geometry/text/control flags pending applicability review: {'badCorner': 0, 'badSurface': 31, 'badTarget': 0, 'navControl': 0, 'badLinks': 0, 'buttonNavy': 0}. They are instrument observations, not a count of product failures.
- Calibrated rendered-pixel counts: {'pass': 24062, 'fail': 35, 'notRun': 383}. These are text-range measurements, not journeys. NOT RUN ranges retain each reason. Default surfaces, changed hover/focus colors and nontext edges are separately measured. Nontext row accounting: 120 OBSERVED, 6 INCOMPLETE, 20 DEDUPLICATED, 82 BLOCKED. Edge result counts: {'border PASS': 115, 'focus PASS': 860, 'focus NOT RUN': 87, 'focus FAIL': 26, 'border FAIL': 1}. Changed state text results: {'hoverText SAME COMPUTED COLORS': 487, 'focusText SAME COMPUTED COLORS': 854, 'hoverText pass': 734, 'hoverText fail': 0, 'hoverText notRun': 0, 'focusText pass': 43, 'focusText fail': 0, 'focusText notRun': 0}. Script-disabled instrument stalls, held journeys, unobservable role cases and unsupported geometry remain explicit. This evidence alone does not claim an exhaustive passing result.
- AC-L02 mock table. 2 PASS.
- AC-F02 seven Firefox positions. 6 COMPLETE, 1 INCOMPLETE.
- F22 timeout contexts. 3 COMPLETE.
- Core regression, first instrument. 25 PASS, 3 FAIL, 2 BLOCKED, 1 INCOMPLETE.
- Core/price settled diagnostics. 4 PASS, 1 FAIL.
- OwedBook's 375px Help end-of-text Go to the Top link measured 4.0355:1 against 4.5:1. F36 covers the green link on the ice surface under AC-B07 and AC-B08. The return-to-top behavior and the separate sidebar link have their own results. See evidence/Q4/05/settled-read-diagnostics.json and the earlier sampled ranges in Q4/03.
- Public plan pricing: **PASS** after waiting for the rendered price. The first instrument observed the loading state. The review screen remains at Gate D.
- The three F22 diagnostic captures reached HTTP 200 in exclusive browser phases. The masked screenshots are included. No console or runtime log lines were emitted during those requests; the log slices and request status are recorded. The separate seventh Firefox warm route remained INCOMPLETE when its process ended. The warm session sign-out could not be confirmed.
- The raw command exits are retained in evidence/Q4/05/phase-exits.txt and the per-phase logs. Session setup issues retained: 1 in the initial repair pass.

## Released effects

- Automated sign-in attempts: **57/80**, counting failed setup attempts against the budget. Each run records sign-out or unconfirmed cleanup. Owner B unused by automation.
- Portal dashboard/billing GET loads: **283** (111 document loads and 172 fetches), with browser request kind and path in evidence/Q4/01/portal-loads.jsonl. They are the app's own permitted read-only lookups, not Stripe write effects.
- Zero automation email, invitations, acceptance, member removal, billing-portal openings, Checkout, purchase, schedule/undo, listener or fixture mutation. The only public busy-login activity held a stub in the browser without reaching the provider.
- J-c, J-d, J-g, hosted J-b return and the review part of AC-R05 are deferred to Gate D under AM-21. They have no passing Q4 result.

## Director handoff

Use sheet 04 on the two real builds left serving. JARVIS guides Tony using Owner B. The post-commit check instructions are in HANDOFFS/Q4_POST_COMMIT_CHECK.md. Record the two commit outputs after the walkthrough and Tony's commit. Friday owns the disposition of incomplete or failing contexts and all certification.


## Q4 closeout — 27 November 2026

The eight manual checks passed by Director report. Owner B used password sign-in on desktop Chrome on Ubuntu. Walkthrough browser version and start time were not captured. W-01–W-03 came directly from Tony to Friday at about 10:15 BDT. W-04–W-08 came from JARVIS's report as supplied by Tony. See evidence/Q4/06/DIRECTOR_WALKTHROUGH_RECORD.md for the exact words, recorded times and detailed provenance. Tony reported no failure, no blocked check and no prohibited action. The automated results and all first failures above are preserved, including F36 and the missing or incomplete cases.

Both local served build-info revisions matched the pinned isolated copies at 10:24:17 BDT, with both running on SCRATCH. Portal's working tree gained a changelog record and session log after the rebuild. Exact working-tree equality therefore holds for OwedBook; for Portal the served copy matches and the later records need commit reconciliation. See evidence/Q4/06/closeout-live-identity.json.

The final effects ledger is evidence/Q4/06/EFFECTS_FINAL.md. Decisions and post-commit instructions are under HANDOFFS. Friday adjudicates.

## Q4 confirmation A3 — automated results

468 of 468 centered activations passed. All four exact Firefox reproduction positions passed. The additional Chromium Owner A session confirmed native navigation on rendered Help after page scripts were disabled. From scroll position 6803, the last article link returned to zero with the header visible at all five samples through 2000 ms. On a cold load with scripts disabled, the response contained all 13 links under a hidden ancestor and the last link had no layout box. A reader could not use those links on that cold load. Friday should adjudicate cold-load accessibility separately from the native link and F37. Two earlier cold-load attempts remain recorded. Evidence: evidence/Q4/A3/chromium-no-script-rendered.json. Final automation effects: 12/15 SCRATCH sign-in attempts, 12 sign-outs HTTP 200, zero Portal document loads. The read-only build-info check verified the pair again in served-ready.json. W-09 and W-10 remain pending.

## Final sheet 05 — Director answers

# A3 Director walkthrough — sheet 05

## W-09

Director, verbatim:

> w-09 pass and i am very happy

Director-reported result: PASS. Check time not supplied. No separate description of the Help heading was supplied.

## W-10

Director, verbatim:

> w-10 ... pass

Director-reported result: PASS. Check time not supplied.


## Gate Q certificate recorded · 28 November 2026

Friday issued **PASS WITH KNOWN RISK**. The Director supplied the certificate in chat. The UTF-8 Markdown transcription at HANDOFFS/QAM_CERTIFICATION_ABM007_FINAL_GATE_Q_2026-11-28.md has SHA-256 `d3928bc403f758901ac1dede5a7da5f6d0b20638850771ea8d721c29117c6b33`. Both repositories are on qa/abm007-final. The repair commits and their local origin branch references agreed at verification. Push reported by Tony.

| App | Full repair commit | Files checked | Tony's mismatches | Cody's mismatches |
|---|---|---:|---:|---:|
| OwedBook | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | 2,314 | 0 | 0 |
| Account & Billing | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` | 2,557 | 0 | 0 |

Under AM-21, Gate D must cover J-c registration through Checkout, J-d purchase of an additional pharmacy, J-g scheduling and undoing a removal, the hosted Stripe billing return of J-b, and the AC-R05 review-screen price. These checks block module closure. Independent command outputs and the Director’s comparison are in evidence/CLEANUP/.

