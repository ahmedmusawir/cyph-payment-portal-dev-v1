# next-deploy-auto v1.3 — Round 2, Phase 1 validation + deployment plan

Logged: response_2026-11-03_095928_auto-plan.md
Status: **PENDING APPROVAL.** Nothing generated, no cloud change, no Git action. All checks below are read-only.

## On-screen approval summary (as shown)

Deploy the CyPh payment portal to **cyberize-nextjs-staging / us-east1** as a new Cloud Run service **cyph-sub-portal-prod**, signed in as moose@cyberizegroup.com.
- Access: **public**. The app's own login still guards the account pages.
- App URL baked into the build: https://cyph-payment.cyberizedev.com. One deploy is enough.
- Creates: runtime service account sa-cyph-sub-portal-runtime. No secrets, so you don't run an upload step.
- Writes: Dockerfile, cloudbuild.yaml, deploy.sh, init-app.sh, DEPLOYMENT_CHECKLIST.md (replacing the stubs), plus a new .gcloudignore. .dockerignore is merged and its existing rules are kept.
- Existing OwedBook and Mission Control services will remain untouched.
- Heads-up: the pre-upload file check can't pass yet (details below). The new .gcloudignore should fix it, and I stop before uploading anything if it doesn't.

Approve deployment to this target?

## 1. Config (schema-validated)

| Field | Value | Label |
|---|---|---|
| app.name | `cyph-sub-portal` (runtime SA ID 26/30 chars) | CLAIM → schema CLEAN |
| gcp.project_id / region | `cyberize-nextjs-staging` / `us-east1` | CLAIM (Tony) → EVIDENCE project ACTIVE, #524380376459 |
| gcp.expected_account | `moose@cyberizegroup.com` | EVIDENCE: active account matches |
| service | `cyph-sub-portal-prod` (default) | derived |
| urls.custom_domain | `cyph-payment.cyberizedev.com` → `NEXT_PUBLIC_APP_URL` baked; two-deploy waived | CLAIM (Tony) |
| access.invoker | `public` → `--allow-unauthenticated` | CLAIM (Tony, chat; filled by agent) |
| secrets.items | `[]` → no Secret Manager secrets, no upload helper, no secret IAM bindings | EVIDENCE (SUPABASE_SECRET_KEY unreachable: `admin.ts` not imported) |
| public_vars | `NEXT_PUBLIC_SUPABASE_URL` = `https://yrsuwikjnbmvpznrgydb.supabase.co`; `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_8Fv…k1S`; `NEXT_PUBLIC_SITE_URL` = `https://cyph-payment.cyberizedev.com` | CLAIM (Tony); placeholder scan CLEAN |
| runtime | 1Gi, max 1, min 0, dynamic_env_access auto → off | EVIDENCE (no `process.env[`) |

Correction recorded: the agent earlier called `cyber-pharma-prod` "the payment portal". Tony: this app IS the payment portal; `cyber-pharma-prod` (cyber-pharma.cyberizedev.com) is OwedBook; `cyph-mission-ctrl-prod` is Mission Control.

## 2. Repo evidence

| Check | Result | Label |
|---|---|---|
| Gate 1 standalone | `next.config.js:3 output: "standalone"` | EVIDENCE |
| Gate 2 Node | next ^16.2.1, no engines → `node:22-alpine` | EVIDENCE |
| Env reads vs config | code reads exactly the 3 public vars + `SUPABASE_SECRET_KEY` (unreachable); config lists the 3 public vars | EVIDENCE |
| Reverse check | nothing unlisted except `SUPABASE_SECRET_KEY` (documented omission) | EVIDENCE |
| Dynamic env | none | EVIDENCE |
| `.gitignore` .env | line 33 `.env*.local` (does not cover `.env.example`) | EVIDENCE |
| Source | `main` @ `abbbcc8`; no product path changed since Gate Q-bound `f272617` | EVIDENCE |

## 3. Cloud evidence (read-only)

