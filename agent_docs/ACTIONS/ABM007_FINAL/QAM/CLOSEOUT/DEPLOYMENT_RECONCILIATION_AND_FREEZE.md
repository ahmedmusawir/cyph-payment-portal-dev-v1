# Deployment reconciliation and freeze record — ABM007_FINAL

**Prepared by:** the Engineer · **Date:** 28 November 2026, Asia/Dhaka

This record is built from the repository files only. **I made no cloud call.** I did not run `deploy.sh`,
`init-app.sh` or `upload-secrets.sh`, and I read no secret value. Anything that needs a look at the live services is
marked **unverified** and listed in section 8 with the person who checks it.

## 1. Targets

Both targets are **alpha, on the DEV database**. The scripts, the build configuration and the QA Lead's handoff
agree.

| | OwedBook | Account & Billing |
|---|---|---|
| Service | `cyph-v1-owedbook-alpha` | `cyph-v1-payment-alpha` |
| Address | `https://cyph-v1-owedbook-alpha.cyberizedev.com` | `https://cyph-v1-payment-alpha.cyberizedev.com` |
| Google Cloud project | `cyberize-nextjs-staging` | `cyberize-nextjs-staging` |
| Region | `us-east1` | `us-east1` |
| Database | Supabase DEV, project `yrsuwikjnbmvpznrgydb` | The same |
| Runtime service account | `sa-cyph-owedbook-alpha-runtime` | `sa-cyph-payment-alpha-runtime` |
| Image repository | `us-east1-docker.pkg.dev/cyberize-nextjs-staging/cloud-run-source-deploy/cyph-v1-owedbook-alpha` | `…/cyph-v1-payment-alpha` |
| Sizing | 1Gi, at most 1 instance, port 3000, public | The same |
| App environment label | `NEXT_PUBLIC_APP_ENV=staging` | The same |

**The "OwedBook beta" note.** I found no beta service, address or setting in either repository's deployment files,
and no "OwedBook beta" text in the module records. The OwedBook target is alpha. The earlier note authorizes no
target change, and none is prepared.

## 2. The scripts against the supplied snapshots

| | OwedBook `deploy.sh` | Account & Billing `deploy.sh` |
|---|---|---|
| Repository file, SHA-256 | `8f0a48bed37b0465283161c3ca3c417ffc4f3b06fe3d7f7efa88c94d1d5b75aa` | `9e3e62be49393ec309fa46e55b2b1bc8d1944b512596bffd8a5189c70fc95a6f` |
| Supplied snapshot, SHA-256 | `db4999c2262b59fa2ca10bfb4e18147761ae1e189cdce57fa404dfcbddbf3985` | `373c7672c9a594c2fd64ebe821935e0570a2f2290b9ddadb604e96d2bcbe1bcd` |
| Lines | 144 and 144 | 163 and 163 |
| Difference | **Line endings only.** The snapshot has Windows line endings on all 144 lines; the repository file has Unix ones | **Line endings only**, on all 163 lines |
| Difference after removing the snapshot's carriage returns | None | None |
| Last changed in | `15f586d94c529b8c8ba8fae8c14e3a2a6fa2be61`, 20 November | `6dd3de737acacff9685c0c2027246bf396f10c1d`, 21 November |

The empty comparison outputs are in `evidence/deploy_sh_diff_*_crlf_normalised.txt`.

**One caution.** The snapshots must not be copied over the repository files: a shell script with Windows line
endings does not run. The repository files are the ones to use.

**Nothing in the deployment configuration changed in this module.** In both repositories `deploy.sh`, `init-app.sh`,
`upload-secrets.sh`, `cloudbuild.yaml`, `Dockerfile`, `stark-deploy.yaml`, `.gcloudignore`, `.dockerignore`,
`DEPLOYMENT_CHECKLIST.md`, `package.json`, `package-lock.json` and everything under `supabase/` are identical on
`origin/main` and on the certified commit. I repaired nothing.

## 3. Source revision and image identity

Both scripts work the same way.

