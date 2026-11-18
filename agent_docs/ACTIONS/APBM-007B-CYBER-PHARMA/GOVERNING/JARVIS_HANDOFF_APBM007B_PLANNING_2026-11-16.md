# JARVIS lab handoff — APBM-007B planning

**Prepared:** 16 November 2026, Asia/Dhaka  
**From:** JARVIS, APBM-007A architecture lab  
**To:** JARVIS, new APBM-007B planning lab  
**Status:** Planning handoff only. 007A final closeout is on its way. No 007B implementation or deployment release is granted by this document.

## 1. Read this first

Tony is opening the new lab to plan 007B while Friday completes independent QA of 007A. Keep this lab moving on scope, source review, business questions and recon preparation. Do not wait for closeout to begin useful planning. Do not touch the active QA checkouts or shared environments merely because a new lab exists.

**The final 007A certificate, cleanup acceptance, closeout and merge receipts will arrive as a supplement. They have not been received in this architecture lab.** Until supplied, do not describe 007A as certified, merged or deployed. Bind 007B implementation to the actual merged baseline after those receipts arrive, not to a guessed future SHA.

Tony wants staging by Monday, 23 November, subject to successful engineering, QA and deployment verification. This is a planning target, not evidence of feasibility or permission to waive requirements. Keep target dates out of executor prompts unless Tony requests them. Provide an evidence-based forecast after 007B recon. The standing ruling is **no deployment before 007B**: finish and merge 007A, finish and merge 007B, then deploy the combined release and verify the deployed system.

## 2. People and working style

- Tony: Director; controls scope, risk acceptance, credentials and Git mutations.
- JARVIS: Chief Architect and Tony's right hand; owns architecture, contracts, bounded repairs and closeout instructions.
- Friday: current independent QA Lead; owns test-plan approval, adjudication, retest direction and certification. Architecture review is a separate responsibility when assigned.
- Claudy: engineering executor for the current 007A work.
- Cody: independent QA executor for the current 007A campaign.
- Coach: partner and purchase-flow acceptance stakeholder.
- Frank: pharmacy domain authority and final billing-rule approver.
- Heather: support contact/escalation and later calculation-review stakeholder.

Seats persist when models change. Do not reverse current assignments because an older memory describes a previous module. Tony wants plain English, baby mode, exact next steps, and commands/prompts in fenced code blocks. Prefer action and continuous authorized work. Avoid unnecessary checkpoints, optional assurance work and repeated requests for decisions already made. Explain real blockers concretely. Never use Canvas.

## 3. Mandatory operating doctrine — read before instructing

Read actual project sources, not summaries, before directing workflow:

1. APBM_PLAYBOOK_v1_0.md.
2. QAM_PLAYBOOK.md, entire document.
3. QA_PLAYBOOK.md, applicable evidence, adjudication and certification rules.
4. RRM_PLAYBOOK.md, especially sections 4, 7, 9, 10 and 12.
5. ARCHITECT_PLAYBOOK.md and ENGINEER_PLAYBOOK.md as applicable.
6. Current module entry, state, rulings and governing snapshots.

This lab made a serious process error: JARVIS instructed repairs to return to engineering branches and described QA branches as disposable. Tony corrected it; the playbooks explicitly agree with him. Those instructions are withdrawn.

**Correct branch lifecycle:** build on engineering branch → Director commits candidate → Director creates QA branch at that commit → authorized Engineer repairs on the QA branch → Director commits → independent QA re-pins and retests on that same QA branch → Lead certifies → governed cleanup and closeout → Director merges the certified QA branch into main. No routine return to the engineering branch. One active writer per checkout; changing seats is not changing branches. RRM section 7 explicitly prohibits transferring repairs back as the normal workflow.

**Correct execution lifecycle:** E1 recon, E2 continuous engineering, Q1 independent recon/test plan, Q2 continuous approved QA. Q1 approval and Q2 release are real gates. Repair and retest are conditional after adjudication, not an excuse for endless campaigns.

