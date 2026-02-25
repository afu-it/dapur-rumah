import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MOCK_SELLER = {
  id: 'seller-1',
  shop_name: 'Kak Mah Kitchen',
  description: 'Menjual pelbagai juadah rumah yang lazat. Masakan tradisional yang tulen.',
  state: 'Selangor',
  products: [
    { id: 1, name: 'Nasi Lemak Ayam Berempah', price: 8.50, status: 'ada_stok', image: 'https://images.unsplash.com/photo-1626804475297-4160aae2fa44?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Nasi Goreng Kampung', price: 7.00, status: 'ada_stok', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Ayam Percik', price: 12.00, status: 'preorder', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=300' },
  ],
};

export default function SellerScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('id');
  const [seller, setSeller] = useState(MOCK_SELLER);

  useEffect(() => {
    if (sellerId) {
      // Load seller from API
    }
  }, [sellerId]);

  return (
    <div className="seller-screen">
      <div className="seller-header">
        <div className="seller-header-avatar">{seller.shop_name?.charAt(0) || 'S'}</div>
        <h1>{seller.shop_name}</h1>
        <p>📍 {seller.state}</p>
        {seller.description && <p className="seller-description">{seller.description}</p>}
      </div>

      <div className="products-section seller-products">
        <h2 className="section-title">Produk dari {seller.shop_name}</h2>
        <div className="products-grid">
          {seller.products.map((product) => (
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
                <div className="product-footer">
                  <span className="product-price">RM {product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
