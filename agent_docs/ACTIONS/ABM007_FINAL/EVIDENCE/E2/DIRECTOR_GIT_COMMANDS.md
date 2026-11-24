# Director Git commands: candidate commits and `qa/abm007-final` (prepared by Engineering, not executed)

Git authority is the Director's. Nothing below has been run. Both repositories are on branch `abm007-final`, with nothing staged:
- OwedBook: HEAD `c335671afa6cd4a8a2d437c30aeae5040e0cecaf`, baseline `9597699b404afdbcd792a9b4da61c21abb10cdf8`.
- Portal: HEAD `b2e50fa86ef041f9f7f7f1a0f630576de0a10664`, baseline `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075`.

Candidate SHAs stay **PENDING** until these commits exist. Q1 records them from the Director's receipt.

## 1. OwedBook (`/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev`)

Read the state first and compare it with the list. Every path in the list must appear in the status, and nothing else should.

```
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev
```
```
git status --short
```
```
git add --pathspec-from-file=/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/STAGING_LIST_owedbook.txt
```
```
git diff --cached --name-status 9597699b404afdbcd792a9b4da61c21abb10cdf8
```
```
git status --short
```

Proposed commit message:

```
git commit -m "feat(abm007-final): Pharmacy Books brand, light only, Help page, store selector fix" -m "Approved tokens and Inter; forced light; logo and derived icons; navy header and white cards; surface-aware focus rings; Help at /help with stacked role list on narrow screens; No permitted stores placeholder only with zero stores; landing names and dead links; 375 px overflow fixes in ScreenHeader and DataTable; presentation tests. Module ABM007_FINAL, E2 complete; records in the Portal repository."
```

## 2. Portal (`/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1`)

```
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
```
```
git status --short
```
```
git add --pathspec-from-file=agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/STAGING_LIST_portal.txt
```

Optional: the review ZIPs and their `.sha256` files. These are large binaries; leave them out if you keep packages outside Git.

```
git add --pathspec-from-file=agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/STAGING_LIST_portal_optional.txt
```
```
git diff --cached --name-status cb4decde9adc9ab75d0dcb15556c64a3bdbfe075
```
```
git status --short
```

Proposed commit message:

```
git commit -m "feat(abm007-final): Pharmacy Books brand, literal and panel layouts, notice wording; QAM amendment 01 and module records" -m "Approved tokens and Inter; forced light; logo and icons; literal sign-in and registration shells; panel Add Pharmacy; surface-aware focus rings; billing-notice brand strings only; EmailPreview logo exception (AM-16); 16 stale e2e specs retired. Module records: rulings AM-08 to AM-17, QAM_AMENDMENT_01 installed, E2 evidence, SCRATCH proof tooling, prepared external settings (not applied)."
```

The list stages the 16 retired-spec deletions under `e2e/`. `RECOVERY.md` is not in either list.

## 3. QA branch at the new commits (after both commits exist)

These commands create the branch without switching to it; the working branch stays `abm007-final`.

```
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev && git branch qa/abm007-final HEAD && git rev-parse HEAD qa/abm007-final
```
```
cd /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1 && git branch qa/abm007-final HEAD && git rev-parse HEAD qa/abm007-final
```

When you choose to publish them (each repository):

```
git push origin abm007-final qa/abm007-final
```

Then give the QA Executor the two full SHAs as the candidate receipt. Q1 records them in `QAM/QAM_MANIFEST.md` section 1 and `QAM/QAM_STATE.md`. Q1 is released by the Director, not by these commands.
