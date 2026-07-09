#!/bin/bash
# =============================================================================
# Database Restore — list backups from R2 and restore to a chosen point in time.
#
# Flow:
#   1. SSH into VPS, read college .env for R2 credentials
#   2. List all available backups (daily + weekly) from R2
#   3. You pick one from the list
#   4. Downloads backup, stops app, restores DB, restarts app
#
# Usage (from repo root):
#   ./infra/podman/scripts/db-restore-from-local.sh <college_id>
#   ./infra/podman/scripts/db-restore-from-local.sh ptjmrajgir
# =============================================================================
set -e

COLLEGE_ID=${1:?"Usage: db-restore-from-local.sh <college_id>"}

# Defaults (can be overridden by env vars from ems.sh)
VPS_HOST="${DEFAULT_HOST:-}"
rVPS_PORT="${DEFAULT_PORT:-22}"
VPS_USER="${DEFAULT_USER:-deploy}"

# ── Collect / edit inputs ────────────────────────────────────────────────────

collect_inputs() {
  echo ""
  read -p "  VPS Host [${VPS_HOST}]: " _v
  [ -n "$_v" ] && VPS_HOST="$_v" || true
  if [ -z "${VPS_HOST}" ]; then echo "  Error: VPS Host is required."; return 1; fi

  read -p "  SSH Port [${VPS_PORT}]: " _v
  [ -n "$_v" ] && VPS_PORT="$_v" || true

  read -p "  SSH User [${VPS_USER}]: " _v
  [ -n "$_v" ] && VPS_USER="$_v" || true
}

collect_inputs || { collect_inputs || exit 1; }

while true; do
  echo ""
  echo "  ┌─────────────────────────────────────┐"
  echo "  │        DB Restore Config             │"
  echo "  ├─────────────────────────────────────┤"
  printf "  │  College:  %-24s │\n" "${COLLEGE_ID}"
  printf "  │  Target:   %-24s │\n" "${VPS_USER}@${VPS_HOST}:${VPS_PORT}"
  echo "  └─────────────────────────────────────┘"
  echo ""
  read -p "  [y] continue  [e] edit  [q] quit: " _choice
  case "$_choice" in
    y|Y) break ;;
    e|E) collect_inputs; continue ;;
    q|Q|n|N) echo "Aborted."; exit 0 ;;
    *) continue ;;
  esac
done

SSH_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)
SSH_CMD="ssh ${SSH_OPTS[*]} -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST}"

echo ""

# ── Step 1: Fetch backup list from R2 ───────────────────────────────────────

echo "Fetching available backups from R2..."
echo ""

BACKUP_LIST=$(${SSH_CMD} bash -s << LISTEOF
set -e
ENV_FILE="/opt/ems/colleges/${COLLEGE_ID}/.env"

if [ ! -f "\${ENV_FILE}" ]; then
  echo "ERROR: \${ENV_FILE} not found" >&2
  exit 1
fi

set -a
source "\${ENV_FILE}"
set +a

if [ -z "\${R2_BACKUP_BUCKET}" ] || [ -z "\${R2_BACKUP_ENDPOINT}" ]; then
  echo "ERROR: R2_BACKUP_BUCKET or R2_BACKUP_ENDPOINT not set in .env" >&2
  exit 1
fi

export AWS_ACCESS_KEY_ID="\${R2_BACKUP_ACCESS_KEY}"
export AWS_SECRET_ACCESS_KEY="\${R2_BACKUP_SECRET_KEY}"

# List daily and weekly, tag each with its type
echo "=== DAILY ==="
aws s3 ls "s3://\${R2_BACKUP_BUCKET}/postgres/daily/" \
  --endpoint-url "\${R2_BACKUP_ENDPOINT}" 2>/dev/null | sort -k1,2 -r || true

echo "=== WEEKLY ==="
aws s3 ls "s3://\${R2_BACKUP_BUCKET}/postgres/weekly/" \
  --endpoint-url "\${R2_BACKUP_ENDPOINT}" 2>/dev/null | sort -k1,2 -r || true
LISTEOF
)

if [ -z "${BACKUP_LIST}" ]; then
  echo "No backups found for ${COLLEGE_ID}."
  exit 1
fi

# ── Step 2: Parse and display backups ────────────────────────────────────────

declare -a BACKUP_FILES=()
declare -a BACKUP_TYPES=()
declare -a BACKUP_DATES=()
declare -a BACKUP_SIZES=()

