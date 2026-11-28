# GATE_D_PLAN — `ABM007_FINAL`

**Owner:** QA Lead (plan and record); Director (every action and observation); Engineer (deploys on authorization). **Status: PLAN, NOT EXECUTED. Not yet approved.** It must be approved before any deployment.

## 1. What this Gate D is, and is not

It is the short deployed check of this module: the two alpha services after redeploy, the branded sign-in email on the DEV project, the Stripe sandbox branding, and the Director's ride. It covers AC-D01, AC-D02, AC-E02, AC-E04 and the deployment-record part of AC-E03.

It is **not** the verification of deferred lifecycle or payment work. Scheduler-driven expiry, real cutoff, notices, forced payment exceptions, exactly-once on the later repair paths and provider retry belong to a separate, separately authorized work order (`../CONTRACTS/BACKLOG_DISPOSITIONS.md` section 7). Passing this plan closes none of them.

## 2. Preconditions

| # | Precondition | Owner | Met? |
|---|---|---|---|
| 1 | Gate Q verdict issued for the pair, and cleanup accepted | QA Lead | NOT RECORDED |
| 2 | This plan approved | Director | NOT RECORDED |
| 3 | Session S1 exports exist: original email body and subject, redirect allow-list, sender, Stripe baseline previews | Director | NOT RECORDED |
| 4 | Gate D invitation fixture nominated: an existing alpha Owner account with one pharmacy, not the rehearsal account | Director | PENDING |
| 5 | Prior revision of each alpha service recorded, for rollback | Engineer, read-only | NOT RECORDED |
| 6 | Deployment authorization, one service at a time | Director | NOT RECORDED |

## 3. Permitted effects

| Effect | Permitted |
|---|---|
| Redeploy of each alpha service with its existing `./deploy.sh` | Yes, on the Director's authorization for that service |
| Email template apply on the DEV project; Stripe sandbox branding apply | Yes, by the Director, in session S2 |
| Sign-in emails | Up to eight |
| Invitations and Member memberships on the invitation fixture | Up to two each; removed afterwards with the product's own flow |
| DEV-backed local builds for the local rows | Yes, started by the Director; no Stripe listener; no billing action |
| Any purchase; any change to the rehearsal account's pharmacies, invoices or history; any scheduler; any migration; any code change | **No** |

## 4. Steps (one at a time; the QA Lead reads each step to the Director and records his answer before the next)

| Step | What | Criterion | Expected | Result | Evidence |
|---|---|---|---|---|---|
| D1 Identify | For each service: commit deployed, new revision name, time, clean committed tree | AC-D01 | Commit equals the certified pair or a records-only successor proved by full diff | NOT RUN | |
| D2 Availability | Canonical HTTPS address of each app loads; build-info read-back shows the commit; the other services unchanged | AC-D01 | As stated | NOT RUN | |
| D3 Sign-in and session | Director signs in to both apps; moves between them without a second sign-in; signs out | AC-D02 | Works; light theme; new brand | NOT RUN | |
| D4 Core look | Help opens from the navigation; dashboard, Account & Billing and Add Pharmacy screens show the brand; **no purchase** | AC-D02 | As stated | NOT RUN | |
| D5 Dependencies | Rehearsal account unchanged: three pharmacies active, three at renewal. Notice check: no notice claimed or retrying when the wording went live | AC-D02, AC-E03 | As stated | NOT RUN | |
| D6 Timing | First load after deploy and a reload: no flash of dark theme, no unstyled first paint | AC-B04 on alpha, observation | No flash | NOT RUN | |
| D7 Logs | Engineer reads service logs for errors since deploy, read-only | AC-D01 | No new error class | NOT RUN | |
| S2 Apply | Director applies the email body and subject, and the Stripe values; old body kept ready | AC-E02, AC-E04 | Applied | NOT RUN | |
| D8a Email matrix | Rows E02-1 to E02-6 of `../CONTRACTS/EMAIL_AND_STRIPE.md` 1.2, one at a time | AC-E02 | Each as stated; E02-6 may be NOT SUPPORTED | NOT RUN | |
| D8b Stripe previews | Four previews after apply; billing portal opened for an existing fixture customer; no purchase | AC-E04 | Brand shown | NOT RUN | |
| D9 Rollback readiness | Prior revision of each service named and routable; original email body on hand; Stripe baseline screenshots on hand | all | Ready | NOT RUN | |

## 5. Record (QA Lead)

| Field | Value |
|---|---|
| Date; services and revisions verified | NOT RECORDED |
| Rows passed, failed, not supported, blocked | NOT RECORDED |
| Anything rolled back | NOT RECORDED |
| Statement: Director-observed, QA Lead-recorded | NOT RECORDED |
| Final acceptance by the Director | NOT RECORDED |

## 6. Rollback

A failed deploy step: route traffic back to the prior revision of that service; record it; the other service is not touched. A failed email row caused by the template: paste the original body and subject back. A wrong Stripe value: restore from the baseline screenshots. Each rollback is the Director's action.
