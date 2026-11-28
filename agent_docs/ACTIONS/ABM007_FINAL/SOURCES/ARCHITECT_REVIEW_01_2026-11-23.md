# ABM007_FINAL — Architect review 01

Date: 23 November 2026, Asia/Dhaka  
Reviewer: JARVIS, Architect  
Author: Friday, acting co-architect; returning to QA Lead after authoring  
Verdict: **ACCEPT WITH EXACT AMENDMENTS.**

The architecture and bounded finalization approach are accepted. This is a review verdict on a draft, not a frozen contract, visual approval, engineering release, Q2 release or deployment authorization. Resolve A-01 through A-06 below in one authoring amendment. Preserve the existing module ID, settled Director decisions and historical evidence. Do not restart recon or redesign the package.

## Evidence and limits

Reviewed the supplied ABM, acceptance criteria, contracts, QAM routing/preflight/risk requirements and report skeletons, design source, source register and relevant supplied Factory playbooks. Visually inspected a contact sheet containing the desktop style tile, both desktop dashboards, mobile plan and mobile Help renders. This was not a full inspection of all twelve images, and no visual approval is implied.

The ZIP passes its archive integrity check. All 89 indexed members match their declared sizes and SHA-256 values; membership matches the extracted files. There are 90 files including the index. The separate REVIEW_START_HERE.md is byte-identical to the packaged copy.

Reviewed ZIP SHA-256:

`9f7d784489d798206a1d7ca9f2964eebf7f4eb931c4aad196f73c485f37cddf3`

This review did not inspect the live repositories, execute either app's test suites, inspect current dashboards, certify alpha or verify the Engineer's reported test counts. Local browser rerendering was attempted but could not launch Chromium in this environment. The contrast finding below is independently calculated from the actual CSS declarations, not a claim of browser measurement.

## Accepted architectural positions

- Light-only enforcement, two practical layout families, signed-in navigation on Help/Add Pharmacy, and the existing naming/pricing decisions are carried correctly.
- A canonical module in the Portal with an OwedBook pointer is reasonable. Both repositories must remain part of every candidate identity and relevant diff.
- Gate V before engineering rollout is reasonable once the visual inputs are corrected. Static samples approve visual treatment; the real source and preserved-behavior contract govern actual fields, controls and workflows.
- The protected-path and no-dependency approach is accepted, subject to the conflict rule in A-05. No permission to change protected auth/payment code is implied by including a bounded reproduction.
- Gate Q may certify its explicitly scoped predeployment criteria while external delivery, hosted settings and deployed verification remain pending for Gate D. Neither a Gate Q PASS nor a successful deployment closes the whole ABM.
- Friday may return from contract author to QA Lead. The safeguards are this architectural review, a different engineering/QA execution assignment, independent expected results, Director risk decisions and separate certification/release authority. Contract authorship alone does not invalidate QA leadership.
- Reusing recon, treating engineering reports as claims, keeping future results pending, preserving the rehearsal account, and reconciling stale records with the later rehearsal are correct.

## Required amendments

### A-01 — Preserve the exact brand colors; correct contrast evidence

Priority: blocks the brand contract and Gate V.

Affected: DESIGN/tokens/abm007_final_tokens.css, DESIGN/source/col.py, BRAND_UI_CONTRACT.md, all derived references and AC-B01/B08.

The CSS value `168 53% 34%` is not exactly `#288472`. Its sRGB channels before byte rounding are approximately (40.749, 132.651, 114.271), and its white-text contrast is approximately **4.4935:1**, below 4.5:1. Its nearest 8-bit color is #298572. By contrast the approved #288472 is approximately **4.532:1** on white. The navy has the same conversion problem: `210 69% 27%` rounds to #154574 rather than the approved #154474.

The helper currently rounds HSL conversion to whole numbers and its contrast calculations use hardcoded hex values in places. Those calculations therefore do not establish contrast for the CSS actually used by the sample pages. Correct every anchor and alias, rather than only the main button.

Required:

