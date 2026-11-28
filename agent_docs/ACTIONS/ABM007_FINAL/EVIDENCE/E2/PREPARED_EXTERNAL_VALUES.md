# Prepared external values (plan step 9; EMAIL_AND_STRIPE.md; AM-09 (F))

Nothing here was applied. The Director applies dashboard settings in session S2; Engineering changed no dashboard.

## 1. Sign-in email body and subject (AC-E01) — NOT DONE

| Item | State |
|---|---|
| Input needed | X-1: the Director's unchanged export of the live DEV "Magic Link" template (body and subject), Site URL and redirect allow-list, SMTP sender name and address, whether other templates are defaults (session S1) |
| Received | No |
| Done | Nothing. The live template is not in either repository and was **not reconstructed** (AM-09 (F)). No body, subject or line diff exists |
| AC-E01 | **Not claimed** |
| Ready when the export arrives | Restyle inside the existing branches only: keep `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=email`, every conditional, parameter names and the `&amp;`; one link; hosted logo `https://<alpha OwedBook origin>/brand/pharmacy-books-logo-primary.png` (served publicly: image paths are outside both apps' route matchers); button `#288472` with white text; heading navy `#154474`; body charcoal `#393B38`; Inter with system fallback. Proposed subject "Your Pharmacy Books sign-in link"; sender display name "Pharmacy Books" (address unchanged). Then a line diff against the export |

## 2. Stripe sandbox branding (AC-E04 prepared values; P-06)

| Setting | Prepared value | Standing |
|---|---|---|
| Logo | `public/brand/pharmacy-books-logo-primary.png` (the master; SHA-256 `e7e5d357…3293afd`; 1024 x 543 PNG) | D-06. Stripe's accepted sizes not yet read (X-3) |
| Icon | `src/app/icon.png` (512 x 512, full canvas on white; SHA-256 `04d61e4c…755bd`) | D-06; AM-08 (2) |
| Brand (button) color | `#288472` | Brand contract |
| Accent / background color | White `#FFFFFF`, or navy `#154474`; the Director chooses on the preview | Director |
| Font | Inter if offered; otherwise the nearest offered (record the difference) | Not verified (X-3) |
| Shape | Rounded, nearest to 8px | Not verified (X-3) |
| Public business name | Pharmacy Books | P-06 approved (AM-08 (1)) |
| Billing-portal headline (the configuration alpha uses) | Pharmacy Books — Account & Billing | P-06; which configuration alpha uses is still unknown (X-3) |
| Product name | Unchanged: "OwedBook — pharmacy stores" | Already an approved name |
| Statement descriptor | Unchanged ("CYBER PHARMA") | P-05 deferred (AM-08 (1)) |

Help text that depends on Stripe (H-6, the return link) is worded so it does not quote a Stripe label; it is confirmed on the Stripe preview in S1/S2.

## 3. Billing notices

Applied in code (the one permitted server exception; `src/server/billingNotices.ts` lines 12, 26, 29, 33, 36). Deployment timing: the wording goes live only after the read-only check that no notice is claimed or retrying (AC-E03 deployment part, G-2), which needs its own release.

## Superseded (E2 completion, 24 Nov)

Sections 1 and 2 are superseded by `EXTERNAL_SETTINGS_PLAN.md`. That file adds the Director-observed originals (`DIRECTOR_OBSERVED_SETTINGS.md`), Engineering's read-only Stripe findings, documentation-verified controls, exact proposed changes and rollback. Section 1's input X-1 is narrowed to X-1a: the original template HTML. The subject, sender name and heading are now known from the Director's observation.
