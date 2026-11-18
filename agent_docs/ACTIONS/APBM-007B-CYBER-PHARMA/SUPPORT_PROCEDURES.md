**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Support procedure acceptance requirements

Engineer must author exact command/runbook steps from implemented --help, not replace behavior with prose. For each transfer authorize/complete/cancel, removed-store reactivation, verified owner identity recovery and admin recovery: inputs and exact IDs; verified requester/approver; ticket reference and evidence location outside repo; dry-run facts; consent/effective date; before-state and own-account verification; apply command; after-state on provider/database/customer access; partial failure and exact resume; unsupported/refund/card-transfer exclusions; audit and retention. No patient documents or identity evidence in Git.

Support verifies seller and buyer through the organization's controlled channel; document acceptance does not prove that a real claimant is genuine. Operator software separately proves authorization, typed scope, actor attribution limits, idempotency and before/after audit. Buyer uses own billing; owner-replace is same-account identity recovery only. Known shared staging authentication limitation is recorded for Friday's certificate; never call declared_actor a cryptographically verified individual.

## Paid store operation not activated — external refund and closure

Support verifies the same owner, operation, paid invoice and request not to activate. Director/authorized finance operator decides the external refund/credit disposition under organizational policy, performs it separately in the provider dashboard, and retains evidence outside Git. Software does not issue a refund. Support records ticket and provider evidence reference, then dry-runs/applies store-operation-close on exact operation ID. Command verifies full provider refund/credit proof before terminal closure and release; partial/uncertain proof remains attention. Verify provider outcome, closed operation, released exact slot/hold, preserved history and no new store grant. No unrelated card/subscription changes. Escalate unresolved payment evidence, never erase it.

---

# Operator runbook — six support actions

*Added 17 November 2026 by Claudy (Engineering) under the F-Q2-006 repair ruling. The text above is unchanged. Every command
and refusal code below is taken from the implemented code: `scripts/operator-007b.mjs --help`, `src/server/operator007b.ts`,
and the SQL functions in OwedBook migrations 0063, 0066 and 0069.*

## 0. Applies to every action

**Credential.** The shared operator credential proves possession of the credential, not who the person is. Every call is
audited with `authenticated_as = 'shared_operator_v1'` and the `--actor` name the operator declares. That name is a
declaration, not a verified individual identity. Individual operator sign-in is a production prerequisite.

**Command form.** Run from the Portal repository root on the operator machine.

```bash
node scripts/operator-007b.mjs --help
# dry run (default; changes nothing, audited)
node scripts/operator-007b.mjs <action> --base <portal origin> <inputs>
# apply (audited)
node scripts/operator-007b.mjs <action> --base <portal origin> <inputs> --apply --actor "<your name>" --reason "<why>" --ticket <TICKET-ID>
```

- `--base` is the Portal origin, for example `https://<portal host>` (staging) or `http://localhost:3101` (SCRATCH proof pair).
- Add `--key-source scratch` only for the SCRATCH proof pair.
- Inputs are exact UUIDs. There are no names, prefixes, amounts or SQL.
- `--ticket` must match `^[A-Za-z0-9][A-Za-z0-9_.:#/-]{1,79}$`.
- An apply without actor, reason and ticket is refused, and the refusal is audited.

**Output.** One JSON object: `http`, `action`, `phase` (`dry_run` or `apply`), `result`, `target`, `before`, `after`, `error`
and `auditId`. The `result` value means:

| Result | Meaning |
|---|---|
| `planned` | Dry run |
| `applied` | Done |
| `refused` | A rule stopped it; nothing changed unless the step notes below say so |
| `failed` | Provider or database error; follow the action's partial-failure step |

Record `auditId` on the ticket. Audit rows (`public.operator_actions`) are append-only.

**Fixed sequence for every action:**

1. Ticket open.
2. Requester verified out of band.
3. Approval recorded on the ticket.
4. Dry run.
5. Compare the dry-run `before` with the ticket.
6. Apply.
7. After-checks.
8. Ticket closed with every `auditId`.

Never apply without a matching dry run made in the same session.

**Who approves.** The contract names no approver role. Until the Director names one in writing:

- **Requester:** the account owner or the seller/buyer, verified by Support through the organisation's controlled channel.
- **Approver:** the Director, recorded on the ticket before the apply.
- **Operator:** the person running the command, named in `--actor`. The operator must not approve their own request.

**Evidence and retention.**

- Identity, ownership and sale documents stay outside Git, in the organisation's controlled ticket store.
- Only the ticket ID, evidence reference and `auditId`s are recorded.
- No patient documents.

**Never:** refunds or card moves through these commands, Stripe-dashboard quantity edits, re-running a refused apply with
changed inputs to "make it pass", or SQL.

**Quantity check.** This is read-only and is used in the before- and after-checks below:

