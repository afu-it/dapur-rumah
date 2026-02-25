import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';

// Pages
import HomeScreen from './pages/HomeScreen';
import SearchScreen from './pages/SearchScreen';
import CartScreen from './pages/CartScreen';
import AccountScreen from './pages/AccountScreen';
import ProductScreen from './pages/ProductScreen';
import SellerScreen from './pages/SellerScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import DashboardScreen from './pages/DashboardScreen';
import AdminScreen from './pages/AdminScreen';

function TabLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="tab-layout">
      <div className="tab-content">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/account" element={<AccountScreen />} />
        </Routes>
      </div>
      <nav className="tab-bar">
        <button
          className={`tab-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="tab-icon"><Home size={20} /></span>
          <span>Home</span>
        </button>
        <button
          className={`tab-item ${isActive('/search') ? 'active' : ''}`}
          onClick={() => navigate('/search')}
        >
          <span className="tab-icon"><Search size={20} /></span>
          <span>Cari</span>
        </button>
        <button
          className={`tab-item ${isActive('/cart') ? 'active' : ''}`}
          onClick={() => navigate('/cart')}
        >
          <span className="tab-icon"><ShoppingCart size={20} /></span>
          <span>Troli</span>
        </button>
        <button
          className={`tab-item ${isActive('/account') ? 'active' : ''}`}
          onClick={() => navigate('/account')}
        >
          <span className="tab-icon"><User size={20} /></span>
          <span>Akaun</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TabLayout />} />
        <Route path="/product" element={<ProductScreen />} />
        <Route path="/seller" element={<SellerScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
