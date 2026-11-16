/** @jest-environment node */
// APBM007A F-Q4-003 (AC-016/AC-017) and F-Q4-004 — concurrent advances of one paid operation, as the webhook deliveries
// and the status poll of one server process produce them. The real provisioning module runs against an in-memory model
// whose SQL functions follow 0057/0058 exactly where it matters: operation_lease grants the lease when it is free,
// expired, or already held by the SAME owner; provision_paid_registration refuses any status other than paid or
// provisioning ('not_paid') and creates the account, store, admin assignment, customer mapping and subscription once.
// Auth is a controlled substitute (admin create + admin user listing); no real identity is created. The mailer follows
// Supabase's per-address interval: a second link for the same address within 60 s is refused with 429.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an untyped in-memory model of database rows, read field by field
type Row = Record<string, any>;
const db: Record<string, Row[]> = {};
const hooks: { afterCreateUser?: () => Promise<void>; beforeProvision?: () => Promise<void> } = {};
const history: Row[] = [];
function builder(table: string) {
  const filters: ((r: Row) => boolean)[] = [];
  let mode: 'select' | 'insert' | 'update' = 'select';
  let payload: Row = {};
  const rows = () => (db[table] ??= []);
  const run = () => {
    if (mode === 'insert') {
      if (table === 'notification_operations' && rows().some((r) => r.dedupe_key === payload.dedupe_key)) return { data: null, error: { code: '23505' } };
      const row = { id: `${table}-${rows().length + 1}`, attempts: 0, status: 'pending', updated_at: new Date().toISOString(), ...payload };
      rows().push(row);
      return { data: [{ ...row }], error: null };
    }
    const hit = rows().filter((r) => filters.every((f) => f(r)));
    if (mode === 'update') {
      hit.forEach((r) => {
        Object.assign(r, payload, table === 'notification_operations' ? { updated_at: new Date().toISOString() } : {});
        if (table === 'checkout_operations') history.push({ ...payload });
      });
    }
    return { data: hit.map((r) => ({ ...r })), error: null };
  };
  const first = () => { const r = run(); return { data: r.data?.[0] ?? null, error: r.error }; };
  const api: Row = {
    select: () => api, insert: (p: Row) => { mode = 'insert'; payload = p; return api; }, update: (p: Row) => { mode = 'update'; payload = p; return api; },
    eq: (k: string, v: unknown) => { filters.push((r) => r[k] === v); return api; },
    in: (k: string, v: unknown[]) => { filters.push((r) => v.includes(r[k])); return api; },
    order: () => api, limit: () => api, maybeSingle: async () => first(), single: async () => first(),
    then: (ok: (v: unknown) => unknown, bad?: (e: unknown) => unknown) => Promise.resolve(run()).then(ok, bad),
  };
  return api;
}
const users: Row[] = [];
let createCalls = 0;
async function rpcImpl(fn: string, a: Row) {
  const op = (db.checkout_operations ??= []).find((o) => o.id === a.p_operation)!;
  if (fn === 'operation_lease') {
    const free = op.lease_owner == null || op.lease_owner === a.p_owner || Date.parse(op.lease_expires_at) <= Date.now();
    if (!free) return false;
    Object.assign(op, { lease_owner: a.p_owner, lease_expires_at: new Date(Date.now() + a.p_seconds * 1000).toISOString(), attempts: (op.attempts ?? 0) + 1 });
    return true;
  }
  if (fn === 'provision_paid_registration') {
    await hooks.beforeProvision?.();
    if (op.status === 'provisioned') return { outcome: 'already_provisioned' };
    if (!['paid', 'provisioning'].includes(op.status)) return { outcome: 'not_paid' };
    if (!users.some((u) => u.id === a.p_owner_user)) return { outcome: 'owner_missing' };
    if ((db.accounts ??= []).some((x) => x.owner_user_id === a.p_owner_user)) return { outcome: 'owner_has_account' };
    const account = { id: `acc-${db.accounts.length + 1}`, owner_user_id: a.p_owner_user };
    db.accounts.push(account);
    (db.businesses ??= []).push({ id: `biz-${db.businesses.length + 1}`, account_id: account.id, npi: op.npi });
    (db.user_businesses ??= []).push({ user_id: a.p_owner_user, business_id: db.businesses.at(-1)!.id, role: 'admin' });
    (db.billing_customers ??= []).push({ account_id: account.id, stripe_customer_id: a.p_sub.customer_id });
    (db.subscriptions ??= []).push({ account_id: account.id, stripe_subscription_id: a.p_sub.subscription_id });
    Object.assign(op, { status: 'provisioned', owner_user_id: a.p_owner_user, account_id: account.id, business_id: db.businesses.at(-1)!.id, lease_owner: null, lease_expires_at: null, last_error_code: null });
    history.push({ status: 'provisioned' });
    db.registration_drafts.find((d) => d.id === op.draft_id)!.status = 'provisioned';
    return { outcome: 'provisioned' };
  }
  return null;
}
jest.mock('@/server/db', () => ({
  admin: () => ({
    from: (t: string) => builder(t),
    auth: { admin: { createUser: async (p: Row) => {
      createCalls++;
      if (users.some((u) => u.email === p.email)) return { data: null, error: { status: 422, code: 'email_exists' } };
      const u = { id: `user-${users.length + 1}`, email: p.email, created_at: new Date().toISOString(), app_metadata: p.app_metadata ?? {} };
      users.push(u);
      await hooks.afterCreateUser?.();
      return { data: { user: { id: u.id } }, error: null };
    } } },
  }),
  rpc: (fn: string, a: Row) => rpcImpl(fn, a),
  bytea: (b: Buffer) => '\\x' + b.toString('hex'),
}));
const mailLog: { email: string; at: number; result: string }[] = [];
jest.mock('@/server/accessEmail', () => ({
  sendSignInLink: async (email: string) => {
    await Promise.resolve();
    const recent = mailLog.some((m) => m.email === email && m.result === 'ok' && Date.now() - m.at < 60_000);
    mailLog.push({ email, at: Date.now(), result: recent ? '429' : 'ok' });
    return recent ? { ok: false, code: '429:over_email_send_rate_limit' } : { ok: true };
  },
}));

