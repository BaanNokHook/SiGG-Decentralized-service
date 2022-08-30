# Diploma
#
# Multi-stage build that:
#   - creates production builds of the 2 frontends
#   - compiles the backend (TypeScript -> JavaScript)
#   - creates a clean Node alpine container which imports the builds and then starts the server
#
# Required ARG variables:
#   - APP_PUBLIC_URL
#   - SiGG_ENV ("local", "integration", "development", "production")
#
# Optional ARG variables:
#   - SiGG_DEMONSTRATOR_URL
#   - SiGG_WALLET_WEB_CLIENT_URL
#   - BACHELOR_PUBLIC_URL (default: "${APP_PUBLIC_URL}/bachelor")
#   - MASTER_PUBLIC_URL (default: "${APP_PUBLIC_URL}/master")
#
# Internal ARGs, do NOT override:
#   - PUBLIC_URL
#   - REACT_APP_DEMONSTRATOR_URL
#   - REACT_APP_WALLET_WEB_CLIENT_URL
#   - REACT_APP_BACKEND_EXTERNAL_URL
#
# Required ENV variables:
#   - SiGG_ENV ("local", "integration", "development", "production")
#   - BACHELOR_ISSUER
#   - BACHELOR_PRIVATE_KEY (hexadecimal key)
#   - MASTER_ISSUER
#   - MASTER_PRIVATE_KEY (hexadecimal key)
#
# Optional ENV variables:
#   - NODE_ENV (default: "production")
#   - APP_PORT (default: set in code - 8080)
#   - APP_PUBLIC_URL (default: set in code)
#   - APP_INTERNAL_URL (default: set in code) (useful for local testing only)
#   - SiGG_WALLET_API (default: set in code)
#   - SiGG_VERIFIABLE_CREDENTIAL_API (default: set in code)
#   - SiGG_VERIFIABLE_PRESENTATION_API (default: set in code)
#   - LOG_LEVEL ("error", "warn", "info", "verbose" or "debug" ; default: set in code, depends on SiGG_ENV)
#

# Set default values for optional ARGs
ARG APP_PUBLIC_URL
ARG BACHELOR_PUBLIC_URL="${APP_PUBLIC_URL}/bachelor"
ARG MASTER_PUBLIC_URL="${APP_PUBLIC_URL}/master"

# Stage 0: prepare node alpine image with package.json files and production node_modules
FROM node:12.19.1-alpine3.12@sha256:3ae30348acd445501758896f691106cbc32111f3525651c7256a7df75aa8a97d AS base
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/package.json
COPY ./yarn.lock /usr/src/app/yarn.lock
COPY ./packages/bachelor-frontend/package.json /usr/src/app/packages/bachelor-frontend/package.json
COPY ./packages/backend/package.json /usr/src/app/packages/backend/package.json
COPY ./packages/master-frontend/package.json /usr/src/app/packages/master-frontend/package.json
RUN yarn install --frozen-lockfile --silent --production && yarn cache clean

# Stage 1: build packages
FROM base AS builder
WORKDIR /usr/src/app
# Install dev dependencies as well
RUN yarn install --frozen-lockfile --silent
# Import ARGs
ARG APP_PUBLIC_URL
ARG SiGG_ENV
ARG SiGG_DEMONSTRATOR_URL
ARG SiGG_WALLET_WEB_CLIENT_URL
# Required custom ARGs
ARG REACT_APP_SiGG_ENV=${SiGG_ENV}
# Custom environment variables
ARG REACT_APP_DEMONSTRATOR_URL=${SiGG_DEMONSTRATOR_URL}
ARG REACT_APP_BACKEND_EXTERNAL_URL=${APP_PUBLIC_URL}
ARG REACT_APP_WALLET_WEB_CLIENT_URL=${SiGG_WALLET_WEB_CLIENT_URL}
# 1.1 Build Diploma Bachelor frontend
COPY ./packages/bachelor-frontend /usr/src/app/packages/bachelor-frontend
ARG BACHELOR_PUBLIC_URL
ARG PUBLIC_URL=${BACHELOR_PUBLIC_URL}
RUN cd packages/bachelor-frontend && yarn build
# 1.2 Build Diploma Master frontend
COPY ./packages/master-frontend /usr/src/app/packages/master-frontend
ARG MASTER_PUBLIC_URL
ARG PUBLIC_URL=${MASTER_PUBLIC_URL}
RUN cd packages/master-frontend && yarn build
# 1.3 Build Diploma backend
COPY ./packages/backend /usr/src/app/packages/backend
RUN cd packages/backend && yarn build

# Stage 2: copy only the necessary files and start the server
FROM base
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/packages/backend/public /usr/src/app/packages/backend/public
COPY --from=builder /usr/src/app/packages/backend/dist /usr/src/app/packages/backend/dist
COPY --from=builder /usr/src/app/packages/bachelor-frontend/build /usr/src/app/packages/backend/public/bachelor
COPY --from=builder /usr/src/app/packages/master-frontend/build /usr/src/app/packages/backend/public/master
COPY ./packages/backend/scripts/start.sh /usr/src/app/packages/backend/scripts/start.sh
USER node
ENV NODE_ENV production
CMD cd packages/backend && sh scripts/start.sh
