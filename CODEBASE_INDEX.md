# Vizball Play Pro — Codebase Index

This is the reference map of the current codebase: what exists, what it does, and what's still open. It exists because `README.md` used to describe a defunct Base44 workflow — treat this file as the source of truth for architecture instead.

## 1. Project overview

Vizball is a fictional team sport (handball/dodgeball hybrid) played in Cameroon. This app is the sport's federation website: news, a forum, an equipment shop, a club locator map, an event calendar, governance documents, video tutorials, and an admin dashboard.

The app was originally built on **Base44**, a no-code backend platform. Base44's SDK was deleted on **2026-07-11** (see `BASE44_REMOVAL_DOCUMENTATION.md`), which broke all data persistence, auth, and file uploads. It was replaced with a hand-rolled **Express + Bun backend** in `server/`, backed by **SQLite** (via `bun:sqlite`), paired with a fetch-based API client in `src/api/client.js`.

Payments/Stripe remain explicitly **out of scope** — the SDKs are installed but nothing wires them up, and that's intentional.

## 2. Tech stack

**Frontend**
- React 18.2, Vite 6.1, JavaScript/JSX (project is JS-first — TypeScript is only used for `tsc` typechecking via `jsconfig.json`, plus the single file `src/utils/index.ts`)
- Tailwind CSS 3.4 + shadcn/ui ("new-york" style, `components.json`) on Radix UI primitives
- `react-router-dom` v6, flat route table, no lazy loading
- `@tanstack/react-query` is installed and a `QueryClientProvider` wraps the app (`src/lib/query-client.js`), but **no page actually uses `useQuery`/`useMutation`** — all fetching is manual `fetch`/`api.*` calls inside `useEffect`
- Cart state lives entirely in `localStorage` (`src/lib/cartStore.js`), no backend persistence
- Installed but **not wired up**: `@stripe/stripe-js` + `@stripe/react-stripe-js` (no checkout flow — deliberately left that way), `three` (purpose unclear, appears unused)
- Redundant pairs installed: `date-fns` + `moment`, `sonner` + `react-hot-toast`

**Backend** (`server/`)
- Express 4.19 running on **Bun** (`bun --hot run index.ts` for dev), TypeScript, split into `index.ts` (app assembly) + `db.ts` + `middleware.ts` + `routes/*.ts` (one file per resource)
- Auth: JWT (`jsonwebtoken`) + `bcryptjs` password hashing, secret and all config read from environment variables (`server/.env`, see `server/.env.example`) — nothing hardcoded
- Persistence: **SQLite** via Bun's built-in `bun:sqlite` (no extra native dependency, no separate DB service to run). Schema lives in `server/db.ts`; the DB file (`server/vizball.db`) is created and seeded automatically on first run from `server/seedData.ts` and is gitignored — it's regenerable, not something to hand-edit
- File uploads: `multer`, local disk storage under `server/uploads/` (gitignored except `.gitkeep`), served statically at `/uploads/*`

## 3. Directory structure

