
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoutes } from './AdminRoutes';
import { CoachRoutes } from './CoachRoutes';
import { ClientRoutes } from './ClientRoutes';

// Page imports
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentFailed from '@/pages/PaymentFailed';

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Payment result pages */}
      <Route path="/payment-success" element={
        <ProtectedRoute>
          <PaymentSuccess />
        </ProtectedRoute>
      } />
      <Route path="/payment-failed" element={
        <ProtectedRoute>
          <PaymentFailed />
        </ProtectedRoute>
      } />

      {/* Role-based routes */}
      {AdminRoutes()}
      {CoachRoutes()}
      {ClientRoutes()}

      {/* Fallback routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
