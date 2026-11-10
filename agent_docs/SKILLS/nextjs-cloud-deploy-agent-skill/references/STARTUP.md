# Startup contract v1.3 — inspect, prepare one config, ask briefly, execute

This is an agent-executed deployment skill. The operator supplies intent and values, handles browser login and secret values, and approves the concrete deployment. The agent performs the work. Merely pointing at this folder activates the entire workflow; no interpreter or separate long prompt is required.

## Operator-facing output contract (mandatory)

Keep routine tool output out of the narrative. Read it yourself and save detailed evidence in agent_docs/RESPONSES/. Do not paste recon inventories, IAM matrices, full YAML, tables of every setting, doctrine explanations or proposed commands for work the agent can perform. Do not make the operator read the report to discover a required action.

The first intake response must be at most 180 words (excluding a necessary login command), with only:
- Config: the FULL absolute path to root stark-deploy.yaml.
- Fill in: exact unresolved YAML field names, each with a short plain-English explanation. Include a one-line pointer to the config's inline comments.
- Login: 'ready' or one operator-run browser-login command and a short instruction. If already authenticated to the confirmed project, do not ask again.
- Next: 'Save the config and say config ready. I will validate it and show the deployment summary.'

Put all required edits in the ONE config file. Do not require the operator to copy an email, chat table or a second prompt back into the agent. Present only unresolved fields; omit things already known. If there are more fields, group the paths compactly; put complete explanations next to those fields inside the config. No inline config book. If nothing is missing, skip intake and proceed.

Example first response (values are illustrative, not defaults):

Config: /absolute/app/stark-deploy.yaml
Fill in the blank fields marked REQUIRED FROM YOU:
- gcp.project_id: existing Google Cloud project ID.
- access.invoker: public or private browser access.
- public_vars[].value: Supabase public URL and publishable key; never a private key.
Login: ready.
Save the config and say config ready. I will validate it and show the deployment summary.

## 1. Recon quietly

Read either CLAUDE.md or AGENTS.md, SKILL.md and CONFIG_SCHEMA.md. Locate the app from the supplied path/current repo; do not use the skill directory as the app. Inspect source env names, package/Next config, current full SHA, Git status, existing deploy files, recovery records, active cloud account and project. Exclude .env* contents, dependencies, generated output and agent_docs from env-source scans. Read actual command exit status; do not confuse a configured account with valid authentication or permissions. Never print secrets/tokens.

Do not switch branches, pull, commit, push, discard files, modify application code or run a deployment during intake. For a QA-bound candidate, preserve the accepted decision and inspect the input binding; matching inputs need no routine new QA campaign. Keep deployment infrastructure deltas distinct.

## 2. Prepare root stark-deploy.yaml yourself

If absent, create the config from the bundled template beside package.json immediately. The user's activation authorizes this local setup file and bookkeeping only, not cloud mutations. This is an explicit exception to the pre-plan write restriction. Never overwrite an existing config wholesale.

Populate previously supplied intent and verified app facts. Add schema defaults where safe, source-discovered variable names and short inline comments; mark unresolved fields REQUIRED FROM YOU with empty values. A currently selected cloud project/account is a candidate, not the intended target unless already confirmed. Do not copy example account/project/domain/public values. Do not guess exposure, private values, public credentials or production intent. Mark suggested names as proposals in comments, not as approved decisions. app.name must be 2–19 lowercase/digit/hyphen characters starting with a letter, because the runtime SA prefix/suffix use the remaining name length.

For existing config, preserve values and operator comments. Add missing schema fields and source-derived variable NAME entries without changing selected values; make conflicts explicit in inline comments and a short actionable intake bullet. Do not insert duplicate env entries. Once the operator says config ready, reread and validate rather than re-requesting approval to save the same values. User edits are the declaration of intent; deployment approval is separate.

Explain secret names/scopes in comments; no secret values in YAML. Public values deliberately belong in YAML but must be supplied as public, never extracted from .env files. Omit demonstrably unreachable/unused secret requirements with recorded evidence; do not change source code. Verify that comments explain public browser access vs app sign-in, and known domain vs actual DNS mapping. No configured secrets means no empty secret-upload ceremony.

## 3. Authentication handoff only when needed

Check gcloud availability, active identity, configured project and a read-only access query against the intended project. If gcloud is missing, state the one blocker and give appropriate installation guidance; do not silently install. If login expired/absent, tell the operator to run:

```bash
gcloud auth login
```

Finish browser login in your terminal, then say login done. Never execute interactive login yourself, ask for browser codes/passwords/tokens, create/download keys or add ADC login by default. Resume the same workflow and recheck identity/project access after completion. On mismatch, supply only the necessary operator account/project-selection command using confirmed values; do not silently switch identity. Separate authentication errors from missing IAM permissions. Already completed login/project selection must not be requested again without fresh failing evidence.

## 4. Validate and show one concise deployment approval

After config ready and authentication ready, perform Phase 1 checks yourself. Missing business values: return only exact config field paths/errors. Fix your own generated-file defects within authorized scope. Do not request permission for each routine local deployment-file preparation step already covered by the plan.

Write full evidence to the report. On screen use at most 120 words: environment, account, project/region/service, intended public/private access, URL mode, any material resource creation/reuse or IAM effects, files to generate, and 'Approve deployment to this target?'. Include any unusual risk or mismatch plainly; word limits must never conceal a material decision. The operator's approval covers this concrete scope. Config ready/login done are not deployment approval. Do not demand an exact magic word if the operator clearly approves the stated target.

After approval execute Phases 2–6, including local generation, init, permitted app-scoped bindings, deploy and read-back yourself. Existing safeguards stay. Keep routine progress to one or two short sentences; detailed logs belong in the report. Stop only for genuine missing intent, credentials, out-of-scope permission/resource changes, or a failed check. If stopped, say what failed and the minimum action needed; do not dump the whole recon again. Hand over secret upload only when needed; ask retain/replace for existing secret versions instead of needlessly uploading them.

## 5. Ignore-file preparation is agent work

The deployment plan includes creating/updating root .gcloudignore and .dockerignore. This is explicitly within local generation scope, not an override. Follow references/UPLOAD_BOUNDARY.md. Preserve existing exclusions, including .auth/, test-results/, playwright-report/, blob-report/ and e2e/. Never replace a stronger file with a weaker template. Verify the actual upload list after generation and before submission. No private file contents may be read or uploaded. A failed listing is a stop, never a clean result.

## 6. Report, recover, cancel

Final operator response: deployed/partial/blocked; URL; revision/build ID; access verification; next action; report path. No Gate D certification claim. Custom domain/DNS remains separate. Record nonsecret target, source identity, approved scope, phase and next action for recovery. Revalidate state after interruption without restarting completed work unnecessarily. On cancellation, stop the current round, record known changes and cloud actions, and do not automatically resume or deploy. A new activation begins fresh intake using current files, not prior approval.
