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
import { Plus, Edit, Trash2, GripVertical, FileUp, ArrowUp, ArrowDown } from 'lucide-react';
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
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

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

  const reorderContentMutation = useMutation({
    mutationFn: async ({ contentId, newOrder }: { contentId: string; newOrder: number }) => {
      const { error } = await supabase
        .from('course_content')
        .update({ sort_order: newOrder })
        .eq('id', contentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-content', courseId] });
      toast({ title: "Content reordered successfully!" });
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

  const moveContent = (contentId: string, direction: 'up' | 'down') => {
    if (!courseContent) return;
    
    const currentIndex = courseContent.findIndex(c => c.id === contentId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= courseContent.length) return;
    
    const currentContent = courseContent[currentIndex];
    const targetContent = courseContent[newIndex];
    
    // Swap sort orders
    reorderContentMutation.mutate({ contentId: currentContent.id, newOrder: targetContent.sort_order });
    reorderContentMutation.mutate({ contentId: targetContent.id, newOrder: currentContent.sort_order });
  };

  const handleDragStart = (e: React.DragEvent, contentId: string) => {
    setDraggedItem(contentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || !courseContent || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = courseContent.findIndex(c => c.id === draggedItem);
    const targetIndex = courseContent.findIndex(c => c.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const draggedContent = courseContent[draggedIndex];
    const targetContent = courseContent[targetIndex];
    
    // Swap sort orders
    reorderContentMutation.mutate({ contentId: draggedContent.id, newOrder: targetContent.sort_order });
    reorderContentMutation.mutate({ contentId: targetContent.id, newOrder: draggedContent.sort_order });
    
    setDraggedItem(null);
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold break-words">Course Content</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your course lessons and materials</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1">
            Back to Course
          </Button>
          <Button onClick={() => setShowContentForm(true)} className="w-full sm:w-auto order-1 sm:order-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {!courseContent || courseContent.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <h3 className="text-base sm:text-lg font-semibold mb-2">No content yet</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">Start building your course by adding your first lesson or material.</p>
            <Button onClick={() => setShowContentForm(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Content
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop to reorder content, or use the arrow buttons on mobile
            </p>
          </div>
          
          {courseContent.map((content, index) => (
            <Card 
              key={content.id} 
              className={`hover:shadow-md transition-all duration-200 ${
                draggedItem === content.id ? 'opacity-50 transform rotate-2' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, content.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, content.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  {/* Drag handle - hidden on mobile */}
                  <div className="hidden sm:flex items-center">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  </div>
                  
                  {/* Content info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm sm:text-base break-words">{content.title}</h3>
                      <div className="flex gap-1 sm:gap-2">
                        <Badge variant="outline" className="text-xs">
                          {content.content_type}
                        </Badge>
                        {content.is_preview && (
                          <Badge variant="secondary" className="text-xs">
                            Preview
                          </Badge>
                        )}
                      </div>
                    </div>
                    {content.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{content.description}</p>
                    )}
                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                      <span>Lesson {index + 1}</span>
                      {content.duration && <span>{content.duration} min</span>}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
                    {/* Mobile reorder buttons */}
                    <div className="flex sm:hidden gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveContent(content.id, 'up')}
                        disabled={index === 0}
                        className="p-1 h-6 w-6"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveContent(content.id, 'down')}
                        disabled={index === courseContent.length - 1}
                        className="p-1 h-6 w-6"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Edit and delete buttons */}
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContent(content)}
                        className="p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContent(content.id)}
                        className="p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
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
      let newSortOrder = 0;
      if (!content) {
        // Fetch the current highest sort_order for this course
        const { data: maxOrderData, error: maxOrderError } = await supabase
          .from('course_content')
          .select('sort_order')
          .eq('course_id', courseId)
          .order('sort_order', { ascending: false })
          .limit(1);

        if (maxOrderError) throw maxOrderError;
        if (Array.isArray(maxOrderData) && maxOrderData.length > 0) {
          newSortOrder = (maxOrderData[0].sort_order ?? 0) + 1;
        }
      }

      const contentData = {
        ...formData,
        course_id: courseId,
        sort_order: content
          ? content.sort_order
          : newSortOrder,
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
    <div className="p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{content ? 'Edit Content' : 'Add New Content'}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Create engaging course materials for your students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="text-sm sm:text-base resize-none"
              />
            </div>

            <div>
              <Label htmlFor="content_type" className="text-sm sm:text-base">Content Type</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as any }))}
              >
                <SelectTrigger className="text-sm sm:text-base">
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
                <Label htmlFor="content_text" className="text-sm sm:text-base">Content</Label>
                <Textarea
                  id="content_text"
                  value={formData.content_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_text: e.target.value }))}
                  rows={8}
                  placeholder="Enter your lesson content here..."
                  className="text-sm sm:text-base resize-none"
                />
              </div>
            ) : (
              <div>
                <Label className="text-sm sm:text-base">Upload File</Label>
                <FileUpload
                  onUpload={(url) => setFormData(prev => ({ ...prev, content_url: url }))}
                  currentUrl={formData.content_url}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-sm sm:text-base">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="0"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="is_preview"
                  checked={formData.is_preview}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_preview: e.target.checked }))}
                />
                <Label htmlFor="is_preview" className="text-sm sm:text-base">Free Preview</Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? 'Saving...' : content ? 'Update Content' : 'Add Content'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseContentManager;
