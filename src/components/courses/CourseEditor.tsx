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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  // Removed subscription_price and currency as they don't exist in database
  is_published: boolean;
  category_id: string; // Changed from category to category_id
  tags: string[] | null;
  difficulty_level: string;
  image?: string; // Added image field for banner
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
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      setCategories(data || []);
      return data || [];
    },
  });

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
        .from('modules')
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
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags?.includes(trimmedTag)) {
      // Prevent duplicate tags (case-insensitive)
      const existingTags = formData.tags || [];
      const tagExists = existingTags.some(tag => tag.toLowerCase() === trimmedTag.toLowerCase());
      
      if (!tagExists) {
        handleInputChange('tags', [...existingTags, trimmedTag]);
      setTagInput('');
        toast({ 
          title: "Tag added", 
          description: `"${trimmedTag}" has been added to your course.`,
          duration: 2000
        });
      } else {
        toast({ 
          title: "Tag already exists", 
          description: `"${trimmedTag}" is already in your course tags.`,
          variant: "destructive",
          duration: 3000
        });
      }
    } else if (trimmedTag && formData.tags?.includes(trimmedTag)) {
      toast({ 
        title: "Tag already exists", 
        description: `"${trimmedTag}" is already in your course tags.`,
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = formData.tags?.filter(tag => tag !== tagToRemove) || [];
    handleInputChange('tags', updatedTags);
    toast({ 
      title: "Tag removed", 
      description: `"${tagToRemove}" has been removed from your course.`,
      duration: 2000
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData = {
        ...formData,
      };
      updateCourseMutation.mutate(updateData);
    } catch (error: any) {
      console.error('Error updating course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canPublish = formData.title && formData.short_description && formData.description && courseContent?.length;

  const handlePublishToggle = async (published: boolean) => {
    if (published && !canPublish) {
      toast({
        title: "Cannot publish course",
        description: "Please complete all required fields and add content before publishing.",
        variant: "destructive",
        duration: 4000
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('courses')
        .update({ is_published: published })
        .eq('id', courseId);

      if (error) throw error;

      // Update local state
      setFormData(prev => ({ ...prev, is_published: published }));
      
      // Update course data
      queryClient.setQueryData(['course', courseId], (old: any) => ({
        ...old,
        is_published: published
      }));

      toast({
        title: published ? "Course published!" : "Course unpublished",
        description: published 
          ? "Your course is now live and visible to students." 
          : "Your course is now in draft mode and not visible to students.",
        duration: 3000
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['courses', user?.id] });
      
    } catch (error: any) {
      console.error('Error updating publication status:', error);
      toast({
        title: "Error updating publication status",
        description: error.message || "Failed to update course publication status.",
        variant: "destructive",
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                    <Badge 
                      variant={course.is_published ? "default" : "secondary"} 
                      className="text-xs sm:text-sm"
                    >
                      {course.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                    {course.is_published 
                      ? "Course is live and visible to students" 
                      : "Course is in draft mode and not visible to students"
                    }
                  </p>
                  {!canPublish && !course.is_published && (
                    <div className="flex items-center gap-2 mt-2 text-orange-600">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">
                        Complete all required fields and add content to publish
                      </span>
                    </div>
                  )}
                  {course.is_published && (
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm">
                        Course is currently live and accepting enrollments
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                  <Switch
                    checked={course.is_published}
                    onCheckedChange={handlePublishToggle}
                    disabled={!canPublish && !course.is_published}
                  />
                    <span className="text-xs text-muted-foreground">
                      {course.is_published ? "Live" : "Draft"}
                    </span>
                  </div>
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
                  <Select
                    value={formData.category_id || ''}
                    onValueChange={(value) => handleInputChange('category_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty_level" className="text-sm sm:text-base">Difficulty Level</Label>
                  <Select 
                    value={formData.difficulty_level || ''}
                    onValueChange={(value) => handleInputChange('difficulty_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all_levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm sm:text-base">Banner Image URL</Label>
                <Input
                    id="image"
                    value={formData.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="Enter banner image URL"
                  className="text-sm sm:text-base"
                />
                </div>
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
                    {formData.pricing_model === 'one_time' ? 'Price (MWK)' : 'Monthly Price (MWK)'}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm sm:text-base">Tags</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag (press Enter or click Add)"
                    className="text-sm sm:text-base flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    maxLength={30}
                  />
                  <Button 
                    type="button" 
                    onClick={addTag} 
                    variant="outline" 
                    size="sm" 
                    className="w-full sm:w-auto"
                    disabled={!tagInput.trim()}
                  >
                    Add Tag
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1 text-xs px-3 py-1 hover:bg-destructive/10 transition-colors"
                      >
                        <span className="max-w-[120px] truncate">{tag}</span>
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                          onClick={() => removeTag(tag)}
                          title={`Remove "${tag}"`}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.tags?.length || 0}/10 tags • Max 30 characters per tag
                </p>
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
