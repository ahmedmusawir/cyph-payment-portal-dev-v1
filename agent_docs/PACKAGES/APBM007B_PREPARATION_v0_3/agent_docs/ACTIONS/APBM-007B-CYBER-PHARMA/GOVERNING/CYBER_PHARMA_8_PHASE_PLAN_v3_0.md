# Cyber Pharma — Eight-Phase Plan v3.0

## Final review draft 3 — OwedBook first, APBM execution, embedded QAM

| Record | Value |
| --- | --- |
| Date | 5 November 2026 · Asia/Dhaka |
| Status | FINAL REVIEW DRAFT 3 · D-1(a), D-2 and D-4 applied · Friday READY condition addressed · D-6 Director adoption pending |
| Chief Architect | JARVIS · he/him · this planning lab |
| Reviewing Architect | Friday · she/her |
| Director | Tony |
| Proposed successor to | CYBER_PHARMA_8_PHASE_PLAN_v2_0.md |
| First execution outcome | Phase 3 completion and Target One staging |
| Delivery method | APBM for bounded phases, QAM inside every new module |

JARVIS and Friday are persistent seats. Their identities and pronouns remain constant when the underlying model changes. Model assignments belong in technical execution records when relevant.

This draft consolidates the supplied campaign records, specialist briefs, delivery PDF, playbooks, and Tony’s November 5 direction. Friday’s November 5 readiness verdict is READY conditional on applying D-1(a), D-2 and D-4 with no other content changes. This revision applies those rulings and their consequential status, schedule and traceability updates. It becomes the replacement plan on Tony’s D-6 approval. Historical certificates, completed BIM/RRM identities, and the September client delivery document retain their original scope and dates.

Repository and database statements below are attributed to the supplied records. This planning lab has inspected those documents, rather than the application repositories or cloud environments. E1 must verify the current implementation baseline before an executable pack is frozen.

## Delivery brief for Tony, Coach and Frank

**First, testers receive OwedBook on staging.** Prepared accounts will open real database records for synthetic pharmacies. Testers can check access, store visibility, the OwedBook screens and agreed admin read views. Calculation values are prepared fixtures at this stage. The Target One delivery date will be published after APBM-003 recon, with the apply, QA and deployment work included.

**Next, we connect the Payment Portal while feedback arrives.** Owners will register, complete Stripe sandbox checkout, receive access, add stores and manage the approved account functions. A separate email/DNS readiness forecast will identify any dependency affecting that delivery date.

**Full staging acceptance follows the remaining import, calculation, reference and report workflows.** The inherited estimate is 35–47 working days of sequential product work; carrying the additional read-audit work gives approximately 36–49, subject to recon and scope decisions. Client review and external waiting add calendar time. The first OwedBook feedback release occurs earlier within that programme. Actual customer migration follows the separately approved production package.

## 1. Director brief

The immediate goal is to give Coach, Frank, and the pharmacy testers a working OwedBook staging release. They will sign in with prepared accounts, inspect stores and members, and use OwedBook against synthetic records stored in the development database. This first release uses prepared calculation values. Live claim ingestion and the new math engine arrive in a later milestone.

While testers review that release, engineering proceeds to the Payment Portal backend. The database foundation must already distinguish the customer account owner, store admins, members, and Cyberize internal operators. The owner controls the account’s subscription and manages its stores and their administrators and members through authorized operations.

The eight original phases remain the product scope map. APBMs package the remaining work into larger coherent engineering and QA assignments. A module may complete part of a phase or related obligations across phases. Every retained obligation remains traceable to its original phase and acceptance gate.

Frank’s contribution through PRs is parked as a delivery dependency. The existing contributor setup remains available. His immediate contribution is business decisions and acceptance, with Heather reviewing calculation results. Tony reports that desktop users are paused because of suspected incorrect results. This raises the priority of independent calculation validation and a controlled production migration path.

### Staging milestones

| Milestone | Testers receive | Acceptance boundary |
| --- | --- | --- |
| **Target One — OwedBook feedback release** | OwedBook and agreed admin read views on Cloud Run, real dev-database reads, synthetic fixtures, existing email/password login, prepared tester accounts and scenarios | Phase 3 controlled reads, ownership/store isolation, audited supported reads, clear unavailable actions, deployed verification |
| **Target Two — Commerce connected** | Existing Payment Portal frontend backed by Stripe sandbox, owner registration, provisioning, invitations, Add Store, subscription management and cross-app sessions | Full synthetic purchase-to-access and Add Store journeys, including retries and failures |
| **Gate One — Full staging package ready** | Both customer applications with agreed reference, import, calculation, administration, report and email workflows | Integrated synthetic journeys and independent deployed QA across the accepted Package One scope |

Target One and Target Two are incremental releases. The full Package One acceptance follows Gate One, client testing, consolidated feedback, bounded repairs, and Gate Two sign-off. Actual desktop-user migration belongs to the separately authorized production pilot.

## 2. Starting position

| Area | Reported completed work | Remaining work or evidence |
| --- | --- | --- |
| Phases 1–2 | Foundation, authentication, OwedBook frontend and admin demo | Preserve useful behavior and approved visual direction |
| Phase 3 | BIM-000, FIX-001, BIM-001, PROTO06, BIM-002 and BIM-003 recorded closed | Ownership delta, seed, dev apply, controlled read integration and Target One |
| Database | Migrations 0001–0047 reportedly certified on a disposable environment | The old repo’s dev baseline reportedly has none applied. Verify actual target before applying anything |
| RRM campaign | RRM-001–004 recorded closed, four Gate Q passes, public signup and Moose portal removed | Carry findings and regression obligations into successor contracts |
| OwedBook | Post-RRM service seam and 150 mock fixtures reported | 149 fixtures reportedly violate a locked money rule. Replace their source through a governed synthetic fixture generator |
| Payment Portal | FFM implemented, QA reported, staging deployment and login confirmed by Tony | Commerce remains simulated. Obtain original certificate, candidate binding, deployment receipt and Gate D disposition |
| Math | Five original rulings received, source formats profiled, 21 vectors reported, Heather review approach agreed | Obtain actual vectors/specs, reconcile remaining rules, prove historical inputs and implement the engine |
| Claim samples | About 65,000 claims across four pharmacy systems reported by the math lab | Confirm approved source access and handling. Previously destroyed working copies do not establish current file availability |
| Contributor pilot | Significant setup completed, per Tony | Parked as a dependency |

**Proposed authoritative repo.** Friday’s November 5 map names `cyber-pharma-dev-v1-phase-3`, with last reported main `5234abe`. Use that as the planning baseline. E1 obtains full current identities, confirms Tony’s repo designation, and checks for work in the parked pilot repo that must be preserved. The short SHA is historical evidence, not the future execution candidate.

**Environments.** Local work and approved disposable databases support engineering and QA. Shared dev Supabase and Cloud Run support synthetic staging. Production remains Vercel plus Supabase Enterprise under the September Director direction, subject to the required agreements, capabilities, procurement and launch checks. MissionControl has a separate internal access boundary.

## 3. The eight phases

