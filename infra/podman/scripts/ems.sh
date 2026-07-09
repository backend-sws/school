#!/bin/bash
# =============================================================================
# EMS Management Console — polymorphic CLI for VPS deployment.
#
# Auto-discovers institutes from /opt/ems/colleges/<id>/.env on the VPS.
# Each action that needs an institute uses pick_institute() which shows
# discovered institutes and lets the user select one.
#
# Usage: ./infra/podman/scripts/ems.sh
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSH_OPTS=(-o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new)

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ── Source libraries ─────────────────────────────────────────────────────────
source "${SCRIPT_DIR}/lib/deploy-helpers.sh"
source "${SCRIPT_DIR}/lib/vps-registry.sh"

# ── Helpers ──────────────────────────────────────────────────────────────────

print_header() {
  clear
  echo ""
  printf "${BOLD}  ╔═══════════════════════════════════════╗${NC}\n"
  printf "${BOLD}  ║       EMS Management Console          ║${NC}\n"
  printf "${BOLD}  ╚═══════════════════════════════════════╝${NC}\n"
  echo ""
}

print_status() {
  local icon
  case "$2" in
    ok)      icon="${GREEN}✔${NC}" ;;
    fail)    icon="${RED}✘${NC}" ;;
    *)       icon="${DIM}?${NC}" ;;
  esac
  printf "  ${icon}  %-25s %s\n" "$1" "$3"
}

pause() {
  echo ""
  read -p "  Press Enter to continue..." _
}

# ── VPS Connection (registry-backed) ─────────────────────────────────────────

collect_vps_info() {
  printf "  ${CYAN}VPS Connection${NC}\n"
  echo ""

  # Try registry first
  local entries
  entries=$(registry_list 2>/dev/null | wc -l | tr -d ' ')
  if [ "${entries}" -gt 0 ]; then
    if registry_pick; then
      VPS_IP="${VPS_HOST}"
      return 0
    fi
  fi

  # Fallback to manual input
  printf "  ${DIM}No VPS in registry. Manual entry:${NC}\n"
  read -p "  VPS IP or hostname: " VPS_IP
  if [ -z "${VPS_IP}" ]; then
    printf "  ${RED}Error: VPS IP is required.${NC}\n"
    exit 1
  fi
  read -p "  SSH port [22]: " VPS_PORT
  VPS_PORT=${VPS_PORT:-22}
  read -p "  SSH user [deploy]: " VPS_USER
  VPS_USER=${VPS_USER:-deploy}

  # Offer to save to registry
  read -p "  Save to VPS registry? [y/N]: " _save
  if [[ "$_save" == "y" || "$_save" == "Y" ]]; then
    read -p "  VPS name (e.g. production-1): " _name
    [ -n "$_name" ] && registry_add "$_name" "$VPS_IP" "$VPS_PORT" "$VPS_USER"
  fi
}

# ── Polymorphic: export VPS env for child scripts ────────────────────────────

export_vps_env() {
  export DEFAULT_HOST="${VPS_IP}"
  export DEFAULT_PORT="${VPS_PORT}"
  export DEFAULT_USER="${VPS_USER}"
}

# ── Polymorphic: pick an institute from discovered list ──────────────────────

# Sets INSTITUTE_ID. Returns 0 on success, 1 on abort.
# Skips selection if only 1 institute exists (auto-selects it).
pick_institute() {
  local action_label="${1:-action}"
  local skip_check=""

  if [ "$INSTITUTE_OK" != true ]; then
    echo ""
    printf "  ${RED}No institutes discovered on VPS.${NC}\n"
    read -p "  Enter institute ID manually? [y/N]: " _force
    if [[ "$_force" != "y" && "$_force" != "Y" ]]; then
      return 1
    fi
    skip_check=1
    read -p "  Institute ID: " INSTITUTE_ID
    [ -z "${INSTITUTE_ID}" ] && return 1
    return 0
  fi

  # Auto-select if only one institute
  if [ "${INSTITUTE_COUNT}" -eq 1 ]; then
    INSTITUTE_ID="${INSTITUTE_LIST}"
    printf "  ${DIM}Auto-selected: ${INSTITUTE_ID}${NC}\n"
    return 0
  fi

  # Multiple institutes — show numbered list
  echo ""
  printf "  ${CYAN}Institutes:${NC}\n"
  local i=1
  local ids=()
  while IFS= read -r id; do
    ids+=("$id")
    printf "    ${BOLD}${i})${NC}  ${id}\n"
    ((i++))
  done <<< "$INSTITUTES"

  read -p "  Select institute [1-${#ids[@]}]: " choice
  if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#ids[@]}" ]; then
    INSTITUTE_ID="${ids[$((choice-1))]}"
  else
    printf "  ${RED}Invalid selection.${NC}\n"
    return 1
  fi
  return 0
}

# ── Status Check (single SSH call) ──────────────────────────────────────────

check_institute_exists() {
  echo "$STATUS_RAW" | grep -q "^INSTITUTE:${1}$" && echo "ok"
}

