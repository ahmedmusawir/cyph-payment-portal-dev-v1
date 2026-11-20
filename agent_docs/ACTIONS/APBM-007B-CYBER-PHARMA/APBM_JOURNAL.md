# APBM-007B journal (append-only)

Each entry is dated Asia/Dhaka and attributed. Entries record what happened; they do not grant authority.

## 16 November 2026 — Director E2 release received (Claudy, Engineer)

Received in the engineering session from Tony (Director). Recorded verbatim below. No text added, removed or corrected.

```text
CLAUDY — DIRECTOR RELEASE: APBM-007B E2

Tony authorizes starting E2 now on apbm-007b in both repositories.

Primary:
 /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1

Dependency:
 /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev

Canonical module:
 agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/

Installed package and evidence:
 /home/moose/APBM007B_INSTALL/APBM007B_BUILD_PACK_v1_0_r1_PENDING_RELEASE/

Read APBM_ENTRY.md, AGENTS.md, CLAUDE.md, APBM_STATE.md, APBM_RULINGS.md, BP_AMENDMENT_LEDGER.md, SUCCESSOR_INPUTS.json, then the governing sources, frozen contracts, acceptance specification, execution plan and QAM instructions in their prescribed order.

RELEASE AND RECORD ACCURACY
This message is Tony’s E2 start authorization. Record it verbatim in the journal. Preserve the actual review history: Friday accepted with exact amendments; the successor has not received Friday’s amendment-diff confirmation. Do not invent that confirmation or mark outstanding items resolved.

Two items remain explicitly open:
1. Director decision 9: whether a same-owner paid re-add restores the original store record/history. Recommendation YES; approval is not recorded. Do not choose this policy yourself. Isolate the affected implementation and request this one ruling when required.
2. Original pre-E2 v0.1 Friday review bytes are missing. Preserve the existing transcription and missing-source disclosure. Do not manufacture the original file or its expected hash.

Start all independent authorized work immediately. These open items do not authorize bypassing a dependent checkpoint or claiming final readiness. Report any other material contradiction together in one concise checkpoint, with a recommendation.

EXECUTION
Verify both repository branches, current HEADs, working-tree changes and installed package index. Preserve existing work. Do not repeat E1; perform only execution preflight and the specified capability checkpoints.

Execute EXECUTION_PLAN.md continuously as one coordinated build across both repositories. Complete CP1 and CP2 before their dependent implementation. Follow their exact evidence requirements and bounded fallbacks. If a checkpoint fails, stop the affected work, report the evidence and recommended amendment, and continue independent work.

Implement the frozen scope and BP-01 through BP-09 contract amendments. Follow the standalone incremental-invoice design, minimum-charge and period guards, authoritative payment checks, transfer boundaries, history restrictions, operator controls and notice contracts exactly. Do not substitute an earlier billing mechanism.

ENVIRONMENT AND EFFECTS
Tony authorizes the E2 envelope specified in ENVIRONMENT_AND_EFFECTS.md. Respect its resource, payment, mail and mutation limits. DEV apply still requires its specified grouped Director checkpoint. No resets, unapproved destructive changes, production actions or deployment.

Load secrets privately from existing local environment files. Never print or package credentials, tokens or environment-file contents.

VALIDATION AND HANDOFF
Run the prescribed meaningful checks and regressions. Record actual results, failures, fixes, resource effects and limitations. Populate the QAM engineering handoff with the exact candidate identities, build/serve/listener commands, served-build identity verification, role-operation mapping and evidence required for Cody’s independent Q1.

Do not fabricate QA results, Q1/Q2 approval, certification or closeout. Preserve independent QA authority.

No git add, commit, push, merge, branch deletion or deployment. Tony retains Git authority.

Return one indexed engineering review ZIP with the completed build report, changed-file inventory, validation evidence, checkpoint returns, factual QAM handoff and any remaining blockers. End with a short Director summary stating precisely what is ready for independent QA.
```

Review history as it actually stands (not changed by this entry):

- Friday reviewed frozen pack v1.0 (`a45493266d03d947485980187d9bc45b9f0140c01bb5e5c27f9c06d7f18b99e0`) and recorded **ACCEPT WITH EXACT AMENDMENTS** (BP-01 to BP-09), `GOVERNING/FRIDAY_FROZEN_PACK_REVIEW_v1_0_AS_RECEIVED.txt`.
- The Architect applied BP-01 to BP-09 in this successor (`BP_AMENDMENT_LEDGER.md`). **Friday's amendment-diff confirmation of the successor has not been received.**
- **Director decision 9 is PENDING** (`SUCCESSOR_INPUTS.json`). Not chosen by Engineering.
- **The original pre-E2 v0.1 Friday review bytes are missing.** The transcription in `REVIEW_AMENDMENTS_SOURCE.md` and the missing-source disclosure stand. No file or hash is supplied or reconstructed by Engineering.

