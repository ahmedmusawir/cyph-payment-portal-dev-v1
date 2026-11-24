# QA LEAD RECOMMENDATION — Regression strategy for OwedBook and Account & Billing

**Date:** 24 November 2026, Asia/Dhaka
**From:** QA Lead · **To:** Director, Architect
**Answers:** the Director's request of 24 November (doctrine action DC-002)
**Revision:** 3, same day. Applies the Architect's qualifications RA-01 to RA-09 (campaign journal v0.3, Entry 003). Section 11 maps each one to where it landed. Revision 2 added the banking rule.
**Status:** recommendation, returned for Director adoption. Nothing here is approved, released or built. It does not expand E2 of `ABM007_FINAL`, does not activate any deferred payment test, and grants no execution, reset, fixture creation, provider effect or Q2 release.

## 0. What I worked from, and what I did not have

| Source | Used for |
|---|---|
| The Engineer's pre-module recon, 23 Nov (read-only, both repositories) | Test inventory |
| The Engineer's draft engineering plan, 24 Nov | Baseline runs; which tests the restyle changes |
| APBM-007B Gate Q certificate, 18 Nov | What was proven, on which commits, and the known risks |
| `ABM007_FINAL` QAM, review package 02, and my amendment of 24 Nov | Current contract coverage |

**Not available to me:**
- **The campaign journal, at revisions 1 and 2.** It has since reached me as v0.3, and I have read Entries 001 to 003 in full. This revision follows it.
- **The current candidate.** My test counts (374 and 572) are the **baseline** of 23 to 24 November. The Architect reports 394 and 584 in the Engineer's completion review 02, which I have not seen. Neither pair is a result for the final candidate. The whole inventory in section 1 is historical and is reconciled against the actual candidate in Q1.
- **Either repository.** I cannot open a test file. Every statement about what a test covers is the Engineer's summary.
- **A QA Executor recon for this module.** Q1 has not started. Items marked **[Q1]** below are facts the QA Executor must confirm on the real repositories.

## 1. Inventory

Green counts are not journey coverage. Both unit suites pass in full, and the Portal still has almost no runnable browser regression for today's screens.

### 1.1 What exists

| Asset | Where | What it is | What it does not give |
|---|---|---|---|
| Unit tests: 374 in 54 suites (OwedBook), 572 in 32 suites (Portal). All pass at baseline | Product suites | Access rules, roles, forms, sign-in, handoff, registration, add-store, mail guard, notices, by the Engineer's summary | A real browser, a real session, two apps together, a real database |
| Typecheck, lint, production build, both apps. Pass | Product commands | Build health | Behavior |
| 3 Portal integration tests (`*.itest.ts`) | Portal | Database-backed, SCRATCH or local only | Not run at baseline. Content unknown to me **[Q1]** |
| 3 live Portal browser specs: add-store, regression, state | Portal `e2e/` | Current screens | Need a private fixture file and running servers. They loop over light and dark |
| 1 OwedBook browser spec, 42 lines: staff | OwedBook `e2e/` | One staff flow | It is the whole OwedBook browser suite |
| Browser helpers: rendered-contrast probe, overflow and 44px target probe, sign-in helper | Portal `e2e/` | Reusable instruments | The overflow helper forces a dark theme that will no longer exist |
| Database checks: 158 of 158 on fresh and upgrade paths | Run in the 007B campaign | Migration and isolation proof at migration 0070 | Whether they run from one command today **[Q1]** |
| 007B QA helpers, kept on purpose: deadline family (14), loading probes (15), real sign-in checks (18), payment journeys | The 007B QA lane, not a product suite | Proven instruments | Bound to 007B fixtures and commits. Not a standing regression pack |

### 1.2 What is stale

| Item | Why |
|---|---|
| 16 of the Portal's 19 browser specs | They open `/demo` routes removed on 13 November |
| Dark-theme loops in the helpers and the 3 live specs | Light is forced by `ABM007_FINAL` |
| 007B evidence as proof for a new candidate | It belongs to the 007B commits. It carries forward only with a diff that shows the path is untouched |
| The repositories' own "pending retest" ledgers | Behind the Director's 21 to 22 November rehearsal |

### 1.3 What is missing

