# Cyber Pharma — ABM007_FINAL campaign journal

Version: 0.5
Opened: 24 November 2026 · Asia/Dhaka
Director: Tony
Architect: JARVIS
QA Lead: Friday
Engineering: Claudy
Independent QA Executor: Cody

This is a new, append-only journal for decisions and lessons arising in this lab. It does not replace earlier campaign journals, module rulings or historical certificates. Future entries should cite their source, owner, status and closure evidence. Starting this journal does not certify the product or modify files in Tony's VM.

## Entry 001 — Focused human walkthrough before QA certification

### Decision and reason

**Status: Director-approved operating requirement; current-module QAM amendment and Factory doctrine synchronization pending.**

Source: Tony's instruction in this lab on 24 November 2026: “a manual engineering QA walk thru will be part of the QAM from now on”; human and Cody findings should be fixed by Claudy before certification; the QA Lead should narrow the Director's work so he does not test all day.

Tony previously participated in Q2 and remains willing to help certify the product. Removing him from QA was not the intended lesson. Routine automated execution should be independent of his inbox, while selected human checks form an explicit part of the approved QA plan.

The gap to close is a mandatory, scoped, candidate-bound human walkthrough before the QA Lead issues product Gate Q. Human acceptance must not become an informal activity performed only after certification.

### Terminology and ownership

“Manual engineering QA walkthrough” means the Director-operated human lane within independent Q2. It is distinct from Claudy's E2 self-verification. Friday owns selection, plan approval and findings adjudication; Tony operates; JARVIS can guide and translate the steps; Cody maintains the independent evidence record; Claudy repairs accepted product defects. Tony's execution does not substitute for Friday's certification authority.

### Required lifecycle

1. **E2:** Engineering supplies reproducible builds, fixture prerequisites, known risks and factual handoff. Routine SCRATCH test-account login is automated where permitted.
2. **Q1:** Cody proposes automated coverage and a separate, short human walkthrough. Friday selects or amends the human steps before Q2 release. Scope comes from the accepted contract and risk, not a generic repeat of every earlier manual scenario.
3. **Q2:** Cody executes the independent campaign. Tony performs the planned human steps against the identified candidate and test target, supported by JARVIS. Human checks may be grouped near the end; access prerequisites occur when actually needed.
4. **Combined findings:** Cody and human findings enter one register. Friday classifies them, maps them to acceptance criteria and consolidates accepted repairs into a bounded work order for Claudy. Preserve both evidence sources and original failures; do not suppress one because the other passed.
5. **Repair/retest:** Cody verifies fixes and affected regression. Tony repeats only the affected human steps when Friday requires them. Product changes require candidate and evidence binding to be reconciled before certification.
6. **Certification:** Friday issues the verdict only after required automated and human evidence is complete and blocking findings are resolved. New requests outside the contract receive an explicit disposition. A pending required walkthrough is not a PASS. Any authorized risk acceptance remains attributable to Tony and visible in the verdict.
7. **After deployment:** Gate D verifies the actual deployed revisions and external settings. It remains separate and does not retroactively prove pre-certification checks. Deployment-only checks are expressly identified before Gate Q and preserved as release/closeout obligations.

### Keep Tony's work short

Friday must provide a bounded list of selected checks, explain why each needs a person, and give expected results. Reuse valid prior evidence; automate repetitive role, viewport, table and input permutations. Group related checks into a sensible user journey and identify prerequisites before Tony starts. Avoid repeated inbox sign-ins simply to unblock automation.

Each manual step should record:

| Field | Requirement |
| --- | --- |
| Step ID and AC/risk | What requirement or uncertainty the step addresses |
| Human reason | Why automated evidence alone is insufficient |
| Candidate and target | Exact tested build/commit, environment and browser |
| Fixture and effects | Role/account, allowed writes, cleanup/rollback where applicable |
| Actions | Short, plain-language instructions |
| Expected result | Observable pass condition |
| Evidence | Sanitized screenshot or precise Director observation, attributed honestly |
| Result | PENDING, PASS, FAIL or BLOCKED; no prefilled passes |
| Finding and retest | Linked issue, disposition and affected retest result |

Include a practical effort estimate in Q1, without inventing a deadline or a fixed universal time budget. Director inbox actions are appropriate for selected real email checks; tokens, passwords and raw auth state do not belong in retained evidence.

### Application to ABM007_FINAL

E2 review package 02 is explicitly INTERIM. This decision does not bypass its open engineering stops or authorize Q2. Engineering must finish before the normal candidate handoff.

The reviewed package prepares a deployed-system walkthrough and distinguishes engineering, independent QA and Director checks. That is not by itself evidence of a completed, approved pre-certification human lane. Friday should inspect the installed QAM during Q1 intake, retain any existing conforming coverage and add only the missing requirements. No claim is made that every installed QAM file was reviewed in this lab.

