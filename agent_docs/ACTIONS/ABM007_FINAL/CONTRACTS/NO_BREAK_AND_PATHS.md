# NO_BREAK_AND_PATHS — ABM007_FINAL

**Version:** 1.1-review (Architect amendments A-05, A-06 applied) · **Date:** 23 November 2026. Protected behaviors, per-repository routing, allowed and protected paths, and permitted effects. Path existence is from the Engineer's recon section 9.4 on the baselines; the Engineer re-verifies in the plan.

## 1. Behaviors that must not change

From the Architect handoff section 6 and the manual-repair history (R1 to R10, F1 to F6).

**Account, roles, identity**
- One owner, many pharmacies, one subscription. Billing authority comes from account ownership, checked on the server.
- A Store admin manages staff for assigned stores only. Delegation never transfers ownership or billing.
- A Member sees assigned stores only and gains nothing by guessing an address.
- The Owner keeps access after delegation and cannot be removed through member controls.
- NPI is the required unique store identifier; NCPDP is optional.
- Same-owner paid re-add restores the original store and history (D-11).

**Sign-in and navigation**
- Emailed-link sign-in and the current password controls.
- App-to-app handoff with separate cookies: single-use, short-lived, audience-bound, with the existing origin and path guards. Localhost support stays alongside alpha.
- A link opens a page with a button; only the button signs anyone in.
- Used and expired links do not restore access. Signing out of OwedBook ends access in both apps.

**Money and lifecycle**
- $99 first pharmacy, $49 each additional (D-04).
- Server-authoritative quote, consent and payment outcome. A browser return never proves payment.
- Exactly-once and idempotency, pending-operation recovery, activation boundaries.
- Scheduled removal keeps current access until the period end; next-renewal count may differ from access-now count; undo restores it.

**Truthfulness**
- Settings stay read-only; "Not provided" stays where true.
- Audit wording keeps actor, context, local time, the difference between "scheduled" and "removed", and between delegation and ownership.
- Empty claims dashboards are expected for new pharmacies.
- Support address shown is `support@pharmacybooks.com`.

**Usability repairs that are easy to lose in a restyle**
- Busy text, spinners, live regions and duplicate-submit guards (R2).
- Named confirmation with a no-effect Cancel on member removal (R4).
- No Add Pharmacy form for a Store admin; "managed by Owner" view; friendly denial with a way back (F1 to F3).
- Navbar shows the display name and a compact true role; full email in the account menu (F5).

## 2. Per-repository routing

| Work | OwedBook `cyph-v1-dev` | Portal `cyph-payment-portal-dev-v1` |
|---|---|---|
| Module pack | Pointer file only (`CONTRACTS/OWEDBOOK_POINTER.md` installed as the module `README.md`) | Canonical pack (P-18) |
| Token block, Inter, radius and shadow scale, forced light | `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx` | `src/app/globals.scss`, `tailwind.config.ts`, `src/app/layout.tsx` |
| Brand constant | New single brand file | Existing `src/components/portal/brand.ts` |
| Logo and icons | `public/brand/`, `src/app/icon.png`, `apple-icon.png`, `favicon.ico` | `public/` (or `public/brand/`), `src/app/` same three |
| Help page | New route, navigation entry in `Navbar` and the mobile menu | None |
| "No permitted stores" fix | Where the selector renders (the Engineer locates it; recon did not) | Only if the same message exists there |
| Landing page | `src/app/(public)/HomePageContent.tsx`, `NavbarHome.tsx` | None |
| Billing notice wording | None | `src/server/billingNotices.ts` strings and its tests |
| Stripe code | None exists | **No change.** Branding is dashboard configuration |
| Stale browser specs | None | Mapping table; retire per P-09 |
| Redeploy | `./deploy.sh` in this repository | `./deploy.sh` in this repository |

## 3. Allowed paths (product)

**OwedBook:** `src/app/globals.css`; `tailwind.config.ts`; `src/app/layout.tsx`; `src/app/**/page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx` for presentation and the new Help route; `src/app/(public)/HomePageContent.tsx`; `src/app/profile/ProfileForm.tsx`; `src/components/global/**`; `src/components/layout/**`; `src/components/ui/**`; `src/components/owedbook/**`; `src/components/admin-portal/**`; `src/components/auth/**`; `src/components/invitations/**`; `src/components/common/**`; a new brand constant file; a new Help component folder; `public/brand/**`; `src/app/icon.png`, `apple-icon.png`, `favicon.ico`; `public/landing/**`; `src/__tests__/**` for tests coupled to presentation and the new tests.

