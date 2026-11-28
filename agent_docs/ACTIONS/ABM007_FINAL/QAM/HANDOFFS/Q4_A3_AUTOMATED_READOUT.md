# A3 confirmation for Friday and Tony

Both freshly labelled production builds matched the A3 manifests and SCRATCH at the pre-walkthrough check. The OwedBook Help source and its unit test were the only product/test changes from A2. The path-by-path comparison is in entry-comparison.json.

| App | Manifest SHA-256 | Compiled build ID | Port |
|---|---|---|---:|
| ob | `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603` | `HhV1FUcZaHH6YmiWDXKkK` | 3100 |
| pp | `bb27c2ee7515d9c2a2d9df5dd537fdd0d02313816b2e5c0798bf6ca38402ee98` | `ELV-PEBCS7OQJuavBy3cQ` | 3101 |

Clean lockfile installs, typecheck, lint and labelled builds all exited zero. OwedBook passed 60 suites / 409 tests. Portal passed 37 / 588. Lint warnings were 38 and 27.

Friday classified F37 as a low-severity product defect and accepted the remaining A2 readout with its qualifications. On A3 the **unchanged A2 Firefox procedure** recorded {'PASS': 4} across the original four positions. See firefox-enter-settled.json. firefox-diagnostic-results.json in the A3 directory is a byte copy of the A2 input used to select those four positions.

The strict five-sample result across all 13 articles was **468 of 468 PASS**. Each case tests one role, engine, viewport and input method. automation-summary.json lists every missing or nonpassing case. For the first Firefox run, the clock started during click dispatch. Both Firefox files were kept. INSTRUMENT_TIMING.md describes the clock change and firefox-clock-controls.json captures its offline comparison. The post-input clock starts at the first evaluation following the input command and never waits for the scroll or focus result.

The lowest measured link contrast was 4.5285:1. Per-article evidence includes painted background samples, outlines and target heights. The supplemental distance rows record the actual starting scroll position, including any start already at zero. Refer to the raw rows for each of the five requested timepoints and their actual elapsed milliseconds.

With the post-input clock, 36/36 engine, role, width and input combinations demonstrated a return from two distinct nonzero distances for article 1. At the viewport edges, 30 supplemental observations reached and stayed at zero but failed the separate full-outline assertion. The raw results retain those failures. The centered link outline is part of every main Enter result. The original scripts-disabled Chromium check timed out. The browser-protocol check with page script execution disabled recorded INCOMPLETE (stage: scroll last link and capture bounds, start scroll: None). See chromium-no-script-native.json.

## Heading after activation

- firefox / mouse — 78 settled observations, rgb(255, 255, 255) 3px, offset 0px
- firefox / Enter — 78 settled observations, rgb(255, 255, 255) solid 2px, offset 2px
- chromium / mouse — 78 settled observations, rgb(255, 255, 255) none 3px, offset 0px
- chromium / Enter — 78 settled observations, rgb(255, 255, 255) solid 2px, offset 2px
- webkit / mouse — 78 settled observations, 2px solid rgb(255, 255, 255), offset 2px
- webkit / Enter — 78 settled observations, 2px solid rgb(255, 255, 255), offset 2px

## All recorded groups

| Instrument file / check | Result counts |
|---|---|
| chromium-no-script-native.json / Scripts disabled browser protocol | 1 INCOMPLETE |
| chromium-results.json / A2-1 F36 rendered contrast | 12 PASS |
| chromium-results.json / A2-1 structure and dimensions | 6 PASS |
| chromium-results.json / A2-2 menu geometry | 2 PASS |
| chromium-results.json / A2-2 menu keyboard outline | 26 PASS |
| chromium-results.json / Article 1 distance | 14 PASS, 10 FAIL |
| chromium-results.json / Article activation | 156 PASS |
| chromium-results.json / Heading outside sequential Tab order | 6 PASS |
| chromium-results.json / Help forbidden terms and changed labels | 2 PASS |
| chromium-results.json / Help regression menu destinations | 2 PASS |
| chromium-results.json / Scripts disabled native return | 1 INCOMPLETE |
| firefox-post-input-clock.json / Article 1 distance | 14 PASS, 10 FAIL |
| firefox-post-input-clock.json / Article activation | 156 PASS |
| firefox-post-input-clock.json / Heading outside sequential Tab order | 6 PASS |
| firefox-results.json / A2-1 F36 rendered contrast | 12 PASS |
| firefox-results.json / A2-1 structure and dimensions | 6 PASS |
| firefox-results.json / A2-2 menu geometry | 2 PASS |
| firefox-results.json / A2-2 menu keyboard outline | 26 PASS |
| firefox-results.json / Article 1 distance | 24 FAIL |
| firefox-results.json / Article activation | 156 FAIL |
| firefox-results.json / Help forbidden terms and changed labels | 2 PASS |
| firefox-results.json / Help regression menu destinations | 2 PASS |
| webkit-results.json / A2-1 F36 rendered contrast | 12 PASS |
| webkit-results.json / A2-1 structure and dimensions | 6 PASS |
| webkit-results.json / A2-2 menu geometry | 2 PASS |
| webkit-results.json / A2-2 menu keyboard outline | 26 PASS |
| webkit-results.json / Article 1 distance | 14 PASS, 10 FAIL |
| webkit-results.json / Article activation | 156 PASS |
| webkit-results.json / Heading outside sequential Tab order | 6 PASS |
| webkit-results.json / Help forbidden terms and changed labels | 2 PASS |
| webkit-results.json / Help regression menu destinations | 2 PASS |

## Effects and manual status

Automated sign-in attempts: 11 of 15. Session sign-out responses: {'200': 11}. Account & Billing browser document loads: 0. Browser contexts ran serially. Owner B remains reserved for Tony. No email, invitation, removal, hosted billing, purchase, Stripe write or fixture change was initiated. The Portal build-info API was read for identity verification.

W-09 and W-10 await Tony’s own words. Both builds remain serving. The post-commit check remains for Tony after his commit. Friday adjudicates.

## Final scripts-off observation and effects

468 of 468 centered activations passed. All four exact Firefox reproduction positions passed. The additional Chromium Owner A session confirmed native navigation on rendered Help after page scripts were disabled. From scroll position 6803, the last article link returned to zero with the header visible at all five samples through 2000 ms. On a cold load with scripts disabled, the response contained all 13 links under a hidden ancestor and the last link had no layout box. A reader could not use those links on that cold load. Friday should adjudicate cold-load accessibility separately from the native link and F37. Two earlier cold-load attempts remain recorded. Evidence: evidence/Q4/A3/chromium-no-script-rendered.json. Final automation effects: 12/15 SCRATCH sign-in attempts, 12 sign-outs HTTP 200, zero Portal document loads. The read-only build-info check verified the pair again in served-ready.json. W-09 and W-10 remain pending.
