# AC_EVIDENCE_MATRIX — `ABM007_FINAL`

**Owner:** QA Executor (Gate Q rows); QA Lead records the Gate D rows from the Director's session · **Written:** Q2, Q4 if run, and the Gate D session · **Status: Q2 COMPLETE — AWAITING ADJUDICATION.** This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

One row per criterion: 36 rows. Requirement text is in `../ABM_ACCEPTANCE_SPEC.md`; the short title here is a label only. Blocking: `G` gate before engineering, `B` blocks Gate Q, `D` judged at Gate D.

Result labels: PASS, FAIL, BLOCKED, NOT RUN, ADJUDICATE. Gate D entries are BLOCKED / out of Q2 scope. They carry no Gate Q result. AC-R04 is reported per journey (a) to (j) in the evidence cell; (i) is PASS only if paging was actually exercised.

| AC | Short title | Env | Blocking | Result | Test IDs | Evidence paths | Candidate pair the evidence belongs to |
|---|---|---|---|---|---|---|---|
| AC-V01 | Gate V visual approval recorded | DIRECTOR | G | PASS | T-AC-V01 | evidence/Q2/03/document-results.json; ABM_RULINGS.md AM-08(2) | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B01 | Token block matches; anchors resolve to exact hex | SOURCE | B | PASS | T-AC-B01 | Exact source declarations and zero measured anchor mismatches. Q2/03/source-results.json and Q2/02/measurement-summary.json. HC-04 visual feedback is separately recorded. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B02 | No hardcoded color | SOURCE | B | PASS | T-AC-B02 | evidence/Q2/03/source-controls.json; source-results.json (346 non-test source files; frozen dark block excluded per D-01) | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B03 | Inter only, via next/font | SOURCE, LOCAL-QA | B | PASS | T-AC-B03 | Observed fonts match Inter 400/500/600/700. Q2/02/measurement-summary.json, Q2/03/label-font-spotcheck.json. F07 first instrument interruption retained. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B04 | Light forced | LOCAL-QA | B | BLOCKED (Windows human condition) | T-AC-B04 | Automated forced-light cases passed including dark system and stored dark preference, with scripts on/off. Q2/02 and Q2/07/public-first-paint.json. Tony’s later Ubuntu Chrome dark-mode observation passed. Windows Chrome, stored-theme steps and exact first-paint/reload scope were not established for that human observation. Friday to rule equivalence or gap. Q2/27/DIRECTOR_LATER_ANSWERS.md, F32. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B05 | Radius and shadow scale | LOCAL-QA | B | FAIL | T-AC-B05 | Q2/02/0000.json, 0091.json and 0232.json. F03 records departures from the radius/control scale. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B06 | Buttons and their states | LOCAL-QA | B | FAIL | T-AC-B06 | evidence/Q2/04/states.json; F03/F04; controls in evidence/Q2/01/browser-controls.json | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B07 | Link rules by surface | LOCAL-QA | B | FAIL | T-AC-B07 | Profile support body link is muted gray, contrary to the dark-green body-link rule. F21 and Q2/20 rendered per-link records. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B08 | Rendered contrast | LOCAL-QA | B | FAIL | T-AC-B08 | F18 disabled Profile fields measured about 2.43:1. Saved gradient pixel method and controls in Q2/15. HC-02 keyboard pass retained. Incomplete contrast/focus contexts remain in Q2/23/CONTRAST_NOT_RUN.md and rendered-reconciliation.json. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-B09 | Status shown by word, border, tint | LOCAL-QA, SOURCE | B | BLOCKED (coverage incomplete) | T-AC-B09 | 276 observed status/role entries passed the bounded review in Q2/23/status-review.json. Held and unobserved states leave the full every-status criterion unverified. Q2/23/CONTRAST_NOT_RUN.md. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-L01 | Literal layout pages | LOCAL-QA | B | BLOCKED (registration steps held) | T-AC-L01 | Public layout evidence Q2/02 and Q2/04. Protected registration steps redirected and were not rendered. HC-04 overall pass and specific Portal 768px wrapping are both retained in Q2/27 and F27. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-L02 | Translated layout pages | LOCAL-QA | B | BLOCKED (real populated table) | T-AC-L02 | Translated shell rows Q2/02 and human visual comparisons Q2/27. Real populated OwedBook table width unestablished in Q2/24, including the first Owner A tab timeout. Q2/21 mock table is a separate observation. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-L03 | Add Pharmacy and Help keep navigation | LOCAL-QA | B | PASS (observed screens) | T-AC-L03 | Signed-in Owner Help/Add Pharmacy recorded in Q2/02 and Help in Q2/06 and Q2/08. Q2/27 reports Add Pharmacy form opened and Help navigation. No submission or quote implied. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-L04 | 375px behavior | LOCAL-QA | B | FAIL | T-AC-L04 | Observed Portal sign-in header and footer wrapping at 768px in HC-04 (F27). Primary control size issues F03 require Friday’s applicability decision. Three 375px candidate /billing rows had no page overflow (Q2/02/0578, 0690, 0777). No full real-table reflow check or candidate real-phone trial. HC-02 passed and HC-03 was removed. Q2/27/ALPHA_PHONE_COMPARISON.md. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-L05 | Error, empty, loading, denied states | LOCAL-QA | B | BLOCKED (state coverage incomplete) | T-AC-L05 | Q2/04 and Q2/06 observed explicit failed reads, denial/not-found and public empty states. J-h zero-store verified. Q2/21 mock Admin blocked (F23). Unobserved loading/error/busy state coverage in Q2/23/CONTRAST_NOT_RUN.md. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-N01 | Approved names; no old name | SOURCE, LOCAL-QA | B | PASS | T-AC-N01 | Names scan and runtime channels Q2/02 measurement-summary and Q2/03 source checks. No contrary naming observation in HC-04. The separate CTA wording ruling is carried to Friday, not tested. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-N02 | Logo master and derived files | SOURCE, LOCAL-QA | B | PASS | T-AC-N02 | Exact master hashes, no old file references and reconstructed full-canvas PNG/ICO match. Q2/03/icon-results.json and source-results.json. HC-04 render comparisons Q2/27. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-H01 | Help page reachable, content as approved | LOCAL-QA | B | PASS (qualified) | T-AC-H01 | Help anchors and role navigation Q2/06 and Q2/08. Director HC-08 passed content and labels, with mandatory Go to the Top enhancement F29. Q2/27/HUMAN_WALKTHROUGH_RECORD.md. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-H02 | Help has no test or internal material | LOCAL-QA, SOURCE | B | PASS | T-AC-H02 | Q2/06 forbidden-term and rendered Help checks. HC-08 wording/labels passed by Tony’s report, Q2/27. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-H03 | Help links obey guards | LOCAL-QA | B | PASS | T-AC-H03 | evidence/Q2/06/firefox-readonly-journeys-v3.json; webkit-readonly-journeys-v3.json; evidence/Q2/08/chromium-help-stable.json; evidence/Q2/10/portal-denials.json; role sessions explicitly labelled; original F10 interruptions retained | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-F01 | "No permitted stores" only at zero stores | LOCAL-QA | B | PASS | T-AC-F01 | Owner, Store admin and Member with permitted stores had no zero-store message (Q2/02/0476, 0344, 0232). After J-h, the removed Member had only the disabled No permitted stores placeholder and could not reopen the former pharmacy. Before/after J-h comparison showed no new stores and unchanged access for the other cast. The earlier single added store belongs to J-e and matched Friday’s ruling. Evidence Q2/J-e and Q2/J-h/execution.json. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-F02 | Redirect reproduction record | LOCAL-QA | B | BLOCKED (O-1 incomplete) | T-AC-F02 / O-1 | Original 30 incomplete, including the Firefox timeout and the wrong route Friday classed as plan defect F12. Q2-A1 17 complete, 2 incomplete, 5 not run. No Portal sign-in redirect on 19 started amended routes. All 54 rows in Q2/27/O1_ALL_ROUTE_RESULTS.json, with raw engine records Q2/05 and Q2/16. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-F03 | Landing page repair | LOCAL-QA | B | PASS (frozen criterion) | T-AC-F03 | Landing anchor walk and approved branding in Q2/02. Candidate HomePageContent.tsx removes the stale artwork under P-08. Separate Director CTA wording and styling requests F28 remain open for rework and outside this criterion result. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-R01 | Unit suites | LOCAL-QA | B | PASS | T-AC-R01 | evidence/Q2/01/ob-unit.log (59/394); pp-unit.log (36/584); runner controls and clean-install logs | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-R02 | Typecheck, lint, build | LOCAL-QA | B | PASS | T-AC-R02 | evidence/Q2/01/ob-gating.json; pp-gating.json; build-result.json; clean installs; real mode only | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-R03 | No protected path touched | SOURCE | B | PASS | T-AC-R03 | evidence/Q2/03/source-results.json; changed-path lists; billing-notices.diff; documented AM-08(3) RECOVERY exception with empty engineering diff | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-R04 | Critical journeys (a) to (j) | LOCAL-QA | B | BLOCKED | T-AC-R04 | Ten separately evidenced rows in Q2/23/JOURNEY_RESULTS.md. J-c, J-d and J-g held by Tony. J-b hosted billing return unobserved, F15/F26. See Q2/27 for human evidence and provenance qualifications. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-R05 | Prices unchanged | LOCAL-QA, SOURCE | B | BLOCKED (rendered review incomplete) | T-AC-R05 | Constants and six source/unit assertions preserved, Q2/03/pricing-boundary.log and receipt. No complete rendered plan and review price matrix, quotes, or paid journey recorded. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-R06 | Rehearsal account untouched | LOCAL-QA | B | PASS (candidate QA effects) | T-AC-R06 | Q2/effects-progress.json and Q2/27/EFFECTS_FINAL.md. Local QA uses designated SCRATCH cast. Separate supplemental alpha-phone observations carry no confirmed rehearsal account or mutation and are outside candidate evidence. No QA rehearsal-account use, charge or modification recorded. | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-E01 | Email body diff is presentation only | SOURCE | B | PASS | T-AC-E01 | evidence/Q2/03/document-controls.json; document-results.json; email-template.diff; subject prepared in EVIDENCE/E2/email/README.md; not applied | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-E02 | Branded email delivery (matrix E02-1 to E02-6) | ALPHA, DIRECTOR (DEV project) | D | BLOCKED (Gate D not released) |  | GATE_D_PLAN.md. The separate alpha phone note is supplemental. |  |
| AC-E03 | Billing notice wording; deployment record | SOURCE, ALPHA | B for source; D for the deployment record | PASS (source) / BLOCKED (Gate D deployment) | T-AC-E03 | evidence/Q2/03/billing-notices.diff; document-results.json; source wording-only diff; Gate D deployment record excluded | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| AC-E04 | Stripe branding previews | DIRECTOR | D | BLOCKED (Gate D not released) |  | GATE_D_PLAN.md. The separate alpha phone note is supplemental. |  |
| AC-D01 | Deployment receipt per service | ALPHA | D | BLOCKED (Gate D not released) |  | GATE_D_PLAN.md. The separate alpha phone note is supplemental. |  |
| AC-D02 | Director alpha ride | ALPHA, DIRECTOR | D | BLOCKED (Gate D not released) |  | GATE_D_PLAN.md. The separate alpha phone note is supplemental. |  |
| AC-P01 | Changed-labels list | SOURCE, LOCAL-QA | B | PASS | T-AC-P01 | EVIDENCE/E2/CHANGED_LABELS.md reviewed in full; evidence/Q2/03/document-results.json and label-font-spotcheck.json; both public title checks matched; Help and Menu rendered in role checks | OB 2e91e90905b2d9907577a64985e643f7827019ac / PP fc1fa6c2a90ebf59987287ad765e2e65cf635549 |

