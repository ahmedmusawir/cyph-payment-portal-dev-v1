# Payment Portal alpha — init result (2026-11-21)

**Result: `./init-app.sh` exit 0, first run.** Authorized by Tony after commit `6dd3de7` (clean tree). No deploy.

- **Created:** 7 empty secrets (`cyph-payment-alpha-supabase-secret-key`, `-stripe-secret-key`, `-stripe-webhook-secret`, `-resend-api-key`, `-stripe-expected-account`, `-stripe-price-stores`, `-stripe-portal-configuration`); runtime service account `sa-cyph-payment-alpha-runtime`; 7 `secretAccessor` bindings for that account only.
- **Verified:** APIs, Artifact Registry, build identity `524380376459-compute@developer.gserviceaccount.com` with `roles/run.admin`, act-as via `roles/editor`.
- **No value yet:** all 7 secrets. Six come from `./upload-secrets.sh` (Tony); the webhook secret is added by hand after the Stripe sandbox endpoint is created.
- **Side effect:** the script set the gcloud defaults `core/project` and `run/region` (already these values).
- **Not touched:** any existing service, secret or service account.

Next: Tony runs `./upload-secrets.sh`.
