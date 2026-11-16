## ENGINEERING repair seat — APBM-007A F-Q4-001 / AC-011 repair handback (r04)

The repair is made on `qa/apbm-007a` in the existing checkouts. Engineering performed no branch switch, staging, commit or other Git change. Friday's disposition stands, and nothing here closes F-Q4-001.

### 1. Confirmed cause and repair

**Cause** (`src/server/checkout.ts`, unchanged since r01):
- Stripe created the customer and session, but the session answer was lost, so the operation stayed `created` with no session recorded.
- A retry with a different key treated that as "never payable". It marked the operation `expired_unpaid` with no provider proof and released its NPI.
- It then opened a new operation, whose derived idempotency keys made Stripe create a second customer and session.

**Related defect:** every retry recomputed the session's `expires_at`. Real Stripe refuses a repeated idempotency key whose parameters changed, so even the same-key retry would fail once a second had passed. QA's adapter doesn't compare parameters, which is why that path passed there.

**Repair** (`checkout.ts` only):
- **Resume, don't release:** an attempt with no recorded session has an unknown outcome. A retry with any key resumes that same operation under its own idempotency keys.
- **Identical parameters:** the planned session expiry is stored before the first create, so every retry sends identical parameters and Stripe returns the original customer and session.
- **No inference:** a missing session reference is never treated as unpaid. Release always needs a session that Stripe reports expired and unpaid.
- **Edited draft:** the earlier attempt is settled with Stripe first, expired and released on proof, and the new attempt keeps the same customer.
- **Unchanged:** concurrency, draft isolation, authorization, pricing, consent, expiry handling and later legitimate attempts.

### 2. Changed paths, hashes and diff

| Path | Change | SHA-256 |
|---|---|---|
| `src/server/checkout.ts` | M (+95 −41) | `f079df8d289dd24f289f3fdc558669848bfa06263506646defc1e5465b3e2a01` |
| `src/__tests__/apbm007a-checkout-recovery.test.ts` | A (15 tests) | `f49b10352570978af2ab57f4ebe890bb6e1ba98eab953e9f68f61e08b5898e72` |

- **Diff:** `EVIDENCE/E2/r04/product.patch`.
- **Provenance:** checkout bytes = tested copy = build copy (`provenance.json`).

### 3. Regression evidence and validation

**Unit layer.** The lost-answer test runs with a different-key retry and asserts:
- 1 customer, 1 session and 1 operation, with the same ID and the original key;
- the original URL is returned;
- no `expired_unpaid` and no release.

It also covers:
- a lost customer answer;
- a same-key retry seconds later;
- concurrent retries;
- a request that never reached Stripe;
- a lapsed session;
- an edited draft, including an edited email;
- proof-only release.

**Candidate control:** 9 of 15 tests fail on the candidate (every F-Q4-001 test); the 6 existing-protection tests pass on both.

**SCRATCH layer.** Real SQL and indexes, a modelled provider, one transaction rolled back, no Auth, no network: 4 of 4 PASS. The candidate control fails all 4, reproducing QA's 2 customers.

| Check | Result |
|---|---|
| Full unit suite, tested copy and QA checkout | 444 of 444 |
| Focused recovery suite | 15 of 15 |
| Poison controls | 9 of 9 caught |
| Typecheck | clean |
| Lint | 0 errors, 24 warnings (same as the candidate) |
| Production build | pass, BUILD_ID `IpvtWyXeUrtmKwYZLjxZq` |
| Client bundle scan | clean |

**Effects:** two rolled-back SCRATCH transactions only. No Stripe, DEV, Auth, email, checkout or payment effect, and QA's reserved identity is untouched.

### 4. Limitations and retest impact

**Limitations:**
- L1: the provider is modelled from documented Stripe behaviour, with no live run.
- L2: a retry more than 24 hours later can't rely on Stripe's idempotency keys. The lost session was never shown, so it can't have been paid.
- L3: if the customer answer was lost and the email then edited, the earlier attempt can't be settled until its key expires. The retry is refused safely.
- L4: an unknown-outcome attempt is resumed, never released on inference. Its unbound NPI hold still expires by the existing 30-minute rule.
- L5: pre-existing and unchanged: a same-key retry after an edit resumes the earlier revision's operation. Reported for Lead disposition.
- L6: the SCRATCH integration suite wasn't rerun, because it creates Auth identities.
- L7: the operator command doesn't attach lost sessions.

**Retest:**
- Rebuild and restart the portal on the repaired candidate after the commits.
- QA reruns `checkout-timeout` and the same-key run, with its adapter comparing parameters on a repeated key.
- Affected checkout behaviours and the required regression.
- Held live journeys stay held until Friday binds the pair.

### 5. QA preservation, commits and package

- **QA files:** the 3,422 uncommitted OwedBook paths are byte-copied to `~/APBM007A_QA_BACKUPS/q4_r04_20261116_114741/` and verified unchanged after the work.
- **Commits:** `EVIDENCE/E2/r04/commit/COMMIT_HANDOFF.md`:
  - three guarded commits on `qa/apbm-007a` with the exact expected HEADs;
  - literal pathspec lists;
  - the verifier after staging and after committing;
  - every QA path excluded;
  - rehearsed in throwaway clones.
- **Review ZIP:** `QAM/HANDOFFS/APBM-007A-CYBER-PHARMA_Q4_REPAIR_REVIEW_r04.zip`, with an index and integrity and privacy checks. Its SHA-256 is in the external receipt beside it.

Tony commits and rebuilds the portal; Friday binds the pair and owns retest and certification. No deployment before 007B.
