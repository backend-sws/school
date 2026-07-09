#!/bin/bash
# =============================================================================
# Deploy from local machine to VPS via SSH
#
# Flow:
#   0. Sync .env (whitelist-based) + PgBouncer config
#   1. GHCR login
#   2. Pull image
#   3. Blue-green canary (app only, temp port)
#   4. Graceful Horizon terminate
#   5. Compose swap (all services: app + reverb + horizon)
#   6. Migrate + post-deploy verification
#
# Usage: ./local-deploy.sh <college_id>
# Example: ./local-deploy.sh pdseducation
# =============================================================================
set -e

COLLEGE_ID=${1:?Usage: local-deploy.sh <college_id>}
IMAGE="ghcr.io/sutracodehq-ui/education-system-management"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source shared helpers (single source of truth for env sync, health, nginx, pgbouncer)
source "${SCRIPT_DIR}/lib/deploy-helpers.sh"

# Exit code 2 = GHCR not configured or login failed (so we can offer to run Configure GHCR)
EXIT_GHCR=2

# Defaults (can be overridden by env vars from ems.sh)
VPS_HOST="${DEFAULT_HOST:-}"
VPS_PORT="${DEFAULT_PORT:-22}"
VPS_USER="${DEFAULT_USER:-deploy}"
# Read tag from college .env if available (so you don't re-type it)
_ENV_FILE="${SCRIPT_DIR}/../colleges/${COLLEGE_ID}/.env"
_ENV_TAG=""
[ -f "${_ENV_FILE}" ] && _ENV_TAG=$(grep '^CMS_IMAGE_TAG=' "${_ENV_FILE}" 2>/dev/null | cut -d= -f2- | tr -d '\r' | xargs)
IMAGE_TAG="${_ENV_TAG:-${COLLEGE_ID}-latest}"

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

  read -p "  Image Tag [${IMAGE_TAG}]: " _v
  [ -n "$_v" ] && IMAGE_TAG="$_v" || true
}

collect_inputs || { collect_inputs || exit 1; }

while true; do
  echo ""
  echo "  ┌──────────────────────────────────────────────┐"
  echo "  │           Deploy Config                      │"
  echo "  ├──────────────────────────────────────────────┤"
  printf "  │  College:  %-33s │\n" "${COLLEGE_ID}"
  printf "  │  Image:    %-33s │\n" "${IMAGE_TAG}"
  printf "  │  Target:   %-33s │\n" "${VPS_USER}@${VPS_HOST}:${VPS_PORT}"
  echo "  │  GHCR:     (from VPS one-time setup)        │"
  echo "  │                                              │"
  echo "  │  sync → pull → canary → compose → verify    │"
  echo "  └──────────────────────────────────────────────┘"
  echo ""
  read -p "  [y] deploy  [e] edit  [q] quit: " _choice
  case "$_choice" in
    y|Y) break ;;
    e|E) collect_inputs; continue ;;
    q|Q|n|N) echo "Aborted."; exit 0 ;;
    *) continue ;;
  esac
done

echo ""
echo "=== Deploying ${COLLEGE_ID} with ${IMAGE_TAG} ==="
echo ""

# =============================================================================
# [0/7] Pre-flight: Sync .env + compose + ensure PgBouncer
# =============================================================================
# Uses shared helpers — single source of truth for env sync.

LOCAL_ENV="${SCRIPT_DIR}/../colleges/${COLLEGE_ID}/.env"
if [ -f "${LOCAL_ENV}" ]; then
  echo "[0/7] Syncing .env from local to VPS..."
  sync_env_to_vps "${COLLEGE_ID}" "${LOCAL_ENV}" "${VPS_USER}@${VPS_HOST}" "${VPS_PORT}"
fi

# Sync college-specific podman-compose.yml
LOCAL_COMPOSE="${SCRIPT_DIR}/../colleges/${COLLEGE_ID}/podman-compose.yml"
if [ -f "${LOCAL_COMPOSE}" ]; then
  echo "  Syncing podman-compose.yml..."
  scp -o StrictHostKeyChecking=accept-new -P "${VPS_PORT}" \
    "${LOCAL_COMPOSE}" "${VPS_USER}@${VPS_HOST}:/opt/ems/colleges/${COLLEGE_ID}/podman-compose.yml"
fi

# Ensure PgBouncer has an entry for this college (idempotent, auto-creates if missing)
echo "  Ensuring PgBouncer entry..."
ensure_pgbouncer_entry "${COLLEGE_ID}" "${VPS_USER}@${VPS_HOST}" "${VPS_PORT}"

