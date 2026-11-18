# Cyber Pharma — APBM-007 decisions record

Date: 2026-11-11, Asia/Dhaka. Written by Friday (reviewing Architect) for Tony (Director) and JARVIS (Chief Architect, authoring the 007A plan).

Purpose: one place for everything decided on 10–11 November across this lab, the JARVIS lab and Slack, so the 007A plan is written from a single source.

How to read the status column:

- **Director** — Tony decided it.
- **Business** — Frank and/or Coach agreed in the Slack thread of 11 November.
- **Architects** — JARVIS and Friday agree; Tony has accepted it.
- **Recon** — found in the pre-007 recon and its correction; source or receipt evidence, not checked live.
- **Open** — not settled yet.

Nothing here is a build approval. It records decisions; the 007A plan still needs its own review and Tony's release.

---

## 1. What we are building next

| # | Decision | Status |
|---|---|---|
| 1.1 | The next module is the Payment Portal backend, Phase 7. It is not Phase 4 reference data. | Director |
| 1.2 | It is split in two. **007A, money in:** owner signs up, pays, account and first store are created, owner gets access and sees the store in OwedBook; billing management. **007B, grow the account:** paid Add Store, inviting store admins and members, the admin actions, ownership transfer and recovery. | Director |
| 1.3 | Module names follow the phase number with a letter: `APBM-007A-CYBER-PHARMA`, `APBM-007B-CYBER-PHARMA`. | Director (naming rule of 5 Nov) |
| 1.4 | OwedBook is not published to staging on its own. There is nothing meaningful for testers yet. It ships to staging together with 007A. | Director |
| 1.5 | No build starts until a prep checklist is fully ticked: access, keys, addresses, test logins, business rules. Lesson from APBM-003. | Director |
| 1.6 | The Payment Portal is now part of the Cyber Pharma project. It stays a separate app so Stripe keys stay away from the app that holds claims. | Director |

## 2. Repositories and baseline

