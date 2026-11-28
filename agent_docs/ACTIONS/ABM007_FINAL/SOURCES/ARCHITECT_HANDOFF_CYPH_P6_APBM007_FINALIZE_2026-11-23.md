# JARVIS Architect lab handoff — Cyber Pharma Phase 007 finalization

**Destination lab:** Architect: CyPh New Plan - P6 - APBM007 - FINALIZE  
**New module ID:** `ABM007_FINAL`  
**Document version:** 1.0  
**Prepared:** 23 November 2026, Asia/Dhaka  
**Latest Director instruction:** Tony, 23 November 2026, 10:57 AM, Asia/Dhaka  
**From / to:** JARVIS, continuing Architect seat  
**Director:** Tony Stark  
**Status:** Continuity and module-authoring handoff. Not a frozen ABM, engineering release, QA certificate or deployment approval.

## 1. Read this first — the Director's actual next objective

Tony is ending the preceding Architect lab after extensive engineering, independent QA, manual testing, rework, deployment and recipe authoring. Continue in **Architect: CyPh New Plan - P6 - APBM007 - FINALIZE** with full continuity.

The next deliverable is **one final bounded ABM named exactly `ABM007_FINAL`**, still part of the Phase 007 campaign. It is **not another APBM** and not a restart of APBM-007A or APBM-007B. It consolidates the relevant outstanding reworks from Cody's independent QA and Friday's Lead decisions, all Tony/JARVIS manual testing, tester-agent reports and new internal feedback, then adds the final product polish and Frank's new branding direction. The intended outcome is a polished two-app experience suitable to present to Frank.

Tony is handing the **current alpha** to Coach for internal testing and feedback. Frank has supplied Coach with branding material such as logos and colors. Tony will bring those details into the new lab. Those assets and their exact instructions have **not** been supplied to this handoff author. Do not invent brand colors, logo files, approved typography or a brand identity from old screenshots.

Use the current app as a working brownfield baseline. Build on it. Preserve proven behavior, fixtures and history. Prepare one coherent final rework assignment with mandatory QAM, meaningful verification, git/integration and authorized deployment follow-through. “One final ABM” is a bounded delivery objective; do not falsely promise that no defect can ever require a repair.

**The first response in the new lab should acknowledge this mission, show the consolidated current position and begin intake of the incoming branding/Coach feedback. Do not ask Tony what project this is, ask for already-held facts, restart old QA or present another sprawling phase plan.**

## 2. What is decided, what is pending, and what this handoff author actually did

| Item | Current disposition |
|---|---|
| Module type and name | Director-selected ABM; exact ID `ABM007_FINAL`; part of Phase 007. |
| Final outcome | Polish the existing OwedBook + Account & Billing alpha, address accepted small fixes, incorporate approved branding and prepare the Frank-facing release. |
| Existing alpha | Working and already tested within recorded customer scope. It is the internal feedback baseline, not a production-cutover claim. |
| Coach | Tony intends to give Coach the current alpha and v3 guide for internal testing. Delivery/receipt and a new Coach run are not independently recorded here. |
| Frank's branding | Exists with Coach according to Tony; actual files and requirements arrive in the next lab. |
| Help enhancement | Explicitly requested and specified. No implementation or deployment of Help established here. |
| App source implementation in this lab | None. This lab prepared documents and interpreted supplied execution reports; actual source repos are on Tony's machine. |
| ABM freeze / engineering plan / release | Not yet done. Prepare from evidence and incoming inputs. |
| Authority | Authoring/intake authorized. Existing explicit permissions persist, but this handoff does not authorize git mutation, destructive changes or deployment. |

Do not reclassify the module as RRM or APBM because a generic routing table recommends another type for small rework. Tony expressly chose ABM for this bounded finalization. Record that choice and apply the ABM's normal contract/QAM discipline.

“P6” is the new **lab title**. It must not silently rewrite the original eight-phase product roadmap or mean the full roadmap's Phase 6 has been delivered.

## 3. The continuity package and how to use it

This Markdown is self-contained for orientation. Its companion ZIP includes selected source snapshots, the current campaign journal, customer guide assets, engineering Help handoff, QA Lead/closeout records and a SHA-256 inventory. It avoids making Tony reassemble these from old chats.

Recommended read order:
1. This handoff in full.
2. `CYPH_APBM007B_CAMPAIGN_DOCTRINE_JOURNAL.md`, v0.3, especially the latest dated entry. Earlier entries are preserved history, not current blocking instructions.
3. `APBM007B_Alpha_QA_Closeout_and_Help_Page_Handoff_2026-11-22.md`.
4. The original client closeout and rehearsal journal for exact outcome attribution.
5. QA Lead's November 18 cleanup/release and the November 18 Architect closeout; then the repair ledger and later repair reports for changed behavior.
6. ABM and QAM playbooks before authoring the module. Reuse relevant existing evidence; do not treat a handoff as permission to bypass current repo instructions.
7. The v3 guide/Rework Record for customer-testing doctrine. Read incoming branding and Coach results as they arrive.

The ZIP's `SOURCE_MANIFEST.json` gives exact copied paths, sizes and hashes. An archive hash proves identity, not correctness or complete inclusion of the historical campaign. Old full QA archives and the original standalone November 18 certificate are referenced by the available Lead record but are not bundled as if reviewed anew. Retrieve only the missing exact evidence needed for a current decision from repo QAM or Tony's retained archive; do not substitute a different campaign's certificate.

The bundle is **internal**: it includes tester identities and technical receipts. It is not Coach's customer guide package and not a public Frank-facing report.

## 4. People, seats and communication style

| Person / seat | Role in this continuation |
|---|---|
| Tony | Director, product decisions, risk acceptance, credentials, Git authority and deployment authorization. Call him Tony. |
| JARVIS | Continuing Architect and plain-English collaborator. Consolidate evidence, scope `ABM007_FINAL`, maintain decisions and prepare coherent handoffs. |
| Claudy | Engineering executor in this campaign; expected final-build executor unless Tony changes the assignment. |
| Cody / Codey | Independent QA executor in prior campaign; confirm final assignment rather than infer from a model name. |
| Friday | Independent reviewer / QA Lead in prior campaign. Preserve actual verdicts and scope; name final Lead assignment in the ABM. |
| Coach | Internal stakeholder and tester, prefers Claude chat; collecting Frank's branding and feedback. |
| Frank | Domain stakeholder and intended recipient of the polished release; Windows user. |
| Joane / team | Nontechnical users/testers; instructions must not assume engineering skills. |