## 16 November 2026 — E2 execution preflight (Claudy)

| Check | Result |
|---|---|
| Portal | branch `apbm-007b`, HEAD `c68c4acaccc4a68f20ede267f06cfda17fa15aac`; untracked only `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/`, `agent_docs/PACKAGES/` |
| OwedBook | branch `apbm-007b`, HEAD `0b785524a621c4384db8bee47ef9b4149b8ab44c`; clean; last migration `0060_billing_reads.sql` (no 0061+ exists) |
| Installed pack | `FILE_INDEX.json` status `PENDING_INPUTS_E2_NOT_RELEASED`, 122 members, 0 missing, 0 size/hash mismatches |
| Installed module vs pack | all 112 module files byte-identical to the pack copies; no unindexed module file |
| Director processes | listeners on 3000 (OwedBook), 3001 (Portal), 3457 — not touched; proof lanes use 3100/3101 |
| Private configuration (names only) | Portal has `RESEND_API_KEY`; **absent**: `MAIL_ALLOWLIST`, `BILLING_EMAIL_FROM`, `ALLOW_TEST_CLOCK`, any `ENGINEERING_*` identity/inbox names. OwedBook has `APBM_SCRATCH_*` and `APBM_DEV_*` sets |

## 16 November 2026 — Stage 1 and checkpoints (Claudy)

- Instruments: `scripts/apbm007b/lib/{env,effects,stripe}.mjs` (scoped private loader, cumulative effect ledger with the envelope ceilings at `EVIDENCE/E2/effects/`, Stripe wrapper reserving before send). Both repos' cwd stated in each script's `--help`.
- **CP-1 provider part PASS** (`EVIDENCE/E2/r01/CP1/CP1_RETURN.md`): standalone draft invoice + one item, `auto_advance=false`, pay once, then absolute quantity with no proration; decline/void/late-pay/void-after-paid/hosted 3DS/lost-reply all per contract; APA discount preserved. CP-1b (SCRATCH saga recovery) follows the schema.
- **CP-2 provider part PASS** (`EVIDENCE/E2/r01/CP2/CP2_RETURN.md`): fixed external clock driver chosen; mid-period quote 2450 = invoice for ordinary and APA; seven-day record: subscription stays `past_due` through day 8 with retries at ~1.8-day steps, recovery by paying the same invoice → `active`. CP-2b (SQL exclusion on SCRATCH) follows 0061.
- Migration rehearsal decision: SCRATCH holds retained 007A fixtures (25 Auth users, 350 claims), so fresh/interrupted rehearsals run on an isolated LOCAL Supabase (db+auth containers, `/home/moose/APBM007B_E2_WORK/localdb`, `scripts/apbm007b/migrate-rehearsal.mjs` in OwedBook, refuses non-local targets). SCRATCH receives only the non-destructive forward upgrade.
- Read-only live inventory (SCRATCH and DEV): ledger 60/60, 0 NPI duplicates, 0 owner duplicates, 5 synthetic invalid NPIs each, no pending deferred reminders (DEV has 1 failed access_link 429 row, untouched).

## 16 November 2026 — Stage 2 schema and Stage 3 Portal core (Claudy)

