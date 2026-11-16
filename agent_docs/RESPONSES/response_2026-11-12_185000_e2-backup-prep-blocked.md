## Backup preparation — two things needed from you before I can dump or restore

I have not taken the backup or touched SCRATCH yet. The install needs your password, and a faithful restore rehearsal needs more identities than the ceiling allows, so I am returning the one extension request first, as you instructed. The email stub proof is done.

### 1. Install command (needs your terminal)

`sudo` asks for a password here, and Ubuntu 24.04 only carries client 16, which cannot dump a version 17 server. These three commands add the official PostgreSQL repository and install client 17:

```bash
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
sudo apt install -y postgresql-client-17
```

Afterwards the tools are at `/usr/lib/postgresql/17/bin/`. Tell me when it is done and I will verify the versions.

### 2. Extension request for the restore rehearsal

**The problem.** Stores, accounts, memberships, roles and profiles on DEV all point at Auth users. A restore of DEV's data onto SCRATCH only holds together if DEV's 16 Auth users are restored there too. SCRATCH does not have them, and restoring them is creating identities on SCRATCH, which the ceiling (12 of 12 used) forbids.

**Exact minimum request:** allow **16 restored Auth identity rows on SCRATCH**, inserted by SQL from the DEV backup, for this rehearsal only.

What that involves, so you can decide with the facts:
- They are copies of DEV's existing 16 users, not new people: the 7 seeded cast, the 4 E1 test identities and 5 older accounts.
- Each row carries its stored password hash and address. That means copying credential hashes from DEV into the SCRATCH project. No session or refresh token is copied, so nobody is signed in by it.
- SCRATCH's current 25 test identities would be deleted first, since 7 of them share addresses with DEV's cast.
- I checked read-only that the restore role can insert these rows on SCRATCH and that both projects' user tables have the same 35 columns.
- No email, no sign-out and no Stripe call is needed. It uses the fourth and last SCRATCH cycle.

**If you would rather not extend:** I can restore only the `public` schema and the migration ledger. Table contents, functions, policies and grants would be verified, but the links to Auth users could not be recreated, so I would report it as a partial restore and not as recovery. It would also use the last SCRATCH cycle, so I would not be able to do the full version afterwards without another cycle.

### 3. Email stub — proved

Before any rerun, as you required:
- **Control:** with nothing replaced, the real access-email path does issue the provider's mail request. A network tripwire caught it inside the test process; nothing was sent.
- **With the replacement the integration test uses:** the stand-in is called once with the right address and landing page, and no mail request is made at all.
- **Tripwire:** the integration test now refuses every mail-sending Auth endpoint at the network boundary, independent of any stub, and checks both guards before its first real step.

That is 8 new tests in `src/__tests__/apbm007a-mail-guard.test.ts`; the portal suite is 379 of 379. I have not rerun the integration test and will not: it creates identities, and the ceiling is reached.

### Recorded

Your rulings are in `APBM_RULINGS.md`: option A, the 12 SCRATCH identities count, DEV apply held, no deployment before 007B. No effect of any kind was dispatched in this turn beyond read-only checks on DEV and SCRATCH.

### After your two answers

Verify tool versions → private DEV dump with a written scope → restore on SCRATCH → verify → updated bundle and the sanitized apply-review ZIP.