Seat identities persist when models change. Do not make model versions part of the acceptance contract. Tony calls JARVIS his right-hand communicator: explain concrete outcomes and the next necessary action, not machine jargon.

Default style: concise connected prose, familiar language, no Canvas. Prompts/commands and independently pasted values belong in code blocks. Slack reports use **bold caps headlines**, bullets, no emoji; QA status tables intentionally use clear green checks and truthful non-green states. Do not send Slack/email merely because a report was written. Avoid deadline promises. Never announce a fix, merge or deployment merely because its work order was authored.

## 5. Two-app product and environment map

| Surface | Purpose | Canonical alpha address |
|---|---|---|
| OwedBook | Dashboard shell, My Stores, staff administration, Settings, Audit log, Profile; full claims workflow remains outside current completion claim. | https://cyph-v1-owedbook-alpha.cyberizedev.com |
| Account & Billing / Payment Portal | Owner signup, first purchase, additional pharmacies, subscription/billing and Stripe portal launch. | https://cyph-v1-payment-alpha.cyberizedev.com |
| Stripe | Sandbox checkout, saved test payment method, invoices and hosted billing. | Follow app-generated Stripe links; never save private session links in a handoff. |
| Supabase | Existing DEV backing data/auth for alpha. SCRATCH is the independent QA database. | Verify exact target before any effectful operation. |
| Cloud | Alpha Cloud Run services in `cyberize-nextjs-staging`, region `us-east1`. | Reuse current configured deployment workflow. |

Historical source repository paths on Tony's machine:

```text
/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
```

```text
/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
```

GitHub repositories are `Cyberize-Group/cyph-v1-dev` and `Cyberize-Group/cyph-payment-portal-dev-v1`. The current authoring workspace contains documents, not those live checkouts. Do not run commands here and claim source verification on Tony's machine.

Existing module convention is `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/`. Proposed new module leaf is `ABM007_FINAL` under the actual established module root, verified during recon. Do not rename ACTION/ACTIONS as a cleanup task. Prefer one canonical pack with explicit per-repo routing and linked paired-source identities, not two inconsistent copies of the acceptance contract.

## 6. Established product contracts to preserve

### Account, roles and identity
- One account owner can have multiple pharmacies under one subscription.
- Owner billing authority comes from account ownership, not a display badge, email address or store membership alone.
- Store admin manages staff only for assigned stores; delegation does not transfer account ownership or billing.
- Member sees assigned stores and cannot gain administrative/billing authority by guessing URLs.
- Owner retains access after delegation and is protected from ordinary member-removal controls.
- NPI is the required unique store identifier; internal permanent store ID preserves identity/history. NCPDP is optional metadata.
- Same-owner paid re-add restores the original store/history after successful payment, by Tony's recorded decision 9. Buyer history denial remains protected. Do not ask decision 9 again.
- Existing support-led transfer boundaries remain; a new self-service ownership/transfer feature is not authorized by “polish.”

### Sign-in and navigation
- Magic-link email sign-in and current supported password controls remain. Google OAuth is a later concern, not silently added now.
- Apps use automatic authorization-code handoff and separate cookies, not shared domain cookies. Preserve single-use, short-lived, audience-bound redemption and existing origin/path guards.
- Local two-app testing and alpha share the same handoff design. Retain localhost callback support while adding/retaining alpha routes.
- Used/expired-link recovery and both-app logout behavior have customer observations; do not weaken guards to make navigation appear smoother.
- Changing global Supabase Site URL or templates affects more than one link path. Inspect actual current configuration; do not issue blanket dashboard changes without necessity.

### Money and lifecycle
- Standard monthly pricing: $99 first pharmacy, $49 each extra; 2 = $148, 3 = $197 before applicable tax/approved discounts.
- Additional-store immediate charge is time-dependent proration. $48.98 and $47.77 were historical paid amounts, not future constants.
- Server-authoritative quote, consent and payment outcome; browser return alone never proves payment or activation.
- Signed webhook processing rereads authoritative Stripe objects using the app's pinned version. Endpoint API-version mismatch alone is not an established processing failure.
- Preserve exactly-once/idempotency, pending-operation recovery, authorization and activation boundaries. Do not add a second charge attempt to improve a spinner.
- Scheduled removal preserves current access until the displayed period end; next-renewal quantity differs legitimately from current accessible-store count. Undo before cutoff restores the schedule.
- Whole-subscription cancellation is distinct from removing one pharmacy. Grace behavior must not reset through cancel/undo/retry.

### Product truthfulness
- Settings currently show saved fields read-only; additional-store forms collect fewer details, so “Not provided” may be accurate. No unapproved editing/schema expansion.
- Audit history uses actor/context-aware wording, local timezone labels, filters and older-event paging. Scheduled request completion must not be called actual store removal.
- OwedBook upload/full claims/data-vendor workflows are unfinished/outside this final-polish scope unless expressly added. Empty claims dashboards are expected for fresh pharmacies.
- Support display is `support@pharmacybooks.com`; operational mailbox proof remains a separate evidence question.

## 7. Campaign chronology — carry the sequence without replaying it

