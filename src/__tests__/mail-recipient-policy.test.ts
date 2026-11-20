// Manual QA 19 Nov 2026 (R10) — explicit DEV-only open-recipient policy. Identical test in both apps.
import { guardDecision, mailAllowed, openPolicyActive } from '@/server/mailGuard';

const DEV = 'https://yrsuwikjnbmvpznrgydb.supabase.co';
const SCRATCH = 'https://ihgcsrypblqkwommrkgj.supabase.co';
const env = { ...process.env };
afterEach(() => { process.env = { ...env }; });
const set = (vars: Record<string, string | undefined>) => { for (const [k, v] of Object.entries(vars)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } };

describe('default: exact allowlist (unchanged contract behaviour)', () => {
  it('no policy, empty allowlist: everyone blocked, including plus aliases', () => {
    set({ MAIL_RECIPIENT_POLICY: undefined, MAIL_ALLOWLIST: undefined, NEXT_PUBLIC_SUPABASE_URL: DEV });
    expect(guardDecision('moose+alpha01-member@cyberizegroup.com')).toEqual({ allowed: false, reason: 'blocked_not_allowlisted' });
  });
  it('allowlisted address passes as allowlisted; "*" and MAIL_GUARD=off grant nothing', () => {
    set({ MAIL_RECIPIENT_POLICY: undefined, MAIL_ALLOWLIST: 'Tester@Example.com,*,*@example.com', MAIL_GUARD: 'off', NEXT_PUBLIC_SUPABASE_URL: DEV });
    expect(guardDecision(' tester@example.com ')).toEqual({ allowed: true, reason: 'allowlisted' });
    expect(guardDecision('other@example.com').allowed).toBe(false);
    expect(mailAllowed('*')).toBe(false);
  });
  it('an unknown policy value is the default', () => {
    set({ MAIL_RECIPIENT_POLICY: 'everyone', MAIL_ALLOWLIST: '', NEXT_PUBLIC_SUPABASE_URL: DEV });
    expect(openPolicyActive()).toBe(false);
    expect(guardDecision('a@b.co').allowed).toBe(false);
  });
});

describe('MAIL_RECIPIENT_POLICY=open', () => {
  it('on the DEV/alpha project: any single valid address, plus aliases included', () => {
    set({ MAIL_RECIPIENT_POLICY: ' Open ', MAIL_ALLOWLIST: '', NEXT_PUBLIC_SUPABASE_URL: DEV });
    expect(openPolicyActive()).toBe(true);
    for (const a of ['moose+alpha01-member@cyberizegroup.com', 'moose+alpha01-admin@cyberizegroup.com', 'coach@example.org'])
      expect(guardDecision(a)).toEqual({ allowed: true, reason: 'open_policy' });
  });
  it('still refuses malformed, multi-recipient and wildcard input', () => {
    set({ MAIL_RECIPIENT_POLICY: 'open', MAIL_ALLOWLIST: '', NEXT_PUBLIC_SUPABASE_URL: DEV });
    for (const a of ['', 'not-an-address', 'a@b', 'a@b.co,c@d.co', 'a b@c.co', '*@example.com', 'a@@b.co'])
      expect(guardDecision(a).allowed).toBe(false);
  });
  it('fails closed on any other project (SCRATCH, a production-like ref, a look-alike host, missing or bad URL)', () => {
    for (const url of [SCRATCH, 'https://abcdefghijklmnopqrst.supabase.co', 'https://yrsuwikjnbmvpznrgydb.supabase.co.evil.example', 'https://evil.example/yrsuwikjnbmvpznrgydb.supabase.co', '', 'not a url', undefined]) {
      set({ MAIL_RECIPIENT_POLICY: 'open', MAIL_ALLOWLIST: '', NEXT_PUBLIC_SUPABASE_URL: url });
      expect(openPolicyActive()).toBe(false);
      expect(guardDecision('moose+alpha01-member@cyberizegroup.com')).toEqual({ allowed: false, reason: 'blocked_not_allowlisted' });
    }
  });
  it('outside DEV the exact allowlist still works', () => {
    set({ MAIL_RECIPIENT_POLICY: 'open', MAIL_ALLOWLIST: 'ops@example.com', NEXT_PUBLIC_SUPABASE_URL: SCRATCH });
    expect(guardDecision('ops@example.com')).toEqual({ allowed: true, reason: 'allowlisted' });
  });
});
