# HELP_CONTENT — OwedBook Help page

**Version:** 1.0-review · **Date:** 23 November 2026 · **Drafted by:** the ABM author (D-08) · **Status:** content for review. Part A is instructions to the Engineer. Part B is the customer-facing text.

## Part A — Build notes (not shown to customers)

1. **Where.** One Help page in OwedBook, linked from the signed-in navigation (desktop and the mobile menu) for Owner, Store admin and Member. The Engineer chooses the route after inspection. One page with a contents list and anchored sections.
2. **Layout.** Signed-in header stays. Masthead, then one card per section, with numbered step badges for "How to do it" (sample 05 in `DESIGN/`).
3. **Each task follows the same four parts:** what it does, who can use it, how to do it, what should happen.
4. **Sources.** The Architect handoff section 14 (required topics) and the tester guide v3 (task flows). The guide's button names came from the Director's rehearsal, not from source.
5. **Label verification is the Engineer's job.** Every name in **bold** in Part B is a button, menu item or screen name. Before the page ships, the Engineer checks each against the current screen and fills the table at the end of this part. Where the screen differs, the screen wins and the Help text is changed to match. Help never invents a control.
6. **Only what exists.** Resend, revoke and decline of invitations are described only if the Engineer confirms the control exists in the current screens; a paragraph or sentence marked [VERIFY] is removed or corrected otherwise. No [VERIFY] marker ships.
7. **Never in Help:** test cards, test identifiers, tester email aliases, alpha web addresses, cloud or database instructions, QA wording, internal verdicts, real customer data, promised response times, Google sign-in.
8. **Links.** Links to app pages use the app's own routes and the existing app-to-app movement. They must respect existing access rules: a Member following a billing link sees the usual "managed by the Owner" message.
9. **Examples** use fictional names only (Main Street Pharmacy, Riverside Pharmacy).
10. **Names.** "Pharmacy Books", "OwedBook" and "Account & Billing" exactly as written. Text that quotes a Stripe page label must match what the Stripe page shows after the Director's naming changes.
11. **Two statements the Engineer must verify against the real access rules and the real Stripe portal configuration before shipping:** the role table in section 2 (in particular what a Member can open), and the subscription-cancellation sentence in section 8 marked [VERIFY]. Correct the text to what the product actually does; if cancellation is not offered on the Stripe page alpha uses, the sentence becomes "To cancel your whole subscription, contact support."

**Label verification table (Engineer completes)**

| Label quoted in Help | Where it should appear | Matches current screen? | Corrected text, if different |
|---|---|---|---|
| My Stores | OwedBook navigation | Partly. The top menu item is **Admin Portal** (Owner and Store admin only); **My Stores** is its first sidebar item (`Navbar.tsx` links array; `AdminSidebar.tsx` ADMIN_ITEMS) | "Open **Admin Portal** from the menu. **My Stores** is its first page." Members: no My Stores (H-1) |
| Invite member | Pharmacy page | Yes (`StoreDetailScreen.tsx:108`); the form page then says **Invite someone** and **Send invitation** (`LiveStaffPanel.tsx:91`, `:117`) | Steps name **Invite member**, then **Send invitation** |
| Member / Store admin (role choice) | Invite form | Yes (`LiveStaffPanel.tsx:98-99`); **Store admin** shown only when the user may appoint one | Sentence added: the Store admin choice appears only when you are allowed to appoint one |
| Pending / Active (invitation and person status) | Pharmacy people list | No. Invitations list shows the status word (pending) under **Invitations**; accepted people appear under **People with access**; there is no "Active" label (`LiveStaffPanel.tsx:122-149`) | "listed under **Invitations** as pending … appear under **People with access**" |
| Remove (member removal) and its confirmation | Pharmacy people list | Control is **Remove access**, shown only for Members (not the Owner or a Store admin); dialog "Remove {name} from {pharmacy}?" with **Cancel** and **Remove access** (`LiveStaffPanel.tsx:151`, `:162-176`) | Help names **Remove access** and **Cancel**; adds that the Owner and a Store admin are not removed this way |
| Billing | OwedBook admin navigation | Yes (`AdminSidebar.tsx`) | — |
| Manage billing | OwedBook Billing; Account & Billing | Yes in both (`BillingScreen.tsx:96`; Portal `DashboardView.tsx:329`) | — |
| Add store / Add a pharmacy | OwedBook Billing; Account & Billing | Yes: **Add store** (OwedBook, `AddStoreButton.tsx:85`), **Add a pharmacy** (Portal, `DashboardView.tsx:190`) | Both named in section 7 |
| Return link on the Stripe page | Stripe billing page | Not verifiable here: Stripe-hosted, depends on S2 naming | Help says "the return link at the top of the Stripe page" without quoting a label. Rendered confirmation pending S1/S2 |
| Remove at period end | Account & Billing dashboard | Yes (`StoreRemovalControl.tsx:45`) | — |
| Keep this store | Account & Billing dashboard | Yes (`StoreRemovalControl.tsx:42`) | — |
| Settings | OwedBook admin navigation | Yes | — |
| Audit log | OwedBook admin navigation | Yes | — |
| Show: People and invitations / Pharmacies / Billing | Audit log filter | Yes, plus a first option **All changes** (`LiveAuditLog.tsx:24`, label `:76`) | **All changes** added |
| Include views and system steps | Audit log | Yes (`LiveAuditLog.tsx:82`) | — |
| Load older | Audit log | No: **Load older events** (`LiveAuditLog.tsx:97`) | "**Load older events**" |
| My Profile | Account menu | No: the menu item and navbar link are **Profile**; **My Profile** is the page heading (`Navbar.tsx` links array and account menu; `profile/page.tsx:25`) (H-3) | "Open **Profile** … The page, **My Profile**, …" |
| Back to My Stores | Access-restricted page | Yes for a Store admin on another pharmacy (`AccessDenied.tsx:26`). A Member never sees it: `(admin)/layout.tsx` redirects Members to `/owedbook` | Role note in section 2 corrected (see AM-11) |
| Sign out | Account menu, both apps | No in OwedBook: desktop account menu **Logout** (`auth/Logout.tsx:20`), mobile menu **Log out** (`Navbar.tsx` mobile panel). **Sign out** in Account & Billing (`Shell.tsx`). Labels kept by ruling AM-08 (6) (H-2) | Section 11 names **Logout**, **Log out** and **Sign out** where each appears |