| Period | What occurred | What the next lab must retain |
|---|---|---|
| APBM-007A, closed before 007B | First-store subscription, auth handoff and baseline owner access; known limits recorded. | Do not restart 007A or infer its certificate covers later UI changes. |
| November 16–17 | 007B preparation, E1 capability checks, frozen-pack amendments, engineering checkpoints and Q1 planning. | Source/contract identity, immutable applied migrations, exact decision provenance and budget discipline. |
| November 17–18 | Cody QA, Friday review, two bounded repair rounds and independent completion. | Lead record reports Gate Q PASS WITH KNOWN RISK on exact paired candidate; KR-1..KR-6 accepted by Tony. |
| November 18 | Cleanup accepted and Architect closeout prepared for paired integration. | Evidence and SCRATCH data retained; cleanup exceptions preserved; separate git/apply/deploy authority. |
| November 19 | DEV through migration 0070; local Director walkthrough revealed usability and payment-path defects. | Engineering fixtures had hidden a real subscription-versus-customer default-card defect. |
| November 19–20 | R1–R10 and F1–F6 consolidated repairs; migration 0071 and self-checks; manual retests. | Repair ledger's “pending” rows are dated snapshots. Later evidence closes only the actual observed behavior. |
| November 20–21 | Dedicated alpha deploy preparation, pinned Next.js updates and Cloud Run domains/secrets. | Existing services preserved, upload boundaries and build identity matter; no production cutover. |
| November 21 | Portal deployment; signed resend; alpha auth/template configuration; two-app sign-in observations. | Deployment status is not automatically full Gate D. |
| November 21–22 | Tony tested the deployed two-app workflow with the original AI recipe. | Customer scope completed 14/15 old sections; operator-only work deferred; guide experience was poor. |
| November 22 | v3 guide rework, internal Rework Record and detailed Help/product-fix handoff. | 13 customer sections, 45 criteria; separate operator coverage; no implementation implied. |
| November 23 | Matching v3 PDF delivered; campaign doctrine journal updated to v0.3; this split authorized. | Coach gets current alpha for internal feedback; next lab builds `ABM007_FINAL` with incoming branding. |

## 8. Independent QA and historical certificate boundaries

Friday's November 18 cleanup/release records:
- Verdict: **GATE Q: PASS WITH KNOWN RISK**.
- Portal certified product: `ba66534351368b4b67b9e61d6f0278866950c850`.
- OwedBook certified product: `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871`.
- Historical QA branch: `qa/apbm-007b`.
- Certificate filename: `QAM_CERTIFICATION_APBM-007B_2026-11-18.md`.
- Certificate SHA-256, as referenced by Lead: `3d897cf99575c37c429200446df6315fff5b94f3c384c4a9044f42a2e24ce70f`.
- Final QA review package SHA-256: `e6dd4520ac255a3a71e63cb71799618c0780c7baf8b1bb558adc3e8c7afb25d6`.

The original certificate bytes were not located as a standalone current attachment in this handoff preparation. The Lead release and Architect closeout are bundled; the latter reports the certificate import gap closed. When exact KR wording is needed, read the actual retained repo certificate/Carry Forward records rather than reconstruct six risks from memory. The Lead record explicitly mentions KR-1 performance/time-budget/progress observations, KR-2 WebKit sign-in monitoring and KR-3 live transfer-buyer Gate D follow-up. Do not invent KR-4..KR-6 details or redefine them as the later manual findings.

Q1 planning established SCRATCH + sandbox execution, disposable QA builds at 3100/3101, independent money expectations, real automatic event delivery, provider retry/outage checks, scoped effects and one grouped Director session. The November 17 Q1 approval is a plan decision, not final results. Its candidate pair differs from the final certificate as repairs landed.

November 18 cleanup preserved evidence/automation, SCRATCH business/claim rows and identities; cancelled six run-marked sandbox subscriptions, disabled test-clock contexts and revoked QA sessions. It retained some sandbox customers/clocks, old 007A pairs, terminal payment history and a temp file whose ownership was not established. Do not delete that residue or reset business data as a branding cleanup. Local private files mentioned in old records must not be opened or packaged casually; current existence/ownership is unverified.

**Critical:** the later manual repair commits, migration 0071, dependency update and deployed branding baseline are not covered merely because a November 18 certificate exists. Build the new ABM's impact/risk plan and independent QAM around the actual paired source candidate. Preserve prior proofs where applicable, with provenance; do not rerun everything automatically or extend certificates by assertion.

## 9. Manual repair history — what was actually addressed

| Historical ID | Problem and reported correction | Carry-forward interpretation |
|---|---|---|
| R1 | OwedBook Add Store disabled/stale copy; owner handoff and clear Portal Add Pharmacy action implemented. | Preserve working handoff and discoverability during branding. |
| R2 | Disabled controls lacked progress; action-specific busy text, spinners, live regions and duplicate-submit guards added. | Do not remove progress/accessibility feedback for aesthetics. |
| R3 | Registration saved card on subscription, add-store only checked customer default; server now uses subscription default with fallback. Payment issues, polling, hosted page new tab and resume were clarified. | Normal paid additions later passed. Forced challenge/decline/reload/cancel proof still separate. |
| R4 | Member removal immediate; named in-page confirmation/cancel/result added. | Preserve no-effect Cancel and enforced removal. |
| R5 | Owner mislabeled/demotion/removal risks; migration 0071 and UI distinguish protected Owner from store roles. | Preserve ownership authority after delegation, including server checks. |
| R6 | Settings omitted stored data; scoped profile RPC and read-only multi-store display added. | Do not invent missing values or editable features. |
| R7 | Profile role/guidance inaccurate; actual role badges and support guidance added. | Keep password methods intact; optional full password tests remain unrun in customer rehearsal. |
| R8 | Audit generic, actorless/UTC confusion and noisy reads; semantic mappings, permitted detail, local timezone, category/read filters and paging added. | Preserve truthful actor attribution; never invent a named person for a system write. |
| R9 | Removal dialog and store count misleading; separate access-now vs next-renewal and explicit period-end explanation. | Functionally observed schedule/undo; real cutoff still requires worker proof. |
| R10 | Support/legal placeholders and per-address mail allowlist friction; configurable honest labels and DEV-fenced open mail option added. | Legal publication deferred by Tony; do not promote DEV open-mail policy to arbitrary production. |
| F1 | Store admin could see Add Store form even though quote denied; pre-render Owner guard and operation-level refusals verified by tests. | Rebrand cannot expose forms/financial data or weaken fail-closed checks. |
| F2 | Admin missing protected subscription data appeared broken; neutral Managed by Owner view added. | Missing protected fields must not become false Needs Attention. |
| F3 | Unauthorized store page exposed technical error/retry; friendly denial/Back to My Stores. | Keep privacy and useful recovery link. |
| F4 | Audit confused scheduled removal with removed, delegation with loss of ownership, and email with billing system. | Keep corrected distinctions in Help and new UI copy. |
| F5 | Full email in navbar; display name and compact actual role badge, full email in account menu. | Preserve correct identity for role switching; long names/mobile states checked. |
| F6 | Auth changes excluded from final repair batch. | No implied OAuth, editing or onboarding rewrite. |

