# Staging mail and Auth configuration — stakeholder testing (prepared, NOT configured or verified)

Prepared by Claudy, 20 November 2026, for the Director. Nothing here has been applied to any environment. Values marked
"verify" must be checked by the Director in the provider console. No secret values appear here.

## 1. The mail paths (both apps; each needs its own setting)

| Path | Sender | App guard | What lets tester aliases through |
|---|---|---|---|
| OwedBook store invitations (`src/server/invitationMail.ts`) | Supabase Auth sign-in email (custom SMTP) | `mailGuard.ts` before any claim | OwedBook `MAIL_RECIPIENT_POLICY=open` (DEV/alpha project only), or exact `MAIL_ALLOWLIST` |
| Portal billing notices (`src/server/billingNotices.ts`) | Resend HTTPS API, `Cyber Pharma <no-reply@cyberizedev.com>` | `mailGuard.ts` | Portal `MAIL_RECIPIENT_POLICY=open` (DEV/alpha only), or exact `MAIL_ALLOWLIST` |
| Sign-in links (both apps), Portal access email after purchase | Supabase Auth (custom SMTP) | none (unchanged) | Supabase Auth and SMTP settings only (§3) |

## 2. App settings (runtime; restart, no rebuild)

```
MAIL_RECIPIENT_POLICY=open          # OwedBook AND Portal; honoured only when NEXT_PUBLIC_SUPABASE_URL is yrsuwikjnbmvpznrgydb
MAIL_ALLOWLIST=                     # may stay as is; exact entries still pass under either policy
NEXT_PUBLIC_SUPPORT_EMAIL=support@pharmacybooks.com   # optional (this is the default); NEXT_PUBLIC_* is compiled at build
NEXT_PUBLIC_TERMS_URL=              # Director input — required before external exposure (build-time)
NEXT_PUBLIC_PRIVACY_URL=            # Director input — required before external exposure (build-time)
```

- Under `open`, any single syntactically valid address passes, plus aliases included (`moose+alpha01-member@cyberizegroup.com`).
  Malformed, multi-recipient and wildcard input is refused.
- On any other Supabase project, including a future production project, `open` is ignored and the exact allowlist
  applies. `*` and `MAIL_GUARD=off` are ignored everywhere.
- Rate and abuse limits are unchanged:
  - **Invitations:** at most 5 sends per invitation, 60 s apart, 7-day expiry.
  - **Notices:** one per (invoice, kind), at most 5 attempts, idempotent.
  - **Sign-in requests:** existing per-process limiters.
- Local runs now: replace the per-address entries in both `.env.local` files with `MAIL_RECIPIENT_POLICY=open` if you want arbitrary aliases. Restart both apps.

## 3. Supabase Auth (DEV project `yrsuwikjnbmvpznrgydb`) — verify in the dashboard

1. **Custom SMTP** (Director-reported): host `smtp.resend.com`, port 465, sender `no-reply@cyberizedev.com`. Verify that it is enabled and that the Resend domain `cyberizedev.com` is **verified**. With a verified domain, Resend delivers to any recipient. In test mode it delivers only to the account's own address.
2. **Auth email rate limit** (Authentication → Rate limits → email sent per hour): custom SMTP allows raising it. Set it to cover a session; for example three testers × four aliases × several links is about 30–60 per hour.
3. **Site URL and redirect allowlist:** must include each served origin's `/api/auth/confirm`.
   - **Local:** `http://localhost:3000/api/auth/confirm` and `http://localhost:3001/api/auth/confirm` (existing).
   - **Staging:** the origins frozen in `src/lib/appIdentity.ts`, `https://owedbook.cyberizedev.com` and `https://owedbook-payment.cyberizedev.com`.
   - **Alpha domains:** `owedbook.alpha.cyberizedev.com` and `payment.alpha.cyberizedev.com` need an approved source change to `appIdentity.ts` in both apps first (GATE_D_HANDOFF §5 item 2). Still open.
4. **Magic-link template:** keep the approved token-hash template (`{{ .RedirectTo }}?token_hash=…`). Token lifetime stays 3600 s unless the Director changes it.
5. **Plus aliases:** confirm the testers' mailbox provider delivers `+` aliases to the base inbox. Send one test to each tester before the session.

## 4. Verification to record before calling staging configured

- One invitation to a fresh plus alias arrives, and the link signs that alias in on the right origin.
- One sign-in link per app arrives.
- An address outside the allowlist on a non-DEV project is blocked. The unit test proves this; repeat it on the deployed config.
- Resend dashboard: the notice sender is verified, and one test notice has been observed in an inbox (contract: inbox observation required).
