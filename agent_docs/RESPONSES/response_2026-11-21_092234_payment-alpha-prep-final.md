# Payment Portal alpha — preparation complete, ready to commit

**Result: preparation is complete. Nothing initialized, nothing deployed, nothing committed.**
Earlier reports: `response_2026-11-21_090051_payment-alpha-deploy-prep.md`, `response_2026-11-21_091323_payment-alpha-cloud-checks.md`.

## 1. What changed in this round

| Item | Result |
|---|---|
| Next.js | `next` and `eslint-config-next` 16.4.3 → **16.4.5**, exact pins as on OwedBook. `package.json` 2 lines; `package-lock.json` changes only the Next.js packages. The `next` advisory no longer appears in `npm audit`. |
| zod | Recorded as an alpha-only deferral in new `agent_docs/KIP_REGISTRY.md` (KIP-1). OPEN for production. |
| Stripe identifiers | Kept in Secret Manager (no change). |
| `APA_PROMOTION_CODES` | Now unset: no APA code is accepted on alpha. Removed from `cloudbuild.yaml`; empty in `stark-deploy.yaml`. |

**zod differs from OwedBook.** OwedBook uses zod only in browser forms. The Portal uses it on the server, on the anonymous registration routes (`src/server/registration.ts`). The advisory page describes the problem in array schemas; the Portal has no array, set, map, record or tuple schema anywhere in `src/`, so that path is not reached. This is an inference from the advisory text and a code search, not a test.

**APA code.** Project records show `APA10SANDBOX` redeemed in the sandbox between 12 and 17 Nov 2026 (effects ledgers with Stripe request IDs). That proves it existed then, not that it is active now, so the allowlist is left empty as instructed. Effect: a tester who enters an APA code gets the generic "not accepted" answer.

## 2. Final check results (on the upgraded tree)

| Check | Result |
|---|---|
| Typecheck | clean |
| Jest | 572/572, 32 suites |
| Lint | 0 errors, 27 warnings |
| `bash -n` on the three scripts; YAML parse | clean |
| `npm ci --dry-run` against the lockfile | consistent |
| `npm audit` | `next` cleared. Production: 1 high (`zod`, deferred), 5 moderate (Tailwind build chain). Full: 1 high, 19 moderate (the rest dev-only) |
| Upload boundary | clean, 270 files |
| `deploy.sh` guards (dry run, nothing submitted) | aborts on the uncommitted tree, as designed |
| Local Docker build | exit 0, Next.js 16.4.5 in the image |
| Image inspection (container not started) | no env or credential file; no secret-shaped string; alpha origins compiled in; old origins absent; no APA code. Image removed. |
| Cloud read-only checks | all pass (see the cloud checks report) |

Not validated: the container was not started locally; the Cloud Build steps run only in the cloud.

## 3. Git commands for Tony

Two commits, so the product change and the deployment files stay separately reviewable.

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
git status --short
```

Commit 1 — product: alpha origins and Next.js 16.4.5

```bash
git add src/lib/appIdentity.ts src/__tests__/alpha-origins.test.ts package.json package-lock.json
git commit -m "feat(alpha): alpha origin pair and Next.js 16.4.5"
```

Commit 2 — deployment files and records

```bash
git add stark-deploy.yaml Dockerfile .dockerignore .gcloudignore cloudbuild.yaml deploy.sh init-app.sh upload-secrets.sh DEPLOYMENT_CHECKLIST.md RECOVERY.md CHANGELOG.md agent_docs/KIP_REGISTRY.md agent_docs/SKILL_ISSUES_LEDGER_next_deploy_auto.md agent_docs/SESSIONS/session_2026-11-21.md agent_docs/RESPONSES/response_2026-11-21_090051_payment-alpha-deploy-prep.md agent_docs/RESPONSES/response_2026-11-21_091323_payment-alpha-cloud-checks.md agent_docs/RESPONSES/response_2026-11-21_092234_payment-alpha-prep-final.md
git commit -m "chore(deploy): prepare Payment Portal alpha Cloud Run deployment"
```

Verify

```bash
git status --short
git log --oneline -3
```

Expected: `git status --short` prints nothing. No push is needed for the deployment; `deploy.sh` reads the local commit.

## 4. After the commit

One step at a time: init (agent, after deployment approval) → `./upload-secrets.sh` (Tony) → Stripe sandbox webhook endpoint and its signing secret (Tony) → deploy (agent).

## 5. Still pending, not passed

Supabase redirect allow-list and email templates; domain mapping and certificate; scheduler (the Cloud Scheduler API is not enabled in the project); authenticated two-app testing; Terms, Privacy and support address before external exposure; Gate D.
