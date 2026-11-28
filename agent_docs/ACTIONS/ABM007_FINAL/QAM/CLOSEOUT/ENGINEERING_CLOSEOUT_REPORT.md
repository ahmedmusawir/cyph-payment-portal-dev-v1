# Engineering closeout record — ABM007_FINAL

**From:** the Engineer · **To:** the Director, the QA Lead, the Architect · **Copied:** the QA Executor
**Date:** 28 November 2026, Asia/Dhaka · **Module:** `ABM007_FINAL` (OwedBook and Account & Billing as one app)

## 1. Status

**Engineering closeout prepared. Merge pending the Director. Gate Q: PASS WITH KNOWN RISK. Gate D: OPEN. Module
closure: pending Gate D.**

This is a records-only closeout. No product file, test, deployment script, dependency, configuration, migration or
fixture was changed. Nothing is staged, committed, pushed, merged or deployed by Engineering.

| Item | State |
|---|---|
| QA records commit (Account & Billing) | **Not made yet.** Prepared for the Director |
| Closeout records commit (Account & Billing) | Prepared for the Director |
| Merge to `main`, both repositories | **Not made.** Prepared for the Director |
| Match check on the certified commits | Pass, zero mismatches (`BASELINE_AND_MANIFEST_EVIDENCE.md`) |
| Match check on the resulting `main` commits | Not run: those commits do not exist yet |
| Redeploy to alpha | Not authorized. Not done |
| Gate D | Open. 3 December, the QA Lead with the Director |

`ABM_STATE.md`, `RECOVERY.md` and `CHANGELOG.md` still show the state of 26 and 27 November. I left them alone on
purpose: they are in the Gate Q manifests, and the work order says not to edit a historical record to make its status
look current. **This file is the current engineering status** until the QA Lead rules on updating them.

## 2. What was delivered

| Part | Content |
|---|---|
| Branding | The Pharmacy Books brand across both apps: colors and type from tokens, logo, headers and footers, buttons, fields, cards, sign-in and registration screens, the dashboard and the billing screens. No hardcoded color in source |
| Help | A new Help page in OwedBook: 13 articles, a contents menu, "Go to the Top" at the end of each article |
| Selected fixes | The fixes named in the module brief, delivered with the candidates of 24 November |
| Repair work order RWO-01 | Nine repair items (R-01 to R-09) after the Q2 campaign, including the opening-page buttons (AM-18) and the phone-width overflow |
| Add-on A1 | Opening-page header wording, Help link at phone width, short-window menu, signed-in footer (AM-22) |
| Add-on A2 | The Director's Help redesign (AM-23) and one clipped focus outline |
| Add-on A3 | Finding F37: keyboard focus left behind after "Go to the Top". The Help heading became the real target |

Product and test files changed by the repairs are listed in `EVIDENCE/RWO01/CHANGED_FILES.md`. Label changes are in
`EVIDENCE/E2/CHANGED_LABELS.md`.

## 3. Gate Q

**Verdict: PASS WITH KNOWN RISK**, issued by the QA Lead on 28 November 2026.

| App | Certified commit on `qa/abm007-final` | Manifest | Files |
|---|---|---|---|
| OwedBook | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603` | 2,314 |
| Account & Billing | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` | `bb27c2ee7515d9c2a2d9df5dd537fdd0d02313816b2e5c0798bf6ca38402ee98` | 2,557 |

- Criteria: 30 pass; 2 pass for the local part (AC-R04, AC-R05); 4 belong to Gate D.
- Unit suites on the certified pair: OwedBook 409 of 409, Account & Billing 588 of 588. Typecheck, lint and
  production builds clean in both.
- Final confirmation: 468 of 468 link activations pass in three browser engines.

**Human walkthroughs by the Director, from the certificate:**

| Round | Checks | Result |
|---|---|---|
| Q2 walkthrough | HC-01, HC-02, HC-04 to HC-08 (HC-03 removed by ruling) | All PASS |
| Q4 walkthrough, sheet 04 | W-01 to W-08 | All PASS |
| Final look, sheet 05 | W-09, W-10 | Both PASS |

**The two certificate files.** Both are kept; neither replaces the other.

