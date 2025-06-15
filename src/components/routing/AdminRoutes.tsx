
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import ResponsiveDashboardLayout from '@/components/layout/ResponsiveDashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';

export const AdminRoutes = () => (
  <Route path="/admin" element={
    <ProtectedRoute>
      <ResponsiveDashboardLayout>
        <AdminDashboard />
      </ResponsiveDashboardLayout>
    </ProtectedRoute>
  } />
);