| Phase | Product obligation | Current disposition | Remaining completion evidence |
| --- | --- | --- | --- |
| **1 — Foundation** | Starter foundation, authentication, environment contract and deployment foundation | Historically closed | Regression coverage for changes made later |
| **2 — Visual fidelity** | OwedBook and admin frontend contracts | Historically closed, with later RRM and portal FFM work recorded separately | Preserve accepted behavior, explicitly amend changed states |
| **3 — Schema, permissions, audit and controlled reads** | Account/store ownership, isolation, audit, synthetic seed and actual OwedBook reads | Active | APBM-003, shared-dev apply evidence, Target One Gate D |
| **4 — Reference data** | Effective-dated pricing/PBM inputs, history, normalization, refresh and monitoring | Pending | Minimal validated slice before engine integration, complete required pipeline in APBM-004 |
| **5 — Imports and reimbursement calculations** | Liberty and manual import, ruled calculations, computed views and validation | Pending | APBM-005 and controlled independent human validation |
| **6 — Reports, email and agreed onboarding sync** | Protected PDF reports, approved sends and per-store replies | Pending | APBM-006, with necessary auth email capability delivered earlier in APBM-007 |
| **7 — Subscriptions and administration** | Account subscription, provisioning, Add Store, invitations, operational administration and approved promotions/onboarding doors | Frontend milestone completed, backend pending | APBM-007 and explicitly routed retained requirements |
| **8 — Production hardening and rollout** | Production configuration, controlled live validation, release security, recovery, pilot and wider migration | Separate production package | Phase 8 readiness and release gates, named pilot and later rollout decisions |

Phase numbers identify obligations. The proposed execution order is **3 → 7 core → 5 with a Phase 4 reference slice → 6 → remaining 4 → integrated staging → 8**. Reference discovery and math proof begin alongside Phase 3. The order after Target Two is an Architect proposal for review.

## 4. Execution and QA contract

Each APBM follows four planned assignments.

1. **E1 — Recon and planning.** Investigate the current repo, runtime, database state, contracts, reusable evidence and actual blockers. Return one consolidated package. The Architect resolves findings and authors the implementation-ready contract and QAM. Tony approves the scope and permitted effects.
2. **E2 — Continuous engineering.** Implement the full released scope, perform internal checks, repair in-scope implementation failures, and complete the factual engineering/QAM handoff. Routine internal stages continue automatically. Required migration or identity checkpoints remain explicit.
3. **Q1 — Independent recon and test plan.** The QA Executor challenges the claims, establishes readiness and proposes the complete test plan. The QA Lead approves or amends it. Tony releases Q2.
4. **Q2 — Continuous independent execution.** Execute the approved campaign, preserve failures, and return evidence for the QA Lead’s adjudication. Accepted reworks become a consolidated engineering assignment with affected retest and the required regression.

One shot describes a coherent assignment and continuous execution. Interrupted sessions resume from recorded state. The number of messages, context windows, and genuine stops is recorded honestly.

The Architect supplies the QAM skeleton and acceptance contract before implementation. Engineering completes factual claims, commands, environment needs and limitations. QA independently authors its plan and evidence. The QA Lead owns certification. Friday’s architecture review and Tony’s product acceptance have their own scope.

### Governance adopted by this draft

- Use the supplied APBM and QAM processes for newly authored Cyber Pharma modules, subject to approval of this draft. Preserve the BIM-era protections for frozen contracts, migration discipline, tenancy and evidence.
- Use phase-numbered IDs under the Director ruling reported in Friday’s B-1 finding. APBM-003 covers Phase 3, APBM-007 commerce, APBM-005 imports/math, APBM-006 reports/email, APBM-004 references, and APBM-008 production. A second module in a phase takes a letter suffix such as `APBM-007B-CYBER-PHARMA`. The module root is `agent_docs/ACTIONS/`, with product branch `apbm-00n-cyber-pharma` and QA branch `qa/apbm-00n-cyber-pharma`. E1 verifies installed routing and reports any conflicting repository instructions before pack installation. Existing historical folders retain their identities.
- Retain historical BIM/RRM records. Map unfinished BIM-004, APPLY and BIM-005 obligations into APBM-003 through an explicit succession record.
- Follow the supplied forward QA-line workflow under Tony’s Git authority. The older disposable-QA-branch preference is superseded for this campaign only when this draft is approved. Record one active writer and every engineering/QA handoff.
- Tony controls Git mutations and release decisions. Authorized agents can execute explicitly scoped cloud work after required user authentication and target approval. This amends the older blanket Engineer cloud-zero wording for those declared actions.
- Keep credentials in the approved environment mechanism. QAM uses its declared ignored, untracked QA credential file. Do not copy a blanket instruction to source or inspect production environment files into every assignment.
- Preserve Gate Q, cleanup acceptance, integration, Director acceptance and Gate D as distinct facts. Gate D tests the actual deployed revision and target. Use existing valid evidence where applicable rather than automatically repeat whole campaigns.

Every code-bearing independent module receives Gate Q. Internal tasks inside one APBM receive engineering checks and coverage in that APBM’s QAM. Splitting work into governed child modules creates child and integration QA obligations, so split only at a meaningful dependency or acceptance boundary.

## 5. Campaign blocks and milestones

| Execution block | Scope | Main dependency | Exit |
| --- | --- | --- | --- |
| **Start-up work and POCs** | Baseline recon, immediate containment checks, source discovery, DNS preparation, decisions and reusable prototypes | Named targets and authority | Inputs ready for each affected module |
| **APBM-003** | Phase 3 completion and admin read views | Verified repo/dev baseline, ownership contract | Target One deployed and verified |
| **APBM-007** | Commerce, required administration and cross-app access | Applied account model, Stripe sandbox, approved commercial contract and access-email path | Target Two deployed and verified |
| **APBM-005** | Imports, calculation engine and computed OwedBook | Math contract, minimal references, import specifications and required POC evidence | Synthetic integrated calculation workflows pass, real-data acceptance tracked separately |
| **APBM-006** | Reports and correspondence | Approved report contract, reference/math outputs needed by the report, email/PDF POCs | Protected synthetic report journey passes |
| **APBM-004** | Remaining reference refresh and vendor integration | Confirmed sources, samples, licence and delivery contract | Required pricing inputs refresh with retained history and monitoring |
| **Integrated staging acceptance** | Cross-app regression and complete customer journeys | Required module results and retained scope complete | Gate One, then Gate Two after client feedback |
| **APBM-008 — Phase 8 production package** | Production pilot and operational readiness | Separate start approval and usable live inputs | Approved pilot launch, then separately planned rollout |

The APBM numbers now match their original product phases, as reported by Friday’s B-1 ruling. Proposed execution places APBM-005 before APBM-006 to prioritize calculations after Target Two, pending Director ruling D-3. APBM-004 discovery and public-source work can start earlier in an isolated approved lane. Its production vendor component remains conditional on actual readiness.

Client feedback begins after Target One and continues while APBM-007 is built. Triage it against the published milestone scope. A broken read or incorrect permission is a defect in that milestone. A request for a later engine or payment capability is scheduled work. Consolidate accepted changes into bounded repair or feature assignments.

