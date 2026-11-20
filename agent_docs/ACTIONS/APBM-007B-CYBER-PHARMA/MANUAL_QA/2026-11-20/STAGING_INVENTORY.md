# Two-app staging inventory — READ ONLY (prepared, nothing deployed or configured)

- **Prepared:** Claudy, 20 November 2026, from the working trees on `repair/apbm-007b-manual-qa` (OwedBook HEAD `64295a7`, Portal HEAD `0443fda`, plus uncommitted repairs).
- **Authorization:** read-only preparation. Deployment is a separate Director release.
- **No values:** no secret value appears here and no `.env` contents were copied. Variable *names* were listed from code and from the `.env.local` files (names only).
- **Binding requirements:** `STAGING_AND_GATE_D.md` and `GATE_D_HANDOFF.md` still govern. This sheet is the current inventory for them.

## 1. Origins and handoff allowlists (source: `src/lib/appIdentity.ts`; same in both apps except the app id)

| Environment (`NEXT_PUBLIC_APP_ENV`) | OwedBook (`ob`) | Account & Billing Portal (`pp`) |
|---|---|---|
| `local` (default when unset or unknown) | `http://localhost:3000` | `http://localhost:3001` |
| `local-proof` | `http://localhost:3100` | `http://localhost:3101` |
| `staging` | `https://owedbook.cyberizedev.com` | `https://owedbook-payment.cyberizedev.com` |

- **Return paths (exact allowlists, held in both apps):**
  - OwedBook: `/`, `/owedbook`, `/admin-portal`, `/admin-portal/billing`, `/invitations`.
  - Portal: `/`, `/dashboard`, `/billing`, `/register/activation`, `/stores/add`.
  - Defaults: `/owedbook` and `/dashboard`.
- **`siteOriginMatches()`:** `NEXT_PUBLIC_SITE_URL` must equal the app's own frozen origin for its environment, or auth, handoff and state-changing APIs fail closed.
- **Cookies:** per app and per environment (`cyph-<app>-auth-<env>`, plus the `-ho-`, `-cf-` and Portal `-reg-` variants). Staging and localhost cookies cannot collide, and `Secure` follows the https origin.
- **Localhost stays as is:** local work keeps `NEXT_PUBLIC_APP_ENV` unset or `local`. Staging is selected only by build arguments in the deployment configuration. No `.env.local` change is needed.

## 2. Auth callback and redirect routes

| Route (both apps unless noted) | Purpose |
|---|---|
| `/api/auth/confirm` | the target of every emailed sign-in link (`emailRedirectTo = <own origin>/api/auth/confirm`). Portal provisioning sends the post-purchase access link to its own or the peer origin's `/api/auth/confirm` |
| `/api/auth/login`, `/api/auth/link`, `/api/auth/logout` | password sign-in, link request, provider-wide sign-out |
| `/api/handoff/start` → `/api/handoff/authorize` → `/api/handoff/callback`; `/api/handoff/switch` | cross-app handoff with the destination verifier (return paths above) |
| OwedBook `/api/invitations/…`, `/api/stores/[id]/invitations` | invitation accept, decline, revoke and resend. Invitation mail is a Supabase sign-in email to `/api/auth/confirm` |

**Supabase Auth (DEV project `yrsuwikjnbmvpznrgydb`), to be applied by the Director in one session:**
- **Site URL**
- **Redirect allowlist:**
  - `https://owedbook.cyberizedev.com/api/auth/confirm`
  - `https://owedbook-payment.cyberizedev.com/api/auth/confirm`
  - keep the localhost entries
- **Magic Link template:** the token-hash template.
- **Token lifetime:** 3600 s.

Details are in `MANUAL_QA/2026-11-19/STAGING_MAIL_AND_AUTH.md` §3.

## 3. Environment variables (names and classification only)

**Public** variables (`NEXT_PUBLIC_*`) are compiled into the bundle at **build** time, so they must be Docker build args. **Server** variables are read at **runtime**: secrets come from Secret Manager, and other settings are plain Cloud Run variables.

### OwedBook

| Name | Class | Staging note |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | public, build | `staging` (required: selects the origins) |
| `NEXT_PUBLIC_SITE_URL` | public, build | `https://owedbook.cyberizedev.com` (must match §1) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public, build | DEV project (per Gate D) |
| `NEXT_PUBLIC_APBM_DATA_MODE` | public, build | unset (`mock` would turn on demo data) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | public, build | optional; defaults to `support@pharmacybooks.com` |
| `SUPABASE_SECRET_KEY` | **server secret**, runtime | required. Used only by the invitation-mail module and the server's service-role reads |
| `MAIL_ALLOWLIST`, `MAIL_RECIPIENT_POLICY` | server, runtime | `open` is honoured only on the DEV project |
| `ALLOW_SYNTHETIC_SUBSCRIPTIONS` | server, runtime | decision: `true` on staging DEV (as locally) or unset |
| `APBM_BUILD_ARTIFACT_ID`, `APBM_BUILD_REVISION` | build (next.config `env`) | set by the build to the merged revision (served at `/api/build-info`) |

