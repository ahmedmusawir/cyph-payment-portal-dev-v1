# APBM-007B — Focused check 2 and read-only ledger receipt (PE-11)

Run `E1_CHECK2_20261116_204015` · Engineer seat: Claudy · 16 Nov 2026 · E2 not released; nothing implemented.
This is provider capability evidence and one read-only database receipt. It is not product QA.

| Part | Result |
|---|---|
| A. DEV ledger search (PE-11) | **COMPLETED. 94 IDs searched, 0 matches, 94 missing.** |
| B1. Hosted authentication completes a pending Add Store | **OBSERVED.** |
| B2. Real APA purchase, then Add Store | **OBSERVED.** Quote equals invoice. The add cost **$58.90, not $49.00**. |
| Cleanup | **COMPLETE.** Nothing of this run remains active. |

Identities: `stripe` SDK 22.1.0, pinned API `2026-04-22.dahlia`, Cyber Pharma sandbox (test mode, expected account
matched), store price graduated 9900 / 4900. Baseline pair unchanged before and after: Portal
`c68c4acaccc4a68f20ede267f06cfda17fa15aac`, OwedBook `0b785524a621c4384db8bee47ef9b4149b8ab44c`.

## A. Read-only DEV ledger search — PE-11

Receipt: `evidence/A_ledger_search_receipt.json`. Script: `scripts/A_ledger_search.mjs`.

- **IDs:** the 94 event IDs recorded by the first capability return
  (`E1_PROBE_20261116_191218_claudy/evidence/40_void_auth_and_events.json`, `events[].id`). The full list and its
  SHA-256 are in the receipt.
- **Identity:** the SQL target, the Portal's configured project, OwedBook's configured project and the harness's
  approved DEV reference are the same project (`all_match: true`). The connection reported
  `transaction_read_only = on`, `statement_timeout = 30s`, and `public.stripe_events` exists.
- **Statements:** `begin transaction read only`; `set local statement_timeout = '30s'`; 2 SELECT statements (ceiling
  8) — one session check, one search `where event_id = any($1)` over the exact IDs; `rollback`.
- **Result:** 0 rows. 94 of 94 IDs are absent from the DEV ledger.
- Writes 0. No recovery endpoint, schema change or deletion. No row was read other than by exact ID, so no unrelated
  row, payload or address was returned.

What it shows: no event of the first capability check was recorded in DEV's event ledger. Because the handler writes
its receipt row before classifying an event, this is direct evidence that none of those events was delivered to and
accepted by the DEV-backed Portal. What it does not show: whether any event was delivered somewhere else, or
delivered and rejected before the insert (bad signature, wrong account).

## B1. Hosted authentication on a pending Add Store — OBSERVED

Evidence: `evidence/20_hosted_setup.json`, `21_hosted_submission1.json`, the two `21_hosted_submission1_*.png`
screenshots, events in `40_events_and_delivery_*.json`.

1. Probe subscription H, quantity 1, working test card: active, first invoice $99.00 paid.
2. Default card changed to the authentication-required test card. Add Store 1→2 previewed at $49.00 and applied with
   the same parameters and proration timestamp, `payment_behavior=pending_if_incomplete`. The call returned HTTP 200.
   Subscription stayed `active` at quantity 1 with a `pending_update` (quantity 2, about 23 hours to expiry). Invoice
   `open`, PaymentIntent `requires_action` / `use_stripe_sdk`. Events at that moment:
   `invoice.payment_action_required` **and** `invoice.payment_failed`, both `billing_reason = subscription_update`.
3. Hosted invoice page opened in system Chrome (headless). Before submitting, no challenge element existed in any
   frame. One submission: "Confirm payment".
4. The challenge appeared two frames deep: page → `js.stripe.com/v3/three-ds-2-challenge-…` (depth 1) →
   `testmode-acs.stripe.com/3d_secure_2_test/…` (depth 2). The button is `<button id="test-source-authorize-3ds">`
   with the text "Complete". It was located by id across the flattened frame tree, recorded, then clicked once.