Candidate human checks for Friday to select and refine include:
- Signed-in OwedBook and Account & Billing journeys and role-appropriate navigation.
- Help accuracy and usability for Owner, Store admin and Member.
- Desktop/mobile branding, menu behavior and keyboard focus on representative surfaces.
- Cross-app handoff and the previously reported Store-admin redirect, with permitted fixtures and browser coverage.
- Any additional contract-required integration or payment behavior that needs a person, only under its declared authorization.

Live email delivery, externally applied branding and final deployed Stripe pages must retain their Gate D checks. Use a suitable QA preview before certification where possible; do not silently waive pre-certification requirements or claim later checks already passed. Deferred payment-exception work stays explicitly routed to its own work order until authorized.

### SCRATCH authentication clarification

Tony approved reusing existing APBM007B SCRATCH resources for Engineering and QA. A later prompt narrowly permits provider-supported test-session establishment with the SCRATCH privileged credential for designated existing fixture users when normal fixture credentials are unavailable. This is test setup only, with target verification and a fixture allowlist; no DEV access, production bypass or secret export.

That setup does not prove normal user login, magic-link lifecycle, email delivery or cross-app handoff. Those need their own tests. This journal does not expand the effects permitted by those prompts.

## Doctrine change register

### DC-001 — Mandatory focused human lane in QAM

Status: **Approved requirement; proposed text prepared; central playbooks/templates not edited or synchronized.**

Current source reviewed: supplied `QAM_PLAYBOOK.md`, v1.0, 18 October 2026. Sections 8–10 cover Q1, approval and Q2. Section 10 already says human checks should be declared beforehand and grouped, and section 17 records Director touches. The amendment strengthens existing provision into a mandatory, bounded pre-certification lane; it does not introduce human participation as though it were previously forbidden.

Proposed normative wording:

> Every new QAM shall include a QA Lead-approved, risk-based human walkthrough within Q2 before product certification. The QA Lead shall bound the Director's effort, select checks requiring human judgment, and define actions, expected results, fixtures, permitted effects and sanitized evidence. Independent automated findings and human findings shall enter one adjudicated register and consolidated repair/retest cycle. Required human checks left incomplete shall remain BLOCKED or PENDING and shall not be represented as passed. The QA Lead retains certification authority. Gate D remains separately scoped verification of actual deployed revisions and external configuration. Automated fixture authentication shall not be represented as proof of the normal login, email or handoff paths.

Scope: ABM007_FINAL by this Director ruling; all future newly authored QAMs. Existing certificates are not retroactively rewritten. For legacy active modules, Friday should identify the smallest explicit amendment before their certification.

### Synchronization checklist

- [ ] Friday acknowledges the ruling and records its source in ABM007_FINAL's QA risk requirements.
- [ ] Current QAM intake checks for an existing conforming human lane; missing plan/evidence structure is added before Q2 approval.
- [ ] Q1 package includes selected manual checks, effort estimate and pending results.
- [ ] Q2 evidence and certification checklist require their disposition.
- [ ] Repair/retest template combines automated and human findings while retaining provenance.
- [ ] QA Lead/Factory DocSet maintainer updates QAM_PLAYBOOK sections 5, 7–10, 14, 17–18 and relevant templates as needed.
- [ ] Reconcile QA_PLAYBOOK, Architect/Engineer handoffs and ABM/APBM references under their respective track owners; avoid silently merging their governance tracks.
- [ ] Verify entry files, examples and approval/certification templates agree; record actual changed versions and closure evidence.

## Action register

| ID | Owner | Action | Status |
| --- | --- | --- | --- |
| CJ-001 | JARVIS | Open journal and prepare Friday briefing | Completed in this document |
| CJ-002 | Tony | Relay briefing below to Friday | Pending; no message sent externally |
| CJ-003 | Friday | Acknowledge requirement; govern current QAM amendment and Q1 human-plan review | Pending |
| CJ-004 | Cody, under Friday | Draft candidate-specific human walkthrough in Q1; record Q2 evidence and findings | Not started |
| CJ-005 | Claudy | Finish remaining E2 obligations; repair consolidated accepted QA findings when released | E2 in progress; repair conditional |
| CJ-006 | QA Lead / Factory DocSet maintainer | Publish and verify DC-001 across governing documents/templates | Pending |

## Ready-to-relay briefing for Friday

TO: Friday — QA Lead
FROM: JARVIS — Architect
AUTHORITY: Tony — Director, ruling of 24 November 2026
SUBJECT: ABM007_FINAL QAM amendment and doctrine follow-up DC-001

Tony confirms that his focused manual engineering QA walkthrough must be part of Q2 before product certification, for this module and future QAMs. He participated in earlier Q2 work and wants that seat retained. Routine automated login should not require his inbox, but planned human email/integration checks may.