## Carried-forward evidence

| AC | Evidence from which earlier candidate | Why it still applies (diff proof) | Accepted by the QA Lead? |
|---|---|---|---|
| none | | | |

## Amendment 01 note

A criterion that depends on a required human check is not PASS while that check is PENDING or BLOCKED. Evidence obtained under a fixture session is marked as such in the evidence cell and does not satisfy a criterion that asks for real sign-in, email delivery or handoff.

## Q4 retest evidence (Q2 rows preserved above)

| Criterion or group | Q2 disposition by Friday | Q4 execution and outstanding limits |
|---|---|---|
| AC-R01, AC-R02 | PASS | PASS, both lockfile installations, both suites, typecheck, lint and labelled production builds. Q4/01. |
| AC-R03 | PASS | Scoped path check PASS under the working-tree amendment and AM-22 (3). Exact post-commit verification pending. |
| AC-B05 | FAIL | Repaired target geometry in Q4/02. Q4/03 retains 0 field-radius and 31 surface-radius flags for applicability review. Full criterion coverage BLOCKED where the matrix was unavailable. |
| AC-B06 | FAIL | Busy Login rerun: 6 PASS. Control and state detail in Q4/02–03. First instrument results and unexercised states retained. |
| AC-B07 | FAIL | Profile support-link outcome on 22 of 22 measured cases. OwedBook's 375px Help end-of-text Go to the Top link measured 4.0355:1 against 4.5:1. F36 covers the green link on the ice surface under AC-B07 and AC-B08. The return-to-top behavior and the separate sidebar link have their own results. Member-only gap remains. |
| AC-B08 | FAIL | Disabled Profile fields were pixel-tested. Lowest observed ratio: 6.2399. Remaining out-of-scope or unmeasured ranges are explicit in Q4/03. See F36 and the named Help pixel sample in Q4/05 for the observed link failure. |
| AC-L04 | FAIL | 0 observed 375px matrix positions recorded horizontal page overflow. Repaired edges and 768px fit evidence are in Q4/02. Native phone coverage stays at Gate D. |
| AC-L02 | Finish at retest | Mock layout: 2 PASS. See Q4/05/mock-table.json; live SCRATCH had no claims table fixture. |
| AC-F02 | PASS, bounded record | Seven additional Firefox positions: 6 COMPLETE, 1 INCOMPLETE. Earlier Q2 rows immutable. |
| AC-R04 | Payment part deferred | Dry/read-only regression in Q4/04. Hosted J-b return, J-c/J-d/J-g deferred to Gate D. Email/invitation/removal not repeated. |
| AC-R05 | Payment part deferred | Public plan result PASS. Review part deferred to Gate D. |
| Core roles, isolation, truthful states, brand and Help | Passed with Q2 scope | Q4/04/core.json first results 25 PASS, 3 FAIL, 2 BLOCKED, 1 INCOMPLETE. Settled My Stores and isolation results are in Q4/05/settled-read-diagnostics.json. Pure Member coverage remains blocked. |
| Director W-01 to W-08 | Not Q2 criteria | PENDING returned sheet 04. |