- **Never deploy:**
  - `APBM_DIRECTOR_APPLY`
  - `APBM_DEV_*` and `APBM_SCRATCH_*` (database URLs and keys for tooling)
- **Present locally but not read by the app:** `NEXT_PUBLIC_API_BASE_URL`.

### Portal

| Name | Class | Staging note |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | public, build | `staging` (required) |
| `NEXT_PUBLIC_SITE_URL` | public, build | `https://owedbook-payment.cyberizedev.com` (see §7 conflict) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public, build | DEV project |
| `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_TERMS_URL`, `NEXT_PUBLIC_PRIVACY_URL` | public, build | Terms and Privacy: **Director input** before external exposure (https only, else "(link not yet published)") |
| `SUPABASE_SECRET_KEY` | **server secret**, runtime | required (`src/server/db.ts` is the service-role access point). Also seeds the operator and scheduler token (§6) |
| `STRIPE_SECRET_KEY` | **server secret**, runtime | sandbox key only, never production |
| `STRIPE_WEBHOOK_SECRET` | **server secret**, runtime | the deployed endpoint's own `whsec_` secret (not the local `stripe listen` one) |
| `RESEND_API_KEY` | **server secret**, runtime | billing notices |
| `STRIPE_EXPECTED_ACCOUNT`, `STRIPE_PRICE_STORES`, `STRIPE_PORTAL_CONFIGURATION` | server, runtime | identifiers (`acct_`, `price_`, `bpc_`), validated at use |
| `APA_PROMOTION_CODES`, `BILLING_EMAIL_FROM` | server, runtime | sender defaults to `Cyber Pharma <no-reply@cyberizedev.com>` |
| `MAIL_ALLOWLIST`, `MAIL_RECIPIENT_POLICY` | server, runtime | as for OwedBook. `MAIL_GUARD` is ignored |
| `ALLOW_SYNTHETIC_SUBSCRIPTIONS` | server, runtime | decision, as for OwedBook |
| `APBM_BUILD_ARTIFACT_ID`, `APBM_BUILD_REVISION` | build | as for OwedBook |

- **Never deploy:**
  - `ALLOW_TEST_CLOCK` (fixture scripts only; there must be no test clock on staging DEV);
  - the `APBM007B_*`, `APBM_ITEST_*`, `APBM_LOCALDB_*`, `APBM_SAGA_IMPL` and `APBM_DEADLINE_OUT` names (integration tests only).
- **Present locally but not read by the app:**
  - `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`;
  - `STRIPE_PRICE_FIRST_STORE`, `STRIPE_PRICE_ADDITIONAL_STORE`;
  - `NEXT_PUBLIC_APP_URL` (passed by the old kit, but never read).

## 4. Stripe webhook (Portal)

- **Endpoint:** `POST https://<portal origin>/api/webhooks/stripe`. It checks the `STRIPE_WEBHOOK_SECRET` signature, refuses `livemode` events (400 `wrong_mode`) and refuses another account (400 `wrong_account`).
- **Events (the same set the local listener forwards):**
  - `checkout.session.completed`, `checkout.session.expired`;
  - `invoice.paid`, `invoice.payment_failed`;
  - `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
- **Not yet created:** a permanent sandbox endpoint for staging, with its own signing secret.
- **Local listener:** it currently forwards the same sandbox to `localhost:3001`. Before staging goes live, the sandbox must have **one designated active consumer**, or explicit isolation. Both apps use the same DEV database, so a local Portal and the staging Portal would both process the same events.

## 5. Mail

| Path | Sender | Guard |
|---|---|---|
| OwedBook invitations | Supabase Auth email (custom SMTP: Resend, `no-reply@cyberizedev.com`) | `mailGuard.ts` (allowlist, or DEV-only open policy) |
| Portal billing notices | Resend API (`RESEND_API_KEY`, `BILLING_EMAIL_FROM`) | `mailGuard.ts` |
| Sign-in and access links (both apps) | Supabase Auth email | Supabase settings only |

To verify on staging (from `STAGING_MAIL_AND_AUTH.md` §4):
- the Resend domain is verified;
- the Auth email rate limit;
- the plus-alias delivery;
- one received invitation, sign-in link and notice.

## 6. Scheduler (Portal)

- **Job:** `POST https://<portal origin>/api/internal/jobs/run` about **every minute**. It covers Add Store expiry and abandon, stalled lifecycle reconciliation, period-end removal and transfer finalize, transfer hold expiry, and due billing notices.
- **Authentication:** `Authorization: Bearer <sha256(SUPABASE_SECRET_KEY + ":apbm007a-operator-v1")>`. Anything else gets 404.
  - Locally: `node scripts/apbm007b/jobs-run.mjs --base <origin> --every 60`.
  - Staging: an authenticated Cloud Scheduler HTTP job holding that derived token. The service is public, so the app-level bearer token is the guard.
