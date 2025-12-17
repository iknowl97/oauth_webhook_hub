import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const isAuthenticated = !!token;

  useEffect(() => {
    // Configure global axios header
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (password) => {
    try {
      // Direct call to avoid circular dependency if using lib/api.js which might eventually use this context
      // But for now, we'll keep it simple
      const base = import.meta.env.VITE_BASE_URL || '';
      const { data } = await axios.post(`${base}/api/auth/login`, { password });
      setToken(data.token);
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
