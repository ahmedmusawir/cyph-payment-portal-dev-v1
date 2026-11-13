## SCRATCH re-verified and all 52 migrations match — but the URL is still on port 6543

The connection, identity and full ledger comparison all pass. The port change has not reached the file I read: `APBM_SCRATCH_DB_URL` in OwedBook's `.env.local` still parses to port 6543, and that file was last modified at 12:12 today, before my earlier check.

### Connection and identity

| Check | Result |
|---|---|
| Connection | Opened first time, inside a read-only transaction that was rolled back |
| Project reference in the URL | Equals the recorded `ihgcsrypblqkwommrkgj`; differs from DEV |
| Database cluster | Same cluster as my earlier SCRATCH check; different from DEV |
| Host and port | Pooler host, port **6543** |

### Migration ledger against source

There is no separate manifest file in the repo, so the source side is the 52 files in `supabase/migrations`, which are unmodified at HEAD `bc4e433`. I hashed each file and compared it with the ledger row of the same name.

| Check | Result |
|---|---|
| Ledger rows | 52 |
| Source files | 52 |
| Name and SHA-256 both equal | 52 of 52 |
| In source but missing from the ledger | None |
| In the ledger but not in source | None |
| Checksum mismatches | None |
| Range | `0001_baseline_acknowledge.sql` to `0052_system_config.sql` |
| Applied on SCRATCH | 9 November 2026, 10:05–10:06 Asia/Dhaka |

SCRATCH and DEV therefore both record the same 52 migrations with the same checksums. `0053` is the next free number on both.

### The port

Most likely the edit is unsaved in the editor, or it went into a different file. Once the saved file shows 5432, I can rerun the same check; it takes a few seconds. The ledger result above does not depend on the port.

### Records

Appended to `SCRATCH_IDENTITY.md` in the evidence folder; gap G5 updated. Nothing was applied, reset, seeded or restored, no Git state changed and no server was started. The review ZIP is still revision 5. E2 remains held.
