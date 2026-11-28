# CONTRACT_FREEZE — ABM007_FINAL

**Frozen:** 24 November 2026, Asia/Dhaka, by the Engineer recording the Director's release (`SOURCES/DIRECTOR_RELEASE_E2_2026-11-24.md`; `ABM_RULINGS.md` AM-08 to AM-10).

**What "frozen" means here.** The files below, at these hashes, are the contract Engineering builds to. From now on the contract changes only through `ABM_RULINGS.md` section 3. External settings (sessions S1 and S2), QA authorizations (rulings section 4, group 3) and deployment authorizations (group 4) are **not** part of this freeze and stay PENDING.

## 1. Frozen identity

| File | SHA-256 |
|---|---|
| `ABM_BRIEF.md` | `560968f84e3f0a5891ee62d84649a60a8fe8c8461aad2a90dec3ab43b20b1531` |
| `ABM_ACCEPTANCE_SPEC.md` | `42163bae823ff6e510e4d100543ea4ea628375cdd5bf7613d2094887c3f6cced` |
| `ABM_RULINGS.md` (through AM-10 and section 5) | `5aca202998840703a046769f36f413c3a8b5f8286413d941c8481ca736b73d8b` |
| `CONTRACTS/BACKLOG_DISPOSITIONS.md` | `f1c30c080857d6e85a82c492e81c287204421ce03c8515887771cb2c7bd5456e` |
| `CONTRACTS/BRAND_UI_CONTRACT.md` | `8aa6729cdebe7c45670b754c66ee3729fb1808be06be9bb40066e8e5fc90142f` |
| `CONTRACTS/EMAIL_AND_STRIPE.md` | `053cf4667f5578b8b402fcdb27422626ebd1451d3e19da35f51ac3a392ceaa86` |
| `CONTRACTS/HELP_CONTENT.md` (pre-fill) | `038c9aed53f71bc1b784dc5606c8cfc53541cf9fbc8aac68216748406a2d5ef4` |
| `CONTRACTS/LOGO_ASSET_SPEC.md` | `7cd3929d2fb5bac21c382bc0c8ee7558c9e7938ad515f405d5cc9a7477e945f0` |
| `CONTRACTS/NO_BREAK_AND_PATHS.md` | `bcc8338037346c9e007a595b0645f6fc3897555be1e5f6109f09f7ae066e3b89` |
| `CONTRACTS/OWEDBOOK_POINTER.md` | `4f03c524737f4df1d4c7bbdb512619a05fc5cf51cd8be9dd673a6a166e8e80bf` |
| `CONTRACTS/UI_SPEC.md` | `c98482e11db9c34c93315b280db19b6f15d69427d5ec6b5de1000a924940008c` |
| `DESIGN/tokens/abm007_final_tokens.css` | `c2625014a0001da3c0a82c1d5979512356b9770b813163ae23960f21793d1ac2` |
| `DESIGN/assets/Pharmacy-Books-Logo-Primary.png` (logo master) | `e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd` |
| `DESIGN/assets/brand.css` (reference stylesheet) | `e24670ef497db7eda66a7285eb058c13a27fa966ae11d491a755b73c4212489b` |
| Release source `SOURCES/DIRECTOR_RELEASE_E2_2026-11-24.md` | `8ae25f6643760ba305bb5cfc4d0e5d5fb8c5ba8377d927c6479bf437a3bf3cf3` |

The DESIGN renders and samples are the visual target named by the brand contract and are frozen as delivered in the pack (`FILE_INDEX.json`, pack-level).

## 2. Reconciliation with the rulings

The contract files were written as review candidates and still carry "PROPOSED" or "review" status lines. Those lines are not edited; the rulings below govern them.

| Contract text | Governed by | Reading at freeze |
|---|---|---|
| "PROPOSED" status lines in `BRAND_UI_CONTRACT.md`, `UI_SPEC.md` and the token file; "PROPOSED P-01 to P-04" markers | AM-08 (2) | Approved. Gate V (AC-V01) is reconfirmed by the Director's ruling 2 |
| "REVIEW CANDIDATE" in `ABM_BRIEF.md` and `ABM_ACCEPTANCE_SPEC.md` | AM-08, AM-10 | Frozen at the hashes above |
| `LOGO_ASSET_SPEC.md` section 4, both points | AM-08 (2) | Small-size legibility accepted. **Trimming not authorized**: derived files scale the full 1024 x 543 canvas |
| P-05 to P-22 "proposed" in the backlog dispositions, email and Stripe contract and paths contract | AM-08 (1) | Group 2 split approved as proposed |
| `NO_BREAK_AND_PATHS.md` section 6, "Local install, build, serve" for the Engineer, against the standing no-server instruction | AM-08 (5) | Isolated production preview builds allowed for self-checks and the redirect reproduction only, within the ruling's limits |
| `NO_BREAK_AND_PATHS.md` section 3 records table, `RECOVERY.md` | AM-08 (4) | Protected until authorized closeout |
| `HELP_CONTENT.md` Part B labels ("Sign out", "My Profile", My Stores "Everyone", "cancel" an invitation) | AM-08 (6), AM-09 (D) | The screen wins. Corrections are recorded in the Engineer's corrections appendix in that file; the shipped page follows the corrected text. Guards are not changed |
| `EMAIL_AND_STRIPE.md` sections 1 and 3 (S1 inputs) | AM-09 (F) | In scope; waits on the Director's export and reads. Not reconstructed |

## 3. Areas Engineering fills after the freeze (not contract changes)

- `CONTRACTS/HELP_CONTENT.md`: the Part A label-verification table and an appended Engineer corrections section.
- `ABM_ACCEPTANCE_LEDGER.md`, `QAM/QAM_MANIFEST.md`, `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`.
- `ABM_STATE.md`, `ABM_JOURNAL.md` (appended rows), `ABM_EXECUTION_PLAN.md`, `EVIDENCE/`.
