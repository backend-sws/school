#!/bin/bash
# =============================================================================
# Shared deployment helpers — sourced by all deployment scripts.
# Single source of truth for nginx config, .env sanitization, SSL, and health.
#
# Usage: source "${SCRIPT_DIR}/lib/deploy-helpers.sh"
# =============================================================================

# ── Colors (only set if not already defined) ──────────────────────────────────
RED="${RED:-\033[0;31m}"
GREEN="${GREEN:-\033[0;32m}"
YELLOW="${YELLOW:-\033[1;33m}"
CYAN="${CYAN:-\033[0;36m}"
BOLD="${BOLD:-\033[1m}"
DIM="${DIM:-\033[2m}"
NC="${NC:-\033[0m}"

# ── Constants ────────────────────────────────────────────────────────────────
EMS_ROOT="${EMS_ROOT:-/opt/ems}"

# =============================================================================
# generate_nginx_conf  —  Polymorphic nginx config generator
#
# Reads the college .env and adapts the config:
#   - Multi-institution mode → adds *.domain to server_name
#   - SSL cert exists         → adds 443 listener with SSL
#   - No SSL                  → HTTP-only with certbot challenge path
#
# Args: $1=college_id  $2=domain  $3=app_port  [$4=multi_institution (true|false)]
# Output: writes nginx config to stdout
# =============================================================================
generate_nginx_conf() {
  local college_id="$1"
  local domain="$2"
  local app_port="$3"
  local multi_institution="${4:-false}"

  # Build server_name
  local server_name
  if [ -z "${domain}" ] || [ "${domain}" = "_" ]; then
    server_name="_"
  elif [ "${multi_institution}" = "true" ]; then
    server_name="${domain} www.${domain} *.${domain}"
  else
    server_name="${domain} www.${domain}"
  fi

  # Check if SSL cert exists (for remote usage, caller should set HAS_SSL)
  local has_ssl="${HAS_SSL:-false}"
  local ssl_cert="/etc/letsencrypt/live/${domain}/fullchain.pem"
  local ssl_key="/etc/letsencrypt/live/${domain}/privkey.pem"

  # ── Shared location block (used by both HTTP and HTTPS) ──
  local location_block
  location_block=$(cat <<'LOCATION'
    location / {
        proxy_pass http://127.0.0.1:__APP_PORT__;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_connect_timeout 10s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        client_max_body_size 100M;

        # Laravel encrypted cookies are ~2k each; default 4k buffer overflows
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
LOCATION
)
  location_block="${location_block//__APP_PORT__/$app_port}"

  # ── Generate config ──
  if [ "${has_ssl}" = "true" ]; then
    cat <<SSLCONF
server {
    server_name ${server_name};

${location_block}

    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate ${ssl_cert};
    ssl_certificate_key ${ssl_key};
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${server_name};
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    return 301 https://\$host\$request_uri;
}
SSLCONF
  else
    cat <<HTTPCONF
server {
    listen 80;
    listen [::]:80;
    server_name ${server_name};
    location /.well-known/acme-challenge/ { root /var/www/certbot; }

${location_block}
}
HTTPCONF
  fi
}

# =============================================================================
# sanitize_env  —  Fix known .env issues for podman compatibility
#
# Fixes:
#   1. APP_NAME with spaces/quotes → remove spaces, strip quotes
#   2. MAIL_FROM_NAME="${APP_NAME}" → literal app name
#   3. Validates required keys exist
#
# Args: $1=env_file_path
# Returns: 0 if OK, 1 if issues found
# =============================================================================
sanitize_env() {
  local env_file="$1"
  local fixes=0

  if [ ! -f "${env_file}" ]; then
    printf "  ${RED}✘${NC}  .env not found: %s\n" "${env_file}"
    return 1
  fi

  # Fix 1: APP_NAME with spaces — podman --env-file doesn't handle quoted values with spaces
  local app_name
  app_name=$(grep "^APP_NAME=" "${env_file}" | cut -d= -f2-)
  if echo "${app_name}" | grep -q '[[:space:]]'; then
    local clean_name
    clean_name=$(echo "${app_name}" | sed 's/"//g;s/[[:space:]]//g')
    sed -i "s/^APP_NAME=.*/APP_NAME=${clean_name}/" "${env_file}"
    printf "  ${GREEN}✔${NC}  APP_NAME: removed spaces → %s\n" "${clean_name}"
    fixes=$((fixes + 1))
  fi

  # Fix 2: MAIL_FROM_NAME="${APP_NAME}" — podman doesn't interpolate shell vars
  if grep -qF 'MAIL_FROM_NAME="${APP_NAME}"' "${env_file}" 2>/dev/null; then
    local resolved_name
    resolved_name=$(grep "^APP_NAME=" "${env_file}" | cut -d= -f2- | sed 's/"//g;s/[[:space:]]//g')
    sed -i "s/MAIL_FROM_NAME=\"\${APP_NAME}\"/MAIL_FROM_NAME=\"${resolved_name}\"/" "${env_file}"
    printf "  ${GREEN}✔${NC}  MAIL_FROM_NAME: \${APP_NAME} → %s\n" "${resolved_name}"
    fixes=$((fixes + 1))
  fi

  # Fix 3: Remove double-double-quotes (e.g. APP_NAME=""Value"" from prior broken fix)
  if grep -qE '^APP_NAME="".*""' "${env_file}" 2>/dev/null; then
    sed -i 's/^APP_NAME=""\([^"]*\)""$/APP_NAME=\1/' "${env_file}"
    printf "  ${GREEN}✔${NC}  APP_NAME: removed double-double-quotes\n"
    fixes=$((fixes + 1))
  fi

  # Fix 4: Validate required keys
  local missing=0
  # Note: APP_KEY, DB_PASSWORD, POSTGRES_PASSWORD are in .env.secret — don't require them here
  for key in APP_NAME APP_ENV APP_URL APP_PORT DB_HOST DB_DATABASE DB_USERNAME; do
    if ! grep -q "^${key}=" "${env_file}" 2>/dev/null; then
      printf "  ${RED}✘${NC}  Missing: %s\n" "${key}"
      missing=$((missing + 1))
    fi
  done

  if [ ${fixes} -eq 0 ] && [ ${missing} -eq 0 ]; then
    printf "  ${GREEN}✔${NC}  .env is clean\n"
  fi

  return ${missing}
}

# =============================================================================
# setup_ssl  —  Certbot with auto-renewal
#
# Args: $1=domain  [$2=email]  [$3=extra_domains (comma-separated)]
# =============================================================================
setup_ssl() {
  local domain="$1"
  local email="${2:-admin@${domain}}"
  local extra_domains="$3"

  # Install certbot if missing
  if ! command -v certbot &>/dev/null; then
    printf "  Installing certbot...\n"
    sudo apt-get update -qq
    sudo apt-get install -y -qq certbot python3-certbot-nginx > /dev/null 2>&1
  fi

  # Build domain args
  local domain_args="-d ${domain} -d www.${domain}"
  if [ -n "${extra_domains}" ]; then
    IFS=',' read -ra EXTRA <<< "${extra_domains}"
    for d in "${EXTRA[@]}"; do
      domain_args="${domain_args} -d ${d}"
    done
  fi

  # Run certbot
  sudo certbot --nginx ${domain_args} \
    --non-interactive --agree-tos --expand --redirect \
    --email "${email}" 2>&1 || {
    printf "  ${YELLOW}⚠${NC}  Certbot failed. Common issues:\n"
    printf "    - DNS not pointing to this server\n"
    printf "    - Port 80 not accessible from internet\n"
    return 1
  }

  # Ensure auto-renewal cron
  if ! crontab -l 2>/dev/null | grep -q certbot; then
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
    printf "  ${GREEN}✔${NC}  Auto-renewal cron added (3 AM daily)\n"
  fi

  printf "  ${GREEN}✔${NC}  SSL ready for %s\n" "${domain}"
}

# =============================================================================
# check_health  —  Container + endpoint health with retry
#
# Args: $1=college_id  $2=app_port  [$3=max_attempts]
# Returns: 0 if healthy, 1 if unhealthy
# =============================================================================
check_health() {
  local college_id="$1"
  local app_port="$2"
  local max_attempts="${3:-10}"
  local container="ems-app-${college_id}"

  for i in $(seq 1 "${max_attempts}"); do
    if curl -sf "http://127.0.0.1:${app_port}/" > /dev/null 2>&1; then
      printf "  ${GREEN}✔${NC}  App responding on port %s (attempt %s)\n" "${app_port}" "${i}"
      return 0
    fi

    local status
    status=$(podman inspect --format '{{.State.Status}}' "${container}" 2>/dev/null || echo "not_found")
    if [ "${status}" = "exited" ] || [ "${status}" = "stopped" ] || [ "${status}" = "dead" ] || [ "${status}" = "not_found" ]; then
      printf "  ${RED}✘${NC}  Container %s: %s\n" "${container}" "${status}"
      return 1
    fi

    printf "  ${DIM}…${NC}  attempt %s/%s (container: %s)\n" "${i}" "${max_attempts}" "${status}"
    sleep 10
  done

  printf "  ${RED}✘${NC}  App not ready after %s attempts\n" "${max_attempts}"
  return 1
}

# =============================================================================
# harden_server  —  Apply server security hardening
#
# Idempotent — safe to run multiple times.
# Args: $1=deploy_user  [$2=ssh_pubkey]
# =============================================================================
harden_server() {
  local deploy_user="${1:-deploy}"
  local ssh_pubkey="$2"

  printf "\n${BOLD}  [Server Hardening]${NC}\n\n"

  # 1. SSH hardening
  local sshd_config="/etc/ssh/sshd_config"
  if grep -q "^PasswordAuthentication yes" "${sshd_config}" 2>/dev/null; then
    sudo sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' "${sshd_config}"
    sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' "${sshd_config}"
    printf "  ${GREEN}✔${NC}  SSH: password auth disabled\n"
  else
    printf "  ${DIM}–${NC}  SSH: password auth already disabled\n"
  fi

  if grep -q "^PermitRootLogin yes" "${sshd_config}" 2>/dev/null; then
    sudo sed -i 's/^PermitRootLogin yes/PermitRootLogin prohibit-password/' "${sshd_config}"
    printf "  ${GREEN}✔${NC}  SSH: root login restricted to key-only\n"
  else
    printf "  ${DIM}–${NC}  SSH: root login already restricted\n"
  fi

  sudo systemctl restart ssh 2>/dev/null || true

  # 2. Fail2ban
  if systemctl is-active --quiet fail2ban 2>/dev/null; then
    printf "  ${DIM}–${NC}  fail2ban: already running\n"
  else
    sudo apt-get install -y -qq fail2ban > /dev/null 2>&1 || true
    sudo systemctl enable --now fail2ban 2>/dev/null || true
    printf "  ${GREEN}✔${NC}  fail2ban: installed and enabled\n"
  fi

  # Create aggressive SSH jail if not exists
  local jail_conf="/etc/fail2ban/jail.d/sshd-aggressive.conf"
  if [ ! -f "${jail_conf}" ]; then
    sudo tee "${jail_conf}" > /dev/null <<'JAIL'
[sshd-aggressive]
enabled  = true
port     = ssh
filter   = sshd[mode=aggressive]
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 3600
findtime = 600
JAIL
    sudo systemctl restart fail2ban
    printf "  ${GREEN}✔${NC}  fail2ban: aggressive SSH jail created\n"
  else
    printf "  ${DIM}–${NC}  fail2ban: SSH jail already exists\n"
  fi

  # 3. Automatic security updates
  if dpkg -l unattended-upgrades > /dev/null 2>&1; then
    printf "  ${DIM}–${NC}  unattended-upgrades: already installed\n"
  else
    sudo apt-get install -y -qq unattended-upgrades > /dev/null 2>&1
    printf "  ${GREEN}✔${NC}  unattended-upgrades: installed\n"
  fi

  # 4. File permissions for .env files
  if [ -d "${EMS_ROOT}/colleges" ]; then
    find "${EMS_ROOT}/colleges" -name ".env" -exec chmod 600 {} \;
    find "${EMS_ROOT}/colleges" -name ".env" -exec chown "${deploy_user}:${deploy_user}" {} \;
    printf "  ${GREEN}✔${NC}  .env files: permissions set to 600\n"
  fi

  printf "\n  ${GREEN}Hardening complete.${NC}\n"
}

# =============================================================================
# INFRA_KEYS — single source of truth for keys stripped from local .env
#
# These are replaced with production values during sync.
# =============================================================================
INFRA_STRIP_KEYS="DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD POSTGRES_PASSWORD POSTGRES_HOST_PORT BACKUP_PASSWORD APP_KEY REDIS_HOST REDIS_PORT"

# =============================================================================
# sync_env_to_vps — whitelist-strip local .env + append production infra vars
#
# This is the SINGLE function that handles env sync. No other script should
# do inline grep/sed chains for env sync.
#
# Args: $1=college_id  $2=local_env_path  $3=vps_target  $4=ssh_port
# =============================================================================
sync_env_to_vps() {
  local college_id="$1"
  local local_env="$2"
  local vps_target="$3"
  local ssh_port="${4:-22}"

  if [ ! -f "${local_env}" ]; then
    printf "  ${RED}✘${NC}  Local .env not found: %s\n" "${local_env}"
    return 1
  fi

  local db_name="${college_id}_db"
  local db_user="${college_id}_user"
  local tmp_env
  tmp_env=$(mktemp)

  # Copy local .env and strip ALL infra keys
  cp "${local_env}" "${tmp_env}"
  for key in ${INFRA_STRIP_KEYS}; do
    sed -i.bak "/^${key}=/d" "${tmp_env}"
  done
  rm -f "${tmp_env}.bak"

  # Ensure file ends with newline before appending (prevents key concatenation)
  [ -n "$(tail -c 1 "${tmp_env}")" ] && echo "" >> "${tmp_env}"

  # Append production infra overrides (hardcoded values, no interpolation risk)
  cat >> "${tmp_env}" <<INFRA
DB_HOST=pgbouncer-ems
DB_PORT=6432
DB_DATABASE=${db_name}
DB_USERNAME=${db_user}
REDIS_HOST=redis-ems
INFRA

  # Sanitize before upload
  sanitize_env "${tmp_env}" 2>/dev/null || true

  # Upload
  scp -o StrictHostKeyChecking=accept-new -P "${ssh_port}" \
    "${tmp_env}" "${vps_target}:${EMS_ROOT}/colleges/${college_id}/.env"
  rm -f "${tmp_env}"

  printf "  ${GREEN}✔${NC}  .env synced (whitelist-based)\n"
}

# =============================================================================
# ensure_pgbouncer_entry — ensure PgBouncer has an entry for this college's DB
#
# Runs ON the VPS (expects to be called within an SSH session or via ssh).
# Idempotent: skips if entry already exists.
#
# This is meant to be called as a remote script snippet, not locally.
# Args: $1=college_id  $2=vps_target  $3=ssh_port
# =============================================================================
ensure_pgbouncer_entry() {
  local college_id="$1"
  local vps_target="$2"
  local ssh_port="${3:-22}"
  local db_name="${college_id}_db"

  ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new \
    -p "${ssh_port}" "${vps_target}" bash -s <<PGEOF
set -e
PGBOUNCER_INI="/opt/ems/config/pgbouncer/pgbouncer.ini"

if [ ! -f "\${PGBOUNCER_INI}" ]; then
  echo "  ⚠ pgbouncer.ini not found — skipping"
  exit 0
fi

if grep -q "^${db_name}" "\${PGBOUNCER_INI}" 2>/dev/null; then
  echo "  ✔ PgBouncer: ${db_name} already configured"
else
  # Add entry before the sentinel comment, or at end of [databases] section
  if grep -q "; NEW_DATABASE_ENTRY_HERE" "\${PGBOUNCER_INI}"; then
    sed -i "/; NEW_DATABASE_ENTRY_HERE/i ${db_name} = host=postgres-ems port=5432 dbname=${db_name}" "\${PGBOUNCER_INI}"
  else
    # Fallback: append after [databases] header
    sed -i "/^\[databases\]/a ${db_name} = host=postgres-ems port=5432 dbname=${db_name}" "\${PGBOUNCER_INI}"
  fi

  # Reload PgBouncer (HUP for config, restart for auth changes)
  podman exec pgbouncer-ems kill -HUP 1 2>/dev/null && \
    echo "  ✔ PgBouncer: added ${db_name} and reloaded" || \
    (podman restart pgbouncer-ems 2>/dev/null && echo "  ✔ PgBouncer: added ${db_name} and restarted")
fi
PGEOF
}

# =============================================================================
# ensure_nginx_port — validate Nginx proxy_pass port matches APP_PORT
#
# Args: $1=college_id  $2=vps_target  $3=ssh_port
# =============================================================================
ensure_nginx_port() {
  local college_id="$1"
  local vps_target="$2"
  local ssh_port="${3:-22}"

  ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new \
    -p "${ssh_port}" "${vps_target}" bash -s <<NXEOF
set -e
NGINX_CONF="/etc/nginx/sites-enabled/ems-${college_id}"
ENV_FILE="/opt/ems/colleges/${college_id}/.env"

if [ ! -f "\${NGINX_CONF}" ] && ! sudo test -f "\${NGINX_CONF}"; then
  echo "  ⚠ Nginx: no config for ${college_id} — skipping"
  exit 0
fi

# Get APP_PORT from .env
APP_PORT=\$(grep "^APP_PORT=" "\${ENV_FILE}" 2>/dev/null | cut -d= -f2- | tr -d '\r' | xargs)
if [ -z "\${APP_PORT}" ]; then
  echo "  ⚠ Nginx: APP_PORT not found in .env — skipping"
  exit 0
fi

# Get current proxy_pass port from Nginx
NGINX_PORT=\$(sudo grep -oP 'proxy_pass http://127.0.0.1:\K[0-9]+' "\${NGINX_CONF}" | head -1)

if [ "\${NGINX_PORT}" = "\${APP_PORT}" ]; then
  echo "  ✔ Nginx: proxy_pass port matches APP_PORT (:\${APP_PORT})"
else
  echo "  ⚠ Nginx: port mismatch (nginx=\${NGINX_PORT}, app=\${APP_PORT}) — fixing..."
  sudo sed -i "s|proxy_pass http://127.0.0.1:[0-9]*;|proxy_pass http://127.0.0.1:\${APP_PORT};|g" "\${NGINX_CONF}"
  sudo nginx -t 2>&1 && sudo systemctl reload nginx && \
    echo "  ✔ Nginx: updated to port \${APP_PORT} and reloaded" || \
    echo "  ✘ Nginx: config test failed after update"
fi
NXEOF
}

# =============================================================================
# validate_env_completeness — check that a .env has all required keys
#
# Args: $1=env_file_path
# Returns: 0 if OK, count of missing keys otherwise
# =============================================================================
validate_env_completeness() {
  local env_file="$1"
  local missing=0

  if [ ! -f "${env_file}" ]; then
    printf "  ${RED}✘${NC}  .env not found: %s\n" "${env_file}"
    return 1
  fi

  # Required keys in the .env (secrets are in .env.secret)
  local required_keys="APP_NAME APP_ENV APP_URL APP_PORT DB_HOST DB_PORT DB_DATABASE DB_USERNAME REDIS_HOST"
  for key in ${required_keys}; do
    if ! grep -q "^${key}=" "${env_file}" 2>/dev/null; then
      printf "  ${RED}✘${NC}  Missing: %s\n" "${key}"
      missing=$((missing + 1))
    fi
  done

  if [ ${missing} -eq 0 ]; then
    printf "  ${GREEN}✔${NC}  .env has all required keys\n"
  fi

  return ${missing}
}

# =============================================================================
# run_diagnostics — comprehensive health check for a college on a VPS
#
# Checks: env completeness, DB connectivity, PgBouncer entry, Nginx port,
#          container health, Horizon status
#
# Args: $1=college_id  $2=vps_target  $3=ssh_port
# =============================================================================
run_diagnostics() {
  local college_id="$1"
  local vps_target="$2"
  local ssh_port="${3:-22}"

  printf "\n  ${BOLD}Diagnostics: ${college_id}${NC}\n\n"

  ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new \
    -p "${ssh_port}" "${vps_target}" bash -s <<DIAGEOF
# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DIM='\033[2m'
NC='\033[0m'

COLLEGE_ID="${college_id}"
ENV_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env"
SECRET_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env.secret"
ENC_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env.secret.enc"
PGBOUNCER_INI="/opt/ems/config/pgbouncer/pgbouncer.ini"
NGINX_CONF="/etc/nginx/sites-enabled/ems-\${COLLEGE_ID}"
DB_NAME="\${COLLEGE_ID}_db"

ISSUES=0
FIXED=0

# ── 1. .env file ──
printf "  \${DIM}[1/7]\${NC} .env file... "
if [ -f "\${ENV_FILE}" ]; then
  MISSING=""
  # Check both .env AND .env.secret for required keys
  for key in APP_NAME APP_ENV APP_URL APP_PORT DB_HOST DB_PORT DB_DATABASE DB_USERNAME REDIS_HOST; do
    FOUND=0
    grep -q "^\\${key}=" "\${ENV_FILE}" 2>/dev/null && FOUND=1
    [ "\${FOUND}" -eq 0 ] && [ -f "\${SECRET_FILE}" ] && grep -q "^\\${key}=" "\${SECRET_FILE}" 2>/dev/null && FOUND=1
    [ "\${FOUND}" -eq 0 ] && MISSING="\${MISSING} \${key}"
  done
  if [ -z "\${MISSING}" ]; then
    printf "\${GREEN}✔\${NC} complete\n"
  else
    printf "\${YELLOW}⚠\${NC} missing:\${MISSING} — auto-fixing infra keys...\n"
    for mkey in \${MISSING}; do
      case "\${mkey}" in
        DB_HOST)     echo "DB_HOST=pgbouncer-ems" >> "\${ENV_FILE}"; printf "    + DB_HOST=pgbouncer-ems\n" ;;
        DB_PORT)     echo "DB_PORT=6432" >> "\${ENV_FILE}"; printf "    + DB_PORT=6432\n" ;;
        DB_DATABASE) echo "DB_DATABASE=\${COLLEGE_ID}_db" >> "\${ENV_FILE}"; printf "    + DB_DATABASE=\${COLLEGE_ID}_db\n" ;;
        DB_USERNAME) echo "DB_USERNAME=\${COLLEGE_ID}_user" >> "\${ENV_FILE}"; printf "    + DB_USERNAME=\${COLLEGE_ID}_user\n" ;;
        REDIS_HOST)  echo "REDIS_HOST=redis-ems" >> "\${ENV_FILE}"; printf "    + REDIS_HOST=redis-ems\n" ;;
        *)           printf "    \${RED}✘\${NC} %s — set manually\n" "\${mkey}"; ISSUES=\$((ISSUES + 1)) ;;
      esac
    done

    FIXED=\$((FIXED + 1))
  fi
