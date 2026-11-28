# Proposed commit messages for RWO-01 with add-ons A1, A2 and A3 (prepared by Engineering, not executed)

Git authority is the Director's. Nothing is staged. Stage each repository from its list in this folder with `git add --pathspec-from-file=<list>`, then check `git diff --cached --name-status`.

The lists were regenerated on 27 November from `git status`. Together they name every uncommitted path outside `QAM/` in both repositories, including the session logs and changelog entries of 26 and 27 November.

| List | Paths | Holds |
|---|---|---|
| `STAGING_LIST_owedbook.txt` | 23 | every uncommitted OwedBook path |
| `STAGING_LIST_portal.txt` | 315 | every uncommitted Account & Billing path outside `QAM/`, except the return ZIPs |
| `STAGING_LIST_portal_optional.txt` | 8 | the four return ZIP copies and their checksums |

Nothing under `agent_docs/ACTIONS/ABM007_FINAL/QAM/` is in any list.

## OwedBook (`STAGING_LIST_owedbook.txt`)

```
git commit -m "fix(abm007-final): RWO-01 repairs R-01 to R-07 with add-ons A1, A2 and A3" -m "R-01 opening page: Subscribe Now to Account & Billing in the body, header and phone menu; navy Log in (AM-18, AM-22). R-02 Help: Go to the Top at the end of each of the 13 articles, inside the article, at every width (AM-23, replacing AM-19 and AM-22 part 2), with the Help heading as its real, focusable target so the page stays at the top and focus moves there (A3); the contents menu scrolls inside itself when taller than the window and keeps a focused link clear of its edge. R-03 Login: Logging in… with aria-busy. R-04 disabled fields use the disabled tokens, no fade. R-05 Profile support link in the link style. R-06 44px password toggle, dashboard tabs and account button. R-07 no sideways overflow at 320 on the dashboard and Billing & subscription. Tests added for each. Reports and evidence are in the Portal repository, EVIDENCE/RWO01."
```

## Account & Billing (`STAGING_LIST_portal.txt`; optionally `STAGING_LIST_portal_optional.txt`)

```
git commit -m "fix(abm007-final): RWO-01 repairs R-04, R-08, R-09 with add-ons A1 to A3; rulings AM-18 to AM-23 and evidence" -m "R-08 signed-out header: Sign in stays on one line at 768; footer links stack centered below 1024 on signed-out and signed-in pages (A1-4). R-09 44px password toggle and pharmacy-row buttons; Refresh ruled a link and left unchanged. R-04 shared input uses the disabled tokens, no fade. Tests added. Add-ons A2 and A3 change no product file here. Records: ABM_RULINGS AM-18 to AM-23, CHANGED_LABELS, EVIDENCE/RWO01 reports, measurements, logs and diffs for returns 01 to 04; session logs of 26 and 27 Nov, RECOVERY block and ABM_STATE refresh of 26 Nov (AM-22 (3))."
```