5. About two seconds later, by API read: invoice `paid`, amount paid $49.00, `attempt_count` 1; PaymentIntent
   `succeeded`; subscription `active`, **quantity 2, `pending_update` null**. The page showed "Invoice paid $49.00".
6. Events on completion: `invoice.payment_succeeded`, `invoice.paid` (`subscription_update`),
   `customer.subscription.updated` (previous attributes `items`, `pending_update`, `quantity`) and
   **`customer.subscription.pending_update_applied`**.

Quoted $49.00 = invoiced $49.00 = paid $49.00.

Why the first check failed here: the button's text is "Complete" (shown upper-case by styling), so an exact match on
"COMPLETE" found nothing; the earlier loose match clicked a different element. Targeting by id in the depth-2 frame
is what works.

Limits: one run, one card type, sandbox test challenge, headless Chrome. The live challenge is the bank's own page and
was not exercised. The hosted page ran an invisible hCaptcha frame; it did not block this run, and I cannot say it
never would.

## B2. Real APA purchase, then Add Store — OBSERVED

Evidence: `evidence/10_apa_purchase_then_add.json`.

**Purchase.** New probe subscription P, quantity 1, created with promotion code `APA10SANDBOX`.

| | Before | After purchase | After Add Store |
|---|---|---|---|
| Promotion code `times_redeemed` | 4 | 5 | 5 |
| Coupon `times_redeemed` (10 % off, duration `once`) | 4 | 5 | 5 |
| Subscription `discounts` | — | empty | empty |
| Customer discount | — | none | none |
| Customer balance | 0 | 0 | 0 |

First invoice: subtotal $99.00, discount $9.90, total and paid **$89.10**, `billing_reason = subscription_create`.
The `once` coupon was consumed by that invoice: events `customer.discount.created` and `customer.discount.deleted`
carry the same second as the payment, and by the first read the subscription held no discount. Exactly one redemption
was added to the fixture, as authorized. The promotion code, coupon, price and catalogue were not edited.

**Add Store 1→2**, preview and apply with identical parameters and one proration timestamp, 15 seconds apart:

| | Preview | Actual invoice |
|---|---|---|
| Line: unused time on 1 store "(with 10.0% off)" | −$89.10 | −$89.10 |
| Line: remaining time on 2 stores | +$148.00 | +$148.00 |
| Discount amounts | none | none |
| Total / amount due | **$58.90** | **$58.90**, paid, `subscription_update` |

Quote equals invoice. Subscription active at quantity 2, no pending update. Next renewal preview: $148.00, no
discount.

**What this means.** With Stripe's default proration, the credit for the first store's unused time is the discounted
$89.10 that was paid, while the new charge is at full price. Seconds after purchase that makes the second store cost
$58.90: $49.00 plus the $9.90 discount handed back. The amount shrinks as the month runs (the credit is prorated), and
it is zero for an add made after the first renewal. So for an APA member adding a store in the first month, the
"additional store $49" statement is not what Stripe charges. Either the product accepts and displays the quoted
amount, or the add must be priced another way; that is a contract decision, not one taken here.

Also confirmed: the discount does not carry to the add (no discount on the add invoice or on renewal), and the add
consumes no further redemption.

Limits: observed once, immediately after purchase, with `billing_mode` flexible as the account creates it. An add
later in the period, or after a renewal, was not run (no test clocks). The first check's preview of a fresh
never-discounted subscription gave $49.00; the difference is entirely the discounted credit line.

## Preflight and delivery isolation

`evidence/00_preflight.json`, `40_events_and_delivery_before_cleanup.json`, `40_events_and_delivery_after_cleanup.json`.

- Test mode; account matches the configured expected account; price is the configured graduated catalogue.
- Registered webhook endpoints: 0. Event destinations: 0. Local `stripe listen` processes: 0. Each checked before
  mutations, before cleanup and after cleanup.