| File | SHA-256 | What it is |
|---|---|---|
| `QAM/HANDOFFS/QAM_CERTIFICATION_ABM007_FINAL_GATE_Q_2026-11-28.md` | `d3928bc403f758901ac1dede5a7da5f6d0b20638850771ea8d721c29117c6b33` | The QA Executor's transcription from chat. The QA Lead accepted it as the repository record |
| `QAM/CLOSEOUT/SOURCES/QAM_CERTIFICATION_ABM007_FINAL_GATE_Q_2026-11-28_AS_ISSUED.md` | `3f2303f954e73e94cb5a5ae5963e638e57c906414aa6fcf818cf410d12e89b7c` | The file the QA Lead issued, as received. Windows line endings |

I compared them. They differ in three glossary lines only: the "A1, A2, A3" entry is punctuated differently, the
issued file has an "Alpha" entry the transcription lacks, and the transcription has a "CR-nn" entry the issued file
lacks. The verdict and every section are the same. This matches the QA Lead's statement.

## 4. Cleanup, accepted by the QA Lead

| Item | Value |
|---|---|
| Final QA export | `FOR_FRIDAY_FINAL_ABM007_FINAL_GATE_Q_CERTIFICATE_AND_CLEANUP_2026-11-28_105105_BDT.zip`, SHA-256 `f0ff0683570df17b3d3b8949ecc9cd7c1a800fda0d89984eb0a67c7bd4a53012`, 8,479 files |
| Removed | 14 disposable build copies |
| Kept | All evidence, all automation helpers, all first failures, the earlier packages |
| SCRATCH | Test accounts and pharmacies left as they are. No reset |
| Stripe sandbox objects created by QA | None |
| The Director's private cast file | Not opened, not removed. Engineering did not open it either |

Everything under `QAM/AUTOMATION/` is kept as candidate material for REG-001. Engineering deleted nothing.

## 5. Carried forward

### 5.1 Blocking module closure, at Gate D

| Item | Owner |
|---|---|
| AM-21 payment journeys on alpha, one new throwaway tester account, sandbox test payments: **J-c** registration through Stripe Checkout, **J-d** extra pharmacy purchase, **J-g** scheduled removal and undo, and the **Stripe billing return of J-b** | The Director runs; the QA Lead records |
| The price on the review screen (inside J-c): the deferred part of AC-R05 | The Director; the QA Lead |
| Gate D criteria **AC-E02, AC-E04, AC-D01, AC-D02** | The QA Lead with the Director |
| The deferred parts of **AC-R04** (the journeys above) and **AC-R05** (the review-screen price) | The QA Lead with the Director |
| Branded emails on the DEV project | The Director applies the prepared settings; the QA Lead checks |
| Real-iPhone checks: Billing & subscription, the dashboard, one dropdown (also finding F30) | The Director |
| Role checks where they apply: a Member look if the alpha account has one | The Director |
| The revised Gate D plan carrying AM-21, approved before the deploy | The QA Lead writes; the Director approves |
| Redeploy of both alpha services from the merged `main` | The Engineer, on the Director's release only |

### 5.2 Known risks and open findings

| Item | What it is | Owner |
|---|---|---|
| F02, open, High | The QA setup shares a Stripe sandbox with alpha and cannot receive Stripe events. Environment gap, not a product defect | The Architect |
| F15, F26 | Two SCRATCH owners point at deleted sandbox customers. QA fixture limitation | The QA Lead; the Architect for the fixture design |
| F20 | Fixture sign-in setup times out now and then. Cause unknown | The Architect |
| F33, F34, F35 | Follow-ups outside this module: other shared components fade when disabled; the password icon fades when its field is disabled; the Store selector's disabled look was not measured | The Architect |
| F38 | A fresh load with scripts already off shows no Help content. True of the whole signed-in app. Observation | The Architect |
| Green-link contrast | The dark green link on white measures 4.53 to 1 against 4.5. It passes with little margin. A brand-token question | The Architect |
| Member-only screens | Not retested after the repairs; the Member fixture was removed in Q2 as planned | Accepted limit; Gate D look if possible |
| States never observed | A few loading, error and payment-only states | Accepted |
| Forced-light check | Done on Ubuntu Chrome, not Windows | Optional look at Gate D |

### 5.3 Clarifications owed by the Architect

