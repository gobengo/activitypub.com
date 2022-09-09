FROM nginx
ENV NGINX_CONF /etc/nginx
ENV NGINX_SHARE /usr/share/nginx
RUN echo NGINX_CONF=$NGINX_CONF
RUN echo NGINX_SHARE=$NGINX_SHARE

RUN mkdir -p $NGINX_CONF
RUN mkdir -p $NGINX_SHARE/html

COPY index.html $NGINX_SHARE/html
COPY did.json $NGINX_SHARE/html/.well-known/did.json

# add nginx conf
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/templates/nginx.conf.template $NGINX_CONF/templates/nginx.conf.template