Checked against source at the working-tree state of 24 Nov 2026 and, for the public pages, against the rendered production build (`EVIDENCE/E2/rendered/`). Signed-in screens were not rendered (SCRATCH fixtures unavailable, AM-08 (5)); their labels are verified from source and stay a rendered check for independent QA (AC-H02).

---

## Part B — Customer-facing content

### Help

Short answers for owners, store admins and members.

**On this page**
1. Getting around
2. Who can do what
3. My Stores
4. Inviting staff
5. Changing a store admin
6. Removing someone's access
7. Billing and adding a pharmacy
8. Removing a pharmacy
9. Pharmacy settings
10. Audit log
11. Your profile and signing in
12. Claims and uploads
13. Getting help

---

### 1. Getting around

Pharmacy Books has two parts that work together.

- **OwedBook** is where you work day to day: your pharmacies, your staff, settings and the audit log.
- **Account & Billing** is where the account owner manages the subscription: adding a pharmacy, payment details and invoices.

You sign in once. Moving from one part to the other does not ask you to sign in again.

Payment details and invoices are handled on Stripe's secure billing page. When you finish there, use the return link at the top of the Stripe page to come back to Account & Billing.

### 2. Who can do what

Every person has one role for each pharmacy they can see.

| | Owner | Store admin | Member |
|---|---|---|---|
| See a pharmacy | All pharmacies on the account | The pharmacies they are assigned to | The pharmacies they are assigned to |
| Invite and remove staff | Yes, for every pharmacy | Yes, for their own pharmacies | No |
| Manage billing, add or remove a pharmacy | Yes | No | No |
| View pharmacy settings | Yes | Their own pharmacies | No |
| View the audit log | Yes | Their own pharmacies | No |

Things to know:

- There is one Owner for the account. The Owner is the person who pays for the subscription.
- Making someone a Store admin does not hand over the account or the billing. The Owner keeps full access.
- The Owner cannot be removed from a pharmacy by a Store admin.
- If you open a page your role cannot use, you will see a short message explaining that, with a link back to **My Stores**.

### 3. My Stores

**What it does.** Lists every pharmacy you can work in.

**Who can use it.** Everyone.

**How to use it.**
1. Open **My Stores** from the menu.
2. Each pharmacy shows as a card with its status.
3. Open a pharmacy to see its people.

**What you should see.** Owners see every pharmacy on the account. Store admins and Members see only the pharmacies they were invited to. A new pharmacy starts with no claims; that is expected.

**Two counts the Owner may see.** "Access now" is how many pharmacies are usable today. "At next renewal" is how many will be billed at the next renewal. They differ only when a pharmacy has been scheduled for removal.

### 4. Inviting staff

**What it does.** Gives a person access to one pharmacy.

**Who can use it.** The Owner, or the Store admin of that pharmacy.

