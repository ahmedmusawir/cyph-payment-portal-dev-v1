## E2 progress — DEV apply bundle is ready; three things need you

The database work, the server and auth layers in both apps, and the operator tooling are built and tested. The Payment Portal's screens are being rewired to the real API by a parallel agent now. DEV has not been touched. Nothing is committed; Git is yours.

### One thing went wrong — unintended email requests on SCRATCH

While testing the portal's server code against SCRATCH, a mail stub in my test did not intercept. **Six sign-in link requests reached the SCRATCH project's mailer**, addressed to `…@example.invalid` test addresses the test had created.

- Those addresses cannot receive mail and belong to nobody. No approved inbox, no real person and nothing on DEV was involved.
- It still breaks the capsule's rule that email goes only to the approved inbox aliases, so I am reporting it, not waving it through.
- Cause: my stub patched the wrong class. Fix: the portal's mail call is now its own module and the test replaces that module. I have not rerun the test.
- Counted as 6 of 24 emails.

### What is done

| Area | State |
|---|---|
| Migrations `0053`–`0060` | Written; rehearsed on SCRATCH as a fresh replay, a partial-failure resume and an upgrade from a seeded `0052`. 329 real-user checks and 82 new database checks pass; existing tables, users and indexes preserved |
| Portal server | Registration, server quote, APA code, checkout operation, webhook, provisioning, owner billing, undo cancellation. 14 of 15 integration checks passed against the real SCRATCH schema; the fifteenth was the stub assertion above |
| Sandbox catalogue | Created by a repeatable script: price, portal configuration, the approved 10% fixture code. A second run creates nothing |
| Sign-in and handoff | Same code in both apps: emailed links land on a button page and only the button signs in; cross-app handoff; provider-wide logout; password login kept. 44 route tests pass in each app |
| OwedBook | Billing-state banner, owner-only billing screen with a link to the portal, read-only hook (contract test only, since 007A has no customer write) |
| Operator tooling | Sample-claims loader, rehearsed on SCRATCH; reconcile command for a paid-but-not-set-up registration (not yet exercised) |
| Test suites | OwedBook 267 of 267, lint 0 errors, typecheck clean. Portal was 332 of 332 before the screen rewiring started; I rerun it when that finishes |

### What I need from you

**1. The DEV apply decision.** The bundle is `EVIDENCE/apply/dev-0053-0060/APPLY_BUNDLE.md` in the module. All read-only preconditions on DEV are met. One choice inside it:

| Option | Meaning |
|---|---|
| A (recommended) | Install `postgresql-client-17` on the VM. I take a full dump of DEV and restore it onto SCRATCH as proof, then you apply. `pg_dump` was here during APBM-003 and is gone now |
| B | Accept the additive design, the before/after preservation check and the private logical export I took, and apply without a restore rehearsal |

The exact command is in section 5 of the bundle. You run it, or delegate it explicitly.

**2. A ruling on the identity ceiling.** The capsule allows 12 new synthetic identities. I have created 12, all on SCRATCH (the database proof and the integration test), and none on DEV. I counted them against the ceiling to be safe. Do SCRATCH harness identities count? Until you rule, I create no identity anywhere and do not rerun the integration test.

**3. Settings before the integrated proof** (not needed for the apply):

- Payment Portal `.env.local`: set `NEXT_PUBLIC_SITE_URL=http://localhost:3001`, and add
  - `NEXT_PUBLIC_APP_ENV=local`
  - `STRIPE_EXPECTED_ACCOUNT=acct_1RxzixGnEQDyu3RR`
  - `STRIPE_PRICE_STORES=price_1UavqdGnEQDyu3RRcj32U2Ob`
  - `STRIPE_PORTAL_CONFIGURATION=bpc_1UavqeGnEQDyu3RR7ndiVXwt`
  - `APA_PROMOTION_CODES=APA10SANDBOX`
  - `ALLOW_SYNTHETIC_SUBSCRIPTIONS=true`
- OwedBook `.env.local`: add `NEXT_PUBLIC_APP_ENV=local` and `ALLOW_SYNTHETIC_SUBSCRIPTIONS=true`; remove the old `STRIPE_*` lines.
- `STRIPE_WEBHOOK_SECRET` in the portal must be the local listener's secret when you start it.

### One scope point for your decision later

The frozen configuration gives the apps no way to send a free-form email; access links go through the Auth mailer. So the renewal reminder is built as an in-app banner plus a recorded notification, not a separate email. A real reminder email would need a mail-sending credential added to the configuration.

### Allowance used so far

| Surface | Used | Ceiling |
|---|---|---|
| SCRATCH reset cycles | 3 | 4 |
| Auth identities | 12 (all SCRATCH) | 12 |
| Auth session attempts | about 42 (all SCRATCH) | 100 |
| Sign-outs | 18 (all SCRATCH) | 30 |
| Emails | 6 (the incident) | 24 |
| Stripe mutations | 5 | 250 |
| Stripe reads | 12 | 1,000 |

The work-package ledger is `EVIDENCE/E2/r01/PROGRESS.md`. I continue with the portal screens, lint fix and full checks while you decide.
