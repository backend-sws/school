# =============================================================================
# Stage 1: Build frontend assets
# =============================================================================
FROM node:20-alpine AS frontend-builder

ARG SKIP_FRONTEND_BUILD=false

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Copy source files needed for build (wayfinder types are pre-generated and committed)
COPY resources ./resources
COPY vite.config.ts tsconfig.json ./
COPY components.json ./

# Local compose uses the `vite` service for HMR â€” skip heavy production build in-container.
ENV SKIP_WAYFINDER=true
ENV NODE_OPTIONS="--max_old_space_size=2048"
RUN if [ "$SKIP_FRONTEND_BUILD" = "true" ]; then \
      mkdir -p public/build && printf '{}' > public/build/manifest.json; \
    else \
      npm ci && npm run build; \
    fi

# =============================================================================


# Stage 2: PHP-FPM Application
# =============================================================================
FROM php:8.4-fpm-alpine AS app

# Optional mirror override (accepts host, host/alpine, or full https URL)
ARG ALPINE_MIRROR=dl-cdn.alpinelinux.org
RUN set -eux; \
    ALPINE_VERSION="$(cut -d. -f1,2 /etc/alpine-release)"; \
    PRIMARY_MIRROR="${ALPINE_MIRROR#https://}"; \
    PRIMARY_MIRROR="${PRIMARY_MIRROR#http://}"; \
    PRIMARY_MIRROR="${PRIMARY_MIRROR%/}"; \
    PRIMARY_MIRROR="${PRIMARY_MIRROR%/alpine}"; \
    cat > /etc/apk/repositories <<EOF
https://${PRIMARY_MIRROR}/alpine/v${ALPINE_VERSION}/main
https://${PRIMARY_MIRROR}/alpine/v${ALPINE_VERSION}/community
https://dl-cdn.alpinelinux.org/alpine/v${ALPINE_VERSION}/main
https://dl-cdn.alpinelinux.org/alpine/v${ALPINE_VERSION}/community
https://mirror.leaseweb.com/alpine/v${ALPINE_VERSION}/main
https://mirror.leaseweb.com/alpine/v${ALPINE_VERSION}/community
https://alpine.global.ssl.fastly.net/alpine/v${ALPINE_VERSION}/main
https://alpine.global.ssl.fastly.net/alpine/v${ALPINE_VERSION}/community
EOF

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev \
    icu-dev \
    linux-headers \
    ffmpeg

# Install PHP extensions (pcntl required for Laravel Reverb signal handling: SIGINT, SIGTERM)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    pgsql \
    gd \
    zip \
    bcmath \
    opcache \
    intl \
    mbstring \
    pcntl \
    && apk add --no-cache --virtual .phpize-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .phpize-deps

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies (no dev for production)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application code
COPY . .

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/public/build ./public/build

# Ensure Laravel bootstrap/cache and storage dirs exist (excluded via .dockerignore)
RUN mkdir -p bootstrap/cache \
    storage/framework/cache/data storage/framework/sessions storage/framework/views storage/app/public storage/logs \
    && chmod -R 775 bootstrap/cache storage

# Generate optimized autoloader
RUN composer dump-autoload --optimize

# Copy Swagger UI assets to public folder
RUN mkdir -p public/vendor/swagger-api/swagger-ui \
    && cp -r vendor/swagger-api/swagger-ui/dist/* public/vendor/swagger-api/swagger-ui/

# Set proper permissions (777 for rootless Podman compatibility â€” UID mapping
# makes chown ineffective, so storage must be world-writable for local dev)
RUN chown -R www-data:www-data /var/www/html 2>/dev/null || true \
    && chmod -R 777 /var/www/html/storage \
    && chmod -R 777 /var/www/html/bootstrap/cache

# Copy entrypoint script (strip CRLF so shebang works on all platforms)
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

# Configure PHP-FPM
RUN echo "php_admin_value[error_log] = /var/log/php-fpm-error.log" >> /usr/local/etc/php-fpm.d/www.conf \
    && echo "php_admin_flag[log_errors] = on" >> /usr/local/etc/php-fpm.d/www.conf

# Configure OPcache for development (production uses Dockerfile.prod)
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini

EXPOSE 9000

ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
