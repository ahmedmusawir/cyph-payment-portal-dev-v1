**E2 INTERIM.** The four source-review corrections are done in both repos and pass the final checks. Three blockers remain, each waiting on an input from you, so this isn't E2 COMPLETE.

Nothing was staged, committed or deployed, and no dashboard was changed. Both HEADs are unchanged (`c335671`, `b2e50fa`) and `RECOVERY.md` is untouched.

**One thing to know first:** the new keyboard check caught a regression I introduced in E2. OwedBook's signed-in mobile menu had become an overlay, so tabbing past **Log out** moved focus onto Help content hidden under it. The menu is back in the page flow, as it was at baseline.

## What changed (uncommitted)

| Repo | File | Change |
|---|---|---|
| Both | `globals.css` / `globals.scss`, `tailwind.config.ts` | Focus rings now follow the surface they sit on: white on navy, navy on white, at any nesting depth. The input and radio-card rings use the same rule. The old rule that forced white onto everything inside a dark area is gone |
| OwedBook | `Navbar.tsx`, `MobileNav.tsx` | Both white mobile menus are marked as light surfaces; the signed-in menu is back in the page flow |
| OwedBook | `HelpPage.tsx` | The role table is a real table from md width up and stacked labelled pairs below that. Same content, one data source, no minimum-width scrolling |
| Portal | `Footer.tsx` | The skip link takes the white ring, since it always shows over the navy top band |
| Both | `src/__tests__/abm007/focus-surface.test.ts` (new); OwedBook `help-page.test.tsx` (+1 test) | Pins for the focus rule and the stacked table |

- **EmailPreview (S-3):** not edited. The file is unreachable and outside the allowed paths. The proposed one-line change also switches the width to `w-auto`, so the wide logo isn't squashed into a square:
  ```
  -          <img src="/logo-color.svg" alt="" className="h-7 w-7" />
  +          <img src="/brand/pharmacy-books-logo-primary.png" alt="" className="h-7 w-auto" />
  ```
- **Help guard:** recorded as **AM-12**, the Architect's confirmation that a Member is sent to `/owedbook`. The guard is unchanged and QA still verifies it.

## Verification

Each run used fresh copies bound by hash to the working trees: OwedBook 408 files, Portal 289.

| Command | OwedBook | Portal |
|---|---|---|
| `npx jest --ci` | 394/394 | 584/584 |
| `npx tsc --noEmit -p .` | exit 0 | exit 0 |
| `npx eslint .` | exit 0, 38 warnings (same as baseline) | exit 0, 27 warnings (same as baseline) |
| `npx next build` | exit 0 | exit 0 |

The browser checks ran on 22 public page loads at 375 and 1440 px, with a dark OS setting and a saved dark theme. The servers on ports 3300 and 3301 were stopped at 07:53:54Z.

- **First paint:**
  - A script installed at document creation, before any page script, never saw the `dark` class, from the first moment through the first frames.
  - Pages loaded with JavaScript off were light.
  - The built CSS has no dark-mode media rule.
  - This is not a frame-by-frame video capture.
- **Basics:** exact color tokens, Inter loaded, no horizontal overflow, no theme control.
- **Keyboard focus:** 154 focus stops, measured from screenshot pixels against the surface around each one. All passed: 49 white-on-navy and 105 navy-on-white, lowest side 4.53:1, none covered. A deliberately failing control was caught at 1:1.
- **Menus:** the three public mobile menus were walked by keyboard.
- **Help at 375 px:** the role list stacks with all 6 tasks and nothing overflows. At 1440 px the table shows. This was the real component on the built stylesheet, not the signed-in `/help` route.

## Stops

| # | Status | What's missing | Criteria affected |
|---|---|---|---|
| S-1 | Open, narrowed. Subject, sender name and heading are prepared from your observation | **The original Magic Link template HTML.** It isn't in any local record or session transcript, so I couldn't produce the body diff, and I didn't reconstruct it | AC-E01 |
| S-2 | Open; earlier wording corrected. OwedBook's `.env.local` does hold SCRATCH settings (my earlier "no configuration" was wrong) | **Designated SCRATCH identities (Owner, Store admin, Member)** and a permitted way to sign them in | AC-L02, AC-L03, AC-H01 and AC-H03 (rendered), AC-F01 (rendered), AC-F02, signed-in parts of AC-B06 to B08 and AC-L04 |
| S-3 | Open, unchanged | **Your ruling** on the one-line EmailPreview change | AC-N02 |

