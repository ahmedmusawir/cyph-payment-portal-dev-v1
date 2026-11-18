**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Proposed E2 envelope — becomes effective only with Tony's E2 release

## Targets and private configuration

DEV project yrsuwikjnbmvpznrgydb; SCRATCH ihgcsrypblqkwommrkgj. Verify actual API/DB refs and expected sandbox account/catalogue before every mutating phase. Stripe test keys only; no production mode. Credentials come from private existing .env.local via scoped in-memory loader for required names only; explicit ordinary application env loading is authorized when E2 is released. No full env read/dump/hash/export or edits to credential values by the build. Director privately sets missing values; schema validation reports names/presence only.

Portal new names: RESEND_API_KEY (Director reports supplied), BILLING_EMAIL_FROM=Cyber Pharma <no-reply@cyberizedev.com>, MAIL_ALLOWLIST (exact controlled test recipients), ALLOW_TEST_CLOCK=false default. MAIL_GUARD defaults on and cannot be disabled by this release. Keep existing SMTP settings unchanged. Existing app/env/Stripe names remain from source. Local apps OwedBook3000/Portal3001; proof copies use explicit local-proof configuration rows 3100/3101 (host-only cookie names distinct from ordinary local). Add the fixed local-proof origin pair to both appIdentity allowlists only for APP_ENV=local; never arbitrary origin env override, no shared parent cookie. Staging addresses remain agreed owedbook and owedbook-payment subdomains. ALLOW_TEST_CLOCK requires SCRATCH/local, independently denied by SQL context on DEV.

Engineering owned build/server/browser processes in disposable proof lanes ARE permitted by this E2 envelope, superseding the old engineering-server prohibition for this assignment only. Do not stop Director processes or occupy their ports. Use copies excluding .env*, .git, builds and QAM evidence; use npm ci from exact lockfile, no dependency upgrade/install mutation of original dependency tree. Network package fetch is an acknowledged setup effect. No symlink/hardlink mutations to original dependencies.

## Cumulative hard limits — one E2 release, includes failures and bounded internal checkpoints

| Effect | Ceiling / target |
|---|---|
| SCRATCH fresh/upgrade/forward-resume chain cycles | 12 total; existing retained fixtures protected outside explicit new reset footprint |
| SCRATCH new Auth identities | 14, synthetic run-owned, includes invitation capability |
| DEV new Auth identities | 0; engineering reuses owned supplied fixtures; QA reserves new-invitee journeys |
| Stripe sandbox customers/subscriptions | 12 / 12; test-clock customers included |
| Stripe test clocks / advances | 4 / 30; exclusively run-owned fixtures |
| Invoice create / item create / finalize / void | 30 each, only run-owned Add Store invoices |
| Explicit invoice pay / hosted submit | 24 combined; all automatic initial payments also counted below |
| Payment attempts success+failure+browser | 60 total, aggregate attempted simulated amount USD 3000; duplicate attempts count |
| Subscription mutations (quantity/cancel/undo) | 50; run-owned fixture objects only |
| Payment method attaches / default-card changes | 24 / 30; fixture-only |
| Promotion fixture redemptions | 3 additional APA10SANDBOX uses; no fixture/catalogue edit |
| Actual email dispatch attempts | 24 combined Auth/invitation/notice; exact allowlisted controlled inboxes only |
| New fixture application mutations | 400 requests against run-owned synthetic data, SQL/state-row effects separately reported |
| DEV live apply | 1 reviewed new chain + at most 1 separately reviewed forward fix; apply checkpoint below |
| Reads | Observational counts, not a hidden tiny cap; 30s request/SQL timeout; bounded pagination/backoff |
| Cleanup | Up to created run-owned clock/customer/subscription counts; archive evidence then cancel/delete only run-owned disposable provider objects |

No earlier probe budget carries. Pre-existing 007A fixtures/objects/archives retained. No DEV reset, deletion of old rows, production billing or external recipients. Run counter preflight/guard before provider dispatch; persist ledger and account for automatic SDK/provider retries. Disable SDK mutation network retries; provider automatic collection disabled for Add Store invoice. Predict/check amount before each possible payment. A ceiling exhaustion blocks affected effects; do not silently raise, alias, or reset counters. Timebox a capability stage to 45 minutes; engineering local test time is not a one-hour global deadline.

## Apply and ownership checkpoints

SCRATCH resets may affect only the verified dedicated SCRATCH target and declared rehearsal footprint. Preserve existing fixture exports first; if resetting would destroy retained unrelated fixtures, use isolated rehearsal database/schema or ask one concrete disposition. Before DEV apply return one manifest/hash/SQL-diff/privilege/preservation/rehearsal receipt and obtain Tony's apply release. Other safe implementation continues while waiting. No blanket per-file approvals.

Engineering inbox cast: existing controlled OWNER_A/OWNER_B plus dedicated ENGINEERING_ADMIN/ENGINEERING_MEMBER/ENGINEERING_INVITEE; privately supplied exact addresses/passwords. QA cast NEW_ADMIN/NEW_MEMBER/EXISTING_INVITEE and any first-owner journey reserved for Friday-approved final repaired candidate; never consume those in engineering. Missing mail allowlist prevents sends only; build/tests with guarded transport continue. Missing credentials are grouped once with owner/enabler, never guessed.

Q1 grants no new provider/business mutations here. Independent QA envelope is prepared by Cody/Friday from measured engineering effects and separately released by Tony. Local independent build/instruments in QA lanes can be planned in Q1; any actual auth/live mutation must have its own stated allowance. QA processes preserve one writer/checkout and explicit handoff.

Stop only dependent work for wrong identity, privacy, missing authority, invalid instrument or conflicting contract. Aggregate blockers and preserve earlier evidence. Production/deployment/shared Auth changes have separate release; this envelope does not authorize them.

---
**Amendment (Director, 17 November 2026 — recorded by Claudy):** aggregate attempted simulated charges USD 3,000 → **USD 4,800**; explicit invoice pay / hosted submissions 24 → **30**. All other limits unchanged. Ledger ceilings: `scripts/apbm007b/lib/effects.mjs`.
**Amendment (Director, 17 November 2026, later — recorded by Claudy):** Stripe customers 12 → **13**; Stripe subscriptions 12 → **13**. All other limits unchanged; no counter reset or reduced.
**Amendment (Director, 17 November 2026, B1 closure — recorded by Claudy):** Stripe customers 13 → **14**; Stripe subscriptions 13 → **14**. All other limits unchanged; counters preserved.
