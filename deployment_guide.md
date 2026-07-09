# Deployment Guide: SaaS School Management on Shared Hosting

This guide explains how to deploy your Laravel School SaaS application on a standard shared hosting environment (like Hostinger, cPanel, GoDaddy) so that you can infinitely add new schools to the same system.

## 1. Local Preparation (Crucial Step)
Shared hosting rarely handles Node.js/Vite compilation well. You must compile your frontend assets locally before uploading.

1. Open your local terminal.
2. Run `npm run build`. This will compile all your React/Tailwind code into the `public/build` folder.
3. Create a `.zip` file of your entire project folder. 
   - **Do NOT include:** `node_modules` (very heavy, not needed on server)
   - **Do include:** `vendor` folder (so you don't have to run `composer install` on the server, though running it via cPanel terminal is also fine).

## 2. Server Setup (cPanel)

### A. Uploading Files
1. Open your hosting **File Manager**.
2. Upload the `.zip` file into your home directory (e.g., outside `public_html`, like `/home/username/school_saas/`).
3. Extract the ZIP file there.

### B. Configuring the Document Root
Laravel's entry point is the `public` folder. You must point your domain to this folder.
1. If using a **Primary Domain**, delete the `public_html` folder and create a symbolic link (symlink) from `public_html` to `/home/username/school_saas/public`.
2. If using an **Addon Domain or Subdomain**, simply set its Document Root to `/home/username/school_saas/public`.

## 3. Database Configuration
1. In cPanel, go to **MySQL Databases**.
2. Create a new Database and a new Database User. Add the User to the Database with ALL PRIVILEGES.
3. Go to your `school_saas` folder, rename `.env.example` to `.env` (or edit the existing `.env`).
4. Update the DB credentials:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yoursaasdomain.com
   FORCE_HTTPS=true

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_cpanel_dbname
   DB_USERNAME=your_cpanel_dbuser
   DB_PASSWORD=your_cpanel_dbpass
   ```

## 4. Running Migrations (Setting up SaaS Tables)
Your application uses a "Single Database Multi-Tenancy" architecture. This means all schools live in one database, separated by an `institution_id` column.

1. Open the **Terminal** in cPanel (or connect via SSH).
2. Navigate to your project: `cd school_saas`
3. Run the migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
4. Clear caches:
   ```bash
   php artisan optimize:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## 5. Setting up Wildcard Subdomains (For Multiple Schools)
To allow URLs like `school1.yoursaasdomain.com` and `school2.yoursaasdomain.com` automatically:

1. In cPanel, go to **Subdomains**.
2. Create a subdomain named `*` (asterisk).
3. Point its Document Root to the exactly same folder as your main app (`/home/username/school_saas/public`).
4. In your domain's **DNS Zone Editor**, ensure there is an `A` record for `*` pointing to your server's IP address.

*Now, any subdomain visited will hit your Laravel app. Laravel will look at the URL, find the matching School/Institution in the database, and show their specific data!*

## 6. Automating Background Tasks (Cron Job)
SaaS apps need to run background tasks (like calculating late fees, sending emails, processing queues).

1. In cPanel, go to **Cron Jobs**.
2. Add a new Cron Job to run **Once Per Minute** (`* * * * *`).
3. Set the command to:
   ```bash
   cd /home/username/school_saas && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
   ```
   *(Note: The PHP path `/usr/local/bin/php` might vary depending on your host. You can check with your hosting provider).*

## 7. How to Add a New School (SaaS Management)
You do not need to repeat this process for new schools! 

1. Log in to your Super Admin Dashboard at `https://yoursaasdomain.com`.
2. Navigate to the **Organisations / Institutions** management page.
3. Click **Create New Institution**.
4. Fill in the details (Name, Subdomain/Slug).
5. The system will automatically generate the environment for them. When they visit their specific subdomain, they will only see their data!

## 8. Custom Domain Mapping (e.g., `school1.com`)
If a school wants to use their own completely separate domain instead of a subdomain (e.g., `www.their-school.com` instead of `school.yoursaasdomain.com`), your codebase natively supports it via the `institution_domains` table.

**Step 1: Application Level (Super Admin)**
- In your application, assign the full custom domain (`their-school.com`) to the school's Institution record (this is handled by the `InstitutionDomain` model).

**Step 2: Server Level (cPanel)**
1. Go to **Addon Domains** or **Aliases (Parked Domains)** in cPanel.
2. Add the custom domain (`their-school.com`).
3. Set the Document Root for this Addon Domain to the EXACT same folder as your main SaaS app (e.g., `/home/username/school_saas/public`).

**Step 3: DNS Level (Client)**
- The school must go to their domain provider (GoDaddy, Namecheap) and point their `A Record` to your Shared Hosting Server's IP address.

*Once DNS propagates, when someone visits `their-school.com`, it hits your server, Laravel reads the URL, matches it in the `institution_domains` table, and shows their specific school!*