```bash
node scripts/operator-007b.mjs quantity-check --base <origin> --account-id <account uuid>
```

It reports `provider_quantity`, `billable_count`, `mirror_quantity`, `unresolved_operations` and `consistent`. **Consistent**
means `provider_quantity = billable_count` and there are no unresolved operations.

## 1. store-transfer-authorize — sale of one store to another legal owner

**Command:**
```bash
node scripts/operator-007b.mjs store-transfer-authorize --base <origin> --source-business-id <store uuid> \
  (--buyer-account-id <buyer account uuid> | --buyer-email <buyer email>) [--effective-at <ISO time>] [--hold-hours <1-168>] \
  --apply --actor "<name>" --reason "<sale reference>" --ticket <ID>
```

**Inputs:**
- The seller's store ID.
- Either the buyer's existing account ID or, for a buyer with no account, the exact email the buyer will register with.
- Optional effective time. Default: the end of the seller's paid period.
- Optional hold, 1–168 hours (default 48). This is how long the NPI stays reserved for the buyer after the effective time.

**Requester:** the seller (account owner) and the buyer, each verified out of band. **Approver:** see §0.

**Before:**
- The dry run shows `seller_quantity`, `effective_at` and `hold_hours`.
- The store is live, and it is not the seller's only store.
- `quantity-check` on the seller account is `consistent`, with no unresolved operations.
- No other transfer is open for this pharmacy.

**Refusals (nothing changed):**

| Code | Meaning or next step |
|---|---|
| `source_not_live` | Store is not live |
| `source_last_store` | It is the seller's only store |
| `removal_already_scheduled` | Store already has a removal scheduled |
| `transfer_open` | Another transfer is open for this pharmacy |
| `operation_unresolved` | The seller has an operation in progress; finish it first |
| `effective_in_past` | The effective time has already passed |
| `invalid_buyer` | Buyer details are not usable |
| `buyer_has_account` | The email already owns an account. Re-run with `--buyer-account-id` set to the returned `buyer_account_id` |

**After (`result: applied`):**
- `after.transfer.status = authorized` and `after.seller_quantity.after = billable_count`.
- `quantity-check` on the seller is `consistent`.
- The seller still has access until `effective_at`.
- The buyer sees nothing yet.

**Partial failure (`result: failed` after the transfer row exists):** the provider quantity sync failed.

1. Run `quantity-check` on the seller.
2. If `consistent` is false, and the time is still before `effective_at`:
   1. Run **store-transfer-cancel** (§3). Its quantity sync runs again.
   2. Dry-run and apply **store-transfer-authorize** again.
3. If the effective time has passed, escalate to Engineering. Do not edit the quantity in Stripe.

Re-running authorize over an open transfer is refused (`transfer_open`). That refusal is safe.

## 2. store-transfer-complete — end the seller's ownership at the effective time

**Command:**
```bash
node scripts/operator-007b.mjs store-transfer-complete --base <origin> --transfer-id <transfer uuid> --apply --actor "<name>" --reason "<why>" --ticket <ID>
```

**Input:** the transfer ID, taken from the authorize output.

**When to use it:** the minute job finalizes due removals and transfers automatically. Use this command only when the job did
not run, or to confirm completion.

**Before:**
- The dry run shows `status = authorized`, the `source_business_id` and `effective_at`.
- The current time is at or after `effective_at`.

**Outcomes:**

| Outcome | Meaning |
|---|---|
| `effective_time_not_reached` | Refused; nothing changed. Wait for the effective time |
| `after.finalize = transferred` | Completed now |
| `after.finalize = already_final` | The job already completed it; this is normal |

**After:**
- The seller and the seller's staff no longer see the store.
- The pharmacy NPI is held for the exact buyer until the hold expires. The transfer status is `buyer_reserved`.
- The buyer adds the store through Add Store, or registers with the exact email.
- If the hold expires without buyer payment, the job marks the transfer `attention`. Escalate.

**Partial failure:** one database transaction, so there is no partial state. On `failed`, re-run. It is idempotent
(`already_final`).

## 3. store-transfer-cancel — withdraw a sale before it takes effect

**Command:**
```bash
node scripts/operator-007b.mjs store-transfer-cancel --base <origin> --transfer-id <transfer uuid> --apply --actor "<name>" --reason "<why>" --ticket <ID>
```

**Input:** the transfer ID. **Requester:** the seller, or both parties. **Approver:** see §0.

**Before:**
- The dry run shows `status = authorized`.
- The time is before `effective_at`.
- The buyer has not paid.

**Refusals (nothing changed):**

| Code | Meaning |
|---|---|
| `not_cancellable` | Status is not `authorized` (already effective, reserved or canceled) |
| `effective_time_passed` | The effective time has passed |
| `unknown_transfer` | No transfer with that ID |

