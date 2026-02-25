import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function AccountScreen() {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useCart();
  const [activeSection, setActiveSection] = useState('details');
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    phone: userProfile.phone || '',
    address: userProfile.address || '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSave() {
    updateProfile(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <div className="account-screen">
      <div className="account-tabs">
        <button
          className={`account-tab ${activeSection === 'details' ? 'active' : ''}`}
          onClick={() => setActiveSection('details')}
        >
          👤 Details
        </button>
        <button
          className={`account-tab ${activeSection === 'address' ? 'active' : ''}`}
          onClick={() => setActiveSection('address')}
        >
          📍 Address
        </button>
      </div>

      <div className="account-content">
        {activeSection === 'details' ? (
          <div>
            <div className="profile-header">
              <div className="profile-avatar">👤</div>
              <h2>Pembeli</h2>
            </div>
            <div className="form-group">
              <label>Nama Penuh</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ali bin Abu"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Nombor Telefon</label>
              <input
                type="tel"
                className="form-input"
                placeholder="012 345 6789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <button className="save-btn" onClick={handleSave}>Simpan Maklumat</button>
          </div>
        ) : (
          <div>
            <div className="profile-header">
              <div className="profile-avatar">📍</div>
              <h2>Alamat Penghantaran</h2>
            </div>
            <div className="form-group">
              <label>Alamat Penghantaran</label>
              <textarea
                className="form-textarea"
                placeholder="No. 123, Jalan Sejuk, Taman Flower, 43000 Kajang, Selangor"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <button className="save-btn" onClick={handleSave}>Simpan Alamat</button>
          </div>
        )}
      </div>

      <div className="seller-section">
        <div className="divider">
          <span>atau</span>
        </div>
        <p className="seller-text">Anda peniaga? Login untuk urus pesanan.</p>
        <button className="seller-btn" onClick={() => navigate('/login')}>
          Login sebagai Peniaga
        </button>
        <div className="demo-btns">
          <button className="demo-btn" onClick={() => navigate('/dashboard?demo=1')}>Demo Seller 1</button>
          <button className="demo-btn" onClick={() => navigate('/dashboard?demo=2')}>Demo Seller 2</button>
        </div>
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', bottom: 100, left: 16, right: 16, background: '#059669', borderRadius: 12, padding: 12, textAlign: 'center', color: 'white', fontWeight: 600 }}>
          ✓ Maklumat berjaya disimpan!
        </div>
      )}
    </div>
  );
}
