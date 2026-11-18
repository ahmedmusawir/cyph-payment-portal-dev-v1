#!/usr/bin/env node
// APBM-007B — stored-state assertion after the production-build browser journeys (AC-030 "final rendered destination
// AND stored state"). cwd: Portal root. Read-only (SCRATCH service read + Stripe read).
//
//   node scripts/apbm007b/walk-state.mjs --help
//   node scripts/apbm007b/walk-state.mjs --cred /tmp/<proof cast>.json
//
// Reports for the proof account: current stores, store operations by kind/state, invitations by status, the SQL billable
// count and mirror quantity, and the live Stripe subscription quantity — and whether they agree. No credential is printed.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { scratchTarget, PORTAL } from './lib/env.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const cred = JSON.parse(readFileSync(args[args.indexOf('--cred') + 1], 'utf8'));
const sc = scratchTarget();
const { createClient } = createRequire(`${PORTAL}/package.json`)('@supabase/supabase-js');
const db = createClient(sc.url, sc.secretKey, { auth: { persistSession: false } });
const { stripe, read } = await import('./lib/stripe.mjs');
const stores = (await db.from('businesses').select('id,pharmacy_name,status,removal_effective_at,ownership_ended_at').eq('account_id', cred.accountId)).data;
const ops = (await db.from('store_operations').select('kind,state,last_error_code,amount_cents,invoice_id').eq('account_id', cred.accountId).order('created_at')).data;
const inv = (await db.from('store_invitations').select('role,status,dispatch_attempts').eq('account_id', cred.accountId)).data;
const billable = (await db.rpc('account_billable_count', { p_account: cred.accountId })).data;
const mirror = (await db.from('subscriptions').select('quantity').eq('account_id', cred.accountId).single()).data;
const sub = await read('walk-state', 'subscriptions.retrieve', () => stripe.subscriptions.retrieve(cred.subscription));
const out = { stores: stores.map((s) => ({ name: s.pharmacy_name.replace(cred.label, '<label>'), status: s.status, removal_scheduled: !!s.removal_effective_at, ended: !!s.ownership_ended_at })),
  operations: ops, invitations: inv, billable_count: billable, mirror_quantity: mirror?.quantity, provider_quantity: sub.items.data[0].quantity, provider_status: sub.status };
out.consistent = out.billable_count === out.provider_quantity && out.mirror_quantity === out.provider_quantity;
console.log(JSON.stringify(out, null, 1));
process.exitCode = out.consistent ? 0 : 1;
