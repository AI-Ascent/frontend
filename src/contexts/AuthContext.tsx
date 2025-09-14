'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  email: string;
  job_title: string;
  specialization: string;
  name?: string; // For backward compatibility
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('aiAscentUser');
        const token = localStorage.getItem('access_token');
        
        if (savedUser && token) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          // Ensure token is set in API client
          apiClient.setToken(token);
        } else {
          // Clear invalid session
          localStorage.removeItem('aiAscentUser');
          localStorage.removeItem('access_token');
          apiClient.clearToken();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('aiAscentUser');
        localStorage.removeItem('access_token');
        apiClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login({ email, password });
      
      if (response.message === 'Authentication successful.' && response.access_token) {
        const userData: User = {
          id: response.user.id,
          email: response.user.email,
          job_title: response.user.job_title,
          specialization: response.user.specialization,
          name: response.user.email.split('@')[0], // For backward compatibility
        };
        
        setUser(userData);
        localStorage.setItem('aiAscentUser', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aiAscentUser');
    apiClient.clearToken(); // Clear JWT token
    setError(null);
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
