# ENGINEERING_HANDOFF — `APBM-007B-CYBER-PHARMA`

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §5 and §7. **Owner: Engineer**, as part of the original engineering assignment. Everything here is a **claim for independent QA** unless it is a command or a path. Companion to `../QAM_MANIFEST.md`.

**Engineer:** Claudy (Claude Code) · **Recorded at:** 17 November 2026, ~11:45 Asia/Dhaka — **FINAL ENGINEERING HANDOFF r05** · **Status: all engineering work done except the two blockers in §4.1; ENGINEERING COMPLETE is NOT declared** · **Manifest:** `../QAM_MANIFEST.md` · **Candidate:** `PENDING` (no commit exists; Tony owns Git)

Evidence root used below: `../../EVIDENCE/E2/` (abbreviated `E2/`). OwedBook-side DEV receipts are also at
`/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/apply/dev-apply-r05/`.

## 1. What was built (claims, per acceptance criterion)

| AC | Claim (built + engineering-verified) | Evidence | Open for QA / gap |
|---|---|---|---|
| 001 Owner boundary | Add Store quote/confirm only for the account owner (SQL `owner_user_id = actor`; API owner context); admin/member/foreign requests denied | SQL proof (non-owner quote refused); O-1/C/D/E product calls as owner; `E2/r05/FINAL/sql_proof_*` | Independent role-by-route matrix |
| 002 Store identity | Canonical `pharmacy_identities`; one live ownership per NPI; NPI advisory lock + holds; historical rows keep ids; duplicate → support | Local committed two-connection NPI race (134/134); SCRATCH invariant (no orphan, one live ownership per identity, shared identity only via completed transfer); check E same identity | — |
| 003 Disclosure/consent | Server quote (amount, period, renewal, expiry, preserved APA); 50¢ minimum; three consents; mid-period quote = real invoice | CP-1 (`E2/r01/CP1`), CP-2 PE-09 (`E2/r01/CP2`); **O-1 product PE-09 ordinary + APA: 2,450 = quote = invoice < 4,900** (`E2/r03/O1/o1r03/state.json`); APA renewal = quoted renewal | — |
| 004 Paid activation | Only operation-bound paid invoice + verified quantity → one atomic activation; browser cannot grant | CP-1b 5/5 (`E2/r01/CP1/cp1b_scratch_itest.txt`); check C 3DS: paid invoice + real event → `store_activated` (`E2/r03/C/c-r03`) | — |
| 005 Failed add | Decline/3DS leave store pending, existing stores working; no grace/notices from Add Store; `latest_invoice` not delinquency | CP-1a/CP-1b; webhook units; **check C decline → abandon: nothing charged, invoice void, quantity unchanged** | — |
| 006 Idempotent retry | Intent keys, op-derived provider keys, lost-reply enumeration, duplicate/out-of-order events; attention beyond retention | CP-1a lost reply; CP-1b replay; O-1 replayed failure → `duplicate`; local concurrency races | — |
| 007 Recovery/expiry | Payment deadline; durable jobs route; void + verify before release; late payment → attention; owner reconfirm; operator close on provider proof | CP-1b expiry/abandon; SQL proof lease takeover + stale-epoch refusal + late-pay → attention; check C abandon | **BLOCKER B1: crash/restart of a RUNNING server mid-operation not exercised** (§4.1) |
| 008 Quantity | Billable count, absolute no-proration updates, attention on mismatch, quantity-check command | CP-1b; O-1 (quantity across add/removal/renewal); check F transfer 2→1→2; check E 3→2 | — |
| 009 Catalogue | One graduated price ($99/$49), one subscription per account; owner-only billing; cancel/undo intact | CP-1 previews 14,800/19,700; **check G Billing Portal cancel → app shows schedule, Add Store refused → undo** (`E2/r03/GF/gf-r03`) | — |
| 010 Authorized invitation | Owner/admin rights per role matrix; admin cannot appoint admin/owner | SQL proof; **role probes after acceptance: ADMIN may invite members only, MEMBER nothing** (`E2/r04/ACCEPT/a1_role_checks.json`) | — |
| 011 Invitation acceptance | Intended store/role only; new identity created without password; existing identity reused unchanged | **New identities (MEMBER, ADMIN): real inbox links (token-hash) → separate private browsers → accepted** (`E2/r04/ACCEPT/`); **existing identity (OWNER_B): real send + browser acceptance by normal sign-in; password hash unchanged** (`E2/r05/ACCEPT_EXISTING/results.json`) | **BLOCKER B2: inbox receipt of the OWNER_B email (manual record 6) not yet confirmed** |
| 012 Invitation abuse | Expired/revoked/replayed/altered fail; GET does not redeem, button POST does; wrong user needs a deliberate switch | SQL proof; OwedBook auth units (FC-4); link-format finding (a provider-default link would create no session) | Independent browser negatives |
| 013 Resend/revoke | 5 sends max, 60 s gap, newest token replaces older (provider keeps one per identity), revoke | `E2/r04/ACCEPT/resends.json`; staff journey revoke 6/6 three engines (final) | — |
| 014 Admin replacement | Incumbent stays until exact acceptance; one admin throughout; former admin → member unless removal chosen | SQL concurrency; **real journey: OWNER_A admin → ADMIN accepted → exactly one admin; OWNER_A member and still owner** (`a1_before/after.json`) | — |
| 015 Member revocation | Next request denied incl. existing JWT claims; read-only reductions allowed | SQL proof (existing claims) | Session-lifetime measurement |
| 016 Last-admin protection | Self-removal/conflicts cannot orphan; owner/support recovery | SQL proof; operator `store-admin-set` applied and restored (r02) | — |
| 017 Isolation | Live predicate on every helper/policy/definer; catalogue assertions | SQL role matrix subset; check E buyer denied seller store/history; DEV compat scope 11/11 | Full independent matrix |
| 018 Scheduled removal | Access to period end; no credit/proration; charge stops next period | O-1: preview 14,800 after removal; **next real renewal invoice 14,800 (2 stores)**; A2 finalized at R | — |
| 019 Removal undo | Undo before boundary; guarded period re-read | CP-1b; browser removal→undo (addstore spec) | Boundary concurrency |
| 020 Last-store lifecycle | Whole-account cancellation, no zero-store state | SQL proof | — |
| 021 Transfer authority (operator) | Typed exact-id commands, dry-run default, audit authenticated-as vs declared actor | r02 operator checks; checks E/F applies | Support procedure graded separately |
| 022 Transfer billing/access (operator) | One live ownership; buyer own billing; seller cutoff; exact-buyer reservation from effective time | **Check E: authorize (3→2) → complete → buyer registration + real Checkout → transfer `completed`, new buyer row on the same identity** (`E2/r04/E/e-r03/state.json`); check F authorize→cancel 2→1→2 | — |
| 023 History/receivables | Buyer denied pre-sale history; seller owner read-only history; staff denied | Check E: buyer scope excludes source, read denied, own store 0 seller rows; seller account owner lists history, former owner does not | — |
| 024 Recovery audit (operator) | Owner/admin recovery, resumable provider-email step, append-only audit | Check F owner replace (customer email follows; repeat `already_owner`); r02 admin set/restore | Support procedure graded separately |
| 025 O-1 live lifecycle | Clock journey; grace 7 days; read-only SQL+app; owner recovery; replay no reset; time seam denied on DEV | **O-1 PASS** (state.json; browser grace/read-only/active in both apps); **DEV: deployment bound to DEV, test-context enable refused 42501, `billing_now` = real time** (`E2/r05/DEV_APPLY/guard-post.json`) | — |
| 026 O-2 email | Portal Resend only; failure + 48-hour warning to controlled owner inbox | Two Resend sends with provider message ids; **Tony's manual inbox receipt 09:18 / 09:19** (manual records 1–2) | Resend key is send-only: provider delivery status not readable |
| 027 Reminder reliability | Once per invoice; recovery suppresses; durable claim/fence; guard before first send | SQL notice proof; units; O-1 (each notice sent once); guard probe allowed/blocked | — |
| 028 007A regression | First-store purchase, confirm-button email flow, handoff, owner billing, cancel/undo, nav highlight, OwedBook billing fields, password show/hide | r02 regression 9/9 Chromium/Firefox/WebKit; check E (first-store purchase via real Checkout); invitations (confirm-button flow); check G; DEV compat (11 members, 14 reads, 7 owner overviews) | Portal regression not re-run at final (§4.2) |
| 029 Migration preservation | Forward-only 0061–0069; fresh/upgrade/forward-resume; **DEV ledger = manifest** | Local fresh 0001–0069 PASS (final); SCRATCH 0001–0069; **DEV apply PASS: 9 commits, ledger 69 = manifest, preservation digests equal; 9 additive audit rows from the 0061 backfill explained** (`E2/r05/DEV_APPLY/`) | — |
| 030 Usable UI | New-journey production-build happy paths with destination + stored state; themes, widths, keyboard, three engines | Portal addstore 3/3; regression 9/9 three engines; staff journey 6/6 three engines (final); O-1 state specs; 375 px fixed | Seller-history UI not built (contract "may") |
| 031 Built-bundle secrets | No server credential in client bundles; scanner with poison/clean controls | **Final: self-test 23/23 poison detected, 0 clean hits; Portal clean; OwedBook clean except the documented auth-js `generateLink` (1 file)** (`E2/r05/FINAL/`) | — |
| GD-001 | outside Gate Q | — | — |

