## Email sent to OWNER_1 — paused for your click

The provider accepted the request at 14:27:24 Asia/Dhaka (08:27:24 UTC), with `shouldCreateUser:false` and redirect `http://localhost:3000/api/auth/confirm`. One call, no retry. This is email 5 of 12. I will generate nothing and run no handoff for OWNER_1.

Before sending I confirmed that the address you named matches OWNER_1 in the private inbox file, and that something is listening on port 3000.

### Before you click

- **Use a private window, or sign out of the APBM003 login first.** The link signs the browser in as OWNER_1 and will replace the APBM003 session in that browser.
- **OWNER_1 has no stores.** It is one of the four E1 identities, with a platform role and a profile only. A successful sign-in may land on an empty or restricted page; that is still a pass for the link.
- **Do not paste the full link or address back.** It carries the token.

### What to report

| Item | What I need |
|---|---|
| Arrival, sender, subject | As shown |
| Link shape | Does it start with `http://localhost:3000/api/auth/confirm?token_hash=`, and end with `type=email`? Yes or no; no token value |
| Click time | To the minute |
| After the click | Host and path only, and whether you appear signed in |

After your report I can read the provider's record (read-only) to confirm whether the token was used and a session created.

No setting, product file or Git state was touched. The review ZIP is still revision 4. E2 remains held.
