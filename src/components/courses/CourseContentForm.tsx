
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";
import { useToast } from "@/hooks/use-toast";
import { CourseContent, addOrUpdateCourseContent } from "./courseContentApi";

interface Props {
  courseId: string;
  content?: CourseContent | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CourseContentForm: React.FC<Props> = ({ courseId, content, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: content?.title || "",
    description: content?.description || "",
    content_type: content?.content_type || "text",
    content_url: content?.content_url || "",
    content_text: content?.content_text || "",
    duration: content?.duration || 0,
    is_preview: content?.is_preview || false,
  });

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

  return (
    <div className="p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{content ? "Edit Content" : "Add New Content"}</CardTitle>
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

export default CourseContentForm;
