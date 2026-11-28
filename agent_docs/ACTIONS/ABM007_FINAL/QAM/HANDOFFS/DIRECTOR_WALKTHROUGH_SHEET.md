# Director walkthrough sheet — ABM007_FINAL

Prepared by Cody from the bound plan. Tony performs and records observations; JARVIS guides only. Delivery changed by Tony on 24 November 2026. Delivery revision03: plan amended only by Friday’s Q2-A1; the seven human checks are unchanged. Use this revision instead of earlier sheets.

- OwedBook candidate: `2e91e90905b2d9907577a64985e643f7827019ac`
- Account & Billing candidate: `fc1fa6c2a90ebf59987287ad765e2e65cf635549`
- Both QA branches: `qa/abm007-final`
- Target: SCRATCH (`ihgcsrypblqkwommrkgj`), production builds, local-proof.
- Plan SHA-256 (bound as amended by Q2-A1, confirmation pending): `6a1abc2ae4187874e6c755d195d5ab6fc060c4f26d92520b6df6bc8cf9c73c7d`
- OwedBook: http://localhost:3100 (sign in at `/auth`; signed-in page `/owedbook`).
- Account & Billing: http://localhost:3101 (sign in at `/login`; signed-in page `/dashboard`).

Director confirmation of candidate pair, target and plan hash before first check:


Confirmation time and timezone:


## Before starting

Tell Cody before starting so fixture-affecting work can be held. Cody will keep both builds serving until you say you are finished. Use desktop Google Chrome on the test machine; HC-05 specifically needs Windows Chrome. If these localhost addresses do not reach that QA machine, stop and record BLOCKED; do not substitute alpha or another environment. Record actual browser version and operating system below. Do not change host or backend settings.

Browser version:


Operating system:


Start time and timezone:


Use `ENGINEERING_OWNER_B` for these checks. Read its exact account address and existing password yourself from the private cast file `~/.apbm007b/engineering_cast.json` on the test machine. Do not copy its contents into this sheet, chat, screenshots, logs or any package. Owner B and Invitee map to your confirmed mailbox; Owner A does not. No fixture token substitutes for the password or delivered-email checks.

Before following an emailed sign-in link, inspect its destination privately with JARVIS. Confirm it targets the requested QA app on localhost:3100 (OwedBook) or localhost:3101 (Account & Billing), including any redirect destination. If it points to alpha, ports 3000/3001, another target, or the destination cannot be confirmed, do not follow or rewrite it: record BLOCKED and tell Cody without copying the link. This preserves the existing SCRATCH-only boundary.

Do checks in the order below and fill your observation before proceeding. Leave unperformed checks unanswered; Cody records them PENDING or BLOCKED, never passed. Select PASS, FAIL or BLOCKED only after observing. Do not place any password, email link, code, token or sign-in state here. Screenshots must exclude those and personal data. A failure is not permission to repair or retry a sign-in automatically. Stop that check at its first failure and record it. Do not change a membership, purchase, subscription or payment method.

HC-01, HC-02, HC-04, HC-05 and HC-08 need no effectful journey first. HC-06 and HC-07 need your inbox and each sends exactly two sign-in emails (four total). They do not depend on the invitation/removal or held provider journeys. No real-phone test is required: HC-03 was removed by Director ruling, not passed. Automated phone-width checks remain.

## HC-01 — Password sign-in, both handoffs and sign-out

Criteria: R04(a,b,j).

Before starting: Both builds running at the addresses above; desktop Chrome; ENGINEERING_OWNER_B; initially signed out. Read its password privately from the cast file.

1. Open OwedBook /auth and sign in with Owner B’s existing password through the normal password form. Do not request an email in this check.
2. Use the app’s Account & Billing / billing navigation to cross to the Portal. Verify the same account reaches its signed-in screen without a second sign-in. Record a missing handoff control as observed; do not substitute a pasted URL as proof of a handoff.
3. Use Open OwedBook to return. Verify the same account is still signed in without another sign-in.
4. Use the app’s sign-out control. Revisit /owedbook on port 3100 and /dashboard on port 3101, including a reload, and observe whether access is refused.

