# ABM007_FINAL — Pre-ABM reconnaissance report

**Date:** 23 November 2026, Asia/Dhaka
**Author:** Claudy (Engineering seat), read-only reconnaissance
**For:** Friday (ABM author), JARVIS (review), Director
**Status:** Discovery only. No redesign, no ABM, no product edit, no git mutation, no deployment, no dashboard change, no database write.

Inputs read first: `ABM007_FINAL_BRANDING_CONFLICT_REGISTER_v0_3_2026-11-23.md`, `CYPH_FRANK_DESIGN.md`, both repositories' instruction files (`CLAUDE.md`, `CLAUDE.local.md` in OwedBook; `CLAUDE.md` in the Portal).

**How to read the labels**

- **[V]** verified in this session by reading the files or running a read-only command.
- **[P]** proposal or estimate from Engineering. Not a decision.
- **[U]** could not be checked with the access and limits of this task. The exact remaining check is named.

"OwedBook" means the repository `cyph-v1-dev`. "Portal" means `cyph-payment-portal-dev-v1` (the Account & Billing app).

---

## 0. Headline findings

1. **[V] Both apps are token-driven and almost free of hardcoded colour.** Zero hex, `rgb()` or arbitrary colour values in either app's components. Three numbered Tailwind colours in each app. The palette swap is therefore mostly a change in one stylesheet per app.
2. **[V] Radius and shadow are NOT one knob.** `--radius: 0px` only affects elements that already carry a `rounded-*` class. The Portal has 40 card-like containers (`bg-card`) and none of them carries a radius class; it has 6 shadow utilities in total. The rounded, soft-shadow look has to be added component by component, mainly in the Portal.
3. **[V] The Portal ships dark by default today.** Its root layout hardcodes `class="dark"` and `defaultTheme="dark"`. OwedBook defaults to light but follows the operating system setting and any stored choice. Light-only is a visible change for Portal users, and both apps need an enforced setting, not only a hidden toggle.
4. **[V] The two apps' themes have drifted.** Same origin, but the Portal carries 12 token values changed for measured contrast, a different `--accent`, no `--navbar` or chart tokens, a different button recipe and a different default theme.
5. **[V] No Help page exists in either app.** No `/help` route, component or draft. The register's "Help" item (C-03) is new build work, and its content has no source in either repository.
6. **[V] Three new conflicts with the approved design are not in the register:** Portal buttons are uppercase semibold (design: Title Case, regular, never uppercase); a standing Portal ruling keeps links in body-text colour with an underline (design: every link dark green); OwedBook's current status colours fail text contrast on white before any rebrand. Details in section 9.3.
7. **[V] Stripe sandbox has no branding set.** Logo, icon and both colours are empty. The customer-visible names are still "Cyber Pharma" (business name, statement descriptor, billing-portal headline).
8. **[V] All sign-in, access and invitation mail uses one Supabase-hosted template.** Its live body is not in either repository. The link logic it must keep is documented and is fragile.
9. **[V] Unit baselines are green:** OwedBook 374/374 (54 suites), Portal 572/572 (32 suites). **16 of the Portal's 19 browser specs target `/demo/*` routes that were removed on 13 November**, so the Portal has no runnable browser regression for today's screens apart from three specs that need a private fixture file and running servers.
10. **[P] Effort:** about 9 to 12.5 engineering working days across both apps, assets, emails, Stripe and verification, not counting approval waits. Breakdown in section 9.7.

---

## 1. Baselines, branches, worktrees, remotes

| Item | OwedBook | Portal |
|---|---|---|
| Path | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` |
| Full HEAD **[V]** | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Matches reported baseline **[V]** | Yes (`9597699`) | Yes (`cb4decd`) |
| Branch **[V]** | `abm007-final`, tracks `origin/abm007-final` | `abm007-final`, tracks `origin/abm007-final` |
| `main`, `origin/main`, branch upstream **[V]** | all equal to HEAD | all equal to HEAD |
| Worktrees **[V]** | one (the main checkout) | one (the main checkout) |
| Stashes **[V]** | none | none |
| Local branches **[V]** | `abm007-final`, `main` | `abm007-final`, `main` |
| Remote `origin`, fetch and push **[V]** | `https://github.com/Cyberize-Group/cyph-v1-dev.git` | `https://github.com/ahmedmusawir/cyph-payment-portal-dev-v1.git` |
| Credentials in the remote URL **[V]** | none | none |
| Working tree **[V]** | **not clean: three record files** (see below) | clean, before and after this task |