- Migrations `0061`–`0067` authored in OwedBook. Local isolated rehearsals: fresh full chain PASS; seeded upgrade PASS; fault injected in 0063 → rolled back (ledger 62) → resume PASS (`EVIDENCE/E2/r01/MIGRATIONS/`). Proof harness `scripts/apbm007b/sql-proof.mjs`: local 111/111 (incl. two committed concurrency races), SCRATCH 107/107 (rolled back).
- Defects found by the harness and fixed before any shared apply: (1) invitation acceptance lock order (deadlock) → store row first; (2) membership policy called a service-only function → now via live `my_business_ids()`; (3) member acceptance revoked a pending admin invitation → scoped to admin acceptance.
- SCRATCH forward upgrade 0061–0067 PASS with the existing runner (`apply-forward.mjs`, 1 of 12 chain cycles); SCRATCH deployment identity bound (`fixture-clock.mjs bind`). **CP-2b SQL exclusion PASS on SCRATCH** (frozen time only with enabled context on SCRATCH identity; disabled context with residual time → real now; customers cannot call/enable/bind; identity immutable). DEV-identity negative proven on the local database.
- `scripts/rls-harness/lib/env.mjs`: 007B evidence lanes added (only change).
- Portal: `src/server/storePricing.ts`, `storeOperations.ts` (saga), `mailGuard.ts`, `billingNotices.ts`; routes `/api/stores/add/{quote,confirm,status,abandon}`, `/api/stores/operations`, `/api/stores/[id]/removal{,/undo}`, `/api/internal/jobs/run`; webhook: Add Store invoices routed by mapping first, grace only for `subscription_cycle`, grace start from the invoice's own timeline, notices scheduled on first failure, suppressed on recovery; legacy reminder writer removed. Typecheck clean.
- DEV: **not applied**; awaits the grouped Director apply checkpoint.
- CP-1b PASS 5/5 on SCRATCH + sandbox (see CP1_RETURN.md). Portal unit 480/480 incl. new `apbm007b-store.test.ts`; OwedBook 310/310 (boundary test extended for ruling 5; return-path pins updated to the BP-09 lists; 007A G5 reminder test replaced by 007B notice-routing tests — the deferred reminder record is superseded by contract 0065).

## 16 November 2026 — checkpoint return r01 (Claudy)

- Found and fixed before any DEV apply: 007A provisioning/seed inserters would violate the new `businesses.pharmacy_id NOT NULL`; 0061 now carries a compatibility trigger. Local rehearsals re-run PASS; proof 113/113. SCRATCH still holds the earlier 0061 candidate → checkpoint C-2.
- Builds: Portal and OwedBook production builds PASS; client scans clean except OwedBook's pre-existing library text `generateLink` (also present in the untouched baseline build).
- Proof pair 3100/3101 on SCRATCH: served identity MATCH both; Chromium journeys Portal 3/3, OwedBook 2/2; stored state consistent (billable = mirror = provider). One real defect found and fixed (375 px overflow of the new removal button).
- Owned proof servers stopped; Stripe fixtures cancelled/deleted. Retained: SCRATCH labelled rehearsal rows; local isolated Supabase containers (disposable).
- State stays engineering in progress (no `ENGINEERING COMPLETE`). Checkpoint package returned to the Director with C-1…C-7.

## 17 November 2026 — Director rulings received; reconciliation (Claudy)

- Rulings 1–5 recorded in APBM_RULINGS.md (append-only section).
- **Migrations reconciled:** 0061 restored to its applied bytes (`97ab60b2…`, equal to the SCRATCH ledger); the compatibility trigger moved to `0068_007b_identity_compat_fix.sql` (`aa567f2d…`). Rulings 2 and 3 need SQL; since 0061–0067 are applied and never rewritten, they are in `0069_007b_reactivation_transfer_registration.sql` (`c173249a…`) — a second new file beyond the narrow 0068, flagged for the DEV-apply checkpoint.
- Isolated rehearsals for 0001–0069: fresh PASS; seeded through 0067 then fault in 0069 → rolled back (ledger 68) → resume PASS; proof **134/134** (new: decision-9 paid re-add restores the original record only after payment; transfer buyer through registration with exact-email hold, never released to the public; buyer denied seller history).
- **SCRATCH:** forward 0068–0069 with the existing runner (ledger-prefix and checksum checks unchanged) PASS; fixtures preserved; proof **130/130**; SCRATCH chain cycles 2 of 12.
- Ruling 4: `build-check.mjs` now carries a narrow documented baseline exception (OwedBook only, ≤1 file, file must be recognisably auth-js); self-test proves it never excuses a second file or any Portal hit.
- Ruling 5: 27 stale "E2 NOT RELEASED" headers corrected (contract text unchanged; header-only hash changes recorded in `EVIDENCE/E2/r02_header_hash_changes.json`); APBM_STATE, SUCCESSOR_INPUTS.json and BP_AMENDMENT_LEDGER updated without claiming Friday's diff confirmation; original v0.1 bytes still missing.
- Effects: remaining Stripe checks need 160,570 attempted cents against 35,880 left → one increase proposed (`EVIDENCE/E2/r02/EFFECTS_PLAN_AND_PRIVATE_INPUTS.md`); **no Stripe activity started** since.
- r02 verification: regression/accessibility spec 9/9 across Chromium/Firefox/WebKit; OwedBook staff journey Chromium/WebKit 2/2, Firefox 2/2 on re-run after one intermittent timeout; operator checks on the proof Portal as expected; final bundle scan clean (OwedBook with the documented baseline exception); served identity MATCH. Defect found/fixed: `local-proof` env value broke handoff codes (0059 accepts local/staging only) → `handoffEnv()` maps it to `local`.
- Checkpoint r02 returned; engineering remains in progress pending the envelope increase, private email inputs, acceptance of 0069 and the DEV apply release.

