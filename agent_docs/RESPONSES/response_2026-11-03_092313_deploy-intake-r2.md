# next-deploy-auto v1.3 — Round 2, Phase 0 recon + config intake

Logged: response_2026-11-03_092313_deploy-intake-r2.md
Skill: `agent_docs/SKILLS/nextjs-cloud-deploy-agent-skill/` v1.3 (CLAUDE.md, SKILL.md, STARTUP.md, CONFIG_SCHEMA.md, UPLOAD_BOUNDARY.md, ANTI_PATTERNS.md read; AGENTS.md is byte-identical to CLAUDE.md, verified with `diff -q`).
Status: **intake only.** Root config created (STARTUP §2 exception). No deployment files generated, no cloud change, no Git action. Round 1 answers were not carried over (none had been supplied).

## On-screen intake (as shown)

Config: /home/moose/NEXTJS/CYBER_PHARMA/cyph-stripe-subscription-portal-v1/stark-deploy.yaml
Fill in the blanks marked REQUIRED FROM YOU (inline comments explain each):
- gcp.project_id: target project. Your gcloud default is cyberize-nextjs-staging; type it only if that is the target.
- access.invoker: public (anyone with the URL reaches the app; its login still guards account pages) or private (403 until you grant access).
- public_vars NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: public values for the Supabase project the deployed app should use. Never the secret key.
Optional: urls.custom_domain (blank = placeholder deploy, then a second deploy). PROPOSED values (app name cyph-sub-portal, account, site URL) are editable.
Login: ready.
Save the config and say config ready. I will validate it and show the deployment summary.

## Evidence

| Item | Finding | Label |
|---|---|---|
| App | repo root `cyph-stripe-subscription-portal-v1` | EVIDENCE |
| Source | `main` @ `abbbcc88ba4c314d70b0efbdab09a18503864d11`; local changes are bookkeeping only (RECOVERY.md, session file, responses, ledger) plus Tony's v1.3 skill overlay under `agent_docs/SKILLS/` | EVIDENCE |
| Inputs vs Gate Q binding | `git diff --name-only f272617 HEAD` outside `agent_docs/`, `CHANGELOG.md`, `RECOVERY.md`, `_SKILLS/`: none | EVIDENCE |
| Next / Node | `next ^16.2.1`, `react ^19.2.4`, no `engines`; Dockerfile floor `node:22-alpine` | EVIDENCE |
| Gate 1 standalone | `next.config.js:3 output: "standalone"` | EVIDENCE |
| Config | `stark-deploy.yaml` absent → created from template; YAML parses; runtime SA ID `sa-cyph-sub-portal-runtime` = 26 chars (≤30) | EVIDENCE |
| Existing deploy files | `Dockerfile`, `.dockerignore`, `cloudbuild.yaml`, `deploy.sh`, `init-app.sh`, `DEPLOYMENT_CHECKLIST.md` present (fail-safe stubs); `.gcloudignore`, `upload-secrets.sh` absent. Phase 2 regenerates the deploy files from templates and merges both ignore files. | EVIDENCE |
| gcloud | SDK 554.0.0; active `moose@cyberizegroup.com`; access token valid (`print-access-token` exit 0) | EVIDENCE |
| gcloud default project | `cyberize-nextjs-staging` (round 1 showed `ninth-potion-455712-g9`; changed between rounds) | EVIDENCE — **candidate only**, not confirmed as target |
| Candidate project access | `projects describe`: `cyberize-nextjs-staging 524380376459 ACTIVE`; Cloud Run services `cyber-pharma-prod`, `cyph-mission-ctrl-prod` (us-east1); no `cyph-sub-portal-prod` | EVIDENCE |
| Env names read by app source | `NEXT_PUBLIC_SUPABASE_URL` (6), `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (5), `NEXT_PUBLIC_SITE_URL` (3), `SUPABASE_SECRET_KEY` (3, incl. jest setup) | EVIDENCE |
| `SUPABASE_SECRET_KEY` | Read in `src/utils/supabase/admin.ts:16` and `src/__tests__/jest.setup.ts`; no file imports `supabase/admin` → unreachable at runtime → omitted from `secrets.items`, documented in YAML comment | EVIDENCE (grep) / INFERENCE (unreachable) |
| `NEXT_PUBLIC_SITE_URL` | Only use: `server.ts:7-8` decides the cookie `secure` flag (`startsWith("https://")`) → proposed `https://pending-initial-deploy` | EVIDENCE |
| Dynamic env access | no `process.env[` reads | EVIDENCE |
| `.env*` files | `.env.example` (tracked), `.env.local`, `.env.qa.local` — names only; contents not opened | EVIDENCE |
| `.gitignore` | covers `.env*.local`, `*.pem`, `/.auth/`, test output; does NOT cover `.env.example` | EVIDENCE |
| `.dockerignore` | existing stronger rules incl. `.env*` with `!.env.example` negation, `.auth/`, `e2e/`, test output, `agent_docs/`, `_SKILLS/` — to be preserved in Phase 2 merge; the `!.env.example` negation needs a decision then (UPLOAD_BOUNDARY: negation semantics) | EVIDENCE |
| Upload boundary today | no `.gcloudignore` → gcloud mirrors `.gitignore` → tracked `.env.example` would be in the upload → would breach the `.env*` check. Resolved by v1.3: Phase 2 creates `.gcloudignore` from UPLOAD_BOUNDARY.md baseline (`.env*`, `**/.env*`). `list-files-for-upload` not run yet (Phase 1.3 / Phase 2). | EVIDENCE / GAP |
| `tsconfig.json` | `include: **/*.ts` (so e2e/*.ts and playwright.config.ts are type-checked if uploaded); excludes `agent_docs/**`, `_SKILLS/**` — note for Phase 2 e2e exclusion decision | EVIDENCE |

## Config fields

| Field | State | Basis |
|---|---|---|
| `app.name` | PROPOSED `cyph-sub-portal` | repo name; within 19-char bound |
| `app.display_name` | PROPOSED | — |
| `gcp.project_id` | **REQUIRED FROM YOU** | candidate `cyberize-nextjs-staging` noted in comment only |
| `gcp.region` | `us-east1` | schema default; matches existing services |
| `gcp.expected_account` | PROPOSED `moose@cyberizegroup.com` | active login |
| `gcp.service_name` | blank → `cyph-sub-portal-prod` | schema default |
| `urls.custom_domain` | optional, blank | two-deploy pattern if left blank |
| `urls.backend_url` | blank | not read by code |
| `access.invoker` | **REQUIRED FROM YOU** | no default by design |
| `secrets.items` | `[]` | see SUPABASE_SECRET_KEY row |
| `public_vars` SUPABASE_URL, PUBLISHABLE_KEY | **REQUIRED FROM YOU** | values never read from .env |
| `public_vars` SITE_URL | PROPOSED `https://pending-initial-deploy` | only drives Secure cookies |
| `runtime` | schema defaults | no dynamic reads |

## Next
Operator fills the config and says "config ready" → Phase 1 (schema, repo, cloud Truth Commands incl. build SA lookup, Staging Rule, `list-files-for-upload`) → plan artifact → concise approval summary. Config ready is not deployment approval.

Recovery: config created, unfilled · target unconfirmed · source `abbbcc8` · last completed: Phase 0 · next: operator fills config.
