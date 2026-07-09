#!/bin/bash
# =============================================================================
# Run PHP tests using the test runner image (Podman).
# Use this when you deploy with Podman and the app container has no npm/PHPUnit.
#
# Usage (from repo root):
#   ./infra/podman/scripts/run-tests-podman.sh [--build]
#
#   --build   Force rebuild of the ems-test image before running.
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Project root: directory that contains Dockerfile.test
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
IMAGE_NAME="${EMS_TEST_IMAGE:-ems-test}"

FORCE_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --build) FORCE_BUILD=true ;;
  esac
done

cd "$PROJECT_ROOT"

if ! command -v podman &>/dev/null; then
  echo "podman is not installed or not in PATH."
  exit 1
fi

if [[ "$FORCE_BUILD" == true ]] || ! podman image exists "$IMAGE_NAME" 2>/dev/null; then
  echo "Building test image: $IMAGE_NAME"
  podman build -f Dockerfile.test -t "$IMAGE_NAME" .
fi

echo "Running: composer install && php artisan test"
podman run --rm \
  -v "$PROJECT_ROOT":/var/www/html \
  -w /var/www/html \
  "$IMAGE_NAME" \
  sh -c "composer install && php artisan test"
