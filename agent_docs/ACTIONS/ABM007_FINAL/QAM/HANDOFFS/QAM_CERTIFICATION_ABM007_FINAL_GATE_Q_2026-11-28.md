# Gate Q certificate — ABM007_FINAL

**Issued by:** the QA Lead · **To:** the Director · **Copied:** the Architect, the Engineer, the QA Executor
**Date:** 28 November 2026, Asia/Dhaka · **Module:** `ABM007_FINAL` (Pharmacy Books brand, Help page, selected fixes; OwedBook and Account & Billing as one app)

## 1. Verdict

# PASS WITH KNOWN RISK

The committed candidate pair is certified at Gate Q. Every acceptance criterion that can be judged on the local QA setup passes. Four payment journeys and one price check could not run there and were moved to Gate D by the Director (ruling AM-21). They are named in section 4 and they block module closure.

This certificate does not close the module, approve deployment or replace Gate D.

## 2. What is certified

| Item | Value |
|---|---|
| Branch, both repositories | `qa/abm007-final` |
| OwedBook commit | `025c578` (pushed; parent `2e91e90`) |
| Account & Billing commit | `5b8e935` (pushed; parent `fc1fa6c`) |
| OwedBook manifest | `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603`, 2,314 files |
| Account & Billing manifest | `bb27c2ee7515d9c2a2d9df5dd537fdd0d02313816b2e5c0798bf6ca38402ee98`, 2,557 files |
| Post-commit check, run by the Director on 28 November | Both commits match the tested manifests. Mismatches: none in OwedBook, none in Account & Billing |
| Final QA package | `FOR_FRIDAY_FINAL_ABM007_FINAL_Q4_CONFIRMATION_2026-11-27_143314_BDT.zip`, SHA-256 `5e63926136b66c4a340ff746c97e8ffd6b51291f9118bd766300cb45d29fcec1`, 8,433 files, all indexed files re-hashed with no mismatch |
| Test target | SCRATCH only. No charge, no purchase, no change to DEV, alpha, Coach's data or the rehearsal account at any point |

The retest ran on uncommitted files identified by content (Q4 entry amendment 01). The post-commit check proves the committed files are byte-for-byte the files that were tested, so the evidence carries to these two commits.

The QA Executor records the two full commit IDs at cleanup.

## 3. The road here

| Stage | Outcome |
|---|---|
| Q2, full campaign | FAIL, repairable. 24 of 32 criteria passed; 5 failed on look-and-feel defects; nothing Critical |
| Repair work order RWO-01, nine items | Repaired by the Engineer |
| Add-on A1 | Opening-page header wording, Help link at phone width, short-window menu, signed-in footer |
| Q4 retest | Repairs held. One new defect (F36, faint Help link) |
| Add-on A2 | The Director's Help redesign (ruling AM-23) and one clipped focus outline |
| Add-on A3 | Finding F37: keyboard focus was left behind after "Go to the Top" |
| Final confirmation | 468 of 468 link activations pass in three browser engines; lowest link contrast 4.53 to 1; all checks green |

## 4. Criteria

Thirty-six criteria. Four belong to Gate D and are not judged here: AC-E02, AC-E04, AC-D01, AC-D02.

| Result | Criteria |
|---|---|
| **PASS** (30) | AC-V01, B01, B02, B03, B04, B05, B06, B07, B08, B09, L01, L02, L03, L04, L05, N01, N02, H01, H02, H03, F01, F02, F03, R01, R02, R03, R06, E01, E03 (source part), P01 |
| **PASS for the part that can run locally; the rest moved to Gate D** (2) | AC-R04, AC-R05 |

**AC-R04, ten journeys.** Six pass: J-a, J-e, J-f, J-h, J-i, J-j, with the app-to-app part of J-b. **Moved to Gate D:** J-c (register through Stripe Checkout), J-d (buy an extra pharmacy), J-g (schedule a removal and undo it), and the Stripe billing return of J-b.

**AC-R05, prices.** Source values and the public plan screen pass ($99.00 and $49.00). **Moved to Gate D:** the price on the review screen, which is reached only inside J-c.

Unit suites on the certified pair: OwedBook 409 of 409, Account & Billing 588 of 588. Typecheck, lint and production builds clean in both.

## 5. Human walkthroughs by the Director

| Round | Checks | Result |
|---|---|---|
| Q2 walkthrough | HC-01, HC-02, HC-04, HC-05, HC-06, HC-07, HC-08 (HC-03 removed by ruling) | All PASS. Observations became repair items |
| Q4 walkthrough, sheet 04 | W-01 to W-08 | All PASS |
| Final look, sheet 05 | W-09, W-10 | Both PASS. "w-09 pass and i am very happy" |

## 6. Known risks and limits

