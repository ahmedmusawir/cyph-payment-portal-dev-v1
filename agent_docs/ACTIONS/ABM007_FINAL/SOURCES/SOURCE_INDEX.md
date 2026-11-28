# SOURCE_INDEX — what the author worked from

Snapshots are copies of the files the Director supplied in the authoring lab on 23 November 2026, renamed without the upload prefixes. Revised for REVIEW_02. Hashes for bundled files are in `FILE_INDEX.json` at the package root.

## Bundled

| File | What it is |
|---|---|
| `CYPH_FRANK_DESIGN.md` | The approved Pharmacy Books DESIGN.md |
| `ABM007_FINAL_BRANDING_CONFLICT_REGISTER_v0_3_2026-11-23.md` | Panel register with the Director's rulings |
| `ARCHITECT_REGISTER_POSITIONS_2026-11-23.txt` | The Architect's positions on the register, with its live-page and logo observations |
| `ARCHITECT_AUTHORING_INSTRUCTION_2026-11-23.txt` | The authoring instruction carrying the Director's assignment and settled decisions |
| `ARCHITECT_HANDOFF_CYPH_P6_APBM007_FINALIZE_2026-11-23.md` | The Architect's lab handoff (continuity, backlog, Help brief) |
| `CYPH_APBM007B_CAMPAIGN_DOCTRINE_JOURNAL_v0_3.md` | Campaign doctrine journal through CJ-031 |
| `Cyber_Pharma_QA_Recipe_v3_0_Rework_Record.md` | Recipe rework record |
| `Cyber_Pharma_Alpha_Tester_Guide_v3.pdf` | Tester guide v3, 27 pages |
| `ARCHITECT_REVIEW_01_2026-11-23.md` | The Architect's review 01 of the REVIEW_01 package: verdict ACCEPT WITH EXACT AMENDMENTS, amendments A-01 to A-06. Byte copy; kept as an attributed source |
| `ARCHITECT_REVIEW_01_COLOR_EVIDENCE.json` | The Architect's color arithmetic supporting A-01. Byte copy |
| `ARCHITECT_REVIEW_01_AUTHORING_INPUTS_PROVENANCE.json` | The Architect's provenance record for the five playbooks and the logo it supplied. The playbooks are in `../QAM/GOVERNING/`; the logo is in `../DESIGN/assets/` |
| `DIRECTOR_RULING_ABM007_FINAL_GATE_V_2026-11-23.md` | The Director's visual approval, given on the REVIEW_01 renders. Copy of the project document of the same name |
| `RECON/00_INDEX.md`, `RECON/ABM007_FINAL_PRE_RECON_REPORT.md`, `RECON/APPENDIX_A_COMMAND_EVIDENCE.txt` | The Engineer's pre-ABM recon. The author verified the two content files against the hashes in the index, and the recon ZIP against its `.sha256` file |

## Used but not bundled

| Source | Identity | Why not bundled |
|---|---|---|
| `ABM007_FINAL_PRE_RECON_2026-11-23.zip` | SHA-256 `2c90269888a1e1ba7b8789b1794af810933bb9785ef01ca2d0055d5099789524` | Its three members are bundled above |
| `PAYMENT_PORTAL_FFM_COMPONENTS.zip` (October Portal design package) | SHA-256 `be9668c92511471798c555f766bc5274d14fa8888b779977856a6da8d47d65d6`, 79,772,900 bytes | Size. Tooling and state reference only. The author read its README, decisions record, UI spec and component manifest in part, and viewed two renders |
| APBM-007B Gate Q certificate | Project document `LABS/APBM-007/QAM_CERTIFICATION_APBM-007B_2026-11-18.md` | Held in the project. Read in full for KR-1 to KR-6 |
| `ABM007_FINAL_ARCHITECT_REVIEW_01.zip` | SHA-256 `53102343a0e3b634351fe5c897d69db976afef52caf51c0349fee336ad734433` | Every member is bundled: the review and color evidence above, the five playbooks under `../QAM/GOVERNING/`, the logo under `../DESIGN/assets/` |
| `ABM007_FINAL_AUTHORING_REVIEW_01.zip` (the package the Architect reviewed) | SHA-256 `9f7d784489d798206a1d7ca9f2964eebf7f4eb931c4aad196f73c485f37cddf3`, 90 members | Superseded by this package; kept by the Director as the reviewed artifact |
| Seven QAM templates (set v0.3), TOKEN_FILE v1.3, THEMING_MANUAL v1.3 | Project documents | Held in the project. Read at REVIEW_01. This package no longer depends on the template set |
| Stripe customer-portal configuration documentation | docs.stripe.com, read 23 Nov 2026 | Public |

## Not available

See `REVIEW_START_HERE.md`, "What I did not have".