Please inspect the installed QAM and retain any existing conforming coverage. Record this ruling in the QA risk requirements, and require Cody's Q1 plan to include a short human walkthrough for your approval: selected risks/ACs, exact candidate and target, fixtures, permitted effects, plain-language steps, expected results, evidence, effort estimate and pending result fields. You narrow the workload; Tony and JARVIS execute the human steps during Q2; Cody independently executes and records the automated campaign.

Consolidate both sources of findings into one adjudicated repair assignment for Claudy. Retest affected behavior and required regression, with Tony repeating only affected human checks when needed. Required human checks cannot remain pending while receiving a PASS. You retain certification authority. Keep Gate D separate for deployed revisions and external configuration; identify unavoidable deployment-only checks explicitly.

This preserves E1/E2 and Q1/Q2. It adds no mandatory new QA shot, removes no automation and does not revive deferred payment scenarios without their own authorization. ABM007_FINAL E2 remains INTERIM until its engineering stops close.

DC-001 is logged for the next Factory doctrine/template synchronization. The central playbooks have not yet been edited. Please acknowledge the ruling, identify the smallest current-module QAM amendment, and carry the synchronization action in your closeout handoff.

## Entry template for future additions

### Entry NNN — Title
- Date/time and source:
- Decision or observation:
- Authority/owner:
- Scope and evidence limits:
- Required actions and next owner:
- Status and closure evidence:

## Entry 002 — Repeatable, risk-based regression testing

Date: 24 November 2026 · Asia/Dhaka
Source: Tony asked to plan regression with the QA Lead now and carry it into the doctrine update.
Status: **Planning campaign authorized; Architect proposal below awaits Friday's review. No new test implementation, infrastructure, data mutation or execution is authorized by this journal.**

### Goal

Every new module must prove its own behavior and preserve the accepted behavior that users already rely on. Repetitive regression should be automated. Tony's human lane remains short, selective and part of Q2 under Entry 001. Coach/Frank's existing acceptance recipe remains unchanged pending their feedback; it is neither replaced by the regression suite nor made a prerequisite for drafting it.

### Proposed coverage model

| Coverage | Trigger and purpose | Preferred evidence |
| --- | --- | --- |
| Fast checks | Relevant engineering changes and the governed QA candidate | Unit/service/component tests, typecheck, lint and build as appropriate; full existing fast suites at Gate Q when feasible |
| Core regression | Every code-bearing release candidate across the two-app product | Small automated set of critical user journeys and authorization negatives on the approved SCRATCH target |
| Change-specific regression | Each module or repair, selected during Q1 from complete changes and dependencies | Additional API, database, integration, browser and negative tests; explicitly justified selection and omissions |
| Broader campaign | Initial suite baseline; major auth/schema/commerce/integration changes; pre-beta and production milestones; other evidence-based triggers chosen by Friday | Expanded supported-browser/device and lifecycle coverage on approved targets; optionally scheduled once infrastructure is agreed |
| Human walkthrough | Every new QAM, before certification | Friday-selected checks requiring human judgment or supported human interaction, plus focused exploration |
| Deployed smoke / Gate D | Each deployment and external settings change | Actual revision identity, reachability, sign-in, cross-app targets and affected integrations; synthetic/isolated data and effects only as authorized |

These are coverage groups inside E1/E2 and Q1/Q2, not new mandatory shots. Passing a mock test is not proof of its real-provider counterpart. Keep ordinary regression separate from paid/provider-event experiments that require explicit effects and isolation.

### Initial core register — proposals to inventory, not claims of existing coverage

| ID | Behavior to preserve | Automation and limit |
| --- | --- | --- |
| REG-01 | Owner, Store admin and Member can access their allowed screens; forbidden direct routes and APIs remain forbidden | Role sessions plus positive and negative server-side assertions; a hidden menu alone does not prove denial |
| REG-02 | Account/store isolation and Owner reach remain correct | At least two separate fixture accounts/stores; negative checks for cross-account reads and writes, with only authorized isolated writes |
| REG-03 | OwedBook reads the selected pharmacy and reports truthful loading, empty and failure states | Representative seeded records, store selector, table/filter behavior and failure injection at an authorized seam |
| REG-04 | Account & Billing navigation and two-way handoff work; logout, stale/reused handoff rejection and session boundaries hold | Test the actual supported handoff path. Fixture session establishment does not satisfy this assertion |
| REG-05 | $99 first pharmacy and $49 additional pricing stays server-authoritative | Independent fixed expected totals, additional-store and removal-at-renewal examples, and client-tampering negatives; provider checkout proof separately identified |
| REG-06 | Invitations, acceptance/revocation, role changes and authorized store administration preserve access boundaries | Isolated, attributable fixtures; product-supported actions, explicit cleanup and no interference with Coach accounts |
| REG-07 | Billing lifecycle and entitlement synchronization remain correct | Reuse existing unit/integration evidence for duplicates, retries, event order and reconciliation; real Stripe event scenarios require a separately authorized isolated sandbox lane |
| REG-08 | Light-only brand, Help, responsive navigation and keyboard operation remain usable | Representative viewport/role/state checks and accessibility assertions; visual snapshots supplement behavior tests, with reviewed baseline updates |
| REG-09 | Build and deployment configuration connect the intended app pair and backend | Environment identity preflight, URL/handoff assertions and deployed smoke; no secret values in evidence |
| REG-10 | Every repaired user-visible defect stays fixed | Add a meaningful reproducer at the lowest reliable layer, or record why automation is unsuitable and retain a bounded manual check |

