# College Management System

> [!NOTE]
> This project is powered by Neon PostgreSQL and hosted on Linode Kubernetes.

## 🚀 Deployment Status
Automated CI/CD is active via GitHub Actions.

A modern college management system built with Laravel 12, Inertia.js, React, and PostgreSQL.

## Features

- 🎓 **Student Management** - Registration, profiles, verification
- 📚 **Academic Setup** - Departments, Streams, Sessions
- 📝 **Admission** - Online applications, fee structures
- 💰 **Fee Management** - Fee heads, payments, receipts
- 📜 **Certificates** - Application and issuance
- 🌐 **Website Content** - Sliders, news, galleries
- 📩 **Grievances** - Student complaints and contact forms
- 👥 **User Management** - Roles and permissions
- 📊 **Audit Logs** - Track all changes

## Tech Stack

- **Backend**: Laravel 12, PHP 8.4
- **Frontend**: React 18, Inertia.js, TypeScript
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS, shadcn/ui
- **API Docs**: Swagger/OpenAPI

---

## 🐳 Setup with Docker (Recommended)

### Prerequisites
- Docker & Docker Compose installed

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd college-management-system

# 2. Copy environment file
cp .env.docker .env

# 3. Generate app key (if not set)
# You can do this after containers are up

# 4. Build and start containers
docker compose build
docker compose up -d

# 5. Wait for containers to be healthy, then run migrations
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed

# 6. Generate Swagger docs
docker compose exec app php artisan l5-swagger:generate
```

### Access Points
| Service | URL |
|---------|-----|
| Application | http://localhost:18088 |
| API Docs (Swagger) | http://localhost:18088/api/documentation |
| Adminer (DB GUI) | http://localhost:18090 |

Default ports (override in `.env`): `APP_PORT=18088`, `ADMINER_PORT=18090`, `POSTGRES_HOST_PORT=15432`, `VITE_PORT=15173`.

**Using Podman?** If you see "proxy already running" or "no such container", run `./scripts/podman-reset-and-up.sh` or see [docker/PODMAN.md](docker/PODMAN.md).

### Stopping & Restarting
```bash
# Stop containers
docker compose down

# Restart containers
docker compose up -d

# View logs
docker compose logs -f app
```

---

## 💻 Setup without Docker (Local Development)

### Prerequisites
- PHP 8.4+
- Composer
- Node.js 18+ & npm
- PostgreSQL 15+

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd college-management-system

# 2. Install PHP dependencies
composer install

# 3. Install Node.js dependencies
npm install

# 4. Copy environment file
cp .env.example .env

# 5. Configure database in .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=college_mgmt
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# 6. Generate application key
php artisan key:generate

# 7. Run migrations and seeders
php artisan migrate
php artisan db:seed

# 8. Generate Swagger docs
php artisan l5-swagger:generate

# 9. Build frontend assets
npm run build

# 10. Start the development server
php artisan serve
```

### Development Mode (with hot reload)
```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server
npm run dev
```

### Access Points
| Service | URL |
|---------|-----|
| Application | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/api/documentation |

---

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/Api/V1/   # API Controllers
│   ├── Models/                     # Eloquent Models
│   └── Traits/                     # Reusable Traits
├── config/
│   ├── cms.php                     # CMS Configuration
│   └── l5-swagger.php              # Swagger Config
├── database/
│   ├── migrations/                 # Database Migrations
│   └── seeders/                    # Database Seeders
├── resources/js/
│   ├── pages/                      # React Pages
│   ├── components/                 # React Components
│   └── layouts/                    # Page Layouts
├── routes/
│   ├── api.php                     # API Routes
│   └── web.php                     # UI Routes
└── docker/
    └── entrypoint.sh               # Docker Entrypoint
```

---

## 🔧 Configuration

### Single College Mode (Default)
The system is configured for single-college operation. The `college_id` is auto-populated from:

```env
CMS_DEFAULT_COLLEGE_ID=1
CMS_MULTI_COLLEGE_MODE=false
```

### Multi-College Mode
To enable multi-college support:
```env
CMS_MULTI_COLLEGE_MODE=true
```

---

## 📖 API Documentation

Swagger UI is available at `/api/documentation` (no authentication required).

### API Endpoints Summary

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /api/v1/auth/login`, `/register`, `/logout` |
| Students | `GET/POST/PUT/DELETE /api/v1/students` |
| Admission | `/api/v1/admission-heads`, `/api/v1/applications` |
| Fees | `/api/v1/fee-heads`, `/api/v1/fee-payments` |
| Certificates | `/api/v1/certificate-heads`, `/api/v1/certificate-applications` |
| Website | `/api/v1/website/sliders`, `/news`, `/galleries` |
| Grievances | `/api/v1/grievances`, `/api/v1/contacts` |
| Settings | `/api/v1/settings`, `/api/v1/audit-logs` |

---

## 🧪 Testing

```bash
# Run tests
php artisan test

# Run with coverage
php artisan test --coverage
```

---

## 📄 License

MIT License
