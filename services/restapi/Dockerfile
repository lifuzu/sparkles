FROM node:8
MAINTAINER Richard Li <lifuzu@gmail.com>

WORKDIR /home/node/sparkles

COPY package.json .
RUN npm install --production
COPY . .

EXPOSE 3000

USER node
CMD ["npm", "start"]
