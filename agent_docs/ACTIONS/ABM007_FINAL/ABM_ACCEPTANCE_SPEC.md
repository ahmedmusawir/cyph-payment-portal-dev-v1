# ABM_ACCEPTANCE_SPEC — ABM007_FINAL

**Version:** 1.1-review (Architect amendments A-01, A-03, A-05 applied) · **Date:** 23 November 2026, Asia/Dhaka · **Status:** REVIEW CANDIDATE. The criteria text freezes at the Architect's verdict and the Director's rulings. After that it changes only through `ABM_RULINGS.md` section 3.

Read with `ABM_BRIEF.md`, `ABM_RULINGS.md` and `CONTRACTS/`. Where a criterion depends on a proposed position, the position's ID is shown; a different ruling amends the criterion through the rulings file.

## How to read a row

- **Method:** how independent QA is expected to check it. The QA Executor writes the actual tests in Q1 and may propose better ones.
- **Environment:** `LOCAL-QA` = QA-controlled production builds against the approved QA target (proposed P-19). `SOURCE` = read-only inspection of the committed candidate. `ALPHA` = the deployed alpha services after authorized deployment. `DIRECTOR` = an action or observation only the Director can make.
- **Blocking:** `B` = blocks Gate Q. `D` = judged at the alpha verification stage after deployment, not at Gate Q. `G` = a gate before engineering.
- Expected values in independent QA are derived from this spec, the brand contract and the design file, never from the app's own helpers or the Engineer's claims.

## Gate V — visual approval before engineering

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-V01 | The Director has approved, or approved with recorded amendments, the **corrected** style tile and sample screens in `DESIGN/` (the REVIEW_02 renders, with exact colors, the real logo and the mobile menu illustration), and has ruled on P-01 to P-04. The approval is recorded in `ABM_RULINGS.md`. | Read the ruling record | DIRECTOR | G |

## B — Brand foundation (both apps)

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-B01 | The light `:root` token block in `src/app/globals.css` (OwedBook) and `src/app/globals.scss` (Portal) matches `DESIGN/tokens/abm007_final_tokens.css` declaration for declaration, and the two apps match each other. The brand anchors keep their full-precision triplets and the aliases keep their `var()` references (brand contract 1a); no triplet is hand-rounded. In a browser, each approved anchor resolves to its exact approved hex: #154474, #32A38D, #288472, #EAF3FA, #393B38, #515151. A unit test in each repository pins the declarations; that test alone is not the proof of color. | Parse both files and compare with the token file; run the pin tests; **resolve the tokens in a real browser from each built app and compare with the approved hex**, with one deliberately rounded triplet as a control that must be reported as a mismatch | SOURCE | B |
| AC-B02 | No hardcoded color in non-test application source: no hex, `rgb()`, `hsl()` literal outside `hsl(var(--token))`, arbitrary color class, numbered Tailwind color, or `white`/`black` color utility. The recon's listed exceptions are resolved. Logo files are exempt. | Scan with an existence check first so an empty scan cannot pass | SOURCE | B |
| AC-B03 | Inter is the only typeface, loaded through `next/font` with weights 400, 500, 600 and 700 and shipped with the app. Saira is gone. No weight below 400 is used. | Source check; rendered computed font family on each shell; network panel shows the font served by the app | SOURCE, LOCAL-QA | B |
| AC-B04 | Light is forced. With `localStorage.theme` set to `dark` and the operating system in dark mode, every shell in both apps renders the light theme, including first paint. No theme control is rendered anywhere. | Browser check on each shell with both conditions set; unit test per app | LOCAL-QA | B |
| AC-B05 | Radius and shadow follow the contract scale: buttons, fields and menus 8px; cards and dialogs 14px with the card shadow and hairline; shell and masthead 16px; logo tile 12px; step badges round. Shadows are navy-tinted. | Computed styles on the component matrix | LOCAL-QA | B |
| AC-B06 | Buttons: Title Case labels, Inter Regular 16px, no uppercase, minimum height 44px. Hover is darker than the default. Focus shows a visible 2px outline with offset on every surface. Disabled is visibly inactive, readable, and not operable by mouse or keyboard. Busy keeps its spinner, its progress wording, `aria-busy` and the duplicate-submit guard. | Computed styles and interaction checks on each button variant and state; keyboard walk | LOCAL-QA | B |
| AC-B07 | Links are dark green and underlined on white surfaces. No dark-green text appears on ice or on navy; links on navy use the light treatment. This supersedes the earlier Portal link ruling R-004. | Rendered check of every link context in the matrix | LOCAL-QA | B |
| AC-B08 | Rendered contrast: normal text at least 4.5:1, large text at least 3:1, field borders and focus indicators at least 3:1, on every screen and state in the approved coverage matrix, measured from the colors the built apps actually render, including hover, disabled, focus and translucent or tinted backgrounds after compositing. Ratios worked out from hex values on paper are context, never the evidence. | Rendered-contrast probe on the built candidate against composited backgrounds, with a deliberately failing fixture to prove the probe can fail | LOCAL-QA | B |
| AC-B09 | Status is shown with a word, a border and a tint, using status tokens only. Brand green, brand navy and the logo red are never used as a status color. Role labels show the user's true role as text. | Rendered check of every pill, notice and role label; source check of token use | LOCAL-QA, SOURCE | B |