## 6. APBM-003 — Phase 3 completion and Target One

### Outcome and scope

OwedBook and the agreed admin views read genuine database records for synthetic test accounts on shared-dev staging. The owner can inspect their account’s stores and the agreed administration information. Store admins and members see only authorized data. Inapplicable write controls visibly explain their availability rather than simulate successful mutations.

E1 verifies the account/store schema, installed triggers, policy functions, wrappers, migration state, existing fixture problems, frontend contracts, runtime requirements and all carried findings. Literal table, policy and test counts are established from evidence before becoming acceptance criteria.

E2 includes the following internal work.

1. Complete the ownership and permission delta and signup-trigger correction through forward migrations. Retain existing internal `superadmin` meaning. Model customer ownership through an account-scoped relationship, with any display labels mapped explicitly.
2. Enforce at most one store admin through the appropriate database constraint and guarantee one admin for each active store in the Target One seed. Verify the seed guarantee and rejection of a second admin. Production-style provisioning, sole-admin departure/recovery and transfer procedures belong to APBM-007 under the OW03 business contract, including transaction and concurrency tests. Target One exposes read views and its controlled seed/reset procedure.
3. Create a synthetic fixture generator and idempotent seed/reset process. Regenerate the OwedBook fixtures from that source as the proposed default. Verify safe reset boundaries and repeatability while accounting for timestamps, authentication IDs and append-only audit history.
4. Exercise the schema, ownership rules, wrappers and application integration in the approved disposable environment. Under D-1(a), supersede BIM-002’s certified member SELECT on `user_data`: revoke direct table reads for ordinary authorized users, route OwedBook app reads through the `owedbook_*` wrappers, and rework the isolation matrix and `rls:prove` harness in this stage. Correct demonstrable harness defects without weakening the product assertions or turning baseline failures green by relabeling them.
5. Prepare and execute the declared shared-dev APPLY checkpoint under Tony’s authority. Confirm the actual project, current migration state, existing identities and data, recovery preparation, and repeat-run behavior. Rehearse the applicable migration path. Apply only the required forward chain, verify the corrected trigger and policies, and record the result.
6. Complete the OwedBook service swap and agreed admin read paths on dev. Reuse the existing service contracts. Explicitly permit the smallest required changes for truthful error, loading, refresh and stale-data behavior. A failed KPI request must have an error state rather than silently display zero.
7. Deploy the authorized candidate to the existing OwedBook staging target. Independently verify the revision, login, supported reads, role boundaries and limitations list.

The precise placement of APPLY within E2/Q2 is declared before release. Prefer completing reproducible integration evidence on the disposable target before shared-dev application. Independent QA must still verify the actual shared-dev and deployed behavior required for Target One. A checkpoint does not require a separate APBM.

### Permission and audit boundaries

The customer owner manages their own account, stores, admins and members. **D-4 approved by Tony on 5 November 2026:** the owner has audited read access to OwedBook claims for every store in their account, without needing a separate admin/member assignment at each store. APBM-003 authors `is_owner_of_account()` reach policies on the tenant tables, with owner reads recorded in `audit_logs` through the audited read paths. There is no cross-customer reach. Store-admin and member capabilities remain unchanged: one admin per store, no role switching. Internal support privileges require their own server-controlled scope and audit.

Account ownership does not authorize direct client modification of paid entitlement fields. Subscription and provisioning state remain controlled by trusted backend paths. APBM-003 establishes the read boundaries and seeded identities. APBM-007 implements membership changes, sole-admin recovery and owner transfers through explicit authorized operations, with tests against escalation, stale sessions and concurrent updates.

**D-1(a) approved by Tony on 5 November 2026.** Close both application and database read-audit bypasses in APBM-003. Tony agreed with JARVIS’s recommendation to complete this foundational work before later features add complexity. The alternative deferral to APBM-007 is retained in Friday’s review as an unselected option.

Demonstrate that ordinary authorized users cannot bypass the declared read audit through direct table access. E1 assesses grants, policies, wrapper execution permissions and existing callers, including the certified isolation harness. Extend independent tests without weakening tenant-isolation assertions. Carry Friday’s additional approximately 1–2 working days in the Target One forecast, confirmed at E1; any overlap with the original allowance must be evidenced before removing that contingency. The decision approves the scope and timing, while the implementation and final duration remain to be established.

Audit event counts follow a defined wrapper/operation contract. Fix expected counts during authoring from actual calls and retries. Target One acceptance requires independent evidence that supported application reads are audited and direct client access cannot bypass that audit within the declared scope. Administrative/service-role access has its own explicit authority and logging controls.

### Acceptance cast and evidence

Seed a one-store owner, a three-store owner who also administers one store, separate store admins, members with assigned access, and an unrelated account. Include an internal operator identity only for explicitly authorized tests. Prove owner and store restrictions, cross-account denial, billing-field protection, safe admin assignment, and direct-read audit enforcement.

Cover KPIs, rows, filters, sorting, pagination, summary and PBM selection, plus the agreed admin read views. Use desktop and 375px mobile with both approved themes, including error and empty states. Independently verify seed expectations from the ruled contract. Preserve signed amounts, missing-reference cases and any predeclared unavailable features.

The QAM includes full affected RLS/audit regression, auth-trigger checks, fixture consistency, repeated seed behavior, controlled reads, UI coverage and the deployed target. Tony’s required eyes-on walk is declared once and grouped with the final usable release.

Target One handoff includes the staging address, secure account delivery, tester scenarios, reset/support instructions, known limitations and a consolidated feedback route. Reported staging address is `cyber-pharma.cyberizedev.com`, to be verified during deployment preparation. Subscription-backed registration, live claims, customer migration and the new calculation engine are later outcomes.

## 7. APBM-007 — Target Two commerce and administration

Connect the deployed Payment Portal frontend to Stripe sandbox and the shared account model. Registration is owner-only under the approved declaration. Existing owners manage their subscription and stores. Store admins receive no billing authority merely because the interim FFM admitted an admin login.

The assignment includes hosted Checkout, Customer Portal sessions, signed webhook processing, durable event tracking, idempotent provisioning, account-level subscription mirroring, Add Store with price preview and consent, store-admin/member invitations according to the approved capability matrix, and the operational administration required for the accepted journey. Audit legacy users before mapping privileges.

Payment, provisioning and access-email outcomes have separate states. Duplicate and out-of-order events, concurrent Add Store attempts, uncertain payment status and paid-but-email-failed recovery are explicit test cases. Retry must preserve account/store uniqueness and avoid another charge for an already completed purchase. Webhook payload logging has a declared minimal retention and sensitive-data policy.

**Email dependency.** Implement and test the required Supabase Auth invitation/magic-link delivery and approved transactional messages within this assignment. Use the early email POC. APBM-006 extends the email capability to pharmacy reports. A later module cannot supply an already accepted Target Two prerequisite.

**Authentication.** First owner access uses the authorized invitation/magic-link path. Returning authenticated owners can move between OwedBook and the Payment Portal through the tested session design. Verify logout, expiry, redirects and role changes across both apps. MissionControl remains separately protected. Google OAuth is a recorded Frank requirement. The proposal defers its implementation until after Gate Two, with its launch requirement decided before the production contract freezes.

