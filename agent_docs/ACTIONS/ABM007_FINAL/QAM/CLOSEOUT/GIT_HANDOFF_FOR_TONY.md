# ABM007_FINAL closeout — Git steps for the Director

**Prepared by:** the Engineer, 28 November 2026, Asia/Dhaka. **Revision 02:** fits the Git state inspected at
13:02 (the Director has committed and pushed the records; no merge), the Director's four decisions, and the stop rule.

**Sections 1b, 2 and 3 are prepared, not executed.** Section 1 was done by the Director. Engineering has staged,
committed, pushed and merged nothing. No `main` merge commit ID exists yet; the blocks print them.

## How the blocks work

- Each block runs in a child shell. A failed check prints `STOP: <command>` and ends the block. Your terminal stays
  open.
- **If a block prints STOP, or its last `OK`, `PUSHED` or `VERIFIED` line is missing: STOP, preserve the current state
  and output, and report to the Director. No automatic recovery, and do not run the next block.**
- Checks, action and push are one block, so a failed check stops everything after it.
- The match-check output is saved outside both repositories, in
  `/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS/`, for the QA Lead.
- The blocks were rehearsed in throwaway clones with a throwaway remote. Results: `evidence/git_handoff_rehearsal.txt`
  (revision 01) and `evidence/git_handoff_rehearsal_02.txt` (this revision).
- The match-check helper has this machine's repository paths written into it. Run the blocks on this machine, with
  both repositories where they are now.

## The facts the blocks rely on

| | Account & Billing | OwedBook |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` |
| Remote | `ahmedmusawir/cyph-payment-portal-dev-v1`; `main` **not protected** | `Cyberize-Group/cyph-v1-dev`; `main` **protected** |
| Branch, HEAD = origin (inspected 13:02) | `qa/abm007-final`, `4eee35c4e0ee1196744360d664c1ed3edc0d8afd` | `qa/abm007-final`, `025c578f7ab0879bede38384c8a2ad63de8ba3c4` |
| Certified commit | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` (two records commits below HEAD) | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` (= HEAD) |
| `main` = `origin/main` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075`, an ancestor of HEAD | `9597699b404afdbcd792a9b4da61c21abb10cdf8`, an ancestor of HEAD |
| Established merge method | Local `git merge --no-ff`, then push | Pull request, "Create a merge commit" |
| Records to commit | QA records and closeout records: **committed and pushed by the Director.** Still to commit: the wrap-up records (`commit/portal-closeout-02-paths.txt`), all inside `QAM/CLOSEOUT/` | **None.** The working tree is clean; the branch is merged exactly at the certified commit |
| Left untracked on purpose | 11 paths: the retained ZIP packages (`commit/portal-left-untracked.txt`) | None |

Isolated merge check (`git merge-tree --write-tree origin/main HEAD`): no conflict in either repository, and the
merged tree equals the QA branch tree.

**About the 11 untracked ZIP packages.** The Director decided on 28 November that they stay on disk, outside Git, and
that none is deleted (`DIRECTOR_DECISIONS_2026-11-28.md`). "Clean working tree" in the blocks below means "nothing
except exactly these 11". They sit under `agent_docs/`, which is never uploaded by `deploy.sh`. The one Python cache
file that was also untracked has been removed on the Director's decision.

## 0. Before any merge push: no automatic deploy

Read-only. A push to `main` must not start a build.

```
gcloud builds triggers list --project cyberize-nextjs-staging --region us-east1 --format='table(name,github.name,github.push.branch,disabled)'
gcloud builds triggers list --project cyberize-nextjs-staging --format='table(name,github.name,github.push.branch,disabled)'
```

Expected: no enabled trigger for `cyph-v1-dev` or `cyph-payment-portal-dev-v1` on `main`. If there is one, stop and
send the output back.

Also: no app or development server may be running from either checkout during sections 2 and 3.

## 1. Account & Billing — the records commits: DONE by the Director

Done on 28 November at 13:00, by the Director's own commands, and pushed. Verified by the Engineer by reading the
commits; the terminal output the Director supplied is in `evidence/director_records_commit_output_2026-11-28.txt`.

