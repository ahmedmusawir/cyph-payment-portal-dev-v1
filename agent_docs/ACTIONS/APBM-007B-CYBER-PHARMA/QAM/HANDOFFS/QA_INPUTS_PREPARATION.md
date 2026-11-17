# QA private input preparation — Cody

No Q2 execution, signup, login, email, provider mutation, database write or webhook change. SCRATCH Auth metadata read only. Existing .env.qa.local was ignored/untracked; permissions tightened from0664 to0600. Legacy values preserved. Legacy email has no matching SCRATCH Auth user; cannot assign EXISTING_INVITEE or assume owner. No password authentication tested. Engineering cast deliberately not reused: accepted admin/member invitations and OWNER_B cross-account membership changed isolation; cleaned provider fixtures are unsuitable defaults.

QA_RUN_ID generated privately. Role/inbox companion files outside Git under restricted0700 run directory; files0600. No secrets or addresses in this report. Authoritative input path: Portal .env.qa.local. All eight mappings are proposals awaiting valid addresses and existing role verification; no fabricated identity/ownership claims.

| Role | Proposed requirement |
|---|---|
| OWNER_A | Existing SCRATCH QA owner of account A; controlled owner inbox; ordinary multistore fixture after Q2 release. |
| OWNER_B | Distinct existing SCRATCH QA owner of account B; separate controlled inbox; APA fixture after release. |
| STORE_ADMIN | Existing separate QA user assigned admin only in intended A store; not owner; final membership verified read-only before execution. |
| MEMBER | Existing separate QA user assigned member only in intended A store; not admin or owner. |
| FOREIGN_OWNER | Distinct existing QA owner of account C with no membership in A or B. |
| NEW_ADMIN | Unused controlled recipient, absent from SCRATCH Auth and invitations; no password now; preserve until final-candidate test. |
| NEW_MEMBER | Different unused controlled recipient, absent from SCRATCH Auth and invitations; no password now; preserve until final-candidate test. |
| EXISTING_INVITEE | Existing separate SCRATCH Auth identity, controlled inbox; no intended target-store membership before invite; not engineering cast. |

## Inbox method

Use supported manual observation, not an invented adapter. INBOX_ADAPTER remains blank; INBOX_ACCESS_FILE points to an empty `inboxes` list (zero automated access). Tony checks controlled mailboxes during the one grouped session: invitation receipt/content, two billing notices, and any inaccessible hosted challenge plus T030 visual wording review. Record each expected subject/send-time/provider-reference, named human observer, observation time and verbatim report separately from automated provider receipts/browser/DB outcomes. Precise delivery time, headers/message bytes and sender authentication are not established by a human report. Link/capability values stay private. No manual observations claimed yet.

Existing engineering inbox.mjs hardcodes engineering cast and evidence paths: do not invoke it for QA. QA-owned adaptation or direct QA observation ledger must preserve its manual semantics; manual does not offer unattended link retrieval. Tony privately supplies any one-time sign-in link through a restricted local file during released execution; never chat/log/package it. Automated inbox credentials are not required for the approved manual method.

## Single private input request

In Portal .env.qa.local: enter ROLE_<ALIAS>_EMAIL for all eight aliases. For OWNER_A, OWNER_B, STORE_ADMIN, MEMBER, FOREIGN_OWNER and EXISTING_INVITEE enter ROLE_<ALIAS>_PASSWORD for existing password-login users (or privately specify their supported sign-in method if passwordless). These must already exist in SCRATCH; give exact intended account/store IDs and confirm relationships privately in role_mapping.json. NEW_ADMIN and NEW_MEMBER need distinct unused controlled inbox addresses only, no password or signup. Confirm Tony can open each recipient mailbox and privately relay the one-time link when required; otherwise give the actual authorized mailbox access method. No invented adapter or unnecessary mailbox password request.

All effects still require Q2 release; verify each supplied address/existence and actual membership before binding roles. New-recipient freshness is not assumed from an empty field. No change to approved plan hash.