## 2. Commands (exact, with working directory)

```
# Portal = /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 ; OwedBook = /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
npx --no-install tsc --noEmit && npx --no-install eslint . && npx --no-install jest --ci         # each repo
node scripts/apbm007b/build-check.mjs --self-test                                                   # Portal
node scripts/apbm007b/build-check.mjs --app both --out /home/moose/APBM007B_E2_WORK/build-final     # Portal; clean copies + scan
node scripts/apbm007b/proof-serve.mjs build|start [--mail live]|stop --out /home/moose/APBM007B_E2_WORK/proof   # Portal; 3100/3101 → SCRATCH
node scripts/apbm007b/served-identity.mjs --base http://localhost:310x --manifest <proof manifest>   # Portal
node scripts/apbm007b/integration.mjs --suite store                                                  # Portal; SCRATCH + sandbox
node scripts/apbm007b/{o1-journey,c-journeys,e-transfer,e-checkout-complete,gf-checks}.mjs --help   # Portal; live checks (ledger-reserved)
node scripts/apbm007b/{invite-send,invite-resend,invite-existing,a1-state,a1-roles}.mjs --help       # Portal; invitations + role checks
node scripts/apbm007b/inbox.mjs --check | --manual-list                                              # Portal; inbox coverage / manual records
node scripts/apbm007b/jobs-run.mjs --base http://localhost:3101 --key-source scratch --every 60      # Portal
node scripts/operator-007b.mjs --help                                                                # Portal
node scripts/apbm007b/migrate-rehearsal.mjs fresh|forward --db <local url>                           # OwedBook; local DB only
node scripts/apbm007b/sql-proof.mjs --local <url> | --scratch                                        # OwedBook
# DEV (done under the Director release of 17 Nov): RLS_HARNESS_PREFIX=APBM_DEV_ APBM_TARGET=dev APBM_PROJECT_REF=yrsuwikjnbmvpznrgydb APBM_EVIDENCE_DIR=<abs lane>
node scripts/apbm007b/dev-apply-guard.mjs preflight|bind|post …                                       # OwedBook
node scripts/apply-forward.mjs apply --manifest <approved inventory> --before <fresh catalog>         # OwedBook (APBM_DIRECTOR_APPLY=<DEV ref>)
node scripts/dev-verify.mjs [--expect <catalog>]; node scripts/apbm007b/dev-compat-check.mjs --mode rolled-back   # OwedBook
PORTAL_BASE_URL=http://localhost:3101 APBM007B_PROOF_CAST=<0600 file> npx --no-install playwright test --project=apbm007b   # Portal
OB_BASE_URL=http://localhost:3100 APBM007B_PROOF_CAST=<0600 file> npx --no-install playwright test --project=apbm007b --project=apbm007b-firefox --project=apbm007b-webkit   # OwedBook
```

