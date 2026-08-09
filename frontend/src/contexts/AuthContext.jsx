import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

/**
 * Authentication Context Provider
 * Manages global user state, login/logout functions, and persists sessions via localStorage.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Re-hydrate session on hard browser refresh
  useEffect(() => {
    const token = localStorage.getItem('cais_token');
    const storedUser = localStorage.getItem('cais_user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        
        localStorage.setItem('cais_token', token);
        localStorage.setItem('cais_user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${userData.role}`);
        return true;
      }
    } catch (error) {
      // Axios interceptor handles the 401 Toast
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout endpoint failed, proceeding with local clearing.');
    } finally {
      localStorage.removeItem('cais_token');
      localStorage.removeItem('cais_user');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Securely logged out.');
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
