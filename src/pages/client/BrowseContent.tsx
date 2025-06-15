
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Clock, User } from 'lucide-react';

const BrowseContent = () => {
  console.log('New BrowseContent component rendering');

  // Sample course data for now
  const sampleCourses = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      instructor: 'John Doe',
      duration: '4 hours',
      rating: 4.5,
      price: 'MWK 15,000',
      category: 'Programming'
    },
    {
      id: '2',
      title: 'Digital Marketing Fundamentals',
      description: 'Master the essentials of online marketing',
      instructor: 'Jane Smith',
      duration: '3 hours',
      rating: 4.8,
      price: 'MWK 12,000',
      category: 'Marketing'
    },
    {
      id: '3',
      title: 'Graphic Design Basics',
      description: 'Create stunning visuals with design principles',
      instructor: 'Mike Johnson',
      duration: '5 hours',
      rating: 4.6,
      price: 'MWK 18,000',
      category: 'Design'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Content</h1>
        <p className="text-gray-600">Discover courses and expand your knowledge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" />
                <span>by {course.instructor}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                  <span className="font-medium">{course.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  {course.price}
                </div>
                <Button size="sm">
                  View Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sampleCourses.length === 0 && (
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
