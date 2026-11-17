# Role by action — draft to bind to actual operations

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

Every new server operation discovered in E1 must map to a row and exact endpoint/function before freeze. “Own” means independently verified account/store authority, never client-supplied IDs. This is a proposed coverage matrix, not a statement that these endpoints currently exist.

| Action | Owner | Store admin | Member | Signed out | User from another account |
|---|---|---|---|---|---|
| Add Store quote / confirm / retry / abandon | Own account only | Deny | Deny | Deny | Deny for target account |
| Read pending store operation / payment state | Own account only | Deny | Deny | Deny | Deny |
| Activate pending store directly | Deny browser grant; trusted payment handler only | Deny | Deny | Deny | Deny |
| Read pending store data | Deny until activation | Deny | Deny | Deny | Deny |
| View/manage account billing | Own account only | Deny | Deny | Deny | Deny |
| Invite / resend / revoke admin invitation | Own store only | Deny | Deny | Deny | Deny |
| Invite / resend / revoke member invitation | Own store, proposed pending D-02 | Assigned store only | Deny | Deny | Deny |
| Display invitation landing by GET | No access grant; no redemption | Same | Same | May show safe confirmation/login entry, no grant | No access grant |
| Accept invitation by explicit POST | Only exact eligible recipient/target | Only exact eligible recipient/target | Only exact eligible recipient/target | Must complete approved identity verification | Eligibility requires D-02; arbitrary cross-account/store acceptance denied |
| Accept while wrong user signed in | Deliberate switch required | Same | Same | Not applicable until identity established | Deliberate switch; no silent grant |
| Replace store admin / cancel replacement | Own store only | Deny self-elevation | Deny | Deny | Deny |
| Remove member | Own store, proposed pending D-02 | Assigned store only | Deny | Deny | Deny |
| Remove/replace last effective admin | Atomic approved replacement/recovery only | Cannot orphan store | Deny | Deny | Deny |
| Schedule / undo store removal | Own store only, D-03 cutoff | Deny | Deny | Deny | Deny |
| Execute transfer / owner recovery | Request via approved support process; no unrestricted direct execution | Deny | Deny | No grant | No grant |
| Modify protected ownership/Stripe fields | Deny arbitrary mutation; approved server operation only | Deny | Deny | Deny | Deny |
| Read historical data after transfer | Only as explicitly ruled | Only as explicitly ruled | Only as explicitly ruled | Deny | Deny; buyer denied by default absent ruling |
| Run test clock / reminder worker / webhook reconciliation | No end-user authority by owner role | Deny | Deny | Deny; authenticated trusted worker/provider boundary only | Deny |

Support/operator service identities are a distinct authority lane: define operator authentication, eligibility evidence, action allowlist and audit under D-04; never infer support powers from an ordinary account owner. Buyer account billing belongs to buyer; seller keeps billing authority only for seller's remaining account. For account-owner replacement, the former owner loses that account's billing rights. These are different operations.

Existing-user invitation is retained. D-02 must resolve whether a user already affiliated with another account can legitimately accept an invitation; until resolved, the pack must not silently grant that permission. Friday's cross-target denial tests must always reject tampering with the invite-bound account/store, regardless of the chosen eligibility rule.