else
  printf "\${RED}✘\${NC} not found\n"
  ISSUES=\$((ISSUES + 1))
fi

# ── 2. .env.secret ──
printf "  \${DIM}[2/7]\${NC} .env.secret... "
if [ -f "\${SECRET_FILE}" ] || [ -f "\${ENC_FILE}" ]; then
  printf "\${GREEN}✔\${NC} exists"
  [ -f "\${ENC_FILE}" ] && printf " (encrypted)"
  printf "\n"
else
  printf "\${RED}✘\${NC} not found\n"
  ISSUES=\$((ISSUES + 1))
fi

# ── 3. PgBouncer entry ──
printf "  \${DIM}[3/7]\${NC} PgBouncer entry... "
if [ -f "\${PGBOUNCER_INI}" ]; then
  if grep -q "^\${DB_NAME}" "\${PGBOUNCER_INI}" 2>/dev/null; then
    printf "\${GREEN}✔\${NC} \${DB_NAME} configured\n"
  else
    printf "\${YELLOW}⚠\${NC} missing — "
    # Auto-fix
    if grep -q "; NEW_DATABASE_ENTRY_HERE" "\${PGBOUNCER_INI}"; then
      sed -i "/; NEW_DATABASE_ENTRY_HERE/i \${DB_NAME} = host=postgres-ems port=5432 dbname=\${DB_NAME}" "\${PGBOUNCER_INI}"
    else
      sed -i "/^\[databases\]/a \${DB_NAME} = host=postgres-ems port=5432 dbname=\${DB_NAME}" "\${PGBOUNCER_INI}"
    fi
    podman exec pgbouncer-ems kill -HUP 1 2>/dev/null || podman restart pgbouncer-ems 2>/dev/null
    printf "\${GREEN}FIXED\${NC}\n"
    FIXED=\$((FIXED + 1))
  fi
