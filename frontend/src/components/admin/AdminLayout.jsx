// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const { role } = useAuth();
  if (role !== 'ADMIN') {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}

