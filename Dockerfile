# Builder
FROM node:10.15.1-alpine AS build

LABEL maintainer="mhavelant"

ENV PATH="/home/node/app/node_modules/.bin:$PATH"

WORKDIR /home/node/app

COPY package*.json ./

RUN apk add --no-cache \
        util-linux=2.32-r0 \
        python=2.7.15-r1 \
        # @todo: libcairo and anything else node-gyp wants.
        pkgconf=1.5.3-r0 \
        build-base \
        g++=6.4.0-r9 \
        cairo-dev=1.14.12-r2 \
        jpeg-dev=8-r6 \
        pango-dev=1.40.14-r1 \
        giflib-dev=5.1.4-r2 \
        git=2.18.1-r0 && \
    \
    npm ci && \
    chown -R node:node /home/node

COPY . .

RUN npm run-script build

# Actual
FROM pagespeed/nginx-pagespeed:1.13.35.2-alpine3.8-ngx1.15

LABEL maintainer="mhavelant"

COPY --from=build /home/node/app/build /var/www
COPY --from=build /home/node/app/src/robots.txt /var/www
COPY docker/nginx_config/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx_config/additional /etc/nginx/additional

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
