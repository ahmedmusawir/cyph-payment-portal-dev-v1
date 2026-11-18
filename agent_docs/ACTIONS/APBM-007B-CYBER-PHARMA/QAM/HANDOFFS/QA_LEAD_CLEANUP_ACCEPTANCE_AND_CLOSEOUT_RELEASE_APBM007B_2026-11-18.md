# QA LEAD CLEANUP ACCEPTANCE AND RELEASE TO CLOSEOUT — APBM-007B

**Date:** 18 November 2026 (Asia/Dhaka)
**From:** QA Lead (Friday)
**To:** Director (Tony); QA Executor (Cody); Chief Architect (JARVIS) for closeout
**Authority:** QAM Playbook v1.0 §14; certificate `QAM_CERTIFICATION_APBM-007B_2026-11-18.md` (SHA-256 `3d897cf99575c37c429200446df6315fff5b94f3c384c4a9044f42a2e24ce70f`); Director acceptance of KR-1 to KR-6, 18 November 2026, 13:40

## 1. Cleanup acceptance

**CLEANUP ACCEPTED, with the recorded exceptions in section 3.**

Reviewed: `APBM-007B-CYBER-PHARMA_CLEANUP_REVIEW_01.zip`, SHA-256 `63e87377f032934e6c174eb873b8773e3dd4103d7aab9eac9885fd55f7c83c41`, 810 indexed members, 0 mismatches. Read in full: the cleanup report and the three verification receipts (remote read-back, local execution, final working tree). The rest of the package is the retained campaign record and was not re-read.

## 2. What was executed, against certificate section 7

| Decision | Result |
|---|---|
| KEEP evidence, findings, plans, approvals, reports, all attempts, automation helpers | Kept; nine earlier archives byte-identical |
| KEEP SCRATCH business and claim rows; QA sign-in identities | Kept; row counts and digests unchanged on four tables; eight identities present |
| REMOVE sandbox subscriptions with the QA run marker, including the F-Q2-001 store's | Six cancelled, verified. No refund (F-Q2-001 shows 0 refunded) |
| REMOVE prepared transfer and buyer reservation | Transfer cancelled, reservation released |
| REMOVE SCRATCH billing-clock test context | Four contexts disabled, verified |
| REMOVE all QA sessions | Zero sessions and zero active refresh tokens on all eight identities |
| REMOVE private credential file, auth states, links, HAR, traces, profiles | Removed after the final value scan (96 private values across 2,541 files, zero hits); 31 declared paths verified absent |
| REMOVE builds, dependency copies, containers, temporary lanes | Removed |
| NOT TOUCHED Director's processes and files, DEV, product code, contract | Verified: both certified commits unchanged; no tracked change outside the QA records folder; the Director's own env file unchanged |

No deployment, no DEV migration, no refund, no limit increase.

## 3. Accepted exceptions (sandbox residue; no action required for closeout)

1. **Six test customers and three test clocks remain in the Stripe sandbox.** Their subscriptions are cancelled, so nothing renews. They were left because deleting them would also remove card records that do not carry the QA marker, and one clock has no marker. The Director may delete them in the Stripe sandbox dashboard at any time; it is optional.
2. **Two customer and subscription pairs with old `apbm007a` markings were left alone.** They do not belong to this run.
3. **Three expired checkout sessions and the paid invoice history remain.** Stripe keeps terminal history; refunds were forbidden.
4. **One temporary file, `/tmp/apbm007b-o1-cast.json`, was left** because it could not be shown to belong to QA.
5. **Sessions are revoked, but sign-in tokens already issued are valid until they expire** (normally within the hour). The matching passwords and files are gone.
6. **Filesystem removal is verified; secure erasure of the disk and any backups is not claimed.**

## 4. One records gap to close before the Director's commit

The Executor did not have the certificate file, so `QAM_CERTIFICATION.md` holds the verdict and the Director's acceptance but not the exact text of sections 1 to 6. The Executor imports the certificate and the QA Lead decision files from the Director's Downloads folder by hash, then records this acceptance and the release.

## 5. Release to Architect closeout

**RELEASED TO ARCHITECT CLOSEOUT, effective when the Director commits the durable QA records on `qa/apbm-007b`.**

| Item | Value |
|---|---|
| Verdict | GATE Q: PASS WITH KNOWN RISK |
| Certified pair | Portal `ba66534351368b4b67b9e61d6f0278866950c850`; OwedBook `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871`; branch `qa/apbm-007b` |
| Database | migrations 0001 to 0070; SCRATCH at 70; DEV at 69 |
| Known risks | KR-1 to KR-6, Director-accepted 18 November 2026 |
| Final evidence package | `APBM-007B-CYBER-PHARMA_Q4_REVIEW_02.zip`, SHA-256 `e6dd4520ac255a3a71e63cb71799618c0780c7baf8b1bb558adc3e8c7afb25d6` |

**Not authorized by anything in QA (each needs the Director's separate release):** any deployment; applying migration 0070 to DEV; merge to `main`.

**For the Architect's closeout list:**
1. Merge `qa/apbm-007b` in both repos, on the Director's release.
2. Migration 0070 to DEV before DEV runs the merged code.
3. Correct the contract manifest hashes (header-line and appended-ruling differences found at Q1).
4. Follow-ups from the certificate: KR-1 test time budget, owner progress feedback and confirm timing on staging; KR-2 watch on staging; KR-3 one live transfer-buyer completion at Gate D; backlog items (UTC-only deadline in notices, old operator wording, demo-mode invite form).
5. Gate D preparation: permanent webhook endpoint with native retry, deployed scheduler, staging sign-in settings, rollback readiness, individual operator sign-in.
6. Legal and consent wording before staging exposure; U-1 to U-3 remain Director-accepted.
7. The two repair rounds were issued by the QA Lead under the Director's ruling of 17 November; the instructions and bounds are in the QA Lead adjudications of 17 and 18 November.
