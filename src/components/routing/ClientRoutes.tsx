
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientDashboard from '@/pages/client/ClientDashboard';
import BrowseContent from '@/pages/client/BrowseContent';
import ClientProfile from '@/pages/client/ClientProfile';
import ClientSubscriptionPage from '@/pages/client/SubscriptionPage';

export const ClientRoutes = () => (
  <Route path="/client/*" element={
    <RoleProtectedRoute allowedRoles={['client']}>
      <DashboardLayout>
        <Routes>
          <Route index element={<ClientDashboard />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="subscription" element={<ClientSubscriptionPage />} />
          <Route path="browse" element={<BrowseContent />} />
        </Routes>
      </DashboardLayout>
    </RoleProtectedRoute>
  } />
);
