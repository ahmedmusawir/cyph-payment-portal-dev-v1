# REVIEW_START_HERE — ABM007_FINAL authoring review package 02

**Date:** 23 November 2026, Asia/Dhaka · **From:** ABM author (QA Lead seat, acting as co-architect) · **To:** Architect, to check amendments A-01 to A-06; Director, for the four decision groups.

**What this is.** The second review candidate of the complete `ABM007_FINAL` package. It is the REVIEW_01 package with the Architect's six amendments applied in one bounded correction pass. Module ID, settled Director decisions, architecture and historical evidence are unchanged.

**What this is not.** Not a frozen contract, an engineering release, a Q2 release or a deployment authorization. No repository, dashboard or deployment was touched. No recon was repeated and nothing was built. Every future SHA, approval and result is still pending.

**Internal only.** `SOURCES/` carries tester email addresses and technical receipts. Do not forward this package to Coach or Frank.

## 1. Read in this order

1. This file.
2. `AMENDMENT_EVIDENCE_02.md` — each amendment, what changed, and where.
3. `DESIGN/renders/` — the corrected style tile and samples. Then `DESIGN/renders/COLOR_VERIFICATION.txt`.
4. `ABM_RULINGS.md` — sections 3 (amendments) and 4 (the four decision groups).
5. Whatever the evidence table points you to.

## 2. What the Architect is asked to do

Check that A-01 to A-06 are applied consistently, using `AMENDMENT_EVIDENCE_02.md`. Review 01 is kept, unaltered, at `SOURCES/ARCHITECT_REVIEW_01_2026-11-23.md`.

Three things I want you to look at rather than take on trust:

1. **Gate V status.** The Director approved the look on the REVIEW_01 renders before your review arrived. The pictures have since changed (exact colors, real logo, mobile menu). I recorded his approval truthfully and marked reconfirmation on the corrected renders as pending (`ABM_RULINGS.md` AM-01, AM-03). I did not carry the approval forward silently.
2. **The Gate D invitation fixture.** You asked me to name the fixture owner. I could name the project (DEV) and the fixture's required shape, but not an actual account: I have no list of alpha accounts and will not invent one. It is recorded as PENDING the Director's nomination, with BLOCKED as the outcome if none exists, and no purchase to create one (`CONTRACTS/EMAIL_AND_STRIPE.md` 1.2).
3. **One real difference with QA_PLAYBOOK v1.2.** It names a "Gate M" record. This module has none; its mobile criteria are AC-L04 and the coverage matrix, now including 768 and 1024. Recorded in `QAM/GOVERNING/README.md` section 3 for your call.

## 3. What the Director is asked to decide: four groups

Detail in `ABM_RULINGS.md` section 4. The Architect recommends groups 1 and 2 as proposed; that is a recommendation, not your approval.

| Group | Your decision | My recommendation |
|---|---|---|
| **1. The look** | Look at the corrected renders and reconfirm, or say what to change. Same look you approved; now with the real logo, the exact brand colors and a visible mobile menu button | Reconfirm |
| **2. What is in and what waits** | In: the brand wording in Stripe and billing notices, the small landing-page repair, the "No permitted stores" fix, the bounded redirect check, the stale-test mapping, one regression run. Waits, each with a named owner and destination: statement descriptor, advanced payment exceptions, scheduler and expiry, transfer and populated claims, APA terms, full password matrix, older usability items | Approve the split |
| **3. Who tests, and on what** | Name the QA Executor. Approve the QA target and effects envelope, with the payment ceiling as a maximum and paid tests waiting for proof that QA and alpha events cannot affect each other | Approve; name the seat |
| **4. Outside settings and alpha rollout** | The read-only dashboard session S1; later the apply session S2; one deployment authorization per alpha service after Gate Q; nominate one existing alpha Owner account, not your rehearsal account, for the invitation check | Keep this sequence |

Small items that can ride with group 1: the two logo points in `CONTRACTS/LOGO_ASSET_SPEC.md` section 4.

## 4. Visual approval status

**Approved on the REVIEW_01 renders; reconfirmation on these corrected renders is pending.**

What changed in the pictures: the logo placeholder is now the real, unaltered master in a white tile; the brand colors now resolve to exactly the approved hex values; signed-in samples show a visible menu button at phone width, and one extra render (`04b`) draws the menu open. Nothing else about the look was redesigned.

