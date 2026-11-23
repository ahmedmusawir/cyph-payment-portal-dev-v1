// Alpha deployment origins (2026-11-21). The deployed ('staging') row of the frozen address table points at the alpha
// hosts; the local and local-proof rows, the cookie names, the handoff label and the return-path allowlists are unchanged.
// OwedBook holds a mirrored table that carries the same pair (cyph-v1-dev src/__tests__/alpha-origins.test.ts).
import { authCookieName, handoffEnv, isSecureOrigin, ownOrigin, peerOrigin, registrationCookieName, RETURN_PATHS_BY_APP, safePeerReturnPath, safeReturnPath, siteOriginMatches } from '@/lib/appIdentity';

const OB_ALPHA = 'https://cyph-v1-owedbook-alpha.cyberizedev.com';
const PP_ALPHA = 'https://cyph-v1-payment-alpha.cyberizedev.com';
const KEYS = ['NEXT_PUBLIC_APP_ENV', 'NEXT_PUBLIC_SITE_URL'] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
const use = (env: string | undefined, site?: string) => {
  if (env === undefined) delete process.env.NEXT_PUBLIC_APP_ENV; else process.env.NEXT_PUBLIC_APP_ENV = env;
  if (site === undefined) delete process.env.NEXT_PUBLIC_SITE_URL; else process.env.NEXT_PUBLIC_SITE_URL = site;
};
afterEach(() => { for (const k of KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; } });

describe('alpha origins', () => {
  it('the deployed environment resolves to the alpha pair over HTTPS', () => {
    use('staging', PP_ALPHA);
    expect({ own: ownOrigin(), peer: peerOrigin() }).toEqual({ own: PP_ALPHA, peer: OB_ALPHA });
    expect(isSecureOrigin()).toBe(true);
    expect(handoffEnv()).toBe('staging');
    expect(authCookieName()).toBe('cyph-pp-auth-staging');
    expect(registrationCookieName()).toBe('cyph-pp-reg-staging');
  });

  it('the site URL guard accepts only the exact alpha origin', () => {
    use('staging', PP_ALPHA);
    expect(siteOriginMatches()).toBe(true);
    use('staging', `${PP_ALPHA}/`);
    expect(siteOriginMatches()).toBe(true);   // trailing slashes are normalised, as before
    for (const wrong of [OB_ALPHA, 'https://owedbook-payment.cyberizedev.com', 'https://cyph-payment.cyberizedev.com', 'http://cyph-v1-payment-alpha.cyberizedev.com', 'https://cyph-v1-payment-alpha.cyberizedev.com.evil.test', 'http://localhost:3001', '']) {
      use('staging', wrong);
      expect({ wrong, ok: siteOriginMatches() }).toEqual({ wrong, ok: false });
    }
  });

  it('local and local-proof origins are unchanged', () => {
    use(undefined);
    expect({ own: ownOrigin(), peer: peerOrigin(), secure: isSecureOrigin(), env: handoffEnv() }).toEqual({ own: 'http://localhost:3001', peer: 'http://localhost:3000', secure: false, env: 'local' });
    use('local-proof');
    expect({ own: ownOrigin(), peer: peerOrigin(), secure: isSecureOrigin(), env: handoffEnv() }).toEqual({ own: 'http://localhost:3101', peer: 'http://localhost:3100', secure: false, env: 'local' });
    use('alpha');   // an unknown label never selects the deployed row
    expect(ownOrigin()).toBe('http://localhost:3001');
  });

  it('return paths stay exact and relative under the deployed environment', () => {
    use('staging', PP_ALPHA);
    expect(RETURN_PATHS_BY_APP).toEqual({
      ob: ['/', '/owedbook', '/admin-portal', '/admin-portal/billing', '/invitations'],
      pp: ['/', '/dashboard', '/billing', '/register/activation', '/stores/add'],
    });
    expect(safeReturnPath('/dashboard')).toBe('/dashboard');
    expect(safePeerReturnPath('/owedbook')).toBe('/owedbook');
    for (const bad of [`${OB_ALPHA}/owedbook`, '//cyph-v1-owedbook-alpha.cyberizedev.com', '/dashboard?x=1', '/owedbook']) expect(safeReturnPath(bad)).toBeNull();
  });
});
