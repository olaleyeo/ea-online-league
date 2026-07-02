# Docker Deployment Guide

This document outlines how to build and run the EA Online League using Docker and Docker Compose.

## Prerequisites
- Docker Engine and Docker Compose installed.

## 1. Environment Setup
Before running the stack, you need to configure your environment variables. 
1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
2. Open `.env` and fill in your Supabase connection strings:
```env
DATABASE_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:5432/postgres"
VITE_API_URL="http://localhost:3001/api" # For local testing
```

## 2. Build and Run the Stack
To build the Docker images and start the containers, run:

```bash
docker compose build
docker compose up -d
```

- The `backend` will be available at `http://localhost:3001`
- The `frontend` (served via NGINX) will be available at `http://localhost:8080`

## 3. Database Migrations
If this is the first time running the app, you need to apply the Prisma migrations to your Supabase database:

```bash
docker compose exec backend npx prisma migrate deploy
```

## 4. Teardown
To stop the containers and remove them:

```bash
docker compose down
```
