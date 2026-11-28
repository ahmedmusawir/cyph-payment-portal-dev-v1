# Cyber Pharma — APBM-007B campaign and doctrine journal

Version: 0.3. Updated: 23 November 2026, Asia/Dhaka. Opened: 16 November 2026, Asia/Dhaka.
Author: JARVIS, Architect. Requested by: Tony, Director.
Scope: preparation, engineering checkpoints, repair, DEV application, alpha deployment, customer rehearsal, QA-guide rework and the product Help handoff. Historical entries remain intact; the latest dated entry controls current status.

## Purpose and evidence limits

Identify the specific conditions that break the intended process, record their effects, and turn them into practical prevention rules. Record legitimate discoveries separately from avoidable coordination failures. This journal proposes process improvements; it does not amend product scope, certify a pack or grant a release.

Evidence is the visible campaign conversation and available pack records. Earlier attachments referenced but unavailable are not treated as independently verified. The Director's latest timestamp is retained as supplied; precise ordering relies on the conversation because displayed times differ. No precise delay or cost measurement is claimed.

## Campaign position at v0.1 (historical)

The amended v1.0 r1 PENDING_RELEASE pack was downloaded and installed successfully in the Payment Portal repository. Tony then explicitly requested the E2 prompt. JARVIS issued a start prompt allowing independent authorized work while retaining unresolved dependencies. No Claudy execution return has been received in this journal's evidence.

The prompt records two open matters: decision 9 on restoring history for a same-owner paid re-add, and the original pre-E2 v0.1 Friday review file. Friday's confirmation of the successor amendment diff was also not recorded. Therefore a clean, fully resolved, one-shot E2 handoff was not achieved. Installation success proves installation only.

## Intended campaign sequence

JARVIS prepares; Friday reviews. Claudy performs E1 recon. JARVIS reconciles findings and freezes the build contracts and QAM; Friday reviews the frozen pack; Tony releases E2. Claudy performs the coordinated build and factual QAM handoff. Cody performs Q1 recon and test planning; the QA Lead approves the plan and Tony releases Q2. Cody executes QA. Friday analyzes findings; JARVIS prepares consolidated repair scope; Claudy repairs on the continuing QA branches and Cody retests. Friday certifies; required cleanup is completed and accepted; JARVIS issues closeout instructions; Claudy closes out; Tony merges and pushes. Deployment and Gate D require their separate release.

Engineering and QA share the continuing QA branches during repair, with one active writer at a time. QA findings and repair history remain traceable. A review of a brief does not certify an unseen E1 return or release E2.

## Breakdown register

| ID | Trigger and observed failure | Consequence | Prevention and owner |
|---|---|---|---|
| CJ-001 | Advance briefs were reviewed before Friday received E1 and capability evidence. Review limits were correctly disclosed, but the later handoff still required evidence assembly and reconciliation. | A brief disposition could be mistaken for readiness of the eventual build pack. | JARVIS labels exactly what a review covered and bundles all mandatory returns for frozen-pack review. |
| CJ-002 | Provider evidence exposed billing behavior incompatible with preserving earned APA discount; the billing mechanism changed after earlier checks. | Earlier probe success no longer proved the selected build mechanism. | JARVIS marks affected proof invalid for the new design and supplies an exact CP1 with pass criteria, bounded fallback or stop, and effects budget. |
| CJ-003 | Additional focused checks and source receipts were needed after E1. | The planned recon-to-build transition gained extra exchanges. | Before E1, JARVIS inventories decisions that need source evidence, provider evidence and Director rulings; the recon mission requests their combined return. New discoveries remain legitimate exceptions, not fabricated completeness. |
| CJ-004 | A QAM folder existed in the repo, while reconciliation with the actual Factory template source was still outstanding. | Folder presence and template readiness became confused. | JARVIS separately records scaffold present, authoritative templates received, reconciliation complete, and engineering handoff populated. |
| CJ-005 | Friday requested the original v0.1 review with a precise hash, but the available material included its conversation transcription rather than the required original bytes. | An evidence-packaging dependency surfaced at final issue. | At intake, JARVIS checks every listed attachment against received files once. Record original, transcription, or absent. Escalate a missing original early; never reconstruct it as hash-identical. |
| CJ-006 | Recommendations 1–8 were approved; a later recommendation 9 remained unruled as the pack reached installation. | The build still depended on an unresolved product behavior. | JARVIS maintains one numbered decision register with exact question, recommendation, authority and status. Ask newly discovered decisions when discovered, alongside independent work. Earlier approval never covers a later number by inference. |
| CJ-007 | JARVIS reported edits and blockers without delivering the requested ZIP; Tony had to demand the download. | Director effort shifted from reviewing work to chasing the deliverable. | Every artifact handoff includes the actual download, exact status and next action in the same reply. If unfinished, provide the requested useful draft clearly labeled, with only the necessary open items. |
| CJ-008 | A pending-release pack was installed, then the starter prompt authorized partial E2 while acknowledging missing decision and review confirmation. | Pack state, release wording and the promised one-shot run diverged. | JARVIS must distinguish installation from release and conditional work from a clean one-shot E2. A Director override is recorded precisely; it does not manufacture missing approval or policy. |
| CJ-009 | Repeated packaging, explanation and gate exchanges accumulated while Tony was trying to start the run. | Coordination became a material source of frustration and delay. | Use one consolidated amendment response, one decision request and one successor diff. Batch independent intake checks. Stop repeating completed checks without changed evidence. |

