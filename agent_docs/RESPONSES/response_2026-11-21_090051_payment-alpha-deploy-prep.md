# Payment Portal alpha — deployment preparation (for JARVIS review)

**Result: PREPARED, with one open item — the read-only cloud checks did not run because the `gcloud` login has expired.**
Nothing was deployed, no cloud resource was created or changed, Stripe and Supabase were not touched, no scheduler exists, nothing is committed.

- **Branch:** `deploy/payment-alpha-prep` at `883bc93`, equal to `main` and `origin/main`; the tree was clean at the start.
- **Target:** new service `cyph-v1-payment-alpha`, `cyberize-nextjs-staging` / `us-east1`, `https://cyph-v1-payment-alpha.cyberizedev.com`.
- **DNS:** public DNS returns `CNAME ghs.googlehosted.com.` for the alpha host.
- **Skill:** `agent_docs/SKILLS/nextjs-cloud-deploy-agent-skill/` v1.3. Its plan-approval stop before local generation was waived on the Director's instruction (ledger row 7); deployment approval is still required before init.

## 1. Changed files (all uncommitted)

| File | Change |
|---|---|
| `src/lib/appIdentity.ts` | One line: the `staging` origin pair is now the alpha pair, identical to OwedBook's table. `local` and `local-proof` rows untouched, so localhost development is unchanged. |
| `src/__tests__/alpha-origins.test.ts` | New, 4 tests: alpha pair under `staging`, exact site-URL guard, local rows unchanged, return paths exact. |
| `stark-deploy.yaml` | Rewritten for alpha. `NEXT_PUBLIC_APP_ENV=staging`, alpha site URL, DEV Supabase, 7 secret names, runtime settings. |
| `Dockerfile` | OwedBook alpha version: build-identity args, `HOSTNAME=0.0.0.0`. No secret is a build argument. |
| `cloudbuild.yaml` | Unique image tag, digest resolved after push, Cloud Run deploys the digest, `--port 3000`, `--set-secrets` for 7 runtime secrets, max 1 instance. |
| `deploy.sh` | Dirty-source guard, build identity, digest read-back. New: refuses to submit when any secret has no enabled version. |
| `init-app.sh` | 7 empty secrets, runtime SA, accessor bindings for the runtime SA only, act-as check (the pipefail-safe version). |
| `upload-secrets.sh` | New, operator-run. 6 values from `.env.local`; the webhook secret is deliberately not in it. |
| `.dockerignore`, `.gcloudignore` | Nested and case-insensitive env and credential patterns; factory records excluded. The old `!.env.example` exception is removed. |
| `DEPLOYMENT_CHECKLIST.md` | Rewritten as the alpha run record, stages A to C, with the webhook and scheduler steps. |
| `agent_docs/…` | Ledger rows 7–12, session file, this report; `RECOVERY.md`, `CHANGELOG.md`. |

The 3 Nov FFM versions of these files are in git history at `883bc93`. The FFM service `cyph-sub-portal-prod` is a different service and is not named anywhere in the new files.

## 2. Proposed cloud resources (none exists yet as far as this run could tell)

| Resource | Name |
|---|---|
| Cloud Run service (public) | `cyph-v1-payment-alpha` |
| Runtime service account | `sa-cyph-payment-alpha-runtime` |
| Secrets (runtime only, runtime SA is the only accessor) | `cyph-payment-alpha-supabase-secret-key`, `-stripe-secret-key`, `-stripe-webhook-secret`, `-resend-api-key`, `-stripe-expected-account`, `-stripe-price-stores`, `-stripe-portal-configuration` |
| Image | `us-east1-docker.pkg.dev/cyberize-nextjs-staging/cloud-run-source-deploy/cyph-v1-payment-alpha:<sha12>-<UTC time>` |
| Later, separate approvals | domain mapping for the alpha host; Stripe sandbox webhook endpoint; Cloud Scheduler job |

- The app prefix is `cyph-payment-alpha` (18 characters) because the service name is too long for the runtime SA ID, as on OwedBook.
- Plain runtime settings: `MAIL_RECIPIENT_POLICY=open` (the code honours it on the DEV project only) and `APA_PROMOTION_CODES`.
- Not set: `MAIL_ALLOWLIST`, `BILLING_EMAIL_FROM` (code default), `ALLOW_SYNTHETIC_SUBSCRIPTIONS`, Support/Terms/Privacy. Never deployed: `ALLOW_TEST_CLOCK` and the test-only names.

## 3. Requirements verified from the code

- **Supabase:** public URL and publishable key at build; `SUPABASE_SECRET_KEY` at runtime (`src/utils/supabase/admin.ts`, `src/server/provisioning.ts`). The same key seeds the operator and scheduler token (`src/server/operator.ts`).
- **Stripe:** `src/server/stripeClient.ts` refuses any key that is not `sk_test_` or `rk_test_`, so only a sandbox key can work. It also requires `price_`, `bpc_`, `acct_` and `whsec_` values together: if the webhook secret is missing, every Stripe call fails, not only webhooks.
- **Webhook:** `POST /api/webhooks/stripe`; rejects a bad signature, live-mode events and another account. Seven event types (listed in the checklist).
- **Resend:** `RESEND_API_KEY` at runtime, billing notices only (`src/server/billingNotices.ts`). Without it notices are marked `sender_not_configured`.
- **No dynamic `process.env[...]` read** in app code; no `src/instrumentation.ts`.

