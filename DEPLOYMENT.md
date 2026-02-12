# Deployment & Security Guide

This guide covers deploying your Portfolio app live and keeping it secure.

---

## Deployment Options

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