1. A runnable browser regression for OwedBook beyond one short spec.
2. One standing journey across both apps: sign in, hand off each way, sign out. **[Q1]** confirms nothing in the product suites does this in a browser.
3. A browser-level role and isolation matrix that anyone can rerun with one command.
4. Store selection and truthful loading and error states, in a browser.
5. A single designated SCRATCH cast with a repeatable reset.
6. One command per tier. I know of no scheduled or automatic run of any browser tier.

### 1.4 What needs manual testing today

Real emailed sign-in and what the mail looks like. Stripe's hosted pages. Any step that needs a link from a real inbox, such as the transfer buyer step. A real phone. Overall visual judgment. Scheduler-driven billing events, which stay deferred.

## 2. Recommendation 1: the critical automated regression set

Three coverage groups, not three shots: **Tier 0**, **Tier 1**, and the **triggered campaigns** of sections 3 and 4. Tier 0 and Tier 1 are meant to run on every code-bearing candidate once the standing pack has a verified baseline. Exact names and commands are fixed before anything is implemented.

**Tier 0. Health.** Unit suites, typecheck, lint and production build, both apps. Exists today.

**Tier 1. Critical journeys.** Production builds of both apps, designated SCRATCH fixtures, one browser engine (Chromium), non-purchasing. Run time is measured once a valid baseline exists; under 15 minutes is a planning goal, not a limit.

**CR-01 to CR-12 are a target register.** I do not claim all twelve exist today, and they are not to be built inside the current E2. In Q1 the QA Executor maps each one to actual tests, to the module's acceptance criteria, and to what is missing.

**Non-purchasing does not mean read-only.** Several of these journeys change things:

| Journey | What it can change |
|---|---|
| CR-07 pricing | Preparing a price or a checkout can create objects at the payment provider |
| CR-08 invitations | Sends email; creates, accepts and revokes memberships |
| CR-09 role changes | Changes fixture roles and access |
| CR-10 billing | Scheduling or undoing a removal can change the provider subscription and the database. Opening the billing portal is a provider call |

So every test declares its effects, its target and how it is isolated. Coverage that uses no provider (mocked or service level) is kept apart from coverage that makes real provider calls. A routine core run never silently changes a subscription at the provider: those parts run only under effects the Director has declared, and otherwise the provider-free form is used and reported as such.

| ID | Journey | Priority it serves |
|---|---|---|
| CR-01 | Role matrix: Owner, Store admin, Member and a removed user each reach what they should and are refused what they should not, in both apps | Role permissions |
| CR-02 | Isolation: a user of account A cannot see account B's pharmacies or claims, through the screens and by direct request. Plus the database isolation checks | Account and store isolation |
| CR-03 | Store selection with zero, one and several pharmacies; the data shown belongs to the selected pharmacy | Store selection |
| CR-04 | A failed data request shows an error, never a zero or an empty table. Loading states end | Truthful states |
| CR-05 | OwedBook to Account & Billing and back, with no second sign-in | Two-way handoff |
| CR-06 | Sign out from each app; protected pages then refuse | Logout |
| CR-07 | Prices come from the server: USD 99 first, USD 49 additional. A changed value sent from the browser does not change the amount the server prepares. No charge is made | Server-authoritative pricing |
| CR-08 | Invitation: send, accept, scoped to one pharmacy; resend; revoke | Invitations |
| CR-09 | A role change or removal takes effect for a user who is already signed in | Role changes |
| CR-10 | Billing, non-paying part: plan summary, schedule a removal, undo it, open the billing portal | Billing lifecycle |
| CR-11 | Branding: exact colors resolved in the browser, light forced, contrast probe on five key screens, no old product name | Branding |
| CR-12 | Help opens from the menu; one keyboard-only path; no overflow and usable targets at phone width on key screens | Help, keyboard, mobile |

**A limit that must stay visible.** Automated fixture sign-in proves the app works for a signed-in user. It does not prove real sign-in, email delivery or a real handoff from an emailed link. Those are covered by one automated password sign-in on a QA identity plus the planned human checks. No report may present fixture sign-in as proof of real sign-in.

## 3. Recommendation 2: extra coverage triggered by what a module changes

The QA Executor's Q1 maps the candidate's diff to this table. The QA Lead confirms it at Q1 review.

