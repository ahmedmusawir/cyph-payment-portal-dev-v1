# CP-1 return — separate incremental invoice (provider part)

Engineer: Claudy · 16 November 2026, Asia/Dhaka · Instrument `scripts/apbm007b/capability-check.mjs --cp1 --label cp1a`
(cwd Portal root) · `stripe` 22.1.0, pinned API `2026-04-22.dahlia` · Cyber Pharma sandbox, expected account matched,
catalogue graduated 9900/4900 · evidence `cp1a/state.json`, `cp1a/preflight.json`, `cp1a/cleanup_receipt.json`,
`cp1a/O_auth_hosted_after.png`, cumulative ledger `../../effects/ledger.jsonl`.

**Result: PROVIDER MECHANISM PASS.** Add Store money work may proceed on this mechanism. The SCRATCH-side parts of
CP-1 (paid-but-local-failure recovery, expiry/late-payment against real operation rows) need the 0062 schema and the
saga code; they are run as CP-1b once those exist and are reported separately. Nothing below is carried from the
earlier pending-update probes.

| Contract point (BILLING.md / BP-01 / BP-06) | Observed | Step |
|---|---|---|
| Draft standalone invoice: existing customer, no subscription, `charge_automatically`, `auto_advance=false`, `pending_invoice_items_behavior=exclude`, `discounts=[]`, metadata | Accepted by the pinned API; draft has `parent` = none, `billing_reason=manual` | `O:add1`, `P:add1` |
| Exactly one item attached explicitly to that invoice, `discountable=false` | One line, amount = quote, no discount amounts | same |
| Validate draft before money: amount, due, currency, customer, metadata, zero balance | All equal; customer balance 0 | same (`draft_valid`) |
| Finalize with `auto_advance=false`, pay once | Ordinary: paid 4900. APA: paid 4900 | same |
| Then absolute quantity, `proration_behavior=none` | Quantity set; no new invoice; billing anchor and current period unchanged; no pending update; subscription `latest_invoice` unchanged | same |
| Renewal preview after the quantity change (BP-06 a) | Ordinary 2 stores 14800, 3 stores 19700; APA 2 stores 14800; no discount or proration line | same, `O:auth_hosted_complete_then_activate` |
| Earned APA discount preserved, not reclaimed (Director 8) | APA purchase 8910 (990 discount, `once`, consumed by first invoice); add charged 4900 with no discount line; no discount on renewal | `P:fixture`, `P:discount_state_after_purchase`, `P:add1` |
| Decline | `invoices.pay` → 402 `card_declined`; invoice open, paid 0; subscription status, quantity, period, anchor, latest invoice identical; balance 0 | `O:decline` |
| Open/failed/voided standalone invoice leaves subscription and its latest renewal invoice unchanged (BP-06 b) | Confirmed for open-failed and voided; `invoice.payment_failed` events carry `billing_reason=manual` and no subscription | `O:decline`, `O:abandon_void_then_late_pay`, events |
| Abandon: void the open invoice, verify terminal provider state | `void`, paid 0 | `O:abandon_void_then_late_pay` |
| Late payment after void (void wins) | `invoices.pay` on the void invoice refused; stays void, paid 0 | same |
| Payment then void (payment wins) | `voidInvoice` on the paid invoice refused (“Invoices with paid payments cannot be voided”); invoice stays paid — the operation must be preserved as paid | `O:void_after_paid_refused` |
| Authentication required | API pay → 402 `invoice_payment_intent_requires_action`; subscription unchanged | `O:auth` |
| Hosted page completes it | One hosted submission + 3DS test Complete → invoice paid 4900 in ~2 s, PaymentIntent succeeded; then quantity 2→3, anchor unchanged, renewal 19700 | `O:auth_hosted_complete_then_activate` (second record) |
| Lost reply on invoice creation | Reply discarded; bounded enumeration by customer + creation interval + exact metadata found exactly 1; re-send with the same key returned the same invoice; 1 invoice for the operation | `O:lost_reply_reconciliation` (lost3) |
| Sub-minimum refusal by computation only (BP-01) | 30-day period: 6 h left → 41 ¢ refused, 7 h → 48 ¢ refused, 8 h → 54 ¢ allowed; no invoice created | `BP01_sub_minimum_computation_only` |
| Provider customer email (BP-06 c) | Customers have no email address; every invoice `customer_email` null, so the provider had no recipient. Stripe's email settings are not readable by API — **limitation**, not a zero | events step note |
| Delivery isolation | 0 webhook endpoints, 0 event destinations, 0 local Stripe CLI listeners before and after; `pending_webhooks` 0 on all 93 run events | `preflight.json`, `events_and_delivery` |

## Deviations in my own run (not provider behaviour)

1. First hosted submission: my automation clicked the challenge button before its handler was bound; the challenge
   stayed open (`requires_action`). Fixed (wait for visible+enabled, settle, re-press within the same submission);
   second submission completed. Both submissions are counted.
2. First lost-reply attempt finalized an empty draft, which the provider settles as a $0 paid invoice (no charge);
   the second attempt's delete call had a wrong argument order and left an empty draft, deleted in the clean rerun.
   Lesson recorded for the product: **an invoice with no line must never be finalized**; the saga attaches its item
   and validates the draft before finalizing.
3. Idempotent replays during resumed phases were reserved again in the ledger, so `invoice_create` (12) overstates
   provider creations (9 invoices actually created). Counters are conservative and were not reduced.

Cleanup: both subscriptions cancelled, both customers deleted (`cleanup_receipt.json` COMPLETE). APA fixture
redemptions: 5 → 6 (1 of the 3 allowed).

## CP-1b — the saga on real SCRATCH + Stripe sandbox: PASS (5/5)

`node scripts/apbm007b/integration.mjs --suite store` (cwd Portal) → `src/integration/apbm007b-store.itest.ts`; output
`cp1b_scratch_itest.txt`. One synthetic SCRATCH identity; run-owned Stripe customer/subscription, cancelled/deleted at the end.

| Case | Result |
|---|---|
| Quote → confirm → pay once → quantity +1 (no proration) → atomic activation | quote 4900 = invoice 4900 paid, standalone (`parent` null); quantity 2; renewal preview 14800; one store row |
| Double submit / lost reply (same intent) | same operation returned; still exactly one invoice |
| Paid, then activation lost (fault injected once) | state `paid_pending_activation`; owner status poll converges to `activated`; one invoice, one `pay` intent; quantity 3 |
| Decline then owner abandon | `payment_pending` with subscription status/quantity/latest_invoice unchanged and no grace; abandon voids, verifies `void`/paid 0, releases the NPI hold → `expired_unpaid` |
| Deadline expiry via the job path | 3DS-required card → `payment_pending` with hosted URL offered; deadline moved into the past on this run's own operation row (fixture time shift, labelled); job advance voids and verifies → `expired_unpaid`, `deadline_passed` |
| Removal then undo | quantity −1 then +1 with `proration_behavior=none`; cutoff = provider period end; renewal preview 14800 after removal; no invoice created by either |

Not covered here (covered elsewhere or open): hosted-page completion through the product (provider part proven in CP-1a);
late payment after void race on a product row (provider refusal proven in CP-1a; SQL routing proven in sql-proof).
