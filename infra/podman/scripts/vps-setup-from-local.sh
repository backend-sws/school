#!/bin/bash
# =============================================================================
# EMS Setup: creates /opt/ems, copies configs, starts shared monitoring.
#
# Usage:
#   ./infra/podman/scripts/vps-setup-from-local.sh deploy@<VPS_IP> [ssh_port]
# =============================================================================
set -e

checkpoint() {
  echo ""
  read -p "  >> Continue? [y/q]: " _c
  if [[ "$_c" == "q" || "$_c" == "Q" || "$_c" == "n" || "$_c" == "N" ]]; then
    echo "Aborted by user."
    exit 0
  fi
}

VPS_TARGET="${1:-}"
SSH_PORT="${2:-22}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
EMS_ROOT="${EMS_ROOT:-/opt/ems}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PODMAN_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ── Collect / edit inputs ────────────────────────────────────────────────────

collect_inputs() {
  echo ""
  read -p "  user@host [${VPS_TARGET}]: " _v
  [ -n "$_v" ] && VPS_TARGET="$_v" || true
  if [ -z "${VPS_TARGET}" ]; then echo "  Error: user@host is required."; return 1; fi

  read -p "  SSH port [${SSH_PORT}]: " _v
  [ -n "$_v" ] && SSH_PORT="$_v" || true
}

if [ -z "${VPS_TARGET}" ]; then
  collect_inputs || { collect_inputs || exit 1; }
fi

while true; do
  echo ""
  echo "  ┌─────────────────────────────────────┐"
  echo "  │          EMS Setup Config            │"
  echo "  ├─────────────────────────────────────┤"
  printf "  │  Target:  %-25s │\n" "${VPS_TARGET}"
  printf "  │  Port:    %-25s │\n" "${SSH_PORT}"
  echo "  │                                     │"
  echo "  │  Will create /opt/ems, copy configs, │"
  echo "  │  start monitoring services.          │"
  echo "  └─────────────────────────────────────┘"
  echo ""
  read -p "  [y] continue  [e] edit  [q] quit: " _choice
  case "$_choice" in
    y|Y) break ;;
    e|E) collect_inputs || true; continue ;;
    q|Q|n|N) echo "Aborted."; exit 0 ;;
    *) continue ;;
  esac
done

SSH_OPTS=(-o ConnectTimeout=20 -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -o ServerAliveCountMax=6)
SCP_OPTS=(-o ConnectTimeout=20 -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -o ServerAliveCountMax=6)

MAX_SSH_ATTEMPTS=3
SSH_RETRY_DELAY=5

ssh_retry() {
  local attempt=1
  while true; do
    if ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" "$@"; then
      return 0
    fi
    if [ "$attempt" -ge "$MAX_SSH_ATTEMPTS" ]; then
      echo "  SSH failed after ${MAX_SSH_ATTEMPTS} attempts."
      return 1
    fi
    echo "  Connection failed (attempt ${attempt}/${MAX_SSH_ATTEMPTS}). Retrying in ${SSH_RETRY_DELAY}s..."
    sleep "$SSH_RETRY_DELAY"
    attempt=$((attempt + 1))
  done
}

scp_retry() {
  local attempt=1
  while true; do
    if scp "${SCP_OPTS[@]}" -P "${SSH_PORT}" "$@"; then
      return 0
    fi
    if [ "$attempt" -ge "$MAX_SSH_ATTEMPTS" ]; then
      echo "  SCP failed after ${MAX_SSH_ATTEMPTS} attempts."
      return 1
    fi
    echo "  Connection failed (attempt ${attempt}/${MAX_SSH_ATTEMPTS}). Retrying in ${SSH_RETRY_DELAY}s..."
    sleep "$SSH_RETRY_DELAY"
    attempt=$((attempt + 1))
  done
}

# ── Step 1: Create directory structure ───────────────────────────────────────

