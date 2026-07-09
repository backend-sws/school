```bash
#!/bin/bash
set -e

# =============================================================================
# Kubernetes Deployment Script for Education Management System
# =============================================================================

NAMESPACE="education-management"
CONTEXT="${KUBE_CONTEXT:-linode}"

echo "🚀 Deploying Education Management System to Kubernetes"
echo "----------------------------------------------------"

# Create namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

echo "� Deploying Education Management System application..."
kubectl apply -f k8s/base-manifest/namespace.yml
kubectl apply -f k8s/base-manifest/ghcr-secret.yml

# Deploy global config
echo "⚙️  Deploying global configuration..."
kubectl apply -f k8s/base-manifest/global-config.yml

# Deploy cert-manager resources
echo "🔒 Setting up SSL certificates..."
kubectl apply -f k8s/certmanager/acme-issuer-cms.yaml
kubectl apply -f k8s/certmanager/certificates/cms/certificate.yaml

# Deploy application
echo "🚀 Deploying Education Management System application..."
kubectl apply -f k8s/base-manifest/platform.yml

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking deployment status..."
kubectl get pods -n $NAMESPACE

echo ""
echo "🌐 Access your application at:"
echo "   https://ems.sutracode.in"
echo ""
echo "📝 View logs with:"
echo "   kubectl logs -f -l app=ems-app -n $NAMESPACE"
