# Installed passages quoted before the change (install instructions section 4 item 3)

Extracted mechanically from the pre-change copies in `before/` (SHA-256 in `before_and_sources.sha256`). Quoted unedited; line numbers are those of the installed files before the change.

## QAM_ENTRY.md: target and prerequisites table (includes the target-environment row)
`before/QAM/QAM_ENTRY.md`, lines 50 to 59

````
## 4. Target and prerequisites (summary; executable rows in `QAM_PREFLIGHT.md`)

| Item | Value |
|---|---|
| Target environment | PROPOSED (P-19): QA-controlled production builds of both apps on ports 3100 (OwedBook) and 3101 (Portal), against the SCRATCH database and the Stripe sandbox, with the Executor's own webhook listener. QA and alpha share that sandbox, so a separate listener and database do not by themselves isolate events: Q1 must prove isolation in both directions (`QAM_PREFLIGHT.md` PF-4.7) before any paid test. Confirmed or amended in Q1; approved at Q2 release |
| Runtime mode | Production builds, never dev mode |
| Roles required | Owner, Store admin, Member, a second Member ("Helper"), and one identity whose access was removed |
| Test data | Isolated QA fixtures on SCRATCH: an owner with at least two pharmacies, and a bounded synthetic audit history long enough to need a second page. The Director's rehearsal account is not a fixture |
| Toolchain | Node and package manager as each repository pins them; Playwright with Chromium, Firefox and WebKit; Windows Chrome is the stakeholder baseline for human checks |
| Credential file | `.env.qa.local` in each repository where needed, created by the Director, ignored and untracked, key names only recorded |
````

## QAM_ENTRY.md: standing rules list (section 6, rules specific to this module)
`before/QAM/QAM_ENTRY.md`, lines 88 to 99

````
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
````

## QAM_TEST_PLAN.md: human-checks section
`before/QAM/QAM_TEST_PLAN.md`, lines 61 to 64

````
## 11. Human checks

Declared in advance, grouped into one session near the end, one check at a time, each with the exact question the Director answers. NOT RECORDED.

````

## QAM_EXECUTION_REPORT.md: human-checks section
`before/QAM/QAM_EXECUTION_REPORT.md`, lines 55 to 60

````
## 7. Human checks

| Check | Question put to the Director | His answer, verbatim | Time |
|---|---|---|---|
| NOT RECORDED | | | |

````

## QAM_RISK_REQUIREMENTS.md: module requirement IDs with their one-line titles
`before/QAM/QAM_RISK_REQUIREMENTS.md` (first two cells of each requirement row, unedited)

````
| SR-1  |  Every AC gets a test or a separately authorized applicability ruling; expected results are independently derived, never copied from engineering claims |
| SR-2  |  Negative controls and negative paths are planned, not only happy paths |
| SR-3  |  Evidence: every PASS or FAIL cites an evidence path with the command, working directory, exit code and unfiltered output; existence checks precede greps and diffs so vacuous passes are impossible |
| SR-4  |  Browser coverage is stated as role × route or workflow × data or filter state × viewport × theme, with reductions explained; rendered behavior, effective theme, keyboard and focus, errors, loading, stale and rejection states and access denials are checked; screenshots supplement assertions |
| SR-5  |  Credentials: declared ignored file only; no `NEXT_PUBLIC_*` reuse for QA passwords; file proved ignored AND untracked; schema validated without emitting values; values never in build or server env, commands, logs, exceptions, screenshots, traces, JSON or ZIPs; a service-role key never substitutes for proving a user's login |
| SR-6  |  Privacy scanners validated with synthetic leak fixtures and clean controls; raw authenticated traces treated as sensitive; only approved sanitized evidence retained |
| SR-7  |  Side effects: backend, commerce and agent tests may mutate state or trigger cost; permitted effects and test targets are declared before execution |
| SR-8  |  Instruments: a helper that cannot fail is not an instrument; attack at least one deliberately; never weaken assertions, add hidden retries, skip tests or change product code to obtain green |
| SR-9  |  Result labels are observations (PASS / FAIL / BLOCKED / NOT RUN / ADJUDICATE); an unresolved discrepancy never becomes PASS by relabeling |
| SR-10  |  Human checks are declared beforehand, grouped near the end where independent, and counted; never fake an unattended run |
| SR-11  |  Regression scope: required regression suite named by the plan; carried-forward evidence shows its applicability and original SHA and attempt |
| MR-1  |  A restyled control still looks right but stops working: a button that no longer submits, a dialog whose Cancel now confirms, a link that lost its target |
| MR-2  |  Contrast passes on white in a unit view and fails in place: text on ice, on a tint, on the navy header, on a hover or disabled state |
| MR-3  |  Dark theme leaks back: a stored preference, the operating-system setting, or a first paint before scripts run |
| MR-4  |  Protected server code changed under cover of a visual commit |
| MR-5  |  A forbidden control starts rendering for the wrong role after layout work |
| MR-6  |  Busy and progress feedback removed for looks |
| MR-7  |  Old name survives somewhere customer-visible |
| MR-8  |  Help describes a control that does not exist, or leaks test material |
| MR-9  |  Stale browser specs give false comfort |
| MR-10  |  Email body edit breaks sign-in for local and alpha at once |
| MR-11  |  QA events and alpha events cross. QA and alpha share one Stripe sandbox, so a QA purchase's events also reach alpha's registered endpoint, and alpha's events also reach a QA listener. **A second listener and a different database do not isolate them** |
| MR-12  |  Layout breaks at widths between the two checked extremes |
| MR-13  |  The logo is altered while making icons |
| MR-14  |  Brand colors drift by rounding: a token triplet is hand-rounded, or one app's block differs from the other's |
| MR-15  |  Mock mode ships and nobody tests it, or mock data leaks into a live screen |
| MR-16  |  Audit paging is waved through for lack of data |
````