Expected result: Same user across both directions without second sign-in. After sign-out both protected pages refuse access.

Allowed changes: One password sign-in and sign-out; normal session/audit effects only. No billing-portal opening or business change; no email.

My observation, in my own words:


Result (PASS / FAIL / BLOCKED):


Time and timezone:


Note (including sign-in/email counts where applicable):


## HC-02 — Keyboard pass on one screen per app

Criteria: B06,B08,L04.

Before starting: Both builds running; desktop Chrome; ENGINEERING_OWNER_B signed in normally. A fresh password sign-in is permitted if needed; record the count.

1. On OwedBook /owedbook, use Tab and Shift+Tab through the header and main controls. Note focus order, visibility and any obstruction.
2. Open a navigation drawer using the keyboard; move through it and close it by keyboard. Do not activate business actions.
3. Repeat on Account & Billing /dashboard. If the desktop layout has no drawer, narrow the desktop Chrome window to show the responsive menu; this is not a real-phone test.
4. Sign out when finished.

Expected result: Order makes sense; focus is visible and unobscured; the drawer can be entered and exited by keyboard.

Allowed changes: Sessions/sign-out, reads and navigation only; no email or business change.

My observation, in my own words:


Result (PASS / FAIL / BLOCKED):


Time and timezone:


Note (including sign-in/email counts where applicable):


## HC-04 — Compare the apps with approved renders

Criteria: B,L,N.

Before starting: Both builds running; desktop Chrome; ENGINEERING_OWNER_B for signed-in screens; approved DESIGN files available at the module path below.

1. Compare both sign-in screens with DESIGN/renders/01-portal-sign-in__desktop.png and 01-portal-sign-in__mobile.png (the literal sign-in reference for both apps).
2. Sign in normally if needed. Compare OwedBook /owedbook with 03-owedbook-dashboard__desktop.png and 03-owedbook-dashboard__mobile.png.
3. Compare Account & Billing /dashboard with 04-portal-dashboard__desktop.png and 04-portal-dashboard__mobile.png; narrow the browser and open its menu against 04b-portal-dashboard-menu-open__mobile.png.
4. Compare the palette and components with style-tile__desktop.png and style-tile__mobile.png. Check the full logo, white logo tile on navy, and product names. Judge the approved visual language; sample fictional data and navigation ordering do not define product requirements.
5. Sign out when finished.

Expected result: Approved light palette/layout language, intact full-canvas logo, and Pharmacy Books / OwedBook / Account & Billing names.

Allowed changes: Reads, responsive browser resizing, normal sessions/sign-out only. No email or business change.

My observation, in my own words:


Result (PASS / FAIL / BLOCKED):


Time and timezone:


Note (including sign-in/email counts where applicable):


## HC-05 — First load and reload with dark preferences

Criteria: B04.

Before starting: Both builds running; Windows desktop Google Chrome; ENGINEERING_OWNER_B if viewing signed-in pages. If Windows Chrome is unavailable, record BLOCKED rather than substitute another OS.

1. Note your current Windows color mode and each QA origin’s theme storage value privately so you can restore them.
2. Open Windows Settings → Personalization → Colors. Set Choose your mode (or Choose your color) to Dark.
3. In Chrome visit http://localhost:3100. Press F12 → Application → Local storage → that origin. Set key theme to value dark. Do the same at http://localhost:3101. Do not inspect or copy session entries.
4. Close DevTools. Open each app in a new tab and watch its first paint. Press Ctrl+R and watch reload on each. Observe any flash of the old dark appearance or any theme control.
5. Restore the prior Windows color mode and only the theme entries you changed. Sign out when finished.

Expected result: No flash of the old dark theme on first paint or reload; no theme control.