From `SOURCES/QA_LEAD_RWO01_RELEASE_AND_DIRECTOR_RULINGS_ABM007_FINAL_2026-11-26.md`, section 5, and the
certificate, section 9. None changes this module's work.

1. Field height: say whether "primary controls at least 44px" covers fields, or set a field height.
2. Name the type styles for header navigation items and the dashboard data-view tabs.
3. The playbook should offer "the QA Lead conducts the rework" as a recorded option.
4. Human checks should name the Director's actual machine at Q1.
5. Place provider-event journeys at the gate where they can run, at authoring time.
6. Supplemental human evidence should travel with its pictures and the page address.
7. Lessons: save the walkthrough sheet after every check; keep a spare Member fixture; run one browser session at a
   time on shared fixtures; hand walkthrough sheets over as their own file; check that a named file is really in the
   Downloads folder before a seat is told to read it.

### 5.4 Separate open work, not closed here

| Item | Owner |
|---|---|
| **REG-001**, the first maintained regression pack. Not started. Not part of this closeout | The Architect assigns |
| **Central playbook sync** for the walkthrough rule and the regression strategy (DC-001, DC-002) | The Architect |

## 6. Rulings added during QA

All in `ABM_RULINGS.md`, section 3, committed in `5b8e935`: AM-18 (opening-page buttons), AM-19 (replaced by AM-23),
AM-20 (the QA Lead conducts the rework), AM-21 (payment journeys to Gate D), AM-22 (three confirmations), AM-23
(Help "Go to the Top", final form).

## 7. Evidence paths

All in the Account & Billing repository, under `agent_docs/ACTIONS/ABM007_FINAL/`.

| What | Path |
|---|---|
| This closeout | `QAM/CLOSEOUT/` (start at `REVIEW_START_HERE.md`) |
| Baseline and match check | `QAM/CLOSEOUT/BASELINE_AND_MANIFEST_EVIDENCE.md`, `QAM/CLOSEOUT/evidence/` |
| The Director's Git steps | `QAM/CLOSEOUT/GIT_HANDOFF_FOR_TONY.md`, `QAM/CLOSEOUT/commit/` |
| Deployment reconciliation and freeze | `QAM/CLOSEOUT/DEPLOYMENT_RECONCILIATION_AND_FREEZE.md` |
| Handback to the QA Lead | `QAM/CLOSEOUT/HANDBACK_FOR_FRIDAY.md` |
| Supplied documents, as received | `QAM/CLOSEOUT/SOURCES/` |
| Match-check helper and manifests | `QAM/AUTOMATION/Q4_A3/manifest.py`, `QAM/AUTOMATION/Q4/manifest.py`, `QAM/evidence/Q4/A3/ob-manifest.json`, `QAM/evidence/Q4/A3/pp-manifest.json` |
| Certificate, repository record | `QAM/HANDOFFS/QAM_CERTIFICATION_ABM007_FINAL_GATE_Q_2026-11-28.md` |
| Findings and criteria | `QAM/FINDINGS.md`, `QAM/AC_EVIDENCE_MATRIX.md` |
| Cleanup | `QAM/QAM_CLEANUP_REPORT.md`, `QAM/evidence/CLEANUP/`, `QAM/HANDOFFS/GATE_Q_CLEANUP_START_HERE.md` |
| QA records staging list | `QAM/HANDOFFS/GATE_Q_FINAL_RECORDS_STAGING_LIST.txt` |
| Gate D plan (to be revised by the QA Lead) | `QAM/GATE_D_PLAN.md` |
| Rulings | `ABM_RULINGS.md` |
| Repair evidence, four engineering returns | `EVIDENCE/RWO01/` |

## Glossary

- **Alpha:** the deployed test version, running on the DEV database.
- **AM-nn:** a dated amendment row in `ABM_RULINGS.md`.
- **F-nn:** a finding in the QA register.
- **Gate Q / Gate D:** the QA certificate on the candidate, and the check of the deployed alpha.
- **J-a to J-j:** the ten critical journeys inside criterion AC-R04.
- **Manifest:** a list of files with a fingerprint for each.
- **Match check:** the helper that compares a commit with a manifest.
- **REG-001:** the separate assignment to build the first maintained regression pack.
- **SCRATCH:** the separate QA database.
