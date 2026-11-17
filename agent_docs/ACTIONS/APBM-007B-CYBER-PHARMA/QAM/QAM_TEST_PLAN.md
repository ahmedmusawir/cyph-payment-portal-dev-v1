# QAM test plan — AMENDED PER QA LEAD, Cody, 2026-11-17

Candidate pair: cyph-payment-portal-dev-v1 427bec6267b9777e9cb44f81c22d1396a495bc14; cyph-v1-dev c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea. Friday approval with exact amendments recorded in QAM_APPROVAL.md; Q2 Director release pending. QL-01 10/12 match; APBM_RULINGS.md and ENVIRONMENT_AND_EFFECTS.md mismatch. Dependent tests held pending Friday resolution; exact diffs in evidence/preflight/02/. Inputs: current ACCEPTANCE_SPEC v1.0, all six subject contracts plus API_ROLE_MATRIX, rulings, SR1–11, Friday standing inputs, candidate source and r01–r06 engineering claims. GD001 outside Gate Q.

## 1. Order and evidence rules

Recheck PF00 first (candidate served build IDs, correct sandbox/listener secret and readable controlled inbox), then identity/full diffs, targets/private schema, instruments, local unit/build/SQL, permission/concurrency negatives, repair adjudication if needed, final-candidate one-time live campaign and grouped human inbox checks. No effect before approval and release. Evidence per test under evidence/Q2/01/T-nnn/: command, cwd, timestamps, exit code, unfiltered output held privately then approved sanitized export, role alias, fixture IDs, request/event correlation and before/after DB/provider assertions. Missing evidence is BLOCKED, never PASS. Attack instrumentation with poison and clean controls; assert fixture existence/count before denials.

## 2. Tests and acceptance mapping

Every test below inherits the no-effects prerequisite, candidate rebind and evidence rules. Expected results are current AC text; negative controls are explicit in each procedure. One grouped Director session near the end of Q2: prepared invitation and two billing-notice inbox observations, any provider-hosted challenge automation cannot complete, and human review of T-030 screens/wording; all repeatable checks automated. Synthetic/provider/DB/browser/deployed results remain separate.

### T-001 / AC-001 — Owner boundary

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Only an authenticated owner can start/confirm an Add Store operation for that account; admin/member/unrelated-owner direct requests are denied.

Procedure/negative controls: Login each role; POST quote/confirm for own and foreign account; alter account and consent bindings; inspect status and no denied-side effects.

Evidence: Real application/API and tenant-negative proof; evidence/Q2/01/T-001/. Status NOT RUN.

### T-002 / AC-002 — Store identity

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: NPI input valid and database canonical NPI globally unique; at most one active ownership per NPI including transfer, proved with two concurrent attempts. Historical ownership rows retain immutable business IDs linked to permanent pharmacy identity. Duplicate claim routes to support.

Procedure/negative controls: Use two independent SQL connections to confirm same NPI concurrently across owners; complete transfer and inspect immutable ownership/business IDs and single active identity.

Evidence: Database-backed concurrency, transfer and UI proof; evidence/Q2/01/T-002/. Status NOT RUN.

### T-003 / AC-003 — Charge disclosure and consent

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

Expected: Server quote discloses amount, period, renewal total, consent/expiry and preserved earned APA discount. Charge only new store remaining-period price. At a point well inside the billing period quote is less than full 4900 cents and the real provider invoice equals quote; use O-1 controlled time. Already-earned first-store discount is not reclaimed. Stale/tampered binding requires fresh consent. A quote below the provider minimum USD charge (STRIPE_MIN_CHARGE_USD_CENTS=50) is refused before any invoice exists; no customer balance is created.

Procedure/negative controls: At controlled mid-period compare server formula, displayed consent and actual ordinary/APA invoice; tamper amount/period; test 49/50/51 cents and quote age 14:59/15:00/15:01; assert refusal creates no balance/invoice.

Evidence: UI/API plus provider quote/invoice at controlled mid-period time; evidence/Q2/01/T-003/. Status NOT RUN.

### T-004 / AC-004 — Paid activation

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

QL-04: real events forwarded by local Stripe listener required for paid add activation, failed additional payment, renewal failure into grace and payment recovery. Include listener outage/redelivery and duplicate delivery across the campaign; label delivery lane on every result. Controlled signing only forged/negative cases.

Expected: Only authoritative paid operation-bound invoice plus verified no-proration recurring quantity permits exactly one atomic activation. Browser outcome cannot grant. No business/membership exists while pending. Late/expired/abandoned payment never silently activates; synchronous and signed-event/recovery paths converge.

Procedure/negative controls: Before payment query data as every role; forge browser success; pay exact invoice then deliver/reconcile concurrently; compare one membership/store and verified absolute quantity.

