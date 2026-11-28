# FINDINGS — `ABM007_FINAL`

**Owner:** QA Executor records and proposes; QA Lead dispositions; Architect and Director route repair · **Written:** Q2 onward · **Status: Q2 COMPLETE — AWAITING ADJUDICATION. Dispositions remain QA Lead-owned.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

## 1. Register

| ID | Title | Severity (proposed) | Classification (proposed) | AC | QA Lead disposition | Route | Source |
|---|---|---|---|---|---|---|---|
| ABM7F-F01 | Missing bundled Chromium at first readiness launch | Medium | instrument issue | readiness | Closed for Q1 by Friday | QA tooling | automated |
| ABM7F-F02 | Shared-sandbox no-write isolation not established | High | environment / contract gap | R04 paid paths | Open, High under Friday’s binding | Director / Architect | automated |
| ABM7F-F03 | Button height, radius and typography depart from the required scale | Medium | acceptance failure (proposed) | AC-B05, AC-B06, AC-L04 | PENDING | Friday adjudication | automated |
| ABM7F-F04 | OwedBook busy Login lacks aria-busy | Medium | acceptance failure (proposed) | AC-B06 | PENDING | Friday adjudication | automated |
| ABM7F-F05 | Initial email-template comparator missed redirect directives | Low | instrument issue | AC-E01 | PENDING | QA tooling | automated |
| ABM7F-F06 | Mock build dependency symlink outside Turbopack root | Low | setup issue | mock mode | PENDING | QA tooling | automated |
| ABM7F-F07 | Unbounded Firefox scripts-disabled font wait | Medium | instrument issue | AC-B03/B04 instrument | PENDING | QA tooling | automated |
| ABM7F-F08 | Route runner terminated with signal 143 | Medium | environment / instrument interruption | browser matrix | PENDING | QA execution | automated |
| ABM7F-F09 | Supplemental probe sampled SPA early and assumed a main element | Medium | instrument issue | H03 / read-only journeys | PENDING | QA tooling | automated |
| ABM7F-F10 | Chromium Store-admin navigation timed out | Medium | navigation interruption; cause unresolved | H03 / CR-05 | PENDING | Friday adjudication | automated |
| ABM7F-F11 | Q1 audit short-history count omitted account rows | Medium | QA fixture/recon gap | R04(i) extra boundary | Recon correction by Friday | Friday | automated |
| ABM7F-F12 | Bound O-1 Store-admin route requires an Owner-only control | Medium | plan/contract gap | AC-F02 | Plan defect by Friday | Friday / Tony | automated |
| ABM7F-F13 | Public hover probe waits for disabled pointer events | Low | instrument issue | B06/B08 | PENDING | QA tooling | automated |
| ABM7F-F14 | Handoff probe selected a dashboard-only return button on Billing | Low | instrument issue | R04(b,j) | PENDING | QA tooling | automated |
| ABM7F-F15 | Single billing opening did not reach the hosted page within 30 seconds | Medium | incomplete journey; cause unresolved | R04(b) | PENDING | Friday / Tony | automated |
| ABM7F-F16 | Initial favicon comparator used an unsupported resize assumption | Low | instrument issue | N02 | PENDING | QA tooling | automated |
| ABM7F-F17 | Raster text calibration initially ignored per-channel LCD coverage | Low | instrument issue | AC-B08 | PENDING | Friday / QA tooling | automated |
| ABM7F-F18 | Disabled OwedBook profile fields render below required contrast | Medium | acceptance failure proposed | AC-B08 | PENDING | Friday / QA tooling | automated |
| ABM7F-F19 | Some raster contexts remain unmeasured or need instrument qualification | Medium | instrument/evidence gap | AC-B08 | PENDING | Friday / QA tooling | automated |
| ABM7F-F20 | Portal fixture confirmation setup timed out once | Medium | environment/instrument unresolved | Session-dependent coverage | PENDING | Friday / Cody evidence | automated |
| ABM7F-F21 | Profile support link inherits muted gray | Medium | proposed contract mismatch | AC-B07 | PENDING | Friday | automated |
| ABM7F-F22 | Read-only OwedBook navigation timeouts during continuation | Medium | unresolved environment/instrument/product | O-1; rendered coverage | PENDING | Friday | automated |
| ABM7F-F23 | Mock Admin fixture prerequisite absent | Medium | QA expectation / fixture gap | Mock mode | PENDING | Friday | automated |
| ABM7F-F24 | Runtime labels cannot replace compiled build-info labels | Low | QA identity instrument | Runtime provenance | PENDING | Friday | automated |
| ABM7F-F25 | Bundled Chromium absent at J-e startup | Low | instrument availability | J-e setup | PENDING | Friday adjudication | automated |
| ABM7F-F26 | Separate Director billing error and deleted sandbox customer links | High | QA fixture/environment gap proposed | J-b | PENDING | Friday adjudication | Director, unplanned action |
| ABM7F-F27 | Portal Sign in wraps and footer links break at 768px | Medium | responsive visual defect proposed | HC-04 / AC-L04 | PENDING | Friday adjudication | Director walkthrough |
| ABM7F-F28 | OwedBook public opening-page entry and button color requests | Medium | follow-up change request pending Director scope | HC-04 extra local exploration / open ruling | PENDING | Friday adjudication | Director, unplanned action |
| ABM7F-F29 | Mandatory Help return-to-top navigation request | Medium | follow-up enhancement | HC-08 / AC-H01 | PENDING | Friday adjudication | Director walkthrough |
| ABM7F-F30 | Dropdown placement differs in Chrome device emulation | Medium | observation; cause unresolved | HC-04 supplemental local exploration | PENDING | Friday adjudication | Director walkthrough |
| ABM7F-F31 | Deployed-alpha iPhone billing Add store overflow | Medium | supplemental deployed observation | Alpha only / candidate comparison AC-L04 | PENDING | Friday adjudication | Director, unplanned action |
| ABM7F-F32 | Ubuntu dark-flash observation and walkthrough provenance limits | Low | human scope and evidence qualification | HC-05 / AC-B04 and walkthrough provenance | PENDING | Friday adjudication | Director walkthrough |
| ABM7F-F33 | Additional shared controls retain 50% disabled opacity | Low | follow-up finding | Outside this module | PENDING | Architect | automated |
| ABM7F-F34 | Disabled password reveal icon retains the half-opacity style | Low | follow-up finding | Outside this module | PENDING | Architect | automated |
| ABM7F-F35 | OwedBook Store selector uses native disabled appearance | Low | follow-up finding | Outside this module | PENDING | Architect | automated |
| ABM7F-F36 | Help end link on ice misses link and contrast rules | Medium | acceptance failure proposed | AC-B07 / AC-B08 | PENDING | Friday adjudication | automated |

IDs: `ABM7F-Fnn`, never reused.

## 2. Required fields for every finding

Each finding gets its own section with all sixteen fields. A field that does not apply says so; it is not left out.

1. ID
2. Title
3. Module and candidate pair
4. Severity: Critical, High, Medium, Low (by impact, not by effort)
5. Classification: acceptance failure, regression, environment or setup issue, instrument issue, contract gap, proven pre-existing defect, follow-up finding, architecture enhancement, observation
6. Environment: repository, build, target, browser and version, viewport
7. Preconditions: role, fixture, data state
8. Exact reproduction, numbered steps
9. Expected result, and the contract clause it comes from
10. Actual result
11. Evidence paths
12. Suspected cause, only if labelled INFERENCE
13. Scope impact: inside this module, or outside it
14. Gate impact: blocks Gate Q, blocks Gate D, or neither
15. Owner
16. Retest requirement

## 3. Severity rules

- **Critical:** always blocks. Wrong access to another pharmacy's data, privilege escalation, broken payment, wrong price, destructive write.
- **High:** normally blocks. A security, privacy, money, tenant-isolation or data-integrity High blocks unless the Director accepts a tightly contained risk in writing.
- **Medium:** may ship only with impact understood, a workaround or containment, an owner and a scheduled follow-up.
- **Low:** may ship when documented.

## 4. Scope protection

A real defect found outside this module's criteria is recorded as a follow-up finding with its own owner. It does not fail a criterion it does not belong to, and it is never hidden. A pre-existing defect needs evidence that it exists at the baseline.

## 5. Dispositions (QA Lead only)

| Finding | Disposition | Date | Reason |
|---|---|---|---|
| none | | | |

**Friday, QA Lead, 26 November 2026. Section 5 transcribed verbatim.**

