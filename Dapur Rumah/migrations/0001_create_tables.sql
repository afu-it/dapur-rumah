-- Better Auth tables are now handled in 0003_better_auth_tables.sql

-- Application tables
CREATE TABLE "categories" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE "sellers" (
  id TEXT PRIMARY KEY REFERENCES "user"(id),
  shop_name TEXT DEFAULT '',
  description TEXT,
  phone_whatsapp TEXT DEFAULT '',
  state TEXT DEFAULT '',
  city TEXT,
  profile_image TEXT,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE "products" (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES "sellers"(id),
  category_id TEXT NOT NULL REFERENCES "categories"(id),
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  price_note TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'ada_stok',
  is_featured INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
