# EMAIL_AND_STRIPE — ABM007_FINAL

**Version:** 1.1-review (Architect amendment A-03 applied) · **Date:** 23 November 2026. Scope under D-10: presentation of existing email templates, and Stripe's supported hosted branding controls. Facts are from the Engineer's recon sections 6 and 7 unless marked.

## 1. Sign-in email (one Supabase template, four uses)

One Supabase-hosted "Magic Link" template on the DEV project serves ordinary sign-in in both apps, the access email after a purchase, and OwedBook store invitations. Account & Billing has no invitation feature (the recon found none), and this module does not add one. It is shared by localhost and both alpha apps. Its live body is not in either repository.

**Consequences**
- Wording stays generic. Purpose-specific copy would need different sending code, which is out of scope.
- One edit changes mail for local and alpha at once.

**Must not change** (recon 6.3)
1. The link is built from `{{ .RedirectTo }}` plus `?token_hash={{ .TokenHash }}&type=email`. Never `{{ .ConfirmationURL }}`.
2. Every conditional branch, exactly, including the no-link message for unlisted destinations.
3. The parameter names `token_hash` and `type`, and `type=email`.
4. `&amp;` inside the HTML attribute. An editor that "fixes" it breaks the link.
5. One link only. No second link, no "one click and you're in" wording: the link opens a page with a button.
6. No link rewriting or click tracking at the mail provider.
7. Invitations carry no "accept" link of their own; the destination logic is in code.
8. Token lifetime and rate limits are settings and are left alone.

**May change:** subject wording, sender display name, heading and paragraph text, a hosted logo image, colors and button styling of the existing link, footer text. All inside the existing branches. The green-links-on-white rule applies in email too.

**Expectation for email rendering:** many mail apps ignore web fonts, so Inter falls back to a system font. The logo is a hosted image and may be blocked until the reader allows images. Acceptance is names, logo, colors and layout, not a pixel match.

**Sequence**

| Step | Owner | When |
|---|---|---|
| Export, without changing anything: full template body and subject; Site URL and redirect allow-list; SMTP sender name and address; whether the other templates are still defaults. Same for SCRATCH if it will be restyled | Director (session S1), led step by step by the QA Lead | Before the Engineer prepares the email body |
| Confirm click tracking is off for the sending domain at the mail provider | Director (S1) | Same session |
| Prepare the restyled body and subject from the export; produce a line diff showing only presentation changed | Engineer | During engineering |
| Review the diff (AC-E01) | QA Executor, then QA Lead | Q2 |
| Keep the old body ready to paste back; apply the new body and subject | Director (session S2) | After deployment, because the logo image is served by the deployed app |
| The delivery checks in section 1.2 (AC-E02) | Director with the QA Lead, one check at a time | Straight after applying |

Proposed subject: "Your Pharmacy Books sign-in link". Proposed sender display name: "Pharmacy Books". The sending address and domain do not change in this module.

### 1.2 Delivery acceptance matrix (AC-E02)

Two scopes, kept apart:

- **Local SCRATCH QA (Gate Q).** The QA Executor's emailed sign-ins and the Member invitation in AC-R04 run on QA builds against the SCRATCH project, with SCRATCH's own template. They prove the flows still work on the candidate. They say nothing about the restyled DEV template.
- **Deployed DEV verification (Gate D).** The rows below. They run only after deployment and after the Director applies the restyled template on the DEV project, which serves both alpha apps and DEV-backed local builds.

| # | Check | Destination | Required |
|---|---|---|---|
| E02-1 | Emailed sign-in to OwedBook; the page's button completes sign-in; the user lands in OwedBook | Alpha OwedBook callback | Yes |
| E02-2 | Same | Local OwedBook callback (DEV-backed local build) | Yes |
| E02-3 | Emailed sign-in to Account & Billing; lands in Account & Billing | Alpha Account & Billing callback | Yes |
| E02-4 | Same | Local Account & Billing callback (DEV-backed local build) | Yes |
| E02-5 | Existing OwedBook store invitation: sent from a store's people page, mail arrives, invited person signs in, shows as accepted, sees only that pharmacy | Alpha | Yes |
| E02-6 | Same | Local OwedBook | Where the local build supports it. If it does not, the row is recorded NOT SUPPORTED with what was seen. It is not recorded as passed |

Every row also confirms the mail shows the approved names, logo and colors, has exactly one link, and that the link opens a page with a button.

**Not in the matrix.** An "invitation in Account & Billing" does not exist. The **post-purchase access email** uses the same template, so its look follows the same edit; its delivery is not claimed here. It may be recorded only from an already authorized purchase journey (for example the QA Executor's approved first-pharmacy purchase on SCRATCH, which shows SCRATCH's template) or from existing evidence with its source and date. No purchase is authorized to produce it.

**Project, fixture and effects for the Gate D rows**

