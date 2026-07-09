#!/bin/bash
# =============================================================================
# Tunnel Adminer or Grafana from VPS to localhost.
#
# Adminer mode (default):
#   1. Reads college .env for DB credentials
#   2. Starts SSH tunnel: local:8080 → VPS:8080 (Adminer)
#   3. Opens browser with server, username, database pre-filled
#   4. Prints the DB password for you to paste
#
# Grafana mode (--grafana):
#   1. Starts SSH tunnel: local:3000 → VPS:3000 (Grafana)
#   2. Opens browser to Grafana login page
#
# Usage:
#   ./infra/podman/scripts/adminer-tunnel-from-local.sh <college_id>
#   ./infra/podman/scripts/adminer-tunnel-from-local.sh --grafana
# =============================================================================
set -e

MODE="adminer"
COLLEGE_ID=""

# Parse args
if [ "${1:-}" = "--grafana" ]; then
  MODE="grafana"
elif [ -n "${1:-}" ]; then
  COLLEGE_ID="$1"
fi

if [ "$MODE" = "adminer" ] && [ -z "$COLLEGE_ID" ]; then
  echo "Usage:"
  echo "  Adminer:  $0 <college_id>"
  echo "  Grafana:  $0 --grafana"
  exit 1
fi

# Defaults (can be overridden by env vars from ems.sh)
VPS_HOST="${DEFAULT_HOST:-}"
VPS_PORT="${DEFAULT_PORT:-22}"
VPS_USER="${DEFAULT_USER:-deploy}"

if [ "$MODE" = "adminer" ]; then
  LOCAL_PORT="${ADMINER_LOCAL_PORT:-8080}"
  VPS_REMOTE_PORT="8080"
  LABEL="Adminer"
else
  LOCAL_PORT="${GRAFANA_LOCAL_PORT:-3000}"
  VPS_REMOTE_PORT="3000"
  LABEL="Grafana"
fi

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

  read -p "  Local port for ${LABEL} [${LOCAL_PORT}]: " _v
  [ -n "$_v" ] && LOCAL_PORT="$_v" || true
}

collect_inputs || { collect_inputs || exit 1; }

while true; do
  echo ""
  echo "  ┌─────────────────────────────────────┐"
  printf "  │       %-14s Tunnel Config    │\n" "${LABEL}"
  echo "  ├─────────────────────────────────────┤"
  if [ "$MODE" = "adminer" ]; then
    printf "  │  College:  %-24s │\n" "${COLLEGE_ID}"
  fi
  printf "  │  Target:   %-24s │\n" "${VPS_USER}@${VPS_HOST}:${VPS_PORT}"
  printf "  │  Local:    %-24s │\n" "http://127.0.0.1:${LOCAL_PORT}"
  echo "  └─────────────────────────────────────┘"
  echo ""
  read -p "  [y] start tunnel  [e] edit  [q] quit: " _choice
  case "$_choice" in
    y|Y) break ;;
    e|E) collect_inputs; continue ;;
    q|Q|n|N) echo "Aborted."; exit 0 ;;
    *) continue ;;
  esac
done

SSH_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)

# ── Ensure remote service is running (start if needed) ───────────────────────
# Prevents "Connection refused" and channel errors when tunnel is used.

ensure_remote_service() {
  local port="$1"
  local container="$2"
  echo "  Checking ${LABEL} on VPS (port ${port})..."
  if ssh "${SSH_OPTS[@]}" -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" \
    "curl -sf -o /dev/null --connect-timeout 2 http://127.0.0.1:${port}/ 2>/dev/null || (ss -tlnp 2>/dev/null | grep -q ':${port} ')" 2>/dev/null; then
    echo "  ${LABEL} is running."
    return 0
  fi
  echo "  ${LABEL} not responding. Starting ${container} on VPS..."
  if ! ssh "${SSH_OPTS[@]}" -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" \
    "cd /opt/ems 2>/dev/null && (command -v podman-compose &>/dev/null && podman-compose up -d ${container} || podman compose up -d ${container})" 2>/dev/null; then
    echo "  Error: Could not start ${container}. SSH in and run: cd /opt/ems && podman-compose up -d ${container}"
    exit 1
  fi
  echo "  Waiting for ${LABEL} to be ready..."
  for i in 1 2 3 4 5 6 7 8 9 10; do
    sleep 2
    if ssh "${SSH_OPTS[@]}" -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" \
      "curl -sf -o /dev/null --connect-timeout 2 http://127.0.0.1:${port}/ 2>/dev/null" 2>/dev/null; then
      echo "  ${LABEL} is ready."
      return 0
    fi
  done
  echo "  Error: ${LABEL} did not become ready. Check on VPS: podman logs ${container}"
  exit 1
}

if [ "$MODE" = "adminer" ]; then
  ensure_remote_service 8080 "ems-adminer"
else
  ensure_remote_service 3000 "ems-grafana"
