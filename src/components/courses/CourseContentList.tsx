
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CourseContent, deleteCourseContent, reorderCourseContent } from "./courseContentApi";

interface Props {
  courseId: string;
  courseContent: CourseContent[];
  onEdit: (content: CourseContent) => void;
  onAdd: () => void;
  invalidateContent: () => void;
}

const CourseContentList: React.FC<Props> = ({
  courseId,
  courseContent,
  onEdit,
  onAdd,
  invalidateContent
}) => {
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDeleteContent = async (contentId: string) => {
    if (confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteCourseContent(contentId);
        invalidateContent();
        toast({ title: "Content deleted successfully!" });
      } catch (err: any) {
        toast({
          title: "Error deleting content",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const moveContent = async (contentId: string, direction: "up" | "down") => {
    const currentIndex = courseContent.findIndex((c) => c.id === contentId);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= courseContent.length) return;
    const currentContent = courseContent[currentIndex];
    const targetContent = courseContent[newIndex];
    try {
      await reorderCourseContent(currentContent.id, targetContent.sort_order);
      await reorderCourseContent(targetContent.id, currentContent.sort_order);
      invalidateContent();
      toast({ title: "Content reordered successfully!" });
    } catch (err: any) {
      toast({
        title: "Error reordering content",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (_e: React.DragEvent, contentId: string) => {
    setDraggedItem(contentId);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = async (_e: React.DragEvent, targetId: string) => {
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }
    const draggedIdx = courseContent.findIndex((c) => c.id === draggedItem);
    const targetIdx = courseContent.findIndex((c) => c.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedItem(null);
      return;
    }
    const draggedContent = courseContent[draggedIdx];
    const targetContent = courseContent[targetIdx];
    try {
      await reorderCourseContent(draggedContent.id, targetContent.sort_order);
      await reorderCourseContent(targetContent.id, draggedContent.sort_order);
      invalidateContent();
      toast({ title: "Content reordered successfully!" });
    } catch (err: any) {
      toast({
        title: "Error reordering content",
        description: err.message,
        variant: "destructive",
      });
    }
    setDraggedItem(null);
  };

  if (!courseContent || courseContent.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-semibold mb-2">No content yet</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">Start building your course by adding your first lesson or material.</p>
          <Button onClick={onAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Content
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
            draggedItem === content.id ? "opacity-50 transform rotate-2" : ""
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, content.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, content.id)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2 mb-2">
                  <h3 className="font-semibold text-sm sm:text-base break-words leading-tight">{content.title}</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {content.content_type}
                    </Badge>
                    {content.is_preview && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        Preview
                      </Badge>
                    )}
                  </div>
                </div>
                {content.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                    {content.description}
                  </p>
                )}
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                  <span>Lesson {index + 1}</span>
                  {content.duration && <span>{content.duration} min</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1 items-center flex-shrink-0 course-content-actions">
                <div className="flex sm:hidden gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveContent(content.id, "up")}
                    disabled={index === 0}
                    className="p-1 h-6 w-6"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveContent(content.id, "down")}
                    disabled={index === courseContent.length - 1}
                    className="p-1 h-6 w-6"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(content)}
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
  );
};

export default CourseContentList;
