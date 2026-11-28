# GOVERNING — `ABM007_FINAL` QAM

**Owner: the ABM author at packaging.** What governs this QA engagement, where each source is, and how this QAM was reconciled with it. Revised for REVIEW_02 (Architect amendment A-04).

## 1. Governing bodies (all in this folder)

| Source | Version | File here | Identity |
|---|---|---|---|
| QAM_PLAYBOOK | 1.0, 2026-10-18 | `QAM_PLAYBOOK.md` | `PROVENANCE.md` |
| QA_PLAYBOOK | 1.2, 2026-10-18 | `QA_PLAYBOOK.md` | `PROVENANCE.md` |
| ABM_PLAYBOOK | 1.0, 2026-10-17 | `ABM_PLAYBOOK_v1_0.md` | `PROVENANCE.md` |
| DESIGNER_PLAYBOOK | 2.2, 2026-10-18 | `DESIGNER_PLAYBOOK.md` | `PROVENANCE.md` |
| GLOBAL_DESIGN_SYSTEM_HANDBOOK | 1.2, 2026-10-18 | `GLOBAL_DESIGN_SYSTEM_HANDBOOK.md` | `PROVENANCE.md` |
| Each repository's root instructions (`CLAUDE.md`, `AGENTS.md`; `CLAUDE.local.md` in OwedBook) | at the candidates | In the repositories | Read there by each seat on entry. Not read by the author |

These are byte copies of the project-supplied sources, with sizes and hashes. **No Hub commit identity was provided and none is claimed** (`PROVENANCE.md`). There is no copy step left for the Director.

## 2. Order of authority

1. The Director's explicit decisions and approved module exceptions (`../../ABM_RULINGS.md`).
2. The frozen contract: `../../ABM_ACCEPTANCE_SPEC.md` and `../../CONTRACTS/`.
3. Each repository's own instructions, including their protections and tool restrictions.
4. The governing playbooks in this folder.
5. This QAM's files.

A real conflict on scope, permissions or grading is surfaced with both sources quoted and its owner named; only the affected work stops. Nobody resolves it by picking a side. A folder-level instruction never erases a repository protection or a tool restriction, and a generic rule never silently reverses a Director decision.

## 3. Reconciliation with QA_PLAYBOOK v1.2

The author had not read this playbook at REVIEW_01. It was read in full for REVIEW_02. What changed in this QAM as a result:

| QA_PLAYBOOK | Requirement | Where it now lives |
|---|---|---|
| Section 5, source-of-truth order and conflicts | Conflicts are surfaced, not ignored | Section 2 above; `../../CONTRACTS/NO_BREAK_AND_PATHS.md` section 3 |
| Section 6, the handoff is a claim package | Engineering evidence is claims | `QAM_MANIFEST.md`, `HANDOFFS/ENGINEERING_HANDOFF.md` |
| Section 7, the spec is the QA contract; traceability | Every criterion traced to a test and to evidence | `QAM_TEST_PLAN.md` section 5; `AC_EVIDENCE_MATRIX.md` (36 rows) |
| Section 8, evidence labels | EVIDENCE, INFERENCE, CLAIM, GAP, QUESTION | `QAM_RECON_REPORT.md` |
| Section 10, scope protection | Outside-scope defects become follow-ups, not failures of this module | `FINDINGS.md` section 4 |
| Section 11, verdict model | PASS, PASS WITH FOLLOW-UP FINDINGS, PASS WITH KNOWN RISK, FAIL, BLOCKED | `QAM_CERTIFICATION.md` section 1 |
| Section 12, Gate Q required checks | Seven groups, including 375 / 768 / 1024 and "Gate D plan exists before deployment" | `QAM_CERTIFICATION.md` section 2; viewports in `QAM_RISK_REQUIREMENTS.md`; `GATE_D_PLAN.md` |
| Section 13, Gate D steps D1 to D9 | Deployed verification, including rollback readiness | `GATE_D_PLAN.md` section 4 |
| Section 14, final environment reset | Leave the environment as found | `QAM_CLEANUP_REPORT.md` step 7 |
| Section 15, manual QA one test at a time | Director checks are read and recorded one by one | `QAM_ENTRY.md` rule 5; `GATE_D_PLAN.md` section 4 |
| Sections 17 and 18, defect standard and severity | Sixteen fields; severity by impact | `FINDINGS.md` sections 2 and 3 |
| Section 19, regression doctrine | A test is removed only with documented feature retirement | `QAM_MANIFEST.md` section 6; `QAM_TEST_PLAN.md` section 7; risk row MR-9 |
| Section 26, browser state is part of the system | Stored theme, first paint, sessions | Risk rows MR-3 and MR-14; plan section 12 |
| Section 27, mock mode is tested when it ships | OwedBook has a mock data mode | Risk row MR-15; manifest section 5; recon section 4; plan section 8 |
| Section 29, security and evidence handling | No secrets in evidence | `QAM_PACKAGING.md` section 3; `evidence/README.md` |

**Vocabulary mapping.** Executor result labels in this QAM are PASS, FAIL, BLOCKED, NOT RUN, ADJUDICATE (QAM_PLAYBOOK section 11). Where QA_PLAYBOOK says UNTESTED, read NOT RUN. The verdict words belong to the QA Lead only.

**One real difference, recorded, not hidden.** QA_PLAYBOOK section 12 names "Gate M" and a 375 / 768 / 1024 check. This module has no separate Gate M record; its mobile and layout criteria are AC-L04 and the coverage matrix, which now include 768 and 1024 as well as 375 and 1440. If the Architect holds that a named Gate M record is required, that is a contract point for the Architect, and it changes no test.

## 4. How this QAM was instantiated

- **Authored for this module:** every file in this folder tree. `QAM_RISK_REQUIREMENTS.md` section 1 is the adopted QAM-SR v1.0 text, unchanged.
- **Complete structures.** `QAM_MANIFEST.md`, `HANDOFFS/ENGINEERING_HANDOFF.md`, `QAM_RECON_REPORT.md`, `QAM_TEST_PLAN.md`, `QAM_APPROVAL.md`, `QAM_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md`, `FINDINGS.md`, `QAM_CLEANUP_REPORT.md`, `QAM_CERTIFICATION.md`, `QAM_PACKAGING.md`, `GATE_D_PLAN.md` and the three lane READMEs define their own fields, owners and rules. They were written from the playbooks in this folder, not copied from the Hub template set, which was not supplied. No file defers to an outside template. All results are empty.
- **Adapted for two repositories:** identity, diffs, manifests and receipts are kept per repository; the candidate is a pair.

## 5. Project policies that apply

- The Director is the sole Git committer.
- Agents are addressed by seat, not by model name.
- QA runs production builds, never dev mode.
- Q2 runs to completion; no repair starts until Q2 is finished.
- At the start of every QA run the Executor checks the basics first and reports anything missing immediately.
- Repairs stay on the QA branch.
