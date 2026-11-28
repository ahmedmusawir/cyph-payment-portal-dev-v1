# Q4 effects ledger — final reconciliation

| Effect | Release | Automated use | Director report or closeout |
|---|---|---|---|
| SCRATCH sign-in attempts | Up to 80 for automation. Owner B reserved for the Director. | 57 of 80, including unsuccessful setup attempts. No automated Owner B attempt. See Q4/01/session-ledger.jsonl. Sign-outs or unconfirmed cleanup are in the run evidence. The interrupted warm Firefox context has no confirmed sign-out. | Owner B by password. Exact session count and final sweep sign-out were not captured. W-01 passed by direct confirmation. |
| Portal dashboard and billing GETs | Permitted app-initiated read-only lookups. | 283 observed requests, 111 document loads and 172 fetches, including navigation/prefetch. The count is browser requests. See Q4/01/portal-loads.jsonl. | Manual load count not captured. |
| Mock OwedBook build | AC-L02 only. | One mock build and two width measurements. The real build was restored. | Real production builds served for walkthrough 04. |
| Busy Login stub | R-03 held browser stub. | Six intercepted requests across the released engine/width pairs, no auth-provider request from the stub. | W-05 report preserved separately. |
| Email, invitations, acceptance, Member removal, role change, fixture create/reset or credentials | None in Q4. | Zero. | Tony reported no prohibited action. |
| Hosted billing-portal opening, Checkout, purchase, schedule or undo, listener, Stripe write | None in Q4. | Zero. | Tony reported no prohibited action. AM-21 retains payment checks for Gate D. |
| DEV, alpha, rehearsal account or Coach data | None. | Zero. | No such action reported. |
| Product edits, Git mutation, deployment or dashboard changes by QA | None. | Zero. | Separate later Portal records drift is reported in closeout-live-identity.json. |
| Walkthrough preparation and closeout | Two fresh production builds on request, localhost build-info/ownership/manifests, shutdown after package verification. | Both gated rebuilds passed. Closeout used local build-info reads and process checks. See RESTARTS and Q4/06. | Servers for manual walkthrough were verified against SCRATCH. |

Manual results and scope statements are attributed to Tony. The ledger preserves the automated effects and the authorizations separately.
