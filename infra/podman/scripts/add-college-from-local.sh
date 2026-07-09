#!/bin/bash
# =============================================================================
# Add a college to the VPS: creates college dir, .env, init.sql, starts
# Postgres + PgBouncer, configures Nginx. Never starts the app.
#
# Usage (from repo root):
#   ./infra/podman/scripts/add-college-from-local.sh deploy@VPS college_id /path/to/.env [ssh_port] [init.sql] [domain]
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

# ── Initial values from args ─────────────────────────────────────────────────

VPS_TARGET="${1:-}"
COLLEGE_ID="${2:-}"
ENV_FILE="${3:-}"
SSH_PORT="${4:-22}"
INIT_SQL_FILE="${5:-}"
DOMAIN="${6:-}"
CMS_ROOT="${CMS_ROOT:-/opt/ems}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PODMAN_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Source shared helpers
source "${SCRIPT_DIR}/lib/deploy-helpers.sh"

# ── Collect / edit inputs ────────────────────────────────────────────────────

collect_inputs() {
  echo ""
  read -p "  user@host [${VPS_TARGET}]: " _v
  [ -n "$_v" ] && VPS_TARGET="$_v" || true
  if [ -z "${VPS_TARGET}" ]; then echo "  Error: user@host is required."; return 1; fi

  read -p "  College ID [${COLLEGE_ID}]: " _v
  [ -n "$_v" ] && COLLEGE_ID="$_v" || true
  if [ -z "${COLLEGE_ID}" ]; then echo "  Error: College ID is required."; return 1; fi

  read -p "  .env file path [${ENV_FILE}]: " _v
  [ -n "$_v" ] && ENV_FILE="$_v" || true
  if [ -z "${ENV_FILE}" ] || [ ! -f "${ENV_FILE}" ]; then echo "  Error: .env file not found: ${ENV_FILE}"; return 1; fi

  read -p "  SSH port [${SSH_PORT}]: " _v
  [ -n "$_v" ] && SSH_PORT="$_v" || true

  read -p "  init.sql path (empty = auto-generate) [${INIT_SQL_FILE}]: " _v
  [ -n "$_v" ] && INIT_SQL_FILE="$_v" || true

  read -p "  Domain (empty = IP-based) [${DOMAIN}]: " _v
  [ -n "$_v" ] && DOMAIN="$_v" || true
}

if [ -z "${VPS_TARGET}" ] || [ -z "${COLLEGE_ID}" ] || [ -z "${ENV_FILE}" ]; then
  collect_inputs || { collect_inputs || exit 1; }
fi

while true; do
  echo ""
  echo "  ┌─────────────────────────────────────┐"
  echo "  │        Add College Config            │"
  echo "  ├─────────────────────────────────────┤"
  printf "  │  VPS:       %-23s │\n" "${VPS_TARGET}:${SSH_PORT}"
  printf "  │  College:   %-23s │\n" "${COLLEGE_ID}"
  printf "  │  Env file:  %-23s │\n" "$(basename "${ENV_FILE}")"
  printf "  │  Init SQL:  %-23s │\n" "${INIT_SQL_FILE:-auto-generate}"
  printf "  │  Domain:    %-23s │\n" "${DOMAIN:-IP-based (none)}"
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

SSH_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)
SCP_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)

# ── Step 1 ───────────────────────────────────────────────────────────────────

echo ""
echo "[1/6] Creating ${CMS_ROOT}/colleges/${COLLEGE_ID}/ and data dir on VPS..."
ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" "mkdir -p ${CMS_ROOT}/colleges/${COLLEGE_ID} ${CMS_ROOT}/data/${COLLEGE_ID}/postgres && chmod 777 ${CMS_ROOT}/data/${COLLEGE_ID}/postgres"

# ── Step 2 ───────────────────────────────────────────────────────────────────

echo "[2/6] Copying .env and generating .env.secret on VPS..."
sync_env_to_vps "${COLLEGE_ID}" "${ENV_FILE}" "${VPS_TARGET}" "${SSH_PORT}"

# Also sync podman-compose.yml if exists
LOCAL_COMPOSE="${PODMAN_DIR}/colleges/${COLLEGE_ID}/podman-compose.yml"
if [ -f "${LOCAL_COMPOSE}" ]; then
  scp "${SCP_OPTS[@]}" -P "${SSH_PORT}" "${LOCAL_COMPOSE}" "${VPS_TARGET}:${CMS_ROOT}/colleges/${COLLEGE_ID}/podman-compose.yml"
  echo "  ✔ podman-compose.yml synced"
fi

# Generate .env.secret with auto-generated DB passwords on VPS (never leave the VPS)
ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
set -e
SECRET_DIR="${CMS_ROOT}/colleges/${COLLEGE_ID}"
SECRET_FILE="\${SECRET_DIR}/.env.secret"
ENC_FILE="\${SECRET_DIR}/.env.secret.enc"
KEY_FILE="\${SECRET_DIR}/.env.secret.key"

