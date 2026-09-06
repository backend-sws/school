# SaaS School Management System

A modern, multi-tenant SaaS School/College management system built with Laravel 12, Inertia.js, React, and MySQL.

## Features

- 🎓 **Multi-Tenant SaaS** - Infinite schools from a single database/codebase.
- 🏫 **Subdomain Routing** - Automatic school resolution (e.g. `school1.yoursaas.com`).
- 🌐 **Custom Domains** - Full support for mapping custom domains to specific schools.
- 👥 **User Roles** - Super Admin, School Admin, Teacher, Student, Parent.
- 📚 **Academic Setup** - Timetables, Subjects, Streams, Sessions.
- 💰 **Fee Management** - Dynamic fee structures, receipts, reports.
- 📄 **Heavy Optimizations** - PDF Generation and Excel exports optimized for Shared Hosting memory constraints.

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, Inertia.js, TypeScript
- **Database**: MySQL (or PostgreSQL via driver support)
- **Styling**: Tailwind CSS, shadcn/ui

---

## 💻 Local Development Setup (Windows / XAMPP)

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ & npm
- MySQL (XAMPP / WAMP)

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd zytrixonschool

# 2. Install PHP dependencies
composer install

# 3. Install Node.js dependencies
npm install

# 4. Copy environment file
cp .env.example .env

# 5. Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=school
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Generate application key
php artisan key:generate

# 7. Run migrations and seeders (Creates Super Admin)
php artisan migrate:fresh --seed

# 8. Start the development server (Terminal 1)
php artisan serve

# 9. Start Vite for frontend hot-reload (Terminal 2)
npm run dev
```

> **Note on Service Workers**: If you previously had `APP_ENV=production` locally, VitePWA might cache HTTPS routes. Open browser DevTools > Application > Service Workers and click "Unregister" to fix local SSL errors.

---

## 🚀 Shared Hosting / cPanel Deployment Guide

This application is fully optimized to run on standard Shared Hosting (e.g., Hostinger, GoDaddy) using a **Single Database Multi-Tenancy** approach.

### 1. Pre-deployment (Local)
Shared hosting often doesn't handle Node.js compilation well. Compile your assets locally:
```bash
npm run build
```
Create a `.zip` of your project. **Include `vendor` and `public/build`**, but **Exclude `node_modules`**.

### 2. File Upload & Setup
1. Upload the `.zip` to your cPanel File Manager (e.g., in `/home/username/school_saas/`).
2. Extract the files.
3. Configure your Domain or Subdomain's **Document Root** to point to the `/public` directory (e.g., `/home/username/school_saas/public`).

### 3. Database
1. Create a MySQL Database and User in cPanel.
2. Edit your `.env` file with the production credentials and set:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yoursaasdomain.com
   FORCE_HTTPS=true
   ```

### 4. Run Migrations & Cache
Run the following via cPanel Terminal or SSH:
```bash
cd school_saas
php artisan migrate --seed
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 5. Multi-Tenant Subdomains (Wildcard)
To dynamically route `school1.domain.com` without creating folders:
1. In cPanel, create a Subdomain named `*` (asterisk).
2. Point its Document Root to the same `/public` folder.
3. In your DNS settings, ensure there is an `A` record for `*` pointing to your Server IP.

### 6. Background Tasks (Cron Job)
Add a Cron Job in cPanel to run **Once Per Minute** (`* * * * *`):
```bash
cd /home/username/school_saas && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔗 Custom Domain Mapping

If a school wants to use a custom domain (e.g., `their-school.com`):
1. **App Level:** Login as Super Admin and assign the domain to their Institution profile.
2. **cPanel Level:** Add the domain as an **Alias / Parked Domain** or **Addon Domain** pointing to the exact same `/public` document root.
3. **DNS Level:** The school points their `A Record` to your server IP.

---

## 👥 Student Management CLI & Maintenance

### 1. Bulk Student Import (CLI)
To import existing students directly from a local CSV file without queue delays:
```bash
php artisan import:existing-students storage/your_file.csv --institution=1
```

### 2. Bulk Student Purge / Reset (`students:purge`)
Use this command when students were imported with incorrect data and need to be completely removed along with all associated fees, balances, user accounts, and enrollments before re-importing.

> **Safety:** This command automatically protects and excludes staff and administrator accounts (`super_admin`, `institution_admin`, `principal`, `teacher`, `accountant`, etc.).

#### A. Dry-Run (Preview what will be deleted without touching DB)
```bash
php artisan students:purge --institution=1 --all --dry-run
```

#### B. Purge All Students in Institution
```bash
# Interactive (with confirmation prompt)
php artisan students:purge --institution=1 --all

# Force (non-interactive / script mode)
php artisan students:purge --institution=1 --all --force

# Also clear past student import logs
php artisan students:purge --institution=1 --all --clear-import-logs --force
```

#### C. Filtered Purge (Specific Session or Stream/Class)
```bash
# Purge only students belonging to Session ID 2
php artisan students:purge --institution=1 --session_id=2 --force

# Purge only students belonging to Stream ID 3
php artisan students:purge --institution=1 --stream_id=3 --force
```

#### What gets cleaned up:
- `student_profiles` and corresponding student `users` (frees up emails and mobile numbers for clean re-import)
- `fee_payments`, `student_fee_period_balances`, and `student_ad_hoc_charges`
- `lms_class_enrollments`, `attendance_records`, `exam_marks`, `exam_remarks`
- `guardian_students` and orphaned guardian accounts
- `admission_applications` and associated verification data
- `id_cards`, `student_addresses`, and `student_documents`

---

### 3. Roles & Permissions Production Seeding
If permissions or workflows are updated:
```bash
php artisan db:seed --class=WorkflowSeeder --force
php artisan db:seed --class=RoleMappingSeeder --force
php artisan cache:clear
php artisan config:clear
```

---

### 4. Fee Regulation Profiles Seeding
To populate standard class-wise Fee Profiles (Nursery through Class XII with Admission, Tuition, and Exam fees):
```bash
php artisan db:seed --class=FeeRegulationProfileSeeder --force
```

---

## 📄 License
Proprietary / Closed Source

