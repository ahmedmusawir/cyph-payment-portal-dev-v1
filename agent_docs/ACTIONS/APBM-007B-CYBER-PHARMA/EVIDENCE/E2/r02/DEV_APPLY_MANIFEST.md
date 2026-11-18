# APBM-007B — final migration manifest for the grouped DEV-apply checkpoint

Claudy · 17 November 2026, Asia/Dhaka · **DEV apply is NOT authorized by the current release and was not performed.**
This is the reviewed input for Tony's apply release.

## 1. Chain

OwedBook `supabase/migrations/`, 69 contiguous files. 0001–0060 unchanged (applied on DEV and SCRATCH). New for 007B:

| File | SHA-256 | Purpose |
|---|---|---|
| `0061_007b_identity_clock_foundation.sql` | `97ab60b20365add56fcc9da4c8c69d6f92879a8a1f2b847d2a665cac86780043` | canonical pharmacy identity + backfill, lifecycle columns, deployment identity, guarded test clock, `billing_now`, access state on account time |
| `0062_007b_store_operations.sql` | `a47d459ad3d1bb86e19a28da82747827ee5d0a7a2577a29698facae47370d5ce` | quotes, store operations, invoice mapping, call intents, holds, pricing/window functions, saga transitions, activation |
| `0063_007b_lifecycle_transfers.sql` | `3adef5ca840b4ce1a4ee8df705c8b239c14693401dc4080fa993c34ef1baba88` | active-ownership indexes, live predicate on every tenant path, removal/undo/finalize, transfers, seller history |
| `0064_007b_invitations.sql` | `b104a17f0dc97020b7cfa6ec93cd3d2e94fdb1b4fb419d38fe3fd6c8920d2b11` | invitations, atomic admin replacement, member removal, read-only grants enforcement |
| `0065_007b_notices.sql` | `9eca9725a36bdadd064201ac3bbe774edffecc6c574a6194858d3699d8e9b55d` | billing notice ledger, claims, suppression of legacy reminders |
| `0066_007b_operator_audit.sql` | `3c9bae80614af88ffa205e6401548c6dbb9db5e183876c2155141c8b3b11c85c` | append-only operator audit, owner uniqueness, owner/admin recovery, BP-04 close, reactivation authorization |
| `0067_007b_reads_privileges.sql` | `9668bb9d73fc4323c55242e36aef94574788d20ada990dadc2c4ae10b8e90bde` | owner operations read, final privilege/catalogue assertions |
| `0068_007b_identity_compat_fix.sql` | `aa567f2d48a13abf85085e610ce0c64d0c749c765acf7a54f980d69faf4db847` | **Ruling 1** narrow forward fix: identity trigger for pre-existing inserters (007A provisioning, seed harnesses) |
| `0069_007b_reactivation_transfer_registration.sql` | `c173249ad7706392f26da57ab32011b641e7dee9ebdf39ad613e9137d74668ad` | **Rulings 2 and 3**: decision-9 paid re-add restores the original record; transfer buyer via normal registration. **A second new file beyond the narrow 0068 named in ruling 1 — needs the Director's explicit acceptance (ALLOWED_PATHS listed 0061–0067)** |

Bootstrap baseline SHA-256 `52324e91e877079ef26861d6fb7b74df394a4baf1901dc45a37f312d608fd144`. Runner inventory (manifest for
`apply-forward.mjs apply --manifest`): `EVIDENCE/E2/r02/MIGRATIONS/dev_apply_migration_inventory.json` (69 entries).

## 2. Evidence

| Item | Result |
|---|---|
| Isolated DB fresh 0001–0069 | PASS (`local_fresh_full_0069.json`) |
| Isolated DB seeded through 0067 → fault in 0069 rolled back (ledger 68) → resume | PASS (`local_seeded_through_0067.json`, `local_forward_fault_0069.json`, `local_forward_resume_0069.json`) |
| Isolated DB proof | 134/134 incl. committed NPI and admin-acceptance races (`sql_proof_local.json`) |
| SCRATCH: 0061–0067 (16 Nov) then 0068–0069 (17 Nov) forward with the existing runner, applied history and checksums untouched | PASS; ledger 0001–0069; 2 of 12 chain cycles |
| SCRATCH proof (rolled back) | 130/130 (`sql_proof_scratch.json`) |
| Privileges | every new table RLS on with no `anon`/`authenticated` privilege; every SECURITY DEFINER function pins `search_path=''`; user-callable 007B surface asserted exactly (0067); per-file assertions in 0061–0069 |
| Preservation | backfill keeps every `businesses.id`/claims/files/audit link; asserts no duplicate/null NPI and no duplicate owners before indexes; legacy pending reminders suppressed with history (none pending on DEV at inventory) |
| DEV read-only before-catalogue | project `yrsuwikjnbmvpznrgydb`, read-only on, catalogue SHA-256 `fab5247f4cf3c7c003d66afd32b77ba1a20b5e6fc63b2d102e346717e9952e6a`, 23 tables / 14 policies / 36 functions (`dev_before_catalog_summary.json`) |
| SCRATCH after-catalogue (reference shape) | `3b9f467c51b34a3ce0c7967d98a77df853ed2c23045082948f727ded9e2153fc`, 34 tables / 14 policies / 99 functions |
| Running 007A apps on DEV after apply | compatible: 0068 keeps the 007A provisioning insert working; 007A handoff, billing overview, admin reads keep their signatures |

## 3. Apply procedure for the release (Tony-only DEV write)

From the OwedBook root, with `RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
APBM_EVIDENCE_DIR=<OwedBook>/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/<run> APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb`:
1. `node scripts/dev-verify.mjs` → must equal the before-catalogue SHA above (otherwise stop).
2. `node scripts/apply-forward.mjs apply --manifest <inventory> --before <catalog.json from step 1>` → commits 0061–0069 one
   transaction each with a ledger row; any failure stops with that file rolled back.
3. Bind the DEV deployment identity so test time can never be enabled there:
   `node -e` call of `public.billing_deployment_bind('yrsuwikjnbmvpznrgydb')` as service role (a one-line helper is provided
   with the release when authorized; it refuses anything but the DEV reference).
4. `node scripts/dev-verify.mjs` again; ledger must equal the 69-entry manifest; record the after-catalogue.
