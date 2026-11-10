# Next Deploy Auto — v1.3

Point your local agent at this folder. It reads the instructions and inspects the app itself.

1. The agent prepares root stark-deploy.yaml and tells you its full path.
2. Fill only the fields it marks REQUIRED FROM YOU; comments explain each one. Save and say config ready.
3. Complete browser cloud login only if requested.
4. Approve the short deployment summary. The agent performs generation, init, deployment and verification itself. If secrets are required, you handle their values using its upload handoff.

Full recon and evidence go into agent_docs/RESPONSES/, not a wall of chat. Git remains yours unless delegated. The agent does not read .env contents or private values. It creates/merges upload and Docker exclusions without weakening existing rules.

Scope: existing bootstrapped Google Cloud project, through verified run.app deployment. Domain/DNS and Gate D remain separate. Start with CLAUDE.md or identical AGENTS.md, then SKILL.md and references/STARTUP.md.

This revision has not deployed anything. Prior repair reports are history.
