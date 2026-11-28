# QAM_PREFLIGHT — `ABM007_FINAL` (executable readiness checks)

**Version:** REVIEW_02 (Architect amendments A-04, A-05, A-06 applied) · **Owner:** the ABM author wrote the rows (check, expected result, authorized effect). The QA Executor records only the Result and Evidence cells in Q1 and rechecks changeable rows at Q2 and Q4 entry. A row the Executor believes is wrong is recorded as a GAP or QUESTION in `QAM_RECON_REPORT.md`, not edited. Every result starts as `NOT RUN`.

Every repository row is run **twice**: in OwedBook (`cyph-v1-dev`) and in the Portal (`cyph-payment-portal-dev-v1`). Record both results.

**Executor:** NOT RECORDED · **Run at:** NOT RECORDED · **Results file:** `evidence/preflight/<attempt>/PREFLIGHT_RESULTS.txt`

Q1 is read-only toward product and business data. Writes go only to the QA lane and approved transient setup.

## Section 0 — Standing first check (before anything else)

| # | Check | Expected | Result | Evidence |
|---|---|---|---|---|
| PF-0.1 | The basics are in place: both QA branches exist and are checked out, the candidate receipts exist, the QA target is reachable, the credential file exists, a webhook listener can be started. **If anything is missing, tell the Director immediately and stop here.** | all present | PASS for bounded Q1 | R-1/R-2; readiness.json; CLI present, no listener started |

## Section 1 — Repository and identity (both repositories)

| # | Check | Command | Expected | Effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-1.1 | Branch | `git rev-parse --abbrev-ref HEAD` | `qa/abm007-final` | read-only | PASS | both qa/abm007-final |
| PF-1.2 | Full HEAD, baseline, candidate | `git rev-parse HEAD`; `git log --oneline <BASELINE>..HEAD` with OwedBook baseline `9597699b404afdbcd792a9b4da61c21abb10cdf8` and Portal baseline `cb4decde9adc9ab75d0dcb15556c64a3bdbfe075` | Candidate per the Director's receipt | read-only | PASS | both HEADs equal receipts |
| PF-1.3 | Tree state | `git status --porcelain` | Empty, or only paths the manifest lists as expected | read-only | PASS | initially clean; current QA-only records |
| PF-1.4 | Candidate ancestry | `git merge-base --is-ancestor <CANDIDATE> HEAD` | exit 0 | read-only | PASS | candidate equals HEAD |
| PF-1.5 | Candidate reconciled with the handoff inventory | `git diff --name-status <BASELINE>..<CANDIDATE>` against `QAM_MANIFEST.md` section 2, row by row | Every path accounted for; differences become GAP rows | read-only | ADJUDICATE | path-review.json; archive snapshots; preserved RECOVERY delta |
| PF-1.6 | Candidate to HEAD, if they differ | Review the **complete** diff, not a stat | Only `QAM/**` and governed records changed; any product, test, config or dependency content is `STOP-IDENTITY` | read-only | PASS | commit diff empty in both |
| PF-1.7 | Protected paths untouched since baseline (first look; full review is AC-R03) | `git diff --name-only <BASELINE>..<CANDIDATE>` filtered by the protected list in `../CONTRACTS/NO_BREAK_AND_PATHS.md` section 4, with an existence check on the filter | No protected path except the Portal's `src/server/billingNotices.ts` and its tests | read-only | ADJUDICATE | RECOVERY preserved by AM-08(3); notice exception only product path |
| PF-1.8 | No dependency change | `git diff <BASELINE>..<CANDIDATE> -- package.json` and the lockfile | Empty | read-only | PASS | both dependency diffs empty |

## Section 2 — Contract and handoff

| # | Check | How | Expected | Result | Evidence |
|---|---|---|---|---|---|
| PF-2.1 | Frozen contract present with the recorded identity | `sha256sum` of `../ABM_ACCEPTANCE_SPEC.md` and `../ABM_RULINGS.md` against `QAM_STATE.md` | match | PASS with append distinction | contract-hashes.json; QAM_STATE appended identity |
| PF-2.2 | Rulings read; every P-nn position has a Director ruling or is recorded as still open | read | list in recon | NOT RUN | |
| PF-2.3 | Gate V recorded | `../ABM_RULINGS.md` | Director approval of `../DESIGN/` present | PASS | AM-08(2) |
| PF-2.4 | Governing bodies resolve | `sha256sum` of the five files in `GOVERNING/` against `GOVERNING/PROVENANCE.md` | all five match. The absent Hub commit identity is a recorded limit, not a failure | PASS | governing-hashes.json |
| PF-2.5 | Manifest and handoff complete for both repositories; every AC has a claim row; no secret values | read | complete, or GAP rows | NOT RUN | |
| PF-2.6 | Engineer deliverables present: Help label-verification table, stale-spec mapping, changed-labels list, redirect reproduction record, leftovers list | read | present | NOT RUN | |

## Section 3 — Runtime, tools, resources

