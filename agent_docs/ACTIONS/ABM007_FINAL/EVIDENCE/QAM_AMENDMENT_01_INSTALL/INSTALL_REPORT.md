# QAM Amendment 01: install report (QA Lead install instructions, section 4)

**Date:** 24 November 2026, Asia/Dhaka. **By:** Engineer (Claudy), documentation only.
**Authority:** Architect review of package 03 relayed by the Director ("Install the approved QAM provisions"); campaign journal v0.5 Entries 004 and 005; ruling **AM-17**.
No product file, test, dependency, database, dashboard or deployment was touched. No QA result, approval, plan, finding or certificate field was filled. Every "NOT RECORDED" and "PENDING" stays as written. No test was run. Git untouched.

## 0. Sources read and reconciled

| Source (Downloads, 24 Nov) | SHA-256 | Copy |
|---|---|---|
| `QA_LEAD_QAM_AMENDMENT_INSTALL_INSTRUCTIONS_ABM007_FINAL_2026-11-24.md` (Friday's latest amendment instructions) | `29401c13bc99f16a005a79e98e67b6abf011841a5a8f1c54435ce4e961d60646` | `sources/` |
| `QAM_AMENDMENT_01.md` (the installable amendment text) | `72206961eb6dc3d5b11abb2f9cd2051526920e1279885c6cae5289d3bf770919` | `sources/`, installed as `QAM/QAM_AMENDMENT_01.md` |
| `QA_LEAD_REGRESSION_STRATEGY_RECOMMENDATION_2026-11-24.md` (revision 3) | `b2222fa17cfb43d85b0ac39043aa72efdc4e9f674e0a1d3dc5bf45ad4b8432ae` | `sources/` (read; not installed: a recommendation, adopted by the Director as DC-002 with the banking clarification, Entry 005) |
| `CYPH_ABM007_FINAL_CAMPAIGN_JOURNAL.md` (Version 0.5) | `377186b4405f7b9036aac6183d6b5606adb6d10bdee4e14e1b502aa0535996e0` | `sources/` |

**Reconciliation notes (for the QA Lead and the Architect):**
1. **Missing as a separate file:** the "revised human-walkthrough amendment" that journal Entry 004 names (`QA_LEAD_AMENDMENT_ABM007_FINAL_HUMAN_WALKTHROUGH_2026-11-24 (1).md`, revision 2) is not present in Downloads or its archive. Its installable content is `QAM_AMENDMENT_01.md`, which the install instructions name as "the text to install, verbatim", and which carries every provision the Architect listed. I installed that file. If revision 2 differs from it, the difference was not available to me.
2. The install instructions were written against journal v0.3 ("I hold v0.3 ... If v0.4 says more, send it and I will correct section 9"). Journal v0.5 Entry 004's banking clarification has two points:
   - It retains certified checkpoints without a separate assignment after every Gate Q, with normal engineering adding maintainable tests.
   - Promoting a QA-only helper is a bounded engineering change.

   This reads as **compatible** with amendment sections 9 and 10 (section 9.5 routes the first maintained pack through REG-001; section 10 makes upkeep normal module engineering afterwards). I did not edit Friday's text. The QA Lead may wish to confirm section 9 wording.
3. The instructions' status line reads "for Architect review. Not released." Journal Entry 005 and the Architect's review of package 03 (relayed by the Director) are the release for this install.
4. REG-001 is not built. No product or test scope was added. Central Factory doctrine synchronization (DC-001, DC-002) stays a separately tracked action.

## 1. Files: found, SHA-256 before and after, change is only the appended block

| File | Found | SHA-256 before | SHA-256 after | Only the appended block |
|---|---|---|---|---|
| `QAM/QAM_ENTRY.md` | found | `20cf5e4ecd6f0d97fb0f10faa73255e1dca9ef8036fc343b587d0b66d8e3f569` | `f038cc9ea8eadf1a09f488dd57251633159832871e527934044c38312b07acb5` | yes |
| `QAM/QAM_RISK_REQUIREMENTS.md` | found | `06c25ca89f8f4545444894ce5cb2c7fca0dd3b6f3279cc29df10d159b60d8c94` | `67cfc9a8df89e18bd7a89b06e9033a17d86efc4546e8c955ddddc5de4e044526` | yes |
| `QAM/QAM_RECON_REPORT.md` | found | `b864866043a5fcfac9c14bb24041518aa28f6f2f09dc53f647728cd824ebced2` | `0d9aa455a5a340cf445e218a0b7dee66eaaf194625a39e449d271b17c171204d` | yes |
| `QAM/QAM_TEST_PLAN.md` | found | `e15d93167fede6a989db4e90c69b99c9b868a7f9e4f9c133d9f6b9a86e7d0817` | `2f66a0ad213c324242a94a1e20bbe67685ea0b2946183e5baba7c30dba29079d` | yes |
| `QAM/QAM_APPROVAL.md` | found | `0fdacf2657c4b563357776208d6d3db1cc47df56be2fd932c8bd70c6e3d499c5` | `18acc00f03865059ffe2a4629556996ce7bce210184d1184c953262cb06412ac` | yes |
| `QAM/QAM_EXECUTION_REPORT.md` | found | `9d4f64c8146eb261f885adb0315d717a1cbd9f77cf36e384b8cea70189c0b971` | `8e0675b5648d70228f7b8f696bf03f662a2c0ed16ca0295917c032b7fba0763f` | yes |
| `QAM/AC_EVIDENCE_MATRIX.md` | found | `dde198f455082ddb91cd401d60bb87074814ac0bffc803b35288946b85ad5c2b` | `504a0effe1adc4a9a07ceabc5207c916fb50aac5434f0317e798c11ab5469391` | yes |
| `QAM/FINDINGS.md` | found | `676adef75fe9b521cd5decf3da1309f705b1c6407afa0b4b911690e477272112` | `ab5659caca8266c62fb9466070b658ac1107e5c2c3e561eb117c5940e780caa5` | yes |
| `QAM/QAM_CLEANUP_REPORT.md` | found | `4f8e7a0c9dafaeca9e8e4c73cdbb2621a60f5dee5057e8febfdfbde200c9b300` | `50aac0f1683415fe2f3a80bcd976633218967c18eac8264d669661623cade8d0` | yes |
| `QAM/QAM_CERTIFICATION.md` | found | `a31788e7c2ddfa3f93998cb9aa29a12553e5cb89d0e608a606e1e62a54bf049a` | `ef48e20089c4f5eacff9e04a82c60211e5fa1eb6cbae6d293369ec661f51d3e1` | yes |
| `QAM/QAM_STATE.md` | found | `3a0c963f8f7f4e5f00d045739bfa6fe1b7082897961cd6dd9f177d9b7ddf9866` | `8972f0cfaa7ae4bd29fb5146cc72fc97e68406731faeb39f543c8733ea29c860` | yes |
| `ABM_RULINGS.md` | found | `1b0e0e1d6a62c01ffcdbfcb24e27ffa3271b392677c53eb87c20b402dd429575` | `d8e1cb03e8aaddab44923de7c9f0b92ec66562a1b42bddde1f6b9b652c5584a4` | see note |
| `ABM_JOURNAL.md` | found | `d554f6ef018a0a811d66e266c017a022f73577f6c0c4b5a5ff16d648bbd183a4` | `66cef20dd92ce8d4e100f11b638c819ca390f57fd3f9dd7b9571c0b6821ca7d7` | see note |
| `ABM_STATE.md` | found | `71c1b323c9ed6f17f62c2c511e4e2f20b5d0e6724723b98a2baf6bd0cbcde987` | `abe480670a3c74f0d7d61aa3baf1a512cc57424eda757fbc33ac7d62aa591994` | see note |
| `QAM/QAM_AMENDMENT_01.md` | new | — | `72206961eb6dc3d5b11abb2f9cd2051526920e1279885c6cae5289d3bf770919` | new file, byte-identical to the supplied copy |

Notes on the last rows:
- `ABM_RULINGS.md`: exactly one line added, the AM-17 row, placed directly after AM-16 in the amendments table (section 3 of that file) so it stays in the table; nothing removed.
- `ABM_JOURNAL.md` and `ABM_STATE.md`: one appended row each. In `ABM_STATE.md` some index fields were updated: as-of, latest package, product candidate (still PENDING), next owner. Module state is unchanged.
- The "after" hashes of these three record files and `QAM/QAM_MANIFEST.md` reflect later engineering appends in this same round. See section 6.

Exact appended text: `QA_LEAD_..._INSTALL_INSTRUCTIONS` section 3, lines beginning `>`, with the marker removed, each after one blank line.

**One fit, as section 3.11 permits ("If the installed log has different columns, the Engineer fits the same content to them and says so"):** the `QAM_STATE.md` row was appended **without** the blank line. The file ends with the transition-log table, and a blank line would have left the row outside the table. The columns match (five), and the row's text is unchanged.

## 2. Installed amendment SHA-256

`QAM/QAM_AMENDMENT_01.md` = `72206961eb6dc3d5b11abb2f9cd2051526920e1279885c6cae5289d3bf770919`, equal to the supplied copy.

## 3. Installed passages quoted before the change

`INSTALLED_PASSAGES_BEFORE.md`. Extracted mechanically from the pre-change copies in `before/`; hashes in `before_and_sources.sha256`. Covers:
- `QAM_ENTRY.md`: target and prerequisites table, and the standing rules list;
- `QAM_TEST_PLAN.md` section 11, human checks;
- `QAM_EXECUTION_REPORT.md` section 7, human checks;
- `QAM_RISK_REQUIREMENTS.md`: 27 requirement IDs (SR-1 to SR-11, MR-1 to MR-16) and the permitted-effects table;
- `QAM_CLEANUP_REPORT.md`: the retention table;
- `ABM_RULINGS.md`: amendment numbers AM-01 to AM-16; AM-17 used.

**Overlaps for the QA Lead's comparison.** Pointers only; I made no judgment edits.
- **`QAM_ENTRY.md` rule 5 ("Director interventions are grouped ... the QA Lead walks the Director"):** the amendment, section 1.3, has the Architect guide and the QA Lead select, approve and adjudicate without performing. The amendment governs by its section 0.1.
- **`QAM_TEST_PLAN.md` section 11 and `QAM_EXECUTION_REPORT.md` section 7 (human-check tables):** the appended tables state that they replace these.
- **`QAM_ENTRY.md` rules 1 to 3 (Q2 runs to completion, no repair during Q2, housekeeping does not stop the run):** consistent with amendment sections 2.3 and 3.
- **`QAM_RISK_REQUIREMENTS.md` permitted effects (PROPOSED P-19):** unchanged. The amendment changes no envelope (section 0.2).
- **`QAM_CLEANUP_REPORT.md` retention table:** the appended keep-list adds to it; nothing is removed.
- **Identifier collisions:** none (AR-n, HC-nn, CR-nn and REG-001 were not used in the installed pack).

## 4. Files that differ in name, place or structure

None of the eleven named QAM files differs in name or place. The only structural fit is the `QAM_STATE.md` row (section 1). The OwedBook pointer folder (`cyph-v1-dev/agent_docs/ACTIONS/ABM007_FINAL/README.md`) mirrors none of these files and was left alone.

## 5. Git status and change listing

Complete status of both repositories at report time: `git_status_cyph-payment-portal-dev-v1.txt`, `git_status_cyph-v1-dev.txt`. Nothing is staged and both HEADs are unchanged.

## 6. Files changed in this round (after review package 03)

All are documentation or records. Product, config, test and asset files are byte-identical to package 03: OwedBook 91 paths; Portal 51 paths plus the same 16 deletions.

- **QAM (this install):** `QAM/QAM_AMENDMENT_01.md` (new); appended blocks in `QAM_ENTRY`, `QAM_RISK_REQUIREMENTS`, `QAM_RECON_REPORT`, `QAM_TEST_PLAN`, `QAM_APPROVAL`, `QAM_EXECUTION_REPORT`, `AC_EVIDENCE_MATRIX`, `FINDINGS`, `QAM_CLEANUP_REPORT`, `QAM_CERTIFICATION`; one `QAM_STATE` log row.
- **Module records:** `ABM_RULINGS.md` (AM-17), `ABM_JOURNAL.md`, `ABM_STATE.md`, `ABM_ACCEPTANCE_LEDGER.md` (correction), `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` (section 13), `QAM/QAM_MANIFEST.md` (note).
- **Evidence:**
  - `EVIDENCE/E2/VERIFICATION.md` (section 7);
  - new `EVIDENCE/E2/DIRECTOR_GIT_COMMANDS.md` and `EVIDENCE/E2/signed_final/SCRATCH_BUILD_INSTRUMENT_HISTORY.md`;
  - refreshed `INVENTORY_*.txt`, `*_changes_vs_baseline.txt` and `STAGING_LIST_*.txt`;
  - this folder (`INSTALL_REPORT.md`, `INSTALLED_PASSAGES_BEFORE.md`, `before/`, `sources/`, `before_and_sources.sha256`, `git_status_*.txt`).
- **Tooling, comments and README only:** `EVIDENCE/E2/tools/scratch_proof/auth.mjs` and `serve.mjs` (constraint comment blocks; 0 code lines changed), `README.md`.
- **Repository records:**
  - Portal: `session_2026-11-24.md`, `CHANGELOG.md`, `agent_docs/RESPONSES/response_2026-11-24_154349_abm007-final-handoff-prep.md`.
  - OwedBook: `agent_docs/SESSIONS/session_2026-11-24.md`, `CHANGELOG.md`.
- **Not this round** (written when package 03 was finalized): `EVIDENCE/ABM007_FINAL_E2_COMPLETION_REVIEW_03.zip.sha256`, `agent_docs/RESPONSES/response_2026-11-24_151315_abm007-final-e2-complete.md`.

## 7. Git reminder for the Director

`../E2/DIRECTOR_GIT_COMMANDS.md`: exact staging lists, one command per block, proposed commit messages, and the commands that create `qa/abm007-final` at the new commits. Prepared, not executed.
