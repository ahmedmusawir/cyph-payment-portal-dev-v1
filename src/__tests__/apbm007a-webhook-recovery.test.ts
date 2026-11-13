/** @jest-environment node */
// APBM007A — F-Q1-01 webhook recovery (AC-014, AC-015, AC-038). Unit layer: the database and Stripe are in-memory
// fakes; signatures use the real Stripe library. The operation saga is modelled by its contract (lease → busy,
// unsettled → pending, provisioned once, already provisioned → no new effect); its real exactly-once behaviour is
// the SQL proved on SCRATCH by cyph-v1-dev/scripts/rls-harness/apbm007a-proof.mjs and is not re-proved here.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Stripe from 'stripe';

type Row = Record<string, unknown>;
const tables: Record<string, Row[]> = {};
let auditFails = false;
function builder(table: string) {
  const filters: ((r: Row) => boolean)[] = [];
  let mode: 'select' | 'insert' | 'update' = 'select';
  let payload: Row | undefined;
  let max = Infinity;
  const rows = () => (tables[table] ??= []);
  const match = () => rows().filter((r) => filters.every((f) => f(r)));
  const run = () => {
    if (mode === 'insert') {
      if (table === 'audit_logs' && auditFails) return { data: null, error: { code: '42501' } };
      if (table === 'stripe_events' && rows().some((r) => r.event_id === payload!.event_id)) return { data: null, error: { code: '23505' } };
      if (table === 'notification_operations' && rows().some((r) => r.dedupe_key === payload!.dedupe_key)) return { data: null, error: { code: '23505' } };
      rows().push(table === 'stripe_events' ? { status: 'received', attempts: 0, error_code: null, operation_id: null, processed_at: null, ...payload } : { ...payload });
      return { data: payload, error: null };
    }
    if (mode === 'update') { match().forEach((r) => Object.assign(r, payload)); return { data: null, error: null }; }
    return { data: match().slice(0, max).map((r) => ({ ...r })), error: null };
  };
  const api: Record<string, unknown> = {
    insert: (p: Row) => { mode = 'insert'; payload = p; return api; },
    update: (p: Row) => { mode = 'update'; payload = p; return api; },
    select: () => api, order: () => api,
    limit: (n: number) => { max = n; return api; },
    eq: (k: string, v: unknown) => { filters.push((r) => r[k] === v); return api; },
    neq: (k: string, v: unknown) => { filters.push((r) => r[k] !== v); return api; },
    in: (k: string, vs: unknown[]) => { filters.push((r) => vs.includes(r[k])); return api; },
    maybeSingle: async () => { const r = run(); return { data: Array.isArray(r.data) ? r.data[0] ?? null : r.data, error: r.error }; },
    single: async () => { const r = run(); return { data: Array.isArray(r.data) ? r.data[0] ?? null : r.data, error: r.error }; },
    then: (ok: (v: unknown) => unknown) => Promise.resolve(run()).then(ok),
  };
  return api;
}
const effects = { provisioned: 0, mirrorApplied: 0, graceClear: 0, graceStart: 0 };
jest.mock('@/server/db', () => ({
  admin: () => ({ from: (t: string) => builder(t) }),
  rpc: async (fn: string, args: Row) => {
    if (fn === 'subscription_mirror_apply') {
      const known = (tables.subscriptions ?? []).some((s) => s.stripe_subscription_id === args.p_stripe_subscription_id);
      if (known) effects.mirrorApplied++;
      return known ? 'applied' : 'unknown_subscription';
    }
    if (fn === 'subscription_grace_clear') { effects.graceClear++; return 'unchanged'; }
    if (fn === 'subscription_grace_start') { effects.graceStart++; return 'started'; }
    throw new Error(`unexpected rpc ${fn}`);
  },
  bytea: (b: Buffer) => '\\x' + b.toString('hex'),
}));

