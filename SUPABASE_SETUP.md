# Supabase Production Setup Guide

This guide covers provisioning a new Supabase project for the EA Online League application.

## 1. Create Supabase Project
1. Go to [database.new](https://database.new) and sign in.
2. Create a new project.
3. Select a **Region closest to Europe** (e.g., Frankfurt or London).
4. Enter a strong database password (store this safely).
5. Wait for the database to finish provisioning (~2 minutes).

## 2. Generate Connection Strings
Once provisioned, go to **Project Settings -> Database**:
1. Scroll down to **Connection string** (URI).
2. Note your standard connection string (this uses pgBouncer for connection pooling automatically in Supabase).
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
3. Scroll to **Connection pooling** and check the box for "Use connection pooling".
4. To get the `directUrl` (used for running migrations), look for the connection string that connects directly to port `5432` without the pooler.

## 3. Configure Supabase Security & Backups
1. **Row Level Security (RLS)**: By default, Prisma bypasses RLS when connecting via the postgres user. If you use the Supabase Data API later, ensure RLS is enabled on all tables (Authentication -> Policies -> Enable RLS). For this backend, Prisma accesses everything securely via the server.
2. **Backups**: Go to **Database -> Backups** in Supabase and ensure Point-in-Time Recovery (PITR) or daily automated backups are enabled.
3. **Logs & Performance**: Go to **Logs -> Explorer** to monitor queries.

## 4. Database Migrations
Once you have your `DATABASE_URL` and `DIRECT_URL` configured in your `.env` file (see `DATABASE_ENV.md`):

1. Generate the initial migration files:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```
2. For production deployment, your CI/CD pipeline will automatically run:
   ```bash
   npx prisma migrate deploy
   ```
