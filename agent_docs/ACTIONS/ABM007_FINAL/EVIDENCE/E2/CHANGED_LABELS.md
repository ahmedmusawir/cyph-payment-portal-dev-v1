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