echo ""
echo "[1/6] Creating ${EMS_ROOT} and directory structure on VPS..."
ssh_retry "sudo bash -s" << REMOTE_SETUP
set -e
mkdir -p ${EMS_ROOT}/{config/postgres,config/pgbouncer,monitoring/prometheus,monitoring/grafana/dashboards,monitoring/alertmanager,backup,data/prometheus,data/grafana,data/alertmanager,data/shared/postgres,data/shared/redis,scripts,colleges}
chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${EMS_ROOT}
chmod 777 ${EMS_ROOT}/data/grafana ${EMS_ROOT}/data/prometheus ${EMS_ROOT}/data/alertmanager ${EMS_ROOT}/data/shared/postgres
touch /var/log/ems-backup.log /var/log/ems-backup-cleanup.log /var/log/ems-health.log
chown ${DEPLOY_USER}:${DEPLOY_USER} /var/log/ems-backup.log /var/log/ems-backup-cleanup.log /var/log/ems-health.log
echo "  Dir structure and ownership done."
REMOTE_SETUP

checkpoint

# ── Step 2: Copy shared configs ──────────────────────────────────────────────

echo ""
echo "[2/6] Copying shared compose, configs, monitoring, backup..."

# Root compose (shared monitoring services)
scp_retry \
  "${PODMAN_DIR}/podman-compose.yml" \
  "${PODMAN_DIR}/crontab" \
  "${VPS_TARGET}:${EMS_ROOT}/"

# Postgres & PgBouncer configs
scp_retry -r \
  "${PODMAN_DIR}/config/postgres" \
  "${PODMAN_DIR}/config/pgbouncer" \
  "${VPS_TARGET}:${EMS_ROOT}/config/"

# Monitoring
scp_retry -r "${PODMAN_DIR}/monitoring/"* "${VPS_TARGET}:${EMS_ROOT}/monitoring/"

# Backup scripts
scp_retry -r "${PODMAN_DIR}/backup/"* "${VPS_TARGET}:${EMS_ROOT}/backup/"

# Health check
scp_retry \
  "${PODMAN_DIR}/scripts/health-check.sh" \
  "${VPS_TARGET}:${EMS_ROOT}/scripts/"

checkpoint

# ── Step 3: Set permissions & install crontab ────────────────────────────────

echo ""
echo "[3/6] Setting execute bits and installing crontab..."
ssh_retry "chmod +x ${EMS_ROOT}/scripts/*.sh ${EMS_ROOT}/backup/*.sh 2>/dev/null; crontab ${EMS_ROOT}/crontab"

checkpoint

# ── Step 4: Generate shared DB superuser password ────────────────────────────

echo ""
echo "[4/6] Generating shared DB superuser password on VPS..."
ssh_retry bash -s <<'DB_SECRET_GEN'
set -e
SECRET_FILE="/opt/ems/.db-secret"
if [ -f "${SECRET_FILE}" ]; then
  echo "  .db-secret already exists. Skipping generation."
else
  PG_PASS=$(openssl rand -hex 32)
  echo "POSTGRES_PASSWORD=${PG_PASS}" > "${SECRET_FILE}"
  chmod 600 "${SECRET_FILE}"
  echo "  ✔ .db-secret generated with auto-generated superuser password."
fi
DB_SECRET_GEN

checkpoint

# ── Step 5: Start shared DB infrastructure ───────────────────────────────────

echo ""
echo "[5/6] Starting shared database services (postgres-ems, pgbouncer-ems, redis-ems)..."
ssh_retry "cd ${EMS_ROOT} && \
  podman-compose up -d postgres-ems pgbouncer-ems redis-ems && \
  echo 'Shared DB and Redis are up.'"

echo "  Waiting for Postgres to be ready..."
ssh_retry "for i in \$(seq 1 24); do \
  podman exec postgres-ems pg_isready -U postgres 2>/dev/null && break; \
  echo \"  attempt \$i/24...\"; sleep 5; done"

checkpoint

# ── Step 6: Start shared monitoring ──────────────────────────────────────────

echo ""
echo "[6/6] Starting shared monitoring services..."
ssh_retry "cd ${EMS_ROOT} && \
  podman-compose up -d ems-cadvisor ems-prometheus ems-alertmanager ems-grafana ems-adminer && \
  echo 'Monitoring and Adminer are up.'"

# ── Done ─────────────────────────────────────────────────────────────────────

echo ""
echo "=== EMS Setup Complete ==="
echo ""
echo "  Shared services running: postgres-ems, pgbouncer-ems, redis-ems"
echo "  Monitoring running: cadvisor, prometheus, alertmanager, grafana, adminer"
echo ""
echo "  Next: Add an institute using ems.sh → option 3"
echo ""
