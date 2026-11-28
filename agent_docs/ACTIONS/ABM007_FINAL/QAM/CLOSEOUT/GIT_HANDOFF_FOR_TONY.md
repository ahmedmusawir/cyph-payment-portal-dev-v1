# ABM007_FINAL closeout — Git steps for the Director

**Prepared by:** the Engineer, 28 November 2026, Asia/Dhaka.

**These commands are prepared, not executed.** Engineering has staged, committed, pushed and merged nothing. No
resulting commit ID is known yet; the blocks print them.

## How the blocks work

- Each block runs in a child shell. A failed check prints `STOP: <command>` and ends the block. Your terminal stays
  open.
- **If a block prints STOP, or its last `OK` or `PUSHED` line is missing, do not run the next block. Send the output
  back.**
- Checks, action and push are one block, so a failed check stops everything after it.
- The match-check output is saved outside both repositories, in
  `/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS/`, for the QA Lead.
- The blocks were rehearsed in throwaway clones with a throwaway remote. Result: `evidence/git_handoff_rehearsal.txt`.
- The match-check helper has this machine's repository paths written into it. Run the blocks on this machine, with
  both repositories where they are now.

## The facts the blocks rely on

| | Account & Billing | OwedBook |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` |
| Remote | `ahmedmusawir/cyph-payment-portal-dev-v1`; `main` **not protected** | `Cyberize-Group/cyph-v1-dev`; `main` **protected** |
| Branch, HEAD = origin | `qa/abm007-final`, `5b8e935a58105897d53b7e4caeb3916bbfb99e23` | `qa/abm007-final`, `025c578f7ab0879bede38384c8a2ad63de8ba3c4` |
| Certified commit | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` (= HEAD) | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` (= HEAD) |
| `main` = `origin/main` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075`, an ancestor of HEAD | `9597699b404afdbcd792a9b4da61c21abb10cdf8`, an ancestor of HEAD |
| Established merge method | Local `git merge --no-ff`, then push | Pull request, "Create a merge commit" |
| Records to commit | 8,401 QA paths, then the closeout paths. All inside `QAM/` | **None.** The working tree is clean; the branch is merged exactly at the certified commit |
| Left untracked on purpose | 12 paths: 11 retained ZIP packages and one Python cache file (`commit/portal-left-untracked.txt`) | None |

Isolated merge check (`git merge-tree --write-tree origin/main HEAD`): no conflict in either repository, and the
merged tree equals the QA branch tree.

**About the 12 untracked paths.** The QA Executor's staging list leaves them out, so these steps leave them out. They
stay on disk; nothing is deleted. "Clean working tree" in the blocks below means "nothing except exactly these 12".
They sit under `agent_docs/`, which is never uploaded by `deploy.sh`. Whether the 11 ZIP packages should be committed
is a question for the QA Lead (`HANDBACK_FOR_FRIDAY.md`, request 2). If the answer is yes, send it back and I will
prepare a revised section 1.

## 0. Before any merge push: no automatic deploy

Read-only. A push to `main` must not start a build.

```
gcloud builds triggers list --project cyberize-nextjs-staging --region us-east1 --format='table(name,github.name,github.push.branch,disabled)'
gcloud builds triggers list --project cyberize-nextjs-staging --format='table(name,github.name,github.push.branch,disabled)'
```

Expected: no enabled trigger for `cyph-v1-dev` or `cyph-payment-portal-dev-v1` on `main`. If there is one, stop and
send the output back.

Also: no app or development server may be running from either checkout during sections 2 and 3.

## 1. Account & Billing — commit and push the records

Two commits on `qa/abm007-final`, then one push. No merge.

- Commit 1: the QA records, exactly the QA Executor's list.
- Commit 2: the engineering closeout records, exactly `QAM/CLOSEOUT/`.

