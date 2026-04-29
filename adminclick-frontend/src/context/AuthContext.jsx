import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminclick_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/me')
        .then(res => {
          // UserResource peut encapsuler dans .data
          const userData = res.data.data || res.data;
          setUser(userData);
          setLoading(false);
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const { user: userData, token: newToken } = res.data;
    // UserResource peut encapsuler dans .data
    const u = userData.data || userData;
    localStorage.setItem('adminclick_token', newToken);
    localStorage.setItem('adminclick_user', JSON.stringify(u));
    setToken(newToken);
    setUser(u);
    return u;
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/register', { name, email, password, password_confirmation });
    const { user: userData, token: newToken } = res.data;
    // UserResource peut encapsuler dans .data
    const u = userData.data || userData;
    localStorage.setItem('adminclick_token', newToken);
    localStorage.setItem('adminclick_user', JSON.stringify(u));
    setToken(newToken);
    setUser(u);
    return u;
  };

  const logout = () => {
    api.post('/logout').catch(() => {});
    localStorage.removeItem('adminclick_token');
    localStorage.removeItem('adminclick_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