else
  printf "\${RED}✘\${NC} pgbouncer.ini not found\n"
  ISSUES=\$((ISSUES + 1))
fi

# ── 4. Nginx config ──
printf "  \${DIM}[4/7]\${NC} Nginx config... "
if sudo test -f "\${NGINX_CONF}" 2>/dev/null; then
  APP_PORT=\$(grep "^APP_PORT=" "\${ENV_FILE}" 2>/dev/null | cut -d= -f2- | tr -d '\r' | xargs)
  NGINX_PORT=\$(sudo grep -oP 'proxy_pass http://127.0.0.1:\K[0-9]+' "\${NGINX_CONF}" 2>/dev/null | head -1)
  if [ "\${NGINX_PORT}" = "\${APP_PORT}" ]; then
    printf "\${GREEN}✔\${NC} port :\${APP_PORT}\n"
  elif [ -n "\${APP_PORT}" ] && [ -n "\${NGINX_PORT}" ]; then
    printf "\${YELLOW}⚠\${NC} port mismatch (nginx=\${NGINX_PORT}, app=\${APP_PORT}) — "
    sudo sed -i "s|proxy_pass http://127.0.0.1:[0-9]*;|proxy_pass http://127.0.0.1:\${APP_PORT};|g" "\${NGINX_CONF}"
    sudo nginx -t 2>/dev/null && sudo systemctl reload nginx 2>/dev/null
    printf "\${GREEN}FIXED\${NC}\n"
    FIXED=\$((FIXED + 1))
  else
    printf "\${YELLOW}⚠\${NC} could not verify (APP_PORT=\${APP_PORT}, nginx=\${NGINX_PORT})\n"
  fi
