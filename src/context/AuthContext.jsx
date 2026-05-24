import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('zillgo_user');
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('zillgo_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          // Verify session with backend
          try {
            const profile = await api.getProfile();
            if (profile.id) setUser(profile);
            else logout();
          } catch (e) {
             // Backend down, keep local user
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [logout]);

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      if (data.message && data.message !== 'Success') throw new Error(data.message);
      
      setUser(data);
      localStorage.setItem('zillgo_user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, role = 'traveler') => {
    try {
      const data = await api.register({ name, email, password, role });
      if (data.message && data.message !== 'Success') throw new Error(data.message);

      setUser(data);
      localStorage.setItem('zillgo_user', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * loginWithToken — called by OAuthCallback after a successful social login.
   * Receives the user object (with token) directly from the URL params.
   */
  const loginWithToken = (userData) => {
    setUser(userData);
    localStorage.setItem('zillgo_user', JSON.stringify(userData));
  };

  const updateUserStatus = useCallback(async (userId, updates) => {
    try {
      if (updates.verified !== undefined) {
        await api.verifyUser(userId);
      } else if (updates.suspended !== undefined) {
        await api.suspendUser(userId, updates.suspended);
      }
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  }, []);

  const getAllUsers = useCallback(async () => {
     try {
       return await api.getAdminUsers();
     } catch (error) {
       console.error('Error fetching users:', error);
       return [];
     }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithToken, updateUserStatus, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