Reported checks were per snapshot: first repair 355 OwedBook / 533 Portal unit tests; later 370 / 568; deployment preparation 374 / 572. Type/build/lint/container checks were also reported. These counts are neither cumulative nor proof of current green. Run required checks on the actual new candidate and report exact outcomes, not inherited counts.

## 10. Deployment receipts and the current baseline problem

Historical Portal deployment:

| Item | Reported November 21 value |
|---|---|
| Service / project / region | `cyph-v1-payment-alpha` / `cyberize-nextjs-staging` / `us-east1` |
| Source branch | `deploy/payment-alpha-prep` |
| Source commit | `6dd3de737acacff9685c0c2027246bf396f10c1d` |
| Ready revision | `cyph-v1-payment-alpha-00001-mwh` |
| Build | `ebbd4a02-3d79-4ce4-9a12-2b4afe5f6e48` |
| Image digest | `sha256:0b1792918f0d2200deeb98688d42b479708d5f6c752862b2d3a0907b2aa5da1c` |
| Runtime account | `sa-cyph-payment-alpha-runtime@cyberize-nextjs-staging.iam.gserviceaccount.com` |
| Runtime dependency snapshot | Next.js 16.4.5; a historical value, not a current-security endorsement. |
| Deployment safeguards | Unique image tag/digest, clean upload identity, seven secret bindings, public service IAM read-back, domain HTTPS and `/api/build-info`; six existing services unchanged. |

OwedBook's canonical alpha was deployed and user-tested. This handoff does not invent an exact current OwedBook deployed SHA/revision absent a read-back receipt. Obtain actual paired repo HEADs, remote state, dirty files and live build identity during the final ABM baseline inspection.

DEV reached migration 71 under a separate release; 0071 hash in the pre-commit report is `9a91230710d5895c7bf1c6add346d83e9ffca22199e17910a3c48ec052497955`. Do not modify applied 0001–0071 bytes to clean wording or merge an old manifest. Any necessary new schema change needs explicit forward-only treatment; final UI polish should not manufacture migrations.

Portal deployment records mention local branch/uncommitted records after the deployed source commit. The current merge/push status of every post-certificate repair and deploy-prep branch must be read, not assumed. Do not force a stale November 18 git command or auto-switch to main over uncommitted work.

