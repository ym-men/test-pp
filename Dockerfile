FROM node:10-alpine as installer

RUN apk update && apk add --no-cache make gcc g++ python bash git findutils

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci -q

FROM installer AS build

WORKDIR /app

COPY .env.production .env.production
COPY tsconfig.json tsconfig.json
COPY tsconfig.prod.json tsconfig.prod.json
COPY tslint.json tslint.json
COPY entities.d.ts entities.d.ts
COPY async-validator.d.ts async-validator.d.ts
COPY images.d.ts images.d.ts
COPY stylus.d.ts stylus.d.ts
COPY superagent-mock.d.ts superagent-mock.d.ts
COPY window.d.ts window.d.ts
COPY src src
COPY mockApi mockApi
COPY config config
COPY scripts scripts
COPY public public


ARG OUTLINE
RUN npm run build
RUN npm prune --production

FROM node:10-alpine

RUN apk update

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/mocks /app/mocks
COPY --from=build /app/build /app/build

COPY package.json /app

EXPOSE 3000

CMD npm run prod
