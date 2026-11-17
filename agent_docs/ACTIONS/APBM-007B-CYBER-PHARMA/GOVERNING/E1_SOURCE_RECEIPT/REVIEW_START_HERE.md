# APBM-007B — Targeted source receipt for JARVIS

Run: `E1_SOURCE_RECEIPT_20261116_202541_claudy` · Engineer seat: Claudy · Read-only pass · E2 not started.

## Contents

| File | What it holds |
|---|---|
| `REVIEW_START_HERE.md` | This file: baselines, template search result, export scope, redactions, limitations, item 5 |
| `COMMANDS.md` | Exact commands, cwd and flags; missing and stale tooling labelled. None were run |
| `SOURCE_EXPLANATIONS.md` | Store identity and NPI uniqueness, historical access paths, lease and transaction boundaries, operation-to-invoice correlation |
| `source/payment-portal/…` | 88 tracked files, byte-for-byte from HEAD except two redacted files |
| `source/owedbook/…` | 100 tracked files, byte-for-byte from HEAD |
| `FILE_INDEX.json` | Every member: package path, repository, source path, size, SHA-256, redaction flag |

Every file under `source/` keeps its repository-relative path. Files were taken with `git show HEAD:<path>`, so they
are the committed bytes, not working-tree bytes.

## Baseline identities

