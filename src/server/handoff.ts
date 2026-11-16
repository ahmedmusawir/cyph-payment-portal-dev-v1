// APBM007A — destination-initiated authorization-code handoff between the two apps (AUTH_HANDOFF_CONTRACT v1.0).
// This file is identical in both apps apart from the app identity it imports. `D` = destination (this request is
// arriving here), `S` = source (the user is signed in here). Provider token material stays in request memory.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createMemoryClient } from '@supabase/supabase-js';
import {
  APP_ID, PEER_ID, appEnv, authorizeCookieName, DEFAULT_RETURN, handoffCookieName, isSecureOrigin, ownOrigin, peerOrigin,
  safePeerReturnPath, safeReturnPath, siteOriginMatches,
} from '@/lib/appIdentity';
import { admin, type Admin } from '@/server/db';
import { createClient } from '@/utils/supabase/server';

const B64 = /^[A-Za-z0-9_-]{43}$/;
const HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache', 'Referrer-Policy': 'no-referrer' };
const b64u = (b: Buffer): string => b.toString('base64url');
const sha = (v: string): Buffer => createHash('sha256').update(v).digest();
const bytea = (b: Buffer): string => '\\x' + b.toString('hex');
const equal = (a: string, b: string): boolean => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export const hintFor = (userId: string, state: string): string => b64u(sha(userId + state));
export const switchToken = (state: string): string => b64u(sha('switch:' + state));

function redirect(url: string, status: 302 | 303 = 302): NextResponse {
  return NextResponse.redirect(url, { status, headers: HEADERS });
}
const page = (path: string, status: 302 | 303 = 303): NextResponse => redirect(`${ownOrigin()}${path}`, status);
const log = (step: string, reason: string): void => console.error(`[handoff:${APP_ID}:${step}] ${reason}`);   // no query values, ever

interface Transient { s: string; v: string; a: 1 | 2; r: string; restart?: boolean }
const cookieBase = { httpOnly: true, sameSite: 'lax' as const, secure: isSecureOrigin(), path: '/api/handoff', maxAge: 300 };
function readTransient(request: NextRequest): Transient | null {
  try {
    const t = JSON.parse(request.cookies.get(handoffCookieName())?.value || '') as Transient;
    return B64.test(t.s) && B64.test(t.v) && (t.a === 1 || t.a === 2) && safeReturnPath(t.r) ? t : null;
  } catch { return null; }
}
const clearTransient = (r: NextResponse): NextResponse => { r.cookies.set(handoffCookieName(), '', { ...cookieBase, maxAge: 0 }); return r; };

/** The access token the cookie client holds, validated by the provider, and the session ID inside that same token (FC-3). */
async function verifiedSession(): Promise<{ userId: string; sessionId: string } | null> {
  const supabase = await createClient();
  const { data: s } = await supabase.auth.getSession();
  const token = s.session?.access_token;
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);   // the provider validates THIS token
  if (error || !data.user) return null;
  try {
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()) as { sub?: string; session_id?: string };
    if (claims.sub !== data.user.id || !claims.session_id) return null;
    return { userId: data.user.id, sessionId: claims.session_id };
  } catch { return null; }
}

// ───────────────────────────── D: /api/handoff/start ─────────────────────────────
export async function startHandoff(request: NextRequest): Promise<NextResponse> {
  if (!siteOriginMatches()) { log('start', 'site URL is not this app origin'); return page('/auth/handoff-recovery'); }
  const returnPath = safeReturnPath(request.nextUrl.searchParams.get('return') ?? DEFAULT_RETURN);
  if (!returnPath) return NextResponse.json({ error: 'invalid_return' }, { status: 400, headers: HEADERS });
  // attempt 2 is honoured only on this app's own restart redirect, marked in the transient cookie by the callback
  const prior = readTransient(request);
  const attempt: 1 | 2 = request.nextUrl.searchParams.get('attempt') === '2' && prior?.restart === true ? 2 : 1;
  const state = b64u(randomBytes(32)), verifier = b64u(randomBytes(32));
  const here = await verifiedSession();
  const url = new URL(`${peerOrigin()}/api/handoff/authorize`);
  url.searchParams.set('state', state);
  url.searchParams.set('challenge', b64u(sha(verifier)));
  url.searchParams.set('dest', APP_ID);
  url.searchParams.set('return', returnPath);
  url.searchParams.set('attempt', String(attempt));
  if (here) url.searchParams.set('hint', hintFor(here.userId, state));
  const response = redirect(url.toString());
  response.cookies.set(handoffCookieName(), JSON.stringify({ s: state, v: verifier, a: attempt, r: returnPath } satisfies Transient), cookieBase);
  return response;
}

