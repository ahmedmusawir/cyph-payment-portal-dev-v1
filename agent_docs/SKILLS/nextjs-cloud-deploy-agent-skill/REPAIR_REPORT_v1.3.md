# v1.3 — operator experience repair, 2026-11-03

## Why
The first field run exposed a verbose chat interview requiring an interpreter. The replacement contract is: quiet recon; agent prepares one annotated root config; operator fills only unresolved fields and logs in when necessary; agent validates, presents one concise deployment approval, then executes.

## Changed
SKILL.md, CLAUDE.md, AGENTS.md, README.md, references/STARTUP.md, references/CONFIG_SCHEMA.md, references/ANTI_PATTERNS.md, references/TEMPLATES.md and templates/stark-deploy.yaml. Added references/UPLOAD_BOUNDARY.md and this report. Earlier reports remain history.

## Current contract
- First response: maximum 180 words, exact absolute config path, only missing field explanations, login status/action, next action. Full evidence goes in the response file. Material blockers remain visible.
- Create the config scaffold without an extra approval; preserve existing values and comments. Operator edits/saves it. No second approval to save their own inputs.
- Reuse verified login; expired authentication receives one browser-login handoff, then same-session continuation.
- One concise deployment approval (120 words unless material decisions require more), then agent executes within scope.
- Generate/merge .gcloudignore as ordinary approved deployment work; preserve existing Docker/upload exclusions; verify effective upload and required build inputs.
- Limit app.name to 2–19 characters to fit the generated runtime service account ID.
- Zero configured secrets skips empty upload ceremony. Never read private values. Git remains operator-owned.
- Cancellation ends the current round. No previous approval is used to restart it.

## Validation
Local YAML parse checks passed. CLAUDE.md and AGENTS.md byte-identical. Existing generated executable examples and operator helper are unchanged. Runtime SA length at the 19-character app limit is 30. Referenced instruction files exist. An independent walkthrough could not run because review capacity was unavailable; this revision has local instruction/static checks only, not an independent execution pass. No actual cloud commands, application changes, deployment or Gate D certification.

## Install
Overlay the included nextjs-cloud-deploy-agent-skill folder at agent_docs/SKILLS/nextjs-cloud-deploy-agent-skill/. This package includes no application-root stark-deploy.yaml. Leave any current root config in place; the next agent activation must inspect and preserve it. Activate with: Follow agent_docs/SKILLS/nextjs-cloud-deploy-agent-skill/.
