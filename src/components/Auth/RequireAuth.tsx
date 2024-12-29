import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuthContext();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}