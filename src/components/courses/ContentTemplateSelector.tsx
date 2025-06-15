
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, Music, HelpCircle, BookOpen, Plus } from 'lucide-react';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  template_type: 'lesson' | 'quiz' | 'assignment' | 'video' | 'article';
  content_structure: any;
  is_public: boolean;
}

interface ContentTemplateSelectorProps {
  onSelectTemplate: (template: ContentTemplate) => void;
  onCreateNew: () => void;
}

const ContentTemplateSelector: React.FC<ContentTemplateSelectorProps> = ({
  onSelectTemplate,
  onCreateNew
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock templates data for now - will be replaced with actual API call once table is available
  const mockTemplates: ContentTemplate[] = [
    {
      id: '1',
      name: 'Basic Lesson Template',
      description: 'A simple text-based lesson template with rich formatting',
      template_type: 'lesson',
      content_structure: {
        title: 'New Lesson',
        content: '<h2>Lesson Title</h2><p>Start writing your lesson content here...</p>',
        description: 'Lesson description'
      },
      is_public: true
    },
    {
      id: '2',
      name: 'Video Lesson Template',
      description: 'Video-based lesson with description and notes',
      template_type: 'video',
      content_structure: {
        title: 'Video Lesson',
        description: 'Video lesson with supplementary materials'
      },
      is_public: true
    },
    {
      id: '3',
      name: 'Quiz Template',
      description: 'Interactive quiz template with multiple choice questions',
      template_type: 'quiz',
      content_structure: {
        title: 'Quiz: Topic Name',
        description: 'Test your knowledge on this topic'
      },
      is_public: true
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'quiz': return HelpCircle;
      case 'assignment': return FileText;
      case 'video': return Video;
      case 'article': return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'assignment': return 'bg-purple-100 text-purple-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'article': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = mockTemplates.filter(template => 
    selectedType === 'all' || template.template_type === selectedType
  );

  const templateTypes = [
    { value: 'all', label: 'All Templates' },
    { value: 'lesson', label: 'Lessons' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'video', label: 'Videos' },
    { value: 'article', label: 'Articles' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Choose a Template</h3>
          <p className="text-sm text-gray-600">Start with a pre-built template or create from scratch</p>
        </div>
        <Button onClick={onCreateNew} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create from Scratch
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {templateTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = getTypeIcon(template.template_type);
          return (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Icon className="h-6 w-6 text-gray-600" />
                  <Badge className={getTypeColor(template.template_type)}>
                    {template.template_type}
                  </Badge>
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {template.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {template.is_public && (
                    <Badge variant="secondary" className="text-xs">
                      Public
                    </Badge>
                  )}
                  <Button 
                    size="sm" 
                    onClick={() => onSelectTemplate(template)}
                    className="ml-auto"
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-4">
            {selectedType === 'all' 
              ? 'No templates available yet.' 
              : `No ${selectedType} templates available.`
            }
          </p>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentTemplateSelector;
