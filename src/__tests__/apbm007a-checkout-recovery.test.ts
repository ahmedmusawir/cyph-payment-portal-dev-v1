/** @jest-environment node */
// APBM007A F-Q4-001 (AC-011) — a checkout attempt whose provider answer is lost. The real checkout and registration
// modules run against an in-memory model of the operation and draft tables (unique idempotency key, one open operation
// per draft, as in 0057) and a modelled Stripe that behaves like the real one where it matters here:
//   - an idempotency key repeated with identical parameters returns the saved original answer (a stale snapshot);
//   - the same key with different parameters is refused, and a key still in flight is a conflict;
//   - a request rejected in validation (an expires_at too close) is not saved under its key;
//   - "lost" means Stripe created and saved the object, then the answer never reached the portal.
// Nothing here calls a network, a database or a live provider.
import { createHash } from 'node:crypto';

type Row = Record<string, unknown>;
const tables: Record<string, Row[]> = { registration_drafts: [], checkout_operations: [], accounts: [] };
const rpcCalls: { fn: string; args: Row }[] = [];
let seq = 0;
const OPEN = ['created', 'checkout_open', 'paid', 'provisioning', 'attention'];
function builder(table: string) {
  const filters: [string, unknown][] = [];
  let mode: 'select' | 'insert' | 'update' = 'select';
  let payload: Row = {};
  let order: { key: string; asc: boolean } | null = null;
  let lim = Infinity;
  const rows = () => tables[table];
  const match = () => rows().filter((r) => filters.every(([k, v]) => r[k] === v));
  const run = (): { data: unknown; error: { code: string } | null } => {
    if (mode === 'insert') {
      if (table === 'checkout_operations') {
        if (rows().some((r) => r.idempotency_key === payload.idempotency_key)) return { data: null, error: { code: '23505' } };
        if (rows().some((r) => r.draft_id === payload.draft_id && OPEN.includes(r.status as string))) return { data: null, error: { code: '23505' } };
        const row: Row = {
          id: `op-${++seq}`, status: 'created', created_at: seq, stripe_customer_id: null, stripe_checkout_session_id: null, stripe_subscription_id: null,
          stripe_invoice_id: null, checkout_expires_at: null, owner_user_id: null, owner_was_existing: null, account_id: null, business_id: null, last_error_code: null, ...payload,
        };
        rows().push(row);
        return { data: [{ ...row }], error: null };
      }
      rows().push({ ...payload });
      return { data: [{ ...payload }], error: null };
    }
    if (mode === 'update') {
      const hit = match();
      hit.forEach((r) => Object.assign(r, payload));
      return { data: hit.map((r) => ({ ...r })), error: null };
    }
    let out = match().map((r) => ({ ...r }));
    if (order) out = out.sort((a, b) => ((a[order!.key] as number) - (b[order!.key] as number)) * (order!.asc ? 1 : -1));
    return { data: out.slice(0, lim), error: null };
  };
  const first = () => { const r = run(); return { data: Array.isArray(r.data) ? r.data[0] ?? null : r.data, error: r.error }; };
  const api: Record<string, unknown> = {
    select: () => api, insert: (p: Row) => { mode = 'insert'; payload = p; return api; }, update: (p: Row) => { mode = 'update'; payload = p; return api; },
    eq: (k: string, v: unknown) => { filters.push([k, v]); return api; },
    order: (k: string, o?: { ascending?: boolean }) => { order = { key: k, asc: !!o?.ascending }; return api; },
    limit: (n: number) => { lim = n; return api; },
    maybeSingle: async () => first(), single: async () => first(),
    then: (ok: (v: unknown) => unknown, bad?: (e: unknown) => unknown) => Promise.resolve(run()).then(ok, bad),
  };
  return api;
}
let bindOutcome = 'bound';
jest.mock('@/server/db', () => ({
  admin: () => ({ from: (t: string) => builder(t) }),
  rpc: async (fn: string, args: Row) => {
    rpcCalls.push({ fn, args });
    if (fn === 'npi_reserve') return [{ outcome: 'held', reservation_id: 'res-1', blocking_operation_id: null }];
    if (fn === 'npi_bind') return bindOutcome;
    if (fn === 'npi_release_unpaid') return 'released';
    return null;
  },
  bytea: (b: Buffer) => '\\x' + b.toString('hex'),
}));

