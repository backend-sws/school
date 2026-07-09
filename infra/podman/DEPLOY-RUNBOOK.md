# Deploy Runbook

**Port plan (essentials only):**

| Purpose        | Port  | Firewall      | How to access                    |
|----------------|-------|---------------|----------------------------------|
| SSH            | 22 (or custom) | Open (rate-limited) | `ssh -p PORT deploy@VPS_IP`       |
| HTTP / HTTPS   | 80, 443 | Open          | Nginx → app; certbot for SSL     |
| Adminer        | 8080  | **Never open** | ems.sh → 7) Adminer Tunnel       |
| Grafana        | 3000  | **Never open** | ems.sh → 8) Grafana Tunnel      |

**Access:** App via **http://VPS_IP/** or domain (Nginx 80/443). Adminer and Grafana only via SSH tunnel from ems.sh.

---

## 0. Bootstrap a fresh VPS (one-time)

Run from your local machine with root access to a fresh VPS:

```bash
./infra/podman/scripts/vps-init-from-local.sh
```

You'll be prompted for VPS IP, root port, deploy username, new SSH port, and SSH key path. The script:
- Creates a `deploy` user with SSH key auth
- Installs podman, nginx, fail2ban, ufw
- Hardens SSH (custom port, key-only, no root login)
- Configures UFW firewall

After this, all future access is: `ssh -p <SSH_PORT> deploy@<VPS_IP>`

---

## 1. Setup CMS on VPS (one-time)

```bash
./infra/podman/scripts/vps-setup-from-local.sh deploy@<VPS_IP> <SSH_PORT>
```

Creates `/opt/ems`, copies configs, starts monitoring (Grafana, Prometheus, etc.).

---

## 2. Add a college (one-time per college)

```bash
./infra/podman/scripts/add-college-from-local.sh deploy@<VPS_IP> <college_id> <env_file> <SSH_PORT>
```

Creates college dir, starts postgres/pgbouncer, sets up nginx.

---

## 2b. Configure GHCR on VPS (add or update credentials)

Required so the VPS can pull images from GitHub Container Registry. **From ems.sh:** option **9) Configure GHCR**. Or run:

```bash
./infra/podman/scripts/configure-ghcr-from-local.sh
```

You'll be prompted for VPS connection and **GHCR username** + **token (PAT with read:packages)**. Credentials are stored on the VPS in `/opt/ems/.ghcr`. Run again if the token expires or deploy reports "unauthorized".

---

## 3. Deploy app

### Option A: From local machine (recommended)

```bash
./infra/podman/scripts/local-deploy.sh ptjmrajgir
```

You'll be prompted for VPS host, SSH port, user, and image tag (defaults from ems.sh if run from menu). **GHCR is not prompted** — use step 2b once if you get "GHCR not configured".

### Option B: Push a git tag (CI/CD)

```bash
git tag v-ptjmrajgir-1.1.7
git push origin v-ptjmrajgir-1.1.7
```

### Option C: GitHub workflow dispatch

1. GitHub → **Actions** → **Deploy Router** → **Run workflow**.
2. Set **Tag to deploy** (e.g. `v-ptjmrajgir-1.1.7`), target **vps**.
3. Run workflow.

---

## 4. Restore database from backup

```bash
./infra/podman/scripts/db-restore-from-local.sh ptjmrajgir
```

Lists all daily + weekly backups from R2, you pick one, and it restores the database to that point.

---

## 5. Adminer tunnel (inspect DB locally)

```bash
./infra/podman/scripts/adminer-tunnel-from-local.sh ptjmrajgir
```

Starts an SSH tunnel to Adminer on the VPS, opens your browser with **server, username, and database** pre-filled for that college. You only paste the password (printed in the terminal) and click Login to browse tables. Press Enter in the terminal when done to close the tunnel.

---

## 6. Grafana tunnel (monitoring locally)

```bash
./infra/podman/scripts/adminer-tunnel-from-local.sh --grafana
```

Starts an SSH tunnel to Grafana on the VPS (port 3000), opens your browser to the Grafana login page. Use the `GF_SECURITY_ADMIN_PASSWORD` from your monitoring `.env` to log in.

---

## Scripts overview

| Script | Where to run | Purpose |
|--------|-------------|---------|
| `vps-init-from-local.sh` | Local machine | One-time: bootstrap fresh VPS (user, SSH, firewall, packages) |
| `vps-setup-from-local.sh` | Local machine | One-time: setup /opt/ems, configs, monitoring |
| `add-college-from-local.sh` | Local machine | One-time per college: postgres, pgbouncer, nginx |
| `configure-ghcr-from-local.sh` | Local machine | One-time per VPS: store GHCR credentials for image pull |
| `local-deploy.sh <college_id>` | Local machine | Deploy: pull image, restart app, migrate |
| `db-restore-from-local.sh <college_id>` | Local machine | Restore: list R2 backups, pick one, restore DB |
| `adminer-tunnel-from-local.sh <college_id>` | Local machine | Tunnel Adminer to localhost, open with college DB pre-filled |
| `adminer-tunnel-from-local.sh --grafana` | Local machine | Tunnel Grafana to localhost, open monitoring dashboard |
| `vps-reset-from-local.sh` | Local machine | Nuclear: factory reset VPS to clean state |
| `health-check.sh` | On VPS (cron) | Periodic health check + auto-restart |
