The final handoff preparation is done in both repos, and it is documentation only. Friday's QAM amendment is installed as ruling AM-17, the engineering record is corrected, and package 04 is built and copied to Downloads.

No product, config, test or asset file changed since package 03, so I didn't rerun tests. Nothing is staged, committed, pushed or branched, no dashboard or deployment was touched, and Q2 is not released. Both HEADs are unchanged (`c335671`, `b2e50fa`), `RECOVERY.md` is untouched, and the candidate SHAs stay PENDING until you commit.

## Friday's documents

Found in Downloads: her install instructions, `QAM_AMENDMENT_01.md` (the text to install), the regression recommendation (revision 3) and campaign journal v0.5.

**One file is missing:** the separate human-walkthrough amendment, revision 2, which journal Entry 004 names. Its installable content is `QAM_AMENDMENT_01.md`, which the install instructions say to install verbatim, and it covers every provision the Architect listed. I installed that. If revision 2 says something different, I didn't have it.

**Possible wording mismatch:** Friday wrote her instructions against journal v0.3. The later banking clarification (Entry 004) looks compatible with her sections 9 and 10. I didn't edit her text; Friday may want to confirm section 9.

## What was installed

- **The amendment:** `QAM/QAM_AMENDMENT_01.md`, byte-identical to Friday's copy (SHA-256 `72206961…770919`).
- **Pointer blocks:** appended to the end of ten QAM files. A check confirms each file is its original plus only the new block.
- **State log:** one row added to `QAM_STATE.md`. I left out the blank line before it, because a blank line would have pushed the row outside the log table; the instructions allow that kind of fit.
- **Ruling AM-17:** recorded in the amendments table.
- **Not filled:** every NOT RECORDED and PENDING field stays as written. No AR, HC, CR or REG-001 identifier was already in use.
- **Install report:** `EVIDENCE/QAM_AMENDMENT_01_INSTALL/INSTALL_REPORT.md`. It covers:
  - hashes before and after each change;
  - the pre-change passages Friday asked to see, quoted exactly;
  - places where her text overrides the installed QAM;
  - the full Git status of both repos.

## Engineering record corrections

- **Stops S-1 to S-3:** closed for Engineering. The external settings are prepared, not applied.
- **Redirect reproduction (AC-F02):** each attempt had 18 complete routes and 2 interrupted routes, not 40 clean journeys. The WebKit interruption (O-1) stays with independent QA, cause unproven.
- **Build-check history:** the three failed runs of the SCRATCH backend check are now recorded alongside the final passing result (`signed_final/SCRATCH_BUILD_INSTRUMENT_HISTORY.md`). The builds themselves never failed.
- **SCRATCH tooling for QA:** both prefix checks, and every other path and runtime constraint, are now documented in comment blocks in `auth.mjs` and `serve.mjs` (no code changed) and in the README. No reset, fixture creation, credential change or provider mutation is authorized.
- **Sign-in method on every engineering result:** each is now labelled fixture session or password sign-in. Neither counts as proof of real emailed sign-in, email delivery or handoff.

## Documentation diff and changed files

- **Exact diff:** `EVIDENCE/QAM_AMENDMENT_01_INSTALL/DOCUMENTATION_DIFF_since_package_03.diff`. It covers 26 files. The only removed lines are five updated fields in `ABM_STATE.md` and one corrected README sentence.
- **Changed-file list:** in `INSTALL_REPORT.md` section 6.
- **OwedBook:** only its session log and `CHANGELOG.md` changed.

## Updated handoff and state

- **Handoff:** section 13 of `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`.
- **State:** `ABM_STATE.md` still reads `ENGINEERING COMPLETE — AWAITING QA BRANCH`. The latest package is 04 and the product candidate is PENDING.
- **QA manifest:** the implementation identity stays PENDING in both repos. Q1 records the real SHAs from your receipt.

## Staging lists

| List | Paths |
|---|---|
| `EVIDENCE/E2/STAGING_LIST_owedbook.txt` | 95 |
| `EVIDENCE/E2/STAGING_LIST_portal.txt` | 366, including the 16 retired-spec deletions |
| `EVIDENCE/E2/STAGING_LIST_portal_optional.txt` | 10: the five review ZIPs and their checksums |

None of them contains `RECOVERY.md`, env files, `node_modules` or anything from `~/.apbm007b`.

## Commit messages and QA branch commands

All commands are in `EVIDENCE/E2/DIRECTOR_GIT_COMMANDS.md`. In each repo:
1. Compare `git status --short` with the list.
2. Stage with `git add --pathspec-from-file=<list>`.
3. Check `git diff --cached --name-status <baseline>`.
4. Commit.

- **OwedBook message:** `feat(abm007-final): Pharmacy Books brand, light only, Help page, store selector fix`, with a body.
- **Portal message:** `feat(abm007-final): Pharmacy Books brand, literal and panel layouts, notice wording; QAM amendment 01 and module records`, with a body.

After both commits, in each repo:
```
git branch qa/abm007-final HEAD && git rev-parse HEAD qa/abm007-final
```
That creates the QA branch without switching to it. When you choose to publish:
```
git push origin abm007-final qa/abm007-final
```
Then give Cody the two full SHAs and release Q1.

## Package

- **ZIP:** `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/ABM007_FINAL_E2_FINAL_HANDOFF_04.zip`
  - SHA-256 `c7ae85b9d6be0f60e508b981c2c2a7936139891e2036f10b10bc5c9e35996774`, 332 files plus the index.
  - The round diff against package 03 is empty for product files.
  - Copy in `~/Downloads/ABM007_FINAL_E2_FINAL_HANDOFF/`, byte-identical.
- **Left out:**
  - **Two old source documents** (the Architect handoff and the APBM-007B campaign journal), because they contain personal email addresses. They are still in the repo, from your commit `b2e50fa`.
  - **Screenshots:** unchanged, and still in package 03.
- **Scans:** no secret patterns, no private fixture strings, no personal addresses.

I'm available for any accepted repair once QA reports.