- **Rotation:** rotating the Supabase secret key changes the token. Update the scheduler job's stored header at the same time.
- **One runner only:** do not run the local runner and the staging scheduler against the same DEV database at the same time.

## 7. Existing deployment files and possible target conflicts

| Finding | Detail | Effect |
|---|---|---|
| Portal kit exists (3 Nov 2026) | `Dockerfile` (node:22-alpine, standalone, port 3000), `cloudbuild.yaml`, `deploy.sh`, `stark-deploy.yaml`, `DEPLOYMENT_CHECKLIST.md` | Project `cyberize-nextjs-staging`, `us-east1`, service **`cyph-sub-portal-prod`**, public, 1 Gi, **max 1 instance** (this matches the process-local rate limiters) |
| **The service was already deployed once** | `DEPLOYMENT_CHECKLIST.md` records `deploy.sh` exit 0 from `main` @ `abbbcc8` (pre-007A/B code) | Re-running the kit **replaces that service's revision**. Decision: reuse that service or create a new one |
| **Domain conflict** | the kit uses `cyph-payment.cyberizedev.com`; the code's staging origin is `owedbook-payment.cyberizedev.com` | With the kit as is, `siteOriginMatches()` fails closed and handoff breaks. Pick one; a different domain needs an approved `appIdentity.ts` source change in both apps |
| **Missing build arg** | the kit does not pass `NEXT_PUBLIC_APP_ENV` | the build would run as `local` (origins localhost) and fail closed on https. Add `NEXT_PUBLIC_APP_ENV=staging`, plus Support, Terms and Privacy |
| **Secrets assumption is obsolete** | the kit says "zero secrets; `SUPABASE_SECRET_KEY` never read" | it is now read (`src/server/db.ts`), and Stripe, webhook and Resend secrets are needed. The kit needs `--set-secrets` and Secret Manager access for the runtime service account |
| OwedBook has no kit | no Dockerfile, `cloudbuild.yaml` or `deploy.sh` (`output: standalone` is set) | prepare a separate target. The project already hosts `cyber-pharma-prod` and `cyph-mission-ctrl-prod`. `STAGING_AND_GATE_D.md` says "do not overwrite old FFM feedback site". Which existing service, if any, is that site is **unknown**, so choose a new service name |
| Alpha domains | `owedbook.alpha.cyberizedev.com` / `payment.alpha.cyberizedev.com` were mentioned for stakeholder testing | not in `appIdentity.ts`. That is a source change and still open (GATE_D_HANDOFF §5 item 2) |
| Next.js security advisory | Portal 16.4.3 (moderate advisories ≤16.4.4); OwedBook 16.3.7 (incl. critical/high ≤16.4.0 and <16.3.8) | the Docker build uses the lockfile, so staging would ship the affected versions. See the repair report: the minimal fix is 16.4.5 |
| Shared database | staging and localhost both point at DEV `yrsuwikjnbmvpznrgydb` | one webhook consumer and one scheduler at a time (§4, §6) |

## 8. Decisions needed (in this order)

1. **Portal domain:** `owedbook-payment.cyberizedev.com` (matches the code) or `cyph-payment.cyberizedev.com` (matches the old kit; needs a source change). Same question for the alpha domains.
2. **Portal service:** reuse `cyph-sub-portal-prod` (replaces the 3 Nov revision) or create a new one. **OwedBook:** a new service name and its recipe.
3. **Next.js upgrade** to 16.4.5 in both apps before any deployment, as a separate approved change with lockfile, tests and builds.
4. **Secret Manager names** for the four Portal secrets and the OwedBook `SUPABASE_SECRET_KEY`, and the runtime service accounts' access.
5. **Stripe sandbox endpoint** for staging, and which consumer is active (local listener off, or isolation).
6. **Scheduler:** Cloud Scheduler job with the derived token, or a dedicated scheduler secret (a source change).
7. **`ALLOW_SYNTHETIC_SUBSCRIPTIONS` on staging DEV**, and the mail policy on staging (`open` is honoured on DEV only).
8. **Terms and Privacy URLs**, and the support mailbox check (before external exposure).
