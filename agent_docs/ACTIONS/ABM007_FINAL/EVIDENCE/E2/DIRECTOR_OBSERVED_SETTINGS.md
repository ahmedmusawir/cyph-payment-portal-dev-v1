# Director-observed external settings (24 November 2026, Asia/Dhaka)

**Class of evidence: DIRECTOR-OBSERVED.** Observed by the Director in the providers' dashboards and in a delivered message, and relayed in `../../SOURCES/DIRECTOR_E2_CONTINUATION_2026-11-24.md` item 2 (AM-13 (1)). These are not Engineering's API findings; those are in `EXTERNAL_SETTINGS_PLAN.md` section 2, marked ENGINEERING READ-ONLY. Nothing here was changed by anyone.

## 1. Supabase, project `CyberPharma_Dev_v1` (the DEV project both alpha apps use)

| Setting | Observed value |
|---|---|
| Magic-link subject | `Your Cyber Pharma sign-in link` |
| HTML heading | `Sign in to Cyber Pharma` |
| SMTP display name | `Cyber Pharma` |
| SMTP sender | `no-reply@cyberizedev.com` |
| Custom SMTP | Enabled, `smtp.resend.com`, port 465 |
| Site URL | `https://cyph-v1-owedbook-alpha.cyberizedev.com` |
| Allowed callbacks (exactly four) | `http://localhost:3000/api/auth/confirm`; `http://localhost:3001/api/auth/confirm`; `https://cyph-v1-owedbook-alpha.cyberizedev.com/api/auth/confirm`; `https://cyph-v1-payment-alpha.cyberizedev.com/api/auth/confirm` |
| Template body HTML | **Not in local records.** The instruction refers to original HTML supplied by the Director in this conversation; no user message in this session's transcripts (or the four other local session transcripts for this project) contains it. Searched for `{{ .TokenHash` in user messages only. See `EXTERNAL_SETTINGS_PLAN.md` 3.1 |

## 2. Resend (sending domain `cyberizedev.com`)

| Item | Observation | What it does and does not show |
|---|---|---|
| Engineering API check, 06:51:06Z | The only local Resend key is sending-only: `GET /domains` returned 401 `restricted_api_key` | Engineering could not read domain settings. Recorded limitation (ENGINEERING READ-ONLY, `agent_docs/RESPONSES/response_2026-11-24_125114_resend-domain-settings-check.md`) |
| Delivered Payment Portal sign-in email of 21 November (Director) | The link points directly to the alpha app's `/api/auth/confirm` endpoint; no tracking redirect observed | **Message-specific historical evidence.** Not proof of current domain-wide tracking settings |
| Unsaved "New tracking subdomain" setup screen (Director) | Its click-tracking box was checked | **Not evidence of saved domain state.** Nothing was saved |
| Standing instruction | No key created, no tracking enabled, no tracking subdomain configured, Forge not activated, DNS unchanged | Fresh delivered-link checks for both apps are required in the deployed-system walkthrough (`DEPLOYED_WALKTHROUGH.md` W-1, W-2) |

## 3. Stripe, the existing "Cyber Pharma" sandbox

| Setting | Observed value |
|---|---|
| Branding icon, logo | None |
| Prefer logo over icon | Unchecked |
| Brand color | `#525f7f` |
| Accent color | `#0074d4` |
| Checkout: Use brand colors | Unchecked |
| Checkout background / button | `#ffffff` / `#0074d4` |
| Checkout font | System font (default); Inter is available in the selector |
| Checkout shapes | Rounded |
| Customer portal, receipt and invoice previews | Show "Cyber Pharma" |
| Public business name | Cyber Pharma |
| Statement descriptor | CYBER PHARMA |
| Successful payment receipt email | OFF |
| Refund email | OFF |
| ACH mandate / microdeposit verification email | ON |
| Support email | `sandbox@accessible.stripe.com` |
| Sending domain | `stripe.com` |

Stripe labels some business details as **substituted sandbox test data** (for example the support email and business URL). They are not production business facts and are not proposed for change.

**Engineering note on the two colors (not an observation):** the account API returns `settings.branding.primary_color` and `secondary_color` as **null** (`EXTERNAL_SETTINGS_PLAN.md` 2.1). The `#525f7f` and `#0074d4` the Dashboard shows are therefore most likely Stripe's displayed defaults for unset fields, not saved values. This matters for rollback (3.4).
