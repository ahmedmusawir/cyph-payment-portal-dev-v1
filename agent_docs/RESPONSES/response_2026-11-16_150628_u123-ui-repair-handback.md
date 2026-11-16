## ENGINEERING repair seat — APBM-007A r06 handback: U-1, U-2, U-3

The repair is made on `qa/apbm-007a` in both checkouts. Engineering performed no branch switch or Git change, and made no database, Stripe, Auth, email or payment call. Friday owns certification.

**Pair:**
- OwedBook `c976968` → `c976968b20ee724f7390d5e0e008215f50ab6f25`
- Payment Portal `54a56b5` → `54a56b55ea7c72783d17d06ff45cd27b5426803f`

### 1. Causes and changes

**U-1 (OwedBook admin navigation).**
- **Cause:** the orange fill was cmdk's own selection, which follows the pointer and keyboard and outlives navigation in the persistent layout. The route only made its item bold.
- **Change:** the items are plain links. The route selects exactly one item, matched by whole path segment, with nested routes handled.
  - Selected: solid coral fill, white text.
  - Hover: coral outline, no fill.
  - Keyboard: visible focus ring.

**U-2 (OwedBook billing).**
- **Cause:** the real-mode read and the row hard-coded "Plan unavailable · Price unavailable · Billing dates unavailable".
- **Change:** OwedBook now reads `owner_billing_overview`, the owner-only, audited read the Portal uses.
  - Plan shows as "OwedBook · N pharmacy/pharmacies".
  - Dates show as "Next payment" or "Paid through", as in the Portal.
  - Synthetic subscriptions show "Synthetic test subscription · Not billed · No billing dates".
  - Missing data keeps the honest unavailable text, and owner-only access and read-only behaviour are unchanged.
- **Price:** no authorized source holds an amount, and the Portal shows none either, so the row says "Price shown in the billing portal" (limitation L1).

**U-3 (both apps).**
- **Scope:** show/hide on all four password fields: OwedBook sign-in, OwedBook profile new and confirm, and Portal sign-in.
- **Behaviour:** starts hidden; a `type="button"` toggle; "Show password" / "Hide password"; `aria-pressed`; keyboard-reachable with a ring; value and caret kept; `autocomplete` and validation unchanged.
- **Found and fixed by the browser walk:** Chromium resets the caret when the type changes, and the first fix could race typing.

### 2. Checks

| Check | OwedBook | Payment Portal |
|---|---|---|
| Unit tests, tested copy and QA checkout | 309 of 309 | 468 of 468 |
| Focused suites | 55 of 55 | 13 of 13 |
| Candidate control | 29 of 53 fail | 3 of 3 fail |
| Typecheck | clean | clean |
| Lint | 0 errors, 33 warnings (same as the candidate) | 0 errors, 24 warnings (same as the candidate) |
| Production build | pass | pass |
| Bundle scan | clean | clean |

**Production-build browser walk:**
- **Result:** 73 of 73 checks pass, covering both themes at 375 and 1440, Audit log ↔ Billing, hover, keyboard, paid, synthetic and non-owner billing, and all password toggles.
- **Fixture proof, not live:** the builds run against a local Supabase stand-in. It recorded 186 read requests, 0 refused and 0 writes.
- **Remaining live check for QA:** the real DEV paid subscription on the billing screen.

### 3. Director rulings (recorded as given)

- Mission Control is outside 007A scope: not graded and not a module limitation.
- Placeholder Terms, Privacy, support address and price-consent wording are accepted for 007A local use.
- Those placeholders must be resolved before any external or staging exposure.

They were appended to `APBM_RULINGS.md`, with a precondition in `STAGING_RELEASE.md` and obligation O-3 in `CARRY_FORWARD_007B.md`.

### 4. QA preservation, commits and package

- **QA files:** the 9,805 uncommitted OwedBook paths are byte-copied to `~/APBM007A_QA_BACKUPS/u123_r06_20261116_150305/` and verified unchanged.
- **Commits:** `EVIDENCE/E2/r06/commit/COMMIT_HANDOFF.md`, four guarded commits:
  - portal product, then portal records;
  - OwedBook product, then OwedBook records.

  Each block uses literal pathspecs and the verifier, and excludes every QA path.
- **Review ZIP:** `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_UI_REPAIR_REVIEW_r06.zip`, with its SHA-256 in the external receipt.

Tony commits and rebuilds both apps; Friday binds; Cody does the focused retest. No deployment.