| Finding | What it is | My disposition | Goes to |
|---|---|---|---|
| F01, F25 | Test browser missing at start | Test tooling. Closed | — |
| F02 | Shared Stripe sandbox: QA cannot prove it leaves the alpha database alone | **Open, High.** Environment gap, not a product defect | Section 7 |
| F03 | Some buttons smaller or squarer than the contract | **Product defect**, in part. See section 6.3 for what is and is not a defect | R-06, R-09 |
| F04 | OwedBook Login button does not announce "busy" | **Product defect** | R-03 |
| F05, F07, F09, F13, F14, F16, F17 | Test instrument mistakes, corrected during the run | Test tooling. Closed. First failures kept | — |
| F06 | Mock build setup | Test setup. Closed | — |
| F08 | Test runner was killed once | Test environment. Closed | — |
| F10 | Navigation timeouts in an early probe | Test instrument race. Corrected probe passed in all three engines. Closed | — |
| F11 | My extra audit check used a wrong count | My recon error, corrected. Owner B check passed. Closed | — |
| F12 | Bound plan sent the Store admin to an Owner-only button | **My plan defect.** Fixed by Q2-A1. Closed | — |
| F15, F26 | Billing page would not open on Stripe | **QA fixture defect.** The two SCRATCH owners point at Stripe customers that were deleted in the sandbox. The billing code is identical to the baseline. Not a product defect | Section 7 |
| F18 | Greyed-out Profile fields too faint (about 2.43 to 1) | **Product defect** | R-04 |
| F19 | Some contrast spots could not be measured (thin arrows, text behind an open dialog) | Instrument limit. Accepted with the gap list kept | Retest covers the repaired controls |
| F20 | Fixture sign-in timed out a few times | Test environment, cause unknown. Open as a watch item | Retest captures more detail |
| F21 | Profile support link is grey, should be dark green | **Product defect** | R-05 |
| F22 | OwedBook page timed out three times under test | **Unresolved.** Not proven to be the product or the tooling | Retest reruns those three with full capture |
| F23 | Mock build: Admin pages need a role the fixtures lack | Wrong test expectation. Closed. Mock Admin is not a criterion | — |
| F24 | QA builds were not labelled with their build info | Test setup. Identity was proven by source hashes instead. Closed. Label the retest builds | Retest |
| F27 | Account & Billing sign-in: "Sign in" wraps and footer breaks at 768px | **Product defect**, Director walkthrough | R-08 |
| F28 | Opening page: "Subscribe Now" and navy "Log in" | **Director-ordered change** (your ruling of 26 November) | R-01 |
| F29 | Help: "Go to the Top" link | **Director-ordered addition**, mandatory | R-02 |
| F30 | Dropdowns look misplaced only in Chrome's phone-emulation mode | **Observation, no repair.** See section 6.4 | Gate D phone look |
| F31 | iPhone: "Add store" runs off the screen, page slides sideways | **Director-ordered item**, verify first. See section 6.5 | R-07 |
| F32 | HC-05 done on Ubuntu, not Windows; small gaps in walkthrough timestamps | Accepted. Closed | — |

## 6. Repair routing (only after Q2 is completely finished)

QA Lead disposition, then the Architect's bounded repair instruction, then the Engineer repairs the ruled paths on `qa/abm007-final`, then the Director commits, then the Executor re-pins and retests. Nobody retests before the commit.

| Finding | Repair instruction reference | Repair commit (Director) | Retest scope | Retest result |
|---|---|---|---|---|
| none | | | | |

RWO-01 and add-on A1 were issued by Friday on 26 November under AM-20. Covered repair findings F03, F04, F18, F21, F27, F28, F29 and F31. The decided follow-ups and test gaps remain as ruled in section 5. Tony defers the records and repair commit until after Q4 and his walkthrough.

## Amendment 01 additions

1. Every finding records one additional field, **Source**: automated, or Director walkthrough.
2. Findings from both sources are kept in this one register. A pass from one source does not close a failure from the other.
3. After adjudication there is one consolidated repair work order for the Engineer.

| Repair work order reference | Findings included | Issued by, date |
|---|---|---|
| RWO-01 + A1 | F03, F04, F18, F21, F27, F28, F29, F31 | Friday, QA Lead, 26 November 2026 under AM-20 |

## ABM7F-F01

1. ID: ABM7F-F01
2. Title: Missing bundled Chromium
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: instrument issue.
6. Environment: local QA production copies; SCRATCH; Q1 source/readiness, no viewport claim.
7. Preconditions: authorized R-1/R-2 Q1; existing cast only.
8. Reproduction: (1) inspect cited command/source; (2) compare expected guard/readiness contract; no side-effect rerun.
9. Expected: Browser launch succeeds for selected instrument; first failure retained.
10. Actual: Initial launch failed before sign-in; installed Chrome diagnostic launch passed and four bounded sessions/signouts succeeded.
11. Evidence: evidence/Q1/02/session-first-failure.txt; session-probes.json.
12. Cause: no product cause inferred.
13. Scope: Q1 readiness; no product repair undertaken.
14. Gate impact: engine-specific coverage must validate before use.
15. Owner: Cody.
16. Retest: validate each selected engine before campaign.
Source: automated (readiness/source inspection), not Director walkthrough.

## ABM7F-F02

1. ID: ABM7F-F02
2. Title: Shared sandbox receipt writes before foreign classification
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: High.
5. Classification proposed: environment / contract gap.
6. Environment: local QA production copies; SCRATCH; Q1 source/readiness, no viewport claim.
7. Preconditions: authorized R-1/R-2 Q1; existing cast only.
8. Reproduction: (1) inspect cited command/source; (2) compare expected guard/readiness contract; no side-effect rerun.
9. Expected: PF-4.7 proves both directions cannot change opposite database before paid execution.
10. Actual: One alpha endpoint enabled; candidate webhook inserts durable receipt before foreign classification; deployed alpha source binding and remote listeners not established.
11. Evidence: evidence/Q1/02/readiness.json; listener-read.json; source src/server/webhook.ts:59 and :229.
12. Cause: no product cause inferred.
13. Scope: Q1 readiness; no product repair undertaken.
14. Gate impact: paid Q2 rows blocked; unaffected read-only work continues.
15. Owner: Tony / JARVIS.
16. Retest: re-prove both directions after explicitly authorized resolution.
Source: automated (readiness/source inspection), not Director walkthrough.

## QA Lead dispositions — 24 November 2026, Q1 return 02

Transcribed by Cody on Tony’s express instruction. Source: Friday’s decision §6.

**ABM7F-F01, bundled Chromium missing at first launch.** Disposition: instrument issue, accepted. The first failure is kept. Installed Chrome is the stakeholder's own browser, so using it is sound. Closed for Q1; amendment A-6 covers the other engines.

**ABM7F-F02, shared Stripe sandbox, isolation not proven.** Disposition: open, High, environment and contract gap. It blocks only the journeys that make the payment provider send events: J-c, J-d and J-g. It does not block anything else.

The QA Lead does not adopt a new routing filter: protected payment-code work would require its own assignment. No such change is planned in this module.

## ABM7F-F03

1. ID: ABM7F-F03.
2. Title: OwedBook password-visibility control is below the minimum height.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: acceptance failure.
6. Environment: SCRATCH production build on localhost:3100; Chromium 147.0.7727.15; 375×900.
7. Preconditions: signed out, no fixture credentials entered.
8. Reproduction: (1) open /auth at 375px; (2) measure the password-visibility button bounding rectangle using the validated measurement instrument.
9. Expected: AC-B06 buttons have minimum height 44px. AC-L04 requires phone-width primary controls at least 44px.
10. Actual: password-visibility button 32×32px, radius 4px. Email/password fields also measured 42px high; those are retained separately for clause applicability review.
11. Evidence: evidence/Q2/01/browser-controls.json radius-target control; evidence/Q2/02/0000.json.
12. Cause: not asserted; no repair attempted.
13. Scope: presentation within module.
14. Gate impact: unmet acceptance measurement submitted to Friday; no verdict issued.
15. Owner: Friday for adjudication; repair routing only after Q2.
16. Retest: original control at phone and desktop widths plus nearby auth controls, after an authorized repair candidate if ruled.
Source: automated. First observation retained; subsequent matrix measurements are planned coverage, not a hidden retry.

## ABM7F-F04

1. ID: ABM7F-F04.
2. Title: OwedBook busy login button has no aria-busy or progress wording.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: acceptance failure.
6. Environment: SCRATCH-bound production build; Chromium 147.0.7727.15; 375×900; explicit intercepted POST state test, no provider request.
7. Preconditions: signed-out password form; designated cast input in memory only; all POST requests stubbed before submission.
8. Reproduction: (1) hold the password request in a route stub; (2) double-click Login; (3) inspect busy button before releasing a synthetic 503 error.
9. Expected: AC-B06 requires progress wording and aria-busy as well as spinner and duplicate-submit guard.
10. Actual: one intercepted request; disabled button; aria-busy absent and label stays Login. A separate sibling Spinner exists in source: the instrument’s descendant-only spinner=false is not claimed as absence of the page spinner. Portal positive comparison has aria-busy=true, progress wording and descendant spinner.
11. Evidence: evidence/Q2/04/states.json; OwedBook src/components/auth/LoginForm.tsx lines 147–155.
12. Cause: INFERENCE from source: button sets disabled only and has fixed Login text.
13. Scope: in-module presentation/state semantics.
14. Gate impact: unmet criterion submitted for Friday adjudication, no verdict.
15. Owner: Friday for adjudication; no repair during Q2.
16. Retest: original held-request busy state and neighboring disabled/error states on any later authorized repair.
Source: automated. No real sign-in attempted or automatically retried by this state test.

## ABM7F-F05

