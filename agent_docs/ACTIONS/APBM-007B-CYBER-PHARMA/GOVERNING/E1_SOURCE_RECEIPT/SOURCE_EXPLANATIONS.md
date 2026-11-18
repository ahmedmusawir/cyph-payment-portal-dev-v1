# Source explanations (HEAD pair, exported files)

References are to files in this package. `M/00NN` = `source/owedbook/supabase/migrations/00NN_*.sql`;
`PP/…` = `source/payment-portal/…`; `OB/…` = `source/owedbook/…`. All statements describe committed source, not what
is applied to any database.

## 1. Permanent store identity and NPI uniqueness

**Identity.** A store is one row of `public.businesses`. Its permanent identity is the surrogate key
`id uuid primary key default gen_random_uuid()` (`M/0003:16`). Every tenant-scoped record points at that id
(`business_id` on `user_data`, `report_files`, `audit_logs`, `user_businesses`), so the id, not the NPI, is what
history hangs from. The store belongs to an account through `account_id uuid not null references accounts(id)`
(`M/0003:17`); nothing in the schema makes `account_id` immutable.

**NPI uniqueness for existing stores.** `create unique index uq_businesses_npi on public.businesses(npi)`
(`M/0054:12`), global, over every row whatever its `status`. `npi` is `text not null` (`M/0003:19`). The older pair
constraint `uq_businesses_ncpdp_npi unique (ncpdp, npi)` (`M/0003:52`) is still present; `ncpdp` became nullable
(`M/0054:13`). There is no CHECK on `businesses.npi`, deliberately, because the five synthetic fixtures do not pass
the ten-digit rule (`M/0054:2`).

**Validity.** `public.npi_is_valid(text)`: ten digits and Luhn over `80840` + NPI (`M/0054:16-28`), service-role
execute only.

**NPI uniqueness for stores in progress.** `public.npi_reservations` (`M/0056:31-41`): `npi` checked by
`npi_is_valid`, and `create unique index npi_reservations_one_active on npi_reservations(npi) where status in
('held','checkout_bound')`. So at most one live claim per NPI. `npi_reserve` (`M/0056:54-88`) takes
`pg_advisory_xact_lock(hashtextextended('apbm007a:npi:'||npi,0))`, refuses when a `businesses` row already has that
NPI (line 67), and otherwise inserts a 30-minute hold. `npi_bind` (`M/0057:83-93`) ties the hold to one checkout
operation and extends it to the Checkout session's expiry plus five minutes. `npi_release_unpaid` (`M/0057:97-106`)
releases only for an operation already recorded `expired_unpaid`, never by time alone. Provisioning marks it
`consumed` (`M/0058:49`).

**Consequences for 007B.**

- A reservation belongs to a `registration_drafts` row (`draft_id … not null`, `M/0056:34`) and an operation in
  `checkout_operations`. There is no reservation path for an added store of an existing account.
- Because `uq_businesses_npi` covers every status, a removed or transferred-out store row keeps its NPI taken. A
  transfer that gives the buyer a new store row with the same NPI cannot coexist with the old row under this index.
- `businesses.status` allows only `pending`, `active`, `suspended` (`M/0003:45`).

## 2. Access paths that expose historical records

One function decides almost all reach: `public.my_business_ids()` as redefined in `M/0048:8-13`:

```
select ub.business_id from user_businesses ub where ub.user_id = auth.uid()
union
select b.id from businesses b where is_owner_of_account(b.account_id);
```

`is_owner_of_account` is `accounts.owner_user_id = auth.uid()` (`M/0048:2-5`). Neither branch looks at
`businesses.status`, a date, or the subscription.

| Path | Predicate | Source |
|---|---|---|
| `user_data` SELECT (claims history) | `business_id in (select my_business_ids())` | `M/0021:28-30` |
| `user_data` INSERT / UPDATE | `is_member_of(business_id)` (membership row only; the owner-without-membership branch does not write) | `M/0021:32-39` |
| `user_data` DELETE | `is_admin_of(business_id)` | `M/0021:41-43` |
| `report_files` SELECT | `business_id in (select my_business_ids())` | `M/0022:17-19` |
| `businesses` SELECT | `id in (select my_business_ids())` | `M/0048:19-21` |
| `user_businesses` SELECT | own row, or owner of the store's account | `M/0048:22-24` |
| `accounts`, `subscriptions` SELECT | `is_account_member(id)` or `is_owner_of_account(id)` | `M/0048:16-18, 25-27` |
| `audit_logs` SELECT (direct) | `is_admin_of(business_id)` | `M/0029:24-26` |
| `owedbook_kpis`, `owedbook_rows`, `owedbook_summary`, `owedbook_pbm_options` (SECURITY DEFINER) | raise unless `p_business_id in (select my_business_ids())` | `M/0044:46`, `M/0045:54`, `M/0046:38`, `M/0047:28` |
| `tenant_stores()` | stores in `my_business_ids()` | `M/0051:2-8` |
| `admin_stores`, `admin_members`, `admin_billing_status`, `admin_audit` (SECURITY DEFINER) | owner of the store's account, or `is_admin_of(store)` | `M/0051:11-66`, `admin_stores` replaced in `M/0060:76-90` |
| `store_access_state(p_business_id)` | store in `my_business_ids()`; returns the **account's** state | `M/0060:35-44` |
| `owner_billing_overview()` | owner; lists every store of the account with name, NPI, status | `M/0060:51-66` |