// ───────────────────────────── S: /api/handoff/authorize ─────────────────────────────
const authorizeCookie = { httpOnly: true, sameSite: 'lax' as const, secure: isSecureOrigin(), path: '/api/handoff', maxAge: 300 };
export async function authorizeHandoff(request: NextRequest): Promise<NextResponse> {
  if (!siteOriginMatches()) { log('authorize', 'site URL is not this app origin'); return page('/auth/handoff-recovery'); }
  // After signing in, the pending request is resumed from the httpOnly cookie rather than from a URL the user could edit.
  let q = request.nextUrl.searchParams;
  if (q.get('resume') === '1') {
    try { q = new URLSearchParams(JSON.parse(request.cookies.get(authorizeCookieName())?.value || '{}') as Record<string, string>); } catch { q = new URLSearchParams(); }
  }
  const state = q.get('state') || '', challenge = q.get('challenge') || '', dest = q.get('dest'), attempt = q.get('attempt'), hint = q.get('hint');
  const returnPath = safePeerReturnPath(q.get('return'));
  if (!B64.test(state) || !B64.test(challenge) || dest !== PEER_ID || !returnPath || (attempt !== '1' && attempt !== '2') || (hint !== null && !B64.test(hint))) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400, headers: HEADERS });
  }
  const me = await verifiedSession();
  if (!me) {
    // Never an anonymous handoff: sign in here first, then resume this exact request.
    const pending: Record<string, string> = { state, challenge, dest, return: returnPath, attempt, ...(hint ? { hint } : {}) };
    const response = page('/auth/sign-in-to-continue', 302);
    response.cookies.set(authorizeCookieName(), JSON.stringify(pending), authorizeCookie);
    return response;
  }
  const back = new URL(`${peerOrigin()}/api/handoff/callback`);
  back.searchParams.set('state', state);
  const done = (r: NextResponse): NextResponse => { r.cookies.set(authorizeCookieName(), '', { ...authorizeCookie, maxAge: 0 }); return r; };
  if (hint) {
    // The destination already holds a session. Compare without learning who it is; issue no code either way.
    back.searchParams.set('result', equal(hint, hintFor(me.userId, state)) ? 'same_user' : 'switch_required');
    return done(redirect(back.toString()));
  }
  const code = b64u(randomBytes(32));
  const { data, error } = await admin().rpc('handoff_issue', {
    p_user: me.userId, p_session: me.sessionId, p_source: APP_ID, p_dest: PEER_ID, p_env: appEnv(), p_challenge: challenge,
    p_state_hash: bytea(sha(state)), p_return: returnPath, p_code_hash: bytea(sha(code)), p_attempt: Number(attempt),
  });
  if (error) { log('authorize', `issue failed ${error.code}`); return done(page('/auth/handoff-recovery')); }
  if (data === 'slow_down') return done(NextResponse.json({ error: 'slow_down' }, { status: 429, headers: HEADERS }));
  if (data !== 'issued') return done(page('/auth/sign-in-to-continue', 302));
  back.searchParams.set('code', code);
  return done(redirect(back.toString()));
}

// ───────────────────────────── D: /api/handoff/callback ─────────────────────────────
export async function callbackHandoff(request: NextRequest): Promise<NextResponse> {
  const recovery = (reason: string): NextResponse => { log('callback', reason); return clearTransient(page('/auth/handoff-recovery')); };
  if (!siteOriginMatches()) return recovery('site URL is not this app origin');
  const t = readTransient(request);
  const q = request.nextUrl.searchParams;
  const state = q.get('state') || '';
  if (!t || !B64.test(state) || !equal(state, t.s)) return recovery('state does not match this browser');
  const result = q.get('result'), code = q.get('code');
  const here = await verifiedSession();

  if (result === 'same_user') return here ? clearTransient(page(t.r)) : recovery('same_user without a session here');
  if (result === 'switch_required') return here ? switchPage(t) : recovery('switch_required without a session here');
  if (!code || !B64.test(code)) return recovery('no code');

  const service = admin();
  const claimed = await service.rpc('handoff_claim', { p_code_hash: bytea(sha(code)), p_verifier: t.v, p_state_hash: bytea(sha(t.s)), p_dest: APP_ID, p_env: appEnv() });
  const claim = (claimed.data as { outcome: string; claim_id: string; user_id: string; return_path: string; attempt: number }[] | null)?.[0];
  if (claimed.error || !claim || claim.outcome !== 'claimed') return recovery('claim rejected');
  const fail = async (reason: string): Promise<void> => { await service.rpc('handoff_fail', { p_claim_id: claim.claim_id, p_reason: reason }); };
  const returnPath = safeReturnPath(claim.return_path);
  if (!returnPath || returnPath !== t.r) { await fail('mint_failed'); return recovery('return path changed'); }

  // The destination's session can have changed since /start: repeat the check after the claim.
  if (here) {
    if (here.userId === claim.user_id) {
      const ok = await service.rpc('handoff_complete', { p_claim_id: claim.claim_id, p_dest_session: here.sessionId });
      return ok.data === 'ok' ? clearTransient(page(returnPath)) : recovery('completion revoked');
    }
    await fail('switch_required');
    return switchPage(t);
  }

  // Mint, in request memory only. The subject is loaded by ID; the address never comes from a request (F-A1).
  const minted = await mint(service, claim.user_id);
  if (minted === 'failed') {
    await fail('mint_failed');
    if (claim.attempt === 1 && t.a === 1) {
      // One fresh automatic restart: new state, new verifier, new code.
      const response = redirect(`${ownOrigin()}/api/handoff/start?return=${encodeURIComponent(returnPath)}&attempt=2`);
      response.cookies.set(handoffCookieName(), JSON.stringify({ ...t, restart: true } satisfies Transient), cookieBase);
      log('callback', 'mint failed on attempt 1; restarting once');
      return response;
    }
    return recovery('mint failed on the final attempt');
  }
  if (minted === 'subject_mismatch') { await fail('subject_mismatch'); return recovery('minted session is for another subject'); }

  const complete = await service.rpc('handoff_complete', { p_claim_id: claim.claim_id, p_dest_session: minted.sessionId });
  if (complete.error || complete.data !== 'ok') {
    // Logged out (or source ended) between claim and mint: revoke ONLY the session just minted, write no cookie (FC-2).
    await service.auth.admin.signOut(minted.accessToken, 'local');
    log('callback', 'completion revoked; the minted session was signed out');
    return clearTransient(page('/auth/signed-out'));
  }
  const supabase = await createClient();
  const set = await supabase.auth.setSession({ access_token: minted.accessToken, refresh_token: minted.refreshToken });
  if (set.error) { await service.auth.admin.signOut(minted.accessToken, 'local'); return recovery('session could not be stored'); }
  return clearTransient(page(returnPath));
}

