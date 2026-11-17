#!/usr/bin/env node
// APBM-007B — read-only role checks for O-1 store A1 after invitation acceptance. Each check runs as that person (JWT claims)
// inside a transaction that is ROLLED BACK; no email is sent (SQL never dispatches mail). Prints roles, never addresses.
import { readFileSync } from 'node:fs'; import { homedir } from 'node:os'; import { createRequire } from 'node:module';
const P = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { scratchTarget } = await import(`${P}/scripts/apbm007b/lib/env.mjs`);
const pg = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/package.json')('pg');
const st = JSON.parse(readFileSync(`${P}/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/E2/r03/O1/o1r03/state.json`, 'utf8'));
const cast = JSON.parse(readFileSync(`${homedir()}/.apbm007b/engineering_cast.json`, 'utf8'));
const store = st.A.stores[0].id, other = st.A.stores[1].id; const sc = scratchTarget();
const c = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false } }); await c.connect();
const uid = async (r) => (await c.query('select id, last_sign_in_at from auth.users where lower(email) = $1', [cast[r].email.toLowerCase()])).rows[0];
const asUser = async (id, sql, params) => { await c.query('begin'); try { await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: id, role: 'authenticated', email: undefined })]); await c.query('set local role authenticated');
  return { rows: (await c.query(sql, params)).rows }; } catch (e) { return { error: e.code }; } finally { await c.query('rollback'); } };
const out = {};
const inv = (await c.query('select role, accepted_user_id from public.store_invitations where business_id = $1 and status = $2', [store, 'accepted'])).rows;
out.admins_on_store = Number((await c.query(`select count(*) from public.user_businesses where business_id = $1 and role = 'admin'`, [store])).rows[0].count);
for (const r of ['ENGINEERING_MEMBER', 'ENGINEERING_ADMIN', 'ENGINEERING_OWNER_A']) {
  const u = await uid(r); const x = {};
  x.signed_in_after_resend = !!u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date('2026-11-17T04:39:00Z');
  x.accepted_by_this_identity = inv.filter((i) => i.accepted_user_id === u.id).map((i) => i.role);
  const ids = await asUser(u.id, 'select array_agg(id) a from public.my_business_ids() id');
  x.sees_A1 = (ids.rows?.[0]?.a ?? []).includes(store); x.sees_A2 = (ids.rows?.[0]?.a ?? []).includes(other);
  const reads = await asUser(u.id, `select public.owedbook_rows($1,'summary') j`, [store]); x.reads_A1_records = reads.error ? `denied ${reads.error}` : 'allowed';
  const im = await asUser(u.id, `select public.invitation_create($1,'role-check-member@apbm007b-proof.invalid','member',null) r`, [store]);
  x.can_create_member_invite = im.error ? `denied ${im.error}` : (im.rows[0].r?.error ? `refused ${im.rows[0].r.error}` : 'allowed (rolled back)');
  const ia = await asUser(u.id, `select public.invitation_create($1,'role-check-admin@apbm007b-proof.invalid','admin','member') r`, [store]);
  x.can_create_admin_invite = ia.error ? `denied ${ia.error}` : (ia.rows[0].r?.error ? `refused ${ia.rows[0].r.error}` : 'allowed (rolled back)');
  const bill = await asUser(u.id, 'select public.owner_billing_overview() r'); x.owner_billing = bill.error ? `denied ${bill.error}` : (bill.rows[0].r?.error ? `refused ${bill.rows[0].r.error}` : 'available');
  out[r] = x;
}
out.account_owner_is_owner_a = (await c.query('select owner_user_id from public.accounts where id = $1', [st.A.account])).rows[0].owner_user_id === (await uid('ENGINEERING_OWNER_A')).id;
await c.end(); console.log(JSON.stringify(out, null, 1));