Friday must identify what already exists, what is stale, what is missing and what is only manual. The table is a proposed register, not a commitment to build every missing test during ABM007_FINAL.

### Growing the register with Phases 4–6

Add reference effective dates/history and normalization assertions when references arrive; independently expected calculation vectors and money/rounding rules when imports/math arrive; report totals, tenant-protected PDFs, recipient/reply routing and authorized-send behavior when reports/email arrive. Each module delivers its own new regression assets and nearest existing regressions. Do not test unbuilt features as if they existed or infer expected math from the implementation under test.

### Selection rules for Friday's Q1 review

1. Inspect the complete candidate diff, migrations, dependencies and external configuration changes, not only the changed component names.
2. Run the core register on each release candidate; add dependency-related coverage for the affected domains.
3. An auth, tenant, schema, pricing, provisioning or event-processing change expands the campaign into the affected integration boundaries, even if the frontend diff is small.
4. Styling-only changes still exercise navigation, focus, forms and representative roles; they do not automatically justify a full real-provider payment campaign.
5. After repairs, retest the original failure and impacted neighbors plus core regression on the final candidate. Do not rerun expensive unchanged campaigns solely because a report was repackaged.
6. Every exclusion, reused evidence item and limitation has a reason and owner. Unexpected failures remain visible; an infrastructure failure is BLOCKED rather than a product PASS.

### Fixtures and environment boundaries

- Reuse designated APBM007B SCRATCH fixtures as authorized by Tony. Record roles, ownership relationships and non-secret setup paths. Use isolated per-run data where available; parallel writers must not share mutable fixtures.
- Verify the actual resolved SCRATCH identity before automated runs. Fail closed on wrong/missing targets. Test automation must not default to the shared DEV database.
- Never reset a shared database or mutate Coach/Frank accounts. Destructive scenarios require their own isolated data, authorization, rollback and cleanup.
- Passwords and tokens stay in the approved ignored credential mechanism; no env files, raw authenticated traces or auth state in ZIPs. Provider-supported fixture session setup is not normal login proof.
- Stripe real-event suites must prove event isolation and authorized sandbox effects. Two endpoints observing the same events do not by themselves isolate tests. Do not activate deferred payment-exception scope through this strategy.
- Future topology, agreed separately in this lab: OwedBook beta and both existing alpha apps share CyberPharma_Dev_v1; Payment Portal remains alpha with its current webhook. New OwedBook beta URLs need auth/handoff configuration, not a second payment webhook. Shared DEV is therefore not disposable test storage, and migrations must remain compatible with both deployed OwedBook versions.

### Test asset ownership and execution

Engineering owns maintainable product regression assets within the module's allowed paths and adds tests for accepted repairs when meaningful. Cody challenges expected outcomes, authors independent probes and runs the approved campaign. Friday owns suite selection, evidence adequacy, baseline acceptance and verdicts. Tony owns Git/release decisions.

Durable independent QA helpers may be proposed for retention, but do not merge a QA branch or its debris merely to preserve useful tests. Follow the current module's Git policy; route reusable product/test changes through an approved engineering change and independent review. Credentials and disposable auth state are never durable test assets.

Prefer existing runners and framework versions. Do not introduce a new framework, paid CI service, production secret or provider integration before reconnaissance demonstrates a need. Local reproducible commands come first; CI can invoke the same commands once its target, credentials, concurrency and effects are authorized. Scheduling is a future implementation decision, not an automation created by this journal.

### Reliability, evidence and release rules

- Tests must assert intended user/business outcomes, not just reproduce source text. Validate new critical probes with a known failing/control case where appropriate.
- Use readiness conditions and bounded timeouts rather than arbitrary sleeps. Eliminate hidden retries that turn intermittent failures into silent passes.
- Preserve first failures and classify flakiness. Any quarantine requires Friday's explicit disposition, a tracked owner and a meaningful alternative for required coverage; never silently drop a release blocker.
- Bind each run to product commit, build, test-suite version, target identity, fixture version, browser/runtime and configuration assumptions. Record command, outcome and safe evidence location.
- Retain failed attempts and approved baselines. Visual baseline regeneration is reviewed, not an automatic way to get green.
- Reuse historical evidence only when candidate/environment equivalence and the claim's scope support it. A count of green tests is not enough to certify unchanged user journeys.
- Required core regression, change-specific coverage and the human lane need dispositions before Gate Q. Gate D remains separate; certification names its external/deployment-only limitations.