## Necessary discovery versus avoidable friction

Necessary work included testing actual payment behavior, preserving the Director's earned-discount ruling, defining failure and late-payment behavior, and amending contracts when evidence contradicted an assumption. Removing that work would reduce accuracy.

Avoidable friction included discovering missing source bytes late, leaving a new product decision open into installation, omitting the download from a deliverable response, and calling a conditional start a one-shot handoff. These are Architect coordination failures. They should be fixed by earlier intake and clearer artifacts, rather than by adding more review ceremonies.

## Proposed doctrine changes for this campaign

1. Before E1, include a compact readiness table: each design decision, required proof, source location, owner and fallback. Request the actual source receipt and capability evidence needed to freeze the contracts in the same recon mission where feasible.
2. Before frozen-pack review, collect the original governing reviews, E1 return, capability returns, Director rulings, source receipt, ledger result and authoritative QAM templates. Report missing inputs together once.
3. For an unproven capability, freeze an exact engineering checkpoint: prerequisite, commands or procedure, observable pass criteria, authorized effects, fallback and stop boundary. A checkpoint cannot choose an unapproved business policy.
4. Keep a single current readiness record. Distinguish draft, review candidate, accepted with amendments, amendments applied awaiting confirmation, released, installed and executing. A filename change does not create approval. A content change creates a new indexed identity.
5. For exact amendments, return one successor and a concise change ledger mapped to the review IDs. Request the agreed diff confirmation, not a repeated general review.
6. Make the final handoff concrete: download, installation command, then starter prompt. Include evidence and governing records in the package so the Director need not assemble them manually.
7. If the Director elects an early conditional start, record its precise scope and unresolved dependent work. Do not describe that as a fully ready one-shot E2 or infer missing decisions.
8. Append lessons at phase transitions and material exceptions. Carry unresolved lessons into the next lab handoff and propose Factory playbook changes after evidence shows the correction works.

## Open actions

| Action | Owner | Completion evidence |
|---|---|---|
| Obtain decision 9: recommend original record/history restored only for same-owner paid re-add; buyer history denial preserved | Tony rules; JARVIS records | Exact ruling and affected contract alignment |
| Resolve original v0.1 review provenance requirement | JARVIS with Director/Friday | Original file with matching hash, or explicit accepted alternative; no invented source |
| Record successor amendment confirmation or an explicit Director exception | Friday / Tony; JARVIS records | Actual disposition and its scope |
| Confirm what Claudy actually started and which dependencies remain blocked | Claudy returns; JARVIS reconciles | Engineering journal and execution return |
| Assess whether revised intake and handoff reduced extra exchanges | JARVIS at engineering handoff | Actual exception count and causes; no retroactive estimate |

These actions are not a request to restart recon or discard independent work already authorized.

## Future entry format

Use CJ-010 onward. Each entry records: phase; trigger; observed facts and evidence; expected behavior; actual divergence; necessary discovery or avoidable failure; effect; root cause with uncertainty; correction and owner; closure evidence; proposed doctrine change. Do not erase prior entries when closed; append the outcome.

## First assessment

The four-shot process remains the intended structure. Its weak point in this campaign was the transition from recon evidence to an executable frozen pack. We need better intake, earlier decisions, and a complete handoff—not fewer factual checks and not more ceremonies. Whether the proposed corrections work remains to be tested in this campaign.


## 17 November 2026 — checkpoint update (v0.2)

### Current position and source limits

JARVIS read r01 and r02 engineering checkpoint reports and verified all indexed file sizes/hashes: r01 128 payloads, r02 168. This establishes package integrity, not source correctness or independent QA acceptance. Claudy still reports ENGINEERING IN PROGRESS, not ready for Q1; no commit, staging, DEV apply or deployment is reported.

