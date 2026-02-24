-- Insert products for Kak Lien (Kek & Biskut)
INSERT INTO products (id, seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('prod_1_1', 'seller1', 'cat_1', 'Kek Chocolate Moist', 'Kek chocolate moist berkualiti, lembut dan sedap', 35.00, 'per biji', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_1_2', 'seller1', 'cat_1', 'Kek Red Velvet', 'Kek red velvet gebu dengan cream cheese', 40.00, 'per biji', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_1_3', 'seller1', 'cat_1', 'Biskut Oat Cookies', 'Biskut oat rangup dan sihat', 15.00, 'per pack', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Mak Siti (Nasi & Lauk)
INSERT INTO products (id, seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('prod_2_1', 'seller2', 'cat_2', 'Nasi Lemak Pandan', 'Nasi lemak dengan sambal yang sedap', 8.00, 'per packet', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_2_2', 'seller2', 'cat_2', 'Ayam Goreng Mentega', 'Ayam goreng rangup dengan sos mentega', 12.00, 'per serving', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_2_3', 'seller2', 'cat_2', 'Sambal Terong', 'Sambal terong yang pedas dan sedap', 5.00, 'per packet', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Kek Lapis Viral
INSERT INTO products (id, seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('prod_3_1', 'seller3', 'cat_1', 'Kek Lapis 7 Warna', 'Kek lapis 7 warna premium, cantik dan sedap', 80.00, 'per kotak', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_3_2', 'seller3', 'cat_1', 'Kek Lapis Chocolate', 'Kek lapis chocolate yang rich dan legit', 75.00, 'per kotak', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_3_3', 'seller3', 'cat_1', 'Kek Cheese Marble', 'Kek cheese marble yang lembut', 45.00, 'per biji', '', 'preorder', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Mak Long (Kuih Muih)
INSERT INTO products (id, seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('prod_4_1', 'seller4', 'cat_3', 'Kuih Lapis', 'Kuih lapis tradisional yang lembut', 20.00, 'per kotak', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_4_2', 'seller4', 'cat_3', 'Kuih Talam', 'Kuih talam pandan dan keladi', 15.00, 'per bekas', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_4_3', 'seller4', 'cat_3', 'Onde-Onde', 'Onde-onde isi keladi, lembut dan sedap', 12.00, 'per pack', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now'));

-- Insert products for Fruitz (Minuman)
INSERT INTO products (id, seller_id, category_id, name, description, price, price_note, image_url, status, is_featured, createdAt, updatedAt) VALUES
('prod_5_1', 'seller5', 'cat_4', 'Jus Mangga Segar', 'Jus mangga fresh tanpa pewarna', 8.00, 'per gelas', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_5_2', 'seller5', 'cat_4', 'Jus Carrot Mix', 'Jus carrot + epal + halia yang sihat', 10.00, 'per gelas', '', 'ada_stok', 0, strftime('%s', 'now'), strftime('%s', 'now')),
('prod_5_3', 'seller5', 'cat_4', 'Air Kelapa Muda', 'Air kelapa segar dari coconut farm', 7.00, 'per gelas', '', 'ada_stok', 1, strftime('%s', 'now'), strftime('%s', 'now'));
