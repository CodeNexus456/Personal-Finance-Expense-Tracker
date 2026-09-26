import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('fintrack_token');
    const savedUser = localStorage.getItem('fintrack_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify token with backend
        api
          .get('/auth/me')
          .then((res) => {
            setUser(res.data);
            localStorage.setItem('fintrack_user', JSON.stringify(res.data));
          })
          .catch(() => {
            // Token is invalid/expired
            logout();
          })
          .finally(() => {
            setLoading(false);
          });
        return;
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('fintrack_token', receivedToken);
      localStorage.setItem('fintrack_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    }
  };

  const demoLogin = async (): Promise<{ success: boolean; message?: string }> => {
    return login('demo@fintrack.app', 'demo123');
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('fintrack_token', receivedToken);
      localStorage.setItem('fintrack_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, demoLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