## Final Q4 side-by-side evidence

The original Q2 evidence and QA Executor labels remain above. The Q2 column below uses Friday’s adjudication of 26 November. The Q4 column records executed outcomes and coverage limits for the repaired candidate. Friday adjudicates.

| Criterion | Scope | Q2 QA Lead disposition | Q4 recorded retest evidence |
|---|---|---|---|
| AC-V01 | Gate V visual approval recorded | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. |
| AC-B01 | Token block matches; anchors resolve to exact hex | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. |
| AC-B02 | No hardcoded color | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. |
| AC-B03 | Inter only, via next/font | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. |
| AC-B04 | Light forced | PASS | Partial observations in the full rerun. Scripts-disabled interruption retained in Q4/03. Full forced-light campaign outside the Q4 repair scope. |
| AC-B05 | Radius and shadow scale | FAIL | PARTIAL. Zero field-radius flags on measured positions. 31 decorative round surface flags triaged in Q4/03/raw-flag-triage.json. Blocked or interrupted positions remain in Q4/03. |
| AC-B06 | Buttons and their states | FAIL | PARTIAL. R-03 triggered the busy state correctly in all six controlled passages. Bounded resized-control observations and hidden-duplicate diagnostic results are retained in Q4/02. Missing contexts and state gaps remain. |
| AC-B07 | Link rules by surface | FAIL | FAIL observed. Profile support link passed in 22 measured contexts. The Help end link is green on ice, F36. Q4/05/settled-read-diagnostics.json. Member-only coverage blocked. |
| AC-B08 | Rendered contrast | FAIL | FAIL observed. Disabled Profile text minimum 6.2399:1 in measured contexts. Help end link measured 4.0355:1 against 4.5:1, F36. Default, hover, focus, nontext, all unmeasured contexts and remaining raw flags are in Q4/03 and Q4/05. Manual W-04 covers function. |
| AC-B09 | Status shown by word, border, tint | PASS on what was observed | Partial observations in Q4/03 and truthful-state runs. Payment-specific states remain at Gate D. |
| AC-L01 | Literal layout pages | PASS on what was rendered | Partial public shell observations in Q4/02–03. Registration review remains deferred. No repeat of the full layout campaign. |
| AC-L02 | Translated layout pages | Finish at retest | PASS within the mock layout scope selected by Friday. AC-L02 mock filled 990 of 992 px at 1440 and rendered 25 stacked cards with zero overflow at 375. Q4/05/mock-table.json. |
| AC-L03 | Add Pharmacy and Help keep navigation | PASS | Help navigation spot-checked under R-02 and core. No complete Add Pharmacy journey in Q4. |
| AC-L04 | 375px behavior | FAIL | PARTIAL. No sideways page overflow in completed 375px positions. OwedBook Billing Add control edges and helper text sampled at narrow widths with interrupted positions retained. Signed-in and signed-out Portal footer runs include 768px; W-03 and W-07 passed by Director report. Q4/02–03 and Q4/06. Native phone remains at Gate D. |
| AC-L05 | Error, empty, loading, denied states | PASS on what was observed | PARTIAL. Read-error stub, observed loading/empty content, and role denial kept truthful in completed probes. See Q4/04/core.json and Q4/05/settled-read-diagnostics.json. Unobserved states remain listed. |
| AC-N01 | Approved names; no old name | PASS | PASS on observed changed screens and labels. Q4/02 and Q4/04/core.json. Full original source inventory retained from Q2. |
| AC-N02 | Logo master and derived files | PASS | PASS on pinned master hashes and observed logo presence. Q4/04/core.json. Original derived asset checks remain in Q2. |
| AC-H01 | Help page reachable, content as approved | PASS | PASS functional checks as observed for available roles, including the menu and end-link behavior. Pure active Member blocked. W-04 separately passed by Director report; F36 records a visual link failure. Q4/02, Q4/04 and Q4/06. |
| AC-H02 | Help has no test or internal material | PASS | PASS observed Help forbidden-term and content checks on supported roles. Pure active Member blocked. Q4/04/core.json. |
| AC-H03 | Help links obey guards | PASS | PARTIAL. Owner and Store admin links, wrong-store and billing scope checks recorded. Pure active Member blocked, one removed-role landing row incomplete. Q4/04/core.json and Q4/05/settled-read-diagnostics.json. |
| AC-F01 | "No permitted stores" only at zero stores | PASS | PASS for observed Owner A, Store admin, Invitee mixed role and removed Member. Zero-store placeholder was disabled only for the zero-store fixture. Pure active Member blocked. Q4/04/core.json. |
| AC-F02 | Redirect reproduction record | PASS, bounded record | 6 COMPLETE, 1 INCOMPLETE in the requested seven new Firefox routes, with no Portal sign-in redirect on the completed paths. The last warm context was lost. Original Q2 rows remain preserved. Q4/05/O1-seven-firefox.json. |
| AC-F03 | Landing page repair | PASS | PASS of observed landing-page navigation across 21 engine-width combinations, including the released CTA ruling. Q4/02/read-only-diagnostics.json. W-02 separately passed by Director report. |
| AC-R01 | Unit suites | PASS | PASS. Clean lockfile install and 60 suites / 408 tests for OwedBook, 37 suites / 588 tests for Portal. Q4/01. |
| AC-R02 | Typecheck, lint, build | PASS | PASS. Both typechecks, lint and fresh production builds exited 0. Q4/01 and Q4/RESTARTS. |
| AC-R03 | No protected path touched | PASS | PASS on pinned repair paths, with AM-22(3) records insertion. End-of-walkthrough Portal records drift is documented. Post-commit exact equivalence is pending. See Q4/01 and Q4/06/closeout-live-identity.json. |
| AC-R04 | Critical journeys (a) to (j) | Payment decision pending in Q2 | PARTIAL regression only. See ten journey rows below. Four payment portions transferred to Gate D under AM-21. |
| AC-R05 | Prices unchanged | Payment decision pending in Q2 | PASS for rendered public plan prices $99.00 and $49.00. Review screen deferred to Gate D under AM-21. First loading-state read and settled diagnosis are in Q4/05. |
| AC-R06 | Rehearsal account untouched | PASS | PASS within recorded Q4 effects. SCRATCH verified, sanctioned fixture accounts only. No rehearsal account activity recorded. Q4/06/EFFECTS_FINAL.md. |
| AC-E01 | Email body diff is presentation only | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. |
| AC-E02 | Branded email delivery (matrix E02-1 to E02-6) | Gate D | Gate D. Outside Q4 scope. |
| AC-E03 | Billing notice wording; deployment record | PASS source. Deployment record at Gate D. | Source decision remains as ruled in Q2. Deployment record remains at Gate D. |
| AC-E04 | Stripe branding previews | Gate D | Gate D. Outside Q4 scope. |
| AC-D01 | Deployment receipt per service | Gate D | Gate D. Outside Q4 scope. |
| AC-D02 | Director alpha ride | Gate D | Gate D. Outside Q4 scope. |
| AC-P01 | Changed-labels list | PASS | PASS on four repaired labels listed and observed in Q4/04/core.json. Full original label inventory in Q2. |

