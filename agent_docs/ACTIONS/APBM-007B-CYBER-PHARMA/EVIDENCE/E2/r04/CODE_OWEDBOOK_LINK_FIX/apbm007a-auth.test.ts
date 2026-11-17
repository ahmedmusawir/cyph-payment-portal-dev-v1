/** @jest-environment node */
// APBM007A — emailed-link confirmation and handoff route logic (AUTH_HANDOFF_CONTRACT v1.0 §4–§6, §11; FC-1..FC-4).
// This file is identical in both apps. Providers and the database are faked here; the SQL functions themselves
// (atomic claim, bindings, logout races) are proved on SCRATCH by scripts/rls-harness/apbm007a-proof.mjs.
import { createHash } from 'node:crypto';
import { NextRequest } from 'next/server';
import { APP_ID, PEER_ID, authCookieName, authorizeCookieName, confirmCookieName, DEFAULT_RETURN, DEFAULT_RETURN_BY_APP, handoffCookieName, ownOrigin, peerOrigin, RETURN_PATHS_BY_APP } from '@/lib/appIdentity';

const jwt = (sub: string, session: string) => `h.${Buffer.from(JSON.stringify({ sub, session_id: session })).toString('base64url')}.s`;
const sha = (v: string) => createHash('sha256').update(v).digest();
const b64 = (b: Buffer) => b.toString('base64url');
const hex = (b: Buffer) => '\\x' + b.toString('hex');

// cookie-bound client of this app
const cookieClient = {
  session: null as null | { access_token: string },
  userFor: {} as Record<string, string>,
  verifyOtp: jest.fn(), setSession: jest.fn(async (..._a: unknown[]) => ({ error: null as unknown })), signOut: jest.fn(async (..._a: unknown[]) => ({ error: null as unknown })),
  rpc: jest.fn(async (..._a: unknown[]) => ({ data: [] as unknown, error: null as unknown })),
};
jest.mock('@/utils/supabase/server', () => ({
  createClient: async () => ({ rpc: (fn: string, a?: unknown) => cookieClient.rpc(fn, a), auth: {
    getSession: async () => ({ data: { session: cookieClient.session } }),
    getUser: async (token?: string) => { const t = token ?? cookieClient.session?.access_token; const id = t ? cookieClient.userFor[t] : undefined; return id ? { data: { user: { id, email: `${id}@example.invalid` } }, error: null } : { data: { user: null }, error: { code: 'no_session' } }; },
    verifyOtp: (a: unknown) => cookieClient.verifyOtp(a), setSession: (a: unknown) => cookieClient.setSession(a), signOut: (a: unknown) => cookieClient.signOut(a),
  } }),
}));
const service = { rpc: jest.fn(), getUserById: jest.fn(), generateLink: jest.fn(), signOut: jest.fn(async (..._a: unknown[]) => ({ error: null as unknown })) };
jest.mock('@/server/db', () => ({ admin: () => ({ rpc: (fn: string, args: unknown) => service.rpc(fn, args), auth: { admin: { getUserById: (id: string) => service.getUserById(id), generateLink: (a: unknown) => service.generateLink(a), signOut: (t: string, s: string) => service.signOut(t, s) } } }) }));
const memory = { verifyOtp: jest.fn(), signInWithOtp: jest.fn(async (..._a: unknown[]) => ({ error: null as unknown })) };
jest.mock('@supabase/supabase-js', () => ({ createClient: () => ({ auth: { verifyOtp: (a: unknown) => memory.verifyOtp(a), signInWithOtp: (a: unknown) => memory.signInWithOtp(a) } }) }));
const afterSignIn = jest.fn(async (..._a: unknown[]) => undefined);
jest.mock('@/server/afterSignIn', () => ({ afterSignIn: (id: string, email?: string) => afterSignIn(id, email) }));
jest.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined, getAll: () => [] }) }));

