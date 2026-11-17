#!/usr/bin/env node
// APBM-007B — owned local job runner for POST /api/internal/jobs/run (expiry every minute; notices due). cwd: Portal root.
//
//   node scripts/apbm007b/jobs-run.mjs --help
//   node scripts/apbm007b/jobs-run.mjs --base <portal origin> [--once | --every 60]
//
// Authenticates with the token derived from the server key in Portal .env.local (never sent raw or printed). Staging uses
// an authenticated Cloud Scheduler job with the same contract instead of this runner. Each run prints the job report.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { loadNamed, PORTAL, scratchTarget } from './lib/env.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const base = args[args.indexOf('--base') + 1];
if (!base || !/^https?:\/\/[^/]+$/.test(base)) { console.error('FAIL-CLOSED: --base <origin> required'); process.exit(2); }
const every = args.includes('--every') ? Math.max(30, Number(args[args.indexOf('--every') + 1])) : null;
// --key-source portal (default): the server key of an app run with Portal .env.local (DEV target).
// --key-source scratch: the SCRATCH server key, for the proof pair (scripts/apbm007b/proof-serve.mjs).
const keySource = process.argv.includes('--key-source') ? process.argv[process.argv.indexOf('--key-source') + 1] : 'portal';
if (!['portal', 'scratch'].includes(keySource)) { console.error('FAIL-CLOSED: --key-source portal|scratch'); process.exit(2); }
const SUPABASE_SECRET_KEY = keySource === 'scratch' ? scratchTarget().secretKey : loadNamed(PORTAL, { required: ['SUPABASE_SECRET_KEY'] }).SUPABASE_SECRET_KEY;
const token = createHash('sha256').update(`${SUPABASE_SECRET_KEY}:apbm007a-operator-v1`).digest('hex');
const once = async () => { const r = await fetch(`${base}/api/internal/jobs/run`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); console.log(JSON.stringify({ http: r.status, ...(await r.json().catch(() => ({}))) })); };
await once();
if (every && !args.includes('--once')) setInterval(() => void once().catch((e) => console.error(`[jobs-run] ${e.name}`)), every * 1000);
