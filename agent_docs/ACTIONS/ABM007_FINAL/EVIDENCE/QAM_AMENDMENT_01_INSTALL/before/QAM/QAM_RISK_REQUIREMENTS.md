# QAM_RISK_REQUIREMENTS — `ABM007_FINAL`

Nothing here is a test plan. The QA Executor drafts the plan independently from this file, the contract, the source, its own recon and the Engineer's claims.

## 1. QA Lead standing requirements — QAM-SR v1.0 (adopted by the QA Lead on 2026-10-14; reused without per-module re-review)

| # | Standing requirement | Applies |
|---|---|---|
| SR-1 | Every AC gets a test or a separately authorized applicability ruling; expected results are independently derived, never copied from engineering claims | all |
| SR-2 | Negative controls and negative paths are planned, not only happy paths | all |
| SR-3 | Evidence: every PASS or FAIL cites an evidence path with the command, working directory, exit code and unfiltered output; existence checks precede greps and diffs so vacuous passes are impossible | all |
| SR-4 | Browser coverage is stated as role × route or workflow × data or filter state × viewport × theme, with reductions explained; rendered behavior, effective theme, keyboard and focus, errors, loading, stale and rejection states and access denials are checked; screenshots supplement assertions | UI |
| SR-5 | Credentials: declared ignored file only; no `NEXT_PUBLIC_*` reuse for QA passwords; file proved ignored AND untracked; schema validated without emitting values; values never in build or server env, commands, logs, exceptions, screenshots, traces, JSON or ZIPs; a service-role key never substitutes for proving a user's login | auth |
| SR-6 | Privacy scanners validated with synthetic leak fixtures and clean controls; raw authenticated traces treated as sensitive; only approved sanitized evidence retained | traces |
| SR-7 | Side effects: backend, commerce and agent tests may mutate state or trigger cost; permitted effects and test targets are declared before execution | backends |
| SR-8 | Instruments: a helper that cannot fail is not an instrument; attack at least one deliberately; never weaken assertions, add hidden retries, skip tests or change product code to obtain green | all |
| SR-9 | Result labels are observations (PASS / FAIL / BLOCKED / NOT RUN / ADJUDICATE); an unresolved discrepancy never becomes PASS by relabeling | all |
| SR-10 | Human checks are declared beforehand, grouped near the end where independent, and counted; never fake an unattended run | all |
| SR-11 | Regression scope: required regression suite named by the plan; carried-forward evidence shows its applicability and original SHA and attempt | all |

A module never edits this section. The rows are the adopted QAM-SR v1.0 text.

## 2. Module-specific risk input (attributed; input to the plan, not the plan)

**Author:** ABM author (QA Lead seat acting as co-architect, D-15) · **Date:** 23 November 2026

**Independence note.** The same seat authored this contract and will later approve the Q1 plan and certify. The Architect seat reviews the package and issues the architectural verdict; the QA Executor plans and measures independently; expected results come from the contract and the design file, not from the author's reference renders alone.

