# 007B Architect risk input for independent QA

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

The table below is Architect risk input. Friday’s separate supplied early requirements are now incorporated through `../QA_INPUT_RECONCILIATION.md` and the additions below. Her source is preserved unchanged under `../GOVERNING/QA_LEAD_REQUIREMENTS_APBM007B_2026-11-16.md`. This is not independent Q1 plan approval or a complete architecture review.

## Architect risk input

| Risk | Required challenge | Draft ACs |
|---|---|---|
| Additional-store failure harms existing stores | Decline, payment authentication, delayed invoice/event, retry and cancellation interaction | 003–009 |
| NPI/payment races | Two accounts reserve same NPI; repeated confirmation and duplicate/out-of-order webhook | 002,004,006–008 |
| Privilege escalation | Owner/admin/member/unrelated-owner direct API and protected-field attempts in both apps | 001,010,017 |
| Invitation identity confusion | Existing/new/wrong signed-in user, revoked/replayed/expired link, resend and account switching | 011–013 |
| Admin orphan or double admin | Concurrent replacements, pending invite, revoke/self-removal and recovery | 014–016 |
| Cutoff/billing mismatch | Store removal, undo, last store, renewal and simultaneous add | 018–020 |
| Transfer leaks old data | Two accounts, preserved store identity, historical claims, seller receivables, stale sessions | 021–024 |
| Grace proof simulated away | Real sandbox failure/events, app/provider time coherence, seven-day boundary and recovery | 025 |
| Email record mistaken for delivery | Controlled inbox proof, retries, suppression after payment, dedupe and unintended recipients | 026–027 |
| Navigation race recurs | Production build reaches final intended rendered state after save/refresh/back | 028,030 |
| Migration regression | Forward rehearsals, preserved existing rows/users, constraints/RLS and privilege negatives | 029 |
| Local success mistaken for staging | Exact deployed revisions, origins, permanent webhook and actual mail paths | 032 |

Preserve evidence levels: unit; real DB with mocked provider; actual provider; actual inbox; real browser; deployed environment. One level cannot silently substitute for another. Full required regression and justified final-candidate live checks remain. Use privacy/instrument controls and honest coverage reductions.

## QA Lead standing requirements
1. Every new implemented journey has an engineering happy-path walk on a production build, checking final page and stored state.
2. Q1 and Q2 each begin with the basics check in `QAM_PREFLIGHT.md`; report missing basics to Tony immediately, before other work. Block only affected checks, preserving the continuous-Q2 rule.
3. One-time new-identity, payment and email journeys run on the final repaired candidate, after earlier repeatable checks and required repairs. If a later finding changes product bytes, Friday decides final-candidate coverage and budget impact; never silently reuse or repeat spent effects.
4. One grouped Director session near Q2 end. Other human checks must be declared by the plan.
5. One measured QA effect capsule with controlled inbox cast, explicit isolated test-clock authority and default-on validated mail guards; no inherited 007A allowance.
6. Poison and clean controls for every negative test and privacy scan before effects are spent.
7. Preserve labeled unit, real-DB/mocked-provider, real-provider, live-browser and deployed layers. Real inbox observation remains distinct from generated-link tests.
8. Automatic indexed packages at returns; continuing QA branch and one active writer; product FAIL alone does not stop unrelated safe work.

Additional risk detail: pending stores expose no data; Add Store new-key retry and network timeout keep one operation/customer/charge; acceptance GET cannot redeem; wrong-user invitation requires deliberate switch; membership removal is tested at app and data layer with token residual measured. Grace tests use a multi-store account and a production-inaccessible time seam. D-05 approves failure and pre-read-only notices, each type at most once per failed invoice; the exact pre-read-only offset remains due at freeze; retry safety and no send after recovery remain required. Test every new table/function across two accounts. Preserve all 007A unfinished-event recovery behavior for new event types.

The QA Lead standing requirements incorporate `../GOVERNING/QA_LEAD_REQUIREMENTS_APBM007B_2026-11-16.md` unchanged by reference (SHA-256 `8448a9b3cb1e1e07ab9e7949ae8d15b059deb9b80e15f32f3e1f2e6f570a4a77`). The earlier risk table is Architect risk input. Friday clarified dedupe per notice type per failed invoice; Director decision 4 approves the failure and pre-read-only notices with recovery suppression. No early requirement is silently waived.
