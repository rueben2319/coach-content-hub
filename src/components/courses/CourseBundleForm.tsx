
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import CourseBundleSelector from './CourseBundleSelector';

const bundleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  subscription_price: z.number().min(0, 'Subscription price must be positive').optional(),
  pricing_model: z.enum(['one_time', 'subscription', 'both']),
  currency: z.string().default('USD'),
  is_published: z.boolean().default(false),
});

type BundleFormData = z.infer<typeof bundleSchema>;

interface CourseBundleFormProps {
  bundleId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CourseBundleForm: React.FC<CourseBundleFormProps> = ({
  bundleId,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<BundleFormData>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      pricing_model: 'one_time',
      currency: 'USD',
      is_published: false,
      price: 0,
    }
  });

  const pricingModel = watch('pricing_model');

  // Fetch bundle data if editing
  const { data: bundleData } = useQuery({
    queryKey: ['course-bundle', bundleId],
    queryFn: async () => {
      if (!bundleId) return null;
      
      const { data, error } = await supabase
        .from('course_bundles')
        .select('*')
        .eq('id', bundleId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bundleId,
  });

  // Fetch bundle courses if editing
  const { data: bundleCourses } = useQuery({
    queryKey: ['bundle-courses', bundleId],
    queryFn: async () => {
      if (!bundleId) return [];
      
      const { data, error } = await supabase
        .from('course_bundle_items')
        .select('course_id')
        .eq('bundle_id', bundleId);

      if (error) throw error;
      return data.map(item => item.course_id);
    },
    enabled: !!bundleId,
  });

  // Populate form with existing data
  useEffect(() => {
    if (bundleData) {
      reset({
        title: bundleData.title,
        description: bundleData.description || '',
        price: bundleData.price,
        subscription_price: bundleData.subscription_price || 0,
        pricing_model: bundleData.pricing_model,
        currency: bundleData.currency,
        is_published: bundleData.is_published,
      });
    }
  }, [bundleData, reset]);

  useEffect(() => {
    if (bundleCourses) {
      setSelectedCourses(bundleCourses);
    }
  }, [bundleCourses]);

  const createBundleMutation = useMutation({
    mutationFn: async (data: BundleFormData) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Create bundle
      const { data: bundle, error: bundleError } = await supabase
        .from('course_bundles')
        .insert({
          ...data,
          coach_id: user.id,
        })
        .select()
        .single();

      if (bundleError) throw bundleError;

      // Add courses to bundle
      if (selectedCourses.length > 0) {
        const bundleItems = selectedCourses.map(courseId => ({
          bundle_id: bundle.id,
          course_id: courseId,
        }));

        const { error: itemsError } = await supabase
          .from('course_bundle_items')
          .insert(bundleItems);

        if (itemsError) throw itemsError;
      }

      return bundle;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Course bundle created successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['course-bundles'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create bundle',
        variant: 'destructive',
      });
    },
  });

  const updateBundleMutation = useMutation({
    mutationFn: async (data: BundleFormData) => {
      if (!bundleId) throw new Error('Bundle ID required');

      // Update bundle
      const { error: bundleError } = await supabase
        .from('course_bundles')
        .update(data)
        .eq('id', bundleId);

      if (bundleError) throw bundleError;

      // Update bundle items
      // First, delete existing items
      const { error: deleteError } = await supabase
        .from('course_bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      if (deleteError) throw deleteError;

      // Add new items
      if (selectedCourses.length > 0) {
        const bundleItems = selectedCourses.map(courseId => ({
          bundle_id: bundleId,
          course_id: courseId,
        }));

        const { error: itemsError } = await supabase
          .from('course_bundle_items')
          .insert(bundleItems);

        if (itemsError) throw itemsError;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Course bundle updated successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['course-bundles'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update bundle',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: BundleFormData) => {
    if (selectedCourses.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one course for the bundle',
        variant: 'destructive',
      });
      return;
    }

    if (bundleId) {
      updateBundleMutation.mutate(data);
    } else {
      createBundleMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {bundleId ? 'Edit Bundle' : 'Create New Bundle'}
          </h2>
          <p className="text-gray-600">
            {bundleId ? 'Update your course bundle' : 'Create a new course bundle'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for your bundle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Bundle Title *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter bundle title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your bundle..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  onCheckedChange={(checked) => setValue('is_published', checked)}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the pricing for your bundle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pricing_model">Pricing Model</Label>
                <Select onValueChange={(value) => setValue('pricing_model', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-time Purchase</SelectItem>
                    <SelectItem value="subscription">Subscription Only</SelectItem>
                    <SelectItem value="both">Both Options</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(pricingModel === 'one_time' || pricingModel === 'both') && (
                <div>
                  <Label htmlFor="price">One-time Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                  )}
                </div>
              )}

              {(pricingModel === 'subscription' || pricingModel === 'both') && (
                <div>
                  <Label htmlFor="subscription_price">Monthly Subscription Price *</Label>
                  <Input
                    id="subscription_price"
                    type="number"
                    step="0.01"
                    {...register('subscription_price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.subscription_price && (
                    <p className="text-sm text-red-600 mt-1">{errors.subscription_price.message}</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="MWK">MWK</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Selection */}
        <CourseBundleSelector
          selectedCourses={selectedCourses}
          onCoursesChange={setSelectedCourses}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createBundleMutation.isPending || updateBundleMutation.isPending}
          >
            {bundleId ? 'Update Bundle' : 'Create Bundle'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseBundleForm;
