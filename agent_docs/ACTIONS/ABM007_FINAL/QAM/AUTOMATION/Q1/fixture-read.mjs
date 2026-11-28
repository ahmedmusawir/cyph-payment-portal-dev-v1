import {createRequire} from 'node:module';import {readFileSync,writeFileSync} from 'node:fs';
import {scratchTarget} from '../../../../../..//scripts/apbm007b/lib/env.mjs';
const sc=scratchTarget();const pg=createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/package.json')('pg');const c=new pg.Client({connectionString:sc.dbUrl,ssl:{rejectUnauthorized:false},connectionTimeoutMillis:15000,statement_timeout:15000});const out={};
try{await c.connect();await c.query('begin read only');const cast=JSON.parse(readFileSync(process.env.HOME+'/.apbm007b/engineering_cast.json'));for(const [role,v] of Object.entries(cast)){if(!role.startsWith('ENGINEERING_'))continue;const u=(await c.query('select id from auth.users where lower(email)=lower($1)',[v.email])).rows[0];if(!u){out[role]={exists:false};continue;}
const stores=(await c.query('select b.id,b.status from businesses b join accounts a on a.id=b.account_id where a.owner_user_id=$1',[u.id])).rows;
const memberships=(await c.query('select role,count(*)::int count from user_businesses where user_id=$1 group by role',[u.id])).rows;
const audits=(await c.query('select count(*)::int count from audit_logs where business_id=any($1::uuid[])',[stores.map(s=>s.id)])).rows[0];
const invites=(await c.query('select status,count(*)::int count from store_invitations where business_id=any($1::uuid[]) group by status',[stores.map(s=>s.id)])).rows;
out[role]={exists:true,ownedStores:stores.length,storeStatuses:stores.map(s=>s.status),memberships,auditCount:audits.count,invitations:invites,passwordAvailable:!!v.password,inboxKnownAccessible:false,emailUsesInvalidDomain:/\.invalid$/i.test(v.email)};
}await c.query('rollback');}catch(err){out.failure={code:err.code||'unknown'};}finally{await c.end();}writeFileSync(new URL('../../evidence/Q1/02/fixtures.json',import.meta.url),JSON.stringify(out,null,2));console.log(JSON.stringify(out));
