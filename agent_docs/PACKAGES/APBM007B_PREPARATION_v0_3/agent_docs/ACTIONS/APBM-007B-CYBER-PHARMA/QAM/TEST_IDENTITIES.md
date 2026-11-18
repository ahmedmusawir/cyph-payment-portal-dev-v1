# Controlled identity and inbox requirements

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

Friday requires the following cast, provided privately by Tony. These are aliases, not real addresses, identities or permission grants.

| Alias | Purpose | Required state before use |
|---|---|---|
| OWNER_A | Primary account, multiple stores, billing and staff workflows | Controlled inbox and approved owner account |
| OWNER_B | Independent tenant; cross-account denials and transfer tests | Controlled inbox and a genuinely distinct account |
| NEW_ADMIN | New invited administrator | Brand-new Auth identity at the final-candidate invitation test |
| NEW_MEMBER | New invited member | Brand-new Auth identity at the final-candidate invitation test |
| EXISTING_INVITEE | Existing-user invitation path | Existing user with eligibility recorded under D-02 |

Use a private file with a schema fixed in the final pack; validate readability, ignore/untracked status and values without printing them. No actual addresses/tokens/keys are part of this artifact. Availability checks must not consume the two brand-new invitees through premature account creation or sign-in. A separately declared controlled identity must support the fresh-owner purchase regression if required; the final 007A usage inventory determines whether one remains available.

The QA effect capsule counts identities, sign-ins, link generation, dispatch attempts and retries separately. Reserve one-time journeys for the final repaired candidate. No 007A allowance carries over. Mail guards must be on by default in all harnesses, prove allow/deny behavior with controls before first dispatch, and restrict actual sends to approved controlled recipients. Never use a service/admin token as proof of a normal user login.
