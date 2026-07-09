# VPS Security & Production Runbook

Use this checklist to keep the CMS VPS **secure**, **backed up**, and **production-ready**. Apply after initial setup and re-check periodically.

**Folder layout:** See [VPS-STRUCTURE.md](./VPS-STRUCTURE.md) for `/opt/ems/` layout (monitoring + backup at top, colleges under `colleges/`).

---

## 1. Firewall (UFW)

- **Default**: deny incoming, allow outgoing.
- **Allow only**:
  - `22/tcp` — SSH
  - `80/tcp` — HTTP (Nginx)
  - `443/tcp` — HTTPS (when SSL is used)
- **Do not** expose app or Adminer ports (8080, 8081) to the internet. All traffic must go through Nginx on 80/443.

```bash
sudo ufw status verbose
# Should show: 22, 80, 443 — no 8080, 8081
sudo ufw delete allow 8080/tcp   # if present
sudo ufw delete allow 8081/tcp   # if present
sudo ufw reload
```

---

## 2. SSH hardening

- Prefer key-based auth; disable password login when keys are in place.
- Disable root login if you use a dedicated `deploy` user.

```bash
# Edit as root: sudo nano /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
AllowUsers deploy
```

Then: `sudo systemctl reload sshd`. **Test login as `deploy` in another session before closing your current one.**

---

## 3. Fail2ban

- Protects SSH from brute force.

```bash
sudo systemctl status fail2ban
sudo fail2ban-client status sshd
```

- Default jail: `sshd`. Ensure it’s enabled and active.

---

## 4. Backups (Cloudflare R2)

- **Scripts**: `/opt/ems/backup/backup.sh` (per-college DB), `/opt/ems/backup/backup-cleanup.sh` (retention). Backup logic lives at top level under `backup/`; runs per college with smart retention (28 daily + 4 weekly per college).
- **Schedule**: Backup every 6 hours; cleanup weekly (Sunday 4 AM UTC).
- **Env**: `/opt/ems/.env` must define:
  - `R2_BACKUP_ACCESS_KEY`
  - `R2_BACKUP_SECRET_KEY`
  - `R2_BACKUP_BUCKET`
  - `R2_BACKUP_ENDPOINT`

**Crontab (deploy user):**

```bash
crontab -l
# Expected:
# 0 */6 * * * /opt/ems/backup/backup.sh >> /var/log/ems-backup.log 2>&1
# 0 4 * * 0 /opt/ems/backup/backup-cleanup.sh >> /var/log/ems-backup-cleanup.log 2>&1
# */5 * * * * /opt/ems/scripts/health-check.sh >> /var/log/ems-health.log 2>&1
```

**Log files:** Ensure deploy can write to them (run once as root):

```bash
sudo touch /var/log/ems-backup.log /var/log/ems-backup-cleanup.log /var/log/ems-health.log
sudo chown deploy:deploy /var/log/ems-backup.log /var/log/ems-backup-cleanup.log /var/log/ems-health.log
```

**Verify:** Check R2 bucket (Cloudflare Dashboard → R2) for objects under `postgres/<college_id>/daily/` and `weekly/`.

---

## 5. Cloudflare (optional but recommended)

- **DNS**: Point your domain (A/AAAA) to the VPS IP; set proxy status to **Proxied** (orange cloud) so traffic goes through Cloudflare.
- **SSL**: In Cloudflare, set SSL/TLS mode (e.g. Full or Full (strict)) and optionally enable “Always Use HTTPS”.
- **WAF**: Enable Cloudflare WAF and consider rate limiting for login/admin paths.
- **Origin**: Only 80/443 need to be open on the VPS; Cloudflare connects to your origin on those ports.

**Real IP (if using Cloudflare proxy):** So Nginx and the app see the real client IP:

1. Create `/etc/nginx/conf.d/cloudflare-real-ip.conf` (or include in your server block):
   ```nginx
   # Cloudflare IPv4 & IPv6 (update from https://www.cloudflare.com/ips/)
   set_real_ip_from 173.245.48.0/20;
   set_real_ip_from 103.21.244.0/22;
   set_real_ip_from 103.22.200.0/22;
   set_real_ip_from 103.31.4.0/22;
   set_real_ip_from 141.101.64.0/18;
   set_real_ip_from 108.162.192.0/18;
   set_real_ip_from 190.93.240.0/20;
   set_real_ip_from 188.114.96.0/20;
   set_real_ip_from 197.234.240.0/22;
   set_real_ip_from 198.41.128.0/17;
   set_real_ip_from 162.158.0.0/15;
   set_real_ip_from 104.16.0.0/13;
   set_real_ip_from 104.24.0.0/14;
   set_real_ip_from 172.64.0.0/13;
   set_real_ip_from 131.0.72.0/22;
   set_real_ip_from 2400:cb00::/32;
   set_real_ip_from 2606:4700::/32;
   set_real_ip_from 2803:f800::/32;
   set_real_ip_from 2405:b500::/32;
   set_real_ip_from 2405:8100::/32;
   set_real_ip_from 2a06:98c0::/29;
   set_real_ip_from 2c0f:f248::/32;
   real_ip_header CF-Connecting-IP;
   ```
