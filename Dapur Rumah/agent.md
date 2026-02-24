# Dapur Rumah — Agent Context

## Project Overview

**Dapur Rumah** ("House Kitchen") is a Malaysian home-cooked food marketplace.
Sellers (home chefs) register, create a shop, list products, and buyers find them via a public catalog and order via WhatsApp.

**Live URLs**

- Frontend: https://dapur-rumah.pages.dev
- Worker API: https://dapur-rumah-api.afuitdev.workers.dev

---

## Tech Stack

| Layer      | Technology                                               |
| ---------- | -------------------------------------------------------- |
| Frontend   | Vanilla HTML + CSS + JavaScript (ES modules), Vite build |
| Backend    | Cloudflare Workers + Hono framework                      |
| Auth       | Better Auth (`/api/auth/*`)                              |
| Database   | Cloudflare D1 (SQLite) via Drizzle ORM                   |
| Storage    | Cloudflare R2 (`dapur-img` bucket)                       |
| Hosting    | Cloudflare Pages (frontend) + Workers (API)              |
| Validation | Zod (`@hono/zod-validator`)                              |

---

## Directory Structure

```
Dapur Rumah/
├── frontend/          # Vite project (vanilla HTML/CSS/JS)
│   ├── index.html     # Homepage — catalog, search, featured carousel
│   ├── product.html   # Product detail + WhatsApp CTA
│   ├── seller.html    # Seller public profile + product list
│   ├── login.html     # Login (email + Google)
│   ├── register.html  # Register (email + Google)
│   ├── dashboard.html # Seller dashboard (profile, products, analytics)
│   ├── admin.html     # Admin panel (manage sellers, feature/activate)
│   ├── js/
│   │   ├── api.js         # apiFetch() wrapper — always use this, not raw fetch
│   │   ├── auth.js        # Better Auth client (login, register, logout, getSession)
│   │   ├── home.js        # Homepage logic
│   │   ├── product.js     # Product page + view/WA tracking
│   │   ├── dashboard.js   # Seller dashboard logic + loadAnalytics()
│   │   ├── admin.js       # Admin panel logic
│   │   └── ui.js          # Shared UI helpers (bottom nav injection)
│   ├── css/
│   │   ├── globals.css    # Design tokens, base styles, components
│   │   └── pages/         # Per-page styles
│   └── vite.config.js     # Multi-page MPA config + /api proxy to :8787
│
├── worker/            # Cloudflare Worker (Hono)
│   ├── wrangler.toml  # D1 + R2 bindings, local vars
│   └── src/
│       ├── index.ts       # App entry — CORS, routes, R2 image serve
│       ├── auth.ts        # Better Auth config (email + Google OAuth)
│       ├── schema.ts      # Drizzle schema (user, session, sellers, products, categories)
│       ├── db.ts          # createDb() helper
│       ├── types/index.ts # Env type (DB, R2_BUCKET, env vars)
│       ├── middleware/
│       │   └── auth.middleware.ts  # authMiddleware — protects dashboard routes
│       └── routes/
│           ├── auth.routes.ts  # Passes all /api/auth/* to Better Auth
│           ├── catalog.ts      # Public: /api/products, /api/sellers, /api/categories
│           ├── sellers.ts      # Protected: /api/dashboard/* (profile + products CRUD)
│           ├── upload.ts       # Protected: /api/upload/image (R2 upload)
│           ├── analytics.ts    # Public: POST /api/track; Protected: GET /api/dashboard/analytics
│           └── admin.ts        # Admin-only: /api/admin/sellers (list, feature, activate)
│
└── migrations/        # D1 SQL migrations (apply with wrangler d1 execute)
    ├── 0001_create_tables.sql
    ├── 0002_seed_categories.sql
    ├── 0003_better_auth_tables.sql
    ├── 0003_add_featured_sellers.sql
    ├── 0004_add_analytics_tracking.sql
    └── 0005_add_admin_role.sql
```

---

## Environment Variables

### Worker (`wrangler.toml` for dev, Wrangler secrets for prod)

| Variable               | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `DB`                   | D1 database binding (`dapur-db`)                  |
| `R2_BUCKET`            | R2 bucket binding (`dapur-img`)                   |
| `BETTER_AUTH_SECRET`   | Random secret for Better Auth session signing     |
| `BETTER_AUTH_URL`      | Worker's own URL (used by Better Auth internally) |
| `FRONTEND_URL`         | Pages URL (used for CORS trusted origin)          |
| `WORKER_URL`           | Worker's own URL (used to build R2 image URLs)    |
| `GOOGLE_CLIENT_ID`     | Optional — enables Google OAuth login             |
| `GOOGLE_CLIENT_SECRET` | Optional — enables Google OAuth login             |

### Frontend

No `.env` files. In dev, Vite proxies `/api` → `localhost:8787`. In production, the Cloudflare Pages Function (`functions/_middleware.ts` or proxy config) routes `/api` → the Worker.

---

## Key Design Decisions

- **Auth**: Better Auth handles sessions via cookies. Always use `credentials: 'include'` in fetch calls — use `apiFetch()` from `js/api.js`, never raw `fetch()`.
- **Category IDs**: TEXT strings (e.g. `'cat_1'`, `'cat_2'`), not integers. Never `parseInt()` them.
- **Soft delete**: Products are soft-deleted (`is_active = 0`), not hard-deleted.
- **Analytics tracking**: Fire-and-forget (`POST /api/track`) — never blocks UI. Increments `views` or `whatsapp_clicks` on `products` table.
- **Image upload**: `POST /api/upload/image` → stores in R2 bucket `dapur-img` → returns URL `{WORKER_URL}/api/images/{key}`. Images served via `GET /api/images/:key` on the Worker.
- **Admin access**: Set `is_admin = 1` in the `"user"` table (note: quoted — `user` is an SQLite reserved word).
- **Google OAuth**: Only enabled if `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` secrets are set. Falls back gracefully.
- **Featured sellers**: Set `is_featured = 1` on the `sellers` table. Shown in homepage carousel.

---

## Common Commands

```powershell
# Run locally
cd worker && npm run dev      # Worker on :8787
cd frontend && npm run dev    # Frontend on :5173

# Deploy
cd worker && npx wrangler deploy
cd frontend && npm run build && npx wrangler pages deploy dist --project-name=dapur-rumah --branch=production

# Apply D1 migration
cd worker && npx wrangler d1 execute dapur-db --remote --file=../migrations/<file>.sql --yes

# Set a secret
cd worker && echo "value" | npx wrangler secret put SECRET_NAME

# Grant admin access (run in Cloudflare D1 Console)
UPDATE "user" SET is_admin = 1 WHERE email = 'your@email.com';
```

---

## Known Gotchas

1. **`"user"` table**: Always quote it in raw SQL — `"user"` — it's an SQLite reserved word.
2. **`category_id`**: TEXT field matching `'cat_1'` format. Never use `parseInt()`.
3. **`auth.js` baseURL**: Must be `''` (empty string) in production. The Pages platform proxies `/api/*` to the Worker on the same host.
4. **Product `created_at`/`updated_at`**: Schema columns named `"createdAt"` / `"updatedAt"` in SQL (camelCase) but aliased as `created_at` / `updated_at` in Drizzle schema. Always set them with `new Date().toISOString()` on create/update.
5. **Wrangler interactive prompts**: On Windows, `wrangler d1 execute --remote --file=...` may prompt for confirmation. Use `--yes` flag or use `--command='...'` for inline SQL.
