import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CourseFormData {
  title: string;
  description: string;
  short_description: string;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  // Removed subscription_price and currency as they don't exist in database
  category_id: string; // Changed from category to category_id
  tags: string[];
  difficulty_level: string;
  image?: string; // Added image field for banner
}

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    short_description: '',
    pricing_model: 'one_time',
    price: 0,
    category_id: '',
    difficulty_level: 'beginner',
    tags: [],
    image: '',
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // setIsLoading(true); // This state was removed, so this line is removed.
    try {
      const courseData = {
        ...formData,
        coach_id: user.id,
        // Removed subscription_price and currency as they don't exist in database
      };

      const { error } = await supabase
        .from('courses')
        .insert([courseData]);

      if (error) throw error;

      toast({
        title: "Course created successfully!",
        description: "Your course has been created and saved as a draft.",
      });

      onSubmit(courseData); // Changed from onSuccess to onSubmit
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        title: "Error creating course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      // setIsLoading(false); // This state was removed, so this line is removed.
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>
          Fill in the details to create your new course. You can add content and publish it later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              placeholder="Brief description for course listings"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed course description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (MWK)</Label>
              <Input
                id="price"
                type="number"
                step="1"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
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
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value) => handleInputChange('difficulty_level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="image">Banner Image URL</Label>
            <Input
                id="image"
                value={formData.image || ''}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="Enter banner image URL"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricing_model">Pricing Model</Label>
            <Select value={formData.pricing_model} onValueChange={(value: 'one_time' | 'subscription') => handleInputChange('pricing_model', value)}>
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
                {formData.pricing_model === 'one_time' ? 'Price (MWK)' : 'One-time Price (MWK)'}
              </Label>
              <Input
                id="price"
                type="number"
                step="1"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="0"
                min="0"
                required
              />
            </div>
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
            {formData.tags.length > 0 && (
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
            <Button type="submit" disabled={isLoading}>
              {/* {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
              Create Course
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
