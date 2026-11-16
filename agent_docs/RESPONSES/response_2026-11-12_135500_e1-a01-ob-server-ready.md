## OwedBook is running on port 3000 and reachable — nothing sent

The server is up at `http://localhost:3000`. No email was sent, no link generated, and no product file, setting or Git state changed.

### How it was started

- It runs from the disposable OwedBook copy in the external work lane, in dev mode. That copy's source is identical to the repo checkout.
- The repo's `.env.local` is linked into the copy, not copied or printed.
- Port 3000 was free beforehand. The server on 3457 was not touched.

### Reachability

| Path | Result |
|---|---|
| `/` | 200 |
| `/error` | 200 |
| `/api/auth/confirm` with no parameters | 307 to `http://localhost:3000/error` |

The confirm route answers on `localhost:3000` and redirects on the same host, so a session cookie set there will stick. That check makes no call to the provider.

### Token handling

The server's log passes through a filter that blanks the value of `token_hash` and the other token parameters before anything is written. I tested it with a dummy value and it did not reach the log.

### Reading the result later

- **Success** lands on the OwedBook home page, signed in.
- **Failure** lands on `/error`, with no reason shown. I can then read the provider's record to tell a rejected link from one that was never used.
- The Payment Portal is not running; port 3001 is still empty. This test covers the OwedBook branch of the template only.

The server stays up until you tell me to stop it. I am waiting for your word before sending anything; the next email would be 5 of 12. E2 remains held.
