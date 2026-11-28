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
