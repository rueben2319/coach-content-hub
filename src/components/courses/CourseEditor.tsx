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
import { Loader2, X, Save, Eye, Globe, FileText, AlertTriangle } from 'lucide-react';

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
  const [showPublishDialog, setShowPublishDialog] = useState(false);

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

  // Check if course has content
  const { data: courseContent } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_content')
        .select('id')
        .eq('course_id', courseId);
      if (error) throw error;
      return data;
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
      // Validation before publishing
      if (published) {
        if (!formData.title || !formData.short_description || !formData.description) {
          throw new Error("Please fill in all required fields before publishing");
        }
        if (!courseContent || courseContent.length === 0) {
          throw new Error("Please add at least one lesson before publishing your course");
        }
      }

      const { error } = await supabase
        .from('courses')
        .update({ is_published: published })
        .eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: (_, published) => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses', user?.id] });
      setShowPublishDialog(false);
      toast({ 
        title: published ? "Course published successfully!" : "Course unpublished successfully!",
        description: published 
          ? "Your course is now live and visible to students" 
          : "Your course is now in draft mode"
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
    if (published && (!formData.title || !formData.short_description || !courseContent?.length)) {
      setShowPublishDialog(true);
      return;
    }
    publishCourseMutation.mutate(published);
  };

  const canPublish = formData.title && formData.short_description && formData.description && courseContent?.length;

  if (courseLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  if (!course) {
    return <div className="text-center p-8">Course not found</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl break-words">Edit Course</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Update your course details and manage its publication status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={course.is_published ? "default" : "secondary"} className="text-xs sm:text-sm">
                {course.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Publishing Controls */}
          <Card className="border-2 border-dashed">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                    <h3 className="font-semibold text-sm sm:text-base">Publication Status</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                    {course.is_published 
                      ? "Course is live and visible to students" 
                      : "Course is in draft mode"
                    }
                  </p>
                  {!canPublish && (
                    <div className="flex items-center gap-2 mt-2 text-orange-600">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Complete all fields and add content to publish</span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Switch
                    checked={course.is_published}
                    onCheckedChange={handlePublishToggle}
                    disabled={!canPublish && !course.is_published}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Course Details */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm sm:text-base">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description" className="text-sm sm:text-base">Short Description *</Label>
                <Input
                  id="short_description"
                  value={formData.short_description || ''}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Brief description for course listings"
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">Full Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed course description"
                  rows={4}
                  className="text-sm sm:text-base resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
                  <Input
                    id="category"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Fitness, Business, Art"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty_level" className="text-sm sm:text-base">Difficulty Level</Label>
                  <Select 
                    value={formData.difficulty_level || 'beginner'} 
                    onValueChange={(value) => handleInputChange('difficulty_level', value)}
                  >
                    <SelectTrigger className="text-sm sm:text-base">
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
                <Label htmlFor="estimated_duration" className="text-sm sm:text-base">Estimated Duration (minutes)</Label>
                <Input
                  id="estimated_duration"
                  type="number"
                  value={formData.estimated_duration || 0}
                  onChange={(e) => handleInputChange('estimated_duration', parseInt(e.target.value))}
                  placeholder="Course duration in minutes"
                  className="text-sm sm:text-base"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing_model" className="text-sm sm:text-base">Pricing Model</Label>
                <Select 
                  value={formData.pricing_model || 'one_time'} 
                  onValueChange={(value: 'one_time' | 'subscription') => handleInputChange('pricing_model', value)}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-time Payment</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm sm:text-base">
                    {formData.pricing_model === 'one_time' ? 'Price (MWK)' : 'One-time Price (MWK)'}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    value={formData.price || 0}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="0"
                    className="text-sm sm:text-base"
                    min="0"
                    required
                  />
                </div>

                {formData.pricing_model === 'subscription' && (
                  <div className="space-y-2">
                    <Label htmlFor="subscription_price" className="text-sm sm:text-base">Monthly Subscription Price (MWK)</Label>
                    <Input
                      id="subscription_price"
                      type="number"
                      step="1"
                      value={formData.subscription_price || 0}
                      onChange={(e) => handleInputChange('subscription_price', parseFloat(e.target.value))}
                      placeholder="0"
                      className="text-sm sm:text-base"
                      min="0"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm sm:text-base">Tags</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="text-sm sm:text-base flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="sm" className="w-full sm:w-auto">
                    Add
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs">
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
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                  Cancel
                </Button>
              )}
              {onPreview && (
                <Button type="button" variant="outline" onClick={onPreview} className="w-full sm:w-auto">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Publish Dialog */}
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Cannot Publish Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Please complete the following before publishing:
              </p>
              <ul className="space-y-2 text-sm">
                {!formData.title && <li className="flex items-center gap-2"><X className="h-4 w-4 text-red-500" />Course title</li>}
                {!formData.short_description && <li className="flex items-center gap-2"><X className="h-4 w-4 text-red-500" />Short description</li>}
                {!formData.description && <li className="flex items-center gap-2"><X className="h-4 w-4 text-red-500" />Full description</li>}
                {(!courseContent || courseContent.length === 0) && <li className="flex items-center gap-2"><X className="h-4 w-4 text-red-500" />At least one lesson</li>}
              </ul>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPublishDialog(false)} size="sm">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseEditor;
