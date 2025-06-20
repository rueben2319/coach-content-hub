
import React from 'react';
import { Route } from 'react-router-dom';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';

export const AdminRoutes = () => (
  <Route path="/admin" element={
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </RoleProtectedRoute>
  } />
);