QAM section 10: an isolated product FAIL is recorded and unaffected checks continue unless a genuine approved stop condition applies. Mark dependent cases blocked, continue safe unrelated work, and return consolidated findings. Do not stop for every bug. Wrong identity, missing authority, unsafe effects, privacy exposure or an invalid instrument still require stopping affected work. Never hide a legitimate stop to claim one-shot success.

Engineering does not certify itself; QA does not silently repair product code. Bind product, execution, evidence, closeout and merge identities separately. Reuse unchanged evidence with provenance and impact reasoning; do not rerun passed work just for packaging.

## 4. Program scope and current priority

The eight-phase program includes database-backed OwedBook, reference data, ingestion/normalization, math, PDF/report delivery, subscription/account lifecycle and production cutover. Phase 7 was brought forward to create a usable customer journey before the remaining math/report integrations.

007A is "money in": first-store registration, payment, provisioning, access and billing.
007B is "grow the account": paid Add Store, store-admin/member invitations and actions, ownership transfer/recovery, and explicitly carried obligations.

007A/007B do not by themselves deliver the full OwedBook math engine, processing against the golden dataset, Liberty/MediSpan integration or report PDF generation/email. Auth access email is included; report delivery is a different later scope. Synthetic/public data only; do not load real claims. Existing golden-data references are not permission to ingest real data.

## 5. Repo and environment map

| Surface | Actual location / identity | Notes |
|---|---|---|
| OwedBook | /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev | Canonical migration chain and 007A module |
| Payment Portal | /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 | Separate app; Stripe secrets stay here |
| Canonical 007A module | OwedBook agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/ | Read current state and rulings |
| Portal module pointer | agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA_POINTER.md | Not a duplicate module |
| DEV Supabase | yrsuwikjnbmvpznrgydb | Existing shared DEV, no reset |
| SCRATCH Supabase | ihgcsrypblqkwommrkgj | Separate cluster, rehearsals only within approved effects |
| Local apps | OwedBook :3000; Portal :3001 | Separate app sessions; automatic handoff |
| Staging | owedbook.cyberizedev.com; owedbook-payment.cyberizedev.com | Planned combined release; current DNS/runtime must be verified |

The portal remote was confirmed under ahmedmusawir/cyph-payment-portal-dev-v1. Tony accepted using it for now and moving it to Cyberize-Group later. Do not revive that transfer as an automatic blocker. The original FFM repo is cyph-stripe-subscription-portal-v1 and is preserved separately. Do not mistake it for the active portal. The Stripe learning repo is reference only.

Do not run inherited deployment scripts blindly: pre-007 recon found an old staging-service target. Retargeting and verification belong to the eventual authorized deployment preparation.

This handoff is written from conversation receipts and supplied artifacts, not direct access to Tony's machine. Verify current disk state read-only when authorized. The ChatGPT scratch filesystem is not Tony's VM.

## 6. 007A baseline and implementation history

Original engineering bases: OwedBook bc4e4336f80d2e8cdbb628d4de29d08f8fc95694; Portal c89572a45210e7d6f098c2878cfabe9a1c5326f1.

Migrations 0053–0060 were applied to DEV and verified. Ledger: 60 names/checksums equal to the manifest. SCRATCH fresh/upgrade/forward-resume rehearsals exist. Preserve the applied SQL; future changes require new forward migrations in the OwedBook chain. Never run the portal's old independent SQL as an alternative chain.

DEV apply evidence reports preservation of existing data/Auth users and indexes; access hardening and owner-only billing were checked. Full restore was NOT PROVEN. Tony accepted option B: logical export plus preservation/forward-recovery evidence, with explicit limitations. Do not reopen optional PostgreSQL installation/full restore as a surprise 007B prerequisite. Evaluate any genuinely new migration risk specifically.

