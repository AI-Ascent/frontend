'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminUser: {
    id: number;
    email: string;
    job_title: string;
    specialization: string;
    is_admin: boolean;
    name?: string;
  } | null;
  logoutAdmin: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  
  // Check if current user is admin
  const isAdminAuthenticated = user?.is_admin === true;

  const logoutAdmin = () => {
    logout();
  };

  const value: AdminAuthContextType = {
    isAdminAuthenticated,
    adminUser: user,
    logoutAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}