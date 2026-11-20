# OwedBook and Account & Billing — manual tester plan (Coach, Frank, Tony)

- **Version:** v2, 20 November 2026 (Claudy). v1 was written from the Director-led walkthrough of 19 November 2026; v2 adds section F, the final batch targeted retest, and today's observations.
- **Owner of the plan:** Tony (Director).
- **Status:** every test is **NOT RUN** until a tester fills in the Actual and Result columns. Earlier observations are listed separately at the end.

## How to use this plan

1. Do **one action at a time**. Read the Expected column first, do exactly the action, then record what you saw.
2. **Result** is one of PASS, FAIL, BLOCKED (cannot run: say why) or SKIPPED (deliberately not run: say why).
3. **Actual/evidence:** a short description, plus a screenshot file name if useful. **Never paste passwords, sign-in links or email bodies with links** into this plan or a screenshot.
4. **When something fails:** stop that section, write down the time with timezone, the browser profile, the role, the exact URL path (no query strings with tokens) and what you saw. Then move to the next section unless the failure blocks it.
5. **Resume after a break:** find the last row with a Result. Check you are in the right browser profile for that row's role (the role is in the section header). Continue with the next empty row. If a page was mid-payment, open Account & Billing → Add a pharmacy; it resumes any payment in progress.

## Roles, addresses and browsers

