import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Module, addOrUpdateModule } from "./courseContentApi";

interface Props {
  courseId: string;
  module?: Module | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ModuleForm: React.FC<Props> = ({ courseId, module, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: module?.title || "",
    description: module?.description || "",
    unlock_after_days: module?.unlock_after_days || null,
    is_published: module?.is_published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addOrUpdateModule(
        {
          ...formData,
          course_id: courseId,
        },
        module ?? undefined,
      );
      toast({
        title: module ? "Module updated successfully!" : "Module created successfully!",
        description: module 
          ? "Your module has been updated." 
          : "New module has been added to your course.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error saving module",
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
            {module ? "Edit Module" : "Create New Module"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {module 
              ? "Update your module details" 
              : "Create a new module for your course. Modules are the main sections that organize your content."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Module Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter module title..."
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
                placeholder="Brief description of this module..."
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (module ? 'Update Module' : 'Create Module')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleForm; 