- `pending_webhooks` was 0 on every event of this run at both reads (54 events before cleanup, 58 after).
- No marker-carrying customers existed before the run.
- **Uncertainty that remains:** a listener on another machine is not visible from here, and Stripe's API does not list
  CLI listeners. I therefore report delivery isolation as *no delivery path found and no pending delivery observed*,
  not as proven. A PE-11-style search for this run's event IDs was not authorized and was not run; the IDs are in the
  evidence if you want one.
- Emails: both customers were created with no email address. Stripe's email settings are not readable by API and were
  not changed.

## Usage against ceilings

| Budget | Ceiling | Used |
|---|---|---|
| Customers / subscriptions | 2 / 2 | 2 / 2 |
| Payment-method attachments | 4 | 3 |
| Default-card updates | 4 | 3 |
| Pending-update calls | 4 | 2 |
| Previews | 6 | 3 |
| Payment attempts (API and browser) | 8 | 5 |
| Hosted browser submissions | 2 | 1 |
| Attempted charges | $500.00 | $345.00 counted; $301.90 actually captured |
| Invoice voids | 2 | 0 |
| Cleanup cancellations / deletions | 2 / 2 | 2 / 2 |
| DEV SELECT statements | 8 | 2 |
| Emails, Auth operations, test clocks, DEV writes | 0 | 0 |
| Time after preflight | 30 min | about 2.5 min of mutations |

Counted charges: $89.10 + $58.90 + $99.00 + $49.00 (API attempt that required authentication) + $49.00 (hosted
submission). The last two are the same $49.00 invoice, counted twice because both were attempts. No automatic retry
by Stripe was observed. Failed calls: 0 of 61 ledgered calls. No mutation was retried.

## Cleanup

`evidence/90_cleanup_receipt.json`: **COMPLETE**. Both probe subscriptions cancelled (no proration, no final invoice),
both probe customers deleted, each confirmed by direct retrieval after an ownership check on the run marker. No open
invoice remained. The four paid invoices were recorded before cleanup in
`40_events_and_delivery_before_cleanup.json` (`invoices_preserved`).

Remaining, by design: the APA fixture's redemption count is now 5 (was 4). Stripe keeps the paid test invoices and
events of the deleted customers. Customer search by marker still listed the two customers immediately after deletion;
search is eventually consistent and direct retrieval shows them deleted.

## Limitations

- Sandbox behaviour on one day, one API version, single observations. Not a statement of permanent retry safety.
- Nothing here exercises the application; the Portal was not involved in any step.
- The ledger search covers the first check's IDs only, on DEV only.
- Evidence is sanitized: the hosted invoice link was held in memory only and never written; the account identifier
  inside one frame address is shortened to its last four characters in `21_hosted_submission1.json` and in the call
  ledger's account read. Screenshots show the challenge and the paid page, with no address bar.
- No product edits, Git mutations, application servers or shared-setting changes.

## Files

| File | Content |
|---|---|
| `FINDINGS.md` | This report |
| `scripts/lib.mjs` | Shared library: private credential read, ceilings enforced before each call, ledger, no retries |
| `scripts/A_ledger_search.mjs` | PE-11 read-only search |
| `scripts/00_preflight.mjs`, `10_apa_purchase_then_add.mjs`, `20_hosted_setup.mjs`, `21_hosted_submit.mjs`, `40_events_and_delivery.mjs`, `90_cleanup.mjs` | The run, in order |
| `evidence/A_ledger_search_receipt.json` | Exact ledger-search receipt |
| `evidence/call_ledger.jsonl` | Per-call ledger, 61 lines |
| `evidence/state.json` | Counters and this run's object ids |
| `evidence/00_preflight.json`, `10_…json`, `20_…json`, `21_…json`, `21_…png` ×2, `40_…json` ×2, `90_cleanup_receipt.json` | Evidence per step |
| `FILE_INDEX.json` | Sizes and SHA-256 of every file |