CURRENT_TYPE=""
while IFS= read -r line; do
  if [[ "$line" == "=== DAILY ===" ]]; then
    CURRENT_TYPE="daily"
    continue
  elif [[ "$line" == "=== WEEKLY ===" ]]; then
    CURRENT_TYPE="weekly"
    continue
  fi

  # Parse aws s3 ls output: "2026-02-12 06:00:01   12345 filename.sql.gz"
  filename=$(echo "$line" | awk '{print $4}')
  filedate=$(echo "$line" | awk '{print $1, $2}')
  filesize=$(echo "$line" | awk '{print $3}')

  if [ -n "$filename" ]; then
    BACKUP_FILES+=("${filename}")
    BACKUP_TYPES+=("${CURRENT_TYPE}")
    BACKUP_DATES+=("${filedate}")
    BACKUP_SIZES+=("${filesize}")
  fi
done <<< "${BACKUP_LIST}"

if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
  echo "No backups found for ${COLLEGE_ID}."
  exit 1
fi

# Display
echo "Available backups for ${COLLEGE_ID}:"
echo ""
printf "  %-4s %-8s %-22s %-12s %s\n" "#" "Type" "Date" "Size" "File"
printf "  %-4s %-8s %-22s %-12s %s\n" "---" "------" "--------------------" "----------" "----"

for i in "${!BACKUP_FILES[@]}"; do
  idx=$((i + 1))
  # Human-readable size
  size_bytes=${BACKUP_SIZES[$i]}
  if [ "${size_bytes}" -gt 1048576 ] 2>/dev/null; then
    size_hr="$(( size_bytes / 1048576 )) MB"
  elif [ "${size_bytes}" -gt 1024 ] 2>/dev/null; then
    size_hr="$(( size_bytes / 1024 )) KB"
  else
    size_hr="${size_bytes} B"
  fi
  printf "  %-4s %-8s %-22s %-12s %s\n" "${idx})" "${BACKUP_TYPES[$i]}" "${BACKUP_DATES[$i]}" "${size_hr}" "${BACKUP_FILES[$i]}"
done

echo ""

# ── Step 3: User selects a backup ───────────────────────────────────────────

read -p "Enter backup number to restore (or 'q' to quit): " SELECTION

if [[ "${SELECTION}" == "q" || "${SELECTION}" == "Q" ]]; then
  echo "Aborted."
  exit 0
fi