## L — Layout

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-L01 | Literal RFI layout (navy backdrop, centered white shell, gradient masthead with the logo tile, white cards) on: OwedBook `/auth` and its six auth pages; Portal `/login`, its six auth pages and the five `/register/*` steps. | Rendered check against the samples and the UI spec | LOCAL-QA | B |
| AC-L02 | Translated layout (navy header, white cards on the approved page surface, restrained shadows) on: OwedBook `/owedbook`, `/admin-portal` and its store, invite, billing, settings and audit pages, `/profile`, `/invitations`; Portal `/dashboard` and `/billing`. The OwedBook data table keeps the full available width. No 1100px shell on these pages. | Rendered check; table width measured against the viewport at 1440 | LOCAL-QA | B |
| AC-L03 | Add Pharmacy (`/stores/add`) and Help keep the signed-in navigation, with the masthead-and-cards treatment inside it. | Rendered check as Owner | LOCAL-QA | B |
| AC-L04 | At 375px wide: no horizontal page overflow; navigation reachable by touch and keyboard; wide tables reflow to stacked rows; primary controls at least 44px high. Checked on every screen in the matrix. | Overflow and target-size probes at 375 and 1440, plus the intermediate widths the plan names | LOCAL-QA | B |
| AC-L05 | Error, not-found, loading, empty and access-denied states in both apps wear the brand and remain readable. | Rendered check of each state | LOCAL-QA | B |

## N — Names and logo

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-N01 | Customer-visible text uses "Pharmacy Books", "OwedBook" and "Account & Billing". The string "Cyber Pharma" does not appear in rendered pages, page titles, image alt text, accessible names, the Portal footer, or billing-notice sender name, subjects and body. OwedBook reads its brand strings from one constant file. Internal identifiers, repository names, comments and historical records are untouched. | Source scan of customer-facing strings with an explicit allow-list for internal identifiers; rendered check of titles and accessible names | SOURCE, LOCAL-QA | B |
| AC-N02 | The logo master in each repository is byte-identical to the supplied file (SHA-256 `e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd`). It is rendered in a white tile on navy surfaces. Derived `icon.png`, `apple-icon.png` and `favicon.ico` exist in both apps, made only by whole-image scaling and transparent or white padding. The old coral logo files are not referenced by any source file. | Hash check; visual comparison of derived icons with the master; source reference scan | SOURCE, LOCAL-QA | B |