Evidence: Live provider, product event/recovery and permission negatives; evidence/Q2/01/T-004/. Status NOT RUN.

### T-005 / AC-005 — Failed additional payment

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

QL-04: real events forwarded by local Stripe listener required for paid add activation, failed additional payment, renewal failure into grace and payment recovery. Include listener outage/redelivery and duplicate delivery across the campaign; label delivery lane on every result. Controlled signing only forged/negative cases.

Expected: Decline or incomplete authentication leaves the new store pending and existing stores working. Failed or abandoned Add Store never starts renewal grace, queues renewal notices or changes account access. latest_invoice open/void is not alone delinquency. A pending store grants no access and exposes no data.

Procedure/negative controls: Use decline and incomplete 3DS; retry/abandon; inspect existing-store access, pending denials and absence of renewal grace/notices for standalone invoice.

Evidence: Provider failure plus application/API/DB/UI and event-order proof; evidence/Q2/01/T-005/. Status NOT RUN.

### T-006 / AC-006 — Idempotent retry

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

Expected: Double submit, new-key retry, lost reply, concurrent retries and duplicate/out-of-order delivery reconcile to one intended operation, one customer and one payment session, without duplicate stores or charges. No unpaid closure without provider proof. When historical charge outcome is ambiguous after key retention, enter attention without charging again; current quantity alone is insufficient proof.

Procedure/negative controls: Double submit and new-key retry; drop provider reply after successful create/pay; concurrent retries; duplicate/reordered events; history pagination and expired-key ambiguity must enter attention without new charge.

Evidence: Database concurrency, controlled response loss and historical reconciliation; evidence/Q2/01/T-006/. Status NOT RUN.

### T-007 / AC-007 — Pending recovery and consent expiry

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

QL-07: one sandbox full refund of paid-but-not-activated operation, then store-operation-close proof, inside existing mutation cap; pending Director approval. If declined, this subcase NOT RUN with limitation; block nothing else.

Expected: Fixed payment deadline and durable one-minute expiry responsibility. At expiry/abandonment void open invoice and verify no paid outcome before releasing hold. Late payment or paid-versus-void race reconciles to exact consented operation/attention; no silent activation, extra charge or automatic refund. Prove crash/restart and late-payment case. A paid operation not activated ends only by owner-reconfirmed activation or operator close on provider proof of full refund/credit; the account is never permanently blocked solely for lack of such a terminal command.

Procedure/negative controls: Run minute jobs at deadline before/at/after, explicit abandon and paid/void race; kill only owned Portal at pay intent and payment_pending, pay while down then restart. Assert one charge/no prepay access. Late paid operation requires reconfirmation or full external-refund proof close; test partial/wrong proof refusal and idempotent close.

Evidence: Late-payment, expiry, crash/restart and forward recovery evidence; evidence/Q2/01/T-007/. Status NOT RUN.

### T-008 / AC-008 — Quantity consistency

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

Expected: Provider quantity, local billable-store count and access reconcile across Add Store, renewal, cancellation and pending operations; no raw provider quantity change grants unnamed-store access.

Procedure/negative controls: Compare provider quantity, billable count and paid-access count across 3→schedule removal→add→undo, renewal/cancel and concurrent pending operation; raw quantity changes grant no unnamed access.

Evidence: Provider/local comparisons and race tests; evidence/Q2/01/T-008/. Status NOT RUN.

### T-009 / AC-009 — Catalogue preservation

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: One graduated item retains $99/$49 pricing and one subscription per account; owner-only billing and existing cancellation/undo behavior remain valid.

Procedure/negative controls: Inspect actual graduated price tiers and one customer/subscription; owner and non-owner billing routes; cancellation/undo; preserve earned APA.

Evidence: Catalogue identity, invoice and billing regression; evidence/Q2/01/T-009/. Status NOT RUN.

### T-010 / AC-010 — Authorized invitation

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Owner/admin invitation rights follow the frozen role matrix; a store admin cannot appoint an owner/admin or act on another store.

Procedure/negative controls: For each I1–I5 role row create member/admin invitation for own/foreign stores; verify SQL denies member, foreign, signed-out and admin elevation.

Evidence: API/DB denial and successful intended role journey; evidence/Q2/01/T-010/. Status NOT RUN.

### T-011 / AC-011 — Invitation acceptance

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: A valid controlled recipient can accept and receive only the intended store/role; existing/new identities follow the approved identity policy.

Procedure/negative controls: Receive actual new admin/new member/existing-recipient mail; GET preview then explicit confirm and accept in separate browsers; verify final destination and only intended stored role; existing identity unchanged.

Evidence: Actual email/inbox and browser proof for both identity cases; evidence/Q2/01/T-011/. Status NOT RUN.

