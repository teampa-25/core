FROM node:24-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g ts-node typescript nodemon

COPY . .
RUN tsc

CMD ["nodemon", "app.ts"]
