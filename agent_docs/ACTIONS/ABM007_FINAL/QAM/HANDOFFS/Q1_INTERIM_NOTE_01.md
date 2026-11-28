# Q1 independent interim review — Cody
Status: INCOMPLETE; readiness and authority reconciliation required. Q2 NOT RELEASED. No product verdict.

Both candidates match the Director receipt and both branches were initially clean: OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549. Complete baseline-to-candidate path listings and tracked test/helper inventories are attached. Dependency diffs are empty. These listings are evidence, not a completed path-by-path semantic review.

Package 04 is the final handoff; package 03 retains product evidence. Both archives match saved checksums and pass integrity. 142 packaged source files compared: only LoginForm.tsx and Spinner.tsx differ, with equality after trailing whitespace removal. See archive-reconciliation.json for exact hashes.

Authority: QAM_STATE remains READY FOR ENGINEERING, candidate and contract identities absent; handoff section 12 says engineering complete. User explicitly authorizes Q1, but no historical transition has been invented. AM-08 settles Gate V and scope split; AM-12 governs Member Help redirects; AM-14/15 authorize existing SCRATCH fixture setup only; AM-17 installs walkthrough and regression requirements. Earlier pending text does not reverse those amendments. Full freeze/provenance reconciliation remains outstanding.

Readiness: configuration resolver independently identifies SCRATCH ihgcsrypblqkwommrkgj through API and SQL URL identities; Stripe key has test prefix (not live account verification). Both QA ports are free. Neither .env.qa.local exists. Existing private cast is mode 0600, has Owner A/B with passwords, Admin/Member/Invitee without passwords. No private values retained. This establishes local configuration availability, not live fixture existence or target reachability. Helper/removed/zero-store/multi-store/audit-page availability remains unverified. No sessions, servers, listener, provider calls or business effects were initiated.

Tool review: auth.mjs and serve.mjs pin repository imports; auth resolves pg from OwedBook; cast is engineering_cast.json and requires private permissions; allowlist includes four roles, excludes Invitee. Both impose /tmp/claude-1000/ path checks (serve copies and auth listener cwd); any QA adaptation must change BOTH to one declared QA copy root, enforce canonical containment, and preserve ports 3100/3101, local-proof, API/SQL SCRATCH guards, DEV bundle rejection, existing-user check, no-email setup and in-memory secrets. No adaptation made. auth caches served identity, so revalidation is needed on process changes. serve port inspection catches failures as free; fail-closed adaptation needed. serve writes child stdout/stderr directly into files despite scrubbed-log comment; sanitization needed before use. Fixture session cannot prove real login, delivery or real handoff. No helper is certified reusable yet.

O-1: retained engineering record reports two attempts of 20 with only 18 complete routes each; WebKit warm iterations 2 and 4 interrupted in each. Preserve first failure and diagnostic attempts; interrupted routes are incomplete, never clean passes. Classification needs independent reproduction after plan approval; no campaign ran here.

Independent outstanding gaps: full semantic changed-path reconciliation, all test assets inspected/classified individually, AC-by-AC coverage, live fixture read, build and instrument readiness, endpoint/handler isolation proof. This return does not pretend those tasks are complete. PF-0.1 says missing basics mean stop; user asks safe unaffected recon to continue. Static recon proceeded; runtime effects held pending reconciliation.

Decisions required: Tony records readiness transition/candidate receipt and rules whether existing authorized private configuration satisfies .env.qa.local requirements or supplies that file without credential changes. Friday reviews this interim draft, selects human checks, and returns Q1 amendments; do not bind it as a complete plan. Tony/Friday resolve missing fixture coverage without implicit creation/reset authority. Tony retains any future effects and paid-test release; isolation is NOT PROVEN. Concrete paid-test proposal for later review: separately authorized isolated sandbox and QA-only routing, with explicit approval of setup and configuration before any use; this is not permission or a claim it exists. Friday assigns O-1 for independent bounded reproduction. Q2 remains blocked until complete Q1, bound plan and Director release.


# Candidate-specific draft — incomplete, not approved
Pair: OwedBook 2e91e90905b2d9907577a64985e643f7827019ac; Portal fc1fa6c2a90ebf59987287ad765e2e65cf635549.

