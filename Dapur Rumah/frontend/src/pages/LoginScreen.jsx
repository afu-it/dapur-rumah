import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      setError('Sila isi semua ruangan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login gagal');
      }
    } catch (err) {
      setError('Ralat sambungan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-header">
        <div className="auth-logo">🍽</div>
        <h1>Dapur Rumah</h1>
        <p>Login ke akaun peniaga</p>
      </div>

      <div className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Sedang login...' : 'Login'}
        </button>

        <p className="auth-link">
          belum ada akaun? <button onClick={() => navigate('/register')}>Daftar</button>
        </p>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="divider"><span>atau</span></div>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#636E72', marginBottom: 16 }}>Cuba tanpa akaun</p>
        <button className="seller-btn" onClick={() => navigate('/dashboard?demo=1')}>Demo Seller 1 (Nur Aina)</button>
        <button className="seller-btn" style={{ marginTop: 8 }} onClick={() => navigate('/dashboard?demo=2')}>Demo Seller 2 (Hakim Roslan)</button>
      </div>
    </div>
  );
}