import { __setStripeForTests } from '@/server/stripeClient';
import { advanceOperation, ensureAccessNotification } from '@/server/provisioning';
import { reconcileOne } from '@/server/operator';

const EMAIL = 'new.owner.r05@example.test';
const sub = {
  id: 'sub_1', customer: 'cus_1', status: 'active', cancel_at_period_end: false, cancel_at: null, metadata: {},
  items: { data: [{ id: 'si_1', price: { id: 'price_unit' }, quantity: 1, current_period_start: 1794480000, current_period_end: 1797158400 }] },
  latest_invoice: { id: 'in_1', status: 'paid', currency: 'usd', amount_paid: 8910 },
};
global.fetch = (async (url: string) => {
  const email = decodeURIComponent(String(url).split('filter=')[1] ?? '');
  return { ok: true, status: 200, json: async () => ({ users: users.filter((u) => u.email === email).map((u) => ({ ...u })) }) };
}) as unknown as typeof fetch;

function seed(over: Row = {}) {
  db.registration_drafts = [{ id: 'draft-1', status: 'checkout_started', owner_email: EMAIL, owner_first_name: 'New', owner_last_name: 'Owner', signed_in_user_id: null }];
  db.checkout_operations = [{
    id: '25acbfb9-0000-4000-8000-000000000001', draft_id: 'draft-1', status: 'checkout_open', npi: '1234567893', expected_price_id: 'price_unit', expected_total_cents: 8910,
    stripe_customer_id: 'cus_1', stripe_checkout_session_id: 'cs_1', stripe_subscription_id: null, stripe_invoice_id: null, owner_user_id: null, owner_was_existing: null,
    account_id: null, business_id: null, last_error_code: null, lease_owner: null, lease_expires_at: null, attempts: 0, created_at: new Date(Date.now() - 60_000).toISOString(), ...over,
  }];
  for (const t of ['accounts', 'businesses', 'user_businesses', 'billing_customers', 'subscriptions', 'notification_operations']) db[t] = [];
}
const op = () => db.checkout_operations[0];
const OP_ID = '25acbfb9-0000-4000-8000-000000000001';
const counts = () => ({ users: users.length, accounts: db.accounts.length, stores: db.businesses.length, admins: db.user_businesses.length, mappings: db.billing_customers.length, subscriptions: db.subscriptions.length });
const ONE = { users: 1, accounts: 1, stores: 1, admins: 1, mappings: 1, subscriptions: 1 };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

beforeAll(() => {
  Object.assign(process.env, { STRIPE_SECRET_KEY: 'sk_test_unit', STRIPE_PRICE_STORES: 'price_unit', STRIPE_PORTAL_CONFIGURATION: 'bpc_unit', STRIPE_EXPECTED_ACCOUNT: 'acct_unit', STRIPE_WEBHOOK_SECRET: 'whsec_unit', NEXT_PUBLIC_SUPABASE_URL: 'https://unitproject.supabase.co', SUPABASE_SECRET_KEY: 'unit-server-key' });
});
beforeEach(() => {
  users.length = 0; createCalls = 0; mailLog.length = 0; history.length = 0; delete hooks.afterCreateUser; delete hooks.beforeProvision;
  seed();
  __setStripeForTests({
    checkout: { sessions: { retrieve: async () => ({ id: 'cs_1', livemode: false, mode: 'subscription', client_reference_id: op().id, customer: 'cus_1', status: 'complete', payment_status: 'paid', subscription: 'sub_1' }) } },
    subscriptions: { retrieve: async () => JSON.parse(JSON.stringify(sub)) },
  }, true);
});

