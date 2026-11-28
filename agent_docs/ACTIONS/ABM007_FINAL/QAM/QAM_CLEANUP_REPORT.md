# QAM_CLEANUP_REPORT — `ABM007_FINAL`

**Owner:** QA Executor executes; QA Lead decides retention and accepts · **Written:** after the accepted product verdict · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

A closing operation, not another test campaign. Check current state first: something already absent is recorded "verified absent", not "deleted".

## 1. Retention decisions (QA Lead, before anything is removed)

| Item | Keep or remove | Reason |
|---|---|---|
| Evidence under `evidence/` | NOT RECORDED | |
| Helpers under `AUTOMATION/` | NOT RECORDED | |
| Failed attempts | Keep unless unsafe | |
| QA fixtures on SCRATCH (accounts, pharmacies, the audit-history fixture) | NOT RECORDED | |
| Stripe sandbox objects created by QA | NOT RECORDED | |

## 2. Execution (QA Executor), in this order

| # | Step | Result | Evidence |
|---|---|---|---|
| 1 | Close owned browsers; stop owned QA servers and the owned listener; list what was stopped | NOT RUN | |
| 2 | While the credential file still exists: scan retained outputs for its values, without printing them | NOT RUN | |
| 3 | Resolve or quarantine any real leak, without publishing it | NOT RUN | |
| 4 | Remove the QA credential file and owned auth state, under the declared authority; verify removal | NOT RUN | |
| 5 | Pattern-scan retained outputs and the final export | NOT RUN | |
| 6 | Remove disposable build output, mirrors and temporary paths that were declared | NOT RUN | |
| 7 | Final environment reset: ports free, no owned process running, both working trees in the state recorded at entry apart from the QA lane | NOT RUN | |
| 8 | Confirm untouched: DEV database, alpha services, the rehearsal account, `RECOVERY.md` and session folders | NOT RUN | |

No credential value or hash of one is kept as evidence. After deletion, no new value scan is claimed.

## 3. Not done by this cleanup

Password rotation by the Director (recorded as Director-reported if he reports it). Unrelated processes and editor recovery files. Anything on DEV or alpha.

## 4. Acceptance (QA Lead)

| Field | Value |
|---|---|
| Accepted, or returned with exact items | NOT RECORDED |
| Date | NOT RECORDED |

## Amendment 01 addition: keep-list (completed before any cleanup step removes anything)

Proposed by the QA Executor, approved by the QA Lead. Never listed: credentials, passwords, tokens, links, cookies, sign-in state, browser profiles, raw authenticated traces.

| Asset | CR mapping | Pass checkpoints | Fixture specification | Permitted effects | Actual result | Candidate it passed on | Keep? |
|---|---|---|---|---|---|---|---|
| AUTOMATION/Q2/auth.mjs, guards.mjs, readiness.mjs | CR-01/05/06 setup | evidence/Q2/01/q2-guard-controls.json; portal-helper-validation.json | Existing designated SCRATCH cast only; private cast external | Authorized bounded sessions/sign-outs; no email | Guard controls and five initial Portal role sessions passed; later isolated confirmation timeout F20 remains unresolved; not email/handoff proof | Candidate pair in QAM_APPROVAL | HOLD reusable status pending F20 adjudication; Friday decides |
| AUTOMATION/Q2/measure.mjs, browser-controls.mjs | CR-11/12 | evidence/Q2/01/browser-controls.json | Synthetic offline controls; running candidate for measurements | Reads only | Controls passed; gradient/image backgrounds explicitly unsupported, not silently passed | Candidate pair in QAM_APPROVAL | PROPOSE KEEP with stated limit |
| AUTOMATION/Q2/source.py | CR-11; AC-B01/B02/N02/R03 | evidence/Q2/03/source-controls.json and source-results.json | Exact repository candidates | Local reads only | Controls and zero-color-match scan passed; token declarations and logo hashes match | Candidate pair in QAM_APPROVAL | PROPOSE KEEP |
| AUTOMATION/Q2/doc-checks.py | CR-11; AC-E01 | evidence/Q2/03/document-controls.json | Original/prepared exported template | Local reads only | Corrected controls passed; initial failure retained separately F05 | Candidate pair in QAM_APPROVAL | PROPOSE KEEP corrected version |
| AUTOMATION/Q2/pricing-boundary.test.ts | CR-07 | evidence/Q2/03/pricing-boundary.log | Synthetic unit doubles only; no live fixture | None; quote dependency mocked | 6 tests passed; source/unit level only | Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549 | PROPOSE KEEP |
| AUTOMATION/Q2/gating.py | CR-01 through CR-12 underlying unit selection | evidence/Q2/01/ob-gating.json; pp-gating.json; runner controls | Clean isolated lockfile installations | Local build/test processes | Both candidate suites, typecheck and lint passed; controls detected seeded failing test | Candidate pair in QAM_APPROVAL | PROPOSE KEEP |

