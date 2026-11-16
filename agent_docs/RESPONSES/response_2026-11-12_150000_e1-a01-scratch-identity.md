## SCRATCH identity verified — it is the recorded project, distinct from DEV, and no variable is missing

All four `APBM_SCRATCH_*` variables the tooling requires are present, so there are no missing names to report. Everything was read-only: one rolled-back read-only transaction on each database and two API reads. Nothing was reset, seeded, restored or applied, and no server was started.

### Identity

| Check | Result |
|---|---|
| Project reference in `APBM_SCRATCH_DB_URL` | Equals the recorded `ihgcsrypblqkwommrkgj` |
| Differs from the DEV reference | Yes |
| Project reference in `APBM_SCRATCH_SUPABASE_URL` | Equals the recorded reference |
| Database system identifier | SCRATCH and DEV are different clusters |
| SCRATCH API keys | New-style publishable and secret keys; both accepted by the SCRATCH API; neither equals a DEV key |
| The four E1 test identities | Present on DEV, absent on SCRATCH |

### What SCRATCH holds now

| | SCRATCH | DEV |
|---|---|---|
| PostgreSQL | 17.6 | 17.6 |
| Public tables | 17 | 17 |
| Migration ledger | 52 rows, last `0052_system_config.sql` | Same |
| Auth users | 13 | 16 |

SCRATCH is at the same migration level as DEV, so `0053` onward can be rehearsed on it. I compared the ledger's row count and last name only, not every checksum.

### One thing that differs from your note

The SCRATCH URL is on port 6543, which is the transaction pooler, not the session pooler on 5432 that DEV uses. My read-only check worked through it. An apply rehearsal may not: transaction mode does not keep session state between statements, which migration tooling and backup tools can rely on. I recommend changing the port to 5432 before any rehearsal. The repo tooling accepts either port, so it would not catch this itself.

### Still needed for a 007A rehearsal

Nothing more from the environment file. Two items remain from earlier, both E2 work and not started:
- The tooling's evidence-path allowlist only accepts the APBM-003 module.
- The DEV block (`APBM_DEV_SUPABASE_URL`, `APBM_DEV_PUBLISHABLE_KEY`, `APBM_DEV_SECRET_KEY`) is needed only when the tooling runs against DEV. I did not check it in this task.

### Records

The check is in `SCRATCH_IDENTITY.md` in the evidence folder, and gap G5 in the report now reads "connection verified; rehearsal not run". The review ZIP is still revision 5 and does not include this. E2 remains held.