| Step | What happens |
|---|---|
| Upload boundary | The script lists what would be uploaded and stops if any credential or environment file is in it. `agent_docs/` and `.git` are never uploaded |
| Source revision | The full commit ID of HEAD. If any uploaded file differs from HEAD the script stops, unless `ALLOW_DIRTY=1`, and then everything is labelled `-dirty` |
| Image tag | First 12 characters of the commit, then the UTC time. Unique per build |
| Deploy | Cloud Build pushes the image, reads its digest, and deploys **by digest**, not by tag |
| Labels | The Cloud Run revision carries `source-revision` and `image-tag`. The image carries the revision too |
| Read-back | The script reads the running image from the service and fails if it is not a digest reference |
| In the app | `/api/build-info` returns the app, the revision and the artifact ID |

**What the next deploy will show.** The deploy runs from `main` after the merge, so the revision will be the **merge
commit** on `main`, not the certified commit. The link between them is the match check on that merge commit, which
proves its files equal the certified ones. Untracked files under `agent_docs/` do not count as dirty.

**Last recorded deployments** (from each `DEPLOYMENT_CHECKLIST.md`; these are the pre-module versions):

| | OwedBook | Account & Billing |
|---|---|---|
| Source revision | `ef4cebccae68499bee7d4a53b230e31474a17f52` | `6dd3de737acacff9685c0c2027246bf396f10c1d` |
| Date | 20 November 2026 | 21 November 2026 |
| Build | `5d840fee-51cc-4c9f-ab03-9b9f97c191e4` | `ebbd4a02-3d79-4ce4-9a12-2b4afe5f6e48` |
| Image tag | `ef4cebccae68-20261120t111951z` | `6dd3de737aca-20261121t042632z` |
| Image digest | `sha256:db2d37b44ce76fde9ed426da2feef5f91bae4eaa18170e9410cdfda8a9408348` | `sha256:0b1792918f0d2200deeb98688d42b479708d5f6c752862b2d3a0907b2aa5da1c` |
| Cloud Run revision | Not written in the checklist | `cyph-v1-payment-alpha-00001-mwh` |

**Unverified:** that these are still the running revisions today. `main` later received records-only commits
(OwedBook `9597699`, Account & Billing `cb4decd`); whether either service was redeployed after 21 November is not
recorded in the repository.

## 4. Origins, callbacks and payment routing

| Item | Value | Source |
|---|---|---|
| The two apps' addresses for each other | The alpha pair above, selected by `NEXT_PUBLIC_APP_ENV=staging` | `src/lib/appIdentity.ts` in both repositories; unit test `alpha-origins.test.ts` in both |
| Own origin | `NEXT_PUBLIC_SITE_URL` must equal the app's own address exactly, or sign-in, handoff and every state-changing request fail closed | `stark-deploy.yaml` |
| App-to-app handoff | `/api/handoff/start`, `/authorize`, `/callback`, `/switch` | Account & Billing source |
| Sign-in confirmation link | `/api/auth/confirm` on each alpha address. The Supabase DEV project's redirect allow-list must admit both | Checklist Stage C. **Recorded as not done on 21 November. Unverified today** |
| Stripe Checkout return | Success `<Account & Billing address>/register/activation`; cancel `<address>/register/review` | `src/server/checkout.ts` |
| Stripe billing page return | Built from the app's own origin | `src/server/billing.ts` |
| Stripe webhook | `https://cyph-v1-payment-alpha.cyberizedev.com/api/webhooks/stripe`, sandbox endpoint named `cyph-v1-payment-alpha`, 7 event types | Checklist step A3. One signed delivery returned 200 on 21 November |
| Payment routing | **Stripe sandbox only.** The code refuses any key that is not a test key, and checks the account against `STRIPE_EXPECTED_ACCOUNT` | `src/server/stripeClient.ts` |
| One consumer rule | No local `stripe listen` and no local Account & Billing app pointed at DEV while alpha is the consumer | Checklist step A3 |
| Scheduler | **Not created.** Timed jobs do not run on alpha. One manual run is possible. Never two runners on DEV | Checklist, "Scheduler" |

Finding F02 applies here: the local QA setup shares this sandbox and cannot receive its events. That is why the
payment journeys run on alpha at Gate D.

## 5. Runtime configuration and secret references

