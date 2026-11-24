# Cyber Pharma QA Recipe v3.0 — Rework and Evidence Record
22 November 2026 · Prepared for Tony / App Factory · Internal editorial record

## Delivered change
The client-facing v3.0 Markdown supersedes v2 for new runs. It contains 13 ordered customer sections and 45 named finish-line criteria, not the old 15 mixed-scope sequences / 120 base cases. Fast and Guided change pacing only. This companion documents intentional coverage routing; it is not a new execution report, engineering certification or the full reusable App Factory playbook.

The old PDF remains a v2 archive. It does not describe v3 rules and should not be paired with v3 as current instructions. A future human companion must be regenerated from the settled v3 after its walkthrough is reviewed. The requested in-app Help page remains a separate product enhancement, with verified Admin/Billing/Profile instructions and a placeholder for future OwedBook workflows.

## Sources reviewed
- Cyber_Pharma_AI_Augmented_Human_QA_Recipe_v2_0(1).md — original protocol and 120-case bank.
- QA_rehearsal_journal(1).md — guide rework, actual product observations, section closeouts and Director rulings.
- APBM007B_Client_QA_Closeout_1121ts01(1).md — client-scope completion and explicitly unverified Engineering coverage.
- Tony's authoring-thread corrections — the eleven-defect register, simplicity decisions, mode choice and three-journal requirement.

## All corrections carried forward
| # | Problem found in rehearsal | v3 rule |
|---|---|---|
| 1 | Asked whether technical run code was unused | Generate short tester label automatically; simple numbered suffix only on a fresh repeat. Resolve actual existing-account conflicts from observed app behavior. |
| 2 | Assumed every tester was Tony | First ask preferred name. Tony is the coordinator, not the default tester. |
| 3 | Long email and copyable text outside blocks | Each separately pasted value has its own fenced text block, label outside. Links remain clickable for navigation. |
| 4 | Browser profiles blocked starting | Same browser, normal sign-out/sign-in. Email proof closes setup; signup immediately follows. |
| 5 | One field per turn | All visible form data in one response in BOTH modes. Guided means a screen at a time, not a field at a time. |
| 6 | Customer asked to allocate/check NPI | Embedded checksum-tested candidate pool, app rejection handling, no claim of global availability or real assignment. |
| 7 | APA coverage forgotten/undefined | Standard route leaves field blank. Business terms and prepared positive/negative tests are tracked separately, not silently passed. |
| 8 | Customer asked to certify Stripe/cloud setup | Engineering prepares environment. No release-card, sandbox/secret/build/scheduler verification question to the customer. Visible contradictions become issues for coordinator. |
| 9 | Technical display names/labels | Preferred name generates Main/Riverside Pharmacy names and simple aliases; no date/UUID display clutter. |
| 10 | Scattered partial sequences, vague statuses, repeated evidence | Exactly one active section. Complete defined criteria and close before next. Only explicit tester request permits a jump/defer. Clear green DONE with Nothing left; exact unfinished criteria otherwise. No hidden later dependencies or optional tasks holding green. |
| 11 | Legal publication blocked alpha signup | Production-only deferral is explicit. Visible checkbox gating stays tested; unpublished legal pages cannot block alpha completion. |

Further journal lessons: explicitly select invitation ROLE before sending (email suffix is irrelevant); retain the mistaken first admin invitation and correction rather than erase it; validate NPI check digits before supplying values; request outcome screenshots rather than menu screenshots; follow a bank prompt if one naturally appears without claiming a forced challenge was tested; never repeat a normal purchase to satisfy an exception test.

New preference: offer Fast and Guided after preferred name; both use the same checklist. Can switch anytime. New recordkeeping: separate Test Results, Guide Lessons, and User Feedback journals, all exportable with final report/checkpoint. The reusable AI Augmented QA Testing Playbook is a future consolidation of this evidence, not a claim of a completed doctrine deliverable here.

