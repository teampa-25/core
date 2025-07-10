FROM node:24-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chmod +x ./wait-for-db.sh

#RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "./wait-for-db.sh && npm run dev"]
