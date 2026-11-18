/** @jest-environment node */
// APBM-007B repair (F-Q2-001, F-Q2-004) — unit level. The Portal never compares the consent deadline with its own wall
// clock: it asks the database (store_operation_deadline_passed, on the account billing clock) and hands every paid invoice
// to the database with the provider's paid time (store_operation_payment_observed). The database double below applies the
// 0070 rules; the wall clock is either equal to the billing clock ("real") or 37 days BEHIND it ("simulated", the shape of
// QA's test clock), so any wall-clock comparison would decide wrongly. The same cases run against the real SQL in
// src/integration/apbm007b-deadline.localdb.itest.ts and OwedBook scripts/apbm007b/sql-proof.mjs.
import { NextRequest } from 'next/server';

type Op = { id: string; account_id: string; kind: 'store_add'; state: string; last_error_code: string | null; payment_deadline: string; invoice_id: string; amount_cents: number;
  stripe_customer_id: string; stripe_subscription_id: string; stripe_item_id: string; period_start: string; period_end: string; target_quantity: number;
  hosted_invoice_url: string; created_at: string; fencing_epoch: number; provider_paid_at: string | null; close_reference: string | null; store_name: string; npi: string };
const PS = Date.parse('2026-12-01T00:00:00Z'), PE = Date.parse('2026-12-31T00:00:00Z'), DEADLINE = Date.parse('2026-12-24T11:49:29Z');
const mockS = {
  billingNow: 0, leaseFree: true, op: null as Op | null, intents: new Set<string>(), rpcs: [] as { fn: string; args: Record<string, unknown> }[],
  inv: { status: 'open', paid_at: null as number | null, amount: 3774 }, card: '3ds' as 'ok' | '3ds', raceOnVoid: null as number | null,
  quantity: 2, quantityUpdates: [] as number[], pay: 0, void: 0,
};
const mockInvoice = () => ({ id: 'in_unit', customer: 'cus_unit', currency: 'usd', status: mockS.inv.status, amount_due: mockS.inv.amount, total: mockS.inv.amount,
  amount_paid: mockS.inv.status === 'paid' ? mockS.inv.amount : 0, metadata: { apbm_operation: 'op' }, hosted_invoice_url: 'https://invoice.invalid/x',
  status_transitions: { paid_at: mockS.inv.paid_at }, lines: { data: [{ amount: mockS.inv.amount }] } });