refresh_status() {
  SSH_OK=false
  BOOTSTRAP_OK=false
  SETUP_OK=false
  INSTITUTE_OK=false
  INSTITUTE_LIST=""
  INSTITUTE_COUNT=0

  printf "  ${DIM}Checking VPS...${NC}\n"
  STATUS_RAW=$(ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new \
    -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" bash -s 2>/dev/null <<'CHECKEOF'
echo "SSH_OK"

# Bootstrap checks
[ -f /etc/ssh/sshd_config.d/99-ems-hardened.conf ] && echo "CHK_SSH"
sudo ufw status 2>/dev/null | grep -qi "active"  && echo "CHK_UFW"
[ -f /etc/fail2ban/jail.local ]                    && echo "CHK_F2B"
[ -f /etc/sysctl.d/99-ems-hardened.conf ]          && echo "CHK_SYSCTL"

# EMS Setup check
[ -d /opt/ems/colleges ] && echo "EMS_SETUP_OK"

# Discover institutes
for d in /opt/ems/colleges/*/; do
  [ -d "$d" ] || continue
  id=$(basename "$d")
  [ -f "$d/.env" ] && echo "INSTITUTE:$id"
done

# Check shared DB + Redis containers
podman inspect --format '{{.State.Status}}' postgres-ems 2>/dev/null | grep -q running && echo "SHARED_PG_OK"
podman inspect --format '{{.State.Status}}' pgbouncer-ems 2>/dev/null | grep -q running && echo "SHARED_PGB_OK"
podman inspect --format '{{.State.Status}}' redis-ems 2>/dev/null | grep -q running && echo "SHARED_REDIS_OK"

# Check Horizon containers per institute
for d in /opt/ems/colleges/*/; do
  [ -d "$d" ] || continue
  id=$(basename "$d")
  podman inspect --format '{{.State.Status}}' "ems-horizon-${id}" 2>/dev/null | grep -q running && echo "HORIZON_OK:${id}"
done
CHECKEOF
  ) || true
}

