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

const SUGGESTIONS = ['Nasi Lemak', 'Kek Coklat', 'Ayam Goreng', 'Kuih Lapis', 'Mee Goreng'];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  function handleSearch(text) {
    setSearchQuery(text);
    if (text.length > 0) {
      const results = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(text.toLowerCase()) ||
        p.seller.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }

  return (
    <div className="search-screen">
      <div className="search-header">
        <div className="search-input-wrapper">
          <span>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Cari makanan..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery.length > 0 && (
            <button onClick={() => handleSearch('')}>✕</button>
          )}
        </div>
      </div>

      <div className="search-content">
        {searchQuery.length === 0 ? (
          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Popular Carian</h3>
            {SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-item"
                onClick={() => handleSearch(suggestion)}
              >
                <span>✓</span>
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🔍</div>
            <h3>Tiada makanan dijumnai</h3>
            <p>Cuba carian lain</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '14px', color: '#636E72', marginBottom: '12px' }}>{searchResults.length} hasil</p>
            <div className="products-grid">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/product?id=${product.id}`)}
                >
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-seller">{product.seller}</p>
                    <div className="product-footer">
                      <span className="product-price">RM {product.price.toFixed(2)}</span>
                      <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