**How to do it.**
1. Open **My Stores** and open the pharmacy.
2. Choose **Invite member**.
3. Enter the person's email address.
4. Choose their role: **Member** or **Store admin**. The role you choose decides what they can do. Their email address does not.
5. Send the invitation.

**What should happen.** The person receives an email with a sign-in link. Until they accept, they show as **Pending**. After they accept, they show as **Active** and see only that pharmacy.

**If you chose the wrong role.** Invite them again with the correct role. The earlier invitation stays in the history.

[VERIFY] **Resending or cancelling an invitation.** If an invitation is still pending, you can resend it or cancel it from the pharmacy's people list.

### 5. Changing a store admin

**What it does.** Lets someone else manage staff for one pharmacy.

**Who can use it.** The Owner.

**How to do it.**
1. Open the pharmacy from **My Stores**.
2. Invite the person with the role **Store admin**.
3. They accept the invitation from their email.

**What should happen.** The new Store admin can invite and remove Members for that pharmacy. The Owner still sees every pharmacy and still controls billing. The Store admin cannot remove the Owner and cannot see billing details.

### 6. Removing someone's access

**What it does.** Takes away a person's access to one pharmacy.

**Who can use it.** The Owner, or the Store admin of that pharmacy.

**How to do it.**
1. Open the pharmacy from **My Stores**.
2. Find the person in the people list and choose to remove them.
3. Read the confirmation. It names the person and the pharmacy.
4. Confirm to remove them, or cancel to leave things as they are.

**What should happen.** If you cancel, nothing changes. If you confirm, the person can still sign in but no longer sees that pharmacy. Other people in the pharmacy are not affected. The removal is recorded in the audit log.

### 7. Billing and adding a pharmacy

**Who can use it.** The Owner only. Store admins and Members see a short message that billing is managed by the Owner.

**The price.** The first pharmacy is $99.00 a month. Each additional pharmacy is $49.00 a month. Any tax or approved discount is shown before you pay.

**To see your subscription.**
1. In OwedBook, open **Billing**, then choose **Manage billing**. You arrive in Account & Billing, already signed in.
2. Your plan, your pharmacies and your monthly total are shown.
3. To change your card or see invoices, open the Stripe billing page from there. Use the return link on the Stripe page when you are done.

**To add a pharmacy.**
1. In Account & Billing, choose to add a pharmacy.
2. Enter the pharmacy's name and its NPI. The NPI is required and must not already be registered. NCPDP is optional.
3. Review the price. You will see the amount due today and your new monthly total. The amount due today covers the rest of the current billing period, so it changes from day to day.
4. Tick the confirmation and pay.

**What should happen.** When the payment succeeds, the new pharmacy shows as active in both OwedBook and Account & Billing, and your invoice appears in your billing history. If your bank asks you to confirm the payment, follow its prompt.

**If the payment does not go through.** The pharmacy is not added and your plan does not change. Check the message on screen before trying again. Do not pay twice for the same pharmacy.

### 8. Removing a pharmacy

**What it does.** Stops billing for one pharmacy from the next renewal.

**Who can use it.** The Owner.

**How to do it.**
1. In Account & Billing, find the pharmacy and choose **Remove at period end**.
2. Read the confirmation. It shows the date access ends.
3. Confirm, or cancel to leave things as they are.

**What should happen.** The pharmacy stays fully usable until the date shown. Your "at next renewal" count goes down by one. Your "access now" count does not change yet.

**Changed your mind?** Any time before that date, choose **Keep this store**. The removal is cancelled and your renewal count goes back up.

Removing one pharmacy is not the same as cancelling your whole subscription, which affects every pharmacy on the account. [VERIFY] Cancelling the subscription is done on the Stripe billing page.

### 9. Pharmacy settings

**What it does.** Shows the details saved for each pharmacy.

**Who can use it.** The Owner, for every pharmacy. A Store admin, for their own pharmacies.

**How to use it.**
1. Open **Settings**.
2. Choose a pharmacy from the list.

**What you should see.** The saved details, including the NPI. These details are read-only in this release. A field that was never filled in shows "Not provided". To correct a saved detail, contact support.

### 10. Audit log

**What it does.** Shows who did what, to which pharmacy, and when.

**Who can use it.** The Owner, for every pharmacy. A Store admin, for their own pharmacies.

**How to use it.**
1. Open **Audit log**.
2. Use **Show** to narrow the list: **People and invitations**, **Pharmacies**, or **Billing**.
3. Turn on **Include views and system steps** to see more detail.
4. Choose **Load older** to see earlier entries.