Last fully committed candidate pair received here before the latest repair:
- OwedBook: 37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40.
- Portal: 9d938f62bff6172f9332ae6c67775e4b8feea379.
- Portal prior webhook-repair product commit: 9322405fe0238882c21c75ef62733fc8c732fed0.

These are historical QA candidates, NOT the final 007B implementation baseline. Both QA branches are qa/apbm-007a. Latest repair commits and final merge SHAs are pending in this lab.

## 7. Current 007A QA and repair checkpoint

Friday adjudicated Q2 a01 FAIL on the pair above. Package SHA-256:
8680ff27dad448515633dc2ec675ce86afb7e7365e2a1cae4f8a0fdee07747f9.
This architecture lab checked its ZIP fingerprint, CRC and all 205 indexed file sizes/hashes.

### F-Q2-001 — registration navigation, HIGH

Valid owner and pharmacy details saved, but a fresh registrant returned to /register/owner instead of review. It blocked payment/provisioning and dependent paid-owner proofs. Cause confirmed by engineering: PharmacyStepView cleared temporary owner details before navigation finished while its loaded draft was stale/null. The guard redirected backward. The old test only checked router invocation, not the final rendered destination.

Engineering repair reports adopting the saved draft before clearing, and preventing the stale guard after save success. Incomplete-draft protections remain. Adjacent owner/review/activation transitions were inspected.

### F-Q2-002 — undo both cancellation fields

The previous if/else-if handled only one of cancel_at_period_end and cancel_at when both were set. Independent mutable-provider testing failed the explicit both-clear contract; live reachability was not established.

Engineering repair clears flag if needed, retrieves, clears date if still present, then retrieves again. It handles provider auto-clear, partial failure and retry; fresh idempotency keys; never sends incompatible parameters together.

### Latest engineering report, not independent certification

Both fixes were built/tested in disposable copies: 429 tests, typecheck clean, lint zero errors with existing 24 warnings, production build and bundle scan passed, seven regression controls caught. Production browser on temporary port 3101 reached review showing $99; refresh and edit/back/return preserved correct details. No Checkout/payment was attempted.

Reported effects: one synthetic DEV draft, three saves, three quotes and one synthetic NPI hold. No Auth identity, email, Checkout, payment or Stripe mutation. Draft retained abandoned; no unsolicited cleanup authorized.

Tony approved temporary engineering production servers on 3100/3101 in disposable copies only. Engineering reports its 3101 server stopped; QA servers untouched.

**Latest explicit update:** five tested portal files have been applied to the actual qa/apbm-007a checkout and match tested/proof copies byte for byte. Commit handoff was rehearsed. Review package was still being built. No latest repair commit receipt has been supplied here. Do not invent the fifth filename from a truncated message; obtain the final manifest.

Next: Tony commits on QA branches → Friday receives repair ZIP and exact new pins → Cody independently retests → Friday adjudicates/certifies → cleanup/closeout/merge. Tony intends to bring that certificate and cleanup status back to the old JARVIS lab for final closeout.

## 8. What has and has not been proved

Earlier engineering DEV proof used an existing OWNER_1 identity: paid $89.10 after the APA10SANDBOX 10%-once discount, one account/store/admin, mirrored subscription, handoff both ways, explicit user switching, global logout, owner-only billing, cancellation and undo.

Initial Checkout/invoice webhooks failed because a duplicate environment variable selected an old signing secret. Provisioning succeeded through the status-page reconcile path. Later signed subscription-update events proved cancellation and undo through the ledger and mirror. Do not translate this into complete DEV Checkout/invoice webhook proof.

Before the latest repair, independent Q2 reported clean identity/builds, ledgers 60/60, privileges, webhook signature negatives, SQL grace checks, NPI concurrency, banner/responsive themes, reminder-record dedupe, multi-browser handoff, cookie isolation, redirect attacks and logout. It reported zero payments, emails and new identities in that attempt. The core purchase journey remained blocked; its failures were not waived.

