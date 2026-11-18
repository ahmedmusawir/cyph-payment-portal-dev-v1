# 007B QA preflight preparation

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

All checks are PENDING; exact commands must come from E1/engineering handoff and independent Q1 inspection.

| Check | Expected evidence | Owner |
|---|---|---|
| Basics | Both apps serving a production build made from the candidate commit (build ID compared); Stripe listener running with the matching secret present; inbox file readable. A missing basic is reported to the Director at once, before other work. | Executor |
| Both candidate identities and branch ownership | Full SHA pair, clean/dirty inventory, permitted QA lane, accepted handoff | Executor / Director |
| Frozen contract and rulings | Resolved decisions, exact hashes, no draft policy gaps | Architect / Executor |
| Engineering claim completeness | Actual paths, commands/results, migrations, limits and reproduction | Engineer |
| Runtime/tools/build | Verified versions and real QA-controlled build instructions | Executor |
| Resolved target and environment precedence | Correct project IDs; no duplicate-key ambiguity; no printed secrets | Executor |
| Role/inbox/provider fixtures | Named private aliases, isolation, available effect budget, new-identity proof | Director / Executor |
| Test-clock seam and reminder runner | Safe isolated controls, coherent clocks, guarded recipients | Engineer / Executor |
| Browser and privacy instruments | Known-failure/clean controls; safe auth handling and export | Executor |
| Output/restart readiness | Writable QA records, indexed ZIP and state continuity | Executor |

Q1 setup/install/build/login probes require explicit Q1 effects; readiness inspection does not inherit Q2 budget. Reachability is not service readiness. Aggregate blockers, continue safe independent inspection, return one package.

## Mandatory opening basics check — both Q1 and Q2
Run this before the rest of the phase. If anything is missing, report it to Tony immediately, then continue only checks independent of the affected blocker. A missing listener does not justify stopping unrelated source or permission analysis.

| Basic | Required evidence; never assume |
|---|---|
| Both candidate builds serving | Compare running build IDs with build artifacts tied to the exact candidate SHA pair. Record repo/build/pin relationship for each app; a healthy port alone is insufficient. |
| Local Stripe listener and matching configuration | Verify the expected listener process/forward target is active and the app resolves the matching signing secret, without printing, retaining or hashing the secret. Use the approved private check mechanism; do not guess a method from this draft. |
| Database identities | Verify declared DEV/SCRATCH identity by approved checks, not connection success alone. |
| Private inbox file | Verify readable, schema-valid, ignored/untracked private file with the controlled cast in `TEST_IDENTITIES.md`; do not emit addresses or credentials. |

Exact build, serve and listener commands, working directories and candidate build-ID comparison method are mandatory engineering handback fields. They are not available from this document-only draft; E1 must discover them. Q1 effects must explicitly allow any build, process or login setup. For deployed Gate D, the real webhook endpoint replaces local-listener dependency.