**How to read an entry.** Each entry shows the person, the action, the pharmacy and the time in your local time zone. An entry that says a removal was scheduled means the pharmacy is still active until the date shown. Some entries are made by the system, such as a payment update, and show no person's name.

### 11. Your profile and signing in

**Your profile.** Open **My Profile** from the account menu to see your name, email address and role. Your name and email are read-only here. To change them, contact support.

**Signing in.** Enter your email address and we send you a sign-in link. Open the link, then press the button on the page to finish signing in. Each link works once. If you set a password, you can sign in with it instead.

**If a link has expired or was already used.** Ask for a new one from the sign-in page. The newest link is the one that works.

**Signing out.** Use **Sign out** in the account menu. Signing out of OwedBook also ends your session in Account & Billing.

**If you can sign in but see no pharmacies.** Your access may have been removed, or your invitation may not be accepted yet. Ask your Owner or Store admin.

### 12. Claims and uploads

Guidance for uploading claims and reading results will be added here in a later release.

### 13. Getting help

Email **support@pharmacybooks.com**. Tell us the pharmacy name and what you were trying to do. Please do not include patient information in your message.


---

## Engineer corrections appendix (24 November 2026; AM-09 (D), AM-08 (6))

Part B above is the author's text as frozen. The page that ships (`cyph-v1-dev/src/components/help/HelpPage.tsx`, route `/help`) follows Part B with these corrections. Where the screen and Part B differed, the screen won; no control was invented and no guard was changed.

| # | Part B said | Shipped text says | Why |
|---|---|---|---|
| H-1 | §3 My Stores "Who can use it. Everyone"; §2 "a link back to **My Stores**" for any role | My Stores is for Owners and Store admins; Members choose a pharmacy with the **Store** selector on the OwedBook page. Role table row "Open My Stores" added. §2: a Store admin on a pharmacy not theirs sees the message with **Back to My Stores**; a Member who opens a My Stores page is taken to the OwedBook page | `(admin)/layout.tsx` redirects unless `canAdminister` (Owner or Store admin, `tenantScope.ts:22`) |
| H-2 | §11 "Use **Sign out** in the account menu" | "choose **Logout**. On a phone, open **Menu** and choose **Log out**. In Account & Billing the same action is called **Sign out**" | Ruling AM-08 (6): labels kept, Help describes them |
| H-3 | §11 "Open **My Profile** from the account menu"; "name, email address and role" | "Open **Profile** … The page, **My Profile**, shows …"; adds that a new password can be set on the same page | Source labels; the page has a password section |
| H-4 | §4 [VERIFY] "resend it or cancel it" | "choose **Resend** or **Revoke** … The person you invited can also decline it" | Controls exist: Resend, Revoke (`LiveStaffPanel.tsx`), Decline (`InvitationsScreen.tsx`) |
| H-5 | §3 "Two counts the Owner may see: 'Access now' … 'At next renewal'" | Moved to §7 and §8 with the Portal's words **Pharmacies with access now** and **Billed at next renewal** | Not on any OwedBook screen; present on the Portal dashboard (`DashboardView.tsx`) |
| H-6 | §8 [VERIFY] "Cancelling the subscription is done on the Stripe billing page" | Kept, adding "and takes effect at the end of the current billing period" | The Portal refuses to open a billing-portal session unless cancellation at period end is enabled (`billing.ts:119-123`). Confirmation on the Stripe page itself waits for S1 (X-3) |
| L-1 | §4 "they show as **Pending** … **Active**" | "listed under **Invitations** as pending … appear under **People with access**" | No "Active" label exists |
| L-2 | §6 "choose to remove them … Confirm … or cancel" | "**Remove access** … **Remove access** to confirm, or **Cancel**"; step 1 goes through **Invite member**, where the people list lives; the Owner and a Store admin are not removed this way | `LiveStaffPanel.tsx` renders on the invite page; the button is shown for Members only |
| L-3 | §10 "**Load older**"; filter list | "**Load older events**"; **All changes** added | Source labels |
| L-4 | §5 steps | Adds that the form asks what happens to a current Store admin | The disposition question exists (`LiveStaffPanel.tsx:108-112`) |
| L-5 | §7 "In Account & Billing, choose to add a pharmacy" | "choose **Add a pharmacy**. (In OwedBook, **Add store** on the Billing page takes you there.)" | Both controls exist |
| L-6 | §1 to §13 | Two in-text links added: `/admin-portal` and `/admin-portal/billing`; support address as a mail link | Existing guarded routes only; outcomes per role in AM-11 |

No [VERIFY] marker ships. The forbidden-term scan (seeded control first) runs in `src/__tests__/abm007/help-page.test.tsx`.
