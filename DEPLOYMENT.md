# Deployment & Security Guide

This guide covers running your Portfolio app locally and deploying both the **Next.js frontend** (Vercel) and the **Express + MongoDB backend** (`backend/`) so `/studio` uploads work live.

---

## Deploying the Express Backend + Connecting Vercel (Required for `/studio` Uploads)

Vercel only hosts the Next.js frontend. To upload case studies, projects, blog posts, writing drafts, and attachments on your live site, deploy `backend/` separately and point Vercel at it:

### Step 1: Database (MongoDB Atlas — free tier)
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access (`0.0.0.0/0` for Render/Railway).
3. Copy your connection string (`MONGO_URI`), e.g.:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio_db?retryWrites=true&w=majority`

### Step 2: Persistent File Storage (Cloudinary — free tier, recommended)
Free Node hosts (like Render free tier) wipe local disk on restart/redeploy. To keep uploaded images, PDFs, and attachments permanently:
1. Create a free account at [cloudinary.com](https://cloudinary.com) and copy your `Cloud Name`, `API Key`, and `API Secret`.
2. Set `STORAGE_PROVIDER=cloudinary` along with the `CLOUDINARY_*` env vars below.

### Step 3: Deploy `backend/` on Render (or Railway)
You can deploy automatically using the included [`render.yaml`](./render.yaml) Blueprint on Render (**New → Blueprint**), or create a **Web Service** manually pointing to this GitHub repository:
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm run seed:admin && npm start` *(idempotent: creates your admin user on first boot, skips if already created)*
   - **Health Check Path**: `/api/health`
2. Add these Environment Variables on Render/Railway:
   - `NODE_ENV=production`
   - `MONGO_URI=<your MongoDB Atlas URI>`
   - `JWT_SECRET=<random 32+ char string>`
   - `JWT_EXPIRES_IN=7d`
   - `ADMIN_EMAIL=<your login email>`
   - `ADMIN_PASSWORD=<your strong password>`
   - `CORS_ORIGIN=https://<your-vercel-domain>.vercel.app`
   - `BACKEND_PUBLIC_URL=https://<your-backend-service>.onrender.com`
   - `STORAGE_PROVIDER=cloudinary` *(or `local` if you attach a persistent disk)*
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` *(when using Cloudinary)*
3. Verify `https://<your-backend-service>.onrender.com/api/health` returns `{"success":true,"message":"Backend is running"}`.

### Step 4: Connect Your Live Vercel Frontend
In Vercel → **Project → Settings → Environment Variables**, add:
- `BACKEND_PUBLIC_URL` = `https://<your-backend-service>.onrender.com`
- `BACKEND_API_BASE_URL` = `https://<your-backend-service>.onrender.com/api`
- `NEXTAUTH_SECRET` = `<random 32+ char string>`
- `NEXTAUTH_URL` = `https://<your-vercel-domain>.vercel.app`

Then **Redeploy** on Vercel and visit `https://<your-vercel-domain>.vercel.app/studio` to sign in and upload your works.

> **Note on upload sizes on Vercel:** Vercel Serverless Functions cap request bodies at **4.5 MB** when proxying through `/api/backend/*`. Keep individual uploads under ~4 MB when uploading through Vercel, or host the Next.js app on Railway/Render/VPS for larger files.

---

## Deployment Options (Optional PostgreSQL Features: `/posts`, `/dashboards`, `/discussions`, `/topics`)

### Recommended: Vercel + Neon/Supabase (PostgreSQL)

1. **Database**: Create a [Neon](https://neon.tech) or [Supabase](https://supabase.com) PostgreSQL database (free tier).
2. **Deploy to Vercel**:
   - Push your code to GitHub
   - Import the repo at [vercel.com/new](https://vercel.com/new)
   - Add environment variables (see below)
   - For file uploads: Vercel has ephemeral filesystem. Use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or S3 for persistent storage.

### Alternative: Railway / Render / Fly.io

These platforms support Node.js + PostgreSQL + persistent disk in one place:

- **Railway**: [railway.app](https://railway.app) – simple, good for full-stack
- **Render**: [render.com](https://render.com) – free tier available
- **Fly.io**: [fly.io](https://fly.io) – global deployment

---

## Environment Variables (Production)

Set these in your hosting provider’s dashboard:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string from Neon/Supabase/Railway |
| `NEXTAUTH_SECRET` | Yes | Random string. Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Your live URL, e.g. `https://yourportfolio.vercel.app` |
| `ADMIN_EMAIL` | No | Your admin email for seed (optional) |

**Important**: Never commit `.env` or secrets to Git. `.env` is in `.gitignore`.

---

## Security Checklist

### Already implemented

- **Security headers**: X-Frame-Options, X-Content-Type-Options, CSP, etc.
- **Path traversal protection**: File paths are validated before access
- **Rate limiting**: Registration (5/15min), Login (10/15min), Uploads (20/min)
- **Auth**: bcrypt passwords, JWT sessions, role-based access
- **Moderation**: User submissions require admin approval before going live

### You should do

1. **NEXTAUTH_SECRET**  
   - Generate a strong random value: `openssl rand -base64 32`  
   - Use a different value for dev and production

2. **NEXTAUTH_URL**  
   - In production, set to your real domain (e.g. `https://yoursite.com`)

3. **Database**  
   - Use SSL for production DB connections (e.g. `?sslmode=require` in `DATABASE_URL`)

4. **File uploads**  
   - On Vercel, use Vercel Blob or S3; local disk is ephemeral  
   - Keep allowed file types and size limits tight (already configured)

5. **HTTPS**  
   - Vercel, Railway, Render provide HTTPS by default

6. **Admin account**  
   - Change the default admin password after first login  
   - Use `ADMIN_EMAIL` in env so the seed creates your real admin email

---

## File Uploads on Vercel

Vercel’s filesystem is read-only except for `/tmp`, which is not persistent. For production:

1. **Vercel Blob** (recommended):  
   - `npm install @vercel/blob`  
   - Use `put()` instead of writing to disk  
   - See: https://vercel.com/docs/storage/vercel-blob

2. **S3 / R2**  
   - Use AWS S3 or Cloudflare R2 for persistent storage  
   - Update `src/lib/storage.ts` to use the chosen provider

---

## Migrating the Database

After setting `DATABASE_URL` in production:

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Quick Deploy (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login and deploy
vercel

# 3. Add env vars in Vercel dashboard: Project → Settings → Environment Variables
```

---

## Monitoring

- Use **Vercel Analytics** or similar for traffic and errors
- Check logs for failed auth attempts or errors
- Keep dependencies updated: `npm audit` and `npm update`
