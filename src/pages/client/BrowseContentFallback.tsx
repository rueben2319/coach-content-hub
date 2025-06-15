
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BrowseContentFallback: React.FC = () => {
  console.log('BrowseContentFallback component rendering');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Content</h1>
          <p className="text-gray-600 mt-1">Discover courses and learning materials</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input placeholder="Search courses, topics, or instructors..." />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Sample Course {item}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This is a sample course description for debugging purposes.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">12 lessons</span>
                <Button size="sm">View Course</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Debug Info */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700">
            This is a fallback component for the Browse Content page. 
            The original BrowseContent component might be having issues.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseContentFallback;
