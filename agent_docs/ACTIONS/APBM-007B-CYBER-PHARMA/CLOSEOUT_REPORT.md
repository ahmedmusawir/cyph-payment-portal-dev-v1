# APBM-007B — closeout report

**Status: closeout prepared; Director merge pending in both repositories.** APBM-007B is not CLOSED until Tony's merges
into `main` are pushed and verified in **both** repositories. DEV is at migration 69; the 0070 apply is a separate
release. No deployment has happened. Gate D has not run.

Prepared 18 November 2026 (Asia/Dhaka) by Claudy (Engineering) under the instruction "CLAUDY — APBM-007B ARCHITECT
CLOSEOUT, BOTH REPOSITORIES" from JARVIS, issued for Director Tony. This is an administrative pass:
- no product, test, contract-file, migration, dependency or configuration byte changed;
- no database, provider, Auth, email or payment effect;
- no server was started;
- no Git mutation;
- QA automation was not re-run.

## 1. Authority

| Item | Value (verified 18 Nov 2026) |
|---|---|
| Gate Q | **PASS WITH KNOWN RISK**, QA Lead (Friday): `QAM/HANDOFFS/QAM_CERTIFICATION_APBM-007B_2026-11-18.md`, SHA-256 `3d897cf99575c37c429200446df6315fff5b94f3c384c4a9044f42a2e24ce70f`, equal to the expected value |
| Known risks | KR-1 to KR-6 **accepted by the Director**, 18 Nov 2026 13:40. Source: `~/Downloads/DIRECTOR_ACCEPTANCE_APBM007B_GATE_Q_KNOWN_RISKS_2026-11-18.md`, SHA-256 `ce33ecb57c79968e7b5d01110832928fcf0f681c784d61e7dcb8f02c26f5149d` (recorded by Friday; not imported into the repository; quoted in `QAM/QAM_CERTIFICATION.md`). The acceptance "does not authorize deployment or DEV migration 0070 apply" |
| Cleanup and release | **CLEANUP ACCEPTED** with the recorded exceptions; **RELEASED TO ARCHITECT CLOSEOUT**, effective on the Director's durable records commit (done: `1a07c63`, pushed). Source: `QAM/HANDOFFS/QA_LEAD_CLEANUP_ACCEPTANCE_AND_CLOSEOUT_RELEASE_APBM007B_2026-11-18.md`, SHA-256 `bae72eecc426ffb662b1c845fec850b44b75bb84ca0f11a63e35de374db80868`, equal to the expected value |
| Certificate import gap (release §4) | **Closed.** `QAM/QAM_CERTIFICATION.md` carries certificate §§1–6 verbatim: all 55 non-blank source lines are present exactly. Both source files were imported unchanged (`QAM/HANDOFFS/QA_LEAD_FILE_IMPORT_2026-11-18.md`). That receipt still lists six earlier QA Lead source files as missing; it is QA-owned and stays as it is |
| Final QA package | `APBM-007B-CYBER-PHARMA_Q4_REVIEW_02.zip`, SHA-256 `e6dd4520…25d6` (certificate §2) |

## 2. Identities and merge readiness (read-only; `git fetch origin` only)