| If the module changes | Add |
|---|---|
| Sign-in, session, callback, middleware | Full sign-in matrix, CR-05 and CR-06 on three engines, real sign-in checks |
| Access rules, database policies, any migration | Full database isolation and upgrade checks; full CR-01 and CR-02 |
| Pricing, checkout, webhook, server billing | The paid sandbox set. Only with proven event isolation and the Director's approved effects |
| Invitations, membership | Full invitation family on three engines |
| Any form | The typed-before-load probe on each changed form, three engines |
| Shell, navigation, styles, tokens | Full branding set; full viewport matrix |
| Email templates, notices | Body diff; a planned human email check |
| Framework or dependency upgrade | Tier 1 on three engines; full build checks |
| **When those phases arrive:** reference data | Version and effective-date checks; a refresh does not duplicate or destroy history |
| Calculation | The banked test cases as a permanent suite; per-claim and bulk paths agree; totals reconcile |
| Reports | Fixed sample letters; one pharmacy cannot fetch another's report; reply address per pharmacy |

## 4. Recommendation 3: when to run the broad campaigns

| Campaign | Run it when |
|---|---|
| **Broad browser:** three engines, full viewport matrix, all roles | A trigger in section 3 says so; before each staging milestone; before production; after any framework upgrade |
| **Integration and provider events:** real sandbox payments, webhooks, lifecycle | Only when payment, webhook or lifecycle code changes, or before production. Never by default. Requires proven sandbox isolation, an approved effects list, and the Director's release |

A module that touches none of the triggers runs Tier 0 and Tier 1 plus its own contract checks, and nothing more.

## 5. Recommendation 4: the human walkthrough

As amended on 24 November (DC-001; my amendment, revision 2). Inside Q2, before I adjudicate. Each check states its action, expected result, fixture, permitted effects, candidate and environment, and evidence. A required check not performed stays pending or blocked, and no pass is issued over it.

Qualifications from the Architect, which I accept:
1. **Order.** Normally the automated campaign runs first and the human checks are grouped after it. A sign-in or access step the Director must do may happen earlier when it is actually needed. That does not create another shot.
2. **Who performs.** The Director performs. The Architect guides and translates the steps and is not an independent performer. Each person records only what they themselves saw. No agent writes the Director's answer for him.
3. **Size.** Eight checks and about 30 minutes is a planning target for me to work to. It is not permission to drop a required acceptance criterion. If more is essential, I say why and the plan decision covers it.
4. **Real phone.** A real-phone check needs a named, available device, raised in Q1. An emulated screen is useful and is never recorded as a real-device pass.
5. **Effects.** The walkthrough keeps the module's approved effects envelope exactly as it is, including any paid path already authorized. It neither adds to it nor cancels it.

## 6. Recommendation 5: fixtures, flakes, repair and retest

**Fixtures**
1. One designated SCRATCH cast, named by role: two unrelated accounts; an Owner with several pharmacies; a Store admin; a Member; a removed user; an invited person.
2. The QA Lead owns its definition. Today the cast is the existing APBM-007B SCRATCH fixtures the Director has authorized for reuse. That authorization covers reuse only. It does not cover creating fixtures, changing credentials or resetting anything.
3. **No blanket reset.** At the start of a campaign the QA Executor verifies the known fixture state and the actual resolved target, and stops if the target is wrong or missing. A reset is allowed only for specifically named disposable fixtures, under a separately approved, repeatable seed-and-reset contract, with the target verified and no other writer active. "SCRATCH" is a label, not proof that wiping a database is safe.
4. A fixture need the existing cast cannot meet is raised in Q1 as a gap for the QA Lead and the Director. Nobody creates one on their own authority.
5. Parallel runs do not share fixtures they change.
6. Credentials stay in the ignored QA credential file. A test session set up for a fixture user is setup only. It is not proof of normal sign-in.
7. No automated test changes shared DEV, Coach's data or the Director's rehearsal account. Ever.

**Failures and flakes**
1. No hidden retries. No weakened assertion. No skipped test without a recorded reason.
2. **The first failure is kept and reported at once.** It is a finding from that moment.
3. A rerun is a diagnostic step, not a way to get green. Before any rerun the failure is classed: wrong target, environment, instrument, or product.
4. A rerun happens only when it is useful and safe. A test with side effects (a payment, an invitation, a removal) is never rerun automatically.
5. One reproducible failure is enough to fail. There is no fixed number of reruns.
6. A mix of pass and fail is an intermittent finding. A later pass does not erase the earlier failure.
7. A time limit is part of the instrument. It changes only with a recorded reason and a measurement.
8. Only the QA Lead may quarantine a test, with a named owner and a stated condition for review or closure. Required coverage under quarantine needs a real alternative. Nothing required is dropped quietly.
9. An infrastructure failure is recorded as blocked. It is never a product pass.

