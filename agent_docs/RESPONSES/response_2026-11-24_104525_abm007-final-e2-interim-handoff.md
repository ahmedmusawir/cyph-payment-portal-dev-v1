ABM007_FINAL E2 is built in both working trees and verified, but I'm returning it as an **interim handoff**, not "engineering complete". Three things need you first. Nothing is committed. I made no dashboard, data, email, purchase or deployment change.

**Review package**

- ZIP: `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/ABM007_FINAL_ENGINEERING_REVIEW_01.zip`
- Copy: `~/Downloads/ABM007_FINAL_ENGINEERING_REVIEW/` (byte-identical, hash checked)
- SHA-256: `18f7dfbab77278900d2ad0e56797de780954a06e05bf9d1e142d97f0496f1561`
- 77 indexed members. Start with `EVIDENCE/E2/REVIEW_START_HERE.md`, then `QAM/HANDOFFS/ENGINEERING_HANDOFF.md`.

**Recorded before building**

- Your release, saved word for word in `SOURCES/`.
- Rulings AM-08 to AM-10, the contract freeze (`CONTRACT_FREEZE.md`) and plan RELEASED 02 (`81ae3410…15c7ce`).
- State set to ENGINEERING RELEASED.

**Read-only refresh (amendment A)**

- Alpha still serves `ef4cebc` (OwedBook) and `6dd3de7` (Portal).
- You committed the Portal records as `b2e50fa` and pushed both branches. Baselines stay `9597699` and `cb4decd`.

**What was built, both apps**

- The approved look: exact token block, Inter, light forced, the logo master and full-canvas icons, navy headers, white cards and neutral role labels.
- Literal sign-in and registration pages, translated dashboards, and Add Pharmacy as a panel inside navigation.
- Help at `/help`, with the text corrected to the real screens.
- The "No permitted stores" fix.
- Landing page cleaned up; its screenshot was removed.
- "Cyber Pharma" removed from every customer-facing string, including the notice wording.
- 16 stale Portal specs retired, with a mapping table.
- New tests: token pins, forced light, Help, store selector, notice wording.

**Verification, run on copies hash-bound to the actual working trees (amendment B)**

| Check | OwedBook | Portal |
|---|---|---|
| Unit tests | 389/389 | 580/580 |
| Typecheck and build | pass | pass |
| Lint | 0 errors, 38 warnings (same as baseline) | 0 errors, 27 warnings (same as baseline) |

- Public pages were served on ports 3300/3301 against a dummy backend. Those processes are now stopped.
- At 375 and 1440 px, with a dark OS and a saved dark theme, the pages render light.
- Every brand color resolves to the exact approved hex, and the rounded-color control is flagged.
- No overflow, no theme control, no old name.
- The only server change is the five permitted notice strings.

**What needs you (each blocks only its own task)**

| # | What | What I need |
|---|---|---|
| S-1 | Sign-in email body (AC-E01 not claimed) | Your unchanged export of the live template. I did not reconstruct it |
| S-2 | Signed-in screens, the redirect reproduction and a landing screenshot were not done: there are no SCRATCH fixtures on this machine | Existing SCRATCH identities and a way to point builds at SCRATCH, or confirm these go wholly to QA |
| S-3 | One old-logo reference remains in the unreachable `src/components/portal/references/EmailPreview.tsx:62`, outside the allowed paths, so AC-N02 is partly open | Choose: allow the one-line change, rule unreachable modules out, or allow deletion |

Also for your notice:

- **AM-11:** a Member who follows Help's billing link is sent back to the OwedBook page by the existing guard. They do not see a "managed by Owner" message. I did not change the guard.
- The leftovers list in `EVIDENCE/E2/LEFTOVERS.md` waits on your removal decision.

**Git:** scoped commands for each repository are in the handoff, section 10. I did not run them.

**Records:** session, changelog and response entries are written in each repository. `RECOVERY.md` was not touched.

I stop here. When S-1 to S-3 are resolved, I resume at the resume points in the handoff and then record ENGINEERING COMPLETE — AWAITING QA BRANCH.
