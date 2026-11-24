**E2 COMPLETE.** The module is now `ENGINEERING COMPLETE — AWAITING QA BRANCH`, and all three stops are closed. I ran the signed-in checks on SCRATCH for Owner, Store admin and Member in both apps, plus the per-role Help checks and the redirect reproduction. No inbox was involved.

The only thing left is yours: commit with the exact staging lists, create `qa/abm007-final`, and release Q1.

Nothing was staged, committed, deployed or changed in a dashboard, and no email was sent. Both HEADs are unchanged (`c335671`, `b2e50fa`) and `RECOVERY.md` is untouched.

## What changed in this round (uncommitted)

| Repo | File | Change |
|---|---|---|
| Portal | `references/EmailPreview.tsx` | The S-3 line, exactly as you granted it: new logo path and `w-auto`. Nothing else, and the module is kept |
| OwedBook | `admin-portal/ScreenHeader.tsx` | The title row can wrap. At 375 px the Owner's **Add store** block was pushing Billing 142 px wide |
| OwedBook | `common/DataTable.tsx` | Long values in the stacked mobile cards now wrap. Audit was 19 px wide at 375 px |

Both overflows already existed at baseline. The new signed-in checks caught them, and both fixes are in allowed paths.

**S-1 (email template):** your original HTML is saved byte for byte in `EVIDENCE/E2/email/`. The amended copy differs only in the heading:
```
-<h2>Sign in to Cyber Pharma</h2>
+<h2>Sign in to Pharmacy Books</h2>
```
A script confirmed every other byte is unchanged, including all four branches, the four `{{ .TokenHash }}`, the four `&amp;type=email` and the fallback. Subject and display name are prepared; the address stays the same.

One thing for your judgment: two link texts still say "Sign in to Payment Portal". I left them alone because you limited the change to the heading.

## SCRATCH sign-in (automated, no inbox)

- **Fixtures:** the existing APBM-007B cast in `~/.apbm007b/engineering_cast.json`, all confirmed present on SCRATCH by a read-only check.
- **How each role signs in:**
  - Owner A uses the normal password form.
  - Store admin and Member have no password in the cast. They use the narrow exception you allowed: SCRATCH issues a one-time sign-in token without sending email, and it goes through each app's own confirm page and **Sign in** button.
- **Safeguards:**
  - SCRATCH is checked twice before any sign-in: in the build output, and on each running server.
  - Anything else fails closed, and only allowlisted fixtures can sign in.
  - Users are never created; secrets stay in memory; nothing is logged or saved.
  - Fixture addresses and names are masked in every screenshot.
- **Effects:** 8 password and 50 token sign-ins. No user, password, business data or DEV record changed.
- **Tooling:** in the module's evidence tools, `EVIDENCE/E2/tools/scratch_proof/`, with a README for Cody. I propose that folder as the permanent path; you decide whether QA uses it in place or copies it.
- **Limit:** this proves signed-in app behavior only. Email delivery, the emailed-link lifecycle and the real alpha handoff stay in the deployed walkthrough.

## Verification

| Command (fresh hash-bound copies) | OwedBook | Portal |
|---|---|---|
| `npx jest --ci` | 394/394 | 584/584 |
| `npx tsc --noEmit -p .` | exit 0 | exit 0 |
| `npx eslint .` | exit 0, 38 warnings (same as baseline) | exit 0, 27 warnings (same as baseline) |
| `next build` against SCRATCH | exit 0 | exit 0 |

**Signed-in pages:** 68 page loads across the three roles, both apps, at 375 and 1440 px, with a dark OS setting and a saved dark theme.
- Every page loaded and landed where the guards intend.
- Light from document creation, exact color tokens, Inter, and no overflow.
- Every keyboard focus stop passed on its actual surface, none hidden.
- Both apps' mobile menus walked for every role.

**Per role:**
- **Help:** all 13 contents links land correctly for each role. Its billing links take the Owner and Store admin to the existing pages, and send a Member back to OwedBook, as the Architect confirmed (AM-12).
- **Store selector:** shows 3 stores for the Owner and 1 each for the Store admin and Member, never with the "No permitted stores" placeholder beside them.

**Redirect reproduction (AC-F02):** not reproduced, so no repair.
- OwedBook offers a Store admin no link at all into Account & Billing. The route the app actually offers is: Account & Billing → **Open OwedBook** (the real handoff) → My Stores → Billing.
- Two attempts of 20 runs each (Chrome and WebKit, fresh and warm sessions): no run reached either sign-in page.
- One observation for QA: in WebKit only, warm runs 2 and 4 of each attempt saw my scripted next step overtaken by a reload of the Billing page the user was already on. The user stayed signed in. This is likely a WebKit timing effect; I haven't proven the cause and changed nothing.

The servers on ports 3100 and 3101 stopped at 09:10:17Z.

## Stops

| # | Status |
|---|---|
| S-1 | Closed for Engineering. Applying the template is your step after deployment |
| S-2 | Closed: SCRATCH reuse and automated sign-in (AM-14, AM-15) |
| S-3 | Closed: the line is applied and no old logo is referenced anywhere outside the records |

## Who checks what

| Engineering (done, claims) | Independent QA (Friday's verdicts) | Deployed services or your action |
|---|---|---|
| Everything above, plus the public-page checks from the previous round | All acceptance criteria, including rendered text contrast, Firefox, store-selector states with zero stores or removed access, the journeys, the email diff review, and the WebKit observation | Applying the external settings and email template; walkthrough W-1 to W-11; Git; deleting the leftover old-logo files; deployment |

## Package and Git

- **ZIP:** `agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/ABM007_FINAL_E2_COMPLETION_REVIEW_03.zip`
  - SHA-256 `7d4d2fc5691317fe42bcc63d50b0757e4c030a792434df9e6a275b615c0c20e1`, 355 files plus the index.
  - Contents: full diffs from baseline, this round's diff, every changed or new file, the integrity inventory and the records. No credentials, sign-in state, env files or `node_modules`. The privacy and secret scans were clean.
  - Copy in `~/Downloads/ABM007_FINAL_E2_COMPLETION_REVIEW/`, byte-identical.
- **Staging:** exact lists in `EVIDENCE/E2/STAGING_LIST_owedbook.txt` (95 paths) and `STAGING_LIST_portal.txt` (327 paths, including the 16 spec deletions). The review ZIPs are in `STAGING_LIST_portal_optional.txt`. From each repo root, compare `git status --short` with the list, then run `git add --pathspec-from-file=<list>`.
