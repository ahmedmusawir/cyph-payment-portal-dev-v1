# Closeout baseline and match-check evidence — ABM007_FINAL

**Prepared by:** the Engineer · **Date:** 28 November 2026, 12:09 to 12:13 Asia/Dhaka

Everything here was read, not changed. Raw outputs are in `evidence/`.

## 1. Repositories

| | OwedBook | Account & Billing |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` |
| Remote | `Cyberize-Group/cyph-v1-dev` | `ahmedmusawir/cyph-payment-portal-dev-v1` |
| Current branch | `qa/abm007-final` | `qa/abm007-final` |
| Current HEAD | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` |
| Certified commit | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` |
| HEAD equals certified commit | Yes | Yes |
| Tracking branch | `origin/qa/abm007-final`, 0 ahead, 0 behind | `origin/qa/abm007-final`, 0 ahead, 0 behind |
| Remote branch head (`git ls-remote`) | `025c578f…` | `5b8e935a…` |
| Local `main` = `origin/main` | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| `origin/main` is an ancestor of HEAD | Yes; HEAD is 3 commits ahead, 0 behind | Yes; HEAD is 3 commits ahead, 0 behind |
| `main` protected on GitHub | **Yes** | No |
| Working tree before my work | Clean | 86 status lines, 8,413 files, all inside `agent_docs/ACTIONS/ABM007_FINAL/QAM/` |
| Staged | Nothing | Nothing |

Commits between `origin/main` and HEAD:

| Repository | Commit | Parent | Subject |
|---|---|---|---|
| OwedBook | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | `2e91e909…` | RWO-01 repairs with add-ons A1 to A3 |
| OwedBook | `2e91e90905b2d9907577a64985e643f7827019ac` | `c335671a…` | Pharmacy Books branding and Help |
| OwedBook | `c335671afa6cd4a8a2d437c30aeae5040e0cecaf` | `9597699b…` | Starting ABM007_Final (records) |
| Account & Billing | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` | `fc1fa6c2…` | RWO-01 repairs with add-ons A1 to A3; rulings AM-18 to AM-23 |
| Account & Billing | `fc1fa6c2a90ebf59987287ad765e2e65cf635549` | `b2e50fa8…` | Pharmacy Books branding and QA handoff |
| Account & Billing | `b2e50fa86ef041f9f7f7f1a0f630576de0a10664` | `cb4decde…` | E1 recon done (records) |

Isolated merge check, no working tree touched (`git merge-tree --write-tree origin/main HEAD`): no conflict in either
repository, and the merged tree equals the QA head tree in both. No file under `supabase/` differs from `origin/main`
in either repository: this module carries no migration.

## 2. The Director's QA-record commit

**It is not present.** The QA Lead's handoff says the Director commits the QA records on top of the Account & Billing
commit. As of this check the Account & Billing HEAD is still the certified commit, on the local branch and on the
remote. The QA records are uncommitted in the working tree.

What I could verify instead:

| Check | Result |
|---|---|
| Every uncommitted path is inside `QAM/` | Yes: 8,413 of 8,413 |
| The QA Executor's staging list (`QAM/HANDOFFS/GATE_Q_FINAL_RECORDS_STAGING_LIST.txt`, SHA-256 `6d428434c9bc1417a8b2ab32c9871fd90c2c0edfe0a34f2214e0faff7d3afa5c`) | 8,401 paths, every one inside `QAM/`, every one present as an uncommitted change |
| Uncommitted paths **not** in that list | 12 (`commit/portal-left-untracked.txt`): 11 retained ZIP packages in `QAM/HANDOFFS/` (87 MB) and one Python cache file, `QAM/AUTOMATION/Q4_A2/__pycache__/reconcile.cpython-312.pyc` (dated 27 November 11:42) |

So the statement "that commit changes files inside `QAM/` only" will hold if the Director stages from the list. I
could not verify a commit that does not exist yet.