2. Reload Nginx: `sudo nginx -t && sudo systemctl reload nginx`.

Use the latest list from: https://www.cloudflare.com/ips/

---

## 6. Nginx

- **Config**: Single default server (e.g. `ems-default`) proxying to `127.0.0.1:8081`; no direct exposure of 8080/8081.
- **Security headers** (already applied if you used the runbook):
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (restrict geolocation/mic/camera if not needed)
- **SSL**: When using a domain, use Certbot and a server block for 443; redirect HTTP → HTTPS if desired.

---

## 7. Health check cron

- Ensures the app is up; can restart containers or alert on failure.

```bash
# Deploy user crontab
*/5 * * * * /opt/ems/scripts/health-check.sh >> /var/log/ems-health.log 2>&1
```

---

## 8. Quick audit commands

Run periodically:

```bash
# Firewall
sudo ufw status verbose

# SSH (as root or with sudo)
grep -E "^(PermitRootLogin|PasswordAuthentication|Port)" /etc/ssh/sshd_config

# Fail2ban
sudo fail2ban-client status

# Backups (cron + recent log)
crontab -l
tail -50 /var/log/ems-backup.log

# Containers
podman ps -a
```

---

## 9. Monitoring & alerting (local-only)

**App endpoints (used by Prometheus):**
- `GET /up` — Laravel health (built-in). Returns 200 when app is up.
- `GET /metrics` — Prometheus metrics (app up, DB connected, college_id). No auth; excluded from CSRF.

**Stack:** Prometheus (scrapes app + cAdvisor), Alertmanager (email to sutracodehq@gmail.com), Grafana (dashboards + Alertmanager UI), cAdvisor (container metrics). All listen on 127.0.0.1 only.

- **Prometheus**, **Grafana**, **Alertmanager**, **cAdvisor** are bound to `127.0.0.1` only. No firewall ports for 3000, 9090, 9093, 8888.
- **Access**: Use an SSH tunnel, e.g.  
  `ssh -L 3000:127.0.0.1:3000 -L 9090:127.0.0.1:9090 -L 9093:127.0.0.1:9093 deploy@VPS_IP`  
  Then open http://localhost:3000 (Grafana), http://localhost:9090 (Prometheus), http://localhost:9093 (Alertmanager). In Grafana, the **CMS** folder has the **EMS Containers & App** dashboard (container CPU/memory, app up, DB connected). Use **Explore** → datasource **Alertmanager** to view firing alerts and silences.

**Email alerts:** Configured to use Mailtrap SMTP (From: aleartcollege@sutracode.in; From name = college when present). Alerts go to **sutracodehq@gmail.com**. Mailtrap sandbox is for testing (no real delivery); for production, switch to Mailtrap sending or another SMTP and update `/opt/ems/monitoring/alertmanager/alertmanager.yml` on the VPS.

Ensure Alertmanager has a data dir and is running:
```bash
mkdir -p /opt/ems/data/alertmanager
cd /opt/ems && podman-compose up -d ems-alertmanager
```

---

## 10. No security breach checklist

- [ ] UFW: only 22, 80, 443 allowed; 8080/8081 not public.
- [ ] SSH: key-based auth; root login disabled (or restricted).
- [ ] Fail2ban: enabled and active for `sshd`.
- [ ] Backups: R2 env set in `/opt/ems/.env`; cron for backup + cleanup; verify R2 bucket.
- [ ] Nginx: security headers on; only proxy to 127.0.0.1:8081.
- [ ] Cloudflare: domain proxied; WAF/rate limit considered; real IP configured if proxying.
- [ ] No sensitive files under web root; `.env` and secrets not in version control or public paths.
- [ ] Monitoring (Grafana, Prometheus, Alertmanager) not exposed; access only via SSH tunnel. Alertmanager uses Mailtrap (or your SMTP) for email alerts.
