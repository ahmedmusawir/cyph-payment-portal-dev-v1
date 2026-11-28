# Session log, 28 November 2026 — ABM007_FINAL engineering closeout

**Seat:** the Engineer (Claudy) · **Tool:** Claude Code · **Time zone:** Asia/Dhaka

This log stands in for the root `session_2026-11-28.md` for this assignment. Reason: the Gate Q manifests list every
file outside `QAM/`, so a new root session file, a `CHANGELOG.md` entry, a `RECOVERY.md` update or a new file in
`agent_docs/RESPONSES/` would each show as a difference in the match check. The work order says to prefer new records
under `QAM/`. Nothing outside `QAM/CLOSEOUT/` was written in either repository.

## Starting state

- Both repositories on `qa/abm007-final`, HEAD equal to `origin/qa/abm007-final`.
- OwedBook `025c578f7ab0879bede38384c8a2ad63de8ba3c4`, working tree clean.
- Account & Billing `5b8e935a58105897d53b7e4caeb3916bbfb99e23`, 86 status lines (8,413 files), all inside `QAM/`.

## Progress

### 12:09 — APPROVED → IN PROGRESS
**Task:** engineering closeout, records only (work order "CLAUDY — ABM007_FINAL ENGINEERING CLOSEOUT").
**Plan:** baseline → both match checks → closeout report → deployment reconciliation and freeze → Git handoff for
the Director → handback for the QA Lead → one package. All new files under `QAM/CLOSEOUT/`. No staging, commit, push,
merge, branch switch, deploy or cloud call.
**Approval:** the work order is the release; it says to continue autonomously through records-only work.

### Findings while working
- The Director's QA-record commit is **not present**. The QA records are still uncommitted in Account & Billing.
- Both match checks pass on the certified commits: zero mismatches, expected manifest hashes.
- Both `deploy.sh` files equal the supplied snapshots once the snapshots' Windows line endings are removed.
- Deployment configuration files do not differ between `origin/main` and the QA branch in either repository.
- OwedBook `main` is protected on GitHub (pull request route). Account & Billing `main` is not.
- 12 untracked paths in `QAM/` are not in the QA Executor's staging list: 11 retained ZIP packages and one Python
  cache file. Left alone; a ruling is requested.
- No rollback procedure is written down for the two alpha services.

### COMPLETE
**Files created:** see `REVIEW_START_HERE.md` in this folder.
**Checks:** the two match checks; a rehearsal of the Git blocks in throwaway clones (results in
`evidence/git_handoff_rehearsal.txt`). No product QA was repeated.
**Not done, by design:** `ABM_STATE.md`, `RECOVERY.md` and `CHANGELOG.md` were not updated (they are in the manifests).

### 13:00 — Wrap-up on the Director's instruction: COMPLETE
**Git state inspected first:** unchanged since 12:09. The Director has run no step.
**Director's decisions recorded:** `DIRECTOR_DECISIONS_2026-11-28.md` (four housekeeping questions, all resolved).
**Done:** removed the one untracked cache file (verified untracked first); left-untracked list is now the 11 ZIP
packages; recovery instructions in `GIT_HANDOFF_FOR_TONY.md` replaced by the stop rule; `RESUME_NOTE.md` written;
match checks rerun; Git steps rehearsed again; export 02 built with the QA paths list included. Export 01 preserved.

### 13:02 — State changed during the wrap-up
The Director committed and pushed the records at 13:00:45 and 13:00:53 (`f4dd329…`, `4eee35c…`) with his own
commands. Verified by reading the commits. My wrap-up edits landed after that commit and are uncommitted. One read-only
check of mine was declined by the Director, who supplied his own match-check output instead; I did not rerun it.
Instructions refitted: section 1 marked done, new section 1b for the wrap-up records.

## End of session state
- **Working:** records committed and pushed by the Director up to `4eee35c…`; wrap-up records uncommitted; no merge.
- **Waiting:** the Director's Git steps. The four housekeeping questions are resolved by the Director.
- **Next:** Gate D plan approval, redeploy to alpha on release, Gate D on 3 December.
