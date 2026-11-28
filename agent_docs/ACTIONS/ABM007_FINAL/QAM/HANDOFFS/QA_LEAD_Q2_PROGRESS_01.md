# For Friday — ABM007_FINAL Q2 progress 01

From: Cody, independent QA Executor. Requested by Tony for QA Lead visibility.

**Q2 remains IN PROGRESS. This is a focused progress brief, not the final Q2 return, a new approval request, a verdict or a repair instruction. The walkthrough is not the only remaining work.**

## Identity and scope

- OwedBook: `2e91e90905b2d9907577a64985e643f7827019ac`.
- Payment Portal: `fc1fa6c2a90ebf59987287ad765e2e65cf635549`.
- Both on `qa/abm007-final`; candidate HEADs and bound-plan hash rechecked for this brief.
- Plan SHA-256: `90fce657fe5625c17f30273cf7c995c5165e70ba861c6b615eb8e09176bc5237`.
- SCRATCH production QA builds, ports 3100/3101. Tony released scope 1 only. J-c, J-d and J-g remain held.
- No tests or target effects were performed to prepare this status brief.

## Work completed or attempted

| Area | Current evidence/result |
|---|---|
| Clean-install gates | Both builds, typecheck and lint completed successfully. OwedBook 59 suites/394 tests; Portal 36 suites/584 tests. Readiness and suite receipts remain in the canonical QAM evidence lane. |
| Browser matrix | 762 saved rendered measurements, with separate interrupted-run records. These are measurement counts, not 762 passed journeys. No anchor-color, old-name, font or overflow flags in those measurements. Contrast coverage is incomplete; unsupported gradient contexts were excluded from passes. |
| Member/Store-admin access | Portal billing overview returned 403 without owner payload for both roles. Role navigation, Help, menus and Member hover/focus checks recorded. |
| Password handoff | Explicit diagnostic completed OwedBook → Portal → OwedBook with the same identity, then both apps refused protected pages after sign-out. First selector-timeout attempt retained. Director HC-01 remains pending. |
| O-1 | 30 attempts, ZERO complete: 29 stopped at a missing Store-admin Manage billing control; one Firefox initial-navigation timeout. All 18 sessions signed out. The missing control agrees with the owner-only outcome ruled in AM-11/12 but prevents the bound O-1 route from completing. F12. |
| Audit paging | Include views/system steps ON grew from 50 to 100 distinct event IDs. Extra short-history OFF boundary is unresolved: Q1 omitted account-level records, and runtime filtering matters. F11. |
| Billing portal, J-f | Single released opening attempt consumed: one app POST, then 30-second wait for hosted page timed out. Provider session creation UNKNOWN; no settings/payment action, no retry; sign-out 200. F15. |
| Product observations | F03: control height/radius/typography departures. F04: OwedBook busy Login lacks aria-busy. Proposed findings, not QA Lead dispositions. First instrument failures remain recorded separately. |

## Work remaining besides Tony's seven checks

1. **Invitation and acceptance (J-e):** not performed. The running QA helper still blocks application invitation mail. Configure only the released existing Invitee address in the QA runtime allowlist, preserve target/fixture guards, then use the single invitation/email/acceptance envelope. This needs a runtime transition; builds must stay running until Tony confirms his walkthrough is finished. Inbox mapping for Invitee was verified; acceptance still needs coordination with Tony.
2. **Member removal (J-h), then removed/zero-store checks and after-scope comparison:** not performed. It must follow invitation/acceptance and be the last Member action. One cancel, one confirm; no reset or re-invitation.
3. **Mock-mode runtime verification:** separate build exists, runtime check not performed. It must not replace the real QA build while Tony needs it.
4. **Remaining automated/review work:** finish contrast coverage/limitations, status/link/layout review and reconcile every acceptance criterion and CR journey with actual evidence. These are Cody's unfinished tasks, not work being attributed to Tony's walkthrough.
5. **Final records:** human answers verbatim, consolidated findings/effects, keep-list proposal, exact records staging list and complete indexed Q2 package. Nothing staged or committed by Cody.

## Decisions/questions for Friday

- **F12 / O-1:** adjudicate the conflict between the bound Store-admin route's Manage billing step and the ruled owner-only view. No replacement Owner route or plan amendment has been silently substituted. All incomplete attempts remain.
- **F11:** disposition of the extra short-history OFF boundary given the corrected fixture scope and observed filtering. No new fixture or reset is proposed as implicitly authorized.
- **F15 / J-f:** assess the incomplete single billing-opening attempt and limited diagnosis. No repeat is scheduled; any additional effectful attempt needs Tony's explicit authorization as well as QA routing.
- Full finding dispositions and repairs remain for the final Q2 adjudication. Do not treat this brief as a request to start repairs or waive a criterion.

## What Tony needs to provide

Complete the seven checks using worksheet revision02 with JARVIS guiding; return his observations in his own words and confirm when finished. No answers have been received or prefilled. HC-03 is removed by Director ruling, not passed. No decision on the three held provider-event journeys is assumed or required for unaffected scope-1 work.

## Effects and package limits

At the latest execution checkpoint: 67 saved Q2 sign-ins against the planning ceiling of 100; human counts still pending. One billing-opening attempt. Zero invitation, acceptance, Member removal, executor-sent sign-in emails, purchases or subscription changes. No listener or DEV/alpha operation in Q2.

This small ZIP includes the current status note and selected primary receipts for the key open points. It deliberately does not reproduce the full Q1/Q2 dossier, every source excerpt, working report, instrument control or all browser measurements. Those remain in the canonical QAM lane and belong in the final complete Q2 package. No final completion or certification is claimed. FILE_INDEX.json gives exact source paths, sizes and hashes for every included member.
