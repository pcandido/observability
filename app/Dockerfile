FROM node:alpine

ENV PORT=8080
HEALTHCHECK --start-period=5s --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:$PORT/health-check

WORKDIR /app

RUN apk update && apk add curl

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod

COPY src ./src/

CMD ["yarn", "start"]