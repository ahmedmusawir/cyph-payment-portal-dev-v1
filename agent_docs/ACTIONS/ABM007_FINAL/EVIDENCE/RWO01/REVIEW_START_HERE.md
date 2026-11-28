# ABM007_FINAL RWO-01 engineering return 04 (add-on A3)

Status: `RWO-01 ADD-ON A3 COMPLETE — AWAITING QA CONFIRMATION`. Engineering claims for QA to test, not results.

Read in this order:
1. `RWO01_A3_ENGINEERING_REPORT.md`: the cause, the change, before-and-after scroll positions over time, focus afterwards, checks and sessions.
2. `CHANGED_FILES.md`: every changed file for the whole of RWO-01, all three add-ons included.
3. `diff/addon_A3_only.diff`: only what this add-on changed in product and test files. `diff/owedbook_full.diff` and `diff/portal_full.diff` are the full working-tree diffs against the candidate commits. `diff/return03/`, `diff/return02/` and `diff/return01/` keep the earlier returns' diffs.
4. `measure/a3/`: the running-app measurements, one file per step.
   - `04_before_all.json` and `06_after_all.json`: the grid for articles 1, 7 and 13 in Firefox, Chrome and WebKit.
   - `05_before_firefox_reps.json` and `07_after_firefox_reps.json`: Firefox repeats and the Tab path that failed.
   - `09_after_all13_firefox.json`: all 13 links in Firefox, and the heading that receives focus.
   - `01` to `03`: the first Firefox runs while I looked for the trigger. `08_after_all13.json` is the step that failed on my own fault; it holds no results.
   - `A3_heading_focus_after_keyboard_firefox_*.png`: the heading with its focus outline.
5. `measure/a3_static/`: the same sequences on a file copy of the Help page with no scripts and no server, before and with the candidate change. This is the proof that the app's scripts are not the cause.
6. `measure/measure_a2_after_a3.json` and `measure/shots_a2_after_a3/`: the A2 design measured again on the A3 build.
7. `tools/driver_a3.mjs`, `tools/lib_a3.mjs`, `tools/a3_steps/`, `tools/a3_static/`: the tools, with how they work written at the top of each.
8. `logs_a3/` and `binding_a3/`: checks and the hash binding of the copies they ran on.
9. `STAGING_LIST_*.txt` and `COMMIT_MESSAGES.md`: for the Director's commit, regenerated.
10. `NOTICED_NOT_FIXED.md`: section "Add-on A3" at the end.
11. `records/`: `ABM_RULINGS.md` (AM-18 to AM-23, unchanged by A3), `CHANGED_LABELS.md` (unchanged by A3), the session logs of 26 and 27 November for both repositories.
12. Earlier reports, unchanged: `RWO01_A2_ENGINEERING_REPORT.md`, `RWO01_A1_ENGINEERING_REPORT.md`, `RWO01_ENGINEERING_REPORT.md`, `FREE_TRIAL_LIST.md`.

`FILE_INDEX.json` lists every member except itself, with size and SHA-256.