Proposed Q2 sequence after readiness and release: independent protected-path/source review; unit/type/lint/build in hash-bound isolated copies; instrument negative controls; public and authenticated rendered matrix; bounded journeys; selected Director walkthrough; consolidated findings. Keep all first failures. Diagnostic reruns require classification; never automatically retry effects. No repair during Q2.

Rendering: every UI_SPEC route, Owner/Admin/Member/removed/signed-out as applicable; zero/one/multiple stores and loading/empty/error/denied states; Chromium 375/768/1024/1440 plus breakpoint neighbors; stored-dark and system-dark with light first paint. Firefox/WebKit journeys and representative shells, including O-1 fresh and warm sessions. Exact repetitions and route matrix remain to be completed. Assert actual navigation destination and route completion, not absence of sign-in alone. Measure tokens, composited contrast, keyboard focus visibility, target size and overflow with failing and passing controls.

Provisional CR mapping (asset names indicate inspection targets, not independently proven coverage):
| CR | Existing assets / gap requiring independent coverage |
|---|---|
|01| portal-access, portal-owner, get-user-role; role-by-route rendered denials missing |
|02| portal-boundaries, apbm007a-server; cross-account direct request and database assertions missing |
|03| OwedBook abm007/store-selector; live zero/one/many fixture state missing |
|04| manual-qa-add-store-states, loading probes in retained Q4_02; current rendered slow/error paths missing |
|05| alpha-origins, apbm007a-auth; real bidirectional handoff and O-1 incomplete |
|06| proxy/auth tests; actual session and logout boundaries missing |
|07| server/pricing unit coverage to inspect; immutable pricing source diff and server-authoritative negative case required |
|08| retained invite-send/existing helpers; effect authorization and QA inbox needed |
|09| retained role/access helpers to inspect; signed-in removal/role-change coverage missing |
|10| portal-dashboard/account and regression browser specs; current non-purchasing billing assertions required |
|11| abm007 token/light/focus/notice tests; rendered contrast and names on actual surfaces required |
|12| Help unit tests, mobile Navbar; keyboard and actual phone walkthrough missing |

Current candidates for reuse: abm007 presentation pins (source-level only). Stale pending adaptation: three Portal browser specs with dark-theme helper, engineering scratch tooling and retained APBM-007B automation tied to earlier candidates. Retired: sixteen removed demo specs; do not count as journey coverage. Full per-file classification remains outstanding; attached inventories are not coverage certification.

AC groups: V approval/source; B token/light/contrast states; L all route layouts; N names/logo provenance; H content/anchors and guard outcomes; F selector/O-1; R build/protected behavior and full journeys; E01 template structural diff and E03 source-only notices; P changed-label reconciliation. E02/E04, E03 deployment record and D remain Gate D. Full individual criterion mapping still required. No previous passing evidence carried forward as candidate proof.

Effects: Q1 none beyond local QA records. Q2 effects must be expressly released. No fixture creation/reset or credentials change proposed. Audit paging BLOCKED if existing fixture inadequate, not N/A. Purchases remain blocked pending isolation and specific authorization; USD400 is a ceiling, not permission. Durable REG-001 recommendation: separate pure unit, guarded integration, browser journeys, instrument controls and fixture specifications with candidate-bound receipts; do not implement now.

Human proposal (Friday selects; approximately 30–40 minutes, all PENDING): HC-01 real password login (R04/auth); HC-02 real bidirectional handoff (R04/F02); HC-03 Owner and Admin navigation and billing denial (H03); HC-04 Member Help links and expected OwedBook redirect (H03); HC-05 keyboard focus over navy/white surfaces (B/L); HC-06 named real phone Help/menu/table usability (L04/H); HC-07 names/logo and billing presentation (N/B); HC-08 logout and session boundary (R04). Human needed for perceived clarity/usability and real authentication observations. Use pair above, SCRATCH ports 3100/3101, Windows Chrome baseline; phone model and availability require Tony. Existing designated fixtures only, session/audit effects only, no purchase/mail/business changes. Director records own observation, time, sanitized screenshot where useful, result, finding and retest per check, one at a time; Architect may guide. Detailed actions/expected outcomes and session method must be completed before Friday binds the plan. Fresh delivered email checks remain separately required at Gate D; never substitute fixture token evidence.
