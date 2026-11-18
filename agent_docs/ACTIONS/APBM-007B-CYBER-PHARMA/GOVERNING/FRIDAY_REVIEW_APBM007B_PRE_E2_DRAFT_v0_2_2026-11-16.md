# Friday review — APBM-007B pre-E2 review draft v0.2 (delta)

Date: 16 November 2026, Asia/Dhaka. Reviewer: Friday. Author reviewed: the Architect (JARVIS). Requested by the Director.

Read with `FRIDAY_REVIEW_APBM007B_PRE_E2_DRAFT_v0_1_2026-11-16.md`, which defines PE-01 to PE-08.

## Reviewed package

| Item | Value |
|---|---|
| File | `APBM007B_PRE_E2_REVIEW_DRAFT_v0_2.zip` |
| SHA-256 | `d4151369526e5915703cc57e4d5ab55cc5331d297c442432067030dd2dc5cc2d` |
| Members | 5 files; 4 indexed plus the index. All sizes and hashes match. |
| Change from v0.1 | One new file, `CAPABILITY_CHECK_DISPOSITION.md`. Two status lines updated. `ARCHITECT_REVIEW_AND_CONTRACT_CORRECTIONS.md` is byte-identical to v0.1. |

## Scope and limit

A review of the Architect's working draft. Not the frozen-pack review, not an E2 release, not Q1 approval, not a certification.

Neither the E1 return nor the capability-check return was supplied to the reviewer. The Architect's assessment of the payment probe is reviewed as written, not checked against the probe evidence.

v0.2 crossed with the v0.1 review. PE-01 to PE-08 are not yet reflected and stay as issued.

## Disposition

**NO OBJECTION — proceed.** The capability assessment is careful and does not overstate what the probe showed. The second focused provider check the Architect proposes is justified. PE-09 to PE-11 below are added to the list for the frozen pack. No reply or new version of this draft is needed.

## What the assessment gets right

- It keeps provider behaviour separate from application behaviour in every row.
- It leaves two questions open instead of closing them on substitute evidence: completing a payment that needs card authentication on the hosted page, and a real discounted first purchase followed by Add Store.
- It refuses to treat "no listener found" as proof of no database side effects.
- It reports the instrument's own unapproved ceiling and its two failed cleanup calls instead of hiding them.
- It states that no leftover budget carries into a new run.

## Effect on the earlier additions

**PE-01 (removal creates no refund or credit):** the probe row "no-proration decrease/undo … no added invoice or credit" is provider-level support. PE-01 stays open for the application contract and for proof on a real next invoice.

## New additions for the frozen pack

**PE-09 — The mid-period charge is the business rule and is still unproven.**
- Target: disposition row "Quote equals charge"; criterion AC-003.
- Concern: both probe cases were charged 4,900 cents about twenty seconds after the subscription began, so the "rest of the period" was the whole period. Decisions record 5.10 is "charge only the rest of the current month". The Architect lists mid-period as a distinct test. It needs a home.
- Addition to AC-003: "At a point well inside the billing period the quote is less than the full additional-store price, and the invoice raised equals that quote. Evidence layer: real provider with controlled time." Run it inside the test-clock work for O-1, so no extra provider run is needed.
- Owner: Architect.

**PE-10 — No charge may land outside the owner's consent window.**
- Target: disposition row "Automatic retry"; AR-03.
- Concern: the probe shows the provider scheduling a further payment attempt on an open Add Store invoice. If the provider collects later, a store could activate hours after the owner walked away, on a quote they no longer see.
- Addition: "An Add Store operation has a fixed expiry. At expiry or abandonment the application voids the open invoice and clears the pending change. A provider payment that still arrives is reconciled to exactly the consented operation or sent to operator attention; it never activates a store silently. Proved with a late-payment case."
- Owner: Architect.

**PE-11 — Settle the stray webhook delivery before QA baselines the ledger.**
- Target: "Instrument and effect qualifications", fourth and fifth points.
- Concern: the probe's events briefly showed one pending webhook. The likeliest cause is a local Stripe listener left running from the 007A session, forwarding to the Portal, which records a row before rejecting a foreign event.
- Addition: support the Architect's read-only search of the DEV event ledger for the probe's event IDs. Record the result in the frozen pack. Any rows found are kept and listed as known foreign rows in the QA preflight, so Q1 does not report them as an anomaly.
- Owner: Director authorizes the read-only check; Architect records.

## Needed with the frozen pack

Unchanged, plus one item:

1. The E1 return ZIP.
2. The capability-check return ZIP, and the return from the second focused check.
3. The Director's rulings on the consolidated request.
4. The result of the read-only ledger search in PE-11.
