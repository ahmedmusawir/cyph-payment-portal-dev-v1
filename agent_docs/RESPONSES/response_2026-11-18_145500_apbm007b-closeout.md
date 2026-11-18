# APBM-007B architect closeout — consolidated return (Claudy for JARVIS → Director Tony)

18 November 2026, Asia/Dhaka. Closeout preparation is complete. Nothing was committed, pushed, merged, deployed or
applied to DEV. The on-screen return matches this file, plus the exact command blocks. Those blocks are kept verbatim in
`agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/CLOSEOUT/commit/GIT_HANDOFF.md` §§1–3.

## A. Repositories and merge readiness

| | Portal `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | OwedBook `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` |
|---|---|---|
| Branch / HEAD = origin | `qa/apbm-007b` `1a07c635eddc62edafa53fd85643b49aa6d831c1`, clean | `qa/apbm-007b` `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871`, clean |
| Certified product | `ba66534351368b4b67b9e61d6f0278866950c850`, ancestor of HEAD | `855e0ad…` = HEAD; nothing later |
| Above certified | 1 commit (`1a07c63`), 199 paths, **all under `…/QAM/`**: evidence, automation helpers, receipts, packages. Secret-shaped scan, including the 10 ZIPs: 0 | none |
| `origin/main` | `c68c4ac…`, ancestor of the QA head; 0 commits ahead | `0b78552…`, ancestor of the QA head; 0 commits ahead |
| Isolated `git merge-tree` | no conflict; merged tree = QA tree | no conflict; merged tree = QA tree |
| Method | local `--no-ff` (007A precedent); `main` unprotected | `main` **protected** → PR with a merge commit (007A PR #10) |
| Deploy coupling in repo / GitHub | none: no workflows, deployments or checks; `cloudbuild.yaml` only through the manual `deploy.sh` | none |
| Ready | yes, after the closeout records commit | yes, as is |

- Certificate `3d897cf9…` and release `bae72eec…` match their expected hashes.
- Director acceptance `ce33ecb5…` read from Downloads.
- Certificate import gap closed: 55 of 55 lines of §§1–6 appear verbatim in `QAM_CERTIFICATION.md`.
- Contract hash correction: the header line changed in all 12 files; `APBM_RULINGS.md` has +47 appended lines and
  `ENVIRONMENT_AND_EFFECTS.md` +5; old hashes kept; 0 contract bytes changed.
- Migration 0070 SHA-256 = expected.

## B. Files changed (Portal only; OwedBook untouched) — 19 paths

Listed in `EVIDENCE/CLOSEOUT/commit/portal-closeout-paths.txt`, with review hashes in `portal-closeout-blobs.txt`.

## C. Blockers, risks, backlog

- **Merge blockers:** none.
- **Conditions:** commit the closeout records first; run the read-only GCP Cloud Build trigger check before pushing
  `main` (gcloud needs re-login here).
- **Blocker to merged code on DEV:** the 0070 apply.
- **Accepted risks:** KR-1 to KR-6.
- **Backlog and limitations:** `CARRY_FORWARD.md`.
- **Gate D:** `GATE_D_HANDOFF.md`.
- **Disclosure:** the DEV 0070 release sheet was accidentally published as a private claude.ai artifact
  (`https://claude.ai/artifact/FX9FED23ZCW2GmcqBvbvEW`). Delete it on the Director's word.

## D. Git commands

See `GIT_HANDOFF.md` §§1–3 (the same blocks appear on screen). §1 may be run now. §2 and §3: RUN ONLY AFTER TONY RELEASES
MERGE. DEV apply: `EVIDENCE/CLOSEOUT/DEV_APPLY_0070/DEV_APPLY_0070_RELEASE.md` (separate release). Deployment: separate
release after Gate D.
