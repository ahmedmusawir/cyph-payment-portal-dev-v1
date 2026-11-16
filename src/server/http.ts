// APBM007A — shared request plumbing for portal API routes: same-origin check for state-changing requests,
// a small per-instance rate limiter, no-store JSON responses and the registration cookie.
import { NextResponse, type NextRequest } from 'next/server';
import { isSecureOrigin, ownOrigin, registrationCookieName, siteOriginMatches } from '@/lib/appIdentity';
import { errorBody, logServer, PortalError } from '@/server/errors';

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache', 'Referrer-Policy': 'no-referrer' };

export function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: NO_STORE });
}
export function fail(scope: string, e: unknown): NextResponse {
  logServer(scope, e);
  const { status, body } = errorBody(e);
  return json(body, status);
}

/**
 * State-changing requests must come from this app's own origin. With SameSite=Lax cookies this closes cross-site
 * form posts; a missing or foreign Origin is refused.
 */
export function assertSameOrigin(request: NextRequest): void {
  if (!siteOriginMatches()) throw new PortalError('configuration', 'site URL is not this app origin');
  const origin = request.headers.get('origin');
  if (origin !== ownOrigin()) throw new PortalError('invalid_input', 'cross-origin request');
}

// Per-instance limiter. It bounds a single client against one server process; it is not a shared store.
const buckets = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(request: NextRequest, scope: string, max: number, windowMs = 60_000): void {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return; }
  if (++b.count > max) throw new PortalError('slow_down', scope);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
}

export const readRegistrationSecret = (request: NextRequest): string | undefined => request.cookies.get(registrationCookieName())?.value;
export function setRegistrationSecret(response: NextResponse, secret: string): void {
  response.cookies.set(registrationCookieName(), secret, { httpOnly: true, sameSite: 'lax', secure: isSecureOrigin(), path: '/', maxAge: 7 * 24 * 3600 });
}

export async function readJson(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object');
    return body as Record<string, unknown>;
  } catch { throw new PortalError('invalid_input', 'body'); }
}
