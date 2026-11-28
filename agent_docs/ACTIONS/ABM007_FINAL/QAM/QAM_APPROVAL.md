# QAM_APPROVAL — `ABM007_FINAL`

**Owner:** QA Lead (decisions); Director (release references) · **Written:** between the shots; retest approvals appended · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

Kept separate from the plan so the plan's hash does not refer to itself. Text here is entered by its owner, or transcribed by the Executor only when expressly told to, word for word, with attribution.

## 1. Q1 decision (QA Lead)

| Field | Value |
|---|---|
| Decision: APPROVE, APPROVE WITH EXACT AMENDMENTS, or HOLD | APPROVE WITH EXACT AMENDMENTS — QA Lead, 24 November 2026; verbatim text below |
| Date, source of the decision (document name) | 24 November 2026; QA_LEAD_DECISION_ABM007_FINAL_Q1_02_2026-11-24.md |
| Q1 package reviewed: filename and SHA-256 | NOT RECORDED |
| Candidate pair (full SHAs) | NOT RECORDED |
| Contract identity: spec and rulings version and SHA-256 | NOT RECORDED |
| Environment identity approved | NOT RECORDED |
| Exact amendments, numbered, verbatim | NOT RECORDED |
| Limitations accepted into the plan | NOT RECORDED |
| Blockers, if HOLD, each with owner | NOT RECORDED |

QA_LEAD_DECISION_ABM007_FINAL_Q1_02_2026-11-24.md, sections 1, 3 and 4; supplied verbatim in Tony’s instruction. Transcribed by Cody at Tony’s express direction; words below are Friday’s, not Cody’s approval.

## 1. Decision

**APPROVE WITH EXACT AMENDMENTS.**

The plan is sound in shape and honest about its gaps. It is not bound yet. The QA Executor applies the amendments in section 5 exactly and returns the amended plan. I check that the changes equal the amendments and then bind the plan by its hash. Only after that can the Director release Q2.

This is not a Q2 release and not a product verdict. No effect is authorized by this document.

**Basis and limits of my review.** I verified the index and read in full: the entry note, the amendment-application record, the decisions list, the recon report, the test plan, the effects proposal, the findings, and the small evidence files (sessions, guard controls, fixtures, build result, privacy check, integrity correction). I sampled the per-asset inventory and did not read all of it. I did not have the repositories; statements about source lines are the QA Executor's.

## 3. Rulings the QA Executor asked me for

**3.1 AC-R03 and the OwedBook `RECOVERY.md` change.** The baseline-to-candidate diff includes a `RECOVERY.md` change that sits in commit `c335671`, a records-only commit made before this module's engineering. The Director's ruling AM-08 (3) kept the baseline and explicitly preserved that commit.

*Ruling:* AC-R03 is judged on the engineering change set. The `RECOVERY.md` change in `c335671` is recorded as a documented exception under AM-08 (3), which is the Director's authorization. It is not a failure of AC-R03, on one condition the QA Executor must show in Q2: the diff from `c335671` to the candidate does not touch OwedBook's `RECOVERY.md`. Both facts stay on record. Nothing is waived silently.

**3.2 Audit paging, AC-R04 (i).** Owner A's existing history has 567 entries with "Include reads" on and 42 without. The page size is 50.

*Ruling:* the existing SCRATCH history qualifies as the bounded synthetic fixture the criterion asks for. No seeding is needed. Paging is exercised with "Include reads" on, which is a real product setting. I also approve the extra boundary check with it off, where the history is shorter than one page. The result comes from the running app in Q2, never from the row count.

**3.3 O-1.** Kept for the bounded Q2 reproduction. I adjudicate after the runs. An interrupted route is incomplete.

## 2. Plan binding (QA Lead)

| Field | Value |
|---|---|
| Current bound plan SHA-256 (after Q2-A1) | 6a1abc2ae4187874e6c755d195d5ab6fc060c4f26d92520b6df6bc8cf9c73c7d |
| Q2-A1 exact diff confirmed by | Friday, QA Lead, as relayed by Tony, Director |

