// APBM-007B — cumulative E2 effect ledger (ENVIRONMENT_AND_EFFECTS.md "Cumulative hard limits").
// One ledger for the whole E2 release, shared by every instrument. A counter is checked and incremented BEFORE the
// effect is attempted, failed and uncertain attempts count, and counters are never reset, aliased or raised here.
// Persisted under the module evidence lane; a directory lock serializes concurrent instruments.
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EVIDENCE_ROOT, scrub } from './env.mjs';

export let EFFECTS_DIR = join(EVIDENCE_ROOT, 'effects');
let COUNTERS = join(EFFECTS_DIR, 'counters.json');
let LEDGER = join(EFFECTS_DIR, 'ledger.jsonl');
let LOCK = join(EFFECTS_DIR, '.lock');
/** Self-test only: point the ledger at a throwaway directory so no real counter moves. */
export function useLedgerDirForSelfTest(dir) {
  if (!dir.startsWith('/tmp/')) throw new Error('FAIL-CLOSED: self-test ledger must be under /tmp');
  EFFECTS_DIR = dir; COUNTERS = join(dir, 'counters.json'); LEDGER = join(dir, 'ledger.jsonl'); LOCK = join(dir, '.lock');
}

/** The envelope's ceilings, verbatim in meaning. Cleanup budgets are separate and bounded by what was created. */
export const CEILINGS = Object.freeze({
  scratch_chain_cycles: 12,
  scratch_auth_identities: 14,
  dev_auth_identities: 0,
  stripe_customers: 13,                 // Director amendment 17 Nov 2026 (was 12)
  stripe_subscriptions: 13,             // Director amendment 17 Nov 2026 (was 12)
  test_clocks: 4,
  test_clock_advances: 30,
  invoice_create: 30,
  invoiceitem_create: 30,
  invoice_finalize: 30,
  invoice_void: 30,
  invoice_pay_or_hosted: 30,          // Director amendment 17 Nov 2026 (was 24)
  payment_attempts: 60,
  payment_attempt_cents: 480_000,     // Director amendment 17 Nov 2026: USD 4,800 (was USD 3,000)
  subscription_mutations: 50,
  payment_method_attach: 24,
  default_card_changes: 30,
  apa_redemptions: 3,
  email_dispatch: 24,
  fixture_app_mutations: 400,
  dev_live_apply: 1,
  dev_forward_fix: 1,
});
// Cleanup may never exceed what this run created (checked at use).
export const CLEANUP = Object.freeze({ cleanup_test_clock_delete: 'test_clocks', cleanup_customer_delete: 'stripe_customers', cleanup_subscription_cancel: 'stripe_subscriptions' });

function lock() {
  mkdirSync(EFFECTS_DIR, { recursive: true });
  for (let i = 0; i < 200; i++) {
    try { mkdirSync(LOCK); return; } catch { const t = Date.now() + 25; while (Date.now() < t) { /* spin */ } }
  }
  throw new Error('FAIL-CLOSED: effect ledger lock not acquired');
}
const unlock = () => { try { rmdirSync(LOCK); } catch { /* already gone */ } };
export function counters() {
  return existsSync(COUNTERS) ? JSON.parse(readFileSync(COUNTERS, 'utf8')) : { created: new Date().toISOString(), seq: 0, used: {} };
}

/**
 * Reserve one effect before attempting it. `charges` is an object of counter→amount (e.g. {invoice_pay_or_hosted:1,
 * payment_attempts:1, payment_attempt_cents:4900}). Throws, writing nothing, if ANY counter would exceed its ceiling.
 * Returns the ledger sequence number; call `settle(seq, outcome)` afterwards.
 */
export function reserve(instrument, op, charges, detail = {}) {
  lock();
  try {
    const c = counters();
    for (const [k, n] of Object.entries(charges)) {
      if (k in CLEANUP) {
        const created = c.used[CLEANUP[k]] ?? 0;
        if ((c.used[k] ?? 0) + n > created) throw new Error(`STOP: cleanup ${k} would exceed created ${CLEANUP[k]}`);
        continue;
      }
      if (!(k in CEILINGS)) throw new Error(`STOP: unknown effect counter ${k}`);
      if ((c.used[k] ?? 0) + n > CEILINGS[k]) throw new Error(`STOP: ceiling ${k} (${CEILINGS[k]}) would be exceeded`);
    }
    for (const [k, n] of Object.entries(charges)) c.used[k] = (c.used[k] ?? 0) + n;
    c.seq += 1; c.updated = new Date().toISOString();
    writeFileSync(COUNTERS, JSON.stringify(c, null, 1));
    appendFileSync(LEDGER, JSON.stringify({ seq: c.seq, at: c.updated, instrument, op: scrub(op), charges, phase: 'reserved', detail: JSON.parse(scrub(JSON.stringify(detail))) }) + '\n');
    return c.seq;
  } finally { unlock(); }
}
export function settle(seq, outcome) {
  lock();
  try { appendFileSync(LEDGER, JSON.stringify({ seq, at: new Date().toISOString(), phase: 'settled', outcome: JSON.parse(scrub(JSON.stringify(outcome ?? null))) }) + '\n'); }
  finally { unlock(); }
}
/** Observational read record (not capped). */
export function observe(instrument, op, outcome) {
  lock();
  try { appendFileSync(LEDGER, JSON.stringify({ at: new Date().toISOString(), instrument, op: scrub(op), phase: 'read', outcome: JSON.parse(scrub(JSON.stringify(outcome ?? null))) }) + '\n'); }
  finally { unlock(); }
}
export function remaining() {
  const c = counters();
  return Object.fromEntries(Object.entries(CEILINGS).map(([k, v]) => [k, { ceiling: v, used: c.used[k] ?? 0, left: v - (c.used[k] ?? 0) }]));
}