Listener: none. On the proof pair, real Stripe events were delivered by an owned forwarder signed with the proof Portal's
webhook secret (the handler re-reads every object from Stripe). Build identity: `GET /api/build-info` on both apps.

## 3. Evidence inventory (what each item means)

| Path | Meaning |
|---|---|
| `E2/effects/` (copy `E2/r05/EFFECTS/`) | Cumulative effect ledger and counters (every reservation before its effect; nothing reduced) |
| `E2/r01/` CP1, CP2, MIGRATIONS, BUILD, BROWSER | Provider mechanism, clock, rehearsals, first builds/journeys |
| `E2/r02/` | Rulings reconciliation, 0068/0069, regression three engines, operator checks, DEV manifest v1 |
| `E2/r03/` O1, C, GF, E, INVITE, INBOX | Live lifecycle, decline/3DS, cancel-undo/operator, transfer start, invitation sends, manual inbox records |
| `E2/r04/` ACCEPT, CODE_OWEDBOOK_LINK_FIX, E, BUILD, CLEANUP, DEV_APPLY_MANIFEST_FINAL.md | Link fix + acceptance, check E, provider cleanup, final DEV manifest |
| `E2/r05/` DEV_APPLY, ACCEPT_EXISTING, FINAL, INVENTORY, EFFECTS | DEV apply receipts, existing-identity acceptance, final checks, inventory, effects |

## 4. Limitations and open points

### 4.1 Blockers to ENGINEERING COMPLETE

| # | Item | What is needed | Who |
|---|---|---|---|
| B1 | **AC-007 crash/restart of a running server mid-operation** not exercised. Proven so far: DB-level lease takeover and stale-fence refusal, job-path expiry, abandon, late payment. Missing: a server stopped and restarted mid-operation. | One Stripe customer + one subscription (both ceilings used, 13/13; all sandbox objects cleaned). About 19,700 attempted cents and 1 pay fit the remaining envelope (45,396 cents; 5 pay/hosted). Then: proof pair up, start an Add Store, stop the Portal process at `payment_setup`/`payment_pending`, restart, show the job/status path converges to exactly one outcome. | Director (customers and subscriptions 13 → 14) |
| B2 | **AC-011 existing-identity inbox receipt**: sign-in email to ENGINEERING_OWNER_B sent 11:23:40 Asia/Dhaka (manual record 6). Acceptance itself is done (normal sign-in). | Tony's manual inbox check (do not use the link) | Tony |

