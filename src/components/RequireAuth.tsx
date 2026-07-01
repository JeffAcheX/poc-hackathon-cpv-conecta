import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { ReactNode } from 'react';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { medico } = useApp();
  if (!medico) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
