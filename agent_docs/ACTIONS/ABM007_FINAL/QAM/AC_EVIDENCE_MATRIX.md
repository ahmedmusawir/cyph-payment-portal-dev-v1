# AC_EVIDENCE_MATRIX — `ABM007_FINAL`

**Owner:** QA Executor (Gate Q rows); QA Lead records the Gate D rows from the Director's session · **Written:** Q2, Q4 if run, and the Gate D session · **Status: NOT YET EXECUTED.** Every result, approval and verdict field below is empty on purpose. This file is complete as a structure: its fields, their owners and their rules are defined here and depend on no other template. Every repository-specific item is recorded for both OwedBook and the Portal.

One row per criterion: 36 rows. Requirement text is in `../ABM_ACCEPTANCE_SPEC.md`; the short title here is a label only. Blocking: `G` gate before engineering, `B` blocks Gate Q, `D` judged at Gate D.

Result labels: PASS, FAIL, BLOCKED, NOT RUN, ADJUDICATE. A row marked `D` stays NOT RUN through Gate Q and is not counted for or against the Gate Q verdict. AC-R04 is reported per journey (a) to (j) in the evidence cell; (i) is PASS only if paging was actually exercised.

| AC | Short title | Env | Blocking | Result | Test IDs | Evidence paths | Candidate pair the evidence belongs to |
|---|---|---|---|---|---|---|---|
| AC-V01 | Gate V visual approval recorded | DIRECTOR | G | NOT RUN | | | |
| AC-B01 | Token block matches; anchors resolve to exact hex | SOURCE | B | NOT RUN | | | |
| AC-B02 | No hardcoded color | SOURCE | B | NOT RUN | | | |
| AC-B03 | Inter only, via next/font | SOURCE, LOCAL-QA | B | NOT RUN | | | |
| AC-B04 | Light forced | LOCAL-QA | B | NOT RUN | | | |
| AC-B05 | Radius and shadow scale | LOCAL-QA | B | NOT RUN | | | |
| AC-B06 | Buttons and their states | LOCAL-QA | B | NOT RUN | | | |
| AC-B07 | Link rules by surface | LOCAL-QA | B | NOT RUN | | | |
| AC-B08 | Rendered contrast | LOCAL-QA | B | NOT RUN | | | |
| AC-B09 | Status shown by word, border, tint | LOCAL-QA, SOURCE | B | NOT RUN | | | |
| AC-L01 | Literal layout pages | LOCAL-QA | B | NOT RUN | | | |
| AC-L02 | Translated layout pages | LOCAL-QA | B | NOT RUN | | | |
| AC-L03 | Add Pharmacy and Help keep navigation | LOCAL-QA | B | NOT RUN | | | |
| AC-L04 | 375px behavior | LOCAL-QA | B | NOT RUN | | | |
| AC-L05 | Error, empty, loading, denied states | LOCAL-QA | B | NOT RUN | | | |
| AC-N01 | Approved names; no old name | SOURCE, LOCAL-QA | B | NOT RUN | | | |
| AC-N02 | Logo master and derived files | SOURCE, LOCAL-QA | B | NOT RUN | | | |
| AC-H01 | Help page reachable, content as approved | LOCAL-QA | B | NOT RUN | | | |
| AC-H02 | Help has no test or internal material | LOCAL-QA, SOURCE | B | NOT RUN | | | |
| AC-H03 | Help links obey guards | LOCAL-QA | B | NOT RUN | | | |
| AC-F01 | "No permitted stores" only at zero stores | LOCAL-QA | B | NOT RUN | | | |
| AC-F02 | Redirect reproduction record | LOCAL-QA | B | NOT RUN | | | |
| AC-F03 | Landing page repair | LOCAL-QA | B | NOT RUN | | | |
| AC-R01 | Unit suites | LOCAL-QA | B | NOT RUN | | | |
| AC-R02 | Typecheck, lint, build | LOCAL-QA | B | NOT RUN | | | |
| AC-R03 | No protected path touched | SOURCE | B | NOT RUN | | | |
| AC-R04 | Critical journeys (a) to (j) | LOCAL-QA | B | NOT RUN | | | |
| AC-R05 | Prices unchanged | LOCAL-QA, SOURCE | B | NOT RUN | | | |
| AC-R06 | Rehearsal account untouched | LOCAL-QA | B | NOT RUN | | | |
| AC-E01 | Email body diff is presentation only | SOURCE | B | NOT RUN | | | |
| AC-E02 | Branded email delivery (matrix E02-1 to E02-6) | ALPHA, DIRECTOR (DEV project) | D | NOT RUN | | | |
| AC-E03 | Billing notice wording; deployment record | SOURCE, ALPHA | B for source; D for the deployment record | NOT RUN | | | |
| AC-E04 | Stripe branding previews | DIRECTOR | D | NOT RUN | | | |
| AC-D01 | Deployment receipt per service | ALPHA | D | NOT RUN | | | |
| AC-D02 | Director alpha ride | ALPHA, DIRECTOR | D | NOT RUN | | | |
| AC-P01 | Changed-labels list | SOURCE, LOCAL-QA | B | NOT RUN | | | |

## Carried-forward evidence

| AC | Evidence from which earlier candidate | Why it still applies (diff proof) | Accepted by the QA Lead? |
|---|---|---|---|
| none | | | |

## Amendment 01 note

A criterion that depends on a required human check is not PASS while that check is PENDING or BLOCKED. Evidence obtained under a fixture session is marked as such in the evidence cell and does not satisfy a criterion that asks for real sign-in, email delivery or handoff.
