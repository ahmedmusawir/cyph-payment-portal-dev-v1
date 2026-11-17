# APBM-007A final closeout and handoff to the 007B lab

**Date:** 16 November 2026, Asia/Dhaka  
**Author:** JARVIS, Chief Architect  
**Director:** Tony  
**QA Lead:** Friday · **QA Executor:** Cody · **Engineering and closeout:** Claudy

## Closure and release status

**APBM-007A is closed on the integration evidence supplied by the Director.** Payment Portal was merged and pushed to remote main with a clean-tree verification. OwedBook was merged into protected main through [GitHub PR #10](https://github.com/Cyberize-Group/cyph-v1-dev/pull/10), as confirmed by the Director’s supplied GitHub screenshot.

Friday’s verdict is **Gate Q: PASS WITH KNOWN RISK** for the exact pair below. Later U-1/U-2/U-3 changes were separately accepted by Tony without another QA run. They must not be described as independently QA-certified.

**Nothing was deployed. Gate D remains pending.** This closeout does not authorize staging, production billing or 007B execution. The next lab must bind its work to the actual merged main baselines and its own Director release.

One integration receipt remains to be completed: the screenshot establishes OwedBook PR #10 as merged but does not expose its full merge SHA. Local OwedBook main refresh and post-PR tree/ancestry verification have not been returned to this lab. Retrieve these facts at the next read-only baseline check; do not confuse the QA head with the merge SHA. This is a receipt completion task, not another product repair or QA campaign.

## Repository and identity record

| Identity | OwedBook | Payment Portal |
| --- | --- | --- |
| Local checkout | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` |
| Continuing QA branch | `qa/apbm-007a` | `qa/apbm-007a` |
| Friday-certified candidate | `c976968b20ee724f7390d5e0e008215f50ab6f25` | `54a56b55ea7c72783d17d06ff45cd27b5426803f` |
| Certified Portal product | — | `6ed09ffc05685a163833cb68fcae4383c67ae349` |
| r06 records head before Q5 | `c59ead583c9d20328d1a85af60d015753b62abf7` | `1a3913262ed0f8e8303823d92d2551fd9cc725b3` |
| Q5 records head | `af1b4af04592f04689de2e4de59f28db65437f8b` | No Portal Q5 change |
| Final closeout QA head | `ff66effeab451073ca91f09941b156f4edb6dfa4` | `a78e7c42bfe33f03b796aba3e42dc80cd38434b6` |
| Main before integration | `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` |
| Final main merge | **Retrieve full SHA from merged PR #10** | `c68c4acaccc4a68f20ede267f06cfda17fa15aac` |
| Final main tree | Verify after OwedBook remote refresh | `0736957c20745aadae714f3befb543fca30f3aa1` |
| Integration evidence | QA branch push receipt and GitHub merged PR screenshot | Pushed verifier: local main = origin/main = merge; QA tree equal; certified commits contained; clean tree |

**Remote identity matters:** OwedBook’s supplied push receipt names `Cyberize-Group/cyph-v1-dev`. Portal’s successful main push receipt names `ahmedmusawir/cyph-payment-portal-dev-v1`. Earlier planning mentioned a Cyberize-owned Portal repository. The next lab must inspect the actual configured remotes and use the intended repository; do not silently substitute a similarly named checkout or migrate repositories during baseline setup.

## What 007A delivered

007A connected the Payment Portal and OwedBook for initial owner registration, one initial pharmacy, sandbox subscription purchase, account/store provisioning and access. The owner remains a platform member while receiving the store-admin assignment. Broader multi-store administration belongs to the separately prepared 007B scope.

Delivered behavior includes server-saved registration drafts and quotes, required consent, approved APA promotion handling, owner-only billing, cancellation and undo, signed webhook processing, durable event records, provisioning recovery, and sign-in handoff between the apps. The handoff uses application-specific sessions rather than a shared domain cookie. Explicit account switching and logout behavior were part of the engineering and QA work.

The engineering record reports DEV migrations 0053–0060 applied, all 60 migration checksums checked, existing data preserved, and SCRATCH rehearsal before DEV apply. This report does not independently re-run the schema audit or prove a full DEV restore. The next recon must inspect actual schema and migration ledger rather than infer current database state from a document.

## Repairs and independent outcomes

| Finding | Problem and disposition |
| --- | --- |
| F-Q1-01 | Webhook fault/recovery behavior repaired. Friday closed it using unit and real-SCRATCH recovery proofs, a live foreign event and operator recovery under AC-038. |
| F-Q2-001 | First registration saved but bounced back from pharmacy to owner instead of reaching review. Stale draft/guard behavior was repaired. Independent browser retest closed it. |
| F-Q2-002 | Undo cancellation did not reliably clear both cancellation fields. Sequential update/read-back behavior was repaired. Director-observed live undo and Stripe read-back closed it on the same subscription. |
| F-Q4-001 | Lost provider response followed by a new operation key could duplicate customer/session creation. Recovery was repaired and closed for tested cases on real SCRATCH with a parameter-comparing provider stand-in. Do not expand the closure beyond the certificate’s evidence or forget the retained idempotency-window risk. |
| F-Q4-002 | Edited registration could return an old revision’s Checkout and price. Same/different-key real-SCRATCH proof closed the repair. Promotion-change coverage remains a recorded limitation. |
| F-Q4-003 | A paid new owner received an Auth identity but no account/store. Concurrent provisioning was repaired and tested against real SCRATCH. A fresh live purchase provisioned once, and the already-paid stuck operation recovered once with an idempotent rerun. |
| F-Q4-004 | Access email failed with 429 during a prior journey. Friday closed it using subsequent live email acceptance and the existing owner’s requested-link/sign-in recovery. The failed historical notification remains; generic sign-in-link requests are not recorded in that notification ledger. |

The previously protected recovery case, operation `25acbfb9-9969-44b1-8b45-928d71f99ad6`, was subsequently recovered by QA under AC-038. It is no longer an outstanding paid-but-unprovisioned defect. Keep its evidence and retained fixtures; do not rerun support recovery as fresh work without purpose and authority.

## Live acceptance and engineering validation

Friday’s certificate records a Director session on 16 November, 13:45–14:25, using the real inbox and DEV, with Cody performing read-only verification.

The accepted journeys included expired-link recovery; explicit email-link confirmation into the correct empty store; OwedBook-to-Portal handoff; owner billing; Stripe portal period-end cancellation; the app cancellation banner and undo; refusal to remove the only card; existing-owner sign-in completing store provisioning once with account isolation; and declined-card behavior producing no provisioning.

The later r06 engineering return reported:

| Check | OwedBook | Payment Portal |
| --- | --- | --- |
| Unit tests | 309 passed | 468 passed |
| Typecheck/lint | Passed; 33 existing warnings | Passed; 24 existing warnings |
| Production build and client-bundle scan | Passed | Passed |
| Production browser walk | 73 combined checks across both apps; both themes, 375/1440 widths, navigation, billing fixtures and password toggles | Same combined walk |

Those r06 checks are **engineering evidence**. The browser walk used a local Supabase stand-in, with 186 reads and no writes; it was not a live billing read. Tony waived a further independent UI retest.

## Director-accepted UI successor

| Item | Final reported behavior | Boundary |
| --- | --- | --- |
| U-1 navigation | Route selects one filled orange/white item; unselected hover is outline only; visible keyboard focus; nested-route handling | Director-accepted; not QA-certified |
| U-2 billing | Existing owner-authorized billing read supplies plan/pharmacy count and next-payment or paid-through date; synthetic subscriptions remain explicitly labelled; missing data remains honest | No numeric amount was available in the authorized data source. Accepted wording: “Price shown in the billing portal.” An actual amount was not verified. |
| U-3 passwords | Four fields across OwedBook sign-in/profile and Portal sign-in have accessible show/hide buttons, preserved value/autocomplete, no submit, and caret-preservation fixes | Director-accepted engineering/browser proof; not QA-certified |

A later gate covering these screens must account for these changes without retroactively expanding Friday’s certificate.

## Cleanup and retention

Cody completed Q5 cleanup: certificate transcribed verbatim; private QA credential source deleted; owned helper/browser processes closed; disposable build/cache trees removed; review ZIPs archived outside Git; fixtures retained. Director app servers and Stripe listener were excluded from owned-process cleanup. Product, tests, configuration and contract bytes were unchanged.

The Q5 package contains 392 members. JARVIS independently checked the supplied ZIP hash, archive integrity, all 391 indexed size/hash entries, absence of unexpected unindexed members, and byte equality of the certificate. These checks validate the supplied export; they do not independently observe every filesystem action on Tony’s machine.

Two older immutable Engineering review ZIPs contained matches to a private credential value. They remain restricted outside Git, flagged in receipts, and excluded from the cleanup export. A matching helper original was privately quarantined; a sanitized copy was retained. **Do not call the old ZIPs clean or republish them.** Credential deletion is not a claim of provider-wide revocation or rotation.

Keep DEV/SCRATCH fixtures and sandbox customers, sessions, subscriptions and identity records until Tony explicitly rules on cleanup. No database or provider-object deletion/cancellation was performed as Q5 cleanup. Preserve original failures, useful helpers, receipts and provenance. No branch deletion was authorized.

## Accepted risks and follow-ups

The complete original certificate is appended unchanged below. Its qualifications govern; this report does not waive them.

| Obligation | Owner and trigger |
| --- | --- |
| O-1 live failed-renewal and seven-day grace journey with an isolated Stripe test clock | 007B Architect scopes; QA proves before production billing. Not yet proved live. |
| O-2 reminder-email delivery | 007B Architect and Director mail setup; QA proves before production billing. The 007A banner/pending reminder record does not prove email delivery. |
| O-3 final Terms, Privacy, support address and price-consent wording | Director supplies approved content; must be resolved before any external or staging exposure. |
| Numeric price presentation in OwedBook | Director/next Architect scopes if required. Current accepted presentation contains no verified amount. |
| Full restore and real-Auth crash coverage | Director/QA Lead retain certificate risks; no “fully proven recovery” claim. |
| Retry beyond provider idempotency retention | Next Architect retains engineering L2: a retry after the at-least-24-hour window could create another unpaid session. No silent claim of permanent deduplication. |
| Remaining browser/promotion coverage and exact cumulative effect accounting | QA Lead retains the certificate’s coverage and counting limitations. |
| Retained fixtures and restricted archives | Director decides retention/deletion, then assigns bounded execution. |
| Mission Control | Outside 007A scope, not a graded module deficiency. |
| Staging deployment and Gate D | Separate Director release with the 007B deployment work. No deployment completed here. |

## Instructions to the next lab

1. Read this report, the original certificate, current 007B preparation pack and applicable project playbooks. Resolve authority from current records rather than older chat summaries.
2. Obtain OwedBook PR #10’s full merge identity, refresh local main under Director Git control, and verify the final QA head/certified ancestry and merged product tree. Portal’s recorded final baseline is `c68c4acaccc4a68f20ede267f06cfda17fa15aac`; inspect actual remote main for later changes before use.
3. Replace pending 007A baseline fields in the 007B pack with actual verified main identities. Resolve the Portal remote-ownership discrepancy above. Do not use a pre-merge candidate as the merged baseline.
4. Reconcile the now-closed 007A findings in the 007B preparation records. F-Q4-001 is repaired for its tested scope, not an unresolved criterion to carry by default. Carry the certificate’s genuine remaining risks and O-1/O-2/O-3.
5. Use the existing Portal module entry and OwedBook dependency checkout deliberately. Claudy reported that Portal `agent_docs/PROJECT_POINTER.md` still names the older FFM-ABM-001 as active; the next Architect should reconcile routing before launching E1.
6. Launch E1 only under Tony’s 007B release. Do not repeat 007A payments, create new identities or reuse old QA effect budgets automatically. Authorize each new environment/effect scope through 007B.

## Workflow lessons to preserve

- Read the governing playbooks before issuing workflow directions. Earlier instructions to return repairs to the engineering branch were wrong and superseded.
- Build on the engineering line, then continue repairs, independent retest, certification and closeout on the QA branch. The completed QA branch is integrated into main. One active writer per checkout.
- Q2 is continuous execution: record ordinary product failures, block dependent checks and continue unaffected authorized checks. Aggregate one bounded repair request; stop only for a concrete authority, target, instrument, evidence or safety blocker.
- Production-build browser walks belong in engineering validation. Mocked router assertions missed the original navigation failure; a browser walk also found caret defects unit tests missed.
- Test concurrency at the real database/function boundary with controlled external substitutes, and distinguish it from live Auth/provider evidence.
- Preflight before spending scarce new-owner/payment allowances. Final live proof must use the final repaired candidate authorized by the QA Lead.
- Keep certified, Director-accepted, evidence, closeout and merge identities separate. Documentation-only successors do not extend certification; Director UI acceptance is not QA certification.
- Literal pathspecs, current-HEAD guards, manifest checks and merge-tree equivalence made the final Git handoff reviewable. OwedBook requires PR integration; Portal accepted a normal CLI main push.
- Keep closeout administrative and continuous. No fabricated timings, intervention counts or self-referential commit churn. Claudy left the quantitative retrospective “NOT RUN” because those counts were not reliably available.

## Evidence register

Canonical module root on Tony’s machine: `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/`.

| Record | Identifier |
| --- | --- |
| QAM contract | v1.0, Spec Amendment A1, erratum E-A1-1 |
| Approved QA plan SHA-256 | `2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672` |
| Final certified QA package | Q4_REVIEW_a05 · `e700ab73ea2eb42e7329f8d508a84e35ddeb795e025bb1106e5d93f627ba4f4b` |
| UI repair package r06 | `30902cf12c54242cd1605a32ef00aeadbaa2bdfdd34b8b8730e5831b3f6a069e` |
| Q5 cleanup package | `7c6c33edb074a9575b6817d4a782dd6a620d577f355bebfb456f4be6bd5f8e28` |
| Closeout commit manifest | `8f456523392fc0eaf07cec9cc3a4532509781785d4c1869d2e5cd2d5c5fedc4e` |
| Repository closeout | `CLOSEOUT_REPORT.md`; `EVIDENCE/CLOSEOUT/commit/COMMIT_HANDOFF.md`; manifest, verifier and rehearsal records |
| QA records | `QAM/QAM_CERTIFICATION.md`; `QAM/QAM_CLEANUP_REPORT.md`; QAM state, approval, findings and evidence matrix |
| External archive | `/home/moose/APBM007A_QA_ARCHIVE/`, with convenience package copies in Downloads and retained repository receipts |

Evidence basis: supplied certificate and Q5 export, Claudy’s supplied closeout return, Tony’s actual Git output and the merged PR screenshot. This report does not claim fresh access to the private repositories or live providers.

## Original Friday certificate

The following is the supplied certificate verbatim. Its “still required” cleanup and merge steps describe its issuance checkpoint; Q5 cleanup and subsequent integration are recorded above. The original certificate is retained unchanged.

# QAM certification — APBM-007A-CYBER-PHARMA

Issued 16 November 2026, 15:00 Asia/Dhaka, by the QA Lead (Friday), relayed by the Director. Executor: Cody. To be transcribed verbatim into `QAM/QAM_CERTIFICATION.md` at cleanup.

## Verdict

**GATE Q: PASS WITH KNOWN RISK.** The listed risks were accepted by the Director.

## Certified candidate

| Item | Value |
|---|---|
| OwedBook | `c976968b20ee724f7390d5e0e008215f50ab6f25` (`qa/apbm-007a`) |
| Payment Portal | `54a56b55ea7c72783d17d06ff45cd27b5426803f` (`qa/apbm-007a`), product `6ed09ffc05685a163833cb68fcae4383c67ae349` |
| Contract | v1.0 as amended by Spec Amendment A1 and erratum E-A1-1 |
| Approved plan | SHA-256 `2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672` |
| Final QA package | `Q4_REVIEW_a05`, SHA-256 `e700ab73ea2eb42e7329f8d508a84e35ddeb795e025bb1106e5d93f627ba4f4b` |
| Director session | Manual, 16 November 13:45–14:25, real inbox, DEV, with Executor read-only verification of each step |

This certificate covers only this pair. It does not cover deployment (Gate D), the later UI changes U-1 to U-3, or any later commit.

## Findings closed by independent evidence

| ID | Closed by |
|---|---|
| F-Q1-01 webhook recovery | Unit and real SCRATCH recovery proofs; live foreign event; operator recovery of a real stuck paid operation (AC-038) |
| F-Q2-001 registration cannot reach review | Three engines, both themes, 375 and 1440 |
| F-Q2-002 undo with both cancellation fields | Unit proof plus Director's live Stripe portal cancel and app undo; Stripe read-back shows both fields clear on the same subscription |
| F-Q4-001 lost answer then new-key retry | Real SCRATCH with a parameter-comparing provider stand-in |
| F-Q4-002 stale Checkout after edit | Real SCRATCH, same and different key |
| F-Q4-003 paid new owner not provisioned | Real SCRATCH concurrent advances; live new-owner purchase provisioned once; operator recovery of the stuck operation, idempotent on rerun |
| F-Q4-004 access email 429 | Live new-owner email accepted with no 429; OWNER_2 provisioned on sign-in after a Director-requested link |

## Live journeys passed (Director-observed, Executor-verified)

Expired link recovery page. Emailed link with explicit confirm, landing in the correct empty store. OwedBook to Portal handoff. Owner billing. Stripe portal cancel at period end, app banner, app undo. Only-card removal refused by Stripe. Existing-owner signed-out purchase completed by sign-in, store created once, account isolation holds. Declined card created nothing.

## Known risks and limitations, accepted

1. Full DEV restore not proven (Director option B).
2. AC-004 graded on reused engineering rehearsal plus independent read-only verification; no independent reset.
3. Real Supabase Auth crash coverage (T-017) not proven; simulated only.
4. Live failed-renewal and seven-day grace journey with a test clock deferred to 007B (O-1). Reminder email deferred to 007B (O-2). Required before production billing.
5. Mission Control outside 007A scope by Director ruling.
6. Placeholder Terms, Privacy, support address and price-consent wording accepted for local 007A. Must be resolved before any external or staging exposure.
7. Natural Stripe listener HTTP answers not captured; durable ledger rows are the evidence.
8. Exact cumulative email count and request-level Stripe mutation count not fully ledgered. Known: at least 3 emails within a ceiling of 8; purchase objects equal their ceilings and none was exceeded.
9. A sign-in link requested from the generic portal form is not recorded in the notification ledger; the original failed 429 row is kept as history.
10. Stripe idempotency keys last at least 24 hours; a retry after that window could create a second unpaid session (engineering L2). The buyer never saw the lost session.
11. Not exhausted: a keyboard-only journey through every step, the full theme by viewport matrix on every screen, and the promotion-change variant of F-Q4-002.

## Follow-ups

- U-1, U-2 and U-3 (navigation highlight, OwedBook admin billing fields, password show/hide) are merged with 007A under the Director's written acceptance. They are not QA-certified.
- Retained test data on DEV and SCRATCH stays until the Director rules on fixture cleanup.

## Still required before closeout

QAM §14 cleanup by the Executor once Engineering releases the checkouts: delete the private QA credential file, close owned browsers and processes, record what is retained. Then the Director commits the records, the Architect writes the closeout, and the Director merges.

No deployment before 007B.
