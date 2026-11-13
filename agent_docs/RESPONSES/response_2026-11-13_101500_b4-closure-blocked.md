## Webhook check stopped before any Stripe action — the portal still loads the old secret

I took no Stripe action, and no subscription, ledger entry or DEV row changed.

### What I found (equality and length only; no value shown)

- **Your new secret is in the file.** The listener's secret matches line 12 of the portal's `.env.local`.
- **The old one is still there too.** The same file has a second `STRIPE_WEBHOOK_SECRET` on line 39, holding the old value.
- **The old one wins.** When a key appears twice, Next.js keeps the later line. I loaded the environment the way Next.js does, and the portal runs with the old value. Signed deliveries would still be refused.
- **Everything else is ready.** The portal restarted at 10:06, the listener is on the Cyber Pharma sandbox and forwards to the portal, and unsigned requests are still refused.

### What I need

Delete line 39 (the older `STRIPE_WEBHOOK_SECRET`) so only the listener's value remains, then restart the portal. Tell me when it is up.

### Then

1. I recheck the loaded value against the listener.
2. I sign OWNER_1 back in with one admin-generated token; the logout check signed them out everywhere.
3. I cancel in the billing portal and confirm the signed delivery, the processed ledger row and the mirror showing the schedule.
4. I undo from the app's banner and confirm a second delivery and the cleared mirror.
5. The subscription is left active, and I update the handoff and the ZIP with the evidence.

The earlier failure stays recorded. No new checkout or payment.
