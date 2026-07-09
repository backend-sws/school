# Kubernetes Infrastructure for Education Management System

This directory contains Kubernetes manifests for deploying the Education Management System to Linode Kubernetes Engine (LKE).

## 📁 Directory Structure

```
infra/
├── k8s/
│   ├── base-manifest/
│   │   ├── namespace.yml           # Namespace definition
│   │   ├── global-config.yml       # Global ConfigMap
│   │   ├── postgres.yml            # PostgreSQL database
│   │   ├── postgres-init.yml       # Database initialization job
│   │   ├── platform.yml            # Laravel application
│   │   ├── adminer.yml             # Database management UI
│   │   ├── r2-credentials.yml      # Cloudflare R2 backup credentials
│   │   └── postgres-backup.yml     # pg_dump backup CronJobs
│   └── certmanager/
│       ├── acme-issuer-nepgram.yaml        # Let's Encrypt issuer
│       └── certificates/
│           └── nepgram/
│               └── certificate.yaml         # SSL certificate
├── velero/
│   ├── credentials-velero          # R2 credentials for Velero
│   ├── install.sh                  # Velero installation script
│   └── schedule.yml                # Backup schedule definitions
├── deploy.sh                       # Deployment script
└── README.md                       # This file
```

## 🚀 Deployment

### Prerequisites

1. **kubectl** configured with Linode cluster access
2. **cert-manager** installed in the cluster
3. **nginx-ingress-controller** installed
4. **GitHub Container Registry** secret created

### Create GitHub Registry Secret

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<your-github-username> \
  --docker-password=<your-github-token> \
  --namespace=education-management
```

### Deploy

```bash
cd infra
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Configuration

### Update Secrets

**Database Password:**
```bash
kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_PASSWORD='your-secure-password' \
  --namespace=education-management \
  --dry-run=client -o yaml | kubectl apply -f -
```

**Application Secrets:**
```bash
# Generate Laravel APP_KEY
docker run --rm ghcr.io/sutracodehq-ui/education-system-management:latest \
  php artisan key:generate --show

# Update secret
kubectl create secret generic ems-app-secret \
  --from-literal=DB_USERNAME='ems_user' \
  --from-literal=DB_PASSWORD='your-db-password' \
  --from-literal=APP_KEY='base64:...' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --namespace=education-management \
  --dry-run=client -o yaml | kubectl apply -f -
```

## 📊 Monitoring

### View Pods
```bash
kubectl get pods -n education-management
```

### View Logs
```bash
# Application logs
kubectl logs -f -l app=ems-app -n education-management

# PostgreSQL logs
kubectl logs -f -l app=postgres -n education-management
```

### Describe Resources
```bash
kubectl describe ingress ems-app-ingress -n education-management
kubectl describe certificate education-management-tls -n education-management
```

## 🔄 Updates

### Update Application Image

```bash
# Update deployment with new image
kubectl set image deployment/ems-app \
  ems-app=ghcr.io/sutracodehq-ui/education-system-management:v1.0.0 \
  -n education-management

# Or rollout restart
kubectl rollout restart deployment/ems-app -n education-management
```

### Check Rollout Status
```bash
kubectl rollout status deployment/ems-app -n education-management
```

## 🗄️ Database

### Access PostgreSQL
```bash
kubectl exec -it deployment/postgres -n education-management -- \
  psql -U ems_user -d ems_db
```

### Access Adminer
Visit: https://ems.sutracode.in/adminer

## 🔒 SSL Certificates

Certificates are automatically managed by cert-manager using Let's Encrypt.

### Check Certificate Status
```bash
kubectl describe certificate education-management-tls -n education-management
```

### Force Certificate Renewal
```bash
kubectl delete certificate education-management-tls -n education-management
kubectl apply -f k8s/certmanager/certificates/nepgram/certificate.yaml
```

## 💾 Backup & Disaster Recovery

The backup system uses two complementary approaches:
- **pg_dump CronJob**: Daily SQL dumps to Cloudflare R2 (portable, data-only)
- **Velero**: Full cluster backup including volumes, secrets, and configs

**Storage**: Cloudflare R2 (free tier: 10GB, zero egress fees)

### Setup Cloudflare R2

1. Create R2 bucket named `cmsdbbackup` in Cloudflare Dashboard
2. Generate R2 API token with Object Read & Write permissions
3. Note your Cloudflare Account ID

### Deploy pg_dump Backup

```bash
# 1. Update R2 credentials (replace placeholders)
vim k8s/base-manifest/r2-credentials.yml

# 2. Apply credentials secret
kubectl apply -f k8s/base-manifest/r2-credentials.yml

# 3. Deploy backup CronJobs
kubectl apply -f k8s/base-manifest/postgres-backup.yml

# 4. Verify
kubectl get cronjobs -n education-management
```

