# Migration Runbook: K8s (Linode) to Podman (Hostinger KVM)

## Pre-Migration Checklist

- [ ] Hostinger VPS provisioned (Ubuntu 22.04/24.04, IP: 147.79.68.82)
- [ ] SSH key added to VPS
- [ ] DNS TTL lowered to 60s (do this 24h before cutover)
- [ ] All infra/podman files committed and pushed to repo
- [ ] Production .env file prepared with real secrets

---

## Step 1: Initial VPS Setup (as root)

Provision the VPS (Ubuntu 22.04/24.04), create a `deploy` user with sudo, add your SSH key to `~deploy/.ssh/authorized_keys`, and ensure podman (and optionally nginx) are installed. Then use the one-time setup from your local machine (see Step 3).

## Step 2: Configure deploy User (as root)

```bash
# Copy SSH key to deploy user
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Verify SSH as deploy works (from local machine):
# ssh deploy@147.79.68.82

# Then harden SSH (edit /etc/ssh/sshd_config):
# PermitRootLogin no
# PasswordAuthentication no
# Port 2222
# AllowUsers deploy
# Then: systemctl reload sshd
```

## Step 3: Deploy Infrastructure (from local)

**From your local machine (repo root):** run the one-time VPS setup. This creates `/opt/ems`, copies podman-compose, config/, monitoring/, backup/, college templates, health-check.sh, and starts central monitoring (cAdvisor, Prometheus, Alertmanager, Grafana, Adminer).

```bash
./infra/podman/scripts/vps-setup-from-local.sh deploy@147.79.68.82
# or with custom SSH port:
# ./infra/podman/scripts/vps-setup-from-local.sh deploy@147.79.68.82 22
```

Then add each college with:

```bash
./infra/podman/scripts/add-college-from-local.sh deploy@147.79.68.82 ptjmrajgir infra/podman/colleges/ptjmrajgir/.env
# Optional: add domain as 6th argument for Nginx server_name; omit for server_name _.
```

## Step 4: Configure VPS (as deploy, on VPS)

```bash
ssh deploy@147.79.68.82

# Edit shared .env with real secrets (Grafana admin password, etc.)
nano /opt/ems/.env
# Set GF_SECURITY_ADMIN_PASSWORD and any other shared vars. Per-college secrets live in colleges/<id>/.env.
chmod 600 /opt/ems/.env
```

(vps-setup-from-local.sh already set execute bits and installed crontab. Nginx configs are created per college by add-college-from-local.sh.)

## Step 5: Start Services (First Time)

After vps-setup-from-local.sh, central monitoring (cAdvisor, Prometheus, Alertmanager, Grafana, Adminer) is already up. After add-college-from-local.sh for a college, that college's postgres and pgbouncer are up. Start the app by pushing a tag (deploy workflow) or on the VPS:

```bash
cd /opt/ems
# Export compose vars from the college .env, then:
podman-compose up -d ems-app-ptjmrajgir
# Or run from local: local-deploy.sh from your machine, or use the deploy workflow.
podman ps
```

## Step 6: SSL Certificate (optional)

If using a domain, install nginx and certbot on the VPS, then run add-college-from-local.sh with the domain as the 6th argument. To add HTTPS:

```bash
sudo certbot --nginx -d yourdomain.com --non-interactive --agree-tos -m admin@example.com
sudo certbot renew --dry-run
```

## Step 7: Data Migration from K8s

### 7.1 Export from Linode K8s (from local machine with kubectl access)

```bash
# Get the postgres pod name
kubectl get pods -n education-management -l app=ems-postgres

# Dump the database
kubectl exec -n education-management deploy/ems-postgres -- \
  pg_dump -U ems_user ems_db --no-owner --no-acl | gzip > ems_db_migration.sql.gz

# Verify dump size
ls -lh ems_db_migration.sql.gz
```

### 7.2 Import to Hostinger VPS

```bash
# Upload dump to VPS
scp ems_db_migration.sql.gz deploy@147.79.68.82:/tmp/

# SSH to VPS
ssh deploy@147.79.68.82

# Import into PostgreSQL (use your college's postgres container name, e.g. postgres-ptjmrajgir)
gunzip < /tmp/ems_db_migration.sql.gz | podman exec -i postgres-ptjmrajgir psql -U ptjmrajgir_user -d ptjmrajgir_db

# Verify data
podman exec postgres-ptjmrajgir psql -U ptjmrajgir_user -d ptjmrajgir_db -c "SELECT count(*) FROM users;"

# Run any pending migrations (use your college's app container name)
podman exec ems-app-ptjmrajgir php artisan migrate --force

# Rebuild caches
podman exec ems-app-ptjmrajgir php artisan config:cache
podman exec ems-app-ptjmrajgir php artisan route:cache
podman exec ems-app-ptjmrajgir php artisan view:cache

# Clean up
rm /tmp/ems_db_migration.sql.gz
```

## Step 8: DNS Cutover

```bash
# 1. Verify VPS is fully working
#    Add to /etc/hosts on your local machine:
#    147.79.68.82 ems.sutracode.in
#    Then test in browser.

# 2. Update DNS A record:
#    ems.sutracode.in -> 147.79.68.82

# 3. Monitor for 1 hour - check logs:
podman logs -f ems-app
tail -f /var/log/ems-health.log

# 4. Once stable, restore DNS TTL to 3600s

# 5. Decommission Linode K8s cluster (after 48h of stable operation)
```

## Step 9: Update CI/CD

```bash
# Add GitHub Secrets:
#   VPS_HOST = 147.79.68.82
#   VPS_SSH_KEY = (deploy user's private key)

# The updated ci-cd.yml workflow will deploy via SSH instead of kubectl.
# See: .github/workflows/ci-cd.yml (deploy-vps job)
```

## Post-Migration Verification

- [ ] App loads correctly via HTTPS
- [ ] SSL certificate is valid (check https://www.ssllabs.com/ssltest/)
- [ ] Login and core features work
- [ ] Database data is intact
- [ ] Backups are running (check R2 bucket after 6 hours)
- [ ] Health checks are passing (check /var/log/ems-health.log)
- [ ] Monitoring is accessible (/grafana, /prometheus)
- [ ] CI/CD pipeline deploys correctly
- [ ] Cron jobs are scheduled (crontab -l)
- [ ] Log rotation is working

## Rollback Plan

If something goes wrong after DNS cutover:
1. Point DNS back to Linode K8s IP
2. K8s cluster is still running during the transition period
3. Investigate and fix VPS issues
4. Retry cutover when ready
