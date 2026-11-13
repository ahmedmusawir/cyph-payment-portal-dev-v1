## E2 — code is complete up to the DEV apply checkpoint; waiting on you

The Payment Portal's screens are now wired to the real API, and both apps pass every check I can run without a server. Everything from my earlier report still stands, including the three decisions I need. DEV is untouched and nothing is committed.

### Checks, both apps

| Check | OwedBook | Payment Portal |
|---|---|---|
| Typecheck | Clean | Clean |
| Lint | 0 errors | 0 errors (lint did not run at all before) |
| Tests | 267 of 267 | 371 of 371 |
| Production build (disposable copy) | Pass | Pass |
| Client bundle scan for server secrets | Clean | Clean |

No browser test has been run; that needs the servers.

### What changed in the portal since my last report

- **Screens:** registration (plan, owner, pharmacy, review, status), dashboard and billing now call the real API. Every `/demo` route, the fake Stripe page and the reviewer controls are out of the app.
- **Sign-in:** any signed-in user can enter the account area; billing is shown only to the account owner.
- **Review fixes:** I found and fixed one real defect: a checkout attempt that failed before Stripe answered could leave a registration stuck.
- **Lint:** restored with an ESLint config.

A parallel agent built the screens under a written brief and I reviewed the result. One of its shell commands contained a Git index command by mistake; the permission system blocked it before it ran, and I verified the index and HEAD are unchanged.

### Things you should know

- **`package-lock.json` in the portal is modified again.** That is deliberate this time: ESLint and its Next config were added as dev dependencies.
- **Copy needs sign-off:** the price-change consent sentence on the review step was written during the build. Terms, Privacy and the support address are still placeholders.
- **Unused mock code is still in the repo.** The old mock engine, its services and a few unmounted views are no longer reachable from any route. I left them in place with their tests as the reference for the original design. Say if you want them removed.
- **The portal's Playwright specs** target the removed routes and need rewriting.

### Still waiting on you

1. **DEV apply**, with backup option A (install `postgresql-client-17` so I can dump and restore-rehearse) or B (apply on the additive design, preservation check and logical export). Bundle: `EVIDENCE/apply/dev-0053-0060/APPLY_BUNDLE.md`.
2. **Identity ceiling ruling:** do the 12 identities created on SCRATCH count against the capsule's 12?
3. **Environment settings** for both apps (listed in my last report and in `PROGRESS.md`).
4. After the apply: **start OwedBook on 3000, the portal on 3001 and the Stripe listener** as one step, and tell me. I then run the integrated proof and return the engineering handoff.

The evidence is in the module under `EVIDENCE/E2/r01/`; `checks/CHECK_RESULTS.md` has the detail behind the table above.
