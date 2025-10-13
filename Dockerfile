# Prod Dockerfile
FROM node:22-alpine AS base

RUN apk add --no-cache dumb-init

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nuxt -u 1001

# Dependencies stage
FROM base AS deps

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Builder
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN yarn build

# Runner
FROM base AS runner

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Env
ENV NUXT_SESSION_PASSWORD=fallback-session-password-change-in-production-32chars
ENV NUXT_PUBLIC_BASE_URL=http://localhost:3000
ENV NUXT_REDIS_HOST=redis
ENV NUXT_REDIS_PORT=6379
ENV NUXT_REDIS_PASSWORD=
ENV NUXT_REDIS_DB=0
ENV NUXT_REDIS_KEY_PREFIX=nuha_auth:

COPY --from=builder --chown=nuxt:nodejs /app/.output /app/.output

RUN chown -R nuxt:nodejs /app
USER nuxt

EXPOSE 3000

# Start the prod server
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", ".output/server/index.mjs"]
