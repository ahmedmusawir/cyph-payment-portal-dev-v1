# ENGINEERING_HANDOFF — `APBM-007B-CYBER-PHARMA`

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/HANDOFFS/ENGINEERING_HANDOFF.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §5 and §7. **Owner: Engineer**, as part of the original engineering assignment. Everything here is a **claim for independent QA** unless it is a command or a path. Companion to `../QAM_MANIFEST.md`.

**Engineer:** Claudy · **Recorded at:** 16 November 2026, Asia/Dhaka — **CHECKPOINT r04, 17 November 2026 (NOT the final handoff; engineering is not complete)** · **Manifest:** `../QAM_MANIFEST.md` · **Candidate:** `PENDING`

## 1. What was built (claims, per acceptance criterion)

For this checkpoint the per-AC claim table with paths, verification and evidence is
`../../EVIDENCE/E2/r01/BUILD_REPORT.md` §2 (all 31 ACs and GD-001, including NOT RUN / BLOCKED rows). It will be transcribed
here, row by row, at the final handoff. Summary: built and engineering-verified for AC-001–009, 018–020 (SQL + provider +
SCRATCH saga + browser happy paths); built with SQL/unit verification and partial browser coverage for AC-010–017, 021–024,
027, 030; AC-025 NOT RUN as a product journey; AC-026 BLOCKED on private inputs; AC-028 unit-level only; AC-029 rehearsed,
DEV not applied; AC-031 scanned with controls.

## 2. Commands (exact, with working directory)

```
# Portal = /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 ; OwedBook = /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
npx --no-install tsc --noEmit && npx --no-install eslint . && npx --no-install jest --ci         # each repo
node scripts/apbm007b/build-check.mjs --self-test                                                   # Portal
node scripts/apbm007b/build-check.mjs --app both --out /home/moose/APBM007B_E2_WORK/build           # Portal; clean copies + scan
node scripts/apbm007b/proof-serve.mjs build|start|stop --out /home/moose/APBM007B_E2_WORK/proof     # Portal; 3100/3101 → SCRATCH
node scripts/apbm007b/served-identity.mjs --base http://localhost:3101 --manifest <proof manifest>  # Portal; same for 3100
node scripts/apbm007b/integration.mjs --suite store                                                  # Portal; SCRATCH + sandbox
node scripts/apbm007b/jobs-run.mjs --base http://localhost:3101 --key-source scratch --every 60      # Portal; expiry/notices runner (proof pair)
node scripts/operator-007b.mjs --help        # Portal; add --key-source scratch against the proof pair
node scripts/apbm007b/inbox.mjs --check | --manual-list   # Portal; per-role inbox coverage (automated|manual); manual records
node scripts/apbm007b/{o1-journey,c-journeys,e-transfer,gf-checks,invite-send}.mjs --help   # Portal; r03 live checks (proof pair, ledger-reserved)
node scripts/apbm007b/{privacy-scan,export,env-preflight,mail-guard-probe}.mjs --self-test           # Portal
node scripts/apbm007b/migrate-rehearsal.mjs fresh|forward --db <local url> [--fault-at <file>]       # OwedBook; local DB only
node scripts/apbm007b/sql-proof.mjs --local <url> | --scratch                                        # OwedBook
PORTAL_BASE_URL=http://localhost:3101 APBM007B_PROOF_CAST=<0600 file> npx --no-install playwright test --project=apbm007b   # Portal
OB_BASE_URL=http://localhost:3100 APBM007B_PROOF_CAST=<0600 file> npx --no-install playwright test --project=apbm007b       # OwedBook
```

Listener: none used. Build identity: `GET /api/build-info` on both apps (app, revision, artifactId) compared with the build
manifest and the listening process (cwd + disk BUILD_ID) by `served-identity.mjs`.

## 3. Evidence inventory (what each item means)

See `../QAM_MANIFEST.md` §7 and `../../EVIDENCE/E2/r01/` (CP1, CP2, MIGRATIONS, BUILD, BROWSER, INVENTORY, BUILD_REPORT.md)
and the cumulative ledger `../../EVIDENCE/E2/effects/`.

## 4. Limitations and open points

| Item | Detail | Who should decide |
|---|---|---|
| Envelope | Amended 17 Nov (USD 4,800; pay/hosted 30; customers/subscriptions 13). Check E done; customers/subscriptions 13/13 | Director |
| Inboxes | No automated inbox access; manual receipt 1–4 confirmed by Tony; id 5 (check-E access email) pending. Invitation acceptance PASS on real inboxes (`../../EVIDENCE/E2/r04/ACCEPT/`) | QA to observe |
| SCRATCH auth template | Token-hash Magic Link template + proof redirect URLs saved by the Director (17 Nov) — an independent runtime on SCRATCH relies on it | QA / Director |
| AC-025 / O-1 | Live clock lifecycle PASS (r03); notice arrival in the inbox unobserved (manual) | QA to observe |
| Hosted-page return | No return link to the operation after Stripe's hosted page (not required by contract) | Architect if wanted |
| 0069 | APPROVED 17 Nov 2026 | — |
| DEV apply | Manifest `../../EVIDENCE/E2/r02/DEV_APPLY_MANIFEST.md` | Director |
| Firefox staff journey | one intermittent timeout, re-run passed | QA to observe |
| Seller-history UI | not added ("may" in contract); API + DB proven | Architect if wanted |

## 5. Reproduction for an independent runtime

From a clean clone of `qa/apbm-007b` at the candidate (when it exists): install with `npm ci` in disposable copies, build
with `build-check.mjs`, serve with `proof-serve.mjs` (needs SCRATCH set in OwedBook `.env.local` and Stripe test names in
Portal `.env.local`), verify served identity, then run the commands in §2. Machine-dependent: the local isolated Supabase
rehearsal database (`/home/moose/APBM007B_E2_WORK/localdb`, Docker) and the `/tmp` proof credential files.

## 6. What this handoff does not contain

- Q1 findings, Q2 results, a plan, an approval, a certificate (not the Engineer's to write).
- Secret values, auth state, raw authenticated traces.
- Any statement that the acceptance criteria should change.

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*

## Mandatory 007B factual fields (Engineer)

Recorded above and in the manifest for this checkpoint; the final handoff completes them (re-captured inventory, all AC rows,
exact inbox adapter schema once supplied, runtime guard validation evidence with real allowlisted addresses).
