
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { useCourseChapters, useCreateChapter, useUpdateChapter } from '@/hooks/useCourseChapters';
import { useToast } from '@/hooks/use-toast';

interface ChapterManagerProps {
  courseId: string;
  onContentSelect?: (chapterId: string) => void;
}

const ChapterManager: React.FC<ChapterManagerProps> = ({ courseId, onContentSelect }) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_published: false,
  });

  const { data: chapters, isLoading } = useCourseChapters(courseId);
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingChapter) {
      updateChapter.mutate({
        id: editingChapter.id,
        ...formData,
      });
    } else {
      const nextSortOrder = chapters ? Math.max(...chapters.map(c => c.sort_order), -1) + 1 : 0;
      
      createChapter.mutate({
        course_id: courseId,
        title: formData.title,
        description: formData.description,
        is_published: formData.is_published,
        sort_order: nextSortOrder,
      });
    }

    setFormData({ title: '', description: '', is_published: false });
    setEditingChapter(null);
    setShowForm(false);
  };

  const handleEdit = (chapter: any) => {
    setFormData({
      title: chapter.title,
      description: chapter.description || '',
      is_published: chapter.is_published,
    });
    setEditingChapter(chapter);
    setShowForm(true);
  };

  const toggleChapterExpansion = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading chapters...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Chapters</CardTitle>
        <CardDescription>
          Organize your course content into logical sections and chapters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Chapter
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="chapter-title">Chapter Title</Label>
                  <Input
                    id="chapter-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter chapter title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="chapter-description">Description (Optional)</Label>
                  <Textarea
                    id="chapter-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this chapter covers..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="chapter-published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                  <Label htmlFor="chapter-published">Published</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createChapter.isPending || updateChapter.isPending}>
                    {editingChapter ? 'Update Chapter' : 'Create Chapter'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingChapter(null);
                      setFormData({ title: '', description: '', is_published: false });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {chapters && chapters.length > 0 ? (
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <Card key={chapter.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleChapterExpansion(chapter.id)}
                        className="p-0 h-auto"
                      >
                        {expandedChapters.has(chapter.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{chapter.title}</span>
                          <Badge variant="outline" className="text-xs">
                            Chapter {index + 1}
                          </Badge>
                          {chapter.is_published ? (
                            <Badge variant="default" className="text-xs">Published</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Draft</Badge>
                          )}
                        </div>
                        {chapter.description && expandedChapters.has(chapter.id) && (
                          <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(chapter)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onContentSelect?.(chapter.id)}
                      >
                        Manage Content
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No chapters created yet. Add your first chapter to start organizing your course content.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterManager;
