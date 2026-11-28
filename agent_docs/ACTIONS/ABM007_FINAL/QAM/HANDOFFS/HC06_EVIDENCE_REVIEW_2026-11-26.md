# HC-06 evidence review for Friday

26 November 2026, 10:39 BDT · Cody, QA Executor · Sheet 03 · AC-R04(a,j)

HC-06 remains PENDING for Friday’s decision. The saved Q2 record contains a real delivered OwedBook invitation email and one successful sign-in by the Invitee. Sheet 03 requires a two-email lifecycle for Owner B through the normal sign-in form.

| Sheet 03 step | Saved evidence |
|---|---|
| 1. While signed out, request an Owner B sign-in email at OwedBook /auth | No matching evidence found. The earlier send was one J-e Member invitation from ENGINEERING_OWNER_A to ENGINEERING_INVITEE for O-1 A-mid o1r03, recorded at 08:37:00 BDT on 25 November. The app returned HTTP 201 and showed the sent message. |
| 2. Open the delivered link, press Sign in on confirmation, reach the intended OwedBook account | Tony reported opening the delivered invitation in Chrome Incognito, seeing Finish signing in, pressing Sign in, reaching Your invitations, accepting, and seeing E Buyer e-r03 plus O-1 A-mid o1r03. My Stores showed only E Buyer e-r03. His report is timed about 08:46 BDT on 25 November. The exact time of each click and a separate private destination-check attestation were not recorded. The alias matched ENGINEERING_INVITEE. This covers one real delivered-link sign-in through the confirmation screen for that account. |
| 3. Sign out, reopen the same used email link, try Sign in if offered, confirm protected access remains refused | No matching evidence found. The later automated fixture-session sign-outs and the separate password-session sign-out do not exercise the used email link. |
| 4. Wait at least one minute from the first request, request one fresh email in OwedBook, use it successfully | No matching evidence found. No second normal-form email request, timed wait or successful fresh-link sign-in is recorded. |
| 5. Sign out after the fresh email and record the two request outcomes | No matching evidence found. The effects ledger records one invitation email and one Director-reported Invitee email sign-in. The Owner B email counts await the walkthrough record. |

**Target and build.** The pre-send receipt at 08:36:44 BDT verifies the real OwedBook QA build at localhost:3100, SCRATCH `ihgcsrypblqkwommrkgj`, branch `qa/abm007-final`, candidate `2e91e90905b2d9907577a64985e643f7827019ac`, build ID `iwtrms8cN2rVXC-n79gGf`. The paired Portal at localhost:3101 was candidate `fc1fa6c2a90ebf59987287ad765e2e65cf635549`, build ID `zF6loXbH0G8UyAHWRJsfe`. The 08:59:23 BDT read-only result confirms the same invitation was accepted in SCRATCH by the designated Invitee. The candidate sources use the same own-origin confirm endpoint for the invitation and normal sign-in email, through separate ways of requesting the email. This corroborates the QA path. The actual message destination was not retained.

**Evidence references** (paths relative to the QAM, except source paths).

- Issued worksheet 03, HC-06, lines 176–190. Canonical copy: HANDOFFS/DIRECTOR_WALKTHROUGH_SHEET.md.
- Send and pre-send identity: evidence/Q2/J-e/invite-installed-chrome.json and entry-and-before-installed-chrome.json. Acceptance and scope: evidence/Q2/J-e/accepted-db-scope.json.
- Tony’s verbatim observation and time: evidence/Q2/J-e/director-observation.json. Independent browser scope: evidence/Q2/J-h/execution.json.
- Mail and session accounting: evidence/Q2/effects-progress.json. Existing J-a/J-j limits: evidence/Q2/23/JOURNEY_RESULTS.md.
- OwedBook candidate source: src/server/invitationMail.ts:45–48 and src/server/emailLink.ts:86–95. The engineering deployed walkthrough is marked PREPARED, NOT RUN and targets alpha/DEV.

Friday decides whether the Invitee’s initial-link evidence can carry any part of HC-06. A full HC-06 pass is unsupported by the saved record. No email, session, test or provider request was made for this review.