1. Generate sufficiently precise HSL values from the approved hex anchors, retaining the existing Tailwind-compatible triplet format. For example #288472 is approximately `168.2608695652 53.4883720930% 33.7254901961%`.
2. Calculate contrast from the values the stylesheet actually renders, including states and composited backgrounds. Keep nominal hex comparisons separate from measured/computed CSS values.
3. Update comments, contract tables, references and renders consistently. Do not change Frank's approved hex values to compensate.
4. Add one meaningful verification of actual resolved colors and their contrast; avoid relying solely on a unit test that repeats token literals. Preserve the deliberately failing control for the contrast instrument.

### A-02 — Finish the visual approval inputs

Priority: before Gate V; no product redesign requested.

Affected: DESIGN sources/renders/README, UI_SPEC.md, logo specification and reference descriptions in QAM/ABM files.

The exact original logo is available and included with this review under AUTHORING_INPUTS/Pharmacy-Books-Logo-Primary.png. Its SHA-256 matches the contract:

`e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd`

Replace placeholder tiles with that unaltered master, preserving aspect ratio and white-tile treatment. Show a visible mobile navigation trigger in signed-in samples and its open state on at least one representative sample. The current mobile CSS hides the navigation without showing a replacement. Samples may remain static; clearly label any illustrated interaction.

Regenerate all twelve renders after A-01/A-02. Inspect the final outputs, not earlier versions, and report exactly which were inspected. Fictional fixture data is acceptable. Do not present omitted navigation or approximate screen content as approval to remove/reorder existing behavior. Final icon exports remain engineering deliverables; any altered mark still needs Tony's visual decision.

### A-03 — Make the email acceptance matrix match supported flows

Priority: before contract freeze.

Affected: AC-E02, EMAIL_AND_STRIPE.md section 1 and session table, REVIEW_START_HERE and any corresponding handoff/checklist wording.

The requirement for an invitation to succeed in each app invents a Portal invitation workflow. The recon identifies OwedBook's store invitation flow and the shared Magic Link template; it does not identify an invitation feature in the Portal.

Replace the blanket sentence with explicit coverage:

- Real emailed sign-in to OwedBook and to Account & Billing, each using the correct local and alpha callback destination.
- A real existing OwedBook store invitation and its acceptance/access outcome, checked for local and alpha destinations where supported.
- Preserve all existing template branches, query parameters and encoding. Do not add a Portal invite feature or change token/callback logic to satisfy a mistaken test row.
- Postpurchase access-email coverage, if claimed, uses an already authorized purchase journey or existing evidence with provenance; no extra purchase is authorized by this review.

Name the project, fixture owner and permitted effects for the Director-observed Gate D checks. Use a separate designated fixture for invitation mutations; preserve the three-pharmacy rehearsal account/history. Keep local SCRATCH QA and deployed DEV verification scopes explicit. Keep actual delivery results pending until observed.

### A-04 — Deliver self-contained governing sources and QAM structures

Priority: before declaring the amended pack ready for engineering handoff.

Affected: QAM/GOVERNING/, QAM skeleton preambles, QAM manifest/packaging, source register and skills manifest.

QAM_PLAYBOOK requires available governing sources and a complete module-specific QAM from authoring. It explicitly says the Director should not assemble QA documents. Leaving a Director copy task and telling future owners to expand thinner skeletons from an unavailable Hub is not accepted as a completed packaging method.

The review includes byte copies of the five relevant project-supplied playbooks, including QA_PLAYBOOK **v1.2**, which was not read during authoring. Read and reconcile that QA playbook. Use these supplied sources with truthful provenance and hashes; do not invent a Hub commit. If a specific Hub identity remains unavailable, state that limitation and any exact reconciliation needed, rather than claiming it was verified.

Instantiate the remaining required structures now. Future execution fields/results properly remain pending, but their field definitions and ownership must not depend on an unavailable template. Exact byte copying of a template is not the goal; a fresh authorized executor must have a complete usable assignment. Remove the blanket 'the Hub template governs wherever thinner' delegation after reconciliation. Resolve actual root instructions narrowly at engineering entry, as already planned.

### A-05 — Remove conflicting authority and acceptance instructions

Priority: before contract freeze.