// The saga, by contract. `lease` simulates another worker holding the operation.
interface Op { id: string; stripe_checkout_session_id: string | null; stripe_customer_id: string | null; stripe_subscription_id: string | null; status: string; settled: boolean; lease: boolean }
const opsById = () => Object.fromEntries(((tables.checkout_operations ?? []) as unknown as Op[]).map((o) => [o.id, o]));
const advanceOperation = jest.fn(async (id: string) => {
  const op = opsById()[id];
  if (!op) return 'unknown';
  if (op.lease) return 'busy';
  if (op.status === 'provisioned') return 'provisioned';            // already done: no second effect
  if (!op.stripe_checkout_session_id || !op.settled) return 'pending';
  op.status = 'provisioned'; effects.provisioned++;
  (tables.subscriptions ??= []).push({ stripe_subscription_id: op.stripe_subscription_id, origin: 'stripe' });
  return 'provisioned';
});
jest.mock('@/server/provisioning', () => ({ advanceOperation: (id: string) => advanceOperation(id) }));

import { __setStripeForTests } from '@/server/stripeClient';
import { classifyUnmapped, handleStripeWebhook, isFinal, isSuspect, listUnfinishedEvents, recoverEvent } from '@/server/webhook';

const SECRET = 'whsec_unit_test_secret';
const OUR_DB = 'ourproject';
const real = new Stripe('sk_test_unit', { apiVersion: '2026-04-22.dahlia' });
const sign = (payload: string) => real.webhooks.generateTestHeaderString({ payload, secret: SECRET });

// Sandbox objects, as Stripe would return them to our key. Only retrieval exists: any mutation would throw.
const objects: Record<string, Record<string, Row>> = { sessions: {}, subscriptions: {}, invoices: {}, customers: {}, events: {} };
const reads = jest.fn();
const retrieve = (kind: string) => async (id: string) => {
  reads(kind, id);
  const o = objects[kind][id];
  if (!o) throw Object.assign(new Error('No such object'), { type: 'StripeInvalidRequestError', code: 'resource_missing' });
  return o;
};
const fakeStripe = new Proxy({
  webhooks: real.webhooks,
  checkout: { sessions: { retrieve: retrieve('sessions') } },
  subscriptions: { retrieve: retrieve('subscriptions') },
  invoices: { retrieve: retrieve('invoices') },
  customers: { retrieve: retrieve('customers') },
  events: { retrieve: retrieve('events') },
}, { get: (t, k: string) => { if (!(k in t)) throw new Error(`stripe.${k} is not available to the webhook`); return (t as Record<string, unknown>)[k]; } });

const marker = (op: string, db: string | null = OUR_DB) => ({ apbm_operation: op, apbm_run: 'apbm007a', ...(db ? { apbm_db: db } : {}) });
let n = 0;
function evt(type: string, object: Row, id = `evt_r${++n}`) {
  const e = { id, object: 'event', type, livemode: false, created: 1794480000 + n, data: { object } };
  objects.events[id] = e;
  const body = JSON.stringify(e);
  return { id, deliver: () => handleStripeWebhook(body, sign(body)) };
}
const row = (id: string) => (tables.stripe_events ?? []).find((r) => r.event_id === id)!;
const opRow = (over: Partial<Op>): Row => ({ id: 'op_a', stripe_checkout_session_id: null, stripe_customer_id: null, stripe_subscription_id: null, status: 'checkout_open', settled: true, lease: false, ...over });

beforeAll(() => {
  Object.assign(process.env, { STRIPE_SECRET_KEY: 'sk_test_unit', STRIPE_PRICE_STORES: 'price_unit', STRIPE_PORTAL_CONFIGURATION: 'bpc_unit', STRIPE_EXPECTED_ACCOUNT: 'acct_unit', STRIPE_WEBHOOK_SECRET: SECRET, NEXT_PUBLIC_SUPABASE_URL: `https://${OUR_DB}.supabase.co` });
});
beforeEach(() => {
  for (const k of Object.keys(tables)) delete tables[k];
  for (const k of Object.keys(objects)) objects[k] = {};
  Object.assign(effects, { provisioned: 0, mirrorApplied: 0, graceClear: 0, graceStart: 0 });
  auditFails = false; advanceOperation.mockClear(); reads.mockClear();
  __setStripeForTests(fakeStripe);
});

describe('a. late mapping, then recovery', () => {
  it('a paid session whose mapping is not yet recorded is not acknowledged; once mapped, the redelivery provisions', async () => {
    tables.checkout_operations = [opRow({ stripe_customer_id: 'cus_a' })];          // the session ID has not been written yet
    objects.sessions.cs_a = { id: 'cs_a', customer: 'cus_a', metadata: marker('op_a') };
    const e = evt('checkout.session.completed', { id: 'cs_a', object: 'checkout.session' });
    expect(await e.deliver()).toEqual({ status: 503, body: { error: 'not_finished' } });
    expect(row(e.id)).toMatchObject({ status: 'failed', error_code: 'awaiting_mapping', attempts: 1 });
    expect(advanceOperation).not.toHaveBeenCalled();

    opsById().op_a.stripe_checkout_session_id = 'cs_a';                              // the mapping arrives late
    expect(await e.deliver()).toEqual({ status: 200, body: { result: 'provisioned' } });
    expect(row(e.id)).toMatchObject({ status: 'processed', operation_id: 'op_a', error_code: null });
    expect(effects.provisioned).toBe(1);
  });

  it('with nothing in the database yet, the object\'s own marker keeps it retryable rather than foreign', async () => {
    objects.sessions.cs_b = { id: 'cs_b', customer: 'cus_b', metadata: marker('op_b') };
    objects.customers.cus_b = { id: 'cus_b', metadata: marker('op_b') };
    const e = evt('checkout.session.completed', { id: 'cs_b' });
    expect((await e.deliver()).status).toBe(503);
    expect(row(e.id)).toMatchObject({ status: 'failed', error_code: 'awaiting_mapping' });
  });

  it('a subscription event for an owned customer whose subscription is not mirrored yet is not acknowledged', async () => {
    tables.billing_customers = [{ stripe_customer_id: 'cus_c' }];
    objects.subscriptions.sub_c = { id: 'sub_c', customer: 'cus_c', metadata: {}, items: { data: [] } };
    const e = evt('customer.subscription.updated', { id: 'sub_c' });
    expect((await e.deliver()).status).toBe(503);
    expect(row(e.id)).toMatchObject({ status: 'failed', error_code: 'awaiting_mapping' });
  });

  it('a renewal invoice for an unmirrored subscription that carries our marker is not acknowledged', async () => {
    objects.invoices.in_r = { id: 'in_r', customer: 'cus_r', billing_reason: 'subscription_cycle', status: 'paid', parent: { subscription_details: { subscription: 'sub_r', metadata: marker('op_r') } } };
    objects.customers.cus_r = { id: 'cus_r', metadata: {} };
    objects.subscriptions.sub_r = { id: 'sub_r', customer: 'cus_r', metadata: marker('op_r'), items: { data: [] } };
    const e = evt('invoice.paid', { id: 'in_r' });
    expect((await e.deliver()).status).toBe(503);
    expect(effects.graceClear).toBe(0);
  });
});

describe('b. duplicate delivery before and after recovery', () => {
  it('a duplicate of an unfinished event is processed again, not answered "duplicate"; after recovery it is', async () => {
    tables.checkout_operations = [opRow({ stripe_customer_id: 'cus_a' })];
    objects.sessions.cs_a = { id: 'cs_a', customer: 'cus_a', metadata: marker('op_a') };
    const e = evt('checkout.session.completed', { id: 'cs_a' });
    expect((await e.deliver()).status).toBe(503);
    expect((await e.deliver()).status).toBe(503);                                    // duplicate before recovery: still retryable
    expect(row(e.id)).toMatchObject({ status: 'failed', attempts: 2 });
    expect(await listUnfinishedEvents()).toMatchObject({ unfinished: [{ event_id: e.id, error_code: 'awaiting_mapping' }] });

    opsById().op_a.stripe_checkout_session_id = 'cs_a';
    const rec = await recoverEvent(e.id);                                             // Stripe has stopped; the operator recovers it
    expect(rec).toMatchObject({ result: 'processed', reason: 'provisioned', before: { status: 'failed' }, after: { status: 'processed' } });
    expect(await e.deliver()).toEqual({ status: 200, body: { result: 'duplicate' } }); // duplicate after recovery
    expect(await recoverEvent(e.id)).toMatchObject({ result: 'already_final' });
    expect(effects.provisioned).toBe(1);
    expect(advanceOperation).toHaveBeenCalledTimes(1);
    expect(tables.audit_logs ?? []).toEqual([]);                                      // failed → processed is ordinary progress, not a rewrite
  });
});

