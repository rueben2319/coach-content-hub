
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MessageSquare, Star, MapPin, Calendar, BookOpen } from 'lucide-react';

const Coaches = () => {
  // Mock coaches data - would normally come from enrolled courses
  const coaches = [
    {
      id: '1',
      first_name: 'Sarah',
      last_name: 'Johnson',
      bio: 'Experienced full-stack developer with 10+ years in the industry. Passionate about teaching modern web technologies.',
      specialties: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      location: 'San Francisco, CA',
      rating: 4.9,
      students: 1250,
      courses: 12,
      avatar_url: null,
      is_available: true
    },
    {
      id: '2',
      first_name: 'Michael',
      last_name: 'Chen',
      bio: 'Data scientist and machine learning expert. Helping students master Python and AI concepts.',
      specialties: ['Python', 'Machine Learning', 'Data Science', 'AI'],
      location: 'New York, NY',
      rating: 4.8,
      students: 890,
      courses: 8,
      avatar_url: null,
      is_available: false
    },
    {
      id: '3',
      first_name: 'Emily',
      last_name: 'Rodriguez',
      bio: 'UX/UI designer with a focus on creating intuitive and beautiful user experiences.',
      specialties: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
      location: 'Austin, TX',
      rating: 4.9,
      students: 650,
      courses: 6,
      avatar_url: null,
      is_available: true
    }
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Coaches</h1>
        <p className="text-gray-600 mt-2">Connect with your instructors and mentors</p>
      </div>

      {coaches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {coaches.map((coach) => (
            <Card key={coach.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {coach.avatar_url ? (
                      <img 
                        src={coach.avatar_url} 
                        alt={`${coach.first_name} ${coach.last_name}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      getInitials(coach.first_name, coach.last_name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl font-semibold line-clamp-1">
                        {coach.first_name} {coach.last_name}
                      </CardTitle>
                      <Badge 
                        variant={coach.is_available ? 'default' : 'secondary'}
                        className="text-xs ml-2"
                      >
                        {coach.is_available ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {coach.rating}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {coach.students}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {coach.courses}
                      </div>
                    </div>
                    
                    {coach.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {coach.location}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3 flex-1">
                  {coach.bio}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-auto">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    disabled={!coach.is_available}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches yet</h3>
          <p className="text-gray-600 mb-4">Enroll in courses to connect with instructors</p>
          <Button>
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default Coaches;
