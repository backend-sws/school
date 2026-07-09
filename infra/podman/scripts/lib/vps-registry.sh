#!/bin/bash
# =============================================================================
# VPS Registry — polymorphic VPS host management.
#
# Stores VPS configs in ~/.ems/vps.conf (INI-like format).
# Each VPS has a name, host, port, user, and list of colleges.
#
# Usage: source "${SCRIPT_DIR}/lib/vps-registry.sh"
# =============================================================================

REGISTRY_DIR="${HOME}/.ems"
REGISTRY_FILE="${REGISTRY_DIR}/vps.conf"

# ── Ensure registry exists ───────────────────────────────────────────────────

_ensure_registry() {
  mkdir -p "${REGISTRY_DIR}"
  [ -f "${REGISTRY_FILE}" ] || touch "${REGISTRY_FILE}"
}

# =============================================================================
# registry_list — list all VPS entries
#
# Output: one line per VPS:  name|host|port|user|colleges
# =============================================================================
registry_list() {
  _ensure_registry
  local name="" host="" port="" user="" colleges=""
  local found=false

  while IFS= read -r line || [ -n "$line" ]; do
    line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    [ -z "$line" ] && continue
    [[ "$line" == "#"* ]] && continue

    if [[ "$line" =~ ^\[(.+)\]$ ]]; then
      # Print previous section if any
      if [ -n "$name" ]; then
        echo "${name}|${host}|${port}|${user}|${colleges}"
        found=true
      fi
      name="${BASH_REMATCH[1]}"
      host="" port="22" user="deploy" colleges=""
    elif [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
      local key="${BASH_REMATCH[1]}"
      local val="${BASH_REMATCH[2]}"
      case "$key" in
        host) host="$val" ;;
        port) port="$val" ;;
        user) user="$val" ;;
        colleges) colleges="$val" ;;
      esac
    fi
  done < "${REGISTRY_FILE}"

  # Print last section
  if [ -n "$name" ]; then
    echo "${name}|${host}|${port}|${user}|${colleges}"
    found=true
  fi

  $found
}

# =============================================================================
# registry_add — add or update a VPS entry
#
# Args: $1=name  $2=host  $3=port  $4=user  [$5=colleges (comma-separated)]
# =============================================================================
registry_add() {
  local name="$1" host="$2" port="${3:-22}" user="${4:-deploy}" colleges="${5:-}"
  _ensure_registry

  # Remove existing entry with this name
  registry_remove "$name" 2>/dev/null || true

  cat >> "${REGISTRY_FILE}" <<EOF

[${name}]
host=${host}
port=${port}
user=${user}
colleges=${colleges}
EOF

  return 0
}

# =============================================================================
# registry_remove — remove a VPS entry by name
# =============================================================================
registry_remove() {
  local name="$1"
  _ensure_registry

  local tmp
  tmp=$(mktemp)
  local in_section=false
  local removed=false

  while IFS= read -r line || [ -n "$line" ]; do
    if [[ "$line" =~ ^\[${name}\]$ ]]; then
      in_section=true
      removed=true
      continue
    elif [[ "$line" =~ ^\[.+\]$ ]]; then
      in_section=false
    fi

    if ! $in_section; then
      echo "$line" >> "$tmp"
    fi
  done < "${REGISTRY_FILE}"

  mv "$tmp" "${REGISTRY_FILE}"
  $removed
}

# =============================================================================
# registry_get — load a VPS entry into VPS_HOST/VPS_PORT/VPS_USER
#
# Args: $1=name
# Sets: VPS_HOST, VPS_PORT, VPS_USER, VPS_NAME, VPS_COLLEGES
# Returns: 0=found, 1=not found
# =============================================================================
registry_get() {
  local target_name="$1"
  _ensure_registry

  local line
  while IFS='|' read -r name host port user colleges; do
    if [ "$name" = "$target_name" ]; then
      VPS_NAME="$name"
      VPS_HOST="$host"
      VPS_PORT="$port"
      VPS_USER="$user"
      VPS_COLLEGES="$colleges"
      return 0
    fi
  done < <(registry_list)

  return 1
}

# =============================================================================
# registry_find_by_college — find which VPS hosts a college
#
# Args: $1=college_id
# Sets: VPS_HOST, VPS_PORT, VPS_USER, VPS_NAME, VPS_COLLEGES
# Returns: 0=found, 1=not found
# =============================================================================
registry_find_by_college() {
  local college_id="$1"
  _ensure_registry

  while IFS='|' read -r name host port user colleges; do
    if echo ",$colleges," | grep -q ",${college_id},"; then
      VPS_NAME="$name"
      VPS_HOST="$host"
      VPS_PORT="$port"
      VPS_USER="$user"
      VPS_COLLEGES="$colleges"
      return 0
    fi
  done < <(registry_list)

  return 1
}

