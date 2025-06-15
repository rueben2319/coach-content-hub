
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

// Mock data - replace with actual data fetching
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  description: 'Learn full-stack web development from scratch',
  instructor: 'John Doe',
  duration: 1200, // minutes
  enrollmentId: 'enroll_123'
};

const mockContent = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    content_type: 'video' as const,
    content_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    duration: 300,
    sort_order: 1,
    is_preview: true
  },
  {
    id: '2',
    title: 'HTML Fundamentals',
    content_type: 'video' as const,
    content_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    duration: 600,
    sort_order: 2,
    is_preview: false
  },
  {
    id: '3',
    title: 'CSS Styling Guide',
    content_type: 'text' as const,
    content_text: '<h2>CSS Basics</h2><p>CSS (Cascading Style Sheets) is used to style HTML elements...</p>',
    duration: 0,
    sort_order: 3,
    is_preview: false
  },
  {
    id: '4',
    title: 'JavaScript Introduction',
    content_type: 'audio' as const,
    content_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 450,
    sort_order: 4,
    is_preview: false
  }
];

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentContentId, setCurrentContentId] = useState<string | undefined>();
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  
  // In a real app, you'd fetch the enrollment ID based on user and course
  const { data: progressData } = useCourseProgress(mockCourse.enrollmentId);
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
    updateProgressMutation.mutate({
      content_id: contentId,
      enrollment_id: mockCourse.enrollmentId,
      progress_percentage: Math.round(progress),
      completed,
      completed_at: completed ? new Date().toISOString() : undefined,
      time_spent: 0, // This should be calculated based on actual viewing time
    });

    if (completed && !completedContent.has(contentId)) {
      setCompletedContent(prev => new Set(prev).add(contentId));
      
      // Check if course is fully completed
      const totalContent = mockContent.length;
      const completedCount = completedContent.size + 1; // +1 for the newly completed content
      
      if (completedCount === totalContent) {
        toast({
          title: 'Congratulations! 🎉',
          description: 'You have completed the entire course!',
        });
        // Here you could trigger certificate generation
      }
    }
  };

  const getOverallProgress = () => {
    return (completedContent.size / mockContent.length) * 100;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!courseId) {
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
            onClick={() => navigate('/client/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{mockCourse.title}</h1>
            <p className="text-gray-600 mt-1">by {mockCourse.instructor}</p>
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
              {completedContent.size} of {mockContent.length} lessons completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={getOverallProgress()} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{Math.round(getOverallProgress())}% Complete</span>
              <span>{formatDuration(mockCourse.duration)} total duration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Player */}
      <CoursePlayer
        courseId={courseId}
        content={mockContent}
        initialContentId={currentContentId}
        onProgressUpdate={handleProgressUpdate}
      />

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
            {mockCourse.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseView;
