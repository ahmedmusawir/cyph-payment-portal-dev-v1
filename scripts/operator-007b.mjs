#!/usr/bin/env node
// APBM-007B — typed operator commands (SUPPORT_PROCEDURES.md; CONTRACTS/LIFECYCLE_AND_TRANSFER.md). cwd: Portal root.
//
//   node scripts/operator-007b.mjs --help
//   node scripts/operator-007b.mjs <action> --base <portal origin> [--<field> <value> ...]              # DRY RUN (default)
//   node scripts/operator-007b.mjs <action> --base <origin> ... --apply --actor "<name>" --reason "<text>" --ticket <ID>
//
// Actions and exact inputs (UUIDs only; no amounts, no SQL, no prefixes):
//   quantity-check            --account-id <uuid>                                  read-only facts (provider qty, billable, open ops)
//   store-operation-reconcile --operation-id <uuid> [--reconfirmation-ref <ref>]   re-run the same idempotent saga; a paid operation in
//                                                                                    attention resumes only with the owner's reconfirmation ref
//   store-operation-close     --operation-id <uuid> [--proof-ref <ref>]            terminal close ONLY on provider proof of full refund/credit;
//                                                                                    never refunds, never activates (BP-04)
//   store-transfer-authorize  --source-business-id <uuid> (--buyer-account-id <uuid> | --buyer-email <address>) [--effective-at <ISO>] [--hold-hours <1-168>]
//                                                                                    --buyer-email: a buyer with no account registers normally with exactly that email
//                                                                                    seller access ends at the effective time (default: seller period
//                                                                                    end); buyer may pay only from then (BP-03)
//   store-transfer-complete   --transfer-id <uuid>                                 at/after effective time: end source ownership, hold NPI for buyer
//   store-transfer-cancel     --transfer-id <uuid>                                 only before effective time and before buyer payment
//   owner-replace             --account-id <uuid> --new-owner-user-id <uuid>       verified same-account identity recovery (not a sale)
//   store-admin-set           --business-id <uuid> --user-id <uuid> [--former-admin-disposition member|remove]
//   removed-store-reactivate  --business-id <uuid>                                 authorization only; the owner then pays via Add Store and, after
//                                                                                    payment, gets the ORIGINAL record/history back (decision 9 approved)
//
// Authentication: the shared operator credential is the token derived from the server key in Portal .env.local (never sent
// raw, never printed). Every call is audited with authenticated_as='shared_operator_v1' and your DECLARED --actor; that is a
// declaration, not a verified individual identity (known staging limitation). --base is required (e.g. http://localhost:3101);
// add --key-source scratch for the SCRATCH proof pair.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { loadNamed, PORTAL, scratchTarget } from './apbm007b/lib/env.mjs';

const argv = process.argv.slice(2);
if (!argv.length || argv.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const action = argv[0];
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const base = opt('--base');
if (!base || !/^https?:\/\/[^/]+$/.test(base)) { console.error('FAIL-CLOSED: --base <origin> required'); process.exit(2); }
const camel = (s) => s.replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const body = { action, apply: argv.includes('--apply') };
for (let i = 1; i < argv.length; i++) {
  if (!argv[i].startsWith('--') || ['--base', '--apply', '--key-source'].includes(argv[i])) { if (argv[i] === '--key-source') i++; continue; }
  const v = argv[i + 1]; if (v === undefined || v.startsWith('--')) continue;
  body[camel(argv[i])] = ['--hold-hours'].includes(argv[i]) ? Number(v) : v; i++;
}
// --key-source portal (default): the server key of an app run with Portal .env.local (DEV target).
// --key-source scratch: the SCRATCH server key, for the proof pair (scripts/apbm007b/proof-serve.mjs).
const keySource = process.argv.includes('--key-source') ? process.argv[process.argv.indexOf('--key-source') + 1] : 'portal';
if (!['portal', 'scratch'].includes(keySource)) { console.error('FAIL-CLOSED: --key-source portal|scratch'); process.exit(2); }
const SUPABASE_SECRET_KEY = keySource === 'scratch' ? scratchTarget().secretKey : loadNamed(PORTAL, { required: ['SUPABASE_SECRET_KEY'] }).SUPABASE_SECRET_KEY;
const token = createHash('sha256').update(`${SUPABASE_SECRET_KEY}:apbm007a-operator-v1`).digest('hex');
const res = await fetch(`${base}/api/operator/007b`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify(body) });
console.log(JSON.stringify({ http: res.status, ...(await res.json().catch(() => ({}))) }, null, 1));
process.exitCode = res.ok ? 0 : 1;