# =============================================================================
# registry_add_college — add a college to an existing VPS entry
#
# Args: $1=vps_name  $2=college_id
# =============================================================================
registry_add_college() {
  local vps_name="$1" college_id="$2"

  if ! registry_get "$vps_name"; then
    return 1
  fi

  # Check if already present
  if echo ",$VPS_COLLEGES," | grep -q ",${college_id},"; then
    return 0
  fi

  local new_colleges
  if [ -z "$VPS_COLLEGES" ]; then
    new_colleges="$college_id"
  else
    new_colleges="${VPS_COLLEGES},${college_id}"
  fi

  registry_add "$vps_name" "$VPS_HOST" "$VPS_PORT" "$VPS_USER" "$new_colleges"
}

# =============================================================================
# registry_pick — interactive VPS picker
#
# Sets: VPS_HOST, VPS_PORT, VPS_USER, VPS_NAME, VPS_COLLEGES
# Returns: 0=selected, 1=aborted
# =============================================================================
registry_pick() {
  _ensure_registry

  local entries=()
  local i=0
  while IFS='|' read -r name host port user colleges; do
    entries+=("${name}|${host}|${port}|${user}|${colleges}")
    i=$((i + 1))
  done < <(registry_list)

  if [ ${#entries[@]} -eq 0 ]; then
    printf "  ${YELLOW:-}No VPS hosts registered.${NC:-}\n"
    printf "  Add one first.\n"
    return 1
  fi

  # Auto-select if only one
  if [ ${#entries[@]} -eq 1 ]; then
    IFS='|' read -r VPS_NAME VPS_HOST VPS_PORT VPS_USER VPS_COLLEGES <<< "${entries[0]}"
    printf "  ${DIM:-}Auto-selected: ${VPS_NAME} (${VPS_HOST})${NC:-}\n"
    return 0
  fi

  # Multiple — show numbered list
  echo ""
  printf "  ${CYAN:-}VPS Hosts:${NC:-}\n"
  for idx in "${!entries[@]}"; do
    IFS='|' read -r name host port user colleges <<< "${entries[$idx]}"
    local college_display="${colleges:-none}"
    printf "    ${BOLD:-}%d)${NC:-}  %-20s %s  ${DIM:-}[%s]${NC:-}\n" "$((idx + 1))" "$name" "$host" "$college_display"
  done
  echo ""

  read -p "  Select VPS [1-${#entries[@]}]: " choice
  if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#entries[@]}" ]; then
    IFS='|' read -r VPS_NAME VPS_HOST VPS_PORT VPS_USER VPS_COLLEGES <<< "${entries[$((choice - 1))]}"
    return 0
  fi

  printf "  ${RED:-}Invalid selection.${NC:-}\n"
  return 1
}

# =============================================================================
# registry_manage — interactive add/remove/list menu
#
# Returns: 0 always
# =============================================================================
registry_manage() {
  while true; do
    echo ""
    printf "  ${CYAN:-}VPS Registry${NC:-}\n\n"
    printf "    ${BOLD:-}1)${NC:-}  List VPS hosts\n"
    printf "    ${BOLD:-}2)${NC:-}  Add VPS\n"
    printf "    ${BOLD:-}3)${NC:-}  Remove VPS\n"
    printf "    ${BOLD:-}4)${NC:-}  Switch active VPS\n"
    printf "    ${BOLD:-}q)${NC:-}  Back\n"
    echo ""
    read -p "  Select: " _vps_action

    case "$_vps_action" in
      1)
        echo ""
        local found=false
        while IFS='|' read -r name host port user colleges; do
          found=true
          printf "    ${BOLD:-}%-20s${NC:-} %s:%s  ${DIM:-}user=%s  colleges=%s${NC:-}\n" \
            "$name" "$host" "$port" "$user" "${colleges:-none}"
        done < <(registry_list)
        $found || printf "    ${DIM:-}No VPS hosts registered.${NC:-}\n"
        ;;
      2)
        echo ""
        read -p "  VPS name (e.g. production-1): " _name
        [ -z "$_name" ] && continue
        read -p "  Host/IP: " _host
        [ -z "$_host" ] && continue
        read -p "  SSH port [22]: " _port
        _port="${_port:-22}"
        read -p "  SSH user [deploy]: " _user
        _user="${_user:-deploy}"
        read -p "  Colleges (comma-separated, or empty): " _colleges

        registry_add "$_name" "$_host" "$_port" "$_user" "$_colleges"
        printf "  ${GREEN:-}✔${NC:-}  Added: %s (%s)\n" "$_name" "$_host"
        ;;
      3)
        echo ""
        read -p "  VPS name to remove: " _name
        [ -z "$_name" ] && continue
        if registry_remove "$_name"; then
          printf "  ${GREEN:-}✔${NC:-}  Removed: %s\n" "$_name"
        else
          printf "  ${RED:-}✘${NC:-}  Not found: %s\n" "$_name"
        fi
        ;;
      4)
        registry_pick && printf "  ${GREEN:-}✔${NC:-}  Active: %s (%s)\n" "$VPS_NAME" "$VPS_HOST"
        ;;
      q|Q) return 0 ;;
      *) printf "  ${RED:-}Invalid.${NC:-}\n" ;;
    esac
  done
}
