# Multi-Vendor E-Commerce Platform

A full-stack multi-vendor e-commerce platform where users can browse products, register as sellers, and manage their own stores and product listings.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Wouter (routing)
- TanStack Query (data fetching)
- Tailwind CSS + Radix UI (Shadcn UI pattern)
- React Hook Form + Zod (form validation)

**Backend:**
- Express.js (Node.js)
- Drizzle ORM + PostgreSQL
- Express Session (auth)
- bcrypt (password hashing)

**Shared:**
- Zod schemas in `shared/schema.ts`
- API contract in `shared/routes.ts`

## Project Structure

```
client/          - React frontend
  src/
    pages/       - Page components (Home, Login, Register, Dashboard)
    features/    - Business domain logic (products, stores)
    components/  - Reusable UI components
server/          - Express backend
  index.ts       - Server entry point
  routes.ts      - API routes
  storage.ts     - Database operations (Drizzle)
  db.ts          - Database connection
shared/          - Shared types and schemas
  schema.ts      - Drizzle + Zod schemas
  routes.ts      - API contract
```

## Key Features

- Multi-role system: buyers and sellers
- Store management (create, update store profiles)
- Product catalog with category filtering
- Session-based authentication with bcrypt password hashing
- Type-safe API with shared Zod schemas

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- Session secret stored as environment secret (SESSION_SECRET)
- Passwords stripped from all API responses
- Session-based authentication

## Running

Development: `npm run dev` (uses tsx, serves on port 5000)
Database push: `npm run db:push`

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit DB)
- `SESSION_SECRET` - Secret for session signing (stored as Replit secret)
- `PORT` - Server port (defaults to 5000)
