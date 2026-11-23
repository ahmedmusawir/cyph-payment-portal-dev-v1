# Payment Portal alpha — signed webhook delivery check (2026-11-21)

**Result: signature verification PASSED. Business processing: the request finished with HTTP 200 and no error; which of the three success outcomes it was is NOT established.**

## Verified before sending (Stripe CLI 1.55.11, authenticated; no listener started)

- Account: `acct_1RxzixGnEQDyu3RR`, "Cyber Pharma · sandbox" — the account the earlier project records name.
- Endpoint: `we_1Ue5gQGnEQDyu3RRYxHdqat8`, URL `https://cyph-v1-payment-alpha.cyberizedev.com/api/webhooks/stripe`, enabled, `livemode: false`, API version `2025-01-27.acacia`, exactly the seven required events. It is the only webhook endpoint in the sandbox.

## Delivery

- Event resent: `evt_1Udj4FGnEQDyu3RRJuC5BlLE`, `customer.subscription.updated`, created 2026-11-20 04:04 UTC, sandbox. Chosen because it was already delivered to localhost yesterday and a subscription update only refreshes the mirror from Stripe.
- Command: `stripe events resend <event> --webhook-endpoint=<endpoint>` at 2026-11-21 05:05:37 UTC.
- Cloud Run request log: `POST /api/webhooks/stripe` → **200**, user agent `Stripe/1.0`, 0.55 s, 05:05:37 UTC.
- Stripe: `pending_webhooks` on the event went 1 → 0 (delivery accepted).
- No error line in the service log.

## What this proves

- **Signature: PASS (EVIDENCE).** The handler answers 400 `invalid_signature` for a wrong secret, altered bytes or a stale timestamp; an unsigned POST got exactly that earlier today. A 200 is only reachable after the signature check, the sandbox-mode check and the account check.
- **`STRIPE_SECRET_KEY`, `STRIPE_EXPECTED_ACCOUNT`, `STRIPE_PRICE_STORES`, `STRIPE_PORTAL_CONFIGURATION` are present and well-formed (EVIDENCE):** the handler loads all of them before verifying.
- **`SUPABASE_SECRET_KEY` works (EVIDENCE):** every 200 path writes or reads the `stripe_events` table with the service-role key first; a failure there returns 500.
- **Business processing: 200, outcome not identified (GAP).** A 200 body is one of `duplicate` (already finished, no second action), a processed note (mirror refreshed) or `ignored`. The body is not in the Cloud Run log, and the database was not queried. The Stripe dashboard shows the response body under the event's delivery attempt for this endpoint.

Not covered: a new purchase end to end, `RESEND_API_KEY`, the scheduler.
