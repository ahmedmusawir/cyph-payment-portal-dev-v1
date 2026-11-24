# BRAND_UI_CONTRACT — ABM007_FINAL

**Version:** 1.1-review (Architect amendments A-01, A-02 applied) · **Date:** 23 November 2026 · **Status:** PROPOSED. Becomes the approved visual contract when the Director passes Gate V (AC-V01).

This file maps the approved Pharmacy Books design (`SOURCES/CYPH_FRANK_DESIGN.md`) onto the two apps' real theme system. The executable form is `DESIGN/tokens/abm007_final_tokens.css`; if this file and the token file disagree, stop and report it.

## 1. Ground rules

1. **Light only.** One `:root` block. The existing `.dark` blocks stay in the files, frozen and unreachable. Nobody retunes them (D-01).
2. **Tokens only.** Components read semantic utilities. No hex, no numbered Tailwind color, no `white` or `black` color utility.
3. **One table, two stylesheets.** Both apps install the same block in the same step. The apps had drifted (recon 2.8); this ends the drift for brand values.
4. **Restyle in place.** The two apps are not merged into a shared stylesheet or package in this module.
5. **Never copy the RFI page's own colors:** its navies (#235179, #1A3A56), its navy buttons, its amber deadline label, its Tailwind grays.
6. **The design file's "Conversion Component Patterns" section is not a requirement source** for these apps.

## 1a. Exact color rule (Architect amendment A-01)

The approved hex values are the contract. The token file is their executable form and must resolve, in a browser, to exactly those hex values.

1. **Never hand-round a triplet.** A whole-number triplet is a different color. `168 53% 34%` looks like the dark green but resolves to #298572, and white text on it measures 4.475:1, which fails. The approved #288472 measures 4.532:1. The navy has the same problem: `210 69% 27%` resolves to #154574, not #154474.
2. **Anchors carry full precision.** Each approved color is written once as a precise triplet (`--brand-*`), generated from the hex by `DESIGN/source/gen_tokens.py`. For example dark green is `168.2608695652 53.488372093% 33.7254901961%`.
3. **Aliases point at anchors.** `--primary: var(--brand-green-dark)`, `--heading: var(--brand-navy)` and so on. An alias is never a second copy of the numbers. The existing `hsl(var(--token))` usage in both apps keeps working unchanged.
4. **Colors defined by this module** (border, disabled, status, deep navies, shadow tint) are written directly as whole-number HSL. For those the HSL is the definition, and the hex shown in this file is what the browser resolves it to.
5. **Two kinds of figure, kept apart.** *Nominal* means a ratio worked out from hex values on paper. *Resolved* means the ratio worked out from the color a browser actually produced from the stylesheet. Every figure in this file is resolved, taken from `DESIGN/renders/COLOR_VERIFICATION.txt`, unless it says otherwise.
6. **The instrument has a failing control.** The verification script also checks pairs that must fail, including the rounded triplet above. If a control ever passes, the instrument is broken and its other results are not trusted.

The recon's Appendix values for the two brand triplets were whole-number roundings. They are superseded by the token file; nobody copies them.

## 2. The naming trap

The design file calls navy "primary". In both apps the token `--primary` is the button and interactive color (recon 2.3). They are different things.

| Design name | Value | Maps to app token(s) |
|---|---|---|
| `primary` (navy) | #154474 | `--heading`, `--navbar`, `--ring`, `--secondary-foreground`, `--accent-foreground`, step badge fill |
| `accent-dark` (dark green) | #288472 | `--primary` (buttons, links, checked controls, progress) |
| `accent` (green) | #32A38D | `--brand-green` only: fills and large display type. Not the app token `--accent` |
| `neutral` (ice) | #EAF3FA | `--background` (P-01), `--muted`, `--secondary`, `--accent` (hover surface), text on navy |
| `neutral-white` | #FFFFFF | `--card`, `--popover`, `--primary-foreground` |
| `text-muted` | #515151 | `--muted-foreground`, `--input` (field borders) |
| `charcoal` | #393B38 | `--foreground`, `--card-foreground` |

