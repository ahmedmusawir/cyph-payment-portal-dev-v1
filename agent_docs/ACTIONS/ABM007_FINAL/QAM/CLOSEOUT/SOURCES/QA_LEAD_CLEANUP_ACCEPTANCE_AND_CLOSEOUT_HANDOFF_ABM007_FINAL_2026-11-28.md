# Cleanup acceptance and closeout handoff — ABM007_FINAL

**From:** the QA Lead · **To:** the Architect · **Copied:** the Director, the Engineer, the QA Executor
**Date:** 28 November 2026, Asia/Dhaka · **Module:** `ABM007_FINAL`

QA is finished up to Gate D. This document accepts the QA Executor's cleanup and hands the module to you for engineering closeout.

**Sent with this handoff:** the Gate Q certificate, and the two `deploy.sh` scripts as the Director supplied them on 28 November.

## 1. Cleanup: ACCEPTED

| Item | Value |
|---|---|
| Final QA export | `FOR_FRIDAY_FINAL_ABM007_FINAL_GATE_Q_CERTIFICATE_AND_CLEANUP_2026-11-28_105105_BDT.zip` |
| SHA-256 | `f0ff0683570df17b3d3b8949ecc9cd7c1a800fda0d89984eb0a67c7bd4a53012` |
| Contents | 8,479 files. I re-hashed all 8,478 indexed files: zero mismatches, zero missing |
| Removed | 14 disposable build copies, all verified absent |
| Kept | All evidence, all automation helpers, all first failures, the earlier packages |
| SCRATCH | Test accounts and pharmacies left as they are. No reset |
| Stripe sandbox objects created by QA | None |
| Ports 3100 and 3101 | Clear. No owned QA process running |
| Secret scan of retained output and the export | Zero matches |
| The Director's private cast file | Not opened, not removed |
| Product files, DEV, alpha, Coach's data, the rehearsal account | Untouched by cleanup |

**The keep-list is approved as executed.** Everything under `AUTOMATION/` is kept as candidate material for the first maintained regression pack (REG-001). The fixture sign-in helper is kept with its known limit (finding F20).

**One note on the certificate copy in the repository.** The QA Executor transcribed the certificate from text pasted in chat. It differs from the file I issued in three glossary lines only. The verdict and every section are identical. The transcription's SHA-256 is `d3928bc403f758901ac1dede5a7da5f6d0b20638850771ea8d721c29117c6b33`; the issued file's is `3f2303f954e73e94cb5a5ae5963e638e57c906414aa6fcf818cf410d12e89b7c`. I accept the transcription as the repository record.

## 2. What is certified

**Gate Q: PASS WITH KNOWN RISK.**

| App | Certified commit on `qa/abm007-final` | Files checked | Mismatches, Director's run | Mismatches, QA Executor's run |
|---|---|---|---|---|
| OwedBook | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` | 2,314 | 0 | 0 |
| Account & Billing | `5b8e935a58105897d53b7e4caeb3916bbfb99e23` | 2,557 | 0 | 0 |

Manifests: OwedBook `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603`; Account & Billing `bb27c2ee7515d9c2a2d9df5dd537fdd0d02313816b2e5c0798bf6ca38402ee98`.

The Director commits the QA records on top of the Account & Billing commit. That commit changes files inside `QAM/` only, which the manifests leave out.

## 3. What you need to preserve

The match check and everything it reads, all in the Account & Billing repository:

- `agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py`
- `agent_docs/ACTIONS/ABM007_FINAL/QAM/evidence/Q4/A3/ob-manifest.json`
- `agent_docs/ACTIONS/ABM007_FINAL/QAM/evidence/Q4/A3/pp-manifest.json`

It needs only Python 3 and Git, and it is read-only. It is run from the Account & Billing repository root:

- `python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit ob --commit <commit>`
- `python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit pp --commit <commit>`

A pass is an empty mismatches list with the manifest hash above. The manifests include some record files outside `QAM/`, such as the changelog and session logs. If closeout edits those, the check will report them. Send me the output and I will rule: record-only differences are acceptable, product or test differences are not.

## 4. Rules for closeout

Agreed between us on 28 November.

1. **Product and test files stay frozen.** Closeout commits records and documents only. No change to a certified product file to improve a deploy script; any such need gets an explicit impact decision first.
2. **Merge to main with a merge commit** that keeps the certified commits in its history. Record the full certified commit IDs and the resulting main commit IDs. Give the Director the exact steps.
3. **Run the match check against each resulting main commit** and send me the output.
4. **Main is frozen until Gate D passes.** A deployed defect gets its own repair branch from main, an affected QA review and a deployed retest.
5. **The DEV database is frozen until Gate D passes:** no new schema, configuration, seed, reset or unrelated data change. One exception: the authorized Gate D journeys create normal application records.
6. **Record the deployment inputs:** runtime configuration and secret versions, never secret values.
7. **Reconcile the deploy:** targets, runtime configuration, callbacks, sandbox payment routing and rollback steps.

**Service names.** Both scripts supplied name alpha:

| App | Service | Address | Database |
|---|---|---|---|
| OwedBook | `cyph-v1-owedbook-alpha` | `https://cyph-v1-owedbook-alpha.cyberizedev.com` | DEV |
| Account & Billing | `cyph-v1-payment-alpha` | `https://cyph-v1-payment-alpha.cyberizedev.com` | DEV |

