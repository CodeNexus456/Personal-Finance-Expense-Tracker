import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { localBackend } from '../services/localBackend';

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const savedToken = localStorage.getItem('fintrack_token');
    const savedUser = localStorage.getItem('fintrack_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('fintrack_token');
        localStorage.removeItem('fintrack_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('fintrack_token', receivedToken);
      localStorage.setItem('fintrack_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true };
    } catch (err: any) {
      // Direct local fallback if needed
      try {
        const localRes = localBackend.login({ email, password });
        localStorage.setItem('fintrack_token', localRes.token);
        localStorage.setItem('fintrack_user', JSON.stringify(localRes.user));
        setToken(localRes.token);
        setUser(localRes.user);
        return { success: true };
      } catch (localErr: any) {
        const message = err.response?.data?.message || localErr.message || 'Invalid email or password';
        return { success: false, message };
      }
    }
  };

  const demoLogin = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await login('demo@fintrack.app', 'demo123');
      if (res.success) {
        return res;
      }
    } catch (e) {
      // Fallback
    }

    try {
      const localRes = localBackend.login({ email: 'demo@fintrack.app', password: 'demo123' });
      localStorage.setItem('fintrack_token', localRes.token);
      localStorage.setItem('fintrack_user', JSON.stringify(localRes.user));
      setToken(localRes.token);
      setUser(localRes.user);
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  const register = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data?.token && res.data?.user) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('fintrack_token', receivedToken);
        localStorage.setItem('fintrack_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true };
      }
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
        return { success: false, message: err.response.data.message };
      }
    }

    // Client local storage fallback (for Vercel static deployments or offline)
    try {
      const localRes = localBackend.register({ name, email, password });
      localStorage.setItem('fintrack_token', localRes.token);
      localStorage.setItem('fintrack_user', JSON.stringify(localRes.user));
      setToken(localRes.token);
      setUser(localRes.user);
      return { success: true };
    } catch (localErr: any) {
      return { success: false, message: localErr.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        demoLogin,
        register,
        logout,
      }}
    >
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
