# Leftovers for the Director's removal decision (paths contract section 5; plan section 10 item 9)

Nothing below was deleted. List, ask, then remove.

| # | Repository | Path | Why it is a leftover |
|---|---|---|---|
| L-1 | Both | `public/brand/logo-color.svg`, `logo-lockup.svg`, `logo-mono.svg` (OwedBook); `public/logo-color.svg`, `logo-lockup.svg`, `logo-mono.svg` (Portal) | Old coral logo files. No reachable source references them now (see L-9 for the one unreachable reference) |
| L-2 | OwedBook | `public/next.svg`, `public/vercel.svg` | Framework placeholders, unreferenced |
| L-3 | Portal | `public/favicon-512.png` | Old icon, unreferenced |
| L-4 | OwedBook | `public/landing/owedbook-mockup.png` | Landing screenshot removed (P-08); file now unreferenced |
| L-5 | Both | `src/components/global/ThemeToggler.tsx` | No mount point remains (D-01). Unreachable |
| L-6 | OwedBook | `src/components/global/NavbarLoginReg.tsx` | No longer mounted (auth pages use `AuthShell`); its theme mount and old logo were removed in place |
| L-7 | Portal | `src/components/portal/HandoffShell.tsx` (theme-toggle mount at line 17, old styling) | Unreachable; not restyled by hand (UI_SPEC 3) |
| L-8 | Portal | `stark-deploy.yaml:106`, `cloudbuild.yaml:16` comments quoting the old sender | Protected deploy files; comments are now stale (plan PP-1). Not customer-visible |
| L-9 | Portal | `src/components/portal/references/EmailPreview.tsx:62` `<img src="/logo-color.svg">` | **Old-logo reference in an unreachable module (amendment E).** See below |
| L-10 | Portal | `e2e/helpers.ts`, `e2e/contrast.ts` | Shared helpers whose only importers were the 16 retired specs (check before removal); `e2e/gate-m.ts` is still used by the three live specs |
| L-11 | Portal | The 30 or so unreachable source files (`EVIDENCE/E2/portal_unreachable.txt`, static import analysis by `tools/reachable.py`) | Inherit tokens; not restyled, counted or tested (UI_SPEC 3) |

## Amendment E reconciliation: the old-logo scan

Scan: `grep -rn "logo-color\|logo-lockup\|logo-mono\|favicon-512" src e2e` in each repository.

- **OwedBook:** no reference.
- **Portal:** exactly one reference, `src/components/portal/references/EmailPreview.tsx:62`. The file is unreachable from any route (`portal_unreachable.txt`), and the allowed paths cover `src/components/portal/**` for **reachable files** only (paths contract section 3; UI_SPEC 3 "not restyled by hand"). An asset-reference-only correction (`/logo-color.svg` → `/brand/pharmacy-books-logo-primary.png`) would be one line, but it lies outside the allowed scope, so it was **not made**.
- **Consequence:** AC-N02's "the old coral logo files are not referenced by any source file" is **not met** on the candidate, and no clean scan is claimed.
- **Exception needed (Director):** either (a) authorize the one-line asset-reference change in `src/components/portal/references/EmailPreview.tsx:62`, or (b) rule that unreachable reference modules are outside AC-N02's "source file", or (c) authorize deleting the unreachable `references/` modules (with L-1). Until then the item is open.

Related, inside the allowed paths: `src/components/ui/dialog.tsx` is unreachable but sits in `src/components/ui/**`, which the allowed list does not limit to reachable files. Its scrim `bg-black/80` was the only hardcoded color left in either app (AC-B02), so that one token was changed to `bg-shadow-tint/80`; nothing else in that file was touched. `src/components/ui/textarea.tsx` (also unreachable) was restored to its baseline after an over-broad first pass.


## L-9 update (E2 completion, 24 Nov)

Still unchanged and still outside the allowed paths (unreachable module). The exact one-line proposed exception is in `SOURCE_REVIEW_CORRECTIONS.md` C:
`-          <img src="/logo-color.svg" alt="" className="h-7 w-7" />`
`+          <img src="/brand/pharmacy-books-logo-primary.png" alt="" className="h-7 w-auto" />`
Awaiting the Director's ruling (S-3). No reference module is deleted.

## L-9 resolved (24 Nov, AM-16)

The Director granted the exact one-line exception. `src/components/portal/references/EmailPreview.tsx:62` now reads `<img src="/brand/pharmacy-books-logo-primary.png" alt="" className="h-7 w-auto" />`. No other line was changed and the module was not deleted. The old-logo reference scan of both repositories (`logo-(color|lockup|mono).svg|favicon-512`, excluding `node_modules`, build output, Git and the module records) now finds **no reference**. The old logo **files** themselves remain as leftover L-1, awaiting the Director's removal decision.
