# APBM-007B E2 — engineering build report, checkpoint return r01

Engineer: Claudy · 16 November 2026, Asia/Dhaka · branch `apbm-007b` in both repositories · baselines Portal
`c68c4acaccc4a68f20ede267f06cfda17fa15aac`, OwedBook `0b785524a621c4384db8bee47ef9b4149b8ab44c` (HEADs unchanged; nothing
committed or staged by me). **Status: ENGINEERING IN PROGRESS — CHECKPOINT RETURN.** Not ready for Q1.

## 1. What is built and how it was verified

| Area | Built | Engineering verification (actual results) |
|---|---|---|
| Stage 1 instruments | Portal `scripts/apbm007b/`: `lib/{env,effects,stripe}`, `capability-check`, `testclock`, `fixture-clock`, `integration`, `build-check`, `served-identity`, `privacy-scan`, `export`, `env-preflight`, `jobs-run`, `mail-guard-probe`; `scripts/operator-007b.mjs`. OwedBook `scripts/apbm007b/{migrate-rehearsal,sql-proof,rehearsal-seed.sql}` | `--self-test` PASS for build-check (23 patterns), privacy-scan (10 rules), export, env-preflight, mail-guard-probe; every instrument fails closed without its target |
| CP-1 provider | Standalone incremental invoice mechanism | **PASS** (`CP1/CP1_RETURN.md`) |
| CP-1b product saga | Portal saga on SCRATCH + sandbox | **PASS 5/5** (`CP1/cp1b_scratch_itest.txt`) |
| CP-2 provider | External clock driver; PE-09 midpoint; 7-day record | **PASS** (`CP2/CP2_RETURN.md`) |
| CP-2b SQL exclusion | `billing_now` / deployment identity / test context | **PASS** on SCRATCH (rolled back) and DEV-identity negative on the isolated DB |
| Migrations 0061–0067 | identity+clock, store operations, lifecycle+transfer, invitations, notices, operator audit, reads/privileges | Isolated DB: fresh full chain PASS; seeded upgrade PASS; fault in 0063 → rolled back (ledger 62) → resume PASS; proof **113/113**. SCRATCH: forward upgrade PASS with the existing runner; proof **107/107** (earlier candidate of 0061 — see §4 C-2) |
| Portal product | `storePricing`, `storeOperations` (quote/confirm/status/abandon, fenced exactly-once advance, expiry/void, activation, removal/undo), `mailGuard`, `billingNotices` (Resend, single sender), `operator007b` (9 typed commands), webhook routing changes, jobs route, build-info, Add Store page + removal controls | `tsc` clean; `eslint` 0 errors (26 warnings, baseline 24); Jest **480/480** (24+1 suites) |
| OwedBook product | invitations/members/history API (I1–I9, W6), narrow privileged `invitationMail` (ruling 5), `mailGuard`, `/invitations` page, live staff panel, build-info, appIdentity proof origins + return paths | `tsc` clean; `eslint` 0 errors; Jest **310/310**; boundary test extended (service key now reachable only from `handoff.ts` and `invitationMail.ts`; mail module only from `staff.ts`) |
| Production-build browser (proof pair 3100/3101 → SCRATCH + sandbox) | Proof builds with SCRATCH public values; servers started by `proof-serve.mjs`; **served identity MATCH** for both apps (HTTP artifact/revision = manifest; listening process cwd = proof build; disk BUILD_ID = manifest) | Chromium: **Portal 3/3** (`e2e/apbm007b.addstore.spec.ts`: Add Store quote → three consents → paid → activated → dashboard count +1; removal scheduled → undo; 375 px no horizontal scroll after a fix), **OwedBook 2/2** (`e2e/apbm007b.staff.spec.ts`: owner invite → guarded send message → pending → revoke; `/invitations` shows nothing for the owner). Stored state `BROWSER/walk_state_after.json`: 4 stores, 2 adds activated, 2 removal/undo pairs completed, invitation revoked with 0 dispatch attempts, billable = mirror = provider = 4. **Firefox/WebKit not run** (browsers not installed locally) |
| Builds | Disposable copies, `npm ci` exact lockfile, placeholder settings + canary secrets, artifact id compiled in | Portal build PASS (45 routes), client scan **clean**; OwedBook build PASS (40 routes), client scan **1 hit: `generateLink`** in a shared chunk — `@supabase/auth-js` library admin-API method name, no credential. **The untouched baseline build has the same single hit** (pre-existing, not introduced by 007B) |

## 2. Acceptance criteria — engineering claim status (claims for independent QA, never results)