Affected: parent CLAUDE.md/AGENTS.md, ABM_ENTRY.md, NO_BREAK_AND_PATHS.md, BACKLOG_DISPOSITIONS.md, AC-R04 and related QA expectations.

1. Replace blanket 'root rules win' wording with: read and obey applicable repository instructions; preserve explicit Director decisions and approved module exceptions; surface a real conflict affecting scope, permissions or grading with both sources and stop only the affected work for resolution. A generic root rule must not silently reverse settled light-only or branding decisions. This does not let a module erase repository protections or tool restrictions.
2. Reconcile records permissions with the protection of RECOVERY.md. State which record updates are allowed during engineering and which require the closeout checkpoint. A general records allowance must not implicitly authorize a protected recovery rewrite. Retain the narrow reconciliation of the three existing OwedBook record changes.
3. AC-R04 requires audit older-event paging, while the backlog allows it to become not applicable simply because a fixture lacks older history. Missing fixture data is not feature nonapplicability. Plan a bounded synthetic fixture that exercises paging, or record BLOCKED and seek a specific QA Lead/Director disposition. Do not silently count it as covered.

### A-06 — Make the shared-Stripe QA condition operational

Priority: contract wording now; proof at Q1 before Q2 payment authority.

Affected: P-19, QAM risk MR-11, PF-4.7, permitted effects and Q1 plan requirements.

Keep SCRATCH and QA fixture customers, but state explicitly that a second listener and a different database do **not**, by themselves, isolate events from alpha's endpoint in the same Stripe sandbox. Q1 must identify actual event routing/handling and prove QA events cannot mutate alpha/DEV, and alpha events cannot mutate the QA database. Process listings alone do not prove that property.

If existing configuration cannot provide this, return one concrete target/handling proposal for Director authorization before paid Q2 tests. Do not edit protected payment/webhook code, disable alpha's endpoint, create another sandbox or run purchases without the relevant release. The proposed USD 400/test-operation ceiling remains a proposal, not permission from this review. Nonpayment work may continue where independently safe.

## Director decisions and scope recommendations

Do not send Tony twenty-two technical questions. Consolidate the existing proposals without misattributing approval:

1. **Visual choice:** after the corrected final renders, approve or amend ice page surfaces, darker semantic colors on their permitted surfaces, white KPI cards and neutral role labels (P-01 through P-04). The Architect recommends these treatments; Gate V is still Tony's decision.
2. **Finalization scope:** recommend the bounded wording/branding changes, minimal landing repair, targeted empty-state fix, bounded redirect check, canonical Portal pack, stale-test mapping and one regression run. Defer the statement descriptor, advanced payment exceptions, scheduler/expiry, transfer/populated claims, APA terms, full password matrix and older usability work as explicitly listed. Mark each proposed disposition with its real approver when ruled. Do not call unresolved later-candidate payment evidence certified.
3. **Execution resources:** QA Executor assignment and the final isolated QA target/effects envelope remain Tony's decisions. The proposed ceiling is a maximum, not a test quota; the plan must justify necessary purchases.
4. **External settings/deployment:** retain the grouped read-only S1 inspection before email/Stripe preparation and the separately authorized application/deployment sequence. Alpha rollout remains per service after Gate Q; whole-module closure also requires the applicable Gate D evidence.

For each deferred item, name an owner and a destination work order/readiness register. 'Gate D' alone must not imply this module's short branding-verification session includes all deferred lifecycle/payment work. No scheduler, production cutover or advanced payment functionality is added here.

The 9–13 engineering day estimate is an author estimate pending the Engineer's approved-plan estimate. Keep engineering, independent QA, external configuration, unestimated repair/retest and approval waits separate. Do not turn this review into a promised delivery date.

## Requested return

Return **ABM007_FINAL_AUTHORING_REVIEW_02.zip** with the six exact amendments applied throughout, corrected visual references, complete source provenance, a short amendment-to-file evidence table, refreshed member index and external SHA-256 receipt. Keep this review as an attributed source. Preserve all unissued approvals/results as pending.

This is a bounded correction pass. The next Architect check will verify these amendments and any consequences of Director choices, not reopen the accepted architecture or ask for another general recon.