### AC-R04 journey detail

The Q2 journey column preserves the labels in Q2/23/JOURNEY_RESULTS.md. The Q4 column separates the observed local regression checks and AM-21 deferrals.

| Journey | Q2 observed result | Q4 retest or disposition |
|---|---|---|
| J-a | PASS (Director reported) | Outside Q4 scope. Emailed links were excluded. |
| J-b | BLOCKED (hosted billing return incomplete) | Local handoff, return, same identity and refusal passed independently in Q4/04/core.json and by Director report W-01. Hosted part at Gate D under AM-21. |
| J-c | BLOCKED | Gate D under AM-21. |
| J-d | BLOCKED | Gate D under AM-21. |
| J-e | PASS | Outside Q4 scope. Invitation and acceptance were excluded. |
| J-f | PASS | Role and wrong-store denial plus restricted API payload checks observed in Q4/04/core.json and Q4/05/settled-read-diagnostics.json. Pure active Member blocked. |
| J-g | BLOCKED | Gate D under AM-21. |
| J-h | PASS | Existing removed Member and zero-store state observed in Q4/04/core.json. Member removal outside Q4 scope. |
| J-i | PASS | Outside Q4 journey scope. Read-only audit route reached HTTP 200 during F22 in Q4/05. Full Q2 paging/filter sequence not repeated. |
| J-j | PASS (Director reported) | Sign-out and local protection exercised in Q4/04/core.json and Director W-01. Email-link reuse/freshness excluded. |