r02 reports 482 Portal and 310 OwedBook unit tests passing, local SQL proof 134/134, SCRATCH proof 130/130, both production builds passing and served identity matching. Further regression/accessibility checks passed across Chromium, Firefox and WebKit. One Firefox staff timeout passed on rerun and remains disclosed. Full lifecycle, live email and several provider-dependent product journeys remain unfinished.

### Decisions and recovered inputs

- Decision 9: Tony explicitly approved same-owner paid re-add restoring the original record/history, after successful payment; buyer history denial remains. r02 already records this ruling from Tony's forwarded continuation and implements it in 0069. It must not be asked again.
- 0061 was restored to the bytes already applied on SCRATCH; the compatibility trigger moved to 0068. 0069 contains the approved reactivation and transfer-registration behaviors. Rehearsals and SCRATCH forward application are reported successful. This avoids rewriting applied history. Acceptance of the added 0069 path and DEV apply remain separate from those test results.
- Friday's 17 November diff confirmation was supplied as conversation text. It confirms BP-01–09 against APBM007B_BUILD_PACK_v1_0.zip, SHA-256 08d5448b60d2410d08f25c5addfc73c842971db4a0bac9242c4a7d8d6ac31f01. The installation receipt names the r1 PENDING_RELEASE ZIP. Exact identity reconciliation remains open; do not equate the two by filename or assume the confirmation covers later changes. No new general review was requested by Friday.
- The original pre-E2 v0.1 review remains missing. Friday classifies its retention as record-keeping, not a reason to stop the build; it should be resolved before candidate commits.
- Friday recovered the 007A inbox cast: owner A odesk.keya@gmail.com; owner B odesk.shourav@gmail.com; admin keyabibo@gmail.com; member ashik.kobir@gmail.com; prospective invitee odesk.shourav+apbm007a-newowner@gmail.com. This recovers addresses, not passwords, inbox access, fresh identity status or verified delivery.
- JARVIS proposed accepting 0069 and increasing sandbox attempted simulated charges from USD3000 to USD4800, plus pay/hosted submissions from24 to30. A continuation prompt was supplied for Tony to forward if accepted. At this journal update, forwarding/approval of that latest prompt is not independently recorded. Other limits remain unchanged. DEV apply remains unreleased.

### New breakdown entries

| ID | Trigger / actual divergence | Effect and cause | Correction, owner and closure evidence |
|---|---|---|---|
| CJ-010 | Compatibility trigger was added to 0061 after its earlier candidate had already been applied to SCRATCH. | Source/ledger mismatch blocked the next forward run. Necessary compatibility discovery; avoidable mutation of an applied file. | Claudy restored applied bytes and moved the fix forward to0068; r02 receipts report checksum-preserving convergence. Applied migrations must become immutable at first shared apply. |
| CJ-011 | Remaining provider tests exceeded the attempted-charge ceiling; automatic retries consumed material allowance. | E2 stopped at an effects checkpoint despite remaining test coverage. Initial forecast did not provide sufficient end-to-end budget and contingency. | Claudy supplied one complete remaining-test budget including automatic attempts, exact current counters and one proposed increase. Tony approval still required. Preflight future runs against every counter and cleanup boundary. |
| CJ-012 | JARVIS said the inbox list had never been established; Friday recovered it from007A. | Tony was asked to supply information already held in campaign history. This was a continuity/intake failure, not a new product requirement. | Carry the recovered cast forward with source and environment state. Separate address recovery from private access and from fresh-invitee requirements. JARVIS owns correction; delivery proof remains open. |
| CJ-013 | Engineering's proposed inbox adapter assumed one account could receive all five addresses; recovered cast spans several Gmail inboxes. | An address list alone cannot satisfy the automated inbox-access requirement. | Claudy must verify actual receipt routing or support explicitly recorded manual verification. Do not infer forwarding or ask Tony for unnecessary credentials. No blanket substitution for independent QA requirements. |
| CJ-014 | Continued prompts and status questions crossed with a newer return: r02 already implemented decisions JARVIS was about to repeat. | Duplicate instructions risk reopening settled work. | Read the latest checkpoint before drafting a continuation; state what supersedes the previous prompt. Latest r02 is the execution basis, with only genuinely outstanding actions carried forward. |
| CJ-015 | Friday's confirmed ZIP identity differs from the installed archive name/identity record. | Review authority can be attached to the wrong bytes if inferred. Difference does not itself establish a contract defect. | Claudy compares exact archives/contract files and records correspondence or a precise delta; JARVIS retains the actual Friday source and does not fabricate confirmation. Open. |

