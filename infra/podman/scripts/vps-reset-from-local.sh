#!/bin/bash
# =============================================================================
# VPS Factory Reset — tears down EVERYTHING and restores to a clean state.
#
# What it removes:
#   1. All podman containers, images, volumes, networks
#   2. /opt/ems (all data, configs, backups, monitoring)
#   3. Nginx CMS site configs
#   4. All crontabs + CMS log files
#   5. SSH hardening (restores port 22, root login, password auth)
#   6. UFW rules, fail2ban, sysctl hardening, unattended-upgrades
#   7. ALL non-root users (UID >= 1000), their home dirs, sudoers, files
#
# After this, the VPS is back to a vanilla state.
# You'll need root access from your VPS provider panel to log back in
# (or the script re-enables root SSH + password auth before removing deploy).
#
# Usage (from repo root):
#   ./infra/podman/scripts/vps-reset-from-local.sh
# =============================================================================
set -e

# ── Pick up defaults from ems.sh if available ─────────────────────────────────

VPS_IP="${DEFAULT_HOST:-}"
SSH_PORT="${DEFAULT_PORT:-22}"
SSH_USER="${DEFAULT_USER:-deploy}"

# ── Collect / edit inputs ────────────────────────────────────────────────────

collect_inputs() {
  echo ""
  read -p "  VPS IP or hostname [${VPS_IP}]: " _v
  [ -n "$_v" ] && VPS_IP="$_v" || true
  if [ -z "${VPS_IP}" ]; then echo "  Error: VPS IP is required."; return 1; fi

  read -p "  SSH port [${SSH_PORT}]: " _v
  [ -n "$_v" ] && SSH_PORT="$_v" || true

  read -p "  SSH user [${SSH_USER}]: " _v
  [ -n "$_v" ] && SSH_USER="$_v" || true
}

collect_inputs || { collect_inputs || exit 1; }

while true; do
  echo ""
  echo "  ╔═══════════════════════════════════════╗"
  echo "  ║     WARNING: VPS FACTORY RESET        ║"
  echo "  ╠═══════════════════════════════════════╣"
  printf "  ║  Target: %-27s  ║\n" "${SSH_USER}@${VPS_IP}:${SSH_PORT}"
  echo "  ║                                       ║"
  echo "  ║  This will PERMANENTLY DESTROY:        ║"
  echo "  ║   - All containers, images, volumes   ║"
  echo "  ║   - /opt/ems (all data, configs, DBs) ║"
  echo "  ║   - Nginx CMS configs                 ║"
  echo "  ║   - SSH hardening (reverts to port 22)║"
  echo "  ║   - UFW rules, fail2ban, sysctl       ║"
  echo "  ║   - The '${SSH_USER}' user account              ║"
  echo "  ╚═══════════════════════════════════════╝"
  echo ""
  read -p "  [e] edit values  [q] quit  or type 'RESET' to confirm: " _choice
  case "$_choice" in
    e|E) collect_inputs || true; continue ;;
    q|Q|n|N) echo "Aborted."; exit 0 ;;
    RESET) break ;;
    *) echo "  Type 'RESET' to confirm, 'e' to edit, 'q' to quit."; continue ;;
  esac
done

echo ""
read -p "  Final confirmation — type 'YES': " CONFIRM2
if [ "${CONFIRM2}" != "YES" ]; then
  echo "Aborted."
  exit 0
fi

SSH_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)

# Helper: try SSH on current port, fallback to port 22
ssh_run() {
  ssh "${SSH_OPTS[@]}" -p "${SSH_PORT}" "${SSH_USER}@${VPS_IP}" bash -s 2>/dev/null || \
  ssh "${SSH_OPTS[@]}" -p 22 "${SSH_USER}@${VPS_IP}" bash -s 2>/dev/null
}

# ── Step 1: Stop and destroy all podman resources ────────────────────────────

echo ""
echo "[1/7] Stopping and removing all podman containers, images, volumes..."
ssh_run << 'PODMAN_NUKE'
set -e