### T-012 / AC-012 — Invitation abuse

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Expired/revoked/replayed/altered invitations fail safely; link GET does not redeem, explicit button POST does. Wrong-user acceptance requires deliberate identity switching; altered account/store targets are denied.

Procedure/negative controls: Expire, revoke, replay, alter token/store/account; GET must not redeem; wrong signed-in user deliberately switches identity before valid POST; retain denial state.

Evidence: Token and browser negative coverage; evidence/Q2/01/T-012/. Status NOT RUN.

### T-013 / AC-013 — Resend and revoke

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Resends, duplicates and revocation obey explicit token validity, delivery and dedupe rules; old links cannot revive revoked authority.

Procedure/negative controls: Resend before/at/after60s, duplicate concurrent requests, total5/6 attempts; revoke then reuse old and newest links; correlate dispatch counters and no revived grant.

Evidence: Delivery counters and link-state tests; evidence/Q2/01/T-013/. Status NOT RUN.

### T-014 / AC-014 — Admin replacement

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Incumbent remains until exact recipient accepts. Atomic row locks recheck invitation/incumbent; one effective admin throughout. Former admin becomes member unless owner selected removal. Stale incumbent change invalidates invite. Owner remains platform member/owner.

Procedure/negative controls: Keep incumbent until acceptance; race two replacements and incumbent change; test demote/remove alternatives, owner retains platform rights and one effective admin atomically.

Evidence: Database concurrency and two-identity browser journey; evidence/Q2/01/T-014/. Status NOT RUN.

### T-015 / AC-015 — Member revocation

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Revocation denies next authorized store request in app, direct data API and definer functions, including already-issued JWTs and owner-vs-member paths. Identity session may remain signed in until token expiry; measure/report distinction. Authorized access-reduction stays possible in read-only.

Procedure/negative controls: Remove member then issue next app/API/definer read using old JWT and fresh context; repeat in read-only; distinguish remaining identity session lifetime from denied store access.

Evidence: Fresh and existing-session tests plus direct API checks; evidence/Q2/01/T-015/. Status NOT RUN.

### T-016 / AC-016 — Last-admin protection

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Self-removal or conflicting role changes cannot orphan an active store; the approved owner/support recovery remains possible.

Procedure/negative controls: Race sole-admin self-removal/role changes; deny orphaning; exact owner/operator recovery restores intended admin only.

Evidence: Concurrency, denial and recovery proof; evidence/Q2/01/T-016/. Status NOT RUN.

### T-017 / AC-017 — Tenant and role isolation

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Owner/admin/member/unrelated-owner checks cover both apps and protected fields; invitation or handoff grants no extra billing or cross-tenant rights.

Procedure/negative controls: Execute full role/action contract through app routes, direct API, SQL RLS and definer functions with two accounts, guessed IDs and protected fields; no global-role billing bypass.

Evidence: Independent role-by-route/API/DB matrix; evidence/Q2/01/T-017/. Status NOT RUN.

### T-018 / AC-018 — Scheduled removal

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

Expected: Store access ends at the paid-period boundary; records remain. A scheduled removal produces no credit, refund or proration line in the current period. Charge stops from the next period. Prove with provider invoice preview and the next real invoice. Freeze explicitly distinguishes provider quantity, billable count and still-paid access during the remaining period.

Procedure/negative controls: Schedule removal mid-period; assert no credit/refund/proration and unchanged still-paid access; inspect next real invoice excludes store and cutoff denies access but retains records.

Evidence: Controlled time, next real invoice, access and concurrency proof; evidence/Q2/01/T-018/. Status NOT RUN.

### T-019 / AC-019 — Removal undo

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

Expected: Undo is allowed before the paid period ends; the frozen cutoff semantics are enforced before/at/after that boundary; pending add/remove/renewal changes cannot silently overcharge, undercharge or reactivate a store; a store is never active in a period whose renewal invoice excluded it. Removal scheduling and undo use the common end-of-period guard and period re-read; mismatch enters attention.

Procedure/negative controls: Undo before/at/after both90min and50cent common guards; race period rollover/add/removal/renewal; changed period enters attention, never active without included renewal.

Evidence: Boundary and concurrency tests; evidence/Q2/01/T-019/. Status NOT RUN.

### T-020 / AC-020 — Last-store lifecycle

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-08: removed-store-reactivate authorizes only and cannot activate without payment. Same-owner paid re-add restores original store record/history per Director default9.

Expected: Last-store removal uses whole-account cancellation and prevents an invalid zero-store subscription/access state and preserves owner billing recovery.

Procedure/negative controls: Attempt last-store removal; whole-account cancellation/recovery remains reachable; never zero-store active subscription.

Evidence: Whole-account lifecycle proof; evidence/Q2/01/T-020/. Status NOT RUN.

