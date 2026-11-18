# APBM-007B — DEV migration 0070 release sheet (prepared, NOT applied)

Prepared by Claudy (Engineering) for JARVIS closeout, 18 November 2026, Asia/Dhaka. **Nothing in this file was run.** It is
the input for the Director's separate DEV-apply release. It is not authorized by Gate Q, the cleanup release or the
closeout instruction.

## 0. Rule

**DEV must reach migration 70 before any merged (or `qa/apbm-007b`) application code runs against DEV.** The certified Portal
calls functions that only 0070 creates (`store_operation_deadline_passed`, `store_operation_payment_observed`), and 0070
changes `store_operation_transition` and `store_add_activate`. A Git merge runs no code, so the merge and this apply can be
released separately. Do not start or restart an app process from these checkouts against DEV until §5 passes.

## 1. Certified source (verified 18 Nov 2026, read-only)

| Item | Value |
|---|---|
| File | `supabase/migrations/0070_007b_consent_deadline_paid_time.sql` (OwedBook) |
| SHA-256 | `de0b51c61c4ef255934fc20b6c7abdc5d4b69e1129bbce4a8a15111905edce81`, equal to the expected value, in the certified commit `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871` and in the working tree |
| Introduced by | `1fd5a61` (repair round 1); unchanged in `855e0ad` |
| Content | Schema only: one added nullable column (`store_operations.provider_paid_at`), two new functions, two replaced functions (`store_operation_transition`, `store_add_activate`), grants and an assertion block. No row is updated by the file itself |
| Approved runner manifest | `approved-manifest-0070.json` (this folder), SHA-256 `134d815d95b0c63d4e60ba604e30fa8e4d2c29ce1e1954f09401c9c2d749d8f2`. 70 contiguous entries built from `855e0ad`; entries 1–69 and `bootstrapSHA256` are byte-equal to the approved r05 DEV manifest; entry 70 is the file above |
| DEV now | 0001–0069 (ledger 69, applied 17 Nov 2026 under the Director release). After-catalogue then: `4a1c1719d65931710b14fe831ae522d2550fea0981a72a747b8bd6b2cb35b5bf` (OwedBook `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-r05/catalog-after.json`) |
| SCRATCH now | 0001–0070 (applied in QA Q4/01; QA proof: fresh and upgrade 158/158) |
| Deployment identity on DEV | already bound to `yrsuwikjnbmvpznrgydb` (immutable). **No bind step in this release** |

## 2. Prerequisites (all must hold; otherwise stop)

1. The Director's written DEV-apply release for 0070 exists (separate from the merge release).
2. OwedBook checkout `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` is clean, and its `supabase/migrations/` matches `855e0ad` (on `qa/apbm-007b` at `855e0ad`, or on `main` after the merge; both trees are identical). The runner refuses any other inventory.
3. Credentials stay in OwedBook `.env.local` under the existing `APBM_DEV_` names. Nothing prints them. Do not paste values into the shell.
4. Nobody uses DEV through the apps during the window from §3 to §5. Reads by the 007A apps add `audit_logs` rows; r05 recorded exactly that as the only preservation difference.
5. No process started from a 0070-dependent checkout is connected to DEV.
6. Only one runner is active (the runner also takes advisory lock 342003).

## 3. Commands — RUN ONLY AFTER THE DIRECTOR RELEASES THE DEV APPLY OF 0070

Working directory: the OwedBook root.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
git status --porcelain                      # must print nothing
git rev-parse HEAD                          # 855e0ad2e22a37e633ab5a55b8459e9bcc6bd871, or the main merge commit whose tree equals it
sha256sum supabase/migrations/0070_007b_consent_deadline_paid_time.sql   # de0b51c6…edce81
MAN=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/DEV_APPLY_0070/approved-manifest-0070.json
sha256sum "$MAN"                            # 134d815d95b0c63d4e60ba604e30fa8e4d2c29ce1e1954f09401c9c2d749d8f2
export RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-0070
R05=/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-r05

# Step 1. READ ONLY: target identity (loadEnv: prefix, project ref, API and SQL host all DEV), catalogue unchanged since
# r05, ledger exactly the first 69 manifest entries.
node scripts/dev-verify.mjs --expect "$R05/catalog-after.json" --manifest "$MAN" --through 69
cp "$APBM_EVIDENCE_DIR/catalog.json" "$APBM_EVIDENCE_DIR/catalog-before.json"

# Step 2. READ ONLY: preservation baseline (counts and digests only).
node scripts/apbm007b/dev-apply-guard.mjs preflight --manifest "$MAN"

# Step 3. THE ONLY DEV WRITE: one transaction for 0070 plus its ledger row; on failure it rolls back and stops.
APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb node scripts/apply-forward.mjs apply --manifest "$MAN" --before "$APBM_EVIDENCE_DIR/catalog-before.json"

# Step 4. READ ONLY: ledger 70 = manifest; after-catalogue.
node scripts/dev-verify.mjs --manifest "$MAN"
cp "$APBM_EVIDENCE_DIR/catalog.json" "$APBM_EVIDENCE_DIR/catalog-after.json"