### Updated open-action disposition

Historical v0.1 entries above remain unchanged. Decision9 is now CLOSED as a Director ruling; engineering implementation is reported, product payment proof remains pending. Engineering-start evidence is RECEIVED via r01/r02. Friday confirmation is RECEIVED as supplied text; its exact relation to installed bytes is OPEN. Original v0.1 source provenance is OPEN. Updated budget approval, 0069 acceptance, private email access, final engineering evidence and DEV apply are OPEN until their actual records arrive.

### Next return handling — avoid another open-ended loop

1. JARVIS reads the new return, verifies package integrity and checks unresolved items against actual evidence. Do not demand another E1 or rerun successful checks without a changed dependency.
2. If the return is another checkpoint, explain the exact outstanding action and consolidate it. DEV apply needs its final exact migration manifest, hashes, target and before-state check plus Tony's explicit release; pause on any mismatch.
3. If engineering is complete, verify the factual QAM handoff and candidate preparation records. Tony commits the paired engineering candidates and creates the continuing qa/apbm-007b branches in both repositories. Cody then receives Q1 recon/test-planning instructions.
4. Friday approves Q1 plans; Tony releases Q2. Cody executes the full approved QA campaign and records findings. JARVIS scopes consolidated repairs, Claudy repairs on continuing QA branches, Cody retests; Friday certifies after sufficient evidence. Keep one active writer per checkout.
5. Required cleanup precedes JARVIS closeout, Claudy closeout execution and Tony merge/push. Staging deployment and GateD stay separate releases. No engineering PASS counts as independent certification.

### Doctrine additions proposed for validation

Treat fixture identities, receiving inboxes, private access method and effects forecast as execution inputs checked before E2, alongside code contracts. Plan provider retries as charge attempts. Preserve applied migrations. Read the latest return before issuing more work. A grouped checkpoint inside E2 is acceptable when genuinely necessary, but repeated preventable input discovery means the intended one-shot preparation failed and must be measured honestly.


## 23 November 2026 — deployment, customer rehearsal and guide rework (v0.3)

### Current campaign position

Both apps reached the canonical alpha domains and the customer journey was exercised after deployment. Tony's November 21–22 rehearsal closed **14 of the original v2 guide's 15 sequences within the expressly narrowed client scope; one operator-only sequence was deferred**. This is not full engineering certification, production readiness or execution of the revised v3 guide.

The redesigned v3 Markdown recipe and matching v3 PDF are delivered. The v3 customer walkthrough has **13 sections and 45 mandatory completion criteria**, with optional/engineering work tracked separately. Its document checks passed; a fresh-chat behavioral rehearsal remains pending. Do not map 14/15 old results into 13/13 new results automatically.

The requested OwedBook Help page and dropdown correction have a concrete engineering handoff. No implementation, commit, push or redeployment of that enhancement is established by this journal. Coach's new testing run is not recorded as started or complete.

### Evidence register and limits

The entry draws on supplied engineering returns, the tester-agent records and Tony's explicit scope decisions. It records their reported checks; this authoring session did not rerun repository tests, query Cloud Run or Stripe, or inspect current production configuration.

| Source | What it supports |
|---|---|
| response_2026-11-19_115622_dev-0070-apply-result.md | Reported DEV forward application through 0070, checks and preserved compatibility. |
| November 19 runtime, invitation-mail and handoff returns | Local origins, mail-recipient restrictions and the need to make prepared test identities usable. |
| response_2026-11-20_082500_manual-qa-repair-report.md | Consolidated first repair batch and reported regression checks. |
| response_2026-11-20_093957_dev-0071-apply-result.md | Reported forward application of 0071 and preservation checks. |
| response_2026-11-20_130324_final-qa-repair-batch.md | Further authorization, payment-state, access-message, identity and audit corrections. |
| November 20–21 alpha deployment preparation and payment-alpha-deployed returns | Dedicated alpha services, source/upload boundaries, secret bindings, domain verification and deployed Portal identity. |
| response_2026-11-21_110610_payment-alpha-webhook-delivery.md | A signed resend received HTTP 200; limited conclusions described below. |
| APBM007B_Client_QA_Closeout_1121ts01(1).md and QA_rehearsal_journal(1).md | Final customer results, historical failed attempts, tester reports, screenshots, explicit deferrals and final account state. |
| v3 recipe and Rework Record | Revised instructions and legacy-coverage disposition; not new application test evidence. |
| APBM007B_Alpha_QA_Closeout_and_Help_Page_Handoff_2026-11-22.md | Concrete outstanding product work and deployment handoff; not implementation evidence. |
| Tony's authoring discussion and the delivered v3 PDF | Director experience, pace choice, three-journal requirement, Help scope and matching publication assets. |

