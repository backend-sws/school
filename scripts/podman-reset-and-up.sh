#!/usr/bin/env bash
# Reset Podman machine and start the app stack. Use when you see
# "proxy already running" or "no such container" errors.
set -e
cd "$(dirname "$0")/.."
echo "[1/4] Stopping and removing containers..."
podman compose down --remove-orphans || true
echo "[2/4] Stopping Podman machine..."
podman machine stop || true
echo "[3/4] Starting Podman machine..."
podman machine start
echo "[4/4] Starting stack..."
podman compose up -d --build
echo "Done. App: http://localhost:${APP_PORT:-18088}  Adminer: http://localhost:${ADMINER_PORT:-18090}"
