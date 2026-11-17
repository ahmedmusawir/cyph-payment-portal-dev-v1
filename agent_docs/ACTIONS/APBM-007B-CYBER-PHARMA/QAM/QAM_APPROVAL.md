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

### Tony release — transcribed by Cody, 17 November 2026

Source: Friday release message sent by Director Tony in current conversation. Q2 RELEASED for Portal product427bec6267b9777e9cb44f81c22d1396a495bc14 and OwedBook c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea, both qa/apbm-007b; approved plan before release records606034367290d798cf7b6ad10ad1494105933b5189b9cee97b6cc18e4926f0c0, with QL01–10. Portal QA records/execution HEAD61b683ab2aeeb18905666a56feed2d2513b6e6c5. Product SHA stays427bec62. PF00 first; dependent effects held on environment failure.

Plan after release record lines SHA-256: 794c4d9c7877d585a47abb6630e03984d6a038f475dfdb5c284a3cd0c4d74f2c


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

## Adjudication and effects approval — supplied sections B/C

Transcribed by Cody from current message, attributed respectively to Friday and Tony, 2026-11-17. Later supplied release supersedes pending Director status in earlier block.

B. QL-01 ADJUDICATION a01 (QA_LEAD_ADJUDICATION_APBM007B_Q1_a01_2026-11-17.md, SHA-256 2f28f72581e1da8601d2b0a3beb40e129f5b3cbe68cb37a5e77db1ab1b301d61)
Contract identity CLEARED 12/12. I read both diffs in your REVIEW_02 package (SHA-256 b0d6640e76d27b234602c134b86f558826dc2e7bb04168c79bacfd7b1ef70340). APBM_RULINGS.md and ENVIRONMENT_AND_EFFECTS.md differ from the pack as used for E2 by the header line plus append-only Director entries dated 17 November 2026; no earlier line changed; the current repository files govern. All QL-01 holds are lifted. No plan edit is required: T-020, T-022, T-029 and T-031 already cover the appended rulings. Engineering's raised ceilings are Engineering's E2 envelope only; QA runs its own fresh ledger and borrows nothing.

C. DIRECTOR APPROVALS (Tony, 17 November 2026)
- QA effects envelope approved exactly as proposed in plan section 5.
- One sandbox full refund approved for the QL-07 refunded-operation closure subcase; remove the "pending Director approval" marking.
- Private QA inputs are prepared; no further credentials come from the Director.

## Runtime ownership ruling record — 2026-11-17

Friday, Director-approved current conversation: QA owns production candidate3100/3101, SCRATCH, one sandbox listener→3101, private session secret, Director apps untouched/listener off; exact selected handled events in owned setup evidence. Plan record SHA-256 b79bbee036ae18c7e471d6358c2423dd5520c9628ee0a6ab7e64458330927f38. No new product identity or plan review inferred.

### Q2 adjudication a01 — transcribed 2026-11-17 by Cody

Friday adjudication a01, supplied by Director Tony in current conversation, 17 November2026; QA_LEAD_ADJUDICATION_APBM007B_Q2_a01_2026-11-17.md SHA-256744a2d2d4795b6894f7397b7d97d0d5fa196f4a40005115d3e8339347b422c5e (attributed supplied reference; no independent attachment invented).

Director Tony budget amendment, 17 November2026: provider mutations80→240 total, last20cleanup; sign-ins48→96; identity creation attempts10→14; unique identities≤10, no new addresses. All other limits unchanged; counters preserved, nothing reset. Friday directs first unchanged WebKit staff spec3x, then item4 unaffected tests on current candidate. Hold late payment, consent expiry/void race, in-flight payment crash and refunded-operation closure for repaired candidate. Retain activated F-Q2-001 store, no refund or cleanup. Do not pull/rebind during Engineering repair; require Director repaired pair and Friday retest scope.

## Friday continuous-Q2 correction — transcribed by Cody, 2026-11-17

Friday correction supplied by Director in current conversation replaces a01 items5/6: no repair during Q2; Engineering stopped. Continue approved plan to Q2 COMPLETE on Portal427bec6267b9777e9cb44f81c22d1396a495bc14/OwedBookc8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea. Holds lifted for consent-expiry/void race/in-flight crash. Refund closure only if paid-but-not-activated naturally produced, else BLOCKED BY F-Q2-001; never refund activated retained store. F-Q2-001/F-Q2-003 disposition rows preserved; no routing to Engineering until complete. Existing budget amendment stands. Prepare single grouped Director session near end. Return only playbook stop/limit/Q2 complete.
