#!/bin/sh
set -e

echo "🚀 Starting Laravel application..."

# Unset APP_KEY if it is empty to allow Laravel to use the one in .env or generate one
if [ -z "$APP_KEY" ]; then
    unset APP_KEY
fi

# Wait for PostgreSQL to be ready
if [ -n "$DB_HOST" ]; then
    echo "⏳ Waiting for PostgreSQL at $DB_HOST:${DB_PORT:-5432}..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if nc -z "$DB_HOST" "${DB_PORT:-5432}" 2>/dev/null; then
            echo "✅ PostgreSQL is ready!"
            break
        fi
        
        attempt=$((attempt + 1))
        echo "   Attempt $attempt/$max_attempts - PostgreSQL not ready yet..."
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Could not connect to PostgreSQL after $max_attempts attempts"
        exit 1
    fi
fi

# Ensure storage directories exist and have correct permissions
echo "📁 Setting up storage directories..."
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage 2>/dev/null || true
chown -R www-data:www-data /var/www/html/bootstrap/cache 2>/dev/null || true
chmod -R 777 /var/www/html/storage 2>/dev/null || true
chmod -R 777 /var/www/html/bootstrap/cache 2>/dev/null || true

# Create .env file from environment variables if it doesn't exist
if [ ! -f /var/www/html/.env ]; then
    echo "📝 Creating .env file from environment variables..."
    cat > /var/www/html/.env << EOF
APP_NAME="${APP_NAME:-Laravel}"
APP_ENV="${APP_ENV:-local}"
APP_KEY="${APP_KEY:-}"
APP_DEBUG="${APP_DEBUG:-true}"
APP_URL="${APP_URL:-http://localhost}"

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION="${DB_CONNECTION:-pgsql}"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_DATABASE="${DB_DATABASE:-rishividya}"
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-secret}"

SESSION_DRIVER="${SESSION_DRIVER:-database}"
SESSION_LIFETIME="${SESSION_LIFETIME:-120}"
SESSION_COOKIE="${SESSION_COOKIE:-laravel_session}"
SESSION_DOMAIN="${SESSION_DOMAIN:-}"
SESSION_SECURE_COOKIE="${SESSION_SECURE_COOKIE:-false}"
CACHE_STORE="${CACHE_STORE:-${CACHE_DRIVER:-file}}"
CACHE_DRIVER="${CACHE_DRIVER:-file}"
QUEUE_CONNECTION="${QUEUE_CONNECTION:-sync}"

REDIS_HOST="${REDIS_HOST:-127.0.0.1}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_PASSWORD="${REDIS_PASSWORD:-null}"

MAIL_MAILER="${MAIL_MAILER:-log}"
MAIL_HOST="${MAIL_HOST:-}"
MAIL_PORT="${MAIL_PORT:-587}"
MAIL_USERNAME="${MAIL_USERNAME:-}"
MAIL_PASSWORD="${MAIL_PASSWORD:-}"
MAIL_ENCRYPTION="${MAIL_ENCRYPTION:-tls}"
MAIL_FROM_ADDRESS="${MAIL_FROM_ADDRESS:-}"
MAIL_FROM_NAME="${MAIL_FROM_NAME:-${APP_NAME:-Laravel}}"

REVERB_APP_ID="${REVERB_APP_ID:-}"
REVERB_APP_KEY="${REVERB_APP_KEY:-}"
REVERB_APP_SECRET="${REVERB_APP_SECRET:-}"
REVERB_HOST="${REVERB_HOST:-}"
REVERB_PORT="${REVERB_PORT:-8080}"
REVERB_SCHEME="${REVERB_SCHEME:-http}"

VITE_APP_NAME="${VITE_APP_NAME:-${APP_NAME:-Laravel}}"
VITE_APP_URL="${VITE_APP_URL:-${APP_URL:-http://localhost}}"
VITE_BRAND_NAME="${VITE_BRAND_NAME:-}"
VITE_REVERB_APP_KEY="${VITE_REVERB_APP_KEY:-${REVERB_APP_KEY:-}}"
VITE_REVERB_HOST="${VITE_REVERB_HOST:-${REVERB_HOST:-}}"
VITE_REVERB_PORT="${VITE_REVERB_PORT:-${REVERB_PORT:-8080}}"
VITE_REVERB_SCHEME="${VITE_REVERB_SCHEME:-${REVERB_SCHEME:-http}}"

EMS_DEFAULT_INSTITUTION_DOMAIN="${EMS_DEFAULT_INSTITUTION_DOMAIN:-}"
EMS_POWERED_BY="${EMS_POWERED_BY:-}"
EMS_POWERED_BY_URL="${EMS_POWERED_BY_URL:-}"
EMS_DESIGNED_BY="${EMS_DESIGNED_BY:-}"
EMS_DESIGNED_BY_URL="${EMS_DESIGNED_BY_URL:-}"
EOF
fi

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Run database migrations (non-fatal: don't crash if a migration has issues)
echo "🗄️ Running database migrations..."
php artisan migrate --force || echo "⚠️  Migration had errors (non-fatal) — app will continue starting"

# Clear and cache configuration (production optimization)
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Optimizing for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    echo "🔧 Development mode - clearing caches..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
fi

echo "✅ Laravel application ready!"

# Execute the main command (php-fpm)
exec "$@"
