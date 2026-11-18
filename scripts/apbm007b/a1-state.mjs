// Read-only snapshot of O-1 store A1 staff state, by ROLE (no addresses printed).
import { readFileSync } from 'node:fs'; import { homedir } from 'node:os'; import { createRequire } from 'node:module';
const P = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { scratchTarget } = await import(`${P}/scripts/apbm007b/lib/env.mjs`);
const { createClient } = createRequire(`${P}/package.json`)('@supabase/supabase-js');
const sc = scratchTarget(); const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
const st = JSON.parse(readFileSync(`${P}/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/EVIDENCE/E2/r03/O1/o1r03/state.json`, 'utf8'));
const cast = JSON.parse(readFileSync(`${homedir()}/.apbm007b/engineering_cast.json`, 'utf8'));
const store = st.A.stores[0].id; const users = {};
for (let p = 1; p < 10; p++) { const r = await db.auth.admin.listUsers({ page: p, perPage: 200 }); for (const u of r.data.users) users[u.id] = (u.email || '').toLowerCase(); if (r.data.users.length < 200) break; }
const roleOf = (uid) => Object.entries(cast).find(([, v]) => v.email.toLowerCase() === users[uid])?.[0] ?? 'other';
const ids = Object.fromEntries(['ENGINEERING_MEMBER', 'ENGINEERING_ADMIN'].map((r) => [r, Object.entries(users).find(([, e]) => e === cast[r].email.toLowerCase())?.[0] ?? null]));
const members = (await db.from('user_businesses').select('user_id,role,is_primary').eq('business_id', store)).data.map((m) => ({ who: roleOf(m.user_id), role: m.role }));
const inv = (await db.from('store_invitations').select('role,status,email,dispatch_attempts,former_admin_disposition,accepted_at,status_reason').eq('business_id', store).order('created_at')).data
  .map((i) => ({ who: Object.entries(cast).find(([, v]) => v.email.toLowerCase() === i.email)?.[0] ?? 'synthetic', role: i.role, status: i.status, dispatches: i.dispatch_attempts, disposition: i.former_admin_disposition, accepted_at: i.accepted_at, reason: i.status_reason }));
const owner = (await db.from('accounts').select('owner_user_id').eq('id', st.A.account).single()).data.owner_user_id;
const access = (await db.rpc('account_access_state', { p_account: st.A.account })).data?.state;
console.log(JSON.stringify({ at: new Date().toISOString(), store: 'O-1 A1', account_owner: roleOf(owner), account_access: access, identities_exist: Object.fromEntries(Object.entries(ids).map(([k, v]) => [k, !!v])), members, invitations: inv }, null, 1));
