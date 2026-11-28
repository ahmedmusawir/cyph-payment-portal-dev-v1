# Changed customer-visible labels, routes and titles (AC-P01)

For aligning the tester guide and Help. Text changes only; a control that merely lost its uppercase styling keeps its words and is listed once at the end. Source of truth: the working-tree diff against each baseline.

## OwedBook

| Where | Before | After |
|---|---|---|
| Browser tab title (all pages) | Cyber Pharma | OwedBook · Pharmacy Books |
| Page description (metadata) | Pharmacy revenue recovery — get back every dollar you're owed. | OwedBook by Pharmacy Books: pharmacy revenue recovery — get back every dollar you're owed. |
| Signed-in top menu | OwedBook · Admin Portal · Profile | OwedBook · Admin Portal · Profile · **Help** (new) |
| New route and page | — | `/help`, heading "Help", tab title "Help · OwedBook · Pharmacy Books" |
| Signed-in header, narrow screens | Icon-only menu button | Button shows **Menu** / **Close** (accessible names "Open menu" / "Close menu" unchanged) |
| Theme control (header and mobile menu, landing header) | Theme menu | Removed (D-01) |
| Home link accessible name | Cyber Pharma — Home | Pharmacy Books — Home |
| Header brand | Cyber Pharma logo | Logo tile, "Pharmacy Books", "OwedBook" beneath |
| Landing page links | Features, How it works, Pricing (desktop and mobile) | Removed (sections never existed, P-08) |
| Landing hero button | Schedule a demo (pointed at a missing `#book-demo`) | Removed |
| Landing lead | "Cyber Pharma audits every claim…" | "OwedBook audits every claim…" |
| Landing screenshot | Product mock-up image | Removed (P-08; see `VERIFICATION.md`) |
| Landing mobile menu | Menu icon | Button shows **Menu** / **Close** |
| `/auth` sign-in | Card titled "Login", "Log into your account with your credentials" | Masthead "Login", "Log into your account with your credentials, or ask for a sign-in link."; password card headed **Sign in with your password** |
| Access denied page | Tab "Access Denied — Cyber Pharma"; "If you administer Cyber Pharma at the platform level…" | "Access Denied — Pharmacy Books"; "If you administer Pharmacy Books at the platform level…" |
| `/invitations` | No header | Navy brand bar (no navigation added) |
| Store selector | "No permitted stores" shown above real stores | Shown only with zero permitted stores; "Loading stores…" only while loading (AC-F01) |

Unchanged on purpose: **Logout** (desktop account menu) and **Log out** (mobile menu), by ruling AM-08 (6).

## Account & Billing (Portal)

| Where | Before | After |
|---|---|---|
| Browser tab title | Cyber Pharma — Subscription Portal | Account & Billing · Pharmacy Books |
| Page description | Cyber Pharma subscription portal (foundation). | Pharmacy Books Account & Billing: your subscription, pharmacies and invoices. |
| Footer line | Pharmacy Books · a Cyber Pharma product | Pharmacy Books · Account & Billing (P-22) |
| Header brand | Coral symbol, uppercase wordmark | Logo tile, "Pharmacy Books", "Account & Billing" beneath |
| Narrow-screen menu buttons (signed-in and public) | Icon only | Button shows **Menu** (accessible names unchanged) |
| Theme control (both headers) | Theme menu | Removed (D-01) |
| Sign-in, auth and registration pages | Plain heading with eyebrow | Masthead with the same title and eyebrow text; eyebrow now paired with "Pharmacy Books" |
| Billing notice sender (default) | Cyber Pharma <no-reply@cyberizedev.com> | Pharmacy Books <no-reply@cyberizedev.com> |
| Billing notice subject (payment failed) | Payment failed for your Cyber Pharma subscription | Payment failed for your Pharmacy Books subscription |
| Billing notice subject (read-only warning) | Your Cyber Pharma account becomes read-only in 48 hours | Your Pharmacy Books account becomes read-only in 48 hours |
| Billing notice closing line (both) | …because you own this Cyber Pharma account. | …because you own this Pharmacy Books account. |

## Styling-only changes (same words)

Buttons, pills, role labels and the wordmark are no longer shown in capitals (both apps). Role labels (Owner, Store admin, Member) are neutral outlined labels in both navbars, the Portal account menu and OwedBook's people list (P-04). Status words are unchanged.

## RWO-01 repair work order (26 November 2026)

New and changed labels from repair items R-01 to R-03 (rulings AM-18 and AM-19). No other label changed in either app.

### OwedBook

| Where | Before | After |
|---|---|---|
| Public opening page, green button | **Start free trial**, opening OwedBook login (`/auth`) | **Subscribe Now**, opening the Account & Billing home page at its configured address (R-01) |
| Public opening page, beside the green button | — | **Log in** (new navy button), opening OwedBook login (`/auth`) (R-01) |
| Help, bottom of the "On this page" contents menu | — | **Go to the Top** (new link), returning to the top of the page (R-02) |
| `/auth` password sign-in button, while signing in | **Login** (disabled, spinner above it) | **Logging in…** (disabled, marked busy for assistive technology, spinner kept). At rest it still reads **Login** (R-03) |

Add-on A1 (ruling AM-22, 26 November):

| Where | Before | After |
|---|---|---|
| Public opening page header, green button (1024 wide and above) | **Start free trial**, opening OwedBook login (`/auth`) | **Subscribe Now**, opening the Account & Billing home page at its configured address (A1-1) |
| Public opening page phone menu, green button (below 1024 wide) | **Start free trial**, opening OwedBook login (`/auth`) | **Subscribe Now**, opening the Account & Billing home page at its configured address (A1-1) |
| Help, end of the Help text, below 1024 wide | — | **Go to the Top** (the same link as in the contents menu; not shown from 1024 wide) (A1-2) |

No "free trial" wording remains on the opening page. **Log in** in the same header and phone menu is unchanged.

Add-on A2 (ruling AM-23, 27 November). The words do not change; the link's place does:

| Where | Before | After |
|---|---|---|
| Help, end of each of the 13 articles, inside the article, at every width | — | **Go to the Top** (new place), returning to the top of the page (A2-1) |
| Help, bottom of the "On this page" contents menu | **Go to the Top** (R-02) | removed (A2-1) |
| Help, end of the Help text, below 1024 wide | **Go to the Top** (A1-2) | removed (A2-1) |

So the two **Go to the Top** rows above (R-02 and A1-2) no longer describe the product. The label now appears 13 times on Help, once per article.

Help quotes none of these labels, so the Help label table is unchanged.

### Account & Billing (Portal)

No label changed. Repair items R-04, R-08 and R-09 change size, corner, spacing and wrapping only.

