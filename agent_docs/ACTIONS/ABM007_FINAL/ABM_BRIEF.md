# ABM_BRIEF — ABM007_FINAL

**Version:** 1.1-review (Architect review 01 applied) · **Date:** 23 November 2026, Asia/Dhaka · **Status:** REVIEW CANDIDATE. Not frozen, not released. Freezes when the Architect issues the architectural verdict and the Director rules on the proposed positions.

| Field | Value |
|---|---|
| Module ID | `ABM007_FINAL` (an ABM inside the Phase 007 campaign; not an APBM) |
| Module path | `agent_docs/ACTIONS/ABM007_FINAL/` in the Portal repository (canonical, proposed P-18); pointer at the same path in OwedBook |
| Director | Tony |
| ABM author | QA Lead seat, acting as co-architect during preparation (D-15) |
| Architect (reviewer, architectural verdict, repair instructions, closeout) | Architect seat |
| Engineer | Claudy |
| QA Lead | QA Lead seat (after authoring) |
| QA Executor | PENDING the Director's selection |
| Governing playbooks | ABM_PLAYBOOK v1.0; QAM_PLAYBOOK v1.0 with template set v0.3; DESIGNER_PLAYBOOK v2.2; GLOBAL_DESIGN_SYSTEM_HANDBOOK v1.2 |

## 1. Objective and intended user

Deliver one polished, consistently branded two-app product that the Director can present to Frank: OwedBook and Account & Billing, wearing the approved Pharmacy Books brand, with an in-app Help page and the selected small fixes, without changing how any tested behavior works.

Users: pharmacy owners, store admins and members, on ordinary desktop browsers (Windows Chrome is the stakeholder baseline) and on narrow screens.

## 2. Repositories and baselines

