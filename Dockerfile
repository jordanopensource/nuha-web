# set global args
ARG USER=node DRONE_COMMIT_SHA=${DRONE_COMMIT_SHA} DRONE_BUILD_NUMBER=${DRONE_BUILD_NUMBER} DRONE_BUILD_LINK=${DRONE_BUILD_LINK} DRONE_COMMIT_LINK=${DRONE_COMMIT_LINK} DRONE_REPO_LINK=${DRONE_REPO_LINK} DRONE_BUILD_FINISHED=${DRONE_BUILD_FINISHED}

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
ARG DRONE_COMMIT_SHA
ARG DRONE_BUILD_NUMBER
ARG DRONE_BUILD_LINK
ARG DRONE_COMMIT_LINK
ARG DRONE_REPO_LINK
ARG DRONE_BUILD_FINISHED

# copy builder output to project workdir
WORKDIR /app
COPY --from=builder --chown=${USER}:${USER} /workspace/package.json /app/
COPY --from=builder --chown=${USER}:${USER} /workspace/.output /app/.output

# set user context
USER ${USER}

# inject build args as enviroment variables
ENV NUXT_PUBLIC_BUILD_COMMIT_SHA=${DRONE_COMMIT_SHA} NUXT_PUBLIC_BUILD_NUMBER=${DRONE_BUILD_NUMBER} NUXT_PUBLIC_BUILD_LINK=${DRONE_BUILD_LINK} NUXT_PUBLIC_BUILD_COMMIT_LINK=${DRONE_COMMIT_LINK} NUXT_PUBLIC_BUILD_REPO_LINK=${DRONE_REPO_LINK} NUXT_PUBLIC_BUILD_TIMESTAMP=${DRONE_BUILD_FINISHED}

# expose port
EXPOSE ${PORT}

# run for production
CMD [ "node", "/app/.output/server/index.mjs"]
