#!/bin/bash
set -euo pipefail

# ==================================================
# STARK FACTORY — One-Time App Setup (agent-run)
# App: Payment Portal Alpha | Project: cyberize-nextjs-staging
# Service: cyph-v1-payment-alpha (NEW). Touches no other service, secret or service account.
# IDEMPOTENT — safe to run multiple times. Verifies project-level
# infrastructure; creates ONLY app-level resources (secrets, runtime SA, bindings).
# ==================================================

PROJECT_ID="cyberize-nextjs-staging"
REGION="us-east1"
APP_NAME="cyph-payment-alpha"
REPO_NAME="cloud-run-source-deploy"
TMPDIR_ERR="$(mktemp -d)"; trap 'rm -rf "$TMPDIR_ERR"' EXIT

echo "=================================================="
echo "🤖 Stark Factory: Initializing $APP_NAME"
echo "   Project: $PROJECT_ID | Region: $REGION"
echo "=================================================="

gcloud config set project "$PROJECT_ID" --quiet
gcloud config set run/region "$REGION" --quiet

# --- VERIFY PROJECT-LEVEL INFRASTRUCTURE (Path B precondition — never created here) ---
echo "🔎 Verifying project infrastructure..."
ENABLED="$(gcloud services list --enabled --project "$PROJECT_ID" --format='value(config.name)')"
for API in cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com iam.googleapis.com; do
  if grep -qx "$API" <<<"$ENABLED"; then echo "   ✅ API enabled: $API"
  else echo "   ❌ API NOT enabled: $API — this is not a bootstrapped project. Run Path A (v3.1 family CLAUDE.md §5.2) first."; exit 1; fi
done
if gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" --project "$PROJECT_ID" &>/dev/null; then
  echo "   ✅ Artifact Registry repo exists: $REPO_NAME ($REGION)"
else
  echo "   ❌ Artifact Registry repo $REPO_NAME missing in $REGION — Path A step 5 not done. Aborting."; exit 1
fi