No value is recorded here. Identifiers that are public by design (addresses, the Supabase project reference) are
shown; the browser key is not repeated.

**Plain settings, both services:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_ENV=staging`,
`NEXT_PUBLIC_SUPABASE_URL` (DEV), `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `MAIL_RECIPIENT_POLICY=open`.

- `MAIL_RECIPIENT_POLICY=open` means alpha sends mail to any recipient. The code honours it only on the DEV project.
- Account & Billing, deliberately not set: `APA_PROMOTION_CODES`, `MAIL_ALLOWLIST`, `BILLING_EMAIL_FROM`,
  `ALLOW_SYNTHETIC_SUBSCRIPTIONS`, `ALLOW_TEST_CLOCK`.

**Secret references:**

| Service | Environment name | Secret in Secret Manager | Reference in `cloudbuild.yaml` | Version recorded | Version actually resolved by the running revision |
|---|---|---|---|---|---|
| OwedBook | `SUPABASE_SECRET_KEY` | `cyph-owedbook-alpha-supabase-secret-key` | `:latest` | 1, enabled (20 November) | **Unverified** |
| Account & Billing | `SUPABASE_SECRET_KEY` | `cyph-payment-alpha-supabase-secret-key` | `:latest` | 1, enabled (21 November) | **Unverified** |
| Account & Billing | `STRIPE_SECRET_KEY` | `cyph-payment-alpha-stripe-secret-key` | `:latest` | 1, enabled | **Unverified** |
| Account & Billing | `STRIPE_WEBHOOK_SECRET` | `cyph-payment-alpha-stripe-webhook-secret` | `:latest` | 1, enabled | **Unverified** |
| Account & Billing | `RESEND_API_KEY` | `cyph-payment-alpha-resend-api-key` | `:latest` | 1, enabled | **Unverified** |
| Account & Billing | `STRIPE_EXPECTED_ACCOUNT` | `cyph-payment-alpha-stripe-expected-account` | `:latest` | 1, enabled | **Unverified** |
| Account & Billing | `STRIPE_PRICE_STORES` | `cyph-payment-alpha-stripe-price-stores` | `:latest` | 1, enabled | **Unverified** |
| Account & Billing | `STRIPE_PORTAL_CONFIGURATION` | `cyph-payment-alpha-stripe-portal-configuration` | `:latest` | 1, enabled | **Unverified** |

**The deployment inputs are not pinned.** Both services reference every secret at the alias `latest`, in the
OwedBook script as well as the Account & Billing one. `latest` is a pointer, not a version:

- A running instance reads whichever version `latest` points at **when that instance starts**.
- If someone adds a version, the next deploy uses it, and so does the next cold start of an existing revision.
- Both services scale to zero, so cold starts are routine.

The "version 1" entries above come from the checklists of 20 and 21 November. Whether a version 2 has been added to
any secret since then cannot be known from the repository. The freeze on these inputs is therefore a **rule for
people** (section 7), plus a metadata check before and after the deploy (section 8). The scripts do not enforce it.

**The gap in the OwedBook script.** The Account & Billing script checks, before building, that each of its 7 secrets
has an enabled version. The OwedBook script has no such check. If the OwedBook secret had no enabled version, the
new revision would fail after a full build. I did not change the script. The check is done by hand instead: item 4
in section 8.

## 6. Rollback

**No rollback procedure is written down** for either alpha service. The checklists have a "Day two" note (change,
commit, deploy) and nothing on going back. I record that as a gap and do not invent one as if it existed.

What the platform and the scripts already give, for the Architect and the QA Lead to turn into a procedure in the
Gate D plan:

| Fact | Consequence |
|---|---|
| Every deploy makes a new Cloud Run revision and keeps the old one | Going back is a traffic move to the previous revision. No rebuild |
| Images are deployed by digest and the old digests are recorded above | The previous image is identifiable exactly |
| This module has no migration | The previous app versions work on the DEV database as it is |
| Old and new revisions both read secrets at `latest` | A rollback does **not** restore an older secret version |
| The two apps are a pair | Roll both back together; the opening-page buttons and the handoff assume the same version on both sides |

