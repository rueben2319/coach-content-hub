
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CourseContent, addOrUpdateCourseContent } from "./courseContentApi";
import RichTextEditor from "./RichTextEditor";
import EnhancedFileUpload from "./EnhancedFileUpload";
import ContentTemplateSelector from "./ContentTemplateSelector";

interface Props {
  courseId: string;
  content?: CourseContent | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EnhancedCourseContentForm: React.FC<Props> = ({ courseId, content, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!content);
  const [formData, setFormData] = useState({
    title: content?.title || "",
    description: content?.description || "",
    content_type: content?.content_type || "text",
    content_url: content?.content_url || "",
    content_text: content?.content_text || "",
    duration: content?.duration || 0,
    is_preview: content?.is_preview || false,
  });

  const handleSelectTemplate = (template: any) => {
    const structure = template.content_structure;
    setFormData(prev => ({
      ...prev,
      title: structure.title || "",
      description: structure.description || "",
      content_type: template.template_type === 'lesson' ? 'text' : 'video',
      content_text: structure.content || "",
    }));
    setShowTemplateSelector(false);
  };

  const handleCreateNew = () => {
    setShowTemplateSelector(false);
  };

  const handleFileUpload = (url: string, metadata?: any) => {
    setFormData(prev => ({
      ...prev,
      content_url: url,
      duration: metadata?.duration ? Math.round(metadata.duration / 60) : prev.duration,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addOrUpdateCourseContent(
        {
          ...formData,
          course_id: courseId,
        },
        content ?? undefined,
      );
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

  if (showTemplateSelector) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Content</CardTitle>
            <CardDescription>
              Choose a template to get started quickly, or create content from scratch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentTemplateSelector
              onSelectTemplate={handleSelectTemplate}
              onCreateNew={handleCreateNew}
            />
            <div className="mt-6">
              <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {content ? "Edit Content" : "Create New Content"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Create engaging course materials with our enhanced content builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="content_type">Content Type</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text/Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                placeholder="Brief description of this content..."
              />
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                {formData.content_type === 'text' ? (
                  <div>
                    <Label>Content</Label>
                    <RichTextEditor
                      value={formData.content_text}
                      onChange={(value) => setFormData(prev => ({ ...prev, content_text: value }))}
                      placeholder="Enter your lesson content here..."
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Upload File</Label>
                    <EnhancedFileUpload
                      onUpload={handleFileUpload}
                      currentUrl={formData.content_url}
                      contentType={formData.content_type}
                      maxSizeMB={formData.content_type === 'video' ? 500 : 100}
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
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
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? 'Saving...' : content ? 'Update Content' : 'Create Content'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCourseContentForm;
