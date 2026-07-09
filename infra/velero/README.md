# Velero Backup System for Education Management System

This directory contains configuration for Velero, a Kubernetes backup solution using Cloudflare R2 as storage backend.

## Overview

| Component | Description |
|-----------|-------------|
| **Velero** | Full cluster backup (volumes, secrets, configs, deployments) |
| **Storage** | Cloudflare R2 (S3-compatible, free tier: 10GB) |
| **Bucket** | `cmsdbbackup` |

## Backup Schedules

| Schedule | Time (UTC) | Retention | What's Backed Up |
|----------|------------|-----------|------------------|
| Daily | 3:00 AM | 7 days | Full namespace + volumes |
| Weekly | Sunday 4:00 AM | 30 days | Full namespace + volumes |

## Prerequisites

1. **kubectl** configured with cluster access
2. **Velero CLI** installed
3. **Cloudflare R2** bucket created (`cmsdbbackup`)
4. **R2 API Token** with Object Read & Write permissions

## Installation

### 1. Install Velero CLI

```bash
# macOS
brew install velero

# Linux
curl -LO https://github.com/vmware-tanzu/velero/releases/download/v1.13.0/velero-v1.13.0-linux-amd64.tar.gz
tar -xvf velero-v1.13.0-linux-amd64.tar.gz
sudo mv velero-v1.13.0-linux-amd64/velero /usr/local/bin/
```

### 2. Configure R2 Credentials

```bash
# Copy template and fill in your credentials
cp credentials-velero.template credentials-velero

# Edit with your R2 Access Key ID and Secret Access Key
vim credentials-velero
```

The file should look like:
```ini
[default]
aws_access_key_id=YOUR_R2_ACCESS_KEY_ID
aws_secret_access_key=YOUR_R2_SECRET_ACCESS_KEY
```

### 3. Install Velero

```bash
# Set your Cloudflare Account ID
export R2_ACCOUNT_ID=your_cloudflare_account_id

# Run installation
./install.sh
```

### 4. Apply Backup Schedules

```bash
kubectl apply -f schedule.yml
```

### 5. Verify Installation

```bash
# Check Velero pods
kubectl get pods -n velero

# Check backup storage location
velero backup-location get

# Check schedules
velero schedule get
```

## Common Operations

### View All Backups

```bash
velero backup get
```

### Create Manual Backup

```bash
# Full backup with volumes
velero backup create manual-backup-$(date +%Y%m%d) \
  --include-namespaces education-management \
  --default-volumes-to-fs-backup=true \
  --wait

# Quick backup without volumes
velero backup create quick-backup-$(date +%Y%m%d) \
  --include-namespaces education-management \
  --wait
```

### View Backup Details

```bash
velero backup describe <backup-name> --details
velero backup logs <backup-name>
```

### Delete Old Backups

```bash
velero backup delete <backup-name>
```

## Restore Procedures

### Full Namespace Restore

```bash
# List available backups
velero backup get

# Restore entire namespace
velero restore create --from-backup <backup-name>

# Monitor restore progress
velero restore get
velero restore describe <restore-name>
```

### Restore to Different Namespace

```bash
velero restore create \
  --from-backup <backup-name> \
  --namespace-mappings education-management:education-management-restored
```

### Restore Specific Resources Only

```bash
# Restore only secrets and configmaps
velero restore create \
  --from-backup <backup-name> \
  --include-resources secrets,configmaps

# Restore only the database PVC
velero restore create \
  --from-backup <backup-name> \
  --include-resources persistentvolumeclaims
```

### Migrate to New Cluster

```bash
# On NEW cluster:

# 1. Install Velero with same R2 credentials
export R2_ACCOUNT_ID=your_account_id
./install.sh

# 2. Velero will discover existing backups from R2
velero backup get

# 3. Restore the namespace
velero restore create --from-backup <backup-name>

# 4. Verify
kubectl get all -n education-management
```

## Troubleshooting

### Check Velero Logs

```bash
kubectl logs deploy/velero -n velero --tail=50
```

### Backup Storage Location Unavailable

```bash
# Check status
velero backup-location get

# Common causes:
# 1. Wrong R2 credentials
# 2. Bucket doesn't exist
# 3. API token lacks permissions

# Fix: Update credentials and restart
kubectl create secret generic cloud-credentials \
  --namespace velero \
  --from-file=cloud=./credentials-velero \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl rollout restart deployment/velero -n velero
```

### Backup Stuck or Failed

```bash
# Check backup status
velero backup describe <backup-name> --details

# Check logs for errors
velero backup logs <backup-name> | grep -i error

# Common issues:
# - Insufficient cluster resources (CPU/memory)
# - Volume backup timeout (increase timeout)
# - Network issues to R2
```

### Pod Volume Backup Failed

```bash
# Ensure node-agent is running on all nodes
kubectl get pods -n velero -l name=node-agent

# Check node-agent logs
kubectl logs -n velero -l name=node-agent --tail=50
```

## File Structure

```
velero/
├── README.md                 # This file
├── credentials-velero        # R2 credentials (gitignored)
├── credentials-velero.template  # Template for credentials
├── install.sh                # Installation script
└── schedule.yml              # Backup schedule definitions
```

## Security Notes

1. **credentials-velero** is gitignored - never commit actual credentials
2. R2 API tokens should have minimal required permissions
3. Rotate credentials periodically
4. Backup data is stored encrypted in R2

## Cost

| Resource | Cost |
|----------|------|
| Velero | Free (open-source) |
| R2 Storage (10GB) | Free tier |
| R2 Egress | Free (always) |
| **Total** | **$0/month** |

## Useful Links

- [Velero Documentation](https://velero.io/docs/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Velero AWS Plugin](https://github.com/vmware-tanzu/velero-plugin-for-aws)

## Support

For issues with this backup system:
1. Check Velero logs: `kubectl logs deploy/velero -n velero`
2. Check backup-location status: `velero backup-location get`
3. Verify R2 bucket exists and credentials are correct
