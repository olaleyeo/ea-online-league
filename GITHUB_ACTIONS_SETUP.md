# GitHub Actions Setup Guide

To make the CI/CD pipelines work, you must configure secrets in your GitHub repository.

## Adding Secrets
1. Go to your repository on GitHub.
2. Click **Settings** -> **Secrets and variables** -> **Actions**.
3. Click **New repository secret**.

## Required Secrets List

### Database Secrets (For `migrate.yml`)
- `DATABASE_URL`: Your Supabase connection string (pooler port 6543).
- `DIRECT_URL`: Your Supabase direct connection string (port 5432).

### Vercel Deployment Secrets (For `frontend.yml`)
To automatically deploy to Vercel, you need three tokens from your Vercel account:
- `VERCEL_TOKEN`: Generate this at [vercel.com/account/tokens](https://vercel.com/account/tokens).
- `VERCEL_ORG_ID`: Found in your Vercel project settings or `.vercel/project.json` if you link locally.
- `VERCEL_PROJECT_ID`: Found in the same place.

### Environment Secrets (For frontend build)
- `VITE_API_URL`: The URL of your production backend (e.g., `https://api.ealeague.com/api`).

### Render Deployment Secrets (For `backend.yml`) - *Optional*
If you use the Render API to trigger deploys:
- `RENDER_API_KEY`: Generate this in your Render account settings.

## Rollbacks
If a deployment fails:
1. **Frontend**: Go to the Vercel dashboard and click "Promote to Production" on the previous successful build.
2. **Backend**: If using Render, go to the Render dashboard and click "Rollback" to the previous commit.
3. **Database**: If a database migration caused the issue, you will need to manually write a down-migration or revert the schema and push a fix. (Prisma does not have automatic `migrate rollback` out of the box in prod).
