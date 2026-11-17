# QA Lead requirements — APBM-007B (early input for the pack)

Date: 16 November 2026. From: QA Lead. To: Architect (pack author). Requested by the Director.

**Status.** Early QA input under QAM §7, so the pack and its `QAM/` are written with these in from the start. This is not a plan approval. The candidate-specific plan is approved after Q1, as QAM §9 requires. Where this note and the final frozen contract differ, the contract wins and the difference comes back to the QA Lead.

**Sources.** QAM playbook v1.0 (entire), RRM playbook v1.0 (entire), planning handoff of 16 November, decisions record of 11 November, Q2 a01 and Q4 a02 adjudications, 007A pack v1.0.

## 1. Standing rules for this module

1. **Engineering handback.** For every new journey, one full happy-path walk on a production build, asserting the final rendered page and stored state, not a router call. (Cause of F-Q2-001.)
2. **Preflight first.** Q1 and Q2 each open with a basics check: both apps serving a build made from the candidate commit (build ID compared, not assumed), Stripe listener running with the matching secret present, database identities, inbox file readable. Anything missing is reported to the Director at once, before other work. (Cause of the two Q4 a02 stops.)
3. **Q2 runs to completion.** A product failure is a finding. Only the eight QAM §11 stop types stop work, and only the affected checks.
4. **Repairs on the QA branch.** One active writer per checkout. No return to the engineering branch.
5. **One-time budget is spent last.** Journeys that consume new identities, payments or emails run on the final repaired candidate.
6. **Evidence layers stay labelled.** Unit, real database with mocked provider, real provider, live browser, deployed. No layer stands in for another.
7. **One grouped Director session** near the end of Q2. No other human checks unless the plan declares them.
8. **Packages build themselves**, with index and hashes, at every return.

## 2. What the pack must give QA, so Q1 does not block

- Numbered acceptance criteria per journey, each with its evidence layer.
- A role × action table: owner, store admin, member, signed-out, and a user from another account, for every new server operation.
- One QA effect capsule, sized from measured request volume: sign-ins, new identities, emails, sandbox customers, checkouts, subscriptions, test clocks, DEV writes, SCRATCH cycles. 007A allowances do not carry over.
- Test inboxes the Director controls, loaded from a private file: owner A, owner B (second account), a brand-new invited admin, a brand-new invited member, and one existing user to invite.
- Explicit authority for Stripe test clocks on isolated sandbox customers.
- A validated mail guard that is on by default in every harness.
- Exact build, serve and listener commands with working directories.
- The list of 007A behaviours that are required regression.

## 3. Risk areas the plan must cover

**A. Add Store**
- Quote shown equals the invoice Stripe raises (rest-of-period charge), computed on the server; owner consent recorded.
- Store activates only on a signed, confirmed payment event. Browser return proves nothing.
- Declined or failed payment: new store stays pending, existing stores untouched, retry and abandon both clean.
- Double submit, retry with a new key, and network timeout end in one operation, one customer, one charge. (Same class as F-Q4-001.)
- Early, duplicate and out-of-order events. Subscription quantity always equals billable stores.
- APA code interaction with the added-store charge.
- Duplicate NPI goes to support; two simultaneous adds of one NPI.
- Only the owner can add. A pending store exposes no data and grants no access.

**B. Invitations and roles**
- New invitee and existing-user invitee. Expiry, replay, revoke, resend.
- Link GET does not redeem; the button POST does.
- Accepting while signed in as someone else forces the deliberate switch.
- Acceptance into another account or store is denied.
- One admin per store holds under concurrency: two replacements at once never leave zero or two.
- Removing a member ends access at the app and at the data layer; the known direct-token residual is measured and stated.
- Store admin cannot reach billing, other stores or protected fields. Member cannot invite. No role elevation anywhere.
- Real delivery to an owned inbox is proved separately from generated-link tests.

**C. Recovery and ownership**
- Sole-admin recovery path, with audit.
- Ownership transfer: billing rights follow the owner, never store-admin membership; the previous owner loses billing.
- Every operation is labelled either "implemented" or "support procedure". A procedure is reviewed as a document, not graded as a feature.
- No authority inferred from a store ID or an NPI. Buyer access to past history is denied unless ruled.

**D. Remove store**
- Scheduled for period end, undo before then, charge and access change at the same moment, records kept.
- Last-store behaviour and interaction with whole-account cancellation.

**E. Failed renewal, live (carried obligation O-1)**
- Test clock on isolated sandbox objects: normal access with banner for seven days, then read-only, owner still reaches billing, recovery restores access.
- Grace cannot be reset by cancel, undo or retry. Checked on a multi-store account.
- The time-control seam is unreachable in a production configuration.

**F. Reminder emails (carried obligation O-2)**
- Real inbox delivery, one per failed invoice, retry behaviour, no send after recovery.
- Mail guard validated before the first send. Every dispatch attempt counted against the budget.

**G. Webhooks**
- 007A recovery behaviours preserved for the new event types: unfinished work is retryable, nothing is acknowledged and lost.

**H. Database**
- New forward migrations only, in the OwedBook chain after 0060. Fresh and upgrade rehearsal on SCRATCH, DEV data preserved, ledger equal to manifest.
- Privileges and row-level rules on every new table and function, tested with two distinct accounts.

**I. 007A regression**
- First-store purchase, sign-in handoff both ways, logout, owner-only billing, cancel and undo.

**J. Screens**
- Touched screens across the agreed viewports, both themes, keyboard.
- Controls that were disabled in 007A now work or are still truthfully labelled. No invented legal text.

**K. Instruments and privacy**
- Poison and clean controls for every negative test and for the privacy scan, before effects are spent.

## 4. To reconcile when 007A closes

- The final 007A certificate and its limitations (restore not proven, real-Auth crash gap, Mission Control not run, direct-token residual).
- F-Q4-001: repaired in 007A, or carried into 007B by Director ruling. If carried, it becomes a numbered 007B criterion.
- The merged baseline commits for both repos. Until then the pack uses a pending identity, never a guessed one.

## 5. Outside Gate Q

Staging is a separate deployed check. It needs its own list in the pack: real webhook endpoint and secret, email links on the staging hosts, handoff both ways on the staging addresses, and the same purchase and Add Store journeys run once on the deployed pair.
