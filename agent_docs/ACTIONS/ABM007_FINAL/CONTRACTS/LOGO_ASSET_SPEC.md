# LOGO_ASSET_SPEC — ABM007_FINAL

**Version:** 1.1-review (Architect amendment A-02 applied) · **Date:** 23 November 2026. Decision D-06: we build the logo and icon package ourselves from the preferred supplied PNG.

## 1. The master

| Field | Value |
|---|---|
| File named by Frank | `Pharmacy-Books_Logo-Primary.png` |
| Public address | `https://assets.cdn.filesafe.space/COgRLDxQx2jv6R6JbAhw/media/68a614a57bdd552c6f226c3a.png` |
| Format | PNG, 1024 x 543, RGBA with real transparency, 321,101 bytes |
| SHA-256 (Engineer's recon, 23 Nov; matched by the Architect's supplied copy and by the copy in this package) | `e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd` |
| Artwork box inside the canvas | 729 x 474 px, transparent margin on all sides, aspect about 1.54 to 1 |

**The master is in this package** at `DESIGN/assets/Pharmacy-Books-Logo-Primary.png`, supplied by the Architect with review 01 and checked by the author: 321,101 bytes, 1024 x 543, the hash above. The design references use it unaltered, scaled whole inside a white tile. The Engineer places **this file**, byte for byte, re-checks the hash after placing it, and does not fetch another copy. A different hash is a stop.

Final icon exports (app icon, touch icon, favicon, email and Stripe files) are still engineering deliverables made under the rules below. None exists yet.

## 2. Rules

1. The artwork is never redrawn, recolored, re-traced, cropped to a part, or generated.
2. Allowed operations: whole-image scaling, and padding with transparent or white pixels to fit a canvas.
3. Brand colors come from the approved tokens, never from sampling the logo. The logo's coral red and its second navy are logo artwork only.
4. No file is called a vector master. If an SVG wrapper around the PNG is ever made, it is named and described as a raster wrapper.
5. Anything that alters the mark, including a reconstructed vector, needs the Director's visual approval first.
6. On navy surfaces the logo sits in a white tile with a 12px radius and the tile shadow. The tile is page styling, not part of the image.
7. The older export used in the live site header is not used.

## 3. The package

| Asset | Path (both repositories unless noted) | How it is made | Used by |
|---|---|---|---|
| Master | `public/brand/pharmacy-books-logo-primary.png` | The supplied file, byte for byte | Everything below |
| Header logo | rendered from the master with `next/image` inside the CSS tile | No new file | OwedBook `Navbar`, `NavbarHome`, `NavbarLoginReg`; Portal `Brand.tsx`; mastheads |
| Wordmark | live text "Pharmacy Books" with the app name on a second line | No file | Headers |
| App icon | `src/app/icon.png`, 512 x 512 | Master scaled to fit a square white canvas with even padding | Browser tab |
| Apple touch icon | `src/app/apple-icon.png`, 180 x 180 | Same method | iOS home screen |
| Favicon | `src/app/favicon.ico`, 16, 32 and 48 px | Same method | Older browsers. Adds the file OwedBook lacks |
| Email logo | the master, or a copy scaled to about twice its display size, served from the deployed alpha app's public path | Scaling only | Sign-in email template |
| Stripe logo and icon | the master and the 512 px square icon | Uploaded by the Director | Stripe branding screen |

Usage notes the Engineer records beside the files: source (this package's copy), hash, date placed, each derived file's size and the exact command that produced it.

## 4. Two points for the Director

| Point | Recommendation |
|---|---|
| **Small-size legibility.** The mark is wide with fine detail. At 16px in a browser tab it will be hard to read. | Accept it for this release. A crop to the "Rx" or the books alone would alter the artwork and is not proposed. If the Director wants a tighter icon, that is an altered-mark approval under rule 5 |
| **Trimming the transparent margin** before scaling makes the mark larger in a tile or icon. It does not touch the artwork, but it changes the supplied file's framing. | Allow trimming for **derived** files only, never for the master. Recorded as PROPOSED; without approval the Engineer scales the full canvas |

## 5. Leftovers

Listed for a removal decision, not deleted by this module: `logo-color.svg`, `logo-lockup.svg`, `logo-mono.svg` in both repositories, `public/next.svg` and `public/vercel.svg` in OwedBook, `public/favicon-512.png` in the Portal. After this module no source file may reference the three old logo files (AC-N02).

## 6. Not verified

- Stripe's accepted file types, sizes and any square requirement for the icon. Read from the Stripe branding screen in the Director's read-only session.
- That a logo under `public/` is reachable without sign-in on the deployed alpha. Both apps' route matchers exclude image paths (recon 5.3), so it should be; not requested live.
