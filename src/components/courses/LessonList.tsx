import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Module, deleteCourseContent, reorderCourseContent } from "./courseContentApi";

interface Props {
  courseId: string;
  modules: Module[];
  onEdit: (module: Module) => void;
  onAdd: () => void;
  invalidateContent: () => void;
}

const LessonList: React.FC<Props> = ({
  courseId,
  modules,
  onEdit,
  onAdd,
  invalidateContent
}) => {
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      try {
        await deleteCourseContent(lessonId);
        invalidateContent();
        toast({ title: "Lesson deleted successfully!" });
      } catch (err: any) {
        toast({
          title: "Error deleting lesson",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const moveLesson = async (lessonId: string, direction: "up" | "down") => {
    const currentIndex = modules.findIndex((m) => m.id === lessonId);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= modules.length) return;
    const currentLesson = modules[currentIndex];
    const targetLesson = modules[newIndex];
    try {
      await reorderCourseContent(currentLesson.id, targetLesson.sort_order);
      await reorderCourseContent(targetLesson.id, currentLesson.sort_order);
      invalidateContent();
      toast({ title: "Lesson reordered successfully!" });
    } catch (err: any) {
      toast({
        title: "Error reordering lesson",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (_e: React.DragEvent, lessonId: string) => {
    setDraggedItem(lessonId);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = async (_e: React.DragEvent, targetId: string) => {
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }
    const draggedIdx = modules.findIndex((m) => m.id === draggedItem);
    const targetIdx = modules.findIndex((m) => m.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedItem(null);
      return;
    }
    const draggedLesson = modules[draggedIdx];
    const targetLesson = modules[targetIdx];
    try {
      await reorderCourseContent(draggedLesson.id, targetLesson.sort_order);
      await reorderCourseContent(targetLesson.id, draggedLesson.sort_order);
      invalidateContent();
      toast({ title: "Lesson reordered successfully!" });
    } catch (err: any) {
      toast({
        title: "Error reordering lesson",
        description: err.message,
        variant: "destructive",
      });
    }
    setDraggedItem(null);
  };

  if (!modules || modules.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-semibold mb-2">No lessons yet</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">Start building your course by adding your first lesson.</p>
          <Button onClick={onAdd} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Lesson
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop to reorder lessons, or use the arrow buttons on mobile
        </p>
      </div>
      {modules.map((module, index) => (
        <Card
          key={module.id}
          className={`hover:shadow-md transition-all duration-200 ${
            draggedItem === module.id ? "opacity-50 transform rotate-2" : ""
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, module.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, module.id)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm sm:text-base break-words">{module.title}</h3>
                  <div className="flex gap-1 sm:gap-2">
                    <Badge variant={module.is_published ? "default" : "secondary"} className="text-xs">
                      {module.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                {module.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                    {module.description}
                  </p>
                )}
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                  <span>Lesson {index + 1}</span>
                  {module.unlock_after_days && <span>Unlocks after {module.unlock_after_days} days</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="flex sm:hidden gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveLesson(module.id, "up")}
                    disabled={index === 0}
                    className="p-1 h-6 w-6"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveLesson(module.id, "down")}
                    disabled={index === modules.length - 1}
                    className="p-1 h-6 w-6"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(module)}
                    className="p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLesson(module.id)}
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

export default LessonList;