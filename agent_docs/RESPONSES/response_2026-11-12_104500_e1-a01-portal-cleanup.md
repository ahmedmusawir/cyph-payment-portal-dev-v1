## E1 a01 continuation — candidate B passed in the hosted portal; cleanup done with one exception

Candidate B passed, so I did not test candidate A in the portal. All probe objects are cleaned up except the portal configuration: Stripe made it the sandbox **default** and refuses to deactivate it. Your approval was for non-default configurations, so that condition was not met.

### Hosted-portal results for candidate B

Browser evidence is what a headless Chromium saw on `billing.stripe.com`; API evidence is what Stripe returned afterwards.

| Check | Evidence | Result |
|---|---|---|
| Portal opens for the graduated-price subscription | Browser | Yes: product, $99.00 per month, next billing date, card, invoice history |
| Customer controls offered | Browser | Cancel subscription, add or delete payment method, invoice search and link. No quantity, plan or promotion control |
| Cancel | Browser | Confirmation says access continues to 12 December 2026 |
| State after hosted cancel | API | Active, `cancel_at` 2026-12-12, `cancel_at_period_end` false |
| Undo ("Don't cancel subscription") | Browser | Renew page, one button |
| State after hosted undo | API | Active, no cancel date, same subscription |
| Portal at three stores | Browser | "×3", $197.00 per month, "First 1 $99.00" and "2 and above $98.00"; still only Cancel |

Not exercised: adding or deleting a card, and opening an invoice PDF.

### Two new findings

- **Hosted cancellation sets `cancel_at`, not `cancel_at_period_end`.** The subscription mirror must read both, or a portal cancellation will look like no cancellation.
- **The first portal configuration created in an account becomes its default.** The app must always pass its own configuration ID when creating sessions.

### Cleanup receipts (read back from Stripe)

| Object | State |
|---|---|
| Subscription A `sub_1UaobwGnEQDyu3RR6nd3Oulo` | canceled |
| Subscription B `sub_1UaobzGnEQDyu3RRr923vkuQ` | canceled |
| 3 prices | inactive |
| 3 products | inactive |
| Promotion code | inactive |
| Coupon | deleted |
| Portal configuration `bpc_1UapfzGnEQDyu3RR3M3rwV9q` | still active; sandbox default |
| 2 test customers | retained for invoice evidence |

The sandbox now has 0 active products, 0 active prices, 0 coupons and 1 active portal configuration. The leftover configuration allows only card update, invoice history and end-of-period cancellation. To replace it, save your own portal settings in the sandbox Dashboard.

### Cumulative effects

| Surface | Used | Ceiling |
|---|---|---|
| Stripe mutations | 46 | 100 |
| Stripe reads | 83 | 200 |
| Portal configurations | 1 | 2 |
| Portal sessions | 3 | 12 |
| Auth identities | 4 | 4 |
| Auth session calls | 24 | 32 |
| Provider sign-outs | 3 | 8 |
| Emails | 3 | 12 |

Two of the 46 mutations were refused calls: the configuration deactivation, and a coupon delete my helper sent malformed (fixed and retried once).

### Still open

- **Inbox check:** OWNER_1's link should fail; STORE_ADMIN's should be accepted. Tell me whether each arrived and the sender domain.
- **Database URL:** `APBM_DEV_DB_URL` (and SCRATCH) for the migration ledger, grants and `auth.sessions`.
- **Auth settings:** SMTP, redirect allowlist, template shape, expiry.
- **Review decision:** one live sign-in link per user.
- **Git before E2:** lock restore, deleted example file, portal remote, `apbm-007a` branches.

No product code, migration, branch, commit or deployment was touched. E2 remains held.

### Package

Revision 2 of the review ZIP is at `/home/moose/Downloads/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r2.zip`, with the original in the module's `QAM/HANDOFFS/` folder.
- 67 members, 65 indexed
- SHA-256 `e30233b89a71f40666d2ee889f3433d223f0f5ec0ec009e7fb5ea4c9351e408c`
- Scanned clean; the 7 portal screenshots are included and were not text-scanned.

The first ZIP is unchanged and now superseded.