| | OwedBook | Portal (Account & Billing) |
|---|---|---|
| Path on the Director's machine | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev` | `/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1` |
| Remote | `Cyberize-Group/cyph-v1-dev` | `ahmedmusawir/cyph-payment-portal-dev-v1` (D-07) |
| Engineering branch | `abm007-final` | `abm007-final` |
| QA branch (Director creates at the engineering candidate) | `qa/abm007-final` | `qa/abm007-final` |
| Baseline (full SHA) | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` |
| Alpha service | `cyph-v1-owedbook-alpha.cyberizedev.com` | `cyph-v1-payment-alpha.cyberizedev.com` |

Baselines are from the Engineer's pre-ABM recon of 23 November. That recon reported the OwedBook tree carrying three session-record files and fewer local branches than the Director's earlier receipt. A narrow reconciliation is required at engineering entry (Execution rule E-3 in `ABM_ENTRY.md`); nothing here asserts those branches were deleted or preserved.

## 3. In scope

1. **Brand foundation in both apps.** Token set, Inter, radius and shadow scale, forced light, removal of theme controls. `CONTRACTS/BRAND_UI_CONTRACT.md`.
2. **Layouts.** Literal RFI layout on sign-in, auth, signup pages; RFI panel inside signed-in navigation on Add Pharmacy; translated layout on dashboards and admin pages. `CONTRACTS/UI_SPEC.md`.
3. **Components.** Buttons, links, fields, cards, pills, notices, tables, dialogs, menus, headers, sidebars, steppers, empty and loading states, in both apps.
4. **Names and logo.** The three approved names in every customer-visible string; the logo and icon package. `CONTRACTS/LOGO_ASSET_SPEC.md`.
5. **Help page** in OwedBook. `CONTRACTS/HELP_CONTENT.md`.
6. **Selected fixes.** The "No permitted stores" contradiction; bounded reproduction of the historical redirect; the minimal landing-page update.
7. **Emails and Stripe.** Restyled sign-in template prepared for the Director; billing-notice wording; Stripe sandbox branding values prepared for the Director. `CONTRACTS/EMAIL_AND_STRIPE.md`.
8. **Tests.** Unit tests that assert presentation updated; a forced-light test and a token-pin test in each repository; the stale-spec mapping table.
9. **Independent QA** through the module's QAM, then cleanup and closeout.
10. **Redeployment of both alpha services** after Gate Q, each under the Director's authorization (proposed P-20), followed by an alpha verification session.

## 4. Out of scope and deferred

- Pricing, billing lifecycle, subscription structure, Checkout flow, webhook processing, provisioning, pending-operation recovery. Protected.
- Sign-in design: separate cookies and the app-to-app handoff. Protected.
- Database schema and migrations 0001 to 0071. Protected. This module adds no migration.
- Dark theme. Deferred (D-01).
- The RFI page, the marketing site and its registration form, and every item in the design file's "Conversion Component Patterns" section (D-05; register C-07). That section's $100 and $250 plans are not this product's prices.
- Claims, uploads, calculations, vendor data, PDF workflows. Help carries a short placeholder only.
- Google sign-in, profile editing, settings editing, self-service ownership transfer.
- HTML billing notices; a custom billing interface.
- Production cutover, HIPAA or BAA readiness, legal publication (D-12).
- Every item marked DEFER in `CONTRACTS/BACKLOG_DISPOSITIONS.md`. Deferred is not passed.

## 5. Inputs

| Input | Where | Standing |
|---|---|---|
| Approved brand design | `SOURCES/CYPH_FRANK_DESIGN.md` | Approved 21 Nov 2026 by Mical Johnson and Frank Tant, per the file |
| Branding conflict register v0.3 | `SOURCES/` | Panel record plus Director rulings |
| Engineer's pre-ABM recon and command appendix | `SOURCES/RECON/` | Verified read-only facts, proposals and named gaps |
| Architect handoff, campaign journal v0.3, recipe Rework Record | `SOURCES/` | Continuity and history |
| Tester guide v3 (PDF) | `SOURCES/` | Source for Help task flows; labels need verification |
| APBM-007B Gate Q certificate | Project doc `LABS/APBM-007/QAM_CERTIFICATION_APBM-007B_2026-11-18.md` | Historical scope and KR-1 to KR-6; not bundled |
| October Portal design package | `PAYMENT_PORTAL_FFM_COMPONENTS.zip`, SHA-256 in `SOURCES/SOURCE_INDEX.md` | Tooling and state reference only. Its workflows, placeholders, Saira, coral theme and demo assumptions are not today's contract. Not bundled (about 80 MB) |

## 6. Outputs

- Two committed engineering candidates, one per repository, forming one paired candidate.
- The factual QAM handoff.
- Independent QA records and a scoped Gate Q verdict on the pair.
- Two alpha redeployments with read-back identity, when authorized.
- Prepared external-configuration values and the record of the Director applying them.

## 7. Critical end-to-end path

Owner signs in to Account & Billing, moves to OwedBook and back without a second sign-in, adds a pharmacy through quote, consent and payment, sees it active in both apps, invites a Member who accepts and sees only that pharmacy, opens Help, signs out of both apps. Every screen on that path wears the new brand, in light, with readable contrast, at desktop and narrow widths.

## 8. Director checks and their timing

| Check | When |
|---|---|
| **Gate V:** approve or amend the style tile and sample screens in `DESIGN/` | At pack review, before engineering release. This is the visual approval the Director reserved; it removes the need for a stop inside the build |
| Engineering plan release | After the Architect reviews the Engineer's plan |
| Q2 release | After the QA Lead approves the Q1 plan |
| Read-only dashboard session S1 | Any time before email and Stripe values are prepared |
| Deployment authorization, per service | After Gate Q and cleanup acceptance |
| Apply session S2 and alpha ride (this module's Gate D, `QAM/GATE_D_PLAN.md`) | After deployment. The QA Lead walks the Director through it step by step, one check at a time. It covers branding, email delivery, Stripe previews and the ride only. Deferred lifecycle and payment work is not part of it |
| Final acceptance | After the alpha ride. A Gate Q PASS or a successful deployment does not close the module; the Gate D rows must also have their evidence |

## 9. Specialist reviews

None required. The Architect's package review is the architectural check. No automatic extra review chain.

## 10. Estimate for the selected scope

**These are the author's estimates, pending the Engineer's own estimate in the approved plan, which replaces the engineering rows.** They are not a delivery date and no date is promised from them. Engineering, independent QA, external configuration, repair and retest, and approval waits are separate lines and are not added into one figure. Units are working days as the Engineer defined them in the recon (one engineer working with the agent). The campaign's observed pace has often been faster than day estimates; these figures are not adjusted for that.

| Part | Estimate | Basis |
|---|---|---|
| Engineering: brand, layouts, components, names, logo, tests, emails and Stripe preparation, verification, redeploys | 9.0 to 12.5 | Engineer's recon section 9.7 |
| Less: static style tile and five sample screens already delivered in this package | minus 1.0 to 1.5 | Author's judgment; the Engineer confirms in the plan |
| Help page shell and step pattern, content supplied | plus 0.5 to 1.0 | Recon 9.7, "not included" list |
| "No permitted stores" fix, redirect reproduction | plus 0.5 to 1.0 | Author's estimate; no recon figure |
| **Engineering subtotal (author's estimate)** | **about 9 to 13** | Superseded by the Engineer's approved-plan estimate when it exists |
| Independent QA: Q1 recon and plan, Q2 execution | 1.5 to 2.5 | Author's estimate from the two prior campaigns' shape; not measured |
| External configuration by the Director (two sessions) | about 0.5 | Author's estimate |
| **Not estimated** | | Repair and retest rounds; approval waits; retiring or re-pointing stale specs beyond the mapping table; tester-guide refresh after labels change |