| Role | Example address (Tony's mailbox) | Browser profile |
|---|---|---|
| Owner (existing) | `moose@cyberizegroup.com` | Profile A |
| Member | `moose+alpha01-member@cyberizegroup.com` | Profile B |
| Store admin (delegated) | `moose+alpha01-admin@cyberizegroup.com` | Profile C |
| Buyer (store transfer) | `moose+alpha01-buyer@cyberizegroup.com` | Profile D |
| Fresh owner (optional) | `moose+alpha01-owner@cyberizegroup.com` | Profile E |

- Coach and Frank use their own mailbox with `+alpha01-…` aliases the same way.
- **Use a separate browser profile or private window for every role.** Sign-in cookies are per app and shared across tabs of one browser, so two roles in one browser will switch each other's sessions.
- Check before starting that your mailbox delivers `+` aliases to your inbox. Send yourself one test message.

## Before you start (Tony / operator)

| Item | Needed for | How |
|---|---|---|
| Both apps running on the repaired code | everything | OwedBook :3000, Portal :3001 (or the staging URLs once deployed) |
| DEV database at migration 71 | Owner badges in staff lists, Settings details, readable audit | **Done 20 Nov 2026** (`MANUAL_QA/2026-11-19/DEV_APPLY_0071_PREPARED.md`, APPLIED) |
| Mail to aliases | invitations | `MAIL_RECIPIENT_POLICY=open` is set in both local apps (DEV only, 20 Nov 2026); start or restart the apps to pick it up |
| Stripe listener | payment confirmations | `stripe listen --forward-to localhost:3001/api/webhooks/stripe` (staging: the registered endpoint) |
| Scheduler | section T only (expiry, final removal, transfer hold) | `node scripts/apbm007b/jobs-run.mjs --base http://localhost:3001 --every 60` in the Portal repo (staging: Cloud Scheduler). Do **not** change clocks or shared test data to speed things up |
| Test card | payments | Stripe test cards only (sandbox) |

## P — Profile (each role, in its own profile)

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| P-01 | Owner: open OwedBook → profile menu → My Profile | Name and email correct; badge says **Owner** | | |
| P-02 | Member: open My Profile | Badge says **Member** | | |
| P-03 | Store admin: open My Profile | Badge says **Store admin** | | |
| P-04 | Read the text under Email | "Name and email changes aren't self-service yet. To change them, contact support at support@pharmacybooks.com." No "Contact an admin" | | |
| P-05 | Leave both password fields empty; press Update | Rejected; nothing changes | | |
| P-06 | Type two different passwords; press Update | "Passwords do not match"; nothing changes | | |
| P-07 | Type a short password (fewer than 8 characters) twice; press Update | Rejected with a length message | | |
| P-08 | Type a weak but 8+ character password (e.g. `password1`) twice; press Update | Either accepted, or rejected with a clear reason from the sign-in service. Record which | | |
| P-09 | Press the eye button in each password field | Text shows and hides; the typed value stays | | |
| P-10 | Enter a new strong password twice; press Update | Button shows a spinner "Updating..."; then "Password updated successfully"; fields clear | | |
| P-11 | Sign out; sign in with email + the NEW password | Signed in | | |
| P-12 | Sign out; sign in with the OLD password | Refused | | |
| P-13 | Sign out; request an email sign-in link and use it | Signed in; the new password is still valid afterwards (repeat P-11) | | |
| P-14 | Disconnect the network; press Update with a valid password; reconnect | An error appears; the button is usable again; nothing is claimed as saved | | |

## R1 — Adding a pharmacy (Owner, Profile A)

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| R1-01 | OwedBook → Admin Portal → Billing | An enabled **Add store** button with text explaining it adds a paid pharmacy, shows the price first, and needs an active subscription. No "Not available in this release" | | |
| R1-02 | Press Add store | Spinner "Opening Account & Billing…", then the Portal's **Add a pharmacy** form, already signed in as the owner (no sign-in page) | | |
| R1-03 | Portal → Billing on a phone-width window (about 375 px) | A large **Add a pharmacy** button, full width, easy to find | | |
| R1-04 | Member (Profile B): open OwedBook Billing | "Billing is managed by the account owner…"; no Add store button | | |
| R1-05 | Start a fresh registration (Profile E) up to Review | No "not available yet" text; it says more pharmacies can be added from Billing once active, and a store admin can be invited from OwedBook | | |

## R2/R3 — Add-store payment (Owner)

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| R3-01 | Enter name and NPI; press See the price | Spinner "Calculating price…" then the quote (charged now, covers until, next renewal) | | |
| R3-02 | Tick the three boxes; press Pay | Spinner "Processing payment… this can take up to a minute" | | |
| R3-03 | Card saved at registration works (normal case) | The page shows "{name} has been added", the amount, "confirmed by our server", and Back to billing / Open OwedBook | | |
| R3-04 | Back to billing | "Pharmacies with access now" and "Billed at next renewal" both increased by one | | |
| R3-05 | (Owner whose card needs bank confirmation: test card 4000 0025 0000 3155 set as the card) Add a store and pay | "Your bank needs you to confirm this payment"; Stripe opens in a new tab (or "Your browser blocked the new tab" plus a big button) | | |
| R3-06 | Complete the confirmation in the Stripe tab; return to the app tab | Within a few seconds the app shows the completion screen. No second payment was asked for | | |
| R3-07 | (Card that declines: 4000 0000 0000 0002) Add a store and pay | "Your card was declined", plus "Pay on Stripe's secure page" | | |
| R3-08 | While payment is pending, reload the page | The same payment screen comes back (it is not lost) | | |
| R3-09 | Press Cancel and don't add this store | Spinner "Cancelling…", then "not added and nothing was charged (you cancelled)" | | |
| R3-10 | In Stripe's dashboard (operator), check charges for the test | Exactly one successful charge per added store; none for cancelled ones | | |

## R4/R5 — People, roles and owner protection

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| S-01 | Owner: Admin Portal → a store → Invite member; invite the Member alias as Member | Spinner "Sending invitation…", then "Invitation email sent." | | |
| S-02 | Member (Profile B): open the email, sign in, accept | Member sees only that store | | |
| S-03 | Owner: in People with access, press Remove access on the Member | A dialog names the person and the pharmacy and explains the effect; Cancel closes it with no change | | |
| S-04 | Press Remove access again, then confirm | Spinner "Removing access…", then "{person} no longer has access to {pharmacy}." The member is denied on their next action | | |
| S-05 | Look at People with access | The owner shows **Owner**; there is no Remove access button on the owner | | |
| S-06 | Owner: choose Store admin; read the text | "You stay the Owner with full access…"; no option to demote or remove the owner | | |
| S-07 | Invite the Store admin alias as Store admin; accept in Profile C | The admin can manage that store's people; the owner still shows Owner | | |
| S-08 | Store admin (Profile C): try to open Billing, and Account & Billing | Billing is owner-only; the Portal refuses billing | | |
| S-09 | Store admin: look for Remove access on the owner | Not offered | | |
| S-10 | Owner (Profile A): open every owned store's admin pages after S-07 | Full access everywhere; Profile badge still Owner | | |
| S-11 | Store admin: invite a member to their store | Works | | |
| S-12 | Store admin: open another store's admin URL directly | Redirected or refused | | |

## R6 — Pharmacy settings (Owner, then Store admin)

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| ST-01 | Admin Portal → Settings | A pharmacy selector (if you manage more than one), then name, NPI (read-only identifier), NCPDP, address, phone, software | | |
| ST-02 | Compare with what was entered at registration | Values match; empty values say "Not provided" (stores added later only have name/NPI/NCPDP) | | |
| ST-03 | Switch the selector | The details change to the chosen pharmacy | | |
| ST-04 | Look for a Save button | None; the text says editing is pending approval | | |
| ST-05 | Store admin (Profile C): Settings | Only their store | | |

## R8 — Audit log (Owner)

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| A-01 | Admin Portal → Audit log | Columns When, What happened, Who, Pharmacy, Details; the subtitle names your timezone | | |
| A-02 | Find the S-01 and S-04 actions | "Invitation sent" (address, role) and "Access removed" (person), with you as Who | | |
| A-03 | Compare a time with your clock | Matches local time, with a zone label (e.g. GMT+6) | | |
| A-04 | Show → People and invitations; then Pharmacies; then Billing | Only matching events | | |
| A-05 | Tick Include views and system steps | "Viewed …" rows appear | | |
| A-06 | Press Load older events (if shown) | Older rows are added below | | |

## R9 — Store removal (Owner; needs 2+ stores)

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| RM-01 | Portal Billing → Remove at period end on Store 02 | A dialog "Remove {Store 02} on {date}?", stays usable until then, no refund or credit; buttons Cancel and Schedule removal | | |
| RM-02 | Cancel | No change | | |
| RM-03 | Schedule removal | Spinner "Scheduling removal…", then "Removal scheduled for {date}"; the row says Leaves on {date} | | |
| RM-04 | Read the plan card | "Pharmacies with access now" unchanged; "Billed at next renewal" one less; "1 pharmacy leaves on {date}" | | |
| RM-05 | Keep this store | Spinner "Keeping store…", then "{Store 02} stays on your account." Counts restored | | |
| RM-06 | (Stripe Billing Portal) cancel the subscription, return, press Undo cancellation | Spinner "Undoing cancellation…"; the subscription continues | | |

## R10 — Content and mail

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| C-01 | Portal footer and help texts | Support shows support@pharmacybooks.com; no "[SUPPORT EMAIL]" | | |
| C-02 | Footer and Review: Terms and Privacy | Real links if configured; otherwise "(link not yet published)". **Before any outside exposure this must be real links** | | |
| C-03 | Invite a never-used plus alias | Email arrives without anyone editing configuration | | |

## T — Scheduler and transfer (operator present; not yet passed)

| ID | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|
| T-01 | With the scheduler running, leave an Add Store payment unpaid past 30 minutes | Operation closes; nothing charged; no store | | |
| T-02 | Scheduled removal reaches period end (real time only) | Store removed at the cutoff; access ends; claims kept | | |
| T-03 | Store transfer to the Buyer alias (support procedure) | Buyer registers or adds the store; seller loses it at the cutoff; history rules hold | | |
| T-04 | Populated claims: Owner, Admin and Member each see only their stores' data | No cross-store data | | |

## F — Final batch targeted retest (v2, 20 November 2026; run this first)

**Setup:**
- Restart both apps from the current branch builds. The source changed, so run `next build` and then `next start` in each repo, after stopping the running servers.
- No DEV migration is needed: DEV is at 71.
- Keep the Stripe listener running. The scheduler is not needed for this section.

| ID | Role / profile | Action | Expected | Actual/evidence | Result |
|---|---|---|---|---|---|
| F-01 | Store admin (C) | Open Account & Billing `/stores/add` directly | "Billing is managed by the account owner", with the line "Adding a pharmacy changes the subscription, so only the account owner can do it." **No form** is ever shown, not even briefly. "Open OwedBook" works | | |
| F-02 | Member (B) | Same URL | Same notice, no form | | |
| F-03 | Owner (A) | OwedBook Billing → **Add store** (handoff) | The Add a pharmacy form opens without a new sign-in. Do **not** submit unless a payment test is planned | | |
| F-04 | Store admin (C) | OwedBook Admin Portal → My Stores | Store 01: top pill **Active**; footer "Subscription · **Managed by owner**". The summary says "0 need attention". No "Subscription unavailable" anywhere | | |
| F-05 | Store admin (C) | Open Store 01 | Pill "**Billing managed by owner**". No price, card or invoice is shown | | |
| F-06 | Owner (A) | My Stores | Real subscription pills (for example Active) as before. A real problem would still show "Needs attention" | | |
| F-07 | Store admin (C) | Paste the URL of a store they do not manage (for example Store 02) `/admin-portal/stores/<id>` | "**You don't have access to this store**" with **Back to My Stores**. No Retry, no store name, no database text | | |
| F-08 | Store admin (C) | Same with `/admin-portal/stores/<id>/invite` | Same access-denied state. Back to My Stores goes to `/admin-portal` | | |
| F-09 | Owner (A) | Audit log, after a scheduled store removal | The row reads "**Store removal scheduled** · <store> · leaves at the end of the billing period", not "completed" | | |
| F-10 | Owner (A) | Audit log: the earlier admin handover row | "**Store admin role delegated** — Moose Dev (account owner) delegated the Store admin role. Account ownership and billing are unchanged." | | |
| F-11 | Store admin (C) | Audit log: the same handover row | A neutral line: "… is no longer this store's Store admin. Store roles do not change account ownership." | | |
| F-12 | Owner (A) | Audit log: an "Invitation email sent" row | Who = "**System (invitation email)**" | | |
| F-13 | Each role, both apps | Look at the navbar | Name (or "Your account" if no name is set) and a badge **Owner** / **Store admin** / **Member** matching the role. **No email in the bar**. Hover the badge to see its scope | | |
| F-14 | Each role | Open the account menu (avatar on desktop; ☰ on a narrow window) | The full email is shown there | | |
| F-15 | Any | Narrow the window to phone width | Name truncates and the badge stays readable; no overlap | | |
| F-16 | Owner (A) | Profile: password functions | Unchanged from before: password sign-in and password change still offered (full password tests remain in section P) | | |

## Earlier observations (19 Nov 2026 walkthrough — manual, not proof of every API/RLS rule)

- **PASS (observed):**
  - first-store purchase and activation
  - second-store payment completed and activated (with the issue now repaired as R3)
  - owner selects both stores; member sees Store 01 only
  - invitation acceptance
  - member removal enforcement; re-invitation restores access
  - store removal and undo
  - subscription cancellation and undo
  - member denied owner billing, including direct `/billing`
  - member returns from the Portal without signing in again
  - direct Admin Portal, invitation and Store 02 admin URLs redirect a member
  - Profile rejects empty and mismatched passwords
- **Unconfirmed:** one unexpected member logout, not reproducible. Report it if seen again (time, profile, last action).

## Observations recorded 20 Nov 2026 (Tony/JARVIS, as reported — manual)

- **PASS (observed):**
  - admin invitation → new Member acceptance;
  - the Member got access to Store 01 and had no Admin Portal navigation;
  - the owner removed that Member, and refreshing the Member session showed no permitted stores and no store KPIs;
  - the audit recorded the invitation, acceptance, access grant and removal with the expected actors;
  - people and invitations filtering;
  - the Admin's Store 04 attempt was rejected, and the owner still had three stores (the observed quote only).
- **Still pending (not evidenced):**
  - audit pagination ("Load older");
  - 3DS, declined payment and reload/recovery;
  - scheduler-driven expiry and final removal;
  - buyer/transfer;
  - populated claims-data isolation;
  - full password change and login;
  - deployed auth, handoff, mail and webhook smoke tests.
