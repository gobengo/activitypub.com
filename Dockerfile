# syntax=docker/dockerfile:experimental
FROM node:12-stretch-slim

ARG NPM_CONFIG_LOGLEVEL
ENV GIT_SSH_COMMAND="ssh -vvv"

# install ssh client and git
RUN apt-get update && apt-get install -y openssh-client git
# download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan gitlab.gitlab.prod.env.infra.permanent.company >> ~/.ssh/known_hosts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN --mount=type=ssh npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

# GitLab AutoDevops uses port 5000
ENV PORT 5000

ENV NODE_ENV=production

CMD [ "node", "build/server.js" ]