describe('c. busy operation, then recovery', () => {
  it('a subscription event that finds its operation busy is never recorded as processed', async () => {
    tables.checkout_operations = [opRow({ stripe_checkout_session_id: 'cs_a', stripe_customer_id: 'cus_a', lease: true })];
    objects.subscriptions.sub_a = { id: 'sub_a', customer: 'cus_a', metadata: marker('op_a'), items: { data: [] } };
    const e = evt('customer.subscription.created', { id: 'sub_a' });
    expect(await e.deliver()).toEqual({ status: 503, body: { error: 'not_finished' } });
    expect(row(e.id)).toMatchObject({ status: 'failed', error_code: 'busy', operation_id: 'op_a' });

    opsById().op_a.lease = false;
    expect(await e.deliver()).toEqual({ status: 200, body: { result: 'provisioned' } });
    expect(row(e.id).status).toBe('processed');
    expect(effects.provisioned).toBe(1);
  });

  it('a checkout event that finds its operation busy answers non-2xx and is retryable', async () => {
    tables.checkout_operations = [opRow({ stripe_checkout_session_id: 'cs_a', lease: true })];
    const e = evt('checkout.session.completed', { id: 'cs_a' });
    expect((await e.deliver()).status).toBe(503);
    expect(row(e.id)).toMatchObject({ status: 'failed', error_code: 'busy' });
  });

  it('a late "busy" from one delivery cannot undo another delivery that already finished the event', async () => {
    tables.checkout_operations = [opRow({ stripe_checkout_session_id: 'cs_a' })];
    const e = evt('checkout.session.completed', { id: 'cs_a' });
    advanceOperation.mockImplementationOnce(async () => {
      expect((await e.deliver()).status).toBe(200);                                   // a concurrent duplicate finishes first …
      return 'busy';                                                                   // … then this one sees the lease
    });
    expect((await e.deliver()).status).toBe(503);
    expect(row(e.id)).toMatchObject({ status: 'processed' });                         // not regressed to failed
    expect(effects.provisioned).toBe(1);
  });

  it('completion events whose payment is not yet settled stay retryable; a failed first invoice is final and provisions nothing', async () => {
    tables.checkout_operations = [opRow({ stripe_checkout_session_id: 'cs_a', stripe_customer_id: 'cus_a', stripe_subscription_id: 'sub_a', settled: false })];
    const done = evt('checkout.session.completed', { id: 'cs_a' });
    expect((await done.deliver()).status).toBe(503);
    expect(row(done.id)).toMatchObject({ error_code: 'awaiting_settlement' });
    objects.invoices.in_1 = { id: 'in_1', customer: 'cus_a', billing_reason: 'subscription_create', status: 'open', parent: { subscription_details: { subscription: 'sub_a', metadata: marker('op_a') } } };
    const failed = evt('invoice.payment_failed', { id: 'in_1' });
    expect(await failed.deliver()).toEqual({ status: 200, body: { result: 'pending' } });
    expect(effects.provisioned).toBe(0);
  });
});