**Administration.** Implement sole-admin provisioning, departure/recovery and transfer under the approved OW03 rules. Ensure active stores retain the required admin through transactional, concurrency-tested operations. Assign every currently visible admin action to a working capability or an explicit unavailable state. Separate account-owner authority from store-admin operations. Required settings/profile edits, invitation recovery and member suspension have named scope and tests. Support-assisted ownership transfer requires verified authorization, old-access removal, billing/account consistency and audit. A runbook may provide the operational interface in v1.

Prices, store limits, proration, cancellation, grace, refunds, trial eligibility and existing-customer billing treatment remain business decisions. Placeholder values may support labelled development scenarios. Accepted staging commerce needs the approved rules for its stated scope.

GHL/manual onboarding, APA licences and trials remain retained plan obligations until explicitly included or deferred. The draft proposes excluding them from the initial Target Two cut, with their Package One disposition settled before Gate One. Free pre-payment claim analysis remains a future proposal.

## 8. APBM-005 — Imports, math and computed OwedBook

### Inputs and implementation

Deliver the approved Liberty connection and a usable manual-upload path. A successful POC defines the Liberty contract. If access fails, a manual-first release requires an explicit scope decision and limitation, while Liberty remains an open obligation. Automated Pioneer, DRX and Rx30 connections are outside the current v1 connector direction.

Proposed manual formats are a canonical template plus the Pioneer export layout, using validated work from Lane B. Confirm product support before committing it. A validation parser becomes product functionality only after hardening and independent acceptance. Validate required fields, units, dates, identifiers, file limits, malformed rows, duplicates, retry behavior and the import’s tenant boundary. Provide a rejected-row report without leaking sensitive input.

A minimal reference slice, version/provenance records, canonical NDC/BIN normalization and PBM matching contract must exist before the engine consumes them. APBM-005 owns these prerequisites if APBM-004 has not delivered them. APBM-004 reuses the same functions and representations when adding refreshes. Historical AAC/FUL alone covers only the paths for which it supplies the required data. WAC fallback, brand/generic classification, units and missing history need independent evidence or clearly bounded unresolved results.

Implement the per-claim reference function and set-based calculation path, with consistent outputs. Separate a claim’s computed benchmark from PBM matching and tab/KPI eligibility. Unmatched, cash, missing-reference, reversal and partial-fill cases follow the approved contract and remain visible where required. Claims must not silently disappear from reconciliation.

### Math authority and acceptance

The five original business rulings are received. The knowledge base records a point-in-time $10.64 fee, signed expected-minus-paid owed amounts, quantity multiplication, vendor-derived brand/generic classification and computed PBM keys. The October U&C direction extends earlier scope and needs a dated amendment. The U&C fee question remains pending. This draft does not turn the advisory default into a final business ruling.

Friday supplies a consolidated MATH_SPEC amendment and validation protocol before the implementation contract freezes. They resolve the exact ladder, missing inputs, overrides, method vocabulary, tie behavior, negative amounts, reversals/partial fills and aggregate semantics. Preserve the reported rate-to-five-decimals-before-quantity rule and NUMERIC storage. Explicitly reconcile the source’s binary64 and banker’s-rounding instructions with the Postgres implementation and set-based path through independent vectors. A generic SQL rounding call alone is insufficient proof of parity.

Run the actual 21 source vectors, adding targeted coverage for approved extensions and uncovered regressions. Obtain the vectors themselves before releasing the engine build. Independent expected results must not be generated by the function under test.

Rewire OwedBook to computed values with server-side filter, sort and pagination semantics. Preserve total/KPI reconciliation, signed owed values, and truthful error states. Decide the owner’s overpayment view and the minimum unmatched/Take Action visibility before acceptance. A full correction queue may be deferred explicitly, while unresolved claims remain accountable.

### Human validation

**Deferred under D-2.** Real-data validation and Heather’s review pass are not released. Retain approximately 150 stratified Pioneer June–August rows as the future review design, subject to a later D-2 environment/route/access/retention ruling and available historical references. Heather is the primary reviewer and Frank resolves business disagreements. Include input/reference provenance and independently worked expected examples so review can challenge the engine’s output. Cover every supported method and selected boundaries, then preserve accepted cases as regression evidence.

Historical raw desktop answers are no longer an input dependency. A clean sample review supports the defined sample and contract. It does not establish correctness for every future file or unsupported method. Record disagreements, decisions and a new pass where needed.

Synthetic staging can be released with accurate validation limitations while controlled real-data review remains deferred under D-2. Production readiness requires the agreed real-data acceptance. Do not apply synthetic staging acceptance to live source correctness.

## 9. APBM-006 — Reports and pharmacy correspondence

Run the PDF POC against Frank’s approved letter and the intended server runtime. Implement server-side PDF generation, protected Storage, tenant-scoped retrieval, access audit, template versioning and report provenance. Storage policies are tested for actual uploads, downloads and expiry behavior. Existing deny-all buckets alone do not provide a usable report workflow.

Build preview-and-confirm sending, approved-recipient restrictions on staging, per-pharmacy Reply-To, status and idempotency tracking, honest failure/retry outcomes, and delivery/bounce handling. Test two pharmacies so one store’s report or reply address cannot be used for another. PBM replies go to the pharmacy mailbox under the current product model.

Approve the production attachment or protected-link design before the relevant implementation freezes. A link requires its own recipient authorization and retrieval behavior. Vendor arrangements and PHI handling remain release inputs. Prototype synthetic delivery early while those production decisions are completed.

If GHL is retained, define a PHI-free field map, authenticated inbound request, duplicate behavior and its link to the common provisioning rules. Record its operator and payment/approval order. Include PBM directory corrections and bounce escalation only to the extent explicitly accepted in this release.

## 10. APBM-004 — Reference refresh and vendor integration

Extend the common reference model established for the engine with scheduled and manual pulls, raw-source archive under appropriate rights, checksums, dataset versions, append-only effective dates, monitoring and failure recovery. Preserve both the date applicable to a claim and the dataset/version used in its calculation.

Verify source history, units, identifiers, revisions, freshness expectations and the behaviour of missing or corrected inputs. Retry must not duplicate versions or destroy history. Repricing is an explicit audited operation rather than an incidental consequence of a refresh.

Use the selected vendor’s real contract, schema and permitted samples for its adapter. Medi-Span and Elsevier remain options pending Frank’s commercial decision. A vendor-neutral interface allows early work, while vendor-specific acceptance still requires the selected feed. Confirm coverage of WAC, classification, billable units and historical data independently. Public AAC/FUL availability does not establish complete production coverage.

Recommend a global PHI-free PBM reference directory with audited internal corrections for v1, subject to decision. Any submitted unmatched claim details remain tenant-scoped. Determine whether the corrections workflow belongs in bounded MissionControl operations or is deferred with a manual procedure. Internal operators receive only the necessary permissions.

## 11. POC programme and parallel math lane