// ── modelled Stripe ──
const err = (type: string, message: string, param?: string) => Object.assign(new Error(message), { type, param });
interface Saved { params: string; result?: Row; inFlight: boolean }
const P = {
  customers: new Map<string, Row>(), sessions: new Map<string, Row>(), keys: new Map<string, Saved>(),
  createCalls: { customer: 0, session: 0 }, lose: null as null | { kind: 'customer' | 'session'; when: 'after' | 'before' }, n: 0,
};
async function idem(kind: 'customer' | 'session', key: string, params: Row, make: () => Row): Promise<Row> {
  P.createCalls[kind]++;
  if (P.lose?.kind === kind && P.lose.when === 'before') { P.lose = null; throw err('StripeConnectionError', 'request never reached Stripe'); }
  const fp = JSON.stringify(params);
  const saved = P.keys.get(key);
  if (saved?.inFlight) throw err('StripeIdempotencyError', 'a request with this key is in progress');
  if (saved) {
    if (saved.params !== fp) throw err('StripeIdempotencyError', 'key reused with different parameters');
    return { ...saved.result! };
  }
  const entry: Saved = { params: fp, inFlight: true };
  P.keys.set(key, entry);
  await Promise.resolve();
  let result: Row;
  try { result = make(); } catch (e) { P.keys.delete(key); throw e; }   // rejected in validation: nothing saved
  entry.result = { ...result }; entry.inFlight = false;
  if (P.lose?.kind === kind && P.lose.when === 'after') { P.lose = null; throw err('StripeConnectionError', 'answer lost after Stripe created the object'); }
  return { ...result };
}
const nowS = () => Math.floor(Date.now() / 1000);
const live = (id: string) => {
  const s = P.sessions.get(id);
  if (s && s.status === 'open' && nowS() >= (s.expires_at as number)) s.status = 'expired';
  return s;
};
const fakeStripe = {
  accounts: { retrieveCurrent: async () => ({ id: 'acct_unit' }) },
  customers: {
    create: (params: Row, o: { idempotencyKey: string }) => idem('customer', o.idempotencyKey, params, () => {
      const c = { id: `cus_M${++P.n}`, object: 'customer', ...params };
      P.customers.set(c.id, c);
      return c;
    }),
  },
  checkout: {
    sessions: {
      create: (params: Row, o: { idempotencyKey: string }) => idem('session', o.idempotencyKey, params, () => {
        const exp = params.expires_at as number;
        if (exp < nowS() + 30 * 60 || exp > nowS() + 24 * 3600) throw err('StripeInvalidRequestError', 'expires_at must be 30 minutes to 24 hours ahead', 'expires_at');
        if (!P.customers.has(params.customer as string)) throw err('StripeInvalidRequestError', 'no such customer', 'customer');
        const id = `cs_test_M${++P.n}`;
        const s = {
          id, object: 'checkout.session', url: `https://checkout.stripe.test/c/pay/${id}`, status: 'open', payment_status: 'unpaid',
          amount_total: params.discounts ? 8910 : 9900, currency: 'usd', livemode: false, customer: params.customer,
          client_reference_id: params.client_reference_id, metadata: params.metadata, expires_at: exp,
        };
        P.sessions.set(id, s);
        return s;
      }),
      retrieve: async (id: string) => { const s = live(id); if (!s) throw err('StripeInvalidRequestError', 'no such session'); return { ...s }; },
      expire: async (id: string) => {
        const s = live(id);
        if (!s || s.status !== 'open') throw err('StripeInvalidRequestError', 'only an open session can be expired');
        s.status = 'expired';
        return { ...s };
      },
    },
  },
};

import { __setStripeForTests } from '@/server/stripeClient';
import { proveUnpaidAndRelease, startCheckout } from '@/server/checkout';

