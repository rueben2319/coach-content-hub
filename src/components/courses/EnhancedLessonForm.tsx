import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Module, addOrUpdateCourseContent } from "./courseContentApi";

interface Props {
  courseId: string;
  lesson?: Module | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const EnhancedLessonForm: React.FC<Props> = ({ courseId, lesson, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    description: lesson?.description || "",
    unlock_after_days: lesson?.unlock_after_days || null,
    is_published: lesson?.is_published || false,
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
        lesson ?? undefined,
      );
      toast({
        title: lesson ? "Lesson updated successfully!" : "Lesson created successfully!",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error saving lesson",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {lesson ? "Edit Lesson" : "Create New Lesson"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Create a new lesson module for your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Brief description of this lesson..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unlock_after_days">Unlock After (days)</Label>
                <Input
                  id="unlock_after_days"
                  type="number"
                  value={formData.unlock_after_days || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    unlock_after_days: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  min="0"
                  placeholder="0 for immediate access"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                />
                <Label htmlFor="is_published">Publish Immediately</Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? 'Saving...' : lesson ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedLessonForm;