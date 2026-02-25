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
        <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">24</div><div className="stat-label">Peniaga</div></div>
        <div className="stat-card"><div className="stat-value">156</div><div className="stat-label">Produk</div></div>
        <div className="stat-card"><div className="stat-value">892</div><div className="stat-label">Pesanan</div></div>
      </div>

      <div className="dashboard-section">
        <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 'bold' }}>Senarai Peniaga</h3>
        {sellers.map((seller) => (
          <div key={seller.id} className="section-card" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600 }}>{seller.name}</h4>
                <p style={{ fontSize: 13, color: '#636E72' }}>{seller.email}</p>
                <p style={{ fontSize: 12, color: '#636E72', marginTop: 4 }}>{seller.products} produk</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span style={{ fontSize: 10, background: seller.status === 'active' ? '#D1FAE5' : '#FEF3C7', color: seller.status === 'active' ? '#059669' : '#D97706', padding: '2px 8px', borderRadius: 4 }}>
                  {seller.status === 'active' ? 'AKTIF' : 'MENUNGGU'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 'bold' }}>Tindakan</h3>
        <button className="section-card" style={{ width: '100%', textAlign: 'left', marginBottom: 8 }}>📊 Analitik Platform</button>
        <button className="section-card" style={{ width: '100%', textAlign: 'left', marginBottom: 8 }}>📝 Urus Kategori</button>
        <button className="section-card" style={{ width: '100%', textAlign: 'left' }}>⚙️ Tetapan Sistem</button>
      </div>
    </div>
  );
}
