// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import type { User } from '../types/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedData = authService.getCurrentUser();
    if (storedData) {
      setUser(storedData);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser({ ...userData.user, access_token: userData.token });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
