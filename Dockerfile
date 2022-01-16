FROM node:17.3.1
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run tsc
CMD node dist/index.js