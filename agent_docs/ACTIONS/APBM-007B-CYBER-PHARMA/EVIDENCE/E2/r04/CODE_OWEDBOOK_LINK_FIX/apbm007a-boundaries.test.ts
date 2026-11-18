/** @jest-environment node */
// APBM007A (D-01, FA-3, AC-037) — source boundaries for OwedBook's first user-facing service-key path.
// Inventory tests: they fail when a new file crosses a boundary, so that crossing it is a reviewed change.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const SRC = join(ROOT, 'src');
const files = (dir: string): string[] => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(n) ? [p] : []; });
const all = files(SRC).filter((f) => !f.includes(join('src', '__tests__')));
const rel = (f: string) => relative(ROOT, f);
const read = (f: string) => readFileSync(f, 'utf8');

describe('OwedBook service-key and server-module boundaries', () => {
  it('the service-role factory has exactly one importer: the guarded access point', () => {
    expect(all.filter((f) => /utils\/supabase\/admin['"]/.test(read(f))).map(rel)).toEqual(['src/server/db.ts']);
  });
  // APBM-007B (Director ruling 5): narrowly extended to the invitation identity/mail module, and nothing else.
  it('the access point is used only by the handoff/logout module and the invitation mail module', () => {
    expect(all.filter((f) => /from ['"]@\/server\/db['"]/.test(read(f))).map(rel).sort()).toEqual(['src/server/handoff.ts', 'src/server/invitationMail.ts']);
  });
  it('every emailed sign-in link requests the EXACT confirm address with nothing appended (approved template rule)', () => {
    for (const name of ['emailLink.ts', 'invitationMail.ts']) {
      const redirects = [...read(join(SRC, 'server', name)).matchAll(/emailRedirectTo: (`[^`]*`|[^,}\s]+)/g)].map((m) => m[1].trim());
      expect({ name, redirects }).toEqual({ name, redirects: ['`${ownOrigin()}/api/auth/confirm`'] });
    }
  });
  it('the invitation mail module is imported only by the staff server module (after the SQL authority check)', () => {
    expect(all.filter((f) => /from ['"]@\/server\/invitationMail['"]/.test(read(f))).map(rel)).toEqual(['src/server/staff.ts']);
  });
  it('no client component, client service or type module imports a server module', () => {
    const offenders = all.filter((f) => {
      const r = rel(f), text = read(f);
      const clientSide = /^['"]use client['"]/m.test(text) || r.startsWith('src/services/') || r.startsWith('src/store/') || r.startsWith('src/types/') || r.startsWith('src/lib/');
      return clientSide && /from ['"]@\/server\//.test(text);
    });
    expect(offenders.map(rel)).toEqual([]);
  });
  it('nothing reads the server key except the factory, and no Stripe SDK or Stripe secret name exists in OwedBook', () => {
    expect(all.filter((f) => /process\.env\.SUPABASE_SECRET_KEY/.test(read(f))).map(rel).sort()).toEqual(['src/utils/supabase/admin.ts']);
    // comments are ignored: instrumentation.ts keeps a historical note about a later phase
    expect(all.filter((f) => /from ['"]stripe['"]|@stripe\/|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET/.test(read(f).replace(/\/\/.*$/gm, ''))).map(rel)).toEqual([]);
  });
  it('the handoff and emailed-link modules log only fixed text plus a provider error code or status', () => {
    for (const name of ['handoff.ts', 'emailLink.ts', 'invitationMail.ts']) {
      const lines = read(join(SRC, 'server', name)).split('\n');
      // every direct console use is the single `log` helper
      expect(lines.filter((l) => /console\./.test(l) && !/^const log = /.test(l))).toEqual([]);
      for (const l of lines.filter((x) => /\blog\('/.test(x))) {
        const interpolations = [...l.slice(l.indexOf("log('")).matchAll(/\$\{([^}]*)\}/g)].map((m) => m[1]);
        for (const i of interpolations) expect({ name, i, ok: /^[A-Za-z.?]*\.(code|status)( \?\? [A-Za-z.?']+)*$/.test(i) }).toEqual({ name, i, ok: true });
      }
      // the recovery helper is only ever given a fixed reason
      for (const l of lines.filter((x) => /\brecovery\(/.test(x) && !/const recovery = /.test(x))) expect({ name, l: l.trim(), fixed: /recovery\('[^'$]*'\)/.test(l) }).toEqual({ name, l: l.trim(), fixed: true });
    }
  });
});