Setting the app's `--primary` to navy would turn every button navy. Setting the app's `--accent` to the design's green would turn every menu hover green. Both are forbidden.

## 3. Token table

Full values with comments are in the token file. Contrast figures are WCAG 2.x ratios computed from the colors Chromium resolved from that file, including hover, disabled and composited backgrounds (`DESIGN/renders/COLOR_VERIFICATION.txt`; script `DESIGN/source/verify_colors.mjs`). That evidence covers token values and declared pairs on the reference stylesheet. It is not a measurement of the two real apps: that is independent QA's job (AC-B08), on the built candidate.

### 3.1 Surfaces

| Token | Value | Use | Note |
|---|---|---|---|
| `--background` | ice #EAF3FA | Signed-in page surface | PROPOSED P-01. Charcoal 10.07:1, gray 7.07:1, navy 8.86:1 on ice |
| `--card`, `--popover` | white | Cards, shell, dialogs, menus, fields | |
| `--foreground` | charcoal #393B38 | Body text | 11.31:1 on white |
| `--muted-foreground` | gray #515151 | Labels, help text, footer | 7.94:1 on white |
| `--border` | #D3E2EE | Card hairline, table dividers | PROPOSED: the design's ice measures 1.12:1 on white and disappears on an ice page. Decorative; not relied on to identify a control |
| `--input` | gray #515151 | Field and checkbox borders | 7.94:1; the design's own accessibility rule |

Literal-layout pages do not use `--background`: the backdrop is a gradient built from `--brand-navy`, `--brand-navy-deep` and `--brand-navy-deeper`, with a soft lighter glow in one corner.

### 3.2 Interactive

| Token | Value | Use | Note |
|---|---|---|---|
| `--primary` | #288472 (alias of `--brand-green-dark`) | Button fill, link text on white, checked boxes and radios, stepper progress | White text 4.532:1. Thin margin: never lighten it, never round it |
| `--primary-foreground` | white | Text on primary | Replaces the Portal's dark ink |
| `--primary-hover` | #247767 (alias of `--brand-green-hover`) | Button hover | White text 5.371:1. **Replaces every `hover:bg-primary/90`**, which composites to #3D9080 and drops white text to 3.80:1 |
| `--accent` / `--accent-foreground` | ice / navy | Hover and focus surface of menus, outline and quiet buttons | |
| `--ring` | navy | Focus outline on light surfaces | 9.95:1 on white, 8.86:1 on ice |
| `--ring-on-dark` | white | Focus outline on navy surfaces | 9.95:1. A navy ring on navy is invisible |
| `--disabled` / `--disabled-foreground` | #DFE6EC / gray | Disabled controls | 6.30:1. **Replaces `opacity-50` on primary buttons**: half-faded green on white gives white text 1.98:1 |

### 3.3 Structure

| Token | Value | Use |
|---|---|---|
| `--heading` | navy | Page titles, card titles, key figures |
| `--navbar` / `--navbar-foreground` | navy / white | Signed-in header in both apps (new token in the Portal) |
| `--brand-navy-deep`, `--brand-navy-deeper`, `--shadow-tint` | derived from navy by lightness | Gradients and shadow color. PROPOSED derivations |

### 3.4 Status (fixed meaning; PROPOSED P-02)

| Token | Value | On white | On ice |
|---|---|---|---|
| `--success` | #288639 | 4.61:1 | 4.10:1 |
| `--warning` | #9D6D06 | 4.54:1 | 4.04:1 |
| `--destructive` | #AA2622 | 6.98:1 | 6.21:1 |
| `--info` | #2173DE | 4.59:1 | 4.09:1 |

Rules that follow from the numbers:

