import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set Authorization Header on global axios instance
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthHeader(token);
        try {
          // Fetch current user details
          const res = await axios.get('/api/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      if (res.data && res.data.success) {
        const { token, ...userData } = res.data.data;
        localStorage.setItem('token', token);
        setAuthHeader(token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid server response' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token, ...userData } = res.data.data;
        localStorage.setItem('token', token);
        setAuthHeader(token);
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid response format' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