## 17 November 2026 — continue from r02: amendments, O-1, checks C/D/F/G, invitations; checkpoint r03 (Claudy)

- Recorded: 0069 approval, envelope amendment (USD 4,800; pay/hosted 30), decision 9 confirmation. Friday's diff confirmation text not received in session; installed pack verified equal to `APBM007B_BUILD_PACK_v1.zip` (`08d5448b…`, 122/122 files); original v0.1 review bytes still MISSING.
- Mail allowlists configured privately (5 exact addresses, both apps); inbox adapter revised for multiple mailboxes + manual mode (no automated inbox access exists). No cast address existed on SCRATCH beforehand; QA-reserved identities untouched.
- O-1 lifecycle PASS on one clock incl. PE-09 ordinary + APA, two real notices sent via Resend, browser grace/read-only/restored in both apps; decision-9 paid re-add restores the original row. C (decline→abandon, hosted 3DS), G (cancel→undo), F (transfer cancel resync, owner replace provider step) PASS. Member/admin invitations sent to real inboxes (acceptance pending). E blocked at registration by an engineering script fault (no provider effect) with customers/subscriptions now 12/12.
- Deviation: one blind re-run of E's registration phase, refused by the ledger before any provider call. Details and decisions needed: `EVIDENCE/E2/r03/CHECKPOINT_REPORT_r03.md`.
- O-1 clock deleted (customers removed). Open: c-r03 proof subscription to be cleaned before ~17 Dec. DEV not applied. Engineering remains in progress.

## 17 November 2026 — manual inbox receipt recorded; invitation acceptance prepared (Claudy)

- Tony's manual check of three inboxes (09:55 Asia/Dhaka) recorded as manual receipt observations 1–4 in `EVIDENCE/E2/r03/INBOX/manual_observations.json` (OWNER_A notices 09:18 / 09:19; MEMBER and ADMIN Supabase Auth magic-link emails 09:41). These are not acceptance results and not automated inbox checks.
- Proof servers 3100/3101 still serving the r02 proof build (build-info answers). Store A1 before state: OWNER_A sole admin; MEMBER and ADMIN invitations pending, 1 dispatch each (`EVIDENCE/E2/r04/ACCEPT/a1_before.json`). Acceptance guided for Tony in separate browser sessions.
- 17 Nov (later): MEMBER link found to be the provider-default format (not opened). Diagnosis and fix: `EVIDENCE/E2/r04/ACCEPT/LINK_FORMAT_FINDING.md` — SCRATCH lacks the approved token-hash Magic Link template; the 007B invitation mail wrongly appended `?next=`. Code fixed in OwedBook (exact redirect; pending invitations route to /invitations after sign-in), tests 312/312, proof pair rebuilt and identity matched. Exposed MEMBER link replaced by the normal Resend (attempt 2/5). SCRATCH template/allowlist change requested from the Director.
- 17 Nov 10:39 Asia/Dhaka: Director saved the SCRATCH token-hash Magic Link template and both proof redirect URLs. Normal Resend: MEMBER attempt 3/5 (04:39:19Z), ADMIN attempt 2/5 (04:39:32Z); 2 emails. Acceptance pending.
- 17 Nov 10:43 / 10:45 Asia/Dhaka: Tony accepted the MEMBER then ADMIN invitations from the emailed links (token-hash format) in separate private browser sessions on the VM. Verified (`EVIDENCE/E2/r04/ACCEPT/a1_after.json`, `a1_role_checks.json`): both invitations `accepted` by the matching identity; store A1 has exactly one admin (ADMIN); OWNER_A moved to member as chosen and remains account owner with billing and full staff rights; MEMBER and ADMIN see only A1 and can read its records; MEMBER cannot invite; ADMIN can invite members but not appoint an admin; neither reaches owner billing. Role probes ran in rolled-back transactions (0 rows left). First real-inbox invitation acceptance PASS on the proof pair.

## 17 November 2026 — customer/subscription ceilings 13; check E; cleanup; checkpoint r04 (Claudy)

