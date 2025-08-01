import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical, ArrowUp, ArrowDown, FileText, BookOpen, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Module, deleteCourseContent, reorderCourseContent, fetchModuleLessons } from "./courseContentApi";
import { useQuery } from "@tanstack/react-query";

interface Props {
  courseId: string;
  modules: Module[];
  onEdit: (module: Module) => void;
  onAdd: () => void;
  onModuleSelect?: (moduleId: string) => void;
  onLessonSelect?: (lessonId: string) => void;
  invalidateContent: () => void;
  showModuleView?: boolean;
}

const LessonList: React.FC<Props> = ({
  courseId,
  modules,
  onEdit,
  onAdd,
  onModuleSelect,
  onLessonSelect,
  invalidateContent,
  showModuleView = true
}) => {
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Fetch lessons for the selected module if we're in lesson view
  const selectedModule = modules.length === 1 ? modules[0] : null;
  const { data: lessons = [] } = useQuery({
    queryKey: ['module-lessons', selectedModule?.id],
    queryFn: () => selectedModule ? fetchModuleLessons(selectedModule.id) : Promise.resolve([]),
    enabled: !!selectedModule && !showModuleView,
  });

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Are you sure you want to delete this module? This will also delete all lessons within it.")) {
      try {
        await deleteCourseContent(moduleId);
        invalidateContent();
        toast({ title: "Module deleted successfully!" });
      } catch (err: any) {
        toast({
          title: "Error deleting module",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      try {
        // Import the deleteLesson function
        const { deleteLesson } = await import('./courseContentApi');
        await deleteLesson(lessonId);
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

  const moveModule = async (moduleId: string, direction: "up" | "down") => {
    const currentIndex = modules.findIndex((m) => m.id === moduleId);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= modules.length) return;
    const currentModule = modules[currentIndex];
    const targetModule = modules[newIndex];
    try {
      await reorderCourseContent(currentModule.id, targetModule.sort_order);
      await reorderCourseContent(targetModule.id, currentModule.sort_order);
      invalidateContent();
      toast({ title: "Module reordered successfully!" });
    } catch (err: any) {
      toast({
        title: "Error reordering module",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const moveLesson = async (lessonId: string, direction: "up" | "down") => {
    const currentIndex = lessons.findIndex((l: any) => l.id === lessonId);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= lessons.length) return;
    const currentLesson = lessons[currentIndex];
    const targetLesson = lessons[newIndex];
    try {
      const { reorderLesson } = await import('./courseContentApi');
      await reorderLesson(currentLesson.id, targetLesson.sort_order);
      await reorderLesson(targetLesson.id, currentLesson.sort_order);
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

  const handleDragStart = (_e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = async (_e: React.DragEvent, targetId: string) => {
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }
    
    if (showModuleView) {
      // Handle module reordering
      const draggedIdx = modules.findIndex((m) => m.id === draggedItem);
      const targetIdx = modules.findIndex((m) => m.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) {
        setDraggedItem(null);
        return;
      }
      const draggedModule = modules[draggedIdx];
      const targetModule = modules[targetIdx];
      try {
        await reorderCourseContent(draggedModule.id, targetModule.sort_order);
        await reorderCourseContent(targetModule.id, draggedModule.sort_order);
        invalidateContent();
        toast({ title: "Module reordered successfully!" });
      } catch (err: any) {
        toast({
          title: "Error reordering module",
          description: err.message,
          variant: "destructive",
        });
      }
    } else {
      // Handle lesson reordering
      const draggedIdx = lessons.findIndex((l: any) => l.id === draggedItem);
      const targetIdx = lessons.findIndex((l: any) => l.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) {
        setDraggedItem(null);
        return;
      }
      const draggedLesson = lessons[draggedIdx];
      const targetLesson = lessons[targetIdx];
      try {
        const { reorderLesson } = await import('./courseContentApi');
        await reorderLesson(draggedLesson.id, targetLesson.sort_order);
        await reorderLesson(targetLesson.id, draggedLesson.sort_order);
        invalidateContent();
        toast({ title: "Lesson reordered successfully!" });
      } catch (err: any) {
        toast({
          title: "Error reordering lesson",
          description: err.message,
          variant: "destructive",
        });
      }
    }
    setDraggedItem(null);
  };

  // Show modules view
  if (showModuleView) {
    if (!modules || modules.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <div className="flex flex-col items-center gap-4">
              <BookOpen className="h-12 w-12 text-gray-400" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No modules yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                Start building your course by creating your first module. Modules are the main sections of your course.
              </p>
              <Button onClick={onAdd} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create First Module
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop to reorder modules, or use the arrow buttons on mobile
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
                    <span>Module {index + 1}</span>
                    {module.unlock_after_days && <span>Unlocks after {module.unlock_after_days} days</span>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className="flex sm:hidden gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveModule(module.id, "up")}
                      disabled={index === 0}
                      className="p-1 h-6 w-6"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveModule(module.id, "down")}
                      disabled={index === modules.length - 1}
                      className="p-1 h-6 w-6"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    {onModuleSelect && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onModuleSelect(module.id)}
                        className="p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                        title="View Lessons"
                      >
                        <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}
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
                      onClick={() => handleDeleteModule(module.id)}
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
  }

  // Show lessons view
  if (!lessons || lessons.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 sm:py-12">
          <div className="flex flex-col items-center gap-4">
            <Layers className="h-12 w-12 text-gray-400" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No lessons yet</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Start building your module by adding your first lesson. Lessons are the individual learning units within this module.
            </p>
            <Button onClick={onAdd} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add First Lesson
            </Button>
          </div>
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
      {lessons.map((lesson: any, index: number) => (
        <Card
          key={lesson.id}
          className={`hover:shadow-md transition-all duration-200 ${
            draggedItem === lesson.id ? "opacity-50 transform rotate-2" : ""
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, lesson.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, lesson.id)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm sm:text-base break-words">{lesson.title}</h3>
                  <div className="flex gap-1 sm:gap-2">
                    <Badge variant={lesson.is_published ? "default" : "secondary"} className="text-xs">
                      {lesson.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                {lesson.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                    {lesson.description}
                  </p>
                )}
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                  <span>Lesson {index + 1}</span>
                  {lesson.unlock_after_days && <span>Unlocks after {lesson.unlock_after_days} days</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="flex sm:hidden gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveLesson(lesson.id, "up")}
                    disabled={index === 0}
                    className="p-1 h-6 w-6"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveLesson(lesson.id, "down")}
                    disabled={index === lessons.length - 1}
                    className="p-1 h-6 w-6"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  {onLessonSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLessonSelect(lesson.id)}
                      className="p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                      title="Manage Sections"
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(lesson)}
                    className="p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLesson(lesson.id)}
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