import { confirmEntry, confirmSubmit, requestSignInLink } from '@/server/emailLink';
import { authorizeHandoff, callbackHandoff, hintFor, logoutEverywhere, startHandoff, switchHandoff, switchToken } from '@/server/handoff';

const OWN = ownOrigin(), PEER = peerOrigin();
const req = (path: string, init: { method?: string; cookies?: Record<string, string>; origin?: string | null; form?: Record<string, string>; json?: unknown } = {}) => {
  const headers = new Headers();
  if (init.cookies) headers.set('cookie', Object.entries(init.cookies).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('; '));
  if (init.origin !== null && init.method === 'POST') headers.set('origin', init.origin ?? OWN);
  let body: BodyInit | undefined;
  if (init.form) { body = new URLSearchParams(init.form).toString(); headers.set('content-type', 'application/x-www-form-urlencoded'); }
  if (init.json !== undefined) { body = JSON.stringify(init.json); headers.set('content-type', 'application/json'); }
  return new NextRequest(`${OWN}${path}`, { method: init.method ?? 'GET', headers, body });
};
const setCookie = (r: Response, name: string) => r.headers.getSetCookie().find((c) => c.startsWith(name + '='));
const cookieValue = (r: Response, name: string) => decodeURIComponent((setCookie(r, name) || '').split(';')[0].slice(name.length + 1));
const signIn = (user: string, session = 'sess-' + user) => { const t = jwt(user, session); cookieClient.session = { access_token: t }; cookieClient.userFor[t] = user; return { t, session }; };

beforeAll(() => { process.env.NEXT_PUBLIC_SITE_URL = OWN; });
beforeEach(() => {
  jest.clearAllMocks(); cookieClient.session = null; cookieClient.userFor = {};
  cookieClient.setSession.mockResolvedValue({ error: null }); cookieClient.signOut.mockResolvedValue({ error: null }); service.signOut.mockResolvedValue({ error: null });
});

describe('frozen identity table — the same literals are pinned in both apps (AC-021)', () => {
  it('holds the agreed return-path allowlists and defaults for both apps', () => {
    // APBM-007B (IDENTITY_AND_MEMBERSHIP.md, BP-09): /invitations and the Add Store path joined the exact allowlists.
    expect(RETURN_PATHS_BY_APP).toEqual({ ob: ['/', '/owedbook', '/admin-portal', '/admin-portal/billing', '/invitations'], pp: ['/', '/dashboard', '/billing', '/register/activation', '/stores/add'] });
    expect(DEFAULT_RETURN_BY_APP).toEqual({ ob: '/owedbook', pp: '/dashboard' });
  });
  it('uses this app\'s own cookie names and the frozen local origins', () => {
    expect([APP_ID, PEER_ID].sort()).toEqual(['ob', 'pp']);
    expect(authCookieName()).toBe(`cyph-${APP_ID}-auth-local`);
    expect(authCookieName()).not.toBe(`cyph-${PEER_ID}-auth-local`);
    expect({ [APP_ID]: ownOrigin(), [PEER_ID]: peerOrigin() }).toEqual({ ob: 'http://localhost:3000', pp: 'http://localhost:3001' });
  });
});

describe('route files — the same handoff and sign-in routes exist in both apps at their frozen paths', () => {
  // Added after the integrated proof found OwedBook's start route at /api/handoff instead of /api/handoff/start.
  const { existsSync } = jest.requireActual('node:fs') as typeof import('node:fs');
  const { join } = jest.requireActual('node:path') as typeof import('node:path');
  const app = join(__dirname, '..', 'app');
  it.each(['api/handoff/start', 'api/handoff/authorize', 'api/handoff/callback', 'api/handoff/switch', 'api/auth/confirm', 'api/auth/link', 'api/auth/logout', 'api/auth/login'])('%s/route.ts exists', (p) => {
    expect(existsSync(join(app, p, 'route.ts'))).toBe(true);
  });
  it('no route file sits directly at api/handoff', () => {
    expect(existsSync(join(app, 'api', 'handoff', 'route.ts'))).toBe(false);
  });
});

