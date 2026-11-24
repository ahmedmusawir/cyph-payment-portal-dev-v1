---
version: alpha
name: Pharmacy Books
description: Visual identity for Pharmacy Books web properties. Palette is logo-derived from Pharmacy-Books_Logo-Primary.png (decided 2026-09-20). Typography, layout, shapes, depth, and component styling follow the look of pharmacybooks.com/rfi, which Frank named as the reference on 2026-11-20, re-expressed in the logo palette.
colors:
  primary: "#154474"
  accent: "#32A38D"
  accent-dark: "#288472"
  neutral: "#EAF3FA"
  neutral-white: "#FFFFFF"
  text-muted: "#515151"
  charcoal: "#393B38"
typography:
  headline:
    fontFamily: Inter
    fontWeight: 700
    fontSize: 36px
    lineHeight: 1.1
    letterSpacing: -0.03em
  headline-2:
    fontFamily: Inter
    fontWeight: 500
    fontSize: 18px
    lineHeight: 1.5
  headline-sub:
    fontFamily: Inter
    fontWeight: 500
    fontSize: 14px
    lineHeight: 1.5
    letterSpacing: 0.04em
  eyebrow:
    fontFamily: Inter
    fontWeight: 600
    fontSize: 12px
    letterSpacing: 0.14em
  body:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 16px
  body-sm:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 15px
  label:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 13px
  button:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 16px
rounded:
  sm: 8px
  md: 12px
  lg: 14px
  xl: 16px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.neutral-white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  input:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.charcoal}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 8px 10px
  shell:
    backgroundColor: "{colors.neutral-white}"
    rounded: "{rounded.xl}"
    padding: 28px
  masthead:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.xl}"
    padding: 18px 20px 20px
  card:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.lg}"
    padding: 18px 18px 20px
  logo-tile:
    backgroundColor: "{colors.neutral-white}"
    rounded: "{rounded.md}"
    padding: 6px 8px
  step-badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.full}"
    size: 28px
---

# Pharmacy Books DESIGN.md

<!-- Verification status: approved. Current version (2026-11-20 update) approved 2026-11-21 by Mical Johnson for Cyberize and by Frank Tant for Pharmacy Books, as recorded by Mical. Original base verified by Mical 2026-09-16. Built by client-design-md-builder on 2026-09-16 from the live site pharmacybooks.com (home page and /registration, computed styles read in a headless browser) and the site's logo file. No client brand guide or logo package was on file. Approved as it stands, with the [STRATEGIST REVIEW] items in the body left open by decision for resolution during the website build. The color items in that original set, including the Teal accent contrast failure, were closed on 2026-09-20 and are no longer open; see the update note below. The remaining open items are typography consolidation, the logo package and wordmark lockup, icon direction, imagery sign-off, the primary CTA label, and 3 missing trust assets.

Updated 2026-09-20 by client-design-md-builder: recorded the preferred logo lockup Frank named on that date, saved it to Brand_Assets, re-derived the logo candidate colors from that file, and split the open color conflict into three named questions. Mical then signed off on promoting the logo palette and, on 2026-09-20, decided all 3 open color questions: the accent is the logo green with a darkened interactive variant, primary moves to the logo navy, and coral red is logo artwork only. The palette is now logo-derived brand canon sourced from Pharmacy-Books_Logo-Primary.png. Retired in that decision: accent #00B9AD and primary #21507A, both GoHighLevel site defaults rather than brand values. Not tokenized by decision 3: the logo's coral red #F4443D and its second navy #114A81. The Conversion Component Patterns section remains site-derived from 2026-09-16 and still carries its own open [STRATEGIST REVIEW] items.

