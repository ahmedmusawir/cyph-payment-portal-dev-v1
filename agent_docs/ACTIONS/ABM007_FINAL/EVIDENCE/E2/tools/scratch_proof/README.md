# SCRATCH proof tooling (ABM007_FINAL; rulings AM-14, AM-15)

Reusable, automated authentication and signed-in checks against the **existing APBM-007B SCRATCH** project, for Engineering and independent QA, with no Director inbox. **Test tooling only:** it lives in this module's evidence folder, outside every product path. No application code, guard or auth flow was changed to make it work.

**Proposed permanent tooling path:** `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/`. Its purpose is SCRATCH-only automated sign-in and signed-in self-checks. The Director rules on whether QA uses it in place or copies it into a QA lane. Nothing here is under `scripts/**` (protected) or `src/**`.

## What it uses (no new credential, no new account)

| Item | Where | Notes |
|---|---|---|
| SCRATCH target | `ihgcsrypblqkwommrkgj` | Verified through `scripts/apbm007b/lib/env.mjs` `scratchTarget()`, which reads only the four `APBM_SCRATCH_*` names from OwedBook's `.env.local` and fails closed unless both the API URL and the database URL resolve to SCRATCH. DEV `yrsuwikjnbmvpznrgydb` is refused |
| Fixture cast | **`~/.apbm007b/engineering_cast.json`** (mode 0600; private; never in a repository) | APBM-007B engineering cast: `ENGINEERING_OWNER_A`, `ENGINEERING_OWNER_B` (with passwords), `ENGINEERING_ADMIN`, `ENGINEERING_MEMBER` (no password in the cast), `ENGINEERING_INVITEE` (not on the allowlist) |
| QA's own private folder (APBM-007B) | `~/.apbm007b/apbm007b-qa-20261117T073513Z-e131c0ca/` (0700) | Cody's earlier QA cast and mappings. Not read by Engineering. The APBM-007B rule keeps the QA cast for QA |
| Stripe sandbox | Portal `.env.local` (test key only) | Passed to the Portal server in memory; reads only on the pages visited |
| WebKit | `/home/moose/APBM007B_REPAIR_R2/browsers` | Existing build, read-only (`PLAYWRIGHT_BROWSERS_PATH`). Chromium uses the installed Google Chrome |

## Files

| File | Purpose |
|---|---|
| `fixtures-check.mjs` | Read-only: each cast role exists on SCRATCH, is confirmed, has a password, owned accounts, membership counts. Prints roles and booleans only |
| `serve.mjs` | `build`, `start` and `stop` for production builds of two hash-bound working-tree copies (made by `../assemble.sh`, `node_modules` copied unchanged) on the local-proof pair OwedBook 3100 and Portal 3101 |
| `auth.mjs` | `signIn(page, app, role)`, the backend assertion and the masking list (details below) |
| `signed_checks.mjs` | Phase a: signed-in pages per role in both apps. Phase b: the AC-F02 redirect reproduction |

**`serve.mjs` safeguards:**
- Builds compile only public SCRATCH values.
- Server secrets are passed in memory.
- `MAIL_ALLOWLIST` is empty and no Resend key is passed, so the apps cannot send mail.
- No Stripe listener is started.
- It refuses occupied ports.
- The build fails unless the bundles carry the SCRATCH backend URL and no DEV backend URL. The only DEV string allowed is the mail guard's "is this DEV?" comparison literal.

**`auth.mjs` sign-in and checks:**
- `signIn(page, app, role)`: password roles use the app's normal password form. Password-less fixtures (AM-15) get a provider one-time token from the SCRATCH admin API (`generateLink`, type magiclink; sends no email), redeemed through the app's own `/api/auth/confirm` page and its **Sign in** button.
- Allowlist: Owner A, Owner B, Store admin, Member. The user must already exist on SCRATCH (read-only check), so `generateLink` can never create one.
- Before any sign-in, the runtime check reads the listening server process: its working directory must be a scratchpad copy, and its Supabase URL must resolve to SCRATCH.
- `privateStrings()` gives the masking list, held in memory only.

**`signed_checks.mjs` reads only.** It submits no form except sign-in and presses no button that changes data. It masks fixture addresses and names on screen before every screenshot and scrubs them from recorded text.

## Run (from the Portal repository root)