describe('d. genuinely foreign sandbox objects', () => {
  it('a session with no database link and no marker on the session or its customer is ignored as foreign, and stays final', async () => {
    objects.sessions.cs_f = { id: 'cs_f', customer: 'cus_f', metadata: {} };
    objects.customers.cus_f = { id: 'cus_f', metadata: { source: 'e1-probe' } };
    const e = evt('checkout.session.completed', { id: 'cs_f' });
    expect(await e.deliver()).toEqual({ status: 200, body: { result: 'ignored' } });
    expect(row(e.id)).toMatchObject({ status: 'ignored', error_code: 'foreign' });
    expect(await e.deliver()).toEqual({ status: 200, body: { result: 'duplicate' } });
    expect(advanceOperation).not.toHaveBeenCalled();
    expect(reads).toHaveBeenCalledWith('customers', 'cus_f');                         // the customer was checked, not assumed
  });

  it('an object marked by another environment sharing the sandbox is foreign; a marker with no environment is not', async () => {
    objects.sessions.cs_x = { id: 'cs_x', customer: 'cus_x', metadata: marker('op_x', 'otherproject') };
    objects.customers.cus_x = { id: 'cus_x', metadata: marker('op_x', 'otherproject') };
    expect(await classifyUnmapped({ sessionId: 'cs_x' })).toEqual({ kind: 'ignored', code: 'foreign_environment' });
    objects.sessions.cs_l = { id: 'cs_l', customer: 'cus_l', metadata: marker('op_l', null) };
    objects.customers.cus_l = { id: 'cus_l', deleted: true };
    expect(await classifyUnmapped({ sessionId: 'cs_l' })).toEqual({ kind: 'retry', code: 'awaiting_mapping' });
  });

  it('a renewal invoice on a foreign subscription is ignored; a non-subscription invoice needs nothing', async () => {
    objects.invoices.in_f = { id: 'in_f', customer: 'cus_f', billing_reason: 'subscription_cycle', status: 'paid', parent: { subscription_details: { subscription: 'sub_f', metadata: {} } } };
    objects.customers.cus_f = { id: 'cus_f', metadata: {} };
    objects.subscriptions.sub_f = { id: 'sub_f', customer: 'cus_f', metadata: {}, items: { data: [] } };
    expect((await evt('invoice.paid', { id: 'in_f' }).deliver()).body).toEqual({ result: 'ignored' });
    objects.invoices.in_o = { id: 'in_o', customer: 'cus_f', billing_reason: 'manual', status: 'paid', parent: null };
    const one = evt('invoice.paid', { id: 'in_o' });
    expect((await one.deliver()).status).toBe(200);
    expect(row(one.id)).toMatchObject({ status: 'ignored', error_code: 'no_subscription' });
    expect(effects.graceClear).toBe(0);
  });

  it('an unsupported verified type is ignored with a reason and no business call', async () => {
    const e = evt('charge.succeeded', { id: 'ch_1' });
    expect(await e.deliver()).toEqual({ status: 200, body: { result: 'ignored' } });
    expect(row(e.id)).toMatchObject({ status: 'ignored', error_code: 'unsupported' });
    expect(reads).not.toHaveBeenCalled();
  });
});