What I checked, on the final files in this package:
- **Colors.** Every token resolved in Chromium. The seven anchors equal the approved hex values exactly. 37 declared pairs meet their threshold. 11 controls fail as they must, including the rounded triplet the Architect caught (white text 4.475:1) (`DESIGN/renders/COLOR_VERIFICATION.txt`).
- **Renders.** 13 loads: no horizontal overflow, Inter loaded, logo decoded at full size, menu button visible on the three signed-in samples at phone width, no script errors (`DESIGN/renders/RENDER_CHECKS.txt`).
- **Looked at: all 13 final renders.** Style tile desktop and mobile (the mobile one as an overview plus four close crops); 01 sign-in, 02 choose plan, 03 OwedBook dashboard, 04 Portal dashboard and 05 Help, each at desktop and mobile; 04b menu open at mobile. No defect seen.

Limits: content is fictional; the menu is a labelled picture; a sample that omits or reorders something approves no removal or reordering; the color evidence is for the token file and reference pages, not for the two built apps, which independent QA measures.

## 5. Dashboard sessions still outstanding

All the Director's, none started. I will walk you through each, one step at a time.

| Session | What | Needed before |
|---|---|---|
| S1, read-only | Supabase DEV: copy out the sign-in email body and subject, Site URL, redirect allow-list, sender; whether other templates are defaults | The Engineer prepares the restyled email |
| S1, read-only | Mail provider: click tracking off for the sending domain | Same |
| S1, read-only | Stripe sandbox: font list, shapes, background control, file rules; four baseline previews; which customer emails are on; which billing-portal configuration alpha uses | The Engineer prepares Stripe values |
| S2, apply | Apply the email template and Stripe branding, then the checks in `QAM/GATE_D_PLAN.md` | After deployment |

## 6. What I did not have, and the consequence

| Not available | Consequence |
|---|---|
| Both repositories and the Director's machine | Every statement about source, branches and tests comes from the Engineer's recon. The Engineer re-verifies at entry |
| The repositories' own root instructions | Not read by me. The pack tells each seat to read and obey them and how to handle a real conflict |
| A Hub commit identity for the five playbooks | None was provided and none is claimed. They are identified by name, header version and SHA-256 (`QAM/GOVERNING/PROVENANCE.md`) |
| The QAM template set as files | Not supplied. The QAM no longer depends on it |
| The live Supabase template, Stripe branding screen, mail-provider settings | Email and Stripe values are specified in shape, not final; S1 and S2 close this |
| A list of alpha accounts | The Gate D invitation fixture is pending the Director's nomination |
| How Stripe events are actually routed between alpha and a QA listener | Not known. Q1 must establish it before any paid test |
| Coach's testing feedback | Not received. Not a prerequisite (D-09) |

## 7. Estimate

Author's estimate, pending the Engineer's own figure in the approved plan. Not a delivery date. The lines are separate and are not added together.

| Part | Estimate |
|---|---|
| Engineering | about 9 to 13 working days, in the Engineer's unit |
| Independent QA (Q1 and Q2) | 1.5 to 2.5 days |
| External configuration by the Director | about half a day across two sessions |
| Not estimated | Repair and retest, approval waits, the tester-guide refresh |

## 8. Things I would flag even if nobody asked

1. **The Architect's color finding was right, and I had it wrong.** I copied whole-number triplets from the recon. I confirmed in a browser that the rounded dark green is a different color and fails contrast. The brand contract now forbids hand-rounding and independent QA checks the resolved colors in both built apps.
2. **`hover:bg-primary/90` and `opacity-50` on primary buttons fail contrast with the new green** (3.80:1 and 1.98:1 as resolved). The contract replaces both.
3. **Colored status text only passes on white.** On the ice page it drops to about 4.0 to 4.1:1. The contract keeps it inside white cards.
4. **The Help draft has two statements I could not verify:** what a Member can open, and where a subscription is cancelled. Both are marked for the Engineer.
5. **QA and alpha share one Stripe sandbox, and I do not know that their events are isolated.** The pack no longer assumes a separate listener is enough.

## 9. Package facts

Filename, member count and SHA-256 are in the author's return message. `FILE_INDEX.json` lists every member except itself, with size and SHA-256. Not bundled: `PAYMENT_PORTAL_FFM_COMPONENTS.zip` (about 80 MB; hash in `SOURCES/SOURCE_INDEX.md`). The REVIEW_01 package is not nested inside this one.

## Glossary

- **A-01 to A-06:** the Architect's required amendments. **AM-nn:** dated entries in the rulings file. **P-nn / D-nn:** proposed positions / settled Director decisions.
- **Gate V / Gate Q / Gate D:** the Director's visual approval / the independent QA verdict on the tested pair / the short deployed check of this module.
- **S1 / S2:** the Director's read-only and apply dashboard sessions.
- **SCRATCH / DEV:** the QA database project / the project the alpha services use.
