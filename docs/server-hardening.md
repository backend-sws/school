# 🔒 Server Hardening Guide

> **Target:** VPS Production (Ubuntu 22.04+, Podman)
> **Goal:** One-time setup that survives all redeployments — deployments only touch the app container.

---

## Architecture: What Persists vs What Gets Replaced

| Layer | Lives On | Survives Redeploy? |
|-------|----------|-------------------|
| App code + OPcache | Docker image (baked in) | ✅ Rebuilt each tag |
| `.env` configs | VPS host filesystem (mounted) | ✅ Never touched |
| PgBouncer config | VPS host (`pgbouncer.ini`, mounted) | ✅ Never touched |
| PostgreSQL data | VPS named volume | ✅ Never touched |
| Redis data | VPS named volume | ✅ Never touched |
| Swap / Firewall / Cron | VPS OS-level | ✅ Never touched |
| Nginx configs | VPS host filesystem | ✅ Never touched |
| SSL certificates | VPS host (`/etc/letsencrypt`) | ✅ Auto-renewed |

---

## 1. PgBouncer — Transaction Pooling with Prepared Statements

PgBouncer 1.21+ supports `max_prepared_statements`, which transparently handles prepared statements in transaction pooling mode. **No app-level `ATTR_EMULATE_PREPARES` is needed.**

**Config** (`/opt/ems/config/pgbouncer/pgbouncer.ini`):
```ini
pool_mode = transaction
max_prepared_statements = 100
server_reset_query = DISCARD ALL
```

> ⚠️ **Never** set `DB_PGBOUNCER=true` in `.env` — this is a legacy hack that breaks boolean queries.

---

## 2. Session Driver — Redis (not Database)

```env
SESSION_DRIVER=redis
```

**Why:** Database sessions fail after container restarts (stale session rows). Redis sessions are independent of the app container lifecycle. Redis persists on its own volume.

**Safety net:** `bootstrap/app.php` has a stale session exception handler that redirects to `/login` instead of throwing 500s.

---

## 3. Log Rotation

```env
LOG_CHANNEL=daily
LOG_LEVEL=error    # or 'warning' — never 'debug' in production
```

Laravel's `daily` channel auto-rotates logs with 14-day default retention. No cron needed.

---

## 4. Swap Space

```bash
# One-time setup (as root):
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
```

**Why:** 8GB RAM without swap = OOM killer crashes all containers. 2GB swap prevents catastrophic failures during peak loads (admission season, fee payment days).

---

## 5. API Rate Limiting

**Global throttle** (in `bootstrap/app.php` API middleware stack):
```php
\Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
```

This applies Laravel's default 60 requests/minute per user to all API routes.

**Per-route overrides** (in `routes/api.php`):
| Route | Limit |
|-------|-------|
| `POST /auth/login` | 5/min |
| `POST /auth/register` | 3/min |
| `POST /student-auth/send-otp` | 3/min |

---

## 6. OPcache Tuning

Configured in `Dockerfile.prod` (baked into production image):

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0      # Code is immutable in image
opcache.revalidate_freq=60         # Safety fallback
```

**Key:** `validate_timestamps=0` means PHP never checks if files changed — fastest mode since code is baked into the Docker image.

---

## 7. Firewall (UFW)

```bash
# Already configured:
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Only SSH, HTTP, and HTTPS are exposed. All container ports (8082, 6432, etc.) are internal-only.

---

## 8. Database Backups

**Crontab** (already configured on VPS):
```cron
# Every 6 hours
0 */6 * * * /opt/ems/backup/backup.sh >> /var/log/ems-backup.log 2>&1

# Weekly cleanup (Sunday 4AM)
0 4 * * 0 /opt/ems/backup/backup-cleanup.sh >> /var/log/ems-backup-cleanup.log 2>&1
```

**Manual backup:**
```bash
podman exec postgres-ems pg_dump -U postgres pdseducation_db | gzip > backup.sql.gz
```

---

## 9. SSL Auto-Renewal

```cron
0 */12 * * * certbot renew --quiet --deploy-hook "systemctl reload nginx"
```

---

## 10. Health Monitoring

```cron
# Every 5 minutes
*/5 * * * * /opt/ems/scripts/health-check.sh >> /var/log/ems-health.log 2>&1
```

---

## Current VPS Capacity

| Component | Config | Capacity |
|-----------|--------|----------|
| PgBouncer | `max_client_conn=2000`, `pool_size=50` | ~2,000 concurrent connections |
| RAM | 8GB + 2GB swap | ~500 concurrent users |
| OPcache | 256MB, 20K files | Instant PHP execution |
| Rate limit | 60 req/min/user | Prevents API abuse |

---

## Deployment Flow (What Happens During `ems.sh → Deploy`)

1. Sync `.env` from local to VPS (non-destructive, host filesystem)
2. Pull new Docker image from GHCR
3. Orphan cleanup (stop old container)
4. Start new container (reads `.env` from host mount)
5. Run `php artisan migrate --force`
6. Run `php artisan config:cache && route:cache && view:cache`
7. Verify health check

**What is NOT touched:** PostgreSQL, PgBouncer, Redis, Nginx, swap, firewall, cron, SSL.

---

> **Revision:** 1.0
> **Last Updated:** 2026-03-16
> **Maintainer:** Engineering Team