The registered sandbox endpoint listens to seven events: `checkout.session.completed`, `checkout.session.expired`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`. One signed resend returned HTTP 200; exact duplicate/processed/ignored result was not captured. Preserve this limit.

**One consumer:** deployment notes require local DEV-backed Portal/listener to remain off while alpha consumes the same events. Independent final QA should use declared isolated targets, not run competing processors against the live internal-testing account.

Scheduler was explicitly not created at deployment, with the API disabled. No later positive scheduler receipt is provided here. Therefore actual unpaid expiry, notice execution and real period-end removal must remain unproven; a scheduled-and-undone store does not settle them. Setup belongs to Engineering/DevOps, never Coach's recipe.

## 11. The completed deployed customer rehearsal — exact result boundary

Run `1121ts01`, Tony on Windows Chrome, November 21–22. Evidence includes screenshots and attributed tester reports. Final client scope: **14 PASS, one operator-only DEFERRED**, using the original v2 list.

| Old # | Journey | Outcome / limit |
|---|---|---|
| 01 | Setup | Owner alias delivery established; extra profile setup removed. |
| 02 | New Owner | Registration, required confirmations, $99 sandbox purchase, email and active first pharmacy passed; legal publication deferred. |
| 03 | Returning sign-in / navigation | Both-app navigation and billing round trip confirmed. |
| 04 | Add Pharmacy B | $48.98 paid proration, active in both apps, $148/month at that checkpoint. |
| 05 | Member | Invitation accepted, only Pharmacy A visible. |
| 06 | Store admin / Helper | Initial admin invited as wrong role; corrected admin2 accepted as Store admin, Owner retained, Helper joined as Member. |
| 07 | Role boundaries | Reported retest passed; historical unexpected Portal sign-in retained for triage. |
| 08 | Profile / mobile | Required customer checks reported passed; optional password changes skipped. |
| 09 | Settings | Appropriate Owner/Admin store selectors and read-only details passed. |
| 10 | Schedule / undo | Two retain access; renewal 2 → 1 → 2, audit present. Real cutoff not run. |
| 11 | Remove / audit | Removed identity signed in with no stores; Helper retained; filters, scope, older records and local time checked. |
| 12 | Logout / recover | Both apps required sign-in; used link did not restore; fresh Helper link worked. |
| 13 | Third normal addition | $47.77 paid proration, third active, $197/month. No forced bank challenge or exception proof. |
| 14 | Timed jobs / transfer / populated data | Deferred to Engineering. |
| 15 | Closeout | Three active, three at renewal, no unexpected pending changes; keep third pharmacy; no added final feedback. |

**Preserve final fixtures.** Tony explicitly retained the third test pharmacy. The finalization module must not reset/delete his account, invent a new paid signup for bookkeeping or rerun charges merely to turn a status row green.

This report's PASS scope is narrower than all engineering ACs. Earlier journal checkpoints saying 2/15 or “partials” are historical, not a reason to replay completed actions. Conversely, a narrowed final customer pass does not certify omitted engineering cases.

## 12. The initial finalization backlog — consolidate, then decide

Use the following as intake, not a claim every row is approved implementation. Add Coach's findings and Frank's brand material with source/date; merge duplicates, preserve retests and give each selected change an AC and owner.

| Proposed finalization ID | Source / item | Present status | Expected next handling |
|---|---|---|---|
| FINAL-01 | Contradictory “No permitted stores” beside selectable pharmacies. | Observed product defect; APP-01 in existing handoff. No patch established. | Inspect actual zero/nonzero/loaded selector states across Owner/Admin/Member/removed actor; fix actual condition/copy, preserve scoping. |
| FINAL-02 | Store-admin unexpected Payment Portal sign-in. | One historical observation, later passing boundary retest; APP-02 triage. | Reproduce same route/session/actor; fix only a demonstrated problem. If not reproduced, keep bounded result and history, not a speculative auth change. |
| FINAL-03 | Product Help page in OwedBook. | Requested and specified; not implemented. | Include accurate page/task guidance and role limits; details below. |
| FINAL-04 | Frank's branding across both apps. | Director-selected direction; assets/instructions pending next lab. | Intake approved assets, tokens, usage and app coverage; design bounded visual changes, preserve behavior. |
| FINAL-05 | Coach internal testing feedback. | Expected, not yet received. | Record actual findings and suggestions; classify must-fix, polish, optional, deferred with Tony. |
| FINAL-06 | Historical certificate KR/carry-forward items. | Accepted risks are not automatically fixed or erased. | Read exact retained certificate/CARRY_FORWARD; determine relevant finalization fixes and regression. |
| FINAL-07 | Payment exception / exactly-once gaps in later deployed repair paths. | Normal payments passed; forced challenge/decline/reload/cancel remain unverified. | Engineering/QA decide bounded isolated proof, implementation only if demonstrated issue. Never customer setup work. |
| FINAL-08 | Scheduler-dependent expiry, real cutoff, notices. | No deployed worker confirmation. | Explicitly disposition final-release readiness versus deferred engineering; don't silently install cloud resources or pretend schedule/undo proves it. |
| FINAL-09 | Support-led transfer / populated claims isolation. | Not proven by client run; approved procedure/data required. | Carry forward openly; include only approved bounded verification or explicit deferral. |
| FINAL-10 | APA member-code feature. | Field exists; alpha approved code/config/terms not established. | Coach/Frank decisions on amount, eligibility, duration, first/additional coverage; then configuration and positive/negative tests if selected. |
| FINAL-11 | Terms/Privacy/support publication. | Tony deferred policy publication to production; mailbox operation not independently proved. | Do not block alpha polish on legal publication. If supplied for final presentation, add approved URLs/text; do not invent policy approval. |
| FINAL-12 | Security/dependency alpha exception. | Prior zod exception recorded; no current resolution established. | Inspect actual dependency/exception record and handle under appropriate authority; no stale vulnerability claims or blind major upgrade. |
| FINAL-13 | Recipe / release-document alignment. | v3 MD and PDF delivered; fresh-chat rehearsal pending. | Rehearse and update relevant guidance after actual UI/branding changes, keep version parity. |
| FINAL-14 | Older usability backlog. | UTC-only deadline notices, old decision-9 operator wording, demo invite typing-before-load and individual operator sign-in mentioned in November 18 closeout. | Check current source first; accept, fix or defer exact remaining cases rather than bulk-claim closure. |

Scope “polish and small fixes” does not automatically authorize full claims implementation, new provider integrations, a billing redesign or production cutover. Do not smuggle large deferred features into the final ABM. Present any material dependency with a concrete impact and bounded recommendation.

## 13. Branding intake and design handoff — prepare without inventing

Incoming source is Frank → Coach → Tony. Ask for or inspect the actual provided files/message once. Do not re-question facts already present in those assets.

Capture:
- Master brand and product names: confirm actual approved Cyber Pharma / Pharmacy Books / OwedBook relationship and capitalization rather than impose existing navbar text.
- Logo variants and allowed use: primary mark, wordmark, compact/favicon, light/dark assets, aspect ratio, clear space, forbidden alterations.
- Colors with supplied values and intended semantic use; proposed accessible text/control combinations if brand colors alone are insufficient.
- Typography and supplied/licensed files or approved fallbacks; do not assume a paid external font is available.
- Both apps' header/sidebar/footer, sign-in/registration, forms, statuses, dialogs, emails and Stripe hosted branding: enumerate which surfaces are actually included. Stripe/account-wide or Supabase email-template changes need their own authority and verification; they are not ordinary local CSS.
- Light/dark themes, mobile, focus states, loading/errors, long names and role badges.
- Approved support/brand language and any actual legal URLs; no placeholder links masquerading as published documents.
- Current screenshots versus the target direction, with a small representative screen set for approval. Include money confirmation, staff permissions and read-only states, not only a landing page.

Use the existing design system/components and supply a precise visual contract/token mapping. Preserve hierarchy, contrast, legibility and target sizes. Avoid a frontend rebuild or new design-system project unless actual evidence requires one. Do not use generated imagery to approximate an exact logo or secretly recolor the supplied logo.

The previous Tony diagram preference—off-white, charcoal, square corners and restrained orange/rust—is a **document/diagram** preference, not Frank's missing approved product brand. Keep those separate.

## 14. Product Help enhancement — retain the full brief

Create practical **what it does / who can use it / how to do it / what should happen** guidance. Add a Help entry in OwedBook's existing navigation/menu; choose the real route after inspection. One page with contents and anchored sections is a reasonable starting point, not a mandated new information-architecture project.

Required content:
1. OwedBook versus Account & Billing, where to go and how to return from Stripe.
2. Owner, Store admin and Member responsibilities; delegation does not transfer ownership/billing.
3. My Stores, status cards, opening a pharmacy's people page and current-access versus renewal meaning.
4. Invitations: select pharmacy, email and explicit role, send, accept, pending versus active. Explain resend/revoke/decline only where actual supported UI is verified.
5. Delegating/replacing Store admin, retained Owner access and actual current behavior.
6. Removing Member access, confirmation/cancel, consequences and removed-user state.
7. Owner billing, adding a pharmacy, quote/proration, consent, successful activation, invoices/cards and Stripe return; financial restrictions for staff.
8. Schedule/undo removal, access-until date and renewal count; don't present actual worker cutoff as certified.
9. Pharmacy Settings, NPI versus optional NCPDP, read-only saved details and truthful support route.
10. Audit actor/event/store/time, category filters, views/system entries and older records.
11. Profile identity, supported read-only changes, sign-in recovery/logout and actual password controls. No promised Google OAuth.
12. Reserved short space for later OwedBook claims/upload workflow help. No fictional data-analysis tutorial.
13. How to get help via approved support guidance; no invented response-time promise.

Acceptance: visible Help entry, accurate current sections, working app links/anchors, role-respecting routes, desktop/narrow-screen readability, keyboard focus/headings, no private user data or sensitive session URLs. Use fictional pharmacy examples. Product Help must not contain QA run codes, test cards, cloud commands, tester journals or internal verdicts. Show actual page excerpts/screenshots for review before deploying.

## 15. The QA recipe disaster and the correction — preserve this lesson

Tony spent hours executing real product checks while the agent jumped among sections, micromanaged clicks and held green checks for unrelated leftovers. Tony had not requested those jumps. This was a **guide design/execution failure**, not user impatience or permission to abandon coverage. Tony later recognized that a newcomer may want slower explanation and explicitly requested a pace choice.

Failures that must not return:
- Assuming everyone is Tony; ask preferred name first.
- Asking users to verify an unused run code or create browser profiles before using the app.
- Asking users to confirm Stripe sandbox, secrets, webhooks, builds, scheduler or database uniqueness.
- Plain-text/mailto-only long emails instead of individually copyable values.
- One-field-at-a-time form instructions or demanding a preallocated NPI fixture.
- Jumping before a section is complete and then reporting vague Partial / core passed / reconcile.
- Asking for a screenshot of every menu/click and repeating prior successful evidence.
- Blocking alpha signup on production policy publication after explicit deferral.
- Calling a normal successful payment proof of forced failure/recovery branches.
- Treating alias names as actual granted roles.
- Asking a removed user to re-register or repeat a paid purchase to satisfy the record.

v3 doctrine:
- Preferred name → Fast/Guided → one inbox → alias delivery proof → signup. Normal browser, no engineering setup.
- Generate simple label automatically; human store names such as Frank's Main Pharmacy and Riverside Pharmacy. Handle real duplicate rejection through a bounded next candidate, not an infrastructure quiz.
- Whole visible forms supplied together, each separately pasted value in its own code block.
- Only one active section. Give its finish line; reuse evidence; close **DONE / FAILED / BLOCKED / explicitly DEFERRED** before advancing. Only explicit user jump/skip permits departure.
- Status shows exact completed count, all sections, exact work left and green checks only for earned completion. No vague Partial state.
- Fast batches 2–4 related actions where outcomes permit; Guided explains a screen at a time. Both have identical scope, whole-form data and payment care.
- Precise tester reports are accepted as reports; screenshots settle ambiguous results and discrepancies. Do not invent independent verification.
- Optional, engineering and production work stays separate from the customer denominator.
- Pause/export saves real state; resume never blindly repeats writes. Actual files when supported, copyable fallback otherwise.

## 16. Current guide package and model guidance

Stakeholder filenames selected by Tony:

```text
Cyber_Pharma_Alpha_Tester_Guide_v3.md
```

```text
Cyber_Pharma_Alpha_Tester_Guide_v3.pdf
```

The current PDF is 27 pages and matches the canonical v3 rules/checklists. Retire the old v1 PDF from Coach's package. The canonical Markdown source in this lab was named `Cyber_Pharma_AI_Augmented_Human_QA_Recipe_v3_0.md`; Tony's filename is its shorter distribution name. The bundle includes an unchanged copy under the distribution name as well as the internal Rework Record.

Coach: open a fresh preferred Claude chat, upload the MD, type `start`. ChatGPT or Gemini are alternatives. Tony named Opus 5.5, GPT Sol 6.2 and Gemini 3.8 Flash in stakeholder wording; these are user-supplied preferences, not tested model compatibility/availability guarantees. Do not require technical model selection to begin.

v3 has **13 sections / 45 mandatory customer criteria**:
1. Name, pace and inbox.
2. Owner account and first pharmacy.
3. Returning sign-in, two-app movement and Stripe return.
4. Second pharmacy.
5. Member invitation.
6. Store-admin delegation and Helper.
7. Role boundaries.
8. Profile and layout.
9. Settings.
10. Schedule and undo removal.
11. Remove Member and audit.
12. Logout and fresh sign-in.
13. Final state/results export.

Document structure, criterion counts, NPI checksums and legacy coverage disposition were checked. **Fresh-chat behavioral rehearsal has not been recorded for v3.** Do not market the revised guide as already proven merely because v2's app test completed.

The earlier v2 bank had 120 cases. v3 deliberately routes optional/engineering/production checks out of the customer checklist; it does not erase them or report them all passed. The internal `Cyber_Pharma_QA_Recipe_v3_0_Rework_Record.md` maps them and preserves recipe lessons. It is **not** the engineering work order to hand Claudy. Use the Help/closeout handoff and new ABM for source changes.

## 17. Three journals and the future Factory playbook

Each future guided run maintains three distinct records:

| Record | Required content | Destination |
|---|---|---|
| Test results / defects | Expected/actual, actor, scope, PASS/FAIL or explicit untested disposition, evidence basis, retest history. | Engineering and QA adjudication. |
| Guide lessons | Confusing/slow/incorrect instructions, improvements, pace decisions and whether they worked. | AI Augmented QA Testing Playbook, after validation. |
| User feedback | Attributed suggestions about look, usability, content and features; distinguish suggestion from approved change. | Product/branding review. |

The final guide export may be five files—report, results, guide lessons, feedback, checkpoint—or one clearly separated bundle. Checkpoint preserves identities/roles, attempted/accepted NPIs, all 13 section/criterion states, pending payments/removals/invitations, pace, findings and exact next action. File tools vary; never fabricate downloads or permanent chat memory.

Campaign doctrine journal is broader: preserve process failures and source limits, append later outcomes, don't rewrite old evidence. The journal is now v0.3 with CJ-001 through CJ-031. New continuation should use CJ-032 onward. No claim that publishing it has synchronized every Factory playbook/template.

## 18. Scope separation — what not to accidentally absorb

The final ABM needs explicit dispositions, not a silent all-green promise:
- Forced bank challenge, decline, pending reload/cancel races and exactly-once reconciliation.
- Full subscription cancel/undo on an isolated account; optional in recent customer rehearsal.
- Unpaid expiry, notices, real period-end cutoff and scheduler setup.
- Support-led transfer, buyer/seller historical access, first-purchase transfer coverage limitations.
- Populated synthetic claims and API/store isolation; empty dashboards are insufficient.
- Complete password-change/login matrix, optional in recent run.
- APA business terms and configured valid/invalid/expired/non-allowlisted code tests.
- Production Terms/Privacy publication, operational support and security/dependency exceptions.
- Actual production cutover, HIPAA/BAA readiness and later data vendor/PDF workflows.

Tony explicitly deferred legal publication to production readiness. Older Lead/closeout documents requested legal wording before exposure; retain the dated history and the later Director ruling, not a newly invented legal gate for alpha signup.

Independent engineering may already contain evidence for an earlier candidate's scenario that later manual testing did not repeat. This table means **not proven by the latest client rehearsal/deployed candidate**, not “never tested anywhere.” Match source candidate, environment and impact before choosing required new proof.

## 19. How to author `ABM007_FINAL` without another coordination mess

### Step A — bounded baseline and evidence reconciliation
Read the current repo instructions, real branch/HEAD/worktree, remote divergence, installed skill locations and current deployed build identities. Use existing recon; refresh only what's needed. Preserve dirty work and active processes. Retrieve exact historical certificates/risk text only where the new contract depends on it. No secret dumps.

Build one **rework register** with ID, source/date, expected/actual, affected app, status, reproduction, severity, selected fix, acceptance check and evidence. Mark already-fixed and later-passed items so they don't become new work. Record Coach findings and Frank assets without losing attribution. Unknown root cause is a triage task, not an invented repair.

### Step B — branding and scope closure
Read incoming branding and internal feedback. Show Tony one concise consolidated scope: selected implementation, selected verification, explicit deferrals and genuinely missing decisions. Complete all independent useful preparation while waiting on a needed asset. Do not freeze a final visual contract without the actual brand input, and do not restart the entire campaign over a missing logo.

### Step C — one coherent ABM pack
Use ABM_PLAYBOOK v1.0 and the current QAM source. Include canonical brief, acceptance, existing no-break contracts, brand/UI contract, allowed paths/effects, state/rulings, skills manifest, engineering handoff duties, complete QAM and retrospective. Do not create empty decorative files or a second QA methodology. Use the exact `ABM007_FINAL` identifier and actual repo layout.

The module is for both apps as one integrated outcome. State which files/components belong in which repository and how paired changes are reviewed/deployed. Include design references and representative screen states. Future SHAs, QA approvals and certificates stay pending.

### Step D — engineering plan and continuous build
Claudy reads actual state and returns one complete plan. Architect reviews, Tony releases. After valid release, implement the whole bounded assignment, self-check and produce factual QAM handoff without stopping after routine internal chunks. Stop only for actual target/authority/contract/security/effect constraints. Preserve one active writer per checkout.

### Step E — independent QAM and bounded repair
Q1: independent recon/test plan. Lead approves/amends; Tony releases Q2. Q2 executes continuously with real evidence and correct scope. Engineer cannot certify itself. Findings do not automatically stop all unaffected tests. Consolidate necessary repairs, rebind exact candidates and retest affected behavior plus required regression. Avoid endless reviewer chains without a contract/risk reason.

### Step F — cleanup, integration and deployment
Accept required cleanup and retain durable evidence. Architect closes out, Tony controls scoped git actions/merge/push according to actual protected-branch policy. Deploy affected services using the existing inspected script once authorized, then verify live identity, links, branding, Help and critical user flow. New final acceptance must identify the tested/deployed pair; a pushed commit is not proof that Coach/Frank sees it.

Four planned assignments remain engineering recon/plan, engineering build/self-verification, QA recon/plan and QA execution, with genuine decisions and conditional repair distinct. Do not promise one response or eliminate QA to make the ABM look fast.

## 20. QA branch and writer policy — resolve from current engagement

APBM-007B used continuing `qa/apbm-007b` branches with engineering repairs and retained QA records. That is historical authority, not an instruction to reuse the old branch or delete it.

Tony's broader preference elsewhere has been disposable QA branches for probes that never merge. The supplied ABM playbook describes a continuing QA line for authorized repair/certified source. For this new paired module, make the actual branch/evidence policy explicit at setup under current repo instructions and Tony's established authority. Do not silently merge disposable probes, destroy retained campaign branches or make the Director redecide ordinary details that current policy already resolves. When real sources conflict, explain the specific choice once with a concrete recommendation.

A model/name swap does not create independent QA by itself. Record actual seat assignment, candidate binding and writer handoff. Only one writer owns a checkout at a time; read-only review may continue independently.

## 21. Candidate acceptance planning — seed for the real ABM, not frozen ACs

After branding intake and evidence reconciliation, make each selected row literal, testable and paired with an independent method. Suggested families:
- **Brand fidelity:** supplied logo variants/approved names/colors/tokens applied to selected app surfaces; mobile/light/dark/focus/error states legible and consistent; exact logo geometry preserved.
- **Core no-break:** Owner signup/login/handoff, existing Owner account, Add Pharmacy normal flow, billing/Stripe return, Member/Admin scoping, protected Owner authority, removal schedule/undo, logout/recovery.
- **Selector:** no contradictory no-store row when permitted stores exist; honest zero-store state; no new visibility.
- **Help:** current factual guide, navigation/anchors, role-appropriate links, accessibility/narrow layout and reserved claims section.
- **Defect triage:** each accepted Coach/manual/Lead item has observed expected/actual and targeted outcome; unreproduced historical redirects recorded honestly.
- **Data/money safety:** no reset or duplicate charges/invitations; preserve existing IDs/invoices/history; applied migrations unchanged; selected advanced cases isolated.
- **Publication alignment:** actual changed labels/paths reflected in Help, guide and screenshots; no stale v1 PDF distributed as v3.
- **Deployment:** actual affected service/revision/digest and canonical HTTPS; existing services preserved; correct paired origins; return/rollback prerequisites explicit.

Visual branding affects many surfaces even if CSS-only. Use a representative browser/theme/narrow-layout matrix tied to risk and stakeholder devices, including Frank's Windows reality. Validate actual layout/focus/roles; do not write tests that merely assert every sentence in Help. Independent expected money values must not come from the app's own helper.

Do not spend new sandbox payments just to reconfirm a header color. Use existing fixtures and targeted regression where valid; reserve new isolated purchases for a selected changed flow requiring proof. Record effect authority and cleanup before external tests.

## 22. Deployment and push — practical continuation rules

Tony asked whether new pages only require `./deploy.sh`. The accurate answer is: after implementation, appropriate checks, intended git integration/clean-tree prerequisites and deployment authorization, the **existing affected app's script** is normally the final deploy step. No default reinitialization, secret re-entry, new domain or cloud project for a Help/branding change.

Read the script/config first; preserve uniquely tagged/digest-based releases and upload boundaries. Build-time public branding variables may require rebuilds; external Stripe/Supabase branding/settings are separate effects. Verify current auth/readiness, not stale November 21 assumptions. Source docs/evidence must stay out of production upload as configured.

Only OwedBook changed → normally only OwedBook deployment. Both app brand/source changes → each gets its own build/revision and paired smoke. A successful run.app page is not the supported sign-in domain if origin guards only accept alpha hosts.

Do not issue old merge commands with stale HEAD assertions or use broad `git add .`. Prepare exact paths and messages from actual state. OwedBook main was protected and used a merge-commit PR; Portal historically used local no-ff merge. Inspect current policy. Preserve final source/record/integration/deployment identities distinctly.

Rollback must not require reverting applied migrations or resetting customer data. No automatic deletion of old revisions/services or test fixtures. Production cutover remains separate from this alpha finalization unless Tony explicitly extends scope.

## 23. Security/privacy and effects boundaries for the package

No credentials, OTPs, active magic links, cookies, private Stripe session URLs or raw auth states belong in artifacts. Past screenshots showed a signing secret; do not copy it into the next lab or package. No claim that a secret is safe merely because it was hidden in later screenshots. Preserve any specific credential-handling action already authorized; do not initiate unrelated broad rotation in a branding work order.

Existing sandbox account IDs/project refs are identifiers, not authentication. Still keep internal evidence separate from client help. DEV open mail is fenced to the declared alpha project and is not authorization to remove all guards elsewhere.

Only declared isolated fixtures and target writes may be used in independent QA. No real funds, shared account clocks, refunds or destructive cleanup without explicit scope. Effects counters include automatic retries; budget contingency and cleanup. Operator preparation belongs outside the human test guide.

## 24. Source precedence and contradiction handling

1. Latest explicit Tony decisions for scope/authority, with date and exact application.
2. Current approved contract/rulings and actual Lead decisions for their bounded candidate.
3. Current source/runtime receipts and independently observed behavior.
4. Final tester closeout and attributed screenshots/reports for their actual client scope.
5. Engineering self-check claims for their snapshot.
6. Older plans, proposals and intermediate journal states as history.

This ordering does not let a chat summary invent a missing technical result or override a higher-priority safety/tool policy. Scope deferral is not proof a defect is repaired. File hashes are provenance, not functional certification. A newer report controls current status only for evidence it actually contains.

Specific reconciliations already settled:
- Decision 9 approved; no repeat question.
- DEV “at 69 / apply pending” in November 18 sources superseded by later 0070 and 0071 receipts.
- Manual repair “not yet deployed” superseded by actual alpha deployment for the applicable source, not all possible future work.
- Early 2/15 or Partial rows superseded by final narrowed customer closeout.
- Old 15-section guide replaced by v3 13-section customer route; no numeric carryover of passes.
- Legal content deferral belongs to production; checkbox functional gating remains tested.
- Help requested/spec authored does not mean Help built.
- Branding promised to next lab does not mean assets approved in this lab.

## 25. Minimal new-lab startup behavior

Suggested JARVIS opening in the new lab:

> Tony, we are continuing Phase 007 with `ABM007_FINAL`: one bounded final polish/build module across OwedBook and Account & Billing. The current alpha is Coach's internal-feedback baseline. I have preserved the prior QA scope, customer results, open fixes, Help brief and v3 guide. Next I'll fold in Frank's actual branding and Coach's findings, reconcile the latest paired source state, and turn the selected work into one complete ABM with QAM.

Then proceed with available evidence. If branding/feedback arrives, read it and consolidate it. If it has not arrived, prepare the register and targeted repository-baseline request while keeping the specific visual choices pending. Do not make Tony repeat the entire history or demand a collection of old screenshots already summarized and retained.

## 26. Launch prompt Tony can use with this handoff

```text
JARVIS — continue as my Architect in:
Architect: CyPh New Plan - P6 - APBM007 - FINALIZE

