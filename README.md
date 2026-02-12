# Portfolio — Knowledge Hub & Analytics Platform

A full-stack platform combining publishing, data dashboards, community discussions, and structured learning.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (REST)
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js (credentials provider, JWT session)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (for Phase 2+)

### Installation

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Add `DATABASE_URL` for PostgreSQL, e.g.:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_dev"
```

### Database Setup (Phase 2+)

1. Create the database (if needed):
   ```bash
   createdb portfolio_dev
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

3. Seed development data:
   ```bash
   npm run db:seed
   ```

4. Open Prisma Studio (optional):
   ```bash
   npm run db:studio
   ```

**Auth (Phase 3):** Add to `.env`:
```
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

**Seed users** (passwords):
- `admin@example.com` / `admin123`
- `author@example.com` / `author123`
- `member@example.com` / `member123`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages & layouts
│   ├── api/          # API routes (REST)
│   └── ...
├── components/       # React components
│   └── layout/       # Navbar, Footer, etc.
└── lib/              # Utilities, db client, etc.
prisma/
├── migrations/       # SQL migrations
├── schema.prisma     # Database schema
└── seed.ts           # Seed script
```

## Phases

1. ✅ **Phase 1** — Project setup, layout, placeholder pages
2. ✅ **Phase 2** — Database & ORM
3. ✅ **Phase 3** — Auth & roles
4. ✅ **Phase 4** — Content (posts)
5. ✅ **Phase 5** — Comments & discussions
6. ✅ **Phase 6** — Files & attachments
7. Phase 7 — Dashboards & analytics
8. Phase 8 — Topics & series
9. Phase 9 — Polish & UX
