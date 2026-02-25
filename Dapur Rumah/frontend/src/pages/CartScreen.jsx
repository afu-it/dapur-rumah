import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const navigate = useNavigate();
  const { cart, cartTotal, userProfile, removeFromCart, updateQty, generateWhatsAppMessage } = useCart();

  function handleSendToWhatsApp() {
    if (cart.length === 0) return;
    if (!userProfile.name || !userProfile.phone || !userProfile.address) {
      alert('Sila lengkapkan maklumat profil anda terlebih dahulu!');
      navigate('/account');
      return;
    }
    const text = generateWhatsAppMessage();
    const encodedText = encodeURIComponent(text);
    const sellerPhone = '60123456789';
    window.open(`https://wa.me/${sellerPhone}?text=${encodedText}`, '_blank');
  }

  if (cart.length === 0) {
    return (
      <div className="cart-screen">
        <header className="cart-header">
          <h1>Troli Saya</h1>
        </header>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h3>Troli Kosong</h3>
          <p>Mula-mula cari makanan sedap!</p>
          <button type="button" className="btn-primary" onClick={() => navigate('/')}>Mula Belanja</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-screen">
      <header className="cart-header">
        <h1>Troli Saya</h1>
        <p>{cart.length} menu dalam troli</p>
      </header>
      <div className="cart-content">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-title">{item.name}</div>
              <div className="cart-item-price">RM {(item.price * item.qty).toFixed(2)}</div>
              <div className="qty-control">
                <button type="button" className="qty-btn" onClick={() => updateQty(item.id, -1)} aria-label={`Kurangkan kuantiti ${item.name}`}>-</button>
                <span>{item.qty}</span>
                <button type="button" className="qty-btn" onClick={() => updateQty(item.id, 1)} aria-label={`Tambah kuantiti ${item.name}`}>+</button>
                <button type="button" className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                  Buang
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="subtotal-row">
          <span>Subtotal</span>
          <span className="subtotal-amount">RM {cartTotal.toFixed(2)}</span>
        </div>
        <div className="delivery-card">
          <h4>📍 Maklumat Penghantaran</h4>
          <p>Nama: {userProfile.name || '-'}</p>
          <p>Tel: {userProfile.phone || '-'}</p>
          <p>Alamat: {userProfile.address || '-'}</p>
          <button type="button" className="text-link-btn" onClick={() => navigate('/account')}>
            Kemaskini profil penghantaran
          </button>
        </div>
        <button type="button" className="whatsapp-btn" onClick={handleSendToWhatsApp}>
          💬 Hantar Pesanan ke WhatsApp
        </button>
      </div>
    </div>
  );
}
