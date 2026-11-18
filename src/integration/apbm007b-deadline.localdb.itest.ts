/** @jest-environment node */
// APBM-007B repair proof (F-Q2-001, F-Q2-004): the Portal's REAL Add Store saga (storeOperations.ts) and the REAL minute
// job route against the REAL SQL functions of a LOCAL disposable Supabase (PostgREST at 127.0.0.1:54321), with an
// in-memory Stripe double. Never SCRATCH, DEV or Stripe. Run only through:
//   APBM_ITEST_LOCALDB=1 NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_SECRET_KEY=<local stack key> \
//     npx jest --testMatch '**/src/integration/apbm007b-deadline.localdb.itest.ts' --runInBand
// Optional: APBM_SAGA_IMPL=<path to another storeOperations.ts> (e.g. the candidate's, against a 0069 database) and
// APBM_DEADLINE_OUT=<json path> for the per-case facts. Fixtures are synthetic rows in the local database only.
// Seven consent-deadline cases, each on REAL time (no test context) and on SIMULATED time (a test context frozen 37 days
// ahead of the wall clock, the shape QA used). Real time "processed at deadline+k" places the stored deadline k seconds
// before now(); simulated time moves the account clock (and the provider clock) forward to deadline+k.
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { NextRequest } from 'next/server';

