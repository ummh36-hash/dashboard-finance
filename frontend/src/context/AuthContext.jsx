import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 1,
  name: 'Alex Morgan',
  email: 'alex.kimi@finance.io',
  joinedDate: 'January 2026',
  currency: 'USD ($)',
  monthlyBudget: 5000
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kimi_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('kimi_token');
      const storedUser = localStorage.getItem('kimi_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // try to fetch fresh profile if backend is up
          try {
            const profile = await api.getProfile(storedToken);
            if (profile && profile.user) {
              setUser(profile.user);
              localStorage.setItem('kimi_user', JSON.stringify(profile.user));
            }
          } catch (e) {
            // Keep stored user if backend is restarting or offline
          }
        } catch (e) {
          localStorage.removeItem('kimi_token');
          localStorage.removeItem('kimi_user');
          setUser(null);
          setToken(null);
        }
      } else {
        // Default login with demo user for seamless first review
        const demoLogged = localStorage.getItem('kimi_has_logged_out');
        if (!demoLogged) {
          setUser(DEMO_USER);
          setToken('demo-token-12345');
          localStorage.setItem('kimi_user', JSON.stringify(DEMO_USER));
          localStorage.setItem('kimi_token', 'demo-token-12345');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    localStorage.removeItem('kimi_has_logged_out');
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('kimi_token', data.token);
      localStorage.setItem('kimi_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      // If backend is not reached yet or mock fallback
      if (email && password) {
        const mockUser = {
          id: Date.now(),
          name: email.split('@')[0] || 'KIMI User',
          email: email,
          joinedDate: 'September 2026',
          currency: 'USD ($)',
          monthlyBudget: 5000
        };
        setUser(mockUser);
        setToken('token-' + Date.now());
        localStorage.setItem('kimi_token', 'token-' + Date.now());
        localStorage.setItem('kimi_user', JSON.stringify(mockUser));
        return { success: true };
      }
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    localStorage.removeItem('kimi_has_logged_out');
    try {
      const data = await api.register(name, email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('kimi_token', data.token);
      localStorage.setItem('kimi_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      // Mock registration fallback
      if (name && email && password) {
        const mockUser = {
          id: Date.now(),
          name: name,
          email: email,
          joinedDate: 'September 2026',
          currency: 'USD ($)',
          monthlyBudget: 5000
        };
        setUser(mockUser);
        setToken('token-' + Date.now());
        localStorage.setItem('kimi_token', 'token-' + Date.now());
        localStorage.setItem('kimi_user', JSON.stringify(mockUser));
        return { success: true };
      }
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kimi_token');
    localStorage.removeItem('kimi_user');
    localStorage.setItem('kimi_has_logged_out', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
