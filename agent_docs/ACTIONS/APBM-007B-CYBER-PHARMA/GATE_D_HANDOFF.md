# APBM-007B — Gate D handoff (preparation only)

Prepared at closeout, 18 November 2026 (Asia/Dhaka), by Claudy for JARVIS. **Nothing here is deployed, configured or
tested live.** Gate D is a separate gate. It needs the Director's deployment release after the merge to `main` and the DEV
0070 apply. The binding requirements stay in `STAGING_AND_GATE_D.md` (unchanged). This file lists what Gate D must cover
after Gate Q.

## 1. Entry conditions (all required)

1. Both merges pushed and verified (`EVIDENCE/CLOSEOUT/commit/GIT_HANDOFF.md`). Deploy the **exact merged pair**:
   Portal `main` with product tree = `ba66534`, OwedBook `main` with tree = `855e0ad`.
2. DEV at migration 70, verified (`EVIDENCE/CLOSEOUT/DEV_APPLY_0070/DEV_APPLY_0070_RELEASE.md`).
3. **Legal and consent prerequisite before any external exposure.** The Director supplies the real Terms and Privacy
   destinations, content and version, and the support and price-consent copy. Placeholders are acceptable only for
   non-exposed local use.
4. The Director releases deployment in writing, naming services, project and region.

## 2. Infrastructure to prepare and prove

| Item | What Gate D must show |
|---|---|
| Permanent provider webhook endpoint | One registered Stripe sandbox endpoint on the deployed Portal, with its own signing secret and event subscriptions. Prove **native Stripe retry**, and an **outage case**: endpoint down → events retried → processed once, with no duplicate effect. This closes the gap behind KR-6. Exactly one active event consumer per shared DEV/sandbox, or explicit isolation; database-name metadata alone does not isolate |
| Deployed scheduler | Expiry and notice jobs run by an authenticated scheduler against the deployed service. No test-clock context on staging DEV (the deployment identity is bound to DEV, and test-context enable is refused there) |
| Staging authentication settings and cross-app handoff | The Director applies the approved Auth change sheet in one session: Site URL, redirect allowlist for the two staging origins, token-hash Magic Link template, token lifetime (keep 007A's 3600 s unless changed). Host-only cookies; the destination-verifier handoff works both ways between `https://owedbook.cyberizedev.com` and the Portal origin |
| Portal origin: discrepancy to resolve | `STAGING_AND_GATE_D.md` names `https://owedbook-payment.cyberizedev.com`. The Portal's `stark-deploy.yaml` (3 Nov) names `cyph-payment.cyberizedev.com`. The Director picks one before the Auth sheet and build arguments are fixed |
| Deployment recipe | Portal: `deploy.sh` → `gcloud builds submit` with `cloudbuild.yaml` (project `cyberize-nextjs-staging`, `us-east1`, service `cyph-sub-portal-prod`, `--max-instances 1`, which the process-local rate limiters require). OwedBook has no deployment recipe in the repository yet: prepare it as a separate target. Do not overwrite the old FFM feedback site. Server secrets come from Secret Manager at runtime only; there are no production keys |
| Rollback readiness with 0070 | The schema is forward-only: there is no down-migration, and DEV is never reset. Application rollback to 007A `main` (Portal `c68c4ac`, OwedBook `0b78552`) is **compatible** with DEV at 70, because 007A does not call the 007B store-operation functions. The pre-repair 007B candidates (`427bec6`/`c8a2ed9`) are **not** compatible: 0070 refuses their direct `payment_pending → paid_pending_activation` transition. Record the previous Cloud Run revision IDs before deploying, and prove a revision rollback |
| Individual operator sign-in | Replace or supplement the shared operator credential, which proves possession, not identity, with an individual operator identity for the six support actions. Until then the Director approves each action |
| Served identity | `/api/build-info` on both deployed apps matches the merged revision and artifact manifest; HTTPS on both domains |

## 3. Known-risk observations to make on staging

- **KR-1:** measure Add Store confirm time on the deployed pair (WebKit and others). Check that the owner sees progress
  while confirm runs. Set the e2e time budget from the measurements.
- **KR-2:** watch for the one-time WebKit sign-in redirect to `/auth`. If it occurs, capture the sign-in audit rows and the
  browser trace.
- **KR-3:** run one live transfer-buyer completion. The first-store purchase coverage limit stays recorded.
- **KR-4/KR-5:** isolate the 90-minute guard and a customer-redeemed discount code, if staging allows.
- **KR-6:** covered by the native-retry and outage proof above.

## 4. Required live journeys on the deployed pair

1. Auth email confirm, and cross-app handoff in both directions.
2. First-store purchase, once.
3. Add Store, once, including the consent deadline on real time.
4. Role isolation (owner, admin, member, unrelated).
5. Billing recovery: failed payment, then hosted payment.
6. Notices sent by the scheduler.
7. Webhook native retry and outage.
8. One live transfer-buyer completion.
9. Rollback readiness.

Return revision-bound Gate D findings separately. **No local Gate Q certificate implies a Gate D pass.**
