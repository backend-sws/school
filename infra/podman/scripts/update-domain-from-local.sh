#!/bin/bash
# =============================================================================
# Add or update the domain for a college on the VPS.
#
# What it does:
#   1. Updates Nginx server_name to the new domain
#   2. Optionally runs certbot for SSL (Let's Encrypt)
#   3. Optionally updates APP_URL in the college's .env
#
# Usage (from repo root):
#   ./infra/podman/scripts/update-domain-from-local.sh <college_id>
#   ./infra/podman/scripts/update-domain-from-local.sh ptjmrajgir
# =============================================================================
set -e

COLLEGE_ID=${1:?"Usage: update-domain-from-local.sh <college_id>"}

# Defaults (can be overridden by env vars from ems.sh)
VPS_HOST="${DEFAULT_HOST:-}"
VPS_PORT="${DEFAULT_PORT:-22}"
VPS_USER="${DEFAULT_USER:-deploy}"
DOMAIN=""
SETUP_SSL="y"

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

  read -p "  Domain (e.g. ptjmcollegerajgir.com) [${DOMAIN}]: " _v
  [ -n "$_v" ] && DOMAIN="$_v" || true
  if [ -z "${DOMAIN}" ]; then echo "  Error: Domain is required."; return 1; fi

  read -p "  Setup SSL with certbot? [${SETUP_SSL}] (y/n): " _v
  [ -n "$_v" ] && SETUP_SSL="$_v" || true
}

collect_inputs || { collect_inputs || exit 1; }

while true; do
  echo ""
  echo "  ┌─────────────────────────────────────┐"
  echo "  │       Update Domain Config           │"
  echo "  ├─────────────────────────────────────┤"
  printf "  │  College:  %-24s │\n" "${COLLEGE_ID}"
  printf "  │  Domain:   %-24s │\n" "${DOMAIN}"
  printf "  │  SSL:      %-24s │\n" "${SETUP_SSL}"
  printf "  │  Target:   %-24s │\n" "${VPS_USER}@${VPS_HOST}:${VPS_PORT}"
  echo "  │                                     │"
  echo "  │  Will update Nginx + .env APP_URL    │"
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
SSH_CMD="ssh ${SSH_OPTS[*]} -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST}"

# ── Step 1: Get current APP_PORT from college .env ───────────────────────────

echo ""
echo "[1/4] Reading college config from VPS..."
APP_PORT=$(${SSH_CMD} bash -s << GETPORT
ENV_FILE="/opt/ems/colleges/${COLLEGE_ID}/.env"
if [ ! -f "\${ENV_FILE}" ]; then
  echo "ERROR" >&2
  exit 1
fi
grep "^APP_PORT=" "\${ENV_FILE}" | cut -d= -f2
GETPORT
)

if [ -z "${APP_PORT}" ] || [ "${APP_PORT}" = "ERROR" ]; then
  echo "  Error: Could not read APP_PORT from /opt/ems/colleges/${COLLEGE_ID}/.env"
  echo "  Make sure the college exists on the VPS."
  exit 1
fi
echo "  College: ${COLLEGE_ID}, APP_PORT: ${APP_PORT}"

# ── Step 2: Update Nginx config ─────────────────────────────────────────────

echo ""
echo "[2/4] Updating Nginx config for ${COLLEGE_ID} → ${DOMAIN}..."

# Read multi-institution mode from VPS .env
MULTI_INST=$(${SSH_CMD} "grep '^EMS_MULTI_INSTITUTION_MODE=' /opt/ems/colleges/${COLLEGE_ID}/.env 2>/dev/null | cut -d= -f2-" || echo "false")

# Generate nginx config locally using shared lib
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/lib/deploy-helpers.sh"
TMP_NGINX=$(mktemp)
generate_nginx_conf "${COLLEGE_ID}" "${DOMAIN}" "${APP_PORT}" "${MULTI_INST}" > "${TMP_NGINX}"

# Upload and apply
scp ${SSH_OPTS[*]} -P ${VPS_PORT} "${TMP_NGINX}" "${VPS_USER}@${VPS_HOST}:/tmp/ems-${COLLEGE_ID}.nginx.conf"
rm -f "${TMP_NGINX}"

${SSH_CMD} bash -s << NGINX_APPLY
set -e
NGINX_CONF="/etc/nginx/sites-available/ems-${COLLEGE_ID}"
sudo cp /tmp/ems-${COLLEGE_ID}.nginx.conf \${NGINX_CONF}
rm -f /tmp/ems-${COLLEGE_ID}.nginx.conf
sudo ln -sf \${NGINX_CONF} /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
echo "  Nginx updated: server_name = ${DOMAIN}"
NGINX_APPLY

# ── Step 3: Setup SSL (optional) ─────────────────────────────────────────────

if [[ "${SETUP_SSL}" == "y" || "${SETUP_SSL}" == "Y" ]]; then
  echo ""
  echo "[3/4] Setting up SSL with certbot for ${DOMAIN}..."
  echo "  Make sure DNS A record for ${DOMAIN} points to ${VPS_HOST}"
  echo ""
  read -p "  >> DNS is configured and propagated? [y/q]: " _c
  if [[ "$_c" != "y" && "$_c" != "Y" ]]; then
    echo "  Skipping SSL. You can run certbot manually later:"
    echo "    sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
  else
    ${SSH_CMD} bash -s << SSL_SETUP
set -e

# Install certbot if not present
if ! command -v certbot &>/dev/null; then
  echo "  Installing certbot..."
  sudo apt-get update -qq
  sudo apt-get install -y -qq certbot python3-certbot-nginx > /dev/null 2>&1
fi

# Run certbot
sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --redirect --email admin@${DOMAIN} || {
  echo ""
  echo "  Certbot failed. Common issues:"
  echo "    - DNS not pointing to this server yet"
  echo "    - Port 80 not accessible from internet"
  echo "  Run manually: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
}
SSL_SETUP
  fi
else
  echo ""
  echo "[3/4] Skipping SSL (not requested)."
fi

# ── Step 4: Update APP_URL in .env ───────────────────────────────────────────

echo ""
echo "[4/4] Updating APP_URL in college .env..."

PROTOCOL="https"
if [[ "${SETUP_SSL}" != "y" && "${SETUP_SSL}" != "Y" ]]; then
  PROTOCOL="http"
fi

${SSH_CMD} bash -s << ENV_UPDATE
set -e
ENV_FILE="/opt/ems/colleges/${COLLEGE_ID}/.env"

# Update or add APP_URL
if grep -q "^APP_URL=" "\${ENV_FILE}"; then
  sed -i "s|^APP_URL=.*|APP_URL=${PROTOCOL}://${DOMAIN}|" "\${ENV_FILE}"
else
  echo "APP_URL=${PROTOCOL}://${DOMAIN}" >> "\${ENV_FILE}"
fi
echo "  APP_URL=${PROTOCOL}://${DOMAIN}"

# Clear Laravel config cache if app is running
if podman inspect "ems-app-${COLLEGE_ID}" --format '{{.State.Status}}' 2>/dev/null | grep -q running; then
  podman exec "ems-app-${COLLEGE_ID}" php artisan config:clear 2>/dev/null || true
  echo "  Config cache cleared"
fi
ENV_UPDATE

echo ""
echo "=== Domain updated: ${COLLEGE_ID} → ${DOMAIN} ==="
echo ""
if [[ "${SETUP_SSL}" == "y" || "${SETUP_SSL}" == "Y" ]]; then
  echo "  URL: https://${DOMAIN}"
else
  echo "  URL: http://${DOMAIN}"
  echo "  To add SSL later: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi
echo ""
