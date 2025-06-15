
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Award, Download, Play, Clock, FileText, Video, Music, Image } from 'lucide-react';
import CoursePlayer from '@/components/courses/CoursePlayer';
import { useCourseProgress, useUpdateProgress } from '@/hooks/useCourseProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchCourseContent } from '@/components/courses/courseContentApi';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
  currency: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  client_id: string;
  enrolled_at: string;
  payment_status: string;
}

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentContentId, setCurrentContentId] = useState<string | undefined>();
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [enrollmentId, setEnrollmentId] = useState<string>('');
  const [showPlayer, setShowPlayer] = useState(false);

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('No course ID');
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          estimated_duration,
          price,
          currency,
          profiles!coach_id (
            first_name,
            last_name
          )
        `)
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      
      const instructor = data.profiles 
        ? `${data.profiles.first_name || ''} ${data.profiles.last_name || ''}`.trim()
        : 'Unknown Instructor';
      
      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        instructor,
        duration: data.estimated_duration || 0,
        price: data.price,
        currency: data.currency
      } as Course;
    },
    enabled: !!courseId,
  });

  // Fetch enrollment data
  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', courseId, user?.id],
    queryFn: async () => {
      if (!courseId || !user?.id) throw new Error('Missing data');
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('client_id', user.id)
        .single();
      
      if (error) throw error;
      return data as Enrollment;
    },
    enabled: !!courseId && !!user?.id,
  });

  // Fetch course content
  const { data: content = [] } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: () => fetchCourseContent(courseId!),
    enabled: !!courseId,
  });

  // Set enrollment ID when enrollment data is available
  useEffect(() => {
    if (enrollment) {
      setEnrollmentId(enrollment.id);
    }
  }, [enrollment]);

  const { data: progressData } = useCourseProgress(enrollmentId);
  const updateProgressMutation = useUpdateProgress();

  useEffect(() => {
    if (progressData) {
      const completed = new Set(
        progressData
          .filter(p => p.completed)
          .map(p => p.content_id)
      );
      setCompletedContent(completed);
    }
  }, [progressData]);

  const handleProgressUpdate = (contentId: string, progress: number, completed: boolean) => {
    if (!enrollmentId) return;

    updateProgressMutation.mutate({
      content_id: contentId,
      enrollment_id: enrollmentId,
      progress_percentage: Math.round(progress),
      completed,
      completed_at: completed ? new Date().toISOString() : undefined,
      time_spent: 0,
    });

    if (completed && !completedContent.has(contentId)) {
      setCompletedContent(prev => new Set(prev).add(contentId));
      
      const totalContent = content.length;
      const completedCount = completedContent.size + 1;
      
      if (completedCount === totalContent) {
        toast({
          title: 'Congratulations! 🎉',
          description: 'You have completed the entire course!',
        });
      }
    }
  };

  const getOverallProgress = () => {
    if (content.length === 0) return 0;
    return (completedContent.size / content.length) * 100;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleStartContent = (contentId: string) => {
    setCurrentContentId(contentId);
    setShowPlayer(true);
  };

  if (!courseId) {
    return <div>Course not found</div>;
  }

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/client')}
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                  {course.title}
                </h1>
                <p className="text-gray-600 mt-1">by {course.instructor}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Downloads
              </Button>
              <Button variant="outline" size="sm">
                <Award className="h-4 w-4 mr-2" />
                Certificate
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Info & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={getOverallProgress()} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {Math.round(getOverallProgress())}% Complete
                    </span>
                    <span className="text-gray-500">
                      {completedContent.size} of {content.length}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(course.duration)} total
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Course Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Player */}
            {showPlayer && content.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <CoursePlayer
                  courseId={courseId}
                  content={content}
                  initialContentId={currentContentId}
                  onProgressUpdate={handleProgressUpdate}
                />
              </div>
            )}

            {/* Course Content List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Content
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {content.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {content.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 flex-shrink-0">
                              <span className="text-sm font-medium text-gray-700">
                                {index + 1}
                              </span>
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                {getContentIcon(item.content_type)}
                                <h4 className="font-medium text-gray-900 truncate">
                                  {item.title}
                                </h4>
                              </div>
                              
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.content_type}
                                </Badge>
                                {item.duration && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {item.duration} min
                                  </div>
                                )}
                                {item.is_preview && (
                                  <Badge variant="secondary" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                                {completedContent.has(item.id) && (
                                  <Badge className="text-xs bg-green-500">
                                    ✓ Completed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleStartContent(item.id)}
                              variant={completedContent.has(item.id) ? "outline" : "default"}
                              className="min-w-[80px]"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {completedContent.has(item.id) ? 'Review' : 'Start'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No content available
                    </h3>
                    <p className="text-gray-600">
                      This course doesn't have any content yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