- Director amendment recorded (customers and subscriptions 12 → 13; counters and reservations intact).
- Check E PASS: buyer registered with the same NPI, paid in real Stripe Checkout (USD 9,900; the same open session completed once after two automation stops before any submission); events delivered → provisioned; transfer `completed`; new buyer business on the same pharmacy identity; buyer cannot read seller history.
- Cleanup: check-C and check-E Stripe customers deleted and subscriptions canceled; no live E2-owned provider resources remain (007A-marked subscriptions left alone).
- Final DEV-apply manifest re-verified (hashes, inventory, DEV read-only catalogue unchanged). OwedBook clean-build scan clean (documented exception only). Checkpoint r04: `EVIDENCE/E2/r04/CHECKPOINT_REPORT_r04.md`. DEV not applied; engineering remains in progress.

## 17 November 2026 — DIRECTOR RELEASE: APBM-007B DEV APPLY (recorded verbatim by Claudy)

```text
CLAUDY — DIRECTOR RELEASE: APBM-007B DEV APPLY

Tony confirms receipt of the buyer-access email sent at 10:55 AM,
17 November 2026, Asia/Dhaka. Record manual receipt observation 5.

Tony authorizes you to execute the controlled DEV apply described
in r04/DEV_APPLY_MANIFEST_FINAL.md. This explicitly delegates the
DEV-write step previously described as Tony-only. Record this
authorization verbatim.

TARGET
DEV Supabase project: yrsuwikjnbmvpznrgydb
Working directory:
 /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev

AUTHORIZED CHANGES
Apply exactly migrations 0061–0069, using their full hashes in
the r04 final manifest and the existing 69-entry runner inventory.
Migrations 0001–0060 must remain unchanged.

PRE-APPLY
• Verify target identity, branch apbm-007b, migration hashes,
  inventory and applied-ledger prefix.
• Capture a fresh read-only DEV catalogue. Its expected SHA-256:
  fab5247f4cf3c7c003d66afd32b77ba1a20b5e6fc63b2d102e346717e9952e6a
• Stop on any mismatch. Do not regenerate the expected baseline,
  bypass guards, reset DEV or rewrite migration history.
• Load existing private credentials without printing them.

APPLY
Use the existing apply-forward runner and its documented DEV
guards, manifest and fresh before-catalogue. Apply one migration
transaction at a time, recording each ledger entry.

On failure, stop and report the exact committed prefix and failed
migration. Do not improvise repairs or reverse committed migrations.

Bind the deployment identity to yrsuwikjnbmvpznrgydb using the
documented guarded binding procedure. Confirm that test-clock
overrides cannot operate on DEV.

POST-APPLY
• Verify all 69 ledger entries and checksums against the manifest.
• Capture the after-catalogue and verify intended permissions,
  RLS and deployment identity.
• Run non-destructive compatibility checks and verify preservation
  of existing business IDs and linked records.
• No DEV test-user creation, fixture seeding, resets, deletion,
  payment activity or email sends are authorized by this release.

FINISH ENGINEERING
After successful verification, complete the final builds/scans,
required checks, full acceptance-criterion QAM handoff, final
change inventory and cumulative effects/cleanup records.

Reconcile current state and governing records with actual evidence.
Preserve any unresolved source-document disclosure.

Return one indexed final engineering review ZIP with the DEV
apply receipts and completed handoff. Declare ENGINEERING COMPLETE
only if all required engineering work is actually complete;
otherwise list the remaining blockers precisely.

No Git staging, commit, push, merge or deployment.
No independent QA approval or certification is implied.
```

## 17 November 2026 — DEV apply executed; engineering finished except two blockers; final handoff r05 (Claudy)

- Pre-apply all PASS (identity, branch, 9 full hashes, 69-entry inventory, 60-entry ledger prefix, fresh catalogue `fab5247f…`). Apply with the existing runner: 0061–0069 committed one transaction each; deployment identity bound to DEV; test-context enable refused on DEV. Post: ledger 69 = manifest; after-catalogue `4a1c1719…` (same shape as SCRATCH except three pre-existing platform default ACLs); RLS/privileges/search_path OK; preservation equal (9 additive audit rows from the 0061 backfill explained); 007A read paths OK for all existing members/owners in a rolled-back transaction.
- AC-011 existing identity accepted (OWNER_B). Final checks: units 482/312, scans clean, SQL proof 130 + 134, OwedBook staff 6/6 three engines. SQL proof backfill invariant corrected after check E's legitimate shared identity (first run 129/130 kept).
- Owned processes stopped; provider clean. Final handoff and manifest written. ENGINEERING COMPLETE not declared: B1 AC-007 crash/restart (needs customers/subscriptions 13 → 14), B2 AC-011 existing-identity inbox receipt (Tony). Report: `EVIDENCE/E2/r05/FINAL_REPORT_r05.md`.

