#!/bin/bash
# =============================================================================
# Add or update GHCR credentials on the VPS.
# Use this when: first-time setup, or token expired / unauthorized on deploy.
# After this, local-deploy.sh uses /opt/ems/.ghcr automatically (no prompts).
#
# Creates/overwrites /opt/ems/.ghcr on the VPS (chmod 600).
# From ems.sh: option 9 (Configure GHCR). Or run this script directly.
# =============================================================================
set -e

VPS_HOST="${DEFAULT_HOST:-}"
VPS_PORT="${DEFAULT_PORT:-22}"
VPS_USER="${DEFAULT_USER:-deploy}"
GHCR_USER=""
GHCR_TOKEN=""

collect_inputs() {
  echo ""
  read -p "  VPS Host [${VPS_HOST}]: " _v
  [ -n "$_v" ] && VPS_HOST="$_v" || true
  if [ -z "${VPS_HOST}" ]; then echo "  Error: VPS Host is required."; return 1; fi

  read -p "  SSH Port [${VPS_PORT}]: " _v
  [ -n "$_v" ] && VPS_PORT="$_v" || true

  read -p "  SSH User [${VPS_USER}]: " _v
  [ -n "$_v" ] && VPS_USER="$_v" || true

  read -p "  GHCR username (e.g. sutracodehq-ui): " _v
  [ -n "$_v" ] && GHCR_USER="$_v" || true
  if [ -z "${GHCR_USER}" ]; then echo "  Error: GHCR username is required."; return 1; fi

  read -sp "  GHCR token (PAT with read:packages): " GHCR_TOKEN
  echo ""
  if [ -z "${GHCR_TOKEN}" ]; then echo "  Error: GHCR token is required."; return 1; fi
}

collect_inputs || { collect_inputs || exit 1; }

echo ""
echo "  Will store GHCR credentials on ${VPS_USER}@${VPS_HOST}:${VPS_PORT}"
echo "  File: /opt/ems/.ghcr (used by deploy; run again if token expires)"
echo ""
read -p "  Continue? [y/N]: " _c
if [[ "$_c" != "y" && "$_c" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

# Script must come from stdin (heredoc); token passed as base64 arg so it isn't executed as script
TOKEN_B64="$(echo -n "${GHCR_TOKEN}" | base64)"
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new -p "${VPS_PORT}" "${VPS_USER}@${VPS_HOST}" bash -s "${GHCR_USER}" "${TOKEN_B64}" << 'REMOTE'
set -e
GHCR_USER="$1"
GHCR_TOKEN_B64="$2"
GHCR_TOKEN="$(echo "${GHCR_TOKEN_B64}" | base64 -d)"
CMS_DIR="/opt/ems"
CRED_FILE="${CMS_DIR}/.ghcr"
if [ ! -d "${CMS_DIR}" ]; then
  echo "ERROR: ${CMS_DIR} not found. Run CMS Setup first (vps-setup-from-local.sh)."
  exit 1
fi
mkdir -p "${CMS_DIR}"
printf "GHCR_USER=%s\nGHCR_TOKEN=%s\n" "${GHCR_USER}" "${GHCR_TOKEN}" > "${CRED_FILE}"
chmod 600 "${CRED_FILE}"
echo "  Stored credentials in ${CRED_FILE}"
echo "  Done. Deploy will use these; re-run this (ems.sh → option 9) if token expires."
REMOTE

echo ""
echo "  GHCR credentials saved. Use ems.sh → option 9 again if your token expires."
echo ""
