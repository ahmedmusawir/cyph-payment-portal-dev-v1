# APBM-007B — Director-led manual QA walkthrough: repair ledger

- **Walkthrough:** Tony (Director) and JARVIS, 19 November 2026, on local OwedBook :3000 / Portal :3001 against DEV.
- **Repairs:** Claudy, 20 November 2026, under the Director's approved repair plan (OwedBook `agent_docs/RESPONSES/response_2026-11-19_173752_manual-qa-repair-plan.md`) and approval with decisions (20 Nov 2026, recorded in `APBM_RULINGS.md`).
- **Retest status:** every row is **PENDING Tony/JARVIS retest**.
- **Certification:** this ledger does not change the historical Gate Q certification (`QAM/QAM_CERTIFICATION.md`, pair `ba66534`/`855e0ad`). That certification stays as recorded. Current manual acceptance is tracked here and in `MANUAL_QA/TESTER_PLAN.md`.

## Baseline

| Repo | Branch | HEAD (= `origin/main`) | Working tree before repairs |
|---|---|---|---|
| OwedBook `cyph-v1-dev` | `main` | `64295a742aa25e46fdf8b3f31e18b561c86ee596` | records only (19 Nov session, responses, evidence lanes, `RECOVERY.md`) |
| Portal `cyph-payment-portal-dev-v1` | `main` | `0443fda34217b2eb94d44b19b4a106e107a1c2e8` | `CHANGELOG.md`, `GATE_D_HANDOFF.md` §5 (19 Nov) |

- **Databases:** DEV was at migration 70 during the repairs; **0071 was applied to DEV on 20 Nov 2026 under a separate Director release** (`DEV_APPLY_0071_PREPARED.md`, APPLIED section). SCRATCH is at 71.
- **Local mail:** `MAIL_RECIPIENT_POLICY=open` is set in both local `.env.local` files (DEV-fenced) for the alias tests.
- **Branch:** the repair branch had not been created when work began, so the edits are uncommitted working-tree changes on `main` in both repos. Tony moves them with `git switch -c …` (see the report).

## Findings and dispositions