### Proposed rollout without expanding current E2

1. Friday acknowledges this strategy and returns one consolidated proposal covering scope, risk and remaining decisions.
2. During ABM007_FINAL Q1, Cody inventories the existing suites, retired tests and retained APBM007B evidence, and maps core coverage and gaps to the candidate. This remains within the released Q1 scope; no full campaign or product test repairs in Q1.
3. Friday distinguishes tests required for the current module from broader regression-infrastructure improvements. Current acceptance coverage must be satisfied; broader additions receive a bounded engineering assignment after the current E2 rather than quietly extending it.
4. Establish a known passing baseline on the approved target, validate important probes and measure actual runtime and human effort before promising a time budget.
5. Future module handoffs maintain the regression register and implement relevant new/changed coverage. CI and periodic expanded campaigns follow after reliable local execution and explicit infrastructure authorization.

## Doctrine change register — DC-002

Title: Persistent, risk-based regression register and coverage selection inside every QAM.
Status: **Architect proposal recorded under Tony's planning instruction; Friday review and Director adoption of the final strategy pending. No central doctrine edits made.**

Proposed normative wording:

> Every code-bearing module QAM shall identify applicable persistent core regression, change-specific regression and the required human walkthrough. Q1 shall map changes and dependency risks to coverage and record gaps, justified evidence reuse and exclusions for QA Lead approval. Q2 shall execute the approved coverage against the bound candidate and target, preserving failures and separate human evidence. Accepted defects shall receive an appropriate regression check or a documented reason for manual coverage. Required flaky or blocked tests shall not silently become passing evidence. Durable test assets, fixtures, credentials, provider effects and ownership shall be governed explicitly. Gate Q and deployed Gate D remain distinct.

Sources reviewed: QAM_PLAYBOOK v1.0 (18 October 2026), especially sections 8–10, 12–14 and 17–18; QA_PLAYBOOK v1.2 (18 October 2026), core independent-evidence and Gate Q/Gate D principles. This proposal elaborates existing regression requirements and Entry 001 rather than replacing the two-shot process.

Synchronization targets after approval: QAM risk/recon/test-plan/approval/execution/evidence/certification templates; QA_PLAYBOOK; engineering handoff and repair templates; TESTING_PLAYBOOK under its owner; ABM/APBM references under their track owners. Record actual versions and verify examples/entry points before closing the doctrine action.

## Action register additions

| ID | Owner | Action | Status |
| --- | --- | --- | --- |
| CJ-007 | JARVIS | Draft regression strategy and DC-002; prepare Friday briefing | Completed in this revision |
| CJ-008 | Tony | Relay regression briefing and updated journal to Friday | Pending; no external message sent |
| CJ-009 | Friday | Review strategy, select current-module scope and provide one consolidated amendment/decision list | Pending |
| CJ-010 | Cody, under Friday | Inventory existing regression evidence and gaps during released Q1 | Not started |
| CJ-011 | Architect / Director | Author and release any separately needed regression-infrastructure engineering assignment | Conditional, not released |
| CJ-012 | QA Lead / Factory DocSet maintainer | Synchronize DC-002 after final adoption, jointly with DC-001 where appropriate | Pending |

## Ready-to-relay regression briefing for Friday

TO: Friday — QA Lead
FROM: JARVIS — Architect
SUBJECT: Regression campaign planning and doctrine action DC-002

Tony wants us to plan repeatable regression now, jointly with you. Entry 002/DC-002 in this journal is my proposal for your review, not a claim of suite implementation or central doctrine adoption.

Please return one consolidated position: agree/amend per area, current-module essentials, broader backlog and any Director decisions. Use existing records first; identify questions that require Cody's actual-repo Q1 inventory rather than guessing coverage from green test counts.

Proposed model: existing fast checks; a compact automated core across both apps on every code-bearing release candidate; additional coverage selected by changed dependencies; expanded supported-browser/integration campaigns at major boundaries; a short human Q2 lane before certification; and separate deployed Gate D checks. Preserve the Q1/Q2 process.

Prioritize access/tenant isolation, store selection, cross-app handoff/logout, server-authoritative $99/$49 pricing, invitations/roles, billing lifecycle and representative UI/Help/accessibility. Inventory existing tests and APBM007B evidence before commissioning replacements. Add reference/math/report regression as those features arrive. Keep Coach's existing recipe intact pending his feedback.