| Check | Result | Label |
|---|---|---|
| Active account | `moose@cyberizegroup.com` = expected | EVIDENCE |
| Project | `cyberize-nextjs-staging 524380376459 ACTIVE` | EVIDENCE |
| APIs | run, cloudbuild, artifactregistry, secretmanager, iam enabled | EVIDENCE |
| Artifact Registry | `cloud-run-source-deploy` (us-east1) exists | EVIDENCE |
| Build SA (Actor B) | `gcloud builds get-default-service-account` → `524380376459-compute@developer.gserviceaccount.com`; cloudbuild.yaml will have no `serviceAccount:` | EVIDENCE (lookup, not inferred) |
| Staging Rule | Actor B holds `roles/run.admin` (also `roles/editor`) | EVIDENCE |
| Secrets `cyph-sub-portal*` | none | EVIDENCE |
| Runtime SA (Actor C) `sa-cyph-sub-portal-runtime` | NOT_FOUND → **will create** (init-app.sh) | EVIDENCE |
| Service `cyph-sub-portal-prod` | not found → **will create** | EVIDENCE |
| Other services | `cyber-pharma-prod` (OwedBook), `cyph-mission-ctrl-prod` (Mission Control) — not modified | EVIDENCE |
| DNS | `cyph-payment.cyberizedev.com CNAME ghs.googlehosted.com.` via dns.google (TTL 3600); local `dig` returned empty (likely cached negative answer) | EVIDENCE |
| Domain mapping `cyph-payment.cyberizedev.com` | NOT_FOUND (us-east1). Existing mappings: cyber-pharma.cyberizedev.com, mission-portal.cyberizedev.com | EVIDENCE |
| **Upload boundary** | `gcloud meta list-files-for-upload .` **CRASHED**: `FileNotFoundError ./agent_docs/.claude/skills/skill-creator` — three dangling symlinks (`skill-creator`, `frontend-design`, `webapp-testing`) point to `C:/home/moose/.claude/...` paths. The partial list before the crash includes `.env.example` and `agent_docs/*`. | **GAP (fail closed)** |

### Upload boundary resolution (planned, Phase 2)
No `.gcloudignore` exists, so gcloud mirrors `.gitignore`. Phase 2 creates `.gcloudignore` from the UPLOAD_BOUNDARY.md baseline (`#!include:.gitignore`, `.env*`, `**/.env*`, credential patterns, `.auth/`, test output, `agent_docs/`, `_SKILLS/`) plus `e2e/` (not a build input: build type-checks via `tsconfig` `**/*.ts`, and absence of e2e files does not break it). Excluding `agent_docs/` should stop gcloud from descending into the dangling symlinks. The listing is then re-run; **it must succeed and be clean, or the run stops before init/deploy.** Symlinks are not touched (not deployment files).

## 4. Files (Phase 2)

| File | Action |
|---|---|
| `Dockerfile` | regenerate (Template 1); Stage 2 ARGs: 3 public vars + `NEXT_PUBLIC_APP_URL`; no build-time secrets |
| `.dockerignore` | merge Template 1b into existing; keep all current exclusions (`.auth/`, `e2e/`, test output, `agent_docs/`, `_SKILLS/`, `.env*`). The existing `!.env.example` negation is moot for the cloud build (`.gcloudignore` keeps the file out of the upload) |
| `.gcloudignore` | create (UPLOAD_BOUNDARY.md + `e2e/`) |
| `cloudbuild.yaml` | regenerate, Template 2B (no build secrets); `--allow-unauthenticated`; no `--set-secrets`; no `--set-env-vars` |
| `deploy.sh` | regenerate (Template 3); `NEXT_PUBLIC_APP_URL=https://cyph-payment.cyberizedev.com` + 3 public vars; placeholder + upload guards |
| `init-app.sh` | regenerate (Template 4 AUTO); zero secrets; creates runtime SA; verifies infra + Staging Rule |
| `upload-secrets.sh` | **not generated** (zero secrets) |
| `DEPLOYMENT_CHECKLIST.md` | regenerate (Template 5) as run record |

## 5. Cloud effects after approval
1. `./init-app.sh`: create service account `sa-cyph-sub-portal-runtime`; no secrets, no secret bindings.
2. Announce, then `./deploy.sh`: Cloud Build (Actor B) builds and pushes `us-east1-docker.pkg.dev/cyberize-nextjs-staging/cloud-run-source-deploy/cyph-sub-portal-prod:latest`, deploys the new service as Actor C, sets `allUsers` → `roles/run.invoker`.
3. Read-back: invoker policy has `allUsers`; curl on the run.app URL returns 200/3xx.

## 6. Not done by this skill
Cloud Run domain mapping for `cyph-payment.cyberizedev.com`, HTTPS certificate wait, final-URL verification, Gate D. DNS CNAME already exists (Tony). Mapping can be walked through after deploy on request.

## 7. Risks
- R1: this app shares Supabase project `yrsuwikjnbmvpznrgydb` with the earlier deploy Tony referenced (shared users/data). CLAIM — Tony's choice.
- R2: Supabase Auth redirect URLs must allow `https://cyph-payment.cyberizedev.com` for email-confirm/login flows on the final domain. GAP — not checkable from here.
- R3: until the domain mapping is live, the app runs on run.app while `NEXT_PUBLIC_APP_URL`/`SITE_URL` point at the custom domain. Cookies are Secure (https), which works on run.app.

Recovery: config filled + validated · plan pending approval · source `abbbcc8` · next: Tony approves → Phase 2.