**Naming and repository ruling.** Friday’s B-4 finding reports the Director’s `PROTO-<TOPIC>` naming rule and separate `cyber-pharma-protos` repository. Use that repository for new prototype work, with a gitignored `scratch/` directory. Legacy numbered names remain historical aliases in transfer records. An ignored directory does not authorize PHI storage. D-2 governs any real-data route, and git exclusion must be verified before execution.

Each POC has an explicit question, target, permitted effects, evidence and consuming module. Stop when the question is answered. Transfer findings, supported samples and test expectations into the implementation contract. Reuse existing valid proof after checking its relevance. Prototype code requires deliberate review and hardening before product use.

| POC | Evidence required | Feeds | Scheduling |
| --- | --- | --- | --- |
| **PROTO-LIBERTY** | Authentication, actual field map, IDs, pagination, date filters, corrections and access limits through an approved route | APBM-005 | Start early once approved access exists |
| **PROTO-AAC-HISTORY** | Availability and provenance of the required historical vintages, or a documented gap/fallback | Math lane and APBM-005 | Early, because it can block historical validation |
| **PROTO-FUL-API** | Required period, effective-date semantics, identifier and unit mapping | Math lane and APBM-005 | Alongside AAC discovery |
| **PROTO-MATH-VECTORS** | Independent expected values, precision behaviour, per-row/set-based agreement, explicit uncovered paths | APBM-005 | Synthetic inputs can start early |
| **PROTO-PBM-SHEET** | Dated PHI-free source, duplicate/blank behavior, matching vocabulary and measured unmatched cases | APBM-003 reference decisions and APBM-005 | Approved PHI-free snapshot before dependent seeding/validation |
| **PROTO-PIONEER-PARSE** | Normalized fields, rejection behavior, privacy handling and stable identity | Internal validation, optionally manual-upload support | Synthetic samples only under current D-2 ruling |
| **PROTO-REVIEW-SHEET** | Synthetic output, provenance, review columns and controlled sharing design | Future Heather validation | Synthetic prototype now; real-data review deferred under D-2 |
| **PROTO-REFERENCE-VENDOR** | Selected product, schema, permitted sample, units, classification, history, delivery and licence terms | APBM-004 and any vendor-dependent engine paths | Seek sample access early, activate paid term only with approval |
| **PROTO-PDF** | Long and multi-page output, fonts/totals, intended runtime, protected retrieval | APBM-006 | Before report implementation freezes |
| **PROTO-EMAIL** | Domain configuration, invitation and report delivery, two Reply-To destinations, retries/bounces | APBM-007 and APBM-006 | Begin domain work early, measure actual delivery readiness |
| **PROTO-STRIPE-REUSE** | Retained patterns and fixes, sandbox event flow, account/store mapping and failure recovery | APBM-007 | Before commerce implementation freezes |

Legacy aliases are Proto 04/PROTO07-LIBERTY for PROTO-LIBERTY, Proto 01 for PROTO-PDF, Proto 02 for PROTO-EMAIL, and Proto 05 for PROTO-STRIPE-REUSE. Retain existing evidence under its original identity and reference it from the new topic ID.

Proto06 RLS work is existing input, refreshed for new ownership boundaries through the module’s regression rather than automatically restarted as a new project. Rx30 robustness discovery is conditional on its accepted manual format scope. DRX API and Pioneer SFTP remain future connector work.

**Parallel lane ownership.** Friday is proposed to own math specification and validation design. Execution assignments require their own target/data authority and a named executor. Use isolated checkouts or clearly separate artifacts, with one active writer per checkout. Shared decisions, credentials, review and merges still consume Tony’s time.

**Current Lane B release boundary — D-2:** synthetic and public data only. PROTO-MATH-VECTORS, PROTO-AAC-HISTORY, PROTO-FUL-API, PROTO-PBM-SHEET using a dated PHI-free snapshot, PROTO-PIONEER-PARSE using synthetic samples, and PROTO-REVIEW-SHEET using synthetic output can proceed within their authorized assignments. Frank’s real claim files, real-data validation, Heather’s review pass and the early owed report for Frank’s stores remain deferred. The early report is removed from the active delivery brief and §1 milestones. A later D-2 ruling must name the environment, transfer route, access and retention before that work is reinstated; usable historical inputs and reviewer availability remain prerequisites.

A prototype estimate of roughly one week from the math brief is a working hypothesis for bounded technical work. It excludes uncertain source discovery, environment preparation and Heather’s review cycles. Lane B is not assumed to have zero cost or to make product E1 a formality.

## 12. Data handling and release boundaries

Development, staging, repository fixtures and routine QA use synthetic claims. Synthetic construction must be documented and verified. A name-removal script or a scan with zero findings is insufficient by itself to establish that a historical export is safe for those environments.

**Director ruling D-2 — synthetic and public data only, approved 5 November 2026.** No environment is currently named or approved for Frank’s real claim files; real-data processing is deferred. Before a later D-2 authorization, record the environment identifier and owner, authorized people and tools, transfer route from Frank, access controls, permitted processing, retention/deletion authority and timing, and allowed review-sheet/report fields and recipients before retrieval or processing. The named environment must satisfy the project’s applicable data-handling and vendor requirements. Record actual approval and readiness evidence rather than approving an environment by its label. Synthetic prototypes and public-reference discovery can proceed independently within their authorized scope.

Real claim samples require an approved environment, access path, retention policy and permitted tools before retrieval or processing. A disposable Supabase project is not automatically such an environment. The review sheet and any validation report can also contain protected information. Minimize content and keep review access within the approved boundary.

Patient fields removed during parsing do not retroactively remove the sensitivity of the original file. Confirm validation and retention obligations before removing source copies. Do not treat the recommendation to clear Drive as permission to delete the only retained input or to erase evidence.

Production reference licensing, vendor agreements, platform controls and PHI handling are verified in Phase 8. This draft carries those obligations from the source plan and does not make a new legal or vendor-compliance determination.

## 13. Integrated staging and client acceptance

Gate One requires the accepted scope across both customer applications. Test owner signup, Stripe sandbox confirmation, provisioning, access email, OwedBook session, Add Store, invitations, isolation, approved synthetic import, computed KPIs, report preview, sending and replies. Include failed and repeated operations, revoked access, unmatched data and delayed messages.

MissionControl appears only in the bounded internal operations required by the accepted scope. Three deployed services do not automatically make all three full customer acceptance surfaces. Keep the internal access boundary and PHI-free operational scope explicit.

The integration assignment has its own QAM when authored as a governed module. Reference existing child certificates with their exact candidate and limitations, then test the integrated interfaces and required regression. Gate D verifies the deployed revision, callbacks, domains, sessions, jobs and environment configuration.

Frank’s named approver receives accounts, scenarios, limitations and one feedback register. Group findings as defects against approved scope, business corrections, preferences or new scope. Critical/high defects in required behavior block acceptance. Consolidate authorized repairs and independently retest the changes and required regression.

Gate Two is recorded client staging acceptance after the agreed fixes. Silence is not acceptance. Target One feedback and a successful portal login do not substitute for Gate Two.

## 14. Phase 8 — Separate production package

Keep the production roadmap visible now under APBM-008, with letter-suffixed modules if required. Author its executable APBM map after the staging scope and production inputs are known, with separate Tony/client authorization.

