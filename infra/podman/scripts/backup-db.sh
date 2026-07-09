#!/bin/bash
# =============================================================================
# Daily PostgreSQL Backup — runs via cron on VPS
#
# Setup (one-time, as root):
#   crontab -e
#   0 2 * * * /opt/ems/scripts/backup-db.sh >> /var/log/ems-backup.log 2>&1
#
# Retention: 30 days
# Output:    /opt/ems/backups/<college_id>/<date>.sql.gz
# =============================================================================
set -e

BACKUP_DIR="/opt/ems/backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y-%m-%d_%H%M)

# Get all databases from PgBouncer config (skip comments and markers)
DATABASES=$(grep -E '^[a-z].*= host=' /opt/ems/config/pgbouncer/pgbouncer.ini | cut -d' ' -f1)

for db_name in ${DATABASES}; do
  college_id="${db_name%_db}"  # e.g., pdseducation_db → pdseducation
  mkdir -p "${BACKUP_DIR}/${college_id}"

  echo "[$(date)] Backing up ${db_name}..."
  podman exec postgres-ems pg_dump -U postgres "${db_name}" \
    | gzip > "${BACKUP_DIR}/${college_id}/${TIMESTAMP}.sql.gz"

  echo "[$(date)] → ${BACKUP_DIR}/${college_id}/${TIMESTAMP}.sql.gz ($(du -h "${BACKUP_DIR}/${college_id}/${TIMESTAMP}.sql.gz" | cut -f1))"

  # Cleanup old backups
  find "${BACKUP_DIR}/${college_id}" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
done

echo "[$(date)] Backup complete."
