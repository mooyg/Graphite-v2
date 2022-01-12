FROM node:16.6.0
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run tsc
CMD node dist/bot.js