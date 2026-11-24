# Redirect reproduction record (FINAL-02 / KR-2; AC-F02; P-11)

**Status: BLOCKED. Not reproduced, not attempted on a signed-in session, no repair made.**

| Field | Value |
|---|---|
| Defect under test | One-time redirect of a Store admin to Portal sign-in (FINAL-02), and the one-time WebKit sign-in redirect (KR-2) |
| Planned routes | OwedBook `/owedbook` → `/admin-portal` → `/admin-portal/billing` → **Manage billing** (handoff to Portal `/billing`) → back to OwedBook; then Portal `/dashboard` → **Open OwedBook**; each as Store admin, fresh session and warm session, Chromium and WebKit, five runs each |
| Required | A signed-in Store admin on an existing SCRATCH identity, with both builds pointed at SCRATCH and the resolved backend identity verified first (ruling AM-08 (5)) |
| What blocked it | No SCRATCH configuration or fixture credentials exist on this machine (searched by file name only: no SCRATCH env or fixture file in either repository or the home directory). A DEV-backed signed-in session is forbidden by the same ruling, and the rehearsal account may not be used |
| What was done instead | Signed-out guard outcomes on the candidate production builds (placeholder backend at `127.0.0.1:54399`, nothing listening): OwedBook `/help` and `/owedbook` → 307 to `/auth`; Portal `/dashboard` → 307 to `/login`. These show the guards still redirect a signed-out visitor; they say nothing about the Store-admin defect |
| Runs | 0 signed-in runs |
| Outcome | Not reproduced (not attempted). No repair exists, as P-11 requires |
| Earlier passing retest | Stays on record (APBM-007B manual retest; not repeated) |
| Resume point | When the Director provides an existing SCRATCH Store-admin identity and its non-secret configuration path (or independent QA runs it in Q2), run the planned routes above and complete this record |


## Correction (E2 completion, 24 Nov)

The "What blocked it" row above says no SCRATCH configuration exists on this machine. **That is wrong.** OwedBook's `.env.local` holds SCRATCH connection settings (`APBM_SCRATCH_DB_URL`, `APBM_SCRATCH_SUPABASE_URL`, `APBM_SCRATCH_PUBLISHABLE_KEY`, `APBM_SCRATCH_SECRET_KEY`, from the APBM-007B integration tests; key names read, values not). The earlier search was by file name only. The reproduction is still **BLOCKED**, for a narrower reason: no SCRATCH identity has been **designated** for this module (ruling AM-08 (5)), and no non-secret way to sign one in exists. Engineering does not receive emailed links, and minting a session with the service key is not permitted. Missing input: the designated SCRATCH identities (one per role) and a permitted way to sign them in.

## E2 completion: reproduction run (24 Nov, AM-14 and AM-15) — **Status: RUN. NOT REPRODUCED. No repair (P-11).**

| Field | Value |
|---|---|
| Candidate | Final working trees (`VERIFICATION.md` §6), production builds against SCRATCH `ihgcsrypblqkwommrkgj` on the local proof pair (OwedBook 3100, Portal 3101). Backend verified at build and at runtime before every sign-in |
| Actor | Existing fixture `ENGINEERING_ADMIN` (Store admin on one pharmacy), signed in by the AM-15 provider token through the app's own confirm page |
| Route actually available | Link inventory (`signed_final/phase_b/link_inventory_store_admin.txt`): on every OwedBook page a Store admin sees (`/owedbook`, `/admin-portal`, billing, settings, audit, `/profile`, `/help`), the candidate offers **no** link into Account & Billing. **Manage billing** and **Add store** are not shown to this role. The planned step "Manage billing → Portal" therefore cannot be followed through the app. Account & Billing offers **Open OwedBook** (the real handoff, `/api/handoff/start?return=/owedbook`) on `/dashboard` and `/billing` |
| Route run | Sign in to Account & Billing → `/dashboard` → **Open OwedBook** (handoff) → My Stores → sidebar **Billing** → count OwedBook links into Account & Billing (0) → back to Account & Billing → repeat |
| Sessions and browsers | Chromium (Google Chrome) and WebKit 26.4; per browser 5 **fresh** runs (new context and sign-in each) and 5 **warm** iterations in one signed-in context: 20 runs per attempt |
| Attempt 1 | 20 runs. 0 landings on Account & Billing sign-in, 0 on OwedBook sign-in. 18 full routes; WebKit warm 2 and 4: first step pre-empted (O-1) |
| Attempt 2 (error capture widened) | 20 runs. 0 landings on either sign-in page. 18 full routes; WebKit warm 2 and 4: the move to Account & Billing was interrupted by a navigation to `3100/admin-portal/billing` (the page the user was on). The user stayed signed in (observation O-1, `VERIFICATION.md` §6) |
| Superseded route 0 | An earlier script visited Account & Billing directly after OwedBook pages, with no Account & Billing session, and landed on `/login` in all 20 runs. That is the separate-cookie design (no handoff had happened), not the defect. Kept under `signed_final/phase_b/route0_superseded/` with this explanation |
| Outcome | **Not reproduced.** The historical one-time redirect of a Store admin to Account & Billing sign-in did not occur on any route the candidate offers that role. No repair, per P-11. The earlier passing retest stays on record |
| Limits | Automated sign-in (AM-15). Local proof pair, not alpha. The exact historical route is not recorded beyond "Store admin unexpectedly reached Payment Portal sign-in". Firefox not run. Independent QA reruns (AC-F02) |
| Evidence | `signed_final/phase_b/attempt1/`, `attempt2/` (`redirect_runs.json`, `console.txt`); `tools/scratch_proof/signed_checks.mjs` phase b; `link-inventory.mjs` |
