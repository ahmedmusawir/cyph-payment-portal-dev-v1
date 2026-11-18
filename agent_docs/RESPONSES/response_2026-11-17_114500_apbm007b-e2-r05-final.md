# APBM-007B E2 — final engineering review r05 (DEV apply + finish engineering)

Claudy · 17 November 2026, ~11:45 Asia/Dhaka. Covers "CLAUDY — DIRECTOR RELEASE: APBM-007B DEV APPLY" (recorded verbatim in
`APBM_JOURNAL.md`). **ENGINEERING COMPLETE is NOT declared:** two blockers remain (§5). No Git staging, commit, push, merge or
deployment. No QA approval or certification is implied.

## 1. Recorded

- Manual receipt observation 5 (buyer-access email, 10:55 Asia/Dhaka), as Tony reported it.
- The DEV-apply authorization, verbatim (journal) and summarized (rulings), including the explicit delegation of the DEV-write
  step.

## 2. DEV apply — PASS (`DEV_APPLY/`)

| Step | Result |
|---|---|
| Target identity | `loadEnv` (prefix `APBM_DEV_`, target `dev`): project ref, API and SQL references all `yrsuwikjnbmvpznrgydb`; branch `apbm-007b`, OwedBook HEAD `0b78552` |
| Hashes / inventory | 9 full hashes = r04 final manifest; fresh 69-file inventory = approved runner manifest (exact) |
| Applied-ledger prefix | 60 entries, an unchanged ordered prefix ending `0060_billing_reads.sql` |
| Fresh read-only before-catalogue | `fab5247f4cf3c7c003d66afd32b77ba1a20b5e6fc63b2d102e346717e9952e6a` = expected (23 tables / 14 policies / 36 functions) |
| Apply | existing `apply-forward.mjs` with its DEV guard (`APBM_DIRECTOR_APPLY`), approved manifest and fresh before-catalogue; 0061…0069 committed **one transaction each** with a ledger row each; status PASS (05:15:16–05:15:33 UTC); ledger reservation `dev_live_apply` 1/1 |
| Deployment identity | guarded helper (`scripts/apbm007b/dev-apply-guard.mjs bind`, DEV ref only, Director-apply env) → `bound`; identity = `yrsuwikjnbmvpznrgydb` (immutable) |
| Test-clock overrides on DEV | `billing_test_context_enable` refused 42501 (probe always rolled back); 0 enabled contexts; `billing_now` = real `now()` |
| Ledger after | 69 entries = manifest, unchanged ordered prefix |
| After-catalogue | `4a1c1719d65931710b14fe831ae522d2550fea0981a72a747b8bd6b2cb35b5bf`, 34 tables / 14 policies / 99 functions. Identical to the SCRATCH reference in columns, tables, policies, functions, constraints, indexes, triggers and enums. Only difference: three platform default-ACL rows owned by `supabase_admin`, present unchanged in DEV's before-catalogue |
| Permissions / RLS | every public table RLS on; no new 007B table grants `anon`/`authenticated`; every SECURITY DEFINER function pins `search_path` |
| Preservation | business ids, accounts/owners and per-key counts of memberships, claims, report files, pending registrations, checkout operations, subscriptions, billing customers and notifications **equal** before/after (digests only). Audit: the 1,805 earlier rows are unchanged; **9 additive rows** = the existing audit trigger recording 0061's backfill (`pharmacy_id`, `ownership_started_at`) on each of the 9 businesses. Every business has an identity (9 identities / 9 NPIs) |
| Compatibility | as the 11 existing members and 7 owners, in one transaction always rolled back: scopes 11/11 as expected (memberships ∪ owned-account live stores); `owedbook_rows` 14/14 and `owedbook_summary` 14/14 OK; `owner_billing_overview` 7/7 OK; access states 6 active, 1 past-due reminder; audit count unchanged after. 007A compatibility trigger (0068) present; handoff functions present. Director's apps on 3000/3001 answer |
| Not done | no DEV users, fixtures, resets, deletions, payments or emails |

Deviations, plainly: a first compatibility pass in a READ ONLY transaction returned 25006 for the audited reads (they write an
audit row per call). This was a method artefact, so the check was re-run in a rolled-back transaction. One expected-scope
formula of mine omitted owned-account stores and was corrected. One malformed read-only query errored with no effect.

## 3. Engineering finished since r04

- **AC-011 existing identity:** OWNER_A invited OWNER_B (an existing SCRATCH identity with its own account) through the staff
  panel (1 email). In a separate browser context OWNER_B signed in normally, saw exactly one invitation and accepted it.
  OWNER_B is now a member of A1, own account untouched, password hash unchanged (`ACCEPT_EXISTING/`).
- **Final checks** (`FINAL/final_checks_summary.json`): unit Portal 482/482, OwedBook 312/312; typecheck clean; lint 0 errors;
  clean builds of both apps with scanner self-test 23/23 and clean client scans (OwedBook documented `generateLink` only); SQL
  proof SCRATCH 130/130 and local fresh 134/134; OwedBook staff journey 6/6 on three engines against the running proof build,
  whose product source is byte-identical to both repos.
- **SQL proof correction (not a product defect):** the first final SCRATCH run gave 129/130. The backfill check assumed
  "identities ≥ ownership rows", which check E's completed transfer legitimately breaks (AC-022 successor ownership under the
  same identity). It was replaced by the real invariants (no orphan, one live ownership per identity, shared identity only via a
  completed transfer). The first-run output is kept.
- **Records:** full per-AC QAM handoff; QAM_MANIFEST, QAM_STATE (no transition), APBM_STATE, SUCCESSOR_INPUTS reconciled. The
  missing original v0.1 review disclosure and the not-received Friday confirmation text are preserved.
- **Release of owned resources:** proof servers stopped; local rehearsal containers stopped; two spent fixture credential files
  and a stray OwedBook Playwright marker removed; Director's 3000/3001/3457 untouched. Provider: 0 live E2-owned objects.

## 4. Effects (cumulative)

Attempted cents 434,604 / 480,000 · customers 13/13 · subscriptions 13/13 · pay/hosted 25/30 · payment attempts 47/60 ·
emails 10/24 · SCRATCH identities 12/14 · DEV apply 1/1 · DEV identities 0. Full ledger `EFFECTS/`.

## 5. Blockers — why ENGINEERING COMPLETE is not declared

1. **B1 — AC-007 crash/restart.** The criterion asks to "prove crash/restart and late-payment case". Late payment, lease
   takeover, stale-fence refusal and job-path expiry are proven; a running server killed and restarted mid-operation is not.
   It needs one Stripe customer and one subscription, and both ceilings are at 13/13. **Decision needed: raise customers and
   subscriptions 13 → 14.** Cents and pay/hosted already fit (about 19,700 cents and 1 pay).
2. **B2 — AC-011 existing-identity inbox receipt.** The sign-in email to ENGINEERING_OWNER_B (sent 11:23:40 Asia/Dhaka, manual
   record 6) needs Tony's manual inbox check. Don't use its link; acceptance is already done.

When both close, Engineering can record ENGINEERING COMPLETE — AWAITING QA BRANCH with a short addendum. Non-blocking
limitations are listed in the handoff §4.2. Most notably, the Portal browser regression was not re-run at final, because
every Stripe-backed fixture owner is cleaned up; its last full run was r02, 9/9 on three engines.