## What the rehearsal actually established
The closeout reports 14/15 old sequences passed within client scope; old 14 deferred. The old 13 PASS explicitly covered a third ordinary Add Pharmacy purchase, NOT its forced exception branches. Journal shows $47.77 paid proration for that purchase and $197/month for three stores, earlier $48.98 and $148/month for two stores. Proration values are historical, not future expected constants. Final tester-confirmed state: 3 active, 3 at renewal, no unexpected pending changes, keep third store. Optional password changes were skipped.

“No permitted stores” alongside selectable pharmacies is a product copy/condition observation. Unexpected Store-admin Portal sign-in occurred once, followed by a tester-reported passing boundary retest. No source-code fix or root cause was established. Retain both attempts. Terms/Privacy publication is deferred to production under Director ruling, not a repaired UI or a failed alpha customer journey.

v3 does not automatically add a third purchase, import these passes into a fresh run, or map 14/15 into 13/13. An existing-run migration matches actual observations against v3 criteria and lists any gaps. It never asks Tony to repurchase to match the rewritten scope.

## Engineering / extended coverage queue
| Coverage | Follow-up evidence needed |
|---|---|
| Forced bank challenge and return | Prepared isolated fixture; challenge observed, return handled, one payment and activation. Ordinary success does not cover it. |
| Decline, pending reload, cancellation races | Correct current fixture and charge/store reconciliation. Cancelled UI does not prove no raced charge. |
| Backend exactly-once | Correlate operation, payment and resulting store. Customer sees invoice/counts, never has to inspect backend. |
| Entire-subscription cancel/undo | Isolated account, intentional cancellation, restored final state. Optional unrun in closeout. |
| Unpaid expiry / period-end removal | Confirm actual worker/configured cutoff and resulting persisted access/payment state. Schedule-and-undo is different coverage. |
| Support-led transfer | Approved procedure and buyer/seller expectations; no invented self-service transfer. |
| Populated store/API isolation | Approved synthetic records, permitted and forbidden actors, expected record IDs. Empty dashboards are insufficient. |
| Invitation lifecycle and password edges | Extended UI sessions, explicit scope, outcome evidence, no hidden dependency on default customer green. |
| APA discount | Coach/Frank supply amount, eligibility/scope/duration; configure approved codes, verify positive/negative and ongoing pricing. |
| Production readiness | Legal publication and any outstanding support/security/dependency matters. Separate from alpha customer completion. |

## Legacy routing — all 120 old base IDs accounted for
This is an editorial crosswalk, not a one-to-one assertion of identical test scope. Wording, busy-state requirements, duplicate legacy IDs, password opt-ins and operator checks were intentionally separated or simplified. Customer rows refer to named v3 finish lines; unlisted microchecks are not covert mandatory gates. No historical result was rewritten.

