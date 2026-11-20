/** @jest-environment node */
// APBM-007B — pricing rules, mail guard, billing-notice dispatch outcomes and Add Store route guards.
import { incrementalCents, windowRefusal, nextRenewalCents, paymentDeadline, STRIPE_MIN_CHARGE_USD_CENTS } from '@/server/storePricing';
import { mailAllowed, guardDecision } from '@/server/mailGuard';

const rpcCalls: { fn: string; args: Record<string, unknown> }[] = [];
let rpcImpl: (fn: string, args: Record<string, unknown>) => unknown = () => null;
jest.mock('@/server/db', () => ({ rpc: async (fn: string, args: Record<string, unknown>) => { rpcCalls.push({ fn, args }); return rpcImpl(fn, args); }, admin: () => ({}) }));

const T = (iso: string) => Math.floor(Date.parse(iso) / 1000);
const S = T('2026-11-16T00:00:00Z'), E = T('2026-12-16T00:00:00Z');

describe('Add Store pricing (BILLING.md; same vectors as the 0062 SQL self-check)', () => {
  it('half-up integer remaining-period price; midpoint is half the additional unit', () => {
    expect(incrementalCents(4900, S, E, T('2026-12-01T00:00:00Z'))).toBe(2450);
    expect(incrementalCents(4900, S, E, S)).toBe(4900);
    expect(incrementalCents(4900, S, E, E)).toBe(0);
    expect(incrementalCents(4900, S, E, S - 999)).toBe(4900);          // clamped to the period
    expect(() => incrementalCents(4900, E, S, S)).toThrow();
    expect(() => incrementalCents(0, S, E, S)).toThrow();
  });
  it('shared window: refuse inside 90 minutes, and below the 50-cent provider minimum', () => {
    expect(STRIPE_MIN_CHARGE_USD_CENTS).toBe(50);
    expect(windowRefusal(4900, S, E, T('2026-12-15T23:00:00Z'))).toBe('period_end_window');
    expect(windowRefusal(4900, S, E, T('2026-12-15T18:00:00Z'))).toBe('below_minimum_charge');
    expect(windowRefusal(4900, S, E, T('2026-12-15T16:00:00Z'))).toBeNull();
  });
  it('renewal total and the fixed payment deadline', () => {
    expect(nextRenewalCents(4900, 3)).toBe(19700);
    expect(paymentDeadline(S, E)).toBe(S + 1800);
    expect(paymentDeadline(E - 5000, E)).toBe(E - 3600);               // never later than 60 minutes before period end
  });
});

describe('mail guard (default on, exact allowlist, no wildcard, cannot be switched off)', () => {
  const env = { ...process.env };
  afterEach(() => { process.env = { ...env }; });
  it('absent or empty allowlist denies everyone', () => {
    delete process.env.MAIL_ALLOWLIST; expect(mailAllowed('a@b.co')).toBe(false);
    process.env.MAIL_ALLOWLIST = ''; expect(mailAllowed('a@b.co')).toBe(false);
  });
  it('exact normalized match only; wildcards ignored; MAIL_GUARD=off has no effect', () => {
    process.env.MAIL_ALLOWLIST = ' Owner@Example.com ,*@example.com'; process.env.MAIL_GUARD = 'off';
    expect(mailAllowed('owner@example.com')).toBe(true);
    expect(mailAllowed('other@example.com')).toBe(false);
    expect(guardDecision('x@y.zz')).toEqual({ allowed: false, reason: 'blocked_not_allowlisted' });
  });
});