### Director walkthrough, separate evidence

W-01 to W-08: eight Director-reported PASS results. See Q4/06/DIRECTOR_WALKTHROUGH_RECORD.md for source attribution, quotations, times and unrecorded details. The manual outcomes and automated findings stand as separate evidence.

## Q4 adjudication — Friday, 27 November 2026

## 3. The five criteria that failed in Q2

| Criterion | Q2 | Q4, my ruling | Why |
|---|---|---|---|
| AC-B05, corners and shadows | FAIL | **PASS** | Repaired controls measure 8px corners. The 31 "round surface" flags are one pill-shaped element on three Account & Billing pages for the Store admin; pills are round by contract. Named at the next retest for the record |
| AC-B06, buttons and their states | FAIL | **PASS** | Login busy state correct in all six runs. Resized controls measure 44px. The first pharmacy-row probe counted hidden duplicate controls and is an instrument error; the corrected probe passed 15 of 16, and the sixteenth timed out |
| AC-B07, link rules | FAIL | **FAIL, one item** | Profile support link correct in 22 of 22. New finding F36: the Help end-of-text link is green directly on the light blue page |
| AC-B08, contrast | FAIL | **FAIL, one item** | Disabled Profile fields now 6.24 to 1 at worst. F36 measures 4.04 to 1 against 4.5 |
| AC-L04, phone-width behavior | FAIL | **PASS** | No sideways overflow at any completed position. The 768 header and footer fit. The Director passed W-03 and W-07. The real phone stays at Gate D |

Also closed in Q4: AC-L02 **PASS** (mock build table fills 990 of 992 pixels at 1440 and stacks into 25 cards with no overflow at 375). AC-R05 public plan prices **PASS** ($99.00 and $49.00 as rendered). AC-F02 stays **PASS** (six of the seven extra Firefox routes completed, none reached the Account & Billing sign-in page; the seventh lost its browser).

## 4. The Director's walkthrough

Eight of eight **PASS**. W-04 to W-08 are recorded from the Architect's report with the Director's words. W-01 to W-03 are the Director's direct confirmation to me on 27 November at about 10:15; the Architect's record had lost those three answers. I accept all eight. Per-check details and most times were not captured, and the record says so.

Lesson for the playbook: the filled sheet is saved after every check, so a lost conversation cannot lose results.

## 5. Findings and open rows, decided