1. ID: ABM7F-F05.
2. Title: Initial email-template comparator missed redirect-directive mutations.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Low.
5. Classification proposed: instrument issue.
6. Environment: offline Q2 source probe; no browser or target request.
7. Preconditions: engineering original/amended email-template files read locally.
8. Reproduction: (1) mutate .RedirectTo in an in-memory template copy; (2) initial comparator scans only href values; (3) failing control saved before any dependent result.
9. Expected: AC-E01 negative control flags a change to link construction.
10. Actual: control failed; QA-only comparator amended to include template directives. Diagnostic rerun passed mutation and clean controls; dependent document results recorded only afterwards.
11. Evidence: evidence/Q2/03/document-controls-first-failure.json; doc-checks-first-failure.py.txt; document-controls.json; document-results.json.
12. Cause: initial comparator’s scope too narrow.
13. Scope: QA instrument only; no product change.
14. Gate impact: no result relied on the failed version; Friday adjudicates disposition.
15. Owner: Cody.
16. Retest: corrected passing/failing controls completed offline; retain them with helper.
Source: automated.

### Supplemental observations for F03/F04

Portal password-visibility control also measured 32×32px in evidence/Q2/04/states.json. F03 originally arose on OwedBook and its first evidence stays unchanged. OwedBook’s sibling Spinner contains sr-only Loading... text (src/components/common/Spinner.tsx); F04 specifically reports the button’s missing aria-busy and fixed visible label, not absence of page-level progress text.

## ABM7F-F06

1. ID: ABM7F-F06.
2. Title: Initial isolated mock build could not resolve linked Next package.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Low.
5. Classification proposed: setup issue.
6. Environment: isolated /tmp/abm007-final-cody-q2/mock-ob, production mock build, no server/session.
7. Preconditions: exact candidate export, node_modules linked to the separately clean-installed Q2 OwedBook dependencies.
8. Reproduction: (1) build that isolated copy; (2) Turbopack refuses Next resolution outside its detected filesystem root.
9. Expected: separate mock build available for the mode-boundary check.
10. Actual: initial exit 1. Local dependency copy replaces only the QA symlink; diagnostic build exit 0. Real builds kept serving throughout. Runtime mock checks not yet performed.
11. Evidence: evidence/Q2/01/mock-build.log, mock-build.json, mock-build-diagnostic.log, mock-build-diagnostic.json.
12. Cause: external symlink outside Turbopack root, per preserved build error; no product source/configuration correction.
13. Scope: QA setup.
14. Gate impact: runtime mock coverage remains pending; no pass inferred from build.
15. Owner: Cody.
16. Retest: diagnostic rebuild complete; retain original failure and distinct diagnostic outcome.
Source: automated.

### F03 additional planned-matrix measurements

The same independent measurement instrument also recorded Portal password visibility at 32px high / 4px radius (evidence/Q2/02/0091.json), public menu buttons at 15px text (0007.json and 0091.json), and an OwedBook data-view button at 32px high, 4px radius, 14px text and weight 500 (0232.json). AC-B05 specifies 8px for buttons; AC-B06 specifies 44px minimum and Inter Regular 16px. These are proposed manifestations of the same control-scale finding; repeated observations across widths are not counted as distinct defects. First evidence and all later measurements remain intact.

## ABM7F-F07

1. ID: ABM7F-F07.
2. Title: Firefox scripts-disabled font-readiness wait stalled the route runner.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: instrument issue; browser font readiness remains an observation, not a product diagnosis.
6. Environment: Firefox 148.0.2, scripts disabled, OwedBook public /auth, SCRATCH-bound production build.
7. Preconditions: signed out; completed Chromium matrix signed out before this probe.
8. Reproduction: (1) navigate /auth in scripts-disabled Firefox; (2) await document.fonts.ready without timeout; (3) runner stops advancing after 18:50:52 BDT checkpoint.
9. Expected: bounded completion or recorded incomplete result, never an indefinite wait or a false pass.
10. Actual: runner stopped at 18:53 BDT; first interrupted row retained INCOMPLETE. Diagnostic resume adds a two-second readiness bound and records false separately. Completed rows skipped; no sign-in retried.
11. Evidence: evidence/Q2/02/0610-first-interruption.json; journal-before-font-timeout.json; routes-initial-source.mjs.txt; routes-resume.mjs in AUTOMATION/Q2.
12. Cause: INFERENCE: font-ready Promise not settling with scripts disabled in Firefox; missing instrument timeout confirmed from source.
13. Scope: QA instrument; no product repair.
14. Gate impact: affected font evidence cannot be counted as pass; other completed measurements retained. This is separate from O-1 navigation reproduction.
15. Owner: Cody for bounded execution; Friday for adjudication.
16. Retest: diagnostic resume limited to unfinished rows; initial incomplete result remains.
Source: automated.

## ABM7F-F08

1. ID: ABM7F-F08.
2. Title: Resumed route runner exited 143 during WebKit Owner coverage.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: environment/instrument interruption; cause not established.
6. Environment: WebKit 26.4; Owner A OwedBook; 1440px; real SCRATCH production build.
7. Preconditions: matrix in progress; last completed row /admin-portal/billing.
8. Reproduction: observed once, not intentionally repeatable; exec session returned exit 143 and runner process was absent.
9. Expected: route result and cleanup recorded; interrupted routes never pass.
10. Actual: next navigation unfinished and original Owner A sign-out unrecorded. All previous rows retained. Explicit short diagnostic resumes only remaining rows; adds new sessions because the prior sign-in succeeded (no failed sign-in retry). Provider-wide sign-out is recorded to cover the interrupted session.
11. Evidence: evidence/Q2/02/signal143-first-interruption.json; journal-before-signal143.json; journal.json; AUTOMATION/Q2/routes-finish.mjs.
12. Cause: unknown; no product fault or WebKit navigation bug inferred from shell signal alone.
13. Scope: QA execution; real servers remained listening throughout.
14. Gate impact: original route incomplete; diagnostic outcome separate. This is not O-1.
15. Owner: Cody for evidence/cleanup; Friday adjudicates.
16. Retest: remaining rows only, bounded execution; initial interruption retained.
Source: automated.

## ABM7F-F09

1. ID: ABM7F-F09.
2. Title: Read-only journey probe needed terminal-navigation waits and correct scope selectors.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: instrument issue.
6. Environment: Chromium 147.0.7727.15, SCRATCH OwedBook production copy, designated Member/Admin/Owner A.
7. Preconditions: signed-in read-only Help navigation, no business changes.
8. Reproduction: click Help links, sample old document load-state immediately; foreign-store text locator assumes main element.
9. Expected: wait for the ruled terminal URL and inspect the actual denial component.
10. Actual: initial /help readings are premature, not role-route passes or product failures. Admin denial inspection times out on main locator. V2 waits for the expected URL, uses access-denied marker and body text where appropriate, and waits for observed audit-row growth. Initial records remain INCOMPLETE for affected assertions.
11. Evidence: evidence/Q2/06/chromium-readonly-journeys.json; journeys-readonly-v1-source.txt; SPA_TIMING_FIRST_FAILURE.md.
12. Cause: instrument timing and selector assumptions, source confirmed.
13. Scope: QA tooling; product unmodified.
14. Gate impact: no dependent acceptance pass from v1; unaffected anchors/menu observations separately retained.
15. Owner: Cody; Friday adjudicates disposition.
16. Retest: explicit diagnostic on corrected waits; no failed sign-in or business effect automatically retried.
Source: automated.

## ABM7F-F10

1. ID: ABM7F-F10.
2. Title: Chromium Store-admin supplemental navigation timed out.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: navigation interruption; product/environment/instrument cause unresolved.
6. Environment: Chromium 147.0.7727.15; Store admin fixture-token session; SCRATCH OwedBook.
7. Preconditions: all Help anchors exercised, first Help app-link reached /admin-portal.
8. Reproduction: observed in the planned supplemental diagnostic, after its explicit terminal-URL correction. Next goto timed out at 30 seconds. No automatic repeat of this failed navigation was performed.
9. Expected: stable required destination and complete route; a timeout is incomplete.
10. Actual: firstError page.goto: Timeout 30000ms exceeded; remaining assertions for that role not completed. Sign-out returned 200. Direct-route matrix observations are retained separately and do not erase this interruption.
11. Evidence: evidence/Q2/06/chromium-readonly-journeys-v2.json; journeys-readonly-v2-chromium-source.txt.
12. Cause: unknown. INFERENCE from control flow: return to Help before the second app-link; no network trace proving root cause was captured.
13. Scope: module QA; no repair attempted.
14. Gate impact: submitted to Friday; affected assertions incomplete, not passed. Separate from the planned O-1 count.
15. Owner: Friday adjudication after remaining campaign.
16. Retest: only a ruled diagnostic/retest after evidence review; first timeout remains.
Source: automated.

### F10 additional observation

Firefox 148.0.2 Owner A supplemental run recorded page.goto: NS_BINDING_ABORTED, at /admin-portal, after the first Help app link; sign-out 200. Evidence: evidence/Q2/06/firefox-readonly-journeys-v2.json. These are two interrupted supplemental runs (Chromium Admin, Firefox Owner), separate from O-1. INFERENCE from probe source: waiting for URL/load-state alone may advance before required destination content is stable. A content-stable diagnostic will retain, not replace, these failures.