| Item | Value |
|---|---|
| Project | The DEV Supabase project (the one the two alpha services use). Not SCRATCH |
| Operator | The Director, at his own inboxes, with the QA Lead leading. Agents do not receive links or codes |
| Sign-in rows (E02-1 to E02-4) | Any existing Director-controlled account. The rehearsal account may be used to **sign in only**; signing in changes none of its pharmacies, invoices or history |
| Invitation rows (E02-5, E02-6) | The **Gate D invitation fixture**: an existing alpha Owner account with one pharmacy that is not the rehearsal account, named by the Director before session S2 and recorded in `QAM/GATE_D_PLAN.md`. Status: PENDING the Director's nomination. If no such account exists, the invitation rows are BLOCKED and the Director decides; no account is bought to create one |
| Permitted effects | Up to eight sign-in emails; up to two invitations; up to two new Member memberships on the fixture pharmacy. Afterwards the invited Members are removed with the product's own remove flow, and that is recorded |
| Not permitted | Any purchase, any removal or re-add of a pharmacy, any change to the rehearsal account's pharmacies, invoices or history, any dashboard change other than the template apply in S2, any token or callback setting change |
| Local builds for E02-2, E02-4, E02-6 | DEV-backed local builds of each app, started by the Director for these rows only. No Stripe listener is started and no billing action is taken, so the one-consumer rule in the paths contract is kept |
| Rollback | The exported original body and subject are kept ready. If a required row fails because of the template, the Director pastes the original back and the row is recorded FAIL with what was seen |

Results stay PENDING until observed. Nothing in this pack records a delivery as having happened.

## 2. Billing notices (Portal, in code)

`src/server/billingNotices.ts` sends two plain-text notices through the mail provider's API: payment failed, and read-only warning. No HTML part exists.

**In scope (PROPOSED P-07):** replace "Cyber Pharma" with the approved names in the default sender display name, both subjects and the closing line. Nothing else.

**Must not change:** the single link to `/billing`; the idempotency key shape (`<kind>/<invoice id>`); when notices are sent; the plain-text format.

**Known side effect:** the stored fingerprint of subject plus text changes with the wording.

**Deployment timing:** a notice that is mid-retry when the wording changes would be re-sent under the same key with a different body. How the provider answers that was not verified. The wording goes live only when a read-only check shows no notice claimed or retrying (AC-E03). The scheduler is not enabled on alpha, so this is expected to be empty; it is still checked and recorded.

**Not evidenced:** that any notice has ever been delivered on alpha.

## 3. Stripe (sandbox "Cyber Pharma")

**Integration facts:** only the Portal has Stripe code. It uses Stripe-hosted Checkout and the hosted customer portal, and sends no branding parameter on any call, so hosted pages look exactly as the account is configured. Prices are enforced in server code. No code change is needed or allowed for branding.

**Today (read-only, 23 Nov):** logo, icon and both brand colors are not set. Public business name, dashboard name and statement descriptor say "Cyber Pharma". One billing-portal configuration has the headline "Cyber Pharma — OwedBook billing"; the account-default configuration is an old probe ("E1_ONLY probe portal"). Which one alpha uses is held in a secret and was not read. The default being a probe does not show that alpha uses it.

**What Stripe's branding screen offers** (Stripe's customer-portal documentation, read 23 Nov 2026): logo and icon, background color, button color, font, shapes. Branding for an ordinary account is set in the Dashboard, not through the API. A sandbox is isolated from the live account.

**Session S1, read-only (Director):**
1. Settings, Branding: the font list (is Inter offered), shape options, background control, accepted file types and sizes.
2. The four previews: Checkout, customer portal, invoice, receipt. Screenshot each as the baseline.
3. Which customer emails Stripe sends in this sandbox.
4. Public business details as customers see them.
5. Which billing-portal configuration alpha uses: compare the stored identifier's ending with the two configurations.
6. Invoice template text.

**Values the Engineer prepares:**

| Setting | Value | Standing |
|---|---|---|
| Logo | the master PNG | D-06 |
| Icon | the 512 px square icon | D-06 |
| Button (brand) color | #288472 | Brand contract |
| Background or accent color | white, or navy #154474, chosen on the preview | The Director decides on the preview |
| Font | Inter if offered; otherwise the nearest offered, recorded as a known difference | Not verified |
| Shape | rounded, nearest to 8px | Not verified |
| Public business name | Pharmacy Books | PROPOSED P-06 |
| Billing-portal headline (the configuration alpha uses) | "Pharmacy Books — Account & Billing" | PROPOSED P-06 |
| Product name | unchanged: "OwedBook — pharmacy stores" | Already uses an approved name |
| Statement descriptor | unchanged in this module | PROPOSED P-05; needs its own ruling (D-03) |

**Session S2, apply (Director):** apply the values; screenshot the four previews again; open the billing portal for an existing QA fixture customer and confirm the look. No new purchase (AC-E04).

**Carried to production readiness:** the same settings must be applied again on the live Stripe account. Branding and email settings affect everything that account shows and sends.

## 4. Stripe-sent mail

Which receipts and invoice emails Stripe sends in this sandbox is a dashboard setting, not read yet (S1 item 3). Their look follows the account branding above.

## 5. What independent QA can and cannot judge here

- **Can, at Gate Q:** the prepared email diff (AC-E01); the notice source change (AC-E03 source part); that no Stripe code changed (AC-R03).
- **Cannot, until after deployment and the Director's sessions:** live email delivery and appearance on the DEV project (AC-E02, section 1.2), the Stripe previews (AC-E04). These are recorded as Director-observed with the QA Lead leading the session, and are judged at the alpha verification stage under `QAM/GATE_D_PLAN.md`.