Updated 2026-11-20 by client-design-md-builder: Frank asked for the branding to match the CMS RFI tool page at pharmacybooks.com/rfi. Mical decided the same day to adopt that page's look and feel but keep the logo palette, and to use Inter as the single font family, which closes D1. Typography, Layout, Elevation & Depth, Shapes, and the component geometry were re-derived from the RFI page's computed styles, read in Chrome on 2026-11-20, and are site-derived. The RFI page's own colors were deliberately not adopted. Status: approved 2026-11-21 by Mical Johnson (Cyberize) and Frank Tant (Pharmacy Books). Shared with Moose and the #pharmacy-books channel the same day. -->

## Overview

Pharmacy Books is a subscription web app for independent pharmacy owners that simplifies the financial "books" of the pharmacy business, starting with Book 1, the Owed Book (underpayment tracking through to a filed complaint). The audience is pharmacy owners and managers: busy, detail-oriented, and wary of anything that touches reimbursement or patient data. The interface should feel trustworthy, clinical-clean, and calm, with the confidence of a financial tool rather than the energy of a consumer app. On 2026-11-20 Frank asked for the branding to match the CMS RFI tool page at pharmacybooks.com/rfi. Mical decided the same day to take that page's look and feel (type, layout, shapes, depth, and component styling) and to keep the logo palette, so the RFI page's own colors are not adopted. Expect this file to grow as the marketing website build (04_Projects/Marketing_Website) defines more patterns.

## Open Decisions

Every unresolved item in this file, stated as a question, with a recommendation and what it is
blocked on. The inline `[STRATEGIST REVIEW]` markers stay where they are so the context lives next
to the thing it affects; this section exists so the decisions are findable without reading the
whole file. Close an item here and in its inline marker at the same time.