let clock = Date.parse('2026-11-16T06:00:00Z');
const advance = (seconds: number) => { clock += seconds * 1000; };
const SECRET = 'A'.repeat(43);
const consents = { termsAccepted: true, recurringChargeAccepted: true, priceChangeAccepted: true };
const KEY_1 = 'reg_first_attempt_key_0001';
const KEY_2 = 'reg_other_tab_new_key_0002';
const KEY_3 = 'reg_third_attempt_key_0003';
function seedDraft(over: Row = {}) {
  tables.registration_drafts.push({
    id: 'draft-1', secret_hash: '\\x' + createHash('sha256').update(SECRET).digest('hex'), revision: 1, status: 'draft', signed_in_user_id: null,
    owner_first_name: 'Eng', owner_last_name: 'Proof', owner_email: 'eng.proof.r04@example.test', owner_phone: '(555) 010-0177',
    owner_declaration_accepted_at: '2026-11-16T05:55:00Z', pharmacy_name: 'R04 Synthetic Pharmacy', address: '1 Test Lane', city: 'Plano', state: 'TX', zip: '75001',
    phone: '(555) 010-0178', software: 'Liberty', npi: '1234567893', ncpdp: null,
    quote_revision: 1, quote_subtotal_cents: 9900, quote_discount_cents: 0, quote_total_cents: 9900, quote_promotion_code: null, quote_price_id: 'price_unit',
    quote_expires_at: new Date(clock + 20 * 60 * 1000).toISOString(), consent_terms_version: null, consent_revision: null, consent_accepted_at: null, ...over,
  });
}
/** The buyer edits and re-quotes the draft: a new revision with a current quote. */
function editDraft(over: Row = {}) {
  const d = tables.registration_drafts[0];
  const revision = (d.revision as number) + 1;
  Object.assign(d, { revision, quote_revision: revision, quote_expires_at: new Date(clock + 20 * 60 * 1000).toISOString(), consent_revision: null, ...over });
}
const ops = () => tables.checkout_operations;
const codeOf = async (p: Promise<unknown>) => p.then(() => 'ok', (e: { code?: string }) => e.code ?? 'error');
const releases = () => rpcCalls.filter((c) => c.fn === 'npi_release_unpaid');
/** An operation marked unpaid must carry the provider evidence it was judged on: a recorded Checkout session. */
const unsupportedUnpaid = () => ops().filter((o) => o.status === 'expired_unpaid' && !o.stripe_checkout_session_id);

beforeAll(() => {
  Object.assign(process.env, { STRIPE_SECRET_KEY: 'sk_test_unit', STRIPE_PRICE_STORES: 'price_unit', STRIPE_PORTAL_CONFIGURATION: 'bpc_unit', STRIPE_EXPECTED_ACCOUNT: 'acct_unit', STRIPE_WEBHOOK_SECRET: 'whsec_unit', NEXT_PUBLIC_SUPABASE_URL: 'https://unitproject.supabase.co' });
  jest.spyOn(Date, 'now').mockImplementation(() => clock);
});
beforeEach(() => {
  for (const t of Object.keys(tables)) tables[t] = [];
  rpcCalls.length = 0; seq = 0; bindOutcome = 'bound'; clock = Date.parse('2026-11-16T06:00:00Z');
  P.customers.clear(); P.sessions.clear(); P.keys.clear(); P.createCalls = { customer: 0, session: 0 }; P.lose = null; P.n = 0;
  __setStripeForTests(fakeStripe, true);
  seedDraft();
});

