# Environment and effect preparation

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

## Known from the handoff, not freshly observed
DEV Supabase `yrsuwikjnbmvpznrgydb`; SCRATCH `ihgcsrypblqkwommrkgj`; local OwedBook :3000 and Portal :3001; staging `https://owedbook.cyberizedev.com` and `https://owedbook-payment.cyberizedev.com`. Verify each target before use. Current ports and shared services remain owned by 007A until handoff.

## Per-pass authorization
| Pass | Effects now authorized by this pack | Preparation needed |
|---|---|---|
| Planning/review | Local documents only | None |
| E1 source recon | No execution release recorded | Named snapshot, executor, output path, read authority |
| E1 capability probes | None | Grouped exact capsule if needed |
| E2 | None | Engineering effect capsule after recon |
| Q1 | None | Candidate, allowed setup/probes and QA lane |
| Q2/retest | None | Friday-approved plan and Director release |
| Deployment/Gate D | None | Named revisions, targets and bounded operations |

## Budget worksheet — fill from evidence before each applicable release
For each row record target, controlled identity/namespace, operation, unit, estimated attempts, hard maximum, retry policy, counter source, cleanup/retention owner and reset authority. Values are UNSET, not zero-cost or unlimited.
- Auth identity creates, sessions, refresh, sign-out and generated links.
- Invitation/reminder/sign-in email dispatch attempts and actual inbox checks.
- Stripe reads, customers, subscriptions, invoices, payment attempts, hosted sessions, test clocks and clock advances.
- DB reads/writes, new migration applies, SCRATCH rehearsal cycles and seed/cleanup mutations.
- Browser contexts, ports, build prerequisites, webhooks and reconciliation workers.
- Deploy builds, revisions, configuration updates, DNS and rollback actions.

Failures/retries consume budgets. Separate observational counters from hard limits; do not invent tiny read ceilings. Existing 007A objects/allowances are not automatically reusable. Prefer owned synthetic fixtures and a declared recipient allowlist; validate test guards before any email-capable test. Do not expose inboxes or keys in exports.

Wrong identity, unsafe effects, missing authority, invalid instruments and privacy exposure stop affected work. Product FAIL alone does not stop safe independent checks. Keep an audit of attempted effects and resumable state.

## Friday's QA capsule requirements
Prepare one measured QA effect capsule with explicit phase reservations and cumulative accounting. Size sign-ins, new identities, emails, sandbox customers/checkouts/subscriptions, test clocks/advances, DEV writes and SCRATCH cycles from observed volume in approved recon/engineering; do not guess or inherit 007A allowances. Candidate-specific approval follows Q1. Explicit Director authority is required for isolated sandbox test-clock mutations; merely listing them is not permission.

Reserve new-identity/payment/email journeys for the final repaired candidate. Run controlled repeatable probes first. Every send attempt counts; validate a default-on mail guard before the first send in every harness. The private controlled cast is in `QAM/TEST_IDENTITIES.md`.
