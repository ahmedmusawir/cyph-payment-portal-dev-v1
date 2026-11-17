# Joint staging handoff and Gate D

Separate release after engineering/QA/Director acceptance and coordinated integration. Do not run inherited portal deploy.sh during recon/E2. Record exact two integrated commits, artifacts/digests and DB migration compatibility; no production/live Stripe keys.

Prepare both requested domains, HTTPS/DNS, correct Cloud Run services/project/region, exact allowed email/handoff/Stripe return origins and public portal webhook route. Preserve the original FFM source/deploy reference for rollback. Determine whether the existing service is reused with new domain or another service is required; no automatic retarget or deletion. OwedBook has no verified deploy recipe in recon, so deployment preparation must supply/review it rather than assume one exists. DNS can wait until deployment, but URLs/allowlists are code inputs now.

Configure endpoint/API event version and staging signing secret distinct from local CLI. The staging webhook must remain reachable without Tony's laptop/listener. Verify safe retries and outbound delivery. Keep same sandbox/environment, separate attempt tags so local/staging events cannot fulfill each other's operations accidentally. Prevent two consumers from racing over one event/operation namespace; define allowed delivery and idempotency explicitly.

Gate D: actual anonymous first-store purchase → signed event → provisioning → inbox link → OwedBook correct store → both-direction handoff → owner billing; admin/member/unrelated-owner denial; cancellation/undo and required lifecycle checks; invalid/expired callbacks; duplicate event and email recovery; approved logout/server-liveness behavior with recorded same-user MC impact and JWT residual; current schema/version/config. Confirm receipts from actual deployed artifacts. Report Gate Q, integration, deployment and Gate D separately. Failure routes to bounded repair; no silent claiming of full Phase 7/production.

Deploy only the frozen single graduated price/item B and its STRIPE_PRICE_STORES/configuration requirements. Recheck session lifetime and provider-wide logout effects on staging, including already-issued token residual, without silently changing shared Auth settings.

## FC-7 settings checklist

- Add exact https://owedbook.cyberizedev.com/api/auth/confirm and https://owedbook-payment.cyberizedev.com/api/auth/confirm redirects; add their template branches preserving the confirm-button flow. Do not ship localhost-only template branches as staging readiness.
- Tony chooses DEV project's Site URL at joint staging release, accounting for any other project consumers; it is localhost today. Exact app redirects still govern intended destinations.
- Tony decides whether to shorten access-token lifetime from 3600 to 900 seconds. No automatic change; existing issued tokens retain their expiry. Record the shared-project/Mission Control impact.
- Confirm new origins, host-only staging cookies, correct webhook secret and exact app pair; no wildcard parent-domain session cookie.