Friday owns outstanding retest coverage, including actual owned live deliveries, new-owner/declined/signed-out purchase journeys, security negatives, sample loader and UI matrices. Fault recovery is approved for the candidate handler in-process against real SCRATCH DB with mocked provider; actual owned delivery comes from DEV journeys. Do not inflate mocked-provider evidence into live Stripe proof.

Carried certification limitations include reused AC-004 rehearsal evidence, restore unproven, real-Auth crash gap, Mission Control app not run, JWT residual, and unfinished public-facing copy. Final certificate may change these; reconcile it when received.

## 9. Locked architecture and business rules

### Identity, authority and store model

One account owns many stores; one subscription per account. Owner remains platform member, not platform admin/superadmin. 007A appoints owner as the initial store admin. 007B adds alternate admin and staff management.

Owners read all stores in their own account. Store admins manage members only for their store. Members do not control billing or create stores. Owner billing rights must not follow merely from store-admin membership. Preserve tenant and protected-field restrictions in every new server function.

NPI is required, checksum-valid at input and unique system-wide. Stable internal store ID anchors records; NCPDP optional metadata. NPI is identification, not proof of ownership. Duplicate NPI routes to support rather than another store. Preserve atomic reservation/concurrency protections.

### Pricing and lifecycle

Single graduated Stripe price passed E1: $99 first store, $49 per additional store monthly; three stores $197. One subscription item, quantity tracks billable stores under the approved lifecycle contract. Do not revive two-price environment variables or redesign the catalogue without evidence.

Add Store business direction: disclose server-computed charge, get explicit owner consent, charge remaining current period, activate only after confirmed payment; failure leaves existing stores usable and the new store pending. Confirm pending business details and exact proration/discount/invoice behavior before implementation; historical direction is not a complete API contract.

Store removal is scheduled for paid-period end; preserve records and reconcile quantity/access timing. Store sale/transfer is support-assisted, buyer uses their own account and billing, no transfer of seller's card/subscription. Historical-claims access for a buyer was open; never infer authorization from stable internal IDs.

Seven days normal access after failed renewal, then read-only; billing recovery remains available to owner; records never deleted for billing. Cancellation at paid-period end, undo before it ends, same subscription. Grace must not reset through cancellation/recovery manipulations.

APA pricing uses a server-allowlisted promotion code, no membership-verification service. Sandbox fixture is labelled 10% once, whole invoice. It is not a finalized production discount policy. No free trial, in-app refunds or extra discounts authorized by this handoff.

### Auth

Automatic destination-initiated handoff works locally and on staging. Separate host-only app cookie names; no parent-domain shared cookie. Single-use short-TTL audience/state/verifier-bound code, hash-only storage, atomic claim, live session validation and exact return allowlists.

Mint destination session only at redemption; never store provider tokens. One automatic collision restart then recovery; clear rate-limit state; pending codes invalidated at logout. Failed handoff revokes only just-minted session, not all user sessions. Deliberate account-switch button required when destination user differs.

Email-link GET does not redeem; explicit button POST does. Keep actual email delivery separate from generated-link browser tests. Google OAuth is deferred, not part of current signup authority.

Provider-wide logout affects other apps/devices; direct data API JWT may remain valid up to its expiry even when guarded app routes reject. Mission Control runtime coverage remains a carried gap unless final QA closes it.

### Webhooks

Server authoritative Stripe retrieval and raw-body signatures; never trust browser return as proof of payment. Durable ledger, idempotent provisioning, visible recovery.

F-Q1-01 repair prevents missing mappings/busy/unsettled events becoming silently final. Unfinished work returns retryable failure; ownership needs trusted evidence. Duplicate unfinished events retry. Operator --list/--event recovery retains audit history. Preserve these behaviors when adding quantity changes, invoices or store operations. No 200 acknowledgement of lost unfinished work without durable responsibility for retry.

## 10. Explicit 007B carry-forward obligations

