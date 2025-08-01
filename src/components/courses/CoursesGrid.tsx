
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Eye, FileText, DollarSign, MoreVertical, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  is_published: boolean;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  image?: string;
  category_id?: string;
  tags: string[] | null;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

interface CoursesGridProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onManageContent: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  onEditCourse,
  onPreviewCourse,
  onManageContent,
  onDeleteCourse,
}) => {
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      onDeleteCourse(courseToDelete);
      setCourseToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setCourseToDelete(null);
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No courses created yet</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Create your first course to start building your coaching business and sharing your expertise with students.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200/75 bg-white"
          >
            {/* Course Thumbnail */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-blue-500/90 to-purple-600/90">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-12 h-12 text-white/90" />
              </div>
              <div className="absolute top-4 right-4">
                <Badge 
                  variant={course.is_published ? "default" : "secondary"} 
                  className={`shadow-sm ${
                    course.is_published 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-white/90 text-slate-700 backdrop-blur-sm"
                  }`}
                >
                  {course.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>

            <CardHeader className="p-6">
              <div className="space-y-3">
                <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  {course.category_id && (
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                      {course.category_id}
                    </Badge>
                  )}
                  {course.difficulty_level && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {course.difficulty_level}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm leading-relaxed text-slate-600 line-clamp-2">
                  {course.short_description || course.description}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="px-6 pb-6 pt-0">
              {/* Course Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      MWK {course.price}
                    </div>
                    {course.pricing_model === 'subscription' && (
                      <div className="text-sm text-slate-500">
                        MWK {course.price}/month
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onManageContent(course)}
                  className="col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Content
                </Button>
                
                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700"
                    >
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onEditCourse(course)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPreviewCourse(course)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Course
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(course)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!courseToDelete} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone and will permanently remove the course and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CoursesGrid;
