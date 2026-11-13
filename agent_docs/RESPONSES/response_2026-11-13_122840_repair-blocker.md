## Blocked: both checkouts are QA's checkouts

Repair F-Q1-01 not started. No file in either repo edited.

| Repo | Branch | HEAD | Worktree state |
|---|---|---|---|
| OwedBook `cyph-v1-dev` | `qa/apbm-007a` | `e30e216` | 37 uncommitted QA paths in `QAM/` (5 modified, 32 untracked incl. Q1 a01/a02 evidence) |
| Payment Portal | `qa/apbm-007a` | `2bb13b9` | clean |

`apbm-007a` points at the same commits and is checked out nowhere. No other worktree exists.

### Director action needed

git -C /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev worktree add /home/moose/NEXTJS/CYBER_PHARMA/eng/cyph-v1-dev apbm-007a
git -C /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 worktree add /home/moose/NEXTJS/CYBER_PHARMA/eng/cyph-payment-portal-dev-v1 apbm-007a

Then in Claude Code: /add-dir for both eng paths. After that I run `npm ci` in each worktree (registry download only) and continue.