| AC | Engineering status | Evidence / gap |
|---|---|---|
| 001 owner boundary | Implemented in SQL (`store_quote_create`/`claim`: owner_user_id = actor) and API (owner context via `owner_billing_overview`) | sql-proof "quote refused for non-owner"; no browser/API negative run yet |
| 002 identity/NPI | Implemented (identities, one-current indexes, shared advisory lock, transfer holds) | sql-proof incl. committed two-connection NPI race (local); compatibility trigger for 007A inserters |
| 003 disclosure/consent | Implemented (SQL-computed amount, 50¢ minimum, 90-min window, 15-min quote, three consents, renewal total) | CP-1, CP-2 PE-09 (provider), CP-1b (quote = invoice); **controlled-time product quote not yet run (O-1 journey)** |
| 004 paid activation | Implemented (authoritative paid invoice + verified quantity → atomic SQL activation; browser cannot grant) | CP-1b happy + replay + paid/lost activation convergence |
| 005 failed add | Implemented (decline/auth leave store pending; no grace; latest_invoice not delinquency; webhook grace only `subscription_cycle`) | CP-1a decline/auth; CP-1b decline; webhook unit tests |
| 006 idempotent retry | Implemented (intent keys, op-derived provider keys, enumeration after lost reply, attention beyond 23 h) | CP-1a lost-reply; CP-1b replay; concurrency race local |
| 007 recovery/expiry | Implemented (deadline, job, void+verify, late payment → attention, owner-reconfirmed resume, BP-04 close) | CP-1b expiry/abandon; sql-proof abandon→paid→attention; **crash/restart of a running server not yet exercised** |
| 008 quantity | Implemented (billable count, absolute updates, attention on mismatch, quantity-check command) | CP-1b; sql-proof |
| 009 catalogue | Preserved (guarded tiers; no new price/subscription) | CP-1/CP-1b renewal previews 14800/19700 |
| 010–016 invitations/admin/members | Implemented in SQL + OwedBook API/UI | sql-proof (roles, wrong user, replay, admin replacement, stale incumbent, revocation with existing claims, read-only exceptions, concurrent acceptances). **No real invitation email or browser acceptance yet (blocked: MAIL_ALLOWLIST and engineering cast absent)** |
| 017 isolation | Live predicate on every helper/policy/definer wrapper; catalogue assertion in 0063 | sql-proof role matrix subset; full independent matrix is QA's |
| 018–020 removal/undo/last store | Implemented | CP-1b removal/undo (no invoice); sql-proof cutoff/finalize/last store; **next real renewal invoice after removal not yet observed (needs O-1 clock)** |
| 021–024 operator | 9 typed commands, dry-run default, append-only audit with authenticated_as vs declared actor | sql-proof (owner-replace, audit append-only, reactivation refusal, transfer SQL path); **commands not yet exercised against a running proof server** |
| 025 O-1 live lifecycle | Clock driver, SQL seam and app time all in place | **NOT RUN** as a product journey |
| 026 O-2 email | Single Resend sender + guard implemented and unit-tested | **BLOCKED**: `MAIL_ALLOWLIST`, controlled owner inbox and adapter not supplied |
| 027 reminder reliability | Durable claim/fence/suppression/horizon in SQL + sender | sql-proof notices; unit tests (guard, retry/attention, suppression) |
| 028 007A regression | 007A unit suites green after deliberate updates (§3) | **No production-build browser regression yet** |
| 029 migration preservation | Rehearsals PASS; DEV not applied | DEV apply checkpoint pending (§4 C-1) |
| 030 UI | Add Store page, removal controls, invitations page, live staff panel | Chromium production-build happy paths PASS with final page + stored state (Portal 3, OwedBook 2); 375 px overflow found and fixed; dark theme, keyboard-only, Firefox/WebKit and seller-history UI **not yet run** |
| 031 bundle | Scanner with poison/clean controls | Portal clean; OwedBook only the pre-existing library name `generateLink` (also in the baseline build); no canary secret, secret name or 007B server function in either bundle |
| GD-001 | outside Gate Q | not in scope of E2 |

## 3. Deliberate test changes (not weakened; each tracks a contract change)

- Return-path allowlist pins (both apps) → BP-09 lists (`/invitations`, `/stores/add`).
- Portal dashboard: "Adding a store is not available yet" → real `/stores/add` link for an active Stripe subscription.
- Portal webhook: 007A G5 "pending renewal_reminder record" test replaced by 007B notice scheduling/suppression and
  `subscription_update`/standalone-invoice routing tests (the reminder record is superseded by contract 0065).
- Portal boundary list: seven new owner routes added to the reviewed Supabase importer list.
- OwedBook boundary test: service-key importer list extended by exactly one module (Director ruling 5) and the
  fixed-text logging rule now also covers that module (stricter).

## 4. Grouped Director checkpoint (one decision each; recommendation first)

