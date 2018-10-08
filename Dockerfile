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
FROM pagespeed/nginx-pagespeed:1.13.35-alpine3.8-ngx1.15

LABEL maintainer="mhavelant"

COPY --from=build /home/node/app/build /var/www
COPY --from=build /home/node/app/src/robots.txt /var/www
COPY docker/nginx_config/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx_config/additional /etc/nginx/additional

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
