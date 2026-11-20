# Migration 0071 — SCRATCH evidence and prepared DEV apply (NOT released)

- **Prepared:** Claudy, 20 November 2026.
- **Authorization:** the Director authorized the SCRATCH apply and its proofs. DEV apply is a **separate release that has not been given**, and nothing here has been run against DEV.

## Migration

| Item | Value |
|---|---|
| File | OwedBook `supabase/migrations/0071_007b_owner_settings_audit.sql` |
| SHA-256 | `9a91230710d5895c7bf1c6add346d83e9ffca22199e17910a3c48ec052497955` |
| 71-entry manifest (0001–0070 byte-equal to `EVIDENCE/CLOSEOUT/DEV_APPLY_0070/approved-manifest-0070.json`, plus 0071) | OwedBook `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/manual-qa-0071-scratch/manifest-0071.json`, SHA-256 `403e27b18c51afbb53777c8f7ddac80ec94d170a1c4ff70388fbeffd6aec9c99` |
| Replaces | `admin_members`, `invitation_create`, `member_remove`, and `admin_audit` (drops the 3-argument form and creates `(uuid,int,bigint,boolean)` with a default) |
| Adds | `store_profile(uuid)` (authenticated; definer; audited read) and `audit_detail(text,text,jsonb,jsonb)` (service_role only; not definer) |
| Data changes | none. No table or policy change |

## SCRATCH result (`ihgcsrypblqkwommrkgj`)

| Step | Result |
|---|---|
| Dry run (rolled back) | compiled; all six functions have `search_path=""`; definer flags as intended |
| Full proof with 0071 preloaded per scenario (rolled back) | 180/180 PASS |
| Committed apply (`scripts/apply-forward.mjs apply`) | `Committed 0071_007b_owner_settings_audit.sql`. Receipt `forward-apply-1795139934011.json` (SHA-256 `bb405c62…4fba`), status PASS, 01:58:52Z → 01:58:54Z |
| Catalogue before / after | `38b8a8de…ef84a6` (34 tables / 14 policies / 101 functions) → `6458dde3…fcff2d` (34 / 14 / 103) |
| Committed proof (`scripts/apbm007b/sql-proof.mjs --scratch`) | **180/180 PASS** (154 existing plus 26 new 0071 checks), `sql-proof-scratch.json` (SHA-256 `7b4035ed…d1e3`) |

Evidence lane: OwedBook `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/manual-qa-0071-scratch/`.

## Compatibility notes for the DEV release

- **Current apps (this repair round) on DEV at 70:** they work and degrade honestly.
  - Staff lists show no Owner badge.
  - Settings shows name, NPI and NCPDP, and says the other details are unavailable.
  - Audit uses the old call with generic wording.
  - Profile Owner works.
- **Repaired apps on DEV at 71:** full behaviour.
- **Merged `main` apps (`64295a7`/`0443fda`) on DEV at 71:** compatible.
  - Those apps call `admin_audit` with named `p_business_id, p_limit`, which still resolves through the new defaults. They now see no view events by default.
  - `admin_members` gains extra fields, which they ignore.
  - The owner can no longer remove their own membership row, and cannot be removed by anyone.
- **007A rollback (`c68c4ac`/`0b78552`) at 71:** same `admin_audit` and `admin_members` reasoning. Re-check in the release.

## Prepared DEV procedure (for the Director's release; mirrors the 0070 sheet)

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
git rev-parse HEAD                                     # the commit that contains 0071 (Director's branch/merge)
sha256sum supabase/migrations/0071_007b_owner_settings_audit.sql   # 9a912307…7955
MAN=$PWD/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/manual-qa-0071-scratch/manifest-0071.json
sha256sum "$MAN"                                       # 403e27b1…9c99
M70=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/DEV_APPLY_0070/approved-manifest-0070.json
export RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb
export APBM_EVIDENCE_DIR=$PWD/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-0071
R70=$PWD/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-0070
node scripts/dev-verify.mjs --expect "$R70/catalog-after.json" --manifest "$M70"     # DEV still = post-0070 catalogue (21c2e80d…)
cp "$APBM_EVIDENCE_DIR/catalog.json" "$APBM_EVIDENCE_DIR/catalog-before.json"
node scripts/apbm007b/dev-apply-guard.mjs preflight --manifest "$MAN"                 # ledger 70 = unchanged prefix of the 71
# THE ONLY DEV WRITE — one transaction
APBM_DIRECTOR_APPLY=yrsuwikjnbmvpznrgydb node scripts/apply-forward.mjs apply --manifest "$MAN" --before "$APBM_EVIDENCE_DIR/catalog-before.json"
unset APBM_DIRECTOR_APPLY
node scripts/dev-verify.mjs --manifest "$MAN"                                         # ledger 71 = manifest; 103 functions
cp "$APBM_EVIDENCE_DIR/catalog.json" "$APBM_EVIDENCE_DIR/catalog-after.json"
node scripts/apbm007b/dev-apply-guard.mjs post --manifest "$MAN" --before "$APBM_EVIDENCE_DIR/guard-preflight.json"
node scripts/apbm007b/dev-compat-check.mjs --mode rolled-back
```

- **Expected:**
  - apply prints exactly `Committed 0071_007b_owner_settings_audit.sql`;
  - guard post shows ledger 71, last 0071, and every `preservation_equal` true;
  - the compatibility receipt matches the 0070 receipt;
  - the SCRATCH catalogue `6458dde3…` matches the DEV after-catalogue in every section except `defaultACLs`.
- **On failure:** the guard's obsolete 0070-era summary fields (`ledger_69_equals_manifest`, `ledger_0001_0060_unchanged`) are not failures. Do not retry automatically and never reset DEV.
- **Afterwards:** restart both apps (no rebuild is needed for 0071 itself).

## APPLIED — 20 November 2026 (Director release; Claudy executed)

- **Release:** the Director released "apply ONLY 0071 to DEV yrsuwikjnbmvpznrgydb following this document", with the uncommitted repair changes permitted (both repos on `repair/apbm-007b-manual-qa`).
- **Pre-write:** all hashes matched this sheet; 0001–0070 unchanged; tooling identical to HEAD; DEV catalogue = post-0070 `21c2e80d…`.
- **Data since the 0070 post-check:** exactly the walkthrough's rows. Verified read-only: no pre-0070 row deleted.
- **Receipt:** `forward-apply-1795145858189.json` PASS, `Committed 0071_007b_owner_settings_audit.sql`, 03:37:31Z → 03:37:38Z.
- **Post:**
  - ledger 71 = manifest; catalogue `849b7699…f69e` (34 / 14 / 103);
  - guard post PASS: every preservation check equal; DEV test clock refused 42501;
  - compatibility rolled back: no scope diffs;
  - against SCRATCH: no differing sections except `defaultACLs`.
- **Evidence:** OwedBook `EVIDENCE/apply/dev-apply-0071/`.
- **Report:** OwedBook `agent_docs/RESPONSES/response_2026-11-20_093957_dev-0071-apply-result.md`.
