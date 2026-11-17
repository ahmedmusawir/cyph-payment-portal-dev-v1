# Invitation sign-in link format — finding and fix (17 Nov 2026, Claudy)

**Observed (Tony, MEMBER email, not opened):** link = `https://ihgcsrypblqkwommrkgj.supabase.co/auth/v1/verify…`, redirect_to =
`http://localhost:3100/api/auth/confirm?next=%2Finvitations`. Token not recorded here.

**Would it establish a session? No.** That is the provider's default `{{ .ConfirmationURL }}` template. The provider redeems the
token on the click, then redirects. The server-side request used supabase-js' default **implicit** flow, so the session comes
back only in a `#access_token…` URL fragment, which browsers never send to a server. OwedBook's `GET /api/auth/confirm` accepts
only `token_hash` + `type` (007A FC-4: GET stores the context, an explicit button POST calls `verifyOtp`). The click would
have used up the token and landed on `/auth/link-expired` with no session. Tony stopping was correct.

**Two incompatibilities:**
1. **SCRATCH configuration:** SCRATCH still has the default Magic Link template. DEV received the Director-approved token-hash
   template in 007A (E1 `EMAIL_OBSERVATIONS.md`, 12 Nov: explicit branches for the exact confirm addresses, `token_hash` +
   `type=email`, no link otherwise). SCRATCH (used by the proof pair 3100/3101) never got the equivalent.
2. **007B code defect (Engineering's):** the invitation mail requested `…/api/auth/confirm?next=/invitations`. The approved
   template design needs the EXACT allowlisted address with nothing appended (a query string breaks the link, and an exact
   template branch would not match). The 007A sign-in mail already follows that rule.

**Code fix (OwedBook, uncommitted):** `src/server/invitationMail.ts` now requests exactly `${ownOrigin()}/api/auth/confirm`.
`src/server/emailLink.ts` `confirmSubmit`: after a verified sign-in with no explicit return path, if the person's own
`my_invitations()` (read as that person) lists any pending invitation, the destination is `/invitations`; a failed read keeps the
default. Tests: new confirm test (pending → `/invitations`, failed read → default); new boundary pin (both mail modules request
the exact address; a planted `?next=x` makes it fail — control proven, then restored). OwedBook jest 312/312, tsc, eslint clean.
Proof pair rebuilt (OB artifact `4e43362f…`, PP `09ffa057…`), served identity MATCH both, started with live mail.

**Exposed link:** the MEMBER link pasted into chat was replaced by the normal staff-panel Resend at 04:18:45Z (attempt 2 of 5,
1 email). The provider's one-time token record for MEMBER is a single row whose creation time changed to the resend
(`resends.json`; no token value selected), so the pasted link no longer works. That resend email is still in the old format
(template not yet changed) and must not be used either.

**Configuration step (Director, Supabase Dashboard, SCRATCH project only):** Magic Link template with explicit branches for
`http://localhost:3100/api/auth/confirm` and `http://localhost:3101/api/auth/confirm`, plus both exact entries in the Redirect
URLs allowlist. Then fresh links are issued by the normal Resend.

Fact also established: SCRATCH Auth delivers to real Gmail inboxes (Tony saw both magic-link emails), answering r03 §6 item 4.