### Engineering and deployment progression

1. **DEV forward application:** Engineering reported 0070 and later 0071 applied with the expected migration ledger and preservation checks. These supersede the November 17 statement that DEV apply had not occurred. No database reset is reported. The returns describe 71 ledger entries after 0071, with compatibility and access boundaries retained.
2. **Manual QA drove consolidated repairs:** reported corrections covered Add Pharmacy handoff, busy states, payment-method lookup and authoritative payment states, reload/resume behavior, removal confirmation and undo, Owner authority, honest read-only settings, profile identity/role, restricted-role navigation and truthful audit actors/events. Do not describe every later product observation as fixed merely because these batches passed.
3. **Regression evidence evolved with the candidate:** the first repair return reported 355 OwedBook and 533 Portal unit tests; the later batch reported 370 and 568. Deployment preparation subsequently reported 374 OwedBook tests and 572 Portal tests. These are different snapshots, not additive counts or independent QA certificates. Relevant type/build/lint/container checks were reported in the respective returns.
4. **Dedicated alpha deployment:** OwedBook and Payment Portal were deployed at the canonical domains below. Portal preparation reported a clean 270-file upload boundary, seven enabled secrets and a dedicated runtime reader. The deployment return reported a uniquely tagged image deployed by digest, HTTPS/domain/build-info verification and six existing services retaining their revisions. These are historical deployment receipts, not a fresh state inspection on November 23.
5. **Portal identity recorded:** source commit `6dd3de737acacff9685c0c2027246bf396f10c1d`, revision `cyph-v1-payment-alpha-00001-mwh`. Reinspect the actual repository and deployment before future changes; do not hardcode that identity as permanently current.
6. **Signed endpoint delivery:** one signed subscription-update resend returned HTTP 200. This supports endpoint reachability, successful signature/account/test-mode handling and the reported backing-service access. It does not establish whether the business result was processed, duplicate or ignored, and does not prove forced payment exceptions or scheduler execution.
7. **Deployed authentication:** alpha callback URLs and the email-template routing had to agree with the app origins while retaining local callback support. Tony then confirmed fresh sign-in, returning Portal access and app-to-app navigation. Adding an allowed alpha callback does not inherently remove the local ones. Record actual login results rather than making a template change stand in for proof.

Canonical entry points:
- OwedBook: https://cyph-v1-owedbook-alpha.cyberizedev.com
- Account & Billing: https://cyph-v1-payment-alpha.cyberizedev.com

The apps use sign-in handoff with separate app cookies. Do not describe the successful navigation as proof of a shared-cookie architecture.

### Final customer rehearsal record — original v2 numbering

| # | Sequence | Final client disposition | Evidence and boundary |
|---|---|---|---|
| 01 | Setup | PASS | Owner alias received mail. Separate browser profiles were removed from required setup. |
| 02 | Fresh Owner | PASS | Registration, consent-checkbox gating, $99 sandbox purchase, email and active first pharmacy. Production legal publication explicitly deferred. |
| 03 | Returning sign-in and app handoff | PASS | Tony confirmed sign-in, navigation and Stripe billing return. |
| 04 | Add Pharmacy B | PASS | Both apps showed the active second pharmacy; $48.98 paid proration and $148/month recorded at that checkpoint. |
| 05 | Invite Member | PASS | Invitation accepted; Member saw only the assigned pharmacy. Full invitation-lifecycle edges were not certified. |
| 06 | Delegate Store admin | PASS | Correct second admin alias accepted as Store admin; Owner retained access; Helper joined as Member. Initial wrong-role invitation retained in history. |
| 07 | Role boundaries | PASS on reported retest | Restricted-role billing behavior confirmed. Earlier unexpected Portal sign-in redirect remains a triage observation. |
| 08 | Identity, profile and mobile | PASS | Tester confirmed the required batch. Optional password changes not run. |
| 09 | Pharmacy settings | PASS | Owner could select owned stores; Store admin saw assigned store; current read-only behavior confirmed. |
| 10 | Schedule and undo removal | PASS | Access-now remained two; renewal count changed 2 → 1 → 2; audit recorded both actions. No actual period-end cutoff executed. |
| 11 | Remove access and inspect audit | PASS | Removed identity could authenticate but had no stores; Helper retained access; audit scope, filters, older events and timestamps confirmed. |
| 12 | Logout and fresh-link recovery | PASS | Both apps required sign-in after logout; a used link did not restore access; a fresh Helper link did. |
| 13 | Payment walkthrough | PASS within client scope | Ordinary third addition: one active pharmacy, $47.77 paid invoice and $197/month. Forced bank challenge/decline/reload/cancel branches remain unverified. |
| 14 | Timed jobs, transfer, populated claims | DEFERRED | Engineering-owned fixtures and procedures required. |
| 15 | State review and export | PASS | Three active, three at renewal, no unexpected pending changes. Third pharmacy deliberately retained. |

