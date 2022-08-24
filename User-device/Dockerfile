# Demo Homepage
#
# Multi-stage build that:
#   - creates a production build of the frontend
#   - serves the build with nginx
#
# Required ARG variables:
#   - PUBLIC_URL
#   - REACT_APP_EBSI_ENV ("local", "integration", "development", "production")
#
# Optional ARG variables:
#   - REACT_APP_SELF_SOVEREIGN_IDENTITY_URL
#   - REACT_APP_NOTARISATION_URL
#   - REACT_APP_DIPLOMA_BACHELOR_URL
#   - REACT_APP_DIPLOMA_MASTER_URL
#   - REACT_APP_WALLET_WEB_CLIENT_URL
#   - REACT_APP_TRUSTED_DATA_SHARING_URL
#

## Stage 1: install dependencies and copy files
FROM node:12.19.1-alpine3.12@sha256:3ae30348acd445501758896f691106cbc32111f3525651c7256a7df75aa8a97d AS base
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/package.json
COPY ./yarn.lock /usr/src/app/yarn.lock
RUN yarn install --frozen-lockfile --silent
COPY . /usr/src/app/
ARG PUBLIC_URL
ARG REACT_APP_EBSI_ENV
ARG REACT_APP_SELF_SOVEREIGN_IDENTITY_URL
ARG REACT_APP_NOTARISATION_URL
ARG REACT_APP_DIPLOMA_BACHELOR_URL
ARG REACT_APP_DIPLOMA_MASTER_URL
ARG REACT_APP_WALLET_WEB_CLIENT_URL
ARG REACT_APP_TRUSTED_DATA_SHARING_URL
RUN yarn build && yarn compress

# Stage 2: run nginx
FROM nginx:1.19.2-alpine@sha256:a97eb9ecc708c8aa715ccfb5e9338f5456e4b65575daf304f108301f3b497314
RUN mkdir -p /app
WORKDIR /app
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid
USER nginx
COPY --from=base /usr/src/app/build /app/demo
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
