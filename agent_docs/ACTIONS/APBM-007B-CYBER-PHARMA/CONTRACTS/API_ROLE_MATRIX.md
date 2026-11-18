**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Complete planned operation/role map

Roles O=account owner, A=assigned store admin, M=member, X=foreign account, S=signed-out. “Recipient” is identity bound to the stored invite; cross-account recipient allowed. Trusted service/operator/provider authority never follows from a customer role. Each operation has matching SQL checks and negative tests. New route names below are Architect decisions; internal helper symbols may follow repo style without changing this boundary. Any additional discovered operation must be mapped before handoff.

| ID / app | Operation | Allowed | Denied / constraints | SQL/domain transition |
|---|---|---|---|---|
| A1 PP | POST /api/stores/add/quote | O own account | A/M/X/S; no pending row exposure | store_quote_create |
| A2 PP | POST /api/stores/add/confirm | O bound quote | altered money/account/expired/conflicting intent | store_operation_claim |
| A3 PP | GET /api/stores/operations | O own account | A/M/X/S | owner_store_operations |
| A4 PP | POST /api/stores/add/status | O exact operation | foreign ID/body activation result | reconcileStoreOperation → invoice/quantity read |
| A5 PP | POST /api/stores/add/abandon | O exact operation | no blind unpaid release | close/void/reconcile |
| A6 trusted | paid activation | trusted verified reconciliation only | all browser direct grants | store_add_activate |
| A7 all | pending-store data | nobody | no ownership row exists until activation | structural denial |
| R1 PP | POST /api/stores/[id]/removal | O own store | last billable store; A/M/X/S | store_removal_schedule |
| R2 PP | POST /api/stores/[id]/removal/undo | O before cutoff | at/after cutoff; A/M/X/S | store_removal_undo |
| R3 trusted | boundary finalize | job/operator/webhook | no end-user arbitrary time | store_removal_finalize |
| I1 OB | POST /api/stores/[id]/invitations member | O or A own store | M/X/S | invitation_create |
| I2 OB | same route admin role | O only | A/M/X/S | invitation_create (incumbent bound) |
| I3 OB | POST /api/invitations/[id]/resend | O or A for own member invitation | foreign/admin invite by A | invitation_resend_claim |
| I4 OB | POST /api/invitations/[id]/revoke | O/A as above | foreign | invitation_revoke |
| I5 OB | GET /api/stores/[id]/invitations | O/A own store | M/X/S | store_invitations_list |
| I6 OB | GET /invitations; GET /api/invitations/mine | signed-in recipient; S gets sign-in | GET never grants/consumes | my_invitations |
| I7 OB | POST /api/invitations/[id]/accept | exact verified recipient | wrong user/role/target/replay | invitation_accept |
| I8 OB | POST /api/invitations/[id]/decline | exact recipient | wrong user | invitation_decline |
| I9 OB | POST /api/stores/[id]/members/[uid]/remove | O or A own members | deleting effective admin; foreign | member_remove (access reduction allowed readonly) |
| I10 SQL | admin transition | accepted bound invitation only | stale incumbent/concurrent authority change | atomic lock/demote/promote |
| W1 PP | POST /api/webhooks/stripe | raw-body Stripe signature, mode/account | all customer authority; unresolved work non-2xx | durable event and exact invoice mapping |
| W2 PP | POST /api/internal/jobs/run | private operator/scheduler identity | O/A/M/X/S | expiry and notice claims |
| W3 PP | operator reconcile/list/quantity-check | protected shared operator | customer routes not substitute | safe read and exact-ID durable recovery |
| W4 PP | typed transfer/owner/admin/reactivate/store-operation-close commands | protected operator + actor/reason/ticket | free SQL, amounts, prefix/wildcards | operator audit + typed funcs |
| W5 PP/SQL | fixture attach/sync/disable clock | private local SCRATCH guard only | staging, DEV, user forged flags | guarded test context |
| W6 OB | GET /api/stores/[id]/history; owner archived claims | source seller owner only | buyer/staff/foreign; ordinary removed store | owner_history_* guarded original ownership |

Existing regression operations: Portal billing overview/portal/undo-cancel (owner), registration draft/quote/checkout/status (registration secret), auth/handoff routes both apps, OwedBook tenant/admin/claims/access-state reads. Preserve their actual source permissions; global platform role never grants cross-account billing.

Readonly: reads stay within tenant rules; new grants, Add Store and ordinary lifecycle changes denied; explicit revocation/recovery exceptions as IDENTITY contract. Grace remains normal access with banner. No trusted SDK key is exposed to clients.

BP04 W4 store-operation-close requires authoritative full refund/credit proof, terminalizes only that exact operation and releases its slot/hold; no refund or activation. BP05 W4 removed-store-reactivate authorizes same-account paid Add Store only; no quantity/access grant by the command. History default9 awaits Director ruling. Neither operation is a customer-access bypass.
