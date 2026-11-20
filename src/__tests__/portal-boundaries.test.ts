// Architecture boundaries (AC-24/25/28): source inventory, not behaviour mirrors.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const SRC = join(ROOT, 'src');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(name) ? [p] : [];
  });
}
// Test code is not application source: the unit tests and the SCRATCH integration test (run only by its runner).
const all = files(SRC).filter((f) => !f.includes(`${join('src', '__tests__')}`) && !f.includes(`${join('src', 'integration')}`));
const rel = (f: string) => relative(ROOT, f);
const read = (f: string) => readFileSync(f, 'utf8');

// Reviewed list. Adding an importer is a deliberate change to this test.
const SUPABASE_IMPORTERS = [
  // Manual QA 20 Nov 2026 (reviewed): the server-rendered Add Store page checks owner authority with the cookie-bound client
  // before the form renders (same owner_billing_overview predicate as the Add Store APIs).
  'src/app/(account)/stores/add/page.tsx',
  'src/app/api/auth/login/route.ts',
  'src/app/api/billing/overview/route.ts',
  'src/app/api/billing/portal/route.ts',
  'src/app/api/billing/undo-cancel/route.ts',
  'src/app/api/registration/checkout/route.ts',
  'src/app/api/registration/draft/route.ts',
      // APBM-007B owner store routes: each passes the cookie-bound client to the server module (owner check in SQL).
      'src/app/api/stores/[id]/removal/route.ts', 'src/app/api/stores/[id]/removal/undo/route.ts', 'src/app/api/stores/add/abandon/route.ts',
      'src/app/api/stores/add/confirm/route.ts', 'src/app/api/stores/add/quote/route.ts', 'src/app/api/stores/add/status/route.ts', 'src/app/api/stores/operations/route.ts',
  'src/app/auth/switch/page.tsx',
  'src/proxy.ts',
  'src/server/db.ts',
  'src/server/emailLink.ts',
  'src/server/handoff.ts',
  'src/services/auth/session.ts',
  'src/utils/get-user-role.ts',
];

