-- Seed 2 seller accounts + 3 menu items each (idempotent/upsert-safe)
-- Passwords (plain text, for reference):
-- 1) nuraina.market@dapur-rumah.test -> Dapur#Seller2026
-- 2) hakim.kitchen@dapur-rumah.test  -> Menu#Seller2026
--
-- Password hashes below are generated with Better Auth's default scrypt format:
--    <hex-salt>:<hex-key>

-- -------------------------
-- Seller Account A
-- -------------------------
INSERT INTO "user" (id, name, email, emailVerified, createdAt, updatedAt)
VALUES (
  'seller_seed_a',
  'Nur Aina',
  'nuraina.market@dapur-rumah.test',
  1,
  strftime('%s', 'now'),
  strftime('%s', 'now')
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  email = excluded.email,
  emailVerified = excluded.emailVerified,
  updatedAt = strftime('%s', 'now');

INSERT INTO account (
  id,
  accountId,
  providerId,
  userId,
  password,
  createdAt,
  updatedAt
)
VALUES (
  'acct_seed_a_credential',
  'seller_seed_a',
  'credential',
  'seller_seed_a',
  'cf7fa26345a4a56594c9c5b6ee257118:2be1fa2e68e7c9d5e2c3767c536944b64ecf8b87e76040bae79b211f92e8b2a5bb97d1c25df4789bf30ba76a8f363c2f65e5485836179b55a5dbd5c75154b877',
  strftime('%s', 'now'),
  strftime('%s', 'now')
)
ON CONFLICT(id) DO UPDATE SET
  accountId = excluded.accountId,
  providerId = excluded.providerId,
  userId = excluded.userId,
  password = excluded.password,
  updatedAt = strftime('%s', 'now');

INSERT INTO sellers (
  id,
  shop_name,
  description,
  phone_whatsapp,
  state,
  city,
  is_active,
  is_featured
)
VALUES (
  'seller_seed_a',
  'Dapur Aina Kampung',
  'Masakan kampung dan kuih harian buatan rumah.',
  '601133336601',
  'Selangor',
  'Bangi',
  1,
  1
)
ON CONFLICT(id) DO UPDATE SET
  shop_name = excluded.shop_name,
  description = excluded.description,
  phone_whatsapp = excluded.phone_whatsapp,
  state = excluded.state,
  city = excluded.city,
  is_active = excluded.is_active,
  is_featured = excluded.is_featured;

INSERT INTO products (
  id, seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, is_active, createdAt, updatedAt
)
VALUES
  (
    'seed_a_menu_1',
    'seller_seed_a',
    'cat_2',
    'Ayam Percik Madu',
    'Ayam percik berempah dengan kuah madu pekat.',
    18.00,
    'per set',
    '',
    'ada_stok',
    1,
    1,
    strftime('%s', 'now'),
    strftime('%s', 'now')
  ),
  (
    'seed_a_menu_2',
    'seller_seed_a',
    'cat_3',
    'Kuih Seri Muka',
    'Seri muka pandan dengan lapisan pulut lemak.',
    12.00,
    'per box',
    '',
    'ada_stok',
    0,
    1,
    strftime('%s', 'now'),
    strftime('%s', 'now')
  ),
  (
    'seed_a_menu_3',
    'seller_seed_a',
    'cat_4',
    'Air Asam Boi Laici',
    'Minuman sejuk asam boi campur laici.',
    7.50,
    'per cup',
    '',
    'ada_stok',
    0,
    1,
    strftime('%s', 'now'),
    strftime('%s', 'now')
  )
ON CONFLICT(id) DO UPDATE SET
  seller_id = excluded.seller_id,
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  price_note = excluded.price_note,
  image_url = excluded.image_url,
  status = excluded.status,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  updatedAt = strftime('%s', 'now');

-- -------------------------
-- Seller Account B
-- -------------------------
INSERT INTO "user" (id, name, email, emailVerified, createdAt, updatedAt)
VALUES (
  'seller_seed_b',
  'Hakim Roslan',
  'hakim.kitchen@dapur-rumah.test',
  1,
  strftime('%s', 'now'),
  strftime('%s', 'now')
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  email = excluded.email,
  emailVerified = excluded.emailVerified,
  updatedAt = strftime('%s', 'now');

INSERT INTO account (
  id,
  accountId,
  providerId,
  userId,
  password,
  createdAt,
  updatedAt
)
VALUES (
  'acct_seed_b_credential',
  'seller_seed_b',
  'credential',
  'seller_seed_b',
  '4f680fca77594eb28359f9587ca7120d:309f6bb6e673c8ae406285fbe9dfd267fbc4c7cadaced705db01fc6ed13e1cf4209bcb10ec74e3d1e07d261577e395c5935c332269d2bcb6f759eb9354aacde7',
  strftime('%s', 'now'),
  strftime('%s', 'now')
)
ON CONFLICT(id) DO UPDATE SET
  accountId = excluded.accountId,
  providerId = excluded.providerId,
  userId = excluded.userId,
  password = excluded.password,
  updatedAt = strftime('%s', 'now');

INSERT INTO sellers (
  id,
  shop_name,
  description,
  phone_whatsapp,
  state,
  city,
  is_active,
  is_featured
)
VALUES (
  'seller_seed_b',
  'Kitchen Hakim Utara',
  'Menu utara dan manisan homemade setiap hari.',
  '60185550772',
  'Kedah',
  'Alor Setar',
  1,
  0
)
ON CONFLICT(id) DO UPDATE SET
  shop_name = excluded.shop_name,
  description = excluded.description,
  phone_whatsapp = excluded.phone_whatsapp,
  state = excluded.state,
  city = excluded.city,
  is_active = excluded.is_active,
  is_featured = excluded.is_featured;

INSERT INTO products (
  id, seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, is_active, createdAt, updatedAt
)
VALUES
  (
    'seed_b_menu_1',
    'seller_seed_b',
    'cat_2',
    'Nasi Daging Utara',
    'Nasi daging berempah dengan air asam pembuka selera.',
    16.50,
    'per set',
    '',
    'ada_stok',
    1,
    1,
    strftime('%s', 'now'),
    strftime('%s', 'now')
  ),
  (
    'seed_b_menu_2',
    'seller_seed_b',
    'cat_1',
    'Brownie Kedut Walnut',
    'Brownie coklat pekat dengan topping walnut rangup.',
    28.00,
    'per box',
    '',
    'ada_stok',
    0,
    1,
    strftime('%s', 'now'),
    strftime('%s', 'now')
  ),
  (
    'seed_b_menu_3',
    'seller_seed_b',
    'cat_5',
    'Keropok Lekor Crispy',
    'Keropok lekor goreng garing dengan sos homemade.',
    10.00,
    'per pack',
    '',
    'ada_stok',
    0,
    1,
    strftime('%s', 'now'),
    strftime('%s', 'now')
  )
ON CONFLICT(id) DO UPDATE SET
  seller_id = excluded.seller_id,
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  price_note = excluded.price_note,
  image_url = excluded.image_url,
  status = excluded.status,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  updatedAt = strftime('%s', 'now');