if (!process.env.APBM_ITEST_LOCALDB || new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://invalid').host !== '127.0.0.1:54321') {
  throw new Error('REFUSED: runs only against the local disposable Supabase at 127.0.0.1:54321');
}
jest.setTimeout(60_000);   // cold module compile + local PostgREST warm-up
const CONTAINER = process.env.APBM_LOCALDB_CONTAINER ?? 'supabase_db_apbm007b-rehearsal';
const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';   // the only identity under which billing_now honours a test context
const sql = (q: string): string => execFileSync('docker', ['exec', '-i', CONTAINER, 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-tAq', '-c', q], { encoding: 'utf8' }).trim();
const lit = (v: string | number | null) => (v === null ? 'null' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const iso = (ms: number) => new Date(ms).toISOString();

// ---------------------------------------------------------------- Stripe double (one subscription + invoices per world)
type Inv = { id: string; customer: string; currency: string; status: string; auto_advance: boolean; parent: null; lines: { data: { amount: number }[] };
  total: number; amount_due: number; amount_paid: number; total_discount_amounts: never[]; discounts: never[]; starting_balance: number;
  metadata: Record<string, string>; hosted_invoice_url: string; status_transitions: { paid_at: number | null } };
type Sub = { id: string; status: string; customer: string; items: { data: { id: string; quantity: number; price: { id: string }; current_period_start: number; current_period_end: number }[] } };
const mockP = {
  providerNow: () => Date.now(), card: 'ok' as 'ok' | '3ds', invoices: new Map<string, Inv>(), keys: new Map<string, string>(), sub: null as Sub | null,
  raceOnVoid: null as number | null,   // when set: the void loses to a payment completed at this provider time (seconds)
  calls: { pay: 0, void: 0, quantity: [] as number[], refund: 0 },
};
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const markPaid = (inv: Inv, atSec: number) => { inv.status = 'paid'; inv.amount_paid = inv.amount_due; inv.status_transitions.paid_at = atSec; };
const mockStripe = {
  invoices: {
    create: async (p: { customer: string; metadata: Record<string, string> }, o: { idempotencyKey: string }) => {
      const known = mockP.keys.get(o.idempotencyKey); if (known) return clone(mockP.invoices.get(known) as Inv);
      const inv: Inv = { id: `in_${randomUUID().replace(/-/g, '').slice(0, 20)}`, customer: p.customer, currency: 'usd', status: 'draft', auto_advance: false, parent: null,
        lines: { data: [] }, total: 0, amount_due: 0, amount_paid: 0, total_discount_amounts: [], discounts: [], starting_balance: 0, metadata: p.metadata,
        hosted_invoice_url: 'https://invoice.stripe.invalid/x', status_transitions: { paid_at: null } };
      mockP.invoices.set(inv.id, inv); mockP.keys.set(o.idempotencyKey, inv.id); return clone(inv);
    },
    retrieve: async (id: string) => clone(mockP.invoices.get(id) as Inv),
    list: (q: { customer: string }) => ({ async *[Symbol.asyncIterator]() { for (const i of mockP.invoices.values()) if (i.customer === q.customer) yield clone(i); } }),
    finalizeInvoice: async (id: string) => { const i = mockP.invoices.get(id) as Inv; if (i.status === 'draft') i.status = 'open'; return clone(i); },
    pay: async (id: string) => {
      mockP.calls.pay++; const i = mockP.invoices.get(id) as Inv;
      if (mockP.card === '3ds') throw Object.assign(new Error('requires action'), { code: 'invoice_payment_intent_requires_action' });
      markPaid(i, Math.floor(mockP.providerNow() / 1000)); return clone(i);
    },
    voidInvoice: async (id: string) => {
      mockP.calls.void++; const i = mockP.invoices.get(id) as Inv;
      if (mockP.raceOnVoid !== null && i.status === 'open') markPaid(i, mockP.raceOnVoid);
      if (i.status !== 'open') throw Object.assign(new Error('invoice is not open'), { code: 'invoice_not_open' });
      i.status = 'void'; return clone(i);
    },
    del: async () => ({}),
  },
  invoiceItems: { create: async (p: { invoice: string; amount: number }) => { const i = mockP.invoices.get(p.invoice) as Inv; i.lines.data = [{ amount: p.amount }]; i.total = p.amount; i.amount_due = p.amount; return {}; } },
  customers: { retrieve: async (id: string) => ({ id, balance: 0 }) },
  subscriptions: {
    retrieve: async () => clone(mockP.sub as Sub),
    update: async (_id: string, p: { items: { quantity: number }[] }) => { mockP.calls.quantity.push(p.items[0].quantity); (mockP.sub as Sub).items.data[0].quantity = p.items[0].quantity; return clone(mockP.sub as Sub); },
  },
  refunds: { create: async () => { mockP.calls.refund++; return {}; } },
};
jest.mock('@/server/stripeClient', () => ({
  stripe: () => mockStripe, stripeCall: (_n: string, fn: () => unknown) => fn(), assertStripeAccount: async () => undefined,
  stripeNames: () => ({ priceId: 'price_proof', portalConfiguration: 'bpc_x', expectedAccount: 'acct_x', webhookSecret: 'whsec_x' }),
}));
jest.mock('@/server/operator', () => ({ operatorAuthorized: () => true }));
jest.mock('@/server/billingNotices', () => ({ dispatchDueNotices: async () => ({}) }));
if (process.env.APBM_SAGA_IMPL) jest.mock('@/server/storeOperations', () => jest.requireActual(process.env.APBM_SAGA_IMPL as string));

type Saga = { advanceStoreOperation: (id: string, o?: { waitMs?: number }) => Promise<string> };
const saga = (): Saga => require('@/server/storeOperations') as Saga;   // eslint-disable-line @typescript-eslint/no-require-imports
const jobs = async (): Promise<Record<string, Record<string, string>>> => {
  const { POST } = require('@/app/api/internal/jobs/run/route') as { POST: (r: NextRequest) => Promise<Response> };   // eslint-disable-line @typescript-eslint/no-require-imports
  const res = await POST(new NextRequest('http://127.0.0.1/api/internal/jobs/run', { method: 'POST', headers: { authorization: 'Bearer local-proof' } }));
  expect(res.status).toBe(200);
  return (await res.json()) as Record<string, Record<string, string>>;
};

// ---------------------------------------------------------------- local world: owner, account (2 stores, quantity 2), one Add Store operation
const npiValid = (n: string) => { let sum = 0; const d = `80840${n}`; for (let i = 0; i < 15; i++) { let x = Number(d[14 - i]); if (i % 2 === 1) { x *= 2; if (x > 9) x -= 9; } sum += x; } return sum % 10 === 0; };
const freshNpi = () => { for (;;) { const n = String(1000000000 + Math.floor(Math.random() * 899999999)); if (npiValid(n)) return n; } };
type Mode = 'real' | 'simulated';
async function world(mode: Mode) {
  const u = randomUUID(), a = randomUUID(), b1 = randomUUID(), b2 = randomUUID(), tag = a.replace(/-/g, '').slice(0, 12);
  const npi = [freshNpi(), freshNpi(), freshNpi()];
  let simNow = Math.floor((Date.now() + 37 * 86400_000) / 1000) * 1000;   // test clock ahead of the wall clock, like QA's
  const center = mode === 'simulated' ? simNow : Math.floor(Date.now() / 1000) * 1000;
  const ps = center - 10 * 86400_000, pe = center + 20 * 86400_000;
  const cus = `cus_l${tag}`, sub = `sub_l${tag}`, item = `si_l${tag}`;
  sql(`insert into auth.users (id, email, aud, role, instance_id, email_confirmed_at, created_at, updated_at) values (${lit(u)}, ${lit(`owner-${tag}@proof.invalid`)}, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', now(), now(), now());
    insert into public.accounts (id, name, owner_user_id) values (${lit(a)}, 'Deadline proof', ${lit(u)});
    insert into public.pharmacy_identities (id, npi) values (${lit(b1)}, ${lit(npi[0])}), (${lit(b2)}, ${lit(npi[1])});
    insert into public.businesses (id, account_id, pharmacy_id, npi, pharmacy_name, status, state) values (${lit(b1)}, ${lit(a)}, ${lit(b1)}, ${lit(npi[0])}, 'Proof 1', 'active', 'NY'), (${lit(b2)}, ${lit(a)}, ${lit(b2)}, ${lit(npi[1])}, 'Proof 2', 'active', 'NY');
    insert into public.user_businesses (user_id, business_id, role, is_primary) values (${lit(u)}, ${lit(b1)}, 'admin', false), (${lit(u)}, ${lit(b2)}, 'admin', false);
    insert into public.billing_customers (account_id, stripe_customer_id) values (${lit(a)}, ${lit(cus)});
    insert into public.subscriptions (account_id, origin, stripe_customer_id, stripe_subscription_id, status, raw_status, quantity, stripe_price_id, stripe_subscription_item_id, current_period_start, current_period_end, cancel_at_period_end, verified_at, policy_version)
      values (${lit(a)}, 'stripe', ${lit(cus)}, ${lit(sub)}, 'active', 'active', 2, 'price_proof', ${lit(item)}, ${lit(iso(ps))}, ${lit(iso(pe))}, false, now(), 'v1');`);
  const clock = `clock_l${tag}`;
  if (mode === 'simulated') sql(`select public.billing_test_context_enable(${lit(a)}, 'proof-0070', ${lit(clock)}, ${lit(iso(simNow))})`);
  const q = JSON.parse(sql(`select public.store_quote_create(${lit(a)}, ${lit(u)}, 'Deadline Store', ${lit(npi[2])}, null, ${lit(cus)}, ${lit(sub)}, ${lit(item)}, 'price_proof', 4900, 2, ${lit(iso(ps))}, ${lit(iso(pe))}, 'add-store-v1')`)) as { quote?: { id: string }; error?: string };
  if (!q.quote) throw new Error(`quote ${q.error}`);
  const terms = sql(`select terms_version from public.store_quotes where id = ${lit(q.quote.id)}`);
  const c = JSON.parse(sql(`select public.store_operation_claim(${lit(q.quote.id)}, ${lit(u)}, ${lit(`it_${tag}${'x'.repeat(8)}`)}, ${lit(terms)})`)) as { operation?: { id: string }; error?: string };
  if (!c.operation) throw new Error(`claim ${c.error}`);
  const op = c.operation.id;
  mockP.invoices.clear(); mockP.keys.clear(); mockP.raceOnVoid = null; mockP.card = 'ok'; mockP.calls = { pay: 0, void: 0, quantity: [], refund: 0 };
  mockP.sub = { id: sub, status: 'active', customer: cus, items: { data: [{ id: item, quantity: 2, price: { id: 'price_proof' }, current_period_start: ps / 1000, current_period_end: pe / 1000 }] } };
  mockP.providerNow = mode === 'simulated' ? () => simNow : () => Date.now();
  const deadline = () => Date.parse(sql(`select to_json(payment_deadline) #>> '{}' from public.store_operations where id = ${lit(op)}`));
  /** The account billing clock (and, in simulated mode, the provider test clock) now reads deadline + k seconds. */
  const processAt = (k: number) => {
    if (mode === 'simulated') { simNow = deadline() + k * 1000; sql(`select public.billing_test_context_sync(${lit(a)}, ${lit(clock)}, ${lit(iso(simNow))})`); }
    else sql(`update public.store_operations set payment_deadline = now() - make_interval(secs => ${k}) where id = ${lit(op)}`);
  };
  const payHosted = (kFromDeadline: number) => { const i = [...mockP.invoices.values()][0]; markPaid(i, Math.floor((deadline() + kFromDeadline * 1000) / 1000)); };
  const facts = () => ({ ...(JSON.parse(sql(`select json_build_object('state', o.state, 'code', o.last_error_code,
      'stores', (select count(*)::int from public.businesses x where x.account_id = o.account_id), 'mirror_quantity', (select quantity from public.subscriptions s where s.account_id = o.account_id),
      'hold', (select status from public.npi_reservations r where r.store_operation_id = o.id)) from public.store_operations o where o.id = ${lit(op)}`)) as Record<string, unknown>),
    provider_quantity_updates: [...mockP.calls.quantity], pay_calls: mockP.calls.pay, void_calls: mockP.calls.void, refunds: mockP.calls.refund,
    invoice: [...mockP.invoices.values()].map((i) => i.status)[0] ?? null });
  return { op, processAt, payHosted, facts, deadline };
}

const OUT: Record<string, unknown> = { impl: process.env.APBM_SAGA_IMPL ?? 'src/server/storeOperations.ts', at: new Date().toISOString(), cases: {} };
const record = (name: string, f: Record<string, unknown>) => { (OUT.cases as Record<string, unknown>)[name] = f; return f; };
beforeAll(() => {
  if (!sql('select project_ref from public.billing_deployment')) sql(`select public.billing_deployment_bind(${lit(SCRATCH_REF)})`);
  if (sql('select project_ref from public.billing_deployment') !== SCRATCH_REF) throw new Error('local deployment identity must allow the simulated mode');
  sql(`notify pgrst, 'reload schema'`);
});
afterAll(() => { if (process.env.APBM_DEADLINE_OUT) writeFileSync(process.env.APBM_DEADLINE_OUT, JSON.stringify(OUT, null, 1)); });

const activatedOnce = (f: Record<string, unknown>) => { expect(f).toMatchObject({ state: 'activated', stores: 3, mirror_quantity: 3, provider_quantity_updates: [3], refunds: 0 }); };
const heldInAttention = (f: Record<string, unknown>) => { expect(f).toMatchObject({ state: 'attention', code: 'paid_after_deadline', stores: 2, mirror_quantity: 2, provider_quantity_updates: [], refunds: 0, hold: 'op_held', invoice: 'paid' }); };

describe.each<Mode>(['real', 'simulated'])('consent deadline on %s time', (mode) => {
  const name = (s: string) => `${mode}: ${s}`;
  test('1. paid on time, processed promptly → activates once', async () => {
    const w = await world(mode);
    const r = await saga().advanceStoreOperation(w.op);
    activatedOnce(record(name('on time and prompt'), { advance: r, ...w.facts() }));
  });
  test('2. paid on time on the hosted page, processed later but before the deadline → activates once', async () => {
    const w = await world(mode); mockP.card = '3ds';
    const r1 = await saga().advanceStoreOperation(w.op);
    w.processAt(-300); w.payHosted(-1200);
    const r2 = await saga().advanceStoreOperation(w.op);
    const f = record(name('on time and delayed within the deadline'), { first: r1, advance: r2, ...w.facts() });
    expect(r1).toBe('payment_pending'); activatedOnce(f); expect(f.pay_calls).toBe(1);
  });
  test('3. paid on time, processed one hour after the deadline (outage/restart/redelivery) → activates exactly once', async () => {
    const w = await world(mode); mockP.card = '3ds';
    await saga().advanceStoreOperation(w.op);
    w.processAt(3600); w.payHosted(-60);   // the payment happened 1 min before the deadline; processing happens 1 h after it
    const r = await saga().advanceStoreOperation(w.op);
    const j = await jobs(); const again = await saga().advanceStoreOperation(w.op);
    const f = record(name('on time and processed after the deadline'), { advance: r, job: j.store_operations?.[w.op] ?? null, again, ...w.facts() });
    activatedOnce(f); expect(f.pay_calls).toBe(1);
  });
  test('4. paid after the deadline, processed promptly → attention, no activation, no quantity change, no second charge', async () => {
    const w = await world(mode); mockP.card = '3ds';
    await saga().advanceStoreOperation(w.op);
    w.processAt(61); w.payHosted(60);
    const r = await saga().advanceStoreOperation(w.op);
    const f = record(name('late and prompt'), { advance: r, ...w.facts() });
    heldInAttention(f); expect(f.pay_calls).toBe(1);
  });
  test('5. paid after the deadline while the Portal was down; restart after the crashed lease lapses → attention', async () => {
    const w = await world(mode); mockP.card = '3ds';
    await saga().advanceStoreOperation(w.op);
    sql(`select public.store_operation_lease(${lit(w.op)}, 'crashed-worker', 60)`);   // the process died holding the lease
    w.processAt(600); w.payHosted(30);
    const whileHeld = await saga().advanceStoreOperation(w.op, { waitMs: 300 });
    sql(`update public.store_operations set lease_until = now() - interval '1 second' where id = ${lit(w.op)}`);
    const r = await saga().advanceStoreOperation(w.op);
    const f = record(name('late after crash'), { while_crashed_lease_live: whileHeld, advance: r, ...w.facts() });
    expect(whileHeld).toBe('busy'); heldInAttention(f); expect(f.pay_calls).toBe(1);
  });
  test('6. unpaid at the deadline → the minute job voids after verifying nothing was paid; expired, hold released', async () => {
    const w = await world(mode); mockP.card = '3ds';
    await saga().advanceStoreOperation(w.op);
    w.processAt(60);
    const j = await jobs();
    const f = record(name('unpaid expiry by the minute job'), { job: j.store_operations?.[w.op] ?? null, ...w.facts() });
    expect(f).toMatchObject({ job: 'expired_unpaid', state: 'expired_unpaid', hold: 'released', stores: 2, mirror_quantity: 2, provider_quantity_updates: [], invoice: 'void', void_calls: 1, pay_calls: 1, refunds: 0 });
  });
  test('7. paid-versus-void race at expiry → attention, no activation', async () => {
    const w = await world(mode); mockP.card = '3ds';
    await saga().advanceStoreOperation(w.op);
    w.processAt(60); mockP.raceOnVoid = Math.floor((w.deadline() + 55_000) / 1000);
    const j = await jobs();
    const f = record(name('paid-versus-void race'), { job: j.store_operations?.[w.op] ?? null, ...w.facts() });
    heldInAttention(f); expect(f.void_calls).toBe(1);
  });
});
