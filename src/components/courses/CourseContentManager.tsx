
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, GripVertical, FileUp } from 'lucide-react';
import FileUpload from './FileUpload';

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

interface CourseContentManagerProps {
  courseId: string;
  onBack: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId, onBack }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<CourseContent | null>(null);

  const { data: courseContent, isLoading } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('sort_order');

      if (error) throw error;
      return data as CourseContent[];
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', contentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-content', courseId] });
      toast({ title: "Content deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteContentMutation.mutate(contentId);
    }
  };

  const handleEditContent = (content: CourseContent) => {
    setEditingContent(content);
    setShowContentForm(true);
  };

  const handleContentFormClose = () => {
    setShowContentForm(false);
    setEditingContent(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading course content...</div>;
  }

  if (showContentForm) {
    return (
      <CourseContentForm
        courseId={courseId}
        content={editingContent}
        onSuccess={() => {
          handleContentFormClose();
          queryClient.invalidateQueries({ queryKey: ['course-content', courseId] });
        }}
        onCancel={handleContentFormClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Course Content</h2>
          <p className="text-gray-600">Manage your course lessons and materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back to Course
          </Button>
          <Button onClick={() => setShowContentForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {!courseContent || courseContent.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No content yet</h3>
            <p className="text-gray-500 mb-4">Start building your course by adding your first lesson or material.</p>
            <Button onClick={() => setShowContentForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Content
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courseContent.map((content, index) => (
            <Card key={content.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{content.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {content.content_type}
                        </Badge>
                        {content.is_preview && (
                          <Badge variant="secondary" className="text-xs">
                            Preview
                          </Badge>
                        )}
                      </div>
                      {content.description && (
                        <p className="text-sm text-gray-600 mb-2">{content.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Lesson {index + 1}</span>
                        {content.duration && <span>{content.duration} min</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditContent(content)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContent(content.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseContentForm: React.FC<{
  courseId: string;
  content?: CourseContent | null;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ courseId, content, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    content_type: content?.content_type || 'text',
    content_url: content?.content_url || '',
    content_text: content?.content_text || '',
    duration: content?.duration || 0,
    is_preview: content?.is_preview || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contentData = {
        ...formData,
        course_id: courseId,
        sort_order: content?.sort_order || 0,
      };

      if (content) {
        const { error } = await supabase
          .from('course_content')
          .update(contentData)
          .eq('id', content.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('course_content')
          .insert([contentData]);
        if (error) throw error;
      }

      toast({
        title: content ? "Content updated successfully!" : "Content created successfully!",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error saving content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{content ? 'Edit Content' : 'Add New Content'}</CardTitle>
        <CardDescription>
          Create engaging course materials for your students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content_type">Content Type</Label>
            <Select
              value={formData.content_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.content_type === 'text' ? (
            <div>
              <Label htmlFor="content_text">Content</Label>
              <Textarea
                id="content_text"
                value={formData.content_text}
                onChange={(e) => setFormData(prev => ({ ...prev, content_text: e.target.value }))}
                rows={8}
                placeholder="Enter your lesson content here..."
              />
            </div>
          ) : (
            <div>
              <Label>Upload File</Label>
              <FileUpload
                onUpload={(url) => setFormData(prev => ({ ...prev, content_url: url }))}
                currentUrl={formData.content_url}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="0"
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="is_preview"
                checked={formData.is_preview}
                onChange={(e) => setFormData(prev => ({ ...prev, is_preview: e.target.checked }))}
              />
              <Label htmlFor="is_preview">Free Preview</Label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : content ? 'Update Content' : 'Add Content'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseContentManager;
