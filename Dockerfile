# Builder
FROM node:10.9.0-alpine AS build

LABEL maintainer="mhavelant"

ENV PATH="/home/node/app/node_modules/.bin:$PATH"

WORKDIR /home/node/app

COPY package*.json ./

RUN apk add --no-cache util-linux && \
    npm install && \
    chown -R node:node /home/node

COPY . .

RUN npm run-script build

# Actual
FROM nginx:1.15.5-alpine
LABEL maintainer="mhavelant"
COPY --from=build /home/node/app/build /var/www
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]