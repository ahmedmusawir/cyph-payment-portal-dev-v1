# ABM_ENTRY — ABM007_FINAL

The single entry for Engineering. `CLAUDE.md` and `AGENTS.md` in this folder point here. Independent QA enters through `QAM/QAM_ENTRY.md`, never through this file.

Read the persisted state in `ABM_STATE.md` before acting. Being pointed at this folder authorizes **reading and planning only**. Building needs the Director's recorded release of an approved plan.

## 1. Read order

1. `ABM_STATE.md` — where the module stands and who acts next.
2. This file.
3. `ABM_BRIEF.md` — objective, scope, exclusions, baselines.
4. `ABM_RULINGS.md` — settled decisions and positions still proposed. A proposed position is not approved until section 1 or a dated amendment says so.
5. `ABM_ACCEPTANCE_SPEC.md` — the criteria.
6. `CONTRACTS/` — `BRAND_UI_CONTRACT.md`, `UI_SPEC.md`, `NO_BREAK_AND_PATHS.md`, `BACKLOG_DISPOSITIONS.md`, `LOGO_ASSET_SPEC.md`, `EMAIL_AND_STRIPE.md`, `HELP_CONTENT.md`.
7. `DESIGN/README.md`, the token file, and the renders.
8. `ABM_SKILLS_MANIFEST.md`.
9. Each repository's own root instructions (`CLAUDE.md`, `AGENTS.md`, and `CLAUDE.local.md` in OwedBook). **Read and obey them, including their protections and tool restrictions. Preserve the Director's explicit decisions and approved module exceptions. A real conflict on scope, permissions or grading is surfaced with both sources quoted; only the affected work stops** (`CONTRACTS/NO_BREAK_AND_PATHS.md` section 3). The Engineer lists what each root instruction requires, and any conflict found, in the plan.
10. `SOURCES/` only as needed. The pre-ABM recon is yours and is reused; do not repeat it.

## 2. Dispatch by recorded state

| State in `ABM_STATE.md` | Next owner | What the Engineer does |
|---|---|---|
| `REVIEW CANDIDATE — AWAITING ARCHITECT VERDICT AND DIRECTOR RULINGS` | Architect, Director | Nothing to build. Report that the pack is under review |
| `CONTRACT FROZEN — READY FOR ENGINEERING PLAN` | Engineer | Do the entry checks in section 3, write `ABM_EXECUTION_PLAN.md`, return it. Do not build |
| `PLAN RETURNED — AWAITING REVIEW AND RELEASE` | Architect, Director | Return the existing plan. Do not rewrite it unasked |
| `ENGINEERING RELEASED` | Engineer | Execute the whole assignment continuously (section 4) |
| `ENGINEERING COMPLETE — AWAITING QA BRANCH` | Director | Report the handoff location and the Git reminder. Do not start QA work |
| Any QA state | per `QAM/QAM_STATE.md` | Engineering does nothing unless a repair has been ruled and routed to it |
| `REPAIR RULED — AWAITING COMMIT` | Engineer, then Director | Repair only the ruled paths on `qa/abm007-final`, self-verify, hand back. Nobody retests until the Director commits |
| `CERTIFIED — DEPLOYMENT AUTHORIZED FOR <service>` | Engineer | Deploy that one service with its existing `./deploy.sh` and return the read-back receipt |
| `CLOSED` | none | Show the result. Restart nothing |
| Unknown or inconsistent | owner of the inconsistent record | Report expected versus found, with paths. Do not guess |

## 3. Entry checks before the plan (read-only)

- **E-1 Identity.** Branch, full HEAD, working tree, stashes and remotes in both repositories, against the baselines in the brief.
- **E-2 Records in the tree.** The three OwedBook session-record files reported in recon: confirm they are records only, and say whether they should be committed before the build starts.
- **E-3 Branch reconciliation.** List local and remote branches in both repositories against the Director's earlier receipt. Report differences. Assert nothing about deletion or preservation without proof.
- **E-4 Deployed versus baseline.** Full diff from each deployed alpha commit to its baseline, to show whether the difference is records only.
- **E-5 Baseline health.** In isolated copies: unit suites, typecheck, lint, production build for both apps. Record actual results.
- **E-6 Gaps that are yours to close.** Locate the "No permitted stores" rendering condition; confirm whether invitation resend, revoke and decline controls exist; choose the Help route; confirm the Portal can serve the sample screens for comparison.