show_status() {
  printf "  ${CYAN}Status${NC}  (${VPS_USER}@${VPS_IP}:${VPS_PORT})\n"
  echo ""

  # SSH
  if echo "$STATUS_RAW" | grep -q "^SSH_OK$"; then
    SSH_OK=true
    print_status "SSH Connection" "ok" "Connected as ${VPS_USER}"
  else
    SSH_OK=false
    print_status "SSH Connection" "fail" "Cannot connect"
  fi

  # Bootstrap (advisory — partial hardening is ok)
  if [ "$SSH_OK" = true ]; then
    local chk_ssh="" chk_ufw="" chk_f2b="" chk_sys=""
    echo "$STATUS_RAW" | grep -q "^CHK_SSH$"    && chk_ssh=1
    echo "$STATUS_RAW" | grep -q "^CHK_UFW$"    && chk_ufw=1
    echo "$STATUS_RAW" | grep -q "^CHK_F2B$"    && chk_f2b=1
    echo "$STATUS_RAW" | grep -q "^CHK_SYSCTL$" && chk_sys=1

    local parts=()
    [ -n "$chk_ssh" ] && parts+=("SSH")
    [ -n "$chk_ufw" ] && parts+=("UFW")
    [ -n "$chk_f2b" ] && parts+=("fail2ban")
    [ -n "$chk_sys" ] && parts+=("sysctl")

    if [ ${#parts[@]} -ge 2 ]; then
      BOOTSTRAP_OK=true
      local detail=$(IFS=" + "; echo "${parts[*]}")
      print_status "VPS Bootstrap" "ok" "${detail}"
    elif [ ${#parts[@]} -ge 1 ]; then
      BOOTSTRAP_OK=true
      local detail=$(IFS=" + "; echo "${parts[*]}")
      print_status "VPS Bootstrap" "ok" "${detail} (partial)"
    else
      BOOTSTRAP_OK=false
      print_status "VPS Bootstrap" "fail" "no hardening detected"
    fi
  else
    print_status "VPS Bootstrap" "unknown" ""
  fi

  # EMS Setup (independent of bootstrap)
  if [ "$SSH_OK" = true ] && echo "$STATUS_RAW" | grep -q "^EMS_SETUP_OK$"; then
    SETUP_OK=true
    print_status "EMS Setup" "ok" "/opt/ems ready"
  elif [ "$SSH_OK" = true ]; then
    SETUP_OK=false
    print_status "EMS Setup" "fail" "Run Setup first"
  else
    print_status "EMS Setup" "unknown" ""
  fi

  # Institutes (polymorphic discovery)
  if [ "$SSH_OK" = true ]; then
    INSTITUTES=$(echo "$STATUS_RAW" | grep "^INSTITUTE:" | sed 's/^INSTITUTE://')
    if [ -n "$INSTITUTES" ]; then
      INSTITUTE_OK=true
      INSTITUTE_COUNT=$(echo "$INSTITUTES" | wc -l | tr -d ' ')
      INSTITUTE_LIST=$(echo "$INSTITUTES" | tr '\n' ', ' | sed 's/,$//')
      print_status "Institutes (${INSTITUTE_COUNT})" "ok" "${INSTITUTE_LIST}"
    else
      INSTITUTE_OK=false
      print_status "Institutes" "fail" "None added"
    fi
  else
    print_status "Institutes" "unknown" ""
  fi

  # Shared Infrastructure (postgres-ems, pgbouncer-ems, redis-ems)
  if [ "$INSTITUTE_OK" = true ] || [ "$SETUP_OK" = true ]; then
    local shared_parts=()
    echo "$STATUS_RAW" | grep -q "^SHARED_PG_OK$" && shared_parts+=("Postgres")
    echo "$STATUS_RAW" | grep -q "^SHARED_PGB_OK$" && shared_parts+=("PgBouncer")
    echo "$STATUS_RAW" | grep -q "^SHARED_REDIS_OK$" && shared_parts+=("Redis")

    if [ ${#shared_parts[@]} -eq 3 ]; then
      print_status "Shared DB + Redis" "ok" "All running"
    elif [ ${#shared_parts[@]} -gt 0 ]; then
      local detail=$(IFS=", "; echo "${shared_parts[*]}")
      print_status "Shared DB + Redis" "fail" "Only: ${detail}"
    else
      print_status "Shared DB + Redis" "fail" "Not running"
    fi

    # Horizon (per-institute)
    local horizon_running=0
    while IFS= read -r id; do
      echo "$STATUS_RAW" | grep -q "^HORIZON_OK:${id}$" && ((horizon_running++))
    done <<< "$INSTITUTES"
    if [ "$horizon_running" -gt 0 ]; then
      print_status "Horizon Workers" "ok" "${horizon_running} running"
    elif [ "$INSTITUTE_OK" = true ]; then
      print_status "Horizon Workers" "fail" "Not running"
    fi
  fi

  echo ""
}

# ── Menu ─────────────────────────────────────────────────────────────────────

show_menu() {
  # ── VPS ──
  printf "  ${DIM}── VPS ──${NC}\n"
  printf "  ${BOLD}v)${NC}  Switch/Add VPS          ${DIM}(manage VPS registry)${NC}\n"
  echo ""

  # ── Setup ──
  printf "  ${DIM}── Setup ──${NC}\n"
  if [ "$BOOTSTRAP_OK" = true ]; then
    printf "  ${DIM}1)  Bootstrap VPS           ✔ done${NC}\n"
  else
    printf "  ${BOLD}1)${NC}  Bootstrap VPS           ${DIM}(SSH, firewall, packages)${NC}\n"
  fi

  if [ "$SETUP_OK" = true ]; then
    printf "  ${BOLD}2)${NC}  Setup EMS               ${DIM}✔ done (re-run to update)${NC}\n"
  elif [ "$BOOTSTRAP_OK" = true ]; then
    printf "  ${BOLD}2)${NC}  Setup EMS               ${DIM}(configs, monitoring, /opt/ems)${NC}\n"
  else
    printf "  ${DIM}2)  Setup EMS               (requires: Bootstrap)${NC}\n"
  fi

  if [ "$SETUP_OK" = true ]; then
    printf "  ${BOLD}3)${NC}  Add Institute           ${DIM}(postgres, pgbouncer, nginx)${NC}\n"
    printf "  ${BOLD}4)${NC}  Configure GHCR          ${DIM}(add/update registry creds)${NC}\n"
  else
    printf "  ${DIM}3)  Add Institute           (requires: Setup)${NC}\n"
    printf "  ${DIM}4)  Configure GHCR          (requires: Setup)${NC}\n"
  fi
  echo ""

  # ── Deploy & Data ──
  printf "  ${DIM}── Deploy & Data ──${NC}\n"
  if [ "$INSTITUTE_OK" = true ]; then
    printf "  ${BOLD}5)${NC}  Deploy App              ${DIM}(pull image, canary, swap, migrate)${NC}\n"
    printf "  ${BOLD}6)${NC}  Push Env & Restart      ${DIM}(upload .env, restart containers)${NC}\n"
    printf "  ${BOLD}7)${NC}  Sync Config Dir         ${DIM}(re-upload entire college dir)${NC}\n"
    printf "  ${BOLD}8)${NC}  Start/Stop DB           ${DIM}(shared postgres + pgbouncer + redis)${NC}\n"
    printf "  ${BOLD}9)${NC}  Restore Database        ${DIM}(pick backup, restore)${NC}\n"
    printf "  ${BOLD}10)${NC} Run Seeder              ${DIM}(run specific or all seeders)${NC}\n"
    printf "  ${BOLD}11)${NC} Update Domain           ${DIM}(domain + SSL)${NC}\n"
  else
    printf "  ${DIM}5)  Deploy App              (requires: Institute)${NC}\n"
    printf "  ${DIM}6)  Push Env & Restart      (requires: Institute)${NC}\n"
    printf "  ${DIM}7)  Sync Config Dir         (requires: Institute)${NC}\n"
    printf "  ${DIM}8)  Start/Stop DB           (requires: Institute)${NC}\n"
    printf "  ${DIM}9)  Restore Database        (requires: Institute)${NC}\n"
    printf "  ${DIM}10) Run Seeder              (requires: Institute)${NC}\n"
    printf "  ${DIM}11) Update Domain           (requires: Institute)${NC}\n"
  fi
  echo ""

  # ── Diagnostics ──
  printf "  ${DIM}── Diagnostics ──${NC}\n"
  if [ "$INSTITUTE_OK" = true ]; then
    printf "  ${BOLD}f)${NC}  Diagnose & Fix          ${DIM}(check env, pgbouncer, nginx, health)${NC}\n"
    printf "  ${BOLD}l)${NC}  View Logs               ${DIM}(tail app/horizon/pgbouncer logs)${NC}\n"
    printf "  ${BOLD}h)${NC}  Horizon Management      ${DIM}(status, pause, restart, logs)${NC}\n"
  else
    printf "  ${DIM}f)  Diagnose & Fix          (requires: Institute)${NC}\n"
    printf "  ${DIM}l)  View Logs               (requires: Institute)${NC}\n"
    printf "  ${DIM}h)  Horizon Management      (requires: Institute)${NC}\n"
  fi
  if [ "$SETUP_OK" = true ]; then
    printf "  ${BOLD}g)${NC}  Grafana Tunnel          ${DIM}(monitoring via SSH)${NC}\n"
    printf "  ${BOLD}a)${NC}  Adminer Tunnel          ${DIM}(DB browser via SSH)${NC}\n"
  else
    printf "  ${DIM}g)  Grafana Tunnel          (requires: Setup)${NC}\n"
    printf "  ${DIM}a)  Adminer Tunnel          (requires: Setup)${NC}\n"
  fi
  echo ""

  # ── Security ──
  printf "  ${DIM}── Security ──${NC}\n"
  if [ "$INSTITUTE_OK" = true ]; then
    printf "  ${BOLD}m)${NC}  Manage Secrets          ${DIM}(add/update .env.secret keys)${NC}\n"
    printf "  ${BOLD}b)${NC}  Manage Backup Config    ${DIM}(R2 backup credentials)${NC}\n"
  else
    printf "  ${DIM}m)  Manage Secrets          (requires: Institute)${NC}\n"
    printf "  ${DIM}b)  Manage Backup Config    (requires: Institute)${NC}\n"
  fi
  echo ""

  # ── Footer ──
  printf "  ${DIM}────────────────────${NC}\n"
  printf "  ${BOLD}r)${NC}  Refresh status\n"
  if [ "$BOOTSTRAP_OK" = true ]; then
    printf "  ${BOLD}0)${NC}  ${RED}Factory Reset${NC}           ${DIM}(destroy everything)${NC}\n"
  fi
  printf "  ${BOLD}q)${NC}  Quit\n"
  echo ""
}

# ── Action Runners (polymorphic — use pick_institute where needed) ───────────

run_bootstrap() {
  if [ "$BOOTSTRAP_OK" = true ]; then
    printf "\n  ${GREEN}Already done${NC} — use ${SCRIPT_DIR}/vps-init-from-local.sh to re-run.\n"
    pause; return
  fi
  printf "\n  ${YELLOW}Running: Bootstrap VPS${NC}\n\n"
  "${SCRIPT_DIR}/vps-init-from-local.sh"
  pause
}

run_setup() {
  if [ "$SETUP_OK" = true ]; then
    read -p "  Setup already done. Re-run to update configs? [y/N]: " _rerun
    [[ "$_rerun" != "y" && "$_rerun" != "Y" ]] && { pause; return; }
  fi
  if [ "$BOOTSTRAP_OK" != true ]; then
    read -p "  Bootstrap not detected. Run Setup anyway? [y/N]: " _f
    [[ "$_f" != "y" && "$_f" != "Y" ]] && { pause; return; }
  fi
  printf "\n  ${YELLOW}Running: Setup EMS${NC}\n\n"
  "${SCRIPT_DIR}/vps-setup-from-local.sh" "${VPS_USER}@${VPS_IP}" "${VPS_PORT}"
  pause
}

run_add_institute() {
  if [ "$SETUP_OK" != true ]; then
    read -p "  Setup not detected. Run anyway? [y/N]: " _f
    [[ "$_f" != "y" && "$_f" != "Y" ]] && { pause; return; }
  fi
  printf "\n  ${YELLOW}Running: Add Institute${NC}\n\n"

  # Auto-discover colleges from local folder
  COLLEGES_DIR="${SCRIPT_DIR}/../colleges"
  if [ -d "${COLLEGES_DIR}" ]; then
    # Get all local college dirs
    local all_local=()
    while IFS= read -r d; do
      [ -f "${d}/.env" ] && all_local+=("$(basename "$d")")
    done < <(find "${COLLEGES_DIR}" -mindepth 1 -maxdepth 1 -type d | sort)

    if [ ${#all_local[@]} -gt 0 ]; then
      # Mark already-deployed ones
      local already_deployed=""
      [ -n "$INSTITUTES" ] && already_deployed="$INSTITUTES"

      printf "  ${CYAN}Available colleges (local):${NC}\n\n"
      local i=1
      local available=()
      for c in "${all_local[@]}"; do
        if echo "$already_deployed" | grep -qx "$c" 2>/dev/null; then
          printf "    ${DIM}%d) %s (already deployed)${NC}\n" "$i" "$c"
        else
          printf "    ${BOLD}%d)${NC} %s\n" "$i" "$c"
          available+=("$c")
        fi
        i=$((i + 1))
      done
      printf "    ${BOLD}m)${NC} Manual entry\n"
      echo ""

      read -p "  Select college: " _sel
      if [[ "$_sel" =~ ^[0-9]+$ ]] && [ "$_sel" -ge 1 ] && [ "$_sel" -le ${#all_local[@]} ]; then
        INSTITUTE_ID="${all_local[$((_sel - 1))]}"
        INST_ENV="${COLLEGES_DIR}/${INSTITUTE_ID}/.env"
        INIT_SQL="${COLLEGES_DIR}/${INSTITUTE_ID}/init.sql"
        [ ! -f "${INIT_SQL}" ] && INIT_SQL=""

        printf "\n  ${GREEN}Selected: ${INSTITUTE_ID}${NC}\n"
        printf "  ${DIM}.env:     ${INST_ENV}${NC}\n"
        [ -n "${INIT_SQL}" ] && printf "  ${DIM}init.sql: ${INIT_SQL}${NC}\n"
        echo ""
      elif [[ "$_sel" == "m" || "$_sel" == "M" ]]; then
        # Fall through to manual entry below
        INSTITUTE_ID=""
      else
        echo "  Invalid selection."; pause; return
      fi
    fi
  fi

  # Manual entry (fallback or if 'm' was chosen)
  if [ -z "${INSTITUTE_ID}" ]; then
    read -p "  Institute ID: " INSTITUTE_ID
    [ -z "${INSTITUTE_ID}" ] && { echo "  Error: ID required."; pause; return; }

    read -p "  Path to .env file: " INST_ENV
    [ -z "${INST_ENV}" ] || [ ! -f "${INST_ENV}" ] && { echo "  Error: .env not found"; pause; return; }

    read -p "  Path to init.sql (empty=auto): " INIT_SQL
  fi

  read -p "  Domain (empty=IP-based): " DOMAIN

  ARGS=("${VPS_USER}@${VPS_IP}" "${INSTITUTE_ID}" "${INST_ENV}" "${VPS_PORT}")
  [ -n "${INIT_SQL}" ] && ARGS+=("${INIT_SQL}") || ARGS+=("")
  [ -n "${DOMAIN}" ] && ARGS+=("${DOMAIN}")

  "${SCRIPT_DIR}/add-college-from-local.sh" "${ARGS[@]}"
  pause
}

run_deploy() {
  pick_institute "Deploy" || { pause; return; }
  printf "\n  ${YELLOW}Deploying: ${INSTITUTE_ID}${NC}\n\n"
  export_vps_env

  # Pre-flight: ensure PgBouncer + Nginx are ready
  ensure_pgbouncer_entry "${INSTITUTE_ID}" "${VPS_USER}@${VPS_IP}" "${VPS_PORT}"

  "${SCRIPT_DIR}/local-deploy.sh" "${INSTITUTE_ID}"
  pause
}

run_restore() {
  pick_institute "Restore" || { pause; return; }
  printf "\n  ${YELLOW}Restoring: ${INSTITUTE_ID}${NC}\n\n"
  export_vps_env
  "${SCRIPT_DIR}/db-restore-from-local.sh" "${INSTITUTE_ID}"
  pause
}

run_update_domain() {
  pick_institute "Update Domain" || { pause; return; }
  printf "\n  ${YELLOW}Updating domain: ${INSTITUTE_ID}${NC}\n\n"
  export_vps_env
  "${SCRIPT_DIR}/update-domain-from-local.sh" "${INSTITUTE_ID}"
  pause
}

run_adminer_tunnel() {
  pick_institute "Adminer" || { pause; return; }
  export_vps_env
  "${SCRIPT_DIR}/adminer-tunnel-from-local.sh" "${INSTITUTE_ID}"
  pause
}

run_grafana_tunnel() {
  if [ "$SETUP_OK" != true ]; then
    read -p "  Setup not detected. Run anyway? [y/N]: " _f
    [[ "$_f" != "y" && "$_f" != "Y" ]] && { pause; return; }
  fi
  export_vps_env
  "${SCRIPT_DIR}/adminer-tunnel-from-local.sh" --grafana
  pause
}

run_configure_ghcr() {
  if [ "$SETUP_OK" != true ]; then
    read -p "  Setup not detected. Run anyway? [y/N]: " _f
    [[ "$_f" != "y" && "$_f" != "Y" ]] && { pause; return; }
  fi
  export_vps_env
  "${SCRIPT_DIR}/configure-ghcr-from-local.sh"
  pause
}

run_diagnose() {
  pick_institute "Diagnose" || { pause; return; }
  printf "\n  ${YELLOW}Running diagnostics for: ${INSTITUTE_ID}${NC}\n"
  run_diagnostics "${INSTITUTE_ID}" "${VPS_USER}@${VPS_IP}" "${VPS_PORT}"
  pause
}

run_view_logs() {
  pick_institute "Logs" || { pause; return; }
  printf "\n  ${CYAN}View Logs: ${INSTITUTE_ID}${NC}\n\n"
  printf "    ${BOLD}1)${NC}  App logs         ${DIM}(ems-app)${NC}\n"
  printf "    ${BOLD}2)${NC}  Horizon logs     ${DIM}(ems-horizon)${NC}\n"
  printf "    ${BOLD}3)${NC}  Reverb logs      ${DIM}(ems-reverb)${NC}\n"
  printf "    ${BOLD}4)${NC}  PgBouncer logs\n"
  printf "    ${BOLD}5)${NC}  Laravel log      ${DIM}(storage/logs/laravel.log)${NC}\n"
  echo ""
  read -p "  Select [1-5]: " _log_choice

  case "$_log_choice" in
    1) ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" "podman logs --tail 80 ems-app-${INSTITUTE_ID} 2>&1" ;;
    2) ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" "podman logs --tail 80 ems-horizon-${INSTITUTE_ID} 2>&1" ;;
    3) ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" "podman logs --tail 80 ems-reverb-${INSTITUTE_ID} 2>&1" ;;
    4) ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" "podman logs --tail 80 pgbouncer-ems 2>&1" ;;
    5) ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" "podman exec ems-app-${INSTITUTE_ID} tail -n 80 storage/logs/laravel.log 2>&1" ;;
    *) printf "  ${RED}Invalid.${NC}\n" ;;
  esac
  pause
}

run_vps_manage() {
  registry_manage
  # After managing, re-pick if VPS changed
  if [ -n "$VPS_HOST" ] && [ "$VPS_HOST" != "$VPS_IP" ]; then
    VPS_IP="$VPS_HOST"
    refresh_status
  fi
}

run_db_control() {
  if [ "$SETUP_OK" != true ]; then
    read -p "  Setup not detected. Run anyway? [y/N]: " _f
    [[ "$_f" != "y" && "$_f" != "Y" ]] && { pause; return; }
  fi
  export_vps_env

  printf "\n  ${CYAN}Shared Database Control${NC}\n\n"
  printf "    ${BOLD}1)${NC}  Start DB    ${DIM}(postgres-ems + pgbouncer-ems + redis-ems)${NC}\n"
  printf "    ${BOLD}2)${NC}  Stop DB     ${DIM}(pgbouncer-ems + redis-ems + postgres-ems)${NC}\n"
  printf "    ${BOLD}3)${NC}  Restart DB  ${DIM}(all shared DB services)${NC}\n"
  printf "    ${BOLD}4)${NC}  DB Status\n"
  printf "    ${BOLD}5)${NC}  Reload PgBouncer  ${DIM}(apply config changes)${NC}\n"
  echo ""
  read -p "  Select: " _db_action

  case "$_db_action" in
    1)
      printf "  Starting shared DB services...\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "cd /opt/ems && podman-compose up -d postgres-ems pgbouncer-ems redis-ems && echo '  ✔ Shared DB services started'"
      ;;
    2)
      printf "  Stopping shared DB services...\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "podman stop pgbouncer-ems redis-ems 2>/dev/null; podman stop postgres-ems 2>/dev/null && echo '  ✔ Shared DB services stopped' || echo '  ⚠  Some services were not running'"
      ;;
    3)
      printf "  Restarting shared DB services...\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" bash -s <<'DBREOF'
set -e
podman restart postgres-ems 2>/dev/null && echo '  ✔ postgres-ems restarted' || echo '  ✘ postgres-ems failed'
sleep 3
podman restart pgbouncer-ems 2>/dev/null && echo '  ✔ pgbouncer-ems restarted' || echo '  ✘ pgbouncer-ems failed'
podman restart redis-ems 2>/dev/null && echo '  ✔ redis-ems restarted' || echo '  ✘ redis-ems failed'
DBREOF
      ;;
    4)
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "podman ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -E '(postgres|pgbouncer|redis)-ems'"
      ;;
    5)
      printf "  Reloading PgBouncer config...\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "podman exec pgbouncer-ems kill -HUP 1 2>/dev/null && echo '  ✔ PgBouncer reloaded' || podman restart pgbouncer-ems && echo '  ✔ PgBouncer restarted'"
      ;;
    *) echo "  Invalid choice." ;;
  esac
  pause
}