Please reconcile your "OwedBook beta" note against these.

## 5. Rulings added during QA

All in `ABM_RULINGS.md`, section 3.

| ID | What it settles |
|---|---|
| AM-18 | Opening page: "Subscribe Now" and a navy "Log in" button. Navy is an exception for that one button |
| AM-19 | Help "Go to the Top", first form. Replaced by AM-23 |
| AM-20 | The QA Lead conducts the rework for this module |
| AM-21 | Four payment journeys and one price check move to Gate D, run by the Director on a throwaway account. They block module closure |
| AM-22 | Header wording changed to "Subscribe Now"; the Director confirms the 26 November record changes were his |
| AM-23 | Help "Go to the Top", final form: at the end of each of the 13 articles |

## 6. Carried to you

| Item | What it is |
|---|---|
| F02, open, High | The QA setup shares a Stripe sandbox with alpha and cannot receive Stripe events. Environment gap, not a product defect. It is why the payment journeys run at Gate D |
| F15, F26 | Two SCRATCH owners point at deleted sandbox customers. QA fixture defect |
| F20 | Fixture sign-in setup times out now and then. Cause unknown |
| F33, F34, F35 | Follow-up findings outside this module: other shared components fade when disabled; the password icon fades when its field is disabled; the Store selector's disabled look was not measured |
| F38 | A fresh load with scripts already off shows no Help content. True of the whole signed-in app. Observation, not a defect |
| Contrast margin | The dark green link on white measures 4.53 to 1 against 4.5. A brand-token question |
| Contract and doctrine clarifications | Listed in `QA_LEAD_RWO01_RELEASE_AND_DIRECTOR_RULINGS_ABM007_FINAL_2026-11-26.md`, section 5, and in the certificate, section 9 |
| Lessons | Save the walkthrough sheet after every check. Keep a spare Member fixture. Run one browser session at a time on shared fixtures. Hand walkthrough sheets over as their own file. Check that a named file is really in the Downloads folder before a seat is told to read it |

## 7. Still mine

- The revised Gate D plan carrying AM-21, for the Director's approval before the deploy.
- Gate D on 3 December, with the Director.
- Ruling on any match-check difference you send me.

Not closed by this handoff: REG-001, and the central playbook sync for the walkthrough rule and the regression strategy.

## Glossary

- **Alpha:** the deployed test version, running on the DEV database.
- **AM-nn:** a dated amendment row in `ABM_RULINGS.md`.
- **F-nn:** a finding in the QA register, full ID `ABM7F-Fnn`.
- **Gate Q / Gate D:** the QA certificate on the candidate, and the check of the deployed alpha.
- **Manifest:** a list of files with a fingerprint for each, so a later copy can be proven identical.
- **QAM:** the QA folder inside the module directory.
- **REG-001:** the separate assignment to build the first maintained regression pack.
- **SCRATCH:** the separate QA database.
