# FINDINGS — `APBM-007B-CYBER-PHARMA`

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/FINDINGS.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §11 (findings, classification, repair protocol) and §5. **Owners: §1 QA Executor records findings and proposes a class; §2 QA Lead dispositions; §3 conditional repair routing — Executor proposes, QA Lead classifies, Architect rules scope, Engineer repairs on the QA branch, Director commits, Executor re-pins and retests.** A proposal here is never a work order.

## 1. Findings (QA Executor)

| ID | Phase / attempt | AC(s) | Observation (what was seen) | Expected (independently derived) | Reproduction (exact, with working dir) | Evidence path(s) | Proposed class | Proposed severity | Blocks other checks? |
|---|---|---|---|---|---|---|---|---|---|
| F-Q2-001 | Q2/01 | AC-004, AC-007, AC-025 | Real clock payment at 2026-12-24T11:50:29Z, deadline11:49:29Z; restart/poll activated new store and increased quantity4→5. | Late payment enters attention, no activation or quantity grant. | AUTOMATION/Q2/late-outage-refund.cjs; exact provider/SCRATCH timeline below; do not replay paid action. | evidence/Q2/01/late_outage_refund/{result,diagnostic,timeline_facts,redelivery_and_reconciliation}.json | acceptance failure (proposed) | High (proposed) | No current dependent hold. Friday continuous-Q2 correction lifted it; all deadline/race/crash cases executed, protected activated fixture retained. |
| F-Q2-002 | Q2/01 | AC-030 | WebKit staff invite/revoke timed out after Send; status missing, button disabled; Chromium/Firefox4 checks passed. | Guarded invitation resolves with truthful blocked-send status and revocation UI. | Candidate staff spec, WebKit, unchanged30s limit; no hidden retry. | evidence/Q2/01/browser/ob_staff* | acceptance failure / intermittent UI observation (proposed) | Medium (proposed) | No; pending reproduction/disposition. |
| F-Q2-003 | Q2/01 | QA process | Reused helpers did not pre-reserve decline void and did not establish pre-reservation timing for hosted quantity; unexpected late activation also required retrospective quantity reconciliation. Known effects counted, no reset. | Reserve before every attempted effect and retain uncertainty. | See qualification receipt; QA helper corrected, original attempt retained. | evidence/Q2/01/board/instrument_qualifications.json; effects/ledger.jsonl | instrument issue (proposed) | Medium (proposed) | No current budget stop. Friday a01 accepted the disclosure and amended the envelope; counters preserved, per-scenario dry-run used. |
| F-Q2-004 | Q2/02 | AC-007 | SQL due queue included the unpaid operation at its deadline; two real minute-spaced internal jobs returned200 but left operation payment_pending and invoice open, paid0. | At30-minute consent expiry, reconcile/void verified unpaid invoice; no access grant. | AUTOMATION/Q2/expiry-void-race.cjs; see recorded exact account-clock deadline and two worker ticks. Explicit owner abandon afterward voided it; this is forward fixture closure, not repair. | evidence/Q2/02/expiry_void_race.json (expiry-minute-worker and expiry-fixture-forward-close) | acceptance failure (proposed) | High (proposed) | No. Friday continuous-Q2 correction directs findings and continued testing; no Engineering routing before Q2 completion. |
| F-Q2-005 | Q2/02 | AC-030 | Active-owner dashboard renders an enabled Add a pharmacy action alongside “Inviting staff and adding stores are not available yet.” Both new capabilities are implemented and live QA exercised them. | Copy accurately describes implemented capabilities and available routes. | AUTOMATION/Q2/screens-final.cjs; frozen DashboardView.tsx line362; mobile and desktop owner dashboard. | evidence/Q2/02/screens_final.json (OWNER_A dashboard visible_text); corrected visual attempt separately retained | acceptance failure (proposed) | Medium (proposed) | No. Record and continue; Friday adjudicates after complete. |
| F-Q2-006 | Q2/02 | AC-021–024 SUPPORT PROCEDURE lane | Candidate SUPPORT_PROCEDURES.md remains acceptance requirements; no exact per-action command/runbook sequence, verification and partial-failure/resume steps. CLI help provides typed schema but not the complete requested runbook. | Grade support procedure separately; documented executable commands and requester/approval/before/after/resume/retention steps for every listed action. | Independent frozen candidate document/help review; evidence records hash and action inventory. | evidence/Q2/02/support_procedure_review.json | acceptance failure (proposed, documentation lane) | Medium (proposed) | No; operator software tests continue. Friday adjudicates after Q2. |
| O-Q2-001 | Q2/02 | AC-030 | Director saw Skip to content over the mobile login logo. Independent fresh-load/first-Tab/activation checks in all3engines and2themes: hidden at rest, visible when keyboard-focused, Enter focuses main, link hides again6/6. Earlier QA screen capture deliberately pressed Tab before screenshot. | Keyboard skip navigation is focus-visible and works without a persistent fresh-load overlay. | AUTOMATION/Q2/skip-link-investigation.cjs; six signed-out public cases, no sign-in. | evidence/Q2/02/director_manual_observations.json; skip_link_investigation.json; screens/skip-link-*.png | observation / capture focus state (proposed) | Unranked | No; not a new fresh-load failure. Friday owns final classification; F002/F005 unchanged. |