The proration amounts are historical observations, not reusable expected constants. Preserve accounts, pharmacies, invoices and invitation history. Do not reset the environment, delete the retained third store or repeat purchases to fit a new checklist.

### New breakdown and lesson entries

| ID | Observed divergence | Effect / attribution | Correction and closure status |
|---|---|---|---|
| CJ-016 | Supplied test aliases encountered invitation-recipient restrictions. | A prepared app test became a mail-policy troubleshooting exercise. | Prepare and prove mail routing before releasing a recipe. Local/DEV open-mail policy was reported later; it is not a production-policy recommendation. Setup lesson retained. |
| CJ-017 | Initial deployed sign-in setup still needed matching alpha redirects and email-template branches. | Working domains alone did not establish working login emails. | Align allowed callbacks, template routing and app origins; retain local destinations. Tony's subsequent login and handoff observations supply customer evidence. |
| CJ-018 | The recipe asked users to choose/confirm an unused technical run code and create browser profiles. | Setup delayed the first meaningful app action and made customers responsible for harness mechanics. | v3 asks preferred name and pace, generates a short readable label, proves one mailbox and starts signup in the current browser. No profile ceremony. Written correction delivered; fresh-chat behavior pending. |
| CJ-019 | Pasteable emails were prose links; form fields arrived one at a time; the guide asked for an allocated unused NPI. | Repeated copying, extra turns and infrastructure work shifted onto the tester. | Supply every visible form together, each pasteable value in its own code block; provide checksum-valid synthetic NPI candidates. Format validity is not proof of registry nonassignment or database availability. Handle actual form rejection without a new paid purchase. |
| CJ-020 | Agent asked Coach/Frank-style users to confirm Stripe sandbox configuration. | A nontechnical customer could not answer; ordinary testing stopped. | Engineering owns pre-release setup. v3 uses the prepared alpha premise and supplied public test payment values. Never ask users to certify secrets, webhooks, cloud services, scheduler or deployment identity. Stop affected action only for an actual visible contradiction. |
| CJ-021 | Agent moved between sequences without explicit user direction and left widespread partial results. | After hours of work, progress looked negligible; repeated identity switching and vague reconciliation increased effort. | One active section, explicit finish line, use existing evidence, close verdict before advancing. Only an explicit tester jump/defer permits departure. No generic Partial state. v3 implements the rule in text; compliance still needs rehearsal. |
| CJ-022 | Status prose hid completed work and used vague unfinished descriptions. | Tony could not see what was done or how far the run had progressed. | Exact DONE count and denominator; visible green checks only for completed sections; exact missing criteria; Done rows say None under unfinished work. Failed/blocked/deferred remain honest. |
| CJ-023 | Unpublished Terms/Privacy links held a successful alpha signup from green. | A deferred production-content item became an unauthorized customer-test gate. | Preserve Tony's explicit production deferral. Test checkbox gating now; track publication separately. Never report unpublished documents as passed. Do not ask customers to publish or approve missing policies. |
| CJ-024 | Every small click triggered screenshot requests; pacing assumed the same familiarity for everyone. | Slow interaction exhausted an experienced tester. Tony also recognized newcomers may want more explanation. | Ask Fast or Guided. Fast uses small related batches; Guided explains one screen at a time. Both supply whole forms and use the same completion criteria. Ordinary precise tester reports are valid evidence with their basis recorded. |
| CJ-025 | Role-like alias names were treated as if they explained how permissions were granted. | Initial admin invitation was sent as Member and later needed correction. | Explicitly state the role to select; alias text grants no permission. Record actual invitation role, acceptance and assigned store. Preserve mistaken attempts and subsequent retests. |
| CJ-026 | An ordinary successful third payment was grouped with exceptional payment scenarios. | Sequence-level green risked implying challenge/decline/reload/cancel proof that did not exist. | Record the narrowed client outcome and unrun engineering branches separately. No all-payment-exceptions or exactly-once certification from a normal payment. |
| CJ-027 | “No permitted stores” appeared alongside real selectable stores. | Contradictory product copy confused users despite available access. | APP-01 engineering action: reproduce zero/nonzero-store states across roles and correct actual rendering condition/copy without broadening permissions. Not yet established fixed. |
| CJ-028 | Store admin once reached Portal sign-in unexpectedly; later boundary retest passed. | A historical issue could be falsely erased or presented as a persistent reproduced defect. | APP-02 triage retains both attempts. Reproduce route/session/role conditions; report not reproduced when appropriate. No speculative auth weakening or invented repair. |
| CJ-029 | Guide lessons, product defects and user suggestions were not cleanly separated. | Process friction could be confused with product failures or unapproved feature scope. | Maintain three journals: test results/defects; guide lessons; user feedback. Feed validated lessons into the future AI Augmented QA Testing Playbook. |
| CJ-030 | PDF and Markdown versions could diverge after recipe rework. | Coach could receive contradictory setup and completion instructions. | Deliver matching v3 assets, retire v1 PDF from the current package. v3 PDF generated, page layout inspected and delivered November 23. This proves publication alignment, not model compliance. |
| CJ-031 | Successful QA exposed the need for product guidance beyond a test recipe. | Actual users need page-by-page task explanations after the testing chat is gone. | Help enhancement specified for OwedBook, with roles, staff, billing, settings, audit and sign-in; claims guidance reserved. Concrete handoff delivered; implementation and deployment pending. |

