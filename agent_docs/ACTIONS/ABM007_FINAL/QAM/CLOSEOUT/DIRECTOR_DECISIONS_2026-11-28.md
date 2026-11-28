# Director's decisions on the closeout housekeeping questions — ABM007_FINAL

**Decided by:** the Director · **Received:** 28 November 2026, about 13:00 Asia/Dhaka, in the wrap-up instruction to
the Engineer · **Recorded by:** the Engineer

The four questions were raised in `HANDBACK_FOR_FRIDAY.md`. The Director decided all four. **All four are resolved.**

| # | Question | Decision | Status |
|---|---|---|---|
| 1 | Update `ABM_STATE.md`, `RECOVERY.md` and `CHANGELOG.md` now, or leave them? | **Leave them unchanged until module closure.** `QAM/CLOSEOUT/` carries the current status | Resolved. No file changed |
| 2 | Commit the 11 retained ZIP packages in `QAM/HANDOFFS/`? | **Keep them on disk, outside Git. Delete none** | Resolved. They are listed in `commit/portal-left-untracked.txt` and stay untracked |
| 3 | The untracked cache file `QAM/AUTOMATION/Q4_A2/__pycache__/reconcile.cpython-312.pyc` | **Remove only that file,** after verifying it is untracked. Preserve all source helpers and evidence | Resolved and done at 13:00. Details below |
| 4 | Where the resulting `main` commit IDs are recorded | **In the Gate D record,** with the match-check outputs. No commit ID may be invented | Resolved. Nothing to record yet: the merges have not been made |

## Decision 3, as carried out

| Step | Result |
|---|---|
| Tracked by Git? | No. `git ls-files --error-unmatch` failed for the path, and `git status` showed it as `??` |
| The file | 11,195 bytes, dated 27 November 11:42, SHA-256 `bc2add96ea97b16bdcb9e1286c55dcabac0960b0285ff6cf63b9b7730324b5c8` |
| Removed | That one file, and the `__pycache__` folder it left empty |
| Preserved | `QAM/AUTOMATION/Q4_A2/reconcile.py` and every other helper: 143 files under `QAM/AUTOMATION/` (144 before, the cache file being the difference). No evidence file was touched |

## Also instructed in the same message

- Recovery instructions that reset or force-move a branch are replaced by: "STOP, preserve the current state and
  output, and report to the Director." No automatic recovery. Applied in `GIT_HANDOFF_FOR_TONY.md`.
- The earlier export `ABM007_FINAL_ENGINEERING_CLOSEOUT_01.zip` is preserved. Export 02 replaces it for use.
