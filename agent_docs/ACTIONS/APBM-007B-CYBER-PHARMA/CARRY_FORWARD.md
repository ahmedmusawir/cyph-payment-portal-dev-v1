# APBM-007B — carried-forward risks, limitations and backlog

Recorded at closeout, 18 November 2026 (Asia/Dhaka), by Claudy for JARVIS. **None of these items was repaired in
closeout.** Sources:
- the certificate `QAM/HANDOFFS/QAM_CERTIFICATION_APBM-007B_2026-11-18.md` §§5–6;
- the cleanup release `QAM/HANDOFFS/QA_LEAD_CLEANUP_ACCEPTANCE_AND_CLOSEOUT_RELEASE_APBM007B_2026-11-18.md` §§3 and 5;
- `QAM/FINDINGS.md`.

## 1. Director-accepted known risks (18 Nov 2026, 13:40)

| ID | Risk | Follow-up | Where |
|---|---|---|---|
| KR-1 | Add Store on WebKit can exceed the test's 30 s limit (about 1 run in 5). Payment and activation succeeded every time; confirm took 9.4–14.7 s, once about 40 s; the owner sees only disabled buttons while waiting | Give the e2e a realistic time budget (with evidence); show the owner progress while confirm runs; measure confirm time on staging | Next build + Gate D |
| KR-2 | One unexplained WebKit sign-in redirect to `/auth` (Q4/01). Not reproduced in 7 QA runs or 10 + 5 + 5 engineering runs; cause unproven. Engineering noted the Navbar `SIGNED_OUT` listener as the only no-click client path to `/auth` (not established as the cause) | Watch for it on staging; capture the sign-in audit trail when it occurs | Gate D |
| KR-3 | The live transfer-buyer payment and the first-store purchase were not repeated on the certified pair. Both passed live in Q2, and the database proof passed on 0070 | One live transfer-buyer completion at Gate D. **Keep the stated limit of first-store purchase coverage** | Gate D |
| KR-4 | The 90-minute end-of-period guard was not isolated live (the 50-cent minimum refused first); proven in database checks | Isolate when a live case allows | Backlog |
| KR-5 | The discounted-account case used a sandbox promotion granted to the fixture, not a customer redeeming a code | Customer-redeemed code journey | Gate D / backlog |
| KR-6 | The local listener missed 1 of 10 paid events on first delivery; the provider resend processed correctly with no duplicate | Native provider retry on a permanent endpoint, plus an outage case | Gate D |

## 2. Certificate limitations and standing conditions

1. Gate D not run (see `GATE_D_HANDOFF.md`).
2. **Migration 0070 must be applied to DEV under the Director's separate release before merged code runs against DEV.**
   SCRATCH is at 70 and DEV at 69 (`EVIDENCE/CLOSEOUT/DEV_APPLY_0070/`).
3. **Legal and consent wording is required before staging exposure** (open since 007A). No invented terms or placeholder
   success.
4. **U-1, U-2, U-3 remain Director-accepted, not QA-certified.**
5. Seller history is available through data and API access only; there is no screen.
6. **The shared operator credential proves possession, not an individual's identity.** Individual operator sign-in is a
   Gate D concern. The Director approves the six support actions.
7. The F-Q2-001 wrongly activated store existed only on SCRATCH and the sandbox, and was handled in cleanup.
8. Cleanup exceptions accepted by the QA Lead:
   - 6 test customers and 3 test clocks remain in the sandbox (subscriptions cancelled; deleting them is optional, by the
     Director);
   - two old `apbm007a` pairs were left alone;
   - expired checkout sessions and paid invoice history remain;
   - `/tmp/apbm007b-o1-cast.json` was left. Engineering's handoff (§5) lists it as an Engineering E2 private credential
     file (mode 0600, dated 17 Nov 09:16).
   - Also still present at closeout (listed only, never opened): `~/.apbm007b/engineering_cast.json` (Engineering E2,
     0600), and a QA-named folder `~/.apbm007b/apbm007b-qa-20261117T073513Z-e131c0ca` with 5 entries.
   - Removing these needs the Director's explicit cleanup authority, which closeout does not have. The QA-named folder is
     for the QA Lead to dispose of;
   - issued sign-in tokens stay valid until they expire;
   - no secure-erasure claim.
9. Six earlier QA Lead source files are still not imported into `QAM/` (QA-owned receipt `QA_LEAD_FILE_IMPORT_2026-11-18.md`).

## 3. Backlog (not risks of this build)

| Item | Detail |
|---|---|
| UTC-only deadline in notices | `src/server/billingNotices.ts` formats deadlines with `toUTCString()` as "… UTC" only. Show the owner's local time or name the zone clearly |
| Old operator wording | QA observation O-Q4-001: the applied operator SQL still returns "paid re-add pending Director decision 9; no access or quantity granted." Decision 9 was approved 17 Nov, and the runbook is correct. The text is in an applied migration function, so fixing it needs a new migration under a future release |
| Demo-mode invite form | OwedBook `src/components/admin-portal/InviteMemberForm.tsx` (demo mode only, not used live) has the typing-before-load pattern repaired elsewhere under F-Q4-001 |
| DEV-apply guard constants | OwedBook `scripts/apbm007b/dev-apply-guard.mjs` hard-codes the 0061–0069 apply (69 files, 60-row ledger, branch `apbm-007b`). Generalize it before a later DEV apply so `ready` is meaningful |
| Process-local rate limiters | They assume a single instance (`STAGING_AND_GATE_D.md`). Keep `--max-instances 1`, or change them with concurrency tests |
