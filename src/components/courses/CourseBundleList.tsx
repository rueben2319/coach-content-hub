
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package, DollarSign } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseBundle {
  id: string;
  title: string;
  description: string;
  price: number;
  subscription_price?: number;
  pricing_model: 'one_time' | 'subscription';
  currency: string;
  is_published: boolean;
  thumbnail_url?: string;
  coach_id: string;
  created_at: string;
  updated_at: string;
}

interface CourseBundleListProps {
  bundles: CourseBundle[];
  onEditBundle: (bundleId: string) => void;
  onRefresh: () => void;
}

const CourseBundleList: React.FC<CourseBundleListProps> = ({
  bundles,
  onEditBundle,
  onRefresh
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteBundleMutation = useMutation({
    mutationFn: async (bundleId: string) => {
      // First delete bundle items
      const { error: itemsError } = await supabase
        .from('course_bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      if (itemsError) throw itemsError;

      // Then delete the bundle
      const { error: bundleError } = await supabase
        .from('course_bundles')
        .delete()
        .eq('id', bundleId);

      if (bundleError) throw bundleError;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Bundle deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['course-bundles'] });
      onRefresh();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete bundle',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteBundle = (bundleId: string, bundleTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${bundleTitle}"? This action cannot be undone.`)) {
      deleteBundleMutation.mutate(bundleId);
    }
  };

  const formatPrice = (bundle: CourseBundle) => {
    const { price, subscription_price, pricing_model, currency } = bundle;
    
    switch (pricing_model) {
      case 'one_time':
        return `${currency} ${price}`;
      case 'subscription':
        return `${currency} ${subscription_price}/month`;
      default:
        return `${currency} ${price}`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bundles.map((bundle) => (
        <Card key={bundle.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <Package className="h-6 w-6 text-blue-600" />
              <Badge variant={bundle.is_published ? "default" : "secondary"}>
                {bundle.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardTitle className="text-lg line-clamp-2">{bundle.title}</CardTitle>
            {bundle.description && (
              <CardDescription className="line-clamp-3">
                {bundle.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-600 font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatPrice(bundle)}
              </div>
              <Badge variant="outline" className="text-xs">
                {bundle.pricing_model.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditBundle(bundle.id)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteBundle(bundle.id, bundle.title)}
                disabled={deleteBundleMutation.isPending}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseBundleList;
