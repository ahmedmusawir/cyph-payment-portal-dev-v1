# Contracts to resolve from E1

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

No new SQL, route name, table name or provider API choice is frozen here. Engineering must inspect actual code and current official provider documentation for the installed versions, then return concrete proposals with source references.

## Billing and named-store operations
Trace current catalogue, subscription mirror, event ledger, registration saga, NPI reservation, billing recovery and reconciliation. Design pending Add Store operation ownership, quote/consent binding, idempotency and payment-confirmed activation. Explain quantity changes versus invoice payment timing, required payment authentication, invoice failure and subscription status effects. Specifically demonstrate that failure to pay for an additional store does not revoke existing-store access. Compare feasible provider mechanisms against this constraint; do not select one from memory.

Define quote currency/amount/period/discount/timestamp/expiry and re-consent behavior. Define event ordering, durable recovery responsibility, retries, partial commits and mapping evidence. Unfinished work cannot be silently acknowledged as final. Account for scheduled removal, last-store behavior, renewal and transfer concurrency.

## Identity, membership and invitation
Map existing owner, admin and member representations and actual uniqueness constraints. Define exact inviter rights, token storage and binding, expiry, revoke/resend, cross-account eligibility and wrong-user handling. New Auth identities must be permitted by the actual signup-disabled policy; no broad signup reopening. Emailed GET does not consume an invitation or perform an access grant; preserve the explicit action/POST principle. Define admin replacement acceptance as one atomic authority transition; no gap or two-active-admin state. Determine whether the prior admin remains a member or loses access through D-02.

## Removal, transfer and recovery
Distinguish removal from whole-account cancellation, store sale from account-owner replacement, and identity recovery from billing recovery. Define schedule/cutoff/time zone, idempotent completion, actor authority, compensation and safe forward repair. History visibility, seller receivables and record ownership are separate decisions. Do not implement a simple account-ID reassignment that silently exposes prior history. A runbook alone must not be described as an implemented transfer capability unless explicitly chosen as the release contract.

## Grace and reminders
Identify the authoritative grace-start timestamp and billing-recovery behavior. Specify how provider-controlled time and application time remain coherent in isolated sandbox tests, including delayed events. No production-callable clock bypass. Define renewal invoice identity, reminder schedule, durable send responsibility, dedupe, retry and suppression after recovery. Preserve the existing notification-record work; actual delivery is additional proof.

## Data and deployment
New migrations follow the actual final OwedBook chain; 0061 is a historical expectation only, not a reserved number. Existing applied SQL is immutable. Describe privileges, RLS, constraints, audit data, backfill and migration compatibility. Reuse accepted restore limitations unless the new change creates a specific additional risk. Deployment must map exact build revisions, environment precedence, independent app cookies, webhook namespace/consumer routing and email origins.

## Director defaults to implement in the proposal

Use APBM_RULINGS.md decisions 1–4: no customer-facing transfer screens; audited operator command plus procedure; deny buyer historical claims; undo before period end; last store through whole-account cancellation; incumbent admin until replacement accepts; failure and pre-read-only notices each at most once per invoice, with recovery suppression. Investigate mechanisms and exact timing rather than reasking these policy questions.