| v2 ID | v3 destination / scope disposition |
|---|---|
| START-01 | 03 · customer sign-in, navigation and Stripe return |
| START-02 | 03 · customer sign-in, navigation and Stripe return |
| START-03 | 03 · customer sign-in, navigation and Stripe return |
| START-04 | 03 · customer sign-in, navigation and Stripe return |
| START-05 | 03 · customer sign-in, navigation and Stripe return |
| START-06 | 03 · customer sign-in, navigation and Stripe return |
| NEW-01 | 02 · customer signup; legal publication split out |
| NEW-02 | 02 · customer signup; legal publication split out |
| NEW-03 | 02 · customer signup; legal publication split out |
| NEW-04 | 02 · customer signup; legal publication split out |
| NEW-05 | 02 · customer signup; legal publication split out |
| F-01 | 07 · customer role/route boundaries |
| F-02 | 07 · customer role/route boundaries |
| F-03 | 04 · customer form validation, quote and one addition |
| F-04 | 07 · customer role/route boundaries |
| F-05 | 07 · customer role/route boundaries |
| F-06 | 07 · customer role/route boundaries |
| F-07 | 07 · customer role/route boundaries |
| F-08 | 07 · customer role/route boundaries |
| F-09 | 10 · customer schedule/undo and truthful audit |
| F-10 | 11 · customer access removal/audit; absent extra history conditional |
| F-11 | 11 · customer access removal/audit; absent extra history conditional |
| F-12 | 11 · customer access removal/audit; absent extra history conditional |
| F-13 | 08 · customer identities/profile/narrow layout |
| F-14 | 08 · customer identities/profile/narrow layout |
| F-15 | 08 · customer identities/profile/narrow layout |
| F-16 | 08 · customer identities/profile/narrow layout |
| S-01 | 05 · customer Member invitation and access |
| S-02 | 05 · customer Member invitation and access |
| S-03 | 11 · customer access removal/audit; absent extra history conditional |
| S-04 | 11 · customer access removal/audit; absent extra history conditional |
| S-05 | 06 · customer delegation, Helper, Owner retention |
| S-06 | 06 · customer delegation, Helper, Owner retention |
| S-07 | 06 · customer delegation, Helper, Owner retention |
| S-08 | 07 · customer role/route boundaries |
| S-09 | 06 · customer delegation, Helper, Owner retention |
| S-10 | 06 · customer delegation, Helper, Owner retention |
| S-11 | 06 · customer delegation, Helper, Owner retention |
| S-12 | 07 · customer role/route boundaries |
| P-01 | 08 · customer identities/profile/narrow layout |
| P-02 | 08 · customer identities/profile/narrow layout |
| P-03 | 08 · customer identities/profile/narrow layout |
| P-04 | 08 · customer identities/profile/narrow layout |
| P-05 | Extended password suite; explicit opt-in, no default gate |
| P-06 | Extended password suite; explicit opt-in, no default gate |
| P-07 | Extended password suite; explicit opt-in, no default gate |
| P-08 | Extended password suite; explicit opt-in, no default gate |
| P-09 | Extended password suite; explicit opt-in, no default gate |
| P-10 | Extended password suite; explicit opt-in, no default gate |
| P-11 | Extended password suite; explicit opt-in, no default gate |
| P-12 | Extended password suite; explicit opt-in, no default gate |
| P-13 | Extended password suite; explicit opt-in, no default gate |
| P-14 | Extended password suite; explicit opt-in, no default gate |
| R1-01 | 04 · customer form validation, quote and one addition |
| R1-02 | 04 · customer form validation, quote and one addition |
| R1-03 | 08 · customer identities/profile/narrow layout |
| R1-04 | 07 · customer role/route boundaries |
| R1-05 | 02 · customer signup; legal publication split out |
| R3-01 | 04 · customer form validation, quote and one addition |
| R3-02 | 04 · customer form validation, quote and one addition |
| R3-03 | 04 · customer form validation, quote and one addition |
| R3-04 | 04 · customer form validation, quote and one addition |
| R3-05 | Engineering only: forced challenge/decline/reload/cancel |
| R3-06 | Engineering only: forced challenge/decline/reload/cancel |
| R3-07 | Engineering only: forced challenge/decline/reload/cancel |
| R3-08 | Engineering only: forced challenge/decline/reload/cancel |
| R3-09 | Engineering only: forced challenge/decline/reload/cancel |
| R3-10 | Engineering only: backend reconciliation, UI invoice checked in 04 |
| ST-01 | 09 · customer read-only settings and selectors |
| ST-02 | 09 · customer read-only settings and selectors |
| ST-03 | 09 · customer read-only settings and selectors |
| ST-04 | 09 · customer read-only settings and selectors |
| ST-05 | 09 · customer read-only settings and selectors |
| A-01 | 11 · customer access removal/audit; absent extra history conditional |
| A-02 | 11 · customer access removal/audit; absent extra history conditional |
| A-03 | 11 · customer access removal/audit; absent extra history conditional |
| A-04 | 11 · customer access removal/audit; absent extra history conditional |
| A-05 | 11 · customer access removal/audit; absent extra history conditional |
| A-06 | 11 · customer access removal/audit; absent extra history conditional |
| RM-01 | 10 · customer schedule/undo and truthful audit |
| RM-02 | 10 · customer schedule/undo and truthful audit |
| RM-03 | 10 · customer schedule/undo and truthful audit |
| RM-04 | 10 · customer schedule/undo and truthful audit |
| RM-05 | 10 · customer schedule/undo and truthful audit |
| RM-06 | Engineering only: optional entire-subscription cancellation/undo |
| C-01 | Content follow-up: support text/delivery; no setup quiz |
| C-02 | Production readiness deferred; not customer gate |
| C-03 | 05 · customer Member invitation and access |
| T-01 | Engineering only: real cutoff/expiry, transfer, populated isolation |
| T-02 | Engineering only: real cutoff/expiry, transfer, populated isolation |
| T-03 | Engineering only: real cutoff/expiry, transfer, populated isolation |
| T-04 | Engineering only: real cutoff/expiry, transfer, populated isolation |
| SET-01 | 01 · customer setup, simplified |
| SET-02 | 01 · customer setup, simplified |
| SET-03 | 01 · customer setup, simplified |
| SET-04 | 01 · customer setup, simplified |
| SET-05 | 01 · customer setup, simplified |
| SET-06 | Engineering preparation only; no tester release-card task |
| SET-07 | 01 · customer setup, simplified |
| LINK-01 | 03 · customer sign-in, navigation and Stripe return |
| LINK-02 | 03 · customer sign-in, navigation and Stripe return |
| LINK-03 | 03 · customer sign-in, navigation and Stripe return |
| LINK-04 | 03 · customer sign-in, navigation and Stripe return |
| LINK-05 | 03 · customer sign-in, navigation and Stripe return |
| DUP-01 | 04 · customer form validation, quote and one addition |
| DUP-02 | 04 · customer form validation, quote and one addition |
| INV-01 | Extended invitation lifecycle; not default denominator |
| INV-02 | Extended invitation lifecycle; not default denominator |
| INV-03 | Extended invitation lifecycle; not default denominator |
| INV-04 | Extended invitation lifecycle; not default denominator |
| BND-01 | 07 · customer role/route boundaries |
| BND-02 | 07 · customer role/route boundaries |
| BND-03 | 06 · customer delegation, Helper, Owner retention |
| OUT-01 | 12 · customer coordinated logout and fresh-link recovery |
| OUT-02 | 12 · customer coordinated logout and fresh-link recovery |
| OUT-03 | 12 · customer coordinated logout and fresh-link recovery |
| OBS-01 | Extended dashboard UI smoke; claims workflow reserved for later |
| CLOSE-01 | 13 · customer state review, feedback, actual exports |
| CLOSE-02 | 13 · customer state review, feedback, actual exports |
| CLOSE-03 | 13 · customer state review, feedback, actual exports |