Transcribed word for word by Cody on Tony’s instruction. Attribution: Friday, QA_LEAD_Q1_BINDING_ABM007_FINAL_2026-11-24.md §1.

## 1. Binding

**The Q1 test plan is APPROVED and BOUND.**

| Field | Value |
|---|---|
| Bound plan | `QAM/QAM_TEST_PLAN.md` |
| Bound plan SHA-256 (computed by me) | `90fce657fe5625c17f30273cf7c995c5165e70ba861c6b615eb8e09176bc5237` |
| Candidate pair | OwedBook `2e91e90905b2d9907577a64985e643f7827019ac`; Payment Portal `fc1fa6c2a90ebf59987287ad765e2e65cf635549`; both on `qa/abm007-final` |
| Decision this binds | `QA_LEAD_DECISION_ABM007_FINAL_Q1_02_2026-11-24.md`, APPROVE WITH EXACT AMENDMENTS |
| Selected human checks | HC-01 to HC-08 |
| State after this binding | `APPROVED — NOT RELEASED` |

**This is not a Q2 release.** Only the Director releases Q2. No effect is authorized by this document. Any change to the plan after this point changes its hash and needs a new binding.

### Q2-A1 binding confirmation

**Friday, QA Lead** (relayed by Tony, Director, recorded by Cody on 25 November 2026, 09:20 BDT). Friday checked Q2-A1 against its exact diff and confirmed the amended plan is bound at SHA-256 `6a1abc2ae4187874e6c755d195d5ab6fc060c4f26d92520b6df6bc8cf9c73c7d`. Cody recomputed the hash from the saved plan and matched it. The amendment diff is `evidence/Q2/14/Q2-A1.diff`.

## 3. Conditions that must be true before release

| Condition | Met? Evidence |
|---|---|
| Event isolation PROVEN, or the Director's authorization of one specific alternative (needed for paid tests only) | NOT RECORDED |
| Effects envelope approved by the Director, with the ceiling as a maximum | NOT RECORDED |
| QA Executor assigned by the Director | NOT RECORDED |
| Audit paging fixture planned, or its BLOCKED disposition recorded | NOT RECORDED |
| Credential file created by the Director, proved ignored and untracked | NOT RECORDED |

## 4. Q2 release (Director)

| Field | Value |
|---|---|
| Release reference, date | Tony: DIRECTOR RELEASE — Q2, SCOPE 1. 24 November 2026, received in conversation |
| Records commit(s) by the Director | NOT RECORDED |
| Scope released: all of the plan, or nonpayment work only | scope 1, non-provider; J-c/J-d/J-g held |

## 5. Retest approvals (only if a repair is ruled)

| Round | Repaired pair | Retest scope | QA Lead approval | Director release |
|---|---|---|---|---|
| none | | | | |

## Amendment 01 additions (owner: QA Lead)

| Field | Value |
|---|---|
| Selected human checks (IDs) | HC-01 through HC-08; QA Lead verbatim selection below |
| Proposed human checks removed or moved to automation, with reasons | NOT RECORDED |
| Regression selection accepted, with any exact amendments | NOT RECORDED |
| Automated sign-in method confirmed as not needing the Director's inbox | NOT RECORDED |
| Human checks the Director must repeat after a repair (per retest round) | none |

### Verbatim QA Lead human selection — Q1 return 02

QA_LEAD_DECISION_ABM007_FINAL_Q1_02_2026-11-24.md, sections 1, 3 and 4; supplied verbatim in Tony’s instruction. Transcribed by Cody at Tony’s express direction; words below are Friday’s, not Cody’s approval.

## 4. Human walkthrough: selected set

I select all eight proposed checks. They match the provisional set from my interim decision.

