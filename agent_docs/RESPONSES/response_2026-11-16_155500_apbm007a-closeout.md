## ENGINEERING seat — APBM-007A closeout prepared; Director merge/push pending

**Status:** records-only pass. No product, test, config, dependency or contract change; no Git mutation; no server, database, Stripe, Auth, email or payment effect. Not CLOSED until Tony's merge and push of both repositories are verified.

**Actual identities (read-only).** Both checkouts are clean on `qa/apbm-007a`.

| | OwedBook | Payment Portal |
|---|---|---|
| HEAD | `af1b4af04592f04689de2e4de59f28db65437f8b` (Q5 records) | `1a3913262ed0f8e8303823d92d2551fd9cc725b3` (r06 records) |
| Certified, ancestor of HEAD | `c976968b20ee724f7390d5e0e008215f50ab6f25` | `54a56b55ea7c72783d17d06ff45cd27b5426803f` (product `6ed09ff…`) |
| r06 UI product (Director-accepted, not QA-certified) | `c554c2dc9eba302cd8d4ba2da24da05990e0afd0` | `516b49f5912e31bca3bb903dd262994c0e83fcbf` |
| `main` = last-fetched `origin/main`, ancestor of QA head | `bc4e4336f80d2e8cdbb628d4de29d08f8fc95694` | `c89572a45210e7d6f098c2878cfabe9a1c5326f1` |

**Successor diff, checked by blob:**
- **OwedBook:** 12 product paths, exactly r06 and byte-identical to its manifest; 65 engineering record paths; 378 QA record paths (`QAM/` only).
- **Portal:** 3 product paths (r06); 3 record paths.
- There is no other product delta after certification.

**Records written:**
- OwedBook: `CLOSEOUT_REPORT.md`, plus updates to state, journal, carry-forward, the README and review-start banners, and `CHANGELOG.md`.
- Portal: the pointer, `RECOVERY.md`, the session file, `CHANGELOG.md` and this record.
- The certificate and all `QAM/` files are untouched.

**Carried forward:**
- certificate risks 1–11;
- O-1, O-2, O-3;
- the U-2 price limitation (no amount verified);
- U-1/U-2/U-3 not QA-certified;
- Mission Control out of scope;
- fixtures retained with no deletion authority;
- the E2_ENGINEERING r01/r02 ZIPs restricted outside Git.

**Git handoff:** `EVIDENCE/CLOSEOUT/commit/COMMIT_HANDOFF.md`. Run Portal P-1, P-2, P-3, then OwedBook O-1, O-2, O-3:
1. Closeout commit (literal pathspecs and verifier).
2. Fetch, ancestry guards, `--ff-only` to `origin/main`, and `--no-ff` merge with a tree-equality check.
3. Normal push and the `pushed` verifier.

**Rehearsal:** in throwaway clones, all six blocks passed. The controls for an edited file, a stray file and a diverged remote all stopped as intended. Two instrument faults are preserved (`REHEARSAL.md`).

**Return:** each repository's `OK pushed` block and its `git status --short --branch` line. If the push is rejected, take the PR route in §4. No deployment.
