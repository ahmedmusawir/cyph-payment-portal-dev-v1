# QAM_ENTRY — `ABM007_FINAL`

Written for this module under QAM_PLAYBOOK v1.0 and QA_PLAYBOOK v1.2 (local copies in `GOVERNING/`), for a module that spans two repositories. **Owner: the ABM author at packaging** (Architect-owned file). This file is the canonical entry both `CLAUDE.md` and `AGENTS.md` point to. It references authority; it grants none.

## 1. Module identity

| Field | Value |
|---|---|
| Module ID / type | `ABM007_FINAL` / ABM |
| Repositories | OwedBook `cyph-v1-dev` (`Cyberize-Group/cyph-v1-dev`); Portal `cyph-payment-portal-dev-v1` (`ahmedmusawir/cyph-payment-portal-dev-v1`) |
| Module directory | `agent_docs/ACTIONS/ABM007_FINAL/` in the Portal repository (canonical). This QAM lives at `agent_docs/ACTIONS/ABM007_FINAL/QAM/` there. OwedBook holds a pointer only |
| Engineering branch (both) | `abm007-final` |
| QA branch (both; created by the Director at the completed engineering candidate commits; continuing; merged by the Director) | `qa/abm007-final` |
| Baselines (full SHA) | OwedBook `9597699b404afdbcd792a9b4da61c21abb10cdf8`; Portal `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Candidate (tested product identity) | `PENDING` — a **pair**, one commit per repository. Resolved by the QA Executor in Q1 from the Director's commit receipts and read-only Git evidence, and reconciled against the handoff inventory. Never invented |
| Governing playbooks | QAM_PLAYBOOK v1.0 and QA_PLAYBOOK v1.2, with three others; local copies and hashes in `GOVERNING/` |

## 2. Governing contract (linked, not duplicated)

| Item | Module-relative path | Identity |
|---|---|---|
| Frozen acceptance spec | `../ABM_ACCEPTANCE_SPEC.md` | Version and SHA-256 recorded in `QAM_STATE.md` when the contract freezes |
| Rulings and errata lane (append-only) | `../ABM_RULINGS.md` | same |
| Supporting contracts | `../CONTRACTS/` (brand, UI spec, no-break and paths, backlog dispositions, logo, email and Stripe, Help content) | same |
| Visual target | `../DESIGN/` | Approved at Gate V, recorded in the rulings file |
| Engineering entry | `../ABM_ENTRY.md` | — |
| Other governing bodies | `GOVERNING/README.md`, `GOVERNING/PROVENANCE.md` | per source |
| Deployed verification plan | `GATE_D_PLAN.md` | Approved before any deployment |

Frozen criteria text is never changed by a plan edit. A contract question is a `STOP-CONTRACT` for the Architect and the Director, not a reinterpretation.

## 3. Seats and write permissions

| Seat | May write | May not |
|---|---|---|
| QA Executor (PENDING the Director's selection) | `QAM_RECON_REPORT.md`, `QAM_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, its parts of `FINDINGS.md`, execution rows of `QAM_CLEANUP_REPORT.md`, `evidence/**`, `AUTOMATION/**`, `HANDOFFS/**` packages and receipts; the Result and Evidence cells of `QAM_PREFLIGHT.md`; section 3 of `QAM_RISK_REQUIREMENTS.md`; the `QAM_TEST_PLAN.md` draft and the QA Lead's exact amendments; its own dated entries in `QAM_STATE.md`. Transcription of an approval or certificate only when expressly instructed, with exact supplied text and attribution | Product code, product tests, contract files, the Engineer's evidence, `QAM_MANIFEST.md`; composing any approval, disposition, retention decision or verdict; any Git mutation; any deployment; any dashboard change |
| Engineer | `QAM_MANIFEST.md`, `HANDOFFS/ENGINEERING_HANDOFF.md`, its own `QAM_STATE.md` entries; ruled repair paths on `qa/abm007-final` only | QA results, plan approval, dispositions, certificate |
| QA Lead | `QAM_APPROVAL.md` decisions, dispositions in `FINDINGS.md`, retention and cleanup-acceptance decisions, `QAM_CERTIFICATION.md`, section 1 of `QAM_RISK_REQUIREMENTS.md`, its own state entries | Product changes; inventing evidence |
| Architect seat | Repair instructions, closeout instruction, its own state entries. (The Architect-owned packaging files in this QAM were authored by the ABM author under D-15.) | QA results; substituting an engineering-green result for independent QA |
| Director | Release references in `QAM_APPROVAL.md`; the QA credential file; all Git actions; risk decisions; dashboard changes; its own state entries | — |

