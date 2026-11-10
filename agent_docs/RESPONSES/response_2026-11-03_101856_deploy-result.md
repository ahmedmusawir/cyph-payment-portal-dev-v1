# next-deploy-auto v1.3 — Round 2 deployment result

Logged: response_2026-11-03_101856_deploy-result.md
Plan: `response_2026-11-03_095928_auto-plan.md` · Approved by Tony 10:11 (Asia/Dhaka), conditional on a clean upload check; scope extended by Tony to domain mapping + DNS match + HTTPS readiness.
Status: **DEPLOYED on run.app (complete). Custom domain: mapped, certificate PENDING (partial until HTTPS answers).** Not Gate D.

## On-screen summary (as shown)

**DEPLOYED — `cyph-sub-portal-prod`**
LIVE NOW: https://cyph-sub-portal-prod-hr465ynfuq-ue.a.run.app (a fresh run.app URL may trigger a Chrome Safe-Browsing warning; that's not an app defect)
Access: PUBLIC, verified by reading back the policy
Secrets: none configured
Build ID: d33f2b18-4141-4275-9225-22878b39d253
Domain: cyph-payment.cyberizedev.com mapped; DNS matches; certificate pending, watcher running

## Evidence

| Check | Result | Label |
|---|---|---|
| Upload boundary (Phase 2) | listing succeeded; 159 files; no `.env*`/credential files; `agent_docs/`, `e2e/`, `node_modules/`, `.next/` absent; required inputs present | EVIDENCE |
| Upload boundary (deploy.sh guard) | "Upload boundary clean (159 files…)" | EVIDENCE |
| Parse checks | `bash -n` deploy.sh/init-app.sh OK; template braces clean; cloudbuild.yaml parses | EVIDENCE |
| init-app.sh | exit 0; APIs + AR verified; Actor B `524380376459-compute@developer.gserviceaccount.com` resolved via lookup, holds `roles/run.admin`; runtime SA `sa-cyph-sub-portal-runtime` **created** | EVIDENCE |
| Secrets / IAM matrix | n/a: zero secrets | EVIDENCE (config) |
| Cloud Build | `d33f2b18-4141-4275-9225-22878b39d253`, SUCCESS, 3m6s, 3 steps; image digest `sha256:e36a2fde…d902d6` | EVIDENCE |
| Deploy step | "Setting IAM Policy…done"; no "Setting IAM policy failed" warning; revision `cyph-sub-portal-prod-00001-jc5` serving 100% | EVIDENCE |
| deploy.sh exit | 0 | EVIDENCE |
| Runtime identity (Actor C) | service runs as `sa-cyph-sub-portal-runtime@cyberize-nextjs-staging.iam.gserviceaccount.com` | EVIDENCE |
| Invoker policy read-back | `allUsers` → `roles/run.invoker` = `access.invoker: public` | EVIDENCE |
| Smoke test (both run.app URL forms) | `/` 307 → `/demo/register/plan` (200); `/login` 200; `/dashboard` 307 → `/login` (auth guard) | EVIDENCE |
| Page title | "Cyber Pharma — Subscription Portal" | EVIDENCE |
| Logs | last 30 lines: no error/fail/exception | EVIDENCE |
| Domain verification | `cyberizedev.com` user-verified for the active account | EVIDENCE |
| Domain mapping | created (exit 0): `cyph-payment.cyberizedev.com` → `cyph-sub-portal-prod`, us-east1; `DomainRoutable: True` | EVIDENCE |
| DNS vs Google's request | Google requests `cyph-payment CNAME ghs.googlehosted.com.`; public DNS (dns.google) returns exactly that | EVIDENCE |
| Certificate | `Ready: Unknown, reason CertificatePending`; `CertificateProvisioned: Unknown`; HTTPS on custom domain not answering yet (curl exit 35) | EVIDENCE: pending |

## Cloud changes made
1. Service account `sa-cyph-sub-portal-runtime` (init-app.sh).
2. Cloud Build `d33f2b18…` → image `us-east1-docker.pkg.dev/cyberize-nextjs-staging/cloud-run-source-deploy/cyph-sub-portal-prod:latest`.
3. Cloud Run service `cyph-sub-portal-prod` (new), `allUsers` invoker.
4. Domain mapping `cyph-payment.cyberizedev.com` → `cyph-sub-portal-prod` (operator-authorized extension).
OwedBook (`cyber-pharma-prod`) and Mission Control (`cyph-mission-ctrl-prod`) were not touched.

Local side effects: gcloud config `core/project` = cyberize-nextjs-staging (already set), `run/region` = us-east1 (set by init-app.sh).

## Files generated / changed (uncommitted; Git is Tony's)
`Dockerfile`, `cloudbuild.yaml`, `deploy.sh`, `init-app.sh`, `DEPLOYMENT_CHECKLIST.md` (regenerated from the stubs), `.gcloudignore` (new), `.dockerignore` (merged; existing rules kept), `stark-deploy.yaml` (new), plus bookkeeping under `agent_docs/` and RECOVERY.md.

## Not done
- HTTPS certificate: pending; background watcher polling every 2 min for up to 60 min.
- Supabase Auth redirect allowlist: deferred by Tony (email/password login).
- Gate D / final-URL certification: separate. A successful deploy is not Gate D.
- Broken shortcuts in `agent_docs/.claude/skills/`: untouched, as instructed.

## Day two
Code change → `./deploy.sh`. New env var or secret → edit `stark-deploy.yaml` → run the skill again.

## Update 10:33 (Asia/Dhaka) — HTTPS ready
| Check | Result | Label |
|---|---|---|
| Mapping conditions | Ready True, CertificateProvisioned True (04:27:37Z), DomainRoutable True | EVIDENCE |
| Certificate | CN=cyph-payment.cyberizedev.com, issuer Google Trust Services WR3, valid to 2027-02-01 | EVIDENCE |
| Custom-domain smoke | `/` 307 → `/demo/register/plan` (200); `/login` 200; `/dashboard` 307 → `/login` | EVIDENCE |

Status now: **DEPLOYED and reachable at https://cyph-payment.cyberizedev.com.** Not Gate D. Supabase redirect allowlist still deferred.