else
  printf "\${DIM}–\${NC} no nginx config (IP-based access?)\n"
fi

# ── 5. Container health ──
printf "  \${DIM}[5/7]\${NC} App container... "
APP_STATUS=\$(podman inspect --format '{{.State.Health.Status}}' "ems-app-\${COLLEGE_ID}" 2>/dev/null || echo "not_found")
if [ "\${APP_STATUS}" = "healthy" ]; then
  printf "\${GREEN}✔\${NC} healthy\n"
elif [ "\${APP_STATUS}" = "starting" ]; then
  printf "\${YELLOW}⚠\${NC} starting (wait for healthcheck)\n"
else
  printf "\${RED}✘\${NC} \${APP_STATUS}\n"
  ISSUES=\$((ISSUES + 1))
fi

# ── 6. Shared infrastructure ──
printf "  \${DIM}[6/7]\${NC} Shared infra... "
PG=\$(podman inspect --format '{{.State.Health.Status}}' postgres-ems 2>/dev/null || echo "down")
PGB=\$(podman inspect --format '{{.State.Health.Status}}' pgbouncer-ems 2>/dev/null || echo "down")
RD=\$(podman inspect --format '{{.State.Health.Status}}' redis-ems 2>/dev/null || echo "down")
if [ "\${PG}" = "healthy" ] && [ "\${PGB}" = "healthy" ] && [ "\${RD}" = "healthy" ]; then
  printf "\${GREEN}✔\${NC} PG+PgB+Redis all healthy\n"
