// APBM-007B — integration tests reserve every provider/Auth effect in the cumulative E2 ledger (same file and ceilings as
// scripts/apbm007b/lib/effects.mjs). The ledger path is supplied by the runner; without it the tests refuse to run.
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.env.APBM007B_EFFECTS_DIR ?? '';
const CEILINGS: Record<string, number> = JSON.parse(process.env.APBM007B_EFFECT_CEILINGS ?? '{}');
const CLEANUP: Record<string, string> = { cleanup_customer_delete: 'stripe_customers', cleanup_subscription_cancel: 'stripe_subscriptions', cleanup_test_clock_delete: 'test_clocks' };
function locked<T>(fn: () => T): T {
  if (!DIR) throw new Error('FAIL-CLOSED: effect ledger not configured');
  mkdirSync(DIR, { recursive: true });
  const lock = join(DIR, '.lock');
  for (let i = 0; ; i++) { try { mkdirSync(lock); break; } catch { if (i > 400) throw new Error('ledger lock'); const t = Date.now() + 25; while (Date.now() < t) { /* spin */ } } }
  try { return fn(); } finally { try { rmdirSync(lock); } catch { /* gone */ } }
}
export function reserveForTest(op: string, charges: Record<string, number>): number {
  return locked(() => {
    const file = join(DIR, 'counters.json');
    const c = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { seq: 0, used: {} };
    for (const [k, n] of Object.entries(charges)) {
      if (k in CLEANUP) { if ((c.used[k] ?? 0) + n > (c.used[CLEANUP[k]] ?? 0)) throw new Error(`STOP: cleanup ${k} exceeds created`); continue; }
      if (!(k in CEILINGS)) throw new Error(`STOP: unknown counter ${k}`);
      if ((c.used[k] ?? 0) + n > CEILINGS[k]) throw new Error(`STOP: ceiling ${k}`);
    }
    for (const [k, n] of Object.entries(charges)) c.used[k] = (c.used[k] ?? 0) + n;
    c.seq += 1; c.updated = new Date().toISOString();
    writeFileSync(file, JSON.stringify(c, null, 1));
    appendFileSync(join(DIR, 'ledger.jsonl'), JSON.stringify({ seq: c.seq, at: c.updated, instrument: 'itest:apbm007b-store', op, charges, phase: 'reserved' }) + '\n');
    return c.seq;
  });
}
export function settleForTest(seq: number, outcome: Record<string, unknown>): void {
  locked(() => appendFileSync(join(DIR, 'ledger.jsonl'), JSON.stringify({ seq, at: new Date().toISOString(), phase: 'settled', outcome }) + '\n'));
}