```
vizball-play-pro/
├── README.md                          # Quick start — see this file for architecture
├── BASE44_REMOVAL_DOCUMENTATION.md    # Changelog of the Base44 SDK removal (2026-07-11)
├── CODEBASE_INDEX.md                  # This file
├── DEPLOYMENT.md                      # Step-by-step Hostinger VPS deployment guide
├── deploy/                            # Nginx + systemd config templates referenced by DEPLOYMENT.md
├── package.json / vite.config.js / jsconfig.json / tailwind.config.js / components.json
├── dist/                              # Vite build output
├── server/
│   ├── index.ts                       # Express app assembly: CORS, static /uploads, mounts routers
│   ├── db.ts                          # bun:sqlite connection, schema migration, one-time seed
│   ├── middleware.ts                  # authenticateAdmin, optionalAuthenticate, signToken
│   ├── seedData.ts                    # Seed content (articles, products, clubs, tutorials, governance docs, ...)
│   ├── routes/
│   │   ├── auth.ts                    # login, register, me
│   │   ├── articles.ts, forum.ts, products.ts, clubs.ts, events.ts, visitors.ts
│   │   ├── tutorials.ts               # backs the /tutoriels page (previously frontend-only mock data)
│   │   ├── governance.ts              # backs the /gouvernance page documents
│   │   └── uploads.ts                 # POST /api/uploads (admin only, multer, local disk)
│   ├── uploads/                       # Uploaded files land here (gitignored, .gitkeep only)
│   ├── vizball.db                     # SQLite database file (gitignored, auto-created)
│   ├── .env / .env.example            # PORT, JWT_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN, DB_PATH, UPLOAD_DIR
│   └── package.json                   # express, cors, jsonwebtoken, bcryptjs, multer (Bun runtime)
└── src/
    ├── main.jsx / App.jsx / index.css
    ├── api/client.js                  # Hand-written fetch wrapper, mirrors server routes 1:1
    ├── lib/
    │   ├── AuthContext.jsx            # JWT auth state via api.auth.*
    │   ├── LanguageContext.jsx        # fr/en switch, plain context, persisted to localStorage['vizball_lang']
    │   ├── dateLocale.js              # getDateLocale(lang) — picks date-fns fr/enUS locale for formatting
    │   ├── tutorialLabels.js          # CATEGORY_LABELS/LEVEL_LABELS for tutorial data-value translation
    │   ├── cartStore.js               # localStorage cart, no backend
    │   ├── shopData.js                # CATEGORIES + CATEGORY_LABELS + formatPrice(lang); PRODUCTS array is now empty
    │   ├── query-client.js            # TanStack Query client (provider mounted, unused)
    │   └── utils.js / translations.js (~500 keys, fr/en) / app-params.js / PageNotFound.jsx
    ├── hooks/use-mobile.jsx
    ├── utils/index.ts                 # createPageUrl() — the one TS file in src/
    ├── components/
    │   ├── ui/                        # shadcn/ui primitives
    │   ├── Layout.jsx, Navbar.jsx, Footer.jsx, ChatbotButton.jsx, LanguageSwitcher.jsx,
    │   │   ProtectedRoute.jsx (unused — see §4), UserNotRegisteredError.jsx (translated, but its trigger path is still dead — see §4),
    │   │   VisitorCounter.jsx
    │   └── home/ news/ forum/ shop/ association/ gouvernance/ docs/ gallery/ rules/ tutorials/
    ├── pages/
    │   Home, LeSport, Association, Contact, Gouvernance, Actualites, ArticleDetail,
    │   Boutique, ProductDetail, Panier, Forum, Media, Tutoriels, AdminDashboard
    └── assets/images/
```

## 4. Frontend architecture

**Routes** (`src/App.jsx`), all wrapped in `Layout` except the 404 catch-all:

| Path | Page |
|---|---|
| `/` | Home |
| `/le-sport` | LeSport |
| `/association` | Association |
| `/contact` | Contact |
| `/gouvernance` | Gouvernance |
| `/actualites` | Actualites |
| `/actualites/:id` | ArticleDetail |
| `/boutique` | Boutique |
| `/boutique/panier` | Panier |
| `/boutique/:id` | ProductDetail |
| `/forum` | Forum |
| `/media` | Media |
| `/tutoriels` | Tutoriels — linked from the navbar (`tr.nav_tutorials`), no longer orphaned |
| `/admin` | AdminDashboard (does its own inline login-gate, not via `ProtectedRoute`) |
| `*` | PageNotFound |

**Auth**: `src/lib/AuthContext.jsx` wraps `api.auth.*` (`login`, `me`, `logout`), exposes `user`/`isAuthenticated`/`isLoadingAuth`. `src/components/ProtectedRoute.jsx` is a generic route guard but isn't used anywhere in `App.jsx` — `AdminDashboard.jsx` gates itself inline instead. `src/components/UserNotRegisteredError.jsx` is leftover from the Base44 auth flow; nothing sets that error type anymore, so the component itself is never mounted — but it was translated anyway during the i18n pass in case it's ever revived, rather than left as an English-only trap.

**State management**: no Redux/Zustand — per-page `useState`/`useEffect`, plus the two contexts above.

## 5. Backend (`server/`)

**Auth model**: the `users` table has a `role` of `'admin'` or `'user'`. One seeded admin account exists (`server/seedData.ts`). `POST /api/auth/register` lets anyone create a `'user'`-role account and returns a token, same as login. There's no frontend signup page — the register endpoint exists so forum posts can be attributed to a real account, but building a signup UI was left out of this pass since no such UI exists in the current frontend to begin with.

**Forum attribution**: `POST /api/forum/topics` and `.../replies` use `optionalAuthenticate` — if the request carries a valid token, `author_name`/`user_id` are taken from the authenticated user and the client-supplied `author_name` is ignored; otherwise it falls back to the guest `author_name` field, exactly like before. Anonymous posting still works; logging in just makes the attribution real.

Routes, all under `/api` (one file per resource in `server/routes/`):