## Release acceptance scenarios
These are behavioral checks for a NEW chat running v3, not fabricated execution evidence:
1. Start as Frank: ask name, offer pace, request inbox; no assumed Tony or technical label question.
2. Fast: whole form fields in separate blocks; batch related controls; no mandatory browser profiles.
3. Guided: more explanation and one screen at a time, still whole-form data; can switch Fast without resetting.
4. Successful mailbox proof: close 01 DONE then open signup immediately, no technical fixture detour.
5. Unpublished policy links: record production deferral, retain checkbox test, allow 02 DONE on its actual criteria.
6. Invite Store admin: explicit role selection, verify actual acceptance role; handle wrong Member invite transparently.
7. Status: all 13 rows, matching count, one active row, DONE → None, exact outstanding criteria, no green in What's left.
8. Blocked current section: hold, explain, let tester choose pause/defer; never jump on status or faster.
9. Reuse existing screenshot/report: do not demand another purchase or repeated screenshot for the same evidence.
10. No bank prompt: normal payment continues; exception branch stays unverified in Engineering, not customer denominator.
11. Pause with pending quote: checkpoint preserves aliases, stores, payment state and next action; resume does not repeat Pay.
12. Finish: three separate journals plus report/checkpoint, truthful tester-reported basis, no fabricated app-wide certification.

## Validation at authoring
Structural validation checks 13 sections / 45 criteria, 18 valid 10-digit NPI candidates using the 80840-prefix Luhn check, all 120 legacy IDs routed exactly once, one canonical block, fixed alpha hosts and required operating rules. A synthetic record round trip checks all criteria/results and retained failed/retested attempts. These checks validate the document structure and state model, NOT live app behavior, recipient availability, database uniqueness or cross-model compliance. A fresh-chat v3 behavior rehearsal remains pending.