# =============================================================================
# Deploy on VPS (single SSH session)
# =============================================================================

set +e
ssh -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" bash -s <<EOF
set -e
cd /opt/ems

COLLEGE_ID="${COLLEGE_ID}"
IMAGE_TAG="${IMAGE_TAG}"
IMAGE="${IMAGE}"
COLLEGE_LATEST="\${COLLEGE_ID}-latest"
ENV_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env"
SECRET_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env.secret"
COMPOSE_DIR="/opt/ems/colleges/\${COLLEGE_ID}"

if [ ! -f "\${ENV_FILE}" ]; then
  echo "ERROR: \${ENV_FILE} not found."
  exit 1
fi

# Decrypt .env.secret if only encrypted version exists
ENC_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env.secret.enc"
KEY_FILE="/opt/ems/colleges/\${COLLEGE_ID}/.env.secret.key"
if [ ! -f "\${SECRET_FILE}" ] && [ -f "\${ENC_FILE}" ] && [ -f "\${KEY_FILE}" ]; then
  echo "  Decrypting .env.secret..."
  openssl enc -aes-256-cbc -d -pbkdf2 \
    -in "\${ENC_FILE}" -out "\${SECRET_FILE}" \
    -pass "file:\${KEY_FILE}"
  chmod 600 "\${SECRET_FILE}"
  echo "  ✔ .env.secret decrypted"
fi

# ── Save current tag for rollback ──
CURRENT_TAG=\$(grep '^CMS_IMAGE_TAG=' "\${ENV_FILE}" 2>/dev/null | cut -d= -f2- | tr -d '\r' | xargs)
if [ -n "\${CURRENT_TAG}" ]; then
  echo "\${CURRENT_TAG}" > "\${COMPOSE_DIR}/.last-good-tag"
  echo "  Rollback tag saved: \${CURRENT_TAG}"
fi

# ── Update image tag in .env ──
grep -q "^CMS_IMAGE_TAG=" "\${ENV_FILE}" && sed -i "s|^CMS_IMAGE_TAG=.*|CMS_IMAGE_TAG=\${IMAGE_TAG}|" "\${ENV_FILE}" || echo "CMS_IMAGE_TAG=\${IMAGE_TAG}" >> "\${ENV_FILE}"

APP_PORT=\$(grep "^APP_PORT=" "\${ENV_FILE}" 2>/dev/null | cut -d= -f2- | tr -d '\r' | xargs)
if [ -z "\${APP_PORT}" ]; then
  echo "ERROR: APP_PORT not found in \${ENV_FILE}"
  exit 1
fi

# ── Sanitize .env ──
APP_NAME_RAW=\$(grep "^APP_NAME=" "\${ENV_FILE}" | cut -d= -f2-)
if echo "\${APP_NAME_RAW}" | grep -q '[[:space:]]'; then
  CLEAN_NAME=\$(echo "\${APP_NAME_RAW}" | sed 's/"//g;s/[[:space:]]//g')
  sed -i "s/^APP_NAME=.*/APP_NAME=\${CLEAN_NAME}/" "\${ENV_FILE}"
  echo "  Fixed APP_NAME: removed spaces"
fi
MAIL_CHECK=\$(grep 'MAIL_FROM_NAME=' "\${ENV_FILE}" 2>/dev/null | grep -c 'APP_NAME' || true)
if [ "\${MAIL_CHECK}" -gt 0 ]; then
  RESOLVED=\$(grep "^APP_NAME=" "\${ENV_FILE}" | cut -d= -f2- | sed 's/"//g;s/[[:space:]]//g')
  sed -i "s/^MAIL_FROM_NAME=.*/MAIL_FROM_NAME=\${RESOLVED}/" "\${ENV_FILE}"
  echo "  Fixed MAIL_FROM_NAME"
fi

