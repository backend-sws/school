#!/bin/bash
# =============================================================================
# VPS Bootstrap (run ONCE on a fresh VPS)
#
# What it does:
#   1. Creates a 'deploy' user with sudo + SSH key
#   2. Installs packages (podman, nginx, fail2ban, unattended-upgrades, etc.)
#   3. UFW firewall — deny all, allow SSH (rate-limited), 80, 443 only
#   4. Hardens SSH — key-only, no root, no password, no agent-fwd, custom port
#   5. fail2ban — SSH brute-force ban (3 fails → 1h, repeat → 1 week)
#   6. Kernel hardening — SYN flood, IP spoofing, ICMP lockdown
#   7. Auto security updates — unattended-upgrades for security patches
#
# After this script, all future access is:
#   ssh -p <SSH_PORT> deploy@<VPS_IP>
#
# Usage (from repo root):
#   ./infra/podman/scripts/vps-init-from-local.sh
# =============================================================================
set -e

checkpoint() {
  echo ""
  read -p "  >> Continue? [y/q]: " _c
  if [[ "$_c" == "q" || "$_c" == "Q" || "$_c" == "n" || "$_c" == "N" ]]; then
    echo "Aborted by user."
    exit 0
  fi
}

# ── Collect inputs (in a loop so user can edit) ──────────────────────────────

# Find local SSH public key
DEFAULT_PUBKEY=""
for key in ~/.ssh/id_ed25519.pub ~/.ssh/id_rsa.pub ~/.ssh/id_ecdsa.pub; do
  [ -f "$key" ] && DEFAULT_PUBKEY="$key" && break
done

if [ -z "${DEFAULT_PUBKEY}" ]; then
  echo "No SSH public key found. Generate one first:"
  echo "  ssh-keygen -t ed25519 -C \"your_email@example.com\""
  exit 1
fi

# Defaults
VPS_IP=""
ROOT_PORT="22"
ROOT_USER="root"
DEPLOY_USER="deploy"
NEW_SSH_PORT="22"
PUBKEY_PATH="${DEFAULT_PUBKEY}"

collect_inputs() {
  echo ""
  read -p "  VPS IP or hostname [${VPS_IP}]: " _v
  [ -n "$_v" ] && VPS_IP="$_v" || true
  if [ -z "${VPS_IP}" ]; then echo "  Error: VPS IP is required."; return 1; fi

  read -p "  Root SSH port [${ROOT_PORT}]: " _v
  [ -n "$_v" ] && ROOT_PORT="$_v" || true

  read -p "  Root user [${ROOT_USER}]: " _v
  [ -n "$_v" ] && ROOT_USER="$_v" || true

  read -p "  New deploy username [${DEPLOY_USER}]: " _v
  [ -n "$_v" ] && DEPLOY_USER="$_v" || true

  read -p "  New SSH port [${NEW_SSH_PORT}]: " _v
  [ -n "$_v" ] && NEW_SSH_PORT="$_v" || true

  read -p "  SSH public key [${PUBKEY_PATH}]: " _v
  [ -n "$_v" ] && PUBKEY_PATH="$_v" || true

  if [ ! -f "${PUBKEY_PATH}" ]; then
    echo "  Error: SSH public key not found at ${PUBKEY_PATH}"
    return 1
  fi
}

collect_inputs || { collect_inputs || exit 1; }

while true; do
  PUBKEY=$(cat "${PUBKEY_PATH}")
  echo ""
  echo "  ┌─────────────────────────────────────┐"
  echo "  │         VPS Bootstrap Config         │"
  echo "  ├─────────────────────────────────────┤"
  printf "  │  VPS:          %-20s │\n" "${ROOT_USER}@${VPS_IP}:${ROOT_PORT}"
  printf "  │  Deploy user:  %-20s │\n" "${DEPLOY_USER}"
  printf "  │  New SSH port: %-20s │\n" "${NEW_SSH_PORT}"
  printf "  │  SSH key:      %-20s │\n" "$(basename "${PUBKEY_PATH}")"
  echo "  └─────────────────────────────────────┘"
  echo ""
  read -p "  [y] continue  [e] edit  [q] quit: " _choice
  case "$_choice" in
    y|Y) break ;;
    e|E) collect_inputs || true; continue ;;
    q|Q|n|N) echo "Aborted."; exit 0 ;;
    *) continue ;;
  esac
done

SSH_OPTS=(-o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)

# ── Step 1: Create deploy user + SSH key ─────────────────────────────────────