describe('F-Q4-001 — lost provider answer, then a retry with a different operation key', () => {
  it('resumes the original operation: one customer, one Checkout session, one operation, nothing marked unpaid', async () => {
    P.lose = { kind: 'session', when: 'after' };
    expect(await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null))).toBe('provider_unavailable');
    // Stripe holds a customer and an open session; the portal recorded the customer but never saw the session.
    expect(P.customers.size).toBe(1);
    expect(P.sessions.size).toBe(1);
    const [original] = [...P.sessions.values()];
    expect(ops()).toHaveLength(1);
    expect(ops()[0]).toMatchObject({ status: 'created', stripe_checkout_session_id: null, stripe_customer_id: original.customer, idempotency_key: KEY_1 });
    const opId = ops()[0].id;

    advance(7);   // a few seconds later, from another tab that lost the first key
    const { url } = await startCheckout(SECRET, { consents, operationKey: KEY_2 }, null);

    expect(url).toBe(original.url);
    expect(P.customers.size).toBe(1);
    expect(P.sessions.size).toBe(1);
    expect(ops()).toHaveLength(1);
    expect(ops()[0]).toMatchObject({ id: opId, idempotency_key: KEY_1, status: 'checkout_open', stripe_customer_id: original.customer, stripe_checkout_session_id: original.id });
    expect(original).toMatchObject({ client_reference_id: opId, metadata: expect.objectContaining({ apbm_operation: opId }) });
    expect(unsupportedUnpaid()).toEqual([]);
    expect(ops().some((o) => o.status === 'expired_unpaid')).toBe(false);
    expect(releases()).toEqual([]);
    expect(rpcCalls.filter((c) => c.fn === 'npi_bind')).toEqual([{ fn: 'npi_bind', args: expect.objectContaining({ p_operation: opId }) }]);
    expect(tables.registration_drafts[0].status).toBe('checkout_started');
    // Every create reused the operation's own keys; Stripe answered the session from its saved original.
    expect([...P.keys.keys()].sort()).toEqual([`${opId}:customer`, `${opId}:session`]);
  });

  it('also when the customer answer was the one lost: the retry gets the same customer back', async () => {
    P.lose = { kind: 'customer', when: 'after' };
    expect(await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null))).toBe('provider_unavailable');
    expect(P.customers.size).toBe(1);
    expect(ops()[0]).toMatchObject({ status: 'created', stripe_customer_id: null });
    advance(3);
    await startCheckout(SECRET, { consents, operationKey: KEY_2 }, null);
    expect(P.customers.size).toBe(1);
    expect(P.sessions.size).toBe(1);
    expect(ops()).toHaveLength(1);
    expect(ops()[0]).toMatchObject({ status: 'checkout_open', stripe_customer_id: [...P.customers.keys()][0] });
    expect(unsupportedUnpaid()).toEqual([]);
  });

  it('the same-key retry after a lost answer gets the original session even seconds later (identical parameters)', async () => {
    P.lose = { kind: 'session', when: 'after' };
    await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null));
    advance(9);   // a recomputed expires_at would now differ, and Stripe refuses a reused key with new parameters
    const { url } = await startCheckout(SECRET, { consents, operationKey: KEY_1 }, null);
    expect(url).toBe([...P.sessions.values()][0].url);
    expect({ customers: P.customers.size, sessions: P.sessions.size, operations: ops().length }).toEqual({ customers: 1, sessions: 1, operations: 1 });
  });

  it('two retries with different keys at the same moment still produce one customer, one session and one operation', async () => {
    P.lose = { kind: 'session', when: 'after' };
    await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null));
    advance(2);
    const results = await Promise.all([
      codeOf(startCheckout(SECRET, { consents, operationKey: KEY_2 }, null)),
      codeOf(startCheckout(SECRET, { consents, operationKey: KEY_3 }, null)),
    ]);
    expect(results).toContain('ok');
    expect(results.every((r) => r === 'ok' || r === 'provider_unavailable')).toBe(true);   // a conflicting in-flight key, retryable
    expect({ customers: P.customers.size, sessions: P.sessions.size, operations: ops().length }).toEqual({ customers: 1, sessions: 1, operations: 1 });
    expect(unsupportedUnpaid()).toEqual([]);
  });

  it('a request that never reached Stripe is resumed later with a fresh expiry, once (Stripe saved nothing under the key)', async () => {
    P.lose = { kind: 'session', when: 'before' };
    await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null));
    expect(P.sessions.size).toBe(0);
    const planned = ops()[0].checkout_expires_at as string;
    advance(10 * 60);   // the stored expiry is now less than 30 minutes ahead
    await startCheckout(SECRET, { consents, operationKey: KEY_2 }, null);
    expect({ customers: P.customers.size, sessions: P.sessions.size, operations: ops().length }).toEqual({ customers: 1, sessions: 1, operations: 1 });
    expect(Date.parse(ops()[0].checkout_expires_at as string)).toBeGreaterThan(Date.parse(planned));
    expect(ops()[0].status).toBe('checkout_open');
  });

  it('a resumed attempt whose session already lapsed is released only on that provider proof; a later attempt starts cleanly', async () => {
    P.lose = { kind: 'session', when: 'after' };
    await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null));
    advance(40 * 60);   // the lost session expired at Stripe
    expect(await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_2 }, null))).toBe('expired');
    const [lapsed] = [...P.sessions.values()];
    expect(ops()).toHaveLength(1);
    expect(ops()[0]).toMatchObject({ status: 'expired_unpaid', stripe_checkout_session_id: lapsed.id });
    expect(releases()).toHaveLength(1);
    expect(unsupportedUnpaid()).toEqual([]);
    // The buyer refreshes the quote and tries again: a legitimate new attempt.
    tables.registration_drafts[0].quote_expires_at = new Date(clock + 20 * 60 * 1000).toISOString();
    await startCheckout(SECRET, { consents, operationKey: KEY_3 }, null);
    expect(ops()).toHaveLength(2);
    expect(ops().filter((o) => OPEN.includes(o.status as string))).toHaveLength(1);
  });

  it('after an edit, the earlier unknown attempt is settled with Stripe first and the new attempt keeps the same customer', async () => {
    P.lose = { kind: 'session', when: 'after' };
    await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null));
    const first = ops()[0];
    advance(60);
    editDraft({ pharmacy_name: 'R04 Synthetic Pharmacy East' });
    const { url } = await startCheckout(SECRET, { consents, operationKey: KEY_2 }, null);
    const [earlier, current] = ops();
    const earlierSession = P.sessions.get(earlier.stripe_checkout_session_id as string)!;
    expect(earlier).toMatchObject({ id: first.id, status: 'expired_unpaid' });
    expect(earlierSession).toMatchObject({ status: 'expired', client_reference_id: first.id });   // expired through Stripe, then judged
    expect(current).toMatchObject({ status: 'checkout_open', draft_revision: 2, stripe_customer_id: first.stripe_customer_id });
    expect(url).toBe(P.sessions.get(current.stripe_checkout_session_id as string)!.url);
    expect({ customers: P.customers.size, sessions: P.sessions.size, operations: ops().length }).toEqual({ customers: 1, sessions: 2, operations: 2 });
    expect(unsupportedUnpaid()).toEqual([]);
  });

  it('after an edit with the customer answer also lost and the email changed, nothing is duplicated or released (stays recoverable)', async () => {
    P.lose = { kind: 'customer', when: 'after' };
    await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null));
    editDraft({ owner_email: 'eng.proof.r04.changed@example.test' });
    expect(await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_2 }, null))).toBe('provider_unavailable');
    expect({ customers: P.customers.size, sessions: P.sessions.size, operations: ops().length }).toEqual({ customers: 1, sessions: 0, operations: 1 });
    expect(ops()[0].status).toBe('created');
    expect(releases()).toEqual([]);
  });
});