| Production block | Required outcome |
| --- | --- |
| Readiness and procurement | Staging acceptance, approved scope, named first cohort, account/vendor owners, required agreements and live access |
| Platform preparation | Approved Vercel and Supabase Enterprise configuration, secrets, domains, monitoring, backup/restore and rollback procedures |
| Application hardening | MFA, agreed idle/session controls, rate limits, CSP, logging/error scrubbing, role/session changes, provider linking and required Google OAuth scope |
| Migration and deployment | Reviewed migration replay, real reference configuration, production jobs/webhooks/auth email, tested release on Vercel |
| Controlled validation | Real-source retrieval and agreed golden-case review, tenant/audit/security checks, protected reports and approved live billing verification |
| Independent release QA | Production regression, manual attack session, recovery/restore evidence, exact release and deployed verification |
| Pilot and handoff | Named customer records reconciled, invitations, support instructions, billing transition and explicit client/Director release |
| Wider rollout | Agreed waves, required desktop-only history/notes/overrides/reports, retention/export and fallback, then desktop retirement policy |

Do not copy synthetic claims, test users or test Stripe state into production. Separate platform recreation from customer migration. Determine what can be regenerated from pharmacy systems and what exists only in desktop records. Prevent duplicate billing for existing subscribers.

The older 10–15 working-day production allowance is historical planning input for a named pilot with usable prerequisites. Re-estimate against the actual staging result, current hosting requirements, data quality and remaining OAuth/vendor work. Wider rollout and client review remain separately scheduled.

The production contract carries the original vendor/PHI matrix, the responsible contracting entity, the required provider agreements, the six-year audit-retention design target, and defined RTO/RPO with an observed restore drill. Verify the applicability of those obligations before implementation. Preserve the originally specified one-hour idle-session objective unless formally amended, including warning, multi-tab and refresh behaviour. MissionControl’s intended internal/IAP boundary must be reconciled with its actual production hosting. Give each surface an explicit deployment and access decision.

## 15. Schedule and capacity

The September delivery PDF estimated 23–35 working days to staging handoff, 1–2 for bounded client-feedback repairs, and 10–15 for separately approved production work. Its scope included both customer apps end to end. Day 1 and the approval record are unconfirmed in the material supplied.

Friday’s new map estimates the following complete module windows.

| Work | Inherited estimate in working days |
| --- | --- |
| APBM-003 including Target One | 10–13 baseline + approximately 1–2 for D-1(a): **11–15**, confirmed at E1 |
| APBM-007 including Target Two | 7–9 |
| APBM-005 | 6–8 |
| APBM-006 | 5–6 |
| APBM-004 | 4–6 |
| Integrated staging QA | 2–3 |
| Bounded post-feedback repairs | 1–2 |
| **Sequential total** | **35–47 baseline; approximately 36–49 carrying the D-1(a) addition**, confirmed at E1 |

These are inherited estimates for review, not a new commitment. D-1(a) adds an explicit approximately 1–2 working-day allowance to Target One and the sequential total; E1 confirms the actual impact and any evidenced overlap. The 35–47 figure retained in the delivery brief and D-5 is the inherited baseline, not the updated forecast including this addition. The module windows already describe E1/E2/Q1/Q2 work. Do not add the old 8–12 QA-day reserve again without identifying work genuinely outside those windows. Conversely, do not assume POCs, new scope, cleanup and required retest are included unless the estimate records that fact.

Parallel Lane B avoids waiting for some math inputs later. It does not automatically subtract time from the 35–47 sum. Changes to module scope, reference availability, human review, missing evidence and deployment workflow must be reflected in the revised estimate.

After APBM-003 E1, publish a Target One estimate with preparation, engineering, independent QA, Director checkpoints and deployed verification. After PROTO-EMAIL recon, publish a DNS/auth-email readiness estimate, required human actions and observed delivery checks, then revise it from actual results. Carry unresolved email readiness into the Target Two forecast. Re-estimate later blocks when their contracts become executable. Use five working days and approximately six protected Tony hours per day only if that allocation is reconfirmed. Record external waiting and client review separately.

### Two readiness levels

**Target One engineering readiness** requires the confirmed repo/target, complete bounded permission contract, usable synthetic fixtures, auth identities, applicable QA instruments and authorized apply/deploy procedure. It can proceed without vendor purchase or Stripe sandbox completion.

**Full-package commitment readiness** requires the updated scope/question register, commercial rules, agreed import formats, source/prototype route, vendor sample or explicit scope disposition, validation method, client acceptance owner and confirmed capacity. Replace the obsolete desktop-output-export requirement with the agreed independently reviewed answer-key method. Record the client-facing amendment before claiming the original Day 1 gate has been satisfied.

## 16. Decisions and defaults for review

### Director ruling register from Friday’s review

Friday’s latest verdict is READY conditional on draft 3 applying D-1(a), D-2 and D-4 with no other content changes. Those rulings are recorded in CYBER_PHARMA_PLAN_v3_0_DIRECTOR_RULINGS_2026-11-05.md and applied here. B-1–B-6 remain addressed, with the early report deferred by the later D-2 ruling. D-3, D-5 and D-6 remain open; D-3 and D-5 do not block APBM-003 E1. Original review verdicts and prior draft history retain their original scope.

| ID | Decision and options | Chief Architect recommendation | Timing and current status |
| --- | --- | --- | --- |
| **D-1** | Close both application and database read-audit layers in APBM-003 | Selected option (a). Assess Friday’s additional 1–2 day estimate during E1 | APPROVED by Tony, 5 Nov 2026. Scope ruling recorded, implementation and QA pending |
| **D-2** | Synthetic and public data only; no real-claim environment named | Apply the recorded ruling; retain the later environment/route/access/retention gate | APPROVED, 5 Nov 2026. Real-data validation, Heather’s review pass and early owed report deferred. Synthetic/public Lane B proceeds |
| **D-3** | After Target Two, calculations before reports or reports before calculations | APBM-005 → APBM-006 → remaining APBM-004 | OPEN. Tony’s call within the week of the Nov 5 ruling and before releasing the affected sequence; does not block APBM-003 E1 |
| **D-4** | Owner reads every store in their own account | Apply all-own-account audited reach; preserve admin/member boundaries | APPROVED, 5 Nov 2026. C-1 decision closed; implementation and independent proof pending |
| **D-5** | Tell Coach the provisional inherited 35–47 range now, or wait for the Phase 3 recon estimate | Communicate the provisional change now with the D-1(a) addition in §15, refine after E1 | OPEN. Tony controls communication; decide before the external forecast is sent. Does not block APBM-003 E1. No external message sent by this lab |
| **D-6** | Adopt draft 3 as the plan of record | Approve this corrected draft under Friday’s recorded conditional READY verdict | OPEN. On Tony’s approval, v3.0 supersedes v2.0 and APBM-003 E1 is released; no E2/cloud release is implied |

The three required rulings D-1(a), D-2 and D-4 are resolved and applied. D-2 limits the released data scope to synthetic/public-reference activity; it does not authorize Frank’s real files. D-3 and D-5 remain Tony-owned decisions at the points above and do not block APBM-003 E1. D-6 adoption remains the final Director decision on draft 3.

