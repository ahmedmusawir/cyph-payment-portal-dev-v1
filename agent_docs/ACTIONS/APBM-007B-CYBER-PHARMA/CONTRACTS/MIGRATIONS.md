**Build contract v1.0 · 16 November 2026, Asia/Dhaka · JARVIS. Friday: ACCEPT WITH EXACT AMENDMENTS (BP-01…BP-09 applied in this successor; Friday's successor diff confirmation NOT received). E2 RELEASED by Tony (Director), 16 November 2026 — verbatim in APBM_JOURNAL.md. Header status updated 17 November 2026 by Claudy on Director ruling 5; contract text unchanged.**

# Forward schema sequence and permissions

E1 source verified 0001–0060; live ledger check precedes any apply. Do not edit those files. Freeze new files as below; if 0061+ already exists at E2 entry, stop conflicting migration work and reconcile the delta, do not renumber blindly.

| File | Contents/dependencies |
|---|---|
| 0061_007b_identity_clock_foundation.sql | pharmacy_identities canonical NPI backfill and businesses.pharmacy_id; lifecycle dates/status; test context/timestamp columns and guarded billing_now defined AFTER its dependencies. Backfill preserves all historical IDs/data. Assert existing duplicate/fixture states, report incompatible rows without deletion. |
| 0062_007b_store_operations.sql | quotes, store_operations, provider_invoice_operations/history, account lease/fencing and idempotency constraints, reservation extension for add/transfer. Unique invoice mapping; persisted money intent. |
| 0063_007b_lifecycle_transfers.sql | canonical identity active-index transition, removal/undo/finalize, transfer authorization/activation; replace access helpers and ALL direct/definer tenant predicates. Historical seller-owner read RPCs. No period where two active NPI owners or cross-owner histories are reachable. |
| 0064_007b_invitations.sql | invitation lifecycle, atomic acceptance/admin transition, member revocation; account read-only grants enforcement and access-reduction exceptions. |
| 0065_007b_notices.sql | notice kinds/statuses, durable claims and job queries; suppress old deferred reminder rows with history, no dispatch during migration. |
| 0066_007b_operator_audit.sql | append-only operator_actions, verified owner/admin recovery and command guards; account owner uniqueness only after inspection and explicit incompatible-data disposition. |
| 0067_007b_reads_privileges.sql | owner/store/invitation/history read contracts, final privileges/catalogue assertions and compatibility checks. |

All seven are independently prefix-valid, transactional with ledger row, forward-resumable. No early function references a later column/table. Every definer function sets empty search_path and qualifies names. Revoke default PUBLIC/anon execute, grant only declared callers. New operation/quote/invoice-map/notice/transfer/operator tables: RLS on, no browser CRUD; service-only mutations. User invitation/member/owner reads via explicit user-auth RPC with internal authority checks. Test two accounts and owner/admin/member/foreign/signed-out on every new function/table. Service role does not count as user-negative proof.

READ-only live inventory includes migrations, privileges, existing nonactive fixtures, NPI duplicates, owner duplicates and deferred reminder counts. Incompatible data blocks only affected apply; no fixture deletion/normalization is granted. Fresh+upgrade+interrupted-forward SCRATCH rehearsals precede DEV apply checkpoint. Preserve data/Auth and all applied SQL checksums. No DEV reset, no restore-install requirement resurrected; accepted full-restore limitation remains.

Compatibility/rollback is a forward fix with current invariants. Never restore the old my_business_ids body if that would reopen removed/transferred data. Prefer stop writes/serve safe reads and forward repair; rehearse access fencing across rollback-compatible app revisions. Generate Supabase types after approved schema changes without embedding secrets.
