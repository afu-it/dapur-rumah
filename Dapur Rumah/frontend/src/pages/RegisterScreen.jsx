import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      setError('Sila isi semua ruangan');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tidak sepadan');
      return;
    }

    if (password.length < 6) {
      setError('Password minima 6 karakter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Pendaftaran gagal');
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
        <p>Daftar akaun peniaga baharu</p>
      </div>

      <div className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Nama Penuh</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ali bin Abu"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            placeholder="Minima 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sahkan Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="auth-btn" onClick={handleRegister} disabled={loading}>
          {loading ? 'Sedang mendaftar...' : 'Daftar Akaun'}
        </button>

        <p className="auth-link">
          dah ada akaun? <button onClick={() => navigate('/login')}>Login</button>
        </p>
      </div>
    </div>
  );
}
