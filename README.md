# Digital Pylot RBAC

A full-stack RBAC application built as a monorepo with a Next.js frontend, NestJS backend, and PostgreSQL database.

## Live Deployment

- App: https://frontend-production-4d28.up.railway.app

## Stack

- Monorepo managed with npm workspaces (`apps/frontend`, `apps/backend`)
- Hosting: Railway (separate services for the frontend and backend)
- Database: Neon (serverless PostgreSQL)
- ORM: Prisma
- Auth: JWT access tokens + httpOnly refresh cookies

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