| Resource | Routes | Auth |
|---|---|---|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` | — |
| Articles | `GET /articles` (optional auth — filters drafts), `GET /articles/:id`, `POST/PUT/DELETE /articles(/:id)`, `POST /articles/:id/view` | admin for write, view-tracking is public |
| Forum | `GET/POST /forum/topics`, `GET /forum/topics/:id` (with nested replies), `GET/POST /forum/topics/:id/replies`, `PUT/DELETE /forum/topics/:id` (pin/close/delete) | admin for pin/close/delete only — topic/reply creation is open to anyone, optionally authenticated |
| Products | `GET /products`, `POST/PUT/DELETE /products(/:id)` | admin for write |
| Clubs | `GET /clubs`, `POST/PUT/DELETE /clubs(/:id)` (lat/long for the map) | admin for write |
| Events | `GET /events`, `POST/PUT/DELETE /events(/:id)` | admin for write |
| Visitors | `GET/POST /visitors` (simple counter) | — |
| Tutorials | `GET /tutorials`, `POST/PUT/DELETE /tutorials(/:id)`, `POST /tutorials/:id/view` | admin for write, view-tracking is public |
| Governance documents | `GET /governance-documents`, `POST/PUT/DELETE /governance-documents(/:id)` | admin for write |
| Uploads | `POST /uploads` (multipart `file` field, returns `{ url }`, accepts JPEG/PNG/WEBP/GIF/PDF up to 10MB) | admin only |

Other notable properties: still no pagination or rate limiting, no automated tests. Input validation is ad hoc (`if` checks in each route), not a schema library — zod is installed on the frontend but not used server-side.

**Config**: everything reads from `process.env` (Bun loads `.env` automatically, no `dotenv` package needed) — `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `DB_PATH`, `UPLOAD_DIR`. See `server/.env.example`. `server/index.ts` throws on boot if `JWT_SECRET` is missing.

**Dev proxy**: `vite.config.js` proxies both `/api` and `/uploads` to `http://localhost:5000` for `vite dev`. In production the same same-origin effect is achieved by Nginx (serving the built `dist/` and reverse-proxying `/api`/`/uploads` to the backend) rather than Vite — see `DEPLOYMENT.md`. The backend binds to `127.0.0.1` only (`server/index.ts`, `HOST` env var), never directly reachable from outside the VPS.

## 6. API client (`src/api/client.js`)

Plain `fetch` wrapper, no axios, no retry/interceptor logic. `getAuthHeader()`/`getHeaders()` attach `Authorization: Bearer <token>` from `localStorage['vizball_auth_token']`. Namespaces: `api.auth` (now includes `register`), `api.articles`, `api.forum`, `api.products`, `api.clubs`, `api.events`, `api.visitors`, `api.tutorials`, `api.governanceDocuments`, `api.uploads` (uses `FormData`, skips the JSON `Content-Type` header so the browser can set the multipart boundary).

## 7. Data models

Shapes below come from `server/db.ts` (SQLite schema) and `server/seedData.ts`. Booleans are stored as `INTEGER 0/1` in SQLite and cast to real booleans when serialized to JSON in each route file.

- **User**: `{ id, username, email, role: 'admin'|'user', created_at }` (`password_hash` never leaves the server).
- **Article**: `{ id, title, category, status: 'publié'|'brouillon', cover_image, excerpt, content, author_name, published_at, featured, views }`. Only one article can be `featured: true` at a time (enforced on create/update). `views` is a real counter, incremented only by `POST /articles/:id/view` — it is never accepted from the admin create/update request body, no matter what's sent (see `server/routes/articles.ts`). The frontend calls that endpoint once per browser session per article (`ArticleDetail.jsx`, sessionStorage-deduped like the visitor counter).
- **Product**: `{ id, name, category, price (FCFA), description, image_url, in_stock }`. Categories: `'Équipements de Jeu' | 'Tenues & Équipements' | 'Infrastructure' | 'Packs Club'` (`src/lib/shopData.js`).
- **Club**: `{ id, name, city, address, latitude, longitude, status: 'actif'|'en formation', members }`.
- **Event**: `{ id, title, type, date, time, location, city, teams, status }`.
- **ForumTopic**: `{ id, title, category, author_name, user_id, created_date, content, pinned, closed }`. **ForumReply**: `{ id, topic_id, author_name, user_id, created_date, content }`. `user_id` is null for guest posts.
- **Tutorial**: `{ id, title, category, desc, duration, views, level, featured, thumb, src }` — now served from `GET /api/tutorials`, previously a frontend-only mock array in `Tutoriels.jsx`. `duration` must match `M:SS` (server-validated regex, not just a UI convention — the admin form uses guided minute/second number inputs rather than free text). `views` is a real counter with the same non-admin-settable behavior as articles, incremented by `POST /tutorials/:id/view` and tracked once per session per tutorial in `VideoPlayer.jsx`.
- **GovernanceDocument**: `{ id, pillarId, pillar, title, category, desc, content: string[], status, pages, year, fileUrl }` — now served from `GET /api/governance-documents`. The four `PILLARS` (icons, colors, descriptions) stay static on the frontend (`src/pages/Gouvernance.jsx`) since React icon components can't be stored in the DB; each fetched document's icon is re-attached client-side via an `ICONS_BY_CATEGORY` lookup keyed on `category`.
- **Cart item** (client-only, `src/lib/cartStore.js`, `localStorage['vizball_cart']`): `{ key, product, size, qty }` — no server-side representation, unchanged.
- **Visitor counter**: `{ count }` — single-row table, trivial global counter, no per-session tracking.

