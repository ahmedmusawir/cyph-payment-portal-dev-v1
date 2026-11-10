# Upload exclusions — agent-owned deployment preparation

After deployment-plan approval, create .gcloudignore if missing; otherwise preserve existing rules and append required missing exclusions. Never overwrite an existing file blindly. Include the following baseline when creating a new file:

```gitignore
.gcloudignore
.git
.git/**
#!include:.gitignore
node_modules/
.next/
**/.env*
.env*
**/*.pem
**/*.p12
**/*.key
**/*service*account*.json
**/*credentials*.json
.auth/
**/.auth/**
test-results/
playwright-report/
blob-report/
agent_docs/
_SKILLS/
```

Include .gitignore only when it exists. Review its exclusions against required build inputs; if they omit a needed build input, report the conflict instead of silently weakening privacy rules. Exclude e2e/ if it is not needed by the build/tsconfig; if needed, keep it in the Cloud Build upload while still excluding it from Docker context as appropriate. Preserve all existing stronger exclusions and required build files.

Merge the canonical .dockerignore baseline with existing exclusions, preserving their ordering semantics. Pay attention to negation rules: merely appending text is not proof. Retain .auth/, test-results/, playwright-report/, blob-report/ and e2e/ exclusions unless concrete build evidence requires an explicit change. Do not read excluded credential contents.

Run gcloud meta list-files-for-upload from the app root; require success, inspect complete filenames for .env* at ANY depth and credential patterns, and verify required source/package/lock/config inputs are present. Report names only for breaches. The existing deploy.sh guard is still required. Do not submit a build if the effective list is unsafe or unverifiable. Record the ignore diff and successful check in the deployment report. Do not grant IAM permissions or change cloud state to repair an ignore file.
