# Portfolio Backend API

Production-ready Express backend for the Next.js portfolio frontend.

## Stack

- Node.js + Express (ES modules)
- MongoDB + Mongoose
- JWT auth (admin)
- bcrypt password hashing
- Cloudinary image uploads
- Nodemailer email notifications
- Input validation + sanitization
- Contact rate-limiting + central error handling

## Folder Structure

```txt
backend/
  config/
    db.js
    cloudinary.js
    email.js
  controllers/
    authController.js
    caseStudyController.js
    projectController.js
    blogController.js
    contactController.js
  models/
    AdminUser.js
    CaseStudy.js
    Project.js
    BlogPost.js
    Contact.js
  routes/
    authRoutes.js
    caseStudyRoutes.js
    projectRoutes.js
    blogRoutes.js
    contactRoutes.js
  middleware/
    authMiddleware.js
    errorHandler.js
  utils/
    slugify.js
  server.js
  seedAdmin.js
  .env.example
```

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Update `.env` values:
- `MONGO_URI`
- `JWT_SECRET`
- Cloudinary credentials
- SMTP credentials
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`

4. Seed first admin:

```bash
npm run seed:admin
```

5. Run backend at port 5000:

```bash
npm run dev
```

Health check:

- `GET http://localhost:5000/api/health`

## API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Case Studies
- `POST /api/case-studies` (admin)
- `GET /api/case-studies` (public)
- `GET /api/case-studies/:slug` (public)
- `PUT /api/case-studies/:id` (admin)
- `DELETE /api/case-studies/:id` (admin)

### Projects
- `POST /api/projects` (admin)
- `GET /api/projects` (public)
- `GET /api/projects/:slug` (public)
- `PUT /api/projects/:id` (admin)
- `DELETE /api/projects/:id` (admin)

### Blog
- `POST /api/blog` (admin)
- `GET /api/blog` (public)
- `GET /api/blog/:slug` (public)
- `PUT /api/blog/:id` (admin)
- `DELETE /api/blog/:id` (admin)

### Contact
- `POST /api/contact` (public, rate-limited, stores in DB + sends email)
- `GET /api/contact` (admin)

## Auth Usage

`POST /api/auth/login` returns a `token`.  
Use this in protected requests:

```txt
Authorization: Bearer <JWT_TOKEN>
```

## Postman-ready request examples

### 1) Login

`POST http://localhost:5000/api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "change_me_123456"
}
```

### 2) Create Case Study (admin)

`POST http://localhost:5000/api/case-studies`

```json
{
  "title": "Clinic KPI Automation System",
  "description": "Automated KPI tracking for clinical operations.",
  "tags": ["KPI", "Automation", "Healthcare"],
  "heroImage": "data:image/png;base64,iVBORw0KGgoAAA...",
  "sections": [
    {
      "heading": "Problem",
      "text": "Manual reporting delayed decisions.",
      "image": "data:image/png;base64,iVBORw0KGgoAAA..."
    }
  ]
}
```

### 3) Create Project (admin)

`POST http://localhost:5000/api/projects`

```json
{
  "title": "Tableau Dashboards",
  "description": "Executive KPI dashboards.",
  "tags": ["Tableau", "BI"],
  "thumbnail": "data:image/png;base64,iVBORw0KGgoAAA...",
  "github": "https://github.com/your/repo",
  "liveDemo": "https://your-demo.com",
  "images": ["data:image/png;base64,iVBORw0KGgoAAA..."]
}
```

### 4) Create Blog Post (admin)

`POST http://localhost:5000/api/blog`

```json
{
  "title": "Designing KPI Systems",
  "content": "<h2>Intro</h2><p>This is a rich text blog body.</p>",
  "tags": ["KPI", "Analytics"],
  "coverImage": "data:image/png;base64,iVBORw0KGgoAAA..."
}
```

### 5) Contact form submit (public)

`POST http://localhost:5000/api/contact`

```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "message": "I need help designing analytics dashboards."
}
```

## Connect Next.js Frontend (App Router)

1. Add frontend env in project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

2. Replace static data in `src/lib/portfolio-data.ts` with fetch calls, for example:

- `/case-studies` page -> `GET ${NEXT_PUBLIC_API_BASE_URL}/case-studies`
- `/case-studies/[slug]` -> `GET ${NEXT_PUBLIC_API_BASE_URL}/case-studies/:slug`
- `/projects` -> `GET ${NEXT_PUBLIC_API_BASE_URL}/projects`
- `/blog` -> `GET ${NEXT_PUBLIC_API_BASE_URL}/blog`
- `/contact` form submit -> `POST ${NEXT_PUBLIC_API_BASE_URL}/contact`

3. For admin panel requests, include JWT bearer token.

## Notes

- Password hashes are never returned from API.
- HTML content in blog is sanitized server-side.
- Contact endpoint has built-in rate limiting.
- CORS allows `http://localhost:3000` by default.