### Deploy Velero (Full DR)

```bash
# 1. Update credentials
vim velero/credentials-velero

# 2. Set your R2 Account ID
export R2_ACCOUNT_ID=your_account_id

# 3. Run installation
cd velero
./install.sh

# 4. Apply backup schedules
kubectl apply -f schedule.yml

# 5. Verify
velero backup-location get
velero schedule get
```

### Manual Backup

```bash
# Trigger pg_dump manually
kubectl create job --from=cronjob/postgres-backup manual-backup-$(date +%s) -n education-management

# Trigger Velero backup manually
velero backup create manual-backup-$(date +%Y%m%d) --include-namespaces education-management
```

### Monitor Backups

```bash
# View pg_dump job status
kubectl get jobs -n education-management -l app=postgres-backup

# View pg_dump logs
kubectl logs -l app=postgres-backup -n education-management --tail=50

# View Velero backups
velero backup get

# Describe specific backup
velero backup describe <backup-name> --details
```

## 🔄 Restore Procedures

### Restore from pg_dump (Data Only)

Use this for quick data recovery or restoring to any PostgreSQL instance.

```bash
# 1. List available backups in R2
aws s3 ls s3://cmsdbbackup/postgres/daily/ \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# 2. Create a restore pod
kubectl run db-restore --rm -it \
  --image=alpine:3.19 \
  --namespace=education-management \
  -- /bin/sh

# 3. Inside the pod, install tools and restore
apk add --no-cache postgresql15-client aws-cli

export AWS_ACCESS_KEY_ID="<your-key>"
export AWS_SECRET_ACCESS_KEY="<your-secret>"
export PGPASSWORD="cms_password_123"

# Download backup
aws s3 cp s3://cmsdbbackup/postgres/daily/cms_db_YYYYMMDD_HHMMSS.sql.gz /tmp/ \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# Restore to database
gunzip -c /tmp/cms_db_YYYYMMDD_HHMMSS.sql.gz | psql -h cms-postgres -U cms_user -d cms_db
```

### Restore from Velero (Full Namespace)

Use this for complete disaster recovery including all K8s resources.

```bash
# List available backups
velero backup get

# Describe backup contents
velero backup describe cms-daily-backup-20260130030000 --details

# Full restore (same namespace)
velero restore create --from-backup cms-daily-backup-20260130030000

# Restore to different namespace
velero restore create \
  --from-backup cms-daily-backup-20260130030000 \
  --namespace-mappings education-management:education-management-restored

# Restore specific resources only
velero restore create \
  --from-backup cms-daily-backup-20260130030000 \
  --include-resources persistentvolumeclaims,secrets,deployments

# Monitor restore progress
velero restore get
velero restore describe <restore-name>
```

### Migrate to New Cluster

```bash
# On NEW cluster:

# 1. Install Velero with same R2 credentials
cd infra/velero
./install.sh

# 2. Velero will automatically discover backups from R2
velero backup get

# 3. Restore the namespace
velero restore create --from-backup cms-daily-backup-20260130030000

# 4. Verify
kubectl get all -n education-management
```

## 🧹 Cleanup

```bash
# Delete everything
kubectl delete namespace education-management

# Or delete specific resources
kubectl delete -f k8s/base-manifest/platform.yml
kubectl delete -f k8s/base-manifest/postgres.yml

# Delete Velero (if installed)
velero uninstall
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│  Internet                                       │
└──────────────┬──────────────────────────────────┘
               │
       ┌───────▼────────┐
       │ Nginx Ingress  │
       │ + Let's Encrypt│
       └───────┬────────┘
               │
    ┌──────────▼───────────┐
    │ Laravel App (×2)     │
    │ Port 80              │
    └──────────┬───────────┘
               │
       ┌───────▼────────┐
       │  PostgreSQL    │◄──────┐
       │  Port 5432     │       │
       └───────┬────────┘       │
               │                │
       ┌───────▼────────┐       │
       │  pg_dump       │       │
       │  CronJob       │       │
       └───────┬────────┘       │
               │                │
               ▼                │
    ┌──────────────────────┐    │
    │  Cloudflare R2       │◄───┤
    │  (Backup Storage)    │    │
    └──────────────────────┘    │
               ▲                │
               │                │
       ┌───────┴────────┐       │
       │    Velero      │───────┘
       │ (Full Cluster) │
       └────────────────┘
```

## 📝 Environment Variables

See `k8s/base-manifest/global-config.yml` for all environment variables.

## 🔗 Useful Links

- Application: https://ems.sutracode.in
- Adminer: https://ems.sutracode.in/adminer
- Swagger Docs: https://ems.sutracode.in/api/documentation
