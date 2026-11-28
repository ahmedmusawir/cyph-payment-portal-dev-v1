# Director walkthrough sheet 04 — ABM007_FINAL, Q4

Cody prepared this sheet from Friday's Q4 retest order. JARVIS guides you one check at a time. Record your own words, result and time before proceeding to the next check. Friday adjudicates the returned evidence.

- OwedBook QA: http://localhost:3100
- Account & Billing QA: http://localhost:3101
- Branch on both repositories: qa/abm007-final. These builds use the repaired working-tree manifests pending Tony's commit.
- OwedBook manifest SHA-256: f229d7a129138af7cc97e1fdb5acadf885c1907ad7cd3c140f4bad5334a4d22d
- Account & Billing manifest SHA-256: ba726f5ea3f5bf2cdd8156a16360e7674be2da500be48c81cacac19ba682c4b9
- Target: SCRATCH, ihgcsrypblqkwommrkgj. The served build-info revision labels are the manifest hashes.
- Use desktop Google Chrome on the QA machine with ENGINEERING_OWNER_B. Read your password privately from the cast file. Do not put a password, address, sign-in link, code or session state in the sheet. Phone and tablet widths are browser viewport sizes.

My confirmation of candidate hashes, ports and SCRATCH:

Browser version, operating system, start time and timezone:

No emailed links, invitation, actual removal, billing-portal session, Checkout submission, purchase or setting change. At the first observed failure within a check, record what happened and stop that check. If a prerequisite is missing or the state cannot be seen, record BLOCKED. Do not repeat a sign-in to make a passing result. A read-only click and navigation are permitted. No real-phone test in this walkthrough.

## W-01 — Password handoff, return and sign-out

1. Begin signed out on OwedBook /auth. Sign in once with Owner B's password. While that request is in progress, look for the busy button behavior described in W-05. Keep your W-05 note for that check.
2. In OwedBook, open Admin Portal → Billing and choose Manage billing. This opens the local Account & Billing app. Verify the same account and no second sign-in. Leave the separate Manage billing control in Account & Billing untouched. That control opens the hosted provider.
3. Use Open OwedBook to return. Check the same identity.
4. Sign out. Reopen the two protected pages /owedbook and /dashboard on their respective ports and observe whether access is refused.

Expected: Same person on each crossing and protected pages refuse after sign-out. Allowed effects: one password session, normal handoff, sign-out and reads.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

## W-02 — Opening page buttons

1. While signed out, open OwedBook /. Compare body and header/drawer at 375px, 768px and 1440px. Open the menu at widths where it replaces the header items.
2. Check that green Subscribe Now and navy Log in are equally sized, stack when they cannot fit, and sit beside one another when they fit. Check that the header or phone menu also says Subscribe Now and no visible text says free trial.
3. Hover and Tab to the buttons. Look for visible hover and keyboard focus, particularly the navy Log in.
4. Follow each available Subscribe Now variant and confirm it opens the local Account & Billing home flow. Return and follow each Log in variant to the local OwedBook login page. Stop at the destination pages.

Expected: Correct styling, labels, focus and local destinations. Allowed effects: signed-out page reads and navigation.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

## W-03 — Portal sign-in header and footer at 768px

1. Open localhost:3101/login signed out and set the viewport to exactly 768px.
2. Look at the header Sign in text. Scroll to the footer and look at each link. Do not submit a form.

Expected: Sign in fits on one line. The footer links are stacked and centered, with the labels readable. Allowed effects: page reads and resizing.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

## W-04 — Help return to top

1. Sign in to OwedBook normally as Owner B if signed out. Open /help. At 1440px wide check Go to the Top is the last link in the contents menu. Move down the Help page and use it with the mouse, then with keyboard Tab and Enter.
2. At 375px wide, scroll to the end of the Help text and use Go to the Top there.
3. At 1024 × 600 or 1440 × 650, check the contents menu can scroll inside itself. Reach its last link and activate it.

Expected: Each link returns to the visible page header. At phone width the end-of-text link is present. Allowed effects: normal password session if needed, page reads, resizing, and navigation.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

## W-05 — OwedBook busy Login, Profile fields and support link

1. Record what you saw on the W-01 password click. The busy control should say Logging in…, show its spinner and prevent another press. Use the same observation rather than repeating a sign-in to catch it.
2. In your current Owner B session, open /profile. Look at the greyed-out name and email fields. Try focusing them with Tab. Do not edit any form.
3. Observe that the support link is dark green and underlined. Do not send a message.

Expected: Busy feedback, readable disabled fields that cannot be operated, and the styled support link. Allowed effects: previously authorized password session, reads and keyboard focus.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

## W-06 — Resized controls

1. On the OwedBook login and Profile pages and Portal login page, find the password reveal controls. Check that they are easy to reach and have visible keyboard focus.
2. On OwedBook /owedbook, check the data-view tabs and round account trigger at 1024px or wider. Scroll the data-view strip at phone width.
3. On the Portal dashboard, inspect the controls in a pharmacy row. Check their size and focus without activating a removal or undo.

Expected: The eye controls, tabs, account trigger and pharmacy-row controls look and behave like comfortably sized targets. Allowed effects: ordinary session reads and focus. No form submission or row action.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

## W-07 — Narrow billing and dashboard

1. Set the viewport to 320px. On OwedBook open /admin-portal/billing and /owedbook. On Billing & subscription, look at both edges of the Add store control and its helper text. Try scrolling sideways on the page, then inside the dashboard tab strip.
2. Check the local Account & Billing /billing and /dashboard at 320px as well. Look for a control or row that pushes the page sideways. Do not use the hosted billing action.

Expected: No page slides sideways or clips a primary control. The tab strip may scroll within itself. Allowed effects: signed-in reads, browser resizing and scrolling. Portal page reads may cause the app's normal sandbox reads.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

## W-08 — Main screen sweep

1. Sweep both apps at 375px, 768px and 1440px. OwedBook: opening page and sign-in after sign-out, and OwedBook, Help, Profile, My Stores, Billing & subscription, settings, audit and invitations while signed in. Account & Billing: sign-in after sign-out, dashboard and Billing while signed in, and the public plan page. View protected pages only with the normal Owner B session and existing links.
2. Look for unexpected movement, clipping, misplaced labels and any introduced layout issue. Only read the existing pages. Save no screenshot containing personal data or authentication material.
3. Sign out after the sweep and tell Cody you are finished. Leave blocked or unperformed actions identified as such.

Expected: No new visible layout break across the main screens. Allowed effects: normal password/session, handoff, sign-out, navigation and resizing.

My observation:

Result (PASS / FAIL / BLOCKED):

Time and timezone:

Notes:

Finish time and timezone:
