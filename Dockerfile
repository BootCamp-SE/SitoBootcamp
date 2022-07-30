FROM node:latest
WORKDIR /App
COPY package.json package-lock.json ./
RUN npm i
COPY . .
CMD ["node", "app"]