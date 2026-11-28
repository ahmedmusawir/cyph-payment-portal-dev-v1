# Engineering closeout — ABM007_FINAL — start here

**Prepared by:** the Engineer, 28 November 2026, Asia/Dhaka.

**Engineering closeout prepared. Merge: not made, pending the Director. Gate Q: PASS WITH KNOWN RISK. Gate D: OPEN.
Module closure: pending Gate D.**

Records only. Every file here is new and inside `QAM/CLOSEOUT/`. No other file was changed in either repository.
Nothing is staged, committed, pushed, merged or deployed.

## Read in this order

| # | File | Purpose |
|---|---|---|
| 1 | `ENGINEERING_CLOSEOUT_REPORT.md` | The closeout record: scope delivered, Gate Q, cleanup, what is carried forward and who owns it, evidence paths |
| 2 | `BASELINE_AND_MANIFEST_EVIDENCE.md` | Repositories, commits, ancestry, working trees, and both match checks with exact commands and results |
| 3 | `GIT_HANDOFF_FOR_TONY.md` | The Director's copy-paste Git steps, per repository. Prepared, not executed |
| 4 | `DEPLOYMENT_RECONCILIATION_AND_FREEZE.md` | Targets, scripts against the snapshots, build identity, origins and callbacks, secret references, rollback, the freeze, outstanding checks |
| 5 | `HANDBACK_FOR_FRIDAY.md` | Short handback to the QA Lead with four requested rulings |

## Supporting files

| File or folder | Purpose |
|---|---|
| `commit/portal-qa-records-paths.txt` | The QA Executor's staging list, sorted: 8,401 paths for the QA records commit |
| `commit/portal-closeout-paths.txt` | The paths of this folder, for the closeout records commit |
| `commit/portal-left-untracked.txt` | 12 paths left untracked on purpose: 11 retained ZIP packages and one Python cache file |
| `commit/portal-qa-records-commit-msg.txt`, `portal-closeout-commit-msg.txt`, `portal-merge-msg.txt` | Proposed commit messages |
| `commit/owedbook-pr-body.md` | Proposed pull request description for OwedBook |
| `evidence/manifest_*_certified_*.stdout.json`, `*.stderr.txt` | Raw match-check output on the two certified commits |
| `evidence/deploy_sh_diff_*_crlf_normalised.txt` | Script-against-snapshot comparisons. Empty means no difference |
| `evidence/git_handoff_rehearsal.txt` | The Git steps rehearsed in throwaway clones, with the first failed attempt kept |
| `evidence/SOURCES.sha256` | Hashes of the supplied documents |
| `SOURCES/` | The supplied documents as received: the QA Lead's handoff, the certificate as issued, the release document of 26 November, the two `deploy.sh` snapshots |
| `SESSION_LOG_2026-11-28.md` | The session log for this assignment |
| `RESPONSE_2026-11-28_engineering-closeout.md` | The consolidated reply given to the Director |

## Three things to know first

1. **The Director's QA-record commit is not present yet.** The QA records are still uncommitted. The Git steps
   commit them first, from the QA Executor's own list.
2. **Three status records are deliberately stale:** `ABM_STATE.md`, `RECOVERY.md` and `CHANGELOG.md`. They are in the
   Gate Q manifests. A ruling is requested.
3. **The deployment inputs are not pinned.** Both services read their secrets at the alias `latest`.