**Repair and retest**
1. No repair starts while Q2 is still running. Approved work that a failure does not affect carries on to completion where that is safe.
2. Immediate stops remain: wrong target, an isolation breach, data corruption, a compromised instrument, or a real missing prerequisite. A stop is not a repair.
3. Automated and human findings go into one register, each keeping its source. One adjudicated repair work order goes to the Engineer.
4. Repairs follow the installed module's repair and Git policy and the Director's Git authority. This strategy changes neither. (The standing instruction I hold is that repairs stay on the QA branch and the Director commits.)
5. Before certification: the original failure, its neighbors, and the core set are rerun on the final candidate. Expensive unchanged campaigns are not rerun just because a report was repackaged. The Director repeats only the human checks the repair touched.
6. Useful QA helpers are never kept by merging a QA branch or its leftovers. They reach the product through an approved engineering change (section 8).
7. Gate D stays separate, on the deployed services.

## 7. `ABM007_FINAL`: what its contract already requires, and what is new work

| A. Already in the current contract. No change | B. Broader infrastructure. Needs a new engineering assignment |
|---|---|
| Both unit suites, typecheck, lint, build | Moving QA helpers into the product test suites as a permanent pack |
| The ten critical journeys of AC-R04, run once on the new look | Repairing the browser helpers' theme loop. The contract allows browser-spec changes only to retire specs |
| Branding instruments, Help checks, 375, 768 and 1024 widths | A SCRATCH cast seed and reset command |
| Mapping and retiring the 16 stale specs | One command per tier; any automatic run |
| The QA Executor writes current-screen checks in the QA lane | A real OwedBook browser suite |
| One first purchase and paid additions, only inside the approved envelope and after the isolation proof | Deferred payment exception and lifecycle tests. **Not activated** |

Column B is not added to E2 and is not asked of the Engineer now.

## 8. The smallest useful first implementation

**Step 1. Costs nothing extra.** In Q2 of `ABM007_FINAL` the QA Executor must write current-screen checks for the module's accepted requirements anyway. Where such a check matches a CR journey, it carries that CR number as a mapping. The QA Executor proposes the file layout in Q1 and I approve it; one file per journey is not required where shared setup reads more clearly. They stay in the QA lane. A CR number grants no new scope and no new effects.

**Step 1a. Mark for keeping, before cleanup.** After the checks have actually passed and been adjudicated, and before any QA branch or file is cleaned up, the QA Lead and the QA Executor mark what is worth keeping: the exact scripts, their checkpoints, the fixture specification, the permitted effects, and the candidate each passed on. Credentials and sign-in state are never kept.

**Step 2. One small assignment after certification.** A separate engineering assignment, proposed name `REG-001`, separately estimated and separately released: turn the marked, passed, non-purchasing journeys into a maintained pack with one local command per app, and retire the theme loop in the helpers. Any seed-and-reset contract is its own approval inside that assignment. No paid test. No new framework, paid service or scheduled run. My two-to-three-day figure is a rough guess, not a measurement, and the Engineer's estimate replaces it.

**Step 3. From then on** every module's Q1 starts from that pack.