echo ""
echo "[1/7] Creating user '${DEPLOY_USER}' and setting up SSH key..."
ssh "${SSH_OPTS[@]}" -p "${ROOT_PORT}" "${ROOT_USER}@${VPS_IP}" bash -s << CREATEUSER
set -e
if ! id "${DEPLOY_USER}" &>/dev/null; then
  useradd -m -s /bin/bash "${DEPLOY_USER}"
  echo "  Created user: ${DEPLOY_USER}"
else
  echo "  User ${DEPLOY_USER} already exists"
fi
usermod -aG sudo "${DEPLOY_USER}"
echo "${DEPLOY_USER} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${DEPLOY_USER}
chmod 440 /etc/sudoers.d/${DEPLOY_USER}
echo "  Sudo access configured (passwordless)"
mkdir -p /home/${DEPLOY_USER}/.ssh
echo "${PUBKEY}" >> /home/${DEPLOY_USER}/.ssh/authorized_keys
sort -u /home/${DEPLOY_USER}/.ssh/authorized_keys -o /home/${DEPLOY_USER}/.ssh/authorized_keys
chmod 700 /home/${DEPLOY_USER}/.ssh
chmod 600 /home/${DEPLOY_USER}/.ssh/authorized_keys
chown -R ${DEPLOY_USER}:${DEPLOY_USER} /home/${DEPLOY_USER}/.ssh
echo "  SSH key installed"
CREATEUSER

checkpoint

# ── Step 2: Install required packages ────────────────────────────────────────

echo ""
echo "[2/7] Installing packages (podman, podman-compose, nginx, fail2ban, curl, jq)..."
ssh "${SSH_OPTS[@]}" -p "${ROOT_PORT}" "${ROOT_USER}@${VPS_IP}" bash -s << PACKAGES
set -e
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq podman podman-compose nginx fail2ban ufw curl jq unzip logrotate unattended-upgrades apt-listchanges > /dev/null 2>&1
echo "  Packages installed"
systemctl enable --now nginx
systemctl enable --now fail2ban
echo "  nginx and fail2ban enabled"
loginctl enable-linger ${DEPLOY_USER} 2>/dev/null || true
echo "  Lingering enabled for ${DEPLOY_USER}"
PACKAGES

checkpoint

# ── Step 3: Configure UFW firewall ───────────────────────────────────────────
# Essentials only: SSH (for login + Adminer/Grafana tunnels), 80, 443.
# Adminer (8080) and Grafana (3000) are never opened — access via SSH tunnel only.

echo ""
echo "[3/7] Configuring UFW firewall (essentials: SSH, 80, 443 — Adminer/Grafana tunnel-only)..."
ssh "${SSH_OPTS[@]}" -p "${ROOT_PORT}" "${ROOT_USER}@${VPS_IP}" bash -s << FIREWALL
set -e
ufw --force reset > /dev/null 2>&1
ufw default deny incoming > /dev/null 2>&1
ufw default deny forward > /dev/null 2>&1
ufw default allow outgoing > /dev/null 2>&1
ufw limit ${NEW_SSH_PORT}/tcp comment "SSH-rate-limited" > /dev/null 2>&1
ufw allow 80/tcp comment "HTTP" > /dev/null 2>&1
ufw allow 443/tcp comment "HTTPS" > /dev/null 2>&1
if [ "${ROOT_PORT}" != "${NEW_SSH_PORT}" ]; then
  ufw allow ${ROOT_PORT}/tcp comment "SSH-old-temp" > /dev/null 2>&1
fi
ufw --force enable > /dev/null 2>&1
echo "  UFW: SSH (${NEW_SSH_PORT}, rate-limited), 80, 443 only. Adminer/Grafana via tunnel."
echo "  Forward: denied"
FIREWALL

checkpoint

# ── Step 4: Harden SSH ──────────────────────────────────────────────────────

echo ""
echo "  WARNING: Next step hardens SSH — disables root login + password auth."
echo "  Make sure step 1 (user + key) succeeded before continuing."
checkpoint

echo ""
echo "[4/7] Hardening SSH (port ${NEW_SSH_PORT}, key-only, no root login)..."
ssh "${SSH_OPTS[@]}" -p "${ROOT_PORT}" "${ROOT_USER}@${VPS_IP}" bash -s << SSHCONFIG
set -e
SSHD_CONFIG="/etc/ssh/sshd_config"
cp \${SSHD_CONFIG} \${SSHD_CONFIG}.bak.\$(date +%s)
cat > /etc/ssh/sshd_config.d/99-ems-hardened.conf << 'SSHEOF'
Port ${NEW_SSH_PORT}
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey
MaxAuthTries 3
MaxSessions 3
AllowUsers ${DEPLOY_USER}
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowTcpForwarding yes
AllowAgentForwarding no
PermitEmptyPasswords no
Banner none
SSHEOF
sshd -t
systemctl reload sshd
echo "  SSH hardened: port=${NEW_SSH_PORT}, key-only, root disabled, agent-fwd off"
SSHCONFIG

