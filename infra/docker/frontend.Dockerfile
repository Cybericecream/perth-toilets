FROM node:16.15.0-alpine3.15

WORKDIR /app

COPY ./frontend /app

RUN npm i -g ts-node-dev
RUN npm install ci

CMD [ "npm", "run", "start" ]