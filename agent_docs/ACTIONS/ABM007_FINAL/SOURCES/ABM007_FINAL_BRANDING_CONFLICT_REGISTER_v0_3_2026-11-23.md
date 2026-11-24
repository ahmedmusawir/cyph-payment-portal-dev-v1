# ABM007_FINAL — Branding conflict register

**Version:** 0.3 (Director rulings recorded)
**Date:** 23 November 2026, Asia/Dhaka
**Authors:** QA Lead seat (acting as co-architect) and Architect seat
**For:** Director; then Coach for the open questions
**Status:** Panel-agreed working record. Not a frozen brand contract, not an ABM, not a release. Director rulings of 23 November are recorded in section 6. Three Coach/Frank confirmations remain.

## 1. What this file is

Coach relayed Frank's branding request on 23 November: update the Pharmacy Books branding to match the approved DESIGN.md. This file records where that design conflicts with, or is silent about, the two existing alpha apps (OwedBook and Account & Billing), the position the two architects reached on each item, and the decisions still needed before the brand part of `ABM007_FINAL` can be frozen.

## 2. Evidence and limits

**Read by both seats**
- `CYPH_FRANK_DESIGN.md` as uploaded by the Director (Pharmacy Books DESIGN.md, approved 21 November by Mical Johnson and Frank Tant).
- Coach's Slack message of 23 November.
- The Architect handoff for `ABM007_FINAL`, campaign doctrine journal v0.3, and the v3 recipe Rework Record.

**Read by the QA Lead seat**
- Project design-system docs `05_DESIGN_SYSTEM/TOKEN_FILE.md` v1.3 and `05_DESIGN_SYSTEM/THEMING_MANUAL.md` v1.3. These are reference templates, not the live theme files.

**Observed by the Architect seat, 23 November 2026, Asia/Dhaka**
- Live page https://pharmacybooks.com/rfi in a browser: navy surroundings, centered white panel, gradient masthead, rounded white cards, soft shadows.
- Read-only computed styles: H1 36px with declared family Inter, Segoe UI, Roboto, Arial, sans-serif. Search button in Segoe UI with background rgb(35, 81, 121), which is #235179. Header logo is the older export ending `68a478abfcbcd61a6c4be41e.png`.
- Preferred logo ending `68a614a57bdd552c6f226c3a.png` retrieved: 1024 x 543 PNG. Pixel inspection found #154474 and #32A38D alongside nearby variations.
- No forms submitted, no external settings changed.

**Contrast figures, computed independently by both seats with matching results**

| Pair | Ratio | Reading |
|---|---|---|
| Dark green #288472 on white | 4.532:1 | Passes 4.5:1, with almost no margin |
| Dark green #288472 on ice blue #EAF3FA | 4.035:1 | Fails for normal text |
| Dark green #288472 on navy #154474 | 2.195:1 | Fails |
| Navy #154474 on white (and white on navy) | 9.948:1 | Passes |
| Ice blue #EAF3FA on navy #154474 | 8.858:1 | Passes |
| Muted gray #515151 on white | 7.938:1 | Passes, including the 3:1 border bar |
| Raw green #32A38D on white | 3.107:1 | Fills and large type only |

**Limits**
- Neither app repository and neither deployed app theme has been inspected by either seat. Everything said about how the apps are themed today is unverified until engineering recon.
- Coach's Drive link was not opened by the QA Lead seat; the uploaded file is assumed identical.
- The RFI observations support avoiding its button styling and replacing its old logo. They do not independently prove that Inter never loads on that page.
- Brand colors come from the approved design tokens, not from a dominant-pixel reading of the logo.
- No timeline estimate is given. See section 7.

## 3. What is straightforward

If repo recon confirms the apps follow the token rules, these are value changes in each app's entry stylesheet and root layout:

- Palette swap to the logo palette.
- Font swap to Inter, loaded through `next/font` so it ships with the page.
- Corner radius from flat to the rounded scale.
- Form field borders darkened to muted gray #515151.
- Existing error and status colors kept, subject to the style-tile check in C-06.

## 4. Conflict register with panel positions