const mockPaid = (sec: number) => { mockS.inv.status = 'paid'; mockS.inv.paid_at = sec; };
// The database double: the 0070 rules, decided on the billing clock and the provider paid time.
const mockRpc = async (fn: string, args: Record<string, unknown>): Promise<unknown> => {
  mockS.rpcs.push({ fn, args }); const o = mockS.op as Op; const deadline = Date.parse(o.payment_deadline);
  switch (fn) {
    case 'store_operation_lease': if (!mockS.leaseFree) return null; o.fencing_epoch += 1; return o.fencing_epoch;
    case 'store_operation_release': return true;
    case 'store_operation_intent': mockS.intents.add(String(args.p_stage)); return 'recorded';
    case 'store_operation_intent_outcome': return null;
    case 'store_operation_deadline_passed': return deadline <= mockS.billingNow;
    case 'store_operations_due': return ['payment_setup', 'payment_pending'].includes(o.state) && deadline <= mockS.billingNow ? [{ id: o.id }] : [];
    case 'store_lifecycle_due': case 'store_removals_due': case 'store_transfers_expired': return [];
    case 'store_operation_payment_observed': {
      const paid = args.p_paid_at ? Date.parse(String(args.p_paid_at)) : null;
      [o.state, o.last_error_code] = paid === null ? ['attention', 'paid_time_unverified'] : paid > deadline ? ['attention', 'paid_after_deadline'] : ['paid_pending_activation', null];
      o.provider_paid_at = paid === null ? null : new Date(paid).toISOString(); return o.state;
    }
    case 'store_operation_transition': {
      const to = String(args.p_to);
      if (o.state === 'payment_pending' && to === 'paid_pending_activation') return 'transition_refused';   // removed by 0070
      o.state = to; o.last_error_code = (args.p_error as string | null) ?? null; return to;
    }
    case 'store_add_activate': {
      if (o.state !== 'paid_pending_activation') return { outcome: 'not_paid_pending' };
      if (!o.close_reference && (!o.provider_paid_at || Date.parse(o.provider_paid_at) > deadline)) { o.state = 'attention'; return { outcome: 'attention' }; }
      o.state = 'activated'; return { outcome: 'activated' };
    }
    default: throw new Error(`unexpected rpc ${fn}`);
  }
};
jest.mock('@/server/db', () => ({
  rpc: (fn: string, args: Record<string, unknown>) => mockRpc(fn, args),
  admin: () => ({ from: (table: string) => {
    const filters: Record<string, unknown> = {};
    const q = { select: () => q, eq: (k: string, v: unknown) => { filters[k] = v; return q; },
      maybeSingle: async () => (table === 'store_operations' ? { data: { ...(mockS.op as Op) }, error: null }
        : { data: mockS.intents.has(String(filters.stage)) ? { created_at: new Date().toISOString() } : null, error: null }) };
    return q;
  } }),
}));
jest.mock('@/server/stripeClient', () => ({
  stripeCall: (_n: string, fn: () => unknown) => fn(), assertStripeAccount: async () => undefined,
  stripeNames: () => ({ priceId: 'price_unit', portalConfiguration: 'x', expectedAccount: 'x', webhookSecret: 'x' }),
  stripe: () => ({
    invoices: {
      retrieve: async () => ({ ...mockInvoice(), metadata: { apbm_operation: (mockS.op as Op).id } }),
      pay: async () => { mockS.pay++; if (mockS.card === '3ds') throw Object.assign(new Error('requires action'), { code: 'invoice_payment_intent_requires_action' }); mockPaid(Math.floor(mockS.billingNow / 1000)); return {}; },
      voidInvoice: async () => { mockS.void++; if (mockS.raceOnVoid !== null) mockPaid(mockS.raceOnVoid); if (mockS.inv.status !== 'open') throw Object.assign(new Error('not open'), { code: 'invoice_not_open' }); mockS.inv.status = 'void'; return {}; },
    },
    subscriptions: {
      retrieve: async () => ({ id: 'sub_unit', status: 'active', items: { data: [{ id: 'si_unit', quantity: mockS.quantity, price: { id: 'price_unit' }, current_period_start: PS / 1000, current_period_end: PE / 1000 }] } }),
      update: async (_id: string, p: { items: { quantity: number }[] }) => { mockS.quantityUpdates.push(p.items[0].quantity); mockS.quantity = p.items[0].quantity; return {}; },
    },
  }),
}));
jest.mock('@/server/operator', () => ({ operatorAuthorized: () => true }));
jest.mock('@/server/billingNotices', () => ({ dispatchDueNotices: async () => ({}) }));

import { advanceStoreOperation } from '@/server/storeOperations';
import { POST as runJobs } from '@/app/api/internal/jobs/run/route';

type Mode = 'real' | 'simulated';
const WALL_BEHIND_MS = 37 * 86400_000;
function setup(mode: Mode, opts: { payIntentRecorded: boolean }) {
  mockS.op = { id: '00000000-0000-4000-8000-000000000070', account_id: 'acct', kind: 'store_add', state: 'payment_pending', last_error_code: null, payment_deadline: new Date(DEADLINE).toISOString(),
    invoice_id: 'in_unit', amount_cents: 3774, stripe_customer_id: 'cus_unit', stripe_subscription_id: 'sub_unit', stripe_item_id: 'si_unit', period_start: new Date(PS).toISOString(),
    period_end: new Date(PE).toISOString(), target_quantity: 3, hosted_invoice_url: 'https://invoice.invalid/x', created_at: new Date(DEADLINE - 1800_000).toISOString(), fencing_epoch: 0,
    provider_paid_at: null, close_reference: null, store_name: 'Unit Store', npi: '1003000118' };
  Object.assign(mockS, { leaseFree: true, rpcs: [], inv: { status: 'open', paid_at: null, amount: 3774 }, card: '3ds', raceOnVoid: null, quantity: 2, quantityUpdates: [], pay: 0, void: 0 });
  mockS.intents = new Set(opts.payIntentRecorded ? ['pay'] : []);
  /** Billing clock (and the provider clock in a test context) at deadline + k seconds; the wall clock follows the mode. */
  const at = (k: number) => { mockS.billingNow = DEADLINE + k * 1000; jest.spyOn(Date, 'now').mockReturnValue(mode === 'simulated' ? mockS.billingNow - WALL_BEHIND_MS : mockS.billingNow); };
  const paidAt = (k: number) => mockPaid(Math.floor((DEADLINE + k * 1000) / 1000));
  return { at, paidAt };
}
const jobs = async () => (await (await runJobs(new NextRequest('http://127.0.0.1/api/internal/jobs/run', { method: 'POST', headers: { authorization: 'Bearer unit' } }))).json()) as { store_operations: Record<string, string> };
const observedPaidAt = () => mockS.rpcs.filter((r) => r.fn === 'store_operation_payment_observed').map((r) => r.args.p_paid_at);
afterEach(() => jest.restoreAllMocks());