fi

# ── Adminer: fetch college DB credentials from VPS ───────────────────────────

DB_PASSWORD=""
ADMINER_URL=""

if [ "$MODE" = "adminer" ]; then
  echo ""
  echo "  Fetching DB config for ${COLLEGE_ID} from VPS..."

  ENV_CONTENT=$(ssh "${SSH_OPTS[@]}" -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" \
    "cat /opt/ems/colleges/${COLLEGE_ID}/.env 2>/dev/null" || true)

  if [ -z "${ENV_CONTENT}" ]; then
    echo "  Error: Could not read /opt/ems/colleges/${COLLEGE_ID}/.env on VPS."
    exit 1
  fi

  DB_HOST=$(echo "${ENV_CONTENT}" | grep '^DB_HOST=' | cut -d= -f2- | tr -d '"' | tr -d "'")
  DB_PORT=$(echo "${ENV_CONTENT}" | grep '^DB_PORT=' | cut -d= -f2- | tr -d '"' | tr -d "'")
  DB_DATABASE=$(echo "${ENV_CONTENT}" | grep '^DB_DATABASE=' | cut -d= -f2- | tr -d '"' | tr -d "'")
  DB_USERNAME=$(echo "${ENV_CONTENT}" | grep '^DB_USERNAME=' | cut -d= -f2- | tr -d '"' | tr -d "'")
  DB_PASSWORD=$(echo "${ENV_CONTENT}" | grep '^DB_PASSWORD=' | cut -d= -f2- | tr -d '"' | tr -d "'")

  if [ -z "${DB_HOST}" ] || [ -z "${DB_USERNAME}" ] || [ -z "${DB_DATABASE}" ]; then
    echo "  Error: DB_HOST, DB_USERNAME or DB_DATABASE not found in college .env"
    exit 1
  fi

  DB_PORT=${DB_PORT:-6432}
  SERVER_STRING="${DB_HOST}:${DB_PORT}"
  ADMINER_URL="http://127.0.0.1:${LOCAL_PORT}/?pgsql=${SERVER_STRING}&username=${DB_USERNAME}&db=${DB_DATABASE}"
fi

# ── Start SSH tunnel in background ───────────────────────────────────────────

echo ""
echo "  Starting SSH tunnel: 127.0.0.1:${LOCAL_PORT} → ${VPS_HOST}:${VPS_REMOTE_PORT}"

# Kill any existing tunnel on the same local port
lsof -ti ":${LOCAL_PORT}" 2>/dev/null | xargs kill -9 2>/dev/null || true

# Stderr to /dev/null to avoid "channel 2: open failed" noise (service already verified above)
ssh -N "${SSH_OPTS[@]}" -p "${VPS_PORT}" \
  -L "${LOCAL_PORT}:127.0.0.1:${VPS_REMOTE_PORT}" \
  "${VPS_USER}@${VPS_HOST}" 2>/dev/null &
TUNNEL_PID=$!

sleep 2
if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
  echo "  Error: Tunnel failed. Is port ${LOCAL_PORT} already in use?"
  exit 1
fi
echo "  Tunnel is running (keep this terminal open)."

cleanup() {
  echo ""
  echo "  Closing tunnel..."
  kill "$TUNNEL_PID" 2>/dev/null || true
  echo "  Done."
  exit 0
}
trap cleanup INT TERM

# ── Open browser ─────────────────────────────────────────────────────────────

if [ "$MODE" = "adminer" ]; then
  OPEN_URL="${ADMINER_URL}"
else
  OPEN_URL="http://127.0.0.1:${LOCAL_PORT}"
fi

echo ""
echo "  Opening ${LABEL} in browser..."
echo ""

if command -v open >/dev/null 2>&1; then
  open "${OPEN_URL}"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "${OPEN_URL}"
else
  echo "  Open this URL in your browser:"
  echo "  ${OPEN_URL}"
  echo ""
fi

if [ "$MODE" = "adminer" ]; then
  echo "  ┌─────────────────────────────────────────────────────────┐"
  echo "  │  Keep this terminal open. Paste this password in Adminer:│"
  echo "  ├─────────────────────────────────────────────────────────┤"
  echo ""
  echo "  ${DB_PASSWORD}"
  echo ""
  echo "  └─────────────────────────────────────────────────────────┘"
  echo ""
  echo "  Connection: ${DB_USERNAME} @ ${DB_HOST}:${DB_PORT} / ${DB_DATABASE}"
else
  echo "  ┌─────────────────────────────────────────────────────────┐"
  echo "  │  Grafana is open. Use your Grafana admin credentials.   │"
  echo "  │  Default: admin / (GF_SECURITY_ADMIN_PASSWORD from .env)│"
  echo "  └─────────────────────────────────────────────────────────┘"
fi

echo ""
echo "  Press Enter when done to close the tunnel..."
read -r _

cleanup
