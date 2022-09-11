FROM node:18-alpine as build-image
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
RUN npm ci
RUN npm run build --if-present

FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build-image ./usr/src/app/dist ./dist
RUN npm ci --production
COPY . .
CMD [ "node", "dist/application.js" ]
ENV PORT 80