type Minted = { accessToken: string; refreshToken: string; sessionId: string };
async function mint(service: Admin, subject: string): Promise<Minted | 'failed' | 'subject_mismatch'> {
  try {
    const user = await service.auth.admin.getUserById(subject);
    if (user.error || !user.data.user?.email || user.data.user.id !== subject) return 'failed';
    const link = await service.auth.admin.generateLink({ type: 'magiclink', email: user.data.user.email });
    if (link.error || link.data.user?.id !== subject || !link.data.properties?.hashed_token) return 'failed';
    const memory = createMemoryClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
    const verified = await memory.auth.verifyOtp({ token_hash: link.data.properties.hashed_token, type: 'magiclink' });
    const session = verified.data.session;
    if (verified.error || !session) return 'failed';
    const claims = JSON.parse(Buffer.from(session.access_token.split('.')[1], 'base64url').toString()) as { sub?: string; session_id?: string };
    if (session.user.id !== subject || claims.sub !== subject || !claims.session_id) {
      await service.auth.admin.signOut(session.access_token, 'local');   // only the session just minted
      return 'subject_mismatch';
    }
    return { accessToken: session.access_token, refreshToken: session.refresh_token, sessionId: claims.session_id };
  } catch { return 'failed'; }
}

/** A different user is signed in here: nothing is replaced silently. The transient cookie is kept for the deliberate POST. */
function switchPage(t: Transient): NextResponse {
  return page(`/auth/switch?t=${switchToken(t.s)}`);
}

// ───────────────────────────── D: POST /api/handoff/switch ─────────────────────────────
export async function switchHandoff(request: NextRequest): Promise<NextResponse> {
  const t = readTransient(request);
  const form = await request.formData().catch(() => null);
  const token = String(form?.get('t') ?? '');
  if (!siteOriginMatches() || request.headers.get('origin') !== ownOrigin() || !t || !B64.test(token) || !equal(token, switchToken(t.s))) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403, headers: HEADERS });
  }
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'local' });   // this app's session only; the other account's other devices are untouched
  return clearTransient(redirect(`${ownOrigin()}/api/handoff/start?return=${encodeURIComponent(t.r)}`, 303));
}

// ───────────────────────────── POST /api/auth/logout ─────────────────────────────
/** Provider-wide sign-out. Pending and claimed-but-incomplete handoff codes are invalidated first (F-A6). */
export async function logoutEverywhere(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const me = await verifiedSession();
  let invalidated = true;
  if (me) {
    const inv = await admin().rpc('handoff_invalidate_user', { p_user: me.userId });
    if (inv.error) { log('logout', `invalidate failed ${inv.error.code}`); invalidated = false; }   // still sign out; report honestly
  }
  const out = await supabase.auth.signOut({ scope: 'global' });
  if (out.error && me) {
    await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);   // this browser is signed out even if the provider call failed
    log('logout', 'provider sign-out failed');
    return { ok: false };
  }
  return { ok: invalidated };
}
