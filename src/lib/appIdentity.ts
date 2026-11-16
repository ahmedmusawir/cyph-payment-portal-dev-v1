// APBM007A — this app's fixed identity and the frozen address table (AUTH_HANDOFF_CONTRACT §11).
// Pure and import-free so the browser client, the proxy and server code share one constant.
// Origins are configuration, never browser-selected.
export type AppId = 'ob' | 'pp';
export type AppEnv = 'local' | 'staging';

export const APP_ID: AppId = 'pp';
export const PEER_ID: AppId = 'ob';

const ORIGINS: Record<AppEnv, Record<AppId, string>> = {
  local: { ob: 'http://localhost:3000', pp: 'http://localhost:3001' },
  staging: { ob: 'https://owedbook.cyberizedev.com', pp: 'https://owedbook-payment.cyberizedev.com' },
};

export function appEnv(): AppEnv {
  return process.env.NEXT_PUBLIC_APP_ENV === 'staging' ? 'staging' : 'local';
}
export const ownOrigin = (): string => ORIGINS[appEnv()][APP_ID];
export const peerOrigin = (): string => ORIGINS[appEnv()][PEER_ID];

/** Per-app, per-environment session cookie. Distinct from the peer app so one host can hold both. */
export const authCookieName = (): string => `cyph-${APP_ID}-auth-${appEnv()}`;
/** Transient handoff cookie: httpOnly, five minutes, scoped to the handoff routes. */
export const handoffCookieName = (): string => `cyph-${APP_ID}-ho-${appEnv()}`;
/** Transient email-link confirmation context: httpOnly, ten minutes, scoped to the confirm routes. */
export const confirmCookieName = (): string => `cyph-${APP_ID}-cf-${appEnv()}`;
/** Anonymous registration draft secret: httpOnly. Portal only. */
export const registrationCookieName = (): string => `cyph-${APP_ID}-reg-${appEnv()}`;
export const isSecureOrigin = (): boolean => ownOrigin().startsWith('https://');

/**
 * The configured site URL must be this app's own frozen origin. A mismatch (for example the portal started
 * with OwedBook's address) would make redirects and cookies land on the wrong host, so callers fail closed.
 */
export function siteOriginMatches(): boolean {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  return configured === ownOrigin();
}

/**
 * Relative return paths each app accepts after sign-in, confirmation or handoff. Exact allowlists, held identically
 * in both apps so that the source can validate a destination's return path (an agreement test compares the copies).
 */
export const RETURN_PATHS_BY_APP: Record<AppId, readonly string[]> = {
  ob: ['/', '/owedbook', '/admin-portal', '/admin-portal/billing'],
  pp: ['/', '/dashboard', '/billing', '/register/activation'],
};
export const DEFAULT_RETURN_BY_APP: Record<AppId, string> = { ob: '/owedbook', pp: '/dashboard' };
export const RETURN_PATHS: readonly string[] = RETURN_PATHS_BY_APP[APP_ID];
export const DEFAULT_RETURN = DEFAULT_RETURN_BY_APP[APP_ID];

/**
 * Exact-match allowlist. Rejects absolute, protocol-relative, encoded, backslash and query-bearing values
 * before the allowlist is even consulted (FC-1).
 */
export function safeReturnPath(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || value.length === 0 || value.length > 128) return null;
  if (!/^\/([A-Za-z0-9_-][A-Za-z0-9/_-]*)?$/.test(value) || value.includes('//')) return null;
  return RETURN_PATHS.includes(value) ? value : null;
}
/** The same rule applied to the peer app's allowlist: used by the source when it authorises a handoff. */
export function safePeerReturnPath(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || value.length === 0 || value.length > 128) return null;
  if (!/^\/([A-Za-z0-9_-][A-Za-z0-9/_-]*)?$/.test(value) || value.includes('//')) return null;
  return RETURN_PATHS_BY_APP[PEER_ID].includes(value) ? value : null;
}
/** Pending source-side authorisation while the user signs in: httpOnly, five minutes. */
export const authorizeCookieName = (): string => `cyph-${APP_ID}-ha-${appEnv()}`;
