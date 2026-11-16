## Email observations recorded — delivery PASS, sender NOT VERIFIED, link behaviour UNRESOLVED

Recorded as you instructed, with nothing classified as a successful login or a proven redirect. No SMTP, template or redirect setting was touched. I added one read-only look at what the provider itself recorded for the two links (no token values read).

### Verdicts

| Item | Verdict |
|---|---|
| Delivery to owned test inboxes | PASS (both arrived) |
| Sender | Supabase default mailer, `mail.app.supabase.io` |
| Proposed `cyberizedev.com` sender | NOT VERIFIED; not in use on these emails |
| Sign-in by emailed link | UNRESOLVED |

### What the provider recorded

Both emails were requested at 09:28 Asia/Dhaka (03:28 UTC). I checked at 11:45 (05:45 UTC).

| | OWNER_1 | STORE_ADMIN |
|---|---|---|
| Link token still pending | No, consumed | Yes, never redeemed |
| Session created after the email | One, five seconds after sending: my deliberate exchange | None |

- **OWNER_1:** the link was deliberately superseded five seconds after it was sent, so a failure is the expected result of that test. It is consistent with the one-link-per-user finding but not conclusive, because an expired link would fail the same way and the click time and error were not captured.
- **STORE_ADMIN:** I generated nothing for this identity after the email, and the token is still pending. So the link was never successfully redeemed and no mail scanner consumed it. The control is inconclusive: the link was 2 hours 17 minutes old when I checked, the provider's default lifetime is one hour, and the configured lifetime on DEV is unread.

For STORE_ADMIN I cannot separate three causes: the link was clicked after it expired, the redirect address is not on the allowlist, or the template builds a link the provider rejects. A plain "nothing is running on localhost" explanation is unlikely for an in-time click, because the provider would have consumed the token first.

The provider's audit-log table is empty on this project, so there is no server record of the failed clicks.

### What is certain

DEV Auth is sending through the Supabase default mailer. Resend SMTP with the `cyberizedev.com` sender still has to be connected before access-email acceptance can be tested; that is a settings change for you to make or authorize.

### To resolve the link question

When you have five minutes at the STORE_ADMIN inbox, tell me and I will send one fresh link (email 4 of 12). Click it straight away and report only the click time, the host and path in the address bar afterwards, and any `error_code` shown. A failed link carries no usable token, so those are safe to relay.

### Package

Revision 4 of the review ZIP is at `/home/moose/Downloads/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r4.zip`, with the original in the module's `QAM/HANDOFFS/` folder.
- 75 members, 73 indexed
- SHA-256 `752e34734b96354c08faf9fd80863a3f4e4163c5b76bb619d1dfb302d7510eaa`
- Scanned clean.

The detail is in `EMAIL_OBSERVATIONS.md` in the evidence folder. E2 remains held.
