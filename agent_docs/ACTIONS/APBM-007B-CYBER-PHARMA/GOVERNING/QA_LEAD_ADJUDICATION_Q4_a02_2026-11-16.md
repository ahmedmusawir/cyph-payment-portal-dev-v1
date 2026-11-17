# QA Lead adjudication — APBM-007A Q4 a02 (interim)

Date: 16 November 2026. QA Lead: Friday, via the Director. Executor: Cody.

## Binding

| Item | Value |
|---|---|
| Package | `APBM-007A-CYBER-PHARMA_Q4_REVIEW_a02.zip`, SHA-256 `c989104b2694ceba7ea474dfaaa7b1b269596ba944d24aa4eb35646cc7884c33` (verified by the Lead) |
| OwedBook | `f637ba4086c1e906e008b8892c880ec6489bba9a` |
| Payment Portal | `357c274284f48ed5ad3bf8407ca0a14d0d9b99e8` (product `4cd96c82da59a093d1330307f5a27836b17f1df5`) |
| Plan SHA-256 | `2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672` |

## Status

Q4 is incomplete. No verdict on the repaired pair yet. F-Q2-001 and F-Q2-002 stay open until live proof.

## Stops (environment, not product)

- **STOP-IDENTITY, live Portal work.** The Portal process was restarted at 10:27:35 but serves the build made on 13 November (build ID unchanged, old cancellation code present on disk). The production build was not regenerated after the r03 commits.
- **STOP-ENV, natural payment delivery.** No Stripe listener process is running.

Owner: Director. Unaffected work continued, as the playbook requires.

## What passed without the live apps

- Portal baseline at the repaired product commit: install, typecheck, lint, 429 unit tests, production build.
- F-Q2-002 at unit level: 11 independent checks, including both fields set, partial failure and retry.
- Webhook and provisioning on real SCRATCH: late mapping, unsettled payment, busy lease, provisioning failure then single recovery, equivalent event, historical recovery with audit, receipt fault, foreign object.
- Authorization and regression on SCRATCH: 44 assertions. Handoff SQL: 10 checks plus a two-connection claim race.
- Sample loader on SCRATCH: 50 rows, then 0, guard rejects a missing marker.
- Ledgers 60/60 on both databases. No DEV writes, emails, payments or identities in Q4.

## F-Q4-001

**Classification: acceptance failure against AC-011, MEDIUM. Not a regression from r03** (`checkout.ts` is byte-unchanged).

AC-011 requires "concurrent double submit, new-key bypass and network timeout reconcile to one intended customer/session/operation". Confirmed in source: when an earlier attempt is still `created` with no recorded Checkout session and a retry arrives with a different key, `startCheckout` closes the earlier operation as `expired_unpaid` and claims a new one. Stripe idempotency keys are derived from the operation ID, so the retry creates a second customer and a second Checkout session. The first operation is marked unpaid without proof from the provider. Engineering listed this path as limitation L3 in the r02 repair record.

Severity reasoning: the first session's address never reached the buyer, so no path to a double charge is shown. The effect is orphaned provider objects and an unproven "unpaid" record. It is still a failure of the written criterion and cannot be waived by QA.

**Routing: bounded repair before any live journey.** Reasons: QAM §11 reserves live validation for the final repaired candidate; the one approved new DEV identity and the payment budget can be spent only once; a later product change would invalidate live evidence gathered now.

The alternative, a Director ruling to accept the risk and amend AC-011 with a 007B obligation, is the Director's to choose.

## Sequence

1. Architect scopes the bounded repair of F-Q4-001. Engineer repairs on `qa/apbm-007a`. Executor stays paused.
2. Director commits, regenerates the Portal production build, restarts it and starts the Stripe listener.
3. QA Lead issues the impact disposition and binds the new pair.
4. Executor resumes the remaining Q4 scope: live journeys, browser matrix, remaining coverage, then the single Director session.