### T-021 / AC-021 — Support transfer authority — IMPLEMENTED (OPERATOR COMMAND)

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: IMPLEMENTED (OPERATOR COMMAND): exact-ID typed transfer actions under protected staging shared credential with actor/reason/ticket, dry-run default and append-only audit separating authenticated-as from declared actor. Accompanying identity verification is SUPPORT PROCEDURE and graded separately.

Procedure/negative controls: Operator dry-run and exact-ID apply with credential/actor/reason/ticket; reject missing authority/wildcards/free SQL; append-only audit distinguishes authenticated credential and declared actor; review support verification procedure.

Evidence: Operator authorization, negative controls, audit and procedure review; evidence/Q2/01/T-021/. Status NOT RUN.

### T-022 / AC-022 — Transfer billing/access — IMPLEMENTED (OPERATOR COMMAND)

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-03 prerequisite: before execution record QA-computed expected cents per case using provider period timestamps and contract integer formula, independently of application helpers. Cover ordinary/APA mid-period, under50 refusal/no invoice, both sides of shared guard for add/removal/undo, 30-minute expiry/void and late-payment attention/no activation. Capture inputs and expected result before observed result.

Expected: IMPLEMENTED (OPERATOR COMMAND): source/successor ownership under one permanent identity, buyer own billing, seller cutoff and no cross-party card/subscription rights. At most one active NPI ownership through concurrent transfers, retries and buyer-payment failures. A buyer cannot activate before the effective time; seller access does not end early. Exact-buyer reservation begins at effective time, and expiry without payment goes to attention rather than public NPI release.

Procedure/negative controls: Transfer seller→new buyer registration with separate billing; test early access, payment failure, reservation expiry, cancellation, concurrent buyers and retries; one active NPI, seller cutoff exact, buyer cannot access seller cards.

Evidence: Two-account transition, NPI concurrency and recovery; evidence/Q2/01/T-022/. Status NOT RUN.

### T-023 / AC-023 — History/receivables — IMPLEMENTED (OPERATOR COMMAND)

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-09: data/API evidence only for seller history; seller owner read-only pre-sale, buyer and all other roles structurally denied. No screen built; any AC screen requirement is a finding for adjudication, not a stop.

Expected: IMPLEMENTED (OPERATOR COMMAND): original claims/file/audit IDs retained; buyer denied all pre-sale history structurally. Seller owner has read-only source-ownership claims/receivables; seller staff denied. Ordinary removed store has no customer archive exception. Direct/definer access and NPI knowledge grant no extra authority.

Procedure/negative controls: Seed synthetic claims/files/audit before sale; compare IDs/digests after; seller owner read-only archive, seller staff/buyer/foreign denied via API/RLS/definer; ordinary removal grants no archive exception.

Evidence: Before/after data and direct access assertions for every role; evidence/Q2/01/T-023/. Status NOT RUN.

### T-024 / AC-024 — Recovery audit — IMPLEMENTED (OPERATOR COMMAND)

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: IMPLEMENTED (OPERATOR COMMAND): verified same-account owner/admin recovery restores only intended authority, removes obsolete access, records authenticated credential, declared actor, reason/ticket/effect and safely resumes provider-email partial failure. SUPPORT PROCEDURE graded separately. Shared staging identity limitation retained; individual operator sign-in before production.

Procedure/negative controls: Owner/admin exact-ID recovery plus provider/email partial failure and resume; obsolete access removed; audit all actor/reason/effect fields; separately review support procedure and shared-credential limitation.

Evidence: Controlled recovery, audit/denial proof and procedure completeness; evidence/Q2/01/T-024/. Status NOT RUN.

### T-025 / AC-025 — O-1 live lifecycle

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-04: real events forwarded by local Stripe listener required for paid add activation, failed additional payment, renewal failure into grace and payment recovery. Include listener outage/redelivery and duplicate delivery across the campaign; label delivery lane on every result. Controlled signing only forged/negative cases.

Expected: Live provider test clock, isolated multi-store SCRATCH account, renewal fail→seven days normal/banner→read-only→owner billing recovery→restored; cancel/undo/retry/replayed events never reset grace. Every new grant/write checks SQL and app. Fixed CP-2 driver/fallback only; time seam denied in staging/DEV and disabled SQL context even with old non-null timestamps; user cannot enable it.

Procedure/negative controls: Live isolated two-store Stripe clock: fail renewal, day0/day5/day7 boundary, banner→read-only→owner payment recovery. Replay/cancel/undo cannot reset grace. Test app+SQL writes, access reduction exceptions and forged/disabled/non-null clock context; DEV/staging seam denied.

Evidence: Live clock/provider, SQL permissions and production-build application proof; evidence/Q2/01/T-025/. Status NOT RUN.