describe('e. recovery of events finalised before the repair', () => {
  const seed = () => {
    tables.checkout_operations = [opRow({ stripe_checkout_session_id: 'cs_a', stripe_customer_id: 'cus_a', stripe_subscription_id: 'sub_a' })];
    const lost = evt('checkout.session.completed', { id: 'cs_a' }, 'evt_lostunmapped');
    const busy = evt('customer.subscription.created', { id: 'sub_a' }, 'evt_busyprocessed');
    objects.subscriptions.sub_a = { id: 'sub_a', customer: 'cus_a', metadata: marker('op_a'), items: { data: [] } };
    const base = { livemode: false, attempts: 0, processed_at: '2026-11-12T12:00:00.000Z' };
    tables.stripe_events = [
      { event_id: lost.id, type: 'checkout.session.completed', status: 'ignored', error_code: 'unmapped', operation_id: null, ...base },
      { event_id: busy.id, type: 'customer.subscription.created', status: 'processed', error_code: null, operation_id: 'op_a', ...base },
      { event_id: 'evt_unsupported', type: 'charge.succeeded', status: 'ignored', error_code: null, operation_id: null, ...base },
      { event_id: 'evt_mirrored', type: 'customer.subscription.updated', status: 'processed', error_code: null, operation_id: null, ...base },
    ];
    return { lost, busy };
  };

  it('lists exactly the suspect rows, and recovers each with its earlier state kept in the row and an audit record', async () => {
    const { lost, busy } = seed();
    const listed = await listUnfinishedEvents();
    expect(listed.unfinished).toEqual([]);
    expect(listed.suspect.map((r) => r.event_id)).toEqual([lost.id, busy.id]);

    expect(await recoverEvent(lost.id)).toMatchObject({ result: 'processed', reason: 'provisioned', before: { status: 'ignored', error_code: 'unmapped' } });
    expect(row(lost.id)).toMatchObject({ status: 'processed', operation_id: 'op_a', error_code: 'recovered_from_ignored_unmapped' });
    expect(await recoverEvent(busy.id)).toMatchObject({ result: 'processed', before: { status: 'processed', operation_id: 'op_a' } });
    expect(row(busy.id)).toMatchObject({ status: 'processed', error_code: 'recovered_from_processed' });

    expect(tables.audit_logs).toHaveLength(2);
    expect(tables.audit_logs[0]).toMatchObject({ table_name: 'stripe_events', row_id: lost.id, action: 'update', actor_role: 'service_role', old_data: { status: 'ignored', error_code: 'unmapped' }, new_data: { status: 'processed' }, context: { fn: 'stripe_event_recovery', via: 'recovery' } });
    expect((await listUnfinishedEvents()).suspect).toEqual([]);                       // recovered rows are no longer suspect
    expect(effects.provisioned).toBe(1);                                               // two recoveries, one provisioning
  });

  it('refuses final rows that are not suspect, unknown IDs, malformed IDs and a type mismatch; changes nothing', async () => {
    seed();
    expect(await recoverEvent('evt_unsupported')).toMatchObject({ result: 'already_final' });
    expect(await recoverEvent('evt_mirrored')).toMatchObject({ result: 'already_final' });
    expect(await recoverEvent('evt_nothere')).toEqual({ result: 'unknown_event' });
    expect(await recoverEvent("evt_x'; drop")).toEqual({ result: 'invalid_id' });
    objects.events.evt_lostunmapped = { ...objects.events.evt_lostunmapped, type: 'invoice.paid' };
    expect(await recoverEvent('evt_lostunmapped')).toMatchObject({ result: 'refused' });
    expect(row('evt_lostunmapped')).toMatchObject({ status: 'ignored', error_code: 'unmapped' });
    expect(tables.audit_logs ?? []).toEqual([]);
  });

  it('a redelivery of a pre-repair "ignored/unmapped" event is processed again and audited, not answered "duplicate"', async () => {
    const { lost } = seed();
    const body = JSON.stringify(objects.events[lost.id]);
    expect(await handleStripeWebhook(body, sign(body))).toEqual({ status: 200, body: { result: 'provisioned' } });
    expect(row(lost.id)).toMatchObject({ status: 'processed', error_code: 'recovered_from_ignored_unmapped' });
    expect(tables.audit_logs[0]).toMatchObject({ row_id: lost.id, context: { via: 'webhook' } });
  });

  it('when the audit record cannot be written, the row keeps its earlier state and the attempt fails', async () => {
    const { lost } = seed();
    auditFails = true;
    await expect(recoverEvent(lost.id)).rejects.toThrow('audit');
    expect(row(lost.id)).toMatchObject({ status: 'failed', error_code: 'audit_failed' });   // visible and retryable, never silently final
    auditFails = false;
    expect(await recoverEvent(lost.id)).toMatchObject({ result: 'processed' });
  });
});

