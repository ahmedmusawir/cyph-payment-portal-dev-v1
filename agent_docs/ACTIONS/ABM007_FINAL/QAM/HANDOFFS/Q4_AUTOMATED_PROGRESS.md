# Q4 automated progress — ABM007_FINAL

**Q4 AUTOMATED RUN COMPLETE — AWAITING DIRECTOR WALKTHROUGH**  
Prepared 26 November 2026 15:35 BDT. Friday adjudicates, and Tony's post-walkthrough commit remains required before certification.

| App | Working-tree identity SHA-256 | Port |
|---|---|---|
| OwedBook | f229d7a129138af7cc97e1fdb5acadf885c1907ad7cd3c140f4bad5334a4d22d | 3100 |
| Account & Billing | ba726f5ea3f5bf2cdd8156a16360e7674be2da500be48c81cacac19ba682c4b9 | 3101 |

Both independent copies matched at entry and after the final diagnostics. The two real local-proof builds are serving on SCRATCH and report those compiled revisions. See evidence/Q4/01. The protected-path review included the exact 22 and 136 paths and the AM-22 (3) record-only RECOVERY insertion.

## Clean basics

- OwedBook: 60 suites, 408 tests. Portal: 37 suites, 588 tests. Both lockfile installs, typechecks, lint runs and labelled builds exited 0. Saved commands, counts and build identity in evidence/Q4/01.
- Chromium, Firefox and WebKit positive and negative geometry and rendered-pixel controls are saved per engine. Runtime output went to redacted QA log files.
- The three follow-ups outside the module are F33–F35. The pure Member fixture is unavailable, since the original Member was removed and the Invitee has both an owned and an assigned store. They were not treated as equivalent.

## Repair observations

| Repair | First measured outcomes | Bounded diagnostic outcomes | Evidence | Scope note |
|---|---|---|---|---|
| R-01/A1-1 | 21 PASS | 21 PASS | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Button colors, dimensions, focus, text and real local link destinations. |
| R-02/A1-2/A1-3 | 56 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Help menu and end link, including short windows. Active Member-only fixture absent. |
| R-03 | 6 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Held stub only, one intercepted POST per busy case and no provider call. |
| R-04/R-05 | 22 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Disabled fields measured with calibrated pixels, link color and underline. Active Member-only fixture absent. |
| R-06 | 77 PASS | no corresponding runtime result | evidence/Q4/02/{engine}.json | Password reveal, dashboard tabs, desktop round account trigger. |
| R-07 | 29 PASS | 36 PASS, 3 INCOMPLETE | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Correct app is OwedBook. Add and helper edges, tab strip internal scroll and 320px route sweep. |
| R-08/A1-4 | 135 PASS, 9 INCOMPLETE | no corresponding runtime result | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Signed-out and signed-in public/auth shared footer. Standalone framework 404 recorded separately. |
| R-09 | 9 PASS, 18 FAIL | 15 PASS, 1 INCOMPLETE | evidence/Q4/02/{engine}.json and read-only-diagnostics.json | Original responsive row probe retained. Final diagnostic excludes hidden duplicate responsive controls. Refresh remains a 12px link treatment with a 44px target. |

First-attempt rows are retained. Hidden responsive duplicates and asynchronous loading are documented in the diagnostic outcomes. The affected earlier rows do not become passing results by replacement. F20 setup failures have the final path, control state and response statuses recorded without credentials. Later cases requiring a failed setup are BLOCKED.

Ruled non-defects: 42px text fields, 14–15px header/navigation text, 14px Medium data-view tab text, Refresh's link treatment and 44px target, and the shortened 320px header wordmark.

## Full Q2 matrix and cross-cutting regression

The source Q2 matrix lists 762 measured positions. Q4 accounting: 536 OBSERVED, 31 INCOMPLETE, 195 BLOCKED across 762 recorded positions. Positions for unreleased payment-dependent pages, missing active Member and failed setups retain explicit gaps. See evidence/Q4/03/{engine}-matrix.json and numbered raw measurements.

- Geometry/text/control flags pending applicability review: {'badCorner': 0, 'badSurface': 31, 'badTarget': 0, 'navControl': 0, 'badLinks': 0, 'buttonNavy': 0}. They are instrument observations, not a count of product failures.
- Calibrated rendered-pixel counts: {'pass': 24062, 'fail': 35, 'notRun': 383}. These are text-range measurements, not journeys. NOT RUN ranges retain each reason. Default surfaces, changed hover/focus colors and nontext edges are separately measured. Nontext row accounting: 120 OBSERVED, 6 INCOMPLETE, 20 DEDUPLICATED, 82 BLOCKED. Edge result counts: {'border PASS': 115, 'focus PASS': 860, 'focus NOT RUN': 87, 'focus FAIL': 26, 'border FAIL': 1}. Changed state text results: {'hoverText SAME COMPUTED COLORS': 487, 'focusText SAME COMPUTED COLORS': 854, 'hoverText pass': 734, 'hoverText fail': 0, 'hoverText notRun': 0, 'focusText pass': 43, 'focusText fail': 0, 'focusText notRun': 0}. Script-disabled instrument stalls, held journeys, unobservable role cases and unsupported geometry remain explicit. This evidence alone does not claim an exhaustive passing result.
- AC-L02 mock table. 2 PASS.
- AC-F02 seven Firefox positions. 6 COMPLETE, 1 INCOMPLETE.
- F22 timeout contexts. 3 COMPLETE.
- Core regression, first instrument. 25 PASS, 3 FAIL, 2 BLOCKED, 1 INCOMPLETE.
- Core/price settled diagnostics. 4 PASS, 1 FAIL.
- OwedBook's 375px Help end-of-text Go to the Top link measured 4.0355:1 against 4.5:1. F36 covers the green link on the ice surface under AC-B07 and AC-B08. The return-to-top behavior and the separate sidebar link have their own results. See evidence/Q4/05/settled-read-diagnostics.json and the earlier sampled ranges in Q4/03.
- Public plan pricing: **PASS** after waiting for the rendered price. The first instrument observed the loading state. The review screen remains at Gate D.
- The three F22 diagnostic captures reached HTTP 200 in exclusive browser phases. The masked screenshots are included. No console or runtime log lines were emitted during those requests; the log slices and request status are recorded. The separate seventh Firefox warm route remained INCOMPLETE when its process ended. The warm session sign-out could not be confirmed.
- The raw command exits are retained in evidence/Q4/05/phase-exits.txt and the per-phase logs. Session setup issues retained: 1 in the initial repair pass.

## Released effects

- Automated sign-in attempts: **57/80**, counting failed setup attempts against the budget. Each run records sign-out or unconfirmed cleanup. Owner B unused by automation.
- Portal dashboard/billing GET loads: **283** (111 document loads and 172 fetches), with browser request kind and path in evidence/Q4/01/portal-loads.jsonl. They are the app's own permitted read-only lookups, not Stripe write effects.
- Zero automation email, invitations, acceptance, member removal, billing-portal openings, Checkout, purchase, schedule/undo, listener or fixture mutation. The only public busy-login activity held a stub in the browser without reaching the provider.
- J-c, J-d, J-g, hosted J-b return and the review part of AC-R05 are deferred to Gate D under AM-21. They have no passing Q4 result.

## Director handoff

Use sheet 04 on the two real builds left serving. JARVIS guides Tony using Owner B. The post-commit check instructions are in HANDOFFS/Q4_POST_COMMIT_CHECK.md. Record the two commit outputs after the walkthrough and Tony's commit. Friday owns the disposition of incomplete or failing contexts and all certification.
