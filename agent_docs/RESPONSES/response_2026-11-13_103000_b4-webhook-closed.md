## Webhook failure closed — two signed events processed, subscription left active

After your fix, the portal loads the listener's secret; I checked that before any action. I used OWNER_1's existing paid subscription only. No checkout, no payment and no identity were created.

### Result

| Step | Result |
|---|---|
| Cancel in Stripe's billing portal | `cancel_at` scheduled on the same subscription |
| **Signed `customer.subscription.updated` for the cancel** | **Delivered by the listener, verified, recorded and processed** |
| **Mirror after the cancel** | **Updated by the webhook:** end date set, still active |
| App billing page | Shows the end date and an Undo button, read from the updated mirror |
| Undo from the banner | Stripe shows no schedule; same subscription; active |
| **Signed event for the undo** | **Processed** |
| Mirror and page afterwards | Clear; no cancellation shown |
| Webhook ledger on DEV | Exactly these two events, both processed, none failed |
| Subscription | **Active, no cancellation scheduled**; still one subscription; nothing charged |

The 12 November failure stays in the record and is marked closed.

### A third defect, found and fixed

The first two undo attempts from the banner answered 502. The undo's idempotency key was built from the subscription and its cancellation date. Yesterday's undo had cleared the same date, so Stripe returned that cached answer and changed nothing. The app saw the schedule still set and, correctly, did not claim success.

Each undo now uses a fresh key, which is safe because clearing a schedule twice is harmless. I added a unit test, and the undo then worked first time. Portal tests: 390 of 390.

### Still open

- **Webhook coverage on DEV** is proven for subscription updates only. Checkout-completion and invoice events were not redelivered there; that path was proven by the reconcile route here and by webhooks on SCRATCH.
- **NOT RUN cases are unchanged.** Most importantly the brand-new owner remains a coverage gap, not passed.

### Updated return

`/home/moose/Downloads/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r02.zip`, with the original in the module's `QAM/HANDOFFS/` (r01 kept). 218 members, 216 indexed. SHA-256 `0e39567443889cba48e62b2076164f41eaf3338b8325cba8ae7298187fc45d75`. Scanned clean.

The handoff, proof record, counters, state and journal are updated. Effects today: 3 sign-in tokens for OWNER_1, 1 portal session and 3 undo calls. Your servers and the listener were not touched. Nothing is committed.