describe('portal source boundaries', () => {
  it('only src/services/portal imports the mock fixtures', () => {
    const offenders = all.filter((f) => /from ['"]@\/mocks\//.test(read(f)) && !rel(f).startsWith('src/services/portal/'));
    expect(offenders.map(rel)).toEqual([]);
  });

  it('components and app pages never import the engines or fixtures directly', () => {
    const offenders = all.filter(
      (f) => (rel(f).startsWith('src/components/') || rel(f).startsWith('src/app/')) &&
        /from ['"]@\/services\/portal\/(registration|account|pricing|validation|storage)['"]/.test(read(f)),
    );
    expect(offenders.map(rel)).toEqual([]);
  });

  // APBM007A (intentional change): the Stripe SDK and the service role are now used, but only by server modules.
  it('the Stripe SDK is imported only by src/server, and never by components, pages or services', () => {
    const offenders = all.filter((f) => /from ['"]stripe['"]|@stripe\//.test(read(f)) && !rel(f).startsWith('src/server/'));
    expect(offenders.map(rel)).toEqual([]);
  });

  it('components, pages and client services never import server modules', () => {
    const offenders = all.filter((f) => {
      const r = rel(f);
      const clientSide = r.startsWith('src/components/') || r.startsWith('src/services/') || r.startsWith('src/lib/') || r.startsWith('src/types/')
        || (r.startsWith('src/app/') && !r.startsWith('src/app/api/') && /^['"]use client['"]/m.test(read(f)));
      return clientSide && /from ['"]@\/server\//.test(read(f));
    });
    expect(offenders.map(rel)).toEqual([]);
  });

  it('Checkout sessions are USD-only: Adaptive Pricing is switched off on every session (BILL-01)', () => {
    const text = read(join(SRC, 'server', 'checkout.ts'));
    expect((text.match(/checkout\.sessions\.create\(/g) || []).length).toBe(1);
    expect(text).toMatch(/adaptive_pricing: \{ enabled: false \}/);
  });

  it('no raw HTML injection, and the Supabase factories have a finite, reviewed importer list', () => {
    for (const f of all) expect({ f: rel(f), html: /dangerouslySetInnerHTML/.test(read(f)) }).toEqual({ f: rel(f), html: false });
    const supabaseImporters = all.filter((f) => /@\/utils\/supabase\/|from '\.\/supabase\//.test(read(f))).map(rel).sort();
    expect(supabaseImporters).toEqual(SUPABASE_IMPORTERS);
    // The service-role factory has exactly one importer: the portal's single service-role access point.
    expect(all.filter((f) => /@\/utils\/supabase\/admin/.test(read(f))).map(rel)).toEqual(['src/server/db.ts']);
  });

  // APBM007A: customer screens use the real API. The frontend-first mock (engines, fixtures, the mock
  // facades and their barrel) stays in the repo as specification reference only.
  it('no route, layout or mounted component can reach the FFM mock surface', () => {
    const MOCK_MODULES = 'ffm|registrationService|accountService|registration|account|pricing|catalog|latency|storage|stripeRoute|validation';
    const importsMock = (f: string) =>
      new RegExp(`from ['"]@/services/portal/(${MOCK_MODULES})['"]|from ['"]@/mocks/`).test(read(f)) ||
      (rel(f).startsWith('src/services/portal/') && new RegExp(`from ['"]\\./(${MOCK_MODULES})['"]`).test(read(f)));

    // Reviewed list of unmounted FFM reference views. Adding one is a deliberate change to this test.
    const FFM_REFERENCE_VIEWS = [
      'src/components/portal/account/AccountGate.tsx',
      'src/components/portal/account/AddStoreView.tsx',
      'src/components/portal/account/ConfirmStoreView.tsx',
      'src/components/portal/account/OwedBookReferenceView.tsx',
      'src/components/portal/account/StoreResultView.tsx',
      'src/components/portal/references/EmailReferenceView.tsx',
    ];
    const outsideServices = all.filter((f) => !rel(f).startsWith('src/services/portal/') && importsMock(f)).map(rel).sort();
    expect(outsideServices).toEqual(FFM_REFERENCE_VIEWS);

    // The live import surface and everything it re-exports are mock-free.
    const LIVE_SERVICES = ['index', 'portalApi', 'navigate', 'registrationSession', 'registrationForm', 'format', 'reference', 'npi'];
    for (const name of LIVE_SERVICES) {
      const f = all.find((x) => rel(x) === `src/services/portal/${name}.ts`)!;
      expect({ name, mock: importsMock(f) }).toEqual({ name, mock: false });
    }
    const barrel = read(all.find((x) => rel(x) === 'src/services/portal/index.ts')!);
    const reExported = [...barrel.matchAll(/from ['"]\.\/([A-Za-z]+)['"]/g)].map((m) => m[1]).sort();
    expect(reExported.every((name) => LIVE_SERVICES.includes(name))).toBe(true);

    // Nothing in the app tree, and no other component, mounts a reference view or keeps a /demo route.
    const referenceImport = /components\/portal\/(account\/(AccountGate|AddStoreView|ConfirmStoreView|OwedBookReferenceView|StoreResultView)|references\/)|from ['"]\.\/(AccountGate|AddStoreView|ConfirmStoreView|OwedBookReferenceView|StoreResultView)['"]|from ['"]\.\.\/references\//;
    const live = all.filter((f) => (rel(f).startsWith('src/app/') || rel(f).startsWith('src/components/')) && !FFM_REFERENCE_VIEWS.includes(rel(f)) && !rel(f).startsWith('src/components/portal/references/'));
    expect(live.filter((f) => referenceImport.test(read(f))).map(rel)).toEqual([]);
    expect(live.filter((f) => /["'`]\/demo\//.test(read(f))).map(rel)).toEqual([]);
    expect(all.filter((f) => /[\\/]app[\\/].*demo/.test(rel(f))).map(rel)).toEqual([]);
  });

  it('customer screens carry no harness: no demo notice, demo delay or demo storage outside the reference code', () => {
    const live = all.filter((f) => rel(f).startsWith('src/app/') || (rel(f).startsWith('src/components/') && !/(account\/(AccountGate|AddStoreView|ConfirmStoreView|OwedBookReferenceView|StoreResultView)|references\/)/.test(rel(f))));
    const offenders = live.filter((f) => /<DemoNotice|demoDelay|clearDemoStorage|PublicDemoControls|AccountStrip|CheckoutStandIn|PortalStandIn/.test(read(f)));
    expect(offenders.map(rel)).toEqual([]);
  });

  it('portal types are SDK-free', () => {
    for (const f of files(join(SRC, 'types', 'portal'))) expect(read(f)).not.toMatch(/from ['"](?!@\/types\/|\.\/)/);
  });

  it('no app code imports module documentation, design files or QAM', () => {
    const offenders = all.filter((f) => /agent_docs|_design\/|QAM\//.test(read(f).replace(/\/\/.*$/gm, '')));
    expect(offenders.map(rel)).toEqual([]);
  });

  it('the shared access rule is the only role predicate in the portal surfaces', () => {
    const literal = all.filter((f) => /=== ['"](superadmin|admin)['"]/.test(read(f))).map(rel);
    expect(literal).toEqual([]);
  });
});