**After (`result: applied`):**
- `after.status = canceled`.
- The seller's scheduled removal is cleared.
- `after.seller_quantity.after = billable_count`, and `quantity-check` on the seller is `consistent`.

**Partial failure (`failed` after the cancel committed):** the provider quantity sync failed, and a re-run is refused
(`not_cancellable`).

1. Run `quantity-check` on the seller.
2. If `consistent` is false, escalate to Engineering with the `auditId`. No operator command re-runs only the sync.
3. Do not edit the quantity in Stripe.

## 4. removed-store-reactivate — owner wants a removed store back

**Command:**
```bash
node scripts/operator-007b.mjs removed-store-reactivate --base <origin> --business-id <removed store uuid> --apply --actor "<name>" --reason "<why>" --ticket <ID>
```

**Input:** the removed store's ID. **Requester:** the same account owner. **Approver:** see §0.

**Before:**
- The store status is `removed`. A store that was transferred, or sold, can never be reactivated.
- The NPI is not active on any other store.

**Refusals:**

| Code | Meaning |
|---|---|
| `not_removed` | The store is not removed |
| `transferred_store` | The store was transferred (sold) |
| `npi_active_elsewhere` | The NPI is active on another store |
| `unknown_store` | No store with that ID |

**After (`result: applied`):**
- `after.outcome = authorized`. This grants **no access and no quantity**.
- The `after.policy` field still carries the older SQL text "pending Director decision 9". Decision 9 was approved on
  17 November 2026, and the dry-run note states the current rule.
- Tell the owner to use **Add a pharmacy** with the same NPI and pay. After payment and quantity reconciliation, the original
  store record and its history return, the authorization is used, and `quantity-check` is `consistent`.

**Partial failure:** one transaction, and it is idempotent. Re-running returns `authorized` again with no duplicate.

**If the owner's Add Store payment ends in `attention`:** use `store-operation-reconcile` or `store-operation-close` (top of
this document). Never re-authorize to force it.

## 5. owner-replace — verified identity recovery for the same account (not a sale)

**Command:**
```bash
node scripts/operator-007b.mjs owner-replace --base <origin> --account-id <account uuid> --new-owner-user-id <user uuid> --apply --actor "<name>" --reason "<why>" --ticket <ID>
```

**Inputs:**
- The account ID.
- The new owner's existing, email-confirmed sign-in ID. They must sign up first; Support obtains the ID from that sign-in.

**Requester:** the legal account holder, with identity and authority verified out of band. Documents are retained outside Git.
**Approver:** see §0.

**Before:**
- The dry run shows the current `owner`.
- The new identity owns no other account.
- The billing account stays the same: no subscription or card moves.

**Refusals:**

| Code | Meaning |
|---|---|
| `unknown_account` | No account with that ID |
| `new_owner_not_confirmed` | The new identity's email is not confirmed |
| `new_owner_has_account` | The new identity already owns an account |

**After (`result: applied`, `after.outcome = replaced`, `after.provider = customer_email_updated`):**
- The new owner signs in and sees the account's stores and billing.
- The old identity has no access to this account.
- The old owner's pending invitations are revoked.
- Handoff links are invalidated.
- The Stripe customer email is the new owner's.

**Partial failure (`failed` after the ownership change, provider email not updated):** re-run the same apply. SQL returns
`already_owner`, and the provider email step repeats with the same idempotency key. If `after.provider = skipped` (no email or
no mapped customer), escalate.

## 6. store-admin-set — appoint a store admin when the owner cannot

**Command:**
```bash
node scripts/operator-007b.mjs store-admin-set --base <origin> --business-id <store uuid> --user-id <user uuid> [--former-admin-disposition member|remove] --apply --actor "<name>" --reason "<why>" --ticket <ID>
```

**Inputs:**
- The store ID.
- The new admin's confirmed sign-in ID.
- What happens to the current admin: `member` (default) or `remove`. The account owner is never removed from their own store;
  an owner who was admin becomes a member.

**Requester:** the account owner, or, if the owner cannot act, the store's verified representative. **Approver:** see §0.

**Before:**
- The dry run shows the disposition.
- The store is live.
- The user's email is confirmed.

**Refusals:**

| Code | Meaning |
|---|---|
| `store_not_live` | The store is not live |
| `user_not_confirmed` | The user's email is not confirmed |
| `invalid_disposition` | The disposition is not `member` or `remove` |

**After (`result: applied`, `after.outcome = admin_set` or `already_admin`):**
- Exactly one admin: the new user.
- The previous admin is now a member, or removed, as chosen.
- Pending admin invitations for the store are revoked.
- The new admin sees the store's staff panel.

**Partial failure:** one transaction, so there is no partial state. On `failed`, re-run. It is idempotent (`already_admin`).