describe('emailed sign-in link: GET never redeems, only the button POST does (FC-4)', () => {
  const TOKEN = 'a'.repeat(56);
  const entry = () => confirmEntry(req(`/api/auth/confirm?token_hash=${TOKEN}&type=email`));
  it('GET stores the context out of the URL and calls no provider', () => {
    const r = entry();
    expect(r.status).toBe(303);
    expect(r.headers.get('location')).toBe(`${OWN}/auth/confirm`);           // clean address: no token
    expect(setCookie(r, confirmCookieName())).toMatch(/HttpOnly/i);
    expect(cookieClient.verifyOtp).not.toHaveBeenCalled();
    expect(cookieClient.setSession).not.toHaveBeenCalled();
  });
  it('GET with a malformed token or an unsupported type goes to the recovery page and stores nothing', () => {
    for (const q of ['token_hash=short&type=email', `token_hash=${TOKEN}&type=recovery`, `type=email`]) {
      const r = confirmEntry(req(`/api/auth/confirm?${q}`));
      expect(r.headers.get('location')).toBe(`${OWN}/auth/link-expired`);
      expect(setCookie(r, confirmCookieName())).toBeUndefined();
    }
  });
  it('an attacker-chosen next path is replaced by the default', () => {
    const r = confirmEntry(req(`/api/auth/confirm?token_hash=${TOKEN}&type=email&next=${encodeURIComponent('//evil.example')}`));
    expect(JSON.parse(cookieValue(r, confirmCookieName())).n).toBe(DEFAULT_RETURN);
  });
  const context = () => cookieValue(entry(), confirmCookieName());
  it('POST without the context, with a wrong CSRF value, or from another origin is refused and uses nothing up', async () => {
    const c = context(); const csrf = JSON.parse(c).c;
    const refused = [
      await confirmSubmit(req('/api/auth/confirm', { method: 'POST', form: { csrf } })),
      await confirmSubmit(req('/api/auth/confirm', { method: 'POST', cookies: { [confirmCookieName()]: c }, form: { csrf: 'x'.repeat(43) } })),
      await confirmSubmit(req('/api/auth/confirm', { method: 'POST', cookies: { [confirmCookieName()]: c }, form: { csrf }, origin: 'https://evil.example' })),
      await confirmSubmit(req('/api/auth/confirm', { method: 'POST', cookies: { [confirmCookieName()]: c }, form: { csrf }, origin: null })),
    ];
    for (const r of refused) { expect(r.status).toBe(403); expect(setCookie(r, confirmCookieName())).toBeUndefined(); }
    expect(cookieClient.verifyOtp).not.toHaveBeenCalled();
  });
  it('the button POST verifies once, clears the context and lands on the allowlisted path', async () => {
    cookieClient.verifyOtp.mockResolvedValue({ data: { user: { id: 'u1', email: 'u1@example.invalid' } }, error: null });
    const c = context();
    const r = await confirmSubmit(req('/api/auth/confirm', { method: 'POST', cookies: { [confirmCookieName()]: c }, form: { csrf: JSON.parse(c).c } }));
    expect(cookieClient.verifyOtp).toHaveBeenCalledTimes(1);
    expect(cookieClient.verifyOtp).toHaveBeenCalledWith({ type: 'email', token_hash: TOKEN });
    expect(r.headers.get('location')).toBe(`${OWN}${DEFAULT_RETURN}`);
    expect(setCookie(r, confirmCookieName())).toMatch(/Max-Age=0/i);
    expect(afterSignIn).toHaveBeenCalledWith('u1', 'u1@example.invalid');
  });
  it('APBM-007B: a person with pending invitations lands on /invitations; a failed read keeps the default', async () => {
    cookieClient.verifyOtp.mockResolvedValue({ data: { user: { id: 'u2', email: 'u2@example.invalid' } }, error: null });
    cookieClient.rpc.mockResolvedValueOnce({ data: [{ id: 'i1', role: 'member' }], error: null });
    let c = context();
    let r = await confirmSubmit(req('/api/auth/confirm', { method: 'POST', cookies: { [confirmCookieName()]: c }, form: { csrf: JSON.parse(c).c } }));
    expect(cookieClient.rpc).toHaveBeenCalledWith('my_invitations', undefined);
    expect(r.headers.get('location')).toBe(`${OWN}/invitations`);
    cookieClient.rpc.mockRejectedValueOnce(new Error('network'));
    c = context();
    r = await confirmSubmit(req('/api/auth/confirm', { method: 'POST', cookies: { [confirmCookieName()]: c }, form: { csrf: JSON.parse(c).c } }));
    expect(r.headers.get('location')).toBe(`${OWN}${DEFAULT_RETURN}`);
  });
  it('an expired or used link goes to the recovery page and the context is cleared', async () => {
    cookieClient.verifyOtp.mockResolvedValue({ data: { user: null }, error: { code: 'otp_expired' } });
    const c = context();
    const r = await confirmSubmit(req('/api/auth/confirm', { method: 'POST', cookies: { [confirmCookieName()]: c }, form: { csrf: JSON.parse(c).c } }));
    expect(r.headers.get('location')).toBe(`${OWN}/auth/link-expired`);
    expect(setCookie(r, confirmCookieName())).toMatch(/Max-Age=0/i);
  });
});

