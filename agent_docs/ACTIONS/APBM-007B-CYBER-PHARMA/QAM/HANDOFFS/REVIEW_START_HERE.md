# Q4/02 COMPLETE — awaiting Friday adjudication

Tested pair, both on `qa/apbm-007b`:

- Portal: `ba66534351368b4b67b9e61d6f0278866950c850`
- OwedBook: `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871`
- Bound plan SHA-256: `c06196aa44ab3cee181e101a175106a96b7f24e1e941f5754aa0bd38124bbdbb`

Both remote heads descend from Q4/01. The complete product diff matches the declared forms and new tests. No server, database, migration, payment or activation implementation changed. No repair, rebind, Git mutation, certification or deployment was performed by QA.

Read the latest Q4/02 sections in `QAM_EXECUTION_REPORT.md`, `AC_EVIDENCE_MATRIX.md` and `FINDINGS.md`, then `evidence/Q4/02/acceptance_mapping_final.json`. `FILE_INDEX.json` binds every other member to its source, size and SHA-256. Earlier evidence retains its original candidate pair and limitations.

| Fresh check | Result |
|---|---|
| Production builds, served identity, SCRATCH/sandbox, ledger | Both builds verified; SCRATCH ledger70 matches all filenames/checksums. No migration or DEV access this round. |
| Unit, typecheck, lint | 823 unit tests passed; both type checks and lint passed. |
| Touched forms under delayed loading | Selected15/15 passed: five forms on three engines, retained text, correct button state, normal-click submitted values, Show password and Add Store optional details. |
| Real authentication regression | 18/18 passed across three engines: both apps' password and link sign-in, change password and cross-app sign-out. Only ROLE_EXISTING_INVITEE_PASSWORD changed, privately, three times. |
| Unchanged browser campaign | 44 passed,1 failed,2 serial skips across14 runs. Dedicated Add Store WebKit: PASS/PASS/FAIL/PASS/PASS; Chromium and Firefox passed. O1 five isolated runs and both full-suite-order runs passed. |
| Staff | Three unchanged WebKit runs passed,6/6 checks. |
| Client bundles | Validated23-pattern controls and actual private-value scans passed. Only the exact approved single OwedBook auth-js.generateLink exception applies. |
| Final optional live buyer completion | **NOT RUN: Director copied link was not provided.** Fresh seller source and history were prepared, transfer authorized and cut off, buyer reservation retained, and one ordinary email requested. No buyer payment or new inbox observation is claimed. |

## Decisions requested from Friday

| Item | Evidence and recommendation |
|---|---|
| F-Q4-001 | Grade the15 loading probes and18 real authentication checks against the repair. Initial profile-probe failures came from QA's HttpOnly cookie injection; corrected follow-ups passed and both attempts remain. |
| F-Q4-002 | Adjudicate the remaining acceptance-evidence/performance-budget failure. The third WebKit run activated successfully, then exhausted the unchanged30-second limit at the final dashboard count assertion. All9 new confirms returnedHTTP200 in9.435–14.672 seconds. No timeout was edited. |
| Original F-Q4-002 timing | Exact original test start was not captured. Operation creation02:21:05.295Z and activation02:21:45.392Z are authoritative. Activation took40.097 seconds after creation, beyond even the latest possible30-second test deadline. No exact start is invented. |
| F-Q4-003 | Seven new O1 runs passed. No simultaneous QA revocation is recorded; later privacy revocations occurred after the original failure. The Auth audit table is empty and the original browser event stream is unavailable, so the original SIGNED_OUT cause remains unproven. |
| O-Q4-02-001 | Review the local listener limitation:9 of10 paid events were observed on first automatic delivery; one had no CLI line or durable receipt until a genuine provider resend. Resend processed withHTTP200 and unchanged operation/store/quantity. Cause unknown; no controlled signer or new payment. Do not infer it caused the UI timeout. |
| Optional buyer / verdict / retention | Grade the explicit NOT RUN availability limitation underD8. Keep all fixtures. Friday owns verdict, further scope and retention. No certificate is composed here. |

## Evidence limits and privacy

Six authentication regression links used real, provider-generated one-time tokens for preverified existing QA identities. They prove browser confirmation and subject identity, **not inbox delivery**. The separate final ordinary email required a Director-copied link; none was supplied. Original Q2 human invitation and billing observations remain attributed to Tony and their original commits.

Q4/01 evidence is carried only for source-identical paths, with exact hashes and original commits in `carry_forward_provenance.json`. Touched forms, new repetitions and authentication results are fresh. GateD remains NOT RUN for permanent HTTPS/native retry/outage, deployed revision/scheduler/Auth/security and rollback readiness. U-1..U-3 remain Director-accepted, not QA-certified. Seller history uses the approved API lane; older operator wording stays Director backlog.

New raw traces, snapshots, links, credentials and auth states remain private0600 under0700 directories and are excluded. All74 new private diagnostics were restricted. Current/retired secrets were scanned in memory; values and credential hashes are never exported. Source references replace the binary-bearing historical complete Portal diff and old ZIPs; current repair product diffs are included. Only the four already approved, sanitized Q4/01 gallery images are carried.

## Effects and exit

Cumulative reservations: provider470/560(last20cleanup), sign-ins244/300, pay_or_hosted74/100, reads4177/8000, attempted639981/1000000cents, mail22/40(last8reserved), refunds2/2, clocks3/7, customers/subscriptions8/16, identity attempts12/14, unique identities8/10, SCRATCH cycles1/3. No counter reset or reclaim; no self-raised limit this round. See `effects/final_reconciliation.json`.

Owned3100/3101 apps and listener are actually stopped. Director processes were untouched; no containers were operated this round. All remote/Auth/provider fixtures remain retained, including F-Q2-001 unrefunded and the new buyer-reserved transfer. Tony may restart his listener.

## Cleanup review — 18 November 2026

Start with QAM_CLEANUP_REPORT.md and evidence/CLEANUP/01/remote_verification.json, local_execution.json, pattern_scan_retained.json, then HANDOFFS/CLEANUP_01_RECEIPT.json. State CLEANUP EXECUTED — AWAITING ACCEPTANCE; exceptions and missing exact certificate body are explicit. Friday acceptance remains required.