| Item | My disposition |
|---|---|
| F36, faint Help end link | **Product defect**, introduced by add-on A1-2. Fixed by A2-1 below |
| F33, F34, F35 | Follow-up findings outside this module. Owner: the Architect |
| F22, three pages that timed out in Q2 | All three loaded normally in Q4 with full capture. Not reproduced. **Closed** |
| F20, fixture sign-in setup timeouts | Seen again once. Test environment, cause still unknown. **Closed for this module** with the captured detail; flagged to the Architect |
| Core regression, three first-attempt failures | The probe read pages before their data arrived. The settled reads passed. Instrument timing. First failures kept |
| Text contrast "1 to 1" on the Invitations and Invite pages | Not a real result. A ratio of exactly 1 means the text was not on screen when sampled, and the same pages pass at neighbouring widths. **Instrument timing; re-measured once at the next retest** |
| Three low samples on the header in Firefox, one position | The instrument marked those pixels unstable. Every other header sample passes. **Instrument; re-measured once** |
| Focus outline samples with one edge missing | **Not decided from numbers alone.** Most look like the control sitting at the edge of the window when sampled. Checked properly under A2-2 below |
| No pure Member test account | The Member account was removed in Q2 as planned, so Member-only screens were not retested. The repaired pieces are shared by all roles and passed for Owner and Store admin. **Accepted limit.** Lesson: keep a spare Member fixture |
| Later record changes in the Account & Billing working tree | A changelog entry and a session log were written after the tested copy was pinned. Records only. Resolved by the fresh manifests in the next round |

**Routing:** F36 goes to RWO-01 add-on A2-1 under AM-23. The Q2 and Q4 results and first failures above are historical evidence.

## Confirmed A2 automation — walkthrough 05 pending

The A2 entry comparison pins 233 unchanged OwedBook source/test files and all 216 Portal source/test files against Q4. Only HelpPage.tsx and its test differ. Q4 remains the evidence for unchanged behavior. All prior results and rulings remain above.

| Clause | Q2 and Q4 history | A2 evidence |
|---|---|---|
| AC-B07 / AC-B08 | Q2 FAIL. Q4 FAIL on F36 only, per Friday. | {'PASS': 36} of 36 targeted article samples. Lowest measured 4.5285:1. White surfaces behind the green underlined links. Friday disposes F36. |
| AM-23 / A2-1 | New Help design replaces A1-2. | Structure: {'PASS': 30}. Mouse: {'PASS': 90}. Article focus and Enter: {'PASS': 386, 'FAIL': 4}. Settled Firefox keyboard failures: 2. |
| A2-2 | Q4 outline ambiguity. | Menu controls: {'PASS': 156}. Billing Add: {'PASS': 3}. Profile: {'PASS': 3}. |
| AC-H01 / AC-H02 / AC-H03 | Q2 adjudicated passes. Q4 accepted unavailable pure active Member. | Menus: {'PASS': 6}. Forbidden terms and labels: {'PASS': 6}. App links: {'PASS': 12}. Owner and Store admin covered. |
| AC-R01 / AC-R02 / AC-R03 | Q2 and Q4 suite, build and path checks retained. | Both clean installs, both unit suites, typecheck, lint and labelled production builds pass. No protected A2 delta. Post-commit exact binding waits for Tony. |

Detailed coverage, first interruptions, exactly-once instrument measurements and timing are in evidence/Q4/A2. W-09 and W-10 await the Director.

## Q2, Q4, A2 and A3 confirmation by criterion and journey

Q2 and Q4 rows retain their original scope. Friday’s subsequent rulings appear in the Q4 column where applicable. The A2 and A3 per-path proofs are in evidence/Q4/{A2,A3}/entry-comparison.json. A carried result keeps every earlier qualification and Gate D deferral. A3 run evidence is in evidence/Q4/A3/automation-summary.json and the named raw files.

