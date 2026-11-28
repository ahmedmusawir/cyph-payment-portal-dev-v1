#!/usr/bin/env node
// ABM007_FINAL E2 — READ-ONLY check of the existing APBM-007B engineering cast on SCRATCH (ruling AM-14).
// Target: SCRATCH only, verified by API and SQL reference through scripts/apbm007b/lib/env.mjs (fails closed for DEV or
// anything else). Cast: ~/.apbm007b/engineering_cast.json (0600, private, never in a repo). Prints roles, booleans,
// counts and non-secret role names only: never an address, password, hash, token or key. One read-only transaction.
import { readFileSync, statSync } from 'node:fs'; import { homedir } from 'node:os'; import { createRequire } from 'node:module';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { scratchTarget, SCRATCH_REF, DEV_REF } = await import(`${PORTAL}/scripts/apbm007b/lib/env.mjs`);
const CAST = `${homedir()}/.apbm007b/engineering_cast.json`;
if ((statSync(CAST).mode & 0o077) !== 0) throw new Error('FAIL-CLOSED: cast file must be 0600');
const cast = JSON.parse(readFileSync(CAST, 'utf8'));
const sc = scratchTarget(); if (sc.ref !== SCRATCH_REF || sc.ref === DEV_REF) throw new Error('FAIL-CLOSED: not SCRATCH');
const pg = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/package.json')('pg');
const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false }, statement_timeout: 30000 }); await c.connect();
await c.query('begin read only');
const out = { target: sc.ref, at: new Date().toISOString(), migrations: null, roles: {} };
try { out.migrations = (await c.query("select max(version) v, count(*) n from supabase_migrations.schema_migrations")).rows[0]; } catch (e) { out.migrations = { error: e.code }; }
for (const [role, v] of Object.entries(cast)) {
  const u = (await c.query('select id, email_confirmed_at is not null confirmed, encrypted_password is not null and encrypted_password <> \'\' has_password, banned_until from auth.users where lower(email) = $1', [String(v.email).toLowerCase()])).rows[0];
  if (!u) { out.roles[role] = { exists: false, cast_has_password: !!v.password }; continue; }
  const m = (await c.query('select role, count(*)::int n from public.user_businesses where user_id = $1 group by role', [u.id])).rows;
  const owns = Number((await c.query('select count(*) from public.accounts where owner_user_id = $1', [u.id])).rows[0].count);
  out.roles[role] = { exists: true, confirmed: u.confirmed, has_password: u.has_password, cast_has_password: !!v.password, banned: !!u.banned_until, owns_accounts: owns, memberships: Object.fromEntries(m.map((r) => [r.role, r.n])) };
}
await c.query('rollback'); await c.end();
console.log(JSON.stringify(out, null, 1));