### Revised customer QA doctrine for the next release

These are Director-requested operating rules for the next recipe, not evidence that every Factory document has already been updated.

1. **Prepare the environment before inviting customers.** Users test the product experience; engineering verifies infrastructure separately. Remove technical setup quizzes from human customer sequences.
2. **Ask preferred name and pace first.** Do not assume Tony. Fast and Guided change instruction size and explanation, never quietly lower coverage.
3. **Keep setup short.** Generate a readable label from the tester's name with a small suffix only if needed. Use names such as Main Pharmacy and Riverside Pharmacy. Verify one reachable mailbox and start.
4. **Supply complete forms.** Every independently pasted value gets its own code block. Do not ask users to invent identifiers or allocate fixtures.
5. **Finish in order.** Only one active section. Present its concrete finish criteria, reuse evidence and close it before moving on. Faster pacing, questions, status requests or frustration do not authorize jumping.
6. **Make completion visible and truthful.** Show DONE / IN PROGRESS / FAILED / BLOCKED / DEFERRED / NOT STARTED, clear counts and specific unfinished work. An unrelated cosmetic issue can be logged without withholding functional completion; an actual criterion failure cannot be made green for convenience.
7. **Separate scopes.** Customer workflows, optional extensions, engineering probes and production-readiness items have distinct tracking. Do not hide difficult requirements, but do not include them in the wrong denominator.
8. **Use proportionate evidence.** Ask for screenshots where they settle a result or discrepancy, not after every click. Record explicit tester reports as such. Reuse screenshots and paid outcomes already received.
9. **Preserve history.** Retests append outcomes; they do not erase earlier failures. Scope changes require explicit attribution. Never reopen an earned pass merely because an optional case was mentioned later.
10. **Save resumable state.** Checkpoints preserve identities, attempted/accepted NPIs, all criteria and states, next action, pending mutations and journals. A new chat resumes the actual account; it does not repeat payment or registration blindly.
11. **Keep three records.** Results go to Engineering, guide lessons to the playbook, and attributed suggestions to product review. A suggestion is not automatically an approved requirement.
12. **Publish aligned assets.** Markdown is the interactive authority; PDF is the matching human reference. Document checks, fresh-chat guide behavior and application results are three different validation claims.

### v3 publication and remaining rehearsal

The current stakeholder package uses Tony's names:
- `Cyber_Pharma_Alpha_Tester_Guide_v3.md` — upload to the chat and type `start`.
- `Cyber_Pharma_Alpha_Tester_Guide_v3.pdf` — matching readable reference, 27 pages.

The canonical Markdown was authored as `Cyber_Pharma_AI_Augmented_Human_QA_Recipe_v3_0.md`; Tony's shorter filename is its distribution name. The Rework Record is internal authoring evidence, not a second recipe for Coach and not an application repair order.

The guide now contains 13 ordered sections with 45 mandatory customer finish criteria. The previous 120-case bank was dispositioned between customer, extended, engineering and production work; it was not all executed by rewriting the document. Structural and synthetic-NPI checksum checks were completed. A separate fresh-chat rehearsal must verify first-name intake, pace choice, whole-form blocks, no infrastructure quiz, strict sequence closure, truthful status, checkpoint/resume and no repurchase after resume.

