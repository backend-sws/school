#!/bin/bash
#
# Velero Installation Script for Education Management System
# Storage Backend: Cloudflare R2 (S3-compatible)
#
# Prerequisites:
# 1. kubectl configured with cluster access
# 2. velero CLI installed (brew install velero / see below)
# 3. credentials-velero file updated with R2 credentials
# 4. R2 bucket created (cmsdbbackup)
#
# Usage:
#   ./install.sh
#   ./install.sh --dry-run  (preview only)
#

set -e

# ============================================
# CONFIGURATION - UPDATE THESE VALUES
# ============================================
R2_ACCOUNT_ID="${R2_ACCOUNT_ID:-<YOUR_CLOUDFLARE_ACCOUNT_ID>}"
R2_BUCKET="${R2_BUCKET:-cmsdbbackup}"
VELERO_VERSION="v1.13.0"

# ============================================
# Script Variables
# ============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CREDENTIALS_FILE="${SCRIPT_DIR}/credentials-velero"
DRY_RUN=""

# Parse arguments
if [ "$1" = "--dry-run" ]; then
    DRY_RUN="--dry-run"
    echo "Running in dry-run mode (no changes will be made)"
fi

# ============================================
# Pre-flight Checks
# ============================================
echo "============================================"
echo "Velero Installation for Education Management System"
echo "============================================"
echo ""

# Check if velero CLI is installed
if ! command -v velero &> /dev/null; then
    echo "ERROR: velero CLI not found!"
    echo ""
    echo "Install velero CLI:"
    echo ""
    echo "  macOS:"
    echo "    brew install velero"
    echo ""
    echo "  Linux:"
    echo "    curl -LO https://github.com/vmware-tanzu/velero/releases/download/${VELERO_VERSION}/velero-${VELERO_VERSION}-linux-amd64.tar.gz"
    echo "    tar -xvf velero-${VELERO_VERSION}-linux-amd64.tar.gz"
    echo "    sudo mv velero-${VELERO_VERSION}-linux-amd64/velero /usr/local/bin/"
    echo ""
    exit 1
fi

# Check kubectl connection
echo "[1/6] Checking kubectl connection..."
if ! kubectl cluster-info &> /dev/null; then
    echo "ERROR: Cannot connect to Kubernetes cluster!"
    echo "Make sure kubectl is configured correctly."
    exit 1
fi
echo "       Connected to cluster: $(kubectl config current-context)"

# Check credentials file
echo "[2/6] Checking credentials file..."
if [ ! -f "${CREDENTIALS_FILE}" ]; then
    echo "ERROR: Credentials file not found: ${CREDENTIALS_FILE}"
    exit 1
fi

if grep -q "<R2_ACCESS_KEY_ID>" "${CREDENTIALS_FILE}"; then
    echo "ERROR: Credentials file contains placeholder values!"
    echo "Please update ${CREDENTIALS_FILE} with your actual R2 credentials."
    exit 1
fi
echo "       Credentials file found"

# Check R2 configuration
echo "[3/6] Checking R2 configuration..."
if [ "${R2_ACCOUNT_ID}" = "<YOUR_CLOUDFLARE_ACCOUNT_ID>" ]; then
    echo "ERROR: R2_ACCOUNT_ID not configured!"
    echo ""
    echo "Either:"
    echo "  1. Set environment variable: export R2_ACCOUNT_ID=your_account_id"
    echo "  2. Or edit this script and update R2_ACCOUNT_ID"
    echo ""
    echo "Your Account ID is visible in the Cloudflare dashboard URL:"
    echo "  https://dash.cloudflare.com/<ACCOUNT_ID>/r2/overview"
    exit 1
fi
echo "       R2 Account ID: ${R2_ACCOUNT_ID}"
echo "       R2 Bucket: ${R2_BUCKET}"
echo "       R2 Endpoint: https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

# ============================================
# Installation
# ============================================
echo ""
echo "[4/6] Installing Velero..."
echo ""

velero install \
    --provider aws \
    --plugins velero/velero-plugin-for-aws:v1.9.0 \
    --bucket ${R2_BUCKET} \
    --prefix velero \
    --secret-file "${CREDENTIALS_FILE}" \
    --backup-location-config \
region=auto,\
s3ForcePathStyle=true,\
s3Url=https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com \
    --use-node-agent \
    --uploader-type=kopia \
    ${DRY_RUN} \
    --wait

if [ -n "${DRY_RUN}" ]; then
    echo ""
    echo "[DRY-RUN] Above resources would be created."
    exit 0
fi

# ============================================
# Verification
# ============================================
echo ""
echo "[5/6] Verifying installation..."
echo ""

# Wait for velero pod to be ready
echo "Waiting for Velero pod to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=velero -n velero --timeout=120s

echo ""
echo "Velero pods:"
kubectl get pods -n velero

echo ""
echo "Velero version:"
velero version

echo ""
echo "[6/6] Testing backup storage location..."
velero backup-location get

# ============================================
# Post-installation
# ============================================
echo ""
echo "============================================"
echo "Velero Installation Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Apply backup schedules:"
echo "   kubectl apply -f ${SCRIPT_DIR}/schedule.yml"
echo ""
echo "2. Create a test backup:"
echo "   velero backup create test-backup --include-namespaces education-management"
echo ""
echo "3. View backups:"
echo "   velero backup get"
echo ""
echo "4. View backup details:"
echo "   velero backup describe <backup-name>"
echo ""
echo "============================================"