describe('f. no duplicate provisioning or billing effects', () => {
  it('distinct and repeated events, busy retries and recoveries for one purchase provision once and never call a Stripe mutation', async () => {
    tables.checkout_operations = [opRow({ stripe_checkout_session_id: 'cs_a', stripe_customer_id: 'cus_a', stripe_subscription_id: 'sub_a', lease: true })];
    objects.subscriptions.sub_a = { id: 'sub_a', customer: 'cus_a', metadata: marker('op_a'), items: { data: [] } };
    objects.invoices.in_1 = { id: 'in_1', customer: 'cus_a', billing_reason: 'subscription_create', status: 'paid', parent: { subscription_details: { subscription: 'sub_a', metadata: marker('op_a') } } };
    const all = [evt('checkout.session.completed', { id: 'cs_a' }), evt('invoice.paid', { id: 'in_1' }), evt('customer.subscription.created', { id: 'sub_a' })];
    for (const e of all) expect((await e.deliver()).status).toBe(503);              // busy: nothing acknowledged
    opsById().op_a.lease = false;
    for (const e of all) expect((await e.deliver()).status).toBe(200);
    for (const e of all) expect(await e.deliver()).toEqual({ status: 200, body: { result: 'duplicate' } });
    for (const e of all) expect(await recoverEvent(e.id)).toMatchObject({ result: 'already_final' });
    expect(effects.provisioned).toBe(1);
    // A renewal invoice paid twice (distinct event IDs) and recovered applies the same idempotent SQL; no new grace.
    objects.invoices.in_2 = { id: 'in_2', customer: 'cus_a', billing_reason: 'subscription_cycle', status: 'paid', parent: { subscription_details: { subscription: 'sub_a', metadata: marker('op_a') } } };
    for (const e of [evt('invoice.paid', { id: 'in_2' }), evt('invoice.paid', { id: 'in_2' })]) expect((await e.deliver()).body).toEqual({ result: 'renewal' });
    expect(effects.graceStart).toBe(0);
    expect(effects.provisioned).toBe(1);
    // The fake client exposes retrieval only; a create/update/cancel would have thrown and failed the delivery.
    expect(() => (fakeStripe as unknown as Record<string, unknown>).refunds).toThrow('not available');
  });

  it('checkout writes the ownership marker, including this database, on the customer, session and subscription', () => {
    const text = readFileSync(join(__dirname, '..', 'server', 'checkout.ts'), 'utf8');
    expect(text).toMatch(/const marker = \(operationId: string\) => \(\{ apbm_operation: operationId, apbm_run: RUN_TAG, apbm_db: ENV_TAG\(\) \}\)/);
    expect((text.match(/metadata: marker\(op\.id\)/g) || []).length).toBe(3);
  });
});

describe('G5 renewal reminder record (Amendment A1-3, AC-031)', () => {
  it('a failed renewal records one pending reminder for the owner, whatever the number of events; no email is sent', async () => {
    tables.subscriptions = [{ stripe_subscription_id: 'sub_a', account_id: 'acct_1', origin: 'stripe' }];
    tables.accounts = [{ id: 'acct_1', owner_user_id: 'user_owner' }];
    objects.subscriptions.sub_a = { id: 'sub_a', customer: 'cus_a', metadata: marker('op_a'), items: { data: [] } };
    objects.invoices.in_9 = { id: 'in_9', customer: 'cus_a', billing_reason: 'subscription_cycle', status: 'open', attempted: true, parent: { subscription_details: { subscription: 'sub_a', metadata: marker('op_a') } } };
    for (const e of [evt('invoice.payment_failed', { id: 'in_9' }), evt('invoice.payment_failed', { id: 'in_9' })]) expect((await e.deliver()).body).toEqual({ result: 'renewal' });
    expect(tables.notification_operations).toEqual([{ kind: 'renewal_reminder', dedupe_key: 'renewal_reminder:in_9', account_id: 'acct_1', user_id: 'user_owner', status: 'pending', last_error_code: 'email_deferred_007b' }]);
    expect(effects.graceStart).toBe(2);                                                // SQL keeps the first start; it never restarts
  });
  it('a paid renewal invoice records no reminder', async () => {
    tables.subscriptions = [{ stripe_subscription_id: 'sub_a', account_id: 'acct_1', origin: 'stripe' }];
    objects.subscriptions.sub_a = { id: 'sub_a', customer: 'cus_a', metadata: {}, items: { data: [] } };
    objects.invoices.in_8 = { id: 'in_8', customer: 'cus_a', billing_reason: 'subscription_cycle', status: 'paid', parent: { subscription_details: { subscription: 'sub_a', metadata: {} } } };
    await evt('invoice.paid', { id: 'in_8' }).deliver();
    expect(tables.notification_operations ?? []).toEqual([]);
  });
});

describe('ledger state rules', () => {
  it('final means processed, or ignored for a reason other than the pre-repair "unmapped"', () => {
    expect(isFinal({ status: 'processed', error_code: null })).toBe(true);
    expect(isFinal({ status: 'ignored', error_code: 'foreign' })).toBe(true);
    expect(isFinal({ status: 'ignored', error_code: 'unmapped' })).toBe(false);
    expect(isFinal({ status: 'failed', error_code: 'busy' })).toBe(false);
    expect(isFinal({ status: 'received', error_code: null })).toBe(false);
    expect(isSuspect({ status: 'processed', error_code: 'recovered_from_processed', type: 'customer.subscription.created', operation_id: 'op' })).toBe(false);
  });
});