**Protected paths (never written by any QA seat):** all product source, tests, configuration, lockfiles, migrations, deploy files, `RECOVERY.md`, session folders, and every module file outside `QAM/` — in both repositories.

**Permitted effects on the target:** as approved at Q2 release from the envelope proposed in `QAM_RISK_REQUIREMENTS.md` section 2. Until then: read-only, plus the bounded Q1 probes the preflight authorizes. Anything else is `STOP-AUTHORITY`.

**Never touched:** the Director's rehearsal account on DEV, its three pharmacies, invoices and history; the alpha services' data.

**Authority rule:** being pointed at this folder and asked to start authorizes **Q1 only**.

## 4. Target and prerequisites (summary; executable rows in `QAM_PREFLIGHT.md`)

| Item | Value |
|---|---|
| Target environment | PROPOSED (P-19): QA-controlled production builds of both apps on ports 3100 (OwedBook) and 3101 (Portal), against the SCRATCH database and the Stripe sandbox, with the Executor's own webhook listener. QA and alpha share that sandbox, so a separate listener and database do not by themselves isolate events: Q1 must prove isolation in both directions (`QAM_PREFLIGHT.md` PF-4.7) before any paid test. Confirmed or amended in Q1; approved at Q2 release |
| Runtime mode | Production builds, never dev mode |
| Roles required | Owner, Store admin, Member, a second Member ("Helper"), and one identity whose access was removed |
| Test data | Isolated QA fixtures on SCRATCH: an owner with at least two pharmacies, and a bounded synthetic audit history long enough to need a second page. The Director's rehearsal account is not a fixture |
| Toolchain | Node and package manager as each repository pins them; Playwright with Chromium, Firefox and WebKit; Windows Chrome is the stakeholder baseline for human checks |
| Credential file | `.env.qa.local` in each repository where needed, created by the Director, ignored and untracked, key names only recorded |

## 5. Read order and phase dispatch

Read: `QAM_STATE.md` → this file → the contract and rulings (section 2) → `GOVERNING/README.md` → `QAM_RISK_REQUIREMENTS.md` → `QAM_MANIFEST.md` and `HANDOFFS/ENGINEERING_HANDOFF.md` (claims) → `QAM_PREFLIGHT.md` → the phase file for the recorded state. Before acting, compare the recorded state's prerequisites with disk and current identity in **both** repositories.

