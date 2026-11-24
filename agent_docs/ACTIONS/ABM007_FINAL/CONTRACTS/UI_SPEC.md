# UI_SPEC — ABM007_FINAL (screen and component mapping)

**Version:** 1.1-review (Architect amendment A-02 applied) · **Date:** 23 November 2026 · **Status:** PROPOSED with the brand contract. **Design mode:** production polish on existing screens. **Canonical screens:** Portal `/dashboard` (translated) and Portal `/register/plan` (literal).

Screen inventory is from the Engineer's recon sections 4.1 and 4.2, verified on the baselines. This spec changes how screens look. It does not add, remove or reorder what they do, except where a row says so.

## 1. The two layouts

**Literal.** Full-bleed navy gradient backdrop. One centered white shell, 28px padding, 16px radius, large soft shadow. Inside: a gradient masthead (eyebrow row with brand left and context right, logo tile beside the headline, one description line, optional italic disclaimer), then white cards stacked with even gaps. Shell width: about 1100px for multi-column forms, about 560px for single-purpose pages such as sign-in. No signed-in navigation; these pages are used signed out.

**Translated.** Navy header bar across the top. Page surface behind (P-01). White cards with 14px radius, hairline and light shadow. Tables and dashboards keep their current width: OwedBook `/owedbook` full width, Portal account pages `max-w-6xl`.

**Panel inside navigation.** For Add Pharmacy and Help (D-02): the translated header stays, and the content area carries a masthead and cards in the RFI style.

## 2. OwedBook screens

| Route | Layout | Notes |
|---|---|---|
| `/auth` | Literal, narrow shell | Sign-in by password and by emailed link, as today |
| `/auth/confirm`, `/auth/link-expired`, `/auth/sign-in-to-continue`, `/auth/signed-out`, `/auth/switch`, `/auth/handoff-recovery` | Literal, narrow shell | One card each. The confirm page keeps its button; the link alone never signs anyone in |
| `/owedbook` | Translated, full width | Header, filter rail as a white card, KPI tiles (P-03), tabs as pills or the existing tab control restyled, data table, status chips in the pill recipe, access banner as a notice. `AccessBanner`'s yellow becomes the warning notice |
| `/admin-portal` (My Stores) | Translated with sidebar | Store cards with access-now and next-renewal wording kept |
| `/admin-portal/stores/[id]` and `/invite` | Translated with sidebar | People list, role labels (P-04), invite form with the explicit role choice, removal dialog |
| `/admin-portal/billing` | Translated with sidebar | Owner view, the "managed by Owner" view for others |
| `/admin-portal/settings` | Translated with sidebar | Read-only fields; "Not provided" stays where true |
| `/admin-portal/audit` | Translated with sidebar | Filters, local-time labels, older-events control |
| `/profile` | Translated, header only | |
| `/invitations` | Translated, header only | Not placed by the register; grouped here with account pages |
| `/help` (new; final route chosen by the Engineer after inspection) | Panel inside navigation | `CONTRACTS/HELP_CONTENT.md`. Contents list at the side on desktop, above the content on narrow screens |
| `/` (landing) | Minimal update (P-08) | Public header in navy with the logo tile; tokens, names, logo; dead `#features`, `#how-it-works`, `#pricing` links removed; screenshot refreshed or removed |
| `/access-denied`, `not-found`, the three `error.tsx`, the three `loading.tsx`, `/error` | Brand applied in place | One card on the page surface; spinners and skeletons in tokens |

## 3. Portal screens

| Route | Layout | Notes |
|---|---|---|
| `/login` | Literal, narrow shell | |
| `/auth/*` (six pages) | Literal, narrow shell | |
| `/register/plan`, `/pharmacy`, `/owner`, `/review`, `/activation` | Literal, wide shell | Stepper becomes step badges with labels; on narrow screens "Step n of 4" in the masthead eyebrow. Prices and wording unchanged (AC-R05). The selected plan card has a 2px navy border |
| `/dashboard` | Translated | Plan summary card, access-now and next-renewal figures, pharmacy table, removal control, footer |
| `/billing` | Translated | Billing overview and the link to Stripe's hosted portal |
| `/stores/add` (Add Pharmacy) | Panel inside navigation | Signed-in header stays (D-02). Form, quote, consent and result states keep their logic and wording |
| `/`, `not-found`, `(account)/loading` | Brand applied in place | |