## 4. Webhook signing secret — when and how

It is not available yet and must not come from `.env.local` (that one belongs to the local Stripe CLI listener).

1. After deployment approval and `init-app.sh`, Tony creates the endpoint in the Stripe **sandbox** for `https://cyph-v1-payment-alpha.cyberizedev.com/api/webhooks/stripe` with the seven events. The URL is already known, so this happens before the deploy.
2. Tony reveals that endpoint's `whsec_` value and stores it with the hidden-prompt command in `DEPLOYMENT_CHECKLIST.md` step A3. The value is never shown, logged or written to a file.
3. `deploy.sh` then proceeds; before that it aborts and names the empty secret.

## 5. Scheduler and duplicate processing

- The Portal needs `POST /api/internal/jobs/run` about every minute (Add Store expiry, lifecycle reconciliation, removal and transfer finalize, hold expiry, billing notices). Nothing was created or enabled.
- Localhost and alpha share the DEV database, and the webhook's environment marker is the Supabase project, so it cannot tell a local Portal from alpha. Rules to avoid double processing:
  - one job runner: stop every local `jobs-run.mjs --every` loop before a Cloud Scheduler job is enabled;
  - one webhook consumer: stop the local `stripe listen` while the alpha endpoint is active;
  - keep `max-instances 1` and give the scheduler job no retries.
- Until a scheduler exists those jobs do not run on alpha; a single manual run is possible (checklist).
- The scheduler would store the derived bearer token in its job definition. That token also opens the operator routes, and it changes when the Supabase key is rotated. Decision for JARVIS before the job is created.

## 6. Check results

| Check | Result |
|---|---|
| Typecheck | clean |
| Jest | 572/572, 32 suites (includes the 4 new tests) |
| Lint | 0 errors, 27 warnings (not compared with a baseline) |
| `bash -n` on the three scripts; YAML parse; template braces | clean |
| Cloud Build substitutions | defined = used = passed by `deploy.sh` |
| Upload boundary (`gcloud meta list-files-for-upload`) | clean, 270 files, required build inputs present |
| Ignore-rule canary (18 planted env and credential names, several depths and letter cases) | none reaches the upload list |
| `deploy.sh` guards, dry run, nothing submitted | aborts on the uncommitted tree; with `ALLOW_DIRTY=1` aborts at the secret check |
| Local `docker build` of the real Dockerfile | exit 0, Next.js 16.4.3 |
| Image inspection (no container server started) | user `nextjs`; env names only `PATH`, `NODE_VERSION`, `YARN_VERSION`, `NODE_ENV`, `NEXT_TELEMETRY_DISABLED`, `PORT`, `HOSTNAME`; no `.env*` or credential file; no `agent_docs`, `e2e` or `scripts`; no secret-shaped string; alpha origins compiled in; old staging origins absent. Image removed afterwards. |

**Not validated:**
- The container was not started (no local servers outside QA), so the listen address and `/api/build-info` are unproven for this image; the same Dockerfile lines were proven on OwedBook.
- The Cloud Build steps run only in the cloud.
- The Docker context list was not checked separately; the image contents were checked instead.

## 7. Blockers and decisions

1. **`gcloud` login expired (blocker for cloud checks).** Every read-only cloud command failed with "Reauthentication failed". Not checked: account and project, enabled APIs, Artifact Registry, build service account and its roles, and whether any alpha-named service, secret or service account already exists. Tony runs `gcloud auth login`; I then rerun them before approval.
2. **Next.js 16.4.3 has moderate advisories; 16.4.5 fixes them.** OwedBook alpha runs 16.4.5 and the 20 Nov staging inventory asks for the upgrade before any deployment. I did not change dependencies. Recommendation: approve the upgrade before the commit.
3. **`zod` high advisory (needs zod 4).** Deferred for OwedBook alpha by the Director on 20 Nov; the same decision is needed here.
4. **Three Stripe identifiers are held in Secret Manager** so the helper can take them from `.env.local` without my reading it. The alternative is plain values in `stark-deploy.yaml`, which needs Tony to supply them.
5. **`APA_PROMOTION_CODES=APA10SANDBOX`** comes from a 12 Nov record, not from the env file. Confirm or clear it.
6. **Terms, Privacy and support address** are unset; required before any external exposure.
7. **Commit by Tony** before deploy; `deploy.sh` aborts on an uncommitted tree by design.

## 8. Still pending, not passed

- Supabase redirect allow-list, Site URL and email-template updates.
- Domain mapping and certificate for the alpha host.
- Authenticated two-app testing: sign-in, handoff both ways, purchase, Add Store, billing, notices.
- Gate D certification.

## 9. Order after approval

`gcloud auth login` (Tony) → cloud checks (agent) → commit (Tony) → `./init-app.sh` (agent) → `./upload-secrets.sh` (Tony) → webhook secret, step A3 (Tony) → `./deploy.sh` (agent) → read-back → domain mapping → integration step.