Review first if you wish: `git status --short | less`, and the three lists in
`agent_docs/ACTIONS/ABM007_FINAL/QAM/CLOSEOUT/commit/`.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
bash -euo pipefail <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
export LC_ALL=C
QAM=agent_docs/ACTIONS/ABM007_FINAL/QAM; C=$QAM/CLOSEOUT/commit
CERT=5b8e935a58105897d53b7e4caeb3916bbfb99e23
OUT=/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS; mkdir -p "$OUT"
git fetch origin
test "$(git branch --show-current)" = qa/abm007-final
test "$(git rev-parse HEAD)" = $CERT
test "$(git rev-parse origin/qa/abm007-final)" = $CERT
git diff --cached --quiet                                   # nothing staged yet
diff <(git status --porcelain=v1 -uall | cut -c4- | sort) <(sort -u $C/portal-qa-records-paths.txt $C/portal-closeout-paths.txt $C/portal-left-untracked.txt)   # exactly the reviewed paths
diff <(sort $QAM/HANDOFFS/GATE_Q_FINAL_RECORDS_STAGING_LIST.txt) $C/portal-qa-records-paths.txt   # still the QA Executor's list
echo "PRE-STAGE OK"
GIT_LITERAL_PATHSPECS=1 git add --pathspec-from-file=$C/portal-qa-records-paths.txt      # explicit list only
diff <(git diff --cached --name-only | sort) $C/portal-qa-records-paths.txt
git diff --cached --quiet $CERT -- . ":(exclude)$QAM"       # nothing outside QAM
git commit -q -F $C/portal-qa-records-commit-msg.txt
GIT_LITERAL_PATHSPECS=1 git add --pathspec-from-file=$C/portal-closeout-paths.txt        # explicit list only
diff <(git diff --cached --name-only | sort) <(sort $C/portal-closeout-paths.txt)
git diff --cached --quiet HEAD -- . ":(exclude)$QAM/CLOSEOUT"   # nothing outside QAM/CLOSEOUT
git commit -q -F $C/portal-closeout-commit-msg.txt
test "$(git rev-parse HEAD~2)" = $CERT
git diff --quiet $CERT HEAD -- . ":(exclude)$QAM"           # product, tests and outside records = certified
diff <(git status --porcelain=v1 -uall | cut -c4- | sort) <(sort $C/portal-left-untracked.txt)   # only the 12 known paths remain
echo "COMMITS OK"
python3 $QAM/AUTOMATION/Q4_A3/manifest.py post-commit pp --commit "$(git rev-parse HEAD)" | tee "$OUT/pp_records_commit.json"
git push origin qa/abm007-final
git fetch origin
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/qa/abm007-final)"
echo "QA RECORDS COMMIT:       $(git rev-parse HEAD~1)" | tee "$OUT/pp_records_shas.txt"
echo "CLOSEOUT RECORDS COMMIT: $(git rev-parse HEAD)"   | tee -a "$OUT/pp_records_shas.txt"
echo "RECORDS PUSHED"                                    # send the three lines above back
SH
```

**If it stops before the first `git commit`:** unstage with
`git restore --staged agent_docs/ACTIONS/ABM007_FINAL/QAM` and send the output back.
**If it stops after a commit and before the push:** nothing has left the machine. Do not push. Send the output back.

## 2. Account & Billing — merge into `main`

**Run only after section 1 is done, section 0 is clear, and you release the merge.**

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
diff <(git status --porcelain=v1 -uall | cut -c4- | sort) <(sort $C/portal-left-untracked.txt)   # clean, except the 12 known paths
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/qa/abm007-final)"
test "$(git rev-parse HEAD~2)" = $CERT                      # the two records commits sit directly on the certified commit
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

**If it stops at `git merge` with a conflict:** run `git merge --abort`, then `git switch qa/abm007-final`, and send
the output back. Do not resolve anything.
**If it stops at the match check or anywhere after `git switch -q main` and before the push:** nothing has left the
machine. The saved output is in the checks folder. Restore with
`git switch qa/abm007-final && git branch -f main cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` and send the output to the
QA Lead. Do not push `main` until the QA Lead has ruled.

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

**If 3c stops:** `main` is already on GitHub and cannot be taken back by these steps. Change nothing. Send the output
to the QA Lead and the Engineer. `main` is frozen, and nothing is deployed from it until the QA Lead has ruled.

Block 3c needs the match-check helper in the Account & Billing working tree. It is there on `qa/abm007-final`
whether or not section 1 has been run, because the helper reads the files on disk.

## 4. What to send to the QA Lead

Everything in `/home/moose/Downloads/ABM007_FINAL_MAIN_MERGE_CHECKS/`:

| File | Content |
|---|---|
| `pp_records_commit.json`, `pp_records_shas.txt` | Match check on the records commit; the two records commit IDs |
| `pp_main_merge.json`, `pp_main_sha.txt` | Match check on the Account & Billing `main` commit; its ID |
| `ob_certified_precheck.json` | Match check on the OwedBook certified commit, before the pull request |
| `ob_main_merge.json`, `ob_main_sha.txt` | Match check on the OwedBook `main` commit; its ID |

A pass is `"mismatches": []` with manifest `bb27c2ee…` for Account & Billing and `38ebe196…` for OwedBook.

## 5. After the merge

- `main` is frozen in both repositories until Gate D passes.
- Nothing is deployed by these steps. The redeploy is a separate release.
- The resulting `main` commit IDs exist only in the checks folder until someone records them in the repository. With
  `main` frozen, I propose they go into the Gate D record. That is request 4 in `HANDBACK_FOR_FRIDAY.md`.
- Do not delete `qa/abm007-final` or anything under `QAM/AUTOMATION/`.