**Previous-revision evidence required before the deploy** (read-only, item 2 in section 8), for each service: the
name of the revision now serving 100% of traffic, its image digest, its `source-revision` label, and what
`/api/build-info` returns. Without these four the rollback target is a guess.

A rollback command is a deployment action. It needs the Director's authorization at the time. None is prepared here
as executable.

## 7. Freeze record

In force from the QA Lead's handoff of 28 November until Gate D passes.

| What | Rule |
|---|---|
| Product and test files | Frozen at the certified commits. Closeout commits records only |
| `main`, both repositories | **Frozen until Gate D passes.** After the closeout merge nothing else lands. A deployed defect gets its own repair branch from `main`, an affected QA review and a deployed retest |
| The DEV database | **Frozen.** No new schema, no configuration change, no seed or reset, no unrelated data change |
| The one exception | The authorized Gate D journeys create normal application records: one throwaway tester account, its pharmacies, its sandbox subscription |
| Deployment inputs | **Frozen:** both `deploy.sh`, both `cloudbuild.yaml`, both `Dockerfile`, both `stark-deploy.yaml`, the 8 secrets (no new version), the plain settings, the Stripe sandbox webhook endpoint, price and billing-page configuration, the Supabase DEV Auth settings. Changing any of them needs an explicit impact decision first |
| Known planned change inside the freeze | The branded email template and Stripe branding are "prepared, not applied". Applying them is a Gate D step and needs the Director's decision in the approved Gate D plan, because it changes DEV Auth configuration |
| SCRATCH | Not reset. Fixtures unchanged |
| The QA branches and the retained automation | Not deleted |

**Unresolved metadata checks:** items 1 to 6 in section 8. Until they are done, "frozen" for the secrets and for the
running revisions is a statement of intent, not a verified fact.

## 8. Outstanding checks before the deploy

All read-only. None was run by me.

| # | Check | Who |
|---|---|---|
| 1 | No Cloud Build trigger watches `main` in either repository, so the merge push does not deploy by itself | The Director, before the merge push (command in `GIT_HANDOFF_FOR_TONY.md`, section 0) |
| 2 | For each service: the revision now serving, its image digest, its `source-revision` label, and `/api/build-info` | The Engineer on the Director's release, or the Director |
| 3 | For each of the 8 secrets: the list of versions and their states (metadata only), to confirm that `latest` is still version 1, or to record what it is | The Engineer on release, or the Director |
| 4 | The OwedBook secret has an enabled version (the check its script lacks) | The same person as item 3 |
| 5 | Supabase DEV Auth: Site URL and redirect allow-list admit both alpha addresses; state of the email template | The Director (dashboard) |
| 6 | Stripe sandbox: the webhook endpoint `cyph-v1-payment-alpha` is enabled with its 7 event types; the price and billing-page configuration still exist | The Director (dashboard) |
| 7 | No local `stripe listen`, no local job runner and no local app pointed at DEV during Gate D | The Director |
| 8 | The Gate D plan, revised for AM-21, is approved | The QA Lead writes; the Director approves |
| 9 | Deploy from a clean checkout of `main` at the merge commit; record build ID, image tag, digest and revision name for both services; confirm `/api/build-info` on both shows the merge commit | The Engineer on the Director's release |
| 10 | After the deploy, repeat item 3 and compare | The Engineer |

Suggested read-only commands for items 2 to 4, for whoever is released to run them:

```
gcloud run services describe cyph-v1-owedbook-alpha --project cyberize-nextjs-staging --region us-east1 --format='yaml(status.traffic,status.latestReadyRevisionName,spec.template.spec.containers[0].image,spec.template.metadata.labels)'
gcloud run services describe cyph-v1-payment-alpha  --project cyberize-nextjs-staging --region us-east1 --format='yaml(status.traffic,status.latestReadyRevisionName,spec.template.spec.containers[0].image,spec.template.metadata.labels)'
gcloud secrets versions list cyph-owedbook-alpha-supabase-secret-key --project cyberize-nextjs-staging --format='table(name,state,createTime)'
```

The last line is repeated for each of the 7 Account & Billing secret names in section 5. These list version numbers,
states and dates. They do not read a value.
