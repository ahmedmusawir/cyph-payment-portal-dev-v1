# QA candidate-pair receipt — Cody, 2026-11-17 Asia/Dhaka

Authority: Tony’s Q1 release in this conversation. This dated receipt supersedes pre-binding PENDING markers for QA purposes; Engineer and Architect records remain historical and unchanged.

## cyph-payment-portal-dev-v1

- rev-parse HEAD: `427bec6267b9777e9cb44f81c22d1396a495bc14`
- branch --show-current: `qa/apbm-007b`
- remote get-url origin: `https://github.com/ahmedmusawir/cyph-payment-portal-dev-v1.git`
- rev-parse --abbrev-ref @{upstream}: `origin/qa/apbm-007b`
- rev-list --left-right --count HEAD...@{upstream}: `0	0`
- ls-remote origin refs/heads/qa/apbm-007b: `427bec6267b9777e9cb44f81c22d1396a495bc14	refs/heads/qa/apbm-007b`

## cyph-v1-dev

- rev-parse HEAD: `c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea`
- branch --show-current: `qa/apbm-007b`
- remote get-url origin: `https://github.com/Cyberize-Group/cyph-v1-dev.git`
- rev-parse --abbrev-ref @{upstream}: `origin/qa/apbm-007b`
- rev-list --left-right --count HEAD...@{upstream}: `0	0`
- ls-remote origin refs/heads/qa/apbm-007b: `c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea	refs/heads/qa/apbm-007b`

Remote ls-remote tips equal local HEADs: both candidate commits are remotely available. Full initial inventories and baseline-to-candidate paths: evidence/preflight/01/git_inventory.json. No staged or unstaged product changes. Portal untracked preparation tree is deliberately excluded by the 17 November R-3 ruling; OwedBook clean. All source paths reconcile with r06 inventories (handoff_reconciliation.json); path coverage is not proof of byte identity to served engineering builds. QA will build fresh. No unexplained source paths found.
