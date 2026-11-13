## Apply-review ZIP delivered — option B recorded, restore NOT PROVEN

The sanitized package is built from existing evidence only. Nothing was installed, dumped, restored, copied or deleted, and no provider effect was dispatched. DEV is untouched and the apply stays held for the SQL review.

### Package

`/home/moose/Downloads/APBM-007A-CYBER-PHARMA_APPLY_REVIEW_r01.zip`, with the original in the module's `QAM/HANDOFFS/` folder.

- 92 members, 90 indexed in `FILE_INDEX.json`
- SHA-256 `3bcfb74217093eb82479f83914b8c80c6a46a07de15d0ab2a35a3cd06ba0e015`
- Scanned clean for keys, tokens, database URLs, sign-in links, credential fields and the private inbox addresses

| Folder | Contents |
|---|---|
| root | `REVIEW_START_HERE.md`, `APPLY_BUNDLE.md` (revised), `FILE_INDEX.json` |
| `migrations/` | The exact eight SQL files, `0053`–`0060` |
| `tooling/` | `apply-forward.mjs` and the 10 supporting scripts changed for this delta |
| `dev-readonly/` | Migration inventory, DEV preconditions, catalogue fingerprint at `0052`, preservation snapshot, logical-export receipt (path, size and hash only) |
| `scratch-rehearsal/` | Receipts of the fresh replay with its forward resume and of the upgrade: runner receipts, preservation before/after, the 329-check and 82-check proofs |
| `e2-run/` | Reconciled counters, progress ledger, preflight result, engineering check results |
| `authority/` | Rulings, frozen migration plan, apply-checkpoint rules, release request with receipts |

The eight migration files still match the pinned inventory; none changed since the bundle was written.

### What the revised bundle says about backup

- **Disposition:** option B accepted by you; option A cancelled.
- **Restore:** NOT PROVEN, full or partial, and explicitly accepted for this checkpoint.
- **The logical export covers** row content of the 17 `public` tables, the ledger, and the list of Auth user IDs.
- **It does not cover** Auth users' data, password hashes or sessions, roles, grants and default privileges, or functions, policies, triggers and indexes as restorable objects. It cannot be replayed by a restore tool.
- **Proven on SCRATCH instead:** forward recovery (stopped at `0059`, resumed to `0060`) and preservation of existing tables, users and indexes across the upgrade.

### Reconciled counters

| Surface | Used | Ceiling |
|---|---|---|
| SCRATCH reset cycles | 3 | 4 (the fourth stays unused) |
| Auth identities | 12, all on SCRATCH | 12; no extension, none deleted |
| Auth session attempts | about 42, all on SCRATCH | 100 |
| Sign-outs | 18, all on SCRATCH | 30 |
| Emails | 6 (the incident) | 24 |
| Stripe mutations | 5 | 250 |
| Stripe reads | 12 | 1,000 |
| DEV writes | 0 | — |

The session figure is approximate: I counted it from the test design, not from a per-call log.

### Consequence of the identity ruling

The portal's integration test against SCRATCH creates identities, so it stays unrun. Its last full run passed 14 of 15 checks; the fifteenth was the stub assertion, now covered by the accepted stub proof.

Your rulings are recorded in `APBM_RULINGS.md`, `APBM_STATE.md` and the journal. I am waiting for the SQL review outcome. No deployment before 007B.
