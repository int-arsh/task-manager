import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';
import { showToast } from '../utils/helpers';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // Verify token is still valid
        const response = await authAPI.getMe();
        setUser(response.data.data.user);
        setToken(storedToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      } catch (error) {
        // Token invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = response.data.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      showToast('Login successful!', 'success');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.register({ username, email, password });
      const { token: newToken, user: userData } = response.data.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      showToast('Registration successful!', 'success');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

