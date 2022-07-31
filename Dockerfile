FROM node:latest
WORKDIR /App
RUN npm i -g npm@8.15.0
COPY package.json package-lock.json ./
RUN npm i
COPY . .
CMD ["node", "app"]