# QAM CERTIFICATION — APBM-007B-CYBER-PHARMA (Gate Q)

**Date:** 18 November 2026 (Asia/Dhaka)
**Issued by:** QA Lead (Friday)
**For:** Director (Tony)
**Authority:** QAM Playbook v1.0 §11 to §14; Director ruling of 17 November 2026 (QA Lead routes repairs)

## 1. Verdict

**GATE Q: PASS WITH KNOWN RISK.**

The certified pair is fit to proceed to closeout, merge and staging preparation, subject to the Director's acceptance of the known risks in section 5. Every money, access, data and migration rule in the acceptance spec passed on real provider events. What remains is one intermittent screen-timing failure on the WebKit engine, one unexplained one-time sign-in redirect, and stated limits on what was re-proven live on the final pair.

This certificate does not cover Gate D (staging). It is not a deployment approval.

## 2. Certified identity

| Item | Value |
|---|---|
| Portal | `ba66534351368b4b67b9e61d6f0278866950c850` on `qa/apbm-007b` |
| OwedBook | `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871` on `qa/apbm-007b` |
| Database | migrations 0001 to 0070; SCRATCH ledger at 70; DEV at 69 (0070 not yet applied to DEV) |
| Final package | `APBM-007B-CYBER-PHARMA_Q4_REVIEW_02.zip`, SHA-256 `e6dd4520ac255a3a71e63cb71799618c0780c7baf8b1bb558adc3e8c7afb25d6`, 416 indexed members, 0 mismatches |
| Bound plan | SHA-256 `c06196aa44ab3cee181e101a175106a96b7f24e1e941f5754aa0bd38124bbdbb` |

Path to this pair: Q2 on `427bec62` / `c8a2ed9b` (17 November); repair round 1 to `00a9e0e9` / `1fd5a610`, retested in Q4/01; repair round 2 to the certified pair, retested in Q4/02. The Executor confirmed from the diffs that round 2 changed only screen forms and their tests: no server, database, migration, payment or activation code.

**Basis and limits of my review:** I verified every package index and read the start notes, acceptance mappings, findings and the evidence behind each failure and repair. Large evidence files were sampled. I did not have the product source; diff conclusions are the Executor's, checked against the Engineer's declared file lists.

## 3. Result by acceptance criterion

| Criteria | Result on the certified line |
|---|---|
| AC-001, 002, 005 to 021, 024 to 027 | **PASS.** Proven in Q2 or Q4/01 on paths the later repairs did not change; carried with their commits and reasons. |
| AC-003 | **PASS.** Independently computed amounts for ordinary and discounted accounts. |
| AC-004 | **PASS** for payment and activation. One screen-timing failure recorded (KR-1). |
| AC-007, AC-025 | **PASS.** Deadline family 14 of 14 on the test clock and on real time. |
| AC-022, AC-023 | **PASS** as tested in Q2 plus database proof on migration 0070. The final live buyer completion on the certified pair was not run (KR-3). |
| AC-028, AC-030 | **PASS WITH KNOWN RISK.** All repaired forms pass on three engines (15 of 15 loading probes, 18 of 18 real sign-in checks). KR-1 and KR-2 remain. |
| AC-029 | **PASS.** Fresh and upgrade database checks 158 of 158; ledger identity confirmed. |
| AC-031 | **PASS.** No private values in the production bundles. |
| AC-021 to AC-024, support-procedure lane | **PASS.** Six documented operator commands run exactly as written as dry runs. |
| GD-001 | **NOT RUN.** Separate Gate D. |

## 4. Findings — final dispositions

| Finding | Final disposition |
|---|---|
| F-Q2-001 late payment activated a store (High) | CLOSED — repaired, verified in Q4/01 |
| F-Q2-004 unpaid invoice not voided at the deadline (High) | CLOSED — repaired, verified in Q4/01 |
| F-Q2-002 WebKit staff invitation stuck (Medium) | CLOSED — repaired, verified in Q4/01 and Q4/02 |
| F-Q2-005 misleading dashboard sentence (Medium) | CLOSED — repaired, verified |
| F-Q2-006 support runbook missing (Medium) | CLOSED — repaired, verified |
| F-Q4-001 forms lose text typed before the page loads (Medium) | CLOSED — repaired on five forms, verified on three engines in Q4/02 |
| F-Q4-002 WebKit Add Store screen timing (Medium) | NOT A FUNCTIONAL DEFECT; test time budget and performance observation. Accepted as KR-1 |
| F-Q4-003 one-time WebKit sign-in redirect (Medium) | NOT REPRODUCED in 7 further runs; cause unproven. Accepted as KR-2 |
| F-Q2-003 QA reservation timing; F-Q4-004 QA test passwords in debug files | QA instrument issues, CLOSED. Not product findings |

