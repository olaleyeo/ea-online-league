# Kubernetes Deployment Guide

This guide details how to deploy the EA Online League application to a Kubernetes cluster.

## Prerequisites
- A running Kubernetes cluster (e.g., EKS, GKE, AKS, or minikube).
- `kubectl` configured to interact with your cluster.
- An Ingress controller (like NGINX) installed.
- cert-manager installed (if you want automatic TLS certificates).

## 1. Apply Secrets & ConfigMaps
Before deploying the application, you must populate your cluster with the required configuration and secrets.

Open `k8s/secret.yaml` and replace the placeholder values with your actual Supabase Base64 encoded connection strings, OR deploy it directly using `kubectl`:

```bash
kubectl create secret generic ea-league-secrets \
  --from-literal=DATABASE_URL="postgresql://postgres.[ref]:[pw]@..." \
  --from-literal=DIRECT_URL="postgresql://postgres.[ref]:[pw]@..."

kubectl apply -f k8s/configmap.yaml
```

## 2. Deploy the Application
Apply the Deployments and Services:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## 3. Configure Ingress (Routing & TLS)
Open `k8s/ingress.yaml` and update the `host: app.ealeague.com` field to match your actual domain name. Then apply it:

```bash
kubectl apply -f k8s/ingress.yaml
```

## 4. Enable Autoscaling
To enable the Horizontal Pod Autoscalers (HPA), your cluster must have the Metrics Server installed. Once installed, apply the HPA manifests:

```bash
kubectl apply -f k8s/hpa.yaml
```

## 5. Helm Alternative
If you prefer managing deployments via Helm instead of raw manifests, you can use the provided chart:

```bash
cd charts/league-app
helm install ea-league-app . \
  --set secrets.DATABASE_URL="your-db-url" \
  --set secrets.DIRECT_URL="your-direct-url"
```
