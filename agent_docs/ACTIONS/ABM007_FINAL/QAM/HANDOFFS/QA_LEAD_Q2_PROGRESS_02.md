# ABM007_FINAL · Q2 progress return 02

**To Friday, QA Lead · From Cody, QA Executor · 25 November 2026, 08:15 BDT**

**Q2 is in progress under scope 1.** This interim update follows your Q2 in-run rulings 01 and covers the evidence recorded since progress return 01. Final adjudication follows the Director’s walkthrough and the outstanding invitation and removal work.

Both candidates are on `qa/abm007-final`. OwedBook is `2e91e90905b2d9907577a64985e643f7827019ac` and Account & Billing is `fc1fa6c2a90ebf59987287ad765e2e65cf635549`. The last saved runtime verification identifies the real production builds on ports 3100 and 3101 against SCRATCH. F24 records why the compiled build-info labels are insufficient and how source hashes and build lineage establish identity. Plan SHA-256 is `6a1abc2ae4187874e6c755d195d5ab6fc060c4f26d92520b6df6bc8cf9c73c7d`. The plan is bound as amended by Q2-A1, confirmation pending. See [the amendment diff](evidence/Q2/14/Q2-A1.diff) and [the runtime receipt](evidence/Q2/22/real-ready.json).

| Item | Result and evidence |
|---|---|
| O-1 / F12 | All 30 original attempts remain INCOMPLETE. F12 is a plan defect per your ruling. The amended route had 17 COMPLETE, 2 INCOMPLETE and 5 NOT RUN out of 24 planned positions. Chromium and WebKit completed eight each. Firefox completed one, timed out on two, and a failed warm sign-in prevented five warm routes. No historical Portal sign-in redirect was seen in the 19 started routes. Overall coverage remains incomplete. [Amended runs](evidence/Q2/16/summary.json) |
| J-i / F11 | On Owner A, paging increased the list from 50 to 100 distinct events with reads included. The earlier short-history count was a recon error. On Owner B, a read-only count of 14 was below the page size and the UI showed eight rows with no older-page control. The boundary passed on that observed fixture. [Audit count correction](evidence/Q2/06/audit-scope-reconciliation.json) · [Owner B boundary](evidence/Q2/19/owner-b-audit-boundary.json) |
| J-b / F15 | The app handoff was separately observed using a password session. The single hosted billing opening remains INCOMPLETE. One app POST was observed. Response status, body and server logs were unavailable, and the provider session is unknown. Source uses same-tab navigation, which matched the test wait. The evidence establishes neither an app failure nor test fault, so the conditional second opening was unused. [Password handoff](evidence/Q2/12/password-handoff-diagnostic.json) · [Billing diagnosis](evidence/Q2/17/billing-saved-diagnosis.json) |
| Contrast and links | Rendered gradient sampling used the worst measured background. F18 proposes a contrast failure for disabled Profile fields at about 2.43:1. F21 records the muted-gray Profile support link. Screen and state gaps prevent a complete contrast or focus result. Raw measurement counts do not establish passed journeys. [Unmeasured contexts](evidence/Q2/23/CONTRAST_NOT_RUN.md) · [Reconciliation](evidence/Q2/23/rendered-reconciliation.json) |
| Real table and mock Admin | Reads against existing fixtures did not establish a populated real table. OwedBook mock mode rendered 25 demo rows. Mock Admin remains BLOCKED by the unchanged global-admin guard because all cast identities have the global Member role. The initial probe failure and its qualification are retained. [Table observations](evidence/Q2/24/owner_a.json) · [Mock qualification](evidence/Q2/21/mock-runtime-qualification.json) |

The [execution report](QAM_EXECUTION_REPORT.md), [36-criterion matrix](AC_EVIDENCE_MATRIX.md), [journey results](evidence/Q2/23/JOURNEY_RESULTS.md), [CR-01–CR-12 mapping](evidence/Q2/23/CR_JOURNEY_RECONCILIATION.md) and [findings register](FINDINGS.md) give the current record. Product findings remain proposals for your adjudication.

| Outstanding work | Dependency |
|---|---|
| HC-01, HC-02, HC-04, HC-05, HC-06, HC-07, HC-08 | Tony runs worksheet 03 with JARVIS and returns his observations, results and times. HC-03 was removed by Director ruling. Auth email configuration is enabled on SCRATCH, with delivery and redirect behavior pending the human checks. [Mail readiness](evidence/Q2/22/mail-readiness.json) |
| J-e | Wait for Tony’s inbox signal before sending the single invitation and then wait for his acceptance. The Invitee-only mail allowlist is ready. Confirm the expected scope of the newly granted pharmacy against the Invitee’s existing pharmacy before judging the visibility assertion. |
| J-h and AC-F01 follow-up | After J-e, make the planned cancel and confirmation for the designated Member, then check removed access, zero-store behavior and store visibility. |
| J-c, J-d, J-g | BLOCKED by the Director’s provider hold. These leave AC-R04 incomplete under its all-ten requirement. |

**Effects recorded** · 112 successful helper sign-ins. The conservative planning count is 115 of 150, including three failed token setups. Human counts are pending. The first billing attempt used its released opening. Executor sign-in emails are 0 of 4. Invitation, invitation email and acceptance are each 0 of 1. Member cancel and confirmation are each 0 of 1. Charges, subscription changes and listener starts are zero. [Effects ledger](evidence/Q2/effects-progress.json)

**At final adjudication**, please confirm Q2-A1 against its exact diff and decide the incomplete O-1 coverage, F15 billing evidence gap, the contrast and link findings and measurement gaps, real-table and mock fixture limits, and F24 provenance. Tony’s remaining inputs are his inbox signal, the Invitee scope clarification and the seven walkthrough responses. The provider hold remains in force pending his decision.

This ZIP contains selected existing evidence for those decisions. It omits the full per-screen and per-instrument record, which stays in the QA evidence lane for the final return. The pre-export state is included. This export used saved files only.