| Recorded state | Next owner | What the arriving QA Executor does |
|---|---|---|
| `READY FOR ENGINEERING` | Engineer | Nothing to test. Report that engineering is pending |
| `ENGINEERING COMPLETE — AWAITING QA BRANCH` | Director | Report that the handoff exists and the Director has not yet committed the candidates and created the QA branches. Do not start Q1 |
| `READY FOR RECON` | QA Executor | **First, the standing preflight: confirm the basics (branches, builds, target, listener) and tell the Director at once if something is missing.** Then run `QAM_PREFLIGHT.md`; resolve the candidate pair and reconcile it with the handoff; write `QAM_RECON_REPORT.md`; draft `QAM_TEST_PLAN.md`; build the Q1 package; record `Q1 COMPLETE — AWAITING QA LEAD REVIEW`; stop |
| `Q1 COMPLETE — AWAITING QA LEAD REVIEW` | QA Lead | Return the existing Q1 package. Do not rerun Q1 |
| `Q1 AMENDMENTS REQUESTED` | QA Executor | Apply only the exact edits in `QAM_APPROVAL.md`, record the diff, re-bind the plan, record `Q1 AMENDED — AWAITING QA LEAD BINDING` |
| `Q1 AMENDED — AWAITING QA LEAD BINDING` | QA Lead | Return the amended plan and its hash |
| `HOLD` | per the record | Report the blockers and their owners |
| `APPROVED — NOT RELEASED` | Director | Name the missing release. Do not start Q2 |
| `RELEASED FOR Q2` | QA Executor | Verify the approval, the candidate pair, both HEADs and the target; review each complete candidate-to-HEAD diff; recheck changeable readiness rows; **execute the whole approved plan in one continuous run**; build the Q2 package; record `Q2 COMPLETE — AWAITING ADJUDICATION` |
| `Q2 COMPLETE — AWAITING ADJUDICATION` | QA Lead | Return the existing Q2 package |
| `STOPPED (STOP-*)` | per the stop record | Report the stop. Resume only from the recorded point after resolution |
| `REPAIR RULED — AWAITING COMMIT` | Engineer, then Director | Waiting state. **Do not retest** |
| `RETEST SCOPE APPROVED — NOT RELEASED` | Director | Name the missing release |
| `RELEASED FOR Q4` | QA Executor | Verify the repaired pair, the retest scope approval and the release; re-pin; run the Q4 scope; package; record `Q4 COMPLETE — AWAITING ADJUDICATION` |
| `Q4 COMPLETE — AWAITING ADJUDICATION` | QA Lead | Return the Q4 package |
| `VERDICT ISSUED — CLEANUP PENDING` | QA Lead, then QA Executor | When the retention decisions are recorded, execute cleanup and record `CLEANUP EXECUTED — AWAITING ACCEPTANCE` |
| `CLEANUP EXECUTED — AWAITING ACCEPTANCE` | QA Lead, then Director | Return the cleanup report |
| `CLEANUP ACCEPTED — RELEASED TO CLOSEOUT` | Architect | QA work is complete |
| `CLOSED` | — | Show the verdict and receipts. Restart nothing |
| Unknown, missing or inconsistent | owner of the inconsistent record | Return the exact discrepancy. Do not guess or repair the record |

## 6. Rules specific to this module

1. **Q2 runs to completion.** A product failure is a finding, not a stop. Unaffected checks continue. One result package at the end.
2. **No repair during Q2.** The Engineer is not engaged on any repair until Q2 is completely finished and adjudicated.
3. **Housekeeping does not stop the run.** Fix it within the QA lane, record it, keep going. Genuine identity, authority, environment, instrument, evidence and privacy stops remain stops.
4. **Two repositories, one candidate.** Every identity check, diff and receipt is done for both. A verdict covers the pair or nothing.
5. **Director interventions are grouped.** Where a human inbox or judgment is needed, the Executor prepares what is needed and the QA Lead walks the Director through it in one session, one check at a time, recording each answer before the next, and returns them.
6. **Post-deployment criteria** (AC-E02, AC-E03 deployment record, AC-E04, AC-D01, AC-D02) are not part of Q2. They are judged under `GATE_D_PLAN.md` after an authorized deployment. A Gate Q PASS does not close the module, and that Gate D covers this module's branding checks only, not deferred lifecycle or payment work.
7. **Visual judgment.** Rendered checks, measured contrast and the approved `DESIGN/` references are the basis. The references use the real logo, exact colors and fictional content; the mobile menu on them is a labelled picture. They define the look. They do not define today's wording, fields, navigation items or their order, and a difference from a sample in those respects is not a defect.
8. **Paid tests wait for the isolation proof** (PF-4.7) or the Director's authorization of one specific alternative. Nonpayment work proceeds.
9. **Audit paging** (AC-R04 i) is exercised on a synthetic fixture, or recorded BLOCKED for a specific disposition. It is never "not applicable" for want of data.
10. **Authority.** Read and obey each repository's instructions; preserve the Director's decisions and approved exceptions; surface a real conflict with both sources and stop only the affected work (`GOVERNING/README.md` section 2).

## 7. Outputs and return

Every Q1 return, Q2 return, material stop and retest return produces one indexed ZIP at `HANDOFFS/ABM007_FINAL_<PHASE>_REVIEW_<ATTEMPT>.zip` per `QAM_PACKAGING.md`, with its absolute path, member count, SHA-256 and the exact decision requested. Evidence from the OwedBook repository is copied into this QAM's evidence lane with its source path recorded; nothing is written into OwedBook's module pointer folder.

## 8. Engineer completion duties (pointer)

See `../ABM_ENTRY.md` section 7. The Engineer completes `QAM_MANIFEST.md` and `HANDOFFS/ENGINEERING_HANDOFF.md` for **both** repositories before the Director commits, and records `ENGINEERING COMPLETE — AWAITING QA BRANCH`.