For ABM007_FINAL Q1, have Cody map the proposed core register to actual tests and candidate requirements, identify stale or missing coverage, and propose required tests plus your narrowed human walkthrough. Do not quietly expand current E2 or authorize the deferred payment-exception campaign. Propose separate bounded engineering work for infrastructure gaps that exceed current scope.

Use designated SCRATCH fixtures and automated fixture auth. Real login/email/handoff require their own evidence. Fail closed on wrong targets; no automated mutation of shared DEV/Coach data. Payment-provider scenarios require declared sandbox/event isolation and effects.

Specify ownership, meaningful assertions, failure/flake handling, safe evidence and candidate binding. Consolidate Cody and human findings for Claudy's repair/retest. Estimate runtime and Tony's effort from measurements rather than promising a fixed budget now.

Please carry DC-002 alongside DC-001 into the eventual doctrine/template synchronization and report what must change before closing either action. No new toolchain, scheduled automation, CI configuration or test execution is authorized by this planning brief.

## Entry 003 — Friday's review received; Architect disposition

Date: 24 November 2026 · Asia/Dhaka
Sources read in full:
- `QA_LEAD_AMENDMENT_ABM007_FINAL_HUMAN_WALKTHROUGH_2026-11-24.md`
- `QA_LEAD_REGRESSION_STRATEGY_RECOMMENDATION_2026-11-24.md`

Status: **Architect recommends adoption with the amendments below. Director adoption of DC-002's final strategy remains pending. DC-001 remains an approved Director requirement. Neither central doctrine synchronization nor installed-QAM amendment is claimed complete.**

### Receipt and evidence limits

Friday recorded DC-001 and produced specific current-QAM edits. She reviewed her authoring package, not the installed repositories or latest completion review. Her regression inventory uses earlier engineering summaries and baseline counts, not current candidate inspection. Preserve that provenance. The completion review 02 logs inspected by JARVIS report 394 OwedBook and 584 Portal tests; Friday's 374/572 counts describe the earlier baseline and must not be relabelled as current results.

Friday reports that neither journal entry reached her. The prepared messages did not constitute journal delivery. Tony should attach this updated journal with the reply. No external message or attachment has been sent by JARVIS.

### Director's preserved-working-behavior principle

Tony described the WinRunner-era practice: record working journeys, retain explicit pass checkpoints, and replay them on subsequent builds after new-feature testing. This is the intended standing regression model.

Bank accepted behavior as maintained scripts with observable assertions, known fixture state, independently expected outcomes and recorded passing candidate identity. Carry them forward. Change their expected results only when an attributable product-contract amendment warrants it, not because the new build fails. Manual history is a source for test authoring, not retrospective proof that an automated script passed. Rebaseline visual assertions only through reviewed acceptance of the changed behavior.

### Human walkthrough amendment — Architect position

Agree with the Q2 placement, QA Lead selection, explicit fields, combined findings, affected retest and separate Gate D. Carry these exact qualifications into installed routing:
- The normal order is automated campaign then grouped human walkthrough before adjudication. Human access/MFA prerequisites may occur earlier when needed; this is not a reason to create another QA shot.
- A person records only their actual observations. JARVIS guiding Tony does not make JARVIS an independent performer; no agent may fabricate Tony's response.
- Eight checks/about 30 minutes is a planning target for Friday to optimize, not permission to omit a required acceptance criterion. If more is essential, explain and obtain the scoped plan decision.
- A real phone check needs a declared available device. Emulation is useful but cannot be labelled a real-device pass. Unavailable hardware is surfaced in Q1.
- Preserve the exact current module's effects envelope, including any already authorized paid path. This amendment neither authorizes nor cancels it.

### Regression proposal — required amendments