- Colored status **text** (an error line, a signed amount in a table) sits on white surfaces only.
- **Pills and notices** use charcoal text (about 9.6 to 10.0:1 on the tint), a status-colored border and a 10 percent tint over a white base. The word carries the meaning.
- Brand green #288472 and success green #288639 are almost the same lightness (1.02:1 against each other). They are told apart by shape and word: a filled button versus an outlined pill with a label. They never sit as two bare color blocks side by side.
- OwedBook's current status values fail as text today (success 3.49:1, info 4.18:1, warning 2.21:1). Adopting this set fixes that.

### 3.5 Roles (PROPOSED P-04)

One neutral outlined label for every role: navy text and border on white; white text and border on the navy header. The earlier admin teal is 1.28:1 against the brand green, so hue cannot carry the role any more. `data-testid="nav-role-badge"` and the role text stay as they are.

### 3.6 Radius

The kit's single `--radius` cannot give 8px fields and 14px cards. Each `tailwind.config.ts` gets explicit values:

| Tailwind class | Value | Design name | Used on |
|---|---|---|---|
| `rounded-sm` | 4px | (kit internal) | Checkbox, menu item |
| `rounded-md` | 8px | `sm` | Buttons, fields, menus, toasts |
| `rounded-tile` (new) | 12px | `md` | Logo tile |
| `rounded-lg` | 14px | `lg` | Cards, dialogs, sheets' inner panels |
| `rounded-xl` | 16px | `xl` | Shell, masthead |
| `rounded-full` | 9999px | `full` | Step badges, pills, role labels |

Card-like containers that carry no radius class today (15 in OwedBook, about 40 in the Portal) get the card treatment through **one** shared card class or component per app, not by hand-adding classes at each site.

### 3.7 Shadows

Added as a `boxShadow` extension in each `tailwind.config.ts`, all tinted with `--shadow-tint`:

| Name | Value | Used on |
|---|---|---|
| `shell` | `0 18px 48px` at 18 percent, plus a 1px inner top highlight | Literal-layout shell |
| `masthead` | `0 12px 28px` at 18 percent | Masthead |
| `card` | `0 8px 20px` at 5 percent | Cards |
| `tile` | `0 6px 16px` at 25 percent | Logo tile |

Buttons stay flat. Menus, dialogs and toasts keep their existing elevation, re-tinted navy.

## 4. Components

### 4.1 Type

Inter everywhere, weights 400 to 700, through `next/font`.

| Role | Size and weight | Used for |
|---|---|---|
| `headline` | 36px Bold, 1.1, minus 0.03em | One per page, in a masthead |
| `page-title` (added) | 28px Bold | Dashboard page titles outside a masthead. The design invites a separate token instead of stretching `headline` |
| `headline-2` | 18px Medium | Card titles, step titles |
| `headline-sub` | 14px Medium, caps, tracked | Small group labels |
| `eyebrow` | 12px Semibold, caps, widely tracked | Masthead top row, page eyebrow |
| `body` / `body-sm` / `label` | 16 / 15 / 13 Regular | Text, field values, labels and help |
| `button` | 16px Regular | Buttons |

Uppercase is for `eyebrow`, `headline-sub` and table column heads only. It comes off buttons, pills, role labels and the brand wordmark (recon N-1). OwedBook's four `font-light` titles move to 400 or above.

### 4.2 Buttons

| Variant | Default | Hover | Focus | Disabled | Busy |
|---|---|---|---|---|---|
| Primary | `--primary` fill, white text | `--primary-hover` | 2px outline, 2px offset, `--ring` (or `--ring-on-dark`) | `--disabled` fill, gray text, not operable | Spinner plus gerund label, `aria-busy`, duplicate-submit guard kept |
| Outline | White, navy text, 1px gray border | Ice fill | Same outline | Same | Same |
| Destructive outline | White, destructive text and border | 10 percent destructive tint | Same | Same | Same |
| Quiet | No fill, navy text | Ice fill | Same | Same | Same |

All: Title Case, 10px by 16px padding, at least 44px high, 8px radius. OwedBook's 4px outline border becomes 1px. The Portal's coral hairline goes.

### 4.3 Links

