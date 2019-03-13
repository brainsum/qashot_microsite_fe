# Build.
FROM node:10.15.1-alpine as builder

ENV PATH="/home/node/app/node_modules/.bin:$PATH"

WORKDIR /home/node/app

COPY ["package.json", "package-lock.json", "./"]

RUN apk add --update --no-cache \
        python=2.7.15-r1 \
        util-linux=2.32-r0 \
        python=2.7.15-r1 \
        # @todo: libcairo and anything else node-gyp wants.
        pkgconf=1.5.3-r0 \
        build-base=0.5-r1 \
        g++=6.4.0-r9 \
        cairo-dev=1.14.12-r2 \
        jpeg-dev=8-r6 \
        pango-dev=1.40.14-r1 \
        giflib-dev=5.1.4-r2 \
        git=2.18.1-r0 && \
    chown node:node . -R

USER node

RUN \
    npm ci && \
    npm cache -g clean --force

COPY . .

RUN npm run-script build


# Actual.
FROM php:7.2.15-fpm-alpine3.9

LABEL maintainer="mhavelant"

WORKDIR /var/www/html
VOLUME /var/www/html

# Use the default production configuration
USER root
RUN mv "${PHP_INI_DIR}/php.ini-production" "${PHP_INI_DIR}/php.ini"

USER www-data

COPY --from=builder --chown=www-data:www-data ["/home/node/app/build", "/var/www/html"]
