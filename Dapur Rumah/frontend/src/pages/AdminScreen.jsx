import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminScreen() {
  const navigate = useNavigate();
  const [sellers] = useState([
    { id: 1, name: 'Kak Mah Kitchen', email: 'kakmah@example.com', products: 12, status: 'active' },
    { id: 2, name: 'Bake By Sarah', email: 'sarah@example.com', products: 8, status: 'active' },
    { id: 3, name: 'Warisan Nenek', email: 'nenek@example.com', products: 15, status: 'active' },
    { id: 4, name: 'Makcik Kiah', email: 'kiah@example.com', products: 5, status: 'pending' },
  ]);

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Dapur Rumah</p>
        <button type="button" className="logout-btn" onClick={() => navigate('/')}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">24</div><div className="stat-label">Peniaga</div></div>
        <div className="stat-card"><div className="stat-value">156</div><div className="stat-label">Produk</div></div>
        <div className="stat-card"><div className="stat-value">892</div><div className="stat-label">Pesanan</div></div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Senarai Peniaga</h3>
        {sellers.map((seller) => (
          <div key={seller.id} className="section-card seller-admin-card">
            <div className="seller-admin-main">
              <div>
                <h4>{seller.name}</h4>
                <p>{seller.email}</p>
                <p>{seller.products} produk</p>
              </div>
              <span className={`product-status ${seller.status === 'active' ? 'status-available' : 'status-preorder'}`}>
                {seller.status === 'active' ? 'Aktif' : 'Menunggu'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Tindakan</h3>
        <button type="button" className="section-card action-card">📊 Analitik Platform</button>
        <button type="button" className="section-card action-card">📝 Urus Kategori</button>
        <button type="button" className="section-card action-card">⚙️ Tetapan Sistem</button>
      </div>
    </div>
  );
}
