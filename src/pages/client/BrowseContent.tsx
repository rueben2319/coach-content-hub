
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Clock, User, Loader2, Play, ChevronRight } from 'lucide-react';
import { usePublishedCourses } from '@/hooks/useClientCourses';
import { Link } from 'react-router-dom';

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
          <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center overflow-hidden">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center text-white">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="absolute top-3 left-3">
                {course.category && (
                  <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-sm">
                    {course.category}
                  </Badge>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-white/50">
                  {course.difficulty_level || 'Beginner'}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {course.title}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <User className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  by {course.coach?.first_name || 'Unknown'} {course.coach?.last_name || 'Coach'}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.estimated_duration || 0} hours</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  <span className="font-medium">4.5</span>
                  <span className="text-gray-400 ml-1">(24)</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold text-gray-900">
                  {course.currency} {course.price}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="group/btn">
                    <Play className="w-3 h-3 mr-1 group-hover/btn:text-blue-600" />
                    Preview
                  </Button>
                  <Button size="sm" asChild className="group/btn bg-blue-600 hover:bg-blue-700">
                    <Link to={`/client/courses/${course.id}`} className="flex items-center">
                      View Course
                      <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses?.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600">Check back soon for new learning opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseContent;
