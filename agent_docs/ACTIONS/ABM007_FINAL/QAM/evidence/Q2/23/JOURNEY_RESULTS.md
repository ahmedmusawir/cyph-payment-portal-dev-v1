# AC-R04 journey results — final Q2 return

Overall **BLOCKED**. Each of the ten journeys is recorded below. Friday owns adjudication.

| Journey | Result | Evidence | Qualification |
|---|---|---|---|
| J-a | PASS (Director reported) | HC-06/07 regular Owner B emailed sign-in on both local ports. HC-01 password evidence is separate. Q2/27/HUMAN_WALKTHROUGH_RECORD.md. | Private destination check not separately attested. See provenance limits and Friday adjudication. |
| J-b | BLOCKED (hosted billing return incomplete) | Owner B HC-01 PASS and independent Owner A password handoff, Q2/12. Owner A released billing timeout Q2/09 and Q2/17. Separate Director Invitee error and deleted sandbox-customer reads, Q2/26, F26. | Hosted page and return unobserved. Historical Stripe responses unavailable. No second released opening. |
| J-c | BLOCKED | Director hold. QAM_APPROVAL.md scope 1 and F02. | No registration identity, Checkout handoff or payment. |
| J-d | BLOCKED | Director hold. QAM_APPROVAL.md scope 1 and F02. | No paid Add Pharmacy. |
| J-e | PASS | Owner A password, delivered Invitee email accepted by Director, and Invitee fixture session. Q2/J-e and Q2/J-h/execution.json. | The original store and role were retained, with exactly one invited store added as Member. |
| J-f | PASS | Q2/06, Q2/08 and Q2/10. Store admin guard, wrong-store denial and no Owner payload. Fixture session. | First interrupted runs retained. |
| J-g | BLOCKED | Director hold. QAM_APPROVAL.md scope 1 and F02. | No schedule or undo or listener. |
| J-h | PASS | One cancel and one confirmed Member removal. Former access refused, zero-store UI and before/after comparison. Q2/J-h/execution.json. | Last Member action. Other cast scopes unchanged. |
| J-i | PASS | Q2/06: 50 to 100 distinct events with reads included and filter transitions. Q2/19 Owner B read-only boundary, 14 queried and eight UI rows, older control absent. | Owner A short-history recon corrected under F11. No seeding. |
| J-j | PASS (Director reported) | HC-01 sign-out and protected refusal reported. HC-06/07 used links refused and fresh links succeeded, followed by sign-out. Q2/27 and Q2/12. | OwedBook final sign-out is Tony’s report, with limited screenshot evidence. Exact clock gaps and Portal send-count qualification retained. |
