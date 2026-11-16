/** @jest-environment node */
// APBM007A — proof that tests cannot send mail through the portal's access-email path.
// Background: an earlier integration run patched a provider class that was not the one in use, and six sign-in link
// requests reached a real mailer. This file proves, without any network or database:
//   1. CONTROL — the real call path really does issue the provider's mail request (so the tripwire below would see it);
//   2. the module replacement used by the integration test intercepts that exact path: the mock is hit, no mail request is made;
//   3. the same network tripwire the integration test installs refuses every mail-sending Auth endpoint.
const MAIL_ENDPOINTS = /\/auth\/v1\/(otp|magiclink|recover|invite|resend|signup)(\?|$)/;
const seen: string[] = [];
const tripwire = jest.fn(async (input: unknown) => {
  const url = String((input as { url?: string })?.url ?? input);
  seen.push(url.replace(/\?.*$/, ''));
  if (MAIL_ENDPOINTS.test(url)) throw new Error('TRIPWIRE: a test tried to send mail');
  return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
});

type Row = Record<string, unknown>;
const tables: Record<string, Row[]> = { registration_drafts: [{ id: 'd1', owner_email: 'owner@example.invalid', signed_in_user_id: null }], notification_operations: [] };
function builder(table: string) {
  const filters: [string, unknown][] = []; let mode = 'select'; let payload: Row = {};
  const match = () => tables[table].filter((r) => filters.every(([k, v]) => r[k] === v));
  const run = () => {
    if (mode === 'insert') { const row = { id: 'n1', attempts: 0, updated_at: new Date(0).toISOString(), ...payload }; tables[table].push(row); return { data: row, error: null }; }
    if (mode === 'update') { const hit = match(); hit.forEach((r) => Object.assign(r, payload)); return { data: hit[0] ?? null, error: null }; }   // like the real client: the updated row
    return { data: match()[0] ?? null, error: null };
  };
  const api: Record<string, unknown> = {
    select: () => api, eq: (k: string, v: unknown) => { filters.push([k, v]); return api; },
    insert: (p: Row) => { mode = 'insert'; payload = p; return api; }, update: (p: Row) => { mode = 'update'; payload = p; return api; },
    maybeSingle: async () => run(), single: async () => run(), then: (ok: (v: unknown) => unknown) => Promise.resolve(run()).then(ok),
  };
  return api;
}
jest.mock('@/server/db', () => ({ admin: () => ({ from: (t: string) => builder(t) }), rpc: jest.fn(), bytea: (b: Buffer) => b.toString('hex') }));
jest.mock('@/server/checkout', () => ({ loadOperation: jest.fn(), updateOperation: jest.fn(), proveUnpaidAndRelease: jest.fn() }));

const OP = { id: 'op1', draft_id: 'd1', status: 'provisioned', owner_user_id: 'u1', account_id: 'a1', last_error_code: null } as never;

describe('the access-email path cannot send mail from a test', () => {
  beforeEach(() => { seen.length = 0; tripwire.mockClear(); tables.notification_operations.length = 0; jest.resetModules(); global.fetch = tripwire as unknown as typeof fetch; });

  it('CONTROL: the real path issues the provider mail request, and the tripwire stops it', async () => {
    const { ensureAccessNotification } = await import('@/server/provisioning');
    const result = await ensureAccessNotification(OP).catch((e: Error) => e.message);
    expect(seen.some((u) => u.endsWith('/auth/v1/otp'))).toBe(true);           // the real call path reaches the mail endpoint…
    expect(tripwire).toHaveBeenCalled();
    expect(['failed', 'TRIPWIRE: a test tried to send mail']).toContain(result);  // …and nothing gets past the tripwire
    expect(tables.notification_operations[0]?.status).not.toBe('sent');
  });

  it('with the module replaced as the integration test does, the mock is hit and no mail request is made', async () => {
    const sendSignInLink = jest.fn(async () => ({ ok: true }));
    jest.doMock('@/server/accessEmail', () => ({ sendSignInLink }));
    const { ensureAccessNotification } = await import('@/server/provisioning');
    expect(await ensureAccessNotification(OP)).toBe('sent');
    expect(sendSignInLink).toHaveBeenCalledTimes(1);
    expect(sendSignInLink).toHaveBeenCalledWith('owner@example.invalid', 'http://localhost:3000/api/auth/confirm');
    expect(seen.filter((u) => MAIL_ENDPOINTS.test(u))).toEqual([]);
    expect(tripwire).not.toHaveBeenCalled();                                    // no network at all on this path
    jest.dontMock('@/server/accessEmail');
  });

  it.each(['otp', 'magiclink', 'recover', 'invite', 'resend', 'signup'])('the tripwire refuses the Auth %s endpoint and allows session verification', async (name) => {
    await expect(tripwire(`https://x.supabase.co/auth/v1/${name}`)).rejects.toThrow('TRIPWIRE');
    await expect(tripwire('https://x.supabase.co/auth/v1/verify')).resolves.toBeDefined();
    await expect(tripwire('https://x.supabase.co/auth/v1/admin/generate_link')).resolves.toBeDefined();
  });
});