Current Director direction establishes OwedBook-first staging, owner control of the subscription and account stores/admins/members, APBM/QAM delivery, and Chief Architect draft followed by Friday review. Other choices below remain proposed or require current evidence.

| Decision | Draft position | Owner and point needed |
| --- | --- | --- |
| Authoritative repo | Use the original Phase 3 repo named in Friday’s map, verify current state and preserve parked-pilot work | Tony confirms during E1 |
| Phase 3 packaging | One APBM with ownership, seed, apply, controlled reads and Target One | Friday review, Tony plan approval |
| Customer-owner claim access | D-4 approved: all own-account stores with audited reads | APBM-003 implements and independently proves the ruled boundary |
| Admin/member capabilities | Explicit matrix covering read/import/export/send/invite/settings, with sole-admin recovery | Architect proposal, business approval before affected module |
| PBM directory tenancy | Proposed shared PHI-free reference directory, tenant-scoped claim context | Tony/business before schema or matching contract |
| Seed and fixtures | Synthetic generator, regenerated mock fixtures, controlled reset | APBM-003 contract |
| Manual formats | Proposed canonical template plus Pioneer export | Coach/Frank before APBM-005 scope freeze |
| Math amendments | Formalize U&C and precision behavior, resolve fee-leg and reversal/partial-fill rules | Friday prepares, appropriate business/Director authority approves before affected calculation |
| Sequence after Target Two | APBM-005 before report completion, references supplied early | Friday/Tony plan review |
| Google OAuth | Deferred until after Gate Two, release requirement settled before production plan freeze | Tony/Frank |
| Promotions and assisted onboarding | Explicit inclusion or deferral of APA, trials, GHL and manual approval | Coach/Tony before full-package scope commitment |
| Vendor and history | Frank selects and approves terms, technical owner verifies fields/history | Before dependent vendor acceptance |
| Commercial lifecycle | Approved pricing, store limits, grace/cancellation/refund and subscriber transition | Coach/Frank before accepted commerce |
| Report workflow | Approved letter, actions, recipients, delivery policy and provider responsibilities | Frank/Coach before relevant report contract |
| Client acceptance | Named tester coordinator and final approver, documented staging and production milestones | Coach/Frank/Tony |

Batch related decisions into each readiness review. Avoid blocking independent recon on questions whose answers are only needed for a later module. Never convert silence or a recommendation into approval.

### Retained and deferred scope ledger

| Item | Disposition in this draft |
| --- | --- |
| ALDOI complaint filing | Preserve the original extension-module posture. Coach/Frank decision before report-scope freeze, otherwise proposed v1.1 work with an explicit disposition |
| QuickBooks financial layer and other Mother Ship products | Outside the funded OwedBook v1 scope unless separately approved |
| New marketing website, PWA strategy and marketing lead-capture changes | Parked. Existing customer entry links needed by the accepted journeys remain covered |
| General MissionControl expansion | Outside this staging cut. Required bounded operations must be individually named |
| PBM directory maintenance and bounce escalation | Preserve Cyberize’s recorded maintenance responsibility, Frank as escalation. Confirm operator and manual/tool workflow before report acceptance |
| Inbound PBM reply management | Deferred. Replies go to the configured pharmacy inbox under the current model |
| ALDOI, APA, trials and assisted onboarding decisions | Each receives a recorded inclusion or deferral. An unimplemented item does not become completed through a scope-label change |
| Overpayment view and full unmatched correction queue | Proposed later than the first engine proof, with exact Package One status decided before its acceptance contract. Signed values and accountable unresolved-claim reporting remain required |
| Future automated connectors | DRX API, Pioneer SFTP and Rx30 automation deferred. Accepted manual-export support has its own narrower contract |
| Free pre-payment recovery demonstration | Future acquisition-model proposal, requiring separate identity, retention and entitlement design |
| Desktop-user migration and sunset | Phase 8 pilot and subsequent rollout. Preserve required historical notes, overrides, reports and recovery state through the approved migration design |

The existing account profile’s agreed information, password change and recovery remain in scope through APBM-007 and auth regression. Optional profile fields require an explicit decision. These obligations, the question register and the source phase ledger are checked again when the full Package One scope is frozen.

## 17. Carried obligations and evidence

| Item | Owner/block and closure requirement |
| --- | --- |
| DA-2 signup containment | APBM-003 preflight checks actual signup settings on each authorized target and records evidence before shared-dev apply |
| CE-1 seed identity authority | APBM-003 uses approved server-side creation and explicit role/profile assignment |
| CE-2 trigger correction | APBM-003 forward migration and installed-function verification. User metadata never determines privilege |
| CF-1 owner deletion | APBM-003 defines safe ownership/deletion semantics, APBM-007 transfer procedure preserves continuity |
| CF-8 / CF-9 harness issues | APBM-003 reproduces, diagnoses and repairs instruments/baselines against actual intended behavior |
| CF-10 read-audit bypass | D-1(a) approved. Close both application and database bypasses in APBM-003 and prove the declared boundary independently before Target One acceptance |
| E-13 fixture inconsistency | APBM-003 replaces inconsistent fixtures through the approved synthetic source |
| E-17 missing QA identities | Preflight verifies every named identity before testing |
| CE-3 / R-016 integration states | APBM-003 establishes current baseline and permitted UI contract amendments |
| KPI, federal sign, global sort, unmatched totals | APBM-005 gives explicit aggregate and visibility contracts with independent examples |
| Storage policies | APBM-006 implements and proves the required paths before report acceptance |
| E-16 registered auth Server Action | Phase 8 assessment, earlier routing if evidence establishes a blocker |
| E-18 PBM trigger keyboard issue | Accessibility disposition with owner and acceptance impact before affected release |
| QC-5 credential rotation | Verify current status with Tony, record actual action or pending obligation |
| QAM adoption | Supplied doctrine already mandates QAM. Reconcile installed entry/routing and campaign-specific APBM adoption |
| Portal certificates | Obtain actual Gate Q decision, tested identity and deployment/Gate D record. Preserve exact qualifications |
| Journals | Append campaign progress and lessons without rewriting historical records or inventing missing entries |

## 18. Friday review and release sequence

Friday’s first verdict was ADOPT WITH CORRECTIONS. Her subsequent November 5 verdict is READY conditional on draft 3 applying D-1(a), D-2 and D-4 with no other content changes. This revision applies those rulings and their consequential updates. The following review criteria are retained as the architecture acceptance record.

1. Is Target One’s database-backed synthetic scope faithful to Tony’s intended first feedback release?
2. Does APBM-003 contain a workable engineering/QA/apply/deploy sequence and complete permission/audit obligations?
3. Does the owner/store model avoid customer/internal role collision and direct entitlement manipulation?
4. Are reference, normalization, access-email and POC dependencies placed before the outcomes that require them?
5. Are the math amendment, independent expected answers, human validation and data-handling boundaries sufficient?
6. Is every original eight-phase requirement completed, assigned, explicitly proposed for deferral, or carried into Phase 8?
7. Are the schedule assumptions and outstanding business decisions stated honestly and without duplicate QA allowances?

