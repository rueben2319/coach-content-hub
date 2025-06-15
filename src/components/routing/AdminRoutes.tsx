
import React from 'react';
import { Route } from 'react-router-dom';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import ResponsiveDashboardLayout from '@/components/layout/ResponsiveDashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';

export const AdminRoutes = () => (
  <Route path="/admin" element={
    <RoleProtectedRoute allowedRoles={['admin']}>
      <ResponsiveDashboardLayout>
        <AdminDashboard />
      </ResponsiveDashboardLayout>
    </RoleProtectedRoute>
  } />
);
