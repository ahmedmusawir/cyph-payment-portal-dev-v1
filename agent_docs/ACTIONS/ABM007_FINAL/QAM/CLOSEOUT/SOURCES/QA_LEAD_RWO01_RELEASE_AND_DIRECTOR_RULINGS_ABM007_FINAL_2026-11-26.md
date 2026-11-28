# RWO-01 release and Director rulings — ABM007_FINAL

**From:** the QA Lead · **To:** the Engineer · **Copied:** the Director, the Architect, the QA Executor
**Date:** 26 November 2026, about 12:34, Asia/Dhaka · **Module:** `ABM007_FINAL`
**Read with:** `QA_LEAD_ADJUDICATION_ABM007_FINAL_Q2_2026-11-26.md` (section 6 is the fix list, `RWO-01`)

## 1. What the Director ruled

Recorded from the Director's message of 26 November 2026, about 12:34.

| # | Ruling | Effect |
|---|---|---|
| 1 | **GO on RWO-01**, all nine items. The QA Lead leads the rework. The Architect stays copied | The Engineer may start. Repair instructions come from the QA Lead for this module |
| 2 | **Payment Option B.** Journeys J-c, J-d, J-g, the Stripe billing return part of J-b, and the review-screen part of AC-R05 move to Gate D, after redeployment | They are run on alpha by the Director, on one new throwaway tester account, with Stripe sandbox test payments only. Gate D's "no purchase" rule is lifted for that account only. The rehearsal account, Coach's data and every existing tenant stay untouched. They must pass before the module closes. Gate Q may be certified after a successful rework and retest as "pass with known risk", naming them. **This is not permission to run them now** |
| 3 | **Public opening page confirmed.** The existing green button keeps its look, is renamed "Subscribe Now" and goes to the configured Account & Billing home page. An equally sized navy "Log in" button sits beside it and goes to OwedBook login. The buttons stack where necessary. The navy exception applies to that new button only | Item R-01 |
| 4 | **Help "Go to the Top" stays mandatory** | Item R-02 |
| 5 | **iPhone overflow stays under R-07.** Verify the correct OwedBook pages first. If the candidate already behaves, return proof and make no unnecessary change. The Director checks on his iPhone after deployment. The dropdown displacement stays an observation until that phone check | Item R-07; finding F30 unchanged |
| 6 | **Other "free trial" wording:** the Engineer lists it and changes none of it. The Director rules on the list | Part of R-01 |
| 7 | **Sequence.** The Engineer repairs, runs the required engineering checks, returns evidence and stops. The Director commits. The QA Lead then provides the QA Executor's retest prompt and a proposed effects release for the Director's approval | One writer at a time |
| 8 | **Preserve** the original QA evidence and the Director's observations. Update the rulings and the campaign journal with these decisions, including doctrine clarifications owed at closeout | Sections 2, 4 and 5 below |

## 2. Rows the Engineer appends to `ABM_RULINGS.md`, section 3

Append these four rows after AM-17, newest last, with no other edit to that file. The module directory is `agent_docs/ACTIONS/ABM007_FINAL/` in the Account & Billing repository.

| ID | Date | Who and source | Ruling |
|---|---|---|---|
| AM-18 | 2026-11-26 | Director; ruling of 26 November on the OwedBook public opening page, confirmed about 12:34; QA Lead adjudication, work order RWO-01 item R-01 | **OwedBook public opening page buttons.** The existing green button keeps its look, is renamed "Subscribe Now" and opens the configured Account & Billing home page. A new, equally sized "Log in" button in brand navy sits beside it and opens the OwedBook login page. The two stack where they do not fit side by side. **Design exception:** navy as a button fill is permitted for this one button only; the brand contract's rule against navy buttons stands everywhere else. Other "free trial" wording on that page is listed by the Engineer and not changed until the Director rules on the list. AC-F03 and AC-N01 still apply to the page |
| AM-19 | 2026-11-26 | Director; walkthrough check HC-08, finding ABM7F-F29; RWO-01 item R-02 | **Help "Go to the Top" link, mandatory.** A small link at the bottom of the left contents menu on Help returns the reader to the top of the page. It is a navigation aid and changes no Help content; `CONTRACTS/HELP_CONTENT.md` is otherwise unchanged. AC-H01 is read to include it |
| AM-20 | 2026-11-26 | Director; rulings of 26 November | **The QA Lead conducts the rework for this module.** After Q2 adjudication the QA Lead issues the single repair work order (RWO-01) and gives all direction to the Engineer and the QA Executor, with the Architect copied. This replaces, for `ABM007_FINAL` only, the routing in `QAM/FINDINGS.md` section 6 that names the Architect's repair instruction. One writer at a time: the Engineer repairs on `qa/abm007-final` and stops; the Director commits; the QA Executor retests. After certification the module returns to the Architect for engineering closeout. Precedent: the Director's ruling of 17 November 2026 for APBM-007B |
| AM-21 | 2026-11-26 | Director; rulings of 26 November, payment Option B; QA Lead adjudication section 7; finding ABM7F-F02 and ABM7F-F26 | **Payment journeys moved to Gate D.** Journeys J-c, J-d and J-g of AC-R04, the Stripe billing return part of J-b, and the review-screen part of AC-R05 move from Gate Q (local QA) to Gate D (alpha, after redeployment). The Director runs them on alpha on one new throwaway tester account, with Stripe sandbox test payments only. The Gate D rule "no purchase" is lifted for that one account only. The rehearsal account, Coach's data and every existing tenant stay untouched. These rows block module closure. Gate Q may be certified after a successful rework and retest as "pass with known risk", naming them. This ruling does not release their execution: the QA Lead first revises `QAM/GATE_D_PLAN.md` and the Director approves it. No protected payment code changes |

