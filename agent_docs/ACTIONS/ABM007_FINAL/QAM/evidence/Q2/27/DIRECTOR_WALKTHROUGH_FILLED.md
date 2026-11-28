# Director Q2 walkthrough handoff — completed actions, qualifications retained

Prepared 26 November 2026 for Tony to hand to Cody and Friday. Tony performed every reported action and supplied every Director observation. JARVIS guided and transcribed; JARVIS did not independently test, diagnose, assign severity, or certify.

- Sessions: 25–26 November 2026, Asia/Dhaka (UTC+06:00).
- Preflight start: 25 November 09:24 visible screenshot; first Owner B password sign-in 10:22. Overnight pause occurred; continuous testing is not claimed.
- Last observed action: 26 November 11:06 final Portal sign-out; explicit overall HC-07 PASS followed, without a separate clock time.
- Browser: Google Chrome 157.0.8103.78 Official Build x86_64, verified About Chrome screenshot.
- OS: Ubuntu VM. Director: “CANNOT DO WINDOWS CUZ THE SERVERS STARTED INSIDE UBUNTU VM”.
- Local QA targets: OwedBook 3100; Account & Billing 3101; SCRATCH and candidate pair as printed in source sheet below.
- Cody readiness, relayed by Director: Friday Q2-A1 confirmed in QAM_APPROVAL.md, saved plan matched bound hash, pending removed from active records, original builds serving. The source sheet’s historical “confirmation pending” text is retained below as source text, not current status.
- Director’s separate aloud confirmation of all candidate/hash fields was requested but not transcribed. Build continuity on the second day was not independently reverified by JARVIS. Cody should reconcile service logs/receipts.
- No independent certification decision in this package. Friday owns adjudication, scope and rework disposition.

## Result inventory

| Check | Director result / qualification |
|---|---|
| HC-01 | PASS |
| HC-02 | PASS |
| HC-03 | Removed by Director ruling; not run or passed |
| HC-04 | Director says 768px does not pass visual design; later comparisons passed; separate final overall choice not obtained |
| HC-05 | BLOCKED—Windows unavailable |
| HC-08 | PASS with rework qualification |
| HC-06 | Lifecycle step PASS reports; separate overall answer not obtained |
| HC-07 | Explicit overall PASS |

Unknown times remain unknown. Screenshot clock times are evidence times, not invented click/result times. Bracketed labels identifying replies below are editorial annotations, not Director words.

---

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

“boom ... i'm in”
“here you go ... you can see what happens when both manage billing and add pharmacy buttons on owedbook is clicked”
“it felt like the same app ... as it's supposed to ... no friction”
“yup ... no sign in ... like it's the same app”
“both give me this”
“pass”


Result (PASS / FAIL / BLOCKED):

PASS


Time and timezone:

25 November: initial password sign-in screenshot 10:22; outward navigation screenshots 12:56–12:58; return 13:35; post-logout login screenshot 13:37. All Asia/Dhaka. Result message has no separate timestamp.


Note (including sign-in/email counts where applicable):

Owner B. One normal password sign-in reported. Both crossings and final refusal reported by Tony. Screenshot independently shows Portal login; refusal on both apps is Tony’s report. Opening Add pharmacy form was reported; no submission reported.


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

“PASS”
“no drawer at current width or full width ... but once i shorten it i get this ...”
“only mouse clicks ... after you said ... i tried with keyboard and i could navigate fine with keyboard ... shit tab etc.”
“yup ... shift + tab helped me navigate and once the menu is reached i hit enter and it opened ... worked perfectly”
“esc key helped me close the menu”
“yup i could navigate to every button and menu with shift + tab ... open the menu by pressing enter and down arrow ... close it with esc ... pass all the way”
“hold on ... which dashboard are we talking about ... when i click manage billing to get to the payment portal this is where i end up ... i guess this is the dashboard ... and i got same success w/ keyboard ... pass”
“pass”


Result (PASS / FAIL / BLOCKED):

PASS


Time and timezone:

25 November screenshots: responsive OwedBook 13:45–13:46; Portal billing keyboard observation 13:56; corrected /dashboard observation 14:02; final logout 14:15. Asia/Dhaka.


Note (including sign-in/email counts where applicable):

Fresh normal password sign-in instructed; exact execution count not independently tallied. Mouse exploration preceded keyboard testing. Initial Portal screenshot was /billing; subsequent /dashboard screenshot and report cover the planned page. No business action reported.


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

