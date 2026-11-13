// APBM007A — emailed sign-in links (AUTH_HANDOFF_CONTRACT §11, FC-4). Identical in both apps.
// GET never redeems: it moves the one-time token out of the URL into a short-lived httpOnly context and shows a
// page with a button. Only the explicit, same-origin, CSRF-bound POST verifies the token and creates the session.
// A scanner or link preview that opens the link signs nobody in and uses nothing up.
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createPlainClient } from '@supabase/supabase-js';
import { APP_ID, confirmCookieName, DEFAULT_RETURN, isSecureOrigin, ownOrigin, safeReturnPath, siteOriginMatches } from '@/lib/appIdentity';
import { afterSignIn } from '@/server/afterSignIn';
import { createClient } from '@/utils/supabase/server';

const HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache', 'Referrer-Policy': 'no-referrer' };
const TOKEN = /^[A-Za-z0-9_-]{20,200}$/;
const TYPES = ['email', 'magiclink'] as const;
type LinkType = (typeof TYPES)[number];
interface Context { h: string; y: LinkType; n: string; c: string }
const cookieBase = { httpOnly: true, sameSite: 'lax' as const, secure: isSecureOrigin(), path: '/', maxAge: 600 };
const to = (path: string): NextResponse => NextResponse.redirect(`${ownOrigin()}${path}`, { status: 303, headers: HEADERS });
const equal = (a: string, b: string): boolean => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const log = (step: string, reason: string): void => console.error(`[email-link:${APP_ID}:${step}] ${reason}`);   // never the token or the address

function parse(raw: string | undefined): Context | null {
  try {
    const c = JSON.parse(raw || '') as Context;
    return TOKEN.test(c.h) && (TYPES as readonly string[]).includes(c.y) && safeReturnPath(c.n) && /^[A-Za-z0-9_-]{43}$/.test(c.c) ? c : null;
  } catch { return null; }
}

/** GET /api/auth/confirm — store the context, go to the clean confirmation page. No provider call. */
export function confirmEntry(request: NextRequest): NextResponse {
  const q = request.nextUrl.searchParams;
  const tokenHash = q.get('token_hash') || '', type = q.get('type') || '';
  if (!siteOriginMatches() || !TOKEN.test(tokenHash) || !(TYPES as readonly string[]).includes(type)) return to('/auth/link-expired');
  const context: Context = { h: tokenHash, y: type as LinkType, n: safeReturnPath(q.get('next')) ?? DEFAULT_RETURN, c: randomBytes(32).toString('base64url') };
  const response = to('/auth/confirm');
  response.cookies.set(confirmCookieName(), JSON.stringify(context), cookieBase);
  return response;
}

/** For the confirmation page: is there a pending link, and the CSRF value to embed in its form. Never the token. */
export async function pendingConfirmation(): Promise<{ csrf: string } | null> {
  const c = parse((await cookies()).get(confirmCookieName())?.value);
  return c ? { csrf: c.c } : null;
}

/** POST /api/auth/confirm — the deliberate button press. One-time verification, then the context is cleared. */
export async function confirmSubmit(request: NextRequest): Promise<NextResponse> {
  const clear = (r: NextResponse): NextResponse => { r.cookies.set(confirmCookieName(), '', { ...cookieBase, maxAge: 0 }); return r; };
  const context = parse(request.cookies.get(confirmCookieName())?.value);
  const form = await request.formData().catch(() => null);
  const csrf = String(form?.get('csrf') ?? '');
  if (!siteOriginMatches() || request.headers.get('origin') !== ownOrigin() || !context || !equal(csrf, context.c)) {
    log('confirm', 'refused: origin, context or CSRF check failed');
    return NextResponse.json({ error: 'forbidden' }, { status: 403, headers: HEADERS });   // the context is kept: a forged POST uses nothing up
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ type: context.y, token_hash: context.h });
  if (error || !data.user) { log('confirm', `verification refused ${error?.code ?? ''}`.trim()); return clear(to('/auth/link-expired')); }
  await afterSignIn(data.user.id, data.user.email);
  return clear(to(context.n));
}

// Per-instance limiter for link requests: bounds one client against one server process.
const requests = new Map<string, { count: number; resetAt: number }>();
function limited(ip: string): boolean {
  const now = Date.now(); const b = requests.get(ip);
  if (!b || b.resetAt <= now) { requests.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  return ++b.count > 5;
}

/**
 * POST /api/auth/link — ask for a sign-in link. The answer is the same whether or not the address has an account,
 * whether or not the provider throttled it: nothing here reveals that an account exists, and no user is ever created.
 */
export async function requestSignInLink(request: NextRequest): Promise<NextResponse> {
  const generic = NextResponse.json({ result: 'request_received' }, { status: 200, headers: HEADERS });
  if (!siteOriginMatches() || request.headers.get('origin') !== ownOrigin()) return NextResponse.json({ error: 'forbidden' }, { status: 403, headers: HEADERS });
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  if (limited(ip)) return NextResponse.json({ error: 'slow_down' }, { status: 429, headers: HEADERS });
  const body = (await request.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email)) return generic;
  const anon = createPlainClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const sent = await anon.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${ownOrigin()}/api/auth/confirm` } });
  if (sent.error) log('link', `provider answered ${sent.error.status ?? sent.error.code ?? 'error'}`);
  return generic;
}
