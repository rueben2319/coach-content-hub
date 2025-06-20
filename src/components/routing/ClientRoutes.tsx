
import React from 'react';
import { Route } from 'react-router-dom';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientDashboard from '@/pages/client/ClientDashboard';

export const ClientRoutes = () => (
  <Route path="/client" element={
    <RoleProtectedRoute allowedRoles={['client']}>
      <DashboardLayout>
        <ClientDashboard />
      </DashboardLayout>
    </RoleProtectedRoute>
  } />
);
