FROM node:24-alpine

RUN apk add --no-cache postgresql-client


WORKDIR /app

COPY package*.json .
RUN npm install
RUN npm install -g ts-node typescript nodemon

COPY . .

CMD ["npm", "run", "dev"]