### T-026 / AC-026 — O-2 email delivery

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Resend API from Portal alone delivers failure and 48-hour warning notices to controlled owner inbox with correct status/deadline and authenticated billing link. Actual inbox plus provider receipt required; sign-in mail path is not billing notice delivery.

Procedure/negative controls: Observe failure and48h warning in real controlled owner inbox and provider send receipt; verify deadline/status/authenticated billing link, Portal single sender and no tenant leak.

Evidence: Provider receipt plus actual inbox observation; evidence/Q2/01/T-026/. Status NOT RUN.

### T-027 / AC-027 — Reminder reliability

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Each approved notice type at most once per failed invoice; recovery committed before dispatch suppresses send. Durable claim, stable payload/idempotency and bounded retries; unknown result beyond retention enters attention. Default-on runtime guard validated before first send; every actual attempt counted. Receipt arrival after in-flight dispatch is not misreported as controllable.

Procedure/negative controls: Guard poison/clean before send; duplicate workers, definite refusal, timeout, stable key/payload, max5 attempts and23h cutoff; recovery-before-dispatch suppresses, in-flight receipt timing reported honestly; unknown old result attention.

Evidence: Fault, guard, recovery/send race, provider receipt and inbox checks; evidence/Q2/01/T-027/. Status NOT RUN.

### T-028 / AC-028 — 007A regression

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

QL-10: Portal browser regression on Chromium, Firefox and WebKit at final candidate; confirm U-1/U-2/U-3 unchanged against baseline/carry-forward records, retain Director-accepted status, never QA-certified.

Expected: Preserve first-store payment/provisioning, explicit email confirm-button flow, handoff both ways, different-user recovery, owner billing, cancellation/undo, logout and unfinished-event/operator recovery. Regression includes navigation highlight, OwedBook billing fields and password show/hide on every screen 007B touches. Original evidence qualifications remain.

Procedure/negative controls: Run all007A unit/browser and live first-store purchase, explicit confirm-button flow, bidirectional handoff, different-user recovery, billing permissions, cancel/undo/logout, unfinished-event exact-ID recovery; nav highlight, billing fields and all touched password toggles.

Evidence: Independent production-build browser and necessary live regression; evidence/Q2/01/T-028/. Status NOT RUN.

### T-029 / AC-029 — Migration preservation

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: New forward migrations in the OwedBook chain after the final applied baseline preserve existing data/Auth and applied SQL. Fresh and upgrade SCRATCH rehearsals pass; DEV ledger equals manifest; every new table/function has privilege/RLS coverage using two accounts.

Procedure/negative controls: Fresh/upgrade/interrupted-forward local DB rehearsals then released SCRATCH only; compare prior migration checksums and synthetic/Auth preservation digests; DEV read-only ledger/catalogue comparison; enumerate every new table/function grants/RLS under two users and anon.

Evidence: Catalogue/checksum/preservation and forward-resume evidence; evidence/Q2/01/T-029/. Status NOT RUN.

### T-030 / AC-030 — Usable UI and copy

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: Affected journeys display correct states and fit agreed viewports, both themes and keyboard use. Previously disabled controls work or stay truthfully labeled. Every new implemented journey has an engineering production-build happy path asserting the final rendered destination and stored state.

Procedure/negative controls: Assert final rendered destination plus stored state for every new journey;375/1440 light/dark keyboard focus/loading/errors/stale/denied/empty; controls truthful; three engines smoke and full Chromium matrix.

Evidence: Rendered assertions and selected sanitized screenshots; evidence/Q2/01/T-030/. Status NOT RUN.

### T-031 / AC-031 — Built-bundle secrets

Target: all writes, new sign-in identities, payments, clocks and mail only SCRATCH plus Stripe sandbox; mail only allowlisted controlled inboxes. DEV read-only, only T-029 ledger/catalogue comparison.

Expected: No server credential enters client-delivered built bundles. Validate the scan with poison and clean controls. Export indexing, retention, privacy handling and cleanup are QAM process duties, outside this product criterion.

Procedure/negative controls: Build fresh candidate copies, validate scanner poison/clean, inspect delivered client chunks and source maps for credentials. Narrow generateLink exception requires exact library provenance and baseline comparison, no general suppression.

Evidence: Validated built client-bundle scan; evidence/Q2/01/T-031/. Status NOT RUN.

## 3. Runtime commands and tools (planned, not executed)

Use Node22 and exact npm lockfiles in QA disposable copies under /tmp/apbm007b-qa/<run>/{portal,owedbook}; never populate build environment with role passwords. Independently record node/npm/Next/Jest/Playwright versions from installed package metadata. Inspect each helper for hardcoded engineering cast, E2 ledger, target and mail before reuse; adapt only QA-owned automation, never product scripts. Reuse with spent E2 counters is forbidden. Until a QA capsule wrapper is reviewed, live helpers are BLOCKED.

