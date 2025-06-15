
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
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">My Coaches</h1>
        <p className="text-lg text-muted-foreground">Connect with your instructors and mentors for personalized guidance</p>
      </div>

      {coaches.length > 0 ? (
        <div className="three-column-grid">
          {coaches.map((coach) => (
            <Card key={coach.id} className="card-interactive card-soft h-full flex flex-col group">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
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
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <CardTitle className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {coach.first_name} {coach.last_name}
                      </CardTitle>
                      <Badge 
                        variant={coach.is_available ? 'default' : 'secondary'}
                        className={`text-xs font-medium ${
                          coach.is_available 
                            ? "status-success" 
                            : "bg-secondary-100 text-secondary-700 border border-secondary-200"
                        }`}
                      >
                        {coach.is_available ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-4 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1.5 text-warning-500 fill-current" />
                        <span className="font-medium">{coach.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1.5" />
                        <span className="font-medium">{coach.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1.5" />
                        <span className="font-medium">{coach.courses}</span>
                      </div>
                    </div>
                    
                    {coach.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="font-medium">{coach.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col pt-0">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3 flex-1">
                  {coach.bio}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs font-medium border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button 
                    size="sm" 
                    disabled={!coach.is_available}
                    className="touch-target transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="touch-target border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">No coaches yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Enroll in courses to connect with expert instructors who can guide your learning journey.
          </p>
          <Button className="touch-target bg-primary hover:bg-primary-600 transition-colors">
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default Coaches;
