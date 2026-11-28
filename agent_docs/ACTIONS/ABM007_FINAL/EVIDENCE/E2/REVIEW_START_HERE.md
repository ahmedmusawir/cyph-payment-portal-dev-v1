# REVIEW_START_HERE — ABM007_FINAL engineering review, package 01 (interim)

**Date:** 24 November 2026, Asia/Dhaka · **From:** Engineer (Claudy) · **To:** Architect (JARVIS) for review; Director (Tony) for three stop resolutions and Git.

**What this is.** The E2 engineering return under the Director's release (`SOURCES/DIRECTOR_RELEASE_E2_2026-11-24.md`): records of the release, the built work in both repositories (uncommitted), its verification, and the Engineer's handoff documents.

**What this is not.** Not `ENGINEERING COMPLETE`: three task-level stops remain (below), so this is an **interim handoff** as amendment F requires. No commit, branch, push, dashboard change, database write, email, purchase or deployment was made. No QA result, approval or certificate is filled.

**Internal only.** Paths name deployment services; do not forward outside the project team.

## Read in this order

1. `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` — the narrative, stops (section 8) and Git reminder (section 10).
2. `ABM_ACCEPTANCE_LEDGER.md` — 36 rows, each a claim with its evidence.
3. `EVIDENCE/E2/VERIFICATION.md` — how the working-tree copies were built and bound, and every result.
4. `QAM/QAM_MANIFEST.md` — identity, change inventory, reproduction, what QA needs.
5. Then as needed: `CONTRACT_FREEZE.md`, `ABM_RULINGS.md` AM-08 to AM-11, `CONTRACTS/HELP_CONTENT.md` (label table and corrections), `EVIDENCE/E2/*.md`, the screenshots in `EVIDENCE/E2/rendered/shots/`.

## Five things to know first

1. **Both apps carry the new look in their working trees.** Exact tokens, Inter, light only, logo, navy headers, white cards, Help at `/help`, the store-selector fix, names, notice wording. OwedBook 91 paths, Portal 66 product paths plus module records (`EVIDENCE/E2/INVENTORY_*.txt`).
2. **Checks are green on the actual working trees.** OwedBook 389/389, Portal 580/580; typecheck, lint (warnings equal baseline), build exit 0 in both. Public pages render light with exact colors even with a dark OS and saved dark theme.
3. **Three stops.** S-1: the email body needs your template export (AC-E01 not claimed). S-2: no SCRATCH fixtures, so no signed-in screen was rendered and the redirect reproduction is blocked. S-3: one old-logo reference in an unreachable Portal module needs an exception.
4. **New since E1:** you committed the Portal records as `b2e50fa` and pushed both branches; alpha still serves `ef4cebc` and `6dd3de7` (observed 04:06Z).
5. **AM-11** records that a Member following Help's billing link is returned to the OwedBook page by the existing guard; no guard was changed.

## Decisions requested

| From | Decision |
|---|---|
| Director | S-1: provide the template export (session S1). S-2: provide existing SCRATCH identities and a way to point builds at SCRATCH, or pass these checks wholly to QA. S-3: one of the three options in `EVIDENCE/E2/LEFTOVERS.md` L-9. Leftovers removal. Commit both candidates when ready |
| Architect | Review the interim package; confirm AM-11's reading of AC-H03 |

## Package facts

`FILE_INDEX.json` lists every member except itself, with size and SHA-256. The ZIP's own SHA-256 is in the `.sha256` file beside it and in the return message. Product files are not in the ZIP (they are in the two working trees and listed in the inventories). No secret or environment-file content is in any member (pattern scan run; copies built without environment files).