Proposed class vocabulary (§11): acceptance failure · regression · environment/setup issue · instrument issue · contract gap · proven pre-existing defect · follow-up finding · enhancement · observation. Severity follows impact. A finding whose grading depends on an unresolved contract question is `ADJUDICATE` in the matrix and a `STOP-CONTRACT` if execution cannot continue safely.

Observations outside the plan ("while I'm here") are recorded here as **observation**, unranked, never widened into scope.

### F-Q2-001 facts and inference

Operation ecd48478-6721-415f-9387-836d0331a64e; invoice in_1Uci3dGnEQDyu3RRKAP7VnOd. One successful payment3774cents; logical provider paid_at1798113029 (11:50:29Z), bound deadline11:49:29Z, SQL billing_now11:50:29Z. Expected attention, observed activated, business93632de4-1ae4-4191-9a02-9381d84fbb2a. Owner polling after owned hard crash recovered by activating; real provider resend after listener outage returned200/processed, no hand signer. No refund issued because approval was explicitly for paid-but-not-activated; do not reinterpret it for this activated state.

Source inference (not a production-wide reproduction): storeOperations.ts computes due from real Date.now while SQL fixture/quote time uses billing_now; 0069 store_add_activate and store_operation_transition do not independently check this deadline for payment_pending→paid_pending_activation. Proposed repair investigation: authoritative provider paid timestamp plus correct account timeline, preserving timely payment followed by delayed event/restart. Do not repair by blindly rejecting every reconciliation after deadline. Engineering owns code and forward SQL; applied0061–0069 must not be rewritten. No repair performed or ordered by Cody.

### F-Q2-002 a01 reproduction (Cody factual result)

Three unchanged WebKit runs: FAIL (0 passed,1 failed,1 serial dependent NOT RUN), PASS (2/2), FAIL (0 passed,1 failed,1 dependent NOT RUN). Spec SHA-256ee2cb80ea2ecfa92f7194e8431573d115ddfae1bf736a3ff6e1e28452e7ad00d; no timeout edits or retries. Evidence evidence/Q2/02/webkit/results.json and attempt1–3.txt. Friday classification remains pending; no independent repair/rebind.

### Q2 continuation facts — Cody

Friday lifted the earlier dependent holds and stopped Engineering during Q2. Both S1/S2 timely crash cases PASS8/8 each; actual expiry worker failure remains F004. Legitimate paid/void race naturally produced attention with no store; one approved full4897c refund and exact proof close/repeat PASS. No refund/cleanup of activated F001; final provider read verifies amount_refunded0. No product repair/rebind and no new disposition authored by Cody.

Additional QA instrument corrections are disclosed separately: initial visual driver used wrong cookie HttpOnly attributes/network-idle and a wrong handoff destination; table/route/201 assumptions corrected in read-only follow-up. Later a stale in-memory cache overwrote NEW_ADMIN's stored cache entry, while actual browser sessions remained valid. Restoring only provider-verified existing sessions and merging cache keys fixed the QA helper; affected fresh-role matrix rerun40/40, no extra sign-in. All failed attempts preserved. See evidence/Q2/02/instrument_followup_corrections.json, screens_final_corrected.json and fresh_session_cache_instrument_correction.json. These corrections do not remove any product observation or reset counters.

## 2. Dispositions (QA Lead only)

| Finding | Class (final) | Severity (final) | Disposition | Inherited condition evidence (if claimed pre-existing) | Affects verdict? | Routed to |
|---|---|---|---|---|---|---|
| F-01 | NOT RECORDED | | NOT RECORDED | | | |

### Friday dispositions — a01, 2026-11-17, transcribed by Cody

Source: Friday adjudication a01, supplied by Director Tony in current conversation, 17 November2026; QA_LEAD_ADJUDICATION_APBM007B_Q2_a01_2026-11-17.md SHA-256744a2d2d4795b6894f7397b7d97d0d5fa196f4a40005115d3e8339347b422c5e (attributed supplied reference; no independent attachment invented).

| Finding | Class (final) | Severity (final) | Disposition | Inherited condition evidence (if claimed pre-existing) | Affects verdict? | Routed to |
|---|---|---|---|---|---|---|
| F-Q2-001 | acceptance failure | High | PRODUCT DEFECT — bounded Engineering repair on qa/apbm-007b; retest on repaired candidate | not inherited | Yes | Architect for bounded repair instruction; Engineer |
| F-Q2-002 | PENDING | Medium (provisional) | Reproduce 3x unchanged on WebKit; Engineer investigates in the same repair pass; classify on results | n/a | Pending | QA Executor; Engineer |
| F-Q2-003 | instrument issue | Medium | ACCEPTED AS DISCLOSED — no counter reset; reserve-before-attempt dry run per remaining live scenario | n/a | No | QA Executor |

