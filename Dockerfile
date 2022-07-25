FROM node:16-alpine AS builder
WORKDIR /app
ARG config=prod
COPY package*.json ./
RUN npm ci
COPY UtilsAndConfigs ./UtilsAndConfigs
COPY tsconfig*.json ./
COPY src src
RUN npm run build:${config}


FROM node:16-alpine
WORKDIR /poe-news
RUN apk add --no-cache tzdata
ENV TZ=Europe/Warsaw
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install
COPY --from=builder /app/dist .
COPY --from=builder /app/dist-env/ ./config/
CMD ["node", "main.js"]