describe('billing notice dispatch', () => {
  const env = { ...process.env };
  const claim = { id: 'n1', epoch: 3, kind: 'renewal_payment_failed', invoice_id: 'in_1', to: 'owner@example.com', grace_ends_at: '2026-12-23T17:00:00Z', amount_due_cents: 14800, attempt: 1, account_id: 'a' };
  let sent: { key: string; to: string; subject: string; text: string }[] = [];
  let status = 200;
  beforeEach(async () => {
    rpcCalls.length = 0; sent = []; status = 200;
    process.env = { ...env, MAIL_ALLOWLIST: 'owner@example.com', RESEND_API_KEY: 're_test_placeholder', NEXT_PUBLIC_APP_ENV: 'local' };
    rpcImpl = (fn) => (fn === 'notices_due' ? ['n1'] : fn === 'notice_claim' ? claim : 'recorded');
    const m = await import('@/server/billingNotices');
    m.__setNoticeSenderForTests(async (r) => { sent.push(r); return { status, id: status < 300 ? 'msg_1' : undefined }; });
  });
  afterAll(() => { process.env = { ...env }; });
  const finish = () => rpcCalls.find((c) => c.fn === 'notice_finish')!.args;

  it('sends once with the stable (kind, invoice) idempotency key and a truthful deadline and billing link', async () => {
    const { dispatchDueNotices } = await import('@/server/billingNotices');
    const r = await dispatchDueNotices();
    expect(r.sent).toBe(1);
    expect(sent[0].key).toBe('renewal_payment_failed/in_1');
    expect(sent[0].text).toContain('$148.00');
    expect(sent[0].text).toContain('http://localhost:3001/billing');
    expect(finish()).toMatchObject({ p_outcome: 'sent', p_message_id: 'msg_1', p_epoch: 3 });
  });
  // Manual QA 19 Nov 2026 (R10): the explicit DEV-only open policy reaches the real notice path, and fails closed elsewhere.
  it('open policy on the DEV/alpha project: a plus-alias owner outside the allowlist is sent through the same path', async () => {
    Object.assign(process.env, { MAIL_ALLOWLIST: '', MAIL_RECIPIENT_POLICY: 'open', NEXT_PUBLIC_SUPABASE_URL: 'https://yrsuwikjnbmvpznrgydb.supabase.co' });
    rpcImpl = (fn) => (fn === 'notices_due' ? ['n1'] : fn === 'notice_claim' ? { ...claim, to: 'moose+alpha01-owner@cyberizegroup.com' } : 'recorded');
    const { dispatchDueNotices } = await import('@/server/billingNotices');
    const r = await dispatchDueNotices();
    expect(r.sent).toBe(1); expect(sent[0].to).toBe('moose+alpha01-owner@cyberizegroup.com'); expect(sent[0].key).toBe('renewal_payment_failed/in_1');
  });
  it('open policy on any other project is ignored: blocked locally, no provider request', async () => {
    Object.assign(process.env, { MAIL_ALLOWLIST: '', MAIL_RECIPIENT_POLICY: 'open', NEXT_PUBLIC_SUPABASE_URL: 'https://ihgcsrypblqkwommrkgj.supabase.co' });
    const { dispatchDueNotices } = await import('@/server/billingNotices');
    const r = await dispatchDueNotices();
    expect(r.blocked).toBe(1); expect(sent).toHaveLength(0);
    expect(finish()).toMatchObject({ p_outcome: 'attention', p_error: 'mail_guard_blocked' });
  });
  it('a recipient outside the allowlist is blocked locally: no provider request, attention recorded', async () => {
    process.env.MAIL_ALLOWLIST = 'someone-else@example.com';
    const { dispatchDueNotices } = await import('@/server/billingNotices');
    const r = await dispatchDueNotices();
    expect(r.blocked).toBe(1); expect(sent).toHaveLength(0);
    expect(finish()).toMatchObject({ p_outcome: 'attention', p_error: 'mail_guard_blocked' });
  });
  it('provider 429/5xx → bounded retry with the same key; 4xx refusal → attention', async () => {
    const { dispatchDueNotices } = await import('@/server/billingNotices');
    status = 503; await dispatchDueNotices(); expect(finish()).toMatchObject({ p_outcome: 'retry', p_error: 'http_503' });
    rpcCalls.length = 0; status = 422; await dispatchDueNotices(); expect(finish()).toMatchObject({ p_outcome: 'attention', p_error: 'http_422' });
  });
  it('a suppressed claim (recovery committed first) sends nothing', async () => {
    rpcImpl = (fn) => (fn === 'notices_due' ? ['n1'] : fn === 'notice_claim' ? { error: 'suppressed' } : 'recorded');
    const { dispatchDueNotices } = await import('@/server/billingNotices');
    const r = await dispatchDueNotices();
    expect(r.suppressed).toBe(1); expect(sent).toHaveLength(0);
  });
  it('missing sender key → attention, never a fallback through sign-in mail', async () => {
    delete process.env.RESEND_API_KEY;
    const { dispatchDueNotices } = await import('@/server/billingNotices');
    await dispatchDueNotices();
    expect(sent).toHaveLength(0); expect(finish()).toMatchObject({ p_outcome: 'attention', p_error: 'sender_not_configured' });
  });
});

describe('operator commands (typed, audited)', () => {
  beforeEach(() => { rpcCalls.length = 0; rpcImpl = (fn) => (fn === 'operator_action_record' ? 41 : null); });
  it('an apply without actor/reason/ticket is refused AND audited as shared_operator_v1 with the refusal', async () => {
    const { runOperator } = await import('@/server/operator007b');
    const r = await runOperator({ action: 'store-admin-set', apply: true, businessId: '00000000-0000-4000-8000-000000000001', userId: '00000000-0000-4000-8000-000000000002' });
    expect(r).toMatchObject({ result: 'refused', error: 'actor_reason_ticket_required', auditId: 41 });
    const audit = rpcCalls.find((c) => c.fn === 'operator_action_record')!.args;
    expect(audit).toMatchObject({ p_phase: 'apply', p_result: 'refused', p_error: 'actor_reason_ticket_required', p_ticket: 'MISSING-TICKET' });
    expect(rpcCalls.some((c) => c.fn === 'store_admin_set')).toBe(false);
  });
  it('an unknown action is refused without touching the database', async () => {
    const { runOperator } = await import('@/server/operator007b');
    expect(await runOperator({ action: 'drop-everything' as never })).toMatchObject({ result: 'refused', error: 'unknown_action' });
    expect(rpcCalls).toHaveLength(0);
  });
});
