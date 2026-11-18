# APBM-007B closeout — Git handoff for Tony

Prepared 18 November 2026 (Asia/Dhaka) by Claudy (Engineering) for JARVIS closeout. Engineering has staged, committed,
merged and pushed nothing. Each guard block runs in a child `bash -eu`. A failed check prints `STOP: <command>` and ends that block without
closing your terminal. **If any block prints STOP, or an `OK` line is missing, do not run the next command; send the
output back.** In each section the checks, the action and the push are one block, so a failed check stops everything
after it. Git asks for credentials on the terminal, not on the block's input. These exact blocks ran in throwaway
clones with only the fetch and push lines removed: sections 1 and 2 on a copy of the reviewed files, and section 3's
checks against a merge commit made locally.

| | Portal | OwedBook |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` |
| Remote | `ahmedmusawir/cyph-payment-portal-dev-v1` (public; `main` not protected; 0 workflows) | `Cyberize-Group/cyph-v1-dev` (public; `main` **protected**; 0 workflows) |
| Branch / HEAD = origin | `qa/apbm-007b` `1a07c635eddc62edafa53fd85643b49aa6d831c1` | `qa/apbm-007b` `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871` |
| Certified product | `ba66534351368b4b67b9e61d6f0278866950c850` | `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871` (= HEAD) |
| `main` = `origin/main` | `c68c4acaccc4a68f20ede267f06cfda17fa15aac` (ancestor of the QA head) | `0b785524a621c4384db8bee47ef9b4149b8ab44c` (ancestor of the QA head) |
| Established merge method | local `git merge --no-ff` (007A `c68c4ac` has 2 parents) | GitHub PR, "Create a merge commit" (007A PR #10 = `0b78552`) |
| Closeout records to commit | 19 paths (`portal-closeout-paths.txt`; review hashes in `portal-closeout-blobs.txt`) | none: the branch is merged exactly at the certified commit |

Isolated merge check (`git merge-tree --write-tree origin/main origin/qa/apbm-007b`, no working tree touched): no
conflict in either repo. The merged tree equals the QA head tree (Portal `afcc8f68…`, OwedBook `42194eac…`).

## 1. Portal — commit and push the closeout records

These commands only add records to `qa/apbm-007b`. They do not merge.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
bash -eu <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
L=agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit; M=agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA
git fetch origin
test "$(git branch --show-current)" = qa/apbm-007b
test "$(git rev-parse HEAD)" = 1a07c635eddc62edafa53fd85643b49aa6d831c1
test "$(git rev-parse origin/qa/apbm-007b)" = 1a07c635eddc62edafa53fd85643b49aa6d831c1
git diff --cached --quiet                                   # nothing staged yet
diff <(git status --porcelain=v1 -uall | cut -c4- | sort) <(sort "$L/portal-closeout-paths.txt")   # exactly the 19 paths, nothing else
while read -r b p; do test "$(git hash-object -- "$p")" = "$b" || { echo "CHANGED SINCE REVIEW: $p"; exit 1; }; done < "$L/portal-closeout-blobs.txt"
echo "PRE-STAGE OK"
git add --pathspec-from-file="$L/portal-closeout-paths.txt"     # explicit list only
diff <(git diff --cached --name-only | sort) <(sort "$L/portal-closeout-paths.txt")
git diff --cached --quiet ba66534351368b4b67b9e61d6f0278866950c850 -- . ':(exclude)agent_docs' ':(exclude)CHANGELOG.md' ':(exclude)RECOVERY.md'   # product = certified
git diff --cached --quiet ba66534351368b4b67b9e61d6f0278866950c850 -- $M/ACCEPTANCE_SPEC.md $M/APBM_RULINGS.md $M/EXECUTION_PLAN.md $M/ENVIRONMENT_AND_EFFECTS.md $M/ALLOWED_PATHS.md $M/CONTRACTS   # frozen contract files unchanged
git diff --cached --quiet 1a07c635eddc62edafa53fd85643b49aa6d831c1 -- $M/QAM ':(exclude)'$M/QAM/HANDOFFS/ENGINEERING_HANDOFF.md   # QA-owned records unchanged
test -z "$(git status --porcelain=v1 -uall | grep -v '^[AM] ')"   # everything staged, nothing else
echo "STAGED OK"
git commit -q -F "$L/portal-closeout-commit-msg.txt"
test "$(git rev-parse HEAD~1)" = 1a07c635eddc62edafa53fd85643b49aa6d831c1
git push origin qa/apbm-007b
git fetch origin
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/qa/apbm-007b)"
echo "RECORDS COMMIT PUSHED: $(git rev-parse HEAD)"   # send this line back
SH
```

