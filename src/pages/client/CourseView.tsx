
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Award, Download } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/client')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-600 mt-1">by {course.instructor}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Downloads
          </Button>
          <Button variant="outline">
            <Award className="h-4 w-4 mr-2" />
            Certificate
          </Button>
        </div>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Course Progress</span>
            <span className="text-sm font-normal text-gray-600">
              {completedContent.size} of {content.length} lessons completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={getOverallProgress()} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{Math.round(getOverallProgress())}% Complete</span>
              <span>{formatDuration(course.duration)} total duration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Player */}
      {content.length > 0 ? (
        <CoursePlayer
          courseId={courseId}
          content={content}
          initialContentId={currentContentId}
          onProgressUpdate={handleProgressUpdate}
        />
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No content available for this course</p>
          </CardContent>
        </Card>
      )}

      {/* Course Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            About This Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {course.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseView;
