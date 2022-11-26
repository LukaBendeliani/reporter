FROM node:16-alpine

WORKDIR /client

COPY . .

RUN npm install


EXPOSE 3000

CMD [ "npm", "run", "start" ]