Rules: inherited conditions require evidence; they are neither charged to a new module nor waived if release-blocking without the governing disposition. No accepted requirement silently becomes optional; meaningful risk acceptance follows Director authority and is recorded in `QAM_CERTIFICATION.md`.

### Friday Q2 COMPLETE adjudication — 17 November 2026, transcribed by Cody

Authority: Friday (QA Lead), 17 November 2026, supplied in the Director conversation. Source: `QA_LEAD_ADJUDICATION_APBM007B_Q2_COMPLETE_2026-11-17.md`, supplied SHA-256 `37b8747c832993a151e512339a6800ab25b1bff6b396752ccc66d98e7c1b6e12` (attributed source reference; no independent attachment verification claimed).

Verdict on Q2: **NOT CERTIFIABLE AS TESTED.** One bounded repair round, then Q4. The following dispositions supersede Friday's earlier a01 rows above; those earlier rows remain as history.

| Finding / observation | Class (final) | Severity (final) | Disposition | Affects verdict? |
|---|---|---|---|---|
| F-Q2-001 | acceptance failure | High | PRODUCT DEFECT — repair | Yes |
| F-Q2-004 | acceptance failure | High | PRODUCT DEFECT — repair, same family as F-Q2-001 | Yes |
| F-Q2-002 | acceptance failure | Medium | PRODUCT DEFECT (intermittent) — investigate and repair | Yes |
| F-Q2-005 | acceptance failure | Medium | PRODUCT DEFECT — repair (wording) | Yes |
| F-Q2-006 | acceptance failure, support-procedure lane | Medium | DEFECT AGAINST CONTRACT — author the runbook | Yes, support-procedure grade |
| F-Q2-003 | instrument issue | Medium | ACCEPTED AS DISCLOSED — no counter reset | No |
| O-001 skip link | observation | — | EXPECTED BEHAVIOUR, keyboard-focus state only — no action | No |
| O-002 UTC-only deadline in billing notices | follow-up | — | NOT IN THIS REPAIR — Director backlog | No |

Identifier cross-reference only: O-001 skip link refers to the existing Executor observation O-Q2-001 in §1; its original evidence is unchanged.

Retention, Friday: keep every SCRATCH, sandbox and sign-in fixture exactly as is through Q4, including the F-Q2-001 store, unrefunded. No cleanup. State: **REPAIR RULED — AWAITING COMMIT**; nobody retests in this state. No apps or listener are to be started; no pull or rebind. Engineering now has the QA branch. The Director supplies the repaired commit pair; Friday will supply the bound Q4 scope and Q4 budget.

## 3. Conditional repair routing (only when §2 dispositions a genuine product defect)

### 3.1 Repair proposal (QA Executor draft; a proposal, not a work order)

Created only when at least one product AC is FAIL with a product-defect disposition. No QA seat edits product code, tests, dependencies or contract files.

| Finding(s) | AC(s) | Evidence path(s) | Suggested allowed-file list (suggestion only) | Suggested retest scope (suggestion only) | Contract question, if any (spec row + ruling gap) |
|---|---|---|---|---|---|
| NOT RECORDED | | | | | |

### 3.2 Chain of authority (each step recorded with date and seat)

| Step | Seat | Record | Date |
|---|---|---|---|
| Disposition: product defect | QA Lead | §2 row | NOT RECORDED |
| Ruling / bounded repair instruction (exact allowed paths, forbidden paths, required checks) | Architect | `NOT RECORDED — owning seat authors at its phase` | NOT RECORDED |
| Repair on `qa/apbm-007b`, approved paths only; self-verification; amendment to `QAM_MANIFEST.md` §8 — state `REPAIR RULED — AWAITING COMMIT` (nobody retests in this state) | Engineer | commit(s) `PENDING` | NOT RECORDED |
| Commit of the repair (repaired candidate identity now exists) | Director | receipt `NOT RECORDED — owning seat authors at its phase` | NOT RECORDED |
| Retest-scope approval (`QAM_TEST_PLAN.md` §7 bound in `QAM_APPROVAL.md` §4) — state `RETEST SCOPE APPROVED — NOT RELEASED` | QA Lead | `QAM_APPROVAL.md` §4 | NOT RECORDED |
| Q4 release — state `RELEASED FOR Q4` | Director | `QAM_APPROVAL.md` §4 | NOT RECORDED |
| Verify repaired candidate, approval and release; re-pin; Q4 retest per `QAM_TEST_PLAN.md` §7 (repair diff + affected ACs + full required regression suite; carried-forward evidence with its original SHA/attempt; live validation reserved for the final repaired candidate runs on it) | QA Executor | `QAM_EXECUTION_REPORT.md` (Q4), new package | NOT RECORDED |
| Re-adjudication | QA Lead | §2 (appended rows) | NOT RECORDED |

Repairs stay on the QA branch; nothing is transferred back to the engineering branch (RUL-02). All prior attempts are preserved under `evidence/`.

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*