**Portal:** `src/app/globals.scss`; `tailwind.config.ts`; `src/app/layout.tsx`; presentation in `src/app/**/page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, `src/app/login/LoginPageContent.tsx`; `src/components/portal/**` (reachable files); `src/components/ui/**`; `src/components/global/**`; `src/components/common/**`; `src/components/auth/**`; `public/**` logo and icon files; `src/app/icon.png`, `apple-icon.png`, `favicon.ico`; **brand strings only** in `src/server/billingNotices.ts`; `src/__tests__/**`; `e2e/**` only to retire specs per the mapping table.

**Records, both repositories.** Two classes, with different timing:

| Record | During engineering | At the closeout checkpoint only |
|---|---|---|
| This module's folder: state, journal, execution plan, acceptance ledger, QAM manifest, engineering handoff | Yes | |
| The session log, changelog and response files each repository's own instructions require | Yes, as **appended, dated entries**. Earlier entries are not rewritten | |
| The three existing OwedBook session-record changes found in the recon tree | Reconciled as described in the backlog file, section 6. Nothing wider | |
| `RECOVERY.md` in either repository | **No.** Protected | Rewritten only at the closeout checkpoint, under the Director's authorization |
| Any other file a repository's own instructions protect until closeout | No | At closeout, as those instructions say |

A general permission to keep records never authorizes a `RECOVERY.md` rewrite. If a repository's own instruction explicitly requires a `RECOVERY.md` update at a named earlier step, the Engineer quotes that instruction in the plan and the Director rules before anything is written.

**Authority rule (applies to this whole pack).**
1. Read and obey each repository's applicable instructions (`CLAUDE.md`, `AGENTS.md`, and `CLAUDE.local.md` in OwedBook), including their protections and tool restrictions. This pack does not erase them.
2. Preserve the Director's explicit decisions (`ABM_RULINGS.md` section 1) and the module exceptions he has approved. A generic repository rule does not silently reverse them. Example: a general "support light and dark" rule does not reopen D-01.
3. Where a repository instruction and this pack really conflict on scope, permissions or grading, quote both sources, **stop only the affected work**, and ask the Director. Everything else continues. Neither side wins by default.

## 4. Protected paths (never changed by this module)

- All `src/server/**` except the brand strings named above.
- All `src/app/api/**`.
- `src/proxy.ts`, `src/lib/appIdentity.ts`, `src/utils/supabase/**`, `src/services/auth/**`.
- Pricing constants (`src/server/pricing.ts`, `storePricing.ts`) and any price shown from them.
- `supabase/migrations/**` (0001 to 0071) and `supabase/setup.sql`. No new migration.
- `scripts/**`, `deploy.sh`, `Dockerfile`, `cloudbuild.yaml`, environment files and secrets.
- `package.json` and lockfiles: **no dependency added, removed or upgraded.** Inter arrives through the `next/font` already in use. If the Engineer finds a dependency is unavoidable, that is a stop, not a judgment call.
- `RECOVERY.md` and other files each repository's own instructions protect until closeout (see the records table in section 3).
- Historical module folders and evidence.

If required work appears to need a protected path, the affected task stops and the Engineer reports the exact need. Other tasks continue.

## 5. Dead code and leftovers

List, ask, then remove: the Engineer lists the old logo files, `public/next.svg`, `public/vercel.svg`, `public/favicon-512.png`, the theme toggler components and any unreferenced file made unreachable by this module. Nothing is deleted without the Director's word, except that toggler **mount points** are removed as part of D-01.

## 6. Permitted effects

| Effect | Engineer | QA Executor |
|---|---|---|
| Read-only repository and Git inspection | Yes | Yes |
| Local install, build, serve, unit tests in isolated copies | Yes | Yes, QA-controlled |
| Git mutation (commit, branch, merge, push) | No. Director only | No. Director only |
| Database writes | None. No migration, no DEV data change | SCRATCH only, within the approved envelope |
| Stripe | Read-only GET requests already used in recon; no write | Sandbox only, within the approved envelope (P-19); no refund. **No paid test until the event-isolation condition below is proven or the Director has authorized a specific alternative** |
| Emails sent | None required by engineering | Only as the approved journeys require, to QA inboxes |
| Supabase or Stripe dashboard changes | None. Engineer prepares values; the Director applies them | None |
| Deployment | Runs `./deploy.sh` only when the Director authorizes that service | None |
| The Director's rehearsal account | Not used | Not used |

**One consumer rule.** The alpha Portal consumes the sandbox's webhook events. Any local DEV-backed Portal or listener stays off while alpha is under test.

**Shared-sandbox isolation condition (Architect amendment A-06).** QA and alpha use the same Stripe sandbox. A second listener and a different database do **not**, by themselves, keep their events apart: an event created by a QA purchase is also delivered to alpha's registered endpoint, and an event created on alpha is also forwarded to a QA listener.

Before any paid Q2 test, Q1 must:
1. Identify, read-only, how events are actually routed and handled: which endpoints and listeners receive which event types, and what each handler does with an event whose customer, subscription or account it does not know.
2. Prove both directions: a QA event cannot change alpha's DEV data, and an alpha event cannot change the QA database. Proof is the routing facts plus the handling behavior, shown from source and configuration read-outs and, where a safe observation exists, an observed outcome. A list of running processes is not proof.
3. If the existing setup cannot give that property, return **one** concrete routing or handling proposal for the Director to authorize. Paid tests wait for that authorization.

Not allowed without the relevant release: editing payment or webhook code, disabling or changing alpha's endpoint, creating another sandbox, running purchases. Work that involves no payment may continue where it is safe on its own. The USD 400 figure in P-19 is a proposed maximum, not a quota and not a permission.

## 7. One active writer

One seat writes to a checkout at a time. Each handoff records the owner, scope, identity, and any owned processes and temporary paths. Repairs happen on `qa/abm007-final` only, after Q2 is completely finished.