run_reset() {
  if [ "$BOOTSTRAP_OK" != true ]; then
    read -p "  Bootstrap not detected. Run anyway? [y/N]: " _f
    [[ "$_f" != "y" && "$_f" != "Y" ]] && { pause; return; }
  fi
  export_vps_env
  printf "\n  ${RED}Running: Factory Reset${NC}\n\n"
  "${SCRIPT_DIR}/vps-reset-from-local.sh"
  pause
}

run_env_deploy() {
  pick_institute "Push Env" || { pause; return; }

  read -p "  Path to local .env file: " ENV_PATH
  if [ -z "${ENV_PATH}" ] || [ ! -f "${ENV_PATH}" ]; then
    echo "  Error: .env file not found: ${ENV_PATH}"
    pause; return
  fi

  echo ""
  printf "  ${DIM}Uploading .env to /opt/ems/colleges/${INSTITUTE_ID}/.env${NC}\n"
  scp ${SSH_OPTS[@]} -P "${VPS_PORT}" "${ENV_PATH}" "${VPS_USER}@${VPS_IP}:/opt/ems/colleges/${INSTITUTE_ID}/.env"
  echo "  Uploaded."

  printf "  ${DIM}Restarting containers...${NC}\n"
  ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" bash -s <<RESTARTEOF
set -e
ID="${INSTITUTE_ID}"
podman restart "ems-app-\${ID}" 2>/dev/null || echo "  Warning: ems-app-\${ID} not found"
podman restart "ems-reverb-\${ID}" 2>/dev/null || echo "  Warning: ems-reverb-\${ID} not found"
# Gracefully restart Horizon (terminate → auto-restart via podman restart policy)
podman exec "ems-horizon-\${ID}" php artisan horizon:terminate 2>/dev/null && sleep 2 && \
  podman restart "ems-horizon-\${ID}" 2>/dev/null || echo "  Warning: ems-horizon-\${ID} not found"
echo "  Containers restarted (including Horizon)."
RESTARTEOF

  printf "  ${GREEN}Done: .env pushed and containers restarted.${NC}\n"
  pause
}