| Commit | ID | Content, verified |
|---|---|---|
| QA records | `f4dd32982df047b63aa6f0ad9119546f06058024` | Exactly the 8,401 paths of the QA Executor's staging list. All inside `QAM/` |
| Closeout records | `4eee35c4e0ee1196744360d664c1ed3edc0d8afd` | 28 paths, all inside `QAM/CLOSEOUT/` (`commit/portal-closeout-paths.txt`) |

- `qa/abm007-final` and `origin/qa/abm007-final` are both at `4eee35c4e0ee1196744360d664c1ed3edc0d8afd`.
- Everything outside `QAM/` is identical to the certified commit.
- Match check on `4eee35c…`, run by the Director: manifest `bb27c2ee…`, 2,557 files, mismatches none.

## 1b. Account & Billing — commit and push the wrap-up records

The wrap-up of 13:00 changed and added closeout records after the Director's commit. They are uncommitted. One more
records commit is needed before the merge, because section 2 requires a clean working tree.

Paths: `commit/portal-closeout-02-paths.txt`, all inside `QAM/CLOSEOUT/`.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
bash -euo pipefail <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
export LC_ALL=C
QAM=agent_docs/ACTIONS/ABM007_FINAL/QAM; C=$QAM/CLOSEOUT/commit
CERT=5b8e935a58105897d53b7e4caeb3916bbfb99e23
REC=4eee35c4e0ee1196744360d664c1ed3edc0d8afd
OUT=/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS; mkdir -p "$OUT"
git fetch origin
test "$(git branch --show-current)" = qa/abm007-final
test "$(git rev-parse HEAD)" = $REC
test "$(git rev-parse origin/qa/abm007-final)" = $REC
git diff --cached --quiet                                   # nothing staged yet
diff <(git status --porcelain=v1 -uall | cut -c4- | sort) <(sort -u $C/portal-closeout-02-paths.txt $C/portal-left-untracked.txt)   # exactly the reviewed paths
echo "PRE-STAGE OK"
GIT_LITERAL_PATHSPECS=1 git add --pathspec-from-file=$C/portal-closeout-02-paths.txt     # explicit list only
diff <(git diff --cached --name-only | sort) <(sort $C/portal-closeout-02-paths.txt)
git diff --cached --quiet HEAD -- . ":(exclude)$QAM/CLOSEOUT"   # nothing outside QAM/CLOSEOUT
git commit -q -F $C/portal-closeout-02-commit-msg.txt
test "$(git rev-parse HEAD~1)" = $REC
git diff --quiet $CERT HEAD -- . ":(exclude)$QAM"           # product, tests and outside records = certified
diff <(git status --porcelain=v1 -uall | cut -c4- | sort) <(sort $C/portal-left-untracked.txt)   # only the 11 retained ZIP packages remain
echo "COMMIT OK"
python3 $QAM/AUTOMATION/Q4_A3/manifest.py post-commit pp --commit "$(git rev-parse HEAD)" | tee "$OUT/pp_wrapup_commit.json"
git push origin qa/abm007-final
git fetch origin
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/qa/abm007-final)"
echo "WRAP-UP RECORDS COMMIT: $(git rev-parse HEAD)" | tee "$OUT/pp_wrapup_sha.txt"
echo "RECORDS PUSHED"                                    # send the line above back
SH
```

**If it stops anywhere:** STOP, preserve the current state and output, and report to the Director. No automatic recovery: do not unstage, abort, reset, move a branch or push.

## 2. Account & Billing — merge into `main`

**Run only after section 1b is done, section 0 is clear, and you release the merge.**

The block updates local `main` from `origin/main` by fast-forward only, merges with a merge commit, runs the match
check on the new `main` commit, and pushes **only if the check passes**.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
bash -euo pipefail <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
export LC_ALL=C
QAM=agent_docs/ACTIONS/ABM007_FINAL/QAM; C=$QAM/CLOSEOUT/commit
CERT=5b8e935a58105897d53b7e4caeb3916bbfb99e23
MAIN0=cb4decde9adc9ab75d0dcb15556c64a3bdbfe075
OUT=/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS; mkdir -p "$OUT"
git fetch origin
test "$(git branch --show-current)" = qa/abm007-final
diff <(git status --porcelain=v1 -uall | cut -c4- | sort) <(sort $C/portal-left-untracked.txt)   # clean, except the 11 retained ZIP packages
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/qa/abm007-final)"
git merge-base --is-ancestor 4eee35c4e0ee1196744360d664c1ed3edc0d8afd HEAD   # the Director's records commits are in the branch
test "$(git rev-parse HEAD~3)" = $CERT                      # three records commits sit directly on the certified commit
test "$(git rev-parse origin/main)" = $MAIN0                # if main moved, stop: a re-check is needed
git merge-base --is-ancestor $CERT HEAD
git merge-base --is-ancestor origin/main HEAD
git diff --quiet $CERT HEAD -- . ":(exclude)$QAM"
QA=$(git rev-parse HEAD)
MSG=$(mktemp); cp $C/portal-merge-msg.txt "$MSG"
echo "CANDIDATE OK: $QA"
git switch -q main
git merge -q --ff-only origin/main                          # update local main; can never create a merge
test "$(git rev-parse HEAD)" = $MAIN0
git merge -q --no-ff qa/abm007-final -F "$MSG"              # a conflict stops here; nothing is resolved automatically
test "$(git rev-parse HEAD^1)" = $MAIN0
test "$(git rev-parse HEAD^2)" = "$QA"
git diff --quiet HEAD "$QA"                                 # merged tree = QA branch tree
git merge-base --is-ancestor $CERT HEAD                     # the certified commit is in main's history
MERGE=$(git rev-parse HEAD)
echo "MERGE MADE LOCALLY, NOT PUSHED: $MERGE"
python3 $QAM/AUTOMATION/Q4_A3/manifest.py post-commit pp --commit "$MERGE" | tee "$OUT/pp_main_merge.json"   # a mismatch stops here, before the push
echo "MATCH CHECK OK"
git push origin main
git fetch origin
test "$(git rev-parse main)" = "$(git rev-parse origin/main)"
git switch -q qa/abm007-final                               # same tree as main: no working file changes
echo "ACCOUNT & BILLING MAIN: $MERGE (certified $CERT is an ancestor)" | tee "$OUT/pp_main_sha.txt"
echo "MAIN PUSHED"                                          # send the line above back
SH
```

