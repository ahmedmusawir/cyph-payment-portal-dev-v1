## E2 engineering return — integrated proof reconciled, handoff and ZIP delivered

No new checkout was created after your instruction and no identity was created at any point. Everything stays uncommitted for you.

**Package:** `/home/moose/Downloads/APBM-007A-CYBER-PHARMA_E2_ENGINEERING_r01.zip`, with the original in the module's `QAM/HANDOFFS/`. 214 members, 212 indexed. SHA-256 `9be2a131ec74ea9928f511e40870ae392e15cab35aab28bbaed6e5117e2fda55`. Scanned clean; no screenshots, environment files or browser state inside. Start at `ENGINEERING_HANDOFF.md`.

### Reconciliation

- **The successful attempt is attempt 8** (20:47–20:49): sign-in, registration with the APA code, payment of $89.10 USD, provisioning. It is the only paid Checkout session.
- **Attempts 2–7 failed and are kept in the log.** Causes were the dev server compiling new routes on first hit, harness selectors on Stripe's page, and one real product defect (below). Their five open Checkout sessions were each closed through the app's "go back and edit", which proved abandonment five times.
- **One correction to the counters:** an earlier attempt counted a payment that Stripe had refused, and I removed it. Stripe now shows 6 customers, 6 Checkout sessions (1 paid, 5 expired unpaid) and 1 subscription.

### PASS

- **Sign-in link:** opening the link redeems nothing; the button signs in; replaying the link is refused.
- **Registration and payment:** server quote, the allowlisted code, consents, and Stripe payment in USD.
- **Provisioning:** exactly one account, store, designated admin, customer mapping and mirrored subscription. OWNER_1's platform role stays member.
- **Owner pages:** dashboard and the card on file.
- **Handoff, both directions:** sessions are minted correctly, the same-user case mints nothing, and two crossings fit inside 60 seconds.
- **Different user already signed in:** the switch page appears and nothing is replaced until the deliberate button.
- **Denials:** store admin, member, unrelated owner, anonymous, the cross-store read, cross-origin requests and an unsafe return path are all refused. The synthetic fixture shows "test account — no billing".
- **Billing portal:** a cancellation there sets `cancel_at`, and the app's undo clears it on the same subscription. This closes E1 gap U4.
- **Logout:** provider-wide; it ends the session in both apps.

### FAIL

**Signed webhook delivery (B4).** The portal's `STRIPE_WEBHOOK_SECRET` is not the running listener's secret (I compared them for equality only). Every delivery was refused, so provisioning came from the status page's reconcile path. That recovery path is now proven live; the webhook leg is not.

To fix: set the portal's `STRIPE_WEBHOOK_SECRET` to the value from `stripe listen --print-secret` and restart the portal. One cancel-and-undo in the billing portal on the existing subscription would then prove delivery, ledger and mirror without a new checkout.

### NOT RUN

- **Brand-new owner: a coverage gap, not passed.** OWNER_1 already exists, so it proves only the existing-identity paths. This case was proven on SCRATCH before the identity ceiling was reached.
- **Existing identity signed out at purchase, and a declined card:** each needs a new checkout.
- **Renewal failure with a test clock:** needs a sandbox seam not built, and a new checkout.
- **Sign-in email delivered and clicked:** no email was sent in this run.
- **Only-card removal:** observed only.
- **Not covered:** Mission Control, and browsers other than desktop Chromium.

### Fixed during the proof

- **OwedBook handoff route:** the handoff start route was at the wrong path. Fixed, with a route-file check added in both apps.
- **Stripe Adaptive Pricing:** it showed the price in BDT. Now switched off on every Checkout session, with a guard test.

### Checks after the fixes

OwedBook 276 tests and the portal 389 tests pass. Typecheck is clean and lint has 0 errors in both. Production builds and the client-bundle secret scan are clean.

### Left for you

1. The webhook secret fix.
2. Decisions on the NOT RUN cases. Closing the brand-new-owner gap on DEV needs one identity extension.
3. The commit.
4. Then independent Q1.

OWNER_1's paid sandbox subscription is still active for your product walk. Your servers and listener were not touched. No deployment before 007B.