Collect genuine blockers together. Do not return after each one.

## 4. The engineering assignment (one release, continuous)

Internal order, chosen so each step has what it needs. These are checkpoints for the Engineer, not stops for the Director.

1. **Foundation, both apps, same step:** token block, Tailwind radius and shadow scale, Inter, forced light, toggle mount points removed, brand constant in OwedBook, logo master and derived icons, pin tests and forced-light tests.
2. **Shared components:** buttons, links, fields, cards, pills, role labels, notices, tables, menus, dialogs, headers, sidebars. One card treatment per app.
3. **Literal-layout pages:** sign-in and auth pages in both apps; Portal registration steps.
4. **Translated pages and panels inside navigation:** dashboards, admin pages, profile, invitations, Add Pharmacy.
5. **Help page** from `CONTRACTS/HELP_CONTENT.md`, with the label-verification table completed.
6. **Selected fixes:** "No permitted stores"; landing page; the bounded redirect reproduction and its record.
7. **Names sweep** in both apps and the billing notice strings.
8. **Tests:** update presentation-coupled tests to the new contract; write the stale-spec mapping table and retire per the ruling.
9. **Prepared external values:** restyled email body and its diff (after the Director's export exists), Stripe values and files.
10. **Final engineering regression** on both apps, then the factual QAM handoff.

A static dev-only style-tile route may be built to compare against `DESIGN/`; it must not ship in the production build.

## 5. Stop rules

Stop the **affected** task, record it, and keep going on everything else, when:

- the branch, candidate or target is wrong, or product files changed unexpectedly;
- the contract contradicts itself in a way that changes what is built;
- required work needs a protected path, a dependency change, a migration, or an effect outside `CONTRACTS/NO_BREAK_AND_PATHS.md`;
- a test instrument cannot be trusted or evidence cannot be saved;
- a secret or protected data would be exposed;
- a product decision is needed that cannot be inferred safely.

A failing check is something to fix or report, not a reason to stop everything. Record each stop with evidence, owner, the exact resolution needed and the safe resume point. Resume there. Do not restart recon or rerun passed checks.

## 6. Authority

- **Git:** the Director alone commits, branches, merges and pushes. The Engineer may prepare exact scoped commands after reading actual state. No blanket staging.
- **Dashboards:** the Director alone changes Supabase or Stripe settings.
- **Deployment:** only on the Director's authorization, one service at a time.
- **Data:** no database write. The Director's rehearsal account is not used.
- **Dead code:** list, ask, then remove.

## 7. Completion duties

Engineering is complete only when all of these exist:

1. `ABM_ACCEPTANCE_LEDGER.md` filled: one row per criterion with the engineering claim and its evidence.
2. `QAM/QAM_MANIFEST.md` and `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` filled with facts and labelled claims, written **before** the Director commits. The candidate is recorded as `PENDING`; no invented SHA.
3. The complete change inventory at handoff, for both repositories: committed since baseline, staged, unstaged, untracked.
4. Install, build, serve and test commands with working directories, for both apps.
5. The label-verification table in `CONTRACTS/HELP_CONTENT.md`, the stale-spec mapping table, the changed-labels list (AC-P01), the redirect reproduction record, the leftovers list.
6. Known limitations and anything not done, stated plainly.
7. `ABM_STATE.md` set to `ENGINEERING COMPLETE — AWAITING QA BRANCH`, and a Git reminder naming the intended paths per repository.

The Engineer fills no QA result, approval or certificate.

## 8. After engineering

The Director commits both candidates on `abm007-final` and creates `qa/abm007-final` in both repositories at those commits. Independent QA then starts from `QAM/QAM_ENTRY.md`.