### 4.2 Limitations (not blocking)

| Item | Detail | Who should decide |
|---|---|---|
| Portal browser regression at final | Not re-run: every Stripe-backed fixture owner was cleaned up. The live card read for a deleted customer degrades to "unknown" after 2–6.5 s, beyond the spec's 5 s wait. Last full run r02 9/9 on three engines. The only Portal product file changed since then is `src/server/operator007b.ts` (operator audit), exercised live in check F. | QA (independent regression at the candidate) |
| Seller-history UI | Not built (contract "may"); API and DB proven | Architect if wanted |
| Hosted-page return | No link back to the operation after Stripe's hosted page (not required); activation via webhook, jobs or a polling page | Architect if wanted |
| SCRATCH Auth template | Token-hash Magic Link template + proof redirect URLs saved by the Director on SCRATCH (17 Nov). DEV has the 007A template with 3000/3001 redirects. Staging hosts not configured. | Director / QA runtime |
| Resend | Key is send-only; provider delivery status not readable (two 401 reads, not retried) | — |
| SCRATCH data | Labelled rehearsal/fixture rows retained; subscription mirrors of cleaned Stripe objects may still read active (no listener) | QA fixtures |
| Firefox staff journey | One intermittent timeout at r02 (re-run passed); final run 2/2 | QA to observe |
| Lint warnings | Portal 27, OwedBook 36, 0 errors (pre-existing style warnings) | — |

## 5. Reproduction for an independent runtime

From a clean clone of `qa/apbm-007b` at the candidate (when it exists): install with `npm ci` in disposable copies, build
with `build-check.mjs`, serve with `proof-serve.mjs` (OwedBook `.env.local` SCRATCH names, Portal `.env.local` Stripe test
names, `MAIL_ALLOWLIST` per app), verify served identity, run the commands in §2. SCRATCH Auth needs the token-hash Magic
Link template and the exact proof confirm addresses in its redirect allowlist. Machine-dependent: the local rehearsal
database (`/home/moose/APBM007B_E2_WORK/localdb`, Docker, now stopped) and private 0600 credential files
(`~/.apbm007b/engineering_cast.json`, `/tmp/apbm007b-o1-cast.json`).

## 6. What this handoff does not contain

- Q1 findings, Q2 results, a plan, an approval, a certificate (not the Engineer's to write).
- Secret values, auth state, raw authenticated traces, inbox addresses.
- Any statement that the acceptance criteria should change.

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*

## Mandatory 007B factual fields (Engineer)

| Field | Value |
|---|---|
| Inventory (final) | `E2/r05/INVENTORY/` — Portal: 0 committed, 0 staged, 13 unstaged, 451 untracked (53 outside `agent_docs/`); OwedBook: 0 / 0 / 8 / 59 (32 outside) |
| Build identity | Final clean builds: Portal `8c6a308a74ec2a06d8c2f5826ef413ac`, OwedBook `5b3c3b13ab5f58935fe7f806040ea98f` (`E2/r05/FINAL/manifest_*.json`). Last served proof pair (r04): Portal `09ffa057…`, OwedBook `4e43362f…`; its product source is byte-identical to the repos (ids differ only by scripts/e2e files) |
| DEV | 0001–0069 applied (ledger 69 = manifest), deployment identity bound to DEV, catalogue `4a1c1719…` (34 tables / 14 policies / 99 functions); same shape as SCRATCH except three pre-existing platform default-ACL rows |
| Inbox adapter schema | `scripts/apbm007b/inbox.mjs`: `~/.apbm007b/inbox_access.json` `{ "inboxes": [ { adapter, host, port, user, password, mailbox, receives: [...] } ] }`; no automated access exists → manual records with stated limits |
| Runtime guard validation | Mail guard with the real five-address allowlist: cast → allowed, other → blocked, 0 sends (probe); proof sends only with `--mail live` |
| Effects | `E2/r05/EFFECTS/counters.json` (cents 434,604/480,000; customers 13/13; emails 10/24; DEV apply 1/1) |
| Owned processes | Proof servers 3100/3101 stopped; local rehearsal containers stopped; Director's 3000/3001/3457 untouched |
| Provider cleanup | 0 live E2-owned customers / subscriptions / test clocks / open invoices (`E2/r04/CLEANUP/`); 007A-marked subscriptions left alone |
