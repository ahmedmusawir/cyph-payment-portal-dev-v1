# Handback to the QA Lead — ABM007_FINAL engineering closeout

**From:** the Engineer · **To:** the QA Lead · **Copied:** the Director, the Architect
**Date:** 28 November 2026, Asia/Dhaka

Engineering closeout is prepared. Nothing is committed or merged yet; the Director's steps are ready.

**Update, 28 November 13:00:** the four housekeeping questions below are **resolved by the Director**
(`DIRECTOR_DECISIONS_2026-11-28.md`). No ruling is requested from you now. Still yours: any match-check difference,
and the revised Gate D plan.

## What I found

| Item | Result |
|---|---|
| Match check, OwedBook `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | Exit 0, manifest `38ebe196…`, 2,314 files, mismatches none |
| Match check, Account & Billing `5b8e935a58105897d53b7e4caeb3916bbfb99e23` | Exit 0, manifest `bb27c2ee…`, 2,557 files, mismatches none |
| The Director's QA-record commit | Not present at 12:09. **Present since 13:00:** `f4dd32982df047b63aa6f0ad9119546f06058024`, exactly the QA Executor's 8,401 paths, all inside `QAM/`. Closeout records `4eee35c4e0ee1196744360d664c1ed3edc0d8afd`. Match check on it, run by the Director: mismatches none |
| My closeout records | All new, all inside `QAM/CLOSEOUT/`. No file outside `QAM/` was touched in either repository |
| Record-only differences to rule on | **None so far.** None expected on the resulting `main` commits; the real output will come from the Director's run |
| The two `deploy.sh` scripts against the supplied snapshots | The same, apart from Windows line endings in the snapshots |
| "OwedBook beta" | No beta target exists in either repository. Both targets are alpha |

## Housekeeping questions — all four RESOLVED by the Director, 28 November

| # | Decision |
|---|---|
| 1 | Leave `ABM_STATE.md`, `RECOVERY.md` and `CHANGELOG.md` unchanged until module closure. `QAM/CLOSEOUT/` carries the current status |
| 2 | Keep the 11 retained ZIP packages on disk, outside Git. Delete none |
| 3 | Remove the one cache file. Done by the Engineer at 13:00, after verifying it was untracked |
| 4 | The eventual `main` merge commit IDs and match-check outputs go into the Gate D record. None may be invented |

The questions as first asked, kept for the record:

1. **Status records left stale.** `ABM_STATE.md`, `RECOVERY.md` and `CHANGELOG.md` still describe 26 and 27
   November. They are in the manifests, so I did not update them, and this repository's own rules normally require
   those updates. The current status is in `QAM/CLOSEOUT/ENGINEERING_CLOSEOUT_REPORT.md`. Please rule: leave them
   until module closure after Gate D (my recommendation), or update them now and accept the record-only differences.
2. **The 11 retained ZIP packages** in `QAM/HANDOFFS/` (87 MB) are not in the QA Executor's staging list, so the
   Director's steps leave them untracked on disk. Commit them, or keep them local only? Either way nothing is deleted.
3. **One Python cache file**, `QAM/AUTOMATION/Q4_A2/__pycache__/reconcile.cpython-312.pyc`, dated 27 November 11:42,
   is untracked and not in the staging list. It is a by-product, not evidence. I left it alone because nothing in
   `QAM/` is mine to remove. Please say whether the QA Executor should remove it.
4. **Where the resulting `main` commit IDs are recorded.** They will exist after the Director's merge, and `main` is
   then frozen. I propose the Gate D record carries them, with the match-check output. Please confirm, or name
   another place.

## One note on the match-check helper

`QAM/AUTOMATION/Q4/manifest.py`, line 12, has the Account & Billing path of this machine written into it. The check
works only here, with both repositories at their present paths. I changed nothing. It matters for REG-001 if the
helper is reused.

## For the Gate D plan

From `DEPLOYMENT_RECONCILIATION_AND_FREEZE.md`:

- **Secrets are not pinned.** Both services read every secret at the alias `latest`. Version 1 is recorded for all
  eight on 20 and 21 November; what `latest` resolves to today is unverified. A metadata check before and after the
  deploy is listed.
- **OwedBook's script has no secret-presence check.** A manual check is listed.
- **No rollback procedure is written down.** The facts needed to write one are in section 6 of that record, with the
  previous-revision evidence to capture before the deploy.
- **The deployed revision will be the merge commit on `main`,** not the certified commit. The match check on the
  merge commit is the link.
- **Applying the branded email template and Stripe branding** changes DEV configuration inside the freeze. It needs
  to be named in the approved plan.
- The Supabase DEV redirect allow-list for both alpha addresses was recorded as not done on 21 November. Unverified
  today.

## What comes back to you next

After the Director runs the steps: the contents of `/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS/`, which
hold both `main` commit IDs and the match-check output for each.
