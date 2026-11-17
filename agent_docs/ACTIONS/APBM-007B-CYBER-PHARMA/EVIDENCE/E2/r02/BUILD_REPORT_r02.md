# APBM-007B E2 — engineering checkpoint return r02 (supersedes r01 §4–§6; r01 §1–§3 stand)

Claudy · 17 November 2026, Asia/Dhaka · branch `apbm-007b` both repos · HEADs unchanged (Portal `c68c4ac…`, OwedBook
`0b78552…`), nothing committed or staged. **Status: ENGINEERING IN PROGRESS.** Stripe-dependent checks are waiting on one
envelope increase (§4). Not ready for Q1.

## 1. Director rulings of 17 November — done

| Ruling | Result |
|---|---|
| 1 Narrow 0068 forward fix; reconcile without rewriting applied history | 0061 restored to its applied bytes; trigger in `0068_007b_identity_compat_fix.sql`; SCRATCH forward 0068–0069 PASS with checksums untouched; fixtures preserved |
| 2 Decision 9 approved | 0069: same-owner paid re-add (after operator authorization) restores the ORIGINAL ownership row and its history, only inside the atomic post-payment activation; a sold store can never be reactivated. DB proof: original id restored, claims back, one current ownership, authorization consumed, nothing before payment |
| 3 Transfer buyer via normal registration | 0069: email-identified buyer; registration reserves the transfer hold only for that exact email from the effective time; checkout binds it; provisioning creates the successor ownership under the same canonical identity; the hold is never released to the public (unpaid checkout detaches it). Operator `store-transfer-authorize --buyer-email`. DB proof PASS. Product (Stripe Checkout) proof waits on §4 |
| 4 generateLink baseline exception | `build-check.mjs`: OwedBook only, ≤1 file, file must be recognisably auth-js; self-test proves no other hit is excused. Final scan: Portal clean, OwedBook clean with the documented exception |
| 5 Stale headers | 27 headers corrected; APBM_STATE, SUCCESSOR_INPUTS.json, BP_AMENDMENT_LEDGER updated; Friday's successor diff confirmation and the original v0.1 bytes recorded as still missing; header-only hash changes listed in `../r02_header_hash_changes.json` |

**Item for your acceptance:** rulings 2 and 3 need SQL, and 0061–0067 may not be rewritten, so they are in a second new
file `0069_007b_reactivation_transfer_registration.sql`. Ruling 1 named only 0068, and ALLOWED_PATHS listed 0061–0067.

## 2. Verification since r01

| Check | Result |
|---|---|
| Isolated DB: fresh 0001–0069; seeded upgrade; fault in 0069 → rollback → resume | PASS / PASS / PASS |
| DB proof | local **134/134**; SCRATCH **130/130** (rolled back) |
| Unit | Portal **482/482** (2 new operator tests), OwedBook **310/310**; typecheck clean both; lint 0 errors (Portal 27, OwedBook 36 warnings) |
| Production builds + client scan | both PASS; Portal clean; OwedBook clean with the documented exception |
| Served identity (proof pair, final code) | MATCH both apps |
| 007A regression + Add Store accessibility (`e2e/apbm007b.regression.spec.ts`) | **Chromium 3/3, Firefox 3/3, WebKit 3/3**: sign-in with password show/hide, dashboard/billing fields, one Manage billing action, handoff Portal→OwedBook with OwedBook nav highlight and billing fields, Add Store quote screen keyboard-only in dark theme with confirm disabled until all three consents |
| OwedBook staff journey (`e2e/apbm007b.staff.spec.ts`) | Chromium 2/2, WebKit 2/2; Firefox: first run 1 timeout on the status text, re-run 2/2 (recorded as intermittent, not hidden) |
| Operator commands on the proof Portal | no token → 404; dry-run default; typed refusals (not removed, not closable, partial proof, non-UUID); missing actor/reason/ticket refused **and now audited**; admin recovery applied and restored (exactly one admin after); jobs runner 200 with token, 404 without |

**Defect found and fixed:** my `local-proof` environment value broke the Portal→OwedBook handoff on the proof pair; the
007A handoff table accepts only `local`/`staging` (check violation 23514). Handoff codes now use the `local` label for the
local-proof pair (`handoffEnv()` in both apps); no SQL change. Also fixed: the operator and jobs scripts now take
`--key-source portal|scratch` (they had derived the token from the wrong server key against the proof pair).

## 3. Not yet run (blocked or pending)

| Item | Waiting on |
|---|---|
| O-1 live lifecycle (clock journey: grace banner, day-5 warning, read-only SQL/app denials, owner recovery, removal → next real invoice, PE-09 product quote ordinary + APA) | envelope increase (§4) |
| Browser decline→abandon and hosted 3DS journeys; decision-9 and transfer-buyer product proofs; transfer/owner-replace operator applies with provider steps; cancel→undo regression | envelope increase (§4) |
| O-2 inbox delivery; real invitation sends and acceptance (new and existing identity) | private inputs (`EFFECTS_PLAN_AND_PRIVATE_INPUTS.md` §4) |
| DEV apply | your apply release (`DEV_APPLY_MANIFEST.md`) |
| Seller-history UI | contract says "may"; API and DB proofs exist, no UI added |

## 4. Envelope — one proposed increase

Remaining checks need 160,570 attempted cents; 35,880 remain. **Proposed: aggregate attempted charges USD 3,000 → USD 4,800,
and explicit invoice pay/hosted submissions 24 → 30; nothing else.** Full table: `EFFECTS_PLAN_AND_PRIVATE_INPUTS.md`.

## 5. Effects (cumulative; unchanged Stripe counters since r01)

Stripe: customers 8/12, subscriptions 8/12, clocks 1/4, advances 10/30, invoices 20/30, pay/hosted 16/24, payment attempts
30/60, attempted cents 264,120/300,000. SCRATCH: chain cycles 2/12, identities 5/14, app fixture mutations 22/400. DEV: 0.
Emails: 0. Owned processes: proof servers stopped; local isolated Supabase containers left running for rehearsals
(disposable). Private proof credential files remain in `/tmp` (mode 0600, outside repos).