# Step 5. READ ONLY plus a probe that is always rolled back: guards, privileges and preservation.
node scripts/apbm007b/dev-apply-guard.mjs post --manifest "$MAN" --before "$APBM_EVIDENCE_DIR/guard-preflight.json"

# Step 6. ROLLED BACK: 007A compatibility as existing members and owners (no persisted row).
node scripts/apbm007b/dev-compat-check.mjs --mode rolled-back

# Step 7. READ ONLY on SCRATCH: reference catalogue at 70, then compare shapes (default ACLs excluded, as in r05).
RLS_HARNESS_PREFIX=APBM_SCRATCH_ APBM_TARGET=scratch APBM_PROJECT_REF=ihgcsrypblqkwommrkgj \
  APBM_EVIDENCE_DIR="$APBM_EVIDENCE_DIR/scratch-reference" node scripts/dev-verify.mjs --manifest "$MAN"
python3 -I -c 'import json,sys;a=json.load(open(sys.argv[1]))["snapshot"];b=json.load(open(sys.argv[2]))["snapshot"];d=[k for k in a if k!="defaultACLs" and a[k]!=b[k]];print("differing sections:",d or "none")' \
  "$APBM_EVIDENCE_DIR/catalog-after.json" "$APBM_EVIDENCE_DIR/scratch-reference/catalog.json"
unset APBM_DIRECTOR_APPLY
```

## 4. Expected results (stop at the first mismatch; do not retry a failed step 3)

| Step | Must show |
|---|---|
| 1 | `projectRef` `yrsuwikjnbmvpznrgydb`, `readOnly` `on`, `catalogSHA256` `4a1c1719…35b5bf`, 34 tables / 14 policies / 99 functions; exit 0. `Verifier failed: catalog check failed…` (exit 1, so the `cp` that follows fails) means DEV's schema or ledger differs from 17 Nov. **Stop and report**; do not rebase the expectation |
| 2 | `inventory_equals_manifest` true, `inventory_count` 70, `transaction_read_only` on, `ledger_count` 69, `ledger_is_unchanged_prefix` true, `ledger_last` `0069_007b_reactivation_transfer_registration.sql`. **`ready` and `ledger_0001_0060_unchanged` print false by design**: the guard was written for the 0061–0069 apply (it hard-codes 69 files, a 60-row ledger and branch `apbm-007b`). Read the named fields above instead. The write path in step 3 has its own complete guards |
| 3 | Prints exactly one line, `Committed 0070_007b_consent_deadline_paid_time.sql`; receipt `forward-apply-*.json` has `status` PASS and `committed` `["0070_007b_consent_deadline_paid_time.sql"]` |
| 4 | `catalogSHA256` differs from step 1. Ledger 70 = manifest (no "ordered migration ledger mismatch"); exit 0 |
| 5 | `ledger_count` 70, `ledger_is_unchanged_prefix` true, `ledger_last` the 0070 file; `deployment_identity` `["yrsuwikjnbmvpznrgydb"]`; `test_project_ref_constant` true; `enabled_test_contexts` 0; `billing_now_is_real_time` true; `tables_without_rls`, `new_tables_with_anon_or_authenticated_privilege`, `security_definer_without_pinned_search_path` all `[]`; each `compat_007a_functions_present` value 1; `businesses_without_identity` 0; every `preservation_equal` true (`audit_logs` false only if the apps were used during the window); `test_context_enable_on_dev` `refused 42501`. **`ledger_69_equals_manifest` prints false by design** (hard-coded 69) |
| 6 | No error; receipt `compat-rolled-back.json`; member, scope and function counts match r05 `compat-rolled-back.json`, except where DEV data legitimately changed since 17 Nov (explain each difference) |
| 7 | SCRATCH ledger 70 = manifest; `differing sections: none` |

## 5. Failure handling

Step 3 commits 0070 in one transaction. If it fails, nothing from 0070 persists and the receipt says
`STOP_PARTIAL_FAILURE`. **Never reset or replay DEV.** The Director decides the next step from the receipt and a read-only
catalogue. Rolling the application back to 007A `main` (`c68c4ac` Portal / `0b78552` OwedBook) is compatible with DEV at 70:
007A code does not use the 007B store-operation functions. Do not run the pre-repair 007B candidates (`427bec6`/`c8a2ed9`)
against DEV at 70. Their activation path relies on a direct `payment_pending → paid_pending_activation` transition, and
0070 refuses it.

## 6. Evidence to return

Return `$APBM_EVIDENCE_DIR`: `catalog-before.json`, `guard-preflight.json`, `forward-apply-*.json`, `catalog-after.json`,
`guard-post.json`, the compatibility receipt and `scratch-reference/catalog.json`. These files contain catalogue structure
and digests only, with no credentials. The lane is inside the runner's allowed `EVIDENCE/apply` path in OwedBook. Committing
it is a later records step.