```
bash agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/assemble.sh /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev <copies>/ob <evidence_dir>
bash agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/assemble.sh /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 <copies>/pp <evidence_dir>
cp -a <each repo>/node_modules <copies>/<ob|pp>/
node agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/fixtures-check.mjs
node agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/serve.mjs build --copies <copies>
node agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/serve.mjs start --copies <copies>
node agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/signed_checks.mjs <out_dir> --phase all
node agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/serve.mjs stop --copies <copies>
```

`serve.mjs` (C-2) and `auth.mjs` (C-6) both accept only this Engineer session's scratchpad (`/tmp/claude-1000/`). A QA copy must reconcile both prefix checks and every other constraint listed in "Copying into a QA lane" below (corrected 24 Nov after the Architect's review: an earlier version of this line named only one prefix check).

## Limits (state them in every report)

1. **Automated authentication proves authenticated application behavior only** (AM-15). It does **not** prove email delivery, the emailed-link lifecycle (arrival, single use, expiry), or the real cross-app handoff on alpha. Those stay in `../../DEPLOYED_WALKTHROUGH.md` W-1 to W-5.
2. The token path uses the app's real confirm page and `verifyOtp`, but the token came from the admin API, not from an email.
3. Handoffs exercised between 3100 and 3101 are the real handoff code on the **local proof pair**, after an automated sign-in. They are not alpha.
4. Effects: SCRATCH Auth sign-in, session and audit activity, handoff codes, and one-time tokens from `generateLink` (no email). Plus read-only Stripe sandbox calls from Portal pages. No business data, password, user or DEV change.
5. Never package or log: the cast, the service key, tokens, cookies, browser storage, or unmasked screenshots. The tools write no browser state to disk; contexts are closed at the end.

## Copying into a QA lane (Architect review of package 03; journal Entry 005)

QA may copy this folder into its own declared lane for independent review and adaptation. A copy must reconcile **every** constraint below, not only one prefix check. It records each change it makes, and must not weaken the SCRATCH verification, the fixture allowlist, the mail block or the port refusal. This handoff authorizes **no** reset, fixture creation, credential change or provider mutation. A copy run is a QA action under the QA release.

| File | Constraint (IDs match the comment blocks in the files) |
|---|---|
| `auth.mjs` | C-1 hard-coded Portal path for `scripts/apbm007b/lib/env.mjs` and module resolution. C-2 `pg` resolved from the OwedBook path. C-3 cast file `~/.apbm007b/engineering_cast.json`, mode 0600. C-4 role allowlist. C-5 sites `localhost:3100` and `3101` with the login paths. C-6 runtime listener check: Linux `ss -ltnpH`, readable `/proc/<pid>/cwd` and `environ`, **cwd prefix `/tmp/claude-1000/`**, SCRATCH reference, `local-proof`. C-7 the user must already exist. C-8 UI selectors. C-9 timeouts. C-10 effects |
| `serve.mjs` | C-1 hard-coded Portal path. C-2 **`--copies` prefix `/tmp/claude-1000/`**, `ob/` and `pp/` copies with `node_modules`. C-3 fixed ports on 127.0.0.1 and refusal when occupied. C-4 named keys read from both `.env.local` files. C-5 mail blocked, no listener, synthetic subscriptions not allowed. C-6 build backend check. C-7 pidfile and process-group stop |
| `signed_checks.mjs` | Hard-coded Portal path (Playwright). `PLAYWRIGHT_BROWSERS_PATH` defaults to `/home/moose/APBM007B_REPAIR_R2/browsers` (WebKit 26.4, read-only). Chromium uses the installed Google Chrome (`channel: 'chrome'`). Sites, ports and selectors as in `auth.mjs`. Writes only to its `<out_dir>` |
| `fixtures-check.mjs` | Hard-coded Portal path; `pg` from the OwedBook path; cast file and mode as in `auth.mjs` C-3; read-only transaction |
| `link-inventory.mjs` | Hard-coded absolute paths to Playwright and to this folder's `auth.mjs`; sites as in `auth.mjs` |
| `../assemble.sh` | Copies the working tree (tracked plus untracked, without `.env*` or `agent_docs/`) and hash-binds the copy; refuses a copy containing `.env*` |

**Session method labels (QAM_AMENDMENT_01 section 6).** A sign-in through `auth.mjs` is a **fixture session** when it uses the provider token, and a **password sign-in** when it uses the password form. Neither is an emailed-link sign-in. Neither proves email delivery or the emailed-link lifecycle. Neither proves the handoff that follows a real sign-in.