Read this handoff and the bundled current campaign journal and source index.
Our next module is exactly ABM007_FINAL: an ABM, not an APBM, still part
of Phase 007. Consolidate accepted remaining QA/manual reworks, product
polish, the in-app Help guide, Coach's incoming internal feedback and
Frank's actual branding material into one bounded final build for the
two existing alpha apps. I will provide the branding details here.

Preserve the working baseline, existing accounts/history and the final
three-pharmacy rehearsal state. Separate historical certification,
later repair evidence, customer passes and open engineering coverage.
Do not repeat completed testing or create technical setup work for users.

Prepare the complete ABM with mandatory QAM after reconciling current
source state and real branding inputs. Use the existing deployment
workflow for the final authorized push. Keep my Git and release authority,
retain one active writer, and give me clear concrete next actions.
```

## 27. Final handoff state

**Completed in the preceding lab:** deployment interpretation/coordination, extensive manual QA and repair follow-through, original customer rehearsal closeout, v3 recipe rework/internal Rework Record, matching v3 PDF, detailed product Help/fix handoff, Slack-style reporting and campaign doctrine journal v0.3.

**Completed by preparing this handoff:** captured the above, grounded earlier QA/Lead evidence, preserved exact module/lab naming, defined the pending branding/feedback intake and packaged useful source snapshots.

**Not completed by this handoff:** receiving Frank's actual assets, Coach's new feedback run, live paired-repo inspection, final ABM freeze, engineering changes, new independent QA, git integration, Help deployment or polished Frank-facing release acceptance.

**Next owner:** JARVIS in the new lab, with Tony supplying the promised branding/feedback.  
**Next deliverable:** one reconciled finalization scope/register and then the complete `ABM007_FINAL` pack.  
**Main principle:** preserve what works, fix what is demonstrated, polish to the actual approved brand, and carry every remaining limit honestly into a reviewable final release.