describe('sign-in link request: generic answer, never creates a user (AC-019)', () => {
  const post = (email: unknown, origin?: string) => requestSignInLink(req('/api/auth/link', { method: 'POST', json: { email }, origin }));
  it('asks the provider with sign-up off and this app\'s own confirm address', async () => {
    const r = await post(' Owner@Example.Invalid ');
    expect(await r.json()).toEqual({ result: 'request_received' });
    expect(memory.signInWithOtp).toHaveBeenCalledWith({ email: 'owner@example.invalid', options: { shouldCreateUser: false, emailRedirectTo: `${OWN}/api/auth/confirm` } });
  });
  it('answers identically when the provider refuses, and for a malformed address without calling it', async () => {
    memory.signInWithOtp.mockResolvedValueOnce({ error: { status: 429 } } as never);
    expect(await (await post('throttled@example.invalid')).json()).toEqual({ result: 'request_received' });
    memory.signInWithOtp.mockClear();
    expect(await (await post('not-an-address')).json()).toEqual({ result: 'request_received' });
    expect(memory.signInWithOtp).not.toHaveBeenCalled();
  });
  it('refuses a cross-origin request', async () => {
    expect((await post('owner@example.invalid', 'https://evil.example')).status).toBe(403);
    expect(memory.signInWithOtp).not.toHaveBeenCalled();
  });
});

describe('handoff — destination start', () => {
  it('creates state and an S256 challenge, keeps the verifier in an httpOnly cookie scoped to the handoff routes', async () => {
    const r = await startHandoff(req(`/api/handoff/start?return=${encodeURIComponent(DEFAULT_RETURN)}`));
    const u = new URL(r.headers.get('location')!);
    const t = JSON.parse(cookieValue(r, handoffCookieName()));
    expect(u.origin + u.pathname).toBe(`${PEER}/api/handoff/authorize`);
    expect(u.searchParams.get('state')).toBe(t.s);
    expect(u.searchParams.get('challenge')).toBe(b64(sha(t.v)));
    expect([u.searchParams.get('dest'), u.searchParams.get('return'), u.searchParams.get('attempt'), u.searchParams.get('hint')]).toEqual([APP_ID, DEFAULT_RETURN, '1', null]);
    expect(u.search).not.toContain(t.v);                                        // the verifier never leaves this browser's cookie
    expect(setCookie(r, handoffCookieName())).toMatch(/HttpOnly/i);
    expect(setCookie(r, handoffCookieName())).toMatch(/Path=\/api\/handoff/i);
  });
  it.each(['//evil.example', 'https://evil.example/', '/%2f%2fevil', '/\\evil', '/not-allowlisted'])('rejects the return path %p', async (p) => {
    expect((await startHandoff(req(`/api/handoff/start?return=${encodeURIComponent(p)}`))).status).toBe(400);
  });
  it('ignores a browser-supplied attempt=2 and adds an equality hint when a user is already signed in here', async () => {
    signIn('user-a');
    const r = await startHandoff(req(`/api/handoff/start?return=${encodeURIComponent(DEFAULT_RETURN)}&attempt=2`));
    const u = new URL(r.headers.get('location')!);
    expect(u.searchParams.get('attempt')).toBe('1');
    expect(u.searchParams.get('hint')).toBe(hintFor('user-a', u.searchParams.get('state')!));
    expect(u.searchParams.get('hint')).not.toContain('user-a');
  });
});

