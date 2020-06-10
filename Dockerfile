### Employs docker multi stage builds to make the final image in Stage 2 smaller

### Stage 1: Build stage ###
# make sure to build against the node version used in development
FROM node:10-alpine as build

# Set work directory
WORKDIR /usr/src/nuxt_app

# Copy package.json and package-lock.json
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY nuxt.config.js .
COPY .env.example .env
# Bundle the remaining app source
COPY . .

# Build Nuxt app
RUN npm run build


### Stage 2 ###
FROM node:10-alpine

# Set work directory
WORKDIR /usr/src/nuxt_app

# Set environment variables
ENV NODE_ENV production
# Tell nuxt to bind and listen on all interfaces,
# otherwise the app is unavailable to the host running Docker
ENV HOST 0.0.0.0

COPY package.json .
COPY .env.example .env
COPY nuxt.config.js .
COPY modules ./modules/
# Copy necessary generated artifacts from build image created in Stage 1
COPY --from=build ./usr/src/nuxt_app/node_modules ./node_modules/
COPY --from=build ./usr/src/nuxt_app/.build ./.build/
# If using nuxt generate, docker WORKDIR must have been set to /var/www/html so just copy the generate output  into WORKDIR so a webserver nike nginx can access it
# COPY --from=build ./usr/src/nuxt_app/generate .

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Start app
CMD [ "npm", "run", "start" ]
