# Deployment Checklist — Payment Portal Alpha (run record)

Generated 2026-11-21 by next-deploy-auto v1.3, with the OwedBook alpha review fixes carried over.
**Status: Stage A DEPLOYED and verified 2026-11-21 (commit `6dd3de7`). Stage B: domain mapping and certificate live at https://cyph-v1-payment-alpha.cyberizedev.com; signed webhook delivery verified (200). Stage C (Supabase settings, sign-in, two-app tests) PENDING. Not Gate D.**
Evidence: `agent_docs/RESPONSES/response_2026-11-21_104910_payment-alpha-deployed.md` (deployment); `agent_docs/RESPONSES/response_2026-11-21_090051_payment-alpha-deploy-prep.md` (preparation).
The 3 Nov 2026 FFM run record (service `cyph-sub-portal-prod`) is in git history (`883bc93`); that service is not touched.

## Config Summary

| Item | Value |
|---|---|
| App name (resource prefix) | `cyph-payment-alpha` (proposed) |
| Service | `cyph-v1-payment-alpha` (new) |
| Project / region | `cyberize-nextjs-staging` / `us-east1` |
| Account | `moose@cyberizegroup.com` |
| Access | public (app sign-in, webhook signature and bearer token guard the routes) |
| Container | listens on `0.0.0.0:3000`; Cloud Run `--port 3000` |
| Final URL | `https://cyph-v1-payment-alpha.cyberizedev.com` |
| Peer | `https://cyph-v1-owedbook-alpha.cyberizedev.com` (deployed 2026-11-20) |
| Runtime SA | `sa-cyph-payment-alpha-runtime@cyberize-nextjs-staging.iam.gserviceaccount.com` |
| Public vars | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_ENV=staging`, `NEXT_PUBLIC_SUPABASE_URL` (DEV), `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| Runtime settings | `MAIL_RECIPIENT_POLICY=open` (DEV project only) |
| Not set | `APA_PROMOTION_CODES` (no APA code accepted on alpha), `MAIL_ALLOWLIST`, `BILLING_EMAIL_FROM`, `ALLOW_SYNTHETIC_SUBSCRIPTIONS`, `ALLOW_TEST_CLOCK`, Support/Terms/Privacy |
| Image | unique tag per build; deployed by digest |
| Sizing | 1Gi, max 1 (required: per-process rate limiters), min 0 |
| Framework | Next.js 16.4.5 (exact pin, as OwedBook) |
| Supabase | DEV `yrsuwikjnbmvpznrgydb` (shared with localhost) |

### Runtime secrets (Secret Manager → `--set-secrets`, runtime SA only)

| Env var | Secret | Value comes from |
|---|---|---|
| `SUPABASE_SECRET_KEY` | `cyph-payment-alpha-supabase-secret-key` | `upload-secrets.sh` |
| `STRIPE_SECRET_KEY` (sandbox, `sk_test_`/`rk_test_` enforced by code) | `cyph-payment-alpha-stripe-secret-key` | `upload-secrets.sh` |
| `RESEND_API_KEY` | `cyph-payment-alpha-resend-api-key` | `upload-secrets.sh` |
| `STRIPE_EXPECTED_ACCOUNT` (identifier) | `cyph-payment-alpha-stripe-expected-account` | `upload-secrets.sh` |
| `STRIPE_PRICE_STORES` (identifier) | `cyph-payment-alpha-stripe-price-stores` | `upload-secrets.sh` |
| `STRIPE_PORTAL_CONFIGURATION` (identifier) | `cyph-payment-alpha-stripe-portal-configuration` | `upload-secrets.sh` |
| `STRIPE_WEBHOOK_SECRET` | `cyph-payment-alpha-stripe-webhook-secret` | **by hand, step A3** (never the local Stripe CLI secret) |

## Before deployment approval