Each copy: `npm ci --no-audit --no-fund`, `npx --no-install tsc --noEmit`, `npx --no-install eslint .`, `npx --no-install jest --ci`. Portal: `node scripts/apbm007b/build-check.mjs --self-test`; `node scripts/apbm007b/build-check.mjs --app both --out /tmp/apbm007b-qa/<run>/build`; `node scripts/apbm007b/proof-serve.mjs build|start|stop --out /tmp/apbm007b-qa/<run>/proof` (actions individually, never literal pipes). Confirm copy resolver targets QA copies before command; otherwise QA wrapper required. Ports3100 OB/3101 Portal, do not touch3000/3001/3457. `node scripts/apbm007b/served-identity.mjs --base http://localhost:3101 --manifest <QA portal manifest>` and3100/OB manifest. `node scripts/apbm007b/jobs-run.mjs --base http://localhost:3101 --key-source scratch --every 60` only after release.

Portal browser: `PORTAL_BASE_URL=http://localhost:3101 APBM007B_PROOF_CAST=<private QA adapter file> npx --no-install playwright test --project=apbm007b --project=apbm007b-firefox --project=apbm007b-webkit`. OB uses OB_BASE_URL=http://localhost:3100 and same projects. Full regression required at final candidate, not just engineering r02 carry-forward. OwedBook local-only: `node scripts/apbm007b/migrate-rehearsal.mjs fresh --db <private local URL>` then forward/restart; `node scripts/apbm007b/sql-proof.mjs --local <private local URL>`; released SCRATCH `--scratch`. Never place actual credential-bearing URL on logged command lines: QA wrapper supplies in memory with sanitized command transcript.

Automatic local event lane, separately authorized: `stripe listen --forward-to http://localhost:3101/api/webhooks/stripe` with explicit sandbox account selection verified privately; inject ephemeral matching listener signing secret server-side and rebuild/restart if needed. Do not print secret. Create real released run-owned provider actions, assert CLI forwarded event IDs and durable app receipts with no manual signed delivery. Stop owned Portal during event, restart and observe retry; distinguish CLI reconnect/replay from native provider retries. Controlled signing allowed only fault simulation labelled synthetic, never automatic-delivery proof.

## 4. Role/action and browser coverage

CONTRACTS/API_ROLE_MATRIX.md is the complete route/action enumeration (included). For EVERY A1–A7,R1–R3,I1–I10,W1–W6 run OWNER_A, OWNER_B, assigned STORE_ADMIN, MEMBER, FOREIGN_OWNER and signed-out through app/API/SQL where applicable. Exact recipient NEW_ADMIN/NEW_MEMBER/EXISTING_INVITEE covers I6–I8; alternate recipient denied. Trusted W/A6/R3: all customer roles denied, correct service/operator/provider positive plus missing/invalid credential negative. W5 denied for all users and DEV/staging; local SCRATCH service-only positive. W6 seller owner positive read-only; buyer/staff/foreign/ordinary removed owner denied. Repeat cross-store/cross-account ID substitution and stale JWT. No service-role key stands in for user authorization.

UI workflows: Add Store/status/removal/undo/billing dashboard, staff/invitations/confirm/switch identity, handoff/auth/recovery, grace/read-only/recovered. Owners cover full lifecycle; admin/member cover allowed staff/reads plus every denied grant/billing control; recipients cover acceptance states; foreign/signed-out cover redirects and denied reads. Cross each affected screen/state at375 and1440, effective light/dark, keyboard traversal/focus/submit. Data states empty/single/multiple/pending/scheduled/removed/transferred; loading, network error, decline/3DS, stale and rejected. Full Chromium matrix; Firefox/WebKit happy path + auth/denial smoke, reduction of redundant data combinations justified by shared server assertions, never omit permission combinations. Screenshots sanitized, assertions establish behavior.

## 5. Proposed effects envelope (requires Friday approval and Tony release)

Fresh QA ledger scoped QA_RUN_ID, reserve before attempt, uncertainty consumes allowance, monotonic counters and hard caps; no reset or borrowing E2/007A. Proposal sized by scenario slots, not measured execution: at most12 sandbox customers/subscriptions (4 ordinary/APA lifecycle,2 transfer buyers,2 crash,2 registration/regression,2 bounded recovery contingency),3 clocks,32 invoice pay/hosted submissions, USD5000 aggregate attempted simulated charges (500000 cents),80 provider mutation requests including cleanup,40 actual email dispatch attempts (12 invite/resend,8 notices/faults,12 auth,8 contingency),48 sign-ins,10 new Auth identities,2 SCRATCH rehearsal cycles plus1 retry;2400 bounded read requests total. Cleanup included in all limits; reserve last20 provider mutations and8 sends exclusively for cleanup/recovery. If slot model exceeds cap on dry-run, return amendment before effect. No real money, no production or DEV writes, no DEV apply, no shared Stripe retry/email settings, no provider resource beyond sandbox label. QL-07: one sandbox full refund for T-007 inside existing mutation cap, pending Director approval; if declined only that subcase NOT RUN with limitation. One local forwarding session; permanent endpoint/config outside this capsule. Proposed48h campaign, stop at earliest cap/time boundary. Distinct roles/fixtures cannot collapse just to fit limits.