run_seeder() {
  pick_institute "Seeder" || { pause; return; }
  printf "\n  ${YELLOW}Running seeder for: ${INSTITUTE_ID}${NC}\n\n"

  # List available seeders (use ls — Alpine/BusyBox find lacks -printf)
  printf "  ${CYAN}Available seeders:${NC}\n"
  SEEDERS=$(ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
    "podman exec ems-app-${INSTITUTE_ID} ls /var/www/html/database/seeders/ 2>/dev/null | grep 'Seeder.php' | sort" 2>/dev/null)

  if [ -z "${SEEDERS}" ]; then
    printf "  ${RED}No seeders found or container not running.${NC}\n"
    pause; return
  fi

  local i=1
  local classes=()
  while IFS= read -r f; do
    local cls="${f%.php}"
    classes+=("$cls")
    printf "    ${BOLD}${i})${NC}  ${cls}\n"
    ((i++))
  done <<< "$SEEDERS"

  echo ""
  printf "    ${BOLD}a)${NC}  Run ALL (DatabaseSeeder)\n"
  echo ""
  read -p "  Select seeder [1-${#classes[@]} or a]: " choice

  local SEEDER_CMD
  if [[ "$choice" == "a" || "$choice" == "A" ]]; then
    SEEDER_CMD="php artisan db:seed --force"
  elif [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#classes[@]}" ]; then
    local selected="${classes[$((choice-1))]}"
    SEEDER_CMD="php artisan db:seed --class=${selected} --force"
  else
    printf "  ${RED}Invalid selection.${NC}\n"
    pause; return
  fi

  printf "\n  ${DIM}Running: ${SEEDER_CMD}${NC}\n\n"
  ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
    "podman exec ems-app-${INSTITUTE_ID} ${SEEDER_CMD}"

  printf "\n  ${GREEN}Seeder complete.${NC}\n"
  pause
}

run_horizon() {
  pick_institute "Horizon" || { pause; return; }
  printf "\n  ${CYAN}Horizon Management: ${INSTITUTE_ID}${NC}\n\n"

  printf "    ${BOLD}1)${NC}  Status          ${DIM}(check if running)${NC}\n"
  printf "    ${BOLD}2)${NC}  Pause           ${DIM}(stop processing, keep alive)${NC}\n"
  printf "    ${BOLD}3)${NC}  Continue        ${DIM}(resume processing)${NC}\n"
  printf "    ${BOLD}4)${NC}  Restart         ${DIM}(graceful terminate + restart)${NC}\n"
  printf "    ${BOLD}5)${NC}  Logs            ${DIM}(tail last 50 lines)${NC}\n"
  printf "    ${BOLD}6)${NC}  Redis Info      ${DIM}(memory, queue depth)${NC}\n"
  echo ""
  read -p "  Select [1-6]: " hchoice

  case "$hchoice" in
    1)
      printf "\n  ${DIM}Checking Horizon status...${NC}\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "podman exec ems-horizon-${INSTITUTE_ID} php artisan horizon:status 2>&1 || echo 'Horizon container not running'"
      ;;
    2)
      printf "\n  ${YELLOW}Pausing Horizon workers...${NC}\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "podman exec ems-horizon-${INSTITUTE_ID} php artisan horizon:pause"
      printf "  ${GREEN}Paused.${NC}\n"
      ;;
    3)
      printf "\n  ${GREEN}Resuming Horizon workers...${NC}\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "podman exec ems-horizon-${INSTITUTE_ID} php artisan horizon:continue"
      printf "  ${GREEN}Resumed.${NC}\n"
      ;;
    4)
      printf "\n  ${YELLOW}Gracefully restarting Horizon...${NC}\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" bash -s <<HEOF
