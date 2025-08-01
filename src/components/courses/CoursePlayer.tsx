
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, BookOpen, Download, FileText } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import ContentViewer from './ContentViewer';
import NotesPanel from '../notes/NotesPanel';
import LessonNavigator from './LessonNavigator';
import { useToast } from '@/hooks/use-toast';
import { Module } from './courseContentApi';

interface CoursePlayerProps {
  courseId: string;
  content: Module[];
  initialContentId?: string;
  onProgressUpdate: (contentId: string, progress: number, completed: boolean) => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({
  courseId,
  content,
  initialContentId,
  onProgressUpdate
}) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const currentContent = content[currentContentIndex];

  useEffect(() => {
    if (initialContentId) {
      const index = content.findIndex(c => c.id === initialContentId);
      if (index !== -1) {
        setCurrentContentIndex(index);
      }
    }
  }, [initialContentId, content]);

  const handleProgressUpdate = (progress: number, completed: boolean) => {
    if (currentContent) {
      onProgressUpdate(currentContent.id, progress, completed);
      
      if (completed && !completedContent.has(currentContent.id)) {
        setCompletedContent(prev => new Set(prev).add(currentContent.id));
        toast({
          title: 'Lesson Complete!',
          description: `You've completed "${currentContent.title}"`,
        });
      }
    }
  };

  const canAccessContent = (index: number) => {
    if (index === 0) return true;
    // For now, allow access to all content during transition
    return true;
  };

  const navigateToContent = (index: number) => {
    if (canAccessContent(index)) {
      setCurrentContentIndex(index);
    } else {
      toast({
        title: 'Content Locked',
        description: 'Please complete previous lessons to unlock this content.',
        variant: 'destructive',
      });
    }
  };

  const renderContentPlayer = () => {
    if (!currentContent) return null;

    // Show a simple module overview for now
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{currentContent.title}</h3>
        {currentContent.description && (
          <p className="text-gray-700 mb-4">{currentContent.description}</p>
        )}
        <div className="text-sm text-gray-500">
          This is a course module. Individual lessons will be added to this module.
        </div>
      </div>
    );
  };

  if (!currentContent) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No content available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Course Navigation */}
      <div className="lg:col-span-1">
        <LessonNavigator
          content={content}
          currentIndex={currentContentIndex}
          completedContent={completedContent}
          onNavigate={navigateToContent}
          canAccessContent={canAccessContent}
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{currentContent.title}</h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Notes
                </Button>
                 <Button variant="outline" size="sm" disabled>
                   <Download className="h-4 w-4 mr-2" />
                   Download
                 </Button>
              </div>
            </div>

            {/* Content Player */}
            <div className="mb-6">
              {renderContentPlayer()}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigateToContent(currentContentIndex - 1)}
                disabled={currentContentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-gray-600">
                {currentContentIndex + 1} of {content.length}
              </div>

              <Button
                variant="outline"
                onClick={() => navigateToContent(currentContentIndex + 1)}
                disabled={currentContentIndex === content.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes Panel */}
        {showNotes && (
           <NotesPanel
             courseId={courseId}
             contentId={currentContent.id}
             contentType="text"
           />
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
