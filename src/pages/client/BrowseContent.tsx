
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Clock, Star, User } from 'lucide-react';
import { usePublishedCourses } from '@/hooks/useClientCourses';
import { Link } from 'react-router-dom';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { CourseCardSkeleton } from '@/components/ui/course-card-skeleton';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { InteractiveButton } from '@/components/ui/interactive-button';

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
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Browse Content</h1>
          <p className="text-lg text-muted-foreground">Discover new courses and expand your skills with expert-led content</p>
        </div>
        <div className="cards-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Browse Content</h1>
        <p className="text-lg text-muted-foreground">Discover new courses and expand your skills with expert-led content</p>
      </div>

      {courses.length > 0 ? (
        <div className="cards-grid">
          {courses.map((course) => (
            <EnhancedCard key={course.id} interactive className="h-full flex flex-col">
              <CardHeader className="p-4 pb-3">
                <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-white transition-transform duration-300 group-hover:scale-110" />
                  )}
                </div>
                <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">by {getInstructorName(course.coach)}</span>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {course.difficulty_level && (
                    <Badge variant="outline" className="text-xs font-medium border-warning-200 text-warning-700 transition-colors hover:bg-warning-50">
                      {course.difficulty_level}
                    </Badge>
                  )}
                  {course.category && (
                    <Badge variant="secondary" className="text-xs font-medium bg-secondary-100 text-secondary-700 border border-secondary-200 transition-colors hover:bg-secondary-200">
                      {course.category}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span className="font-medium">{formatDuration(course.estimated_duration || 0)}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-warning-500 fill-current" />
                    <span className="font-medium text-foreground">4.5</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                  <div className="text-xl font-bold text-foreground">
                    {course.currency} {course.price}
                  </div>
                  <InteractiveButton size="sm" icon={Play} asChild>
                    <Link to={`/client/courses/${course.id}`}>
                      View Course
                    </Link>
                  </InteractiveButton>
                </div>
              </CardContent>
            </EnhancedCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-105">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">No courses available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working on adding amazing courses for you. Check back soon for new learning opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default BrowseContent;
