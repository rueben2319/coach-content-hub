
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Clock, Star, User } from 'lucide-react';
import { usePublishedCourses } from '@/hooks/useClientCourses';
import { Link } from 'react-router-dom';

const BrowseContent = () => {
  const { data: courses = [], isLoading } = usePublishedCourses();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getInstructorName = (coach: any) => {
    if (!coach) return 'Unknown Instructor';
    return `${coach.first_name || ''} ${coach.last_name || ''}`.trim() || 'Unknown Instructor';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Content</h1>
        <p className="text-gray-600 mt-2">Discover new courses and expand your skills</p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="p-4 pb-3">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-green-500 rounded-lg mb-3 flex items-center justify-center">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-white" />
                  )}
                </div>
                <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
                  {course.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>by {getInstructorName(course.coach)}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {course.difficulty_level && (
                    <Badge variant="outline" className="text-xs">
                      {course.difficulty_level}
                    </Badge>
                  )}
                  {course.category && (
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(course.estimated_duration || 0)}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>4.5</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-lg font-bold text-gray-900">
                    {course.currency} {course.price}
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/client/courses/${course.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600">Check back later for new content</p>
        </div>
      )}
    </div>
  );
};

export default BrowseContent;