describe('F-Q4-001 — existing protections kept', () => {
  it('a new key cannot bypass an operation whose Checkout session is recorded', async () => {
    await startCheckout(SECRET, { consents, operationKey: KEY_1 }, null);
    expect(await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_2 }, null))).toBe('operation_in_progress');
    expect({ customers: P.customers.size, sessions: P.sessions.size, operations: ops().length }).toEqual({ customers: 1, sessions: 1, operations: 1 });
  });

  it('a double submit with one key creates one operation and one session', async () => {
    const results = await Promise.all([
      codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null)),
      codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null)),
    ]);
    expect(results).toContain('ok');
    expect(results.every((r) => r === 'ok' || r === 'operation_in_progress' || r === 'provider_unavailable')).toBe(true);
    expect({ customers: P.customers.size, sessions: P.sessions.size, operations: ops().length }).toEqual({ customers: 1, sessions: 1, operations: 1 });
  });

  it('missing consent and a stale quote are refused before any provider call', async () => {
    expect(await codeOf(startCheckout(SECRET, { consents: { ...consents, priceChangeAccepted: false }, operationKey: KEY_1 }, null))).toBe('invalid_input');
    advance(25 * 60);
    expect(await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null))).toBe('expired');
    expect(P.createCalls).toEqual({ customer: 0, session: 0 });
    expect(ops()).toEqual([]);
  });

  it('a draft secret that is not this draft\'s reaches nothing', async () => {
    expect(await codeOf(startCheckout('B'.repeat(43), { consents, operationKey: KEY_1 }, null))).toBe('not_found');
    expect(P.createCalls).toEqual({ customer: 0, session: 0 });
  });

  it('a lost reservation still expires the new session through Stripe and closes the attempt', async () => {
    bindOutcome = 'lost';
    expect(await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null))).toBe('npi_unavailable');
    expect([...P.sessions.values()][0].status).toBe('expired');
    expect(ops()[0]).toMatchObject({ status: 'expired_unpaid', last_error_code: 'reservation_lost' });
  });
});

describe('F-Q4-001 — release requires provider proof', () => {
  it('an operation with no recorded session is never released as unpaid', async () => {
    P.lose = { kind: 'session', when: 'after' };
    await codeOf(startCheckout(SECRET, { consents, operationKey: KEY_1 }, null));
    advance(3 * 3600);
    expect(await proveUnpaidAndRelease(ops()[0].id as string)).toBe('kept');
    expect(ops()[0].status).toBe('created');
    expect(releases()).toEqual([]);
  });

  it('an open recorded session is kept; an expired unpaid one is released', async () => {
    await startCheckout(SECRET, { consents, operationKey: KEY_1 }, null);
    const id = ops()[0].id as string;
    expect(await proveUnpaidAndRelease(id)).toBe('kept');
    advance(40 * 60);
    expect(await proveUnpaidAndRelease(id)).toBe('released');
    expect(ops()[0].status).toBe('expired_unpaid');
    expect(releases()).toHaveLength(1);
  });
});
