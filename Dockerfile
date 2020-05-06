FROM nginx:stable-alpine
ARG PUID=82
ARG PGID=82
RUN apk update && apk add bash curl tzdata shadow
RUN cp /usr/share/zoneinfo/Europe/Warsaw /etc/localtime && date
RUN groupmod -g ${PGID} www-data \
 && adduser -u ${PUID} -G www-data -D www-data
RUN apk del shadow
