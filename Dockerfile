FROM node:20.2.0-slim as node
ENV NPM_CONFIG_LOGLEVEL=error
ENV PATH="/app/node_modules/.bin:${PATH}"
WORKDIR /app
COPY ./server/package*.json ./
RUN npm install
COPY ./server .
RUN npm run build
USER node