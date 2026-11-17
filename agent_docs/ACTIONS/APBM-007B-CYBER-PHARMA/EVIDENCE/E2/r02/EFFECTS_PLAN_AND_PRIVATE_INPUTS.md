# APBM-007B E2 r02 — remaining Stripe checks vs the envelope, proposed increase, private email inputs

Claudy · 17 November 2026, Asia/Dhaka. Counters are the cumulative ledger `EVIDENCE/E2/effects/counters.json` (conservative:
replays and one failed-before-payment browser run were reserved and never reduced). **No Stripe activity has been started
since this calculation.**

## 1. Remaining Stripe-dependent checks (minimum set) and their effects

| Check | Customers | Subs | Clock / advances | Invoices (create=item=finalize) | Explicit pay / hosted | Payment attempts (incl. automatic) | Attempted cents |
|---|---|---|---|---|---|---|---|
| A. O-1 live lifecycle on one clock: 2-store owner (first invoice 14,800 automatic); mid-period product Add Store (≈2,450); schedule removal of one store; failing card; renewal (2 stores, 14,800) fails at R and retries ≈R+1.8 d, +3.6 d, +5.4 d (4 automatic attempts, stopping at day 7.1); owner pays the same invoice (14,800) | 1 | 1 | 1 / 5 | 1 | 2 | 7 | 91,250 |
| B. APA variant on the same clock: APA purchase (8,910, last of 3 redemptions); mid-period product Add Store (≈2,450); automatic successful renewal at R (2 stores, 14,800) | 1 | 1 | — / (shared) | 1 | 1 | 3 | 26,160 |
| C. Browser decline→abandon and hosted 3DS journeys: proof owner (2 stores, 14,800); declined add (≈4,900) voided; 3DS add: API attempt + hosted submission (≈4,900 each) | 1 | 1 | — | 2 | 3 | 4 | 29,500 |
| D. Decision 9 product proof on account A after renewal: operator authorization + paid re-add of the removed store (≈3,760) | — | — | — | 1 | 1 | 1 | 3,760 |
| E. Transfer buyer through normal registration (also the 007A first-store purchase regression): seller = account C; buyer registers and pays in Stripe Checkout (9,900) | 1 | 1 | — | — | 1 | 1 | 9,900 |
| F. Operator commands on proof servers (transfer authorize/cancel quantity sync, owner-replace customer-email step, admin set, quantity-check, close refusal) | — | — | — | — | — | — | — (≤5 subscription/customer mutations) |
| G. 007A regression cancel→undo on account C | — | — | — | — | — | — | — (2 subscription mutations) |
| **Total needed** | **4** | **4** | **1 / 5** | **5** | **8** | **16** | **160,570** |

Other counters needed: subscription mutations ≈14, PM attaches 6, default-card changes 8, APA redemptions 1, SCRATCH
identities 4, emails ≤5 once inputs exist. No account stays subscribed past cleanup, so no later automatic renewal occurs.

## 2. Against the remaining envelope

| Counter | Ceiling | Used | Remaining | Needed | Fits? |
|---|---|---|---|---|---|
| Stripe customers / subscriptions | 12 / 12 | 8 / 8 | 4 / 4 | 4 / 4 | yes (exactly, no spare) |
| Test clocks / advances | 4 / 30 | 1 / 10 | 3 / 20 | 1 / 5 | yes |
| Invoice create / item / finalize / void | 30 each | 20 / 12 / 13 / 8 | 10 / 18 / 17 / 22 | 5 / 5 / 5 / 1 | yes |
| Explicit invoice pay / hosted submit | 24 | 16 | 8 | 8 | yes, but zero spare (one retry exhausts it) |
| Payment attempts (all) | 60 | 30 | 30 | 16 | yes |
| **Aggregate attempted cents** | **300,000** | **264,120** | **35,880** | **160,570** | **NO — short by 124,690** |
| Subscription mutations | 50 | 15 | 35 | ≈14 | yes |
| PM attaches / default changes | 24 / 30 | 13 / 16 | 11 / 14 | 6 / 8 | yes |
| APA redemptions | 3 | 2 | 1 | 1 | yes (last one) |
| Emails | 24 | 0 | 24 | ≤5 | yes |
| SCRATCH identities / chain cycles | 14 / 12 | 4 / 2 | 10 / 10 | 4 / 0 | yes |

## 3. ONE proposed increase (for Tony)

> Raise the E2 **aggregate attempted simulated charge ceiling from USD 3,000 to USD 4,800**, and the **explicit invoice
> pay / hosted submission ceiling from 24 to 30**. All other limits unchanged.

That leaves 215,880 cents against the 160,570-cent plan (one repeat of the costliest step fits) and 14 pay/hosted against 8.
Until it is granted, no further Stripe activity is started; everything not needing Stripe continues.

## 4. ONE private setup checklist (email inputs) — values never go in Git, chat or packages

1. **Portal** `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/.env.local` — add:
   - `MAIL_ALLOWLIST=` the five engineering addresses below, comma-separated, exact (no wildcards).
   - `BILLING_EMAIL_FROM=Cyber Pharma <no-reply@cyberizedev.com>` (optional; the code already defaults to exactly this).
   - `RESEND_API_KEY` — already present; nothing to add. The key must be allowed to send from `no-reply@cyberizedev.com`.
2. **OwedBook** `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/.env.local` — add the same `MAIL_ALLOWLIST=` line (invitations are sent by OwedBook).
3. **Engineering cast** `/home/moose/.apbm007b/engineering_cast.json`, file mode **0600** (`chmod 600`), directory mode 0700:
   ```json
   { "ENGINEERING_OWNER_A": { "email": "…", "password": "…" },
     "ENGINEERING_OWNER_B": { "email": "…", "password": "…" },
     "ENGINEERING_ADMIN":   { "email": "…", "password": "…" },
     "ENGINEERING_MEMBER":  { "email": "…", "password": "…" },
     "ENGINEERING_INVITEE": { "email": "…" } }
   ```
   Five distinct controlled addresses you can receive (plus-addresses of one mailbox are fine). Passwords are for SCRATCH
   identities I create for these addresses (choose any strong value; `ENGINEERING_INVITEE` has none — it proves the
   new-invitee path). Do not reuse QA's NEW_ADMIN/NEW_MEMBER/EXISTING_INVITEE addresses.
4. **Inbox access** `/home/moose/.apbm007b/inbox_access.json`, mode **0600**:
   ```json
   { "adapter": "imap", "host": "imap.example-provider.com", "port": 993, "user": "…", "password": "…", "mailbox": "INBOX" }
   ```
   One IMAP account that receives all five addresses (for Gmail: IMAP enabled + an app password). Access is read-only
   (`EXAMINE`); nothing is deleted or flagged.
5. **SCRATCH Auth email** (invitation sign-in links are sent by SCRATCH's Supabase Auth, not Resend): confirm SCRATCH has a
   working SMTP sender for real inboxes, or tell me the built-in mailer is acceptable (it is rate-limited). I will not
   change any Auth setting.

Check when done (prints shapes and role names only): `node scripts/apbm007b/inbox.mjs --check` and
`node scripts/apbm007b/env-preflight.mjs` (cwd Portal).