The 30 unreachable Portal source files (recon 4.2) inherit token changes and are **not** restyled by hand, not counted as screens, and not tested visually. Nothing in this module deletes them; removal is a separate decision.

## 4. Shared component vocabulary

Each is restyled per the brand contract in both apps. Section references are to `BRAND_UI_CONTRACT.md`.

| Component | Contract | Per-app note |
|---|---|---|
| Signed-in header | 4.8 | OwedBook: `Navbar`. Portal: `Shell` top bar gains `--navbar` |
| Public header | 4.8 | OwedBook `NavbarHome`, `NavbarLoginReg`; Portal `PublicShell`. On literal pages the masthead replaces the header's brand role |
| Sidebar, mobile drawer | 4.8 | Drawer stays reachable by keyboard and touch |
| Card | 3.6, 4.5 | OwedBook has a `Card` primitive; the Portal gets one shared panel class or component |
| Button | 4.2 | Portal: drop uppercase and semibold; both: new hover and disabled |
| Link | 4.3 | Portal `.portal-link` replaced |
| Field, select, checkbox, radio, password input | 4.4 | |
| Pill / status chip | 3.4 | OwedBook `StatusChip` moves from colored text to the pill recipe |
| Role label | 3.5 | Both navbars |
| Notice / alert / error summary | 3.4 | Bold instruction line first |
| Data table | 4.7 | OwedBook `common/DataTable`; Portal `portal/DataTable` |
| KPI tile | 4.6 | OwedBook only |
| Stepper | 4.5 | Portal only |
| Radio card | 4.5 | Selected: 2px navy border |
| Dialog, alert dialog, sheet, dropdown, toast | 4.8 | |
| Empty state, spinner, skeleton | tokens | `SpinnerLarge` loses its numbered colors |
| Footer | tokens | Support address and legal links as today, including "(link not yet published)". "a Cyber Pharma product" removed (P-22) |
| Skip link | unchanged behavior | Must remain first in tab order |

## 5. Responsive rules

- Base check at 375px; no horizontal page scroll at any width in the matrix.
- Header: brand and menu trigger below the fit breakpoint; full navigation above. The drawer keeps identity, navigation and sign-out.
- Literal shell: padding drops to 16px; masthead headline to 28px; multi-column forms to one column.
- Tables stack as labelled pairs below their fit breakpoint.
- KPI tiles: four across, then two by two, then one column.
- Touch targets at least 44px.

## 6. States every restyled screen keeps

Loading, empty, error, denied, busy, success and validation states listed in the brand contract section 5. Forbidden controls still do not render for roles that may not use them (for example the Add Pharmacy form for a Store admin).

## 7. Reference renders

`DESIGN/` holds a runnable style tile, five sample screens and one illustrated menu-open state, with desktop and 375px renders: 13 images. They use the real, unaltered logo master in a white tile, and the exact approved colors. They show the look, not the exact content of today's screens: data is fictional. The Engineer builds from the real components; the renders are the visual target and the tokens are the contract.

**What the samples do not decide.** A sample that leaves out a navigation item, shows items in a different order, or moves the name and role into the menu at narrow width is not an approval to remove, reorder or move anything. Each app keeps its existing navigation items, order, drawer behavior and controls (brand contract section 5; AC-L and AC-R groups). The menu on the samples is a static picture and is labelled as one.

| Reference | Shows |
|---|---|
| Style tile | Every token in context; all button states; links on white and navy; fields; pills, roles and notices side by side with a primary button; step badges; masthead; KPI tiles |
| 01 Portal sign-in | Literal, narrow shell |
| 02 Portal choose plan | Literal, wide shell, step badges, $99 and $49 pricing |
| 03 OwedBook dashboard | Translated, full-width table, filter rail, KPI tiles, signed amounts. Mobile render shows the menu button |
| 04 Portal dashboard | Translated, plan summary, pharmacy table, removal control. Mobile render shows the visible menu button, closed |
| 04b Portal dashboard, menu open (mobile only) | The illustrated open state of the narrow-width menu: white drawer, active item on ice with a navy rule |
| 05 OwedBook Help | Panel inside navigation, numbered steps. Mobile render shows the menu button |
