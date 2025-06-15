
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Edit, Trash2, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CourseBundleForm from './CourseBundleForm';
import CourseBundleList from './CourseBundleList';

type ViewType = 'list' | 'create' | 'edit';

interface CourseBundle {
  id: string;
  title: string;
  description: string;
  price: number;
  subscription_price?: number;
  pricing_model: 'one_time' | 'subscription' | 'both';
  currency: string;
  is_published: boolean;
  thumbnail_url?: string;
  coach_id: string;
  created_at: string;
  updated_at: string;
}

const CourseBundleManager: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedBundleId, setSelectedBundleId] = useState<string>('');

  const { data: bundles, isLoading, refetch } = useQuery({
    queryKey: ['course-bundles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('course_bundles')
        .select('*')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CourseBundle[];
    },
    enabled: !!user?.id,
  });

  const handleCreateNew = () => {
    setSelectedBundleId('');
    setCurrentView('create');
  };

  const handleEditBundle = (bundleId: string) => {
    setSelectedBundleId(bundleId);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedBundleId('');
    refetch();
  };

  if (currentView === 'create') {
    return (
      <CourseBundleForm
        onSuccess={handleBackToList}
        onCancel={handleBackToList}
      />
    );
  }

  if (currentView === 'edit' && selectedBundleId) {
    return (
      <CourseBundleForm
        bundleId={selectedBundleId}
        onSuccess={handleBackToList}
        onCancel={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Course Bundles</h2>
          <p className="text-gray-600">Create and manage course bundles to offer multiple courses at discounted prices</p>
        </div>
        <Button onClick={handleCreateNew} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Bundle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : bundles && bundles.length > 0 ? (
        <CourseBundleList
          bundles={bundles}
          onEditBundle={handleEditBundle}
          onRefresh={refetch}
        />
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="mb-2">No Bundles Created Yet</CardTitle>
            <CardDescription className="mb-4">
              Create your first course bundle to offer multiple courses together at a discounted price.
            </CardDescription>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Bundle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseBundleManager;