## 17 November 2026 — webhook status check during the AC-007 crash/restart proof (Claudy)

- No Stripe listener or endpoint exists: no `stripe listen` process on this machine (Engineering's or the Director's); the sandbox has 0 webhook endpoints and 0 event destinations; recent events show `pending_webhooks: 0`. Nothing was changed (DEV webhook and Director listeners untouched).
- The proof pair never receives events automatically. In O-1, C, E and the crash/restart scenarios, Engineering delivered real Stripe events MANUALLY with an owned script, signed with the Portal's configured webhook secret, at recorded times. This is controlled signed-event delivery, not automatic webhook recovery.
- Crash/restart S1: the INTERRUPTED operation (Portal SIGKILLed at 05:57:14Z with the pay intent recorded) was recovered by the owner's status polling after restart (taking the lease once the dead process's lease expired; reading the invoice from Stripe): activated 05:58:19Z, BEFORE any event delivery. Events were delivered manually at 05:58:27Z only to show replays add nothing.
- S2 ran although its command was then interrupted by the Director: confirm → payment_pending (05:58:55Z); Portal SIGKILLed; hosted 3DS payment completed while down (invoice paid, 1 charge, no store/membership/scope); restart → owner status polling activated at 05:59:35Z (quantity 3 → 4). The process was stopped during the subsequent MANUAL event delivery (one `invoice.created` recorded 05:59:43Z), so S2's final capture and replay check were not recorded. Proof servers are still running (Portal restarted by S2), and the fixture subscription is still live; awaiting the Director's direction.

## 17 November 2026 — blockers closed; ENGINEERING COMPLETE — AWAITING QA BRANCH (Claudy, addendum r06)

- B2 closed: Tony's OWNER_B inbox receipt recorded (manual record 6). B1: ceilings 14 recorded; AC-007 crash/restart PASS on SCRATCH + sandbox with owned processes only. S1: Portal SIGKILLed with the pay intent recorded; Stripe completed the in-flight payment while down; restart → owner status polling activated after the dead lease expired. S2 (its interrupted run finished without repeating anything): SIGKILL at payment_pending; hosted 3DS paid while down; restart → owner status polling activated; final capture and manual signed replay done. Both: one invoice paid once, one charge, quantity +1 exactly, one store/membership, no access before payment; replays added nothing.
- Interrupted S2 call reconciled against Stripe, SCRATCH and the ledger: every effect reserved, none extra, 0 notifications. Manual event delivery recorded as controlled signed delivery everywhere; check C/E/O-1 handoff wording corrected. Automatic webhook delivery recorded UNTESTED and carried into QA planning and staging verification.
- Crash fixture cleaned (subscription canceled, customer deleted); proof servers stopped; Director processes untouched. No product code change; no DEV action; no Git mutation or deployment.

## 17 November 2026 — candidate preparation: Friday confirmation retained; commit lists prepared (Claudy)

- Friday's diff confirmation retained byte-identically in GOVERNING (as received); DIFF CONFIRMED; archive identity `08d5448b…` reconciled with the installed pack (123 members, 122/122 indexed, 12/12 contract files); module contract changes since the pack are the recorded r02 header corrections plus appended Director records.
- Friday v0.1 pre-E2 review text retained as received (not the original file). Its bytes + one trailing LF equal the required SHA `37a0993a…`. The original-named file is not created; disclosure preserved; disposition flagged (R-3).
- Stale state markers corrected with hashes recorded (`EVIDENCE/E2/r07_state_header_changes.json`): CONTRACT_MANIFEST.json status; QAM/AC_EVIDENCE_MATRIX.md header. Historical entries not rewritten (new entries appended).
- Pre-commit file lists, exclusions and privacy scan in `EVIDENCE/E2/r07/COMMIT_PREP/`. No staging, commit, push or branch by Engineering.

## 17 November 2026 — R-3 ruling recorded; commit lists finalized (Claudy)