- [x] Alpha origins in `src/lib/appIdentity.ts` + `src/__tests__/alpha-origins.test.ts` (matches OwedBook's table)
- [x] Typecheck, Jest, lint, script parse, YAML, upload boundary, canary, local Docker build (results in the report)
- [x] Cloud read-only checks — all pass (2026-11-21, after Tony's login)
- [x] Next.js and `eslint-config-next` 16.4.3 → 16.4.5 (Director, 2026-11-21); the `next` advisory no longer appears in `npm audit`
- [x] Decision (Director, 2026-11-21): zod 4 migration DEFERRED for alpha, as on OwedBook. GHSA-mrhx-c7xc-m3w5 stays OPEN (`agent_docs/KIP_REGISTRY.md` KIP-1); required before production
- [x] Decision (Director, 2026-11-21): the three Stripe identifiers stay in Secret Manager
- [x] Decision (Director, 2026-11-21): `APA_PROMOTION_CODES` not set; no APA code accepted on alpha until one is verified
- [ ] JARVIS review
- [x] Changes committed on the branch (Tony; HEAD `6dd3de7`)
- [x] Deployment approved by Tony (2026-11-21)

## Pre-flight evidence

- [x] DNS: `cyph-v1-payment-alpha.cyberizedev.com CNAME ghs.googlehosted.com.` (public DNS 8.8.8.8, 2026-11-21) — EVIDENCE
- [x] Upload boundary clean (270 files, no env or credential file); required build inputs present — EVIDENCE
- [x] Account `moose@cyberizegroup.com` and project `cyberize-nextjs-staging` (ACTIVE) match config — EVIDENCE 2026-11-21
- [x] APIs enabled (cloudbuild, run, artifactregistry, secretmanager, iam) — EVIDENCE
- [x] Artifact Registry `cloud-run-source-deploy` in us-east1 — EVIDENCE
- [x] Build SA `524380376459-compute@developer.gserviceaccount.com` (resolved) holds `roles/run.admin` — EVIDENCE
- [x] Build SA may act as service accounts (`roles/editor` includes `iam.serviceAccounts.actAs`) — EVIDENCE by role content; rechecked by init
- [x] No existing service, secret, service account, image or domain mapping with the alpha names — EVIDENCE
- Cloud Scheduler API is NOT enabled in the project (matters only for the later scheduler step)

## Stage A — Base service (this skill, after approval)

- [x] **A1** `./init-app.sh` (agent, 2026-11-21, commit `6dd3de7`): exit 0 on the first run; 7 secrets created EMPTY, runtime SA created, 7 accessor bindings, act-as check ✅
- [x] **A2** `./upload-secrets.sh` (Tony, 2026-11-21): all 6 uploaded; each has ENABLED version 1 (metadata read back by the agent)
- [x] **A3** Webhook signing secret (Tony, 2026-11-21): sandbox endpoint `cyph-v1-payment-alpha` created (7 events, snapshot payload, API version `2025-01-27.acacia`; the handler uses the payload as a pointer only); secret stored, ENABLED version 1 (metadata). Value not verifiable until a signed delivery. Steps followed:
  1. Stripe **sandbox** dashboard (the account in `STRIPE_EXPECTED_ACCOUNT`) → Developers → Webhooks → add an endpoint:
     URL `https://cyph-v1-payment-alpha.cyberizedev.com/api/webhooks/stripe`; events
     `checkout.session.completed`, `checkout.session.expired`, `invoice.paid`, `invoice.payment_failed`,
     `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
  2. Reveal that endpoint's signing secret (`whsec_…`). It is a different value from the one `stripe listen` prints.
  3. Store it (the value is typed into a hidden prompt, never shown or saved to a file):
     ```
     read -rsp 'Paste the alpha whsec_ value, then Enter: ' V && printf '%s' "$V" | gcloud secrets versions add cyph-payment-alpha-stripe-webhook-secret --data-file=- --project cyberize-nextjs-staging --quiet; unset V
     ```
  4. **One consumer:** stop the local `stripe listen` and any local Portal pointed at DEV while alpha is the consumer.
  - The endpoint URL is known before the deploy, so A3 comes before A4. Deliveries fail until the domain is live; Stripe retries.
  - Without this secret the app rejects every Stripe call ("stripe configuration names missing"), not only webhooks, and `deploy.sh` refuses to run.
- [x] Every secret has an ENABLED version (metadata only, 2026-11-21)
- [x] IAM: runtime SA is the only accessor on all 7 (read back 2026-11-21; build SA: not needed)
- [x] **A4** `./deploy.sh` exit 0 from a CLEAN tree (approved by Tony 2026-11-21); "Setting IAM Policy … done", no failure warning — build ID: `ebbd4a02-3d79-4ce4-9a12-2b4afe5f6e48` (SUCCESS, 4m29s)
- [x] Source revision (full SHA, no `-dirty`): `6dd3de737acacff9685c0c2027246bf396f10c1d`
- [x] Image tag: `6dd3de737aca-20261121t042632z` · Image digest (read back from the service): `sha256:0b1792918f0d2200deeb98688d42b479708d5f6c752862b2d3a0907b2aa5da1c`
- [x] Revision `cyph-v1-payment-alpha-00001-mwh`; runtime SA, port 3000, max 1 instance, 1Gi, 7 secret references and 5 plain settings read back as configured
- [x] `allUsers` holds `roles/run.invoker` (read back)
- [x] run.app URL: `https://cyph-v1-payment-alpha-hr465ynfuq-ue.a.run.app` — `/` 307 → `/register/plan`; `/login` 200; `/dashboard` 307 → `/login`; `/api/build-info` shows `app: "pp"` and the same revision
- [x] Unsigned webhook POST → 400 `invalid_signature`; jobs route without token → 404
- [x] Log: Next.js 16.4.5, `Network: http://0.0.0.0:3000`, no error lines
- [x] Existing services unchanged: all six on the revisions recorded before the deploy
- Sign-in is NOT expected to work on run.app: the app accepts only its configured origin.

## Stage B — Final domain (operator-led, outside this skill)

- [x] Cloud Run domain mapping `cyph-v1-payment-alpha.cyberizedev.com` → `cyph-v1-payment-alpha` created 2026-11-21 (Tony approved); Google expects CNAME → `ghs.googlehosted.com.`, public DNS matches
- [x] Certificate issued; HTTPS answers (2026-11-21: Google Trust Services WR3, verify ok, expires 2027-02-19; `/login` 200; `/api/build-info` shows `6dd3de7`; http redirects to https)
- [x] Signed Stripe delivery to the alpha endpoint returned 200 (2026-11-21, event `evt_1Udj4FGnEQDyu3RRJuC5BlLE` resent to `we_1Ue5gQGnEQDyu3RRYxHdqat8`): signature accepted. Business outcome (duplicate / processed / ignored) not identified — `agent_docs/RESPONSES/response_2026-11-21_110610_payment-alpha-webhook-delivery.md`

## Stage C — Two-app integration (PENDING — not started, not passed)

- [ ] Supabase Auth (DEV): redirect allow-list admits `https://cyph-v1-payment-alpha.cyberizedev.com/api/auth/confirm` and the OwedBook alpha one; Site URL; email templates — Director, one session
- [ ] Sign-in and emailed access links on both alpha hosts
- [ ] Handoff OwedBook → Portal and Portal → OwedBook
- [ ] First-store purchase, Add Store, billing portal, undo cancel (Stripe sandbox)
- [ ] Billing notice received (Resend) — needs the scheduler or a manual job run
- [ ] App certification on the final URLs (a successful deploy is not Gate D)

## Scheduler (NOT created, NOT enabled)

- **Needed for:** Add Store expiry and abandon, stalled lifecycle reconciliation, removal and transfer finalize, transfer hold expiry, due billing notices. Route `POST /api/internal/jobs/run`, about every minute, `Authorization: Bearer sha256(SUPABASE_SECRET_KEY + ":apbm007a-operator-v1")`; anything else gets 404.
- **Until it exists:** those jobs do not run on alpha. One manual run: `node scripts/apbm007b/jobs-run.mjs --base https://cyph-v1-payment-alpha.cyberizedev.com --once` (works only if alpha's Supabase key equals the one in `.env.local`).
- **Duplicate processing:** localhost and alpha share the DEV database. Run exactly ONE runner: before enabling a Cloud Scheduler job, stop every local `jobs-run.mjs --every` loop; never run both. Set the job to no retries and keep `max-instances 1`.
- **Proposed job (separate approval):** Cloud Scheduler `cyph-payment-alpha-jobs`, us-east1, `* * * * *`, POST to the alpha URL, the derived token as a header. The token is stored in the job definition and also opens the operator routes; rotating the Supabase key changes it.

## Day two

Code change → commit → `./deploy.sh`. New env var or secret → edit `stark-deploy.yaml` → run the skill again → upload any new secret value with the helper. Rotating the Stripe endpoint secret → repeat step A3 and redeploy.