JARVIS has applied the recorded D-1(a), D-2 and D-4 dispositions in draft 3. Under Friday’s conditional READY verdict, Tony’s D-6 approval adopts v3.0 and releases APBM-003 E1. D-3 and D-5 remain open without blocking that recon. Author the executable pack from E1 findings; E2/Q1/Q2 and the declared APPLY/deployment checkpoints retain their own scope, target and release conditions. Any further substantive plan change requires review of that change; this revision does not assert that Friday has already inspected the resulting file.

This plan’s approval adopts the direction and workflow. A module’s execution authority still identifies its actual candidate, target, data, permitted effects and required release conditions.

## 19. Source register

The following supplied documents informed this draft. Their claims retain their original evidence limits. The current source files, plus relevant actual repository evidence, must accompany module authoring.

| Source | Contribution |
| --- | --- |
| CYBER_PHARMA_8_PHASE_PLAN_v2_0.md, 10 Aug 2026 | Eight-phase scope, original gates and standing architecture |
| CYBER_PHARMA_DELIVERY_PLAN_AND_CLIENT_QUESTIONS_v3.pdf, 24 Sep 2026 | Two packages, OW/SP decisions, estimates, POCs, synthetic staging and production direction |
| CYBER_PHARMA_REPLAN_BRIEF_FOR_ASTRA_v1_0.md, 5 Nov 2026 | Initial cross-lab replan questions, superseded where later evidence resolves them |
| CYBER_PHARMA_STATE_OF_PROGRAM_BRIEF_RRM_of_FFM_2026-11-05.md | Reported repo inspection at 5234abe, RRM closure and carried Phase 3 obligations |
| CYPH_SUBSCRIPTION_PORTAL_REPLAN_BRIEF_2026-11-05.txt | Portal FFM, owner/store direction, v1 imports, login request and implementation evidence limits |
| OWEDBOOK_MATH_REPLANNING_BRIEF_v1_0.md | Validation design, source profiling, remaining math/source questions and POCs |
| OWEDBOOK_MATH_ENGINE_KNOWLEDGE_BASE_v1_0.md | Formula and precision detail, source rulings and unresolved U&C treatment |
| CYBER_PHARMA_REPLAN_INPUT_REVIEW_v1_0.md | Friday’s reconciliation and preliminary estimates |
| CYBER_PHARMA_APBM_CAMPAIGN_MAP_v1_0.md | Target One/Two, module IDs, proposed repo, lanes and carried flags |
| ABM_PLAYBOOK_v1_0.md and APBM_PLAYBOOK_v1_0.md, supplied October editions | Continuous bounded engineering, phase packaging, evidence and recovery |
| QAM_PLAYBOOK.md v1.0 and BIM_PLAYBOOK.md v1.1 | Independent Q1/Q2, frozen contracts, ownership, cleanup and certification |
| CYBER_PHARMA_8_PHASE_PLAN_v3_0_REVIEW_FINDINGS_v1_0.md, 5 Nov 2026 | Friday’s ADOPT WITH CORRECTIONS verdict, reported Director naming rulings, B-1–B-6 and D-1–D-6 |
| CYBER_PHARMA_PLAN_v3_0_DIRECTOR_RULINGS_2026-11-05.md | Friday’s recorded D-1(a), D-2 and D-4 rulings, conditional READY verdict, remaining D-3/D-5/D-6 and E1 release condition |
| Tony’s November 5 instructions in this lab | Chief Architect/reviewer seats, OwedBook-first priority, owner authority, contributor-pilot pause and draft authorization |

## 20. Revision record

| Version | Status | Change |
| --- | --- | --- |
| v2.0 | Historical plan of record | Original eight-phase baseline |
| v3.0 draft 1, 5 Nov 2026 | Initial review completed | OwedBook-first staging milestones, consolidated Phase 3 APBM, embedded QAM, full POC register, corrected dependencies, explicit permissions/data/validation boundaries, honest estimate reconciliation and retained Phase 8 obligations |
| **v3.0 review draft 2, 5 Nov 2026** | **Director rulings and Friday confirmation pending** | Applied phase-numbered IDs, Friday seat name, topic-named prototypes and separate repo, sole-admin recovery placement, early validation-report milestone, delivery brief and email forecast. Recorded conditional D-1 boundaries and all D rulings without selecting them |
| v3.0 review draft 2 + D-1, 5 Nov 2026 | Partial Director rulings recorded | Tony selects D-1(a), both audit layers in APBM-003. Seat names clarified as JARVIS (he/him) and Friday (she/her), independent of model assignments |
| **v3.0 final review draft 3, 5 Nov 2026** | **Ready for Director adoption under Friday’s conditional READY verdict** | Applied recorded D-1(a), D-2 and D-4 only, with consequential schedule/status/traceability updates. Real-data report removed from active milestones; synthetic/public Lane B retained. D-3/D-5 remain open without blocking E1; D-6 adoption pending |

### Review response record

| Finding | Disposition | Location and evidence of correction |
| --- | --- | --- |
| A-1–A-8 | Accepted review observations retained | Synthetic source, honest estimates, precision vectors, early auth email, operation-based audit counts, realistic parallel costs, proposed numbers-first order and controlled retention remain in the plan |
| B-1 | Addressed | Phase-numbered APBM IDs applied throughout, suffix/folder/branch rule in §4, APBM-008 production identity in §14 |
| B-2 | Addressed | §6 retains at-most-one-admin constraint and seeded admin guarantee. §7 owns provisioning and recovery/transfer procedures |
| B-3 | Addressed in draft 2; active milestone deferred by later D-2 ruling | Early report removed from delivery brief and §1 in draft 3. §11 preserves the future work and reinstatement prerequisites without promising a delivery date |
| B-4 | Addressed | Reviewer is Friday. §11 records PROTO-<TOPIC>, cyber-pharma-protos, ignored scratch and legacy aliases |
| B-5 | Addressed | Short client-facing delivery brief added before §1 |
| B-6 | Addressed | §15 requires a DNS/auth-email readiness forecast after PROTO-EMAIL recon and updates Target Two timing |
| C-1 | Decision closed by D-4 | §§6 and 16 require audited read access across every own-account store; implementation and QA evidence pending |
| D-1 | Director ruling recorded | Tony selected closure of both layers in APBM-003. §§6, 16 and 17 updated. Implementation and independent verification remain pending |
| D-2 and D-4 | Recorded rulings applied | §§1, 6, 8, 11, 12 and 16 reflect synthetic/public-only work, deferred real-data validation/report and owner reach |
| D-3 and D-5 | Open, nonblocking for APBM-003 E1 | §16 retains Tony’s decisions and their decision points |
| D-6 | Director adoption pending | Friday’s conditional READY verdict is recorded; adoption of this draft releases E1 under §18 |

**Next owner — Tony for D-6 adoption of draft 3.** Friday’s conditional READY verdict is recorded and its three required rulings are applied. On adoption, proceed to APBM-003 E1. D-3 and D-5 stay on the decision register; real claims remain deferred under D-2.
