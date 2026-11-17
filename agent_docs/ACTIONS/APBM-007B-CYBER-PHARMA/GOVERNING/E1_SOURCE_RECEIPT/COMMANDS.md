# Commands — exact, with cwd and flags. NONE WERE RUN in this pass.

`PP` = `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` · `OB` = `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`

Labels: **CURRENT** = script or file exists at HEAD and was used in 007A · **MISSING** = no tooling at HEAD ·
**STALE** = present but points at something that no longer exists or is module-bound to 007A/003.

Local toolchain read from disk (not from a run): Node v22.17.0, npm 11.15.0, system Chrome at `/usr/bin/google-chrome`.
Installed: PP `next` 16.4.3, OB `next` 16.3.7 (pinned), both `jest` 30.4.2, `typescript` 5.5.4, `eslint` 9.39.5,
`@playwright/test` 1.59.1; PP `stripe` 22.1.0; OB `pg` 8.23.0.

## Unit tests

| App | cwd | Command | Label |
|---|---|---|---|
| PP | `PP` | `npx --no-install jest --ci` (same as `npm test` plus `--ci`) | CURRENT |
| OB | `OB` | `npx --no-install jest --ci` | CURRENT |
| Focused | either | `node_modules/.bin/jest --ci <path> [<path>…]` | CURRENT (form used in 007A r03) |

Config: `jest.config.js` in each repo — `ts-jest`, `testEnvironment: node` by default (component suites opt into jsdom
per file), roots `src`, setup `src/__tests__/jest.setup.ts`. The match pattern does **not** pick up `*.itest.ts`, so
the SCRATCH integration test never runs in the default suite. Last recorded totals (007A r01, not re-run): OB 43
suites / 276 tests; PP 19 suites / 390 tests. Treat as history only.

## Typecheck

| App | cwd | Command | Label |
|---|---|---|---|
| PP | `PP` | `npx --no-install tsc --noEmit` (`npm run typecheck`) | CURRENT |
| OB | `OB` | `npx --no-install tsc --noEmit` | CURRENT, but **MISSING as an npm script** (OB `package.json` has no `typecheck`) |

## Lint

| App | cwd | Command | Label |
|---|---|---|---|
| PP | `PP` | `npx --no-install eslint .` (`npm run lint`) | CURRENT |
| OB | `OB` | `npx --no-install eslint .` (`npm run lint`) | CURRENT |
| OB | `OB` | `./scripts/lint-check.sh` | CURRENT — grouped summary; exit code mirrors ESLint |

007A r01 recorded 0 errors with warnings (OB 33, PP 24). `next lint` no longer exists in Next 16; neither script uses it.

## Build and serve

Never build inside either repository and never with real settings. The tracked 007A method
(`OB/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r01/checks/build_check.sh`, exported) is, per app:

```
# cwd: a disposable copy $dst outside both repos
rsync -a --exclude node_modules --exclude .next --exclude .git --exclude agent_docs --exclude '.env*' \
      --exclude test-results --exclude playwright-report "$REPO/" "$dst/"
cp -al "$REPO/node_modules" "$dst/node_modules"        # hard links; Turbopack refuses a symlink leaving the root
cd "$dst" && env -i PATH="$PATH" HOME="$HOME" NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 \
  NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co \
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_placeholder \
  NEXT_PUBLIC_SITE_URL=http://localhost:3000   # OB; http://localhost:3001 for PP \
  NEXT_PUBLIC_APP_ENV=local NEXT_PUBLIC_APBM_DATA_MODE=real \
  SUPABASE_SECRET_KEY=SERVERKEY_CANARY_7f3a9 STRIPE_SECRET_KEY=sk_test_CANARY7f3a9 STRIPE_WEBHOOK_SECRET=whsec_CANARY7f3a9 \
  ./node_modules/.bin/next build
```

Label: **STALE as written** — the script hard-codes the 007A work directory (`ARCHIVE/APBM007A_E2_WORK/r01`); the
method is current, the paths need a 007B lane. `output: "standalone"` is set in both `next.config.js`.

Serve (proof copies, 007A r03/r06): `cd "$dst" && NODE_ENV=production ./node_modules/.bin/next start -p 3100` (OB) /
`-p 3101` (PP), with real settings supplied to that process only. The QA servers are the Director's on 3000 (OB) and
3001 (PP); `src/lib/appIdentity.ts` fixes those two local origins and `siteOriginMatches()` compares
`NEXT_PUBLIC_SITE_URL` with them, so a proof copy on another port does not match the frozen address table as
committed. 007A r06 records a test-only address change in its proof copy for this reason. Standing
rule from the Director: I do not start servers outside QA.

Container path (not used for QA): `PP/Dockerfile`, `cloudbuild.yaml`, `deploy.sh`, `stark-deploy.yaml` — exported for
reference; OB has no tracked Dockerfile.

## Browser tests

| App | cwd | Command | Label |
|---|---|---|---|
| PP | `PP` | `npx --no-install playwright test --project=public` | CURRENT tooling, **STALE specs** |
| PP | `PP` | `npx --no-install playwright test --project=account` | same; signs in a real admin through `e2e/auth.ts` |
| PP | `PP` | `PORTAL_ALLOW_LOGOUT=1 npx --no-install playwright test --project=logout` | same; **global sign-out**, opt-in only |
| OB | `OB` | `npm run test:e2e` / `test:e2e:ui` | **MISSING** — script exists, but there is no `playwright.config.*` and no `e2e/` directory at HEAD |