# --- BUILD SA (Actor B) — RESOLVED, never inferred (§4.5 v1.1) ---
# deploy.sh submits with no --service-account, so the build runs as the project/region
# DEFAULT build identity. Ask Cloud Build which account that is. If cloudbuild.yaml ever
# declares an explicit top-level serviceAccount:, that one executes instead — honor it.
EXPLICIT_SA="$(grep -E '^serviceAccount:' cloudbuild.yaml 2>/dev/null | sed -E 's/^serviceAccount:[[:space:]]*"?([^"]*)"?/\1/' || true)"
if [ -n "$EXPLICIT_SA" ]; then
  BUILD_SA_EMAIL="${EXPLICIT_SA##*/serviceAccounts/}"
  echo "   Build SA (explicit in cloudbuild.yaml): $BUILD_SA_EMAIL"
else
  SA_RC=0
  DEFAULT_SA_RAW="$(gcloud builds get-default-service-account --project "$PROJECT_ID" --region "$REGION" --format='value(serviceAccountEmail)' 2>"$TMPDIR_ERR/sa.err")" || SA_RC=$?
  if [ "$SA_RC" -ne 0 ]; then
    echo "   ❌ Could not resolve the default Cloud Build service account (gcloud exit $SA_RC)."
    echo "      This is a lookup failure, NOT a missing account — do not guess an identity."
    echo "      Likely: Cloud Build API not enabled, missing cloudbuild.builds.get permission, or platform drift. Error:"
    sed 's/^/      | /' "$TMPDIR_ERR/sa.err"; exit 1
  fi
  BUILD_SA_EMAIL="${DEFAULT_SA_RAW##*/serviceAccounts/}"
  if [ -z "$BUILD_SA_EMAIL" ]; then echo "   ❌ Default build SA lookup returned empty — aborting, not guessing."; exit 1; fi
  echo "   Build SA (default for $PROJECT_ID/$REGION, resolved): $BUILD_SA_EMAIL"
fi

# --- STAGING RULE CHECK: build SA must hold roles/run.admin — REPORT ONLY, never auto-grant ---
if gcloud projects get-iam-policy "$PROJECT_ID" --flatten='bindings[].members' --format='value(bindings.role)' --filter="bindings.members:serviceAccount:${BUILD_SA_EMAIL}" | grep -qx "roles/run.admin"; then
  echo "   ✅ Staging Rule: $BUILD_SA_EMAIL holds roles/run.admin"
else
  echo "   ❌ Staging Rule MISSING: $BUILD_SA_EMAIL lacks roles/run.admin — first deploy would 403."
  echo "      Operator decision required. Fix (v3.1 §5.2 step 6):"
  echo "      gcloud projects add-iam-policy-binding $PROJECT_ID --member=\"serviceAccount:${BUILD_SA_EMAIL}\" --role=\"roles/run.admin\""
  exit 1
fi

# --- CREATE SECRETS (EMPTY — no placeholder version; values arrive via upload-secrets.sh) ---
echo "🔐 Secrets..."
SECRET_NAME_1="cyph-payment-alpha-supabase-secret-key"   # SUPABASE_SECRET_KEY
SECRET_NAME_2="cyph-payment-alpha-stripe-secret-key"   # STRIPE_SECRET_KEY
SECRET_NAME_3="cyph-payment-alpha-stripe-webhook-secret"   # STRIPE_WEBHOOK_SECRET
SECRET_NAME_4="cyph-payment-alpha-resend-api-key"   # RESEND_API_KEY
SECRET_NAME_5="cyph-payment-alpha-stripe-expected-account"   # STRIPE_EXPECTED_ACCOUNT
SECRET_NAME_6="cyph-payment-alpha-stripe-price-stores"   # STRIPE_PRICE_STORES
SECRET_NAME_7="cyph-payment-alpha-stripe-portal-configuration"   # STRIPE_PORTAL_CONFIGURATION
SECRET_NAMES=("$SECRET_NAME_1" "$SECRET_NAME_2" "$SECRET_NAME_3" "$SECRET_NAME_4" "$SECRET_NAME_5" "$SECRET_NAME_6" "$SECRET_NAME_7")
# The deployed Stripe webhook endpoint's own signing secret. NOT uploaded by upload-secrets.sh: the env file holds
# the local Stripe CLI listener's secret, which must not be reused. Added by hand (DEPLOYMENT_CHECKLIST.md, step A3).
MANUAL_SECRET="$SECRET_NAME_3"
for S in "${SECRET_NAMES[@]}"; do
  if gcloud secrets describe "$S" --project "$PROJECT_ID" &>/dev/null; then
    echo "   ✅ exists (reused): $S"
  else
    gcloud secrets create "$S" --replication-policy="automatic" --project "$PROJECT_ID" --quiet
    echo "   ✅ created EMPTY: $S"
  fi
done

# --- RUNTIME SERVICE ACCOUNT (Actor C) ---
RUNTIME_SA="sa-${APP_NAME}-runtime"
RUNTIME_SA_EMAIL="${RUNTIME_SA}@${PROJECT_ID}.iam.gserviceaccount.com"
echo "👤 Runtime SA..."
if gcloud iam service-accounts describe "$RUNTIME_SA_EMAIL" --project "$PROJECT_ID" &>/dev/null; then
  echo "   ✅ exists (reused): $RUNTIME_SA_EMAIL"
else
  gcloud iam service-accounts create "$RUNTIME_SA" --display-name="${APP_NAME} Runtime SA" --project "$PROJECT_ID"
  echo "   ⏳ Waiting for SA propagation..."
  for i in 1 2 3 4 5 6; do
    if gcloud iam service-accounts describe "$RUNTIME_SA_EMAIL" --project "$PROJECT_ID" &>/dev/null; then echo "   ✅ created: $RUNTIME_SA_EMAIL"; break; fi
    if [ "$i" -eq 6 ]; then echo "   ❌ SA not visible after 60s — aborting. Re-run this script."; exit 1; fi
    sleep 10
  done
fi

# --- ACT-AS CHECK [R2]: Cloud Build (Actor B) deploys the service AS the runtime SA (Actor C), which
# --- needs iam.serviceAccounts.actAs on it. REPORT ONLY, never auto-granted. Accepted evidence:
# --- a project-level role that includes the permission, or serviceAccountUser on the runtime SA itself.
ACTAS_OK=""
PROJECT_ROLES="$(gcloud projects get-iam-policy "$PROJECT_ID" --flatten='bindings[].members' --format='value(bindings.role)' --filter="bindings.members:serviceAccount:${BUILD_SA_EMAIL}")"
for ROLE in $PROJECT_ROLES; do
  case "$ROLE" in roles/*) ;; *) continue ;; esac
  # Read the whole list first: `grep -q` on a live pipe exits early and, under pipefail, turns a match into a failure.
  ROLE_PERMS="$(gcloud iam roles describe "$ROLE" --format='value(includedPermissions)' 2>/dev/null | tr ';' '\n' || true)"
  if grep -qx "iam.serviceAccounts.actAs" <<<"$ROLE_PERMS"; then ACTAS_OK="project role $ROLE"; break; fi
done
if [ -z "$ACTAS_OK" ] && gcloud iam service-accounts get-iam-policy "$RUNTIME_SA_EMAIL" --project "$PROJECT_ID" --flatten='bindings[].members' --format='value(bindings.role)' --filter="bindings.members:serviceAccount:${BUILD_SA_EMAIL}" 2>/dev/null | grep -qx "roles/iam.serviceAccountUser"; then
  ACTAS_OK="roles/iam.serviceAccountUser on the runtime SA"
fi
if [ -n "$ACTAS_OK" ]; then
  echo "   ✅ Act-as: $BUILD_SA_EMAIL may deploy as the runtime SA (via $ACTAS_OK)"
else
  echo "   ❌ Act-as MISSING: $BUILD_SA_EMAIL lacks iam.serviceAccounts.actAs on $RUNTIME_SA_EMAIL — the deploy step would fail."
  echo "      Operator decision required. Narrowest fix (this one service account only):"
  echo "      gcloud iam service-accounts add-iam-policy-binding $RUNTIME_SA_EMAIL --project $PROJECT_ID --member=\"serviceAccount:${BUILD_SA_EMAIL}\" --role=\"roles/iam.serviceAccountUser\""
  exit 1
fi

# BINDING RETRY (field-proven: describe-visibility ≠ IAM-backend visibility). Idempotent —
# add-iam-policy-binding on an existing binding is a no-op success.
bind_secret_accessor() {
  local SECRET="$1" MEMBER="$2"
  for i in 1 2 3 4 5 6; do
    if gcloud secrets add-iam-policy-binding "$SECRET" --project "$PROJECT_ID" --member="$MEMBER" --role="roles/secretmanager.secretAccessor" --quiet &>/dev/null; then
      echo "   ✅ secretAccessor: $MEMBER → $SECRET"; return 0
    fi
    if [ "$i" -eq 6 ]; then echo "   ❌ ABORT: binding failed after 6 attempts: $MEMBER → $SECRET"; exit 1; fi
    echo "   ⏳ binding not accepted yet — retry $i/6 in 10s..."; sleep 10
  done
}

echo "🔑 Build SA bindings (build-time secrets)..."
echo "   ✅ None needed — no build-time secrets."

echo "🔑 Runtime SA bindings (runtime secrets)..."
for S in "${SECRET_NAMES[@]}"; do bind_secret_accessor "$S" "serviceAccount:${RUNTIME_SA_EMAIL}"; done

# --- VERIFICATION (never prints values) ---
echo ""
echo "=================================================="
echo "🔍 VERIFICATION"
echo "=================================================="
MISSING=0
MISSING_MANUAL=0
for S in "${SECRET_NAMES[@]}"; do
  if [ -n "$(gcloud secrets versions list "$S" --project "$PROJECT_ID" --filter='state:ENABLED' --format='value(name)' 2>/dev/null)" ]; then
    echo "   ✅ $S: enabled version present"
  elif [ "$S" = "$MANUAL_SECRET" ]; then
    echo "   ⚠️  $S: NO VALUE YET — added by hand from the Stripe sandbox endpoint (checklist step A3), never from the env file"; MISSING_MANUAL=1
  else
    echo "   ⚠️  $S: NO VALUE YET — run ./upload-secrets.sh"; MISSING=$((MISSING+1))
  fi
done
gcloud iam service-accounts describe "$RUNTIME_SA_EMAIL" --project "$PROJECT_ID" --format="value(email)" >/dev/null && echo "   ✅ Runtime SA: $RUNTIME_SA_EMAIL"
echo ""
if [ "$MISSING" -gt 0 ]; then
  echo "⏸  Init complete. $MISSING secret(s) still empty → YOUR move: run ./upload-secrets.sh   (then the agent continues)"
fi
if [ "$MISSING_MANUAL" -gt 0 ]; then
  echo "⏸  The webhook signing secret is still empty → YOUR move: checklist step A3. deploy.sh refuses to run without it."
fi
if [ "$MISSING" -eq 0 ] && [ "$MISSING_MANUAL" -eq 0 ]; then
  echo "✅ Init complete. All secrets hold a value. Next: ./deploy.sh"
fi
echo "=================================================="