## 3. Pre-existing changes and my edits

| Set | Paths | Where |
|---|---|---|
| Pre-existing, QA-owned, uncommitted | 8,413 files | `QAM/` in Account & Billing. I changed none of them |
| Mine, this closeout | The files listed in `commit/portal-closeout-paths.txt` | `QAM/CLOSEOUT/` only, all new |
| OwedBook | None | The working tree is still clean |

## 4. The match check

**The helper.** `QAM/AUTOMATION/Q4_A3/manifest.py`, SHA-256
`af5207c70c40894e2b36db2e0937a4db81718533a79cd20293722cdd4614cbc7`. How it works, from reading it:

- **The repository paths are written into it.** `QAM/AUTOMATION/Q4/manifest.py`, line 12, names
  `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`; OwedBook is the sibling folder `cyph-v1-dev`. The
  check therefore works only on this machine with both repositories at these paths, and it always reads these two
  repositories, whatever folder it is started from. The QA Lead's rule is to start it from the Account & Billing
  root. A commit must exist in the local repository (fetched) before it can be checked.
- It finds the two manifest files from its own location inside `QAM/`.
- `post-commit <app> --commit <commit>` reads the commit's file list with Git. It writes nothing.
- It leaves out any path with a folder named `QAM`, `node_modules`, `.next`, `.git` or `.turbo`, any `.env*` name,
  and key files.
- A mismatch is any other file that is missing, added, changed, or has a different file mode. **A new file outside
  `QAM/` counts as a mismatch.**
- It refuses the module's first candidates (`2e91e90…`, `fc1fa6c…`) and requires them to be ancestors of the commit.
- Exit status 0 with an empty list is a pass. Exit status 1 is a mismatch.

**The run.** From `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`:

```
python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit ob --commit 025c578f7ab0879bede38384c8a2ad63de8ba3c4
python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit pp --commit 5b8e935a58105897d53b7e4caeb3916bbfb99e23
```

| | OwedBook | Account & Billing |
|---|---|---|
| Exit status | 0 | 0 |
| Manifest hash reported | `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603` | `bb27c2ee7515d9c2a2d9df5dd537fdd0d02313816b2e5c0798bf6ca38402ee98` |
| Equals the expected hash | Yes | Yes |
| Files | 2,314 | 2,557 |
| Mismatches | none (`[]`) | none (`[]`) |
| Error output | empty | empty |
| Raw output | `evidence/manifest_ob_certified_025c578.stdout.json` | `evidence/manifest_pp_certified_5b8e935.stdout.json` |

The three preserved files are present and unchanged by me:

| File | SHA-256 |
|---|---|
| `QAM/AUTOMATION/Q4_A3/manifest.py` | `af5207c70c40894e2b36db2e0937a4db81718533a79cd20293722cdd4614cbc7` |
| `QAM/evidence/Q4/A3/ob-manifest.json` | `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603` |
| `QAM/evidence/Q4/A3/pp-manifest.json` | `bb27c2ee7515d9c2a2d9df5dd537fdd0d02313816b2e5c0798bf6ca38402ee98` |

The helper also loads `QAM/AUTOMATION/Q4/manifest.py`. That file must be kept too.

## 5. What the check will say after closeout

- My records are all inside `QAM/`, so they cannot produce a mismatch.
- The QA records are all inside `QAM/`, so they cannot either.
- The merge to `main` adds no file: the merged tree equals the QA branch tree.

Expected result on the records commits and on both resulting `main` commits: zero mismatches. That is a prediction.
The real runs are in the Director's steps (`GIT_HANDOFF_FOR_TONY.md`), and their output goes to the QA Lead.

## 6. Supplied files

All located and read. Copies as received are in `SOURCES/`, hashes in `evidence/SOURCES.sha256`.

