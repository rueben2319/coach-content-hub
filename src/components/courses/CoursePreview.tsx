
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Play, FileText, Download, Eye } from 'lucide-react';

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
  created_at: string;
}

interface CourseContent {
  id: string;
  title: string;
  description: string | null;
  content_type: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
  content_url: string | null;
  content_text: string | null;
  duration: number | null;
  sort_order: number;
  is_preview: boolean;
}

interface CoursePreviewProps {
  courseId: string;
  onBack: () => void;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ courseId, onBack }) => {
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

  const { data: courseContent, isLoading: contentLoading } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('sort_order');

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        content_type: 'text' as const, // Default for modules
        is_preview: false,
        duration: null,
        content_url: null,
        content_text: null,
      })) as CourseContent[];
    },
  });

  if (courseLoading || contentLoading) {
    return <div className="flex justify-center p-8">Loading course preview...</div>;
  }

  if (!course) {
    return <div className="text-center p-8">Course not found</div>;
  }

  const totalDuration = courseContent?.reduce((sum, content) => sum + (content.duration || 0), 0) || 0;
  const previewContent = courseContent?.filter(content => content.is_preview) || [];

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'audio':
        return <Play className="h-4 w-4" />;
      case 'pdf':
        return <Download className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Badge variant={course.is_published ? "default" : "secondary"}>
          {course.is_published ? "Published" : "Draft"}
        </Badge>
      </div>

      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <p className="text-lg text-gray-600">{course.short_description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline" className="capitalize">{course.difficulty_level}</Badge>
                <span>{totalDuration} minutes total</span>
                <span>{courseContent?.length || 0} lessons</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {course.pricing_model === 'one_time' 
                  ? `$${course.price}`
                  : `$${course.price} / $${course.subscription_price}/mo`
                }
              </div>
              <div className="text-sm text-gray-500">{course.currency}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{course.description}</p>
            </div>
            
            {course.tags && course.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          {!courseContent || courseContent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No content added yet</p>
          ) : (
            <div className="space-y-3">
              {courseContent.map((content, index) => (
                <div
                  key={content.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    content.is_preview ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getContentIcon(content.content_type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{content.title}</span>
                        {content.is_preview && (
                          <Badge variant="secondary" className="text-xs">Free Preview</Badge>
                        )}
                      </div>
                      {content.description && (
                        <p className="text-sm text-gray-600">{content.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {content.duration && `${content.duration} min`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Content */}
      {previewContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Free Preview Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{content.title}</h4>
                  {content.content_type === 'text' && content.content_text && (
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{content.content_text}</p>
                    </div>
                  )}
                  {content.content_url && content.content_type !== 'text' && (
                    <div className="text-sm text-blue-600">
                      <a href={content.content_url} target="_blank" rel="noopener noreferrer">
                        View {content.content_type} content →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursePreview;
