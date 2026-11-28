# Resume note — ABM007_FINAL after engineering closeout

**Written:** 28 November 2026, 13:10 Asia/Dhaka, by the Engineer, for whoever picks this up next.
Root `RECOVERY.md` and `ABM_STATE.md` are deliberately not updated until module closure (Director's decision 1).
**This note is the current pointer.**

## Where things stand

**Gate Q: PASS WITH KNOWN RISK. Gate D: OPEN. Module closure: pending Gate D.** The Engineer's records-only
assignment is complete. The Director has committed and pushed the QA records and the closeout records. Nothing is
merged or deployed.

| | OwedBook | Account & Billing |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` |
| Branch | `qa/abm007-final` | `qa/abm007-final` |
| Certified commit | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` |
| HEAD = remote branch | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | `4eee35c4e0ee1196744360d664c1ed3edc0d8afd` (QA records `f4dd32982df047b63aa6f0ad9119546f06058024`, then closeout records) |
| `main` = `origin/main` | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Uncommitted | Nothing | The wrap-up records in `QAM/CLOSEOUT/` (`commit/portal-closeout-02-paths.txt`), and 11 retained ZIP packages that stay outside Git |

If the state you find differs from this table, someone has run steps since. Inspect before acting; do not assume.

## Remaining steps for the Director

All in `GIT_HANDOFF_FOR_TONY.md`. On any stop: STOP, preserve the current state and output, and report to the
Director. No automatic recovery.

| Step | What | Done? |
|---|---|---|
| 0 | Read-only check that no Cloud Build trigger watches `main` | No |
| 1 | Account & Billing: commit the QA records, commit the closeout records, match check, push `qa/abm007-final` | **Yes**, by the Director, 13:00. Match check: mismatches none |
| 1b | Account & Billing: commit and push the wrap-up records | No |
| 2 | Account & Billing: `--no-ff` merge into `main`, match check on the merge commit, push `main` | No |
| 3a | OwedBook: pre-check | No |
| 3b | OwedBook: pull request, "Create a merge commit" | No |
| 3c | OwedBook: verify the merge commit and run the match check on it | No |
| 4 | Send `/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS/` to the QA Lead; the `main` commit IDs and outputs go into the Gate D record | No |

No `main` merge commit ID exists yet. None is written anywhere.

## Known deployment prerequisites

From `DEPLOYMENT_RECONCILIATION_AND_FREEZE.md`, section 8. None has been checked; no cloud call was made.

1. The Gate D plan, revised for ruling AM-21, approved by the Director.
2. Both merges done and both match checks on the `main` commits passed.
3. Previous-revision evidence for both alpha services: serving revision, image digest, `source-revision` label,
   `/api/build-info`. There is no written rollback procedure; this evidence is what a rollback would need.
4. Secret versions: both services read every secret at the alias `latest`, so nothing is pinned. List the versions
   (metadata only) before and after the deploy. Version 1 was recorded for all eight on 20 and 21 November.
5. The OwedBook script has no secret-presence check: confirm by hand that its secret has an enabled version.
6. Supabase DEV Auth: Site URL and redirect allow-list admit both alpha addresses; the branded email template.
7. Stripe sandbox: the webhook endpoint `cyph-v1-payment-alpha` is enabled; price and billing-page configuration exist.
8. One consumer: no local `stripe listen`, job runner or app pointed at DEV during Gate D.
9. Deploy from a clean checkout of `main` at the merge commit, on the Director's release only. The deployed revision
   will show the merge commit ID, not the certified one.

Freeze until Gate D passes: `main` in both repositories, the DEV database, and the deployment inputs. The authorized
Gate D journeys are the one exception.

## Where the evidence is

All in Account & Billing under `agent_docs/ACTIONS/ABM007_FINAL/`.

| What | Where |
|---|---|
| This closeout, start here | `QAM/CLOSEOUT/REVIEW_START_HERE.md` |
| Closeout record with carried-forward items and owners | `QAM/CLOSEOUT/ENGINEERING_CLOSEOUT_REPORT.md` |
| Director's decisions of 28 November | `QAM/CLOSEOUT/DIRECTOR_DECISIONS_2026-11-28.md` |
| Match-check helper and manifests | `QAM/AUTOMATION/Q4_A3/manifest.py`, `QAM/AUTOMATION/Q4/manifest.py`, `QAM/evidence/Q4/A3/ob-manifest.json`, `QAM/evidence/Q4/A3/pp-manifest.json` |
| Gate Q certificate, repository record | `QAM/HANDOFFS/QAM_CERTIFICATION_ABM007_FINAL_GATE_Q_2026-11-28.md` |
| Certificate as issued, and the other supplied documents | `QAM/CLOSEOUT/SOURCES/` |
| Gate D plan, to be revised by the QA Lead | `QAM/GATE_D_PLAN.md` |
| Rulings AM-18 to AM-23 | `ABM_RULINGS.md` |
| Repair evidence | `EVIDENCE/RWO01/` |
| Exports, outside the repositories | `/home/moose/Downloads/ABM007_FINAL_ENGINEERING_CLOSEOUT_02.zip` (current), `…_01.zip` (earlier, preserved) |

## Not part of this module's closeout

REG-001 (the regression pack) and the central playbook sync are separate open work. Nothing was started.
