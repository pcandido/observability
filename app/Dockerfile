FROM node:alpine

WORKDIR /app

RUN apk update && apk add curl

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod

COPY src ./src/

CMD ["yarn", "start"]