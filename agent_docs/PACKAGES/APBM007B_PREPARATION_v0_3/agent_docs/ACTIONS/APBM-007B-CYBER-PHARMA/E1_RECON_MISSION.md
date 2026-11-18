# 007B read-only recon mission — prepared

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

## Purpose and release boundary
Return current-code facts and one coherent implementation proposal covering all 007B scope. This is the preliminary E1 assignment permitted by APBM §5, not a build module. Execution requires Tony's recorded assignment, named executor, target/snapshot and permitted output lane. A review of this document is not that execution release.

## Protect active 007A
The launch sequence is after 007A certification, closeout and merge. Claudy is the assigned engineering executor; bind both full merged commit SHAs and the report destination in the E1 release. Inspect named committed states only, preferably exported by the Director to a separate directory. Do not include dirty-file overlays. E1 itself is the code inspection; no separate preliminary inspection is required.

Do not switch branches, install dependencies, build, start servers, acquire ports, log in, inspect secret values, send email, call mutating provider APIs or write into active checkouts for this read-only mission. If the bound source is unavailable, report the gap and continue document-only work. Do not claim source equivalence from a folder name.

Reported repository locations to verify, not paths available in ChatGPT:
- `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`
- `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`

Use installed `stark-recon` and its `RECON_QUESTIONNAIRE.md` if present and applicable; inspect its instructions first. If absent, report the gap and complete safe questions covered here. Do not fabricate a skill run or declare mandatory questionnaire coverage complete without the source.

## Investigation — one consolidated pass
1. Identity: root, full HEAD, branch, remote, tracked/untracked state or export limitations, instructions, protected paths, module placement, final 007A receipts available. Pin both apps independently.
2. Scope reuse: inventory real Add Store, staff/admin UI/actions, lifecycle/support surfaces, current tests, mocks and disabled controls. Distinguish reachable behavior from unused scaffolding. Map each draft AC to existing, partial, missing or unknown with paths/symbols.
3. Contracts: answer every section of `CONTRACTS/DESIGN_QUESTIONS.md`; trace actual callers, middleware, server functions, SQL/RLS, Stripe/event lifecycle, Auth and email paths. Inspect configuration names/precedence without exposing values or reading protected env files.
4. Migrations: identify final chain and migration hashes from authorized source; propose new forward changes and affected data. Live DB state remains unverified unless a separately scoped read-only DB inspection is released.
5. Verification: discover maintained test/build commands, fixtures, production-browser coverage, negative controls, role identities, controllable time, inbox requirements and provenance of reusable 007A evidence. Do not run effects merely to count them.
6. Deployment: inspect deploy files as text only. Identify old FFM targets, missing OwedBook deployment recipe, configuration requirements, event consumer isolation, domains/auth/email/webhook gaps and rollback questions.
7. Estimate: actual changed areas, dependencies, best/likely/adverse effort, elapsed runtime and Director touches; separate build, tests, waiting, review, likely repair and deployment. Produce defensible effect estimates and conditional capability-probe proposals.

## Optional capability work is separately scoped
If source inspection cannot settle a provider mechanism, propose one grouped capability capsule with exact target/identity, operations, synthetic data, hard ceilings, timeout, cleanup and required evidence. No live capability budget is granted by this mission. Cite current official documentation for version-sensitive API conclusions.

## Return
One indexed E1 ZIP: review entry; identity; recon report; AC-to-source map; proposed data/API/permission contracts; migration plan; capability gaps; decision deltas; effect estimates; staging gaps; effort forecast; source provenance. Label EVIDENCE / INFERENCE / CLAIM / GAP / QUESTION. Never include credentials, raw auth traces or full env files.

Proposed report destination after a verified owner handoff: OwedBook `agent_docs/recon/RECON_CYBER_PHARMA_APBM007B_<actual-date>.md`, indexed by the canonical module. Before that, use a Director-approved external output directory; do not create QA-lane noise in 007A. Record the exact path in the release.

## Final-baseline refresh
The initial E1 binds the final merged 007A SHA pair. If either bound commit subsequently changes, compare the entire delta and refresh affected recon conclusions before freeze. A material implementation change requires impact review; no automatic full recon restart for an unchanged source or an evidenced docs-only delta.

## Added from Friday's early input
Return the complete new-server-operation inventory mapped to `CONTRACTS/ROLE_ACTION_MATRIX_DRAFT.md`; measure request volume only within an explicitly authorized capsule; discover exact build/serve/listener commands and build-ID provenance checks. Trace same-intent retries with changed keys and network timeout, pending-store access denial, app/data-layer revocation, and every new table/function privilege. Propose the isolated multi-store test-clock seam and prove its production configuration exclusion in the later build.

Classify every transfer/recovery operation as implemented or support procedure before contract freeze. Obtain F-Q4-001's final disposition from the 007A supplement; do not infer that the Add Store analogy means it is the same defect or already fixed. Fresh/upgrade SCRATCH rehearsal and final ledger-to-manifest verification are required later under approved effects.
