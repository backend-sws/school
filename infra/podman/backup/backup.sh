#!/bin/bash
# =============================================================================
# Per-College Database Backup
# Each college: own backup role (no superuser), own R2 bucket. Credentials in colleges/<id>/.env
# Schedule: 0 */6 * * * — cron: /opt/ems/backup/backup.sh
# =============================================================================
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)

echo "[$(date -u)] === Starting per-college backups ==="

backup_college() {
  local college=$1
  local env_file="/opt/ems/colleges/${college}/.env"
  local db_name="${college}_db"
  local container="postgres-${college}"
  local backup_user="${college}_backup"
  local filename="${db_name}_${TIMESTAMP}.sql.gz"

  [ -f "${env_file}" ] || return 1
  set -a
  source "${env_file}"
  [ -f "${env_file%/*}/.env.secret" ] && source "${env_file%/*}/.env.secret"
  [ -f "${env_file%/*}/.env.backup" ] && source "${env_file%/*}/.env.backup"
  set +a
  local backup_password="${BACKUP_PASSWORD}"
  local r2_access="${R2_BACKUP_ACCESS_KEY}"
  local r2_secret="${R2_BACKUP_SECRET_KEY}"
  local r2_bucket="${R2_BACKUP_BUCKET}"
  local r2_endpoint="${R2_BACKUP_ENDPOINT}"

  if [ -z "${backup_password}" ] || [ -z "${r2_bucket}" ]; then
    echo "[WARN] ${college}: missing BACKUP_PASSWORD or R2_BACKUP_* in .env, skipping"
    return 1
  fi

  if ! podman exec "${container}" pg_isready -U "${backup_user}" -d "${db_name}" > /dev/null 2>&1; then
    echo "[ERROR] ${container} not ready or backup user not allowed, skipping ${college}"
    return 1
  fi

  echo "[$(date -u)] Backing up ${college} -> ${filename} (user ${backup_user})"

  podman exec -e PGPASSWORD="${backup_password}" "${container}" \
    pg_dump -U "${backup_user}" -d "${db_name}" --no-owner --no-acl \
    | gzip > "/tmp/${filename}"

  echo "[$(date -u)] Uploading ${college} to R2 (per-college bucket)..."
  AWS_ACCESS_KEY_ID="${r2_access}" AWS_SECRET_ACCESS_KEY="${r2_secret}" \
  aws s3 cp "/tmp/${filename}" \
    "s3://${r2_bucket}/postgres/daily/${filename}" \
    --endpoint-url "${r2_endpoint}" --only-show-errors

  if [ "${DAY_OF_WEEK}" = "7" ]; then
    echo "[$(date -u)] Sunday - weekly backup for ${college}..."
    AWS_ACCESS_KEY_ID="${r2_access}" AWS_SECRET_ACCESS_KEY="${r2_secret}" \
    aws s3 cp "/tmp/${filename}" \
      "s3://${r2_bucket}/postgres/weekly/${filename}" \
      --endpoint-url "${r2_endpoint}" --only-show-errors
  fi

  rm -f "/tmp/${filename}"
  echo "[$(date -u)] ${college} backup complete."
}

for dir in /opt/ems/colleges/*/; do
  [ -d "$dir" ] || continue
  college=$(basename "$dir")
  [ -f "${dir}.env" ] || continue
  backup_college "$college" || echo "[WARN] Backup failed for ${college}"
done

echo "[$(date -u)] === All backups complete ==="