| # | Risk or limit | Where it is settled |
|---|---|---|
| 1 | **Payment journeys not run on this candidate:** J-c, J-d, J-g, the Stripe return of J-b, and the review-screen price. The payment code is byte-identical to the baseline (AC-R03); what is unproven is that the restyled purchase screens click through | **Gate D, blocking.** The Director runs them on alpha on one new throwaway tester account with sandbox test payments (AM-21) |
| 2 | Finding F02, open, High: the QA setup shares a Stripe sandbox with alpha and cannot receive Stripe events | Environment gap. Carried to the Architect; not a product defect |
| 3 | No real phone was used. The iPhone overflow was reproduced and fixed at 320 wide on desktop engines only | Gate D, on the Director's iPhone: Billing & subscription, the dashboard, one dropdown |
| 4 | Member-only screens were not retested after the repairs, because the Member test account was removed in Q2 as planned. The repaired pieces are shared by all roles and passed for Owner and Store admin | Accepted limit. A Member look at Gate D if the alpha account has one |
| 5 | Some states were never observed (a few loading, error and payment-only statuses) | Accepted. No hardcoded color exists in source, so they draw from the same tokens |
| 6 | The dark green link on white measures 4.53 to 1 against a 4.5 minimum. It passes, with little margin | Noted for the Architect: a brand-token question, not a defect |
| 7 | The forced-light check was done on Ubuntu Chrome, not Windows | Optional Windows look at Gate D |
| 8 | After "Go to the Top" by keyboard, the Help heading shows a white focus outline. Intended | The Director saw it and passed W-09 |

## 7. Findings at certification

| Finding | Final disposition |
|---|---|
| F03, F04, F18, F21, F27 | Product defects. Repaired and retested. **Closed** |
| F28, F29, F31 | Director-ordered changes. Delivered and retested. **Closed** (F29 superseded by ruling AM-23) |
| F36, F37 | Product defects found in retest. Repaired and confirmed. **Closed** |
| F30 | Dropdown placement in Chrome's phone emulation. Observation. Real-phone look at Gate D |
| F38 | With scripts already switched off, a fresh load shows no Help content. **Not a defect of this module.** The whole signed-in app needs scripts, and no criterion asks otherwise. The check was the QA Lead's own extra. Observation to the Architect |
| F02 | **Open, High**, environment. See risk 2 |
| F15, F26 | QA fixture defect (deleted sandbox customers). Not product. Carried with risk 1 |
| F20 | Fixture sign-in setup timeouts. Test environment. Closed for this module, flagged to the Architect |
| F33, F34, F35 | Follow-up findings outside this module. Owner: the Architect |
| F01, F05 to F14, F16, F17, F19, F22 to F25, F32 | Test tooling, test setup or the QA Lead's own plan errors, corrected during the run. **Closed.** First failures kept |

In the final confirmation, the rows still marked FAIL are the first Firefox timing attempt (the clock started too early) and cases where the tool parked a link at the very edge of the window. The corrected runs pass. Instrument, first failures kept.

## 8. Cleanup decisions (the keep-list)

| Item | Decision | Reason |
|---|---|---|
| Evidence under `evidence/` | **Keep all** | It is the record behind this certificate |
| Helpers under `AUTOMATION/` | **Keep all** | They are the candidates for the first maintained regression pack (REG-001), under the banking rule |
| Failed attempts and first failures | **Keep** | Standing rule |
| SCRATCH test accounts and pharmacies | **Keep as they are. No reset** | Needed again. Their known gaps are recorded: the Member was removed, and two owners point at deleted sandbox customers |
| Stripe sandbox objects created by QA | **None were created** | Nothing to remove |
| Disposable build output and isolated copies | **Remove** | Rebuildable |
| The Director's private cast file | **Not QA's to remove** | It belongs to the Director |

## 9. What happens next

1. The QA Executor records this certificate, runs cleanup under section 8, and builds the final export.
2. The Director commits the QA records.
3. The Architect does the engineering closeout. The doctrine and contract clarifications owed are listed in `QA_LEAD_RWO01_RELEASE_AND_DIRECTOR_RULINGS_ABM007_FINAL_2026-11-26.md`, section 5, plus: save the walkthrough sheet after every check; keep a spare Member fixture; run one browser session at a time on shared fixtures.
4. The QA Lead revises the Gate D plan to carry ruling AM-21. The Director approves it.
5. Redeploy to alpha.
6. Gate D: the deployed check, the branded emails, the iPhone look and the four payment journeys. The module closes only when those pass.

Still open and not closed by this certificate: REG-001, and the central playbook sync for the walkthrough rule and the regression strategy.

## Glossary

- **A1 / A2 / A3:** the three add-ons to the repair work order.
- **AC-xnn:** an acceptance criterion.
- **AM-nn:** a dated amendment row in `ABM_RULINGS.md`.
- **CR-nn:** a critical-regression journey from the regression strategy.
- **F-nn:** a finding in the QA register, full ID `ABM7F-Fnn`.
- **Gate Q / Gate D:** the QA certificate on the candidate, and the check of the deployed alpha after redeploy.
- **HC-nn / W-nn:** human checks done by the Director.
- **J-a to J-j:** the ten critical journeys inside AC-R04.
- **Manifest:** a list of files with a fingerprint for each, so a later copy can be proven identical.
- **Q2 / Q4:** the QA execution run, and the retest after repair.
- **REG-001:** the separate assignment to build the first maintained regression pack.
- **RWO-01:** the repair work order.
- **SCRATCH:** the separate QA database.
