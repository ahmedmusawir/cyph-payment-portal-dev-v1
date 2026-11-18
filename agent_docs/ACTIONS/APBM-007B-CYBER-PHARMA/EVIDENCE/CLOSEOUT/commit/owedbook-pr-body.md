## APBM-007B: OwedBook store lifecycle, invitations and migrations 0061–0070

**Gate Q: PASS WITH KNOWN RISK** (QA Lead, 18 November 2026). Merge `qa/apbm-007b` at the certified commit
`855e0ad2e22a37e633ab5a55b8459e9bcc6bd871`, paired with Portal `ba66534351368b4b67b9e61d6f0278866950c850`.
This branch has no commit above the certified one.

- History: candidate `c8a2ed9`; repair round 1 `1fd5a61` (migration 0070, staff panel, sign-in hydration); repair
  round 2 `855e0ad` (sign-in link and change-password forms keep text typed before load). The QA Lead routed both rounds
  under the Director ruling of 17 November 2026.
- Known risks KR-1 to KR-6 were accepted by the Director. The certificate and the full QA record are in the Portal
  repository under `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/`.
- **Database:** SCRATCH is at migration 70 and DEV at 69. Migration 0070
  (`de0b51c61c4ef255934fc20b6c7abdc5d4b69e1129bbce4a8a15111905edce81`) must be applied to DEV under its separate
  Director release before this code runs against DEV.
- Not included: deployment and Gate D. Legal and consent wording is still required before staging exposure.

Merge with **"Create a merge commit"** (as PR #10 for 007A), not squash or rebase, so `855e0ad` stays an ancestor of `main`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