Tracked in ClickUp: [Resolve the 8 open DESIGN.md decisions for Pharmacy Books](https://app.clickup.com/t/86e3bgek7) (parent, 8 subtasks D1 to D8; D1 resolved 2026-11-20 in this file, its ClickUp subtask still to be closed)

| # | Question | Recommendation | Blocked on | Applies to |
|---|---|---|---|---|
| D2 | Is there a full logo package, and is there a lockup pairing the mark with a "Pharmacy Books" wordmark? | Request the package and a horizontal lockup. Outstanding since 2026-08-07. | Frank | Iconography & Imagery, Logo |
| D3 | What is the icon direction? | Simple flat line icons in `primary` navy, echoing the logo's rounded geometry. No source gives a direction, so this is a proposal to confirm. | Nobody. Cyberize call. | Iconography & Imagery, Icons |
| D4 | Is the proposed imagery art direction approved as written? | Approve as drafted. It is grounded in the audience and the logo's flat style, and it already carries the HIPAA rule about readable patient information. | Nobody. Cyberize call. | Iconography & Imagery, Imagery |
| D5 | What is the primary CTA label, replacing "Get Started"? | An outcome label such as "Start My Subscription" or "Recover What You're Owed". Needs a check against Brand Voice and Tone, which is still a stub. | Partly blocked: PB_Brand-Voice-and-Tone.md is not populated. | Conversion Component Patterns |
| D6 | What is the security and HIPAA handling statement on the site? | Write one. It answers the loudest objection a pharmacy owner has, and only a Privacy Policy link exists today. | Frank, for what can be claimed | Trust element inventory |
| D7 | What is the pharmacy-owner founder story? | Write it from Frank's background. It is the strongest available trust asset and costs nothing to produce. | Frank | Trust element inventory |
| D8 | What are the cancellation terms for the monthly plans? | State them plainly on the registration page. Monthly plans with no stated terms read as a risk to the buyer. | Frank | Trust element inventory |

Resolved 2026-09-20 and no longer open: the accent color, the primary navy, the coral red question,
and the accent contrast failure. See Colors below.

Resolved 2026-11-20 and no longer open: D1, typography. One family, Inter, for headings and body, following the RFI page. See Typography below.

## Colors

The palette is logo-derived. Frank named `Pharmacy-Books_Logo-Primary.png` as the source on 2026-09-20, and Mical decided the three open color questions the same day. Values measured directly from that file.

- **Navy, `primary` (#154474):** the anchor brand color. Headlines, body text, structure, and the video frame border. This is the Rx mark's navy. 9.95:1 on white and AAA, so it is safe everywhere.
- **Green, `accent` (#32A38D):** the brand accent, from the middle book in the mark. 3.11:1 on white, so it is for fills, chart marks, and large display type only. Never body copy on white, and never a small white label on top of it.
- **Green dark, `accent-dark` (#288472):** the interactive form of the accent. Buttons, links, and any accent-colored text. 4.53:1 with white text, which passes WCAG AA for normal text. This is `accent` at 81 percent brightness.
- **Ice Blue, `neutral` (#EAF3FA):** card hairline borders, light text on the navy masthead (8.86:1 on `primary`), and alternating section backgrounds on long marketing pages.
- **White, `neutral-white` (#FFFFFF):** main content background and button text.
- **Muted Gray, `text-muted` (#515151):** footer and legal text.
- **Charcoal, `charcoal` (#393B38):** the shelf line in the mark. 11.31:1 on white and AAA, the body text color inside cards, where Navy would be too heavy.

### Decisions made 2026-09-20 (previously open)

1. **Accent is the logo green, not the site teal.** `#00B9AD` came from the GoHighLevel funnel page rather than the brand, and it is retired. Do not carry it forward. Because the raw green also fails AA for normal text, interactive use goes through `accent-dark`.
2. **Primary moved from the site navy to the logo navy.** `#21507A` is retired. It had been adopted only because it matched the logo export in use on 2026-09-16, and Frank has since named a different export whose Rx navy is `#154474`.
3. **Coral red is logo artwork only, not a brand color.** The mark contains `#F4443D` and a second, near-identical navy at `#114A81`. Neither is a palette token, so neither is available to designers or build agents. Reproduce them only inside the logo itself. When the app needs an error or negative-balance red, choose one deliberately rather than reaching for the logo red, so a brand accent is never mistaken for a warning.

The earlier logo export this file was built from on 2026-09-16 carries different values for the same artwork: navy #21507A, green #37967D, coral red #F74A43. Both files are the same mark, exported differently. Nothing in the original file was wrong; the preferred source changed.

The link blue on the site (#188BF6) is the GoHighLevel platform default, not a brand choice. Do not carry it forward.

**Accessibility, resolved 2026-09-20.** The old teal failed WCAG AA badly: 2.46:1 against white in both directions. The replacement passes where it matters. `primary` #154474 is 9.95:1 on white. `accent-dark` #288472 carries white text at 4.53:1, clearing the 4.5:1 bar for normal text, which is what a 16px button label is. `charcoal` #393B38 is 11.31:1. The raw `accent` #32A38D remains 3.11:1, which is why it is restricted to fills and large display type. Run the compliance-ada gate on the new build to confirm these hold in context.

## Typography

One family, Inter, for everything: headings, body, labels, and buttons. Decided by Mical on 2026-11-20 (closes D1), following the RFI page. Poppins, Montserrat, and Lato are retired.

Inter must ship with the page, self-hosted or from Google Fonts, in weights 400, 500, 600, and 700. The RFI page names Inter but never loads it, so its visitors actually see Segoe UI on Windows and Arial on a Mac, and several of its elements name Segoe UI first. Do not repeat either mistake.

Scale, read from the RFI page's computed styles on 2026-11-20 (site-derived):

- `headline`, H1: 36px Bold, tight 1.1 line height, slightly negative tracking. One per page, in the masthead.
- `headline-2`, H2: 18px Medium. Card titles such as "Your pharmacy", and numbered step titles beside a step badge.
- `headline-sub`, H3: 14px Medium, all caps, tracked out. Small group labels inside a card.
- `eyebrow`: 12px Semibold, all caps, widely tracked. The masthead's top row (brand name, status or deadline).
- `body`: 16px Regular. Running text.
- `body-sm`: 15px Regular. Form field values, the masthead description line, list items.
- `label`: 13px Regular. Field labels and helper text under fields.
- `button`: 16px Regular.

This scale is sized for a working tool page. If a marketing hero needs a larger H1, add it as its own token at build rather than stretching `headline`.

Uppercase and italic have no tokens. Uppercase is for `eyebrow` and `headline-sub` only, never headlines or buttons. Italic is for disclaimer lines (the RFI masthead sets "These are estimates, not exact figures" in italic) and single-word emphasis.

## Layout

Taken from the RFI page (site-derived, 2026-11-20). A full-bleed dark navy backdrop holds one centered white panel, the `shell`, about 1100px wide with 28px padding. Inside the shell, top to bottom:

1. **Masthead.** A navy gradient band. A top row in `eyebrow` style carries the brand name on the left and a status or deadline on the right. Below it, the logo sits in a white `logo-tile` beside the H1, then a one-line description in `body-sm` and an italic disclaimer if needed.
2. **Cards.** Each task or topic sits in its own white `card` with an H2 title, stacked vertically with even gaps. Form fields sit in a two- or three-column grid inside the card and collapse to one column on mobile.
3. **Numbered steps.** Sequential instructions use H2-style titles led by a round navy `step-badge` carrying the number.

The only dark surfaces are the backdrop and the masthead. All other text sits on white.

Build the backdrop and masthead gradients from `primary` (#154474), darkening toward the edges, with a faint lighter glow in one corner. The RFI page builds the same gradients from its own navies (#1A3A56, #235179, #152F47, #0F2135). Do not copy those values; they are not the brand navy. White on `primary` is 9.95:1, so masthead text is safe at every size.

## Elevation & Depth

Soft, layered depth, replacing the flat style of the 2026-09-16 funnel page. Geometry observed on the RFI page:

- **Shell:** a large, soft drop shadow (0 18px 48px, about 18 percent opacity) plus a faint 1px inner highlight.
- **Masthead:** 0 12px 28px, about 18 percent opacity.
- **Cards:** a very light shadow (0 8px 20px, about 5 percent opacity) and a 1px `neutral` hairline border.
- **Logo tile:** 0 6px 16px, about 25 percent opacity, so the white tile lifts off the navy.

Tint every shadow with a dark navy, never pure black. Buttons stay flat. Within a card, hierarchy still comes from navy against white, size, and spacing.

## Shapes

Rounded, in steps taken from the RFI page: `sm` 8px for buttons and form fields, `md` 12px for the logo tile, `lg` 14px for cards, `xl` 16px for the shell and masthead, and `full` for round step badges. This settles the old 5px versus 8px button inconsistency at 8px. The logo mark itself uses softly rounded rectangles, which this scale echoes.

## Components

### Buttons (primary CTA)

- **Default:** `accent-dark` (#288472) background, white Inter Regular 16px text, 10px vertical and 16px horizontal padding, 8px radius, Title Case label. The RFI page's buttons are navy; that is one of its colors not adopted, so buttons stay green. White on this green is 4.53:1, which passes AA for a normal-weight 16px label. Do not use raw `accent` (#32A38D) here; at 3.11:1 the same label fails.
- **Hover:** no visible change was observed on the live site. Define a hover state at build, darker than `accent-dark` rather than lighter, so contrast never drops below the default state.
- **Focus:** no custom focus style was observed. The new build needs a visible focus ring, described here in words since there is no outline token; a 2px `primary` outline offset from the button is the recommended starting point.
- **Disabled:** the live registration submit shows a pale teal (#B2DFD8) with white text, which fails contrast and is built on the retired teal. Do not reuse it. Build a disabled variant against the new accent and check it before shipping.

### Form fields

White background, 8px radius, 8px by 10px padding, `body-sm` text, with a `label`-style label above each field. Field borders must reach 3:1 against white (WCAG 1.4.11). The RFI page's light gray border (#CBD5E1) is only 1.48:1 and fails, so use `text-muted` (#515151, 7.94:1) at 1px. Checkboxes and radios sit to the left of their label.

### Cards and step badges

A `card` is white with the `lg` radius, 18px padding (20px at the bottom), a `neutral` hairline border, and a light navy-tinted shadow. Card titles are `primary`; body text is `charcoal`. A `step-badge` is a 28px circle in `primary` with the step number in white Inter Bold.

### Notices

The RFI page sets warnings and confirmations as bold colored lines inside a card, for example a bold dark-red line telling the user not to upload patient identifiers. Keep the pattern: bold text that says what to do ("Do not upload...", "Your file is checked..."), never color alone. Its red and green are not tokens; choose the app's error and success values deliberately at build, and never use the logo's coral red or the brand green as a status color.

## Iconography & Imagery

### Logo

**Preferred lockup, named by Frank Tant on 2026-09-20.** The full-color mark with no wordmark: "Rx" in navy beside three upright books in navy, green, and coral red on a charcoal shelf line.

- File: `Pharmacy-Books_Logo-Primary.png`
- Path: `02_Strategy_and_Comms/Brand_Assets/Pharmacy-Books_Logo-Primary.png`
- Source: https://assets.cdn.filesafe.space/COgRLDxQx2jv6R6JbAhw/media/68a614a57bdd552c6f226c3a.png
- Format: PNG with transparency, 1024 x 543

Frank named this file as the source brand colors should come from. Resolve color from this file at build time rather than from a hex copied elsewhere.

A second, earlier export of the same mark is used in the live site header, at https://assets.cdn.filesafe.space/COgRLDxQx2jv6R6JbAhw/media/68a478abfcbcd61a6c4be41e.png (738 x 496). It is the same artwork with slightly different color values, and it is not the preferred file. Do not use it as a color source. The RFI page's masthead also uses this older export; swap in the preferred file when that page is next edited.

On dark surfaces, place the mark in a white `logo-tile` (12px radius, soft shadow), as the RFI page does, rather than directly on navy, where the navy parts of the mark disappear.

**[STRATEGIST REVIEW], still open:** there is still no full logo package, and no lockup exists that pairs the mark with a "Pharmacy Books" wordmark. Ask Frank for the package and for a horizontal lockup if one exists. Outstanding since 2026-08-07.

### Icons

No icons are used on the site today. **[STRATEGIST REVIEW]:** no source gives an icon direction. A reasonable starting point to confirm is simple flat line icons in Navy, echoing the logo's rounded geometry.

### Imagery art direction

The site has no photography, only the logo and a product video. **[STRATEGIST REVIEW]** for final sign-off, with this proposed direction drawn from the audience and the logo's clean, flat style:

- **Subject matter.** Real independent pharmacies and real owners or pharmacists at work: behind the counter, reviewing numbers on a laptop or tablet, talking with staff. Product screenshots of the app where a feature is being explained.
- **Mood and lighting.** Bright, clean, even lighting. Calm and competent, never frantic. No dramatic or dark scenes.
- **Composition and crop.** Uncluttered backgrounds, generous negative space, subject readable at a glance. Crops that leave room for Navy headline overlays on light areas.
- **HIPAA and privacy.** Never show patient names, prescription labels, screens, or paperwork with readable patient information, including in "real" photos from client pharmacies. Blur or re-shoot any image where PHI could be legible.
- **Stock do's and don'ts.** Do prefer real independent-pharmacy photos over stock. Don't use big-chain pharmacy settings, pill-bottle clichés as hero images, lab-coat stock models posed with clipboards, or AI-generated people with distorted hands or unreadable labels.

## Conversion Component Patterns

<!-- Drafted 2026-09-16 via the conversion-standards skill (Mode 3) from the live home and /registration pages. Button state styling lives in the YAML tokens; labels, routes, and form rules are prose. No Customer Personas or Offer file was populated yet, so objection mapping is provisional. -->

**Primary conversion goal (site-wide):** a paid subscription through the registration page. This supports the project goal of paying web-app subscribers. Pricing is published on the registration page: Standard at $100 per month and Concierge at $250 per month.

### CTA label to route table

| Label | Tier | Routes to |
| --- | --- | --- |
| Get Started | Primary (current) | /registration |
| Submit & Continue to Payment | Form submit | payment checkout |
| Privacy Policy | Tertiary text link | /privacy-policy |

**[STRATEGIST REVIEW]:** "Get Started" is a vague primary label under the CTA standards. Consider an outcome label such as "Start My Subscription" or "Recover What You're Owed", confirmed against Brand Voice & Tone once it is written. Each CTA needs tracking (CAT parameters where deployed). The home page currently has one CTA, below the video and out of the first viewport on most laptops; the new build should put the primary CTA in the hero and repeat it at page end.

### Standard registration form

The live registration form collects pharmacy details (name, address, business phone and email, NPI, NCPDP, state license, pharmacy software system, optional website), contact details (first and last name, role, mobile, optional pharmacist license, preferred contact method), plan choice, an optional discount code, and two required acknowledgments (a Gmail account with 2-Step Verification, and the Privacy Policy). It uses visible labels, marks required fields with an asterisk, and runs invisible reCAPTCHA.

This is roughly 20 fields on one screen, far past the three-to-five-field first-touch default. Most fields are needed for account setup, so keep them, but the new build should split the form into steps (plan choice first, pharmacy details, contact details, acknowledgments), add a progress indicator, add `autocomplete` attributes (none are set today), and put microcopy near submit that says what happens after payment. The form collects business identifiers, not PHI, but it still needs the HIPAA compliance gate before launch.

### Trust element inventory (real assets only)

| Objection (provisional) | Trust element |
| --- | --- |
| Can I trust this with my pharmacy's data? | Privacy Policy link exists. Security and HIPAA handling statement: [STRATEGIST REVIEW], not on the site yet |
| Does it work? | Product video on the home page. At least one testimonial has been collected but is UNVERIFIED and may not be published until it clears the testimonial register |
| Who's behind this? | Pharmacy-owner founder story: [STRATEGIST REVIEW], asset not on the site yet |
| What if it isn't worth it? | Monthly plans with no stated cancellation terms: [STRATEGIST REVIEW] |

Never invent testimonials, savings figures, pharmacy counts, or badges.

## Do's and Don'ts

- Do use Navy `primary` (#154474) as the anchor for headlines, body text, and structure.
- Do put content on white shells and cards. The only dark surfaces are the page backdrop and the masthead, both built from `primary`.
- Do use `accent-dark` (#288472) for every button, link, and piece of accent-colored text. Raw `accent` (#32A38D) is for fills and large display type only.
- Do resolve brand color from `Pharmacy-Books_Logo-Primary.png` at build time, never from a hex copied out of an old deliverable or a memory file.
- Don't use the retired teal #00B9AD or the retired navy #21507A anywhere. Both were site defaults, not brand colors.
- Don't use the logo's coral red (#F4443D) or its second navy (#114A81) outside the logo artwork itself. Pick a deliberate error color for the app instead.
- Don't reuse the GoHighLevel default link blue (#188BF6) or other platform default colors.
- Do use Inter for all text, and ship it with the page. Don't let Segoe UI or Arial stand in for it, and don't bring back Poppins, Montserrat, or Lato.
- Don't copy the RFI page's own colors: its navies (#235179, #1A3A56), its navy buttons, its amber deadline label, or its stock Tailwind grays (#0F172A, #334155, #64748B, #CBD5E1, #E2E8F0). Take its look, not its hex values.
- Don't show any readable patient information in imagery or product screenshots.
- Don't publish an unverified testimonial.