| | Payment Portal | OwedBook |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` |
| Branch | `apbm-007b` | `apbm-007b` |
| HEAD commit | `c68c4acaccc4a68f20ede267f06cfda17fa15aac` | `0b785524a621c4384db8bee47ef9b4149b8ab44c` |
| HEAD tree | `0736957c20745aadae714f3befb543fca30f3aa1` | `de68919cbc7a293199e685ba7193e6ff46e21b2b` |
| Commit time | 2026-11-16T15:53:38+06:00 | 2026-11-16T16:03:09+06:00 |
| Subject | APBM-007A: Payment Portal subscription checkout and billing, Gate Q closeout and Director-accepted sign-in repair | Merge pull request #10 from Cyberize-Group/qa/apbm-007a |
| Tracked files | 2319 | 3216 |
| Modified tracked files | 0 | 0 |
| Untracked | `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/`, `agent_docs/PACKAGES/` | none |
| `package-lock.json` SHA-256 (not exported) | `28e2d2f86028a28b6299ee25468f5998c47065f29d1853e19ff0af3434792bd3` | `4ee4b06deb263d6932ea754f8b22f2af60678acc3b8f6b6cd7f02c13c468279b` |

Both HEADs equal the E1 baseline pair. Both were re-read after packaging and are unchanged.

## 1. Factory QAM templates — NOT FOUND on this machine

`03_BUILD_METHODOLOGY/_templates/QAM/` does not exist here. Nothing was recreated.

Locations checked:

- Whole local filesystem (`/`, one filesystem, excluding `node_modules`, `.git`, caches) for any directory named
  `03_BUILD_METHODOLOGY` (any case, any suffix) or `_templates`: no `03_BUILD_METHODOLOGY`; the only `_templates`
  directories are four inside the Google Cloud SDK's bundled Python libraries.
- `/mnt/hgfs` (shared-folder mount point): empty. `/media`: empty.
- Both repositories, tracked and untracked, and `/home/moose/NEXTJS/CYBER_PHARMA/ARCHIVE/`.
- Files named `*QAM*TEMPLATE*` or `*TEMPLATE*QAM*` under `/home/moose`: none.

What does exist is the path as a citation only. `GOVERNING/QAM_PLAYBOOK.md` (lines 8 and 61 in the untracked 007B
pack; the same citation appears in OwedBook's tracked 007A pack) names the Hub template set and says its version is recorded in the set's own
`README.md`; that README is not on this machine either.

Instantiated packs exist and are not templates: OwedBook `agent_docs/ACTIONS/{APBM-003,APBM-007A,RRM-004}-CYBER-PHARMA/QAM/`
(tracked), Portal `agent_docs/ACTIONS/cyph_subscription_portal_phase1_ffm_abm/QAM/` (tracked) and
`agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/` (untracked, JARVIS's own). Only the two tracked `QAM_ENTRY.md` files
named under "module pointers" are exported; the packs themselves are not.

## 2. Export scope

Payment Portal (88 files): `package.json`; Jest, Playwright, ESLint, TypeScript, Next, PostCSS and Tailwind
configurations; `Dockerfile`, `cloudbuild.yaml`, `deploy.sh`, `init-app.sh`, `stark-deploy.yaml`, ignore files; all of
`src/server/` (billing, webhook, checkout, provisioning, operator, emailLink, accessEmail, stripeClient, stripeMirror
and the rest); every `src/app/api/**/route.ts`; `src/proxy.ts`; `src/utils/supabase/`; `src/services/auth/`;
`src/lib/appIdentity.ts`; `src/types/portal/`; `scripts/operator-reconcile.mjs`, `scripts/stripe-catalogue.mjs`; the
six `apbm007a-*` unit suites, three boundary/API suites, `jest.setup.ts`; the SCRATCH integration test; three
Playwright helpers; root `CLAUDE.md`, `RECOVERY.md`, `README.md`, `WINDSURF.md`, `supabase/README.md`,
`agent_docs/PROJECT_POINTER.md` and the active module's `CLAUDE.md`, `AGENTS.md`, `FFM_ENTRY.md`, `README.md`,
`QAM/QAM_ENTRY.md`.

OwedBook (100 files): `package.json` and the same configuration set; `src/lib/appIdentity.ts`; all of `src/server/`
(including `accessState.ts`); `src/utils/`; `src/proxy.ts`; `src/instrumentation.ts`; `src/services/tenantScope.ts`;
the service-key boundary test `src/__tests__/apbm007a-boundaries.test.ts` with the other `apbm007a-*` suites and four
related suites; migrations `0002–0006`, `0016–0022`, `0028–0032`, `0036–0037`, `0044–0060` (so `0048` and `0053–0060`
in full, plus the earlier tables, helper functions and policies the explanations cite);
`scripts/rls-harness/lib/env.mjs` and `lib/db.mjs`, `lib/verdict.mjs`; `scripts/db-verify.mjs`, `apply-forward.mjs`,
`db-reset.mjs`, `dev-verify.mjs`, `lint-check.sh`, `rls-harness/{apbm007a-proof,prove,harness}.mjs`; the three tracked
007A helper scripts that hold the real build, bundle-scan and integration-runner command lines; root `CLAUDE.md`,
`CLAUDE.eng.md`, `RECOVERY.md`, `README.md`, `RUN_NOTES.md`, `docs/TESTING.md`, `.cursor/rules/workflow-entry.mdc`,
`agent_docs/FACTORY_SESSION_SETUP.md`, `agent_docs/DB_BASELINE.md` and the 007A module's `CLAUDE.md`, `AGENTS.md`,
`APBM_ENTRY.md`, `README.md`, `CARRY_FORWARD_007B.md`, `MIGRATION_PLAN.md`, `QAM/QAM_ENTRY.md`, `QAM/CLAUDE.md`.

## Redactions (2 files, 1 value)

| Exported file | Line | What was replaced | Marker |
|---|---|---|---|
| `source/payment-portal/deploy.sh` | 19 | Supabase publishable key for the DEV project, committed in tracked source | `[REDACTED_BY_CLAUDY:supabase_publishable_key]` |
| `source/payment-portal/stark-deploy.yaml` | 64 | The same value | same |

The value is a browser-shipped publishable key, not a server secret; it was redacted anyway because the instruction
covers any embedded credential. These two files therefore differ from HEAD by that one token each and are flagged
`redacted: true` in the index. No other credential pattern matched in the export (Stripe keys, webhook secrets, JWTs,
Supabase secret keys, database URLs with passwords, private keys, cloud keys, quoted passwords).

Left in place because they are not credentials: Supabase project references (`SCRATCH_REF`, `DEV_REF` in
`scripts/rls-harness/lib/env.mjs`, the project host in the two deploy files and OwedBook `RECOVERY.md`), one
deployment contact address in `stark-deploy.yaml` line 28, and canary or fake values in test files and
`build_check.sh` (`sk_test_CANARY…`, `whsec_itest_secret`, `sk_test_itest`, `acct_itest`), which exist to prove the
bundle scan and are not real.

## Excluded

- All env files, including the tracked templates `.env.example` and `.env.pilot.example`.
- `package-lock.json` (hashes above), `node_modules`, build output.
- `supabase/.temp/` (linked-project state).
- All evidence, QA packs, backups and restricted archives; untracked 007B pack and `agent_docs/PACKAGES/`.
- Business data, authenticated traces, screenshots.

## 5. Second capability check or ledger search — NOT RUN

- Second focused capability check: **NOT RUN**. None has been authorized to me.
- Read-only `stripe_events` ledger search: **NOT RUN**. None has been authorized to me; no database was contacted.

The one capability check that was authorized and completed is already returned and is not repeated here:
`/home/moose/APBM007B_E1_REVIEW/APBM-007B-CYBER-PHARMA_E1_CAPABILITY_CHECK_20261116_191218.zip`,
SHA-256 `919d2156d9cb4967c9f1828e7b580aede552a611f438f68cc58fc798acdcdd12`.

Note on that earlier ZIP: line 1 of its `evidence/call_ledger.jsonl` records the full Stripe sandbox account
identifier (the object id of the account read). It is an identifier, not a credential, and the 007A billing contract
already records it; the preflight file in the same ZIP shows only its last four characters. Say so if you want that
ZIP reissued with the line shortened; its hash would change.

## Limitations

- Nothing was executed: no install, typecheck, lint, test, build, server, browser, scan, database or provider call.
  Commands in `COMMANDS.md` are read from source and from tracked 007A records, not re-proven today.
- Installed tool versions were read from `node_modules/*/package.json`; they are local-machine facts and may differ
  from a clean install of the lock file.
- The export is a bounded selection, not the repositories. UI components, most unit suites, and 2,600+ documentation
  and evidence files are not included.
- Explanations describe HEAD source. What is actually applied to DEV or SCRATCH was not checked.
- The factory templates cannot be supplied from here; they need to come from the Hub.
