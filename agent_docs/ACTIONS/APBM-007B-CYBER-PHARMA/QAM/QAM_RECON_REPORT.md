# Q1 recon — Cody, 2026-11-17

Candidate pair: cyph-payment-portal-dev-v1 427bec6267b9777e9cb44f81c22d1396a495bc14; cyph-v1-dev c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea. See HANDOFFS/CANDIDATE_PAIR_2026-11-17.md for authoritative QA binding. Historical state says QA branch not created; current Git and Tony's explicit Q1 release supersede that prerequisite. No Engineer-owned manifest or contract was edited.

## Readiness and evidence limits

PF-00 first: engineering handoff says proof processes stopped, no listener/endpoint and no automated inbox access. Candidate runtime identity/listener/inbox readiness is BLOCKED, not inferred from old build IDs. No sign-in or provider probes performed. Continue safe inspection under Tony's Q1 release.

All twelve manifest hashes mismatch current files (exact expected/actual in evidence/preflight/01/contract_hashes.json). STOP-CONTRACT affects binding of execution expectations; draft below uses current candidate text provisionally. Architect must reconcile authored hashes and approved amendments; QA does not repair contracts. This is not a product FAIL or certification.

Private file exists, ignored and untracked; declared schema absent. Missing variable names: INBOX_ACCESS_FILE, INBOX_ADAPTER, QA_RUN_ID, ROLE_EXISTING_INVITEE_EMAIL, ROLE_EXISTING_INVITEE_PASSWORD, ROLE_FOREIGN_OWNER_EMAIL, ROLE_FOREIGN_OWNER_PASSWORD, ROLE_MEMBER_EMAIL, ROLE_MEMBER_PASSWORD, ROLE_NEW_ADMIN_EMAIL, ROLE_NEW_ADMIN_PASSWORD, ROLE_NEW_MEMBER_EMAIL, ROLE_NEW_MEMBER_PASSWORD, ROLE_OWNER_A_EMAIL, ROLE_OWNER_A_PASSWORD, ROLE_OWNER_B_EMAIL, ROLE_OWNER_B_PASSWORD, ROLE_STORE_ADMIN_EMAIL, ROLE_STORE_ADMIN_PASSWORD. EMAIL maps role and intended recipient; PASSWORD only for password-login roles; new invitees remain unused. INBOX_ADAPTER and INBOX_ACCESS_FILE enable real inbox observation; QA_RUN_ID isolates all effects. Do not substitute engineering cast or copy private values into app/build env.

## Implementation recon

Portal storeOperations/storePricing implement standalone invoice saga and reconciliation; webhook routes operation invoices separately from renewal grace. SQL 0061–0069 in OwedBook owns NPI/ownership, invitation locks, clock context, notices, audit and privileges. staff/invitationMail implement scoped acceptance and privileged mail boundary; history endpoints expose ownership-scoped reads. Inspect guards and state transitions independently in Q2; source presence is no behavioral proof.

r06 records real crash S1 in-flight pay and S2 hosted payment while down; both recovered by owner polling. These are engineering claims, not QA results and not automatic webhooks. r05 DEV apply receipts claim ledger69, preservation and DEV clock exclusion; Q2 must independently compare ledger/catalogue without repeating apply. r01–r04 provide CP1/CP2, live lifecycle, invitations and transfer support. Engineering's cleaned provider fixtures and stale mirrors cannot be reused as healthy QA fixtures. Final Portal browser regression was not rerun; plan requires full candidate regression.

007A limitations (restore, real Auth crash, Mission Control, residual session/token qualification) remain separately labelled; no inherited PASS. generateLink library-name hit is the narrow approved baseline exception, not a secret-scan bypass. BP02 minimum-price guard applies to add/removal/undo, often earlier than 90 minutes. Decision9 paid same-owner restoration is approved; buyer history remains denied.

## Consolidated blockers / decisions

1. Architect/JARVIS: reconcile all twelve contract hash mismatches with exact authorized bytes and approval provenance. Recommendation: corrected factual manifest by owning seat, retain old hashes/history; Friday reviews any semantic delta before Q2.
2. Tony: supply separate QA role/inbox schema above, exact sandbox account/price, SCRATCH keys and operator identity privately; verify recipients new/existing and allowlist in both apps. Recommendation: eight distinct role contexts, controlled new recipients reserved until final candidate; adapter access or declared grouped manual inbox session.
3. Friday: review this complete draft, effects capsule and Gate D split; bind approved plan SHA to both commits. Recommendation: exact amendments where needed; no execution approval inferred here.
4. Tony: separately release Q2 after contract/readiness resolution; approve fresh bounded capsule, local Stripe listener and session-only signing secret. Recommendation: no shared provider settings changes; never reopen E2 ledger.
5. Tony/Gate D: authorize permanent staging HTTPS webhook destination, exact events/account/secret, scheduler, Auth redirects and mail domains in a separate release. Recommendation: staging delivery/outage retries and revision pair are mandatory GD001; local forwarding is insufficient.
6. Friday/Tony: external full-refund/credit proof for paid-operation-close needs an approved sandbox fixture or separately authorized external refund. Recommendation: no refund creation in default capsule; block only that provider closure subcase until supplied. Support identity-verification procedure graded separately; shared operator credential cannot prove individual sign-in.

Q1 did not execute product tests, create resources, send mail, mutate DB, change webhooks, or repair product. All ACs NOT RUN.

## Friday resolution, 2026-11-17

Consolidated decision1 reduced by QL-01 to two mismatches (line1 excluded); dependent tests held, unaffected checks not stopped. Exact diffs in evidence/preflight/02/. Manifest correction deferred to closeout, not Q2 gate. Friday exact amendments supersede earlier draft recommendations: refund subcase pending Director approval only, no second plan review, no Architect loop unless Engineering repair required. See approval and amended plan.
