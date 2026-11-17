# APBM-007B E2 — checkpoint r04 (engineering in progress; NOT the final handoff)

Claudy · 17 November 2026, ~11:15 Asia/Dhaka. Covers the Director's instructions after r03: manual inbox receipt, invitation
acceptance, the link-format fix, the 12 → 13 customer/subscription amendment, check E, and cleanup.
Git: both repos on `apbm-007b`, HEADs unchanged (Portal `c68c4ac`, OwedBook `0b78552`), nothing staged, no commit, push,
merge or deployment. DEV: **not applied** (re-verified unchanged, read-only). No QA result, approval or certification claimed.

## 1. Manual inbox receipt (Tony, 09:55 Asia/Dhaka)

Recorded as **manual receipt observations** only (`INBOX/manual_observations.json` ids 1–4; not acceptance results, not
automated checks): OWNER_A payment-failed notice 09:18 and 48-hour read-only warning 09:19; MEMBER and ADMIN Supabase Auth
magic-link emails 09:41. Id 5 (check E buyer access email, 10:55) is registered and **awaiting** a human check.

## 2. Invitation sign-in link: finding and fix

`ACCEPT/LINK_FORMAT_FINDING.md`. The first MEMBER email used the provider-default `/auth/v1/verify` link. With supabase-js'
implicit flow, that link would have redeemed the token and returned the session only in a URL fragment the server never sees.
OwedBook's confirm route accepts only `token_hash`, so no session would have been created. Causes: (1) SCRATCH lacked the
approved token-hash Magic Link template (DEV had it since 007A); (2) **Engineering's 007B defect**: the invitation mail
appended `?next=/invitations` to the redirect.

- **Code (OwedBook, uncommitted; `CODE_OWEDBOOK_LINK_FIX/`):** `invitationMail.ts` requests exactly
  `${ownOrigin()}/api/auth/confirm`. In `emailLink.ts`, after a verified sign-in with no explicit return path, a person with
  pending invitations (their own `my_invitations()`) goes to `/invitations`; a failed read keeps the default. New tests: confirm
  routing (pending → `/invitations`, failed read → default) and a pin that both mail modules request the exact address. A
  planted `?next=x` makes the pin fail (control proven, then restored). OwedBook jest **312/312**; tsc and eslint clean.
- **Build:** proof pair rebuilt; served identity MATCH both (OB `4e43362f…`, PP `09ffa057…`). Clean OwedBook build + client
  scan: clean except the documented auth-js `generateLink` baseline exception (1 file); artifact id equals the proof build
  (`BUILD/`).
- **Configuration (Director):** SCRATCH Magic Link template saved with exact branches for the two proof confirm addresses;
  both redirect URLs listed.
- **Exposed link:** the MEMBER link pasted into chat was replaced by the normal Resend (04:18Z). The provider's single
  one-time-token record for MEMBER changed creation time (`ACCEPT/resends.json`; no token value selected).

## 3. Invitation acceptance (real inboxes, separate private browser sessions on the VM)

Fresh links via the normal Resend after the template change (MEMBER attempt 3/5, ADMIN 2/5). Tony accepted MEMBER (10:43) then
ADMIN (10:45). Verified (`ACCEPT/a1_before.json`, `a1_after.json`, `a1_role_checks.json`):

| | Before | After |
|---|---|---|
| Invitations | both `pending` | both `accepted`, each by the matching identity |
| Store A1 admin | OWNER_A | **ADMIN** (exactly one admin) |
| OWNER_A | admin | member (disposition "stay as member"), still account owner, owner billing available, can appoint an admin |
| MEMBER | — | member; sees A1 only; reads records; cannot invite; no owner billing |
| ADMIN | — | admin; sees A1 only; reads records; can invite members; cannot appoint an admin; no owner billing |

Role probes ran as each person inside rolled-back transactions (0 rows left). MEMBER and ADMIN last sign-in times are after
the resend, so both emailed links signed them in.

