# Payment Portal alpha — read-only cloud checks (2026-11-21)

**Result: all pre-flight checks pass. No cloud blocker.** Read-only commands only; nothing initialized, nothing deployed.

| Check | Result (EVIDENCE) |
|---|---|
| Active account | `moose@cyberizegroup.com` — matches `gcp.expected_account` |
| Project | `cyberize-nextjs-staging`, number 524380376459, ACTIVE |
| APIs | cloudbuild, run, artifactregistry, secretmanager, iam enabled |
| Artifact Registry | `cloud-run-source-deploy` exists in us-east1 |
| Build identity (resolved) | `524380376459-compute@developer.gserviceaccount.com` |
| Staging Rule | build identity holds `roles/run.admin` |
| Act-as | build identity holds `roles/editor`, which includes `iam.serviceAccounts.actAs` (by role content; `init-app.sh` rechecks on the real runtime SA) |
| Service `cyph-v1-payment-alpha` | does not exist → will be created |
| Runtime SA `sa-cyph-payment-alpha-runtime` | does not exist → will be created |
| Secrets `cyph-payment-alpha-*` | none exist → 7 will be created empty |
| Alpha image | none in the repository |
| Domain mapping for the alpha host | none (`cyph-payment.cyberizedev.com` still maps to `cyph-sub-portal-prod`) |
| Upload boundary | clean, 270 files |

**Existing services (baseline for the "untouched" check after deploy):** `cyber-cms-poc-1-00002-nkx`, `cyber-factory-poc-1-00001-5pb`, `cyber-pharma-prod-00003-cwc`, `cyph-mission-ctrl-prod-00001-l6d`, `cyph-sub-portal-prod-00001-jc5`, `cyph-v1-owedbook-alpha-00001-qrp`.

**Finding for later:** the Cloud Scheduler API is NOT enabled in the project. A scheduler job would first need that API enabled, which is a project-level change and a separate approval. Not needed for the deployment itself.

## Remaining preparation blockers (none is a cloud blocker)

1. Decision: Next.js 16.4.3 → 16.4.5 before the commit.
2. Decision: `zod` high advisory deferred for alpha, as on OwedBook.
3. Confirm: three Stripe identifiers in Secret Manager; `APA_PROMOTION_CODES=APA10SANDBOX`.
4. JARVIS review.
5. Commit by Tony (`deploy.sh` aborts on an uncommitted tree).
6. Deployment approval.