| File | Found at |
|---|---|
| `QA_LEAD_CLEANUP_ACCEPTANCE_AND_CLOSEOUT_HANDOFF_ABM007_FINAL_2026-11-28.md` | `~/Downloads/`, and inside the handoff ZIP (same hash) |
| `QAM_CERTIFICATION_ABM007_FINAL_GATE_Q_2026-11-28.md` | `~/Downloads/`, and inside the handoff ZIP (same hash) |
| `QA_LEAD_RWO01_RELEASE_AND_DIRECTOR_RULINGS_ABM007_FINAL_2026-11-26.md` | `~/Downloads/_ARCHIVE/` |
| `deploy_account_and_billing_as_supplied_2026-11-28.sh.txt` | inside `~/Downloads/ABM007_FINAL_CLOSEOUT_HANDOFF_FOR_ARCHITECT_2026-11-28.zip` |
| `deploy_owedbook_as_supplied_2026-11-28.sh.txt` | inside the same ZIP |
| `ABM_RULINGS.md` with AM-18 to AM-23 | the module folder, committed in `5b8e935` |

No required file is missing.

## 7. Update, 28 November 13:00

Git state inspected again after `git fetch` in both repositories. **Nothing has changed since section 1:** both
branches, both HEADs, both remote branches and both `main` branches are as recorded there; nothing is staged; the
Director has run no step.

| Change since the first check | Detail |
|---|---|
| One file removed, on the Director's decision 3 | `QAM/AUTOMATION/Q4_A2/__pycache__/reconcile.cpython-312.pyc`, SHA-256 `bc2add96ea97b16bdcb9e1286c55dcabac0960b0285ff6cf63b9b7730324b5c8`, 11,195 bytes. Verified untracked first (`git ls-files --error-unmatch` failed; status `??`). The empty `__pycache__` folder went with it. `reconcile.py` and every other helper are untouched: 143 files under `QAM/AUTOMATION/`, down from 144 |
| Untracked paths outside both commit lists | Now 11, the retained ZIP packages. They stay on disk, outside Git (decision 2) |
| Match check, both certified commits, rerun at 13:00 | See `evidence/manifest_*_rerun_1300.stdout.json` |

## 8. Update, 28 November 13:02: the Director's records commits

While the wrap-up was in progress the Director committed and pushed the records in Account & Billing. Section 7 was
true at 13:00; this section is the state after.

| | OwedBook | Account & Billing |
|---|---|---|
| Branch | `qa/abm007-final` | `qa/abm007-final` |
| HEAD = remote branch | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` (unchanged, certified) | `4eee35c4e0ee1196744360d664c1ed3edc0d8afd` |
| `main` = `origin/main` | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Working tree | Clean | The wrap-up records in `QAM/CLOSEOUT/` (`commit/portal-closeout-02-paths.txt`) and the 11 retained ZIP packages |

**The Director's QA-record commit is now present and verified.**

| Commit | Parent | Verified by reading the commit |
|---|---|---|
| `f4dd32982df047b63aa6f0ad9119546f06058024`, 13:00:45 | `5b8e935a…` (certified) | Its changed paths equal the QA Executor's staging list exactly: 8,401 paths, all inside `QAM/`. The QA Lead's statement "that commit changes files inside `QAM/` only" holds |
| `4eee35c4e0ee1196744360d664c1ed3edc0d8afd`, 13:00:53 | `f4dd3298…` | 28 paths, all inside `QAM/CLOSEOUT/` |

- Everything outside `QAM/` at `4eee35c…` is identical to the certified commit (`git diff --quiet` between them,
  `QAM/` left out).
- No ABM007_FINAL ZIP package and no `__pycache__` path is tracked.
- **Match check on `4eee35c…`: run by the Director, not by me.** Output as supplied: manifest `bb27c2ee…`, 2,557
  files, mismatches none. Kept in `evidence/director_records_commit_output_2026-11-28.txt`.
- The Director used his own commands and commit messages, not block 1 of the handoff, so no checks folder was made.