describe.each<Mode>(['real', 'simulated'])('consent deadline (%s time)', (mode) => {
  it('1. on time and prompt: pays once, records the provider paid time, activates once', async () => {
    const t = setup(mode, { payIntentRecorded: false }); mockS.card = 'ok'; t.at(-1500);
    expect(await advanceStoreOperation((mockS.op as Op).id)).toBe('activated');
    expect([mockS.pay, mockS.quantityUpdates]).toEqual([1, [3]]);
    expect(observedPaidAt()).toEqual([new Date(DEADLINE - 1500_000).toISOString()]);
  });
  it('2. on time and delayed within the deadline: activates once, no second charge', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.paidAt(-1200); t.at(-300);
    expect(await advanceStoreOperation((mockS.op as Op).id)).toBe('activated');
    expect([mockS.pay, mockS.quantityUpdates]).toEqual([0, [3]]);
  });
  it('3. on time, processed one hour after the deadline: activates exactly once', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.paidAt(-60); t.at(3600);
    expect(await advanceStoreOperation((mockS.op as Op).id)).toBe('activated');
    expect(await advanceStoreOperation((mockS.op as Op).id)).toBe('activated');
    expect([mockS.pay, mockS.quantityUpdates]).toEqual([0, [3]]);
  });
  it('4. late and prompt: attention, no activation, no quantity change, no charge', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.paidAt(60); t.at(61);
    expect(await advanceStoreOperation((mockS.op as Op).id)).toBe('attention');
    expect([(mockS.op as Op).last_error_code, mockS.pay, mockS.quantityUpdates]).toEqual(['paid_after_deadline', 0, []]);
  });
  it('5. late after a crash: busy while the dead lease lives, then attention after restart', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.paidAt(30); t.at(600);
    mockS.leaseFree = false;
    expect(await advanceStoreOperation((mockS.op as Op).id, { waitMs: 0 })).toBe('busy');
    mockS.leaseFree = true;
    expect(await advanceStoreOperation((mockS.op as Op).id)).toBe('attention');
    expect([(mockS.op as Op).last_error_code, mockS.pay, mockS.quantityUpdates]).toEqual(['paid_after_deadline', 0, []]);
  });
  it('6. unpaid at the deadline: the minute job voids after verifying unpaid and expires it', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.at(60);
    expect((await jobs()).store_operations).toEqual({ [(mockS.op as Op).id]: 'expired_unpaid' });
    expect([mockS.void, mockS.inv.status, mockS.pay, mockS.quantityUpdates]).toEqual([1, 'void', 0, []]);
  });
  it('6b. before the deadline the job does nothing and no void happens, whatever the wall clock says', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.at(-60);
    expect((await jobs()).store_operations).toEqual({});
    expect(await advanceStoreOperation((mockS.op as Op).id)).toBe('payment_pending');
    expect([mockS.void, mockS.pay]).toEqual([0, 0]);
  });
  it('7. paid-versus-void race: attention, no activation', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.at(60); mockS.raceOnVoid = Math.floor((DEADLINE + 55_000) / 1000);
    await jobs();
    expect([(mockS.op as Op).state, (mockS.op as Op).last_error_code, mockS.quantityUpdates]).toEqual(['attention', 'paid_after_deadline', []]);
  });
  it('never uses the removed direct transition into paid_pending_activation', async () => {
    const t = setup(mode, { payIntentRecorded: true }); t.paidAt(-60); t.at(10);
    await advanceStoreOperation((mockS.op as Op).id);
    expect(mockS.rpcs.some((r) => r.fn === 'store_operation_transition' && r.args.p_to === 'paid_pending_activation')).toBe(false);
  });
});
