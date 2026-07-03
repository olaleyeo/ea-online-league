# Render Deployment Guide

This guide covers deploying the backend to Render.com. The backend is fully optimized to run on Render via **either** their Native Node environment or their Docker environment.

## Option 1: Native Node Deployment (Recommended for Speed)
By default, if you don't select a Docker runtime, Render runs standard Node.js applications.

1. **Connect Repository**: Select your GitHub repository.
2. **Environment**: Select `Node`.
3. **Build Command**: `npm install && npm run build`
   *(Note: The `postinstall` script in package.json automatically runs `prisma generate` during `npm install`)*.
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `DATABASE_URL`: Add your Supabase Pooler URL (Port 6543, `?pgbouncer=true`).
   - `DIRECT_URL`: Add your Supabase Pooler URL (Port 5432).
6. **Deploy!**

## Option 2: Docker Deployment
If you prefer running inside a container, the repository includes a highly optimized, multi-stage Dockerfile that strips out the TypeScript compiler and development dependencies.

1. **Connect Repository**: Select your GitHub repository.
2. **Environment**: Select `Docker`.
3. **Dockerfile Path**: `backend/Dockerfile`
4. **Context Directory**: `backend`
5. **Environment Variables**:
   - `DATABASE_URL`: Add your Supabase Pooler URL (Port 6543, `?pgbouncer=true`).
6. **Deploy!**

Render will build the image, run `npm ci`, and start the container using the compiled `/dist/server.js`.
