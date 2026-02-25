import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = {
  '1': {
    greeting: 'Demo Seller 1 (Nur Aina)',
    profile: { shop_name: 'Dapur Aina Kampung', description: 'Masakan kampung, lauk tradisional, dan kuih harian.', phone_whatsapp: '601133336601', state: 'Selangor' },
    products: [
      { id: 'demo-1-1', name: 'Ayam Percik Madu', price: 18.0, price_note: 'per set', status: 'ada_stok' },
      { id: 'demo-1-2', name: 'Kuih Seri Muka', price: 12.0, price_note: 'per box', status: 'preorder' },
      { id: 'demo-1-3', name: 'Air Asam Boi', price: 5.5, price_note: 'per cup', status: 'habis' },
    ],
  },
  '2': {
    greeting: 'Demo Seller 2 (Hakim Roslan)',
    profile: { shop_name: 'Kitchen Hakim Utara', description: 'Menu utara, dessert, dan makanan frozen homemade.', phone_whatsapp: '60185550772', state: 'Kedah' },
    products: [
      { id: 'demo-2-1', name: 'Nasi Daging Utara', price: 16.5, price_note: 'per set', status: 'ada_stok' },
      { id: 'demo-2-2', name: 'Brownie Kedut', price: 28.0, price_note: 'per box', status: 'preorder' },
      { id: 'demo-2-3', name: 'Keropok Lekor Crispy', price: 10.0, price_note: 'per pack', status: 'ada_stok' },
    ],
  },
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const demoId = searchParams.get('demo');
  const isDemo = !!demoId;
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({ shop_name: '', description: '', phone_whatsapp: '', state: '' });
  const [products, setProducts] = useState([]);
  const [analytics] = useState({ views: 0, clicks: 0 });
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (isDemo) {
      const demo = DEMO_ACCOUNTS[demoId] || DEMO_ACCOUNTS['1'];
      setProfile(demo.profile);
      setProducts(demo.products);
    }
  }, [demoId, isDemo]);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  }

  function handleSaveProfile() {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  }

  function getStatusBadge(status) {
    const badges = {
      ada_stok: { label: 'Ada Stok', className: 'status-available' },
      preorder: { label: 'Preorder', className: 'status-preorder' },
      habis: { label: 'Habis', className: 'status-soldout' },
    };
    return badges[status] || badges.ada_stok;
  }

  return (
    <div className="dashboard-screen">
      <div className="dashboard-header">
        <h1>{isDemo ? DEMO_ACCOUNTS[demoId]?.greeting : `Hai, ${user?.name || 'Peniaga'}`}</h1>
        <p>{profile.shop_name || 'Dapur Saya'}</p>
        <button type="button" className="logout-btn" onClick={handleLogout}>{isDemo ? 'Keluar Demo' : 'Logout'}</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{analytics.views}</div><div className="stat-label">Paparan</div></div>
        <div className="stat-card"><div className="stat-value">{analytics.clicks}</div><div className="stat-label">WhatsApp</div></div>
        <div className="stat-card"><div className="stat-value">{products.length}</div><div className="stat-label">Produk</div></div>
      </div>

      <div className="dashboard-section">
        <div className="section-card">
          <h3>Profil Kedai</h3>
          <div className="form-group">
            <label>Nama Kedai</label>
            <input className="form-input" value={profile.shop_name} onChange={(e) => setProfile({ ...profile, shop_name: e.target.value })} placeholder="Nama kedai" />
          </div>
          <div className="form-group">
            <label>Deskripsi</label>
            <textarea className="form-textarea" value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} placeholder="Deskripsi kedai" />
          </div>
          <div className="form-group">
            <label>No. WhatsApp</label>
            <input className="form-input" value={profile.phone_whatsapp} onChange={(e) => setProfile({ ...profile, phone_whatsapp: e.target.value })} placeholder="60123456789" />
          </div>
          <div className="form-group">
            <label>Negeri</label>
            <input className="form-input" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} placeholder="Selangor" />
          </div>
          <button type="button" className="save-btn" onClick={handleSaveProfile}>Simpan Profil</button>
          {showSaved && <p className="helper-success">Profil disimpan.</p>}
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Produk Saya</h3>
        {products.length === 0 ? (
          <div className="section-card"><p className="muted-text">Tiada produk lagi</p></div>
        ) : (
          products.map((product) => {
            const badge = getStatusBadge(product.status);
            return (
              <div key={product.id} className="section-card product-admin-card">
                <h4>{product.name}</h4>
                <p className="price-strong">RM {product.price.toFixed(2)}</p>
                <span className={`product-status ${badge.className}`}>{badge.label}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
