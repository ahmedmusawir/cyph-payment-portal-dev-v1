**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Director rulings — post-E1

Source: Tony's visible conversation on 16 November 2026: “Approve recommendations 1–8”. He subsequently confirmed the Resend key was placed privately in Portal .env.local as RESEND_API_KEY. This is an Architect transcription of approval, not a purported byte-identical uploaded Director document.

1. Preserve one permanent pharmacy identity and separate ownership records. Buyer receives no historical claims. Seller owner retains read-only historical claims/receivables; former staff lose access. At most one active ownership/store record per NPI.
2. Replaced admin becomes member unless owner selects removal. Cross-account membership allowed; rights remain store-scoped, never billing rights. Incumbent remains until acceptance.
3. Ordinary removed-store customer access ends at removal boundary; retain data for controlled support access. Sale-history owner access is the explicit exception above.
4. Staging uses protected shared operator credential with mandatory named actor, reason and ticket. Audit separates authenticated-as from declared actor. Personal attribution is a known staging limitation; individual operator sign-in required before production.
5. Narrowly extend OwedBook's server-only privileged path to invited identity creation and invitation sign-in delivery. Preserve authorization, server-only and bundle checks; no public signup reopening.
6. Second failed-payment notice is 48 hours before seven-day grace ends. Failure notice at first failure; each type at most once per invoice; none after recovery.
7. Portal is the single billing-notice sender via Resend sending API on the already verified domain. Existing Auth SMTP path stays for sign-in/invitation links. RESEND_API_KEY availability confirmed by Director; value not received or inspected by JARVIS.
8. Preserve the customer's earned first-store APA discount. An added store charges only its remaining-period additional-store price; no recovery of the prior discount.

Earlier approved defaults remain: Claudy engineering, Cody independent QA, Friday QA Lead, JARVIS Architect; audited operator transfer/recovery plus procedures, no customer transfer screens; undo removal before paid-period end; last store uses whole-account cancellation. Fixed USD graduated catalogue $99 first/$49 additional; no production discount policy or refund feature added.

Approval of these decisions is not Friday frozen-pack acceptance, a provider proof, a DEV apply release, E2 execution or staging authority.

## Architect mechanism choices

Use separate operation-bound incremental invoices for all Add Store payments; quantity changes occur after payment with no proration. Do not use the default pending-update proration call that charged 5890 cents after APA. CP-1 in EXECUTION_PLAN.md proves the selected mechanism before affected implementation; no evidence is falsely carried across that change.

Quote validity 15 minutes. Consent/payment window 30 minutes from confirmation, shortened to no later than 60 minutes before period end. Add Store confirmation is refused within the last 90 minutes of a period, during cancellation/grace/read-only or an unresolved billing operation. These are technical bounds; UI explains the no-go reason and expiry before payment.

Invitation 7-day life, maximum five dispatch attempts total, 60-second resend interval. Owner becomes default new-store admin, then may replace through acceptance. Grace permits existing reads/writes until read-only; SQL and app enforce read-only for new mutations. Owner billing recovery and necessary access revocation remain available; revocation is allowed even in read-only, never a way to grant access.

All implementation changes beyond this exact package are append-only attributable amendments, never silent AC edits. Continue safe unrelated work if one capability/authority prerequisite blocks.

## BP-01–09 successor

Source: Friday frozen-pack review as received in GOVERNING/FRIDAY_FROZEN_PACK_REVIEW_v1_0_AS_RECEIVED.txt, bound to original ZIP a45493266d03d947485980187d9bc45b9f0140c01bb5e5c27f9c06d7f18b99e0. All contract edits in BP_AMENDMENT_LEDGER.md; no new E2 release. USD minimum constant/strict common period window supersedes prior90minute wording where stricter. Operator external-refund close records proof, never creates refund. Same-owner reactivation history default9 needs Director approval; recommendation is reuse original history after successful payment. Original v0.1 pre-E2 review bytes still pending, expected SHA37a0993a700264f8a1efab02c149c67e5bc0c1760abe47c8e6b73b5ecea50d48. No missing original is reconstructed or relabeled byte-identical.