## ABM7F-F11

1. ID: ABM7F-F11.
2. Title: Q1 short audit-history count omitted account-level records.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: QA fixture/recon gap, not product defect.
6. Environment: Owner A SCRATCH; Chromium 147.0.7727.15 runtime and read-only SQL reconciliation.
7. Preconditions: existing history, no seeding or reset.
8. Reproduction: open audit with Include reads off; compare effective owner SQL scope with Q1 business-only count.
9. Expected: Friday's extra short-history boundary assumes fewer than 50 non-read records.
10. Actual: 59 non-read records: Q1's 42 plus 17 account-level records. Runtime returns 50 and offers an older page. Main Include reads ON paging succeeds from 50 to 100 with distinct IDs; short-history OFF condition not present.
11. Evidence: evidence/Q2/06/audit-scope-reconciliation.json; chromium-readonly-journeys-v2.json; QAM_RECON_REPORT.md Q2 correction.
12. Cause: Q1 query counted business IDs only; source routine also admits account/subscription rows without a business ID.
13. Scope: Q1 inference corrected in Q2; fixtures unchanged.
14. Gate impact: extra short-boundary check BLOCKED pending Friday disposition; no waiver invented.
15. Owner: Cody for correction; Friday for exact boundary disposition, Tony for any new fixture/effect authorization.
16. Retest: only with a named approved alternative or disposition; no data reset.
Source: automated.

F10 count reconciliation after reading all Firefox rows: three Firefox roles (Member, Admin, Owner A) recorded NS_BINDING_ABORTED, plus the Chromium Admin timeout. Four supplemental interruptions total, separate from O-1. Required destination content was not awaited in v2 before the next goto; this is a documented instrument-race hypothesis. Chromium content-stable diagnostic passed all three roles in evidence/Q2/08/chromium-help-stable.json. Original interruptions retained for Friday.

### F10 content-stable diagnostics

Firefox 148.0.2 and WebKit 26.4 completed the v3 Help destinations, role denial and menu checks, with sign-out 200 for each role. Evidence: evidence/Q2/06/firefox-readonly-journeys-v3.json and webkit-readonly-journeys-v3.json. Earlier interrupted runs are not converted to passes.

### F11 runtime boundary qualification

WebKit returned 50 non-read API rows, rendered 37 after category filtering, and retained Load older. Firefox v3 recorded an initial zero-row response before Include reads ON returned two pages. Therefore the raw SQL count alone does not certify the running app's OFF state, and the engine difference remains unresolved. Candidate LiveAuditLog.tsx:65–69 filters views/system rows separately from the API read flag. No short-boundary pass is claimed.

## ABM7F-F12