What follows from that:

1. **History follows the row's current `account_id`.** Whoever is `owner_user_id` of the account a store points at
   reads all of that store's `user_data`, `report_files` and admin audit, with no time bound. Re-pointing
   `businesses.account_id` at a buyer's account hands the buyer the seller's full history and removes the seller's
   owner reach in the same statement.
2. **Membership rows are a second, independent path.** A `user_businesses` row keeps granting reach after any
   ownership change until it is deleted. `user_businesses_one_admin` (`M/0048:29`) allows one `admin` row per store.
3. **Store status is not in any predicate.** Setting a store to `suspended` (or any new status) changes nothing a
   signed-in member or owner can read or write.
4. **Read-only is account-wide, not per store.** `account_access_state` (`M/0060:5-29`) derives state from the
   account's one current subscription row and `now()`; `store_access_state` only projects it. The application reads
   it in `OB/src/server/accessState.ts:19`. Whether writes are actually refused in read-only is an application
   decision on that value; the `user_data` write policies above do not consult it.
5. **Service-role paths bypass all of this.** In OwedBook the service key is confined by test to
   `src/utils/supabase/admin.ts` → `src/server/db.ts` → `src/server/handoff.ts`
   (`OB/src/__tests__/apbm007a-boundaries.test.ts:15-32`). In the Portal every `src/server/*` module uses it through
   `PP/src/server/db.ts`.

## 3. How the lease and transaction boundaries prevent concurrent activation

Four layers, outermost first.

**a. One open operation per draft.** `checkout_operations.idempotency_key` is unique (`M/0057:5`) and
`checkout_operations_one_open` is a partial unique index on `draft_id` for the unresolved statuses (`M/0057:31-32`).
A second request cannot open a parallel operation for the same registration. Stripe objects are created with
operation-derived idempotency keys: `${op.id}:customer`, `${op.id}:session` (`PP/src/server/checkout.ts:134,161`).

**b. Bounded lease, one owner per call.** `operation_lease(p_operation, p_owner, p_seconds)` (`M/0057:109-118`) is a
single UPDATE that succeeds only if the lease is free, already this owner's, or expired; it clamps the term to 5–120
seconds and increments `attempts`. `advanceOperation` (`PP/src/server/provisioning.ts:47-109`) generates a fresh owner
per call, `pp-${randomUUID()}` (line 48), asks for 60 seconds (line 17), waits up to 8 seconds for a competitor
(lines 18, 26-31) and otherwise returns `busy`. The per-call owner is the 007A r05 repair: a per-process constant had
let two deliveries in one server process share the lease (comment at lines 14-16).

**c. Fenced writes.** Every write the worker makes to the operation goes through `leasedUpdate`
(`provisioning.ts:36-39`), which adds `.eq('lease_owner', worker)` and treats zero rows as lease lost; the caller
stops and returns `busy` (line 104). Release in `finally` is fenced the same way (line 107). So a worker whose lease
expired mid-flight cannot overwrite the worker that took over.

**d. One database transaction that is exactly-once by itself.** `provision_paid_registration`
(`M/0058:4-54`) is the only place rows that grant access are created, and it does not depend on the lease:

- `select … from checkout_operations … for update` (line 11) serializes callers on the operation row.
- `status = 'provisioned'` returns `already_provisioned` with the same ids (lines 13-15); only `paid` or
  `provisioning` may proceed (line 16).
- It re-checks the Stripe customer and subscription ids against the operation (17-19), that the owner exists (20-21),
  that the owner has no account already (22-23), that the draft's NPI still equals the operation's and is valid
  (24-26), and that the reservation is still `checkout_bound` to this operation (27-28).
- It then inserts account, store (`status 'active'`), the owner's `admin` membership, the customer mapping and the
  subscription mirror, marks the reservation `consumed`, sets the operation `provisioned` and clears the lease, all in
  the one function call (30-52). Any failure rolls all of it back.
- Constraints backstop it: `uq_businesses_npi`, `billing_customers.account_id` and `stripe_customer_id` unique
  (`M/0055:8-9`), `subscriptions.stripe_subscription_id` unique (`M/0006:13`), `subscriptions_one_current` one
  non-canceled subscription per account (`M/0055:68`), `user_businesses_one_admin`.

