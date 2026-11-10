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
