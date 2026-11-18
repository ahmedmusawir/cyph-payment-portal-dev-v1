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

### Q4 release — Friday and Tony, 17 November 2026; transcribed by Cody

Source: QA_LEAD_Q4_BINDING_APBM007B_2026-11-17.md, supplied SHA-256 345553689d5d5825ee80093ca73c5d735a4286500bd630e88924f0a5ad0bf324. Exact supplied approval/release follows:

2026-11-17 | QA LEAD (Friday): retest scope approved per QA_LEAD_Q4_BINDING_APBM007B_2026-11-17.md section 4 | Repaired candidate: Portal 00a9e0e98aadb2bdba830ebe6d8c06fb6902e37d; OwedBook 1fd5a61073e8adaa7997e1ad3c4b1f02d0e7f54d | DIRECTOR (Tony): Q4 released 17 November 2026; Q4 budget approved (provider 400, sign-ins 176, clocks 7, refunds 2, customers 16)

Recorded plan identity after section7 transcription: SHA-256 `49e0ca36b3ba39a47346162fb736880d07950bc9e36478391f3a6c50d18f8305`. Director decision also explicitly raises subscriptions to16; all other limits unchanged, counters preserved. Source attachment identity is attributed as supplied, not independently verified.

### Q4 budget amendment and resume — 18 November 2026

Transcribed by Cody from Friday's current message, approved by Director Tony by sending it, 18 November 2026. STOP_REVIEW_03 SHA-256 926e6c424501c2cc5f08b7d5c33a7185b9cf7c6cb3c19056d12cd4648ac77233 reviewed; STOP-AUTHORITY correct. Original repaired pair and Q4 scope unchanged.

Director budget amendment, counters preserved, nothing reset:
- pay_or_hosted:32→80 cumulative.
- Attempted simulated charges:500000→1000000 cents.
- Read requests:2400→5000.
- Campaign window extended to20 November2026 23:59 Asia/Dhaka (2026-11-20T17:59:00Z).
- Unchanged: provider mutations400(last20cleanup), sign-ins176, test clocks7, refunds2, customers/subscriptions16, email attempts40(8reserved), identity attempts14, unique identities10, SCRATCH cycles as planned.

Before any effect, dry-run the whole remaining Q4 plan against EVERY limit; if any limit would be exceeded, return the required numbers in one message before starting. Director stopping listenerPID3556606→3001; verify before first payment and report any remaining listener in one line, continuing non-provider-event work. Resume per QA_Q4_RESUME and Q4 release; failures are findings, no repair/rebind, all effectsSCRATCH/sandbox, retain everyfixture. Return Q4 COMPLETE indexedpackage or playbookstop.

### Director order via Friday — 18 November 2026: privacy recovery and standing Q4 authority

Transcribed by Cody from the current Director-sent message, attributed to Friday (QA Lead) and Tony (Director). STOP-PRIVACY is resolved. Authorized now: rotate ROLE_OWNER_A_PASSWORD and ROLE_OWNER_B_PASSWORD on SCRATCH, revoke those two identities' QA sessions, keep replacements only in the private0600file, delete the diagnostic, create future diagnostics0600, record as QA instrument issue and resume. If other QA-only SCRATCH test credentials are found in the diagnostic, rotate them similarly and list additional names only.

Standing authority for the remainder of Q4: QA-instrument/file-hygiene problems on QA-only material are fixed, recorded and execution continues. For an approaching sandbox effects limit, Cody may raise that limit by at most50percent of its current value, once per limit, recording before/after/reason; counters never reset. Product failures are findings and execution continues.

Hard stops remain: real money; any write to DEV or outside SCRATCH/Stripe sandbox; product-code/candidate-pair/contract changes; a non-QA-only secret exposed outside this machine; inability to save evidence with integrity; inability to sign in at all. Otherwise decide, record and continue. Finish Q4, indexed package, stop only owned apps/listener, keep fixtures. This authorization overrides the earlier no-credential-change retention restriction only for the stated QA recovery. Existing repaired pair and Q4 scope stay fixed; no repair/rebind.

Executor receipt — Cody,18November2026 (exercise of supplied standing authority, not a new composed Director approval): provider_mutations400→440,10percent, one use for this limit; cleanup20 unchanged. Before-effect remaining whole-plan forecast24 exceeded13ordinary remaining under400, including authorized Auth recovery and final real consent/race/redelivery contingency. Counters never reset. Exact reason/forecast/caps in evidence/Q4/01/effects/standing_authority_limit_use.json and remaining_plan_after_privacy_release.json. All other limits unchanged.

### Next-retest budget — Director Tony, 18 November 2026; transcribed by Cody

Friday Q4/01 adjudication, Director Tony chose one more repair round. Source supplied in the Director conversation: `QA_LEAD_ADJUDICATION_APBM007B_Q4_01_2026-11-18.md`, SHA-256 `c675e9e3aa3fddd373ff88d7fabd8d47183e0a046249dd45d0f0646ffe1f10d4` (attributed supplied reference; no independent attachment verification claimed). Friday read Q4_REVIEW_01 SHA-256 `ec99c079406250551abd02f1d5e4403f6f101a3bbc24c0cdd9b8b52a029400a5`; index verified280of280.

**BUDGET FOR THE NEXT RETEST (Director, 18 November 2026), counters preserved, nothing reset:**

| Limit | Previous cumulative cap | Next-retest cumulative cap |
|---|---:|---:|
| Sign-ins | 176 | 300 |
| Provider mutations | 440 | 560 (last20cleanup) |
| pay_or_hosted | 80 | 100 |
| Read requests | 5,000 | 8,000 |

All other limits unchanged. Standing authority from this morning continues for the next retest. This records the supplied budget; no ledger counters or executable caps changed during this docs-only step, and no new retest scope or release is inferred.

Keep every fixture as is. Do not start apps or a listener. Engineering now has the QA branch. When the Director provides the repaired pair, Friday will send the bound retest scope. Current state **REPAIR RULED — AWAITING COMMIT**; nobody retests in this state.

### Q4/02 release — Friday and Tony,18November2026; transcribed by Cody

Source: project record QA_LEAD_Q4_02_BINDING_APBM007B_2026-11-18.md, current Director conversation. QA LEAD(Friday): Q4/02scopeD1–D8 approved, transcribed plan§7; planSHA-256 `c06196aa44ab3cee181e101a175106a96b7f24e1e941f5754aa0bd38124bbdbb`. DIRECTOR(Tony): Q4/02released bysendingthismessage,18November2026. Repairedpair: Portalba66534351368b4b67b9e61d6f0278866950c850; OwedBook855e0ad2e22a37e633ab5a55b8459e9bcc6bd871, qa/apbm-007b. Bothremoteheads/ancestryverified. Budgetalreadyrecorded:sign-ins300,provider560(last20cleanup),pay_or_hosted100,reads8000;othersunchanged,counterspreserved,nothingreset; suppliedstandingauthoritycontinues. Keepallfixtures, no migration/repair/rebind, effectsSCRATCH/sandbox, ownedruntimeonly.

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
