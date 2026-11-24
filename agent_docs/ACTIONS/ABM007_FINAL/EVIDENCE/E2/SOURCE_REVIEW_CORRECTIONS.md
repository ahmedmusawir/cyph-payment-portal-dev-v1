# Source-review corrections (Architect findings relayed 24 Nov; `SOURCES/DIRECTOR_E2_CONTINUATION_2026-11-24.md` item 1)

All edits are in allowed paths (`CONTRACTS/NO_BREAK_AND_PATHS.md` section 3), uncommitted. Results are engineering CLAIMS for QA to test.

## A. Surface-aware keyboard focus

**Finding confirmed.** `.pb-on-dark :focus-visible { outline-color: white }` matched every descendant of a dark surface. Two places were affected:
- The Portal's `PublicShell` marks the whole public area `pb-on-dark`, so every control inside the white sign-in and registration cards had a white ring on white.
- OwedBook's two white mobile menus (`Navbar.tsx`, `MobileNav.tsx`) sit inside navy `pb-on-dark` headers and had the same problem.

**Fix (identical in both stylesheets, `@layer base`).** Each surface names the ring for what sits on it in one inherited property. Inheritance makes the nearest surface win at any depth; no single global color was imposed.

```
:focus-visible { outline: 2px solid hsl(var(--pb-focus-ring, var(--ring))); outline-offset: 2px; }
.pb-on-dark, .pb-backdrop, .pb-masthead { --pb-focus-ring: var(--ring-on-dark); }   /* white on navy */
.pb-on-light, .pb-shell, .pb-card, .pb-notice { --pb-focus-ring: var(--ring); }     /* navy on white and tints */
```

- Tailwind's `ring` color (used by `focus-visible:ring-ring` on inputs, radio cards and the password toggle) now reads the same property: `hsl(var(--pb-focus-ring, var(--ring)))` in both `tailwind.config.ts`.
- The `:root` token block is unchanged (token pins still pass).
- Portalled menus, sheets and dialogs render under `<body>` and take the light default.
- Explicit markers were needed in only three places: `pb-on-light` on the OwedBook signed-in mobile panel (`Navbar.tsx`) and the landing mobile panel (`MobileNav.tsx`); `pb-on-dark` on the Portal skip link (`Footer.tsx`), which always appears over the navy top band of both reachable shells.

**Regression found by the new keyboard walk, and fixed.** My E2 restyle had made OwedBook's signed-in mobile panel an overlay (`absolute top-full z-50`). At baseline it was in the page flow. Tabbing past **Log out** moved focus onto Help content hidden underneath the panel: focus was obscured. The panel is back in the page flow, keeping its white surface and the baseline dismissal handlers. The walk now checks that nothing covers the focused control.

**Pre-existing, not changed (recorded for QA):** the landing-page mobile menu (`MobileNav.tsx`) was already an overlay at baseline (`absolute top-[84px] … z-50`). The walk found no obscured focus on it at 375 px.

**Evidence:** `rendered_final/console.txt` and `rendered_checks_v2.json`. The checks were 154 keyboard focus stops on the public pages, the three open public mobile menus, and the Help and signed-in Navbar markup at 375 and 1440 px. Every stop passed: 49 white rings on navy, 105 navy rings on white, lowest measured side 4.53:1, none obscured. The seeded control (a white ring on white) failed at 1:1 at both widths. Unit pins: `src/__tests__/abm007/focus-surface.test.ts` in both apps.

## B. Help mobile role table

The role table is now rendered from one data source in two presentations:
- **md and up:** a real `<table>` with a caption, column headers and row headers. The minimum width is removed.
- **Below md:** a list (`aria-label` "What each role can do"). Each task is an item, with Owner, Store admin and Member as `<dt>`/`<dd>` pairs.

The md breakpoint matches the app's data tables, which already stack this way (UI_SPEC: "Tables stack as labelled pairs below their fit breakpoint"). Only one presentation is displayed at a time. All six tasks and eighteen answers are unchanged.

Evidence:
- Unit test `help-page.test.tsx`: every item and pair equals the table's content, and there is no minimum width.
- Rendered at 375 px: list shown with 6 items, table hidden, 0 overflow.
- Rendered at 1440 px: table shown, list hidden.

**Limit:** `/help` needs a signed-in session, so this was rendered as the real component markup on a served page with the built stylesheet, not on the signed-in route (S-2).

## C. Remaining legacy logo reference (S-3, proposed exception only)

`src/components/portal/references/EmailPreview.tsx:62`. The file is unreachable: nothing reachable imports `EmailReferenceView` or `StoreResultView` (`portal_unreachable.txt`). The Portal's allowed paths cover `src/components/portal/**` for **reachable files**, so this file is outside them. **Not edited; not deleted.**

Proposed exact one-line diff, for the Director's narrowly scoped exception:

```
-          <img src="/logo-color.svg" alt="" className="h-7 w-7" />
+          <img src="/brand/pharmacy-books-logo-primary.png" alt="" className="h-7 w-auto" />
```

`w-7` becomes `w-auto` on the same line. The approved master is 1024 × 543, so a forced 28 × 28 box would distort the mark, and altering the mark is not authorized (AM-08 (2)). The asset is the unaltered master already in `public/brand/`.

## D. Help authorization interpretation

Recorded as **AM-12** and attributed to the **Architect**: a Member following Help's `/admin-portal` link is redirected to `/owedbook` by the existing guard, and that is expected behavior. No guard was changed. AC-H03 independent QA verification is retained.