**Step 4. The banking rule** (added 24 November at the Director's suggestion, from long-standing QA practice: record what worked, keep its pass checkpoints, rerun them on every new build). Every automated journey that passes certification is banked into the standing pack before the module closes.

1. Banked means: the test, its pass checkpoints, the fixture it needs, and the commit it was certified on.
2. The first banking is done by `REG-001`. After that, regression runs inside each module's regular QAM, and keeping the pack current is normally part of that module's own engineering work. It is not another mandatory assignment after every certification. (Director's direction, 24 November.)
3. A banked test's expected result changes only through an approved, attributable change to the product contract, or the recorded retirement of the feature. It is never edited because a new build fails it. A saved screenshot baseline is replaced only after someone has reviewed and accepted the changed look.
3a. Only a script that actually ran and passed is banked as passed. Earlier manual testing is a source for writing a script. It is not proof that the script passed.
4. Tests that need a purchase or a provider event are banked too, but stay switched off until the Director releases a provider campaign.
5. Human checks are not banked as automation. Their wording is kept so the next walkthrough can reuse it.

The first banking happens in `REG-001`. After that, each module's engineering work adds and maintains its own tests in the pack.

**Adopted.** The Director directed on 24 November that this revised strategy proceed. The current-module amendments are in `QAM_AMENDMENT_01.md` and its install instructions.

## 9. Director decisions

| # | Decision | My recommendation |
|---|---|---|
| 1 | Adopt Tier 0, Tier 1 and the triggered campaigns, with CR-01 to CR-12 as the **target** register, mapped to real coverage in Q1 | Yes |
| 2 | In `ABM007_FINAL` Q2, checks already in scope carry CR numbers as mappings, and passed scripts are marked for keeping before cleanup | Yes |
| 3 | Agree in principle to `REG-001` after certification, separately estimated and released, and say where the pack lives | Yes; in each repository, with the shared cast defined once |
| 4 | Broad campaigns run on triggers and before each milestone, not on every module | Yes |
| 5 | The failure and flake rules in section 6: first failure is a finding; reruns are diagnostic and safe | Yes |
| 6 | No blanket SCRATCH reset. Fixture state is verified at the start; any reset needs its own approved seed-and-reset contract for named disposable fixtures | Yes |
| 7 | Eight human checks and about 30 minutes as a planning target, not a cap that can waive a required check | Yes |
| 8 | Paid provider-event tests stay off until you release them separately | Yes |
| 9 | The banking rule in section 8, step 4: every journey that passes certification is banked into the standing pack before the module closes | Yes |

Coach's normal tester recipe is untouched by all of this, pending his feedback.

## 10. Doctrine

| Action | Status |
|---|---|
| DC-001, walkthrough inside Q2 | Recorded for this module in my amendment. Central playbook and template update OPEN |
| DC-002, regression strategy | This recommendation. Central playbook and template update OPEN |

Neither is closed until I have seen the synchronized playbook and templates. The journal reached me at v0.3. Also still open: entering the walkthrough amendment into the installed QAM, checked against the installed pack, before Q1 or Q2 routing depends on it. That is the Architect's and the Engineer's action under the Director's authority.

## 11. The Architect's qualifications, and where each landed

| ID | Qualification | Accepted? | Where |
|---|---|---|---|
| RA-01 | CR-01 to CR-12 are a target register; Q1 maps them; not built in the current E2 | Yes | Section 2 |
| RA-02 | Non-purchasing is not read-only; declare effects; keep provider-free and real-provider coverage apart | Yes | Section 2 |
| RA-03 | No blanket reset or fixture-creation authority | Yes | Section 6, fixtures; decision 6 |
| RA-04 | First failure is a finding; reruns are diagnostic and safe; no fixed count; quarantine by condition, not date | Yes | Section 6, failures |
| RA-05 | Keep real stops; follow the installed repair and Git policy; no merging of QA leftovers | Yes, with the Director's standing rule kept: no repair starts while Q2 is running | Section 6, repair |
| RA-06 | Time and effort figures are planning goals and guesses | Yes | Sections 2, 5 and 8; decision 7 |
| RA-07 | `REG-001` after certification; mark reusable scripts before cleanup | Yes | Section 8, steps 1a and 2 |
| RA-08 | CR numbers as mappings; layout proposed in Q1 | Yes | Section 8, step 1 |
| RA-09 | Name the groups plainly; no new shots | Yes | Section 2, first paragraph |

One point I am holding to. RA-05 softens "Q2 always finishes before repair". The Director's standing instruction to me is that no repair begins before Q2 is finished. I have kept that and added the Architect's immediate stops beside it, since a stop is not a repair. If the Director wants the softer wording, that is his call.

## Glossary

- **Tier 0 / Tier 1:** build health checks / the critical journey set, both run on every candidate.
- **CR-nn:** a critical regression journey.
- **Cast:** the designated set of QA accounts and pharmacies on SCRATCH.
- **SCRATCH / DEV:** the QA database / the shared development database the alpha apps use.
- **[Q1]:** a fact the QA Executor must confirm on the real repositories in its planning shot.
- **REG-001:** proposed name for the small regression-infrastructure assignment.
- **Gate D:** the separate check of deployed services.