describe('F-Q4-003 — concurrent events and polls converge on one provisioning outcome', () => {
  it('three webhook events and a status poll at once: provisioned once, exactly one identity, account, store, admin, mapping and subscription', async () => {
    const results = await Promise.all([advanceOperation(OP_ID), advanceOperation(OP_ID), advanceOperation(OP_ID), advanceOperation(OP_ID)]);
    expect(results).toEqual(['provisioned', 'provisioned', 'provisioned', 'provisioned']);
    expect(op()).toMatchObject({ status: 'provisioned', owner_user_id: 'user-1', owner_was_existing: false, last_error_code: null, lease_owner: null });
    expect(counts()).toEqual(ONE);
    expect(createCalls).toBe(1);
    expect(users[0].app_metadata).toEqual({ apbm_operation: OP_ID });   // provenance is set at creation
    expect(history.some((h) => h.last_error_code === 'owner_signin_required' || h.owner_was_existing === true)).toBe(false);
  });

  it('the interleaving behind DEV operation 25acbfb9: a second run starting after the identity was created cannot reclassify it or break provisioning', async () => {
    let second: Promise<string> | null = null;
    hooks.afterCreateUser = async () => { second ??= advanceOperation(OP_ID); };
    hooks.beforeProvision = async () => { await Promise.race([second, sleep(400)]); };   // give the competing run every chance to interfere
    const first = await advanceOperation(OP_ID);
    expect([first, await second]).toEqual(['provisioned', 'provisioned']);
    expect(op()).toMatchObject({ status: 'provisioned', owner_was_existing: false, owner_user_id: 'user-1' });
    expect(counts()).toEqual(ONE);
    expect(history.some((h) => h.status === 'attention')).toBe(false);
  });

  it('a run that lost its lease mid-way writes nothing; the run that took over stands', async () => {
    let takeover: Promise<string> | null = null;
    hooks.afterCreateUser = async () => {
      if (takeover) return;
      op().lease_expires_at = new Date(Date.now() - 1000).toISOString();   // the first run stalled past its lease
      takeover = advanceOperation(OP_ID, { waitMs: 0 });
      await takeover;
    };
    const stale = await advanceOperation(OP_ID);
    expect([stale, await takeover]).toEqual(['busy', 'provisioned']);
    expect(op()).toMatchObject({ status: 'provisioned', owner_user_id: 'user-1', owner_was_existing: false });
    expect(counts()).toEqual(ONE);
  });

  it('a crash after the identity was created, before it was recorded: the next run recognises its own identity and provisions once', async () => {
    hooks.afterCreateUser = async () => { delete hooks.afterCreateUser; throw new Error('process died'); };
    await expect(advanceOperation(OP_ID)).rejects.toThrow('process died');
    expect(op()).toMatchObject({ owner_user_id: null, lease_owner: null });
    expect(await advanceOperation(OP_ID)).toBe('provisioned');
    expect(op()).toMatchObject({ owner_user_id: 'user-1', owner_was_existing: false });
    expect(counts()).toEqual(ONE);
    expect(createCalls).toBe(1);
  });

  it('a genuinely pre-existing identity still has to sign in; after sign-in it is attached once', async () => {
    users.push({ id: 'user-existing', email: EMAIL, created_at: new Date(Date.now() - 86_400_000).toISOString(), app_metadata: {} });
    expect(await advanceOperation(OP_ID)).toBe('attention');
    expect(op()).toMatchObject({ status: 'attention', last_error_code: 'owner_signin_required', owner_was_existing: true, account_id: null });
    expect(db.accounts).toHaveLength(0);
    db.registration_drafts[0].signed_in_user_id = 'user-existing';   // the owner proved control by signing in
    expect(await advanceOperation(OP_ID)).toBe('provisioned');
    expect(op()).toMatchObject({ owner_user_id: 'user-existing', owner_was_existing: true });
    expect(counts()).toEqual(ONE);
    expect(createCalls).toBe(0);
  });

  it('an identity created by another operation is not this operation\'s, even if it appeared after it began', async () => {
    users.push({ id: 'user-other', email: EMAIL, created_at: new Date().toISOString(), app_metadata: { apbm_operation: 'another-operation' } });
    expect(await advanceOperation(OP_ID)).toBe('attention');
    expect(op()).toMatchObject({ last_error_code: 'owner_signin_required', owner_was_existing: true });
  });

  it('payment truth survives a recoverable failure: a later run re-reads Stripe and finishes', async () => {
    hooks.beforeProvision = async () => { delete hooks.beforeProvision; throw new Error('database unavailable'); };
    await expect(advanceOperation(OP_ID)).rejects.toThrow('database unavailable');
    expect(op()).toMatchObject({ status: 'provisioning', stripe_subscription_id: 'sub_1', owner_user_id: 'user-1' });
    expect(await advanceOperation(OP_ID)).toBe('provisioned');
    expect(counts()).toEqual(ONE);
  });
});

