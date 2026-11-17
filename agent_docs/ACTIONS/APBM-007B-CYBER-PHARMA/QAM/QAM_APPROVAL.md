# QAM_APPROVAL — `APBM-007B-CYBER-PHARMA` (QA Lead decisions and Director releases)

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/QAM_APPROVAL.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §9 and §13. **Owners: §1, §2 and the QA Lead columns of §4 — QA Lead only (the decision); §3 and the Director columns of §4 — Director (release references).** Kept separate from the plan so the plan's hash is not self-referential. **Ownership vs transcription:** the decision belongs to the QA Lead and the release to the Director. The QA Executor may **transcribe** the exact supplied text into this file only when expressly instructed to, attributing it (author, source, date) — it never composes, infers or reconstructs a decision or release. **An empty decision means no approval exists.**

## 1. QA Lead review of the Q1 package

| Field | Value |
|---|---|
| Q1 package reviewed (path, SHA-256 from the external receipt, member count) | NOT RECORDED |
| Reviewed the actual package, not only the Executor's summary | NOT RECORDED |
| Decision | NOT RECORDED — one of `APPROVED` · `APPROVED WITH EXACT AMENDMENTS` · `HOLD (blockers listed)` |
| Blockers (if HOLD; each with owner and required resolution) | |
| Exact amendments (if any; each is an exact edit the Executor applies verbatim and records as a diff in `QAM_TEST_PLAN.md` §8) | |
| Q1b bookkeeping | `NOT RECORDED — owning seat authors at its phase` |
| Decision source (QA Lead seat, runtime, date, time zone) | NOT RECORDED |
| Transcribed by (only if the QA Lead's exact text was transcribed on instruction) and source of the text | n/a |

## 2. Binding (what exactly is approved)

| Field | Value |
|---|---|
| Product candidate (full SHA) | NOT RECORDED |
| Plan identity: `QAM_TEST_PLAN.md` SHA-256 after amendments | NOT RECORDED |
| Contract identity (spec version/hash) and rulings in force | NOT RECORDED |
| Environment / target identity | NOT RECORDED |
| Limitations accepted at approval | NOT RECORDED |
| Required release conditions (what the Director must do before Q2) | NOT RECORDED |

A new product/config/test change after this binding invalidates it and requires QA Lead review of the changed scope. A documentation-only successor is proved by reviewing the **complete** candidate→HEAD diff (file contents, not a `--stat` summary), never assumed from a commit message. Tested product SHA, QA execution HEAD and evidence/closeout commit are recorded as three different identities.

## 3. Director release (Q2)

| Field | Value |
|---|---|
| Records committed (which files, commit SHA on `qa/apbm-007b`) | NOT RECORDED |
| Release statement (Q2 released for candidate `NOT RECORDED — owning seat authors at its phase` under plan `NOT RECORDED — owning seat authors at its phase`) | NOT RECORDED |
| Credential file created (`.env.qa.local`; keys by name only) | NOT RECORDED |
| Release source (Director, date, time zone) | NOT RECORDED |

## 4. Later decisions in the same engagement (append-only; Q4 retest scope, repaired candidates)

| Date | QA Lead decision (retest scope approved; plan §7 SHA-256) | Repaired candidate (full SHA, from the Director's commit receipt) | Director release for Q4 (reference, date) | Recorded by (seat; "transcribed" if applicable) |
|---|---|---|---|---|
| | NOT RECORDED | | NOT RECORDED | |

`RELEASED FOR Q4` requires all three: the repaired candidate identity, the QA Lead's retest-scope approval and the Director's release (`QAM_ENTRY.md` §5).

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*

## Friday decision — transcribed by Cody, 2026-11-17

Author: Friday, QA Lead. Source: exact decision and explicit transcription instruction supplied in current conversation. File/hash reference below is attributed to Friday; not an independently verified attachment. This dated block supersedes unfilled template cells above.

QA LEAD PLAN APPROVAL — APBM-007B — 2026-11-17
Decision: APPROVED WITH EXACT AMENDMENTS QL-01..QL-10 (QA_LEAD_DECISION_APBM007B_Q1_01_2026-11-17.md, SHA-256 304be11445b91494c98605f76f6e89406860d1f43d51c5bb7e3964b7d885af95)
Candidate pair: Portal 427bec6267b9777e9cb44f81c22d1396a495bc14; OwedBook c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea (qa/apbm-007b)
Plan reviewed SHA-256: f5e40b504a81efb386ed14ed2a59f996707260d2c2b0cd67518425d06ebf331c
Plan as amended SHA-256: 606034367290d798cf7b6ad10ad1494105933b5189b9cee97b6cc18e4926f0c0
Contract identity: build pack as used for E2; header-line difference only; QL-01 check: 10/12 match; APBM_RULINGS.md and ENVIRONMENT_AND_EFFECTS.md mismatch (dependent tests held; supplied header-only premise not established for these two files)
Environment: QA production builds on 3100/3101, SCRATCH, Stripe sandbox, local listener; DEV read-only
Limitations: automatic event delivery first proven in Q2; seller-history screen not built; refund-proof subcase per QL-07; U-1..U-3 Director-accepted not QA-certified
Release conditions: amendments applied; QL-01 passes; private QA inputs present; PF-00 basics pass; Director approves the effects envelope and releases Q2
Q2 release: DIRECTOR — pending
