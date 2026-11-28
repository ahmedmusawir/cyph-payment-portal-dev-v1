# Engineering closeout — ABM007_FINAL — start here

**Prepared by:** the Engineer, 28 November 2026, Asia/Dhaka. **Revision 02, 13:00.**

**Engineering closeout prepared. Merge: not made, pending the Director. Gate Q: PASS WITH KNOWN RISK. Gate D: OPEN.
Module closure: pending Gate D.**

Records only. Every file here is inside `QAM/CLOSEOUT/`. No other file was changed in either repository by
Engineering. Engineering staged, committed, pushed, merged and deployed nothing.

## Read in this order

| # | File | Purpose |
|---|---|---|
| 1 | `ENGINEERING_CLOSEOUT_REPORT.md` | The closeout record: scope delivered, Gate Q, cleanup, what is carried forward and who owns it, evidence paths |
| 2 | `BASELINE_AND_MANIFEST_EVIDENCE.md` | Repositories, commits, ancestry, working trees, and both match checks with exact commands and results |
| 3 | `GIT_HANDOFF_FOR_TONY.md` | The Director's copy-paste Git steps, per repository. Prepared, not executed |
| 4 | `DEPLOYMENT_RECONCILIATION_AND_FREEZE.md` | Targets, scripts against the snapshots, build identity, origins and callbacks, secret references, rollback, the freeze, outstanding checks |
| 5 | `HANDBACK_FOR_FRIDAY.md` | Short handback to the QA Lead. Its four housekeeping questions are resolved |
| 6 | `DIRECTOR_DECISIONS_2026-11-28.md` | The Director's four decisions, and how decision 3 was carried out |
| 7 | `RESUME_NOTE.md` | Durable pointer: current state, remaining Director steps, deployment prerequisites, evidence locations |

## Supporting files

| File or folder | Purpose |
|---|---|
| `commit/portal-qa-records-paths.txt` | The QA Executor's staging list, sorted: 8,401 paths for the QA records commit |
| `commit/portal-closeout-paths.txt` | The 28 paths of the closeout records commit `4eee35c…` (done) |
| `commit/portal-closeout-02-paths.txt`, `portal-closeout-02-commit-msg.txt` | Paths and proposed message for the wrap-up records commit (step 1b) |
| `evidence/director_records_commit_output_2026-11-28.txt` | The Director's terminal output for the records commits, as supplied |
| `commit/portal-left-untracked.txt` | 11 paths left untracked on purpose: the retained ZIP packages |
| `commit/portal-qa-records-commit-msg.txt`, `portal-closeout-commit-msg.txt`, `portal-merge-msg.txt` | Proposed commit messages |
| `commit/owedbook-pr-body.md` | Proposed pull request description for OwedBook |
| `evidence/manifest_*_certified_*.stdout.json`, `*.stderr.txt` | Raw match-check output on the two certified commits |
| `evidence/deploy_sh_diff_*_crlf_normalised.txt` | Script-against-snapshot comparisons. Empty means no difference |
| `evidence/git_handoff_rehearsal.txt` | The Git steps rehearsed in throwaway clones, with the first failed attempt kept (revision 01) |
| `evidence/git_handoff_rehearsal_02.txt` | The rehearsal repeated on the revision 02 steps and lists |
| `evidence/manifest_*_rerun_1300.stdout.json` | Match checks repeated at 13:00 |
| `evidence/SOURCES.sha256` | Hashes of the supplied documents |
| `SOURCES/` | The supplied documents as received: the QA Lead's handoff, the certificate as issued, the release document of 26 November, the two `deploy.sh` snapshots |
| `SESSION_LOG_2026-11-28.md` | The session log for this assignment |
| `RESPONSE_2026-11-28_engineering-closeout.md`, `RESPONSE_2026-11-28_closeout-wrap-up.md` | The two replies given to the Director |

## Three things to know first

1. **The Director committed and pushed the QA records and the closeout records at 13:00** (`f4dd329…`, `4eee35c…`).
   The wrap-up records made after that are uncommitted; step 1b of the Git handoff commits them. No merge yet.
2. **Three status records are deliberately stale:** `ABM_STATE.md`, `RECOVERY.md` and `CHANGELOG.md`. The Director
   decided they stay unchanged until module closure. `RESUME_NOTE.md` is the current pointer.
3. **The deployment inputs are not pinned.** Both services read their secrets at the alias `latest`.
