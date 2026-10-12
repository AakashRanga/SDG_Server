import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8006';
  }
  return 'http://180.235.121.250:8006';
};

const AUTH_API = `${getBaseUrl()}/api/auth`;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
  last_login?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (newPassword: string, username?: string) => Promise<{ success: boolean; message?: string }>;
  createPassword: (data: { username: string; email: string; password: string; full_name?: string; role?: string }) => Promise<{ success: boolean; message?: string }>;
  verifySession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('sdg_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sdg_admin_token') || null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set default axios Authorization header if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Session verification on initial load
  const verifySession = async (): Promise<boolean> => {
    const currentToken = localStorage.getItem('sdg_admin_token');
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return false;
    }

    try {
      const res = await axios.get(`${AUTH_API}/verify`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      if (res.data?.success && res.data?.authenticated) {
        setUser(res.data.user);
        setToken(currentToken);
        localStorage.setItem('sdg_admin_user', JSON.stringify(res.data.user));
        setIsLoading(false);
        return true;
      } else {
        throw new Error('Session unverified');
      }
    } catch (err) {
      console.warn('Session verification failed, logging out:', err);
      localStorage.removeItem('sdg_admin_token');
      localStorage.removeItem('sdg_admin_user');
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  // Login handler
  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(`${AUTH_API}/login`, { username, password });
      if (res.data?.success && res.data?.token) {
        const authToken = res.data.token;
        const authUser = res.data.user;

        localStorage.setItem('sdg_admin_token', authToken);
        localStorage.setItem('sdg_admin_user', JSON.stringify(authUser));

        setToken(authToken);
        setUser(authUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        return { success: true, message: res.data.message || 'Login successful' };
      } else {
        return { success: false, message: res.data?.message || 'Invalid credentials' };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${AUTH_API}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('sdg_admin_token');
      localStorage.removeItem('sdg_admin_user');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Update password handler (no old password required)
  const updatePassword = async (newPassword: string, username?: string) => {
    try {
      const res = await axios.put(`${AUTH_API}/update-password`, {
        username: username || user?.username,
        new_password: newPassword
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.success) {
        if (res.data.token) {
          localStorage.setItem('sdg_admin_token', res.data.token);
          setToken(res.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }
        return { success: true, message: res.data.message || 'Password updated successfully' };
      }
      return { success: false, message: res.data?.message || 'Failed to update password' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error updating password';
      return { success: false, message: msg };
    }
  };

  // Create / Register user handler
  const createPassword = async (data: { username: string; email: string; password: string; full_name?: string; role?: string }) => {
    try {
      const res = await axios.post(`${AUTH_API}/create-password`, data);
      if (res.data?.success) {
        return { success: true, message: res.data.message || 'User credentials created successfully' };
      }
      return { success: false, message: res.data?.message || 'Failed to create credentials' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error creating user credentials';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updatePassword,
        createPassword,
        verifySession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
