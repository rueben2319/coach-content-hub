
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, FileText, DollarSign } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description: string;
  is_published: boolean;
  pricing_model: 'one_time' | 'subscription';
  price: number;
  subscription_price: number | null;
  currency: string;
  category: string;
  tags: string[] | null;
  estimated_duration: number;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

interface CoursesGridProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onPreviewCourse: (course: Course) => void;
  onManageContent: (course: Course) => void;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  onEditCourse,
  onPreviewCourse,
  onManageContent,
}) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No courses created yet</p>
        <p className="text-sm text-gray-400">
          Create your first course to start building your coaching business
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-lg line-clamp-2 flex-1">{course.title}</CardTitle>
              <Badge variant={course.is_published ? "default" : "secondary"} className="ml-2">
                {course.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardDescription className="line-clamp-3 text-sm">
              {course.short_description || course.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span className="line-clamp-1">
                {course.price} {course.currency}
                {course.pricing_model === 'subscription' && course.subscription_price && (
                  <span> / {course.subscription_price} {course.currency}/mo</span>
                )}
              </span>
            </div>

            {course.category && (
              <Badge variant="outline" className="text-xs w-fit">
                {course.category}
              </Badge>
            )}

            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCourse(course)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreviewCourse(course)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManageContent(course)}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-1" />
                Manage Content
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoursesGrid;
