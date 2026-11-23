# Payment Portal alpha — DEPLOYED, domain live over HTTPS

**Date:** 2026-11-21 (+06) · **Result:** base service DEPLOYED and VERIFIED · domain mapping CREATED · certificate ISSUED · HTTPS answering.
**Not a certification:** sign-in, the Stripe webhook, mail and two-app flows are NOT yet exercised. A successful deploy is not Gate D.

**Final URL: https://cyph-v1-payment-alpha.cyberizedev.com**

## Deployment (EVIDENCE)

| Item | Value |
|---|---|
| Service | `cyph-v1-payment-alpha`, `cyberize-nextjs-staging`, us-east1 |
| Revision | `cyph-v1-payment-alpha-00001-mwh` (ready) |
| run.app URL | `https://cyph-v1-payment-alpha-hr465ynfuq-ue.a.run.app` |
| Source | branch `deploy/payment-alpha-prep`, commit `6dd3de737acacff9685c0c2027246bf396f10c1d`, clean (no `-dirty`) |
| Build | `ebbd4a02-3d79-4ce4-9a12-2b4afe5f6e48`, SUCCESS, 4m29s |
| Image tag | `6dd3de737aca-20261121t042632z` |
| Image digest | `sha256:0b1792918f0d2200deeb98688d42b479708d5f6c752862b2d3a0907b2aa5da1c` — the same in the push step, the build results and the service spec |
| Runtime SA | `sa-cyph-payment-alpha-runtime@cyberize-nextjs-staging.iam.gserviceaccount.com` |
| Container | port 3000; log shows Next.js 16.4.5, `Network: http://0.0.0.0:3000` |
| Sizing | 1Gi, max 1 instance |

## Verification (read back)

- **Access:** `allUsers` holds `roles/run.invoker`; "Setting IAM Policy … done", no failure warning. Matches `access.invoker: public`.
- **Runtime settings:** `NEXT_PUBLIC_SITE_URL` (alpha), `NEXT_PUBLIC_APP_ENV=staging`, `NEXT_PUBLIC_SUPABASE_URL` (DEV), publishable key, `MAIL_RECIPIENT_POLICY=open`. Seven secrets mounted from `cyph-payment-alpha-*:latest`. `APA_PROMOTION_CODES` and the other optional names not set.
- **Build identity:** `/api/build-info` returns `app: "pp"`, revision `6dd3de73…10c1d`, artifact `payment-alpha-6dd3de737aca-20261121t042632z`, on both URLs.
- **HTTP on the alpha domain:** `/` 307 → `/register/plan` · `/login` 200 · `/dashboard` 307 → `/login` · plain http 302 → https.
- **Guards:** unsigned webhook POST → 400 `invalid_signature`; jobs route without a token → 404.
- **Other services:** all six on the revisions recorded before the deploy; untouched.

## Domain (approved by Tony with the deployment)

- Mapping `cyph-v1-payment-alpha.cyberizedev.com` → `cyph-v1-payment-alpha`: `Ready` True, `CertificateProvisioned` True, `DomainRoutable` True.
- Google expects CNAME → `ghs.googlehosted.com.`; public DNS (8.8.8.8) returns exactly that.
- Certificate: subject `cyph-v1-payment-alpha.cyberizedev.com`, issuer Google Trust Services (WR3), verify ok, expires 2027-02-19.

## Cloud resources created today

7 secrets (1 version each, values supplied by Tony) · 1 service account · 7 secret-level IAM bindings · 1 image · 1 Cloud Run service with public invoker · 1 domain mapping. In Stripe (by Tony): 1 sandbox webhook endpoint. Nothing deleted; nothing existing modified.

## Not verified / not done

- **Secret values:** metadata shows a version exists for each, not that it is correct. No Supabase service-role call, Stripe call or Resend call has run yet.
- **Webhook signing secret:** unproven until a signed delivery returns 2xx.
- **Supabase Auth (DEV):** redirect allow-list, Site URL and email templates for the alpha origins — Director, dashboard. Sign-in and emailed links are expected to fail until then.
- **Scheduler:** not created; the Cloud Scheduler API is not enabled. Expiry and billing-notice jobs do not run on alpha.
- **One consumer:** the local `stripe listen` and any local Portal on DEV must stay off while alpha is live.
- **Two-app integration (Stage C):** handoff both ways, purchase, Add Store, billing portal, notices — PENDING.
- **Before external exposure:** Terms, Privacy and support address. **Before production:** zod 4 (KIP-1).
- **JARVIS review** of the prepared files was not recorded before the deploy.
- **Git:** the branch is local; records changed since `6dd3de7` are uncommitted.

## Next steps

1. Stripe sandbox → the `cyph-v1-payment-alpha` endpoint → send a test event (or resend a recent one). 2xx (or `ignored`) proves the signing secret.
2. Supabase Auth settings for both alpha origins (integration step).
3. Authenticated two-app testing.
4. Scheduler decision.