## H — Help

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-H01 | OwedBook has a Help page reachable from the signed-in navigation for Owner, Store admin and Member. Its sections and wording follow `CONTRACTS/HELP_CONTENT.md`. Section links and in-page anchors work. | Rendered check per role; link and anchor walk | LOCAL-QA | B |
| AC-H02 | Help contains no test card, test identifier, tester alias, alpha address, cloud instruction, QA wording or internal verdict. Every button and menu name it quotes matches the current screen. The Engineer's label-verification table is complete. | Text scan with a seeded forbidden-term fixture; label-by-label comparison with the rendered screens | LOCAL-QA, SOURCE | B |
| AC-H03 | Links from Help obey existing route guards: a Member or Store admin following a billing link sees the existing friendly restriction, not Owner data and not an error. | Follow each Help link as each role | LOCAL-QA | B |

## F — Selected fixes

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-F01 | "No permitted stores" (or its final wording) appears only when the signed-in user has zero permitted stores. It never appears beside selectable stores. Checked for Owner, Store admin, Member and a user whose access was removed. No store becomes visible to anyone who could not see it before. | State matrix: zero, one and several stores, per role | LOCAL-QA | B |
| AC-F02 | The historical Store-admin redirect to Portal sign-in has a bounded reproduction record on the candidate: the routes, session states and role tried, the number of runs, and the outcome. A repair exists only if the defect was reproduced. The earlier passing retest stays on record. | Read the record; rerun the same routes independently | LOCAL-QA | B |
| AC-F03 | The OwedBook landing page has no navigation link that points at a missing section, uses the approved names and logo, and shows either a current screenshot of the rebranded product or no screenshot (proposed P-08). | Link walk; rendered check | LOCAL-QA | B |

## R — No-break regression

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-R01 | Both unit suites pass on the candidate. Counts are recorded from this run, not inherited. | Run both suites in a QA-controlled install | LOCAL-QA | B |
| AC-R02 | Typecheck, lint and production build succeed for both apps. | Run them | LOCAL-QA | B |
| AC-R03 | The baseline-to-candidate diff touches no protected path listed in `CONTRACTS/NO_BREAK_AND_PATHS.md`. The one permitted exception is the brand strings in the Portal's `src/server/billingNotices.ts` and its tests. No migration file is added or changed. | Full diff review, path by path | SOURCE | B |
| AC-R04 | The critical journeys work on the new look, on isolated QA fixtures: (a) Owner sign-in in each app by emailed link, and one password sign-in; (b) app-to-app movement in both directions without a second sign-in, and the Stripe billing return; (c) registration through plan, pharmacy, owner and review to the Checkout handoff, with required confirmations blocking while unticked; (d) one paid Add Pharmacy through quote, consent, payment and activation, visible once in both apps; (e) invite a Member, accept, scoped to one pharmacy; (f) Store admin limits: no Add Pharmacy form, the "managed by Owner" view, friendly denial on another store's page; (g) schedule a removal and undo it, with access-now and next-renewal counts correct; (h) remove a Member with cancel and confirm; (i) audit log filters and older-event paging, exercised on a bounded synthetic fixture whose history is long enough to need a second page (planned in Q1 inside the approved effects envelope). If that fixture cannot be built, this item is recorded BLOCKED and goes to the QA Lead and the Director for a specific disposition. Missing fixture history is never recorded as "not applicable" and never counted as covered; (j) sign out of both apps, a used link does not restore access, a fresh link does. | Browser journeys with independent expected results; one grouped Director session only where an inbox or a human judgment is needed | LOCAL-QA | B |
| AC-R05 | Displayed prices are unchanged: $99.00 first pharmacy, $49.00 each additional, $148.00 for two, $197.00 for three, before tax or approved discounts. Pricing constants in source are unchanged. | Rendered check on the plan and review screens; source diff | LOCAL-QA, SOURCE | B |
| AC-R06 | Independent QA does not use, change or charge the Director's rehearsal account. | Fixture and effects record | LOCAL-QA | B |