- Director ruling: the hash-verified v0.1 attachment satisfies R-3. Full SHA-256 verified (as received + one restored final newline = `37a0993a…d50d48`); as-received file unchanged; current statuses updated (SUCCESSOR_INPUTS, GOVERNING_INDEX, APBM_STATE, handoff); historical missing-file entries preserved; ruling appended to APBM_RULINGS and SOURCE_REGISTER.
- Preparation package `agent_docs/PACKAGES/APBM007B_PREPARATION_v0_3/` excluded from the candidate commits (Director). Lists and privacy check regenerated in `EVIDENCE/E2/r07/COMMIT_PREP/`. Nothing staged or committed by Engineering.

## 17–18 November 2026 — QA campaign and two repair rounds (summary recorded at closeout, Claudy)

- Candidate pair Portal `427bec6` / OwedBook `c8a2ed9` on `qa/apbm-007b`. Q1: 12/12 manifest hash mismatch (STOP-CONTRACT) → QA Lead QL-01 CLEARED 12/12; correction deferred to closeout. Q2 complete with F-Q2-001, -002, -004, -005, -006 (F-Q2-003 QA instrument).
- After Q1 the QA Lead instructed the QA Executor directly and, under the Director ruling of 17 Nov, issued both repair rounds to Engineering. Round 1 (A–D, migration 0070) → `00a9e0e` / `1fd5a61`, verified in Q4/01. Round 2 (E, F, then the Add Store details extension) → `ba66534` / `855e0ad`, verified in Q4/02. Engineering's factual records are in `QAM/QAM_MANIFEST.md` §8.

## 18 November 2026 — Gate Q PASS WITH KNOWN RISK; cleanup accepted; architect closeout prepared (Claudy for JARVIS)

- Certificate `3d897cf9…e70f` and cleanup release `bae72eec…0a868` hash-verified. The certificate import gap is closed (§§1–6 verbatim in `QAM/QAM_CERTIFICATION.md`). Director accepted KR-1 to KR-6 at 13:40. QA records committed by the Director: `1a07c63`.
- Read-only identity check (fetch only): both repos clean on `qa/apbm-007b` = origin. The certified commits are ancestors of the merge tips. Portal changes above `ba66534` are QAM-only (199 paths; secret-shaped scan 0). OwedBook HEAD = `855e0ad`. Isolated `git merge-tree` against `origin/main`: no conflict; merged trees equal the QA trees.
- Contract manifest hashes corrected (header line in all 12; +47 / +5 appended Director lines in `APBM_RULINGS.md` / `ENVIRONMENT_AND_EFFECTS.md`); old hashes kept; contract files unchanged.
- Prepared, not executed: DEV 0070 release (0070 `de0b51c6…` = expected; 70-entry manifest `134d815d…`), Git handoff (Portal local `--no-ff`; OwedBook PR because `main` is protected), carry-forward list and Gate D handoff. No GitHub workflows or deployments in either repo. GCP Cloud Build triggers could not be read (gcloud needs re-authentication); a read-only check is in the handoff.
- No commit, push, merge, deployment, DEV apply, database or provider write, cleanup or refund. DEV stays at 69. Gate D pending.

## 19–20 November 2026 — Director-led manual QA walkthrough and repair round (Claudy)

- **19 Nov:** Tony and JARVIS walked the product end to end on local OwedBook/Portal against DEV (at 70 after the 0070 apply). **Ten findings:**
  - R1 Add Store entry points
  - R2 busy states
  - R3 add-store payment journey
  - R4 member-removal confirmation
  - R5 owner/admin model
  - R6 Settings placeholder
  - R7 Profile
  - R8 audit readability
  - R9 removal presentation
  - R10 placeholders and tester mail
  The walkthrough passes and the unconfirmed member logout are recorded in the repair ledger.
- **Plan and approval:** plan `response_2026-11-19_173752_manual-qa-repair-plan.md` (OwedBook). Approved 20 Nov with decisions (APBM_RULINGS), amendments AM-MQ-01…04.
- **R3 investigation (DEV read-only, one rolled-back READ ONLY transaction):** the second-store operation's single `invoices.pay` failed with Stripe `missing`. Registration Checkout stores the card on the subscription, not as the customer's invoice default; fixtures had always set a customer default. The charge now uses the subscription's default payment method. The hosted-invoice return limitation was verified in the installed SDK types.
- **0071 (owner protection and flags, `store_profile`, readable `admin_audit`):**
  - SCRATCH dry run, then preloaded proof 180/180 (rolled back), then the committed apply (receipt `forward-apply-1795139934011.json`), then the committed proof 180/180.
  - DEV not touched beyond the read-only investigation.