Coach prefers Claude; ChatGPT and Gemini are alternative hosts. User-supplied model labels are preferences, not tested compatibility certifications. Do not make model-version availability a customer setup requirement.

### Help enhancement and deployment doctrine

The Help handoff requests a practical what/how guide in OwedBook's existing navigation. Cover getting around, Owner/Store-admin/Member responsibilities, My Stores, invitations and access removal, delegation, Owner billing and Stripe return, schedule/undo, read-only settings, audit filters and Profile/sign-in. Reserve OwedBook claims/upload/calculation instructions for later; do not invent functionality.

Use fictional examples, current UI wording, accessible headings/links and a narrow-screen layout. Do not embed private user data, QA aliases, test cards, cloud instructions or internal QA verdicts in customer Help. Links must respect existing route guards.

Ordinary Help changes normally reuse the existing deployment setup. The correct sequence is inspect the actual repo/branch and script, implement, run appropriate checks, prepare a reviewable change, let Tony perform or authorize git actions, then run the affected app's existing `./deploy.sh` when deployment is authorized. Verify the resulting revision, canonical URL, Help links and relevant regression behavior. An OwedBook-only change normally needs only OwedBook deployment. A Portal change needs its own deployment. Do not rerun initialization or upload secrets merely because help text changed.

### Outstanding work and honest completion evidence

| Workstream | Current disposition | Next evidence / owner |
|---|---|---|
| Completed customer rehearsal | CLOSED within recorded v2 client scope | Preserve final 3-active / 3-renewal state and historical evidence. |
| v3 recipe and matching PDF | DELIVERED | Fresh-chat behavioral rehearsal before claiming the recipe itself validated; Tony/JARVIS. |
| Dropdown APP-01 | OPEN | Actual patch, zero/nonzero-role evidence and checks; Engineering. |
| Historical redirect APP-02 | TRIAGE | Reproduction or explicitly bounded not-reproduced result; Engineering. |
| In-app Help | SPECIFIED, NOT IMPLEMENTED HERE | Source changes, screenshots, checks, git handoff, authorized deployment and live smoke. |
| APA discount | BUSINESS / ENGINEERING FOLLOW-UP | Coach/Frank approve amount, eligibility, duration and store coverage; Engineering configures and tests codes. Standard run leaves blank. |
| Legal publication | DEFERRED TO PRODUCTION | Approved documents and working links before production readiness; does not undo alpha signup pass. |
| Forced payment exceptions | UNVERIFIED | Isolated bank challenge, decline, pending reload/cancel and reconciliation evidence. |
| Timed jobs and real cutoff | DEFERRED / NOT PROVEN BY SCHEDULE-UNDO | Configured worker evidence plus unpaid expiry and actual cutoff outcomes. No later scheduler confirmation supplied here. |
| Support transfer and populated claims | DEFERRED | Approved procedure/buyer and scoped synthetic dataset with permitted/forbidden actors. |
| Whole-subscription cancel/undo and password cases | OPTIONAL, UNRUN | Isolated authorized follow-up if selected. |
| Security alpha exceptions | PRODUCTION FOLLOW-UP | Prior zod advisory exception remains open in available records; current dependency disposition requires an actual engineering check. |
| Factory-wide playbook adoption | PROPOSED | Validate guide corrections, then update governing playbooks/templates with attributable evidence. |
| Earlier pack/review/budget provenance questions | HISTORICAL, NOT CLOSED BY INFERENCE | This entry does not supply missing original review bytes, archive identity comparison or approval receipts. Reconcile against actual closeout records when needed; no automatic campaign restart. |

### Update to earlier open actions

Decision 9 remains closed by Tony's recorded ruling. Engineering-start and DEV/deployment evidence now exist, so the November 17 statements that these were not yet reported are historical. Those later outcomes do not retroactively manufacture the exact earlier review/budget permissions or original source bytes. Keep provenance questions distinct from a demonstrated product defect; do not ask Tony to repeat completed work solely to clean a journal.

### Practical assessment

The customer journey produced useful successful evidence, but the first guide imposed avoidable effort through setup ceremony, microscopic steps, scope mixing and unclosed sections. Tony's frustration is direct evidence of a failed guide experience even where application checks passed. The correction is not to abandon accurate testing or force every tester to move fast: it is to prepare the environment, offer a pace choice, finish bounded sections, show earned progress and keep engineering work with engineers.

The next proof is a smooth v3 chat run and a separately verified product-help deployment, not another declaration that the document is perfect.
