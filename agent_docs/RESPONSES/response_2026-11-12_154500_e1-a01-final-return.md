## E1 final consolidated return — all five items done; ready for the post-E1 review

The rapid-exchange proof passed, the handoff contract and the review amendments are written as proposals, the evidence is reconciled, and revision 6 of the review ZIP is built. No product code, database, setting or Git state was changed, no server was started and no email was sent.

### 1. Rapid sequential exchanges — passed (prototype)

Four session exchanges for one user (OWNER_2) finished in 4.6 seconds, alternating two separate cookie jars under the proposed per-app cookie names.

| Step | Jar | Result |
|---|---|---|
| OwedBook sign-in (stands for the source session) | OwedBook | Session for the right user, 1.16 s |
| OwedBook → Payment Portal | Portal, empty beforehand | Session, 1.14 s |
| Payment Portal → OwedBook | OwedBook | Session, 1.15 s |
| OwedBook → Payment Portal again | Portal | Session, 1.14 s |

- No refusal and no throttle.
- All four sessions were still valid afterwards, so a later exchange does not end an earlier one.
- Each jar held only its own cookie.

This is a script driving the provider. No app route, code table, browser or server took part, so it is not an implemented handoff. It shows that back-to-back crossings do not collide; the known collision needs two link tokens outstanding at the same moment.

It used 4 sessions. The allowance is now 30 of 32, so nothing was blocked, but only 2 remain.

### 2. Handoff SQL and API contract

`HANDOFF_CONTRACT_PROPOSAL.md` holds the draft SQL (review text only) and the route contract.

| Requirement | How the proposal meets it |
|---|---|
| Explicit verifier validation, atomic single redemption | The claim is one UPDATE that recomputes the challenge from the verifier and requires an unclaimed, unexpired row |
| Bad binding must not consume a valid code | State, verifier, audience and environment are all conditions of that same UPDATE; a mismatch changes nothing |
| Different user already signed in at the destination | The destination sends a one-way equality hint; the source issues no code and the destination shows a switch page. Nothing is replaced silently |
| Logout after claim, before the session exists | A completion step runs after the mint and before any cookie. If the user logged out in between it fails, and the new session is signed out |
| One automatic restart on collision | An attempt counter allows one fresh flow; a second failure shows a recovery page with "try again" and "sign in by email" |
| Existing users | Six purchaser states are covered. A signed-in existing purchaser gets a plain notice, not a sign-in link, which avoids the collision |

### 3. Review amendments

`REVIEW_AMENDMENTS.md` covers all seven, each with its E2 acceptance.

- **Password login** stays in both apps; the handoff never touches a password.
- **Synthetic subscriptions:** the three seeded rows have no Stripe IDs. They are marked, honoured only where a DEV-only flag is on, and never sent to Stripe. The seed verifier will need a matching update.
- **Store-admin changes:** six intentional reductions are listed with regression tests, so they are not read as regressions.
- **Cancellation:** the mirror reads both fields, and undo clears whichever is actually set.
- **Portal configuration ID** is always passed, with a startup check.
- **Only-card removal and renewal failure** are added to E2 acceptance.
- **NPI:** ten digits plus check digit, enforced on a reservation table, with defined hold, bound, consumed and released states.

### 4. Email evidence

`EMAIL_OBSERVATIONS.md` now opens with the current position: your saved settings, all five requests with what was observed, what is proved (delivery through Resend, OwedBook sign-in), and nine untested cases including Payment Portal login. Seven emails remain; none will be sent without your instruction.

### 5. Remaining gaps

Full list in `E1_REPORT.md` §4. The ones that need you:

- **Review decisions:** accept one live link per user (I recommend yes); whether an emailed link should sign in on open, given the unexplained 13:38 redemption; default privileges; APA scope; logins for the seeded cast, whose login sheet is gone.
- **One question:** did anyone open the 12:43 email on a Windows device at about 13:38?
- **Not proved in E1:** the handoff as an app feature, Payment Portal login by email or password, clearing a portal-set cancellation date by API, card removal, renewal failure, the SCRATCH apply rehearsal, Mission Control.
- **Git:** deferred as you instructed, until E1 finishes and before E2.

### Estimates

No commitment. E1 itself took about 3 agent sessions, 10 elapsed working hours and 20 Director touches.

| Lane | Agent sessions | Elapsed hours | Director touches |
|---|---|---|---|
| Review support and freeze edits | 1–2 | 3–5 | 4–6 |
| Engineering (E2) | 21–28 | 65–90 | 12–18 |
| Independent QA | 9–12 | 28–40 | 10–14 |
| DEV apply and recovery | 2–3 | 5–8 | 5–7 |
| Staging deployment and Gate D | 3–5 | 10–16 | 8–12 |

Rejecting the one-link-per-user handling adds about 7–10 engineering sessions and 3 QA sessions.

### Effects, cumulative

| Surface | Used | Ceiling |
|---|---|---|
| Auth sessions | 30 (28 dispatched by me, 2 observed from emailed links) | 32 |
| Emails | 5 (4 accepted and delivered, 1 refused) | 12 |
| Provider sign-outs | 3 | 8 |
| Auth identities | 4 | 4 |
| Stripe mutations | 46 | 100 |
| Stripe reads | 83 | 200 |
| Portal sessions | 3 | 12 |
| Portal configurations | 1 | 2 |

### Reconciled

Statements that had gone stale are corrected or marked as superseded: "no SCRATCH", "SQL unverified", "inbox check pending", "no server started", and the claim that a first access email can never collide. Dated records are kept as written, with the report as the current position.

### Package

Revision 6 is at `/home/moose/Downloads/APBM-007A-CYBER-PHARMA_E1_REVIEW_a01_r6.zip`, with the original in the module's `QAM/HANDOFFS/` folder.
- 95 members, 93 indexed
- SHA-256 `8d2aea485d2d86ab3ef504f1e19a5d19156687d74c5dec1e3b9abfac86dcead2`
- Scanned clean. I added one scanner exception for the reserved `example.invalid` seed domain, which a helper mentions as a pattern.

Start at `E1_REPORT.md`. E2 remains held.