QA Lead approval of the keep-list: NOT RECORDED.

## Q2 running note

No cleanup or retention decision has been executed. Real QA builds remain serving on 3100/3101 until Tony explicitly confirms the walkthrough finished. The external private cast is not owned by this campaign and is not approved for deletion. The mock build was served only for the authorized bounded check and has been stopped; both real builds are serving again. This is a provisional keep-list only; remaining scripts await their completed controls/results. No sign-in state is retained or proposed for keeping.

Continuation keep-list qualification: auth helper reuse remains on HOLD under F20. Raster/focus instruments retain coverage limits F19; no failed or incomplete campaign is listed as a passing reusable journey. Corrected public radio-proxy controls/diagnostic, public-state pixel captures, and Owner B short-history boundary have their specific completed evidence in Q2/15,20,25,19; Friday decides retention. No cleanup performed.

## Final Q2 retention proposal

The keep candidates in the installed table are proposals. Retain the corrected source/document checks, clean-install suite runner, scoped pricing unit probe, and bounded measurement controls with their stated limits. Also propose keeping the Owner B read-only short-history reference (owner-b-boundary.mjs, Q2/19) and the corrected nontext control/proxy diagnostics (nontext-controls-v2.mjs, nontext-proxy-controls.mjs, nontext-proxy-diagnostic.mjs, Q2/15 and Q2/20) if Friday accepts their controls and applicability. A later runtime reuse still needs the existing authorized fixture/session guards. The auth helper remains HOLD under F20. Keep the J-e and J-h scripts as evidence only. They consumed one-time effects and are not proposed reusable. Preserve first failures. Keep no credential, sign-in state or browser profile. Retention, cleanup and reuse approvals remain Friday's.

## Q4 retention proposal

Propose keeping the read-only manifest check and commit verifier, the build and runtime identity checks, the independently controlled geometry and rendered-pixel measurement code, and the corrected settled-read diagnostics as scoped QA instruments. See evidence/Q4/01, /03 and /05. Keep the raw first failures with their diagnostics. Keep the fixture sign-in helper on HOLD pending F20 disposition. Preserve incomplete routes as evidence. Friday retains all retention decisions.

## Executed cleanup · 28 November 2026

Friday issued the retention decisions in certificate section 8. All evidence, first failures and AUTOMATION helpers are retained, with their recorded qualifications. The earlier proposals and execution history above remain on record.

| Action | Outcome |
|---|---|
| Processes and ports | QA servers and owned browsers were already stopped. Ports 3100 and 3101 were clear before and after. No running process identified by the owned QA roots. |
| Isolated build copies | Removed 10 real application copies from Q1, Q2, Q4, A2 and A3, two mock copies from Q2 and Q4, and two saved prior Next builds from the Q4 restart. All 14 paths verified absent. Exact paths in evidence/CLEANUP/cleanup-actions.json. |
| Retention | Kept the QA lane, earlier packages, helpers, failed attempts, loose evidence and browser tool installations. The pooled browser binaries remain available for future tooling. |
| SCRATCH and provider | SCRATCH accounts and pharmacies preserved as-is. Stripe sandbox objects created by QA: none created. No service access or fixture operation during cleanup. |
| Credentials | The Director’s private cast remained under his control and was never opened during cleanup. The Director authorized a pattern scan. No private-value comparison was performed. |
| Local scope | Read-only Git checks found zero changes outside the QA lane before and after removal. DEV, alpha, Coach’s data and the rehearsal account were untouched by this cleanup. |
| Privacy and export | See evidence/CLEANUP/retained-scan.json and HANDOFFS/GATE_Q_CLEANUP_EXPORT_RECEIPT.json for the retained-output and final archive verification. |
| Acceptance | Pending Friday, QA Lead. |

