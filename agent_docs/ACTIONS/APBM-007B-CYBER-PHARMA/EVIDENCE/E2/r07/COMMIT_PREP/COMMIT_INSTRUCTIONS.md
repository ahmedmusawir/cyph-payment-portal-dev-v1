# APBM-007B — candidate commit instructions for Tony (prepared by Claudy, 17 November 2026)

Engineering prepared these lists and commands only. **Nothing has been staged, committed, pushed or branched by Engineering.**
Tony owns Git.

## Lists (this folder)

| File | Meaning |
|---|---|
| `<repo>_A_product_migrations_tests.txt` | Product code, migrations, maintained tests and maintained engineering tooling referenced by the handoff commands |
| `<repo>_B_module_qam_evidence_records.txt` | Module, QAM and evidence records (incl. `GOVERNING/`, the evidence ZIPs and this folder), plus the E2 response logs |
| `<repo>_C_excluded.txt` | Excluded with reason: credentials, git-ignored artefacts, temporary output, execution debris, outside-repo lanes, and the pre-E2 preparation package (Director decision) |
| `<repo>_INCLUDE_pathspecs.txt` | A + B — the exact staging list (one literal path per line) |
| `privacy_scan_of_commit_contents.json` | Privacy scan of exactly the A+B contents (both repos) and the review of every hit |
| `summary.json` | Counts per category |

Paths include `[id]`-style Next.js segments, so staging MUST use `--literal-pathspecs` (otherwise `[id]` is a glob).

## 1. OwedBook (dependency) — commit first

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
L=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/E2/r07/COMMIT_PREP/owedbook_INCLUDE_pathspecs.txt
git rev-parse --abbrev-ref HEAD                      # expect: apbm-007b
git diff --cached --quiet && echo "nothing staged"   # expect: nothing staged
git --literal-pathspecs add --pathspec-from-file="$L"
diff <(git diff --cached --name-only | sort) <(sort -u "$L") && echo "STAGED == LIST"   # must print STAGED == LIST
git status --short | grep -v '^A \|^M ' || true      # only excluded/ignored items may remain unstaged
git commit -m "APBM-007B: store identity, lifecycle, invitations and DEV-applied migrations 0061-0069 (OwedBook)" \
           -m "Forward migrations 0061-0069 (applied to DEV 17 Nov 2026 under the Director release), invitation/staff routes and UI, exact-address sign-in links, mail guard, 007B tests and proof tooling, APBM-007B DEV-apply and E2 evidence."
git rev-parse HEAD                                   # OwedBook candidate SHA — send to Engineering
git push origin apbm-007b
git branch qa/apbm-007b HEAD
git push -u origin qa/apbm-007b
```

## 2. Portal (primary, canonical module) — commit second

```bash
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
L=agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/E2/r07/COMMIT_PREP/portal_INCLUDE_pathspecs.txt
git rev-parse --abbrev-ref HEAD                      # expect: apbm-007b
git diff --cached --quiet && echo "nothing staged"   # expect: nothing staged
git --literal-pathspecs add --pathspec-from-file="$L"
diff <(git diff --cached --name-only | sort) <(sort -u "$L") && echo "STAGED == LIST"   # must print STAGED == LIST
git commit -m "APBM-007B: Add Store, removal/undo, transfers, notices and operator tooling (Payment Portal) + module records" \
           -m "Separate-invoice Add Store saga with fenced recovery, removal/undo, grace and billing notices, operator commands and jobs route, 007B tests, e2e and proof tooling; APBM-007B module, QAM handoff, GOVERNING (incl. Friday diff confirmation) and E2 evidence r01-r07."
git rev-parse HEAD                                   # Portal candidate SHA — send to Engineering
git push origin apbm-007b
git branch qa/apbm-007b HEAD
git push -u origin qa/apbm-007b
```

## 3. After both pushes

- Send both candidate SHAs to Engineering. They are recorded as a dated factual amendment (`QAM/QAM_MANIFEST.md` §8). The
  committed module necessarily says `Candidate: PENDING`, because a commit cannot contain its own SHA.
- `QAM/QAM_STATE.md` then moves to READY FOR RECON by its owning seat (per the state file), not by Engineering.

## Notes

- Excluded by Director ruling (17 Nov): `agent_docs/PACKAGES/APBM007B_PREPARATION_v0_3/` (72 files, obsolete pre-E2
  preparation package dated 16 Nov, not referenced by the module). It stays untracked and is not part of these candidates.
- Git-ignored items (`.env.local`, `.env.qa.local`, `.next/`, `next-env.d.ts`, `test-results/`, `tsconfig.tsbuildinfo`) are not
  addable without `-f`. Never force-add them.
- The private cast/credential files (`/tmp/apbm007b-o1-cast.json`, `~/.apbm007b/*`) and the work lanes
  (`/home/moose/APBM007B_E2_WORK/**`) are outside the repositories.
