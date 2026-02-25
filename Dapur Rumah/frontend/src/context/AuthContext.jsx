import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const session = await api.get('/api/auth/get-session');
      if (session.session) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const result = await api.post('/api/auth/sign-in/email', { email, password });
    if (result.token) {
      localStorage.setItem('dapur_auth_token', result.token);
      await checkSession();
    }
    return result;
  }

  async function register(name, email, password) {
    const result = await api.post('/api/auth/sign-up/email', { name, email, password });
    if (result.token) {
      localStorage.setItem('dapur_auth_token', result.token);
      await checkSession();
    }
    return result;
  }

  async function logout() {
    await api.post('/api/auth/sign-out', {});
    localStorage.removeItem('dapur_auth_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