**If it stops anywhere:** STOP, preserve the current state and output, and report to the Director. No automatic recovery: do not unstage, abort, reset, move a branch or push.
A stop at `git merge` means a conflict: nothing is resolved. A stop at the match check, or anywhere before
`git push origin main`, means nothing has left the machine; the checkout may be left on `main` with a local merge.
Leave it as it is. `main` is not pushed until the QA Lead has ruled on the saved output.

Do not delete `qa/abm007-final`, local or remote.

## 3. OwedBook — merge by pull request

**Run only after section 0 is clear and you release the merge.** `main` is protected, so the merge goes through a
pull request, as it did for the earlier modules. There is no records commit in this repository.

On GitHub the merge and the push are one action. The check that would otherwise stop the push therefore runs
**before** the pull request is merged: block 3a proves that the merge result will have exactly the files of the
certified commit, and runs the match check on the certified commit. Block 3c then runs the match check on the real
`main` commit.

### 3a. Pre-check

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
bash -euo pipefail <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
CERT=025c578f7ab0879bede38384c8a2ad63de8ba3c4
MAIN0=9597699b404afdbcd792a9b4da61c21abb10cdf8
PP=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
OUT=/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS; mkdir -p "$OUT"
git fetch origin
test "$(git branch --show-current)" = qa/abm007-final
test -z "$(git status --porcelain=v1 -uall)"                # clean
test "$(git rev-parse HEAD)" = $CERT
test "$(git rev-parse origin/qa/abm007-final)" = $CERT
test "$(git rev-parse origin/main)" = $MAIN0                # if main moved, stop: a re-check is needed
git merge-base --is-ancestor origin/main HEAD
test "$(git merge-tree --write-tree origin/main HEAD)" = "$(git rev-parse HEAD^{tree})"   # no conflict; merge result = certified files
(cd "$PP" && python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit ob --commit $CERT) | tee "$OUT/ob_certified_precheck.json"
echo "OWEDBOOK CANDIDATE OK"
SH
```

### 3b. The pull request

`gh` is not installed on this machine, so use the GitHub web page.

1. Open `https://github.com/Cyberize-Group/cyph-v1-dev/compare/main...qa/abm007-final?expand=1`.
2. Title: `ABM007_FINAL: Pharmacy Books branding, Help page and repairs (Gate Q)`.
3. Description: paste the contents of
   `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/QAM/CLOSEOUT/commit/owedbook-pr-body.md`.
