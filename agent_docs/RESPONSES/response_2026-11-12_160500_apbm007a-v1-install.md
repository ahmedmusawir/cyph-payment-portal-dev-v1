## APBM007A v1.0 documentation installed — E2 not released

The pack is installed in the canonical OwedBook module, nothing was deleted, and every replaced document is preserved. Only documents changed: no build, Git change, provider call, email, server, migration, sample load or deployment.

### 1. Package verification

| Check | Result |
|---|---|
| Indexed files | 185 of 185 present, size and SHA-256 equal |
| Unindexed files | Only `FILE_INDEX.json` itself |
| Symlinks or paths outside the module | None, apart from the pack's root cover note |
| Pack status | `TECHNICAL_FREEZE_E2_NOT_RELEASED` |

### 2. What the merge did

I compared every file before writing and copied file by file, never a folder.

| Outcome | Count | Detail |
|---|---|---|
| Already identical | 115 | Includes all E1 evidence in the pack; no evidence file differed |
| Added | 39 | `E2_RELEASE_REQUEST.md`, `MIGRATION_PLAN.md`, `INSTALL_V1.md`, `CONTRACTS/IMPLEMENTATION_REQUIREMENTS.md`, two governing records, two evidence notes, and the 31-file `GOVERNING/HISTORY/v0_2_R1` snapshot |
| Replaced | 30 | The operative documents listed below |
| Deleted | 0 | |
| Local-only, untouched | 13 | Seven portal screenshots and review ZIPs r1–r6 |

**Replaced (30):** `AGENTS`, `CLAUDE`, `README`, `REVIEW_START_HERE`, `APBM_ENTRY`, `APBM_STATE`, `APBM_JOURNAL`, `APBM_RULINGS`, `AMENDMENT_LEDGER`, `APBM_ACCEPTANCE_SPEC`, `APBM_EXECUTION_PLAN`, `DIRECTOR_PREP`, `MISSING_INPUTS`, `PREFLIGHT_LEDGER`, `LAUNCH_PROMPTS`, `E1_RECON_MISSION`, `E1_RELEASE_REQUEST`, `E2_EXECUTION_INSTRUCTIONS`, `STAGING_RELEASE`, four contracts (auth handoff, billing, data, environment), and seven QAM files.

**How the old texts are kept:**
- 22 equal the pack's own `HISTORY/v0_2_R1` snapshot, now installed.
- 5 are contained whole in the new version: the state file with all my E1 entries, and four QAM files that gained only a banner.
- 3 QAM files had no snapshot, so I saved the prior versions under `GOVERNING/HISTORY/v0_2_R1/LOCAL_PRE_V1_INSTALL/`. None held a QA result.

`E1_DIRECTOR_RELEASE.md` was identical and is unchanged. The two E1 request documents gained only a "historical record" banner.

I appended one install entry each to `APBM_STATE.md` and `APBM_JOURNAL.md`, and kept the pack's index as `GOVERNING/PACK_v1_0_FILE_INDEX.json`. After installation, every pack file equals the installed file, except those two, which are the pack text plus my appended entry.

### 3. Payment Portal pointer

`agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA_POINTER.md` still points at the same canonical module. I updated its status lines in place: v1.0 installed, E1 complete, E2 not released, with the path to the release request. No second module copy exists in the portal repo.

### 4. Remaining E2 entry requirements

From `E2_RELEASE_REQUEST.md`. I did not open the env or inbox files during this installation, as the install note requires.

| # | Requirement | Owner | State as last seen |
|---|---|---|---|
| 1 | Git: portal lock disposition, `.env.pilot.example` disposition, `apbm-007a` branches in both repos, portal remote under Cyberize-Group | Tony | Not done: both repos on `main`, lock still modified, example file still deleted, remote still the personal account |
| 2 | DEV tooling block: `APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY`, `APBM_DEV_SECRET_KEY` alongside the DB URL | Tony | The three were absent when I last read the names earlier today; not re-read now |
| 3 | Recovered APBM003 logins privately available to engineering and Q1 | Tony | Recovered and used, per your note. I need only the private location; no reset |
| 4 | Approve the labelled 10%-once whole-invoice sandbox APA fixture | Tony | Open |
| 5 | Scope choice: full v1.0 (recommended in the request) or defer failed-renewal grace to 007B | Tony | Open; deferral means v1.1 contracts first |
| 6 | Starting SHAs, pack index hash and receipt location recorded, then the E2 release statement | Tony | Open. Starting SHAs today are `bc4e433` and `c89572a`, as expected |

E2 remains held until you issue the release statement.