If it stops before `git commit`, unstage with `git restore --staged --pathspec-from-file=agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit/portal-closeout-paths.txt` and send the output back.

## 2. Portal — merge `qa/apbm-007b` into `main` — RUN ONLY AFTER TONY RELEASES MERGE

Prerequisites: section 1 is done. You have run the read-only Cloud Build trigger check in section 4, and no trigger
watches `main`. No app or dev server is running from this checkout: `git switch main` briefly puts
the 007A files back before the merge restores the QA tree. DEV 0070 is a separate release and does not gate a Git merge,
but no code from `main` may run against DEV before DEV is at 70.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
bash -eu <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
git fetch origin
test "$(git branch --show-current)" = qa/apbm-007b
test -z "$(git status --porcelain=v1 -uall)"
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/qa/apbm-007b)"
test "$(git rev-parse HEAD~1)" = 1a07c635eddc62edafa53fd85643b49aa6d831c1        # closeout commit sits directly on the QA records
test "$(git rev-parse main)" = c68c4acaccc4a68f20ede267f06cfda17fa15aac
test "$(git rev-parse origin/main)" = c68c4acaccc4a68f20ede267f06cfda17fa15aac   # if main moved, stop: re-check needed
git merge-base --is-ancestor ba66534351368b4b67b9e61d6f0278866950c850 HEAD
git merge-base --is-ancestor origin/main HEAD
git diff --quiet ba66534351368b4b67b9e61d6f0278866950c850 HEAD -- . ':(exclude)agent_docs' ':(exclude)CHANGELOG.md' ':(exclude)RECOVERY.md'
echo "CANDIDATE OK: $(git rev-parse HEAD)"
MSG=$(mktemp); git show qa/apbm-007b:agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit/portal-merge-msg.txt > "$MSG"   # committed message (absent on 007A main)
git switch -q main
git merge -q --no-ff qa/apbm-007b -F "$MSG"
test "$(git rev-parse HEAD^1)" = c68c4acaccc4a68f20ede267f06cfda17fa15aac
test "$(git rev-parse HEAD^2)" = "$(git rev-parse qa/apbm-007b)"
git diff --quiet HEAD qa/apbm-007b                                           # merged tree = QA tree
git diff --quiet ba66534351368b4b67b9e61d6f0278866950c850 HEAD -- . ':(exclude)agent_docs' ':(exclude)CHANGELOG.md' ':(exclude)RECOVERY.md'   # product = certified
git merge-base --is-ancestor ba66534351368b4b67b9e61d6f0278866950c850 HEAD
echo "MERGE OK: $(git rev-parse HEAD)"
git push origin main
git fetch origin
test "$(git rev-parse main)" = "$(git rev-parse origin/main)"
git switch -q qa/apbm-007b                                               # same tree as main: no working file changes
echo "MAIN PUSHED: $(git rev-parse origin/main)"   # send this line back
SH
```

If it stops after `git switch -q main` and before the push, nothing has left the machine. Restore with
`git switch qa/apbm-007b && git branch -f main c68c4acaccc4a68f20ede267f06cfda17fa15aac` and send the output back.
Do not delete `qa/apbm-007b` (local or remote).

## 3. OwedBook — merge by pull request — RUN ONLY AFTER TONY RELEASES MERGE

`main` is protected, so merge by PR, as for 007A. There is no closeout commit in this repo.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
bash -eu <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
git fetch origin
test "$(git branch --show-current)" = qa/apbm-007b
test -z "$(git status --porcelain=v1 -uall)"
test "$(git rev-parse HEAD)" = 855e0ad2e22a37e633ab5a55b8459e9bcc6bd871
test "$(git rev-parse origin/qa/apbm-007b)" = 855e0ad2e22a37e633ab5a55b8459e9bcc6bd871
test "$(git rev-parse origin/main)" = 0b785524a621c4384db8bee47ef9b4149b8ab44c
git merge-base --is-ancestor origin/main HEAD
test "$(git merge-tree --write-tree origin/main HEAD)" = "$(git rev-parse HEAD^{tree})"
echo "CANDIDATE OK"
SH
```

