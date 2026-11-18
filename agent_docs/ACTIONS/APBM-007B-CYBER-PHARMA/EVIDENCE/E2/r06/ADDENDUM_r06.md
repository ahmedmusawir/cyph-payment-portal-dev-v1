# APBM-007B E2 — engineering-completion addendum r06

Claudy · 17 November 2026, ~12:10 Asia/Dhaka. Follows the final handoff r05. **Status: ENGINEERING COMPLETE — AWAITING QA BRANCH.**
No product code changed; no DEV action; no Git staging, commit, push, merge or deployment; no new charges after the interrupted
S2 run. No QA approval or certification is implied.

## 1. Blocker dispositions

| Blocker | Disposition |
|---|---|
| B2 — AC-011 existing-identity inbox receipt | **CLOSED.** Tony confirmed the OWNER_B email (11:23 Asia/Dhaka); manual receipt observation 6 (`RECORDS/manual_observations.json`); link not clicked |
| B1 — AC-007 actual crash/restart | **CLOSED.** Director raised customers/subscriptions 13 → 14. S1 and S2 PASS (§2) |

## 2. Crash/restart evidence (`CRASH_RESTART/`)

Owned proof pair only (OwedBook 3100, Portal 3101 → SCRATCH + Stripe sandbox). Only the owned Portal 3101 process group was
killed (SIGKILL). The Director's 3000/3001/3457 were not touched, and DEV was not touched. One new proof owner (1 customer, 1
subscription).

| | S1 — hard kill during the money call | S2 — payment while the server is down |
|---|---|---|
| Interruption point | Portal SIGKILLed 05:57:14Z the moment the `pay` intent was durable (operation `payment_pending`, payment call in flight); the owner's confirm request got a socket error | Confirm completed (3DS card → `payment_pending`, hosted link); Portal SIGKILLed at an idle `payment_pending` |
| While down (durable state) | Operation `payment_pending`, dead process's lease still live, `pay` intent with **no recorded outcome**; Stripe had completed the payment (invoice paid 4,900, 1 charge); **no store row, no membership, not in owner scope**; quantity 2 | Hosted 3DS payment completed on Stripe's page while the Portal was down (invoice paid, 1 charge); operation still `payment_pending`; no store/membership/scope; quantity 3 |
| Restart + recovery path | Portal restarted (`proof-serve start --only pp`); **owner status polling**: 05:58:06 still `payment_pending` (dead lease live) → 05:58:19 lease taken, invoice read from Stripe, no second payment → `activated` | Portal restarted; **owner status polling** → `activated` 05:59:35Z (before any event delivery) |
| After | 1 invoice paid once, 1 succeeded charge, quantity 3 (+1 exactly), 1 store, 1 membership | 1 invoice paid once, 1 succeeded charge, quantity 4 (+1 exactly), 1 store, 1 membership |
| Event replay | **Manual controlled signed delivery** of all the run's real events, after activation: duplicates/ignored; nothing added | Same, completed by `--finish-only` (the interrupted run had already delivered 3 events at 05:59:43Z); nothing added |
| Result | `cr-r06-s1/result.json` — 8/8 checks PASS | `cr-r06-s2/result.json` — 8/8 checks PASS |

Undelivered event vs interrupted operation: no event was ever delivered automatically. There was no endpoint, destination or
listener (verified: 0 endpoints, 0 destinations, no `stripe listen` process, `pending_webhooks` 0). The interrupted operations
were recovered by the product's owner status-polling path, which reads the invoice from Stripe under a fenced lease. Event
delivery was manual and happened after recovery, only to prove replays are harmless. It is **not** labelled webhook recovery.

## 3. Interrupted tool call — effects reconciled (`CRASH_RESTART/interrupted_s2_reconciliation.json`)

The rejected/interrupted S2 command HAD executed. Against Stripe, SCRATCH and the ledger:
- 1 card attach, 1 default change;
- 1 invoice (create/item/finalize) with 1 API attempt (3DS required) and 1 hosted payment, paid once with 1 succeeded charge;
- 1 quantity change (3 → 4), activated 05:59:35Z;
- 3 events recorded by the interrupted manual delivery;
- 0 notifications.

All of these match ledger seq 205–208 (all settled); no unreserved or extra effect. The finish step created no payment, invoice
or quantity change.

## 4. Wording corrections and carried requirement

- Handoff rows for check C (AC-004), check E (AC-022) and O-1 (AC-025) now state **controlled signed delivery**; the Listener
  note and QAM_MANIFEST state the same.
- **Automatic webhook delivery (Stripe → registered endpoint/listener) is UNTESTED** by Engineering. Carried into QA planning
  and staging verification (handoff §4.2): register the staging endpoint and prove real Stripe deliveries alone activate an Add
  Store, drive grace/notices, and recover after an outage.

## 5. Effects and cleanup (`EFFECTS/`, `CRASH_RESTART/cleanup_receipt.json`)

| Counter | Ceiling | Used | Since r05 |
|---|---|---|---|
| Attempted cents | 480,000 | 464,104 | +29,500 (fixture 14,800; S1 4,900; S2 4,900 + 4,900) |
| Stripe customers / subscriptions | 14 / 14 | 14 / 14 | +1 / +1 |
| Pay / hosted | 30 | 28 | +3 |
| Payment attempts | 60 | 51 | +4 |
| Emails | 24 | 10 | 0 |
| SCRATCH identities | 14 | 13 | +1 |

Cleanup: crash fixture subscription canceled and customer deleted; 0 live E2-owned subscriptions or test clocks; proof servers
stopped; crash credential file removed. Director processes untouched.

## 6. Records updated

`QAM/HANDOFFS/ENGINEERING_HANDOFF.md` (AC-007, AC-011, delivery wording, blockers closed, webhook untested), `QAM/QAM_MANIFEST.md`,
`QAM/QAM_STATE.md` (→ ENGINEERING COMPLETE — AWAITING QA BRANCH), `APBM_STATE.md`, `SUCCESSOR_INPUTS.json`, `APBM_JOURNAL.md`,
`APBM_RULINGS.md`, `ENVIRONMENT_AND_EFFECTS.md`. Final inventory `INVENTORY/`: Portal 0 committed / 0 staged / 13 unstaged / 507
untracked (54 outside `agent_docs/`); OwedBook 0 / 0 / 8 / 59 (32 outside). Since r05 only engineering scripts changed
(`crash-restart.mjs` new; `proof-serve.mjs` `--only` / `--signal KILL`). Preserved disclosures: original v0.1 review bytes
MISSING; Friday's confirmation text not received by Engineering.

**Next (Director):** commit both candidates and create `qa/apbm-007b`; QA planning to include automatic webhook delivery.