| ID | Friday proposal | Architect disposition |
| --- | --- | --- |
| RA-01 | Retain CR-01 to CR-12; core plus triggered coverage | Agree as the target register. During Q1 map each item to actual coverage, original ACs and missing work. No assertion that all 12 already exist or must be implemented inside the current E2. Future activation of the standing pack follows its verified baseline |
| RA-02 | Tier 1 is “no purchase” | Amend: “non-purchasing” does not mean read-only. Invitations can send email; accepting/revoking and role changes mutate fixtures; scheduling/undoing store removal can mutate Stripe and the database; portal/checkout creation also has effects. Every applicable test needs declared effects, target and isolation. Keep provider-free mocked/service coverage distinct from actual provider calls. A routine core run must not silently invoke Stripe lifecycle mutations |
| RA-03 | SCRATCH may be reset every campaign; Cody owns creation/reset | Do not adopt blanket authority. Preflight should verify the known fixture state. Reset only specifically designated disposable fixtures under a separately approved idempotent seed/reset contract, with target verification and no concurrent writer. SCRATCH is a target label, not evidence that whole-database destruction is safe. Existing reuse authorization does not authorize creation, credential changes or resets. Raise incompatible fixture needs in Q1 |
| RA-04 | Rerun any failed test up to twice; three failures classify FAIL | Amend: preserve and report the first failure immediately. Repeat only when useful and safe, after classifying wrong-target/environment/instrument/product conditions. Never automatically repeat a side-effectful payment/invitation/removal operation. Mixed outcomes remain an intermittent finding; later passes do not erase failure. One reproducible failure may suffice. Quarantine needs an owner and review/closure condition; no mandatory calendar deadline and no silent acceptance loss |
| RA-05 | Q2 always finishes before repair; repairs on QA branch | Consolidate after unaffected approved work is complete where safe. Preserve immediate stops for wrong target, isolation breach, data corruption, compromised instrument or a genuine prerequisite. Follow the installed module Git/repair policy and Tony's Git authority; neither this journal nor generic strategy changes the repair branch. Durable product tests/helpers need an approved engineering retention route; do not merge QA debris by default |
| RA-06 | <15 minute core; <=8 human checks/about 30 minutes; REG-001 2–3 days | Treat as provisional planning goals/estimates, not measured results, universal limits or deadlines. Measure once a valid baseline exists. Required coverage does not disappear to meet a cap; Friday narrows duplication and escalates only essential excess |
| RA-07 | REG-001 after certification | Agree with separately scoped regression-infrastructure work after current-module certification/closeout as appropriate. Preserve approved reusable QA scripts/evidence before ephemeral branches or files are cleaned up. Specify retention now; implement the maintained pack under the later bounded assignment. No new framework or infrastructure authorized |
| RA-08 | Core naming convention during current Q2 | Agree only where checks already belong to approved scope. Reuse CR IDs as mappings; do not require exactly one file per journey if fixtures/shared setup make another layout clearer. Q1 proposes, Friday approves; naming does not grant new effects |
| RA-09 | “Three tiers” | Clarify actual names and commands before implementation. The recommendation numbers Tier 0 and Tier 1, with triggered broader campaigns as the third group. No additional mandatory QAM shots are created |

### Proposed first implementation

Use current approved Q2 to write and retain reusable current-screen probes for its accepted requirements. After their actual pass and adjudication, preserve exact scripts, assertions, fixture specification, permitted effects and passing identities. Route the conversion into a durable repeatable regression pack through proposed REG-001, separately estimated and released. Keep private credentials and raw auth state out of retained assets. This directly implements Tony's preserved-checkpoint approach without inflating current E2.

### Follow-up actions

- CJ-002: Friday received the ruling text; the journal attachment itself is still unconfirmed. Carry the updated journal with the reply.
- CJ-003: Friday's amendment is received. Installed-QAM changes and current routing verification remain OPEN.
- CJ-008/CJ-009: Friday received the regression request and returned her recommendation; journal attachment still missing. Architect review completed here; amended final strategy and Director decision pending.
- CJ-013 — Tony: approve/adapt the final DC-002 strategy after these qualifications; no blanket reset/provider-effect permission is inferred.
- CJ-014 — Friday: incorporate RA-01 to RA-09, reconcile old inventory at Q1, and produce the authoritative narrowed test/human plan for candidate approval.
- CJ-015 — Architect/Engineer under Director authority: install the DC-001 current-module documentation amendment before Q1/Q2 routing depends on it; verify against the actual installed pack rather than the authoring snapshot.
- CJ-016 — QA Lead/Executor: mark reusable QA scripts for safe retention before cleanup, for possible REG-001 adoption.

Central doctrine remains OPEN for DC-001 and DC-002 until the maintained playbooks/templates are updated and their consistency is verified. Receipt of Friday's documents alone does not close either doctrine action.

## Entry 004 — Revised Friday documents reviewed

Date: 24 November 2026 · Asia/Dhaka
Sources: uploaded human-walkthrough amendment revision 2 and regression recommendation revision 3 (filenames ending `(1).md`). JARVIS compared both revisions against the preceding documents; the unchanged text was reviewed during Entry 003.

Architect disposition: **Ready for Director adoption with the banking clarification below.** Friday incorporated RA-01 through RA-09, acknowledged receipt of journal v0.3, retained historic-count provenance, narrowed mutation/reset authority and preserved Q1/Q2. DC-001 remains Director-approved; DC-002 final adoption is not inferred from the file upload. Installed-QAM amendment and central doctrine/template synchronization remain OPEN.

### Banking clarification for adoption, not another review campaign

Agree to preserve certified passing scripts, assertions, fixture requirements, allowed effects and their passing candidate identities. The first maintained-pack conversion remains separately scoped REG-001.