PP config (`playwright.config.ts`): `testDir ./e2e`, 1 worker, 0 retries, system Chrome (`channel: "chrome"`), trace,
video and screenshot off, `baseURL = PORTAL_BASE_URL ?? http://localhost:3001`; it never starts a server. The specs
under `e2e/` are from the earlier frontend module (public registration journeys, repairs 001–006, Gate M) and predate
the 007A real-data flow; none covers store management, invitations, removal or transfer. 007A QA drove the browser
with disposable helpers in its own QAM lane instead.

## Integration tests

| What | cwd | Command | Label |
|---|---|---|---|
| PP `npm run test:integration` | `PP` | `jest --testPathPatterns=__tests__/api` | **STALE** — `src/__tests__/api/` does not exist |
| PP server against SCRATCH | `PP`, via runner | `node <runner>.mjs`, which spawns `npx jest --testMatch '**/src/integration/apbm007a-scratch.itest.ts' --runInBand --verbose` | CURRENT test, **STALE runner location** |
| OB database proof | `OB` | `node scripts/rls-harness/apbm007a-proof.mjs` | CURRENT, 007A-scoped |
| OB tenant isolation | `OB` | `npm run rls:prove` | CURRENT |
| OB audit trail | `OB` | `npm run audit:prove` | CURRENT |
| OB chain / structure | `OB` | `npm run db:inventory`, `npm run db:apply`, `npm run db:reset`, `npm run db:verify`, `npm run db:verify:probes` | CURRENT |

Conditions that the source enforces:

- The SCRATCH integration test throws unless `APBM_ITEST_SCRATCH` is set and `NEXT_PUBLIC_SUPABASE_URL` is the SCRATCH
  project (`apbm007a-scratch.itest.ts:10-13`). The tracked runner
  (`OB/…/EVIDENCE/E2/r01/checks/run_scratch_itest.mjs`, exported) reads the `APBM_SCRATCH_*` names from OB's
  `.env.local`, supplies them in memory, and scrubs keys from output. It **creates Auth identities on SCRATCH**; 007A
  ended with that ceiling reached (12 of 12), so it was not re-run after r01.
- Every OB harness script goes through `scripts/rls-harness/lib/env.mjs` `loadEnv()`: required process variables
  `RLS_HARNESS_PREFIX` (e.g. `APBM_SCRATCH_`), `APBM_TARGET` (`scratch`|`dev`), `APBM_PROJECT_REF`,
  `APBM_EVIDENCE_DIR` (absolute). It reads `<PREFIX>DB_URL`, `SUPABASE_URL`, `PUBLISHABLE_KEY`, `SECRET_KEY` from
  `.env.local`, with no fallback.
- **`evidenceRoot()` allows only APBM-003 and APBM-007A evidence directories** (`env.mjs:38`). No 007B lane is
  accepted, so every harness command fails closed for 007B until that list is extended by a product change. Label for
  007B use: **STALE**.
- `scripts/db-verify.mjs` calls `assertScratch(env)` unconditionally (line 16), so it runs only against SCRATCH even
  without `--probes`; its header comment ("safe on any target", "Env: DB_URL") is out of date. Its table list stops
  at the 007A tables.
- `apbm007a-proof.mjs` additionally needs `APBM_CREDENTIAL_FILE` (a `/tmp/` file, mode 0600) and a prior seed map.

## Bundle and privacy scans

| What | Command | Label |
|---|---|---|
| Client-bundle scan | Part of `build_check.sh`: for each pattern `grep -rl -- "$pat" "$dst/.next/static" \| wc -l`, expecting 0 | CURRENT method, STALE paths |
| Patterns used | `SERVERKEY_CANARY`, `sk_test_CANARY`, `whsec_CANARY`, `SUPABASE_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `handoff_issue`, `handoff_claim`, `provision_paid_registration`, `generateLink`, `createAdminClient`, `api.stripe.com` | 007B needs its own additions (new server-only function names) |
| Static boundary scan (unit) | OB `npx jest --ci src/__tests__/apbm007a-boundaries.test.ts`; PP `npx jest --ci src/__tests__/portal-boundaries.test.ts src/__tests__/apbm007a-server.test.ts` | CURRENT |
| Mail guard | PP `npx jest --ci src/__tests__/apbm007a-mail-guard.test.ts` | CURRENT |
| Seed identity scan | OB `npm run seed:scan` | CURRENT, synthetic-seed scope only |
| Evidence/package privacy scan | — | **MISSING** as tracked tooling. 007A QA used ad-hoc value scans inside its QAM lane |

## Build-ID checks

**MISSING** as tracked tooling. What 007A did by hand, and its recorded limit:

```
cat "$APP_DIR/.next/BUILD_ID"                         # the build on disk
readlink /proc/<pid>/cwd ; ps -o lstart= -p <pid>     # which directory and start time the listening process has
git -C "$APP_DIR" rev-parse HEAD                      # the commit that directory is on
```

007A QA recorded that a disk `BUILD_ID` alone does not attest the served binary: a process started before a rebuild
keeps serving the old build. It compared process start time against the build's file times and compared an app-path
manifest against an independent build. Neither app exposes its build ID over HTTP, and `next.config.js` does not set
`generateBuildId`, so the ID is random per build and cannot be tied to a commit without that manual chain.

## Operator scripts (Portal)

| What | cwd | Command | Label |
|---|---|---|---|
| Reconcile / recover | `PP` | `node scripts/operator-reconcile.mjs --list \| --operation <uuid> \| --event <evt_id> [--base http://localhost:3001]` | CURRENT — calls the running portal, which reads Stripe and writes the database; not a test |
| Catalogue | `PP` | `node scripts/stripe-catalogue.mjs --account <acct id> [--apply]` | CURRENT — dry run by default; contacts Stripe; `--apply` creates missing catalogue objects |

Read their headers in the export before use; both reach live sandbox state.
