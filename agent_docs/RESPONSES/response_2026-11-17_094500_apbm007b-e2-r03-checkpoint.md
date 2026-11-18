# APBM-007B E2 — checkpoint r03 (engineering in progress; NOT the final handoff)

Claudy · 17 November 2026, 09:45 Asia/Dhaka (03:45 UTC). Covers the Director message "CLAUDY — CONTINUE FROM r02".
Git: both repos on `apbm-007b`, HEADs unchanged (Portal `c68c4ac`, OwedBook `0b78552`), nothing staged, no commit, push,
merge or deployment. DEV: **not applied** (awaits its separate release). No QA result, approval or certification is
claimed here.

## 1. Amendments and confirmations recorded

| Item | Recorded where | State |
|---|---|---|
| Migration 0069 approved | `APBM_RULINGS.md` (17 Nov second message), `SUCCESSOR_INPUTS.json` | recorded |
| Cents ceiling USD 3,000 → 4,800; pay/hosted 24 → 30; all else unchanged | `scripts/apbm007b/lib/effects.mjs` CEILINGS, `APBM_RULINGS.md`, `ENVIRONMENT_AND_EFFECTS.md` amendment note | recorded; no counter reset or reduced |
| Decision 9 confirmed (restore only after payment; buyer never sees seller history) | `APBM_RULINGS.md` | recorded; proven live (§3 D, E-partial) |
| Friday's 17 Nov diff confirmation | `APBM_RULINGS.md`, `SUCCESSOR_INPUTS.json` | **text not received by Engineering in this session.** Nothing about its content or named hash is claimed. Verified fact: the installed pack equals `~/Downloads/APBM007B_BUILD_PACK_v1.zip`, SHA-256 `08d5448b60d2410d08f25c5addfc73c842971db4a0bac9242c4a7d8d6ac31f01`, 123 members, CRC clean, all 122 indexed files byte-identical to `/home/moose/APBM007B_INSTALL/APBM007B_BUILD_PACK_v1_0_r1_PENDING_RELEASE`. The module differs from that pack only by the r02 header edits (`r02_header_hash_changes.json`) and E2 records. The original v0.1 pre-E2 review bytes remain **MISSING** (disclosure preserved). A match with Friday's confirmation can be stated only once its text/hash is supplied. |

## 2. Private inputs

- **Mail allowlists:** the five exact cast addresses were appended privately to Portal and OwedBook `.env.local`
  (`MAIL_ALLOWLIST`, no wildcards). Guard probe: cast address → allowed (both apps); any other address → blocked; 0 sends.
  Proof servers receive the lists in memory only when started with `proof-serve.mjs start --mail live`.
- **Engineering cast file:** `~/.apbm007b/engineering_cast.json` (0600, dir 0700). Passwords exist only for identities
  Engineering created (OWNER_A, OWNER_B); ADMIN, MEMBER and INVITEE have none.
