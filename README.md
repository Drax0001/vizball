# Vizball Play Pro

Official website for Vizball, a team sport created in Cameroon: news, forum, equipment shop, club locator map, event calendar, governance documents, video tutorials, and an admin dashboard.

See [CODEBASE_INDEX.md](CODEBASE_INDEX.md) for a full architecture reference. This file is just a quick start. For deploying to a production VPS, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Stack

- **Frontend**: React 18 + Vite + Tailwind/shadcn, in the repo root.
- **Backend**: Express + Bun + SQLite, in `server/`.

## Running locally

You need [Bun](https://bun.sh) installed for the backend, and Node/npm for the frontend.

**1. Backend**

```
cd server
cp .env.example .env   # edit JWT_SECRET before deploying anywhere real
bun install
bun run dev             # http://localhost:5000
```

The database (`server/vizball.db`) is created and seeded automatically on first run — no manual migration step.

**2. Frontend**

```
npm install
npm run dev              # http://localhost:5173, proxies /api and /uploads to the backend
```

Other frontend scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## Admin access

`/admin` is gated behind a single seeded admin account (see `server/seedData.ts`). Log in there to manage articles, products, clubs, events, and forum moderation.