| ID | Conflict or gap | Panel position | Status |
|---|---|---|---|
| C-01 | DESIGN.md is a tool-page design. It defines no navbar, sidebar, table, dialog, role badge, status pill, filter bar or empty state. | Architects write one short brand/UI contract mapping the design onto the apps' real components. Three to four representative screens are approved before the look is applied everywhere. | Agreed. Contract to be authored. |
| C-02 | Dark mode. Design docs describe a light and a dark theme with a toggle; DESIGN.md is light only. | Light only for this release, following the supplied design. Hide any existing theme toggle. Do not build an unapproved dark variant in this assignment. Recon must first confirm each app's actual theme behavior. | **Director ruled 23 Nov: light only this release.** Hide any existing toggle during implementation. Not a client question. |
| C-03 | Layout: literal RFI look or a translation for dashboards. | **Literal** (navy backdrop, centered white shell, gradient masthead, white cards): sign-in, signup, Add Pharmacy. **Help:** masthead, cards and numbered instructions inside the existing app navigation. **Translated** (navy header, white content surfaces, rounded cards, restrained shadows): Dashboard, My Stores, staff administration, Settings, Profile, Audit and billing overview. Keep usable table width and navigation; no 1100px shell on dashboards. | Agreed. Coach/Frank to confirm via sample screens. |
| C-04 | "Primary" means navy in DESIGN.md and the button color in the apps' theme system. A literal copy turns buttons navy. | Where app `--primary` drives ordinary buttons and links, it maps to #288472 with white text. Navy #154474 maps separately to headings, header surfaces and focus styling. Charcoal #393B38 for body text on white cards. Inspect actual token consumers before assigning, since a name may also drive other surfaces. Navy focus rings need a contrasting treatment on navy backgrounds. | Agreed in principle. Final mapping after recon. |
| C-05 | "Every link green" fails on non-white backgrounds. | Dark-green text links on white backgrounds only. On dark surfaces, use an accessible contrasting link color or place the link on white. Recorded as an accessibility qualification to the blanket instruction. White text on solid #288472 passes; button boundaries and focus visibility still get checked in context. | Agreed. Implementation rule; not a client question. |
| C-06 | Green buttons beside the green success color, green Member badge and teal Admin badge. DESIGN.md bars brand green as a status color. | Style tile first: primary buttons, success notices and Owner, Admin and Member badges side by side. Retune only where needed for distinction, contrast or the status-color restriction. Role labels and status meaning stay explicit and unchanged. | Agreed. Style tile is part of the sample-screen set. |
| C-07 | The "Conversion Component Patterns" section describes the marketing registration page: $100 and $250 plans, about 20 fields. | Out of scope and fenced off in the ABM pack. The $99 first pharmacy plus $49 each additional contract stays authoritative. Marketing proposals need their own decisions. | Agreed. Director ruled 23 Nov: pricing preserved; Coach asked for a plain confirmation. |
| C-08 | Brand and product naming. | Proposed hierarchy: master brand **Pharmacy Books**; main app **Pharmacy Books / OwedBook**; portal **Pharmacy Books / Account & Billing**. The slash shows hierarchy, not literal header punctuation. | Proposed. **Coach/Frank to confirm**, including "OwedBook" versus "Owed Book". |
| C-09 | Logo assets: one mark-only PNG, no wordmark, favicon or SVG. | Proceed with the preferred PNG as supplied, unaltered, on a white tile over navy. Request the full package. Not a build blocker. | Agreed. Optional request to Coach. |
| C-10 | Stripe hosted pages and sign-in emails carry their own branding settings. | **In scope, with a boundary.** Customer emails: update the existing templates' logo, colors and presentation only; sign-in link and routing logic untouched. Stripe pages: logo, brand colors and the supported font and shape settings, within Stripe's built-in controls. A custom billing interface is a separate project. See section 5A for the conditions. | **Director ruled 23 Nov: in.** Configuration-and-verification task, sized in recon. |
| C-11 | Coach's two RFI page fixes. | Frank's RFI page is the visual reference only. Its repairs stay outside `ABM007_FINAL`. | **Director ruled 23 Nov: out.** No ownership question to Coach. |
| C-12 | States the design leaves to build time. | Defined once in the brand/UI contract. **Hover:** darker than #288472, contrast verified. **Focus:** visible 2px outline with offset, contrast aware of the surface. **Disabled:** clearly inactive, readable, actually non-interactive. **Busy:** keep progress text, indicators and duplicate-submit guards. **Notices:** keep suitable existing semantic colors after inspection, with wording or icons as well as color. **Icons:** keep the existing icon set, navy where appropriate. | Agreed. To be specified before the engineering build. |

## 5. Facts still needed from the repositories

Read-only, inside engineering recon. Not requested yet.

