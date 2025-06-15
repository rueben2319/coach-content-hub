
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardRoute } from './DashboardRoute';
import { AdminRoutes } from './AdminRoutes';
import { CoachRoutes } from './CoachRoutes';
import { ClientRoutes } from './ClientRoutes';

// Public pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Dashboard redirect route */}
        <Route path="/dashboard" element={<DashboardRoute />} />
        
        {/* Role-based routes */}
        {AdminRoutes()}
        {CoachRoutes()}
        {ClientRoutes()}
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};