echo "  Stopping all containers..."
podman stop -a -t 10 2>/dev/null || true

echo "  Removing all containers..."
podman rm -a -f 2>/dev/null || true

echo "  Removing all images..."
podman rmi -a -f 2>/dev/null || true

echo "  Removing all volumes..."
podman volume prune -f 2>/dev/null || true

echo "  Removing all networks..."
podman network prune -f 2>/dev/null || true

echo "  Resetting podman storage..."
podman system reset --force 2>/dev/null || true

echo "  Podman cleaned"
PODMAN_NUKE

# ── Step 2: Remove /opt/ems ──────────────────────────────────────────────────

echo ""
echo "[2/7] Removing /opt/ems..."
ssh_run << 'REMOVE_CMS'
set -e
sudo rm -rf /opt/ems
echo "  /opt/ems removed"
REMOVE_CMS

# ── Step 3: Remove nginx CMS configs ────────────────────────────────────────

echo ""
echo "[3/7] Removing Nginx CMS site configs..."
ssh_run << 'NGINX_CLEAN'
set -e

# Remove CMS site configs
for f in /etc/nginx/sites-available/ems-*; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  sudo rm -f "/etc/nginx/sites-enabled/${name}" "/etc/nginx/sites-available/${name}"
  echo "  Removed nginx config: ${name}"
done

# Restore default site if it was disabled
if [ -f /etc/nginx/sites-available/default ] && [ ! -f /etc/nginx/sites-enabled/default ]; then
  sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
fi

sudo nginx -t 2>/dev/null && sudo systemctl reload nginx 2>/dev/null || true
echo "  Nginx cleaned"
NGINX_CLEAN

# ── Step 4: Remove crontab and log files ─────────────────────────────────────

echo ""
echo "[4/7] Removing crontab and log files..."
ssh_run << 'CRON_CLEAN'
set -e

# Clear deploy user crontab
crontab -r 2>/dev/null || true
echo "  Crontab cleared"

# Remove CMS log files
sudo rm -f /var/log/ems-backup.log /var/log/ems-backup-cleanup.log /var/log/ems-health.log
echo "  Log files removed"
CRON_CLEAN

# ── Checkpoint before irreversible SSH changes ───────────────────────────────

echo ""
echo "  Steps 1-4 complete (containers, /opt/ems, nginx, crontab removed)."
echo "  Next steps will reset SSH, UFW, and remove the deploy user."
echo "  After this, you'll need VPS provider console for root access."
echo ""
read -p "  Continue with SSH reset + user removal? [y/N]: " _c
if [[ "$_c" != "y" && "$_c" != "Y" ]]; then
  echo "  Stopped. SSH and user are intact. You can still SSH in."
  exit 0
fi

# ── Step 5: Reset SSH to defaults ────────────────────────────────────────────

echo ""
echo "[5/7] Resetting SSH to defaults (port 22, root login, password auth)..."
ssh_run << 'SSH_RESET'
set -e

# Remove CMS hardened config
sudo rm -f /etc/ssh/sshd_config.d/99-ems-hardened.conf

# Restore backup if exists (find the oldest .bak file)
BACKUP=$(ls -t /etc/ssh/sshd_config.bak.* 2>/dev/null | tail -1)
if [ -n "$BACKUP" ]; then
  sudo cp "$BACKUP" /etc/ssh/sshd_config
  echo "  Restored original sshd_config from backup"
else
  # Manually reset key settings
  sudo sed -i 's/^Port .*/Port 22/' /etc/ssh/sshd_config 2>/dev/null || true
  sudo sed -i 's/^PermitRootLogin .*/PermitRootLogin yes/' /etc/ssh/sshd_config 2>/dev/null || true
  sudo sed -i 's/^PasswordAuthentication .*/PasswordAuthentication yes/' /etc/ssh/sshd_config 2>/dev/null || true
  sudo sed -i '/^AllowUsers/d' /etc/ssh/sshd_config 2>/dev/null || true
  echo "  Reset SSH settings manually"
fi

