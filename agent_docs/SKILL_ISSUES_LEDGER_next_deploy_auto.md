# Skill Issues Ledger — next-deploy-auto

One row per issue, written when it happens (CLAUDE.md §4.12).

| # | Date (Asia/Dhaka) | Phase | Issue | Root cause | Fix (this run) | Skill change needed |
|---|---|---|---|---|---|---|
| 1 | 2026-11-03 08:36 | 0 (intake) | `app.name` regex allows up to 41 chars, but the runtime SA ID `sa-{name}-runtime` must be ≤30 chars, so any name over 19 chars fails in `init-app.sh` | CONFIG_SCHEMA validates the name, not the derived SA ID | Proposed `cyph-sub-portal` (15 chars) | CONFIG_SCHEMA: cap `app.name` at 19 chars or validate the derived SA ID |
| 2 | 2026-11-03 08:36 | 0 (intake) | A tracked, nonsecret `.env.example` with no `.gcloudignore` trips the `(^|/)\.env[^/]*` upload-boundary stop | The pattern intentionally catches the whole `.env*` family; the skill's write boundary excludes `.gcloudignore` and offers no template for it | Operator chooses: add `.gcloudignore` themselves or authorize the agent to write it (override, logged) | Consider a canonical `.gcloudignore` template (with `#!include:.gitignore` + `.env*`) in TEMPLATES.md and the §4.10 write list |
| 3 | 2026-11-03 09:59 | 1.3 | `gcloud meta list-files-for-upload .` crashes (`FileNotFoundError`) on dangling symlinks under `agent_docs/.claude/skills/` (targets `C:/home/moose/...`) | gcloud walks the tree before ignore rules exist; dangling symlinks abort the listing | Fail closed (GAP). Planned `.gcloudignore` excludes `agent_docs/`; re-verify in Phase 2 before any submit. Symlinks not touched | Note dangling-symlink crash in UPLOAD_BOUNDARY.md; suggest `find . -xtype l` precheck |
| 4 | 2026-11-03 09:59 | 1.3 | Phase 1.3 says any upload-boundary hit is a stop, but v1.3 only generates `.gcloudignore` in Phase 2 after approval, so a repo without one always "stops" at 1.3 | Ordering contradiction between SKILL.md 1.3 and STARTUP §5 / UPLOAD_BOUNDARY | Recorded pre-generation state as GAP in plan; Phase 2 check is the gate | SKILL.md 1.3: when `.gcloudignore` is absent/planned, record as GAP resolved by Phase 2 (fail-closed there) |
| 5 | 2026-11-03 10:18 | 3 | `init-app.sh` sets the operator's global gcloud config (`core/project`, `run/region`) as a side effect | Template 4 uses `gcloud config set` | Recorded in report; harmless here (already staging) | Consider `--project`/`--region` flags only, or warn in the plan |
| 6 | 2026-11-03 10:18 | 5–6 | Operator extended scope to domain mapping + cert check (skill §4.13 stops at run.app) | Skill has no in-scope domain step; operator wanted one run | Logged as an operator-authorized override; mapping created, cert watched | Consider an optional, approval-gated Phase 7 (map, DNS match, cert wait) |

Ledger status (round 2): open only for cert readiness; no failures during deploy.

## 2026-11-21 — Payment Portal alpha preparation (`cyph-v1-payment-alpha`)

| # | Date (Asia/Dhaka) | Phase | Issue | Root cause | Fix (this run) | Skill change needed |
|---|---|---|---|---|---|---|
| 7 | 2026-11-21 08:55 | 0 | Plan-approval stop before local generation (§4.3) not applied | Director instructed autonomous preparation with one report | Override logged; deployment approval still required before init | None |
| 8 | 2026-11-21 08:55 | 1.3 | Every cloud Truth Command failed: "Reauthentication failed" | Operator's gcloud token expired | Cloud state recorded as GAP; operator runs `gcloud auth login`; checks rerun before approval | None |
| 9 | 2026-11-21 08:58 | 1 | One secret must NOT come from the env file: `.env.local` holds the local Stripe CLI signing secret, the deployed endpoint needs its own | The helper assumes every secret's value is in one env file | `STRIPE_WEBHOOK_SECRET` left out of the helper mapping (`upload: manual` in the config); hidden-prompt command in the checklist; init reports it separately | Per-item upload mode (helper or manual) in the schema |
| 10 | 2026-11-21 08:58 | 2 | A secret with no enabled version fails the Cloud Run revision only after the whole build | `--set-secrets …:latest` is resolved at deploy | `deploy.sh` checks enabled versions (metadata) before submitting and aborts with the names | Add to Template 3 |
| 11 | 2026-11-21 08:58 | 1 | Non-secret identifiers whose values exist only in the env file (`STRIPE_EXPECTED_ACCOUNT`, `STRIPE_PRICE_STORES`, `STRIPE_PORTAL_CONFIGURATION`) | Schema has secrets and public vars only; the agent may not read the env file | Mapped through Secret Manager so the helper carries them; flagged for JARVIS | Schema: plain runtime values sourced from the env file by the helper |
| 12 | 2026-11-21 08:58 | 2 | Existing `.dockerignore` had `!.env.example`; appending `**/.env*` silently overrides the exception | Negation ordering | Exception removed explicitly and noted in the file | UPLOAD_BOUNDARY.md already warns about negations; no change |

OwedBook alpha ledger (`../cyph-v1-dev/agent_docs/SKILL_ISSUES_LEDGER_next_deploy_auto.md`, 2026-11-20) rows applied here without repeating the failure: service name longer than 19 characters, `runtime_env` and build-identity extensions, `${_REGION}` in every image path, `HOSTNAME=0.0.0.0` and `--port 3000`, unique tag and digest deploy, nested and case-insensitive ignore patterns, act-as check, dirty-source guard, and the pipefail-safe act-as check (`ef4cebc`).
