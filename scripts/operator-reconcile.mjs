#!/usr/bin/env node
// APBM007A — operator recovery command for a paid-but-not-set-up registration (AC-038).
//
//   node scripts/operator-reconcile.mjs --list                       # unresolved operations, plus unfinished/suspect Stripe events
//   node scripts/operator-reconcile.mjs --operation <operation UUID> # re-run the same idempotent transition for ONE operation
//   node scripts/operator-reconcile.mjs --event <evt_ ID>            # re-run ONE recorded Stripe event (F-Q1-01); prints before/after
//   options: --base http://localhost:3001 (default)
//
// It talks to the running portal. The token is derived from the server key in .env.local; the key itself is never
// sent or printed. It cannot charge, choose an outcome, or change an owner: it asks the portal to read Stripe again
// and apply what is true. Use it when a webhook was missed or setup stopped part-way.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const env = dotenv.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local')));
const arg = (n) => { const i = process.argv.indexOf(n); return i < 0 ? undefined : process.argv[i + 1]; };
const base = (arg('--base') || 'http://localhost:3001').replace(/\/+$/, '');
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base) && !/^https:\/\/owedbook-payment\.cyberizedev\.com$/.test(base)) { console.error('STOP: --base must be the local or staging portal'); process.exit(1); }
if (!env.SUPABASE_SECRET_KEY) { console.error('STOP: server key not configured'); process.exit(1); }
const token = createHash('sha256').update(`${env.SUPABASE_SECRET_KEY}:apbm007a-operator-v1`).digest('hex');
const call = async (init) => { const r = await fetch(`${base}/api/operator/operations`, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(60_000) }); return { status: r.status, body: await r.json().catch(() => ({})) }; };

const operation = arg('--operation'), eventId = arg('--event');
if (process.argv.includes('--list')) console.log(JSON.stringify(await call({ method: 'GET' }), null, 2));
else if (operation) console.log(JSON.stringify(await call({ method: 'POST', body: JSON.stringify({ operationId: operation }) }), null, 2));
else if (eventId) console.log(JSON.stringify(await call({ method: 'POST', body: JSON.stringify({ eventId }) }), null, 2));
else { console.error('usage: --list | --operation <operation UUID> | --event <evt_ ID> [--base http://localhost:3001]'); process.exit(1); }
