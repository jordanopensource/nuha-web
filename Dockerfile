# set global args
ARG USER=node CI_REPO  CI_REPO_NAME  CI_REPO_URL  CI_COMMIT_SHA  CI_COMMIT_REF  CI_PIPELINE_URL  CI_PIPELINE_CREATED  CI_PREV_PIPELINE_URL CI_PIPELINE_NUMBER

###########
# BUILDER #
###########
FROM node:22.15.0 AS builder

# copy build context and install dependencinpm res
WORKDIR /workspace
COPY . .
RUN yarn install

# build NuxtJS project
RUN yarn build

###########
# PROJECT #
###########
FROM node:22.15.0-slim

# pass the global args
ARG USER
ARG CI_REPO
ARG CI_REPO_NAME
ARG CI_REPO_URL
ARG CI_COMMIT_SHA
ARG CI_COMMIT_REF
ARG CI_PIPELINE_URL
ARG CI_PIPELINE_CREATED
ARG CI_PIPELINE_NUMBER

# copy builder output to project workdir
WORKDIR /app
COPY --from=builder --chown=${USER}:${USER} /workspace/package.json /app/
COPY --from=builder --chown=${USER}:${USER} /workspace/.output /app/.output

# set user context
USER ${USER}

# inject build args as enviroment variables
ENV NUXT_PUBLIC_CI_BUILD_NUMBER=${CI_PIPELINE_NUMBER}  NUXT_PUBLIC_CI_BUILD_LINK=${CI_PIPELINE_URL} NUXT_PUBLIC_BUILD_REPO_LINK=${CI_REPO_URL} NUXT_PUBLIC_CI_COMMIT_SHA=${CI_COMMIT_SHA} NUXT_PUBLIC_CI_COMMIT_LINK=${CI_COMMIT_REF} NUXT_PUBLIC_BUILD_TIMESTAMP=${CI_PIPELINE_CREATED}

# expose port
EXPOSE ${PORT}

# run for production
CMD [ "node", "/app/.output/server/index.mjs"]
