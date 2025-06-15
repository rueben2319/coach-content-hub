
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Clock, User, Loader2 } from 'lucide-react';
import { usePublishedCourses } from '@/hooks/useClientCourses';

const BrowseContent = () => {
  console.log('BrowseContent component rendering');

  const { data: courses, isLoading, error } = usePublishedCourses();

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Content</h1>
          <p className="text-gray-600">Discover courses and expand your knowledge</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Content</h1>
          <p className="text-gray-600">Discover courses and expand your knowledge</p>
        </div>
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">Error loading courses</div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Content</h1>
        <p className="text-gray-600">Discover courses and expand your knowledge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
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
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" />
                <span>
                  by {course.coach?.first_name || 'Unknown'} {course.coach?.last_name || 'Coach'}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.estimated_duration || 0} hours</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  <span className="font-medium">4.5</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  {course.currency} {course.price}
                </div>
                <Button size="sm">
                  View Course
                </Button>
              </div>

              {course.category && (
                <div className="mt-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {courses?.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600">Check back soon for new learning opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseContent;
