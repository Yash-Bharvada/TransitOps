'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/components/auth-context';

type DashboardData = any;

interface DashboardContextType {
  dashboardData: DashboardData | null;
  loading: boolean;
  refreshDashboard: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, loading: authLoading } = useAuth();

  const refreshDashboard = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get('/reports/dashboard');
      setDashboardData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data for context', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (token) {
        refreshDashboard();
      } else {
        setLoading(false);
      }
    }
  }, [token, authLoading]);

  return (
    <DashboardContext.Provider value={{ dashboardData, loading, refreshDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
