FROM node:16-alpine

WORKDIR /app 

COPY package.json yarn.lock ./

COPY . . 

RUN yarn install

RUN yarn build

EXPOSE 3001

CMD ["yarn", "watch"]
