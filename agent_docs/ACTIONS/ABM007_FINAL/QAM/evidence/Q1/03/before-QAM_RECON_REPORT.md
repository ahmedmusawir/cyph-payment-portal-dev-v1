# QAM_RECON_REPORT — `ABM007_FINAL`

**Owner:** QA Executor · **Written:** Q1 · **Status: Q1 recon performed; readiness gaps remain.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

Independent observations only. Labels used: EVIDENCE (seen, with a path), INFERENCE (reasoned, marked as such), CLAIM (someone else's statement, untested), GAP, QUESTION, BLOCKED. Each GAP, QUESTION or BLOCKED names its owner and the exact resolution needed.

## 1. Run record

| Field | Value |
|---|---|
| Executor seat, runtime | Cody, independent QA Executor; Node v22.17.0; installed Chrome via Playwright |
| Start and end time (Asia/Dhaka) | 24 November 2026; commands and package receipt carry execution timestamps; no invented exact start time |
| Director touches during Q1, with purpose | Kickoff assignment/receipt; R-1 private configuration acceptance; R-2 factual state reconciliation and bounded readiness release |

## 2. Identity (both repositories)

| Field | OwedBook | Portal |
|---|---|---|
| Branch | qa/abm007-final | qa/abm007-final |
| Full HEAD | 2e91e90905b2d9907577a64985e643f7827019ac | fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| Candidate commit from the Director's receipt | 2e91e90905b2d9907577a64985e643f7827019ac | fc1fa6c2a90ebf59987287ad765e2e65cf635549 |
| Candidate is an ancestor of HEAD; candidate-to-HEAD diff is records only (full diff reviewed) | HEAD equals candidate; commit diff empty | HEAD equals candidate; commit diff empty |
| Tracked changes, untracked files, stashes | Initially clean; only Portal QAM writes by Cody; stashes not changed | Initially clean; only Portal QAM writes by Cody; stashes not changed |
| Baseline-to-candidate changed paths, complete, against the manifest inventory | evidence/Q1/01 changed-paths.txt; evidence/Q1/02/path-review.json; snapshot 142-source comparison | evidence/Q1/01 changed-paths.txt; evidence/Q1/02/path-review.json; snapshot 142-source comparison |

## 3. Contract and handoff

| Check | Observation |
|---|---|
| Contract identity matches `QAM_STATE.md` | EVIDENCE: freeze hashes now recorded in state; contract-hashes.json distinguishes current append/fill bytes from frozen bytes |
| Every P-nn has a ruling or is listed as open | AM-08 settles P-01–18,21–22 scope split; P-19 effects and P-20 deployment remain Director release matters. R-1/R-2 settle credential mechanism and QA assignment only |
| Gate V record, and which renders it covers | AM-08(2): corrected REVIEW_02 look reconfirmed; full-canvas logo, no trimming |
| Manifest and handoff complete for both repositories | Handoff section 13 supersedes earlier interim claims; candidate PENDING fields replaced by Director receipt in QA state, not by editing Engineer-owned manifest |
| Contradictions between the Engineer's claims and what was observed | Two whitespace-only snapshot changes; O-1 is 18 complete +2 interrupted per attempt; serve logging/port/cache defects adapted; prior passes remain claims |
| Protected-path review of both diffs, path by path | 570 paths inventoried in path-review.json. No protected product-code change except five approved notice strings. RECOVERY.md changed in preserved c335671, not engineering candidate commit; Friday must reconcile literal AC-R03 with AM-08(3). This path-permission inventory is not a claim that every changed behavior passes; Q2 covers rendered/functional consequences |

## 4. Environment as actually resolved

| Check | Observation |
|---|---|
| Database project each QA build points at (identifier ending only) | ...rkgj (SCRATCH); API/SQL config checked; live read reached target; built JS checked for SCRATCH and absence of DEV backend |
| Stripe account each QA build points at (identifier ending only) | Stripe GET /v1/account HTTP200, ending u3RR, matches configured expected account; fixture-final.json |
| Configuration precedence | Named existing .env.local keys read in memory by protected resolver; isolated copies exclude .env; child env is explicit allowlist. R-1 supersedes .env.qa.local requirement. Private cast stays outside repos |
| Service readiness for the required operations (not only reachability) | Both production builds exit 0. Four fixture sessions and signouts pass on OwedBook only; no claim of Q2 journey readiness. First Chromium launch failure retained; installed Chrome diagnostic launch succeeded |
| Roles and fixtures available; what the plan must create | fixtures.json: Owners 3/2 stores; Invitee 1 store but outside auth allowlist; Admin/Member each one membership. Zero-store Owner, second Member, removed-access identity not established. Create nothing; effects proposal requests specific needs |
| Mock mode: does it ship, where, and how the plan covers it | OwedBook mock services ship; Q1 builds use real. Q2 separate mock build/route boundary checks planned, never relabel mocked data as live |

## 5. Shared-Stripe event isolation (required before any paid test)

| Question | Answer, with evidence path |
|---|---|
| Which endpoints are registered in the sandbox, and which event types each receives | readiness.json: one enabled alpha /api/webhooks/stripe endpoint, checkout completed/expired, invoice paid/failed, subscription created/updated/deleted |
| Which listeners forward events, to which local address | listener-read.json: local inspection only; none started by Cody; remote forwarding cannot be inferred. Stripe CLI present |
| What alpha's handler does with an event for a customer, subscription or account it does not know (from source, with file and line) | Candidate webhook.ts:44–62 rejects signature/live/wrong account then inserts stripe_events BEFORE classification. 229–247: known DB mapping retries; no marker foreign; different apbm_db foreign_environment; ambiguous marker retries. Alpha deployment-source binding not freshly verified: GAP, no asserted deployed parity |
| What the QA build's handler does with an alpha event | Same candidate code: durable receipt first (59–62); record updates at 87–108; subscription RPC at 300–305 before unknown classification; no local listener started |
| Can a QA event change DEV data? Proof | NOT PROVEN isolated. If deployed alpha matches reviewed handler, even foreign events write receipt/status rows; business mapping overlap also needs proof. Endpoint is enabled |
| Can an alpha event change the QA database? Proof | With a future forwarding listener, reviewed handler writes receipt/status rows before foreign classification. Currently no Cody listener; absence now is not a future paid-test proof |
| Verdict of this section: PROVEN ISOLATED, or NOT PROVEN with one concrete proposal for the Director | NOT PROVEN. Proposal: Director commissions an environment-routing filter before either database receipt, verified against exact deployed alpha code and isolated fixture metadata, under a separate approved change. No filter implemented, endpoint changed or new infrastructure assumed; paid rows BLOCKED pending ruling |

A list of running processes is not an answer to any row.

## 6. Instruments

| Instrument | Passing control | Failing control | Trusted? |
|---|---|---|---|
| Browser drivers (Chromium, Firefox, WebKit) | NOT RUN — restricted Q1 probe list; validate before Q2 use | n/a | |
| Token-resolution check (AC-B01) | exact anchors | a hand-rounded triplet must be reported as a mismatch | |
| Rendered-contrast probe (AC-B08) | NOT RUN — restricted Q1 probe list; validate before Q2 use | NOT RUN — restricted Q1 probe list; validate before Q2 use | |
| Overflow and target-size probes | NOT RUN — restricted Q1 probe list; validate before Q2 use | NOT RUN — restricted Q1 probe list; validate before Q2 use | |
| Old-name and forbidden-term scanners | NOT RUN — restricted Q1 probe list; validate before Q2 use | seeded positive | |
| Privacy scanner | clean control | synthetic leak | |

## 7. Fixture planning

| Need | Plan | Effects it uses |
|---|---|---|
| Owner with at least two pharmacies on SCRATCH | Use existing ENGINEERING_OWNER_A (3) or B (2); read-only state evidence; session/audit only until release | |
| Audit history long enough to need a second page (AC-R04 i). If it cannot be built: BLOCKED, with the reason, for the QA Lead and the Director | Owner A 567 initial aggregate, 42 non-read rows; page size 50 at services/auditLog.ts:8. Plan Include reads ON for older-page test and OFF for short-history boundary. Existing designated synthetic cast only; zero seeding. Runtime pagination result remains Q2, not inferred from count | |
| Removed-user identity | Not established in allowlisted cast; request existing designation or one explicit member-removal effect, not creation/reset | |

## 8. Readiness verdict (the Executor's observation, not an approval)

| Field | Value |
|---|---|
| READY FOR Q2, READY WITH LISTED GAPS, or NOT READY | NOT READY for Q2 release; Q1 plan submitted with named gaps |
| Blockers, each with owner and exact resolution | Tony: effects, inbox control, phone, fixture designation, isolation solution. Friday: selection and AC-R03 disposition, path inventory and carried-history interpretation. Cody: remaining instrument controls before reuse |
| What cannot be tested yet, and why | Paid/provider-mutating journeys, invitations/removal and real email require Q2 approval; missing role/state fixtures block corresponding cases; no Firefox/WebKit installed validation in this restricted Q1 |

## Amendment 01 additions (owner: QA Executor, Q1)

**A. Test and helper inventory.** One row per suite, spec, check set or helper found in either repository or in the retained APBM-007B QA lane.

| Asset | Repository or lane | Kind | Current, stale or retired, and why | What it covers | What it needs to run |
|---|---|---|---|---|---|
| CR-01 | Role/access unit suites, actions, portal-owner, apbm007a-access | Actual per-role route and forbidden control matrix | No |
| CR-02 | apbm-tenant-scope, portal-boundaries, apbm007a-server | Cross-account direct requests and database assertions on candidate | No |
| CR-03 | abm007/store-selector, MyStoresScreen | Zero-store and removed-access fixtures unavailable in current allowlist | No |
| CR-04 | apbm-read-states, hydration tests, loading-probe | Current rendered slow/error/stale states | No |
| CR-05 | apbm007a-auth, alpha-origins, regression spec | Real bidirectional handoff; O-1 interruptions | Human real-login journey plus automation |
| CR-06 | apbm007a-auth, proxy; Q1 helper logout only | Both-app refusal and used/fresh emailed-link lifecycle | Human inbox for link lifecycle |
| CR-07 | server/pricing tests and unchanged source | Rendered 99/49/148/197 and manipulated-client negative | No |
| CR-08 | staff/invitation tests, retained invite helpers | Send/accept current journey needs approved email effect | Human inbox acceptance |
| CR-09 | owner-staff-settings, retained role scripts | Already-signed-in removal needs approved write | No |
| CR-10 | portal-dashboard, portal-account, portal regression | Hosted billing session/return needs provider-call authorization | No |
| CR-11 | abm007 token/focus/light/notice pins | Rendered composited contrast and customer-visible names | Human comparison supplements automation |
| CR-12 | Help, keyboard DataTable, drawer focus suites | Real-phone availability; Help usefulness | Yes for real device and wording | | |

**B. Coverage map.**

| CR or criterion | Existing coverage | Gap | Only testable by a person today? |
|---|---|---|---|
| NOT RUN — restricted Q1 probe list; validate before Q2 use | | | |

**C. Recommended layout for a durable regression pack.** Recommendation only: maintained unit, guarded integration, browser journeys, instrument controls, fixture specifications and candidate receipts in a QA pack. REG-001 remains separate; no implementation here.

**D. Fixture state as found:** evidence/Q1/02/fixtures.json and fixture-details.json; gaps and minimum effects in Q2_EFFECTS_PROPOSAL.md. No inbox accessibility is known; no credential was changed.

**E. Sign-in method:** Owner A/B password; Admin/Member fixture token, AM-14/15 and R-1/R-2. Four sessions, four signout HTTP 200, no email. Session-probes.json. Token proves only authenticated behavior.

### Fixture suitability and smallest proposed missing effects

| Need | Found | Blocks | Minimum proposal, not performed |
|---|---|---|---|
| Several pharmacies | Owner A 3, B 2 active | none for basic read coverage | reuse |
| Exactly one | Invitee owns 1; outside auth allowlist | F01 one-store Owner runtime | Tony designate existing Invitee for QA auth scope, no data change |
| Zero-store Owner | Not in current allowlist | F01 zero-store Owner; R04(c) | designate existing zero-store Owner; otherwise separate one-account registration exception |
| Admin / Member | One each, validated sessions | none for read-only roles | reuse |
| Second Member | Not designated | independent isolation/removal-neighbor check | designate existing second Member; otherwise one explicit membership grant, no new account |
| Removed-access user | Not designated | F01 removed state / R04(h) consequence | approved one removal of designated Member, no reset |
| Invited person | Existing Invitee, no pending invitation | R04(e) | one approved invitation and acceptance |
| Pending invitation | Owner A has accepted/revoked only | pending invitation state | observe between approved send and accept |
| Scheduled removal | A and B scheduled=0 | R04(g) | one approved schedule then undo |
| Paging | Owner A 42 non-read plus read history, total initially 567 | none if Include reads scope qualifies; default history is short | use existing history with Include reads ON; no seeding. Friday confirms synthetic history applicability |
| Human inbox | No accessibility evidence for any cast identity | R04(a,j), invitation acceptance | Tony names existing controlled inbox; no credential change or email sent in Q1 |
