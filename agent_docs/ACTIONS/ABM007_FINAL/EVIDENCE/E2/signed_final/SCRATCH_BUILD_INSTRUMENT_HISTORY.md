# SCRATCH build-check history (24 Nov), kept with the final result

The output of `tools/scratch_proof/serve.mjs build` was overwritten by each run. Only the last run's file survives, as `scratch_build_check.json`. The earlier outputs below are copied from the session's tool output, and their field names are the ones each version of the check printed. `../verify4/logs/summary.txt` also keeps the first run's line `scratch build exit=1`.

**Nothing in the product source changed between runs 1 and 4.** Only the check was narrowed, each time for a stated reason. Every run rebuilt both apps, and every `next build` exited 0. The failures are failures of the backend check, not of the builds.

| Run | Check version | Output (verbatim values) | Exit | Why the check changed next |
|---|---|---|---|---|
| 1 | Client bundles must contain the bare SCRATCH reference and no bare DEV reference | ob: `build 0, client_chunks_with_scratch_ref 1, client_chunks_with_dev_ref 0, backend_ok true`. pp: `build 0, client_chunks_with_scratch_ref 0, client_chunks_with_dev_ref 0, backend_ok false` | 1 | The Portal's browser code never talks to Supabase, so its client bundles carry no reference. The check moved to client plus server bundles, and a runtime check of the listening process was added in `auth.mjs` |
| 2 | Client and server bundles: SCRATCH reference present, bare DEV reference absent | ob: `client 1/0, server_js_with_scratch_ref 13, server_js_with_dev_ref 1, backend_ok false`. pp: `client 0/0, server 15/1, backend_ok false` | 1 | One server chunk per app contains the DEV reference: the mail guard's `OPEN_POLICY_PROJECT_REF` constant (`src/server/mailGuard.ts:10`), not a backend. The check moved to the backend-URL form `<ref>.supabase.co` |
| 3 | Backend-URL form | Same counts as run 2 (`server_js_with_dev_ref 1` in each app) | 1 | The DEV URL appears once, as the mail guard's comparison `"<DEV>.supabase.co"===new URL("https://<SCRATCH>.supabase.co…")`. That tests whether the build is DEV; it is not its backend. Only that exact literal was excluded |
| 4 | Backend-URL form, excluding only the mail-guard comparison literal | ob: `client 1/0, server 13/0, backend_ok true`. pp: `client 0/0, server 15/0, backend_ok true` | 0 | Final form of the check |
| 5 (final) | Same as run 4, on the final copies after the two OwedBook overflow fixes | Identical counts, both `backend_ok true` (`scratch_build_check.json`) | 0 | — |

Before any sign-in, each listening server was also checked at runtime. Its working directory had to be the verification copy, its Supabase URL had to resolve to `ihgcsrypblqkwommrkgj`, and `APP_ENV` had to be `local-proof`. This is recorded under `served` in `phase_a/signed_checks_phase_a.json` and the phase-b `redirect_runs.json` files.

A sign-in run made before the runtime check existed stopped at setup with "ob served bundle is not SCRATCH-only". That was the served-page scan, which missed the lazily loaded chunk. No sign-in happened in that run. The scan is now informational, and the runtime check binds.
