FROM node:16-alpine
# RUN apt update && apt install -y apt-transport-https ca-certificates sqlite3
WORKDIR /app 

COPY package.json yarn.lock ./

RUN yarn install

COPY . . 

RUN yarn build

EXPOSE 3001

CMD ["yarn", "watch"]