Allowed changes: Local Windows/theme preferences (restored); navigation, normal sessions/sign-out if needed. No email or business change.

My observation, in my own words:


Result (PASS / FAIL / BLOCKED):


Time and timezone:


Note (including sign-in/email counts where applicable):


## HC-08 — Read two Help sections

Criteria: H01,H02.

Before starting: Both builds running; desktop Chrome; ENGINEERING_OWNER_B signed in normally if required.

1. Open Help as Owner B and read “Billing and adding a pharmacy” (#billing). Compare the controls it names with the actual app labels without performing a purchase or subscription action.
2. Read “Who can do what” (#roles). Compare its named menus and role descriptions with the visible screen labels.
3. Write whether the instructions make sense and whether anything looks like test/QA content or an inaccurate label. Sign out when finished.

Expected result: Instructions are understandable; quoted labels match the screens; no test/QA content.

Allowed changes: Reads and normal sessions/sign-out only. No email or business change.

My observation, in my own words:


Result (PASS / FAIL / BLOCKED):


Time and timezone:


Note (including sign-in/email counts where applicable):


## HC-06 — OwedBook emailed sign-in link lifecycle

Criteria: R04(a,j).

Before starting: Both builds running; desktop Chrome; ENGINEERING_OWNER_B; signed out; Director-controlled inbox open privately. Two sign-in emails are allocated to this check.

1. Open http://localhost:3100/auth. Enter Owner B’s exact address from the private cast in the email-link form and request one sign-in email. Do not use a fixture token.
2. Open the delivered message privately, follow its link, and deliberately press Sign in on the confirmation page. Observe whether you reach the correct OwedBook account and app.
3. Sign out. Open that same used email link again and press Sign in if offered. Check that it does not restore protected access.
4. Wait at least a minute from the first request. Request exactly one fresh email through OwedBook, open it, and sign in. Observe whether the fresh link works.
5. Sign out. Record what you observed and the number of emails requested, without copying either link. If delivery or sign-in fails, record the first failure; do not resend beyond the two allocated requests.

Expected result: Initial and fresh delivered links sign in to OwedBook; the used link cannot restore access.

Allowed changes: Exactly two requested sign-in emails maximum; successful sign-ins/sign-out and normal audit effects. No account/credential changes.

My observation, in my own words:


Result (PASS / FAIL / BLOCKED):


Time and timezone:


Note (including sign-in/email counts where applicable):


## HC-07 — Account & Billing emailed sign-in link lifecycle

Criteria: R04(a,j).

Before starting: Both builds running; desktop Chrome; ENGINEERING_OWNER_B; signed out; same Director-controlled inbox. Two sign-in emails are allocated to this check.

1. Open http://localhost:3101/login. Request one sign-in email for Owner B’s exact cast address using the email-link form.
2. Open the delivered email privately, follow its link and press Sign in. Observe the account and landing app.
3. Sign out; reopen that used email link and attempt its confirmation. Verify protected access is not restored.
4. Wait at least a minute from the first request; request exactly one fresh Portal email and sign in through it. Observe whether it succeeds in Account & Billing.
5. Sign out. Record your observations and emails requested; do not copy links or retry beyond the allocation.

Expected result: Correct Account & Billing landing; used link refused; fresh delivered link succeeds.

Allowed changes: Exactly two requested sign-in emails maximum; sessions/sign-out and normal audit effects only. No provider/billing settings changed.

My observation, in my own words:


Result (PASS / FAIL / BLOCKED):


Time and timezone:


Note (including sign-in/email counts where applicable):


## Finish

Tell Cody when you have finished and return this filled sheet. The builds remain serving until then. Do not send credentials or message links. Cody records your answers word for word with your times and opens a finding for any FAIL; unperformed checks remain PENDING or BLOCKED.

Finish time and timezone:


Approved render directory on the test machine:
`/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/DESIGN/renders/`

J-c, J-d and J-g remain held. This sheet releases no additional effect.
