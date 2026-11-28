# Effects against release ceilings

| Effect | Released ceiling | Accounted for |
|---|---|---|
| Sign-in/setup sessions and sign-outs | Planning ceiling 150 | 116 successful helper sessions plus 3 failed token setups and one successful J-e Invitee email sign-in = 120 conservative before the walkthrough. HC-01 confirms one password sign-in. HC-06 and HC-07 report four successful emailed-link sign-ins. Known conservative total at least 125/150. Extra walkthrough password starts and individual sign-outs were not independently tallied, so a complete exact ceiling comparison is unavailable. Used-link refusal did not create a successful session. |
| Owner sign-in mail | 4 total, 2 OwedBook and 2 Portal | 4 accounted for. Two OwedBook mail timestamps. For Portal first delivery shown and second request inferred from the run and fresh-link report. No separate provider send ledger. All attributed to Owner B. Executor sent no normal sign-in emails. |
| Invitation, invitation email, acceptance | 1 each | 1/1 each. Existing Invitee, Owner A pharmacy O-1 A-mid o1r03. No resend or revoke. J-e. |
| Member removal | 1 cancel, 1 confirmation | 1/1 each. Cancel preserved access. Single removal of ENGINEERING_MEMBER from O-1 A1 o1r03, then removed-access reads and sign-out. J-h. |
| Billing portal | 1 released Owner A opening, optional second only after proven instrument fault | 1/1 released Owner A attempt incomplete. Condition for second opening unmet. Separately, one failed Director unplanned Invitee opening outside release. No charge or setting change reported. F15 and F26. |
| Audit reads | As plan needs | Existing history exercised, including filter/page and short-history checks. Normal session/read-page audit effects recorded as such. |
| Read-only diagnostic | Director released scoped customer lookup | One sandbox account guard GET and two sandbox customer GETs. Zero provider writes from this diagnostic. F26. |
| Held provider journeys and listener | 0 authorized | J-c, J-d, J-g BLOCKED. Zero registration/Checkout, purchase, subscription schedule/undo or listener. |
| Other effects | No resets, fixture creation, credential or dashboard changes, purchase, deployment or Git mutation | None performed by QA. Director observed the local root entry and opened Add Pharmacy without reporting submission. Alpha phone notes are supplemental. |

See effects-progress.json for individual automation receipts and Director accounting. Private identities and session state are omitted.
