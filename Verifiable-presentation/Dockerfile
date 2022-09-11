# Stage 1 - building node_modules
FROM node:12.19.1-alpine3.12@sha256:3ae30348acd445501758896f691106cbc32111f3525651c7256a7df75aa8a97d AS builder
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent
COPY nest-cli.json tsconfig.build.json tsconfig.json ./
COPY src src
RUN yarn build

# Stage 2
FROM node:12.19.1-alpine3.12@sha256:3ae30348acd445501758896f691106cbc32111f3525651c7256a7df75aa8a97d
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent --production && yarn cache clean
# copy the rest of the files
COPY --from=builder dist dist
COPY views views
COPY public public

ENV PORT=3000

RUN chown node:node ./
USER node

EXPOSE 3000/tcp

CMD [ "node", "dist/main" ]




