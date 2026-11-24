# External settings: findings, application plan and rollback (E2 completion)

**Nothing here has been applied.** The dashboard-write prohibition stands (AM-13 (3)). Engineering made read-only GET requests only. The Director applies every change below, in session S2, after deployment where the order says so. Identifiers are shown by their last six characters; no key, token or secret appears in this file.

Evidence classes: **ENGINEERING READ-ONLY** (this file, section 2) and **DIRECTOR-OBSERVED** (`DIRECTOR_OBSERVED_SETTINGS.md`). Stripe documentation was read on 24 Nov 2026 (section 2.4).

## 1. Summary

| Provider | State of the plan | Blocker |
|---|---|---|
| Supabase sign-in template (DEV) | Subject and sender display name: ready, exact. Body heading: one known string ready. **Whole-body line diff: blocked** | The original template HTML (X-1a) is not in local records |
| Resend | No change proposed | Domain tracking settings unreadable with the sending-only key; fresh delivered-link checks required (walkthrough W-1, W-2) |
| Stripe account branding | Ready (Dashboard only) | None |
| Stripe Checkout styling | Ready (Dashboard only) | None |
| Stripe customer portal (the app's configuration) | Ready (API only for this configuration) | Director to confirm alpha's configured ID ending (3.0) |

## 2. Engineering read-only findings

### 2.1 Stripe account (GET `/v1/account`, 2026-11-24T07:39:09Z, the Portal's local sandbox key)

| Field | Value |
|---|---|
| Account | `acct_…Dyu3RR`, type standard, US, USD; equals the Portal's `STRIPE_EXPECTED_ACCOUNT` |
| Mode | Test key (`sk_test_`); every configuration below is `livemode: false` |
| `business_profile.name` | Cyber Pharma |
| `business_profile.url` | `https://accessible.stripe.com` (sandbox substitute data) |
| `settings.dashboard.display_name` | Cyber Pharma |
| `settings.payments.statement_descriptor` | CYBER PHARMA |
| `settings.branding` | `icon: null, logo: null, primary_color: null, secondary_color: null`: **nothing is saved**. The Dashboard's `#525f7f` and `#0074d4` (Director-observed) are therefore displayed defaults |

### 2.2 Which account and portal configuration alpha uses

**Code trace (Portal, unchanged files):**

- `src/app/api/billing/portal/route.ts` → `openBillingPortal()` in `src/server/billing.ts:105`.
- That calls `createPortalSession(customer, stripeNames().portalConfiguration, <origin>/billing)` at `src/server/billing.ts:99`. It passes the configuration as a required argument to `stripe().billingPortal.sessions.create({ customer, configuration, return_url })` and refuses any value not starting `bpc_`. The comment says: "there is no path that falls back to the account default".
- `stripeNames()` (`src/server/stripeClient.ts:21`) reads it from `STRIPE_PORTAL_CONFIGURATION`. `assertStripeAccount()` refuses to run unless the key's account equals `STRIPE_EXPECTED_ACCOUNT`. `assertPortalConfiguration()` (`billing.ts:114`) refuses a configuration that is inactive, in live mode, or not restrictive.
- **So alpha supplies an explicit configuration ID and never uses the account default.**

**Where alpha's values come from.** `cloudbuild.yaml:104` mounts `STRIPE_PORTAL_CONFIGURATION` and `STRIPE_EXPECTED_ACCOUNT` from Secret Manager (`cyph-payment-alpha-stripe-portal-configuration`, `cyph-payment-alpha-stripe-expected-account`). `upload-secrets.sh` fills those secrets from the Portal's `.env.local`, and the Director runs it. The local `.env.local` was last modified on 20 Nov at 09:39 (+06), before the deployment preparation of 21 Nov.

**Configurations in the sandbox** (GET `/v1/billing_portal/configurations`, same time; 2 of 2, `has_more: false`):

| ID ending | Default | Headline | Features | Used by |
|---|---|---|---|---|
| `…diVXwt` | no | "Cyber Pharma — OwedBook billing" | cancel at period end; no plan change; no customer-detail change; payment method update; invoice history | **The local `.env.local` value**, so the value uploaded to alpha's secret |
| `…3rwV9q` | **yes** | "E1_ONLY probe portal" | same features | Nobody in code (the account default; never used, see above) |

**Not verified by Engineering:** the current value of alpha's Secret Manager secret. Engineering does not read secret values, and `gcloud` here needs an interactive re-login. Both configurations pass the app's own guard, so the guard cannot tell them apart. **Director check (3.0) before applying.**

### 2.3 Resend

The only local Resend key is sending-only: `GET /domains` returned 401 `restricted_api_key` at 06:51:06Z. Domain settings (verification, `click_tracking`, `open_tracking`, `tracking_subdomain`) were not read. This limitation stays recorded.

### 2.4 What Stripe supports (official documentation, read 24 Nov 2026)

| Surface | Controls | How set | Source |
|---|---|---|---|
| **Account branding** (whole account) | Icon: emails, Checkout and Payment Links, customer portal, hosted invoice page, invoice PDFs. Logo: Checkout and Payment Links, customer portal, invoice PDFs. Brand color: emails, customer portal, hosted invoice page, invoice PDFs. Accent color: emails (as background), Checkout, customer portal, hosted invoice page | **Dashboard only** for one's own account: "Connect platforms and non-Connect users can't configure their own branding using the Accounts API. They need to use the Dashboard." Files: JPG or PNG, under 512 KB, at least 128 × 128 px; icon square | docs.stripe.com/get-started/account/branding |
| **Checkout appearance** | Background color, button color, font (Inter is offered), shapes (rounded, pill, rectangular) | Dashboard (Settings, Branding, Checkout); or per session through `branding_settings` on Checkout Session create | docs.stripe.com/payments/checkout/customization/appearance; docs.stripe.com/api/checkout/sessions/create |
| **Customer portal configuration** | `business_profile.headline` (60 characters at most), `privacy_policy_url`, `terms_of_service_url`; `default_return_url`, `features`, `login_page`, `name`. No font, shape or color fields: the look comes from account branding | API; "The Dashboard supports creating and updating the default configuration. You can only manage other configurations using the" API | docs.stripe.com/api/customer_portal/configurations/update; docs.stripe.com/customer-management/integrate-customer-portal |

**Font scope.** The docs state the Checkout font for Checkout. They do **not** state that it applies to invoices, receipts or Stripe's emails, and "Invoices from a Checkout Session still use the branding settings set in the Dashboard." The customer-portal page lists "Font" and "Shapes" among portal customisation, while the account branding page does not. That conflict is checked on the portal preview (S-step 6). Inter is **not** claimed for any surface except Checkout.

**Not adopted:** Checkout Session `branding_settings` (per-session font, border style, colors, logo) would need a change to payment code in `src/server/**`. That path is protected and the contract forbids it (no Stripe code change).

## 3. Application plan (Director, in order; S2 unless marked)

### 3.0 Pre-check (Director, read-only)

Confirm alpha uses `…diVXwt`. Print only the last six characters of the secret, for example `gcloud secrets versions access latest --secret=cyph-payment-alpha-stripe-portal-configuration --project cyberize-nextjs-staging | tail -c 6`, and expect `diVXwt`. If the ending differs, stop and record it: section 3.3 then targets the configuration alpha actually uses.

### 3.1 Supabase DEV "Magic Link" template and SMTP sender (Dashboard; after deployment, because the template is shared with alpha)

| # | Setting | Original (Director-observed) | Proposed | Rollback |
|---|---|---|---|---|
| E-1 | Magic Link **subject** | `Your Cyber Pharma sign-in link` | `Your Pharmacy Books sign-in link` | Paste the original back |
| E-2 | SMTP **sender display name** | `Cyber Pharma` | `Pharmacy Books` | `Cyber Pharma` |
| E-3 | SMTP sender **address** | `no-reply@cyberizedev.com` | **unchanged** | — |
| E-4 | Body **heading text** | `Sign in to Cyber Pharma` | `Sign in to Pharmacy Books`: the visible text only; the element, its attributes and its position are unchanged | Original body pasted back from the saved copy |
| E-5 | Any other visible "Cyber Pharma" text in the body | Unknown | Same visible-text replacement | Same |
| — | Everything else: every `{{ if }}`/`{{ else }}` branch around `.RedirectTo` and `.SiteURL`, the callback paths, `{{ .TokenHash }}`, `type=email`, the `&amp;` escaping, the no-link fallback wording, link count, Site URL and the four callbacks | As exported | **Unchanged** | — |

**Blocked part (S-1 narrowed):** the original template HTML (X-1a) is not in local records, so E-4 and E-5 cannot be written as a line diff and AC-E01 cannot be claimed. Nothing was reconstructed. Once the HTML is supplied, Engineering writes the body with only E-4 and E-5 changed, plus a line diff proving that.

**Director's apply rule:** before pasting, save the current subject and body as the rollback copy. After pasting, confirm the body still contains `{{ .TokenHash }}`, `type=email` and `&amp;` exactly as before. Then run W-1 and W-2 in `DEPLOYED_WALKTHROUGH.md`.

### 3.2 Stripe account branding and Checkout (Dashboard, sandbox only)

| # | Setting (Dashboard place) | Original | Proposed | Rollback |
|---|---|---|---|---|
| S-1a | Branding: **Icon** | none (API `null`) | Upload `src/app/icon.png` (512 × 512 PNG, 62,585 bytes, SHA-256 `04d61e4c…755bd`) | Remove the icon |
| S-1b | Branding: **Logo** | none (API `null`) | Upload `public/brand/pharmacy-books-logo-primary.png` (1024 × 543 PNG, 321,101 bytes, the unaltered master, SHA-256 `e7e5d357…3293afd`) | Remove the logo |
| S-1c | Branding: **Prefer logo over icon** | unchecked | Checked, so Checkout and the portal show the full wordmark. Decide on the preview | Uncheck |
| S-1d | Branding: **Brand color** | `#525f7f` shown, nothing saved | `#288472` (action green) | Set `#525f7f` again. The field was unset before, so this restores the look, not the unset state |
| S-1e | Branding: **Accent color** | `#0074d4` shown, nothing saved | `#154474` (navy) | Set `#0074d4` again (same note) |
| S-2a | Checkout: **Use brand colors** | unchecked | **Unchanged** (Checkout keeps its own background and button) | — |
| S-2b | Checkout: **Background** | `#ffffff` | **Unchanged** `#ffffff` | — |
| S-2c | Checkout: **Button** | `#0074d4` | `#288472` | `#0074d4` |
| S-2d | Checkout: **Font** | System font (default) | **Inter** | System font (default) |
| S-2e | Checkout: **Shapes** | Rounded | **Unchanged** Rounded (the supported option nearest the 8 px radius) | — |
| S-3a | Public details: **Public business name** | Cyber Pharma | **Pharmacy Books** (P-06). Customer-facing name only, not the legal name | Cyber Pharma |
| S-3b | Statement descriptor | CYBER PHARMA | **Unchanged** (P-05 deferred) | — |
| S-3c | Support email, business URL | Sandbox substitute data | **Unchanged** | — |
| S-3d | Dashboard display name | Cyber Pharma | Unchanged (internal) | — |
| S-4 | Customer emails: successful-payment receipt OFF, refund OFF, ACH verification ON | as observed | **Unchanged** (email enablement is out of scope) | — |

Brand color `#288472` with white text measures 4.53:1, the same pair the apps' buttons use. With an accent of `#154474`, Stripe chooses its own text color on the email background, and that is judged on the preview (W-6).

### 3.3 The app's customer-portal configuration (API only; sandbox)

| # | Field | Original | Proposed | Rollback |
|---|---|---|---|---|
| S-5 | `business_profile.headline` on `bpc_…diVXwt` | `Cyber Pharma — OwedBook billing` | `Pharmacy Books — Account & Billing` (34 characters) | The original string |

**Apply (Director, own terminal; the key stays in the environment, never typed into chat):** `curl https://api.stripe.com/v1/billing_portal/configurations/<full bpc id> -u "$STRIPE_SECRET_KEY:" -d "business_profile[headline]=Pharmacy Books — Account & Billing"`.

**Read back immediately:** `GET` the same configuration and confirm all of the following:
- the headline changed;
- `features` are unchanged: cancel at period end, no plan change, no customer-detail change, payment method update and invoice history on;
- `active: true` and `livemode: false`.

The docs do not say whether a partial `business_profile` update keeps the omitted fields, so this read-back is required. If anything else changed, reapply the original values and record it. **Do not touch** the default probe configuration `…3rwV9q`, any feature, the prices or any subscription.

### 3.4 Order and rollback summary

1. 3.0.
2. 3.2 and 3.3 at any time in the sandbox, because they change only Stripe-hosted pages.
3. Screenshot the four previews before and after: Checkout, customer portal, invoice, receipt.
4. 3.1 only after both apps are deployed, because the template is shared with alpha and localhost.
5. Run `DEPLOYED_WALKTHROUGH.md`.

Rollback for each row is given in that row. Every Stripe change is sandbox-only and must be applied again separately on the live account at production readiness.

## 3.1 update (24 Nov, AM-16): S-1 closed for preparation

The original HTML was supplied, and the amended body and its one-line diff are prepared in `email/` (`email/README.md`). Only the heading's visible text changes (E-4). There was no other visible "Cyber Pharma" in the body, so E-5 has nothing to change. Subject (E-1) and display name (E-2) are as above; the address is unchanged. Applying it is still the Director's step in S2, after deployment. The rollback copy is `email/DEV_MAGIC_LINK_TEMPLATE_ORIGINAL.html`.