if ! [[ "${SELECTION}" =~ ^[0-9]+$ ]] || [ "${SELECTION}" -lt 1 ] || [ "${SELECTION}" -gt ${#BACKUP_FILES[@]} ]; then
  echo "Invalid selection."
  exit 1
fi

IDX=$((SELECTION - 1))
SELECTED_FILE="${BACKUP_FILES[$IDX]}"
SELECTED_TYPE="${BACKUP_TYPES[$IDX]}"
SELECTED_DATE="${BACKUP_DATES[$IDX]}"

echo ""
echo "Selected: ${SELECTED_FILE} (${SELECTED_TYPE}, ${SELECTED_DATE})"
echo ""
echo "WARNING: This will REPLACE the current ${COLLEGE_ID} database with this backup."
echo "         All data after ${SELECTED_DATE} will be LOST."
echo ""
read -p "Type 'RESTORE' to confirm: " CONFIRM
if [ "${CONFIRM}" != "RESTORE" ]; then
  echo "Aborted."
  exit 0
fi

# ── Step 4: Download, stop app, restore, restart ─────────────────────────────

echo ""
echo "Restoring ${COLLEGE_ID} from ${SELECTED_FILE}..."
echo ""

${SSH_CMD} bash -s << RESTOREEOF
set -e
cd /opt/ems

COLLEGE_ID="${COLLEGE_ID}"
SELECTED_FILE="${SELECTED_FILE}"
SELECTED_TYPE="${SELECTED_TYPE}"
DB_NAME="${COLLEGE_ID}_db"
CONTAINER="postgres-\${COLLEGE_ID}"
APP_CONTAINER="ems-app-\${COLLEGE_ID}"
ENV_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env"
TMP_FILE="/tmp/restore_\${SELECTED_FILE}"

set -a
source "\${ENV_FILE}"
set +a

export AWS_ACCESS_KEY_ID="\${R2_BACKUP_ACCESS_KEY}"
export AWS_SECRET_ACCESS_KEY="\${R2_BACKUP_SECRET_KEY}"

# --- Download backup from R2 ---
echo "[1/5] Downloading backup from R2..."
aws s3 cp \
  "s3://\${R2_BACKUP_BUCKET}/postgres/\${SELECTED_TYPE}/\${SELECTED_FILE}" \
  "\${TMP_FILE}" \
  --endpoint-url "\${R2_BACKUP_ENDPOINT}" --only-show-errors

if [ ! -f "\${TMP_FILE}" ]; then
  echo "ERROR: Download failed."
  exit 1
fi
echo "  Downloaded: \${TMP_FILE} (\$(du -h "\${TMP_FILE}" | cut -f1))"

# --- Stop app container ---
echo "[2/5] Stopping app container..."
podman stop -t 10 "\${APP_CONTAINER}" 2>/dev/null || true
echo "  App stopped"

# --- Drop and recreate database ---
echo "[3/5] Dropping and recreating database..."

# Terminate existing connections
podman exec "\${CONTAINER}" psql -U postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '\${DB_NAME}' AND pid <> pg_backend_pid();" \
  2>/dev/null || true

# Drop and recreate
podman exec "\${CONTAINER}" psql -U postgres -c "DROP DATABASE IF EXISTS \${DB_NAME};"
podman exec "\${CONTAINER}" psql -U postgres -c "CREATE DATABASE \${DB_NAME} OWNER \${DB_USERNAME};"
echo "  Database recreated"

# --- Restore from backup ---
echo "[4/5] Restoring database from backup..."
gunzip -c "\${TMP_FILE}" | podman exec -i "\${CONTAINER}" psql -U postgres -d "\${DB_NAME}" --quiet 2>&1 | tail -5

# Grant privileges back
podman exec "\${CONTAINER}" psql -U postgres -d "\${DB_NAME}" -c \
  "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \${DB_USERNAME};"
podman exec "\${CONTAINER}" psql -U postgres -d "\${DB_NAME}" -c \
  "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \${DB_USERNAME};"
podman exec "\${CONTAINER}" psql -U postgres -d "\${DB_NAME}" -c \
  "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO \${DB_USERNAME};"
podman exec "\${CONTAINER}" psql -U postgres -d "\${DB_NAME}" -c \
  "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO \${DB_USERNAME};"

# Grant backup user read access
BACKUP_USER="\${COLLEGE_ID}_backup"
podman exec "\${CONTAINER}" psql -U postgres -d "\${DB_NAME}" -c \
  "GRANT CONNECT ON DATABASE \${DB_NAME} TO \${BACKUP_USER};" 2>/dev/null || true
podman exec "\${CONTAINER}" psql -U postgres -d "\${DB_NAME}" -c \
  "GRANT SELECT ON ALL TABLES IN SCHEMA public TO \${BACKUP_USER};" 2>/dev/null || true

echo "  Database restored and permissions set"

# --- Restart app ---
echo "[5/5] Restarting app..."
COLLEGE_ID_UPPER=\$(echo "\${COLLEGE_ID}" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
export "\${COLLEGE_ID_UPPER}_POSTGRES_PASSWORD=\$(grep '^POSTGRES_PASSWORD=' "\${ENV_FILE}" 2>/dev/null | cut -d= -f2-)"
export "\${COLLEGE_ID_UPPER}_DB_PASSWORD=\$(grep '^DB_PASSWORD=' "\${ENV_FILE}" 2>/dev/null | cut -d= -f2-)"
export "\${COLLEGE_ID_UPPER}_IMAGE_TAG=\$(grep '^CMS_IMAGE_TAG=' "\${ENV_FILE}" 2>/dev/null | cut -d= -f2-)"

podman-compose up -d "\${APP_CONTAINER}"

# Wait for app
APP_PORT=\$(grep "^APP_PORT=" "\${ENV_FILE}" | cut -d= -f2)
echo "  Waiting for app (port \${APP_PORT})..."
sleep 15
for i in \$(seq 1 10); do
  if curl -sf "http://127.0.0.1:\${APP_PORT}/" > /dev/null 2>&1; then
    echo "  App is ready."
    break
  fi
  echo "  attempt \$i/10..."
  sleep 10
done

# Cleanup
rm -f "\${TMP_FILE}"

echo ""
echo "=== Restore complete: ${COLLEGE_ID} from ${SELECTED_FILE} ==="
RESTOREEOF

echo ""
echo "=== Done ==="
