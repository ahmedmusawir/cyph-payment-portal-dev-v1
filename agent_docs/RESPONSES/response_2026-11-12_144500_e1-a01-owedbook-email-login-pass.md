## OwedBook emailed sign-in recorded as PASS — plus one unexpected finding

Your browser observation is recorded, and the provider's record agrees with it. The same read turned up something you should know: the earlier 12:43 link was used at 13:38 by a Windows browser that I did not dispatch.

### The 14:27 link

Read-only check at 14:39; no token or credential was read.

| Check | Result |
|---|---|
| Identity | The Auth user holding the OWNER_1 address from the private file |
| Link token | Consumed |
| Session after the send | One, created 14:35 Asia/Dhaka, minted by the OwedBook server |
| Platform role | `member` |
| Accounts owned | 0 |
| Store memberships | 0 |

The session came from the app's confirm route using the `token_hash` in the link, which is the path your revised template targets. "No store data" is the expected view for an identity with no account or store.

**Scope:** this proves the OwedBook emailed-login path only, on localhost. Payment Portal login, automatic handoff and paid provisioning are not proved, and neither are the template's no-link branch or link expiry.

### Unexpected: the 12:43 link was used at 13:38

- The provider shows a session for OWNER_1 created at 13:38:13, from a client identifying as a browser on Windows 10.
- I dispatched nothing for OWNER_1 between 12:43 and 14:27, and my own exchanges all identify as `node`.
- The only live link then was the 12:43 email. It was still pending when I checked at 13:36.

This conflicts with your 13:39 note that the link had not been clicked. I cannot tell from the record whether a person opened that email on a Windows device or a mail scanner or link preview did. Can you confirm whether anyone opened it on Windows at about that time?

It matters for the design either way. A link that signs in as soon as it is opened can be used up by anything that opens it, and the revised template has the same property at the app route. I have recorded it as finding F-A7 with the cause unresolved.

### Counters

| Surface | Used | Ceiling |
|---|---|---|
| Emails | 5 | 12 |
| Auth sessions | 26 | 32 |
| Provider sign-outs | 3 | 8 |
| Auth identities | 4 | 4 |
| Stripe mutations | 46 | 100 |
| Stripe reads | 83 | 200 |
| Portal sessions | 3 | 12 |

The two link-minted sessions are counted against the session allowance, although I did not dispatch them. Say so if you would rather they were not.

### Evidence

- `EMAIL_OBSERVATIONS.md` has the full timeline. The report, capability results, effect capsule, action list and preflight ledger are updated to match.
- The effect capsule now also records the local server I ran from 13:54 to 13:57 and stopped on your order.
- Revision 5 of the review ZIP is at `/home/moose/Downloads/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r5.zip`, with the original in the module's `QAM/HANDOFFS/` folder: 85 members, 83 indexed, SHA-256 `3c36712675c78ee1c16b4bc1811f55a0f526291419b080bee92312eab0f224de`, scanned clean.

No setting, product file or Git state was touched. E2 remains held.
