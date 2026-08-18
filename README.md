# My Events — Event Management Platform

An admin-only event management platform built with Next.js, PostgreSQL, and Prisma.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (credentials, JWT)
- **UI**: Tailwind CSS + shadcn/ui

## Project Setup

### 1. Environment Variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

Required values in `.env.local`:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/myevents_db"
AUTH_SECRET="..."      # run: npx auth secret
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install Dependencies

```bash
npm install
```

> **Note**: If `npm install` fails with network errors (Prisma downloads large engine binaries), try:
> ```bash
> npm install --fetch-retries=10 --fetch-retry-mintimeout=30000
> ```

### 3. Database Setup

```bash
# Run migrations (creates all tables)
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed the first admin user
npm run db:seed
```

Default admin credentials (change after first login):
- Email: `admin@myevents.com`
- Password: `Admin@1234!`

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/login`.

---

## Key Routes

| Route | Description |
|---|---|
| `/login` | Admin login |
| `/admin` | Dashboard |
| `/admin/events` | Events list |
| `/admin/events/[id]` | Event overview |
| `/admin/events/[id]/guests` | Guest management |
| `/admin/events/[id]/invitations` | Invitation links |
| `/admin/events/[id]/rsvps` | RSVP tracker |
| `/admin/events/[id]/reviews` | Review moderation |
| `/i/[code]` | Public invitation + RSVP (no login needed) |

---

## Database Scripts

```bash
npm run db:migrate    # Create/apply migrations
npm run db:seed       # Seed first admin user
npm run db:studio     # Open Prisma Studio (visual DB browser)
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:push       # Push schema without migration (dev only)
```