## 3. What the Engineer may do to check the repairs

This is the QA Lead's reading of "the required engineering checks". The Director may narrow it.

- Build and run both apps locally from the QA branch.
- Signed-in checks on **SCRATCH only**, verified as SCRATCH before any sign-in, with the existing fixtures, under AM-14 and AM-15 as they stand.
- At most 20 sign-in sessions in total.
- **Not permitted:** any email, invitation, member removal, billing-portal opening, Stripe call, purchase, fixture reset or creation, credential change, DEV or alpha access, dashboard change, deployment, Git staging, commit, push or branch switch.

## 4. Campaign journal entry, ready for the Architect

The journal is the Architect's file. This is the text of the entry the QA Lead asks to have recorded.

> **26 November 2026 — Q2 adjudicated; rework released; payment journeys moved to Gate D.**
> The QA Lead adjudicated the final Q2 package (SHA-256 `024fe6bc52b6bda160b8e98d3f0d67f23526361d72757ee6f9cb5f0abb61b9fd`) on candidate pair OwedBook `2e91e909` and Account & Billing `fc1fa6c2`. Verdict: FAIL, repairable. Of 32 criteria judged at Gate Q: 24 pass, 5 fail (AC-B05, B06, B07, B08, L04), 1 finishes at retest (AC-L02), 2 depend on payment journeys (AC-R04, R05). Nothing Critical; no finding on money, prices or tenant isolation.
> The Director released repair work order RWO-01 (nine items) and ruled that the QA Lead conducts the rework for this module, with the Architect copied (AM-20).
> The Director chose payment Option B (AM-21): J-c, J-d, J-g, the Stripe return of J-b and the review-screen part of AC-R05 move to Gate D on alpha, on one new throwaway tester account with sandbox test payments. They block module closure. Gate Q may be certified as "pass with known risk" naming them.
> Director-ordered changes added: public opening page buttons with a one-button navy exception (AM-18), and a mandatory Help "Go to the Top" link (AM-19).
> Sequence: Engineer repairs and stops; Director commits; QA Executor retests (Q4) under a new effects release; QA Lead certifies; Architect closes out.

## 5. Doctrine and contract clarifications owed at closeout

For the Architect. None of these changes this module's work.

1. **Field height.** Brand contract 4.4 sizes fields by padding and text and they render 42px high. Section 4.2 and AC-B06 set 44px for buttons. AC-L04 says "primary controls at least 44px". The QA Lead read "primary controls" as buttons and the menu button. The contract should say so, or set a field height.
2. **Navigation and tab text.** Header navigation items (14 to 15px) and the dashboard data-view tabs (14px Medium) are not one of the four button variants. The contract should name their type styles.
3. **Who writes repair instructions.** `QAM/FINDINGS.md` section 6 and QAM playbook section 11 name the Architect. The Director has now ruled twice (17 and 26 November) that the QA Lead conducts the rework. The playbook should offer that as a recorded option.
4. **Human-check environment.** HC-05 named Windows Chrome because the QAM entry file calls it the stakeholder baseline. The Director works on Ubuntu. Human checks should name the Director's actual machine at Q1.
5. **Payment journeys on a shared sandbox.** A module whose candidate cannot receive Stripe events locally (finding F02) cannot pass AC-R04 at Gate Q. Future contracts should place provider-event journeys at the gate where they can actually run, at authoring time.
6. **Phone evidence.** The walkthrough handoff carried the Director's phone findings in words only, and the automated comparison then used the wrong app's page. Supplemental human evidence should travel with its pictures and the page address.
7. **Already open, not new:** central playbook sync for DC-001 and DC-002.

## 6. Still owed by the QA Lead

- After the Director's commit: the QA Executor's retest prompt and a proposed effects release.
- Before any deployment: the revised Gate D plan carrying AM-21, for the Director's approval.
- At certification: the keep-list approval and the certificate.

## Glossary

- **AM-nn:** a dated amendment row in `ABM_RULINGS.md`, section 3.
- **AC-xnn:** an acceptance criterion.
- **Alpha:** the deployed test version on the DEV database.
- **F-nn:** a finding in the QA register, full ID `ABM7F-Fnn`.
- **Gate Q / Gate D:** the QA certificate on the candidate, and the check of the deployed alpha after redeploy.
- **HC-nn:** a human check done by the Director.
- **J-a to J-j:** the ten critical journeys inside AC-R04.
- **Q4:** the retest after repair.
- **R-nn / RWO-01:** a repair item, and the repair work order that holds them.
- **SCRATCH:** the separate QA database.