- **Checks:**
  - OwedBook jest 355/355; Portal jest 533/533 (new tests for every repair);
  - typecheck clean in both repos;
  - lint: no new errors (warnings follow the existing pattern);
  - `next build` PASS for both apps in isolated copies (the running :3000/:3001 servers were untouched). The Portal build first stopped on a Next.js security advisory notice; a rerun completed. No upgrade was made.
- **Not run:** Playwright (it would write to DEV), live Stripe payments, mail sends, deployment.
- **Retest:** PENDING Tony/JARVIS (`MANUAL_QA/TESTER_PLAN.md`).
- **Process lesson (mandatory):** a Director-led end-to-end manual walkthrough is required before release approval, alongside automated and executor testing. The automated proofs passed while R3's real-owner card path was broken: every fixture set a customer default card, so no automated proof exercised a card saved only on the subscription.

## 20 November 2026 — DEV migration 0071 applied (Director release; Claudy)

- **Release scope:** apply ONLY 0071 to DEV per `MANUAL_QA/2026-11-19/DEV_APPLY_0071_PREPARED.md`. Both repos on `repair/apbm-007b-manual-qa` (HEADs `64295a7` / `0443fda`); the uncommitted repair changes were permitted.
- **Pre-write:**
  - 0071 `9a912307…` and manifest `403e27b1…` matched; 0001–0070 unchanged;
  - tooling identical to HEAD (hashes in the report);
  - DEV catalogue = post-0070 `21c2e80d…`.
  - Guard preflight `ready` false by design (69-file and branch constants, as at 0070).
  - Data changes since the 0070 post-check were verified read-only to be exactly the walkthrough's new rows.
- **Apply:** `Committed 0071_007b_owner_settings_audit.sql`, receipt PASS.
- **Post:**
  - ledger 71; catalogue `849b7699…` (103 functions);
  - guard post: every preservation check equal, privilege lists empty, DEV test clock refused 42501;
  - rolled-back compatibility: no scope diffs (counts reflect the walkthrough data);
  - the SCRATCH comparison differs only in `defaultACLs`.
- **Local config:** `MAIL_RECIPIENT_POLICY=open` added to both `.env.local` files (one line each; DEV-fenced).
- **Not done:** no reset, retry, other migration, Git, deployment, app start, payment or mail test.

## 20 November 2026 — final consolidated manual-QA repair batch (Director order; Claudy)

- **Workflow:** repairs and checks → Tony/JARVIS targeted retest → deployment preparation. The campaign is not certified.
- **Repairs (both repos, uncommitted on `repair/apbm-007b-manual-qa`):**
  - F1 `/stores/add` server guard, plus an authorization review of every Add Store and removal operation;
  - F2 owner-managed billing for store admins (no false warnings);
  - F3 access-denied state;
  - F4 audit wording (scheduled vs removed, owner-safe handover, system actor);
  - F5 navbar name and role badge in both apps;
  - F6 auth scope unchanged.
- **Details:** `MANUAL_QA/2026-11-19/REPAIR_LEDGER.md` § Final consolidated batch.
- **Checks:**
  - jest OwedBook 370/370 and Portal 568/568; typecheck clean;
  - lint 0 errors on changed files;
  - both builds PASS in isolated copies.
  - No DEV write; 0071 unedited; no new migration.
- **Manual results recorded as reported:**
  - invitation → acceptance;
  - member scope and removal;
  - audit actors;
  - filtering;
  - the admin's Store 04 attempt refused.
- **Pending:**
  - audit pagination;
  - 3DS, decline and recovery;
  - scheduler expiry and removal;
  - transfer;
  - populated data isolation;
  - full password tests;
  - deployed smoke tests.
- **Next.js advisory (investigated, not acted on):**
  - Portal 16.4.3 is affected by moderate advisories fixed after 16.4.4.
  - OwedBook 16.3.7 is also affected by critical and high advisories (≤16.4.0, <16.3.8).
  - The npm registry lists no advisory for 16.4.5. That is the minimal common target and needs a separate approval.
- **Deployment preparation (read only):** `MANUAL_QA/2026-11-20/STAGING_INVENTORY.md`.
  - The old Portal kit conflicts with the code: domain, missing `NEXT_PUBLIC_APP_ENV`, an obsolete "zero secrets" assumption, and a service that was already deployed.
  - OwedBook has no kit.
- **QA lesson (reaffirmed):** a Director-led end-to-end manual walkthrough belongs inside release verification, alongside the automated checks. This batch's findings F1 to F5 came from that walkthrough, not from the automated suites.