# Clean up all backup files
sudo rm -f /etc/ssh/sshd_config.bak.* 2>/dev/null || true

# Validate and reload
sudo sshd -t && sudo systemctl reload sshd
echo "  SSH reset: port=22, root=yes, password=yes"
SSH_RESET

# After SSH reset, port is now 22
SSH_PORT=22

# ── Step 6: Reset UFW, fail2ban, sysctl, auto-updates ───────────────────────

echo ""
echo "[6/7] Resetting UFW, fail2ban, sysctl hardening, auto-updates..."
ssh_run << 'SECURITY_RESET'
set -e

# UFW — disable and reset
sudo ufw --force disable 2>/dev/null || true
sudo ufw --force reset 2>/dev/null || true
echo "  UFW disabled and reset"

# fail2ban — remove config, stop, disable
sudo rm -f /etc/fail2ban/jail.local 2>/dev/null || true
sudo systemctl stop fail2ban 2>/dev/null || true
sudo systemctl disable fail2ban 2>/dev/null || true
echo "  fail2ban stopped, disabled, config removed"

# sysctl — remove CMS hardening
sudo rm -f /etc/sysctl.d/99-ems-hardened.conf 2>/dev/null || true
sudo sysctl --system > /dev/null 2>&1 || true
echo "  sysctl hardening removed"

# unattended-upgrades — restore defaults
sudo rm -f /etc/apt/apt.conf.d/20auto-upgrades 2>/dev/null || true
sudo rm -f /etc/apt/apt.conf.d/50unattended-upgrades 2>/dev/null || true
sudo systemctl stop unattended-upgrades 2>/dev/null || true
sudo systemctl disable unattended-upgrades 2>/dev/null || true
echo "  Auto-updates disabled"
SECURITY_RESET

# ── Step 7: Remove ALL non-root users + leftover files ──────────────────────

echo ""
echo "[7/7] Removing all non-root users, home dirs, crontabs, sudoers..."
ssh_run << 'NUKE_USERS'
set -e

# Ensure root can log in first
echo "  Ensuring root can log in..."
sudo passwd -u root 2>/dev/null || true

# Find all human users (UID >= 1000, exclude nobody/nogroup)
USERS=$(awk -F: '$3 >= 1000 && $1 != "nobody" { print $1 }' /etc/passwd)

if [ -z "$USERS" ]; then
  echo "  No non-root users found."
else
  for u in $USERS; do
    echo "  Removing user: $u"

    # Kill all processes owned by user
    sudo pkill -9 -u "$u" 2>/dev/null || true
    sleep 1

    # Remove sudoers drop-in
    sudo rm -f "/etc/sudoers.d/$u" 2>/dev/null || true

    # Remove crontab
    sudo crontab -r -u "$u" 2>/dev/null || true

    # Disable lingering
    sudo loginctl disable-linger "$u" 2>/dev/null || true

    # Remove user + home dir + mail spool
    sudo userdel -rf "$u" 2>/dev/null || true

    echo "    ✔ $u removed"
  done
fi

# Clean up any orphaned home dirs
for d in /home/*/; do
  [ -d "$d" ] || continue
  owner=$(basename "$d")
  if ! id "$owner" &>/dev/null; then
    sudo rm -rf "$d"
    echo "  Removed orphaned home dir: $d"
  fi
done

# Remove any leftover CMS files outside /opt/ems
sudo rm -f /tmp/ems-*.log 2>/dev/null || true
sudo rm -rf /tmp/ems-* 2>/dev/null || true

echo "  All non-root users and files cleaned"
NUKE_USERS

echo ""
echo "=============================================="
echo "  VPS Factory Reset Complete"
echo "=============================================="
echo ""
echo "  Everything removed. Only root remains."
echo "  SSH is back to port 22 with root + password auth."
echo ""
echo "  To access the VPS:"
echo "    ssh root@${VPS_IP}"
echo ""
echo "  To start fresh:"
echo "    ./infra/podman/scripts/vps-init-from-local.sh"
echo ""
