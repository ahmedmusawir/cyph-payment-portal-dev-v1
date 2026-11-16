## Commit handoff for Q1 — ready; nothing committed

Everything is in the OwedBook module at `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E2/r01/commit/`:
- `COMMIT_HANDOFF.md` — the lists, exclusions and commands
- the pathspec list files
- `COMMIT_MANIFEST.json` — SHA-256 and git blob id per path
- `verify_commit.py`

I changed no Git state, made no provider call and reran no tests for packaging.

### 1. Product files

| Repo | Added | Modified | Deleted | Total |
|---|---|---|---|---|
| OwedBook | 34 | 24 | 0 | 58 |
| Payment Portal | 66 | 45 | 20 | 131 |

The full path lists, deletions included, are in `COMMIT_HANDOFF.md` §1, with each path's hash in the manifest. The portal's `package-lock.json` is included deliberately: it carries the ESLint dev dependencies.

### 2. Records to retain (separate commits)

- **OwedBook module records:** the APBM-007A module folder, minus the excluded archives. It covers the v1.0 pack documents, E1 and E2 evidence, the apply receipts, the QAM records and this commit folder.
- **Payment Portal operating records:** `RECOVERY.md`, the module pointer, session logs and response logs.

Every text record passed the same credential, token, link and address scanner used for the review packages.

### 3. Excluded

- **In the repos:** nine derived review ZIPs (E1 r1–r6, apply review r01, E2 r01–r02). Their hashes are listed; their contents are already kept as records.
- **Outside the repos, never to be committed:**
  - both `.env.local` files
  - the private inbox file
  - the APBM003 login sheet
  - the DEV logical export
  - the SCRATCH cast credential files in `/tmp`
  - the archived work lanes, which hold screenshots and saved browser sessions
  - the copies in Downloads

### 4. Commands

`COMMIT_HANDOFF.md` §4 gives copy-paste blocks for each repo:
- explicit pathspec files with literal pathspecs, no blanket `git add`;
- a product commit, then a records commit;
- `verify_commit.py` after staging and again after each commit. It checks paths, change types and git blob ids against the reviewed manifest, and that the product commit sits on the reviewed base.

### Q1 handoff

`ENGINEERING_HANDOFF.md` §11 now carries every open item:
- **13 NOT RUN cases**, with the brand-new owner first;
- **7 incomplete implementation items**;
- **7 risks.** R1 is the one you named: supported webhook events whose operation or subscription is not yet mapped are recorded as ignored and answered 200, so Stripe does not retry. Q1 should challenge the mapping race and the retry behaviour.

The outgoing checkout record is filled in `QAM/HANDOFFS/QA_HANDOFF.md`.
