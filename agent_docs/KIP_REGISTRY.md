# Known Issues and Postponements — Payment Portal

Open items accepted for a limited scope. Each entry stays here until it is resolved and verified.
The OwedBook registry is `../cyph-v1-dev/agent_docs/KIP_REGISTRY.md`.

### KIP-1 — `zod` 3.x open advisory (zod 4 migration deferred for alpha)

- **Files:** `package.json` (`zod ^3.23.8`, installed 3.25.76; `@hookform/resolvers ^3.6.0`);
  the only consumer is `src/server/registration.ts` (`ownerSchema`, `pharmacySchema`).
- **Origin:** Payment Portal alpha deployment preparation, 2026-11-21 (dependency audit).
  Same advisory as OwedBook KIP-3.
- **Mechanism:** GHSA-mrhx-c7xc-m3w5 (high, CWE-770): zod can exhaust memory when a large
  array is submitted to an array schema; the array parse path collects every issue with no cap
  (advisory page read 2026-11-21). Every version below 4.6.6 is in the affected range; the
  only listed fix is zod 4.6.6, a breaking major.
- **Status:** **OPEN — NOT resolved.** Deferred for the alpha only, by the Director, 2026-11-21.
- **Difference from OwedBook:** OwedBook uses zod in browser forms only. The Portal uses it
  on the **server**, on the anonymous registration routes (`/api/registration/draft`, `quote`,
  `checkout`). The OwedBook reason "client-only" does not apply here.
- **Why the exposure is judged LOW for alpha (INFERENCE, not a test):** the two schemas are
  fixed-shape objects of string, literal and enum fields. No array, set, map, record or tuple
  schema exists anywhere in `src/` (grep, 2026-11-21), so the array path the advisory names is
  not reached. The advisory page does not state that scalar-only schemas are unaffected.
- **Risk:** LOW while no array schema validates request data; HIGH as soon as one is added
  on a server route under zod 3.
- **Triggers:** before any production deployment · before any `z.array`, `z.set`, `z.map`,
  `z.record` or `z.tuple` is added to server code · when `@hookform/resolvers` or
  `react-hook-form` is next upgraded.
- **Verification:** `npm audit --omit=dev` no longer lists `zod`; registration validation
  tests pass; typecheck and build clean.
- **Also open from the same audit (moderate, build-time or dev-only, not changed):**
  `@tailwindcss/typography` → `postcss-selector-parser`; `sucrase`, `glob`, `minimatch`
  (Tailwind build chain); the jest 30 and typescript-eslint chains (dev only). npm's offered
  fixes are downgrades or breaking majors.
