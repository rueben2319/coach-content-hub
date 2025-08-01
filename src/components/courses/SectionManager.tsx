import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical, Eye, Lock, Unlock } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Section {
  id: string;
  lesson_id: string;
  title: string;
  content_type: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
  content_url: string | null;
  content_text: string | null;
  duration: number | null;
  sort_order: number;
  is_preview: boolean;
  is_free: boolean;
  content: any;
  created_at: string;
  updated_at: string;
}

interface SectionManagerProps {
  lessonId: string;
  onBack: () => void;
}

const SectionManager: React.FC<SectionManagerProps> = ({ lessonId, onBack }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL state management
  const action = searchParams.get('action') || '';
  const sectionId = searchParams.get('sectionId') || '';

  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'text' as 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive',
    content_url: '',
    content_text: '',
    duration: null as number | null,
    is_preview: false,
    is_free: false,
  });

  // Fetch sections for this lesson
  const { data: sections = [], isLoading, refetch } = useQuery({
    queryKey: ['lesson-sections', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('sort_order');
      
      if (error) throw error;
      return data as Section[];
    },
  });

  // Sync URL with component state
  useEffect(() => {
    console.log('SectionManager URL sync:', { action, sectionId, lessonId });
    
    if (action === 'create-section') {
      setShowSectionForm(true);
      setEditingSection(null);
      setFormData({
        title: '',
        content_type: 'text',
        content_url: '',
        content_text: '',
        duration: null,
        is_preview: false,
        is_free: false,
      });
    } else if (action === 'edit-section' && sectionId) {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        setEditingSection(section);
        setShowSectionForm(true);
        setFormData({
          title: section.title,
          content_type: section.content_type,
          content_url: section.content_url || '',
          content_text: section.content_text || '',
          duration: section.duration,
          is_preview: section.is_preview,
          is_free: section.is_free,
        });
      }
    }
  }, [action, sectionId, sections, lessonId]);

  // URL navigation functions
  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
  };

  const navigateToAction = (newAction: string, newSectionId?: string) => {
    updateURL({
      action: newAction,
      sectionId: newSectionId || null
    });
  };

  // Create/Update section mutation
  const sectionMutation = useMutation({
    mutationFn: async (data: Partial<Section> & { lesson_id: string }) => {
      if (editingSection) {
        const { error } = await supabase
          .from('sections')
          .update(data)
          .eq('id', editingSection.id);
        if (error) throw error;
      } else {
        // Get highest sort order
        const { data: maxOrderData } = await supabase
          .from('sections')
          .select('sort_order')
          .eq('lesson_id', lessonId)
          .order('sort_order', { ascending: false })
          .limit(1);
        
        const newSortOrder = maxOrderData?.[0]?.sort_order ?? 0;
        
        const { error } = await supabase
          .from('sections')
          .insert([{ 
            ...data, 
            sort_order: newSortOrder + 1,
            content_type: data.content_type || 'text',
            lesson_id: data.lesson_id,
            title: data.title || ''
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-sections', lessonId] });
      handleFormClose();
      toast({
        title: editingSection ? 'Section updated!' : 'Section created!',
        description: editingSection 
          ? 'Your section has been updated successfully.' 
          : 'New section has been added to your lesson.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error saving section',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete section mutation
  const deleteMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-sections', lessonId] });
      toast({ title: 'Section deleted successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting section',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFormClose = () => {
    setShowSectionForm(false);
    setEditingSection(null);
    updateURL({ action: null, sectionId: null });
  };

  const handleBackToSections = () => {
    updateURL({ action: null, sectionId: null });
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      content_type: section.content_type,
      content_url: section.content_url || '',
      content_text: section.content_text || '',
      duration: section.duration,
      is_preview: section.is_preview,
      is_free: section.is_free,
    });
    setShowSectionForm(true);
    navigateToAction('edit-section', section.id);
  };

  const handleCreateSection = () => {
    setShowSectionForm(true);
    setEditingSection(null);
    setFormData({
      title: '',
      content_type: 'text',
      content_url: '',
      content_text: '',
      duration: null,
      is_preview: false,
      is_free: false,
    });
    navigateToAction('create-section');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sectionMutation.mutate({
      ...formData,
      lesson_id: lessonId,
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      deleteMutation.mutate(sectionId);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'text': return '📝';
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'interactive': return '🎮';
      default: return '📄';
    }
  };

  if (showSectionForm) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingSection ? 'Edit Section' : 'Create New Section'}
          </h2>
          <Button variant="outline" onClick={handleFormClose}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter section title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="content_type">Content Type</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    content_type: value as any 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
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
                    rows={6}
                    placeholder="Enter your content here..."
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="content_url">Content URL</Label>
                  <Input
                    id="content_url"
                    value={formData.content_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_url: e.target.value }))}
                    placeholder="Enter content URL..."
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      duration: e.target.value ? parseInt(e.target.value) : null 
                    }))}
                    min="0"
                    placeholder="Optional"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_preview"
                    checked={formData.is_preview}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_preview: checked }))}
                  />
                  <Label htmlFor="is_preview">Preview Content</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_free: checked }))}
                  />
                  <Label htmlFor="is_free">Free Content</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={sectionMutation.isPending}>
                  {sectionMutation.isPending ? 'Saving...' : (editingSection ? 'Update Section' : 'Create Section')}
                </Button>
                <Button type="button" variant="outline" onClick={handleFormClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Lesson Sections</h2>
          <p className="text-sm text-gray-600">Manage content sections within this lesson</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back to Lesson
          </Button>
          <Button onClick={handleCreateSection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading sections...</div>
          </CardContent>
        </Card>
      ) : sections.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">No sections created yet</p>
            <Button onClick={handleCreateSection}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <Card key={section.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{getContentTypeIcon(section.content_type)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{section.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="capitalize">{section.content_type}</span>
                        {section.duration && <span>• {section.duration} min</span>}
                        {section.is_preview && (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Badge>
                        )}
                        {section.is_free && (
                          <Badge variant="outline" className="text-xs">
                            <Unlock className="h-3 w-3 mr-1" />
                            Free
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
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

export default SectionManager; 