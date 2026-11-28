# Director instruction: continue and complete E2 (24 November 2026, Asia/Dhaka, received about 13:34)

Preserved verbatim by the Engineer as received in the Claude Code session. It carries the Architect's source-review findings and confirmation (relayed) and the Director's own dashboard inspection. The Director-observed settings below are the Director's observations, not Engineering's API findings.

---

```
Continue ABM007_FINAL E2 in the current session across both repos:

/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1
/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev

Read your existing E1/E2 records, the installed ABM007_FINAL contract,
amendments, allowed-path rules and current stop register before editing.
Preserve existing work. This is E2 completion, not a new recon round.

Tony retains git authority. Do not stage, commit, push, merge, switch
branches, reset, stash or discard changes. Do not deploy.

1. FINISH THE SOURCE REVIEW CORRECTIONS

A. Surface-aware keyboard focus
The Architect found that `.pb-on-dark :focus-visible` can force a white
outline onto controls inside nested white surfaces.

Inspect both apps, including Portal public form cards and OwedBook's
mobile navigation. Make focus indicators contrast with the actual
surface underneath. Cover nested light and dark surfaces, keyboard
navigation and responsive menus. Do not merely change every outline
to one global color.

B. Help mobile role table
The OwedBook Help role table currently uses a minimum-width table
inside horizontal scrolling. Implement the contract's readable mobile
presentation at 375px, preserving accessible structure and all content.

C. Remaining legacy logo reference
The Architect identified:
src/components/portal/references/EmailPreview.tsx

Inspect the outstanding reference and report its exact one-line diff
from /logo-color.svg to the approved primary brand asset. If the current
allowed-path rules exclude this file, keep this as a narrowly scoped
proposed exception; do not silently expand scope or delete reference
modules. Continue all other authorized work.

D. Help authorization interpretation
Architect confirmation: existing Member redirection away from
/admin-portal to /owedbook is expected behavior. Preserve the guard.
Attribute this interpretation to the Architect in the records, and
retain independent QA verification.

2. INCORPORATE THE DIRECTOR'S DASHBOARD INSPECTION

Evidence date: 24 November 2026, Asia/Dhaka.
Record these as Director-observed settings, not your own API findings.

SUPABASE — CyberPharma_Dev_v1
- Magic-link subject: Your Cyber Pharma sign-in link
- HTML heading: Sign in to Cyber Pharma
- SMTP display name: Cyber Pharma
- SMTP sender: no-reply@cyberizedev.com
- Custom SMTP enabled, smtp.resend.com, port 465
- Site URL: https://cyph-v1-owedbook-alpha.cyberizedev.com
- Four exact allowed callbacks:
  http://localhost:3000/api/auth/confirm
  http://localhost:3001/api/auth/confirm
  https://cyph-v1-owedbook-alpha.cyberizedev.com/api/auth/confirm
  https://cyph-v1-payment-alpha.cyberizedev.com/api/auth/confirm

Use the original HTML supplied by Tony in this conversation as the
template baseline. If it is not available in your local records, flag
that specific missing input; do not reconstruct it from memory.

Prepare the minimal naming amendment to Pharmacy Books. Preserve all
RedirectTo branches, callback URLs, TokenHash variables, type=email,
HTML escaping, fallback behavior and sender email address.

RESEND
Your sending-only API credential could not retrieve domain settings.
Keep that limitation recorded.

Director inspected a delivered Payment Portal sign-in email dated
21 November. Its link points directly to the alpha app's
/api/auth/confirm endpoint. No tracking redirect was observed in that
message. This is message-specific historical evidence, not proof of
current domain-wide tracking settings.

The Director opened an unsaved "New tracking subdomain" setup screen.
Its checked click-tracking box is not evidence of saved domain state.

Do not create a key, enable tracking, configure a tracking subdomain,
activate Forge or change DNS. Require fresh delivered-link checks for
both apps in the deployed-system walkthrough.

STRIPE — EXISTING CYBER PHARMA SANDBOX
Observed baseline:
- No branding icon or logo
- Prefer logo over icon unchecked
- Brand color #525f7f
- Accent color #0074d4
- Checkout: Use brand colors unchecked
- Checkout background #ffffff, button #0074d4
- Checkout font System font (default)
- Inter is available in the font selector
- Checkout shapes Rounded
- Customer portal, receipt and invoice previews show Cyber Pharma
- Public business name Cyber Pharma
- Statement descriptor CYBER PHARMA
- Successful payment receipt toggle OFF
- Refund email toggle OFF
- ACH mandate/microdeposit verification email toggle ON
- Support email sandbox@accessible.stripe.com
- Sending domain stripe.com

Stripe explicitly labels some business details as substituted sandbox
test data. Do not treat those as production business facts.

3. RESOLVE WHAT STRIPE CAN SUPPORT

Use existing authorized credentials for read-only inspection where
possible. Never print secrets.

Identify the actual sandbox account used by alpha. Trace the app's
billing-portal session creation and determine which configuration it
uses, including whether it supplies an explicit configuration ID or
relies on the default. Do not assume the old probe configuration is
the active one.

Prepare a precise branding application plan using the approved asset
package, Pharmacy Books naming, navy #154474, action green #288472,
Inter for Checkout and supported rounded styling.

Verify supported API fields against current official Stripe docs.
Distinguish account branding, Checkout styling and customer-portal
configuration. Do not claim Checkout font settings apply to every
Stripe surface.

Record original settings, exact proposed changes, rollback steps and
any dashboard-only actions. Do not change legal identity, ownership,
prices, subscriptions, payment methods, email enablement or live-mode
settings.

The earlier dashboard-write prohibition remains in place for this
prompt. Prepare concrete changes for Director application; do not
interpret our inspection as permission to mutate external settings.

4. COMPLETE ENGINEERING VERIFICATION HONESTLY

Run appropriate checks after the final changes. Preserve existing
protected-path, database, dependency and test-environment restrictions.

Recheck:
- Approved exact color tokens and contrast
- Inter loading and light-only behavior
- Initial paint with saved dark preference and dark OS preference
- Keyboard focus on actual light/dark surfaces
- Mobile Help presentation and overflow
- Responsive navigation
- Existing behavioral and pricing regression coverage

Do not describe post-load light appearance as proof of initial paint.

For signed-in checks, use only the existing authorized SCRATCH
environment and existing fixtures, if available under the contract.
Do not use DEV sessions or create business data to bypass missing
fixtures.

If signed-in screenshots or redirect reproduction remain blocked,
state the exact missing input and affected acceptance criteria.
Do not mark them passed, waive them or silently transfer them to QA.
Complete independent work while preserving the blocker.

5. RETURN THE FINISHING HANDOFF

Provide:
- What changed in each repo
- Exact verification commands and outcomes
- Current status of every existing stop, including S-1 to S-3
- Any narrowly scoped approval still required
- External settings application checklist and rollback instructions
- A deployed-system walkthrough covering both apps' fresh sign-in
  emails, branding, automatic handoff, Stripe Checkout and the actual
  billing portal, receipts/invoices and previously required payment
  exception scenarios
- Clear separation between completed engineering checks, independent
  QA checks and checks requiring deployed services or Director action

Include final source diffs, new source/assets and an integrity manifest
in the review package. Exclude credentials, auth tokens, private env
files and node_modules.

Provide an exact proposed staging file list for Tony. No broad git-add
instructions. Follow the existing session/RECOVERY rules.

Return E2 COMPLETE only when its requirements are actually satisfied.
Otherwise return E2 INTERIM with the smallest precise blocker list.
```