## Director rulings — 17 November 2026 (recorded by Claudy from Tony's message "CLAUDY — CONTINUE APBM-007B E2")

1. Use a narrow forward-fix migration 0068 for the compatibility trigger; preserve SCRATCH fixtures and applied history; reconcile files and ledger without rewriting an applied migration or bypassing checksum checks. → `0068_007b_identity_compat_fix.sql`; 0061 restored to its applied bytes.
2. Decision 9 APPROVED: a same-owner paid re-add restores the original store record/history; payment must succeed before access returns; buyer access to seller history remains prohibited.
3. Complete transfer-buyer support through normal registration as specified; no scope reduction to existing-account buyers.
4. Record the pre-existing `generateLink` library-name scan hit as a documented baseline exception; keep scanner and secret checks intact.
5. Update stale status headers to Tony's actual E2 authorization; preserve the real review history; do not invent Friday approval.

Engineering note (not a ruling): rulings 2 and 3 require SQL changes; because 0061–0067 are applied and may not be rewritten, they are carried in a second forward file `0069_007b_reactivation_transfer_registration.sql`. ALLOWED_PATHS named 0061–0067 and ruling 1 named 0068; 0069 is therefore an explicit item in the DEV-apply checkpoint for the Director's acceptance.

## Director approvals — 17 November 2026, second message ("CLAUDY — CONTINUE FROM r02"), recorded by Claudy

- **Migration 0069 APPROVED** for the already-approved same-owner paid reactivation and transfer-buyer registration behaviour.
- **Envelope amendments:** sandbox aggregate attempted simulated charges USD 3,000 → **USD 4,800**; explicit invoice pay/hosted submissions 24 → **30**. All other limits unchanged. (Ledger ceilings updated in `scripts/apbm007b/lib/effects.mjs`; no counter was reset or reduced.)
- **Decision 9 explicitly confirmed:** same-owner paid re-add restores the original record/history only after successful payment; buyer access to seller history stays prohibited.
- Engineering inbox cast supplied (addresses only; recorded privately in the mail allowlists).
- Friday's 17 November successor diff confirmation: stated by Tony as supplied. **The confirmation text/document has not reached Engineering in this session**, so its content and the archive SHA it names are NOT recorded or compared here. Engineering-verified fact: the installed successor pack equals `APBM007B_BUILD_PACK_v1.zip` (SHA-256 `08d5448b60d2410d08f25c5addfc73c842971db4a0bac9242c4a7d8d6ac31f01`, 123 members; all 122 indexed files byte-identical to `/home/moose/APBM007B_INSTALL/APBM007B_BUILD_PACK_v1_0_r1_PENDING_RELEASE`). The original v0.1 pre-E2 review bytes remain MISSING.
- DEV apply remains pending its separate release.

## Director approval — 17 November 2026, third message (recorded by Claudy)

- E2 sandbox **customer and subscription ceilings 12 → 13 each**. All other limits unchanged. Existing reservations and counters kept intact (seq 179 stays counted).
- Complete Check E once with the corrected consent script; then clean up the check-C subscription and other run-owned provider resources; return one updated checkpoint ZIP. DEV apply remains pending its separate release. No Git mutation or deployment.

## Director release — DEV apply, 17 November 2026 (verbatim text in APBM_JOURNAL.md)

- Claudy is authorized to execute the controlled DEV apply of exactly 0061–0069 per `EVIDENCE/E2/r04/DEV_APPLY_MANIFEST_FINAL.md`; this explicitly delegates the DEV-write step previously described as Tony-only.
- Pre-apply stop conditions, one-transaction-per-migration apply, guarded deployment-identity binding, post-apply verification; no DEV test users, fixtures, resets, deletion, payment activity or email sends.
- Then finish engineering; final indexed ZIP; ENGINEERING COMPLETE only if factual. No Git staging/commit/push/merge/deployment; no QA approval implied.
- Manual receipt observation 5 (buyer-access email 10:55) recorded.
