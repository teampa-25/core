FROM node:24-alpine

RUN apk add --no-cache bash ffmpeg

WORKDIR /app

COPY package*.json .
RUN npm install
RUN npm install -g ts-node typescript nodemon

COPY . .

RUN chmod +x entrypoint/entrypoint.sh
RUN dos2unix entrypoint/entrypoint.sh

ENTRYPOINT ["bash", "./entrypoint/entrypoint.sh"]

# Dev
# CMD ["npm", "run", "dev"]

# Production
CMD ["npm", "run", "start"]