## 5. Known risks for the Director's acceptance

**KR-1. Add Store on the WebKit engine is slow enough to fail the test's 30-second limit about one run in five.** The payment succeeded and the store was activated in every run. Confirm took 9.4 to 14.7 seconds in nine timed runs, and about 40 seconds once. The owner sees disabled buttons while waiting. Follow-up: give the test a realistic time budget, check that the owner sees progress while waiting, and measure confirm time on staging.

**KR-2. One unexplained sign-in redirect on WebKit.** Seen once in Q4/01; seven clean runs since. The sign-in audit table was empty, so the cause cannot be established. Follow-up: watch for it on staging.

**KR-3. The live transfer-buyer payment and the first-store purchase were not repeated on the certified pair.** Both passed live in Q2; the transfer and activation database proof passed on migration 0070; the later diffs do not touch those paths. A fresh transfer was prepared in Q4/02 and stopped before the buyer step because it needs a link from the Director's inbox.

**KR-4. The 90-minute end-of-period guard was not isolated live.** In every live boundary case the stricter 50-cent minimum refused first. The 90-minute rule is proven in the database checks.

**KR-5. The discounted-account case used a sandbox promotion granted to the fixture**, not a customer redeeming a code.

**KR-6. The local event listener missed one of ten paid events on first delivery in Q4/02**; a genuine provider resend processed correctly with no duplicate effect. Cause unknown. The provider's own retry on a permanent endpoint is a Gate D item.

## 6. Standing conditions and backlog (not risks of this build)

1. Gate D not run: permanent webhook endpoint with native retry and outage, deployed scheduler, staging sign-in settings, rollback readiness, individual operator sign-in.
2. Migration 0070 must be applied to DEV under the Director's separate release before merge to main is used against DEV.
3. Legal and consent wording is still required before staging exposure (open since 007A).
4. U-1, U-2 and U-3 remain Director-accepted, not QA-certified.
5. Seller history is available through data and API access only; no screen exists.
6. The shared operator credential proves possession, not an individual's identity. The Director is the approver for the six support actions.
7. Backlog: billing notices show the deadline in UTC only; an operator command prints old "pending Director decision 9" wording; the OwedBook demo-mode invite form has the typing-before-load pattern (not used in live mode).
8. The wrongly activated store from F-Q2-001 exists only on SCRATCH and the sandbox and is removed in cleanup.

## 7. Cleanup point and retention decisions (QA Lead)

Cleanup starts when the Director accepts section 5. It is a closure operation, not more testing.

| Item | Decision | Reason |
|---|---|---|
| Evidence packages, findings, plans, approvals, execution reports, all attempts including failures | KEEP | Certification, reproduction and audit |
| `AUTOMATION/` helpers | KEEP | Reusable for the next campaign and Gate D |
| Stripe sandbox objects carrying the QA run ID: subscriptions, test clocks, customers, open invoices, the prepared transfer's buyer reservation | REMOVE (cancel, delete, void) | No further use; includes the F-Q2-001 store's subscription. No refunds |
| SCRATCH billing-clock test context | REMOVE (disable) | Time seam must not stay enabled |
| SCRATCH business and claim rows | KEEP as is | SCRATCH is disposable and is reset by the next campaign |
| QA sign-in identities on SCRATCH | KEEP the identities; revoke all sessions | Same real aliases are reusable; no live credentials remain |
| Private QA credential file, auth states, links, HAR files, raw traces, browser profiles | REMOVE, after the final value scan | No credential outlives the campaign |
| Builds, dependency copies, local containers, temporary lanes | REMOVE | Disposable |
| Director's processes and files | NOT TOUCHED | — |

## 8. Sequence to closeout

1. Director accepts the known risks (section 5).
2. Executor transcribes this certificate into `QAM_CERTIFICATION.md` §1 to §3 and the retention decisions into `QAM_CLEANUP_REPORT.md` §0 and §3, executes cleanup, and returns the cleanup report.
3. QA Lead accepts cleanup; Director commits the durable records.
4. Release to closeout, then merge of `qa/apbm-007b` in both repos.
