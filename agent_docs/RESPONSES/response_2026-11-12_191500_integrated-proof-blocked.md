## Integrated proof stopped at preflight — one portal setting is still wrong

The portal's `NEXT_PUBLIC_SITE_URL` is still `http://localhost:3000`. The portal refuses to act when its configured address is not its own, by design, so every registration, checkout, billing and handoff request fails closed. I have not started the proof. Nothing was created: no session, identity, email, Stripe object or DEV row.

### What I need

In `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Then restart the portal server. A `NEXT_PUBLIC_` value is read at start-up, so a restart is required; OwedBook and the Stripe listener can keep running. Tell me when it is up and I run the proof straight through.

### Preflight results

| Check | Result |
|---|---|
| OwedBook :3000 and portal :3001 running from the expected checkouts | Yes |
| Stripe listener forwarding the seven handled events to the portal | Yes |
| Portal Stripe, APA and environment settings | All present, apart from the site address |
| OwedBook settings, with the old `STRIPE_*` lines removed | Yes |
| Webhook with no signature, and with a forged signature | Both rejected (400), nothing recorded |

### A defect I found and fixed

OwedBook's handoff start route had been copied to the wrong path (`/api/handoff` instead of `/api/handoff/start`). It was my error from the auth port. The unit tests did not catch it because they call the server code directly rather than through the routes.

- Moved the file. Your running OwedBook server picked it up without a restart; the route now answers correctly.
- Added a check in both apps that every handoff and sign-in route file is at its expected path. 53 tests pass in each app.

### Already noted for the report

The brand-new-owner case (an address with no existing account) will be reported as a coverage gap, not passed. All four approved inboxes already have accounts on DEV, and no new identity is authorized.

The record is `EVIDENCE/E2/r01/integrated/INTEGRATED_PROOF.md`.
