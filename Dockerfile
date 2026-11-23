# Payment Portal Alpha — skill Template 1 plus the OwedBook alpha review fixes (build identity, HOSTNAME).
# Service cyph-v1-payment-alpha. No secret is a build argument; none reaches the image.

# --- STAGE 1: DEPENDENCIES ---
# Node floor: 22 (Next 15/16 require >= 20 — Issue #2). Raise if package.json engines demand more.
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# --- STAGE 2: BUILDER ---
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# No build-time secrets: the Supabase, Stripe and Resend values are runtime-only (Secret Manager, --set-secrets).

# Public vars (inlined into client JS by `next build`).
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}

# [EXTENSION — not in the skill template] Non-secret build identity. next.config.js compiles
# these in at build time and /api/build-info reports them. Defaults match next.config.js.
ARG APBM_BUILD_REVISION=unrecorded
ARG APBM_BUILD_ARTIFACT_ID=unlabelled-build
ENV APBM_BUILD_REVISION=${APBM_BUILD_REVISION}
ENV APBM_BUILD_ARTIFACT_ID=${APBM_BUILD_ARTIFACT_ID}

RUN npm run build

# --- STAGE 3: RUNNER ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# The standalone server binds to HOSTNAME. Docker sets HOSTNAME to the container ID, so bind all
# interfaces explicitly; Cloud Run is told the same port with --port 3000 (cloudbuild.yaml).
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
