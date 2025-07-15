FROM node:24-alpine

RUN apk add --no-cache bash postgresql-client ffmpeg

WORKDIR /app

COPY package*.json .
RUN npm install
RUN npm install -g ts-node typescript nodemon

COPY . .

RUN chmod +x entrypoint/entrypoint.sh
RUN dos2unix entrypoint/entrypoint.sh
ENTRYPOINT ["bash", "./entrypoint/entrypoint.sh"]
CMD ["npm", "run", "dev"]