# Skip if already bootstrapped
if [ -f "\${ENC_FILE}" ] && [ -f "\${KEY_FILE}" ]; then
  echo "  .env.secret already exists (encrypted). Skipping generation."
  echo "  Use manage-secrets.sh to update keys."
else
  echo "  Generating .env.secret with auto-generated passwords..."

  # Auto-generate DB passwords (never shown, never shared)
  DB_PASSWORD=\$(openssl rand -hex 32)
  POSTGRES_PASSWORD=\$(openssl rand -hex 32)
  BACKUP_PASSWORD=\$(openssl rand -hex 32)

  cat > "\${SECRET_FILE}" <<SECRETS
# =============================================================================
# AUTO-GENERATED SECRETS — DO NOT EDIT MANUALLY (use manage-secrets.sh)
# DB passwords are auto-generated and must never be shared.
# =============================================================================
POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
DB_PASSWORD=\${DB_PASSWORD}
BACKUP_PASSWORD=\${BACKUP_PASSWORD}
SECRETS

  chmod 600 "\${SECRET_FILE}"

  # Generate encryption key
  openssl rand -base64 32 > "\${KEY_FILE}"
  chmod 400 "\${KEY_FILE}"

  # Encrypt
  openssl enc -aes-256-cbc -salt -pbkdf2 \
    -in "\${SECRET_FILE}" -out "\${ENC_FILE}" \
    -pass "file:\${KEY_FILE}"
  chmod 600 "\${ENC_FILE}"

  echo "  ✔ .env.secret generated and encrypted."
  echo "  ✔ Add non-DB secrets (MAIL_PASSWORD, R2 keys, etc.) via manage-secrets.sh"
fi
REOF

ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" "chmod 600 ${CMS_ROOT}/colleges/${COLLEGE_ID}/.env"

# ── Step 3 ───────────────────────────────────────────────────────────────────

echo "[3/6] Generating init.sql from template on VPS..."
if [ -n "${INIT_SQL_FILE}" ] && [ -f "${INIT_SQL_FILE}" ]; then
  # Use provided init.sql template
  scp "${SCP_OPTS[@]}" -P "${SSH_PORT}" "${INIT_SQL_FILE}" "${VPS_TARGET}:${CMS_ROOT}/colleges/${COLLEGE_ID}/init.sql.tpl"
else
  # Use the college-specific template from the repo
  LOCAL_TPL="${PODMAN_DIR}/colleges/${COLLEGE_ID}/init.sql"
  if [ -f "${LOCAL_TPL}" ]; then
    scp "${SCP_OPTS[@]}" -P "${SSH_PORT}" "${LOCAL_TPL}" "${VPS_TARGET}:${CMS_ROOT}/colleges/${COLLEGE_ID}/init.sql.tpl"
  else
    echo "  Warning: No init.sql template found at ${LOCAL_TPL}"
    echo "  Skipping init.sql generation."
  fi
fi

# Expand template with secrets to produce final init.sql
ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
set -e
SECRET_DIR="${CMS_ROOT}/colleges/${COLLEGE_ID}"
TPL="\${SECRET_DIR}/init.sql.tpl"
OUT="\${SECRET_DIR}/init.sql"
ENC_FILE="\${SECRET_DIR}/.env.secret.enc"
KEY_FILE="\${SECRET_DIR}/.env.secret.key"

if [ ! -f "\${TPL}" ]; then
  echo "  No init.sql.tpl found; skipping."
  exit 0
fi

# Decrypt secrets to extract passwords
TMP_SECRETS=\$(mktemp)
openssl enc -aes-256-cbc -d -pbkdf2 \
  -in "\${ENC_FILE}" -out "\${TMP_SECRETS}" \
  -pass "file:\${KEY_FILE}"

# Source the secrets and run envsubst
set -a
source "\${TMP_SECRETS}"
set +a
envsubst < "\${TPL}" > "\${OUT}"
rm -f "\${TMP_SECRETS}"

# Remove plaintext .env.secret if it exists
rm -f "\${SECRET_DIR}/.env.secret"

echo "  ✔ init.sql generated from template."
REOF

checkpoint

# ── Step 4 ───────────────────────────────────────────────────────────────────

echo ""
echo "[4/6] Creating database in shared Postgres for ${COLLEGE_ID}..."
DB_NAME="${COLLEGE_ID}_db"
DB_USER="${COLLEGE_ID}_user"
BACKUP_USER="${COLLEGE_ID}_backup"

# Decrypt .env.secret, create DB + users in shared Postgres, update PgBouncer
ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
set -e
SECRET_DIR="${CMS_ROOT}/colleges/${COLLEGE_ID}"
ENC_FILE="\${SECRET_DIR}/.env.secret.enc"
KEY_FILE="\${SECRET_DIR}/.env.secret.key"
SECRET_FILE="\${SECRET_DIR}/.env.secret"
INIT_SQL="\${SECRET_DIR}/init.sql"
DB_SECRET="/opt/ems/.db-secret"

# ── Decrypt institute secrets ──
openssl enc -aes-256-cbc -d -pbkdf2 \
  -in "\${ENC_FILE}" -out "\${SECRET_FILE}" \
  -pass "file:\${KEY_FILE}"