| # | Item | Recommendation |
|---|---|---|
| C-1 | **DEV apply release** for 0061–0067 (manifest + hashes `MIGRATIONS/migration_hashes.txt`, DEV read-only before-catalogue `fab5247f…` with 23 tables/14 policies/36 functions, SCRATCH after-catalogue 34/14/97, rehearsal receipts, privilege assertions inside each file). The Director's running 007A servers on 3000/3001 stay compatible: the 0061 trigger keeps the 007A provisioning insert working (proved). | Release after C-2 is settled, so DEV receives exactly the final hashes. |
| C-2 | **SCRATCH holds the earlier candidate of 0061** (`97ab60b2…`); the final file (`9a5e7ac5…`) adds the 007A-compatibility trigger found after the SCRATCH apply. Until reconciled, SCRATCH registration (007A provisioning) would fail on SCRATCH, and the forward runner will refuse SCRATCH because its ledger hash differs. Options: (a) authorize one SCRATCH re-baseline of the 007B footprint (export retained fixtures first, reset, fresh chain 0001–0067, re-seed; 1 more chain cycle, recreates SCRATCH Auth fixtures); (b) amend ALLOWED_PATHS to permit one forward-fix file `0068_007b_*` carrying only the trigger (then DEV gets 0061–0068). | (b) — smallest change, forward-only, matches the envelope's "one forward fix", no fixture loss. |
| C-3 | **Missing private inputs** (names only): `MAIL_ALLOWLIST` (Portal and OwedBook), `BILLING_EMAIL_FROM` (code defaults to the contract value), engineering cast `ENGINEERING_OWNER_A/OWNER_B/ADMIN/MEMBER/INVITEE` addresses (+ passwords where used) and an inbox adapter/access file. Blocks: AC-026 inbox proof, real invitation sends (AC-011/013), Resend sender validation. | Supply privately; nothing else is blocked by them. |
| C-4 | **Director decision 9** (same-owner paid re-add history). Isolated: the operator authorization exists; Add Store refuses a previously registered NPI (`npi_previously_registered`) and activation has no reuse path. | Rule when convenient; one small change follows either way. |
| C-5 | **Transfer buyer via new registration** is not implemented: a transfer buyer must already have an account and use Add Store. LIFECYCLE says "normal registration or Add Store". | Accept Add-Store-only for this candidate, or allow me to extend registration provisioning (moderate). |
| C-6 | OwedBook client bundle contains the library method name `generateLink` (from `@supabase/auth-js`, shipped with the browser Supabase client). **Resolved as pre-existing**: the untouched baseline OwedBook build (`git archive` export, same lockfile) has the same single hit. No credential or 007B name is in either bundle. | Keep the pattern (it would catch a real admin import in our code) and record the baseline exception in the Q1 scan expectations. |
| C-7 | Record-accuracy contradictions: module files still say "E2 NOT RELEASED" and APBM_RULINGS says "No E2 release until default9 and Friday diff confirmation are recorded"; Tony's release supersedes the first; the second is an Architect/Friday record to update. | JARVIS updates those headers; I have not edited them. |

## 5. Effects used (cumulative E2 ledger `EVIDENCE/E2/effects/`; ceilings in parentheses)

Stripe customers 8 (12) · subscriptions 8 (12) · test clocks 1 (4) · clock advances 10 (30) · invoice create 20 (30) ·
invoice items 12 (30) · finalize 13 (30) · voids/draft deletes 8 (30) · pay/hosted 16 (24) · payment attempts 30 (60) incl. 6
automatic provider attempts recorded after observation · attempted cents 264,120 (300,000) · subscription mutations 15 (50) ·
PM attaches 13 (24) · default-card changes 16 (30) · APA redemptions 2 (3) · SCRATCH chain cycles 1 (12) · SCRATCH identities
4 (14) · DEV identities 0 · emails 0 (24) · app fixture mutations 12 (400) · DEV applies 0. Counting is conservative: idempotent
replays and one browser run that failed before payment were reserved again and never reduced, so provider-actual usage is
lower. **Headroom note:** only 35,880 attempted cents remain; the O-1 journey needs at least one failed and one recovered
two-store renewal (2 × 14,800) plus a mid-period add — it fits once, with no repeat. Cleanup: 5 subscription cancels,
5 customer deletes, 1 clock delete; no run-owned Stripe object remains active. Exact counters: `effects/counters.json` (authoritative over this summary). Cleanup: CP-1, CP-2 and CP-1b Stripe
objects cancelled/deleted. Retained: SCRATCH 007B rehearsal rows of run `apbm007b-itest-1794847579470` (labelled), the
SCRATCH deployment-identity binding, the local isolated Supabase containers (`/home/moose/APBM007B_E2_WORK/localdb`).

## 6. Remaining engineering work (independent of Director input unless noted)

1. Remaining browser work: decline→abandon and hosted-3DS journeys in the UI, seller-history UI, dark theme and keyboard,
   Firefox/WebKit (needs `playwright install firefox webkit`, a network fetch), and the 007A regression walk.
2. O-1 live journey on SCRATCH with a clock-bound account (after C-2): renewal failure → grace banner → read-only SQL/app
   denials → owner recovery → restored; PE-09 product quote at mid-period; removal followed by the next real invoice.
3. O-2 inbox delivery and invitation sends (after C-3).
4. DEV apply (after C-1) and DEV ledger = manifest check.
5. QAM handoff completion and `ENGINEERING COMPLETE — AWAITING QA BRANCH` only when all the above is factual.
