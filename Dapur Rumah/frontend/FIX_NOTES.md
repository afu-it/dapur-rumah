# FIX NOTES — Preview Mode (No API)

**Date:** 2026-02-25  
**Purpose:** Make the app run fully offline as a preview, no backend/API needed.

---

## What Was Changed

### 1. `src/context/AuthContext.jsx`

- **Removed:** All API calls (`/api/auth/get-session`, `/api/auth/sign-in/email`, `/api/auth/sign-up/email`, `/api/auth/sign-out`)
- **Replaced with:** Mock auth using `localStorage` — login/register always succeed, session persists in `dapur_mock_user`

### 2. `src/api/index.js`

- **Removed:** Real `fetch()` calls to Cloudflare Workers API
- **Replaced with:** All exported functions return mock data (products, sellers, analytics, etc.)

### 3. `src/pages/HomeScreen.jsx`

- **Removed:** `useEffect` that called `getProducts()` API
- **Replaced with:** Uses `MOCK_PRODUCTS` array directly

### 4. `vite.config.js`

- **Removed:** API proxy config (`/api` → Cloudflare Workers)
- **Removed:** Orphaned multi-entry HTML files (login.html, register.html, dashboard.html, admin.html, product.html, seller.html) — these are unused; React SPA handles all routing

---

## What Still Works (Preview Mode)

- ✅ Home page with mock products and categories
- ✅ Search with filtering
- ✅ Cart (add, remove, quantity, WhatsApp send)
- ✅ Account profile (saved in localStorage)
- ✅ Product detail page
- ✅ Seller page
- ✅ Login (mock — any email/password works)
- ✅ Register (mock)
- ✅ Dashboard with demo sellers
- ✅ Admin panel (static data)

---

## What Needs Reconnection Later (When API is Ready)

- [ ] `AuthContext.jsx` → restore real API calls for auth
- [ ] `api/index.js` → restore real `fetch()` to backend
- [ ] `HomeScreen.jsx` → restore `getProducts()` API call
- [ ] `vite.config.js` → re-add API proxy and multi-entry HTML if needed
