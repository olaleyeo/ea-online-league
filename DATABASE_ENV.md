# Database Environment Variables

This document outlines the environment variables required for the production environment (to be injected into your server, Docker containers, or CI/CD pipelines).

## Backend Environment Variables

Create a `.env` file in the `backend/` directory or add these to your host provider (Render/Docker):

```env
# Connection string with connection pooling enabled (port 6543)
# Used by Prisma Client for queries
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection string (port 5432)
# Used strictly by Prisma CLI for migrations
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Optional: Supabase API keys if you interact with their Data API directly
SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## Prisma configuration for Shadow Database

If Prisma requires a shadow database on Supabase during `migrate dev` (usually not required if your user has database creation privileges, which the default Supabase `postgres` user does), you can add:
```env
SHADOW_DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres_shadow"
```