| # | Finding (walkthrough) | Cause established | Change | Checks | Status |
|---|---|---|---|---|---|
| R1 | OwedBook Billing "Add store" disabled with "Not available in this release"; Portal "Add a pharmacy" is a small link; signup says adding stores and naming an admin are "not available yet" | `AddStoreButton.tsx` hard-coded a disabled button in real mode. The Portal already accepted `/stores/add` as a handoff destination. The signup copy was stale | **OwedBook:** owner-only "Add store" link to `peerOrigin()/api/handoff/start?return=/stores/add` (existing destination-verified handoff, configured origins), with busy text and accurate eligibility. It is shown only after billing loads for the owner. **Portal:** primary "Add a pharmacy" button, full width on phones. Signup, plan and review copy now say more pharmacies are added from Billing once active. The disabled "Someone else" admin option is replaced by the supported delegation path (owner invites a store admin from OwedBook) | unit tests (link target, no "not available" text, copy); both builds | FIXED — retest pending |
| R2 | Grey buttons with no progress | Actions only set `disabled` | Spinner plus action-specific text and `aria-busy` on:<br>• **Add store:** price calculation ("Calculating price…"), "Processing payment… this can take up to a minute", cancel, check status<br>• **Store removal:** "Scheduling removal…" and "Keeping store…"<br>• **Subscription:** "Undoing cancellation…"<br>• **OwedBook staff:** send, resend, revoke and remove-access actions<br>• **OwedBook:** "Opening Account & Billing…"<br>Live regions announce progress and results; controls come back after errors; duplicate-submit guards are kept | jsdom tests (aria-busy, busy text, single post) | FIXED — retest pending |
| R3 | Second store: long apparent freeze, "Payment needs your action" mixed 3DS with card failure, then Stripe's page with no way back | **DEV read-only record of operation `ab6a6a91…`:** invoice finalized `open`; the single server `invoices.pay` failed with Stripe code **`missing`** (no customer default card) at 09:25:42Z; `invoice.payment_failed` followed; Tony paid on the hosted page (`invoice.paid` 09:33:17Z); the store activated at 09:33:24Z. **Root cause:** registration Checkout saves the card on the *subscription*, but the add-store charge used only the *customer* invoice default. Every proof fixture set a customer default explicitly, which masked this. **Return limitation verified:** the installed Stripe SDK (`2026-04-22.dahlia`) invoice types contain no return/redirect parameter, so the hosted invoice page cannot send the owner back | **Server:** the one charge now passes the subscription's `default_payment_method` (or Stripe's customer default if none), recorded in the provider-call intent. `statusFor` adds `paymentIssue` (`processing` / `authentication_required` / `declined` / `no_payment_method` / `unknown`), derived only from the recorded outcome of that single attempt. No retry, no second charge; idempotency, lease, deadline, webhook and activation are unchanged. **UI:**<br>• distinct wording per issue<br>• Stripe's page opens in a new tab once after Pay, with a prominent button always shown and a popup-blocked notice<br>• not offered while processing<br>• the page keeps asking the server: 4 s for 2 min, then 15 s, stopping at 35 min, plus an immediate check on tab return and a "Check payment status" button<br>• a slow-wait explanation<br>• reload or manual return resumes the operation (sessionStorage, else the owner's server operation list)<br>• completion screen only when the server reports `activated`, with "Back to billing" / "Open OwedBook" | consent-deadline suite plus 2 new tests (subscription card used, single charge); state-mapping and polling tests; 4 jsdom flow tests | FIXED — retest pending. **Not re-run against Stripe:** a live add-store payment by an owner whose card exists only on the subscription is the key retest |
| R4 | Member access removed with no confirmation | `LiveStaffPanel` posted immediately | Dialog: "Remove {person} from {pharmacy}?", the consequence, Cancel and **Remove access**, progress and result. Server authority is unchanged (`member_remove`) | jsdom: Cancel posts nothing; confirm posts once; result names person and pharmacy | FIXED — retest pending |
| R5 | Owner shown as "Member" (Profile) and "Store admin" (lists); admin invitation offered to demote or remove the current admin even when that is the owner | **Labels:** Profile read the platform `user_roles` table ('member' for every customer); the owner's store row is `admin`; no RPC said who the owner is. **Authority:** already ownership-based (`accounts.owner_user_id`, `store_manager_role`). **Gaps:** delegation demoted the owner's row (never deleted, 0064:174); `member_remove` refused the owner only for a store-admin caller; the UI never named the incumbent | **Migration 0071:**<br>• `admin_members` marks `is_owner`, and lists the owner even without a row<br>• `invitation_create` refuses "remove" when the incumbent admin is the owner, and refuses inviting the owner as a member<br>• `member_remove` refuses the owner's membership for **every** caller<br>**UI:** Owner badge in staff lists, store detail and Profile (from `tenant_stores`); no remove control for the owner; when the owner holds the admin role the invite explains delegation ("You stay the Owner with full access…"), shows no demote or remove choice and sends `member`; otherwise the incumbent admin is named. Ownership transfer is untouched | SQL proof on SCRATCH: 26 new checks, including owner authority on every owned store after delegation, a delegated admin with no billing (overview, billing status, subscription status) and no admin appointment, owner removal refused for every caller, and the owner reclaiming the admin role; jsdom label and delegation tests | FIXED on SCRATCH — **needs DEV 0071 apply** before the retest shows Owner in staff lists (Profile works without it) |
| R6 | Settings shows only the name and "Editing settings is not available…" | The settings page read only the first store; real `getSettings` hard-coded "Unavailable"; no RPC returned the stored address, phone or software | **0071** `store_profile(p_business)`: owner or store admin of a live store; audited read. **UI:** pharmacy selector (several stores); name, NPI ("Read-only identifier"), NCPDP, address, phone, software; "Not provided" for empty stored values; no save control; "Editing pharmacy details is pending approval; contact support" | SQL scoping proof (owner, admin, member, foreign, anonymous); jsdom (values, selector, no save) | FIXED on SCRATCH — needs DEV 0071 (until then the page shows name/NPI/NCPDP and says the rest is unavailable). Data gaps below |
| R7 | Profile: "Member" badge; "Contact an admin to change your email or name" | Badge as R5; no admin workflow for identity changes exists | Badge = Owner / Store admin / Member from `tenant_stores` (Superadmin kept). Guidance: "Name and email changes aren't self-service yet. To change them, contact support at support@pharmacybooks.com." Password behaviour is unchanged (min 8, match, visibility toggle, spinner) | jsdom; existing ProfileForm tests | FIXED — retest pending. The full password checklist is in the tester plan (NOT RUN) |
| R8 | Audit shows "Updated record", raw table names, "Done"; times 6 h behind with no label; view events crowd the page | `admin_audit` returned no before/after detail and no actor name; the client sliced the ISO string (UTC, unlabelled) and hard-coded "done"; every read logged `read_page` | **0071** `admin_audit(…, p_include_reads default false)`: per-row `actor` and a whitelisted `detail` (invitation status/role/email; membership role and person; store removal date and status; subscription cancel/quantity/status; operation state). No whole rows; scoping unchanged; the old overload is dropped. **UI:**<br>• "When" in the browser's timezone with an explicit zone label (stored timestamps untouched)<br>• Who, What happened, Pharmacy, Details columns<br>• honest fallbacks ("Record changed: …", "Not recorded")<br>• category filter; "Include views and system steps"; "Load older events" (`p_before` paging) | SQL proof (detail, actor, view filter, scope, limit, helper not executable); 19 wording, actor and timezone tests (Dhaka GMT+6). The test caught an `Intl` option conflict before release | FIXED on SCRATCH — needs DEV 0071 (until then generic wording, with a note) |
| R9 | Removal confirm was a browser "OK"; "Pharmacies covered" dropped 2→1 while both stayed active | `window.confirm`. Values verified: scheduling sets the Stripe and mirrored quantity to the next-renewal count (0063:214); the store stays live until period end. **The billing is correct; the label was wrong** | In-page dialog: "Remove {pharmacy} on {date}?", access until then, "No refund or credit is given for the current period" (existing policy copy), Cancel / **Schedule removal**, busy text. Plan card: "Pharmacies with access now" (live stores) and "Billed at next renewal" (quantity) with "1 pharmacy leaves on {date}". No billing logic change | jsdom dialog test; e2e spec updated for the dialog (not run) | FIXED — retest pending |
| R10 | `[SUPPORT EMAIL]`, Terms/Privacy `[LINK TBD]`; aliases needed per-address allowlist edits | Placeholder constants; exact allowlist only (contract O-2) | Support = `NEXT_PUBLIC_SUPPORT_EMAIL`, default `support@pharmacybooks.com` (contract-recorded; **mailbox operation unverified**). Terms and Privacy = `NEXT_PUBLIC_TERMS_URL` / `NEXT_PUBLIC_PRIVACY_URL` (https only); until set, pages say "(link not yet published)". Nothing is invented. **Mail:** `MAIL_RECIPIENT_POLICY=open`, honoured only on the DEV/alpha project `yrsuwikjnbmvpznrgydb`; default allowlist; `*` and `MAIL_GUARD=off` stay ignored. Contract amendment AM-MQ-02. Configuration: `MANUAL_QA/2026-11-19/STAGING_MAIL_AND_AUTH.md` | 7 policy tests per app; invitation path (sent on DEV, blocked before claim elsewhere); notice path (sent on DEV, blocked elsewhere) | FIXED in code. **Missing inputs:** Terms URL, Privacy URL, support mailbox check. Staging not configured or verified |

## Data and schema gaps (R6, R8)

- **Collected but not shown on Settings:**
  - Owner mobile: kept in `registration_drafts.owner_phone`; `businesses.mobile_number` is never set.
  - Owner declaration version/time: draft only.
- **Never collected:** `address_line2`, fax, store email, licenses, website, timezone.
- **Stores added after registration (Add Store):** only name, NPI and NCPDP are collected. Their address, phone and software show "Not provided".
- **Audit:**
  - No semantic event table exists; wording is derived from row changes.
  - Actors are absent for service-role writes, which show as "System (billing or scheduler)".
  - Rows for removed or transferred stores stay excluded by the existing scope.
  - Direct RLS table reads are not audited (unchanged).

## Observations kept as recorded

- **Earlier member logout:** one unexpected logout, not reproducible. Recorded as **unconfirmed**. No session code was changed in this round, and no root cause is claimed.
- **Walkthrough passes (manual observation, not proof of every API/RLS rule):**
  - first-store purchase and activation
  - second-store payment completion and activation
  - owner selects both stores; member sees Store 01 only
  - invitation acceptance, member removal enforcement, re-invitation
  - store removal and undo
  - subscription cancellation and undo
  - member denied owner billing, including direct `/billing`
  - member returns from the Portal without signing in again
  - direct Admin Portal, invitation and Store 02 admin URLs redirect a member
  - Profile rejects empty and mismatched passwords

## Outstanding — NOT passed

- **Owner protection and delegated admin:** invitation and access, on DEV after 0071.
- **Store transfer to a buyer.**
- **Scheduler-dependent expiry and final removal.** The scheduler was not running; see the tester plan's setup section.
- **Populated claims/data isolation.**
- **Remaining Profile tests.**
- **Staging deployment and handoff verification.**
- **Retest of R1–R10.**

## Final consolidated batch — 20 November 2026 (Director order; Claudy)

**Workflow (Director-approved):** repairs and checks by Claudy → targeted manual retest by Tony/JARVIS → deployment preparation. The broader campaign is **not** certified.

### Repairs (code complete; manual retest pending)

| # | Finding | Repair | Status |
|---|---|---|---|
| F1 | A Store admin could open `/stores/add` and see the form; the Stark Test Pharmacy 04 quote was correctly refused | Portal page guard on the server, before render, using the APIs' own predicate (`ownerAccess` → `owner_billing_overview`). Non-owners get the owner-managed billing notice (`OwnerOnlyNotice`, now shared with the billing screens). A failed check fails closed (no form). **Review of the associated operations:** quote, confirm/pay, status/resume, abandon, the operations list, removal and undo all pass through `ownerContext`, or `owner_store_operations` for the list, and refuse non-owners with 403 before any service-role or Stripe call. Status and abandon return 404 for another account's operation. The database claim refuses another account's quote (`store_operation_claim` checks the quote's actor and the account owner), and the Portal re-checks the claimed operation's account before advancing | FIXED (tests) |
| F2 | The Store admin saw "Subscription unavailable / Needs attention / One store needs attention" for an active store | `admin_stores` withholds `subscription_status` from non-owners (0060/0063). An absent field now maps to `owner_managed`: a neutral "Managed by owner" (card) and "Billing managed by owner" (detail), never counted as needing attention. A present but unknown value is still "Unavailable" for the owner. A suspended store still needs attention. No billing permission changed | FIXED (tests) |
| F3 | Unauthorized store or invite URL showed "not an administrator of business" plus Retry | `AccessDenied`: "You don't have access to this store", with a **Back to My Stores** link and no Retry. No store name or details are shown (breadcrumb omitted). Recognised by database code 42501 (now kept on the error) or the store-scope refusals. Transient failures keep Retry | FIXED (tests) |
| F4a | "Store removal: completed" | A completed `store_removal` request reads **"Store removal scheduled · leaves at the end of the billing period"**. The actual removal is the pharmacy record turning `removed`: **"Store removed"**. A completed undo reads "Store kept (removal cancelled)" | FIXED (tests) |
| F4b | The handover row suggested Moose Dev became only a Member | When the viewer is the account owner (so it is known), the row reads **"Store admin role delegated — Moose Dev (account owner) delegated the Store admin role. Account ownership and billing are unchanged."** A known non-owner shows the role change. When unknown (a store admin viewing), the wording is neutral: "… is no longer this store's Store admin. Store roles do not change account ownership." | FIXED (tests) |
| F4c | "System (billing or scheduler)" on invitation email events | System actors are named from the row's table: "System (invitation email)", "System (billing)", "System (billing or scheduler)" for store operations and pharmacy records, otherwise "System (automatic)". A person is never invented | FIXED (tests) |
| F5 | Navbar showed the full email | Both apps show the **display name** (profile `full_name`) and a **compact role badge** (Owner / Store admin / Member) from `tenant_stores`, never from the email address. The badge's title and screen-reader text state its scope (for example "Owner of 1 pharmacy · Member of 1 pharmacy"). There is no badge while loading, on a read failure or in demo mode. The full email is in the account menu (desktop dropdown, mobile panel or drawer). Long names truncate. With no name set, the bar shows "Your account" (the Portal used to show the email local-part); the avatar falls back to the email initial | FIXED (tests) |
| F6 | Authentication scope | Unchanged: profile password functions and password login kept. No Google OAuth, no removed method, no pharmacy editing, no onboarding change | KEPT |

**Not changed:**
- stored audit rows and history (presentation mappings only);
- migration 0071 (no new migration needed);
- billing permissions;
- authentication methods.

### Checks actually executed (20 Nov 2026)

- **Jest:** OwedBook **370/370** (53 suites); Portal **568/568** (31 suites).
  - New: OwedBook `manual-qa/final-batch-audit-identity.test.tsx` (15); Portal `manual-qa-add-store-authz.test.ts` (31), plus 2 shell tests, 2 layout tests and 1 notice test.
  - Updated for the intended changes: the navbar mobile test, RA-3 owner-managed mapping, the audit handover and actor wording, `getPortalUser` fallback, and the reviewed Supabase importer list (+ `/stores/add` page).
- **Typecheck:** clean in both.
- **Lint (changed files):** 0 errors. Warnings are only the existing set-state-in-effect pattern.
- **`next build`:** both PASS in isolated copies. The running :3000/:3001 servers were untouched.
  - The Portal build stopped once on the Next.js security reminder (exit 1 after a successful compile) and passed on rerun. No upgrade was performed.
- **Not run:** Playwright, live payments, mail sends, scheduler, deployment, DEV writes.

### Observed manual results (Tony/JARVIS, 20 Nov 2026 — recorded as reported)

- Admin invitation → new Member acceptance: succeeded.
- The Member got access to Store 01 and had no Admin Portal navigation.
- The owner removed that Member. Refreshing the Member session showed no permitted stores and no store KPIs.
- The audit recorded the invitation, acceptance, access grant and removal with the expected actors.
- People and invitations filtering worked.
- The Admin's attempted Store 04 addition was rejected ("This store was not added. Billing is managed by the account owner."). The owner still had three stores. This proves only that the observed quote was refused; the operation-level coverage is in the F1 tests.

### Still pending (not evidenced)

- Audit pagination ("Load older"): not exercised.
- 3DS, declined payment and reload/recovery paths.
- Scheduler-driven expiry and final removal.
- Buyer/transfer scenarios.
- Populated claims-data isolation.
- Full password-change/login verification.
- Deployed authentication, handoff, mail and webhook smoke tests.
- Retest of F1–F5 above.
