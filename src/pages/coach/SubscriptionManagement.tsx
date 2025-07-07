
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SubscriptionPage from './SubscriptionPage';

const SubscriptionManagement = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/coach');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Subscription Management</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Manage your subscription, billing, and plan details
          </p>
        </div>
        <Button onClick={handleBackToDashboard} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <SubscriptionPage />
    </div>
  );
};

export default SubscriptionManagement;