“ok all the mobile screens pass ... and 1024px and above passes for me ... but look at the 768px ... look at the 3rd screen and top right corner 'sign in' button ... the text is broken in my view ... we can make the font smaller to fit the text ...”
“also look at bottom of the screen ... when i was making responsive designs ... at this point, i would make those bottom links go block ... stack up one below the other and center them ... so that they don't show up broken like this”
“on that note ... 768px doesn't pass the visual design ... let's go finish this”
“that's a pass ... both mobile and desktop looks perfect ... just this one thing I wanted you look at is that all the dropdown menus show up miss placed ... but that happens in chrom's mobile mode on ... once i turn that down ... dropdowns are normal ... is this due to a chrome bug? will they look ok on real mobile ... i can't say ... is this  a fail for ui/ux?”
“here we go ... i say ... pass”
“well that all the mobile menu ... owedbook and payment portal ... i say they pass”
“pass” [style-tile response]
“pass” [final sign-out response]


Result (PASS / FAIL / BLOCKED):

FAIL at 768px in Director wording; later substep PASS responses do not erase that observation. No separate final overall HC-04 choice was obtained.


Time and timezone:

25 November sign-in screenshots 14:18–14:22; supplementary dropdown screenshots 14:50–14:52. 26 November Portal comparison 09:45–09:47; menus 09:48–09:49; final sign-out 10:07. Style-tile reply has no exact time. Asia/Dhaka.


Note (including sign-in/email counts where applicable):

OwedBook dashboard comparison and style tile passed by Director report. Supplied dropdown screenshots show additional audit/settings navigation. Portal comparison includes /dashboard and extra /billing reads. JARVIS continued visual steps after the first failure, contrary to the source sheet stop-at-first-failure instruction; disclose for Friday, do not represent as compliant execution. No repairs made.


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

“BLOCKED—Windows unavailable”
“... we can have windows after deployment”


Result (PASS / FAIL / BLOCKED):

BLOCKED


Time and timezone:

26 November, after the 10:07 screenshot and before Help screenshots at 10:15. Exact ruling time not supplied. Asia/Dhaka.


Note (including sign-in/email counts where applicable):

No Windows dark-preference steps performed. Director proposes post-deployment verification; this is not a waiver or proof. HC-03 remains removed by ruling, not passed.


## HC-08 — Read two Help sections

Criteria: H01,H02.

Before starting: Both builds running; desktop Chrome; ENGINEERING_OWNER_B signed in normally if required.

