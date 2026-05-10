# Digital Pylot RBAC

Railway-ready full-stack RBAC monorepo with a Next.js frontend, NestJS backend, and PostgreSQL database.

## Structure

- `apps/frontend` - Next.js App Router frontend
- `apps/backend` - NestJS REST API with Prisma
- `apps/backend/prisma/schema.prisma` - PostgreSQL schema
- `apps/backend/prisma/seed.ts` - demo users, roles, and permission atoms

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment examples:

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

3. Set `DATABASE_URL` to a PostgreSQL connection string.

4. Push schema and seed data:

```bash
npm run db:migrate
npm run db:seed
```

5. Run apps:

```bash
npm run dev
```

## Demo Credentials

All seeded users use this password:

```text
Password123!
```

- Admin: `admin@digitalpylot.test`
- Manager: `manager@digitalpylot.test`
- Agent: `agent@digitalpylot.test`
- Customer: `customer@digitalpylot.test`

## Railway Deployment

Create one Railway project with three services.

### 1. PostgreSQL Service

- Add Railway PostgreSQL.
- Copy or reference its `DATABASE_URL` into the backend service.

### 2. Backend Service

- Source: same GitHub monorepo
- Root directory: `apps/backend`
- Build command: `npm run railway:build`
- Start command: `npm run railway:start`
- Required variables:

```text
DATABASE_URL=<Railway PostgreSQL URL>
FRONTEND_URL=<Railway frontend public URL>
JWT_ACCESS_SECRET=<long random secret>
JWT_REFRESH_SECRET=<long random secret>
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
COOKIE_SECURE=true
NODE_ENV=production
```

After the first deploy, run the seed command once from Railway shell or a one-off job:

```bash
npm run db:seed
```

Health check endpoint:

```text
GET /health
```

### 3. Frontend Service

- Source: same GitHub monorepo
- Root directory: `apps/frontend`
- Build command: `npm run build`
- Start command: `npm run start`
- Required variables:

```text
NEXT_PUBLIC_API_URL=<Railway backend public URL>
```

## Railway Notes

- The backend listens on `process.env.PORT`, which Railway injects automatically.
- The frontend start command binds to `0.0.0.0` for Railway compatibility.
- Refresh tokens are sent as `httpOnly` cookies.
- Access tokens are returned by the API and should be held in memory by the frontend auth layer during full implementation.
- CORS is restricted by `FRONTEND_URL`.

## Verification Checklist

- Backend `/health` returns `status: ok`.
- Database migrations deploy successfully.
- Seeded demo users exist.
- Frontend loads using Railway public URL.
- `NEXT_PUBLIC_API_URL` points to the deployed backend.
- Backend `FRONTEND_URL` points to the deployed frontend.