set -e
podman exec "ems-horizon-${INSTITUTE_ID}" php artisan horizon:terminate 2>/dev/null
echo "  Terminated. Waiting for restart..."
sleep 3
podman restart "ems-horizon-${INSTITUTE_ID}" 2>/dev/null
echo "  Restarted."
HEOF
      printf "  ${GREEN}Horizon restarted.${NC}\n"
      ;;
    5)
      printf "\n  ${DIM}Last 50 lines:${NC}\n\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
        "podman logs --tail 50 ems-horizon-${INSTITUTE_ID} 2>&1"
      ;;
    6)
      printf "\n  ${CYAN}Redis Info:${NC}\n\n"
      ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" bash -s <<REOF
echo "── Memory ──"
podman exec redis-ems redis-cli info memory 2>/dev/null | grep -E 'used_memory_human|maxmemory_human'
echo ""
echo "── Queue Depths ──"
for q in default video-processing sms alerts; do
  depth=\$(podman exec redis-ems redis-cli llen "queues:\${q}" 2>/dev/null || echo "0")
  printf "  %-20s %s jobs\n" "\${q}" "\${depth}"
done
REOF
      ;;
    *)
      printf "  ${RED}Invalid.${NC}\n"
      ;;
  esac
  pause
}

run_manage_secrets() {
  pick_institute "Manage Secrets" || { pause; return; }
  printf "\n  ${YELLOW}Managing secrets for: ${INSTITUTE_ID}${NC}\n\n"
  "${SCRIPT_DIR}/manage-secrets.sh" "${VPS_USER}@${VPS_IP}" "${INSTITUTE_ID}" "${VPS_PORT}"
  pause
}

