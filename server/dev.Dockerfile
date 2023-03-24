FROM node:16-alpine

WORKDIR /use/app

COPY package*.json ./

RUN yarn

COPY . .

CMD ["yarn", "start"]