| ID | Check | Status of its prerequisite |
|---|---|---|
| HC-01 | Password sign-in, cross to the other app and back, sign out, protected pages refuse | Ready |
| HC-02 | Keyboard pass, one screen per app | Ready |
| HC-03 | Real phone: both menus, the OwedBook table, Help | **Needs the Director to name an available phone.** If he records that none is available, I take HC-03 out of the required set on his written word, and an emulated screen is not called a real-device pass |
| HC-04 | Each app against the approved renders | Ready |
| HC-05 | No flash of the old dark look on Windows Chrome | Ready |
| HC-06 | Emailed-link sign-in to OwedBook; used link refused; fresh link works | **Needs an inbox the Director can open, and the email effect approved** |
| HC-07 | The same for Account & Billing | Same |
| HC-08 | Read two Help sections for sense and correct labels | Ready |

Moved to automation, as before: role-by-route navigation and billing denial; Member Help links and the redirect.

The estimate of 35 to 45 minutes plus email waiting is the QA Executor's estimate. Required human checks left PENDING or BLOCKED are never reported as passed, and I issue no pass over one unless the Director removes it from the required set in writing.

## Director release and updated human disposition — 24 November 2026

Tony explicitly releases Q2 scope 1, non-provider. Designated SCRATCH cast only; existing Invitee may join QA auth allowlist after existence check. Session planning ceiling 100, no automatic sign-in retry; four Owner sign-in emails; one Owner A invitation/email/acceptance to existing Invitee, no resend/revoke; one cancel then one confirmed removal of ENGINEERING_MEMBER as last Member action; one Owner A billing-portal inspection session without setting change; audit reads. No purchases/subscription changes/listener/new sandbox/fixture creation/reset/credential change/DEV or rehearsal change/product edit/Git mutation/deployment. J-c/J-d/J-g remain held unless separately released.

Director ruling: no real-phone test required. HC-03 removed from required set, not PASS; bound plan untouched, automated phone-width checks retained. Required desktop Google Chrome human set: HC-01, HC-02, HC-04, HC-05, HC-06, HC-07, HC-08. Director performs and answers one at a time; no prefilled answer. Inbox checked in memory; only role mapping retained.

## Q2 in-run ruling 01 — supplied authority, recorded by Cody

Friday and Tony continuation recorded in HANDOFFS/Q2_INRUN_RULINGS_01_RECORD.md. This is not final Q2 adjudication. Exact Q2-A1 replacement only: evidence/Q2/14/Q2-A1.diff; previous plan bytes retained. New plan SHA-256 `6a1abc2ae4187874e6c755d195d5ab6fc060c4f26d92520b6df6bc8cf9c73c7d`; status **bound as amended by Q2-A1**, confirmed by Friday. Tony raises session ceiling to150 and allows build swaps tonight. A second Owner A billing opening is conditional on saved evidence establishing test fault; no unconditional retry released. Invitee acceptance is performed by Tony; execution waits after one invitation is sent. Provider-event journeys remain held; seven human checks pending tomorrow.

### 26 November Director walkthrough follow-up

Tony’s separate answers, reported about 12:01 BDT, are recorded verbatim in evidence/Q2/27/DIRECTOR_LATER_ANSWERS.md. HC-04 overall and HC-06 overall were reported PASS. HC-04’s specific 768px failure and requests are retained. HC-05’s Ubuntu Chrome observation was reported PASS, while the sheet’s Windows BLOCKED state remains historical evidence and the Windows check was not exercised. No equivalence ruling is inferred. Tony’s separate OwedBook opening-page ruling is held by Friday and referenced in HANDOFFS/Q2_FINAL_DECISIONS.md. The plan bytes and Q2-A1 binding are unchanged.

### Q4 release and entry amendment 01, 26 November 2026

Scope: Friday's Q4 order for RWO-01/A1. Tony released section 6 effects only. His 14:36 ruling replaces the commit-at-entry gate with a SHA-256 manifest of each repaired working tree, with certification held until his eventual commit. See QAM_STATE.md and evidence/Q4/01. No Gate D, Owner B automation, normal email, fixture or provider writes.
