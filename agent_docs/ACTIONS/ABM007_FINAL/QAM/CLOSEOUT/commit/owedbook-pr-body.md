## ABM007_FINAL: Pharmacy Books branding, Help page and repairs

Merges `qa/abm007-final` into `main`. **Merge with "Create a merge commit". Do not squash or rebase. Do not delete the branch.**

| Item | Value |
|---|---|
| Certified commit (head of this pull request) | `025c578f7ab0879bede38384c8a2ad63de8ba3c4` |
| Base | `main` at `9597699b404afdbcd792a9b4da61c21abb10cdf8` |
| Gate Q | PASS WITH KNOWN RISK, QA Lead, 28 November 2026 |
| Manifest | `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603`, 2,314 files, zero mismatches on the certified commit |
| Unit tests | 409 of 409; typecheck, lint and production build clean |

### What is in it

- The Pharmacy Books brand across OwedBook.
- The Help page: 13 articles, a contents menu, "Go to the Top" at the end of each article.
- Repair work order RWO-01 (nine items) and add-ons A1, A2 and A3.
- No migration, no dependency change, no deployment-configuration change.

### What it does not do

- It does not deploy. Gate D is open, and `main` is frozen until Gate D passes.
- Four payment journeys and one price check run at Gate D on alpha (ruling AM-21). They block module closure.

Records: Account & Billing repository, `agent_docs/ACTIONS/ABM007_FINAL/QAM/CLOSEOUT/`.
