#!/usr/bin/env bash
set -euo pipefail

# This script configures basic maintenance on the server:
# - installs a logrotate rule for mongod
# - configures systemd-journald limits
# - installs a daily cron job to run apt-get clean and vacuum journal
# - removes old snap revisions
# - ensures a 512MB swapfile exists (creates if missing)

echo "Configuring maintenance (requires sudo)..."

sudo bash -c 'cat > /etc/logrotate.d/mongod <<"EOF"
/var/log/mongodb/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 640 mongodb mongodb
    sharedscripts
    postrotate
        systemctl reload mongod > /dev/null 2>&1 || true
    endscript
}
EOF'

echo "Installed /etc/logrotate.d/mongod"

sudo mkdir -p /etc/systemd/journald.conf.d
sudo bash -c 'cat > /etc/systemd/journald.conf.d/99-maintenance.conf <<"EOF"
[Journal]
SystemMaxUse=200M
RuntimeMaxUse=100M
# Keep files no longer than 7 days
MaxFileSec=7day
EOF'

echo "Installed journald drop-in and restarting systemd-journald..."
sudo systemctl restart systemd-journald || true

# Create maintenance script and cron job
sudo bash -c 'cat > /usr/local/bin/kasey-maintenance.sh <<"EOF"
#!/usr/bin/env bash
set -e
# basic cleanup tasks
apt-get clean || true
journalctl --vacuum-size=200M || true
# remove disabled snap revisions
if command -v snap >/dev/null 2>&1; then
  snap list --all | awk '/disabled/{print $1, $2}' | while read snapname rev; do
    snap remove --revision="$rev" "$snapname" || true
  done
fi
EOF'

sudo chmod +x /usr/local/bin/kasey-maintenance.sh

sudo bash -c 'cat > /etc/cron.d/kasey-maintenance <<"EOF"
# Run daily maintenance at 03:30
30 3 * * * root /usr/local/bin/kasey-maintenance.sh >> /var/log/kasey-maintenance.log 2>&1
EOF'

echo "Installed cron job /etc/cron.d/kasey-maintenance"

# Ensure a modest swapfile exists (512MB)
if ! swapon --show | grep -q '/swapfile' 2>/dev/null; then
  echo "Creating 512MB swapfile at /swapfile"
  sudo fallocate -l 512M /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  # Persist
  if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
  fi
else
  echo "Swapfile already present"
fi

echo "Maintenance setup complete. Review /var/log/kasey-maintenance.log after first run."