## QAM_RISK_REQUIREMENTS.md: permitted-effects table
`before/QAM/QAM_RISK_REQUIREMENTS.md`, lines 69 to 85

````
### Permitted effects and targets (PROPOSED P-19; approved at Q2 release)

| Effect | Permitted? | Target | Ceiling |
|---|---|---|---|
| Reads | Yes | Both repositories; SCRATCH; Stripe sandbox | — |
| Sign-in and sign-out (creates session and audit activity) | Yes | SCRATCH QA identities | As the journeys need |
| Invitations and their emails | Yes | QA inboxes only | As the journeys need |
| Business writes | Yes | SCRATCH QA fixtures only | The AC-R04 journeys |
| Paid operations | Only after the event-isolation proof (MR-11) or the Director's authorization of one specific alternative. Sandbox test payments only | Stripe sandbox, QA fixture customers | Proposed **maximum**, not a quota and not a permission: one new first-pharmacy purchase and two paid additions; attempted simulated charges up to USD 400 **including automatic retries**; no refunds. The plan justifies each purchase it asks for |
| Synthetic audit history for the paging check | Yes | SCRATCH QA fixture only, through supported product actions where possible; any direct data seeding is named in the plan and approved before use | Enough events to need a second page, no more |
| Editing payment or webhook code; disabling or changing alpha's endpoint; creating another Stripe sandbox | **No** | — | Needs its own release |
| DEV database, alpha services, the Director's rehearsal account | **No** | — | — |
| Dashboard settings (Supabase, Stripe, mail provider) | **No** | — | Director only |
| New payments to inspect styling | **No** | — | Styling is judged from rendered screens and existing fixtures |

The Executor preflights every counter and the cleanup boundary before Q2 and proposes one complete budget, not increments.

````

## QAM_CLEANUP_REPORT.md: retention table
`before/QAM/QAM_CLEANUP_REPORT.md`, lines 7 to 16

````
## 1. Retention decisions (QA Lead, before anything is removed)

| Item | Keep or remove | Reason |
|---|---|---|
| Evidence under `evidence/` | NOT RECORDED | |
| Helpers under `AUTOMATION/` | NOT RECORDED | |
| Failed attempts | Keep unless unsafe | |
| QA fixtures on SCRATCH (accounts, pharmacies, the audit-history fixture) | NOT RECORDED | |
| Stripe sandbox objects created by QA | NOT RECORDED | |

````

## ABM_RULINGS.md: amendment numbers already used

AM-01, AM-02, AM-03, AM-04, AM-05, AM-06, AM-07, AM-08, AM-09, AM-10, AM-11, AM-12, AM-13, AM-14, AM-15, AM-16 (16 entries). Next free: AM-17.
