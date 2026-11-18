# Implemented feature versus support procedure

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

Classify each operation before acceptance freeze. The Director approved operator commands plus written support procedures for transfer/recovery, without new customer-facing transfer screens. Exact per-operation classification is due under FR-05 at freeze; no item is marked delivered.

| Operation | Current direction | Required resolution |
|---|---|---|
| Paid Add Store and recovery | Implemented product journey | Exact state/payment contract from E1 |
| Invite/admin replacement/member revocation | Implemented product journey | D-02 role/identity policy |
| Scheduled removal and undo | Implemented product journey | D-03 last-store/cutoff policy |
| Store sale/transfer | Audited operator command plus support procedure approved | D-04 identifies implemented operator actions and document-only steps separately |
| Account-owner transfer | Operator/procedure approach approved; exact action scope from E1 | Separate from store sale; define previous/new owner billing rights |
| Sole-admin recovery | Operator/procedure approach approved; exact mechanism from E1 | D-02/D-04 define implemented action and audited manual evidence |
| Owner identity recovery | Operator/procedure approach approved; exact mechanism from E1 | D-04 evidence, authority, audit and access effect |

A support procedure is graded as a document for completeness, authorized actor, inputs, exact steps, audit, failure/recovery and exclusions. It is not tested or advertised as an implemented feature. Any software action it invokes still requires independent behavior/authorization tests. Selecting document-only delivery requires an attributable scope decision before freeze; it cannot erase agreed transfer/recovery obligations by labeling them “support.”