| Criterion or journey | Q2 | Q4 | A2 | A3 |
|---|---|---|---|---|
| AC-V01 | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-B01 | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-B02 | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-B03 | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-B04 | PASS | Partial observations in the full rerun. Scripts-disabled interruption retained in Q4/03. Full forced-light campaign outside the Q4 repair scope. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-B05 | FAIL | PASS, per Friday. Round decorative pill accepted. | Store admin initials avatar identified in one dashboard load. | Carry earlier scope and disposition. |
| AC-B06 | FAIL | PASS, per Friday. Corrected probe and one timeout retained. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-B07 | FAIL | FAIL on F36, per Friday. | 36/36 links meet the surface rule. F36 measured separately from F37. | 36 PASS |
| AC-B08 | FAIL | FAIL on F36, per Friday. | 36/36 F36 samples pass. Two Chromium Invite captures retain unmeasured text ranges. | Rendered link contrast: 36 PASS. Minimum 4.5285:1. |
| AC-B09 | PASS on what was observed | Partial observations in Q4/03 and truthful-state runs. Payment-specific states remain at Gate D. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-L01 | PASS on what was rendered | Partial public shell observations in Q4/02–03. Registration review remains deferred. No repeat of the full layout campaign. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-L02 | Finish at retest | PASS on the mock layout, per Friday. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-L03 | PASS | Help navigation spot-checked under R-02 and core. No complete Add Pharmacy journey in Q4. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-L04 | FAIL | PASS, per Friday. | No overflow in 30/30 Help positions. | Help geometry and horizontal overflow: 18 PASS |
| AC-L05 | PASS on what was observed | PARTIAL. Read-error stub, observed loading/empty content, and role denial kept truthful in completed probes. See Q4/04/core.json and Q4/05/settled-read-diagnostics.json. Unobserved states remain listed. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-N01 | PASS | PASS on observed changed screens and labels. Q4/02 and Q4/04/core.json. Full original source inventory retained from Q2. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-N02 | PASS | PASS on pinned master hashes and observed logo presence. Q4/04/core.json. Original derived asset checks remain in Q2. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-H01 | PASS | PASS functional checks as observed for available roles, including the menu and end-link behavior. Pure active Member blocked. W-04 separately passed by Director report; F36 records a visual link failure. Q4/02, Q4/04 and Q4/06. | Placement and anchor walk passed. F37 found with article 1 Enter in Firefox at desktop sizes. | 468/468 post-input activation cases pass. Menu destinations: 6 PASS. See automation-summary.json for missing/incomplete cells and first observations. |
| AC-H02 | PASS | PASS observed Help forbidden-term and content checks on supported roles. Pure active Member blocked. Q4/04/core.json. | Help forbidden-term checks passed for Owner A and Store admin. | 6 PASS |
| AC-H03 | PASS | PARTIAL. Owner and Store admin links, wrong-store and billing scope checks recorded. Pure active Member blocked, one removed-role landing row incomplete. Q4/04/core.json and Q4/05/settled-read-diagnostics.json. | Role-specific Help app links passed. Pure active Member fixture unavailable, accepted limit. | Carry earlier scope and disposition. |
| AC-F01 | PASS | PASS for observed Owner A, Store admin, Invitee mixed role and removed Member. Zero-store placeholder was disabled only for the zero-store fixture. Pure active Member blocked. Q4/04/core.json. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-F02 | PASS, bounded record | PASS, per Friday. One extra Firefox route was incomplete. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-F03 | PASS | PASS of observed landing-page navigation across 21 engine-width combinations, including the released CTA ruling. Q4/02/read-only-diagnostics.json. W-02 separately passed by Director report. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-R01 | PASS | PASS. Clean lockfile install and 60 suites / 408 tests for OwedBook, 37 suites / 588 tests for Portal. Q4/01. | 408 OwedBook and 588 Portal unit tests passed. | 409 OwedBook and 588 Portal unit tests passed. |
| AC-R02 | PASS | PASS. Both typechecks, lint and fresh production builds exited 0. Q4/01 and Q4/RESTARTS. | Both clean installs, typechecks, lint and builds passed. | Both clean installs, typechecks, lint and labelled builds passed. |
| AC-R03 | PASS | PASS on pinned repair paths, with AM-22(3) records insertion. End-of-walkthrough Portal records drift is documented. Post-commit exact equivalence is pending. See Q4/01 and Q4/06/closeout-live-identity.json. | Only OwedBook Help and its tests changed in source. Record delta pinned. | Two OwedBook source/test paths differ from A2. No Portal source/test or protected path differs. |
| AC-R04 | Payment decision pending in Q2 | PARTIAL regression only. See ten journey rows below. Four payment portions transferred to Gate D under AM-21. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-R05 | Payment decision pending in Q2 | PASS for rendered public plan prices $99.00 and $49.00. Review screen deferred to Gate D under AM-21. First loading-state read and settled diagnosis are in Q4/05. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-R06 | PASS | PASS within recorded Q4 effects. SCRATCH verified, sanctioned fixture accounts only. No rehearsal account activity recorded. Q4/06/EFFECTS_FINAL.md. | 14/20 sign-in attempts. Owner B reserved. | 11/15 automated sessions, 0 Portal page loads. |
| AC-E01 | PASS | Outside Q4 scope. See the preserved Q2 row and Friday’s adjudication. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-E02 | Gate D | Gate D. Outside Q4 scope. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-E03 | PASS source. Deployment record at Gate D. | Source decision remains as ruled in Q2. Deployment record remains at Gate D. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-E04 | Gate D | Gate D. Outside Q4 scope. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-D01 | Gate D | Gate D. Outside Q4 scope. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-D02 | Gate D | Gate D. Outside Q4 scope. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| AC-P01 | PASS | PASS on four repaired labels listed and observed in Q4/04/core.json. Full original label inventory in Q2. | Updated Help label placement checked in both roles. | 6 PASS |
| J-a | PASS (Director reported) | Outside Q4 scope. Emailed links were excluded. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-b | BLOCKED (hosted billing return incomplete) | Local handoff, return, same identity and refusal passed independently in Q4/04/core.json and by Director report W-01. Hosted part at Gate D under AM-21. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-c | BLOCKED | Gate D under AM-21. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-d | BLOCKED | Gate D under AM-21. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-e | PASS | Outside Q4 scope. Invitation and acceptance were excluded. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-f | PASS | Role and wrong-store denial plus restricted API payload checks observed in Q4/04/core.json and Q4/05/settled-read-diagnostics.json. Pure active Member blocked. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-g | BLOCKED | Gate D under AM-21. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-h | PASS | Existing removed Member and zero-store state observed in Q4/04/core.json. Member removal outside Q4 scope. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-i | PASS | Outside Q4 journey scope. Read-only audit route reached HTTP 200 during F22 in Q4/05. Full Q2 paging/filter sequence not repeated. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |
| J-j | PASS (Director reported) | Sign-out and local protection exercised in Q4/04/core.json and Director W-01. Email-link reuse/freshness excluded. | Carry earlier scope and disposition. | Carry earlier scope and disposition. |

## A3 scripts-off qualification and final effects

