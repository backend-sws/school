# 🔒 SSL Certificate Management

SSL certificates for all environments using cert-manager and Let's Encrypt.

## Quick Setup

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Deploy issuers
kubectl apply -f cluster-issuers/

# Deploy certificates
kubectl apply -f certificates/dev/
kubectl apply -f certificates/staging/
kubectl apply -f certificates/prod/
```

## Environments

- **Dev**: `dev.sutracode.in` (staging issuer)
- **Staging**: `staging.sutracode.in` (prod issuer)
- **Production**: `sutracode.in` (prod issuer)

## Commands

```bash
# Check certificates
kubectl get certificates --all-namespaces

# Check status
kubectl describe certificate sutracode-prod -n prod

# Force renewal
kubectl patch certificate sutracode-prod -n prod -p '{"spec":{"renewBefore":"720h"}}'
``` 