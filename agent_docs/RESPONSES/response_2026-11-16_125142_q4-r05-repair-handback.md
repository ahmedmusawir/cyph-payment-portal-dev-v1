## ENGINEERING repair seat — APBM-007A r05 handback: F-Q4-003, F-Q4-002 and the F-Q4-004 diagnosis

The repair is made on `qa/apbm-007a` in the existing checkouts. Engineering performed no branch switch, staging, commit or other Git change, and made no live Stripe, Auth, email or payment call. Friday's FAIL stands, and nothing here closes a finding. DEV operation `25acbfb9` is untouched.

### 1. Confirmed causes (evidence vs inference)

**F-Q4-003 — paid new owner not provisioned (HIGH)**

Evidence:
- `operation_lease` grants the lease to the same owner again, and the owner was one constant per server process. So the three payment events and the status poll all held the lease at once.
- `provision_paid_registration` returns `not_paid` for any status other than `paid` or `provisioning`.
- The DEV row can only come from one order:
  1. Run A creates the identity and writes `provisioning`.
  2. A stale run B finds that identity and marks it pre-existing (`owner_signin_required`).
  3. A's provisioning call sees `attention` and returns `not_paid`.
- Reproduced from the code on real SCRATCH SQL: the candidate ends in exactly the DEV state (`attention` / `not_paid`, `owner_was_existing` true, its own identity, no account, one link sent).

Inference: the precise DEV timing, since there are no run logs.

**F-Q4-004 — access email 429 (diagnosed as probably product-caused)**

Evidence:
- The 429 is the status the Supabase Auth API returned to the portal's `/auth/v1/otp` request. It isn't the app limiter, which never writes notifications.
- Under the same shared lease, concurrent advances each sent a link for one address. Auth's per-address interval refuses the later request with 429, and its failure overwrote the first result.
- Reproduced in the unit model and on SCRATCH: mailer results `ok, 429`, final row `failed` / `429`.

Gap: whether a first DEV link was accepted, and which Auth limit applied, can't be established without Auth logs. From now on the stored value includes Auth's error code.

Retry disposition: event-driven only, with no timer. A failed notification is resent by the status poll, the resend button, the operator command or a webhook redelivery, at most once a minute.

**F-Q4-002 — stale Checkout after an edit (MEDIUM)**

Cause: a same-key retry always resumed the open operation, and a re-quote at the same revision was never treated as stale. This was r04's L5.

### 2. Repairs

**`provisioning.ts` (F-Q4-003, F-Q4-004):**
- One lease owner per call, with a bounded 8-second wait.
- Every write to the operation requires the run still to hold the lease.
- New identities carry the operation's marker. Older identities count as the operation's own only if it recorded them, they were created after it began, and the purchaser wasn't signed in at checkout.
- The access-email attempt is claimed before sending.

**`accessEmail.ts`:** keeps Auth's error code with the status.

**`checkout.ts` (F-Q4-002):**
- An open attempt is resumed only while it still matches the draft's revision, quote and consent.
- Otherwise it's settled with Stripe first, under any key: expired, then released on proof. A paid session is never released.
- The new attempt keeps the same customer and is stored under a successor key that the browser's key still reaches.
- F-Q4-001 recovery is preserved.

No migration.

### 3. Changed paths and hashes

| Path | Change | SHA-256 |
|---|---|---|
| `src/server/provisioning.ts` | M (+88 −31) | `f7a1d68d…a8e9ab` |
| `src/server/checkout.ts` | M (+42 −15) | `7e049cf8…097a76` |
| `src/server/accessEmail.ts` | M (+5 −1) | `e2f0c69e…7598d0` |
| `src/__tests__/apbm007a-provisioning-concurrency.test.ts` | A (13 tests) | `0010bb63…995a39` |
| `src/__tests__/apbm007a-checkout-recovery.test.ts` | M (+6 tests) | `e399cb0f…6f5e59` |
| `src/__tests__/apbm007a-mail-guard.test.ts` | M (fake returns updated rows) | `105e880e…8c39` |

**Diff:** `EVIDENCE/E2/r05/product.patch`.
**Provenance:** checkout bytes = tested copy = build copy (`provenance.json`).

### 4. Validation

| Check | Result |
|---|---|
| Unit tests, tested copy and QA checkout | 463 of 463 |
| Focused suites | 42 of 42 |
| Candidate control (unit) | 9 of 34 fail |
| Poison controls | 10 of 10 caught |
| Real SCRATCH, repaired | 6 of 6 PASS |
| Real SCRATCH, candidate | 5 of 6 FAIL |
| Typecheck | clean |
| Lint | 0 errors, 24 warnings (same as the candidate) |
| Production build | pass, `BUILD_ID Nu5wOIUg-27fMxEJf_nyX` |
| Bundle scan | clean |

SCRATCH runs are always rolled back, with no Auth write and no network. Three instrument faults in the harness were fixed, and their attempts preserved.

### 5. Operator recovery for DEV 25acbfb9 (QA-owned, not run)

After the commits, rebuild and restart the portal, then check provenance read-only (payment, recorded owner, identity age, no sign-in, no account). Run:

```bash
node scripts/operator-reconcile.mjs --operation 25acbfb9-9969-44b1-8b45-928d71f99ad6
```

Expected:
- Stripe is re-read and confirms the payment.
- The recorded identity is accepted as the operation's own.
- Provisioning runs exactly once: one account, store, admin, mapping and subscription.
- No new identity, email, charge or subscription.
- A repeat changes nothing.
- If provenance fails, the operation stays `owner_signin_required`.

This recovery is proved on SCRATCH; the candidate refuses it.

### 6. Limitations and retest impact

**Limitations:**
- The DEV timing is inferred.
- The F-Q4-004 limit identity and the first send are unproven without Auth logs.
- A run waits at most 8 seconds for a held lease, then answers `busy`. The webhook returns 503 and the event stays visible for recovery.
- The identity-age check relies on server clocks.
- r04's `sessionFor` and 24-hour key limits still apply.
- The SCRATCH integration suite wasn't rerun, because it creates Auth identities.
- No live runs.

**Retest:**
- Rebuild and restart the portal.
- Fresh install, typecheck, lint, unit and production build.
- New-owner paid journey under natural concurrency.
- Existing-owner sign-in.
- QA's AC-038 recovery of `25acbfb9`.
- Access-email state.
- F-Q4-002 retries with the parameter-comparing provider stand-in.
- The required regression.

### 7. QA preservation, commits and package

- **QA files:** the 6,613 uncommitted OwedBook paths are byte-copied to `~/APBM007A_QA_BACKUPS/q4_r05_20261116_124823/` and verified unchanged.
- **Commits:** `EVIDENCE/E2/r05/commit/COMMIT_HANDOFF.md`:
  - three guarded commits on `qa/apbm-007a` with the exact HEADs;
  - literal pathspec lists;
  - the verifier after staging and after committing;
  - every QA path excluded;
  - rehearsed in throwaway clones.
- **Review ZIP:** `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REPAIR_REVIEW_r05.zip`, with its SHA-256 in the external receipt.
- **Pending:** the proposed additional QA identity and sandbox purchase are still PENDING Director confirmation.

Tony commits and rebuilds; Friday binds and retests. No deployment.
