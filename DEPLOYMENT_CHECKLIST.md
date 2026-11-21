# Deployment Checklist — Payment Portal Alpha (run record)

Generated 2026-11-21 by next-deploy-auto v1.3, with the OwedBook alpha review fixes carried over.
**Status: PREPARED. Nothing deployed, no cloud resource created or changed, nothing committed.**
Evidence: `agent_docs/RESPONSES/response_2026-11-21_090051_payment-alpha-deploy-prep.md`.
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
- [ ] Changes committed on the branch (Tony). `deploy.sh` aborts on an uncommitted tree by design
- [ ] Deployment approved by Tony

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

- [ ] **A1** `./init-app.sh` (agent): 7 secrets created EMPTY, runtime SA created, 7 accessor bindings, act-as check ✅
- [ ] **A2** `./upload-secrets.sh` (Tony): 6 values from `.env.local`. Tony says "secrets done"
- [ ] **A3** Webhook signing secret (Tony), in this order:
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
- [ ] Every secret has an ENABLED version (metadata only)
- [ ] IAM: runtime SA holds `secretAccessor` on all 7 (build SA: not needed)
- [ ] **A4** `./deploy.sh` exit 0 from a CLEAN tree, no "Setting IAM policy failed" — build ID: ______
- [ ] Source revision (full SHA, no `-dirty`): ______
- [ ] Image tag: ______ · Image digest (read back from the service): ______
- [ ] `allUsers` holds `roles/run.invoker` (read back)
- [ ] run.app URL: ______ — `/` answers; `/api/build-info` shows `app: "pp"` and the same revision
- [ ] Existing services unchanged (`cyph-sub-portal-prod`, `cyph-v1-owedbook-alpha`, the others): same revisions as before
- Sign-in is NOT expected to work on run.app: the app accepts only its configured origin.

## Stage B — Final domain (operator-led, outside this skill)

- [ ] Cloud Run domain mapping `cyph-v1-payment-alpha.cyberizedev.com` → `cyph-v1-payment-alpha`; Google's expected record matches DNS
- [ ] Certificate issued; HTTPS answers; `/api/build-info` on the alpha host
- [ ] Stripe test webhook delivery to the alpha endpoint returns 2xx (signature accepted)

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