checkpoint

# ── Step 5: Configure fail2ban for SSH ───────────────────────────────────────

echo ""
echo "[5/7] Configuring fail2ban (ban after 3 failures for 1h, repeat offenders 1w)..."
ssh "${SSH_OPTS[@]}" -p "${ROOT_PORT}" "${ROOT_USER}@${VPS_IP}" bash -s << FAIL2BAN
set -e
cat > /etc/fail2ban/jail.local << 'F2BEOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 3
banaction = ufw

[sshd]
enabled  = true
port     = ${NEW_SSH_PORT}
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 3600

[sshd-aggressive]
enabled  = true
port     = ${NEW_SSH_PORT}
filter   = sshd[mode=aggressive]
logpath  = /var/log/auth.log
maxretry = 2
bantime  = 604800
findtime = 86400

[nginx-limit-req]
enabled  = true
port     = http,https
filter   = nginx-limit-req
logpath  = /var/log/nginx/error.log
maxretry = 5
bantime  = 3600
F2BEOF
systemctl restart fail2ban
echo "  fail2ban configured:"
echo "    SSH: 3 fails → ban 1h"
echo "    SSH aggressive: 2 fails/day → ban 1 week"
echo "    nginx rate-limit: 5 violations → ban 1h"
FAIL2BAN

checkpoint

# ── Step 6: Kernel hardening (sysctl) ───────────────────────────────────────

echo ""
echo "[6/7] Applying kernel hardening (sysctl)..."
ssh "${SSH_OPTS[@]}" -p "${ROOT_PORT}" "${ROOT_USER}@${VPS_IP}" bash -s << 'SYSCTL'
set -e
cat > /etc/sysctl.d/99-ems-hardened.conf << 'SEOF'
# ── Network hardening ──
# Ignore ICMP redirects (prevent MITM)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Don't send ICMP redirects (not a router)
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Disable IP forwarding (not a router)
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Ignore ICMP broadcast requests (prevent smurf attacks)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Enable SYN flood protection
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2

# Log martian packets (impossible source addresses)
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Ignore bogus ICMP error responses
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Enable reverse path filtering (prevent IP spoofing)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Disable source routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# ── Other ──
# Restrict dmesg to root
kernel.dmesg_restrict = 1

# Restrict kernel pointer leaks
kernel.kptr_restrict = 2
SEOF
sysctl --system > /dev/null 2>&1
echo "  Kernel hardened: SYN flood protection, IP spoofing prevention, ICMP lockdown"
SYSCTL

checkpoint

# ── Step 7: Auto security updates ───────────────────────────────────────────

echo ""
echo "[7/7] Enabling automatic security updates..."
ssh "${SSH_OPTS[@]}" -p "${ROOT_PORT}" "${ROOT_USER}@${VPS_IP}" bash -s << 'AUTOUPD'
set -e
cat > /etc/apt/apt.conf.d/20auto-upgrades << 'AEOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
AEOF
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'UEOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
UEOF
systemctl enable --now unattended-upgrades > /dev/null 2>&1
echo "  Auto security updates enabled (security patches only)"
AUTOUPD

# ── Final: Verify connectivity ───────────────────────────────────────────────

echo ""
echo "[✓] Verifying SSH as '${DEPLOY_USER}' on port ${NEW_SSH_PORT}..."

if ssh "${SSH_OPTS[@]}" -p "${NEW_SSH_PORT}" "${DEPLOY_USER}@${VPS_IP}" "echo '  SSH login OK'"; then
  if [ "${ROOT_PORT}" != "${NEW_SSH_PORT}" ]; then
    echo "  Removing temporary old SSH port (${ROOT_PORT}) from firewall..."
    ssh "${SSH_OPTS[@]}" -p "${NEW_SSH_PORT}" "${DEPLOY_USER}@${VPS_IP}" "sudo ufw delete allow ${ROOT_PORT}/tcp 2>/dev/null || true"
  fi
  echo ""
  echo "=== VPS Bootstrap Complete ==="
  echo ""
  echo "  Connect:  ssh -p ${NEW_SSH_PORT} ${DEPLOY_USER}@${VPS_IP}"
  echo ""
  echo "  Next: ./infra/podman/scripts/ems.sh  (or run vps-setup-from-local.sh)"
  echo ""
else
  echo ""
  echo "WARNING: Could not verify SSH as ${DEPLOY_USER} on port ${NEW_SSH_PORT}."
  echo "Old port (${ROOT_PORT}) is still open. Debug:"
  echo "  ssh -p ${ROOT_PORT} ${ROOT_USER}@${VPS_IP}"
  exit 1
fi
