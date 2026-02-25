import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Nasi Lemak Ayam Berempah', seller: 'Kak Mah Kitchen', price: 8.50, category: 'masakan_panas', image: 'https://images.unsplash.com/photo-1626804475297-4160aae2fa44?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Kek Coklat Moist', seller: 'Bake By Sarah', price: 15.00, category: 'pencuda_mulut', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'Mee Goreng Mamak', seller: 'Warisan Nenek', price: 6.00, category: 'masakan_panas', image: 'https://images.unsplash.com/photo-1626082896492-766af4eb65ed?auto=format&fit=crop&q=80&w=300' },
  { id: 4, name: 'Karipap Pusing (10pcs)', seller: 'Makcik Kiah', price: 5.00, category: 'kuih', image: 'https://images.unsplash.com/photo-1605333396914-230f293a9089?auto=format&fit=crop&q=80&w=300' },
  { id: 5, name: 'Ayam Masak Merah', seller: 'Dapur Nisa', price: 12.00, category: 'berlauk', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300' },
  { id: 6, name: 'Keropok Lekor', seller: 'Pok Jeli', price: 4.00, category: 'makanan_ringan', image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=300' },
];

const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: '🍽' },
  { id: 'masakan_panas', label: 'Masakan Panas', icon: '🍜' },
  { id: 'makanan_ringan', label: 'Makanan Ringan', icon: '🍿' },
  { id: 'kuih', label: 'Kuih Muih', icon: '🍰' },
  { id: 'berlauk', label: 'Berlauk', icon: '🍗' },
  { id: 'pencuda_mulut', label: 'Pencuci Mulut', icon: '🧁' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="header-location">
          <span className="location-label">Hantar ke</span>
          <button type="button" className="location-value">Pilih Lokasi ▾</button>
        </div>
        <button type="button" className="header-avatar" onClick={() => navigate('/account')} aria-label="Buka akaun">👤</button>
      </header>

      <div className="home-content">
        <div className="promo-banner">
          <div className="promo-content">
            <span className="promo-tag">🔥 PROMOSI</span>
            <h3>Free Delivery<br />First Order!</h3>
            <p>Tempah sekarang & jimat pengantaran.</p>
            <button type="button" className="promo-btn" onClick={() => navigate('/search')}>Tempah Sekarang</button>
          </div>
        </div>

        <div className="categories-scroll">
          <div className="categories-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="products-section">
          <div className="section-header">
            <h2>Makanan Popular</h2>
            <span className="item-count">{filteredProducts.length} menu</span>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/product?id=${product.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/product?id=${product.id}`);
                  }
                }}
              >
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-seller">{product.seller}</p>
                  <div className="product-footer">
                    <span className="product-price">RM {product.price.toFixed(2)}</span>
                    <button
                      type="button"
                      className="add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      aria-label={`Tambah ${product.name} ke troli`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