describe('handoff — source authorize', () => {
  const STATE = 's'.repeat(43), CHALLENGE = 'c'.repeat(43), PEER_RETURN = DEFAULT_RETURN_BY_APP[PEER_ID];
  const q = (over: Record<string, string> = {}) => '/api/handoff/authorize?' + new URLSearchParams({ state: STATE, challenge: CHALLENGE, dest: PEER_ID, return: PEER_RETURN, attempt: '1', ...over }).toString();
  it.each([{ dest: APP_ID }, { dest: 'evil' }, { return: '//evil.example' }, { return: '/not-allowlisted' }, { state: 'short' }, { challenge: 'short' }, { attempt: '3' }, { hint: 'short' }])('rejects %p without issuing', async (over) => {
    signIn('user-a');
    expect((await authorizeHandoff(req(q(over as unknown as Record<string, string>)))).status).toBe(400);
    expect(service.rpc).not.toHaveBeenCalled();
  });
  it('signed out: no anonymous handoff — asks for sign-in and parks the request in an httpOnly cookie', async () => {
    const r = await authorizeHandoff(req(q()));
    expect(r.headers.get('location')).toBe(`${OWN}/auth/sign-in-to-continue`);
    expect(setCookie(r, authorizeCookieName())).toMatch(/HttpOnly/i);
    expect(service.rpc).not.toHaveBeenCalled();
  });
  it('issues a code for the user AND session of the same validated token, storing only hashes (FC-3)', async () => {
    const { session } = signIn('user-a'); service.rpc.mockResolvedValue({ data: 'issued', error: null });
    const r = await authorizeHandoff(req(q({ user: 'someone-else', email: 'x@example.invalid' })));   // request input cannot pick the subject
    const u = new URL(r.headers.get('location')!); const code = u.searchParams.get('code')!;
    expect(u.origin + u.pathname).toBe(`${PEER}/api/handoff/callback`);
    expect(u.searchParams.get('state')).toBe(STATE);
    const [fn, args] = service.rpc.mock.calls[0];
    expect(fn).toBe('handoff_issue');
    expect(args).toMatchObject({ p_user: 'user-a', p_session: session, p_source: APP_ID, p_dest: PEER_ID, p_env: 'local', p_challenge: CHALLENGE, p_return: PEER_RETURN, p_attempt: 1, p_code_hash: hex(sha(code)), p_state_hash: hex(sha(STATE)) });
    expect(JSON.stringify(args)).not.toContain(code);
  });
  it('answers 429 when the per-user issue limit is reached', async () => {
    signIn('user-a'); service.rpc.mockResolvedValue({ data: 'slow_down', error: null });
    expect((await authorizeHandoff(req(q()))).status).toBe(429);
  });
  it('destination already has the same user: no code, result=same_user', async () => {
    signIn('user-a');
    const u = new URL((await authorizeHandoff(req(q({ hint: hintFor('user-a', STATE) })))).headers.get('location')!);
    expect([u.searchParams.get('result'), u.searchParams.get('code')]).toEqual(['same_user', null]);
    expect(service.rpc).not.toHaveBeenCalled();
  });
  it('destination has a different user: no code, result=switch_required', async () => {
    signIn('user-a');
    const u = new URL((await authorizeHandoff(req(q({ hint: hintFor('user-b', STATE) })))).headers.get('location')!);
    expect([u.searchParams.get('result'), u.searchParams.get('code')]).toEqual(['switch_required', null]);
    expect(service.rpc).not.toHaveBeenCalled();
  });
});

