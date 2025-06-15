
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
    <div className="cards-grid">
      {courses.map((course) => (
        <Card 
          key={course.id} 
          className="card-interactive card-soft h-full flex flex-col group"
        >
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-3 mb-3">
              <CardTitle className="text-lg font-semibold line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              <Badge 
                variant={course.is_published ? "default" : "secondary"} 
                className={`text-xs font-medium ${
                  course.is_published 
                    ? "status-success" 
                    : "bg-secondary-100 text-secondary-700 border border-secondary-200"
                }`}
              >
                {course.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
              {course.short_description || course.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4 pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1 font-medium">
                {course.currency} {course.price}
                {course.pricing_model === 'subscription' && course.subscription_price && (
                  <span className="text-xs ml-1">/ {course.subscription_price} {course.currency}/mo</span>
                )}
              </span>
            </div>

            {course.category && (
              <Badge variant="outline" className="text-xs w-fit font-medium border-primary-200 text-primary-700">
                {course.category}
              </Badge>
            )}

            <div className="flex flex-col gap-3 mt-auto pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCourse(course)}
                  className="touch-target border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreviewCourse(course)}
                  className="touch-target border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  Preview
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManageContent(course)}
                className="w-full touch-target border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
              >
                <FileText className="h-4 w-4 mr-1.5" />
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
