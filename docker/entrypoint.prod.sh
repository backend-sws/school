#!/bin/sh
set -e

echo "🚀 Starting Laravel application (Production)..."

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

chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Create .env file from environment variables if it doesn't exist
if [ ! -f /var/www/html/.env ]; then
    echo "📝 Creating .env file from environment variables..."
    cat > /var/www/html/.env <<EOF
APP_NAME="${APP_NAME:-Laravel}"
APP_ENV=production
APP_KEY=${APP_KEY:-}
APP_DEBUG=false
APP_URL=${APP_URL:-http://localhost}

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=${DB_CONNECTION:-pgsql}
DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE:-college_mgmt}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-secret}

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
EOF
fi

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Run database migrations (Handled by CI/CD Job)
# echo "🗄️ Running database migrations..."
# php artisan migrate --force

# Production optimizations
echo "⚡ Optimizing for production..."
php artisan config:cache
# Allow route:cache to fail (e.g. missing controller in older image) so app can still boot
php artisan route:cache 2>/dev/null || true
php artisan view:cache 2>/dev/null || true
php artisan event:cache 2>/dev/null || true

# Create storage symlink if not exists
php artisan storage:link --force 2>/dev/null || true

echo "✅ Laravel application ready!"

# Execute the main command (supervisord)
exec "$@"