A1 recorded the following Director decisions:

- **O-1:** test-clock seam and live failed-renewal/seven-day-grace journey deferred to 007B. SQL/unit checks remain in 007A; live journey NOT RUN BY DIRECTOR RULING, never passed. Must be proved before production billing.
- **O-2:** reminder-email delivery deferred. Banner plus renewal_reminder notification record required for 007A. The module carry-forward record tracks email for 007B; confirm its exact acceptance and delivery scope in 007B planning, do not lose it or call it completed.

Important reporting correction: r01 claimed banner plus record, but only banner existed then. r02 added one pending renewal_reminder row per failed invoice, no email. Do not repeat the original inaccurate claim.

Other inputs for 007B: Add Store, invite/admin/member actions, one-admin invariant, sole-admin recovery, ownership transfer/recovery, support workflows and removal timing. This is the scope starting point, not a frozen exhaustive implementation contract.

## 11. Questions to settle together during planning/recon

- Which exact invite, replace-admin, revoke-member and recovery actions are in 007B? Who can do each, with what audit and last-admin protection?
- Existing versus new invitee, invitation expiry/replay, cross-tenant acceptance and account-switch handling?
- Add Store invoice/proration, APA discount interaction, pending payment, abandon/retry and duplicate-event recovery?
- Remove-store schedule, undo, last-store policy and quantity/access reconciliation?
- Store sale/history access and support authority; which operations are implemented versus a documented support procedure?
- Test-clock seam and authorization: isolated sandbox test customers/subscriptions, controllable time, grace/read-only/recovery proof without production bypasses?
- Reminder-email sender, timing, dedupe, retry, actual inbox proof and cancellation after recovery?
- Placeholder support/Terms/Privacy and price-change wording: support@pharmacybooks.com is the agreed address; Terms/Privacy need supplied content and Coach reviews consent wording. No fabricated legal text.
- Read current final 007A certificate for additional obligations or newly closed gaps.

Aggregate decisions. Do not ask Tony one tiny prerequisite at a time or relitigate settled fundamentals. Do not quietly drop transfer/staff/recovery scope merely to hit a date.

## 12. Environment and budget lessons

DEV and SCRATCH session poolers on port 5432 were verified. Transaction pooler 6543 worked for reads but was replaced for migration-tool compatibility. Use the recorded project identity, not just connection success. DB password URL encoding matters; never print secrets.

Auth SMTP uses Resend with sender Cyber Pharma <no-reply@cyberizedev.com>; delivery was observed. DEV URL/template settings use explicit localhost branches today. Staging needs its own allowlists, email-template branches, Site URL decision and token-lifetime decision. Verify staging readiness; local success is not deployed acceptance.

Both apps need correct distinct local site/API URLs. Duplicate environment keys caused a real failure; inspect resolved precedence safely, not just first matching line. Stripe CLI OAuth can expire and its listener secret differs from a Dashboard endpoint secret. Staging requires a real endpoint and its corresponding secret, not the local CLI value.

Do not carry old E1/E2 ceilings into 007B by assumption or reuse exhausted allowances. Plan one complete effect capsule for engineering and one for QA: sessions, identity creations, emails, sandbox customers/checkouts/subscriptions, test clocks, reads/writes, migrations and SCRATCH cycles. Count dispatch attempts and retries accurately. Investigate predictable request volume before freezing tiny caps.

Reserve a genuinely new controlled inbox for new-owner QA; generated links and existing Auth users do not prove new identity creation. The one extra DEV identity approved in 007A is not automatically an unlimited 007B allowance. Obtain current usage from final receipts.

## 13. Lessons that must shape 007B

