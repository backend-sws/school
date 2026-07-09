#!/bin/bash
# =============================================================================
# Manage .env.secret on VPS
# Decrypts, lets you view/add/update/remove keys, re-encrypts.
#
# Usage: ./infra/podman/scripts/manage-secrets.sh [user@host] [college_id] [ssh_port]
# =============================================================================
set -e

VPS_TARGET="${1:-}"
COLLEGE_ID="${2:-}"
SSH_PORT="${3:-22}"
CMS_ROOT="${CMS_ROOT:-/opt/ems}"

# ── Collect inputs ───────────────────────────────────────────────────────────

if [ -z "${VPS_TARGET}" ]; then
  read -p "  user@host: " VPS_TARGET
  [ -z "${VPS_TARGET}" ] && echo "Error: user@host required." && exit 1
fi
if [ -z "${COLLEGE_ID}" ]; then
  read -p "  College ID: " COLLEGE_ID
  [ -z "${COLLEGE_ID}" ] && echo "Error: College ID required." && exit 1
fi
read -p "  SSH port [${SSH_PORT}]: " _v
[ -n "$_v" ] && SSH_PORT="$_v"

SSH_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)
REMOTE_DIR="${CMS_ROOT}/colleges/${COLLEGE_ID}"
ENC_FILE="${REMOTE_DIR}/.env.secret.enc"
KEY_FILE="${REMOTE_DIR}/.env.secret.key"
TMP_SECRET="/tmp/.env.secret.${COLLEGE_ID}.$$"

echo ""
echo "  ┌─────────────────────────────────┐"
echo "  │     Manage Secrets              │"
printf "  │  VPS:     %-21s │\n" "${VPS_TARGET}:${SSH_PORT}"
printf "  │  College: %-21s │\n" "${COLLEGE_ID}"
echo "  └─────────────────────────────────┘"
echo ""

# ── Decrypt on VPS ───────────────────────────────────────────────────────────

echo "  Decrypting .env.secret on VPS..."
ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
set -e
if [ ! -f "${ENC_FILE}" ] || [ ! -f "${KEY_FILE}" ]; then
  echo "ERROR: ${ENC_FILE} or ${KEY_FILE} not found."
  echo "Run add-college first to bootstrap secrets."
  exit 1
fi
sudo openssl enc -aes-256-cbc -d -pbkdf2 \
  -in "${ENC_FILE}" -out "${TMP_SECRET}" \
  -pass "file:${KEY_FILE}"
sudo chmod 600 "${TMP_SECRET}"
echo "  Decrypted."
REOF

# ── Show current keys (values masked) ────────────────────────────────────────

echo ""
echo "  Current keys in .env.secret:"
echo "  ───────────────────────────────"
ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
  "sudo grep -v '^#' ${TMP_SECRET} | grep '=' | sed 's/=.*/=********/'"
echo "  ───────────────────────────────"

# ── Interactive menu ─────────────────────────────────────────────────────────

CHANGED=false

while true; do
  echo ""
  echo "  [a] Add/update key"
  echo "  [d] Delete key"
  echo "  [v] View a key value"
  echo "  [l] List all keys"
  echo "  [s] Save & encrypt"
  echo "  [q] Quit (discard changes)"
  echo ""
  read -p "  Action: " ACTION

  case "$ACTION" in
    a|A)
      read -p "  Key name (e.g. MAIL_PASSWORD): " KEY_NAME
      [ -z "${KEY_NAME}" ] && echo "  Skipped." && continue
      # Check if it's a DB-related key
      if echo "${KEY_NAME}" | grep -qiE '^(DB_PASSWORD|POSTGRES_PASSWORD|BACKUP_PASSWORD)$'; then
        echo "  ⚠ ${KEY_NAME} is auto-generated and should not be manually set."
        read -p "  Override anyway? [y/N]: " _override
        [[ "$_override" != "y" && "$_override" != "Y" ]] && continue
      fi
      read -sp "  Value (hidden): " KEY_VALUE
      echo ""
      ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
# Remove existing key if present, then append
sudo sed -i "/^${KEY_NAME}=/d" "${TMP_SECRET}"
echo "${KEY_NAME}=${KEY_VALUE}" | sudo tee -a "${TMP_SECRET}" > /dev/null
REOF
      echo "  ✔ ${KEY_NAME} set."
      CHANGED=true
      ;;

    d|D)
      read -p "  Key to delete: " KEY_NAME
      [ -z "${KEY_NAME}" ] && continue
      if echo "${KEY_NAME}" | grep -qiE '^(DB_PASSWORD|POSTGRES_PASSWORD|BACKUP_PASSWORD)$'; then
        echo "  ✘ Cannot delete DB credentials."
        continue
      fi
      ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
        "sudo sed -i '/^${KEY_NAME}=/d' '${TMP_SECRET}'"
      echo "  ✔ ${KEY_NAME} deleted."
      CHANGED=true
      ;;

    v|V)
      read -p "  Key to view: " KEY_NAME
      ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
        "sudo grep '^${KEY_NAME}=' '${TMP_SECRET}' || echo '  (not found)'"
      ;;

    l|L)
      echo ""
      ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
        "sudo grep -v '^#' ${TMP_SECRET} | grep '=' | sed 's/=.*/=********/'"
      ;;

    s|S)
      echo ""
      echo "  Encrypting and saving..."
      ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" bash -s <<REOF
set -e
sudo openssl enc -aes-256-cbc -salt -pbkdf2 \
  -in "${TMP_SECRET}" -out "${ENC_FILE}" \
  -pass "file:${KEY_FILE}"
sudo chmod 600 "${ENC_FILE}"
sudo rm -f "${TMP_SECRET}"
echo "  ✔ Encrypted and saved. Plaintext removed."
REOF
      echo ""
      echo "  Done. Changes saved."
      exit 0
      ;;

    q|Q)
      echo "  Cleaning up (discarding changes)..."
      ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${VPS_TARGET}" \
        "sudo rm -f '${TMP_SECRET}'"
      echo "  Discarded."
      exit 0
      ;;

    *) echo "  Invalid option." ;;
  esac
done