Fixtures: synthetic NPIs validated and unique, QA_RUN_ID labels in account/store/provider metadata; A ordinary multistore, B APA multistore, seller/buyer separate identities, foreign account, staff roles and two unused new recipients plus existing invitee; dedicated crash accounts and frozen clock campaign. Inventory includes original IDs, ownership history, memberships, invoices and cleanup ownership. Retained007A and engineering fixtures are read-only references, never cleanup targets.

Cleanup: snapshot owned resources before/after; settle/void only run-owned unpaid invoices on provider proof, cancel run-owned subscriptions then delete owned sandbox customers/clocks in supported order; no automatic refunds. Disable SQL clock context first and prove real time with stale fields; then remove local flag. Revoke run invites/sessions and remove only explicitly disposable QA fixture data in approved SCRATCH transaction; preserve audit/history and failure evidence per Friday retention. Stop only owned runner/listener/process groups. If unresolved paid operation or ownership uncertainty, retain/quarantine and ask owner, never bulk delete. Cleanup acceptance is Friday's; report counts/residue, no claim executed in Q1.

## 6. Q2 versus Gate D / blockers

Local Q2 proves candidate build, SQL/API/browser behavior and, with released CLI lane, actual automatically forwarded provider events. It cannot prove permanent HTTPS webhook registration, endpoint-specific signing secret, native provider delivery/outage retries, public TLS/routing, deployed scheduler, staging Auth redirects or email/handoff host correctness. D-01 separate staging release binds both deployed revisions: inspect exact sandbox endpoint/events/secret; automatic first purchase/Add Store, renewal→grace/notices→recovery with no manual signer; deny malformed signatures, outage endpoint, observe failed provider attempts and automatic redelivery after restore, exactly-once state/charges/notices. Capture event IDs/attempt times/status and app durable receipts. Duplicate/out-of-order/manual resend are additional distinct cases, never substitute for automatic retry. Verify staging time seam denied, real email links and handoff both ways, permissions, scheduler one-minute expiry, rollback readiness. GD001 remains NOT RUN outside Gate Q.

Recon decision1 reduced by QL-01 to two mismatches; decisions2–6 governed by Friday amendments and Q2 release conditions. No Architect loop unless repair needs Engineering. Friday plan approval recorded; Q2 release, private cast, listener and runtime readiness remain conditions, never inferred. STOP on identity/target mismatch, contract ambiguity, secret leak, unbudgeted effects, unsafe instrument, unauthorized mutation or loss of evidence; isolate affected checks and continue safe work. Product FAIL alone does not stop unrelated checks.

## 7. Q4 conditional

Not authorized. After ruled repair, Director commits pair, inspect full candidate→HEAD diffs, Friday approves affected scope plus full required007A regression; reserve one-time live journeys for final repaired candidate. If repair lands after live campaign starts, rerun only affected tests from reserved contingency; go to Director only if envelope would be exceeded. Prior results carry only with explicit original SHA/attempt/applicability, never to mask changed behavior.

## 8. QA Lead amendments

Applied by Cody, 2026-11-17 Asia/Dhaka, exactly as supplied by Friday via Tony’s current message. No second plan review. Source reference supplied by QA Lead: QA_LEAD_DECISION_APBM007B_Q1_01_2026-11-17.md, SHA-256 304be11445b91494c98605f76f6e89406860d1f43d51c5bb7e3964b7d885af95 (source attachment not independently received/hash-verified; instructions transcribed from this conversation). Before/after diff: evidence/preflight/02/plan_amendments.diff.

QL-01 Contract identity. For each file below, compute SHA-256 of the file with line 1 removed (tail -n +2 <file> | sha256sum) and compare. All twelve equal: clear the contract stop as "header-only difference; contract text identical to the pack as used for E2". Any mismatch: send the QA Lead that file's diff and hold only tests that depend on it.

QL-02 Target on every effectful test. All writes, new sign-in identities, payments, clocks and mail are SCRATCH plus Stripe sandbox, including the T-028 first-store purchase and every inbox journey. DEV is read-only (T-029 ledger and catalogue comparison only). Mail only to allowlisted controlled inboxes.