Dark green, always underlined, on white surfaces. On navy: ice text, underlined. Not placed on ice as body links; on an ice page, links live inside white cards. A link that must sit directly on the ice page (for example "Back to OwedBook" beside a page title) is navy and underlined, 8.86:1. This replaces the Portal's `.portal-link` recipe and its cited ruling R-004 (body-colored underlined links), and OwedBook's hover-only underline.

### 4.4 Fields

White, 8px radius, 8px by 10px padding, `body-sm` text, `label` above, help below. Border `--input` at 1px. Error: destructive border at 2px plus a bold destructive message with its existing icon; never color alone. Native checkboxes and radios read `--primary`.

### 4.5 Cards, mastheads, step badges, logo tile

As the design file states them. Card titles navy, body charcoal. A step badge is a 28px navy circle with a white bold number; a not-yet-reached step is an outlined circle. The logo always sits in a white 12px-radius tile on navy, as the unaltered master image scaled whole (`CONTRACTS/LOGO_ASSET_SPEC.md`). The references now show the real master, not a placeholder.

### 4.6 OwedBook KPI tiles (PROPOSED P-03)

White cards, label in gray, figure in navy bold, a 3px top rule in the tile's status color. The `--chart-*` tokens keep data meanings; the last two move off coral to navy and brand green.

### 4.7 Tables

Head row on ice, 13px Medium caps in gray. Rows on white with hairline dividers. Numbers right-aligned with tabular figures. Signed amounts may use status text because the table sits on a white card. Below the fit breakpoint, rows stack as labelled pairs (both apps already reflow; keep it).

### 4.8 Header, sidebar, menus, dialogs

- **Header (both apps):** navy bar, logo tile, "Pharmacy Books" with the app name beneath, navigation in ice text, active item on a translucent white pill, user name and role label on the right. Focus rings use `--ring-on-dark`.
- **Narrow header:** a visible, labelled menu button (white outline on navy, at least 44px high) opens each app's existing drawer. The drawer is white, with the active item on ice with a navy left rule. The references illustrate the closed state on samples 03, 04 and 05 and the open state on sample 04b. Those are pictures of the look only: each app keeps its own menu items, order, drawer behavior and where it shows the name and role.
- **Sidebars and filter rail:** white card on the page surface. Active item: ice fill, navy text, a navy rule on the left edge. The solid coral active item goes.
- **Menus, dialogs, sheets, toasts:** white, 8px or 14px radius by the table above, navy-tinted elevation. Scrims use `--shadow-tint` at their current opacity instead of black.

### 4.9 Icons

The existing icon set stays. Navy on light surfaces, white or ice on navy. No new icon library.

## 5. States that must survive the restyle

Loading spinners and skeletons, busy buttons with their wording, confirmation dialogs with a no-effect Cancel, error summaries that take focus, inline field errors, live regions, the skip link, the stacked mobile table, the navbar name and role badge. They were built or repaired during the manual-QA rounds and are covered by unit tests. A restyle that removes any of them is a regression, not a style choice.

## 6. Recorded departures from the design file

| Departure | Why |
|---|---|
| Ice page surface on signed-in pages | The design describes a single white shell on navy; dashboards need a page surface. PROPOSED P-01 |
| `--border` deepened from ice | Ice is 1.12:1 on white |
| Green links restricted to white surfaces | 4.035:1 on ice, 2.195:1 on navy (register C-05) |
| `page-title` at 28px | The design's 36px headline is reserved for mastheads |
| Hover, focus, disabled values defined | The design leaves them to build time |
| No dark theme | D-01 |
| Brand triplets carry full precision; aliases use `var()` | A whole-number triplet resolves to a different color and fails contrast (section 1a) |

## Glossary

- **Token:** a named theme value every screen reads.
- **Masthead / shell / backdrop:** the gradient header band, the centered white panel, and the navy page behind it.
- **Scrim:** the dimmed layer behind a dialog.
- **P-nn:** a proposed position in `ABM_RULINGS.md`.
