# next-deploy-auto v1.2 — Phase 0 Discovery + Guided Intake

Logged: response_2026-11-03_083651_deploy-intake.md
Skill: `agent_docs/SKILLS/nextjs-cloud-deploy-agent-skill/` (CLAUDE.md → SKILL.md → references/STARTUP.md, CONFIG_SCHEMA.md, ANTI_PATTERNS.md read)
Status: **intake, not a deployment plan.** Nothing generated; no cloud change. Two things needed from you: a fresh gcloud login and answers to the config questions below.

---

## 1. What I found (Phase 0)

| Item | Finding | Label |
|---|---|---|
| App | repo root `cyph-stripe-subscription-portal-v1` (skill folder is not the app) | EVIDENCE |
| Source | `main` @ `abbbcc88ba4c314d70b0efbdab09a18503864d11` = `origin/main`; only change is the untracked session file | EVIDENCE |
| Inputs vs Gate Q binding | Since `f272617`, the only paths that changed are `CHANGELOG.md`, `RECOVERY.md`, `agent_docs/**` and the `_SKILLS/` move. No product path changed. Gate Q does not carry over automatically, and a deploy is not Gate D. | EVIDENCE (diff names) / INFERENCE (same product bytes) |
| Next / Node | `next ^16.2.1`; no `engines`; Dockerfile floor `node:22-alpine` | EVIDENCE |
| Gate 1 standalone | `next.config.js`: `output: "standalone"` | EVIDENCE |
| `stark-deploy.yaml` | **NOT FOUND** → guided intake (this document) | EVIDENCE |
| Existing deploy files | `Dockerfile`, `.dockerignore`, `cloudbuild.yaml`, `deploy.sh`, `init-app.sh` and `DEPLOYMENT_CHECKLIST.md` exist; four of them are fail-safe stubs ("NOT CONFIGURED", exit 1). In Phase 2, all six are regenerated from the skill templates. | EVIDENCE |
| gcloud | SDK 554.0.0; account `moose@cyberizegroup.com`; config project `ninth-potion-455712-g9` | EVIDENCE |
| gcloud auth | **Token expired**: "Reauthentication failed. cannot prompt during non-interactive execution" | EVIDENCE → you need to log in in a browser |
| Env names read by code | Excluding tests and Playwright: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SECRET_KEY` | EVIDENCE (grep) |
| `SUPABASE_SECRET_KEY` | Read only in `src/utils/supabase/admin.ts`, and **no file imports that module** | EVIDENCE (grep) |
| Dynamic env access | No `process.env[` reads | EVIDENCE |
| Stripe | No `stripe` / `@stripe` import (also asserted by `portal-boundaries.test.ts`); payments are mocked | EVIDENCE / INFERENCE |
| `.env*` files present | `.env.example` (tracked), `.env.local`, `.env.qa.local` (names only; contents not opened) | EVIDENCE |
| `.gitignore` | `.env*.local`, `*.pem` | EVIDENCE |
| `.gcloudignore` | absent → gcloud mirrors `.gitignore` for the upload | EVIDENCE |

## 2. Proposed `stark-deploy.yaml` (nonsecret; not saved yet)

| Field | Proposed value | Basis | Needs you |
|---|---|---|---|
| `app.name` | `cyph-sub-portal` | INFERENCE from the repo name. This gives secrets `cyph-sub-portal-*`, runtime SA `sa-cyph-sub-portal-runtime` and service `cyph-sub-portal-prod`. | **Confirm or rename** (≤19 chars; see ledger row 1) |
| `app.display_name` | `CyPh Subscription Portal v1` | INFERENCE | confirm |
| `gcp.project_id` | — | The gcloud default is `ninth-potion-455712-g9`. The skill example names `cyberize-nextjs-staging`, but examples don't set targets. I won't guess. | **QUESTION** |
| Environment | — | The `-prod` suffix in the service name doesn't make this production | **QUESTION: staging or production?** |
| `gcp.region` | `us-east1` | schema default | confirm |
| `gcp.expected_account` | `moose@cyberizegroup.com` | EVIDENCE: gcloud's configured account | confirm |
| `gcp.service_name` | `""` → `cyph-sub-portal-prod` | schema default | confirm |
| `urls.custom_domain` | — | Known → one deploy. Blank → two deploys (first deploy uses the placeholder; you set the domain or choose run.app, then redeploy). | **QUESTION** |
| `urls.backend_url` | `""` | The code doesn't read `NEXT_PUBLIC_BACKEND_URL` | confirm |
| `access.invoker` | — | No default on purpose. Public registration at `/` and the admin login need browser access, which in practice means **public**. **Private** means nobody can reach it until you grant invoker. | **QUESTION: public or private?** |
| `secrets.mode` / `env_file` | `helper` / `.env.local` | schema defaults (unused if there are zero secrets) | confirm |
| `secrets.items` | `[]` (zero secrets) | `SUPABASE_SECRET_KEY` has no reachable reader because `admin.ts` is never imported. With zero secrets, the upload step is skipped. Alternative: add it as `runtime` for future use. | **QUESTION** |
| `public_vars` NEXT_PUBLIC_SUPABASE_URL | — | You must type the value; I don't read `.env.local`. Which Supabase project serves the deployed app? (This was earlier blocker B2.) | **QUESTION** |
| `public_vars` NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | — | Publishable by design and shipped to the browser. Type the value. | **QUESTION** |
| `public_vars` NEXT_PUBLIC_SITE_URL | same as `NEXT_PUBLIC_APP_URL`: `https://{custom_domain}`, or `https://pending-initial-deploy` if blank | `server.ts` sets secure cookies when this starts with `https://` | confirm |
| `runtime` | `1Gi`, max 1, min 0, `dynamic_env_access: auto` | schema defaults; no dynamic reads | confirm |

## 3. Problems to resolve before the deployment plan

1. **Upload boundary would fail (stop).** There's no `.gcloudignore`, so gcloud mirrors `.gitignore`, which only ignores `.env*.local`. The tracked `.env.example` would therefore be uploaded, and the skill's `(^|/)\.env[^/]*` check treats that as a breach. A `.gcloudignore` is outside the files I may write (§4.10).
   **Choose one:** (a) you add it yourself, or (b) you tell me explicitly to write this file (logged as an override):
   ```
   #!include:.gitignore
   .gcloudignore
   .git
   .env*
   agent_docs/
   _SKILLS/
   e2e/
   .auth/
   ```
   Once a `.gcloudignore` exists, it governs the upload, so it must keep `#!include:.gitignore` (which covers node_modules, .next and test output).
2. **`.dockerignore` would be replaced.** Template 1b is "always, unchanged". The current file also excludes `.auth/`, `test-results/`, `playwright-report/`, `blob-report/` and `e2e/`, which the template lacks; the template adds the deploy files and README. **QUESTION:** use the template as-is (skill rule), or keep those extra lines as an override?
3. **Stub regeneration.** `DEPLOYMENT_CHECKLIST.md` (26 Oct) says "author fresh … with an explicitly approved target". That approval is the deployment-plan APPROVED that comes after this intake.

## 4. Login (operator-run)

RUN THIS (in your own terminal):
```
gcloud auth login
```
What happens: a browser opens and you sign in as `moose@cyberizegroup.com`. I never see a password, code or token.
Stop if you see: a different account selected, or an error printed in the terminal.
When done: say "login done". I'll then recheck the account and run a read-only query against the project you name.

## 5. Next

Once you've given your answers and logged in: I show the final YAML, save it only after you confirm, then run Phase 1 (schema, repo and cloud Truth Commands). I'll write the deployment plan artifact and wait for your typed **APPROVED** before generating any files or changing anything in the cloud. Saving the config or logging in is not deployment approval.

Recovery: config not saved · target unconfirmed · source `abbbcc8` · last completed: Phase 0 · next: intake answers + login.
