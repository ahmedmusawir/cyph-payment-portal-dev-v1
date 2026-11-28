# "Free trial" wording on the OwedBook public opening page (RWO-01 R-01, ruling AM-18)

**Update, add-on A1 (ruling AM-22, 26 November):** the Director ruled on this list. Both places below now read "Subscribe Now" and open the Account & Billing home page. **No "free trial" wording remains on the opening page.** The scan is in `RWO01_A1_ENGINEERING_REPORT.md` section 2 and `measure/measure_a1_after.json`. The list below is kept as it was returned.

For the Director's ruling. Listed only; none of it was changed.

The page-body button that read "Start free trial" is now "Subscribe Now" (R-01). After that change, "free trial" appears in two places on the opening page. Both are in the page's header, not its body.

| # | Where on the page | Wording | Shown at | Opens | Source |
|---|---|---|---|---|---|
| 1 | Header, right side, green button beside the "Log in" link | **Start free trial** | 1024 wide and above | OwedBook login (`/auth`) | `src/components/global/UserMenu.tsx` line 81 |
| 2 | Header mobile menu (after pressing **Menu**), green button under "Log in" | **Start free trial** | below 1024 wide | OwedBook login (`/auth`) | `src/components/global/MobileNav.tsx` line 103 |

Checked two ways: a search of the OwedBook source for "free trial" in any letter case, and a scan of the rendered opening page at 375 and 1440 wide (`measure/measure_after.json`, `free_trial_text`).

Things to weigh:
- The header now offers "Log in" and "Start free trial", and the page body offers "Subscribe Now" and "Log in". The header's green button still opens OwedBook login, while the body's green button opens Account & Billing.
- Two unit tests name the header wording (`src/__tests__/global/UserMenu.test.tsx`, `src/__tests__/global/MobileNav.test.tsx`). They change with it if you rule a change.

No other OwedBook page or email says "free trial". The page description, tab title and trust line do not use the phrase.
