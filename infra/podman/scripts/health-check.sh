#!/bin/bash
# =============================================================================
# Multi-College Health Check + Resource Tracking
# Each college has: postgres-<id> + pgbouncer-<id> + ems-app-<id>
# Schedule: */5 * * * *
# Unhealthy app containers are restarted once per cooldown (5 min) to avoid
# endless restart loops while keeping "never down" behavior.
# =============================================================================

FAILED=0
RESTART_COOLDOWN_SEC=300

# --- Host Nginx ---
if ! systemctl is-active --quiet nginx; then
  echo "[FAIL] Nginx is down at $(date)"; FAILED=1
fi

# --- Per-college full stack health ---
for dir in /opt/ems/colleges/*/; do
  [ -d "$dir" ] || continue
  college=$(basename "$dir")
  env_file="${dir}.env"
  [ -f "$env_file" ] || continue

  # Check college's Postgres
  if ! podman exec "postgres-${college}" pg_isready -U postgres -d "${college}_db" > /dev/null 2>&1; then
    echo "[FAIL] postgres-${college} is down at $(date)"; FAILED=1
  fi

  # Check college's PgBouncer
  if ! podman exec "pgbouncer-${college}" pg_isready -h 127.0.0.1 -p 6432 > /dev/null 2>&1; then
    echo "[FAIL] pgbouncer-${college} is down at $(date)"; FAILED=1
  fi

  # Check college's App (with optional auto-restart after cooldown)
  port=$(grep "^APP_PORT=" "$env_file" | cut -d= -f2)
  if [ -z "$port" ]; then
    port=8081
  fi
  if ! curl -sf --max-time 10 "http://127.0.0.1:${port}/" > /dev/null 2>&1; then
    echo "[FAIL] ems-app-${college} (port ${port}) is down at $(date)"; FAILED=1
    restart_stamp="/tmp/ems-health-restart-${college}"
    now=$(date +%s)
    if [ -f "$restart_stamp" ]; then
      last=$(cat "$restart_stamp" 2>/dev/null || echo 0)
      if [ $(( now - last )) -lt $RESTART_COOLDOWN_SEC ]; then
        echo "[SKIP] ems-app-${college} restart cooldown (next in $(( RESTART_COOLDOWN_SEC - (now - last) ))s)"
      else
        podman restart "ems-app-${college}" > /dev/null 2>&1 && echo "$now" > "$restart_stamp" && echo "[RESTART] ems-app-${college} restarted at $(date)"
      fi
    else
      podman restart "ems-app-${college}" > /dev/null 2>&1 && echo "$now" > "$restart_stamp" && echo "[RESTART] ems-app-${college} restarted at $(date)"
    fi
  fi
done

# --- Disk space ---
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
  echo "[WARN] Disk usage at ${DISK_USAGE}% at $(date)"
fi

# --- Resource usage summary (logged every check) ---
echo "[RESOURCES] $(date)"
podman stats --no-stream --format "  {{.Name}}: CPU={{.CPUPerc}} MEM={{.MemUsage}} ({{.MemPerc}})" 2>/dev/null | grep -E "(ems-|postgres-|pgbouncer-)" || true

[ $FAILED -eq 0 ] && echo "[OK] All services healthy at $(date)"
exit $FAILED