1. Open Help as Owner B and read “Billing and adding a pharmacy” (#billing). Compare the controls it names with the actual app labels without performing a purchase or subscription action.
2. Read “Who can do what” (#roles). Compare its named menus and role descriptions with the visible screen labels.
3. Write whether the instructions make sense and whether anything looks like test/QA content or an inaccurate label. Sign out when finished.

Expected result: Instructions are understandable; quoted labels match the screens; no test/QA content.

Allowed changes: Reads and normal sessions/sign-out only. No email or business change.

My observation, in my own words:

“ok i'm sharing these 2 screens with you to let you know the issues i have with this ... when i clicked the billing and adding... item i did go to that item (#7) ... which is a pass ... but watch what happened to the UI/Ux ... that left menu is not stuck at the top ... which is also great ... but now think what happens if i click #12 or #13 ... the right side goes all the way to the bottom of the doc ... that is also fine ... but now if you want to go back to the top of the page where the header and menu is .. you are fucked ... now you have to scroll thru the entire fucking doc to go to the top ... this is fucked up ... while this is good ui for the help doc ... we need a small link at the bottom of the left menu that says "Go to the Top" and that will quickly take us to the header of page without scrolling thru the whole god dam doc ... this is a must for me ... pls add to the rework”
“pass” [section #7 wording/labels]
“all good ... pass” [Who can do what]
“done and got the same login screen”
“pass ... of course ... w/ a very few rework request ... including the mobile phone issue ...”


Result (PASS / FAIL / BLOCKED):

PASS — Director qualification and mandatory rework retained


Time and timezone:

26 November Help screenshots 10:15–10:16. Later result and sign-out messages have no exact time. Asia/Dhaka.


Note (including sign-in/email counts where applicable):

Content and named-label checks passed by Director report. Help navigation enhancement is mandatory Director feedback. Phone layout finding is separate deployed-alpha evidence, not local candidate evidence.


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

“pass” [initial link]
“this is what i got .... pass” [used link]
“sign in success via email link ... pass ... right?”
“pass” [final logout]


Result (PASS / FAIL / BLOCKED):

All lifecycle steps reported PASS; no separately requested overall HC-06 result was obtained. Friday to reconcile without inventing a Director answer.


Time and timezone:

26 November: first email timestamp 10:43; initial confirmation and Owner B landing 10:47; used-link refusal 10:49; fresh email timestamp 10:52 visible in later inbox thread; final screenshot filename 045458 (not an authoritative visible clock). Exact fresh-success/logout times not separately supplied. Asia/Dhaka.


Note (including sign-in/email counts where applicable):

Two emails evidenced by 10:43 and 10:52 messages; two successful emailed-link sign-ins reported. Initial correct Owner B landing shown on 3100. Used-link refusal screenshot shown. Final logout screenshot is cropped and cannot independently establish page/time; Director reports PASS. Prior Invitee invitation is separate, not credited as Owner B lifecycle. Private destination inspection was instructed but not separately confirmed in words.


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

“current time 10:56am ... i'm working on this sign in now”
“what now... sign into incognito? done”
“pass” [used link]
“pass” [fresh link]
“pass” [final sign-out]
“pass” [explicit overall HC-07 result]


Result (PASS / FAIL / BLOCKED):

PASS


Time and timezone:

26 November: Director start 10:56; first email 10:57; confirm page 10:58; Owner B /dashboard 10:59; used-link refusal 11:01; fresh-link Owner B landing 11:04; logout/login screenshot 11:06. Overall response after that screenshot has no separate time. Asia/Dhaka.


Note (including sign-in/email counts where applicable):

Exactly two Portal requests instructed; first email delivery shown, fresh request inferred from prescribed sequence plus Director result and landing. No independent send ledger supplied here. Two successful sign-ins shown/reported. No provider settings/billing changes reported. Incognito visible. Private destination inspection instructed, not separately confirmed in words.


## Finish

Tell Cody when you have finished and return this filled sheet. The builds remain serving until then. Do not send credentials or message links. Cody records your answers word for word with your times and opens a finding for any FAIL; unperformed checks remain PENDING or BLOCKED.

Finish time and timezone:


Approved render directory on the test machine:
`/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/DESIGN/renders/`

J-c, J-d and J-g remain held. This sheet releases no additional effect.


# Director rework requests and supplemental observations

This index helps Cody locate the Director’s requests. It is not an engineering diagnosis, priority assignment, or Friday verdict. Keep the verbatim statements above and below with this index.

1. Portal sign-in header at 768px: “Sign in” wraps onto two lines; Director requests text that fits and suggests a smaller font. 25 November 14:21.
2. Portal footer at 768px: uneven wrapping. Director requests vertically stacked, centered items. 25 November 14:22.
3. OwedBook root-page subscription entry: Director reports “Start free trial” routes to login and rejects free-trial wording. Wants a Subscribe action leading to Portal purchase and an adjacent Log in action for existing users. Root screenshots 25 November 14:37–14:42. Director’s original statement:

> hold on bro ... what the hell is this ... owedbook should only give us a login screen maybe a subscribe request which will take us to the payment portal ... but when i tried directly url ... i get this... with a free trial button which takes us to login ... that doesn't make any sense ... first of ... we never mention any free trial anywhere ... if anything it should say something like 'Please subscribe' and that button should take the user to the payment portal where they can buy subscription ... also, there must be a login button right beside the subscription button ... so that the user with a login or active sub can log in ...

4. Director button-color request (exact): “i will ... plz record that the large login button should have that dark blue color as the header text”. Exact time not supplied. Preserve requested scope; Engineer must identify intended control from context rather than recolor all buttons.
5. Help: mandatory “Go to the Top” link at bottom of left contents menu, returning to page header. Exact full explanation in HC-08.
6. Dropdown displacement: Director reports it only with Chrome device emulation enabled, normal when disabled. Screenshots include 425px, 1440px and 2560px emulated views. Additional audit/settings navigation is outside the specific dashboard comparison. Cause remains undetermined.
7. Supplemental cloud alpha phone observation: Director tested the older deployed OwedBook and Portal, not the bound local candidate. Device About screen showed iPhone 13, iOS 27.0.1; Director initially called it iPhone 11. DEVICE-INFO IMAGE EXCLUDED ENTIRELY by Director instruction. No serial number retained in this package. Browser/version, exact alpha URLs, build IDs and capture timezone/date are not established by the cropped app screenshots. Director report provided 26 November 09:11 BDT; screenshot clock times 3:06–3:11 and 6:03 are not reconciled with that report time.

Director’s key alpha observations, verbatim:

> for now i'm giving you the ones i am having an issue with and the ones we were confused about ... i mean, the dropdowns ... which are working fine on an iPhone ... if you like i would find an Android phone to test the same apps and report back ...

> now about the broken page which you will see the bill and subscription page where the add store button goes out of the view port ... that is breaking the layout ...

> the page moves with my finger move ... i remember this from my web dev days ... just one page and one long button can break the whole web page on a mobile phone ...

> other than that the looks and performs great on a real mobile phone ... let me know if you wanna see the good images also ...

Director explains relevance:

> cuz, those dropdowns behaved exactly the same on chrome browser's mobile enabled tests that i did before

Record phone observations as supplemental alpha evidence only. Do not reinstate/pass HC-03, infer candidate phone compatibility, or declare a Chrome bug. Android testing was offered, not performed or required by this handoff.

## Unplanned actions and reporting deviations

- Before formal checks: Invitee invitation work with Cody; separately documented by Cody as Invitee, not Owner B. Not credited toward HC-06.
- HC-01: opening Add pharmacy form and additional Profile/Help navigation, 25 November 12:56–12:58; reported result screenshots, no business submission reported.
- HC-02: initial mouse menu exploration before keyboard repeat; initial Portal /billing then actual /dashboard checked. Responsive OwedBook narrowing performed by Director. JARVIS initially gave an overly restrictive explanation of resizing; retained as guidance deviation.
- HC-04: root landing-page exploration and reported Start free trial click to login, 25 November 14:37–14:42. Additional audit/settings dropdown exploration 14:50–14:52. Extra Portal billing visual screenshots 26 November 09:45–09:47 and menu 09:48. No business mutations reported.
- HC-04: JARVIS wrongly continued the check after the first visual failure despite sheet’s stop instruction. Later substep results are additional observations, not an erasure of failure. Friday to adjudicate execution treatment.
- Supplemental phone testing against deployed alpha reported 26 November; no claim of matching candidate/build/target.
- End-of-check overall results and exact times were not consistently requested. HC-04 and HC-06 gaps are explicitly listed rather than filled with invented Director responses.
- No report of Portal-side Manage billing attempt, purchase, removal, membership mutation or provider change during this guided walkthrough. This is a report boundary, not an independently verified audit finding.

## Architect notes, not Director observations

- Screenshots support Director words, not independent execution by JARVIS.
- Current local screenshots and deployed orange alpha screenshots visibly differ in branding; keep evidence provenance separate.
- Displaced select popups under emulation and working alpha iPhone popups are comparative observations; causation is not established.
- Full raw screenshots with personal email addresses are excluded from the distributable ZIP. The Director expressly excluded the phone About image. Included screenshot index lists safe supporting captures only; omitted captures remain in the originating conversation for reconciliation, not for forwarding unchanged.
- No extra tests/retries, fixture changes or repairs were performed by JARVIS. No severity or certification verdict assigned.

## Cody handoff prompt

```text
To: Cody. From: Tony, Director.

I have finished the guided walkthrough actions. Read this filled sheet and its qualifications, safe screenshot index and rework observations. Preserve my observations word for word and keep JARVIS’s notes separate.

Reconcile the candidate/build continuity and timestamps with your existing receipts. Do not invent missing confirmation, times or an overall Director result. HC-04’s 768px failure remains despite later passing substeps; HC-05 is BLOCKED. HC-03 was removed, not passed. HC-06 has step PASS reports but no separately requested overall answer; flag that for Friday if needed.

Include the supplemental deployed-alpha phone findings separately from local candidate evidence. Exclude the phone About image entirely; device facts only: iPhone 13, iOS 27.0.1. Do not include screenshots exposing personal data or any sign-in link/token. Preserve the mandatory Help “Go to the Top” request and all other Director rework requests for Friday’s disposition.

Build the final Q2 package for Friday with an accurate evidence index and unresolved gaps. Do not repair, repeat tests, send emails, change fixtures/providers, or release J-c/J-d/J-g under this prompt. Coordinate any build shutdown under the existing QA procedure; do not infer permission to restart/swap candidates or change Owner fixtures.

Friday retains certification and rework adjudication.
```