- **Inboxes:** no IMAP access exists. `inbox.mjs` now supports one entry **per mailbox** (each lists the cast addresses it
  receives) and a **manual mode**; `--check` reports every role as `manual`. Four mailboxes are involved (INVITEE is a
  plus-address of OWNER_B's mailbox). Manual record limits are written into every entry (`INBOX/manual_observations.json`).
- **Resend:** the configured key is send-only. Reading message status returned 401 once per message (2 reads, not retried),
  so provider-side delivery state is not available to Engineering.

SCRATCH identity check (before any use): none of the five cast addresses existed on SCRATCH (30 users scanned); the
007A invitee address was **not** present. QA-reserved identities NEW_ADMIN / NEW_MEMBER / EXISTING_INVITEE untouched.
Now created: OWNER_A, OWNER_B (O-1 fixtures), ADMIN and MEMBER (by the product's new-invitee path). INVITEE not yet created.

## 3. Checks run in the amended envelope

| Check | Result | Evidence |
|---|---|---|
| **A. O-1 live lifecycle** (one test clock, OWNER_A: 2 stores) | **PASS.** Mid-period product Add Store 2,450 = bound quote = invoice, below 4,900. Removal scheduled (renewal preview 14,800). Failing card → renewal fails at R → `grace`, ends R+7d; Portal + OwedBook show grace (browser). Notice 1 (payment failed) **sent via Resend**; day-5 read-only warning **sent**. Day 7: `read_only`; app Add Store refused; SQL new grant denied 42501; reads allowed; owner billing reachable; both apps show read-only, Portal keeps "Fix billing" (browser). Owner pays the **same** delinquent invoice → active; replay of the oldest failure event → `duplicate`, access stays active; both apps active (browser). Removal finalized at R. | `O1/o1r03/state.json`, `e2e/apbm007b.o1-state.spec.ts` 2/2 at each of grace / read_only / active |
| **B. APA variant / PE-09** (OWNER_B, APA 10%) | **PASS.** First invoice 8,910 (990 discount). Mid-period Add Store 2,450 = quote, no discount carried. Renewal 14,800 = quoted renewal (coupon is `duration=once`, consumed by Stripe at creation). | same |
| **D. Decision 9 product proof** | **PASS.** Operator `removed-store-reactivate` → owner paid re-add (3,774 = quote) → activated business **is the original row**; owner reads its history (`owedbook_rows`) after payment. | `O1/o1r03/state.json` (reactivate) |
| **C. Browser decline→abandon, hosted 3DS** (proof owner c-r03) | **PASS.** Declined card → "Payment needs your action" → "Cancel and don't add this store" → "nothing was charged (you cancelled)"; invoice void, no store, quantity unchanged. 3DS card → hosted link shown → TEST challenge completed on Stripe's page → invoice paid → real `invoice.paid` delivered → `store_activated`, quantity 2→3, anchor unchanged; dashboard shows the store. | `C/c-r03/` |
| **G. 007A regression cancel→undo** | **PASS.** Stripe Billing Portal cancel → event applied → app shows the schedule, Add Store refused `409 cancellation_scheduled` → "Undo cancellation" → cleared in Stripe and mirror; quote allowed again. | `GF/gf-r03/` |
| **F. Operator with provider calls** | **PASS.** Transfer authorize→cancel: quantity 2→1→2, store active. Owner replace: owner changed, Stripe customer email follows the new owner; repeat → `already_owner`. (E's authorize/complete also applied: 3→2, source `transferred`, NPI `transfer_held`.) | `GF/gf-r03/`, `E/e-r03/state.json` |
| **Invitations to real inboxes** | Sent: MEMBER (member) and ADMIN (store admin, incumbent stays member) via the OwedBook staff panel; UI "Invitation email sent."; both `pending`, 1 dispatch each. Delivery is by SCRATCH Supabase Auth; arrival unobserved (manual checks 3–4). Acceptance NOT RUN. | `INVITE/inv-r03/results.json` |
| **E. Transfer buyer through registration** | **BLOCKED after authorize + complete.** Registration reached review; Engineering's script ticked 2 of 3 consents, the product correctly refused; **no** checkout operation, Stripe customer or payment exists (verified). The reservation stays counted, so customers and subscriptions are 12/12. Script fixed. The buyer's hold runs to ~19 Nov 03:33 UTC. | `E/e-r03/`, ledger seq 179 |

Quality gates (Portal, this round's changes are scripts/e2e only): `tsc` clean; `eslint` 0 errors (new files clean);
`jest` 482/482. Privacy scan of `r03/`: 0 hits. Product source unchanged since the r02 proof build.

## 4. Envelope after r03 (cumulative, conservative)

| Counter | Ceiling | Used | Left |
|---|---|---|---|
| Aggregate attempted cents | 480,000 | 424,704 | 55,296 |
| Explicit pay / hosted | 30 | 24 | 6 |
| Payment attempts | 60 | 46 | 14 |
| Stripe customers / subscriptions | 12 / 12 | 12 / 12 | **0 / 0** |
| Test clocks / advances | 4 / 30 | 2 / 15 | 2 / 15 |
| Invoice create / item / finalize / void | 30 each | 25 / 17 / 18 / 9 | 5 / 13 / 12 / 21 |
| Subscription mutations | 50 | 26 | 24 |
| APA redemptions | 3 | 3 | 0 |
| Emails | 24 | 5 | 19 |
| SCRATCH identities / chain cycles | 14 / 12 | 11 / 2 | 3 / 10 |

## 5. Deviations and observations (stated plainly)

1. **Blind retry (procedural deviation):** after E's first registration run failed, the phase was re-run once to read the
   error. The ledger refused it before any provider call; it created one extra SCRATCH registration draft. Recorded in the
   ledger.
2. Three engineering script faults (wrong column names twice, wrong page for "Manage billing"): each found after the
   journey or before any effect; results re-read from stored state; **no effect repeated**.
3. Observation, not a defect: after Stripe's hosted page there is no return link to the operation; activation then relies
   on the deployed webhook, the jobs runner, or a polling page. The contract does not require a return path.
4. Fixture artefact: the O-1 fixture subscriptions were inserted without `checkout_operations`, so their two
   `subscription_create` `invoice.paid` events stay retryable `awaiting_mapping` (unchanged 007A logic; product
   subscriptions always have the operation).
5. **Open cleanup:** the c-r03 proof subscription (E's seller) stays live for E. It must be cancelled before its real
   renewal (~17 Dec 2026). O-1 clock deleted (customers A/B deleted, verified).

## 6. Decisions / inputs needed (Director / Tony)

1. **E:** either (a) allow the ledger to release the verified-unexecuted reservation seq 179 (1 customer, 1 subscription,
   9,900 cents, 1 pay), or (b) raise customers and subscriptions 12 → 13. With either, E resumes once (registration →
   Checkout → deliver → verify) before ~19 Nov 03:33 UTC.
2. **Manual inbox checks 1–4** (`node scripts/apbm007b/inbox.mjs --manual-list`): OWNER_A inbox, two notices; MEMBER and
   ADMIN inboxes, invitation sign-in emails. Then confirm each with `--manual-confirm`, or tell Claudy the result.
3. **Invitation acceptance:** the MEMBER and ADMIN holders open the link on **this machine** while the proof servers run.
   A Resend from the panel issues a fresh link if one expired; each Resend counts one email.
4. **SCRATCH Auth SMTP** (r02 checklist item 5): whether SCRATCH sends to real inboxes; the built-in mailer may send only
   to project team addresses.
5. **Friday's confirmation text/hash**, to reconcile against the verified pack SHA above.
6. DEV apply release (manifest unchanged: `r02/DEV_APPLY_MANIFEST.md`).
