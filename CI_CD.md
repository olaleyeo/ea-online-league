# CI/CD Architecture

This project uses **GitHub Actions** for Continuous Integration and Continuous Deployment (CI/CD). 

The pipelines are divided into three specific workflows located in `.github/workflows/`:

## 1. Backend Workflow (`backend.yml`)
**Triggers**: Pushes to the `main` branch when files in the `backend/` directory are changed.
**What it does**:
- Checks out the code and sets up Node 20.
- Installs dependencies and generates the Prisma client.
- Runs any configured tests.
- Contains a placeholder step to trigger a Render deployment hook if deploying to Render via API.

## 2. Frontend Workflow (`frontend.yml`)
**Triggers**: Pushes to the `main` branch when files in the `frontend/` directory are changed.
**What it does**:
- Checks out the code and sets up Node 20.
- Builds the Vite application.
- Uses the official Vercel Action to automatically deploy the compiled output directly to Vercel production.

## 3. Database Migrations Workflow (`migrate.yml`)
**Triggers**: 
- Pushes to `main` modifying `schema.prisma` or the `migrations/` folder.
- **Manual Trigger** (`workflow_dispatch`) from the GitHub Actions UI.
**What it does**:
- Securely connects to your production Supabase database via secrets.
- Runs `npx prisma migrate deploy` to apply new SQL structures to your production database without losing data.
- **Note**: Never run `prisma migrate dev` against production; `deploy` is the safe, non-destructive command.
