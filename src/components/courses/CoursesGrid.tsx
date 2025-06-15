
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              <Badge variant={course.is_published ? "default" : "secondary"}>
                {course.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {course.short_description || course.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>
                {course.price} {course.currency}
                {course.pricing_model === 'subscription' && course.subscription_price && (
                  <span> / {course.subscription_price} {course.currency}/mo</span>
                )}
              </span>
            </div>

            {course.category && (
              <Badge variant="outline" className="text-xs">
                {course.category}
              </Badge>
            )}

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManageContent(course)}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-1" />
                Content
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoursesGrid;