- **R-1** Count of hardcoded colors, numbered Tailwind colors and inline color styles in each repo.
- **R-2** Whether a dark theme and toggle are actually wired in each app.
- **R-3** How the font is loaded in each app today.
- **R-4** Whether both apps share theme values or have drifted apart.
- **R-5** Where shadows and radius are defined, and whether one knob controls them.
- **R-6** What each theme token actually drives in each app (added from the Architect's C-04 position).
- **R-7** How many screens carry individual style overrides (from the Architect's timeline note).
- **R-8** Which customer emails exist today, where each template lives (Supabase auth templates, app-sent mail, Stripe-sent mail), and which of them carry link or routing logic.
- **R-9** What the Stripe sandbox's branding screen actually offers today: logo, icon, colors, font list (is Inter available), shapes; previewed on Checkout, the billing portal, an invoice and a receipt.

## 5A. Conditions on the Stripe and email scope (C-10)

Stripe's customer-portal documentation, read 23 November 2026, lists these customizable items in the Dashboard branding settings: logo and icon, background color, button color, font, and shapes. It also states that self-branding is done in the Dashboard, not through the Accounts API, that email settings apply to all emails Stripe sends to customers, and that a sandbox is isolated from the live setup.

What follows for this module:

1. **Stripe branding is a Director dashboard action, not Engineer code.** The Engineer can prepare the exact values and assets; the Director applies them.
2. **Sandbox only in this module.** The settings are applied to the "Cyber Pharma" sandbox the alpha uses. The live Stripe account needs the same settings applied again at production cutover. Record that as a production-readiness item.
3. **Account-wide effect.** Branding and email settings apply to everything that Stripe account sends and shows, not only this app's pages.
4. **Font is whatever Stripe offers.** Use Inter if it is in Stripe's list; otherwise the closest offered font, recorded as a known difference. Not verified yet (R-9).
5. **Emails render differently from web pages.** Many mail clients ignore web fonts, so Inter falls back to a system font in email. The logo must be a hosted image. Email acceptance is "logo, colors and layout", not pixel match.
6. **Sign-in emails are shared and fragile.** The Supabase auth templates serve local and alpha from one project, and their callback routing had to be corrected during deployment (journal entry CJ-017). Presentation changes only. Any template edit is followed by a real sign-in and a real invitation on alpha and on local.
7. **The green-link rule (C-05) applies to emails too.**

## 6. Decisions

**Director rulings, 23 November 2026 (relayed through the Architect)**
1. C-02: light only this release; hide any existing toggle during implementation.
2. C-10: emails and Stripe pages are in scope, within the boundary in the register and section 5A.
3. C-11: RFI page repairs are out; no ownership question.
4. C-07: APBM-007A/007B pricing is preserved; Coach is asked for a plain confirmation.
5. The dark mode question, the green-link note and the RFI ownership question are removed from the client questions. The logo-package request is optional.

**Coach / Frank — three confirmations**
1. Approve adapting the RFI styling to the existing dashboard layouts (C-03), confirmed on sample screens.
2. Confirm the exact app names and capitalization (C-08), including "OwedBook" versus "Owed Book".
3. Confirm $99 per month for the first pharmacy and $49 per month for each additional pharmacy (C-07).

Optional: the full logo package, with a favicon and any wordmark version (C-09).

## 7. Timeline position

Both seats agree: no number yet. This is a moderate visual update across both apps plus a verification pass. With C-02 ruled, a credible estimate needs only the engineering recon in section 5, mainly R-1, R-7, R-8 and R-9. The estimate is produced in recon, before the build is released.

## 8. QA implications (for later, not a plan)

- Visual checks across both apps, the three roles, and a narrow screen, with Windows Chrome as the stakeholder baseline.
- Contrast measured in context for buttons, links, field borders, badges and focus rings on both white and navy surfaces.
- Keyboard focus, loading, error, disabled and busy states.
- No-break regression on the tested customer journeys. Branding must not expose forms, weaken guards or remove progress and accessibility feedback.
- No new sandbox payments to confirm visual changes; existing fixtures are preserved.

## 9. Change log

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-11-23 | Initial assessment by the QA Lead seat. No repo inspection. |
| 0.2 | 2026-11-23 | Architect positions on C-02, C-03, C-04, C-05, C-06, C-08 and C-12 folded in. Architect's live RFI and logo evidence recorded. Contrast table added, computed independently by both seats. R-6 and R-7 added. Pending decisions split by owner. |
| 0.3 | 2026-11-23 | Director rulings recorded: light only, emails and Stripe in scope with a boundary, RFI repairs out, pricing preserved. Client questions reduced to three. Section 5A and R-8, R-9 added by the QA Lead seat after reading Stripe's portal documentation. |

## Glossary

- **C-01 to C-12:** conflict or gap entries in this register.
- **R-1 to R-9:** repository facts still needed.
- **Token:** a named theme value (a color, radius or font) that every screen reads, so a brand change is made in one file.
- **Masthead / shell:** DESIGN.md's names for the gradient header band and the centered white panel.
- **Style tile:** one sample page showing buttons, badges, notices and type side by side for approval.