1. Read playbooks before issuing process instructions; they are operating rules, not decoration.
2. One active writer; fixes stay on QA branch after handoff. No avoidable branch/worktree choreography.
3. Q2 runs to consolidated completion where safe. Do not interrupt for each product failure.
4. Engineering handback must include production-build browser happy paths, not dev-only or router-mock assertions.
5. Verify final destination/state across real transitions; a requested navigation can still lose a race.
6. Preserve distinct evidence layers: unit, real DB/mocked provider, actual provider, live UI and deployed verification.
7. Payment and event recovery must handle early, duplicate, out-of-order and busy states.
8. Test cancellation field combinations and partial retries; fresh logical actions must not replay cached provider answers.
9. Protect actual mail endpoints with validated test guards; an E2 stub mistake dispatched six unintended requests to example.invalid addresses. Do not let a test harness consume real email budget unexpectedly.
10. Bundle related decisions and repairs; preserve limits without endless approvals.
11. No surprise restore installation or optional assurance detours. State necessity and cost before adding work.
12. Scoped staging, exact manifests, fail-closed subshell commands; no placeholders or blanket git add.
13. Package automatically with indexes and hashes. Never make Tony hunt evidence across temp folders.
14. Keep campaign progress and reusable doctrine lessons distinct and attributable. No fabricated certificate, journal update or closure.

## 14. New lab's immediate assignment

Start by acknowledging this is 007B planning while 007A final closeout is on its way. Read the listed governing/project sources. Produce:

1. A concise confirmed-scope versus open-decision map for 007B.
2. A grouped business/technical question list limited to actual unresolved choices.
3. A read-only E1 recon brief that respects the active 007A QA ownership boundary.
4. A proposed coherent 007B module structure with embedded QAM from authoring, acceptance coverage and effect-budget preparation.
5. An honest staging-readiness forecast after evidence; no guaranteed date now.

Planning can begin immediately. Application edits, shared-target mutations, new branch creation, migration applications, deployments and 007B E2 are not released by this handoff. Use the project doc set to establish current scope; dated source conflicts must be reconciled, not silently adopted. No new source upload is needed for files already available in the project.

## 15. Closeout supplement expected from the old lab

Replace pending values only when actual receipts arrive:

| Required receipt | Status at this handoff |
|---|---|
| Latest five-file repair commit and records commits | Pending |
| Final retest candidate pair and results | Pending |
| Friday's final Gate Q certificate and qualifications | Pending |
| Director walk / business acceptance observations | Pending |
| QA cleanup acceptance and retained evidence | Pending |
| Architect closeout and closeout commit identities | Pending |
| OwedBook main merge SHA and remote receipt | Pending |
| Portal main merge SHA and remote receipt | Pending |
| Final 007B carry-forward register | Pending reconciliation |
| Current environment/effect usage relevant to new work | Pending final readout |

The old lab remains responsible for 007A closeout. The new lab should not duplicate it or assume it complete. Once the supplement arrives, reconcile the scope and baseline before implementation release.

## 16. Source order and supersession warnings

Primary planning source: APBM007_DECISIONS_2026-11-11.md for 007A/007B split and business decisions; read with current Director rulings. Historical eight-phase plan v3.0 gives wider scope but its proposed release order was changed. Latest Director direction delays deployment until after 007B and supersedes older "ship with 007A" text.

Q2 a01 adjudication and actual QA package govern the failed candidate. Latest engineering repair is a claim until independently retested. The final certificate/merge supplement will govern baseline readiness.

Historical documents and memories may still say shared cookies, two separate prices, portal staff-only access, migration ledger 52, personal remote must move immediately, or disposable QA branches. Those statements are superseded as described above. Preserve history; do not use it as current implementation authority.

### Suggested opening message for the new lab

> You are JARVIS, continuing Cyber Pharma as Chief Architect. Read this entire handoff and the applicable project playbooks before planning APBM-007B. APBM-007A final QA/closeout and merge receipts are on their way; do not assume certification or merge. Start 007B scope reconciliation and grouped recon preparation now, without disturbing the active QA work. Use the continuing-QA-branch and continuous-Q2 rules. Give Tony the next concrete planning step in baby mode. No implementation or deployment release is implied.
