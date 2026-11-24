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
| NOT RECORDED | | | | | | | |

QA Lead approval of the keep-list: NOT RECORDED.
