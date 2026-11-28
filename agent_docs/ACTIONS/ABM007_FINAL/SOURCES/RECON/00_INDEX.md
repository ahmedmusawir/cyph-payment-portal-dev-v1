# ABM007_FINAL pre-ABM reconnaissance — index

**Date:** 23 November 2026, Asia/Dhaka · **Author:** Claudy (Engineering seat) · **For:** Friday, JARVIS, Director
**Nature:** read-only discovery. Not an ABM, not a plan approval, not a release.

## Baselines

| Repository | Branch | Full HEAD | Push remote |
|---|---|---|---|
| OwedBook `cyph-v1-dev` | `abm007-final` | `9597699b404afdbcd792a9b4da61c21abb10cdf8` | `Cyberize-Group/cyph-v1-dev` |
| Portal `cyph-payment-portal-dev-v1` | `abm007-final` | `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` | `ahmedmusawir/cyph-payment-portal-dev-v1` |

## Files

| # | File | Lines | SHA-256 | What it is |
|---|---|---|---|---|
| 1 | `00_INDEX.md` | — | (this file; not self-hashed) | This index |
| 2 | `ABM007_FINAL_PRE_RECON_REPORT.md` | 736 | `14765e3f562dd6c3d0b5e259f8a3d783819046810e01a6fed209a097767f2eae` | The consolidated report: sections 0 to 12 |
| 3 | `APPENDIX_A_COMMAND_EVIDENCE.txt` | 434 | `4158d6e15d1f57551278de28057706265819c130d32cff7aef84111e5037b247` | Sanitized output of the read-only commands behind the report's counts |

## Report map (task item → section)

| Task item | Section |
|---|---|
| Baselines, branches, worktrees, remotes | 1 |
| 1. Styling architecture, Tailwind, tokens, hardcoded colours, overrides, fonts, radius, shadows | 2 |
| 2. Theme switching; enforcing light only | 3 |
| 3. Screen and component inventory; canonical sample screens and style tile | 4 |
| 4. Logo assets, favicon and icons; asset-package plan | 5 |
| 5. Email templates, hosting, link logic to preserve | 6 |
| 6. Stripe integration, branding, remaining dashboard inspection | 7 |
| 7. Automated tests and reusable regression coverage | 8 |
| 8. Unresolved manual-QA items; Help page state | 9.1, 9.2 |
| 9. New conflicts, affected paths, dependencies, risks, effort | 9.3 to 9.7 |
| Register facts R-1 to R-9 answered | 10 |
| All gaps in one table | 11 |
| What was and was not done | 12 |

## Labels used in the report

**[V]** verified this session · **[P]** Engineering proposal or estimate · **[U]** unavailable, with the remaining check named.

## Sanitization

No secret, key, token, password, private address or environment-file content is included. Stripe identifiers are truncated to their last characters. The Supabase DEV project reference appears because it is written in tracked source (`src/server/mailGuard.ts`).