- **Remote identities are different accounts.** OwedBook pushes to the `Cyberize-Group` organisation. The Portal pushes to the personal `ahmedmusawir` account. Recorded as found. Nothing changed.
- **Remote-tracking refs are as of the last fetch.** No fetch was run (it would update refs).
- **OwedBook tree:** `RECOVERY.md`, `CHANGELOG.md` (modified) and `agent_docs/SESSIONS/session_2026-11-23.md` (new). These are this session's factory records, written before and during this task. No product, test, deploy or migration file differs from HEAD.
- **Deployed revisions (from the repositories' records, not re-checked live):** OwedBook alpha runs commit `ef4cebc`; Portal alpha runs `6dd3de7`. Both are older than today's HEADs by record-only commits as far as the commit subjects show; not diffed here.

---

## 2. Styling architecture (task item 1)

### 2.1 Stack

| Item | OwedBook | Portal |
|---|---|---|
| Tailwind **[V]** | `tailwindcss ^3.4.1` (v3, config file based) | same |
| Component kit **[V]** | shadcn-style primitives in `src/components/ui` (17 files), Radix, `class-variance-authority` | same pattern (15 files) |
| Token file **[V]** | `src/app/globals.css` | `src/app/globals.scss` (needs `sass`, present) |
| Token format **[V]** | CSS variables holding HSL triplets, mapped in `tailwind.config.ts` as `hsl(var(--x))` | same |
| Dark mode strategy **[V]** | `darkMode: ["class"]` | same |
| Plugins **[V]** | typography, aspect-ratio, grid-auto-fit, tailwindcss-animate | same |
| Next.js / React **[V]** | 16.4.5 / 19.2 | same |
| Styled source files (non-test) **[V]** | 85 of 162 | 62 of 169 |

`components.json` in OwedBook names `app/globals.scss` as the stylesheet; the real file is `src/app/globals.css` **[V]**. This only affects the shadcn generator. Not a runtime defect.

### 2.2 Current token values (light theme)

| Token | OwedBook **[V]** | Portal **[V]** | Drives |
|---|---|---|---|
| `--background` | `217 16% 90%` grey "Mist" | same | page surface |
| `--foreground` | `219 16% 17%` | `220 24% 16%` | body text |
| `--card` / `--popover` | white | white | panels, menus, dialogs |
| `--primary` | `12 93% 64%` coral | same | default button, active nav item, avatar tile, some links and icons |
| `--primary-foreground` | white | **dark ink** `220 24% 12%` | text on primary |
| `--secondary` | `220 19% 94%` | `216 16% 88%` | sidebar, auth navbar strip, secondary buttons |
| `--accent` | **coral** (same as primary) | **neutral grey** `216 16% 90%` | hover and focus surface of menus, ghost and outline buttons |
| `--muted` / `--muted-foreground` | `222 15% 87%` / `218 12% 42%` | `216 16% 93%` / `220 10% 36%` | quiet surfaces, secondary text |
| `--border` | `220 12% 75%` | `216 15% 80%` | all default borders |
| `--input` | same as border | **darkened** `216 15% 50%` | form field borders |
| `--ring` | coral | deeper coral `12 80% 44%` | focus ring |
| `--navbar` | `12 83% 47%` dark coral | **does not exist** | OwedBook signed-in header only |
| `--destructive` / `--success` / `--warning` / `--info` | `2 67% 51%` / `131 54% 40%` / `41 93% 47%` / `214 74% 53%` | darker: `2 67% 40%` / `131 54% 34%` / `41 93% 32%` / `214 74% 50%` | status pills, notices, errors |
| `--chart-1..5` | red, blue, green, maroon, coral | **do not exist** | OwedBook KPI tiles |
| `--radius` | `0px` | `0px` | every `rounded-sm/md/lg` |

OwedBook also defines two unused alternates, `.theme-bright` and `.dark.theme-deep` **[V]** (no reference anywhere in `src`).

### 2.3 Token consumers (occurrences / files, non-test source) **[V]**

| Token family | OwedBook | Portal |
|---|---|---|
| `primary` | 36 / 16 | 26 / 12 |
| `accent` | 30 / 11 | 20 / 7 |
| `secondary` | 22 / 12 | 4 / 2 |
| `muted` (incl. `muted-foreground`) | 126 / 58 | 183 / 45 |
| `foreground` | 64 / 26 | 191 / 42 |
| `card` | 26 / 18 | 43 / 26 |
| `border` | 34 / 24 | 72 / 34 |
| `input` | 10 / 9 | 9 / 8 |
| `ring` | 15 / 13 | 28 / 20 |
| `destructive` | 50 / 26 | 43 / 12 |
| `success` / `warning` / `info` | 10 / 7 / 9 | 9 / 7 / 12 |
| `navbar` | 14 / 1 (`Navbar.tsx`) | 0 |
| `chart-*` | 7 / 3 | 0 |

How `primary` is used **[V]**:

- **OwedBook:** `text-primary` 14, `bg-primary` 8, `hover:bg-primary/90` 4, `border-primary` 2, `hover:border-primary` 2, `fill-primary` 2, `accent-primary` 1 (native checkbox colour).
- **Portal:** `text-primary` 8, `bg-primary` 8, `hover:bg-primary/90` 3, `border-primary` 3, `hover:text-primary` 2, `focus:bg-primary` 1, `focus:text-primary` 1. Native checkboxes and radios also read `--primary` through a base rule in `globals.scss`.

This confirms the register's C-04 concern: in both apps `--primary` is the button and interactive colour. Setting it to the design's "primary" (navy) would turn buttons navy.

### 2.4 Hardcoded colours and overrides **[V]**

| Measure | OwedBook | Portal |
|---|---|---|
| Hex colours in components | 0 | 0 |
| `rgb()` / `hsl()` literals | 0 | 0 |
| Arbitrary colour classes (`[#…]`) | 0 | 0 |
| Numbered Tailwind colours | 2: `AccessBanner.tsx:43` `border-yellow-500`, `bg-yellow-500/10` | 3: `SpinnerLarge.tsx:8` `text-gray-200`, `dark:text-gray-600`, `fill-blue-600` |
| `white` / `black` utilities | 6: `text-white` in `FilterRail.tsx` (2), `KpiTiles.tsx`, `OwedBookScreen.tsx`; `bg-black/50` and `bg-black/80` overlays | 4: `bg-black/80` (2), `bg-black/60` overlays; `dark:fill-white` |
| Inline `style` props | 0 | 1: `Stepper.tsx:41` (progress width only, no colour) |
| `dark:` variants | 3, all in `ThemeToggler.tsx` | 4, in `ThemeToggler.tsx` and `SpinnerLarge.tsx` |
| Hex in assets | three SVG logos carry `#F9704F` and `#1B2024` | same three files |

Per-screen override count (register R-7): there are no page-level stylesheets or per-page colour overrides in either app. All styling is utility classes on components **[V]**.

### 2.5 Fonts **[V]**

| Item | OwedBook | Portal |
|---|---|---|
| Family | Saira | Saira |
| Loading | `next/font/google` in `src/app/layout.tsx` (downloaded at build, served with the app) | same |
| Weights loaded | 300, 400, 500, 600, 700, 800 | 400, 500, 600, 700 |
| How applied | CSS variable `--font-brand` → Tailwind `font-brand` → `body` | class on `<body>` (no variable) |
| `font-brand` utility uses | 7 (5 in page titles) | 0 |
| Weight classes in use | semibold 42, bold 36, medium 23, light 4, normal 2 | semibold 83, medium 52, bold 33, normal 5 |
| Arbitrary pixel text sizes | 13 | 52 |
| `uppercase` utilities | 40 in 19 files | 45 in 21 files |

- Switching to Inter is a change in each root layout. `next/font/google` already satisfies "Inter must ship with the page".
- The design allows weights 400 to 700. OwedBook uses `font-light` (300) in four card titles.
- `public/brand/logo-lockup.svg` embeds the text "Cyber Pharma" in Saira.

### 2.6 Radius **[V]**

- One variable, `--radius: 0px`, feeds Tailwind `rounded-lg` (= radius), `rounded-md` (radius − 2px) and `rounded-sm` (radius − 4px) in both apps.
- Uses: OwedBook 46 in 21 files (`rounded-md` 20, `rounded-sm` 10, `rounded-full` 8, `rounded` 4, `rounded-lg` 3, `rounded-none` 1). Portal 18 in 7 files, almost all inside `src/components/ui`.
- **Card-like containers without any radius class:** OwedBook 15 of 20 `bg-card` uses; Portal 40 of 40. OwedBook has a `Card` primitive (`rounded-lg … shadow-sm`, 9 uses). The Portal has no `Card` primitive; its panels are plain bordered `div`s.
- The design's radius names do not line up with the kit's. Design: button and field 8px, logo tile 12px, card 14px, shell 16px. Kit: buttons and fields use `rounded-md`, cards `rounded-lg`. A single `--radius` cannot produce 8px on `md` and 14px on `lg`; the Tailwind `borderRadius` scale needs explicit values.

### 2.7 Shadows **[V]**

- No shadow token exists in either app. Shadows are stock Tailwind utilities.
- Uses: OwedBook 13 in 11 files (`shadow-lg` 6, `shadow-xl` 2, `shadow-md` 2, `shadow-sm` 1, `shadow-2xl` 1). Portal 6 in 5 files (`shadow-lg` 5, `shadow-md` 1). Almost all are on menus, dialogs, toasts and drawers, not on content cards.
- The design asks for navy-tinted shadows at four strengths (shell, masthead, card, logo tile). Stock Tailwind shadows are black-tinted. A `boxShadow` extension in each `tailwind.config.ts` is needed, then applied to cards and shells.

### 2.8 Shared or drifted (register R-4) **[V]**

Drifted. Same structure and origin, different values and recipes:

| Aspect | OwedBook | Portal |
|---|---|---|
| Default theme | light, follows system | dark, system ignored |
| `--accent` | coral with white text | neutral grey |
| `--primary-foreground` | white | dark ink |
| Contrast repairs | none | 12 values changed (`portal:` and `portal R1:` comments, with measured ratios) |
| `--navbar`, `--chart-*`, `font-brand` | present | absent |
| Default button | 40px, medium weight, sentence case | 44px, semibold, **uppercase**, hairline border |
| Outline button | `border-4` | `border` (1px) |
| Link style | `text-primary`, underline on hover | `.portal-link`: body-text colour, always underlined (ruling R-004 cited in the stylesheet) |
| Status pill | tinted background, **coloured text** | tinted background, status border, **body-colour text** |
| Global focus rule | none (per-component rings) | global `:focus-visible` 2px outline with offset |
| Signed-in header | coral bar (`bg-navbar`) | white bar (`bg-card`) with bottom border |

The two apps cannot share one stylesheet without first reconciling these. The ABM should state whether ABM007_FINAL aligns them or restyles each in place.

---

## 3. Theme switching and light-only enforcement (task item 2)

### 3.1 What exists **[V]**

| Item | OwedBook | Portal |
|---|---|---|
| Library | `next-themes ^0.4.6`, wrapper `src/app/providers/ThemeProvider.tsx` | same |
| Provider settings (`src/app/layout.tsx`) | `attribute="class"`, `defaultTheme="light"`, `enableSystem={true}` | `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}` |
| `<html>` class | font variable only | hardcoded `className="dark"` |
| Toggle | `src/components/global/ThemeToggler.tsx`: menu with Light, Dark, System | `src/components/global/ThemeToggler.tsx`: one Light/Dark button, `data-testid="theme-toggle"` |
| Toggle mount points | 5: `Navbar.tsx` (desktop, mobile), `NavbarHome.tsx` (desktop, mobile), `NavbarLoginReg.tsx` | 4 reachable: `Shell.tsx` (desktop, mobile), `PublicShell.tsx` (desktop, mobile); plus 1 in `HandoffShell.tsx` (not reachable from any route) |
| Persistence | next-themes default: browser `localStorage`, key `theme`. No custom `storageKey`. | same |
| System preference | honoured when the stored value is `system` (selectable in the menu) | not honoured |
| Server-side or cookie theme | none | none |
| Dark token block | `.dark` in `globals.css`, plus `.dark.theme-deep` | `.dark` in `globals.scss` |

Behaviour today:

- **OwedBook:** a first-time visitor sees light. A visitor who once chose Dark, or chose System on a dark-mode computer, sees dark.
- **Portal:** every first-time visitor sees dark. Only a visitor who pressed the toggle sees light.

### 3.2 How to enforce light only **[P]**

Hiding the toggle alone is not enough: stored choices and the Portal's default would still produce dark screens.

Recommended, smallest change, both apps:

1. **Force the theme at the provider:** add `forcedTheme="light"` to `ThemeProvider` in each `src/app/layout.tsx`. next-themes then ignores stored and system values without deleting them, so a later dark-mode release does not need a migration. (Library behaviour as documented for next-themes; confirm in the build.)
2. **Portal:** remove the hardcoded `className="dark"` from `<html>` and set `defaultTheme="light"`, `enableSystem={false}`. Without this the first paint is dark before scripts run.
3. **OwedBook:** set `enableSystem={false}`.
4. **Remove the toggle from its mount points** (five in OwedBook; four reachable plus one unreachable in the Portal). Leave `ThemeToggler.tsx` and the `.dark` token blocks in place but unreachable, or delete them on the Director's word (dead-code rule: list, ask, then remove).
5. **Leave `darkMode: ["class"]` as is.** With no `dark` class on `<html>`, no `dark:` variant can apply, and the operating system setting has no path into the page.
6. **Verification:** set `localStorage.theme = "dark"` and the operating system to dark, reload every shell, confirm light. Add one unit test per app that the root layout forces light.

Effects on existing tests **[V]**:

- OwedBook: four test files reference the toggle or theme (`Navbar.invariant`, `Navbar.mobile`, `Navbar.switcher`, `final-batch-audit-identity`). They need a look when the toggle leaves the navbar.
- Portal: `portal-shell.test.tsx` and `portal-storage.test.ts` reference the theme. The browser helper `e2e/gate-m.ts` forces themes by writing `localStorage` and toggling the `dark` class directly, and many specs loop over both themes.

Open point for the ABM **[P]**: keeping the `.dark` token block means a new brand value must be written for light only, and the dark block keeps stale coral values. State in the pack that the dark block is frozen and unreachable, so no one retunes it by mistake.

---

## 4. Screen and component inventory; proposed sample screens (task item 3)

### 4.1 OwedBook routes **[V]**

| Group | Route | Shell | Main components |
|---|---|---|---|
| Public | `/` | `NavbarHome` + `Main` | `HomePageContent` (marketing landing, hero image `public/landing/owedbook-mockup.png`) |
| Public | `/access-denied` | same | card |
| Sign-in | `/auth` | `NavbarLoginReg`, full-height centred | `LoginForm` (password), `LinkRequestForm` (emailed link) |
| Sign-in | `/auth/confirm`, `/auth/link-expired`, `/auth/sign-in-to-continue`, `/auth/signed-out`, `/auth/switch`, `/auth/handoff-recovery` | same | `AuthPages` |
| App | `/owedbook` | `AuthedShell` = `Navbar` + sidebar (`FilterRail`) | `OwedBookScreen`, `KpiTiles`, `DataTable`, `StatusChip`, `AccessBanner`, `ResultsToolbar`, `MultiSelect` |
| Admin Portal | `/admin-portal` (My Stores) | `AuthedShell` + nav sidebar | `MyStoresScreen`, `StoreCard`, `AddStoreButton` |
| Admin Portal | `/admin-portal/stores/[id]` | same | `StoreDetailScreen`, `LiveStaffPanel`, `MemberRoster`, `PharmacyDetails` |
| Admin Portal | `/admin-portal/stores/[id]/invite` | same | `InviteScreen`, `InviteMemberForm` |
| Admin Portal | `/admin-portal/billing` | same | `BillingScreen`, `BillingRow` |
| Admin Portal | `/admin-portal/settings` | same | `SettingsScreen`, `SettingsForm` |
| Admin Portal | `/admin-portal/audit` | same | `AuditScreen`, `LiveAuditLog` |
| Account | `/invitations` | page-level | `InvitationsScreen` |
| Account | `/profile` | `Navbar` only | `ProfileForm` |
| System | `not-found`, three `error.tsx`, three `loading.tsx`, `/error` | per group | cards, spinners |

About 19 distinct screens. Every non-type source file is reachable from a route.

### 4.2 Portal routes **[V]**

| Group | Route | Shell | Main components |
|---|---|---|---|
| Entry | `/` | none | redirects to `/register/plan` |
| Signup | `/register/plan`, `/register/pharmacy`, `/register/owner`, `/register/review`, `/register/activation` | `PublicShell` | `PlanView`, `PharmacyStepView`, `OwnerView`, `ReviewView`, `ActivationView`, `AccessLinkView`, `CheckoutIncompleteView`, `Stepper`, `FormField`, `RadioCard` |
| Sign-in | `/login` | `PublicShell` | `LoginPageContent`, `LinkRequestForm` |
| Sign-in | `/auth/confirm`, `/auth/link-expired`, `/auth/sign-in-to-continue`, `/auth/signed-out`, `/auth/switch`, `/auth/handoff-recovery` | page-level | `AuthPages` |
| Account | `/dashboard` | `Shell` (top bar, centred `max-w-6xl`) | `DashboardView`, `DataTable`, `Pill`, `StoreRemovalControl` |
| Account | `/billing` | same | billing overview, link to Stripe's hosted portal |
| Account | `/stores/add` (Add Pharmacy) | same | `AddStoreFlow`, `PharmacyFields` |
| System | `not-found`, `(account)/loading` | | |

About 16 distinct screens.

**Unreachable Portal source [V]** (static import analysis from every file under `src/app`; candidates, not a deletion list): 30 files, including `AddStoreView`, `ConfirmStoreView`, `StoreResultView`, `OwedBookReferenceView`, `EmailPreview`, `EmailReferenceView`, `HandoffShell`, `ExternalHandoffPanel`, `Counter`, `AccountGate`, and the old demo engine under `src/services/portal/` (`registration.ts` 958 lines, `account.ts` 553 lines, and others). Several still link to `/demo/...` routes that no longer exist. Unit tests still import them. For ABM007_FINAL this means: they inherit token changes for free, and they should not be counted as screens to restyle or to test visually.

### 4.3 Shared component vocabulary to cover in the brand/UI contract **[V]**

Present in the apps and absent from the design (register C-01): signed-in top bar; sidebar and mobile drawer; data table (OwedBook `common/DataTable`, Portal `portal/DataTable` with a stacked mobile layout); filter rail and multi-select; KPI tiles (four solid colour tiles with white text); status pills (two different recipes); role badge in the navbar (both apps, `data-testid="nav-role-badge"`); dialogs, alert dialogs, sheets, dropdown menus, toasts; breadcrumb; stepper; radio cards; empty states; spinners and skeletons; inline alert and error summary; footer with support and legal links; skip link.

### 4.4 Mapping to the register's C-03 groups **[V for existence, P for grouping]**

| C-03 group | Real screens |
|---|---|
| Literal RFI look: sign-in, signup, Add Pharmacy | OwedBook `/auth` and its six auth pages; Portal `/login`, six auth pages, five `/register/*` steps, `/stores/add` |
| Help | **does not exist in either app** |
| Translated: Dashboard, My Stores, staff administration, Settings, Profile, Audit, billing overview | OwedBook `/owedbook`, `/admin-portal`, `/admin-portal/stores/[id]` (+ invite), `/admin-portal/settings`, `/profile`, `/admin-portal/audit`, `/admin-portal/billing`; Portal `/dashboard`, `/billing` |
| **Not placed by the register** | OwedBook public landing `/`; OwedBook `/invitations`; `/access-denied`; not-found, error and loading states in both apps |

Note: Portal `/stores/add` sits inside the signed-in `Shell` today. Treating it as "literal" means a signed-in screen without the normal top bar, or a literal panel inside the bar. The contract should say which.

### 4.5 Proposed canonical sample set **[P]**

Four screens plus the style tile, chosen so every shell and every contested component appears once:

| # | Sample | Why this one |
|---|---|---|
| 0 | **Style tile** (new, single page): palette, type scale, primary/secondary/outline/destructive buttons in default, hover, focus, disabled and busy states, text link on white and on navy, form field with label, help and error, Owner / Store admin / Member badges, success / warning / destructive / info pills and notices, card, step badge, logo tile | Settles C-04, C-05, C-06 and C-12 in one view |
| 1 | **Portal `/login`** | Literal RFI layout: navy backdrop, white shell, gradient masthead, logo tile, one card with fields |
| 2 | **Portal `/register/plan`** | Literal layout with the $99 and $49 pricing on screen and the stepper; proves the pricing is untouched |
| 3 | **OwedBook `/owedbook`** | Translated layout at full table width: navy header, role badge, filter rail, KPI tiles, data table, status chips, access banner |
| 4 | **Portal `/dashboard`** | Translated layout: pills, pharmacy table, billing summary, removal control, footer |

Optional fifth: OwedBook `/admin-portal/stores/[id]` (staff list, role labels, remove-access dialog), if Coach wants a dialog and a people list approved before rollout.

Practical constraints for producing the samples:

- **[V]** OwedBook has a mock data mode (`NEXT_PUBLIC_APBM_DATA_MODE=mock`, read at build), so samples 0 and 3 can be rendered without the DEV database.
- **[V]** The Portal's demo routes were removed on 13 November (commit `9018e8c`). Samples 1 and 2 are public pages and render without sign-in, but the Portal server still needs its Supabase and Stripe configuration to start. Sample 4 needs a signed-in session against DEV or a fixture harness.
- **[U]** Whether the Portal can boot for screenshots without DEV access was not tested (starting DEV-backed servers is outside this task). The ABM should name how sample 4 is captured.
- **[P]** The style tile needs a home: a new route that is excluded from production builds, or a static HTML file in the module folder. Neither app has such a route today.

---

## 5. Logo assets, favicon, app icons, asset-package plan (task item 4)

### 5.1 What exists **[V]**

| File | OwedBook | Portal | Content |
|---|---|---|---|
| `logo-color.svg` | `public/brand/` | `public/` | 128×128 coral square `#F9704F` with a white drop shape; `aria-label="Cyber Pharma"` |
| `logo-lockup.svg` | `public/brand/` | `public/` | coral tile + the text "Cyber Pharma" in Saira |
| `logo-mono.svg` | `public/brand/` | `public/` | the drop shape in `currentColor`; **not referenced** by any source file |
| `src/app/icon.png` | yes | yes | 512×512 PNG; byte-identical in both repos |
| `src/app/favicon.ico` | **absent** | yes (16 and 32 px sizes among 4) | |
| `public/favicon-512.png` | absent | yes, identical to `icon.png` | |
| `public/next.svg`, `public/vercel.svg` | yes (framework leftovers, unreferenced) | absent | |
| `public/landing/owedbook-mockup.png` | yes, 3520×2040 | absent | landing hero screenshot of the current coral UI |
| Apple touch icon, web manifest, Open Graph image | absent | absent | |

The three SVG logos are byte-identical across the two repositories.

Where the logo is rendered **[V]**:

| Place | File | Asset | Size |
|---|---|---|---|
| OwedBook signed-in header | `src/components/global/Navbar.tsx:156` | `logo-color.svg`, alt "Cyber Pharma" | 36×36 |
| OwedBook public header | `src/components/global/NavbarHome.tsx:23` | `logo-lockup.svg` | lockup |
| OwedBook sign-in header | `src/components/global/NavbarLoginReg.tsx:11` | `logo-lockup.svg` | lockup |
| Portal, all three shells | `src/components/portal/Brand.tsx:9` | `logo-color.svg` + text "Pharmacy Books" / "Account & Billing" from `brand.ts` | 32×32 |
| Portal (unreachable) | `references/EmailPreview.tsx:62` | `logo-color.svg` | |

Brand text in source **[V]**:

- OwedBook still says "Cyber Pharma" in 10 places: page title metadata (`layout.tsx`, `access-denied/page.tsx`), three header `aria-label`s and three image `alt`s, and two sentences of visible copy (landing page, access-denied). It has no single brand constant.
- Portal has a single brand constant, `src/components/portal/brand.ts`: name "Pharmacy Books", subline "Account & Billing", footer "Pharmacy Books · a Cyber Pharma product", `owedBook: "OwedBook"`. "Cyber Pharma" remains in the page title metadata ("Cyber Pharma — Subscription Portal"), the footer line, and the billing-notice emails (section 6).
- "OwedBook" is spelled as one word everywhere in both apps (160 and 38 occurrences). "Owed Book" does not occur.

### 5.2 The supplied preferred logo **[V]**

Fetched once from the public address in the design file to the session scratch folder, for inspection only. Not placed in either repository.

- PNG, 1024 × 543, RGBA with real transparency, 321,101 bytes.
- SHA-256 `e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd`.
- The artwork occupies 729 × 474 px inside the canvas (transparent margin on all sides). Aspect about 1.54 : 1.
- Most frequent opaque pixels: `#104982` navy, `#F5443E` red, `#32A28D`/`#32A38D` green. This matches the register's note that the token navy `#154474` is taken from the design tokens, not from a dominant-pixel reading.

### 5.3 Asset-package plan **[P]**

Rule: the artwork is never redrawn, recoloured or re-traced. Only whole-image scaling, transparent padding and container format change.

| Asset | How it is made | Used by |
|---|---|---|
| `public/brand/pharmacy-books-logo-primary.png` (master) | the supplied file, byte for byte, hash recorded in the pack | everything below |
| Header logo | the master rendered with `next/image` inside a white, 12px-radius tile built in CSS (the tile is page styling, not part of the image) | OwedBook `Navbar`, `NavbarHome`, `NavbarLoginReg`; Portal `Brand.tsx` |
| Wordmark | live text "Pharmacy Books" beside the tile, with the product name as a second line, as the Portal's `Brand.tsx` already does | both apps |
| `src/app/icon.png` 512×512 | master scaled to fit a square white canvas with even padding | browser tab, both apps |
| `src/app/apple-icon.png` 180×180 | same method | iOS home screen |
| `src/app/favicon.ico` 16/32/48 | same method | legacy browsers; adds the file OwedBook lacks |
| Email logo | master scaled to about 2× display size, served from a public HTTPS address | Supabase template, optional HTML notices |
| Stripe logo and icon | master (logo) and the square icon above, uploaded by the Director | Stripe branding screen |

Points that need a decision or a check:

- **[P] Trimming the transparent margin** before scaling makes the mark larger in a tile or icon. It does not touch the artwork, but it is a change to the supplied file, so it should be approved explicitly or avoided.
- **[P] Small-size legibility.** The mark is wide (1.54 : 1) with fine detail. At 16 px in a browser tab it will be hard to read. The honest options are: accept it for this release, or ask Frank for a square favicon (already open item D2 in the design file). A crop to "Rx" only, or to the books only, would alter the artwork and is not proposed.
- **[P] One brand constant for OwedBook.** OwedBook should get the same single-source brand file the Portal has, so the name is changed in one place.
- **[V] Public reachability.** Both apps' `src/proxy.ts` matcher excludes `.svg/.png/.jpg/.jpeg/.gif/.webp` paths, so a logo under `public/` is served without sign-in. A hosted email logo can therefore live on the alpha domain. **[U]** Not requested live in this task.
- **[P] Leftovers to list for a removal decision:** `logo-color.svg`, `logo-lockup.svg`, `logo-mono.svg` in both repos, `public/next.svg`, `public/vercel.svg`, `public/favicon-512.png`. Do not delete without the Director's word.
- **[P] `public/landing/owedbook-mockup.png`** shows the coral interface. If the landing page stays in scope it needs a new screenshot after the rebrand.
- **[U] Stripe's file rules** (accepted formats, minimum size, square requirement for the icon) are shown on Stripe's branding screen and were not read. The supplied file's size (321 KB) is unlikely to be a problem.

---

## 6. Email templates, hosting, and link logic to preserve (task item 5)

### 6.1 Every way the two apps send mail **[V]**

Searched all non-test source in both repos for mail-sending calls. Result: four paths, two senders.

| # | Mail | Triggered from | Sender | Template lives in |
|---|---|---|---|---|
| 1 | Sign-in link, OwedBook | `src/server/emailLink.ts` `requestSignInLink` → `signInWithOtp` | Supabase Auth, custom SMTP | Supabase dashboard, DEV project, **Magic Link** template |
| 2 | Sign-in link, Portal | `src/server/emailLink.ts` `requestSignInLink` → `signInWithOtp` | same | same template |
| 3 | Access email after purchase, Portal | `src/server/provisioning.ts` `ensureAccessNotification` → `src/server/accessEmail.ts` `sendSignInLink` → `signInWithOtp` | same | same template |
| 4 | Store invitation, OwedBook | `src/server/invitationMail.ts` `dispatchInvitation` → `signInWithOtp` | same | same template |
| 5 | Billing notices, Portal (payment failed; read-only warning) | `src/server/billingNotices.ts` | Resend HTTPS API | **in code**, plain text |
| 6 | Receipts, invoices and other Stripe mail | Stripe, if enabled | Stripe | Stripe dashboard |

Consequences:

- **One Supabase template serves four different purposes** (ordinary sign-in in two apps, first access after payment, and invitations). Its wording must stay generic. A design with purpose-specific copy would need different sending code, which is outside "presentation only".
- No source file calls `inviteUserByEmail`, `resetPasswordForEmail` or any sign-up mail. The other Supabase templates (invite, recovery, confirm sign-up, email change) are not used by the product. The records say they are "unchanged and untested". `generateLink` is used only for the app-to-app handoff and for tests; it sends no mail.
- `src/components/portal/references/EmailPreview.tsx` is an unreachable demo component from the earlier design phase. It is not a mail template.
- No email HTML, MJML or template file is tracked in either repository. `supabase/` in OwedBook holds migrations and `setup.sql` only; no `config.toml`, no `templates/`.

### 6.2 The Supabase Magic Link template

What the records establish (Director-reported in the 007A and 007B evidence; not read from the dashboard by Engineering):

- **Project:** DEV, project ref `yrsuwikjnbmvpznrgydb`, shared by localhost and both alpha apps.
- **SMTP:** Resend (`smtp.resend.com`, port 465), sender `no-reply@cyberizedev.com`, sender name "Cyber Pharma".
- **Subject:** "Your Cyber Pharma sign-in link".
- **Body:** a Director-saved revision with explicit branches for the exact confirm addresses, a link that carries `token_hash` and `type=email`, and a no-link message for any other destination. The Engineering proposal it was based on is in `agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/EVIDENCE/E1/a01/AUTH_EMAIL_TEMPLATE_PROPOSAL.md` (OwedBook): heading "Sign in to Cyber Pharma", one paragraph, one link, one ignore-this line.
- **A second project, SCRATCH,** has its own copy for the proof ports 3100 and 3101.

**[U] The live template body is not in either repository,** and whether it already has branches for the two alpha addresses is not recorded as done: the Portal's `DEPLOYMENT_CHECKLIST.md` Stage C line "Supabase Auth (DEV): redirect allow-list … Site URL; email templates — Director, one session" is unchecked, and OwedBook's Stage B allow-list line is unchecked. The Supabase CLI link in OwedBook (`supabase/.temp/linked-project.json`) points at a different project, so no read of the DEV template was possible with existing access.

**Remaining inspection (Director, Supabase dashboard, DEV project, read-only):** copy out, without changing anything, (a) the full Magic Link template body and subject, (b) Authentication → URL configuration: Site URL and the redirect allow-list, (c) SMTP sender name and address, (d) whether the other templates are still the provider defaults. Do the same for SCRATCH if it will be restyled.

### 6.3 Link and routing logic that presentation edits must not touch **[V]**

From `emailLink.ts` (identical design in both apps), `invitationMail.ts`, `accessEmail.ts` and the recorded findings:

1. **The link must be built from `{{ .RedirectTo }}` plus `?token_hash={{ .TokenHash }}&type=email`.** Not `{{ .ConfirmationURL }}`. The provider's default link is redeemed at the provider and returns the session in a URL fragment that the apps' server route cannot read; the click then burns the token and lands on "link expired" (`LINK_FORMAT_FINDING.md`, 17 November).
2. **Keep every conditional branch exactly.** The branches select the app by the exact confirm address and show a no-link message otherwise. They are also the guard that stops a token being sent to an unlisted address.
3. **The apps request the exact allow-listed address with nothing appended:** `${ownOrigin()}/api/auth/confirm`. A query string on the redirect would produce two `?` in the link. A unit test pins this in OwedBook.
4. **`type=email` and the parameter names `token_hash` and `type` are read by the route.** `confirmEntry` accepts only `email` or `magiclink` and a token matching a fixed pattern; anything else goes to `/auth/link-expired`.
5. **Keep `&amp;` in the HTML attribute.** An HTML editor that "fixes" it, or re-encodes the braces, breaks the link.
6. **GET never signs anyone in.** The link opens a page with a button; only the button's POST verifies the token (protection against mail scanners). An email design must not promise "one click and you are in", and must not add a second link that points anywhere else.
7. **No link rewriting.** Click tracking or link wrapping at the mail provider would replace the address the template builds. **[U]** Whether Resend click tracking is off for this domain was not checked; it should be confirmed before and after any template edit.
8. **Invitations rely on the destination logic in code, not in the mail.** After sign-in, `confirmSubmit` sends a person with pending invitations to `/invitations`. The mail must not carry its own "accept" link.
9. **Token lifetime (3600 s) and the rate limits are settings, not template content.** Leave them.
10. **Shared project.** One edit changes the mail for localhost and both alpha apps at once. The register's condition stands: after any edit, one real sign-in and one real invitation on alpha and on local.

Presentation that can change safely **[P]**: subject wording, sender display name, heading and paragraph text, a hosted logo image, colours and button styling of the existing link, footer text. All inside the existing branches.

### 6.4 Portal billing notices **[V]**

- File: `src/server/billingNotices.ts`. Two kinds: `renewal_payment_failed`, `renewal_read_only_warning`.
- **Plain text only.** The request body sent to Resend has `from`, `to`, `subject`, `text`. There is no HTML part, so there is nothing to carry a logo or a colour today.
- Brand wording in code: default sender `Cyber Pharma <no-reply@cyberizedev.com>` (overridable by the `BILLING_EMAIL_FROM` setting), subjects "Payment failed for your Cyber Pharma subscription" and "Your Cyber Pharma account becomes read-only in 48 hours", and the closing line "…you own this Cyber Pharma account."
- The only link is `${ownOrigin()}/billing`. Keep it.
- **Idempotency and fingerprint:** each notice is sent with the key `<kind>/<invoice id>` and its SHA-256 of subject plus text is stored with the outcome. Changing the wording changes the fingerprint.

Decisions and risks **[P]**:

- **Scope decision:** rename only (text stays plain), or add an HTML part with logo and colours. The second is new mail-building code and new tests, beyond "update the existing templates' presentation". Engineering recommends rename only for this module.
- **Deployment timing risk:** a notice that is mid-retry when the wording changes would be re-sent under the same key with a different body. **[U]** How Resend answers a reused key with a changed body was not verified. Mitigation: deploy when the notices table shows nothing claimed or retrying, and say so in the pack.
- **[U]** Whether any notice has ever been delivered on alpha is not evidenced; the Portal checklist lists "Billing notice received (Resend)" as pending and the scheduler is not enabled.

### 6.5 Stripe-sent mail

**[U]** Which customer emails Stripe sends for this sandbox (receipts, invoice mail, failed-payment mail) is a dashboard setting and was not read. Their look follows the same account branding as section 7.

---

## 7. Stripe integration and branding (task item 6)

### 7.1 Integration as built **[V]** (Portal only; OwedBook has no Stripe code)

| Item | Finding |
|---|---|
| Library / API version | `stripe ^22.1.0`; `STRIPE_API_VERSION = '2026-04-22.dahlia'` (`src/server/stripeClient.ts`) |
| Checkout | Stripe-hosted Checkout, `mode: 'subscription'`, one line item on the configured price, `adaptive_pricing` disabled (USD only), optional promotion code, success → `/register/activation`, cancel → `/register/review` (`src/server/checkout.ts`) |
| Billing portal | Stripe-hosted customer portal; every session names an explicit configuration (`bpc_…`); a start-up check requires it to be active, test-mode and restrictive (`src/server/billing.ts`) |
| Add-store payments | server-side invoice and subscription quantity changes (`src/server/storeOperations.ts`); no extra Stripe-hosted page except card authentication when Stripe requires it |
| Webhooks | `/api/webhooks/stripe`, signature verified |
| Pricing in code | `FIRST_STORE_CENTS = 9900`, `ADDITIONAL_STORE_CENTS = 4900` (`src/server/pricing.ts`, `storePricing.ts`); `storeOperations.ts` checks the Stripe price tiers against 9900. On screen: `PlanView.tsx` "$99.00 / month … each additional …" |
| **Branding overrides in code** | **None.** No `branding`, `custom_text`, `ui_mode`, `appearance`, `locale` or logo parameter is sent on any Checkout or portal call. The hosted pages look exactly as the Stripe account is configured |
| Embedded or custom payment UI | none |

The $99 first pharmacy and $49 additional pharmacy contract is enforced in server code and checked against Stripe. Nothing in a visual rebrand needs to touch it.

### 7.2 Sandbox branding, read-only **[V]**

Existing access permitted this: the Stripe CLI on this machine is signed in to the sandbox named "Cyber Pharma" (account ending `…Dyu3RR`, the same ending as the alpha webhook endpoint in the Portal's checklist). Three GET requests were made: account, billing-portal configurations, products. No write, no listener, no key printed.

| Setting | Value today |
|---|---|
| Branding logo | **not set** |
| Branding icon | **not set** |
| Branding primary colour | **not set** |
| Branding secondary colour | **not set** |
| Business (public) name | "Cyber Pharma" |
| Dashboard display name | "Cyber Pharma" |
| Statement descriptor | "CYBER PHARMA" |
| Business website / support URL | Stripe sandbox placeholders (`accessible.stripe.com`) |
| Support email | set (value not recorded here) |
| Portal configuration A (active, not default) | headline "Cyber Pharma — OwedBook billing"; no privacy or terms URL |
| Portal configuration B (active, **account default**) | headline "E1_ONLY probe portal"; no privacy or terms URL |
| Active product | "OwedBook — pharmacy stores"; no description, no image |
| Inactive products | three "E1_ONLY …" probe products |

- **[U]** Which portal configuration the alpha app uses is held in a secret (`STRIPE_PORTAL_CONFIGURATION`) and was not read. Configuration A is the only one with a customer-facing headline; this should be confirmed by the Director.
- The customer therefore sees Stripe's default look and the name "Cyber Pharma" on Checkout, on the billing portal and on any Stripe mail.

### 7.3 Remaining configuration inspection **[U]** (Director, Stripe dashboard, sandbox "Cyber Pharma", read-only)

The API exposes only logo, icon and two colours. The rest is visible only in the dashboard:

1. **Settings → Branding:** the font list (is Inter offered), the shape options (rounded, sharp, pill), the background colour control, and the accepted file types and sizes for logo and icon.
2. **The four previews on that screen:** Checkout, customer portal, invoice, receipt. A screenshot of each before any change is the baseline.
3. **Settings → Customer emails:** which emails Stripe sends in this sandbox.
4. **Settings → Public details / Business:** public business name, support address and links as customers see them.
5. **Billing → Customer portal:** which configuration the alpha uses, its headline and its links.
6. **Invoice template settings:** footer, memo, default text.

### 7.4 Points for the ABM **[P]**

- **Names are separate from branding.** The register's C-10 covers logo, colours, font and shape. The business name, statement descriptor, portal headline and product name still say "Cyber Pharma" and are customer-visible. Changing them is a naming decision tied to C-08, and the statement descriptor affects what appears on a card statement. Recommend the pack either lists them as in scope with the exact new strings, or records them as a production-readiness item.
- **Values Engineering can prepare for the Director to apply:** logo file, square icon file, brand colour `#288472` for buttons, a background or accent colour (`#154474` or white, to be decided on the preview), font (Inter if offered), shape (rounded).
- **Contrast on Stripe pages** follows Stripe's own rendering; the button colour `#288472` with white text is 4.53 : 1, which is the same narrow margin the register notes.
- **Sandbox only.** The same steps must be repeated on the live account at production cutover (register 5A, item 2).
- **Verification without new payments:** the branding previews, plus opening the billing portal for an existing rehearsal customer, show the result. No new sandbox purchase is needed (register section 8).
- **[U]** Newer Stripe API versions may allow per-session branding on Checkout. This was not verified and is not proposed: the approved direction is dashboard controls, and a per-session override would not cover the portal, invoices or mail.

---

## 8. Automated tests and reusable regression coverage (task item 7)

### 8.1 Baseline run in this session **[V]**

| Suite | Result | Notes |
|---|---|---|
| OwedBook Jest | **54 suites, 374 tests, all passed**, 15.3 s | no snapshots |
| Portal Jest | **32 suites, 572 tests, all passed**, 13.6 s | no snapshots |

Both working trees were unchanged by the runs. **Not run:** typecheck, lint, production builds (a build writes `.next`), Playwright, integration tests (`*.itest.ts`, which need database settings).

### 8.2 What exists **[V]**

| Kind | OwedBook | Portal |
|---|---|---|
| Unit/component tests | 55 files under `src/__tests__` (jsdom per file) | 33 files under `src/__tests__` |
| Integration tests | none | 3 `*.itest.ts` (SCRATCH or local database only) |
| Browser specs | 1: `e2e/apbm007b.staff.spec.ts` (42 lines) | 19 specs + helpers `gate-m.ts`, `contrast.ts`, `auth.ts`, `helpers.ts` |
| Playwright projects | Chrome, Firefox, WebKit against port 3100 | Chrome, Firefox, WebKit against port 3001 |
| Visual snapshot or screenshot comparison | **none** | **none** (screenshots are saved as evidence, never compared) |
| Accessibility engine (axe) | none | none; custom contrast and target-size probes instead |

### 8.3 Reusable for ABM007_FINAL **[V]**

- **Behaviour regression:** the 946 unit tests cover access rules, roles, forms, sign-in, handoff, registration, add-store, mail guard and notices. They assert roles, labels, test ids and text, with few style assertions, so a token and class restyle should leave almost all of them untouched. This is the main "branding broke nothing" net.
- **Portal `e2e/contrast.ts`:** a rendered-contrast probe (text against composited backgrounds, 4.5 : 1 and 3 : 1 rules, input boundaries, focus rings, disabled and faded handling). Directly reusable to measure the new palette in context, as the register's QA section asks.
- **Portal `e2e/gate-m.ts`:** no horizontal overflow and 44 px minimum target height at six widths (375 to 1440). Reusable for the narrow-screen check and for the design's 10px/16px button padding.
- **Pinned link rule:** OwedBook has a boundary test that both mail modules request the exact confirm address. Keep it green through any email work.

### 8.4 Tests coupled to presentation, which will need edits **[V]**

- OwedBook: `owedbook/StatusChip.test.tsx` (expects `text-success`, `text-destructive`, `text-info`), `AdminSidebar.test.tsx` (active item has `bg-primary`; focus ring class), `AuthedShell.test.tsx` (layout classes), three `Navbar.*` tests and `final-batch-audit-identity.test.tsx` (theme toggle present).
- OwedBook also: `auth/PasswordToggle.test.tsx` (expects `bg-muted` and padding classes on the field).
- Portal: `portal-shell.test.tsx` (theme toggle), `portal-storage.test.ts` (theme key; covers an unreachable module).
- Tests that assert the old name "Cyber Pharma", a logo path or the Saira font: none in either repository (unit or browser).

### 8.5 Gaps **[V]**

- **16 of the Portal's 19 browser specs navigate to `/demo/...` routes that no longer exist** (removed 13 November, commit `9018e8c`). They cannot serve as regression for today's screens until re-pointed or retired. They also loop over light and dark.
- The three live Portal specs and the one OwedBook spec need a private fixture file (`APBM007B_PROOF_CAST`) and running app servers on the proof ports. Not run here.
- There is no automated visual comparison in either repository. Visual acceptance in ABM007_FINAL will be screenshots plus measured contrast plus human sign-off, unless the pack adds a comparison step.

---

## 9. Open manual-QA items, Help page, affected paths, risks, effort (task items 8 and 9)

### 9.1 Unresolved manual-QA state **[V]** (from the Portal's `agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/MANUAL_QA/` records)

- **Repairs R1 to R10 (19 November) and final batch F1 to F6 (20 November) are implemented and merged.** The ledger still marks every row "PENDING Tony/JARVIS retest". The campaign is recorded as not certified.
- **Observed passes recorded 20 November:** invitation and acceptance, member store scoping, member removal, audit entries, people filtering, refusal of a Store admin's add-store attempt with the owner still at three stores.
- **Still pending, not evidenced:** audit "Load older" paging; 3-D Secure, declined card and reload/recovery paths; scheduler-driven expiry and final removal (scheduler not enabled); buyer/transfer scenarios; populated claims-data isolation; full password change and sign-in; deployed sign-in, handoff, mail and webhook checks; retest of F1 to F5.
- **Alpha deployment state from the records:** both alpha apps deployed and answering over HTTPS; signed Stripe webhook delivery returned 200; Supabase redirect allow-list and templates, sign-in on alpha, and all two-app flows are unchecked.
- **Open inputs carried in the records:** Terms URL and Privacy URL (the Portal footer prints "(link not yet published)" when unset), support mailbox operation, zod advisory (OwedBook KIP-3, Portal KIP-1; required before production, not triggered by a visual change).

Relevance to ABM007_FINAL **[P]**:

- A rebrand changes every screen that the pending retests would exercise. Either the retests run first on the current look, or the pack states that they run once, on the new look, and names who binds the result. Running them twice is the cost of not deciding.
- Several R and F repairs were visual-state work (spinners and busy text, confirmation dialogs, navbar name and role badge, audit wording). These are exactly the states C-12 says must survive. They have unit tests; they are the first things to re-check by eye.
- Sign-in on alpha is not yet verified. Email restyling cannot be accepted on alpha until that baseline exists.

### 9.2 Help page **[V]**

- No `/help` route, no Help component, no Help link in any navbar, sidebar or menu, and no Help draft in `agent_docs` in either repository. The only matches for "help" are form-field helper text in the Portal and "How it works" anchors on the OwedBook landing page (which point at sections that the landing page does not contain).
- The design's "numbered steps" pattern (step badge + title) has no existing component.
- **[P]** Help is therefore new work with three unknowns the ABM must settle: which app hosts it (or both), who writes the content, and whether it is in ABM007_FINAL at all. It is not a restyle.

### 9.3 Conflicts and gaps found in the code that are not in register v0.3 **[V for the facts, P for the suggested handling]**

| # | Finding | Suggested handling |
|---|---|---|
| N-1 | **Portal buttons are uppercase, semibold, 14px** (`src/components/ui/button.tsx` base class). The design says buttons are Title Case, Regular, 16px, and uppercase is for eyebrow and small group labels only. Uppercase is also used on Portal pills, role badges, the brand wordmark and page eyebrows (45 uses). OwedBook: 40 uses, mostly labels and pills | Decide in the brand/UI contract which uppercase uses survive. Buttons are the visible one |
| N-2 | **Portal link ruling.** `.portal-link` keeps links in body-text colour with a permanent underline; the stylesheet cites ruling R-004. The design says every link is dark green. 17 uses | The register's C-05 (green links on white only) needs a line that supersedes or keeps R-004 |
| N-3 | **OwedBook status colours fail text contrast today.** Computed from the token values: success `#2F9D43` 3.49 : 1 on white, info `#2E7BE0` 4.18 : 1, warning `#E7A108` 2.21 : 1; all are used as coloured text on a 10–15% tint of themselves. The Portal already darkened its own. The register's section 3 says "existing error and status colours kept" | Keep the Portal's darker set as the shared semantic set, subject to the style tile. Rendered measurement still needed |
| N-4 | **Brand green versus success green.** Portal success `#288639` and brand `#288472` have a contrast of 1.02 : 1 against each other, and warning and info are equally close in lightness. They differ in hue only | Confirms C-06. The style tile must show the primary button beside the success pill and notice. Pills that use body-colour text with a status border (the Portal recipe) rely less on hue |
| N-5 | **`--accent` means different things.** OwedBook hover surfaces are coral with white text; the design's "accent" is the brand green fill | Map the app token `--accent` to a pale neutral or ice-blue hover surface with dark text in both apps. Do not map it to the design's accent |
| N-6 | **OwedBook KPI tiles** are four solid colour blocks with white text (`--chart-1..4`: red, blue, green, maroon) and `--chart-5` is coral. The design has no data-colour guidance and bars brand green and logo red as status colours | Add the tiles to the style tile. Decide whether they stay as data colours or become white cards with navy figures |
| N-7 | **Portal defaults to dark.** The register's C-02 treats the toggle as something that may exist | Light-only is a behaviour change for every Portal visitor. Section 3.2 |
| N-8 | **Page surface.** Both apps sit on a grey page (`--background`) with white cards. The design says content sits on white, with navy only for the backdrop and masthead; ice blue is for hairlines and alternating marketing bands. Dark green links fail on ice blue (4.04 : 1) | Contract must fix the dashboard page surface: white with hairline-and-shadow cards, or ice blue with links kept on white cards |
| N-9 | **Focus ring on navy.** The design suggests a navy focus outline. On the navy header, backdrop and masthead that is invisible. OwedBook's header controls sit on the header colour | Two ring colours: navy on light surfaces, white or ice blue on navy. The register's C-04 already says "contrasting treatment"; this names where |
| N-10 | **OwedBook landing page `/`** is a marketing page in the app, with nav links to `#features`, `#how-it-works`, `#pricing` that have no targets, a coral-era screenshot, and "Cyber Pharma" copy. The register's C-07 fences marketing registration off but does not place this page | Decide: restyle minimally, replace with a redirect to sign-in, or leave. Smallest safe option is tokens plus name plus logo only |
| N-11 | **Stripe names and notice sender names** still say "Cyber Pharma" (sections 6.4 and 7.2) | Tie to C-08 |
| N-12 | **"a Cyber Pharma product"** in the Portal footer, and page titles "Cyber Pharma" / "Cyber Pharma — Subscription Portal" | Tie to C-08: is Cyber Pharma shown to customers at all |
| N-13 | **Radius scale mismatch** (section 2.6) and **no shadow tokens** (section 2.7) | Contract defines the mapped scale once: suggested `md` 8px (buttons, fields, menus), `lg` 14px (cards, dialogs), `xl` 16px (shell, masthead), tile 12px |

### 9.4 Proposed affected paths **[P]** (existence of each path is **[V]**)

**OwedBook application**

- Foundation: `src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx` (font, metadata, theme provider).
- Shells and navigation: `src/components/global/Navbar.tsx`, `NavbarHome.tsx`, `NavbarLoginReg.tsx`, `MobileNav.tsx`, `UserMenu.tsx`, `ThemeToggler.tsx` (removal from mounts), `src/components/layout/AuthedShell.tsx`, `AdminSidebar.tsx`, `src/app/(auth)/layout.tsx`.
- Primitives: `src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`, `password-input.tsx`, `badge.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `tabs.tsx`, `toast.tsx`, `command.tsx`.
- Screens: `src/components/owedbook/*` (11 files, notably `KpiTiles`, `StatusChip`, `FilterRail`, `AccessBanner`, `OwedBookScreen`), `src/components/admin-portal/*` (styled subset of 25), `src/components/auth/*`, `src/components/invitations/InvitationsScreen.tsx`, `src/components/common/*`, `src/app/profile/ProfileForm.tsx`, `src/app/(public)/HomePageContent.tsx`, `access-denied/page.tsx`, the three `error.tsx`, `not-found.tsx`.
- New: a brand constant file; logo and icon files under `public/brand/` and `src/app/`; Help page if in scope; style tile.
- Tests: the OwedBook files in section 8.4, plus a forced-light test.
- Not touched: `src/server/*`, `src/app/api/*`, `src/utils/supabase/*`, `src/proxy.ts`, `src/lib/appIdentity.ts`, `supabase/migrations/*`, `scripts/*`, deploy files (except a redeploy).

**Portal application**

- Foundation: `src/app/globals.scss`, `tailwind.config.ts`, `src/app/layout.tsx`.
- Shells and brand: `src/components/portal/Shell.tsx`, `PublicShell.tsx`, `Brand.tsx`, `brand.ts`, `Footer.tsx`, `PageHeader.tsx`, `src/components/global/ThemeToggler.tsx` (removal from mounts).
- Primitives: `src/components/ui/button.tsx`, `input.tsx`, `table.tsx`, `sheet.tsx`, `alert-dialog.tsx`, `dropdown-menu.tsx`, `toast.tsx`, `skeleton.tsx`; `src/components/portal/Pill.tsx`, `Alert.tsx`, `FormField.tsx`, `RadioCard.tsx`, `Stepper.tsx`, `DataTable.tsx`, `EmptyState.tsx`, `ErrorSummary.tsx`, `Loading.tsx`, `src/components/common/SpinnerLarge.tsx`.
- Screens: `src/components/portal/register/*` (5 views), `activation/*` (3), `account/DashboardView.tsx`, `AddStoreFlow.tsx`, `StoreRemovalControl.tsx`, `OwnerOnlyNotice.tsx`, `status.tsx`, `PharmacyFields.tsx`, `src/app/login/LoginPageContent.tsx`, `src/components/auth/*`, `src/app/not-found.tsx`.
- Mail text only: `src/server/billingNotices.ts` (names), with its tests.
- New: logo and icon files; style tile; a forced-light test.
- Not touched: all other `src/server/*` (checkout, billing, provisioning, webhook, pricing, store operations), `src/app/api/*`, `src/lib/appIdentity.ts`, pricing constants, `scripts/*`, migrations (there are none in this repo), the 30 unreachable files (they inherit tokens; no manual restyle).

**Visual references:** the brand/UI contract, the style tile and the four sample screens. New module documents, not existing paths.

**Outside the repositories (Director actions with Engineering-prepared values):** Supabase DEV Magic Link template, subject and sender name; Stripe sandbox branding screen and, if decided, names and portal headline.

### 9.5 Dependencies **[V unless marked]**

- **No new package is required.** Inter comes through `next/font/google`, already in use for Saira. `next-themes` stays (forced) or is removed.
- **Build-time network:** `next/font/google` downloads the font during the build. This already happens for Saira in the Cloud Build pipeline for both alpha services.
- **Redeploy of both alpha services** is needed to show the result (`./deploy.sh` in each repo, from a clean committed tree; each is a Director-approved action). Text that comes from `NEXT_PUBLIC_*` values is compiled at build.
- **Sequence dependency [P]:** contract and style tile → Coach/Frank approval of samples → rollout. Logo files before header work. Supabase template export before any email design. Stripe dashboard inspection before values are prepared.
- **External inputs:** the three Coach/Frank confirmations in the register; Terms and Privacy URLs; optional logo package and favicon.
- **Two remotes, two accounts:** the module produces two branches in two different GitHub accounts. Review and merge steps differ per repo (OwedBook `main` is PR-only per its records).

### 9.6 Risks **[P]**

| # | Risk | Area | Mitigation |
|---|---|---|---|
| K-1 | A template edit breaks sign-in for localhost and both alpha apps at once | Emails | Export first; edit inside the existing branches only; real sign-in and invitation on alpha and local straight after; keep the old body to paste back |
| K-2 | Buttons at 4.53 : 1 leave no margin; hover, disabled or a tinted surface drops below 4.5 | Apps, Stripe | Hover darker than `#288472` (for example `#247767` gives 5.37 : 1 with white); measure in context with the Portal's contrast probe |
| K-3 | Brand green is confused with success green | Apps | Style tile; pills with text labels and borders; do not rely on hue |
| K-4 | Portal users who know the dark look see a different product | Portal | Announce with the release; it is the approved direction |
| K-5 | The rounded and shadow work in the Portal is larger than a "token swap" suggests (40 containers, no Card primitive) | Portal | Introduce one panel/card class or component first, then apply; estimate reflects this |
| K-6 | Usable table width is lost if the 1100 px shell is applied to dashboards | Apps | Already ruled in C-03: no shell on dashboards. OwedBook's dashboard is full width today; the Portal's account area is `max-w-6xl` (1152 px) and can stay |
| K-7 | Rebrand lands on top of unretested repairs; a later failure cannot be attributed | QA | Decide retest order in the pack (section 9.1) |
| K-8 | Stale Portal browser specs give false comfort or are "fixed" by habit during the module | Tests | State in the pack that the 16 `/demo` specs are out of the regression set unless re-pointed |
| K-9 | Wide logo is illegible as a 16 px tab icon | Assets | Accept for alpha or request a square favicon |
| K-10 | Notice wording change collides with an in-flight retry | Emails | Deploy when no notice is claimed or retrying |
| K-11 | The two apps drift further if each is restyled separately | Apps | One shared token table in the contract, applied to both stylesheets in the same step; add a small test in each repo that pins the brand values |
| K-12 | Old "Cyber Pharma" strings survive in titles, alt text, mail subjects or Stripe | Naming | One grep-based check in each repo as an acceptance item, plus the Stripe and Supabase checklists |
| K-13 | Stripe font or shape options do not match Inter or the 8 px radius | Stripe | Record the nearest offered option as a known difference (register 5A, item 4) |

### 9.7 Effort estimate **[P]**

Unit: engineering working days for one engineer working with the agent, including unit tests and self-checks. Excludes waiting for approvals, Director dashboard time, and independent QA. Ranges reflect the open decisions named in each row.

| Area | Work | Days |
|---|---|---|
| **Visual references** | Brand/UI contract inputs, shared token table, style tile, four sample screens in both apps' real components, one revision round | 2.0 – 2.5 |
| **OwedBook app** | Tokens, Inter, radius and shadow scale, forced light and toggle removal, navy header, sidebar, auth pages in the literal layout, KPI tiles, pills, cards, dialogs, landing page (minimal), names, tests | 2.0 – 3.0 |
| **Portal app** | Same foundation; panel/card treatment across about 40 containers; button and link recipe changes; registration, sign-in and Add Pharmacy in the literal layout; dashboard and billing translated; names; tests | 2.5 – 3.5 |
| **Logo assets** | Master file, derived icons for both apps, header tile, brand constant in OwedBook, leftovers list | 0.5 |
| **Emails** | Template export review, restyled Magic Link body and subject prepared for the Director, notice renames, verification on alpha and local | 0.5 – 1.0 |
| **Stripe** | Values and files prepared, Director applies, previews and existing-customer portal check recorded, production-readiness note | 0.5 |
| **Verification and release** | Contrast and target-size measurements on the new palette, narrow-screen pass, old-name sweep, two redeploys, evidence | 1.0 – 1.5 |
| **Total** | | **9.0 – 12.5** |

Not included, each a separate decision:

- **Help page:** 0.5 – 1 day for the page shell and step pattern if content is supplied; content writing is not Engineering's.
- **HTML billing notices** with logo and colours: about 1 day plus tests.
- **Re-pointing the 16 stale Portal browser specs:** 1.5 – 2 days; retiring them: 0.25 day.
- **Aligning the two apps onto one shared stylesheet or package:** not estimated; recommend against in this module.
- **Dark theme for the new brand:** deferred by ruling.

Assumptions behind the numbers: the three Coach/Frank confirmations arrive before rollout; one revision round on samples; no change to layouts' information structure; pricing, routes, guards and server code untouched; alpha sign-in is working before email verification starts.

---

## 10. Register facts R-1 to R-9: answers

| ID | Question | Answer |
|---|---|---|
| R-1 | Hardcoded colours, numbered colours, inline colour styles | **[V]** OwedBook: 0 hex, 2 numbered, 6 white/black, 0 inline. Portal: 0 hex, 3 numbered, 4 white/black, 1 inline (width only). Section 2.4 |
| R-2 | Dark theme and toggle wired | **[V]** Yes in both. Portal defaults to dark. Section 3.1 |
| R-3 | Font loading | **[V]** Saira via `next/font/google` in both root layouts. Section 2.5 |
| R-4 | Shared or drifted theme values | **[V]** Drifted. Section 2.8 |
| R-5 | Where radius and shadow are defined; one knob | **[V]** Radius: one variable, but it reaches only elements with a radius class. Shadow: no token. Not one knob. Sections 2.6, 2.7 |
| R-6 | What each token drives | **[V]** Sections 2.2, 2.3 |
| R-7 | Screens with individual overrides | **[V]** None at page level. Section 2.4 |
| R-8 | Which emails exist, where templates live, which carry link logic | **[V]** Section 6. **[U]** live Supabase template body and Stripe email settings |
| R-9 | What the Stripe sandbox branding screen offers | **[V]** Current values via API: nothing set. **[U]** font list, shapes, previews: dashboard only. Sections 7.2, 7.3 |

---

## 11. Aggregated gaps (everything not verified, in one place)

| # | Gap | Who can close it | How |
|---|---|---|---|
| G-1 | Live Supabase DEV Magic Link template body, subject, sender name; redirect allow-list; Site URL; state of other templates | Director | Supabase dashboard, read and copy out |
| G-2 | Whether the template already has branches for the two alpha addresses; whether sign-in works on alpha | Director | Same session as G-1, plus one sign-in per alpha app |
| G-3 | Resend click-tracking setting for the sending domain | Director | Resend dashboard |
| G-4 | Stripe branding screen: fonts, shapes, background control, file rules, four previews | Director | Stripe dashboard, sandbox |
| G-5 | Which Stripe customer emails are enabled | Director | Stripe dashboard |
| G-6 | Which billing-portal configuration the alpha uses | Director | Compare the stored identifier with the two configurations |
| G-7 | Rendered contrast of the current and the new palette (figures here are computed from token values) | Engineering, in the module | Portal contrast probe on running apps |
| G-8 | How sample screen 4 (Portal dashboard) is captured without touching rehearsal data | ABM author with Engineering | Decide: signed-in read-only session on DEV, or a fixture harness |
| G-9 | Typecheck, lint, production build and browser specs at the baseline | Engineering, at module start | Run in isolated copies as in earlier modules |
| G-10 | Whether any billing notice is mid-retry on DEV | Engineering with Director release | One read-only query at deployment time |
| G-11 | Live alpha services and domains today | Not re-checked in this task | Read-only requests, if wanted |
| G-12 | The Architect handoff, doctrine journal v0.3, recipe Rework Record and design-system docs `05_DESIGN_SYSTEM/*` named in the register | Not in either repository or in the Downloads folder outside `_ARCHIVE` (which was not opened, by instruction) | Supply if Engineering should read them |
| G-13 | Coach's Drive copy of the design versus the uploaded file | QA Lead / Director | As the register already notes |

---

## 12. What was and was not done in this task

**Done, all read-only:** file reads and searches in both repositories; `git` inspection commands (`status`, `log`, `rev-parse`, `branch -vv`, `worktree list`, `remote -v`, `config --get`, `ls-files`, `stash list`); two Jest runs; one static import analysis; three Stripe GET requests through the existing CLI sign-in; one download of the public logo file to the session scratch folder.

**Not done:** no git mutation, no fetch, no product or test edit, no dependency install, no build, no deployment, no app server or Stripe listener started, no Supabase or Stripe setting changed, no purchase, no invitation, no mail sent, no database read or write, no environment or secret file opened or printed.

**Written:** this folder only, plus the OwedBook session records required by that repository's own protocol (`agent_docs/SESSIONS/session_2026-11-23.md`, `RECOVERY.md`, `CHANGELOG.md`). Nothing was written in the Portal repository.

**Preserved:** accounts, the three-pharmacy rehearsal state, history, migrations, evidence and all branches. None of them was touched.

---

## Glossary

- **Token:** a named theme value that every screen reads, so a brand change is made in one file.
- **Primitive:** a base interface component (button, input, dialog) that screens are assembled from.
- **Shell:** the frame around a screen: header, navigation, footer.
- **Literal / translated:** the register's two ways of applying the RFI look: copied closely (sign-in, signup) or adapted to keep dashboard navigation and table width.
- **Style tile:** one sample page showing buttons, badges, notices and type side by side for approval.
- **DEV / SCRATCH:** the two Supabase projects: the shared development and alpha database, and the disposable proof database.
- **Magic Link template:** the Supabase-hosted email body used for every emailed sign-in link.
- **C-xx, R-x:** entries in the branding conflict register v0.3. **N-x, K-x, G-x:** new findings, risks and gaps in this report.