4. Create the pull request. Confirm its head commit is `025c578` and that GitHub reports no conflict. If it reports
   a conflict, stop; do not resolve it.
5. Merge with **Create a merge commit**. Not squash, not rebase.
6. Do **not** press "Delete branch".

If you later install `gh`, the equivalent is:

```
gh pr create --repo Cyberize-Group/cyph-v1-dev --base main --head qa/abm007-final --title "ABM007_FINAL: Pharmacy Books branding, Help page and repairs (Gate Q)" --body-file /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/QAM/CLOSEOUT/commit/owedbook-pr-body.md
gh pr merge qa/abm007-final --repo Cyberize-Group/cyph-v1-dev --merge --match-head-commit 025c578f7ab0879bede38384c8a2ad63de8ba3c4
```

### 3c. After the pull request is merged

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
bash -euo pipefail <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
CERT=025c578f7ab0879bede38384c8a2ad63de8ba3c4
MAIN0=9597699b404afdbcd792a9b4da61c21abb10cdf8
PP=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
OUT=/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS; mkdir -p "$OUT"
test "$(git branch --show-current)" = qa/abm007-final
test -z "$(git status --porcelain=v1 -uall)"
git fetch origin
git fetch origin main:main                                  # update local main by fast-forward only; never a merge
MERGE=$(git rev-parse origin/main)
test "$(git rev-parse main)" = "$MERGE"
test "$MERGE" != $MAIN0                                     # the pull request really was merged
test "$(git rev-parse "$MERGE^1")" = $MAIN0                 # a merge commit on top of the old main
test "$(git rev-parse "$MERGE^2")" = $CERT                  # its second parent is the certified commit
test "$(git rev-parse "$MERGE^{tree}")" = "$(git rev-parse "$CERT^{tree}")"   # merged files = certified files
git merge-base --is-ancestor $CERT "$MERGE"
test "$(git rev-parse origin/qa/abm007-final)" = $CERT      # the QA branch still exists on the remote
(cd "$PP" && python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit ob --commit "$MERGE") | tee "$OUT/ob_main_merge.json"
echo "OWEDBOOK MAIN: $MERGE (certified $CERT is an ancestor)" | tee "$OUT/ob_main_sha.txt"
echo "OWEDBOOK MAIN VERIFIED"                               # send the line above back
SH
```

**If it stops anywhere:** STOP, preserve the current state and output, and report to the Director. No automatic recovery: do not unstage, abort, reset, move a branch or push.
In 3c `main` is already on GitHub. `main` is frozen, and nothing is deployed from it until the QA Lead has ruled.

Block 3c needs the match-check helper in the Account & Billing working tree. It is there on `qa/abm007-final` and,
after section 2, on `main`.

## 4. What to send to the QA Lead

Everything in `/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS/`:

| File | Content |
|---|---|
| `pp_wrapup_commit.json`, `pp_wrapup_sha.txt` | Match check on the wrap-up records commit; its ID. (The first two records commits: `evidence/director_records_commit_output_2026-11-28.txt`) |
| `pp_main_merge.json`, `pp_main_sha.txt` | Match check on the Account & Billing `main` commit; its ID |
| `ob_certified_precheck.json` | Match check on the OwedBook certified commit, before the pull request |
| `ob_main_merge.json`, `ob_main_sha.txt` | Match check on the OwedBook `main` commit; its ID |

A pass is `"mismatches": []` with manifest `bb27c2ee…` for Account & Billing and `38ebe196…` for OwedBook.

## 5. After the merge

- `main` is frozen in both repositories until Gate D passes.
- Nothing is deployed by these steps. The redeploy is a separate release.
- The resulting `main` commit IDs and the match-check outputs go into the **Gate D record** (Director's decision 4,
  28 November). Until then they exist only in the checks folder. No commit ID is written anywhere before it exists.
- Do not delete `qa/abm007-final` or anything under `QAM/AUTOMATION/`.
