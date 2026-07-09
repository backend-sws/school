# VPS Folder Structure (`/opt/ems/`)

The VPS layout keeps **monitoring** and **backup** at the top (central), and all **colleges** under a single `colleges/` folder. Each college has its own folder with podman-related env and config.

## Top-level layout

```
/opt/ems/
├── .env                          # Shared secrets (R2, *_POSTGRES_PASSWORD, *_DB_PASSWORD, GF_SECURITY_ADMIN_PASSWORD)
├── podman-compose.yml            # Single compose: all colleges + monitoring stack
├── crontab                       # Deploy user crontab (backup, cleanup, health-check)
│
├── monitoring/                   # Central monitoring (Prometheus, Grafana, Alertmanager)
│   ├── prometheus/               # prometheus.yml, alerts.yml
│   ├── grafana/                  # datasources.yaml, dashboards.yaml, dashboards/
│   └── alertmanager/             # alertmanager.yml
│
├── backup/                       # Per-college backup logic (at top level)
│   ├── backup.sh                 # pg_dump per college → R2 daily/weekly
│   ├── backup-cleanup.sh         # Retention: 28 daily + 4 weekly per college
│   └── README.md
│
├── config/                       # Shared config (not per-college)
│   ├── postgres/                 # postgresql.conf, pg_hba.conf (used by all colleges)
│   └── pgbouncer/                # pgbouncer.ini (reference; per-college uses env)
│
├── colleges/                     # One folder per college
│   ├── ptjmrajgir/
│   │   ├── .env                  # College app env (DB_HOST=pgbouncer-ptjmrajgir, APP_PORT, etc.)
│   │   └── init.sql               # Postgres init: create DB user, grant permissions
│   └── <college_id>/
│       ├── .env
│       └── init.sql
│
├── data/                         # Runtime data (persistent volumes)
│   ├── <college_id>/postgres/    # Per-college Postgres data
│   ├── prometheus/
│   ├── grafana/
│   └── alertmanager/
│
└── scripts/                      # VPS: health-check only (cron). Add-college / deploy from local.
    └── health-check.sh
```

## Principles

- **Monitoring** is central: one Prometheus, Grafana, Alertmanager, cAdvisor for the whole VPS. Config lives under `monitoring/` so it’s clear and easy to update.
- **Backup** is central in `backup/` but **runs per college**: each college’s Postgres is backed up to R2 under `postgres/<college_id>/daily/` and `.../weekly/`, with smart retention (28 daily, 4 weekly) per college.
- **Colleges** are isolated under `colleges/<id>/`: each has its own `.env` and `init.sql`. The main `podman-compose.yml` defines services per college (postgres-<id>, pgbouncer-<id>, ems-app-<id>) and mounts these paths.

## Architecture (per-college isolation)

| Resource        | Per college | Shared |
|----------------|-------------|--------|
| **PostgreSQL** | Own instance, data dir, port (127.0.0.1:5441, …) | — |
| **PgBouncer**  | Own pool, port (6441, …) | — |
| **App**        | Own container, port (8081, …) | — |
| **Network**    | Bridge `ems-<id>` for postgres/pgbouncer/app | `ems-network` for monitoring |
| **Monitoring** | — | Prometheus, Grafana, Alertmanager, cAdvisor |

- **Nginx:** Default server for IP-based access; per-domain blocks when using `add-college.sh`. Timeouts: proxy 10s/60s/60s.
- **Reliability:** `restart: always`; health-check cron every 5 min (restarts unhealthy app with cooldown); per-college backups to R2 (see backup/README.md and VPS-SECURITY-RUNBOOK.md).
- **Adding a college:** From **local**, run `./infra/podman/scripts/add-college-from-local.sh deploy@VPS college_id /path/to/college.env [ssh_port] [/path/to/init.sql]` to create `colleges/<id>/` on the VPS and copy your `.env` (and optional `init.sql`) there. Then add the three service blocks + network to `podman-compose.yml` and start the stack (or trigger the deploy workflow).

## Repo vs VPS

- In the **repo**, the same layout is under `infra/podman/`: `monitoring/`, `backup/`, `config/`, `colleges/`, `scripts/`.
- One-time: `vps-setup-from-local.sh` copies `podman-compose.yml`, `config/`, `monitoring/`, `backup/`, college templates, and `scripts/health-check.sh` to the VPS. Deploy workflow only SCPs `podman-compose.yml` on each deploy.

## VPS cleanup (one-time after new structure deploy)

Run on the VPS as **deploy** (e.g. `ssh deploy@VPS_IP`). Do **cleaning first**, then the rest.

**1. Cleaning first – remove old paths**
   ```bash
   cd /opt/ems
   rm -rf config/prometheus config/grafana config/alertmanager
   rm -f scripts/backup.sh scripts/backup-cleanup.sh
   ```

**2. Create new dirs**
   ```bash
   mkdir -p monitoring/prometheus monitoring/grafana/dashboards monitoring/alertmanager backup
   ```

**3. (Only if new configs not synced yet)** Copy old config into `monitoring/` and `backup/` so containers keep working until next deploy. Skip if you already ran a deploy that synced these.
   ```bash
   [ -d config/prometheus ] && cp -r config/prometheus/* monitoring/prometheus/
   [ -d config/grafana   ] && cp -r config/grafana/* monitoring/grafana/
   [ -d config/alertmanager ] && cp -r config/alertmanager/* monitoring/alertmanager/
   [ -f scripts/backup.sh ] && cp scripts/backup.sh scripts/backup-cleanup.sh backup/ && chmod +x backup/*.sh
   ```
   *(If you did step 1 first, these dirs are already gone – run a deploy to sync `monitoring/` and `backup/` from the repo instead.)*

**4. Crontab and permissions**
   ```bash
   chmod +x backup/*.sh
   crontab /opt/ems/crontab
   ```

After the next deploy (tag push), `monitoring/` and `backup/` will be filled from the repo; the removed dirs and scripts stay gone.