else
  printf "\${YELLOW}⚠\${NC} PG=\${PG} PgB=\${PGB} Redis=\${RD}\n"
  ISSUES=\$((ISSUES + 1))
fi

# ── 7. Horizon ──
printf "  \${DIM}[7/7]\${NC} Horizon... "
HORIZON_STATUS=\$(podman inspect --format '{{.State.Health.Status}}' "ems-horizon-\${COLLEGE_ID}" 2>/dev/null || echo "not_found")
if [ "\${HORIZON_STATUS}" = "healthy" ]; then
  printf "\${GREEN}✔\${NC} healthy\n"
elif [ "\${HORIZON_STATUS}" = "starting" ]; then
  printf "\${YELLOW}⚠\${NC} starting\n"
else
  printf "\${RED}✘\${NC} \${HORIZON_STATUS}\n"
  ISSUES=\$((ISSUES + 1))
fi

# ── Summary ──
echo ""
if [ \${ISSUES} -eq 0 ] && [ \${FIXED} -eq 0 ]; then
  printf "  \${GREEN}All checks passed.  ✔\${NC}\n"
elif [ \${ISSUES} -eq 0 ] && [ \${FIXED} -gt 0 ]; then
  printf "  \${GREEN}All issues auto-fixed (\${FIXED} fixes applied).  ✔\${NC}\n"
else
  printf "  \${RED}\${ISSUES} issue(s) remaining.\${NC}"
  [ \${FIXED} -gt 0 ] && printf "  \${GREEN}\${FIXED} auto-fixed.\${NC}"
  printf "\n"
fi
DIAGEOF
}