describe('F-Q4-003 — recovery of an operation left by the race (equivalent of DEV 25acbfb9)', () => {
  const raced = () => {
    seed({ status: 'attention', last_error_code: 'not_paid', owner_user_id: 'user-1', owner_was_existing: true, stripe_subscription_id: 'sub_1', stripe_invoice_id: 'in_1' });
    users.push({ id: 'user-1', email: EMAIL, created_at: new Date(Date.now() - 30_000).toISOString(), app_metadata: {} });   // created by the old code: no marker
    db.notification_operations.push({ id: 'n-1', dedupe_key: `access:${OP_ID}`, kind: 'access_link', status: 'sent', attempts: 1, operation_id: OP_ID, user_id: 'user-1', updated_at: new Date(Date.now() - 120_000).toISOString() });
  };

  it('operator reconcile provisions it once for its own identity; repeating changes nothing; no second identity or email', async () => {
    raced();
    const first = await reconcileOne(OP_ID);
    expect(first).toMatchObject({ result: 'provisioned', before: 'attention', after: 'provisioned', lastErrorCode: null });
    expect(op()).toMatchObject({ owner_user_id: 'user-1', owner_was_existing: false });
    expect(counts()).toEqual(ONE);
    const again = await reconcileOne(OP_ID);
    expect(again).toMatchObject({ result: 'provisioned', before: 'provisioned', after: 'provisioned' });
    expect(counts()).toEqual(ONE);
    expect(createCalls).toBe(0);
    expect(mailLog).toEqual([]);   // the access email was already sent; recovery does not send another
  });

  it('the same row is NOT recovered if its identity existed before the operation began (existing-owner protection)', async () => {
    raced();
    users[0].created_at = new Date(Date.now() - 86_400_000).toISOString();
    expect((await reconcileOne(OP_ID)).result).toBe('attention');
    expect(op()).toMatchObject({ last_error_code: 'owner_signin_required', account_id: null });
    expect(db.accounts).toHaveLength(0);
  });

  it('nor if the purchaser was signed in as someone else at checkout', async () => {
    raced();
    db.registration_drafts[0].signed_in_user_id = 'user-someone-else';
    expect((await reconcileOne(OP_ID)).result).toBe('attention');
    expect(db.accounts).toHaveLength(0);
  });
});

describe('F-Q4-004 — one access email per attempt, even under concurrency', () => {
  it('concurrent advances send one link, and the result stays "sent"', async () => {
    await Promise.all([advanceOperation(OP_ID), advanceOperation(OP_ID), advanceOperation(OP_ID)]);
    expect(mailLog.map((m) => m.result)).toEqual(['ok']);
    expect(db.notification_operations).toEqual([expect.objectContaining({ kind: 'access_link', status: 'sent', attempts: 1, last_error_code: null })]);
  });

  it('two direct calls at the same moment (poll and resend) claim one attempt: one send, no 429 overwrite', async () => {
    await advanceOperation(OP_ID);
    mailLog.length = 0;
    const row = db.notification_operations[0];
    Object.assign(row, { status: 'failed', last_error_code: '429', updated_at: new Date(Date.now() - 120_000).toISOString() });
    const done = { ...op() } as never;
    const results = await Promise.all([ensureAccessNotification(done, { resend: true }), ensureAccessNotification(done, { resend: true })]);
    expect(mailLog.map((m) => m.result)).toEqual(['ok']);
    expect(results.filter((r) => r === 'sent')).toHaveLength(1);
    expect(row).toMatchObject({ status: 'sent', attempts: 2, last_error_code: null });
  });

  it('a genuine provider refusal is recorded with its code and is not retried within the interval', async () => {
    mailLog.push({ email: EMAIL, at: Date.now(), result: 'ok' });   // a link for this address went out moments ago
    await advanceOperation(OP_ID);
    expect(db.notification_operations[0]).toMatchObject({ status: 'failed', attempts: 1, last_error_code: '429:over_email_send_rate_limit' });
    expect(await ensureAccessNotification({ ...op() } as never)).toBe('failed');   // within 60 s: no new request
    expect(mailLog.filter((m) => m.result === '429')).toHaveLength(1);
  });
});