| # | Check | How | Expected | Effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-3.1 | Runtime versions | per `QAM_MANIFEST.md` section 5 | as recorded | read-only | NOT RUN | |
| PF-3.2 | QA-controlled install from the lockfile, in an isolated copy, for each app | install command per the manifest | exit 0 | authorized, QA lane only | NOT RUN | not among current narrowed Q1 probes; existing dependencies copied |
| PF-3.3 | QA-controlled production build of each app | build command per the manifest | exit 0; the font is fetched at build | authorized | PASS | build-result.json; both exit0 |
| PF-3.4 | Free ports 3100 and 3101 | port check | free | read-only | PASS | ports clear before and after owned processes |
| PF-3.5 | Evidence lane writable; protected paths not written | write probe in `evidence/` only | writable | QA lane only | NOT RUN | |

## Section 4 — Target, configuration, readiness, roles, data

| # | Check | How | Expected | Effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-4.1 | Actual resolved target, not a label: database project identity and Stripe account identity (last characters only) | read configuration without printing values | SCRATCH and the sandbox, never DEV | read-only | PASS | SCRATCH read; Stripe account ...u3RR matches |
| PF-4.2 | Configuration precedence for the QA builds | read | documented | read-only | NOT RUN | |
| PF-4.3 | Services ready for the required operations (a status code proves connectivity only) | one sign-in page load per app; one authenticated read as a QA identity | works | bounded probe | PARTIAL | four OwedBook sessions; no Q2 journeys |
| PF-4.4 | Roles available: Owner, Store admin, Member, Helper, removed user | by role name; existence confirmed with the Director | present, or the plan creates them within the envelope | as approved | GAP | fixture suitability matrix |
| PF-4.5 | Fixture state: an owner with at least two pharmacies on SCRATCH; and whether an audit history long enough to need a second page exists or must be built | read | present, or planned within the envelope. If the paging fixture cannot be built: BLOCKED for the QA Lead and the Director, never "not applicable" | as approved | ADJUDICATE | 42 non-read; Include reads needed for paging |
| PF-4.6 | Credential file declared, ignored AND untracked, schema valid, no values echoed | `git check-ignore -v .env.qa.local`; `git ls-files --error-unmatch .env.qa.local` (expect failure); key-name check | ignored; untracked; keys present | read-only | PASS under R-1 | private cast mode0600; no .env.qa.local created |
| PF-4.7 | Shared-sandbox event isolation, both directions. (a) List, read-only, the sandbox's registered endpoints with their event types, and every listener and where it forwards. (b) From source, with file and line: what alpha's handler and the QA build's handler each do with an event for a customer, subscription or account they do not know. (c) Conclude: can a QA event change DEV data; can an alpha event change the QA database. (d) Confirm no local DEV-backed Portal or listener is running | Read-only Stripe GET requests; source reading; configuration read-outs without values; a safe observed outcome where one exists. **A process listing alone does not satisfy this row** | PROVEN ISOLATED in both directions, recorded in `QAM_RECON_REPORT.md` section 5. Otherwise NOT PROVEN, with one concrete routing or handling proposal for the Director; paid tests wait for his authorization, nonpayment work may proceed | read-only; no purchase, no endpoint change, no code change, no new sandbox | NOT PROVEN | receipt before classification; alpha binding missing |
| PF-4.8 | The Director's rehearsal account is not reachable from the QA configuration | PF-4.1 result | not DEV | read-only | PASS | QA backend SCRATCH, never DEV |
| PF-4.9 | Effects counters at zero for this campaign; cleanup boundary defined | read | recorded | read-only | PASS | 0 business/payment/mail; 4 sessions/4 signouts |

## Section 5 — Browser, instrumentation, auth probes

| # | Check | How | Expected | Effect | Result | Evidence |
|---|---|---|---|---|---|---|
| PF-5.1 | Browser drivers launch (Chromium, Firefox, WebKit); a basic interaction works | launch and click | works | local | NOT RUN | |
| PF-5.2 | Contrast probe validated with a deliberately failing fixture **and** a passing control | run both | fixture fails, control passes | local | NOT RUN | |
| PF-5.3 | Overflow and target-size probes validated the same way | run both | as above | local | NOT RUN | |
| PF-5.4 | Privacy scanner validated with a synthetic leak fixture and a clean control | run both | fixture detected, control clean | local | NOT RUN | |
| PF-5.5 | Forbidden-term and old-name scanners validated with a seeded positive | run | positive detected | local | NOT RUN | |
| PF-5.6 | Bounded sign-in and sign-out probe as one QA identity | one sign-in, one sign-out | works; session and audit activity acknowledged | authorized | PASS bounded amendment | 4 allowlisted roles one session each; signout200 |

## Section 6 — Packaging and recovery

| # | Check | How | Expected | Result | Evidence |
|---|---|---|---|---|---|
| PF-6.1 | A safe review package can be produced (dry run; exclusion list honored) | `QAM_PACKAGING.md` | index and hashes verify | NOT RUN | |
| PF-6.2 | Recovery after interruption: state readable, evidence lane durable | read `QAM_STATE.md` | — | NOT RUN | |

## Outcome

| Field | Value |
|---|---|
| Blockers (GAP / QUESTION / BLOCKED with owner and exact resolution) | NOT RECORDED |
| Readiness for Q1 planning | NOT RECORDED |
| Rows to recheck at Q2 entry | PF-0.1, PF-1.1 to PF-1.6, PF-4.1, PF-4.3, PF-4.7, PF-4.9 |
