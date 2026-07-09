FROM nginx:alpine

# Install apache2-utils for htpasswd
RUN apk add --no-cache apache2-utils

# Create credentials from build args
ARG DOCS_USER=developer
ARG DOCS_PASS=docs@pdseducation
RUN htpasswd -cb /etc/nginx/.htpasswd "$DOCS_USER" "$DOCS_PASS"

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
