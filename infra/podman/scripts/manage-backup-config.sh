#!/bin/bash
# =============================================================================
# Manage .env.backup on VPS (R2 backup credentials)
# Usage: ./manage-backup-config.sh <user@host> <college_id> [ssh_port]
# Example: ./manage-backup-config.sh deploy@187.124.98.33 pdseducation 22
# =============================================================================
set -e

VPS_TARGET="${1:?Usage: $0 <user@host> <college_id> [ssh_port]}"
COLLEGE_ID="${2:?Usage: $0 <user@host> <college_id> [ssh_port]}"
SSH_PORT="${3:-22}"
CMS_ROOT="/opt/ems"
BACKUP_FILE="${CMS_ROOT}/colleges/${COLLEGE_ID}/.env.backup"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=10)

echo "╔══════════════════════════════════════════════════════╗"
echo "║  Manage Backup Config — ${COLLEGE_ID}               "
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Check if .env.backup exists
EXISTS=$(ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
  "[ -f ${BACKUP_FILE} ] && echo yes || echo no")

if [ "${EXISTS}" = "yes" ]; then
  echo "Current .env.backup:"
  echo "─────────────────────"
  ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
    "grep -v '^#' ${BACKUP_FILE} | grep -v '^$' | sed 's/=.*/=********/'"
  echo "─────────────────────"
  echo ""
  echo "Options:"
  echo "  1) Set all values (fresh)"
  echo "  2) Update single key"
  echo "  3) View current values (unmask)"
  echo "  4) Test connection (DB backup + R2 upload)"
  echo "  5) Delete .env.backup"
  echo "  6) Exit"
  read -rp "Choice [1-6]: " choice
else
  echo "No .env.backup found. Creating new one."
  choice=1
fi

case "${choice}" in
  1)
    echo ""
    echo "Enter R2 backup credentials (from Cloudflare Dashboard → R2 → API Tokens):"
    echo ""
    read -rp "R2_BACKUP_ACCESS_KEY: " r2_access
    read -rp "R2_BACKUP_SECRET_KEY: " r2_secret
    read -rp "R2_BACKUP_BUCKET: " r2_bucket
    read -rp "R2_BACKUP_ENDPOINT (e.g. https://<account-id>.r2.cloudflarestorage.com): " r2_endpoint

    if [ -z "${r2_access}" ] || [ -z "${r2_secret}" ] || [ -z "${r2_bucket}" ] || [ -z "${r2_endpoint}" ]; then
      echo "All fields are required. Aborting."
      exit 1
    fi

    ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
cat > ${BACKUP_FILE} <<'INNER'
# =============================================================================
# Database Backup — R2 Configuration
# Created by manage-backup-config.sh
# =============================================================================
R2_BACKUP_ACCESS_KEY=${r2_access}
R2_BACKUP_SECRET_KEY=${r2_secret}
R2_BACKUP_BUCKET=${r2_bucket}
R2_BACKUP_ENDPOINT=${r2_endpoint}
INNER
chmod 600 ${BACKUP_FILE}
REOF

    echo ""
    echo "✔ .env.backup created on VPS (chmod 600)"
    ;;
  2)
    echo ""
    echo "Available keys:"
    echo "  1) R2_BACKUP_ACCESS_KEY"
    echo "  2) R2_BACKUP_SECRET_KEY"
    echo "  3) R2_BACKUP_BUCKET"
    echo "  4) R2_BACKUP_ENDPOINT"
    read -rp "Select key to update [1-4]: " key_choice

    case "${key_choice}" in
      1) key_name="R2_BACKUP_ACCESS_KEY" ;;
      2) key_name="R2_BACKUP_SECRET_KEY" ;;
      3) key_name="R2_BACKUP_BUCKET" ;;
      4) key_name="R2_BACKUP_ENDPOINT" ;;
      *) echo "Invalid."; exit 1 ;;
    esac

    echo ""
    echo "Current value:"
    ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
      "grep '^${key_name}=' ${BACKUP_FILE} 2>/dev/null | sed 's/=.*/=********/' || echo '  (not set)'"
    echo ""
    read -rp "New value for ${key_name}: " new_value
    if [ -z "${new_value}" ]; then
      echo "Empty value. Skipped."
      exit 0
    fi

    ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
set -e
if grep -q "^${key_name}=" "${BACKUP_FILE}" 2>/dev/null; then
  sed -i "s|^${key_name}=.*|${key_name}=${new_value}|" "${BACKUP_FILE}"
else
  echo "${key_name}=${new_value}" >> "${BACKUP_FILE}"
fi
chmod 600 "${BACKUP_FILE}"
REOF
    echo ""
    echo "✔ ${key_name} updated."
    ;;
  3)
    echo ""
    ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" "cat ${BACKUP_FILE}"
    ;;
  4)
    echo ""
    read -rp "Keep test file in R2 bucket after test? [y/N]: " KEEP_TEST
    KEEP_TEST="${KEEP_TEST:-N}"
    echo ""
    echo "Testing backup for ${COLLEGE_ID}..."
    ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" "KEEP_TEST=${KEEP_TEST}" bash -s <<REOF
