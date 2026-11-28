# QAM_AMENDMENT_01 — `ABM007_FINAL`

**Owner:** QA Lead · **Date:** 24 November 2026, Asia/Dhaka
**Authority:** Director rulings of 24 November 2026 (campaign journal Entries 001 to 003; doctrine actions DC-001 and DC-002)
**Installed by:** the Engineer, as a documentation-only change, before the engineering-to-QA handoff
**Status:** in force for this module once installed. It records no result and releases nothing.

## 0. How to read this file

1. This file amends the `ABM007_FINAL` QAM. Where an earlier sentence in another QAM file says something different, **this file governs.**
2. It changes no acceptance criterion, no approved effects envelope, no Gate D plan and no verdict authority. It adds no shot: Q1 and Q2 stay as they are.
3. It authorizes no test effect, no fixture creation, no reset, no provider call and no Q2 release.
4. The other QAM files carry a short pointer to this file. The pointers add no rule of their own.

## 1. Human walkthrough inside Q2

1. The Director's focused human walkthrough is a planned part of Q2. It is completed before the QA Lead adjudicates and before any product certification.
2. Normally it is grouped after the QA Executor's automated campaign. A sign-in or access step the Director must do may happen earlier, when it is actually needed.
3. **Who does what.** The Director performs the checks. The Architect may guide and translate the steps and is not an independent performer. The QA Executor prepares the builds and fixtures and keeps the evidence record. The QA Lead selects the checks, approves the plan and adjudicates; the QA Lead does not perform them.
4. Each person records only what they themselves saw. No agent writes the Director's answer.
5. In Q1 the QA Executor proposes a short, risk-based walkthrough, separate from the automated plan, with a practical effort estimate. The QA Lead selects or amends it at Q1 review. The selected set is recorded in the Q1 decision.
6. Every selected check records these fields:

| Field | Content |
|---|---|
| ID and criterion | `HC-nn`, and the acceptance criterion or risk it serves |
| Why a human | Why automated evidence alone is not enough |
| Candidate and target | Both candidate SHAs, the QA build address and port, the QA target, the browser or device |
| Fixture and effects | The role and account used; what the check may change; cleanup where it applies |
| Action | Short, plain-language steps |
| Expected result | What should be seen, taken from the contract |
| Evidence | The Director's observation in his own words, the time, and a sanitized screenshot only where it supports the observation |
| Result | PENDING, PASS, FAIL or BLOCKED. Never prefilled |
| Finding and retest | The linked finding, its disposition, and the retest result where one was required |

7. One check at a time. The answer is recorded before the next check is read out.
8. The walkthrough is short by design. About eight checks is the QA Lead's planning target. It is not permission to drop a required acceptance criterion.
9. A real-phone check needs a named, available device, raised in Q1. An emulated screen is never recorded as a real-device pass.
10. The walkthrough uses the module's approved effects envelope exactly as it stands. It neither adds to it nor cancels any part of it.
11. A planned human email check uses an inbox the Director controls. No link, code, password or sign-in state is written into any artifact.
12. A required human check that has not been performed stays PENDING, or BLOCKED with its reason. It is never represented as passed. No verdict of PASS in any form is issued while a required human check is open, unless the Director removes it from the required set in writing.
13. Checks that can only be made after deployment are named as such before Gate Q and remain Gate D obligations. A check passed in Q2 does not count for Gate D, and the reverse.

## 2. One findings register, one repair work order, affected retest

1. Findings from the automated campaign and from the walkthrough go into the one register, `FINDINGS.md`. Each finding records its **source**: automated, or Director walkthrough.
2. Both evidence sources are kept. A pass from one source does not suppress a failure from the other.
3. No repair starts while Q2 is running. Approved work that a failure does not affect continues to completion where that is safe. Immediate stops remain for a wrong target, an isolation breach, data corruption, a compromised instrument or a real missing prerequisite. A stop is not a repair.
4. After adjudication the QA Lead issues **one** consolidated repair work order for the Engineer. Repairs follow this module's installed repair and Git policy and the Director's Git authority.
5. After a repair: the QA Executor reruns the original failure, its neighbors and the required regression on the repaired candidate. The Director repeats only the human checks the QA Lead names as affected. Results that the repair did not touch are carried forward only with diff proof.
6. Candidate identity and evidence binding are reconciled before certification.

## 3. Failures and reruns

1. The first failure is kept and reported at once. It is a finding from that moment.
2. A rerun is diagnostic. Before any rerun the failure is classed: wrong target, environment, instrument, or product.
3. A test with side effects (a payment, an invitation, a removal, a role change) is never rerun automatically.
4. A mix of pass and fail is an intermittent finding. A later pass does not erase the earlier failure.
5. No hidden retries, no weakened assertion. An infrastructure failure is BLOCKED, never a product pass.
6. Only the QA Lead may set a required test aside, with a named owner and a stated condition for review.

## 4. Regression inventory and selection in Q1