| | Portal | OwedBook |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` |
| Remote | `github.com/ahmedmusawir/cyph-payment-portal-dev-v1` | `github.com/Cyberize-Group/cyph-v1-dev` |
| Branch; working tree before closeout | `qa/apbm-007b`; clean | `qa/apbm-007b`; clean (and still clean: closeout changed nothing here) |
| HEAD = `origin/qa/apbm-007b` | `1a07c635eddc62edafa53fd85643b49aa6d831c1` (QA records) | `855e0ad2e22a37e633ab5a55b8459e9bcc6bd871` |
| Certified product commit | `ba66534351368b4b67b9e61d6f0278866950c850`, ancestor of HEAD | `855e0ad…` = HEAD |
| Above the certified commit | 1 commit (`1a07c63`): 199 paths, **all under `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/`** (189 added, 10 modified): evidence, retained automation helpers, packages, receipts and QA records. Secret-shaped scan of the added lines and all 10 ZIPs: 0 hits | none |
| `main` = `origin/main` | `c68c4ac…` (007A merge), ancestor of the QA head; 0 commits on `main` not in QA | `0b78552…` (007A PR #10), ancestor of the QA head; 0 commits on `main` not in QA |
| Isolated merge (`git merge-tree`) | no conflict; tree `afcc8f68…` = QA head tree | no conflict; tree `42194eac…` = QA head tree |
| Merge method | local `--no-ff` (as for 007A); `main` not protected | **protected `main`** → PR with a merge commit (as PR #10); no open or past PR for `qa/apbm-007b` |
| Deployment coupling | no `.github/workflows`, no GitHub deployments or checks; `cloudbuild.yaml` is used only by the manual `deploy.sh` (`gcloud builds submit`) | no workflows, deployment or build configuration in the repository |
| **Ready to merge** | **Yes, after the closeout records commit** | **Yes, as is** |

The product is unchanged: the merged `main` trees will equal the QA trees. The only Portal paths outside `agent_docs/`
that change after `ba66534` are `CHANGELOG.md` and `RECOVERY.md`, both in this closeout. The Git handoff checks this
before and after each merge.

One thing I could not verify: **Cloud Build triggers on the GCP side** (project `cyberize-nextjs-staging`). gcloud on this
machine needs an interactive re-login. The handoff gives the read-only command to run before pushing `main`.

## 3. History (engineering → QA → two QA-Lead-routed repair rounds → certification → cleanup)

| Date | Stage | Portal | OwedBook |
|---|---|---|---|
| 16 Nov | Build pack v1.0 frozen (archive `08d5448b…`); Friday ACCEPT WITH EXACT AMENDMENTS; E2 released by Tony | `c68c4ac` baseline | `0b78552` baseline |
| 17 Nov | E2 complete; DEV 0061–0069 applied under the Director DEV release; candidate commit | `427bec6` | `c8a2ed9` |
| 17 Nov | Q1 (STOP-CONTRACT on 12/12 manifest hashes → Friday QL-01 CLEARED 12/12; correction deferred to closeout). Q1 records | `61b683a` | — |
| 17 Nov | Q2 complete: F-Q2-001, -002, -004, -005, -006 (product) and F-Q2-003 (QA instrument). QA Lead adjudication | `821f139` | — |
| 17 Nov | **Repair round 1**, issued by the QA Lead under the Director ruling of 17 Nov (QA Lead routes repairs): A (consent deadline by provider paid time; migration 0070), B (WebKit staff panel and sign-in hydration), C (dashboard copy), D (support runbook) | `00a9e0e` | `1fd5a61` |
| 18 Nov | Q4/01: round 1 verified; F-Q4-001, -002, -003 raised. QA Lead adjudication (`c675e9e3…`) | `71e4b00` | — |
| 18 Nov | **Repair round 2**, issued by the QA Lead: E (forms keep text typed before load, five forms), F (WebKit causes: not reproduced, no change); extension to the Add Store details form | `ba66534` | `855e0ad` |
| 18 Nov | Q4/02 → certificate: Gate Q PASS WITH KNOWN RISK; Director accepted KR-1 to KR-6; cleanup executed and accepted; durable QA records | `1a07c63` | — |

After Q1 the QA Lead instructed the QA Executor (Cody) directly. Both repair rounds were issued to Engineering by the QA
Lead and landed on the continuing `qa/apbm-007b` branches. The instructions and bounds are in the QA Lead adjudications
of 17 and 18 November (cited by hash in `QAM/`). Engineering's factual repair records are `QAM/QAM_MANIFEST.md` §8.

## 4. Contract manifest hash correction (release item 3)

`CONTRACT_MANIFEST.json` now records the governing repository bytes. The old values are kept per file as
`sha256_frozen_pack_v1_0`. Full per-file record: `EVIDENCE/CLOSEOUT/CONTRACT_HASH_CORRECTION.json`.

- **Old values.** All 12 equal the files in the frozen v1.0 pack (`~/Downloads/_ARCHIVE/APBM007B_BUILD_PACK_v1.zip`,
  `08d5448b…`).
- **Header-line difference (all 12 files).** Line 1, the build-contract status header, changed from "Frozen for Friday
  review; E2 NOT RELEASED." to the released status line (17 Nov, Director ruling 5). Lines 2 to the end of every pack file
  are unchanged.
- **Appended-ruling difference (2 files).** `APBM_RULINGS.md` has +47 appended lines: the Director rulings, approvals,
  DEV release, blocker closure, Friday diff confirmation and R-3 ruling, all dated 17 Nov. `ENVIRONMENT_AND_EFFECTS.md`
  has +5 lines: three Director envelope amendments of 17 Nov. Nothing earlier was edited.
- **Contract files.** Unchanged (0 bytes). The bytes are identical at the Q1 candidate `427bec6`, the certified commit
  `ba66534` and `1a07c63`. Manifest SHA-256 before: `05464df0…65ba`; after: `d8e95750…11e7`.

## 5. DEV migration 0070 (prepared, not applied)

`EVIDENCE/CLOSEOUT/DEV_APPLY_0070/DEV_APPLY_0070_RELEASE.md` holds the existing-runner commands, target identity checks,
unchanged-prefix checks, prerequisites and post-apply checks. The approved 70-entry manifest is `approved-manifest-0070.json`
(`134d815d…d8f2`; entries 1–69 equal the r05 DEV manifest). 0070 SHA-256 `de0b51c6…edce81` = expected, from `855e0ad`.

**DEV must reach migration 70 before merged application code runs against DEV.** One guard-tool caveat is recorded there:
`dev-apply-guard.mjs` hard-codes the 0061–0069 apply, so its `ready` and `ledger_69_equals_manifest` fields print false by
design. The named fields are read instead, and the write path (`apply-forward.mjs`) is fully guarded on its own. Changing
the guard would change OwedBook beyond the certified commit, so it is backlog (`CARRY_FORWARD.md`).

## 6. Release notes (merge of `qa/apbm-007b`)

**OwedBook.**
- Migrations 0061–0070: canonical pharmacy identity, store operations and paid Add Store saga, lifecycle and transfers,
  invitations, billing notices, append-only operator audit, privileges, the 007A compatibility fix, decision-9
  reactivation and transfer buyer via registration, and the consent deadline decided on the billing clock by the
  provider's paid time.
- Screens: staff panel and invitations.
- Repaired: sign-in link and change-password forms keep text typed before load.

**Portal.**
- Paid Add Store with server quote, three-part consent, durable operation and payment status.
- Billing notices and scheduler jobs.
- Operator commands and the support runbook.
- Repaired:
  - the consent deadline by provider paid time (F-Q2-001, F-Q2-004);
  - dashboard copy;
  - the sign-in, sign-in-link and Add Store details forms keep text typed before load (F-Q4-001).

**Operational.** DEV is at 69 until the 0070 release. There is no deployment. Legal and consent wording is still required
before staging exposure.

## 7. Blockers, accepted risks and backlog

- **Blockers to the Git merge: none.** Two conditions, not blockers: (1) commit the Portal closeout records first;
  (2) check the GCP Cloud Build triggers before pushing `main`, because I could not read them.
- **Blocker to running merged code against DEV:** the 0070 apply (separate release).
- **Accepted risks:** KR-1 to KR-6 (Director-accepted).
- **Backlog and follow-ups:** `CARRY_FORWARD.md`.
- **Gate D:** `GATE_D_HANDOFF.md`.

## 8. Not done and not claimed

- Merge, push and DEV apply are not done.
- No deployment.
- Gate D not run.
- No refunds, cleanup or provider or database writes.
- QA verdicts, findings, approvals and the certificate are not rewritten. No QA-owned record changed; the one file touched
  in `QAM/` is the engineering-owned `HANDOFFS/ENGINEERING_HANDOFF.md`, appended only.
- The module becomes CLOSED only on actual integration receipts from both repositories.
