# 🏠 Dapur Rumah — Project Plan

> **dapurrumah.com** — A catalog/directory website for Malaysian home-based food sellers.
> Sellers list their products (cookies, cakes, nasi lemak, kuih, etc.) and buyers browse & contact them via WhatsApp. No payment gateway needed.

---

## Table of Contents

1. [Tech Stack Overview](#1-tech-stack-overview)
2. [Folder & File Structure](#2-folder--file-structure)
3. [Database Schema (SQL)](#3-database-schema-sql)
4. [API Endpoints (Workers Routes)](#4-api-endpoints-workers-routes)
5. [R2 Image Upload Flow](#5-r2-image-upload-flow)
6. [Better Auth Setup](#6-better-auth-setup)
7. [UI Pages List](#7-ui-pages-list)
8. [Environment Variables](#8-environment-variables)
9. [Step-by-Step Implementation Order](#9-step-by-step-implementation-order)
10. [Phase 9 — Android App (Google Play Store)](#phase-9--android-app-google-play-store)
11. [Phase 10 — iOS App (App Store)](#phase-10--ios-app-app-store)

---

## 1. Tech Stack Overview

| Layer            | Technology                        | Notes                                    |
| ---------------- | --------------------------------- | ---------------------------------------- |
| **Frontend**     | HTML / CSS / Vanilla JS + Vite    | Vite-bundled JS modules, served via Pages|
| **Backend/API**  | Cloudflare Workers (Hono)         | Lightweight router, runs on edge         |
| **Database**     | Cloudflare D1 (SQLite)            | Serverless SQL, zero config              |
| **Image Storage**| Cloudflare R2                     | S3-compatible object storage             |
| **Auth**         | Better Auth + Kysely D1 adapter   | Email/password, session-based            |
| **Hosting**      | Cloudflare Pages + Workers        | Pages serves static, Workers handles API |
| **Domain**       | dapurrumah.com                    | Configured later via Cloudflare DNS      |

### Key Dependencies

```
# Frontend
vite                       # Frontend bundler & dev server
browser-image-compression  # Client-side image compression before upload

# Backend (Worker)
better-auth          # Auth library
kysely               # SQL query builder
kysely-d1            # Kysely adapter for Cloudflare D1
hono                 # Lightweight web framework for Workers
@hono/zod-validator  # Request validation
zod                  # Schema validation
wrangler             # Cloudflare CLI
```

### Mobile-First Design Constraints

| Property              | Value                                                 |
| --------------------- | ----------------------------------------------------- |
| **Design approach**   | Mobile-first, thumb-friendly, feels like native app   |
| **Primary breakpoints** | 375px (iPhone SE), 390px (iPhone 14), 430px (Pro Max) |
| **Desktop breakpoint** | ≥768px                                                |
| **Min input font-size** | 16px (prevents iOS auto-zoom on focus)              |
| **Image upload**      | `accept="image/*"` (user picks camera or gallery)     |
| **Navigation (mobile)** | Bottom tab bar replaces top navbar on <768px        |
| **WhatsApp CTA**      | `position: fixed` bottom bar on mobile product page   |

---

## 2. Folder & File Structure

```
dapur-rumah/
├── frontend/                        # Cloudflare Pages (Vite-bundled)
│   ├── index.html                   # Homepage — product catalog grid
│   ├── product.html                 # Single product detail page
│   ├── seller.html                  # Seller profile page
│   ├── login.html                   # Seller login page
│   ├── register.html                # Seller registration page
│   ├── dashboard.html               # Seller dashboard (protected)
│   ├── vite.config.js               # Vite config (multi-page, proxy)
│   ├── package.json                 # Frontend deps (vite, better-auth/client)
│   ├── _routes.json                 # Cloudflare Pages routing rules
│   ├── _headers                     # Cloudflare Pages headers config
│   ├── css/
│   │   ├── globals.css              # CSS reset, variables, typography
│   │   ├── components.css           # Reusable components (cards, buttons, modals)
│   │   ├── layout.css               # Grid, navbar, footer
│   │   ├── pages/
│   │   │   ├── home.css             # Homepage styles
│   │   │   ├── product.css          # Product detail styles
│   │   │   ├── seller.css           # Seller profile styles
│   │   │   ├── dashboard.css        # Dashboard styles
│   │   │   └── auth.css             # Login/register styles
│   ├── js/
│   │   ├── api.js                   # API client (fetch wrapper)
│   │   ├── auth.js                  # Auth helpers (login, logout, session check)
│   │   ├── home.js                  # Homepage logic (load products, filters, search)
│   │   ├── product.js               # Product detail page logic
│   │   ├── seller.js                # Seller profile page logic
│   │   ├── dashboard.js             # Dashboard logic (CRUD products)
│   │   └── utils.js                 # Shared utilities (format price, etc.)
│   ├── public/
│   │   ├── manifest.json            # PWA manifest (name, icons, theme)
│   │   ├── sw.js                    # Service worker (offline + caching)
│   │   ├── icon-192.png             # PWA icon 192×192px
│   │   ├── icon-512.png             # PWA icon 512×512px
│   │   ├── _routes.json             # Cloudflare Pages routing rules
│   │   └── assets/
│   │       ├── logo.svg             # Site logo
│   │       ├── icons/               # SVG icons (search, filter, whatsapp, etc.)
│   │       └── placeholder.webp     # Default product image
│
├── worker/                          # Cloudflare Workers (API backend)
│   ├── src/
│   │   ├── index.ts                 # Entry point — Hono app + route mounting
│   │   ├── auth.ts                  # Better Auth instance & config
│   │   ├── db.ts                    # D1 database helper (Kysely instance)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # Session validation middleware
│   │   │   └── cors.middleware.ts    # CORS middleware
│   │   ├── routes/
│   │   │   ├── products.ts          # Product CRUD endpoints
│   │   │   ├── sellers.ts           # Seller profile endpoints
│   │   │   ├── categories.ts        # Category list endpoint
│   │   │   ├── upload.ts            # R2 image upload endpoint
│   │   │   └── auth.routes.ts       # Auth routes (proxied to Better Auth)
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces & types
│   │   └── utils/
│   │       ├── response.ts          # Standardized API response helpers
│   │       └── validation.ts        # Zod schemas for request validation
│   ├── wrangler.toml                # Wrangler config (D1, R2 bindings)
│   ├── package.json
│   └── tsconfig.json
│
├── migrations/                      # D1 database migrations
│   ├── 0001_create_tables.sql       # Initial schema
│   └── 0002_seed_categories.sql     # Seed default categories
│
├── .dev.vars                        # Local env vars (secrets)
├── .gitignore
├── package.json                     # Root workspace config
└── README.md
```

### `_routes.json` (Cloudflare Pages Routing)

This file tells Cloudflare Pages which routes should be served as static assets vs proxied to Workers:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/api/*",
    "/assets/*",
    "/css/*",
    "/js/*"
  ]
}
```

### `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        product: resolve(__dirname, 'product.html'),
        seller: resolve(__dirname, 'seller.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 3. Database Schema (SQL)

### Migration 0001: `0001_create_tables.sql`

```sql
-- ============================================
-- Dapur Rumah — Database Schema
-- Database: Cloudflare D1 (SQLite)
-- ============================================

-- ──────────────────────────────────────────────
-- BETTER AUTH TABLES
-- (Auto-managed by Better Auth, shown for reference)
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "user" (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image         TEXT,
    createdAt     TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "session" (
    id        TEXT PRIMARY KEY,
    expiresAt TEXT NOT NULL,
    token     TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    ipAddress TEXT,
    userAgent TEXT,
    userId    TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
    id                    TEXT PRIMARY KEY,
    accountId             TEXT NOT NULL,
    providerId            TEXT NOT NULL,
    userId                TEXT NOT NULL,
    accessToken           TEXT,
    refreshToken          TEXT,
    idToken               TEXT,
    accessTokenExpiresAt  TEXT,
    refreshTokenExpiresAt TEXT,
    scope                 TEXT,
    password              TEXT,
    createdAt             TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt             TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "verification" (
    id         TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value      TEXT NOT NULL,
    expiresAt  TEXT NOT NULL,
    createdAt  TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ──────────────────────────────────────────────
-- APPLICATION TABLES
-- ──────────────────────────────────────────────

-- Categories (lookup table)
CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,         -- e.g. "Kek & Cookies"
    slug        TEXT NOT NULL UNIQUE,         -- e.g. "kek-cookies"
    icon        TEXT,                         -- Optional emoji or icon name
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sellers (extends Better Auth user — auto-created via databaseHooks on signup)
CREATE TABLE IF NOT EXISTS sellers (
    id              TEXT PRIMARY KEY,           -- matches user.id from Better Auth
    shop_name       TEXT NOT NULL DEFAULT '',   -- Nama kedai / brand (filled later)
    description     TEXT,                       -- Short bio / description
    phone_whatsapp  TEXT NOT NULL DEFAULT '',   -- WhatsApp number (filled later)
    state           TEXT NOT NULL DEFAULT '',   -- Malaysian state (filled later)
    city            TEXT,                       -- City/area (e.g. "Shah Alam")
    profile_image   TEXT,                       -- R2 URL for profile pic
    is_active       INTEGER NOT NULL DEFAULT 1, -- Soft enable/disable
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    seller_id       TEXT NOT NULL,
    category_id     INTEGER NOT NULL,
    name            TEXT NOT NULL,              -- Nama produk
    description     TEXT,                       -- Penerangan produk
    price           REAL NOT NULL,              -- Harga (RM)
    price_note      TEXT,                       -- e.g. "sebalang", "6 biji", "per kg"
    image_url       TEXT,                       -- Main product image (R2 URL)
    status          TEXT NOT NULL DEFAULT 'ada_stok'
                    CHECK(status IN ('ada_stok', 'preorder', 'habis')),
    is_featured     INTEGER NOT NULL DEFAULT 0, -- For homepage highlighting
    is_active       INTEGER NOT NULL DEFAULT 1, -- Soft delete
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (seller_id)   REFERENCES sellers(id)    ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_products_seller    ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status    ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_active    ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_sellers_state      ON sellers(state);
CREATE INDEX IF NOT EXISTS idx_sellers_active     ON sellers(is_active);
```

### Migration 0002: `0002_seed_categories.sql`

```sql
-- Seed default categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
    ('Kek & Cookies',   'kek-cookies',    '🍪', 1),
    ('Masakan Panas',   'masakan-panas',  '🍛', 2),
    ('Kuih-muih',       'kuih-muih',      '🍡', 3),
    ('Minuman',         'minuman',         '🥤', 4),
    ('Lain-lain',       'lain-lain',      '🍱', 5);
```

### Malaysian States (Reference)

Used for the `sellers.state` field and location filter:

```
Johor, Kedah, Kelantan, Melaka, Negeri Sembilan,
Pahang, Perak, Perlis, Pulau Pinang, Sabah,
Sarawak, Selangor, Terengganu,
W.P. Kuala Lumpur, W.P. Putrajaya, W.P. Labuan
```

---

## 4. API Endpoints (Workers Routes)

Base URL: `https://api.dapurrumah.com` (or `/api` if same-origin)

### 4.1 Authentication (Better Auth)

| Method | Route                        | Auth  | Description                    |
| ------ | ---------------------------- | ----- | ------------------------------ |
| POST   | `/api/auth/sign-up/email`    | ❌    | Register new seller            |
| POST   | `/api/auth/sign-in/email`    | ❌    | Login seller (email/password)  |
| POST   | `/api/auth/sign-out`         | ✅    | Logout (invalidate session)    |
| GET    | `/api/auth/get-session`      | ✅    | Get current session + user     |

> Better Auth handles all `/api/auth/**` routes internally. We just proxy them.

### 4.2 Products (Public)

| Method | Route                          | Auth  | Description                                 |
| ------ | ------------------------------ | ----- | ------------------------------------------- |
| GET    | `/api/products`                | ❌    | List products (with filters & pagination)   |
| GET    | `/api/products/:id`            | ❌    | Get single product detail                   |

**Query parameters for `GET /api/products`:**

| Param      | Type    | Example                | Description                        |
| ---------- | ------- | ---------------------- | ---------------------------------- |
| `page`     | number  | `1`                    | Page number (default: 1)           |
| `limit`    | number  | `20`                   | Items per page (default: 20, max: 50) |
| `category` | string  | `kek-cookies`          | Filter by category slug            |
| `state`    | string  | `Selangor`             | Filter by seller's state           |
| `search`   | string  | `brownies`             | Search product name                |
| `status`   | string  | `ada_stok`             | Filter by stock status             |
| `seller`   | string  | `<seller_id>`          | Filter by seller                   |

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "a1b2c3...",
        "name": "Brownies Kedut",
        "price": 25.00,
        "price_note": "sebalang",
        "image_url": "https://r2.dapurrumah.com/products/abc123.webp",
        "status": "ada_stok",
        "category": { "id": 1, "name": "Kek & Cookies", "slug": "kek-cookies" },
        "seller": { "id": "xyz...", "shop_name": "Dapur Kak Ani", "state": "Selangor" }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 4.3 Sellers (Public)

| Method | Route                          | Auth  | Description                      |
| ------ | ------------------------------ | ----- | -------------------------------- |
| GET    | `/api/sellers/:id`             | ❌    | Get seller profile + products    |

### 4.4 Categories (Public)

| Method | Route                          | Auth  | Description            |
| ------ | ------------------------------ | ----- | ---------------------- |
| GET    | `/api/categories`              | ❌    | List all categories    |

### 4.5 Seller Dashboard (Protected — Requires Auth)

| Method | Route                          | Auth  | Description                    |
| ------ | ------------------------------ | ----- | ------------------------------ |
| GET    | `/api/dashboard/profile`       | ✅    | Get own seller profile         |
| PUT    | `/api/dashboard/profile`       | ✅    | Update seller profile          |
| GET    | `/api/dashboard/products`      | ✅    | List own products              |
| POST   | `/api/dashboard/products`      | ✅    | Add new product                |
| PUT    | `/api/dashboard/products/:id`  | ✅    | Update own product             |
| DELETE | `/api/dashboard/products/:id`  | ✅    | Delete own product (soft)      |

### 4.6 Image Upload (Protected)

| Method | Route                          | Auth  | Description                    |
| ------ | ------------------------------ | ----- | ------------------------------ |
| POST   | `/api/upload/image`            | ✅    | Upload image to R2             |
| DELETE | `/api/upload/image/:key`       | ✅    | Delete image from R2           |

---

## 5. R2 Image Upload Flow

### Architecture

```
┌──────────┐  1. Compress (client)   ┌──────────┐  POST multipart   ┌──────────────┐
│  Camera / │ ───────────────────────►│  Browser  │ ────────────────►│   Worker     │
│  Gallery  │   browser-image-       │  (Vite)   │  /api/upload     │   (Hono)     │
└──────────┘   compression           └──────────┘                   └──────┬───────┘
               max 1MB, 1080px                                             │
                                                                    2. Validate auth
                                                                    3. Validate type/size
                                                                    4. Generate UUID key
                                                                    5. PUT to R2 bucket
                                                                           │
                                                                    ┌──────▼───────┐
                                                                    │  Cloudflare   │
                                                                    │  R2 Bucket    │
                                                                    │  (dapur-img)  │
                                                                    └──────┬───────┘
                                                                           │
                                                                    6. Return public URL
                                                                           │
                                                                    ┌──────▼───────┐
                                                                    │   Response    │
                                                                    │  { url: ... } │
                                                                    └──────────────┘
```

### Client-Side Image Compression (before upload)

```javascript
// frontend/js/upload.js
import imageCompression from 'browser-image-compression';

export async function compressAndUpload(file) {
  // 1. Compress on client (saves bandwidth, faster upload on mobile)
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,           // Max 1MB after compression
    maxWidthOrHeight: 1080, // Max 1080px dimension
    useWebWorker: true,
    fileType: 'image/webp', // Convert to WebP
  });

  // 2. Upload to R2 via Worker
  const formData = new FormData();
  formData.append('file', compressed, compressed.name);

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  return res.json();
}
```

### HTML Image Input (Camera or Gallery)

```html
<!-- accept="image/*" lets user choose camera OR gallery (no capture attr) -->
<input
  type="file"
  id="product-image"
  accept="image/*"
  style="font-size: 16px;"
/>
```

### Upload Endpoint Implementation (Pseudocode)

```typescript
// POST /api/upload/image
app.post("/api/upload/image", authMiddleware, async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"] as File;

  // 1. Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: "Format gambar tidak disokong" }, 400);
  }

  // 2. Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return c.json({ error: "Saiz gambar maksimum 5MB" }, 400);
  }

  // 3. Generate unique filename
  const ext = file.name.split(".").pop();
  const key = `products/${crypto.randomUUID()}.${ext}`;

  // 4. Upload to R2
  await c.env.R2_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  // 5. Return public URL
  const url = `https://img.dapurrumah.com/${key}`;
  return c.json({ success: true, url, key });
});
```

### R2 Configuration

```toml
# wrangler.toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "dapur-img"
```

### Public Access

- Option A: Use **R2 Custom Domain** → `img.dapurrumah.com`
- Option B: Use **Cloudflare R2 Public URL** (auto-generated)

### Image Guidelines

| Property                | Value                                          |
| ----------------------- | ---------------------------------------------- |
| Max file size (server)  | 5 MB                                           |
| Max file size (client)  | 1 MB after compression via `browser-image-compression` |
| Max dimension (client)  | 1080px (longest side)                          |
| Allowed types           | JPEG, PNG, WebP                                |
| Output format           | WebP (converted client-side)                   |
| Storage path            | `products/{uuid}.webp`                         |
| Profile pics            | `profiles/{uuid}.webp`                         |
| HTML input attributes   | `accept="image/*"` (no `capture` — user chooses)|

---

## 6. Better Auth Setup

### Step 1: Install Dependencies

```bash
npm install better-auth kysely kysely-d1
npm install -D @better-auth/cli
```

### Step 2: Configure Better Auth Instance (with databaseHooks)

Better Auth's `databaseHooks` automatically creates a seller record when a new user signs up — no separate API call needed from the frontend.

```typescript
// worker/src/auth.ts
import { betterAuth } from "better-auth";
import { kyselyAdapter } from "better-auth/adapters/kysely";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

export function createAuth(env: Env) {
  const db = new Kysely<any>({
    dialect: new D1Dialect({ database: env.DB }),
  });

  return betterAuth({
    database: kyselyAdapter(db, { type: "sqlite" }),
    baseURL: env.BETTER_AUTH_URL,        // e.g. https://api.dapurrumah.com
    secret: env.BETTER_AUTH_SECRET,       // Random 32+ char string
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,       // 7 days
      updateAge: 60 * 60 * 24,            // Refresh every 24h
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,                   // 5 min cache
      },
    },
    trustedOrigins: ["https://dapurrumah.com"],
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            // Auto-create seller record when user signs up
            await db
              .insertInto("sellers")
              .values({
                id: user.id,
                shop_name: "",         // Filled in later via dashboard
                phone_whatsapp: "",    // Filled in later via dashboard
                state: "",             // Filled in later via dashboard
              })
              .execute();
          },
        },
      },
    },
  });
}
```

### Step 3: Mount Auth Routes in Hono

```typescript
// worker/src/routes/auth.routes.ts
import { Hono } from "hono";
import { createAuth } from "../auth";

const authApp = new Hono<{ Bindings: Env }>();

authApp.all("/api/auth/**", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

export default authApp;
```

### Step 4: Auth Middleware for Protected Routes

```typescript
// worker/src/middleware/auth.middleware.ts
import { createMiddleware } from "hono/factory";
import { createAuth } from "../auth";

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Sila log masuk" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
```

### Step 5: Generate Auth Tables

```bash
npx @better-auth/cli generate --config ./worker/src/auth.ts
# Then apply generated SQL migration to D1
npx wrangler d1 execute dapur-db --file=./migrations/0001_create_tables.sql
```

### Step 6: Frontend Auth Client

> **Note:** The frontend `register()` only needs to call `signUp.email()` — the seller record is automatically created via `databaseHooks` on the backend. The seller then completes their profile (shop name, WhatsApp, state) in the dashboard after first login.

```javascript
// frontend/js/auth.js
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.PROD
    ? "https://api.dapurrumah.com"
    : "http://localhost:8787",
});

// Sign up — seller record auto-created via databaseHooks
export async function register(name, email, password) {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
  });
  if (error) throw error;
  return data;
  // → Redirect to /dashboard.html to complete seller profile
}

// Sign in
export async function login(email, password) {
  const { data, error } = await authClient.signIn.email({ email, password });
  if (error) throw error;
  return data;
}

// Sign out
export async function logout() {
  await authClient.signOut();
}

// Check session
export async function getSession() {
  const { data } = await authClient.getSession();
  return data;
}
```

---

## 7. UI Pages List

### 7.1 Public Pages

| Page               | File               | Description                                                              |
| ------------------ | ------------------ | ------------------------------------------------------------------------ |
| **Homepage**       | `index.html`       | Hero section, search bar, category filter chips, state dropdown, product grid with cards (image, name, price, seller, status badge). Infinite scroll or pagination. |
| **Product Detail** | `product.html`     | Large product image, full description, price, status badge, seller info card with WhatsApp button. Related products from same seller. |
| **Seller Profile** | `seller.html`      | Seller banner/avatar, shop name, location, WhatsApp button, bio/description, grid of all their products. |
| **Login**          | `login.html`       | Email + password form. Link to register page. Error feedback. |
| **Register**       | `register.html`    | Registration form: name, email, password, shop name, WhatsApp number, state selector. |

### 7.2 Protected Pages (Seller Dashboard)

| Page                  | File              | Description                                                                |
| --------------------- | ----------------- | -------------------------------------------------------------------------- |
| **Dashboard Home**    | `dashboard.html`  | Overview: total products, product list with quick actions (edit/delete/toggle status). Add product button. Seller profile sidebar. |

### 7.3 UI Components

| Component              | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| **Navbar (Desktop)**   | Logo, search bar, category links, login/register buttons. Hidden <768px.   |
| **Bottom Nav (Mobile)**| Fixed bottom tab bar (<768px): Home, Search, Add Product, Profile. Thumb-friendly, 56px height. Replaces top navbar on mobile. |
| **Product Card**       | Image, product name, price, seller name, status badge                      |
| **Status Badge**       | Green (Ada Stok), Orange (Preorder), Red (Habis)                           |
| **Category Chips**     | Horizontal scrollable filter chips (touch-scroll on mobile)                |
| **State Dropdown**     | Dropdown with all 16 Malaysian states                                      |
| **WhatsApp CTA Bar**   | Green button → `wa.me/60xxx`. On mobile: `position:fixed` bottom bar with full-width button |
| **Product Form**       | Full-screen on mobile. Image input with `accept="image/*"`. All inputs `font-size: 16px` min. |
| **Toast/Snackbar**     | Feedback messages for actions                                              |
| **Loading Skeleton**   | Placeholder cards during data fetch                                        |
| **Empty State**        | Friendly message when no products found                                    |

### 7.4 WhatsApp Integration

Buyers click the WhatsApp button to contact sellers. The link opens WhatsApp with a pre-filled message:

```
https://wa.me/60123456789?text=Salam%2C%20saya%20berminat%20dengan%20%5BNama%20Produk%5D%20yang%20dijual%20di%20Dapur%20Rumah.
```

Translates to:
> *Salam, saya berminat dengan [Nama Produk] yang dijual di Dapur Rumah.*

---

## 8. Environment Variables

### Worker Environment (wrangler.toml + .dev.vars)

```toml
# wrangler.toml
name = "dapur-rumah-api"
main = "src/index.ts"
compatibility_date = "2025-12-01"

[vars]
BETTER_AUTH_URL = "https://api.dapurrumah.com"
FRONTEND_URL   = "https://dapurrumah.com"

[[d1_databases]]
binding = "DB"
database_name = "dapur-db"
database_id = "<auto-generated-on-create>"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "dapur-img"
```

```bash
# .dev.vars (secrets — NOT committed to git)
BETTER_AUTH_SECRET=your-random-secret-string-min-32-chars
```

### Environment Variables Reference

| Variable              | Where         | Description                              |
| --------------------- | ------------- | ---------------------------------------- |
| `BETTER_AUTH_SECRET`  | `.dev.vars`   | Secret for signing auth tokens           |
| `BETTER_AUTH_URL`     | `wrangler.toml` | Base URL for auth (API origin)         |
| `FRONTEND_URL`        | `wrangler.toml` | Frontend origin for CORS               |
| `DB`                  | D1 binding    | Cloudflare D1 database binding           |
| `R2_BUCKET`           | R2 binding    | Cloudflare R2 bucket binding             |

### Cloudflare Dashboard Secrets (Production)

```
BETTER_AUTH_SECRET  →  Set via: wrangler secret put BETTER_AUTH_SECRET
```

---

## 9. Step-by-Step Implementation Order

> **Execution order: Phase 1 → 2 → 3 (R2) → 4 (Dashboard) → 5 → 6 → 7**
> R2 image upload is built before the dashboard so the product form can use it.

### Phase 1 — Foundation & Infrastructure Setup

> **Goal:** Get the project skeleton running locally with Vite + Hono.

- [ ] **1.1** Initialize project structure (`frontend/`, `worker/`, `migrations/`)
- [ ] **1.2** Set up `frontend/` with Vite (`vite.config.js`, `package.json`), add viewport meta tag to all HTML files: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] **1.3** Set up `worker/` with Hono, TypeScript, and `wrangler.toml`
- [ ] **1.4** Create Cloudflare D1 database (`wrangler d1 create dapur-db`)
- [ ] **1.5** Create Cloudflare R2 bucket (`wrangler r2 bucket create dapur-img`)
- [ ] **1.6** Enable R2 public access (Cloudflare Dashboard → R2 → dapur-img → Settings → Public Access)
- [ ] **1.7** Write migration `0001_create_tables.sql`
- [ ] **1.8** Write migration `0002_seed_categories.sql`
- [ ] **1.9** Run both migrations on local D1
- [ ] **1.10** Create `_routes.json` for Cloudflare Pages routing
- [ ] **1.11** Set up CORS middleware for `FRONTEND_URL`
- [ ] **1.12** Create standardized API response helpers
- [ ] **1.13** Verify Worker runs locally with `wrangler dev`
- [ ] **1.14** Verify Vite dev server runs with API proxy to Worker

### Phase 2 — Authentication (Better Auth)

> **Goal:** Sellers can register, login, and manage sessions. Seller record auto-created via `databaseHooks`.

- [ ] **2.1** Install Better Auth + Kysely D1 adapter
- [ ] **2.2** Create `auth.ts` with Better Auth config + `databaseHooks` (auto-create seller)
- [ ] **2.3** Mount auth routes (`/api/auth/**`) in Hono
- [ ] **2.4** Create auth middleware for protected routes
- [ ] **2.5** Build `login.html` and `register.html` frontend pages
- [ ] **2.6** Implement `auth.js` frontend client (Vite-bundled, uses `import`)
- [ ] **2.7** Test full auth flow (register → auto-create seller → login → session → logout)

### Phase 3 — Image Upload (R2)

> **Goal:** Sellers can upload product images. Built before dashboard so product form can use it.

- [ ] **3.1** Create `POST /api/upload/image` endpoint
- [ ] **3.2** Implement file validation (type, size)
- [ ] **3.3** Implement R2 upload with unique key generation
- [ ] **3.4** Create `DELETE /api/upload/image/:key` endpoint
- [ ] **3.5** Implement client-side image compression (`browser-image-compression`: max 1MB, 1080px, WebP output)
- [ ] **3.6** Add `accept="image/*"` to file input (camera or gallery — no `capture` attr)
- [ ] **3.7** Test upload → compress → display → delete flow (desktop + mobile)

### Phase 4 — Seller Profile & Dashboard

> **Goal:** Sellers can complete profile and manage products (with image upload).

- [ ] **4.1** Create `GET /api/dashboard/profile` — get own seller profile
- [ ] **4.2** Create `PUT /api/dashboard/profile` — update profile (shop name, WhatsApp, state)
- [ ] **4.3** Create `GET /api/dashboard/products` — list own products
- [ ] **4.4** Create `POST /api/dashboard/products` — add new product
- [ ] **4.5** Create `PUT /api/dashboard/products/:id` — update product
- [ ] **4.6** Create `DELETE /api/dashboard/products/:id` — soft-delete product
- [ ] **4.7** Build `dashboard.html` with profile completion + product management UI
- [ ] **4.8** Integrate R2 image upload in product form

### Phase 5 — Public Catalog (Core Experience)

> **Goal:** Visitors can browse, search, and filter products.

- [ ] **5.1** Create `GET /api/products` with pagination, filters, search
- [ ] **5.2** Create `GET /api/products/:id` for product detail
- [ ] **5.3** Create `GET /api/sellers/:id` for seller profile
- [ ] **5.4** Create `GET /api/categories` for category list
- [ ] **5.5** Build `index.html` — homepage with product grid
- [ ] **5.6** Implement category filter chips
- [ ] **5.7** Implement state/location dropdown filter
- [ ] **5.8** Implement search bar functionality
- [ ] **5.9** Build `product.html` — product detail page with WhatsApp CTA
- [ ] **5.10** Build `seller.html` — seller profile with their products
- [ ] **5.11** Implement status badges (Ada Stok / Preorder / Habis)

### Phase 6 — UI Polish & Responsiveness

> **Goal:** Professional, mobile-first design. Feels like a native app on mobile.
> **Breakpoints:** 375px (iPhone SE), 390px (iPhone 14), 430px (Pro Max), ≥768px (desktop)

- [ ] **6.1** Design system: CSS variables, colors, typography (Google Fonts)
- [ ] **6.2** Mobile-first responsive layout: Bottom Navigation Bar (<768px replaces top navbar), all inputs `font-size: 16px` min, `position:fixed` WhatsApp CTA on product detail
- [ ] **6.3** Loading skeletons for all data fetches
- [ ] **6.4** Empty states (no results, no products)
- [ ] **6.5** Toast/snackbar notifications
- [ ] **6.6** Product card hover animations (desktop), touch feedback (mobile)
- [ ] **6.7** Dark/light mode (optional, nice-to-have)
- [ ] **6.8** Meta tags, Open Graph tags, SEO basics
- [ ] **6.9** PWA manifest (`manifest.json`, service worker, app icons) — installable on mobile home screen

### Phase 7 — Testing & Deployment

> **Goal:** Ship to production.

- [ ] **7.1** Test all API endpoints manually (Postman/Thunder Client)
- [ ] **7.2** Test auth flow end-to-end
- [ ] **7.3** Test image upload and display
- [ ] **7.4** Test all filters and search
- [ ] **7.5** Cross-browser testing (Chrome, Safari, Firefox)
- [ ] **7.6** Mobile testing
- [ ] **7.7** Deploy Worker to Cloudflare (`wrangler deploy`)
- [ ] **7.8** Build frontend with Vite (`npm run build`) and deploy to Cloudflare Pages
- [ ] **7.9** Configure custom domain (`dapurrumah.com`)
- [ ] **7.10** Set production secrets (`wrangler secret put`)
- [ ] **7.11** Set up R2 custom domain
- [ ] **7.12** Final smoke test on production

### Phase 8 — Future Enhancements (Post-Launch Web)

> **Nice-to-haves after MVP launch.**

- [ ] Product image gallery (multiple images per product)
- [ ] Seller ratings/reviews
- [ ] Featured sellers carousel on homepage
- [ ] Analytics dashboard for sellers (views, WhatsApp clicks)
- [ ] Push notifications for new products
- [ ] Admin panel for site management
- [ ] Social login (Google, Facebook)
- [ ] Product sharing to social media
- [ ] Offline browsing (advanced service worker caching)

### Phase 9 — Android App (Google Play Store)

> **Goal:** Wrap the existing Vite web app into a native Android app using Capacitor. No rewrite needed.
> **Timeline:** 1–2 weeks (after website is stable)

**Tech:** Capacitor (web → native bridge), Android Studio, Target API Level 34+ (Android 14)

- [ ] **9.1** Install Capacitor: `npm install @capacitor/core @capacitor/android` → `npx cap init "Dapur Rumah" "com.dapurrumah.app"` → `npx cap add android`
- [ ] **9.2** Configure `capacitor.config.ts` — appId: `com.dapurrumah.app`, appName: `Dapur Rumah`, webDir: `frontend/dist`
- [ ] **9.3** Build web → sync to Android: `npm run build` → `npx cap sync android`
- [ ] **9.4** Android-specific adjustments:
  - Back button handling
  - Deep links (`dapurrumah.com` → app)
  - Status bar color
  - Splash screen + app icon (512×512px)
  - Camera & storage permissions in `AndroidManifest.xml`
- [ ] **9.5** Register Google Play Developer Account — one-time fee: USD$25 (~RM115) at [play.google.com/console](https://play.google.com/console)
- [ ] **9.6** Build release AAB in Android Studio — sign with release keystore → Build → Generate Signed Bundle (AAB)
- [ ] **9.7** Prepare Play Store listing:
  - App name + description (BM + EN)
  - Screenshots: min 2 phone screenshots
  - Feature graphic: 1024×500px
  - Privacy policy URL (required)
  - Category: Food & Drink
- [ ] **9.8** Submit for review — upload AAB to Play Console, fill content rating questionnaire. Review: few hours to 3 days.
- [ ] **9.9** Post-launch monitoring — Firebase Crashlytics for crash reports, monitor ratings & reviews

**Requirements:**
- Google Play Developer Account (USD$25 one-time)
- Android Studio (Windows / Mac / Linux)
- Java 17+ / Android SDK

### Phase 10 — iOS App (App Store)

> **Goal:** Same Capacitor project, add iOS platform. **Requires macOS + Xcode** — cannot build iOS on Windows/Linux.
> **Timeline:** 2–3 weeks

**Tech:** Capacitor iOS platform, Xcode 15+ (macOS only)

- [ ] **10.1** Add iOS to Capacitor project: `npx cap add ios`
- [ ] **10.2** Sync web build: `npm run build` → `npx cap sync ios`
- [ ] **10.3** iOS-specific adjustments:
  - `Info.plist` permissions: `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`
  - App icons (all sizes via Xcode asset catalog)
  - Launch screen / splash screen
  - Universal Links (deep linking)
  - Test on Simulator + real device
- [ ] **10.4** Register Apple Developer Account — annual fee: USD$99/year (~RM460) at [developer.apple.com](https://developer.apple.com)
- [ ] **10.5** Configure signing in Xcode — Bundle ID: `com.dapurrumah.app`, enable automatic signing
- [ ] **10.6** Prepare App Store listing (App Store Connect):
  - App name, subtitle, description (BM + EN)
  - Keywords for ASO
  - Screenshots: iPhone 6.7" required
  - Privacy policy URL (required)
  - Category: Food & Drink
- [ ] **10.7** TestFlight beta testing — upload build from Xcode, test with real users first
- [ ] **10.8** Submit for App Store Review — review time: 1–3 days, respond to rejections if any
- [ ] **10.9** Post-launch — App Store Connect analytics, renew developer account annually

**Requirements:**
- Mac with macOS 13+ (Ventura or later)
- Xcode 15+ (free from Mac App Store)
- Apple Developer Account (USD$99/year)
- Real iPhone for device testing (recommended)

---

## Quick Reference: Key Commands

```bash
# Development
cd worker && npm run dev           # Start Worker locally (wrangler dev)
cd frontend && npm run dev         # Start Vite dev server (with API proxy)

# Database
wrangler d1 create dapur-db                           # Create D1 database
wrangler d1 execute dapur-db --file=./migrations/0001_create_tables.sql    # Run migration (local)
wrangler d1 execute dapur-db --file=./migrations/0001_create_tables.sql --remote  # Run migration (prod)

# R2
wrangler r2 bucket create dapur-img                   # Create R2 bucket

# Deployment
cd worker && wrangler deploy                          # Deploy Worker
cd frontend && npx wrangler pages deploy .            # Deploy Pages

# Capacitor (Android)
npm run build && npx cap sync android  # Build web + sync to Android
npx cap open android                   # Open in Android Studio

# Capacitor (iOS — macOS only)
npm run build && npx cap sync ios      # Build web + sync to iOS
npx cap open ios                       # Open in Xcode

# Secrets
wrangler secret put BETTER_AUTH_SECRET                # Set auth secret
```

---

> **📝 Note:** Follow execution order: **Phase 1 → 2 → 3 → 4 → 5 → 6 → 7**.
> Phase 1–5: MVP website. Phase 6–7: Polish & launch. Phase 8: Post-launch web enhancements.
> Phase 9: Android app via Capacitor (do after website stable). Phase 10: iOS app via Capacitor (requires Mac + Xcode).
> **Priority: Website first → Android → iOS.** Android first — ~70% Malaysia mobile market share.