468 of 468 centered activations passed. All four exact Firefox reproduction positions passed. The additional Chromium Owner A session confirmed native navigation on rendered Help after page scripts were disabled. From scroll position 6803, the last article link returned to zero with the header visible at all five samples through 2000 ms. On a cold load with scripts disabled, the response contained all 13 links under a hidden ancestor and the last link had no layout box. A reader could not use those links on that cold load. Friday should adjudicate cold-load accessibility separately from the native link and F37. Two earlier cold-load attempts remain recorded. Evidence: evidence/Q4/A3/chromium-no-script-rendered.json. Final automation effects: 12/15 SCRATCH sign-in attempts, 12 sign-outs HTTP 200, zero Portal document loads. The read-only build-info check verified the pair again in served-ready.json. W-09 and W-10 remain pending.

## Final Director evidence, separate from automation

Director-reported W-09 PASS and W-10 PASS. Neither check time was supplied. W-09 heading appearance was not described separately. The verbatim manual record is evidence/Q4/A3/DIRECTOR_WALKTHROUGH_05.md.

## Issued dispositions · Friday, QA Lead · 28 November 2026

Transcribed from sections 4, 6 and 7 of HANDOFFS/QAM_CERTIFICATION_ABM007_FINAL_GATE_Q_2026-11-28.md.

## 4. Criteria

Thirty-six criteria. Four belong to Gate D and are not judged here: AC-E02, AC-E04, AC-D01, AC-D02.

| Result | Criteria |
|---|---|
| **PASS** (30) | AC-V01, B01, B02, B03, B04, B05, B06, B07, B08, B09, L01, L02, L03, L04, L05, N01, N02, H01, H02, H03, F01, F02, F03, R01, R02, R03, R06, E01, E03 (source part), P01 |
| **PASS for the part that can run locally; the rest moved to Gate D** (2) | AC-R04, AC-R05 |

**AC-R04, ten journeys.** Six pass: J-a, J-e, J-f, J-h, J-i, J-j, with the app-to-app part of J-b. **Moved to Gate D:** J-c (register through Stripe Checkout), J-d (buy an extra pharmacy), J-g (schedule a removal and undo it), and the Stripe billing return of J-b.

**AC-R05, prices.** Source values and the public plan screen pass ($99.00 and $49.00). **Moved to Gate D:** the price on the review screen, which is reached only inside J-c.

Unit suites on the certified pair: OwedBook 409 of 409, Account & Billing 588 of 588. Typecheck, lint and production builds clean in both.

## 6. Known risks and limits

| # | Risk or limit | Where it is settled |
|---|---|---|
| 1 | **Payment journeys not run on this candidate:** J-c, J-d, J-g, the Stripe return of J-b, and the review-screen price. The payment code is byte-identical to the baseline (AC-R03); what is unproven is that the restyled purchase screens click through | **Gate D, blocking.** The Director runs them on alpha on one new throwaway tester account with sandbox test payments (AM-21) |
| 2 | Finding F02, open, High: the QA setup shares a Stripe sandbox with alpha and cannot receive Stripe events | Environment gap. Carried to the Architect; not a product defect |
| 3 | No real phone was used. The iPhone overflow was reproduced and fixed at 320 wide on desktop engines only | Gate D, on the Director's iPhone: Billing & subscription, the dashboard, one dropdown |
| 4 | Member-only screens were not retested after the repairs, because the Member test account was removed in Q2 as planned. The repaired pieces are shared by all roles and passed for Owner and Store admin | Accepted limit. A Member look at Gate D if the alpha account has one |
| 5 | Some states were never observed (a few loading, error and payment-only statuses) | Accepted. No hardcoded color exists in source, so they draw from the same tokens |
| 6 | The dark green link on white measures 4.53 to 1 against a 4.5 minimum. It passes, with little margin | Noted for the Architect: a brand-token question, not a defect |
| 7 | The forced-light check was done on Ubuntu Chrome, not Windows | Optional Windows look at Gate D |
| 8 | After "Go to the Top" by keyboard, the Help heading shows a white focus outline. Intended | The Director saw it and passed W-09 |

## 7. Findings at certification

| Finding | Final disposition |
|---|---|
| F03, F04, F18, F21, F27 | Product defects. Repaired and retested. **Closed** |
| F28, F29, F31 | Director-ordered changes. Delivered and retested. **Closed** (F29 superseded by ruling AM-23) |
| F36, F37 | Product defects found in retest. Repaired and confirmed. **Closed** |
| F30 | Dropdown placement in Chrome's phone emulation. Observation. Real-phone look at Gate D |
| F38 | With scripts already switched off, a fresh load shows no Help content. **Not a defect of this module.** The whole signed-in app needs scripts, and no criterion asks otherwise. The check was the QA Lead's own extra. Observation to the Architect |
| F02 | **Open, High**, environment. See risk 2 |
| F15, F26 | QA fixture defect (deleted sandbox customers). Not product. Carried with risk 1 |
| F20 | Fixture sign-in setup timeouts. Test environment. Closed for this module, flagged to the Architect |
| F33, F34, F35 | Follow-up findings outside this module. Owner: the Architect |
| F01, F05 to F14, F16, F17, F19, F22 to F25, F32 | Test tooling, test setup or the QA Lead's own plan errors, corrected during the run. **Closed.** First failures kept |

In the final confirmation, the rows still marked FAIL are the first Firefox timing attempt (the clock started too early) and cases where the tool parked a link at the very edge of the window. The corrected runs pass. Instrument, first failures kept.