**Event side.** The webhook inserts the event id into `stripe_events` (primary key) before deciding anything
(`PP/src/server/webhook.ts:58-62`); a duplicate of a finished event answers 200 with no action, a duplicate of an
unfinished one is processed again (63-75); a failure answers 5xx so Stripe redelivers (79). Final dispositions are
written so that `processed` is never replaced by `ignored` (88, 104-106).

**Limits that matter for 007B.**

- "One account per owner" is enforced only inside the function (`M/0058:22-23`). There is no unique index on
  `accounts.owner_user_id` (`M/0002:8`).
- The lease, the fenced writes and the transaction are all written for a registration draft. `checkout_operations`
  requires `draft_id not null` (`M/0057:6`), its status set has no store-add states (`M/0057:13-14`), and
  `provision_paid_registration` refuses an owner who already has an account. An Add Store operation needs its own
  durable row and its own atomic function; the pattern carries over, the objects do not.
- The mirror function guards ordering by read time (`verified_at <= p_verified_at`, `M/0057:139`) and never revives a
  canceled subscription (line 140), but it copies `latest_invoice_id` and `latest_invoice_status` verbatim
  (lines 135-136). The capability check showed these move to an unpaid or voided add invoice while the subscription
  is healthy.

## 4. Where durable operation-to-invoice correlation can be stored

**What exists.**

| Place | Field | Today |
|---|---|---|
| `checkout_operations` | `stripe_invoice_id text` (`M/0057:18`) — not unique, no index | Set once, to the first invoice, when the operation is marked paid (`provisioning.ts:78`) |
| `checkout_operations` | `stripe_checkout_session_id` unique, `stripe_subscription_id` unique (`M/0057:16-17`) | The registration's session and subscription |
| `stripe_events` | `operation_id uuid references checkout_operations(id)` (`M/0057:52`), `object_id` (`:49`) | Set when an event is processed for an operation (`webhook.ts:92`) |
| `notification_operations` | `operation_id`, `dedupe_key` unique (`M/0057:64-65`) | Renewal reminders already key on the invoice: `renewal_reminder:${invoiceId}` (`webhook.ts:204`) |
| `subscriptions` | `latest_invoice_id`, `latest_invoice_status`, `grace_invoice_id`, `grace_started_at` (`M/0055:27-30`) | One slot each, per account; overwritten by every mirror; grace keyed to one invoice (`M/0057:147-166`) |
| Stripe objects | `metadata` marker carrying the operation id on customer, session and subscription (`checkout.ts:133,157-158`); `client_reference_id = op.id` on the session (`:151`) | Read back by `classifyUnmapped` (`webhook.ts:222-236`) |

**What does not exist.** No table maps an invoice to the operation that caused it for anything after the first
invoice. The webhook routes `invoice.paid` / `invoice.payment_failed` by `billing_reason`: `subscription_create` goes
to the operation; everything else is treated as a renewal and starts or clears account-wide grace
(`webhook.ts:155-170`). A store-add invoice (`billing_reason = subscription_update`, observed in the capability check)
therefore has nowhere to be recognised and would open grace on failure.

**Where it can go.** Three options, in my order of preference; the choice is the Architect's.

1. **On the store operation row itself.** A new store-operation table (E1 proposal) with
   `stripe_invoice_id text unique`, written from the response of the subscription update that created the invoice,
   before the call returns. The webhook looks up the invoice id there first and, on a hit, routes to that operation
   instead of the renewal branch. One row per add, unique invoice, no dependence on Stripe metadata. This is the
   direct analogue of `checkout_operations.stripe_invoice_id`, made unique.
2. **A small `invoice_operations` mapping table** (`stripe_invoice_id` primary key, operation reference, kind). Use it
   if more than one kind of operation will ever own invoices, or if one operation can own several invoices over its
   life (for example a voided invoice followed by a new one).
3. **Stripe-side metadata as a secondary check only.** The update call cannot be relied on to stamp the generated
   invoice, and subscription metadata is shared by every invoice of the subscription, so metadata can confirm a
   mapping but cannot be the durable record.

Two fields should **not** carry it: `subscriptions.latest_invoice_id` (single slot, overwritten, and now known to
point at add invoices) and `subscriptions.grace_invoice_id` (its meaning is "the renewal invoice whose failure started
grace").

Reusing `checkout_operations` for store adds is possible only by relaxing `draft_id not null`, widening the status
check and the one-open-per-draft index; I judge a separate table cleaner, but both are product changes for E2, not
decisions taken here.

Whichever is chosen, the write must happen in the same step that records the provider call's outcome, and an
ambiguous response (timeout after send) must be reconciled by reading the subscription's `pending_update` and
`latest_invoice` before any retry, as the capability check did. A current subscription read is not proof that a retry
is safe forever.