Do not require a separate engineering assignment after every future Gate Q merely to satisfy banking. Engineering should add maintainable regression tests during the normal authorized E2/repair work where practical; Q2 validates them. Retaining unchanged certified scripts is closeout/retention work. Promoting independent QA-only helpers into maintained product test paths is a bounded engineering change under the applicable policy, with appropriate validation and candidate-impact review. Do not merge QA debris, silently change a certified candidate, or retroactively call a newly adapted script certified without running it.

The policy should say “retain and bank reusable certified checkpoints” rather than imply every one-off probe belongs in the always-run core. Keep the full safe evidence archive; select standing-suite membership by applicability, maintainability, risk and effects. Provider-specific scripts may be retained without running in the ordinary core. Preserve manual checklist wording separately.

### Repair sequencing

Accept Friday's retained standing rule: no product repair starts while the Q2 campaign is actively running. A genuine stop suspends unsafe execution and returns for disposition; it does not authorize an ad hoc repair. The Lead can close the attempted run honestly as FAIL/BLOCKED and issue a consolidated repair work order under existing policy. There is no need to soften this rule or ask Tony to resolve it again.

### Next actions

- Tony: adopt the revised strategy with the banking clarification above, or state a change. No reset, provider effects or execution release is bundled with adoption.
- Architect/Engineer: carry the approved DC-001 documentation amendment into the actual installed QAM, with its next free ruling identity and verified routing, before QA depends on it.
- Friday/Cody: candidate-specific Q1 retains the approved human lane and maps actual regression coverage/gaps; no new mandatory QA shot.
- Journal: DC-001/DC-002 synchronization and REG-001 preparation remain tracked, not completed.

## Entry 005 — Director adoption and E2 package 03 review

Date: 24 November 2026 · Asia/Dhaka
Director source: Tony: “i agree 100% ... gave friday the prompt” after the Architect's banking clarification and implementation sequence. Record DC-002 strategy adoption with that clarification; installation, implementation and central doctrine sync remain separate pending actions. No blanket reset/provider permission or Q2 release is inferred.

Reviewed artifact: `ABM007_FINAL_E2_COMPLETION_REVIEW_03.zip`.
ZIP SHA-256: `7d4d2fc5691317fe42bcc63d50b0757e4c030a792434df9e6a275b615c0c20e1`.
Integrity: all 355 indexed members match their byte counts and SHA-256 values; 356 files total, with only FILE_INDEX.json outside its own index as intended.

Architect disposition: **Accept engineering completion for QA intake, with the QAM documentation amendment to be installed before candidate handoff. This is not Gate Q, release or final module closeout.** The local review inspected supplied source/evidence snapshots, not Tony's live VM, database or independently executed test suites.

Evidence inspected:
- Original/amended email template and one-line heading diff; S-1 prepared, not externally applied.
- Exact approved old-logo replacement with h-7/w-auto; S-3 source correction complete.
- Two allowed mobile overflow fixes: wrapping ScreenHeader actions and DataTable stacked label/value text.
- SCRATCH authentication helper, fixture allowlist, resolved-target/runtime safeguards and tooling guide; no production auth change. QA may reuse a copy in its own declared lane after independent review and preflight, preserving the target restrictions. Both auth.mjs and serve.mjs constrain the scratchpad prefix; a QA copy must reconcile all such checks, not assume a single occurrence.
- Supplied unit logs: OwedBook 394/394, Portal 584/584; typecheck/lint and final SCRATCH build evidence. Lint warnings remain 38/27. verify4 summary retains an earlier failed instrument run; the final scratch_build_check.json records both builds exit 0 and backend_ok true. Keep that provenance explicit rather than hiding the failed preflight attempts.
- 68 signed-in page loads; representative actual screenshots inspected at mobile OwedBook Billing and desktop Portal dashboard. These supplement source review; no full independent visual certification is claimed.
- Bounded redirect reproduction: two 20-run attempts. No sign-in redirect observed. Each attempt has 18 complete routes and two WebKit warm navigation interruptions; do not call this 40 clean completed journeys. Historical route is not fully reconstructable. O-1 remains a QA follow-up with cause unproven, not a declared product defect or a waived finding.

Carry into Q1: O-1 WebKit interruption, zero-store/removed-access rendered states, independent contrast across states, browser matrix, actual normal sign-in/handoff requirements, candidate identity and new human/regression QAM provisions. External email/Stripe application and deployed checks remain separately tracked. No beta deployment change belongs in this module.

Next sequence: receive/install Friday's finalized docs-only amendments against the actual QAM; update factual handoff/state and exact staging lists; Tony reviews and commits the candidate in both repositories; Tony creates qa/abm007-final at those commits and releases Q1; Cody recon/plans; Friday adjudicates that plan before Tony releases Q2. Claudy remains available for accepted repairs. Full Architect/module closeout follows certification and the required cleanup/deployment sequence.