Q1 remains read-only toward product and business data, as already stated in this QAM. In Q1 the QA Executor:

1. **Inventories** the tests and helpers that exist in both repositories and in the retained APBM-007B QA lane: unit, integration, browser specs, database checks, probes and helpers.
2. **Classifies** each as current, stale, or retired, with the reason. States what is missing and what can only be tested by a person today. A count of passing tests is not presented as journey coverage.
3. **Maps** the target register CR-01 to CR-12 (section 8) and this module's acceptance criteria to actual coverage and to gaps.
4. **Selects** coverage from the complete candidate diff, including dependencies and external configuration, and gives a reason and an owner for every exclusion, every reused evidence item and every limitation.
5. **Proposes** the candidate-specific test plan and the separate human walkthrough.
6. **Recommends** a layout for a durable regression pack.

Q1 does **not**: implement the regression pack (that is the separately scoped assignment `REG-001`), repair or rewrite product tests, run the campaign, or create, reset or re-credential fixtures.

The inventory the QA Lead wrote on 24 November came from earlier engineering summaries. It is historical. The QA Executor's inventory on the actual candidate replaces it.

## 5. Critical-regression mappings in Q2

1. A Q2 probe that already belongs to this module's approved scope may carry a CR number as a mapping.
2. A CR number grants no new scope and no new effect.
3. Each mapped probe keeps its actual result and the candidate identity it ran on.
4. "Non-purchasing" does not mean "changes nothing". Every test that can send mail, change a membership or role, or call the payment provider declares its effects, target and isolation in the plan. Coverage that uses no provider is reported separately from coverage that makes real provider calls.

## 6. Fixture sign-in is not proof of real sign-in

1. Every result records how the session was obtained: **fixture session** (set up for a designated fixture user as test setup), **password sign-in**, or **emailed link (human)**.
2. A fixture session proves only that the app behaves correctly for a signed-in user. It is not evidence of normal sign-in, of the emailed-link lifecycle, of email delivery, or of the handoff between the two apps from a real sign-in.
3. Real sign-in, email delivery and handoff each need their own test or human check, named in the plan.
4. No report, matrix row or certificate presents a fixture session as proof of any of those.
5. Routine automated runs do not depend on the Director's inbox.
6. This file gives no permission to establish sessions. Any such setup happens only as the Director has separately authorized: designated existing SCRATCH fixture users, target verified first, no DEV access, no secret exported.

## 7. Fixtures

1. The cast is the designated existing SCRATCH fixtures the Director has authorized for reuse. That covers reuse only.
2. At the start the QA Executor verifies the actual resolved target and the known fixture state, and stops if the target is wrong or missing.
3. There is no blanket reset. A fixture need the cast cannot meet is raised in Q1 as a gap for the QA Lead and the Director.
4. No automated test changes shared DEV, Coach's data or the Director's rehearsal account.

## 8. The target register (for mapping only)

These are targets to map against, not a claim that the tests exist and not work added to this module.

| ID | Journey |
|---|---|
| CR-01 | Role matrix: each role reaches what it should and is refused what it should not, in both apps |
| CR-02 | Account and store isolation, through the screens, by direct request, and in the database |
| CR-03 | Store selection with zero, one and several pharmacies |
| CR-04 | Truthful loading, empty and error states |
| CR-05 | Handoff between the two apps in both directions |
| CR-06 | Sign-out and session boundaries |
| CR-07 | Server-authoritative USD 99 and USD 49 pricing |
| CR-08 | Invitations: send, accept, resend, revoke |
| CR-09 | Role change or removal for a user already signed in |
| CR-10 | Billing, non-purchasing part |
| CR-11 | Branding: exact colors, light only, contrast, names |
| CR-12 | Help, keyboard path, phone-width usability |

## 9. Keeping reusable passing scripts

1. After results are adjudicated and **before any cleanup step removes anything**, the QA Executor lists the assets worth keeping, and the QA Lead approves the list.
2. For each asset the list records: the script, its pass checkpoints, the fixture specification, the permitted effects, the actual result, and the candidate it passed on.
3. Only a script that actually ran and passed is listed as passed. Earlier manual testing is not proof that a script passed.
4. **Never kept:** credentials, passwords, tokens, links, cookies, sign-in state, browser profiles, raw authenticated traces.
5. Kept assets stay in the QA lane. They are not carried into the product by merging the QA branch or its leftovers. They reach a maintained pack only through an approved engineering change (`REG-001`).
6. An expected result in a kept script changes only through an approved, attributable change to the product contract. A saved screenshot baseline is replaced only after review.

## 10. After this module

Recorded for continuity; it binds nothing in this module's E2. `REG-001` establishes the first maintained regression pack through a separately scoped engineering assignment. After that, regression runs inside each module's regular QAM, and keeping the pack current is normally part of that module's own engineering work, not a further assignment after every certification.

## 11. Open, outside this file

Central playbook and template synchronization for DC-001 and DC-002 is tracked separately and is not closed by installing this file.
