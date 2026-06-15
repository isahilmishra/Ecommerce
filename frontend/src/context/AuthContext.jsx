import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('apex_token'));
  const [loading, setLoading] = useState(true);

  // On mount, if token exists, verify it and load user profile
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('apex_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('apex_token', newToken);
    setToken(newToken);
    setUser(userData);

    // Merge guest cart into user cart
    const sessionId = localStorage.getItem('ecommerce_session_id');
    if (sessionId) {
      try {
        await axios.post('/api/cart/merge', { sessionId, userId: userData.id });
      } catch (e) { /* ignore merge errors */ }
    }
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('apex_token', newToken);
    setToken(newToken);
    setUser(userData);

    // Merge guest cart into user cart
    const sessionId = localStorage.getItem('ecommerce_session_id');
    if (sessionId) {
      try {
        await axios.post('/api/cart/merge', { sessionId, userId: userData.id });
      } catch (e) { /* ignore merge errors */ }
    }
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('apex_token');
    setToken(null);
    setUser(null);
  };

  // The identifier used for cart/orders: userId if logged in, else sessionId
  const getIdentifier = () => {
    if (user) return { userId: user._id || user.id };
    const sessionId = localStorage.getItem('ecommerce_session_id') ||
      (() => {
        const id = 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('ecommerce_session_id', id);
        return id;
      })();
    return { sessionId };
  };

  // Which ID to use for fetching cart/orders
  const getCartOrderId = () => {
    if (user) return user._id || user.id;
    let sessionId = localStorage.getItem('ecommerce_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('ecommerce_session_id', sessionId);
    }
    return sessionId;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, getIdentifier, getCartOrderId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
