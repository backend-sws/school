#!/bin/bash
# =============================================================================
# Per-College Backup Cleanup
# Each college has its own R2 bucket; credentials in colleges/<id>/.env
# Schedule: 0 4 * * 0 — cron: /opt/ems/backup/backup-cleanup.sh
# =============================================================================
set -e

echo "[$(date -u)] === Starting per-college backup cleanup ==="

for dir in /opt/ems/colleges/*/; do
  [ -d "$dir" ] || continue
  college=$(basename "$dir")
  env_file="${dir}.env"
  [ -f "${env_file}" ] || continue

  set -a
  source "${env_file}"
  set +a
  [ -n "${R2_BACKUP_BUCKET}" ] && [ -n "${R2_BACKUP_ENDPOINT}" ] || continue

  echo "[$(date -u)] Cleaning backups for ${college} (bucket ${R2_BACKUP_BUCKET})..."

  export AWS_ACCESS_KEY_ID="${R2_BACKUP_ACCESS_KEY}"
  export AWS_SECRET_ACCESS_KEY="${R2_BACKUP_SECRET_KEY}"

  # Daily: keep last 28 (per-college bucket: postgres/daily/)
  aws s3 ls "s3://${R2_BACKUP_BUCKET}/postgres/daily/" \
    --endpoint-url "${R2_BACKUP_ENDPOINT}" 2>/dev/null \
    | sort -k1,2 -r | tail -n +29 | while read -r line; do
      filename=$(echo "$line" | awk '{print $4}')
      [ -n "$filename" ] && aws s3 rm \
        "s3://${R2_BACKUP_BUCKET}/postgres/daily/${filename}" \
        --endpoint-url "${R2_BACKUP_ENDPOINT}" --only-show-errors
    done

  # Weekly: keep last 4
  aws s3 ls "s3://${R2_BACKUP_BUCKET}/postgres/weekly/" \
    --endpoint-url "${R2_BACKUP_ENDPOINT}" 2>/dev/null \
    | sort -k1,2 -r | tail -n +5 | while read -r line; do
      filename=$(echo "$line" | awk '{print $4}')
      [ -n "$filename" ] && aws s3 rm \
        "s3://${R2_BACKUP_BUCKET}/postgres/weekly/${filename}" \
        --endpoint-url "${R2_BACKUP_ENDPOINT}" --only-show-errors
    done

  echo "[$(date -u)] ${college} cleanup done."
done

echo "[$(date -u)] === All cleanup complete ==="