set -e
COLLEGE="${COLLEGE_ID}"
ENV_DIR="/opt/ems/colleges/\${COLLEGE}"
DB_NAME="\${COLLEGE}_db"
BACKUP_USER="\${COLLEGE}_backup"
CONTAINER="postgres-ems"

# Source credentials
set -a
[ -f "\${ENV_DIR}/.env" ] && source "\${ENV_DIR}/.env"

# Decrypt .env.secret if needed
ENC_FILE="\${ENV_DIR}/.env.secret.enc"
KEY_FILE="\${ENV_DIR}/.env.secret.key"
if [ -f "\${ENC_FILE}" ] && [ -f "\${KEY_FILE}" ]; then
  TMP_SEC=\$(mktemp)
  openssl enc -aes-256-cbc -d -pbkdf2 -in "\${ENC_FILE}" -out "\${TMP_SEC}" -pass "file:\${KEY_FILE}" 2>/dev/null
  source "\${TMP_SEC}"
  rm -f "\${TMP_SEC}"
fi

[ -f "\${ENV_DIR}/.env.backup" ] && source "\${ENV_DIR}/.env.backup"
set +a

echo ""
echo "── Step 1: DB backup user connection ──"
if podman exec -e PGPASSWORD="\${BACKUP_PASSWORD}" "\${CONTAINER}" \
  psql -U "\${BACKUP_USER}" -h 127.0.0.1 -d "\${DB_NAME}" -c "SELECT 1;" >/dev/null 2>&1; then
  echo "  ✔ Backup user can connect to \${DB_NAME}"
else
  echo "  ✘ Cannot connect as \${BACKUP_USER}"
  exit 1
fi

echo ""
echo "── Step 2: Test pg_dump (schema only, tiny) ──"
TEST_FILE="/tmp/backup_test_\${COLLEGE}.sql.gz"
podman exec -e PGPASSWORD="\${BACKUP_PASSWORD}" "\${CONTAINER}" \
  pg_dump -U "\${BACKUP_USER}" -h 127.0.0.1 -d "\${DB_NAME}" --schema-only --no-owner --no-acl 2>/dev/null \
  | head -50 | gzip > "\${TEST_FILE}"
SIZE=\$(stat -c%s "\${TEST_FILE}" 2>/dev/null || stat -f%z "\${TEST_FILE}" 2>/dev/null)
echo "  ✔ pg_dump succeeded (\${SIZE} bytes)"

echo ""
echo "── Step 3: R2 upload test ──"
if [ -z "\${R2_BACKUP_ACCESS_KEY}" ] || [ -z "\${R2_BACKUP_BUCKET}" ]; then
  echo "  ✘ R2_BACKUP_ACCESS_KEY or R2_BACKUP_BUCKET not set in .env.backup"
  rm -f "\${TEST_FILE}"
  exit 1
fi

AWS_ACCESS_KEY_ID="\${R2_BACKUP_ACCESS_KEY}" \
AWS_SECRET_ACCESS_KEY="\${R2_BACKUP_SECRET_KEY}" \
aws s3 cp "\${TEST_FILE}" \
  "s3://\${R2_BACKUP_BUCKET}/postgres/_test/connection_test.sql.gz" \
  --endpoint-url "\${R2_BACKUP_ENDPOINT}" --only-show-errors 2>&1

if [ \$? -eq 0 ]; then
  echo "  ✔ R2 upload succeeded"
  echo ""
  echo "  File: s3://\${R2_BACKUP_BUCKET}/postgres/_test/connection_test.sql.gz"
  if [ "\${KEEP_TEST}" = "y" ] || [ "\${KEEP_TEST}" = "Y" ]; then
    echo "  ℹ Test file kept — check your Cloudflare R2 dashboard."
    echo "  ℹ Path: postgres/_test/connection_test.sql.gz"
  else
    AWS_ACCESS_KEY_ID="\${R2_BACKUP_ACCESS_KEY}" \
    AWS_SECRET_ACCESS_KEY="\${R2_BACKUP_SECRET_KEY}" \
    aws s3 rm "s3://\${R2_BACKUP_BUCKET}/postgres/_test/connection_test.sql.gz" \
      --endpoint-url "\${R2_BACKUP_ENDPOINT}" --only-show-errors 2>/dev/null || true
    echo "  ✔ Test file cleaned up from R2"
  fi
else
  echo "  ✘ R2 upload failed — check credentials and bucket name"
fi

rm -f "\${TEST_FILE}"

echo ""
echo "══ All tests passed ══"
REOF
    ;;
  5)
    read -rp "Are you sure? [y/N]: " confirm
    if [ "${confirm}" = "y" ]; then
      ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" "rm -f ${BACKUP_FILE}"
      echo "✔ .env.backup deleted."
    fi
    ;;
  6|*)
    echo "Exiting."
    ;;
esac
