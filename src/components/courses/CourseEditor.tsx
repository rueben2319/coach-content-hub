
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Save, Eye } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  subscription_price: number | null;
  currency: string;
  is_published: boolean;
  category: string;
  tags: string[] | null;
  estimated_duration: number;
  difficulty_level: string;
}

interface CourseEditorProps {
  courseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onPreview?: () => void;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ courseId, onSuccess, onCancel, onPreview }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data as Course;
    },
  });

  const [formData, setFormData] = useState<Partial<Course>>({});

  React.useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const updateCourseMutation = useMutation({
    mutationFn: async (data: Partial<Course>) => {
      const { error } = await supabase
        .from('courses')
        .update(data)
        .eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses', user?.id] });
      toast({ title: "Course updated successfully!" });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error updating course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishCourseMutation = useMutation({
    mutationFn: async (published: boolean) => {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: published })
        .eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: (_, published) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses', user?.id] });
      toast({ 
        title: published ? "Course published successfully!" : "Course unpublished successfully!" 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating course status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof Course, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      handleInputChange('tags', [...(formData.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData = {
        ...formData,
        subscription_price: formData.pricing_model === 'subscription' ? formData.subscription_price : null,
      };
      updateCourseMutation.mutate(updateData);
    } catch (error: any) {
      console.error('Error updating course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = (published: boolean) => {
    publishCourseMutation.mutate(published);
  };

  if (courseLoading) {
    return <div className="flex justify-center p-8">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center p-8">Course not found</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Edit Course</CardTitle>
            <CardDescription>
              Update your course details and manage its publication status
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={course.is_published ? "default" : "secondary"}>
              {course.is_published ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Publishing Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Publication Status</h3>
                  <p className="text-sm text-gray-600">
                    {course.is_published 
                      ? "Course is live and visible to students" 
                      : "Course is in draft mode"
                    }
                  </p>
                </div>
                <Switch
                  checked={course.is_published}
                  onCheckedChange={handlePublishToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              value={formData.short_description || ''}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              placeholder="Brief description for course listings"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed course description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Fitness, Business, Art"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select 
                value={formData.difficulty_level || 'beginner'} 
                onValueChange={(value) => handleInputChange('difficulty_level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_duration">Estimated Duration (minutes)</Label>
            <Input
              id="estimated_duration"
              type="number"
              value={formData.estimated_duration || 0}
              onChange={(e) => handleInputChange('estimated_duration', parseInt(e.target.value))}
              placeholder="Course duration in minutes"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricing_model">Pricing Model</Label>
            <Select 
              value={formData.pricing_model || 'one_time'} 
              onValueChange={(value: 'one_time' | 'subscription') => handleInputChange('pricing_model', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-time Payment</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                {formData.pricing_model === 'one_time' ? 'Price' : 'One-time Price'}
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || 0}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="0.00"
                min="0"
                required
              />
            </div>

            {formData.pricing_model === 'subscription' && (
              <div className="space-y-2">
                <Label htmlFor="subscription_price">Monthly Subscription Price</Label>
                <Input
                  id="subscription_price"
                  type="number"
                  step="0.01"
                  value={formData.subscription_price || 0}
                  onChange={(e) => handleInputChange('subscription_price', parseFloat(e.target.value))}
                  placeholder="0.00"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {onPreview && (
              <Button type="button" variant="outline" onClick={onPreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseEditor;