chmod 600 "\${SECRET_FILE}"

# Source institute DB passwords
set -a
source "\${SECRET_FILE}"
set +a

# Source shared Postgres superuser password
source "\${DB_SECRET}"

echo "  Creating database ${DB_NAME} in shared postgres-ems..."

# Create database if it doesn't exist
podman exec --user postgres postgres-ems psql -U postgres -tc \
  "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" \
  | grep -q 1 \
  || podman exec --user postgres postgres-ems psql -U postgres -c "CREATE DATABASE \"${DB_NAME}\";"

echo "  ✔ Database created."

# Run init.sql (create users, grant privileges) if it exists
if [ -f "\${INIT_SQL}" ]; then
  echo "  Running init.sql..."
  podman cp "\${INIT_SQL}" postgres-ems:/tmp/init.sql
  podman exec --user postgres postgres-ems psql -U postgres -f /tmp/init.sql
  podman exec postgres-ems rm -f /tmp/init.sql
  echo "  ✔ init.sql executed."
fi

# ── Update PgBouncer config ──
PGBOUNCER_INI="/opt/ems/config/pgbouncer/pgbouncer.ini"
USERLIST="/opt/ems/config/pgbouncer/userlist.txt"

# Add database entry to pgbouncer.ini (if not already there)
if ! grep -q "^${DB_NAME}" "\${PGBOUNCER_INI}" 2>/dev/null; then
  sed -i "/^; NEW_DATABASE_ENTRY_HERE/i ${DB_NAME} = host=postgres-ems port=5432 dbname=${DB_NAME}" "\${PGBOUNCER_INI}"
  echo "  ✔ Added ${DB_NAME} to pgbouncer.ini"
fi

# Get the SCRAM hash for the DB user from Postgres
SCRAM_HASH=\$(podman exec --user postgres postgres-ems psql -U postgres -t -A -c \
  "SELECT rolpassword FROM pg_authid WHERE rolname='${DB_USER}';" 2>/dev/null || echo "")

if [ -n "\${SCRAM_HASH}" ]; then
  # Remove old entry if exists, then add
  sed -i "/^\"${DB_USER}\"/d" "\${USERLIST}" 2>/dev/null || true
  sed -i "/^; USER_ENTRY_HERE/i \"${DB_USER}\" \"\${SCRAM_HASH}\"" "\${USERLIST}"
  echo "  ✔ Added ${DB_USER} to userlist.txt"
else
  echo "  ⚠  Could not retrieve SCRAM hash for ${DB_USER}. PgBouncer auth may fail."
  echo "     User may not exist yet — check init.sql."
fi

# Restart PgBouncer to pick up new config + SCRAM hashes (HUP alone won't refresh auth)
podman restart pgbouncer-ems
echo "  ✔ PgBouncer restarted."

# Clean up plaintext secrets
rm -f "\${SECRET_FILE}"
echo "  Database setup complete. Plaintext secrets removed."
REOF

checkpoint

# ── Step 5 ───────────────────────────────────────────────────────────────────

echo ""
echo "[5/6] Setting up Nginx for ${COLLEGE_ID} on VPS..."
APP_PORT_LOCAL=$(grep '^APP_PORT=' "${ENV_FILE}" 2>/dev/null | cut -d= -f2- || echo "8081")
MULTI_INST=$(grep '^EMS_MULTI_INSTITUTION_MODE=' "${ENV_FILE}" 2>/dev/null | cut -d= -f2- || echo "false")

# Sanitize .env before upload (fix APP_NAME spaces, MAIL_FROM_NAME, etc.)
source "${SCRIPT_DIR}/lib/deploy-helpers.sh"
sanitize_env "${ENV_FILE}"

TMP_NGINX=$(mktemp)
generate_nginx_conf "${COLLEGE_ID}" "${DOMAIN}" "${APP_PORT_LOCAL}" "${MULTI_INST}" > "${TMP_NGINX}"
scp "${SCP_OPTS[@]}" -P "${SSH_PORT}" "${TMP_NGINX}" "${VPS_TARGET}:/tmp/ems-${COLLEGE_ID}.nginx.conf"
rm -f "${TMP_NGINX}"
NGINX_CONF_PATH="/etc/nginx/sites-available/ems-${COLLEGE_ID}"
ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" " \
  sudo cp /tmp/ems-${COLLEGE_ID}.nginx.conf ${NGINX_CONF_PATH} && \
  rm -f /tmp/ems-${COLLEGE_ID}.nginx.conf && \
  sudo ln -sf ${NGINX_CONF_PATH} /etc/nginx/sites-enabled/ && \
  sudo nginx -t && sudo systemctl reload nginx && \
  echo 'Nginx configured for ems-${COLLEGE_ID}.'"

echo ""
echo "[6/6] Done."
echo ""
echo "Next: deploy the app with local-deploy.sh ${COLLEGE_ID} or push tag v-${COLLEGE_ID}-<version>"
