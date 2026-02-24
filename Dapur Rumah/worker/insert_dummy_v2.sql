-- Create user table
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- Create session table
CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY NOT NULL,
    expiresAt TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    userId TEXT NOT NULL REFERENCES user(id)
);

-- Create account table
CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    userId TEXT NOT NULL REFERENCES user(id),
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    password TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- Create verification table
CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY NOT NULL,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
);

-- Insert 5 dummy sellers (users)
INSERT OR IGNORE INTO user (id, name, email, emailVerified, createdAt, updatedAt) VALUES 
('seller1', 'Kak Lien Cake House', 'kaklien@test.com', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller2', 'Dapur Mak Siti', 'maksiti@test.com', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller3', 'Kek Lapis Viral', 'keklapis@test.com', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller4', 'Kuih Tradisional Mak Long', 'maklong@test.com', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller5', 'Minuman Fruitz', 'fruitz@test.com', 1, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert seller profiles
INSERT OR IGNORE INTO sellers (id, shop_name, description, phone_whatsapp, state, city, is_active, is_featured) VALUES
('seller1', 'Kak Lien Cake House', 'Kek手工 dan biskut homemade yang segar dan sedap', '60123456701', 'Selangor', 'Shah Alam', 1, 1),
('seller2', 'Dapur Mak Siti', 'Lauk-pauk tradisional Homemade untuk keluarga', '60123456702', 'Melaka', 'Melaka Tengah', 1, 1),
('seller3', 'Kek Lapis Viral', 'Kek lapis berbagai flavour, tempahan khas', '60123456703', 'Johor', 'Johor Bahru', 1, 1),
('seller4', 'Kuih Tradisional Mak Long', 'Kuih-muih tradisional asli Malaysia', '60123456704', 'Perak', 'Ipoh', 1, 0),
('seller5', 'Minuman Fruitz', 'Minuman buah segar dan sihat', '60123456705', 'W.P. Kuala Lumpur', 'Kuala Lumpur', 1, 0);

-- Insert products for Kak Lien (Kek & Biskut)
INSERT INTO products (seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('seller1', 'cat_1', 'Kek Chocolate Moist', 'Kek chocolate moist berkualiti, lembut dan sedap', 35.00, 'per biji', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller1', 'cat_1', 'Kek Red Velvet', 'Kek red velvet gebu dengan cream cheese', 40.00, 'per biji', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller1', 'cat_1', 'Biskut Oat Cookies', 'Biskut oat rangup dan sihat', 15.00, 'per pack', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Mak Siti (Nasi & Lauk)
INSERT INTO products (seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('seller2', 'cat_2', 'Nasi Lemak Pandan', 'Nasi lemak dengan sambal yang sedap', 8.00, 'per packet', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller2', 'cat_2', 'Ayam Goreng Mentega', 'Ayam goreng rangup dengan sos mentega', 12.00, 'per serving', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller2', 'cat_2', 'Sambal Terong', 'Sambal terong yang pedas dan sedap', 5.00, 'per packet', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Kek Lapis Viral
INSERT INTO products (seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('seller3', 'cat_1', 'Kek Lapis 7 Warna', 'Kek lapis 7 warna premium, cantik dan sedap', 80.00, 'per kotak', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller3', 'cat_1', 'Kek Lapis Chocolate', 'Kek lapis chocolate yang rich dan legit', 75.00, 'per kotak', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller3', 'cat_1', 'Kek Cheese Marble', 'Kek cheese marble yang lembut', 45.00, 'per biji', '', 'preorder', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Mak Long (Kuih Muih)
INSERT INTO products (seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('seller4', 'cat_3', 'Kuih Lapis', 'Kuih lapis tradisional yang lembut', 20.00, 'per kotak', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller4', 'cat_3', 'Kuih Talam', 'Kuih talam pandan dan keladi', 15.00, 'per bekas', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now')),
('seller4', 'cat_3', 'Onde-Onde', 'Onde-onde isi keladi, lembut dan sedap', 12.00, 'per pack', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Fruitz (Minuman)
INSERT INTO products (seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('seller5', 'cat_4', 'Jus Mangga Segar', 'Jus mangga fresh tanpa pewarna', 8.00, 'per gelas', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('seller5', 'cat_4', 'Jus Carrot Mix', 'Jus carrot + epal + halia yang sihat', 10.00, 'per gelas', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now')),
('seller5', 'cat_4', 'Air Kelapa Muda', 'Air kelapa segar dari coconut farm', 7.00, 'per gelas', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now'));
