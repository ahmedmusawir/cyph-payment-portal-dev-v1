## ENGINEERING repair seat — APBM-007A Q2 repair r03 handback (F-Q2-001 + F-Q2-002)

The repair is made on `qa/apbm-007a` in the existing checkouts. Engineering performed no branch switch, worktree, stash, staging, commit or other Git change. Friday's Q2 a01 FAIL stands, and nothing here closes a finding.

### 1. Confirmed causes and repairs

**F-Q2-001, registration cannot reach review.** QA's suspected cause is confirmed.
- **Cause:**
  - On a first registration, the pharmacy page loads before any server draft exists (`draft = null`).
  - After a successful save it cleared the tab's unsaved owner input, then started navigating to review.
  - Its owner guard then read the empty input plus the stale empty draft and called `router.replace('/register/owner')`.
  - That later navigation won, so review never loaded and no quote was requested.
  - The old unit test only checked that "go to review" was called.
- **Repair:** after a save, the page adopts the server's saved draft before clearing, and a `saved` flag stops the guard.
- **Unchanged:** owner guard for unsaved states, review completeness redirect, server validation, draft isolation, NPI reservation, three explicit consents.
- **Inspected:** the owner, review and activation transitions do not have this defect.

**F-Q2-002, undo with both cancellation fields set.**
- **Cause:** one patch cleared only the flag when both fields were set.
- **Repair:** clear the flag if set, read again, clear the date if still set, read again. Success is reported only when both read as clear on the same subscription.
- The two settings are never sent in one call, and each update gets a fresh idempotency key.
- A partial failure is reported, and a retry finishes what remains.
- Authorization and refusals are unchanged.

### 2. Changed paths and test results

Payment Portal only; OwedBook product is unchanged.

| Path | Change |
|---|---|
| `src/components/portal/register/PharmacyStepView.tsx` | F-Q2-001 fix (+11 −3) |
| `src/server/billing.ts` | F-Q2-002 fix (+23 −16) |
| `src/__tests__/portal-registration-journey.test.tsx` | New: journey through the real pages behind a working router (8 tests) |
| `src/__tests__/apbm007a-server.test.ts` | +9 undo regressions with a stateful provider fake |
| `src/__tests__/portal-owner.test.tsx` | Save test asserts no return to the owner step |

| Check | Result |
|---|---|
| Unit tests, tested copy and QA checkout | 429 of 429 |
| Focused suites | 69 of 69 |
| Typecheck | clean |
| Lint | 0 errors, 24 warnings (same count as the candidate) |
| Production build | pass |
| Bundle scan | 0 secret values |
| Poison controls | 7 of 7 caught (old candidate files, a removed guard, both parameters in one call, no re-read, a reused key, no final check). Two partial fixes are equivalent, as expected |

The five checkout files are byte-identical to the tested copy and the proof-build copy (`provenance.json`).

### 3. Production-browser proof

- **Setup:** Chromium, fresh context (first draft reads returned none), 1440×1000, `next start` on 3101.
- **Build:** BUILD_ID `5PHBDZwHVyF0Ahf3kcXjj`. It differs from the repair only by a harness line pointing the local origin at 3101, because QA holds 3001; that line is in no commit.
- **Route sequence:** plan → owner → pharmacy → **review**, showing the server's $99.00 quote (revision 1).
  - Refresh: still **review**, $99.00.
  - Edit pharmacy (prefilled) → **review**, changed name, new quote (revision 2).
  - Edit owner (prefilled) → pharmacy → Back → owner → pharmacy → **review**, new quote (revision 3).
- **Stop:** no consent ticked, payment not pressed, 0 checkout requests.
- **Evidence:** `EVIDENCE/E2/r03/browser/` (`walk.json` and four screenshots).

**Effects:**
- DEV: 1 synthetic draft (3 saves, 3 quotes) and 1 NPI hold, left in place.
- No Auth identity, email, Checkout, payment, Stripe mutation or settings change.
- The 3101 server is stopped. QA's servers, `.next` folders and env files are untouched.

### 4. Remaining limitations

| ID | Limitation |
|---|---|
| L1 | Live sandbox undo is NOT RUN; it is reserved for QA. It is unproved whether both fields can be set together live, and whether Stripe clears the date with the flag |
| L2 | The browser proof is engineering evidence: one browser, one viewport, one theme, proof-origin build |
| L3 | OwedBook was not started; post-payment journeys are QA's |
| L4 | The DEV draft and NPI hold remain until expiry or a Director disposition |
| L5 | A partial undo failure shows the existing generic error until the owner retries |
| L6 | Development mode was not compared |
| L7 | A pre-existing lint warning is left in place |

### 5. Commit handoff and review package

- **Commit handoff:** `EVIDENCE/E2/r03/commit/COMMIT_HANDOFF.md` in the OwedBook module.
  - Three commits: portal product (5 paths), portal records (3 paths), OwedBook records.
  - Each block requires `qa/apbm-007a` and the exact expected HEAD.
  - Each block runs the manifest verifier after staging and after committing.
  - All 5,011 QA-owned OwedBook paths are excluded.
- **Review ZIP:** `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q2_REPAIR_REVIEW_r03.zip`, with a byte-identical copy in Downloads. Its SHA-256 and member count are in the external receipt beside it.
- **QA work:** backed up to `~/APBM007A_QA_BACKUPS/q2_r03_20261116_100605/` and verified unchanged after the work.
- **QA helper processes:** the two `Q2-a01/new-owner*.cjs` processes are sleeping with no network sockets, and were left running for QA.
- **Erratum:** E-A1-1 recorded; independent QA in Q2; SQL proofs SCRATCH-only.
- **Deferrals:** unchanged.

Retest impact is in `REPAIR_F-Q2.md` §11. Tony commits; Cody binds the new pair and retests under Friday's authority. No deployment before 007B.