1. ID: ABM7F-F12.
2. Title: Bound O-1 Store-admin route requires an Owner-only control.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: plan/contract gap, not a proved product defect.
6. Environment: SCRATCH production QA ports 3100/3101; engines/versions per saved rows.
7. Preconditions: existing ENGINEERING_ADMIN, authorized fixture-token setup.
8. Reproduction: (1) sign in as Store admin; (2) visit /owedbook, /admin-portal, /admin-portal/billing; (3) look for required Manage billing handoff.
9. Expected sources in conflict: bound QAM_TEST_PLAN.md final O-1 section requires the Manage billing step for Store admin; ABM_RULINGS.md:72–73 and plan AC-H03 require the existing owner-only billing message.
10. Actual: Owner-only message shown; Manage billing absent. Chromium ten bounded attempts are incomplete at this step, not ten clean passes. Other engines continue their approved bounded attempts.
11. Evidence: evidence/Q2/05/*-o1.json; AUTOMATION/Q2/o1.mjs; bound plan; ABM_RULINGS.md AM-11/12.
12. Cause: incompatible role/control assumptions in the QA route definition; no product root cause inferred.
13. Scope: approved O-1 route cannot complete as written; unrelated checks continue.
14. Gate impact: AC-F02 requires Friday adjudication; no Owner substitution or silent plan edit.
15. Owner: Friday for plan disposition; Tony for any changed release.
16. Retest: only an explicitly ruled route; retain all first incomplete attempts.
Source: automated.

## ABM7F-F13

1. ID: ABM7F-F13.
2. Title: Public hover probe waited for disabled pointer events.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Low.
5. Classification proposed: instrument issue.
6. Environment: Chromium 147.0.7727.15; public OwedBook auth, 1440px; no session.
7. Preconditions: empty link-request form, disabled button with pointer-events:none.
8. Reproduction: use Playwright locator.hover on the disabled button.
9. Expected: measure styles without enabling or submitting the button.
10. Actual: actionability times out after 30 seconds; first run exit 1. No submission.
11. Evidence: evidence/Q2/11/first-failure.log, public-interaction-styles-first-source.txt, partial public-interaction-styles.json, diagnostic-note.md.
12. Cause: instrument used actionable hover on a deliberately non-interactive control.
13. Scope: QA helper only.
14. Gate impact: first interrupted probe not counted as a pass; later coordinate diagnostic is separate.
15. Owner: Cody; Friday disposition.
16. Retest: safe diagnostic moves pointer by coordinates, preserving disabled state and sending no request.
Source: automated.

F13 diagnostic completed with exit 0, 17 public controls measured across both apps; evidence/Q2/11/public-interaction-styles-diagnostic.json and summary.json. No form submission or session. First failure retained. Gradient contexts explicitly remain outside this instrument’s supported contrast computation.

F12 completed bounded evidence: Chromium 10/10, Firefox 10/10 and WebKit 10/10 attempted; zero complete. Twenty-nine stopped at the missing Owner-only control. Firefox fresh attempt 5 instead timed out at the initial goto (15 seconds). All 18 sign-ins succeeded, all 18 sign-outs returned 200. Evidence: evidence/Q2/05/summary.json. Classification and any alternate route remain Friday’s decision.

## ABM7F-F14

1. ID: ABM7F-F14.
2. Title: Handoff probe selected a dashboard-only return button on Billing.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Low.
5. Classification proposed: instrument issue.
6. Environment: Chromium 147.0.7727.15, SCRATCH QA pair, Owner A.
7. Preconditions: successful real password sign-in; app-only handoff to Portal billing.
8. Reproduction: look for data-testid=open-owedbook on the billing body after confirming same identity.
9. Expected: use an existing app return control; no provider session.
10. Actual: locator click timed out after 30 seconds. Identity continuity into Portal had passed. Cleanup sign-out 200.
11. Evidence: evidence/Q2/12/password-handoff.json, password-handoff-first-source.txt, diagnostic-note.md.
12. Cause: selector belongs to DashboardView's dashboard branch; Billing has the header link in Shell.tsx:100–109 instead.
13. Scope: QA selector correction only.
14. Gate impact: first journey incomplete; no pass carried from the partial handoff.
15. Owner: Cody; Friday disposition.
16. Retest: explicit safe diagnostic uses the existing header link. No failed sign-in is retried; prior authentication succeeded.
Source: automated.

## ABM7F-F15

1. ID: ABM7F-F15.
2. Title: Single billing opening did not reach the hosted page within 30 seconds.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: incomplete journey; product/environment/instrument cause unresolved.
6. Environment: Chromium 147.0.7727.15; SCRATCH Portal production 3101.
7. Preconditions: designated Owner A password session; released ceiling one billing-portal opening, inspection only.
8. Reproduction: (1) sign in; (2) open /billing; (3) click Manage billing once; (4) await billing.stripe.com.
9. Expected: hosted billing page reached and return to QA billing with same identity; no setting changed.
10. Actual: one POST to /api/billing/portal; hosted URL wait timed out at 30 seconds. Provider session creation is unknown. No settings action or charge action attempted; sign-out 200. No retry.
11. Evidence: evidence/Q2/09/billing-once.json, billing-controls.json; AUTOMATION/Q2/billing-once.mjs.
12. Cause: unknown. No response body/status or error-state capture was retained, limiting diagnosis; no private Stripe URL was saved. Candidate DashboardView.tsx:76–89 branches between redirect and action error. No branch is inferred as observed.
13. Scope: J-f incomplete; one allowed attempt consumed.
14. Gate impact: R04(f) not passed; Friday adjudicates and Tony must expressly approve another effectful attempt if needed.
15. Owner: Friday adjudication; Tony effect decision.
16. Retest: no retry during this campaign without a specific ruling; preserve first result.
Source: automated.

## ABM7F-F16

1. ID: ABM7F-F16.
2. Title: Initial favicon comparator used an unsupported resize assumption.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Low.
5. Classification proposed: instrument issue.
6. Environment: offline candidate image files; Pillow; no browser/target effect.
7. Preconditions: master hash exact; allowed full-canvas scaling/padding.
8. Reproduction: compare ICO frames with a downscaled 512px square instead of the documented 48px square.
9. Expected: compare against an allowed actual derivation, checking color and opacity independently.
10. Actual: 512px-assumption comparison fails every frame. An initial RGBA bbox check was insufficient because zero alpha differences can mask color differences. Correct RGB/opacity comparison against whole-canvas 48px derivation matches every frame. PNG full-canvas comparisons also pass.
11. Evidence: evidence/Q2/03/icon-first-512-assumption.json; icon-diagnostic-note.md; icon-controls.json; icon-results.json; AUTOMATION/Q2/icon-check.py.
12. Cause: QA derivation assumption and image-channel comparator; no altered product artwork found.
13. Scope: offline QA instrumentation only.
14. Gate impact: corrected pixel evidence accepted only as measurement; HC-04 visual judgment still pending.
15. Owner: Cody; Friday disposition.
16. Retest: deterministic offline diagnostic completed; no product asset changed.
Source: automated.

F14 explicit diagnostic completed: real-password Owner A crossed to Portal billing and back with same identity, sign-out 200, then /owedbook refused at /auth and Portal /billing refused at /login. Evidence: evidence/Q2/12/password-handoff-diagnostic.json. The original timeout remains incomplete; HC-01 still awaits the Director.

## Friday in-run rulings 01 (24 November 2026), recorded on Tony’s instruction

F12: plan defect, explicitly not a product finding; thirty earlier attempts INCOMPLETE, none pass; one Firefox timeout retained separately. F11: Q1 recon correction, not product finding; main AC-R04(i) filters/older-page paging retained, Owner B short-boundary conditional check authorized, otherwise extra check withdrawn. F15: INCOMPLETE, not pass or yet product failure; saved-only diagnosis first, conditional additional opening only if test fault is established. Billing-return journey is J-b, correcting prior J-f label. F03/F04 and other dispositions wait for final Q2 adjudication. Authority: HANDOFFS/Q2_INRUN_RULINGS_01_RECORD.md.

### F15 saved-only diagnosis under Friday in-run ruling01

Evidence: evidence/Q2/17/billing-saved-diagnosis.json. Actual response status/body were not retained. Server stdout/stderr were discarded by the guarded QA launcher, so no saved application log exists for the request. Candidate externalRedirect uses window.location.assign (same tab); the probe waited in that same tab. This does not establish test fault or app failure, and the timeout cause remains unknown. The conditional second-opening authority is not triggered. No new request; J-b remains INCOMPLETE. Prior J-f attribution corrected.

## ABM7F-F17

1. ID: ABM7F-F17.
2. Title: Raster text calibration initially ignored per-channel LCD coverage.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Low.
5. Classification proposed: instrument issue.
6. Synthetic Chromium pixel controls; no fixture session.
7. Passing/failing controls before any candidate result.
8. Run clean, rounded-green, half-opacity, passing/failing gradient controls.
9. Clean and good gradient pass; deliberately failing samples fail.
10. First run rejected two clean controls. Per-channel LCD calibration correction passed all five; original saved.
11. evidence/Q2/15/raster-controls.json; raster-first-source.txt; first-failure-note.md; raster-controls-ready.json.
12. Single maximum coverage was used for all color channels despite LCD antialiasing.
13. QA instrument only; no product repair.
14. No candidate evidence used the failed version.
15. Cody; Friday disposition.
16. Corrected controls completed before candidate runs.
Source: automated.

## ABM7F-F18

1. ID: ABM7F-F18.
2. Title: Disabled OwedBook profile fields render below required contrast.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: acceptance failure proposed.
6. SCRATCH OwedBook /profile, Chromium147.0.7727.15 at375px; Member, Store admin and Owner A.
7. Existing cast sessions; no profile write.
8. Open /profile; measure name and email disabled input text via calibrated pixel capture.
9. AC-B08 requires normal text >=4.5:1 including disabled/composited states.
10. Measured approximately2.43:1 in each role, opacity0.5. Exact private field values and screenshots not retained.
11. evidence/Q2/15/member/00058.json; owner_a/00058.json; admin/00058.json. Source: OwedBook src/app/profile/ProfileForm.tsx:136–148 and src/components/ui/input.tsx:13.
12. Source confirms disabled:opacity-50 on the input primitive. No repair performed.
13. Inside module rendered contrast; whether pre-existing is not asserted.
14. AC-B08 measurement fails; no overall verdict issued.
15. Friday adjudication; Engineer not engaged.
16. Only after adjudication/authorized repaired candidate; first pixel evidence retained.
Source: automated.

## ABM7F-F19

1. ID: ABM7F-F19.
2. Title: Some raster contexts remain unmeasured or need instrument qualification.
3. Module/candidates: ABM007_FINAL; OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: instrument/evidence gap.
6. Pixel campaign across QA screens/states; engines recorded per row.
7. Validated synthetic controls; actual layout/overlay contexts vary.
8. See journal entries with completed=false, raster NOT RUN, or low modal-overlay samples.
9. Every required screen/state measured or explicitly NOT RUN; no unsupported context passed.
10. Thin arrow ranges lack stable sampled glyph pixels; some modal-obscured text and focus captures require qualification; four Member captures changed screenshot dimensions. Context-level evidence remains, no whole-criterion pass.
11. evidence/Q2/15/{member,public,owner_a,admin}/journal.json and cited numbered records. Final named gap inventory to be generated from these rows.
12. Instrument limitations in low-coverage glyphs, occlusion and full-page capture stability; not automatically product failures.
13. QA coverage/evidence gap.
14. Blocks a complete AC-B08 pass until measured or ruled; not hidden by count totals.
15. Cody for explicit gap list; Friday adjudication.
16. Safe focused diagnostic permitted; no side-effect retry or weakened assertion.
Source: automated.


### Continuation qualification — F19 and fixture setup observation

The public Plan radio focus zero readings in evidence/Q2/20/public/results.json measured the visually hidden native radio, not its visible label. Classified instrument proxy error before diagnostic; six engine/width diagnostic label measurements PASS, after six passing positive/negative proxy controls. Evidence: Q2/15/nontext-proxy-controls.json and Q2/20/public-radio-proxy-diagnostic.json. Original readings retained; no product repair.

The Admin raster campaign stopped after one Portal fixture setup timed out at confirm-sign-in (Q2/15/admin/journal.json). One generated token, no successful Portal session recorded, sign-out HTTP200. No automatic retry. Saved evidence lacks the final page classification, so this is an unresolved fixture-setup observation, not a product failure or a pass. Remaining raster contexts are NOT RUN. A later separately planned session must not erase this first failure.


Continuation process observation (F08/F19): raster PUBLIC and Admin command sessions returned exit143. Public journal ends before all six engine/app contexts. Admin journal records its fixture-setup timeout and signouts, but command exit is not clean. Preserve partial records, mark missing contexts NOT RUN; no silent campaign pass. Evidence/Q2/23/process-exits.json.


## ABM7F-F20

1. ID: ABM7F-F20.
2. Title: Store admin Portal fixture confirmation setup timed out once.
3. Module/candidates: ABM007_FINAL; OB 2e91e90905b2d9907577a64985e643f7827019ac; PP fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: environment/instrument unresolved; not established product defect.
6. Chromium147 Portal fixture setup in raster campaign.
7. Existing designated Store admin on verified SCRATCH; one generateLink setup, no email.
8. Original helper tried the app confirmation Sign in control and timed out after12seconds.
9. Expected explicit confirmation control and successful fixture session, or clear failure evidence.
10. No successful session recorded for that attempt. Signout HTTP200. Campaign stopped further sign-ins; no automatic retry. A separate planned focus campaign later established its own Portal session; this does not erase the first failure.
11. evidence/Q2/15/admin/journal.json; evidence/Q2/20/admin/results.json for separate planned campaign, with session method and time.
12. Final page/response was not retained by the first helper, so root cause cannot be established from saved evidence.
13. Setup evidence gap and intermittent observation; no real-email or password claim.
14. Original context INCOMPLETE; missing raster contexts NOT RUN. No clean full-campaign pass.
15. Friday adjudication; Cody maintains first evidence and counters.
16. No automatic sign-in retry, no product repair; independent planned sessions recorded separately.
Source: automated.


## ABM7F-F21

1. ID: ABM7F-F21.
2. Title: Profile support text link inherits muted gray instead of dark green.
3. Module/candidates: ABM007_FINAL; OB 2e91e90905b2d9907577a64985e643f7827019ac; PP fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: product / contract mismatch; Friday decides applicability.
6. OwedBook Profile, Store admin, Chromium/Firefox, 375 and1440 where recorded.
7. Existing designated SCRATCH fixture session, read-only Profile.
8. Inspect the support text link beneath the read-only email field.
9. AC-B07: text links on white surfaces use dark green and underline.
10. Computed rendered link foreground rgb(81,81,81), underlined; body link inside Profile card, not a navigation item or button. No address retained.
11. evidence/Q2/20/admin/results.json surface links at /profile; source src/app/profile/ProfileForm.tsx:150–152 in OwedBook candidate.
12. Anchor inherits text-muted-foreground from parent paragraph and has no link-color class.
13. Approved link-rule mismatch proposed; no repair performed.
14. AC-B07 requires adjudication, not a clean pass from link counts.
15. Friday for disposition.
16. First rendered observation kept; further role observations are separate planned coverage, not repair retest.
Source: automated.


F19 housekeeping observation: offline reconciliation rerun initially failed because a replaced placeholder was no longer present. First exception preserved in evidence/Q2/23/reconciliation-first-failure.txt; selector corrected to installed section boundaries. Offline diagnostic rerun reconciled all36 criteria. No target access or effect.


F20 additional occurrence: Member WebKit Portal raster setup also timed out at confirm-sign-in; generated-token count6 versus successful token sessions5; signout200. Source: evidence/Q2/15/member/journal.json. Context INCOMPLETE, missing Portal WebKit raster states NOT RUN. Subsequent planned-session helper adds only status/path/control-count diagnostics, never query/cookie/body/identity values; guards unchanged and diff preserved under evidence/Q2/23. No sign-in retry was launched for diagnosis.


## ABM7F-F22

1. ID: ABM7F-F22.
2. Title: Read-only OwedBook navigation timeouts during continuation.
3. Module/candidates: ABM007_FINAL; OB 2e91e90905b2d9907577a64985e643f7827019ac; PP fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: unresolved environment/instrument/product; no product failure inferred from timeout alone.
6. Corrected O-1 Firefox fresh attempt2; Owner A Chromium375 initial OwedBook focus route.
7. Valid designated SCRATCH sessions; fixed candidate pair; no effectful business journey.
8. O-1 completed through Portal /billing; next ordered step /owedbook timed out at15seconds. Owner A direct /owedbook navigation timed out at20seconds.
9. Required stable route content; every step complete before a route can pass.
10. Both contexts INCOMPLETE. Chromium O-1 earlier completed eight routes; later planned attempts are not replacements for these failures.
11. evidence/Q2/16/firefox-o1-amended.json; evidence/Q2/20/owner_a/results.json.
12. Saved evidence establishes timeout, not root cause or a Portal sign-in redirect. O-1 failed destination is inferred from last completed step and fixed script order.
13. Intermittent navigation/coverage observation; first failure retained.
14. No pass for either interrupted route; full O-1 classification waits for all bounded attempts and Friday.
15. Friday adjudication. Cody preserves count and path evidence.
16. Remaining original planned attempts continue; neither failed route rerun automatically; no repair.
Source: automated.


F20 corrected O-1 occurrence: Firefox warm fixture setup failed at confirmation click with control count1, HTTP200 confirmation page, final path /auth/confirm. Five warm routes NOT RUN; no retry. This confirms the control was present, not that the provider completed authentication. Source evidence/Q2/16/firefox-o1-amended.json and firefox-unstarted-warm-routes.json. Future independently planned contexts add only visibility/enabled and confirm POST/response-status counts; no secret/body/URL query recorded. F22 also includes Firefox fresh attempt3 timeout, retained independently.


F11 authorized extra boundary completed: evidence/Q2/19/owner-b-audit-boundary.json. Read-only Owner B count14 below page size50; one normal password session, Include reads off,8 visible rows, no older control, signout200. PASS for that extra boundary. Source count includes rows the UI can hide as system categories; no claim of SQL/UI row-count identity. No seeding/reset. Original Q1 recon correction remains on record.


F22 additional read-only table probe: Owner A selected existing permitted stores; nine store/tab observations saved, then tab click timed out at15seconds. Source evidence/Q2/24/owner_a.json. Remaining tabs NOT RUN; no automatic retry; signout200. No table observed in captured states. The probe’s `error` boolean means only an element with role=alert was found, not an independently confirmed data-request error; it must not be read as a product error assertion. Member’s four tab observations also exposed no table. Real-fixture table-width coverage remains NOT RUN.


## ABM7F-F23

1. ID: ABM7F-F23.
2. Title: Mock Admin fixture prerequisite absent.
3. Module/candidates: ABM007_FINAL; OB 2e91e90905b2d9907577a64985e643f7827019ac; PP fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Medium.
5. Classification proposed: QA expectation / fixture gap.
6. One Owner A password session in isolated mock build, SCRATCH authentication.
7. Designated SCRATCH cast and approved isolated production copies only.
8. Open OwedBook and four Admin routes.
9. Use the existing mock guard and a fixture with its required global role.
10. OwedBook renders25 demo rows; all Admin routes return to OwedBook. Raw probe FAIL retained; signout200.
11. evidence/Q2/21/mock-runtime.json; mock-global-role-read.json; mock-runtime-qualification.json; mock-guard-baseline.diff
12. All designated global user_roles are member. Mock AdminLayout requires global admin; real tenant ownership is separate. The guard and role resolver are unchanged from baseline.
13. Mock Admin coverage BLOCKED; no product regression inferred from the wrong expected route. Browser-only observation found no business RPC/mutation; not a global backend traffic proof.
14. No module verdict or repair authorization implied.
15. Friday adjudication; Director owns any fixture/role exception, none requested or assumed.
16. No role/credential change, no new fixture, no mock retry. Original result retained with factual qualification.
Source: automated.


## ABM7F-F24

1. ID: ABM7F-F24.
2. Title: Runtime labels cannot replace compiled build-info labels.
3. Module/candidates: ABM007_FINAL; OB 2e91e90905b2d9907577a64985e643f7827019ac; PP fc1fa6c2a90ebf59987287ad765e2e65cf635549.
4. Severity proposed: Low.
5. Classification proposed: QA identity instrument.
6. Real builds restored to3100/3101 with exact Invitee-only invitation allowlist.
7. Designated SCRATCH cast and approved isolated production copies only.
8. Compare endpoint revision with runtime metadata assignment.
9. Use a valid provenance method; do not infer compiled metadata from runtime env.
10. First check failed: endpoints unrecorded/unlabelled despite matching runtime env. Real builds were serving; no identity drift observed.
11. evidence/Q2/22/real-ready-first-metadata-failure.json; identity-verifier-correction.diff; build-lineage-controls.json; real-ready.json; evidence/Q2/18/runtime-copy-reverification.json
12. next.config.js:5–7 compiles identity labels at build time. Prior QA builds omitted labels. Runtime assignment cannot change those compiled fields.
13. Independent verification passed: exact HEADs/branches, source hashes, unchanged compiled BUILD_ID lineage, real-copy listener paths and SCRATCH. Endpoint itself remains unlabelled and is not represented as identity proof.
14. No module verdict or repair authorization implied.
15. Friday reviews provenance limitation; Cody records the instrument correction.
16. No product edit or rebuild. First failure preserved; offline controls and read-only corrected verification saved. Real servers retained.
Source: automated.


## ABM7F-F25 — Bundled Chromium unavailable at J-e startup

- Source: automated QA instrument. Proposed classification: instrument availability, Low.
- The launch stopped before opening a browser context. There were zero sign-ins, invitation requests and emails in that first attempt. A launch-only diagnostic reproduced the missing bundled executable.
- Installed Chrome 157.0.8103.78 launched. The guarded continuation used the single authorized invitation request. No sign-in or invitation was retried after an effect.
- Evidence: `evidence/Q2/J-e/invite-attempt.json`, `evidence/Q2/J-e/browser-launch-diagnostic.json`, `evidence/Q2/J-e/invite-installed-chrome.json`.
- Friday reviews the instrument disposition at adjudication.


## ABM7F-F26 — Hosted billing opening failed with deleted sandbox customer links

- Source: Director, unplanned action. Reported 25 November 2026, approximately 08:44–08:46 BDT.
- One click on Manage billing for the Invitee’s own account after a successful same-account handoff showed the payment-provider error. This opening is separate from the released Owner A attempt. The Director recorded no charge and no setting change.
- Portal stdout and stderr went to /dev/null. The historical response and precise failure point are unavailable. Later GETs using the verified QA sandbox returned HTTP 200 and deleted: true for both the Invitee’s and Owner A’s linked customers. SCRATCH still identified both subscriptions as active and Stripe-backed.
- Proposed classification: QA fixture/environment gap, High for J-b coverage. The deleted customer is the leading explanation for the Invitee failure and plausibly explains F15. The historical cause of either opening remains unconfirmed. No candidate server-path regression established and no second opening.
- Evidence: `evidence/Q2/J-e/director-observation.json`, `evidence/Q2/26/DIRECTOR_BILLING_DIAGNOSIS.md`, `evidence/Q2/26/billing-customer-read.json`. Friday adjudicates F26 and F15 together. Any fixture remedy and retest need separate release.

## ABM7F-F27 — Portal Sign in wraps and footer links break at 768px

1. ID: ABM7F-F27.
2. Title: Portal Sign in wraps and footer links break at 768px.
3. Module/candidates: ABM007_FINAL. The bound pair is in QAM_APPROVAL.md. F31 is older alpha with unverified revisions.
4. Severity proposed: Medium.
5. Classification proposed: responsive visual defect proposed.
6. Environment and time: in the observation below.
7. Preconditions: Director-run QA walkthrough in Owner B context or supplementary public/alpha context where stated.
8. Reported steps: see Tony’s as-received account and step attribution in Q2/27.
9. Expected or requested: HC-04 / AC-L04. New requests remain for adjudication as scoped by Friday.
10. Actual or requested: 25 November 14:21–14:22 BDT, local Portal /login, Desktop Chrome 157.0.8103.78 on Ubuntu with 768px emulation. Tony reported broken Sign in text and uneven footer link wrapping. Requests: fit Sign in, suggesting smaller type, and stack and center the footer links. Mobile comparisons and widths 1024px and above passed by his report. His later overall pass at about 12:01 BDT on 26 November does not withdraw either request. JARVIS continued comparisons after first failure, contrary to the sheet. The later comparisons stay qualified.
11. Evidence: Q2/27/HUMAN_WALKTHROUGH_RECORD.md, DIRECTOR_LATER_ANSWERS.md and screenshots/HC-04_03.webp, HC-04_04.webp.
12. Cause: Unestablished. No diagnosis inferred from the observations.
13. Scope: HC-04 / AC-L04.
14. Gate impact: Friday decides.
15. Owner: Friday adjudicates. Tony owns release and scope decisions.
16. Retest: Friday decides acceptance impact and routes the two requested repairs. Proposed narrow retest at 768px with adjacent widths after authorized repair.

Source: Director walkthrough.

## ABM7F-F28 — OwedBook public opening-page entry and button color requests

1. ID: ABM7F-F28.
2. Title: OwedBook public opening-page entry and button color requests.
3. Module/candidates: ABM007_FINAL. The bound pair is in QAM_APPROVAL.md. F31 is older alpha with unverified revisions.
4. Severity proposed: Medium.
5. Classification proposed: follow-up change request pending Director scope.
6. Environment and time: in the observation below.
7. Preconditions: Director-run QA walkthrough in Owner B context or supplementary public/alpha context where stated.
8. Reported steps: see Tony’s as-received account and step attribution in Q2/27.
9. Expected or requested: HC-04 extra local exploration / open ruling. New requests remain for adjudication as scoped by Friday.
10. Actual or requested: 25 November 14:37–14:42 BDT. Tony reported Start free trial took him to login and asked for a Subscribe action to the Portal purchase entry, alongside a Log in action. Exact separate styling request in the sheet: “i will ... plz record that the large login button should have that dark blue color as the header text”. Time not supplied for the color request. Preserve the intended control context. The additional 26 November Director ruling for “Subscribe Now” and navy “Log in” is held by Friday and belongs in her rework order.
11. Evidence: Q2/27/DIRECTOR_WALKTHROUGH_FILLED.md, Director rework requests 3 and 4. HANDOFFS/Q2_FINAL_DECISIONS.md, Open Director rulings.
12. Cause: Unestablished. No diagnosis inferred from the observations.
13. Scope: HC-04 extra local exploration / open ruling.
14. Gate impact: Friday decides.
15. Owner: Friday adjudicates. Tony owns release and scope decisions.
16. Retest: Friday carries her held ruling into the rework order. No scope assumption, repair or new test.

Source: Director, unplanned action.

## ABM7F-F29 — Mandatory Help return-to-top navigation request

1. ID: ABM7F-F29.
2. Title: Mandatory Help return-to-top navigation request.
3. Module/candidates: ABM007_FINAL. The bound pair is in QAM_APPROVAL.md. F31 is older alpha with unverified revisions.
4. Severity proposed: Medium.
5. Classification proposed: follow-up enhancement.
6. Environment and time: in the observation below.
7. Preconditions: Director-run QA walkthrough in Owner B context or supplementary public/alpha context where stated.
8. Reported steps: see Tony’s as-received account and step attribution in Q2/27.
9. Expected or requested: HC-08 / AC-H01. New requests remain for adjudication as scoped by Friday.
10. Actual or requested: 26 November 10:15–10:16 BDT. Tony used the Help contents anchor and approved labels/wording. He asked for a small “Go to the Top” link at the bottom of the left contents menu to return to the page header without scrolling back through the document. He made it mandatory rework. HC-08 remains recorded as his qualified PASS.
11. Evidence: Q2/27/HUMAN_WALKTHROUGH_RECORD.md and screenshots/HC-08_01.webp, HC-08_02.webp.
12. Cause: Unestablished. No diagnosis inferred from the observations.
13. Scope: HC-08 / AC-H01.
14. Gate impact: Friday decides.
15. Owner: Friday adjudicates. Tony owns release and scope decisions.
16. Retest: Friday classifies and routes mandatory request. Retest the requested link after a separately released repair.

Source: Director walkthrough.

## ABM7F-F30 — Dropdown placement differs in Chrome device emulation

1. ID: ABM7F-F30.
2. Title: Dropdown placement differs in Chrome device emulation.
3. Module/candidates: ABM007_FINAL. The bound pair is in QAM_APPROVAL.md. F31 is older alpha with unverified revisions.
4. Severity proposed: Medium.
5. Classification proposed: observation; cause unresolved.
6. Environment and time: in the observation below.
7. Preconditions: Director-run QA walkthrough in Owner B context or supplementary public/alpha context where stated.
8. Reported steps: see Tony’s as-received account and step attribution in Q2/27.
9. Expected or requested: HC-04 supplemental local exploration. New requests remain for adjudication as scoped by Friday.
10. Actual or requested: 25 November around 14:50–14:52 BDT. Tony reported misplaced dropdowns with Chrome device emulation enabled and normal placement when disabled. Source notes include 425px, 1440px and 2560px emulated views and additional audit/settings navigation. The deployed-alpha iPhone behavior is a separate comparison. The evidence establishes neither a Chrome bug nor a real-device result for the candidate.
11. Evidence: Q2/27/DIRECTOR_WALKTHROUGH_FILLED.md, Director rework request 6 and HC-04. Associated raw captures are not in the approved safe screenshot set.
12. Cause: Unestablished. No diagnosis inferred from the observations.
13. Scope: HC-04 supplemental local exploration.
14. Gate impact: Friday decides.
15. Owner: Friday adjudicates. Tony owns release and scope decisions.
16. Retest: Friday decides whether to request targeted follow-up. No repeat or repair in Q2.

Source: Director walkthrough.

## ABM7F-F31 — Deployed-alpha iPhone billing Add store overflow

1. ID: ABM7F-F31.
2. Title: Deployed-alpha iPhone billing Add store overflow.
3. Module/candidates: ABM007_FINAL. The bound pair is in QAM_APPROVAL.md. F31 is older alpha with unverified revisions.
4. Severity proposed: Medium.
5. Classification proposed: supplemental deployed observation.
6. Environment and time: in the observation below.
7. Preconditions: Director-run QA walkthrough in Owner B context or supplementary public/alpha context where stated.
8. Reported steps: see Tony’s as-received account and step attribution in Q2/27.
9. Expected or requested: Alpha only / candidate comparison AC-L04. New requests remain for adjudication as scoped by Friday.
10. Actual or requested: Reported 26 November 09:11 BDT, iPhone 13 and iOS 27.0.1, deployed older alpha. Exact browser and deployed build IDs unknown. Tony described Add store extending out of view on billing and horizontal touch scroll. Dropdowns appeared normal. Saved local QA Portal /billing rows show no page overflow at 375px in Chromium, Firefox and WebKit, with Add Pharmacy link present. This does not establish candidate iPhone behavior or independently measure the Add link bounds. HC-03 stays removed.
11. Evidence: Q2/27/ALPHA_PHONE_COMPARISON.md and verbatim source in DIRECTOR_WALKTHROUGH_FILLED.md. Local Q2/02/0578.json, 0690.json, 0777.json. Device About image and raw alpha captures excluded.
12. Cause: Unestablished. No diagnosis inferred from the observations.
13. Scope: Alpha only / candidate comparison AC-L04.
14. Gate impact: Friday decides.
15. Owner: Friday adjudicates. Tony owns release and scope decisions.
16. Retest: Friday keeps this separate from candidate adjudication and decides any later alpha follow-up.

Source: Director, unplanned action.

## ABM7F-F32 — Ubuntu dark-flash observation and walkthrough provenance limits

1. ID: ABM7F-F32.
2. Title: Ubuntu dark-flash observation and walkthrough provenance limits.
3. Module/candidates: ABM007_FINAL. The bound pair is in QAM_APPROVAL.md. F31 is older alpha with unverified revisions.
4. Severity proposed: Low.
5. Classification proposed: human scope and evidence qualification.
6. Environment and time: in the observation below.
7. Preconditions: Director-run QA walkthrough in Owner B context or supplementary public/alpha context where stated.
8. Reported steps: see Tony’s as-received account and step attribution in Q2/27.
9. Expected or requested: HC-05 / AC-B04 and walkthrough provenance. New requests remain for adjudication as scoped by Friday.
10. Actual or requested: The sheet recorded Windows unavailable. At about 12:01 BDT on 26 November Tony reported “no dark flash ... pass” in desktop Chrome on Ubuntu with dark mode on. Windows was not exercised and exact navigation, reload and stored-theme details are unspecified. Automated dark OS/stored-dark first-paint work remains. Separately, no personal candidate/hash confirmation was transcribed, and closeout PIDs, build IDs, source hashes and target match despite a host start-time discrepancy. Historic continuity and private email destination inspection are qualified.
11. Evidence: Q2/27/DIRECTOR_LATER_ANSWERS.md, closeout-build-identity.json, DIRECTOR_WALKTHROUGH_FILLED.md and Q2/07/public-first-paint.json.
12. Cause: Unestablished. No diagnosis inferred from the observations.
13. Scope: HC-05 / AC-B04 and walkthrough provenance.
14. Gate impact: Friday decides.
15. Owner: Friday adjudicates. Tony owns release and scope decisions.
16. Retest: Friday decides Windows applicability or equivalence and how to treat provenance gaps. No validity ruling by Cody.

Source: Director walkthrough.

## ABM7F-F33 — Additional shared controls retain 50% disabled opacity

1. ID: ABM7F-F33
2. Title: Additional shared controls retain 50% disabled opacity
3. Module and candidate pair: ABM007_FINAL, Q4 repaired working trees. Both file manifests are pinned in evidence/Q4/01.
4. Severity: Low, proposed.
5. Classification: Follow-up finding, outside this module, proposed.
6. Environment: Static source audit of the isolated Q4 copies.
7. Preconditions: The shared control must be used in a disabled state.
8. Exact reproduction: Inspect disabled styles in each named control.
9. Expected result: Confirm rendered disabled controls are readable before releasing a screen that uses the affected state.
10. Actual result: OwedBook textarea, select, tabs and command, and Account & Billing textarea use a half-opacity treatment. No current screen was identified using the affected controls disabled.
11. Evidence: OwedBook src/components/ui/textarea.tsx:12, select.tsx:22 and 121, tabs.tsx:32, command.tsx:51. Account & Billing src/components/ui/textarea.tsx:13.
12. Cause: Source behavior is recorded directly. A failing rendered instance has not been established.
13. Scope impact: Outside this module.
14. Gate impact: Neither gate. This entry does not fail a Q4 criterion.
15. Owner: Architect.
16. Retest requirement: Before using the state on a product screen, measure its rendered appearance against the criterion.

Source: automated, from the Q4 order and pinned source inspection.

## ABM7F-F34 — Disabled password reveal icon retains the half-opacity style

1. ID: ABM7F-F34
2. Title: Disabled password reveal icon retains the half-opacity style
3. Module and candidate pair: ABM007_FINAL, Q4 repaired working trees. Both file manifests are pinned in evidence/Q4/01.
4. Severity: Low, proposed.
5. Classification: Follow-up finding, outside this module, proposed.
6. Environment: Static source audit of the isolated Q4 copies.
7. Preconditions: The shared control must be used in a disabled state.
8. Exact reproduction: Inspect disabled styles for both password reveal controls.
9. Expected result: Confirm rendered disabled controls are readable before releasing a screen that uses the affected state.
10. Actual result: The reveal icon fades when its field is disabled. No current page was identified using this state.
11. Evidence: OwedBook src/components/ui/password-input.tsx:71. Account & Billing src/components/portal/FormField.tsx:167.
12. Cause: Source behavior is recorded directly. A failing rendered instance has not been established.
13. Scope impact: Outside this module.
14. Gate impact: Neither gate. This entry does not fail a Q4 criterion.
15. Owner: Architect.
16. Retest requirement: Before using the state on a product screen, measure its rendered appearance against the criterion.

Source: automated, from the Q4 order and pinned source inspection.

## ABM7F-F35 — OwedBook Store selector uses native disabled appearance

1. ID: ABM7F-F35
2. Title: OwedBook Store selector uses native disabled appearance
3. Module and candidate pair: ABM007_FINAL, Q4 repaired working trees. Both file manifests are pinned in evidence/Q4/01.
4. Severity: Low, proposed.
5. Classification: Follow-up finding, outside this module, proposed.
6. Environment: Static source audit of the isolated Q4 copies.
7. Preconditions: The shared control must be used in a disabled state.
8. Exact reproduction: Inspect the Store selector styles and the removed Member zero-store state.
9. Expected result: Confirm rendered disabled controls are readable before releasing a screen that uses the affected state.
10. Actual result: The native disabled appearance applies. Contrast of that state was not measured.
11. Evidence: OwedBook src/components/owedbook/StoreSelector.tsx:8. The Q4/04/core.json removed Member row records the selector state.
12. Cause: Source behavior is recorded directly. A failing rendered instance has not been established.
13. Scope impact: Outside this module.
14. Gate impact: Neither gate. This entry does not fail a Q4 criterion.
15. Owner: Architect.
16. Retest requirement: Before using the state on a product screen, measure its rendered appearance against the criterion.

Source: automated, from the Q4 order and pinned source inspection.

## ABM7F-F36 — Help end link on ice misses link and contrast rules

1. ID: ABM7F-F36.
2. Title: Help end link on ice misses link and contrast rules.
3. Module and candidate pair: ABM007_FINAL Q4, repaired working-tree manifests in evidence/Q4/01.
4. Severity: Medium, proposed.
5. Classification: Acceptance failure proposed under AC-B07 and AC-B08.
6. Environment: isolated OwedBook production build on SCRATCH local-proof, Chromium 147.0.7727.15 at 375 × 900.
7. Preconditions: Owner A signed in normally, default Help appearance.
8. Exact reproduction: Open /help at 375px, read the last Go to the Top link after the Help text, and sample its rendered text against the pixels behind it. The instrument selects help-go-to-top-end.
9. Expected result: Dark-green body links on white or the navy-on-ice treatment required by brand contract 4.3. Small text minimum 4.5:1 under AC-B08.
10. Actual result: The separate Help end link is underlined green rgb(40, 132, 114) on the ice page surface and measured 4.0355:1 with 132 samples and zero unstable pixels. The functional return-to-top probe passed. The first matrix independently measured the same 4.0355:1 link region on Owner A and Store admin Help.
11. Evidence: evidence/Q4/05/settled-read-diagnostics.json and evidence/Q4/03/chromium/0343.json, 0473.json and 0483.json. Pinned OwedBook source src/components/help/HelpPage.tsx:323–327.
12. Cause: The pinned end link uses pb-link directly under the transparent paragraph on the page surface. The menu link has a different white-card context.
13. Scope impact: Inside Q4, introduced in A1-2 and covered by AC-B07 and AC-B08.
14. Gate impact: Criteria implicated. Friday adjudicates.
15. Owner: Friday for disposition.
16. Retest requirement: Under a separately released change, measure the rendered end-link contrast and color treatment at widths below 1024, and retain functional go-to-top checks. No repair in Q4.

Source: automated, named rendered-pixel probe and pinned source review.

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

## ABM7F-F37 — Firefox desktop first Help link returns to its previous scroll position after Enter

1. ID: ABM7F-F37.
2. Title: Firefox desktop first Help link returns to its previous scroll position after Enter.
3. Module and candidate pair: ABM007_FINAL A2, served manifest pair in evidence/Q4/A2/entry-comparison.json.
4. Proposed severity: Medium.
5. Proposed classification: Acceptance failure under A2-1, keyboard return behavior.
6. Environment: OwedBook SCRATCH, Firefox 148, desktop emulation on Ubuntu VM.
7. Preconditions: Registered SCRATCH fixture signed in and Help opened fresh.
8. Reproduction: At the affected size, Tab to the first article's Go to the Top, position the focused control near the middle when the page permits, press Enter and observe the hash and viewport after navigation settles.
9. Expected: At the very top with the header visible, as required by AM-23 and A2-1.
10. Actual: The visible outline was whole. Enter set #top but the settled viewport stayed at its pre-Enter position. Affected repeat positions: ENGINEERING_OWNER_A 1024 × 600, ENGINEERING_OWNER_A 1440 × 900. The timeline distinguishes reaching y=0 momentarily from staying there.
11. Evidence: evidence/Q4/A2/firefox-diagnostic-results.json and firefox-enter-settled.json. Original failures retained.
12. Cause: Unestablished. Hash navigation runs; the reason for the settled scroll position is unknown.
13. Scope: A2-1 article keyboard navigation. The contrast result for F36 is separately measured.
14. Gate impact: Friday adjudicates.
15. Owner: Friday for disposition.
16. Retest: Verify settled first-link Enter behavior on Firefox at both desktop widths after any separately released correction. Preserve mouse, other links and contrast coverage.

Source: Automated keyboard input and independent scroll/hash timeline.

## F37 disposition — Friday, relayed by the Director in the A3 order

Product defect, low severity. Firefox desktop article 1 keyboard return routed to RWO-01 add-on A3. Original F37 evidence is retained. Friday accepted the remaining A2 readout, including the reported measurement limits, and classified the first-attempt sequencing failures as QA sequencing.

## ABM7F-F38 — cold Help load hides articles with page scripts disabled

Source: automated Chromium cold-load observation on the A3 candidate. The additional Chromium Owner A session confirmed native navigation on rendered Help after page scripts were disabled. From scroll position 6803, the last article link returned to zero with the header visible at all five samples through 2000 ms. On a cold load with scripts disabled, the response contained all 13 links under a hidden ancestor and the last link had no layout box. A reader could not use those links on that cold load. Friday should adjudicate cold-load accessibility separately from the native link and F37. Two earlier cold-load attempts remain recorded. Evidence: evidence/Q4/A3/chromium-no-script-rendered.json. Final automation effects: 12/15 SCRATCH sign-in attempts, 12 sign-outs HTTP 200, zero Portal document loads. The read-only build-info check verified the pair again in served-ready.json. Proposed disposition pending Friday.

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