## 8. Internationalization (i18n)

Hand-rolled, no i18n library. Two layers, applied consistently across all ~44 files that render user-facing text (public pages, all shared components, and the admin dashboard):

- **Static UI copy** (labels, buttons, headings, placeholders, alerts/confirms): flat keys in `src/lib/translations.js`, shaped `{ fr: {...}, en: {...} }` (~500 keys per side, kept in parity — verified by diffing `Object.keys(t.fr)` vs `Object.keys(t.en)`). Every component that needs copy calls `const { lang } = useLang(); const tr = t[lang];` then references `tr.some_key`.
- **Per-item data-array content** (team bios, FAQ entries, gallery captions, rule descriptions, hero slides, etc.) and **DB-driven category/status/level values** (which are stored in the database in French only and aren't meant to be localized at the data layer): these use local `{ value: { fr, en } }` objects or lookup maps defined near the component that displays them — display-only, the underlying stored/filtered value stays the French string. Two of these lookup maps are shared across files and were pulled into standalone modules specifically to avoid circular imports: `src/lib/tutorialLabels.js` (used by `Tutoriels.jsx`, `VideoCard.jsx`, `FeaturedVideo.jsx`, `VideoPlayer.jsx`, `LeSport.jsx`) and the `CATEGORY_LABELS` export added to `src/lib/shopData.js`.
- **Language persistence**: `LanguageContext.jsx` now reads/writes `localStorage['vizball_lang']` so the choice survives a refresh (previously reset to French every load).
- **Locale-aware formatting**: `src/lib/dateLocale.js`'s `getDateLocale(lang)` picks date-fns' `fr`/`enUS` locale (previously every `format()` call was hardcoded to `fr`, so English mode still showed French month/day names). Numbers (prices, view counts) use `toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')` or `shopData.js`'s `formatPrice(price, lang)`.
- **Admin dashboard**: `AdminDashboard.jsx` and `ArticleEditor.jsx` are fully bilingual too (login screen, all 8 tabs, all modal forms, all `confirm()`/`alert()` dialogs) — this was originally out of scope for the public-site translation pass but the user asked for it to be included.
- **Scope boundary**: this pass covers UI chrome only. Dynamic content actually stored in the database (article bodies, product names/descriptions, forum posts, tutorial/governance descriptions) is not localized — an admin writes it once, in whatever language they choose, and it displays as-is regardless of the visitor's selected language. Only the fixed category/status/level *labels* attached to that content are translated (see above).
- **Bugs fixed along the way**: a "fake translation" bug in `HeroSection.jsx` (slides 2/3 took a `tr` argument but ignored it, returning hardcoded French regardless of language); dead `/regles` links in `HeroSection.jsx`/`Footer.jsx`/`FeatureCards.jsx` pointing at a route that doesn't exist (now `/le-sport`); `PageNotFound.jsx` and `UserNotRegisteredError.jsx` were English-only on an otherwise French-first site; `ProductDetail.jsx` briefly had a stale-on-language-switch bug during the rewrite (lang-dependent `badge`/`specs` were being baked into component state inside a fetch effect keyed only on `[id]` — fixed by computing them as render-time locals instead).

## 9. Still open

- No frontend signup/account page for the new `'user'` role — see §5. The backend supports it; nothing in the UI surfaces it yet.
- No pagination, rate limiting, or automated tests on the backend.
- Production deployment is now documented end-to-end in `DEPLOYMENT.md` (Nginx + systemd on a single VPS) with config templates in `deploy/`. Still no CI/CD pipeline — deploys are manual (`git pull` + rebuild + `systemctl restart`), and there's no multi-server story (SQLite + local-disk uploads assume one app server).
- **Stripe stays out of scope** — SDKs installed, deliberately not wired up.
- **Dynamic content localization stays out of scope** — see §8. Articles, products, forum posts, and tutorial/governance descriptions are single-language as entered by whoever created them; only the surrounding UI chrome and fixed labels are bilingual.