## E — Emails and Stripe (external configuration)

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-E01 | A restyled sign-in email body and subject are prepared from the Director's export of the live template. Compared with that export, the link construction, every conditional branch, the parameter names and the `&amp;` encoding are unchanged; only presentation differs. | Line diff of the prepared body against the export | SOURCE | B |
| AC-E02 | After the Director applies the restyled template on the DEV Supabase project, these real deliveries succeed and each mail shows the approved names, logo and colors: (1) an emailed sign-in to OwedBook that lands on OwedBook, on alpha and on local; (2) an emailed sign-in to Account & Billing that lands on Account & Billing, on alpha and on local; (3) one existing OwedBook store invitation, sent from OwedBook, accepted, with the invited person scoped to that one pharmacy, on alpha, and on local where the local build supports it. There is no invitation feature in Account & Billing and none is added. Invitation checks use the designated Gate D invitation fixture, never the rehearsal account. No purchase is made. The post-purchase access email is not claimed by this criterion (see `CONTRACTS/EMAIL_AND_STRIPE.md` 1.2). Matrix, fixture and permitted effects: `CONTRACTS/EMAIL_AND_STRIPE.md` 1.2 and `QAM/GATE_D_PLAN.md`. | Director session led by the QA Lead, one check at a time; results recorded as Director-observed | ALPHA, DIRECTOR (DEV project) | D |
| AC-E03 | Billing notices use the approved names in sender display name, subjects and body. The only link is still `/billing`. The idempotency key shape is unchanged. The deployment record shows no notice was claimed or retrying when the wording went live. | Source diff; read-only check recorded at deployment | SOURCE, ALPHA | B for source; D for the deployment record |
| AC-E04 | The Stripe sandbox shows the logo, icon, button color and the nearest offered font and shape, applied by the Director from prepared values. Names follow D-03 and the ruling on P-05 and P-06. Before and after previews of Checkout, the billing portal, an invoice and a receipt are recorded. No new purchase is made for this check. | Director session; screenshots; billing portal opened for an existing fixture customer | DIRECTOR | D |

## D — Deployment and alpha verification

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-D01 | Each alpha service is redeployed from a clean committed tree with its existing `./deploy.sh`, only under the Director's authorization. Read-back shows the expected commit, a new revision, working canonical HTTPS, and the other services unchanged. | Deployment receipt; build-info read-back | ALPHA | D |
| AC-D02 | On alpha, the Director signs in to both apps, moves between them, opens Help, and sees the rehearsal account unchanged: three pharmacies active, three at renewal. No purchase is made. | Director ride led by the QA Lead | ALPHA, DIRECTOR | D |

## P — Publication alignment

| ID | Requirement | Method | Env | Blocking |
|---|---|---|---|---|
| AC-P01 | The Engineer delivers a list of every customer-visible label, route name or screen title that changed, so the tester guide and Help stay aligned. Updating the tester guide itself is a follow-up outside this module. | Read the list; spot-check against rendered screens | SOURCE, LOCAL-QA | B |

## What these criteria do not claim

A Gate Q PASS certifies only the rows marked B. A successful deployment certifies nothing by itself. The module closes only when the D rows also have their evidence (`QAM/GATE_D_PLAN.md`).

Passing this spec does not certify forced payment exceptions, exactly-once processing, scheduler-driven expiry or cutoff, support-led transfer, populated-claims isolation, the APA code, the full password matrix, production readiness or legal publication. Each stays as recorded in `CONTRACTS/BACKLOG_DISPOSITIONS.md`.

## Glossary

- **AC-xnn:** an acceptance criterion. Letter groups: V visual gate, B brand, L layout, N names and logo, H Help, F fixes, R regression, E emails and Stripe, D deployment, P publication.
- **Literal / translated:** the two ways the RFI look is applied (copied closely, or adapted for dashboards).
- **Coverage matrix:** the role by screen by state by width table the QA Executor proposes in Q1 and the QA Lead approves.