| # | Decision or fact | Status |
|---|---|---|
| 2.1 | OwedBook: `Cyberize-Group/cyph-v1-dev`, branch `main`, at the APBM-003 merge commit `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` (merge of PR #9). The pagination repair is in it. | Recon |
| 2.2 | Payment Portal: new repo `cyph-payment-portal-dev-v1`, copied from the finished portal mock. Tony reports it is ready under the Cyberize account. The recon saw it under a personal account at commit `c89572a…`, so the remote should be confirmed at plan entry. | Director report; verify |
| 2.3 | The old portal mock and its staging site are left alone until 007A is ready to replace it. Feedback gets fixed in the new repo. | Director |
| 2.4 | The Stripe learning app is reference only. Safe to reuse: the webhook signature check, the local listener script, the safe-redirect helper. Checkout, pricing map, access check and billing-page session are adapt-only. Its event handlers, schema and user-management actions are not reused. | Recon |
| 2.5 | All database changes live in one place: OwedBook's migration chain (currently `0001`–`0052`). The SQL files inside the portal repo are never run. | Architects |
| 2.6 | The portal repo's deploy script still points at the current portal staging service. It must not be run until 007A is ready to replace that site. | Recon; Open (retarget or leave) |
| 2.7 | The portal repo has an unexplained `package-lock.json` change. Keep or restore, and record why. | Open |

## 3. Database and environment

| # | Decision or fact | Status |
|---|---|---|
| 3.1 | 007 is built on the existing dev database. No separate database. Stakeholder testing of the portal mock is finished, so there is nothing left to protect on it. | Director |
| 3.2 | That dev database is the same one the portal staging site uses, and it received the full 52-migration chain, the corrected new-user rule, seven fake users and 250 fake claims on 7 November. | Recon (receipt) |
| 3.3 | A read-only look at the live settings is still wanted before the build: migration count, new-user rule, sign-up switch, redirect list, email templates and sender. | Open |
| 3.4 | Changing the dev passwords that were exposed in a local log is put off until production preparation. | Director |
| 3.5 | Fake and public data only. No real claim files anywhere. | Director (ruling of 5 Nov) |

## 4. Addresses and sign-in

| Setup | OwedBook | Payment Portal | Sign-in |
|---|---|---|---|
| Local | `http://localhost:3000` | `http://localhost:3001` | Automatic handoff |
| Staging | `https://owedbook.cyberizedev.com` | `https://owedbook-payment.cyberizedev.com` | Automatic handoff |

| # | Decision | Status |
|---|---|---|
| 4.1 | One sign-in covers both apps: sign in once, click between apps, arrive signed in. | Director |
| 4.2 | The method is the automatic handoff, in both setups. No shared sign-in cookie, because the staging addresses sit beside unrelated Cyberize apps. | Architects |
| 4.3 | Each app uses its own session-cookie name, including locally, so an accidentally shared session cannot hide a broken handoff. | Architects |
| 4.4 | Each app checks store access and billing permission for itself. Arriving signed in grants nothing extra. | Architects |
| 4.5 | Required tests: both directions, return links, expired and reused handoffs, session refresh and expiry, logout across both apps, and what owners, store admins and members can each do. | Architects |
| 4.6 | The exact handoff design needs an architecture review before any code is written. It is the most security-sensitive piece. | Open |
| 4.7 | Access is by emailed sign-in link. No password is required. Today only the landing half exists; sending the link, and a "send me a link" control on the sign-in pages, are 007A work. | Recon; plan requirement |
| 4.8 | Production addresses and sign-in are decided later. | Director |
| 4.9 | Mission Control keeps its own separate sign-in. | Architects |
| 4.10 | Google sign-in is a recorded request from Frank, deferred until after the full staging acceptance. | Plan v3.0 |

## 5. Business rules

From the Slack thread of 11 November. Coach's instruction: build from that thread until Frank confirms the three pending items.

| # | Rule | Status |
|---|---|---|
| 5.1 | Registration is for the account owner, with an ownership declaration. | Business |
| 5.2 | One subscription per account, covering many stores. This is the foundation and there is no plan to change it. | Business; Director |
| 5.3 | Price: 99 US dollars a month for the first store, 49 for each additional store. No setup fee. Monthly billing. No charge for staff logins. | Business |
| 5.4 | One payment method per account in the first release. A payment method per store is a later release. | Business (Coach) |
| 5.5 | Cancelling takes effect at the end of the paid period and can be undone before then. | Business |
| 5.6 | Failed renewal: seven days of normal access with a reminder, then read-only. The owner can always reach billing. Billing problems never delete records. | Business; pending Frank's confirmation against an earlier answer |
| 5.7 | The owner can be the admin of one of their own stores, or appoint someone else. | Business |
| 5.8 | Support: `support@pharmacybooks.com`, handled by Heather, who brings in Frank or Cyberize as needed. | Business |
| 5.9 | Frank gives final business approval on billing rules. Coach tests and accepts the purchase flow. Billing exceptions and refunds go to Heather or Frank. | Business |
| 5.10 | Add Store: show the charge, get the owner's confirmation, charge only the rest of the current month, activate after payment is confirmed. If payment fails, existing stores keep working and the new one stays pending. | Business; mid-month charge pending Frank's confirmation |
| 5.11 | No cap on stores or staff in the first release. A store can be scheduled for removal at the end of the paid period; its charge stops and its records are kept. | Business |
| 5.12 | Owners appoint or replace store admins. One admin per active store. Store admins manage members only in their own store. Members cannot manage billing or create stores. Support assists with ownership transfer and recovery. | Business |
| 5.13 | APA pricing is in the first release, through a coupon code at checkout. | Business (Coach) |
| 5.14 | Not in the first release: refunds through the app, trials, other discounts, assisted onboarding. Standard paid signup only. | Business (Coach) |

## 6. Store identity and store sale

| # | Decision | Status |
|---|---|---|
| 6.1 | Every store is identified by its NPI. An NPI is required, and no two stores share one. The NPI names the store, not the subscription. | Business (Frank) |
| 6.2 | Every store also has its own permanent internal ID. Records attach to that ID, never to the NPI, so a sale or an NPI change cannot break them. | Architects; Director |
| 6.3 | A registration or Add Store with an NPI that is already registered is blocked and sent to support. An NPI is not proof of ownership. | Architects |
| 6.4 | Selling a store goes through support. The seller's bill drops, the seller's access ends on an agreed date, records are kept, and the buyer uses their own account. | Architects; sent to Coach and Frank for agreement |
| 6.5 | Adding, removing and transferring stores happens in our portal, because Stripe only sees a count and cannot know which store. Stripe's own billing page handles cards, invoices and whole-account cancellation. | Architects |
| 6.6 | Any future change to the billing structure is a separate project with its own budget, timeline and testing. | Director; sent to Coach and Frank for agreement |
| 6.7 | What happens to NCPDP. Today both apps require it and the database treats NCPDP plus NPI as the unique pair. Frank asked for NPI, not NCPDP. Keep as an optional field, or drop it? | Open |

## 7. Stripe setup

| # | Decision or fact | Status |
|---|---|---|
| 7.1 | A new sandbox named Cyber Pharma is used. The learning-app sandbox is not reused. | Director |
| 7.2 | The two test keys are in the portal repo's `.env.local`. The Stripe command line tool is installed and authorised for the Cyber Pharma sandbox. | Director report |
| 7.3 | The webhook secret for local work comes from the local listener, using the script carried over from the learning app. A permanent secret is created on deploy day when the staging address is registered in Stripe. | Director |
| 7.4 | Products and prices are created by a script in the build, not by hand, so the setup is repeatable. | Architects |
| 7.5 | Variable names: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Proposed for the prices: `STRIPE_PRICE_FIRST_STORE`, `STRIPE_PRICE_ADDITIONAL_STORE`. | Playbook; proposed |
| 7.6 | One sandbox test before the catalogue is locked: does a subscription with two prices behave on Stripe's billing page the way we need. | Open |
| 7.7 | Payment is trusted only from Stripe's signed message to our server, never from the browser returning. A repeated message must not create or charge anything twice. | Playbook; Architects |

## 8. Design items the 007A plan must settle

These come from the recon. They are listed so none is missed; the plan decides how.

1. Billing details are readable by every store member today, and store admins can see billing status. Restrict to those meant to see billing.
2. There is no "may manage billing" check yet. Define it.
3. A store admin can still change any field of their store through the database, including its account link and Stripe customer ID, while the owner cannot change it at all. Restrict it.
4. Where the Stripe customer lives. It should be at account level; today a column exists on both the store and the subscription tables.
5. The subscription table has no count or price fields. Decide its shape for first store plus additional stores now, even though Add Store ships in 007B.
6. Provisioning does not exist. It needs to be one repeatable, safe-to-rerun operation tied to the payment: owner login, account, store, optional non-owner store admin, subscription record, sign-in link. The owner needs no role change and no membership row.
7. A paid owner who cannot get in: resend the link, correct a mistyped email through support, and make half-finished setups visible to an operator.
8. "Someone else as store admin" at registration: include that one invitation in 007A or defer to 007B. It must respect one admin per store.
9. The portal's temporary staff-only gate must be replaced with the same account-based check OwedBook now uses.
10. New tables the portal needs (Stripe message record, registration and checkout records, setup operations, invitation tracking): where they go in the single migration chain, and who takes the next number, since a privilege-hardening migration `0053` is already promised from APBM-003.
11. Old SQL files in both repos would bring back the unsafe sign-up rule if run. Remove or fence them.
12. The portal's demo controls and Stripe stand-in page are removed at integration, and copy that promises things the app does not do is corrected.
13. What a past-due or cancelled subscription does to access: 007A stores and shows the status; the access effect follows rule 5.6 once Frank confirms it.
14. Audit: whether payment, setup and invitation events need their own entries.

## 9. Still open

| # | Item | Owner |
|---|---|---|
| 9.1 | Reply to the store-sale letter, including whether a buyer sees the store's past claim history. Suggested default: clean slate. | Frank, Coach |
| 9.2 | Frank's three pending confirmations: the mid-month Add Store charge, the failed-payment access rule, and (now answered in Slack) NPI sharing. | Frank |
| 9.3 | APA discount amount and who may use the code. | Frank |
| 9.4 | The two staging addresses in section 4 need setting up before deploy. | Tony |
| 9.5 | Email sending: which sender, sending address and templates carry the sign-in links. On the critical path, because access is by emailed link. | Tony, Architects |
| 9.6 | Items 2.6, 2.7, 3.3, 4.6, 6.7 and 7.6 above. | As marked |

## 10. Carried from APBM-003

These stay open and are not part of 007A unless the plan pulls them in.

- Restore from backup was never demonstrated.
- Privilege hardening migration `0053` is promised and unwritten.
- Cross-tab sign-out is delayed until the next page move.
- Mobile billing screen clipping.
- QA cleanup acceptance was not recorded; not a merge gate by Director ruling.
- Staging deployment and the deployed-site check were never run.
- The independent QA certificate covers the repair candidate only; the later pagination fix was accepted by Tony, not re-certified.
