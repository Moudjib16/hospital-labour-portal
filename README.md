# Hospital Labour Portal

A web application for hospitals to manage **labour & delivery reports**. Built with Next.js 16 (App Router), Prisma 7 + PostgreSQL, and NextAuth (Auth.js v5).

Doctors and administrators can record patient information, create detailed delivery reports (C-section / scheduled operation), and print or export them as PDF — directly from the site.

## Features

- **Authentication** — role-based login (ADMIN / DOCTOR) using NextAuth (Auth.js v5) with JWT sessions.
- **Dashboard** (`/tableau-de-bord`) — overview with key statistics.
- **Patients** (`/patients`) — patient list with clickable detail pages and report history.
- **Labour reports** (`/rapports`) — create, view, search & filter reports by patient, doctor, and operation type.
- **Search** (`/recherche`) — full-text search across report narratives (with highlighting) plus a patient search tab.
- **Print / PDF** — print a report exactly as it appears, straight from the browser.
- **Admin settings** (`/parametres`) — user management (create users, toggle active status, change roles).
- **About** (`/a-propos`) — developer credits and project overview.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, TypeScript)
- [Prisma 7](https://www.prisma.io) with `@prisma/adapter-pg` (PostgreSQL driver adapter)
- [PostgreSQL](https://www.postgresql.org) (Neon for production)
- [NextAuth v5](https://next-auth.js.org) (Credentials provider, JWT sessions)
- [Tailwind CSS](https://tailwindcss.com) + shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 20.19+ and npm
- A PostgreSQL database (local or Neon). The app expects a `DATABASE_URL` environment variable.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The repo includes a `.env.example` file with all required variables. Copy it to `.env` and fill in your values:

Linux / macOS:

```bash
cp .env.example .env
```

Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Open `.env` and set the required variables:

| Variable       | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (Prisma uses it directly). For Neon, paste the connection string from your database dashboard. |
| `AUTH_SECRET`  | Long random string used by NextAuth (Auth.js v5) to sign session JWTs.      |

Generate a secret with:

```bash
openssl rand -base64 32
```

Example `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
AUTH_SECRET="replace-with-a-random-secret"
```

### 3. Set up the database

Generate the Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Seed the database with an admin account and demo data (optional):

```bash
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Default seeded accounts

After running `npx prisma db seed`:

| Username    | Role   | Password   |
| ----------- | ------ | ---------- |
| `admin`     | ADMIN  | `admin123` |
| `b.kacem`   | DOCTOR | `admin123` |
| `y.belhadi` | DOCTOR | `admin123` |

> **Note:** change these passwords before using in production.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the development server.        |
| `npm run build`     | Generate Prisma Client + build Next. |
| `npm run start`     | Run the production server.           |
| `npm run lint`      | Run ESLint.                          |
| `npx prisma migrate deploy` | Apply database migrations.    |
| `npx prisma db seed`        | Seed the database.             |

## Project Structure

```
prisma/
  schema.prisma        # Prisma schema (models, enums)
  migrations/          # SQL migration files
  seed.ts              # Database seed script
prisma.config.ts       # Prisma 7 config (datasource URL, seed command, migration path)
src/
  app/
    (dashboard)/       # Authenticated app pages
      tableau-de-bord/ # Dashboard
      patients/        # Patient list + detail
      rapports/        # Reports list, detail, create
      recherche/       # Full-text search
      parametres/      # Admin user management
      a-propos/        # About page
    connexion/         # Login page
    api/auth/          # NextAuth route handlers
  actions/             # Server actions (reports, users)
  auth.config.ts       # Edge-safe shared Auth.js config
  auth.ts              # NextAuth configuration
  generated/prisma/    # Generated Prisma client
  proxy.ts             # Next.js 16 auth middleware
  components/          # UI + feature components
  lib/                 # db client, search, utils, labels
  types/               # Session/JWT type augmentation
```
