import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MOCK_PRODUCT = {
  id: 1,
  name: 'Nasi Lemak Ayam Berempah',
  description: 'Nasi lemak rangup dengan ayam percik yang sedap. Disajikan dengan sambal hale dan acar.',
  price: 8.50,
  price_note: 'per set',
  category: 'masakan_panas',
  status: 'ada_stok',
  image: 'https://images.unsplash.com/photo-1626804475297-4160aae2fa44?auto=format&fit=crop&q=80&w=600',
  seller: {
    id: 'seller-1',
    shop_name: 'Kak Mah Kitchen',
    state: 'Selangor',
    phone_whatsapp: '60123456789',
  },
};

export default function ProductScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const { addToCart } = useCart();
  const [product, setProduct] = useState(MOCK_PRODUCT);

  useEffect(() => {
    if (productId) {
      // Load product from API
    }
  }, [productId]);

  function handleWhatsApp() {
    const message = encodeURIComponent(
      `Hai ${product.seller.shop_name}, saya berminat dengan produk ini:\n\n*${product.name}* (RM ${product.price.toFixed(2)})\n\nAdakah ia masih tersedia?`
    );
    let phone = product.seller.phone_whatsapp;
    if (phone.startsWith('0')) phone = '6' + phone;
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} oleh ${product.seller.shop_name} — RM ${product.price.toFixed(2)}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Pautan disalin!'))
        .catch(() => alert('Salin pautan secara manual daripada address bar.'));
    }
  }

  const statusClass = product.status === 'ada_stok' ? 'status-available' : product.status === 'preorder' ? 'status-preorder' : 'status-soldout';
  const statusLabel = product.status === 'ada_stok' ? 'Ada Stok' : product.status === 'preorder' ? 'Preorder' : 'Habis';

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} className="product-hero" />
      <div className="product-content">
        <span className={`product-status ${statusClass}`}>{statusLabel}</span>
        <h1>{product.name}</h1>
        <p className="product-price">
          RM {product.price.toFixed(2)}
          {product.price_note && <span className="product-price-note">/ {product.price_note}</span>}
        </p>
        <p className="product-description">{product.description || 'Tiada penerangan disediakan.'}</p>

        <button type="button" className="seller-card" onClick={() => navigate(`/seller?id=${product.seller.id}`)}>
          <div className="seller-avatar">{product.seller.shop_name?.charAt(0) || 'S'}</div>
          <div className="seller-info">
            <h3>{product.seller.shop_name}</h3>
            <p>{product.seller.state}</p>
          </div>
          <span>›</span>
        </button>

        <div className="action-buttons">
          <button type="button" className="whatsapp-btn" onClick={handleWhatsApp}>
            💬 Tempah via WhatsApp
          </button>
          <button type="button" className="share-btn" onClick={handleShare}>
            📤 Kongsi Produk
          </button>
          <button type="button" className="add-to-cart-btn" onClick={() => addToCart(product)}>
            🛒 Tambah ke Troli
          </button>
        </div>
      </div>
    </div>
  );
}
