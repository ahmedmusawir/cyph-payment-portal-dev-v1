// APBM-007B — Stripe access for instruments: pinned API version from the app source, test key only, no SDK retries,
// every mutation reserved in the cumulative effect ledger before it is sent, reads recorded observationally.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { PORTAL, stripeTarget, scrub } from './env.mjs';
import { reserve, settle, observe } from './effects.mjs';

const require = createRequire(`${PORTAL}/package.json`);
const Stripe = require('stripe');
export const API_VERSION = /STRIPE_API_VERSION = '([^']+)'/.exec(readFileSync(`${PORTAL}/src/server/stripeClient.ts`, 'utf8'))[1];
export const SDK_VERSION = JSON.parse(readFileSync(`${PORTAL}/node_modules/stripe/package.json`, 'utf8')).version;
export const CONFIG = stripeTarget();
export const stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY, { apiVersion: API_VERSION, timeout: 30_000, maxNetworkRetries: 0 });

const ids = (o) => {
  if (!o || typeof o !== 'object') return null;
  const out = {};
  for (const k of ['id', 'object', 'status', 'customer', 'subscription', 'amount_due', 'amount_paid', 'total', 'quantity', 'frozen_time']) {
    const v = o[k]; if (v !== undefined && v !== null) out[k] = typeof v === 'object' ? v.id ?? null : v;
  }
  return out;
};

/** Read: logged, not capped. */
export async function read(instrument, op, fn) {
  try { const r = await fn(); observe(instrument, op, { ok: true, request_id: r?.lastResponse?.requestId ?? null, object: ids(r) }); return r; }
  catch (e) { observe(instrument, op, { ok: false, type: e.type, code: e.code, status: e.statusCode }); throw e; }
}

/**
 * Mutation: reserve `charges` first (throws before sending if any ceiling would be exceeded), send once with the given
 * idempotency key, settle with the outcome. Never retried here; the caller reconciles an uncertain outcome by reading.
 */
export async function mutate(instrument, op, charges, fn, { idem } = {}) {
  const seq = reserve(instrument, op, charges, { idempotency_key: idem ?? null });
  try {
    const r = await fn(idem ? { idempotencyKey: idem } : undefined);
    settle(seq, { ok: true, request_id: r?.lastResponse?.requestId ?? null, object: ids(r) });
    return r;
  } catch (e) {
    const err = { ok: false, type: e.type, code: e.code, decline_code: e.decline_code, status: e.statusCode, param: e.param, message: scrub(String(e.message || '')).slice(0, 240), request_id: e.requestId };
    settle(seq, err);
    const x = new Error(`${op}: ${e.type || ''} ${e.code || ''}`.trim()); x.provider = err; throw x;
  }
}

/** Delivery isolation facts: registered v1 endpoints, v2 event destinations, local listener processes. */
export async function deliveryPaths(instrument) {
  const eps = await read(instrument, 'webhookEndpoints.list', () => stripe.webhookEndpoints.list({ limit: 100 }));
  let dest; try { dest = (await read(instrument, 'v2.core.eventDestinations.list', () => stripe.v2.core.eventDestinations.list({ limit: 100 }))).data.length; } catch { dest = 'unreadable'; }
  const { execSync } = await import('node:child_process');
  // Processes whose executable is the Stripe CLI running `listen` (exact comm match, so this check never counts itself).
  let listeners = 0; try { listeners = execSync('ps -eo comm=,args=', { encoding: 'utf8' }).split('\n').filter((l) => /^stripe\s/.test(l) && /\slisten\b/.test(l)).length; } catch { listeners = -1; }
  return { webhook_endpoints: eps.data.map((e) => { let u; try { u = new URL(e.url); } catch { u = null; } return { id: e.id, status: e.status, host: u?.host ?? 'unparsed' }; }), event_destinations: dest, local_stripe_listeners: listeners };
}
