FROM nginx:1.22.0

RUN rm /etc/nginx/conf.d/default.conf

COPY dev/conf.d/default.conf /etc/nginx/conf.d/default.conf
