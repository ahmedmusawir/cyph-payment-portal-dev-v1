# ABM007_FINAL — module pack

One final build module in the Phase 007 campaign. It gives OwedBook and Account & Billing the approved Pharmacy Books brand, adds an in-app Help page and a few selected fixes, and carries every remaining limit forward openly. One contract, two repositories.

**Status:** second review candidate (REVIEW_02), 23 November 2026, with the Architect's amendments A-01 to A-06 applied. Not frozen, not released, not installed.

## File index

| File | What it is | Owner |
|---|---|---|
| `REVIEW_START_HERE.md` | Entry for the package review | ABM author |
| `AMENDMENT_EVIDENCE_02.md` | Each Architect amendment mapped to the files that changed | ABM author |
| `CLAUDE.md`, `AGENTS.md` | Matching role routing | ABM author |
| `ABM_ENTRY.md` | Engineering entry: read order, dispatch, assignment, stop rules, completion duties | ABM author |
| `ABM_BRIEF.md` | Objective, scope, exclusions, baselines, Director checks, estimate | ABM author |
| `ABM_ACCEPTANCE_SPEC.md` | The criteria | ABM author |
| `ABM_RULINGS.md` | Settled decisions, proposed positions, errata | Director decides; author records |
| `ABM_STATE.md` | Current state index | each seat, its own transitions |
| `ABM_EXECUTION_PLAN.md` | The Engineer's plan (not yet authored) | Engineer |
| `ABM_ACCEPTANCE_LEDGER.md` | Engineering claims per criterion (empty) | Engineer |
| `ABM_JOURNAL.md` | Checkpoints | each seat |
| `ABM_SKILLS_MANIFEST.md` | Skills and tooling, with activation status | ABM author, then Engineer |
| `RETROSPECTIVE.md` | Measures and lessons (empty) | all seats |
| `CONTRACTS/BRAND_UI_CONTRACT.md` | Token mapping and component rules | ABM author |
| `CONTRACTS/UI_SPEC.md` | Screen and component mapping | ABM author |
| `CONTRACTS/NO_BREAK_AND_PATHS.md` | Protected behaviors, per-repository routing, paths, effects | ABM author |
| `CONTRACTS/BACKLOG_DISPOSITIONS.md` | Every open item with a disposition | ABM author |
| `CONTRACTS/LOGO_ASSET_SPEC.md` | Logo master and derived assets | ABM author |
| `CONTRACTS/EMAIL_AND_STRIPE.md` | Email and Stripe scope, sequence and limits | ABM author |
| `CONTRACTS/HELP_CONTENT.md` | Help page build notes and customer text | ABM author |
| `CONTRACTS/OWEDBOOK_POINTER.md` | Pointer file for the OwedBook repository | ABM author |
| `DESIGN/` | Token file, style tile, sample screens, renders, build scripts | ABM author |
| `QAM/` | Module-specific independent QA assignment, including `GATE_D_PLAN.md` and local copies of the governing playbooks in `QAM/GOVERNING/` | per file |
| `SOURCES/` | Source snapshots used in authoring | as received |
| `FILE_INDEX.json` | Every package member with size and SHA-256 | ABM author |

## Entry points

- Engineer: `ABM_ENTRY.md`.
- Independent QA: `QAM/QAM_ENTRY.md`.
- Reviewers: `REVIEW_START_HERE.md`.

## Installation (after the contract is frozen; a Director action)

The pack is placed at `agent_docs/ACTIONS/ABM007_FINAL/` in the Portal repository, and `CONTRACTS/OWEDBOOK_POINTER.md` is installed as that folder's `README.md` in OwedBook. Whether `SOURCES/` is committed with it is the Director's choice: it contains internal records and tester email addresses.
