## Magic-link template proposal — for your review, nothing applied

Recorded explicitly: **the 12:43 link to OWNER_1 was NOT clicked.** There is no click result, and link behaviour stays UNRESOLVED. No email was sent, no link generated, and no setting or product file changed for this proposal.

### What the two routes do

Both apps have `GET /api/auth/confirm`, and the code is the same except for the failure page.

| Step | OwedBook | Payment Portal |
|---|---|---|
| Reads from the query string | `token_hash`, `type`, optional `next` | Same |
| If both are present | Calls `verifyOtp({ type, token_hash })`, which sets the session cookie | Same |
| On success | Redirects to `next`, or `/` if absent | Same |
| On failure or missing parameters | Redirects to `/error` | Redirects to `/login` |

One correction: I said earlier that both routes fail to `/error`. Only OwedBook does; the portal goes to `/login`. Neither shows the reason.

The current email body uses `ConfirmationURL`, which never puts `token_hash` in the query string. That is why I expect the current link to fail in the app even when the provider accepts it.

### Proposed template

This goes in the Magic Link template body. The link goes straight to the app's route and carries the token hash.

```html
<h2>Sign in to Cyber Pharma</h2>

<p>Use the button below to sign in. The link works once and expires soon.</p>

<p>
  <a href="{{ if or (not .RedirectTo) (eq .RedirectTo .SiteURL) }}{{ .SiteURL }}/api/auth/confirm{{ else }}{{ .RedirectTo }}{{ end }}?token_hash={{ .TokenHash }}&amp;type=email">Sign in to Cyber Pharma</a>
</p>

<p>If you did not ask for this email, you can ignore it. Nobody can sign in without this link.</p>
```

### How it picks the app

- Each app asks for its own address when it requests the email: OwedBook sends `http://localhost:3000/api/auth/confirm`, the portal sends `http://localhost:3001/api/auth/confirm`.
- The provider checks that address against the allowlist and, if it matches, gives it to the template as `RedirectTo`.
- The template uses `RedirectTo` as the link's base. So the click lands on the route of the app that asked, and that app sets its own cookie.

### When the redirect is absent or invalid

- **Absent, or not on the allowlist:** the provider replaces it with the Site URL. The template detects that and builds `<Site URL>/api/auth/confirm`. The user is signed in to OwedBook, since the Site URL is OwedBook's. A portal user with a bad redirect therefore lands in the wrong app, signed in, rather than on a dead link.
- **Without that condition** (a plain `{{ .RedirectTo }}?token_hash=…`): the link would point at the OwedBook home page, the token would never be used, and the user would not be signed in. This is the fallback version if the Dashboard refuses the conditional on save.
- **Allowlisted address with a query string:** the link would contain two `?` and break. Both apps must request the exact allowlisted address with nothing appended.

### Risks to weigh

- **The allowlist is the security boundary.** This template sends the token hash to whatever `RedirectTo` holds. Keep the two exact entries; a wildcard would let a requester route a user's token to any matching path.
- **`type=email` is unproven on DEV.** It is the provider's documented current value. E1 proved `type=magiclink` works on this project. If `email` is rejected, change that one word.
- **The absent-redirect branch is unproven.** It rests on the provider substituting the Site URL exactly. One test with no redirect would settle it.
- **Mail scanners can use up the link.** The route signs in on a plain GET, so a scanner that opens links would consume it before the user does. Fixing that is an E2 product choice (a confirm button page), not a template matter.
- **Local cookies overlap.** Both apps on `localhost` still use default cookie names, so signing in to one affects the other until the E2 cookie-name change.

### What it would take to prove

After you save the template: one email with the OwedBook redirect and one with the portal redirect, each clicked within five minutes with that app running. That is emails 5 and 6 of 12. I will send nothing until you say so.

### State

Emails 4 of 12, unchanged. The review ZIP is still revision 4 and does not include today's later entries. The proposal is saved as `AUTH_EMAIL_TEMPLATE_PROPOSAL.md` in the evidence folder. E2 remains held.
