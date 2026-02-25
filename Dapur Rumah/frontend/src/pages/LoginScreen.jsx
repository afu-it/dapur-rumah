import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      <form className="auth-form" onSubmit={(event) => {
        event.preventDefault();
        handleLogin();
      }}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="email@example.com"
            value={email}
            autoComplete="email"
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Sedang login...' : 'Login'}
        </button>

        <p className="auth-link">
          belum ada akaun? <button onClick={() => navigate('/register')}>Daftar</button>
        </p>
      </form>

      <div className="auth-extra">
        <div className="divider"><span>atau</span></div>
        <p className="auth-helper-text">Cuba tanpa akaun</p>
        <button type="button" className="seller-btn" onClick={() => navigate('/dashboard?demo=1')}>Demo Seller 1 (Nur Aina)</button>
        <button type="button" className="seller-btn seller-btn-spaced" onClick={() => navigate('/dashboard?demo=2')}>Demo Seller 2 (Hakim Roslan)</button>
      </div>
    </div>
  );
}