describe('handoff — destination callback', () => {
  const STATE = 's'.repeat(43), VERIFIER = 'v'.repeat(43), CODE = 'k'.repeat(43);
  const transient = (over: Record<string, unknown> = {}) => ({ [handoffCookieName()]: JSON.stringify({ s: STATE, v: VERIFIER, a: 1, r: DEFAULT_RETURN, ...over }) });
  const cb = (query: string, cookies: Record<string, string> | undefined = transient()) => callbackHandoff(req(`/api/handoff/callback?${query}`, { cookies }));
  const calls = (fn: string) => service.rpc.mock.calls.filter(([f]) => f === fn);
  const rpcScript = (script: Record<string, unknown>) => service.rpc.mockImplementation(async (fn: string) => ({ data: script[fn] ?? null, error: null }));
  const claimed = (over: Record<string, unknown> = {}) => [{ outcome: 'claimed', claim_id: 'claim-1', user_id: 'user-a', return_path: DEFAULT_RETURN, attempt: 1, ...over }];
  const mintOk = (user = 'user-a') => {
    service.getUserById.mockResolvedValue({ data: { user: { id: 'user-a', email: 'loaded@example.invalid' } }, error: null });
    service.generateLink.mockResolvedValue({ data: { user: { id: user }, properties: { hashed_token: 'hashed-token' } }, error: null });
    memory.verifyOtp.mockResolvedValue({ data: { session: { access_token: jwt(user, 'new-session'), refresh_token: 'refresh', user: { id: user } } }, error: null });
  };
  const recovery = `${OWN}/auth/handoff-recovery`;

  it('without this browser\'s transient cookie, or with a different state, nothing is claimed', async () => {
    expect((await cb(`code=${CODE}&state=${STATE}`, {})).headers.get('location')).toBe(recovery);
    expect((await cb(`code=${CODE}&state=${'x'.repeat(43)}`)).headers.get('location')).toBe(recovery);
    expect(service.rpc).not.toHaveBeenCalled();
  });
  it('claims with the code hash, the cookie verifier, the state hash and this app as audience', async () => {
    rpcScript({ handoff_claim: [{ outcome: 'rejected' }] });
    expect((await cb(`code=${CODE}&state=${STATE}`)).headers.get('location')).toBe(recovery);
    expect(calls('handoff_claim')[0][1]).toEqual({ p_code_hash: hex(sha(CODE)), p_verifier: VERIFIER, p_state_hash: hex(sha(STATE)), p_dest: APP_ID, p_env: 'local' });
    expect(service.generateLink).not.toHaveBeenCalled();
  });
  it('mints for the subject loaded by ID, completes, and only then writes this app\'s session', async () => {
    rpcScript({ handoff_claim: claimed(), handoff_complete: 'ok' }); mintOk();
    const order: string[] = [];
    service.rpc.mockImplementation(async (fn: string) => { order.push(fn); return { data: fn === 'handoff_claim' ? claimed() : 'ok', error: null }; });
    cookieClient.setSession.mockImplementation(async () => { order.push('setSession'); return { error: null }; });
    const r = await cb(`code=${CODE}&state=${STATE}`);
    expect(service.getUserById).toHaveBeenCalledWith('user-a');
    expect(service.generateLink).toHaveBeenCalledWith({ type: 'magiclink', email: 'loaded@example.invalid' });
    expect(calls('handoff_complete')[0][1]).toEqual({ p_claim_id: 'claim-1', p_dest_session: 'new-session' });
    expect(order).toEqual(['handoff_claim', 'handoff_complete', 'setSession']);
    expect(r.headers.get('location')).toBe(`${OWN}${DEFAULT_RETURN}`);
    expect(r.headers.get('location')).not.toContain(CODE);
    expect(setCookie(r, handoffCookieName())).toMatch(/Max-Age=0/i);
  });
  it('logout between claim and completion: only the session just minted is revoked, and no cookie is written (FC-2)', async () => {
    rpcScript({ handoff_claim: claimed(), handoff_complete: 'revoked' }); mintOk();
    const r = await cb(`code=${CODE}&state=${STATE}`);
    expect(service.signOut).toHaveBeenCalledWith(jwt('user-a', 'new-session'), 'local');
    expect(service.signOut).not.toHaveBeenCalledWith(expect.anything(), 'global');
    expect(cookieClient.setSession).not.toHaveBeenCalled();
    expect(r.headers.get('location')).toBe(`${OWN}/auth/signed-out`);
  });
  it('a minted session for another subject is revoked alone and never stored', async () => {
    rpcScript({ handoff_claim: claimed() }); mintOk();
    memory.verifyOtp.mockResolvedValue({ data: { session: { access_token: jwt('user-z', 'z-session'), refresh_token: 'r', user: { id: 'user-z' } } }, error: null });
    const r = await cb(`code=${CODE}&state=${STATE}`);
    expect(service.signOut).toHaveBeenCalledWith(jwt('user-z', 'z-session'), 'local');
    expect(calls('handoff_fail')[0][1]).toEqual({ p_claim_id: 'claim-1', p_reason: 'subject_mismatch' });
    expect(cookieClient.setSession).not.toHaveBeenCalled();
    expect(r.headers.get('location')).toBe(recovery);
  });
  it('link generation that answers for a different user is refused before any session exists (F-A1)', async () => {
    rpcScript({ handoff_claim: claimed({ attempt: 2 }) }); mintOk('user-other');
    await cb(`code=${CODE}&state=${STATE}`, transient({ a: 2 }));
    expect(memory.verifyOtp).not.toHaveBeenCalled();
    expect(calls('handoff_fail')[0][1]).toEqual({ p_claim_id: 'claim-1', p_reason: 'mint_failed' });
  });
  it('a mint failure on attempt 1 restarts once with a marked cookie; on attempt 2 it stops at the recovery page', async () => {
    rpcScript({ handoff_claim: claimed() });
    service.getUserById.mockResolvedValue({ data: { user: { id: 'user-a', email: 'loaded@example.invalid' } }, error: null });
    service.generateLink.mockResolvedValue({ data: { user: { id: 'user-a' }, properties: { hashed_token: 'h' } }, error: null });
    memory.verifyOtp.mockResolvedValue({ data: { session: null }, error: { code: 'otp_expired' } });
    const first = await cb(`code=${CODE}&state=${STATE}`);
    expect(first.headers.get('location')).toBe(`${OWN}/api/handoff/start?return=${encodeURIComponent(DEFAULT_RETURN)}&attempt=2`);
    const marked = cookieValue(first, handoffCookieName());
    expect(JSON.parse(marked).restart).toBe(true);
    // the restart is honoured by /start only with that marker
    const restarted = await startHandoff(req(`/api/handoff/start?return=${encodeURIComponent(DEFAULT_RETURN)}&attempt=2`, { cookies: { [handoffCookieName()]: marked } }));
    expect(new URL(restarted.headers.get('location')!).searchParams.get('attempt')).toBe('2');
    rpcScript({ handoff_claim: claimed({ attempt: 2 }) });
    const second = await cb(`code=${CODE}&state=${STATE}`, transient({ a: 2 }));
    expect(second.headers.get('location')).toBe(recovery);
  });
  it('the same user already signed in here: completes against the existing session, no mint', async () => {
    const { session } = signIn('user-a'); rpcScript({ handoff_claim: claimed(), handoff_complete: 'ok' });
    const r = await cb(`code=${CODE}&state=${STATE}`);
    expect(calls('handoff_complete')[0][1]).toEqual({ p_claim_id: 'claim-1', p_dest_session: session });
    expect(service.generateLink).not.toHaveBeenCalled();
    expect(r.headers.get('location')).toBe(`${OWN}${DEFAULT_RETURN}`);
  });
  it('a different user signed in here after the claim: nothing is replaced; the switch page is shown', async () => {
    signIn('user-b'); rpcScript({ handoff_claim: claimed() });
    const r = await cb(`code=${CODE}&state=${STATE}`);
    expect(calls('handoff_fail')[0][1]).toEqual({ p_claim_id: 'claim-1', p_reason: 'switch_required' });
    expect(service.generateLink).not.toHaveBeenCalled();
    expect(cookieClient.setSession).not.toHaveBeenCalled();
    expect(r.headers.get('location')).toBe(`${OWN}/auth/switch?t=${switchToken(STATE)}`);
    expect(setCookie(r, handoffCookieName())).toBeUndefined();                  // kept for the deliberate POST
  });
  it('result=same_user and result=switch_required grant nothing by themselves', async () => {
    expect((await cb(`result=same_user&state=${STATE}`)).headers.get('location')).toBe(recovery);          // no session here
    signIn('user-b');
    expect((await cb(`result=same_user&state=${STATE}`)).headers.get('location')).toBe(`${OWN}${DEFAULT_RETURN}`);
    expect((await cb(`result=switch_required&state=${STATE}`)).headers.get('location')).toBe(`${OWN}/auth/switch?t=${switchToken(STATE)}`);
    expect(service.rpc).not.toHaveBeenCalled();
  });
});

