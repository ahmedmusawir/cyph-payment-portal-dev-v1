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
