# CP-2 return — provider clock part (record, PE-09, BP-06)

Engineer: Claudy · 16 November 2026, Asia/Dhaka · Instrument `scripts/apbm007b/testclock.mjs --cp2 --label cp2a`
(cwd Portal root) · `stripe` 22.1.0, API `2026-04-22.dahlia` · evidence `cp2a/state.json`, `cp2a/preflight.json`,
`cp2a/cleanup_receipt.json`.

**Driver decision:** the **fixed external standalone driver** (this instrument) is used, not an application fixture
path. The Portal's registration creates its own Stripe customer inside the checkout saga and has no seam to attach a
test clock; adding one would put clock creation into production code paths, which CLOCK_AND_NOTICES.md forbids for the
fallback. The external driver owns provider chronology; the SQL side is a private SCRATCH-only time context
(migration 0061 + `fixture-clock`), tested separately.

**Provider part: PASS.** **SQL exclusion part: NOT YET RUN** — it needs migration 0061 on SCRATCH (reported as CP-2b).
O-1 product journey stays blocked on CP-2b, not on the provider.

## PE-09 — mid-period incremental invoice under the clock

| Account | Clock time | Period | Quote (contract formula, clock time) | Invoice | Renewal preview after qty 2 |
|---|---|---|---|---|---|
| Ordinary | day 15 of 30 (fraction 0.5) | 2026-11-16 → 2026-12-16 | **2450** | 2450 paid, `manual`, no discount line | 14800, no discount |
| APA (first invoice 8910) | same | same | **2450** | 2450 paid, no discount line | 14800, no discount |

Quote equals invoice, below 4900, and the earned first-store discount is neither reapplied nor reclaimed.

## BP-06 — seven-day record (ordinary account, failing card, 2 stores)

Renewal invoice `subscription_cycle` 14800, created at clock renewal R = 2026-12-16 17:07:34 UTC.

| Clock | Subscription | Invoice | Attempts | Next provider attempt |
|---|---|---|---|---|
| R + 1 h | `past_due` | open | 1 | R + 1.8 d |
| day 1 | past_due | open | 1 | R + 1.8 d |
| day 2 | past_due | open | 2 | R + 3.6 d |
| day 3 | past_due | open | 2 | R + 3.6 d |
| day 4 | past_due | open | 3 | R + 5.4 d |
| day 5 | past_due | open | 3 | R + 5.4 d |
| day 6 | past_due | open | 4 | R + 7.3 d |
| day 7 | past_due | open | 4 | R + 7.3 d |
| day 8 | past_due | open | 5 | R + 9.1 d |
| day 8, working card pays the same invoice | **active** | paid | 5 | none |

Derived facts for the lifecycle contract and Q1 (from this record, not from defaults):

1. The provider never leaves `past_due` within the grace week: no `unpaid`/`canceled` before day 8. Read-only at
   day 7 is therefore an **application** state from the stored grace start, not a provider state.
2. One `invoice.payment_failed` per attempt (5 in 8 days), all `billing_reason=subscription_cycle`, same invoice. Grace
   start must come from the **first** failure of that invoice and must not move on later retries (existing
   `subscription_grace_start` keeps the first; to be re-proved on SCRATCH).
3. Retries continue after day 7 (next at ~day 9.1); a late automatic success would restore the subscription to
   `active` — the app must clear grace on the paid event for that same invoice.
4. The second account on the same clock (APA, working card) renewed automatically and stayed `active`.
5. Stripe's retry policy and failed-payment email setting are **not readable by API**; the schedule above is observed,
   and whether Stripe itself e-mails customers on failure is **UNKNOWN** (customers had no address, so nothing could be
   delivered). Changing either setting is outside this release.

Automatic provider attempts (5 failed renewal attempts, 1 successful APA renewal; 88,800 cents) were recorded in the
effect ledger after observation; they were not sent by an instrument.

## Delivery isolation

0 endpoints, 0 event destinations, 0 local Stripe CLI listeners before and after. Three events briefly showed
`pending_webhooks` 1–2 and read 0 shortly after; the same transient was seen in the E1 probes. A consumer on another
machine cannot be excluded from here.

Cleanup: clock deleted with its two customers and subscriptions (`cleanup_receipt.json` COMPLETE). APA redemptions now
2 of 3.