`gh` is not installed on this machine. Use **either** route.

**Route A, the GitHub web page.** Open
`https://github.com/Cyberize-Group/cyph-v1-dev/compare/main...qa/apbm-007b?expand=1`.
- Title: `APBM-007B: OwedBook store lifecycle, invitations and migrations 0061-0070 (Gate Q)`.
- Description: paste the contents of
  `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit/owedbook-pr-body.md`.
- Create the PR and confirm its head commit is `855e0ad`.
- Merge with **Create a merge commit**, not squash or rebase.
- Do **not** press "Delete branch".

**Route B, the `gh` CLI** (only if you install and sign in to `gh`):

```bash
gh pr create --repo Cyberize-Group/cyph-v1-dev --base main --head qa/apbm-007b \
  --title "APBM-007B: OwedBook store lifecycle, invitations and migrations 0061-0070 (Gate Q)" \
  --body-file /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit/owedbook-pr-body.md
gh pr merge qa/apbm-007b --repo Cyberize-Group/cyph-v1-dev --merge --match-head-commit 855e0ad2e22a37e633ab5a55b8459e9bcc6bd871
```

After either route, verify the result and fast-forward local `main` without touching the working tree:

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
bash -eu <<'SH'
trap 'echo "STOP: $BASH_COMMAND"' ERR
git fetch origin
M=$(git rev-parse origin/main)
test "$(git rev-parse "$M^1")" = 0b785524a621c4384db8bee47ef9b4149b8ab44c
test "$(git rev-parse "$M^2")" = 855e0ad2e22a37e633ab5a55b8459e9bcc6bd871   # a squash or rebase merge fails here
git diff --quiet "$M" 855e0ad2e22a37e633ab5a55b8459e9bcc6bd871               # main tree = certified product tree
git ls-remote --exit-code origin refs/heads/qa/apbm-007b >/dev/null           # QA branch still on the remote
echo "MERGE OK: $M"
git fetch origin main:main            # local main → origin/main (fast-forward only; main is not checked out)
test "$(git rev-parse main)" = "$M"
echo "LOCAL MAIN = ORIGIN MAIN: $M"   # send this line back
SH
```

## 4. Not in this handoff

- **DEV 0070 apply.** Separate release: `../DEV_APPLY_0070/DEV_APPLY_0070_RELEASE.md`.
- **Deployment.** Separate release, and Gate D first. Nothing in either repository deploys on a push: there are no
  GitHub workflows, deployments or commit checks. Portal `deploy.sh` runs `gcloud builds submit` by hand.
- **Not verified here: GCP-side Cloud Build triggers.** gcloud needs re-authentication on this machine, so I could not list
  triggers. Before you push `main`, run this read-only check and confirm no trigger watches either repo's `main`:
  `gcloud builds triggers list --project cyberize-nextjs-staging --region us-east1` and the same with `--region global`.
- **Branch deletion.** Neither QA branch is deleted.