| # | What could silently go wrong | Where to look | Why it matters here | Suggested evidence shape |
|---|---|---|---|---|
| MR-1 | A restyled control still looks right but stops working: a button that no longer submits, a dialog whose Cancel now confirms, a link that lost its target | Every form and dialog on the AC-R04 journeys | The restyle touches every primitive | Journey assertions on outcomes, not on appearance |
| MR-2 | Contrast passes on white in a unit view and fails in place: text on ice, on a tint, on the navy header, on a hover or disabled state | Pills, notices, table figures, header links, focus rings, hover and disabled buttons | Dark green on white is 4.532:1; there is no margin. A hand-rounded token triplet already fails at 4.475:1 | Rendered-contrast probe on composited backgrounds, per state, with a fixture that must fail |
| MR-3 | Dark theme leaks back: a stored preference, the operating-system setting, or a first paint before scripts run | Portal root layout; both theme providers | The Portal shipped dark by default | Both conditions set, every shell, including a screenshot of first paint |
| MR-4 | Protected server code changed under cover of a visual commit | Full baseline-to-candidate diffs | Payment, provisioning, handoff and guards were certified and repaired at earlier candidates | Path-by-path diff review, not a file count |
| MR-5 | A forbidden control starts rendering for the wrong role after layout work | Add Pharmacy for a Store admin; billing for non-owners; another store's pages | Repairs F1 to F3 fixed exactly this | Per-role route checks with the control's absence asserted |
| MR-6 | Busy and progress feedback removed for looks | Add Pharmacy confirm, invitations, removal, sign-in | KR-1: slow confirm on WebKit is tolerable only because progress is visible | Observe the busy state during a real wait; record confirm time |
| MR-7 | Old name survives somewhere customer-visible | Titles, alt text, accessible names, footer, notices | D-03 | Rendered and source scans with an allow-list, plus a seeded positive control |
| MR-8 | Help describes a control that does not exist, or leaks test material | Help page versus live screens | Help was drafted from a tester guide | Label-by-label comparison; forbidden-term scan with a seeded fixture |
| MR-9 | Stale browser specs give false comfort | Portal `e2e/` | 16 of 19 target removed routes | Do not count them. Build current-route checks in `AUTOMATION/` |
| MR-10 | Email body edit breaks sign-in for local and alpha at once | The prepared body versus the export | One template, four uses | Line diff at Gate Q; then the delivery matrix E02-1 to E02-6 after apply, at Gate D. There is no invitation flow in Account & Billing; none is tested or added |
| MR-11 | QA events and alpha events cross. QA and alpha share one Stripe sandbox, so a QA purchase's events also reach alpha's registered endpoint, and alpha's events also reach a QA listener. **A second listener and a different database do not isolate them** | Registered endpoints and their event types; listener forwarding; what each webhook handler does with an event for a customer or subscription it does not know | A QA event that changed DEV data would damage alpha and the rehearsal account; an alpha event that changed SCRATCH would corrupt QA results | `QAM_RECON_REPORT.md` section 5: routing facts plus handling behavior, both directions, from source and configuration read-outs and a safe observation where one exists. A process listing is not evidence. If not proven: one concrete proposal to the Director; paid tests wait |
| MR-12 | Layout breaks at widths between the two checked extremes | Header, tables, literal shell | Navigation collapses at a breakpoint | Overflow and target probes at the intermediate widths the plan names |
| MR-13 | The logo is altered while making icons | Derived icon files | D-06 | Hash of the master; visual comparison of each derived file |
| MR-14 | Brand colors drift by rounding: a token triplet is hand-rounded, or one app's block differs from the other's | Both token blocks; resolved colors in each built app | `168 53% 34%` resolves to #298572, not #288472, and fails contrast | Resolve each anchor in a real browser from each built app and compare with the approved hex; a rounded control must be reported as a mismatch. Pin tests alone are not this evidence |
| MR-15 | Mock mode ships and nobody tests it, or mock data leaks into a live screen | OwedBook `NEXT_PUBLIC_APBM_DATA_MODE=mock`; the landing-page screenshot capture (P-08) | QA_PLAYBOOK section 27 | Recon states whether it ships in the candidate build; the plan covers the mode boundary |
| MR-16 | Audit paging is waved through for lack of data | AC-R04 (i) | A thin fixture cannot show paging | Bounded synthetic history on SCRATCH, or BLOCKED with a specific disposition. Never "not applicable" |

### Module-type inputs (ABM, brownfield, full-stack UI)

| Input | Value |
|---|---|
| Canonical design contract | `../CONTRACTS/BRAND_UI_CONTRACT.md`, `../CONTRACTS/UI_SPEC.md`, `../DESIGN/` |
| Preserved-behavior contract | `../CONTRACTS/NO_BREAK_AND_PATHS.md` section 1 |
| Real auth and integrations | Present: Supabase auth, app-to-app handoff, Stripe sandbox |
| Prior evidence that may be carried with provenance | APBM-007B Gate Q, certified pair Portal `ba66534351368b4b67b9e61d6f0278866950c850` and OwedBook `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871` on `qa/apbm-007b`, 18 Nov 2026. It does not cover the later repair commits, migration 0071, the dependency update or this module's changes. Carry it only for paths the diffs prove untouched, with the original candidate named |

### Browser coverage inputs

| Dimension | Values |
|---|---|
| Roles | Owner, Store admin, Member, removed user; signed out |
| Routes and workflows | Every route in `../CONTRACTS/UI_SPEC.md` sections 2 and 3; the AC-R04 journeys |
| Data and filter states | Zero, one and several pharmacies; a scheduled removal; a pending invitation; empty claims; audit with a short history and with a history long enough to need a second page (synthetic fixture) |
| Viewports | 375, 768, 1024 and 1440 on every screen; plus the widths either side of each app's navigation breakpoint, named by the plan |
| Themes | Light only, checked under stored-dark and system-dark conditions |
| Engines | Chromium on every screen. Firefox and WebKit on the journeys and a representative screen set |
| Reductions proposed | No dark-theme matrix (D-01). Unreachable Portal source files are not visual targets. Reductions beyond these are the Executor's to propose with reasons |

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

## 3. Executor's reading (Q1)

NOT RECORDED. Filled by the QA Executor in Q1 without altering sections 1 or 2.
