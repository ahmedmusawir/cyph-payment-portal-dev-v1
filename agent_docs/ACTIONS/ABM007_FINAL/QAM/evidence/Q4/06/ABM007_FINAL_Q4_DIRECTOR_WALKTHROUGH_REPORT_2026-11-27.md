# ABM007_FINAL — Q4 Director walkthrough report

Prepared for Friday, QA Lead. Prepared by JARVIS from Tony's reported observations and Director Walkthrough Sheet 04. Date: 27 November 2026. All reported times are Asia/Dhaka (UTC+06:00).

## Handoff status

Tony reported completion of the final main-screen sweep at 9:34 AM. W-04 through W-08 have explicit PASS responses in the available conversation. No failures or blocked checks were reported for those five checks. This is Director-reported manual evidence, not independent execution or QA certification.

W-01 through W-03 results are absent from the available conversation and the supplied sheet is unfilled. This does not establish that those checks were unperformed or failed. Friday should reconcile them against Cody's earlier evidence or the original Director journal before issuing a full eight-check verdict. JARVIS's earlier statement that the entire walkthrough was finished was broader than the evidence available here.

## Candidate identification from the supplied sheet

These identifiers are copied from the walkthrough's intended candidate; they were not independently verified in this reporting session.

| Item | Sheet value |
| --- | --- |
| Campaign | ABM007_FINAL, Q4 retest |
| Branch, both repositories | qa/abm007-final |
| OwedBook | http://localhost:3100 |
| Account & Billing | http://localhost:3101 |
| Target | SCRATCH — ihgcsrypblqkwommrkgj |
| Test identity | ENGINEERING_OWNER_B |
| OwedBook manifest SHA-256 | f229d7a129138af7cc97e1fdb5acadf885c1907ad7cd3c140f4bad5334a4d22d |
| Account & Billing manifest SHA-256 | ba726f5ea3f5bf2cdd8156a16360e7674be2da500be48c81cacac19ba682c4b9 |

The sheet states that repaired working-tree manifests were pending Tony's commit and that build-info revision labels were the manifest hashes. It specifies desktop Google Chrome; exact browser version, OS, start time and independent candidate confirmation were not captured in the available responses.

## Results

| Check | Scope | Director evidence | Result | Time |
| --- | --- | --- | --- | --- |
| W-01 | Password handoff, return identity and sign-out protection | Earlier result not present in available record | Not established in this report | Not captured |
| W-02 | Opening-page buttons, responsive layout, labels, focus and local destinations | Earlier result not present in available record | Not established in this report | Not captured |
| W-03 | Portal sign-in header and footer at exactly 768px | Earlier result not present in available record | Not established in this report | Not captured |
| W-04 | Help return-to-top links with mouse/keyboard, phone end link, scrollable contents menu at short desktop heights | Tony reported “pass” and subsequently identified the check as W-04 | PASS, Director-reported | 9:06 AM |
| W-05 | Busy login feedback; readable, inoperable name/email fields; dark-green underlined support link | “PASS ... PASS AND PASS” in response to the three checks | PASS, all three items | Not captured |
| W-06 | Password-eye controls and focus; dashboard tabs/account trigger and mobile strip; pharmacy-row control size/focus | “1 pass 2 pass 3 pass” | PASS, all three items | Not captured |
| W-07 | 320px OwedBook billing/dashboard and Portal billing/dashboard; no page overflow or clipped primary controls | “1 pass 2 pass” | PASS, both items | Not captured |
| W-08 | Main-screen sweep across both apps at 375px, 768px and 1440px | “all pass ... 9:34am” | PASS, aggregate sweep | 9:34 AM |

W-04's PASS covers its full instructed scope; detailed per-interaction observations were not separately dictated. W-05 busy-login feedback was reported as passing by recall of W-01; this does not establish the full W-01 result.

## W-08 scope presented to the Director

- OwedBook: dashboard, Help, Profile, My Stores, Billing & subscription, Settings, Audit and Invitations while signed in; opening page and sign-in after sign-out.
- Account & Billing: dashboard and Billing while signed in; public plan page and sign-in after sign-out.
- Widths: 375px, 768px and 1440px.
- Review: clipping, misplaced labels, unexpected movement and broken layouts.

Tony's aggregate PASS reported no exceptions or inaccessible pages. Final sign-out was instructed but was not separately confirmed in his response.

## Execution boundaries and evidence limits

The walkthrough authorized normal password sessions, handoff, sign-out, page reads, resizing, scrolling, focus and permitted navigation. It prohibited emailed links, invitations, actual removals, hosted billing-portal sessions, Checkout submissions, purchases and setting changes. No prohibited action was reported; compliance was not independently observed. No real-phone test was included. No screenshots or automated test evidence were collected in this conversation.

## Friday adjudication request

Please reconcile W-01 through W-03 with the earlier execution record, confirm candidate identity and required environment metadata from Cody's evidence, and determine whether the Director's reported PASS results satisfy the Q4 retest order alongside the other QA evidence. If final signed-out state is required as a separately recorded condition, reconcile that as well.

The Director has supplied explicit PASS results for W-04 through W-08, finishing at 9:34 AM. Final QA certification, merge readiness and deployment authorization remain with the responsible seats; this report grants none of those approvals.

Source: DIRECTOR_WALKTHROUGH_SHEET_04(1).md and Tony's responses in this conversation. No missing results or timestamps have been inferred.