Nothing here is marked passed, waived or handed to QA.

## External settings (prepared, not applied)

Details, originals and rollback are in `EVIDENCE/E2/EXTERNAL_SETTINGS_PLAN.md`. Your dashboard observations are recorded separately as Director-observed (`DIRECTOR_OBSERVED_SETTINGS.md`).

**Stripe findings (read-only):**
- The sandbox account `…Dyu3RR` matches the Portal's expected account.
- Its branding is completely unset (all four fields null), so the #525f7f and #0074d4 you saw are most likely Stripe's displayed defaults.
- The Portal always passes an explicit portal configuration, never the default. Locally that is `…diVXwt` ("Cyber Pharma — OwedBook billing"), which is what upload-secrets.sh put into alpha's secret. The default `…3rwV9q` is the old probe, and nothing uses it.
- I didn't read alpha's secret directly. Before applying anything, please confirm its last six characters are `diVXwt`.

**Changes to apply:**
- **Email:** subject becomes "Your Pharmacy Books sign-in link"; sender name becomes "Pharmacy Books" (address unchanged); heading text becomes "Sign in to Pharmacy Books". Every branch, callback, token variable, `type=email`, `&amp;` and fallback stays as is. The body diff waits on S-1.
- **Stripe branding (Dashboard only):** icon and logo from the approved files, both under Stripe's 512 KB limit; brand color #288472; accent #154474; "Prefer logo over icon" checked; public business name "Pharmacy Books". The statement descriptor, support email and email toggles stay as they are.
- **Stripe Checkout (Dashboard only):** button #288472, font Inter, Rounded shapes kept, background #ffffff kept. Stripe's docs state the font for Checkout only, so I don't claim it for any other surface.
- **Portal headline (API only):** Stripe's Dashboard edits only the default configuration, so this one needs an API call. The headline becomes "Pharmacy Books — Account & Billing" (34 characters), followed by a required read-back that the features didn't change.
- **Resend:** no change. The sending-only key limitation stays recorded.

## Deployed walkthrough

`EVIDENCE/E2/DEPLOYED_WALKTHROUGH.md` has steps W-1 to W-11:
- fresh sign-in emails from both apps, checking each link goes straight to that app's `/api/auth/confirm` with no tracking redirect;
- invitations, branding on both apps, and the automatic handoff between them;
- Stripe previews, the actual billing portal, and invoices and receipts.

Two steps wait on authorizations:
- **W-7**, opening a live Checkout without paying, needs a specific authorization.
- **W-11**, the payment exception scenarios, stays deferred under P-12.

## Who checks what

| Done by Engineering (claims) | Independent QA | Needs deployed services or your action |
|---|---|---|
| Unit, typecheck, lint and build checks; public-page rendering including first paint, focus contrast, menus and overflow; Help markup | Every signed-in screen by role, rendered text contrast, WebKit and Firefox, the journeys, the Help guard (AC-H03), and the email diff once S-1 closes | Applying the external settings, then W-1 to W-11 |

## Package and Git

- **ZIP:** `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/ABM007_FINAL_E2_COMPLETION_REVIEW_02.zip`
  - SHA-256 `87fed72a0443cb3199fea20a1efc0aaec519abe90f1d44fa1d4b02b6a5c04ba2`, 237 files plus the index.
  - Contents: full diffs from baseline, this round's diff, every changed or new file, the integrity inventory and this round's records. No credentials, env files or `node_modules`.
  - Copy in `~/Downloads/ABM007_FINAL_E2_COMPLETION_REVIEW/`, byte-identical.
- **Staging:** exact file lists in `EVIDENCE/E2/STAGING_LIST_owedbook.txt` (95 paths) and `STAGING_LIST_portal.txt` (208 paths, including the 16 spec deletions). The review ZIPs are in `STAGING_LIST_portal_optional.txt`. From each repo root, compare `git status --short` with the list, then run `git add --pathspec-from-file=<list>`.

To resume, I need the template HTML (S-1), the designated SCRATCH identities (S-2) and your ruling on the logo line (S-3).