# ── Aggressive orphan cleanup: free the configured port ──
if ss -tlnp sport = :\${APP_PORT} 2>/dev/null | grep -q LISTEN; then
  echo "  ⚠ Port \${APP_PORT} is occupied — running orphan cleanup..."

  PORT_CONTAINERS=\$(podman ps -a --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep ":\${APP_PORT}->" | awk '{print \$1}' || true)
  if [ -n "\${PORT_CONTAINERS}" ]; then
    for _ctr in \${PORT_CONTAINERS}; do
      podman stop -t 3 "\${_ctr}" 2>/dev/null || true
      podman rm -f "\${_ctr}" 2>/dev/null || true
    done
    sleep 2
  fi

  pkill -9 -u \$(id -u) -f 'rootlessport' 2>/dev/null || true
  pkill -9 -u \$(id -u) -f 'conmon' 2>/dev/null || true
  sleep 2

  rm -rf /run/user/\$(id -u)/containers/*/userdata/shm 2>/dev/null || true
  podman system prune -f 2>/dev/null || true
  sleep 1

  if ss -tlnp sport = :\${APP_PORT} 2>/dev/null | grep -q LISTEN; then
    echo ""
    echo "  ╔═════════════════════════════════════════════════════════════╗"
    echo "  ║  ERROR: Port \${APP_PORT} has an orphaned kernel socket.     ║"
    echo "  ║  SOLUTION: Ask your VPS provider to reboot the server.    ║"
    echo "  ╚═════════════════════════════════════════════════════════════╝"
    exit 1
  fi
  echo "  ✔ Port \${APP_PORT} freed successfully"
fi

# ── [1/7] GHCR login ──
CRED_FILE="/opt/ems/.ghcr"
if [ ! -f "\${CRED_FILE}" ]; then
  echo "ERROR: GHCR not configured. Run ems.sh → option 9 (Configure GHCR)."
  exit ${EXIT_GHCR}
fi
source "\${CRED_FILE}"
if [ -z "\${GHCR_USER}" ] || [ -z "\${GHCR_TOKEN}" ]; then
  echo "ERROR: \${CRED_FILE} must define GHCR_USER and GHCR_TOKEN."
  exit ${EXIT_GHCR}
fi
echo "[1/7] Logging in to GHCR..."
if ! echo "\${GHCR_TOKEN}" | podman login ghcr.io -u "\${GHCR_USER}" --password-stdin 2>/dev/null; then
  echo "ERROR: GHCR login failed (token expired or invalid). Run ems.sh → option 9."
  exit ${EXIT_GHCR}
fi
echo "  Logged in"

# ── [2/7] Pull image ──
echo "[2/7] Pulling image..."
podman pull "\${IMAGE}:\${IMAGE_TAG}"
podman tag "\${IMAGE}:\${IMAGE_TAG}" "\${IMAGE}:\${COLLEGE_LATEST}"
echo "  Done"

# ── [3/7] Blue-green canary (app only, temp port) ──
TEMP_PORT=\$(( APP_PORT + 1000 ))
echo "[3/7] Starting canary on temp port \${TEMP_PORT}..."
podman rm -f "ems-app-\${COLLEGE_ID}-new" 2>/dev/null || true

ENV_FLAGS="--env-file \${ENV_FILE}"
[ -f "\${SECRET_FILE}" ] && ENV_FLAGS="\${ENV_FLAGS} --env-file \${SECRET_FILE}"

podman run -d \\
  --name "ems-app-\${COLLEGE_ID}-new" \\
  \${ENV_FLAGS} \\
  --net "ems-network" \\
  -p "0.0.0.0:\${TEMP_PORT}:80" \\
  --restart no \\
  --label "college.id=\${COLLEGE_ID}" \\
  --label "college.service=app-canary" \\
  --healthcheck-command "curl -f http://localhost:80/" \\
  --healthcheck-interval 10s \\
  --healthcheck-timeout 5s \\
  --healthcheck-start-period 30s \\
  --healthcheck-retries 3 \\
  "\${IMAGE}:\${IMAGE_TAG}"
echo "  Canary started"

# ── [4/7] Health check canary ──
echo "[4/7] Health-checking canary (temp port \${TEMP_PORT})..."
sleep 15
READY=false
for i in \$(seq 1 12); do
  if curl -sf "http://127.0.0.1:\${TEMP_PORT}/" > /dev/null 2>&1; then
    echo "  Canary is healthy."
    READY=true
    break
  fi
  STATUS=\$(podman inspect --format '{{.State.Status}}' "ems-app-\${COLLEGE_ID}-new" 2>/dev/null || echo "not found")
  echo "  attempt \$i/12... (container: \$STATUS)"
  if [ "\$STATUS" = "exited" ] || [ "\$STATUS" = "stopped" ] || [ "\$STATUS" = "dead" ] || [ "\$STATUS" = "not found" ]; then
    echo "  Canary failed to start. Logs:"
    podman logs --tail 50 "ems-app-\${COLLEGE_ID}-new" 2>&1 || true
    podman rm -f "ems-app-\${COLLEGE_ID}-new" 2>/dev/null || true
    echo ""
    echo "  OLD container is still running — no downtime."
    echo "  Fix the error above, then re-run Deploy."
    exit 1
  fi
  sleep 5
done

if [ "\$READY" != "true" ]; then
  echo "  Canary did not become ready. Logs:"
  podman logs --tail 50 "ems-app-\${COLLEGE_ID}-new" 2>&1 || true
  podman rm -f "ems-app-\${COLLEGE_ID}-new" 2>/dev/null || true
  echo ""
  echo "  OLD container is still running — no downtime."
  exit 1
fi

# Remove canary (it passed, we'll use compose to start real containers)
podman stop -t 5 "ems-app-\${COLLEGE_ID}-new" 2>/dev/null || true
podman rm -f "ems-app-\${COLLEGE_ID}-new" 2>/dev/null || true

# ── [5/7] Migrate on canary (if canary is healthy, code is valid) ──
echo "[5/7] Running migrations on new image..."
# Run migrations in a disposable container with new image
podman run --rm \\
  \${ENV_FLAGS} \\
  --net "ems-network" \\
  "\${IMAGE}:\${IMAGE_TAG}" \\
  sh -c "php artisan migrate --force 2>&1"
echo "  Migrations done"

# ── [6/7] Compose swap (all services) ──
echo "[6/7] Swapping: graceful Horizon terminate → compose down → up..."
# Gracefully terminate Horizon first (finish current jobs)
podman exec "ems-horizon-\${COLLEGE_ID}" php artisan horizon:terminate 2>/dev/null || true
sleep 3

# Stop ALL old containers and start ALL new ones via compose
cd "\${COMPOSE_DIR}"
podman-compose down 2>/dev/null || true
# Also clean up any init containers from previous deploys
podman rm -f "ems-init-\${COLLEGE_ID}" 2>/dev/null || true
podman-compose up -d
echo "  All services started (app + reverb + horizon)"

# ── [7/7] Post-deploy verification ──
echo "[7/7] Post-deploy verification..."
sleep 10

if curl -sf "http://127.0.0.1:\${APP_PORT}/" > /dev/null 2>&1; then
  echo "  ✔ App is live on port \${APP_PORT}"
else
  echo "  ⚠ App not responding yet (may still be booting)"
fi

podman exec "ems-app-\${COLLEGE_ID}" php artisan config:cache 2>/dev/null && echo "  ✔ Config cached" || echo "  ⚠ Config cache failed"
podman exec "ems-app-\${COLLEGE_ID}" php artisan tinker --execute="DB::select('SELECT 1'); echo 'DB OK';" 2>/dev/null && echo "  ✔ DB connectivity OK" || echo "  ⚠ DB check failed"

HORIZON_STATUS=\$(podman exec "ems-horizon-\${COLLEGE_ID}" php artisan horizon:status 2>/dev/null || echo "not running")
echo "  Horizon: \${HORIZON_STATUS}"

echo ""
echo "=== Deploy complete: \${COLLEGE_ID} \${IMAGE_TAG} ==="
echo "=== Rollback tag: \$(cat \${COMPOSE_DIR}/.last-good-tag 2>/dev/null || echo 'none') ==="
EOF
DEPLOY_RC=$?
set -e

# ── Post-deploy: ensure Nginx port matches (runs locally, not inside heredoc) ──
if [ "$DEPLOY_RC" -eq 0 ]; then
  echo "  Verifying Nginx port alignment..."
  ensure_nginx_port "${COLLEGE_ID}" "${VPS_USER}@${VPS_HOST}" "${VPS_PORT}"
fi

if [ "$DEPLOY_RC" -eq "$EXIT_GHCR" ]; then
  echo ""
  read -p "  Run Configure GHCR now? [y/N]: " _run
  if [[ "$_run" == "y" || "$_run" == "Y" ]]; then
    export DEFAULT_HOST="${VPS_HOST}"
    export DEFAULT_PORT="${VPS_PORT}"
    export DEFAULT_USER="${VPS_USER}"
    "${SCRIPT_DIR}/configure-ghcr-from-local.sh"
    echo ""
    echo "  Re-run Deploy (option 4) when ready."
  fi
  exit 1
fi

if [ "$DEPLOY_RC" -ne 0 ]; then
  exit "$DEPLOY_RC"
fi

echo ""
echo "=== Done ==="
