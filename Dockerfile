FROM node:18-alpine as base
RUN apk add --no-cache tzdata
ENV TZ=Europe/Warsaw

FROM base AS packages
WORKDIR /poe-news
ARG config=prod
COPY package*.json ./
RUN \
    --mount=type=cache,target=/poe-news/.npm \
    npm set cache /poe-news/.npm && \
    npm install

FROM packages AS builder
COPY UtilsAndConfigs ./UtilsAndConfigs
COPY tsconfig*.json ./
COPY src src
RUN npm run build:${config}

FROM packages
ENV NODE_ENV=production
COPY --from=builder /poe-news/dist .
COPY --from=builder /poe-news/dist-env/ ./config/
CMD ["node", "main.js"]