QL-03 Independent expected values for money tests. Before executing T-003 to T-008, T-018, T-019 and T-022, write the expected cents per case, computed by QA from provider period timestamps and the contract formula, not by calling the application's helper. Minimum cases: ordinary account mid-period add; APA account add showing the discount is preserved and the new store is charged the prorated share of 4,900 cents; an amount under 50 cents refused with no invoice; the end-of-period guard on both sides of its boundary for add, removal and undo; consent expiry at 30 minutes voids the invoice; late payment lands in attention, not activation.

QL-04 Real automatic event delivery. At minimum these run on events forwarded by the local Stripe listener: paid add-store activation, failed additional payment, renewal failure into grace, payment recovery. Add one listener outage followed by redelivery and one duplicate delivery. Controlled signed delivery only for forged and negative cases. Every result states its delivery lane.

QL-05 Order and one-time budget. Repeatable automated checks first. The one-time live campaign runs on the final repaired candidate. If a repair lands after it starts, rerun only affected tests from reserved contingency. Go to the Director only if the envelope would be exceeded.

QL-06 One grouped Director session near the end of Q2, with a prepared list: inbox observation of the invitation mail and the two billing notices; any provider-hosted card challenge automation cannot complete; a human look at screens and wording for T-030.

QL-07 Refund-proof subcase. Plan one sandbox full refund on a paid-but-not-activated operation to prove store-operation-close, inside the mutation cap, marked "pending Director approval". If declined, record that subcase NOT RUN with a limitation; block nothing else.

QL-08 Add to T-020: removed-store-reactivate only authorizes and never activates a store without payment; a same-owner paid re-add restores the original store record and history (Director default 9).

QL-09 T-023 seller history is tested through data and API access (seller owner read-only on pre-sale history; buyer and all others denied structurally), since the screen was not built. If AC-023 text requires a screen, record a finding for adjudication, not a stop.

QL-10 T-028 includes the Portal browser regression on all three engines at the final candidate and confirms U-1, U-2, U-3 unchanged (they stay Director-accepted, not QA-certified).

QL-01 comparison inputs (line1 excluded):

```text
ACCEPTANCE_SPEC.md 225fe3fd10ab15917dd751d980d23449e6b9fe5b5d55e9ec16cba703495e7c31
APBM_RULINGS.md f118e4f73ae38f87590e4e5c5ae425f68caf5a35d2354e7124eba256497add60
EXECUTION_PLAN.md 568fb8b102c6b842f9691c94b9d4b9d4d6fa93a9be55ed3a62394932ff8540f8
ENVIRONMENT_AND_EFFECTS.md b361d0310d03517b698474fef14c27910dfd8ae66569ae302c6a7aba35a43fdc
ALLOWED_PATHS.md 1515ff89484222dad1c20df97b9905bb3d4a3f8a77351b75d0105091f3e75ce2
CONTRACTS/API_ROLE_MATRIX.md 71c5adb521a95848345e9febf8f2659c7e5a6e0ee4314161c25de584d4f09820
CONTRACTS/BILLING.md 87e9fd34d8252852051759b9836c959efc835c0284f485f65077915c4e4db90c
CONTRACTS/CLOCK_AND_NOTICES.md c15c77b175ac667ee47af8a16ff7c6148c292256cb7ba14ee337bb89476d80e3
CONTRACTS/DATA_AND_API_SHAPES.md 46aa59a1b51f8ad61956f3a8cfdbb2c1d2677961d57c45450885a351ba23684a
CONTRACTS/IDENTITY_AND_MEMBERSHIP.md a5a9dec93d6f0e3db295c95d163411a1b58510905ce6ce1ac93c39322d5ac982
CONTRACTS/LIFECYCLE_AND_TRANSFER.md ad1ae4d464fc09f390043680f8f04d43493edb1608a27e0451c868058564a6b4
CONTRACTS/MIGRATIONS.md bc8640548f56f1bf58c4e1a8187c18241ff9703003542126af97a15fc40a0eb0
```

QL-01 observed 10/12 match. APBM_RULINGS.md and ENVIRONMENT_AND_EFFECTS.md differ beyond line1; exact hash-matched reference diffs recorded. Hold only dependent live/effect tests, paid-reactivation/transfer-registration, migration 0068/0069 authorization, bundle exception and historical release/ruling assertions until Friday resolves these append-only deltas. Unaffected local/source checks may continue when separately released; Q2 currently unreleased. Evidence: evidence/preflight/02/ql01_contract_identity.json.

Standing rules: a product failure is a finding, keep testing; only the eight playbook stop types halt the run; repairs stay on qa/apbm-007b with the pair rebound after each; evidence layers stay separate. Q2 release pending.