run_manage_backup_config() {
  pick_institute "Manage Backup Config" || { pause; return; }
  printf "\n  ${YELLOW}Managing backup config for: ${INSTITUTE_ID}${NC}\n\n"
  "${SCRIPT_DIR}/manage-backup-config.sh" "${VPS_USER}@${VPS_IP}" "${INSTITUTE_ID}" "${VPS_PORT}"
  pause
}

run_sync_config() {
  pick_institute "Sync Config Dir" || { pause; return; }

  # Find local config dir
  LOCAL_DIR="${SCRIPT_DIR}/../colleges/${INSTITUTE_ID}"
  if [ ! -d "${LOCAL_DIR}" ]; then
    printf "\n  ${RED}Local dir not found: ${LOCAL_DIR}${NC}\n"
    read -p "  Path to local college dir: " LOCAL_DIR
    [ -d "${LOCAL_DIR}" ] || { echo "  Not found."; pause; return; }
  fi

  REMOTE_DIR="/opt/ems/colleges/${INSTITUTE_ID}"

  printf "\n  ${CYAN}Sync Config: ${INSTITUTE_ID}${NC}\n"
  printf "  ${DIM}Local:  ${LOCAL_DIR}${NC}\n"
  printf "  ${DIM}Remote: ${REMOTE_DIR}${NC}\n\n"

  echo "  Files to upload:"
  ls -1 "${LOCAL_DIR}/" | while read -r f; do
    echo "    • ${f}"
  done
  echo ""
  printf "  ${YELLOW}⚠ This will replace config files on VPS.${NC}\n"
  printf "  ${DIM}.env.secret and .env.backup are preserved (VPS-only).${NC}\n"
  echo ""
  read -p "  Continue? [y/N]: " _confirm
  [[ "$_confirm" != "y" && "$_confirm" != "Y" ]] && { pause; return; }

  echo ""
  printf "  ${DIM}Backing up current VPS config...${NC}\n"
  ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" \
    "sudo cp -a ${REMOTE_DIR} ${REMOTE_DIR}.bak.\$(date +%Y%m%d_%H%M%S)"

  printf "  ${DIM}Uploading local files (excluding secrets)...${NC}\n"
  scp ${SSH_OPTS[@]} -P "${VPS_PORT}" -r "${LOCAL_DIR}/"* "${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/"

  printf "  ${DIM}Restoring VPS-only secrets...${NC}\n"
  ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" bash -s <<SYNCEOF
set -e
BACKUP=\$(ls -td ${REMOTE_DIR}.bak.* 2>/dev/null | head -1)
if [ -n "\${BACKUP}" ]; then
  # Restore .env.secret, .env.secret.enc, .env.secret.key, .env.backup
  for f in .env.secret .env.secret.enc .env.secret.key .env.backup; do
    [ -f "\${BACKUP}/\${f}" ] && cp -p "\${BACKUP}/\${f}" "${REMOTE_DIR}/\${f}"
  done
fi
chmod 600 ${REMOTE_DIR}/.env.secret* ${REMOTE_DIR}/.env.backup 2>/dev/null || true
echo "  Secrets restored."
SYNCEOF

  printf "\n  ${GREEN}✔ Config synced for ${INSTITUTE_ID}${NC}\n"
  echo ""
  read -p "  Restart containers? [y/N]: " _restart
  if [[ "$_restart" == "y" || "$_restart" == "Y" ]]; then
    ssh ${SSH_OPTS[@]} -p "${VPS_PORT}" "${VPS_USER}@${VPS_IP}" bash -s <<RESTEOF
set -e
ID="${INSTITUTE_ID}"
podman restart "ems-app-\${ID}" 2>/dev/null || echo "  ems-app-\${ID} not found"
podman restart "ems-reverb-\${ID}" 2>/dev/null || echo "  ems-reverb-\${ID} not found"
podman exec "ems-horizon-\${ID}" php artisan horizon:terminate 2>/dev/null && sleep 2 && \
  podman restart "ems-horizon-\${ID}" 2>/dev/null || echo "  ems-horizon-\${ID} not found"
echo "  Containers restarted."
RESTEOF
  fi
  pause
}

# ── Main Loop ────────────────────────────────────────────────────────────────

print_header
collect_vps_info
echo ""
refresh_status

while true; do
  print_header
  show_status
  show_menu

  read -p "  Select action: " CHOICE

  case "${CHOICE}" in
    v|V) run_vps_manage ;;
    1) run_bootstrap ;;
    2) run_setup ;;
    3) run_add_institute ;;
    4) run_configure_ghcr ;;
    5) run_deploy ;;
    6) run_env_deploy ;;
    7) run_sync_config ;;
    8) run_db_control ;;
    9) run_restore ;;
    10) run_seeder ;;
    11) run_update_domain ;;
    f|F) run_diagnose ;;
    l|L) run_view_logs ;;
    h|H) run_horizon ;;
    g|G) run_grafana_tunnel ;;
    a|A) run_adminer_tunnel ;;
    m|M) run_manage_secrets ;;
    b|B) run_manage_backup_config ;;
    0) run_reset ;;
    r|R) refresh_status; continue ;;
    q|Q) echo ""; echo "  Bye."; echo ""; exit 0 ;;
    *) printf "  ${RED}Invalid choice.${NC}\n"; sleep 1 ;;
  esac
done