describe('handoff — deliberate switch and logout', () => {
  const STATE = 's'.repeat(43);
  const cookies = { [handoffCookieName()]: JSON.stringify({ s: STATE, v: 'v'.repeat(43), a: 1, r: DEFAULT_RETURN }) };
  it('switch needs the POST, this origin and the state-bound token', async () => {
    expect((await switchHandoff(req('/api/handoff/switch', { method: 'POST', cookies, form: { t: 'x'.repeat(43) } }))).status).toBe(403);
    expect((await switchHandoff(req('/api/handoff/switch', { method: 'POST', cookies, form: { t: switchToken(STATE) }, origin: 'https://evil.example' }))).status).toBe(403);
    expect((await switchHandoff(req('/api/handoff/switch', { method: 'POST', form: { t: switchToken(STATE) } }))).status).toBe(403);
    expect(cookieClient.signOut).not.toHaveBeenCalled();
    const ok = await switchHandoff(req('/api/handoff/switch', { method: 'POST', cookies, form: { t: switchToken(STATE) } }));
    expect(cookieClient.signOut).toHaveBeenCalledWith({ scope: 'local' });       // this app only
    expect(ok.headers.get('location')).toBe(`${OWN}/api/handoff/start?return=${encodeURIComponent(DEFAULT_RETURN)}`);
  });
  it('logout invalidates pending codes first, then signs out provider-wide', async () => {
    signIn('user-a'); const order: string[] = [];
    service.rpc.mockImplementation(async (fn: string) => { order.push(fn); return { data: 1, error: null }; });
    cookieClient.signOut.mockImplementation(async (...a: unknown[]) => { order.push('signOut:' + (a[0] as { scope: string }).scope); return { error: null }; });
    expect(await logoutEverywhere()).toEqual({ ok: true });
    expect(order).toEqual(['handoff_invalidate_user', 'signOut:global']);
    expect(service.rpc).toHaveBeenCalledWith('handoff_invalidate_user', { p_user: 'user-a' });
  });
  it('a provider failure is reported, not hidden, and this browser is still signed out', async () => {
    signIn('user-a'); service.rpc.mockResolvedValue({ data: 1, error: null });
    cookieClient.signOut.mockResolvedValueOnce({ error: { status: 500 } } as never);
    expect(await logoutEverywhere()).toEqual({ ok: false });
    expect(cookieClient.signOut).toHaveBeenLastCalledWith({ scope: 'local' });
  });
});
