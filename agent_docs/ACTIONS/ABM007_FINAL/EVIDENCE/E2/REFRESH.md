# E2 read-only refresh (amendment A, AM-09)

**Run:** 24 Nov 2026, 04:05 to 04:06 UTC (10:05 Asia/Dhaka), by the Engineer. Commands only read. No fetch, pull, switch or other Git change.

## 1. Live observations

### 1.1 `git ls-remote --heads origin`

**OwedBook** (`Cyberize-Group`), 04:05:29Z — 19 heads. Relevant:

| Head | SHA | Meaning |
|---|---|---|
| `abm007-final` | `c335671afa6cd4a8a2d437c30aeae5040e0cecaf` | The records-only commit is now **pushed**; local `abm007-final` equals the remote |
| `last-moose-design-APBM007B` | `c335671…` | New branch (local and remote), same commit |
| `main` | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | The baseline |
| `qa/apbm-007a` | `ff66effeab451073ca91f09941b156f4edb6dfa4` | **Exists on GitHub** (no local ref; E-3 question closed) |
| `apbm-007a` | — | **Not on GitHub** |

Others: `apbm-003`, `apbm-007b`, `deploy/owedbook-alpha-prep`, `guest/frank-2026-10-22`, `pilot-setup`, six `pilot/vik-*` and `records/vik-stage3-closure`, `qa/apbm-003`, `qa/apbm-007b`, `repair/apbm-007b-manual-qa`, `vibe-pilot-setup`.

**Portal** (`ahmedmusawir`), 04:05:32Z — 7 heads:

| Head | SHA |
|---|---|
| `abm007-final` | `b2e50fa86ef041f9f7f7f1a0f630576de0a10664` |
| `last-moose-design-APBM007B` | `b2e50fa…` |
| `main` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` (the baseline) |
| `apbm-007b` | `427bec6267b9777e9cb44f81c22d1396a495bc14` |
| `deploy/payment-alpha-prep` | `e4c23ed0aba1a3f731451cae1e3786e5a1b9043d` |
| `qa/apbm-007b` | `57c923f99c48c9e21a863dff6b1ee4779d401e57` |
| `repair/apbm-007b-manual-qa` | `7517459273dd2e80fdd2e68f064d489c7cca7744` |

`apbm-007a` and `qa/apbm-007a` are **not on GitHub** for the Portal.

### 1.2 Alpha `/api/build-info` (one GET each)

| Service | Time (UTC) | HTTP | Body |
|---|---|---|---|
| `https://cyph-v1-owedbook-alpha.cyberizedev.com/api/build-info` | 04:05:58 | 200 | `{"app":"ob","revision":"ef4cebccae68499bee7d4a53b230e31474a17f52","artifactId":"owedbook-alpha-ef4cebccae68-20261120t111951z"}` |
| `https://cyph-v1-payment-alpha.cyberizedev.com/api/build-info` | 04:06:02 | 200 | `{"app":"pp","revision":"6dd3de737acacff9685c0c2027246bf396f10c1d","artifactId":"payment-alpha-6dd3de737aca-20261121t042632z"}` |

Alpha still serves `ef4cebc` (OwedBook) and `6dd3de7` (Portal), the commits the E-4 diffs started from. With E-4, both alpha services are product-identical to the baselines.

## 2. New since E1 (found by this refresh)

**Portal HEAD moved.** Local `abm007-final` is `b2e50fa86ef041f9f7f7f1a0f630576de0a10664`, "E1 recon done", committed by the Director at 24 Nov 09:36:25 +0600 and pushed; a branch `last-moose-design-APBM007B` was created at the same commit (reflog 09:37 to 09:38). Its 127 paths are all records: the module pack under `agent_docs/ACTIONS/ABM007_FINAL/`, `CHANGELOG.md`, `session_2026-11-24.md` and the E1 response file. **No product path** (`git diff --name-only cb4decd b2e50fa | grep -vE '^(agent_docs/|session_|CHANGELOG\.md)'` is empty).

**OwedBook** has the same branch pattern (`last-moose-design-APBM007B` at `c335671`, reflog 09:39) and `c335671` is now on the remote.

Under ruling AM-08 (3), the product baselines stay `9597699` and `cb4decd`; the starting HEADs `c335671` and `b2e50fa` are recorded separately in `ABM_STATE.md`. The AC-R03 diff is taken from the baselines, so both records-only commits appear in it as records.

## 3. Historical records (not re-observed)

Deployment receipts in each repository's `RECOVERY.md` and `DEPLOYMENT_CHECKLIST.md`, read in E-4, remain the record of how alpha was built. This refresh did not read Cloud Run, DNS or any dashboard.
