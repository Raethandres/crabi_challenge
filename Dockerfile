FROM node:16.13.2-slim as node

ENV NPM_CONFIG_LOGLEVEL=http

FROM node
ENV PATH="/container-app/node_modules/.bin:${PATH}"
WORKDIR /container-app/server
COPY ./server/package*.json ./
RUN npm install
COPY ./server .
WORKDIR /container-app/server
RUN npm run build

WORKDIR /container-app/
COPY ./server .

USER node