## 4. Check E — transfer buyer through normal registration (PASS)

`E/e-r03/state.json`. Earlier (r03): seller history seeded; operator authorize (seller quantity 3 → 2) and complete (source
`transferred`, NPI `transfer_held` for the buyer email).

- **Registration + checkout:** anonymous registration with the buyer email and the SAME NPI; all three consents ticked; product
  created one Checkout session (USD 9,900). The first browser run stopped on Stripe's page before card entry (the "Card" choice
  is a 0×0 accessibility button), and the second stopped at the same point. **Neither submitted anything.** The SAME open
  session was then completed once (`e-checkout-complete.mjs`): session `complete`/`paid`, returned to `/register/activation`.
- **Payment and activation:** the run's 12 real events were delivered signed to the proof Portal (no listener in the proof
  setup). `checkout.session.completed`, `customer.subscription.created` and `invoice.paid` → `provisioned`; checkout operation
  `provisioned`.
- **Transfer:** `completed`. The buyer business is a **new row** on the **same pharmacy identity**; store and access `active`.
  Buyer access email sent once (SCRATCH Auth; manual check id 5 pending).
- **History isolation:** the buyer's scope excludes the source store; the buyer reading the source store is denied (`P0001`);
  the buyer's own store shows none of the seller's history rows (0 rows); the buyer's history list does not include the source.
  The seller account's current owner still lists it (the original fixture owner no longer does, having been replaced in
  check F).
- The activation page shows "no registration in progress on this browser" because payment finished in a fresh browser. That is
  the product's designed message pointing to the emailed link.

## 5. Cleanup

`CLEANUP/provider_cleanup_receipt.json`: check-C proof subscription canceled and customer deleted; check-E buyer subscription
canceled and customer deleted; O-1 clock deleted earlier. After: 0 live E2-marked customers / subscriptions / test clocks /
open invoices. Left alone: four `apbm007a`-marked subscriptions from 12 and 16 Nov (not this run's). SCRATCH labelled rows
retained. Proof servers 3100/3101 still running (owned).

## 6. Effects (cumulative; ceilings per Director amendments)

| Counter | Ceiling | Used | Left |
|---|---|---|---|
| Aggregate attempted cents | 480,000 | 434,604 | 45,396 |
| Explicit pay / hosted | 30 | 25 | 5 |
| Payment attempts | 60 | 47 | 13 |
| Stripe customers / subscriptions | 13 / 13 | 13 / 13 | 0 / 0 |
| Emails | 24 | 9 | 15 |
| SCRATCH identities / chain cycles | 14 / 12 | 12 / 2 | 2 / 10 |
| Test clocks / advances | 4 / 30 | 2 / 15 | 2 / 15 |
| DEV apply / DEV identities | 1 / 0 | 0 / 0 | — |

Seq 179 (r03's unexecuted reservation) stays counted, as instructed. Full ledger: `EFFECTS/ledger.jsonl` and `counters.json`.

## 7. Final DEV-apply manifest

`DEV_APPLY_MANIFEST_FINAL.md`: 0061–0069 hashes unchanged and equal to the 69-entry inventory (0 mismatches); 0069 approved; DEV
catalogue re-read read-only = `fab5247f…` (DEV unchanged). Apply procedure unchanged; it awaits its separate release.

## 8. Deviations (plain)

- Check E checkout: two automation stops on Stripe's page before any submission, then one completion of the same session. No
  second registration, customer, session or payment. Ledger seq 192 carries two settle records: "not submitted" and then
  "paid".
- One engineering column-name read error (checkout-operation field in E verify). It was re-read directly; no step repeated.

## 9. Still open

- Manual check id 5 (buyer access email in the INVITEE inbox).
- DEV apply release (manifest final).
- Remaining for the final handoff: final rebuild/scan of both apps at the candidate, full AC transcription in the QAM handoff,
  final inventory, and ENGINEERING COMPLETE only when factual.
